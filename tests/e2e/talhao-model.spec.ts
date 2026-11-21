import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Talhão pilot (docs/NOVOS-PROJETOS-REGISTROS.md): the plots of the farm light up one by one with the scroll, and back.
async function scrollScene(page: Page, progress: number) {
  await page.evaluate(p => {
    const el = document.querySelector<HTMLElement>("[data-talhao-hero]")!;
    scrollTo(0, el.getBoundingClientRect().top + scrollY + (el.offsetHeight - innerHeight) * p);
  }, progress);
}
const current = (page: Page) => page.locator("[data-plot][data-current]").evaluateAll(els => els.map(el => el.getAttribute("data-plot")));

test("Talhão lights the plots in order with the scroll and back", async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 696 });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/modelos/agro");
  await expect(page.locator('[data-model="talhao"]')).toHaveAttribute("data-brand-animated", "true");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Safra frustrada não precisa virar terra perdida.");

  await expect.poll(async () => { await scrollScene(page, .14); return current(page); }, { timeout: 8000 }).toEqual(["safra"]);
  await expect.poll(async () => { await scrollScene(page, .5); return current(page); }).toEqual(["maquina"]);
  await expect.poll(async () => { await scrollScene(page, .78); return current(page); }).toEqual(["garantia"]);
  await expect.poll(async () => { await scrollScene(page, .99); return page.locator("[data-step][data-active]").count(); }).toBe(5);
  await expect.poll(async () => { await scrollScene(page, 0); return current(page); }).toEqual([]);

  await expect(page.locator("body")).toContainText("Com Marina Couto, advogada do agro");
  await expect(page.locator("footer")).toContainText("© 2026 Talhão Advocacia do Agro. Site por Gabriel Batista Digital");
  await expect(page.locator("body")).not.toContainText(/OAB|demonstração|fictíci|garant(imos|ido)|ganhe|sucesso garantido|\d+ anos de experiência/i);
  expect(errors).toEqual([]);
});

test("Talhão without motion shows every plot and the whole legend, and passes axe", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("/modelos/agro");
  await expect(page.locator("[data-step]")).toHaveCount(5);
  for (const line of await page.locator("[data-plot-line]").all()) expect(await line.evaluate(el => getComputedStyle(el).strokeDashoffset)).toMatch(/^0(px)?$/);
  await expect(page.getByText("A parcela vence mesmo quando a colheita não veio.")).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations.map(v => v.id)).toEqual([]);
  await context.close();
});

test("Talhão keeps the local conversation journey, also readable without JavaScript", async ({ browser }) => {
  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } });
  const still = await noJs.newPage();
  await still.goto("/modelos/agro");
  await expect(still.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(still.locator("[data-step]")).toHaveCount(5);
  await noJs.close();

  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("/modelos/agro");
  await expect(page.getByRole("heading", { level: 2, name: "Antes de qualquer caminho, a leitura do seu caso." })).toBeVisible();
  await expect(page.locator("#como-analisa li")).toHaveCount(4);
  await expect(page.getByRole("heading", { level: 2, name: "Marina Couto" })).toBeVisible();
  await expect(page.locator("#duvidas details")).toHaveCount(5);
  await page.locator('[data-inquiry="talhao"]').getByRole("button", { name: "Conversar sobre a minha fazenda" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("radio", { name: "Uma máquina penhorada ou em execução" }).check();
  await dialog.getByRole("button", { name: "Continuar" }).click();
  await dialog.getByRole("radio", { name: "Na fazenda" }).check();
  await dialog.getByRole("radio", { name: "Esta semana" }).check();
  await dialog.getByRole("button", { name: "Ver meu resumo" }).click();
  await expect(dialog.getByRole("heading", { name: "Sua conversa, preparada." })).toBeVisible();
  await expect(dialog).toContainText("Na fazenda");
  await expect(dialog).not.toContainText(/agendad[ao] com sucesso|confirmad|wa\.me|Nada é enviado/i);
  await context.close();
});

test("Talhão fits a 360 px phone without horizontal overflow", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto("/modelos/agro");
  await expect(page.locator('[data-model="talhao"]')).toHaveAttribute("data-brand-animated", "true");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  await context.close();
});
