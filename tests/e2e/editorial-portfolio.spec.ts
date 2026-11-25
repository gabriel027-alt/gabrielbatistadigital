import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const route = "/";
// The projects (21/11/2026): a still grid right after the folder, one list, no decorative copy.
const projects = '#editorial-work ul:not([aria-hidden])';
const toGrid = (page: import("@playwright/test").Page) => page.locator('[data-strip]').evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight * .2, behavior: 'instant' }));

test("Editorial reconstruction retains a complete readable mobile and motion-reduced experience", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const videos: string[] = [];
  page.on("request", request => { if (request.url().includes("-loop.mp4")) videos.push(request.url()); });
  await page.goto(route);
  // Direction A (21/11/2026): the promise is the main heading; the name is the signature, still read as text.
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Sites com a identidade da sua marca.");
  await expect(page.locator("[data-hero-wordmark]")).toContainText("Gabriel Batista");
  await expect(page.locator("[data-hero-pitch] a[href='#editorial-work']")).toBeVisible();
  await expect(page.locator("[data-hero-pitch] a[data-track-place='topo']")).toHaveAttribute("href", /wa.me\/5538998267717/);
  await expect(page.locator('[data-editorial]')).not.toHaveAttribute('data-editorial-animated','true');
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  // Without motion the folder is open and the projects are one grid (no repeated copy).
  await expect(page.locator(`${projects} > li[data-work]`)).toHaveCount(16);
  await expect(page.locator('#editorial-work ul[aria-hidden]')).toHaveCount(0);
  expect(videos).toEqual([]);
  const audit = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(audit.violations).toEqual([]);
});

test("Previews play only on hover, never with motion paused, and a full film opens with keyboard return", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route);
  await expect(page.locator('[data-editorial]')).toHaveAttribute('data-editorial-animated','true');
  expect(await page.locator('video[data-editorial-loop][src]').count()).toBe(0);
  await expect(page.getByRole('link', { name: 'clique' })).toHaveCount(1);
  await toGrid(page);
  await page.waitForTimeout(900);
  // The cards show the top of each site; nothing plays until the pointer is on a card.
  const playing = () => page.locator('#editorial-work video[data-editorial-loop][src]').evaluateAll(nodes => nodes.filter(node => !(node as HTMLVideoElement).paused).length);
  expect(await playing()).toBe(0);
  const first = page.locator(projects).getByRole('button').first();
  await first.hover();
  await expect.poll(playing).toBe(1);
  expect(await page.locator('#editorial-work video[data-editorial-loop][src]').first().getAttribute('src')).toMatch(/^\/videos\/projects\/.*-loop\.mp4$/);
  await page.mouse.move(4, 4);
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
  await toGrid(page);
  await page.locator(projects).getByRole('button').first().hover();
  await page.waitForTimeout(800);
  expect(await page.locator('video[data-editorial-loop][src]').count()).toBe(0);
});

test("No JavaScript retains original content, projects and contact without script-driven pinning", async ({ browser }) => {
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.goto(route);
  await expect(page.locator(`${projects} > li[data-work]`)).toHaveCount(16);
  await expect(page.locator(projects).locator('a[href$=".mp4"]')).toHaveCount(16);
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

test('The dot opens the folder, the projects follow in a still grid, and pause restores readable geometry', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route);
  await expect(page.locator('[data-editorial]')).toHaveAttribute('data-editorial-animated', 'true');
  const work = page.locator('#editorial-work');
  const at = async (fraction: number) => {
    await work.evaluate((el, f) => scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight * f, behavior: 'instant' }), fraction);
    await page.waitForTimeout(1300);
  };
  const dot = () => page.locator('[data-pasta-dot]').evaluate(el => getComputedStyle(el).visibility);
  // Before the section enters, the dot has not landed on the tab; once the folder is open it has.
  await at(1.2);
  expect(await dot()).toBe('hidden');
  await at(.1);
  expect(await dot()).toBe('visible');
  // The grid is still: the first card does not move while the visitor reads.
  await toGrid(page);
  await page.waitForTimeout(1200);
  const first = page.locator(`${projects} > li[data-work]`).first();
  const before = await first.evaluate(el => el.getBoundingClientRect().left);
  await page.waitForTimeout(1200);
  expect(await first.evaluate(el => el.getBoundingClientRect().left)).toBe(before);
  expect(await first.evaluate(el => Number(getComputedStyle(el).opacity))).toBe(1);
  // Reduced motion gives the still page with the phrase and its link.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('[data-editorial]')).not.toHaveAttribute('data-editorial-animated', 'true');
  await expect(page.locator('[data-hook] > h2')).toHaveCount(1);
  await expect(page.locator('[data-hook] > h2 a')).toBeVisible();
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

