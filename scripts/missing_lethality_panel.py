"""Static, accessible MICE-style diagnostic panel from frozen synthetic data."""
import json
import math


def build_panel(root, text, line, path, dot, table):
    data = json.loads((root / 'assets/data/missing-lethality-mice-demo.json').read_text())
    if data['m'] != 5 or data['iterations'] != 20 or data['n'] != 180:
        raise ValueError('Review the panel geometry before changing the demonstration size.')
    records, chains, pooled = data['observed_records'], data['chains'], data['pooled']
    s = text(24, 26, 'A  Missingness patterns', 'st-subtitle')
    s += text(532, 26, '180 synthetic records', 'st-tick', 'end')
    s += text(132, 48, 'First 24 records', 'st-tick')
    s += text(536, 48, 'NA %', 'st-tick', 'end')
    missing_counts = []
    for row, variable in enumerate(data['variables']):
        y = 59 + row * 19
        nmissing = sum(record[row] is None for record in records)
        missing_counts.append(nmissing)
        s += text(24, y + 12, variable, 'st-label')
        for column, record in enumerate(records[:24]):
            x = 132 + column * 15
            absent = record[row] is None
            cls = 'mi-missing' if absent else 'mi-observed'
            label = f'Record {column + 1}, {variable}: ' + ('missing' if absent else 'observed')
            s += f'<g class="mi-cell" data-missing="{str(absent).lower()}"><title>{label}</title><rect x="{x}" y="{y}" width="12" height="13" rx="1" class="{cls}"/>'
            if absent:
                s += line(x + 3, y + 10, x + 9, y + 3, 'mi-hatch')
            s += '</g>'
        s += text(536, y + 12, f'{100 * nmissing / len(records):.0f}%', 'st-value', 'end')
    s += '<rect x="132" y="141" width="12" height="12" class="mi-observed"/>'
    s += text(152, 152, 'Observed', 'st-tick')
    s += '<rect x="248" y="141" width="12" height="12" class="mi-missing"/>' + line(251, 150, 257, 143, 'mi-hatch')
    s += text(268, 152, 'Missing', 'st-tick') + text(536, 152, 'NA %: all records', 'st-tick', 'end')
    s += line(24, 165, 536, 165)

    s += text(24, 190, 'B  Imputation-chain diagnostics', 'st-subtitle')
    for field, left, right, label in [(1, 64, 250, 'Imputed mean'), (2, 344, 530, 'Imputed SD')]:
        top, bottom = 223, 301
        fx = lambda v: left + (v - 1) / 19 * (right - left)
        fy = lambda v: bottom - v / 4 * (bottom - top)
        s += text(left, 214, label, 'st-label')
        for v in [0, 2, 4]:
            s += line(left, fy(v), right, fy(v)) + text(left - 9, fy(v) + 5, v, 'st-tick', 'end')
        for v in [1, 10, 20]:
            s += line(fx(v), top, fx(v), bottom) + text(fx(v), 320, v, 'st-tick', 'middle')
        s += line(left, bottom, right, bottom, 'st-axis')
        for chain in chains:
            cls = f'st-series mi-trace mi-chain-{chain["chain"]}'
            s += f'<g data-mi-trace="{label}-{chain["chain"]}"><title>{label}, imputation {chain["chain"]}; deaths in missing cells only</title>'
            s += path([(fx(point[0]), fy(point[field])) for point in chain['trace']], cls) + '</g>'
        s += text((left + right) / 2, 341, 'Iteration', 'st-tick', 'middle')
    for chain in chains:
        x = 59 + (chain['chain'] - 1) * 94
        s += line(x, 362, x + 21, 362, f'st-series mi-trace mi-chain-{chain["chain"]}')
        s += text(x + 28, 367, f'Chain {chain["chain"]}', 'st-tick')
    s += line(24, 383, 536, 383)

    s += text(24, 409, 'C  Pool estimates, not filled-in records', 'st-subtitle')
    fx = lambda v: 132 + (v - 1.5) / 1.6 * 370
    for v in [1.5, 2, 2.5, 3]:
        s += line(fx(v), 426, fx(v), 574)
        s += text(fx(v), 594, f'{v:g}', 'st-tick', 'middle')
    s += line(fx(pooled['estimate']), 426, fx(pooled['estimate']), 574, 'st-reference')
    rows = []
    for i, chain in enumerate(chains):
        y = 437 + i * 21
        cls = f' mi-chain-{chain["chain"]}'
        s += text(24, y + 5, f'Imputation {chain["chain"]}', 'st-label')
        s += f'<g data-mi-estimate="{chain["chain"]}">'
        s += line(fx(chain['lower']), y, fx(chain['upper']), y, 'st-series mi-trace' + cls)
        s += dot(fx(chain['estimate']), y, 'st-point mi-point' + cls)
        s += text(536, y + 5, f'{chain["estimate"]:.2f}', 'st-value', 'end') + '</g>'
        rows.append([str(chain['chain']), f'{chain["estimate"]:.3f}', f'{math.sqrt(chain["variance"]):.3f}', f'{chain["lower"]:.3f}', f'{chain["upper"]:.3f}'])
    y = 558
    s += text(24, y + 5, 'Rubin pooled', 'st-label')
    s += line(fx(pooled['lower']), y, fx(pooled['upper']), y, 'st-series mi-pooled-line')
    x = fx(pooled['estimate'])
    s += path([(x - 7, y), (x, y - 7), (x + 7, y), (x, y + 7)], 'mi-pooled', True)
    s += text(536, y + 5, f'{pooled["estimate"]:.2f}', 'st-value', 'end')
    s += line(132, 574, 502, 574, 'st-axis')
    s += text(280, 620, 'Mean deaths per synthetic event · 95% intervals', 'st-label', 'middle')
    rows.append(['Pooled', f'{pooled["estimate"]:.3f}', f'{math.sqrt(pooled["total"]):.3f}', f'{pooled["lower"]:.3f}', f'{pooled["upper"]:.3f}'])
    assumptions = ('Seed 20261006; 180 fictional events; deaths and injuries are incomplete. '
                   'Missingness depends only on the observed reporting index (MAR by construction). '
                   'Five independently initialized chains run 20 iterations of fully conditional specification '
                   'with five-donor predictive mean matching. Conditional predictions use log1p counts. '
                   'This small Python demonstration is not output from the R mice package or the study.')
    detail = ('<p>' + assumptions + '</p>'
              f'<p>Deaths: {missing_counts[0]}/180 missing; injuries: {missing_counts[1]}/180 missing. '
              'The matrix shows the first 24 records; percentages use all 180. Chain plots summarize '
              'only imputed death values, not observed values. Intermingling is a diagnostic—not proof of convergence or a valid missingness assumption.</p>'
              '<p>For the mean across all 180 events, combine estimates Q and their sampling variances U: '
              '<code>T = mean(U) + (1 + 1/m) × var(Q)</code>. '
              'Individual intervals use 179 degrees of freedom; the pooled 95% t interval uses the Barnard–Rubin adjustment. '
              f'Within-imputation variance = {pooled["within"]:.5f}; between-imputation variance = {pooled["between"]:.5f}; '
              f'total variance = {pooled["total"]:.5f}.</p>' +
              table(['Imputation', 'Mean', 'SE', 'Lower 95%', 'Upper 95%'], rows, 'Synthetic imputation estimates and Rubin pooling') +
              '<p><a href="assets/data/missing-lethality-mice-demo.json" download>Download records, chains &amp; estimates (JSON)</a> · '
              '<a href="https://github.com/LystadJS/LystadJS.github.io/blob/main/scripts/generate_missing_lethality_demo.py">Reproduction script</a></p>'
              '<p>Method references: <a href="https://amices.org/mice/reference/plot.mids.html">MICE trace diagnostics</a> · '
              '<a href="https://amices.org/mice/reference/mice.impute.pmm.html">Predictive mean matching</a> · '
              '<a href="https://amices.org/mice/reference/pool.scalar.html">Rubin pooling</a>. '
              'Five chains and twenty iterations are display choices, not an adequacy recommendation.</p>')
    metadata = {'status': data['status'], 'assumptions': assumptions,
                'columns': ['Imputation', 'Mean', 'SE', 'Lower 95%', 'Upper 95%'], 'values': rows,
                'diagnostics': 'assets/data/missing-lethality-mice-demo.json'}
    return s, detail, metadata
