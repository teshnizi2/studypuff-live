import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export default function ResourcesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Free resources"
        title="Tools for a calmer term."
        subtitle="Free printables, templates, and videos you can use. Made with love, backed by research."
        accent="mint"
      />

      <section className="relative pb-20">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          {/* Bento grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-6 md:auto-rows-[220px]">
            {/* StudyPuff App — featured */}
            <Reveal className="md:col-span-4 md:row-span-2">
              <Link
                href="/dashboard"
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-brand-butter p-8 transition hover:-translate-y-1 hover:shadow-soft"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-cream-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ink-900">
                      App · Free
                    </span>
                    <span className="rounded-full bg-ink-900 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cream-50">
                      Most used
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-3xl text-ink-900 sm:text-4xl">
                    StudyPuff App
                  </h3>
                  <p className="mt-3 max-w-[42ch] text-ink-900/80">
                    Log focus sessions, plan tasks, track topics, and join study rooms with
                    friends. Your full study workspace.
                  </p>
                  <ul className="mt-4 grid grid-cols-1 gap-1 text-sm text-ink-900/80 sm:grid-cols-2">
                    {[
                      "Pomodoro timer",
                      "Tasks + topics",
                      "Group study rooms",
                      "Realtime chat"
                    ].map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span aria-hidden className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-ink-900" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="font-display text-7xl text-ink-900/15 leading-none" aria-hidden>
                    🐑
                  </span>
                  <span className="btn-primary">
                    Open the app <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </Reveal>

            {/* Cornell template */}
            <Reveal className="md:col-span-2 md:row-span-1">
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-brand-pink p-6 transition hover:-translate-y-1 hover:shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-cream-50/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ink-900">
                    Template
                  </span>
                  <span className="text-3xl" aria-hidden>📝</span>
                </div>
                <h3 className="mt-4 font-display text-xl text-ink-900">
                  Cornell Note Taking Template
                </h3>
                <p className="mt-1 text-sm text-ink-900/80">
                  Turn every lecture into something you&apos;ll actually review later.
                </p>
                <Link href="/resources" className="mt-auto pt-3 text-sm font-semibold text-ink-900 underline-offset-4 hover:underline">
                  Download PDF →
                </Link>
              </article>
            </Reveal>

            {/* Exam checklist */}
            <Reveal className="md:col-span-2 md:row-span-1">
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-brand-mint p-6 transition hover:-translate-y-1 hover:shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-cream-50/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ink-900">
                    Checklist
                  </span>
                  <span className="text-3xl" aria-hidden>✅</span>
                </div>
                <h3 className="mt-4 font-display text-xl text-ink-900">Exam checklist</h3>
                <p className="mt-1 text-sm text-ink-900/80">
                  A short pre-exam check so nothing essential gets forgotten the night before.
                </p>
                <Link href="/resources" className="mt-auto pt-3 text-sm font-semibold text-ink-900 underline-offset-4 hover:underline">
                  Download PDF →
                </Link>
              </article>
            </Reveal>

            {/* Background sounds */}
            <Reveal className="md:col-span-2 md:row-span-1">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-brand-sky p-6 transition hover:-translate-y-1 hover:shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-cream-50/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ink-900">
                    Audio
                  </span>
                  <span className="text-3xl" aria-hidden>🌧️</span>
                </div>
                <h3 className="mt-4 font-display text-xl text-ink-900">Background sounds</h3>
                <p className="mt-1 text-sm text-ink-900/80">
                  Calm, real-time backgrounds we use during the livestreams.
                </p>
                <span className="mt-auto pt-3 inline-flex w-fit items-center gap-2 rounded-full bg-cream-50/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ink-900">
                  ⏳ Coming soon
                </span>
              </article>
            </Reveal>

            {/* Spaced repetition */}
            <Reveal className="md:col-span-2 md:row-span-1">
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-brand-lilac p-6 transition hover:-translate-y-1 hover:shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-cream-50/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ink-900">
                    Template
                  </span>
                  <span className="text-3xl" aria-hidden>🧠</span>
                </div>
                <h3 className="mt-4 font-display text-xl text-ink-900">
                  Spaced-repetition starter kit
                </h3>
                <p className="mt-1 text-sm text-ink-900/80">
                  Build flashcards that actually stick — templates and a written guide.
                </p>
                <Link href="/resources" className="mt-auto pt-3 text-sm font-semibold text-ink-900 underline-offset-4 hover:underline">
                  Download kit →
                </Link>
              </article>
            </Reveal>

            {/* Discord — wide community card */}
            <Reveal className="md:col-span-6 md:row-span-1">
              <a
                href="https://discord.gg/hb8bKpbjEz"
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col items-start justify-between overflow-hidden rounded-3xl bg-brand-peach p-6 transition hover:-translate-y-1 hover:shadow-soft sm:flex-row sm:items-center sm:gap-8"
              >
                <div className="flex items-center gap-5">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-50/70 text-3xl" aria-hidden>
                    💬
                  </span>
                  <div>
                    <span className="rounded-full bg-cream-50/70 px-3 py-0.5 text-xs font-semibold uppercase tracking-widest text-ink-900">
                      Community · Free
                    </span>
                    <h3 className="mt-2 font-display text-2xl text-ink-900">Join the Discord</h3>
                    <p className="text-sm text-ink-900/80">
                      Hang out with other StudyPuffs between livestreams. Share wins, ask for
                      accountability, find a study buddy.
                    </p>
                  </div>
                </div>
                <span className="btn-primary mt-4 sm:mt-0 sm:ml-auto">
                  Open Discord <span aria-hidden>→</span>
                </span>
              </a>
            </Reveal>
          </div>

          <Reveal className="mt-12 rounded-[28px] border border-ink-900/10 bg-cream-50 p-8 text-center shadow-soft">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-ink-700">Looking for more?</p>
            <h2 className="display-heading text-3xl text-ink-900 sm:text-4xl">
              Paid workshops go deeper, faster.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-700">
              Our cohorts take these free tools and build a full practice around them — with peer
              accountability and coach feedback.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/workshops" className="btn-primary">
                See workshops
              </Link>
              <Link href="/contact" className="btn-outline">
                Ask a question
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
