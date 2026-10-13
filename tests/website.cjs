const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url'),{execFileSync}=require('node:child_process');
const repo=path.resolve(__dirname,'..'),root=path.join(repo,'website-dist'),artifacts=path.join(repo,'.test-artifacts/website');
(async()=>{
  execFileSync(process.execPath,[path.join(repo,'scripts/build-website.cjs')],{stdio:'pipe',windowsHide:true});fs.mkdirSync(artifacts,{recursive:true});
  const backend=path.resolve(process.env.BACKEND_REPO||path.join(repo,'../3D-Parallax-backend'));
  assert.ok(fs.existsSync(path.join(backend,'tests/catalog.fixture.js')),'Set BACKEND_REPO to the backend checkout for the complete install-link flow.');
  const {fixture}=await import(pathToFileURL(path.join(backend,'tests/catalog.fixture.js'))),f=fixture();
  const {createConfigHandler}=await import(pathToFileURL(path.join(backend,'api/config.js')));
  const {createAdminConfigHandler}=await import(pathToFileURL(path.join(backend,'api/admin/config.js')));
  const handlers={'/api/site-config':createConfigHandler(f.options),'/api/admin/config':createAdminConfigHandler(f.options)};
  const policy=JSON.parse(fs.readFileSync(path.join(repo,'vercel.json'),'utf8')).headers[0].headers.find(h=>h.key==='Content-Security-Policy').value;
  const server=http.createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost');
    if(handlers[url.pathname]){
      let raw='';for await(const chunk of req)raw+=chunk;req.body=raw||undefined;req.query=Object.fromEntries(url.searchParams);
      const response={setHeader:(k,v)=>res.setHeader(k,v),status(code){res.statusCode=code;return this;},json(value){res.setHeader('Content-Type','application/json');res.end(JSON.stringify(value));},end(){res.end();}};
      return handlers[url.pathname](req,response);
    }
    const routes={'/':'index.html','/install':'install.html','/help':'help.html','/changelog':'changelog.html','/privacy':'privacy.html'};
    const relative=routes[url.pathname]||decodeURIComponent(url.pathname).slice(1),file=path.resolve(root,relative);
    let chosen=file;if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){chosen=path.join(root,'404.html');res.statusCode=404;}
    res.setHeader('Content-Security-Policy',policy);res.setHeader('Content-Type',{'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.xml':'application/xml'}[path.extname(chosen)]||'text/plain');res.end(fs.readFileSync(chosen));
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
  const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||chromium.executablePath()});
  try{
    const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[],violations=[];
    page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(/Content Security Policy|Refused to/.test(message.text()))violations.push(message.text());});
    await page.goto(base);await page.waitForFunction(()=>document.documentElement.dataset.store==='pending');
    assert.equal(await page.locator('h1').count(),1);assert.match(await page.title(),/New Tab Extension for Chrome/);
    assert.equal(await page.locator('[rel=canonical]').getAttribute('href'),'https://3dparallax.app/');
    const graph=JSON.parse(await page.locator('[type="application/ld+json"]').textContent());assert.equal(graph['@graph'][0]['@type'],'WebSite');assert.equal(JSON.stringify(graph).includes('aggregateRating'),false);
    await page.screenshot({path:path.join(artifacts,'home-desktop.png'),fullPage:true,animations:'disabled'});
    for(const link of await page.locator('[data-install]').all())assert.equal(await link.getAttribute('href'),'/install');
    await page.locator('.faq-list summary').first().click();assert.equal(await page.locator('.faq-list details').first().getAttribute('open'),'');
    const store='https://chromewebstore.google.com/detail/3d-parallax/'+'a'.repeat(32);
    let result=await page.request.put(base+'/api/admin/config',{headers:{Authorization:'Bearer owner-token'},data:{schemaVersion:1,chromeStoreUrl:store,supportUrl:'https://example.test/help'}});assert.equal(result.status(),200);
    await page.reload();await page.waitForFunction(()=>document.documentElement.dataset.store==='available');
    for(const link of await page.locator('[data-install]').all()){assert.equal(await link.getAttribute('href'),store);assert.equal(await link.getAttribute('target'),'_blank');}
    assert.equal(await page.locator('[data-install-label]').first().textContent(),'Add to Chrome');
    await page.goto(base+'/install');await page.waitForFunction(()=>document.documentElement.dataset.store==='available');assert.equal(await page.locator('[data-store-only]').getAttribute('href'),store);
    result=await page.request.put(base+'/api/admin/config',{headers:{Authorization:'Bearer owner-token'},data:{schemaVersion:1,chromeStoreUrl:''}});assert.equal(result.status(),200);
    await page.locator('[data-refresh-install]').click();await page.waitForFunction(()=>document.documentElement.dataset.store==='pending');assert.equal(await page.locator('[data-store-only]').getAttribute('href'),'/demo/index.html');
    result=await page.request.put(base+'/api/admin/config',{headers:{Authorization:'Bearer owner-token'},data:{schemaVersion:1,chromeStoreUrl:'https://example.test/fake-store'}});assert.equal(result.status(),400);
    assert.equal((await page.request.put(base+'/api/admin/config',{data:{schemaVersion:1,chromeStoreUrl:store}})).status(),401);
    await page.screenshot({path:path.join(artifacts,'install-pending.png'),fullPage:true});
    const titles=new Set();for(const route of ['/','/install','/help','/changelog','/privacy.html']){
      await page.goto(base+route);assert.equal(await page.locator('h1').count(),1);const title=await page.title();assert.ok(!titles.has(title),'unique page title');titles.add(title);
      assert.equal(await page.locator('[rel=canonical]').getAttribute('href'),'https://3dparallax.app'+route);assert.ok((await page.locator('meta[name=description]').getAttribute('content')).length>60);
      assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'),'https://3dparallax.app/assets/social-preview.png');
    }
    for(const width of [320,390,768,1440]){
      await page.setViewportSize({width,height:900});await page.goto(base);await page.waitForFunction(()=>document.documentElement.dataset.store==='pending');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'homepage fits '+width);
      if(width===390){await page.locator('[data-menu-toggle]').click();assert.equal(await page.locator('#main-nav').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded'),'false');await page.screenshot({path:path.join(artifacts,'home-mobile.png'),fullPage:true,animations:'disabled'});}
    }
    const noJS=await browser.newContext({javaScriptEnabled:false});const crawler=await noJS.newPage();await crawler.goto(base);assert.ok((await crawler.locator('main').textContent()).includes('resizable')||(await crawler.locator('main').textContent()).includes('widgets'));assert.equal(await crawler.locator('h1').count(),1);assert.equal(await crawler.locator('a[href="/install"]').count()>0,true);await noJS.close();
    const robots=await (await page.request.get(base+'/robots.txt')).text();assert.ok(robots.includes('Sitemap: https://3dparallax.app/sitemap.xml'));assert.ok(robots.includes('Disallow: /demo/'));
    const sitemap=await (await page.request.get(base+'/sitemap.xml')).text();assert.equal((sitemap.match(/<loc>/g)||[]).length,5);assert.ok(!sitemap.includes('demo'));
    const missing=await page.goto(base+'/missing-page');assert.equal(missing.status(),404);assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),'noindex,follow');
    await page.goto(base+'/demo/index.html');await page.waitForFunction(()=>window.app&&window.HomepageUI);await page.locator('#loadingScreen').waitFor({state:'hidden'});assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),'noindex,follow');assert.equal(await page.locator('#settingsBtn').isVisible(),true);
    assert.deepEqual(errors,[]);assert.deepEqual(violations,[]);
    console.log('PASS: admin config → durable API fixture → website install links, release states, safe URLs, crawled HTML/SEO/social metadata, FAQ/mobile navigation, 320–1440px layouts, 404 and working demo/CSP. No production settings or emails changed.');
  }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exit(1);});
