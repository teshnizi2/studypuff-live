"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
};

const SIZE: Record<NonNullable<Props["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl"
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  size = "md"
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    // Remember what had focus so we can restore it on close.
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Move focus into the dialog (the panel itself, which is tabbable).
    const panel = panelRef.current;
    const focusFirst = () => {
      const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panel)?.focus();
    };
    // Defer a frame so the element is laid out before focusing.
    const raf = requestAnimationFrame(focusFirst);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      // Focus trap — keep Tab cycling inside the panel.
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null
      );
      if (items.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === firstEl || active === panel)) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && active === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      // Return focus to the trigger.
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close dialog"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-ink-900/50 animate-[fadeIn_200ms_ease-out]"
      />

      {/* Panel — frosted, part of the dashboard's glass system. */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`relative m-0 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] border border-white/60 bg-cream-50 shadow-[0_40px_90px_-30px_rgba(31,77,44,0.55)] outline-none sm:m-4 sm:rounded-[28px] ${SIZE[size]} animate-[panelIn_240ms_cubic-bezier(0.34,1.5,0.64,1)]`}
      >
        {/* Hairline top sheen. */}
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

        <header className="flex items-start justify-between gap-4 border-b border-ink-900/10 px-6 py-5">
          <div className="min-w-0">
            <h2 className="font-display text-[18px] text-ink-900">{title}</h2>
            {description && <p className="mt-1 text-sm text-ink-700">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-700 transition hover:rotate-90 hover:bg-ink-900/5 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/50"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(22px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );
}
