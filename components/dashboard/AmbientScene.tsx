"use client";

import { useEffect, useMemo, useState } from "react";

export type TimeOfDay = "dawn" | "day" | "dusk" | "night";

export function timeOfDayFor(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 9) return "dawn";
  if (hour >= 9 && hour < 17) return "day";
  if (hour >= 17 && hour < 21) return "dusk";
  return "night";
}

// Deterministic pseudo-random so flower placement is stable between renders.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * AmbientScene — the living garden world behind the dashboard.
 *
 * A fixed, full-viewport, pointer-events-none, aria-hidden layer painting:
 *  - a bespoke time-of-day sky (dawn / day / dusk / night), readable at every
 *    hour because the lower half (where content sits) always stays light;
 *  - slow-drifting light blooms + faint pollen motes;
 *  - a layered meadow with parallax hills and gently swaying grass;
 *  - two trees that frame the empty left/right edges of wide screens;
 *  - flowers whose count grows with today's focus minutes — a persistent,
 *    generative garden (never punitive: they only ever accumulate).
 *
 * All motion is transform/opacity only and fully disabled under
 * prefers-reduced-motion (see globals.css `.amb-*`). Time of day defaults to
 * "day" on the server so SSR matches first paint, then corrects on mount.
 */
export function AmbientScene({
  tod: todProp,
  todayMinutes = 0,
  lifetimeMinutes = 0
}: {
  tod?: TimeOfDay;
  todayMinutes?: number;
  lifetimeMinutes?: number;
}) {
  const [tod, setTod] = useState<TimeOfDay>(todProp ?? "day");

  useEffect(() => {
    if (todProp) return;
    const apply = () => setTod(timeOfDayFor(new Date().getHours()));
    apply();
    const id = window.setInterval(apply, 5 * 60 * 1000);
    return () => window.clearInterval(id);
  }, [todProp]);

  // Garden density: a few flowers from lifetime progress (so the meadow is
  // never barren), plus more as today's minutes climb. Capped so it stays calm.
  const flowerCount = useMemo(() => {
    const base = Math.min(6, Math.floor(lifetimeMinutes / 120)); // 1 per 2h lifetime, ≤6
    const today = Math.min(8, Math.floor(todayMinutes / 12)); // 1 per 12m today, ≤8
    return Math.min(14, 3 + base + today);
  }, [lifetimeMinutes, todayMinutes]);

  const flowers = useMemo(() => {
    const rnd = mulberry32(1337);
    const palette = ["#f4b8c4", "#fbe09a", "#e9b6e2", "#bfe0c2", "#f6c69a"];
    return Array.from({ length: flowerCount }, (_, i) => ({
      left: 6 + rnd() * 88, // %
      bottom: 1 + rnd() * 9, // %
      scale: 0.7 + rnd() * 0.7,
      color: palette[Math.floor(rnd() * palette.length)],
      delay: (rnd() * 4).toFixed(2)
    }));
  }, [flowerCount]);

  return (
    <div
      aria-hidden
      data-tod={tod}
      className="amb-scene pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Bespoke time-of-day sky. */}
      <div className="amb-sky" />

      {/* Night extras: a moon + a few stars, only shown at night via CSS. */}
      <div className="amb-celestial">
        <span className="amb-moon" />
        <span className="amb-stars" />
      </div>

      {/* Drifting light blooms. */}
      <div className="amb-bloom amb-bloom-a" />
      <div className="amb-bloom amb-bloom-b" />

      {/* Faint pollen motes. */}
      <div className="amb-motes" />

      {/* Meadow — parallax hill bands + swaying grass + framing trees. */}
      <div className="amb-meadow">
        <svg className="amb-hills" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden>
          <path className="amb-hill-back" d="M0,170 C240,120 480,150 720,140 C960,130 1200,160 1440,135 L1440,320 L0,320 Z" />
          <path className="amb-hill-mid" d="M0,215 C300,175 520,205 760,195 C1020,184 1240,210 1440,190 L1440,320 L0,320 Z" />
          <path className="amb-hill-front" d="M0,260 C260,235 540,258 800,250 C1080,241 1280,262 1440,250 L1440,320 L0,320 Z" />
        </svg>

        {/* Trees framing the wide empty edges. */}
        <span className="amb-tree amb-tree-l" />
        <span className="amb-tree amb-tree-r" />

        {/* Swaying grass tufts along the very bottom. */}
        <div className="amb-grass" />

        {/* Generative flowers — grow with focus minutes. */}
        {flowers.map((f, i) => (
          <span
            key={i}
            className="amb-flower"
            style={{
              left: `${f.left}%`,
              bottom: `${f.bottom}%`,
              ["--fs" as string]: f.scale,
              ["--fd" as string]: `${f.delay}s`,
              ["--fc" as string]: f.color
            }}
          />
        ))}
      </div>

      {/* Film grain (paper texture). */}
      <div className="amb-grain" />

      {/* Centre-weighted vignette. */}
      <div className="amb-vignette" />
    </div>
  );
}
