import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const brand of ["aura", "orla"] as const) {
  test(`${brand}: CTA opens a keyboard-accessible local journey without submitting data`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    const submissions: string[] = [];
    page.on("request", request => { if (request.method() === "POST") submissions.push(request.url()); });
    await page.goto(`/propostas/${brand}`);
    const opener = page.getByRole("link", { name: brand === "aura" ? "Quero uma avaliação" : "Encontrar meu imóvel", exact: true }).first();
    await opener.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { level: 3 })).toBeFocused();
    await dialog.getByRole("button", { name: "Continuar", exact: true }).click();
    await expect(dialog.locator('input[type="radio"]').first()).toBeFocused();
    expect(await dialog.locator('input:invalid').count()).toBeGreaterThan(0);
    await dialog.getByRole("radio").first().check();
    const first = await dialog.getByRole("radio").first().inputValue();
    await dialog.getByRole("button", { name: "Continuar", exact: true }).click();
    await expect(dialog.getByRole("heading", { level: 3 })).toBeFocused();
    await dialog.getByRole("button", { name: "Voltar", exact: true }).click();
    await expect(dialog.getByRole("radio").first()).toBeChecked();
    await dialog.getByRole("button", { name: "Continuar", exact: true }).click();
    await dialog.getByRole("radio").first().check();
    if (brand === "orla") {
      await dialog.getByRole("button", { name: "Continuar", exact: true }).click();
      for (const fieldset of await dialog.locator("fieldset").all()) await fieldset.getByRole("radio").first().check();
    }
    await dialog.getByRole("button", { name: "Ver meu resumo", exact: true }).click();
    await expect(dialog.locator("dd").first()).toHaveText(first);
    await expect(dialog).toContainText("Nada é enviado");
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    await dialog.getByRole("button", { name: "Voltar ao site", exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
    await page.locator(`[data-inquiry="${brand}"]`).getByRole("button", { name: "Rever minhas escolhas" }).click();
    await expect(dialog.locator("dd").first()).toHaveText(first);
    await dialog.getByRole("button", { name: "Ajustar escolhas" }).click();
    await expect(dialog.getByRole("radio").first()).toBeChecked();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    expect(submissions).toEqual([]);
  });

  test(`${brand}: mobile dialog scrolls and can be closed without keyboard`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto(`/propostas/${brand}`);
    await page.locator(`[data-inquiry="${brand}"]`).getByRole("button", { name: brand === "aura" ? "Quero uma avaliação" : "Encontrar meu imóvel", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate(el => el.getBoundingClientRect().width)).toBeLessThanOrEqual(360);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await dialog.getByRole("radio").last().check();
    await dialog.getByRole("button", { name: "Continuar", exact: true }).click();
    await dialog.getByRole("button", { name: "Fechar roteiro" }).click();
    await expect(dialog).toBeHidden();
  });

  test(`${brand}: no-JavaScript CTA retains a readable destination`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto(`/propostas/${brand}`);
    await page.getByRole("link", { name: brand === "aura" ? "Quero uma avaliação" : "Encontrar meu imóvel", exact: true }).last().click();
    await expect(page).toHaveURL(new RegExp(`#${brand}-interesse$`));
    await expect(page.locator(`[data-inquiry="${brand}"] noscript`)).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await context.close();
  });
}

test("Both local CTA recordings load and play in the preview page", async ({ page }) => {
  await page.goto("/propostas/jornadas");
  for (const brand of ["Aura", "Orla"]) {
    const video = page.getByLabel(`Jornada de interesse ${brand}`);
    await expect.poll(() => video.evaluate(el => (el as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(1);
    expect(await video.evaluate(el => (el as HTMLVideoElement).duration)).toBeGreaterThan(10);
    await video.evaluate(el => (el as HTMLVideoElement).play());
    await expect.poll(() => video.evaluate(el => (el as HTMLVideoElement).currentTime)).toBeGreaterThan(.3);
    await video.evaluate(el => (el as HTMLVideoElement).pause());
  }
});
