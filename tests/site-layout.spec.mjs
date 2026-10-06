import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const ROOT = new URL('../', import.meta.url);
const paths = { about: '.essay-section', research: '.research-section', code: '.code-page-section' };
const widths = [320, 390, 600, 768, 780, 900, 980, 1024, 1440, 1920];
const registryPattern = '**/research-registry/main/dist/research-registry.json';

// External services do not own the portfolio's layout or interaction contract.
// The map adapter gets its own deterministic fixture test below.
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://fonts.googleapis.com/**', route => route.abort());
  await page.route('https://fonts.gstatic.com/**', route => route.abort());
  await page.route('https://cdn.jsdelivr.net/**', route => route.abort());
  await page.route(registryPattern, route => route.fulfill({ json: { schema_version: '1.0' } }));
});

test('section rhythm is identical across pages and responsive widths', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-1440', 'This check owns its viewport matrix.');
  test.setTimeout(90000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    const expected = Math.min(96, Math.max(64, width * 0.07));
    for (const [name, selector] of Object.entries(paths)) {
      await page.goto(`/${name}.html`, { waitUntil: 'load' });
      const geometry = await page.locator(selector).evaluateAll(elements => elements.map(element => {
        const css = getComputedStyle(element);
        const heading = element.querySelector('.essay-heading,.research-section-heading,.code-section-heading,.dm-header');
        return { top: parseFloat(css.paddingTop), bottom: parseFloat(css.paddingBottom), gap: parseFloat(getComputedStyle(heading).marginBottom) };
      }));
      expect(geometry.length).toBeGreaterThan(1);
      for (const section of geometry) {
        expect(Math.abs(section.top - expected)).toBeLessThan(0.1);
        expect(Math.abs(section.bottom - expected)).toBeLessThan(0.1);
        expect(section.gap).toBe(width <= 780 ? 32 : 48);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${name} at ${width}`).toBeLessThanOrEqual(1);
      await expect(page.locator('.site-nav a[aria-current="page"]')).toHaveCount(1);
      if (width === 390 || width === 1440) {
        await page.screenshot({ path: info.outputPath(`${name}-${width}.png`) });
      }
    }
  }
  expect(errors).toEqual([]);
});

test('mobile navigation closes on Escape and resets when resized', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/research.html');
  const button = page.locator('.menu-toggle');
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(button).toBeFocused();
  await button.click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.site-nav')).not.toHaveClass(/open/);
});

test('every Code method button loads a distinct, intact example', async ({ page }) => {
  await page.goto('/code.html');
  const buttons = page.locator('[data-code-snippet]');
  expect(await buttons.count()).toBeGreaterThan(8);
  const seen = new Set();
  for (const button of await buttons.all()) {
    // Keyboard activation tests the same native click handler without moving
    // the pointer over adjacent controls when the terminal height changes.
    await button.focus();
    await button.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-code-snippet][aria-pressed="true"]')).toHaveCount(1);
    const code = await page.locator('#terminal-code').textContent();
    expect(code.length).toBeGreaterThan(80);
    expect(code).not.toMatch(/^\s*-{10,}\s*$/m);
    seen.add(code);
  }
  expect(seen.size).toBe(await buttons.count());
});

test('research rows, coordinates, resources, and failure fallback remain available', async ({ page }) => {
  let requests = 0;
  await page.route(registryPattern, route => { requests++; return route.fulfill({ json: { schema_version: '1.0' } }); });
  await page.goto('/research.html');
  await expect(page.locator('.research-project')).toHaveCount(10);
  await expect(page.locator('.rp-resource')).toHaveCount(30);
  await expect(page.locator('.research-figure svg')).toHaveCount(10);
  await expect(page.locator('.process-point')).toHaveCount(7);
  await expect(page.locator('.empirical-load-error')).toContainText('map is unavailable');
  expect(requests).toBe(1);
  const details = page.locator('#project-ai-nonproliferation details').first();
  await details.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(details).toHaveAttribute('open', '');
  await expect(details.locator('table')).toBeVisible();
});

test('geographic adapter supports scope, preview, selection, and linked tags', async ({ page }) => {
  await page.goto('/research.html');
  // Only the map library is mocked: the production dataset, adapter, tag linker,
  // DOM event listeners, and shared registry client execute without substitution.
  await page.evaluate(() => {
    window.jsVectorMap = function(options) {
      const element = document.querySelector(options.selector);
      const keys = Object.keys(window.JSL_EMPIRICAL_DATA.countryNames);
      element.innerHTML = '<svg viewBox="0 0 1000 400">' + keys.map((code, i) => `<rect class="jvm-region" data-code="${code}" x="${(i % 40)*25}" y="${Math.floor(i/40)*25}" width="20" height="20"/>`).join('') + '</svg>';
      options.onLoaded.call(this);
    };
  });
  await page.addScriptTag({ content: readFileSync(new URL('assets/js/empirical-explorer-v2.js', ROOT), 'utf8') });
  const filters = page.locator('#empirical-filters [data-mode][data-scope]');
  expect(await filters.count()).toBeGreaterThan(8);
  for (const mode of ['research', 'applied', 'military', 'journalism']) {
    await page.locator(`#empirical-filters [data-mode="${mode}"][data-scope="all"]`).click();
    const regions = page.locator('.jvm-region[tabindex="0"]');
    expect(await regions.count()).toBeGreaterThan(0);
    const region = regions.first();
    await region.focus();
    await expect(page.locator('.empirical-country-title')).not.toHaveText('All');
    await region.press('Enter');
    await expect(page.locator('[data-close-country]')).toBeVisible();
    await expect(page.locator('.empirical-region--selected')).toHaveCount(1);
    const tags = page.locator('#empirical-panel .empirical-tag');
    for (const tag of await tags.all()) await expect(tag).toHaveAttribute('href', /^https:\/\/github.com\//);
    await page.keyboard.press('Escape');
    await expect(page.locator('.empirical-region--selected')).toHaveCount(0);
  }
});

test('homepage graph data and single Gists action survive consolidation', async ({ page }) => {
  await page.goto('/index.html');
  const totals = await page.evaluate(() => ({ nodes: Object.keys(window.JSLResearchProgramData.DATA).length, edges: window.JSLResearchProgramData.EDGES.length }));
  expect(totals).toEqual({ nodes: 62, edges: 139 });
  await expect(page.locator('.hero-contact-rail a[href="https://gist.github.com/LystadJS"]')).toHaveCount(1);
});

test('portrait variants and explicit CV logo paths load without probe requests', async ({ page }) => {
  const failures = [];
  page.on('response', response => { if (response.url().includes('/assets/images/') && response.status() >= 400) failures.push(response.url()); });
  await page.goto('/about.html');
  const portrait = page.locator('.about-portrait img');
  await expect(portrait).toBeVisible();
  await expect.poll(() => portrait.evaluate(image => image.complete && image.naturalWidth > 0), { timeout: 15000 }).toBe(true);
  expect(await portrait.evaluate(image => image.currentSrc)).toMatch(/headshot-(480|960)\.webp$/);
  await page.goto('/cv.html');
  const logos = page.locator('.cv-org-logo img,.cv-role-logo img');
  await expect(logos).toHaveCount(19);
  // Some logos are intentionally inside collapsed disclosures. Verify every
  // declared URL without pretending those hidden elements are scroll targets.
  await logos.evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
  await expect.poll(() => logos.evaluateAll(images => images.filter(image => image.complete && image.naturalWidth > 0).length), { timeout: 15000 }).toBe(19);
  await expect(page.locator('[href^="YOUR-"]')).toHaveCount(0);
  expect(failures).toEqual([]);
});

test('page copy is available with JavaScript disabled', async ({ browser }, info) => {
  test.skip(info.project.name !== 'desktop-1440');
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: 'http://127.0.0.1:4173' });
  const page = await context.newPage();
  await page.route('https://**/*', route => route.abort());
  for (const name of Object.keys(paths)) {
    await page.goto(`/${name}.html`);
    const hidden = await page.locator('.reveal').evaluateAll(elements => elements.filter(element => getComputedStyle(element).opacity === '0').length);
    expect(hidden).toBe(0);
    await expect(page.locator('main')).toBeVisible();
  }
  await context.close();
});
