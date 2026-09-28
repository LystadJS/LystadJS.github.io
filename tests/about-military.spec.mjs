import { expect, test } from "@playwright/test";

function seconds(value) {
  if (!value) return 0;
  if (value.endsWith("ms")) return Number.parseFloat(value) / 1000;
  if (value.endsWith("s")) return Number.parseFloat(value);
  return Number.parseFloat(value) || 0;
}

test("military timeline remains centered, symmetric, and interactive", async ({ page }, testInfo) => {
  await page.goto("/about.html", { waitUntil: "networkidle" });

  const section = page.locator('section[aria-labelledby="military-title"]');
  const timeline = page.locator("#military-career-timeline");
  const canvas = page.locator("#military-timeline-canvas");

  await expect(section).toBeVisible();
  await expect(timeline).toBeVisible();
  await expect(canvas).toBeVisible();

  await expect(page.locator(".unit-event")).toHaveCount(3);
  await expect(page.locator(".training-event")).toHaveCount(6);
  await expect(page.locator(".rank-event")).toHaveCount(4);
  await expect(page.locator(".service-flow")).toHaveCount(4);
  await expect(page.locator(".year-tick")).toHaveCount(6);

  const geometry = await page.evaluate(() => {
    const rect = (selector) => document.querySelector(selector)?.getBoundingClientRect();
    const career = rect("#military-career-timeline");
    const canvas = rect("#military-timeline-canvas");
    const pre = rect(".service-sankey--preofficer");
    const officer = rect(".service-sankey--officer");
    const past = rect(".past-service-continuation");
    const future = rect(".future-service-continuation");

    const visibleSelectors = [
      ".unit-event img",
      ".rank-insignia",
      ".rank-insignia-svg",
      ".qualification-icon",
      ".year-tick-label"
    ];

    const visibleRects = visibleSelectors.flatMap((selector) =>
      [...document.querySelectorAll(selector)].map((node) => {
        const box = node.getBoundingClientRect();
        return {
          selector,
          left: box.left,
          right: box.right,
          top: box.top,
          bottom: box.bottom,
          width: box.width,
          height: box.height
        };
      })
    );

    return {
      viewportWidth: window.innerWidth,
      canvasLeftSpace: canvas.left - career.left,
      canvasRightSpace: career.right - canvas.right,
      serviceLeftOverscan: canvas.left - pre.left,
      serviceRightOverscan: officer.right - canvas.right,
      pastWidth: past.width,
      futureWidth: future.width,
      visibleRects
    };
  });

  expect(Math.abs(geometry.canvasLeftSpace - geometry.canvasRightSpace)).toBeLessThanOrEqual(2);
  expect(Math.abs(geometry.serviceLeftOverscan - geometry.serviceRightOverscan)).toBeLessThanOrEqual(2);
  expect(Math.abs(geometry.pastWidth - geometry.futureWidth)).toBeLessThanOrEqual(1);

  for (const box of geometry.visibleRects) {
    if (box.width === 0 || box.height === 0) continue;
    expect(
      box.left,
      `${box.selector} should not clip the left viewport edge`
    ).toBeGreaterThanOrEqual(-1);
    expect(
      box.right,
      `${box.selector} should not clip the right viewport edge`
    ).toBeLessThanOrEqual(geometry.viewportWidth + 1);
  }

  await timeline.evaluate((node) => node.scrollIntoView({ block: "center", inline: "nearest" }));
  await page.waitForTimeout(200);
  await timeline.screenshot({
    path: testInfo.outputPath(`military-timeline-${testInfo.project.name}.png`)
  });

  const leader = page.locator(".service-flow--leader");
  const leaderLabel = page.locator(".service-flow-label--leader");
  await leader.click();
  await expect(leader).toHaveAttribute("aria-expanded", "true");
  await expect(leaderLabel).toHaveCSS("visibility", "visible");

  const privateRank = page.locator('[data-event-id="pv2"]');
  await privateRank.locator(".rank-insignia").click();
  await expect(privateRank).toHaveAttribute("aria-expanded", "true");
  await expect(leader).toHaveAttribute("aria-expanded", "false");

  const todayOpacity = await page.locator(".current-day-label").evaluate((node) =>
    Number.parseFloat(getComputedStyle(node).opacity)
  );
  expect(todayOpacity).toBeLessThan(0.5);

  await page.keyboard.press("Escape");
  await expect(privateRank).toHaveAttribute("aria-expanded", "false");

});

test("military timeline respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about.html", { waitUntil: "networkidle" });

  const durations = await page.evaluate(() => {
    const selectors = [
      ".service-flow",
      ".current-day-marker",
      ".current-day-label",
      ".unit-event-label",
      ".training-popover"
    ];

    return selectors.map((selector) => {
      const node = document.querySelector(selector);
      return {
        selector,
        transitionDuration: node ? getComputedStyle(node).transitionDuration : ""
      };
    });
  });

  for (const item of durations) {
    const longest = item.transitionDuration
      .split(",")
      .map((part) => seconds(part.trim()))
      .reduce((max, value) => Math.max(max, value), 0);
    expect(longest, `${item.selector} transition should be effectively disabled`).toBeLessThanOrEqual(0.00002);
  }
});
