import Link from "next/link";
import PageShell from "@/components/PageShell";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { requestPasswordResetAction } from "../actions";

export default function ForgotPasswordPage({
  searchParams
}: {
  searchParams?: { message?: string; sent?: string };
}) {
  const sent = searchParams?.sent === "1";

  return (
    <PageShell>
      <section className="mx-auto max-w-md px-6 py-20">
        <div className="rounded-[32px] border border-ink-900/10 bg-cream-50 p-8 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-700">
            Forgot your password?
          </p>
          <h1 className="mt-3 font-display text-4xl text-ink-900">Reset it</h1>

          {sent ? (
            <>
              <p className="mt-3 text-ink-700">
                If an account matches that email or username, a link to set a new
                password is on its way. Check your inbox, and your spam folder too.
              </p>
              <p className="mt-5 rounded-2xl bg-brand-butter/50 px-4 py-3 text-sm text-ink-900">
                The link works on any device and expires after a while. Need
                another? Request one below.
              </p>
            </>
          ) : (
            <p className="mt-3 text-ink-700">
              Enter your email or username and we will send a link to set a new
              password.
            </p>
          )}

          {!sent && searchParams?.message && (
            <p className="mt-5 rounded-2xl bg-brand-butter/50 px-4 py-3 text-sm text-ink-900">
              {searchParams.message}
            </p>
          )}

          <form action={requestPasswordResetAction} className="mt-7 space-y-4">
            <label className="block text-sm font-semibold text-ink-900">
              Email or username
              <input
                required
                type="text"
                name="email"
                autoComplete="username"
                className="mt-2 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3 font-serif"
                placeholder="you@example.com  or  @username"
              />
            </label>
            <SubmitButton>{sent ? "Send another link" : "Send reset link"}</SubmitButton>
          </form>

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
