"use client";

import { useEffect, useState } from "react";

function greetFor(hour: number): string {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 22) return "Good evening";
  return "Still up";
}

/**
 * A quiet, time-aware greeting for the dashboard header. Renders a neutral
 * placeholder on the server (so SSR matches first paint) and fills in the
 * real local-time greeting on mount.
 */
export function Greeting({ name }: { name: string | null }) {
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    setGreeting(greetFor(new Date().getHours()));
  }, []);

  const first = (name || "").trim().split(/\s+/)[0] || null;

  return (
    <p
      className="max-w-[42ch] select-none truncate text-center font-display text-base italic text-ink-900/85 transition-opacity duration-700"
      style={{ opacity: greeting ? 1 : 0 }}
    >
      {greeting}
      {first ? <>, {first}</> : null}
    </p>
  );
}
