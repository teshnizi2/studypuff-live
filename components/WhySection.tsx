import Reveal from "./Reveal";
import SheepMascot from "./SheepMascot";

const PILLARS = [
  {
    icon: "⏰",
    title: "Steady focus",
    body:
      "Structured focus rounds, StudyPuff timer, and calm real time background sounds."
  },
  {
    icon: "🌍",
    title: "International company",
    body:
      "A global room of students co-studying and learning together. Body-doubling that feels like a library."
  },
  {
    icon: "🧰",
    title: "Tools that travel",
    body:
      "Simple trackers, free printable templates, knowledge, or app. Forever useful, from anywhere."
  }
];

export default function WhySection() {
  return (
    <section id="about" className="relative overflow-hidden py-24 lg:py-32">
      <span className="blob animate-float" style={{ right: "-40px", top: "20px", width: 260, height: 260, background: "#c7e2c7" }} />
      <span className="blob animate-bobble" style={{ left: "-60px", bottom: "40px", width: 220, height: 220, background: "#d9cdea" }} />

      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-ink-700">
            Why StudyPuff
          </p>
          <h2 className="display-heading text-4xl text-ink-900 sm:text-5xl lg:text-6xl">
            Because we believe that <em className="italic">students deserve better</em>.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-700">
            At StudyPuff, we teach you how to study. However, it doesn&apos;t stop there. We offer
            continuous support with the help of our community. Because you don&apos;t have to do this
            alone.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <div className="group h-full rounded-3xl border border-ink-900/10 bg-cream-50 p-8 transition-all hover:-translate-y-1 hover:shadow-soft">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-butter text-2xl transition-transform group-hover:rotate-6">
                  {p.icon}
                </div>
                <h3 className="font-display text-xl font-normal text-ink-900">
                  {p.title}
                </h3>
                <p className="mt-3 text-ink-700">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="pointer-events-none relative mt-16 flex justify-center">
          <Reveal>
            <div className="relative">
              <SheepMascot tone="mint" className="h-40 w-40 animate-bobble" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
