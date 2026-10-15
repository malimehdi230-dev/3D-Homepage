// Build the public website and a demo of the packaged Chrome extension.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const repo=path.resolve(__dirname,'..'),source=path.join(repo,'website'),output=path.join(repo,'website-dist'),extension=path.join(repo,'custom extension');
const version=JSON.parse(fs.readFileSync(path.join(extension,'manifest.json'),'utf8')).version;
const site=JSON.parse(fs.readFileSync(path.join(source,'site.json'),'utf8'));
const origin=new URL(site.origin);
if(origin.protocol!=='https:'||origin.origin!==site.origin||origin.username||origin.password||origin.port)throw new Error('Use a single HTTPS canonical origin.');
if(!Array.isArray(site.redirectHosts)||site.redirectHosts.some(host=>!/^[a-z0-9.-]+$/.test(host)||host===origin.hostname))throw new Error('Redirect hosts must be distinct from the canonical hostname.');
if(!/^https:\/\/chromewebstore\.google\.com\/detail\/(?:[^/]+\/)?[a-p]{32}$/.test(site.chromeStoreUrl))throw new Error('Use the published official Chrome Web Store URL.');
const pageDefinitions=JSON.parse(fs.readFileSync(path.join(source,'pages.json'),'utf8'));
const canonicalPaths=[...pageDefinitions.map(item=>item.url),'/privacy.html'];
if(new Set(canonicalPaths).size!==canonicalPaths.length||pageDefinitions.some(item=>!/^\/(?:[a-z-]+)?$/.test(item.url)||!/^\w[\w-]*\.html$/.test(item.file)||!/^\w[\w-]*$/.test(item.content)))throw new Error('Invalid or duplicate website page definition.');
const baseSchema=JSON.parse(fs.readFileSync(path.join(source,'schema.json'),'utf8').replaceAll('https://3dparallax.app',site.origin));
const software=baseSchema['@graph'].find(item=>item['@type']==='SoftwareApplication');
software.installUrl=site.chromeStoreUrl;software.sameAs=site.chromeStoreUrl;if(software.offers)software.offers.url=site.chromeStoreUrl;
const schemaHashes=new Set();
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const verification=JSON.parse(fs.readFileSync(path.join(source,'search-verification.json'),'utf8')).googleSiteVerification;
if(!Array.isArray(verification)||verification.some(token=>typeof token!=='string'||!token||token.length>256||!/^[A-Za-z0-9_-]+$/.test(token)))throw new Error('Search verification must contain complete Google tokens copied from Search Console.');
const verificationTags=[...new Set(verification)].map(token=>`<meta name="google-site-verification" content="${escape(token)}">`).join('');
fs.mkdirSync(path.join(output,'assets'),{recursive:true});
fs.copyFileSync(path.join(source,'style.css'),path.join(output,'style.css'));fs.copyFileSync(path.join(source,'site.js'),path.join(output,'site.js'));fs.copyFileSync(path.join(source,'assets/icons.svg'),path.join(output,'assets/icons.svg'));
for(const [from,to] of [['01-homepage.png','homepage.png'],['02-layout-editor.png','layout.png']])fs.copyFileSync(path.join(repo,'store-kit/assets',from),path.join(output,'assets',to));
for(const [from,to] of [['icon128.png','icon128.png'],['icon128.png','logo-p-128.png'],['icon48.png','logo-p-48.png'],['logo-512.png','logo-p-512.png']])fs.copyFileSync(path.join(repo,'store-kit/brand-v2',from),path.join(output,'assets',to));
fs.copyFileSync(path.join(source,'assets/social-preview.png'),path.join(output,'assets/social-preview.png'));
fs.mkdirSync(path.join(output,'assets/wallpapers'),{recursive:true});
for(const name of ['forest-lake','coastal-sunset','desert-dunes'])fs.copyFileSync(path.join(source,'assets/wallpapers',name+'.webp'),path.join(output,'assets/wallpapers',name+'.webp'));
fs.copyFileSync(path.join(source,'wallpaper-previews.css'),path.join(output,'wallpaper-previews.css'));
const header=`<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="header-inner wrap"><a class="brand" href="/" aria-label="3D Parallax home"><img src="/assets/logo-p-512.png" width="37" height="37" alt="">3D Parallax</a><button class="menu-toggle" type="button" data-menu-toggle aria-controls="main-nav" aria-expanded="false" aria-label="Toggle navigation">☰</button><nav class="nav" id="main-nav" aria-label="Main navigation"><a href="/#features">Features</a><a href="/wallpapers">Wallpapers</a><a href="/widgets">Widgets</a><a href="/help">Help</a><a href="/changelog">What’s new</a></nav><div class="nav-install"><a class="button primary small" href="/install" data-install><span data-install-label>Get 3D Parallax</span><svg aria-hidden="true"><use href="/assets/icons.svg#arrow"/></svg></a></div></div></header>`;
const footer=`<footer class="site-footer"><div class="wrap"><div class="footer-top"><div class="footer-brand"><a class="brand" href="/"><img src="/assets/logo-p-512.png" width="37" height="37" alt="">3D Parallax</a><p>Your space. Your pace.</p></div><nav class="footer-links" aria-label="Footer navigation"><a href="/install">Install</a><a href="/wallpapers">Wallpapers</a><a href="/widgets">Widgets</a><a href="/help">Help & support</a><a href="/changelog">Release notes</a><a href="/privacy.html">Privacy</a><a href="https://github.com/malimehdi230-dev/3D-Homepage" target="_blank" rel="noopener noreferrer">Source ↗</a></nav></div><div class="footer-bottom"><span>© ${new Date().getUTCFullYear()} Muhammad Ali Mehdi · 3D Parallax</span><span>A personal new tab for desktop Chrome</span></div></div></footer>`;
function publishedLinks(html){
  // Public facts and real install links must also be usable without JavaScript.
  // Runtime config can still override availability in the interactive website.
  return html.replace(/<a\b([^>]*\b(?:data-install|data-store-only)\b[^>]*)>([\s\S]*?)<\/a>/g,(_,attributes,content)=>`<a${attributes.replace(/href="[^"]*"/,`href="${escape(site.chromeStoreUrl)}"`)} target="_blank" rel="noopener noreferrer">${content.replace(/(<span\b[^>]*\b(?:data-install-label|data-store-label)[^>]*>)[^<]*/g,'$1Add to Chrome')}</a>`)
    .replace(/(data-release-note>)[^<]*/g,'$1Available on the Chrome Web Store.')
    .replace(/(data-install-heading>)[^<]*/g,'$1Your new tab is ready.')
    .replace(/(data-install-state>)[^<]*/g,'$1Available for desktop Chrome')
    .replace(/(data-install-description>)[^<]*/g,'$1Install 3D Parallax from the official Chrome Web Store. Open a new tab after installation to make it your own.');
}
function page({title,description,url,body,label=title,noindex=false}){
  const canonical=url?site.origin+url:null;
  let structured='',breadcrumbs='';
  if(!noindex&&canonical){
    const graph=url==='/'?structuredClone(baseSchema['@graph']):[];
    graph.push({'@type':'WebPage','@id':canonical+'#webpage',url:canonical,name:title,description,inLanguage:'en',isPartOf:{'@id':site.origin+'/#website'},about:{'@id':site.origin+'/#extension'}});
    if(url!=='/'){
      const breadcrumbId=canonical+'#breadcrumb';graph.at(-1).breadcrumb={'@id':breadcrumbId};
      graph.push({'@type':'BreadcrumbList','@id':breadcrumbId,itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:site.origin+'/'},{'@type':'ListItem',position:2,name:label,item:canonical}]});
      breadcrumbs=`<nav class="breadcrumbs wrap" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">${escape(label)}</span></nav>`;
    }
    const json=JSON.stringify({'@context':'https://schema.org','@graph':graph}).replaceAll('<','\\u003c');
    schemaHashes.add('sha256-'+crypto.createHash('sha256').update(json).digest('base64'));structured=`<script type="application/ld+json">${json}</script>`;
  }
  const social=site.origin+'/assets/social-preview.png';
  return `<!doctype html>\n<html lang="en"><head><meta charset="utf-8">${verificationTags}<meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><meta name="robots" content="${noindex?'noindex,follow':'index,follow,max-image-preview:large'}">${canonical?`<link rel="canonical" href="${escape(canonical)}"><meta property="og:url" content="${escape(canonical)}">`:''}<meta name="theme-color" content="#f7f7f2"><link rel="icon" type="image/png" sizes="48x48" href="/assets/logo-p-48.png"><meta property="og:type" content="website"><meta property="og:site_name" content="3D Parallax"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:image" content="${social}"><meta property="og:image:width" content="1400"><meta property="og:image:height" content="560"><meta property="og:image:alt" content="3D Parallax — a custom new tab extension for Chrome"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${social}"><meta name="twitter:image:alt" content="3D Parallax — a custom new tab extension for Chrome"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/wallpaper-previews.css"><script src="/site.js" defer></script>${structured}</head><body>${publishedLinks(header)}<main id="main">${breadcrumbs}${publishedLinks(body)}</main>${footer}</body></html>\n`;
}
for(const item of pageDefinitions)fs.writeFileSync(path.join(output,item.file),page({...item,body:fs.readFileSync(path.join(source,'pages',item.content+'.html'),'utf8')}));
const policyDate=fs.readFileSync(path.join(repo,'PRIVACY.md'),'utf8').match(/Last updated: ([^.]+)\./)?.[1];
if(!policyDate)throw new Error('Public privacy update date was not found.');
const policy=fs.readFileSync(path.join(extension,'privacy.html'),'utf8').match(/<main>([\s\S]*?)<\/main>/)?.[1]?.replace(/Last updated: [^.]+\./,'Last updated: '+policyDate+'.');
if(!policy)throw new Error('Bundled privacy policy was not found.');
const websitePolicy='<h2>Local interface interactions</h2><p>The homepage processes pointer positions locally for parallax effects and drag/resize controls. It does not create persistent mouse-position or keystroke logs, collect interaction analytics or track activity across other websites.</p><h2>The public website and demo</h2><p>The public website requests release and support settings from the developer’s backend to connect its install and support links. It does not include an analytics SDK or require a visitor account. Hosting providers receive ordinary connection information and may keep operational logs. The optional browser demo can save homepage preferences on that website’s origin; it is separate from the installed extension’s storage. Optional demo features contact the same services described above when used.</p>';
fs.writeFileSync(path.join(output,'privacy.html'),page({title:'3D Parallax Privacy Policy | Your Data & Choices',description:'Read how 3D Parallax handles local preferences, wallpapers, optional weather and AI, submitted feedback, and the public website.',url:'/privacy.html',label:'Privacy',body:'<article class="policy wrap">'+policy+websitePolicy+'</article>'}));
fs.writeFileSync(path.join(output,'404.html'),page({title:'Page Not Found | 3D Parallax',description:'Find your way back to 3D Parallax, its Chrome extension, installation information and support.',noindex:true,body:'<section class="wrap not-found"><p class="eyebrow">404 · Page not found</p><h1>Let’s get you<br>back home.</h1><p>This page may have moved. Your next tab is still waiting.</p><a class="button primary" href="/">Explore 3D Parallax</a></section>'}));
fs.writeFileSync(path.join(output,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+canonicalPaths.map(url=>`<url><loc>${site.origin}${url}</loc></url>`).join('')+'</urlset>\n');
// Crawlers must reach a resource to read its noindex header/tag. The demo, API
// and manifest retain noindex headers; public pages and assets stay crawlable.
fs.writeFileSync(path.join(output,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+site.origin+'/sitemap.xml\n');
// Keep existing public asset URLs and offer a functional browser demo while the
// website gets its own homepage. Only bundled runtime files enter the demo.
const runtime=['manifest.json','index.html','popup.html','popup.css','extension-links.js','privacy.html','styles.css','ui.css','preferences.js','ui.js','script.js','templates.js','widgets.js','weather.js','wallpaper.js','backgrounds.js','ai-providers.js','ambient.js','setup.js','makeover.js','sharing.js','interactions.js','feedback.js','popup.js','models.json'];
const demo=path.join(output,'demo');fs.mkdirSync(demo,{recursive:true});
for(const name of runtime){let content=fs.readFileSync(path.join(extension,name));if(name==='index.html')content=Buffer.from(content.toString().replace('<title>3D Parallax | Developed by Muhammad Ali Mehdi</title>','<title>3D Parallax Live Demo</title><meta name="robots" content="noindex,follow">'));fs.writeFileSync(path.join(demo,name),content);}
for(const folder of ['icons','vendor'])fs.cpSync(path.join(extension,folder),path.join(demo,folder),{recursive:true});
fs.copyFileSync(path.join(extension,'manifest.json'),path.join(output,'manifest.json'));
const deploy={
  buildCommand:'node scripts/build-website.cjs',outputDirectory:'website-dist',installCommand:'',framework:null,trailingSlash:false,
  redirects:[...site.redirectHosts.map(host=>({source:'/:path*',has:[{type:'host',value:host}],destination:site.origin+'/:path*',permanent:true})),...pageDefinitions.map(item=>({source:'/'+item.file,destination:item.url,permanent:true})),{source:'/privacy',destination:'/privacy.html',permanent:true}],
  rewrites:[{source:'/api/site-config',destination:'https://3-d-parallax-backend.vercel.app/api/config'},...pageDefinitions.filter(item=>item.url!=='/').map(item=>({source:item.url,destination:'/'+item.file}))],
  headers:[{source:'/(.*)',headers:[{key:'X-Content-Type-Options',value:'nosniff'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},{key:'Content-Security-Policy',value:`default-src 'self'; script-src 'self' ${[...schemaHashes].map(hash=>`'${hash}'`).join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' https: data: blob:; connect-src 'self' https:; media-src 'self' https: blob:; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'`}]},{source:'/demo/(.*)',headers:[{key:'X-Robots-Tag',value:'noindex, follow'}]},{source:'/api/(.*)',headers:[{key:'X-Robots-Tag',value:'noindex, nofollow'}]},{source:'/manifest.json',headers:[{key:'X-Robots-Tag',value:'noindex, nofollow'}]}]
};
if(process.argv.includes('--configure'))fs.writeFileSync(path.join(repo,'vercel.json'),JSON.stringify(deploy,null,2)+'\n');
else {const current=JSON.parse(fs.readFileSync(path.join(repo,'vercel.json'),'utf8'));if(JSON.stringify(current)!==JSON.stringify(deploy))throw new Error('Deployment configuration changed. Run node scripts/build-website.cjs --configure and review vercel.json.');}
console.log(`Built ${canonicalPaths.length} canonical public pages, host redirects, SEO files and browser demo; extension ${version} sources unchanged.`);
