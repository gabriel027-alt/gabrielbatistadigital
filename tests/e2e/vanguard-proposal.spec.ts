import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const photoOpacity = (page: import("@playwright/test").Page) => page.locator("[data-vg-photo]").evaluate(el => Number(getComputedStyle(el).opacity));
const lineOffset = (page: import("@playwright/test").Page) => page.locator("[data-vg-line]").last().evaluate(el => Number(getComputedStyle(el).strokeDashoffset.replace("px", "")));

test("Vanguard opening draws the lines, reveals the house and plays back in reverse", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/propostas/vanguard");
  const root = page.locator("[data-vanguard]");
  await expect(root).toHaveAttribute("data-vanguard-animated", "true");
  const travel = await page.locator("[data-vg-opening]").evaluate(el => (el as HTMLElement).offsetHeight - innerHeight);
  expect(travel).toBeGreaterThan(900);

  // Blank sheet: no photograph, lines not yet drawn.
  await expect.poll(() => photoOpacity(page)).toBeLessThan(.05);
  await expect.poll(() => lineOffset(page)).toBeGreaterThan(.9);
  // Drawing done, photograph still hidden.
  await page.evaluate(y => scrollTo(0, y), Math.round(travel * .34));
  await expect.poll(() => lineOffset(page)).toBeLessThan(.05);
  expect(await photoOpacity(page)).toBeLessThan(.05);
  // The house fills the frame and the notes are shown.
  await page.evaluate(y => scrollTo(0, y), travel);
  await expect.poll(() => photoOpacity(page)).toBeGreaterThan(.95);
  await expect(page.locator("[data-vg-note]").first()).toBeVisible();
  await expect.poll(() => page.locator("[data-vg-note]").first().evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(.95);
  // Scrolling back undoes the sequence.
  await page.evaluate(() => scrollTo(0, 0));
  await expect.poll(() => photoOpacity(page)).toBeLessThan(.05);
  await expect.poll(() => lineOffset(page)).toBeGreaterThan(.9);

  await page.getByRole("button", { name: "Pausar animações" }).click();
  await expect(root).not.toHaveAttribute("data-vanguard-animated", "true");
  expect(await photoOpacity(page)).toBe(1);
  await page.getByRole("button", { name: "Ativar animações" }).click();
  await expect(root).toHaveAttribute("data-vanguard-animated", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(root).not.toHaveAttribute("data-vanguard-animated", "true");
  await expect(page.getByRole("button", { name: /animações/ })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("Vanguard route walks the camera through three steps and back", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/propostas/vanguard");
  await expect(page.locator("[data-vanguard]")).toHaveAttribute("data-vanguard-animated", "true");
  const g = await page.locator("[data-vg-route]").evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, travel: (el as HTMLElement).offsetHeight - innerHeight }));
  expect(g.travel).toBeGreaterThan(1500);
  const visibleStep = () => page.locator("[data-vg-step]").evaluateAll(items => items.findIndex(item => Number(getComputedStyle(item).opacity) > .9));
  const drawn = () => page.locator("[data-vg-route-line]").evaluate(el => 1 - Number(el.getAttribute("stroke-dashoffset")));
  const scale = () => page.locator("[data-vg-camera]").evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).a);
  // A lazy image finishing mid-test makes ScrollTrigger refresh and restore the previous position: scroll again while waiting.
  const at = (progress: number, read: () => Promise<number>) => async () => { await page.evaluate(y => scrollTo(0, y), g.top + g.travel * progress); return read(); };
  for (const [progress, step, minDrawn] of [[.3, 0, .2], [.58, 1, .6], [1, 2, .99]] as const) {
    await expect.poll(at(progress, visibleStep)).toBe(step);
    await expect.poll(at(progress, drawn)).toBeGreaterThan(minDrawn);
    expect(await scale()).toBeGreaterThan(1.5);
  }
  // The camera must keep the photograph covering the stage.
  const covered = await page.evaluate(() => { const s = document.querySelector("[data-vg-route-stage]")!.getBoundingClientRect(); const c = document.querySelector("[data-vg-camera]")!.getBoundingClientRect(); return c.left <= s.left + 1 && c.top <= s.top + 1 && c.right >= s.right - 1 && c.bottom >= s.bottom - 1; });
  expect(covered).toBe(true);
  await expect.poll(at(.3, visibleStep)).toBe(0);
  await expect.poll(at(-.3, drawn)).toBeLessThan(.01);
});

