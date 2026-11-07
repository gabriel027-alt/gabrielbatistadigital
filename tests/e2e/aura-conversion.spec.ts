import { test,expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Aura stays in its own brand voice and keeps agency sales outside the film',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/propostas/aura');
 const closing=page.locator('#aura-avaliacao');await closing.scrollIntoViewIfNeeded();
 await expect(closing.getByRole('heading',{name:'A harmonia está no conjunto.'})).toBeVisible();
 await expect(closing.getByRole('link',{name:'Rever a comparação'})).toHaveAttribute('href','#aura-comparacao');
 await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
 await expect(page.getByText(/Falar sobre meu site|Seu site pode apresentar|O que precisamos para começar/)).toHaveCount(0);
 await expect(page.getByRole('link',{name:/agendar|marcar consulta/i})).toHaveCount(0);
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
