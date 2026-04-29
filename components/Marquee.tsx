const ITEMS = [
  "Pomodoro, done right",
  "Spaced repetition",
  "Active recall",
  "Deep focus rituals",
  "Exam-week game plans",
  "Burnout-proof habits",
  "Study-with-me streams",
  "Research-backed workshops"
];

export default function Marquee() {
  const loop = [...ITEMS, ...ITEMS];
  return (
    <section
      aria-label="Topics we cover"
      className="relative border-y border-ink-900/10 bg-cream-50/70 py-6"
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
