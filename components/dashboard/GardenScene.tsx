"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

function stageFor(m: number): { name: string; scale: number } {
  if (m < 30)   return { name: "A tiny sprout", scale: 0.62 };
  if (m < 180)  return { name: "A young sapling", scale: 0.78 };
  if (m < 720)  return { name: "Branching out", scale: 0.92 };
  if (m < 3000) return { name: "A leafy canopy", scale: 1.04 };
  return { name: "A grand old tree", scale: 1.1 };
}

type Placed = Reward & { placement: NonNullable<Reward["placement"]>; art: NonNullable<Reward["art"]> };

/**
 * The garden world — a wide illustrated scene with the user's focus tree at
 * the centre, a bespoke "clean meadow" backdrop (rolling hills + sky only),
 * and every purchased garden item placed as a true-alpha PNG sprite.
 *
 * Depth comes from two layers of motion: every layer translates a little
 * with the cursor (foreground items more than the meadow), AND the scene
 * itself tilts a few degrees on the X/Y axes for real 3D perspective. The
 * effect feels physical, not stickery. Reduced-motion gives zero tilt.
 */
export function GardenScene({ lifetimeMinutes, todayMinutes, streak, ownedItemIds }: Props) {
  const leafCount = Math.min(MAX_LEAVES, Math.floor(lifetimeMinutes / MINUTES_PER_LEAF));
  const todayLeaves = Math.floor(todayMinutes / MINUTES_PER_LEAF);
  const intoNext = lifetimeMinutes % MINUTES_PER_LEAF;
  const pct = Math.round((intoNext / MINUTES_PER_LEAF) * 100);
  const stage = stageFor(lifetimeMinutes);

  const ownedSet = useMemo(() => new Set(ownedItemIds), [ownedItemIds]);
  const placedItems: Placed[] = useMemo(
    () =>
      REWARDS.filter((r): r is Placed =>
        r.category === "garden" && !!r.placement && !!r.art && ownedSet.has(r.id)
      ),
    [ownedSet]
  );

  // Mouse-driven parallax + perspective tilt. Cursor offset from scene
  // centre drives:
  //   - a translate on each depth layer (foreground items move more);
  //   - a few-degree rotateX/rotateY on the whole scene for real depth.
  // Reduced-motion users get zero motion. We use rAF-throttled state.
  const sceneRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = sceneRef.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setTilt({ x: px, y: py }));
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const layerTranslate = (strength: number) => ({
    transform: `translate3d(${tilt.x * strength}px, ${tilt.y * strength}px, 0)`
  });

  return (
    <section className="flex flex-col items-center">
      <div
        ref={sceneRef}
        className="relative w-full overflow-hidden rounded-[28px] border border-white/60 shadow-[0_30px_60px_-30px_rgba(31,77,44,0.45),inset_0_1px_0_rgba(255,255,255,0.7)]"
        style={{ perspective: "1100px" }}
      >
        {/* The whole scene tilts a few degrees with the cursor for real depth. */}
        <div
          className="relative aspect-[16/8] w-full transition-transform duration-100 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${tilt.x * 5}deg) rotateX(${tilt.y * -3}deg)`
          }}
        >
          {/* Clean illustrated meadow (rolling hills + sun + sky baked in,
              nothing else — so the tree and items become THE world, not
              stickers on top of another scene). Small parallax. */}
          <div
            aria-hidden
            className="absolute inset-0 transition-transform duration-100 ease-out"
            style={{
              backgroundImage: "url(/garden-meadow.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              ...layerTranslate(6)
            }}
          />

          {/* Central tree — transparent PNG, scaled by stage, mid layer. */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
            style={layerTranslate(14)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/garden-tree.webp"
              alt={`Your focus tree — ${stage.name.toLowerCase()}`}
              className="block h-auto w-[clamp(180px,32%,360px)] origin-bottom transition-transform duration-700 ease-out"
              style={{ transform: `scale(${stage.scale})` }}
            />
          </div>

          {/* Brand sheep (transparent PNG) — slightly more parallax than tree. */}
          <div
            className="absolute left-[42%] top-[58%] -translate-x-1/2 w-[clamp(48px,7%,90px)] transition-transform duration-100 ease-out"
            style={layerTranslate(18)}
            aria-hidden
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/studypuff-sheep.png" alt="" className="h-auto w-full drop-shadow-[0_6px_10px_rgba(31,77,44,0.25)]" />
          </div>

          {/* Owned items — TRUE ALPHA bespoke art (no mix-blend hacks). Items
              further down (higher y%) parallax more for a foreground feel. */}
          {placedItems.map((item) => {
            const { x, y, scale = 1 } = item.placement;
            const depth = 14 + (y / 100) * 22; // 14..36px range by depth
            return (
              <div
                key={item.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${14 * scale}%`,
                  animation: "gardenPop 520ms cubic-bezier(0.34,1.5,0.64,1) both",
                  ...layerTranslate(depth)
                }}
                title={item.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.art}
                  alt={item.name}
                  className="h-auto w-full"
                  style={{ filter: "drop-shadow(0 10px 14px rgba(31,77,44,0.22))" }}
                />
              </div>
            );
          })}

          {/* Soft centre-weighted vignette to seat everything. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(120% 80% at 50% 40%, transparent 55%, rgba(31,45,30,0.12) 100%)" }}
          />

          {/* Empty-garden hint. */}
          {placedItems.length === 0 && (
            <p className="absolute bottom-4 right-5 max-w-[60%] text-right text-xs italic text-ink-700/75">
              Your garden grows with focus — and with items from the shop below.
            </p>
          )}
        </div>

        <style jsx>{`
          @keyframes gardenPop {
            from { opacity: 0; transform: translate(-50%, -40%) scale(0.7); }
            to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
          @media (prefers-reduced-motion: reduce) {
            div[style*="rotateY"] { transform: none !important; }
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
      </div>
    </section>
  );
}
