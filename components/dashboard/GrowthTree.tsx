"use client";

import { useMemo } from "react";

type Props = {
  /** Total focus minutes accumulated lifetime. Drives canopy size + leaf count. */
  lifetimeMinutes: number;
  /** Minutes today — drives the freshly-grown highlight leaves. */
  todayMinutes?: number;
  /** Number of completed tasks (lifetime). Adds blossoms when nonzero. */
  tasksDone?: number;
  /** Current streak in days — adds a small caption beneath the tree. */
  streak?: number;
};

// Leaves grow at a tunable rate — one leaf per 25 min, soft cap.
const MINUTES_PER_LEAF = 25;
const MAX_LEAVES = 80;

// Tiny seeded RNG so the same leaf index always lands in the same spot.
function rand(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return ((s >>> 0) % 10000) / 10000;
  };
}

export function GrowthTree({ lifetimeMinutes, todayMinutes = 0, tasksDone = 0, streak = 0 }: Props) {
  const leafCount = Math.min(MAX_LEAVES, Math.floor(lifetimeMinutes / MINUTES_PER_LEAF));
  const todayLeafCount = Math.min(leafCount, Math.floor(todayMinutes / MINUTES_PER_LEAF));
  const hasBlossoms = tasksDone > 0;

  // Stage caption — shown beneath the SVG.
  const stage = stageFor(lifetimeMinutes);

  // Pre-compute leaf positions deterministically so the tree shape is stable.
  const leaves = useMemo(() => {
    const r = rand(7);
    const out: { x: number; y: number; r: number; size: number; freshIndex: number }[] = [];
    for (let i = 0; i < leafCount; i++) {
      // Distribute around a canopy centered at (100, 78), spread radius ~58.
      // Bias slightly upward so the canopy sits above the trunk.
      const angle = r() * Math.PI * 2;
      const radius = 18 + r() * 50;
      const x = 100 + Math.cos(angle) * radius;
      const y = 78 + Math.sin(angle) * radius * 0.7 - 14;
      const size = 4.2 + r() * 2.4;
      const rot = (r() - 0.5) * 60;
      out.push({ x, y, r: rot, size, freshIndex: i });
    }
    return out;
  }, [leafCount]);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-ink-700">
        Your garden
      </p>

      <svg
        viewBox="0 0 200 240"
        className="h-[260px] w-full max-w-[260px] drop-shadow-[0_12px_28px_rgba(31,77,44,0.18)]"
        aria-label="A growing tree representing your focus"
        role="img"
      >
        {/* Soft halo behind the canopy */}
        <defs>
          <radialGradient id="canopyHalo" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="rgba(110,168,102,0.35)" />
            <stop offset="60%" stopColor="rgba(110,168,102,0.08)" />
            <stop offset="100%" stopColor="rgba(110,168,102,0)" />
          </radialGradient>
          <linearGradient id="trunkGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7a5235" />
            <stop offset="100%" stopColor="#54371d" />
          </linearGradient>
          <linearGradient id="leafGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7fb472" />
            <stop offset="100%" stopColor="#3a8a4c" />
          </linearGradient>
          <linearGradient id="leafFresh" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#a9d68e" />
            <stop offset="100%" stopColor="#5fa05a" />
          </linearGradient>
        </defs>

        <ellipse cx={100} cy={78} rx={86} ry={70} fill="url(#canopyHalo)" />

        {/* Soil mound */}
        <ellipse cx={100} cy={222} rx={70} ry={6} fill="rgba(60,40,20,0.18)" />

        {/* Trunk + branches scale with lifetime */}
        <Trunk lifetimeMinutes={lifetimeMinutes} />

        {/* Leaves */}
        {leaves.map((l, i) => {
          const isFresh = i >= leafCount - todayLeafCount;
          return (
            <g
              key={i}
              transform={`translate(${l.x.toFixed(2)} ${l.y.toFixed(2)}) rotate(${l.r.toFixed(1)})`}
              className={isFresh ? "animate-leaf-grow" : "animate-leaf-sway"}
              style={isFresh ? { animationDelay: `${(i % 6) * 80}ms` } : { animationDelay: `${(i % 7) * 350}ms` }}
            >
              <Leaf size={l.size} fresh={isFresh} />
            </g>
          );
        })}

        {/* Blossoms when tasks have been completed */}
        {hasBlossoms && <Blossoms count={Math.min(tasksDone, 6)} />}

        {/* Seedling stage — show a tiny sprout if no leaves yet */}
        {leafCount === 0 && <Seedling />}
      </svg>

      <div className="text-center">
        <p className="font-display text-sm italic text-ink-900">{stage}</p>
        <p className="text-[10px] uppercase tracking-[0.28em] text-ink-700/75">
          {leafCount} {leafCount === 1 ? "leaf" : "leaves"}
          {streak > 0 && <span className="ml-2">· {streak}-day streak</span>}
        </p>
      </div>
    </div>
  );
}

