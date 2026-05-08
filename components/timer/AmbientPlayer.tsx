"use client";

import { useEffect, useRef, useState } from "react";

type Props = { sound: string | null; playing: boolean };

const MASTER_GAIN = 0.10;

export function AmbientPlayer({ sound, playing }: Props) {
  const ctxRef = useRef<AudioContext | null>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const [muted] = useState(false);

  // Tear down on unmount.
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
      const Ctor = window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      ctx = new Ctor();
      ctxRef.current = ctx;
    }
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    teardown();

    // Soft fade-in via a master gain that ramps from 0 to MASTER_GAIN.
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(muted ? 0 : MASTER_GAIN, ctx.currentTime + 0.5);
    masterRef.current = master;

    stopRef.current = startAmbient(ctx, sound, master);
  }, [sound, playing, muted]);

  useEffect(() => {
    const m = masterRef.current;
    if (m) m.gain.value = muted ? 0 : MASTER_GAIN;
  }, [muted]);

  return null;
}

// =================================================================

function startAmbient(ctx: AudioContext, soundId: string, master: GainNode): () => void {
  switch (soundId) {
    case "sound-rain":     return startRain(ctx, master);
    case "sound-ocean":    return startOcean(ctx, master);
    case "sound-forest":   return startForest(ctx, master);
    case "sound-cafe":     return startCafe(ctx, master);
    case "sound-fire":     return startFire(ctx, master);
    case "sound-library":  return startLibrary(ctx, master);
    case "sound-brown":    return startNoise(ctx, master, "brown");
    case "sound-pink":     return startNoise(ctx, master, "pink");
    case "sound-white":    return startNoise(ctx, master, "white");
    default:               return startNoise(ctx, master, "brown");
  }
}

// ── Noise generators ─────────────────────────────────────────────

type NoiseColor = "white" | "pink" | "brown";

