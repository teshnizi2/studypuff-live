import Reveal from "./Reveal";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  accent?: "pink" | "peach" | "butter" | "mint" | "sky" | "lilac";
};

const accents: Record<NonNullable<Props["accent"]>, string> = {
  pink: "#f3c6c2",
  peach: "#f6d4b7",
  butter: "#fbe9a5",
  mint: "#c7e2c7",
  sky: "#c6dceb",
  lilac: "#d9cdea"
};

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  accent = "butter"
}: Props) {
  return (
    <section className="relative overflow-x-hidden py-20 lg:py-28">
      <span
        className="blob animate-float"
        style={{
          left: "-60px",
          top: "40px",
          width: 260,
          height: 260,
          background: accents[accent]
        }}
      />
      <span
        className="blob animate-bobble"
        style={{
          right: "-80px",
          top: "20%",
          width: 220,
          height: 220,
          background: "#d9cdea"
        }}
      />
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
        <Reveal>
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-ink-700">
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="display-heading text-[clamp(2.5rem,5vw,4.25rem)] text-ink-900">
            {title}
          </h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-700">{subtitle}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
