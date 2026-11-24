import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Fio (docs/PROJETOS-ESTATICOS.md): the third static brand. The head map, who answers from the top, the careful
// promise (the evaluation decides; sometimes treatment instead of surgery), the local journey and the phone call bar.
const route = "/modelos/capilar";

test("Fio says who examines, keeps the careful promise and lights one zone of the head at a time", async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 696 });
  await page.goto(route);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tirar o boné sem pensar duas vezes.");
  await expect(page.getByText("quando a avaliação indica", { exact: false }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Avaliação com Daniel Arruda, médico" })).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/para sempre|garantid|definitiv/i);
  const map = page.locator("[data-head-map]");
  await expect(map.getByRole("button", { pressed: true })).toHaveCount(1);
  await map.getByRole("button", { name: /Coroa/ }).click();
  await expect(map.getByRole("button", { name: /Coroa/ })).toHaveAttribute("aria-pressed", "true");
  await expect(map.locator("[aria-live]")).toContainText("A coroa costuma avançar por mais tempo");
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
});

test("Without JavaScript every zone of the head is explained in the list", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(route);
  for (const text of ["quanto as têmporas recuaram", "É a moldura do rosto", "nem sempre a resposta é cirurgia", "A coroa costuma avançar"]) await expect(page.getByText(text, { exact: false })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test("On a phone the call at the thumb waits for the top and opens the journey, which says who answers", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto(route);
  const sticky = page.locator(`a[href="#fio-interesse"][data-show]`);
  await expect(sticky).toHaveAttribute("data-show", "false");
  await page.evaluate(() => scrollTo({ top: innerHeight * 2, behavior: "instant" }));
  await expect(sticky).toHaveAttribute("data-show", "true");
  await sticky.click();
  const dialog = page.getByRole("dialog");
  await dialog.getByText("Entradas").click();
  await dialog.getByRole("button", { name: "Continuar" }).click();
  await dialog.getByText("De um a cinco anos").click();
  await dialog.getByText("Nos próximos meses").click();
  await dialog.getByRole("button", { name: "Ver meu resumo" }).click();
  await expect(dialog.getByText("A recepção marca a avaliação")).toBeVisible();
  expect((await new AxeBuilder({ page }).include("dialog").withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
});
