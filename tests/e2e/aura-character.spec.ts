import { test, expect } from "@playwright/test";

test("The old avatar route opens the photographic chapter",async({page})=>{
 await page.goto('/propostas/aura/personagem');
 await expect(page).toHaveURL(/\/propostas\/aura#aura-olhar$/);
 await expect(page.getByRole('heading',{name:'O seu rosto. Por inteiro.'})).toBeVisible();
 await expect(page.locator('[data-photo-camera]')).toHaveCount(1);
});

test("A missing camera image keeps a readable static alternative",async({page})=>{
 await page.route('**/images/aura-sequence/continuous-portrait.webp',r=>r.abort());
 await page.goto('/propostas/aura');
 const source=page.locator('[data-camera-source]');
 await source.scrollIntoViewIfNeeded();
 await expect(source).toHaveAttribute('data-camera-fallback','true');
 await expect.poll(()=>source.evaluate(el=>(el as HTMLImageElement).naturalWidth)).toBeGreaterThan(1000);
 await expect(page.locator('[data-photo-track]')).not.toHaveAttribute('data-sequence-animated','true');
 await expect(page.getByRole('heading',{name:'Zigomático.'})).toBeVisible();
});
