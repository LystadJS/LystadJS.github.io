import { expect, test } from '@playwright/test';

test('dark atmospheric surfaces and interactive controls are restored', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://**/*', route => route.abort());
  await page.goto('/');
  const surface = await page.locator('body').evaluate(element => {
    const body = getComputedStyle(element);
    const grain = getComputedStyle(element, '::before');
    return { background: body.backgroundImage, grain: grain.backgroundImage,
      content: grain.content, opacity: parseFloat(grain.opacity), pointerEvents: grain.pointerEvents };
  });
  expect(surface.background).toContain('radial-gradient');
  expect(surface.background).toContain('linear-gradient');
  expect(surface.grain).toContain('data:image/svg+xml');
  expect(surface.content).not.toBe('none');
  expect(surface.opacity).toBeGreaterThan(0);
  expect(surface.opacity).toBeLessThan(.1);
  expect(surface.pointerEvents).toBe('none');

  const menu = page.locator('.menu-toggle');
  if (await menu.isVisible()) await menu.click();
  const research = page.locator('.site-nav a[data-page="research"]');
  const navBefore = await research.evaluate(element => getComputedStyle(element).backgroundColor);
  await research.hover();
  await expect.poll(() => research.evaluate(element => getComputedStyle(element).backgroundColor)).not.toBe(navBefore);
  await expect(research).toHaveCSS('color', 'rgb(238, 229, 217)');
  if (await menu.isVisible()) await menu.click();

  const primary = page.locator('#correspondence .button-primary');
  await primary.scrollIntoViewIfNeeded();
  await expect(primary).toHaveCSS('background-image', /linear-gradient/);
  const borderBefore = await primary.evaluate(element => getComputedStyle(element).borderColor);
  await primary.hover();
  await expect.poll(() => primary.evaluate(element => getComputedStyle(element).borderColor)).not.toBe(borderBefore);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('reveals and native page changes preserve content and keyboard navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.route('https://**/*', route => route.abort());
  await page.goto('/');
  const animations = await page.evaluate(async () => {
    if (!document.startViewTransition) return null;
    const transition = document.startViewTransition(() => {});
    await transition.ready;
    const states = ['::view-transition-old(root)', '::view-transition-new(root)']
      .map(pseudo => {
        const style = getComputedStyle(document.documentElement, pseudo);
        return { name: style.animationName, duration: parseFloat(style.animationDuration) };
      });
    transition.skipTransition();
    return states;
  });
  if (animations) {
    for (const state of animations) {
      expect(state.name).not.toBe('none');
      expect(state.duration).toBeGreaterThan(0);
      expect(state.duration).toBeLessThanOrEqual(.3);
    }
  }
  const section = page.locator('#research-program');
  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveClass(/visible/);
  await expect(section).toHaveCSS('opacity', '1');
  await expect(section).not.toHaveClass(/reveal-pending/);

  const about = page.locator('.profile-pages a[href="about.html"]');
  await about.scrollIntoViewIfNeeded();
  await about.focus();
  await expect(about).toBeFocused();
  await about.press('Enter');
  await expect(page).toHaveURL(/\/about\.html$/);
  await expect(page.locator('main')).toBeVisible();
  await expect(page.locator('body')).toHaveCSS('opacity', '1');
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('.academic-profile h1')).toBeVisible();
  await expect(page.locator('body')).toHaveCSS('opacity', '1');
});

test('no-JavaScript and reduced-motion visitors keep visible, usable pages', async ({ browser }, info) => {
  const context = await browser.newContext({ javaScriptEnabled: false,
    baseURL: info.project.use.baseURL,
    reducedMotion: 'reduce', viewport: info.project.use.viewport });
  await context.route('https://**/*', route => route.abort());
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('.academic-profile h1')).toBeVisible();
  await expect(page.locator('#research-program')).toHaveCSS('opacity', '1');
  await expect(page.locator('.profile-page-card')).toHaveCount(3);
  await context.close();

  const motionContext = await browser.newContext({ reducedMotion: 'reduce',
    baseURL: info.project.use.baseURL,
    viewport: info.project.use.viewport });
  await motionContext.route('https://**/*', route => route.abort());
  const motionPage = await motionContext.newPage();
  await motionPage.goto('/');
  const transitions = await motionPage.evaluate(async () => {
    if (!document.startViewTransition) return null;
    const transition = document.startViewTransition(() => {});
    await transition.ready;
    const names = ['::view-transition-old(root)', '::view-transition-new(root)']
      .map(pseudo => getComputedStyle(document.documentElement, pseudo).animationName);
    transition.skipTransition();
    return names;
  });
  if (transitions) expect(transitions).toEqual(['none', 'none']);
  await expect(motionPage.locator('#research-program')).toHaveCSS('opacity', '1');
  await motionContext.close();
});
