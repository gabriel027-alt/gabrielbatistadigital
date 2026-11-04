import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Aura review: working navigation, accessible disclosures and responsive layout", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/propostas/aura");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Um tempo para cuidar da sua pele.");
  await page.getByRole("link", { name: "Conhecer a primeira avaliação" }).click();
  await expect(page).toHaveURL(/#aura-avaliacao$/);
  await page.locator("summary").filter({ hasText: "O que precisa saber" }).click();
  await expect(page.getByText("Pergunte quem realiza o atendimento", { exact: false })).toBeVisible();
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow ${width}`).toBe(true);
  }
  await expect(page.getByRole("link", { name: "Conversar com Gabriel" })).toHaveAttribute("href", /wa.me\/5538998267717/);
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(audit.violations).toEqual([]);
});

test("Aura motion can be disabled; no-JavaScript and reduced-motion retain content", async ({ page, browser }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/propostas/aura");
  await page.getByRole("button", { name: "Desativar animações" }).click();
  await expect(page.getByRole("button", { name: "Ativar animações" })).toHaveAttribute("aria-pressed", "true");
  const glyphs = page.locator("h1 span span span");
  expect(await glyphs.first().evaluate(el => getComputedStyle(el).animationName)).toBe("none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("button", { name: "Ativar animações" })).toBeHidden();
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce" });
  const fallback = await context.newPage();
  await fallback.goto("http://127.0.0.1:3107/propostas/aura");
  await expect(fallback.getByRole("heading", { level: 1 })).toBeVisible();
  await fallback.locator("summary").filter({ hasText: "Como continuar" }).click();
  await expect(fallback.getByText("Antes de marcar, confirme disponibilidade", { exact: false })).toBeVisible();
  await context.close();
});
