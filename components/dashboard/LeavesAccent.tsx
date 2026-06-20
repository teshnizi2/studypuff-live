// Positions are kept in the margins (corners and side edges) so the leaves
// add ambiance without drifting behind the centered timer or the bottom
// weekly chart, where the translucent bars would let a leaf show through.
const LEAVES = [
  { top: "10%", left: "91%", size: 84,  rot: -18, hue: "#7aa56a", anim: "animate-drift" },
  { top: "58%", left: "-4%", size: 110, rot:  22, hue: "#5b8a55", anim: "animate-drift-slow" },
  { top: "82%", left: "6%",  size: 74,  rot:  -8, hue: "#a4b88c", anim: "animate-drift" },
  { top: "16%", left: "12%", size: 58,  rot:  40, hue: "#c5d4a8", anim: "animate-drift-slow" }
];

export function LeavesAccent() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {LEAVES.map((l, i) => (
        <svg
          key={i}
          viewBox="0 0 100 100"
          width={l.size}
          height={l.size}
          style={{
            position: "absolute",
            top: l.top,
            left: l.left,
            ["--rot" as string]: `${l.rot}deg`,
            color: l.hue,
            opacity: 0.18
          }}
          className={l.anim}
        >
          <path
            d="M50 8 C 78 18, 90 50, 50 92 C 10 50, 22 18, 50 8 Z"
            fill="currentColor"
          />
          <path
            d="M50 12 L 50 88"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      ))}
    </div>
  );
}