// =================================================================

function Trunk({ lifetimeMinutes }: { lifetimeMinutes: number }) {
  // Trunk thickens + branches multiply with focus minutes.
  const branchLevel =
    lifetimeMinutes < 30 ? 0
    : lifetimeMinutes < 180 ? 1
    : lifetimeMinutes < 720 ? 2
    : 3;

  return (
    <g>
      {/* Main trunk */}
      <path
        d="M 100 220 C 96 196, 96 170, 99 140 C 100 124, 102 108, 100 88"
        stroke="url(#trunkGrad)"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />

      {branchLevel >= 1 && (
        <>
          <path d="M 100 152 C 88 142, 76 132, 64 124" stroke="url(#trunkGrad)" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 100 138 C 112 128, 124 118, 140 112" stroke="url(#trunkGrad)" strokeWidth="4" strokeLinecap="round" fill="none" />
        </>
      )}
      {branchLevel >= 2 && (
        <>
          <path d="M 100 116 C 90 104, 80 96, 68 92" stroke="url(#trunkGrad)" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 100 102 C 110 92, 122 84, 134 80" stroke="url(#trunkGrad)" strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      )}
      {branchLevel >= 3 && (
        <>
          <path d="M 75 124 C 66 118, 56 116, 48 118" stroke="url(#trunkGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 130 110 C 142 104, 154 102, 162 104" stroke="url(#trunkGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </>
      )}

      {/* Tiny grass tufts at the base */}
      <path d="M 80 222 Q 82 216 84 222" stroke="#3a8a4c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 90 222 Q 93 214 96 222" stroke="#3a8a4c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 110 222 Q 113 216 116 222" stroke="#3a8a4c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 120 222 Q 122 215 124 222" stroke="#3a8a4c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Leaf({ size, fresh }: { size: number; fresh: boolean }) {
  // Almond-shaped leaf with a centerline vein.
  return (
    <g>
      <path
        d={`M 0 ${-size} C ${size * 0.9} ${-size * 0.6}, ${size * 0.9} ${size * 0.6}, 0 ${size} C ${-size * 0.9} ${size * 0.6}, ${-size * 0.9} ${-size * 0.6}, 0 ${-size} Z`}
        fill={fresh ? "url(#leafFresh)" : "url(#leafGrad)"}
        opacity={fresh ? 0.95 : 0.85}
      />
      <line x1="0" y1={-size * 0.85} x2="0" y2={size * 0.85} stroke="rgba(20,50,30,0.25)" strokeWidth="0.4" />
    </g>
  );
}

function Blossoms({ count }: { count: number }) {
  // Tiny pink dots scattered in the canopy — indicate completed tasks.
  const r = rand(101);
  const items: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const angle = r() * Math.PI * 2;
    const radius = 24 + r() * 38;
    items.push({ x: 100 + Math.cos(angle) * radius, y: 64 + Math.sin(angle) * radius * 0.7 });
  }
  return (
    <g>
      {items.map((p, i) => (
        <circle
          key={i}
          cx={p.x.toFixed(2)}
          cy={p.y.toFixed(2)}
          r={2.4}
          fill="#f3a4b8"
          stroke="#e07c95"
          strokeWidth={0.5}
          opacity={0.9}
        />
      ))}
    </g>
  );
}

function Seedling() {
  return (
    <g>
      <path d="M 100 222 L 100 200" stroke="#3a8a4c" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 100 208 C 92 204, 88 198, 90 192 C 96 196, 100 200, 100 208 Z" fill="#7fb472" />
      <path d="M 100 204 C 108 200, 112 194, 110 188 C 104 192, 100 196, 100 204 Z" fill="#7fb472" />
    </g>
  );
}

function stageFor(lifetimeMinutes: number) {
  if (lifetimeMinutes < 30)   return "A tiny sprout.";
  if (lifetimeMinutes < 180)  return "A young sapling.";
  if (lifetimeMinutes < 720)  return "Branching out.";
  if (lifetimeMinutes < 3000) return "A leafy canopy.";
  return "A grand old tree.";
}
