type Props = {
  className?: string;
  waves?: number;
  opacity?: number;
};

export function Squiggle({ className = "", waves = 14, opacity = 0.18 }: Props) {
  const step = 25;
  let d = `M 0 5 Q ${step / 2} 0, ${step} 5`;
  for (let i = 2; i <= waves; i++) d += ` T ${i * step} 5`;
  const w = waves * step;
  return (
    <svg
      viewBox={`0 0 ${w} 10`}
      preserveAspectRatio="none"
      className={`block h-2 w-full text-ink-900 ${className}`}
      aria-hidden
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeOpacity={opacity}
        strokeWidth={1}
        strokeLinecap="round"
      />
    </svg>
  );
}
