"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  advanceRoomTimerAction,
  pauseRoomTimerAction,
  resetRoomTimerAction,
  setRoomTimerModeAction,
  startRoomTimerAction
} from "@/lib/app-data/rooms";

type TimerMode = "idle" | "focus" | "short" | "long";

export type RoomTimerProps = {
  roomId: string;
  isOwner: boolean;
  ownerLabel: string;
  initial: {
    timer_mode: TimerMode;
    timer_started_at: string | null;
    timer_paused_at: string | null;
    timer_pause_offset_seconds: number;
    timer_round: number;
    focus_minutes: number;
    short_break_minutes: number;
    long_break_minutes: number;
  };
};

const MODE_LABEL: Record<TimerMode, string> = {
  idle: "Idle",
  focus: "Focus",
  short: "Short break",
  long: "Long break"
};

// Computed display state. Lives outside the component so the test for "did
// we just cross zero" stays straightforward.
function deriveDisplay(
  state: RoomTimerProps["initial"],
  nowMs: number
): {
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
} {
  const mode = state.timer_mode;
  const minutes =
    mode === "focus" ? state.focus_minutes
    : mode === "short" ? state.short_break_minutes
    : mode === "long" ? state.long_break_minutes
    : state.focus_minutes;
  const totalSeconds = minutes * 60;

  if (mode === "idle" || !state.timer_started_at) {
    return { totalSeconds, remainingSeconds: totalSeconds, isRunning: false, isPaused: false };
  }

  const startedMs = new Date(state.timer_started_at).getTime();
  const offsetMs = state.timer_pause_offset_seconds * 1000;

  if (state.timer_paused_at) {
    const pausedMs = new Date(state.timer_paused_at).getTime();
    const elapsedMs = Math.max(0, pausedMs - startedMs - offsetMs);
    return {
      totalSeconds,
      remainingSeconds: Math.max(0, totalSeconds - Math.floor(elapsedMs / 1000)),
      isRunning: false,
      isPaused: true
    };
  }

  const elapsedMs = Math.max(0, nowMs - startedMs - offsetMs);
  return {
    totalSeconds,
    remainingSeconds: Math.max(0, totalSeconds - Math.floor(elapsedMs / 1000)),
    isRunning: true,
    isPaused: false
  };
}

