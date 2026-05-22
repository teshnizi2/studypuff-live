import Link from "next/link";
import {
  Timer,
  ListChecks,
  Coins,
  Sprout,
  Music,
  Users,
  ArrowRight,
  type LucideIcon
} from "lucide-react";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import AppPreview from "@/components/AppPreview";

const FEATURES: { Icon: LucideIcon; title: string; body: string; tone: string }[] = [
  {
    Icon: Timer,
    title: "A focus timer with your sheep",
    body: "Pomodoro rounds with your sheep at the centre. Use 50/10, 25/5, or set your own — pick a task, press start.",
    tone: "bg-brand-mint text-emerald-800"
  },
  {
    Icon: ListChecks,
    title: "Tasks & topics",
    body: "Line up what you're working on, group it by topic, and check things off as the rounds go by.",
    tone: "bg-brand-sky text-sky-800"
  },
  {
    Icon: Coins,
    title: "Earn coins, spend on rewards",
    body: "Every focus session and finished task earns coins. Spend them on ambient sounds, themes, and little sheep accessories.",
    tone: "bg-brand-butter text-amber-700"
  },
  {
    Icon: Sprout,
    title: "Watch your garden grow",
    body: "Every 25 minutes of focus grows a leaf. A tiny sprout becomes a sapling, then a whole tree — your hours, made visible.",
    tone: "bg-brand-mint text-emerald-800"
  },
  {
    Icon: Music,
    title: "Ambient soundscapes",
    body: "Soft rain, ocean waves, a cosy café, a fireplace, brown noise — set the mood and let it carry the session.",
    tone: "bg-brand-lilac text-violet-800"
  },
  {
    Icon: Users,
    title: "Study rooms with friends",
    body: "Share a room code and study together in real time — a shared timer everyone follows, plus a chat to cheer each other on.",
    tone: "bg-brand-pink text-rose-700"
  }
];

export default function AppLandingPage() {
  return (
    <PageShell>
      {/* Hero — copy left, live mockup right */}
      <section className="relative py-16 lg:py-24">
        <span className="blob" style={{ left: "-70px", top: "60px", width: 260, height: 260, background: "#c7e2c7" }} />
        <span className="blob" style={{ right: "-60px", top: "20px", width: 220, height: 220, background: "#fbe9a5" }} />

        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-6 md:grid-cols-12 lg:px-10">
          <Reveal className="md:col-span-6">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-ink-900/15 bg-cream-50/70 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-ink-700 backdrop-blur">
              StudyPuff App · free forever
            </p>
            <h1 className="display-heading text-[clamp(2.5rem,5vw,4.25rem)] text-ink-900">
              A cozy timer. A sheep that&apos;s{" "}
              <span className="relative inline-block">
                <em className="italic">rooting for you</em>
                <svg
                  aria-hidden
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 h-2.5 w-full text-[#c97f72]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M2 8 Q 30 2 60 6 T 120 5 T 198 7" />
                </svg>
              </span>
              .
            </h1>
            <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-ink-700">
              Set your focus timer, pick a task, press start. Earn coins, grow a little garden, drop
              into study rooms with friends — a calmer way to get your hours in, free and in your
              browser.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard" className="btn-primary">
                Open the app <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              </Link>
              <Link href="/register" className="btn-outline">
                Create a free account
              </Link>
            </div>
            <p className="mt-4 text-xs text-ink-700">
              No card, no catch. Works in any modern browser — desktop or phone.
            </p>
          </Reveal>

          <Reveal className="md:col-span-6" delay={150}>
            <AppPreview />
          </Reveal>
        </div>
      </section>

      {/* Feature grid */}
      <section className="relative py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <Reveal className="mb-10 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-ink-700">
              Everything in one calm screen
            </p>
            <h2 className="display-heading text-3xl text-ink-900 sm:text-4xl">
              Small tools that add up to real focus.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <div className="h-full rounded-3xl border border-ink-900/10 bg-cream-50 p-6 transition hover:-translate-y-1 hover:shadow-soft">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${f.tone}`}>
                    <f.Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="mt-3 font-display text-lg text-ink-900">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA band */}
      <section className="relative py-16 lg:py-24">
        <div className="mx-auto max-w-[1000px] px-6 lg:px-10">
          <Reveal>
            <div className="relative overflow-hidden rounded-[32px] border border-ink-900/10 bg-gradient-to-b from-[#dfead2] via-[#cfe0c2] to-[#bbd3ad] px-8 py-14 text-center shadow-soft">
              <div className="mx-auto mb-5 h-24 w-24">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/studypuff-sheep.png"
                  alt="StudyPuff sheep"
                  className="h-full w-full animate-bobble object-contain"
                />
              </div>
              <h2 className="display-heading text-3xl text-ink-900 sm:text-4xl">
                Start your first session in under a minute.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-ink-700">
                Open the app and the sheep is already waiting. Pick a task, press start, and let the
                garden grow.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link href="/dashboard" className="btn-primary">
                  Open the app <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </Link>
                <Link href="/register" className="btn-outline">
                  Create a free account
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
