import { test, expect } from "@playwright/test";

// Evidence for human review, not a claim of automatic aesthetic approval.
test.use({ video: "on" });
for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  test(`visual review ${viewport.width}px: themes and scroll to projects`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const portrait = page.locator(".portrait-photo img");
    await expect.poll(() => portrait.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    for (const theme of ["Dia", "Noite"]) {
      await page.getByRole("button", { name: theme, exact: true }).click();
      await expect(page.getByRole("button", { name: theme, exact: true })).toHaveAttribute("aria-pressed", "true");
      // Allow the actual CSS theme transition to settle before capturing it.
      await page.waitForTimeout(800);
      await testInfo.attach(`hero-${theme}-${viewport.width}`, {
        body: await page.screenshot(), contentType: "image/png",
      });
    }
    const target = await page.locator("#modelos").evaluate(el => el.getBoundingClientRect().top + scrollY);
    for (let step = 1; step <= 18; step++) {
      await page.evaluate(y => scrollTo({ top: y, behavior: "instant" }), target * step / 18);
      await page.waitForTimeout(70);
    }
    await expect(page.locator("#modelos")).toBeVisible();
    await testInfo.attach(`galeria-${viewport.width}`, {
      body: await page.screenshot(), contentType: "image/png",
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
