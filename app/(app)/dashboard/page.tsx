import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/lib/auth/guards";
import { getUserWorkspace } from "@/lib/app-data/queries";

export default async function DashboardPage() {
  const { user, profile } = await requireUser();
  const workspace = await getUserWorkspace(user.id);
  const firstName = profile?.display_name || user.email?.split("@")[0] || "study buddy";
  const openTasks = workspace.tasks.filter((task) => !task.done);

  return (
    <DashboardShell
      title={`Welcome, ${firstName}`}
      subtitle="A calm control center for today's study sessions, task priorities, and momentum."
      profile={profile}
    >
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Today studied" value={`${workspace.todayMinutes} min`} tone="bg-brand-mint" />
        <StatCard label="Open tasks" value={String(openTasks.length)} tone="bg-brand-butter" />
        <StatCard label="Topics" value={String(workspace.topics.length)} tone="bg-brand-sky" />
        <StatCard label="Recent logged" value={`${workspace.totalMinutes} min`} tone="bg-brand-pink" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[28px] border border-ink-900/10 bg-cream-50 p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-ink-900">Quick focus</h2>
              <p className="mt-2 text-sm text-ink-700">
                Default focus block: {workspace.settings?.focus_minutes || 25} minutes.
              </p>
            </div>
            <Link href="/dashboard/timer" className="btn-primary">
              Start timer
            </Link>
          </div>
          <div className="mt-6 rounded-3xl bg-cream-100 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-700">
              Daily goal
            </p>
            <p className="mt-3 font-display text-5xl text-ink-900">
              {workspace.settings?.daily_goal_minutes || 90} min
            </p>
            <p className="mt-2 text-sm text-ink-700">
              {Math.max((workspace.settings?.daily_goal_minutes || 90) - workspace.todayMinutes, 0)} minutes left today.
            </p>
          </div>
        </section>

        <section className="rounded-[28px] border border-ink-900/10 bg-cream-50 p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-3xl text-ink-900">Priority tasks</h2>
            <Link href="/dashboard/tasks" className="text-sm font-semibold underline underline-offset-4">
              Manage
            </Link>
          </div>
          <ul className="mt-5 space-y-3">
            {openTasks.slice(0, 5).map((task) => (
              <li key={task.id} className="rounded-2xl bg-cream-100 px-4 py-3 text-sm text-ink-700">
                <span className="font-semibold text-ink-900">{task.text}</span>
                <span className="ml-2 text-xs uppercase tracking-[0.16em]">{task.priority}</span>
              </li>
            ))}
            {openTasks.length === 0 && (
              <li className="rounded-2xl bg-cream-100 px-4 py-3 text-sm text-ink-700">
                No open tasks yet. Add your first study task.
              </li>
            )}
          </ul>
        </section>
      </div>

      <section className="mt-8 rounded-[28px] border border-ink-900/10 bg-cream-50 p-6 shadow-soft">
        <h2 className="font-display text-3xl text-ink-900">Recent sessions</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {workspace.sessions.map((session) => (
            <article key={session.id} className="rounded-2xl bg-cream-100 px-4 py-3 text-sm text-ink-700">
              <p className="font-semibold text-ink-900">{session.minutes} minutes · {session.mode}</p>
              <p>{session.topic_name || "General study"} · {session.studied_on}</p>
            </article>
          ))}
          {workspace.sessions.length === 0 && (
            <p className="text-sm text-ink-700">Timer sessions will appear here once you log them.</p>
          )}
        </div>
      </section>
    </DashboardShell>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <article className={`rounded-[28px] ${tone} p-5 text-ink-900 shadow-soft`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em]">{label}</p>
      <p className="mt-3 font-display text-4xl">{value}</p>
    </article>
  );
}
