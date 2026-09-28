import { createRequire } from "node:module";
import { expect, test } from "@playwright/test";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");

function seconds(value) {
  if (!value) return 0;
  if (value.endsWith("ms")) return Number.parseFloat(value) / 1000;
  if (value.endsWith("s")) return Number.parseFloat(value);
  return Number.parseFloat(value) || 0;
}

test("military timeline remains centered, symmetric, and interactive", async ({ page }, testInfo) => {
  await page.clock.setFixedTime(new Date("2026-09-28T16:00:00Z"));
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

  await expect(timeline).toHaveScreenshot("military-timeline.png", {
    animations: "disabled",
    caret: "hide",
    maxDiffPixelRatio: 0.01
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

test("military timeline exposes every interactive item to the keyboard with a meaningful accessible name", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-09-28T16:00:00Z"));
  await page.goto("/about.html", { waitUntil: "networkidle" });

  const groups = [
    { selector: ".service-flow", count: 4 },
    { selector: ".rank-event", count: 4 },
    { selector: ".unit-event", count: 3 },
    { selector: ".training-event", count: 6 }
  ];

  for (const group of groups) {
    const items = page.locator(group.selector);
    await expect(items).toHaveCount(group.count);

    for (let index = 0; index < group.count; index += 1) {
      const item = items.nth(index);
      const accessibility = await item.evaluate((node) => ({
        tabIndex: node.tabIndex,
        name: (node.getAttribute("aria-label") || "").trim(),
        expanded: node.getAttribute("aria-expanded")
      }));

      expect(accessibility.tabIndex, `${group.selector}[${index}] should be keyboard focusable`).toBe(0);
      expect(accessibility.name.length, `${group.selector}[${index}] needs a meaningful accessible name`).toBeGreaterThan(4);
      expect(accessibility.expanded).toBe("false");

      await item.focus();
      await expect(item).toBeFocused();
      await item.press("Enter");
      await expect(item).toHaveAttribute("aria-expanded", "true");
      await page.keyboard.press("Escape");
      await expect(item).toHaveAttribute("aria-expanded", "false");
    }
  }
});

test("military chronology remains available without JavaScript", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440", "No-JS fallback only needs one browser pass.");

  const context = await browser.newContext({
    baseURL: "http://127.0.0.1:4173",
    javaScriptEnabled: false,
    viewport: { width: 900, height: 1000 }
  });
  const page = await context.newPage();

  await page.goto("/about.html", { waitUntil: "load" });
  const fallback = page.locator(".timeline-noscript");
  await expect(fallback).toBeVisible();
  await expect(page.locator(".timeline-noscript-list li")).toHaveCount(15);
  await expect(fallback).toContainText("PV2 · Private");
  await expect(fallback).toContainText("Officer Commissioning Candidate");
  await expect(fallback).toContainText("2LT · Second Lieutenant");

  await context.close();
});

test("military timeline has explicit forced-colors behavior", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440", "Forced-colors behavior only needs one browser pass.");

  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/about.html", { waitUntil: "networkidle" });

  const state = await page.evaluate(() => {
    const marker = getComputedStyle(document.querySelector(".current-day-marker"));
    const infantry = getComputedStyle(document.querySelector(".service-flow--infantry"));
    const popover = getComputedStyle(document.querySelector(".training-popover-box"));

    return {
      forcedColors: window.matchMedia("(forced-colors: active)").matches,
      markerShadow: marker.boxShadow,
      infantryFill: infantry.fill,
      infantryStroke: infantry.stroke,
      popoverShadow: popover.boxShadow
    };
  });

  expect(state.forcedColors).toBe(true);
  expect(state.markerShadow).toBe("none");
  expect(state.popoverShadow).toBe("none");
  expect(state.infantryFill).not.toBe("none");
  expect(state.infantryStroke).not.toBe("none");
});

test("military timeline exposes its visual grammar to screen readers", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440", "Screen-reader explanation only needs one browser pass.");

  await page.goto("/about.html", { waitUntil: "networkidle" });
  const timeline = page.locator("#military-career-timeline");
  const help = page.locator("#military-timeline-help");

  await expect(timeline).toHaveAttribute("role", "region");
  await expect(timeline).toHaveAttribute("aria-describedby", "military-timeline-help");
  await expect(help).toContainText("solid line represents completed service time");
  await expect(help).toContainText("dashed line represents the projected period");
  await expect(help).toContainText("red Today marker");
  await expect(help).toContainText("dashed 2LT rank marker");
});

test("military section passes axe-core WCAG A and AA checks", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "tablet-900", "Axe scans target desktop and mobile.");

  await page.clock.setFixedTime(new Date("2026-09-28T16:00:00Z"));
  await page.goto("/about.html", { waitUntil: "networkidle" });
  await page.addScriptTag({ path: axePath });

  const results = await page.evaluate(async () => {
    const target = document.querySelector('section[aria-labelledby="military-title"]');
    return window.axe.run(target, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa"]
      }
    });
  });

  const violations = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    help: violation.help,
    nodes: violation.nodes.map((node) => ({
      target: node.target,
      failureSummary: node.failureSummary
    }))
  }));

  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("military timeline responds to increased-contrast preference", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440", "Contrast preference only needs one browser pass.");

  await page.emulateMedia({ contrast: "more" });
  await page.goto("/about.html", { waitUntil: "networkidle" });

  const state = await page.evaluate(() => {
    const flow = getComputedStyle(document.querySelector(".service-flow--infantry"));
    const label = getComputedStyle(document.querySelector(".current-day-label"));

    return {
      prefersMore: window.matchMedia("(prefers-contrast: more)").matches,
      flowOpacity: Number.parseFloat(flow.opacity),
      todayColor: label.color
    };
  });

  expect(state.prefersMore).toBe(true);
  expect(state.flowOpacity).toBeGreaterThanOrEqual(0.42);
  expect(state.todayColor).not.toBe("rgb(168, 111, 130)");
});
