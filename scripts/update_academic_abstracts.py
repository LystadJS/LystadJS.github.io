#!/usr/bin/env python3
"""Update only four academic abstract blocks from reviewed, source-grounded text.

No third-party dependencies. Use --check in CI to verify synchronization without
writing; figure generation remains owned by build_research_figures.py.
"""
from pathlib import Path
import argparse
import html
import json
import re

ROOT = Path(__file__).resolve().parents[1]
IDS = (
    'paper-target-map', 'paper-estimating-lethality',
    'paper-vanguards', 'paper-climate-terrorism',
)
ROLES = ['background_and_objective', 'methods', 'findings_and_implication']


def load_abstracts(path=None):
    data = json.loads((path or ROOT / 'assets/data/academic-abstracts.json').read_text(encoding='utf-8'))
    items = data.get('abstracts', [])
    if [item.get('id') for item in items] != list(IDS):
        raise ValueError('Expected exactly four academic abstracts in portfolio order.')
    for item in items:
        paragraphs = item.get('paragraphs', [])
        if len(paragraphs) != 3 or any(not isinstance(p, str) or not p.strip() for p in paragraphs):
            raise ValueError(f'{item["id"]}: expected three nonempty prose paragraphs.')
        count = len(' '.join(paragraphs).split())
        if not 200 <= count <= 250 or count != item.get('word_count'):
            raise ValueError(f'{item["id"]}: word count outside the reviewed 200–250 range.')
        if item.get('paragraph_roles') != ROLES or not item.get('sources'):
            raise ValueError(f'{item["id"]}: missing structure or source references.')
    return items


def update_html(document, items):
    for item in items:
        pattern = r'(<article\b[^>]*\bid="' + re.escape(item['id']) + r'"[^>]*>)(.*?)(</article>)'
        matches = list(re.finditer(pattern, document, flags=re.DOTALL))
        if len(matches) != 1:
            raise ValueError(f'Expected one article: {item["id"]}')
        match = matches[0]
        body = match.group(2)
        title = re.search(r'<h3\b[^>]*>(.*?)</h3>', body, re.DOTALL)
        if not title or html.unescape(re.sub(r'<[^>]+>', '', title.group(1))) != item['title']:
            raise ValueError(f'Title changed for {item["id"]}; review the source mapping.')
        replacement = '<div class="rp-summary">' + ''.join('<p>' + html.escape(p, quote=False) + '</p>' for p in item['paragraphs']) + '</div>'
        new_body, count = re.subn(r'<div class="rp-summary">.*?</div>', lambda _: replacement, body, flags=re.DOTALL)
        if count != 1:
            raise ValueError(f'Expected one abstract container: {item["id"]}')
        document = document[:match.start(2)] + new_body + document[match.end(2):]
    return document


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Fail instead of updating an out-of-date abstract.')
    args = parser.parse_args()
    path = ROOT / 'research.html'
    current = path.read_text(encoding='utf-8')
    updated = update_html(current, load_abstracts())
    if args.check:
        if current != updated:
            raise SystemExit('Abstracts are out of date. Run python3 scripts/update_academic_abstracts.py.')
        print('Four academic abstracts match the reviewed source text.')
    else:
        if current != updated:
            path.write_text(updated, encoding='utf-8')
        print('Four academic abstracts synchronized; other page markup preserved.')


if __name__ == '__main__':
    main()
