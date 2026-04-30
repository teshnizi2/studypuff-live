import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/lib/auth/guards";
import { updateProfileAction, updateSettingsAction } from "@/lib/app-data/actions";
import { getUserWorkspace } from "@/lib/app-data/queries";

export default async function SettingsPage() {
  const { user, profile } = await requireUser();
  const workspace = await getUserWorkspace(user.id);
  const settings = workspace.settings;

  return (
    <DashboardShell
      title="Settings"
      subtitle="Tune your StudyPuff defaults for focus sessions, breaks, and profile display."
      profile={profile}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[28px] border border-ink-900/10 bg-cream-50 p-6 shadow-soft">
          <h2 className="font-display text-3xl text-ink-900">Profile</h2>
          <form action={updateProfileAction} className="mt-5 space-y-4">
            <label className="block text-sm font-semibold text-ink-900">
              Display name
              <input
                name="display_name"
                defaultValue={profile?.display_name || ""}
                className="mt-2 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3"
              />
            </label>
            <p className="text-sm text-ink-700">Email: {user.email}</p>
            <button type="submit" className="btn-outline">
              Save profile
            </button>
          </form>
        </section>

        <section className="rounded-[28px] border border-ink-900/10 bg-cream-50 p-6 shadow-soft">
          <h2 className="font-display text-3xl text-ink-900">Timer preferences</h2>
          <form action={updateSettingsAction} className="mt-5 grid gap-4">
            <NumberField name="focus_minutes" label="Focus minutes" defaultValue={settings?.focus_minutes || 25} />
            <NumberField name="short_break_minutes" label="Short break minutes" defaultValue={settings?.short_break_minutes || 5} />
            <NumberField name="long_break_minutes" label="Long break minutes" defaultValue={settings?.long_break_minutes || 20} />
            <NumberField name="daily_goal_minutes" label="Daily goal minutes" defaultValue={settings?.daily_goal_minutes || 90} />
            <label className="block text-sm font-semibold text-ink-900">
              Ambient sound
              <select
                name="ambient"
                defaultValue={settings?.ambient || "library"}
                className="mt-2 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3"
              >
                <option value="library">Library</option>
                <option value="rain">Rain</option>
                <option value="forest">Forest</option>
                <option value="silent">Silent</option>
              </select>
            </label>
            <label className="flex items-center gap-3 text-sm font-semibold text-ink-900">
              <input name="dark_mode" type="checkbox" defaultChecked={settings?.dark_mode || false} />
              Prefer dark mode
            </label>
            <label className="flex items-center gap-3 text-sm font-semibold text-ink-900">
              <input name="auto_cycle" type="checkbox" defaultChecked={settings?.auto_cycle || false} />
              Auto-cycle focus and breaks
            </label>
            <label className="flex items-center gap-3 text-sm font-semibold text-ink-900">
              <input name="chime" type="checkbox" defaultChecked={settings?.chime ?? true} />
              Play session chime
            </label>
            <button type="submit" className="btn-primary">
              Save settings
            </button>
          </form>
        </section>
      </div>
    </DashboardShell>
  );
}

function NumberField({
  name,
  label,
  defaultValue
}: {
  name: string;
  label: string;
  defaultValue: number;
}) {
  return (
    <label className="block text-sm font-semibold text-ink-900">
      {label}
      <input
        name={name}
        type="number"
        min="1"
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3"
      />
    </label>
  );
}