export function RoomTimer({ roomId, isOwner, ownerLabel, initial }: RoomTimerProps) {
  const [state, setState] = useState(initial);
  const [nowMs, setNowMs] = useState(() => Date.now());
  // Avoid hammering the auto-advance action: when the timer hits zero, we
  // fire one server action and lock until the realtime broadcast lands.
  const advancingRef = useRef(false);

  // 1Hz tick to drive the display
  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Realtime: subscribe to UPDATEs on this room so every member sees the
  // owner's clicks immediately.
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel(`room-timer:${roomId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "study_rooms", filter: `id=eq.${roomId}` },
        (payload) => {
          const r = payload.new as Record<string, unknown>;
          setState({
            timer_mode: (r.timer_mode as TimerMode) ?? "idle",
            timer_started_at: (r.timer_started_at as string | null) ?? null,
            timer_paused_at: (r.timer_paused_at as string | null) ?? null,
            timer_pause_offset_seconds: Number(r.timer_pause_offset_seconds ?? 0),
            timer_round: Number(r.timer_round ?? 1),
            focus_minutes: Number(r.focus_minutes ?? initial.focus_minutes),
            short_break_minutes: Number(r.short_break_minutes ?? initial.short_break_minutes),
            long_break_minutes: Number(r.long_break_minutes ?? initial.long_break_minutes)
          });
          advancingRef.current = false;
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, initial.focus_minutes, initial.short_break_minutes, initial.long_break_minutes]);

  const display = useMemo(() => deriveDisplay(state, nowMs), [state, nowMs]);

  // Owner-driven auto-advance: when the clock crosses zero, the owner's
  // browser triggers the server action to flip to the next mode. Members
  // just receive the realtime update.
  useEffect(() => {
    if (!isOwner) return;
    if (!display.isRunning) return;
    if (display.remainingSeconds > 0) return;
    if (advancingRef.current) return;
    if (state.timer_mode === "idle") return;
    advancingRef.current = true;
    const fd = new FormData();
    fd.set("room_id", roomId);
    advanceRoomTimerAction(fd).catch(() => {
      advancingRef.current = false;
    });
  }, [isOwner, display.isRunning, display.remainingSeconds, state.timer_mode, roomId]);

  const mm = Math.floor(display.remainingSeconds / 60);
  const ss = display.remainingSeconds % 60;
  const progress = display.totalSeconds === 0 ? 0 : 1 - display.remainingSeconds / display.totalSeconds;

  const radius = 142;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  // Owner controls call server actions via plain functions (programmatic), so
  // we can re-use a single hidden form-data shape without rendering forms.
  const callAction = async (fn: (fd: FormData) => Promise<void>) => {
    if (!isOwner) return;
    const fd = new FormData();
    fd.set("room_id", roomId);
    await fn(fd).catch(() => {});
  };

  const setMode = async (mode: TimerMode) => {
    if (!isOwner) return;
    const fd = new FormData();
    fd.set("room_id", roomId);
    fd.set("mode", mode);
    await setRoomTimerModeAction(fd).catch(() => {});
  };

  const modePill = (mode: TimerMode) => (
    <button
      key={mode}
      type="button"
      disabled={!isOwner || display.isRunning}
      onClick={() => setMode(mode)}
      className={`rounded-full px-3 py-1 text-xs font-display italic transition ${
        state.timer_mode === mode
          ? "bg-ink-900 text-cream-50"
          : "bg-cream-50/65 text-ink-700 hover:bg-cream-50"
      } ${!isOwner || display.isRunning ? "cursor-not-allowed opacity-50" : ""}`}
    >
      {MODE_LABEL[mode]}
    </button>
  );

  const playPauseLabel = display.isRunning ? "Pause" : "Start";
  const onPlayPause = () => {
    if (!isOwner) return;
    callAction(display.isRunning ? pauseRoomTimerAction : startRoomTimerAction);
  };

  return (
    <div className="relative flex flex-col items-center text-ink-900">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-ink-700">
        Shared timer · {isOwner ? "you control" : `controlled by ${ownerLabel}`}
      </p>

      <div className="relative">
        <div
          aria-hidden
          className={`absolute inset-0 -z-10 rounded-full halo-sage blur-2xl ${display.isRunning ? "animate-halo" : ""}`}
        />
        <div className="relative h-[240px] w-[240px] sm:h-[260px] sm:w-[260px]">
          <svg viewBox="0 0 320 320" className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="room-ring-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#3a8a4c" />
                <stop offset="100%" stopColor="#1a4d2a" />
              </linearGradient>
            </defs>
            <circle cx={160} cy={160} r={radius} fill="none"
              stroke="rgba(31,77,44,0.10)" strokeWidth={12} />
            <circle cx={160} cy={160} r={radius} fill="none"
              stroke="url(#room-ring-grad)" strokeWidth={12} strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={dashOffset}
              transform="rotate(-90 160 160)" />
          </svg>
          <div className="absolute inset-[18%] flex flex-col items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#6ea866] to-[#4a7044] text-cream-50 shadow-[inset_0_4px_14px_rgba(0,0,0,0.20)]">
            <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-cream-50/80">
              {MODE_LABEL[state.timer_mode]}
            </span>
            <span className="mt-1 font-display text-[44px] leading-none tabular-nums">
              {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.28em] text-cream-50/70">
              round {state.timer_round}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        {modePill("focus")}
        {modePill("short")}
        {modePill("long")}
      </div>

      <div className="mt-6 flex items-center gap-5">
        <button
          type="button"
          onClick={() => callAction(resetRoomTimerAction)}
          disabled={!isOwner}
          aria-label="Reset"
          title={isOwner ? "Reset" : "Only the owner can reset"}
          className={`flex h-11 w-11 items-center justify-center rounded-full text-ink-900/60 transition ${
            isOwner ? "hover:bg-cream-50/55 hover:text-ink-900 active:scale-95" : "cursor-not-allowed opacity-40"
          }`}
        >
          <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        </button>

        <button
          type="button"
          onClick={onPlayPause}
          disabled={!isOwner}
          aria-label={playPauseLabel}
          title={isOwner ? playPauseLabel : `Only ${ownerLabel} can control the timer`}
          className={`group relative flex h-[76px] w-[76px] items-center justify-center rounded-full bg-ink-900 text-cream-50 shadow-[0_24px_55px_-18px_rgba(31,77,44,0.55)] transition ${
            isOwner ? "hover:-translate-y-0.5 hover:bg-ink-700 active:scale-[0.96]" : "cursor-not-allowed opacity-50"
          }`}
        >
          {display.isRunning ? (
            <Pause className="h-7 w-7 fill-current" strokeWidth={0} />
          ) : (
            <Play className="ml-0.5 h-7 w-7 fill-current" strokeWidth={0} />
          )}
        </button>

        <button
          type="button"
          onClick={() => callAction(advanceRoomTimerAction)}
          disabled={!isOwner || state.timer_mode === "idle"}
          aria-label="Skip"
          title={isOwner ? "Skip to next phase" : "Only the owner can skip"}
          className={`flex h-11 w-11 items-center justify-center rounded-full text-ink-900/60 transition ${
            isOwner && state.timer_mode !== "idle" ? "hover:bg-cream-50/55 hover:text-ink-900 active:scale-95" : "cursor-not-allowed opacity-40"
          }`}
        >
          <SkipForward className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>

      {!isOwner && (
        <p className="mt-5 max-w-[280px] text-center text-xs text-ink-700/85">
          When {ownerLabel} starts the timer, yours starts at the same instant.
        </p>
      )}
    </div>
  );
}
