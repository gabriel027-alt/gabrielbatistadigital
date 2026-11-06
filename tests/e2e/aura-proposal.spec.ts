import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Aura editorial: navigation, content and responsive accessibility", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/propostas/aura");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Sua expressão. Em primeiro plano.");
  await page.getByRole("link", { name: "Entender a avaliação", exact: true }).click();
  await expect(page).toHaveURL(/#aura-avaliacao$/);
  await page.locator("summary").filter({ hasText: "Possibilidades e limites" }).click();
  await expect(page.getByText("Indicações, riscos, alternativas", { exact: false })).toBeVisible();
  for (const width of [360, 390, 768, 900, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow ${width}`).toBe(true);
  }
  await expect(page.getByRole("link", { name: "Falar com Gabriel sobre o projeto" })).toHaveAttribute("href", /wa.me\/5538998267717/);
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(audit.violations).toEqual([]);
});

test("Aura scroll reverses and disabling motion restores static readable content", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/propostas/aura");
  await expect(page.locator('[data-motion]')).toHaveAttribute('data-animated', 'true');
  const portrait = page.locator('[data-portrait]');
  expect(await portrait.evaluate(el => getComputedStyle(el).clipPath)).toBe('none');
  await page.evaluate(() => scrollTo(0, 1050));
  await expect.poll(() => page.locator('[data-scene-intro]').evaluate(el => Number(getComputedStyle(el).opacity))).toBeLessThan(.1);
  await page.evaluate(() => scrollTo(0, 0));
  expect(await portrait.evaluate(el => getComputedStyle(el).clipPath)).toBe('none');
  await page.getByRole("button", { name: "Desativar animações" }).click();
  await expect(page.getByRole("button", { name: "Ativar animações" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('[data-motion]')).not.toHaveAttribute('data-animated', 'true');
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await portrait.evaluate(el => getComputedStyle(el).clipPath)).toBe('none');
  await page.getByRole("button", { name: "Ativar animações" }).click();
  await expect(page.locator('[data-motion]')).toHaveAttribute('data-animated', 'true');
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator('[data-motion]')).not.toHaveAttribute('data-animated', 'true');
  await expect(page.getByRole("button", { name: "Desativar animações" })).toBeHidden();
  expect(await portrait.evaluate(el => getComputedStyle(el).clipPath)).toBe('none');
});

test("Aura retains readable copy, imagery and disclosures without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3107/propostas/aura");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.locator("summary").filter({ hasText: "Uma decisão informada" }).click();
  await expect(page.getByText("Antes de decidir, esclareça", { exact: false })).toBeVisible();
  expect(await page.locator('[data-hero-glyph]').first().evaluate(el => getComputedStyle(el).opacity)).toBe('1');
  await expect(page.getByRole('button', { name: /animações/ })).toHaveCount(0);
  await context.close();
});

test("Aura camera draws intermediate views and reverses without loading a 3D model", async ({page}) => {
  test.setTimeout(60000);
  await page.setViewportSize({width:1440,height:900});
  const models:string[]=[];
  page.on('request',r=>{if(/\.glb(?:$|\?)/.test(r.url()))models.push(r.url());});
  await page.goto('/propostas/aura');
  const track=page.locator('[data-photo-track]'), camera=page.locator('[data-photo-camera]');
  await track.evaluate(el=>scrollTo(0,el.getBoundingClientRect().top+scrollY-350));
  await expect(track).toHaveAttribute('data-sequence-animated','true');
  const g=await track.evaluate(el=>({top:el.getBoundingClientRect().top+scrollY,travel:(el as HTMLElement).offsetHeight-innerHeight}));
  const notes=page.locator('[data-photo-copy]');
  await page.evaluate(y=>scrollTo(0,y),g.top);
  await expect(camera).toHaveAttribute('data-camera','0.5000,0.5000,1.0400,0.7200');
  await expect(page.locator('[data-scene-intro]')).toBeVisible();
  await expect(page.locator('[data-transition-text]')).toHaveCount(0);
  await page.evaluate(y=>scrollTo(0,y),g.top+g.travel*.09);
  await page.waitForTimeout(650);
  const entryCamera=(await camera.getAttribute('data-camera'))!.split(',').map(Number);
  expect(entryCamera[2]).toBeGreaterThan(1.04);
  expect(entryCamera[2]).toBeLessThan(2.45);
  for(const [index,p] of [[0,0],[1,.3],[2,.55],[3,.8],[4,1],[0,0]]){
    await page.evaluate(y=>scrollTo(0,y),g.top+g.travel*(.18+.82*p));
    await expect(notes.nth(index)).toHaveAttribute('data-active','true');
    await expect(notes.nth(index)).toBeVisible();
    if(p===0) {
      await expect(camera).toHaveAttribute('data-camera','0.7300,0.5500,2.4500,0.7200');
      await expect(notes.first()).toHaveAttribute('data-region','malar');
    }
  }
  await page.evaluate(y=>scrollTo(0,y),g.top+g.travel*(.18+.82*.24));
  await expect.poll(()=>camera.getAttribute('data-frame')).toBe('57');
  await page.waitForTimeout(650);
  const before=await camera.screenshot();const coordinates=await camera.getAttribute('data-camera');
  await page.evaluate(y=>scrollTo(0,y),g.top+g.travel*(.18+.82*.27));
  await expect.poll(()=>camera.getAttribute('data-frame')).toBe('65');
  expect(await camera.getAttribute('data-camera')).not.toBe(coordinates);
  expect((await camera.screenshot()).equals(before)).toBe(false);
  await page.evaluate(y=>scrollTo(0,y),g.top+g.travel*(.18+.82*.24));
  await expect.poll(()=>camera.getAttribute('data-frame')).toBe('57');
  await page.waitForTimeout(650);
  expect((await camera.screenshot()).equals(before)).toBe(true);
  expect(models).toEqual([]);
  await page.getByRole('link',{name:'Entender a avaliação ↓',exact:true}).click();
  await expect(page).toHaveURL(/#aura-avaliacao$/);
  await page.getByRole('button',{name:'Desativar animações'}).click();
  await expect(track).not.toHaveAttribute('data-sequence-animated','true');
  for(let i=0;i<5;i++)await expect(notes.nth(i)).toBeVisible();
  await page.getByRole('button',{name:'Ativar animações'}).click();
  await track.evaluate(el=>scrollTo(0,el.getBoundingClientRect().top+scrollY-350));
  await expect(track).toHaveAttribute('data-sequence-animated','true');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(track).not.toHaveAttribute('data-sequence-animated','true');
});

test("Aura continuous camera keeps mobile copy visible and supports evaluation navigation",async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/propostas/aura');
  const track=page.locator('[data-photo-track]');
  await track.evaluate(el=>scrollTo(0,el.getBoundingClientRect().top+scrollY));
  await expect(track).toHaveAttribute('data-sequence-animated','true');
  const g=await track.evaluate(el=>({top:el.getBoundingClientRect().top+scrollY,travel:(el as HTMLElement).offsetHeight-innerHeight}));
  await page.evaluate(y=>scrollTo(0,y),g.top+g.travel*(.18+.82*.4));
  const note=page.locator('[data-photo-copy]').nth(1);
  await expect(note).toHaveAttribute('data-active','true');
  await expect(note.getByRole('heading',{name:'Lábios.'})).toBeInViewport();
  await expect(page.locator('[data-photo-camera]')).toBeInViewport();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('link',{name:'Entender a avaliação ↓',exact:true}).click();
  await expect(page).toHaveURL(/#aura-avaliacao$/);
});


test("Aura holds the camera while the illustrative comparison changes and reverses",async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/propostas/aura');
  const track=page.locator('[data-photo-track]'), camera=page.locator('[data-photo-camera]');
  await track.evaluate(el=>scrollTo(0,el.getBoundingClientRect().top+scrollY));
  await expect(track).toHaveAttribute('data-sequence-animated','true');
  const g=await track.evaluate(el=>({top:el.getBoundingClientRect().top+scrollY,travel:(el as HTMLElement).offsetHeight-innerHeight}));
  await page.evaluate(y=>scrollTo(0,y),g.top+g.travel*(.18+.82*.01)); await page.waitForTimeout(800);
  const before=await camera.screenshot(), position=await camera.getAttribute('data-camera');
  await expect(page.locator('[data-comparison-label]').first()).toHaveText('Antes · simulação');
  await page.evaluate(y=>scrollTo(0,y),g.top+g.travel*(.18+.82*.14)); await page.waitForTimeout(800);
  expect(await camera.getAttribute('data-camera')).toBe(position);
  expect((await camera.screenshot()).equals(before)).toBe(false);
  await expect(page.locator('[data-comparison-label]').first()).toHaveText('Depois · simulação');
  await page.evaluate(y=>scrollTo(0,y),g.top+g.travel*(.18+.82*.01)); await page.waitForTimeout(800);
  expect((await camera.screenshot()).equals(before)).toBe(true);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(track).not.toHaveAttribute('data-sequence-animated','true');
  await page.getByText('Ver comparação ilustrativa',{exact:true}).first().click();
  await expect(page.getByAltText('Antes — variação digital ilustrativa da personagem').first()).toBeVisible();
});
