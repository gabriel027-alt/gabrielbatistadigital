import { expect, test } from "@playwright/test";

const cases = [
  { route: "/", mobile: false, sector: "Seminovos com o laudo aberto", action: "Quero um site para minha loja de seminovos" },
  { route: "/pt-pt", mobile: true, sector: "Usados com relatório aberto", action: "Quero um site para a minha loja de usados" },
  { route: "/en", mobile: false, sector: "Pre-owned cars with open inspection reports", action: "I want a website for my pre-owned car dealership" },
  { route: "/es", mobile: true, sector: "Seminuevos con el informe abierto", action: "Quiero un sitio para mi tienda de seminuevos" },
];

for (const item of cases) {
  test(`Paddock follows Arrimo in the selected strip and plays its matching film in ${item.route}`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: item.mobile ? { width: 390, height: 844 } : { width: 1536, height: 696 },
      deviceScaleFactor: item.mobile ? 1 : 1.25,
      isMobile: item.mobile, hasTouch: item.mobile, reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(item.route);
    const list = page.locator('#editorial-work ul:not([aria-hidden])');
    await expect(list.locator("h3")).toHaveText(["Cerne Implantes", "Nítida", "Fio", "Elo", "Eixo Ortopedia", "Lume Psicologia", "Arrimo Advocacia Previdenciária", "Paddock", "Talhão Advocacia do Agro", "Sutil Cirurgia Plástica", "Casa Brisa", "Aura", "Orla"]);
    await expect(list.locator("li").nth(7)).toContainText(item.sector);
    await expect(page.locator('video[data-editorial-loop][src]')).toHaveCount(0);
    await list.locator("li").nth(7).getByRole("button").click();
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
      source: `/videos/projects/brands/paddock-${item.mobile ? "mobile" : "desktop"}.mp4`,
      width: item.mobile ? 1080 : 1920, height: item.mobile ? 1920 : 1080, error: undefined,
    });
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await context.close();
  });
}
