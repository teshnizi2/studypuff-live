"use client";

import { useEffect, useMemo, useState } from "react";
import { REWARDS, type Reward } from "@/lib/app-data/rewards";

type Props = {
  lifetimeMinutes: number;
  todayMinutes: number;
  streak: number;
  /** IDs of every reward the user has purchased. We filter to the
   *  garden-category items and place each one in the scene. */
  ownedItemIds: string[];
};

const MINUTES_PER_LEAF = 25;
const MAX_LEAVES = 80;

function stageFor(m: number): { name: string; scale: number; sat: number } {
  if (m < 30)   return { name: "A tiny sprout", scale: 0.62, sat: 0.7 };
  if (m < 180)  return { name: "A young sapling", scale: 0.76, sat: 0.85 };
  if (m < 720)  return { name: "Branching out", scale: 0.9, sat: 0.95 };
  if (m < 3000) return { name: "A leafy canopy", scale: 1.02, sat: 1 };
  return { name: "A grand old tree", scale: 1.08, sat: 1.05 };
}

/**
 * The garden world — a wide illustrated scene with the user's focus tree at
 * the centre, the bespoke meadow as backdrop, and every purchased garden
 * item placed at its predetermined coordinate. Stats and a progress bar to
 * the next leaf sit below the scene.
 */
export function GardenScene({ lifetimeMinutes, todayMinutes, streak, ownedItemIds }: Props) {
  // DEBUG TEST MODE — same accelerated tick as the modal version, so the
  // user can verify growth on the new page too. Remove or gate behind a
  // query param when verification is done.
  const [extraMinutes, setExtraMinutes] = useState(0);
  const [testMode, setTestMode] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
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

  const ownedSet = useMemo(() => new Set(ownedItemIds), [ownedItemIds]);
  const placedItems = useMemo(
    () => REWARDS.filter((r): r is Reward & { placement: NonNullable<Reward["placement"]> } =>
      r.category === "garden" && !!r.placement && ownedSet.has(r.id)
    ),
    [ownedSet]
  );

  return (
    <section className="flex flex-col items-center">
      {/* The garden world — a wide rounded card with layered art. */}
      <div className="relative w-full overflow-hidden rounded-[28px] border border-white/60 shadow-[0_30px_60px_-30px_rgba(31,77,44,0.45),inset_0_1px_0_rgba(255,255,255,0.7)]">
        {/* Sky */}
        <div className="aspect-[16/8] w-full bg-gradient-to-b from-[#cfe7ea] via-[#e3eedd] to-[#cfe1b7]" />

        {/* Meadow band (illustrated) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%]"
          style={{
            backgroundImage: "url(/garden-meadow.webp)",
            backgroundSize: "cover",
            backgroundPosition: "bottom center",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 22%, #000 100%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, #000 22%, #000 100%)"
          }}
        />

        {/* Soft sun glow upper area */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[6%] h-[40%] w-[55%] -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(251,233,165,0.55), transparent 70%)" }}
        />

        {/* Central tree — bespoke art, scaled by stage. */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[50%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/garden-tree.webp"
            alt={`Your focus tree — ${stage.name.toLowerCase()}`}
            className="block h-auto w-[clamp(180px,32%,360px)] origin-bottom transition-all duration-700 ease-out"
            style={{ transform: `scale(${stage.scale})`, filter: `saturate(${stage.sat})` }}
          />
        </div>

        {/* The brand sheep, peeking out from beside the tree. */}
        <div className="absolute left-[42%] top-[58%] -translate-x-1/2 w-[clamp(48px,7%,90px)]" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/studypuff-sheep.png" alt="" className="h-auto w-full drop-shadow-[0_6px_10px_rgba(31,77,44,0.25)]" />
        </div>

        {/* Owned garden items — placed at their predetermined coordinates. */}
        {placedItems.map((item) => {
          const { x, y, scale = 1 } = item.placement;
          return (
            <div
              key={item.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 select-none"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                fontSize: `calc(36px * ${scale})`,
                lineHeight: 1,
                filter: "drop-shadow(0 6px 10px rgba(31,77,44,0.25))"
              }}
              title={item.name}
              aria-label={item.name}
            >
              <span aria-hidden>{item.emoji}</span>
            </div>
          );
        })}

        {/* Bottom edge subtle vignette — seats the scene. */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{
          background: "radial-gradient(120% 80% at 50% 40%, transparent 55%, rgba(31,45,30,0.12) 100%)"
        }} />

        {/* Empty-garden hint */}
        {placedItems.length === 0 && (
          <div className="absolute bottom-3 right-4 max-w-[60%] text-right text-[11px] italic text-ink-700/75">
            Your garden grows with focus — and with items from the shop below.
          </div>
        )}
      </div>

      {/* Stage + progress strip */}
      <div className="mt-6 w-full max-w-[640px] text-center">
        <p className="font-display text-2xl italic text-ink-900">{stage.name}.</p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-ink-700/75">
          {leafCount} {leafCount === 1 ? "leaf" : "leaves"}
          {streak > 0 && <span className="ml-2">· {streak}-day streak</span>}
          {todayLeaves > 0 && <span className="ml-2 font-semibold text-emerald-700">· +{todayLeaves} today</span>}
        </p>

        {leafCount < MAX_LEAVES && (
          <div className="mt-5">
            <div className="mb-1.5 flex items-baseline justify-between text-[10px] uppercase tracking-[0.22em] text-ink-700/70">
              <span>next leaf</span>
              <span className="tabular-nums">{Math.max(1, MINUTES_PER_LEAF - intoNext)}m to go</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink-900/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-[width] duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-ink-700/55">
          one leaf grows every {MINUTES_PER_LEAF} min of focus
        </p>
        {testMode && (
          <p className="mt-2 inline-block rounded-full bg-rose-100 px-3 py-0.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-rose-700">
            test mode · 5s = 25 min
          </p>
        )}
      </div>
    </section>
  );
}
