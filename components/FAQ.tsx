import Reveal from "./Reveal";

const FAQS = [
  {
    q: "Who are the workshops for?",
    a: "High school, IB, A-level, and university students who want to study more effectively — whether you're aiming for top marks or just trying to feel less behind."
  },
  {
    q: "How are the sessions delivered?",
    a: "A mix of live cohort workshops, recorded lessons, printable worksheets, and optional co-study rooms so you can apply each technique the same week you learn it."
  },
  {
    q: "Do I need to commit to a specific schedule?",
    a: "Each workshop runs over a few weeks with flexible live slots. All live sessions are recorded, and the practice work is self-paced."
  },
  {
    q: "What if it's not right for me?",
    a: "We have a 14-day no-questions-asked refund window. We only want the workshop in the hands of students it actually helps."
  },
  {
    q: "Are the livestreams really free?",
    a: "Yep — three study-with-me sessions a week on YouTube and Twitch, forever free. The workshop is our paid program, the livestreams are for everyone."
  }
];

export default function FAQ() {
  return (
    <section className="relative py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Reveal className="mb-12 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-ink-700">
            Questions & answers
          </p>
          <h2 className="display-heading text-4xl text-ink-900 sm:text-5xl">
            Everything you might <em className="italic">wonder</em>.
          </h2>
        </Reveal>

        <ul className="divide-y divide-ink-900/10 rounded-3xl border border-ink-900/10 bg-cream-50">
          {FAQS.map((f, i) => (
            <li key={f.q}>
              <Reveal delay={i * 60}>
                <details className="faq group px-6 py-5 sm:px-8">
                  <summary className="flex items-center justify-between gap-6">
                    <span className="font-display text-lg text-ink-900 sm:text-xl">
                      {f.q}
                    </span>
                    <span className="plus inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-peach text-ink-900">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-prose text-ink-700">{f.a}</p>
                </details>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
