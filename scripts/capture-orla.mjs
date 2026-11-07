import { chromium } from '@playwright/test';
import { mkdir, writeFile, mkdtemp } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

// Start the production server separately. Only local reference pages are captured.
const base = process.env.ORLA_PREVIEW_URL || 'http://127.0.0.1:3112';
if (!['127.0.0.1', 'localhost'].includes(new URL(base).hostname)) throw new Error('Local preview URL required');
const out = path.resolve('docs/preview/orla');
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || '/usr/bin/chromium' });
try {
  for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.goto(`${base}/propostas/orla`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${out}/${name}-opening.png` });
    const geometry = await page.locator('[data-orla-journey]').evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, travel: el.offsetHeight - innerHeight }));
    for (const [label, progress] of [['gallery', 0], ['middle', .5], ['end', 1]]) {
      await page.evaluate(y => scrollTo(0, y), geometry.top + geometry.travel * progress);
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${out}/${name}-${label}.png` });
    }
    await page.locator('#orla-olhar').evaluate(el => scrollTo(0, el.getBoundingClientRect().top + scrollY));
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${out}/${name}-close.png` });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `${out}/${name}-reduced.png`, fullPage: true });
    await page.close();
  }
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${base}/propostas/orla`);
  await page.waitForLoadState('networkidle');
  const cdp = await context.newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', frame => {
    frames.push({ bytes: Buffer.from(frame.data, 'base64'), time: frame.metadata.timestamp });
    void cdp.send('Page.screencastFrameAck', { sessionId: frame.sessionId });
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 85, maxWidth: 1440, maxHeight: 900, everyNthFrame: 1 });
  await page.waitForTimeout(1200);
  async function scrollToOverTime(target, duration) {
    await page.evaluate(({ target, duration }) => new Promise(resolve => {
      const start = scrollY, began = performance.now();
      function tick(now) {
        const progress = Math.min(1, (now - began) / duration);
        scrollTo({ top: start + (target - start) * progress, behavior: 'instant' });
        if (progress < 1) requestAnimationFrame(tick); else resolve();
      }
      requestAnimationFrame(tick);
    }), { target, duration });
  }
  const geometry = await page.locator('[data-orla-journey]').evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, travel: el.offsetHeight - innerHeight }));
  await scrollToOverTime(geometry.top, 2800);
  await page.waitForTimeout(600);
  await scrollToOverTime(geometry.top + geometry.travel, 5600);
  await page.waitForTimeout(1100);
  await scrollToOverTime(geometry.top + geometry.travel * .45, 2000);
  await page.waitForTimeout(650);
  await scrollToOverTime(geometry.top + geometry.travel + 900, 3000);
  await page.waitForTimeout(1200);
  await cdp.send('Page.stopScreencast');
  await context.close();
  if (frames.length < 30) throw new Error('Insufficient captured motion frames');
  const temporary = await mkdtemp('/tmp/orla-frames-');
  const concat = [];
  for (let i = 0; i < frames.length; i++) {
    const name = `frame-${String(i).padStart(5, '0')}.jpg`;
    await writeFile(path.join(temporary, name), frames[i].bytes);
    concat.push(`file '${name}'`);
    concat.push(`duration ${i + 1 < frames.length ? Math.max(.001, frames[i + 1].time - frames[i].time) : 1}`);
  }
  concat.push(`file 'frame-${String(frames.length - 1).padStart(5, '0')}.jpg'`);
  const source = path.join(temporary, 'frames.txt');
  await writeFile(source, concat.join('\n') + '\n');
  const result = spawnSync('/usr/bin/ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', source, '-an', '-vf', 'fps=30', '-c:v', 'libx264', '-preset', 'fast', '-crf', '21', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${out}/desktop.mp4`], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr);
  console.log('Orla screenshots and MP4 saved in docs/preview/orla');
} finally {
  await browser.close();
}
