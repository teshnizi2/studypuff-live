"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Settings as SettingsIcon, Users, BarChart3, Sparkles,
  RotateCcw, Play, Pause, type LucideIcon
} from "lucide-react";
import type { StudyMode } from "@/lib/supabase/database.types";
import { TimePicker } from "./TimePicker";

type Task = { id: string; text: string };
type Topic = { id: string; name: string };

type Props = {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  todayMinutes: number;
  dailyGoalMinutes?: number;
  tasks: Task[];
  topics: Topic[];
  taskId: string;
  topicId: string;
  running: boolean;
  onRunningChange: (running: boolean) => void;
  onComplete: (form: FormData) => Promise<void>;
  equippedAccessory?: string | null;
  onSettingsClick?: () => void;
  onRoomsClick?: () => void;
};

const ACCESSORY_OVERLAY: Record<string, { emoji: string; top: string; left: string; size: string }> = {
  "sheep-glasses": { emoji: "🤓", top: "32%", left: "50%", size: "text-3xl" },
  "sheep-cap":     { emoji: "🎓", top: "8%",  left: "50%", size: "text-4xl" },
  "sheep-scarf":   { emoji: "🧣", top: "60%", left: "50%", size: "text-3xl" },
  "sheep-mug":     { emoji: "🍵", top: "55%", left: "82%", size: "text-2xl" }
};

