"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AuthNav } from "./auth/AuthNav";

const NAV = [
  { label: "Study with us", href: "/study" },
  { label: "StudyPuff App", href: "/dashboard" },
  { label: "Workshops", href: "/workshops" },
  { label: "Free Resources", href: "/resources" },
  { label: "Store", href: "/store" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ink-900/5 bg-[rgba(239,236,236,0.92)] backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-6 py-3 lg:px-10">
        {/* Brand (left) */}
        <Link href="/" className="inline-flex shrink-0 items-center" aria-label="StudyPuff Academy">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/studypuff-logo-v3.png"
            alt="StudyPuff Academy"
            className="h-14 w-auto object-contain lg:h-16"
          />
        </Link>

        {/* Inline nav (desktop) */}
        <nav className="hidden flex-1 justify-center gap-7 text-sm lg:flex">
          {NAV.map((n) => {
            const active =
              n.href === "/" ? pathname === "/" : pathname === n.href || pathname.startsWith(n.href + "/");
            return (
              <Link
                key={n.label}
                href={n.href}
                className={`nav-link transition ${
                  active ? "font-semibold text-ink-900" : "text-ink-900/80 hover:text-ink-900"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth (desktop) */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <AuthNav />
        </div>

        {/* Mobile hamburger */}
        <button
          className="ml-auto lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg viewBox="0 0 18 16" width="26" height="26" fill="currentColor">
            {open ? (
              <path d="M.865 15.978a.5.5 0 0 0 .707.707l7.433-7.431 7.579 7.282a.501.501 0 0 0 .846-.37.5.5 0 0 0-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 1 0-.707-.708L8.991 7.853 1.413.573a.5.5 0 1 0-.693.72l7.563 7.268z" />
            ) : (
              <path d="M1 .5a.5.5 0 1 0 0 1h15.71a.5.5 0 0 0 0-1zM.5 8a.5.5 0 0 1 .5-.5h15.71a.5.5 0 0 1 0 1H1A.5.5 0 0 1 .5 8m0 7a.5.5 0 0 1 .5-.5h15.71a.5.5 0 0 1 0 1H1a.5.5 0 0 1-.5-.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-black/5 bg-cream-100 px-6 pb-8 pt-4 lg:hidden">
          {/* Auth at top — most important on mobile */}
          <div className="mb-4 flex flex-col gap-2">
            <AuthNav onNavigate={() => setOpen(false)} variant="mobile" />
          </div>
          <ul className="divide-y divide-ink-900/10 border-y border-ink-900/10">
            {NAV.map((n) => {
              const active = pathname === n.href || pathname.startsWith(n.href + "/");
              return (
                <li key={n.label}>
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={`block py-3 text-base ${
                      active ? "font-semibold text-ink-900" : "text-ink-900/80"
                    }`}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
