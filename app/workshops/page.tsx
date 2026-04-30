import Link from "next/link";
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
};

const TIERS: Tier[] = [
  {
    name: "Focus Foundation",
    badge: "Advanced",
    price: "€20",
    cadence: "1 long session",
    tagline:
      "Supporting you to build the foundation of effective studying in 1 long session. Covering the building blocks of academic success.",
    bullets: ["1 session", "Personalized advice", "Workbook", "Personal Discord/WhatsApp Group"],
    tone: "bg-brand-pink"
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
    featured: true
  },
  {
    name: "Time Management Toolkit",
    badge: "Single session · Starter",
    price: "€10",
    cadence: "2-hour workshop",
    tagline:
      "One two-hour workshop to help you manage your time. Not just about the science of time management, but to help you plan your upcoming period.",
    bullets: ["1 session", "Personalized advice", "Workbook", "Personal Discord/WhatsApp Group"],
    tone: "bg-brand-sky"
  }
];

export default function WorkshopsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Workshops · cohorts of 30 max"
        title="Workshops that change how you study."
        subtitle="Three workshops, one live session, a workbook, lifetime support, and a cohort that keeps you accountable."
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

      {/* Cozy community, not a bootcamp */}
      <section className="relative py-16 lg:py-20">
        <div className="mx-auto max-w-[900px] px-6 text-center lg:px-10">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.25em] text-ink-700">A cozy community</p>
            <h2 className="display-heading mt-3 text-3xl text-ink-900 sm:text-4xl">
              A cozy community, <em className="italic">not a bootcamp</em>.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-ink-700">
              Every cohort has scholarship seats. If the price is a problem, just write to us via
              the contact form.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/contact" className="btn-primary">
                Apply for a scholarship seat
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
