"use client";

import { useEffect, useMemo, useState } from "react";
import { REWARDS, isGardenCategory, type Reward } from "@/lib/app-data/rewards";

type Props = {
  lifetimeMinutes: number;
  todayMinutes: number;
  streak: number;
  ownedItemIds: string[];
};

const MINUTES_PER_LEAF = 25;
const MAX_LEAVES = 80;

function stageFor(m: number): { name: string; scale: number } {
  if (m < 30)   return { name: "A tiny sprout", scale: 0.65 };
  if (m < 180)  return { name: "A young sapling", scale: 0.82 };
  if (m < 720)  return { name: "Branching out", scale: 0.95 };
  if (m < 3000) return { name: "A leafy canopy", scale: 1.08 };
  return { name: "A grand old tree", scale: 1.16 };
}

/**
 * Top-down / tile-position config for each garden item.
 * x, y are % of scene container (0=left/top, 100=right/bottom).
 * size is % of container width.
 * Lower z = drawn behind, higher z = drawn in front.
 */
const TD_LAYOUT: Record<string, { x: number; y: number; size: number; z: number }> = {
  // Centerpieces
  "garden-cottage":      { x: 18, y: 55, size: 22, z: 5 },
  "garden-treehouse":    { x: 80, y: 48, size: 22, z: 5 },
  "garden-gazebo":       { x: 60, y: 50, size: 18, z: 4 },
  "garden-well":         { x: 38, y: 70, size: 13, z: 6 },

  // Path / functional
  "garden-bridge":       { x: 8, y: 88, size: 14, z: 7 },
  "garden-signpost":     { x: 28, y: 78, size: 8, z: 7 },
  "garden-mailbox":      { x: 14, y: 70, size: 8, z: 6 },
  "garden-lantern":      { x: 48, y: 82, size: 8, z: 8 },
  "garden-bench":        { x: 70, y: 70, size: 11, z: 6 },

  // Plants and bounty
  "garden-applestree":   { x: 32, y: 50, size: 14, z: 4 },
  "garden-pond":         { x: 88, y: 82, size: 14, z: 7 },
  "garden-pumpkinpatch": { x: 36, y: 85, size: 11, z: 8 },
  "garden-vegpatch":     { x: 50, y: 88, size: 10, z: 8 },
  "garden-flowerbed":    { x: 22, y: 88, size: 9, z: 8 },
  "garden-haybale":      { x: 64, y: 86, size: 10, z: 8 },
  "garden-mushrooms":    { x: 58, y: 78, size: 7, z: 7 },
  "garden-waterlilies":  { x: 79, y: 92, size: 8, z: 9 },

  // Critters and whimsy
  "garden-scarecrow":    { x: 45, y: 65, size: 12, z: 5 },
  "garden-gnome":        { x: 26, y: 88, size: 6, z: 9 },
  "garden-birdbath":     { x: 72, y: 60, size: 10, z: 5 },
  "garden-frogstatue":   { x: 86, y: 90, size: 6, z: 9 },
  "garden-snail":        { x: 18, y: 93, size: 5, z: 9 },
  "garden-beehive":      { x: 10, y: 20, size: 9, z: 3 },
  "garden-picnic":       { x: 56, y: 70, size: 10, z: 6 },
  "garden-fairyring":    { x: 90, y: 70, size: 8, z: 7 }
};

type Tod = "dawn" | "day" | "dusk" | "night";

/**
 * Garden v17 — top-down 2D RPG tile composite (Stardew-style).
 *
 * The map is a single painted top-down garden plot. Each owned item is an
 * isolated alpha-PNG tile that gets absolute-positioned at its designated
 * grid coordinate. Top-down view means no perspective mismatch — items
 * compose cleanly because they're all designed flat from above.
 *
 * Every purchase adds the corresponding tile to the scene immediately.
 */
