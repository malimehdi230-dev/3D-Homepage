'use strict';
/**
 * AIProviders — multi-key manager with automatic failover.
 * Storage: chrome.storage.local in extension context, localStorage on the web page.
 * Keys are NEVER logged in full to the console.
 */
const AIProviders = (() => {

  // ── Storage adapter ──────────────────────────────────────────────────────
  const LS_KEY = 'homepage_ai_providers';

  const Store = {
    async get() {
      try {
        if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
          return await new Promise(res =>
            chrome.storage.local.get('ai_providers', d => res(d.ai_providers ?? null))
          );
        }
      } catch {}
      try { return JSON.parse(localStorage.getItem(LS_KEY) ?? 'null'); } catch { return null; }
    },
    async set(val) {
      try {
        if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
          await new Promise(res => chrome.storage.local.set({ ai_providers: val }, res));
        }
      } catch {}
      // Always mirror to localStorage so the web-page build works too
      try { localStorage.setItem(LS_KEY, JSON.stringify(val)); } catch {}
    }
  };

  // ── In-memory cache ──────────────────────────────────────────────────────
  let _cache = null;   // array of provider objects, null until first load

  function _dispatch() {
    try { document.dispatchEvent(new CustomEvent('ai-providers-updated')); } catch {}
  }

  // ── Factory & helpers ────────────────────────────────────────────────────
  function _uid() {
    return `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }

  function _make(partial = {}) {
    return {
      id:           _uid(),
      name:         'New Provider',
      apiKey:       '',
      model:        'meta-llama/llama-4-scout-17b-16e-instruct',
      baseUrl:      'https://api.groq.com/openai/v1',
      priority:     0,
      enabled:      true,
      status:       'untested',   // 'untested' | 'working' | 'failing' | 'cooldown'
      lastError:    null,
      reqCount:     0,
      reqCountDate: '',
      cooldownUntil: 0,
      ...partial
    };
  }

  function _today() { return new Date().toDateString(); }

  function _reqToday(p) {
    return p.reqCountDate === _today() ? (p.reqCount || 0) : 0;
  }

  // Model-specific extra body fields so failover still adds the right params
  function _modelExtra(model) {
    if (model === 'openai/gpt-oss-120b')
      return { reasoning_effort: 'medium' };
    if (model === 'groq/compound')
      return { compound_custom: { tools: { enabled_tools: ['web_search', 'code_interpreter', 'visit_website'] } } };
    return {};
  }

  // ── Load / save ──────────────────────────────────────────────────────────
  async function _load() {
    if (_cache) return _cache;
    let data = await Store.get();
    if (!Array.isArray(data)) data = await _migrate();
    _cache = data;
    return _cache;
  }

  async function _save(arr) {
    _cache = arr;
    await Store.set(arr);
    _dispatch();
  }

  // One-time migration from the old single-key setting
  async function _migrate() {
    const oldKey   = localStorage.getItem('homepage_apiKey')  ?? '';
    const oldModel = localStorage.getItem('homepage_aiModel') ?? 'meta-llama/llama-4-scout-17b-16e-instruct';
    const list = [];
    if (oldKey && oldKey.trim().length > 8) {
      list.push(_make({ name: 'Groq (migrated)', apiKey: oldKey.trim(), model: oldModel, status: 'untested' }));
    }
    await Store.set(list);
    return list;
  }

  // ── Public CRUD ───────────────────────────────────────────────────────────
  async function getAll() {
    return _load();
  }

  async function add(partial) {
    const list = await _load();
    if (!partial.baseUrl || !partial.baseUrl.trim()) {
      partial.baseUrl = 'https://api.groq.com/openai/v1';
    }
    const prov = _make(partial);
    list.push(prov);
    await _save(list);
    return prov;
  }

  async function update(id, changes) {
    const list = await _load();
    const i = list.findIndex(p => p.id === id);
    if (i < 0) return null;
    if (changes.baseUrl !== undefined && !changes.baseUrl?.trim()) {
      changes.baseUrl = 'https://api.groq.com/openai/v1';
    }
    list[i] = { ...list[i], ...changes };
    await _save(list);
    return list[i];
  }

  async function remove(id) {
    const list = await _load();
    await _save(list.filter(p => p.id !== id));
  }

  // ── Failover engine ───────────────────────────────────────────────────────

  async function _candidates() {
    const now  = Date.now();
    const list = await _load();
    return list
      .filter(p => p.enabled && p.status !== 'failing' && (p.cooldownUntil || 0) < now)
      .sort((a, b) => a.priority - b.priority || 0);
  }

  async function _tryOne(prov, messages, opts) {
    const { stream = false, timeout = 20000, temperature = 1, maxTokens = 1024 } = opts;

    const ctrl = new AbortController();
    const tid  = setTimeout(() => { try { ctrl.abort(); } catch {} }, timeout);

    try {
      const body = {
        model:                prov.model,
        messages,
        temperature,
        max_completion_tokens: maxTokens,
        top_p:                1,
        stream,
        stop:                 null,
        ..._modelExtra(prov.model)
      };

      const resp = await fetch(`${prov.baseUrl}/chat/completions`, {
        method:  'POST',
        headers: {
          'Authorization': `Bearer ${prov.apiKey}`,
          'Content-Type':  'application/json'
        },
        body:   JSON.stringify(body),
        signal: ctrl.signal
      });

      clearTimeout(tid);

      if (resp.ok) {
        await update(prov.id, {
          status:       'working',
          lastError:    null,
          reqCount:     _reqToday(prov) + 1,
          reqCountDate: _today()
        });
        return resp;
      }

      // ── Error mapping ──────────────────────────────────────────────────
      if (resp.status === 401 || resp.status === 403) {
        await update(prov.id, { status: 'failing', lastError: 'Invalid or expired key' });
        const e = new Error('AUTH_FAIL'); e._noRetry = true; throw e;
      }
      if (resp.status === 429) {
        await update(prov.id, {
          status:        'cooldown',
          cooldownUntil: Date.now() + 60_000,
          lastError:     'Rate limited — 60 s cooldown'
        });
        throw new Error('RATE_LIMIT');
      }
      // Other HTTP errors
      let msg = `HTTP ${resp.status}`;
      try { msg = (await resp.json())?.error?.message || msg; } catch {}
      await update(prov.id, { status: 'failing', lastError: msg });
      throw new Error(msg);

    } catch (e) {
      clearTimeout(tid);
      if (e.name === 'AbortError') {
        await update(prov.id, { lastError: 'Request timed out' }).catch(() => {});
      }
      throw e;
    }
  }

  /**
   * Main entry point for all AI calls.
   * Returns { response, provider } on success; throws a user-friendly error on total failure.
   *
   * @param {Array}  messages  OpenAI-format messages array
   * @param {Object} opts      { stream, timeout, temperature, maxTokens }
   */
  async function aiComplete(messages, opts = {}) {
    let cands;
    try { cands = await _candidates(); } catch { cands = []; }

    if (!cands.length) {
      throw new Error(
        'No AI providers available. Add or enable a key in Settings → AI Providers.'
      );
    }

    for (const prov of cands) {
      try {
        const resp = await _tryOne(prov, messages, opts);
        return { response: resp, provider: prov };
      } catch { /* try next candidate */ }
    }

    throw new Error(
      'All AI keys are unavailable — add or re-test a key in Settings → AI Providers.'
    );
  }

  // ── Test a single key ────────────────────────────────────────────────────
  async function testProvider(id) {
    const list = await _load();
    const prov = list.find(p => p.id === id);
    if (!prov) return { ok: false, error: 'Provider not found' };

    // Mark as testing so UI can show spinner
    await update(id, { status: 'untested', lastError: null });

    try {
      const resp = await _tryOne(
        prov,
        [{ role: 'user', content: 'Hi' }],
        { stream: false, maxTokens: 1, timeout: 15_000 }
      );
      // Drain body to avoid resource leak
      try { await resp.text(); } catch {}
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  // ── Fetch available models from a provider ───────────────────────────────
  async function fetchModels(baseUrl, apiKey) {
    try {
      const ctrl = new AbortController();
      setTimeout(() => { try { ctrl.abort(); } catch {} }, 8_000);
      const resp = await fetch(`${baseUrl}/models`, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
        signal:  ctrl.signal
      });
      if (!resp.ok) return null;
      const d = await resp.json();
      return (d.data || []).map(m => m.id).filter(Boolean).sort();
    } catch { return null; }
  }

  // ── Snippet parser ────────────────────────────────────────────────────────
  /**
   * Extracts { apiKey?, model?, baseUrl? } from a Groq/OpenAI playground snippet.
   * Never throws — always returns a (possibly empty) object.
   */
  function parseSnippet(text) {
    if (typeof text !== 'string' || !text.trim()) return {};
    try {
      const r = {};

      // Real key: gsk_... or sk-... (20+ chars after prefix)
      const keyRx = /(?:["'`\s=:])((gsk_|sk-)[A-Za-z0-9_\-]{16,})(?:["'`\s,;\n]|$)/g;
      for (const m of text.matchAll(keyRx)) {
        const candidate = m[1];
        // Skip obvious placeholders
        if (/process\.env|os\.environ|GROQ_API_KEY|YOUR_API|<|>/.test(text.slice(
          Math.max(0, text.indexOf(candidate) - 30),
          text.indexOf(candidate) + candidate.length + 5
        ))) continue;
        r.apiKey = candidate;
        break;
      }

      // Model — handles JS, Python, curl, fetch formats
      const modelRx = /["']model["']\s*[:=]\s*["'`]([^"'`\n]{4,80})["'`]|[,\s]model\s*=\s*["'`]([^"'`\n]{4,80})["'`]/;
      const mM = modelRx.exec(text);
      if (mM) r.model = (mM[1] || mM[2]).trim();

      // Base URL override
      const urlRx = /base_url\s*=\s*["'`]([^"'`\n]+)["'`]|baseURL\s*[:=]\s*["'`]([^"'`\n]+)["'`]|"base_url"\s*:\s*"([^"]+)"/;
      const uM = urlRx.exec(text);
      if (uM) r.baseUrl = (uM[1] || uM[2] || uM[3]).trim().replace(/\/+$/, '');

      return r;
    } catch { return {}; }
  }

  // ── Utility exposed for UI ────────────────────────────────────────────────
  function maskKey(key) {
    if (!key || key.length < 8) return '••••••••';
    return '•'.repeat(Math.max(0, key.length - 6)) + key.slice(-6);
  }

  function reqTodayDisplay(p) {
    return _reqToday(p);
  }

  return {
    getAll, add, update, remove,
    aiComplete, testProvider, fetchModels, parseSnippet,
    maskKey, reqTodayDisplay
  };
})();
