import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SheepMascot from "@/components/SheepMascot";

const SCHEDULE = [
  { day: "Monday", time: "7:00 PM CET", platform: "YouTube", topic: "Slow-start focus (Pomodoro 50/10)" },
  { day: "Wednesday", time: "4:00 PM CET", platform: "Twitch", topic: "Deep-work block (90 min)" },
  { day: "Saturday", time: "10:00 AM CET", platform: "YouTube", topic: "Weekend reset + planning" }
];

const STEPS = [
  { n: "01", title: "Pick a session", body: "Scroll the week's schedule and choose whichever slot fits. They're all free — no sign-in needed." },
  { n: "02", title: "Set your intention", body: "Write your one task for the session in chat when you arrive. Specific beats ambitious." },
  { n: "03", title: "Work in rounds", body: "We run structured focus rounds with short breaks. Lo-fi music, a gentle timer, and quiet company." },
  { n: "04", title: "Close the loop", body: "Celebrate progress in chat, mark what's done, and head off feeling lighter than you arrived." }
];

export default function StudyPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Study with us · Free"
        title="Co-study with a room full of quiet classmates."
        subtitle="Three livestreams a week on YouTube and Twitch — just structured focus time, good company, and zero pressure."
        accent="pink"
      />

      {/* Schedule */}
      <section className="relative mx-auto max-w-[1100px] px-6 pb-20 lg:px-10">
        <Reveal className="mb-10 flex items-end justify-between gap-4">
          <h2 className="display-heading text-3xl text-ink-900 sm:text-4xl">
            This week's sessions
          </h2>
          <p className="hidden max-w-xs text-sm text-ink-700 md:block">
            All livestreams are free and recorded. Join live for the shared energy,
            catch up later if you miss one.
          </p>
        </Reveal>

        <ul className="overflow-hidden rounded-3xl border border-ink-900/10 bg-cream-50">
          {SCHEDULE.map((s, i) => (
            <li
              key={s.day}
              className={`grid grid-cols-1 gap-2 px-6 py-5 sm:grid-cols-5 sm:items-center sm:gap-6 ${
                i > 0 ? "border-t border-ink-900/10" : ""
              }`}
            >
              <span className="font-display text-xl text-ink-900">{s.day}</span>
              <span className="text-sm text-ink-700">{s.time}</span>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-butter px-3 py-1 text-xs uppercase tracking-wider text-ink-900">
                {s.platform}
              </span>
              <span className="col-span-2 text-ink-700">{s.topic}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/workshops" className="btn-primary">
            See paid workshops
          </Link>
          <Link href="/resources" className="btn-outline">
            Grab the free planner
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="relative py-20 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <Reveal className="mb-14 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-ink-700">
              How it works
            </p>
            <h2 className="display-heading text-3xl text-ink-900 sm:text-5xl">
              Four tiny rituals, one focused hour.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 100}>
                <div className="group h-full rounded-3xl border border-ink-900/10 bg-cream-50 p-8 transition hover:-translate-y-1 hover:shadow-soft">
                  <span className="font-display text-3xl text-ink-900/40">{s.n}</span>
                  <h3 className="mt-3 font-display text-xl text-ink-900">{s.title}</h3>
                  <p className="mt-3 text-ink-700">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mascot CTA */}
      <section className="relative py-20 lg:py-28">
        <div className="mx-auto flex max-w-[1000px] flex-col items-center gap-8 rounded-[32px] border border-ink-900/10 bg-cream-50 px-8 py-16 text-center shadow-soft lg:flex-row lg:text-left">
          <SheepMascot tone="mint" className="h-40 w-40 shrink-0 animate-bobble" />
          <div>
            <h2 className="display-heading text-3xl text-ink-900 sm:text-4xl">
              See you at the next bell.
            </h2>
            <p className="mt-4 max-w-xl text-ink-700">
              Subscribe to the channel, turn on notifications, and we'll nudge you a few
              minutes before each session starts.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#" className="btn-primary">Subscribe on YouTube</a>
              <a href="#" className="btn-outline">Follow on Twitch</a>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
