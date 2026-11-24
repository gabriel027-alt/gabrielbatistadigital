import { expect, test } from "@playwright/test";
import { brandKits, heroLayouts } from "../../lib/brand-kits";

// Design system, anti-repetition registry: brands may share the foundation, never the identity.
test("Brand kits never share identity fields", () => {
  const fields = ["mark", "material", "photo", "signatureGraphic", "signatureMotion", "hero"] as const;
  for (const field of fields) {
    const values = brandKits.map(kit => kit[field].toLowerCase());
    expect(new Set(values).size, `campo repetido: ${field}`).toBe(values.length);
  }
  const displays = brandKits.map(kit => kit.typography.display);
  expect(new Set(displays).size, "tipografia de título repetida").toBe(displays.length);
  const palettes = brandKits.map(kit => Object.values(kit.palette).sort().join(","));
  expect(new Set(palettes).size, "paleta repetida").toBe(palettes.length);
  for (const kit of brandKits) {
    expect(Object.keys(kit.palette).length, `${kit.id}: paleta com 5 cores`).toBe(5);
    expect(kit.concept.length, `${kit.id}: conceito`).toBeGreaterThan(10);
  }
});

// The top's composition (docs/DESIGN-SYSTEM.md, "Topo e conjunto de fotos", 24/11/2026): the description text could
// differ while the layout repeated. A new brand uses a layout that at most one approved brand uses, and the title
// over an empty area of a full-screen photo is closed to new brands.
test("A new brand's top does not repeat a worn layout", () => {
  const approved = brandKits.filter(kit => kit.status === "aprovado");
  // Vanguard is the scroll proposal of 10/11/2026, older than this rule and never approved; it is not a new brand.
  const olderThanRule = ["vanguard"];
  for (const kit of brandKits) {
    expect(heroLayouts, `${kit.id}: formato fora do catálogo`).toContain(kit.heroLayout);
    if (kit.status === "aprovado" || olderThanRule.includes(kit.id)) continue;
    expect(kit.heroLayout, `${kit.id}: texto sobre foto está fechado para marcas novas`).not.toBe("texto-sobre-foto");
    const uses = approved.filter(other => other.heroLayout === kit.heroLayout).length;
    expect(uses, `${kit.id}: o formato ${kit.heroLayout} já é usado por ${uses} marcas aprovadas`).toBeLessThanOrEqual(1);
  }
});
