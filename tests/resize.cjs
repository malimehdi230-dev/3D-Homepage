const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../custom extension');
const server = http.createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.woff2':'font/woff2' };
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  res.setHeader('Content-Security-Policy', "script-src 'self'; object-src 'self'");
  res.end(fs.readFileSync(file));
});
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const browser = await chromium.launch({ headless:true, executablePath:process.env.BROWSER_PATH || chromium.executablePath() });
  try {
    const page = await browser.newPage({ viewport:{ width:1440, height:1000 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(() => {
      window.locationRequests = 0;
      navigator.geolocation.getCurrentPosition = success => {
        window.locationRequests++;
        success({ coords:{ latitude:24.86, longitude:67.01 } });
      };
    });
    await page.route('https://api.open-meteo.com/**', r => r.fulfill({ json:{ current:{ temperature_2m:26, weather_code:1 } } }));
    await page.route('https://geocoding-api.open-meteo.com/**', r => r.fulfill({ json:{ results:[{name:'Karachi',admin1:'Sindh',country:'Pakistan',latitude:24.86,longitude:67.01}] } }));
    await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
    await page.waitForFunction(() => window.app && window.HomepageUI);
    await page.locator('#loadingScreen').waitFor({ state:'hidden' });
    assert.equal(await page.evaluate(() => window.locationRequests), 0, 'no location access on first launch');
    await page.locator('#geoRetryBtn').click();
    await page.locator('#weatherCityInput').fill('Karachi');
    await page.locator('#weatherCityForm button[type=submit]').click();
    await page.locator('.weather-city-result').click();
    assert.equal(await page.evaluate(() => WeatherAccess.city().name),'Karachi');
    assert.equal(await page.evaluate(() => window.locationRequests),0,'city weather never accesses device location');
    await page.evaluate(() => { app.updateUserName('Ali'); app.roles = ['A fresh start']; WidgetCanvas.enterEdit(); });
    const cases = [
      ['clock',3,1,6,3,'.wb-clock'], ['date',3,1,6,2,'.wb-date'],
      ['greeting',6,1,12,2,'.wb-greeting'], ['name',4,1,8,3,'.name-title'],
      ['headline',4,1,8,2,'.subtitle'], ['weather',2,1,6,3,'.wb-weather-inner'],
      ['search',4,1,8,2,'.wb-search-input'], ['quicklinks',4,2,8,4,'.link-icon-wrapper']
    ];
    const settle = () => page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    for (const [widget,w,h,newW,newH,selector] of cases) {
      await page.evaluate(({widget,w,h}) => WidgetCanvas.applyLayout([{widget,x:0,y:0,w,h,props:{}}]),{widget,w,h});
      await settle();
      if (widget === 'weather') await page.locator('.wb-weather-inner span').filter({hasText:'26°C'}).waitFor();
      const target = page.locator(`[data-widget=${widget}] ${selector}`);
      const metric = () => target.first().evaluate((e,isIcon) => isIcon ? e.getBoundingClientRect().width : parseFloat(getComputedStyle(e).fontSize), widget === 'quicklinks');
      const before = await metric();
      const handle = await page.locator('.widget-resize').boundingBox();
      const canvas = await page.locator('#widgetCanvas').boundingBox();
      await page.mouse.move(handle.x+handle.width/2,handle.y+handle.height/2);
      await page.mouse.down();
      await page.mouse.move(handle.x+handle.width/2 + (newW-w)*canvas.width/12, handle.y+handle.height/2 + (newH-h)*76, {steps:8});
      await settle();
      const during = await metric();
      assert(during > before * 1.2, `${widget} content grows during drag: ${before} -> ${during}`);
      await page.mouse.up(); await settle();
      assert(await metric() > before * 1.2, `${widget} retains content growth after drag`);
      const saved = await page.evaluate(() => WidgetCanvas.getLayout()[0]);
      assert.equal(saved.w,newW); assert.equal(saved.h,newH);
      const fits = await page.locator('.widget-body').evaluate(e => e.scrollWidth <= e.clientWidth + 2 && e.scrollHeight <= e.clientHeight + 2);
      assert(fits, `${widget} resized content fits its body: ${JSON.stringify(await page.locator('.widget-body').evaluate(e => ({width:e.clientWidth,sw:e.scrollWidth,height:e.clientHeight,sh:e.scrollHeight,font:getComputedStyle(e).fontSize,line:getComputedStyle(e).lineHeight,vars:e.style.cssText})))}`);
      console.log(`PASS: ${widget} content scales during and after resizing.`);
    }
    // Long user content and clock formats fit rather than spilling outside a card.
    await page.evaluate(() => WidgetCanvas.applyLayout([{widget:'clock',x:0,y:0,w:3,h:1,props:{format:'12',seconds:true}}]));
    await settle();
    assert(await page.locator('.wb-clock').evaluate(e => e.scrollWidth <= e.clientWidth+2));
    await page.locator('[data-act=settings]').click();
    await page.locator('[data-k=contentScale]').fill('50');
    await page.locator('[data-k=contentScale]').dispatchEvent('input');
    await page.locator('.wsp-done').click();
    await settle();
    assert.equal(await page.evaluate(() => WidgetCanvas.getLayout()[0].props.contentScale),'50');
    await page.reload(); await page.waitForFunction(() => window.app && window.HomepageUI);
    assert.equal(await page.evaluate(() => WidgetCanvas.getLayout()[0].props.contentScale),'50');
    await page.evaluate(() => WidgetCanvas.applyLayout([
      {widget:'clock',x:0,y:2,w:4,h:2}, {widget:'date',x:4,y:6,w:4,h:1}, {widget:'search',x:0,y:9,w:8,h:1}
    ]));
    await page.evaluate(() => WidgetCanvas.compactLayout());
    assert.deepEqual(await page.evaluate(() => WidgetCanvas.getLayout().map(i => i.y)),[0,0,2]);
    await page.evaluate(() => WidgetCanvas.undo());
    assert.deepEqual(await page.evaluate(() => WidgetCanvas.getLayout().map(i => i.y)),[2,6,9]);
    await page.evaluate(() => WeatherAccess.disable());
    await page.reload(); await page.waitForFunction(() => window.app && window.HomepageUI);
    assert.equal(await page.evaluate(() => window.locationRequests),0, 'disabled weather stays disabled after reload');
    await page.locator('#settingsBtn').click();
    await page.locator('#settings-tab-data').click();
    await page.locator('#openResetBtn').click();
    await page.locator('#cancelResetBtn').click();
    assert.equal(await page.evaluate(() => WidgetCanvas.getLayout().length),3, 'cancel reset preserves layout');
    await page.evaluate(async () => {
      const canvas=document.createElement('canvas');canvas.width=48;canvas.height=32;
      const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));
      await Wallpaper.setFromFile(new File([blob], 'wallpaper.png', {type:'image/png'}));
      await Wallpaper.backup();
      localStorage.setItem('homepage_widget_notes','Personal notes');
      await AIProviders.add({name:'Test',apiKey:'test_key',baseUrl:'https://api.groq.com/openai/v1',model:'llama-3.3-70b-versatile'});
    });
    await page.locator('#openResetBtn').click();
    await Promise.all([page.waitForEvent('load'), page.locator('#confirmResetBtn').click()]);
    await page.waitForFunction(() => window.app && window.HomepageUI && !localStorage.getItem('homepage_widget_notes'));
    assert.equal(await page.evaluate(() => WidgetCanvas.getLayout()),null);
    assert.equal(await page.evaluate(() => Wallpaper.getBlob()),null);
    assert.equal(await page.evaluate(async () => (await AIProviders.getAll()).length),0);
    assert.deepEqual(errors,[]);
    console.log('PASS: long clock fits, scale persists, tidy up/undo, city selection/disable, no device location access, reset cancellation and complete local reset.');
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); process.exit(1); });
