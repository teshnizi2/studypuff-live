import Link from "next/link";
import Reveal from "./Reveal";
import { StudyingNow } from "./StudyingNow";

export default function Hero() {
  return (
    <section className="relative">
      <span
        className="blob"
        style={{ left: "-80px", top: "80px", width: 260, height: 260, background: "#f3c6c2" }}
      />
      <span
        className="blob"
        style={{ right: "-60px", top: "10px", width: 220, height: 220, background: "#fbe9a5" }}
      />
      <span
        className="blob"
        style={{ left: "40%", bottom: "-60px", width: 280, height: 280, background: "#c6dceb" }}
      />

      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-6 pb-16 pt-10 md:grid-cols-12 lg:px-10 lg:pb-20 lg:pt-14">
        <div className="md:col-span-7">
          <Reveal>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-ink-900/15 bg-cream-50/70 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-ink-700 backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-ink-900 animate-pulse" />
              Cozy · science-based · student-led
            </p>
          </Reveal>
          <Reveal delay={50}>
            <p className="mb-4 text-base font-semibold text-ink-700 sm:text-lg">
              A cozy study app + community for students.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="display-heading text-[clamp(2.5rem,5.5vw,4.5rem)] text-ink-900">
              Small progress,{" "}
              <span className="relative inline-block">
                <em className="italic">is still</em>
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
              </span>{" "}
              progress.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-ink-700">
              Join free livestreams, use our focus timer + co-study rooms, and learn how to study
              without burning out. No credit card needed.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/study" className="btn-primary">
                Try a free session <span aria-hidden>→</span>
              </Link>
              <Link href="/workshops" className="btn-outline">
                Browse workshops
              </Link>
            </div>
          </Reveal>
          <Reveal delay={400}>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-700">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[
                    { c: "#f3c6c2", l: "A" },
                    { c: "#fbe9a5", l: "M" },
                    { c: "#c7e2c7", l: "T" },
                    { c: "#c6dceb", l: "L" },
                    { c: "#d9cdea", l: "S" }
                  ].map((a, i) => (
                    <span
                      key={i}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-cream-50 text-xs font-semibold text-ink-900"
                      style={{ background: a.c }}
                    >
                      {a.l}
                    </span>
                  ))}
                </div>
                <p>
                  <strong className="text-ink-900">17,074+</strong> students
                </p>
              </div>
              <span className="hidden h-4 w-px bg-ink-900/15 sm:inline-block" aria-hidden />
              <p>🌍 46 countries</p>
              <span className="hidden h-4 w-px bg-ink-900/15 sm:inline-block" aria-hidden />
              <p>⭐ 4.9 rating</p>
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
              className="group relative block focus-visible:outline-none"
              aria-label="Open the StudyPuff app"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/studypuff-hero-md.png"
                alt="StudyPuff sheep mascot — open the app"
                width={800}
                height={800}
                className="h-auto w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.12)] transition duration-300 ease-out group-hover:-translate-y-1.5 group-hover:rotate-[-2deg] group-active:scale-[0.98]"
              />
              <div className="pointer-events-none absolute -bottom-2 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-cream-50 px-4 py-2 text-xs font-semibold text-ink-900 shadow-soft ring-1 ring-black/5">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                <StudyingNow />
                <span aria-hidden>→</span>
              </div>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
