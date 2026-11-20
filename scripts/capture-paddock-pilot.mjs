import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { recordLocalPage } from './lib/record-local-page.mjs';
const base=process.env.PROJECT_PREVIEW_URL || 'http://127.0.0.1:3185';
if(!['127.0.0.1','localhost'].includes(new URL(base).hostname))throw new Error('Local preview required');
const out=process.env.PADDOCK_REVIEW_DIR || '/tmp/paddock-piloto';await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined});const report=[];
try{for(const device of [{name:'pc',width:1536,height:696,scale:1.25},{name:'celular',width:390,height:844,scale:1}]){
 const context=await browser.newContext({viewport:{width:device.width,height:device.height},deviceScaleFactor:device.scale,isMobile:device.width<700,hasTouch:device.width<700});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`${base}/modelos/automoveis`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 await page.waitForFunction(()=>document.querySelector('[data-tour-stage]')?.getAttribute('data-tour-loaded')==='223');
 if(device.width<700)await page.waitForFunction(()=>document.querySelector('[data-tour-stage]')?.getAttribute('data-tour-wide-loaded')==='15');
 const bounds=await page.locator('[data-paddock-tour]').evaluate(el=>({top:el.getBoundingClientRect().top+scrollY,travel:el.offsetHeight-innerHeight}));
 const glide=(progress,ms)=>page.evaluate(({to,ms})=>new Promise(resolve=>{const from=scrollY,start=performance.now();function tick(now){const t=Math.min(1,(now-start)/ms);scrollTo({top:from+(to-from)*t,behavior:'instant'});if(t<1)requestAnimationFrame(tick);else resolve();}requestAnimationFrame(tick);}),{to:bounds.top+bounds.travel*progress,ms});
 const snap=name=>page.screenshot({path:path.join(out,`${device.name}-${name}.png`),scale:'css'});
 await glide(0,1);await page.waitForTimeout(700);await snap('hero');
 await recordLocalPage(page,path.join(out,`${device.name}-ida-volta.mp4`),async()=>{
  await page.waitForTimeout(1200);await glide(.5,5200);await page.waitForTimeout(600);await snap('farol');await glide(.77,3300);await page.waitForTimeout(600);await snap('lateral');await glide(1,2200);await page.waitForTimeout(1200);await snap('inteiro');
  await glide(0,8500);await page.waitForTimeout(900);await snap('volta');
  await page.locator('header').getByRole('link',{name:'Explorar estoque'}).click();await page.waitForTimeout(2200);await snap('estoque');
  await page.locator('#paddock-estoque fieldset').evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-20,behavior:'smooth'}));await page.waitForTimeout(1200);await snap('carros');await page.waitForTimeout(1200);
  await page.getByRole('button',{name:'SUV',exact:true}).click();await page.waitForTimeout(700);await snap('filtro-suv');await page.waitForTimeout(1000);await page.getByRole('button',{name:'Todos',exact:true}).click();await page.waitForTimeout(900);
 },{width:device.width,height:device.height});
 report.push({...device,errors,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});await context.close();
}}finally{await browser.close();}
await writeFile(path.join(out,'review.json'),JSON.stringify(report,null,2));console.log(report);
