'use strict';
/**
 * Ambient — procedural ambient soundscapes via the Web Audio API.
 * No audio files required (MV3-safe). Supports "rain" and "lofi".
 * Browsers block audio until a user gesture, so the context is resumed
 * lazily on the first interaction; state is persisted so it can restore.
 */
const Ambient = (() => {
  const LS_KIND = 'homepage_ambient_kind';
  const LS_VOL  = 'homepage_ambient_volume';

  let _ctx     = null;
  let _master  = null;
  let _nodes   = [];      // active source nodes/intervals to tear down on stop
  let _kind    = null;    // 'rain' | 'lofi' | null
  let _vol     = 0.5;
  let _pendingResume = false;

  function _ensureCtx() {
    if (_ctx) return _ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      _ctx = new AC();
      _master = _ctx.createGain();
      _master.gain.value = _vol;
      _master.connect(_ctx.destination);
    } catch (e) {
      console.warn('[Ambient] AudioContext unavailable:', e);
      _ctx = null;
    }
    return _ctx;
  }

  // One-shot listener that resumes a suspended context after a user gesture.
  function _armResume() {
    if (_pendingResume) return;
    _pendingResume = true;
    const resume = () => {
      _pendingResume = false;
      try { _ctx && _ctx.resume(); } catch {}
      ['pointerdown', 'keydown'].forEach(ev =>
        document.removeEventListener(ev, resume));
    };
    ['pointerdown', 'keydown'].forEach(ev =>
      document.addEventListener(ev, resume, { once: true }));
  }

  // ── Rain: filtered white noise + occasional bright droplets ──────────────
  function _startRain() {
    const ctx = _ctx;
    const bufSize = 2 * ctx.sampleRate;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1100;
    lp.Q.value = 0.4;

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 380;

    const g = ctx.createGain();
    g.gain.value = 0.55;

    noise.connect(hp); hp.connect(lp); lp.connect(g); g.connect(_master);
    noise.start();
    _nodes.push({ stop: () => { try { noise.stop(); } catch {} } });

    // gentle droplets
    const drip = setInterval(() => {
      if (!_ctx) return;
      const o = ctx.createOscillator();
      const dg = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 1400 + Math.random() * 1800;
      const t = ctx.currentTime;
      dg.gain.setValueAtTime(0.0001, t);
      dg.gain.exponentialRampToValueAtTime(0.06, t + 0.005);
      dg.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      o.connect(dg); dg.connect(_master);
      o.start(t); o.stop(t + 0.15);
    }, 220);
    _nodes.push({ stop: () => clearInterval(drip) });
  }

  // ── Lofi: warm pad chord + soft vinyl hiss ───────────────────────────────
  function _startLofi() {
    const ctx = _ctx;
    // chord pad (A minor-ish)
    const freqs = [220, 261.63, 329.63];
    freqs.forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = i === 0 ? 'triangle' : 'sine';
      o.frequency.value = f;
      g.gain.value = 0.05;
      // slow tremolo for warmth
      const lfo = ctx.createOscillator();
      const lfoG = ctx.createGain();
      lfo.frequency.value = 0.12 + i * 0.05;
      lfoG.gain.value = 0.02;
      lfo.connect(lfoG); lfoG.connect(g.gain);
      o.connect(g); g.connect(_master);
      o.start(); lfo.start();
      _nodes.push({ stop: () => { try { o.stop(); lfo.stop(); } catch {} } });
    });

    // vinyl hiss
    const bufSize = 2 * ctx.sampleRate;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    const hiss = ctx.createBufferSource();
    hiss.buffer = buf; hiss.loop = true;
    const hg = ctx.createGain(); hg.gain.value = 0.025;
    const hf = ctx.createBiquadFilter(); hf.type = 'bandpass'; hf.frequency.value = 6000;
    hiss.connect(hf); hf.connect(hg); hg.connect(_master);
    hiss.start();
    _nodes.push({ stop: () => { try { hiss.stop(); } catch {} } });
  }

  function _teardown() {
    _nodes.forEach(n => { try { n.stop(); } catch {} });
    _nodes = [];
  }

  // ── Public API ────────────────────────────────────────────────────────────
  function start(kind) {
    if (window.ExtensionService && !ExtensionService.enabled('ambientEnabled')) return;
    if (kind !== 'rain' && kind !== 'lofi') return stop();
    if (!_ensureCtx()) { console.warn('[Ambient] no audio context'); return; }
    _teardown();
    _kind = kind;
    try { localStorage.setItem(LS_KIND, kind); } catch {}
    if (_ctx.state === 'suspended') { try { _ctx.resume(); } catch {} _armResume(); }
    try {
      if (kind === 'rain') _startRain(); else _startLofi();
    } catch (e) {
      console.warn('[Ambient] start failed:', e);
      _teardown(); _kind = null;
    }
    _dispatch();
  }

  function stop() {
    _teardown();
    _kind = null;
    try { localStorage.removeItem(LS_KIND); } catch {}
    _dispatch();
  }

  function toggle(kind) {
    if (_kind === kind) stop(); else start(kind);
  }

  function setVolume(v) {
    _vol = Math.max(0, Math.min(1, Number(v) || 0));
    try { localStorage.setItem(LS_VOL, String(_vol)); } catch {}
    if (_master) _master.gain.value = _vol;
  }

  function current() { return _kind; }
  function getVolume() { return _vol; }

  function _dispatch() {
    try { document.dispatchEvent(new CustomEvent('ambient-changed', { detail: _kind })); } catch {}
  }

  // Restore persisted state. Audio won't actually play until a user gesture,
  // but arming the resume listener means the first click kicks it off.
  function init() {
    try {
      const sv = parseFloat(localStorage.getItem(LS_VOL));
      if (!isNaN(sv)) _vol = sv;
    } catch {}
    let saved = null;
    try { saved = localStorage.getItem(LS_KIND); } catch {}
    if (saved === 'rain' || saved === 'lofi') {
      // Defer until a gesture so we don't fight autoplay policy on load.
      const kick = () => {
        document.removeEventListener('pointerdown', kick);
        document.removeEventListener('keydown', kick);
        if (!_kind && localStorage.getItem(LS_KIND) === saved) start(saved);
      };
      document.addEventListener('pointerdown', kick, { once: true });
      document.addEventListener('keydown', kick, { once: true });
    }
  }

  return { init, start, stop, toggle, setVolume, current, getVolume };
})();
window.Ambient = Ambient;
