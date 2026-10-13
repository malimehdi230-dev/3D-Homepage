/* Backend configuration is validated data. All executable code is bundled here. */
'use strict';
const ExtensionService = (() => {
  const BASE='https://3-d-parallax-backend.vercel.app';
  const DEFAULT={libraryEnabled:true,aiEnabled:true,ambientEnabled:true,feedbackEnabled:true,libraryReady:false,
    libraryTitle:'Wallpaper library',categories:[],defaultTheme:'minimal',announcement:{id:'',text:''},
    supportUrl:'https://github.com/malimehdi230-dev/3D-Homepage/issues',libraryPageSize:24,featuredOnly:false};
  const firstInstall=!localStorage.getItem('homepage_template');
  let settings={...DEFAULT};
  function validate(input) {
    const data={...DEFAULT};
    if(!input || input.schemaVersion!==1)return data;
    for(const key of ['libraryEnabled','aiEnabled','ambientEnabled','feedbackEnabled','libraryReady','featuredOnly'])if(typeof input[key]==='boolean')data[key]=input[key];
    if(typeof input.libraryTitle==='string')data.libraryTitle=input.libraryTitle.slice(0,80);
    if(Array.isArray(input.categories))data.categories=input.categories.filter(x=>typeof x==='string' && x.length<=40).slice(0,30);
    if(Object.hasOwn(TEMPLATES,input.defaultTheme))data.defaultTheme=input.defaultTheme;
    if(input.announcement && typeof input.announcement.id==='string' && typeof input.announcement.text==='string')data.announcement={id:input.announcement.id.slice(0,80),text:input.announcement.text.slice(0,280)};
    try{const url=new URL(input.supportUrl);if(url.protocol==='https:' && !url.username && !url.password)data.supportUrl=url.href;}catch{}
    if(Number.isInteger(input.libraryPageSize) && input.libraryPageSize>=6 && input.libraryPageSize<=48)data.libraryPageSize=input.libraryPageSize;
    return data;
  }
  async function request(path) {
    const response=await fetch(BASE+path,{credentials:'omit',signal:AbortSignal.timeout(12000)});
    const data=await response.json();
    if(!response.ok)throw new Error(data.error || 'Could not load the library. Please try again.');
    return data;
  }
  function apply() {
    document.body.classList.toggle('service-ai-off',!settings.aiEnabled);
    document.body.classList.toggle('service-ambient-off',!settings.ambientEnabled);
    document.body.classList.toggle('service-feedback-off',!settings.feedbackEnabled);
    const support=document.getElementById('serviceSupportLink');if(support)support.href=settings.supportUrl;
    if(!settings.ambientEnabled) { const saved=localStorage.getItem('homepage_ambient_kind'); Ambient.stop(); if(saved)localStorage.setItem('homepage_ambient_kind',saved); }
    const previous=document.getElementById('serviceAnnouncement');previous?.remove();
    const note=settings.announcement;
    if(note.id && note.text && localStorage.getItem('homepage_announcement_dismissed')!==note.id) {
      const bar=document.createElement('aside');bar.id='serviceAnnouncement';bar.setAttribute('aria-label','Announcement');
      const text=document.createElement('span');text.textContent=note.text;
      const button=document.createElement('button');button.type='button';button.textContent='×';button.setAttribute('aria-label','Dismiss announcement');
      button.onclick=()=>{localStorage.setItem('homepage_announcement_dismissed',note.id);bar.remove();};bar.append(text,button);document.body.append(bar);
    }
    document.dispatchEvent(new CustomEvent('extension-config-changed'));
  }
  async function refresh() {
    try {
      const response=await request('/api/config');settings=validate(response);
      localStorage.setItem('homepage_service_config',JSON.stringify({...response,cachedAt:Date.now()}));
      apply();return settings;
    }catch(error){return settings;}
  }
  async function init() {
    const baseline=localStorage.getItem('homepage_template');
    try{const cached=JSON.parse(localStorage.getItem('homepage_service_config') || 'null');if(cached && Date.now()-cached.cachedAt<86400000)settings=validate(cached);}catch{}
    apply();await refresh();
    if(firstInstall && localStorage.getItem('homepage_template')===baseline && Wallpaper.mode()==='theme')window.app?.applyTemplate(settings.defaultTheme);
  }
  return {init,refresh,request,config:()=>settings,enabled:key=>settings[key]!==false};
})();
window.ExtensionService=ExtensionService;

