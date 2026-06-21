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
  const [hidden, setHidden] = useState(false);

  // Drive the palette via <html data-tod>. A pre-paint inline script in the
  // dashboard layout sets it first (no flash); here we re-affirm on mount and
  // roll it over when a session crosses dawn/day/dusk/night.
  useEffect(() => {
    const apply = () => {
      const t = todProp ?? timeOfDayFor(new Date().getHours());
      document.documentElement.dataset.tod = t;
    };
    apply();
    if (todProp) return;
    const id = window.setInterval(apply, 5 * 60 * 1000);
    return () => window.clearInterval(id);
  }, [todProp]);

  // Pause scene animations when the tab is backgrounded (battery / calm).
  useEffect(() => {
    const onVis = () => setHidden(document.visibilityState === "hidden");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

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
      data-hidden={hidden || undefined}
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

      {/* Meadow — a bespoke flat-illustration garden (fades into the sky at
          the top via a CSS mask so the time-of-day gradient shows above it). */}
      <div className="amb-meadow">
        <div className="amb-meadow-img" />

        {/* Generative flowers — the user's earned garden, growing with focus
            minutes, layered over the illustrated meadow base. */}
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

      {/* Soft light clearing behind the content (depth + readability). */}
      <div className="amb-clearing" />

      {/* Film grain (paper texture). */}
      <div className="amb-grain" />

      {/* Centre-weighted vignette. */}
      <div className="amb-vignette" />
    </div>
  );
}
