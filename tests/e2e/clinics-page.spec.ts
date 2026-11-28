import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Landing page for clinics (lib/clinics.ts): result first, portrait in the opening and proof below, one call (WhatsApp), and since
// 24/11/2026 a price anchor ("a partir de R$ 3.000"), never a full price table.
test("The clinics page leads with the result, shows four clinic projects and calls only on WhatsApp", async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 696 });
  await page.goto("/clinicas");
  await expect(page).toHaveTitle(/Sites para clínicas/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/paciente certo confiar na sua clínica/);
  await expect(page.locator("#clinicas-projetos li h3")).toHaveText(["Lume Psicologia", "Sutil Cirurgia Plástica", "Forma Odontologia", "Aura"]);
  // A compact portrait sits with the line about who does the work, and on a computer the projects share the first
  // screen, on the right (27/11/2026: a large portrait had pushed them below).
  await expect(page.locator("[class*=whoRow] img")).toBeVisible();
  await expect(page.locator("[class*=whoRow]")).toContainText("Eu sou Gabriel Batista");
  const projects = await page.locator("#clinicas-projetos").boundingBox();
  expect(projects!.y).toBeLessThan(696 / 2);
  expect(projects!.x).toBeGreaterThan(1536 / 2);
  for (const place of ["clinicas-menu", "clinicas-topo", "clinicas-investimento", "clinicas-final"]) {
    await expect(page.locator(`a[data-track-place="${place}"]`)).toHaveAttribute("href", /wa\.me\/5538998267717/);
  }
  await expect(page.locator("main")).not.toContainText(/depoimento/i);
  await expect(page.locator("#clinicas-investimento, main").first()).toContainText("começa em R$ 3.000");
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

test("On the clinics page the diagnosis asks only the situation and speaks of the clinic", async ({ page }) => {
  await page.goto("/clinicas");
  const quiz = page.locator("[data-diagnosis]");
  await expect(quiz).toHaveAttribute("data-diagnosis-step", "2");
  await quiz.getByRole("button", { name: "Tenho site, mas ele não parece com a minha clínica" }).click();
  await expect(page.locator(":focus")).toHaveText("Um site novo, a partir das suas fotos e da sua marca");
  const talk = quiz.getByRole("link", { name: /Conversar sobre isso/ });
  await expect(talk).toHaveAttribute("data-track-place", "clinicas-diagnostico");
  expect(decodeURIComponent((await talk.getAttribute("href"))!.split("text=")[1])).toContain("Vi a página para clínicas");
});

 test("Instagram needs reach a tracked WhatsApp conversation", async ({ page }) => {
  await page.goto("/clinicas");
  const quiz = page.locator("[data-diagnosis]");
  await quiz.getByRole("button", { name: "Preciso organizar o Instagram e criar conteúdo" }).click();
  const call = quiz.getByRole("link", { name: /Conversar sobre isso/ });
  expect(decodeURIComponent((await call.getAttribute("href"))!)).toContain("gestão de Instagram");
  await expect(call).toHaveAttribute("data-track-place", "clinicas-diagnostico");
});
