"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronUp, Music, Pause, Play, VolumeX } from "lucide-react";
import { AmbientPlayer } from "@/components/timer/AmbientPlayer";

export type SoundOption = { id: string | null; label: string; tag?: string };

export type TimerSoundMode = "focus" | "short" | "long";

// Curated, ambient-only set. The previous procedural "music" tracks
// (chord progressions on synth oscillators) sounded thin and synthetic;
// these noise-based ambient soundscapes feel natural and are easier on
// the ears for long focus sessions.
export const SOUND_OPTIONS: SoundOption[] = [
  { id: "sound-rain",     label: "Soft rain",       tag: "ambient" },
  { id: "sound-ocean",    label: "Ocean waves",     tag: "ambient" },
  { id: "sound-forest",   label: "Forest morning",  tag: "ambient" },
  { id: "sound-cafe",     label: "Cosy café",       tag: "ambient" },
  { id: "sound-fire",     label: "Fireplace",       tag: "ambient" },
  { id: "sound-library",  label: "Quiet library",   tag: "ambient" },
  { id: "sound-brown",    label: "Brown noise",     tag: "noise"   },
  { id: "sound-pink",     label: "Pink noise",      tag: "noise"   },
  { id: "sound-white",    label: "White noise",     tag: "noise"   }
];

const MODE_LABEL: Record<TimerSoundMode, string> = {
  focus: "Focus",
  short: "Short break",
  long: "Long break"
};

type Props = {
  sound: string | null;
  playing: boolean;
  onSelect: (id: string | null) => void;
  onTogglePlay: () => void;
  // Optional per-mode controls. When provided the panel exposes a mode tab strip
  // and selecting a sound updates the slot for the active editing mode.
  timerMode?: TimerSoundMode;
  soundsByMode?: Record<TimerSoundMode, string | null>;
  onSelectForMode?: (mode: TimerSoundMode, id: string | null) => void;
};

