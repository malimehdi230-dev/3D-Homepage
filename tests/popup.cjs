// Exercise the actual MV3 popup and its shared state, without production writes.
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../custom extension'),artifacts=path.resolve(__dirname,'../.test-artifacts');
const reviews='https://chromewebstore.google.com/detail/3d-parallax/cgodhedchgcogoicfmdpgfopbfkcafkn/reviews';
(async()=>{
  fs.mkdirSync(path.join(artifacts,'screenshots'),{recursive:true});
  const context=await chromium.launchPersistentContext(fs.mkdtempSync(path.join(artifacts,'popup-profile-')),{
    executablePath:process.env.BROWSER_PATH||chromium.executablePath(),headless:true,viewport:{width:1440,height:900},
    ignoreDefaultArgs:['--disable-extensions'],args:[`--disable-extensions-except=${root}`,`--load-extension=${root}`]
  });
  const errors=[],failed=[],posts=[];
  // Native tabs.create can navigate before Playwright attaches. Assert runtime
  // errors in our extension, not third-party pages opened by these link tests.
  context.on('page',page=>{page.on('pageerror',e=>{if(page.url().startsWith('chrome-extension:'))errors.push(e.message);});page.on('requestfailed',r=>{if(r.url().startsWith('chrome-extension:'))failed.push(r.url());});});
  await context.route('https://3-d-parallax-backend.vercel.app/**',route=>{
    if(route.request().method()==='POST')posts.push(route.request().url());
    return route.fulfill({json:{schemaVersion:1,libraryEnabled:true,aiEnabled:true,ambientEnabled:true,feedbackEnabled:true}});
  });
  const external=title=>route=>route.fulfill(route.request().resourceType()==='document'?{contentType:'text/html',body:`<title>${title}</title>`}:{contentType:'text/javascript',body:''});
  await context.route('https://chromewebstore.google.com/**',external('Reviews'));
  await context.route('https://console.groq.com/**',external('API Keys'));
  const ready=async page=>{await page.waitForFunction(()=>window.app&&window.HomepageUI&&window.BackgroundPicker);await page.locator('#loadingScreen').waitFor({state:'hidden'});};
  try{
    const home=await context.newPage();await home.goto('chrome://newtab/');await ready(home);
    const origin=await home.evaluate(()=>location.origin);
    await home.evaluate(async()=>{
      await Wallpaper.clearAll();await chrome.storage.local.clear();WidgetCanvas.useClassic();app.applyTemplate('nature');app.updateUserName('Mehdi');
      localStorage.setItem('homepage_install_date',String(Date.now()-3*86400000));
      localStorage.setItem('homepage_links',JSON.stringify([{name:'Docs',url:'https://developer.chrome.com/',icon:'fas fa-book'},{name:'My site',url:'https://3dparallax.app',icon:'fas fa-link'}]));
      localStorage.setItem('homepage_matrixEnabled','0');localStorage.setItem('homepage_ambient_kind','rain');localStorage.setItem('homepage_ambient_volume','0');
      HomepageUI.applyEffects();
      await chrome.storage.local.set({homepage_template:'programmer',homepage_userName:'Old name',homepage_links:'[]',homepage_matrixEnabled:'1'});
    });
    const createPopup=async()=>{const page=await context.newPage();await page.goto(origin+'/popup.html');await page.waitForFunction(()=>document.getElementById('tmplName').textContent!=='Loading…');return page;};
    let popup=await createPopup();
    assert.equal(await popup.locator('#popupName').textContent(),'Mehdi','canonical preferences win over stale Chrome mirrors');
    assert.equal(await popup.locator('#statLinks').textContent(),'2');assert.equal(await popup.locator('#statTemplates').textContent(),'18');assert.equal(await popup.locator('#statDays').textContent(),'3');
    assert.equal(await popup.locator('#tmplName').textContent(),await home.evaluate(()=>TEMPLATES.nature.name));
    assert.equal(await popup.locator('#popupVersion').textContent(),'v2.6.0');assert.equal(await popup.locator('#ambientBtn').textContent(),'Rain (muted)');
    assert.equal(await popup.locator('#toggleMatrix').isChecked(),false);assert.equal(await popup.locator('#layoutSummary').textContent(),'Centered');
    assert.equal(await popup.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--primary')),await home.evaluate(()=>TEMPLATES.nature.colors.primary));
    await popup.locator('#toggleMatrix').check();await home.waitForFunction(()=>!document.body.classList.contains('fx-matrix-off'));
    assert.equal(await home.evaluate(()=>localStorage.getItem('homepage_matrixEnabled')),'1');
    await home.evaluate(()=>{
      app.updateUserName('Ali');app.applyTemplate('anime');
      localStorage.setItem('homepage_matrixEnabled','0');localStorage.setItem('homepage_ambient_kind','lofi');localStorage.setItem('homepage_ambient_volume','.5');
      localStorage.setItem('homepage_widget_layout',JSON.stringify([{id:'clock'},{id:'date',hidden:true},{id:'quicklinks'}]));
    });
    await popup.waitForFunction(()=>document.getElementById('popupName').textContent==='Ali'&&document.getElementById('layoutSummary').textContent.includes('2 visible'));
    assert.equal(await popup.locator('#tmplName').textContent(),await home.evaluate(()=>TEMPLATES.anime.name));assert.equal(await popup.locator('#toggleMatrix').isChecked(),false);
    assert.equal(await popup.locator('#ambientBtn').textContent(),'Lo-fi');
    await home.evaluate(async()=>{
      const canvas=document.createElement('canvas');canvas.width=64;canvas.height=40;const ctx=canvas.getContext('2d');ctx.fillStyle='#587b69';ctx.fillRect(0,0,64,40);
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
      await Wallpaper.setFromFile(blob,{name:'Forest.png'});
    });
    await popup.waitForFunction(()=>document.getElementById('tmplName').textContent==='Forest.png'&&document.querySelector('#tmplIcon img')?.naturalWidth>0);
    assert.equal(await popup.locator('#wallpaperCount').textContent(),'1 of 5 wallpapers saved');assert.match(await popup.locator('#tmplDesc').textContent(),/Photo wallpaper/);
    await popup.locator('body').screenshot({path:path.join(artifacts,'screenshots/popup-wallpaper.png'),animations:'disabled'});
    const bounds=await popup.evaluate(()=>({width:document.body.clientWidth,height:document.body.getBoundingClientRect().height,scroll:document.body.scrollWidth,footer:document.querySelector('footer').getBoundingClientRect().bottom}));
    assert.equal(bounds.width,360);assert.ok(bounds.height<=600);assert.ok(bounds.scroll<=360);assert.ok(bounds.footer<=600);
    await home.evaluate(()=>Wallpaper.useTheme());await popup.waitForFunction(()=>!document.querySelector('#tmplIcon img'));
    assert.equal(await popup.locator('#tmplName').textContent(),await home.evaluate(()=>TEMPLATES.anime.name));
    await home.evaluate(()=>{
      localStorage.setItem('homepage_links','[]');localStorage.setItem('homepage_userName','');
      localStorage.setItem('homepage_service_config',JSON.stringify({schemaVersion:1,ambientEnabled:false,cachedAt:Date.now()}));
    });
    await popup.waitForFunction(()=>document.getElementById('statLinks').textContent==='0'&&document.getElementById('ambientBtn').disabled);
    assert.equal(await popup.locator('#popupName').textContent(),'there');assert.equal(await popup.locator('#ambientBtn').textContent(),'Unavailable');
    await home.evaluate(()=>{
      localStorage.setItem('homepage_links',JSON.stringify([{name:'<img src=x onerror=alert(1)>',url:'javascript:alert(1)',icon:'fas fa-link'}]));
      localStorage.setItem('homepage_setup_theme',JSON.stringify({accent:'#344b40'}));localStorage.removeItem('homepage_service_config');
    });
    await popup.waitForFunction(()=>document.querySelector('#quickLinks').textContent.includes('<img'));
    assert.equal(await popup.locator('#quickLinks img,#quickLinks a').count(),0,'unsafe links are non-clickable and names are text');
    assert.equal(await popup.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--primary-ink')),'#ffffff');
    await popup.close();
    await home.evaluate(()=>{localStorage.removeItem('homepage_setup_theme');app.updateUserName('Ali');WidgetCanvas.useClassic();});
    const openControl=async(id,selector)=>{
      popup=await createPopup();const [opened]=await Promise.all([context.waitForEvent('page'),popup.locator(id).click()]);await ready(opened);
      await opened.locator(selector).waitFor({state:'visible'});return opened;
    };
    for(const [id,selector] of [['#popupSettingsBtn','#settings-pane-general'],['#layoutBtn','#settings-pane-layout'],['#ambientBtn','#soundOptions'],['#exportBtn','#settings-pane-data'],['#resetBtn','#resetModal'],['#backgroundBtn','#templateGrid']]){
      const opened=await openControl(id,selector);await opened.close();
    }
    await home.evaluate(async()=>{await Wallpaper.activate((await Wallpaper.list())[0].id);});
    const saved=await openControl('#backgroundBtn','#savedWallpaperPanel');await saved.close();
    await home.evaluate(()=>{app.links=[...DEFAULT_LINKS];app.saveLinks();});
    popup=await createPopup();
    assert.equal(await popup.locator('#statLinks').textContent(),'5');
    await popup.locator('body').screenshot({path:path.join(artifacts,'screenshots/popup-default-links.png'),animations:'disabled'});
    const size=await popup.evaluate(()=>{const main=document.querySelector('main');return {content:main.scrollHeight,available:main.clientHeight};});
    assert.ok(size.content<=size.available+1,`all default controls fit without scrolling (${JSON.stringify(size)})`);
    const [review]=await Promise.all([context.waitForEvent('page'),popup.locator('#popupFeedbackLink').click()]);await review.waitForURL(reviews);await review.close();await popup.close();
    const assertReview=async action=>{const [page]=await Promise.all([context.waitForEvent('page'),action()]);await page.waitForURL(reviews);await page.close();};
    await assertReview(()=>home.locator('#feedbackTriggerBtn').click());await assertReview(()=>home.keyboard.press('f'));
    await home.evaluate(()=>HomepageUI.openSettings('data'));await assertReview(()=>home.locator('#settingsFeedbackBtn').click());
    await home.locator('#settingsReportProblemBtn').click();await home.waitForFunction(()=>Feedback.isOpen);await home.keyboard.press('Escape');await home.waitForFunction(()=>!Feedback.isOpen);
    await home.evaluate(()=>HomepageUI.openSettings('ai'));
    const groq=home.locator('#getGroqApiLink');assert.equal(await groq.textContent().then(t=>t.trim()),'Get Groq API');assert.equal(await groq.getAttribute('href'),'https://console.groq.com/keys');
    assert.equal(await groq.getAttribute('target'),'_blank');assert.match(await groq.getAttribute('rel'),/noopener/);
    const [keys]=await Promise.all([context.waitForEvent('page'),groq.click()]);
    await keys.waitForURL('https://console.groq.com/keys');await keys.close();
    await home.setViewportSize({width:390,height:844});
    const fit=await groq.evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;});assert.equal(fit,true,'provider links fit a narrow settings panel');
    await home.locator('#settingsModal .modal').screenshot({path:path.join(artifacts,'screenshots/groq-api-mobile.png'),animations:'disabled'});
    await home.evaluate(()=>{document.body.classList.add('service-feedback-off');HomepageUI.openSettings('data');});
    assert.equal(await home.locator('#settingsFeedbackBtn').isVisible(),true);assert.equal(await home.locator('#settingsReportProblemBtn').isVisible(),false);assert.equal(await home.locator('#feedbackTriggerBtn').isVisible(),true);
    const manifest=await home.evaluate(()=>chrome.runtime.getManifest());assert.equal(manifest.version,'2.6.0');assert.deepEqual(manifest.permissions,['storage','unlimitedStorage']);
    for(const size of [16,32,48,128]){
      assert.deepEqual(fs.readFileSync(path.join(root,manifest.icons[size])),fs.readFileSync(path.join(root,'../store-kit/brand-v2',`icon${size}.png`)),'approved logo is bundled');
    }
    assert.deepEqual(posts,[]);assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
    console.log('PASS: native MV3 popup live preferences, stale mirror fallback, empty/false values, safe links, wallpaper previews, sound availability, layout navigation, store reviews, private reports, Groq API link, compact/mobile UI and updated logos.');
  }finally{await context.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
