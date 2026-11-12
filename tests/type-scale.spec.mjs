import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';

const files = execFileSync('git', ['ls-files', '*.html'], { encoding: 'utf8' }).trim().split(/\r?\n/);

test('every page shares semantic text sizes with explicit CV timeline roles', async ({ page }, info) => {
  test.skip(info.project.name === 'tablet-900', 'All pages are covered on desktop/mobile; layout tests cover intermediate widths.');
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://**/*', route => route.abort());
  for (const file of files) {
    await page.goto(`/${file}`);
    await page.evaluate(() => document.fonts.ready);
    const result = await page.evaluate(() => {
      const probe = document.createElement('div'); probe.style.setProperty('transition', 'none', 'important'); document.body.append(probe);
      const tokens = Object.fromEntries(['meta','body','minor-heading','subheading','section','display'].map(role => {
        probe.style.setProperty('font-size', `var(--type-${role})`, 'important');
        return [role, parseFloat(getComputedStyle(probe).fontSize)];
      })); probe.remove();
      const elements = [...document.querySelectorAll('body *')].filter(e => e.namespaceURI === 'http://www.w3.org/1999/xhtml' && [...e.childNodes].some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim()));
      // Explicit component contracts adopted by the education/military redesigns.
      const special = [
        ['#education .cv-degree-title', tokens.subheading],
        ['#education .cv-degree-university,#education .cv-degree-detail', tokens.subheading * .9],
        ['#education .cv-degree-concentration', tokens.subheading * .6],
        ['.cv-service-event time,.cv-service-event > span:not(.cv-insignia-art):not(.cv-milestone-note),.cv-service-year', 11.2], ['.cv-service-event .cv-milestone-note', 9.6],
        ['.cv-role-number,.cv-today-marker,.cv-role-point', 10],
        ['.cv-document-header .cv-contact-block', 17.496],
        ['.cv-document-header h2', Math.min(tokens.body * 2.6244, Math.max(tokens.body * 2.3328, innerWidth * .0279936))],
        ['.cv-document-header .cv-document-disciplines', 16.3296],
        ['.cv-side-button', tokens.meta],
      ];
      const specialNodes = new Set(special.flatMap(([selector]) => [...document.querySelectorAll(selector)]));
      const specialSizes = special.flatMap(([selector, expected]) => [...document.querySelectorAll(selector)]
        .flatMap(e => [e, ...elements.filter(child => child !== e && e.contains(child))])
        .map(e => ({selector, expected, actual: parseFloat(getComputedStyle(e).fontSize)})));
      const sizes = [...new Set(elements.filter(e => !specialNodes.has(e) && ![...specialNodes].some(n => n.contains(e)))
        .map(e => parseFloat(getComputedStyle(e).fontSize)))];
      // Editorial section labels and minor position headings have explicit semantic roles.
      const roles = ['h1','h2:not(.cv-section-label)','.cv-section-label','h3','h4','h5','h6','button','input','select','textarea','[data-section-index]','.kicker','.page-index-card span','figcaption','.service-meta','.rp-figure-type'].flatMap(selector => [...document.querySelectorAll(selector)].filter(e => !specialNodes.has(e)).map(e => ({ selector, documentHeading: e.matches('.document-section-title'), minorHeading: e.matches('h4.document-title,#professional-work .cv-role-heading .document-title'), size: parseFloat(getComputedStyle(e).fontSize) })));
      return { tokens, sizes, roles, specialSizes };
    });
    for (const item of result.specialSizes) expect(item.actual, `${file}: ${item.selector}`).toBeCloseTo(item.expected, 1);
    if (file === 'cv.html') expect(result.specialSizes.filter(i => i.selector.startsWith('#education'))).toHaveLength(10);
    const allowed = Object.values(result.tokens);
    expect(result.sizes.filter(size => !allowed.some(v => Math.abs(v - size) < .02)), `${file}: sizes outside the shared scale`).toEqual([]);
    for (const { selector, size, documentHeading, minorHeading } of result.roles) {
      const role = documentHeading ? 'section' : minorHeading ? 'minor-heading' : selector === 'h1' ? 'display' : ['h2:not(.cv-section-label)','[data-section-index]'].includes(selector) ? 'section' : /^h[3-6]$/.test(selector) ? 'subheading' : ['button','input','select','textarea'].includes(selector) ? 'body' : 'meta';
      expect(size, `${file}: ${selector}`).toBeCloseTo(result.tokens[role], 1);
    }
    if (['index.html','about.html','research.html','code.html','cv.html','un/index.html','un/transcript-agent/index.html'].includes(file)) await page.screenshot({ path: info.outputPath(`${file.replaceAll('/','-')}-scale.png`) });
  }
});

test('the report reading-size preference scales text, persists, and resets', async ({ page }) => {
  await page.goto('/un/transcript-agent/reports/hlw-cuba/index.html');
  await page.locator('.appearance summary').click();
  await page.locator('#font-size').selectOption('18px');
  await expect(page.locator('body')).toHaveCSS('font-size', '18px');
  await expect(page.locator('small').first()).toHaveCSS('font-size', '13.5px');
  await page.reload();
  await expect(page.locator('body')).toHaveCSS('font-size', '18px');
  await page.locator('.appearance summary').click();
  await expect(page.locator('#font-size')).toHaveValue('18px');
  await page.locator('#reset-look').click();
  await expect(page.locator('body')).toHaveCSS('font-size', '16px');
  await expect(page.locator('small').first()).toHaveCSS('font-size', '12px');
});
