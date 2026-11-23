import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Nítida (docs/PROJETOS-ESTATICOS.md): the second static brand. Eye-chart titles, photos that come into focus at a
// touch, who answers from the top, a local journey and, on phones, a call at the thumb.
const route = "/modelos/oftalmologia";

test("Nítida says who examines, keeps the careful promise and focuses a photo at a touch", async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 696 });
  await page.goto(route);
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Acordar e já ver as horas.");
  await expect(page.getByText("quando os exames indicam", { exact: false }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Avaliação com Beatriz Sallum, oftalmologista" })).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/nunca mais (usar|precisar)/i);
  const iris = page.locator("#antes figure");
  await expect(iris).toHaveAttribute("data-focus", "soft");
  await iris.getByRole("button", { name: "Toque para focar" }).click();
  await expect(iris).toHaveAttribute("data-focus", "sharp");
  await expect(iris.getByRole("button")).toHaveCount(0);
  await expect(page.locator("#tecnicas li h3")).toHaveText(["PRK", "LASIK", "Implante de lente"]);
  await page.waitForFunction(() => document.getAnimations().every(animation => animation.playState !== "running"));
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
});

test("Without JavaScript or with reduced motion every photo is sharp", async ({ browser }) => {
  for (const options of [{ javaScriptEnabled: false }, { reducedMotion: "reduce" as const }]) {
    const context = await browser.newContext({ ...options, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto(route);
    await expect(page.locator('figure[data-focus="soft"]')).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Toque para focar" })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await context.close();
  }
});

test("On a phone the call at the thumb waits for the top and opens the journey, which says who answers", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto(route);
  const sticky = page.locator(`a[href="#nitida-interesse"][data-show]`);
  await expect(sticky).toHaveAttribute("data-show", "false");
  await page.evaluate(() => scrollTo({ top: innerHeight * 2, behavior: "instant" }));
  await expect(sticky).toHaveAttribute("data-show", "true");
  await sticky.click();
  const dialog = page.getByRole("dialog");
  await dialog.getByText("Lentes de contato").click();
  await dialog.getByRole("button", { name: "Continuar" }).click();
  await dialog.getByText("Mar, piscina e esporte").click();
  await dialog.getByText("Nos próximos meses").click();
  await dialog.getByRole("button", { name: "Ver meu resumo" }).click();
  await expect(dialog.getByText("A recepção marca a avaliação")).toBeVisible();
  expect((await new AxeBuilder({ page }).include("dialog").withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
});
