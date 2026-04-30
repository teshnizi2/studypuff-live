import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { TimerCircle } from "@/components/timer/TimerCircle";
import { requireUser } from "@/lib/auth/guards";
import { getUserWorkspace } from "@/lib/app-data/queries";
import { getMyRooms, joinRoomAction } from "@/lib/app-data/rooms";
import {
  addStudySessionAction,
  createTaskAction,
  createTopicAction,
  toggleTaskAction
} from "@/lib/app-data/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const { user, profile } = await requireUser();
  const workspace = await getUserWorkspace(user.id);
  const myRooms = await getMyRooms();
  const supabase = createSupabaseServerClient();
  const { data: equipped } = await supabase
    .from("user_settings")
    .select("equipped_sound, equipped_accessory")
    .eq("user_id", user.id)
    .single();

  const firstName = profile?.display_name || user.email?.split("@")[0] || "study buddy";
  const openTasks = workspace.tasks.filter((t) => !t.done).slice(0, 6);
  const activeRooms = myRooms.filter((r) => !r.ended_at).slice(0, 4);

  const focusMinutes = workspace.settings?.focus_minutes ?? 25;
  const shortBreakMinutes = workspace.settings?.short_break_minutes ?? 5;
  const longBreakMinutes = workspace.settings?.long_break_minutes ?? 20;
  const dailyGoal = workspace.settings?.daily_goal_minutes ?? 90;
  const goalPct = Math.min(100, Math.round((workspace.todayMinutes / dailyGoal) * 100));

  return (
    <DashboardShell
      title={`Hi, ${firstName}`}
      subtitle="One calm space — focus timer, today's tasks, your study rooms, and topics — all in reach."
      profile={profile}
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* LEFT: Timer + today snapshot */}
        <div className="space-y-6">
          <TimerCircle
            focusMinutes={focusMinutes}
            shortBreakMinutes={shortBreakMinutes}
            longBreakMinutes={longBreakMinutes}
            todayMinutes={workspace.todayMinutes}
            tasks={workspace.tasks.filter((t) => !t.done).map((t) => ({ id: t.id, text: t.text }))}
            topics={workspace.topics.map((t) => ({ id: t.id, name: t.name }))}
            onComplete={addStudySessionAction}
            equippedSound={equipped?.equipped_sound ?? null}
            equippedAccessory={equipped?.equipped_accessory ?? null}
          />

          {/* Today snapshot */}
          <section className="rounded-[28px] border border-ink-900/10 bg-cream-50 p-6 shadow-soft">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl text-ink-900">Today</h2>
              <span className="text-sm text-ink-700">
                {workspace.todayMinutes} / {dailyGoal} min
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-ink-900/10">
              <div
                className="h-full rounded-full bg-ink-900 transition-all"
                style={{ width: `${goalPct}%` }}
              />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
              <Mini label="Open tasks" value={String(workspace.tasks.filter((t) => !t.done).length)} />
              <Mini label="Topics" value={String(workspace.topics.length)} />
              <Mini label="Sessions today" value={String(workspace.sessions.filter((s) => s.studied_on === new Date().toISOString().slice(0, 10)).length)} />
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-sm">
              <Link href="/dashboard/stats" className="btn-outline px-4 py-2">
                Full stats
              </Link>
              <Link href="/dashboard/rewards" className="btn-outline px-4 py-2">
                Rewards shop
              </Link>
            </div>
          </section>
        </div>

        {/* RIGHT: tasks + rooms + topics */}
        <div className="space-y-6">
          {/* Quick add task */}
          <section className="rounded-[28px] border border-ink-900/10 bg-cream-50 p-6 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl text-ink-900">Today&apos;s tasks</h2>
              <Link href="/dashboard/tasks" className="text-xs font-semibold uppercase tracking-widest text-ink-700 hover:text-ink-900">
                See all →
              </Link>
            </div>

            <form action={createTaskAction} className="mt-4 flex gap-2">
              <input
                name="text"
                required
                maxLength={280}
                placeholder="Add a task and press enter"
                className="flex-1 rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-2.5 text-sm"
              />
              <select
                name="priority"
                defaultValue="normal"
                className="rounded-2xl border border-ink-900/15 bg-cream-100 px-3 py-2.5 text-sm"
                aria-label="Priority"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
              <button type="submit" className="btn-primary px-4 py-2.5 text-sm">
                Add
              </button>
            </form>

            <ul className="mt-4 space-y-2">
              {openTasks.length === 0 && (
                <li className="rounded-2xl bg-cream-100 px-4 py-3 text-sm text-ink-700">
                  Inbox zero. Add your first task above.
                </li>
              )}
              {openTasks.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-cream-100 px-4 py-2.5 text-sm"
                >
                  <form action={toggleTaskAction} className="flex flex-1 items-center gap-3">
                    <input type="hidden" name="id" value={t.id} />
                    <input type="hidden" name="done" value={String(t.done)} />
                    <button
                      type="submit"
                      className="flex h-5 w-5 items-center justify-center rounded-full border border-ink-900/30 hover:bg-ink-900/10"
                      aria-label="Mark complete"
                    >
                      &nbsp;
                    </button>
                    <span className="flex-1 text-ink-900">{t.text}</span>
                  </form>
                  <span className="text-[10px] uppercase tracking-widest text-ink-700">
                    {t.priority}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Study rooms */}
          <section className="rounded-[28px] border border-ink-900/10 bg-cream-50 p-6 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl text-ink-900">Study rooms</h2>
              <Link href="/dashboard/rooms" className="text-xs font-semibold uppercase tracking-widest text-ink-700 hover:text-ink-900">
                Manage →
              </Link>
            </div>
            <form action={joinRoomAction} className="mt-4 flex gap-2">
              <input
                name="code"
                required
                maxLength={8}
                placeholder="Join with code"
                className="flex-1 rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-2.5 text-sm uppercase tracking-[0.3em]"
              />
              <button type="submit" className="btn-primary px-4 py-2.5 text-sm">
                Join
              </button>
            </form>

            {activeRooms.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {activeRooms.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/dashboard/rooms/${r.id}`}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-cream-100 px-4 py-2.5 text-sm transition hover:bg-cream-50"
                    >
                      <span className="font-semibold text-ink-900">{r.name}</span>
                      <span className="font-mono text-xs tracking-[0.3em] text-ink-700">
                        {r.code}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 rounded-2xl bg-cream-100 px-4 py-3 text-sm text-ink-700">
                Create a room or join one to study together with friends.
              </p>
            )}

            <Link
              href="/dashboard/rooms"
              className="btn-outline mt-3 inline-flex w-fit px-4 py-2 text-sm"
            >
              + New room
            </Link>
          </section>

          {/* Topics */}
          <section className="rounded-[28px] border border-ink-900/10 bg-cream-50 p-6 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl text-ink-900">Topics</h2>
            </div>
            <form action={createTopicAction} className="mt-4 flex gap-2">
              <input
                name="name"
                required
                maxLength={120}
                placeholder="Add a topic (e.g. Calculus)"
                className="flex-1 rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-2.5 text-sm"
              />
              <button type="submit" className="btn-primary px-4 py-2.5 text-sm">
                Add
              </button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              {workspace.topics.length === 0 ? (
                <p className="text-sm text-ink-700">
                  Group your study with a few topics — they show up in the timer task picker.
                </p>
              ) : (
                workspace.topics.map((t) => (
                  <span
                    key={t.id}
                    className="rounded-full bg-cream-100 px-4 py-2 text-sm text-ink-900"
                  >
                    {t.name}
                  </span>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-cream-100 p-3">
      <p className="text-xs uppercase tracking-[0.16em] text-ink-700">{label}</p>
      <p className="mt-1 font-display text-2xl text-ink-900">{value}</p>
    </div>
  );
}
