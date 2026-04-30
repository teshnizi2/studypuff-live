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

const COSTUDY_BULLETS: { icon: string; label: string }[] = [
  { icon: "⏰", label: "50/10 Pomodoros" },
  { icon: "🌍", label: "All ages welcome" },
  { icon: "💬", label: "Chatting during breaks" },
  { icon: "🫶", label: "Cozy community" },
  { icon: "🎮", label: "Regular cozy game streams" }
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
              your things done alongside students from 46 countries.
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2">
              {COSTUDY_BULLETS.map((b) => (
                <li
                  key={b.label}
                  className="flex items-center gap-3 rounded-2xl bg-cream-50/70 px-3 py-2 text-ink-900"
                >
                  <span className="text-lg" aria-hidden>{b.icon}</span>
                  <span className="font-semibold">{b.label}</span>
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

      {/* PLNT partnership — compact */}
      <section className="relative pb-8">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10">
          <Reveal>
            <div className="flex flex-col items-center gap-5 rounded-[24px] border border-ink-900/10 bg-cream-50 px-6 py-6 text-center shadow-soft sm:flex-row sm:gap-8 sm:text-left">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/plnt-logo.png"
                alt="PLNT Leiden"
                className="h-12 w-auto shrink-0 object-contain"
              />
              <div className="flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-700">
                  Proud partner
                </p>
                <p className="mt-1 text-sm text-ink-700">
                  <span className="font-display text-base text-ink-900">In partnership with PLNT.</span>{" "}
                  We host our in-person workshops at PLNT — a student incubator in Leiden.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Testimonials />
      <FAQ />
      <Newsletter />
      <Footer />
    </main>
  );
}
