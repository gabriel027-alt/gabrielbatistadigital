import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const dashOffset = (page: Page, selector: string) => page.locator(selector).first().evaluate(el => Number(el.getAttribute("stroke-dashoffset")));
const opacity = (page: Page, selector: string) => page.locator(selector).evaluate(el => Number(getComputedStyle(el).opacity));

test("Forma signature: the smile is measured, outlined and given ceramic, and plays back", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/modelos/odontologia");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Um sorriso planejado com calma e precisão.");
  await expect(page.locator('[data-model="forma"]')).toHaveAttribute("data-brand-animated", "true");
  const g = await page.locator("[data-forma-plan]").evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, travel: (el as HTMLElement).offsetHeight - innerHeight }));
  expect(g.travel).toBeGreaterThan(1500);
  // A refresh while assets load can restore the previous position: scroll again while waiting.
  const at = (progress: number, read: () => Promise<number>) => async () => { await page.evaluate(y => scrollTo(0, y), g.top + g.travel * progress); return read(); };
  const visibleStep = () => page.locator("[data-plan-step]").evaluateAll(items => items.findIndex(item => Number(getComputedStyle(item).opacity) > .9));

  await expect.poll(at(.15, () => dashOffset(page, "[data-plan-grid] line"))).toBeLessThan(.5);
  await expect.poll(at(.15, visibleStep)).toBe(0);
  expect(await dashOffset(page, "[data-plan-outline] path")).toBeGreaterThan(.9);
  await expect.poll(at(.55, () => dashOffset(page, "[data-plan-outline] path"))).toBeLessThan(.05);
  await expect.poll(at(.55, visibleStep)).toBe(1);
  await expect.poll(at(1, () => opacity(page, "[data-plan-ceramic]"))).toBeGreaterThan(.95);
  await expect.poll(at(1, visibleStep)).toBe(2);
  await expect.poll(at(-.3, () => opacity(page, "[data-plan-ceramic]"))).toBeLessThan(.05);

  await page.getByRole("button", { name: "Pausar animações" }).click();
  await expect(page.locator('[data-model="forma"]')).not.toHaveAttribute("data-brand-animated", "true");
  expect(await opacity(page, "[data-plan-ceramic]")).toBe(1);
  expect(errors).toEqual([]);
});

test("Forma keeps the conversion skeleton and a local booking flow", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  const response = await page.goto("/modelos/odontologia");
  expect(response?.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator(".model-notice, .model-hero, .brand-story")).toHaveCount(0);
  // Approved structure: full-width hero photo, five-item strip, clinic section, four cards.
  expect((await page.locator("#forma-inicio img").boundingBox())!.width).toBeGreaterThan(1400);
  await expect(page.locator('[aria-labelledby="diferenciais-titulo"] li')).toHaveCount(5);
  await expect(page.locator("#sobre img")).toBeVisible();
  await expect(page.getByRole("img", { name: /planejamento do sorriso/ })).toBeVisible();
  await expect(page.getByText("Não representa um paciente.")).toBeVisible();
  for (const title of ["Medir", "Desenhar", "Ensaiar"]) await expect(page.locator("[data-plan-step]").filter({ hasText: title })).toBeVisible();
  const cards = page.locator("[data-treatment]");
  await expect(cards).toHaveCount(4);
  await cards.nth(1).getByText("Como funciona").click();
  await expect(cards.nth(1)).toContainText("Ensaio na boca");

  expect(await page.locator('a[href="#forma-interesse"]').count()).toBeGreaterThanOrEqual(6);
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
  await page.getByRole("link", { name: "Quero marcar a primeira consulta" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByText("Repor um ou mais dentes").click();
  await dialog.getByRole("button", { name: "Continuar" }).click();
  await dialog.getByText("Nos próximos meses").click();
  await dialog.getByText("Manhã").click();
  await dialog.getByRole("button", { name: "Ver meu resumo" }).click();
  await expect(dialog.getByRole("heading", { name: "Sua avaliação, preparada." })).toBeVisible();
  await dialog.getByRole("button", { name: "Voltar ao site" }).click();

  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
});

test("Forma keeps every section readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/modelos/odontologia");
  await expect(page.getByRole("img", { name: /planejamento do sorriso/ })).toBeVisible();
  for (const name of ["Implantes", "Lentes de contato dental", "Alinhadores", "Clareamento"]) await expect(page.getByRole("heading", { level: 3, name })).toBeVisible();
  await expect(page.locator("[data-plan-step]")).toHaveCount(3);
  await context.close();
});
