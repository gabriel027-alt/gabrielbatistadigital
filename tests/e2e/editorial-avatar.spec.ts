import { test, expect } from "@playwright/test";

const route = "/propostas/portfolio-editorial";
const src = "/videos/editorial/gabriel-avatar-loop-v11.mp4";
const albums = ["spotify:album:3HCCUaRSjHSFOe4fqE0BiP", "spotify:album:6zr7fFAGz7kdayP8p3pbss", "spotify:album:3oUoQ0UH7Rv06x1kpSjS36"];
const lastTrack = "spotify:track:2ZozYdvhnrCPeE7SvbxxLS";
const music = albums[0];
const spotify = "https://open.spotify.com/**";
const musicOn = process.env.NEXT_PUBLIC_FOOTER_MUSIC === "on";

/** Replaces Spotify's script with a recorder, so these tests don't depend on Spotify being reachable. */
const fakeSpotifyApi = `
  window.__spotifyCalls = [];
  window.onSpotifyIframeApiReady({
    createController(element, options, ready) {
      window.__spotifyCalls.push("create:" + options.uri);
      const frame = document.createElement("iframe");
      frame.title = "Spotify";
      element.replaceWith(frame);
      let listener = () => {};
      const report = isPaused => listener({ data: { isPaused } });
      window.__spotifyReport = report;
      window.__spotifyUpdate = data => listener({ data });
      ready({
        loadUri(uri) { window.__spotifyCalls.push("load:" + uri); },
        play() { window.__spotifyCalls.push("play"); report(false); },
        pause() { window.__spotifyCalls.push("pause"); report(true); },
        resume() { window.__spotifyCalls.push("resume"); report(false); },
        destroy() { window.__spotifyCalls.push("destroy"); frame.remove(); },
        addListener(_, next) { listener = next; },
      });
    },
  });`;

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
  expect(await film.evaluate(el => (el as HTMLVideoElement).duration)).toBeCloseTo(334 / 30, 1);
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

