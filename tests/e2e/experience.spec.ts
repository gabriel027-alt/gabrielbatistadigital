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
  await page.evaluate(() => { const hero = document.getElementById("inicio")!; scrollTo({ top: hero.offsetTop + (hero.clientHeight - innerHeight) * .8, behavior: "instant" }); });
  await expect(scene).toHaveAttribute("data-view", "lateral");
  const mix = await scene.getAttribute("data-frame");
  await page.getByRole("button", { name: "Pausar animações" }).click();
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await expect(scene).toHaveAttribute("data-frame", mix!);
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


test("every intermediate scroll position paints one opaque frame", async ({ page }) => {
  await page.addInitScript(() => {
    const original = CanvasRenderingContext2D.prototype.drawImage;
    const calls: number[] = [];
    (window as unknown as { frameAlphas: number[] }).frameAlphas = calls;
    CanvasRenderingContext2D.prototype.drawImage = new Proxy(original, {
      apply(target, receiver, args) {
        calls.push((receiver as CanvasRenderingContext2D).globalAlpha);
        return Reflect.apply(target, receiver, args);
      },
    });
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const scene = page.locator(".atelier-scene");
  await expect(scene).toHaveAttribute("data-ready", "true");
  const bounds = await page.locator("#inicio").evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, range: el.clientHeight - innerHeight }));
  for (let index = 0; index < 9; index++) {
    const scroll = index === 0 ? 0 : bounds.top + (.06 + index / 8 * .64) * bounds.range;
    await page.evaluate(y => scrollTo({ top: y, behavior: "instant" }), scroll);
    await expect(scene).toHaveAttribute("data-frame", String(index));
  }
  expect(await page.locator(".cinema-side").count()).toBe(0);
  const alphas = await page.evaluate(() => (window as unknown as { frameAlphas: number[] }).frameAlphas);
  expect(alphas.length).toBeGreaterThan(8);
  expect(alphas.every(alpha => alpha === 1)).toBe(true);
});

test("prototype selections change content and image, FAQ answers are reachable", async ({ page }) => {
  for (const slug of ["chronos-atelier", "vanguard", "aura-aesthetics"]) {
    await page.goto(`/conceitos/${slug}`);
    const tabs = page.getByRole("tablist", { name: "Explorar o conceito" });
    const seen = new Set<string>();
    const texts = new Set<string>();
    for (let i = 0; i < 3; i++) {
      await tabs.getByRole("tab").nth(i).click();
      seen.add(await page.locator(".explorer-photo img").getAttribute("src") || "");
      await expect.poll(() => page.locator(".explorer-photo img").evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      texts.add(await page.getByRole("tabpanel").innerText());
    }
    expect(seen.size).toBe(3);
    expect(texts.size).toBe(3);
  }
  await page.goto("/");
  const summary = page.locator("#duvidas summary").first();
  await summary.focus();
  await summary.press("Enter");
  await expect(page.locator("#duvidas details").first()).toHaveAttribute("open", "");
  await expect(page.locator("#duvidas details").first().locator("p")).toBeVisible();
});


test("resizing a painted frame keeps portrait pixels", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".atelier-scene")).toHaveAttribute("data-ready", "true");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => page.locator(".cinema-sequence").evaluate((el: HTMLCanvasElement) => {
    const ctx = el.getContext("2d")!;
    const sample = ctx.getImageData(Math.floor(el.width * .7), Math.floor(el.height * .4), 1, 1).data;
    return sample[0] + sample[1] + sample[2];
  })).toBeGreaterThan(20);
});
