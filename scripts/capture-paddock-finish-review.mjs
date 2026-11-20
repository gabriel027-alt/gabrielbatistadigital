// Local evidence of the approved finishing changes, including every stock color with mouse and touch.
import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {recordLocalPage} from './lib/record-local-page.mjs';
const base=process.env.PROJECT_PREVIEW_URL || 'http://127.0.0.1:3195';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw new Error('Local preview required');
const out=process.env.PADDOCK_REVIEW_DIR || '/tmp/paddock-finish';await mkdir(out,{recursive:true});
const b=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined});const reports=[];
try{for(const d of [{name:'pc',width:1536,height:696,scale:1.25},{name:'celular',width:390,height:844,scale:1}]){
 const c=await b.newContext({viewport:{width:d.width,height:d.height},deviceScaleFactor:d.scale,isMobile:d.width<700,hasTouch:d.width<700});const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(base+'/modelos/automoveis',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 const snap=n=>p.screenshot({path:path.join(out,`${d.name}-${n}.png`),scale:'css'});
 await p.waitForTimeout(800);await snap('hero');await p.locator('[data-paddock-tour]').evaluate(e=>scrollTo(0,e.offsetHeight-innerHeight));await p.waitForTimeout(1000);await snap('tour');
 const cards=p.locator('[data-paddock-cars]>li');const checks=[];
 for(const card of await cards.all()){await card.scrollIntoViewIfNeeded();await p.waitForTimeout(150);}
 await recordLocalPage(p,path.join(out,`${d.name}-brilho-carros.mp4`),async()=>{
  for(let i=0;i<6;i++){
   const card=cards.nth(i);await card.evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-105,behavior:'instant'}));await p.mouse.move(0,0);await p.waitForTimeout(400);
   if(d.width<700)await card.locator('figure').tap();else await card.locator('figure').hover();
   await p.waitForTimeout(650);
   const state=await card.evaluate(e=>({name:e.querySelector('h3').textContent,accent:getComputedStyle(e).getPropertyValue('--car-accent').trim(),shadow:getComputedStyle(e).boxShadow,lit:e.hasAttribute('data-lit')}));
   if(state.shadow==='none')throw new Error('Missing paint glow: '+state.name);checks.push(state);
   if(i===1||i===5)await snap(`brilho-${i}`);
   await p.waitForTimeout(500);
  }
 },{width:d.width,height:d.height});
 for(const [selector,name] of [['#paddock-usado','usado'],['#paddock-loja','loja']]){await p.locator(selector).evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-85));await p.waitForTimeout(400);await snap(name);}
 reports.push({...d,checks,errors,overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});await c.close();
}}finally{await b.close();}
await writeFile(path.join(out,'review.json'),JSON.stringify(reports,null,2));console.log(reports);
