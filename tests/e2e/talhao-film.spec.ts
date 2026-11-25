import { expect, test } from "@playwright/test";

const cases = [
  { route: "/", mobile: false, sector: "Advocacia do agro", action: "Quero um site para meu escritório" },
  { route: "/pt-pt", mobile: true, sector: "Direito agrário", action: "Quero um site para o meu escritório de direito agrário" },
  { route: "/en", mobile: false, sector: "Agribusiness law", action: "I want a website for my agribusiness law firm" },
  { route: "/es", mobile: true, sector: "Derecho agrario", action: "Quiero un sitio para mi despacho de derecho agrario" },
];

for (const item of cases) {
  test(`Talhão follows Paddock behind "Ver mais" and plays its matching film in ${item.route}`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: item.mobile ? { width: 390, height: 844 } : { width: 1536, height: 696 },
      deviceScaleFactor: item.mobile ? 1 : 1.25,
      isMobile: item.mobile, hasTouch: item.mobile, reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(item.route);
    const list = page.locator('#editorial-work ul:not([aria-hidden])');
    await expect(list.locator("h3")).toHaveText(["Cerne Implantes", "Lume Psicologia", "Arrimo Advocacia Previdenciária", "Casa Brisa", "Vão Arquitetura e Interiores", "Lavra Joalheria", "Ponte Escola Bilíngue", "Aura", "Nítida", "Fio", "Elo", "Eixo Ortopedia", "Paddock", "Talhão Advocacia do Agro", "Sutil Cirurgia Plástica", "Orla"]);
    // Talhão is behind "Ver mais" since 24/11/2026.
    await page.locator("[data-more-toggle]:visible").click();
    await expect(list.locator("li").nth(13)).toContainText(item.sector);
    await expect(page.locator('video[data-editorial-loop][src]')).toHaveCount(0);
    await list.locator("li").nth(13).getByRole("button").click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: item.action })).toHaveAttribute("href", /wa.me\/5538998267717/);
    const video = dialog.locator("video");
    await video.evaluate(async el => { const v = el as HTMLVideoElement; v.muted = true; await v.play(); });
    await expect.poll(() => video.evaluate(el => (el as HTMLVideoElement).currentTime)).toBeGreaterThan(.2);
    const state = await video.evaluate(el => {
      const v = el as HTMLVideoElement;
      return { source: new URL(v.currentSrc).pathname, width: v.videoWidth, height: v.videoHeight, error: v.error?.message };
    });
    expect(state).toEqual({
      source: `/videos/projects/brands/talhao-${item.mobile ? "mobile" : "desktop"}.mp4`,
      width: item.mobile ? 1080 : 1920, height: item.mobile ? 1920 : 1080, error: undefined,
    });
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await context.close();
  });
}
