"use client";

import { useEffect, useState } from "react";

type Props = {
  /** Total focus minutes accumulated lifetime. Drives stage + leaf count. */
  lifetimeMinutes: number;
  /** Minutes today — surfaces a "+N today" highlight. */
  todayMinutes?: number;
  /** Completed tasks (lifetime) — shown as a small stat. */
  tasksDone?: number;
  /** Current streak in days. */
  streak?: number;
};

const MINUTES_PER_LEAF = 25;
const MAX_LEAVES = 80;

function stageFor(m: number): { name: string; scale: number; sat: number } {
  if (m < 30)   return { name: "A tiny sprout", scale: 0.6, sat: 0.7 };
  if (m < 180)  return { name: "A young sapling", scale: 0.74, sat: 0.85 };
  if (m < 720)  return { name: "Branching out", scale: 0.88, sat: 0.95 };
  if (m < 3000) return { name: "A leafy canopy", scale: 1.0, sat: 1 };
  return { name: "A grand old tree", scale: 1.06, sat: 1.05 };
}

/**
 * The garden modal — celebrates the user's focus tree. The tree itself is a
 * bespoke flat illustration (matching the dashboard scene); growth is conveyed
 * by the stage name, a gentle scale-up across stages, the leaf count, and a
 * live progress bar toward the next leaf. One leaf per 25 focus minutes.
 */
export function GrowthTree({ lifetimeMinutes, todayMinutes = 0, tasksDone = 0, streak = 0 }: Props) {
  // DEBUG TEST MODE — visit /dashboard?growthtest=1 to fast-grow the garden:
  // ticks +5 minutes every second, so a leaf pops every 5 seconds.
  // Disabled by default; remove this block when no longer needed.
  const [extraMinutes, setExtraMinutes] = useState(0);
  const [testMode, setTestMode] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const on = new URLSearchParams(window.location.search).get("growthtest") === "1";
    if (!on) return;
    setTestMode(true);
    const id = window.setInterval(() => setExtraMinutes((m) => m + 5), 1000);
    return () => window.clearInterval(id);
  }, []);
  const effectiveLifetime = lifetimeMinutes + extraMinutes;
  const effectiveToday = todayMinutes + extraMinutes;

  const leafCount = Math.min(MAX_LEAVES, Math.floor(effectiveLifetime / MINUTES_PER_LEAF));
  const todayLeaves = Math.floor(effectiveToday / MINUTES_PER_LEAF);
  const intoNext = effectiveLifetime % MINUTES_PER_LEAF;
  const pct = Math.round((intoNext / MINUTES_PER_LEAF) * 100);
  const stage = stageFor(effectiveLifetime);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Tree hero in a soft sky card. */}
      <div className="relative w-full max-w-[300px] overflow-hidden rounded-[26px] border border-white/60 bg-gradient-to-b from-[#fdfbf7] via-[#f4ead9] to-[#e6e0cc] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-5 h-44 w-44 -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(251,233,165,0.6), transparent)" }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/garden-tree.webp"
          alt={`Your focus tree — ${stage.name.toLowerCase()}`}
          className="relative mx-auto block w-full max-w-[260px] origin-bottom transition-all duration-700 ease-out"
          style={{ transform: `scale(${stage.scale})`, filter: `saturate(${stage.sat})` }}
        />
      </div>

      {/* Stage + stats. */}
      <div className="w-full max-w-[300px] text-center">
        <p className="font-display text-lg italic text-ink-900">{stage.name}.</p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.26em] text-ink-700/75">
          {leafCount} {leafCount === 1 ? "leaf" : "leaves"}
          {streak > 0 && <span className="ml-2">· {streak}-day streak</span>}
          {todayLeaves > 0 && <span className="ml-2 font-semibold text-emerald-700">· +{todayLeaves} today</span>}
        </p>

        {leafCount < MAX_LEAVES && (
          <div className="mt-4">
            <div className="mb-1.5 flex items-baseline justify-between text-[10px] uppercase tracking-[0.2em] text-ink-700/70">
              <span>next leaf</span>
              <span className="tabular-nums">{Math.max(1, MINUTES_PER_LEAF - intoNext)}m to go</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-ink-900/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-[width] duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        <p className="mt-3 text-[9px] uppercase tracking-[0.24em] text-ink-700/55">
          one leaf grows every {MINUTES_PER_LEAF} min of focus
          {tasksDone > 0 && <span> · {tasksDone} tasks done</span>}
        </p>
        {testMode && (
          <p className="mt-2 inline-block rounded-full bg-rose-100 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-rose-700">
            test mode · 5s = 25 min
          </p>
        )}
      </div>
    </div>
  );
}
