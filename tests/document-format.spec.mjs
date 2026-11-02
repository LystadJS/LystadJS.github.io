import { expect, test } from '@playwright/test';

test('shared headings, list colors, and compact CV flow', async ({ page }, info) => {
  test.setTimeout(60000);
  await page.route('https://**/*', route => route.abort());
  for (const path of ['/index.html', '/about.html', '/research.html', '/code.html', '/cv.html', '/notes/example-note.html', '/un/']) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const headings = await page.locator('main .document-section-title').evaluateAll(items => items.map(el => {
      const s = getComputedStyle(el), rule = getComputedStyle(el, '::after');
      return { font:s.fontFamily, transform:s.textTransform, rule:rule.display, gradient:rule.backgroundImage,
        width:parseFloat(rule.width), headingWidth:el.getBoundingClientRect().width };
    }));
    expect(headings.length, path).toBeGreaterThan(0);
    for (const h of headings) {
      expect(h.font, path).toContain('EB Garamond');
      expect(h.transform).toBe('none');
      expect(h.rule).toBe('block');
      expect(h.gradient).toContain('linear-gradient');
      expect(Math.abs(h.width - h.headingWidth), path).toBeLessThanOrEqual(1);
    }
  }
  await page.goto('/cv.html');
  const colors = await page.evaluate(() => {
    const color = (selector, pseudo) => getComputedStyle(document.querySelector(selector), pseudo).color;
    return {
      title:color('#education h3'), school:color('#education .cv-degree-university'),
      concentration:color('#education .cv-degree-concentration'), date:color('#education .cv-role-meta'),
      text:color('#education .cv-bullets li'), marker:color('#education .cv-bullets li', '::before'),
      downstreamTitle:color('#academic-experience h3'), downstreamText:color('#academic-experience .cv-bullets li'),
      downstreamMarker:color('#academic-experience .cv-bullets li', '::before')
    };
  });
  expect(colors.title).toBe('rgb(238, 229, 217)');
  expect(colors.school).toBe(colors.title);
  expect(colors.concentration).toBe('rgb(145, 132, 147)');
  expect(colors.date).toBe(colors.concentration);
  expect(colors.text).toBe(colors.concentration);
  expect(colors.marker).toBe('rgb(191, 49, 82)');
  expect(colors.downstreamTitle).toBe(colors.title);
  expect(colors.downstreamText).toBe(colors.text);
  expect(colors.downstreamMarker).toBe(colors.marker);
  const gaps = await page.locator('#education .cv-org-main:has(.cv-bullets)').evaluateAll(items =>
    items.map(el => el.querySelector('.cv-bullets li').getBoundingClientRect().top -
      el.querySelector('.cv-degree-university').getBoundingClientRect().bottom));
  expect(gaps.every(gap => gap >= -1 && gap <= 5), JSON.stringify(gaps)).toBe(true);
  expect(await page.locator('.cv-org-header .cv-org-logo').count()).toBe(0);
  await page.locator('#education').screenshot({path:info.outputPath('education-format.png')});
  await page.locator('#academic-experience').screenshot({path:info.outputPath('academic-format.png')});
});

test('ongoing timeline markers are filled and eyebrows stay red and compact',async({page})=>{
  await page.goto('/cv.html');
  const markers=await page.locator('.cv-timeline-entry').evaluateAll(items=>items.map(e=>{
    const s=getComputedStyle(e,'::before');
    return {current:e.dataset.current,border:s.borderTopColor,fill:s.backgroundColor,shadow:s.boxShadow};
  }));
  expect(markers.filter(m=>m.current==='true')).toHaveLength(11);
  for(const m of markers){
    expect(m.border).toBe('rgb(191, 49, 82)');
    expect(m.fill).toBe(m.current==='true'?'rgb(191, 49, 82)':'rgb(7, 7, 9)');
    expect(m.shadow).toBe('none');
  }
  const eyebrows=await page.locator('.cv-entry-kicker').evaluateAll(items=>items.map(e=>{
    const s=getComputedStyle(e);return {color:s.color,bottom:s.marginBottom};
  }));
  expect(eyebrows.length).toBeGreaterThan(0);
  expect(eyebrows.every(e=>e.color==='rgb(191, 49, 82)'&&e.bottom==='4px')).toBe(true);
  await page.goto('/research.html');
  expect(await page.locator('.research-timeline-entry[data-current="true"]').count()).toBe(2);
});
