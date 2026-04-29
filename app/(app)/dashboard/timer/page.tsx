import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/lib/auth/guards";
import { addStudySessionAction } from "@/lib/app-data/actions";
import { getUserWorkspace } from "@/lib/app-data/queries";

export default async function TimerPage() {
  const { user } = await requireUser();
  const workspace = await getUserWorkspace(user.id);
  const focusMinutes = workspace.settings?.focus_minutes || 25;

  return (
    <DashboardShell
      title="Focus timer"
      subtitle="Log focused study blocks with optional topic, task, and focus score."
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[32px] border border-ink-900/10 bg-cream-50 p-8 text-center shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink-700">
            Suggested focus block
          </p>
          <p className="mt-6 font-display text-8xl text-ink-900">{focusMinutes}</p>
          <p className="mt-2 text-ink-700">minutes</p>
          <p className="mx-auto mt-6 max-w-sm text-sm text-ink-700">
            This MVP records completed sessions. A live countdown can be layered on after the database-backed flow is stable.
          </p>
        </section>

        <section className="rounded-[32px] border border-ink-900/10 bg-cream-50 p-8 shadow-soft">
          <h2 className="font-display text-3xl text-ink-900">Record a session</h2>
          <form action={addStudySessionAction} className="mt-6 grid gap-4">
            <label className="text-sm font-semibold text-ink-900">
              Minutes
              <input
                name="minutes"
                type="number"
                min="1"
                max="1440"
                defaultValue={focusMinutes}
                className="mt-2 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3"
              />
            </label>
            <label className="text-sm font-semibold text-ink-900">
              Mode
              <select name="mode" className="mt-2 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3">
                <option value="focus">Focus</option>
                <option value="short">Short break</option>
                <option value="long">Long break</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-ink-900">
              Topic
              <select name="topic_name" className="mt-2 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3">
                <option value="">General study</option>
                {workspace.topics.map((topic) => (
                  <option key={topic.id} value={topic.name}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold text-ink-900">
              Task label
              <input
                name="task_name"
                className="mt-2 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3"
                placeholder="Optional task or chapter"
              />
            </label>
            <label className="text-sm font-semibold text-ink-900">
              Focus score
              <select name="focus_score" className="mt-2 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3">
                <option value="">Skip</option>
                <option value="5">5 - Deep focus</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Okay</option>
                <option value="2">2 - Distracted</option>
                <option value="1">1 - Hard day</option>
              </select>
            </label>
            <button type="submit" className="btn-primary">
              Save session
            </button>
          </form>
        </section>
      </div>
    </DashboardShell>
  );
}
