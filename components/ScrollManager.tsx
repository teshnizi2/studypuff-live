"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Make every top-level navigation land at the top of the new page, cleanly.
 *
 * Two things were producing the "header tab jumps somewhere and comes back"
 * symptom on the marketing site:
 *
 *   1. `history.scrollRestoration` defaults to "auto" — the browser saves
 *      and restores the per-history-entry scroll position, which can fight
 *      Next.js App Router's own scroll handling on Link clicks.
 *   2. `html { scroll-behavior: smooth }` (now removed) made the navigation
 *      scroll-to-top a visible animation — the new page rendered at the old
 *      scroll Y for a beat before smoothly sliding up.
 *
 * Mount this once in the root layout. It runs on the client only.
 */
export function ScrollManager() {
  const pathname = usePathname();

  // Set scrollRestoration to manual ONCE on mount. From then on the browser
  // never restores scroll on history navigation — App Router (and us) do it.
  useEffect(() => {
    if ("scrollRestoration" in history) {
      try {
        history.scrollRestoration = "manual";
      } catch {
        /* ignore — Safari occasionally throws here */
      }
    }
  }, []);

  // On every pathname change, jump (not smooth) to the top of the new page.
  useEffect(() => {
    // `behavior: "instant"` defeats any element-level smooth-scroll CSS.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
