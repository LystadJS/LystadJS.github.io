"""Source-text synchronization and scope checks; not a statistical reanalysis."""
from pathlib import Path
import importlib.util
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('abstracts', ROOT / 'scripts/update_academic_abstracts.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class AbstractTests(unittest.TestCase):
    def setUp(self):
        self.items = module.load_abstracts()
        self.page = (ROOT / 'research.html').read_text(encoding='utf-8')

    def test_length_roles_and_sources(self):
        self.assertEqual(len(self.items), 4)
        self.assertEqual([item['word_count'] for item in self.items], [227, 230, 246, 245])
        for item in self.items:
            self.assertEqual(item['paragraph_roles'], module.ROLES)
            self.assertTrue(item['sources'])

    def test_checked_in_html_is_current_and_idempotent(self):
        updated = module.update_html(self.page, self.items)
        self.assertEqual(self.page, updated)
        self.assertEqual(updated, module.update_html(updated, self.items))

    def test_only_summary_blocks_are_replaceable(self):
        changed = [dict(item, paragraphs=['Test paragraph.'] * 3) for item in self.items]
        revised = module.update_html(self.page, changed)
        without_summaries = lambda s: re.sub(r'<div class="rp-summary">.*?</div>', '', s, flags=re.DOTALL)
        self.assertEqual(without_summaries(self.page), without_summaries(revised))
        self.assertEqual(len(re.findall(r'<article\b', revised)), 10)

    def test_reported_method_and_result_boundaries(self):
        text = {item['id']: ' '.join(item['paragraphs']) for item in self.items}
        self.assertIn('Two-stage logistic regression', text['paper-target-map'])
        self.assertIn('Preliminary', text['paper-target-map'])
        for required in ['16,227', '14,920', '0.852', '0.809–0.894', 'MICE', 'observed fatalities']:
            self.assertIn(required, text['paper-estimating-lethality'])
        for required in ['6,606', '2,639', 'descriptive', 'nine-criterion', 'further quantitative testing']:
            self.assertIn(required, text['paper-vanguards'])
        self.assertIn('not a statistically estimated climate–terrorism effect', text['paper-climate-terrorism'])

    def test_text_is_escaped(self):
        changed = [dict(item, paragraphs=['A < B & C.'] * 3) for item in self.items]
        self.assertIn('A &lt; B &amp; C.', module.update_html(self.page, changed))

    def test_changed_or_ambiguous_article_fails(self):
        with self.assertRaises(ValueError):
            module.update_html(self.page.replace('id="paper-vanguards"', 'id="renamed"'), self.items)
        article = re.search(r'<article\b[^>]*id="paper-vanguards".*?</article>', self.page, re.DOTALL).group()
        with self.assertRaises(ValueError):
            module.update_html(self.page + article, self.items)


if __name__ == '__main__':
    unittest.main()
