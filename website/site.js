'use strict';
(() => {
  const validStore=value=>{
    try{const url=new URL(value);if(url.protocol==='https:'&&url.hostname==='chromewebstore.google.com'&&!url.port&&!url.username&&!url.password&&/^\/detail\/(?:[^/]+\/)?[a-p]{32}\/?$/.test(url.pathname))return url.origin+url.pathname.replace(/\/$/,'');}catch{}
    return '';
  };
  function apply(config){
    const store=validStore(config.chromeStoreUrl),available=!!store;
    document.documentElement.dataset.store=available?'available':'pending';
    document.querySelectorAll('[data-install]').forEach(link=>{
      link.href=store||'/install';
      if(store){link.target='_blank';link.rel='noopener noreferrer';}else{link.removeAttribute('target');link.removeAttribute('rel');}
      link.querySelector('[data-install-label]').textContent=available?'Add to Chrome':'Get 3D Parallax';
    });
    document.querySelectorAll('[data-release-note]').forEach(note=>note.textContent=available?'Available on the Chrome Web Store.':'Our first Chrome Web Store release is under review.');
    const heading=document.querySelector('[data-install-heading]');
    if(heading){
      heading.textContent=available?'Your new tab is ready.':'Our first release is under review.';
      document.querySelector('[data-install-state]').textContent=available?'Available for desktop Chrome':'Chrome Web Store release';
      document.querySelector('[data-install-description]').textContent=available?'Install 3D Parallax from the official Chrome Web Store. Open a new tab after installation to make it your own.':'The official installation link will appear here once the release is approved. In the meantime, explore the homepage in your browser.';
      const link=document.querySelector('[data-store-only]');link.href=store||'/demo/index.html';
      link.querySelector('[data-store-label]').textContent=available?'Add to Chrome':'Try the live demo';
      if(store){link.target='_blank';link.rel='noopener noreferrer';}else{link.removeAttribute('target');link.removeAttribute('rel');}
    }
    try{
      const support=new URL(config.supportUrl);if(support.protocol==='https:'&&!support.username&&!support.password)document.querySelectorAll('[data-support]').forEach(link=>link.href=support.href);
    }catch{}
  }
  async function refresh(manual=false){
    const button=document.querySelector('[data-refresh-install]'),status=document.querySelector('[data-install-status]');
    if(button?.disabled)return;
    if(button)button.disabled=true;
    if(manual&&status)status.textContent='Checking availability…';
    try{
      const response=await fetch('/api/site-config',{credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(10000)});
      if(!response.ok)throw new Error('Unavailable');const config=await response.json();
      if(config.schemaVersion!==1)throw new Error('Invalid configuration');apply(config);
      if(manual&&status)status.textContent=validStore(config.chromeStoreUrl)?'The Chrome Web Store link is available above.':'The release is still under review. Please check back soon.';
    }catch{if(manual&&status)status.textContent='Could not check availability. Please try again shortly.';}
    finally{if(button)button.disabled=false;}
  }
  document.querySelector('[data-refresh-install]')?.addEventListener('click',()=>refresh(true));
  const toggle=document.querySelector('[data-menu-toggle]'),nav=document.querySelector('#main-nav');
  toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav?.classList.contains('open')){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.focus();}});
  nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false');}));
  refresh();
})();