test('Mobile motion control sits inside the menu, which still fits the screen, and the top has only a soft red edge', async ({ page }) => {
  // 22/11/2026: the motion is continuous again by the user's choice, so the page-wide pause is back (WCAG 2.2.2).
  // 24/11/2026: the control is the last item of the menu pill, no longer a round button beside it.
  for (const width of [320, 360, 390]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(route);
    const control = page.locator('[data-editorial-nav] nav').getByRole('button', { name: 'Pausar movimento' });
    await expect(control).toBeVisible();
    const pill = await page.locator('[data-editorial-nav] nav').boundingBox();
    const button = await control.boundingBox();
    expect(pill && button && button.x >= pill.x && button.x + button.width <= pill.x + pill.width + 1).toBe(true);
    expect(pill!.x + pill!.width).toBeLessThanOrEqual(width);
    expect(button!.width).toBeGreaterThanOrEqual(44);
    expect(button!.height).toBeGreaterThanOrEqual(44);
    // Soft red edge on phones (22/11/2026): present, but faint (no alpha above 0.25).
    const shadow = await page.locator('[data-frame-glow]').evaluate(el => getComputedStyle(el).boxShadow);
    const alphas = [...shadow.matchAll(/rgba\([^)]*,\s*([\d.]+)\)/g)].map(m => +m[1]);
    expect(alphas.length).toBeGreaterThan(0);
    expect(Math.max(...alphas)).toBeLessThanOrEqual(.25);
  }
  // The other photo sections keep the full frame on phones: the footer shows it strong, and actually shown.
  await page.locator('#editorial-footer').evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY, behavior: 'instant' }));
  await expect.poll(async () => page.locator('[data-frame-glow]').evaluate(el => {
    const s = getComputedStyle(el);
    return Math.max(...[...s.boxShadow.matchAll(/rgba\([^)]*,\s*([\d.]+)\)/g)].map(m => +m[1])) * +s.opacity;
  })).toBeGreaterThan(.4);
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
  for (const name of ['Cerne Implantes', 'Lume Psicologia', 'Arrimo Advocacia Previdenciária', 'Casa Brisa', 'Vão Arquitetura e Interiores', 'Lavra Joalheria', 'Ponte Escola Bilíngue', 'Aura', 'Nítida', 'Fio', 'Elo', 'Eixo Ortopedia', 'Paddock', 'Talhão Advocacia do Agro', 'Sutil Cirurgia Plástica', 'Orla']) {
    await expect(page.locator(`${projects} h3`, { hasText: name })).toHaveCount(1);
  }
  // No font name or colour swatches on the cards since 24/11/2026: the benefit is the card's message.
  await expect(page.locator(`${projects} dl`)).toHaveCount(0);
  // Each brand has its film; only the eight featured ones also link to their site, in a new tab (24/11/2026).
  const sites = page.locator(`${projects} a[href^="/modelos/"], ${projects} a[href^="/propostas/"]`);
  await expect(sites).toHaveCount(8);
  for (const link of await sites.all()) { await expect(link).toHaveAttribute('target', '_blank'); await expect(link).toHaveAttribute('rel', /noopener/); }
  await expect(page.locator(`${projects} li[data-more] a[href^="/modelos/"]`)).toHaveCount(0);
  // Eight featured projects; the rest open under "Ver mais", with no count (24/11/2026: a selection, not everything).
  const more = page.locator('[data-more-toggle]:visible');
  await expect(more).toHaveText('Ver mais');
  await expect(page.locator(`${projects} > li[data-work]:visible`)).toHaveCount(8);
  await more.click();
  await expect(page.locator(`${projects} > li[data-work]:visible`)).toHaveCount(16);
  await expect(more).toHaveText('Mostrar menos');
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
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(600);
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
    { path: "/pt-pt", lang: "pt-PT", title: /Sites para clínicas, escritórios e negócios premium/, hook: "Do primeiro olhar ao próximo clique, e daí" },
    { path: "/en", lang: "en", title: /Websites for clinics/, hook: "From first glance" },
    { path: "/es", lang: "es", title: /páginas web para clínicas/, hook: "De la primera mirada" },
  ];
  for (const item of pages) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(item.path);
    await expect(page).toHaveTitle(item.title);
    await expect(page.locator("html")).toHaveAttribute("lang", item.lang);
    await expect(page.locator("[data-hook] > h2")).toHaveAttribute("aria-label", new RegExp(`^${item.hook}`));
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

test('A scroll guide comes back whenever the visitor stops: down the page, sideways over the phone project row', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route);
  const guide = page.locator('[data-scroll-guide]');
  const stopAt = async (selector: string) => {
    await page.locator(selector).first().evaluate(el => { const r = el.getBoundingClientRect(); scrollTo({ top: r.top + scrollY - Math.max(80, (innerHeight - r.height) / 2), behavior: 'instant' }); });
    await page.waitForTimeout(3000);
  };
  // Never over the top (23/11/2026, the user's decision).
  await page.waitForTimeout(6000);
  await expect(guide).toHaveAttribute('data-scroll-guide', 'off');
  await stopAt('[data-strip] ul');
  await expect(guide).toHaveAttribute('data-scroll-guide', 'side');
  await expect(guide).toHaveText('Deslize para o lado');
  await stopAt('[data-read-list]');
  await expect(guide).toHaveAttribute('data-scroll-guide', 'down');
  await expect(guide).toHaveText('Deslize para continuar');
  // A scroll sends it away (a plain scroll: a wheel would start the smooth scroller and fight the jumps below).
  await page.evaluate(() => scrollBy({ top: 120, behavior: 'instant' }));
  await expect(guide).toHaveAttribute('data-scroll-guide', 'off');
  await stopAt('#editorial-contact');
  await expect(guide).toHaveAttribute('data-scroll-guide', 'off');
});

