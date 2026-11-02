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

test("featured directions change the demo and respect motion preferences", async ({ page }) => {
  await page.goto("/");
  const spotlight = page.locator(".project-spotlight");
  await spotlight.scrollIntoViewIfNeeded();
  const choices = spotlight.getByRole("group", { name: "Explorar direções de marca" }).getByRole("button");
  await choices.nth(1).focus();
  await page.keyboard.press("Enter");
  await expect(choices.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(spotlight.getByRole("link")).toHaveAttribute("href", "/modelos/psicologia");
  await expect.poll(() => spotlight.locator(".spotlight-scene img").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  await choices.nth(2).click();
  await expect(spotlight.getByRole("link")).toHaveAttribute("href", "/modelos/imoveis");
  await page.getByRole("button", { name: "Pausar animações" }).click();
  const progress = await spotlight.evaluate(el => (el as HTMLElement).style.getPropertyValue("--showcase-progress"));
  await page.mouse.wheel(0, 200);
  await page.waitForTimeout(150);
  expect(await spotlight.evaluate(el => (el as HTMLElement).style.getPropertyValue("--showcase-progress"))).toBe(progress);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => spotlight.locator(".spotlight-browser").evaluate(el => getComputedStyle(el).transform)).toBe("none");
  await page.setViewportSize({ width: 360, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