test("Nothing from Spotify loads until asked for, and the music follows the visitor in and out of the footer", async ({ page }) => {
  test.skip(!musicOn, "Music is off in this build.");
  await page.setViewportSize({ width: 1440, height: 900 });
  const requests: string[] = [];
  await page.route(spotify, route => { requests.push(route.request().url()); return route.fulfill({ contentType: "text/javascript", body: fakeSpotifyApi }); });
  await page.goto(`${route}#editorial-footer`);
  await expect(page.locator("[data-avatar-loop]")).toHaveAttribute("data-ready", "true");
  const open = page.getByRole("button", { name: "Ouvir Limp Bizkit" });
  await expect(open).toHaveAttribute("aria-expanded", "false");
  expect(requests).toEqual([]);
  await open.click();
  await expect(page.locator("[data-music-player] iframe")).toHaveCount(1);
  const calls = () => page.evaluate(() => (window as unknown as { __spotifyCalls: string[] }).__spotifyCalls);
  await expect.poll(calls).toEqual([`create:${music}`, "play"]);
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(async () => (await calls()).at(-1)).toBe("pause");
  await page.locator("#editorial-footer").evaluate(el => el.scrollIntoView({ behavior: "instant" }));
  await expect.poll(async () => (await calls()).at(-1)).toBe("resume");
  await page.getByRole("button", { name: "Fechar player" }).click();
  await expect.poll(async () => (await calls()).at(-1)).toBe("destroy");
  await expect(page.locator("[data-music-player] iframe")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Ouvir Limp Bizkit" })).toHaveAttribute("aria-expanded", "false");
  // Reopening reuses the loaded script.
  await page.getByRole("button", { name: "Ouvir Limp Bizkit" }).click();
  await expect(page.locator("[data-music-player] iframe")).toHaveCount(1);
  expect(requests).toHaveLength(1);
});

test("Music the visitor paused stays paused when they come back", async ({ page }) => {
  test.skip(!musicOn, "Music is off in this build.");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.route(spotify, route => route.fulfill({ contentType: "text/javascript", body: fakeSpotifyApi }));
  await page.goto(`${route}#editorial-footer`);
  await page.getByRole("button", { name: "Ouvir Limp Bizkit" }).click();
  await expect(page.locator("[data-music-player] iframe")).toHaveCount(1);
  const calls = () => page.evaluate(() => (window as unknown as { __spotifyCalls: string[] }).__spotifyCalls);
  await expect.poll(async () => (await calls()).at(-1)).toBe("play");
  // The visitor presses pause inside Spotify's own player.
  await page.evaluate(() => (window as unknown as { __spotifyReport: (paused: boolean) => void }).__spotifyReport(true));
  const film = page.locator("[data-avatar-loop]");
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(() => film.evaluate(el => (el as HTMLVideoElement).paused)).toBe(true);
  await page.locator("#editorial-footer").evaluate(el => el.scrollIntoView({ behavior: "instant" }));
  await expect.poll(() => film.evaluate(el => (el as HTMLVideoElement).paused)).toBe(false);
  expect(await calls()).toEqual([`create:${music}`, "play"]);
});

test("The albums take turns: by button, at the end of the last track, and back to the first", async ({ page }) => {
  test.skip(!musicOn, "Music is off in this build.");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.route(spotify, route => route.fulfill({ contentType: "text/javascript", body: fakeSpotifyApi }));
  await page.goto(`${route}#editorial-footer`);
  await page.getByRole("button", { name: "Ouvir Limp Bizkit" }).click();
  await expect(page.locator("[data-music-player] iframe")).toHaveCount(1);
  const calls = () => page.evaluate(() => (window as unknown as { __spotifyCalls: string[] }).__spotifyCalls);
  const update = (data: object) => page.evaluate(next => (window as unknown as { __spotifyUpdate: (data: object) => void }).__spotifyUpdate(next), data);
  await expect.poll(calls).toEqual([`create:${albums[0]}`, "play"]);

  // The last track playing, but far from its end, changes nothing; neither does another track at its end.
  await update({ isPaused: false, playingURI: lastTrack, position: 5000, duration: 29713 });
  await update({ isPaused: false, playingURI: "spotify:track:other", position: 29500, duration: 29713 });
  expect(await calls()).toHaveLength(2);

  // Near the end of the last track, it moves on once, even if the update repeats, and starts playing.
  await update({ isPaused: false, playingURI: lastTrack, position: 29000, duration: 29713 });
  await update({ isPaused: false, playingURI: lastTrack, position: 29500, duration: 29713 });
  await expect.poll(calls).toEqual([`create:${albums[0]}`, "play", `load:${albums[1]}`, "play"]);

  // A paused player at the end of a track is the visitor's choice: it stays.
  await update({ isPaused: true, playingURI: "spotify:track:4BLVr0wwXgTcog53Y2kjRG", position: 29500, duration: 29713 });
  expect(await calls()).toHaveLength(4);

  const next = page.getByRole("button", { name: "Próximo álbum" });
  await next.click();
  await expect.poll(async () => (await calls()).slice(4)).toEqual([`load:${albums[2]}`, "play"]);
  await next.click();
  await expect.poll(async () => (await calls()).slice(6)).toEqual([`load:${albums[0]}`, "play"]);

  await page.getByRole("button", { name: "Fechar player" }).click();
  await expect(next).toHaveCount(0);
});

test("With music off, the footer shows no control and never contacts Spotify", async ({ page }) => {
  test.skip(musicOn, "Music is on in this build.");
  const requests: string[] = [];
  page.on("request", request => { if (request.url().includes("spotify")) requests.push(request.url()); });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${route}#editorial-footer`);
  await expect(page.locator("[data-avatar-loop]")).toHaveAttribute("data-ready", "true");
  await expect(page.locator("[data-music-control]")).toHaveCount(0);
  expect(requests).toEqual([]);
});

test("If Spotify cannot load, the control recovers and explains", async ({ page }) => {
  test.skip(!musicOn, "Music is off in this build.");
  await page.route(spotify, route => route.abort());
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${route}#editorial-footer`);
  await page.getByRole("button", { name: "Ouvir Limp Bizkit" }).click();
  await expect(page.getByRole("status")).toContainText("Spotify não respondeu");
  await expect(page.getByRole("button", { name: "Ouvir Limp Bizkit" })).toHaveAttribute("aria-expanded", "false");
});

for (const mode of ["reduced", "saveData"] as const) {
  test(`Music is not offered when the scene cannot play: ${mode}`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: mode === "reduced" ? "reduce" : "no-preference" });
    if (mode === "saveData") await context.addInitScript(() => Object.defineProperty(navigator, "connection", { value: { saveData: true }, configurable: true }));
    const page = await context.newPage();
    await page.goto(route);
    await page.locator("#editorial-footer").scrollIntoViewIfNeeded();
    await expect(page.locator("[data-music-control]")).toHaveCount(0);
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
