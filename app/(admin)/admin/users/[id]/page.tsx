import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getUserDetail } from "@/lib/admin/queries";
import {
  adminAdjustCoinsAction,
  adminResetPasswordAction,
  deleteUserAction,
  updateUserRoleAction,
  updateUserSuspensionAction
} from "@/lib/admin/actions";
import { hasAdminEnv } from "@/lib/supabase/admin";

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const detail = await getUserDetail(params.id);
  if (!detail) notFound();

  const { profile, settings, sessions, focusSessionCount, totalFocusMinutes, streak, tasks, topics, ownedRooms, joinedRooms } = detail;
  const canHardDelete = hasAdminEnv();

  const completedTasks = tasks.filter((t) => t.done).length;
  const initial = (profile.display_name || profile.email || "?").charAt(0).toUpperCase();

  return (
    <AdminShell
      title={profile.display_name || profile.email}
      subtitle={`User detail · ${profile.email}`}
    >
      <div className="mb-6 flex items-center gap-4 text-sm">
        <Link href="/admin/users" className="text-cream-200 underline-offset-4 hover:underline">
          ← All users
        </Link>
        <span className="text-cream-200">·</span>
        <span className="uppercase tracking-[0.16em] text-brand-butter">{profile.role}</span>
        {profile.is_suspended && <span className="rounded-full bg-brand-pink/20 px-3 py-1 text-xs text-brand-pink">Suspended</span>}
      </div>

      {/* Identity */}
      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
        <div className="flex items-start gap-5">
          <span className="flex h-16 w-16 flex-none items-center justify-center overflow-hidden rounded-full bg-brand-butter text-2xl font-semibold text-ink-900">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              initial
            )}
          </span>
          <div className="flex-1">
            <h2 className="font-display text-3xl">{profile.display_name || "Unnamed"}</h2>
            <p className="mt-1 text-sm text-cream-200">{profile.email}{profile.username ? ` · @${profile.username}` : ""}</p>
            {profile.bio && <p className="mt-3 text-sm text-cream-100">{profile.bio}</p>}
            <dl className="mt-4 grid gap-2 text-sm text-cream-200 sm:grid-cols-2">
              <Field label="Joined" value={new Date(profile.created_at).toLocaleString()} />
              <Field label="Last seen" value={profile.last_seen_at ? new Date(profile.last_seen_at).toLocaleString() : "never"} />
              <Field label="Study field" value={profile.study_field || "—"} />
              <Field label="School" value={profile.school || "—"} />
              <Field label="City" value={profile.city || "—"} />
              <Field label="User id" value={profile.id} />
            </dl>
          </div>
        </div>
      </section>

      {/* Stat tiles */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total focus minutes" value={totalFocusMinutes} />
        <Stat label="Lifetime (settings)" value={settings?.lifetime_focus_minutes ?? 0} />
        <Stat label="Focus sessions" value={focusSessionCount} />
        <Stat label="Day streak" value={streak} />
        <Stat label="Coins" value={settings?.coins ?? 0} />
        <Stat label="Daily goal · min" value={settings?.daily_goal_minutes ?? 0} />
        <Stat label="Tasks done" value={completedTasks} />
        <Stat label="Tasks total" value={tasks.length} />
      </div>

      {/* Admin controls */}
      <section className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-6">
        <h2 className="font-display text-3xl">Admin controls</h2>
        {!canHardDelete && (
          <p className="mt-3 text-sm text-cream-200">
            Hard delete is disabled — set <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> in Vercel.
          </p>
        )}
        <div className="mt-5 grid gap-3 md:grid-cols-3">
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
              Save role
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
                Delete user (cascades)
              </button>
            </form>
          )}
        </div>

        {/* Service-role-only ops: reset password + adjust coins. */}
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <form action={adminResetPasswordAction} className="flex flex-wrap gap-2">
            <input type="hidden" name="user_id" value={profile.id} />
            <input
              type="password"
              name="new_password"
              required
              minLength={6}
              placeholder="New password (min 6 chars)"
              className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-[#221f1b] px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={!canHardDelete}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset password
            </button>
          </form>
          <form action={adminAdjustCoinsAction} className="flex flex-wrap gap-2">
            <input type="hidden" name="user_id" value={profile.id} />
            <input
              type="number"
              name="delta"
              required
              placeholder="±coins (e.g. 100 or -50)"
              className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-[#221f1b] px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={!canHardDelete}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              Adjust coins
            </button>
          </form>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent sessions */}
        <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h2 className="font-display text-3xl">Recent sessions · 50 most recent</h2>
          {sessions.length === 0 ? (
            <p className="mt-5 text-sm text-cream-200">No sessions logged.</p>
          ) : (
            <ul className="mt-5 max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {sessions.map((s) => (
                <li key={s.id} className="grid grid-cols-[auto_1fr_auto] items-baseline gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm">
                  <span className="font-mono text-xs uppercase tracking-widest text-brand-butter">{s.mode}</span>
                  <span className="truncate text-cream-100">
                    {s.topic_name || s.task_name || "General"}
                  </span>
                  <span className="text-cream-200 tabular-nums">
                    {s.minutes}m · {new Date(s.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Tasks */}
        <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h2 className="font-display text-3xl">Tasks · {tasks.length}</h2>
          <p className="mt-1 text-xs text-cream-200">{topics.length} topics · {completedTasks} done</p>
          {tasks.length === 0 ? (
            <p className="mt-5 text-sm text-cream-200">No tasks.</p>
          ) : (
            <ul className="mt-5 max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {tasks.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm">
                  <span className={t.done ? "text-cream-300 line-through" : "text-cream-100"}>
                    {t.text}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest text-cream-200">
                    {t.priority}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Owned rooms */}
        <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h2 className="font-display text-3xl">Rooms owned · {ownedRooms.length}</h2>
          {ownedRooms.length === 0 ? (
            <p className="mt-5 text-sm text-cream-200">Never created a room.</p>
          ) : (
            <ul className="mt-5 space-y-2">
              {ownedRooms.map((r) => (
                <li key={r.id} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm">
                  <div>
                    <p className="font-semibold">{r.name}</p>
                    <p className="font-mono text-xs uppercase tracking-widest text-cream-200">
                      {r.code} · {r.ended_at ? "ended" : r.is_open ? "open" : "closed"}
                    </p>
                  </div>
                  <p className="text-xs text-cream-200">{new Date(r.created_at).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Joined rooms (not owned) */}
        <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h2 className="font-display text-3xl">Rooms joined · {joinedRooms.length}</h2>
          {joinedRooms.length === 0 ? (
            <p className="mt-5 text-sm text-cream-200">Hasn't joined anyone else's room.</p>
          ) : (
            <ul className="mt-5 space-y-2">
              {joinedRooms.map((r) => (
                <li key={r.id} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm">
                  <div>
                    <p className="font-semibold">{r.name}</p>
                    <p className="font-mono text-xs uppercase tracking-widest text-cream-200">
                      {r.code} · {r.ended_at ? "ended" : r.is_open ? "open" : "closed"}
                    </p>
                  </div>
                  <p className="text-xs text-cream-200">{new Date(r.created_at).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-butter">{label}</dt>
      <dd className="mt-1 truncate font-mono text-xs text-cream-100">{value}</dd>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <article className="rounded-[20px] border border-white/10 bg-white/5 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-butter">{label}</p>
      <p className="mt-2 font-display text-3xl tabular-nums">{value}</p>
    </article>
  );
}
