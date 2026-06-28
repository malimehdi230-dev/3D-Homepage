// feedback.js — 3D Parallax Feedback Module
// Sends user feedback to the Vercel backend via fetch()

// ─── REPLACE THIS URL with your deployed Vercel project URL ───────────────────
const FEEDBACK_API = 'https://3-d-parallax-backend.vercel.app';
// ─────────────────────────────────────────────────────────────────────────────

const FB_GIVEN_KEY      = 'homepage_feedback_given';
const FB_NEVER_KEY      = 'homepage_feedback_never';
const FB_LAST_SHOWN_KEY = 'homepage_feedback_last_shown';

function _todayStr() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function shouldShowFeedbackNudge() {
  if (localStorage.getItem(FB_GIVEN_KEY) === 'true') return false;
  if (localStorage.getItem(FB_NEVER_KEY) === 'true') return false;
  const lastShown = localStorage.getItem(FB_LAST_SHOWN_KEY);
  if (!lastShown) return true;
  return lastShown !== _todayStr();
}

class FeedbackModule {
  constructor() {
    this.modal    = null;
    this.nudge    = null;
    this.isOpen   = false;
    this._getRating = () => null;
  }

  init() {
    this._buildModal();
    this._buildTriggerButton();

    // Wire settings panel button
    document.getElementById('settingsFeedbackBtn')
      ?.addEventListener('click', () => {
        // Close settings modal first, then open feedback
        document.getElementById('settingsModal')?.classList.remove('active');
        setTimeout(() => this.open(), 150);
      });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });

    // Daily nudge — show once per day until dismissed forever or feedback sent
    setTimeout(() => this._checkDailyNudge(), 3000);
  }

  // ── Daily nudge ─────────────────────────────────────────────────────────────

  _checkDailyNudge() {
    if (!shouldShowFeedbackNudge()) return;
    this._buildNudge();
  }

  _buildNudge() {
    if (this.nudge) return; // already built

    const nudge = document.createElement('div');
    nudge.id = 'feedbackNudge';
    nudge.setAttribute('role', 'dialog');
    nudge.setAttribute('aria-label', 'Share your feedback');
    nudge.innerHTML = `
      <div id="feedbackNudgeHeader">
        <span id="feedbackNudgeTitle">
          <i class="fas fa-comment-dots" style="color:var(--primary)"></i>
          Enjoying 3D Parallax?
        </span>
        <button id="feedbackNudgeClose" aria-label="Close"><i class="fas fa-xmark"></i></button>
      </div>
      <p id="feedbackNudgeMsg">Your feedback helps make it better. It only takes 30 seconds.</p>
      <div id="feedbackNudgeActions">
        <button id="feedbackNudgeGive"><i class="fas fa-paper-plane"></i> Give Feedback</button>
        <button id="feedbackNudgeNever">Never show again</button>
      </div>
    `;

    document.body.appendChild(nudge);
    this.nudge = nudge;

    // Force reflow before adding class so the transition fires
    nudge.offsetHeight;
    nudge.classList.add('visible');

    document.getElementById('feedbackNudgeClose').addEventListener('click', () => {
      localStorage.setItem(FB_LAST_SHOWN_KEY, _todayStr());
      this._hideNudge();
    });

    document.getElementById('feedbackNudgeGive').addEventListener('click', () => {
      localStorage.setItem(FB_LAST_SHOWN_KEY, _todayStr());
      this._hideNudge();
      setTimeout(() => this.open(), 200);
    });

    document.getElementById('feedbackNudgeNever').addEventListener('click', () => {
      localStorage.setItem(FB_NEVER_KEY, 'true');
      this._hideNudge();
    });
  }

  _hideNudge() {
    if (!this.nudge) return;
    this.nudge.classList.remove('visible');
    setTimeout(() => {
      this.nudge?.remove();
      this.nudge = null;
    }, 350);
  }

  // ── Trigger button ───────────────────────────────────────────────────────────

  _buildTriggerButton() {
    const btn = document.createElement('button');
    btn.id = 'feedbackTriggerBtn';
    btn.innerHTML = '<i class="fas fa-comment-dots"></i><span>Feedback</span>';
    btn.setAttribute('aria-label', 'Send feedback');
    btn.title = 'Send feedback (F)';
    btn.addEventListener('click', () => this.open());
    document.body.appendChild(btn);
  }

  // ── Modal ────────────────────────────────────────────────────────────────────

  _buildModal() {
    const overlay = document.createElement('div');
    overlay.id = 'feedbackOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Send feedback');

    overlay.innerHTML = `
      <div id="feedbackModal">
        <div id="feedbackHeader">
          <span id="feedbackTitle">
            <i class="fas fa-comment-dots"></i> Send Feedback
          </span>
          <button id="feedbackClose" aria-label="Close feedback">
            <i class="fas fa-xmark"></i>
          </button>
        </div>

        <div id="feedbackBody">
          <div class="fb-field">
            <label class="fb-label">What kind of feedback?</label>
            <div id="feedbackTypes">
              <button class="fb-type-btn active" data-type="general">💬 General</button>
              <button class="fb-type-btn" data-type="bug">🐛 Bug</button>
              <button class="fb-type-btn" data-type="feature">✨ Feature</button>
              <button class="fb-type-btn" data-type="praise">🙌 Praise</button>
              <button class="fb-type-btn" data-type="ui">🎨 UI</button>
              <button class="fb-type-btn" data-type="performance">⚡ Performance</button>
            </div>
          </div>

          <div class="fb-field">
            <label class="fb-label">Rate your experience</label>
            <div id="feedbackStars">
              <button class="fb-star" data-value="1" aria-label="1 star">★</button>
              <button class="fb-star" data-value="2" aria-label="2 stars">★</button>
              <button class="fb-star" data-value="3" aria-label="3 stars">★</button>
              <button class="fb-star" data-value="4" aria-label="4 stars">★</button>
              <button class="fb-star" data-value="5" aria-label="5 stars">★</button>
            </div>
          </div>

          <div class="fb-field">
            <label class="fb-label" for="feedbackMessage">Your message</label>
            <textarea
              id="feedbackMessage"
              placeholder="Tell us what you think, what's broken, or what you'd love to see…"
              maxlength="2000"
              rows="5"
            ></textarea>
            <span id="feedbackCharCount">0 / 2000</span>
          </div>
        </div>

        <div id="feedbackFooter">
          <span id="feedbackStatus"></span>
          <button id="feedbackSubmit">
            <i class="fas fa-paper-plane"></i> Send Feedback
          </button>
        </div>
      </div>
    `;

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });

    document.body.appendChild(overlay);
    this.modal = overlay;
    this._bindModalEvents();
  }

  _bindModalEvents() {
    document.getElementById('feedbackClose')
      .addEventListener('click', () => this.close());

    document.getElementById('feedbackTypes').addEventListener('click', (e) => {
      const btn = e.target.closest('.fb-type-btn');
      if (!btn) return;
      document.querySelectorAll('.fb-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });

    const stars = document.querySelectorAll('.fb-star');
    let selectedRating = 0;
    stars.forEach(star => {
      star.addEventListener('mouseenter', () => {
        const val = +star.dataset.value;
        stars.forEach(s => s.classList.toggle('hovered', +s.dataset.value <= val));
      });
      star.addEventListener('mouseleave', () => {
        stars.forEach(s => s.classList.remove('hovered'));
      });
      star.addEventListener('click', () => {
        selectedRating = +star.dataset.value;
        stars.forEach(s => {
          s.classList.toggle('selected', +s.dataset.value <= selectedRating);
        });
      });
    });
    this._getRating = () => selectedRating || null;

    const textarea = document.getElementById('feedbackMessage');
    const counter  = document.getElementById('feedbackCharCount');
    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      counter.textContent = `${len} / 2000`;
      counter.style.color = len > 1800 ? '#ef4444' : '#9ca3af';
    });

    document.getElementById('feedbackSubmit')
      .addEventListener('click', () => this._submit());
  }

  async _submit() {
    const message   = document.getElementById('feedbackMessage').value.trim();
    const type      = document.querySelector('.fb-type-btn.active')?.dataset.type ?? 'general';
    const rating    = this._getRating();
    const status    = document.getElementById('feedbackStatus');
    const submitBtn = document.getElementById('feedbackSubmit');

    if (!message || message.length < 3) {
      status.textContent = '⚠ Please write at least a few words.';
      status.style.color = '#ef4444';
      document.getElementById('feedbackMessage').focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    status.textContent  = '';

    const theme   = document.body.dataset.template
      ?? localStorage.getItem('homepage_template')
      ?? 'unknown';
    const version = (typeof chrome !== 'undefined' && chrome?.runtime?.getManifest?.()?.version)
      ?? '2.1.0';

    try {
      const res = await fetch(FEEDBACK_API, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message, type, rating, theme, version,
          timestamp: new Date().toISOString(),
        }),
      });

      if (res.status === 429) {
        throw new Error('Too many submissions. Please wait a minute before trying again.');
      }

      const data = await res.json();

      if (res.ok && data.success) {
        submitBtn.innerHTML        = '<i class="fas fa-check"></i> Sent!';
        submitBtn.style.background = 'var(--primary)';
        submitBtn.style.color      = '#0a0a0f';
        status.textContent         = 'Thank you! Your feedback has been received.';
        status.style.color         = 'var(--primary)';

        // Dismiss nudge forever — user has given feedback
        localStorage.setItem(FB_GIVEN_KEY, 'true');

        setTimeout(() => { this.close(); this._reset(); }, 2000);
      } else {
        throw new Error(data.error ?? 'Unknown error');
      }

    } catch (err) {
      submitBtn.disabled  = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Feedback';
      status.textContent  = `⚠ ${err.message || 'Network error. Please try again.'}`;
      status.style.color  = '#ef4444';
    }
  }

  _reset() {
    document.getElementById('feedbackMessage').value = '';
    document.getElementById('feedbackCharCount').textContent = '0 / 2000';
    document.getElementById('feedbackStatus').textContent = '';
    const sb = document.getElementById('feedbackSubmit');
    sb.disabled         = false;
    sb.innerHTML        = '<i class="fas fa-paper-plane"></i> Send Feedback';
    sb.style.background = '';
    sb.style.color      = '';
    document.querySelectorAll('.fb-type-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    document.querySelectorAll('.fb-star').forEach(s => s.classList.remove('selected', 'hovered'));
  }

  open() {
    this.modal.classList.add('open');
    this.isOpen = true;
    setTimeout(() => document.getElementById('feedbackMessage')?.focus(), 300);
  }

  close() {
    this.modal.classList.remove('open');
    this.isOpen = false;
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }
}

window.Feedback = new FeedbackModule();
