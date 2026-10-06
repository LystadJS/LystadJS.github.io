#!/usr/bin/env python3
"""Generate a seeded, synthetic chained-equations / PMM demonstration.

Not project data, and not output from the R mice package. This small Python
implementation explains its diagnostic grammar; it is not a general imputer.
Reproduce: python3 -m pip install numpy==2.3.5 scipy==1.17.0
           python3 scripts/generate_missing_lethality_demo.py
           python3 scripts/build_research_figures.py
"""
from pathlib import Path
import json
import numpy as np
from scipy.stats import t

ROOT = Path(__file__).resolve().parents[1]
SEED, N, M, ITERATIONS, DONORS = 20261006, 180, 5, 20, 5


def generate():
    rng = np.random.default_rng(SEED)
    reporting = rng.normal(size=N)
    attack_type = rng.binomial(1, .35, size=N)
    shared = rng.normal(0, .45, size=N)
    deaths = rng.poisson(np.exp(.65 + .45 * attack_type + .2 * reporting + shared))
    injuries = rng.poisson(np.exp(1.15 + .3 * attack_type + .25 * reporting + shared))
    complete = np.column_stack([deaths, injuries, attack_type, reporting]).astype(float)
    # MAR by construction: missingness depends on fully observed reporting only.
    missing = np.zeros((N, 4), dtype=bool)
    missing[:, 0] = rng.random(N) < 1 / (1 + np.exp(.45 + .8 * reporting))
    missing[:, 1] = rng.random(N) < 1 / (1 + np.exp(.85 + .65 * reporting))
    chains = []
    for chain in range(M):
        r = np.random.default_rng(SEED + 100 + chain)
        current = complete.copy()
        for col in (0, 1):
            current[missing[:, col], col] = r.choice(complete[~missing[:, col], col], missing[:, col].sum())
        traces = []
        for iteration in range(1, ITERATIONS + 1):
            for col in (0, 1):
                observed = ~missing[:, col]
                other = 1 - col
                X = np.column_stack([np.ones(N), np.log1p(current[:, other]), attack_type, reporting])
                Xo = X[observed]
                yo = np.log1p(complete[observed, col])
                assert np.linalg.matrix_rank(Xo) == Xo.shape[1]
                inv = np.linalg.inv(Xo.T @ Xo)
                beta = inv @ Xo.T @ yo
                residual = yo - Xo @ beta
                sigma = np.sqrt((residual @ residual) / r.chisquare(len(yo) - Xo.shape[1]))
                draw = beta + sigma * np.linalg.cholesky(inv) @ r.normal(size=Xo.shape[1])
                # Type-1 predictive mean matching: observed fitted predictions
                # are matched to missing-case predictions using a parameter draw.
                distance = np.abs((X[~observed] @ draw)[:, None] - (Xo @ beta)[None, :])
                candidates = np.argsort(distance, axis=1, kind='stable')[:, :DONORS]
                donor = candidates[np.arange(len(candidates)), r.integers(DONORS, size=len(candidates))]
                current[~observed, col] = complete[observed, col][donor]
            imputed = current[missing[:, 0], 0]
            traces.append([iteration, float(imputed.mean()), float(imputed.std(ddof=1))])
        assert np.array_equal(current[~missing], complete[~missing])
        q = float(current[:, 0].mean())
        u = float(current[:, 0].var(ddof=1) / N)
        radius = float(t.ppf(.975, N - 1) * np.sqrt(u))
        chains.append({'chain': chain + 1, 'trace': traces,
                       'completed_counts': current[:, :2].astype(int).tolist(),
                       'estimate': q, 'variance': u, 'lower': q - radius, 'upper': q + radius})
    estimates = np.array([z['estimate'] for z in chains])
    within = float(np.mean([z['variance'] for z in chains]))
    between = float(estimates.var(ddof=1))
    total = within + (1 + 1 / M) * between
    lam = max((1 + 1 / M) * between / total, 1e-4)
    dfold = (M - 1) / lam ** 2
    dfobs = ((N - 1 + 1) / (N - 1 + 3)) * (N - 1) * (1 - lam)
    df = dfold * dfobs / (dfold + dfobs)
    qbar = float(estimates.mean())
    radius = float(t.ppf(.975, df) * np.sqrt(total))
    data = {'status': 'Synthetic method demonstration; not empirical project results',
            'method': 'Fully conditional specification with log1p linear prediction and type-1 predictive mean matching. Python demonstration; not R mice output.',
            'seed': SEED, 'n': N, 'm': M, 'iterations': ITERATIONS, 'donors': DONORS,
            'variables': ['Deaths', 'Injuries', 'Attack type', 'Reporting'],
            'observed_records': [[None if missing[i, j] else float(complete[i, j]) for j in range(4)] for i in range(N)],
            'preview_records': list(range(1, 25)),
            'chains': chains,
            'pooled': {'estimate': qbar, 'within': within, 'between': between, 'total': total,
                       'df': df, 'lower': qbar - radius, 'upper': qbar + radius},
            'intervals': 'Approximate 95% t intervals for the complete-dataset mean; pooled interval uses Rubin total variance and Barnard-Rubin degrees of freedom.',
            'limitations': 'Five chains and twenty iterations are a display example, not an adequacy recommendation. Mixing alone does not establish convergence, MAR, or validity. No empirical estimate or recovered true casualty count is claimed.',
            'references': ['https://amices.org/mice/reference/plot.mids.html',
                           'https://amices.org/mice/reference/mice.impute.pmm.html',
                           'https://amices.org/mice/reference/pool.scalar.html']}
    destination = ROOT / 'assets/data/missing-lethality-mice-demo.json'
    destination.write_text(json.dumps(data, separators=(',', ':'), allow_nan=False) + '\n', encoding='utf-8')
    print(f'Generated {M} chains × {ITERATIONS} iterations from {N} fictional records.')
    print('Missing counts:', missing.sum(axis=0).tolist(), 'Pooled:', data['pooled'])


if __name__ == '__main__':
    generate()
