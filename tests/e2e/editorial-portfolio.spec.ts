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
  await expect(page.getByRole('link', { name: 'clique' })).toHaveCount(1);
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

test('Scroll unfolds the gallery reversibly and pause restores readable geometry', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route);
  await expect(page.locator('[data-editorial]')).toHaveAttribute('data-editorial-animated', 'true');
  const row = page.locator('[data-sample-row]').first();
  const move = async (offset: number) => {
    await row.evaluate((el, offset) => scrollTo({ top: el.getBoundingClientRect().top + scrollY - offset, behavior: 'instant' }), offset);
    await page.waitForTimeout(1100);
  };
  const transform = () => row.evaluate(el => getComputedStyle(el).transform);
  await move(880);
  const folded = await transform();
  await move(300);
  const unfolded = await transform();
  expect(unfolded).not.toBe(folded);
  await move(880);
  expect(await transform()).toBe(folded);
  await page.getByRole('button', { name: 'Pausar movimento' }).click();
  await expect(page.locator('[data-editorial]')).not.toHaveAttribute('data-editorial-animated', 'true');
  expect(await transform()).toBe('none');
  await expect(page.locator('[data-hook] h2')).toHaveCount(1);
  await expect(page.locator('[data-hook] h2 a')).toBeVisible();
  await page.getByRole('button', { name: 'Ativar movimento' }).click();
  await expect(page.locator('[data-editorial]')).toHaveAttribute('data-editorial-animated', 'true');
});


test('The animated about portrait stays inside its section and leaves the contact panel readable', async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto(route);
    await expect(page.locator('[data-editorial]')).toHaveAttribute('data-editorial-animated', 'true');
    await page.locator('[data-contact-panel]').evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY - 120, behavior: 'instant' }));
    await page.waitForTimeout(1100);
    const paintsOverTitle = await page.locator('[data-contact-panel] h2').evaluate(title => {
      const box = title.getBoundingClientRect();
      return document.elementsFromPoint(box.left + 5, box.top + 5).some(el => Boolean(el.closest('[data-about-photo]')));
    });
    expect(paintsOverTitle).toBe(false);
  }
});

test('Navigation theme follows the section under the logo after reversing near a boundary', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route);
  const root = page.locator('[data-editorial]');
  const sectionTop = (selector: string) => page.locator(selector).evaluate(el => el.getBoundingClientRect().top + scrollY);
  const moveTo = async (y: number) => { await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), y); await page.waitForTimeout(350); };
  const hook = await sectionTop('[data-hook]');
  for (const y of [hook + 40, hook - 40, hook + 600]) await moveTo(y);
  await expect(root).toHaveAttribute('data-editorial-theme', 'paper');
  const about = await sectionTop('#editorial-about');
  for (const y of [about + 40, about - 40, about + 700]) await moveTo(y);
  await expect(root).toHaveAttribute('data-editorial-theme', 'photo');
});

test('Mobile motion control shares the navigation row without covering it', async ({ page }) => {
  for (const width of [320, 360, 390]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(route);
    const control = page.getByRole('button', { name: 'Pausar movimento' });
    await expect(control).toBeVisible();
    const pill = await page.locator('[data-editorial-nav] nav').boundingBox();
    const button = await control.boundingBox();
    expect(pill && button && button.x >= pill.x + pill.width).toBe(true);
    expect(button!.width).toBeGreaterThanOrEqual(44);
    expect(button!.height).toBeGreaterThanOrEqual(44);
  }
});

test('Scrolling the opening never puts the name or the sample over the face', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto(route);
  await expect(page.locator('[data-editorial]')).toHaveAttribute('data-editorial-animated', 'true');
  for (const fraction of [.2, .4, .6]) {
    await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), Math.round(768 * fraction));
    await page.waitForTimeout(900);
    // Whatever is still visible of the name or the sample must sit below the chin.
    const state = await page.evaluate(() => {
      const opacity = (selector: string) => Number(getComputedStyle(document.querySelector(selector)!).opacity);
      const top = (selector: string) => document.querySelector(selector)!.getBoundingClientRect().top;
      const photo = document.querySelector('[data-hero-photo]')!.getBoundingClientRect();
      // At 1366×768 the framed portrait is cropped to width; its chin lands at about 60% of the photo area.
      return { chin: photo.top + photo.height * .6, word: top('[data-hero-wordmark]'), wordOpacity: opacity('[data-hero-wordmark]'), sample: top('[data-hero-sample]'), sampleOpacity: opacity('[data-hero-sample]') };
    });
    expect(state.wordOpacity < .1 || state.word > state.chin).toBe(true);
    expect(state.sampleOpacity < .1 || state.sample > state.chin).toBe(true);
  }
});

test('Cover uses the approved original portrait', async ({ page }) => {
  await page.goto(route);
  await expect(page.locator('[data-hero-photo] img')).toHaveAttribute('alt', 'Retrato frontal de Gabriel Batista com luz vermelha');
  await expect(page.locator('[data-hero-photo] img')).toHaveAttribute('src', /gabriel-approved-red/);
});
