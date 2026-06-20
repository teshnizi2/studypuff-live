"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  hourBucketHistogram,
  buildDayGrid,
  longestStreak,
  currentStreak,
  daysHitGoal,
  weekOverWeek,
  peakHourIndex,
  pickHeroInsight,
  sessionLengthBuckets,
  weekdayTotals,
  personalRecords,
  type InsightSession,
  type DayCell,
  type LengthBucket,
  type WeekdayTotal,
  type PersonalRecords
} from "@/lib/app-data/stats-insights";

export type StatsSession = {
  id: string;
  minutes: number;
  mode: string;
  studied_on: string;
  created_at: string;
  topic_name: string | null;
  task_name: string | null;
  focus_score: number | null;
};

export type StatsContentProps = {
  todayMinutes: number;
  weekMinutes: number;
  streak: number;
  lifetimeMinutes: number;
  dailyGoal: number;
  goalPct: number;
  last7: { date: string; minutes: number }[];
  topTopics: [string, number][];
  recent: StatsSession[];
  todayIso: string;
  /** Full ~70-day window of sessions. The Almanac sections are computed from
   *  this client-side using the browser's local time, so the user's timezone
   *  is always correct without a server tz. */
  sessions: InsightSession[];
  /** "panel" is the compact modal glance (default). "full" is the standalone
   *  stats route: same almanac spine plus deeper sections and a longer meadow. */
  variant?: "panel" | "full";
  onCloseHref?: () => void;
};

// ── Local helpers (display only) ──────────────────────────────────────────────

/** Compact "11h 20m" / "45m" formatting. */
function fmt(min: number) {
  if (min <= 0) return "0m";
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/** Weekday short name from a local ISO day. */
function weekdayShort(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: "short" });
}

/** "Tue Jun 3" style label from a local ISO day. */
function dayTooltip(iso: string, minutes: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const label = new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
  return `${label} · ${minutes} min`;
}

// Four-step green ramp for the meadow (level 1..4). Level 0 is a faint rest
// tint with a hairline border so empty days are visible, not invisible.
const MEADOW_RAMP: Record<number, string> = {
  0: "#ede9df",
  1: "#c7e2c7",
  2: "#7fb069",
  3: "#3a8a4c",
  4: "#1f4d2c"
};

const DEEP_MOSS = "#1f4d2c";

const TOPIC_COLORS = [
  "#1f4d2c", // deep moss
  "#3a8a4c", // emerald
  "#7fb069", // sage
  "#d4a574", // ochre
  "#c97f5e" // terracotta
];

