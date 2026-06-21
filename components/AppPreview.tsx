// Server-rendered mockup of the StudyPuff® focus screen.
// Mirrors the current app: commit-or-forfeit focus (no pause / no reset),
// three text modes, inline ambient sound, a living garden, streaks, and rooms.

import { CloudRain, Flame, Leaf, Users } from "lucide-react";

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
      {/* Ambient blobs behind the device */}
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
          {/* Mode picker — three text modes */}
          <div className="mb-3 flex items-center gap-2 font-display text-sm">
            <span className="italic text-ink-900">focus</span>
            <span className="text-[11px] font-semibold text-ink-700/70">25m</span>
            <span className="text-ink-900/25">·</span>
            <span className="italic text-ink-700/70">short</span>
            <span className="text-ink-900/25">·</span>
            <span className="italic text-ink-700/70">long</span>
          </div>

          {/* Ring + sheep */}
          <div className="my-2 flex flex-col items-center">
            <div className="relative h-[240px] w-[240px]">
              <svg viewBox="0 0 300 300" className="h-full w-full">
                <defs>
                  <linearGradient id="sp-ring" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5fbf6f" />
                    <stop offset="55%" stopColor="#3a8a4c" />
                    <stop offset="100%" stopColor="#1a4d2a" />
                  </linearGradient>
                </defs>
                <circle
                  cx={150}
                  cy={150}
                  r={RING_RADIUS}
                  fill="none"
                  stroke="rgba(0,0,0,0.12)"
                  strokeWidth={7}
                />
                <circle
                  cx={150}
                  cy={150}
                  r={RING_RADIUS}
                  fill="none"
                  stroke="url(#sp-ring)"
                  strokeWidth={7}
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={RING_OFFSET}
                  transform="rotate(-90 150 150)"
                />
                {/* Glowing progress head */}
                <circle cx={DOT_X} cy={DOT_Y} r={16} fill="#a8e6b0" opacity={0.55} />
                <circle cx={DOT_X} cy={DOT_Y} r={9} fill="#fff" stroke="#1f4d2c" strokeWidth={3} />
              </svg>
              <div className="absolute inset-[18%] flex items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_35%,#6ea866,#4a7044)] shadow-[inset_0_-8px_20px_rgba(0,0,0,0.18)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/studypuff-sheep.png"
                  alt=""
                  className="h-[78%] w-[78%] animate-breathe object-contain"
                />
              </div>
            </div>

            <p className="mt-4 font-display text-4xl tabular-nums tracking-[0.05em] text-ink-900">
              14:42
            </p>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-700">
              Working on
            </p>
            <p className="text-sm italic text-ink-900">Calculus · Chapter 3</p>
          </div>

          {/* Commit-or-forfeit state: no pause, no reset */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-cream-50/85 px-4 py-2 text-xs font-semibold text-ink-900 shadow-soft">
              <span className="relative flex h-2.5 w-2.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4a7044] opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#1f4d2c]" />
              </span>
              Focusing
            </span>
            <p className="text-[11px] text-ink-700">
              Coins only land when you finish.{" "}
              <span className="font-semibold text-ink-900 underline underline-offset-2">
                Give up session
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Floating mini cards — current features, for an "alive" feel */}
      <div className="pointer-events-none absolute -left-6 top-[24%] hidden rotate-[-6deg] items-center gap-2 rounded-2xl bg-cream-50 px-3 py-2 text-xs font-semibold shadow-soft ring-1 ring-black/5 sm:inline-flex">
        <CloudRain className="h-4 w-4 text-sky-700" strokeWidth={1.75} aria-hidden />
        Soft rain
      </div>
      <div className="pointer-events-none absolute -right-6 top-8 hidden rotate-[5deg] items-center gap-2 rounded-2xl bg-cream-50 px-3 py-2 text-xs font-semibold shadow-soft ring-1 ring-black/5 sm:inline-flex">
        <Flame className="h-4 w-4 text-orange-600" strokeWidth={1.75} aria-hidden />
        12 day streak
      </div>
      <div className="pointer-events-none absolute -left-6 top-[56%] hidden rotate-[4deg] items-center gap-2 rounded-2xl bg-cream-50 px-3 py-2 text-xs font-semibold shadow-soft ring-1 ring-black/5 sm:inline-flex">
        <Leaf className="h-4 w-4 text-emerald-600" strokeWidth={1.75} aria-hidden />
        Garden · +1 leaf
      </div>
      <div className="pointer-events-none absolute -bottom-5 right-8 hidden rotate-[-3deg] items-center gap-2 rounded-2xl bg-cream-50 px-3 py-2 text-xs font-semibold shadow-soft ring-1 ring-black/5 sm:inline-flex">
        <Users className="h-4 w-4 text-emerald-700" strokeWidth={1.75} aria-hidden />
        4 friends in your room
      </div>
    </div>
  );
}
