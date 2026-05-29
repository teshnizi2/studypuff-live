import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/lib/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SessionRow = {
  id: string;
  minutes: number;
  mode: string;
  studied_on: string;
  created_at: string;
  topic_name: string | null;
  task_name: string | null;
  focus_score: number | null;
};

function isoDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dayLabel(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: "short" });
}

/** Compact "2h 15m" / "45m" formatting so big numbers stay readable. */
function fmt(min: number) {
  if (min <= 0) return "0m";
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

const TOD_BUCKETS = [
  { key: "morning", label: "Morning", hint: "5a–12p", emoji: "🌅" },
  { key: "afternoon", label: "Afternoon", hint: "12p–5p", emoji: "☀️" },
  { key: "evening", label: "Evening", hint: "5p–10p", emoji: "🌆" },
  { key: "night", label: "Night", hint: "10p–5a", emoji: "🌙" },
] as const;
type TodKey = (typeof TOD_BUCKETS)[number]["key"];
function bucketForHour(h: number): TodKey {
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 22) return "evening";
  return "night";
}

export default async function StatsPage() {
  const { user, profile } = await requireUser();
  const supabase = createSupabaseServerClient();

  const today = new Date();
  const fourteenDaysAgo = new Date(today);
  fourteenDaysAgo.setDate(today.getDate() - 13); // 14-day window

  const [{ data: sessions }, { data: settings }] = await Promise.all([
    supabase
      .from("study_sessions")
      .select("id, minutes, mode, studied_on, created_at, topic_name, task_name, focus_score")
      .eq("user_id", user.id)
      .gte("studied_on", isoDate(fourteenDaysAgo))
      .order("created_at", { ascending: false }),
    supabase
      .from("user_settings")
      .select("daily_goal_minutes, lifetime_focus_minutes")
      .eq("user_id", user.id)
      .single()
  ]);

  const recent: SessionRow[] = (sessions as SessionRow[]) || [];
  const focusRows = recent.filter((r) => r.mode === "focus");
  const dailyGoal = settings?.daily_goal_minutes ?? 90;
  const lifetimeFocus = settings?.lifetime_focus_minutes ?? 0;

  // ── Last 7 days (chart) ────────────────────────────────────────────────
  const last7: { date: string; minutes: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = isoDate(d);
    const minutes = focusRows.filter((s) => s.studied_on === iso).reduce((a, s) => a + s.minutes, 0);
    last7.push({ date: iso, minutes });
  }
  const todayIso = isoDate(today);
  const todayMinutes = last7.find((d) => d.date === todayIso)?.minutes ?? 0;
  const weekMinutes = last7.reduce((a, d) => a + d.minutes, 0);
  const max7 = Math.max(30, ...last7.map((d) => d.minutes));
  const dailyAvg7 = Math.round(weekMinutes / 7);
  const bestDay = last7.reduce((best, d) => (d.minutes > best.minutes ? d : best), last7[0]);

  // ── Streak ─────────────────────────────────────────────────────────────
  let streak = 0;
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = isoDate(d);
    const has = focusRows.some((s) => s.studied_on === iso && s.minutes > 0);
    if (has) streak++;
    else if (i === 0) continue;
    else break;
  }

  // ── 14-day rollups ──────────────────────────────────────────────────────
  const total14 = focusRows.reduce((a, s) => a + s.minutes, 0);
  const sessions14 = focusRows.length;
  const coins7 = focusRows
    .filter((s) => last7.some((d) => d.date === s.studied_on))
    .reduce((a, s) => a + Math.min(s.minutes, 180), 0);
  const avgSession = sessions14 ? Math.round(total14 / sessions14) : 0;

  // ── Top topics (14d) ─────────────────────────────────────────────────────
  const topicAgg = new Map<string, { minutes: number; count: number }>();
  for (const s of focusRows) {
    const k = s.topic_name || "General study";
    const cur = topicAgg.get(k) || { minutes: 0, count: 0 };
    cur.minutes += s.minutes;
    cur.count += 1;
    topicAgg.set(k, cur);
  }
  const topTopics = Array.from(topicAgg.entries())
    .sort((a, b) => b[1].minutes - a[1].minutes)
    .slice(0, 5);
  const topTopicMax = topTopics[0]?.[1].minutes ?? 1;

  // ── When you focus (time of day, 14d) ────────────────────────────────────
  const todAgg: Record<TodKey, number> = { morning: 0, afternoon: 0, evening: 0, night: 0 };
  for (const s of focusRows) {
    todAgg[bucketForHour(new Date(s.created_at).getHours())] += s.minutes;
  }
  const todMax = Math.max(1, ...Object.values(todAgg));
  const peakTod = TOD_BUCKETS.reduce((p, b) => (todAgg[b.key] > todAgg[p.key] ? b : p), TOD_BUCKETS[0]);

  const goalPct = Math.min(100, Math.round((todayMinutes / dailyGoal) * 100));
  const hasData = sessions14 > 0;

  return (
    <DashboardShell
      title="Your stats"
      subtitle="Quiet pride. Here's what your last two weeks of study looked like."
      profile={profile}
    >
      {/* ── OVERVIEW ─────────────────────────────────────────────────────── */}
      <SectionLabel>Overview</SectionLabel>
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Today" value={fmt(todayMinutes)} hint={`${goalPct}% of daily goal`} tone="bg-brand-mint" />
        <StatCard label="This week" value={fmt(weekMinutes)} hint={`${fmt(dailyAvg7)}/day avg`} tone="bg-brand-butter" />
        <StatCard label="Streak" value={`${streak}d`} hint={streak > 0 ? "Keep it going" : "Start today"} tone="bg-brand-pink" />
        <StatCard label="Lifetime" value={fmt(lifetimeFocus)} hint="all focus time" tone="bg-brand-sky" />
      </section>

      {/* ── DAILY GOAL ───────────────────────────────────────────────────── */}
      <section className="mt-5 rounded-2xl border border-ink-900/10 bg-cream-50 p-4 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg text-ink-900">Daily goal</h2>
          <span className="text-xs tabular-nums text-ink-700">{todayMinutes} / {dailyGoal} min</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-ink-900/10">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all" style={{ width: `${goalPct}%` }} />
        </div>
        <p className="mt-2 text-[11px] text-ink-700/70">
          Adjust it in <Link href="/dashboard/settings" className="underline underline-offset-2">Settings</Link>.
        </p>
      </section>

      {/* ── THIS WEEK + WHEN YOU FOCUS ───────────────────────────────────── */}
      <SectionLabel className="mt-7">Patterns</SectionLabel>
      <div className="grid gap-4 lg:grid-cols-5">
        {/* 7-day chart — compact bars (≤72px), with summary chips */}
        <section className="lg:col-span-3 rounded-2xl border border-ink-900/10 bg-cream-50 p-4 shadow-soft">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg text-ink-900">Last 7 days</h2>
            <span className="text-xs text-ink-700/70">{fmt(weekMinutes)} total</span>
          </div>
          <div className="mt-4 grid grid-cols-7 items-end gap-2" style={{ height: 96 }}>
            {last7.map((d) => {
              const h = d.minutes === 0 ? 4 : Math.max(6, Math.round((d.minutes / max7) * 72));
              const isToday = d.date === todayIso;
              return (
                <div key={d.date} className="flex h-full flex-col items-center justify-end gap-1.5">
                  <span className="text-[10px] tabular-nums text-ink-700/70">{d.minutes || ""}</span>
                  <div
                    className={`w-full rounded-lg transition-all ${isToday ? "bg-emerald-700" : d.minutes > 0 ? "bg-brand-butter" : "bg-ink-900/[0.06]"}`}
                    style={{ height: `${h}px` }}
                    title={`${d.date}: ${d.minutes} min`}
                  />
                  <span className={`text-[10px] ${isToday ? "font-semibold text-ink-900" : "text-ink-700/70"}`}>{dayLabel(d.date)}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 border-t border-ink-900/[0.06] pt-3">
            <Chip label="Daily avg" value={fmt(dailyAvg7)} />
            <Chip label="Best day" value={bestDay && bestDay.minutes > 0 ? `${dayLabel(bestDay.date)} · ${fmt(bestDay.minutes)}` : "—"} />
            <Chip label="Coins (7d)" value={`🪙 ${coins7}`} />
          </div>
        </section>

        {/* When you focus — time-of-day horizontal bars */}
        <section className="lg:col-span-2 rounded-2xl border border-ink-900/10 bg-cream-50 p-4 shadow-soft">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg text-ink-900">When you focus</h2>
            {hasData && <span className="text-xs text-ink-700/70">peak {peakTod.label.toLowerCase()}</span>}
          </div>
          <ul className="mt-4 space-y-2.5">
            {TOD_BUCKETS.map((b) => {
              const mins = todAgg[b.key];
              const pct = Math.round((mins / todMax) * 100);
              return (
                <li key={b.key}>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 text-ink-900">
                      <span aria-hidden>{b.emoji}</span>{b.label}
                      <span className="text-ink-700/45">{b.hint}</span>
                    </span>
                    <span className="tabular-nums text-ink-700">{fmt(mins)}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink-900/[0.07]">
                    <div className="h-full rounded-full bg-gradient-to-r from-violet-500/80 to-sky-400/80 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* ── BREAKDOWN + ACTIVITY ─────────────────────────────────────────── */}
      <SectionLabel className="mt-7">Breakdown</SectionLabel>
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top topics */}
        <section className="rounded-2xl border border-ink-900/10 bg-cream-50 p-4 shadow-soft">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg text-ink-900">Top topics</h2>
            <span className="text-xs text-ink-700/70">14 days</span>
          </div>
          {topTopics.length === 0 ? (
            <p className="mt-4 text-sm text-ink-700/70">
              No focus sessions yet. Open the{" "}
              <Link href="/dashboard/timer" className="underline underline-offset-2">timer</Link> and start one.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {topTopics.map(([name, agg]) => {
                const pct = Math.round((agg.minutes / topTopicMax) * 100);
                return (
                  <li key={name}>
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="truncate pr-2 font-medium text-ink-900">{name}</span>
                      <span className="shrink-0 tabular-nums text-ink-700">
                        {fmt(agg.minutes)} <span className="text-ink-700/45">· {agg.count} {agg.count === 1 ? "session" : "sessions"}</span>
                      </span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink-900/[0.07]">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-500" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {hasData && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-ink-900/[0.06] pt-3">
              <Chip label="14-day total" value={fmt(total14)} />
              <Chip label="Sessions" value={`${sessions14}`} />
              <Chip label="Avg session" value={fmt(avgSession)} />
            </div>
          )}
        </section>

        {/* Recent sessions */}
        <section className="rounded-2xl border border-ink-900/10 bg-cream-50 p-4 shadow-soft">
          <h2 className="font-display text-lg text-ink-900">Recent activity</h2>
          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-ink-700/70">Nothing here yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-ink-900/[0.06]">
              {recent.slice(0, 8).map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[13px] font-medium text-ink-900">
                      <span className={`inline-block h-1.5 w-1.5 rounded-full ${s.mode === "focus" ? "bg-emerald-600" : "bg-ink-900/30"}`} />
                      {fmt(s.minutes)} · {s.mode}
                    </p>
                    <p className="truncate text-[11px] text-ink-700/70">
                      {s.topic_name || "General"}{s.task_name ? ` · ${s.task_name}` : ""}
                    </p>
                  </div>
                  <p className="shrink-0 text-[11px] tabular-nums text-ink-700/60">
                    {new Date(s.created_at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}

function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-700/55 ${className}`}>
      {children}
    </h2>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 rounded-full bg-ink-900/[0.04] px-2.5 py-1">
      <span className="text-[9px] font-semibold uppercase tracking-wider text-ink-700/60">{label}</span>
      <span className="text-[12px] font-semibold tabular-nums text-ink-900">{value}</span>
    </span>
  );
}

function StatCard({ label, value, hint, tone }: { label: string; value: string; hint: string; tone: string }) {
  return (
    <div className={`rounded-2xl border border-ink-900/10 ${tone} p-4 shadow-soft`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-700">{label}</p>
      <p className="mt-1.5 font-display text-2xl text-ink-900">{value}</p>
      <p className="mt-0.5 text-[11px] text-ink-700/80">{hint}</p>
    </div>
  );
}
