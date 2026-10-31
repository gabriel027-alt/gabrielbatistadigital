import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { nicheModels } from "../../lib/models";
test("17 new models plus original three, gallery filters and real previews", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".project-card")).toHaveCount(3);
  await expect(page.locator(".niche-preview-card")).toHaveCount(17);
  const gallery = page.locator("#modelos");
  await gallery.getByRole("button", { name: "Jurídico", exact: true }).click();
  await expect(gallery.locator(".niche-preview-card")).toHaveCount(2);
  await gallery.getByRole("button", { name: "Saúde", exact: true }).click();
  await expect(gallery.locator(".niche-preview-card")).toHaveCount(4);
  await gallery.getByRole("button", { name: "Experiências", exact: true }).click();
  await expect(gallery.locator(".niche-preview-card")).toHaveCount(3);
  await gallery.getByRole("button", { name: "Todos", exact: true }).click();
  await expect(gallery.locator(".niche-preview-card")).toHaveCount(17);
  await gallery.scrollIntoViewIfNeeded();
  await gallery.locator("img").evaluateAll(images => images.forEach(image => { if (image instanceof HTMLImageElement) image.loading = "eager"; }));
  await expect.poll(() => gallery.locator("img").evaluateAll(images => images.every(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0))).toBe(true);
  await gallery.getByRole("button", { name: "Ver próximos modelos" }).click();
  await expect.poll(() => gallery.locator(".niche-gallery-track").evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  await gallery.getByRole("button", { name: "Ver modelos anteriores" }).click();
  const preview = gallery.locator(".niche-preview-window").first();
  await preview.focus(); await page.keyboard.press("PageDown");
  await expect.poll(() => preview.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
});
for (const model of nicheModels) {
  test(`${model.slug}: complete responsive demo, interactions, contact and accessibility`, async ({ page }) => {
    const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
    const response = await page.goto(`/modelos/${model.slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(model.headline);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator(".model-hero-image")).toBeVisible();
    expect(await page.locator(".model-hero-image").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    for (const anchor of await page.locator('a[href^="#"]').evaluateAll(a => a.map(el => el.getAttribute("href")!))) expect(await page.locator(anchor).count()).toBe(1);
    const contact = page.locator("#interesse a"); const url = new URL((await contact.getAttribute("href"))!);
    expect(url.hostname).toBe("wa.me"); expect(url.pathname).toBe("/5538998267717"); expect(url.searchParams.get("text")).toContain(model.brand);
    if (model.slug === "energia") {
      await page.locator("#monthly-kwh").fill("1000"); await expect(page.locator("output")).toContainText("700 kWh/mês");
      await page.locator("#monthly-kwh").fill(""); await expect(page.locator("output")).toContainText("Informe um consumo");
    } else {
      const choices = page.locator(".model-choice-list button"); await choices.nth(1).click();
      await expect(choices.nth(1)).toHaveAttribute("aria-pressed", "true");
      await expect(page.locator(".model-choice-result h3")).toHaveText(model.services[1].title);
      await choices.nth(2).focus(); await page.keyboard.press("Enter");
      await expect(page.locator(".model-choice-result h3")).toHaveText(model.services[2].title);
    }
    await page.locator(".model-faq summary").first().click(); await expect(page.locator(".model-faq details").first()).toHaveAttribute("open", "");
    for (const width of [360, 768, 1440]) { await page.setViewportSize({ width, height: 900 }); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true); }
    const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(accessibility.violations).toEqual([]); expect(errors).toEqual([]);
  });
}
