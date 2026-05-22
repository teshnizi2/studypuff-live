"use client";

import type { ReactNode } from "react";

export type RailItem = {
  key: string;
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
  /** Small dot badge (e.g. an active room). */
  badge?: boolean;
  /** True when this item opens a modal dialog (uses haspopup/expanded
      semantics) rather than toggling an in-place panel (uses pressed). */
  haspopup?: boolean;
};

// Slim vertical icon rail pinned to the left edge of the dashboard.
// The single access point for Tasks / Garden / Stats / Rooms / Rewards /
// Settings — so the timer can own a calm, near-empty space. lg+ only;
// on small screens the dashboard falls back to its stacked layout.
export function FocusRail({ items }: { items: RailItem[] }) {
  return (
    <nav
      aria-label="Dashboard panels"
      className="glass-panel fixed left-3 top-[92px] z-30 hidden h-[calc(100vh-116px)] w-[72px] flex-col items-center gap-1.5 rounded-[26px] py-4 lg:flex"
    >
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={item.onClick}
          {...(item.haspopup
            ? { "aria-haspopup": "dialog" as const, "aria-expanded": item.active }
            : { "aria-pressed": item.active })}
          title={item.label}
          className={`group relative flex h-[52px] w-[52px] flex-col items-center justify-center gap-0.5 rounded-2xl transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/50 focus-visible:ring-offset-1 focus-visible:ring-offset-cream-50 ${
            item.active
              ? "bg-ink-900 text-cream-50 shadow-[0_10px_24px_-10px_rgba(31,77,44,0.6)]"
              : "text-ink-700 hover:-translate-y-0.5 hover:bg-white/70 hover:text-ink-900 active:translate-y-0 active:scale-95"
          }`}
        >
          {/* Active edge indicator — a small pill on the rail's left edge. */}
          <span
            aria-hidden
            className={`absolute -left-[10px] top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-emerald-700 transition-all duration-200 ${
              item.active ? "opacity-100" : "opacity-0 scale-y-50"
            }`}
          />
          <span className="flex h-5 w-5 items-center justify-center transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
            {item.icon}
          </span>
          <span className="text-[8px] font-semibold uppercase tracking-[0.1em]">{item.label}</span>
          {item.badge && (
            <span
              aria-hidden
              className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_2px_rgba(253,251,247,0.9),0_0_8px_rgba(16,185,129,0.6)]"
            />
          )}
        </button>
      ))}
    </nav>
  );
}
