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
  external?: boolean;
};

const RESOURCES: Resource[] = [
  {
    title: "Cornell Note Taking Template",
    body: "A printable template that turns every lecture into something you can actually review later.",
    tag: "Template",
    tone: "bg-brand-pink"
  },
  {
    title: "StudyPuff App",
    body: "Log focus sessions, plan tasks, and join study rooms with friends.",
    tag: "App",
    tone: "bg-brand-butter",
    href: "/dashboard",
    cta: "Open the app"
  },
  {
    title: "Exam checklist",
    body: "A short pre-exam check so nothing essential gets forgotten the night before.",
    tag: "Checklist",
    tone: "bg-brand-mint"
  },
  {
    title: "Background sounds",
    body: "Calm, real-time backgrounds we use during the livestreams. (Coming soon.)",
    tag: "Audio",
    tone: "bg-brand-sky"
  },
  {
    title: "Spaced-repetition starter kit",
    body: "How to build flashcards that actually stick — with templates and a written guide.",
    tag: "Template",
    tone: "bg-brand-lilac"
  },
  {
    title: "Join the Discord",
    body: "Hang out with other StudyPuffs between livestreams. Share wins, ask for accountability, find a study buddy.",
    tag: "Community",
    tone: "bg-brand-peach",
    href: "https://discord.gg/hb8bKpbjEz",
    cta: "Open Discord",
    external: true
  }
];

export default function ResourcesPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Free resources"
        title="Tools for a calmer term."
        subtitle="Free printables, templates, and videos you can use. Made with love, backed by research."
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
                    {r.external ? (
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary"
                      >
                        {r.cta || "Open"}
                      </a>
                    ) : (
                      <Link href={r.href || "/resources"} className="btn-primary">
                        {r.cta || "Download"}
                      </Link>
                    )}
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
