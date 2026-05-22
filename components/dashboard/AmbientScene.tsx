"use client";

import { useEffect, useState } from "react";

export type TimeOfDay = "dawn" | "day" | "dusk" | "night";

export function timeOfDayFor(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 9) return "dawn";
  if (hour >= 9 && hour < 17) return "day";
  if (hour >= 17 && hour < 21) return "dusk";
  return "night";
}

/**
 * AmbientScene — the living backdrop of the dashboard.
 *
 * A full-viewport, fixed, pointer-events-none layer that sits BEHIND all
 * dashboard content. It paints a soft pastoral mesh-gradient "sky + meadow"
 * whose palette shifts with the viewer's local time of day (dawn / day /
 * dusk / night), plus two slow-drifting light blooms, a film-grain texture,
 * and a centre-weighted vignette that focuses the eye on the timer.
 *
 * Everything animates with transform/opacity only and is fully disabled
 * under prefers-reduced-motion (see globals.css `.amb-*` rules). The scene
 * is decorative: aria-hidden, never focusable, never trapping.
 *
 * Time of day defaults to "day" for the server render (so SSR and the first
 * client paint agree — no hydration mismatch) and is corrected to the real
 * local value on mount.
 */
export function AmbientScene({ tod: todProp }: { tod?: TimeOfDay }) {
  const [tod, setTod] = useState<TimeOfDay>(todProp ?? "day");

  useEffect(() => {
    if (todProp) return; // explicit override wins (e.g. previews)
    const apply = () => setTod(timeOfDayFor(new Date().getHours()));
    apply();
    // Re-evaluate on a slow cadence so a session that crosses dusk updates.
    const id = window.setInterval(apply, 5 * 60 * 1000);
    return () => window.clearInterval(id);
  }, [todProp]);

  return (
    <div
      aria-hidden
      data-tod={tod}
      className="amb-scene pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Sky + meadow mesh — a layer slightly larger than the viewport that
          drifts very slowly so the gradient is never static but its edges
          never enter frame. */}
      <div className="amb-sky" />

      {/* Two soft light blooms drifting on long, offset loops. */}
      <div className="amb-bloom amb-bloom-a" />
      <div className="amb-bloom amb-bloom-b" />

      {/* Drifting motes — a few faint specks that float upward like pollen. */}
      <div className="amb-motes" />

      {/* Film grain for paper texture (kills banding on the gradient). */}
      <div className="amb-grain" />

      {/* Centre-weighted vignette: gently darkens the edges to seat the timer. */}
      <div className="amb-vignette" />
    </div>
  );
}
