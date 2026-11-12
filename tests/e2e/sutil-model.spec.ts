import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const day = (page: Page) => page.locator("[data-day-count]").evaluate(el => Number(el.textContent));
const milestone = (page: Page) => page.locator("[data-milestone][data-active] h3").textContent();
async function scrollScene(page: Page, progress: number) {
  await page.evaluate(p => {
    const el = document.querySelector<HTMLElement>("[data-sutil-recovery]")!;
    scrollTo(0, el.getBoundingClientRect().top + scrollY + (el.offsetHeight - innerHeight) * p);
  }, progress);
}

test("Sutil recovery counts the days with the scroll and back", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 810 });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/modelos/cirurgia-plastica");
  await expect(page.locator('[data-model="sutil"]')).toHaveAttribute("data-brand-animated", "true");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("vem antes da cirurgia.");

  await expect.poll(async () => { await scrollScene(page, 0); return day(page); }).toBe(1);
  await expect.poll(() => milestone(page)).toBe("O dia da cirurgia");
  await expect.poll(async () => { await scrollScene(page, .6); return day(page); }).toBeGreaterThan(25);
  await expect.poll(() => milestone(page)).toBe("De volta à rotina leve");
  await expect.poll(async () => { await scrollScene(page, 1); return day(page); }).toBe(90);
  await expect.poll(() => milestone(page)).toBe("Até a alta");
  await expect.poll(async () => { await scrollScene(page, 0); return day(page); }).toBe(1);

  await expect(page.locator("footer")).toContainText("© 2026 Sutil Cirurgia Plástica. Site por Gabriel Batista Digital");
  await expect(page.locator("body")).not.toContainText(/demonstração|fictíci|antes e depois|CRM \d|RQE|garant/i);
  expect(errors).toEqual([]);
});

test("Sutil without motion lists every recovery stage and passes axe", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("/modelos/cirurgia-plastica");
  for (const title of ["O dia da cirurgia", "A fase de mais cuidado", "De volta à rotina leve", "Exercícios em etapas", "Até a alta"]) {
    await expect(page.getByRole("heading", { level: 3, name: title })).toBeVisible();
  }
  await expect(page.locator("[data-day-count]")).toBeHidden();
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations.map(v => v.id)).toEqual([]);
  await context.close();
});

test("Sutil keeps the conversion skeleton and the local consultation journey", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/modelos/cirurgia-plastica");
  await expect(page.locator("[data-surgery]")).toHaveCount(4);
  await expect(page.getByRole("heading", { name: /é possível para você/ })).toBeVisible();
  await page.locator("[data-surgery=abdome] summary").click();
  await expect(page.locator("[data-surgery=abdome] ol li")).toHaveCount(4);
  await page.locator('[data-inquiry="sutil"]').getByRole("button", { name: "Agendar consulta" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("radio", { name: "Face" }).check();
  await dialog.getByRole("button", { name: "Continuar" }).click();
  await dialog.getByRole("radio", { name: "Ainda este ano" }).check();
  await dialog.getByRole("radio", { name: "Tarde" }).check();
  await dialog.getByRole("button", { name: "Ver meu resumo" }).click();
  await expect(dialog.getByRole("heading", { name: "Sua consulta, preparada." })).toBeVisible();
  await expect(dialog).toContainText("Face");
  await expect(dialog).not.toContainText(/agendad[ao] com sucesso|confirmad|wa\.me|Nada é enviado/i);
});

test("Sutil fits a phone without horizontal overflow", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto("/modelos/cirurgia-plastica");
  await expect(page.locator('[data-model="sutil"]')).toHaveAttribute("data-brand-animated", "true");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  await context.close();
});
