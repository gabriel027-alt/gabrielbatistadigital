const {chromium}=require('/workspace/gbd-envio-github/node_modules/@playwright/test');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try{
  const results=[];
  for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
   const page=await browser.newPage({viewport});const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:3168/index.html',{waitUntil:'load'});
   for(const id of ['comparison','full']){
    await page.evaluate(id=>{const v=document.getElementById(id);v.muted=true;v.play().catch(()=>{})},id);
    await page.waitForFunction(id=>document.getElementById(id).currentTime>.7,id,{timeout:15000});
    results.push(await page.evaluate(({id,viewport})=>{const v=document.getElementById(id);v.pause();return {id,viewport,time:v.currentTime,duration:v.duration,width:v.videoWidth,height:v.videoHeight,mediaError:v.error?.message??null,overflow:document.documentElement.scrollWidth>innerWidth}}, {id,viewport}));
   }
   if(errors.length)throw Error(errors.join('\n'));await page.close();
  }
  fs.writeFileSync('/workspace/library-files/tool-runtimes/avatar-motion/projected-rig/browser-checks.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
