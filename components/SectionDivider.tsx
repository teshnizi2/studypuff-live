// Subtle hand-drawn wavy divider between major sections.

type Props = {
  tone?: "ink" | "pink" | "mint" | "butter";
};

const TONE_COLOR: Record<NonNullable<Props["tone"]>, string> = {
  ink: "rgba(31,31,31,0.18)",
  pink: "#c97f72",
  mint: "#5b8a55",
  butter: "#c79a3a"
};

export default function SectionDivider({ tone = "ink" }: Props) {
  const stroke = TONE_COLOR[tone];
  return (
    <div aria-hidden className="relative flex justify-center py-2">
      <svg
        viewBox="0 0 320 24"
        className="h-6 w-72"
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M4 12 Q 40 2 80 12 T 160 12 T 240 12 T 316 12" />
        <circle cx="160" cy="12" r="2.5" fill={stroke} stroke="none" />
      </svg>
    </div>
  );
}
