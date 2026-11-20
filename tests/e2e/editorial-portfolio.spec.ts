import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const route = "/";
// The projects strip: the first lap is the real list; the second is a decorative copy for the endless loop.
const projects = '#editorial-work ul:not([aria-hidden])';
const toEndOfFolder = (page: import("@playwright/test").Page) => page.locator('[data-work-track]').evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY + (el as HTMLElement).offsetHeight - innerHeight, behavior: 'instant' }));

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
  // Without motion the folder is open and the strip is a single row scrolled by hand (no repeated copy).
  await expect(page.locator(`${projects} > li`)).toHaveCount(6);
  await expect(page.locator('#editorial-work ul[aria-hidden]')).toBeHidden();
  expect(await page.locator('[data-strip]').evaluate(el => getComputedStyle(el).overflowX)).toBe('auto');
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
  await toEndOfFolder(page);
  // The strip keeps moving, so whichever loops are on screen play; they all stop with the motion control.
  const playing = () => page.locator('#editorial-work video[data-editorial-loop][src]').evaluateAll(nodes => nodes.filter(node => !(node as HTMLVideoElement).paused).length);
  await expect.poll(playing).toBeGreaterThan(0);
  expect(await page.locator('#editorial-work video[data-editorial-loop][src]').first().getAttribute('src')).toMatch(/^\/videos\/projects\/.*-loop\.mp4$/);
  await page.getByRole('button',{name:'Pausar movimento'}).click();
  await expect.poll(playing).toBe(0);
  const opener = page.locator(projects).getByRole('button',{name:'Ver filme completo: Aura'});
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
  await toEndOfFolder(page);
  await page.waitForTimeout(800);
  expect(await page.locator('video[data-editorial-loop][src]').count()).toBe(0);
});

test("No JavaScript retains original content, projects and contact without script-driven pinning", async ({ browser }) => {
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.goto(route);
  await expect(page.locator(`${projects} > li`)).toHaveCount(6);
  await expect(page.locator(projects).locator('a[href$=".mp4"]')).toHaveCount(6);
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

test('The dot opens the folder, the strip comes out reversibly and pause restores readable geometry', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route);
  await expect(page.locator('[data-editorial]')).toHaveAttribute('data-editorial-animated', 'true');
  const track = page.locator('[data-work-track]');
  const move = async (fraction: number) => {
    await track.evaluate((el, f) => scrollTo({ top: el.getBoundingClientRect().top + scrollY + ((el as HTMLElement).offsetHeight - innerHeight) * f, behavior: 'instant' }), fraction);
    await page.waitForTimeout(1300);
  };
  const state = () => page.evaluate(() => ({
    strip: Number(getComputedStyle(document.querySelector('[data-strip]')!).opacity),
    // The dot reaches the tab from the "g." above (a carrier dot travels between them), so it is hidden until it lands.
    dot: getComputedStyle(document.querySelector('[data-pasta-dot]')!).visibility,
  }));
  // Closed folder, dot not landed yet; then the strip is out; back at the start everything is put away again.
  await move(0);
  expect(await state()).toEqual({ strip: 0, dot: 'hidden' });
  await move(1);
  expect(await state()).toEqual({ strip: 1, dot: 'visible' });
  // The strip must not have run ahead while it was hidden; the first selected project opens fully on screen.
  expect(await page.locator(`${projects} > li`).first().evaluate(el => el.getBoundingClientRect().left)).toBeGreaterThanOrEqual(-2);
  await move(0);
  expect(await state()).toEqual({ strip: 0, dot: 'hidden' });
  await page.getByRole('button', { name: 'Pausar movimento' }).click();
  await expect(page.locator('[data-editorial]')).not.toHaveAttribute('data-editorial-animated', 'true');
  expect(await page.locator('[data-strip]').evaluate(el => getComputedStyle(el).transform)).toBe('none');
  expect((await state()).strip).toBe(1);
  await expect(page.locator('[data-hook] > h2')).toHaveCount(1);
  await expect(page.locator('[data-hook] > h2 a')).toBeVisible();
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

test('Selection shows the approved brands with the colors measured for each', async ({ page }) => {
  // A still strip: a moving one never settles for a click.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route);
  for (const name of ['Lume Psicologia', 'Arrimo Advocacia Previdenciária', 'Sutil Cirurgia Plástica', 'Casa Brisa', 'Aura', 'Orla']) {
    await expect(page.locator(`${projects} h3`, { hasText: name })).toHaveCount(1);
  }
  await expect(page.locator(`${projects} dl`)).toHaveCount(4);
  // The brands are shown only as films: no link leads to the brand sites, and each film has a vertical cut for phones.
  await expect(page.locator('a[href*="/modelos"]')).toHaveCount(0);
  const sutil = page.locator(projects).getByRole('button', { name: 'Ver filme completo: Sutil Cirurgia Plástica' });
  await sutil.click();
  const film = page.getByRole('dialog', { name: 'Filme do projeto Sutil Cirurgia Plástica' }).locator('video');
  await expect(film.locator('source[media="(max-width: 700px)"]')).toHaveAttribute('src', '/videos/projects/brands/sutil-mobile.mp4');
  await expect(film.locator('source:not([media])')).toHaveAttribute('src', '/videos/projects/brands/sutil-desktop.mp4');
  await page.keyboard.press('Escape');
  const images = await page.locator(`${projects} img`).evaluateAll(nodes => nodes.map(node => (node as HTMLImageElement).getAttribute('src')));
  expect(new Set(images).size).toBe(images.length);
  await expect(page.locator('body')).not.toContainText(/Vanguard|Chronos|catálogo de 20/);
});

test('The pointer stretches the name and the monogram shapes assemble with the scroll and come apart on the way back', async ({ page }) => {
  test.setTimeout(45000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route);
  await expect(page.locator('[data-editorial]')).toHaveAttribute('data-editorial-animated', 'true');
  // As in the reference, the name rests still and the pointer stretches it: toward the left "Gabriel" widens,
  // The portrait forms before the dot signs the name. Pointer interaction starts only after that whole sequence.
  await expect(page.locator('html')).toHaveAttribute('data-hero-signed', '', { timeout: 20000 });
  const widths = () => page.locator('[data-hero-word]').evaluateAll(words => words.map(word => parseFloat(getComputedStyle(word).getPropertyValue('--wdth'))));
  await expect.poll(async () => { await page.mouse.move(60, 450); await page.waitForTimeout(400); const [left, right] = await widths(); return left - right; }, { timeout: 12000 }).toBeGreaterThan(15);
  await expect.poll(async () => { await page.mouse.move(1380, 450); await page.waitForTimeout(400); const [left, right] = await widths(); return right - left; }).toBeGreaterThan(15);
  await expect(page.locator('[data-hero-sample] img')).toHaveCount(0);
  // The shapes: apart before the hold, assembled into the monogram at its end, apart again on the way back.
  const bowl = page.locator('[data-gb-shape="bowl"]');
  const finalTransform = 'translate(675.0 470.0) rotate(0.00) scale(1.000)';
  const track = await page.locator('[data-gb-track]').evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, height: (el as HTMLElement).offsetHeight }));
  const go = (y: number) => page.evaluate(top => scrollTo({ top, behavior: 'instant' }), y);
  await go(track.top - 700);
  await expect.poll(() => bowl.getAttribute('transform')).not.toBe(finalTransform);
  await go(track.top + track.height - 900);
  await expect.poll(() => bowl.getAttribute('transform')).toBe(finalTransform);
  await go(track.top - 700);
  await expect.poll(() => bowl.getAttribute('transform')).not.toBe(finalTransform);
});

