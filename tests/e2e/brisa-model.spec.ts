import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const frame = (page: Page) => page.locator("[data-tour-stage]").evaluate(el => Number((el as HTMLElement).dataset.tourFrame ?? -1));
const activeCaption = (page: Page) => page.locator("[data-tour-caption][data-active] h2").textContent();
async function scrollTour(page: Page, progress: number) {
  await page.evaluate(p => {
    const el = document.querySelector<HTMLElement>("[data-brisa-tour]")!;
    scrollTo(0, el.getBoundingClientRect().top + scrollY + (el.offsetHeight - innerHeight) * p);
  }, progress);
}

test("Casa Brisa tour plays frame by frame with the scroll and flies back in reverse", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 810 });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/modelos/hotelaria");
  await expect(page.locator('[data-model="brisa"]')).toHaveAttribute("data-brand-animated", "true");
  await expect(page.locator("[data-tour-stage]")).toHaveAttribute("data-tour-ready", "true");
  await expect(page.getByRole("heading", { level: 1, name: "Casa Brisa" })).toBeVisible();
  expect(await frame(page)).toBeLessThan(5);

  // Middle of the tour: the reception chapter, with the hero gone.
  await expect.poll(async () => { await scrollTour(page, .5); return frame(page); }).toBeGreaterThan(250);
  expect(await frame(page)).toBeLessThan(310);
  await expect.poll(() => activeCaption(page)).toBe("Na recepção, sem pressa.");
  await expect(page.getByRole("heading", { level: 1 })).toBeHidden();

  // End: the pool and the closing line.
  await expect.poll(async () => { await scrollTour(page, 1); return frame(page); }).toBeGreaterThan(550);
  await expect.poll(() => activeCaption(page)).toBe("Ficar mais um pouco.");

  // Scrolling back flies the camera back to the bay.
  await expect.poll(async () => { await scrollTour(page, 0); return frame(page); }).toBeLessThan(5);
  await expect(page.getByRole("heading", { level: 1, name: "Casa Brisa" })).toBeVisible();

  // Chapter marks jump to their chapter.
  await page.locator("[data-tour-mark]", { hasText: "Suíte" }).click();
  await expect.poll(() => frame(page), { timeout: 8000 }).toBeGreaterThan(330);
  expect(errors).toEqual([]);
});

test("Casa Brisa pauses into a static tour and keeps the local booking journey", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/modelos/hotelaria");
  await page.getByRole("button", { name: "Pausar o tour" }).click();
  await expect(page.locator('[data-model="brisa"]')).not.toHaveAttribute("data-brand-animated", "true");
  await expect(page.locator("[data-brisa-tour] figure")).toHaveCount(5);
  await expect(page.locator("[data-tour-caption]").first()).toBeHidden();

  await page.locator('[data-inquiry="brisa"]').getByRole("button", { name: "Reservar estadia" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("radio", { name: "Casa inteira" }).check();
  await dialog.getByRole("button", { name: "Continuar" }).click();
  await dialog.getByRole("radio", { name: "Em um feriado" }).check();
  await dialog.getByRole("radio", { name: "De três a seis" }).check();
  await dialog.getByRole("button", { name: "Ver meu resumo" }).click();
  await expect(dialog.getByRole("heading", { name: "Sua estadia, preparada." })).toBeVisible();
  await expect(dialog).toContainText("Casa inteira");
  await expect(dialog).not.toContainText(/demonstra|fictíci|Nada é enviado|wa\.me/i);

  const footer = page.locator("footer");
  await expect(footer).toContainText("© 2026 Casa Brisa. Site por Gabriel Batista Digital");
  await expect(page.locator("body")).not.toContainText(/demonstração|fictíci|estudo autoral|imagens geradas/i);
});

test("Casa Brisa without motion shows one photograph per chapter and passes axe", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto("/modelos/hotelaria");
  await expect(page.locator("[data-brisa-tour] figure")).toHaveCount(5);
  await expect(page.getByRole("button", { name: "Pausar o tour" })).toHaveCount(0);
  const tour = await page.locator("[data-brisa-tour]").evaluate(el => (el as HTMLElement).offsetHeight);
  expect(tour).toBeLessThan(6000);
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations.map(v => v.id)).toEqual([]);
  await context.close();
});

test("Casa Brisa on a phone uses the portrait frames", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const requests: string[] = [];
  page.on("request", request => requests.push(request.url()));
  await page.goto("/modelos/hotelaria");
  await expect(page.locator("[data-tour-stage]")).toHaveAttribute("data-tour-ready", "true");
  expect(requests.some(url => url.includes("/videos/casa-brisa/m/"))).toBe(true);
  expect(requests.some(url => url.includes("/videos/casa-brisa/d/"))).toBe(false);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await context.close();
});
