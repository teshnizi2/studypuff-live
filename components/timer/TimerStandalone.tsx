"use client";

import { useState } from "react";
import { TimerCircle } from "./TimerCircle";
import { SoundDock } from "@/components/dashboard/SoundDock";

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
  const [sound, setSound] = useState<string | null>(p.equippedSound ?? "sound-lofi");

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
      />
      <SoundDock
        sound={sound}
        playing={running && !!sound}
        onSelect={setSound}
        onTogglePlay={() => setRunning((r) => !r)}
      />
    </>
  );
}
