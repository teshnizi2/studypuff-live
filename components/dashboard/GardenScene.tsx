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
 * v18: themed-zone tile positions on the new td-map.webp.
 * The map has 5 painted zones — items now land in their thematic zone.
 *
 *   FARM       (top-left brown soil): carrots, pumpkins, hay bale, scarecrow, applestree
 *   FOREST     (top-right grass + edges): treehouse, mushrooms, fairy ring, snail, beehive
 *   HOMESTEAD  (center stone plaza): cottage, well, mailbox, signpost, bench, lantern, picnic
 *   POND       (bottom-left blue water): bridge, waterlilies, frog statue, birdbath, pond
 *   ROSE GARDEN (bottom-right grass): gazebo, flowerbed, gnome
 *
 * x, y in % of scene container. size in % of container width. Higher z = front.
 */
const TD_LAYOUT: Record<string, { x: number; y: number; size: number; z: number }> = {
  // v19 — new clean terrain map. Zones identified by ground texture, not painted props.
  //   FARM = brown soil patches (top half)
  //   HOMESTEAD = stone plaza / paths (mid)
  //   POND = blue water (bottom-left)
  //   ROSE GARDEN = grass area with soil ring (bottom-right)
  //   FOREST = upper-right grass + corners

  // ─── FARM zone (brown soil patches at top) ───
  "garden-vegpatch":     { x: 9,  y: 22, size: 9,  z: 5 },
  "garden-pumpkinpatch": { x: 22, y: 22, size: 10, z: 5 },
  "garden-haybale":      { x: 40, y: 22, size: 9,  z: 6 },
  "garden-applestree":   { x: 52, y: 18, size: 11, z: 4 },
  "garden-scarecrow":    { x: 67, y: 20, size: 9,  z: 5 },

  // ─── FOREST zone (top-right + edges) ───
  "garden-treehouse":    { x: 84, y: 22, size: 15, z: 4 },
  "garden-beehive":      { x: 94, y: 8,  size: 7,  z: 3 },
  "garden-mushrooms":    { x: 88, y: 42, size: 7,  z: 7 },
  "garden-fairyring":    { x: 78, y: 45, size: 8,  z: 7 },
  "garden-snail":        { x: 82, y: 53, size: 5,  z: 9 },

  // ─── HOMESTEAD zone (center stone/grass area) ───
  "garden-cottage":      { x: 47, y: 47, size: 14, z: 5 },
  "garden-well":         { x: 34, y: 50, size: 9,  z: 6 },
  "garden-picnic":       { x: 38, y: 38, size: 8,  z: 6 },
  "garden-lantern":      { x: 56, y: 38, size: 7,  z: 7 },
  "garden-mailbox":      { x: 58, y: 50, size: 7,  z: 6 },
  "garden-signpost":     { x: 42, y: 58, size: 7,  z: 7 },
  "garden-bench":        { x: 60, y: 60, size: 9,  z: 6 },

  // ─── POND zone (bottom-left blue water) ───
  "garden-bridge":       { x: 12, y: 60, size: 12, z: 8 },
  "garden-waterlilies":  { x: 16, y: 78, size: 8,  z: 8 },
  "garden-pond":         { x: 8,  y: 84, size: 11, z: 5 },
  "garden-frogstatue":   { x: 22, y: 85, size: 6,  z: 9 },
  "garden-birdbath":     { x: 26, y: 76, size: 8,  z: 7 },

  // ─── ROSE GARDEN zone (bottom-right) ───
  "garden-gazebo":       { x: 78, y: 78, size: 15, z: 5 },
  "garden-flowerbed":    { x: 66, y: 88, size: 10, z: 8 },
  "garden-gnome":        { x: 92, y: 88, size: 7,  z: 9 }
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
        <div className="relative aspect-[16/9] w-full">
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
