"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  sound: string | null;
  playing: boolean;
};

// Lower-noise, calmer synthesised ambience. Each preset has a softer
// volume target and gentler filtering than the first iteration. We can
// swap any of these for a recorded audio loop later by adding a file
// to /public/sounds and toggling on `useFile` in startAmbient.
const MASTER_GAIN = 0.08;

export function AmbientPlayer({ sound, playing }: Props) {
  const ctxRef = useRef<AudioContext | null>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    return () => {
      if (stopRef.current) stopRef.current();
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
        ctxRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const teardown = () => {
      if (stopRef.current) {
        stopRef.current();
        stopRef.current = null;
      }
    };
    if (!playing || !sound) {
      teardown();
      return;
    }
    let ctx = ctxRef.current;
    if (!ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      ctx = new Ctor();
      ctxRef.current = ctx;
    }
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    teardown();
    const master = ctx.createGain();
    master.gain.value = muted ? 0 : MASTER_GAIN;
    master.connect(ctx.destination);
    masterRef.current = master;
    stopRef.current = startAmbient(ctx, sound, master);
  }, [sound, playing, muted]);

  useEffect(() => {
    const m = masterRef.current;
    if (m) m.gain.value = muted ? 0 : MASTER_GAIN;
  }, [muted]);

  if (!sound || !playing) return null;
  return (
    <button
      type="button"
      onClick={() => setMuted((m) => !m)}
      className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full bg-cream-50/95 px-4 py-2 text-sm font-semibold text-ink-900 shadow-soft ring-1 ring-ink-900/10 backdrop-blur"
      aria-label={muted ? "Unmute ambient sound" : "Mute ambient sound"}
    >
      <span aria-hidden>{muted ? "🔇" : "🔊"}</span>
      Ambient
    </button>
  );
}

function startAmbient(ctx: AudioContext, soundId: string, master: GainNode): () => void {
  const cleanups: Array<() => void> = [];

  // Lo-fi is a melodic preset (no noise base)
  if (soundId === "sound-lofi") {
    cleanups.push(...startLoFi(ctx, master));
    return () => cleanups.forEach((c) => c());
  }

  // All other presets are softly-shaped brown noise
  const noise = createNoiseSource(ctx, "brown");
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1200;
  lp.Q.value = 0.7;
  const gain = ctx.createGain();
  gain.gain.value = 0.5;
  noise.connect(lp).connect(gain).connect(master);
  noise.start();
  cleanups.push(() => {
    try {
      noise.stop();
    } catch {
      /* noop */
    }
  });

  // Slow LFO on overall gain for natural variation
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoAmp = ctx.createGain();
  lfoAmp.gain.value = 0.18;
  const lfoBias = ctx.createConstantSource();
  lfoBias.offset.value = 0.5;
  lfoBias.start();
  lfo.connect(lfoAmp).connect(gain.gain);
  lfo.start();
  cleanups.push(() => {
    try {
      lfo.stop();
      lfoBias.stop();
    } catch {
      /* noop */
    }
  });

  if (soundId === "sound-rain") {
    lp.frequency.value = 1800;
    // soft droplets
    cleanups.push(scheduleDroplets(ctx, master, [200, 700], 0.04, 1500, 4500));
  } else if (soundId === "sound-library") {
    lp.frequency.value = 700;
    gain.gain.value = 0.35;
    cleanups.push(scheduleDroplets(ctx, master, [300, 600], 0.02, 14_000, 30_000));
  } else if (soundId === "sound-forest") {
    lp.frequency.value = 1000;
    cleanups.push(scheduleBirds(ctx, master));
  } else if (soundId === "sound-cafe") {
    lp.frequency.value = 900;
    cleanups.push(scheduleDroplets(ctx, master, [150, 350], 0.03, 4000, 12_000));
  } else if (soundId === "sound-fire") {
    lp.frequency.value = 1100;
    cleanups.push(scheduleDroplets(ctx, master, [400, 1200], 0.05, 700, 3000));
  } else if (soundId === "sound-ocean") {
    lp.frequency.value = 600;
    // Bigger LFO for wave swells
    const wave = ctx.createOscillator();
    wave.frequency.value = 0.1;
    const waveAmp = ctx.createGain();
    waveAmp.gain.value = 0.45;
    wave.connect(waveAmp).connect(lp.frequency);
    wave.start();
    cleanups.push(() => {
      try {
        wave.stop();
      } catch {
        /* noop */
      }
    });
  }

  return () => cleanups.forEach((c) => c());
}

