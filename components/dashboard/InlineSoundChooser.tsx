"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Music, Pause, Play, VolumeX } from "lucide-react";
import { SOUND_OPTIONS } from "./SoundDock";

type Props = {
  sound: string | null;
  playing: boolean;
  onTogglePlay: () => void;
  onSelect: (id: string | null) => void;
};

// Compact sound picker rendered under both the solo and room timer. Same
// visual in both places so the dashboard reads identically when in a room
// vs out of one — only the timer-control buttons gate by ownership.
export function InlineSoundChooser({ sound, playing, onTogglePlay, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const current = sound
    ? SOUND_OPTIONS.find((s) => s.id === sound) ?? { id: null, label: "Off" }
    : { id: null, label: "Off" };

  const groups: { title: string; tag: string }[] = [
    { title: "Ambient", tag: "ambient" },
    { title: "Noise",   tag: "noise" }
  ];

  return (
    <div ref={ref} className="relative mt-4 flex items-center gap-2">
      <button
        type="button"
        onClick={onTogglePlay}
        disabled={!sound}
        className={`flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 text-cream-50 transition ${
          sound ? "hover:bg-ink-700 active:scale-95" : "cursor-not-allowed opacity-50"
        }`}
        aria-label={playing ? "Pause sound" : "Play sound"}
        title={sound ? (playing ? "Pause sound" : "Play sound") : "Pick a sound first"}
      >
        {sound ? (
          playing ? <Pause className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
                  : <Play  className="ml-0.5 h-3.5 w-3.5 fill-current" strokeWidth={0} />
        ) : (
          <VolumeX className="h-3.5 w-3.5" strokeWidth={1.75} />
        )}
      </button>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full bg-cream-50/90 px-3 py-1.5 text-[12px] text-ink-900 ring-1 ring-ink-900/10 transition hover:bg-cream-50"
        aria-expanded={open}
      >
        <Music className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
        <span className="max-w-[140px] truncate font-display italic">{current.label}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} strokeWidth={1.75} aria-hidden />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 w-[220px] rounded-2xl bg-cream-50/95 p-2 ring-1 ring-ink-900/10 shadow-[0_18px_50px_-15px_rgba(31,77,44,0.35)] backdrop-blur-md">
          <button
            type="button"
            onClick={() => { onSelect(null); setOpen(false); }}
            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition hover:bg-ink-900/5 ${
              sound === null ? "font-semibold text-ink-900" : "text-ink-700"
            }`}
          >
            <span>Off</span>
            {sound === null && <span aria-hidden>·</span>}
          </button>
          {groups.map((g) => (
            <div key={g.tag} className="mt-1">
              <p className="px-2.5 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-700/60">
                {g.title}
              </p>
              <ul>
                {SOUND_OPTIONS.filter((s) => s.tag === g.tag).map((s) => (
                  <li key={s.id ?? "off"}>
                    <button
                      type="button"
                      onClick={() => { onSelect(s.id); setOpen(false); }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition hover:bg-ink-900/5 ${
                        sound === s.id ? "font-semibold text-ink-900" : "text-ink-700"
                      }`}
                    >
                      <span>{s.label}</span>
                      {sound === s.id && <span aria-hidden>·</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
