// Pure, deterministic insight helpers for the Stats tab ("The Quiet Almanac").
//
// Everything here is timezone-correct by reading the BROWSER's local time:
// `new Date(created_at)` parses the stored UTC ISO string, and `.getHours()` /
// `.getFullYear()` etc. return values in the viewer's local zone. No server
// timezone is needed. These functions take a `now: Date` so callers (and tests)
// control the reference point; they never read the clock themselves.
//
// All copy strings produced here follow the project's voice rules: warm, plain,
// "quiet pride". No dashes of any kind as punctuation, no semicolons.

export type InsightSession = {
  id: string;
  minutes: number;
  mode: string;
  studied_on: string;
  created_at: string;
  topic_name: string | null;
  focus_score: number | null;
};

// ── Local-date helpers ──────────────────────────────────────────────────────

/** Local-calendar ISO day (YYYY-MM-DD) of a Date, in the viewer's zone. */
function localIso(dt: Date): string {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Midnight (local) of the given Date, as a fresh Date. */
function startOfLocalDay(dt: Date): Date {
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
}

/** Local ISO day N days before the given local day. */
function isoDaysAgo(now: Date, n: number): string {
  const base = startOfLocalDay(now);
  base.setDate(base.getDate() - n);
  return localIso(base);
}

function isFocus(s: InsightSession): boolean {
  return s.mode === "focus" && s.minutes > 0;
}

// ── 1. Hour-of-day histogram ────────────────────────────────────────────────
// Eight 2-hour buckets spanning 6a–10p. Focus minutes only, bucketed by the
// LOCAL hour of created_at. Hours before 6a fold into the first bucket, hours
// at/after 10p fold into the last, so nothing is silently dropped.

export type HourBucket = { label: string; minutes: number };

const HOUR_BUCKET_STARTS = [6, 8, 10, 12, 14, 16, 18, 20] as const;
const HOUR_BUCKET_LABELS = ["6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p"] as const;

export function hourBucketHistogram(sessions: InsightSession[]): HourBucket[] {
  const buckets: HourBucket[] = HOUR_BUCKET_LABELS.map((label) => ({ label, minutes: 0 }));
  for (const s of sessions) {
    if (s.mode !== "focus") continue;
    if (s.minutes <= 0) continue;
    const hour = new Date(s.created_at).getHours();
    let idx = 0;
    if (hour < HOUR_BUCKET_STARTS[0]) {
      idx = 0;
    } else if (hour >= HOUR_BUCKET_STARTS[HOUR_BUCKET_STARTS.length - 1] + 2) {
      idx = buckets.length - 1;
    } else {
      idx = Math.min(buckets.length - 1, Math.floor((hour - HOUR_BUCKET_STARTS[0]) / 2));
    }
    buckets[idx].minutes += s.minutes;
  }
  return buckets;
}

/** Index of the peak bucket, or -1 if every bucket is empty. */
export function peakHourIndex(hist: HourBucket[]): number {
  let idx = -1;
  let max = 0;
  for (let i = 0; i < hist.length; i++) {
    if (hist[i].minutes > max) {
      max = hist[i].minutes;
      idx = i;
    }
  }
  return idx;
}

// ── 2. The study meadow day grid ────────────────────────────────────────────
// Per-day focus minutes for the last `weeks*7` days ending today (local). Each
// day carries a 0–4 level: 0 = no focus, 1–4 bucketed by minutes against fixed
// thresholds tuned for a study app (a real day is tens of minutes, a deep day a
// couple of hours).

export type DayCell = { date: string; minutes: number; level: 0 | 1 | 2 | 3 | 4 };

function levelForMinutes(minutes: number): 0 | 1 | 2 | 3 | 4 {
  if (minutes <= 0) return 0;
  if (minutes < 30) return 1;
  if (minutes < 60) return 2;
  if (minutes < 120) return 3;
  return 4;
}

export function buildDayGrid(sessions: InsightSession[], now: Date, weeks = 10): DayCell[] {
  const days = weeks * 7;
  // Sum focus minutes per local day in one pass.
  const byDay = new Map<string, number>();
  for (const s of sessions) {
    if (!isFocus(s)) continue;
    const iso = localIso(new Date(s.created_at));
    byDay.set(iso, (byDay.get(iso) || 0) + s.minutes);
  }
  const grid: DayCell[] = [];
  // Oldest first, ending today as the last cell.
  for (let i = days - 1; i >= 0; i--) {
    const iso = isoDaysAgo(now, i);
    const minutes = byDay.get(iso) || 0;
    grid.push({ date: iso, minutes, level: levelForMinutes(minutes) });
  }
  return grid;
}

// ── 3. Streaks ───────────────────────────────────────────────────────────────
// A "focus day" is any local day with focus minutes > 0. Streaks count runs of
// consecutive focus days.

/** Set of local ISO days that have any focus minutes. */
function focusDaySet(sessions: InsightSession[]): Set<string> {
  const set = new Set<string>();
  for (const s of sessions) {
    if (!isFocus(s)) continue;
    set.add(localIso(new Date(s.created_at)));
  }
  return set;
}

/** Longest unbounded run of consecutive focus days anywhere in the data. */
export function longestStreak(sessions: InsightSession[], now: Date): number {
  const set = focusDaySet(sessions);
  if (set.size === 0) return 0;
  let best = 0;
  // For each focus day, only start counting if the previous day is NOT a focus
  // day (i.e. this is a run start). Keeps it O(n) over distinct days.
  for (const iso of set) {
    const prev = previousIso(iso);
    if (set.has(prev)) continue; // not a run start
    let len = 0;
    let cur = iso;
    while (set.has(cur)) {
      len++;
      cur = nextIso(cur);
    }
    if (len > best) best = len;
  }
  return best;
}

/** Current consecutive-day run ending today or yesterday. */
export function currentStreak(sessions: InsightSession[], now: Date): number {
  const set = focusDaySet(sessions);
  if (set.size === 0) return 0;
  const todayIso = isoDaysAgo(now, 0);
  const yesterdayIso = isoDaysAgo(now, 1);
  // The run is "alive" only if today or yesterday was a focus day.
  let cursor: string;
  if (set.has(todayIso)) cursor = todayIso;
  else if (set.has(yesterdayIso)) cursor = yesterdayIso;
  else return 0;
  let len = 0;
  while (set.has(cursor)) {
    len++;
    cursor = previousIso(cursor);
  }
  return len;
}

function previousIso(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - 1);
  return localIso(dt);
}
function nextIso(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + 1);
  return localIso(dt);
}

