import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Lavra (docs/PROJETOS-ESTATICOS.md): the seventh static brand. Who answers from the top (the atelier), the path from
// drawing to piece, no invented carats, certificates, prices or deadlines, the local journey and the phone call bar.
const route = "/modelos/joalheria";

test("Lavra says the atelier answers, shows drawing to piece and never invents carats, prices or deadlines", async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 696 });
  await page.goto(route);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Toda joia começa por uma história.");
  await expect(page.locator("[data-who-answers]")).toHaveText("O ateliê responde e marca a sua conversa.");
  await expect(page.locator("body")).not.toContainText(/R\$|quilat|\d+k\b|certificad|garantia|\d+ dias|\d+ semanas|clientes/i);
  const stages = page.locator("#processo ol > li");
  await expect(stages).toHaveCount(4);
  await expect(stages.first()).toContainText("A história e o desenho");
  await expect(stages.last()).toContainText("O acabamento");
  await expect(page.locator("#pecas li")).toHaveCount(4);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
});

test("Without JavaScript everything is there", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(route);
  for (const text of ["Do desenho à peça.", "A última palavra é da sua mão.", "Quem responde é o ateliê.", "Posso usar o ouro de uma joia antiga?"]) await expect(page.getByText(text, { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test("On a phone the call at the thumb waits for the top and opens the journey, which says who answers", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto(route);
  const sticky = page.locator(`a[href="#lavra-interesse"][data-show]`);
  await expect(sticky).toHaveAttribute("data-show", "false");
  await page.evaluate(() => scrollTo({ top: innerHeight * 2, behavior: "instant" }));
  await expect(sticky).toHaveAttribute("data-show", "true");
  await sticky.click();
  const dialog = page.getByRole("dialog");
  await dialog.getByText("Alianças", { exact: true }).click();
  await dialog.getByRole("button", { name: "Continuar" }).click();
  await dialog.getByText("Casamento marcado").click();
  await dialog.getByText("Nos próximos meses").click();
  await dialog.getByRole("button", { name: "Ver meu resumo" }).click();
  await expect(dialog.getByText("O ateliê marca a conversa")).toBeVisible();
  expect((await new AxeBuilder({ page }).include("dialog").withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
});
