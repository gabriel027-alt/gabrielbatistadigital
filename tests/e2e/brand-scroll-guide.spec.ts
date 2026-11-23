import { expect, test, type Page } from "@playwright/test";

// The brands' scroll guide (components/brand/BrandScrollGuide.tsx, 23/11/2026): it comes back when the visitor stops,
// with the gesture, and never covers a word or a control.
const covered = (page: Page) => page.evaluate(() => {
  const guide = document.querySelector<HTMLElement>("[data-brand-scroll-guide]")!, r = guide.getBoundingClientRect(), hits: string[] = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), range = document.createRange();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent!.trim() || guide.contains(node) || !node.parentElement) continue;
    const style = getComputedStyle(node.parentElement);
    if (style.visibility === "hidden" || Number(style.opacity) < .06) continue;
    range.selectNodeContents(node);
    for (const b of range.getClientRects()) if (b.left < r.right && b.right > r.left && b.top < r.bottom && b.bottom > r.top) hits.push(node.textContent!.trim());
  }
  return hits;
});

for (const [route, viewport] of [["/modelos/psicologia", { width: 390, height: 844 }], ["/modelos/automoveis", { width: 390, height: 844 }], ["/modelos/previdenciario", { width: 1536, height: 696 }]] as const) {
  test(`The scroll guide comes back when the visitor stops on ${route} (${viewport.width}px) and covers no text`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(route);
    const guide = page.locator("[data-brand-scroll-guide]");
    for (const share of [.3, .55]) {
      await page.evaluate(share => scrollTo({ top: document.documentElement.scrollHeight * share, behavior: "instant" }), share);
      await expect(guide).toHaveAttribute("data-brand-scroll-guide", "on", { timeout: 8000 });
      await expect(guide.locator("svg").first()).toBeAttached();
      expect(await covered(page)).toEqual([]);
      await page.evaluate(() => scrollBy(0, 40));
      await expect(guide).toHaveAttribute("data-brand-scroll-guide", "off");
    }
  });
}

test("With reduced motion the brands show no scroll guide", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/modelos/psicologia");
  await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight * .3, behavior: "instant" }));
  await page.waitForTimeout(5600);
  await expect(page.locator("[data-brand-scroll-guide]")).toBeHidden();
  await context.close();
});