// ── 4. Session-length distribution ────────────────────────────────────────────

export type LengthBucket = { label: string; count: number };

export function sessionLengthBuckets(sessions: InsightSession[]): LengthBucket[] {
  // Labels avoid dashes per the project copy rules (no em / en / hyphen-as-dash
  // in user-visible strings), so ranges read as "15 to 25".
  const buckets: LengthBucket[] = [
    { label: "under 15", count: 0 },
    { label: "15 to 25", count: 0 },
    { label: "25 to 45", count: 0 },
    { label: "45 to 60", count: 0 },
    { label: "60+", count: 0 }
  ];
  for (const s of sessions) {
    if (!isFocus(s)) continue;
    const m = s.minutes;
    let idx: number;
    if (m < 15) idx = 0;
    else if (m < 25) idx = 1;
    else if (m < 45) idx = 2;
    else if (m < 60) idx = 3;
    else idx = 4;
    buckets[idx].count++;
  }
  return buckets;
}

// ── 4b. Weekday rhythm ────────────────────────────────────────────────────────
// Focus minutes summed by the LOCAL weekday of created_at, returned Mon..Sun so
// the chart reads in week order. Non-focus and zero-minute sessions are skipped.

export type WeekdayTotal = { label: string; minutes: number };

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export function weekdayTotals(sessions: InsightSession[]): WeekdayTotal[] {
  const totals: WeekdayTotal[] = WEEKDAY_LABELS.map((label) => ({ label, minutes: 0 }));
  for (const s of sessions) {
    if (!isFocus(s)) continue;
    // getDay() is Sun=0..Sat=6 in local time. Shift so Mon=0..Sun=6.
    const idx = (new Date(s.created_at).getDay() + 6) % 7;
    totals[idx].minutes += s.minutes;
  }
  return totals;
}

// ── 4c. Quiet records ─────────────────────────────────────────────────────────
// A small set of keepsake numbers drawn straight from the real data. No
// fabricated milestones: every value is the literal best the user has logged in
// the supplied window. bestWeekMinutes is the heaviest rolling 7-day span (any
// 7 consecutive local days), so it rewards a genuine concentrated stretch.

