import { AdminShell } from "@/components/admin/AdminShell";
import { getAllLivestreams } from "@/lib/admin/queries";
import {
  createLivestreamAction,
  deleteLivestreamAction,
  updateLivestreamAction
} from "@/lib/admin/actions";

export default async function AdminSchedulePage() {
  const sessions = await getAllLivestreams();

  return (
    <AdminShell
      title="Livestream schedule"
      subtitle="Edit the entries shown on /study and the home page. Changes are immediate — no redeploy."
    >
      {/* Existing rows */}
      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
        {sessions.length === 0 && (
          <p className="p-6 text-sm text-cream-200">
            No livestream entries yet. Add one below.
          </p>
        )}

        {sessions.map((s) => (
          <article
            key={s.id}
            className={`border-b border-white/10 p-5 last:border-b-0 ${
              s.is_active ? "" : "opacity-60"
            }`}
          >
            <form action={updateLivestreamAction} className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_2fr_80px_100px_auto]">
              <input type="hidden" name="id" value={s.id} />
              <LabeledInput name="day_label"      defaultValue={s.day_label}      label="Day" />
              <LabeledInput name="time_label"     defaultValue={s.time_label}     label="Time" />
              <LabeledInput name="platform_label" defaultValue={s.platform_label} label="Platforms" />
              <LabeledInput name="topic"          defaultValue={s.topic}          label="Topic" />
              <LabeledInput name="sort_order"     defaultValue={String(s.sort_order)} label="Sort" type="number" />
              <label className="text-xs">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-butter">
                  Visible
                </span>
                <select
                  name="is_active"
                  defaultValue={String(s.is_active)}
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-[#221f1b] px-3 py-2 text-sm"
                >
                  <option value="true">Active</option>
                  <option value="false">Hidden</option>
                </select>
              </label>
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="rounded-full bg-brand-butter px-4 py-2 text-sm font-semibold text-ink-900"
                >
                  Save
                </button>
              </div>
            </form>

            <form action={deleteLivestreamAction} className="mt-3 flex justify-end">
              <input type="hidden" name="id" value={s.id} />
              <button
                type="submit"
                className="rounded-full border border-red-400/40 bg-red-500/15 px-4 py-1.5 text-xs font-semibold text-red-200 hover:bg-red-500/25"
              >
                Delete
              </button>
            </form>
          </article>
        ))}
      </div>

      {/* Add new */}
      <section className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-6">
        <h2 className="font-display text-3xl">Add a session</h2>
        <p className="mt-1 text-sm text-cream-200">
          Sort low → high. Hidden rows aren't shown on /study but stay editable here.
        </p>
        <form
          action={createLivestreamAction}
          className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_2fr_80px_100px_auto]"
        >
          <LabeledInput name="day_label"      placeholder="Monday"            label="Day" required />
          <LabeledInput name="time_label"     placeholder="8:00 AM CET"       label="Time" required />
          <LabeledInput name="platform_label" placeholder="YouTube · Twitch"  label="Platforms" defaultValue="YouTube · Twitch" />
          <LabeledInput name="topic"          placeholder="Cozy morning focus" label="Topic" required />
          <LabeledInput name="sort_order"     defaultValue="10"               label="Sort" type="number" />
          <label className="text-xs">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-butter">
              Visible
            </span>
            <select
              name="is_active"
              defaultValue="true"
              className="mt-1 w-full rounded-2xl border border-white/10 bg-[#221f1b] px-3 py-2 text-sm"
            >
              <option value="true">Active</option>
              <option value="false">Hidden</option>
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="rounded-full bg-brand-butter px-5 py-2 text-sm font-semibold text-ink-900"
            >
              Add
            </button>
          </div>
        </form>
      </section>
    </AdminShell>
  );
}

function LabeledInput({
  name,
  label,
  defaultValue,
  placeholder,
  type = "text",
  required
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="text-xs">
      <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-butter">
        {label}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="mt-1 w-full rounded-2xl border border-white/10 bg-[#221f1b] px-3 py-2 text-sm text-cream-50 placeholder:text-cream-300"
      />
    </label>
  );
}
