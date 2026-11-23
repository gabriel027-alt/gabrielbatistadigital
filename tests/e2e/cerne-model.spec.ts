import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Cerne Implantes (docs/PROJETOS-ESTATICOS.md): the first static brand. No scroll scene, signs that light up on touch,
// the menu of treatments, a local journey and, on phones, a call at the thumb that never sits on another call.
const route = "/modelos/implantes";

test("Cerne leads with the promise, lights one sign at a time and reads the menu", async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 696 });
  await page.goto(route);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Voltar a comer o que você gosta, com dentes fixos.");
  await expect(page.locator("[data-brand-scroll-guide], [data-scroll-hint]")).toHaveCount(0);
  const signs = page.locator("[data-cerne-signs] > li");
  await expect(signs).toHaveCount(5);
  await expect(signs.first()).toHaveAttribute("data-active", "true");
  await signs.nth(3).getByRole("button").click();
  await expect(signs.nth(3)).toHaveAttribute("data-active", "true");
  await expect(signs.nth(3).getByText("Implante, às vezes com enxerto antes")).toBeVisible();
  await expect(signs.first().locator("[id^=sinal-]")).toBeHidden();
  await expect(page.locator("#tratamentos li h3 em")).toHaveText(["Um dente que não se mexe", "Morder sem medo", "Sorrir sem cobrir a boca", "Base para o implante"]);
  // The top's short arrival fade must be over, or the colours are measured half transparent.
  await page.waitForFunction(() => document.getAnimations().every(animation => animation.playState !== "running"));
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
});

test("Without JavaScript every sign is open and the content is complete", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(route);
  for (const id of ["solta", "comida", "sorriso", "tempo", "gengiva"]) await expect(page.locator(`#sinal-${id}`)).toBeVisible();
  await expect(page.locator("#duvidas summary")).toHaveCount(6);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test("On a phone the call at the thumb waits for the top's buttons to leave and opens the journey", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto(route);
  const sticky = page.locator(`a[href="#cerne-interesse"][data-show]`);
  await expect(sticky).toHaveAttribute("data-show", "false");
  await page.evaluate(() => scrollTo({ top: innerHeight * 2, behavior: "instant" }));
  await expect(sticky).toHaveAttribute("data-show", "true");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await sticky.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByText("Faltam vários dentes").click();
  await dialog.getByRole("button", { name: "Continuar" }).click();
  await dialog.getByText("Mastigar").click();
  await dialog.getByText("Nos próximos meses").click();
  await dialog.getByRole("button", { name: "Ver meu resumo" }).click();
  await expect(dialog.getByText("entrega o plano e o orçamento por escrito")).toBeVisible();
  expect((await new AxeBuilder({ page }).include("dialog").withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
});
