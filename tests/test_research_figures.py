"""Regression tests for provenance, quantitative inputs and static generation."""
from pathlib import Path
import json
import math
import subprocess
import sys
import unittest
ROOT = Path(__file__).resolve().parents[1]

class ResearchFigures(unittest.TestCase):
    def test_source_labels_and_bounds(self):
        source = json.loads((ROOT/'assets/data/ethnosectarian-figure4.json').read_text())
        self.assertEqual(source['blob'], '50234d6834e6c9c4db4508182968d2ab35f8b7ff')
        rows = source['records']
        self.assertEqual(len(rows), 27)
        expected = {
            'civilian': ['63%','62%','57%','58%','57%','51%','50%','49%','44%'],
            'religious': ['9%','12%','6%','3%','4%','2%','3%','3%','2%'],
            'observed': ['74%','54%','56%','51%','59%','51%','44%','47%','45%']
        }
        for metric, labels in expected.items():
            subset = [r for r in rows if r['metric'] == metric]
            self.assertEqual([r['label'] for r in subset], labels)
            for row in subset:
                self.assertTrue(0 <= row['estimate'] <= 1)
                self.assertEqual(f"{row['estimate']:.0%}", row['label'])
                if metric != 'observed':
                    self.assertTrue(0 <= row['lower'] <= row['estimate'] <= row['upper'] <= 1)

    def test_demo_inputs_are_explicit_and_consistent(self):
        data = json.loads((ROOT/'assets/data/research-plot-demos.json').read_text())
        self.assertEqual(len(data), 7)
        for demo in data.values():
            self.assertIn('not empirical', demo['status'])
            self.assertTrue(demo['assumptions'])
            self.assertTrue(demo['values'])
        self.assertNotIn('distance', data)
        times=data['flood']['values']
        self.assertEqual(sum(row[1] <= 6 for row in times),10)
        self.assertEqual(sum(row[2] <= 6 for row in times),3)
        for _,events,exposure,rate,low,high in data['aid']['values']:
            self.assertAlmostEqual(rate,1000*events/exposure)
            self.assertLess(low,rate)
            self.assertGreater(high,rate)

    def test_generation_is_idempotent(self):
        names=['research.html','assets/data/ethnosectarian-figure4.json','assets/data/ethnosectarian-figure4.csv','assets/data/research-plot-demos.json','assets/data/vanguards-thesis.csv']
        before={name:(ROOT/name).read_bytes() for name in names}
        subprocess.run([sys.executable,str(ROOT/'scripts/build_research_figures.py')],check=True,capture_output=True,timeout=20)
        for name in names:
            self.assertEqual(before[name],(ROOT/name).read_bytes(),name)

if __name__ == '__main__':
    unittest.main()
