// Records a full walkthrough film of each approved brand page, top to bottom, for the portfolio selection.
// Usage: node scripts/capture-brand-films.mjs [brand ...] (needs a local server, default http://127.0.0.1:3109).
// Desktop films are 1920x1080 and phone films 1080x1920, H.264 High at CRF 18, no audio.
import { chromium } from '@playwright/test';
import { mkdir, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

const base = process.env.PROJECT_PREVIEW_URL || 'http://127.0.0.1:3109';
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw new Error('Local preview required');
const brands = { talhao: '/modelos/agro', paddock: "/modelos/automoveis", arrimo: '/modelos/previdenciario', lume: '/modelos/psicologia', forma: '/modelos/odontologia', sutil: '/modelos/cirurgia-plastica', toca: '/modelos/veterinaria', brisa: '/modelos/hotelaria', almeida: '/modelos/patrimonio', cerne: '/modelos/implantes', nitida: '/modelos/oftalmologia', fio: '/modelos/capilar', elo: '/modelos/fertilidade', eixo: '/modelos/ortopedia', vao: '/modelos/arquitetura', lavra: '/modelos/joalheria', ponte: '/modelos/escola' };
const formats = {
  desktop: { viewport: { width: 1920, height: 1080 }, scale: 1, mobile: false, out: [1920, 1080], speed: 520 },
  mobile: { viewport: { width: 432, height: 768 }, scale: 2.5, mobile: true, out: [1080, 1920], speed: 380 },
  // Reframe the same signature scene at the card's aspect ratio, avoiding stretched faces or clipped copy.
  loop: { viewport: { width: 960, height: 768 }, scale: 1, mobile: false, out: [960, 768] },
};
const only = process.argv.slice(2).filter(arg => brands[arg]);
const formatArg = process.argv.find(arg => arg.startsWith('--format='))?.split('=')[1];

async function record(page, destination, [width, height], action) {
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', frame => {
    frames.push({ data: Buffer.from(frame.data, 'base64'), time: frame.metadata.timestamp });
    void cdp.send('Page.screencastFrameAck', { sessionId: frame.sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 95, maxWidth: width, maxHeight: height, everyNthFrame: 1 });
  try { await action(); } finally { await cdp.send('Page.stopScreencast'); await cdp.detach(); }
  if (frames.length < 30) throw new Error('Insufficient rendered frames');
  const temp = await mkdtemp(path.join(os.tmpdir(), 'brand-film-'));
  const list = [];
  for (let i = 0; i < frames.length; i++) {
    const file = `frame-${String(i).padStart(5, '0')}.jpg`;
    await writeFile(path.join(temp, file), frames[i].data);
    list.push(`file '${file}'`, `duration ${i + 1 < frames.length ? Math.max(.001, frames[i + 1].time - frames[i].time) : 1}`);
  }
  list.push(`file 'frame-${String(frames.length - 1).padStart(5, '0')}.jpg'`);
  await writeFile(path.join(temp, 'frames.txt'), list.join('\n') + '\n');
  await mkdir(path.dirname(destination), { recursive: true });
  const result = spawnSync(process.env.FFMPEG_PATH || 'ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(temp, 'frames.txt'), '-an',
    '-vf', `fps=30,scale=${width}:${height}:flags=lanczos:in_range=full:out_range=tv,format=yuv420p`,
    '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '18', '-color_range', 'tv', '-movflags', '+faststart',
    ...(destination.endsWith('-loop.mp4') ? ['-t', '6'] : []), destination], { encoding: 'utf8' });
  await rm(temp, { recursive: true, force: true });
  if (result.status !== 0) throw new Error(result.stderr);
  const seconds = (frames.at(-1).time - frames[0].time);
  return { frames: frames.length, seconds, fps: frames.length / seconds };
}

