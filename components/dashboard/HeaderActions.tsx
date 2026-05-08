"use client";

import { DoorOpen, BarChart3, Settings as SettingsIcon } from "lucide-react";

// Custom events used to communicate between this header-rendered component
// (server-tree) and the client-side DashboardActions modal state.
export const HEADER_OPEN_ROOMS    = "studypuff:open-rooms";
export const HEADER_OPEN_STATS    = "studypuff:open-stats";
export const HEADER_OPEN_SETTINGS = "studypuff:open-settings";

function dispatch(event: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(event));
}

/**
 * The Rooms / Stats / Settings entry points, rendered in the page header.
 * Lives outside DashboardActions so the dashboard can keep its 3-column
 * layout free of nav noise.
 */
export function HeaderActions() {
  return (
    <div className="flex items-center gap-1 rounded-full bg-cream-50/55 p-1 ring-1 ring-ink-900/10 backdrop-blur-sm">
      <Pill icon={<DoorOpen className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />} label="Rooms"    onClick={() => dispatch(HEADER_OPEN_ROOMS)} />
      <Pill icon={<BarChart3 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />} label="Stats"    onClick={() => dispatch(HEADER_OPEN_STATS)} />
      <Pill icon={<SettingsIcon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />} label="Settings" onClick={() => dispatch(HEADER_OPEN_SETTINGS)} />
    </div>
  );
}

function Pill({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-display italic text-ink-900/75 transition hover:bg-cream-50/75 hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      aria-label={label}
      title={label}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
