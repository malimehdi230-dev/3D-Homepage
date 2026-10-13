const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const root=path.resolve(__dirname,'../custom extension');
const artifacts=path.resolve(__dirname,'../.test-artifacts');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
  if(req.url==='/blank.html'){res.setHeader('Content-Type','text/html');return res.end('<!doctype html><title>Migration fixture</title>');}
  const file=path.join(root,decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.setHeader('Content-Security-Policy',"script-src 'self'; object-src 'self'");res.end(fs.readFileSync(file));
});
const config={schemaVersion:1,libraryEnabled:true,libraryReady:true,aiEnabled:true,ambientEnabled:true,feedbackEnabled:true,defaultTheme:'minimal',categories:['Nature','Space'],libraryTitle:'New wallpapers',supportUrl:'https://example.test/support',announcement:{id:'collection-1',text:'A new collection is here.'},libraryPageSize:6,featuredOnly:false};
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a0qYAAAAASUVORK5CYII=','base64');
async function mock(context){
  await context.route('https://3-d-parallax-backend.vercel.app/api/config',route=>route.fulfill({json:config}));
  await context.route('https://3-d-parallax-backend.vercel.app/api/wallpapers**',route=>route.fulfill({json:{items:[{id:'remote-wallpaper',title:'From the library',category:'Nature',mime:'image/png',url:'https://files.example.test/wallpaper.png',credit:'Publisher',license:'Original artwork'}],page:1,pageSize:6,total:1}}));
  await context.route('https://files.example.test/**',route=>route.fulfill({contentType:'image/png',body:png,headers:{'Access-Control-Allow-Origin':'*'}}));
}
async function ready(page){await page.waitForFunction(()=>window.app && window.BackgroundPicker);await page.locator('#loadingScreen').waitFor({state:'hidden'});await page.waitForFunction(()=>ExtensionService.config().libraryReady);}
async function add(page,count=1){await page.evaluate(async count=>{for(let i=0;i<count;i++){const canvas=document.createElement('canvas');canvas.width=48;canvas.height=32;const ctx=canvas.getContext('2d');ctx.fillStyle=['#72897e','#606d94','#b18f7d','#8e769c','#91a686'][i%5];ctx.fillRect(0,0,48,32);const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));await Wallpaper.setFromFile(new File([blob],`Favorite ${i+1}.png`,{type:'image/png'}));}},count);}
(async()=>{
  fs.mkdirSync(path.join(artifacts,'screenshots'),{recursive:true});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const base=`http://127.0.0.1:${server.address().port}`;
  const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||chromium.executablePath()});
  let native;
  try{
    const context=await browser.newContext({viewport:{width:1440,height:900}});await mock(context);
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'/blank.html');
    await page.evaluate(async()=>{
      const blob=new Blob([new Uint8Array([1,2,3])],{type:'image/png'});
      await new Promise((resolve,reject)=>{const request=indexedDB.open('HomepageWallpaperDB',1);request.onupgradeneeded=()=>request.result.createObjectStore('wallpapers');request.onsuccess=()=>{const db=request.result,tx=db.transaction('wallpapers','readwrite');tx.objectStore('wallpapers').put(blob,'current');tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);};});
      localStorage.setItem('homepage_template','minimal');localStorage.setItem('homepage_feedback_never','true');
    });
    await page.goto(base+'/index.html');await ready(page);
    await page.waitForFunction(()=>Wallpaper.mode()==='wallpaper' && document.body.classList.contains('wallpaper-active'));
    assert.equal(await page.evaluate(async()=>(await Wallpaper.list()).length),1,'legacy file migrates once');
    await page.evaluate(()=>app.selectTemplate('nature'));
    assert.equal(await page.evaluate(()=>Wallpaper.mode()),'theme','built-in selection actually disables wallpaper');
    assert.equal(await page.evaluate(async()=>(await Wallpaper.list()).length),1,'theme switch retains collection');
    await page.reload();await ready(page);
    assert.equal(await page.evaluate(()=>Wallpaper.mode()),'theme','theme selection persists');
    await page.evaluate(async()=>{await Wallpaper.activate((await Wallpaper.list())[0].id);});
    assert.equal(await page.evaluate(()=>document.body.classList.contains('wallpaper-active')),true);
    await page.evaluate(()=>Wallpaper.clearAll());await add(page,4);
    const outcomes=await page.evaluate(async()=>{
      const canvas=document.createElement('canvas');canvas.width=48;canvas.height=32;
      const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));
      return Promise.allSettled([Wallpaper.setFromFile(blob),Wallpaper.setFromFile(blob)]).then(rows=>rows.map(x=>({status:x.status,message:x.reason?.message})));
    });
    assert.equal(outcomes.filter(x=>x.status==='fulfilled').length,1,'concurrent additions cannot exceed five');
    assert.match(outcomes.find(x=>x.status==='rejected').message,/5\/5/);
    assert.equal(await page.evaluate(async()=>(await Wallpaper.list()).length),5);
    const invalid=await page.evaluate(async()=>{try{await Wallpaper.setFromFile(new Blob(['<svg/>'],{type:'image/svg+xml'}));return false;}catch{return true;}});assert.equal(invalid,true);
    await page.evaluate(()=>Wallpaper.useTheme());
    for(const viewport of [{width:1440,height:900},{width:1920,height:1080},{width:390,height:844}]){
      await page.setViewportSize(viewport);
      const positions=await page.evaluate(()=>['.time-container','.name-container','.search-container','.links-section'].map(selector=>{const rect=document.querySelector(selector).getBoundingClientRect();return{selector,center:rect.x+rect.width/2,width:rect.width,viewport:innerWidth};}));
      for(const position of positions){assert.ok(Math.abs(position.center-viewport.width/2)<2,`${position.selector} centered at ${viewport.width}px`);assert.ok(position.width<=viewport.width,`${position.selector} fits viewport`);}
    }
    await page.setViewportSize({width:1440,height:900});await page.evaluate(()=>{WidgetCanvas.useClassic();app.updateUserName('Mehdi');});
    await page.screenshot({path:path.join(artifacts,'screenshots','centered-alignment.png'),animations:'disabled'});
    await page.evaluate(()=>BackgroundPicker.open('saved'));
    await page.waitForFunction(()=>document.querySelectorAll('#savedWallpaperGrid .saved-wallpaper').length===5);
    assert.equal(await page.locator('#savedWallpaperPanel [data-upload-wallpaper]').isDisabled(),true);
    await page.screenshot({path:path.join(artifacts,'screenshots','saved-wallpapers.png'),animations:'disabled'});
    await page.evaluate(()=>BackgroundPicker.selectTab('themes'));
    await page.screenshot({path:path.join(artifacts,'screenshots','background-themes.png'),animations:'disabled'});
    assert.equal(await page.locator('.template-card').count(),18);
    await page.evaluate(async()=>{await Wallpaper.remove((await Wallpaper.list())[0].id);});
    await page.evaluate(()=>BackgroundPicker.selectTab('library'));
    await page.locator('#wallpaperLibraryGrid .saved-wallpaper').waitFor();
    const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#wallpaperLibraryGrid button').filter({hasText:'Download'}).click()]);assert.equal(download.suggestedFilename(),'From the library.png');
    await page.locator('#wallpaperLibraryGrid button').filter({hasText:'Save & use'}).click();
    await page.waitForFunction(()=>document.querySelector('#libraryStatus').textContent.includes('Saved to'));
    assert.equal(await page.evaluate(async()=>(await Wallpaper.list()).length),5);
    await page.locator('#wallpaperLibraryGrid button').filter({hasText:'Save & use'}).click();
    await page.waitForFunction(()=>document.querySelector('#libraryStatus').textContent.includes('Saved to'));
    assert.equal(await page.evaluate(async()=>(await Wallpaper.list()).length),5,'saving same library entry reuses existing copy');
    await page.screenshot({path:path.join(artifacts,'screenshots','wallpaper-library.png'),animations:'disabled'});
    await page.keyboard.press('Escape');await page.locator('#serviceAnnouncement button').click();
    config.aiEnabled=false;config.ambientEnabled=false;config.feedbackEnabled=false;await page.evaluate(()=>ExtensionService.refresh());
    assert.equal(await page.locator('#askAiBtn').isVisible(),false);assert.equal(await page.locator('#serviceAnnouncement').count(),0);
    assert.equal(await page.evaluate(async()=>{try{await AIProviders.aiComplete([{role:'user',content:'hello'}]);return false;}catch{return true;}}),true);
    assert.equal(await page.evaluate(()=>localStorage.getItem('homepage_template')),'nature','remote defaults preserve user theme');
    assert.equal(await page.evaluate(async()=>(await Wallpaper.list()).length),5,'feature controls preserve files');
    await page.reload();await ready(page);
    assert.equal(await page.evaluate(async()=>(await Wallpaper.list()).length),5);assert.equal(await page.evaluate(()=>Wallpaper.mode()),'wallpaper');
    assert.equal(await page.evaluate(()=>document.body.classList.contains('wallpaper-active')),true);
    assert.deepEqual(errors,[]);
    await context.close();
    config.aiEnabled=true;config.ambientEnabled=true;config.feedbackEnabled=true;
    native=await chromium.launchPersistentContext(path.join(artifacts,'wallpaper-profile'),{headless:true,executablePath:process.env.BROWSER_PATH||chromium.executablePath(),viewport:{width:1440,height:900},ignoreDefaultArgs:['--disable-extensions'],args:[`--disable-extensions-except=${root}`,`--load-extension=${root}`]});await mock(native);
    const extensionPage=await native.newPage();await extensionPage.goto('chrome://newtab/');await ready(extensionPage);await extensionPage.evaluate(()=>Wallpaper.clearAll());
    await extensionPage.evaluate(()=>BackgroundPicker.open('library'));await extensionPage.locator('#wallpaperLibraryGrid .saved-wallpaper').waitFor();
    await extensionPage.locator('#wallpaperLibraryGrid button').filter({hasText:'Save & use'}).click();
    await extensionPage.waitForFunction(()=>Wallpaper.mode()==='wallpaper');
    await native.unroute('https://files.example.test/**');await native.route('https://files.example.test/**',r=>r.abort());
    await extensionPage.reload();await ready(extensionPage);
    assert.equal(await extensionPage.evaluate(async()=>!!await Wallpaper.getBlob()),true,'native extension retains downloaded file offline');
    assert.equal(await extensionPage.evaluate(()=>document.body.classList.contains('wallpaper-active')),true);
    await extensionPage.evaluate(()=>app.selectTemplate('minimal'));await extensionPage.reload();await ready(extensionPage);
    assert.equal(await extensionPage.evaluate(()=>Wallpaper.mode()),'theme');assert.equal(await extensionPage.evaluate(async()=>(await Wallpaper.list()).length),1);
    await extensionPage.evaluate(()=>Wallpaper.clearAll());assert.equal(await extensionPage.evaluate(async()=>(await Wallpaper.list()).length),0);
    console.log('PASS: legacy migration, theme/wallpaper switching, five-file persistence and concurrency, library download/import, offline native MV3 restore, centered desktop/mobile alignment, announcements and feature controls.');
  }finally{if(native)await native.close();await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exit(1);});