function createNoiseSource(ctx: AudioContext, color: NoiseColor): AudioBufferSourceNode {
  const length = 4 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  if (color === "white") {
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  } else if (color === "brown") {
    let last = 0;
    for (let i = 0; i < length; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      data[i] = last * 3.5;
    }
  } else {
    // Pink — Voss-McCartney approximation.
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
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

function startNoise(ctx: AudioContext, master: GainNode, color: NoiseColor): () => void {
  const src = createNoiseSource(ctx, color);
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = color === "brown" ? 800 : color === "pink" ? 1800 : 4000;
  lp.Q.value = 0.7;
  const gain = ctx.createGain();
  gain.gain.value = color === "white" ? 0.45 : 0.7;
  src.connect(lp).connect(gain).connect(master);
  src.start();
  return () => { try { src.stop(); } catch { /* noop */ } };
}

// ── Layered ambient soundscapes ──────────────────────────────────

function startRain(ctx: AudioContext, master: GainNode): () => void {
  const cleanups: Array<() => void> = [];

  // Steady rain — pink-noise base, low-passed, gently modulated.
  const noise = createNoiseSource(ctx, "pink");
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 2200;
  lp.Q.value = 0.7;
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 200;
  const gain = ctx.createGain();
  gain.gain.value = 0.7;
  noise.connect(hp).connect(lp).connect(gain).connect(master);
  noise.start();
  cleanups.push(() => { try { noise.stop(); } catch { /* noop */ } });

  // Slow LFO on cutoff — gives the rain a "swelling" quality.
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.06;
  const lfoAmp = ctx.createGain();
  lfoAmp.gain.value = 600;
  lfo.connect(lfoAmp).connect(lp.frequency);
  lfo.start();
  cleanups.push(() => { try { lfo.stop(); } catch { /* noop */ } });

  // Occasional droplets.
  cleanups.push(scheduleDroplets(ctx, master, [180, 700], 0.05, 1500, 5500));

  return () => cleanups.forEach((c) => c());
}

function startOcean(ctx: AudioContext, master: GainNode): () => void {
  const cleanups: Array<() => void> = [];
  const noise = createNoiseSource(ctx, "brown");
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 600;
  lp.Q.value = 0.7;
  const gain = ctx.createGain();
  gain.gain.value = 0.85;
  noise.connect(lp).connect(gain).connect(master);
  noise.start();
  cleanups.push(() => { try { noise.stop(); } catch { /* noop */ } });

  // Wave swell — slow LFO that pushes the cutoff and amplitude together.
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.10;
  const lfoToCutoff = ctx.createGain();
  lfoToCutoff.gain.value = 380;
  const lfoToGain = ctx.createGain();
  lfoToGain.gain.value = 0.3;
  lfo.connect(lfoToCutoff).connect(lp.frequency);
  lfo.connect(lfoToGain).connect(gain.gain);
  lfo.start();
  cleanups.push(() => { try { lfo.stop(); } catch { /* noop */ } });

  return () => cleanups.forEach((c) => c());
}

function startForest(ctx: AudioContext, master: GainNode): () => void {
  const cleanups: Array<() => void> = [];

  // Wind base.
  const noise = createNoiseSource(ctx, "pink");
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 900;
  const gain = ctx.createGain();
  gain.gain.value = 0.45;
  noise.connect(lp).connect(gain).connect(master);
  noise.start();
  cleanups.push(() => { try { noise.stop(); } catch { /* noop */ } });

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.05;
  const lfoAmp = ctx.createGain();
  lfoAmp.gain.value = 0.22;
  lfo.connect(lfoAmp).connect(gain.gain);
  lfo.start();
  cleanups.push(() => { try { lfo.stop(); } catch { /* noop */ } });

  cleanups.push(scheduleBirds(ctx, master));

  return () => cleanups.forEach((c) => c());
}

function startCafe(ctx: AudioContext, master: GainNode): () => void {
  const cleanups: Array<() => void> = [];

  // Crowd murmur — pink noise, mid-tilted.
  const noise = createNoiseSource(ctx, "pink");
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 700;
  bp.Q.value = 0.4;
  const gain = ctx.createGain();
  gain.gain.value = 0.55;
  noise.connect(bp).connect(gain).connect(master);
  noise.start();
  cleanups.push(() => { try { noise.stop(); } catch { /* noop */ } });

  // Subtle "clatter" droplets at varied pitches.
  cleanups.push(scheduleDroplets(ctx, master, [180, 380], 0.04, 3500, 11_000));

  return () => cleanups.forEach((c) => c());
}

function startFire(ctx: AudioContext, master: GainNode): () => void {
  const cleanups: Array<() => void> = [];

  const noise = createNoiseSource(ctx, "brown");
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1100;
  const gain = ctx.createGain();
  gain.gain.value = 0.55;
  noise.connect(lp).connect(gain).connect(master);
  noise.start();
  cleanups.push(() => { try { noise.stop(); } catch { /* noop */ } });

  // Crackles — short, brighter pops.
  cleanups.push(scheduleDroplets(ctx, master, [400, 1200], 0.06, 600, 2400));

  return () => cleanups.forEach((c) => c());
}

function startLibrary(ctx: AudioContext, master: GainNode): () => void {
  const cleanups: Array<() => void> = [];

  // Quiet hum + room tone.
  const noise = createNoiseSource(ctx, "brown");
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 500;
  const gain = ctx.createGain();
  gain.gain.value = 0.35;
  noise.connect(lp).connect(gain).connect(master);
  noise.start();
  cleanups.push(() => { try { noise.stop(); } catch { /* noop */ } });

  // Far-off page turns / footsteps — sparse droplets.
  cleanups.push(scheduleDroplets(ctx, master, [220, 480], 0.025, 14_000, 32_000));

  return () => cleanups.forEach((c) => c());
}

// ── Helpers ──────────────────────────────────────────────────────

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
  return () => { stopped = true; if (timer) clearTimeout(timer); };
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
    o.frequency.exponentialRampToValueAtTime(base * 1.25, ctx.currentTime + 0.12);
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
    o.connect(g).connect(master);
    o.start();
    o.stop(ctx.currentTime + 0.32);
    timer = setTimeout(tick, 7000 + Math.random() * 16_000);
  };
  timer = setTimeout(tick, 4000);
  return () => { stopped = true; if (timer) clearTimeout(timer); };
}