export function TimerCircle({
  focusMinutes, shortBreakMinutes, longBreakMinutes,
  todayMinutes, dailyGoalMinutes,
  tasks, topics, taskId, topicId,
  running, onRunningChange,
  onComplete, equippedAccessory,
  onSettingsClick, onRoomsClick
}: Props) {
  const [mode, setMode] = useState<StudyMode>("focus");
  const [totalSeconds, setTotalSeconds] = useState(focusMinutes * 60);
  const [remaining, setRemaining] = useState(focusMinutes * 60);
  const tickRef = useRef<NodeJS.Timeout | null>(null);

  // Reset when total changes
  useEffect(() => {
    setRemaining(totalSeconds);
    onRunningChange(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSeconds]);

  // Countdown
  useEffect(() => {
    if (!running) {
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = null;
      return;
    }
    tickRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (tickRef.current) clearInterval(tickRef.current);
          handleComplete();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const handleComplete = useCallback(() => {
    onRunningChange(false);
    const minutes = Math.max(1, Math.round(totalSeconds / 60));
    const fd = new FormData();
    fd.set("minutes", String(minutes));
    fd.set("mode", mode);
    if (topicId) fd.set("topic_id", topicId);
    if (taskId) {
      fd.set("task_id", taskId);
      const t = tasks.find((x) => x.id === taskId);
      if (t) fd.set("task_name", t.text);
    }
    if (topicId) {
      const t = topics.find((x) => x.id === topicId);
      if (t) fd.set("topic_name", t.name);
    }
    onComplete(fd).catch(() => {});
    chime();
  }, [mode, taskId, topicId, tasks, topics, totalSeconds, onComplete, onRunningChange]);

  const reset = () => { onRunningChange(false); setRemaining(totalSeconds); };
  const skip  = () => { setRemaining(0); handleComplete(); };

  const setPreset = (m: StudyMode, mins: number) => {
    setMode(m);
    setTotalSeconds(mins * 60);
  };

  const radius = 142;
  const circumference = 2 * Math.PI * radius;
  const progress = totalSeconds === 0 ? 0 : 1 - remaining / totalSeconds;
  const dashOffset = circumference * (1 - progress);
  const angleDeg = -90 + 360 * progress;
  const dotX = 160 + radius * Math.cos((angleDeg * Math.PI) / 180);
  const dotY = 160 + radius * Math.sin((angleDeg * Math.PI) / 180);

  // Always show actual remaining time (paused or running). Fall back to total
  // only after completion (remaining === 0) so the picker shows the duration
  // ready to restart.
  const visibleSeconds = remaining > 0 ? remaining : totalSeconds;
  const mm = Math.floor(visibleSeconds / 60);
  const ss = visibleSeconds % 60;

  const presets: { id: StudyMode; label: string; mins: number }[] = useMemo(
    () => [
      { id: "focus", label: "focus", mins: focusMinutes },
      { id: "short", label: "short", mins: shortBreakMinutes },
      { id: "long",  label: "long",  mins: longBreakMinutes }
    ],
    [focusMinutes, shortBreakMinutes, longBreakMinutes]
  );
  const activePresetId =
    presets.find((p) => p.mins * 60 === totalSeconds && p.id === mode)?.id ?? null;

  const goal = dailyGoalMinutes && dailyGoalMinutes > 0 ? dailyGoalMinutes : 0;
  const goalPct = goal > 0 ? Math.min(1, todayMinutes / goal) : 0;

  return (
    <div className="relative flex flex-col items-center text-ink-900">
      {/* Top utility row */}
      <div className="mb-6 flex w-full items-center justify-between">
        <div className="flex items-center gap-1.5">
          {onRoomsClick && <IconButton Icon={Users} label="Study rooms" onClick={onRoomsClick} />}
          <IconButton Icon={BarChart3} label="Stats" href="/dashboard/stats" />
          <IconButton Icon={Sparkles} label="Rewards" href="/dashboard/rewards" />
        </div>
        {onSettingsClick && (
          <IconButton Icon={SettingsIcon} label="Settings" onClick={onSettingsClick} />
        )}
      </div>

      {/* Sheep ring — floating, no card */}
      <div className="relative">
        <div
          aria-hidden
          className={`absolute inset-0 -z-10 rounded-full halo-sage blur-2xl ${running ? "animate-halo" : ""}`}
        />
        <div className="relative h-[320px] w-[320px] sm:h-[340px] sm:w-[340px]">
          <svg viewBox="0 0 320 320" className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="ring-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#3a8a4c" />
                <stop offset="100%" stopColor="#1a4d2a" />
              </linearGradient>
            </defs>
            <circle cx={160} cy={160} r={radius} fill="none"
              stroke="rgba(31,77,44,0.10)" strokeWidth={12} />
            <circle cx={160} cy={160} r={radius} fill="none"
              stroke="url(#ring-grad)" strokeWidth={12} strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={dashOffset}
              transform="rotate(-90 160 160)"
              style={{ transition: running ? "none" : "stroke-dashoffset 0.5s ease" }} />
            <circle cx={dotX} cy={dotY} r={9} fill="#fff" stroke="#1a4d2a" strokeWidth={2.5} />
          </svg>
          <div className="absolute inset-[18%] flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#6ea866] to-[#4a7044] shadow-[inset_0_4px_14px_rgba(0,0,0,0.20)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/studypuff-sheep.png"
              alt=""
              className={`h-[82%] w-[82%] object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] ${running ? "animate-breathe" : ""}`}
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

      {/* Time picker */}
      <div className="mt-6">
        <TimePicker minutes={mm} seconds={ss} disabled={running} onChange={setTotalSeconds} />
      </div>

      {/* Preset chips — minimal italic, dot-separated */}
      <div className="mt-3 flex items-center gap-3 text-sm">
        {presets.map((p, i) => (
          <span key={p.id} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-ink-900/25" />}
            <button
              type="button"
              onClick={() => setPreset(p.id, p.mins)}
              className={`font-display italic transition draw-underline ${
                activePresetId === p.id
                  ? "font-semibold text-ink-900"
                  : "text-ink-700 hover:text-ink-900"
              }`}
            >
              {p.label} <span className="text-ink-700/60">· {p.mins}m</span>
            </button>
          </span>
        ))}
      </div>

      {/* Play / pause — the only solid focal element */}
      <div className="mt-7 flex items-center gap-5">
        <button
          type="button"
          onClick={reset}
          aria-label="Reset" title="Reset"
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink-900/60 transition hover:bg-cream-50/55 hover:text-ink-900 active:scale-95"
        >
          <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        </button>

        <button
          type="button"
          onClick={() => onRunningChange(!running)}
          aria-label={running ? "Pause" : "Start"}
          className="group relative flex h-[88px] w-[88px] items-center justify-center rounded-full bg-ink-900 text-cream-50 shadow-[0_24px_55px_-18px_rgba(31,77,44,0.55)] transition hover:-translate-y-0.5 hover:bg-ink-700 active:translate-y-0 active:scale-[0.96]"
        >
          <span aria-hidden className="pointer-events-none absolute inset-[-6px] rounded-full ring-1 ring-emerald-700/0 transition group-hover:ring-emerald-700/20" />
          {running ? (
            <Pause className="h-9 w-9 fill-current" strokeWidth={0} />
          ) : (
            <Play className="ml-1 h-9 w-9 fill-current" strokeWidth={0} />
          )}
        </button>

        <button
          type="button"
          onClick={skip}
          aria-label="Skip" title="Skip · log session"
          className="font-display text-xs italic uppercase tracking-[0.22em] text-ink-700 transition hover:text-ink-900"
        >
          skip
        </button>
      </div>

      {/* Today's gauge */}
      <div className="mt-7 w-full max-w-[300px]">
        <div className="flex items-baseline justify-between text-[11px] uppercase tracking-[0.28em] text-ink-700">
          <span>today</span>
          <span>
            <em className="not-italic font-display text-base text-ink-900">{todayMinutes}</em> min
            {goal > 0 && <span className="text-ink-700/60"> / {goal}</span>}
          </span>
        </div>
        <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-ink-900/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-500 transition-[width] duration-500"
            style={{ width: `${(goal > 0 ? goalPct : Math.min(1, todayMinutes / 60)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function IconButton({ Icon, label, onClick, href }: {
  Icon: LucideIcon; label: string; onClick?: () => void; href?: string;
}) {
  const cls =
    "flex h-9 w-9 items-center justify-center rounded-full text-ink-900/70 transition hover:-translate-y-0.5 hover:bg-cream-50/60 hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700";
  if (href) {
    return (
      <a href={href} className={cls} aria-label={label} title={label}>
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls} aria-label={label} title={label}>
      <Icon className="h-4 w-4" strokeWidth={1.75} />
    </button>
  );
}

function chime() {
  if (typeof window === "undefined") return;
  try {
    const Ctx = window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(880, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.6);
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.85);
  } catch { /* ignore */ }
}
