import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Landing page for clinics (lib/clinics.ts): result first, proof in the first screen, one call (WhatsApp), no price.
test("The clinics page leads with the result, shows four clinic projects and calls only on WhatsApp", async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 696 });
  await page.goto("/clinicas");
  await expect(page).toHaveTitle(/Sites para clínicas/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/paciente certo confiar na sua clínica/);
  await expect(page.locator("#clinicas-projetos li h3")).toHaveText(["Lume Psicologia", "Sutil Cirurgia Plástica", "Forma Odontologia", "Aura"]);
  // The projects share the first screen with the promise on computers.
  expect(await page.locator("#clinicas-projetos li").first().evaluate(el => el.getBoundingClientRect().top < innerHeight)).toBe(true);
  for (const place of ["clinicas-menu", "clinicas-topo", "clinicas-investimento", "clinicas-final"]) {
    await expect(page.locator(`a[data-track-place="${place}"]`)).toHaveAttribute("href", /wa\.me\/5538998267717/);
  }
  await expect(page.locator("main")).not.toContainText(/R\$|reais|depoimento/i);
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(audit.violations.map(v => v.id)).toEqual([]);
});

test("The clinics page fits a 360 px phone and opens a film with the call outside it", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/clinicas");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator("#clinicas-projetos li").first().getByRole("button").click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link")).toHaveAttribute("href", /wa\.me\/5538998267717/);
});
