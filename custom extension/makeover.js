'use strict';
/**
 * Makeover — one-prompt full homepage restyle.
 * Sends a vibe to the AI (via AIProviders.aiComplete), parses a strict JSON
 * design spec robustly, builds a Setup bundle, and applies it with Revert.
 */
const Makeover = (() => {
  const KNOWN_PACKS = ['coding', 'gaming', 'space', 'anime', 'nature', 'cinema', 'cars', 'minimal'];

  const SYS = [
    'You are a homepage art director. Given a vibe, output a design spec.',
    'Respond with ONLY a single JSON object — no markdown, no code fences, no prose before or after.',
    'Shape (all keys required):',
    '{',
    '  "wallpaperQuery": "2-5 word image search phrase",',
    '  "elementPack": "existing:<id>" where id is one of [' + KNOWN_PACKS.join(', ') + '], OR "generate",',
    '  "generatedElementsPrompt": "short phrase describing decorative icons (used only if elementPack is generate)",',
    '  "headlines": ["3 to 5 short punchy lines, 2-5 words each, no trailing punctuation"],',
    '  "theme": { "accent": "#hex", "accent2": "#hex", "text": "#hex", "dark": "#hex (very dark background)" },',
    '  "ambient": "rain" | "lofi" | null',
    '}',
    'Pick an existing pack when one clearly fits the vibe; only use "generate" for unusual vibes.',
    'Colors must be vivid and high-contrast against the dark background.'
  ].join('\n');

  let _busy = false;
  let _els = {};

  function _status(msg, cls) {
    const el = _els.status;
    if (!el) return;
    el.style.display = 'block';
    el.textContent = msg;
    el.className = 'makeover-status' + (cls ? ' ' + cls : '');
  }
  function _hideStatus(delay = 0) {
    if (!_els.status) return;
    setTimeout(() => { if (_els.status) _els.status.style.display = 'none'; }, delay);
  }

  // ── Robust JSON extraction ────────────────────────────────────────────────
  function extractJSON(text) {
    if (typeof text !== 'string') return null;
    let s = text.replace(/```(?:json)?/gi, '').trim();   // strip code fences
    const start = s.indexOf('{');
    if (start < 0) return null;
    let depth = 0, inStr = false, esc = false, end = -1;
    for (let i = start; i < s.length; i++) {
      const c = s[i];
      if (inStr) {
        if (esc) esc = false;
        else if (c === '\\') esc = true;
        else if (c === '"') inStr = false;
      } else {
        if (c === '"') inStr = true;
        else if (c === '{') depth++;
        else if (c === '}') { depth--; if (depth === 0) { end = i; break; } }
      }
    }
    if (end < 0) return null;
    const body = s.slice(start, end + 1);
    const tryParse = str => { try { return JSON.parse(str); } catch { return undefined; } };
    let obj = tryParse(body);
    if (obj === undefined) obj = tryParse(body.replace(/,\s*([}\]])/g, '$1'));            // trailing commas
    if (obj === undefined) obj = tryParse(body.replace(/'/g, '"').replace(/,\s*([}\]])/g, '$1'));
    return (obj && typeof obj === 'object') ? obj : null;
  }

  // ── Validate + fill defaults → returns a clean spec ───────────────────────
  function _coerceSpec(raw, vibe) {
    const d = Setup.DEFAULT_THEME;
    const spec = (raw && typeof raw === 'object') ? raw : {};
    const t = spec.theme && typeof spec.theme === 'object' ? spec.theme : {};
    const hex = (c, fb) => (typeof c === 'string' && /^#?[0-9a-f]{3,8}$/i.test(c.trim()))
      ? (c.trim()[0] === '#' ? c.trim() : '#' + c.trim()) : fb;

    let headlines = Array.isArray(spec.headlines)
      ? spec.headlines.filter(h => typeof h === 'string' && h.trim()).map(h => h.trim().replace(/[.!]+$/, '')).slice(0, 5)
      : [];
    if (!headlines.length) headlines = [vibe.slice(0, 40) || 'Your space', 'Make it yours'];

    let pack = typeof spec.elementPack === 'string' ? spec.elementPack.trim() : '';
    if (pack.startsWith('existing:')) {
      const id = pack.slice(9).trim();
      pack = KNOWN_PACKS.includes(id) ? 'existing:' + id : 'generate';
    } else {
      pack = KNOWN_PACKS.includes(pack) ? 'existing:' + pack : 'generate';
    }

    return {
      wallpaperQuery: (typeof spec.wallpaperQuery === 'string' && spec.wallpaperQuery.trim())
        ? spec.wallpaperQuery.trim().slice(0, 60) : vibe.slice(0, 60),
      elementPack: pack,
      generatedElementsPrompt: typeof spec.generatedElementsPrompt === 'string'
        ? spec.generatedElementsPrompt.trim().slice(0, 80) : vibe,
      headlines,
      theme: {
        accent:  hex(t.accent,  d.accent),
        accent2: hex(t.accent2, d.accent2),
        text:    hex(t.text,    d.text),
        dark:    hex(t.dark,    d.dark)
      },
      ambient: (spec.ambient === 'rain' || spec.ambient === 'lofi') ? spec.ambient : null
    };
  }

  async function _callAI(vibe) {
    const messages = [
      { role: 'system', content: SYS },
      { role: 'user', content: `Vibe: ${vibe}\nReturn the JSON spec now.` }
    ];
    const { response } = await AIProviders.aiComplete(messages, { stream: false, temperature: 0.9, maxTokens: 700 });
    if (!response.ok) {
      const txt = await response.text().catch(() => '');
      throw new Error(`AI HTTP ${response.status}: ${txt.slice(0, 120)}`);
    }
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || '';
  }

  // Pack generator removed

  // ── Main entry ────────────────────────────────────────────────────────────
  async function run(vibe) {
    vibe = String(vibe || '').trim();
    if (!vibe) { _status('Type a vibe first ✨', 'err'); _hideStatus(2500); return; }
    if (_busy) return;
    _busy = true;
    if (_els.go) _els.go.disabled = true;

    try {
      _status('Designing your vibe…');
      let rawText;
      try { rawText = await _callAI(vibe); }
      catch (e) {
        console.error('[Makeover] AI call failed:', e);
        _status('AI unavailable — add/enable a key in Settings → AI Providers.', 'err');
        _hideStatus(5000); return;
      }

      const parsed = extractJSON(rawText);
      if (!parsed) console.warn('[Makeover] Could not parse JSON. Raw:', rawText.slice(0, 400));
      const spec = _coerceSpec(parsed, vibe);   // always returns a usable spec

      _status('Applying theme & headlines…');
      const bundle = {
        version: 2,
        name: vibe.slice(0, 40),
        wallpaper: { kind: 'query', value: spec.wallpaperQuery, settings: { dim: 0.4, blur: 0, blend: 'normal' } },
        elements: {},
        headlines: spec.headlines,
        theme: spec.theme,
        ambient: spec.ambient
        // NOTE: no `layout` / `links` → AI changes the LOOK, not the arrangement
      };

      bundle.elements.packId = 'coding';

      _status('Fetching a matching wallpaper…');
      const result = await Setup.applySetup(bundle, { snapshot: true });

      if (_els.revert) _els.revert.style.display = '';

      if (result.warnings.includes('wallpaper-query') || result.manualQuery) {
        _status(`Applied! Wallpaper search unavailable — set one manually for: “${spec.wallpaperQuery}”`, 'ok');
        _hideStatus(8000);
      } else {
        _status('✨ Makeover applied! Use Revert to undo.', 'ok');
        _hideStatus(5000);
      }
      if (_els.input) _els.input.value = '';
    } catch (e) {
      console.error('[Makeover] unexpected:', e);
      _status('Something went wrong — nothing was broken. Check the console.', 'err');
      _hideStatus(5000);
    } finally {
      _busy = false;
      if (_els.go) _els.go.disabled = false;
    }
  }

  // crude keyword → existing pack guesser for the generate-failure fallback
  function _guessPack(vibe) {
    const v = vibe.toLowerCase();
    const map = [
      [/(code|dev|program|hack|cyber|terminal)/, 'coding'],
      [/(game|gaming|arcade|rpg|fps)/, 'gaming'],
      [/(space|galaxy|cosmos|star|nebula|sci-?fi)/, 'space'],
      [/(anime|manga|sakura|tokyo|kawaii)/, 'anime'],
      [/(nature|forest|zen|garden|ocean|mountain)/, 'nature'],
      [/(movie|cinema|film|noir)/, 'cinema'],
      [/(car|race|f1|racing|drift|speed)/, 'cars']
    ];
    for (const [rx, id] of map) if (rx.test(v)) return id;
    return 'minimal';
  }

  function init() {
    _els = {
      input:  document.getElementById('makeoverInput'),
      go:     document.getElementById('makeoverGoBtn'),
      revert: document.getElementById('makeoverRevertBtn'),
      status: document.getElementById('makeoverStatus')
    };
    if (!_els.go) return;
    _els.go.addEventListener('click', () => run(_els.input?.value));
    _els.input?.addEventListener('keydown', e => { if (e.key === 'Enter') run(_els.input.value); });
    _els.revert?.addEventListener('click', async () => {
      const ok = await Setup.revert();
      if (ok) { _els.revert.style.display = 'none'; _status('Reverted to your previous setup.', 'ok'); _hideStatus(3000); }
    });
    // Show revert only when a snapshot exists (persists across reloads)
    if (_els.revert) _els.revert.style.display = Setup.hasSnapshot() ? '' : 'none';
  }

  return { init, run, extractJSON };
})();
window.Makeover = Makeover;
