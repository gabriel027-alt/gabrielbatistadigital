import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Eixo (docs/PROJETOS-ESTATICOS.md): the fifth static brand. Who answers from the top (the reception, no doctor's
// name), the treatment staircase, no promises of recovery time, the local journey and the phone call bar.
const route = "/modelos/ortopedia";

test("Eixo says the reception answers, never promises and climbs the staircase from the simplest step", async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 696 });
  await page.goto(route);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Subir a escada sem pensar nela.");
  await expect(page.locator("[data-who-answers]")).toHaveText("A recepção responde e marca a sua avaliação.");
  await expect(page.locator("body")).not.toContainText(/garantid|para sempre|sem dor|\d+ dias|\d+ semanas|\d+ ?%|CRM/i);
  const steps = page.locator("#escada ol > li");
  await expect(steps).toHaveCount(5);
  await expect(steps.first()).toContainText("Orientação e fortalecimento");
  await expect(steps.last()).toContainText("Prótese");
  // A staircase: each step stands taller than the one before.
  const heights = await steps.evaluateAll(items => items.map(item => item.getBoundingClientRect().height));
  for (let i = 1; i < heights.length; i++) expect(heights[i]).toBeGreaterThan(heights[i - 1]);
  await expect(page.locator("#o-que-ficou-dificil dt")).toHaveCount(6);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
});

test("Without JavaScript everything is there", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(route);
  for (const text of ["Nem toda dor é cirurgia.", "Joelho, quadril e coluna.", "Quem responde é a recepção.", "Toda dor no joelho termina em cirurgia?"]) await expect(page.getByText(text, { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test("On a phone the call at the thumb waits for the top and opens the journey, which says who answers", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto(route);
  const sticky = page.locator(`a[href="#eixo-interesse"][data-show]`);
  await expect(sticky).toHaveAttribute("data-show", "false");
  await page.evaluate(() => scrollTo({ top: innerHeight * 2, behavior: "instant" }));
  await expect(sticky).toHaveAttribute("data-show", "true");
  await sticky.click();
  const dialog = page.getByRole("dialog");
  await dialog.getByText("Joelho", { exact: true }).click();
  await dialog.getByRole("button", { name: "Continuar" }).click();
  await dialog.getByText("Subir ou descer escada").click();
  await dialog.getByText("Mais de um ano").click();
  await dialog.getByRole("button", { name: "Ver meu resumo" }).click();
  await expect(dialog.getByText("A recepção marca a avaliação")).toBeVisible();
  expect((await new AxeBuilder({ page }).include("dialog").withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
});