export function SoundDock({
  sound, playing, onSelect, onTogglePlay,
  timerMode, soundsByMode, onSelectForMode
}: Props) {
  const [open, setOpen] = useState(false);
  const [editingMode, setEditingMode] = useState<TimerSoundMode>(timerMode ?? "focus");
  const dockRef = useRef<HTMLDivElement>(null);
  const perModeEnabled = !!(soundsByMode && onSelectForMode);

  // When the timer mode changes externally, follow it in the panel header.
  useEffect(() => {
    if (timerMode) setEditingMode(timerMode);
  }, [timerMode]);

  // Sound currently being edited in the dropdown — defaults to the active sound,
  // but switches when the user clicks a mode tab.
  const editingSound = perModeEnabled ? (soundsByMode![editingMode] ?? null) : sound;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Sound is "off" when id is null. Preserve label so the dock shows
  // either the active sound or "Off".
  const current =
    sound === null
      ? { id: null, label: "Off" }
      : SOUND_OPTIONS.find((s) => s.id === sound) || { id: null, label: "Off" };

  const groups: { title: string; tag: string }[] = [
    { title: "Ambient", tag: "ambient" },
    { title: "Noise",   tag: "noise" }
  ];

  return (
    <>
      <AmbientPlayer sound={sound} playing={playing} />

      <div
        ref={dockRef}
        className="fixed bottom-6 right-6 z-40 select-none"
      >
        <div className="relative flex items-center gap-3 rounded-full bg-cream-50/85 px-3 py-2 pr-4 shadow-[0_18px_50px_-15px_rgba(31,77,44,0.35)] backdrop-blur-md ring-1 ring-ink-900/10">
          <button
            type="button"
            onClick={onTogglePlay}
            className="group flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-cream-50 transition hover:bg-ink-700 active:scale-95"
            aria-label={playing ? "Pause sound" : "Play sound"}
            title={playing ? "Pause sound" : "Play sound"}
          >
            {playing ? (
              <Pause className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
            ) : (
              <Play className="ml-0.5 h-3.5 w-3.5 fill-current" strokeWidth={0} />
            )}
          </button>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 text-left"
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <span className="flex h-3 w-4 items-end gap-[2px]">
              {playing && sound ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <span
                    key={i}
                    className="eq-bar w-[2px] flex-1 rounded-full bg-emerald-700"
                    style={{ height: `${[8, 12, 9, 11][i]}px` }}
                  />
                ))
              ) : (
                <Music className="h-4 w-4 text-ink-900/70" strokeWidth={1.75} />
              )}
            </span>
            <span className="font-display text-sm italic text-ink-900">
              {current.label}
            </span>
            <ChevronUp
              className={`h-4 w-4 text-ink-900/60 transition-transform duration-200 ${
                open ? "rotate-0" : "rotate-180"
              }`}
              strokeWidth={1.75}
            />
          </button>
        </div>

        {open && (
          <div
            role="listbox"
            className="animate-task-in absolute bottom-full right-0 mb-3 max-h-[26rem] w-72 overflow-hidden rounded-3xl bg-cream-50 shadow-[0_30px_80px_-20px_rgba(31,77,44,0.45)] ring-1 ring-ink-900/10"
          >
            {perModeEnabled && (
              <div className="border-b border-ink-900/10 px-3 pb-2 pt-3">
                <p className="px-1 pb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-700">
                  Sound for
                </p>
                <div className="flex items-center gap-1 rounded-full bg-ink-900/[0.04] p-1">
                  {(["focus", "short", "long"] as TimerSoundMode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setEditingMode(m)}
                      className={`flex-1 rounded-full px-3 py-1.5 text-xs font-display italic transition ${
                        editingMode === m
                          ? "bg-ink-900 text-cream-50"
                          : "text-ink-700 hover:text-ink-900"
                      }`}
                    >
                      {MODE_LABEL[m]}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="max-h-80 overflow-y-auto">
              {/* Top-level Off / Silence — always the first thing the user sees. */}
              <div className="px-2 pb-1 pt-2">
                <button
                  type="button"
                  role="option"
                  aria-selected={editingSound === null}
                  onClick={() => {
                    if (perModeEnabled) {
                      onSelectForMode!(editingMode, null);
                      if (editingMode === timerMode) onSelect(null);
                    } else {
                      onSelect(null);
                    }
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm transition ${
                    editingSound === null
                      ? "bg-ink-900 text-cream-50"
                      : "text-ink-900 hover:bg-cream-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <VolumeX className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                    <span className="font-display italic">Off (silence)</span>
                  </span>
                </button>
              </div>
              {groups.map((g) => {
                const items = SOUND_OPTIONS.filter((s) => s.tag === g.tag);
                if (!items.length) return null;
                return (
                  <div key={g.tag} className="px-2 py-2">
                    <p className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-700">
                      {g.title}
                    </p>
                    {items.map((s) => {
                      const selected = editingSound === s.id;
                      const isLive =
                        perModeEnabled
                          ? editingMode === timerMode && selected
                          : selected;
                      return (
                        <button
                          key={s.label}
                          type="button"
                          role="option"
                          aria-selected={selected}
                          onClick={() => {
                            if (perModeEnabled) {
                              onSelectForMode!(editingMode, s.id);
                              if (editingMode === timerMode) onSelect(s.id);
                            } else {
                              onSelect(s.id);
                            }
                            setOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm transition ${
                            selected
                              ? "bg-ink-900 text-cream-50"
                              : "text-ink-900 hover:bg-cream-100"
                          }`}
                        >
                          <span className="font-display italic">{s.label}</span>
                          {isLive && (
                            <span className="flex h-3 w-4 items-end gap-[2px]">
                              {Array.from({ length: 4 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={`eq-bar w-[2px] flex-1 rounded-full ${
                                    playing ? "bg-cream-50" : "bg-cream-50/40"
                                  }`}
                                  style={{ height: `${[8, 12, 9, 11][i]}px` }}
                                />
                              ))}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
