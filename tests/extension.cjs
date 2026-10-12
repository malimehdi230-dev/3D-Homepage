const {chromium} = require('playwright');
const path = require('node:path');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const extension = path.resolve(__dirname,'../custom extension');
(async()=>{
  fs.mkdirSync(path.join(__dirname,'../.test-artifacts/screenshots'),{recursive:true});
  const context = await chromium.launchPersistentContext(path.join(__dirname,'../.test-artifacts/extension-profile'),{
    executablePath:process.env.BROWSER_PATH || chromium.executablePath(),
    headless:true, viewport:{width:1440,height:900},
    ignoreDefaultArgs:['--disable-extensions'],
    args:[`--disable-extensions-except=${extension}`,`--load-extension=${extension}`]
  });
  const errors=[],violations=[],failed=[];
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error' && /Content Security Policy|Refused to execute|Cannot load extension/.test(m.text()))violations.push(m.text());});
  page.on('requestfailed',r=>{if(r.url().startsWith('chrome-extension:'))failed.push(r.url());});
  await page.goto('chrome://newtab/');
  await page.waitForFunction(()=>window.app && window.HomepageUI,{timeout:15000});
  await page.locator('#loadingScreen').waitFor({state:'hidden'});
  assert.equal(await page.evaluate(()=>typeof chrome.storage.local.get),'function');
  await page.evaluate(async()=>{for(const p of await AIProviders.getAll()) await AIProviders.remove(p.id); WidgetCanvas.useClassic(); app.updateUserName('Ali'); app.applyTemplate('minimal'); localStorage.setItem('homepage_feedback_never','true');});
  await page.locator('#settingsBtn').click();
  await page.locator('[data-section=ai]').click();
  await page.locator('#showAddFormBtn').click();
  await page.locator('#provName').fill('Test provider');
  await page.locator('#provKey').fill('gsk_test_only_not_a_real_key');
  await page.locator('#saveProvBtn').click();
  await page.waitForFunction(()=>document.querySelectorAll('.provider-card').length===1);
  const data=await page.evaluate(()=>new Promise(r=>chrome.storage.local.get('ai_providers',r)));
  assert.equal(data.ai_providers[0].name,'Test provider');
  await page.evaluate(data=>AIProviders.remove(data.ai_providers[0].id),data);
  await page.keyboard.press('Escape');
  await page.locator('#editLayoutBtn').click();
  await page.locator('[data-widget=weather] [data-act=hide]').click();
  await page.locator('#widgetDoneBtn').click();
  await page.screenshot({path:path.join(__dirname,'../.test-artifacts/screenshots','extension-homepage.png'),animations:'disabled'});
  await page.locator('#customizeBtn').click();
  await page.screenshot({path:path.join(__dirname,'../.test-artifacts/screenshots','extension-elements.png'),animations:'disabled'});
  await page.locator('#cpCloseBtn').click();
  await page.locator('#settingsBtn').click();
  await page.locator('[data-section=layout]').click();
  await page.screenshot({path:path.join(__dirname,'../.test-artifacts/screenshots','extension-layout-settings.png'),animations:'disabled'});
  await page.keyboard.press('Escape');
  await page.evaluate(()=>{localStorage.setItem('homepage_custom_clock_size','4');});
  await page.reload();
  await page.waitForFunction(()=>window.app && window.HomepageUI);
  assert.equal(await page.evaluate(()=>document.documentElement.style.getPropertyValue('--custom-clock-size')),'4rem');
  const origin=await page.evaluate(()=>location.origin);
  await page.goto(origin+'/popup.html');
  await page.waitForTimeout(300);
  assert.equal(await page.locator('#statLinks').textContent(),'5');
  await page.screenshot({path:path.join(__dirname,'../.test-artifacts/screenshots','extension-popup.png'),animations:'disabled'});
  assert.deepEqual(errors,[]); assert.deepEqual(violations,[]); assert.deepEqual(failed,[]);
  console.log('PASS: loaded Manifest V3 extension, native provider storage, new-tab override, settings, widget visibility, persisted startup styles, popup, bundled assets, and no CSP violations.');
  await context.close();
})().catch(e=>{console.error(e);process.exit(1);});
