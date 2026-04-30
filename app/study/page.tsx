import Link from "next/link";
import {
  Youtube,
  Twitch,
  MessageCircle,
  Clock,
  Globe,
  Gamepad2,
  type LucideIcon
} from "lucide-react";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

const GOOGLE_CALENDAR =
  "https://calendar.google.com/calendar/u/1?cid=Y19lOWVkYmFjOGQ3ODljNzllMWVlYmZhNDZiYmUyMDgwMzlkYjhiMmE2ZDQwNjcyZWNlMjY3NDZiMmQ1NzY1ZmEyQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20";

const SCHEDULE = [
  { day: "Monday", time: "8:00 AM CET", platform: "YouTube", topic: "Cozy morning focus" },
  { day: "Tuesday", time: "12:00 PM CET", platform: "YouTube", topic: "Deep work" },
  { day: "Friday", time: "12:00 PM CET", platform: "YouTube", topic: "Last focus sprint" }
];

const STEPS = [
  {
    n: "01",
    title: "Pick a session",
    body: "Scroll through the week's schedule and choose whichever sessions fits. All free to join."
  },
  {
    n: "02",
    title: "Set your intention",
    body: "Write your tasks in the chat for each session. Be as specific as possible, so we can cheer you on."
  },
  {
    n: "03",
    title: "Work in rounds",
    body: "Structured focus rounds, using the StudyPuff app, timer, cozy company, and guidance."
  },
  {
    n: "04",
    title: "Close the loop",
    body: "Celebrate your progress in the chat, mark what's done in the app, and head off feeling lighter and less stressed."
  }
];

export default function StudyPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Study with us · Free"
        title="Co-study with a digital room full of international classmates."
        subtitle="Weekly livestreams on YouTube and Twitch. Your structured focus time, good company, and accountability."
        accent="pink"
      />

      {/* Platform pills */}
      <section className="relative -mt-8 pb-12">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://www.youtube.com/@StudyPuffAcademy"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-brand-pink px-5 py-2 text-sm font-semibold text-ink-900 shadow-soft transition hover:-translate-y-0.5"
              >
                <Youtube className="h-4 w-4 text-rose-700" strokeWidth={1.75} aria-hidden />
                YouTube · @StudyPuffAcademy
              </a>
              <a
                href="https://www.twitch.tv/studypuffacademy"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-brand-lilac px-5 py-2 text-sm font-semibold text-ink-900 shadow-soft transition hover:-translate-y-0.5"
              >
                <Twitch className="h-4 w-4 text-violet-800" strokeWidth={1.75} aria-hidden />
                Twitch · live evenings
              </a>
              <a
                href="https://discord.gg/hb8bKpbjEz"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-brand-sky px-5 py-2 text-sm font-semibold text-ink-900 shadow-soft transition hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4 text-sky-800" strokeWidth={1.75} aria-hidden />
                Discord · in-between hangouts
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1100px] px-6 pb-20 lg:px-10">
        <Reveal className="mb-10 flex items-end justify-between gap-4">
          <h2 className="display-heading text-3xl text-ink-900 sm:text-4xl">
            This week&apos;s sessions
          </h2>
          <p className="hidden max-w-xs text-sm text-ink-700 md:block">
            All livestreams are free to join. You are free to support the cause by becoming a
            member to get access to special emojis. If you miss a livestream, you can always
            watch it back later.
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
          <a
            href="https://www.youtube.com/@StudyPuffAcademy"
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
          >
            <Youtube className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Subscribe on YouTube
          </a>
          <a
            href="https://www.twitch.tv/studypuffacademy"
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
          >
            <Twitch className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Follow on Twitch
          </a>
          <a
            href={GOOGLE_CALENDAR}
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
          >
            Add to calendar
          </a>
        </div>
      </section>

      {/* What you get */}
      <section className="relative py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <Reveal className="mb-10 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-ink-700">What you get</p>
            <h2 className="display-heading text-3xl text-ink-900 sm:text-4xl">
              All free, no sign-up needed.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                { Icon: Clock, label: "50/10 Pomodoros", body: "Structured focus rounds with built-in rests.", tone: "bg-brand-butter text-amber-700" },
                { Icon: Globe, label: "All ages welcome", body: "Anyone is welcome to join.", tone: "bg-brand-mint text-emerald-800" },
                { Icon: MessageCircle, label: "Chat during breaks", body: "Cheer each other on between rounds.", tone: "bg-brand-sky text-sky-800" },
                { Icon: Gamepad2, label: "Cozy game streams", body: "On Twitch we have regular hangouts to play cozy games.", tone: "bg-brand-lilac text-violet-800" }
              ] as { Icon: LucideIcon; label: string; body: string; tone: string }[]
            ).map((b, i) => (
              <Reveal key={b.label} delay={i * 70}>
                <div className="h-full rounded-3xl border border-ink-900/10 bg-cream-50 p-6">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${b.tone}`}>
                    <b.Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </div>
                  <h3 className="mt-3 font-display text-lg text-ink-900">{b.label}</h3>
                  <p className="mt-2 text-sm text-ink-700">{b.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <Reveal className="mb-10 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-ink-700">
              How it works
            </p>
            <h2 className="display-heading text-3xl text-ink-900 sm:text-4xl">
              Four small steps, one focused hour.
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

      {/* Discord callout */}
      <section className="relative py-12 lg:py-16">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
          <Reveal>
            <div className="flex flex-col items-center gap-6 rounded-[28px] border border-ink-900/10 bg-brand-sky/40 p-8 text-center shadow-soft sm:flex-row sm:text-left">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cream-50 text-sky-800 shadow-soft">
                <MessageCircle className="h-8 w-8" strokeWidth={1.5} aria-hidden />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-2xl text-ink-900">
                  Hang out between sessions
                </h3>
                <p className="mt-2 text-ink-700">
                  Our Discord is the cosy in-between — share wins, ask for accountability, find a
                  study buddy in your timezone.
                </p>
              </div>
              <a
                href="https://discord.gg/hb8bKpbjEz"
                target="_blank"
                rel="noreferrer"
                className="btn-primary shrink-0"
              >
                Join the Discord
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mascot CTA */}
      <section className="relative py-20 lg:py-28">
        <div className="mx-auto flex max-w-[1000px] flex-col items-center gap-8 rounded-[32px] border border-ink-900/10 bg-cream-50 px-8 py-16 text-center shadow-soft lg:flex-row lg:text-left">
          <div className="h-40 w-40 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/studypuff-logo-v3.png"
              alt="StudyPuff Academy"
              className="h-full w-full animate-bobble object-contain"
            />
          </div>
          <div>
            <h2 className="display-heading text-3xl text-ink-900 sm:text-4xl">
              See you at the next session.
            </h2>
            <p className="mt-4 max-w-xl text-ink-700">
              Subscribe to the channel, turn on notifications, and we&apos;ll nudge you when each
              session starts.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://www.youtube.com/@StudyPuffAcademy"
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                Subscribe on YouTube
              </a>
              <a
                href="https://www.twitch.tv/studypuffacademy"
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
              >
                Follow on Twitch
              </a>
              <a
                href="https://discord.gg/hb8bKpbjEz"
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
              >
                Join the Discord
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

