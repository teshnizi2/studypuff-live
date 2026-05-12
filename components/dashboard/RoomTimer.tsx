"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw, Play, Pause } from "lucide-react";
import { TimePicker } from "@/components/timer/TimePicker";
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
  equippedAccessory?: string | null;
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

// Match the solo TimerCircle's accessory overlay table so the sheep
// looks identical regardless of solo vs room mode.
const ACCESSORY_OVERLAY: Record<string, { emoji: string; top: string; left: string; size: string }> = {
  "sheep-glasses": { emoji: "🤓", top: "32%", left: "50%", size: "text-3xl" },
  "sheep-cap":     { emoji: "🎓", top: "8%",  left: "50%", size: "text-4xl" },
  "sheep-scarf":   { emoji: "🧣", top: "60%", left: "50%", size: "text-3xl" },
  "sheep-mug":     { emoji: "🍵", top: "55%", left: "82%", size: "text-2xl" }
};

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

export function RoomTimer({ roomId, isOwner, ownerLabel, equippedAccessory, initial }: RoomTimerProps) {
  const [state, setState] = useState(initial);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const advancingRef = useRef(false);

  // 1Hz tick
  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Realtime: UPDATEs on this room → re-sync state for every member.
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

  // Owner-driven auto-advance: at zero, the owner's browser flips to the
  // next mode and writes; every member sees it via realtime.
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

  const callAction = (fn: (fd: FormData) => Promise<void>) => {
    if (!isOwner) return;
    const fd = new FormData();
    fd.set("room_id", roomId);
    fn(fd).catch(() => {});
  };

  const setMode = (mode: TimerMode) => {
    if (!isOwner) return;
    const fd = new FormData();
    fd.set("room_id", roomId);
    fd.set("mode", mode);
    setRoomTimerModeAction(fd).catch(() => {});
  };

  // Same SVG geometry as the solo TimerCircle so the rings are visually
  // indistinguishable.
  const radius = 142;
  const circumference = 2 * Math.PI * radius;
  const progress = display.totalSeconds === 0 ? 0 : 1 - display.remainingSeconds / display.totalSeconds;
  const dashOffset = circumference * (1 - progress);
  const angleDeg = -90 + 360 * progress;
  const dotX = 160 + radius * Math.cos((angleDeg * Math.PI) / 180);
  const dotY = 160 + radius * Math.sin((angleDeg * Math.PI) / 180);

  const visibleSeconds = display.remainingSeconds > 0 ? display.remainingSeconds : display.totalSeconds;
  const mm = Math.floor(visibleSeconds / 60);
  const ss = visibleSeconds % 60;

  const presets: { id: TimerMode; label: string; mins: number }[] = useMemo(
    () => [
      { id: "focus", label: "focus", mins: state.focus_minutes },
      { id: "short", label: "short", mins: state.short_break_minutes },
      { id: "long",  label: "long",  mins: state.long_break_minutes }
    ],
    [state.focus_minutes, state.short_break_minutes, state.long_break_minutes]
  );
  const activePresetId = state.timer_mode === "idle" ? "focus" : state.timer_mode;

  const playPauseLabel = display.isRunning ? "Pause" : "Start";

  return (
    <div className="relative flex flex-col items-center text-ink-900">
      {/* Sheep ring — identical to solo */}
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
              transform="rotate(-90 160 160)"
              style={{ transition: display.isRunning ? "none" : "stroke-dashoffset 0.5s ease" }} />
            <circle cx={dotX} cy={dotY} r={9} fill="#fff" stroke="#1a4d2a" strokeWidth={2.5} />
          </svg>
          <div className="absolute inset-[18%] flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#6ea866] to-[#4a7044] shadow-[inset_0_4px_14px_rgba(0,0,0,0.20)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/studypuff-sheep.png"
              alt=""
              className={`h-[82%] w-[82%] object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${display.isRunning ? "animate-breathe" : ""}`}
            />
            {equippedAccessory && ACCESSORY_OVERLAY[equippedAccessory] && (
              <span
                aria-hidden
                className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 select-none ${ACCESSORY_OVERLAY[equippedAccessory].size}`}
                style={{ top: ACCESSORY_OVERLAY[equippedAccessory].top, left: ACCESSORY_OVERLAY[equippedAccessory].left }}
              >
                {ACCESSORY_OVERLAY[equippedAccessory].emoji}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* TimePicker — duration display. Always read-only in room mode
          because duration is set by the preset chips below, which only
          the owner can interact with. */}
      <div className="mt-5">
        <TimePicker minutes={mm} seconds={ss} disabled onChange={() => {}} />
      </div>

      {/* Preset chips — same look as solo, but only owner can switch.
          Disabled while running for everyone (matches solo behavior). */}
      <div className="mt-2 flex items-center gap-3 text-sm">
        {presets.map((p, i) => (
          <span key={p.id} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-ink-900/25" />}
            <button
              type="button"
              onClick={() => setMode(p.id)}
              disabled={!isOwner || display.isRunning}
              title={!isOwner ? `Only ${ownerLabel} can change the mode` : undefined}
              className={`font-display italic transition draw-underline ${
                activePresetId === p.id
                  ? "font-semibold text-ink-900"
                  : "text-ink-700 hover:text-ink-900"
              } ${!isOwner || display.isRunning ? "cursor-not-allowed opacity-60" : ""}`}
            >
              {p.label} <span className="text-ink-700/60">· {p.mins}m</span>
            </button>
          </span>
        ))}
      </div>

      {/* Reset / Play-Pause / Skip — visually identical to solo, just
          disabled for non-owners with explanatory titles. */}
      <div className="mt-6 flex items-center gap-5">
        <button
          type="button"
          onClick={() => callAction(resetRoomTimerAction)}
          disabled={!isOwner}
          aria-label="Reset"
          title={isOwner ? "Reset" : `Only ${ownerLabel} can reset`}
          className={`flex h-11 w-11 items-center justify-center rounded-full text-ink-900/60 transition ${
            isOwner ? "hover:bg-cream-50/55 hover:text-ink-900 active:scale-95" : "cursor-not-allowed opacity-50"
          }`}
        >
          <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        </button>

        <button
          type="button"
          onClick={() =>
            callAction(display.isRunning ? pauseRoomTimerAction : startRoomTimerAction)
          }
          disabled={!isOwner}
          aria-label={playPauseLabel}
          title={isOwner ? playPauseLabel : `Only ${ownerLabel} controls the timer`}
          className={`group relative flex h-[76px] w-[76px] items-center justify-center rounded-full bg-ink-900 text-cream-50 shadow-[0_24px_55px_-18px_rgba(31,77,44,0.55)] transition ${
            isOwner ? "hover:-translate-y-0.5 hover:bg-ink-700 active:translate-y-0 active:scale-[0.96]" : "cursor-not-allowed opacity-60"
          }`}
        >
          <span aria-hidden className="pointer-events-none absolute inset-[-6px] rounded-full ring-1 ring-emerald-700/0 transition group-hover:ring-emerald-700/20" />
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
          title={isOwner ? "Skip · next phase" : `Only ${ownerLabel} can skip`}
          className={`font-display text-xs italic uppercase tracking-[0.22em] text-ink-700 transition ${
            isOwner && state.timer_mode !== "idle" ? "hover:text-ink-900" : "cursor-not-allowed opacity-50"
          }`}
        >
          skip
        </button>
      </div>

      {/* Small caption so members know why their buttons are locked.
          Doesn't change the silhouette of the timer. */}
      <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-ink-700/65">
        {isOwner ? "synced · you control" : `synced · ${ownerLabel} controls`}
      </p>
    </div>
  );
}
