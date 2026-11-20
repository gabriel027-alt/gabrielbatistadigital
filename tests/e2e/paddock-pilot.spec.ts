import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const route = '/modelos/automoveis';
async function at(page: Page, p: number){await page.locator('[data-paddock-tour]').evaluate((el,n)=>scrollTo({top:el.getBoundingClientRect().top+scrollY+((el as HTMLElement).offsetHeight-innerHeight)*n,behavior:'instant'}),p);}
async function ready(page: Page){await expect(page.locator('[data-tour-stage]')).toHaveAttribute('data-tour-loaded','223',{timeout:30000});}
const frame=(page: Page)=>page.locator('[data-tour-stage]').getAttribute('data-tour-frame').then(Number);
for(const device of [{width:1536,height:696,scale:1.25},{width:390,height:844,scale:1}]){
 test(`Paddock scrubs all chapters and reverses at ${device.width}`,async({browser})=>{
  const context=await browser.newContext({viewport:{width:device.width,height:device.height},deviceScaleFactor:device.scale,isMobile:device.width<700,hasTouch:device.width<700});const page=await context.newPage();const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(route);await ready(page);
  await at(page,0);await expect.poll(()=>frame(page)).toBe(0);
  await at(page,.55);await expect.poll(()=>frame(page)).toBe(167);
  await at(page,.72);await expect.poll(()=>frame(page)).toBeGreaterThan(180);await expect(page.locator('[data-tour-caption][data-active]')).toContainText('A roda. A lateral.');
  await at(page,1);await expect.poll(()=>frame(page)).toBe(222);await expect(page.locator('[data-tour-caption][data-active]')).toContainText('O desenho inteiro.');
  await at(page,0);await expect.poll(()=>frame(page)).toBe(0);
  await page.getByRole('button',{name:'Pausar o tour'}).click();await expect(page.locator('[data-model="paddock"]')).not.toHaveAttribute('data-brand-animated','true');
  expect(await page.locator('body').evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(0);expect(errors).toEqual([]);await context.close();
 });
}
test('Stock filters update the actual cars, count and pressed state',async({page})=>{
 await page.goto(route);await expect(page.locator('#paddock-estoque li')).toHaveCount(6);
 await page.getByRole('button',{name:'SUV',exact:true}).click();await expect(page.locator('#paddock-estoque li')).toHaveCount(2);await expect(page.getByRole('status')).toHaveText('2 carros');
 await page.getByRole('button',{name:'Picape',exact:true}).click();await expect(page.locator('#paddock-estoque li')).toHaveCount(1);await expect(page.getByRole('heading',{name:'Picape Preta'})).toBeVisible();
 await page.getByRole('button',{name:'Todos',exact:true}).click();await expect(page.locator('#paddock-estoque li')).toHaveCount(6);await expect(page.locator('#paddock-estoque')).not.toContainText(/R\$|Audi|BMW|Mercedes|Porsche|cavalos|garantia/i);
});
test('Reduced motion keeps the tour photographs and passes axe',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(route);await expect(page.locator('[data-model="paddock"]')).not.toHaveAttribute('data-brand-animated','true');await expect(page.locator('ol').filter({has:page.getByRole('heading',{name:'O farol acende.'})}).last()).toBeVisible();
 const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(audit.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))).toEqual([]);
});
test('No JavaScript retains all photographs and cars on a small phone',async({browser})=>{
 const c=await browser.newContext({javaScriptEnabled:false,viewport:{width:360,height:800}});const p=await c.newPage();await p.goto(route);await expect(p.locator('#paddock-estoque li')).toHaveCount(6);await expect(p.getByRole('heading',{name:'O desenho inteiro.'})).toBeVisible();expect(await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(0);await c.close();
});
