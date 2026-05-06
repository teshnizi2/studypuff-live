"use client";

import { useEffect, useRef, useState } from "react";

type Props = { sound: string | null; playing: boolean };

const MASTER_GAIN = 0.08;

export function AmbientPlayer({ sound, playing }: Props) {
  const ctxRef = useRef<AudioContext | null>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const [muted] = useState(false);

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

  // SoundDock owns the visible UI now
  return null;
}

function startAmbient(ctx: AudioContext, soundId: string, master: GainNode): () => void {
  if (soundId === "sound-lofi")     return startProgression(ctx, master, LOFI_PROG, 2200, "triangle", 1400);
  if (soundId === "sound-sweden")   return startProgression(ctx, master, SWEDEN_PROG, 2700, "sine", 1100);
  if (soundId === "sound-hisaishi") return startProgression(ctx, master, HISAISHI_PROG, 3200, "sine", 1500, true);
  if (soundId === "sound-satie")    return startProgression(ctx, master, SATIE_PROG, 1800, "triangle", 1200);

  // Brown-noise-based ambient presets
  const cleanups: Array<() => void> = [];
  const noise = createBrownNoise(ctx);
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1200;
  lp.Q.value = 0.7;
  const gain = ctx.createGain();
  gain.gain.value = 0.5;
  noise.connect(lp).connect(gain).connect(master);
  noise.start();
  cleanups.push(() => { try { noise.stop(); } catch { /* noop */ } });

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoAmp = ctx.createGain();
  lfoAmp.gain.value = 0.18;
  lfo.connect(lfoAmp).connect(gain.gain);
  lfo.start();
  cleanups.push(() => { try { lfo.stop(); } catch { /* noop */ } });

  if (soundId === "sound-rain")    { lp.frequency.value = 1800; cleanups.push(scheduleDroplets(ctx, master, [200, 700], 0.04, 1500, 4500)); }
  else if (soundId === "sound-library") { lp.frequency.value = 700; gain.gain.value = 0.35; cleanups.push(scheduleDroplets(ctx, master, [300, 600], 0.02, 14_000, 30_000)); }
  else if (soundId === "sound-forest")  { lp.frequency.value = 1000; cleanups.push(scheduleBirds(ctx, master)); }
  else if (soundId === "sound-cafe")    { lp.frequency.value = 900; cleanups.push(scheduleDroplets(ctx, master, [150, 350], 0.03, 4000, 12_000)); }
  else if (soundId === "sound-fire")    { lp.frequency.value = 1100; cleanups.push(scheduleDroplets(ctx, master, [400, 1200], 0.05, 700, 3000)); }
  else if (soundId === "sound-ocean")   {
    lp.frequency.value = 600;
    const wave = ctx.createOscillator();
    wave.frequency.value = 0.1;
    const waveAmp = ctx.createGain();
    waveAmp.gain.value = 0.45;
    wave.connect(waveAmp).connect(lp.frequency);
    wave.start();
    cleanups.push(() => { try { wave.stop(); } catch { /* noop */ } });
  }

  return () => cleanups.forEach((c) => c());
}

// ── Chord progressions (Hz frequencies) ──────────────────────────
const LOFI_PROG = [
  [130.81, 164.81, 196.0, 246.94],
  [110.0, 130.81, 164.81, 196.0],
  [87.31, 130.81, 174.61, 220.0],
  [98.0, 123.47, 146.83, 196.0]
];

// C418 "Sweden" — F#m → A → E → B
const SWEDEN_PROG = [
  [92.5, 110.0, 138.59],
  [110.0, 138.59, 164.81],
  [82.41, 103.83, 123.47],
  [123.47, 155.56, 184.99]
];

// Hisaishi-style — F major pad + sparse pentatonic melody
const HISAISHI_PROG = [
  [87.31, 110.0, 130.81, 174.61],
  [98.0, 123.47, 146.83, 196.0],
  [87.31, 110.0, 130.81, 174.61],
  [82.41, 110.0, 130.81, 164.81]
];

// Satie Gymnopédie — slow waltz, low triads
const SATIE_PROG = [
  [73.42, 110.0, 138.59],
  [82.41, 110.0, 146.83],
  [73.42, 110.0, 138.59],
  [98.0, 123.47, 146.83]
];

function startProgression(
  ctx: AudioContext,
  master: GainNode,
  prog: number[][],
  beatMs: number,
  oscType: OscillatorType,
  filterFreq: number,
  addMelody = false
): () => void {
  const cleanups: Array<() => void> = [];

  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = filterFreq;
  lp.Q.value = 0.5;
  lp.connect(master);

  let stopped = false;
  let chordIdx = 0;

  const playChord = () => {
    if (stopped) return;
    const notes = prog[chordIdx % prog.length];
    const now = ctx.currentTime;
    notes.forEach((freq) => {
      const o = ctx.createOscillator();
      o.type = oscType;
      o.frequency.value = freq;
      const g = ctx.createGain();
      const dur = beatMs / 1000;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.18, now + 0.45);
      g.gain.linearRampToValueAtTime(0.10, now + dur * 0.7);
      g.gain.linearRampToValueAtTime(0,    now + dur);
      o.connect(g).connect(lp);
      o.start();
      o.stop(now + dur + 0.05);
    });

    if (addMelody && Math.random() < 0.6) {
      const PENT = [349.23, 392.0, 440.0, 523.25, 587.33];
      const m = ctx.createOscillator();
      m.type = "triangle";
      m.frequency.value = PENT[Math.floor(Math.random() * PENT.length)];
      const mg = ctx.createGain();
      const d = beatMs / 1000;
      mg.gain.setValueAtTime(0, now + 0.3);
      mg.gain.linearRampToValueAtTime(0.10, now + 0.5);
      mg.gain.linearRampToValueAtTime(0,    now + d * 0.85);
      m.connect(mg).connect(lp);
      m.start(now + 0.3);
      m.stop(now + d);
    }

    chordIdx++;
  };

  playChord();
  const interval = setInterval(playChord, beatMs);
  cleanups.push(() => { stopped = true; clearInterval(interval); });
  return () => cleanups.forEach((c) => c());
}

function createBrownNoise(ctx: AudioContext): AudioBufferSourceNode {
  const length = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    const w = Math.random() * 2 - 1;
    last = (last + 0.02 * w) / 1.02;
    data[i] = last * 3.5;
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
  return () => { stopped = true; if (timer) clearTimeout(timer); };
}