export type PersonalRecords = {
  longestSessionMin: number;
  bestDay: { date: string; minutes: number };
  bestWeekMinutes: number;
  totalHours: number;
  totalSessions: number;
};

export function personalRecords(sessions: InsightSession[]): PersonalRecords {
  let longestSessionMin = 0;
  let totalMinutes = 0;
  let totalSessions = 0;
  const byDay = new Map<string, number>();

  for (const s of sessions) {
    if (!isFocus(s)) continue;
    totalSessions++;
    totalMinutes += s.minutes;
    if (s.minutes > longestSessionMin) longestSessionMin = s.minutes;
    const iso = localIso(new Date(s.created_at));
    byDay.set(iso, (byDay.get(iso) || 0) + s.minutes);
  }

  if (totalSessions === 0) {
    return {
      longestSessionMin: 0,
      bestDay: { date: "", minutes: 0 },
      bestWeekMinutes: 0,
      totalHours: 0,
      totalSessions: 0
    };
  }

  // Best single day.
  let bestDay = { date: "", minutes: 0 };
  for (const [date, minutes] of byDay) {
    if (minutes > bestDay.minutes) bestDay = { date, minutes };
  }

  // Best rolling 7-day window. Anchor a window on every active day and sum the
  // active days that fall inside [anchor, anchor+6]. O(activeDays^2), and active
  // days are few, so this stays cheap.
  const active = Array.from(byDay.entries());
  let bestWeekMinutes = 0;
  for (const [anchor] of active) {
    const windowEnd = addDaysIso(anchor, 6);
    let sum = 0;
    for (const [date, minutes] of active) {
      if (date >= anchor && date <= windowEnd) sum += minutes;
    }
    if (sum > bestWeekMinutes) bestWeekMinutes = sum;
  }

  return {
    longestSessionMin,
    bestDay,
    bestWeekMinutes,
    totalHours: Math.round(totalMinutes / 60),
    totalSessions
  };
}

function addDaysIso(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return localIso(dt);
}

// ── 5. Days hit goal ──────────────────────────────────────────────────────────
// Count distinct local days in the trailing window whose total focus minutes met
// the daily goal. A zero / missing goal is treated as never hittable (no false
// celebration), while still reporting the window size.

export function daysHitGoal(
  sessions: InsightSession[],
  dailyGoalMinutes: number,
  now: Date,
  windowDays = 30
): { hit: number; of: number } {
  if (!dailyGoalMinutes || dailyGoalMinutes <= 0) {
    return { hit: 0, of: windowDays };
  }
  const earliest = isoDaysAgo(now, windowDays - 1);
  const todayIso = isoDaysAgo(now, 0);
  const byDay = new Map<string, number>();
  for (const s of sessions) {
    if (!isFocus(s)) continue;
    const iso = localIso(new Date(s.created_at));
    if (iso < earliest || iso > todayIso) continue;
    byDay.set(iso, (byDay.get(iso) || 0) + s.minutes);
  }
  let hit = 0;
  for (const mins of byDay.values()) {
    if (mins >= dailyGoalMinutes) hit++;
  }
  return { hit, of: windowDays };
}

// ── 6. Week over week ─────────────────────────────────────────────────────────
// This week = the 7 local days ending today (inclusive). Last week = the 7 days
// before that. Focus minutes only.

export function weekOverWeek(
  sessions: InsightSession[],
  now: Date
): { thisWeek: number; lastWeek: number; deltaMin: number } {
  const thisWeekStart = isoDaysAgo(now, 6);
  const todayIso = isoDaysAgo(now, 0);
  const lastWeekStart = isoDaysAgo(now, 13);
  const lastWeekEnd = isoDaysAgo(now, 7);

  let thisWeek = 0;
  let lastWeek = 0;
  for (const s of sessions) {
    if (!isFocus(s)) continue;
    const iso = localIso(new Date(s.created_at));
    if (iso >= thisWeekStart && iso <= todayIso) thisWeek += s.minutes;
    else if (iso >= lastWeekStart && iso <= lastWeekEnd) lastWeek += s.minutes;
  }
  return { thisWeek, lastWeek, deltaMin: thisWeek - lastWeek };
}

