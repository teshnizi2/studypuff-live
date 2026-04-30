"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Settings as SettingsIcon,
  ListChecks,
  Users,
  BarChart3,
  Sparkles,
  Music,
  Volume2,
  VolumeX,
  CloudRain,
  Flame,
  type LucideIcon
} from "lucide-react";
import type { StudyMode } from "@/lib/supabase/database.types";
import { AmbientPlayer } from "./AmbientPlayer";

type Task = { id: string; text: string };
type Topic = { id: string; name: string };

type Props = {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  todayMinutes: number;
  tasks: Task[];
  topics: Topic[];
  onComplete: (form: FormData) => Promise<void>;
  equippedSound?: string | null;
  equippedAccessory?: string | null;
  onSettingsClick?: () => void;
  onTasksClick?: () => void;
  onRoomsClick?: () => void;
};

const ACCESSORY_OVERLAY: Record<string, { emoji: string; top: string; left: string; size: string }> = {
  "sheep-glasses": { emoji: "🤓", top: "32%", left: "50%", size: "text-3xl" },
  "sheep-cap": { emoji: "🎓", top: "8%", left: "50%", size: "text-4xl" },
  "sheep-scarf": { emoji: "🧣", top: "60%", left: "50%", size: "text-3xl" },
  "sheep-mug": { emoji: "🍵", top: "55%", left: "82%", size: "text-2xl" }
};

type Mode = StudyMode | "custom";

type SoundOption = {
  id: string | null;
  label: string;
  Icon: LucideIcon;
};

const SOUND_OPTIONS: SoundOption[] = [
  { id: null, label: "None", Icon: VolumeX },
  { id: "sound-rain", label: "Rain", Icon: CloudRain },
  { id: "sound-library", label: "Library", Icon: Volume2 },
  { id: "sound-forest", label: "Forest", Icon: Music },
  { id: "sound-cafe", label: "Café", Icon: Volume2 },
  { id: "sound-fire", label: "Fire", Icon: Flame },
  { id: "sound-ocean", label: "Ocean", Icon: Music }
];

