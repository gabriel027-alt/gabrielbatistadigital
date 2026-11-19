import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Lume pilot (docs/NOVOS-PROJETOS-REGISTROS.md): the demands fall away with the scroll and come back on the way up.
async function scrollScene(page: Page, progress: number) {
  await page.evaluate(p => {
    const el = document.querySelector<HTMLElement>("[data-lume-hero]")!;
    scrollTo(0, el.getBoundingClientRect().top + scrollY + (el.offsetHeight - innerHeight) * p);
  }, progress);
}
/** How many demands still sit inside the viewport. */
const onScreen = (page: Page) => page.locator("[data-lume-weight]").evaluateAll(items =>
  items.filter(el => { const r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0 && Number(getComputedStyle(el).opacity) > .5; }).length);

test("Lume lets the demands go with the scroll and brings them back", async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 696 });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/modelos/psicologia");
  await expect(page.locator('[data-model="lume"]')).toHaveAttribute("data-brand-animated", "true");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Você não precisa carregar tudo sozinha.");

  await expect.poll(async () => { await scrollScene(page, 0); return onScreen(page); }, { timeout: 8000 }).toBe(6);
  await expect.poll(async () => { await scrollScene(page, 1); return onScreen(page); }).toBe(0);
  await expect.poll(async () => { await scrollScene(page, 0); return onScreen(page); }).toBe(6);

  await expect(page.locator("footer")).toContainText("© 2026 Lume Psicologia. Site por Gabriel Batista Digital");
  await expect(page.locator("body")).not.toContainText(/demonstração|fictíci|CRP \d|\bcura|garant|depoimento/i);
  expect(errors).toEqual([]);
});

test("Lume without motion shows the clean title, the demands struck through, and passes axe", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("/modelos/psicologia");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const first = page.locator("[data-lume-weight]").first();
  await expect(first).toBeVisible();
  expect(await first.evaluate(el => getComputedStyle(el).textDecorationLine)).toContain("line-through");
  await expect(page.getByRole("button", { name: /animações/ })).toHaveCount(0);
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations.map(v => v.id)).toEqual([]);
  await context.close();
});

test("Lume self-check answers the visitor, also without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("/modelos/psicologia");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const signs = page.locator("#lume-sinais");
  await expect(signs.getByRole("checkbox")).toHaveCount(6);
  await expect(signs.getByRole("link", { name: "Agendar uma primeira conversa" })).toBeVisible();
  await signs.getByText("A cabeça não desliga quando você deita.").click();
  await expect(signs.getByRole("link", { name: "Quero falar sobre isso" })).toBeVisible();
  await context.close();
});

test("Lume keeps the conversion skeleton and the local booking journey", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/modelos/psicologia");
  await expect(page.getByRole("heading", { level: 2, name: "Uma hora da semana só sua." })).toBeVisible();
  await expect(page.locator("#como-funciona h3")).toHaveCount(4);
  await expect(page.getByRole("heading", { level: 2, name: "Helena Prado" })).toBeVisible();
  await expect(page.locator("#duvidas details")).toHaveCount(5);
  await page.locator('[data-inquiry="lume"]').getByRole("button", { name: "Agendar uma primeira conversa" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("radio", { name: "Já quero começar a terapia" }).check();
  await dialog.getByRole("button", { name: "Continuar" }).click();
  await dialog.getByRole("radio", { name: "Online" }).check();
  await dialog.getByRole("radio", { name: "Início da noite" }).check();
  await dialog.getByRole("button", { name: "Ver meu resumo" }).click();
  await expect(dialog.getByRole("heading", { name: "Sua primeira conversa, preparada." })).toBeVisible();
  await expect(dialog).toContainText("Online");
  await expect(dialog).not.toContainText(/agendad[ao] com sucesso|confirmad|wa\.me|Nada é enviado/i);
});

test("Lume fits a 360 px phone without horizontal overflow", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto("/modelos/psicologia");
  await expect(page.locator('[data-model="lume"]')).toHaveAttribute("data-brand-animated", "true");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  await context.close();
});