// ── 7. Hero insight cascade ───────────────────────────────────────────────────
// Picks the single strongest CONFIDENT signal for the parchment hero line, with
// a guaranteed thin-signal fallback for new users. Gating is strict: a peak hour
// is never stated as fact unless it has a clear lead AND there are enough
// sessions behind it. No overclaiming.

export type HeroInput = {
  hourHistogram: HourBucket[];
  currentStreak: number;
  activeDays: number;
  windowDays: number;
  topTopic: { name: string; minutes: number } | null;
  totalMinutes: number;
  sessionCount: number;
};

export type HeroInsight = { text: string; subline: string };

// Thresholds for confidence. Tuned so a peak-hour claim needs both volume and a
// genuine lead, not a one-session fluke.
const MIN_SESSIONS_FOR_RHYTHM = 12;
const PEAK_LEAD_RATIO = 1.4; // peak must beat the runner-up bucket by 40%+

/** Compact "11h 20m" / "45m" formatting. */
function fmtDuration(min: number): string {
  if (min <= 0) return "0m";
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/** A warm, plain phrase for a 2-hour bucket's window, e.g. "between 10 and noon". */
function bucketWindowPhrase(idx: number): string {
  const phrases = [
    "in the early hours before 8",
    "between 8 and 10 in the morning",
    "between 10 and noon",
    "in the early afternoon",
    "in the middle of the afternoon",
    "in the late afternoon",
    "in the early evening",
    "later in the evening"
  ];
  return phrases[idx] ?? "during your peak window";
}

function bucketDaypartWord(idx: number): string {
  if (idx <= 2) return "Mornings";
  if (idx <= 4) return "Afternoons";
  return "Evenings";
}

export function pickHeroInsight(input: HeroInput): HeroInsight {
  const { hourHistogram, currentStreak, activeDays, windowDays, topTopic, totalMinutes, sessionCount } = input;

  const subline =
    sessionCount > 0
      ? `${fmtDuration(totalMinutes)} across ${sessionCount} focus ${sessionCount === 1 ? "session" : "sessions"} over the past few weeks.`
      : "Your almanac fills in as you study. Start a focus session and watch it grow.";

  // Thin-signal fallback for brand-new users. Anything below a handful of
  // sessions does not earn a confident claim.
  if (sessionCount < 4 || totalMinutes <= 0) {
    return {
      text: "A quiet start. A few sessions in, and the shape of your weeks is just beginning to show.",
      subline
    };
  }

  // ── Tier 1: peak-hour rhythm (the strongest, most personal signal) ──────────
  const peakIdx = peakHourIndex(hourHistogram);
  if (peakIdx >= 0 && sessionCount >= MIN_SESSIONS_FOR_RHYTHM) {
    const peak = hourHistogram[peakIdx].minutes;
    const runnerUp = Math.max(
      0,
      ...hourHistogram.filter((_, i) => i !== peakIdx).map((b) => b.minutes)
    );
    const hasClearLead = peak > 0 && (runnerUp === 0 || peak >= runnerUp * PEAK_LEAD_RATIO);
    if (hasClearLead) {
      const daypart = bucketDaypartWord(peakIdx);
      return {
        text: `${daypart} are yours. Your best thinking lands ${bucketWindowPhrase(peakIdx)}, and you have shown up ${activeDays} of the last ${windowDays} days.`,
        subline
      };
    }
  }

  // ── Tier 2: a steady topic anchor ───────────────────────────────────────────
  if (topTopic && topTopic.minutes > 0 && sessionCount >= 8) {
    return {
      text: `${topTopic.name} is your calm anchor. It has held more of your focus than anything else lately, across ${activeDays} of the last ${windowDays} days.`,
      subline
    };
  }

  // ── Tier 3: showing up (consistency, when patterns are flatter) ─────────────
  if (activeDays >= 3) {
    return {
      text: `You keep showing up. ${activeDays} of the last ${windowDays} days, you sat down to study, and it adds up quietly.`,
      subline
    };
  }

  // ── Tier 4: a live streak worth naming ──────────────────────────────────────
  if (currentStreak >= 2) {
    return {
      text: `A real rhythm is forming. You are ${currentStreak} days into a steady stretch.`,
      subline
    };
  }

  // ── Guaranteed fallback ──────────────────────────────────────────────────────
  return {
    text: "A quiet start. A few sessions in, and the shape of your weeks is just beginning to show.",
    subline
  };
}
