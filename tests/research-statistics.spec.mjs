import { expect, test } from '@playwright/test';

// Isolate the research figures from unrelated font/map/registry availability.
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://fonts.googleapis.com/**', route => route.abort());
  await page.route('https://fonts.gstatic.com/**', route => route.abort());
  await page.route('https://cdn.jsdelivr.net/**', route => route.abort());
  await page.route('**/research-registry/main/dist/research-registry.json', route => route.fulfill({ json: { schema_version: '1.0' } }));
});

test('statistical figures retain project organization and identify synthetic inputs', async ({ page }) => {
  await page.goto('/research.html');
  await expect(page.locator('.research-project')).toHaveCount(10);
  await expect(page.locator('.rp-resource')).toHaveCount(30);
  await expect(page.locator('.research-figure svg')).toHaveCount(10);
  await expect(page.locator('.rp-stat-figure')).toHaveCount(9);
  await expect(page.locator('[data-evidence="Synthetic method demo"]')).toHaveCount(8);
  await expect(page.locator('.research-figure img, .research-figure canvas')).toHaveCount(0);
  await expect(page.locator('.process-point')).toHaveCount(7);
});

test('Figure 4 views work with keyboard and retain every phase and group', async ({ page }) => {
  await page.goto('/research.html');
  for (const view of ['religious','observed','civilian']) {
    const button = page.locator(`[data-target-view="${view}"]`);
    await button.focus();
    await button.press('Enter');
    await expect(button).toHaveAttribute('aria-pressed','true');
    const panel=page.locator('[data-target-panel]:not([hidden])');
    await expect(panel).toHaveCount(1);
    await expect(panel).toHaveAttribute('data-target-panel',view);
    await expect(panel.locator('.st-phase')).toHaveCount(3);
    await expect(panel.locator('.st-result')).toHaveCount(view === 'observed' ? 0 : 9);
    if (view === 'religious') await expect(panel).toContainText('conditional on a civilian attack');
    if (view === 'observed') await expect(panel.locator('.st-bar')).toHaveCount(18);
  }
  await page.locator('#paper-target-map summary').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#paper-target-map table')).toBeVisible();
  await expect(page.locator('#paper-target-map tbody tr')).toHaveCount(9);
  const csv = await page.request.get('/assets/data/ethnosectarian-figure4.csv');
  expect(csv.ok()).toBeTruthy();
  expect((await csv.text()).trim().split('\n')).toHaveLength(28);
});

test('plot labels stay inside their viewboxes across responsive widths', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-1440', 'This test owns its viewport matrix.');
  test.setTimeout(90000);
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  for (const width of [320,390,600,780,900,980,1024,1440,1920]) {
    await page.setViewportSize({width,height:1000});
    await page.goto('/research.html');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
    for (const view of ['civilian','religious','observed']) {
      await page.locator(`[data-target-view="${view}"]`).focus();
      await page.locator(`[data-target-view="${view}"]`).press('Enter');
      const outside=await page.locator('.rp-stat').evaluateAll(svgs => svgs.flatMap(svg => {
        const vb=svg.viewBox.baseVal;
        return [...svg.querySelectorAll('text')].filter(e=>!e.closest('[hidden]')).filter(e=>{
          const b=e.getBBox(); return b.x < -1 || b.x+b.width > vb.width+1 || b.y < -1 || b.y+b.height > vb.height+1;
        }).map(e=>e.textContent);
      }));
      expect(outside,`Labels at ${width}, ${view}`).toEqual([]);
    }
    if (width===390 || width===1440) {
      await page.locator('[data-target-view="civilian"]').click();
      await page.locator('#paper-target-map').screenshot({path:info.outputPath(`target-${width}.png`)});
    }
  }
  expect(errors).toEqual([]);
});

test('all numeric tables remain readable with JavaScript disabled', async ({ browser }, info) => {
  test.skip(info.project.name !== 'desktop-1440');
  const context=await browser.newContext({javaScriptEnabled:false,baseURL:'http://127.0.0.1:4173'});
  const page=await context.newPage();
  await page.route('https://**/*',route=>route.abort());
  await page.goto('/research.html');
  await expect(page.locator('.st-controls')).toBeHidden();
  await expect(page.locator('[data-target-panel="civilian"]')).toBeVisible();
  for (const details of await page.locator('.rp-stat-figure details').all()) {
    await details.locator('summary').click();
    await expect(details.locator('table')).toBeVisible();
  }
  await context.close();
});
