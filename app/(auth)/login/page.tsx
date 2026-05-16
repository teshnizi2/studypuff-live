import Link from "next/link";
import PageShell from "@/components/PageShell";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { loginAction, signInWithGoogleAction } from "../actions";

export default function LoginPage({
  searchParams
}: {
  searchParams?: { message?: string; next?: string };
}) {
  const next = searchParams?.next || "/dashboard";

  return (
    <PageShell>
      <section className="mx-auto max-w-md px-6 py-20">
        <div className="rounded-[32px] border border-ink-900/10 bg-cream-50 p-8 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-700">
            Welcome back
          </p>
          <h1 className="mt-3 font-display text-4xl text-ink-900">Log in to StudyPuff</h1>
          <p className="mt-3 text-ink-700">
            Continue to your timer, tasks, sessions, and study dashboard.
          </p>

          {searchParams?.message && (
            <p className="mt-5 rounded-2xl bg-brand-butter/50 px-4 py-3 text-sm text-ink-900">
              {searchParams.message}
            </p>
          )}

          <form action={signInWithGoogleAction} className="mt-7">
            <input type="hidden" name="next" value={next} />
            <input type="hidden" name="oauth_source" value="login" />
            <SubmitButton className="btn-outline w-full font-semibold">
              Continue with Google
            </SubmitButton>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-ink-900/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] text-ink-700">
              <span className="bg-cream-50 px-3">or use email / username</span>
            </div>
          </div>

          <form action={loginAction} className="space-y-4">
            <input type="hidden" name="next" value={next} />
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
            <label className="block text-sm font-semibold text-ink-900">
              Password
              <input
                required
                type="password"
                name="password"
                className="mt-2 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3 font-serif"
                placeholder="At least 12 characters"
              />
            </label>
            <SubmitButton>Log in</SubmitButton>
          </form>

          <p className="mt-6 text-sm text-ink-700">
            No account yet?{" "}
            <Link href="/register" className="font-semibold underline underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
