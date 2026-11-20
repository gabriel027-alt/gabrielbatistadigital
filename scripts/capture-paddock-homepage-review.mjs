// Local review of Paddock in the approved selected-project strip; no public navigation or publishing.
import { chromium } from '@playwright/test';
import { mkdir,writeFile } from 'node:fs/promises';
import path from 'node:path';
import { recordLocalPage } from './lib/record-local-page.mjs';
const base=process.env.PROJECT_PREVIEW_URL || 'http://127.0.0.1:3193';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw new Error('Local preview required');
const out=process.env.PADDOCK_REVIEW_DIR || '/tmp/paddock-homepage';await mkdir(out,{recursive:true});
const b=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined});const reports=[];
try{for(const device of [{name:'pc',width:1536,height:696,scale:1.25},{name:'celular',width:390,height:844,scale:1}]){
 const c=await b.newContext({viewport:{width:device.width,height:device.height},deviceScaleFactor:device.scale,isMobile:device.width<700,hasTouch:device.width<700});const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 await p.locator('[data-work-track]').evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY+el.offsetHeight-innerHeight,behavior:'instant'}));await p.waitForTimeout(1800);
 const opener=p.locator('#editorial-work ul:not([aria-hidden])').getByRole('button',{name:'Ver filme completo: Paddock',exact:true});
 if(device.width<700)await p.waitForFunction(()=>{const e=document.querySelector('#editorial-work ul:not([aria-hidden]) button[aria-label="Ver filme completo: Paddock"]');if(!e)return false;const r=e.getBoundingClientRect();return r.left>=8&&r.right<=innerWidth-8;},null,{timeout:60000});
 await opener.focus();await p.waitForTimeout(400);await p.screenshot({path:path.join(out,`${device.name}-faixa.png`),scale:'css'});
 await recordLocalPage(p,path.join(out,`${device.name}-faixa-curta.mp4`),async()=>{await p.waitForTimeout(6500);},{width:device.width,height:device.height});
 await opener.click();const movie=p.getByRole('dialog',{name:'Filme do projeto Paddock'}).locator('video');await movie.evaluate(async v=>{v.muted=true;await v.play();});await p.waitForTimeout(800);await movie.evaluate(v=>{v.pause();v.currentTime=1;});await p.waitForTimeout(300);await p.screenshot({path:path.join(out,`${device.name}-filme.png`),scale:'css'});
 reports.push({...device,errors,movie:await movie.evaluate(v=>({source:v.currentSrc,width:v.videoWidth,height:v.videoHeight,duration:v.duration,error:v.error?.message})),overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
 await p.goto(base+'/modelos/automoveis',{waitUntil:'networkidle'});await p.waitForTimeout(1200);await p.screenshot({path:path.join(out,`${device.name}-hero.png`),scale:'css'});
 await p.locator('[data-paddock-tour]').evaluate(e=>scrollTo(0,e.offsetHeight-innerHeight));await p.waitForTimeout(1600);await p.screenshot({path:path.join(out,`${device.name}-marcacoes.png`),scale:'css'});
 await c.close();
}}finally{await b.close();}
await writeFile(path.join(out,'homepage-review.json'),JSON.stringify(reports,null,2));console.log(reports);
