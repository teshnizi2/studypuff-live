import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/lib/auth/guards";
import {
  removeAvatarAction,
  updateProfileAction,
  uploadAvatarAction
} from "@/lib/app-data/actions";

export default async function ProfilePage() {
  const { user, profile } = await requireUser();

  return (
    <DashboardShell
      title="Your profile"
      subtitle="Tell other StudyPuff learners who you are. All fields are optional."
      profile={profile}
    >
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-[28px] border border-ink-900/10 bg-cream-50 p-6 shadow-soft">
          <h2 className="font-display text-3xl text-ink-900">Avatar</h2>
          <div className="mt-5 flex flex-col items-center gap-4">
            <div className="h-32 w-32 overflow-hidden rounded-full border border-ink-900/10 bg-cream-100">
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name || "Avatar"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-4xl text-ink-700">
                  {(profile?.display_name || user.email || "?").charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <form
              action={uploadAvatarAction}
              encType="multipart/form-data"
              className="w-full space-y-3"
            >
              <input
                type="file"
                name="avatar"
                accept="image/png,image/jpeg,image/webp,image/gif"
                required
                className="block w-full text-sm text-ink-700 file:mr-3 file:rounded-full file:border-0 file:bg-brand-butter file:px-4 file:py-2 file:font-semibold file:text-ink-900 hover:file:opacity-90"
              />
              <button type="submit" className="btn-primary w-full">
                Upload new
              </button>
              <p className="text-xs text-ink-700">PNG, JPG, WEBP or GIF. 5 MB max.</p>
            </form>

            {profile?.avatar_url && (
              <form action={removeAvatarAction}>
                <button type="submit" className="btn-outline">
                  Remove avatar
                </button>
              </form>
            )}
          </div>
        </section>

        <section className="rounded-[28px] border border-ink-900/10 bg-cream-50 p-6 shadow-soft">
          <h2 className="font-display text-3xl text-ink-900">Personal info</h2>
          <p className="mt-2 text-sm text-ink-700">Email: {user.email}</p>

          <form action={updateProfileAction} className="mt-5 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                name="display_name"
                label="Display name"
                defaultValue={profile?.display_name || ""}
                placeholder="How you appear to others"
              />
              <Field
                name="username"
                label="Username"
                defaultValue={profile?.username || ""}
                placeholder="lowercase, 3–24 chars"
                hint="Letters, numbers, underscore"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field
                name="pronouns"
                label="Pronouns"
                defaultValue={profile?.pronouns || ""}
                placeholder="e.g. she/her"
                maxLength={40}
              />
              <Field
                name="study_field"
                label="Studying"
                defaultValue={profile?.study_field || ""}
                placeholder="e.g. Computer Science"
                maxLength={80}
              />
            </div>

            <Field
              name="birthday"
              label="Birthday"
              type="date"
              defaultValue={profile?.birthday || ""}
            />

            <label className="block text-sm font-semibold text-ink-900">
              Bio
              <textarea
                name="bio"
                defaultValue={profile?.bio || ""}
                maxLength={500}
                rows={4}
                placeholder="A short blurb about you (max 500 chars)"
                className="mt-2 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3"
              />
            </label>

            <button type="submit" className="btn-primary w-fit">
              Save profile
            </button>
          </form>
        </section>
      </div>
    </DashboardShell>
  );
}

function Field({
  name,
  label,
  defaultValue,
  placeholder,
  hint,
  type = "text",
  maxLength
}: {
  name: string;
  label: string;
  defaultValue: string;
  placeholder?: string;
  hint?: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <label className="block text-sm font-semibold text-ink-900">
      {label}
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        maxLength={maxLength}
        className="mt-2 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3"
      />
      {hint && <span className="mt-1 block text-xs font-normal text-ink-700">{hint}</span>}
    </label>
  );
}
