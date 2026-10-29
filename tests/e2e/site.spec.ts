import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const sections = [
  "inicio",
  "manifesto",
  "servicos",
  "portfolio",
  "processo",
  "sobre",
  "integracoes",
  "contato",
];
const demos = ["chronos-atelier", "vanguard", "aura-aesthetics"];
test("full page, real anchor targets and official WhatsApp only", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveCount(1);
  for (const id of sections)
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  await expect(page.locator(".project-card")).toHaveCount(3);
  const missing = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .map((a) => a.getAttribute("href")!.slice(1))
        .filter((id) => !document.getElementById(id)),
    );
  expect(missing).toEqual([]);
  const urls = await page
    .locator('a[href^="https:"]')
    .evaluateAll((links) => links.map((a) => a.getAttribute("href")!));
  expect(urls.length).toBeGreaterThan(5);
  for (const url of urls) {
    expect(new URL(url).origin + new URL(url).pathname).toBe(
      "https://wa.me/5538998267717",
    );
  }
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});
test("services and carousel keyboard interaction", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: /SEO Local/ }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Seja encontrado");
  await page.getByRole("tab", { name: /SEO Local/ }).press("ArrowRight");
  await expect(page.getByRole("tab", { name: /Performance/ })).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("O próximo nível");
  await page.getByRole("tab", { name: /Performance/ }).press("Home");
  await expect(page.getByRole("tab", { name: /Landing Pages/ })).toBeFocused();
  const carousel = page.getByRole("region", { name: "Projetos conceituais" });
  await carousel.focus();
  await carousel.press("ArrowRight");
  await expect
    .poll(() => carousel.evaluate((e) => e.scrollLeft))
    .toBeGreaterThan(10);
  await carousel.press("Space");
  await expect(
    page.getByRole("button", { name: "Pausar movimento do portfólio" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Pausar movimento do portfólio" })
    .click();
});
test("theme persistence, responsive layouts and mobile menu", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page
    .getByRole("button", { name: "Dia", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow at ${width}`,
    ).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await expect(
    page.getByRole("navigation", { name: "Navegação móvel" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Abrir menu" })).toBeFocused();
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await page
    .getByRole("navigation", { name: "Navegação móvel" })
    .getByRole("link", { name: "Projetos" })
    .click();
  await expect(
    page.getByRole("button", { name: "Abrir menu" }),
  ).toHaveAttribute("aria-expanded", "false");
});
test("diagnosis maps answers and encodes a WhatsApp summary", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Descobrir meu próximo passo" })
    .click();
  await expect(page.getByRole("button", { name: "Continuar" })).toBeDisabled();
  await page
    .getByLabel("Melhorar minha presença nas buscas", { exact: true })
    .check();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByLabel("Sim, mas precisa evoluir", { exact: true }).check();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByLabel("Tenho uma demanda definida", { exact: true }).check();
  await page.getByRole("button", { name: "Ver orientação" }).click();
  await expect(page.locator(".diagnosis h3")).toHaveText("SEO Local");
  const href = await page
    .getByRole("link", { name: "Levar contexto ao WhatsApp" })
    .getAttribute("href");
  const url = new URL(href!);
  expect(url.pathname).toBe("/5538998267717");
  expect(url.searchParams.get("text")).toContain("Tenho uma demanda definida");
  expect(url.searchParams.get("text")).toContain(
    "Melhorar minha presença nas buscas",
  );
  await page.getByRole("button", { name: "Recomeçar" }).click();
  await expect(page.locator(".diagnosis h3")).toContainText("começamos");
});
test("all concept demos, detail navigation and valid metadata", async ({
  page,
}) => {
  for (const slug of demos) {
    const response = await page.goto(`/conceitos/${slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(
      page.getByText("PROTÓTIPO CONCEITUAL · MARCA FICTÍCIA"),
    ).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    const missing = await page
      .locator('a[href^="#"]')
      .evaluateAll((links) =>
        links
          .map((a) => a.getAttribute("href")!.slice(1))
          .filter((id) => !document.getElementById(id)),
      );
    expect(missing).toEqual([]);
    for (const width of [360, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${slug} overflow ${width}`,
      ).toBe(true);
    }
    const accessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(accessibility.violations, `Accessibility of ${slug}`).toEqual([]);
    await page.locator(".demo-item").first().click();
    await expect(page).toHaveURL(/#detalhe-0$/);
    await page.getByRole("link", { name: "Voltar ao portfólio" }).click();
    await expect(page).toHaveURL(/\/#portfolio$/);
  }
});
test("accessible homepage in both themes and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Iniciar movimento do portfólio" }),
  ).toBeDisabled();
  for (const theme of ["dark", "light"]) {
    if (theme === "light")
      await page
        .getByRole("button", { name: "Dia", exact: true })
        .click();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations,
      JSON.stringify(
        results.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ),
    ).toEqual([]);
  }
});
test("SEO routes, disabled optional API, 404 and security headers", async ({
  request,
}) => {
  const home = await request.get("/");
  expect(home.headers()["x-content-type-options"]).toBe("nosniff");
  expect((await request.get("/robots.txt")).status()).toBe(200);
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("gabrielbatistadigital.com.br");
  expect(await sitemap.text()).not.toContain("/conceitos/");
  const image = await request.get("/opengraph-image");
  expect(image.headers()["content-type"]).toContain("image/png");
  expect((await request.get("/api/chat")).status()).toBe(404);
  expect((await request.get("/pagina-inexistente")).status()).toBe(404);
});

test("product-led service previews, vertical navigation and accessible panels", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const list = page.getByRole("tablist", { name: "Especialidades da agência" });
  await expect(list).toHaveAttribute("aria-orientation", "vertical");
  const first = page.getByRole("tab", { name: /Landing Pages/ });
  await first.focus();
  await first.press("ArrowDown");
  await expect(
    page.getByRole("tab", { name: /Sites Institucionais/ }),
  ).toBeFocused();
  for (const name of [
    "Landing Pages",
    "Sites Institucionais",
    "Sistemas & Integrações",
    "SEO Local",
    "Performance & Evolução",
  ]) {
    await page.getByRole("tab", { name: new RegExp(name) }).click();
    const panel = page.getByRole("tabpanel");
    await expect(panel.locator(".service-product-preview")).toHaveCount(1);
    await expect(
      panel.getByRole("link", { name: "Conversar sobre este serviço" }),
    ).toHaveAttribute("href", /wa\.me\/5538998267717/);
    const result = await new AxeBuilder({ page })
      .include("#service-panel")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations, `Accessibility: ${name}`).toEqual([]);
  }
  await first.click();
  const image = page.getByRole("tabpanel").locator("img");
  await image.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      image.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
    )
    .toBe(true);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(list).toHaveAttribute("aria-orientation", "horizontal");
  for (const name of [
    "Landing Pages",
    "Sites Institucionais",
    "Sistemas & Integrações",
    "SEO Local",
    "Performance & Evolução",
  ]) {
    await page.getByRole("tab", { name }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      name,
    ).toBe(true);
  }
});
