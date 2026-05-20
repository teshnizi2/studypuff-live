import Link from "next/link";
import { Check, ArrowLeft } from "lucide-react";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

const SIGNUP_FORM = "https://forms.gle/TGCDTSKsyyGGaiy16";
const SCHOLARSHIP_FORM = "https://forms.gle/12W2jhcPdtPEbt4X8";

type Workshop = {
  name: string;
  subhead: string;
  body: string;
  bullets: string[];
  tone: string;
};

const WORKSHOPS: Workshop[] = [
  {
    name: "Time Management Toolkit",
    subhead: "Take back control of your days, and actually feel on top of things.",
    body: "Feeling like there's never enough time is one of the most common struggles students face. This workshop helps you figure out exactly where your time is going, and gives you a system to change it. You'll leave with a clear, personalised 30-day plan you can start using immediately.",
    bullets: [
      "Your personal workbook to use during and after the session",
      "Discover what's actually getting in the way of your time",
      "Try proven time management methods hands-on",
      "Walk away with a personalised 30-day plan, ready to use and test from day one",
      "30 days of post-workshop support so you stay on track"
    ],
    tone: "bg-brand-sky"
  },
  {
    name: "Effective Studying Toolkit",
    subhead: "Study less, retain more and finally stop dreading revision.",
    body: "Most students study hard. Not many study smart. This workshop helps you understand how you personally learn best, then gives you a toolkit of evidence-based techniques to match. Less time at your desk, better results and a lot less stress.",
    bullets: [
      "Understand how you learn best and what's been holding you back",
      "Try evidence-based study techniques hands-on during the session",
      "Walk away with a personalised study toolkit built around your needs",
      "30 days of support so the results actually stick"
    ],
    tone: "bg-brand-butter"
  }
];

export default function WorkshopsExplorePage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="StudyPuff Toolkit · our workshops"
        title="Knowing what to do is one thing. Doing it is another."
        subtitle="Our workshops skip the theory overload and get straight to what works for you. In two hours, you'll walk away with a personalised plan, hands-on experience with proven methods, and the support to keep it going."
        accent="sky"
      />

      <section className="relative pb-16 lg:pb-24">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
          {/* Bundle strip */}
          <Reveal>
            <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-ink-900/10 bg-brand-mint/60 px-6 py-5 text-center sm:flex-row sm:text-left">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-700">
                  Bundle deal
                </p>
                <p className="mt-1 font-display text-2xl text-ink-900">
                  Take both workshops · <span className="italic">€15</span>{" "}
                  <span className="align-middle text-base text-ink-700 line-through">€10 + €10</span>
                </p>
                <p className="mt-1 text-sm text-ink-700">Save €5 when you sign up for both.</p>
              </div>
              <a href={SIGNUP_FORM} target="_blank" rel="noreferrer" className="btn-primary shrink-0">
                Secure your spot
              </a>
            </div>
          </Reveal>

          {/* One rectangle per workshop */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {WORKSHOPS.map((w, i) => (
              <Reveal key={w.name} delay={i * 100}>
                <article
                  className={`flex h-full flex-col rounded-3xl p-8 ring-1 ring-ink-900/10 ${w.tone} transition hover:-translate-y-1`}
                >
                  <span className="mb-3 w-fit rounded-full bg-cream-50 px-3 py-1 text-xs uppercase tracking-widest text-ink-900">
                    Single session · Starter
                  </span>
                  <h2 className="font-display text-2xl text-ink-900 sm:text-3xl">{w.name}</h2>
                  <p className="mt-2 text-base font-semibold text-ink-900">{w.subhead}</p>
                  <p className="mt-4 text-sm leading-relaxed text-ink-700">{w.body}</p>

                  <p className="mt-6 flex items-baseline gap-2">
                    <span className="font-display text-4xl text-ink-900">€10</span>
                    <span className="text-sm text-ink-700">/ 2-hour workshop</span>
                  </p>

                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-ink-700">
                    What&apos;s included
                  </p>
                  <ul className="mt-3 flex-1 space-y-2.5 text-sm text-ink-900">
                    {w.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cream-50">
                          <Check className="h-3 w-3 text-ink-900" strokeWidth={2.5} aria-hidden />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={SIGNUP_FORM}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary mt-8"
                  >
                    Secure your spot
                  </a>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-ink-700">
            €10 per workshop · €15 for both · includes VAT ·{" "}
            <a
              href={SCHOLARSHIP_FORM}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 decoration-[#c97f72] hover:text-[#c97f72]"
            >
              scholarship seats every cohort
            </a>
          </p>

          <div className="mt-10 text-center">
            <Link
              href="/workshops"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 underline underline-offset-4 decoration-[#c97f72] hover:text-[#c97f72]"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Back to the StudyPuff Toolkit
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
