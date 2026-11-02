import { test, expect } from "@playwright/test";
test.use({ video: "on" });
for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
 test(`signature visual evidence ${viewport.width}px`,async({page},testInfo)=>{
 await page.setViewportSize(viewport);await page.goto("/");await page.evaluate(()=>document.fonts.ready);
 await expect.poll(()=>page.locator(".signature-photo img").evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
 for(const theme of ["Dia","Noite"]){await page.getByRole("button",{name:theme,exact:true}).click();await page.waitForTimeout(500);await testInfo.attach(`abertura-${theme}`,{body:await page.screenshot(),contentType:"image/png"})}
 const top=await page.locator("#portfolio").evaluate(el=>el.getBoundingClientRect().top+scrollY);
 for(let i=1;i<=22;i++){await page.evaluate(y=>scrollTo({top:y,behavior:"instant"}),top*i/22);await page.waitForTimeout(60)}
 await page.locator(".signature-work-card img").first().evaluate((img:HTMLImageElement)=>img.decode());
 await testInfo.attach("projetos",{body:await page.screenshot(),contentType:"image/png"});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
}
