import Reveal from "./Reveal";

const PILLARS = [
  {
    emoji: "⏰",
    title: "Steady focus",
    body:
      "Structured focus rounds, the StudyPuff timer, and calm real-time background sounds."
  },
  {
    emoji: "🌍",
    title: "International company",
    body:
      "A global room of students co-studying and learning together. Body-doubling that feels like a library."
  },
  {
    emoji: "✈️",
    title: "Tools that travel",
    body:
      "Simple trackers, free printable templates, knowledge, and an app. Forever useful, from anywhere."
  }
];

export default function WhySection() {
  return (
    <section id="about" className="relative overflow-hidden py-16 lg:py-24">
      <span className="blob" style={{ right: "-40px", top: "20px", width: 260, height: 260, background: "#c7e2c7" }} />
      <span className="blob" style={{ left: "-60px", bottom: "40px", width: 220, height: 220, background: "#d9cdea" }} />

      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow-squiggle mb-3 inline-flex flex-col items-center text-xs uppercase tracking-[0.25em] text-ink-700">
            Why StudyPuff
          </p>
          <h2 className="display-heading text-3xl text-ink-900 sm:text-4xl lg:text-5xl">
            Because we believe that <em className="italic">students deserve better</em>.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-ink-700 sm:text-lg">
            At StudyPuff, we teach you how to study. However, it doesn&apos;t stop there. We offer
            continuous support with the help of our community. Because you don&apos;t have to do
            this alone.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <div className="group h-full rounded-3xl border border-ink-900/10 bg-cream-50 p-8 transition hover:-translate-y-1 hover:shadow-soft">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-butter text-3xl transition-transform group-hover:rotate-6">
                  {p.emoji}
                </div>
                <h3 className="font-display text-xl font-normal text-ink-900">{p.title}</h3>
                <p className="mt-3 text-ink-700">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
