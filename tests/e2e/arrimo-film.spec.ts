import { expect, test } from "@playwright/test";

const cases = [
  { route: "/", mobile: false, sector: "Advocacia previdenciária", action: "Quero um site para meu escritório" },
  { route: "/pt-pt", mobile: true, sector: "Direito da Segurança Social", action: "Quero um site para o meu escritório de advocacia" },
  { route: "/en", mobile: false, sector: "Social security law", action: "I want a website for my law firm" },
  { route: "/es", mobile: true, sector: "Derecho de la seguridad social", action: "Quiero un sitio para mi despacho de abogados" },
];

for (const item of cases) {
  test(`Arrimo follows Lume in the selected strip and plays its matching film in ${item.route}`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: item.mobile ? { width: 390, height: 844 } : { width: 1536, height: 696 },
      deviceScaleFactor: item.mobile ? 1 : 1.25,
      isMobile: item.mobile, hasTouch: item.mobile, reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(item.route);
    const list = page.locator('#editorial-work ul:not([aria-hidden])');
    await expect(list.locator("h3")).toHaveText(["Cerne Implantes", "Lume Psicologia", "Arrimo Advocacia Previdenciária", "Paddock", "Vão Arquitetura e Interiores", "Lavra Joalheria", "Ponte Escola Bilíngue", "Aura", "Nítida", "Fio", "Elo", "Eixo Ortopedia", "Talhão Advocacia do Agro", "Sutil Cirurgia Plástica", "Casa Brisa", "Orla"]);
    await expect(list.locator("li").nth(2)).toContainText(item.sector);
    await expect(page.locator('video[data-editorial-loop][src]')).toHaveCount(0);
    await list.locator("li").nth(2).getByRole("button").click();
    const dialog = page.getByRole("dialog").filter({ has: page.getByText("Arrimo Advocacia Previdenciária", { exact: true }) });
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
      source: `/videos/projects/brands/arrimo-${item.mobile ? "mobile" : "desktop"}.mp4`,
      width: item.mobile ? 1080 : 1920, height: item.mobile ? 1920 : 1080, error: undefined,
    });
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await context.close();
  });
}
