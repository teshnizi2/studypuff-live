"use client";

import Link from "next/link";

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
  onCloseHref?: () => void;
};

function dayLabel(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: "short" });
}

export function StatsContent(p: StatsContentProps) {
  const max7 = Math.max(60, ...p.last7.map((d) => d.minutes));

  return (
    <div>
      {/* Top stat cards */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Today" value={`${p.todayMinutes} min`} hint={`${p.goalPct}% of goal`} tone="bg-brand-mint" />
        <StatCard label="This week" value={`${p.weekMinutes} min`} hint="last 7 days" tone="bg-brand-butter" />
        <StatCard label="Streak" value={`${p.streak} day${p.streak === 1 ? "" : "s"}`} hint={p.streak > 0 ? "Keep it going" : "Start today"} tone="bg-brand-pink" />
        <StatCard label="Lifetime" value={`${p.lifetimeMinutes} min`} hint="all focus time" tone="bg-brand-sky" />
      </section>

      {/* Daily goal progress */}
      <section className="mt-5 rounded-3xl border border-ink-900/10 bg-cream-50 p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-xl text-ink-900">Daily goal</h3>
          <span className="text-sm text-ink-700">
            {p.todayMinutes} / {p.dailyGoal} min
          </span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-ink-900/10">
          <div
            className="h-full rounded-full bg-ink-900 transition-all"
            style={{ width: `${p.goalPct}%` }}
          />
        </div>
      </section>

      {/* 7-day bar chart */}
      <section className="mt-5 rounded-3xl border border-ink-900/10 bg-cream-50 p-5 shadow-soft">
        <h3 className="font-display text-xl text-ink-900">Last 7 days</h3>
        <div className="mt-5 grid grid-cols-7 items-end gap-3">
          {p.last7.map((d) => {
            const h = d.minutes === 0 ? 6 : Math.max(8, Math.round((d.minutes / max7) * 110));
            const isToday = d.date === p.todayIso;
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

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-3xl border border-ink-900/10 bg-cream-50 p-5 shadow-soft">
          <h3 className="font-display text-xl text-ink-900">Top topics · last 14 days</h3>
          {p.topTopics.length === 0 ? (
            <p className="mt-4 text-sm text-ink-700">
              No focus sessions yet. Start one from the timer.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {p.topTopics.map(([name, mins]) => {
                const pct = Math.round((mins / p.topTopics[0][1]) * 100);
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

        <section className="rounded-3xl border border-ink-900/10 bg-cream-50 p-5 shadow-soft">
          <h3 className="font-display text-xl text-ink-900">Recent sessions</h3>
          {p.recent.length === 0 ? (
            <p className="mt-4 text-sm text-ink-700">Nothing here yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-ink-900/10">
              {p.recent.slice(0, 8).map((s) => (
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

      <p className="mt-4 text-xs text-ink-700">
        Want the bigger view?{" "}
        <Link href="/dashboard/stats" className="underline underline-offset-4">
          Open full stats page
        </Link>
        .
      </p>
    </div>
  );
}

function StatCard({
  label, value, hint, tone
}: {
  label: string; value: string; hint: string; tone: string;
}) {
  return (
    <div className={`rounded-3xl border border-ink-900/10 ${tone} p-4 shadow-soft`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-700">{label}</p>
      <p className="mt-2 font-display text-2xl text-ink-900">{value}</p>
      <p className="mt-1 text-xs text-ink-700">{hint}</p>
    </div>
  );
}
