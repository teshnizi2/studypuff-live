import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

const PRINCIPLES = [
  {
    n: "01",
    title: "Research over showmanship",
    body: "Everything we teach is grounded in science, adapted for real student life."
  },
  {
    n: "02",
    title: "Rest is part of the work",
    body: "Sleep, breaks, and fun aren't an afterthought, they are essential."
  },
  {
    n: "03",
    title: "Personal attention",
    body: "In-person cohorts of 30 max, no spam emails, and no ad interruptions."
  },
  {
    n: "04",
    title: "Kindness is a strategy",
    body:
      "Self-compassion outperforms self-criticism in the long run. Our tools reflect that."
  }
];

const TEAM = [
  {
    name: "Elaine",
    role: "Founder / CEO",
    photo: "/assets/elaine.png",
    bio: "Founded StudyPuff to make studying feel less lonely. Runs the workshops and most of the livestreams."
  },
  {
    name: "Hera",
    role: "Co-founder · Research & Development",
    photo: "/assets/hera.png",
    bio: "Translates the cognitive science research into the workshops we run. Keeps every claim honest."
  },
  {
    name: "Reza",
    role: "Co-founder · Engineering & Automation",
    photo: "/assets/sheep.png",
    bio: "Computer scientist behind the StudyPuff app, the website, and the automations that keep everything humming in the background."
  }
];

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="About"
        title="Studying better shouldn't be a secret."
        subtitle="A small studio building workshops, tools and livestreams for students who want to work smarter — and rest more."
        accent="lilac"
      />

      {/* Principles */}
      <section className="relative py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <Reveal className="mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-ink-700">Our principles</p>
            <h2 className="display-heading mt-3 text-3xl text-ink-900 sm:text-4xl">
              Four principles that shape every workshop.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <div className="h-full rounded-3xl border border-ink-900/10 bg-cream-50 p-6 transition hover:-translate-y-1 hover:shadow-soft">
                  <span className="font-display text-3xl text-ink-900/40">{p.n}</span>
                  <h3 className="mt-3 font-display text-xl text-ink-900">{p.title}</h3>
                  <p className="mt-3 text-ink-700">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="relative py-16 lg:py-24">
        <div className="mx-auto max-w-[900px] px-6 lg:px-10">
          <Reveal className="mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-ink-700">The team</p>
            <h2 className="display-heading mt-3 text-3xl text-ink-900 sm:text-4xl">
              The humans behind StudyPuff.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 80}>
                <figure className="h-full overflow-hidden rounded-3xl border border-ink-900/10 bg-cream-50 transition hover:-translate-y-1 hover:shadow-soft">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-brand-butter/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.photo}
                      alt={m.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="p-6 text-center">
                    <p className="font-display text-2xl text-ink-900">{m.name}</p>
                    <p className="text-sm text-ink-700">{m.role}</p>
                    <p className="mt-3 text-sm text-ink-700">{m.bio}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          {/* PLNT partnership */}
          <Reveal className="mt-16">
            <div className="flex flex-col items-center gap-6 rounded-[28px] border border-ink-900/10 bg-cream-50 px-8 py-10 text-center shadow-soft sm:flex-row sm:text-left">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/plnt-logo.png"
                alt="PLNT Leiden"
                className="h-16 w-auto object-contain"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-700">
                  Partner
                </p>
                <h3 className="mt-2 font-display text-2xl text-ink-900">PLNT Leiden</h3>
                <p className="mt-2 max-w-xl text-ink-700">
                  Our home base. PLNT is a student incubator in Leiden where we host our in-person
                  workshops and run a few of the livestreams.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal className="mt-16 text-center">
            <Link href="/contact" className="btn-primary">
              Say hello
            </Link>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
