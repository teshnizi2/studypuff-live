/* ============================================================
   StudyPuff – Shared App Logic
   ============================================================ */

// ── Storage helpers ──────────────────────────────────────────
const SP = {
  get(key, fallback = null) {
    try { const v = localStorage.getItem('sp_' + key); return v !== null ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem('sp_' + key, JSON.stringify(value)); } catch {}
  },
  remove(key) {
    try { localStorage.removeItem('sp_' + key); } catch {}
  },
  allKeys() {
    const out = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('sp_')) out.push(k);
      }
    } catch {}
    return out;
  }
};

// ── Coins ────────────────────────────────────────────────────
function getCoins()        { return SP.get('coins', 0); }
function setCoins(n)       { SP.set('coins', Math.max(0, Math.floor(n))); refreshCoinBadge(); }
function addCoins(n, opts = {}) {
  const c = getCoins() + n;
  SP.set('coins', c);
  refreshCoinBadge();
  if (!opts.silent && typeof SPFeedback !== 'undefined') {
    SPFeedback.coinFloat(n, opts.from);
    SPFeedback.pulseCoinBadge();
    SPFeedback.sfx(n >= 10 ? 'levelUp' : 'coin');
  }
  return c;
}
function spendCoins(n) {
  const c = getCoins();
  if (c < n) return false;
  SP.set('coins', c - n); refreshCoinBadge();
  if (typeof SPFeedback !== 'undefined') {
    SPFeedback.coinFloat(-n);
    SPFeedback.pulseCoinBadge();
    SPFeedback.sfx('coinMinus');
  }
  return true;
}

function refreshCoinBadge() {
  document.querySelectorAll('.coin-count').forEach(el => { el.textContent = getCoins(); });
}

// ── Settings ─────────────────────────────────────────────────
// { darkMode, focusMin, shortBreakMin, longBreakMin, autoCycle, ambient, chime, dailyGoalMin }
const DEFAULT_SETTINGS = {
  darkMode: false,
  focusMin: 25,
  shortBreakMin: 5,
  longBreakMin: 15,
  autoCycle: false,
  ambient: 'none',
  chime: true,
  dailyGoalMin: 60
};
function getSettings() {
  const s = SP.get('settings', {});
  return { ...DEFAULT_SETTINGS, ...(s || {}) };
}
function setSettings(patch) {
  const merged = { ...getSettings(), ...patch };
  SP.set('settings', merged);
  applyTheme();
  return merged;
}

// ── Theme (dark mode + shop-unlocked palettes) ───────────────
// themes: 'forest' (default), 'ocean', 'sunset', 'lavender', 'midnight'
const THEMES = {
  forest:   { bgStart: '#c4d9b0', bgEnd: '#8db07e', circle: '#4a7c59', accent: '#4a7c59' },
  ocean:    { bgStart: '#b5d9e8', bgEnd: '#6fa7c6', circle: '#2e6a9e', accent: '#2e6a9e' },
  sunset:   { bgStart: '#f9cfa6', bgEnd: '#e89773', circle: '#c85530', accent: '#c85530' },
  lavender: { bgStart: '#d9c8ea', bgEnd: '#a88acb', circle: '#6e4ea6', accent: '#6e4ea6' },
  midnight: { bgStart: '#3a4455', bgEnd: '#1e2430', circle: '#8fb3d9', accent: '#8fb3d9' }
};
const THEME_META = {
  forest:   { label: 'Forest',   price: 0,   emoji: '🌲' },
  ocean:    { label: 'Ocean',    price: 50,  emoji: '🌊' },
  sunset:   { label: 'Sunset',   price: 80,  emoji: '🌇' },
  lavender: { label: 'Lavender', price: 120, emoji: '💜' },
  midnight: { label: 'Midnight', price: 200, emoji: '🌙' }
};

function getInventory() {
  return SP.get('inventory', { themes: ['forest'], activeTheme: 'forest' });
}
function setInventory(inv) { SP.set('inventory', inv); }

