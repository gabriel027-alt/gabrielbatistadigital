import { expect, test } from "@playwright/test";
import { brandKits } from "../../lib/brand-kits";

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
