import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminOverview } from "@/lib/admin/queries";

export default async function AdminPage() {
  const overview = await getAdminOverview();

  return (
    <AdminShell
      title="Platform overview"
      subtitle="Monitor users, study activity, task completion, and sensitive admin actions."
    >
      <div className="grid gap-5 md:grid-cols-5">
        <AdminStat label="Total users" value={overview.stats.totalUsers} />
        <AdminStat label="New users" value={overview.stats.newUsers} />
        <AdminStat label="Active users" value={overview.stats.activeUsers} />
        <AdminStat label="Study minutes" value={overview.stats.totalStudyMinutes} />
        <AdminStat label="Completed tasks" value={overview.stats.completedTasks} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-3xl">Recent users</h2>
            <Link href="/admin/users" className="text-sm font-semibold underline underline-offset-4">
              Manage users
            </Link>
          </div>
          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
            {overview.profiles.slice(0, 6).map((profile) => (
              <div key={profile.id} className="grid gap-2 border-b border-white/10 p-4 text-sm last:border-b-0 md:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-semibold">{profile.display_name || profile.email}</p>
                  <p className="text-cream-200">{profile.email}</p>
                </div>
                <p className="uppercase tracking-[0.16em] text-brand-butter">{profile.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h2 className="font-display text-3xl">Audit log</h2>
          <div className="mt-5 space-y-3">
            {overview.auditLogs.map((log) => (
              <article key={log.id} className="rounded-2xl bg-white/5 p-4 text-sm">
                <p className="font-semibold">{log.action}</p>
                <p className="mt-1 text-cream-200">
                  {new Date(log.created_at).toLocaleString()} · target {log.target_user_id || "none"}
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
    </AdminShell>
  );
}

function AdminStat({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-[24px] border border-white/10 bg-white/5 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-butter">{label}</p>
      <p className="mt-3 font-display text-4xl">{value}</p>
    </article>
  );
}
