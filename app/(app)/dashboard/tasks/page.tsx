import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/lib/auth/guards";
import { createTaskAction, createTopicAction, toggleTaskAction } from "@/lib/app-data/actions";
import { getUserWorkspace } from "@/lib/app-data/queries";

export default async function TasksPage() {
  const { user, profile } = await requireUser();
  const workspace = await getUserWorkspace(user.id);

  return (
    <DashboardShell
      title="Tasks and topics"
      subtitle="Organize study work into topic groups and mark progress as you move through the day."
      profile={profile}
    >
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="space-y-6">
          <div className="rounded-[28px] border border-ink-900/10 bg-cream-50 p-6 shadow-soft">
            <h2 className="font-display text-3xl text-ink-900">New topic</h2>
            <form action={createTopicAction} className="mt-5 space-y-4">
              <input
                required
                name="name"
                className="w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3"
                placeholder="Biology, thesis, exam prep..."
              />
              <button type="submit" className="btn-outline w-full">
                Add topic
              </button>
            </form>
          </div>

          <div className="rounded-[28px] border border-ink-900/10 bg-cream-50 p-6 shadow-soft">
            <h2 className="font-display text-3xl text-ink-900">New task</h2>
            <form action={createTaskAction} className="mt-5 space-y-4">
              <input
                required
                name="text"
                className="w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3"
                placeholder="Review chapter 4"
              />
              <select name="topic_id" className="w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3">
                <option value="">No topic</option>
                {workspace.topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
              <select name="priority" className="w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3">
                <option value="normal">Normal priority</option>
                <option value="high">High priority</option>
                <option value="low">Low priority</option>
              </select>
              <input
                name="due_date"
                type="date"
                className="w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3"
              />
              <button type="submit" className="btn-primary w-full">
                Add task
              </button>
            </form>
          </div>
        </section>

        <section className="rounded-[28px] border border-ink-900/10 bg-cream-50 p-6 shadow-soft">
          <h2 className="font-display text-3xl text-ink-900">Your task list</h2>
          <div className="mt-5 space-y-3">
            {workspace.tasks.map((task) => (
              <article key={task.id} className="flex flex-col gap-3 rounded-2xl bg-cream-100 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className={`font-semibold ${task.done ? "text-ink-500 line-through" : "text-ink-900"}`}>
                    {task.text}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ink-700">
                    {task.priority} {task.due_date ? `· due ${task.due_date}` : ""}
                  </p>
                </div>
                <form action={toggleTaskAction}>
                  <input type="hidden" name="id" value={task.id} />
                  <input type="hidden" name="done" value={String(task.done)} />
                  <button type="submit" className="btn-outline px-4 py-2 text-sm">
                    {task.done ? "Reopen" : "Complete"}
                  </button>
                </form>
              </article>
            ))}
            {workspace.tasks.length === 0 && (
              <p className="rounded-2xl bg-cream-100 p-4 text-sm text-ink-700">
                Add your first task to start building a focused study queue.
              </p>
            )}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
