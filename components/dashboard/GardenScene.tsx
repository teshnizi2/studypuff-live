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

type Tod = "dawn" | "day" | "dusk" | "night";
type Season = "spring" | "summer" | "autumn" | "winter";

/**
 * Garden v15 — single-painter approach.
 *
 * The core insight that got us here: 2D images composited on a background
 * are *scrapbook*, not *game*. The fix isn't another rendering tweak —
 * it's avoiding compositing entirely. So now the scene IS the painting.
 *
 * As the user buys items, the garden evolves through 5 painted stages
 * (empty → sprouting → growing → mature → lush). Each stage is a single
 * FLUX-generated illustration. One artist, one canvas, perfect coherence.
 * Day/night palette overlay, season weather, sun-arc HUD, and the brand
 * sheep stay on top — but no per-item composites.
 *
 * The 25 individual items live as a beautiful collection gallery
 * (GardenCollection modal) instead of being pasted into the scene.
 */
export function GardenScene({ lifetimeMinutes, todayMinutes, streak, ownedItemIds }: Props) {
  const leafCount = Math.min(MAX_LEAVES, Math.floor(lifetimeMinutes / MINUTES_PER_LEAF));
  const todayLeaves = Math.floor(todayMinutes / MINUTES_PER_LEAF);
  const intoNext = lifetimeMinutes % MINUTES_PER_LEAF;
  const pct = Math.round((intoNext / MINUTES_PER_LEAF) * 100);
  const stage = stageFor(lifetimeMinutes);

  const ownedSet = useMemo(() => new Set(ownedItemIds), [ownedItemIds]);
  const ownedGardenCount = useMemo(
    () => REWARDS.filter((r) => isGardenCategory(r.category) && ownedSet.has(r.id)).length,
    [ownedSet]
  );

  // Which painted-scene stage to show, based on owned garden-item count.
  const sceneStage = stageIdFor(ownedGardenCount);
  const nextThreshold = nextStageThreshold(ownedGardenCount);
  const sceneSrc = `/garden-stage-${sceneStage}.webp`;
  const stageLabel = STAGE_LABEL[sceneStage];

  // Time-of-day driven from <html data-tod> (set pre-paint by dashboard layout).
  const [tod, setTod] = useState<Tod>("day");
  useEffect(() => {
    if (typeof document === "undefined") return;
    const read = () => setTod((document.documentElement.dataset.tod || "day") as Tod);
    read();
    const id = window.setInterval(read, 60_000);
    return () => clearInterval(id);
  }, []);
  const isNight = tod === "night";

  // Season cycles every 22 s so user sees all four weather types.
  const seasons: Season[] = ["spring", "summer", "autumn", "winter"];
  const [season, setSeason] = useState<Season>("spring");
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    const id = window.setInterval(() => {
      i = (i + 1) % seasons.length;
      setSeason(seasons[i]);
    }, 22_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sceneTone = isNight
    ? "saturate(0.55) brightness(0.55) hue-rotate(-10deg)"
    : tod === "dusk" ? "saturate(0.95) brightness(0.92) hue-rotate(8deg)"
    : tod === "dawn" ? "saturate(0.92) brightness(1.02) hue-rotate(-4deg)"
    : "none";

  return (
    <section className="flex flex-col items-center">
      <div
        className="relative w-full overflow-hidden rounded-[28px] border border-white/60 shadow-[0_30px_60px_-30px_rgba(31,77,44,0.45),inset_0_1px_0_rgba(255,255,255,0.7)]"
        data-tod={tod}
        data-season={season}
      >
        <div className="relative aspect-[16/8] w-full">
          {/* Stage painting — single coherent illustration */}
          <img
            src={sceneSrc}
            alt={`Your garden — ${stageLabel.toLowerCase()}`}
            className="absolute inset-0 block h-full w-full object-cover transition-[filter,opacity] duration-1000 ease-in-out"
            style={{ filter: sceneTone }}
          />

          {/* Night sky overlay */}
          {isNight && (
            <div aria-hidden className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(to bottom, rgba(20,22,58,0.5) 0%, rgba(40,40,90,0.4) 60%, rgba(28,28,60,0.55) 100%)" }} />
          )}
          {/* Dawn / dusk warm wash */}
          {(tod === "dusk" || tod === "dawn") && (
            <div aria-hidden className="pointer-events-none absolute inset-0"
              style={{ background: tod === "dusk"
                ? "linear-gradient(to bottom, rgba(255,140,90,0.18) 0%, rgba(255,170,120,0.08) 50%, rgba(255,200,160,0.04) 100%)"
                : "linear-gradient(to bottom, rgba(255,200,140,0.16) 0%, rgba(255,220,180,0.06) 50%, rgba(255,240,210,0.02) 100%)" }} />
          )}

          {/* Stars + moon at night */}
          {isNight && (
            <>
              <div aria-hidden className="pointer-events-none absolute" style={{ left: "82%", top: "10%" }}>
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
              <svg aria-hidden viewBox="0 0 1600 800" preserveAspectRatio="xMidYMid slice"
                className="pointer-events-none absolute inset-0 h-full w-full">
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

          {/* Weather overlay — petals (spring) / rays (summer) / leaves (autumn) / snow (winter) */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {season === "spring" && (
              <>
                {Array.from({ length: 14 }).map((_, i) => (
                  <span key={i} className="garden-petal" style={{ left: `${(i * 7 + 4) % 100}%`, animationDelay: `${(i * 0.7) % 6}s`, animationDuration: `${10 + (i % 5)}s` }} />
                ))}
              </>
            )}
            {season === "summer" && <div className="garden-rays absolute inset-0" />}
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

          {/* Brand sheep mascot — small, in the bottom corner, reading a book.
              Acts as the player character without intruding on the painting. */}
          <div className="absolute bottom-3 left-4 z-10 sm:bottom-4 sm:left-6" aria-hidden>
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/studypuff-sheep.png"
                alt=""
                className="block h-auto w-[clamp(56px,8%,104px)] drop-shadow-[0_8px_12px_rgba(31,77,44,0.35)]"
                style={{ filter: isNight ? "brightness(0.85)" : "none" }}
              />
            </div>
          </div>

          {/* Sun-arc HUD top-right */}
          <SunArcHud tod={tod} season={season} />

          {/* Soft centre vignette */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: isNight
              ? "radial-gradient(120% 80% at 50% 40%, transparent 50%, rgba(8,10,30,0.45) 100%)"
              : "radial-gradient(120% 80% at 50% 40%, transparent 55%, rgba(31,45,30,0.10) 100%)" }}
          />
        </div>

        <style jsx>{`
          /* Stars + moon */
          :global(.garden-star) circle { animation: gardenTwinkle 3.6s ease-in-out infinite; }
          @keyframes gardenTwinkle { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
          .garden-moon { animation: gardenMoonGlow 6s ease-in-out infinite; }
          @keyframes gardenMoonGlow { 0%,100% { box-shadow: 0 0 22px rgba(251,245,216,0.5), inset -8px -10px 0 rgba(170,150,90,0.18); }
            50% { box-shadow: 0 0 32px rgba(251,245,216,0.8), inset -8px -10px 0 rgba(170,150,90,0.18); } }

          /* Weather */
          .garden-petal {
            position: absolute; top: -10%;
            width: 10px; height: 14px;
            background: radial-gradient(closest-side, #ffd1de 0%, #ffb3c6 60%, rgba(255,179,198,0));
            border-radius: 60% 40% 60% 40% / 50% 60% 40% 50%;
            opacity: 0.85;
            animation-name: gardenDrift;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }
          .garden-leaf {
            position: absolute; top: -10%;
            width: 12px; height: 12px;
            background: radial-gradient(closest-side, #f5a25a 0%, #d76a2a 70%, rgba(215,106,42,0));
            border-radius: 30% 70% 30% 70% / 60% 30% 70% 40%;
            opacity: 0.9;
            animation-name: gardenDrift;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }
          .garden-snowflake {
            position: absolute; top: -10%;
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

          @media (prefers-reduced-motion: reduce) {
            :global(.garden-star) circle,
            .garden-moon,
            .garden-rays, .garden-petal, .garden-leaf, .garden-snowflake {
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

        {/* Scene-stage progress */}
        <div className="mt-5 rounded-2xl border border-white/60 bg-gradient-to-br from-cream-50 to-brand-butter/30 p-4">
          <div className="flex items-baseline justify-between text-[10px] uppercase tracking-[0.22em] text-ink-700/80">
            <span>your garden</span>
            <span className="font-semibold text-ink-900">{stageLabel}</span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            {(["0", "1", "2", "3", "4"] as const).map((s) => {
              const idx = Number(s);
              return (
                <div key={s}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-700
                    ${idx <= sceneStage
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                      : "bg-ink-900/10"}`}
                />
              );
            })}
          </div>
          {nextThreshold ? (
            <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-ink-700/70">
              buy {nextThreshold - ownedGardenCount} more item{nextThreshold - ownedGardenCount === 1 ? "" : "s"} to unlock the next stage
            </p>
          ) : (
            <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-emerald-700">
              ✨ peak abundance — your garden is fully tended
            </p>
          )}
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
          one leaf grows every {MINUTES_PER_LEAF} min of focus
        </p>
      </div>
    </section>
  );
}

