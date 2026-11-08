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
    const rail=el.querySelector(':scope > .cv-entry-rail, :scope > .cv-education-date, :scope > .cv-service-timeline') || el.parentElement.querySelector('.cv-service-timeline');
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


test('military chronology keeps dated insignia readable and clear of descriptions', async ({ page }, info) => {
  // One project owns this width matrix; avoid repeating the same browser checks.
  test.skip(info.project.name !== 'desktop-1440');
  for (const width of [320, 390, 768, 900, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/cv.html');
    await page.evaluate(() => document.fonts.ready);
    const rail = page.locator('.cv-service-timeline');
    await expect(page.locator('[data-cv-group="military"] h4')).toHaveText(['Officer Commissioning Candidate', 'Infantry Squad Leader', 'Infantry Company Communications Chief', 'Indirect Fire Infantryman']);
    expect(await rail.locator('.cv-role-start').evaluateAll(es => es.map(e => e.dateTime))).toEqual(['2025-07', '2024-01', '2023-05', '2021-11']);
    await expect(rail.locator('.cv-service-promotion')).toHaveCount(4);
    await expect(rail.locator('.cv-service-unit')).toHaveCount(3);
    await expect(rail.locator('.cv-service-year')).toHaveText(['2027', '2026', 'Jul. 2025', 'Jan. 2024', 'May 2023', '2022', 'Nov. 2021']);
    await expect(rail.locator('.cv-milestone-note')).toHaveText('(Anticipated)');
    const geometries = await rail.evaluateAll(rails => rails.map(el => {
      const bounds = el.getBoundingClientRect();
      const events = [...el.querySelectorAll(".cv-service-event")];
      return {
        aligned: Math.abs(bounds.top - el.parentElement.querySelector('.cv-entry-content').getBoundingClientRect().top) < 1,
        width: bounds.width,
        split: events.every(e => { const r=e.getBoundingClientRect(); const spine=bounds.left+56; return e.classList.contains("cv-service-unit") ? r.left>spine : r.right<spine; }),
        dates: events.map(e => e.querySelector('time').dateTime),
        imagesLoaded: events.every(e => { const image = e.querySelector('img'); return image.complete && image.naturalWidth > 0; }),
        fits: events.every((e, i) => {
          const r = e.getBoundingClientRect();
          return r.left >= bounds.left && r.right <= bounds.right + 1 && r.bottom <= bounds.bottom + 1
            && (!i || r.top >= events[i - 1].getBoundingClientRect().bottom);
        }),
        clear: [...el.parentElement.querySelectorAll('.cv-entry-content')].every(e => e.getBoundingClientRect().left > bounds.right),
      };
    }));
    for (const geometry of geometries) {
    expect(geometry.aligned).toBe(true);
    expect(geometry.width).toBe(112);
    expect(geometry.split).toBe(true);
    expect(geometry.dates).toEqual([...geometry.dates].sort().reverse());
    expect(geometry.imagesLoaded).toBe(true);
    expect(geometry.fits).toBe(true);
    expect(geometry.clear).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('training artwork stays beside its corresponding badge and award lists', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-1440');
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/cv.html');
    const groups = page.locator('.cv-award-group');
    await expect(groups.locator('h4')).toHaveText(['Special Skills Badges', 'Awards']);
    await expect(groups.nth(0).locator('li')).toHaveCount(4);
    await expect(groups.nth(1).locator('li')).toHaveCount(6);
    const layout = await groups.evaluateAll(items => items.map(e => {
      const art = e.querySelector('.cv-award-art').getBoundingClientRect();
      const copy = e.querySelector('.cv-award-copy').getBoundingClientRect();
      return {
        separated: art.right < copy.left,
        aligned: Math.abs(art.top - copy.top) < 1,
        loaded: [...e.querySelectorAll('img')].every(img => img.complete && img.naturalWidth === 423),
      };
    }));
    expect(layout.every(e => e.separated && e.aligned && e.loaded)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
