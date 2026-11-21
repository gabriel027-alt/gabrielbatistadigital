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
  await expect(page.locator("[data-arrimo-period]").first()).toHaveCSS("opacity", "1");
  for (const bridge of await page.locator('[data-arrimo-bridge]').all()) await expect.poll(() => bridge.evaluate(el => Number(getComputedStyle(el).getPropertyValue('--draw')))).toBe(0);
  await sceneAt(page, .32);
  await expect.poll(() => opacity(page, '[data-arrimo-gap]')).toBe(1);
  await sceneAt(page, .755);
  await expect.poll(() => page.locator('[data-arrimo-strike]').evaluate(el => new DOMMatrix(getComputedStyle(el).transform).a)).toBeGreaterThan(.9);
  await sceneAt(page, .82);
  await expect.poll(() => opacity(page, '[data-arrimo-denied]')).toBe(0);
  await expect.poll(() => opacity(page, '[data-arrimo-review]')).toBe(0);
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

test("Without motion the full document stays readable, with no pause button, and passes axe", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1536, height: 696 }, deviceScaleFactor: 1.25 });
  const page = await context.newPage();
  await page.goto(route);
  // No pause button since 21/11/2026: reduced motion is the way to the still version.
  await expect(page.getByRole("button", { name: /Pausar|Ativar/ })).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator('[data-model="arrimo"]')).not.toHaveAttribute("data-brand-animated", "true");
  await expect(page.locator('[data-arrimo-phase]')).toHaveCount(3);
  await expect(page.locator('[data-arrimo-review]')).toHaveCSS("opacity", "1");
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
    await sceneAt(page, 0);
    await expect.poll(() => opacity(page, '[data-arrimo-denied]')).toBe(1);
    const denied = await page.locator('[data-arrimo-denied]').boundingBox();
    expect(denied!.y).toBeGreaterThan(74);
    expect(denied!.y + denied!.height).toBeLessThan(device.height - 12);
    expect(denied!.x).toBeGreaterThan(8);
    expect(denied!.x + denied!.width).toBeLessThan(device.width - 8);
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
    const stamp = await page.locator('[data-arrimo-review]').boundingBox();
    expect(Math.abs(stamp!.x + stamp!.width / 2 - device.width / 2)).toBeLessThan(12);
    expect(Math.abs(stamp!.y + stamp!.height / 2 - device.height / 2)).toBeLessThan(device.height * .2);
    expect(stamp!.y).toBeGreaterThan(bounds.header + 20);
    const explanation = await page.locator('[data-arrimo-phase]').last().boundingBox();
    expect(explanation!.y).toBeGreaterThan(stamp!.y + stamp!.height + 10);
    await context.close();
  });
}

test("Full Arrimo journey keeps choices local, supports editing and returns focus", async ({ page }) => {
  await page.goto(route);
  for (const name of ["Isso é pra você?", "Onde a Arrimo atua.", "O que levar para a primeira conversa.", "Ricardo Teles", "Antes de seguir, suas dúvidas."]) await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Com Ricardo Teles, advogado previdenciarista" })).toHaveAttribute("href", "#arrimo-escritorio");
  await expect(page.locator('#arrimo-escritorio')).toContainText("Sou o Ricardo");
  await expect(page.locator('body')).not.toContainText(/OAB\s*\d|anos de experiência|formado em/i);
  await expect(page.locator('#arrimo-situacoes article')).toHaveCount(4);
  await expect(page.locator('[data-arrimo-poster]')).toHaveCount(4);
  await expect(page.locator('#arrimo-documentos li')).toHaveCount(4);
  await page.locator("summary").filter({ hasText: "O BPC é uma aposentadoria?" }).click();
  await expect(page.getByText("Não. O BPC é um benefício assistencial", { exact: false })).toBeVisible();
  const launch = page.getByRole("button", { name: "Preparar minha conversa", exact: true });
  await launch.click();
  const dialog = page.getByRole("dialog");
  await page.getByRole("radio", { name: "Benefício negado", exact: true }).check();
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await page.getByRole("radio", { name: "Recebi uma negativa", exact: true }).check();
  await page.getByRole("radio", { name: "Para alguém da família", exact: true }).check();
  await page.getByRole("button", { name: "Ver meu resumo", exact: true }).click();
  await expect(dialog).toContainText("O Ricardo confirma");
  await expect(dialog).toContainText("Benefício negado");
  await expect(dialog).toContainText("Para alguém da família");
  await page.getByRole("button", { name: "Ajustar escolhas", exact: true }).click();
  await expect(page.getByRole("radio", { name: "Benefício negado", exact: true })).toBeChecked();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(launch).toBeFocused();
  expect(await page.locator('input[type="file"],input[type="email"],input[type="tel"]').count()).toBe(0);
});


test("Office anchor leaves its label below the sticky header", async ({ page }) => {
  await page.goto(route);
  await page.getByRole("link", { name: "Com Ricardo Teles, advogado previdenciarista" }).click();
  await expect.poll(() => page.locator('#arrimo-escritorio > div > p').first().evaluate(el => el.getBoundingClientRect().top)).toBeGreaterThan(98);
});