export function GardenScene({ lifetimeMinutes, todayMinutes, streak, ownedItemIds }: Props) {
  const leafCount = Math.min(MAX_LEAVES, Math.floor(lifetimeMinutes / MINUTES_PER_LEAF));
  const todayLeaves = Math.floor(todayMinutes / MINUTES_PER_LEAF);
  const intoNext = lifetimeMinutes % MINUTES_PER_LEAF;
  const pct = Math.round((intoNext / MINUTES_PER_LEAF) * 100);
  const stage = stageFor(lifetimeMinutes);

  const ownedSet = useMemo(() => new Set(ownedItemIds), [ownedItemIds]);
  const placedItems = useMemo(
    () => REWARDS.filter((r) => isGardenCategory(r.category) && ownedSet.has(r.id) && TD_LAYOUT[r.id]),
    [ownedSet]
  );
  const ownedGardenCount = placedItems.length;
  const totalGardenCount = REWARDS.filter((r) => isGardenCategory(r.category)).length;

  // Day/night
  const [tod, setTod] = useState<Tod>("day");
  useEffect(() => {
    if (typeof document === "undefined") return;
    const read = () => setTod((document.documentElement.dataset.tod || "day") as Tod);
    read();
    const id = window.setInterval(read, 60_000);
    return () => clearInterval(id);
  }, []);
  const isNight = tod === "night";

  const mapTone = isNight
    ? "saturate(0.55) brightness(0.55) hue-rotate(-10deg)"
    : tod === "dusk" ? "saturate(0.95) brightness(0.92) hue-rotate(8deg)"
    : tod === "dawn" ? "saturate(0.92) brightness(1.02) hue-rotate(-4deg)"
    : "none";

  return (
    <section className="flex flex-col items-center">
      <div
        className="relative w-full overflow-hidden rounded-[28px] border border-white/60 shadow-[0_30px_60px_-30px_rgba(31,77,44,0.45),inset_0_1px_0_rgba(255,255,255,0.7)]"
        data-tod={tod}
      >
        <div className="relative aspect-[16/8] w-full">
          {/* Base top-down map */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/td-map.webp"
            alt="Your garden plot"
            className="absolute inset-0 block h-full w-full object-cover transition-[filter] duration-1000 ease-in-out"
            style={{ filter: mapTone }}
          />

          {/* Night sky overlay */}
          {isNight && (
            <div aria-hidden className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(to bottom, rgba(20,22,58,0.5) 0%, rgba(40,40,90,0.4) 60%, rgba(28,28,60,0.55) 100%)" }} />
          )}
          {(tod === "dusk" || tod === "dawn") && (
            <div aria-hidden className="pointer-events-none absolute inset-0"
              style={{ background: tod === "dusk"
                ? "linear-gradient(to bottom, rgba(255,140,90,0.18) 0%, rgba(255,170,120,0.08) 50%, rgba(255,200,160,0.04) 100%)"
                : "linear-gradient(to bottom, rgba(255,200,140,0.16) 0%, rgba(255,220,180,0.06) 50%, rgba(255,240,210,0.02) 100%)" }} />
          )}

          {/* Owned items, each at its tile coord */}
          {placedItems.map((item) => {
            const layout = TD_LAYOUT[item.id];
            return (
              <div
                key={item.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 td-item-pop"
                style={{
                  left: `${layout.x}%`,
                  top: `${layout.y}%`,
                  width: `${layout.size}%`,
                  zIndex: layout.z
                }}
                title={item.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/td-items/${item.id.replace("garden-", "")}.webp`}
                  alt={item.name}
                  className="block h-auto w-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]"
                  style={{ filter: isNight ? "brightness(0.72) saturate(0.8)" : "none" }}
                />
              </div>
            );
          })}

          {/* Tiny day/season HUD top-right */}
          <div className="pointer-events-none absolute right-3 top-3 z-50 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-700 shadow-[0_4px_10px_rgba(31,77,44,0.18)] backdrop-blur-sm">
            {tod === "dawn" ? "🌄" : tod === "day" ? "🌤️" : tod === "dusk" ? "🌇" : "🌙"} {tod}
          </div>
        </div>

        <style jsx>{`
          .td-item-pop {
            animation: tdItemPop 420ms cubic-bezier(0.34, 1.5, 0.64, 1) both;
            transition: transform 250ms ease-out;
            cursor: pointer;
          }
          .td-item-pop:hover {
            transform: translate(-50%, -50%) scale(1.08);
            z-index: 20 !important;
          }
          @keyframes tdItemPop {
            0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.4); }
            70%  { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
            100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
          @media (prefers-reduced-motion: reduce) {
            .td-item-pop { animation: none !important; }
          }
        `}</style>
      </div>

      {/* Stage + progress strip */}
      <div className="mt-7 w-full max-w-[640px] text-center">
        <p className="font-display text-2xl italic text-ink-900">{stage.name}.</p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-ink-700/75">
          {leafCount} {leafCount === 1 ? "leaf" : "leaves"}
          {streak > 0 && <span className="ml-2">· {streak}-day streak</span>}
          {todayLeaves > 0 && <span className="ml-2 font-semibold text-emerald-700">· +{todayLeaves} today</span>}
        </p>

        <div className="mt-5 rounded-2xl border border-white/60 bg-gradient-to-br from-cream-50 to-brand-butter/30 p-4">
          <div className="flex items-baseline justify-between text-[10px] uppercase tracking-[0.22em] text-ink-700/80">
            <span>your garden</span>
            <span className="font-semibold text-ink-900">
              {ownedGardenCount} / {totalGardenCount} items
            </span>
          </div>
          <div className="mt-2 flex items-center gap-[2px]">
            {Array.from({ length: totalGardenCount }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-700
                  ${idx < ownedGardenCount
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                    : "bg-ink-900/10"}`}
              />
            ))}
          </div>
          <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-ink-700/70">
            every purchase drops onto the map immediately
          </p>
        </div>

        {leafCount < MAX_LEAVES && (
          <div className="mt-5">
            <div className="mb-1.5 flex items-baseline justify-between text-[10px] uppercase tracking-[0.22em] text-ink-700/70">
              <span>next leaf</span>
              <span className="tabular-nums">{Math.max(1, MINUTES_PER_LEAF - intoNext)}m to go</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink-900/10">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-[width] duration-700" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-ink-700/55">
          one leaf grows every {MINUTES_PER_LEAF} min of focus · hover an item to lift it
        </p>
      </div>
    </section>
  );
}
