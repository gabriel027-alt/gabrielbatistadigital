import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// The recovery, since 28/11/2026: five phases on one line, all on screen at once; the line draws itself on arrival.
test("Sutil recovery shows the five phases on one line and draws it on arrival", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 810 });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/modelos/cirurgia-plastica");
  await expect(page.locator('[data-model="sutil"]')).toHaveAttribute("data-brand-animated", "true");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("vem antes da cirurgia.");

  const phases = page.locator("[data-phase]");
  await expect(phases.locator("h3")).toHaveText(["O dia da cirurgia", "A fase de mais cuidado", "De volta à rotina leve", "Exercícios em etapas", "Até a alta"]);
  await page.locator("[data-phases]").scrollIntoViewIfNeeded();
  const tops = await phases.evaluateAll(items => items.map(item => Math.round(item.getBoundingClientRect().top)));
  expect(new Set(tops).size).toBe(1);
  // No pinned scroll: the whole section is at most a screen and a half.
  expect(await page.locator("[data-sutil-recovery]").evaluate(el => (el as HTMLElement).offsetHeight / innerHeight)).toBeLessThan(1.5);
  await expect.poll(() => page.locator("[data-phases]").evaluate(el => Number(getComputedStyle(el).getPropertyValue("--fill")))).toBe(1);
  await expect(page.locator("[data-day-count]")).toHaveCount(0);

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
