"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronUp, Music, Pause, Play } from "lucide-react";
import { AmbientPlayer } from "@/components/timer/AmbientPlayer";

export type SoundOption = { id: string | null; label: string; tag?: string };

export const SOUND_OPTIONS: SoundOption[] = [
  { id: null,             label: "Silence",         tag: "calm"    },
  { id: "sound-lofi",     label: "Lo-fi pad",       tag: "music"   },
  { id: "sound-sweden",   label: "Sweden (C418)",   tag: "music"   },
  { id: "sound-hisaishi", label: "Hisaishi piano",  tag: "music"   },
  { id: "sound-satie",    label: "Satie waltz",     tag: "music"   },
  { id: "sound-rain",     label: "Soft rain",       tag: "ambient" },
  { id: "sound-library",  label: "Quiet library",   tag: "ambient" },
  { id: "sound-forest",   label: "Forest morning",  tag: "ambient" },
  { id: "sound-cafe",     label: "Cosy café",       tag: "ambient" },
  { id: "sound-fire",     label: "Fireplace",       tag: "ambient" },
  { id: "sound-ocean",    label: "Ocean waves",     tag: "ambient" }
];

type Props = {
  sound: string | null;
  playing: boolean;
  onSelect: (id: string | null) => void;
  onTogglePlay: () => void;
};

export function SoundDock({ sound, playing, onSelect, onTogglePlay }: Props) {
  const [open, setOpen] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);

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

  const current = SOUND_OPTIONS.find((s) => s.id === sound) || SOUND_OPTIONS[0];

  const groups: { title: string; tag: string }[] = [
    { title: "Music",   tag: "music" },
    { title: "Ambient", tag: "ambient" },
    { title: "Calm",    tag: "calm" }
  ];

  return (
    <>
      <AmbientPlayer sound={sound} playing={playing} />

      <div
        ref={dockRef}
        className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 select-none"
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
            className="animate-task-in absolute bottom-full left-1/2 mb-3 max-h-96 w-72 -translate-x-1/2 overflow-y-auto rounded-3xl bg-cream-50 shadow-[0_30px_80px_-20px_rgba(31,77,44,0.45)] ring-1 ring-ink-900/10"
          >
            {groups.map((g) => {
              const items = SOUND_OPTIONS.filter((s) => s.tag === g.tag);
              if (!items.length) return null;
              return (
                <div key={g.tag} className="px-2 py-2">
                  <p className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-700">
                    {g.title}
                  </p>
                  {items.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      role="option"
                      aria-selected={sound === s.id}
                      onClick={() => {
                        onSelect(s.id);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm transition ${
                        sound === s.id
                          ? "bg-ink-900 text-cream-50"
                          : "text-ink-900 hover:bg-cream-100"
                      }`}
                    >
                      <span className="font-display italic">{s.label}</span>
                      {sound === s.id && (
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
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
