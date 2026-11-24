import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Ponte (docs/PROJETOS-ESTATICOS.md): the eighth static brand and the first typographic top. The greeting in two
// languages, the strip of the day, the school office answering, no invented results, fees or fluency promises, the
// local journey and the phone call bar.
const route = "/modelos/escola";

test("Ponte greets in two languages, shows the day and never promises results, fees or fluency", async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 696 });
  await page.goto(route);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Duas línguas, um mesmo dia.");
  await expect(page.locator("[lang=en]").first()).toHaveText("Good morning.");
  await expect(page.locator("[data-who-answers]")).toHaveText("A secretaria responde e marca a sua visita.");
  await expect(page.locator("body")).not.toContainText(/R\$|fluente|fluência em|aprovad|certifica|\d+ alunos|depoimento|garantid/i);
  await expect(page.locator("section[aria-labelledby=ponte-titulo] ol > li")).toHaveCount(6);
  const moments = page.locator("#o-dia ol > li");
  await expect(moments).toHaveCount(6);
  await expect(moments.first().locator("[lang=en]")).toHaveText("Good morning! Can you hang up your backpack?");
  // The strip of the day is in the first screen, under the greeting.
  const strip = await page.locator("section[aria-labelledby=ponte-titulo] ol").boundingBox();
  expect(strip!.y).toBeLessThan(696);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze()).violations).toEqual([]);
});

test("Without JavaScript everything is there", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(route);
  for (const text of ["O dia em duas línguas.", "O que muda em cada idade.", "Quem responde é a secretaria.", "Meu filho não fala inglês. Pode começar?"]) await expect(page.getByText(text, { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test("On a phone the call at the thumb waits for the top and opens the journey, which says who answers", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto(route);
  const sticky = page.locator(`a[href="#ponte-interesse"][data-show]`);
  await expect(sticky).toHaveAttribute("data-show", "false");
  await page.evaluate(() => scrollTo({ top: innerHeight * 2, behavior: "instant" }));
  await expect(sticky).toHaveAttribute("data-show", "true");
  await sticky.click();
  const dialog = page.getByRole("dialog");
  await dialog.getByText("4 a 5 anos", { exact: true }).click();
  await dialog.getByRole("button", { name: "Continuar" }).click();
  await dialog.getByText("Primeira escola").click();
  await dialog.getByText("O próximo ano").click();
  await dialog.getByRole("button", { name: "Ver meu resumo" }).click();
  await expect(dialog.getByText("A secretaria marca a visita")).toBeVisible();
  expect((await new AxeBuilder({ page }).include("dialog").withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
});