test('The diagnosis suggests where to start and opens the conversation with the answers, without moving the page', async ({ page, browser }) => {
  await page.setViewportSize({ width: 1536, height: 696 });
  await page.goto(route);
  const quiz = page.locator('[data-diagnosis]');
  await quiz.scrollIntoViewIfNeeded();
  const before = await quiz.evaluate(el => (el as HTMLElement).offsetHeight);
  await quiz.getByRole('button', { name: 'Escritório de advocacia' }).click();
  await expect(quiz).toHaveAttribute('data-diagnosis-step', '2');
  await quiz.getByRole('button', { name: 'Ainda não tenho site' }).click();
  await expect(quiz).toHaveAttribute('data-diagnosis-step', '3');
  await expect(page.locator(':focus')).toHaveText('Um site com a identidade do seu negócio');
  const talk = quiz.getByRole('link', { name: /Conversar sobre isso/ });
  await expect(talk).toHaveAttribute('data-track-place', 'diagnostico');
  const message = decodeURIComponent((await talk.getAttribute('href'))!.split('text=')[1]);
  expect(message).toContain('Tenho um escritório de advocacia. Ainda não tenho site.');
  expect(await quiz.evaluate(el => (el as HTMLElement).offsetHeight)).toBe(before);
  await quiz.getByRole('button', { name: 'Refazer' }).click();
  await expect(quiz).toHaveAttribute('data-diagnosis-step', '1');
  expect((await new AxeBuilder({ page }).include('[data-diagnosis]').withTags(['wcag2a', 'wcag2aa']).analyze()).violations).toEqual([]);
  // Without JavaScript the old "Sob medida" invitation is there instead.
  const context = await browser.newContext({ javaScriptEnabled: false });
  const still = await context.newPage();
  await still.goto(route);
  await expect(still.locator('[data-diagnosis] a[href*="wa.me"]').filter({ hasText: 'Sob medida.' })).toBeVisible();
  await context.close();
});

test('On a phone every film opens in its vertical cut, as large as the screen allows', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route);
  for (const name of ['Paddock', 'Aura', 'Orla']) {
    // Paddock and Orla are under "Ver mais" since 24/11/2026; it opens once and stays open.
    if (name === 'Paddock') await page.locator('[data-more-toggle]:visible').click();
    await page.getByRole('button', { name: new RegExp(`: ${name}$`) }).click();
    const video = page.locator('dialog[open] video');
    await video.evaluate(v => { (v as HTMLVideoElement).muted = true; return (v as HTMLVideoElement).play().catch(() => {}); });
    await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).videoHeight > (v as HTMLVideoElement).videoWidth)).toBe(true);
    expect(await video.evaluate(v => v.getBoundingClientRect().width)).toBeGreaterThan(340);
    await page.keyboard.press('Escape');
  }
});

// "Ver mais" on phones (24/11/2026): the last card of the swipe row, and the rest joins the same row.
test('On a phone "Ver mais" is the last card of the project row and opens the rest in the same row', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route);
  const row = page.locator(projects);
  const card = row.locator('> li:last-child [data-more-toggle=card]');
  await expect(card).toHaveText('Ver mais');
  await expect(page.locator('[data-more-toggle=button]')).toBeHidden();
  await expect(row.locator('> li[data-work]:visible')).toHaveCount(8);
  // The card sits on the same line as the projects, to the right of the eighth.
  const [eighth, last] = [await row.locator('> li[data-work]').nth(7).boundingBox(), await row.locator('> li:last-child').boundingBox()];
  expect(Math.abs(last!.y - eighth!.y)).toBeLessThan(4);
  expect(last!.x).toBeGreaterThan(eighth!.x);
  await card.click();
  await expect(row.locator('> li[data-work]:visible')).toHaveCount(16);
  await expect(card).toHaveText('Mostrar menos');
  await expect(card).toHaveAttribute('aria-expanded', 'true');
});
// Price anchor (24/11/2026): "a partir de R$ 3.000" only in Brazilian Portuguese; the other languages keep the range
// in the first conversation (another market and another currency).
test('Only the Brazilian homepage answers the price question with "a partir de R$ 3.000"', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#editorial-faq')).toContainText('A partir de R$ 3.000 por um site de uma página.');
  for (const path of ['/pt-pt', '/en', '/es']) {
    await page.goto(path);
    await expect(page.locator('#editorial-faq')).not.toContainText('R$');
  }
});