/* Local wallpaper collection. Files never leave this browser. */
'use strict';
const Wallpaper = (() => {
  const DB_NAME = 'HomepageWallpaperDB', STORE = 'wallpapers', LIBRARY = 'library';
  const LS_CFG = 'homepage_wallpaper_settings', LS_PAR = 'homepage_wallpaper_parallax';
  const MODE = 'homepage_background_mode', ACTIVE = 'homepage_wallpaper_active_id';
  const MAX = 5;
  const TYPES = ['image/jpeg','image/png','image/webp','image/gif','image/avif','video/mp4','video/webm'];
  let _db, _ready, _url, _el, _dim, _par = false, _revision = 0;
  const changed = () => document.dispatchEvent(new CustomEvent('wallpaper-changed'));
  function mode() { return localStorage.getItem(MODE) || 'theme'; }
  function activeId() { return localStorage.getItem(ACTIVE); }
  function database() {
    if (_ready) return _ready;
    _ready = new Promise((resolve,reject) => {
      const request = indexedDB.open(DB_NAME,2);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
        if (!db.objectStoreNames.contains(LIBRARY)) db.createObjectStore(LIBRARY,{keyPath:'id'});
      };
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('Close other homepage tabs, then try again.'));
      request.onsuccess = () => {
        _db = request.result;
        _db.onversionchange = () => { _db.close(); _ready = null; };
        // Migrate the previous single wallpaper once, without losing the file.
        const tx = _db.transaction([STORE,LIBRARY],'readwrite');
        const library = tx.objectStore(LIBRARY);
        const current = tx.objectStore(STORE).get('current');
        current.onsuccess = () => {
          const count = library.count();
          count.onsuccess = () => {
            const remote = localStorage.getItem('homepage_wallpaper_remote_url');
            if (!count.result && (current.result || remote)) {
              const item = {id:'legacy-wallpaper',name:'My wallpaper',createdAt:Date.now(),blob:current.result || null,url:remote || null};
              library.put(item);
              localStorage.setItem(ACTIVE,item.id);
              if (!localStorage.getItem(MODE)) localStorage.setItem(MODE,'wallpaper');
            }
            tx.objectStore(STORE).delete('current');
          };
        };
        tx.oncomplete = () => resolve(_db);
        tx.onerror = () => reject(tx.error);
      };
    }).catch(error => { _ready = null; throw error; });
    return _ready;
  }
  async function read(store,key) {
    const db = await database();
    return new Promise((resolve,reject) => {
      const req = db.transaction(store).objectStore(store).get(key);
      req.onsuccess = () => resolve(req.result || null); req.onerror = () => reject(req.error);
    });
  }
  async function list() {
    const db = await database();
    return new Promise((resolve,reject) => {
      const req = db.transaction(LIBRARY).objectStore(LIBRARY).getAll();
      req.onsuccess = () => resolve(req.result.sort((a,b) => a.createdAt - b.createdAt));
      req.onerror = () => reject(req.error);
    });
  }
  async function save(item) {
    const db = await database();
    return new Promise((resolve,reject) => {
      const tx = db.transaction(LIBRARY,'readwrite'), store = tx.objectStore(LIBRARY);
      let error;
      const req = store.getAll();
      req.onsuccess = () => {
        const existing = item.remoteId && req.result.find(x => x.remoteId === item.remoteId);
        if (existing) { item = existing; return; }
        if (req.result.length >= MAX) { error = new Error('Your collection is full (5/5). Remove a saved wallpaper to add another.'); tx.abort(); return; }
        store.add(item);
      };
      tx.oncomplete = () => resolve(item);
      tx.onabort = tx.onerror = () => reject(error || new Error('Could not save the wallpaper. Check available browser storage.'));
    });
  }
  function validate(file) {
    if (!(file instanceof Blob) || !TYPES.includes(file.type)) throw new Error('Choose a JPG, PNG, WebP, GIF, AVIF, MP4 or WebM file.');
    const max = file.type.startsWith('video/') ? 80 : 20;
    if (!file.size || file.size > max*1024*1024) throw new Error(`Choose a ${file.type.startsWith('video/') ? 'video' : 'photo'} smaller than ${max} MB.`);
  }
  async function validateMedia(file) {
    validate(file);
    const url=URL.createObjectURL(file),video=file.type.startsWith('video/');
    const media=video ? document.createElement('video') : new Image();
    try {
      await new Promise((resolve,reject)=>{
        const timer=setTimeout(()=>reject(new Error('This file could not be opened. Choose another wallpaper.')),15000);
        const finish=()=>{
          clearTimeout(timer);
          const width=video ? media.videoWidth : media.naturalWidth,height=video ? media.videoHeight : media.naturalHeight;
          width && height && width*height<=50000000 ? resolve() : reject(new Error('Choose a valid wallpaper smaller than 50 megapixels.'));
        };
        media[video ? 'onloadedmetadata' : 'onload']=finish;
        media.onerror=()=>{clearTimeout(timer);reject(new Error('This file is damaged or cannot be opened. Choose another wallpaper.'));};
        if(video)media.preload='metadata';media.src=url;
      });
    }finally{media.onload=media.onloadedmetadata=media.onerror=null;if(video){media.removeAttribute('src');media.load();}URL.revokeObjectURL(url);}
  }
  async function setFromFile(file,metadata = {},use = true) {
    await validateMedia(file);
    const item = await save({id:crypto.randomUUID(),name:String(metadata.name || file.name || 'Wallpaper').slice(0,100),
      blob:file,createdAt:Date.now(),remoteId:metadata.remoteId || null,credit:metadata.credit || ''});
    if (use) await activate(item.id); else changed();
    return item;
  }
  async function setFromUrl(url,metadata = {},use = true) {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') throw new Error('Wallpaper downloads require a secure HTTPS address.');
    const response = await fetch(parsed.href,{credentials:'omit',signal:AbortSignal.timeout(60000)});
    if (!response.ok) throw new Error('The wallpaper could not be downloaded. Please try again.');
    return setFromFile(await response.blob(),metadata,use);
  }
  function _revoke() { if (_url) URL.revokeObjectURL(_url); _url = null; }
  function hide() {
    _revoke();
    if (_el) { _el.replaceChildren(); _el.style.backgroundImage=''; _el.style.transform=''; _el.style.filter=''; _el.style.mixBlendMode=''; }
    if (_dim) _dim.style.background='transparent';
    document.body.classList.remove('wallpaper-active','wp-static','wp-video','wp-subtle');
  }
  function render(item) {
    if (!_el) return;
    hide();
    const video = item.blob?.type.startsWith('video/');
    _url = item.blob ? URL.createObjectURL(item.blob) : null;
    if (video) {
      const v = document.createElement('video'); v.src = _url;
      v.loop = v.muted = v.autoplay = v.playsInline = true;
      Object.assign(v.style,{width:'100%',height:'100%',objectFit:'cover'}); _el.appendChild(v); v.play().catch(()=>{});
    } else {
      _el.style.backgroundImage = `url("${_url || item.url}")`;
      _el.style.backgroundSize='cover'; _el.style.backgroundPosition='center';
    }
    document.body.classList.add('wallpaper-active',video ? 'wp-video' : 'wp-static');
    applySettings(getSettings());
  }
  async function activate(id) {
    const revision = ++_revision, item = await read(LIBRARY,id);
    if (!item) throw new Error('This wallpaper is no longer saved.');
    if (revision !== _revision) return;
    localStorage.setItem(ACTIVE,id); localStorage.setItem(MODE,'wallpaper');
    render(item); changed();
  }
  async function useTheme() {
    ++_revision; localStorage.setItem(MODE,'theme'); hide(); changed();
  }
  async function remove(id) {
    const db = await database();
    await new Promise((resolve,reject) => {
      const tx = db.transaction(LIBRARY,'readwrite'); tx.objectStore(LIBRARY).delete(id);
      tx.oncomplete = resolve; tx.onerror = () => reject(tx.error);
    });
    if (activeId() === id) { localStorage.removeItem(ACTIVE); await useTheme(); }
    changed();
  }
  async function restore() {
    const revision = ++_revision;
    await database();
    if (revision !== _revision) return;
    if (mode() !== 'wallpaper') { hide(); return; }
    const item = activeId() && await read(LIBRARY,activeId());
    if (revision !== _revision) return;
    if (item) render(item); else await useTheme();
  }
  async function init() {
    _el = document.getElementById('wallpaperLayer'); _dim = document.getElementById('dimOverlay');
    _par = localStorage.getItem(LS_PAR) === '1';
    document.addEventListener('mousemove',e => {
      if (!_par || !_el || mode() !== 'wallpaper') return;
      _el.style.transform = `scale(1.08) translate(${(e.clientX/window.innerWidth-.5)*-20}px,${(e.clientY/window.innerHeight-.5)*-20}px)`;
    });
    try { await restore(); changed(); } catch (e) { window.toast?.(e.message,'error'); }
  }
  async function setFromRemoteUrl(url) {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:') return false;
      await new Promise((resolve,reject) => { const img = new Image(); img.onload=resolve; img.onerror=reject; img.src=parsed.href; });
      const item = await save({id:crypto.randomUUID(),name:'Online wallpaper',url:parsed.href,createdAt:Date.now()});
      await activate(item.id); return true;
    } catch (error) { window.toast?.(error.message || 'Could not load this wallpaper.','error'); return false; }
  }
  async function getBlob() { return mode() === 'wallpaper' ? (await read(LIBRARY,activeId()))?.blob || null : null; }
  async function getSource() {
    if (mode() !== 'wallpaper') return {kind:'none'};
    const item = await read(LIBRARY,activeId());
    return item?.blob ? {kind:'embedded',mime:item.blob.type} : item?.url ? {kind:'url',value:item.url} : {kind:'none'};
  }
  function getSettings() { try { return JSON.parse(localStorage.getItem(LS_CFG) || '{}'); } catch { return {}; } }
  function applySettings({blur=0,dim=.3,blend='normal'} = {}) {
    blur=Math.max(0,Math.min(20,Number(blur)||0)); dim=Math.max(0,Math.min(.9,Number(dim)||0));
    if (!['normal','multiply','screen','overlay','soft-light','hard-light','color-dodge','luminosity'].includes(blend)) blend='normal';
    localStorage.setItem(LS_CFG,JSON.stringify({blur,dim,blend}));
    if (mode() !== 'wallpaper') return;
    if (_el) { _el.style.filter=blur ? `blur(${blur}px)` : ''; _el.style.mixBlendMode=blend; }
    if (_dim) _dim.style.background=`rgba(0,0,0,${dim})`;
  }
  async function backup() {
    const db = await database(), item = activeId() && await read(LIBRARY,activeId());
    await new Promise((resolve,reject) => {
      const tx=db.transaction(STORE,'readwrite'); tx.objectStore(STORE).put({mode:mode(),item},'backup');
      tx.oncomplete=resolve; tx.onerror=()=>reject(tx.error);
    });
  }
  async function restoreFromBackup() {
    try {
      const saved = await read(STORE,'backup');
      if (!saved || saved.mode === 'theme') { await useTheme(); return true; }
      if (saved instanceof Blob) { await setFromFile(saved); return true; }
      if (saved.item) {
        if (!await read(LIBRARY,saved.item.id)) await save(saved.item);
        await activate(saved.item.id); return true;
      }
      await useTheme(); return true;
    } catch(error) { window.toast?.(error.message,'error'); return false; }
  }
  async function clearAll() {
    await useTheme();
    const db = await database();
    await new Promise((resolve,reject) => {
      const tx=db.transaction([STORE,LIBRARY],'readwrite'); tx.objectStore(STORE).clear(); tx.objectStore(LIBRARY).clear();
      tx.oncomplete=resolve; tx.onerror=()=>reject(tx.error);
    });
    [MODE,ACTIVE,'homepage_wallpaper_remote_url','homepage_wallpaper_backup_remote'].forEach(k=>localStorage.removeItem(k)); changed();
  }
  // Canvas pixel-sampling — works on local blobs (no taint).
  // Skips near-black/near-white, quantises to 32-step buckets,
  // then normalises the top colours to be neon-bright.
  async function extractPalette() {
    try {
      const blob = await getBlob();
      if (!blob || blob.type.startsWith('video/')) return null;

      return new Promise(resolve => {
        const src = URL.createObjectURL(blob);
        const img = new Image();

        img.onload = () => {
          const sz  = 60;
          const cv  = document.createElement('canvas');
          cv.width  = cv.height = sz;
          const ctx = cv.getContext('2d');
          ctx.drawImage(img, 0, 0, sz, sz);
          URL.revokeObjectURL(src);

          const d = ctx.getImageData(0, 0, sz, sz).data;
          const buckets = {};

          for (let i = 0; i < d.length; i += 4) {
            if (d[i + 3] < 128) continue;
            const r = d[i], g = d[i + 1], b = d[i + 2];
            const brightness = (r + g + b) / 3;
            if (brightness < 40 || brightness > 215) continue;   // skip near-black / near-white
            const rq = Math.round(r / 32) * 32;
            const gq = Math.round(g / 32) * 32;
            const bq = Math.round(b / 32) * 32;
            const k  = `${rq},${gq},${bq}`;
            buckets[k] = (buckets[k] || 0) + 1;
          }

          const colors = Object.entries(buckets)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([k]) => {
              let [r, g, b] = k.split(',').map(Number);
              // Boost so the dominant channel hits 255 (neon-esque)
              const mx = Math.max(r, g, b);
              if (mx > 0) {
                r = Math.min(255, Math.round(r * 255 / mx));
                g = Math.min(255, Math.round(g * 255 / mx));
                b = Math.min(255, Math.round(b * 255 / mx));
              }
              return `rgb(${r},${g},${b})`;
            });

          resolve(colors.length >= 2 ? colors : null);
        };

        img.onerror = () => resolve(null);
        img.src = src;
      });
    } catch { return null; }
  }

  function applyPaletteToTheme(colors) {
    if (!colors || colors.length < 2) return;
    const root = document.documentElement;
    root.style.setProperty('--primary',   colors[0]);
    root.style.setProperty('--secondary', colors[1]);
    if (colors[2]) root.style.setProperty('--accent', colors[2]);
  }

  function enableParallax(on = true) {
    _par = on;
    localStorage.setItem(LS_PAR, on ? '1' : '0');
    if (!on && _el) _el.style.transform = 'scale(1.08)';
  }

  return {init,setFromFile,setFromUrl,setFromRemoteUrl,restore,clear:useTheme,useTheme,clearAll,
    list,activate,remove,mode,activeId,max:MAX,applySettings,getSettings,getBlob,getSource,backup,restoreFromBackup,
    extractPalette,applyPaletteToTheme,enableParallax};
})();
window.Wallpaper = Wallpaper;
