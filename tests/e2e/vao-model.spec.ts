import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Vão (docs/PROJETOS-ESTATICOS.md): the sixth static brand. Who answers from the top (Clara Duarte, arquiteta), the
// routine plan, no invented works or prices, the local journey and the phone call bar.
const route = "/modelos/arquitetura";

test("Vão says who designs, shows the routine plan and never invents works or prices", async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 696 });
  await page.goto(route);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A casa começa pela rotina.");
  await expect(page.getByRole("link", { name: "Primeira conversa com Clara Duarte, arquiteta" })).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/R\$|m²|CAU|prêmio|obras entregues|clientes atendidos|\d+ dias|\d+ semanas/i);
  const plan = page.locator("#rotina ol > li");
  await expect(plan).toHaveCount(6);
  await expect(plan.first()).toContainText("O café das 7h");
  await expect(page.locator("#materiais li")).toHaveCount(5);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
});

test("Without JavaScript everything is there", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(route);
  for (const text of ["Antes do acabamento, o seu dia.", "Poucos materiais, escolhidos pelo uso.", "Quem desenha a sua casa.", "Como é cobrado?"]) await expect(page.getByText(text, { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test("On a phone the call at the thumb waits for the top and opens the journey, which says who answers", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto(route);
  const sticky = page.locator(`a[href="#vao-interesse"][data-show]`);
  await expect(sticky).toHaveAttribute("data-show", "false");
  await page.evaluate(() => scrollTo({ top: innerHeight * 2, behavior: "instant" }));
  await expect(sticky).toHaveAttribute("data-show", "true");
  await sticky.click();
  const dialog = page.getByRole("dialog");
  await dialog.getByText("Apartamento", { exact: true }).click();
  await dialog.getByRole("button", { name: "Continuar" }).click();
  await dialog.getByText("Recebendo as chaves").click();
  await dialog.getByText("Um ou dois ambientes").click();
  await dialog.getByRole("button", { name: "Ver meu resumo" }).click();
  await expect(dialog.getByText("A Clara marca a primeira conversa")).toBeVisible();
  expect((await new AxeBuilder({ page }).include("dialog").withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
});
