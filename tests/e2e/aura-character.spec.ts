import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.use({ launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE, args: ['--enable-unsafe-swiftshader'] } });

test.describe('Aura isolated character', () => {
  test.setTimeout(90000);
  test('regional morph changes the rendered face, reverses, and pause holds the frame', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('/propostas/aura/personagem');
    const scene = page.locator('[data-character-scene]');
    await expect(page.getByRole('status')).toHaveText('Personagem interativa disponível.', { timeout: 30000 });
    await expect(scene.locator('canvas')).toHaveCount(1);
    await page.getByRole('button', { name: 'Pausar movimento' }).click();
    const range = page.getByRole('slider', { name: 'Projeção malar' });
    // Set both endpoints at exactly the same camera and with idle motion stopped.
    await range.fill('1'); await range.fill('0');
    await expect(scene).toHaveAttribute('data-view', 'malar');
    await expect(scene).toHaveAttribute('data-morph', '0.000');
    const initial = await scene.screenshot();
    await range.fill('100');
    await expect(scene).toHaveAttribute('data-morph', '1.000');
    const changed = await scene.screenshot();
    expect(changed.equals(initial)).toBe(false);
    await page.waitForTimeout(500);
    expect((await scene.screenshot()).equals(changed)).toBe(true);
    await range.fill('0');
    await expect(scene).toHaveAttribute('data-morph', '0.000');
    expect((await scene.screenshot()).equals(initial)).toBe(true);
    await page.getByRole('button', { name: 'Acompanhar pelo scroll' }).click();
    await page.getByRole('button', { name: 'Retomar movimento' }).click();
    const geometry = await page.locator('[data-character-track]').evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, travel: (el as HTMLElement).offsetHeight - innerHeight }));
    await page.evaluate(y => scrollTo(0, y), geometry.top + geometry.travel * .7);
    await expect.poll(() => scene.getAttribute('data-morph')).toMatch(/^0\.[89]|1\.000/);
    await page.evaluate(() => scrollTo(0, 0));
    await expect(scene).toHaveAttribute('data-morph', '0.000');
    await expect(scene).toHaveAttribute('data-view', 'portrait');
    await page.getByRole('button', { name: 'Pausar movimento' }).click();
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(audit.violations).toEqual([]);
    expect(errors).toEqual([]);
  });
  test('reduced motion stays still; narrow screens retain controls and context loss restores image', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/propostas/aura/personagem');
    const scene = page.locator('[data-character-scene]');
    await expect(page.getByRole('status')).toHaveText('Personagem interativa disponível.', { timeout: 30000 });
    const frame = await scene.screenshot();
    await page.waitForTimeout(500);
    expect((await scene.screenshot()).equals(frame)).toBe(true);
    for (const width of [360, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await page.getByRole('slider').fill('100');
    await expect(scene).toHaveAttribute('data-morph', '1.000');
    await scene.locator('canvas').evaluate(el => {
      const ext = (el as HTMLCanvasElement).getContext('webgl2')?.getExtension('WEBGL_lose_context');
      if (!ext) throw new Error('Context-loss extension unavailable');
      ext.loseContext();
    });
    await expect(page.getByRole('status')).toContainText('Visualização estática');
    await expect(page.getByRole('img', { name: /Personagem digital/ })).toBeVisible();
    await expect(page.getByRole('slider')).toBeDisabled();
  });
  test('failed model and no JavaScript retain the illustration and explanation', async ({ page, browser }) => {
    await page.route('**/models/aura-character/character.glb', route => route.abort());
    await page.goto('/propostas/aura/personagem');
    await expect(page.getByRole('status')).toContainText('Visualização estática');
    await expect(page.getByRole('img', { name: /Personagem digital/ })).toBeVisible();
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const staticPage = await context.newPage();
    await staticPage.goto('http://127.0.0.1:3107/propostas/aura/personagem');
    await expect(staticPage.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(staticPage.getByRole('img', { name: /Personagem digital/ })).toBeVisible();
    await staticPage.getByRole('link', { name: 'Sobre esta cena ↓' }).click();
    await expect(staticPage.getByText('Esta personagem e sua transformação', { exact: false })).toBeVisible();
    await context.close();
  });
});
