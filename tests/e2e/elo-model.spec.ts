import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Elo (docs/PROJETOS-ESTATICOS.md): the fourth static brand and the strictest in content. The path of five stops, who
// answers from the top, no rates or promises, the local journey and the phone call bar.
const route = "/modelos/fertilidade";

test("Elo says who accompanies, never promises and lights one stop of the path at a time", async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 696 });
  await page.goto(route);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Um passo de cada vez, e você sabe qual é o próximo.");
  await expect(page.getByRole("link", { name: "Primeira consulta com Luísa Andrade, médica" })).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/taxa de sucesso|garantid|realize o seu sonho|\d+ ?%/i);
  const path = page.locator("[data-elo-path]");
  await expect(path.getByRole("button", { pressed: true })).toHaveCount(1);
  await path.getByRole("button", { name: /As possibilidades/ }).click();
  await expect(path.getByRole("button", { name: /As possibilidades/ })).toHaveAttribute("aria-pressed", "true");
  await expect(path.locator("[aria-live]")).toContainText("Muitas vezes o caminho é mais simples");
  await expect(page.locator("#possibilidades li h3")).toHaveCount(5);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
});

test("Without JavaScript every stop of the path is explained", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(route);
  for (const text of ["Ninguém precisa chegar sabendo o que pedir", "Cada exame pedido tem um motivo", "em palavras claras", "Muitas vezes o caminho é mais simples", "Cada etapa tem retorno marcado"]) await expect(page.getByText(text, { exact: false })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test("On a phone the call at the thumb waits for the top and opens the journey, which says who answers", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto(route);
  const sticky = page.locator(`a[href="#elo-interesse"][data-show]`);
  await expect(sticky).toHaveAttribute("data-show", "false");
  await page.evaluate(() => scrollTo({ top: innerHeight * 2, behavior: "instant" }));
  await expect(sticky).toHaveAttribute("data-show", "true");
  await sticky.click();
  const dialog = page.getByRole("dialog");
  await dialog.getByText("Eu, sozinha").click();
  await dialog.getByRole("button", { name: "Continuar" }).click();
  await dialog.getByText("Pensando em congelar óvulos").click();
  await dialog.getByText("Nos próximos meses").click();
  await dialog.getByRole("button", { name: "Ver meu resumo" }).click();
  await expect(dialog.getByText("A recepção marca a primeira consulta")).toBeVisible();
  expect((await new AxeBuilder({ page }).include("dialog").withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
});
