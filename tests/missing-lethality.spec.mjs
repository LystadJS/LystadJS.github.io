import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://fonts.googleapis.com/**', r => r.abort());
  await page.route('https://fonts.gstatic.com/**', r => r.abort());
  await page.route('https://cdn.jsdelivr.net/**', r => r.abort());
  await page.route('**/research-registry/main/dist/research-registry.json', r => r.fulfill({ json: { schema_version: '1.0' } }));
});

test('missing-lethality diagnostics are native, disclosed, and accessible', async ({ page }, info) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/research.html');
  const figure = page.locator('#paper-estimating-lethality .rp-stat-figure');
  await expect(figure).toHaveAttribute('data-evidence', 'Synthetic method demo');
  await expect(figure.locator('svg')).toHaveCount(1);
  await expect(figure.locator('img,canvas')).toHaveCount(0);
  await expect(figure.locator('.mi-cell')).toHaveCount(96);
  await expect(figure.locator('[data-mi-trace]')).toHaveCount(10);
  await expect(figure.locator('[data-mi-estimate]')).toHaveCount(5);
  await expect(figure.locator('.mi-pooled')).toHaveCount(1);
  await expect(figure.locator('figcaption')).toContainText('Synthetic data');
  await expect(figure).toContainText('Imputed SD');
  await figure.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(figure.locator('table')).toBeVisible();
  await expect(figure.locator('tbody tr')).toHaveCount(6);
  const response = await page.request.get('/assets/data/missing-lethality-mice-demo.json');
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data.chains).toHaveLength(5);
  expect(data.chains.every(c => c.trace.length === 20)).toBe(true);
  expect(data.pooled.total).toBeGreaterThan(data.pooled.within);
  await page.keyboard.press('Enter');
  await figure.locator('summary').evaluate(e => e.blur());
  await figure.screenshot({ path: info.outputPath('missing-lethality.png') });
  expect(errors).toEqual([]);
});
