type Props = {
  className?: string;
  tone?: "pink" | "peach" | "butter" | "mint" | "sky" | "lilac";
};

const toneMap: Record<NonNullable<Props["tone"]>, string> = {
  pink: "#f3c6c2",
  peach: "#f6d4b7",
  butter: "#fbe9a5",
  mint: "#c7e2c7",
  sky: "#c6dceb",
  lilac: "#d9cdea"
};

export default function SheepMascot({ className = "", tone = "butter" }: Props) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      aria-label="StudyPuff sheep mascot"
      role="img"
      style={{ backgroundColor: toneMap[tone] }}
    >
      <img src="/sheep.png" alt="StudyPuff sheep mascot" className="h-full w-full object-contain p-2" />
    </div>
  );
}
