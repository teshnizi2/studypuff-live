import Link from "next/link";
import { Heart, ArrowRight, Sparkles, Clock, Users } from "lucide-react";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

const SCHOLARSHIP_FORM = "https://forms.gle/12W2jhcPdtPEbt4X8";

// What the toolkit promises — three small reassurance points under the hero.
const HIGHLIGHTS = [
  {
    Icon: Clock,
    title: "Two focused hours",
    body: "No theory overload. One session, straight to what works for you.",
    tone: "bg-brand-sky text-sky-800"
  },
  {
    Icon: Sparkles,
    title: "A plan built around you",
    body: "You leave with a personalised plan and real tools you can use the same day.",
    tone: "bg-brand-butter text-amber-700"
  },
  {
    Icon: Users,
    title: "Cohorts of 30 max",
    body: "Small rooms so we actually notice you, plus 30 days of support after.",
    tone: "bg-brand-mint text-emerald-800"
  }
];

export default function WorkshopsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Workshops · cohorts of 30 max"
        title="StudyPuff Toolkit"
        subtitle="One two-hour workshop built around you. Not just advice, but a personalised plan and real tools you can use straight away."
        accent="butter"
      />

      {/* Primary CTA → the workshops listing */}
      <section className="relative -mt-6 pb-4">
        <div className="mx-auto max-w-[900px] px-6 text-center lg:px-10">
          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/workshops/explore" className="btn-primary">
                Explore workshops
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </Link>
              <a
                href={SCHOLARSHIP_FORM}
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
              >
                Apply for a scholarship seat
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Highlights */}
      <section className="relative py-14 lg:py-20">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {HIGHLIGHTS.map((h, i) => (
              <Reveal key={h.title} delay={i * 80}>
                <div className="h-full rounded-3xl border border-ink-900/10 bg-cream-50 p-6">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${h.tone}`}>
                    <h.Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="mt-3 font-display text-lg text-ink-900">{h.title}</h3>
                  <p className="mt-2 text-sm text-ink-700">{h.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="mt-10 text-center">
              <Link
                href="/workshops/explore"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 underline underline-offset-4 decoration-[#c97f72] hover:text-[#c97f72]"
              >
                See the workshops
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cozy community, not a bootcamp */}
      <section className="relative py-16 lg:py-20">
        <div className="mx-auto max-w-[900px] px-6 text-center lg:px-10">
          <Reveal>
            <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-pink text-rose-700">
              <Heart className="h-6 w-6" strokeWidth={1.75} aria-hidden />
            </span>
            <p className="eyebrow-squiggle mb-3 inline-flex flex-col items-center text-xs uppercase tracking-[0.25em] text-ink-700">
              A cozy community
            </p>
            <h2 className="display-heading mt-3 text-3xl text-ink-900 sm:text-4xl">
              A cozy community, <em className="italic">not a bootcamp</em>.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-ink-700">
              Every cohort has scholarship seats. If the price is a problem, just write to us via
              the contact form — no judgement, no application essay.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <a href={SCHOLARSHIP_FORM} target="_blank" rel="noreferrer" className="btn-primary">
                Apply for a scholarship seat
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
