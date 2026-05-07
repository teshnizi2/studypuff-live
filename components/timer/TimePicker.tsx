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
        current={minutes}
        onWheel={onWheel(stepMinute)}
        disabled={disabled}
        ariaLabel="minutes"
        max={MAX_MINUTES}
        onCommit={commitMinutes}
      />
      <span className="font-display text-[clamp(2.5rem,5vw,4rem)] font-light italic leading-none text-ink-900/30">:</span>
      <Column
        current={seconds}
        onWheel={onWheel(stepSecond)}
        disabled={disabled}
        ariaLabel="seconds"
        max={59}
        onCommit={commitSeconds}
      />
    </div>
  );
}

function Column({
  current, onWheel, disabled, ariaLabel,
  max, onCommit
}: {
  current: number;
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

  const numCls =
    "font-display text-[clamp(3rem,6.5vw,5rem)] italic leading-[1] tabular-nums text-ink-900";

  return (
    <div
      className="relative flex items-center justify-center"
      onWheel={onWheel}
      role="spinbutton"
      aria-label={ariaLabel}
      aria-valuenow={current}
    >
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
          className={`${numCls} w-[1.6em] rounded-lg bg-ink-900/[0.06] px-1 text-center outline-none ring-2 ring-emerald-700/40`}
        />
      ) : (
        <button
          type="button"
          onClick={startEdit}
          disabled={disabled}
          aria-label={`edit ${ariaLabel}, currently ${current}`}
          title="Click to type, scroll to adjust"
          className={`${numCls} rounded-lg px-1 transition hover:bg-ink-900/[0.04] disabled:cursor-not-allowed disabled:hover:bg-transparent`}
        >
          {String(current).padStart(2, "0")}
        </button>
      )}
    </div>
  );
}
