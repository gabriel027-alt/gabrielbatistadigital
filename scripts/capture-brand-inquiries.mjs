import { chromium } from '@playwright/test';
import { recordLocalPage } from './lib/record-local-page.mjs';

const base = process.env.BRAND_PREVIEW_URL || 'http://127.0.0.1:3115';
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw new Error('Local URL required');
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || '/usr/bin/chromium', headless: true });
try {
  for (const brand of ['aura', 'orla']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(`${base}/propostas/${brand}`);
    await page.waitForLoadState('networkidle');
    const title = brand === 'aura' ? 'Quero uma avaliação' : 'Encontrar meu imóvel';
    await recordLocalPage(page, `public/videos/projects/${brand}-inquiry.mp4`, async () => {
      await page.waitForTimeout(1800);
      await page.getByRole('link', { name: title, exact: true }).last().click();
      const dialog = page.getByRole('dialog');
      for (let step = 0; step < (brand === 'aura' ? 2 : 3); step++) {
        await page.waitForTimeout(1100);
        for (const fieldset of await dialog.locator('fieldset').all()) await fieldset.getByRole('radio').first().check();
        await page.waitForTimeout(650);
        await dialog.getByRole('button', { name: step === (brand === 'aura' ? 1 : 2) ? 'Ver meu resumo' : 'Continuar', exact: true }).click();
      }
      await page.waitForTimeout(3200);
      await dialog.getByRole('button', { name: 'Ajustar escolhas' }).click();
      await page.waitForTimeout(1200);
      await dialog.getByRole('button', { name: 'Fechar roteiro' }).click();
      const section = page.locator(`[data-inquiry="${brand}"]`);
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);
    });
    await page.close();
    console.log(`${brand}: local CTA journey recorded`);
  }
} finally { await browser.close(); }
