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
};

// Slim vertical icon rail pinned to the left edge of the dashboard.
// The single access point for Tasks / Garden / Stats / Rooms / Rewards /
// Settings — so the timer can own a calm, near-empty space. lg+ only;
// on small screens the dashboard falls back to its stacked layout.
export function FocusRail({ items }: { items: RailItem[] }) {
  return (
    <nav
      aria-label="Dashboard panels"
      className="fixed left-0 top-[100px] z-30 hidden h-[calc(100vh-100px)] w-[68px] flex-col items-center gap-1 border-r border-ink-900/10 bg-cream-50/55 py-4 backdrop-blur-md lg:flex"
    >
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={item.onClick}
          aria-pressed={item.active}
          title={item.label}
          className={`group relative flex h-12 w-12 flex-col items-center justify-center gap-0.5 rounded-2xl transition ${
            item.active
              ? "bg-ink-900 text-cream-50 shadow-soft"
              : "text-ink-700 hover:bg-cream-50 hover:text-ink-900"
          }`}
        >
          <span className="flex h-5 w-5 items-center justify-center">{item.icon}</span>
          <span className="text-[8px] font-semibold uppercase tracking-[0.08em]">{item.label}</span>
          {item.badge && (
            <span
              aria-hidden
              className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-cream-50"
            />
          )}
        </button>
      ))}
    </nav>
  );
}
