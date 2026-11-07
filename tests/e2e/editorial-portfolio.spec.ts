import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const route = "/propostas/portfolio-editorial";

test("Editorial reconstruction retains a complete readable mobile and motion-reduced experience", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const videos: string[] = [];
  page.on("request", request => { if (request.url().includes("-loop.mp4")) videos.push(request.url()); });
  await page.goto(route);
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Gabriel Batista");
  await expect(page.locator('[data-editorial]')).not.toHaveAttribute('data-editorial-animated','true');
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.locator('#editorial-work > summary').click();
  await expect(page.locator('#editorial-work')).toHaveAttribute('open','');
  await expect(page.locator('#editorial-work figure')).toHaveCount(6);
  expect(videos).toEqual([]);
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(audit.violations).toEqual([]);
});

test("Visible loops load locally, pause with the control and open a full film with keyboard return", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route);
  await expect(page.locator('[data-editorial]')).toHaveAttribute('data-editorial-animated','true');
  expect(await page.locator('video[data-editorial-loop][src]').count()).toBe(0);
  const row = page.locator('[data-sample-row]').first();
  await row.scrollIntoViewIfNeeded();
  const loop = row.locator('video[data-editorial-loop="aura"]');
  await expect(loop).toHaveAttribute('src','/videos/projects/aura-loop.mp4');
  await expect.poll(() => loop.evaluate(el => (el as HTMLVideoElement).paused)).toBe(false);
  await page.getByRole('button',{name:'Pausar movimento'}).click();
  await expect.poll(() => loop.evaluate(el => (el as HTMLVideoElement).paused)).toBe(true);
  const opener = row.getByRole('button',{name:'Ver filme completo: Aura'});
  await opener.click();
  const dialog = page.getByRole('dialog',{name:'Filme do projeto Aura'});
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link')).toHaveAttribute('href',/wa.me\/5538998267717/);
  await expect(dialog.locator('video')).toHaveAttribute('controls','');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test("Data saving suppresses teaser downloads", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator,'connection',{value:{saveData:true},configurable:true}));
  await page.goto(route);
  await page.locator('[data-sample-row]').first().scrollIntoViewIfNeeded();
  expect(await page.locator('video[data-editorial-loop][src]').count()).toBe(0);
});

test("No JavaScript retains original content, projects and contact without script-driven pinning", async ({ browser }) => {
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.goto(route);
  await page.locator('#editorial-work > summary').click();
  await expect(page.locator('#editorial-work figure')).toHaveCount(6);
  await expect(page.getByRole('heading',{name:'Uma boa ideia precisa funcionar.'})).toBeVisible();
  await expect(page.locator('a[href*="wa.me"]').first()).toHaveAttribute('href',/5538998267717/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test("Editorial motion preview decodes in the browser",async({page})=>{
 await page.goto('/propostas/portfolio-editorial/previa');const video=page.getByLabel('Prévia do portfólio editorial');
 await expect.poll(()=>video.evaluate(el=>(el as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(1);
 expect(await video.evaluate(el=>(el as HTMLVideoElement).duration)).toBeGreaterThan(25);
 await video.evaluate(el=>(el as HTMLVideoElement).play());await expect.poll(()=>video.evaluate(el=>(el as HTMLVideoElement).currentTime)).toBeGreaterThan(.3);
});
