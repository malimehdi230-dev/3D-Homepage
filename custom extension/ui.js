'use strict';

const HomepageUI = (() => {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const groups = [
    ['general', 'General', 'fa-user', 'Make yourself at home', 'Your name and the words that greet you on every new tab.'],
    ['appearance', 'Background', 'fa-image', 'Your background', 'Choose a photo, a video, or one of the built-in themes.'],
    ['layout', 'Layout', 'fa-table-cells', 'A place for everything', 'Keep it centered, or arrange widgets to suit your day.'],
    ['ai', 'AI features', 'fa-wand-magic-sparkles', 'A little extra help', 'Connect your own API key to use chat and AI styling.'],
    ['data', 'Backup & help', 'fa-folder', 'Keep your setup safe', 'Save a backup, restore your preferences, or send feedback.']
  ];
  const effects = [
    ['matrix', 'Matrix rain', 'Falling characters in the background.', 'homepage_matrixEnabled'],
    ['particles', 'Particles', 'Small floating points of light.', 'homepage_particlesEnabled'],
    ['aurora', 'Background glow', 'A soft wash of your theme colors.', 'homepage_auroraEnabled'],
    ['cube3d', '3D objects', 'The animated scene in your chosen theme.', 'homepage_cube3dEnabled'],
    ['typewriter', 'Animated headline', 'Type out your headline one letter at a time.', 'homepage_headline_typewriter']
  ];
  const sizes = [
    ['Clock size', 'clock_size', 2, 10, .1, 'rem', '--custom-clock-size', 3.2],
    ['Name size', 'name_size', 1, 5, .1, 'rem', '--custom-name-size', 3.6],
    ['Headline size', 'headline_size', .7, 4, .1, 'rem', '--custom-headline-size', 1],
    ['Search height', 'search_height', 36, 72, 2, 'px', '--custom-search-height', 54],
    ['Search width', 'search_width', 280, 900, 10, 'px', '--custom-search-width', 560],
    ['Search corners', 'search_radius', 0, 36, 1, 'px', '--custom-search-radius', 14],
    ['Weather size', 'weather_size', .7, 2, .05, 'rem', '--custom-weather-size', 1.25],
    ['3D scene size', 'scene_scale', 50, 150, 5, '%', '--custom-scene-scale', 100]
  ];
  const classicWidgets = [ ['clock', 'Clock'], ['date', 'Date'], ['greeting', 'Weather & greeting'], ['name', 'Name'], ['headline', 'Headline'], ['search', 'Search'], ['quicklinks', 'Quick links'] ];
  let currentSection = 'general';
  let modalStack = [];

  function selectSection(id, focus = false) {
    if (!groups.some(g => g[0] === id)) return;
    currentSection = id;
    document.querySelectorAll('.settings-tab').forEach(b => {
      const selected = b.dataset.section === id;
      b.setAttribute('aria-selected', String(selected));
      b.tabIndex = selected ? 0 : -1;
    });
    document.querySelectorAll('.settings-pane').forEach(p => { p.hidden = p.id !== 'settings-pane-' + id; });
    document.querySelector('.settings-content').scrollTop = 0;
    if (id === 'layout') refreshLayoutChoice();
    if (focus) document.querySelector(`[data-section="${id}"]`)?.focus();
  }

  function openSettings(id = 'general') {
    window.app?.openSettingsModal();
    selectSection(id);
  }

  function initSettings() {
    const modal = document.querySelector('#settingsModal .modal');
    const form = document.getElementById('settingsForm');
    const sectionOf = id => document.getElementById(id)?.closest('.settings-section');
    const sections = {
      general: [form, sectionOf('headlineLinesList')],
      appearance: [sectionOf('wallpaperPickerBtn')],
      ai: [sectionOf('providersList'), sectionOf('makeoverBar')],
      data: [sectionOf('exportSettingsBtn'), sectionOf('settingsFeedbackBtn'), modal.querySelector('.settings-footer')]
    };
    const shell = document.createElement('div');
    shell.className = 'settings-layout';
    shell.innerHTML = `<nav class="settings-nav" role="tablist" aria-label="Settings sections">
      <span class="settings-nav-label">Preferences</span>
      ${groups.map(([id,label,icon]) => `<button type="button" role="tab" class="settings-tab" id="settings-tab-${id}" data-section="${id}" aria-controls="settings-pane-${id}"><i class="fas ${icon}" aria-hidden="true"></i>${label}</button>`).join('')}
      <div class="settings-nav-foot">3D Parallax<br>Your space. Your pace.</div>
      </nav><div class="settings-content">${groups.map(([id,,,title,desc]) => `<section role="tabpanel" tabindex="0" id="settings-pane-${id}" class="settings-pane" aria-labelledby="settings-tab-${id}" hidden>
      <div class="settings-pane-heading"><h3>${title}</h3><p>${desc}</p></div></section>`).join('')}</div>`;
    modal.appendChild(shell);
    Object.entries(sections).forEach(([id,nodes]) => nodes.filter(Boolean).forEach(n => shell.querySelector('#settings-pane-' + id).appendChild(n)));
    const note = document.createElement('span');
    note.className = 'settings-save-note'; note.textContent = 'Other preferences save as you change them.';
    form.appendChild(note);
    const general = shell.querySelector('#settings-pane-general');
    general.insertAdjacentHTML('beforeend', `<div class="settings-section"><h4 class="settings-section-title">Weather</h4><label class="customize-panel-row"><span>Show weather<small id="weatherCityHint">Choose a city. No device location access.</small></span><span class="ctrl-toggle"><input type="checkbox" id="weatherEnabled" aria-label="Show weather" ${WeatherAccess.enabled() ? 'checked' : ''}><span class="ctrl-toggle-track"></span></span></label><button type="button" class="btn btn-secondary" id="weatherCityChange">Choose or change city</button></div>`);
    general.querySelector('#weatherEnabled').onchange = async e => {
      if (e.target.checked) e.target.checked = await WeatherAccess.enable();
      else WeatherAccess.disable();
    };
    const syncWeather = () => {
      general.querySelector('#weatherEnabled').checked = WeatherAccess.enabled();
      general.querySelector('#weatherCityHint').textContent = WeatherAccess.city() ? 'Forecast for ' + WeatherAccess.city().name + '. No device location access.' : 'Choose a city. No device location access.';
    };
    general.querySelector('#weatherCityChange').onclick = () => WeatherAccess.chooseCity();
    document.addEventListener('weather-changed', syncWeather); syncWeather();
    const background = shell.querySelector('#settings-pane-appearance');
    const themes = document.createElement('button');
    themes.className = 'btn btn-secondary'; themes.type = 'button'; themes.innerHTML = '<i class="fas fa-palette"></i> Browse themes';
    themes.addEventListener('click', () => { window.app.closeAllModals(); window.app.openTemplateModal(); });
    background.querySelector('.settings-pane-heading').appendChild(themes);
    background.insertAdjacentHTML('beforeend', `<div class="settings-section" id="soundOptions"><h4 class="settings-section-title">Ambient sound</h4><p class="settings-section-desc">A quiet backdrop while you work. Sound plays after you choose it.</p><div class="sound-options">${[['','Off'],['rain','Rain'],['lofi','Lo-fi']].map(([kind,label]) => `<button type="button" class="btn btn-secondary" data-sound="${kind}">${label}</button>`).join('')}</div><label class="customize-panel-row"><span>Volume</span><input type="range" id="ambientVolume" min="0" max="100" value="${Ambient.getVolume()*100}" aria-label="Ambient volume"></label></div>`);
    const syncSound = () => background.querySelectorAll('[data-sound]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.sound === (Ambient.current() || ''))));
    background.querySelectorAll('[data-sound]').forEach(b => b.onclick = () => b.dataset.sound ? Ambient.start(b.dataset.sound) : Ambient.stop());
    background.querySelector('#ambientVolume').oninput = e => Ambient.setVolume(e.target.value / 100);
    document.addEventListener('ambient-changed', syncSound); syncSound();
    const data = shell.querySelector('#settings-pane-data');
    data.insertAdjacentHTML('beforeend', `<div class="settings-section"><h4 class="settings-section-title">Privacy & support</h4><p class="settings-section-desc">Your preferences stay on this device. Optional services are explained in our privacy policy.</p><div class="layout-action-row"><a class="btn btn-secondary" href="privacy.html" target="_blank" rel="noopener">Privacy policy</a><a class="btn btn-secondary" id="serviceSupportLink" href="https://github.com/malimehdi230-dev/3D-Homepage/issues" target="_blank" rel="noopener">Support</a></div></div><div class="settings-section"><h4 class="settings-section-title">Start fresh</h4><p class="settings-section-desc">Remove saved settings, shortcuts, tasks, notes, wallpapers and AI keys from this device.</p><button type="button" class="btn btn-secondary" id="openResetBtn">Reset extension…</button></div>`);
    data.querySelector('#openResetBtn').onclick = openReset;
    const layout = shell.querySelector('#settings-pane-layout');
    layout.insertAdjacentHTML('beforeend', `<div class="layout-choice-grid">
      <button class="layout-choice" type="button" id="settingsClassicChoice"><i class="fas fa-align-center"></i><strong>Centered</strong><span>A simple, balanced start page.</span></button>
      <button class="layout-choice" type="button" id="settingsWidgetChoice"><i class="fas fa-table-cells"></i><strong>Widgets</strong><span>Move, resize, and add useful elements.</span></button>
      </div><div class="layout-action-row"><button type="button" class="btn btn-primary" id="settingsArrangeBtn"><i class="fas fa-up-down-left-right"></i> Arrange widgets</button>
      <button type="button" class="btn btn-secondary" id="settingsElementsBtn"><i class="fas fa-sliders"></i> Show or hide elements</button></div>
      <p class="settings-section-desc" style="margin-top:20px">Drag a widget by its title to move it. Use the bottom corner to resize. You can also set its size and position with the settings button. Undo is always one click away.</p>`);
    layout.querySelector('#settingsClassicChoice').onclick = () => { WidgetCanvas.useClassic(); refreshLayoutChoice(); };
    layout.querySelector('#settingsWidgetChoice').onclick = () => { if (!WidgetCanvas.getLayout()) WidgetCanvas.applyLayout(WidgetCanvas.DEFAULT_LAYOUT); refreshLayoutChoice(); };
    layout.querySelector('#settingsArrangeBtn').onclick = () => { window.app.closeAllModals(); WidgetCanvas.enterEdit(); };
    layout.querySelector('#settingsElementsBtn').onclick = () => { window.app.closeAllModals(); document.getElementById('customizeBtn').click(); };
    shell.querySelectorAll('.settings-tab').forEach((b,index) => {
      b.onclick = () => selectSection(b.dataset.section);
      b.onkeydown = e => {
        let target = index;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') target = (index + 1) % groups.length;
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') target = (index + groups.length - 1) % groups.length;
        else if (e.key === 'Home') target = 0;
        else if (e.key === 'End') target = groups.length - 1;
        else return;
        e.preventDefault(); selectSection(groups[target][0], true);
      };
    });
    selectSection(currentSection);
  }

  function refreshLayoutChoice() {
    const hasLayout = !!window.WidgetCanvas?.getLayout();
    document.getElementById('settingsClassicChoice')?.setAttribute('aria-pressed', String(!hasLayout));
    document.getElementById('settingsWidgetChoice')?.setAttribute('aria-pressed', String(hasLayout));
  }

  function applyEffects() {
    effects.forEach(([id,,,key]) => {
      document.body.classList.toggle('fx-' + id + '-off', localStorage.getItem(key) === '0');
    });
    classicWidgets.forEach(([id]) => document.body.classList.toggle('classic-' + id + '-off', localStorage.getItem('homepage_visible_' + id) === '0'));
  }

  function drawWidgetManager(container) {
    if (!container) return;
    const focused = container.contains(document.activeElement) ? document.activeElement : null;
    const focusKey = focused?.dataset.visible || focused?.dataset.config;
    const items = window.WidgetCanvas?.listItems() || [];
    const custom = !!window.WidgetCanvas?.getLayout();
    container.innerHTML = custom
      ? `<p class="widget-manager-empty">Show the things you use. Hide the rest.</p>${items.map(i => `<div class="widget-manager-row"><i class="fas ${esc(i.icon)}" aria-hidden="true"></i><span>${esc(i.label)}</span><button type="button" data-config="${esc(i.id)}" title="${esc(i.label)} settings" aria-label="${esc(i.label)} settings"><i class="fas fa-sliders"></i></button><label class="ctrl-toggle"><input type="checkbox" data-visible="${esc(i.id)}" aria-label="Show ${esc(i.label)}" ${!i.hidden ? 'checked' : ''}><span class="ctrl-toggle-track"></span></label></div>`).join('')}`
      : `<p class="widget-manager-empty">Choose what appears on your centered homepage.</p>${classicWidgets.map(([id,label]) => `<label class="customize-panel-row"><span>${label}</span><span class="ctrl-toggle"><input type="checkbox" data-classic="${id}" aria-label="Show ${label}" ${localStorage.getItem('homepage_visible_' + id) !== '0' ? 'checked' : ''}><span class="ctrl-toggle-track"></span></span></label>`).join('')}`;
    container.insertAdjacentHTML('beforeend', `<button type="button" class="btn btn-secondary" data-arrange style="margin-top:20px;width:100%"><i class="fas fa-table-cells"></i> ${custom ? 'Arrange widgets' : 'Try a widget layout'}</button>`);
    container.querySelectorAll('[data-visible]').forEach(b => b.onchange = () => WidgetCanvas.toggleVisibility(b.dataset.visible));
    container.querySelectorAll('[data-config]').forEach(b => b.onclick = () => WidgetCanvas.openSettings(b.dataset.config));
    container.querySelectorAll('[data-classic]').forEach(cb => cb.onchange = () => { localStorage.setItem('homepage_visible_' + cb.dataset.classic, cb.checked ? '1' : '0'); applyEffects(); });
    container.querySelector('[data-arrange]').onclick = () => { document.getElementById('customizationPanel')?.classList.remove('open'); WidgetCanvas.enterEdit(); };
    if (focusKey) container.querySelector(`[data-${focused.dataset.visible ? 'visible' : 'config'}="${focusKey}"]`)?.focus();
  }

  function buildCustomizePanel(app) {
    const panel = document.createElement('aside'); panel.id = 'customizationPanel';
    panel.setAttribute('aria-label', 'Customize your homepage');
    panel.innerHTML = `<div class="customize-panel-header"><span>Customize</span><button type="button" class="customize-panel-close" id="cpCloseBtn" aria-label="Close customization">×</button></div>
      <p class="customize-panel-intro">Small adjustments, made yours. Changes save automatically.</p>
      <div class="customize-tabs" role="tablist" aria-label="Customization sections">
      ${['Elements','Effects','Sizes'].map((name,i) => `<button type="button" role="tab" id="cp-tab-${i}" aria-controls="cp-pane-${i}" data-cp-tab="${i}" aria-selected="${i===0}">${name}</button>`).join('')}</div>
      <div class="customize-body"><div id="cp-pane-0" role="tabpanel" aria-labelledby="cp-tab-0" class="widget-manager-list"></div>
      <div id="cp-pane-1" role="tabpanel" aria-labelledby="cp-tab-1" hidden>${effects.map(([id,label,hint,key]) => `<label class="customize-panel-row"><span>${label}<small>${hint}</small></span><span class="ctrl-toggle"><input type="checkbox" id="cp-${id}" data-effect="${key}" aria-label="${label}" ${localStorage.getItem(key)!=='0'?'checked':''}><span class="ctrl-toggle-track"></span></span></label>`).join('')}</div>
      <div id="cp-pane-2" role="tabpanel" aria-labelledby="cp-tab-2" hidden>${sizes.map(([label,key,min,max,step,unit,css,def]) => {
        const value = localStorage.getItem('homepage_custom_' + key) ?? def;
        return `<div class="custom-slider-row"><label class="custom-slider-label" for="cp-${key}">${label}</label><div class="custom-slider-wrap"><input type="range" class="custom-slider" id="cp-${key}" data-size="${key}" min="${min}" max="${max}" step="${step}" value="${value}" data-css="${css}" data-unit="${unit}"><output class="custom-slider-value" for="cp-${key}">${value}${unit}</output></div></div>`;
      }).join('')}</div></div>
      <div class="customize-foot"><span><i class="fas fa-check"></i> Saved on this device</span><button type="button" class="btn btn-secondary btn-sm" id="cpResetBtn">Reset sizes</button></div>`;
    panel.querySelector('#cpCloseBtn').onclick = () => { panel.classList.remove('open'); document.getElementById('customizeBtn').focus(); };
    panel.querySelectorAll('[data-cp-tab]').forEach((b,index,buttons) => {
      b.onclick = () => {
        buttons.forEach(x => { const active = x === b; x.setAttribute('aria-selected', String(active)); x.tabIndex = active ? 0 : -1; });
        panel.querySelectorAll('[role=tabpanel]').forEach(p => { p.hidden = p.id !== 'cp-pane-' + b.dataset.cpTab; });
      };
      b.tabIndex = index === 0 ? 0 : -1;
      b.onkeydown = e => {
        if (!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
        e.preventDefault(); const next = e.key === 'Home' ? 0 : e.key === 'End' ? buttons.length-1 : (index + (e.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
        buttons[next].click(); buttons[next].focus();
      };
    });
    panel.querySelectorAll('[data-effect]').forEach(cb => cb.onchange = () => {
      localStorage.setItem(cb.dataset.effect, cb.checked ? '1' : '0'); applyEffects();
      if (cb.id === 'cp-typewriter') { const mainToggle = document.getElementById('headlineTypewriterOn'); mainToggle.checked = cb.checked; mainToggle.dispatchEvent(new Event('change')); }
    });
    panel.querySelectorAll('[data-size]').forEach(slider => slider.oninput = () => {
      const value = slider.value; localStorage.setItem('homepage_custom_' + slider.dataset.size, value);
      document.documentElement.style.setProperty(slider.dataset.css, value + (slider.dataset.unit === '%' ? '' : slider.dataset.unit));
      slider.nextElementSibling.textContent = value + slider.dataset.unit;
      document.dispatchEvent(new Event('sizes-changed'));
    });
    panel.querySelector('#cpResetBtn').onclick = () => {
      sizes.forEach(([,key,,,,unit,css,def]) => {
        localStorage.removeItem('homepage_custom_' + key); document.documentElement.style.removeProperty(css);
        const input = panel.querySelector('#cp-' + key); input.value = def; input.nextElementSibling.textContent = def + unit;
      });
      window.toast?.('Sizes reset.', 'success', 1800);
      document.dispatchEvent(new Event('sizes-changed'));
    };
    drawWidgetManager(panel.querySelector('.widget-manager-list'));
    return panel;
  }

  function focusables(container) {
    return [...container.querySelectorAll('a[href], button, input, select, textarea, [tabindex="0"]')].filter(e => !e.disabled && e.getClientRects().length && !e.closest('[hidden]'));
  }
  function openReset() {
    document.getElementById('resetModal').classList.add('active');
  }
  function initReset() {
    const overlay = document.createElement('div');
    overlay.id = 'resetModal'; overlay.className = 'modal-overlay';
    overlay.innerHTML = `<div class="modal" style="max-width:440px"><div class="modal-header"><h2 class="modal-title">Reset your homepage?</h2><button type="button" class="modal-close" data-modal="resetModal" aria-label="Cancel reset">×</button></div><p class="settings-section-desc">This removes your settings, shortcuts, notes, tasks, wallpapers and saved AI keys from this device. Export a backup first if you want to keep them.</p><div class="reset-actions"><button type="button" class="btn btn-secondary" id="cancelResetBtn">Keep my setup</button><button type="button" class="btn btn-danger" id="confirmResetBtn">Reset everything</button></div><p id="resetStatus" role="status"></p></div>`;
    document.body.appendChild(overlay);
    const close = () => overlay.classList.remove('active');
    overlay.querySelector('.modal-close').onclick = close;
    overlay.querySelector('#cancelResetBtn').onclick = close;
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    overlay.querySelector('#confirmResetBtn').onclick = async e => {
      e.target.disabled = true;
      try {
        Ambient.stop(); await Wallpaper.clearAll();
        if (typeof chrome !== 'undefined' && chrome.storage?.local) await chrome.storage.local.clear();
        localStorage.clear();
        sessionStorage.removeItem('homepage_feedback_draft');
        // Inform other open homepage tabs before reloading this one.
        localStorage.setItem('homepage_reset_at', String(Date.now()));
        location.replace(location.pathname);
      } catch (error) {
        console.warn('[3D Parallax] Reset failed:', error.message);
        e.target.disabled = false;
        overlay.querySelector('#resetStatus').textContent = 'Could not finish resetting. Please try again.';
      }
    };
  }
  function setupDialogs() {
    document.querySelectorAll('.modal-overlay').forEach((overlay,index) => {
      const dialog = overlay.querySelector('.modal');
      dialog.setAttribute('role','dialog'); dialog.setAttribute('aria-modal','true'); dialog.tabIndex = -1;
      const heading = dialog.querySelector('.modal-title');
      if (heading) { heading.id ||= 'dialog-title-' + index; dialog.setAttribute('aria-labelledby',heading.id); }
      const observer = new MutationObserver(() => {
        const active = overlay.classList.contains('active');
        const found = modalStack.find(x => x.overlay === overlay);
        if (active && !found) {
          modalStack.push({overlay, opener: document.activeElement});
          const target = overlay.id === 'linkModal' ? document.getElementById('linkName') : overlay.id === 'weatherCityModal' ? document.getElementById('weatherCityInput') : overlay.id === 'settingsModal' ? overlay.querySelector('.settings-tab[aria-selected=true]') : focusables(dialog)[0];
          (target || dialog).focus();
        } else if (!active && found) {
          modalStack = modalStack.filter(x => x !== found);
          if (!modalStack.length && found.opener?.isConnected) found.opener.focus();
        }
        document.body.classList.toggle('dialog-open', modalStack.length > 0);
      });
      observer.observe(overlay,{attributes:true,attributeFilter:['class']});
    });
    document.addEventListener('keydown',e => {
      if (e.key !== 'Tab') return;
      const widgetDialog = document.getElementById('widgetSettingsPop');
      const top = widgetDialog || document.querySelector('#feedbackOverlay.open') || modalStack.at(-1)?.overlay;
      if (!top) return;
      const elements = focusables(top); if (!elements.length) return;
      const first = elements[0], last = elements.at(-1);
      if (e.shiftKey && (document.activeElement === first || !top.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !top.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    });
  }

  function init() {
    initReset(); initSettings(); applyEffects(); setupDialogs();
    document.querySelectorAll('label.form-label').forEach(label => {
      const control = label.parentElement.querySelector('input,select,textarea'); if (control?.id) label.htmlFor = control.id;
    });
    document.querySelectorAll('button[title]').forEach(b => { if (!b.getAttribute('aria-label')) b.setAttribute('aria-label',b.title); });
    document.querySelectorAll('.modal-close').forEach(b => b.setAttribute('aria-label','Close dialog'));
    document.addEventListener('layout-changed', () => {
      refreshLayoutChoice(); drawWidgetManager(document.querySelector('#customizationPanel .widget-manager-list'));
    });
    window.addEventListener('storage', event => {
      if (event.key === 'homepage_reset_at') { sessionStorage.removeItem('homepage_feedback_draft'); location.reload(); return; }
      if (!event.key || event.key.startsWith('homepage_')) applyEffects();
      if (event.key === 'homepage_links') { window.app.links = window.app.loadLinks(); window.app.renderLinks(); }
      if (event.key === 'homepage_userName' && event.newValue) window.app.updateUserName(event.newValue);
    });
    new MutationObserver(applyEffects).observe(document.body,{attributes:true,attributeFilter:['class']});
    if (location.hash === '#backup' || location.hash === '#reset' || location.hash === '#sound') {
      const hash = location.hash;
      openSettings(hash === '#sound' ? 'appearance' : 'data');
      if (hash === '#reset') openReset();
      if (hash === '#sound') document.getElementById('soundOptions').scrollIntoView({ block: 'nearest' });
      history.replaceState(null, '', location.pathname);
    }
  }
  return { init, openSettings, openReset, buildCustomizePanel, applyEffects };
})();
window.HomepageUI = HomepageUI;
document.addEventListener('DOMContentLoaded', HomepageUI.init);
