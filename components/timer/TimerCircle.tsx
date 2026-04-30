"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
};

const ACCESSORY_OVERLAY: Record<string, { emoji: string; top: string; left: string; size: string }> = {
  "sheep-glasses": { emoji: "🤓", top: "32%", left: "50%", size: "text-3xl" },
  "sheep-cap": { emoji: "🎓", top: "8%", left: "50%", size: "text-4xl" },
  "sheep-scarf": { emoji: "🧣", top: "60%", left: "50%", size: "text-3xl" },
  "sheep-mug": { emoji: "🍵", top: "55%", left: "82%", size: "text-2xl" }
};

type Mode = StudyMode; // "focus" | "short" | "long"

export function TimerCircle({
  focusMinutes,
  shortBreakMinutes,
  longBreakMinutes,
  todayMinutes,
  tasks,
  topics,
  onComplete,
  equippedSound,
  equippedAccessory
}: Props) {
  const minutesByMode: Record<Mode, number> = useMemo(
    () => ({
      focus: focusMinutes,
      short: shortBreakMinutes,
      long: longBreakMinutes
    }),
    [focusMinutes, shortBreakMinutes, longBreakMinutes]
  );

  const [mode, setMode] = useState<Mode>("focus");
  const totalSeconds = minutesByMode[mode] * 60;

  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const [taskId, setTaskId] = useState<string>("");
  const [topicId, setTopicId] = useState<string>("");
  const [taskPickerOpen, setTaskPickerOpen] = useState(false);
  const tickRef = useRef<NodeJS.Timeout | null>(null);

  // When mode changes, reset the timer
  useEffect(() => {
    setRemaining(totalSeconds);
    setRunning(false);
  }, [mode, totalSeconds]);

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
    const minutes = Math.round((totalSeconds - 0) / 60);
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

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-ink-900/10 bg-gradient-to-b from-[#dfead2] via-[#cfe0c2] to-[#bbd3ad] px-6 py-6 text-ink-900 shadow-soft sm:px-8">
      {/* Ring + sheep — centred, no top-corner clutter */}
      <div className="flex flex-col items-center">
        <div className="relative h-[260px] w-[260px] sm:h-[280px] sm:w-[280px]">
          <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full">
            {/* Soft white halo behind the ring for contrast */}
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

        <p className="mt-5 font-display text-5xl tabular-nums tracking-[0.05em] text-ink-900 sm:text-6xl">
          {mm}:{ss}
        </p>

        {selectedTaskLabel && (
          <p className="mt-1 max-w-md text-center text-sm text-ink-700">
            Working on <span className="font-semibold text-ink-900">{selectedTaskLabel}</span>
          </p>
        )}

        {/* Mode tabs — sit right under the time, balanced and integrated */}
        <div className="mt-4 inline-flex rounded-full bg-cream-50/70 p-1 shadow-soft">
          {(["focus", "short", "long"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest transition sm:px-4 sm:text-xs ${
                mode === m
                  ? "bg-ink-900 text-cream-50 shadow-soft"
                  : "text-ink-900/70 hover:text-ink-900"
              }`}
            >
              {m === "focus"
                ? `Focus · ${focusMinutes}m`
                : m === "short"
                  ? `Short · ${shortBreakMinutes}m`
                  : `Long · ${longBreakMinutes}m`}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
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
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-700">
                Topic
              </p>
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
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-700">
                Task
              </p>
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
          className="rounded-full bg-ink-900 px-8 py-3 text-sm font-semibold uppercase tracking-widest text-cream-50 hover:bg-ink-700"
        >
          {running ? "Pause" : remaining === 0 ? "Restart" : "Start session"}
        </button>

        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-cream-50 px-5 py-3 text-sm font-semibold text-ink-900 shadow-soft hover:bg-cream-100"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={skip}
          className="text-xs font-semibold uppercase tracking-widest text-ink-900/70 underline-offset-4 hover:underline"
          title="Mark complete and log the session"
        >
          Skip · log
        </button>
      </div>

      <AmbientPlayer sound={equippedSound ?? null} playing={running && mode === "focus"} />
    </div>
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
