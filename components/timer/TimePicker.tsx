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

  // Render a single <input> for both display and edit. We toggle readOnly
  // instead of swapping element types — that way the box dimensions are
  // identical between states and clicking the digit can't reflow the page.
  const value = editing ? draft : String(current).padStart(2, "0");

  return (
    <div
      className="relative inline-block"
      onWheel={onWheel}
      role="spinbutton"
      aria-label={ariaLabel}
      aria-valuenow={current}
    >
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        readOnly={!editing || disabled}
        disabled={disabled}
        onClick={() => { if (!editing) startEdit(); }}
        onChange={(e) => {
          const v = e.target.value.replace(/[^0-9]/g, "").slice(0, String(max).length);
          setDraft(v);
        }}
        onBlur={() => { if (editing) finish(true); }}
        onKeyDown={(e) => {
          if (!editing) return;
          if (e.key === "Enter") {
            e.preventDefault();
            finish(true);
            (e.target as HTMLInputElement).blur();
          } else if (e.key === "Escape") {
            e.preventDefault();
            finish(false);
            (e.target as HTMLInputElement).blur();
          }
        }}
        aria-label={editing ? `edit ${ariaLabel}` : `edit ${ariaLabel}, currently ${current}`}
        title="Click to type, scroll to adjust"
        className={`m-0 box-border w-[1.7em] cursor-pointer rounded-lg border-2 border-transparent bg-transparent p-0 text-center font-display text-[clamp(3rem,6.5vw,5rem)] italic leading-[1] tabular-nums text-ink-900 outline-none appearance-none transition ${
          editing
            ? "cursor-text border-b-emerald-700/55"
            : "hover:bg-ink-900/[0.04]"
        } disabled:cursor-not-allowed disabled:hover:bg-transparent`}
      />
    </div>
  );
}
