// Representative unit only: hero, ruler, gaps and stamp, forward and reverse. Nothing is published.
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { recordLocalPage } from './lib/record-local-page.mjs';

const base = process.env.PROJECT_PREVIEW_URL || 'http://127.0.0.1:3160';
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw new Error('Local preview required');
const out = process.env.ARRIMO_REVIEW_DIR || path.join(os.tmpdir(), 'arrimo-piloto');
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined });
const reports = [];
try {
  for (const device of [
    { name: 'pc', viewport: { width: 1536, height: 696 }, scale: 1.25, mobile: false },
    { name: 'celular', viewport: { width: 390, height: 844 }, scale: 1, mobile: true },
  ]) {
    const page = await browser.newPage({ viewport: device.viewport, deviceScaleFactor: device.scale, isMobile: device.mobile, hasTouch: device.mobile });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/modelos/previdenciario`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-model="arrimo"][data-brand-animated="true"]');
    await page.evaluate(() => document.fonts.ready);
    const bounds = await page.locator('[data-arrimo-scene]').evaluate(el => ({ start: el.getBoundingClientRect().top + scrollY, distance: el.offsetHeight - innerHeight }));
    const position = p => bounds.start + bounds.distance * p;
    const glide = (to, ms) => page.evaluate(({ to, ms }) => new Promise(resolve => {
      const from = scrollY, start = performance.now();
      function tick(now) {
        const t = Math.min(1, (now - start) / ms);
        scrollTo({ top: from + (to - from) * t, behavior: 'instant' });
        if (t < 1) requestAnimationFrame(tick); else resolve();
      }
      requestAnimationFrame(tick);
    }), { to, ms });
    // Warm the signature image before recording; the real animation is restored on the way back.
    await page.evaluate(y => scrollTo(0, y), position(1));
    await page.waitForTimeout(800);
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(out, `${device.name}-hero.png`), scale: 'css' });
    await recordLocalPage(page, path.join(out, `${device.name}-ida-volta.mp4`), async () => {
      await page.waitForTimeout(1600);
      await glide(position(0), 1500);
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(out, `${device.name}-inicio.png`), scale: 'css' });
      await glide(position(.36), device.mobile ? 3600 : 3000);
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(out, `${device.name}-lacunas.png`), scale: 'css' });
      await glide(position(.74), 3000);
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(out, `${device.name}-riscado.png`), scale: 'css' });
      await glide(position(.82), 700);
      await page.waitForTimeout(350);
      await glide(position(1), 1800);
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(out, `${device.name}-analise.png`), scale: 'css' });
      await glide(position(0), 5200);
      await page.waitForTimeout(1000);
      await glide(0, 1600);
      await page.waitForTimeout(1200);
    }, device.viewport);
    reports.push({ ...device, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), errors });
    await page.close();
  }
} finally { await browser.close(); }
await writeFile(path.join(out, 'review.json'), JSON.stringify(reports, null, 2));
console.log(JSON.stringify(reports));
