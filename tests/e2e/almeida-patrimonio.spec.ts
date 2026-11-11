import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Almeida & Valença follows the reference legal format and has a local contact flow", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  const response = await page.goto("/modelos/patrimonio");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Inventário e planejamento sucessório conduzidos com clareza.");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator(".model-notice, .model-hero, .brand-story")).toHaveCount(0);

  // Full-width hero photo, three inventory doubts, four practice areas, five steps.
  expect((await page.locator("#almeida-inicio img").boundingBox())!.width).toBeGreaterThan(1400);
  await expect(page.locator("#inventario article")).toHaveCount(3);
  await expect(page.locator("#atuacao article")).toHaveCount(4);
  await expect(page.locator('[aria-labelledby="passos-titulo"] li')).toHaveCount(5);

  // Legal advertising: informative, no promises of result; no WhatsApp inside the brand.
  const text = (await page.locator("main").innerText()).toLowerCase();
  for (const promise of ["garantimos", "resultado garantido", "100%", "sem conflitos"]) expect(text).not.toContain(promise);
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);

  expect(await page.locator('a[href="#almeida-interesse"]').count()).toBeGreaterThanOrEqual(5);
  await page.getByRole("link", { name: "Tirar minhas dúvidas" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByText("Preciso abrir um inventário").click();
  await dialog.getByRole("button", { name: "Continuar" }).click();
  await dialog.getByText("Online", { exact: true }).click();
  await dialog.getByText("Esta semana").click();
  await dialog.getByRole("button", { name: "Ver meu resumo" }).click();
  await expect(dialog.getByRole("heading", { name: "Sua conversa, preparada." })).toBeVisible();
  await expect(dialog).toContainText("Preciso abrir um inventário");
  await dialog.getByRole("button", { name: "Voltar ao site" }).click();
  await expect(dialog).toBeHidden();

  await page.getByText("O atendimento pode ser online?").click();
  await expect(page.locator("#duvidas details").nth(3)).toHaveAttribute("open", "");
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
});

test("Almeida & Valença keeps its content without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/modelos/patrimonio");
  for (const name of ["Inventário", "Planejamento sucessório", "Partilha e acordos", "Testamentos"]) await expect(page.getByRole("heading", { level: 3, name, exact: true })).toBeVisible();
  await expect(page.getByText("A divisão é formalizada")).toBeVisible();
  await context.close();
});
