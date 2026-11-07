import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Orla gallery travels, reverses, supports shortcuts and motion pause", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/propostas/orla");
  await expect(page.locator("[data-orla]")).toHaveAttribute("data-orla-animated", "true");
  const journey = page.locator("[data-orla-journey]");
  const geometry = await journey.evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, travel: (el as HTMLElement).offsetHeight - innerHeight }));
  const x = () => page.locator("[data-orla-rail]").evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
  await page.evaluate(y => scrollTo(0, y), geometry.top);
  await expect.poll(x).toBeGreaterThan(-1);
  await page.evaluate(y => scrollTo(0, y), geometry.top + geometry.travel * .5);
  await expect.poll(x).toBeLessThan(-200);
  const middle = await x();
  await page.evaluate(y => scrollTo(0, y), geometry.top + geometry.travel);
  await expect.poll(x).toBeLessThan(middle - 100);
  await page.evaluate(y => scrollTo(0, y), geometry.top);
  await expect.poll(x).toBeGreaterThan(-1);
  await page.getByRole("button", { name: "O convívio", exact: true }).click();
  await expect(page.getByRole("button", { name: "O convívio", exact: true })).toHaveAttribute("aria-current", "true");
  await page.getByRole("button", { name: "Pausar animações" }).click();
  await expect(page.locator("[data-orla]")).not.toHaveAttribute("data-orla-animated", "true");
  expect(await journey.evaluate(el => (el as HTMLElement).offsetHeight)).toBeGreaterThan(900);
  await page.getByRole("button", { name: "Ativar animações" }).click();
  await expect(page.locator("[data-orla]")).toHaveAttribute("data-orla-animated", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-orla]")).not.toHaveAttribute("data-orla-animated", "true");
  await expect(page.getByRole("button", { name: /animações/ })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("Orla fits phones and has a readable motion-reduced accessible route", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/propostas/orla");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.getByRole("link", { name: "Nosso olhar", exact: true }).click();
  await expect(page).toHaveURL(/#orla-olhar/);
  await expect(page.getByRole("heading", { name: "A vista chama. A casa precisa fazer sentido." })).toBeVisible();
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
});

test("Orla mobile motion has two reachable scenes and no overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/propostas/orla");
  await expect(page.locator("[data-orla]")).toHaveAttribute("data-orla-animated", "true");
  await page.getByRole("link", { name: "Conhecer os espaços" }).click();
  await page.getByRole("button", { name: "O convívio", exact: true }).click();
  await expect(page.getByRole("button", { name: "O convívio", exact: true })).toHaveAttribute("aria-current", "true");
  await expect(page.locator("#orla-convivio")).toBeInViewport({ ratio: .9 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("Orla works without JavaScript and preserves both complete photographs", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/propostas/orla");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Uma casa.Todo um horizonte.");
  await expect(page.getByRole("button")).toHaveCount(0);
  for (const id of ["orla-paisagem", "orla-convivio"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#${id}`)).toBeInViewport();
    expect(await page.locator(`#${id} img`).evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
  await context.close();
});