function applyTheme() {
  const s   = getSettings();
  const inv = getInventory();
  const themeKey = THEMES[inv.activeTheme] ? inv.activeTheme : 'forest';
  const t = THEMES[themeKey];

  const root = document.documentElement;
  root.style.setProperty('--bg-start', t.bgStart);
  root.style.setProperty('--bg-end',   t.bgEnd);
  root.style.setProperty('--circle-bg', t.circle);
  root.style.setProperty('--accent',    t.accent);

  document.body && document.body.classList.toggle('dark', !!s.darkMode);
}

// ── Nav Drawer ───────────────────────────────────────────────
function initDrawer() {
  const overlay  = document.getElementById('drawerOverlay');
  const drawer   = document.getElementById('drawer');
  const hamburger = document.getElementById('hamburger');
  if (!overlay || !drawer || !hamburger) return;

  function open()  { overlay.classList.add('open'); drawer.classList.add('open'); }
  function close() { overlay.classList.remove('open'); drawer.classList.remove('open'); }

  hamburger.addEventListener('click', open);
  overlay.addEventListener('click', close);

  // mark active link
  const path = location.pathname.split('/').pop() || 'index.html';
  drawer.querySelectorAll('nav a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
}

// ── Session data helpers ─────────────────────────────────────
// sessions: array of { date: 'YYYY-MM-DD', taskName, topicName, minutes, focusScore, mode }
function getSessions() { return SP.get('sessions', []); }
function addSession(s) { const arr = getSessions(); arr.push(s); SP.set('sessions', arr); }

// Aggregate helpers
function minutesOnDate(dateStr) {
  return getSessions()
    .filter(s => s.date === dateStr && (s.mode || 'focus') === 'focus')
    .reduce((a, s) => a + (s.minutes || 0), 0);
}
function totalFocusMinutes() {
  return getSessions()
    .filter(s => (s.mode || 'focus') === 'focus')
    .reduce((a, s) => a + (s.minutes || 0), 0);
}

// ── Streak ───────────────────────────────────────────────────
// Count of consecutive days (ending today, or yesterday if today is empty)
// where at least 1 focus session was logged.
function computeStreak() {
  const byDay = new Set(
    getSessions()
      .filter(s => (s.mode || 'focus') === 'focus' && (s.minutes || 0) > 0)
      .map(s => s.date)
  );
  if (byDay.size === 0) return 0;
  let streak = 0;
  const d = new Date();
  // If today has no sessions, start counting from yesterday so the streak
  // isn't broken until a whole day is missed.
  if (!byDay.has(d.toISOString().slice(0,10))) d.setDate(d.getDate() - 1);
  while (byDay.has(d.toISOString().slice(0,10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

// ── Topics / Tasks ───────────────────────────────────────────
// topics: [ { name, tasks: [{text, done, priority, due}] } ]
// tasks may be legacy strings or legacy {text,done} — always normalize.
function getTopics() { return SP.get('topics', []); }
function setTopics(t) { SP.set('topics', t); }

function normalizeTask(t) {
  if (typeof t === 'string') return { text: t, done: false, priority: 'none', due: '' };
  return {
    text:     t.text || '',
    done:     !!t.done,
    priority: t.priority || 'none',
    due:      t.due || ''
  };
}
function getTaskText(t) {
  if (typeof t === 'string') return t;
  return t.text || '';
}

// ── Classes / Grades ─────────────────────────────────────────
// classes: [ { name, avg, assignments: [{name, weight, grade}] } ]
function getClasses() { return SP.get('classes', []); }
function setClasses(c) { SP.set('classes', c); }

// ── Date Helpers ─────────────────────────────────────────────
function todayStr() { return new Date().toISOString().slice(0, 10); }
function dayOfWeek(dateStr) {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  return days[new Date(dateStr + 'T00:00:00').getDay()];
}

function getWeekDates(offset = 0) {
  // offset=0 → this week (Mon-Sun), offset=-7 → last week
  const today = new Date();
  const dow = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dow + 6) % 7) + offset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

// ── Productivity helpers ─────────────────────────────────────
// productivityLog: [ { date, focusScore, focusCount, stressScore } ]
function getProductivityLog() { return SP.get('productivity', []); }
function addProductivityEntry(entry) {
  const log = getProductivityLog();
  const existing = log.findIndex(e => e.date === entry.date);
  if (existing >= 0) {
    if (entry.focusScore !== undefined) {
      const prev = log[existing].focusScore || 0;
      const cnt  = log[existing].focusCount || 1;
      log[existing].focusScore = (prev * cnt + entry.focusScore) / (cnt + 1);
      log[existing].focusCount = cnt + 1;
    }
    if (entry.stressScore !== undefined) {
      log[existing].stressScore = entry.stressScore;
    }
  } else {
    log.push(entry);
  }
  SP.set('productivity', log);
}

// ── Daily motivational quote (deterministic per day) ─────────
const QUOTES = [
  ['Small steps every day.', '— StudyPuff'],
  ['The secret of getting ahead is getting started.', '— Mark Twain'],
  ['Discipline is choosing between what you want now and what you want most.', '— Abraham Lincoln'],
  ['Success is the sum of small efforts, repeated day in and day out.', '— Robert Collier'],
  ['You don\u2019t have to be great to start, but you have to start to be great.', '— Zig Ziglar'],
  ['One page at a time. One breath at a time.', '— StudyPuff'],
  ['Focus on being productive, not busy.', '— Tim Ferriss'],
  ['The expert in anything was once a beginner.', '— Helen Hayes'],
  ['Don\u2019t watch the clock; do what it does. Keep going.', '— Sam Levenson'],
  ['It always seems impossible until it\u2019s done.', '— Nelson Mandela'],
  ['The only way to do great work is to love what you do.', '— Steve Jobs'],
  ['A little progress each day adds up to big results.', '— Satya Nani'],
  ['Be gentle with yourself. You\u2019re doing better than you think.', '— StudyPuff'],
  ['Study smart, not just hard.', '— StudyPuff'],
  ['Rest is productive too.', '— StudyPuff']
];
function quoteOfTheDay() {
  // Seed by days-since-epoch so it rotates daily but is stable within a day
  const days = Math.floor(Date.now() / 86400000);
  return QUOTES[days % QUOTES.length];
}

// ── Data export / import / reset ─────────────────────────────
function exportAllData() {
  const data = {};
  SP.allKeys().forEach(k => {
    try { data[k] = JSON.parse(localStorage.getItem(k)); } catch { data[k] = localStorage.getItem(k); }
  });
  return {
    app: 'StudyPuff',
    version: 2,
    exportedAt: new Date().toISOString(),
    data
  };
}
function importAllData(payload) {
  if (!payload || !payload.data) throw new Error('Invalid backup file.');
  // Remove existing SP keys
  SP.allKeys().forEach(k => { try { localStorage.removeItem(k); } catch {} });
  Object.entries(payload.data).forEach(([k, v]) => {
    try { localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)); } catch {}
  });
}
function resetAllData() {
  SP.allKeys().forEach(k => { try { localStorage.removeItem(k); } catch {} });
}

// ── Sound engine (Web Audio; zero external files) ────────────
// Chime = two soft sine tones; ambient = filtered noise or tone bed.
const SPSound = (() => {
  let ctx = null;
  let ambientNodes = null;    // { stop(): void }

  function ensureCtx() {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }

  function playChime() {
    const a = ensureCtx();
    if (!a) return;
    const now = a.currentTime;
    [660, 880].forEach((f, i) => {
      const osc = a.createOscillator();
      const g   = a.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      g.gain.setValueAtTime(0, now + i * 0.22);
      g.gain.linearRampToValueAtTime(0.25, now + i * 0.22 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.22 + 0.8);
      osc.connect(g).connect(a.destination);
      osc.start(now + i * 0.22);
      osc.stop(now + i * 0.22 + 0.85);
    });
  }

  function makeNoiseBuffer(a, seconds = 2) {
    const buf = a.createBuffer(1, a.sampleRate * seconds, a.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  function startAmbient(kind) {
    stopAmbient();
    if (!kind || kind === 'none') return;
    const a = ensureCtx();
    if (!a) return;

    const master = a.createGain();
    master.gain.value = 0;
    master.gain.linearRampToValueAtTime(0.22, a.currentTime + 0.6);
    master.connect(a.destination);

    const made = [];

    if (kind === 'white') {
      const src = a.createBufferSource();
      src.buffer = makeNoiseBuffer(a, 2);
      src.loop = true;
      src.connect(master);
      src.start();
      made.push(src);
    } else if (kind === 'rain') {
      const src = a.createBufferSource();
      src.buffer = makeNoiseBuffer(a, 2);
      src.loop = true;
      const hp = a.createBiquadFilter();
      hp.type = 'highpass'; hp.frequency.value = 800;
      const lp = a.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 4500;
      src.connect(hp).connect(lp).connect(master);
      src.start();
      made.push(src);
    } else if (kind === 'cafe') {
      // low rumble + pink-ish tone
      const src = a.createBufferSource();
      src.buffer = makeNoiseBuffer(a, 2);
      src.loop = true;
      const lp = a.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 500;
      src.connect(lp).connect(master);
      src.start();
      made.push(src);

      // tiny clinks
      const clinkTimer = setInterval(() => {
        const osc = a.createOscillator();
        const g   = a.createGain();
        osc.type = 'triangle';
        osc.frequency.value = 1800 + Math.random() * 600;
        g.gain.setValueAtTime(0, a.currentTime);
        g.gain.linearRampToValueAtTime(0.04, a.currentTime + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.25);
        osc.connect(g).connect(master);
        osc.start();
        osc.stop(a.currentTime + 0.3);
      }, 3500 + Math.random() * 2500);
      made.push({ stop(){ clearInterval(clinkTimer); } });
    } else if (kind === 'forest') {
      // wind = heavily filtered noise; chirps = short sine pings
      const src = a.createBufferSource();
      src.buffer = makeNoiseBuffer(a, 2);
      src.loop = true;
      const lp = a.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 900;
      src.connect(lp).connect(master);
      src.start();
      made.push(src);

      const chirpTimer = setInterval(() => {
        const osc = a.createOscillator();
        const g   = a.createGain();
        osc.type = 'sine';
        osc.frequency.value = 1400 + Math.random() * 800;
        g.gain.setValueAtTime(0, a.currentTime);
        g.gain.linearRampToValueAtTime(0.05, a.currentTime + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.4);
        osc.connect(g).connect(master);
        osc.start();
        osc.stop(a.currentTime + 0.5);
      }, 2500 + Math.random() * 2500);
      made.push({ stop(){ clearInterval(chirpTimer); } });
    } else if (kind === 'lofi') {
      // slow arpeggio in A minor pentatonic
      const scale = [220, 261.63, 293.66, 329.63, 392];
      let step = 0;
      const loop = setInterval(() => {
        const f = scale[step % scale.length];
        step++;
        const osc = a.createOscillator();
        const g   = a.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        g.gain.setValueAtTime(0, a.currentTime);
        g.gain.linearRampToValueAtTime(0.12, a.currentTime + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 1.4);
        osc.connect(g).connect(master);
        osc.start();
        osc.stop(a.currentTime + 1.5);
      }, 600);
      made.push({ stop(){ clearInterval(loop); } });
    }

    ambientNodes = {
      stop() {
        try { master.gain.cancelScheduledValues(a.currentTime); } catch {}
        try { master.gain.linearRampToValueAtTime(0, a.currentTime + 0.3); } catch {}
        setTimeout(() => {
          made.forEach(n => { try { n.stop(); } catch {} });
        }, 350);
      }
    };
  }

  function stopAmbient() {
    if (ambientNodes) { try { ambientNodes.stop(); } catch {} }
    ambientNodes = null;
  }

  return { playChime, startAmbient, stopAmbient };
})();

// ── Interaction feedback (sounds, sparkles, toasts, confetti, ripple) ──
const SPFeedback = (() => {
  // — Web Audio synthesis engine ————————————————————————
  function getCtx() {
    if (!SPFeedback._ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      try { SPFeedback._ctx = new C(); } catch { return null; }
    }
    const c = SPFeedback._ctx;
    if (c && c.state === 'suspended') c.resume().catch(() => {});
    return c;
  }

  // Play a sequence of notes. Each note: { f, type, dur, gain, delay, fEnd, attack }
  function playNotes(notes, opts = {}) {
    if (!getSettings().chime) return;
    const ctx = getCtx();
    if (!ctx) return;

    const t0 = ctx.currentTime + 0.001;

    const master = ctx.createGain();
    master.gain.value = opts.master != null ? opts.master : 0.85;

    let tail = master;
    if (opts.filter) {
      const f = ctx.createBiquadFilter();
      f.type = opts.filter;
      f.frequency.value = opts.filterFreq != null ? opts.filterFreq : 1400;
      if (opts.filterQ) f.Q.value = opts.filterQ;
      master.connect(f);
      tail = f;
    }
    tail.connect(ctx.destination);

    notes.forEach(n => {
      const start = t0 + (n.delay || 0);
      const dur   = n.dur != null ? n.dur : 0.12;
      const peak  = n.gain != null ? n.gain : 0.11;
      const attack = n.attack != null ? n.attack : 0.006;

      const osc = ctx.createOscillator();
      osc.type = n.type || 'sine';
      osc.frequency.setValueAtTime(n.f, start);
      if (n.fEnd != null) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(40, n.fEnd), start + dur);
      }

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(peak, start + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      osc.connect(g).connect(master);
      osc.start(start);
      osc.stop(start + dur + 0.03);
    });
  }

  // Pleasant, musical click sound palette. Short, soft, never harsh.
  const SFX = {
    // Default button tap — soft wooden "tok"
    click: () => playNotes(
      [{ f: 520, type: 'triangle', dur: 0.08, gain: 0.10, fEnd: 340, attack: 0.003 }],
      { filter: 'lowpass', filterFreq: 2600 }
    ),
    // Very soft tap for subtle taps (drawer, minor nav)
    tap: () => playNotes(
      [{ f: 420, type: 'sine', dur: 0.06, gain: 0.07, fEnd: 350 }],
      { filter: 'lowpass', filterFreq: 2000 }
    ),
    // Checkbox check — upward chirp, bright & positive
    pop: () => playNotes(
      [{ f: 440, type: 'sine', dur: 0.09, gain: 0.12, fEnd: 760, attack: 0.003 }]
    ),
    // Checkbox uncheck — neutral descending
    uncheck: () => playNotes(
      [{ f: 620, type: 'sine', dur: 0.07, gain: 0.08, fEnd: 380 }]
    ),
    // Toggle switch — tight click-clack
    toggle: () => playNotes(
      [{ f: 780, type: 'square', dur: 0.035, gain: 0.06 }],
      { filter: 'lowpass', filterFreq: 2200 }
    ),
    // Two-tone success bell (E5 → B5)
    success: () => playNotes([
      { f: 659.25, type: 'sine', dur: 0.20, gain: 0.13, delay: 0.00 },
      { f: 987.77, type: 'sine', dur: 0.32, gain: 0.11, delay: 0.09 },
    ]),
    // Coin sparkle — E6 → A6 → E7 triad
    coin: () => playNotes([
      { f: 1318.5, type: 'triangle', dur: 0.09, gain: 0.11, delay: 0.00 },
      { f: 1760.0, type: 'triangle', dur: 0.11, gain: 0.10, delay: 0.05 },
      { f: 2637.0, type: 'triangle', dur: 0.18, gain: 0.08, delay: 0.11 },
    ]),
    // Coin spend — descending two-note
    coinMinus: () => playNotes([
      { f: 880, type: 'triangle', dur: 0.09, gain: 0.09, delay: 0.00 },
      { f: 587, type: 'triangle', dur: 0.11, gain: 0.08, delay: 0.06 },
    ]),
    // Polite "can't do that" low buzz — not annoying
    error: () => playNotes(
      [
        { f: 300, type: 'square', dur: 0.09, gain: 0.07, fEnd: 210 },
        { f: 240, type: 'square', dur: 0.11, gain: 0.06, fEnd: 160, delay: 0.07 },
      ],
      { filter: 'lowpass', filterFreq: 850 }
    ),
    // Destructive thunk — low, short
    delete: () => playNotes(
      [{ f: 210, type: 'sine', dur: 0.13, gain: 0.10, fEnd: 110 }]
    ),
    // Nav / page flip — little rise
    nav: () => playNotes(
      [{ f: 540, type: 'sine', dur: 0.08, gain: 0.07, fEnd: 720 }]
    ),
    // Level-up arpeggio (C5→E5→G5→C6) — big wins only
    levelUp: () => playNotes([
      { f: 523.25, type: 'triangle', dur: 0.12, gain: 0.13, delay: 0.00 },
      { f: 659.25, type: 'triangle', dur: 0.12, gain: 0.13, delay: 0.09 },
      { f: 783.99, type: 'triangle', dur: 0.14, gain: 0.13, delay: 0.18 },
      { f: 1046.5, type: 'triangle', dur: 0.28, gain: 0.12, delay: 0.27 },
    ]),
  };

  function sfx(name) {
    const fn = SFX[name] || SFX.click;
    try { fn(); } catch {}
  }

  // Pick the appropriate sound for a clicked element based on its semantics.
  function soundForElement(el) {
    if (!el) return 'click';
    const explicit = el.closest && el.closest('[data-sfx]');
    if (explicit) return explicit.getAttribute('data-sfx');

    if (el.closest && el.closest('.coin-badge'))                          return 'coin';
    if (el.closest && el.closest('.delete-btn, .trash-btn, .remove-btn, .danger, [data-danger]')) return 'delete';
    if (el.matches && el.matches('.switch, .switch input, input[type="checkbox"].toggle, .toggle-btn')) return 'toggle';
    if (el.closest && el.closest('.task-check, .check-btn'))              return 'pop';
    if (el.closest && el.closest('#hamburger, .drawer a, .drawer-close, .back-btn, nav a')) return 'nav';
    if (el.closest && el.closest('.preset-btn, .pill-btn-nav, .subject-pill')) return 'tap';
    return 'click';
  }

  function vibrate(ms = 10) { try { navigator.vibrate && navigator.vibrate(ms); } catch {} }
  // Back-compat alias — a few callers still reference clickSound()
  function clickSound() { sfx('click'); }

  // — Toast ————————————————————————————————————————————————
  function ensureLayer() {
    let l = document.getElementById('spFeedbackLayer');
    if (!l) {
      l = document.createElement('div');
      l.id = 'spFeedbackLayer';
      l.className = 'sp-feedback-layer';
      document.body.appendChild(l);
    }
    return l;
  }
  function toast(msg, { icon = '✨', kind = 'info', ms = 2000, silent = false } = {}) {
    const layer = ensureLayer();
    const el = document.createElement('div');
    el.className = `sp-toast sp-toast-${kind}`;
    el.innerHTML = `<span class="sp-toast-icon">${icon}</span><span class="sp-toast-msg"></span>`;
    el.querySelector('.sp-toast-msg').textContent = msg;
    layer.appendChild(el);
    requestAnimationFrame(() => el.classList.add('visible'));
    if (!silent) {
      if (kind === 'success')      sfx('success');
      else if (kind === 'warn')    sfx('coinMinus');
      else if (kind === 'danger')  sfx('error');
    }
    setTimeout(() => {
      el.classList.remove('visible');
      setTimeout(() => el.remove(), 300);
    }, ms);
  }

  // — Floating coin animation ——————————————————————————
  function coinFloat(n, fromEl) {
    if (!n) return;
    const layer = ensureLayer();
    const target = document.querySelector('.coin-badge');
    const end = target ? target.getBoundingClientRect() : { left: window.innerWidth - 60, top: 20, width: 40, height: 40 };
    const startRect = (fromEl && fromEl.getBoundingClientRect && fromEl.getBoundingClientRect())
      || { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };

    const el = document.createElement('div');
    el.className = 'sp-coin-float' + (n < 0 ? ' negative' : '');
    el.innerHTML = `<span class="sp-coin-icon-mini">🪙</span><span>${n > 0 ? '+' : ''}${n}</span>`;
    el.style.left = (startRect.left + startRect.width / 2) + 'px';
    el.style.top  = (startRect.top + startRect.height / 2) + 'px';
    layer.appendChild(el);

    const dx = (end.left + end.width / 2) - (startRect.left + startRect.width / 2);
    const dy = (end.top + end.height / 2) - (startRect.top + startRect.height / 2);

    requestAnimationFrame(() => {
      el.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(.6)`;
      el.style.opacity = '0';
    });
    setTimeout(() => el.remove(), 950);
  }

  function pulseCoinBadge() {
    document.querySelectorAll('.coin-badge').forEach(b => {
      b.classList.remove('sp-bounce');
      // re-trigger
      void b.offsetWidth;
      b.classList.add('sp-bounce');
    });
  }

  // — Confetti ————————————————————————————————————————————
  function confetti(opts = {}) {
    const layer = ensureLayer();
    const host = document.createElement('div');
    host.className = 'sp-confetti-host';
    layer.appendChild(host);

    const count = opts.count || 70;
    const colors = opts.colors || ['#f5c518', '#4a7c59', '#e8724a', '#2e6a9e', '#8b6ea6', '#ffffff'];
    const x = opts.originX != null ? opts.originX : window.innerWidth / 2;
    const y = opts.originY != null ? opts.originY : window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'sp-confetto';
      const size = 6 + Math.random() * 8;
      p.style.width = size + 'px';
      p.style.height = size * 0.42 + 'px';
      p.style.background = colors[i % colors.length];
      p.style.left = x + 'px';
      p.style.top  = y + 'px';
      const angle = Math.random() * Math.PI * 2;
      const dist  = 80 + Math.random() * 220;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 80;
      const rot = (Math.random() * 720 - 360) + 'deg';
      p.style.setProperty('--dx', dx + 'px');
      p.style.setProperty('--dy', dy + 'px');
      p.style.setProperty('--rot', rot);
      p.style.animationDelay = (Math.random() * 120) + 'ms';
      host.appendChild(p);
    }
    setTimeout(() => host.remove(), 1800);
  }

  // — Shake (denied / wrong action) ————————————————————————
  function shake(el) {
    if (!el) return;
    el.classList.remove('sp-shake');
    void el.offsetWidth; // reflow so the animation re-triggers
    el.classList.add('sp-shake');
    setTimeout(() => el.classList.remove('sp-shake'), 520);
  }

  // Combined "nope" feedback — shake + buzz + (optional) toast
  function denied(el, msg, toastOpts = {}) {
    if (el) shake(el);
    sfx('error');
    vibrate(30);
    if (msg) toast(msg, Object.assign({ icon: '⚠️', kind: 'warn', ms: 1600 }, toastOpts));
  }

  // — Sparkle burst (for small celebrations like task-complete) ——
  function sparkle(el, opts = {}) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const layer = ensureLayer();
    const host = document.createElement('div');
    host.className = 'sp-sparkle-host';
    host.style.left = (rect.left + rect.width / 2) + 'px';
    host.style.top  = (rect.top  + rect.height / 2) + 'px';
    layer.appendChild(host);

    const glyphs = opts.glyphs || ['✨', '⭐', '💫', '🌟'];
    const count  = opts.count  || 7;
    const radius = opts.radius || 36;

    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'sp-sparkle';
      s.textContent = glyphs[i % glyphs.length];
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const dist  = radius + Math.random() * radius * 0.6;
      s.style.setProperty('--dx', (Math.cos(angle) * dist).toFixed(1) + 'px');
      s.style.setProperty('--dy', (Math.sin(angle) * dist - 10).toFixed(1) + 'px');
      s.style.animationDelay = (Math.random() * 80) + 'ms';
      host.appendChild(s);
    }
    setTimeout(() => host.remove(), 1000);
  }

  // — Global click → ripple + sound ————————————————————————
  const INTERACTIVE_SEL = [
    'button', '.pill-btn', '.coin-badge', '.add-btn', '.preset-btn',
    '.shop-card', '.topic-card', '.task-check', '.pill-btn-nav',
    '.subject-pill', '.delete-btn', '.trash-btn', '.remove-btn',
    '.back-btn', '.drawer-close', '#hamburger'
  ].join(', ');

  function attachRippleAndSound() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest(INTERACTIVE_SEL);
      if (!btn || btn.disabled || btn.getAttribute('aria-disabled') === 'true') return;
      if (btn.dataset.spNoFx === '1') return;

      // ripple
      const rect = btn.getBoundingClientRect();
      const r = document.createElement('span');
      r.className = 'sp-ripple';
      const size = Math.max(rect.width, rect.height);
      r.style.width = r.style.height = size + 'px';
      r.style.left = (e.clientX - rect.left - size / 2) + 'px';
      r.style.top  = (e.clientY - rect.top  - size / 2) + 'px';
      const prevPos = getComputedStyle(btn).position;
      if (prevPos === 'static') btn.style.position = 'relative';
      const prevOverflow = btn.style.overflow;
      btn.style.overflow = 'hidden';
      btn.appendChild(r);
      setTimeout(() => { r.remove(); btn.style.overflow = prevOverflow; }, 620);

      // context-aware sound + haptic
      sfx(soundForElement(btn));
      vibrate(8);
    }, true);

    // Press-down scale effect (CSS-driven via .sp-pressed)
    document.addEventListener('pointerdown', (e) => {
      const t = e.target.closest(INTERACTIVE_SEL);
      if (!t || t.disabled) return;
      t.classList.add('sp-pressed');
      const off = () => {
        t.classList.remove('sp-pressed');
        document.removeEventListener('pointerup', off);
        document.removeEventListener('pointercancel', off);
      };
      document.addEventListener('pointerup', off);
      document.addEventListener('pointercancel', off);
    }, true);

    // Checkbox semantic sounds — distinct pop/uncheck
    document.addEventListener('change', (e) => {
      const cb = e.target;
      if (cb && cb.type === 'checkbox' && !cb.classList.contains('toggle')) {
        sfx(cb.checked ? 'pop' : 'uncheck');
        if (cb.checked) {
          // Small celebratory sparkle on the checkbox itself
          sparkle(cb, { count: 5, radius: 22 });
        }
      }
    }, true);
  }

  return {
    toast, coinFloat, pulseCoinBadge, confetti,
    attachRippleAndSound, vibrate,
    sfx, clickSound, shake, denied, sparkle
  };
})();

// ── Init on every page ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  refreshCoinBadge();
  initDrawer();
  SPFeedback.attachRippleAndSound();
});
