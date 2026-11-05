import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Aura editorial: navigation, content and responsive accessibility", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/propostas/aura");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Sua expressão. Em primeiro plano.");
  await page.getByRole("link", { name: "Entender a avaliação" }).click();
  await expect(page).toHaveURL(/#aura-avaliacao$/);
  await page.locator("summary").filter({ hasText: "Possibilidades e limites" }).click();
  await expect(page.getByText("Indicações, riscos, alternativas", { exact: false })).toBeVisible();
  for (const width of [360, 390, 768, 900, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow ${width}`).toBe(true);
  }
  await expect(page.getByRole("link", { name: "Falar com Gabriel sobre o projeto" })).toHaveAttribute("href", /wa.me\/5538998267717/);
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(audit.violations).toEqual([]);
});

test("Aura scroll reverses and disabling motion restores static readable content", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/propostas/aura");
  await expect(page.locator('[data-motion]')).toHaveAttribute('data-animated', 'true');
  const portrait = page.locator('[data-portrait]');
  await expect.poll(() => portrait.evaluate(el => getComputedStyle(el).clipPath)).toContain('43%');
  await page.evaluate(() => scrollTo(0, 1050));
  await expect.poll(() => page.locator('[data-transition-text]').evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(.9);
  await page.evaluate(() => scrollTo(0, 0));
  await expect.poll(() => portrait.evaluate(el => getComputedStyle(el).clipPath)).toContain('43%');
  await page.getByRole("button", { name: "Desativar animações" }).click();
  await expect(page.getByRole("button", { name: "Ativar animações" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('[data-motion]')).not.toHaveAttribute('data-animated', 'true');
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await portrait.evaluate(el => getComputedStyle(el).clipPath)).toBe('none');
  await page.getByRole("button", { name: "Ativar animações" }).click();
  await expect(page.locator('[data-motion]')).toHaveAttribute('data-animated', 'true');
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator('[data-motion]')).not.toHaveAttribute('data-animated', 'true');
  await expect(page.getByRole("button", { name: "Desativar animações" })).toBeHidden();
  expect(await portrait.evaluate(el => getComputedStyle(el).clipPath)).toBe('none');
});

test("Aura retains readable copy, imagery and disclosures without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3107/propostas/aura");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.locator("summary").filter({ hasText: "Uma decisão informada" }).click();
  await expect(page.getByText("Antes de decidir, esclareça", { exact: false })).toBeVisible();
  expect(await page.locator('[data-glyph]').first().evaluate(el => getComputedStyle(el).opacity)).toBe('1');
  await expect(page.getByRole('button', { name: /animações/ })).toHaveCount(0);
  await context.close();
});

test("Aura main chapter reveals three states, reverses, and restores the linear alternative", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/propostas/aura");
  await expect(page.locator('[data-motion]')).toHaveAttribute('data-animated', 'true');
  const geometry = await page.locator('[data-focus-track]').evaluate(el => ({
    top: el.getBoundingClientRect().top + scrollY,
    travel: (el as HTMLElement).offsetHeight - innerHeight,
  }));
  const notes = page.locator('[data-focus-note]');
  for (const [index, progress] of [[0, .4], [1, .64], [2, .88], [0, .4]]) {
    await page.evaluate(y => scrollTo(0, y), geometry.top + geometry.travel * progress);
    await expect.poll(() => notes.nth(index).evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(.95);
    await expect(notes.nth(index)).toBeVisible();
    for (let other = 0; other < 3; other++) {
      if (other !== index) await expect(notes.nth(other)).toBeHidden();
    }
  }
  await page.getByRole('button', { name: 'Desativar animações' }).click();
  for (let index = 0; index < 3; index++) await expect(notes.nth(index)).toBeVisible();
  expect(await page.locator('[data-focus-media]').evaluate(el => getComputedStyle(el).transform)).toBe('none');
  await page.getByRole('button', { name: 'Ativar animações' }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (let index = 0; index < 3; index++) await expect(notes.nth(index)).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (let index = 0; index < 3; index++) await expect(notes.nth(index)).toBeVisible();
  expect(await page.locator('[data-focus-track]').evaluate(el => (el as HTMLElement).offsetHeight < 2 * innerHeight)).toBe(true);
});
