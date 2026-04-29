import Reveal from "./Reveal";

const QUOTES = [
  {
    quote:
      "I used to pull all-nighters and still feel behind. After two workshops I study half as long and my grades went up a full letter.",
    name: "Amira J.",
    role: "Pre-med, Year 2",
    tone: "bg-brand-pink"
  },
  {
    quote:
      "The study-with-me livestreams are weirdly motivating. It feels like having a library full of classmates, 24/7.",
    name: "Theo K.",
    role: "CS undergrad",
    tone: "bg-brand-butter"
  },
  {
    quote:
      "Honestly the only study content that doesn't make me feel guilty. I actually look forward to opening my notes now.",
    name: "Nadia R.",
    role: "IB Diploma",
    tone: "bg-brand-mint"
  }
];

export default function Testimonials() {
  return (
    <section className="relative py-24 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-ink-700">
              Student stories
            </p>
            <h2 className="display-heading text-4xl text-ink-900 sm:text-5xl">
              Real students, <em className="italic">real</em> progress.
            </h2>
          </div>
          <p className="max-w-sm text-ink-700">
            A snapshot of what workshop alumni are saying after finishing one of our
            cohorts.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <Reveal key={q.name} delay={i * 100}>
              <figure
                className={`h-full rounded-3xl ${q.tone} p-8 transition-transform hover:-translate-y-1`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="mb-5 h-8 w-8 text-ink-900/70"
                  aria-hidden
                  fill="currentColor"
                >
                  <path d="M9 7H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm10 0h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z" />
                </svg>
                <blockquote className="font-display text-xl leading-snug text-ink-900">
                  &ldquo;{q.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 text-sm text-ink-700">
                  <strong className="text-ink-900">{q.name}</strong> · {q.role}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
