import Link from "next/link";
import Reveal from "./Reveal";
import { StudyingNow } from "./StudyingNow";

export default function Hero() {
  return (
    <section className="relative overflow-x-hidden">
      <span
        className="blob animate-float"
        style={{ left: "-80px", top: "80px", width: 260, height: 260, background: "#f3c6c2" }}
      />
      <span
        className="blob animate-bobble"
        style={{ right: "-60px", top: "10px", width: 220, height: 220, background: "#fbe9a5" }}
      />
      <span
        className="blob animate-float"
        style={{ left: "40%", bottom: "-60px", width: 280, height: 280, background: "#c6dceb" }}
      />

      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-6 pb-16 pt-10 md:grid-cols-12 lg:px-10 lg:pb-20 lg:pt-14">
        <div className="md:col-span-7">
          <Reveal>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink-900/15 bg-cream-50/70 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-ink-700 backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-ink-900 animate-pulse" />
              Cozy · science-based · student-led
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="display-heading text-[clamp(2.5rem,5.5vw,4.5rem)] text-ink-900">
              Small progress, <em className="italic">is still</em> progress.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-ink-700">
              StudyPuff is the home for students who want to improve their performance, without
              burning out. Join a workshop, drop into a free livestream, or use one of our free
              templates.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/workshops" className="btn-primary">
                Join a workshop <span aria-hidden>→</span>
              </Link>
              <Link href="/study" className="btn-outline">
                Try a free session
              </Link>
            </div>
          </Reveal>
          <Reveal delay={400}>
            <div className="mt-10 flex items-center gap-4 text-sm text-ink-700">
              <div className="flex -space-x-2">
                {["#f3c6c2", "#fbe9a5", "#c7e2c7", "#c6dceb", "#d9cdea"].map((c, i) => (
                  <span
                    key={i}
                    className="inline-block h-8 w-8 rounded-full border-2 border-cream-50"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <p>
                <strong className="text-ink-900">17,074+</strong> students · 46 countries
              </p>
            </div>
          </Reveal>
        </div>

        <div className="relative md:col-span-5">
          <Reveal delay={150} className="relative mx-auto max-w-md">
            <div
              className="absolute inset-0 -z-10 mx-auto my-auto h-[85%] w-[85%] rounded-full"
              style={{ background: "radial-gradient(circle, #fbe9a5 0%, transparent 70%)" }}
              aria-hidden
            />
            <Link
              href="/dashboard"
              className="group relative block animate-float"
              aria-label="Open the StudyPuff app"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/studypuff-hero.png"
                alt="StudyPuff sheep mascot — open the app"
                className="h-auto w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.12)] transition group-hover:-translate-y-1"
              />
              <div className="pointer-events-none absolute -bottom-2 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-cream-50 px-4 py-2 text-xs font-semibold text-ink-900 shadow-soft ring-1 ring-black/5">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                <StudyingNow />
                <span aria-hidden>→</span>
              </div>
            </Link>

            <svg
              className="absolute -left-4 top-10 animate-wiggle text-ink-900"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M12 2l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" />
            </svg>
            <svg
              className="absolute right-6 top-2 animate-wiggle text-ink-900"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M12 2l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" />
            </svg>
            <svg
              className="absolute -right-2 bottom-10 animate-wiggle text-ink-900"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M12 2l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" />
            </svg>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