test("Vanguard peak goes from terrain to sketch, model and house, and back", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/propostas/vanguard");
  await expect(page.locator("[data-vanguard]")).toHaveAttribute("data-vanguard-animated", "true");
  const g = await page.locator("[data-vg-process]").evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, travel: (el as HTMLElement).offsetHeight - innerHeight }));
  expect(g.travel).toBeGreaterThan(3000);
  const at = (progress: number, read: () => Promise<unknown>) => async () => { await page.evaluate(y => scrollTo(0, y), g.top + g.travel * progress); return read(); };
  const visibleStep = () => page.locator("[data-vg-process-step]").evaluateAll(items => items.findIndex(item => Number(getComputedStyle(item).opacity) > .9));
  const opened = (layer: string) => page.locator(`[data-vg-layer="${layer}"]`).evaluate(el => getComputedStyle(el).clipPath.replace(/\s/g, ""));
  const sketchDrawn = () => page.locator("[data-vg-sketch]").first().evaluate(el => 1 - Number(el.getAttribute("stroke-dashoffset")));
  // Start: blank sheet, the terrain still closed on the horizon.
  await expect.poll(at(0, () => opened("terreno"))).toContain("inset(50%");
  // Each stage shows its own text and picture.
  await expect.poll(at(.2, visibleStep)).toBe(0);
  expect(await opened("terreno")).toMatch(/inset\(0(%|px)/);
  await expect.poll(at(.42, visibleStep)).toBe(1);
  await expect.poll(at(.42, sketchDrawn)).toBeGreaterThan(.5);
  await expect.poll(at(.66, visibleStep)).toBe(2);
  expect(await opened("maquete")).toMatch(/inset\(0(%|px)/);
  await expect.poll(at(1, visibleStep)).toBe(3);
  expect(await opened("casa")).toMatch(/inset\(0(%|px)/);
  // The pencil has measured the whole way; scrolling back closes it again.
  expect(await page.locator("[data-vg-pencil]").evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).d)).toBeGreaterThan(.99);
  await expect.poll(at(.2, visibleStep)).toBe(0);
  await expect.poll(at(-.2, () => opened("casa"))).toContain("100%");
});

test("Vanguard scrolls with the wheel without jumping back", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/propostas/vanguard");
  await expect(page.locator("[data-vanguard]")).toHaveAttribute("data-vanguard-animated", "true");
  await page.mouse.move(700, 450);
  let last = 0;
  for (let i = 0; i < 160; i++) {
    await page.mouse.wheel(0, 90);
    const y = await page.evaluate(() => scrollY);
    expect(y).toBeGreaterThanOrEqual(last - 2);
    last = y;
  }
  expect(last).toBeGreaterThan(8000);
});

test("Vanguard fits phones and shows the final state with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/propostas/vanguard");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("heading", { level: 1, name: "O essencial também ocupa espaço." })).toBeVisible();
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect(await photoOpacity(page)).toBe(1);
  // Without motion the three route steps are all readable.
  for (const title of ["Água", "Sombra", "Abertura"]) await expect(page.locator("[data-vg-step]").filter({ hasText: title })).toBeVisible();
  for (const title of ["Terreno", "Conversa", "Estudo", "Casa"]) await expect(page.locator("[data-vg-process-step] strong").getByText(title, { exact: true })).toBeVisible();
  for (const layer of ["terreno", "conversa", "maquete", "casa"]) await expect(page.locator(`[data-vg-layer="${layer}"] img`)).toBeVisible();
  await expect(page.getByText("Nenhum projeto aqui corresponde a obra executada.")).toBeVisible();
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
});

test("Vanguard keeps its content without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/propostas/vanguard");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "O pátio como centro." })).toBeAttached();
  expect(await photoOpacity(page)).toBe(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

