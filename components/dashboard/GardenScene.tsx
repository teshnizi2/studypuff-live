"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { REWARDS, type Reward } from "@/lib/app-data/rewards";

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

type Placed = Reward & { placement: NonNullable<Reward["placement"]>; art: NonNullable<Reward["art"]> };

/**
 * The garden WORLD. Not a scatter of sprites — a layered scene with depth,
 * environmental motion, and a single light source. Layers from back to front:
 *   1. Sky + meadow backdrop
 *   2. Distant tree silhouettes on the hills (parallax background)
 *   3. Slowly drifting clouds
 *   4. A winding stone path between item slots
 *   5. Ground shadows under every placed thing (single light source: top-left)
 *   6. Items + tree + sheep (all on the ground line, scale-consistent)
 *   7. Foreground grass blades + daisies in front of the items
 *   8. A wandering butterfly
 *   9. Centre vignette
 * The whole stack tilts a few degrees with the cursor for genuine 3D depth.
 * Reduced-motion gives a static, calm version.
 */
export function GardenScene({ lifetimeMinutes, todayMinutes, streak, ownedItemIds }: Props) {
  const leafCount = Math.min(MAX_LEAVES, Math.floor(lifetimeMinutes / MINUTES_PER_LEAF));
  const todayLeaves = Math.floor(todayMinutes / MINUTES_PER_LEAF);
  const intoNext = lifetimeMinutes % MINUTES_PER_LEAF;
  const pct = Math.round((intoNext / MINUTES_PER_LEAF) * 100);
  const stage = stageFor(lifetimeMinutes);

  const ownedSet = useMemo(() => new Set(ownedItemIds), [ownedItemIds]);
  const placedItems: Placed[] = useMemo(
    () => REWARDS.filter((r): r is Placed => r.category === "garden" && !!r.placement && !!r.art && ownedSet.has(r.id)),
    [ownedSet]
  );

  // Cursor-driven parallax + perspective tilt.
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
      const px = (e.clientX - r.left) / r.width - 0.5;
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
  const T = (s: number) => ({ transform: `translate3d(${tilt.x * s}px, ${tilt.y * s}px, 0)` });

  return (
    <section className="flex flex-col items-center">
      <div
        ref={sceneRef}
        className="relative w-full overflow-hidden rounded-[28px] border border-white/60 shadow-[0_30px_60px_-30px_rgba(31,77,44,0.45),inset_0_1px_0_rgba(255,255,255,0.7)]"
        style={{ perspective: "1100px" }}
      >
        <div
          className="relative aspect-[16/8] w-full transition-transform duration-100 ease-out"
          style={{ transformStyle: "preserve-3d", transform: `rotateY(${tilt.x * 4}deg) rotateX(${tilt.y * -2.5}deg)` }}
        >
          {/* 1 — meadow backdrop (smallest parallax) */}
          <div
            aria-hidden
            className="absolute inset-0 transition-transform duration-100 ease-out"
            style={{ backgroundImage: "url(/garden-meadow.webp)", backgroundSize: "cover", backgroundPosition: "center", ...T(5) }}
          />

          {/* 2 — distant tree silhouettes on the hills (deep background) */}
          <svg
            aria-hidden viewBox="0 0 1600 800" preserveAspectRatio="xMidYMid slice"
            className="pointer-events-none absolute inset-0 h-full w-full transition-transform duration-100 ease-out"
            style={{ ...T(9), opacity: 0.55 }}
          >
            {/* clustered small trees on the far hills */}
            {[180, 250, 320, 1140, 1240, 1320, 1400].map((x, i) => (
              <g key={i} transform={`translate(${x} ${480 + (i % 2) * 14}) scale(${0.6 + ((i * 37) % 30) / 100})`}>
                <ellipse cx="0" cy="0" rx="36" ry="28" fill="#9bc098" />
                <ellipse cx="-14" cy="6" rx="22" ry="18" fill="#8aae87" />
                <ellipse cx="16" cy="4" rx="24" ry="20" fill="#8aae87" />
                <rect x="-3" y="16" width="6" height="14" fill="#7a5e3a" rx="2" />
              </g>
            ))}
          </svg>

          {/* 3 — slowly drifting clouds (sky layer) */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={T(3)}>
            <div className="garden-cloud garden-cloud-1" />
            <div className="garden-cloud garden-cloud-2" />
            <div className="garden-cloud garden-cloud-3" />
          </div>

          {/* 4 — winding stone path between item slots (only when items exist) */}
          {placedItems.length > 0 && (
            <svg
              aria-hidden viewBox="0 0 1600 800" preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 h-full w-full transition-transform duration-100 ease-out"
              style={T(8)}
            >
              <path
                d="M 180,720 C 360,680 540,700 760,680 C 900,665 1040,680 1200,700 C 1320,712 1420,720 1520,710"
                stroke="#c8b89a" strokeWidth="34" strokeLinecap="round" fill="none" opacity="0.75"
              />
              <path
                d="M 180,720 C 360,680 540,700 760,680 C 900,665 1040,680 1200,700 C 1320,712 1420,720 1520,710"
                stroke="#dccebf" strokeWidth="22" strokeLinecap="round" strokeDasharray="2 28" fill="none" opacity="0.9"
              />
            </svg>
          )}

          {/* 5+6 — ground line: tree, sheep, items (each with a soft shadow below) */}
          {/* Tree (large, anchor of the scene) */}
          <div
            className="absolute left-[50%] top-[42%] -translate-x-1/2 transition-transform duration-100 ease-out"
            style={T(14)}
          >
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/garden-tree.webp"
                alt={`Your focus tree — ${stage.name.toLowerCase()}`}
                className="block h-auto w-[clamp(260px,46%,520px)] origin-bottom transition-transform duration-700 ease-out"
                style={{ transform: `scale(${stage.scale})` }}
              />
              {/* ground shadow under tree, offset bottom-right per light source top-left */}
              <div aria-hidden className="absolute left-[40%] bottom-[-4%] h-[14px] w-[55%] -translate-x-1/2 rounded-[50%]"
                style={{ background: "radial-gradient(closest-side, rgba(31,45,30,0.4), transparent 70%)" }} />
            </div>
          </div>

          {/* Brand sheep — on the ground at the tree's base, properly scaled */}
          <div
            className="absolute left-[58%] top-[78%] -translate-x-1/2 -translate-y-full transition-transform duration-100 ease-out"
            style={T(18)}
            aria-hidden
          >
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/studypuff-sheep.png" alt="" className="block h-auto w-[clamp(72px,9%,128px)]" />
              <div aria-hidden className="absolute left-[50%] bottom-[-6px] h-[10px] w-[80%] -translate-x-1/2 rounded-[50%]"
                style={{ background: "radial-gradient(closest-side, rgba(31,45,30,0.35), transparent 70%)" }} />
            </div>
          </div>

          {/* Owned garden items — true alpha + ground shadow + animated micro-detail
              on a few of them (lantern flicker, pond ripple). */}
          {placedItems.map((item) => {
            const { x, y, scale = 1 } = item.placement;
            const depth = 14 + (y / 100) * 22;
            const accent =
              item.id === "garden-lantern" ? " garden-item-lantern" :
              item.id === "garden-pond" ? " garden-item-pond" :
              item.id === "garden-cottage" ? " garden-item-cottage" : "";
            return (
              <div
                key={item.id}
                className={`absolute -translate-x-1/2 -translate-y-full transition-transform duration-100 ease-out${accent}`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${13 * scale}%`,
                  animation: "gardenPop 540ms cubic-bezier(0.34,1.5,0.64,1) both",
                  ...T(depth)
                }}
                title={item.name}
              >
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.art}
                    alt={item.name}
                    className="block h-auto w-full"
                    style={{ filter: "drop-shadow(0 12px 18px rgba(31,77,44,0.18))" }}
                  />
                  {/* ground shadow — placed under the visible footprint of the item */}
                  <div aria-hidden className="absolute left-[55%] bottom-[-2px] h-[9px] w-[80%] -translate-x-1/2 rounded-[50%]"
                    style={{ background: "radial-gradient(closest-side, rgba(31,45,30,0.32), transparent 70%)" }} />
                </div>
              </div>
            );
          })}

          {/* 7 — foreground grass band + scattered daisies (in FRONT of items) */}
          <svg
            aria-hidden viewBox="0 0 1600 100" preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[12%] w-full"
            style={T(28)}
          >
            <g fill="#4f8a48">
              {Array.from({ length: 28 }).map((_, i) => {
                const cx = (i * 60 + ((i * 37) % 25));
                const h = 26 + ((i * 31) % 18);
                return (
                  <path key={i}
                    d={`M ${cx} 100 Q ${cx + 2} ${100 - h} ${cx + 6} 100 Z M ${cx + 8} 100 Q ${cx + 10} ${100 - h * 0.7} ${cx + 14} 100 Z`}
                    className="garden-grass-blade"
                    style={{ animationDelay: `${(i % 7) * 200}ms` }}
                  />
                );
              })}
            </g>
            {/* small daisies in foreground */}
            {Array.from({ length: 14 }).map((_, i) => {
              const cx = 50 + i * 110 + ((i * 53) % 30);
              const cy = 80 - ((i * 17) % 12);
              return (
                <g key={`d${i}`} transform={`translate(${cx} ${cy})`}>
                  {[0, 60, 120, 180, 240, 300].map((deg) => (
                    <ellipse key={deg} cx="0" cy="-3" rx="1.6" ry="3.2" fill="#fffaea" transform={`rotate(${deg})`} />
                  ))}
                  <circle r="1.4" fill="#f3c95a" />
                </g>
              );
            })}
          </svg>

          {/* 8 — a wandering butterfly (CSS keyframe path) */}
          <div aria-hidden className="pointer-events-none absolute inset-0" style={T(22)}>
            <div className="garden-butterfly">
              <svg viewBox="0 0 16 12" className="h-3.5 w-4">
                <g>
                  <ellipse cx="6" cy="6" rx="3.5" ry="2.6" fill="#f3a4b8" transform="rotate(-18 6 6)" />
                  <ellipse cx="10" cy="6" rx="3.5" ry="2.6" fill="#f3a4b8" transform="rotate(18 10 6)" />
                  <line x1="8" y1="3" x2="8" y2="9" stroke="#1f1f1f" strokeWidth="0.6" />
                </g>
              </svg>
            </div>
          </div>

          {/* 9 — soft centre vignette */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(120% 80% at 50% 40%, transparent 55%, rgba(31,45,30,0.12) 100%)" }}
          />

          {/* Empty-garden hint */}
          {placedItems.length === 0 && (
            <p className="absolute bottom-4 right-5 max-w-[60%] text-right text-xs italic text-ink-700/75">
              Your garden grows with focus — and with items from the shop below.
            </p>
          )}
        </div>

        <style jsx>{`
          @keyframes gardenPop {
            from { opacity: 0; transform: translate(-50%, -90%) scale(0.7); }
            to   { opacity: 1; transform: translate(-50%, -100%) scale(1); }
          }
          /* Drifting clouds */
          .garden-cloud {
            position: absolute;
            border-radius: 999px;
            background: radial-gradient(closest-side, rgba(255,255,255,0.75), rgba(255,255,255,0));
            filter: blur(2px);
          }
          .garden-cloud-1 { top: 12%; left: -10%; width: 22%; height: 16%; animation: gardenCloud 70s linear infinite; }
          .garden-cloud-2 { top: 6%;  left: -20%; width: 16%; height: 12%; animation: gardenCloud 95s linear infinite; animation-delay: -30s; }
          .garden-cloud-3 { top: 18%; left: -30%; width: 28%; height: 18%; animation: gardenCloud 110s linear infinite; animation-delay: -55s; }
          @keyframes gardenCloud { to { transform: translateX(150vw); } }
          /* Grass sway */
          .garden-grass-blade { transform-origin: center bottom; animation: gardenSway 4.5s ease-in-out infinite; }
          @keyframes gardenSway { 0%,100% { transform: skewX(-3deg); } 50% { transform: skewX(3deg); } }
          /* Lantern flicker — applied via parent class */
          :global(.garden-item-lantern) { filter: drop-shadow(0 0 10px rgba(255,200,120,0.55)); animation: gardenFlicker 3.4s ease-in-out infinite; }
          @keyframes gardenFlicker { 0%,100% { filter: drop-shadow(0 0 10px rgba(255,200,120,0.55)); } 50% { filter: drop-shadow(0 0 16px rgba(255,200,120,0.85)); } }
          /* Pond ripple — gentle scale pulse */
          :global(.garden-item-pond img) { animation: gardenRipple 5s ease-in-out infinite; transform-origin: center; }
          @keyframes gardenRipple { 0%,100% { transform: scaleX(1); } 50% { transform: scaleX(1.015) scaleY(0.99); } }
          /* Cottage chimney smoke hint — gentle bob */
          :global(.garden-item-cottage) { animation: gardenBob 6s ease-in-out infinite; transform-origin: bottom center; }
          @keyframes gardenBob { 0%,100% { transform: translate(-50%, -100%) translateY(0); } 50% { transform: translate(-50%, -100%) translateY(-1px); } }
          /* Butterfly flight */
          .garden-butterfly {
            position: absolute;
            top: 50%; left: 10%;
            transform-origin: center;
            animation: gardenFly 18s cubic-bezier(0.55, 0, 0.45, 1) infinite, gardenFlutter 0.6s linear infinite;
          }
          @keyframes gardenFly {
            0%   { top: 38%; left: -4%; transform: rotate(8deg); }
            25%  { top: 28%; left: 28%; transform: rotate(-6deg); }
            50%  { top: 42%; left: 55%; transform: rotate(10deg); }
            75%  { top: 32%; left: 78%; transform: rotate(-8deg); }
            100% { top: 40%; left: 104%; transform: rotate(6deg); }
          }
          @keyframes gardenFlutter { 0%,100% { filter: none; } 50% { filter: brightness(1.1); } }
          @media (prefers-reduced-motion: reduce) {
            .garden-cloud, .garden-grass-blade, .garden-butterfly { animation: none !important; }
            :global(.garden-item-lantern), :global(.garden-item-pond img), :global(.garden-item-cottage) { animation: none !important; }
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
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-[width] duration-700" style={{ width: `${pct}%` }} />
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
