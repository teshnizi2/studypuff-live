"use client";

import { useEffect } from "react";
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

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  size = "md"
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
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
        onClick={onClose}
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm animate-[fadeIn_180ms_ease-out]"
      />

      {/* Panel */}
      <div
        className={`relative m-0 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] bg-cream-50 shadow-2xl ring-1 ring-ink-900/10 sm:m-4 sm:rounded-3xl ${SIZE[size]} animate-[panelIn_220ms_cubic-bezier(0.34,1.56,0.64,1)]`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-ink-900/10 px-6 py-5">
          <div className="min-w-0">
            <h2 className="font-display text-2xl text-ink-900">{title}</h2>
            {description && <p className="mt-1 text-sm text-ink-700">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-700 transition hover:bg-ink-900/5 hover:text-ink-900"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>

      {/* Animations live in globals.css for now via inline styles fallback */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );
}
