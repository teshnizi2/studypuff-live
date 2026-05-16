import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminOverview } from "@/lib/admin/queries";

export default async function AdminPage() {
  const overview = await getAdminOverview();
  const taskCompletion =
    overview.stats.totalTasks > 0
      ? Math.round((overview.stats.completedTasks / overview.stats.totalTasks) * 100)
      : 0;

  return (
    <AdminShell
      title="Platform overview"
      subtitle="Monitor users, study activity, study rooms, and sensitive admin actions."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <AdminStat label="Total users" value={overview.stats.totalUsers} />
        <AdminStat label="New users · 7d" value={overview.stats.newUsers} />
        <AdminStat label="Active · 7d" value={overview.stats.activeUsers} />
        <AdminStat label="Active · 30d" value={overview.stats.monthlyActive} />
        <AdminStat label="Active rooms" value={overview.stats.activeRooms} />
        <AdminStat label="Total rooms" value={overview.stats.totalRooms} />
        <AdminStat label="Focus minutes · all-time" value={overview.stats.totalStudyMinutes} />
        <AdminStat label="Focus minutes · 7d" value={overview.stats.last7Minutes} />
        <AdminStat label="Messages · 7d" value={overview.stats.messagesLast7} />
        <AdminStat label="Tasks completed" value={overview.stats.completedTasks} />
        <AdminStat label="Tasks total" value={overview.stats.totalTasks} />
        <AdminStat label="Task completion" value={`${taskCompletion}%`} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-3xl">Top users · all-time</h2>
            <Link href="/admin/users" className="text-sm font-semibold underline underline-offset-4">
              Manage users
            </Link>
          </div>
          {overview.topUsers.length === 0 ? (
            <p className="mt-5 rounded-2xl bg-white/5 p-4 text-sm text-cream-200">
              No focus sessions logged yet.
            </p>
          ) : (
            <ol className="mt-5 space-y-2">
              {overview.topUsers.map((u, i) => (
                <li
                  key={u.userId}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-5 text-cream-200">{String(i + 1).padStart(2, "0")}</span>
                    <Link href={`/admin/users/${u.userId}`} className="font-semibold text-cream-50 hover:underline">
                      {u.displayName}
                    </Link>
                  </span>
                  <span className="font-mono text-brand-butter">{u.minutes}m</span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h2 className="font-display text-3xl">Audit log</h2>
          <div className="mt-5 space-y-3">
            {overview.auditLogs.map((log) => (
              <article key={log.id} className="rounded-2xl bg-white/5 p-4 text-sm">
                <p className="font-semibold">{log.action}</p>
                <p className="mt-1 text-cream-200">
                  {new Date(log.created_at).toLocaleString()} · target {log.target_user_id || "—"}
                </p>
              </article>
            ))}
            {overview.auditLogs.length === 0 && (
              <p className="rounded-2xl bg-white/5 p-4 text-sm text-cream-200">
                Admin changes will be recorded here.
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-3xl">Recent signups</h2>
          <Link href="/admin/users" className="text-sm font-semibold underline underline-offset-4">
            All users →
          </Link>
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
          {overview.profiles.slice(0, 8).map((profile) => (
            <Link
              key={profile.id}
              href={`/admin/users/${profile.id}`}
              className="grid gap-2 border-b border-white/10 p-4 text-sm transition last:border-b-0 hover:bg-white/5 md:grid-cols-[1fr_auto_auto]"
            >
              <div>
                <p className="font-semibold">{profile.display_name || profile.email}</p>
                <p className="text-cream-200">{profile.email}</p>
              </div>
              <p className="text-cream-200">{new Date(profile.created_at).toLocaleDateString()}</p>
              <p className="uppercase tracking-[0.16em] text-brand-butter">{profile.role}</p>
            </Link>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}

function AdminStat({ label, value }: { label: string; value: number | string }) {
  return (
    <article className="rounded-[20px] border border-white/10 bg-white/5 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-butter">{label}</p>
      <p className="mt-2 font-display text-3xl tabular-nums">{value}</p>
    </article>
  );
}
