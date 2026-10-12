'use strict';
/**
 * WidgetCanvas — a customizable, draggable/resizable widget layout on a snap grid.
 *
 * When a layout exists the classic centered .main-content is hidden and widgets
 * are rendered onto #widgetCanvas. Edit mode allows move / resize / add / remove
 * / per-widget settings. The layout persists and is exposed for the Setup bundle.
 *
 * Custom lightweight grid (pointer events) — no external drag/grid library,
 * which keeps it MV3-safe and tiny.
 */
const WidgetCanvas = (() => {
  const LS_LAYOUT = 'homepage_widget_layout';
  const LS_TODO   = 'homepage_widget_todo';
  const LS_NOTES  = 'homepage_widget_notes';

  const COLS = 12;
  const ROWH = 64;     // px per row unit
  const GAP  = 12;     // px gap

  let _layout  = null;   // null = classic view
  let _edit    = false;
  let _canvas  = null;
  let _editBar = null;
  let _clockTimer = null;
  const _history = [];
  let _settingsCleanup = null;
  const _weatherCache = new Map();
  const _measure = document.createElement('canvas').getContext('2d');
  const _contentObserver = new ResizeObserver(entries => {
    entries.forEach(({ target }) => _sizeContent(target));
  });

  function _remember() {
    _history.push(JSON.stringify(_layout));
    if (_history.length > 30) _history.shift();
    _updateUndo();
  }
  function _updateUndo() {
    const button = document.getElementById('widgetUndoBtn');
    if (button) button.disabled = !_history.length;
  }
  function undo() {
    if (!_history.length) return;
    _layout = JSON.parse(_history.pop());
    if (!_layout) { _edit = false; _editBar.style.display = 'none'; document.body.classList.remove('layout-editing'); }
    _save(); _renderView(); _updateUndo();
  }

  // ── Widget catalogue ──────────────────────────────────────────────────────
  const WIDGETS = {
    clock:      { label: 'Clock',         icon: 'fa-clock',           w: 4, h: 2, minW: 3, maxW: 8,  minH: 1, maxH: 4  },
    date:       { label: 'Date',          icon: 'fa-calendar-day',    w: 4, h: 1, minW: 3, maxW: 8,  minH: 1, maxH: 2  },
    greeting:   { label: 'Greeting',      icon: 'fa-hand-sparkles',   w: 6, h: 1, minW: 3, maxW: 12, minH: 1, maxH: 2  },
    headline:   { label: 'Headline',      icon: 'fa-heading',         w: 8, h: 1, minW: 3, maxW: 12, minH: 1, maxH: 2  },
    search:     { label: 'Search bar',    icon: 'fa-magnifying-glass',w: 12, h: 1, minW: 4, maxW: 12, minH: 1, maxH: 2 },
    quicklinks: { label: 'Quick Links',   icon: 'fa-link',            w: 12, h: 2, minW: 4, maxW: 12, minH: 1, maxH: 4 },
    weather:    { label: 'Weather',       icon: 'fa-cloud-sun',       w: 4, h: 2, minW: 2, maxW: 6,  minH: 1, maxH: 4  },
    todo:       { label: 'To-do',         icon: 'fa-list-check',      w: 4, h: 3, minW: 2, maxW: 8,  minH: 2, maxH: 8  },
    notes:      { label: 'Notes',         icon: 'fa-note-sticky',     w: 4, h: 3, minW: 2, maxW: 8,  minH: 2, maxH: 8  },
    countdown:  { label: 'Countdown',     icon: 'fa-hourglass-half',  w: 4, h: 2, minW: 2, maxW: 6,  minH: 1, maxH: 4  },
    ambient:    { label: 'Ambient player',icon: 'fa-music',           w: 4, h: 2, minW: 3, maxW: 8,  minH: 2, maxH: 4  },
    name:       { label: 'Name',          icon: 'fa-signature',       w: 8, h: 2, minW: 3, maxW: 12, minH: 1, maxH: 4  },
    askai:      { label: 'Ask AI',        icon: 'fa-robot',           w: 4, h: 6, minW: 3, maxW: 8,  minH: 4, maxH: 12 },
  };

  const DEFAULT_LAYOUT = [
    { widget: 'greeting',   x: 0, y: 0, w: 12, h: 1, props: {} },
    { widget: 'clock',      x: 0, y: 1, w: 4,  h: 2, props: {} },
    { widget: 'date',       x: 4, y: 1, w: 4,  h: 1, props: {} },
    { widget: 'weather',    x: 8, y: 1, w: 4,  h: 2, props: {} },
    { widget: 'headline',   x: 4, y: 2, w: 4,  h: 1, props: {} },
    { widget: 'search',     x: 2, y: 3, w: 8, h: 1, props: {} },
    { widget: 'quicklinks', x: 2, y: 4, w: 8, h: 2, props: {} }
  ];

  // ── Storage ─────────────────────────────────────────────────────────────
  function _save() {
    try { localStorage.setItem(LS_LAYOUT, _layout ? JSON.stringify(_layout) : ''); } catch {}
    document.dispatchEvent(new Event('layout-changed'));
  }
  function _load() {
    try {
      const raw = localStorage.getItem(LS_LAYOUT);
      if (!raw) return null;
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.filter(i => i && WIDGETS[i.widget]).map(i => {
        const def = WIDGETS[i.widget];
        const w = _clamp(Number(i.w) || def.w, def.minW, def.maxW);
        return { ...i, id: i.id || _uid(), w, h: _clamp(Number(i.h) || def.h, def.minH, def.maxH), x: _clamp(Number(i.x) || 0, 0, COLS - w), y: Math.max(0, Number(i.y) || 0), props: i.props || {} };
      }) : null;
    } catch { return null; }
  }
  function _uid() { return 'w_' + Math.random().toString(36).slice(2, 8); }

  function _esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ── Public layout accessors (for Setup bundle) ────────────────────────────
  function getLayout() {
    return _layout ? _layout.map(i => ({ widget: i.widget, x: i.x, y: i.y, w: i.w, h: i.h, props: i.props || {}, hidden: !!i.hidden })) : null;
  }

  function applyLayout(layout) {
    _remember();
    if (!Array.isArray(layout) || !layout.length) { _layout = null; _save(); _renderView(); return; }
    _layout = layout
      .filter(i => i && WIDGETS[i.widget])
      .map(i => ({
        id: _uid(), widget: i.widget,
        x: _clamp(i.x | 0, 0, COLS - 1), y: Math.max(0, i.y | 0),
        w: _clamp(i.w | 0 || WIDGETS[i.widget].w, WIDGETS[i.widget].minW, WIDGETS[i.widget].maxW),
        h: _clamp(i.h | 0 || WIDGETS[i.widget].h, WIDGETS[i.widget].minH, WIDGETS[i.widget].maxH),
        props: (i.props && typeof i.props === 'object') ? i.props : {},
        hidden: !!i.hidden
      }));
    _layout.forEach(i => { i.x = Math.min(i.x, COLS - i.w); });
    _save();
    _renderView();
  }

  function _clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  // ── View switching: classic vs canvas ─────────────────────────────────────
  function _renderView() {
    const main = document.querySelector('.main-content');
    if (!_layout) {
      if (main) main.style.display = '';
      if (_canvas) { _canvas.style.display = 'none'; _canvas.innerHTML = ''; }
      _stopClock();
      return;
    }
    if (main) main.style.display = 'none';
    if (_canvas) _canvas.style.display = '';
    _renderWidgets();
    _startClock();
  }

  // ── Render all widget cards ───────────────────────────────────────────────
  function _renderWidgets() {
    if (!_canvas || !_layout) return;
    _contentObserver.disconnect();
    _canvas.innerHTML = '';
    _canvas.classList.toggle('editing', _edit);

    // canvas height = max row used
    let maxRow = 1;
    const stacked = !_edit && window.innerWidth < 700;
    _layout.forEach(i => { if (_edit || !i.hidden) maxRow = Math.max(maxRow, i.y + i.h); });
    if (stacked) maxRow = Math.max(1, _layout.filter(i => !i.hidden).reduce((sum,i) => sum + i.h, 0));
    _canvas.style.setProperty('--rows', maxRow);

    let stackY = 0;
    _layout.forEach(item => {
      if (item.hidden && !_edit) return;
      const card = document.createElement('div');
      card.className = 'widget-card' + (item.hidden ? ' widget-hidden' : '');
      card.dataset.id = item.id;
      card.dataset.widget = item.widget;
      _positionCard(card, stacked ? { ...item, x: 0, y: stackY, w: COLS } : item);
      if (stacked) stackY += item.h;

      const def = WIDGETS[item.widget];
      const isLinks = item.widget === 'quicklinks';
      const addLinkPillHtml = '';

      card.innerHTML =
        (_edit
          ? `<div class="widget-chrome">
              <span class="widget-drag" tabindex="0" role="button" aria-label="Move ${_esc(def.label)} with arrow keys" title="Drag or use arrow keys to move"><i class="fas fa-grip-vertical"></i> ${_esc(def.label)}</span>
              <span class="widget-tools">
                ${isLinks ? addLinkPillHtml : ''}
                <button class="widget-tool" data-act="settings" title="${_esc(def.label)} settings" aria-label="${_esc(def.label)} settings"><i class="fas fa-sliders"></i></button>
                <button class="widget-tool" data-act="hide" title="${item.hidden ? 'Show' : 'Hide'} ${_esc(def.label)}" aria-label="${item.hidden ? 'Show' : 'Hide'} ${_esc(def.label)}" aria-pressed="${!item.hidden}"><i class="fas fa-eye${item.hidden ? '-slash' : ''}"></i></button>
                <button class="widget-tool" data-act="remove" title="Remove ${_esc(def.label)}" aria-label="Remove ${_esc(def.label)}"><i class="fas fa-xmark"></i></button>
              </span>
            </div>`
          : ''
        ) +
        `<div class="widget-body" data-w="${item.widget}"></div>` +
        (_edit ? `<div class="widget-resize" title="Resize"><i class="fas fa-up-right-and-down-left-from-center"></i></div>` : '');

      _canvas.appendChild(card);
      _renderWidgetBody(card.querySelector('.widget-body'), item);
      _contentObserver.observe(card.querySelector('.widget-body'));

      if (_edit) _wireEdit(card, item);
      // Wire non-edit add-link pill for quicklinks
      if (!_edit && isLinks) {
        card.querySelector('.wc-add-link-pill')?.addEventListener('click', () => {
          if (window.app) window.app.openLinkModal();
        });
      }
    });
  }

  function _positionCard(card, item) {
    card.style.left   = (item.x / COLS * 100) + '%';
    card.style.width  = `calc(${item.w / COLS * 100}% - ${item.x + item.w < COLS ? GAP : 0}px)`;
    card.style.top    = (item.y * (ROWH + GAP)) + 'px';
    card.style.height = (item.h * ROWH + (item.h - 1) * GAP) + 'px';
  }

  // Measure the usable body, excluding the edit header and padding. The same
  // calculation runs during pointer resizing, after settings changes and on load.
  function _sizeContent(el) {
    if (!el?.isConnected) return;
    const item = _layout?.find(i => i.id === el.closest('.widget-card')?.dataset.id);
    if (!item) return;
    const style = getComputedStyle(el);
    const width = el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const height = el.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    if (width <= 0 || height <= 0) return;
    const scale = _clamp(Number(item.props?.contentScale) || 100, 50, 150) / 100;
    const defaults = { clock: ['clock_size', 3.2], name: ['name_size', 3.6], headline: ['headline_size', 1], weather: ['weather_size', 1.25] };
    const setting = defaults[item.widget];
    const preference = setting ? (Number(localStorage.getItem('homepage_custom_' + setting[0])) || setting[1]) / setting[1] : 1;
    el.style.setProperty('--widget-body-height', height + 'px');
    const factors = { clock: .86, date: .62, greeting: .56, name: .8, headline: .55, weather: .58, countdown: .58 };
    if (factors[item.widget]) {
      let text = el.textContent.trim();
      if (item.widget === 'headline') text = (window.app?.roles || ['Welcome']).reduce((a,b) => a.length > b.length ? a : b, '');
      if (item.widget === 'weather') text = '☀ −100°F';
      const target = el.querySelector('.name-title, .subtitle, .wb-weather-inner') || el;
      const font = getComputedStyle(target);
      _measure.font = `${font.fontWeight} 100px ${font.fontFamily}`;
      const textWidth = Math.max(1, _measure.measureText(text).width);
      const availableHeight = item.widget === 'weather' ? Math.max(10, height - 14) : height;
      const wanted = availableHeight * factors[item.widget] * scale * preference;
      // Long names, 12-hour clocks with seconds and translated dates still fit.
      const size = Math.max(10, Math.min(wanted, width * 98 / textWidth, availableHeight / 1.35));
      el.style.setProperty('--widget-font', size + 'px');
    }
    if (item.widget === 'search') {
      const size = Math.max(12, Math.min(height * .4 * scale, width / 18, 44));
      el.style.setProperty('--widget-font', size + 'px');
    }
    if (item.widget === 'quicklinks') {
      const count = Math.min(8, (window.app?.links.length || 0) + 1);
      const widthLimit = Math.max(48, (width - (count - 1) * 10) / count);
      const cardHeight = Math.max(24, Math.min(height, Math.sqrt(width * height / count) * scale, widthLimit / .85, 220));
      el.classList.toggle('links-compact', height < 55);
      el.style.setProperty('--shortcut-height', cardHeight + 'px');
      el.style.setProperty('--shortcut-width', Math.max(48, cardHeight * .85) + 'px');
      el.style.setProperty('--shortcut-icon', Math.max(12, cardHeight * .43) + 'px');
      el.style.setProperty('--shortcut-label', Math.max(10, Math.min(20, cardHeight * .12)) + 'px');
    }
    if (['todo','notes','ambient','askai'].includes(item.widget)) {
      el.style.setProperty('--widget-font', Math.max(12, Math.min(24, Math.sqrt(width * height) / 18 * scale)) + 'px');
    }
    el.classList.toggle('widget-small', height < 60);
  }

  // ── Widget body renderers ─────────────────────────────────────────────────
  function _renderWidgetBody(el, item) {
    if (!el) return;
    const p = item.props || {};
    try {
      switch (item.widget) {
        case 'clock':    el.className = 'widget-body wb-clock'; el.dataset.fmt = p.format || '24'; el.dataset.sec = p.seconds ? '1' : '0'; _tickClock(el); break;
        case 'date':     el.className = 'widget-body wb-date'; el.dataset.long = p.long ? '1' : '0'; _tickDate(el); break;
        case 'greeting': el.className = 'widget-body wb-greeting'; el.innerHTML = `<span>${_esc(_greetingText(p))}</span>`; break;
        case 'name':     el.className = 'widget-body wb-name'; el.innerHTML = `<div class="name-container" style="position:static; transform:none; width:100%;"><h1 class="name-title" id="wbUserName" data-text="${_esc(_nameText(p))}">${_esc(_nameText(p))}</h1><div class="name-shadow"></div></div>`; break;
        case 'headline': el.className = 'widget-body wb-headline'; el.innerHTML = `<p class="subtitle" style="margin:0;"><span class="typing-text">${_esc(_headlineText())}</span></p>`; break;
        case 'search':   _mountSearch(el, p); break;
        case 'quicklinks': _mountLinks(el); break;
        case 'weather':  _mountWeather(el, p); break;
        case 'todo':     _mountTodo(el); break;
        case 'notes':    _mountNotes(el); break;
        case 'countdown':_mountCountdown(el, p); break;
        case 'ambient':  _mountAmbient(el); break;
        case 'askai':    _mountAskAI(el); break;
      }
      _sizeContent(el);
    } catch (e) { console.warn('[WidgetCanvas] render', item.widget, e); }
  }

  function _nameText(p) {
    const name = p.name || window.app?.userName || '';
    return !name || name === 'YOUR NAME' ? 'Welcome' : name;
  }
  function _greetingText(p) {
    const h = new Date().getHours();
    const part = h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
    const name = p.name || (window.app && window.app.userName) || '';
    return name && name !== 'YOUR NAME' ? `${part}, ${name}` : part;
  }
  function _headlineText() {
    const roles = (window.app && window.app.roles) || [];
    return roles[0] || 'Welcome';
  }

  // clock/date live ticking
  function _tickClock(el) {
    const now = new Date();
    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    let suffix = '';
    if (el.dataset.fmt === '12') { suffix = h >= 12 ? ' PM' : ' AM'; h = h % 12 || 12; }
    const hh = el.dataset.fmt === '12' ? h : String(h).padStart(2, '0');
    if (!el.firstElementChild) el.appendChild(Object.assign(document.createElement('span'), { className: 'widget-value' }));
    el.firstElementChild.textContent = el.dataset.sec === '1' ? `${hh}:${m}:${s}${suffix}` : `${hh}:${m}${suffix}`;
    _sizeContent(el);
  }
  function _tickDate(el) {
    const now = new Date();
    if (!el.firstElementChild) el.appendChild(Object.assign(document.createElement('span'), { className: 'widget-value' }));
    el.firstElementChild.textContent = el.dataset.long === '1'
      ? now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      : now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    _sizeContent(el);
  }
  function _startClock() {
    _stopClock();
    _clockTimer = setInterval(() => {
      _canvas?.querySelectorAll('.wb-clock').forEach(_tickClock);
      _canvas?.querySelectorAll('.wb-date').forEach(_tickDate);
      _canvas?.querySelectorAll('.wb-countdown').forEach(el => _tickCountdown(el));
    }, 1000);
  }
  function _stopClock() { if (_clockTimer) { clearInterval(_clockTimer); _clockTimer = null; } }

  function _mountSearch(el, p) {
    el.className = 'widget-body wb-search';
    el.innerHTML = `<div class="wb-search-wrap">
      <i class="fas fa-magnifying-glass"></i>
      <input type="text" class="wb-search-input" placeholder="Search the web" aria-label="Search the web">
    </div>`;
    const input = el.querySelector('input');
    const engines = { google: 'https://www.google.com/search?q=', bing: 'https://www.bing.com/search?q=', duck: 'https://duckduckgo.com/?q=' };
    input.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const q = input.value.trim(); if (!q) return;
      const isUrl = /^https?:\/\//.test(q) || /^[\w-]+\.[a-z]{2,}/i.test(q);
      window.location.href = isUrl ? (q.startsWith('http') ? q : 'https://' + q) : (engines[p.engine] || engines.google) + encodeURIComponent(q);
    });
  }
  function _mountLinks(el) {
    el.className = 'widget-body wb-links';
    const links = (window.app && window.app.links) || [];

    // Build link cards HTML (no inline onclick — CSP-safe)
    let html = links.map((l, idx) =>
      `<a class="link-card" href="${/^https?:\/\//i.test(l.url) ? _esc(l.url) : '#'}" data-index="${idx}" draggable="true" style="--card-color:${_esc(l.color || 'var(--primary)')}; --card-glow:${_esc(l.color || 'var(--primary)')}">` +
        `<button class="remove-btn" data-idx="${idx}" title="Remove ${_esc(l.name)}" aria-label="Remove ${_esc(l.name)}">×</button>` +
        `<div class="link-icon-wrapper"><i class="${_esc(l.icon || 'fas fa-link')} link-icon" style="color:${_esc(l.color || 'var(--primary)')}"></i></div>` +
        `<span class="link-name">${_esc(l.name || l.title || '')}</span>` +
      `</a>`
    ).join('');

    el.innerHTML = html;

    el.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx, 10);
        if (window.app) window.app.removeLink(idx);
      });
    });
    const add = document.createElement('button');
    add.type = 'button'; add.className = 'shortcut-add'; add.setAttribute('aria-label', 'Add a shortcut');
    add.innerHTML = '<i class="fas fa-plus" aria-hidden="true"></i><span>Add link</span>';
    add.addEventListener('click', () => window.app?.openLinkModal()); el.appendChild(add);
    window.app?._initLinkDrag(el);

    // Allow horizontal scroll in the containing widget-card
    const wCard = el.closest('.widget-card');
    if (wCard) wCard.classList.add('has-links');
    _sizeContent(el);
  }
  function _mountWeather(el, p) {
    el.className = 'widget-body wb-weather';
    el.innerHTML = `<div class="wb-weather-inner"><i class="fas fa-cloud-sun"></i> <span>Loading weather…</span></div>`;
    const units = p.units === 'f' ? 'fahrenheit' : 'celsius';
    const unitSym = p.units === 'f' ? '°F' : '°C';
    const show = data => {
      if (!el.isConnected || !window.WeatherAccess.enabled()) return;
      el.innerHTML = `<div class="wb-weather-readout"><div class="wb-weather-inner"><i class="fas ${_wxIcon(data.code)}"></i><span>${Math.round(data.temp)}${unitSym}</span></div><a class="weather-credit" href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a></div>`;
      _sizeContent(el);
    };
    const error = reason => {
      if (!el.isConnected || !window.WeatherAccess.enabled()) return;
      el.innerHTML = `<div class="wb-weather-error"><span>${_esc(reason)}</span><button type="button" class="btn btn-secondary btn-sm">Try again</button></div>`;
      el.querySelector('button').onclick = () => { _weatherCache.delete(units); window.WeatherAccess.enable(); };
    };
    if (!window.WeatherAccess.enabled()) {
      el.innerHTML = '<div class="wb-weather-error"><span>A forecast for your city</span><button type="button" class="btn btn-secondary btn-sm">Choose city</button><small>No device location access.</small></div>';
      el.querySelector('button').onclick = () => {
        window.WeatherAccess.enable();
      };
      return;
    }
    let cached = _weatherCache.get(units);
    if (!cached || Date.now() - cached.time > 30 * 60 * 1000) {
      const promise = new Promise((resolve,reject) => {
        window.WeatherAccess.position(async pos => {
          try {
            const { latitude, longitude } = pos.coords;
            const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=${units}`, { signal: AbortSignal.timeout(8000) });
            if (!r.ok) throw new Error('Weather is temporarily unavailable.');
            const d = await r.json();
            if (!Number.isFinite(d.current?.temperature_2m)) throw new Error('Weather is temporarily unavailable.');
            resolve({ temp: d.current.temperature_2m, code: d.current.weather_code });
          } catch { reject(new Error('Could not load weather. Check your connection.')); }
        }, () => reject(new Error('Choose a city to see weather.')));
      });
      cached = { time: Date.now(), promise }; _weatherCache.set(units,cached);
    }
    cached.promise.then(show).catch(e => { _weatherCache.delete(units); error(e.message); });
  }
  function _wxIcon(code) {
    if (code == null) return 'fa-cloud';
    if (code === 0) return 'fa-sun';
    if (code <= 3) return 'fa-cloud-sun';
    if (code <= 48) return 'fa-smog';
    if (code <= 67) return 'fa-cloud-rain';
    if (code <= 77) return 'fa-snowflake';
    if (code <= 82) return 'fa-cloud-showers-heavy';
    return 'fa-cloud-bolt';
  }
  function _mountTodo(el) {
    el.className = 'widget-body wb-todo';
    let items = [];
    try { items = JSON.parse(localStorage.getItem(LS_TODO) || '[]'); } catch {}
    const draw = () => {
      el.innerHTML = `<div class="wb-todo-list">${items.map((it, i) =>
        `<label class="wb-todo-item ${it.done ? 'done' : ''}"><input type="checkbox" data-i="${i}" ${it.done ? 'checked' : ''}><span>${_esc(it.text)}</span><button class="wb-todo-del" data-i="${i}">×</button></label>`
      ).join('')}</div>
      <div class="wb-todo-add"><input type="text" class="wb-todo-input" placeholder="Add task…"></div>`;
      el.querySelectorAll('input[type=checkbox]').forEach(cb => cb.onchange = () => { items[cb.dataset.i].done = cb.checked; persist(); });
      el.querySelectorAll('.wb-todo-del').forEach(b => b.onclick = () => { items.splice(+b.dataset.i, 1); persist(); draw(); });
      const inp = el.querySelector('.wb-todo-input');
      inp.onkeydown = e => { if (e.key === 'Enter' && inp.value.trim()) { items.push({ text: inp.value.trim(), done: false }); persist(); draw(); el.querySelector('.wb-todo-input').focus(); } };
    };
    const persist = () => { try { localStorage.setItem(LS_TODO, JSON.stringify(items)); } catch {} };
    draw();
  }
  function _mountNotes(el) {
    el.className = 'widget-body wb-notes';
    el.innerHTML = `<textarea class="wb-notes-area" placeholder="Quick notes…"></textarea>`;
    const ta = el.querySelector('textarea');
    try { ta.value = localStorage.getItem(LS_NOTES) || ''; } catch {}
    ta.oninput = () => { try { localStorage.setItem(LS_NOTES, ta.value); } catch {} };
  }
  function _mountCountdown(el, p) {
    el.className = 'widget-body wb-countdown';
    el.dataset.target = p.target || '';
    el.dataset.label = p.label || 'Countdown';
    _tickCountdown(el);
  }
  function _tickCountdown(el) {
    const target = el.dataset.target ? new Date(el.dataset.target).getTime() : NaN;
    const label = el.dataset.label || 'Countdown';
    if (isNaN(target)) { el.innerHTML = `<div class="wb-cd-label">${_esc(label)}</div><div class="wb-cd-time">Set a date in settings</div>`; return; }
    let diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 864e5); diff -= d * 864e5;
    const h = Math.floor(diff / 36e5); diff -= h * 36e5;
    const m = Math.floor(diff / 6e4); diff -= m * 6e4;
    const s = Math.floor(diff / 1e3);
    el.innerHTML = `<div class="wb-cd-label">${_esc(label)}</div><div class="wb-cd-time">${d}d ${h}h ${m}m ${s}s</div>`;
    _sizeContent(el);
  }
  function _mountAskAI(el) {
    el.className = 'widget-body widget-askai-inner';
    el.innerHTML = `
      <div class="widget-askai-icon"><i class="fas fa-robot"></i></div>
      <div class="widget-askai-label">Ask AI</div>
      <div class="widget-askai-hint">Click to open the AI chat panel</div>
      <button class="widget-askai-btn"><i class="fas fa-comments"></i> Start Chat</button>
    `;
    el.querySelector('.widget-askai-btn').addEventListener('click', () => {
      window.AskAI?.toggle?.() || (window.app && window.app.openAIChatModal?.());
    });
  }

  function _mountAmbient(el) {
    el.className = 'widget-body wb-ambient';
    const cur = (window.Ambient && Ambient.current()) || null;
    el.innerHTML = `<div class="wb-amb-btns">
        <button class="wb-amb ${cur === 'rain' ? 'on' : ''}" data-k="rain"><i class="fas fa-cloud-rain"></i> Rain</button>
        <button class="wb-amb ${cur === 'lofi' ? 'on' : ''}" data-k="lofi"><i class="fas fa-music"></i> Lofi</button>
        <button class="wb-amb ${!cur ? 'on' : ''}" data-k="off"><i class="fas fa-volume-xmark"></i> Off</button>
      </div>
      <input type="range" class="wb-amb-vol" min="0" max="1" step="0.05" value="${window.Ambient ? Ambient.getVolume() : 0.5}">`;
    el.querySelectorAll('.wb-amb').forEach(b => b.onclick = () => {
      if (!window.Ambient) return;
      if (b.dataset.k === 'off') Ambient.stop(); else Ambient.start(b.dataset.k);
      el.querySelectorAll('.wb-amb').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
    });
    const vol = el.querySelector('.wb-amb-vol');
    vol.oninput = () => window.Ambient && Ambient.setVolume(vol.value);
  }

  // ── Edit mode: drag / resize / tools ──────────────────────────────────────
  function _wireEdit(card, item) {
    const drag = card.querySelector('.widget-drag');
    const resize = card.querySelector('.widget-resize');

    drag?.addEventListener('pointerdown', e => _startDrag(e, card, item));
    resize?.addEventListener('pointerdown', e => _startResize(e, card, item));
    drag?.addEventListener('keydown', e => {
      const directions = { ArrowLeft: [-1,0], ArrowRight: [1,0], ArrowUp: [0,-1], ArrowDown: [0,1] };
      if (!directions[e.key]) return;
      e.preventDefault(); _remember();
      const [dx,dy] = directions[e.key];
      item.x = _clamp(item.x + dx, 0, COLS - item.w); item.y = Math.max(0, item.y + dy);
      _resolveOverlap(item); _save(); _renderWidgets();
      _canvas.querySelector(`[data-id="${item.id}"] .widget-drag`)?.focus();
    });

    card.querySelectorAll('[data-act]').forEach(btn => {
      btn.addEventListener('click', () => {
        const act = btn.dataset.act;
        if (act === 'remove')   { _remember(); _layout = _layout.filter(i => i.id !== item.id); _save(); _renderWidgets(); }
        else if (act === 'hide')    { toggleVisibility(item.id); }
        else if (act === 'settings') _openWidgetSettings(item);
        else if (act === 'addlink') { if (window.app) window.app.openLinkModal(); }
      });
    });
  }

  function _cellSize() {
    const rect = _canvas.getBoundingClientRect();
    return { cw: rect.width / COLS, rh: ROWH + GAP, rect };
  }

  // Keep the widget the user moved in place and push intersecting cards below it.
  function _resolveOverlap(moved) {
    if (moved.hidden) return;
    const queue = [moved];
    while (queue.length) {
      const current = queue.shift();
      _layout.forEach(other => {
        if (other === current || other === moved || other.hidden) return;
        if (current.x < other.x + other.w && current.x + current.w > other.x && current.y < other.y + other.h && current.y + current.h > other.y) {
          other.y = current.y + current.h; queue.push(other);
        }
      });
    }
  }

  function _startDrag(e, card, item) {
    if (e.button !== 0) return;
    e.preventDefault();
    _remember();
    const { cw, rh, rect } = _cellSize();
    const startX = e.clientX, startY = e.clientY;
    const ox = item.x, oy = item.y;
    card.classList.add('dragging');
    const move = ev => {
      const dx = Math.round((ev.clientX - startX) / cw);
      const dy = Math.round((ev.clientY - startY) / rh);
      item.x = _clamp(ox + dx, 0, COLS - item.w);
      item.y = Math.max(0, oy + dy);
      _positionCard(card, item);
    };
    const up = () => {
      card.classList.remove('dragging');
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      document.removeEventListener('pointercancel', up);
      _resolveOverlap(item);
      _save(); _renderWidgets();
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
    document.addEventListener('pointercancel', up);
  }

  function _startResize(e, card, item) {
    if (e.button !== 0) return;
    e.preventDefault(); e.stopPropagation();
    _remember();
    const { cw, rh } = _cellSize();
    const startX = e.clientX, startY = e.clientY;
    const ow = item.w, oh = item.h;
    const def = WIDGETS[item.widget] || {};
    const minW = def.minW || 1, maxW = def.maxW || COLS;
    const minH = def.minH || 1, maxH = def.maxH || 12;
    card.classList.add('resizing');

    const tooltip = document.getElementById('widgetSizeTooltip');

    const move = ev => {
      const dw = Math.round((ev.clientX - startX) / cw);
      const dh = Math.round((ev.clientY - startY) / rh);
      item.w = _clamp(ow + dw, minW, Math.min(maxW, COLS - item.x));
      item.h = _clamp(oh + dh, minH, maxH);
      _positionCard(card, item);
      if (tooltip) {
        tooltip.textContent = `${item.w} × ${item.h}`;
        tooltip.style.display = 'block';
        tooltip.style.left = (ev.clientX + 14) + 'px';
        tooltip.style.top  = (ev.clientY + 14) + 'px';
      }
    };
    const up = () => {
      card.classList.remove('resizing');
      if (tooltip) tooltip.style.display = 'none';
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      document.removeEventListener('pointercancel', up);
      _resolveOverlap(item);
      _save(); _renderWidgets();
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
    document.addEventListener('pointercancel', up);
  }

  // ── Per-widget settings popover ───────────────────────────────────────────
  function _openWidgetSettings(item) {
    _settingsCleanup?.();
    const opener = document.activeElement;
    const pop = document.createElement('div');
    pop.id = 'widgetSettingsPop';
    pop.className = 'widget-settings-pop';
    pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-modal', 'true'); pop.setAttribute('aria-labelledby', 'wspTitle');
    const p = item.props || (item.props = {});
    let html = `<div class="wsp-header"><div class="wsp-title" id="wspTitle">${_esc(WIDGETS[item.widget].label)}</div><button class="modal-close wsp-close" aria-label="Close widget settings">×</button></div>`;
    switch (item.widget) {
      case 'clock':
        html += _row('Format', `<select data-k="format"><option value="24"${p.format !== '12' ? ' selected' : ''}>24-hour</option><option value="12"${p.format === '12' ? ' selected' : ''}>12-hour</option></select>`);
        html += _row('Show seconds', `<input type="checkbox" data-k="seconds"${p.seconds ? ' checked' : ''}>`);
        break;
      case 'date':
        html += _row('Long format', `<input type="checkbox" data-k="long"${p.long ? ' checked' : ''}>`);
        break;
      case 'greeting':
        html += _row('Name', `<input type="text" data-k="name" value="${_esc(p.name || '')}" placeholder="Your name">`);
        break;
      case 'search':
        html += _row('Engine', `<select data-k="engine"><option value="google"${(!p.engine || p.engine === 'google') ? ' selected' : ''}>Google</option><option value="bing"${p.engine === 'bing' ? ' selected' : ''}>Bing</option><option value="duck"${p.engine === 'duck' ? ' selected' : ''}>DuckDuckGo</option></select>`);
        break;
      case 'weather':
        html += _row('Units', `<select data-k="units"><option value="c"${p.units !== 'f' ? ' selected' : ''}>Celsius</option><option value="f"${p.units === 'f' ? ' selected' : ''}>Fahrenheit</option></select>`);
        html += `<p class="wsp-note">${_esc(WeatherAccess.city()?.name || 'No city selected')}</p><button type="button" class="btn btn-secondary wsp-city">Change city</button>`;
        break;
      case 'countdown':
        html += _row('Label', `<input type="text" data-k="label" value="${_esc(p.label || '')}" placeholder="e.g. New Year">`);
        html += _row('Target', `<input type="datetime-local" data-k="target" value="${_esc(p.target || '')}">`);
        break;
      case 'headline':
        html += `<p class="wsp-note">Choose the phrases that rotate on your homepage.</p><button type="button" class="btn btn-secondary wsp-headline">Edit headline</button>`;
        break;
      case 'name':
        html += _row('Name', `<input type="text" data-k="name" value="${_esc(p.name || '')}" placeholder="Your name">`);
        break;
      case 'quicklinks':
        html += `<p class="wsp-note">Add a shortcut with the plus tile. Drag shortcuts to reorder them, or use the × on a card to remove one.</p><button type="button" class="btn btn-secondary wsp-add-link"><i class="fas fa-plus"></i> Add shortcut</button>`;
        break;
      default:
        html += `<p class="wsp-note">You can adjust this widget's size and position below.</p>`;
    }
    const def = WIDGETS[item.widget];
    if (WIDGETS[item.widget]) {
      html += `<div class="wsp-section"><div class="wsp-section-title">Content size</div><p class="wsp-note">Content scales with the widget. Fine-tune it here.</p>`;
      html += _row('Scale', `<span class="wsp-scale"><input type="range" data-k="contentScale" min="50" max="150" step="5" value="${_clamp(Number(p.contentScale) || 100,50,150)}" aria-label="Content scale"><output>${_clamp(Number(p.contentScale) || 100,50,150)}%</output></span>`);
      html += '</div>';
    }
    html += `<div class="wsp-section"><div class="wsp-section-title">Size & position</div>`;
    html += _row('Width (columns)', `<input type="number" data-layout="w" min="${def.minW}" max="${def.maxW}" value="${item.w}">`);
    html += _row('Height (rows)', `<input type="number" data-layout="h" min="${def.minH}" max="${def.maxH}" value="${item.h}">`);
    html += _row('Column', `<input type="number" data-layout="x" min="1" max="${COLS}" value="${item.x+1}">`);
    html += _row('Row', `<input type="number" data-layout="y" min="1" max="100" value="${item.y+1}">`);
    html += '</div>';
    html += `<button class="btn btn-accent btn-sm wsp-done" style="width:100%;margin-top:8px;">Apply</button>`;
    pop.innerHTML = html;
    document.body.appendChild(pop);
    const close = () => { document.removeEventListener('pointerdown', off); document.removeEventListener('keydown', onKey, true); pop.remove(); if (opener?.isConnected) opener.focus(); _settingsCleanup = null; };
    const off = e => { if (!pop.contains(e.target)) close(); };
    const onKey = e => { if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); close(); } };
    _settingsCleanup = close;
    pop.querySelector('.wsp-close').onclick = close;
    pop.querySelector('.wsp-headline')?.addEventListener('click', () => { close(); window.HomepageUI?.openSettings('general'); });
    pop.querySelector('.wsp-add-link')?.addEventListener('click', () => { close(); window.app?.openLinkModal(); });
    pop.querySelector('.wsp-city')?.addEventListener('click', () => { close(); WeatherAccess.chooseCity(); });
    pop.querySelector('[data-k=contentScale]')?.addEventListener('input', e => { e.target.nextElementSibling.value = e.target.value + '%'; });
    pop.querySelector('.wsp-done').onclick = () => {
      _remember();
      pop.querySelectorAll('[data-k]').forEach(inp => {
        const k = inp.dataset.k;
        p[k] = inp.type === 'checkbox' ? inp.checked : inp.value;
      });
      const value = key => Number(pop.querySelector(`[data-layout="${key}"]`).value);
      item.w = _clamp(Math.round(value('w')) || def.w, def.minW, def.maxW);
      item.h = _clamp(Math.round(value('h')) || def.h, def.minH, def.maxH);
      item.x = _clamp(Math.round(value('x') || 1) - 1, 0, COLS - item.w);
      item.y = _clamp(Math.round(value('y') || 1) - 1, 0, 99);
      _resolveOverlap(item); _save(); _renderWidgets(); close();
    };
    (pop.querySelector('select, input') || pop.querySelector('.wsp-close')).focus();
    document.addEventListener('keydown', onKey, true);
    setTimeout(() => {
      if (pop.isConnected) document.addEventListener('pointerdown', off);
    }, 0);
  }
  function _row(label, control) {
    return `<label class="wsp-row"><span>${_esc(label)}</span>${control}</label>`;
  }

  // ── Edit mode toggle ──────────────────────────────────────────────────────
  function enterEdit() {
    if (!_layout) { _remember(); _layout = DEFAULT_LAYOUT.map(i => ({ ...i, id: _uid(), props: { ...i.props } })); }
    _edit = true;
    _save();
    if (_editBar) _editBar.style.display = 'flex';
    document.body.classList.add('layout-editing');
    _renderView();
    _updateUndo();
    document.getElementById('editLayoutBtn')?.setAttribute('aria-pressed', 'true');
  }
  function exitEdit() {
    _settingsCleanup?.();
    _edit = false;
    if (_editBar) _editBar.style.display = 'none';
    document.body.classList.remove('layout-editing');
    const menu = document.getElementById('widgetAddMenu'); if (menu) menu.style.display = 'none';
    _renderWidgets();
    document.getElementById('editLayoutBtn')?.setAttribute('aria-pressed', 'false');
  }
  function toggleEdit() { _edit ? exitEdit() : enterEdit(); }

  function _addWidget(type) {
    if (!WIDGETS[type] || !_layout) return;
    _remember();
    const def = WIDGETS[type];
    let maxRow = 0; _layout.forEach(i => { maxRow = Math.max(maxRow, i.y + i.h); });
    _layout.push({ id: _uid(), widget: type, x: 0, y: maxRow, w: def.w, h: def.h, props: {} });
    _save(); _renderWidgets();
    requestAnimationFrame(() => _canvas.querySelector(`[data-id="${_layout.at(-1).id}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }));
  }

  function resetLayout() {
    _remember();
    _layout = DEFAULT_LAYOUT.map(i => ({ ...i, id: _uid(), props: { ...i.props } }));
    _save(); _renderWidgets();
  }
  function compactLayout() {
    if (!_layout) return;
    _remember();
    const placed = [];
    [..._layout].filter(i => !i.hidden).sort((a,b) => a.y - b.y || a.x - b.x).forEach(item => {
      let y = 0;
      while (placed.some(other => item.x < other.x + other.w && item.x + item.w > other.x && y < other.y + other.h && y + item.h > other.y)) y++;
      item.y = y; placed.push(item);
    });
    _save(); _renderWidgets();
    window.toast?.('Gaps removed. Undo to restore your arrangement.', 'success', 2000);
  }
  function useClassic() {
    _remember();
    _layout = null; _save(); exitEdit(); _renderView();
  }

  function listItems() {
    return (_layout || []).map(i => ({ id: i.id, label: WIDGETS[i.widget].label, icon: WIDGETS[i.widget].icon, hidden: !!i.hidden }));
  }
  function toggleVisibility(id) {
    const item = _layout?.find(i => i.id === id); if (!item) return;
    _remember(); item.hidden = !item.hidden; _resolveOverlap(item); _save(); _renderWidgets();
  }
  function openSettings(id) {
    const item = _layout?.find(i => i.id === id); if (item) _openWidgetSettings(item);
  }

  // ── init ──────────────────────────────────────────────────────────────────
  function init() {
    _canvas = document.getElementById('widgetCanvas');
    _editBar = document.getElementById('widgetEditBar');
    _layout = _load();

    // Create size tooltip (shown while resizing)
    if (!document.getElementById('widgetSizeTooltip')) {
      const tip = document.createElement('div');
      tip.id = 'widgetSizeTooltip';
      document.body.appendChild(tip);
    }

    document.getElementById('editLayoutBtn')?.addEventListener('click', toggleEdit);
    document.getElementById('widgetDoneBtn')?.addEventListener('click', exitEdit);
    document.getElementById('widgetResetBtn')?.addEventListener('click', resetLayout);
    document.getElementById('widgetClassicBtn')?.addEventListener('click', useClassic);
    document.getElementById('widgetUndoBtn')?.addEventListener('click', undo);
    document.getElementById('widgetCompactBtn')?.addEventListener('click', compactLayout);
    document.getElementById('widgetElementsBtn')?.addEventListener('click', () => document.getElementById('customizeBtn').click());

    // Add-widget menu
    const addBtn = document.getElementById('widgetAddBtn');
    const menu = document.getElementById('widgetAddMenu');
    if (addBtn && menu) {
      menu.innerHTML = Object.entries(WIDGETS).map(([k, v]) =>
        `<button class="widget-add-item" data-w="${k}"><i class="fas ${v.icon}"></i> ${_esc(v.label)}</button>`).join('');
      addBtn.addEventListener('click', e => {
        e.stopPropagation();
        menu.style.display = menu.style.display === 'none' ? 'grid' : 'none';
        addBtn.setAttribute('aria-expanded', String(menu.style.display !== 'none'));
        if (menu.style.display !== 'none') menu.querySelector('button')?.focus();
      });
      menu.querySelectorAll('.widget-add-item').forEach(b =>
        b.addEventListener('click', () => { _addWidget(b.dataset.w); menu.style.display = 'none'; }));
      document.addEventListener('pointerdown', e => {
        if (!menu.contains(e.target) && !addBtn.contains(e.target)) { menu.style.display = 'none'; addBtn.setAttribute('aria-expanded', 'false'); }
      });
    }

    // Re-render widgets when underlying data changes
    document.addEventListener('ambient-changed', () => { if (_layout && !_edit) _canvas?.querySelectorAll('.wb-ambient').forEach(el => _mountAmbient(el)); });
    document.addEventListener('links-changed', () => _canvas?.querySelectorAll('.wb-links').forEach(_mountLinks));
    document.addEventListener('sizes-changed', () => _canvas?.querySelectorAll('.widget-body').forEach(_sizeContent));
    document.addEventListener('weather-changed', () => {
      _weatherCache.clear();
      _canvas?.querySelectorAll('.wb-weather').forEach(el => {
        const item = _layout?.find(i => i.id === el.closest('.widget-card').dataset.id);
        if (item) _mountWeather(el, item.props || {});
      });
    });
    document.addEventListener('name-changed', () => {
      if (!_layout) return;
      _layout.filter(i => i.widget === 'greeting' || i.widget === 'name').forEach(i => _renderWidgetBody(_canvas.querySelector(`[data-id="${i.id}"] .widget-body`), i));
    });
    window.addEventListener('resize', () => { if (_layout) _renderWidgets(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && _edit && !document.querySelector('.modal-overlay.active, #customizationPanel.open, #widgetSettingsPop')) { exitEdit(); return; }
      const active = document.activeElement;
      if (_edit && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !active?.matches('input,textarea,select')) { e.preventDefault(); undo(); }
    });

    _renderView();
  }

  return { init, getLayout, applyLayout, enterEdit, exitEdit, toggleEdit, resetLayout, compactLayout, useClassic, undo, listItems, toggleVisibility, openSettings, DEFAULT_LAYOUT };
})();
window.WidgetCanvas = WidgetCanvas;
