"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

type Placed = Reward & {
  placement: NonNullable<Reward["placement"]>;
  art: NonNullable<Reward["art"]>;
};

type Tod = "dawn" | "day" | "dusk" | "night";
type Season = "spring" | "summer" | "autumn" | "winter";

/**
 * The garden WORLD — an Animal-Crossing-style cozy scene built up of:
 *   1. Sky band tinted by time of day (dawn / day / dusk / night)
 *   2. Sun OR moon + stars layer (palette-driven)
 *   3. Meadow backdrop image
 *   4. Distant tree silhouettes (SVG, parallax)
 *   5. Drifting clouds (day) — dimmed at night
 *   6. Season weather overlay (petals · sunbeams · leaves · snowflakes — rotates every 22 s)
 *   7. Stone path threaded dynamically through owned items
 *   8. Owned items, rendered in `layer` order with ground shadow and hover/click reactivity
 *   9. Tree + brand sheep, with single-light-source shadows
 *  10. Live animated creatures: rabbit, songbird, bee, butterfly
 *  11. Foreground grass blades + daisies (in front of items)
 *  12. Soft centre vignette
 * The whole stack tilts a few degrees with the cursor for genuine 3D depth.
 * Honors prefers-reduced-motion: animations off, day/night still applies.
 */
export function GardenScene({ lifetimeMinutes, todayMinutes, streak, ownedItemIds }: Props) {
  const leafCount = Math.min(MAX_LEAVES, Math.floor(lifetimeMinutes / MINUTES_PER_LEAF));
  const todayLeaves = Math.floor(todayMinutes / MINUTES_PER_LEAF);
  const intoNext = lifetimeMinutes % MINUTES_PER_LEAF;
  const pct = Math.round((intoNext / MINUTES_PER_LEAF) * 100);
  const stage = stageFor(lifetimeMinutes);

  const ownedSet = useMemo(() => new Set(ownedItemIds), [ownedItemIds]);
  const placedItems: Placed[] = useMemo(
    () => REWARDS.filter((r): r is Placed =>
      isGardenCategory(r.category) && !!r.placement && !!r.art && ownedSet.has(r.id)
    ).sort((a, b) => (a.placement.layer ?? 5) - (b.placement.layer ?? 5)),
    [ownedSet]
  );

  // Convenience flags — power conditional creature spawns.
  const hasCottage = ownedSet.has("garden-cottage");
  const hasFlowerbed = ownedSet.has("garden-flowerbed");
  const hasVegpatch = ownedSet.has("garden-vegpatch");
  const hasBeehive = ownedSet.has("garden-beehive");
  const hasPond = ownedSet.has("garden-pond");

  // Read time-of-day from <html data-tod>, which the layout pre-paint script sets.
  const [tod, setTod] = useState<Tod>("day");
  useEffect(() => {
    if (typeof document === "undefined") return;
    const read = () => {
      const v = (document.documentElement.dataset.tod || "day") as Tod;
      setTod(v);
    };
    read();
    // Re-read every minute so the scene drifts with the actual hour.
    const id = window.setInterval(read, 60_000);
    return () => clearInterval(id);
  }, []);
  const isNight = tod === "night";

  // Season cycles spring → summer → autumn → winter so the user sees ALL four
  // weather varieties in one sitting. Each season lasts SEASON_MS.
  const SEASON_MS = 22_000;
  const seasons: Season[] = ["spring", "summer", "autumn", "winter"];
  const [season, setSeason] = useState<Season>("spring");
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    const id = window.setInterval(() => {
      i = (i + 1) % seasons.length;
      setSeason(seasons[i]);
    }, SEASON_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Click-reaction state. Burst lasts ~700ms then clears.
  const [popped, setPopped] = useState<string | null>(null);
  function pop(id: string) {
    setPopped(id);
    window.setTimeout(() => setPopped((cur) => (cur === id ? null : cur)), 720);
  }

  // Day/night palette per layer.
  const sky =
    tod === "dawn"  ? "linear-gradient(to bottom, #fbcaa3 0%, #fde6cf 35%, #fef4dd 70%, #f8f3dc 100%)" :
    tod === "day"   ? "linear-gradient(to bottom, #c7e8f3 0%, #dff1f4 38%, #effbf3 75%, #f3f6dd 100%)" :
    tod === "dusk"  ? "linear-gradient(to bottom, #5b4a8a 0%, #b66b8c 38%, #f0a06b 72%, #f6c98b 100%)" :
                      "linear-gradient(to bottom, #14163a 0%, #2c2a5c 38%, #3a3b78 75%, #4a4e8a 100%)";

  const meadowTone = isNight ? "saturate(0.55) brightness(0.55) hue-rotate(-10deg)" : "none";

  return (
    <section className="flex flex-col items-center">
      <div
        ref={sceneRef}
        className="relative w-full overflow-hidden rounded-[28px] border border-white/60 shadow-[0_30px_60px_-30px_rgba(31,77,44,0.45),inset_0_1px_0_rgba(255,255,255,0.7)]"
        style={{ perspective: "1100px" }}
        data-tod={tod}
        data-season={season}
      >
        <div
          className="relative aspect-[16/8] w-full transition-transform duration-100 ease-out"
          style={{ transformStyle: "preserve-3d", transform: `rotateY(${tilt.x * 4}deg) rotateX(${tilt.y * -2.5}deg)` }}
        >
          {/* 1 — Sky band, palette-driven by time of day */}
          <div aria-hidden className="absolute inset-0 transition-[background] duration-1000 ease-in-out" style={{ background: sky }} />

          {/* 2 — Sun (daylight tods) OR Moon + stars (night) */}
          {!isNight && (
            <div aria-hidden className="pointer-events-none absolute" style={{ left: "10%", top: "11%", ...T(2) }}>
              <div
                className="rounded-full"
                style={{
                  width: "84px",
                  height: "84px",
                  background:
                    tod === "dawn" ? "radial-gradient(circle, #ffe19a 0%, #ffc46f 55%, rgba(255,196,111,0) 75%)" :
                    tod === "dusk" ? "radial-gradient(circle, #ffd3a0 0%, #ff9d6d 55%, rgba(255,157,109,0) 75%)" :
                                     "radial-gradient(circle, #fff6c4 0%, #ffe077 55%, rgba(255,224,119,0) 75%)",
                  filter: "blur(0.5px)"
                }}
              />
            </div>
          )}
          {isNight && (
            <>
              <div aria-hidden className="pointer-events-none absolute" style={{ left: "82%", top: "12%", ...T(2) }}>
                <div
                  className="garden-moon rounded-full"
                  style={{
                    width: "62px",
                    height: "62px",
                    background: "radial-gradient(circle at 38% 36%, #fbf5d8 0%, #f0e4b4 55%, #d9c98a 100%)",
                    boxShadow: "0 0 22px rgba(251,245,216,0.55), inset -8px -10px 0 rgba(170,150,90,0.18)"
                  }}
                />
              </div>
              {/* Stars — sprinkled across upper sky */}
              <svg aria-hidden viewBox="0 0 1600 800" preserveAspectRatio="xMidYMid slice"
                className="pointer-events-none absolute inset-0 h-full w-full" style={T(1)}>
                {[
                  [120, 90], [220, 60], [360, 110], [480, 70], [600, 120], [720, 60], [840, 130], [960, 80],
                  [1100, 100], [1240, 60], [1340, 120], [1480, 80], [1560, 110],
                  [180, 200], [380, 220], [580, 180], [780, 240], [980, 200], [1180, 220], [1380, 180]
                ].map(([cx, cy], i) => (
                  <g key={i} transform={`translate(${cx} ${cy})`} className="garden-star" style={{ animationDelay: `${(i % 7) * 380}ms` }}>
                    <circle r={1.4 + (i % 3) * 0.6} fill="#fff8dc" />
                  </g>
                ))}
              </svg>
            </>
          )}

          {/* 3 — meadow backdrop (smallest parallax), tinted at night */}
          <div
            aria-hidden
            className="absolute inset-0 transition-[filter] duration-1000 ease-in-out"
            style={{ backgroundImage: "url(/garden-meadow.webp)", backgroundSize: "cover", backgroundPosition: "center", filter: meadowTone, ...T(5) }}
          />

          {/* Night colour overlay — softens cream + adds blue tint over meadow */}
          {isNight && (
            <div aria-hidden className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(to bottom, rgba(20,22,58,0.45) 0%, rgba(40,40,90,0.35) 60%, rgba(28,28,60,0.5) 100%)" }} />
          )}

          {/* 4 — distant tree silhouettes on the hills */}
          <svg
            aria-hidden viewBox="0 0 1600 800" preserveAspectRatio="xMidYMid slice"
            className="pointer-events-none absolute inset-0 h-full w-full transition-transform duration-100 ease-out"
            style={{ ...T(9), opacity: isNight ? 0.35 : 0.55 }}
          >
            {[180, 250, 320, 1140, 1240, 1320, 1400].map((x, i) => (
              <g key={i} transform={`translate(${x} ${480 + (i % 2) * 14}) scale(${0.6 + ((i * 37) % 30) / 100})`}>
                <ellipse cx="0" cy="0" rx="36" ry="28" fill={isNight ? "#2e3855" : "#9bc098"} />
                <ellipse cx="-14" cy="6" rx="22" ry="18" fill={isNight ? "#28304a" : "#8aae87"} />
                <ellipse cx="16" cy="4" rx="24" ry="20" fill={isNight ? "#28304a" : "#8aae87"} />
                <rect x="-3" y="16" width="6" height="14" fill={isNight ? "#1f253a" : "#7a5e3a"} rx="2" />
              </g>
            ))}
          </svg>

          {/* 5 — drifting clouds (dimmed at night) */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity: isNight ? 0.35 : 1, ...T(3) }}>
            <div className="garden-cloud garden-cloud-1" />
            <div className="garden-cloud garden-cloud-2" />
            <div className="garden-cloud garden-cloud-3" />
          </div>

          {/* 6 — Season weather overlay. Petals (spring), sunbeams (summer),
              leaves (autumn), snowflakes (winter). Rotates every 22 s. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={T(6)}>
            {season === "spring" && (
              <>
                {Array.from({ length: 14 }).map((_, i) => (
                  <span key={i} className="garden-petal" style={{ left: `${(i * 7 + 4) % 100}%`, animationDelay: `${(i * 0.7) % 6}s`, animationDuration: `${10 + (i % 5)}s` }} />
                ))}
              </>
            )}
            {season === "summer" && (
              <div className="garden-rays absolute inset-0" />
            )}
            {season === "autumn" && (
              <>
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="garden-leaf" style={{ left: `${(i * 9 + 3) % 100}%`, animationDelay: `${(i * 0.6) % 7}s`, animationDuration: `${11 + (i % 4)}s` }} />
                ))}
              </>
            )}
            {season === "winter" && (
              <>
                {Array.from({ length: 22 }).map((_, i) => (
                  <span key={i} className="garden-snowflake" style={{ left: `${(i * 5 + 2) % 100}%`, animationDelay: `${(i * 0.4) % 8}s`, animationDuration: `${9 + (i % 6)}s` }} />
                ))}
              </>
            )}
          </div>

          {/* 7 — winding path threading the owned items */}
          {placedItems.length > 0 && (() => {
            const sorted = [...placedItems].sort((a, b) => a.placement.x - b.placement.x);
            const points: Array<{ x: number; y: number }> = [
              { x: 60, y: 730 },
              ...sorted.map((it) => ({ x: it.placement.x * 16, y: it.placement.y * 8 - 14 })),
              { x: 1540, y: 720 }
            ];
            let d = `M ${points[0].x} ${points[0].y}`;
            for (let i = 1; i < points.length; i++) {
              const a = points[i - 1], b = points[i];
              const mx = (a.x + b.x) / 2;
              d += ` C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
            }
            return (
              <svg
                aria-hidden viewBox="0 0 1600 800" preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 h-full w-full transition-transform duration-100 ease-out"
                style={T(8)}
              >
                <path d={d} stroke={isNight ? "#8a7a5e" : "#c8b89a"} strokeWidth="34" strokeLinecap="round" fill="none" opacity="0.7" />
                <path d={d} stroke={isNight ? "#a89878" : "#dccebf"} strokeWidth="22" strokeLinecap="round" strokeDasharray="2 28" fill="none" opacity="0.85" />
              </svg>
            );
          })()}

          {/* 8 — Tree (anchor of the scene) */}
          <div className="absolute left-[50%] top-[42%] -translate-x-1/2 transition-transform duration-100 ease-out" style={T(14)}>
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/garden-tree.webp"
                alt={`Your focus tree — ${stage.name.toLowerCase()}`}
                className="block h-auto w-[clamp(260px,46%,520px)] origin-bottom transition-[transform,filter] duration-700 ease-out"
                style={{ transform: `scale(${stage.scale})`, filter: isNight ? "brightness(0.7) saturate(0.7)" : "none" }}
              />
              <div aria-hidden className="absolute left-[58%] bottom-[-4%] h-[14px] w-[55%] -translate-x-1/2 rounded-[50%]"
                style={{ background: "radial-gradient(closest-side, rgba(31,45,30,0.4), transparent 70%)" }} />
            </div>
          </div>

          {/* 9 — Brand sheep — on the ground at the tree's base */}
          <div className="absolute left-[58%] top-[78%] -translate-x-1/2 -translate-y-full transition-transform duration-100 ease-out" style={T(18)} aria-hidden>
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/studypuff-sheep.png" alt="" className="block h-auto w-[clamp(72px,9%,128px)]" style={{ filter: isNight ? "brightness(0.85)" : "none" }} />
              <div aria-hidden className="absolute left-[50%] bottom-[-6px] h-[10px] w-[80%] -translate-x-1/2 rounded-[50%]"
                style={{ background: "radial-gradient(closest-side, rgba(31,45,30,0.35), transparent 70%)" }} />
            </div>
          </div>

          {/* 10 — Owned garden items */}
          {placedItems.map((item) => {
            const { x, y, scale = 1 } = item.placement;
            const depth = 14 + (y / 100) * 22;
            const isLantern = item.id === "garden-lantern";
            const isPond = item.id === "garden-pond";
            const isCottage = item.id === "garden-cottage";
            const isGnome = item.id === "garden-gnome";
            const isFairy = item.id === "garden-fairyring";
            const itemAccent =
              isLantern ? " garden-item-lantern" :
              isPond ? " garden-item-pond" :
              isCottage ? " garden-item-cottage" :
              isFairy ? " garden-item-fairyring" : "";
            const isPopped = popped === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => pop(item.id)}
                className={`group absolute -translate-x-1/2 -translate-y-full cursor-pointer rounded-2xl border-0 bg-transparent p-0 outline-none transition-transform duration-100 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-600${itemAccent}`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${13 * scale}%`,
                  animation: "gardenPop 540ms cubic-bezier(0.34,1.5,0.64,1) both",
                  ...T(depth)
                }}
                aria-label={item.name}
              >
                <div className={`relative ${isPopped ? "garden-item-burst" : ""}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.art}
                    alt={item.name}
                    className="garden-item-img block h-auto w-full transition-transform duration-200 ease-out group-hover:-translate-y-1 group-hover:scale-105"
                    style={{
                      filter: isLantern && isNight
                        ? "drop-shadow(0 0 18px rgba(255,200,120,0.95)) drop-shadow(0 12px 18px rgba(31,77,44,0.18))"
                        : isNight
                          ? "brightness(0.78) saturate(0.85) drop-shadow(0 12px 18px rgba(0,0,0,0.35))"
                          : "drop-shadow(0 12px 18px rgba(31,77,44,0.18))"
                    }}
                  />
                  {/* ground shadow */}
                  <div aria-hidden className="absolute left-[55%] bottom-[-2px] h-[9px] w-[80%] -translate-x-1/2 rounded-[50%]"
                    style={{ background: "radial-gradient(closest-side, rgba(31,45,30,0.32), transparent 70%)" }} />
                  {/* Per-item click reactions */}
                  {isPond && isPopped && <span aria-hidden className="garden-pond-ripple" />}
                  {isLantern && isPopped && <span aria-hidden className="garden-lantern-burst" />}
                  {isCottage && isPopped && (
                    <>
                      <span aria-hidden className="garden-smoke" style={{ left: "62%", animationDelay: "0ms" }} />
                      <span aria-hidden className="garden-smoke" style={{ left: "66%", animationDelay: "150ms" }} />
                      <span aria-hidden className="garden-smoke" style={{ left: "60%", animationDelay: "320ms" }} />
                    </>
                  )}
                  {isGnome && isPopped && <span aria-hidden className="garden-gnome-hat">✨</span>}
                  {/* Hover tooltip — sits above the item */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-[-22px] -translate-x-1/2 whitespace-nowrap rounded-full bg-ink-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cream-50 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  >
                    {item.name}
                  </span>
                </div>
              </button>
            );
          })}

          {/* 11 — Animated creatures.
              SIZING RULE (learned the hard way): percentage height on an <img>
              inside an absolute, unsized parent collapses to the image's
              natural 1024px. So sizing lives on the WRAPPER as a width (% of
              the scene's container), and the <img> is just `w-full h-auto`.
              These wrappers must sit inside the aspect-locked scene so the %
              width resolves correctly. */}

          {/* Bespoke butterfly — drifts across the sky */}
          <div aria-hidden className="pointer-events-none absolute inset-0" style={T(22)}>
            <div className="garden-butterfly" style={{ width: "3.5%", minWidth: 28 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/garden/creature-butterfly.webp" alt="" className="block h-auto w-full" />
            </div>
          </div>

          {/* Rabbit hops along the ground band — only spawns once the garden
              has some life in it (any owned item). Empty state has just the
              butterfly so the eye can rest on the hero tree. */}
          {placedItems.length > 0 && (
            <div aria-hidden className="pointer-events-none absolute inset-0" style={T(20)}>
              <div
                className={`garden-rabbit ${hasVegpatch ? "garden-rabbit-fast" : ""}`}
                style={{ width: "4.5%", minWidth: 36 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/garden/creature-rabbit.webp" alt="" className="block h-auto w-full" />
              </div>
            </div>
          )}

          {/* Songbird — only spawns when there's a real perch (cottage owned).
              Anchored to the cottage roof peak: cottage is placed at x:9%, y:72%,
              scale 1.45 so the roof line sits around top:64%, left:6%. */}
          {hasCottage && (
            <div
              aria-hidden
              className="pointer-events-none absolute"
              style={{ left: "6%", top: "64%", width: "3.2%", minWidth: 26, ...T(18) }}
            >
              <div className="garden-songbird">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/garden/creature-songbird.webp" alt="" className="block h-auto w-full" />
              </div>
            </div>
          )}

          {/* Bee — flowers always beat hive when both owned (a bee pollinates,
              it doesn't loiter on its own house). */}
          {(hasFlowerbed || hasBeehive) && (
            <div aria-hidden className="pointer-events-none absolute inset-0" style={T(20)}>
              <div
                className={`garden-bee ${hasFlowerbed ? "garden-bee-near-flowers" : "garden-bee-near-hive"}`}
                style={{ width: "2.6%", minWidth: 22 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/garden/creature-bee.webp" alt="" className="block h-auto w-full" />
              </div>
            </div>
          )}

          {/* 12 — foreground grass + daisies (in FRONT of items) */}
          <svg
            aria-hidden viewBox="0 0 1600 100" preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[12%] w-full"
            style={T(28)}
          >
            <g fill={isNight ? "#2c4f3a" : "#4f8a48"}>
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
            {!isNight && Array.from({ length: 14 }).map((_, i) => {
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
            {/* At night: fireflies replace daisies — a few yellow dots in the grass */}
            {isNight && Array.from({ length: 10 }).map((_, i) => {
              const cx = 80 + i * 150 + ((i * 31) % 40);
              const cy = 60 - ((i * 11) % 20);
              return (
                <circle key={`f${i}`} cx={cx} cy={cy} r="1.6" fill="#fff2a8"
                  className="garden-firefly" style={{ animationDelay: `${(i % 5) * 400}ms` }} />
              );
            })}
          </svg>

          {/* 13 — soft centre vignette */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: isNight
              ? "radial-gradient(120% 80% at 50% 40%, transparent 50%, rgba(8,10,30,0.45) 100%)"
              : "radial-gradient(120% 80% at 50% 40%, transparent 55%, rgba(31,45,30,0.12) 100%)" }}
          />

          {/* Empty-garden hint */}
          {placedItems.length === 0 && (
            <p className="absolute bottom-4 right-5 max-w-[60%] text-right text-xs italic text-ink-700/75">
              Your garden grows with focus — and with items from the shop below.
            </p>
          )}

          {/* Tiny TOD + season indicator (top-right corner, very subtle) */}
          <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-2 rounded-full bg-white/65 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-700 backdrop-blur-sm">
            <span aria-hidden>
              {tod === "dawn" ? "🌄" : tod === "day" ? "🌤️" : tod === "dusk" ? "🌇" : "🌙"}
            </span>
            <span>{tod}</span>
            <span aria-hidden className="text-ink-700/40">·</span>
            <span aria-hidden>
              {season === "spring" ? "🌸" : season === "summer" ? "☀️" : season === "autumn" ? "🍂" : "❄️"}
            </span>
            <span>{season}</span>
          </div>
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

          /* Stars + moon shimmer */
          .garden-star circle { animation: gardenTwinkle 3.6s ease-in-out infinite; }
          @keyframes gardenTwinkle { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
          .garden-moon { animation: gardenMoonGlow 6s ease-in-out infinite; }
          @keyframes gardenMoonGlow { 0%,100% { box-shadow: 0 0 22px rgba(251,245,216,0.5), inset -8px -10px 0 rgba(170,150,90,0.18); }
            50% { box-shadow: 0 0 32px rgba(251,245,216,0.8), inset -8px -10px 0 rgba(170,150,90,0.18); } }

          /* Grass sway */
          :global(.garden-grass-blade) { transform-origin: center bottom; animation: gardenSway 4.5s ease-in-out infinite; }
          @keyframes gardenSway { 0%,100% { transform: skewX(-3deg); } 50% { transform: skewX(3deg); } }

          /* Fireflies at night */
          :global(.garden-firefly) { animation: gardenFirefly 2.6s ease-in-out infinite; filter: drop-shadow(0 0 4px rgba(255,242,168,0.9)); }
          @keyframes gardenFirefly { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } }

          /* Weather — spring petals */
          .garden-petal {
            position: absolute;
            top: -10%;
            width: 10px; height: 14px;
            background: radial-gradient(closest-side, #ffd1de 0%, #ffb3c6 60%, rgba(255,179,198,0));
            border-radius: 60% 40% 60% 40% / 50% 60% 40% 50%;
            opacity: 0.85;
            animation-name: gardenDrift;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }
          /* Weather — autumn leaves (re-use drift, different glyph) */
          .garden-leaf {
            position: absolute;
            top: -10%;
            width: 12px; height: 12px;
            background: radial-gradient(closest-side, #f5a25a 0%, #d76a2a 70%, rgba(215,106,42,0));
            border-radius: 30% 70% 30% 70% / 60% 30% 70% 40%;
            opacity: 0.9;
            animation-name: gardenDrift;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }
          /* Weather — snowflakes */
          .garden-snowflake {
            position: absolute;
            top: -10%;
            width: 6px; height: 6px;
            background: radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0));
            border-radius: 50%;
            opacity: 0.95;
            animation-name: gardenDrift;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }
          @keyframes gardenDrift {
            0%   { transform: translate3d(0, 0, 0) rotate(0deg); }
            50%  { transform: translate3d(28px, 55vh, 0) rotate(180deg); }
            100% { transform: translate3d(-12px, 110vh, 0) rotate(360deg); }
          }
          /* Weather — summer sunbeams */
          .garden-rays {
            background: repeating-linear-gradient(
              115deg,
              rgba(255,236,167,0.20) 0%,
              rgba(255,236,167,0.20) 1.2%,
              rgba(255,236,167,0) 1.2%,
              rgba(255,236,167,0) 5%
            );
            mix-blend-mode: screen;
            animation: gardenRays 14s ease-in-out infinite;
          }
          @keyframes gardenRays { 0%,100% { opacity: 0.5; } 50% { opacity: 0.9; } }

          /* Lantern flicker — gentle (always-on); brightens at night via the
             item filter; this layer pulses the glow regardless. */
          :global(.garden-item-lantern .garden-item-img) {
            animation: gardenFlicker 3.4s ease-in-out infinite;
          }
          @keyframes gardenFlicker {
            0%,100% { filter: drop-shadow(0 0 10px rgba(255,200,120,0.45)) drop-shadow(0 12px 18px rgba(31,77,44,0.18)); }
            50%     { filter: drop-shadow(0 0 16px rgba(255,200,120,0.85)) drop-shadow(0 12px 18px rgba(31,77,44,0.18)); }
          }

          /* Pond ripple — gentle scale pulse */
          :global(.garden-item-pond .garden-item-img) { animation: gardenRipple 5s ease-in-out infinite; transform-origin: center; }
          @keyframes gardenRipple { 0%,100% { transform: scaleX(1); } 50% { transform: scaleX(1.015) scaleY(0.99); } }

          /* Cottage bob */
          :global(.garden-item-cottage) { animation: gardenBob 6s ease-in-out infinite; transform-origin: bottom center; }
          @keyframes gardenBob {
            0%,100% { transform: translate(-50%, -100%) translateY(0); }
            50%     { transform: translate(-50%, -100%) translateY(-1px); }
          }

          /* Fairy ring sparkle hint */
          :global(.garden-item-fairyring .garden-item-img) {
            animation: gardenSparkle 4.4s ease-in-out infinite;
            filter: drop-shadow(0 0 6px rgba(255,220,140,0.5));
          }
          @keyframes gardenSparkle {
            0%,100% { filter: drop-shadow(0 0 4px rgba(255,220,140,0.5)) drop-shadow(0 12px 18px rgba(31,77,44,0.18)); }
            50%     { filter: drop-shadow(0 0 14px rgba(255,235,180,0.95)) drop-shadow(0 12px 18px rgba(31,77,44,0.18)); }
          }

          /* Click bursts (pond ripple, lantern burst, smoke, gnome hat) */
          :global(.garden-item-burst) { animation: gardenItemBurst 720ms ease-out both; }
          @keyframes gardenItemBurst {
            0%   { transform: scale(1); }
            35%  { transform: scale(1.12); }
            100% { transform: scale(1); }
          }

          :global(.garden-pond-ripple) {
            position: absolute;
            left: 50%; bottom: 10%;
            width: 20px; height: 20px;
            margin-left: -10px;
            border: 2px solid rgba(120,200,230,0.85);
            border-radius: 50%;
            animation: gardenRingOut 700ms ease-out forwards;
            pointer-events: none;
          }
          @keyframes gardenRingOut { from { transform: scale(0.5); opacity: 0.95; } to { transform: scale(6); opacity: 0; } }

          :global(.garden-lantern-burst) {
            position: absolute; inset: 0;
            background: radial-gradient(circle at 50% 45%, rgba(255,220,140,0.95) 0%, rgba(255,220,140,0) 60%);
            animation: gardenFlash 700ms ease-out forwards;
            pointer-events: none;
          }
          @keyframes gardenFlash { 0% { opacity: 0; } 30% { opacity: 1; } 100% { opacity: 0; } }

          :global(.garden-smoke) {
            position: absolute; top: 6%;
            width: 8px; height: 8px;
            border-radius: 50%;
            background: radial-gradient(closest-side, rgba(255,255,255,0.85), rgba(255,255,255,0));
            animation: gardenSmoke 1.2s ease-out forwards;
            pointer-events: none;
          }
          @keyframes gardenSmoke {
            0%   { transform: translate(0,0) scale(0.6); opacity: 0.9; }
            100% { transform: translate(-6px,-26px) scale(1.4); opacity: 0; }
          }

          :global(.garden-gnome-hat) {
            position: absolute; left: 50%; top: -10%;
            transform: translateX(-50%);
            font-size: 14px;
            animation: gardenHatPop 720ms ease-out forwards;
            pointer-events: none;
          }
          @keyframes gardenHatPop {
            0%   { transform: translate(-50%, 0) scale(0.6); opacity: 0; }
            30%  { transform: translate(-50%, -10px) scale(1.1); opacity: 1; }
            100% { transform: translate(-50%, -22px) scale(1); opacity: 0; }
          }

          /* Butterfly flight (existing) */
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

          /* Rabbit hops along the grass band */
          .garden-rabbit {
            position: absolute;
            bottom: 6%; left: -6%;
            animation: gardenHop 24s linear infinite, gardenHopBob 0.9s ease-in-out infinite;
          }
          .garden-rabbit-fast { animation: gardenHop 16s linear infinite, gardenHopBob 0.7s ease-in-out infinite; }
          @keyframes gardenHop {
            0% { left: -6%; transform: scaleX(1); }
            45% { left: 60%; transform: scaleX(1); }
            48% { left: 60%; transform: scaleX(-1); }
            95% { left: 5%; transform: scaleX(-1); }
            98% { left: 5%; transform: scaleX(1); }
            100% { left: -6%; transform: scaleX(1); }
          }
          @keyframes gardenHopBob {
            0%,100% { transform: translateY(0); }
            50%     { transform: translateY(-8px); }
          }

          /* Songbird perched gently bouncing */
          .garden-songbird { animation: gardenPerchBob 2.4s ease-in-out infinite; transform-origin: bottom center; }
          @keyframes gardenPerchBob {
            0%,100% { transform: translateY(0) rotate(-1deg); }
            50%     { transform: translateY(-2px) rotate(1deg); }
          }

          /* Bee buzzing — small fast loop */
          .garden-bee { position: absolute; }
          .garden-bee-near-flowers { bottom: 16%; left: 14%; animation: gardenBeeLoopA 7s ease-in-out infinite; }
          .garden-bee-near-hive   { bottom: 42%; left: 19%; animation: gardenBeeLoopB 6s ease-in-out infinite; }
          @keyframes gardenBeeLoopA {
            0%,100% { transform: translate(0, 0); }
            25%     { transform: translate(40px, -10px); }
            50%     { transform: translate(80px, 4px); }
            75%     { transform: translate(40px, -8px); }
          }
          @keyframes gardenBeeLoopB {
            0%,100% { transform: translate(0, 0); }
            25%     { transform: translate(28px, -16px); }
            50%     { transform: translate(56px, -2px); }
            75%     { transform: translate(20px, -18px); }
          }

          @media (prefers-reduced-motion: reduce) {
            .garden-cloud, :global(.garden-grass-blade), .garden-butterfly,
            .garden-rabbit, .garden-songbird, .garden-bee,
            :global(.garden-star) circle, :global(.garden-firefly),
            .garden-rays, .garden-petal, .garden-leaf, .garden-snowflake,
            .garden-moon {
              animation: none !important;
            }
            :global(.garden-item-lantern .garden-item-img),
            :global(.garden-item-pond .garden-item-img),
            :global(.garden-item-cottage),
            :global(.garden-item-fairyring .garden-item-img) {
              animation: none !important;
            }
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
          one leaf grows every {MINUTES_PER_LEAF} min of focus · tap any item for a tiny surprise
        </p>
      </div>
    </section>
  );
}
