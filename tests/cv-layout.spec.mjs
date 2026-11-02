import { expect, test } from '@playwright/test';

test('CV fits the viewport while mobile navigation scrolls independently', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-1440', 'This test owns its responsive width matrix.');
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://**/*', route => route.abort());
  for (const width of [320, 360, 390, 520, 700, 768, 900, 901, 1024, 1150, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/cv.html');
    await page.evaluate(() => document.fonts.ready);
    const geometry = await page.evaluate(() => {
      const doc = document.querySelector('.cv-layout > .cv-document');
      const title = doc.querySelector('.cv-document-header h2');
      const range = document.createRange(); range.selectNodeContents(title);
      return {
        overflow: document.documentElement.scrollWidth - innerWidth,
        documentRight: doc.getBoundingClientRect().right,
        titleRight: Math.max(...[...range.getClientRects()].map(r => r.right)),
        serif: getComputedStyle(title).fontFamily,
        sans: getComputedStyle(doc.querySelector('.cv-lead')).fontFamily,
        mono: getComputedStyle(document.querySelector('.cv-toc a')).fontFamily,
      };
    });
    expect(geometry.overflow, `CV overflow at ${width}px`).toBeLessThanOrEqual(1);
    expect(geometry.documentRight).toBeLessThanOrEqual(width);
    expect(geometry.titleRight, `CV title at ${width}px`).toBeLessThanOrEqual(width);
    expect(geometry.serif).toContain('EB Garamond');
    expect(geometry.sans).toContain('Atkinson Hyperlegible');
    expect(geometry.mono).toContain('JetBrains Mono');
    // Resource labels must stay in their date rail rather than cover a title.
    expect(await page.locator('.cv-entry-rail .cv-side-button').evaluateAll(items => items.every(item =>
      item.getBoundingClientRect().right <= item.closest('.cv-entry-rail').getBoundingClientRect().right + 1
    )), `resource label at ${width}px`).toBe(true);
    if (width <= 900) {
      const toc = page.locator('.cv-toc');
      expect(await toc.evaluate(e => e.scrollWidth > e.clientWidth)).toBe(true);
      await toc.evaluate(e => { e.scrollLeft = e.scrollWidth; });
      const last = await toc.locator('a').last().boundingBox();
      expect(last.x + last.width, `last navigation link at ${width}px`).toBeLessThanOrEqual(width);
      await toc.evaluate(e => { e.scrollLeft = 0; });
    }
    if ([390, 1440].includes(width)) await page.screenshot({ path: info.outputPath(`cv-${width}.png`), fullPage: true });
  }
});

test('CV navigation follows document order and disclosure stays inside applied work', async ({ page }) => {
  await page.goto('/cv.html');
  const sections = page.locator('.cv-document > .cv-section');
  const targets = await page.locator('.cv-toc a').evaluateAll(links => links.map(a => a.hash.slice(1)));
  expect(await sections.evaluateAll(items => items.map(item => item.id))).toEqual(targets);
  expect(await sections.locator(':scope > h2').allTextContents()).toEqual(await page.locator('.cv-toc a').allTextContents());
  await expect(page.locator('#selected-projects > .cv-section-body > .cv-disclosure')).toHaveCount(1);
  await expect(page.locator('#skills .cv-skill-domain')).toHaveCount(4);
  await expect(page.locator('.cv-technical-ledger')).toHaveCount(0);
  await page.emulateMedia({ media: 'print' });
  expect(await sections.first().evaluate(el => getComputedStyle(el).breakInside)).toBe('auto');
});

test('CV follows printed order and downstream groups share a date rail', async ({page}) => {
  await page.goto('/cv.html');
  const expected=['education','research-portfolio','selected-projects','technical-work','presentations','academic-experience','professional-work','military-service','skills','volunteering','overview'];
  expect(await page.locator('.cv-document > .cv-section').evaluateAll(items=>items.map(e=>e.id))).toEqual(expected);
  expect(await page.locator('.cv-toc a').evaluateAll(items=>items.map(e=>e.hash.slice(1)))).toEqual(expected);
  expect(await page.locator('#academic-experience .cv-org-entry').count()).toBe(1);
  expect(await page.locator('#professional-work .cv-org-entry').count()).toBe(6);
  expect(await page.locator('#military-service .cv-role-timeline-entry').count()).toBe(4);
  const rails=await page.locator('.cv-timeline-entry').evaluateAll(items=>items.map(el=>{
    const rail=el.querySelector(':scope > .cv-entry-rail, :scope > .cv-education-date');
    const content=el.querySelector(':scope > .cv-org-main, :scope > .cv-entry-content, :scope > .cv-timeline-role-body');
    return {rail:rail?.getBoundingClientRect().right,content:content?.getBoundingClientRect().left};
  }));
  expect(rails.every(r=>Number.isFinite(r.rail)&&r.rail<r.content)).toBe(true);
  expect(await page.locator('.cv-timeline .cv-role-heading > .cv-role-meta').count()).toBe(0);
});