// Stage thresholds: count of owned garden items → which painted scene to show.
function stageIdFor(ownedCount: number): 0 | 1 | 2 | 3 | 4 {
  if (ownedCount === 0) return 0;
  if (ownedCount <= 5) return 1;
  if (ownedCount <= 12) return 2;
  if (ownedCount <= 18) return 3;
  return 4;
}
function nextStageThreshold(ownedCount: number): number | null {
  if (ownedCount === 0) return 1;
  if (ownedCount < 6) return 6;
  if (ownedCount < 13) return 13;
  if (ownedCount < 19) return 19;
  return null; // peak
}
const STAGE_LABEL: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "Untended",
  1: "Sprouting",
  2: "Growing",
  3: "Mature",
  4: "Lush"
};

/**
 * In-game sun-arc HUD plaque. Sun (day/dawn/dusk) or moon (night) slides
 * along a half-arc to show day progress. Painterly look.
 */
function SunArcHud({ tod, season }: { tod: Tod; season: Season }) {
  const progress: number =
    tod === "dawn" ? 0.12 :
    tod === "day"  ? 0.5 :
    tod === "dusk" ? 0.88 : 0.5;
  const isNight = tod === "night";
  const cx = 52, cy = 56, r = 44;
  const angle = Math.PI * (1 - progress);
  const orbX = cx + r * Math.cos(angle);
  const orbY = cy - r * Math.sin(angle);
  const seasonGlyph = season === "spring" ? "🌸" : season === "summer" ? "☀️" : season === "autumn" ? "🍂" : "❄️";
  const seasonLabel = season.charAt(0).toUpperCase() + season.slice(1);
  const todLabel = tod.charAt(0).toUpperCase() + tod.slice(1);

  return (
    <div
      aria-label={`${todLabel} · ${seasonLabel}`}
      className="pointer-events-none absolute right-4 top-4 select-none"
      style={{ width: 132, filter: "drop-shadow(0 6px 12px rgba(31,77,44,0.18))" }}
    >
      <svg viewBox="0 0 132 86" className="block w-full">
        <defs>
          <linearGradient id="plaque-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isNight ? "#3a3766" : "#fbe6c8"} />
            <stop offset="100%" stopColor={isNight ? "#262346" : "#f3cf9a"} />
          </linearGradient>
          <linearGradient id="arc-bg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={isNight ? "#1d1f48" : "#ffd5a4"} />
            <stop offset="50%" stopColor={isNight ? "#3a3d70" : "#ffb88a"} />
            <stop offset="100%" stopColor={isNight ? "#1d1f48" : "#5a3f6f"} />
          </linearGradient>
          <radialGradient id="orb-day" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff6c4" />
            <stop offset="60%" stopColor="#ffd07a" />
            <stop offset="100%" stopColor="#ffa64d" />
          </radialGradient>
          <radialGradient id="orb-night" cx="40%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#fbf5d8" />
            <stop offset="65%" stopColor="#e2d4a0" />
            <stop offset="100%" stopColor="#aa9658" />
          </radialGradient>
        </defs>
        <rect x="2" y="2" width="128" height="82" rx="14" ry="14"
          fill="url(#plaque-fill)" stroke={isNight ? "#7d7aa8" : "#b88a5b"} strokeWidth="2" />
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy} Z`} fill="url(#arc-bg)" opacity="0.92" />
        <path d={`M ${cx - r + 4} ${cy - 1} A ${r - 4} ${r - 4} 0 0 1 ${cx + r - 4} ${cy - 1}`}
          fill="none" stroke={isNight ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.55)"} strokeWidth="1.5" />
        {[0, 0.5, 1].map((p) => {
          const a = Math.PI * (1 - p);
          const x1 = cx + (r + 1) * Math.cos(a);
          const y1 = cy - (r + 1) * Math.sin(a);
          const x2 = cx + (r - 4) * Math.cos(a);
          const y2 = cy - (r - 4) * Math.sin(a);
          return (
            <line key={p} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={isNight ? "rgba(255,255,255,0.55)" : "#7a4a22"} strokeWidth="1.2" strokeLinecap="round" />
          );
        })}
        <circle cx={orbX} cy={orbY} r="6.5"
          fill={isNight ? "url(#orb-night)" : "url(#orb-day)"} />
        <circle cx={orbX} cy={orbY} r="11"
          fill={isNight ? "rgba(251,245,216,0.18)" : "rgba(255,200,100,0.32)"} />
        <line x1="6" y1="58" x2="126" y2="58"
          stroke={isNight ? "rgba(255,255,255,0.25)" : "rgba(122,74,34,0.55)"} strokeWidth="1.2" />
        <text x="66" y="76" textAnchor="middle"
          fontSize="11" fontWeight="700"
          fill={isNight ? "#f3eed1" : "#5a3920"}
          fontFamily="system-ui, -apple-system, sans-serif">
          {todLabel} · {seasonLabel}
        </text>
      </svg>
      <span
        aria-hidden
        className="absolute -right-1 -top-1 select-none text-base"
        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.18))" }}
      >
        {seasonGlyph}
      </span>
    </div>
  );
}
