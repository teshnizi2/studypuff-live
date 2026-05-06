"use client";

import { useEffect, useRef, useState } from "react";

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
    if (s < 0)  { s = 59; m = Math.max(0, m - 1); }
    if (s > 59) { s = 0;  m = Math.min(MAX_MINUTES, m + 1); }
    set(m, s);
  };

  const onWheel = (handler: (delta: number) => void) => (e: React.WheelEvent) => {
    if (disabled) return;
    e.preventDefault();
    const now = Date.now();
    if (now - wheelLockRef.current < 90) return;
    wheelLockRef.current = now;
    handler(e.deltaY > 0 ? -1 : 1);
  };

  const prevM = (minutes - 1 + (MAX_MINUTES + 1)) % (MAX_MINUTES + 1);
  const nextM = (minutes + 1) % (MAX_MINUTES + 1);
  const prevS = (seconds - 1 + 60) % 60;
  const nextS = (seconds + 1) % 60;

  const commitMinutes = (raw: string) => {
    const n = parseInt(raw, 10);
    if (Number.isNaN(n)) return;
    set(n, seconds);
  };

  const commitSeconds = (raw: string) => {
    const n = parseInt(raw, 10);
    if (Number.isNaN(n)) return;
    set(minutes, n);
  };

  return (
    <div
      className="flex select-none items-center justify-center gap-1"
      aria-label="Set timer duration"
    >
      <Column
        prev={prevM} current={minutes} next={nextM}
        onPrev={() => stepMinute(-1)} onNext={() => stepMinute(1)}
        onWheel={onWheel(stepMinute)} disabled={disabled}
        ariaLabel="minutes"
        max={MAX_MINUTES}
        onCommit={commitMinutes}
      />
      <span className="-mt-2 font-display text-[clamp(4rem,9vw,7rem)] font-light italic leading-none text-ink-900/30">:</span>
      <Column
        prev={prevS} current={seconds} next={nextS}
        onPrev={() => stepSecond(-1)} onNext={() => stepSecond(1)}
        onWheel={onWheel(stepSecond)} disabled={disabled}
        ariaLabel="seconds"
        max={59}
        onCommit={commitSeconds}
      />
    </div>
  );
}

function Column({
  prev, current, next,
  onPrev, onNext, onWheel, disabled, ariaLabel,
  max, onCommit
}: {
  prev: number; current: number; next: number;
  onPrev: () => void; onNext: () => void;
  onWheel: (e: React.WheelEvent) => void;
  disabled?: boolean; ariaLabel: string;
  max: number;
  onCommit: (raw: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const startEdit = () => {
    if (disabled) return;
    setDraft(String(current));
    setEditing(true);
  };

  const finish = (commit: boolean) => {
    if (commit && draft.trim() !== "") {
      onCommit(draft.trim());
    }
    setEditing(false);
  };

  return (
    <div
      className="relative flex flex-col items-center"
      onWheel={onWheel}
      role="spinbutton"
      aria-label={ariaLabel}
      aria-valuenow={current}
    >
      <button
        type="button" onClick={onPrev} disabled={disabled || editing}
        aria-label={`previous ${ariaLabel}`}
        className="font-display text-3xl italic tabular-nums text-ink-900/25 transition hover:text-ink-900/55 disabled:opacity-30 disabled:hover:text-ink-900/25 sm:text-4xl"
      >
        {String(prev).padStart(2, "0")}
      </button>

      {editing ? (
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={draft}
          onChange={(e) => {
            const v = e.target.value.replace(/[^0-9]/g, "").slice(0, String(max).length);
            setDraft(v);
          }}
          onBlur={() => finish(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              finish(true);
            } else if (e.key === "Escape") {
              e.preventDefault();
              finish(false);
            }
          }}
          aria-label={`edit ${ariaLabel}`}
          className="w-[1.6em] bg-transparent text-center font-display text-[clamp(4rem,9vw,7rem)] italic leading-[1] tabular-nums text-ink-900 outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={startEdit}
          disabled={disabled}
          aria-label={`edit ${ariaLabel}, currently ${current}`}
          title="Click to type"
          className="font-display text-[clamp(4rem,9vw,7rem)] italic leading-[1] tabular-nums text-ink-900 transition hover:text-ink-900/80 disabled:cursor-not-allowed disabled:opacity-100 disabled:hover:text-ink-900"
        >
          {String(current).padStart(2, "0")}
        </button>
      )}

      <button
        type="button" onClick={onNext} disabled={disabled || editing}
        aria-label={`next ${ariaLabel}`}
        className="font-display text-3xl italic tabular-nums text-ink-900/25 transition hover:text-ink-900/55 disabled:opacity-30 disabled:hover:text-ink-900/25 sm:text-4xl"
      >
        {String(next).padStart(2, "0")}
      </button>
    </div>
  );
}
