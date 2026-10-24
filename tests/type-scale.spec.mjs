import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';

const files = execFileSync('git', ['ls-files', '*.html'], { encoding: 'utf8' }).trim().split(/\r?\n/);

test('every page shares five text sizes and consistent semantic roles', async ({ page }, info) => {
  test.skip(info.project.name === 'tablet-900', 'All pages are covered on desktop/mobile; layout tests cover intermediate widths.');
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://**/*', route => route.abort());
  for (const file of files) {
    await page.goto(`/${file}`);
    await page.evaluate(() => document.fonts.ready);
    const result = await page.evaluate(() => {
      const probe = document.createElement('div'); probe.style.setProperty('transition', 'none', 'important'); document.body.append(probe);
      const tokens = Object.fromEntries(['meta','body','subheading','section','display'].map(role => {
        probe.style.setProperty('font-size', `var(--type-${role})`, 'important');
        return [role, parseFloat(getComputedStyle(probe).fontSize)];
      })); probe.remove();
      const elements = [...document.querySelectorAll('body *')].filter(e => e.namespaceURI === 'http://www.w3.org/1999/xhtml' && [...e.childNodes].some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim()));
      const sizes = [...new Set(elements.map(e => parseFloat(getComputedStyle(e).fontSize)))];
      const roles = ['h1','h2','h3','h4','h5','h6','button','input','select','textarea','[data-section-index]'].flatMap(selector => [...document.querySelectorAll(selector)].map(e => ({ selector, size: parseFloat(getComputedStyle(e).fontSize) })));
      return { tokens, sizes, roles };
    });
    const allowed = Object.values(result.tokens);
    expect(result.sizes.filter(size => !allowed.some(v => Math.abs(v - size) < .02)), `${file}: sizes outside the shared scale`).toEqual([]);
    for (const { selector, size } of result.roles) {
      const role = selector === 'h1' ? 'display' : ['h2','[data-section-index]'].includes(selector) ? 'section' : /^h[3-6]$/.test(selector) ? 'subheading' : 'body';
      expect(size, `${file}: ${selector}`).toBeCloseTo(result.tokens[role], 1);
    }
    if (['index.html','about.html','research.html','code.html','cv.html','un/index.html','un/transcript-agent/index.html'].includes(file)) await page.screenshot({ path: info.outputPath(`${file.replaceAll('/','-')}-scale.png`) });
  }
});

test('the report reading-size preference still scales body text and metadata', async ({ page }) => {
  await page.goto('/un/transcript-agent/reports/hlw-cuba/index.html');
  await page.evaluate(() => document.documentElement.style.setProperty('--reading', '20px'));
  await expect(page.locator('body')).toHaveCSS('font-size', '20px');
  const small = page.locator('small').first();
  if (await small.count()) await expect(small).toHaveCSS('font-size', '15px');
});