export function StatsContent(p: StatsContentProps) {
  const variant = p.variant ?? "panel";
  const isFull = variant === "full";
  // The browser owns "now", so local-day math (meadow, hour buckets, streaks)
  // lands in the viewer's timezone. useMemo keeps a single now across all the
  // derived series for one render.
  const now = useMemo(() => new Date(), []);
  // Stabilise the array reference so the insight useMemo below only recomputes
  // when the underlying sessions prop actually changes.
  const sessions = useMemo(() => p.sessions ?? [], [p.sessions]);

  const insights = useMemo(() => {
    const hist = hourBucketHistogram(sessions);
    // The full page shows a longer meadow (16 weeks of history). Older empty
    // weeks are honest, not hidden.
    const grid = buildDayGrid(sessions, now, isFull ? 16 : 10);
    const activeDays = grid.filter((d) => d.minutes > 0).length;
    const windowDays = grid.length;
    const totalWindowMinutes = grid.reduce((a, d) => a + d.minutes, 0);
    const focusSessionCount = sessions.filter((s) => s.mode === "focus" && s.minutes > 0).length;
    const longest = longestStreak(sessions, now);
    const live = currentStreak(sessions, now);
    const wow = weekOverWeek(sessions, now);
    const goal = daysHitGoal(sessions, p.dailyGoal, now, 30);
    const peakIdx = peakHourIndex(hist);
    const topTopic =
      p.topTopics.length > 0 ? { name: p.topTopics[0][0], minutes: p.topTopics[0][1] } : null;
    const hero = pickHeroInsight({
      hourHistogram: hist,
      currentStreak: live,
      activeDays,
      windowDays,
      topTopic,
      totalMinutes: totalWindowMinutes,
      sessionCount: focusSessionCount
    });
    // Deep-section series. Cheap to compute, so we build them unconditionally and
    // let the full variant decide whether to render them.
    const lengths = sessionLengthBuckets(sessions);
    const weekdays = weekdayTotals(sessions);
    const records = personalRecords(sessions);
    return {
      hist,
      grid,
      activeDays,
      windowDays,
      totalWindowMinutes,
      focusSessionCount,
      longest,
      live,
      wow,
      goal,
      peakIdx,
      hero,
      lengths,
      weekdays,
      records
    };
  }, [sessions, now, p.dailyGoal, p.topTopics, isFull]);

  const {
    hist,
    grid,
    activeDays,
    windowDays,
    focusSessionCount,
    longest,
    live,
    wow,
    goal,
    peakIdx,
    hero,
    lengths,
    weekdays,
    records
  } = insights;

  // Gate the focus-hour chip / claim behind enough sessions and a real peak.
  const focusHourConfident = focusSessionCount >= 12 && peakIdx >= 0;
  const focusHourLabel = peakIdx >= 0 ? hist[peakIdx].label : null;

  const steadiestTopic = p.topTopics[0]?.[0] ?? null;

  // The almanac spine (hero, chips, hour strip, meadow, streak + tiles) is shared
  // by both variants verbatim. We build it once here and place it inside each
  // variant's own outer frame below.
  const spine = (
    <>
      {/* 1 ─ Almanac hero ─────────────────────────────────────────────────── */}
      <AlmanacHero hero={hero} highlightPeak={focusHourConfident ? focusHourLabel : null} />

      {/* 2 ─ Three insight chips ──────────────────────────────────────────── */}
      <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <InsightChip
          tone="from-[#d8eccb] to-[#bcdebf]"
          label="Focus hour"
          value={focusHourConfident && focusHourLabel ? focusHourLabel : "Still listening"}
          note={
            focusHourConfident && focusHourLabel
              ? "your steadiest stretch"
              : "a few more sessions and a pattern shows"
          }
        />
        <InsightChip
          tone="from-[#d6e7f1] to-[#c0dae9]"
          label="Steadiest topic"
          value={steadiestTopic ?? "Open"}
          note={steadiestTopic ? "your calm anchor" : "pick a topic to see it grow"}
        />
        <InsightChip
          tone="from-[#fbeeb8] to-[#f2db8e]"
          label="Showing up"
          value={`${activeDays} of ${windowDays}`}
          note={activeDays >= windowDays / 2 ? "a real rhythm" : "days you sat down"}
        />
      </section>

      {/* 3 ─ When you focus (hour-of-day strip) ───────────────────────────── */}
      <WhenYouFocus hist={hist} peakIdx={peakIdx} confident={focusHourConfident} />

      {/* 4 ─ The study meadow ─────────────────────────────────────────────── */}
      <StudyMeadow grid={grid} todayIso={p.todayIso} activeDays={activeDays} windowDays={windowDays} />

      {/* 5 + 6 ─ Streak ring + consistency tiles ──────────────────────────── */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,260px)_1fr]">
        <StreakRing live={live} longest={longest} studiedToday={p.todayMinutes > 0} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ConsistencyTile
            tone="from-[#d8eccb] to-[#bcdebf]"
            label="Days hit goal"
            value={`${goal.hit} of ${goal.of}`}
            note={
              p.dailyGoal > 0
                ? goal.hit > goal.of / 2
                  ? "you met your own goal more often than not"
                  : "every day you reach it counts"
                : "set a daily goal in settings to track this"
            }
          />
          <ConsistencyTile
            tone="from-[#e7def2] to-[#d4c6ec]"
            label="This week"
            value={wow.deltaMin >= 0 ? `+${wow.deltaMin} min` : `${fmt(wow.thisWeek)}`}
            note={
              wow.deltaMin >= 0
                ? `${wow.thisWeek} this week, ${wow.lastWeek} last`
                : "a lighter week than last, and that is alright"
            }
          />
        </div>
      </div>
    </>
  );

  const evidence = (
    <Evidence
      topTopics={p.topTopics}
      recent={p.recent}
      todayMinutes={p.todayMinutes}
      weekMinutes={p.weekMinutes}
      lifetimeMinutes={p.lifetimeMinutes}
      dailyGoal={p.dailyGoal}
      goalPct={p.goalPct}
      recentLimit={isFull ? 16 : 8}
      showTopicsDonut={!isFull}
    />
  );

  // ── Panel variant (compact modal glance) ─ unchanged layout, edge to edge of
  // its constrained modal. The full variant gets its own capped, columned frame
  // below so its short charts never strand across a wide desktop.
  if (!isFull) {
    return (
      <div className="text-ink-900">
        {spine}
        {evidence}
        <p className="mt-5 text-xs text-ink-700/80">
          Want the bigger view.{" "}
          <Link href="/dashboard/stats" className="underline underline-offset-4">
            Open the full stats page
          </Link>
          .
        </p>
      </div>
    );
  }

  // ── Full variant (standalone /dashboard/stats route) ──────────────────────
  // Capped to a centered ~1080px column so wide desktops don't stretch the small
  // charts. Inside it, sections size to their content: the hero, hour strip,
  // meadow and streak row stay full-column (they genuinely use the room), while
  // the two short bar charts (which days you show up, how your sessions run) sit
  // two-up so each bar lives in a sensible half-width track instead of spanning
  // the page. Quiet records stay a compact card row. The topic breakdown and the
  // recent list (potentially long) read full-column top to bottom.
  return (
    <div className="mx-auto w-full max-w-[1080px] text-ink-900">
      {spine}

      {/* Two-up: the two worst stretch offenders. Each short bar chart now lives
          in a half-width column on desktop and stacks on narrow screens. */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <WeekdayRhythm weekdays={weekdays} />
        <SessionLengths lengths={lengths} records={records} />
      </div>

      {/* Quiet records: a compact row of small cards, never stretched. */}
      <QuietRecords records={records} />

      {/* Full topic breakdown: full-column, the list can run long. */}
      <EverythingYouStudied topics={p.topTopics} />

      {evidence}
    </div>
  );
}

