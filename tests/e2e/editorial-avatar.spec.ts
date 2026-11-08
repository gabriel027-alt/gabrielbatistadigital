import { test, expect } from "@playwright/test";

const route = "/propostas/portfolio-editorial";
const src = "/videos/editorial/gabriel-avatar-loop-v1.mp4";

test("Footer film loads on arrival, pauses offscreen and obeys the motion control", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const requests: string[] = [];
  page.on("request", request => { if (request.url().includes(src)) requests.push(request.url()); });
  await page.goto(route);
  const film = page.locator("video[data-avatar-loop]");
  await expect(film).not.toHaveAttribute("src");
  expect(requests).toEqual([]);
  await page.locator("#editorial-footer").scrollIntoViewIfNeeded();
  await expect(film).toHaveAttribute("src", src);
  await expect.poll(() => film.evaluate(el => (el as HTMLVideoElement).currentTime)).toBeGreaterThan(.2);
  await expect(film).toHaveAttribute("data-ready", "true");
  expect(await film.evaluate(el => (el as HTMLVideoElement).muted)).toBe(true);
  expect(await film.evaluate(el => (el as HTMLVideoElement).duration)).toBeCloseTo(11.1, 1);
  await film.evaluate(el => { const v = el as HTMLVideoElement; v.currentTime = v.duration - .1; });
  await expect.poll(() => film.evaluate(el => (el as HTMLVideoElement).currentTime)).toBeLessThan(2);
  await page.getByRole("button", { name: "Pausar movimento" }).click();
  await expect.poll(() => film.evaluate(el => (el as HTMLVideoElement).paused)).toBe(true);
  await page.getByRole("button", { name: "Ativar movimento" }).click();
  await expect.poll(() => film.evaluate(el => (el as HTMLVideoElement).paused)).toBe(false);
  await page.locator("#editorial-footer").getByRole("link", { name: "Voltar ao início" }).click();
  await expect.poll(() => film.evaluate(el => (el as HTMLVideoElement).paused)).toBe(true);
});

for (const mode of ["reduced", "saveData", "noJS"] as const) {
  test(`Footer retains a poster without video download: ${mode}`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: mode !== "noJS", reducedMotion: mode === "reduced" ? "reduce" : "no-preference" });
    if (mode === "saveData") await context.addInitScript(() => Object.defineProperty(navigator, "connection", { value: { saveData: true }, configurable: true }));
    const page = await context.newPage();
    const requests: string[] = [];
    page.on("request", request => { if (request.url().includes(src)) requests.push(request.url()); });
    await page.goto(route);
    await page.locator("#editorial-footer").scrollIntoViewIfNeeded();
    const poster = page.locator("[data-avatar-scene] img");
    await expect(poster).toBeVisible();
    await expect.poll(() => poster.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(page.locator("[data-avatar-loop]")).not.toHaveAttribute("src");
    expect(requests).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await context.close();
  });
}

test("A failed footer film keeps the poster visible", async ({ page }) => {
  await page.route(`**${src}`, route => route.abort());
  await page.goto(route);
  await page.locator("#editorial-footer").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-avatar-loop]")).toHaveCSS("opacity", "0");
  await expect(page.locator("[data-avatar-scene] img")).toBeVisible();
});


test("Direct footer link reaches and starts the film on desktop and mobile", async ({ browser }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.goto(`${route}#editorial-footer`);
    const film = page.locator("[data-avatar-loop]");
    await expect(film).toHaveAttribute("src", src);
    await expect.poll(() => film.evaluate(el => (el as HTMLVideoElement).currentTime)).toBeGreaterThan(.2);
    const top = await page.locator("#editorial-footer").evaluate(el => el.getBoundingClientRect().top);
    expect(Math.abs(top)).toBeLessThan(50);
    await page.locator("#editorial-footer").getByRole("link", { name: "Voltar ao início" }).click();
    await expect.poll(() => film.evaluate(el => (el as HTMLVideoElement).paused)).toBe(true);
    await context.close();
  }
});
