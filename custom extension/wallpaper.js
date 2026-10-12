'use strict';
// Wallpaper — IndexedDB blob storage, image/video render, parallax, palette extraction
const Wallpaper = (() => {
  const DB_NAME  = 'HomepageWallpaperDB';
  const STORE    = 'wallpapers';
  const KEY      = 'current';
  const KEY_BAK  = 'backup';    // snapshot copy used by Setup Revert
  const LS_CFG   = 'homepage_wallpaper_settings';
  const LS_PAR   = 'homepage_wallpaper_parallax';
  const LS_REMOTE = 'homepage_wallpaper_remote_url';   // remote/query wallpaper URL (no blob)

  let _db  = null;
  let _url = null;   // active object URL — revoked on swap
  let _el  = null;   // #wallpaperLayer
  let _dim = null;   // #dimOverlay
  let _par = false;  // parallax enabled flag

  // ── IndexedDB helpers ────────────────────────────────────────────────────
  function _openDB() {
    if (_db) return Promise.resolve(_db);
    return new Promise((res, rej) => {
      try {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = e => e.target.result.createObjectStore(STORE);
        req.onsuccess  = e => { _db = e.target.result; res(_db); };
        req.onerror    = e => rej(e.target.error);
      } catch (err) {
        rej(err);
      }
    });
  }

  async function _put(blob, key = KEY) {
    try {
      const db = await _openDB();
      return new Promise((res, rej) => {
        try {
          const tx = db.transaction(STORE, 'readwrite');
          tx.objectStore(STORE).put(blob, key);
          tx.oncomplete = res;
          tx.onerror    = e => rej(e.target.error);
        } catch (err) { rej(err); }
      });
    } catch (err) {
      if (typeof window.toast === 'function') window.toast('Wallpaper error: ' + err.message, 'error');
      throw err;
    }
  }

  async function _get(key = KEY) {
    try {
      const db = await _openDB();
      return new Promise((res, rej) => {
        try {
          const tx  = db.transaction(STORE, 'readonly');
          const req = tx.objectStore(STORE).get(key);
          req.onsuccess = e => res(e.target.result || null);
          req.onerror   = e => rej(e.target.error);
        } catch (err) { rej(err); }
      });
    } catch (err) {
      if (typeof window.toast === 'function') window.toast('Wallpaper error: ' + err.message, 'error');
      return null;
    }
  }

  async function _del(key = KEY) {
    try {
      const db = await _openDB();
      return new Promise((res, rej) => {
        try {
          const tx = db.transaction(STORE, 'readwrite');
          tx.objectStore(STORE).delete(key);
          tx.oncomplete = res;
          tx.onerror    = e => rej(e.target.error);
        } catch (err) { rej(err); }
      });
    } catch (err) {
      if (typeof window.toast === 'function') window.toast('Wallpaper error: ' + err.message, 'error');
      throw err;
    }
  }

  // ── Snapshot backup (used by Setup Revert) ───────────────────────────────
  // Copies the current wallpaper blob (if any) to a backup slot, and records
  // whether a remote URL was active so revert can restore the exact state.
  const LS_BAK_REMOTE = 'homepage_wallpaper_backup_remote';
  async function backup() {
    try {
      const blob = await _get(KEY);
      if (blob) { await _put(blob, KEY_BAK); }
      else { try { await _del(KEY_BAK); } catch {} }
    } catch (e) { console.warn('[Wallpaper] backup failed:', e); }
    try {
      const r = localStorage.getItem(LS_REMOTE);
      if (r) localStorage.setItem(LS_BAK_REMOTE, r);
      else localStorage.removeItem(LS_BAK_REMOTE);
    } catch {}
  }

  async function restoreFromBackup() {
    try {
      const blob = await _get(KEY_BAK);
      if (blob) {
        await setFromFile(blob);     // re-renders + clears remote
        return true;
      }
      const r = localStorage.getItem(LS_BAK_REMOTE);
      if (r) return await setFromRemoteUrl(r);
      await clear();
      return true;
    } catch (e) { console.warn('[Wallpaper] restoreFromBackup failed:', e); return false; }
  }

  // ── Rendering ────────────────────────────────────────────────────────────
  function _revoke() {
    if (_url) { URL.revokeObjectURL(_url); _url = null; }
  }

  function _render(blob) {
    _revoke();
    _url = URL.createObjectURL(blob);
    _el.innerHTML = '';
    _el.style.backgroundImage = '';

    if (blob.type.startsWith('video/')) {
      const v = document.createElement('video');
      v.src = _url;
      v.loop = v.muted = v.autoplay = v.playsInline = true;
      Object.assign(v.style, {
        width: '100%', height: '100%', objectFit: 'cover', display: 'block'
      });
      v.play().catch(() => {});
      _el.appendChild(v);
    } else {
      _el.style.backgroundImage  = `url(${_url})`;
      _el.style.backgroundSize   = 'cover';
      _el.style.backgroundPosition = 'center';
    }

    // State classes for the element-visibility state machine
    document.body.classList.remove('wp-video', 'wp-static');
    document.body.classList.add('wallpaper-active',
      blob.type.startsWith('video/') ? 'wp-video' : 'wp-static');
    _applyStored();
  }

  function _applyStored() {
    try {
      applySettings(JSON.parse(localStorage.getItem(LS_CFG) || '{}'));
    } catch {}
  }

  // ── Public API ───────────────────────────────────────────────────────────
  async function init() {
    _el  = document.getElementById('wallpaperLayer');
    _dim = document.getElementById('dimOverlay');
    if (!_el || !_dim) return;

    _par = localStorage.getItem(LS_PAR) === '1';

    // Parallax mousemove — only active when _par is true
    document.addEventListener('mousemove', e => {
      if (!_par || !_el) return;
      const x = (e.clientX / window.innerWidth  - 0.5) * -20;
      const y = (e.clientY / window.innerHeight - 0.5) * -20;
      _el.style.transform = `scale(1.08) translate(${x}px, ${y}px)`;
    });

    await restore();
  }

  async function setFromFile(file) {
    try { localStorage.removeItem(LS_REMOTE); } catch {}
    await _put(file);
    _render(file);
  }

  async function setFromUrl(url) {
    const resp = await fetch(url);
    const blob = await resp.blob();
    try { localStorage.removeItem(LS_REMOTE); } catch {}
    await _put(blob);
    _render(blob);
  }

  // Remote / query wallpaper — rendered directly via background-image so it works
  // cross-origin without fetch (no CORS, no canvas taint). Persisted as a URL only.
  function _renderRemote(url) {
    if (!_el) return;
    _revoke();
    _el.innerHTML = '';
    _el.style.backgroundImage    = `url("${url}")`;
    _el.style.backgroundSize     = 'cover';
    _el.style.backgroundPosition = 'center';
    document.body.classList.remove('wp-video');
    document.body.classList.add('wallpaper-active', 'wp-static');
    _applyStored();
  }

  // Returns a promise that resolves true once the image actually loads (or false on error).
  function setFromRemoteUrl(url) {
    return new Promise(resolve => {
      if (!url || typeof url !== 'string') return resolve(false);
      const probe = new Image();
      probe.onload = async () => {
        try { await _del(); } catch {}          // drop any stored blob — remote wins
        try { localStorage.setItem(LS_REMOTE, url); } catch {}
        _renderRemote(url);
        resolve(true);
      };
      probe.onerror = () => resolve(false);
      probe.src = url;
    });
  }

  async function restore() {
    try {
      const blob = await _get();
      if (blob) { _render(blob); return; }
      const remote = localStorage.getItem(LS_REMOTE);
      if (remote) _renderRemote(remote);
    } catch (e) {
      console.warn('[Wallpaper] restore failed:', e);
    }
  }

  // Describes the current wallpaper for the Setup bundle.
  async function getSource() {
    try {
      const blob = await _get();
      if (blob) return { kind: 'embedded', mime: blob.type };
    } catch {}
    const remote = localStorage.getItem(LS_REMOTE);
    if (remote) return { kind: 'url', value: remote };
    return { kind: 'none' };
  }

  async function clear() {
    _revoke();
    try { localStorage.removeItem(LS_REMOTE); } catch {}
    try { await _del(); } catch {}
    if (_el) {
      _el.innerHTML = '';
      _el.style.backgroundImage = '';
      _el.style.transform = '';
      _el.style.filter = '';
      _el.style.mixBlendMode = '';
    }
    if (_dim) _dim.style.background = 'rgba(0,0,0,0)';
    document.body.classList.remove('wallpaper-active', 'wp-video', 'wp-static', 'wp-subtle');
  }

  function getSettings() {
    try { return JSON.parse(localStorage.getItem(LS_CFG) || '{}'); }
    catch { return {}; }
  }

  function applySettings({ blur = 0, dim = 0.3, blend = 'normal' } = {}) {
    localStorage.setItem(LS_CFG, JSON.stringify({ blur, dim, blend }));
    if (_el) {
      _el.style.filter       = blur > 0 ? `blur(${blur}px)` : '';
      _el.style.mixBlendMode = blend !== 'normal' ? blend : '';
    }
    if (_dim) {
      _dim.style.background = `rgba(0,0,0,${dim})`;
    }
  }

  async function getBlob() {
    return _get();
  }

  // Canvas pixel-sampling — works on local blobs (no taint).
  // Skips near-black/near-white, quantises to 32-step buckets,
  // then normalises the top colours to be neon-bright.
  async function extractPalette() {
    try {
      const blob = await _get();
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

  async function clearAll() {
    await clear();
    await _del(KEY_BAK);
  }

  return {
    init, setFromFile, setFromUrl, setFromRemoteUrl, restore, clear, clearAll,
    applySettings, getSettings, getBlob, getSource, backup, restoreFromBackup,
    extractPalette, applyPaletteToTheme, enableParallax
  };
})();
