import Link from "next/link";
import PageShell from "@/components/PageShell";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updatePasswordAction } from "../actions";

export default async function ResetPasswordPage({
  searchParams
}: {
  searchParams?: { message?: string };
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <PageShell>
      <section className="mx-auto max-w-md px-6 py-20">
        <div className="rounded-[32px] border border-ink-900/10 bg-cream-50 p-8 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-700">
            Choose a new password
          </p>
          <h1 className="mt-3 font-display text-4xl text-ink-900">Set your password</h1>

          {user ? (
            <>
              <p className="mt-3 text-ink-700">
                Pick something at least 12 characters long. You will stay signed in
                afterwards.
              </p>

              {searchParams?.message && (
                <p className="mt-5 rounded-2xl bg-brand-butter/50 px-4 py-3 text-sm text-ink-900">
                  {searchParams.message}
                </p>
              )}

              <form action={updatePasswordAction} className="mt-7 space-y-4">
                <label className="block text-sm font-semibold text-ink-900">
                  New password
                  <input
                    required
                    minLength={12}
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    className="mt-2 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3 font-serif"
                    placeholder="At least 12 characters"
                  />
                </label>
                <label className="block text-sm font-semibold text-ink-900">
                  Confirm new password
                  <input
                    required
                    minLength={12}
                    type="password"
                    name="confirm_password"
                    autoComplete="new-password"
                    className="mt-2 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3 font-serif"
                    placeholder="Re-enter your new password"
                  />
                </label>
                <SubmitButton>Update password</SubmitButton>
              </form>
            </>
          ) : (
            <>
              <p className="mt-3 text-ink-700">
                This reset link is invalid or has expired. Request a fresh one and it
                will arrive by email.
              </p>
              <Link
                href="/forgot-password"
                className="btn-primary mt-7 inline-flex w-full items-center justify-center"
              >
                Request a new link
              </Link>
            </>
          )}

          <p className="mt-6 text-sm text-ink-700">
            Remembered it?{" "}
            <Link href="/login" className="font-semibold underline underline-offset-4">
              Back to log in
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
