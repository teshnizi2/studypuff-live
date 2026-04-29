import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

type Resource = {
  title: string;
  body: string;
  tag: string;
  tone: string;
  href?: string;
  cta?: string;
};

const RESOURCES: Resource[] = [
  {
    title: "The Weekly Reset Planner",
    body: "A printable one-pager to plan your week in under 10 minutes. PDF + editable Notion copy.",
    tag: "Planner",
    tone: "bg-brand-pink"
  },
  {
    title: "Pomodoro Focus Timer",
    body: "Use the authenticated StudyPuff dashboard to log focus sessions, tasks, and preferences.",
    tag: "Tool",
    tone: "bg-brand-butter",
    href: "/dashboard",
    cta: "Open app"
  },
  {
    title: "Active Recall Cheatsheet",
    body: "The three recall moves we teach in the workshop, collected on a single wall-sticker.",
    tag: "Cheatsheet",
    tone: "bg-brand-mint"
  },
  {
    title: "Exam Week Survival Kit",
    body: "A 7-day schedule template, wellness checklist, and night-before reminder you can actually follow.",
    tag: "Template",
    tone: "bg-brand-sky"
  },
  {
    title: "Spaced Repetition Deck Starter",
    body: "Build better flashcards in 15 minutes with our Anki/Notion templates and writing rules.",
    tag: "Template",
    tone: "bg-brand-lilac"
  },
  {
    title: "Burnout Check-in",
    body: "A short self-assessment plus three small adjustments to try when you feel the grind.",
    tag: "Reflection",
    tone: "bg-brand-peach"
  }
];

export default function ResourcesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Free resources"
        title="Free stuff that's actually useful."
        subtitle="No email wall, no 30-day drip. Download, use, share with a friend."
        accent="mint"
      />

      <section className="relative pb-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {RESOURCES.map((r, i) => (
              <Reveal key={r.title} delay={i * 80}>
                <article
                  className={`group relative flex h-full flex-col overflow-hidden rounded-3xl ${r.tone} p-8 transition hover:-translate-y-1 hover:shadow-soft`}
                >
                  <span className="absolute right-6 top-6 rounded-full bg-cream-50/70 px-3 py-1 text-xs uppercase tracking-widest text-ink-900">
                    {r.tag}
                  </span>
                  <h3 className="mt-6 font-display text-2xl text-ink-900">{r.title}</h3>
                  <p className="mt-3 text-ink-900/80">{r.body}</p>
                  <div className="mt-8 flex items-center gap-3">
                    <Link href={r.href || "/resources"} className="btn-primary">
                      {r.cta || "Download"}
                    </Link>
                    <Link href={r.href || "/resources"} className="nav-link text-sm text-ink-900">
                      {r.href ? "Get started" : "Preview"}
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16 rounded-[32px] border border-ink-900/10 bg-cream-50 p-10 text-center shadow-soft">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-ink-700">
              Looking for more?
            </p>
            <h2 className="display-heading text-3xl text-ink-900 sm:text-4xl">
              Paid workshops go deeper, faster.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-700">
              Our cohorts take these free tools and build a full practice around them — with
              peer accountability and coach feedback.
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
