import { expect, test } from '@playwright/test';

test('CV and all navigation links fit without internal scrolling', async ({ page }, info) => {
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
        sans: getComputedStyle(doc.querySelector('.cv-degree-university')).fontFamily,
        mono: getComputedStyle(document.querySelector('.cv-toc a')).fontFamily,
      };
    });
    expect(geometry.overflow, `CV overflow at ${width}px`).toBeLessThanOrEqual(1);
    expect(geometry.documentRight).toBeLessThanOrEqual(width);
    expect(geometry.titleRight, `CV title at ${width}px`).toBeLessThanOrEqual(width);
    expect(geometry.serif).toContain('EB Garamond');
    expect(geometry.sans).toContain('Atkinson Hyperlegible');
    expect(geometry.mono).toContain('Atkinson Hyperlegible');
    // Resource labels must stay in their date rail rather than cover a title.
    expect(await page.locator('.cv-entry-rail .cv-side-button').evaluateAll(items => items.every(item => {
      const label_bounds = item.getBoundingClientRect();
      const rail_bounds = item.closest('.cv-entry-rail').getBoundingClientRect();
      return label_bounds.left >= rail_bounds.left - 1 &&
        label_bounds.right <= rail_bounds.right + 1 &&
        item.scrollWidth <= item.clientWidth + 1;
    })), `resource label at ${width}px`).toBe(true);
    const toc = page.locator('.cv-toc');
    expect(await toc.evaluate(e => e.scrollWidth <= e.clientWidth + 1)).toBe(true);
    const inner = page.locator('.cv-sidebar-inner');
    expect(await inner.evaluate(e => e.scrollHeight <= e.clientHeight + 1)).toBe(true);
    if ([390, 1440].includes(width)) await page.screenshot({ path: info.outputPath(`cv-${width}.png`), fullPage: true });
  }
});

test('CV navigation follows document order and disclosure stays inside applied work', async ({ page }) => {
  await page.goto('/cv.html');
  const sections = page.locator('.cv-document > .cv-section');
  // Overview targets the document header, which precedes the content sections.
  const overview_link = page.locator('.cv-toc a').first();
  await expect(overview_link).toHaveText('Overview');
  await expect(overview_link).toHaveAttribute('href', '#profile');
  await expect(page.locator('.cv-document > header#profile')).toHaveCount(1);
  const targets = await page.locator('.cv-toc a').evaluateAll(links => links.map(a => a.hash.slice(1)));
  expect(await sections.evaluateAll(items => items.map(item => item.id))).toEqual(targets.slice(1));
  expect(await sections.locator(':scope > h2').allTextContents()).toEqual((await page.locator('.cv-toc a').allTextContents()).slice(1));
  await expect(page.locator('#selected-projects > .cv-section-body > .cv-disclosure')).toHaveCount(1);
  await expect(page.locator('#skills .cv-skill-domain')).toHaveCount(5);
  await expect(page.locator('.cv-technical-ledger')).toHaveCount(0);
  await page.emulateMedia({ media: 'print' });
  expect(await sections.first().evaluate(el => getComputedStyle(el).breakInside)).toBe('auto');
});

test('CV follows printed order and downstream groups share a date rail', async ({page}) => {
  await page.goto('/cv.html');
  const expected=['education','research-portfolio','selected-projects','technical-work','presentations','academic-experience','professional-work','military-service' ,'skills'];
  expect(await page.locator('.cv-document > .cv-section').evaluateAll(items=>items.map(e=>e.id))).toEqual(expected);
  expect(await page.locator('.cv-toc a').evaluateAll(items=>items.map(e=>e.hash.slice(1)))).toEqual(['profile', ...expected]);
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
  expect(await page.locator('.cv-org-header .cv-role, .cv-org-header .cv-org-logo').count()).toBe(0);
});

test('desktop contents list fits a short viewport and legacy rules are absent',async({page})=>{
  await page.setViewportSize({width:1024,height:500});
  await page.goto('/cv.html');
  await page.locator('#education').scrollIntoViewIfNeeded();
  const nav=await page.locator('.cv-sidebar-inner').boundingBox();
  expect(nav.y).toBeGreaterThanOrEqual(0);
  expect(nav.y+nav.height).toBeLessThanOrEqual(500);
  const borders=await page.locator('.cv-section').evaluateAll(items=>items.map(e=>({top:getComputedStyle(e).borderTopWidth,bottom:getComputedStyle(e).borderBottomWidth})));
  expect(borders.every(e=>e.top==='0px'&&e.bottom==='0px')).toBe(true);
});

