import Link from "next/link";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import WhySection from "@/components/WhySection";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

const COSTUDY_BULLETS = [
  "50/10 Pomodoros",
  "All ages welcome",
  "Chatting during breaks",
  "Cozy community",
  "Regular cozy game streams"
];

const LIVE_SESSIONS_THIS_WEEK: number = 3;

export default function Page() {
  return (
    <main className="gradient-surface relative grain">
      <Header />
      <Hero />
      <Marquee />

      {/* Live this week pill → Study with us */}
      <section className="relative py-10">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <Reveal>
            <Link
              href="/study"
              className="group inline-flex items-center gap-3 rounded-full border border-ink-900/10 bg-cream-50 px-5 py-2.5 text-sm shadow-soft transition hover:-translate-y-0.5"
            >
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
              <span className="font-semibold text-ink-900">Live this week</span>
              <span className="text-ink-700">
                {LIVE_SESSIONS_THIS_WEEK} livestream{LIVE_SESSIONS_THIS_WEEK === 1 ? "" : "s"} on YouTube and Twitch
              </span>
              <span className="text-ink-900 transition group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Co-study section */}
      <section className="relative py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-6 md:grid-cols-12 lg:px-10">
          <Reveal className="relative md:col-span-6">
            <div
              className="absolute -inset-4 -z-10 rounded-[32px]"
              style={{ background: "#f3c6c2" }}
              aria-hidden
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/youtube-lifestyle.jpg"
              alt="Student studying at a warmly lit desk during a co-study session"
              className="ring-soft w-full rounded-[28px] object-cover"
              loading="lazy"
            />
          </Reveal>
          <Reveal className="md:col-span-6" delay={150}>
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-ink-700">
              Study with us · free livestreams
            </p>
            <h2 className="display-heading text-[clamp(2rem,3.5vw,3rem)] text-ink-900">
              Co-study sessions with focus timer and accountability.
            </h2>
            <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-ink-700">
              Drop in to join a community of StudyPuffs getting their things done.
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-2 text-sm text-ink-900/80 sm:grid-cols-2">
              {COSTUDY_BULLETS.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span aria-hidden className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-ink-900" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/study" className="btn-primary">
                See this week&apos;s schedule <span aria-hidden>→</span>
              </Link>
              <a
                href="https://www.twitch.tv/studypuffacademy"
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
              >
                Follow on Twitch
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <WhySection />
      <Testimonials />
      <FAQ />
      <Newsletter />
      <Footer />
    </main>
  );
}
