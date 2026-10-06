"""Verify missingness, donor support, diagnostic statistics, and Rubin pooling."""
import json
import math
from pathlib import Path
from statistics import mean, variance, stdev
import unittest

ROOT = Path(__file__).resolve().parents[1]

class MissingLethality(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads((ROOT / 'assets/data/missing-lethality-mice-demo.json').read_text())

    def test_observed_records_and_pmm_donor_support(self):
        d = self.data
        self.assertIn('not empirical', d['status'])
        self.assertIn('not R mice', d['method'])
        self.assertEqual(d['n'], len(d['observed_records']))
        self.assertEqual([sum(row[j] is None for row in d['observed_records']) for j in range(4)], [65, 51, 0, 0])
        for chain in d['chains']:
            self.assertEqual(len(chain['completed_counts']), d['n'])
            for j in (0, 1):
                donors = {row[j] for row in d['observed_records'] if row[j] is not None}
                for original, completed in zip(d['observed_records'], chain['completed_counts']):
                    self.assertGreaterEqual(completed[j], 0)
                    self.assertIsInstance(completed[j], int)
                    if original[j] is not None:
                        self.assertEqual(original[j], completed[j])
                    else:
                        self.assertIn(completed[j], donors)

    def test_chain_statistics_are_imputed_only(self):
        d = self.data
        self.assertEqual(len(d['chains']), d['m'])
        for chain in d['chains']:
            self.assertEqual([p[0] for p in chain['trace']], list(range(1, 21)))
            self.assertTrue(all(math.isfinite(v) and 0 <= v <= 4 for p in chain['trace'] for v in p[1:]))
            imputed = [row[0] for row, observed in zip(chain['completed_counts'], d['observed_records']) if observed[0] is None]
            self.assertAlmostEqual(chain['trace'][-1][1], mean(imputed))
            self.assertAlmostEqual(chain['trace'][-1][2], stdev(imputed))
            all_deaths = [row[0] for row in chain['completed_counts']]
            self.assertAlmostEqual(chain['estimate'], mean(all_deaths))
            self.assertAlmostEqual(chain['variance'], variance(all_deaths) / d['n'])

    def test_pooling_carries_between_imputation_variance(self):
        d = self.data
        q = [c['estimate'] for c in d['chains']]
        ubar = mean(c['variance'] for c in d['chains'])
        b = variance(q)
        total = ubar + (1 + 1 / d['m']) * b
        pool = d['pooled']
        self.assertAlmostEqual(pool['estimate'], mean(q))
        self.assertAlmostEqual(pool['within'], ubar)
        self.assertAlmostEqual(pool['between'], b)
        self.assertAlmostEqual(pool['total'], total)
        self.assertGreater(total, ubar)
        lam = max((1 + 1 / d['m']) * b / total, 1e-4)
        old = (d['m'] - 1) / lam ** 2
        observed = d['n'] / (d['n'] + 2) * (d['n'] - 1) * (1 - lam)
        self.assertAlmostEqual(pool['df'], old * observed / (old + observed))
        self.assertLess(pool['lower'], pool['estimate'])
        self.assertGreater(pool['upper'], pool['estimate'])
        self.assertAlmostEqual(pool['upper'] - pool['estimate'], pool['estimate'] - pool['lower'])

if __name__ == '__main__':
    unittest.main()