const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined });
try {
  for (const [brand, route] of Object.entries(brands)) {
    if (only.length && !only.includes(brand)) continue;
    for (const [name, format] of Object.entries(formats)) {
      if (name === 'loop' && !['lume', 'arrimo', 'paddock', 'talhao', 'cerne', 'nitida', 'fio', 'elo', 'eixo', 'vao', 'lavra', 'ponte', 'sutil'].includes(brand)) continue;
      if (formatArg && formatArg !== name) continue;
      const page = await browser.newPage({ viewport: format.viewport, deviceScaleFactor: format.scale, isMobile: format.mobile, hasTouch: format.mobile });
      await page.goto(base + route, { waitUntil: 'networkidle' });
      // The motion control stays on the site; only the film hides it, with the dev overlay.
      await page.addStyleTag({ content: brand === 'paddock' ? 'nextjs-portal{display:none!important}button[aria-label="Pausar o tour"],button[aria-label="Ativar o tour"]{display:none!important}' : 'nextjs-portal{display:none!important}' }); // The brands' pause button is gone since 21/11/2026; hiding every button[aria-pressed] also hid Elo's path and Fio's map.
      // Warm every image so nothing pops in during the film, then return to the top.
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < total; y += 600) { await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(40); }
      if(brand === 'paddock') {
        const scene=await page.locator('[data-paddock-tour]').evaluate(el=>({top:el.getBoundingClientRect().top+scrollY,travel:el.offsetHeight-innerHeight}));
        // Capture-only warm pass: normal visitors still fetch only nearby frames/photos.
        for(let p=0;p<=1.001;p+=.025){await page.evaluate(({scene,p})=>scrollTo(0,scene.top+scene.travel*p),{scene,p});await page.waitForTimeout(220);}
        await page.locator('#paddock-estoque').scrollIntoViewIfNeeded();
        for(const card of await page.locator('[data-paddock-cars]>li').all()){await card.scrollIntoViewIfNeeded();await page.waitForTimeout(150);}
        await page.locator('[data-paddock-cars] img:not(noscript img)').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode().catch(()=>{}))));
        // The warm-up scrolled the phone's swipe row to its last car; the film starts it from the first.
        await page.locator('[data-paddock-cars]').evaluate(row=>row.scrollTo({left:0,behavior:'instant'}));
      }
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(2500);
      if (brand === 'paddock' && name === 'loop') {
        await mkdir('public/images/projects/brands',{recursive:true});
        // Card-only framing: keep the full-width car at 16:9 inside the 5:4 preview.
        // The approved website tour and its portrait composition stay untouched.
        await page.addStyleTag({content:'[data-tour-canvas]{top:82px!important;height:540px!important;bottom:auto!important}[data-tour-stage]>svg{top:82px!important;height:540px!important}[data-inspection-mark][data-proof-index="2"]{top:52%!important}[data-inspection-mark][data-proof-index="3"]{top:50%!important}'});
        await page.waitForTimeout(200);
        const bounds=await page.locator('[data-paddock-tour]').evaluate(el=>({top:el.getBoundingClientRect().top+scrollY,distance:el.offsetHeight-innerHeight}));
        // The card's still is the whole car with the report open (23/11/2026). It used to be the top of the page, taken
        // after the warm pass, when the first frames had already been let go: a black screen with the lines and no car.
        await page.evaluate(({top,distance})=>scrollTo(0,top+distance),bounds);await page.waitForTimeout(2500);
        const poster=spawnSync(process.env.FFMPEG_PATH||'ffmpeg',['-v','error','-y','-i','pipe:0','-frames:v','1','-c:v','libwebp','-quality','90','public/images/projects/brands/paddock-hero.webp'],{input:await page.screenshot(),encoding:'utf8'});
        if(poster.status!==0)throw new Error(poster.stderr);
        await page.evaluate(({top,distance})=>scrollTo(0,top+distance*.5),bounds);await page.waitForTimeout(700);
        const stats=await record(page,'public/videos/projects/brands/paddock-loop.mp4',format.out,async()=>{
          await page.evaluate(async ({top,distance})=>{
            const start=performance.now();await new Promise(resolve=>{
              function tick(now){const t=Math.min(6,(now-start)/1000);const p=t<.3?.5:t<2.5?.5+.5*(t-.3)/2.2:t<3.3?1:t<5.6?1-.5*(t-3.3)/2.3:.5;scrollTo({top:top+distance*p,behavior:'instant'});if(t<6)requestAnimationFrame(tick);else resolve();}requestAnimationFrame(tick);
            });
          },bounds);
        });console.log(`${brand} loop: ${stats.frames} frames -> 6 s`);await page.close();continue;
      }
      if (brand === 'talhao' && name === 'loop') {
        await mkdir('public/images/projects/brands', { recursive: true });
        // Card-only: at 960 px the header links wrap onto two lines; the brand and its call stay.
        await page.addStyleTag({ content: 'header nav{display:none!important}' }); await page.waitForTimeout(200);
        const poster = spawnSync(process.env.FFMPEG_PATH || 'ffmpeg', ['-v', 'error', '-y', '-i', 'pipe:0', '-frames:v', '1', '-c:v', 'libwebp', '-quality', '90', 'public/images/projects/brands/talhao-hero.webp'], { input: await page.screenshot(), encoding: 'utf8' });
        if (poster.status !== 0) throw new Error(poster.stderr);
        const bounds = await page.locator('[data-talhao-hero]').evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, distance: el.offsetHeight - innerHeight }));
        const stats = await record(page, 'public/videos/projects/brands/talhao-loop.mp4', format.out, async () => {
          await page.evaluate(async ({top,distance}) => {
            const start=performance.now();
            await new Promise(resolve => {
              function tick(now) {
                const t=Math.min(6,(now-start)/1000);
                // The farm from above: the first plots light up one by one, then the scroll returns to the whole map.
                const p=t<.3?0:t<3.2?.52*(t-.3)/2.9:t<3.7?.52:t<5.7?.52-.52*(t-3.7)/2:0;
                scrollTo({top:top+distance*p,behavior:'instant'});
                if(t<6)requestAnimationFrame(tick);else resolve();
              }
              requestAnimationFrame(tick);
            });
          },bounds);
        });
        console.log(`${brand} loop: ${stats.frames} frames -> 6 s`);
        await page.close();continue;
      }      if (brand === 'arrimo' && name === 'loop') {
        await mkdir('public/images/projects/brands', { recursive: true });
        const poster = spawnSync(process.env.FFMPEG_PATH || 'ffmpeg', ['-v', 'error', '-y', '-i', 'pipe:0', '-frames:v', '1', '-c:v', 'libwebp', '-quality', '90', 'public/images/projects/brands/arrimo-hero.webp'], { input: await page.screenshot(), encoding: 'utf8' });
        if (poster.status !== 0) throw new Error(poster.stderr);
        const bounds = await page.locator('[data-arrimo-scene]').evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, distance: el.offsetHeight - innerHeight }));
        await page.evaluate(({top,distance}) => scrollTo({top:top+distance*.66,behavior:'instant'}), bounds);
        await page.waitForTimeout(1000);
        const stats = await record(page, 'public/videos/projects/brands/arrimo-loop.mp4', format.out, async () => {
          await page.evaluate(async ({top,distance}) => {
            const start=performance.now();
            await new Promise(resolve => {
              function tick(now) {
                const t=Math.min(6,(now-start)/1000);
                // The approved scene, reframed for the card: NEGADO → EM ANÁLISE → NEGADO.
                const p=t<.2? .66 : t<2.5? .66+.34*(t-.2)/2.3 : t<3.1?1:t<5.25?1-.34*(t-3.1)/2.15:.66;
                scrollTo({top:top+distance*p,behavior:'instant'});
                if(t<6)requestAnimationFrame(tick);else resolve();
              }
              requestAnimationFrame(tick);
            });
          },bounds);
        });
        console.log(`${brand} loop: ${stats.frames} frames -> 6 s`);
        await page.close();continue;
      }
      if (brand === 'elo' && name === 'loop') {
        // Static brand (23/11/2026): the card shows the top; the preview walks the path, one stop at a time, and back.
        await mkdir('public/images/projects/brands', { recursive: true });
        await page.waitForTimeout(1200);
        const poster = spawnSync(process.env.FFMPEG_PATH || 'ffmpeg', ['-v', 'error', '-y', '-i', 'pipe:0', '-frames:v', '1', '-c:v', 'libwebp', '-quality', '90', 'public/images/projects/brands/elo-hero.webp'], { input: await page.screenshot(), encoding: 'utf8' });
        if (poster.status !== 0) throw new Error(poster.stderr);
        await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' }); await page.waitForTimeout(600);
        await page.locator('[data-elo-path]').evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY - 110, behavior: 'instant' }));
        await page.waitForTimeout(800);
        // A still page gives the screencast almost no frames (and stale ones), so the preview is one screenshot per stop,
        // joined by short dissolves: 1 → 2 → 3 → 4 → 5 → 1, exactly 6 s.
        const temp = await mkdtemp(path.join(os.tmpdir(), 'elo-loop-'));
        const order = [0, 1, 2, 3, 4, 0];
        for (const [i, index] of order.entries()) {
          await page.locator('[data-elo-path] button').nth(index).click();
          await page.waitForTimeout(500);
          await writeFile(path.join(temp, `stop-${i}.png`), await page.screenshot());
        }
        const hold = 1.2, fade = .25, inputs = order.flatMap((_, i) => ['-loop', '1', '-t', String(hold), '-i', path.join(temp, `stop-${i}.png`)]);
        let chain = '', last = '[0:v]';
        for (let i = 1; i < order.length; i++) { const out = i === order.length - 1 ? '[v]' : `[x${i}]`; chain += `${last}[${i}:v]xfade=transition=fade:duration=${fade}:offset=${(i * (hold - fade)).toFixed(2)}${out};`; last = out; }
        const result = spawnSync(process.env.FFMPEG_PATH || 'ffmpeg', ['-v', 'error', '-y', ...inputs, '-filter_complex', `${chain}[v]tpad=stop_mode=clone:stop_duration=1,fps=30,format=yuv420p[o]`, '-map', '[o]', '-an', '-t', '6',
          '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '18', '-movflags', '+faststart', 'public/videos/projects/brands/elo-loop.mp4'], { encoding: 'utf8' });
        await rm(temp, { recursive: true, force: true });
        if (result.status !== 0) throw new Error(result.stderr);
        console.log(`${brand} loop: ${order.length} stops -> 6 s`);
        await page.close(); continue;
      }
      if (['eixo', 'vao', 'lavra', 'ponte', 'sutil'].includes(brand) && name === 'loop') {
        // Static brand (24/11/2026): the card shows the top; the preview holds the top, climbs the treatment staircase,
        // shows the lit axis of knee, hip and spine, and comes back to the top. Screenshots joined by dissolves, 6 s.
        await mkdir('public/images/projects/brands', { recursive: true });
        await page.waitForTimeout(1200);
        const poster = spawnSync(process.env.FFMPEG_PATH || 'ffmpeg', ['-v', 'error', '-y', '-i', 'pipe:0', '-frames:v', '1', '-c:v', 'libwebp', '-quality', '90', `public/images/projects/brands/${brand}-hero.webp`], { input: await page.screenshot(), encoding: 'utf8' });
        if (poster.status !== 0) throw new Error(poster.stderr);
        await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' + (brand === 'sutil' ? '[data-brand-scroll-guide]{display:none!important}' : '') }); await page.waitForTimeout(600); // The card preview has no scroll to guide; on Sutil the guide covered the phase texts.
        const temp = await mkdtemp(path.join(os.tmpdir(), `-loop-`));
        // Vão (24/11/2026): the top, the routine plan, the materials board and back.
        // Lavra (24/11/2026): the top, drawing to piece, the couple's hands and back.
        // Sutil (28/11/2026, "Gesso"): the plaster face, the five recovery phases drawn on their line, the surgeon and back.
        const shots = { eixo: [null, '#escada ol', '#areas ul', null], vao: [null, '#rotina svg', '#materiais ul', null], lavra: [null, '#processo ol', '[aria-labelledby="prova-titulo"]', null], ponte: [null, '#o-dia ol', '#idades ul', null], sutil: [null, '#recuperacao', '#cirurgia', null] }[brand];
        for (const [i, selector] of shots.entries()) {
          if (selector) await page.locator(selector).evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY - 100, behavior: 'instant' }));
          else await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
          await page.waitForTimeout(brand === 'sutil' ? 2600 : 900); // Sutil's phase line draws itself in about 2 s.
          await writeFile(path.join(temp, `shot-${i}.png`), await page.screenshot());
        }
        const hold = 1.7, fade = .3, inputs = shots.flatMap((_, i) => ['-loop', '1', '-t', String(hold), '-i', path.join(temp, `shot-${i}.png`)]);
        let chain = '', last = '[0:v]';
        for (let i = 1; i < shots.length; i++) { const out = i === shots.length - 1 ? '[v]' : `[x${i}]`; chain += `${last}[${i}:v]xfade=transition=fade:duration=${fade}:offset=${(i * (hold - fade)).toFixed(2)}${out};`; last = out; }
        const result = spawnSync(process.env.FFMPEG_PATH || 'ffmpeg', ['-v', 'error', '-y', ...inputs, '-filter_complex', `${chain}[v]tpad=stop_mode=clone:stop_duration=1,fps=30,format=yuv420p[o]`, '-map', '[o]', '-an', '-t', '6',
          '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '18', '-movflags', '+faststart', `public/videos/projects/brands/${brand}-loop.mp4`], { encoding: 'utf8' });
        await rm(temp, { recursive: true, force: true });
        if (result.status !== 0) throw new Error(result.stderr);
        console.log(`${brand} loop: ${shots.length} shots -> 6 s`);
        await page.close(); continue;
      }
      if (brand === 'fio' && name === 'loop') {
        // Static brand (23/11/2026): the card shows the top; the preview lights the zones of the head map one by one.
        await mkdir('public/images/projects/brands', { recursive: true });
        await page.waitForTimeout(1200);
        const poster = spawnSync(process.env.FFMPEG_PATH || 'ffmpeg', ['-v', 'error', '-y', '-i', 'pipe:0', '-frames:v', '1', '-c:v', 'libwebp', '-quality', '90', 'public/images/projects/brands/fio-hero.webp'], { input: await page.screenshot(), encoding: 'utf8' });
        if (poster.status !== 0) throw new Error(poster.stderr);
        await page.locator('#mapa').evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY + 60, behavior: 'instant' }));
        await page.waitForTimeout(800);
        const stats = await record(page, 'public/videos/projects/brands/fio-loop.mp4', format.out, async () => {
          await page.evaluate(async () => {
            const buttons = [...document.querySelectorAll('[data-head-map] button')];
            for (const [index, at] of [[1, 900], [2, 2100], [3, 3300], [0, 4700]]) setTimeout(() => buttons[index].click(), at);
            await new Promise(resolve => setTimeout(resolve, 6000));
          });
        });
        console.log(`${brand} loop: ${stats.frames} frames -> 6 s`);
        await page.close(); continue;
      }
      if (brand === 'nitida' && name === 'loop') {
        // Static brand (23/11/2026): the card shows the top; the preview is the iris coming into focus at a touch.
        await mkdir('public/images/projects/brands', { recursive: true });
        await page.waitForTimeout(1500);
        const poster = spawnSync(process.env.FFMPEG_PATH || 'ffmpeg', ['-v', 'error', '-y', '-i', 'pipe:0', '-frames:v', '1', '-c:v', 'libwebp', '-quality', '90', 'public/images/projects/brands/nitida-hero.webp'], { input: await page.screenshot(), encoding: 'utf8' });
        if (poster.status !== 0) throw new Error(poster.stderr);
        await page.locator('#antes').evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY + 20, behavior: 'instant' }));
        await page.waitForTimeout(1000);
        const stats = await record(page, 'public/videos/projects/brands/nitida-loop.mp4', format.out, async () => {
          await page.waitForTimeout(1400);
          await page.locator('#antes figure button').click();
          await page.waitForTimeout(4600);
        });
        console.log(`${brand} loop: ${stats.frames} frames -> 6 s`);
        await page.close(); continue;
      }
      if (brand === 'cerne' && name === 'loop') {
        // Static brand (23/11/2026): the card shows the top; the preview lights the signs one by one, then back to the first.
        await mkdir('public/images/projects/brands', { recursive: true });
        const poster = spawnSync(process.env.FFMPEG_PATH || 'ffmpeg', ['-v', 'error', '-y', '-i', 'pipe:0', '-frames:v', '1', '-c:v', 'libwebp', '-quality', '90', 'public/images/projects/brands/cerne-hero.webp'], { input: await page.screenshot(), encoding: 'utf8' });
        if (poster.status !== 0) throw new Error(poster.stderr);
        await page.locator('#sinais').evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY + 40, behavior: 'instant' }));
        await page.waitForTimeout(800);
        const stats = await record(page, 'public/videos/projects/brands/cerne-loop.mp4', format.out, async () => {
          await page.evaluate(async () => {
            const lines = [...document.querySelectorAll('[data-cerne-signs] button')];
            for (const [index, at] of [[1, 600], [2, 1800], [3, 3000], [4, 4200], [0, 5400]]) setTimeout(() => lines[index].click(), at);
            await new Promise(resolve => setTimeout(resolve, 6000));
          });
        });
        console.log(`${brand} loop: ${stats.frames} frames -> 6 s`);
        await page.close(); continue;
      }
      if (brand === 'lume' && name === 'loop') {
        await mkdir('public/images/projects/brands', { recursive: true });
        // The cover is the morning (24/11/2026): at night the falling notes sit over the title, unreadable at card size.
        await page.evaluate(() => { const hero = document.querySelector('[data-lume-hero]'); scrollTo({ top: Math.max(0, hero.getBoundingClientRect().top + scrollY + hero.offsetHeight - innerHeight), behavior: 'instant' }); });
        await page.waitForTimeout(1500);
        const poster = spawnSync(process.env.FFMPEG_PATH || 'ffmpeg', ['-v', 'error', '-y', '-i', 'pipe:0', '-frames:v', '1', '-c:v', 'libwebp', '-quality', '90', 'public/images/projects/brands/lume-hero.webp'], { input: await page.screenshot(), encoding: 'utf8' });
        if (poster.status !== 0) throw new Error(poster.stderr);
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await page.waitForTimeout(1500);
        const stats = await record(page, 'public/videos/projects/brands/lume-loop.mp4', format.out, async () => {
          await page.evaluate(async () => {
            const hero = document.querySelector('[data-lume-hero]');
            const end = hero.getBoundingClientRect().top + scrollY + hero.offsetHeight - innerHeight;
            const start = performance.now();
            await new Promise(resolve => {
              function tick(now) {
                const elapsed = Math.min(6, (now - start) / 1000);
                // Night → morning → night: the original scroll timeline, reversible, with a continuous loop seam.
                const progress = elapsed < .25 ? 0 : elapsed < 2.5 ? (elapsed - .25) / 2.25 : elapsed < 3 ? 1 : elapsed < 5.25 ? 1 - (elapsed - 3) / 2.25 : 0;
                scrollTo({ top: Math.max(0, end) * progress, behavior: 'instant' });
                if (elapsed < 6) requestAnimationFrame(tick); else resolve();
              }
              requestAnimationFrame(tick);
            });
          });
        });
        console.log(`${brand} loop: ${stats.frames} frames -> 6 s, public/videos/projects/brands/lume-loop.mp4`);
        await page.close();
        continue;
      }
      const destination = `public/videos/projects/brands/${brand}-${name}.mp4`;
      const stats = await record(page, destination, format.out, async () => {
        await page.waitForTimeout(2600);
        // Choreography: glide to each section, rest there so it can be read, and cross long scroll scenes slowly.
        await page.evaluate(async ({ speed, brand }) => {
          const end = document.documentElement.scrollHeight - innerHeight;
          const glide = (to, ms, linear = false) => new Promise(resolve => {
            const from = scrollY, start = performance.now();
            const ease = t => linear ? t : t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
            function tick(now) {
              const t = Math.min(1, (now - start) / ms);
              scrollTo({ top: from + (to - from) * ease(t), behavior: 'instant' });
              if (t < 1) requestAnimationFrame(tick); else resolve();
            }
            requestAnimationFrame(tick);
          });
          const rest = ms => new Promise(resolve => setTimeout(resolve, ms));
          const header = document.querySelector('header')?.getBoundingClientRect().height || 0;
          const sections = [...document.querySelectorAll('main section, main > div > section, footer')]
            .filter(el => !el.parentElement.closest('section'))
            .map(el => ({ top: el.getBoundingClientRect().top + scrollY, height: el.offsetHeight, id:el.id, signature: el.hasAttribute('data-lume-hero') || el.hasAttribute('data-paddock-tour') || el.hasAttribute('data-talhao-hero') }))
            .filter(s => (s.top > 40 || s.signature) && s.height > 120)
            .sort((a, b) => a.top - b.top);
          for (const s of sections) {
            const top = Math.min(end, Math.max(scrollY, s.top - header * (s.height > innerHeight * 1.5 ? 0 : 1)));
            // Hurry to just before the section, then enter slowly: entrance animations play while it comes in.
            const approach = Math.min(top, Math.max(scrollY, top - innerHeight * .55));
            if (approach > scrollY + 4) await glide(approach, Math.max(700, (approach - scrollY) / (speed * 1.4) * 1000));
            if (top > scrollY + 4) await glide(top, Math.max(1100, (top - scrollY) / (speed * .6) * 1000));
            const scene = s.height > innerHeight * 1.5;
            await rest(scene ? 900 : 2000);
            const through = Math.min(end, s.top + s.height - innerHeight);
            if (through > scrollY + 40) { await glide(through, (brand === "paddock" ? Math.min(18000,(through - scrollY) / (scene ? speed * .42 : speed) * 1000) : (through - scrollY) / (scene ? speed * .42 : speed) * 1000), scene); await rest(scene ? 1200 : 700); }
            if(s.id === 'paddock-estoque') {
              // Phones (24/11/2026): the stock is a row you swipe; the film brings it into view and swipes through a few cars.
              const row=document.querySelector('[data-paddock-cars]');
              if(row && row.scrollWidth>row.clientWidth+10){
                await glide(Math.min(end,row.getBoundingClientRect().top+scrollY-140),1100);await rest(900);
                const first=row.firstElementChild;
                for(const li of [...row.children].slice(1,4)){row.scrollTo({left:li.offsetLeft-first.offsetLeft,behavior:'smooth'});await rest(1400);}
                row.scrollTo({left:0,behavior:'smooth'});await rest(1000);
              }
              const trigger=document.getElementById('laudo-sedan-verde');trigger?.click();await rest(1700);
              const report=document.querySelector('dialog[open]');report?.scrollTo({top:report.scrollHeight,behavior:'smooth'});await rest(1000);
              report?.querySelector('a[data-inquiry-car]')?.click();await rest(800);
              const inquiry=document.querySelector('[data-inquiry="paddock"] dialog');
              const button=text=>[...inquiry.querySelectorAll('button')].find(b=>b.textContent.trim()===text);
              button('Continuar')?.click();await rest(400);
              [...inquiry.querySelectorAll('label')].find(l=>l.textContent.includes('Ver os registros do laudo'))?.click();await rest(300);
              button('Ver meu resumo')?.click();await rest(2000);button('Voltar ao site')?.click();await rest(500);
              await glide(Math.min(end,s.top+s.height-innerHeight),1000);
            }
          }
          if (end > scrollY + 4) await glide(end, Math.max(900, (end - scrollY) / speed * 1000));
        }, { speed: format.speed, brand });
        await page.waitForTimeout(2400);
      });
      console.log(`${brand} ${name}: ${stats.frames} frames, ${stats.seconds.toFixed(1)} s, ${stats.fps.toFixed(1)} fps -> ${destination}`);
      await page.close();
    }
  }
} finally { await browser.close(); }
