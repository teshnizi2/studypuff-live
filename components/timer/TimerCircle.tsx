"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Settings as SettingsIcon,
  ListChecks,
  Users,
  BarChart3,
  Sparkles,
  Music,
  RotateCcw,
  ChevronDown,
  Plus,
  Check,
  Loader2,
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
  onCreateTask?: (form: FormData) => Promise<void>;
  onCreateTopic?: (form: FormData) => Promise<void>;
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

const SOUND_OPTIONS: { id: string | null; label: string }[] = [
  { id: null, label: "Silence" },
  { id: "sound-lofi", label: "Lo-fi pad" },
  { id: "sound-rain", label: "Soft rain" },
  { id: "sound-library", label: "Quiet library" },
  { id: "sound-forest", label: "Forest morning" },
  { id: "sound-cafe", label: "Cosy café" },
  { id: "sound-fire", label: "Fireplace" },
  { id: "sound-ocean", label: "Ocean waves" }
];

export function TimerCircle({
  focusMinutes,
  shortBreakMinutes,
  longBreakMinutes,
  todayMinutes,
  tasks,
  topics,
  onComplete,
  onCreateTask,
  onCreateTopic,
  equippedSound,
  equippedAccessory,
  onSettingsClick,
  onTasksClick,
  onRoomsClick
}: Props) {
  const [mode, setMode] = useState<Mode>("focus");
  const [customMinutes, setCustomMinutes] = useState(15);
  const [customSeconds, setCustomSeconds] = useState(0);

  const totalSeconds = useMemo(() => {
    if (mode === "focus") return focusMinutes * 60;
    if (mode === "short") return shortBreakMinutes * 60;
    if (mode === "long") return longBreakMinutes * 60;
    return Math.max(1, customMinutes * 60 + customSeconds);
  }, [mode, focusMinutes, shortBreakMinutes, longBreakMinutes, customMinutes, customSeconds]);

  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const [taskId, setTaskId] = useState<string>("");
  const [topicId, setTopicId] = useState<string>("");
  const [taskPickerOpen, setTaskPickerOpen] = useState(false);
  const [soundOpen, setSoundOpen] = useState(false);
  const [sessionSound, setSessionSound] = useState<string | null>(equippedSound ?? "sound-lofi");
  const [newTopicName, setNewTopicName] = useState("");
  const [newTaskText, setNewTaskText] = useState("");
  const [creating, startCreating] = useTransition();
  const router = useRouter();
  const tickRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer when total changes
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
    const minutes = Math.max(1, Math.round(totalSeconds / 60));
    const fd = new FormData();
    fd.set("minutes", String(minutes));
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
    onComplete(fd).catch(() => {});
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
  const selectedSoundLabel =
    SOUND_OPTIONS.find((s) => s.id === sessionSound)?.label || "Silence";

  const handleAddTopic = () => {
    if (!onCreateTopic || !newTopicName.trim()) return;
    const name = newTopicName.trim();
    startCreating(async () => {
      const fd = new FormData();
      fd.set("name", name);
      try {
        await onCreateTopic(fd);
        setNewTopicName("");
        // server action's revalidatePath has already fired; router.refresh()
        // makes the parent server component re-fetch so the new topic shows
        // up immediately in the list passed to this component
        router.refresh();
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleAddTask = () => {
    if (!onCreateTask || !newTaskText.trim()) return;
    const text = newTaskText.trim();
    const tid = topicId;
    startCreating(async () => {
      const fd = new FormData();
      fd.set("text", text);
      fd.set("priority", "normal");
      if (tid) fd.set("topic_id", tid);
      try {
        await onCreateTask(fd);
        setNewTaskText("");
        router.refresh();
      } catch (err) {
        console.error(err);
      }
    });
  };

  return (
    <div className="relative rounded-[28px] border border-ink-900/10 bg-gradient-to-b from-[#dfead2] via-[#cfe0c2] to-[#bbd3ad] px-5 pb-6 pt-4 text-ink-900 shadow-soft sm:px-7 sm:pt-5">
      {/* Subtle ambient leaves — clipped via inset positioning so they
          stay inside the rounded card without needing overflow-hidden
          (which would also clip the sound popover). */}
      <svg
        aria-hidden
        className="pointer-events-none absolute left-2 top-2 h-16 w-16 text-emerald-900/15"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M50 10 Q 30 30 50 50 Q 70 30 50 10 Z" />
        <path d="M30 40 Q 15 55 30 70 Q 45 55 30 40 Z" />
      </svg>
      <svg
        aria-hidden
        className="pointer-events-none absolute right-2 bottom-2 h-20 w-20 rotate-180 text-emerald-900/15"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M50 10 Q 30 30 50 50 Q 70 30 50 10 Z" />
        <path d="M30 40 Q 15 55 30 70 Q 45 55 30 40 Z" />
      </svg>

      {/* Top bar */}
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
        <div className="relative h-[280px] w-[280px] sm:h-[300px] sm:w-[300px]">
          <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="ring-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3a8a4c" />
                <stop offset="100%" stopColor="#1a4d2a" />
              </linearGradient>
            </defs>
            {/* Track */}
            <circle
              cx={150}
              cy={150}
              r={radius}
              fill="none"
              stroke="rgba(31,77,44,0.14)"
              strokeWidth={14}
            />
            {/* Progress arc */}
            <circle
              cx={150}
              cy={150}
              r={radius}
              fill="none"
              stroke="url(#ring-grad)"
              strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 150 150)"
              style={{ transition: running ? "none" : "stroke-dashoffset 0.5s ease" }}
            />
            {/* Dot */}
            <circle cx={dotX} cy={dotY} r={10} fill="#fff" stroke="#1a4d2a" strokeWidth={3} />
          </svg>
          {/* Sheep disc — sized so the ring clearly breathes around it */}
          <div className="absolute inset-[20%] flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#6ea866] to-[#4a7044] shadow-[inset_0_4px_12px_rgba(0,0,0,0.18)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/studypuff-sheep.png"
              alt=""
              className={`h-[82%] w-[82%] object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)] ${running ? "animate-breathe" : ""}`}
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

        {/* Mode tabs */}
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

        {/* Custom min:sec input */}
        {mode === "custom" && (
          <div className="mt-3 flex items-center gap-2 rounded-full bg-cream-50 px-3 py-1.5 shadow-soft">
            <label className="text-xs font-semibold text-ink-700">Min</label>
            <input
              type="number"
              min={0}
              max={240}
              value={customMinutes}
              onChange={(e) => setCustomMinutes(Math.max(0, Math.min(240, Number(e.target.value) || 0)))}
              className="w-12 rounded-full bg-transparent text-center text-sm font-semibold tabular-nums text-ink-900 outline-none"
            />
            <span className="text-ink-700">:</span>
            <input
              type="number"
              min={0}
              max={59}
              value={customSeconds}
              onChange={(e) => setCustomSeconds(Math.max(0, Math.min(59, Number(e.target.value) || 0)))}
              className="w-12 rounded-full bg-transparent text-center text-sm font-semibold tabular-nums text-ink-900 outline-none"
            />
            <label className="text-xs font-semibold text-ink-700">Sec</label>
          </div>
        )}

        {/* Sound popover trigger */}
        <div className="relative mt-3">
          <button
            type="button"
            onClick={() => setSoundOpen((o) => !o)}
            className="inline-flex items-center gap-2 rounded-full bg-cream-50/80 px-4 py-1.5 text-xs font-semibold text-ink-900 shadow-soft transition hover:bg-cream-50"
            aria-haspopup="listbox"
            aria-expanded={soundOpen}
          >
            <Music className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            {selectedSoundLabel}
            <ChevronDown
              className={`h-3.5 w-3.5 transition ${soundOpen ? "rotate-180" : ""}`}
              strokeWidth={1.75}
              aria-hidden
            />
          </button>
          {soundOpen && (
            <div
              role="listbox"
              className="absolute left-1/2 top-full z-30 mt-2 w-56 -translate-x-1/2 overflow-hidden rounded-2xl border border-ink-900/10 bg-cream-50 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)]"
            >
              {SOUND_OPTIONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  role="option"
                  aria-selected={sessionSound === s.id}
                  onClick={() => {
                    setSessionSound(s.id);
                    setSoundOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition hover:bg-cream-100 ${
                    sessionSound === s.id ? "font-semibold text-ink-900" : "text-ink-900/80"
                  }`}
                >
                  <span>{s.label}</span>
                  {sessionSound === s.id && <Check className="h-4 w-4" strokeWidth={2} aria-hidden />}
                </button>
              ))}
            </div>
          )}
        </div>
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
            <div className="absolute bottom-full left-1/2 z-20 mb-2 w-80 -translate-x-1/2 rounded-2xl border border-ink-900/10 bg-cream-50 p-4 text-left shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)]">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-700">Topic</p>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="mb-2 w-full rounded-xl border border-ink-900/15 bg-cream-100 px-3 py-2 text-sm"
              >
                <option value="">General study</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              {onCreateTopic && (
                <div className="mb-3 flex gap-1.5">
                  <input
                    type="text"
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTopic();
                      }
                    }}
                    placeholder="+ New topic"
                    disabled={creating}
                    className="flex-1 rounded-xl border border-dashed border-ink-900/20 bg-transparent px-3 py-1.5 text-xs disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={handleAddTopic}
                    disabled={!newTopicName.trim() || creating}
                    className="inline-flex items-center gap-1 rounded-xl bg-ink-900 px-3 py-1.5 text-xs font-semibold text-cream-50 disabled:opacity-40"
                  >
                    {creating ? (
                      <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2.5} />
                    ) : (
                      <Plus className="h-3 w-3" strokeWidth={2.5} />
                    )}
                    Add
                  </button>
                </div>
              )}

              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-700">Task</p>
              <select
                value={taskId}
                onChange={(e) => setTaskId(e.target.value)}
                className="mb-2 w-full rounded-xl border border-ink-900/15 bg-cream-100 px-3 py-2 text-sm"
              >
                <option value="">No specific task</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.text}
                  </option>
                ))}
              </select>
              {onCreateTask && (
                <div className="mb-3 flex gap-1.5">
                  <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTask();
                      }
                    }}
                    placeholder={topicId ? "+ New task in this topic" : "+ New task"}
                    disabled={creating}
                    className="flex-1 rounded-xl border border-dashed border-ink-900/20 bg-transparent px-3 py-1.5 text-xs disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={handleAddTask}
                    disabled={!newTaskText.trim() || creating}
                    className="inline-flex items-center gap-1 rounded-xl bg-ink-900 px-3 py-1.5 text-xs font-semibold text-cream-50 disabled:opacity-40"
                  >
                    {creating ? (
                      <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2.5} />
                    ) : (
                      <Plus className="h-3 w-3" strokeWidth={2.5} />
                    )}
                    Add
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setTaskPickerOpen(false)}
                className="mt-2 block w-full rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-cream-50"
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
          aria-label="Reset timer"
          title="Reset timer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-50 text-ink-900 shadow-soft transition hover:bg-cream-100 active:scale-[0.95]"
        >
          <RotateCcw className="h-4 w-4" strokeWidth={2} aria-hidden />
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

      <AmbientPlayer sound={sessionSound} playing={running} />
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
