"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AuthNav } from "./auth/AuthNav";

const NAV = [
  { label: "Study with us", href: "/study" },
  { label: "App", href: "/dashboard" },
  { label: "Workshops", href: "/workshops" },
  { label: "Free Resources", href: "/resources" },
  { label: "StudyPuff Store", href: "/store" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [localeOpen, setLocaleOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ink-900/5 bg-[rgba(239,236,236,0.85)] backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-4 lg:px-10">
        {/* Left: locale (desktop) */}
        <div className="hidden flex-1 items-center gap-4 lg:flex">
          <div className="relative">
            <button
              onClick={() => setLocaleOpen((o) => !o)}
              className="nav-link text-sm tracking-wide text-ink-900"
              aria-haspopup="listbox"
              aria-expanded={localeOpen}
            >
              Netherlands | EUR €
              <span
                className="ml-2 inline-block transition-transform"
                style={{ transform: localeOpen ? "rotate(180deg)" : undefined }}
              >
                ▾
              </span>
            </button>
            {localeOpen && (
              <ul className="absolute left-0 top-9 w-56 rounded-xl border border-black/5 bg-cream-50 p-2 text-sm shadow-soft">
                {[
                  "Netherlands | EUR €",
                  "United States | USD $",
                  "United Kingdom | GBP £",
                  "Germany | EUR €",
                  "France | EUR €",
                  "Canada | CAD $",
                  "Australia | AUD $"
                ].map((l) => (
                  <li key={l}>
                    <button
                      onClick={() => setLocaleOpen(false)}
                      className="block w-full rounded-lg px-3 py-2 text-left hover:bg-cream-100"
                    >
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Center: brand logo */}
        <Link
          href="/"
          className="inline-flex items-center"
        >
          <img
            src="/studypuff-logo-v3.png"
            alt="StudyPuff Academy"
            className="h-24 w-auto object-contain lg:h-28"
          />
        </Link>

        {/* Right: account + icons */}
        <div className="hidden flex-1 items-center justify-end gap-4 text-ink-900 lg:flex">
          <button aria-label="Search" className="nav-link text-sm">
            Search
          </button>
          <div className="flex items-center gap-3">
            <AuthNav />
          </div>
          <Link href="/store" className="nav-link text-sm">
            Cart · 0
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden"
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >
          <svg viewBox="0 0 18 16" width="22" height="22" fill="currentColor">
            {open ? (
              <path d="M.865 15.978a.5.5 0 0 0 .707.707l7.433-7.431 7.579 7.282a.501.501 0 0 0 .846-.37.5.5 0 0 0-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 1 0-.707-.708L8.991 7.853 1.413.573a.5.5 0 1 0-.693.72l7.563 7.268z" />
            ) : (
              <path d="M1 .5a.5.5 0 1 0 0 1h15.71a.5.5 0 0 0 0-1zM.5 8a.5.5 0 0 1 .5-.5h15.71a.5.5 0 0 1 0 1H1A.5.5 0 0 1 .5 8m0 7a.5.5 0 0 1 .5-.5h15.71a.5.5 0 0 1 0 1H1a.5.5 0 0 1-.5-.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Inline nav (desktop) */}
      <nav className="mx-auto hidden max-w-[1400px] justify-center gap-8 border-t border-black/5 py-3 text-sm tracking-wide lg:flex">
        {NAV.map((n) => {
          const active = pathname === n.href;
          return (
            <Link
              key={n.label}
              href={n.href}
              className={`nav-link ${active ? "text-ink-900 font-semibold" : "text-ink-900"}`}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-black/5 bg-cream-100 px-6 pb-10 pt-4 lg:hidden">
          <ul className="space-y-4 text-lg">
            {NAV.map((n) => (
              <li key={n.label}>
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-ink-900"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 text-sm">
            <Link
              href="/register"
              className="btn-primary inline-flex w-fit items-center px-4 py-2 font-semibold"
              onClick={() => setOpen(false)}
            >
              Create account
            </Link>
            <div className="flex flex-wrap gap-4">
            <Link href="/login" className="underline" onClick={() => setOpen(false)}>
              Log in
            </Link>
            <Link href="/dashboard" className="underline" onClick={() => setOpen(false)}>
              Dashboard
            </Link>
            <Link href="/store" className="underline" onClick={() => setOpen(false)}>
              Cart · 0
            </Link>
            <button type="button" className="underline">Netherlands | EUR €</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
