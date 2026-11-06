import { test,expect } from '@playwright/test';

test('Final comparison supports keyboard, mouse and mobile without replacing the scroll chapter',async({page,browser})=>{
 await page.goto('/propostas/aura');
 const comparison=page.locator('[data-aura-comparator]'), slider=comparison.getByRole('slider');
 await comparison.scrollIntoViewIfNeeded();
 await slider.focus(); await slider.press('Home');
 await expect(slider).toHaveValue('0');
 await expect.poll(()=>comparison.locator('[data-comparison-reveal]').getAttribute('style')).toContain('100%');
 await slider.press('End'); await expect(slider).toHaveValue('100');
 const box=(await slider.boundingBox())!;
 await page.mouse.move(box.x+box.width*.5,box.y+box.height*.5);await page.mouse.down();await page.mouse.move(box.x+box.width*.2,box.y+box.height*.5);await page.mouse.up();
 expect(Number(await slider.inputValue())).toBeLessThan(30);
 await page.setViewportSize({width:390,height:844});
 await comparison.scrollIntoViewIfNeeded();await expect(slider).toBeInViewport();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await expect(page.locator('[data-photo-copy]')).toHaveCount(5);
 const mobileContext=await browser.newContext({hasTouch:true,viewport:{width:390,height:844}});
 const mobile=await mobileContext.newPage();await mobile.goto('http://127.0.0.1:3107/propostas/aura');
 const touchSlider=mobile.locator('[data-aura-comparator]').getByRole('slider');await touchSlider.scrollIntoViewIfNeeded();
 const touchBox=(await touchSlider.boundingBox())!;
 await mobile.touchscreen.tap(touchBox.x+touchBox.width*.8,touchBox.y+touchBox.height*.5);
 expect(Number(await touchSlider.inputValue())).toBeGreaterThan(70);
 await mobileContext.close();
});

test('Portfolio presents Aura as one video among six projects without a landing-page link',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.signature-work-card')).toHaveCount(6);
 const card=page.locator('[data-aura-video-project]'),video=card.locator('video');
 await expect(card.getByRole('heading',{name:'Aura',exact:true})).toBeVisible();
 await expect(card.getByRole('link')).toHaveCount(0);
 await expect(video).toHaveAttribute('preload','none');
 await expect(video).toHaveAttribute('controls','');
 await expect(video.locator('source')).toHaveAttribute('src','/videos/projects/aura-showcase.mp4');
 const response=await page.request.get('/videos/projects/aura-showcase.mp4');expect(response.status()).toBe(200);
 await video.evaluate(v=>(v as HTMLVideoElement).load());
 await expect.poll(()=>video.evaluate(v=>(v as HTMLVideoElement).readyState)).toBeGreaterThan(0);
 expect(await video.evaluate(v=>(v as HTMLVideoElement).duration)).toBeGreaterThan(10);
});


test('Scroll sweeps to all-before then all-after and preserves manual adjustment until further scroll',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto('/propostas/aura');
 const section=page.locator('[data-aura-comparator]'),slider=section.getByRole('slider');
 await expect(section).toHaveAttribute('data-comparison-animated','true');
 await expect(page.locator('[data-photo-track]')).toHaveAttribute('data-sequence-animated','true');
 const g=await section.evaluate(el=>({top:el.getBoundingClientRect().top+scrollY,travel:(el as HTMLElement).offsetHeight-innerHeight}));
 const at=async(p:number)=>page.evaluate(y=>scrollTo(0,y),g.top+g.travel*p);
 await at(.34);await expect(slider).toHaveValue('0');await expect(slider).toBeInViewport();
 await at(.95);await expect(slider).toHaveValue('100');await expect(slider).toBeInViewport();
 await slider.focus();await slider.press('Home');await slider.press('ArrowRight');
 const manual=await slider.inputValue();await page.waitForTimeout(600);await expect(slider).toHaveValue(manual);
 await at(.8);await expect.poll(async()=>Number(await slider.inputValue())).toBeGreaterThan(80);
 await at(.34);await expect(slider).toHaveValue('0');
 await page.emulateMedia({reducedMotion:'reduce'});await expect(section).not.toHaveAttribute('data-comparison-animated','true');
 await slider.press('End');await expect(slider).toHaveValue('100');
});
