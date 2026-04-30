import { Plus } from "lucide-react";
import Reveal from "./Reveal";

const FAQS = [
  {
    q: "Who are the workshops for?",
    a: "The current workshops are specifically designed for university and college students. However, this does not mean that you cannot join if you're not a university or college student. Anyone who wants to learn more about the specific workshop topic is able to join."
  },
  {
    q: "Can I join the workshops from outside of the Netherlands?",
    a: "We are currently focused on hosting in-person workshops, but we will soon launch our online workshops. Make sure to sign up to our newsletter to be the first to know when this happens. For now you can always join the livestreams on YouTube or Twitch."
  },
  {
    q: "Are the livestreams really free?",
    a: "Yes they are. Upon joining the livestream you will see an ad and sometimes there will be ads during the breaks, but you do not have to pay anything to join. In case you want to support, you can become a member to get access to cute emojis."
  },
  {
    q: "What makes the workshops science-based?",
    a: "Every workshop is grounded in scientific research on attention, sleep, spaced repetition, motivation, and other related topics. With that we also use our own experience as students and student representatives, to ensure it's all related to actual student life."
  },
  {
    q: "What if I can't afford a paid workshop?",
    a: "Every workshop has scholarship seats. For this you can fill out the following form.",
    formUrl: "https://forms.gle/12W2jhcPdtPEbt4X8"
  }
];

export default function FAQ() {
  return (
    <section className="relative py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Reveal className="mb-12 text-center">
          <p className="eyebrow-squiggle mb-3 inline-flex flex-col items-center text-xs uppercase tracking-[0.25em] text-ink-700">
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
                    <span className="plus inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink-900/15 bg-cream-50 text-ink-900 transition-colors group-open:bg-ink-900 group-open:text-cream-50">
                      <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
                    </span>
                  </summary>
                  <p className="mt-4 max-w-prose text-ink-700">
                    {"formUrl" in f && f.formUrl ? (
                      <>
                        {f.a.split("form")[0]}
                        <a
                          href={f.formUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="underline underline-offset-4 hover:text-ink-900"
                        >
                          form
                        </a>
                        {f.a.split("form").slice(1).join("form")}
                      </>
                    ) : (
                      f.a
                    )}
                  </p>
                </details>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
