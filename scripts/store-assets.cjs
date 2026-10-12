const {chromium} = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const repo = path.resolve(__dirname,'..');
const extension = path.join(repo,'custom extension');
const output = path.join(repo,'store-kit/assets');
const executablePath = process.env.BROWSER_PATH || chromium.executablePath();

(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const context = await chromium.launchPersistentContext(path.join(repo,'.test-artifacts/store-profile'),{
    executablePath,headless:true,viewport:{width:1280,height:800},
    ignoreDefaultArgs:['--disable-extensions'],
    args:[`--disable-extensions-except=${extension}`,`--load-extension=${extension}`]
  });
  try {
    const page=await context.newPage();
    await page.goto('chrome://newtab/');
    await page.waitForFunction(()=>window.app && window.HomepageUI);
    await page.locator('#loadingScreen').waitFor({state:'hidden'});
    await page.evaluate(async()=>{
      localStorage.clear(); await Wallpaper.clearAll();
      app.updateUserName('Alex'); app.applyTemplate('minimal');
      app.roles=['One thing at a time.']; app.typingEnabled=false;
      app.saveHeadlineLines(app.roles);
      localStorage.setItem('homepage_headline_typewriter','0');
      ['matrix','particles','cube3d'].forEach(k=>localStorage.setItem('homepage_'+k+'Enabled','0'));
      HomepageUI.applyEffects(); WidgetCanvas.applyLayout(WidgetCanvas.DEFAULT_LAYOUT);
    });
    const capture = async name => {
      await page.waitForTimeout(500);
      await page.screenshot({path:path.join(output,name),animations:'disabled'});
    };
    await capture('01-homepage.png');
    await page.evaluate(()=>WidgetCanvas.enterEdit());
    await capture('02-layout-editor.png');
    await page.evaluate(()=>WidgetCanvas.exitEdit());
    await page.locator('#settingsBtn').click();
    await capture('03-settings.png');
    await page.keyboard.press('Escape');
    await page.locator('#customizeBtn').click();
    await capture('04-elements.png');
  } finally { await context.close(); }

  const browser=await chromium.launch({executablePath,headless:true});
  try {
    const logo='data:image/png;base64,'+fs.readFileSync(path.join(extension,'icons/icon128.png')).toString('base64');
    const shot='data:image/png;base64,'+fs.readFileSync(path.join(output,'01-homepage.png')).toString('base64');
    for (const [name,width,height] of [['promo-small.png',440,280],['promo-marquee.png',1400,560]]) {
      const large=width>1000;
      const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
      await page.setContent(`<!doctype html><html><style>
        *{box-sizing:border-box}body{margin:0;background:#191c22;color:#f2f4f2;font-family:"Segoe UI",sans-serif;overflow:hidden}
        .copy{position:absolute;left:${large?72:28}px;top:${large?70:28}px;width:${large?520:265}px}
        .brand{display:flex;align-items:center;gap:10px;font-size:${large?26:17}px;font-weight:600}.brand img{width:${large?52:32}px;height:${large?52:32}px}
        h1{font-size:${large?68:32}px;line-height:1.13;letter-spacing:-${large?2:1}px;font-weight:600;margin:${large?38:25}px 0 ${large?25:16}px}
        p{color:#b4c4bb;font-size:${large?21:12}px;line-height:1.7;margin:0}
        .preview{position:absolute;width:${large?700:180}px;right:${large?46:18}px;top:${large?78:98}px;border:1px solid #ffffff25;border-radius:14px;background:#12141a;box-shadow:0 20px 60px #0004;overflow:hidden}
        .dots{height:${large?26:13}px;border-bottom:1px solid #ffffff15;display:flex;gap:5px;align-items:center;padding-left:10px}.dots i{display:block;width:4px;height:4px;border-radius:50%;background:#7b8580}
        .preview img{width:100%;display:block}
        .tag{position:absolute;bottom:${large?54:26}px;left:${large?72:28}px;color:#d0ded5;font-size:${large?14:10}px;letter-spacing:1.2px}
      </style><div class="copy"><div class="brand"><img src="${logo}" alt="">3D Parallax</div><h1>Your tab.<br>Your space.</h1><p>A personal start to every day.</p></div><div class="preview"><div class="dots"><i></i><i></i><i></i></div><img src="${shot}" alt="Homepage preview"></div><div class="tag">WIDGETS · THEMES · QUICK LINKS</div></html>`);
      await page.screenshot({path:path.join(output,name)});
      await page.close();
    }
    fs.copyFileSync(path.join(extension,'icons/icon128.png'),path.join(output,'icon128.png'));
    console.log('Created four 1280×800 screenshots, 440×280 and 1400×560 promotional images, and store icon.');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1);});
