import { expect, test } from '@playwright/test';

test('photographic banner and profile layout work across desktop and mobile widths', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-1440', 'Owns its viewport matrix.');
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://**/*', route => route.abort());
  for (const width of [320,390,700,768,900,1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const file of ['index.html','about.html','research.html','code.html','cv.html','404.html','notes/example-note.html']) {
      const response = await page.goto(`/${file}`);
      expect(response.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      const banner = page.locator('.site-banner');
      await expect(banner).toBeVisible();
      const box = await banner.boundingBox();
      expect(box.width).toBe(width);
      expect(box.height).toBeCloseTo(Math.min(560, Math.max(240, width * 0.4)), 1);
      const header = page.locator('.site-header');
      expect((await header.boundingBox()).y).toBe(0);
      const alpha = await header.evaluate(e => parseFloat(getComputedStyle(e).backgroundColor.split(',').at(-1)));
      expect(alpha).toBeGreaterThan(0);
      expect(alpha).toBeLessThan(1);
      await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, 500); });
      expect((await header.boundingBox()).y).toBe(0);
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect.poll(() => banner.locator('img').evaluate(e => e.complete && e.naturalWidth > 0)).toBe(true);
      const image = banner.locator('img');
      const dimensions = await image.evaluate(e => ({ width: e.naturalWidth, height: e.naturalHeight }));
      await expect(image).toHaveAttribute('width', String(dimensions.width));
      await expect(image).toHaveAttribute('height', String(dimensions.height));
      await expect(image).toHaveCSS('object-position', '50% 100%');
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${file} at ${width}`).toBeLessThanOrEqual(1);
      if (file === 'index.html') {
        const profile = await page.locator('.academic-profile').boundingBox();
        const content = await page.locator('.academic-content').boundingBox();
        if (width > 700) expect(profile.x + profile.width).toBeLessThan(content.x);
        else expect(profile.y + profile.height).toBeLessThanOrEqual(content.y);
        await expect(page.locator('.profile-contact a')).toHaveCount(5);
        await expect(page.locator('.hero-practice-index,.console-cursor')).toHaveCount(0);
        if ([390,1440].includes(width)) await page.screenshot({ path: info.outputPath(`home-${width}.png`) });
      }
    }
  }
});

test('profile, contact details and navigation are available without JavaScript', async ({ browser }, info) => {
  test.skip(info.project.name !== 'desktop-1440');
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  await expect(page.locator('.academic-profile h1')).toHaveText('John S. Lystad');
  await expect(page.locator('.profile-pages a')).toHaveCount(4);
  await expect(page.locator('.profile-contact a[href="mailto:jl17842@nyu.edu"]')).toBeVisible();
  await expect(page.locator('.profile-contact a[href="https://gist.github.com/LystadJS"]')).toBeVisible();
  await context.close();
});
