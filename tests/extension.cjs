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
  try {
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
  assert.equal(await page.evaluate(()=>chrome.runtime.getManifest().permissions.includes('geolocation')),false);
  assert.equal(await page.locator('#toggleAmbient').count(),0);
  assert.equal(await page.locator('#ambientBtn').textContent(),'Choose sound');
  const [backupPage]=await Promise.all([context.waitForEvent('page'),page.locator('#exportBtn').click()]);
  backupPage.on('pageerror',e=>errors.push(e.message));
  backupPage.on('console',m=>{if(m.text().includes('Reset failed'))console.log(m.text());});
  await backupPage.waitForFunction(()=>window.app && window.HomepageUI);
  await backupPage.locator('#loadingScreen').waitFor({state:'hidden'});
  assert.equal(await backupPage.locator('#settings-pane-data').isVisible(),true,'popup opens full backup settings');
  await backupPage.locator('#openResetBtn').click();
  await backupPage.locator('#cancelResetBtn').click();
  assert.equal(await backupPage.evaluate(()=>app.userName),'Ali');
  await backupPage.evaluate(async()=>{
    localStorage.setItem('homepage_widget_notes','Saved private note');
    await AIProviders.add({name:'Reset test',apiKey:'test_key_not_real',baseUrl:'https://api.groq.com/openai/v1',model:'llama-3.3-70b-versatile'});
  });
  await backupPage.locator('#openResetBtn').click();
  try {
    await Promise.all([backupPage.waitForEvent('load',{timeout:10000}),backupPage.locator('#confirmResetBtn').click()]);
  } catch (error) {
    console.log('Reset diagnostic', await backupPage.evaluate(()=>({url:location.href,status:document.getElementById('resetStatus')?.textContent,disabled:document.getElementById('confirmResetBtn')?.disabled,notesPresent:!!localStorage.getItem('homepage_widget_notes')})));
    throw error;
  }
  await backupPage.waitForFunction(()=>window.app && window.HomepageUI);
  assert.equal(await backupPage.evaluate(()=>localStorage.getItem('homepage_widget_notes')),null);
  assert.equal(await backupPage.evaluate(async()=>(await AIProviders.getAll()).length),0);
  assert.equal(await backupPage.evaluate(()=>WeatherAccess.enabled()),false);
  assert.deepEqual(errors,[]); assert.deepEqual(violations,[]); assert.deepEqual(failed,[]);
  console.log('PASS: actual MV3 extension, native provider storage/reset, no device location permission, popup backup navigation, persisted styles, local assets and CSP.');
  } finally { await context.close(); }
})().catch(e=>{console.error(e);process.exit(1);});
