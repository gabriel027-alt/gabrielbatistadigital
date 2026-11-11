import { chromium } from '@playwright/test';
import { recordLocalPage } from './lib/record-local-page.mjs';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const base = process.env.PROJECT_PREVIEW_URL || 'http://127.0.0.1:3115';
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw new Error('Local preview required');
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || '/usr/bin/chromium' });
try {
  for (const brand of ['aura', 'orla']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(`${base}/propostas/${brand}`);
    await page.waitForLoadState('networkidle');
    // The motion pause control stays on the site; it is only hidden in the recorded film.
    await page.addStyleTag({ content: 'nextjs-portal{display:none!important}button[aria-pressed]{display:none!important}' });
    await page.locator(`[data-inquiry="${brand}"]`).getByRole('button').waitFor({ state: 'visible', timeout: 20000 });
    await page.waitForTimeout(1000);
    const destination = `public/videos/projects/${brand}-showcase.mp4`;
    const chapters = [];
    let began;
    function chapter(label) { chapters.push({ label, seconds: (performance.now() - began) / 1000 }); }
    async function travel(top, duration) {
      await page.evaluate(({ top, duration }) => new Promise(resolve => {
        const from = scrollY, start = performance.now();
        function tick(now) {
          const p = Math.min(1, (now - start) / duration);
          scrollTo({ top: from + (top - from) * p, behavior: 'instant' });
          if (p < 1) requestAnimationFrame(tick); else resolve();
        }
        requestAnimationFrame(tick);
      }), { top, duration });
    }
    async function geometry(selector) {
      return page.locator(selector).evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, travel: el.offsetHeight - innerHeight }));
    }
    await recordLocalPage(page, destination, async () => {
      began = performance.now();
      chapter('Abertura');
      await page.waitForTimeout(1600);
      chapter('Experiência pelo scroll');
      if (brand === 'aura') {
        const scene = await geometry('[data-photo-track]');
        await travel(scene.top + scene.travel, 13000);
        await page.waitForTimeout(500);
        chapter('Antes e depois');
        const comparison = await geometry('[data-aura-comparator]');
        await travel(comparison.top, 900);
        await travel(comparison.top + comparison.travel, 4500);
        await page.waitForTimeout(650);
      } else {
        const gallery = await geometry('[data-orla-journey]');
        await travel(gallery.top, 2300);
        await travel(gallery.top + gallery.travel, 5000);
        await page.waitForTimeout(700);
      }
      const interest = await geometry(`[data-inquiry="${brand}"]`);
      await travel(Math.max(0, interest.top - 160), 1500);
      chapter('CTA e escolhas');
      await page.waitForTimeout(1300);
      await page.locator(`[data-inquiry="${brand}"]`).getByRole('button').click();
      const dialog = page.getByRole('dialog');
      for (let step = 0; step < (brand === 'aura' ? 2 : 3); step++) {
        await page.waitForTimeout(950);
        for (const fieldset of await dialog.locator('fieldset').all()) await fieldset.getByRole('radio').first().check();
        await page.waitForTimeout(500);
        await dialog.getByRole('button', { name: step === (brand === 'aura' ? 1 : 2) ? 'Ver meu resumo' : 'Continuar', exact: true }).click();
      }
      chapter('Resumo revisável');
      await page.waitForTimeout(2300);
      await dialog.getByRole('button', { name: 'Voltar ao site', exact: true }).click();
      chapter('Encerramento da marca');
      await travel(await page.locator('footer').last().evaluate(el => el.getBoundingClientRect().top + scrollY), 1100);
      await page.waitForTimeout(1100);
    }, { width: 1280, height: 800 });
    const metadata = JSON.parse(execFileSync(process.env.FFPROBE || 'ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=width,height', '-of', 'json', destination], { encoding: 'utf8' }));
    const bytes = await readFile(destination);
    const manifest = { title: `${brand === 'aura' ? 'Aura' : 'Orla'} — filme do projeto`, source: `/propostas/${brand}`, durationSeconds: Number(metadata.format.duration), width: 1280, height: 800, codec: 'H.264 Baseline', audio: false, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), captureViewport: '1280x800', patientResults: false, localInteractionsOnly: true, chapters, ending: 'Brand-local CTA journey and summary, followed by brand closing. Agency contact stays outside the film.' };
    await writeFile(destination.replace('.mp4', '.json'), JSON.stringify(manifest, null, 2) + '\n');
    const stamp = s => { const ms = Math.round(s * 1000); return `${String(Math.floor(ms / 60000)).padStart(2, '0')}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}.${String(ms % 1000).padStart(3, '0')}`; };
    const cues = chapters.map((c, i) => `${stamp(c.seconds)} --> ${stamp(Math.min(i + 1 < chapters.length ? chapters[i + 1].seconds : manifest.durationSeconds, manifest.durationSeconds))}\n${c.label}`);
    await writeFile(destination.replace('.mp4', '.pt.vtt'), 'WEBVTT\n\n' + cues.join('\n\n') + '\n');
    console.log(`${brand}: ${manifest.durationSeconds}s, ${manifest.bytes} bytes`);
    if (brand === 'orla') {
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await page.locator(`[data-inquiry="${brand}"]`).getByRole('button').waitFor({ state: 'visible', timeout: 20000 });
    await page.waitForTimeout(1000);
      await page.screenshot({ path: 'public/images/projects/orla-film-poster.jpg', type: 'jpeg', quality: 88 });
    }
    await page.close();
  }
} finally { await browser.close(); }
