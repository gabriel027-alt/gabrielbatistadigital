import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

test("Portfolio presents two complete films among six works without eager video requests", async ({ page }) => {
  const videoRequests: string[] = [];
  page.on("request", request => { if (/\.(mp4|webm)(?:$|\?)/.test(request.url())) videoRequests.push(request.url()); });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page.locator(".signature-work-card")).toHaveCount(6);
  await expect(page.locator("video[data-project-film]")).toHaveCount(2);
  expect(videoRequests).toEqual([]);
  for (const brand of ["aura", "orla"]) {
    const card = page.locator(`#${brand}-filme`), video = card.locator("video");
    await expect(video).toHaveAttribute("preload", "none");
    await expect(video).not.toHaveAttribute("autoplay", "");
    await expect(card.getByRole("link")).toHaveCount(1);
    await expect(card.getByRole("link")).toHaveAttribute("href", /wa.me\/5538998267717/);
    await expect(card.locator('a[href^="/propostas"],a[href^="/modelos"]')).toHaveCount(0);
    await video.evaluate(el => (el as HTMLVideoElement).load());
    await expect.poll(() => video.evaluate(el => (el as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(1);
    expect(await video.evaluate(el => (el as HTMLVideoElement).duration)).toBeGreaterThan(20);
  }
  const aura = page.locator('video[data-project-film="aura"]'), orla = page.locator('video[data-project-film="orla"]');
  await aura.evaluate(el => (el as HTMLVideoElement).play());
  await expect.poll(() => aura.evaluate(el => (el as HTMLVideoElement).paused)).toBe(false);
  await orla.evaluate(el => (el as HTMLVideoElement).play());
  await expect.poll(() => aura.evaluate(el => (el as HTMLVideoElement).paused)).toBe(true);
  await expect.poll(() => orla.evaluate(el => (el as HTMLVideoElement).paused)).toBe(false);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("Each complete film has a matching manifest, captions and CTA chapters", async () => {
  for (const brand of ["aura", "orla"]) {
    const manifest = JSON.parse(readFileSync(`public/videos/projects/${brand}-showcase.json`, "utf8"));
    const bytes = readFileSync(`public/videos/projects/${brand}-showcase.mp4`);
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(manifest.sha256);
    expect(bytes.length).toBe(manifest.bytes);
    expect(manifest.localInteractionsOnly).toBe(true);
    expect(manifest.chapters.map((chapter: {label: string}) => chapter.label)).toEqual(expect.arrayContaining(["Experiência pelo scroll", "CTA e escolhas", "Resumo revisável"]));
    for (const chapter of manifest.chapters) expect(chapter.seconds).toBeLessThan(manifest.durationSeconds);
    expect(readFileSync(`public/videos/projects/${brand}-showcase.pt.vtt`, "utf8")).toContain("Resumo revisável");
  }
});
