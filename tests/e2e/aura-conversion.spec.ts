import { test,expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Aura ending targets clinic owners with truthful WhatsApp contact and no clinical booking',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/propostas/aura');
 const closing=page.locator('#aura-avaliacao');
 await closing.scrollIntoViewIfNeeded();
 await expect(closing.getByRole('heading',{name:'O cuidado começa antes do primeiro contato.'})).toBeVisible();
 await expect(closing.locator('img')).toHaveCount(0);
 await expect(closing.getByRole('link',{name:'Falar sobre meu site no WhatsApp'})).toBeVisible();
 for(const anchor of await page.locator('a[href*="wa.me"]').all()){
  const url=new URL((await anchor.getAttribute('href'))!);
  expect(url.hostname).toBe('wa.me');expect(url.pathname).toBe('/5538998267717');
  expect(url.searchParams.get('text')).toContain('Gabriel');expect(url.searchParams.get('text')).toContain('site para minha clínica');
 }
 await expect(page.getByRole('link',{name:/agendar|marcar consulta/i})).toHaveCount(0);
 await closing.locator('summary').filter({hasText:'Como definimos o projeto?'}).click();
 await expect(closing.getByText('Conte qual é a sua clínica',{exact:false})).toBeVisible();
 for(const width of [360,390,768,1440,1920]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
});

test('Hero detail CTA reaches the first focus rather than returning to the top',async({page})=>{
 await page.goto('/propostas/aura');
 await expect(page.locator('[data-photo-track]')).toHaveAttribute('data-sequence-animated','true');
 await page.getByRole('link',{name:'Ver o rosto em detalhe'}).click();
 await expect(page).toHaveURL(/#aura-olhar$/);
 await expect(page.locator('[data-photo-camera]')).toHaveAttribute('data-camera','0.7300,0.5500,2.4500,0.7200');
 await expect(page.locator('[data-photo-copy]').first()).toBeVisible();
});

test('Film CTA captures the correct lead context without linking to the Aura landing',async({page})=>{
 await page.goto('/');const card=page.locator('[data-aura-video-project]');
 const link=card.getByRole('link',{name:'Quero um site para minha clínica'});
 const url=new URL((await link.getAttribute('href'))!);
 expect(url.hostname).toBe('wa.me');expect(url.pathname).toBe('/5538998267717');
 expect(url.searchParams.get('text')).toContain('filme do projeto Aura');
 await expect(card.locator('a[href*="/propostas/aura"],a[href*="/conceitos/aura"]')).toHaveCount(0);
 for(const theme of ['Dia','Noite']) { await page.getByRole('button',{name:theme,exact:true}).click();await expect(link).toBeVisible();expect((await new AxeBuilder({page}).include('[data-aura-video-project]').withTags(['wcag2a','wcag2aa']).analyze()).violations).toEqual([]); }
});
