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
      className="relative overflow-hidden border-y border-ink-900/10 bg-cream-50/70 py-6"
    >
      <div className="marquee-track gap-10 px-6">
        {loop.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="flex items-center gap-4 whitespace-nowrap font-display text-2xl italic text-ink-900"
          >
            {t}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-brand-pink">
              <path d="M12 2l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" />
            </svg>
          </span>
        ))}
      </div>
    </section>
  );
}
