/* The homepage's local preferences are authoritative; Chrome storage is only
   a fallback for older installations. Never read provider keys in this view. */
document.addEventListener('DOMContentLoaded', () => {
  const keys = ['homepage_template','homepage_userName','homepage_links','homepage_install_date',
    'homepage_matrixEnabled','homepage_ambient_kind','homepage_ambient_volume','homepage_widget_layout',
    'homepage_background_mode','homepage_wallpaper_active_id','homepage_setup_theme','homepage_service_config'];
  const $ = id => document.getElementById(id);
  let revision = 0, previewUrl, timer;
  const decode = (value, fallback) => { try { return typeof value === 'string' ? JSON.parse(value) : value ?? fallback; } catch { return fallback; } };
  const color = value => typeof value === 'string' && /^#[a-f\d]{3}(?:[a-f\d]{3})?$/i.test(value) ? value : null;
  const enabled = value => ![false,0,'0','false'].includes(value);
  const url = value => { try { const target = new URL(value); return /^https?:$/.test(target.protocol) ? target.href : null; } catch { return null; } };
  function cleanPreview() { if (previewUrl) { URL.revokeObjectURL(previewUrl); previewUrl = null; } }
  function showIcon(className) {
    cleanPreview(); $('tmplIcon').replaceChildren();
    const icon = document.createElement('i'); icon.className = className; icon.setAttribute('aria-hidden','true'); $('tmplIcon').append(icon);
  }
  function accent(value) {
    document.documentElement.style.setProperty('--primary',value);
    const hex = value.slice(1), full = hex.length === 3 ? [...hex].map(c => c + c).join('') : hex;
    const [r,g,b] = [0,2,4].map(start => parseInt(full.slice(start,start+2),16) / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4);
    document.documentElement.style.setProperty('--primary-ink', .2126*r + .7152*g + .0722*b > .2 ? '#101815' : '#ffffff');
  }
  async function loadData() {
    const current = ++revision;
    let mirror = {};
    try { if (globalThis.chrome?.storage?.local) mirror = await chrome.storage.local.get(keys); } catch {}
    let wallpapers = [];
    try { wallpapers = await Wallpaper.list(); } catch { $('popupStatus').textContent = 'Open your homepage to check wallpaper storage.'; }
    if (current !== revision) return;
    const read = key => { try { return localStorage.getItem(key) ?? mirror[key] ?? null; } catch { return mirror[key] ?? null; } };
    const template = TEMPLATES[read('homepage_template')] || TEMPLATES.minimal;
    const savedName = read('homepage_userName'), hour = new Date().getHours();
    $('popupGreetingText').textContent = 'Good ' + (hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening') + ', ';
    $('popupName').textContent = savedName && savedName !== 'YOUR NAME' ? savedName : 'there';
    const theme = decode(read('homepage_setup_theme'),{});
    accent(color(theme.accent) || template.colors.primary);
    const rawLinks = read('homepage_links'), parsed = decode(rawLinks, rawLinks === null ? DEFAULT_LINKS : []);
    const links = Array.isArray(parsed) ? parsed.filter(link => link && typeof link.name === 'string') : [];
    $('statLinks').textContent = links.length;
    $('statTemplates').textContent = Object.keys(TEMPLATES).length;
    const installed = Number(read('homepage_install_date'));
    $('statDays').textContent = installed > 0 && Number.isFinite(installed) ? Math.max(0,Math.floor((Date.now()-installed)/86400000)) : '\u2014';
    const item = wallpapers.find(row => row.id === read('homepage_wallpaper_active_id'));
    const wallpaperMode = read('homepage_background_mode') === 'wallpaper' && item;
    $('backgroundLabel').textContent = 'Current background';
    $('tmplName').textContent = wallpaperMode ? item.name || 'My wallpaper' : template.name;
    $('tmplDesc').textContent = wallpaperMode
      ? (item.blob?.type?.startsWith('video/') ? 'Video wallpaper' : 'Photo wallpaper') + ' \u00b7 Theme: ' + template.name
      : template.description;
    $('wallpaperCount').textContent = wallpapers.length + ' of ' + Wallpaper.max + ' wallpapers saved';
    showIcon(wallpaperMode ? 'fas fa-image' : template.icon);
    if (wallpaperMode && item.blob?.type?.startsWith('image/')) {
      previewUrl = URL.createObjectURL(item.blob);
      const image = document.createElement('img'); image.src = previewUrl; image.alt = ''; $('tmplIcon').replaceChildren(image);
    }
    $('quickLinks').replaceChildren();
    for (const link of links.slice(0,8)) {
      const destination = url(link.url), chip = document.createElement(destination ? 'a' : 'span'); chip.className = 'ql-chip';
      if (destination) { chip.href = destination; chip.target = '_blank'; chip.rel = 'noopener noreferrer'; }
      const icon = document.createElement('i'); icon.className = typeof link.icon === 'string' ? link.icon : 'fas fa-link'; icon.setAttribute('aria-hidden','true');
      if (color(link.color)) icon.style.color = link.color;
      chip.append(icon,document.createTextNode(link.name)); chip.title = link.name; $('quickLinks').append(chip);
    }
    if (!links.length) { const note = document.createElement('span'); note.className = 'empty-links'; note.textContent = 'Add your first shortcut on the homepage.'; $('quickLinks').append(note); }
    if (links.length > 8) { const more = document.createElement('span'); more.className = 'empty-links'; more.textContent = '+' + (links.length-8) + ' more on your homepage'; $('quickLinks').append(more); }
    $('toggleMatrix').checked = enabled(read('homepage_matrixEnabled'));
    const ambient = read('homepage_ambient_kind'), volume = read('homepage_ambient_volume');
    $('ambientBtn').textContent = ({ rain:'Rain', lofi:'Lo-fi' })[ambient] ? ({ rain:'Rain', lofi:'Lo-fi' })[ambient] + (volume !== null && Number(volume) === 0 ? ' (muted)' : '') : 'Choose sound';
    const config = decode(read('homepage_service_config'),{});
    const age = Date.now()-Number(config.cachedAt);
    const ambientAvailable = !(config.schemaVersion === 1 && age >= 0 && age < 86400000 && config.ambientEnabled === false);
    $('ambientBtn').disabled = !ambientAvailable;
    if (!ambientAvailable) $('ambientBtn').textContent = 'Unavailable';
    const layout = decode(read('homepage_widget_layout'),null);
    $('layoutSummary').textContent = Array.isArray(layout) ? 'Widgets \u00b7 ' + layout.filter(row => row && !row.hidden).length + ' visible' : 'Centered';
  }
  const refresh = () => { clearTimeout(timer); timer = setTimeout(loadData,30); };
  window.addEventListener('storage', event => { if (!event.key || keys.includes(event.key)) refresh(); });
  globalThis.chrome?.storage?.onChanged?.addListener((changes,area) => { if (area === 'local' && keys.some(key => Object.hasOwn(changes,key))) refresh(); });
  window.addEventListener('pagehide',cleanPreview);
  $('toggleMatrix').addEventListener('change', () => {
    const value = $('toggleMatrix').checked ? '1' : '0';
    try { localStorage.setItem('homepage_matrixEnabled',value); }
    catch { $('popupStatus').textContent = 'Could not save this preference. Open settings to try again.'; refresh(); return; }
    globalThis.chrome?.storage?.local?.set({ homepage_matrixEnabled:value }).catch(() => {});
  });
  function openHomepage(hash = '') {
    if (globalThis.chrome?.tabs?.create) { chrome.tabs.create({ url:chrome.runtime.getURL('index.html') + hash }); window.close(); }
    else window.open('index.html' + hash,'_blank','noopener,noreferrer');
  }
  $('ambientBtn').onclick = () => openHomepage('#sound');
  $('layoutBtn').onclick = () => openHomepage('#layout');
  $('backgroundBtn').onclick = () => openHomepage('#background');
  $('openNewTab').onclick = () => openHomepage();
  $('popupSettingsBtn').onclick = () => openHomepage('#settings');
  $('exportBtn').onclick = () => openHomepage('#backup');
  $('resetBtn').onclick = () => openHomepage('#reset');
  $('popupFeedbackLink').href = ExtensionLinks.reviews;
  $('popupFeedbackLink').onclick = event => { event.preventDefault(); openExtensionReviews(); };
  ExtensionVersion.then(version => { if (version) $('popupVersion').textContent = 'v' + version; });
  loadData();
});
