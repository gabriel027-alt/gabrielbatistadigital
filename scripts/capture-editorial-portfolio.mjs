import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { recordLocalPage } from './lib/record-local-page.mjs';
const base=process.env.EDITORIAL_PREVIEW_URL||'http://127.0.0.1:3121';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw new Error('Local preview required');
const out='docs/preview/editorial-portfolio';await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'/usr/bin/chromium',headless:true});
try{
 for(const[name,width,height]of[['desktop',1440,900],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});await page.goto(base+'/propostas/portfolio-editorial');await page.waitForLoadState('networkidle');await page.screenshot({path:`${out}/${name}-hero.png`});
  for(const[part,selector]of[['hook','[data-hook]'],['services','[data-sample-row]'],['folder','#editorial-work'],['about','#editorial-about'],['contact','#editorial-contact']]){
   await page.locator(selector).first().evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-100,behavior:'instant'}));await page.waitForTimeout(250);await page.screenshot({path:`${out}/${name}-${part}.png`});
  }
  await page.locator('#editorial-work > summary').click();await page.locator('#editorial-work figure').first().scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/${name}-selection.png`});await page.close();
 }
 const page=await browser.newPage({viewport:{width:1280,height:800}});await page.goto(base+'/propostas/portfolio-editorial');await page.waitForLoadState('networkidle');await page.waitForTimeout(500);
 async function to(selector,duration){const target=typeof selector==='string'?page.locator(selector).first():selector;const top=await target.evaluate(el=>el.getBoundingClientRect().top+scrollY-90);await page.evaluate(({top,duration})=>new Promise(resolve=>{const start=performance.now(),from=scrollY;function step(now){const p=Math.min(1,(now-start)/duration);scrollTo({top:from+(top-from)*p,behavior:'instant'});if(p<1)requestAnimationFrame(step);else resolve()}requestAnimationFrame(step)}),{top,duration});await page.waitForTimeout(650);}
 await recordLocalPage(page,`${out}/experience.mp4`,async()=>{
  await page.waitForTimeout(1500);await to('[data-hook]',1900);await page.waitForTimeout(900);await to('[data-shape="-75"]',2000);await to('#editorial-services-title',1800);
  for(let i=0;i<4;i++){await to(page.locator('[data-sample-row]').nth(i),1500);await page.waitForTimeout(1000);}
  await to('#editorial-work',1800);await page.locator('#editorial-work > summary').click();await page.waitForTimeout(800);const button=page.locator('#editorial-work').getByRole('button',{name:'Ver filme completo: Aura'});await button.scrollIntoViewIfNeeded();await button.click();await page.getByRole('dialog').locator('video').evaluate(el=>el.play());await page.waitForTimeout(1700);await page.keyboard.press('Escape');await page.locator('#editorial-work > summary').click();await to('#editorial-about',1800);await page.waitForTimeout(1300);await to('#editorial-contact',2800);await page.waitForTimeout(1300);await to('footer',1600);await page.waitForTimeout(1300);
 });await page.close();
 console.log('Editorial screenshots and motion preview saved');
}finally{await browser.close();}