test('The brand dot plants the tittle on each i of the name and lands in the card, once per visit', async ({ page, browser }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route);
  const tittles = page.locator('[data-tittle]');
  await expect(tittles).toHaveCount(2);
  const scales = () => tittles.evaluateAll(nodes => nodes.map(node => new DOMMatrix(getComputedStyle(node).transform).a));
  // Hidden at the start of the scene, both planted by its end.
  await expect.poll(scales, { timeout: 2000 }).toEqual([0, 0]);
  // The scene (ink, drop, hops, charge and lap) lasts about eight seconds; allow for a busy machine.
  await expect.poll(async () => (await scales()).every(scale => scale > .95), { timeout: 15000 }).toBe(true);
  await expect.poll(() => page.locator('[data-card-part="dot"]').evaluate(el => Number(getComputedStyle(el).opacity)), { timeout: 8000 }).toBeGreaterThan(.9);
  // Pausing and resuming motion does not replay the scene.
  await page.getByRole('button', { name: 'Pausar movimento' }).click();
  await page.getByRole('button', { name: 'Ativar movimento' }).click();
  expect((await scales()).every(scale => scale > .95)).toBe(true);
  // Without motion the red tittles are simply there.
  const reduced = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const still = await reduced.newPage();
  await still.goto(route);
  await expect(still.locator('[data-tittle]').first()).toBeVisible();
  await expect(still.locator('[data-hero-dot]')).toBeHidden();
  await reduced.close();
});

