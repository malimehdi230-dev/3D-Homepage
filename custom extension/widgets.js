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
    { widget: 'search',     x: 0, y: 3, w: 12, h: 1, props: {} },
    { widget: 'quicklinks', x: 0, y: 4, w: 12, h: 2, props: {} }
  ];

  // ── Storage ─────────────────────────────────────────────────────────────
  function _save() {
    try { localStorage.setItem(LS_LAYOUT, _layout ? JSON.stringify(_layout) : ''); } catch {}
  }
  function _load() {
    try {
      const raw = localStorage.getItem(LS_LAYOUT);
      if (!raw) return null;
      const arr = JSON.parse(raw);
      return Array.isArray(arr) && arr.length ? arr : null;
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
    if (!Array.isArray(layout) || !layout.length) { _layout = null; _save(); _renderView(); return; }
    _layout = layout
      .filter(i => i && WIDGETS[i.widget])
      .map(i => ({
        id: _uid(), widget: i.widget,
        x: _clamp(i.x | 0, 0, COLS - 1), y: Math.max(0, i.y | 0),
        w: _clamp(i.w | 0 || WIDGETS[i.widget].w, 1, COLS),
        h: _clamp(i.h | 0 || WIDGETS[i.widget].h, 1, 12),
        props: (i.props && typeof i.props === 'object') ? i.props : {},
        hidden: !!i.hidden
      }));
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
    if (!_canvas) return;
    _canvas.innerHTML = '';
    _canvas.classList.toggle('editing', _edit);

    // canvas height = max row used
    let maxRow = 1;
    _layout.forEach(i => { maxRow = Math.max(maxRow, i.y + i.h); });
    _canvas.style.setProperty('--rows', maxRow);

    _layout.forEach(item => {
      if (item.hidden && !_edit) return;
      const card = document.createElement('div');
      card.className = 'widget-card' + (item.hidden ? ' widget-hidden' : '');
      card.dataset.id = item.id;
      _positionCard(card, item);

      const def = WIDGETS[item.widget];
      const isLinks = item.widget === 'quicklinks';
      const addLinkPillHtml = `<button class="wc-add-link-pill" data-act="addlink" title="Add link"><i class="fas fa-plus"></i><span>Add Link</span></button>`;

      card.innerHTML =
        (_edit
          ? `<div class="widget-chrome">
              <span class="widget-drag" title="Drag"><i class="fas fa-up-down-left-right"></i> ${_esc(def.label)}</span>
              <span class="widget-tools">
                ${isLinks ? addLinkPillHtml : ''}
                <button class="widget-tool" data-act="settings" title="Settings"><i class="fas fa-gear"></i></button>
                <button class="widget-tool" data-act="hide" title="${item.hidden ? 'Show' : 'Hide'}"><i class="fas fa-eye${item.hidden ? '-slash' : ''}"></i></button>
                <button class="widget-tool" data-act="remove" title="Remove"><i class="fas fa-xmark"></i></button>
              </span>
            </div>`
          : (isLinks
              ? `<div class="widget-links-header">
                  <span class="widget-links-title"><i class="fas fa-link"></i> Quick Links</span>
                  ${addLinkPillHtml}
                 </div>`
              : '')
        ) +
        `<div class="widget-body" data-w="${item.widget}"></div>` +
        (_edit ? `<div class="widget-resize" title="Resize"><i class="fas fa-up-right-and-down-left-from-center"></i></div>` : '');

      _canvas.appendChild(card);
      _renderWidgetBody(card.querySelector('.widget-body'), item);

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
    card.style.width  = (item.w / COLS * 100) + '%';
    card.style.top    = (item.y * (ROWH + GAP)) + 'px';
    card.style.height = (item.h * ROWH + (item.h - 1) * GAP) + 'px';
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
        case 'name':     el.className = 'widget-body wb-name'; el.innerHTML = `<div class="name-container" style="position:static; transform:none; width:100%;"><h1 class="name-title" id="wbUserName" data-text="${_esc(p.name || (window.app && window.app.userName) || 'YOUR NAME')}">${_esc(p.name || (window.app && window.app.userName) || 'YOUR NAME')}</h1><div class="name-shadow"></div></div>`; break;
        case 'headline': el.className = 'widget-body wb-headline'; el.innerHTML = `<p class="subtitle" style="margin:0;"><span class="typing-text"></span></p>`; break;
        case 'search':   _mountSearch(el, p); break;
        case 'quicklinks': _mountLinks(el); break;
        case 'weather':  _mountWeather(el, p); break;
        case 'todo':     _mountTodo(el); break;
        case 'notes':    _mountNotes(el); break;
        case 'countdown':_mountCountdown(el, p); break;
        case 'ambient':  _mountAmbient(el); break;
        case 'askai':    _mountAskAI(el); break;
      }
    } catch (e) { console.warn('[WidgetCanvas] render', item.widget, e); }
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
    el.textContent = el.dataset.sec === '1' ? `${hh}:${m}:${s}${suffix}` : `${hh}:${m}${suffix}`;
  }
  function _tickDate(el) {
    const now = new Date();
    el.textContent = el.dataset.long === '1'
      ? now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      : now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
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
      <input type="text" class="wb-search-input" placeholder="Search…">
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
    let html = links.slice(0, 12).map((l, idx) =>
      `<a class="link-card" data-href="${_esc(l.url)}" data-idx="${idx}" style="--card-color:${_esc(l.color || 'var(--primary)')}; --card-glow:${_esc(l.color || 'var(--primary)')}">` +
        `<button class="remove-btn" data-idx="${idx}" title="Remove">×</button>` +
        `<div class="link-icon-wrapper"><i class="${_esc(l.icon || 'fas fa-link')} link-icon" style="color:${_esc(l.color || 'var(--primary)')}"></i></div>` +
        `<span class="link-name">${_esc(l.name || l.title || '')}</span>` +
      `</a>`
    ).join('');

    el.innerHTML = html;

    // Wire up link cards and remove buttons via event delegation
    el.querySelectorAll('.link-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.remove-btn')) return;
        const url = card.dataset.href;
        if (url) window.open(url, '_blank');
      });
    });
    el.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx, 10);
        if (window.app) window.app.removeLink(idx);
      });
    });

    // Allow horizontal scroll in the containing widget-card
    const wCard = el.closest('.widget-card');
    if (wCard) wCard.classList.add('has-links');
  }
  function _mountWeather(el, p) {
    el.className = 'widget-body wb-weather';
    el.innerHTML = `<div class="wb-weather-inner"><i class="fas fa-location-crosshairs"></i> <span>Locating…</span></div>`;
    const span = el.querySelector('span');
    const units = p.units === 'f' ? 'fahrenheit' : 'celsius';
    const unitSym = p.units === 'f' ? '°F' : '°C';
    if (!navigator.geolocation) { span.textContent = 'Weather unavailable'; return; }
    navigator.geolocation.getCurrentPosition(async pos => {
      try {
        const { latitude, longitude } = pos.coords;
        const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=${units}`);
        const d = await r.json();
        const t = Math.round(d.current?.temperature_2m);
        const code = d.current?.weather_code;
        const icon = _wxIcon(code);
        el.querySelector('.wb-weather-inner').innerHTML = `<i class="fas ${icon}"></i> <span>${isNaN(t) ? '--' : t}${unitSym}</span>`;
      } catch { span.textContent = 'Weather error'; }
    }, () => { span.textContent = 'Location denied'; }, { timeout: 8000 });
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

    card.querySelectorAll('[data-act]').forEach(btn => {
      btn.addEventListener('click', () => {
        const act = btn.dataset.act;
        if (act === 'remove')   { _layout = _layout.filter(i => i.id !== item.id); _save(); _renderWidgets(); }
        else if (act === 'hide')    { item.hidden = !item.hidden; _save(); _renderWidgets(); }
        else if (act === 'settings') _openWidgetSettings(item);
        else if (act === 'addlink') { if (window.app) window.app.openLinkModal(); }
      });
    });
  }

  function _cellSize() {
    const rect = _canvas.getBoundingClientRect();
    return { cw: rect.width / COLS, rh: ROWH + GAP, rect };
  }

  function _startDrag(e, card, item) {
    e.preventDefault();
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
      _save(); _renderWidgets();
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  }

  function _startResize(e, card, item) {
    e.preventDefault(); e.stopPropagation();
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
      _save(); _renderWidgets();
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  }

  // ── Per-widget settings popover ───────────────────────────────────────────
  function _openWidgetSettings(item) {
    const existing = document.getElementById('widgetSettingsPop');
    if (existing) existing.remove();
    const pop = document.createElement('div');
    pop.id = 'widgetSettingsPop';
    pop.className = 'widget-settings-pop';
    const p = item.props || (item.props = {});
    let html = `<div class="wsp-title">${_esc(WIDGETS[item.widget].label)} settings</div>`;
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
        break;
      case 'countdown':
        html += _row('Label', `<input type="text" data-k="label" value="${_esc(p.label || '')}" placeholder="e.g. New Year">`);
        html += _row('Target', `<input type="datetime-local" data-k="target" value="${_esc(p.target || '')}">`);
        break;
      case 'headline':
        html += `<p class="wsp-note">Edit phrases and typewriter settings in the main Settings panel.</p>`;
        break;
      case 'name':
        html += _row('Name', `<input type="text" data-k="name" value="${_esc(p.name || '')}" placeholder="Your name">`);
        break;
      case 'quicklinks':
        html += `<p class="wsp-note">Add/remove links in the classic layout view.</p>`;
        break;
      default:
        html += `<p class="wsp-note">No options for this widget.</p>`;
    }
    html += `<button class="btn btn-accent btn-sm wsp-done" style="width:100%;margin-top:8px;">Apply</button>`;
    pop.innerHTML = html;
    document.body.appendChild(pop);

    pop.querySelector('.wsp-done').onclick = () => {
      pop.querySelectorAll('[data-k]').forEach(inp => {
        const k = inp.dataset.k;
        p[k] = inp.type === 'checkbox' ? inp.checked : inp.value;
      });
      _save(); _renderWidgets(); pop.remove();
    };
    // close on outside click
    setTimeout(() => {
      const off = e => { if (!pop.contains(e.target)) { pop.remove(); document.removeEventListener('pointerdown', off); } };
      document.addEventListener('pointerdown', off);
    }, 0);
  }
  function _row(label, control) {
    return `<label class="wsp-row"><span>${_esc(label)}</span>${control}</label>`;
  }

  // ── Edit mode toggle ──────────────────────────────────────────────────────
  function enterEdit() {
    if (!_layout) _layout = DEFAULT_LAYOUT.map(i => ({ ...i, id: _uid(), props: { ...i.props } }));
    _edit = true;
    _save();
    if (_editBar) _editBar.style.display = 'flex';
    document.body.classList.add('layout-editing');
    _renderView();
  }
  function exitEdit() {
    _edit = false;
    if (_editBar) _editBar.style.display = 'none';
    document.body.classList.remove('layout-editing');
    const menu = document.getElementById('widgetAddMenu'); if (menu) menu.style.display = 'none';
    _renderWidgets();
  }
  function toggleEdit() { _edit ? exitEdit() : enterEdit(); }

  function _addWidget(type) {
    if (!WIDGETS[type] || !_layout) return;
    const def = WIDGETS[type];
    let maxRow = 0; _layout.forEach(i => { maxRow = Math.max(maxRow, i.y + i.h); });
    _layout.push({ id: _uid(), widget: type, x: 0, y: maxRow, w: def.w, h: def.h, props: {} });
    _save(); _renderWidgets();
  }

  function resetLayout() {
    _layout = DEFAULT_LAYOUT.map(i => ({ ...i, id: _uid(), props: { ...i.props } }));
    _save(); _renderWidgets();
  }
  function useClassic() {
    _layout = null; _save(); exitEdit(); _renderView();
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

    // Add-widget menu
    const addBtn = document.getElementById('widgetAddBtn');
    const menu = document.getElementById('widgetAddMenu');
    if (addBtn && menu) {
      menu.innerHTML = Object.entries(WIDGETS).map(([k, v]) =>
        `<button class="widget-add-item" data-w="${k}"><i class="fas ${v.icon}"></i> ${_esc(v.label)}</button>`).join('');
      addBtn.addEventListener('click', e => {
        e.stopPropagation();
        menu.style.display = menu.style.display === 'none' ? 'grid' : 'none';
      });
      menu.querySelectorAll('.widget-add-item').forEach(b =>
        b.addEventListener('click', () => { _addWidget(b.dataset.w); menu.style.display = 'none'; }));
      document.addEventListener('pointerdown', e => {
        if (!menu.contains(e.target) && e.target !== addBtn) menu.style.display = 'none';
      });
    }

    // Re-render widgets when underlying data changes
    document.addEventListener('ambient-changed', () => { if (_layout && !_edit) _canvas?.querySelectorAll('.wb-ambient').forEach(el => _mountAmbient(el)); });

    _renderView();
  }

  return { init, getLayout, applyLayout, enterEdit, exitEdit, toggleEdit, resetLayout, useClassic, DEFAULT_LAYOUT };
})();
window.WidgetCanvas = WidgetCanvas;
