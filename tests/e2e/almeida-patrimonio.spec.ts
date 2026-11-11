import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const dashOffset = (page: Page, selector: string) => page.locator(selector).first().evaluate(el => Number(el.getAttribute("stroke-dashoffset")));
const opacity = (page: Page, selector: string) => page.locator(selector).first().evaluate(el => Number(getComputedStyle(el).opacity));

test("Almeida signature: the estate is drawn from the assets down to the heirs, and plays back", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/modelos/patrimonio");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Inventário e planejamento sucessório conduzidos com clareza.");
  await expect(page.locator('[data-model="almeida"]')).toHaveAttribute("data-brand-animated", "true");
  const g = await page.locator("[data-almeida-partition]").evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, travel: (el as HTMLElement).offsetHeight - innerHeight }));
  expect(g.travel).toBeGreaterThan(2000);
  // A refresh while assets load can restore the previous position: scroll again while waiting.
  const at = (progress: number, read: () => Promise<number>) => async () => { await page.evaluate(y => scrollTo(0, y), g.top + g.travel * progress); return read(); };
  const visibleStep = () => page.locator("[data-partition-step]").evaluateAll(items => items.findIndex(item => Number(getComputedStyle(item).opacity) > .9));

  await expect.poll(at(.1, visibleStep)).toBe(0);
  expect(await dashOffset(page, "[data-tree-trunk]")).toBeGreaterThan(.9);
  await expect.poll(at(.3, () => opacity(page, "[data-tree-asset]"))).toBeGreaterThan(.95);
  await expect.poll(at(.5, () => dashOffset(page, "[data-tree-trunk]"))).toBeLessThan(.05);
  await expect.poll(at(.5, visibleStep)).toBe(2);
  await expect.poll(at(1, () => dashOffset(page, "[data-tree-branch]"))).toBeLessThan(.05);
  await expect.poll(at(1, () => opacity(page, "[data-tree-heirs]"))).toBeGreaterThan(.95);
  await expect.poll(at(1, visibleStep)).toBe(4);
  await expect.poll(at(-.3, () => dashOffset(page, "[data-tree-branch]"))).toBeGreaterThan(.9);

  await page.getByRole("button", { name: "Pausar animações" }).click();
  await expect(page.locator('[data-model="almeida"]')).not.toHaveAttribute("data-brand-animated", "true");
  expect(await opacity(page, "[data-tree-heirs]")).toBe(1);
  expect(errors).toEqual([]);
});

test("Almeida keeps the conversion skeleton, legal care and a local contact flow", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  const response = await page.goto("/modelos/patrimonio");
  expect(response?.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator(".model-notice, .model-hero, .brand-story")).toHaveCount(0);
  expect((await page.locator("#almeida-inicio img").boundingBox())!.width).toBeGreaterThan(1400);
  await expect(page.locator("#inventario article")).toHaveCount(3);
  await expect(page.getByText("§ 1")).toBeVisible();
  await expect(page.getByRole("img", { name: /Ilustração da partilha/ })).toBeVisible();
  await expect(page.locator("[data-partition-step]")).toHaveCount(5);
  await expect(page.locator("#atuacao li")).toHaveCount(4);
  await page.locator("#atuacao summary").first().click();
  await expect(page.locator("#atuacao details").first()).toHaveAttribute("open", "");

  // Legal advertising: informative, no promises of result; no WhatsApp inside the brand.
  const text = (await page.locator("main").innerText()).toLowerCase();
  for (const promise of ["garantimos", "resultado garantido", "100%", "sem conflitos"]) expect(text).not.toContain(promise);
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);

  expect(await page.locator('a[href="#almeida-interesse"]').count()).toBeGreaterThanOrEqual(5);
  await page.getByRole("link", { name: "Tirar minhas dúvidas" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByText("Preciso abrir um inventário").click();
  await dialog.getByRole("button", { name: "Continuar" }).click();
  await dialog.getByText("Online", { exact: true }).click();
  await dialog.getByText("Esta semana").click();
  await dialog.getByRole("button", { name: "Ver meu resumo" }).click();
  await expect(dialog.getByRole("heading", { name: "Sua conversa, preparada." })).toBeVisible();
  // The owner asked for no demo notices inside the brand: no "nothing is sent" line, no "demonstração" in the footer.
  await expect(dialog).not.toContainText("Nada é enviado");
  await expect(page.locator("footer")).not.toContainText("demonstra");
  await dialog.getByRole("button", { name: "Voltar ao site" }).click();

  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
});

test("Almeida keeps its content without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/modelos/patrimonio");
  await expect(page.getByRole("img", { name: /Ilustração da partilha/ })).toBeVisible();
  for (const name of ["Inventário", "Planejamento sucessório", "Partilha e acordos", "Testamentos"]) await expect(page.locator("#atuacao summary").filter({ hasText: name })).toBeVisible();
  await expect(page.getByText("A divisão é formalizada")).toBeVisible();
  await context.close();
});
