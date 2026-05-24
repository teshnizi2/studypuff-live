"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ListChecks, Sprout, BarChart3, DoorOpen, Settings as SettingsIcon } from "lucide-react";

/**
 * The dashboard's slim left navigation rail — rendered by the dashboard
 * layout so it appears on every sub-route (home, garden, …) instead of
 * stranding the user when they leave /dashboard.
 *
 * Two kinds of entries:
 *   - Page links: Tasks (/dashboard), Garden (/dashboard/garden).
 *   - Panel openers (Rooms / Stats / Settings): Links to /dashboard?panel=KEY.
 *     The home page (DashboardActions) reads `panel` and opens the matching
 *     modal. From a sub-page, this navigates home and pops the modal.
 *
 * Visual is identical to the original FocusRail; only the wiring changed.
 */
export function DashboardRailNav() {
  const pathname = usePathname();
  const params = useSearchParams();
  const isHome = pathname === "/dashboard";
  const isGarden = pathname === "/dashboard/garden";
  const activePanel = isHome ? params.get("panel") : null;

  type Item = { key: string; label: string; icon: React.ReactNode; href: string; active: boolean };
  const items: Item[] = [
    {
      key: "tasks",
      label: "Tasks",
      icon: <ListChecks className="h-5 w-5" strokeWidth={1.75} aria-hidden />,
      href: "/dashboard",
      active: isHome && !activePanel
    },
    {
      key: "garden",
      label: "Garden",
      icon: <Sprout className="h-5 w-5" strokeWidth={1.75} aria-hidden />,
      href: "/dashboard/garden",
      active: isGarden
    },
    {
      key: "rooms",
      label: "Rooms",
      icon: <DoorOpen className="h-5 w-5" strokeWidth={1.75} aria-hidden />,
      href: "/dashboard?panel=rooms",
      active: activePanel === "rooms"
    },
    {
      key: "stats",
      label: "Stats",
      icon: <BarChart3 className="h-5 w-5" strokeWidth={1.75} aria-hidden />,
      href: "/dashboard?panel=stats",
      active: activePanel === "stats"
    },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingsIcon className="h-5 w-5" strokeWidth={1.75} aria-hidden />,
      href: "/dashboard?panel=settings",
      active: activePanel === "settings"
    }
  ];

  return (
    <nav
      aria-label="Dashboard navigation"
      className="glass-panel journal-rise jrise-1 fixed left-3 top-[108px] z-30 hidden h-[calc(100vh-128px)] w-[72px] flex-col items-center gap-1.5 rounded-[26px] py-4 lg:flex"
    >
      {items.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          aria-current={item.active ? "page" : undefined}
          title={item.label}
          className={`group relative flex h-[52px] w-[52px] flex-col items-center justify-center gap-0.5 rounded-2xl transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/50 focus-visible:ring-offset-1 focus-visible:ring-offset-cream-50 ${
            item.active
              ? "bg-ink-900 text-cream-50 shadow-[0_10px_24px_-10px_rgba(31,77,44,0.6)]"
              : "text-ink-700 hover:-translate-y-0.5 hover:bg-white/70 hover:text-ink-900 active:translate-y-0 active:scale-95"
          }`}
        >
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
        </Link>
      ))}
    </nav>
  );
}
