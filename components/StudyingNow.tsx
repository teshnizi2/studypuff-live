"use client";

import { useEffect, useState } from "react";

const MIN = 17;
const MAX = 55;

// Deterministic from time — every visitor sees a similar value at the same
// moment, refreshes don't jump, and the value drifts smoothly by 1–2 every
// minute. Three sine waves with non-multiple periods keep it from looping
// in any obvious way.
function studyingNowAt(t: number): number {
  const s = t / 1000;
  const a = Math.sin(s / (60 * 17.3)) * 0.5 + 0.5;
  const b = Math.sin(s / (60 * 4.1) + 0.7) * 0.5 + 0.5;
  const c = Math.sin(s / (60 * 1.7) + 1.3) * 0.5 + 0.5;
  const mix = a * 0.55 + b * 0.3 + c * 0.15;
  return Math.round(MIN + mix * (MAX - MIN));
}

export function StudyingNow() {
  const [n, setN] = useState<number | null>(null);

  useEffect(() => {
    setN(studyingNowAt(Date.now()));
    const id = setInterval(() => setN(studyingNowAt(Date.now())), 15000);
    return () => clearInterval(id);
  }, []);

  // SSR placeholder — keep the surrounding layout from jumping
  if (n === null) {
    return <span aria-hidden>—</span>;
  }

  return (
    <span>
      <strong>{n}</strong> studying now
    </span>
  );
}
