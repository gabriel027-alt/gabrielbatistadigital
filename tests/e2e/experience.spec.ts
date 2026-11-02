import { test, expect } from "@playwright/test";
test("signature opening preserves portrait and explicit contact in both themes",async({page})=>{
 await page.goto("/");
 const image=page.locator(".signature-photo img");
 await expect.poll(()=>image.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
 const source=await image.getAttribute("src");
 for(const theme of ["Dia","Noite"]){await page.getByRole("button",{name:theme,exact:true}).click();await expect(page.getByRole("button",{name:theme,exact:true})).toHaveAttribute("aria-pressed","true");await expect(image).toHaveAttribute("src",source!)}
 await expect(page.getByRole("link",{name:"Vamos criar seu site",exact:true})).toHaveAttribute("href",/wa.me\/5538998267717/);
 await expect(page.locator(".signature-photo canvas,.signature-photo video")).toHaveCount(0);
});
test("work motion pauses and reduced motion keeps every project accessible",async({page})=>{
 await page.goto("/");await page.locator("#portfolio").scrollIntoViewIfNeeded();
 const card=page.locator(".signature-work-card").first();
 await page.getByRole("button",{name:"Pausar animações"}).click();
 const shift=await card.evaluate(el=>(el as HTMLElement).style.getPropertyValue("--work-shift"));
 await page.mouse.wheel(0,200);await page.waitForTimeout(150);
 expect(await card.evaluate(el=>(el as HTMLElement).style.getPropertyValue("--work-shift"))).toBe(shift);
 await page.emulateMedia({reducedMotion:"reduce"});
 await expect.poll(()=>card.locator(".signature-work-window").evaluate(el=>getComputedStyle(el).transform)).toBe("none");
 for(const width of [360,768,1440]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)}
});
test("no generated poses are loaded and projects precede service explanations",async({page})=>{
 const requests:string[]=[];page.on("request",r=>requests.push(r.url()));await page.goto("/");
 await expect(page.locator(".signature-work-card")).toHaveCount(6);
 expect(requests.filter(url=>url.includes("/hero/frames/")||url.endsWith(".mp4"))).toEqual([]);
 expect(await page.locator("#portfolio").evaluate(el=>!!(el.compareDocumentPosition(document.querySelector("#servicos")!)&Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
 await expect(page.locator("#inicio")).not.toContainText("FICTÍCIAS");
});
test("portrait, offer, catalogue and contact remain available without JavaScript",async({browser})=>{
 const c=await browser.newContext({javaScriptEnabled:false});const page=await c.newPage();await page.goto("/");
 await expect(page.locator(".signature-photo img")).toBeVisible();await expect(page.locator("h1")).toBeVisible();
 await expect(page.getByRole("link",{name:"Vamos criar seu site",exact:true})).toHaveAttribute("href",/wa.me/);
 await page.locator("#modelos > summary").click();await expect(page.locator(".niche-preview-card")).toHaveCount(17);await expect(page.locator(".niche-preview-card").first()).toBeVisible();await c.close();
});
