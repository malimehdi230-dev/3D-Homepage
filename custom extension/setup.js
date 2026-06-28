'use strict';
/**
 * Setup — the shared backbone for AI Makeover, Sharing, and the Widget Canvas.
 *
 * A "Setup bundle" (schema v2) fully describes the look of the homepage:
 *   { version, name, wallpaper:{kind,value,settings}, elements:{packId,customSvgs?},
 *     headlines:[], theme:{accent,accent2,text,dark,font?}, ambient, layout:[], links?:[] }
 *
 * applySetup(bundle) snapshots the current setup first so revert() can restore it.
 */
const Setup = (() => {
  const LS_THEME    = 'homepage_setup_theme';     // persisted theme override
  const LS_SNAPSHOT = 'homepage_setup_snapshot';  // revert target
  const LS_WP_QUERY = 'homepage_wallpaper_query';  // last query (for "set manually" hint)

  const DEFAULT_THEME = { accent: '#00f0ff', accent2: '#ff00aa', text: '#ffffff', dark: '#05060a' };

  // ── small utils ───────────────────────────────────────────────────────────
  function _app() { return window.app || null; }

  function _isHex(c) { return typeof c === 'string' && /^#?[0-9a-f]{3,8}$/i.test(c.trim()); }
  function _normHex(c, fallback) {
    if (!_isHex(c)) return fallback;
    let h = c.trim();
    if (h[0] !== '#') h = '#' + h;
    return h;
  }

  // Darken a hex colour by pct (0..1) for bg-secondary gradients.
  function _shade(hex, pct) {
    try {
      let h = hex.replace('#', '');
      if (h.length === 3) h = h.split('').map(x => x + x).join('');
      const n = parseInt(h.slice(0, 6), 16);
      let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
      r = Math.max(0, Math.min(255, Math.round(r * (1 - pct))));
      g = Math.max(0, Math.min(255, Math.round(g * (1 - pct))));
      b = Math.max(0, Math.min(255, Math.round(b * (1 - pct))));
      return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    } catch { return hex; }
  }

  function _readVar(name, fallback) {
    try {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    } catch { return fallback; }
  }

  // ── Theme ───────────────────────────────────────────────────────────────
  function applyTheme(theme, persist = true) {
    const t = {
      accent:  _normHex(theme?.accent,  DEFAULT_THEME.accent),
      accent2: _normHex(theme?.accent2, DEFAULT_THEME.accent2),
      text:    _isHex(theme?.text) ? _normHex(theme.text) : (theme?.text || DEFAULT_THEME.text),
      dark:    _normHex(theme?.dark,    DEFAULT_THEME.dark),
      font:    theme?.font || null
    };
    const root = document.documentElement;
    root.style.setProperty('--primary',   t.accent);
    root.style.setProperty('--secondary', t.accent2);
    root.style.setProperty('--accent',    t.accent2);
    root.style.setProperty('--bg',           t.dark);
    root.style.setProperty('--bg-secondary', _shade(t.dark, 0.35));
    root.style.setProperty('--text', t.text);
    document.body.style.background =
      `linear-gradient(135deg, ${t.dark} 0%, ${_shade(t.dark, 0.35)} 50%, ${t.dark} 100%)`;
    if (t.font) { try { document.body.style.fontFamily = t.font; } catch {} }
    if (persist) { try { localStorage.setItem(LS_THEME, JSON.stringify(t)); } catch {} }
    return t;
  }

  function getCurrentTheme() {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_THEME) || 'null');
      if (saved && saved.accent) return saved;
    } catch {}
    // Fall back to live CSS vars (template-driven)
    return {
      accent:  _readVar('--primary',   DEFAULT_THEME.accent),
      accent2: _readVar('--secondary', DEFAULT_THEME.accent2),
      text:    _readVar('--text',      DEFAULT_THEME.text),
      dark:    _readVar('--bg',        DEFAULT_THEME.dark)
    };
  }

  // ── Wallhaven search (free, SFW, no key) — manual fallback on failure ──────
  async function searchWallpaper(query) {
    const q = String(query || '').trim();
    if (!q) return null;
    try { localStorage.setItem(LS_WP_QUERY, q); } catch {}
    try {
      const url = 'https://wallhaven.cc/api/v1/search?categories=111&purity=100&sorting=relevance&q='
        + encodeURIComponent(q);
      const ctrl = new AbortController();
      const tid = setTimeout(() => { try { ctrl.abort(); } catch {} }, 12000);
      const resp = await fetch(url, { signal: ctrl.signal });
      clearTimeout(tid);
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const data = await resp.json();
      const hits = (data && data.data) || [];
      if (!hits.length) return null;
      // Prefer landscape-ish results near the top
      const pick = hits.find(h => h.dimension_x >= h.dimension_y) || hits[0];
      return pick?.path || null;   // full-res image URL on w.wallhaven.cc
    } catch (e) {
      console.warn('[Setup] Wallhaven search failed:', e.message);
      return null;
    }
  }

  function getLastQuery() { try { return localStorage.getItem(LS_WP_QUERY) || ''; } catch { return ''; } }

  // ── base64 / blob helpers (for embedded local wallpapers) ─────────────────
  function _dataUrlToBlob(dataUrl) {
    try {
      const [head, b64] = String(dataUrl).split(',');
      const mime = (head.match(/data:([^;]+)/) || [, 'image/jpeg'])[1];
      const bin = atob(b64);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      return new Blob([arr], { type: mime });
    } catch { return null; }
  }

  // Downscaled jpeg dataURL of the current wallpaper (for share embedding).
  async function embedCurrentWallpaper(maxW = 1280, quality = 0.72) {
    try {
      const blob = await Wallpaper.getBlob();
      if (!blob || blob.type.startsWith('video/')) return null;
      return await new Promise(resolve => {
        const u = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxW / img.naturalWidth);
          const w = Math.round(img.naturalWidth * scale);
          const h = Math.round(img.naturalHeight * scale);
          const cv = document.createElement('canvas');
          cv.width = w; cv.height = h;
          cv.getContext('2d').drawImage(img, 0, 0, w, h);
          URL.revokeObjectURL(u);
          try { resolve(cv.toDataURL('image/jpeg', quality)); } catch { resolve(null); }
        };
        img.onerror = () => { URL.revokeObjectURL(u); resolve(null); };
        img.src = u;
      });
    } catch { return null; }
  }

  // ── getCurrentSetup ───────────────────────────────────────────────────────
  async function getCurrentSetup(opts = {}) {
    const app = _app();
    // Elements logic removed

    let wallpaper = { kind: 'none', value: null };
    try { wallpaper = await Wallpaper.getSource(); } catch {}
    if (wallpaper.kind === 'embedded' && opts.embedWallpaper) {
      const dataUrl = await embedCurrentWallpaper();
      if (dataUrl) wallpaper.value = dataUrl; else wallpaper = { kind: 'none' };
    } else if (wallpaper.kind === 'embedded' && !opts.embedWallpaper && !opts.keepEmbeddedFlag) {
      // For sharing without embedding: drop to a query hint if we have one, else none
      const q = getLastQuery();
      wallpaper = q ? { kind: 'query', value: q } : { kind: 'none' };
    }
    wallpaper.settings = {
      ...(Wallpaper.getSettings ? Wallpaper.getSettings() : {}),
      parallax: localStorage.getItem('homepage_wallpaper_parallax') === '1'
    };

    const headlines = (app && app.loadHeadlineLines && app.loadHeadlineLines()) ||
                      (app && app.roles) || [];

    const links = (app && Array.isArray(app.links))
      ? app.links.map(l => ({ title: l.name || l.title, url: l.url, icon: l.icon }))
      : [];

    return {
      version: 2,
      name: opts.name || 'My Setup',
      wallpaper,
      // Elements removed
      headlines: Array.isArray(headlines) ? headlines.slice(0, 8) : [],
      theme: getCurrentTheme(),
      ambient: (window.Ambient && Ambient.current()) || null,
      layout: (window.WidgetCanvas && WidgetCanvas.getLayout?.()) || null,
      links
    };
  }

  // ── Validation / normalisation of an incoming bundle ──────────────────────
  function normalize(bundle) {
    const b = (bundle && typeof bundle === 'object') ? bundle : {};
    const wp = (b.wallpaper && typeof b.wallpaper === 'object') ? b.wallpaper : { kind: 'none' };
    const kind = ['query', 'url', 'embedded', 'none'].includes(wp.kind) ? wp.kind : 'none';
    return {
      version: 2,
      name: (typeof b.name === 'string' && b.name.trim()) ? b.name.trim().slice(0, 60) : 'Shared Setup',
      wallpaper: {
        kind,
        value: typeof wp.value === 'string' ? wp.value : null,
        settings: (wp.settings && typeof wp.settings === 'object') ? wp.settings : {}
      },
      elements: {
        packId: typeof b.elements?.packId === 'string' ? b.elements.packId : 'coding',
        customSvgs: Array.isArray(b.elements?.customSvgs)
          ? b.elements.customSvgs.filter(s => typeof s === 'string').slice(0, 24) : undefined
      },
      headlines: Array.isArray(b.headlines)
        ? b.headlines.filter(h => typeof h === 'string' && h.trim()).map(h => h.slice(0, 80)).slice(0, 8)
        : [],
      theme: {
        accent:  _normHex(b.theme?.accent,  DEFAULT_THEME.accent),
        accent2: _normHex(b.theme?.accent2, DEFAULT_THEME.accent2),
        text:    (b.theme?.text || DEFAULT_THEME.text),
        dark:    _normHex(b.theme?.dark,    DEFAULT_THEME.dark),
        font:    typeof b.theme?.font === 'string' ? b.theme.font.slice(0, 60) : undefined
      },
      ambient: (b.ambient === 'rain' || b.ambient === 'lofi') ? b.ambient : null,
      layout: Array.isArray(b.layout) ? b.layout : null,
      links: Array.isArray(b.links)
        ? b.links.filter(l => l && typeof l.url === 'string').slice(0, 24)
            .map(l => ({ title: String(l.title || l.url).slice(0, 40), url: l.url, icon: l.icon }))
        : null
    };
  }

  // ── Snapshot / Revert ─────────────────────────────────────────────────────
  let _snapshot = null;
  async function snapshot() {
    try {
      _snapshot = await getCurrentSetup({ keepEmbeddedFlag: true });
      await Wallpaper.backup();   // preserve the actual blob for exact revert
      try { localStorage.setItem(LS_SNAPSHOT, JSON.stringify(_snapshot)); } catch {}
    } catch (e) { console.warn('[Setup] snapshot failed:', e); }
  }

  function hasSnapshot() {
    if (_snapshot) return true;
    try { return !!localStorage.getItem(LS_SNAPSHOT); } catch { return false; }
  }

  async function revert() {
    let snap = _snapshot;
    if (!snap) { try { snap = JSON.parse(localStorage.getItem(LS_SNAPSHOT) || 'null'); } catch {} }
    if (!snap) return false;
    await applySetup(snap, { snapshot: false, isRevert: true });
    _snapshot = null;
    try { localStorage.removeItem(LS_SNAPSHOT); } catch {}
    document.dispatchEvent(new CustomEvent('setup-reverted'));
    return true;
  }

  // ── applySetup ────────────────────────────────────────────────────────────
  async function applySetup(bundle, options = {}) {
    const { snapshot: doSnap = true, isRevert = false, transition = true } = options;
    const b = normalize(bundle);
    const result = { ok: true, warnings: [] };

    if (doSnap) await snapshot();
    if (transition) _beginTransition();

    // Theme — instant, no async
    try { applyTheme(b.theme); } catch (e) { result.warnings.push('theme'); }

    // Headlines
    try {
      const app = _app();
      if (app && b.headlines.length) {
        app.saveHeadlineLines(b.headlines);
        app.roles = b.headlines;
        app.phraseIndex = 0; app.charIndex = 0;
        app.renderHeadlineLines?.();
      }
    } catch (e) { result.warnings.push('headlines'); }

    // Elements logic removed

    // Wallpaper
    try {
      const wp = b.wallpaper;
      if (isRevert && wp.kind === 'embedded') {
        await Wallpaper.restoreFromBackup();
      } else if (wp.kind === 'none') {
        if (isRevert) await Wallpaper.restoreFromBackup(); else await Wallpaper.clear();
      } else if (wp.kind === 'url' && wp.value) {
        const ok = await Wallpaper.setFromRemoteUrl(wp.value);
        if (!ok) result.warnings.push('wallpaper-load');
      } else if (wp.kind === 'embedded' && wp.value) {
        const blob = _dataUrlToBlob(wp.value);
        if (blob) await Wallpaper.setFromFile(blob); else result.warnings.push('wallpaper-decode');
      } else if (wp.kind === 'query' && wp.value) {
        const url = await searchWallpaper(wp.value);
        if (url) { const ok = await Wallpaper.setFromRemoteUrl(url); if (!ok) result.warnings.push('wallpaper-load'); }
        else { result.warnings.push('wallpaper-query'); result.manualQuery = wp.value; }
      }
      // settings
      if (wp.settings) {
        Wallpaper.applySettings({
          blur:  Number(wp.settings.blur)  || 0,
          dim:   wp.settings.dim != null ? Number(wp.settings.dim) : 0.3,
          blend: wp.settings.blend || 'normal'
        });
        if (typeof wp.settings.parallax === 'boolean') Wallpaper.enableParallax(wp.settings.parallax);
      }
    } catch (e) { console.warn('[Setup] wallpaper apply:', e); result.warnings.push('wallpaper'); }

    // Links
    try {
      const app = _app();
      if (b.links && app && Array.isArray(app.links)) {
        app.links = b.links.map(l => ({ name: l.title, url: l.url, icon: l.icon || 'fas fa-link', color: '#00f0ff' }));
        app.saveLinks?.(); app.renderLinks?.();
      }
    } catch (e) { result.warnings.push('links'); }

    // Layout
    try {
      if (b.layout && window.WidgetCanvas) WidgetCanvas.applyLayout(b.layout);
    } catch (e) { result.warnings.push('layout'); }

    // Ambient
    try {
      if (window.Ambient) { b.ambient ? Ambient.start(b.ambient) : Ambient.stop(); }
    } catch (e) { result.warnings.push('ambient'); }

    if (transition) _endTransition();
    document.dispatchEvent(new CustomEvent('setup-applied', { detail: { bundle: b, result } }));
    return result;
  }

  // ── transition (smooth fade/scale) ────────────────────────────────────────
  function _beginTransition() {
    try {
      const mc = document.querySelector('.main-content');
      if (mc) { mc.style.transition = 'opacity .35s ease, transform .35s ease'; mc.style.opacity = '0.0'; mc.style.transform = 'scale(0.985)'; }
      document.body.classList.add('setup-transitioning');
    } catch {}
  }
  function _endTransition() {
    setTimeout(() => {
      try {
        const mc = document.querySelector('.main-content');
        if (mc) { mc.style.opacity = ''; mc.style.transform = ''; }
        document.body.classList.remove('setup-transitioning');
      } catch {}
    }, 60);
  }

  // ── init — re-apply persisted theme on load ───────────────────────────────
  function init() {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_THEME) || 'null');
      if (saved && saved.accent) applyTheme(saved, false);
    } catch {}
  }

  return {
    init, applyTheme, getCurrentTheme, getCurrentSetup, applySetup, normalize,
    snapshot, revert, hasSnapshot, searchWallpaper, getLastQuery,
    embedCurrentWallpaper, DEFAULT_THEME
  };
})();
window.Setup = Setup;
