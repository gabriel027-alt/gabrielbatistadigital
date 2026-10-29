import { test, expect } from "@playwright/test";

test("day/night scene, image integrity, logos and pause controls", async ({ page, request }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ colorScheme: "dark" });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  const scene = page.locator(".atelier-scene");
  const portrait = scene.locator("img");
  await expect.poll(() => portrait.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  await expect(scene.locator(".atelier-tool")).toHaveCount(6);
  for (const theme of ["Dia", "Noite"]) {
    await page.getByRole("button", { name: theme, exact: true }).click();
    await expect(page.getByRole("button", { name: theme, exact: true })).toHaveAttribute("aria-pressed", "true");
    for (const icon of await scene.locator(".atelier-tool").all()) {
      await expect(icon).toBeVisible();
      const safe = await icon.evaluate(el => {
        const box = el.getBoundingClientRect();
        const stage = el.closest(".atelier-scene")!.getBoundingClientRect();
        const face = { left: stage.left + stage.width * .5, right: stage.left + stage.width * .9, top: stage.top + stage.height * .07, bottom: stage.top + stage.height * .53 };
        return box.right < face.left || box.left > face.right || box.bottom < face.top || box.top > face.bottom;
      });
      expect(safe).toBe(true);
    }
  }
  for (const slug of ["react", "nextdotjs", "typescript", "github", "claude", "openai"]) {
    const response = await request.get(`/images/brands/${slug}.svg`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("svg");
  }
  await page.getByRole("button", { name: "Pausar animações" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await scene.locator(".atelier-cat").evaluate(el => getComputedStyle(el).display)).toBe("none");
  expect(errors).toEqual([]);
});

test("native scroll chapters advance and mobile retains all content", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const lab = page.locator("#laboratorio");
  const bounds = await lab.evaluate(el => ({ y: el.getBoundingClientRect().top + scrollY, h: el.clientHeight }));
  for (const [fraction, phase] of [[0.05, "0"], [.5, "1"], [.95, "2"]] as const) {
    await page.evaluate(({ y, h, f }) => window.scrollTo({ top: y + (h - innerHeight) * f, behavior: "instant" }), { ...bounds, f: fraction });
    await expect(lab).toHaveAttribute("data-phase", phase);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await expect(page.getByRole("group", { name: "Iluminação do estúdio" })).toBeVisible();
  await expect(page.locator(".atelier-tool")).toHaveCount(6);
  const brand = await page.locator(".site-header .brand-symbol").boundingBox();
  const toggle = await page.locator(".theme-switch").boundingBox();
  expect(brand!.x + brand!.width).toBeLessThan(toggle!.x);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const img of await page.locator(".project-cover").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
});
