import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

const TIERS = [
  {
    name: "Focus Foundations",
    price: "€49",
    cadence: "one-time",
    tone: "bg-brand-pink",
    tagline: "The starter workshop — everything you wish school had taught you.",
    bullets: [
      "3 live sessions + lifetime replay",
      "The Attention Toolkit (PDF + worksheets)",
      "Deep-work playlists and printable timer",
      "14-day refund window"
    ],
    featured: false
  },
  {
    name: "Exam Survival Cohort",
    price: "€129",
    cadence: "4-week cohort",
    tone: "bg-brand-butter",
    tagline: "Prep your next finals without the 2am spiral. Most popular.",
    bullets: [
      "6 live workshops (recorded)",
      "Weekly peer-accountability rooms",
      "Personal study plan review",
      "Spaced-repetition deck templates",
      "Office hours with a StudyPuff coach"
    ],
    featured: true
  },
  {
    name: "Year-Long Atelier",
    price: "€299",
    cadence: "per school year",
    tone: "bg-brand-sky",
    tagline: "Ongoing coaching for students who want to rebuild how they work.",
    bullets: [
      "Everything in Exam Survival",
      "Monthly 1:1 coaching call",
      "Private community + tutor office hours",
      "Early access to new workshops",
      "Printed planner shipped every term"
    ],
    featured: false
  }
];

const MODULES = [
  { n: "01", title: "Attention as a muscle", body: "Spot the habits that wreck your focus, and install a 25/5 rhythm that actually sticks." },
  { n: "02", title: "The memory curve", body: "Use active recall and spaced repetition to get more out of half the study time." },
  { n: "03", title: "Plan without fighting yourself", body: "Turn vague goals into 90-minute blocks — with built-in slack for the messy days." },
  { n: "04", title: "The rest is the work", body: "Sleep, breaks, nutrition, movement: the boring reasons smart students outperform." }
];

export default function WorkshopsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Workshops"
        title="Research-backed study workshops, taught like a good friend explains it."
        subtitle="Tiny cohorts, live sessions, practical homework. Built for students, IB candidates, and undergrads who want to actually enjoy the work again."
        accent="butter"
      />

      {/* Curriculum */}
      <section className="relative py-12 lg:py-20">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
          <Reveal className="mb-10 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-ink-700">
              The curriculum
            </p>
            <h2 className="display-heading text-3xl text-ink-900 sm:text-5xl">
              Four modules. Not a minute of filler.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {MODULES.map((m, i) => (
              <Reveal key={m.n} delay={i * 80}>
                <div className="h-full rounded-3xl border border-ink-900/10 bg-cream-50 p-8 transition hover:-translate-y-1 hover:shadow-soft">
                  <span className="font-display text-3xl text-ink-900/40">{m.n}</span>
                  <h3 className="mt-3 font-display text-2xl text-ink-900">{m.title}</h3>
                  <p className="mt-4 text-ink-700">{m.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="relative py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <Reveal className="mb-10 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-ink-700">
              Pick your workshop
            </p>
            <h2 className="display-heading text-3xl text-ink-900 sm:text-5xl">
              Three ways to enroll.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {TIERS.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <article
                  className={`flex h-full flex-col rounded-3xl p-8 ring-1 ring-ink-900/10 ${t.tone} ${
                    t.featured ? "scale-[1.02] shadow-soft" : ""
                  } transition hover:-translate-y-1`}
                >
                  {t.featured && (
                    <span className="mb-4 w-fit rounded-full bg-ink-900 px-3 py-1 text-xs uppercase tracking-widest text-cream-50">
                      Most popular
                    </span>
                  )}
                  <h3 className="font-display text-2xl text-ink-900">{t.name}</h3>
                  <p className="mt-2 text-sm text-ink-700">{t.tagline}</p>
                  <p className="mt-6 flex items-baseline gap-2">
                    <span className="font-display text-4xl text-ink-900">{t.price}</span>
                    <span className="text-sm text-ink-700">/ {t.cadence}</span>
                  </p>
                  <ul className="mt-6 flex-1 space-y-2 text-sm text-ink-900/80">
                    {t.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span aria-hidden className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-ink-900" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`mt-8 ${t.featured ? "btn-primary" : "btn-outline"}`}
                  >
                    Enroll now
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
