import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const route = "/modelos/previdenciario";
async function sceneAt(page: Page, progress: number) {
  await page.locator('[data-arrimo-scene]').evaluate((el, p) => scrollTo({ top: el.getBoundingClientRect().top + scrollY + ((el as HTMLElement).offsetHeight - innerHeight) * p, behavior: "instant" }), progress);
}
const opacity = (page: Page, selector: string) => page.locator(selector).first().evaluate(el => Number(getComputedStyle(el).opacity));

test("Arrimo joins the periods, reviews the gaps and reverses the whole scene", async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 696 });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(route);
  await expect(page.locator('[data-model="arrimo"]')).toHaveAttribute("data-brand-animated", "true");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("O INSS negou?");
  await sceneAt(page, 0);
  await expect.poll(() => opacity(page, '[data-arrimo-denied]')).toBe(1);
  await expect.poll(() => opacity(page, '[data-arrimo-review]')).toBe(0);
  await sceneAt(page, .48);
  await expect.poll(() => opacity(page, '[data-arrimo-gap]')).toBe(1);
  await sceneAt(page, 1);
  await expect.poll(() => opacity(page, '[data-arrimo-review]')).toBe(1);
  await expect.poll(() => opacity(page, '[data-arrimo-denied]')).toBe(0);
  for (const card of await page.locator('[data-arrimo-period]').all()) await expect(card).toHaveCSS("opacity", "1");
  await sceneAt(page, 0);
  await expect.poll(() => opacity(page, '[data-arrimo-denied]')).toBe(1);
  await expect.poll(() => opacity(page, '[data-arrimo-review]')).toBe(0);
  await expect(page.locator("body")).not.toContainText(/OAB\s*\d|garanti[ad]|ganhe sua|demonstração|fictíci|anos de contribuição exigidos/i);
  expect(errors).toEqual([]);
});

test("Pause keeps the full document readable and reduced motion passes axe", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1536, height: 696 }, deviceScaleFactor: 1.25 });
  const page = await context.newPage();
  await page.goto(route);
  await page.getByRole("button", { name: "Pausar animações" }).click();
  await expect(page.locator('[data-model="arrimo"]')).not.toHaveAttribute("data-brand-animated", "true");
  await expect(page.locator('[data-arrimo-phase]')).toHaveCount(3);
  await expect(page.locator('[data-arrimo-review]')).toHaveCSS("opacity", "1");
  await page.getByRole("button", { name: "Ativar animações" }).click();
  await expect(page.locator('[data-model="arrimo"]')).toHaveAttribute("data-brand-animated", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("button", { name: /animações/ })).toHaveCount(0);
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(audit.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))).toEqual([]);
  await context.close();
});

test("The pilot works without JavaScript, with complete records and no lateral overflow", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto(route);
  await expect(page.getByRole("heading", { name: "Trabalho com carteira", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Atividade rural", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Atividade especial", exact: true })).toBeVisible();
  await expect(page.locator('[data-arrimo-phase]')).toHaveCount(3);
  await expect(page.getByRole("link", { name: "Entender a análise" })).toHaveAttribute("href", "#arrimo-tempo");
  await expect(page.locator("footer")).toContainText("© 2026 Arrimo. Site por Gabriel Batista Digital");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  await context.close();
});

for (const device of [{ width: 1536, height: 696, scale: 1.25 }, { width: 390, height: 844, scale: 1 }]) {
  test(`The complete scene fits the ${device.width}×${device.height} viewport`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: device.width, height: device.height }, deviceScaleFactor: device.scale, isMobile: device.width < 760, hasTouch: device.width < 760 });
    const page = await context.newPage();
    await page.goto(route);
    await sceneAt(page, 1);
    await expect.poll(() => opacity(page, '[data-arrimo-review]')).toBe(1);
    const bounds = await page.evaluate(() => {
      const h = document.querySelector('header')!.getBoundingClientRect();
      const title = document.querySelector('#arrimo-tempo-titulo')!.getBoundingClientRect();
      const stamp = document.querySelector('[data-arrimo-review]')!.getBoundingClientRect();
      return { top: title.top, header: h.bottom, bottom: stamp.bottom, height: innerHeight, overflow: document.documentElement.scrollWidth - innerWidth };
    });
    expect(bounds.top).toBeGreaterThanOrEqual(bounds.header - 1);
    expect(bounds.bottom).toBeLessThanOrEqual(bounds.height - 8);
    expect(bounds.overflow).toBeLessThanOrEqual(0);
    await context.close();
  });
}
