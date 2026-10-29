import { test, expect } from "@playwright/test";

test("day/night scene, image integrity, logos and pause controls", async ({ page, request }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ colorScheme: "dark" });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  const scene = page.locator(".atelier-scene");
  const portrait = scene.locator(".cinema-front img");
  await expect.poll(() => portrait.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  await expect(scene.locator(".cinema-tools li")).toHaveCount(6);
  for (const theme of ["Dia", "Noite"]) {
    await page.getByRole("button", { name: theme, exact: true }).click();
    await expect(page.getByRole("button", { name: theme, exact: true })).toHaveAttribute("aria-pressed", "true");
    for (const icon of await scene.locator(".cinema-tools li").all()) {
      await expect(icon).toBeVisible();
      const box = await icon.boundingBox();
      const face = await scene.boundingBox();
      expect(box!.y).toBeGreaterThan(face!.y + face!.height * .65);
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
  await expect(scene.locator(".atelier-cat, .atelier-lamp")).toHaveCount(0);
  await expect(scene).toHaveAttribute("data-view", "frontal");
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
  await expect(page.locator(".cinema-tools li")).toHaveCount(6);
  const brand = await page.locator(".site-header .brand-symbol").boundingBox();
  const toggle = await page.locator(".theme-switch").boundingBox();
  expect(brand!.x + brand!.width).toBeLessThan(toggle!.x);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const img of await page.locator(".project-cover").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
});


test("frontal opening and editorial transition follow scroll, freeze on pause", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const scene = page.locator(".atelier-scene");
  await expect(scene).toHaveAttribute("data-view", "frontal");
  await page.evaluate(() => scrollTo({ top: 650, behavior: "instant" }));
  await expect(scene).toHaveAttribute("data-view", "lateral");
  const mix = await scene.evaluate(el => getComputedStyle(el).getPropertyValue("--scene-mix"));
  await page.getByRole("button", { name: "Pausar animações" }).click();
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(() => scene.evaluate(el => getComputedStyle(el).getPropertyValue("--scene-mix"))).toBe(mix);
  await page.getByRole("button", { name: "Ativar animações" }).click();
  await expect(scene).toHaveAttribute("data-view", "frontal");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => scrollTo({ top: 500, behavior: "instant" }));
  await expect(scene).toHaveAttribute("data-view", "frontal");
});

test("prototype detail explorers support keyboard and real page previews load", async ({ page }) => {
  for (const slug of ["chronos-atelier", "vanguard", "aura-aesthetics"]) {
    await page.goto(`/conceitos/${slug}`);
    const tabs = page.getByRole("tablist", { name: "Explorar o conceito" });
    await tabs.getByRole("tab").first().focus();
    await tabs.getByRole("tab").first().press("ArrowRight");
    await expect(tabs.getByRole("tab").nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toBeVisible();
    await tabs.getByRole("tab").nth(1).press("End");
    await expect(tabs.getByRole("tab").last()).toHaveAttribute("aria-selected", "true");
  }
  await page.goto("/");
  for (const card of await page.locator(".project-card").all()) {
    await card.scrollIntoViewIfNeeded();
    for (const img of await card.locator("img").all()) {
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    }
  }
});
