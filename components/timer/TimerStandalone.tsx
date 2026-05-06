"use client";

import { useEffect, useState } from "react";
import { TimerCircle } from "./TimerCircle";
import { SoundDock, type TimerSoundMode } from "@/components/dashboard/SoundDock";

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
  onComplete: (form: FormData) => Promise<void>;
  equippedSound?: string | null;
  equippedAccessory?: string | null;
};

export function TimerStandalone(p: Props) {
  const [running, setRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<TimerSoundMode>("focus");
  const defaultSound = p.equippedSound ?? "sound-lofi";
  const [soundsByMode, setSoundsByMode] = useState<Record<TimerSoundMode, string | null>>({
    focus: defaultSound,
    short: "sound-rain",
    long: "sound-ocean"
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("studypuff:sounds-by-mode");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        setSoundsByMode((prev) => ({
          focus: typeof parsed.focus !== "undefined" ? parsed.focus : prev.focus,
          short: typeof parsed.short !== "undefined" ? parsed.short : prev.short,
          long:  typeof parsed.long  !== "undefined" ? parsed.long  : prev.long
        }));
      }
    } catch { /* ignore */ }
  }, []);

  const persist = (next: Record<TimerSoundMode, string | null>) => {
    setSoundsByMode(next);
    if (typeof window !== "undefined") {
      try { window.localStorage.setItem("studypuff:sounds-by-mode", JSON.stringify(next)); }
      catch { /* ignore */ }
    }
  };

  const sound = soundsByMode[timerMode];

  return (
    <>
      <TimerCircle
        focusMinutes={p.focusMinutes}
        shortBreakMinutes={p.shortBreakMinutes}
        longBreakMinutes={p.longBreakMinutes}
        todayMinutes={p.todayMinutes}
        dailyGoalMinutes={p.dailyGoalMinutes}
        tasks={p.tasks}
        topics={p.topics}
        taskId=""
        topicId=""
        running={running}
        onRunningChange={setRunning}
        onComplete={p.onComplete}
        equippedAccessory={p.equippedAccessory}
        onModeChange={(m) => setTimerMode(m as TimerSoundMode)}
      />
      <SoundDock
        sound={sound}
        playing={running && !!sound}
        onSelect={(id) => persist({ ...soundsByMode, [timerMode]: id })}
        onTogglePlay={() => setRunning((r) => !r)}
        timerMode={timerMode}
        soundsByMode={soundsByMode}
        onSelectForMode={(m, id) => persist({ ...soundsByMode, [m]: id })}
      />
    </>
  );
}
