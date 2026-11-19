// Review the complete Arrimo page at the client's desktop and phone sizes, including local inquiry.
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { recordLocalPage } from './lib/record-local-page.mjs';
const base = process.env.PROJECT_PREVIEW_URL || 'http://127.0.0.1:3162';
if (!['localhost','127.0.0.1'].includes(new URL(base).hostname)) throw new Error('Local preview required');
const out = process.env.ARRIMO_REVIEW_DIR || '/tmp/arrimo-pagina';
await mkdir(out,{recursive:true});
const browser = await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined});
const reports=[];
try {
 for(const device of [{name:'pc',width:1536,height:696,scale:1.25},{name:'celular',width:390,height:844,scale:1}]) {
  const page=await browser.newPage({viewport:{width:device.width,height:device.height},deviceScaleFactor:device.scale,isMobile:device.width<760,hasTouch:device.width<760});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`${base}/modelos/previdenciario`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  // Decode lazy photographs before the recording, without changing their loading policy on the site.
  await page.evaluate(async()=>{await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});
  await page.waitForTimeout(1200);
  const glide=async(to,ms)=>page.evaluate(({to,ms})=>new Promise(resolve=>{const from=scrollY,start=performance.now();function tick(now){const t=Math.min(1,(now-start)/ms);scrollTo({top:from+(to-from)*t,behavior:'instant'});if(t<1)requestAnimationFrame(tick);else resolve();}requestAnimationFrame(tick);}),{to,ms});
  const stop=async(id)=>{const y=await page.locator(id).evaluate(el=>el.getBoundingClientRect().top+scrollY-74);await glide(y,1300);await page.waitForTimeout(900);await page.screenshot({path:path.join(out,`${device.name}-${id.slice(8)}.png`),scale:'css'});};
  await page.screenshot({path:path.join(out,`${device.name}-hero.png`),scale:'css'});
  await recordLocalPage(page,path.join(out,`${device.name}-pagina-inteira.mp4`),async()=>{
   await page.waitForTimeout(1500);
   await stop('#arrimo-situacoes');
   if(device.width<760) await glide(await page.locator('#arrimo-situacoes').evaluate(el=>el.getBoundingClientRect().bottom+scrollY-innerHeight),2600);
   const scene=await page.locator('[data-arrimo-scene]').evaluate(el=>({top:el.getBoundingClientRect().top+scrollY,height:el.offsetHeight-innerHeight}));
   await glide(scene.top,1300);await glide(scene.top+scene.height,6500);await page.waitForTimeout(900);
   for(const id of ['#arrimo-areas','#arrimo-documentos','#arrimo-escritorio','#arrimo-duvidas']) {
    await stop(id);
    const end=await page.locator(id).evaluate(el=>el.getBoundingClientRect().bottom+scrollY-innerHeight+30);
    if(end>await page.evaluate(()=>scrollY)) await glide(end,device.width<760?4000:2200);
   }
   await page.locator('#arrimo-duvidas summary').first().click();await page.waitForTimeout(1000);
   await stop('#arrimo-interesse');
   await page.getByRole('button',{name:'Preparar minha conversa',exact:true}).click();await page.waitForTimeout(900);
   await page.getByRole('radio',{name:'Benefício negado',exact:true}).check();await page.getByRole('button',{name:'Continuar',exact:true}).click();await page.waitForTimeout(900);
   await page.getByRole('radio',{name:'Recebi uma negativa',exact:true}).check();await page.getByRole('radio',{name:'Para mim',exact:true}).check();await page.getByRole('button',{name:'Ver meu resumo',exact:true}).click();await page.waitForTimeout(1900);
   await page.screenshot({path:path.join(out,`${device.name}-resumo.png`),scale:'css'});
   await page.getByRole('button',{name:'Voltar ao site',exact:true}).click();
   await glide(await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight),1300);await page.waitForTimeout(1200);
  },{width:device.width,height:device.height});
  reports.push({...device,errors,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});await page.close();
 }
}finally{await browser.close();}
await writeFile(path.join(out,'review.json'),JSON.stringify(reports,null,2));console.log(reports);
