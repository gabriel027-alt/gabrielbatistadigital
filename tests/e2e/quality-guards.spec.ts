import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Guards from the 13/11/2026 review (Vercel Web Interface Guidelines, pinned in .agents/skills/web-interface-guidelines,
// plus the checks borrowed from the taste-skill evaluation): touch targets, 320px phones, accessibility at rest,
// and photographs that are never stretched far past their own pixels.

const brandRoutes = ["/modelos/odontologia", "/modelos/cirurgia-plastica", "/modelos/veterinaria", "/modelos/hotelaria", "/modelos/patrimonio"];

async function walk(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 500) { await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(40); }
  await page.evaluate(() => scrollTo(0, 0));
}

test.describe("phones down to 320px", () => {
  test.use({ viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  test("the homepage never scrolls sideways and every control outside running text is at least 44px tall", async ({ page }) => {
    await page.goto("/");
    await walk(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    const small = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>("a[href],button,summary")]
      .filter(el => !el.closest("dialog:not([open])") && el.getClientRects().length && getComputedStyle(el).visibility !== "hidden")
      // Links set inside a sentence or a heading follow the text (WCAG 2.5.8 inline exception).
      .filter(el => !el.closest("p,li,h1,h2,h3"))
      .map(el => ({ name: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 30), h: Math.round(el.getBoundingClientRect().height) }))
      .filter(item => item.h < 44));
    expect(small).toEqual([]);
  });
});

for (const viewport of [{ width: 1536, height: 696 }, { width: 390, height: 844 }]) {
  test(`the homepage at rest has no axe violations at ${viewport.width}px`, async ({ browser }) => {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce", isMobile: viewport.width < 700, hasTouch: viewport.width < 700 });
    const page = await context.newPage();
    await page.goto("/");
    await walk(page);
    const result = await new AxeBuilder({ page }).analyze();
    expect(result.violations.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(" ")).slice(0, 3).join(", ")}`)).toEqual([]);
    await context.close();
  });
}

for (const device of [{ name: "PC at 125%", viewport: { width: 1536, height: 696 }, scale: 1.25, mobile: false }, { name: "phone", viewport: { width: 412, height: 915 }, scale: 2.625, mobile: true }]) {
  test(`no photograph is stretched past 1.5x its own pixels (${device.name})`, async ({ browser }) => {
    test.setTimeout(120_000);
    const context = await browser.newContext({ viewport: device.viewport, deviceScaleFactor: device.scale, isMobile: device.mobile, hasTouch: device.mobile, reducedMotion: "reduce" });
    const page = await context.newPage();
    const stretched: string[] = [];
    for (const route of ["/", ...brandRoutes]) {
      await page.goto(route);
      await walk(page);
      stretched.push(...await page.evaluate(async dpr => {
        const out: string[] = [];
        for (const img of [...document.images]) {
          const box = img.getBoundingClientRect();
          if (box.width < 160 || box.height < 160 || !img.naturalWidth) continue;
          const url = new URL(img.currentSrc, location.href);
          const file = url.searchParams.get("url") || url.pathname;
          const original = new Image(); original.src = file;
          try { await original.decode(); } catch { continue; }
          const served = Math.min(Number(url.searchParams.get("w")) || original.naturalWidth, original.naturalWidth);
          const servedHeight = served * original.naturalHeight / original.naturalWidth;
          // object-fit: cover needs the larger of the two ratios.
          const need = Math.max(box.width * dpr / served, box.height * dpr / servedHeight);
          if (need > 1.5) out.push(`${location.pathname} ${file} x${need.toFixed(2)}`);
        }
        return out;
      }, device.scale));
    }
    expect(stretched).toEqual([]);
    await context.close();
  });
}
