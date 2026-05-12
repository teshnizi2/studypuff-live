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

const MINUTES_PER_LEAF = 25;
const MAX_LEAVES = 80;

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

  const stage = stageFor(lifetimeMinutes);

  // Leaf positions — bias toward the trunk top at low counts so early leaves
  // actually sit on the plant instead of floating off into the sky.
  const leaves = useMemo(() => {
    const r = rand(7);
    const out: { x: number; y: number; r: number; size: number }[] = [];
    // Canopy radius grows with leaf count — a 1-leaf plant has a tight crown,
    // an 80-leaf tree has a wide one.
    const crownRadius = 14 + Math.min(60, leafCount * 1.1);
    for (let i = 0; i < leafCount; i++) {
      const angle = r() * Math.PI * 2;
      const radius = 6 + r() * crownRadius;
      const x = 100 + Math.cos(angle) * radius;
      const y = 86 + Math.sin(angle) * radius * 0.75 - 12;
      const size = 4.6 + r() * 2.4;
      const rot = (r() - 0.5) * 60;
      out.push({ x, y, r: rot, size });
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
        <defs>
          {/* Warm sky behind everything — gives the scene depth. */}
          <linearGradient id="skyBg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fdfbf7" />
            <stop offset="55%" stopColor="#f4ead9" />
            <stop offset="100%" stopColor="#e7decb" />
          </linearGradient>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(251,233,165,0.95)" />
            <stop offset="60%" stopColor="rgba(251,233,165,0.35)" />
            <stop offset="100%" stopColor="rgba(251,233,165,0)" />
          </radialGradient>
          <radialGradient id="canopyHalo" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="rgba(110,168,102,0.4)" />
            <stop offset="60%" stopColor="rgba(110,168,102,0.1)" />
            <stop offset="100%" stopColor="rgba(110,168,102,0)" />
          </radialGradient>
          <linearGradient id="trunkGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#5b3b21" />
            <stop offset="45%" stopColor="#7a5235" />
            <stop offset="100%" stopColor="#4a2f1a" />
          </linearGradient>
          <linearGradient id="leafGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#86bd77" />
            <stop offset="100%" stopColor="#3a8a4c" />
          </linearGradient>
          <linearGradient id="leafFresh" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#b9e29c" />
            <stop offset="100%" stopColor="#5fa05a" />
          </linearGradient>
          <radialGradient id="ground" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="rgba(135,103,68,0.55)" />
            <stop offset="100%" stopColor="rgba(135,103,68,0)" />
          </radialGradient>
        </defs>

        {/* Sky — rounded rect so the scene reads as a little vignette. */}
        <rect x={4} y={4} width={192} height={232} rx={18} fill="url(#skyBg)" />

        {/* Sun + halo, top right */}
        <circle cx={160} cy={42} r={28} fill="url(#sunGlow)" />
        <circle cx={160} cy={42} r={9} fill="#fbe9a5" opacity={0.9} />

        {/* Soft clouds */}
        <Cloud x={36} y={36} scale={0.9} />
        <Cloud x={104} y={26} scale={0.55} />

        {/* Canopy halo — only meaningful once leaves exist */}
        {leafCount > 0 && (
          <ellipse cx={100} cy={82} rx={Math.min(90, 30 + leafCount * 1.2)} ry={Math.min(72, 22 + leafCount)} fill="url(#canopyHalo)" />
        )}

        {/* Ground patch */}
        <ellipse cx={100} cy={222} rx={86} ry={14} fill="url(#ground)" />
        <ellipse cx={100} cy={222} rx={72} ry={5} fill="rgba(60,40,20,0.22)" />

        {/* Pebbles for character */}
        <ellipse cx={42} cy={224} rx={4} ry={2} fill="rgba(60,40,20,0.35)" />
        <ellipse cx={158} cy={226} rx={3} ry={1.5} fill="rgba(60,40,20,0.3)" />
        <ellipse cx={68} cy={228} rx={2.6} ry={1.3} fill="rgba(60,40,20,0.28)" />

        {/* Trunk + branches scale with lifetime */}
        <Trunk lifetimeMinutes={lifetimeMinutes} />

        {/* Sapling tuft at the top of the trunk — guarantees a green silhouette
            even before the first leaf has technically grown. */}
        {leafCount < 4 && <SaplingTuft />}

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

        {/* Grass tufts — a richer cluster than before */}
        <GrassTufts />

        {/* Tiny butterfly for delight at any stage */}
        <Butterfly />
      </svg>

      <div className="text-center">
        <p className="font-display text-sm italic text-ink-900">{stage}</p>
        <p className="text-[10px] uppercase tracking-[0.28em] text-ink-700/75">
          {leafCount} {leafCount === 1 ? "leaf" : "leaves"}
          {streak > 0 && <span className="ml-2">· {streak}-day streak</span>}
        </p>

        {leafCount < MAX_LEAVES && (
          <p
            className="mt-2 text-[10px] italic text-ink-700/75"
            title={`Each ${MINUTES_PER_LEAF} min of focus grows a leaf. ` +
              `Branches at 30, 180, 720 min. Cap is ${MAX_LEAVES} leaves.`}
          >
            next leaf in {Math.max(1, MINUTES_PER_LEAF - (lifetimeMinutes % MINUTES_PER_LEAF))}m
          </p>
        )}

        <p className="mt-1 text-[9px] uppercase tracking-[0.24em] text-ink-700/55">
          1 leaf per {MINUTES_PER_LEAF} min focus
        </p>
      </div>
    </div>
  );
}

// =================================================================

function Trunk({ lifetimeMinutes }: { lifetimeMinutes: number }) {
  const branchLevel =
    lifetimeMinutes < 30 ? 0
    : lifetimeMinutes < 180 ? 1
    : lifetimeMinutes < 720 ? 2
    : 3;

  // Trunk thickness scales subtly with age so the sprout doesn't read as
  // a fully-grown tree's stick.
  const baseWidth = lifetimeMinutes < 30 ? 6 : lifetimeMinutes < 180 ? 8 : 10;

  return (
    <g>
      {/* Tapered trunk — wider at the base, narrowing toward the canopy. */}
      <path
        d="M 96 220 C 94 200, 94 174, 97 144 C 98 126, 102 110, 100 92"
        stroke="url(#trunkGrad)"
        strokeWidth={baseWidth}
        strokeLinecap="round"
        fill="none"
      />
      {/* Highlight stroke for a hint of bark texture */}
      <path
        d="M 98 218 C 96 198, 96 172, 99 142"
        stroke="rgba(255,240,220,0.18)"
        strokeWidth={1.4}
        strokeLinecap="round"
        fill="none"
      />

      {/* Roots spreading at the base */}
      <path d="M 100 218 C 92 218, 84 220, 78 224" stroke="url(#trunkGrad)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 100 218 C 108 218, 116 220, 122 224" stroke="url(#trunkGrad)" strokeWidth="3" strokeLinecap="round" fill="none" />

      {branchLevel >= 1 && (
        <>
          <path d="M 100 152 C 86 144, 74 134, 60 124" stroke="url(#trunkGrad)" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M 100 138 C 114 128, 126 118, 142 112" stroke="url(#trunkGrad)" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        </>
      )}
      {branchLevel >= 2 && (
        <>
          <path d="M 100 116 C 88 104, 78 96, 64 92" stroke="url(#trunkGrad)" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 100 102 C 112 92, 124 84, 138 80" stroke="url(#trunkGrad)" strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      )}
      {branchLevel >= 3 && (
        <>
          <path d="M 72 124 C 62 118, 52 116, 44 118" stroke="url(#trunkGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 132 110 C 144 104, 156 102, 164 104" stroke="url(#trunkGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </>
      )}
    </g>
  );
}

function SaplingTuft() {
  // A small cluster of leaves perched on the trunk top so the silhouette
  // always reads as a plant, not a stick.
  return (
    <g transform="translate(100 86)" className="animate-leaf-sway">
      <ellipse cx={0} cy={0} rx={18} ry={12} fill="url(#leafGrad)" opacity={0.85} />
      <path
        d="M -10 -2 C -6 -10, 4 -12, 10 -6 C 14 -2, 12 6, 6 8 C -2 10, -10 6, -10 -2 Z"
        fill="url(#leafFresh)"
        opacity={0.95}
      />
      <path d="M 0 8 L 0 18" stroke="rgba(20,50,30,0.35)" strokeWidth={0.6} />
    </g>
  );
}

function Leaf({ size, fresh }: { size: number; fresh: boolean }) {
  return (
    <g>
      <path
        d={`M 0 ${-size} C ${size * 0.9} ${-size * 0.6}, ${size * 0.9} ${size * 0.6}, 0 ${size} C ${-size * 0.9} ${size * 0.6}, ${-size * 0.9} ${-size * 0.6}, 0 ${-size} Z`}
        fill={fresh ? "url(#leafFresh)" : "url(#leafGrad)"}
        opacity={fresh ? 0.95 : 0.9}
      />
      <line x1="0" y1={-size * 0.85} x2="0" y2={size * 0.85} stroke="rgba(20,50,30,0.25)" strokeWidth="0.4" />
    </g>
  );
}

function Blossoms({ count }: { count: number }) {
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
        <g key={i} transform={`translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})`}>
          <circle r={3} fill="#f3a4b8" stroke="#e07c95" strokeWidth={0.5} opacity={0.95} />
          <circle r={1} fill="#fff3b8" opacity={0.85} />
        </g>
      ))}
    </g>
  );
}

function GrassTufts() {
  // Hand-placed tufts so the spacing feels designed, not random.
  const tufts = [
    { x: 26, h: 10 }, { x: 36, h: 6 }, { x: 50, h: 12 },
    { x: 78, h: 7 }, { x: 88, h: 11 }, { x: 112, h: 6 },
    { x: 124, h: 12 }, { x: 138, h: 8 }, { x: 154, h: 11 }, { x: 168, h: 7 }
  ];
  return (
    <g>
      {tufts.map((t, i) => (
        <path
          key={i}
          d={`M ${t.x - 3} 224 Q ${t.x} ${224 - t.h} ${t.x + 3} 224`}
          stroke={i % 2 ? "#3a8a4c" : "#5fa05a"}
          strokeWidth={1.4}
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

function Cloud({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={0.75}>
      <ellipse cx={0} cy={0} rx={14} ry={5} fill="#ffffff" />
      <ellipse cx={10} cy={-3} rx={9} ry={5} fill="#ffffff" />
      <ellipse cx={-10} cy={-2} rx={8} ry={4} fill="#ffffff" />
    </g>
  );
}

function Butterfly() {
  // Sits perched on a branch area; subtle delight, no animation cost.
  return (
    <g transform="translate(60 100)" opacity={0.85}>
      <ellipse cx={0} cy={0} rx={2.4} ry={1.2} fill="#c97f72" transform="rotate(-25)" />
      <ellipse cx={3} cy={-0.5} rx={2.2} ry={1} fill="#c97f72" transform="rotate(25)" />
      <line x1={0} y1={0} x2={1.5} y2={-0.5} stroke="#1f1f1f" strokeWidth={0.4} />
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