// ── Section 1: Almanac hero ───────────────────────────────────────────────────

function AlmanacHero({
  hero,
  highlightPeak
}: {
  hero: { text: string; subline: string };
  highlightPeak: string | null;
}) {
  // Decoratively wrap one or two phrases in a soft pastel highlight. We only
  // highlight when we can do it cleanly (substring present), so the text stays
  // exactly as the gated copy produced it.
  const rendered = useMemo(() => decorateHero(hero.text), [hero.text]);

  return (
    <section className="rounded-3xl border border-ink-900/10 bg-[#f8f3ea] p-6 shadow-soft sm:p-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-700/55">
        The quiet almanac
      </p>
      <p className="mt-3 font-display text-2xl italic leading-snug text-ink-900 sm:text-[28px]">
        {rendered}
      </p>
      <p className="mt-3 text-sm text-ink-700/85">{hero.subline}</p>
    </section>
  );
}

// Highlight a couple of meaningful phrases with a soft, decorative pastel
// background. Purely visual — the SR experience reads the plain sentence.
const HERO_HIGHLIGHTS: { match: RegExp; tone: string }[] = [
  { match: /\b(Mornings|Afternoons|Evenings) are yours\b/, tone: "bg-[#c7e2c7]" },
  { match: /\bbest thinking\b/, tone: "bg-[#fbe9a5]" },
  { match: /\bcalm anchor\b/, tone: "bg-[#c6dceb]" },
  { match: /\bkeep showing up\b/, tone: "bg-[#c7e2c7]" },
  { match: /\breal rhythm\b/, tone: "bg-[#fbe9a5]" },
  { match: /\bquiet start\b/, tone: "bg-[#d9cdea]" }
];

