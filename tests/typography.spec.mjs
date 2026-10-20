import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';

const pages = execFileSync('git', ['ls-files', '*.html'], { encoding: 'utf8' }).trim().split(/\r?\n/);

test('every page loads the self-hosted font framework and semantic font roles', async ({ page }, info) => {
  test.skip(info.project.name === 'tablet-900', 'Desktop and mobile cover every page; the layout suite covers tablet breakpoints.');
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://**/*', route => route.abort());
  const fontErrors = [];
  page.on('response', response => {
    if (response.url().includes('/assets/fonts/') && response.status() !== 200) fontErrors.push(response.url());
  });
  for (const file of pages) {
    await page.goto(`/${file}`);
    const result = await page.evaluate(async () => {
      const faces = await Promise.all(['Fraunces', 'Schibsted Grotesk', 'Commit Mono'].map(async name => {
        const loaded = await document.fonts.load(`400 16px "${name}"`, 'Statistics 01 é');
        return { name, loaded: loaded.length > 0 && loaded.every(face => face.status === 'loaded') };
      }));
      return {
        faces,
        body: getComputedStyle(document.body).fontFamily,
        headings: [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => ({ tag: h.tagName, family: getComputedStyle(h).fontFamily })),
        technical: [...document.querySelectorAll('code,pre,kbd,samp,[data-section-index]')].map(e => getComputedStyle(e).fontFamily)
      };
    });
    expect(result.faces.every(face => face.loaded), `${file}: font files actually decoded`).toBe(true);
    expect(result.body, file).toContain('Schibsted Grotesk');
    for (const h of result.headings) expect(h.family, `${file} ${h.tag}`).toContain(['H1','H2'].includes(h.tag) ? 'Fraunces' : 'Schibsted Grotesk');
    for (const family of result.technical) expect(family, `${file}: technical face`).toContain('Commit Mono');
    if (['index.html', 'about.html', 'research.html', 'code.html', 'cv.html', 'un/index.html'].includes(file)) {
      await page.screenshot({ path: info.outputPath(`${file.replace('.html', '').replaceAll('/', '-')}-typography.png`) });
      if (await page.locator('[data-section-index]').count()) {
        await page.locator('[data-section-index]').first().scrollIntoViewIfNeeded();
        await page.screenshot({ path: info.outputPath(`${file.replace('.html', '')}-section.png`) });
      }
    }
  }
  expect(fontErrors).toEqual([]);
});
