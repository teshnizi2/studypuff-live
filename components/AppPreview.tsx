// Server-rendered SVG mockup of the StudyPuff timer screen.
// Used on the home page so visitors see the real product before signing in.

import { Coins, CloudRain, Flame, MessageCircle } from "lucide-react";

const RING_RADIUS = 130;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const PROGRESS = 0.42; // ~10 of 25 minutes elapsed
const RING_OFFSET = RING_CIRCUMFERENCE * (1 - PROGRESS);
const ANGLE_DEG = -90 + 360 * PROGRESS;
const DOT_X = 150 + RING_RADIUS * Math.cos((ANGLE_DEG * Math.PI) / 180);
const DOT_Y = 150 + RING_RADIUS * Math.sin((ANGLE_DEG * Math.PI) / 180);

export default function AppPreview() {
  return (
    <div className="relative">
      {/* Ambient blob behind the device */}
      <span
        aria-hidden
        className="blob"
        style={{ left: -60, top: -60, width: 240, height: 240, background: "#c7e2c7" }}
      />
      <span
        aria-hidden
        className="blob"
        style={{ right: -40, bottom: -40, width: 200, height: 200, background: "#fbe9a5" }}
      />

      {/* Browser chrome */}
      <div className="relative mx-auto max-w-md rounded-[28px] border border-ink-900/10 bg-cream-50 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.25)]">
        <div className="flex items-center gap-2 border-b border-ink-900/5 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff6259]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <div className="ml-3 h-5 flex-1 rounded-full bg-cream-100" />
        </div>

        {/* Timer canvas */}
        <div className="rounded-b-[28px] bg-gradient-to-b from-[#dfead2] via-[#cfe0c2] to-[#bbd3ad] p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full bg-ink-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-cream-50">
                Focus · 25m
              </span>
              <span className="rounded-full bg-cream-50/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink-900">
                Short · 5m
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-50/80 px-2.5 py-1 text-[11px] font-semibold text-ink-900">
              <Coins className="h-3.5 w-3.5 text-amber-600" strokeWidth={2} aria-hidden />
              420
            </span>
          </div>

          {/* Ring + sheep */}
          <div className="my-2 flex flex-col items-center">
            <div className="relative h-[240px] w-[240px]">
              <svg viewBox="0 0 300 300" className="h-full w-full">
                <circle
                  cx={150}
                  cy={150}
                  r={RING_RADIUS}
                  fill="none"
                  stroke="rgba(0,0,0,0.12)"
                  strokeWidth={6}
                />
                <circle
                  cx={150}
                  cy={150}
                  r={RING_RADIUS}
                  fill="none"
                  stroke="#1f4d2c"
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={RING_OFFSET}
                  transform="rotate(-90 150 150)"
                />
                <circle cx={DOT_X} cy={DOT_Y} r={9} fill="#fff" stroke="#1f4d2c" strokeWidth={3} />
              </svg>
              <div className="absolute inset-[18%] flex items-center justify-center overflow-hidden rounded-full bg-[#5b8a55]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/studypuff-sheep.png"
                  alt=""
                  className="h-[78%] w-[78%] object-contain"
                />
              </div>
            </div>
            <p className="mt-4 font-display text-5xl tabular-nums tracking-[0.05em] text-ink-900">
              14:42
            </p>
            <p className="mt-1 text-xs text-ink-700">
              Working on <strong className="text-ink-900">Calculus chapter 3</strong>
            </p>
          </div>

          {/* Controls */}
          <div className="mt-3 flex justify-center gap-2">
            <span className="rounded-full bg-cream-50 px-4 py-2 text-xs font-semibold text-ink-900 shadow-soft">
              Change task
            </span>
            <span className="rounded-full bg-ink-900 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-cream-50">
              Pause
            </span>
            <span className="rounded-full bg-cream-50 px-4 py-2 text-xs font-semibold text-ink-900 shadow-soft">
              Reset
            </span>
          </div>
        </div>
      </div>

      {/* Floating mini cards around the device for "alive" feel */}
      <div className="pointer-events-none absolute -left-4 top-1/4 hidden rotate-[-6deg] items-center gap-2 rounded-2xl bg-cream-50 px-3 py-2 text-xs font-semibold shadow-soft ring-1 ring-black/5 sm:inline-flex">
        <CloudRain className="h-4 w-4 text-sky-700" strokeWidth={1.75} aria-hidden />
        Rain · ambient
      </div>
      <div className="pointer-events-none absolute -right-4 top-12 hidden rotate-[5deg] items-center gap-2 rounded-2xl bg-cream-50 px-3 py-2 text-xs font-semibold shadow-soft ring-1 ring-black/5 sm:inline-flex">
        <Flame className="h-4 w-4 text-orange-600" strokeWidth={1.75} aria-hidden />
        Streak · 12 days
      </div>
      <div className="pointer-events-none absolute -bottom-4 right-10 hidden rotate-[-3deg] items-center gap-2 rounded-2xl bg-cream-50 px-3 py-2 text-xs font-semibold shadow-soft ring-1 ring-black/5 sm:inline-flex">
        <MessageCircle className="h-4 w-4 text-emerald-700" strokeWidth={1.75} aria-hidden />
        3 friends in your room
      </div>
    </div>
  );
}
