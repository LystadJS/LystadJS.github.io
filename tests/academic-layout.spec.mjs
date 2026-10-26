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
      expect(box.height).toBeCloseTo(file === 'index.html' ? 1000 : Math.min(460, Math.max(210, width * 0.32)), 1);
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
      expect(dimensions.width / dimensions.height).toBeCloseTo(1.5, 2);
      await expect.poll(() => image.evaluate(e => e.currentSrc)).toContain('site-banner-enhanced-');
      if (file === 'index.html') {
        await expect(page.locator('.banner-title')).toHaveText('John S. Lystad');
        const title = await page.locator('.banner-title').boundingBox();
        expect(title.y).toBeGreaterThan(box.y + box.height * .1);
        expect(title.y + title.height).toBeLessThan(box.y + box.height * .5);
      } else {
        const crop = await image.boundingBox();
        expect(Math.abs(crop.y + crop.height * .82 - box.y - box.height)).toBeLessThan(1);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${file} at ${width}`).toBeLessThanOrEqual(1);
      if (file === 'index.html') {
        const profile = await page.locator('.academic-profile').boundingBox();
        const content = await page.locator('.academic-content').boundingBox();
        if (width > 700) expect(profile.x + profile.width).toBeLessThan(content.x);
        else expect(profile.y + profile.height).toBeLessThanOrEqual(content.y);
        await expect(page.locator('.profile-contact a')).toHaveCount(5);
        const cards = page.locator('.profile-pages .profile-page-card');
        await expect(cards).toHaveCount(3);
        for (const card of await cards.all()) {
          await expect(card.locator('svg')).toHaveCount(1);
          await expect(card.locator('strong')).toBeVisible();
          await expect(card.locator('small')).toBeVisible();
          const bounds = await card.boundingBox();
          expect(bounds.x).toBeGreaterThanOrEqual(profile.x);
          expect(bounds.x + bounds.width).toBeLessThanOrEqual(profile.x + profile.width + 1);
        }
        await expect(page.locator('.hero-practice-index')).toHaveCount(0);
        await expect(page.locator('.current-work .console-cursor')).toHaveCount(1);
        await expect(page.locator('.current-work')).toHaveCSS('font-family', /JetBrains Mono/);
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
  await expect(page.locator('.banner-title')).toHaveText('John S. Lystad');
  await expect(page.locator('.academic-profile h2')).toHaveText('John S. Lystad');
  await expect(page.locator('.profile-pages a')).toHaveCount(4);
  await expect(page.locator('.profile-page-card')).toHaveCount(3);
  for (const href of ['research.html', 'code.html', 'cv.html']) {
    await expect(page.locator(`.profile-page-card[href="${href}"]`)).toBeVisible();
  }
  await expect(page.locator('.current-work[href="https://github.com/LystadJS/project-ai-governance-non-proliferation"]')).toBeVisible();
  await expect(page.locator('.profile-contact a[href="mailto:jl17842@nyu.edu"]')).toBeVisible();
  await expect(page.locator('.profile-contact a[href="https://gist.github.com/LystadJS"]')).toBeVisible();
  await context.close();
});

test('homepage content fades into view on scroll and respects reduced motion', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-1440', 'Owns motion preference scenarios.');
  await page.route('https://**/*', route => route.abort());
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const introduction = page.locator('.home-introduction');
  await expect(introduction).toHaveCSS('opacity', '0');
  await page.locator('.banner-scroll').click();
  await expect(introduction).toHaveCSS('opacity', '1');
  await expect(introduction).not.toHaveClass(/reveal-pending/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(introduction).toHaveCSS('opacity', '1');
  await expect(introduction).not.toHaveClass(/reveal-pending/);
});


test('current work is a full-line keyboard-accessible project button', async ({ page, context }, info) => {
  test.skip(info.project.name !== 'desktop-1440');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const destination = 'https://github.com/LystadJS/project-ai-governance-non-proliferation';
  await context.route(destination, route => route.fulfill({ contentType: 'text/html', body: '<title>Project destination</title>' }));
  await page.goto('/');
  const work = page.locator('.current-work');
  await expect(work).toHaveAttribute('target', '_blank');
  await expect(work.locator('.prompt')).toHaveText('>');
  await expect(work.locator('.console-cursor')).toHaveCSS('animation-name', 'none');
  await work.focus();
  await expect(work).toBeFocused();
  await expect(work).toHaveCSS('outline-style', 'solid');
  const opened = context.waitForEvent('page');
  await work.press('Enter');
  const project = await opened;
  await project.waitForLoadState();
  expect(project.url()).toBe(destination);
  await project.close();
});


test('high-density banner selects the large image and retains the original fallback', async ({ browser }, info) => {
  test.skip(info.project.name !== 'desktop-1440');
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
  await context.route('https://**/*', route => route.abort());
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  const image = page.locator('.site-banner img');
  await expect.poll(() => image.evaluate(e => e.complete && e.naturalWidth > 0)).toBe(true);
  await expect.poll(() => image.evaluate(e => e.currentSrc)).toContain('site-banner-enhanced-3840.webp');
  await page.locator('.site-banner source').evaluate(e => e.remove());
  await expect.poll(() => image.evaluate(e => e.complete && e.naturalWidth > 0 && e.currentSrc.endsWith('/site-banner.jpg'))).toBe(true);
  await context.close();
});
