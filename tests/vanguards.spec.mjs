import { expect, test } from '@playwright/test';

const views=['profiles','comparison','linkage'];
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.route('https://fonts.googleapis.com/**',r=>r.abort());
  await page.route('https://fonts.gstatic.com/**',r=>r.abort());
  await page.route('https://cdn.jsdelivr.net/**',r=>r.abort());
  await page.route('**/research-registry/main/dist/research-registry.json',r=>r.fulfill({json:{schema_version:'1.0'}}));
});

test('Vanguards views retain source values and keyboard controls',async ({page}, info)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/research.html');
  const figure=page.locator('#paper-vanguards .rp-stat-figure');
  await expect(figure).toHaveAttribute('data-evidence','2022 thesis · reported');
  await expect(figure.locator('svg')).toHaveCount(1);
  await expect(figure.locator('img,canvas')).toHaveCount(0);
  await expect(figure.locator('.vg-cell')).toHaveCount(66);
  await expect(figure.locator('.vg-share')).toHaveCount(20);
  await expect(figure.locator('.vg-linkage')).toHaveCount(10);
  const source=await (await page.request.get('/assets/data/vanguards-thesis.json')).json();
  for(const key of views){
    const button=figure.locator(`[data-vanguards-view="${key}"]`);
    await button.focus();await button.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed','true');
    const panel=figure.locator('[data-vanguards-panel]:not([hidden])');
    await expect(panel).toHaveCount(1);
    await expect(panel).toHaveAttribute('data-vanguards-panel',key);
    await expect(panel).toHaveAttribute('aria-hidden','false');
  }
  for(const cell of await figure.locator('.vg-cell').all()){
    const name=await cell.getAttribute('data-unit');const metric=await cell.getAttribute('data-metric');
    const row=source.records.find(r=>r.name===name);
    expect(await cell.getAttribute('data-value')).toBe(metric==='Suicide'?row.suicide:row.tactics[metric]);
  }
  await figure.locator('summary').focus();await page.keyboard.press('Enter');
  await expect(figure.locator('table')).toBeVisible();
  await expect(figure.locator('tbody tr')).toHaveCount(11);
  const csv=await page.request.get('/assets/data/vanguards-thesis.csv');
  expect(csv.ok()).toBeTruthy();expect((await csv.text()).trim().split('\n')).toHaveLength(266);
  expect(errors).toEqual([]);
  await figure.locator('summary').click();
  await figure.locator('[data-vanguards-view="profiles"]').click();
  await page.locator('#paper-vanguards').screenshot({path:info.outputPath('vanguards-row.png')});
});

test('all Vanguards labels fit and the page does not overflow',async ({page},info)=>{
  test.skip(info.project.name!=='desktop-1440','Own viewport matrix.');test.setTimeout(90000);
  for(const width of [320,390,600,780,900,980,1024,1440,1920]){
    await page.setViewportSize({width,height:1000});await page.goto('/research.html');
    for(const view of views){
      const button=page.locator(`[data-vanguards-view="${view}"]`);
      await button.focus();await button.press('Enter');
      const clipped=await page.locator('#paper-vanguards svg').evaluate(svg=>{
        const vb=svg.viewBox.baseVal;
        return [...svg.querySelectorAll('text')].filter(e=>!e.closest('[hidden]')).filter(e=>{
          const b=e.getBBox();return b.x < -1 || b.y < -1 || b.x+b.width>vb.width+1 || b.y+b.height>vb.height+1;
        }).map(e=>e.textContent);
      });
      expect(clipped,`${width}/${view}`).toEqual([]);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
    }
  }
});

test('no-JavaScript source table and default profile remain accessible',async ({browser},info)=>{
  test.skip(info.project.name!=='desktop-1440');
  const context=await browser.newContext({javaScriptEnabled:false,baseURL:'http://127.0.0.1:4173'});
  const page=await context.newPage();await page.route('https://**/*',r=>r.abort());await page.goto('/research.html');
  await expect(page.locator('.vg-controls')).toBeHidden();
  await expect(page.locator('[data-vanguards-panel="profiles"]')).toBeVisible();
  await page.locator('#paper-vanguards summary').click();await expect(page.locator('#paper-vanguards table')).toBeVisible();
  await context.close();
});
