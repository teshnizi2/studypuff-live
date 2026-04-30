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

export default async function StatsPage() {
  const { user, profile } = await requireUser();
  const supabase = createSupabaseServerClient();

  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 13); // pull 14 days for streak detection

  const [{ data: sessions }, { data: settings }] = await Promise.all([
    supabase
      .from("study_sessions")
      .select("id, minutes, mode, studied_on, created_at, topic_name, task_name, focus_score")
      .eq("user_id", user.id)
      .gte("studied_on", isoDate(sevenDaysAgo))
      .order("created_at", { ascending: false }),
    supabase
      .from("user_settings")
      .select("daily_goal_minutes, lifetime_focus_minutes")
      .eq("user_id", user.id)
      .single()
  ]);

  const recent: SessionRow[] = (sessions as SessionRow[]) || [];
  const dailyGoal = settings?.daily_goal_minutes ?? 90;
  const lifetimeFocus = settings?.lifetime_focus_minutes ?? 0;

  // Build last 7 days bar chart
  const last7: { date: string; minutes: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = isoDate(d);
    const minutes = recent
      .filter((s) => s.studied_on === iso && s.mode === "focus")
      .reduce((a, s) => a + s.minutes, 0);
    last7.push({ date: iso, minutes });
  }

  const todayIso = isoDate(today);
  const todayMinutes = last7.find((d) => d.date === todayIso)?.minutes ?? 0;
  const weekMinutes = last7.reduce((a, d) => a + d.minutes, 0);
  const max7 = Math.max(60, ...last7.map((d) => d.minutes));

  // Streak: consecutive days ending today (or yesterday if today is 0) with at least 1 focus minute
  let streak = 0;
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = isoDate(d);
    const has = recent.some((s) => s.studied_on === iso && s.mode === "focus" && s.minutes > 0);
    if (has) {
      streak++;
    } else if (i === 0) {
      // today is empty: still allow yesterday to start the streak
      continue;
    } else {
      break;
    }
  }

  // Top topics
  const topicTotals = new Map<string, number>();
  for (const s of recent.filter((r) => r.mode === "focus")) {
    const k = s.topic_name || "General study";
    topicTotals.set(k, (topicTotals.get(k) || 0) + s.minutes);
  }
  const topTopics = Array.from(topicTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const goalPct = Math.min(100, Math.round((todayMinutes / dailyGoal) * 100));

  return (
    <DashboardShell
      title="Your stats"
      subtitle="Quiet pride. Here's what your last two weeks of study looked like."
      profile={profile}
    >
      {/* Top stat cards */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Today" value={`${todayMinutes} min`} hint={`${goalPct}% of daily goal`} tone="bg-brand-mint" />
        <StatCard label="This week" value={`${weekMinutes} min`} hint="last 7 days" tone="bg-brand-butter" />
        <StatCard label="Streak" value={`${streak} day${streak === 1 ? "" : "s"}`} hint={streak > 0 ? "Keep it going" : "Start today"} tone="bg-brand-pink" />
        <StatCard label="Lifetime" value={`${lifetimeFocus} min`} hint="all focus time" tone="bg-brand-sky" />
      </section>

      {/* Daily goal progress */}
      <section className="mt-8 rounded-3xl border border-ink-900/10 bg-cream-50 p-6 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl text-ink-900">Daily goal</h2>
          <span className="text-sm text-ink-700">
            {todayMinutes} / {dailyGoal} min
          </span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-ink-900/10">
          <div
            className="h-full rounded-full bg-ink-900 transition-all"
            style={{ width: `${goalPct}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-ink-700">
          Adjust your goal in{" "}
          <Link href="/dashboard/settings" className="underline underline-offset-4">
            Settings
          </Link>
          .
        </p>
      </section>

      {/* 7-day bar chart */}
      <section className="mt-8 rounded-3xl border border-ink-900/10 bg-cream-50 p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink-900">Last 7 days</h2>
        <div className="mt-6 grid grid-cols-7 items-end gap-3">
          {last7.map((d) => {
            const h = d.minutes === 0 ? 6 : Math.max(8, Math.round((d.minutes / max7) * 140));
            const isToday = d.date === todayIso;
            return (
              <div key={d.date} className="flex flex-col items-center gap-2">
                <span className="text-xs text-ink-700">{d.minutes || ""}</span>
                <div
                  className={`w-full rounded-xl ${isToday ? "bg-ink-900" : "bg-brand-butter"}`}
                  style={{ height: `${h}px` }}
                  title={`${d.date}: ${d.minutes} min`}
                />
                <span className={`text-xs ${isToday ? "font-semibold text-ink-900" : "text-ink-700"}`}>
                  {dayLabel(d.date)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Top topics */}
        <section className="rounded-3xl border border-ink-900/10 bg-cream-50 p-6 shadow-soft">
          <h2 className="font-display text-2xl text-ink-900">Top topics · last 14 days</h2>
          {topTopics.length === 0 ? (
            <p className="mt-4 text-sm text-ink-700">
              No focus sessions yet. Open the{" "}
              <Link href="/dashboard/timer" className="underline underline-offset-4">
                timer
              </Link>{" "}
              and start one.
            </p>
          ) : (
            <ul className="mt-5 space-y-3">
              {topTopics.map(([name, mins]) => {
                const pct = Math.round((mins / topTopics[0][1]) * 100);
                return (
                  <li key={name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-ink-900">{name}</span>
                      <span className="text-ink-700">{mins} min</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink-900/10">
                      <div className="h-full rounded-full bg-ink-900/70" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Recent sessions */}
        <section className="rounded-3xl border border-ink-900/10 bg-cream-50 p-6 shadow-soft">
          <h2 className="font-display text-2xl text-ink-900">Recent sessions</h2>
          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-ink-700">Nothing here yet.</p>
          ) : (
            <ul className="mt-5 divide-y divide-ink-900/10">
              {recent.slice(0, 8).map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-semibold text-ink-900">
                      {s.minutes} min · {s.mode}
                    </p>
                    <p className="text-xs text-ink-700">
                      {s.topic_name || "General"}
                      {s.task_name ? ` · ${s.task_name}` : ""}
                    </p>
                  </div>
                  <p className="text-xs text-ink-700">
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
    </DashboardShell>
  );
}

function StatCard({
  label,
  value,
  hint,
  tone
}: {
  label: string;
  value: string;
  hint: string;
  tone: string;
}) {
  return (
    <div className={`rounded-3xl border border-ink-900/10 ${tone} p-5 shadow-soft`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-700">{label}</p>
      <p className="mt-2 font-display text-3xl text-ink-900">{value}</p>
      <p className="mt-1 text-xs text-ink-700">{hint}</p>
    </div>
  );
}
