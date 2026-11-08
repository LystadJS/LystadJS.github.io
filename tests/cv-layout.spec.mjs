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
    const rail=el.querySelector(':scope > .cv-entry-rail, :scope > .cv-education-date, :scope > .cv-service-timeline') || el.parentElement.querySelector('.cv-service-timeline') || el.closest('.cv-independent-service')?.querySelector('.cv-service-scale');
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


test('military chronology uses one equal-year scale and numbered role links', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-1440');
  for (const width of [320,390,768,900,1024,1440]) {
    await page.setViewportSize({width,height:1000});
    await page.goto('/cv.html');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.cv-service-scale')).toHaveCount(1);
    await expect.poll(() => page.evaluate(() => {
      const unit=document.querySelector('[data-align-role="2025-07"] img').getBoundingClientRect();
      const circle=document.querySelector('.cv-role-point[data-start-date="2025-07"]').getBoundingClientRect();
      return Math.abs(unit.top+unit.height/2-circle.top-circle.height/2);
    })).toBeLessThan(1);
    await expect.poll(() => page.evaluate(() => {
      const unit=document.querySelector('[data-align-promotion="2021-11"] img').getBoundingClientRect();
      const rank=document.querySelector('.cv-service-promotion time[datetime="2021-11"]').parentElement.querySelector('img').getBoundingClientRect();
      return Math.abs(unit.top+unit.height/2-rank.top-rank.height/2);
    })).toBeLessThan(1);
    await expect(page.locator('.cv-today-marker')).toBeVisible();
    await expect(page.locator('.cv-today-marker')).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}$/);
    await expect(page.locator('.cv-future-arrow')).toHaveAttribute('aria-label', 'Future');
    // Check actual text fragments and circle bounds, including the new date tick.
    const overlaps = await page.locator('.cv-service-scale').evaluate(root => {
      const nodes = [...root.querySelectorAll('.cv-role-point,.cv-today-marker,.cv-service-year,.cv-service-event img,.cv-service-event time,.cv-service-event > span')];
      const boxes = nodes.flatMap((e, index) => {
        const range = document.createRange(); range.selectNodeContents(e);
        const rects = e.matches('img,.cv-role-point,.cv-today-marker') ? [e.getBoundingClientRect()] : [...range.getClientRects()];
        return rects.map(r => ({index,left:r.left,right:r.right,top:r.top,bottom:r.bottom}));
      });
      return boxes.some((a,i) => boxes.slice(i+1).some(b => a.index!==b.index && Math.min(a.right,b.right)-Math.max(a.left,b.left)>.5 && Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>.5));
    });
    expect(overlaps).toBe(false);
    const spine = await page.evaluate(() => {
      const military = getComputedStyle(document.querySelector('.cv-service-scale'), '::before');
      const professional = getComputedStyle(document.querySelector('#professional-work .cv-timeline'), '::before');
      return { matches: military.backgroundImage === professional.backgroundImage && military.width === professional.width && military.top === professional.top, left: military.left, width: military.width, transform: military.transform };
    });
    expect(spine).toEqual({ matches: true, left: '56px', width: '2px', transform: 'matrix(1, 0, 0, 1, -0.5, 0)' });
    await expect(page.locator('.cv-role-point')).toHaveText(['1','2','3','4']);
    const circles = await page.locator('.cv-role-point').evaluateAll(points => points.every(point => {
      const style = getComputedStyle(point);
      const reference = getComputedStyle(document.querySelector('#professional-work .cv-timeline-entry'), '::before');
      return style.borderRadius === '50%' && style.borderTopWidth === reference.borderTopWidth
        && style.borderTopColor === reference.borderTopColor && style.width === style.height
        && style.fontSize === '10px';
    }));
    expect(circles).toBe(true);
    await expect(page.locator('.cv-role-number')).toHaveText(['1','2','3','4']);
    await expect(page.locator('.cv-service-unit time, .cv-compressed-year')).toHaveCount(0);
    await expect.poll(() => page.locator('.cv-service-scale').evaluate(root => {
      const ticks=[...root.querySelectorAll('.cv-service-year')].map(e=>{const r=e.getBoundingClientRect();return {year:+e.textContent,y:r.top+r.height/2};});
      const step=ticks[1].y-ticks[0].y;
      const equal=ticks.slice(1).every((e,i)=>Math.abs(e.y-ticks[i].y-step)<1);
      const points=[...root.querySelectorAll('.cv-role-point')].every(e=>{
        const [year,month]=e.dataset.startDate.split('-').map(Number);
        const lower=ticks.find(t=>t.year===year).y,upper=ticks.find(t=>t.year===year+1).y;
        const r=e.getBoundingClientRect();return Math.abs(r.top+r.height/2-(lower+(upper-lower)*(month-1)/12))<1 && !!document.querySelector(e.getAttribute('href'));
      });
      return equal && points;
    })).toBe(true);
    const layout=await page.evaluate(()=>{
      const rail=document.querySelector('.cv-service-scale').getBoundingClientRect();
      const entries=[...document.querySelectorAll('.cv-role-list > article')];
      return entries.every((e,i)=>e.getBoundingClientRect().left>rail.right && (i===entries.length-1 || getComputedStyle(e).paddingBottom==='24px')) && document.documentElement.scrollWidth<=innerWidth;
    });
    expect(layout).toBe(true);
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
