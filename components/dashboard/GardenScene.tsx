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

function stageFor(m: number): { name: string; scale: number; sat: number } {
  if (m < 30)   return { name: "A tiny sprout", scale: 0.62, sat: 0.7 };
  if (m < 180)  return { name: "A young sapling", scale: 0.76, sat: 0.85 };
  if (m < 720)  return { name: "Branching out", scale: 0.9, sat: 0.95 };
  if (m < 3000) return { name: "A leafy canopy", scale: 1.02, sat: 1 };
  return { name: "A grand old tree", scale: 1.08, sat: 1.05 };
}

type Placed = Reward & { placement: NonNullable<Reward["placement"]>; art: NonNullable<Reward["art"]> };

/**
 * The garden world — a wide illustrated scene with the user's focus tree at
 * the centre, the bespoke meadow as backdrop, and every purchased garden
 * item placed at its predetermined coordinate using bespoke flat-illustration
 * art (NOT emoji). A subtle mouse-driven parallax tilt gives the scene a
 * real depth feel — items at the front (higher y%) move slightly more than
 * those further back. Reduced-motion-safe.
 */
export function GardenScene({ lifetimeMinutes, todayMinutes, streak, ownedItemIds }: Props) {
  // Test mode is opt-in via ?growthtest=1 — debug code does NOT run on a
  // "ready" build by default (per the skill's no-debug-toggles rule).
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

  const ownedSet = useMemo(() => new Set(ownedItemIds), [ownedItemIds]);
  const placedItems: Placed[] = useMemo(
    () =>
      REWARDS.filter((r): r is Placed =>
        r.category === "garden" && !!r.placement && !!r.art && ownedSet.has(r.id)
      ),
    [ownedSet]
  );

  // Mouse-driven parallax tilt. Track the cursor's offset from the scene
  // center and translate each depth layer by a small multiple of that
  // offset — items in the foreground (high y%) move more than the tree
  // and the meadow (background). Reduced-motion users get zero offset.
  const sceneRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (rm.matches) return;
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

  // Per-layer parallax strength. Larger = moves more = feels closer.
  const parallax = (strength: number) => ({
    transform: `translate3d(${tilt.x * strength}px, ${tilt.y * strength}px, 0)`
  });

  return (
    <section className="flex flex-col items-center">
      <div
        ref={sceneRef}
        className="relative w-full overflow-hidden rounded-[28px] border border-white/60 shadow-[0_30px_60px_-30px_rgba(31,77,44,0.45),inset_0_1px_0_rgba(255,255,255,0.7)]"
        style={{ perspective: "1000px" }}
      >
        {/* Sky band */}
        <div className="aspect-[16/8] w-full bg-gradient-to-b from-[#cfe7ea] via-[#e3eedd] to-[#cfe1b7]" />

        {/* Meadow illustration (background layer — small parallax). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] transition-transform duration-100 ease-out"
          style={{
            backgroundImage: "url(/garden-meadow.webp)",
            backgroundSize: "cover",
            backgroundPosition: "bottom center",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 22%, #000 100%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, #000 22%, #000 100%)",
            ...parallax(8)
          }}
        />

        {/* Soft sun glow (sky layer — very small parallax). */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[6%] h-[40%] w-[55%] -translate-x-1/2 rounded-full transition-transform duration-100 ease-out"
          style={{
            background: "radial-gradient(closest-side, rgba(251,233,165,0.55), transparent 70%)",
            ...parallax(4)
          }}
        />

        {/* Central tree — mid layer. */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
          style={parallax(14)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/garden-tree.webp"
            alt={`Your focus tree — ${stage.name.toLowerCase()}`}
            className="block h-auto w-[clamp(180px,32%,360px)] origin-bottom transition-all duration-700 ease-out"
            style={{ transform: `scale(${stage.scale})`, filter: `saturate(${stage.sat})` }}
          />
        </div>

        {/* Brand sheep — slightly more parallax than the tree. */}
        <div
          className="absolute left-[42%] top-[58%] -translate-x-1/2 w-[clamp(48px,7%,90px)] transition-transform duration-100 ease-out"
          style={parallax(18)}
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/studypuff-sheep.png" alt="" className="h-auto w-full drop-shadow-[0_6px_10px_rgba(31,77,44,0.25)]" />
        </div>

        {/* Owned garden items — bespoke flat-illustration art, blended into
            the meadow via multiply (drops the cream/white bg). Per-item
            parallax: items further down (higher y%) move more = closer feel. */}
        {placedItems.map((item) => {
          const { x, y, scale = 1 } = item.placement;
          const depth = 12 + (y / 100) * 22; // 12px..34px parallax range by depth
          return (
            <div
              key={item.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 animate-[fadeIn_500ms_ease-out_both] transition-transform duration-100 ease-out"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${14 * scale}%`,
                ...parallax(depth)
              }}
              title={item.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.art}
                alt={item.name}
                className="h-auto w-full"
                style={{ mixBlendMode: "multiply", filter: "drop-shadow(0 8px 12px rgba(31,77,44,0.18))" }}
              />
            </div>
          );
        })}

        {/* Vignette to seat the scene. */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{
          background: "radial-gradient(120% 80% at 50% 40%, transparent 55%, rgba(31,45,30,0.12) 100%)"
        }} />

        {/* Empty-garden hint (only when the user owns no garden items yet). */}
        {placedItems.length === 0 && (
          <div className="absolute bottom-3 right-4 max-w-[60%] text-right text-[11px] italic text-ink-700/75">
            Your garden grows with focus — and with items from the shop below.
          </div>
        )}

        <style jsx>{`
          @keyframes fadeIn { from { opacity: 0; transform: translate(-50%, -40%) scale(0.85); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
        `}</style>
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
