import Link from "next/link";
import { Check, Heart } from "lucide-react";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

type Tier = {
  name: string;
  badge?: string;
  price: string;
  cadence: string;
  tagline: string;
  bullets: string[];
  tone: string;
  featured?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  ctaExternal?: boolean;
};

const SCHOLARSHIP_FORM = "https://forms.gle/12W2jhcPdtPEbt4X8";
const WAITLIST_FORM = "https://forms.gle/YPYHPUwiwY8esmK39";

const TIERS: Tier[] = [
  {
    name: "Focus Foundation",
    badge: "Advanced",
    price: "€20",
    cadence: "1 long session",
    tagline:
      "Supporting you to build the foundation of effective studying in 1 long session. Covering the building blocks of academic success.",
    bullets: ["1 session", "Personalized advice", "Workbook", "Personal Discord/WhatsApp Group"],
    tone: "bg-brand-pink",
    ctaLabel: "Join the waiting list",
    ctaHref: WAITLIST_FORM,
    ctaExternal: true
  },
  {
    name: "StudyPuff Academy",
    price: "€40",
    cadence: "8-week series",
    tagline:
      "Our structured, 8-week series to help you build the foundation you need to improve your academic performance. Built on the science of studying.",
    bullets: [
      "4 sessions and 4 checkups",
      "Workbook",
      "Personal Discord/WhatsApp Group",
      "Lifetime support"
    ],
    tone: "bg-brand-butter",
    featured: true,
    ctaLabel: "Join the waiting list",
    ctaHref: WAITLIST_FORM,
    ctaExternal: true
  },
  {
    name: "Time Management Toolkit",
    badge: "Single session · Starter",
    price: "€10",
    cadence: "2-hour workshop",
    tagline:
      "One two-hour workshop to help you manage your time. Not just about the science of time management, but to help you plan your upcoming period.",
    bullets: ["1 session", "Personalized advice", "Workbook", "Personal Discord/WhatsApp Group"],
    tone: "bg-brand-sky",
    ctaLabel: "Join the waiting list",
    ctaHref: WAITLIST_FORM,
    ctaExternal: true
  }
];

export default function WorkshopsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Workshops · cohorts of 30 max"
        title="Workshops that change how you study."
        subtitle="Choose the amount of support you need: one focused workshop, a foundation session, or our structured StudyPuff Academy series."
        accent="butter"
      />

      <section className="relative py-12 lg:py-20">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {TIERS.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <article
                  className={`flex h-full flex-col rounded-3xl p-8 ring-1 ring-ink-900/10 ${t.tone} ${
                    t.featured ? "scale-[1.02] shadow-soft" : ""
                  } transition hover:-translate-y-1`}
                >
                  {t.badge && (
                    <span className="mb-3 w-fit rounded-full bg-cream-50 px-3 py-1 text-xs uppercase tracking-widest text-ink-900">
                      {t.badge}
                    </span>
                  )}
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
                  <ul className="mt-6 flex-1 space-y-2.5 text-sm text-ink-900">
                    {t.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cream-50">
                          <Check className="h-3 w-3 text-ink-900" strokeWidth={2.5} aria-hidden />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  {t.ctaExternal ? (
                    <a
                      href={t.ctaHref || "/contact"}
                      target="_blank"
                      rel="noreferrer"
                      className={`mt-8 ${t.featured ? "btn-primary" : "btn-outline"}`}
                    >
                      {t.ctaLabel || "Enroll now"}
                    </a>
                  ) : (
                    <Link
                      href={t.ctaHref || "/contact"}
                      className={`mt-8 ${t.featured ? "btn-primary" : "btn-outline"}`}
                    >
                      {t.ctaLabel || "Enroll now"}
                    </Link>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
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
              <a
                href={SCHOLARSHIP_FORM}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                Apply for a scholarship seat
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
