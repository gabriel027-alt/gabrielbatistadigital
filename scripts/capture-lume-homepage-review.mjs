// Local visual review of the selected strip, at the user's Windows 125% layout and on a phone.
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { recordLocalPage } from './lib/record-local-page.mjs';

const base = process.env.PROJECT_PREVIEW_URL || 'http://127.0.0.1:3150';
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw new Error('Local preview required');
const out = process.env.LUME_REVIEW_DIR || path.join(os.tmpdir(), 'lume-homepage');
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined, headless: true });
const report = [];
try {
  for (const device of [
    { name: 'pc', viewport: { width: 1536, height: 696 }, scale: 1.25, mobile: false },
    { name: 'celular', viewport: { width: 390, height: 844 }, scale: 1, mobile: true },
  ]) {
    const context = await browser.newContext({ viewport: device.viewport, deviceScaleFactor: device.scale, isMobile: device.mobile, hasTouch: device.mobile });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1200);
    const track = page.locator('[data-work-track]');
    const bounds = await track.evaluate(el => ({ start: el.getBoundingClientRect().top + scrollY, end: el.getBoundingClientRect().top + scrollY + el.offsetHeight - innerHeight }));
    const move = (top, ms) => page.evaluate(({ top, ms }) => new Promise(resolve => {
      const from = scrollY, start = performance.now();
      function tick(now) {
        const t = Math.min(1, (now - start) / ms);
        scrollTo({ top: from + (top - from) * t, behavior: 'instant' });
        if (t < 1) requestAnimationFrame(tick); else resolve();
      }
      requestAnimationFrame(tick);
    }), { top, ms });
    await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), bounds.end);
    await page.waitForTimeout(1800);
    const opener = page.locator('#editorial-work ul:not([aria-hidden])').getByRole('button', { name: 'Ver filme completo: Lume Psicologia' });
    // Keyboard focus pauses the actual marquee and brings the first project into view, as for a visitor.
    await opener.focus();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(out, `${device.name}-faixa.png`), scale: 'css' });
    await opener.click();
    const dialog = page.getByRole('dialog', { name: 'Filme do projeto Lume Psicologia' });
    const movie = dialog.locator('video');
    await movie.evaluate(async el => { el.muted = true; await el.play(); });
    await page.waitForTimeout(900);
    await movie.evaluate(el => { el.pause(); el.currentTime = 1; });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(out, `${device.name}-filme.png`), scale: 'css' });
    const state = await movie.evaluate(el => ({ source: el.currentSrc, duration: el.duration, width: el.videoWidth, height: el.videoHeight, error: el.error?.message || null }));
    await page.keyboard.press('Escape');
    if (!device.mobile) {
      // Resume the actual marquee after the keyboard/dialog check, so the review also shows the moving strip.
      await opener.evaluate(el => el.blur());
      await recordLocalPage(page, path.join(out, 'faixa-ida-volta.mp4'), async () => {
        await page.waitForTimeout(1100);
        await move(bounds.start, 2300);
        await page.waitForTimeout(900);
        await move(bounds.end, 3600);
        await page.waitForTimeout(5000);
      }, device.viewport);
    }
    report.push({ ...device, movie: state, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), errors });
    await context.close();
  }
} finally { await browser.close(); }
await writeFile(path.join(out, 'review.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
