// Full local walkthrough: inspection tour, evidence, chosen-car report, inquiry and buying policy.
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { recordLocalPage } from './lib/record-local-page.mjs';
const base=process.env.PROJECT_PREVIEW_URL || 'http://127.0.0.1:3187';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw new Error('Local preview required');
const out=process.env.PADDOCK_REVIEW_DIR || '/tmp/paddock-laudo';await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined});const reports=[];
try{for(const device of [{name:'pc',width:1536,height:696,scale:1.25},{name:'celular',width:390,height:844,scale:1}]){
 const context=await browser.newContext({viewport:{width:device.width,height:device.height},deviceScaleFactor:device.scale,isMobile:device.width<700,hasTouch:device.width<700});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`${base}/modelos/automoveis`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>document.querySelector('[data-tour-stage]')?.getAttribute('data-tour-loaded')==='223');
 if(device.width<700)await page.waitForFunction(()=>document.querySelector('[data-tour-stage]')?.getAttribute('data-tour-wide-loaded')==='15');
 await page.evaluate(async()=>{await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});await page.waitForTimeout(900);
 const snap=n=>page.screenshot({path:path.join(out,`${device.name}-${n}.png`),scale:'css'});
 const glide=(to,ms)=>page.evaluate(({to,ms})=>new Promise(resolve=>{const from=scrollY,start=performance.now();function tick(now){const t=Math.min(1,(now-start)/ms);scrollTo({top:from+(to-from)*t,behavior:'instant'});if(t<1)requestAnimationFrame(tick);else resolve();}requestAnimationFrame(tick);}),{to,ms});
 const target=selector=>page.locator(selector).evaluate(el=>el.getBoundingClientRect().top+scrollY);
 const show=async(selector,name)=>{await glide(await target(selector),1200);await page.waitForTimeout(700);await snap(name);};
 const through=async selector=>{const end=await page.locator(selector).evaluate(el=>el.getBoundingClientRect().bottom+scrollY-innerHeight+40);if(end>await page.evaluate(()=>scrollY))await glide(end,Math.max(1400,(end-await page.evaluate(()=>scrollY))/350*1000));};
 const tour=await page.locator('[data-paddock-tour]').evaluate(el=>el.getBoundingClientRect().top+scrollY+el.offsetHeight-innerHeight);
 await snap('hero');
 await recordLocalPage(page,path.join(out,`${device.name}-pagina-inteira.mp4`),async()=>{
  await page.waitForTimeout(2600);await glide(tour*.5,5000);await page.waitForTimeout(600);await glide(tour*.8,3000);await page.waitForTimeout(600);await glide(tour,2300);await page.waitForTimeout(1300);await snap('marcacoes');
  await show('#paddock-inspecao','inspecao');await through('#paddock-inspecao');await page.waitForTimeout(800);
  await show('#paddock-estoque','estoque');await glide(await target('#paddock-estoque fieldset')-20,1000);await page.waitForTimeout(800);await snap('carros');
  await page.getByRole('button',{name:'Sedã',exact:true}).click();await page.waitForTimeout(600);await page.locator('#laudo-sedan-verde').click();await page.waitForTimeout(1200);await snap('ficha');
  const report=page.getByRole('dialog',{name:'Sedã Verde',exact:true});await report.getByRole('link',{name:'Conversar sobre este carro'}).click();await page.waitForTimeout(800);
  const inquiry=page.locator('[data-inquiry="paddock"] dialog');await inquiry.getByRole('button',{name:'Continuar',exact:true}).click();await inquiry.getByRole('radio',{name:'Ver os registros do laudo',exact:true}).check();await inquiry.getByRole('button',{name:'Ver meu resumo',exact:true}).click();await page.waitForTimeout(1700);await snap('resumo');await inquiry.getByRole('button',{name:'Voltar ao site',exact:true}).click();
  await page.getByRole('button',{name:'Todos',exact:true}).click();await page.waitForTimeout(400);await through('#paddock-estoque');
  await show('#paddock-selecao','como-compramos');await through('#paddock-selecao');await show('#paddock-usado','seu-usado');await through('#paddock-usado');
  await show('section:has(> #paddock-duvidas)','duvidas');await page.locator('section:has(> #paddock-duvidas) summary').first().click();await page.waitForTimeout(1000);await through('section:has(> #paddock-duvidas)');
  await show('#paddock-interesse','roteiro');await through('#paddock-interesse');await glide(await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight),1000);await page.waitForTimeout(1200);
 },{width:device.width,height:device.height});
 reports.push({...device,errors,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});await context.close();
}}finally{await browser.close();}
await writeFile(path.join(out,'review.json'),JSON.stringify(reports,null,2));console.log(reports);
