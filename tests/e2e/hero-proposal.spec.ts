import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aL1sAAAAASUVORK5CYII=", "base64");

test("proposal accepts a local portrait without uploading, changing the source or breaking responsive layout", async ({ page }) => {
  const uploads: string[] = [];
  page.on("request", request => { if (request.method() === "POST" || request.method() === "PUT") uploads.push(request.url()); });
  await page.goto("/propostas/gabriel");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await page.locator('input[type="file"]').first().setInputFiles({ name: "test-only.png", mimeType: "image/png", buffer: png });
  const photo = page.getByRole("img", { name: "Retrato aprovado de Gabriel, preservado sem edição" });
  await expect(photo).toHaveAttribute("src", /^blob:/);
  await expect.poll(() => photo.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth === 1)).toBe(true);
  expect(await photo.evaluate(el => getComputedStyle(el).filter)).toBe("none");
  const source = await photo.getAttribute("src");
  for (const theme of ["Claro", "Escuro"]) {
    await page.getByRole("button", { name: theme, exact: true }).click();
    await expect(photo).toHaveAttribute("src", source!);
    await expect(page.getByRole("link", { name: "Conversar sobre meu site", exact: true })).toHaveAttribute("href", /wa.me\/5538998267717/);
  }
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}`).toBe(true);
  }
  expect(uploads).toEqual([]);
});

test("proposal empty state, theme controls and contact are accessible in both themes", async ({ page }) => {
  await page.goto("/propostas/gabriel");
  for (const theme of ["Claro", "Escuro"]) {
    await page.getByRole("button", { name: theme, exact: true }).click();
    await page.waitForTimeout(500);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations, JSON.stringify(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })))).toEqual([]);
  }
});

test("desktop reading columns remain outside a dark selected photograph in light mode", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/propostas/gabriel");
  await page.locator('input[type="file"]').first().setInputFiles({ name: "layout-test.png", mimeType: "image/png", buffer: png });
  await page.getByRole("button", { name: "Claro", exact: true }).click();
  const photo = page.getByRole("img", { name: "Retrato aprovado de Gabriel, preservado sem edição" });
  const offer = await page.locator("#proposta-conteudo").boundingBox();
  const portrait = await photo.boundingBox();
  const name = await page.getByText("GABRIEL", { exact: true }).last().boundingBox();
  expect(offer!.x + offer!.width).toBeLessThan(portrait!.x + portrait!.width * .1);
  expect(name!.x).toBeGreaterThan(portrait!.x + portrait!.width * .9);
  const height = await page.locator("section").first().evaluate(el => el.getBoundingClientRect().height);
  expect(height).toBeLessThanOrEqual(900);
});
