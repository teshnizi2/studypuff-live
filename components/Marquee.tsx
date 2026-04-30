const ITEMS = [
  "TU Delft",
  "Universiteit van Amsterdam",
  "Erasmus University Rotterdam",
  "Leiden University",
  "Utrecht University",
  "Maastricht University",
  "KU Leuven",
  "ETH Zürich",
  "Cambridge",
  "Oxford",
  "Stanford",
  "MIT",
  "NUS Singapore",
  "Trinity College Dublin"
];

export default function Marquee() {
  const loop = [...ITEMS, ...ITEMS];
  return (
    <section
      aria-label="Universities our students attend"
      className="relative overflow-hidden border-y border-ink-900/10 bg-cream-50/70"
    >
      <div className="relative">
        <span className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-cream-50/95 to-transparent" />
        <span className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-cream-50/95 to-transparent" />
        <span className="absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-cream-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-700 shadow-soft md:inline-block">
          Studied at
        </span>
        <div className="marquee-track gap-12 py-5 px-6">
          {loop.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="flex items-center gap-3 whitespace-nowrap font-display text-xl italic text-ink-900/80 sm:text-2xl"
            >
              {t}
              <span className="inline-block h-1 w-1 rounded-full bg-ink-900/30" aria-hidden />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
