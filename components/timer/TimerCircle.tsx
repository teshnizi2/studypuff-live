"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play } from "lucide-react";
import type { StudyMode } from "@/lib/supabase/database.types";
import { TimePicker } from "./TimePicker";
import { InlineSoundChooser } from "@/components/dashboard/InlineSoundChooser";

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
  onModeChange?: (mode: StudyMode) => void;
  /** Last 7 days in chronological order, ending today. Used for the dashboard sparkline. */
  weekly?: { date: string; minutes: number }[];
  /** Ambient sound state — same source the room timer uses, so the dashboard
   *  looks identical in/out of a room. The floating SoundDock is gone now. */
  sound?: string | null;
  soundPlaying?: boolean;
  onTogglePlaySound?: () => void;
  onSelectSound?: (id: string | null) => void;
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
  onModeChange,
  weekly,
  sound = null,
  soundPlaying = false,
  onTogglePlaySound,
  onSelectSound
}: Props) {
  const [mode, setMode] = useState<StudyMode>("focus");
  const [celebrate, setCelebrate] = useState(false);
  // Commit-or-forfeit: there is no pause/stop. `confirmAbandon` gates the only
  // exit — giving up early, which forfeits the in-progress session's coins.
  const [confirmAbandon, setConfirmAbandon] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(focusMinutes * 60);
  const [remaining, setRemaining] = useState(focusMinutes * 60);
  const tickRef = useRef<NodeJS.Timeout | null>(null);

  // Notify parent when mode changes (for per-mode sounds, etc.)
  useEffect(() => {
    if (onModeChange) onModeChange(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Single setter that keeps total + remaining in sync. Avoids the visual
  // flicker that happens when you change the preset and the SVG renders one
  // frame with the new total but the old remaining (gives a wrong dashOffset).
  const setDuration = useCallback((total: number) => {
    setTotalSeconds(total);
    setRemaining(total);
    onRunningChange(false);
  }, [onRunningChange]);

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
    // A quiet, on-brand reward: a few leaves unfurl when a FOCUS block lands
    // (never on breaks — the celebration marks earned focus, not a pause).
    if (mode === "focus") {
      setCelebrate(true);
      window.setTimeout(() => setCelebrate(false), 1300);
    }
  }, [mode, taskId, topicId, tasks, topics, totalSeconds, onComplete, onRunningChange]);

  // Giving up resets the clock WITHOUT calling handleComplete, so nothing is
  // logged and this session's coins are forfeited. Saved balance is untouched.
  const abandon = () => { onRunningChange(false); setRemaining(totalSeconds); setConfirmAbandon(false); };

  const setPreset = (m: StudyMode, mins: number) => {
    setMode(m);
    setDuration(mins * 60);
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
      {/* Screen-reader timer announcement. Text only changes per minute (and
          on play/pause), so aria-live fires at a sane cadence, not per-second. */}
      <p className="sr-only" role="timer" aria-live="polite">
        {running
          ? `${mode} session, ${mm} minute${mm === 1 ? "" : "s"} remaining`
          : `${mode} timer ready, ${mm} minute${mm === 1 ? "" : "s"}`}
      </p>

      {/* Sheep ring — floating, no card */}
      <div className="relative">
        {celebrate && <Celebration />}
        {/* Always-on soft halo for depth; a second breathing layer blooms
            when the timer runs (doubles as a calm breathing cue). */}
        <div aria-hidden className="absolute inset-0 -z-10 rounded-full halo-sage blur-2xl" />
        <div
          aria-hidden
          className={`absolute inset-[-6%] -z-10 rounded-full halo-sage blur-3xl transition-opacity duration-700 ${
            running ? "animate-halo opacity-100" : "opacity-0"
          }`}
        />
        <div className="relative h-[240px] w-[240px] sm:h-[260px] sm:w-[260px]">
          <svg viewBox="0 0 320 320" className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="ring-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#5fbf6f" />
                <stop offset="55%"  stopColor="#3a8a4c" />
                <stop offset="100%" stopColor="#1a4d2a" />
              </linearGradient>
              {/* Soft glow for the progress head spark. */}
              <filter id="head-glow" x="-120%" y="-120%" width="340%" height="340%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx={160} cy={160} r={radius} fill="none"
              stroke="rgba(31,77,44,0.10)" strokeWidth={12} />
            <circle cx={160} cy={160} r={radius} fill="none"
              stroke="url(#ring-grad)" strokeWidth={12} strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={dashOffset}
              transform="rotate(-90 160 160)"
              style={{ transition: running ? "none" : "stroke-dashoffset 0.5s ease" }} />
            {/* Glowing progress head — a soft bloom under a crisp dot. */}
            {progress > 0.001 && (
              <g filter="url(#head-glow)">
                <circle cx={dotX} cy={dotY} r={10} fill="#a8e6b0" opacity={0.95} />
                <circle cx={dotX} cy={dotY} r={6.5} fill="#fff" stroke="#1a4d2a" strokeWidth={2.5} />
              </g>
            )}
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
      <div className="mt-5">
        <TimePicker minutes={mm} seconds={ss} disabled={running} onChange={setDuration} />
      </div>

      {/* Preset chips — minimal italic, dot-separated */}
      <div className="mt-2 flex items-center gap-3 text-sm">
        {presets.map((p, i) => (
          <span key={p.id} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-ink-900/25" />}
            <button
              type="button"
              onClick={() => setPreset(p.id, p.mins)}
              disabled={running}
              title={running ? "Finish or give up this session before changing length" : undefined}
              className={`font-display italic transition draw-underline ${
                activePresetId === p.id
                  ? "font-semibold text-ink-900"
                  : "text-ink-700 hover:text-ink-900"
              } ${running ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {p.label} <span className="text-ink-700/60">· {p.mins}m</span>
            </button>
          </span>
        ))}
      </div>

      {/* Commit-or-finish controls — no pause, no stop. Coins bank ONLY when a
          session completes; giving up early forfeits just this session's coins
          (your saved balance is never touched). */}
      <div className="mt-6 flex min-h-[96px] flex-col items-center justify-center gap-3">
        {!running ? (
          <>
            <button
              type="button"
              onClick={() => { setConfirmAbandon(false); onRunningChange(true); }}
              aria-label="Start focus session"
              className="group relative flex h-[76px] w-[76px] items-center justify-center rounded-full bg-ink-900 text-cream-50 shadow-[0_24px_55px_-18px_rgba(31,77,44,0.55)] transition hover:-translate-y-0.5 hover:bg-ink-700 active:translate-y-0 active:scale-[0.96]"
            >
              <span aria-hidden className="pointer-events-none absolute inset-[-6px] rounded-full ring-1 ring-emerald-700/0 transition group-hover:ring-emerald-700/20" />
              <Play className="ml-0.5 h-7 w-7 fill-current" strokeWidth={0} />
            </button>
            <p className="max-w-[260px] text-center text-[10px] uppercase tracking-[0.18em] text-ink-700/60">
              Once you start, see it through — coins only land when you finish.
            </p>
          </>
        ) : confirmAbandon ? (
          <div className="flex flex-col items-center gap-2.5">
            <p className="text-center font-display text-sm italic text-ink-900">
              Give up now? You&apos;ll lose this session&apos;s coins.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={abandon}
                className="rounded-full bg-rose-600 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cream-50 transition hover:bg-rose-700 active:scale-95"
              >
                Give up
              </button>
              <button
                type="button"
                onClick={() => setConfirmAbandon(false)}
                className="rounded-full border border-ink-900/20 bg-cream-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-900 transition hover:border-ink-900/40 active:scale-95"
              >
                Keep going
              </button>
            </div>
          </div>
        ) : (
          <>
            <div
              aria-label="Focusing — no pausing"
              className="relative flex h-[76px] w-[76px] items-center justify-center rounded-full bg-ink-900 text-cream-50 shadow-[0_24px_55px_-18px_rgba(31,77,44,0.55)]"
            >
              <span aria-hidden className="absolute inset-[-6px] rounded-full ring-1 ring-emerald-700/25 animate-halo" />
              <span aria-hidden className="h-3 w-3 rounded-full bg-emerald-400 animate-breathe" />
            </div>
            <button
              type="button"
              onClick={() => setConfirmAbandon(true)}
              className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-700/55 underline-offset-4 transition hover:text-rose-600 hover:underline"
            >
              Give up session
            </button>
          </>
        )}
      </div>

      {/* Today's gauge */}
      <div className="mt-6 w-full max-w-[300px]">
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

      {/* Weekly sparkline — small bars under the today gauge */}
      {weekly && weekly.length > 0 && (
        <div className="mt-4 w-full max-w-[300px]">
          <div className="mb-1 flex items-baseline justify-between text-[10px] uppercase tracking-[0.28em] text-ink-700">
            <span>this week</span>
            <span className="tabular-nums text-ink-700/70">
              {weekly.reduce((a, d) => a + d.minutes, 0)}m
            </span>
          </div>
          <WeeklySparkline data={weekly} />
        </div>
      )}

      {/* Sound chooser — same shape as the room timer's. The floating
          SoundDock is hidden now, so this is the only sound control. */}
      {onTogglePlaySound && onSelectSound && (
        <InlineSoundChooser
          sound={sound}
          playing={soundPlaying}
          onTogglePlay={onTogglePlaySound}
          onSelect={onSelectSound}
        />
      )}
    </div>
  );
}

function WeeklySparkline({ data }: { data: { date: string; minutes: number }[] }) {
  const max = Math.max(60, ...data.map((d) => d.minutes));
  const todayIdx = data.length - 1;
  return (
    <div className="flex h-12 items-end justify-between gap-1">
      {data.map((d, i) => {
        const h = d.minutes === 0 ? 4 : Math.max(6, (d.minutes / max) * 44);
        const isToday = i === todayIdx;
        const day = new Date(d.date + "T00:00:00").toLocaleDateString(undefined, { weekday: "narrow" });
        return (
          <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`w-full rounded-md ${isToday
                ? "bg-emerald-700"
                : d.minutes > 0
                  ? "bg-emerald-700/35"
                  : "bg-ink-900/10"}`}
              style={{ height: `${h}px` }}
              title={`${d.date}: ${d.minutes}m`}
            />
            <span className={`text-[9px] tabular-nums ${isToday ? "font-semibold text-ink-900" : "text-ink-700/60"}`}>
              {day}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// A brief, gentle leaf flourish around the ring when a focus block completes.
// Eight leaves fan upward-and-out, fade as they go. Uses the shared
// `animate-leaf-burst` keyframe (reduced-motion-safe via the global override).
function Celebration() {
  const leaves = Array.from({ length: 8 }, (_, i) => {
    const ang = ((-110 + i * 30) * Math.PI) / 180;
    const dist = 78 + (i % 3) * 20;
    return {
      lx: Math.round(Math.cos(ang) * dist),
      ly: Math.round(Math.sin(ang) * dist - 24),
      lr: (i * 53) % 360,
      delay: i * 35,
      hue: i % 2 ? "#3a8a4c" : "#5fbf6f"
    };
  });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      {leaves.map((l, i) => (
        <span
          key={i}
          className="animate-leaf-burst absolute"
          style={{
            ["--lx" as string]: `${l.lx}px`,
            ["--ly" as string]: `${l.ly}px`,
            ["--lr" as string]: `${l.lr}deg`,
            animationDelay: `${l.delay}ms`
          }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 drop-shadow-[0_2px_3px_rgba(26,77,42,0.25)]">
            <path
              d="M12 2C7 6 4.5 10.5 4.5 15.5c0 3.3 2.2 5.8 7.5 5.8 0-5.5-1.8-9.5-1.8-9.5s3.6 2.8 5.6 7.6c2.3-3.9 2.4-11.6-3.8-17.4Z"
              fill={l.hue}
            />
          </svg>
        </span>
      ))}
    </div>
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