export function TimerCircle({
  focusMinutes,
  shortBreakMinutes,
  longBreakMinutes,
  todayMinutes,
  tasks,
  topics,
  onComplete,
  equippedSound,
  equippedAccessory,
  onSettingsClick,
  onTasksClick,
  onRoomsClick
}: Props) {
  const [mode, setMode] = useState<Mode>("focus");
  const [customMinutes, setCustomMinutes] = useState(15);

  const totalSeconds = useMemo(() => {
    if (mode === "focus") return focusMinutes * 60;
    if (mode === "short") return shortBreakMinutes * 60;
    if (mode === "long") return longBreakMinutes * 60;
    return Math.max(1, customMinutes) * 60;
  }, [mode, focusMinutes, shortBreakMinutes, longBreakMinutes, customMinutes]);

  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const [taskId, setTaskId] = useState<string>("");
  const [topicId, setTopicId] = useState<string>("");
  const [taskPickerOpen, setTaskPickerOpen] = useState(false);
  const [sessionSound, setSessionSound] = useState<string | null>(equippedSound ?? "sound-library");
  const tickRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer when mode/total changes
  useEffect(() => {
    setRemaining(totalSeconds);
    setRunning(false);
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
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const handleComplete = useCallback(() => {
    setRunning(false);
    const minutes = Math.round(totalSeconds / 60);
    const fd = new FormData();
    fd.set("minutes", String(minutes));
    // Custom minutes still log as a focus session in the DB
    fd.set("mode", mode === "custom" ? "focus" : mode);
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
    onComplete(fd).catch(() => {
      // swallow — we still played the chime
    });
    chime();
  }, [mode, taskId, topicId, tasks, topics, totalSeconds, onComplete]);

  const reset = () => {
    setRunning(false);
    setRemaining(totalSeconds);
  };

  const skip = () => {
    setRemaining(0);
    handleComplete();
  };

  // Ring math
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const progress = totalSeconds === 0 ? 0 : 1 - remaining / totalSeconds;
  const dashOffset = circumference * (1 - progress);
  const angleDeg = -90 + 360 * progress;
  const dotX = 150 + radius * Math.cos((angleDeg * Math.PI) / 180);
  const dotY = 150 + radius * Math.sin((angleDeg * Math.PI) / 180);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  const selectedTaskLabel = tasks.find((t) => t.id === taskId)?.text;
  const isPomodoroFocusMode = mode === "focus" || mode === "custom";

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-ink-900/10 bg-gradient-to-b from-[#dfead2] via-[#cfe0c2] to-[#bbd3ad] px-5 pb-6 pt-4 text-ink-900 shadow-soft sm:px-7 sm:pt-5">
      {/* Subtle ambient leaves */}
      <svg
        aria-hidden
        className="pointer-events-none absolute -left-3 -top-3 h-20 w-20 text-emerald-900/15"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M50 10 Q 30 30 50 50 Q 70 30 50 10 Z" />
        <path d="M30 40 Q 15 55 30 70 Q 45 55 30 40 Z" />
      </svg>
      <svg
        aria-hidden
        className="pointer-events-none absolute -right-2 -bottom-2 h-24 w-24 rotate-180 text-emerald-900/15"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M50 10 Q 30 30 50 50 Q 70 30 50 10 Z" />
        <path d="M30 40 Q 15 55 30 70 Q 45 55 30 40 Z" />
      </svg>

      {/* Top bar: nav icons left, gear right */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {onTasksClick && <IconButton Icon={ListChecks} label="Tasks" onClick={onTasksClick} />}
          {onRoomsClick && <IconButton Icon={Users} label="Study rooms" onClick={onRoomsClick} />}
          <IconButton Icon={BarChart3} label="Stats" href="/dashboard/stats" />
          <IconButton Icon={Sparkles} label="Rewards" href="/dashboard/rewards" />
        </div>
        {onSettingsClick && (
          <IconButton Icon={SettingsIcon} label="Settings & profile" onClick={onSettingsClick} />
        )}
      </div>

      {/* Ring + sheep */}
      <div className="mt-2 flex flex-col items-center">
        <div className="relative h-[260px] w-[260px] sm:h-[280px] sm:w-[280px]">
          <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full">
            <circle cx={150} cy={150} r={radius + 2} fill="rgba(255,255,255,0.35)" />
            <circle
              cx={150}
              cy={150}
              r={radius}
              fill="none"
              stroke="rgba(31,77,44,0.18)"
              strokeWidth={10}
            />
            <circle
              cx={150}
              cy={150}
              r={radius}
              fill="none"
              stroke="#1f4d2c"
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 150 150)"
              style={{ transition: running ? "none" : "stroke-dashoffset 0.5s ease" }}
            />
            <circle cx={dotX} cy={dotY} r={11} fill="#fff" stroke="#1f4d2c" strokeWidth={3} />
          </svg>
          <div className="absolute inset-[16%] flex items-center justify-center overflow-hidden rounded-full bg-[#5b8a55] shadow-[inset_0_4px_8px_rgba(0,0,0,0.15)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/studypuff-sheep.png"
              alt=""
              className={`h-[78%] w-[78%] object-contain ${running ? "animate-breathe" : ""}`}
            />
            {equippedAccessory && ACCESSORY_OVERLAY[equippedAccessory] && (
              <span
                aria-hidden
                className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 select-none ${ACCESSORY_OVERLAY[equippedAccessory].size}`}
                style={{
                  top: ACCESSORY_OVERLAY[equippedAccessory].top,
                  left: ACCESSORY_OVERLAY[equippedAccessory].left
                }}
              >
                {ACCESSORY_OVERLAY[equippedAccessory].emoji}
              </span>
            )}
          </div>
        </div>

        <p className="mt-4 font-display text-5xl tabular-nums tracking-[0.05em] text-ink-900 sm:text-6xl">
          {mm}:{ss}
        </p>

        {selectedTaskLabel && (
          <p className="mt-1 max-w-md text-center text-sm text-ink-700">
            Working on <span className="font-semibold text-ink-900">{selectedTaskLabel}</span>
          </p>
        )}

        {/* Mode tabs (Focus / Short / Long / Custom) */}
        <div className="mt-3 inline-flex flex-wrap justify-center rounded-full bg-cream-50/70 p-1 shadow-soft">
          {(
            [
              ["focus", `Focus · ${focusMinutes}m`],
              ["short", `Short · ${shortBreakMinutes}m`],
              ["long", `Long · ${longBreakMinutes}m`],
              ["custom", "Custom"]
            ] as [Mode, string][]
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest transition sm:text-xs ${
                mode === m
                  ? "bg-ink-900 text-cream-50 shadow-soft"
                  : "text-ink-900/70 hover:text-ink-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Custom minutes input — visible only in custom mode */}
        {mode === "custom" && (
          <div className="mt-3 flex items-center gap-2 rounded-full bg-cream-50 px-3 py-1.5 shadow-soft">
            <label htmlFor="custom-min" className="text-xs font-semibold text-ink-700">
              Minutes
            </label>
            <input
              id="custom-min"
              type="number"
              min={1}
              max={240}
              value={customMinutes}
              onChange={(e) => setCustomMinutes(Math.max(1, Math.min(240, Number(e.target.value) || 1)))}
              className="w-16 rounded-full bg-transparent text-center text-sm font-semibold tabular-nums text-ink-900 outline-none"
            />
          </div>
        )}

        {/* Sound selector — only meaningful for focus / custom (study) modes */}
        {isPomodoroFocusMode && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            <span className="mr-1 text-[10px] font-semibold uppercase tracking-widest text-ink-700">
              Sound
            </span>
            {SOUND_OPTIONS.map((s) => {
              const active = sessionSound === s.id;
              return (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSessionSound(s.id)}
                  title={s.label}
                  aria-label={s.label}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                    active
                      ? "bg-ink-900 text-cream-50 shadow-soft"
                      : "bg-cream-50/70 text-ink-900/80 hover:bg-cream-50"
                  }`}
                >
                  <s.Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                  {s.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="relative z-10 mt-5 flex flex-wrap items-center justify-center gap-2.5">
        <div className="relative">
          <button
            type="button"
            onClick={() => setTaskPickerOpen((o) => !o)}
            className="rounded-full bg-cream-50 px-5 py-3 text-sm font-semibold text-ink-900 shadow-soft hover:bg-cream-100"
          >
            {taskId ? "Change task" : "Select task"}
          </button>
          {taskPickerOpen && (
            <div className="absolute bottom-full left-1/2 z-10 mb-2 w-72 -translate-x-1/2 rounded-2xl border border-ink-900/10 bg-cream-50 p-4 text-left shadow-soft">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-700">Topic</p>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="mb-3 w-full rounded-xl border border-ink-900/15 bg-cream-100 px-3 py-2 text-sm"
              >
                <option value="">General study</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-700">Task</p>
              <select
                value={taskId}
                onChange={(e) => setTaskId(e.target.value)}
                className="w-full rounded-xl border border-ink-900/15 bg-cream-100 px-3 py-2 text-sm"
              >
                <option value="">No specific task</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.text}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setTaskPickerOpen(false)}
                className="mt-3 block w-full rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-cream-50"
              >
                Done
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="rounded-full bg-ink-900 px-9 py-3.5 text-sm font-semibold uppercase tracking-widest text-cream-50 shadow-[0_10px_30px_-10px_rgba(31,77,44,0.6)] transition hover:-translate-y-0.5 hover:bg-ink-700 active:translate-y-0 active:scale-[0.98]"
        >
          {running ? "Pause" : remaining === 0 ? "Restart" : "Start session"}
        </button>

        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-cream-50 px-5 py-3 text-sm font-semibold text-ink-900 shadow-soft transition hover:bg-cream-100 active:scale-[0.97]"
        >
          Reset
        </button>
      </div>

      <div className="relative z-10 mt-3 flex items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-900/60">
        <span>{todayMinutes} min today</span>
        <span aria-hidden>·</span>
        <button
          type="button"
          onClick={skip}
          className="underline-offset-4 hover:text-ink-900 hover:underline"
          title="Mark complete and log the session"
        >
          Skip · log session
        </button>
      </div>

      <AmbientPlayer sound={sessionSound} playing={running && isPomodoroFocusMode} />
    </div>
  );
}

function IconButton({
  Icon,
  label,
  onClick,
  href
}: {
  Icon: LucideIcon;
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const cls =
    "flex h-9 w-9 items-center justify-center rounded-full bg-cream-50/80 text-ink-900 shadow-soft ring-1 ring-ink-900/10 transition hover:-translate-y-0.5 hover:bg-cream-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700";
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
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
  } catch {
    // ignore
  }
}
