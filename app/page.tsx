import Link from "next/link";
import { Youtube, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import WhySection from "@/components/WhySection";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import AppPreview from "@/components/AppPreview";
import SectionDivider from "@/components/SectionDivider";

const COSTUDY_BULLETS: string[] = [
  "50/10 Pomodoros",
  "All ages welcome",
  "Chatting during breaks",
  "Cozy community",
  "Regular cozy game streams"
];

const APP_BULLETS: string[] = [
  "Pomodoro timer with the sheep at the centre",
  "Tasks, topics, and a daily goal",
  "Earn & spend coins on rewards",
  "Group study rooms with chat"
];

const LIVE_SESSIONS_THIS_WEEK: number = 3;

export default function Page() {
  return (
    <main className="gradient-surface relative grain">
      <Header />
      <Hero />
      <Marquee />

      {/* Co-study section — "Live this week" pill is folded into the eyebrow */}
      <section className="relative py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-6 md:grid-cols-12 lg:px-10">
          <Reveal className="relative md:col-span-6">
            {/* Soft offset shadow card (polaroid feel) */}
            <div
              aria-hidden
              className="absolute inset-2 -z-10 rounded-[32px] bg-brand-pink/60"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/youtube-lifestyle.jpg"
              alt="Student studying at a warmly lit desk during a co-study session"
              className="w-full rounded-[28px] object-cover shadow-[0_30px_60px_-25px_rgba(0,0,0,0.25)]"
              loading="lazy"
            />
          </Reveal>
          <Reveal className="md:col-span-6" delay={150}>
            <Link
              href="/study"
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink-900/10 bg-cream-50 px-3.5 py-1.5 text-xs font-semibold text-ink-900 shadow-soft transition hover:-translate-y-0.5"
            >
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
              Live this week · {LIVE_SESSIONS_THIS_WEEK} livestreams →
            </Link>
            <h2 className="display-heading text-[clamp(2rem,3.5vw,3rem)] text-ink-900">
              Co-study sessions with focus timer and accountability.
            </h2>
            <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-ink-700">
              Free livestreams on YouTube and Twitch. Drop in, set your intention, and get
              your things done alongside students from all around the world.
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {COSTUDY_BULLETS.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-ink-900">
                  <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-ink-900/70" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/study" className="btn-primary">
                See this week&apos;s schedule <span aria-hidden>→</span>
              </Link>
              <a
                href="https://www.youtube.com/@StudyPuffAcademy"
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
              >
                <Youtube className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                Subscribe on YouTube
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionDivider tone="pink" />

      {/* Meet the app */}
      <section className="relative py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-14 px-6 md:grid-cols-12 lg:px-10">
          <Reveal className="md:col-span-6 md:order-2">
            <AppPreview />
          </Reveal>
          <Reveal className="md:col-span-6 md:order-1" delay={150}>
            <p className="eyebrow-squiggle mb-3 inline-flex flex-col text-xs uppercase tracking-[0.25em] text-ink-700">
              Meet the app · free
            </p>
            <h2 className="display-heading text-[clamp(2rem,3.5vw,3rem)] text-ink-900">
              A cozy timer. A sheep that&apos;s rooting for you.
            </h2>
            <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-ink-700">
              Set your focus timer, pick a task, press start. Earn coins for every study session,
              completed tasks, and more. Use them on new ambient sounds, themes, and more to come.
              Join study rooms with a code so you can study with your friends in real time.
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {APP_BULLETS.map((b) => (
                <li
                  key={b}
                  className="rounded-2xl bg-cream-50/70 px-3 py-2.5 text-ink-900"
                >
                  <span className="font-semibold">{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard" className="btn-primary">
                Open the app <span aria-hidden>→</span>
              </Link>
              <Link href="/register" className="btn-outline">
                Create a free account
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionDivider tone="mint" />

      <WhySection />

      {/* PLNT partnership */}
      <section className="relative pb-8">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
          <Reveal>
            <div className="rounded-[28px] border border-ink-900/10 bg-cream-50 px-6 py-6 shadow-soft sm:px-8 sm:py-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/plnt-logo.png"
                  alt="PLNT Students"
                  className="h-14 w-auto shrink-0 object-contain"
                />
                <div className="flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-700">
                    Proud partner
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-ink-900 sm:text-lg">
                    StudyPuff is part of PLNT&apos;s community of innovators and entrepreneurs in
                    Leiden and The Hague, where early-stage ideas get the coaching, network, and
                    structure to grow from ideation to validation and acceleration.
                  </p>
                  <a
                    href="https://www.plntleiden.com"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline mt-4 inline-flex"
                  >
                    Visit PLNT
                    <ExternalLink className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionDivider tone="ink" />

      <Testimonials />

      <SectionDivider tone="butter" />

      <FAQ />

      <Newsletter />
      <Footer />
    </main>
  );
}
