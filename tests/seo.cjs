const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const {createWebsiteServer}=require('./helpers/website-server.cjs');
const repo=path.resolve(__dirname,'..'),root=path.join(repo,'website-dist'),artifacts=path.join(repo,'.test-artifacts/seo');
(async()=>{
  execFileSync(process.execPath,[path.join(repo,'scripts/build-website.cjs')],{stdio:'pipe',windowsHide:true});fs.mkdirSync(artifacts,{recursive:true});
  const config=JSON.parse(fs.readFileSync(path.join(repo,'vercel.json'),'utf8')),site=JSON.parse(fs.readFileSync(path.join(repo,'website/site.json'),'utf8'));
  const server=createWebsiteServer(root,config,{'/api/site-config':(_req,res)=>res.json({schemaVersion:1,chromeStoreUrl:site.chromeStoreUrl})});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
  const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||chromium.executablePath()});
  try{
    const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:1000}}),page=await context.newPage();
    const sitemap=await (await page.request.get(base+'/sitemap.xml')).text(),urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]);
    assert.deepEqual(urls,['/','/install','/wallpapers','/widgets','/help','/changelog','/privacy.html'].map(route=>'https://3dparallax.app'+route));
    const tokens=JSON.parse(fs.readFileSync(path.join(repo,'website/search-verification.json'),'utf8')).googleSiteVerification;
    for(const url of urls){
      const route=new URL(url).pathname,response=await page.goto(base+route);assert.equal(response.status(),200,url);assert.equal(await page.locator('link[rel=canonical]').count(),1);
      assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),url);assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'),url);assert.match(await page.locator('meta[name=robots]').getAttribute('content'),/^index,/);
      assert.deepEqual(await page.locator('head meta[name="google-site-verification"]').evaluateAll(nodes=>nodes.map(n=>n.content)),tokens);
      assert.equal(await page.locator('h1').count(),1);assert.ok((await page.locator('main').textContent()).length>500);
      for(const link of await page.locator('[data-install],[data-store-only]').all()){assert.equal(await link.getAttribute('href'),site.chromeStoreUrl);assert.match(await link.textContent(),/Add to Chrome/);}
      assert.equal(await page.locator('[data-release-note]').filter({hasText:'under review'}).count(),0,'published availability is visible without JS');
      const json=await page.locator('script[type="application/ld+json"]').textContent(),graph=JSON.parse(json)['@graph'];
      assert.ok(graph.some(item=>item['@type']==='WebPage'&&item.url===url));assert.ok(response.headers()['content-security-policy'].includes('sha256-'+crypto.createHash('sha256').update(json).digest('base64')),'structured data is allowed by CSP');
      if(route!=='/')assert.equal(graph.find(item=>item['@type']==='BreadcrumbList').itemListElement[1].item,url);
      if(route==='/'){const app=graph.find(item=>item['@type']==='SoftwareApplication');assert.equal(app.installUrl,site.chromeStoreUrl);assert.equal(app.offers.price,'0');assert.equal(app.aggregateRating,undefined);}
      const internal=await page.locator('a[href^="/"]').evaluateAll(links=>[...new Set(links.map(link=>new URL(link.href).pathname))]);
      for(const target of internal){const link=await page.request.get(base+target,{maxRedirects:0});assert.equal(link.status(),200,`${route} has a canonical internal link ${target}`);}
    }
    for(const [legacy,target] of [['/index.html','/'],['/install.html','/install'],['/wallpapers.html','/wallpapers'],['/widgets.html','/widgets'],['/help.html','/help'],['/changelog.html','/changelog'],['/privacy','/privacy.html'],['/widgets/','/widgets']]){
      const response=await page.request.get(base+legacy+'?utm_source=check',{maxRedirects:0});assert.equal(response.status(),308);assert.equal(response.headers().location,target+'?utm_source=check');
    }
    for(const host of ['www.3dparallax.app','3dparallax.vercel.app'])for(const route of ['/','/help','/wallpapers','/assets/homepage.png']){
      const response=await page.request.get(base+route+'?ref=test',{headers:{Host:host},maxRedirects:0});assert.equal(response.status(),308);assert.equal(response.headers().location,'https://3dparallax.app'+route+'?ref=test');
    }
    const preview=await page.request.get(base+'/',{headers:{Host:'preview-example.vercel.app'},maxRedirects:0});assert.equal(preview.status(),200,'unknown preview hosts are not redirected away');
    await page.goto(base+'/missing');assert.equal(await page.locator('link[rel=canonical]').count(),0,'404 is not canonicalized to the unrelated homepage');
    await page.goto(base+'/demo/index.html');assert.equal(await page.locator('link[rel=canonical]').count(),0);assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),'noindex,follow');
    for(const target of ['/demo/index.html','/demo/popup.html','/demo/privacy.html','/manifest.json'])assert.match((await page.request.get(base+target)).headers()['x-robots-tag'],/noindex/);
    for(const route of ['/wallpapers','/widgets'])for(const width of [320,390,768,800,1440]){
      await page.setViewportSize({width,height:900});await page.goto(base+route);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' fits '+width);
      if(width===390||width===1440)await page.screenshot({path:path.join(artifacts,route.slice(1)+'-'+width+'.png'),fullPage:true,animations:'disabled'});
    }
    assert.equal(JSON.parse(fs.readFileSync(path.join(repo,'custom extension/manifest.json'))).version,'2.6.0');
    console.log('PASS: seven canonical crawlable pages, permanent host/legacy/slash redirects, query preservation, preview isolation, static install links, real software metadata, breadcrumbs/CSP, verification, noindex/404 handling and responsive guides.');
  }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