function startLoFi(ctx: AudioContext, master: GainNode): Array<() => void> {
  // Soft chord pad: 4-note progression cycling on a slow tempo
  const cleanups: Array<() => void> = [];
  // Cmaj7 → Am7 → Fmaj7 → G7 (typical lo-fi loop, in low octave)
  const PROG = [
    [130.81, 164.81, 196.0, 246.94],
    [110.0, 130.81, 164.81, 196.0],
    [87.31, 130.81, 174.61, 220.0],
    [98.0, 123.47, 146.83, 196.0]
  ];
  const padGain = ctx.createGain();
  padGain.gain.value = 0;
  padGain.connect(master);

  // Soft warmth filter
  const warm = ctx.createBiquadFilter();
  warm.type = "lowpass";
  warm.frequency.value = 1400;
  warm.Q.value = 0.5;
  padGain.connect(warm);

  let stopped = false;
  let chordIdx = 0;

  const beatMs = 2200;
  const playChord = () => {
    if (stopped) return;
    const notes = PROG[chordIdx % PROG.length];
    const oscs: OscillatorNode[] = [];
    const gains: GainNode[] = [];
    const now = ctx.currentTime;
    notes.forEach((freq) => {
      const o = ctx.createOscillator();
      o.type = "triangle";
      o.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.2, now + 0.4);
      g.gain.linearRampToValueAtTime(0.1, now + (beatMs / 1000) * 0.6);
      g.gain.linearRampToValueAtTime(0, now + beatMs / 1000);
      o.connect(g).connect(warm).connect(master);
      o.start();
      o.stop(now + beatMs / 1000 + 0.05);
      oscs.push(o);
      gains.push(g);
    });
    cleanups.push(() => {
      oscs.forEach((o) => {
        try {
          o.stop();
        } catch {
          /* noop */
        }
      });
    });
    chordIdx++;
  };

  playChord();
  const interval = setInterval(playChord, beatMs);
  cleanups.push(() => {
    stopped = true;
    clearInterval(interval);
  });
  return cleanups;
}

function createNoiseSource(ctx: AudioContext, kind: "white" | "pink" | "brown"): AudioBufferSourceNode {
  const length = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  if (kind === "white") {
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  } else if (kind === "brown") {
    let last = 0;
    for (let i = 0; i < length; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      data[i] = last * 3.5;
    }
  } else {
    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0;
    for (let i = 0; i < length; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + w * 0.0555179;
      b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.969 * b2 + w * 0.153852;
      b3 = 0.8665 * b3 + w * 0.3104856;
      b4 = 0.55 * b4 + w * 0.5329522;
      b5 = -0.7616 * b5 - w * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
      b6 = w * 0.115926;
    }
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  return src;
}

function scheduleDroplets(
  ctx: AudioContext,
  master: GainNode,
  freqRange: [number, number],
  amp: number,
  minDelay: number,
  maxDelay: number
): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let stopped = false;
  const tick = () => {
    if (stopped) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1500;
    o.type = "sine";
    o.frequency.value = freqRange[0] + Math.random() * (freqRange[1] - freqRange[0]);
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(amp, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    o.connect(lp).connect(g).connect(master);
    o.start();
    o.stop(ctx.currentTime + 0.3);
    timer = setTimeout(tick, minDelay + Math.random() * (maxDelay - minDelay));
  };
  timer = setTimeout(tick, minDelay);
  return () => {
    stopped = true;
    if (timer) clearTimeout(timer);
  };
}

function scheduleBirds(ctx: AudioContext, master: GainNode): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let stopped = false;
  const tick = () => {
    if (stopped) return;
    const base = 1500 + Math.random() * 1000;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(base, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(base * 1.2, ctx.currentTime + 0.1);
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    o.connect(g).connect(master);
    o.start();
    o.stop(ctx.currentTime + 0.3);
    timer = setTimeout(tick, 8000 + Math.random() * 18_000);
  };
  timer = setTimeout(tick, 5000);
  return () => {
    stopped = true;
    if (timer) clearTimeout(timer);
  };
}
