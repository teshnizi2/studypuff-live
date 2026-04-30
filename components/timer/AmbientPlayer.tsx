"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  sound: string | null;
  playing: boolean;
};

// Synthesised ambience — no audio files required. Each sound is a small
// WebAudio graph based on coloured noise + light modulation. Quality is
// modest by design; we can swap in recorded loops later without changing
// callers.
export function AmbientPlayer({ sound, playing }: Props) {
  const ctxRef = useRef<AudioContext | null>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const [muted, setMuted] = useState(false);
  const masterRef = useRef<GainNode | null>(null);

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
    master.gain.value = muted ? 0 : 0.18;
    master.connect(ctx.destination);
    masterRef.current = master;
    stopRef.current = startAmbient(ctx, sound, master);
  }, [sound, playing, muted]);

  useEffect(() => {
    if (masterRef.current) {
      masterRef.current.gain.value = muted ? 0 : 0.18;
    }
  }, [muted]);

  if (!sound || !playing) return null;

  return (
    <button
      type="button"
      onClick={() => setMuted((m) => !m)}
      className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full bg-cream-50/95 px-4 py-2 text-sm font-semibold text-ink-900 shadow-soft ring-1 ring-ink-900/10 backdrop-blur"
      aria-label={muted ? "Unmute ambient sound" : "Mute ambient sound"}
      title={muted ? "Click to unmute" : "Click to mute"}
    >
      <span aria-hidden>{muted ? "🔇" : "🔊"}</span>
      Ambient
    </button>
  );
}

function startAmbient(ctx: AudioContext, soundId: string, master: GainNode): () => void {
  const cleanups: Array<() => void> = [];

  const noise = createNoiseSource(ctx, "pink");
  const tone = ctx.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = 4000;
  tone.Q.value = 0.7;
  noise.connect(tone).connect(master);
  noise.start();
  cleanups.push(() => {
    try {
      noise.stop();
    } catch {
      /* noop */
    }
  });

  if (soundId === "sound-rain") {
    tone.frequency.value = 2200;
    // Light shimmer of higher band noise on top
    const high = createNoiseSource(ctx, "white");
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 2500;
    const hg = ctx.createGain();
    hg.gain.value = 0.05;
    high.connect(hp).connect(hg).connect(master);
    high.start();
    cleanups.push(() => {
      try {
        high.stop();
      } catch {
        /* noop */
      }
    });
  } else if (soundId === "sound-library") {
    tone.frequency.value = 1500;
    master.gain.value *= 0.6;
    cleanups.push(scheduleClicks(ctx, master, 0.035, [12_000, 35_000]));
  } else if (soundId === "sound-forest") {
    tone.frequency.value = 1800;
    cleanups.push(scheduleBirds(ctx, master));
  } else if (soundId === "sound-cafe") {
    tone.frequency.value = 1200;
    cleanups.push(scheduleClicks(ctx, master, 0.07, [3000, 9000]));
  } else if (soundId === "sound-fire") {
    tone.frequency.value = 1300;
    cleanups.push(scheduleClicks(ctx, master, 0.12, [400, 2500]));
  } else if (soundId === "sound-ocean") {
    tone.frequency.value = 900;
    // Slow LFO on a gain to simulate waves
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.4;
    tone.disconnect();
    tone.connect(lfoGain).connect(master);
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.12;
    const lfoAmp = ctx.createGain();
    lfoAmp.gain.value = 0.3;
    lfo.connect(lfoAmp).connect(lfoGain.gain);
    lfo.start();
    cleanups.push(() => {
      try {
        lfo.stop();
      } catch {
        /* noop */
      }
    });
  }

  return () => {
    for (const c of cleanups) c();
  };
}

function createNoiseSource(ctx: AudioContext, kind: "white" | "pink"): AudioBufferSourceNode {
  const length = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  if (kind === "white") {
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
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

function scheduleClicks(
  ctx: AudioContext,
  master: GainNode,
  amp: number,
  range: [number, number]
): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let stopped = false;
  const tick = () => {
    if (stopped) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "triangle";
    o.frequency.value = 200 + Math.random() * 400;
    g.gain.value = 0;
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(amp, ctx.currentTime + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
    o.connect(g).connect(master);
    o.start();
    o.stop(ctx.currentTime + 0.2);
    const next = range[0] + Math.random() * (range[1] - range[0]);
    timer = setTimeout(tick, next);
  };
  timer = setTimeout(tick, range[0]);
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
    const base = 1500 + Math.random() * 1200;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(base, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(base * 1.25, ctx.currentTime + 0.12);
    g.gain.value = 0;
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    o.connect(g).connect(master);
    o.start();
    o.stop(ctx.currentTime + 0.3);
    timer = setTimeout(tick, 6000 + Math.random() * 16000);
  };
  timer = setTimeout(tick, 4000);
  return () => {
    stopped = true;
    if (timer) clearTimeout(timer);
  };
}
