import { test, expect } from "@playwright/test";

test("day/night scene, image integrity, logos and pause controls", async ({ page, request }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ colorScheme: "dark" });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  const scene = page.locator(".atelier-scene");
  const portrait = scene.locator(".portrait-photo img");
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
  await expect(scene).toHaveAttribute("data-portrait", "single");
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


test("one portrait stays unchanged while composition scrolls, pauses and respects reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const scene = page.locator(".portrait-scene");
  const portrait = scene.locator(".portrait-photo img");
  const source = await portrait.getAttribute("src");
  await page.evaluate(() => scrollTo({ top: 250, behavior: "instant" }));
  await expect.poll(() => scene.getAttribute("data-progress").then(Number)).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Pausar animações" }).click();
  const progress = await scene.getAttribute("data-progress");
  await page.evaluate(() => scrollTo({ top: 400, behavior: "instant" }));
  await expect(scene).toHaveAttribute("data-progress", progress!);
  await page.getByRole("button", { name: "Ativar animações" }).click();
  await expect.poll(() => scene.getAttribute("data-progress").then(Number)).toBeGreaterThan(Number(progress));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(scene).toHaveAttribute("data-progress", "0");
  await expect(portrait).toHaveAttribute("src", source!);
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


test("no alternate poses or video are fetched and the gallery follows the offer", async ({ page }) => {
  const frameRequests: string[] = [];
  page.on("request", request => { if (request.url().includes("/hero/frames/") || request.url().endsWith(".mp4")) frameRequests.push(request.url()); });
  await page.goto("/");
  const portrait = page.locator(".portrait-photo img");
  await expect(portrait).toHaveCount(1);
  await expect(page.locator("#inicio canvas, #inicio video, .cinema-side")).toHaveCount(0);
  for (const top of [0, 200, 450, 0]) await page.evaluate(y => scrollTo({ top: y, behavior: "instant" }), top);
  expect(frameRequests).toEqual([]);
  expect(await page.locator("#inicio").evaluate(el => el.nextElementSibling?.id)).toBe("modelos");
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  const cta = page.getByRole("link", { name: "Conversar sobre meu site", exact: true });
  await expect(cta).toBeInViewport();
  await expect(cta).toHaveAttribute("href", /wa\.me\/5538998267717/);
  await expect(page.getByRole("link", { name: "Ver modelos por nicho", exact: true })).toHaveAttribute("href", "#modelos");
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


test("portrait survives responsive resizing without changing pose", async ({ page }) => {
  await page.goto("/");
  for (const width of [1440, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.locator(".portrait-photo img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    await expect(page.locator(".portrait-photo img")).toHaveAttribute("src", /gabriel-contact/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("portrait and primary offer remain available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("#inicio h1")).toContainText("Um site à altura.");
  await expect(page.locator(".portrait-photo img")).toBeVisible();
  await expect(page.getByRole("link", { name: "Conversar sobre meu site", exact: true })).toBeVisible();
  await context.close();
});
