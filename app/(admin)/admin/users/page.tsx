import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminOverview } from "@/lib/admin/queries";
import {
  deleteUserAction,
  updateUserRoleAction,
  updateUserSuspensionAction
} from "@/lib/admin/actions";
import { hasAdminEnv } from "@/lib/supabase/admin";

export default async function AdminUsersPage({
  searchParams
}: {
  searchParams?: { q?: string; role?: string };
}) {
  const overview = await getAdminOverview();
  const query = (searchParams?.q || "").toLowerCase();
  const role = searchParams?.role || "all";
  const canHardDelete = hasAdminEnv();

  // Pre-aggregate per-user metrics for the row stats.
  const minutesByUser = new Map<string, number>();
  const sessionCountByUser = new Map<string, number>();
  for (const s of overview.sessions) {
    if (s.mode !== "focus") continue;
    minutesByUser.set(s.user_id, (minutesByUser.get(s.user_id) || 0) + s.minutes);
    sessionCountByUser.set(s.user_id, (sessionCountByUser.get(s.user_id) || 0) + 1);
  }

  const users = overview.profiles.filter((profile) => {
    const matchesQuery =
      !query ||
      profile.email.toLowerCase().includes(query) ||
      (profile.display_name || "").toLowerCase().includes(query);
    const matchesRole = role === "all" || profile.role === role;
    return matchesQuery && matchesRole;
  });

  return (
    <AdminShell
      title="User management"
      subtitle="Search, review per-user activity, change roles, suspend or delete accounts."
    >
      {!canHardDelete && (
        <div className="mb-6 rounded-2xl border border-brand-pink/30 bg-brand-pink/10 px-4 py-3 text-sm text-cream-100">
          <strong>Hard delete is disabled.</strong> Set <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
          in Vercel project settings to enable the Delete button.
        </div>
      )}

      <form className="grid gap-3 rounded-[28px] border border-white/10 bg-white/5 p-5 md:grid-cols-[1fr_auto_auto]">
        <input
          name="q"
          defaultValue={searchParams?.q || ""}
          placeholder="Search email or name"
          className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-cream-50 placeholder:text-cream-200"
        />
        <select
          name="role"
          defaultValue={role}
          className="rounded-2xl border border-white/10 bg-[#221f1b] px-4 py-3 text-cream-50"
        >
          <option value="all">All roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
        <button type="submit" className="rounded-full bg-brand-butter px-6 py-3 font-semibold text-ink-900">
          Filter
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
        {users.map((profile) => {
          const minutes = minutesByUser.get(profile.id) || 0;
          const sessions = sessionCountByUser.get(profile.id) || 0;

          return (
            <article
              key={profile.id}
              className="grid gap-5 border-b border-white/10 p-5 last:border-b-0 lg:grid-cols-[1.1fr_0.9fr_0.9fr]"
            >
              <div>
                <Link href={`/admin/users/${profile.id}`} className="font-display text-2xl hover:underline">
                  {profile.display_name || "Unnamed student"}
                </Link>
                <p className="mt-1 text-sm text-cream-200">{profile.email}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-brand-butter">
                  {profile.role}
                  {profile.is_suspended ? " · suspended" : ""}
                </p>
              </div>
              <div className="text-sm text-cream-200">
                <p>Joined {new Date(profile.created_at).toLocaleDateString()}</p>
                <p>
                  Last active{" "}
                  {profile.last_seen_at ? new Date(profile.last_seen_at).toLocaleDateString() : "never"}
                </p>
                <p>
                  {minutes}m focused · {sessions} sessions
                </p>
              </div>
              <div className="space-y-2">
                <form action={updateUserRoleAction} className="flex gap-2">
                  <input type="hidden" name="user_id" value={profile.id} />
                  <select
                    name="role"
                    defaultValue={profile.role}
                    className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-[#221f1b] px-3 py-2 text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button type="submit" className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                    Save
                  </button>
                </form>
                <form action={updateUserSuspensionAction}>
                  <input type="hidden" name="user_id" value={profile.id} />
                  <input type="hidden" name="is_suspended" value={String(profile.is_suspended)} />
                  <button
                    type="submit"
                    className="w-full rounded-full bg-brand-pink px-4 py-2 text-sm font-semibold text-ink-900"
                  >
                    {profile.is_suspended ? "Restore account" : "Suspend account"}
                  </button>
                </form>
                {profile.role !== "admin" && (
                  <form action={deleteUserAction}>
                    <input type="hidden" name="user_id" value={profile.id} />
                    <button
                      type="submit"
                      disabled={!canHardDelete}
                      className="w-full rounded-full border border-red-400/40 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Delete user
                    </button>
                  </form>
                )}
              </div>
            </article>
          );
        })}
        {users.length === 0 && (
          <p className="p-6 text-sm text-cream-200">No users match this filter.</p>
        )}
      </div>
    </AdminShell>
  );
}
