// Still review of the named persona, complete stamp and reserved pause control.
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const base=process.env.PROJECT_PREVIEW_URL || 'http://127.0.0.1:3180';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw new Error('Local preview required');
const out=process.env.ARRIMO_REVIEW_DIR || '/tmp/arrimo-ricardo';await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined});
const reports=[];
try{for(const device of [{name:'pc',width:1536,height:696,scale:1.25},{name:'celular',width:390,height:844,scale:1}]){
 const context=await browser.newContext({viewport:{width:device.width,height:device.height},deviceScaleFactor:device.scale,isMobile:device.width<760,hasTouch:device.width<760});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`${base}/modelos/previdenciario`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1500);
 const snap=async name=>page.screenshot({path:path.join(out,`${device.name}-${name}.png`),scale:'css'});
 await snap('hero');
 for(const [name,progress]of[['negado',0],['riscado',.755],['analise',1]]){await page.locator('[data-arrimo-scene]').evaluate((el,p)=>scrollTo({top:el.getBoundingClientRect().top+scrollY+(el.offsetHeight-innerHeight)*p,behavior:'instant'}),progress);await page.waitForTimeout(900);await snap(name);}
 await page.locator('#arrimo-escritorio').evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-74,behavior:'instant'}));await page.waitForTimeout(700);await snap('escritorio');
 await page.getByRole('button',{name:'Preparar minha conversa',exact:true}).click();await page.getByRole('radio',{name:'Benefício negado',exact:true}).check();await page.getByRole('button',{name:'Continuar',exact:true}).click();await page.getByRole('radio',{name:'Recebi uma negativa',exact:true}).check();await page.getByRole('radio',{name:'Para mim',exact:true}).check();await page.getByRole('button',{name:'Ver meu resumo',exact:true}).click();await snap('resumo');
 reports.push({...device,errors,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});await context.close();
}}finally{await browser.close();}
await writeFile(path.join(out,'review.json'),JSON.stringify(reports,null,2));console.log(reports);
