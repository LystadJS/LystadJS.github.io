import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';

const files = execFileSync('git', ['ls-files', '*.html'], { encoding: 'utf8' }).trim().split(/\r?\n/);

test('shared reading and control spacing stays consistent on every page', async ({ page }, info) => {
  test.skip(info.project.name === 'tablet-900', 'Desktop/mobile audit; existing layout checks cover intermediate widths.');
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://**/*', route => route.abort());
  for (const file of files) {
    await page.goto(`/${file}`);
    await page.evaluate(() => document.fonts.ready);
    const result = await page.evaluate(() => {
      const checks = [];
      const add = (selector, property, expected) => {
        for (const e of document.querySelectorAll(selector)) {
          if (!e.getBoundingClientRect().width || e.closest('svg')) continue;
          checks.push({ selector, property, actual: parseFloat(getComputedStyle(e)[property]), expected: typeof expected === 'function' ? expected(e) : expected });
        }
      };
      const card = innerWidth <= 700 ? 16 : 24;
      const personal = ['index','about','research','code','cv','notes','404'].includes(document.body.dataset.page);
      const heading = personal ? 24 : innerWidth <= 780 ? 32 : 48;
      add('h1:not(.masthead h1):not(.un-banner-copy h1)', 'marginBottom', card);
      add('h3:not(.cv-degree-title),h4,h5,h6', 'marginBottom', e => {
        if (e.matches('body[data-page="cv"] main .cv-entry-content > .document-title')) return 4;
        if (e.matches('body[data-page] main .document-title:has(+ .document-muted, + .document-list),body[data-page] .cv-org-header .document-title,body[data-page] .cv-role-heading .document-title')) return 2;
        return 16;
      });
      add('#education .cv-degree-title,#education .cv-degree-concentration', 'marginBottom', 2);
      add('#education .cv-degree-university', 'marginBottom', 0);
      add('#education .cv-degree-department', 'marginBottom', 0);
      add('main > p:not([class]),.hero-lede,.about-summary,.rp-summary > p', 'marginBottom', 16);
      add('.section-header,.essay-heading,.research-section-heading,.code-section-heading,.dm-header', 'marginBottom', heading);
      add('input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]):not([type=hidden]),select,textarea', 'paddingTop', 12);
      add('input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]):not([type=hidden]),select,textarea', 'paddingLeft', 16);
      add('.button,.btn,.cv-print-button,.project-action,.project-open a,form button,.toolbar button,.actions button', 'paddingTop', 12);
      add('.section,.essay-section,.research-section,.code-page-section,.project-row', 'paddingTop', personal ? 32 : Math.min(96, Math.max(64, innerWidth * .07)));
      return { checks, overflow: document.documentElement.scrollWidth - innerWidth, loaded: [...document.styleSheets].some(s => s.href?.includes('/spacing.css')) };
    });
    expect(result.loaded, file).toBe(true);
    expect(result.overflow, file).toBeLessThanOrEqual(1);
    for (const check of result.checks) expect(Math.abs(check.actual - check.expected), `${file}: ${check.selector} ${check.property}`).toBeLessThan(.1);
    if (['index.html','about.html','research.html','code.html','cv.html','un/index.html','un/transcript-agent/index.html','un/transcript-agent/sc-drafts.html'].includes(file)) await page.screenshot({ path: info.outputPath(`${file.replaceAll('/','-')}-spacing.png`) });
  }
});
