import Link from "next/link";
import PageShell from "@/components/PageShell";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { registerAction, signInWithGoogleAction } from "../actions";

export default function RegisterPage({
  searchParams
}: {
  searchParams?: { message?: string };
}) {
  return (
    <PageShell>
      <section className="mx-auto max-w-md px-6 py-20">
        <div className="rounded-[32px] border border-ink-900/10 bg-cream-50 p-8 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-700">
            Start studying
          </p>
          <h1 className="mt-3 font-display text-4xl text-ink-900">Create your account</h1>
          <p className="mt-3 text-ink-700">
            Your StudyPuff workspace keeps timer sessions, tasks, and settings synced.
          </p>

          {searchParams?.message && (
            <p className="mt-5 rounded-2xl bg-brand-butter/50 px-4 py-3 text-sm text-ink-900">
              {searchParams.message}
            </p>
          )}

          <form action={signInWithGoogleAction} className="mt-7">
            <input type="hidden" name="next" value="/dashboard" />
            <input type="hidden" name="oauth_source" value="register" />
            <SubmitButton className="btn-outline w-full font-semibold">
              Continue with Google
            </SubmitButton>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-ink-900/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] text-ink-700">
              <span className="bg-cream-50 px-3">or use email</span>
            </div>
          </div>

          <form action={registerAction} className="space-y-4">
            <label className="block text-sm font-semibold text-ink-900">
              Display name
              <input
                type="text"
                name="display_name"
                className="mt-2 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3 font-serif"
                placeholder="Study buddy"
              />
            </label>
            <label className="block text-sm font-semibold text-ink-900">
              Email
              <input
                required
                type="email"
                name="email"
                className="mt-2 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3 font-serif"
                placeholder="you@example.com"
              />
            </label>
            <label className="block text-sm font-semibold text-ink-900">
              Password
              <input
                required
                minLength={12}
                type="password"
                name="password"
                className="mt-2 w-full rounded-2xl border border-ink-900/15 bg-cream-100 px-4 py-3 font-serif"
                placeholder="At least 12 characters"
              />
            </label>
            <SubmitButton>Create account</SubmitButton>
          </form>

          <p className="mt-6 text-sm text-ink-700">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold underline underline-offset-4">
              Log in
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