const BackgroundPicker = (() => {
  const $=selector=>document.querySelector(selector);
  let activeTab='themes',page=1,total=0,pageSize=24,loadId=0;
  const previews=new Map();
  function button(label,action,className='btn btn-secondary btn-sm') {
    const element=document.createElement('button');element.type='button';element.className=className;element.textContent=label;element.onclick=action;return element;
  }
  function status(text,error=false) {const node=$('#libraryStatus');node.textContent=text;node.classList.toggle('background-error',error);}
  async function renderSaved(target) {
    const items=await Wallpaper.list();
    for(const url of previews.get(target) || [])URL.revokeObjectURL(url);
    previews.set(target,[]);target.replaceChildren();
    for(const item of items) {
      const card=document.createElement('article');card.className='saved-wallpaper';
      const selected=Wallpaper.mode()==='wallpaper' && Wallpaper.activeId()===item.id;card.classList.toggle('selected',selected);
      const use=button('',async()=>{try{await Wallpaper.activate(item.id);window.toast?.('Wallpaper applied.','success');}catch(error){window.toast?.(error.message,'error');}},'wallpaper-preview');
      use.setAttribute('aria-label','Use '+item.name);use.setAttribute('aria-pressed',String(selected));
      const video=item.blob?.type.startsWith('video/'), media=document.createElement(video ? 'video' : 'img');
      const src=item.blob ? URL.createObjectURL(item.blob) : item.url;if(item.blob)previews.get(target).push(src);
      media.src=src;if(video){media.muted=true;media.preload='metadata';}else{media.alt=item.name;media.loading='lazy';}
      use.append(media);if(video){const mark=document.createElement('span');mark.className='wallpaper-badge';mark.textContent='Video';use.append(mark);}
      if(selected){const mark=document.createElement('span');mark.className='wallpaper-badge active-badge';mark.textContent='In use';use.append(mark);}
      const title=document.createElement('p');title.className='wallpaper-name';title.textContent=item.name;
      const actions=document.createElement('div');actions.className='wallpaper-actions';
      const remove=button('Remove',async()=>{if(confirm(`Remove “${item.name}” from your saved wallpapers?`))try{await Wallpaper.remove(item.id);}catch(error){window.toast?.(error.message,'error');}});
      remove.setAttribute('aria-label','Remove '+item.name);
      actions.append(button(selected ? 'In use' : 'Use',use.onclick,selected ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'),remove);
      card.append(use,title,actions);target.append(card);
    }
    if(!items.length){const empty=document.createElement('p');empty.className='background-empty';empty.textContent='Save a favorite photo or video here. Your wallpapers stay on this device.';target.append(empty);}
    document.querySelectorAll('.wallpaper-count').forEach(node=>node.textContent=`${items.length}/5 saved`);
    document.querySelectorAll('[data-upload-wallpaper]').forEach(node=>{node.disabled=items.length>=Wallpaper.max;node.title=items.length>=Wallpaper.max ? 'Remove a saved wallpaper to make room.' : 'Add a photo or video';});
  }
  async function sync() {
    try {
      const theme=Wallpaper.mode()==='theme';
      document.querySelectorAll('.background-current').forEach(node=>node.textContent=theme ? `Built-in theme · ${TEMPLATES[window.app.currentTemplate]?.name || 'Minimal Dark'}` : 'Saved wallpaper');
      document.querySelectorAll('[data-use-theme]').forEach(node=>node.setAttribute('aria-pressed',String(theme)));
      await renderSaved($('#savedWallpaperGrid'));await renderSaved($('#settingsWallpaperGrid'));
      window.app?._updateWpThumbnail();
      window.app?.renderTemplateGrid();
    }catch(error){window.toast?.(error.message,'error');}
  }
  function selectTab(id) {
    activeTab=id;
    document.querySelectorAll('[data-background-tab]').forEach(node=>{const selected=node.dataset.backgroundTab===id;node.setAttribute('aria-selected',String(selected));node.tabIndex=selected ? 0 : -1;});
    $('#templateGrid').hidden=id!=='themes';$('#savedWallpaperPanel').hidden=id!=='saved';$('#libraryPanel').hidden=id!=='library';
    if(id==='library'){page=1;loadLibrary();}
  }
  function open(id='themes') {window.app.closeAllModals();window.app.openTemplateModal();selectTab(id);sync();}
  async function download(item,use=false) {
    if(use && (await Wallpaper.list()).length>=5 && !(await Wallpaper.list()).some(x=>x.remoteId===item.id))throw new Error('Your collection is full (5/5). Remove a saved wallpaper to make room.');
    const url=new URL(item.url);if(url.protocol!=='https:')throw new Error('Invalid download address.');
    if(use){await Wallpaper.setFromUrl(url.href,{name:item.title,remoteId:item.id,credit:item.credit},true);window.toast?.('Saved and applied. Available offline.','success');}
    else {
      const response=await fetch(url.href,{credentials:'omit',signal:AbortSignal.timeout(60000)});if(!response.ok)throw new Error('Download failed. Please try again.');
      const blob=await response.blob();const link=document.createElement('a'),src=URL.createObjectURL(blob);
      const ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif','image/avif':'avif','video/mp4':'mp4','video/webm':'webm'}[blob.type] || 'jpg';
      link.href=src;link.download=item.title.replace(/[^a-z0-9 _-]/gi,'').slice(0,80)+'.'+ext;link.click();setTimeout(()=>URL.revokeObjectURL(src),10000);
    }
  }
  async function loadLibrary() {
    const revision=++loadId;$('#wallpaperLibraryGrid').replaceChildren();status('Loading wallpapers…');$('#libraryPrevious').disabled=$('#libraryNext').disabled=true;
    await ExtensionService.refresh();const config=ExtensionService.config();
    if(revision!==loadId)return;
    $('#libraryTitle').textContent=config.libraryTitle;
    if(!config.libraryEnabled){status('The wallpaper library is temporarily unavailable. Your saved wallpapers are still here.');return;}
    const category=$('#wallpaperCategory').value;
    $('#wallpaperCategory').replaceChildren(new Option('All categories',''),...config.categories.map(x=>new Option(x,x)));
    $('#wallpaperCategory').value=config.categories.includes(category) ? category : '';
    try {
      const params=new URLSearchParams({page:String(page),search:$('#wallpaperSearch').value.trim(),category:$('#wallpaperCategory').value});
      const response=await ExtensionService.request('/api/wallpapers?'+params);
      if(revision!==loadId)return;
      if(!Array.isArray(response.items))throw new Error('The library returned an invalid response.');
      total=Number(response.total)||0;pageSize=response.pageSize || 24;
      for(const item of response.items) {
        if(typeof item.id!=='string' || typeof item.title!=='string' || typeof item.url!=='string' || typeof item.mime!=='string')continue;
        try{if(new URL(item.url).protocol!=='https:')continue;}catch{continue;}
        const card=document.createElement('article');card.className='saved-wallpaper library-wallpaper';
        const preview=document.createElement('div');preview.className='wallpaper-preview';
        const video=item.mime.startsWith('video/'),media=document.createElement(video ? 'video' : 'img');
        media.src=item.url;if(video){media.muted=true;media.preload='metadata';}else{media.alt=item.title;media.loading='lazy';}preview.append(media);
        const title=document.createElement('p');title.className='wallpaper-name';title.textContent=item.title;
        const detail=document.createElement('p');detail.className='wallpaper-credit';detail.textContent=[item.category,item.credit,item.license].filter(Boolean).join(' · ');
        const actions=document.createElement('div');actions.className='wallpaper-actions';
        for(const [label,use] of [['Save & use',true],['Download',false]]) {
          const action=button(label,async()=>{
            action.disabled=true;action.textContent=use ? 'Saving…' : 'Downloading…';
            try{await download(item,use);status(use ? 'Saved to My wallpapers and applied.' : 'Download started.');}catch(error){status(error.message,true);}finally{action.disabled=false;action.textContent=label;}
          },use ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm');actions.append(action);
        }
        card.append(preview,title,detail,actions);$('#wallpaperLibraryGrid').append(card);
      }
      status(total ? `${total} wallpapers · page ${page} of ${Math.max(1,Math.ceil(total/pageSize))}` : 'No wallpapers yet. Try another search or check back for a new collection.');
      $('#libraryPrevious').disabled=page===1;$('#libraryNext').disabled=page*pageSize>=total;
    }catch(error){if(revision===loadId)status(error.message || 'Could not reach the library. Check your connection and try again.',true);}
  }
  function init() {
    const modal=$('#templateModal .modal');modal.classList.add('background-modal');
    modal.querySelector('.modal-title').textContent='Choose your background';
    modal.querySelector('.settings-section-desc,.modal-desc,p')?.remove();
    const nav=document.createElement('div');nav.className='background-tabs';nav.setAttribute('role','tablist');nav.setAttribute('aria-label','Background source');
    for(const [id,label] of [['themes','Built-in themes'],['saved','My wallpapers'],['library','Library']]) {
      const node=button(label,()=>selectTab(id),'background-tab');node.dataset.backgroundTab=id;node.setAttribute('role','tab');node.id='background-tab-'+id;node.setAttribute('aria-controls',id==='themes' ? 'templateGrid' : id==='saved' ? 'savedWallpaperPanel' : 'libraryPanel');nav.append(node);
    }
    nav.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const ids=['themes','saved','library'];let index=ids.indexOf(activeTab);index=e.key==='Home' ? 0 : e.key==='End' ? 2 : (index+(e.key==='ArrowRight' ? 1 : 2))%3;selectTab(ids[index]);$('#background-tab-'+ids[index]).focus();});
    $('#templateGrid').before(nav);
    $('#templateGrid').setAttribute('role','tabpanel');$('#templateGrid').setAttribute('aria-labelledby','background-tab-themes');
    modal.insertAdjacentHTML('beforeend',`<section id="savedWallpaperPanel" role="tabpanel" aria-labelledby="background-tab-saved" hidden><div class="background-toolbar"><p>Keep up to five photos or videos, ready whenever you want.</p><span class="wallpaper-count"></span><button type="button" class="btn btn-primary" data-upload-wallpaper>+ Add wallpaper</button></div><p class="background-current"></p><div id="savedWallpaperGrid" class="wallpaper-gallery"></div><p class="form-hint">Photos up to 20 MB · MP4/WebM videos up to 80 MB · stored on this device</p></section><section id="libraryPanel" role="tabpanel" aria-labelledby="background-tab-library" hidden><div class="background-toolbar"><h3 id="libraryTitle">Wallpaper library</h3><button type="button" id="refreshWallpaperLibrary" class="btn btn-secondary">Refresh</button></div><form id="wallpaperSearchForm" class="wallpaper-search"><input id="wallpaperSearch" class="form-input" type="search" placeholder="Search wallpapers" aria-label="Search wallpapers" maxlength="100"><select id="wallpaperCategory" class="form-input" aria-label="Wallpaper category"><option value="">All categories</option></select><button class="btn btn-secondary">Search</button></form><p id="libraryStatus" role="status" aria-live="polite"></p><div id="wallpaperLibraryGrid" class="wallpaper-gallery"></div><div class="background-pagination"><button type="button" id="libraryPrevious" class="btn btn-secondary">Previous</button><button type="button" id="libraryNext" class="btn btn-secondary">Next</button></div></section>`);
    const pane=$('#settings-pane-appearance');
    pane.querySelector('.settings-pane-heading .btn')?.remove();
    const old=pane.querySelector('.settings-section');
    const picker=old.querySelector('.wp-picker-row');picker.hidden=true;
    const details=document.createElement('details');details.className='wallpaper-adjustments';
    const summary=document.createElement('summary');summary.textContent='Wallpaper adjustments';old.before(details);details.append(summary,old);
    old.querySelector('.settings-section-desc').textContent='Adjust blur, dimming and depth for your selected wallpaper.';
    const panel=document.createElement('section');panel.className='settings-section collection-section';
    panel.innerHTML='<div class="background-toolbar"><p class="background-current"></p><span class="wallpaper-count"></span></div><div class="background-choice-actions"><button type="button" class="btn btn-secondary" data-use-theme>Use built-in theme</button><button type="button" class="btn btn-secondary" id="browseBackgrounds">Browse themes & library</button><button type="button" class="btn btn-primary" data-upload-wallpaper>+ Add wallpaper</button></div><div id="settingsWallpaperGrid" class="wallpaper-gallery"></div>';
    details.before(panel);
    $('[data-use-theme]').onclick=async()=>{await Wallpaper.useTheme();window.app.applyTemplate(window.app.currentTemplate);};
    $('#browseBackgrounds').onclick=()=>open('themes');
    document.querySelectorAll('[data-upload-wallpaper]').forEach(node=>node.onclick=()=>$('#wallpaperFilePicker').click());
    $('#wallpaperClearBtn').title='Use built-in theme';$('#wallpaperClearBtn').setAttribute('aria-label','Use built-in theme');
    $('#wallpaperFilePicker').accept='image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm';
    $('#wallpaperSearchForm').onsubmit=e=>{e.preventDefault();page=1;loadLibrary();};
    $('#wallpaperCategory').onchange=()=>{page=1;loadLibrary();};$('#refreshWallpaperLibrary').onclick=()=>{page=1;loadLibrary();};
    $('#libraryPrevious').onclick=()=>{if(page>1){page--;loadLibrary();}};$('#libraryNext').onclick=()=>{if(page*pageSize<total){page++;loadLibrary();}};
    document.addEventListener('wallpaper-changed',sync);
    document.addEventListener('extension-config-changed',()=>{const enabled=ExtensionService.enabled('libraryEnabled');$('#background-tab-library').disabled=!enabled;if(!enabled && activeTab==='library')selectTab('saved');});
    window.addEventListener('storage',event=>{if(['homepage_background_mode','homepage_wallpaper_active_id'].includes(event.key))Wallpaper.restore().then(sync);});
    selectTab('themes');sync();ExtensionService.init();
  }
  return {init,open,sync,selectTab};
})();
window.BackgroundPicker=BackgroundPicker;
document.addEventListener('DOMContentLoaded',BackgroundPicker.init);
