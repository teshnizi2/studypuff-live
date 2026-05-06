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
            <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
              <TopicDonut data={p.topTopics} />
              <ul className="flex-1 space-y-2.5">
                {p.topTopics.map(([name, mins], idx) => (
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

const TOPIC_COLORS = [
  "#1f4d2c", // deep moss
  "#3a8a4c", // emerald
  "#7fb069", // sage
  "#d4a574", // ochre
  "#c97f5e"  // terracotta
];

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
        className="transition-[stroke-dasharray] duration-500"
      />
    );
    offset += dash;
    return seg;
  });

  return (
    <div className="relative h-[144px] w-[144px] shrink-0">
      <svg viewBox="0 0 144 144" className="h-full w-full">
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