test('The red tittle of "clique" travels into the open palm and back with the scroll', async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 696 });
  await page.goto(route);
  await expect(page.locator('[data-editorial]')).toHaveAttribute('data-editorial-animated', 'true');
  const at = async (fraction: number) => {
    await page.locator('[data-creation-track]').evaluate((el, f) => scrollTo({ top: el.getBoundingClientRect().top + scrollY + ((el as HTMLElement).offsetHeight - innerHeight) * f, behavior: 'instant' }), fraction);
    await page.waitForTimeout(1200);
  };
  const seen = () => page.evaluate(() => ({
    tittle: getComputedStyle(document.querySelector('[data-hook-tittle=carry]')!).visibility,
    palm: getComputedStyle(document.querySelector('[data-creation-dot]')!).visibility,
  }));
  await page.locator('[data-hook] > h2').evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY - 200, behavior: 'instant' }));
  await page.waitForTimeout(1200);
  expect(await seen()).toEqual({ tittle: 'visible', palm: 'hidden' });
  await at(.26);
  expect(await seen()).toEqual({ tittle: 'hidden', palm: 'visible' });
  await page.locator('[data-hook] > h2').evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY - 200, behavior: 'instant' }));
  await page.waitForTimeout(1200);
  expect(await seen()).toEqual({ tittle: 'visible', palm: 'hidden' });
  // Without motion, the dot simply rests in the palm and the phrase keeps its red tittles.
  await page.getByRole('button', { name: 'Pausar movimento' }).click();
  expect(await seen()).toEqual({ tittle: 'visible', palm: 'visible' });
});

test('Cover uses the approved original portrait', async ({ page }) => {
  await page.goto(route);
  await expect(page.locator('[data-hero-photo] img')).toHaveAttribute('alt', 'Retrato frontal de Gabriel Batista com luz vermelha');
  await expect(page.locator('[data-hero-photo] img')).toHaveAttribute('src', /gabriel-hero-(wide|mobile)/);
});

test("The homepage is offered in Brazilian and European Portuguese, English and Spanish, each at its own address with the others listed", async ({ page }) => {
  const pages = [
    { path: "/", lang: "pt-BR", title: /Sites para clínicas/, hook: "Do primeiro olhar" },
    { path: "/pt-pt", lang: "pt-PT", title: /Sites para clínicas e negócios premium/, hook: "Do primeiro olhar ao próximo clique, e daí" },
    { path: "/en", lang: "en", title: /Websites for clinics/, hook: "From first glance" },
    { path: "/es", lang: "es", title: /páginas web para clínicas/, hook: "De la primera mirada" },
  ];
  for (const item of pages) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(item.path);
    await expect(page).toHaveTitle(item.title);
    await expect(page.locator("html")).toHaveAttribute("lang", item.lang);
    await expect(page.locator("[data-hook] h2[data-kinetic]")).toHaveAttribute("aria-label", new RegExp(`^${item.hook}`));
    // Every page lists the three languages for search engines and links to them with a flag.
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(5);
    for (const target of ["/", "/pt-pt", "/en", "/es"]) await expect(page.locator(`[data-editorial-nav] a[href="${target}"][hreflang]`).first()).toBeAttached();
    await expect(page.locator(`[data-editorial-nav] a[aria-current="true"][href="${item.path}"]`).first()).toBeAttached();
  }
});

test("A wrong address answers in the language of its section and leads back to that homepage", async ({ page }) => {
  for (const [path, title, home] of [["/nao-existe", "Esta página não está por aqui.", "/"], ["/en/missing", "This page isn't here.", "/en"], ["/es/no-existe", "Esta página no está aquí.", "/es"], ["/pt-pt/nao-existe", "Esta página não está aqui.", "/pt-pt"]]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page.locator(`main a[href="${home}"]`)).toBeVisible();
  }
});

test("A click on WhatsApp is recorded with its place, language and campaign, without loading any analytics", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const outside: string[] = [];
  page.on("request", request => { const url = new URL(request.url()); if (!["localhost", "127.0.0.1"].includes(url.hostname)) outside.push(url.hostname); });
  await page.goto("/en?utm_source=google&utm_campaign=test-clinics");
  await page.evaluate(() => addEventListener("click", event => event.preventDefault()));
  await page.locator('[data-track-place="contato"]').evaluate((link: HTMLElement) => link.click());
  const pushed = await page.evaluate(() => (window as Window & { dataLayer?: Record<string, string>[] }).dataLayer?.at(-1));
  expect(pushed).toMatchObject({ event: "whatsapp_click", place: "contato", language: "en", page: "/en", utm_source: "google", utm_campaign: "test-clinics" });
  expect(await page.evaluate(() => document.cookie)).toBe("");
  expect(outside).toEqual([]);
});

test("Without analytics IDs there is no cookie banner, and the privacy policy exists in the four languages", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-consent-banner]")).toHaveCount(0);
  await expect(page.locator('footer a[href="/privacidade"]')).toBeAttached();
  for (const [path, title, lang] of [["/privacidade", "Política de privacidade", "pt-BR"], ["/pt-pt/privacidade", "Política de privacidade", "pt-PT"], ["/en/privacy", "Privacy policy", "en"], ["/es/privacidad", "Política de privacidad", "es"]]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
  }
});
