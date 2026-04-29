import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SheepMascot from "@/components/SheepMascot";

const VALUES = [
  { title: "Research first", body: "Every technique is rooted in peer-reviewed cognitive science, not productivity folklore." },
  { title: "Kind, never shame-y", body: "We believe curiosity beats guilt. Our tone is closer to a good tutor than a drill sergeant." },
  { title: "Tools over tricks", body: "Systems you can keep using after the workshop ends — not hacks that evaporate in a week." },
  { title: "Slow scaling", body: "We'd rather run small cohorts well than giant ones badly. Growth is boring on purpose." }
];

const TIMELINE = [
  { year: "2021", body: "StudyPuff begins as one person livestreaming their thesis work on YouTube." },
  { year: "2022", body: "First Focus Foundations workshop runs with 18 students. Refund rate: 0%." },
  { year: "2024", body: "Team of 4. Over 10,000 students have taken a workshop or watched a livestream." },
  { year: "2026", body: "15,145+ learners, three weekly livestreams, and a planner on a lot of desks." }
];

const TEAM = [
  { name: "Mika L.", role: "Founder · Educator", tone: "pink" as const, bio: "Ex-cognitive science PhD, full-time learning designer." },
  { name: "Arjun P.", role: "Head of Workshops", tone: "mint" as const, bio: "Runs cohorts and writes most of the curriculum." },
  { name: "Saskia V.", role: "Design & Brand", tone: "butter" as const, bio: "Makes the planners and draws the sheep." },
  { name: "Noor H.", role: "Community", tone: "sky" as const, bio: "Keeps the livestream chat kind and the DMs answered." }
];

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="About"
        title="Studying better shouldn't be a secret."
        subtitle="We're a tiny studio in Amsterdam building workshops, tools and livestreams for students who want to work smarter — and rest more."
        accent="lilac"
      />

      {/* Manifesto */}
      <section className="relative py-16 lg:py-20">
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-10 px-6 md:grid-cols-12 lg:px-10">
          <Reveal className="md:col-span-5">
            <h2 className="display-heading text-3xl text-ink-900 sm:text-5xl">
              Why we built <em className="italic">this</em>.
            </h2>
          </Reveal>
          <Reveal delay={120} className="space-y-5 text-ink-700 md:col-span-7">
            <p>
              Most students are never actually taught how to study. We learn facts,
              dates, and formulas — but the skill of learning itself is treated like
              something you'll pick up on your own.
            </p>
            <p>
              StudyPuff exists to teach that skill. We translate the research on attention,
              memory and motivation into short workshops you can start using this week,
              and we pair them with live co-study sessions so you don't have to do it
              alone.
            </p>
            <p>
              We're small on purpose. Our aim is slow, sustainable, research-backed help
              for students — not a content machine chasing engagement.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <Reveal className="mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-ink-700">What we value</p>
            <h2 className="display-heading mt-3 text-3xl text-ink-900 sm:text-4xl">
              Four principles that shape every workshop.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="h-full rounded-3xl border border-ink-900/10 bg-cream-50 p-6 transition hover:-translate-y-1 hover:shadow-soft">
                  <h3 className="font-display text-xl text-ink-900">{v.title}</h3>
                  <p className="mt-3 text-ink-700">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative py-16 lg:py-20">
        <div className="mx-auto max-w-[1000px] px-6 lg:px-10">
          <Reveal className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-ink-700">Our story</p>
            <h2 className="display-heading mt-3 text-3xl text-ink-900 sm:text-5xl">
              A few years in.
            </h2>
          </Reveal>
          <ol className="relative ml-4 border-l border-ink-900/20 pl-8">
            {TIMELINE.map((t, i) => (
              <li key={t.year} className={i > 0 ? "mt-10" : ""}>
                <Reveal delay={i * 80}>
                  <span className="absolute -left-2 mt-1 inline-block h-4 w-4 rounded-full bg-brand-butter ring-4 ring-cream-50" />
                  <p className="font-display text-2xl text-ink-900">{t.year}</p>
                  <p className="mt-2 max-w-prose text-ink-700">{t.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Team */}
      <section className="relative py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <Reveal className="mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-ink-700">The team</p>
            <h2 className="display-heading mt-3 text-3xl text-ink-900 sm:text-4xl">
              Four humans and a sheep.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 80}>
                <figure className="h-full rounded-3xl border border-ink-900/10 bg-cream-50 p-6 text-center transition hover:-translate-y-1 hover:shadow-soft">
                  <div className="mx-auto flex h-32 w-32 items-center justify-center">
                    <SheepMascot tone={m.tone} className="h-full w-full" />
                  </div>
                  <figcaption>
                    <p className="mt-4 font-display text-lg text-ink-900">{m.name}</p>
                    <p className="text-sm text-ink-700">{m.role}</p>
                    <p className="mt-3 text-sm text-ink-700">{m.bio}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

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
