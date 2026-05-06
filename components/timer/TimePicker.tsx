"use client";

import { useRef } from "react";

type Props = {
  minutes: number;
  seconds: number;
  disabled?: boolean;
  onChange: (totalSeconds: number) => void;
};

const MAX_MINUTES = 240;

export function TimePicker({ minutes, seconds, disabled, onChange }: Props) {
  const wheelLockRef = useRef<number>(0);

  const set = (m: number, s: number) => {
    const safeM = Math.max(0, Math.min(MAX_MINUTES, m));
    const safeS = Math.max(0, Math.min(59, s));
    const total = safeM * 60 + safeS;
    onChange(total > 0 ? total : 60);
  };

  const stepMinute = (delta: number) => {
    if (disabled) return;
    let m = minutes + delta;
    if (m < 0) m = MAX_MINUTES;
    if (m > MAX_MINUTES) m = 0;
    set(m, seconds);
  };

  const stepSecond = (delta: number) => {
    if (disabled) return;
    let s = seconds + delta;
    let m = minutes;
    if (s < 0) {
      s = 59;
      m = Math.max(0, m - 1);
    }
    if (s > 59) {
      s = 0;
      m = Math.min(MAX_MINUTES, m + 1);
    }
    set(m, s);
  };

  const onWheel = (handler: (delta: number) => void) => (e: React.WheelEvent) => {
    if (disabled) return;
    e.preventDefault();
    const now = Date.now();
    if (now - wheelLockRef.current < 80) return;
    wheelLockRef.current = now;
    handler(e.deltaY > 0 ? -1 : 1);
  };

  const prevMinute = (minutes - 1 + (MAX_MINUTES + 1)) % (MAX_MINUTES + 1);
  const nextMinute = (minutes + 1) % (MAX_MINUTES + 1);
  const prevSecond = (seconds - 1 + 60) % 60;
  const nextSecond = (seconds + 1) % 60;

  return (
    <div
      className={`flex select-none items-center justify-center gap-2 ${
        disabled ? "opacity-90" : ""
      }`}
      aria-label="Set timer duration"
    >
      <Column
        prev={prevMinute}
        current={minutes}
        next={nextMinute}
        onPrev={() => stepMinute(-1)}
        onNext={() => stepMinute(1)}
        onWheel={onWheel(stepMinute)}
        disabled={disabled}
        ariaLabel="minutes"
      />
      <span className="font-display text-6xl text-ink-900/60 sm:text-7xl">:</span>
      <Column
        prev={prevSecond}
        current={seconds}
        next={nextSecond}
        onPrev={() => stepSecond(-1)}
        onNext={() => stepSecond(1)}
        onWheel={onWheel(stepSecond)}
        disabled={disabled}
        ariaLabel="seconds"
      />
    </div>
  );
}

function Column({
  prev,
  current,
  next,
  onPrev,
  onNext,
  onWheel,
  disabled,
  ariaLabel
}: {
  prev: number;
  current: number;
  next: number;
  onPrev: () => void;
  onNext: () => void;
  onWheel: (e: React.WheelEvent) => void;
  disabled?: boolean;
  ariaLabel: string;
}) {
  return (
    <div
      className="relative flex flex-col items-center"
      onWheel={onWheel}
      role="spinbutton"
      aria-label={ariaLabel}
      aria-valuenow={current}
    >
      {/* Prev (shadow above) */}
      <button
        type="button"
        onClick={onPrev}
        disabled={disabled}
        aria-label={`previous ${ariaLabel}`}
        className="group relative flex h-9 w-24 items-center justify-center font-display text-3xl tabular-nums text-ink-900/30 transition hover:text-ink-900/60 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-ink-900/30 sm:text-4xl"
      >
        <span className="pointer-events-none absolute -top-1 left-1/2 h-px w-12 -translate-x-1/2 bg-ink-900/0 transition group-hover:bg-ink-900/15" />
        {String(prev).padStart(2, "0")}
      </button>

      {/* Current — big, bold */}
      <div
        className={`relative flex h-24 w-24 items-center justify-center font-display text-6xl tabular-nums text-ink-900 sm:h-28 sm:w-28 sm:text-7xl ${
          !disabled ? "rounded-3xl bg-cream-50/55 shadow-[inset_0_2px_0_rgba(255,255,255,0.5),0_4px_12px_-4px_rgba(0,0,0,0.1)] ring-1 ring-ink-900/5" : ""
        }`}
      >
        {String(current).padStart(2, "0")}
      </div>

      {/* Next (shadow below) */}
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        aria-label={`next ${ariaLabel}`}
        className="group relative flex h-9 w-24 items-center justify-center font-display text-3xl tabular-nums text-ink-900/30 transition hover:text-ink-900/60 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-ink-900/30 sm:text-4xl"
      >
        <span className="pointer-events-none absolute -bottom-1 left-1/2 h-px w-12 -translate-x-1/2 bg-ink-900/0 transition group-hover:bg-ink-900/15" />
        {String(next).padStart(2, "0")}
      </button>
    </div>
  );
}