function decorateHero(text: string): React.ReactNode {
  // Find at most two non-overlapping highlight spans, then splice in styled
  // <mark>s. If nothing matches, return the plain string.
  type Span = { start: number; end: number; tone: string };
  const spans: Span[] = [];
  for (const h of HERO_HIGHLIGHTS) {
    if (spans.length >= 2) break;
    const m = h.match.exec(text);
    if (!m || m.index === undefined) continue;
    const start = m.index;
    const end = start + m[0].length;
    if (spans.some((s) => start < s.end && end > s.start)) continue; // overlap
    spans.push({ start, end, tone: h.tone });
  }
  if (spans.length === 0) return text;
  spans.sort((a, b) => a.start - b.start);

  const out: React.ReactNode[] = [];
  let cursor = 0;
  spans.forEach((s, i) => {
    if (s.start > cursor) out.push(text.slice(cursor, s.start));
    out.push(
      <mark
        key={i}
        className={`rounded-md ${s.tone} px-1.5 py-0.5 text-ink-900 not-italic`}
        style={{ boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}
      >
        {text.slice(s.start, s.end)}
      </mark>
    );
    cursor = s.end;
  });
  if (cursor < text.length) out.push(text.slice(cursor));
  return out;
}

// ── Section 2: insight chip ───────────────────────────────────────────────────

function InsightChip({
  tone,
  label,
  value,
  note
}: {
  tone: string;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-white/60 bg-gradient-to-br ${tone} p-4 shadow-[0_12px_30px_-20px_rgba(31,77,44,0.5),inset_0_1px_0_rgba(255,255,255,0.5)]`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-700/80">{label}</p>
      <p className="mt-1.5 truncate font-display text-2xl leading-none text-ink-900">{value}</p>
      <p className="mt-1.5 font-display text-xs italic text-ink-700/85">{note}</p>
    </div>
  );
}

// ── Section 3: when you focus ─────────────────────────────────────────────────

function WhenYouFocus({
  hist,
  peakIdx,
  confident
}: {
  hist: { label: string; minutes: number }[];
  peakIdx: number;
  confident: boolean;
}) {
  const max = Math.max(1, ...hist.map((b) => b.minutes));
  const hasAny = hist.some((b) => b.minutes > 0);

  // Caption: only make a confident "twice the minutes" style claim when the
  // peak genuinely leads. Otherwise stay gentle.
  const caption = useMemo(() => {
    if (!hasAny) return "Your hours will fill in here as you study. No pattern yet, and that is fine.";
    if (!confident || peakIdx < 0) return "Your hours are spread fairly evenly so far. A clearer pattern takes a little time.";
    const peak = hist[peakIdx].minutes;
    const runnerUp = Math.max(0, ...hist.filter((_, i) => i !== peakIdx).map((b) => b.minutes));
    const word = peakIdx <= 2 ? "Mornings" : peakIdx <= 4 ? "Afternoons" : "Evenings";
    if (runnerUp > 0 && peak >= runnerUp * 1.8) {
      return `${word} carry you. Your ${hist[peakIdx].label} stretch holds nearly twice the minutes of anything else.`;
    }
    return `${word} carry you. Your ${hist[peakIdx].label} stretch is where the most minutes land.`;
  }, [hist, peakIdx, confident, hasAny]);

  const srSummary =
    "Focus minutes by time of day. " +
    hist.map((b) => `${b.label}, ${b.minutes} minutes`).join(". ") +
    ".";

  return (
    <section className="mt-5 rounded-3xl border border-ink-900/10 bg-cream-50 p-5 shadow-soft">
      <h3 className="font-display text-xl text-ink-900">When you focus</h3>
      <div className="mt-5 grid grid-cols-8 items-end gap-2" style={{ height: 120 }} aria-hidden>
        {hist.map((b, i) => {
          const h = b.minutes === 0 ? 4 : Math.max(8, Math.round((b.minutes / max) * 96));
          const isPeak = confident && i === peakIdx && b.minutes > 0;
          return (
            <div key={b.label} className="flex h-full flex-col items-center justify-end gap-1.5">
              <span className="text-[10px] tabular-nums text-ink-700/70">{b.minutes || ""}</span>
              <div
                className="w-full rounded-lg transition-[height] duration-500 motion-reduce:transition-none"
                style={{
                  height: `${h}px`,
                  background: isPeak ? DEEP_MOSS : b.minutes > 0 ? "rgba(31,77,44,0.18)" : "rgba(31,31,31,0.06)"
                }}
              />
              <span className={`text-[10px] ${isPeak ? "font-semibold text-ink-900" : "text-ink-700/70"}`}>
                {b.label}
              </span>
            </div>
          );
        })}
      </div>
      <p className="sr-only">{srSummary}</p>
      <p className="mt-4 font-display text-sm italic text-ink-700/85">{caption}</p>
    </section>
  );
}

// ── Section 4: the study meadow ───────────────────────────────────────────────

function StudyMeadow({
  grid,
  todayIso,
  activeDays,
  windowDays
}: {
  grid: DayCell[];
  todayIso: string;
  activeDays: number;
  windowDays: number;
}) {
  // Arrange into Mon..Sun rows x week columns. We pad the front so the first
  // column starts on a Monday, and pad the tail so the next un-studied future
  // cell can wear a dashed outline.
  const { columns, todayKey, nextFutureKey } = useMemo(() => layoutMeadow(grid, todayIso), [grid, todayIso]);

  const rowLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <section className="mt-5 rounded-3xl border border-ink-900/10 bg-cream-50 p-5 shadow-soft">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-xl text-ink-900">When you showed up</h3>
        <span className="text-xs text-ink-700/70">last {windowDays} days</span>
      </div>

      {/* The meadow. On narrow screens it scrolls horizontally rather than
          cramming. Each cell is keyboard reachable with a title tooltip. */}
      <div className="mt-4 overflow-x-auto pb-1">
        <div className="flex gap-1.5" role="group" aria-label="Study meadow, focus minutes per day">
          {/* Row labels column */}
          <div className="mr-1 flex flex-col gap-[5px] pt-[2px]">
            {rowLabels.map((r, i) => (
              <span
                key={r}
                className="h-[14px] text-[9px] leading-[14px] text-ink-700/55"
                // Show every other label to keep it quiet.
                style={{ visibility: i % 2 === 0 ? "visible" : "hidden" }}
              >
                {r}
              </span>
            ))}
          </div>
          {/* Week columns */}
          {columns.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-[5px]">
              {col.map((cell, ri) => {
                if (!cell) {
                  return <span key={ri} className="h-[14px] w-[14px]" aria-hidden />;
                }
                const isToday = cell.date === todayKey;
                const isNextFuture = cell.date === nextFutureKey;
                return (
                  <span
                    key={ri}
                    tabIndex={0}
                    title={dayTooltip(cell.date, cell.minutes)}
                    aria-label={dayTooltip(cell.date, cell.minutes)}
                    className="h-[14px] w-[14px] rounded-[4px] outline-none transition-transform duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900 motion-reduce:transition-none can-hover:hover:scale-110"
                    style={{
                      background: MEADOW_RAMP[cell.level],
                      // Level 0 needs a hairline so empty is visible, not absent.
                      // Today gets a 2px ink outline; the next future day a dash.
                      border: isToday
                        ? `2px solid ${"#1f1f1f"}`
                        : isNextFuture
                          ? "1.5px dashed rgba(31,31,31,0.35)"
                          : cell.level === 0
                            ? "1px solid rgba(31,31,31,0.10)"
                            : "1px solid rgba(31,77,44,0.10)"
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend + footer line */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-ink-700/60">
          <span>Rest</span>
          <span className="flex items-center gap-1" aria-hidden>
            {[0, 1, 2, 3, 4].map((l) => (
              <span
                key={l}
                className="h-[12px] w-[12px] rounded-[3px]"
                style={{
                  background: MEADOW_RAMP[l],
                  border: l === 0 ? "1px solid rgba(31,31,31,0.10)" : "1px solid rgba(31,77,44,0.10)"
                }}
              />
            ))}
          </span>
          <span>Deep focus</span>
        </div>
      </div>
      <p className="mt-3 font-display text-sm italic text-ink-700/85">
        {activeDays} of the last {windowDays} days, you sat down. Quietly, that is a lot.
      </p>
      <p className="sr-only">
        Study meadow. You studied on {activeDays} of the last {windowDays} days. Each cell is one
        day, shaded deeper green for more focus minutes.
      </p>
    </section>
  );
}

// Lay the grid (oldest first, ending today) into Monday-start week columns.
function layoutMeadow(
  grid: DayCell[],
  todayIso: string
): { columns: (DayCell | null)[][]; todayKey: string; nextFutureKey: string | null } {
  if (grid.length === 0) return { columns: [], todayKey: todayIso, nextFutureKey: null };

  // Monday = 0 .. Sunday = 6 for a given iso.
  const dow = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return (new Date(y, m - 1, d).getDay() + 6) % 7;
  };
  const nextIso = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() + 1);
    const yy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${yy}-${mm}-${dd}`;
  };

  const cells: (DayCell | null)[] = [];
  // Front pad so the first cell sits in its correct Mon..Sun row.
  const leadPad = dow(grid[0].date);
  for (let i = 0; i < leadPad; i++) cells.push(null);
  for (const c of grid) cells.push(c);

  // The next un-studied future day (one past today) gets a dashed marker.
  const nextFutureKey = nextIso(todayIso);
  // Tail pad to the end of the current week so the future cell has a slot.
  while (cells.length % 7 !== 0) cells.push(null);

  // Split into columns of 7 (each column = one week, top row Mon).
  const columns: (DayCell | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    columns.push(cells.slice(i, i + 7));
  }
  return { columns, todayKey: todayIso, nextFutureKey };
}

// ── Section 5: streak ring ────────────────────────────────────────────────────

function StreakRing({
  live,
  longest,
  studiedToday
}: {
  live: number;
  longest: number;
  studiedToday: boolean;
}) {
  const radius = 52;
  const stroke = 12;
  const cx = 70;
  const cy = 70;
  const circumference = 2 * Math.PI * radius;
  const denom = Math.max(longest, live, 1);
  const frac = Math.min(1, live / denom);
  const dash = frac * circumference;

  const stateLine =
    studiedToday
      ? "Today is planted."
      : live > 0
        ? "One session keeps it growing."
        : "A fresh row starts whenever you are ready. No streak needed.";

  return (
    <section className="flex flex-col items-center justify-center rounded-3xl border border-ink-900/10 bg-cream-50 p-5 text-center shadow-soft">
      <div className="relative h-[140px] w-[140px]">
        <svg viewBox="0 0 140 140" className="h-full w-full" aria-hidden>
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#c7e2c7" strokeWidth={stroke} />
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={DEEP_MOSS}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference - dash}`}
            transform={`rotate(-90 ${cx} ${cy})`}
            className="transition-[stroke-dasharray] duration-700 motion-reduce:transition-none"
          />
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-display text-4xl leading-none text-ink-900">{live}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-ink-700/70">
            {live === 1 ? "day streak" : "day streak"}
          </p>
        </div>
      </div>
      <p className="mt-3 font-display text-sm italic text-ink-700/85">{stateLine}</p>
      {longest > 0 && (
        <p className="mt-1 text-[11px] text-ink-700/60">
          Your longest stretch so far is {longest} {longest === 1 ? "day" : "days"}.
        </p>
      )}
    </section>
  );
}

// ── Section 6: consistency tile ───────────────────────────────────────────────

function ConsistencyTile({
  tone,
  label,
  value,
  note
}: {
  tone: string;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div
      className={`flex flex-col justify-center rounded-3xl border border-white/60 bg-gradient-to-br ${tone} p-4 shadow-[0_12px_30px_-20px_rgba(31,77,44,0.5),inset_0_1px_0_rgba(255,255,255,0.5)]`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-700/80">{label}</p>
      <p className="mt-1.5 font-display text-2xl leading-none text-ink-900">{value}</p>
      <p className="mt-1.5 font-display text-xs italic text-ink-700/85">{note}</p>
    </div>
  );
}

// ── Section 7: the evidence (demoted classics) ────────────────────────────────

function Evidence({
  topTopics,
  recent,
  todayMinutes,
  weekMinutes,
  lifetimeMinutes,
  dailyGoal,
  goalPct,
  recentLimit = 8,
  showTopicsDonut = true
}: {
  topTopics: [string, number][];
  recent: StatsSession[];
  todayMinutes: number;
  weekMinutes: number;
  lifetimeMinutes: number;
  dailyGoal: number;
  goalPct: number;
  recentLimit?: number;
  showTopicsDonut?: boolean;
}) {
  return (
    <div className="mt-8">
      <div className="h-px w-full bg-ink-900/10" aria-hidden />
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-700/55">
        The evidence
      </p>

      {/* Quiet KPI row */}
      <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi label="Today" value={`${todayMinutes} min`} note={`${goalPct}% of ${dailyGoal} min goal`} />
        <Kpi label="This week" value={fmt(weekMinutes)} note="last 7 days" />
        <Kpi label="Lifetime" value={fmt(lifetimeMinutes)} note="all focus time" />
        <Kpi label="Top topic" value={topTopics[0]?.[0] ?? "None yet"} note={topTopics[0] ? `${topTopics[0][1]} min` : "start a session"} />
      </dl>

      <div className={`mt-4 grid gap-5 ${showTopicsDonut ? "lg:grid-cols-2" : ""}`}>
        {/* Top topics donut. The full page already shows the complete breakdown
            above, so this compact donut only appears in the panel variant. */}
        {showTopicsDonut && (
          <section className="rounded-3xl border border-ink-900/10 bg-cream-50/60 p-5">
            <h3 className="font-display text-lg text-ink-900">Top topics</h3>
            {topTopics.length === 0 ? (
              <p className="mt-4 text-sm text-ink-700/70">No focus sessions yet. Start one from the timer.</p>
            ) : (
              <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                <TopicDonut data={topTopics} />
                <ul className="flex-1 space-y-2.5">
                  {topTopics.map(([name, mins], idx) => (
                    <li key={name} className="flex items-center gap-3 text-sm">
                      <span
                        aria-hidden
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: TOPIC_COLORS[idx % TOPIC_COLORS.length] }}
                      />
                      <span className="flex-1 truncate text-ink-900">{name}</span>
                      <span className="tabular-nums text-ink-700">{mins}m</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Recent sessions */}
        <section className="rounded-3xl border border-ink-900/10 bg-cream-50/60 p-5">
          <h3 className="font-display text-lg text-ink-900">Recent sessions</h3>
          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-ink-700/70">Nothing here yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-ink-900/10">
              {recent.slice(0, recentLimit).map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink-900">
                      {s.minutes} min · {s.mode}
                    </p>
                    <p className="truncate text-xs text-ink-700/80">
                      {s.topic_name || "General"}
                      {s.task_name ? ` · ${s.task_name}` : ""}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs tabular-nums text-ink-700/70">
                    {new Date(s.created_at).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Kpi({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-ink-900/10 bg-cream-50/60 px-4 py-3">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-700/70">{label}</dt>
      <dd className="mt-1 truncate font-display text-lg text-ink-900">{value}</dd>
      <dd className="mt-0.5 truncate text-[11px] text-ink-700/65">{note}</dd>
    </div>
  );
}

function TopicDonut({ data }: { data: [string, number][] }) {
  const total = data.reduce((a, [, m]) => a + m, 0);
  if (total === 0) return null;

  const radius = 56;
  const stroke = 18;
  const cx = 72;
  const cy = 72;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const arcs = data.map(([name, mins], idx) => {
    const fraction = mins / total;
    const dash = fraction * circumference;
    const seg = (
      <circle
        key={name}
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={TOPIC_COLORS[idx % TOPIC_COLORS.length]}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeDashoffset={-offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        className="transition-[stroke-dasharray] duration-500 motion-reduce:transition-none"
      />
    );
    offset += dash;
    return seg;
  });

  return (
    <div className="relative h-[144px] w-[144px] shrink-0">
      <svg viewBox="0 0 144 144" className="h-full w-full" aria-hidden>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(31,77,44,0.08)" strokeWidth={stroke} />
        {arcs}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <p className="font-display text-2xl text-ink-900">{total}</p>
        <p className="text-[10px] uppercase tracking-[0.22em] text-ink-700">min total</p>
      </div>
    </div>
  );
}

// ── Full-page deep sections ───────────────────────────────────────────────────
// These render only when variant === "full". They share the panel's calm
// language and the same cream / rounded-3xl / shadow-soft chrome so the full
// page reads as one family with the panel, just deeper.

const LILAC = "#d9cdea";

// Plural day name for the steadiest-day caption.
const WEEKDAY_PLURAL: Record<string, string> = {
  Mon: "Mondays",
  Tue: "Tuesdays",
  Wed: "Wednesdays",
  Thu: "Thursdays",
  Fri: "Fridays",
  Sat: "Saturdays",
  Sun: "Sundays"
};

// ── Which days you show up (weekday rhythm) ───────────────────────────────────

function WeekdayRhythm({ weekdays }: { weekdays: WeekdayTotal[] }) {
  const max = Math.max(1, ...weekdays.map((d) => d.minutes));
  const hasAny = weekdays.some((d) => d.minutes > 0);
  // Peak day is the single steadiest weekday. Index, not just value, so we can
  // colour exactly one bar deep moss.
  let peakIdx = -1;
  let peakVal = 0;
  weekdays.forEach((d, i) => {
    if (d.minutes > peakVal) {
      peakVal = d.minutes;
      peakIdx = i;
    }
  });

  const caption = hasAny && peakIdx >= 0
    ? `${WEEKDAY_PLURAL[weekdays[peakIdx].label]} are your steadiest day.`
    : "Your weekly rhythm fills in here as you study. No favourite day yet, and that is fine.";

  const srSummary =
    "Focus minutes by day of the week. " +
    weekdays.map((d) => `${d.label}, ${d.minutes} minutes`).join(". ") +
    ".";

  return (
    <section className="flex h-full flex-col rounded-3xl border border-ink-900/10 bg-cream-50 p-5 shadow-soft">
      <h3 className="font-display text-xl text-ink-900">Which days you show up</h3>
      <div className="mt-5 grid grid-cols-7 items-end gap-2" style={{ height: 120 }} aria-hidden>
        {weekdays.map((d, i) => {
          const h = d.minutes === 0 ? 4 : Math.max(8, Math.round((d.minutes / max) * 96));
          const isPeak = i === peakIdx && d.minutes > 0;
          return (
            <div key={d.label} className="flex h-full flex-col items-center justify-end gap-1.5">
              <span className="text-[10px] tabular-nums text-ink-700/70">{d.minutes || ""}</span>
              <div
                className="w-full rounded-lg transition-[height] duration-500 motion-reduce:transition-none"
                style={{
                  height: `${h}px`,
                  background: isPeak ? DEEP_MOSS : d.minutes > 0 ? "rgba(31,77,44,0.18)" : "rgba(31,31,31,0.06)"
                }}
              />
              <span className={`text-[10px] ${isPeak ? "font-semibold text-ink-900" : "text-ink-700/70"}`}>
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
      <p className="sr-only">{srSummary}</p>
      <p className="mt-4 font-display text-sm italic text-ink-700/85">{caption}</p>
    </section>
  );
}

// ── How your sessions run (session-length distribution) ───────────────────────

function SessionLengths({ lengths, records }: { lengths: LengthBucket[]; records: PersonalRecords }) {
  const max = Math.max(1, ...lengths.map((b) => b.count));
  const hasAny = lengths.some((b) => b.count > 0);
  // Modal bucket: the length range most of the user's sits fall into.
  let modalIdx = -1;
  let modalCount = 0;
  lengths.forEach((b, i) => {
    if (b.count > modalCount) {
      modalCount = b.count;
      modalIdx = i;
    }
  });

  const caption = hasAny && modalIdx >= 0
    ? `Most of your sits land in the comfortable ${lengths[modalIdx].label} minute range. Your longest was ${records.longestSessionMin} minutes.`
    : "Your session lengths gather here as you study. A shape shows after a few sits.";

  const srSummary =
    "How long your focus sessions run. " +
    lengths.map((b) => `${b.label} minutes, ${b.count} ${b.count === 1 ? "session" : "sessions"}`).join(". ") +
    ".";

  return (
    <section className="flex h-full flex-col rounded-3xl border border-ink-900/10 bg-cream-50 p-5 shadow-soft">
      <h3 className="font-display text-xl text-ink-900">How your sessions run</h3>
      <ul className="mt-5 space-y-3" aria-hidden>
        {lengths.map((b) => {
          const w = b.count === 0 ? 0 : Math.max(6, Math.round((b.count / max) * 100));
          return (
            <li key={b.label} className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-right text-[11px] tabular-nums text-ink-700/75">{b.label}</span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-ink-900/[0.06]">
                <div
                  className="h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none"
                  style={{ width: `${w}%`, background: LILAC }}
                />
              </div>
              <span className="w-6 shrink-0 text-right text-[11px] font-semibold tabular-nums text-ink-900">
                {b.count}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="sr-only">{srSummary}</p>
      <p className="mt-4 font-display text-sm italic text-ink-700/85">{caption}</p>
    </section>
  );
}

// ── Quiet records (keepsake stats) ────────────────────────────────────────────

function QuietRecords({ records }: { records: PersonalRecords }) {
  const r = records;
  const cards: { label: string; value: string; tone: string }[] = [
    { label: "Longest session", value: r.longestSessionMin > 0 ? `${r.longestSessionMin} min` : "None yet", tone: "bg-brand-mint" },
    { label: "Best day", value: r.bestDay.minutes > 0 ? `${recordDayLabel(r.bestDay.date)}, ${r.bestDay.minutes} min` : "None yet", tone: "bg-brand-butter" },
    { label: "Best week", value: r.bestWeekMinutes > 0 ? fmt(r.bestWeekMinutes) : "None yet", tone: "bg-brand-sky" },
    { label: "Total focus", value: r.totalSessions > 0 ? fmt(r.totalHours * 60) : "None yet", tone: "bg-[#e7def2]" },
    { label: "Sessions", value: `${r.totalSessions} ${r.totalSessions === 1 ? "session" : "sessions"}`, tone: "bg-brand-mint" }
  ];

  return (
    <section className="mt-5">
      <h3 className="font-display text-xl text-ink-900">Quiet records</h3>
      <p className="mt-1 text-sm text-ink-700/75">Kept from your own study, nothing borrowed.</p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-2xl border border-ink-900/10 ${c.tone} p-4 shadow-soft`}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-700">{c.label}</p>
            <p className="mt-1.5 font-display text-xl text-ink-900">{c.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// "Wed Jun 4" style label from a local ISO day, for the best-day keepsake.
function recordDayLabel(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}

// ── Everything you studied (full topic breakdown) ─────────────────────────────

function EverythingYouStudied({ topics }: { topics: [string, number][] }) {
  const total = topics.reduce((a, [, m]) => a + m, 0);
  const max = Math.max(1, ...topics.map(([, m]) => m));

  return (
    <section className="mt-5 rounded-3xl border border-ink-900/10 bg-cream-50 p-5 shadow-soft">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-xl text-ink-900">Everything you studied</h3>
        {total > 0 && <span className="text-xs text-ink-700/70">{fmt(total)} in all</span>}
      </div>
      {topics.length === 0 ? (
        <p className="mt-4 text-sm text-ink-700/70">No focus sessions yet. Start one from the timer.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {topics.map(([name, mins]) => {
            const share = total > 0 ? Math.round((mins / total) * 100) : 0;
            const w = Math.max(6, Math.round((mins / max) * 100));
            return (
              <li key={name}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate pr-2 text-ink-900">{name}</span>
                  <span className="shrink-0 tabular-nums text-ink-700">
                    {fmt(mins)} <span className="text-ink-700/55">{share}%</span>
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-ink-900/[0.06]" aria-hidden>
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#7fb069] to-[#1f4d2c] transition-[width] duration-500 motion-reduce:transition-none"
                    style={{ width: `${w}%` }}
                  />
                </div>
                <span className="sr-only">{name}, {mins} minutes, {share} percent of your focus time.</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
