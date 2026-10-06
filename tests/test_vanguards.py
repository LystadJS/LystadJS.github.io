"""Verify source transcription and prevent synthetic/result conflation."""
import csv
import json
import sys
import unittest
from pathlib import Path
from decimal import Decimal
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts'))
from vanguards_panel import validate

class Vanguards(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data=json.loads((ROOT/'assets/data/vanguards-thesis.json').read_text())
        cls.rows=validate(cls.data)

    def test_source_and_full_table_structure(self):
        self.assertEqual(self.data['source']['sha256'],'ef06e537c341112da4677b1701cd334fdde21beb60a9f0af3cf692b04d0996fc')
        self.assertEqual(len(self.rows),11)
        self.assertEqual(len(self.data['tactic_order']),13)
        self.assertEqual(self.rows[0]['period'],'2013–2019')
        self.assertTrue(all(r['period']=='2014–2019' for r in self.rows[1:]))
        self.assertEqual([r['source']['pdf_page'] for r in self.rows],[49,59,63,67,71,75,79,83,87,91,95])

    def test_transcribed_tactics_against_page_review(self):
        # Independent fixture in the thesis's tactic order; suicide is separate.
        expected=[
            [4,0,3,10.6,1.2,10.8,3.7,60.2,0,1.7,.1,0,4.6],
            [1.6,0,3,16.2,.8,28.3,4,37.9,0,3.5,1.9,0,2.8],
            [2.5,0,17.8,6.8,1.7,4.2,4.2,59.3,0,1.7,.8,0,.8],
            [1,0,6.2,22.2,3.7,12.1,7.8,44.6,0,1.6,.4,0,.5],
            [.3,0,4.1,6.4,6.7,29.1,13.7,36.1,0,2.1,1.3,0,.3],
            [1.1,0,14.1,17.2,7.3,9.7,9.7,38.5,0,2.1,0,0,.5],
            [3,0,1.2,44,5.7,3.8,8.7,29.4,0,.4,0,0,3.8],
            [0,0,14.7,32,18.7,12,9.3,10.7,0,0,1.3,0,1.3],
            [0,0,0,28.6,7.1,3.6,35.7,21.4,3.6,0,0,0,0],
            [0,0,1.5,53.7,13.2,11.8,8.8,1.5,0,0,0,0,9.6],
            [0,0,0,41.3,19.6,24,2.2,0,0,2.2,0,0,10.9]]
        for row,values in zip(self.rows,expected):
            self.assertEqual(list(map(float,row['tactics'].values())),values,row['name'])
        self.assertEqual([float(r['suicide']) for r in self.rows],[20.6,15.5,44.9,7.4,1.5,19.6,25.2,8,17.9,0,0])

    def test_linkage_and_no_renormalization(self):
        self.assertEqual([float(r['linkage_total']) for r in self.rows[1:]],[8,7,6,5,5,3.66,5,6,2,2])
        self.assertNotIn('linkage_total',self.rows[0])
        self.assertEqual([sum(Decimal(v) for v in r['tactics'].values()) for r in self.rows],
            list(map(Decimal,['99.9','100.0','99.8','100.1','100.1','100.2','100.0','100.0','100.0','100.1','100.2'])))
        self.assertEqual(self.rows[6]['linkage_items']['Emir ascension method'],'.66')

    def test_csv_and_provenance(self):
        with (ROOT/'assets/data/vanguards-thesis.csv').open() as f: values=list(csv.DictReader(f))
        self.assertEqual(len(values),265)
        self.assertEqual(sum(v['measure_type']=='tactic' for v in values),143)
        self.assertEqual(sum(v['measure_type']=='linkage' for v in values),100)
        self.assertTrue(all(v['table'] and v['pdf_page'] and v['printed_page'] for v in values))
        self.assertNotIn('distance',json.loads((ROOT/'assets/data/research-plot-demos.json').read_text()))
        self.assertEqual(len(self.data['source_audit']),3)

if __name__=='__main__': unittest.main()
