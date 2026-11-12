import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const doorLeft = (page: Page) => page.locator("[data-door=left]").evaluate(el => Math.round(el.getBoundingClientRect().right));
const visibleRoom = (page: Page) => page.locator("[data-route-room]").evaluateAll(rooms => rooms.findIndex(room => getComputedStyle(room).visibility === "visible"));
async function scrollRoute(page: Page, progress: number) {
  await page.evaluate(p => {
    const el = document.querySelector<HTMLElement>("[data-toca-route]")!;
    scrollTo(0, el.getBoundingClientRect().top + scrollY + (el.offsetHeight - innerHeight) * p);
  }, progress);
}

test("Toca switch changes the page between dog and cat", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 810 });
  await page.goto("/modelos/veterinaria");
  const root = page.locator('[data-model="toca"]');
  await expect(root).toHaveAttribute("data-species", "cao");
  await expect(page.getByAltText(/acaricia um cão/)).toBeVisible();
  await page.getByRole("button", { name: "Gato", exact: true }).click();
  await expect(root).toHaveAttribute("data-species", "gato");
  await expect(page.getByRole("button", { name: "Gato", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByAltText(/gato cinza no colo/)).toBeVisible();
  await expect(page.getByText("Espera longe dos cães e manejo calmo")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Cada fase do seu gato/ })).toBeVisible();
  await expect(page.getByText("Prateleiras altas para as caixas de transporte")).toBeAttached();
  await page.getByRole("button", { name: "Cão", exact: true }).click();
  await expect(page.getByAltText(/acaricia um cão/)).toBeVisible();
});

test("Toca route opens the doors room by room and back", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 810 });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/modelos/veterinaria");
  await expect(page.locator('[data-model="toca"]')).toHaveAttribute("data-brand-animated", "true");

  await expect.poll(async () => { await scrollRoute(page, .2); return doorLeft(page); }).toBeLessThanOrEqual(0);
  await expect.poll(() => visibleRoom(page)).toBe(0);
  await expect(page.locator("[data-route-mark][data-active]")).toContainText("Recepção");
  // Doors closed between rooms, carrying the next room's sign.
  await expect.poll(async () => { await scrollRoute(page, .345); return doorLeft(page); }).toBeGreaterThan(700);
  await expect(page.locator("[data-door-sign]").nth(1)).toBeVisible();
  await expect.poll(async () => { await scrollRoute(page, .55); return visibleRoom(page); }).toBe(1);
  await expect.poll(async () => { await scrollRoute(page, .95); return visibleRoom(page); }).toBe(2);
  await expect(page.locator("[data-route-mark][data-active]")).toContainText("Internação");
  await expect.poll(async () => { await scrollRoute(page, .2); return visibleRoom(page); }).toBe(0);

  await expect(page.locator("footer")).toContainText("© 2026 Toca Hospital Veterinário. Site por Gabriel Batista Digital");
  await expect(page.locator("body")).not.toContainText(/demonstração|fictíci|CRMV|24 ?h|plantão/i);
  expect(errors).toEqual([]);
});

test("Toca without motion shows every room and passes axe", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("/modelos/veterinaria");
  for (const name of ["Recepção", "Exames", "Internação"]) await expect(page.locator("[data-toca-route]").getByRole("heading", { level: 3, name, exact: true })).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations.map(v => v.id)).toEqual([]);
  await context.close();
});

test("Toca keeps the conversion skeleton and the local visit journey", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/modelos/veterinaria");
  await expect(page.locator("[data-specialty]")).toHaveCount(5);
  await page.locator('[data-inquiry="toca"]').getByRole("button", { name: "Agendar consulta" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("radio", { name: "Um gato" }).check();
  await dialog.getByRole("button", { name: "Continuar" }).click();
  await dialog.getByRole("radio", { name: "Vacinas" }).check();
  await dialog.getByRole("radio", { name: "Manhã" }).check();
  await dialog.getByRole("button", { name: "Ver meu resumo" }).click();
  await expect(dialog.getByRole("heading", { name: "Visita preparada." })).toBeVisible();
  await expect(dialog).toContainText("Um gato");
  await expect(dialog).not.toContainText(/agendad[ao] com sucesso|confirmad[ao]\b|wa\.me|Nada é enviado/i);
});

test("Toca fits a phone without horizontal overflow", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto("/modelos/veterinaria");
  await expect(page.locator('[data-model="toca"]')).toHaveAttribute("data-brand-animated", "true");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  await context.close();
});
