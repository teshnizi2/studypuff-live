"use client";

import { useEffect, useRef, useState } from "react";

type Props = { sound: string | null; playing: boolean };

const MASTER_GAIN = 0.16;

/** Ambient soundscapes.
 *
 *  Two-tier design:
 *   1. If a real recorded loop is present at /sounds/<id>.{webm,mp3}, we stream
 *      it (HTMLAudioElement, looped, cross-faded). Drop CC0 files in public/sounds
 *      to upgrade any sound to a real recording with zero code changes.
 *   2. Otherwise we synthesise it with Web Audio — but far richer than plain
 *      filtered noise: rain has discrete droplets, fire crackles, the café has
 *      occasional clinks, the forest has bird calls. Stochastic events are what
 *      make a noise bed read as a *place*.
 *
 *  The pure-noise options (white/pink/brown) are always synthesised — generated
 *  noise IS the real thing, so a recording would add nothing. */

// Sounds we ship a recorded loop for (when the file exists in public/sounds).
// Listed here so we only probe the network for ids that might have a file.
const REAL_LOOP_IDS = new Set(["sound-rain", "sound-ocean", "sound-forest", "sound-cafe", "sound-fire", "sound-library"]);

export function AmbientPlayer({ sound, playing }: Props) {
  const ctxRef = useRef<AudioContext | null>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const [muted] = useState(false);

  // Tear down on unmount.
  useEffect(() => {
    return () => {
      if (stopRef.current) stopRef.current();
      if (audioElRef.current) { audioElRef.current.pause(); audioElRef.current = null; }
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
        ctxRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const teardownSynth = () => {
      if (stopRef.current) { stopRef.current(); stopRef.current = null; }
    };
    const teardownFile = () => {
      const el = audioElRef.current;
      if (el) {
        // quick fade then pause to avoid a click
        try {
          const a = el;
          let v = a.volume;
          const fade = window.setInterval(() => {
            v = Math.max(0, v - 0.12);
            a.volume = v;
            if (v <= 0) { clearInterval(fade); a.pause(); }
          }, 25);
        } catch { el.pause(); }
        audioElRef.current = null;
      }
    };

    if (!playing || !sound) {
      teardownSynth();
      teardownFile();
      return;
    }

    let cancelled = false;

    // 1) Try a real recorded loop first (only for ids that might ship one).
    if (REAL_LOOP_IDS.has(sound)) {
      const tryReal = async () => {
        // Probe webm (smaller) then mp3 (broad support). HEAD avoids downloading
        // the whole file just to learn it doesn't exist.
        const candidates = [`/sounds/${sound}.webm`, `/sounds/${sound}.mp3`];
        for (const url of candidates) {
          try {
            const head = await fetch(url, { method: "HEAD" });
            if (cancelled) return true;
            if (head.ok) {
              teardownSynth();
              const el = new Audio(url);
              el.loop = true;
              el.preload = "auto";
              el.volume = 0;
              audioElRef.current = el;
              await el.play().catch(() => {});
              // fade in
              let v = 0;
              const fade = window.setInterval(() => {
                v = Math.min(0.9, v + 0.06);
                if (audioElRef.current === el) el.volume = muted ? 0 : v;
                if (v >= 0.9) clearInterval(fade);
              }, 25);
              return true;
            }
          } catch { /* network/HEAD unsupported → fall through to synth */ }
        }
        return false;
      };
      tryReal().then((usedReal) => {
        if (!usedReal && !cancelled) startSynth();
      });
      return () => { cancelled = true; teardownFile(); };
    }

    // 2) Synthesised soundscape.
    function startSynth() {
      if (cancelled) return;
      let ctx = ctxRef.current;
      if (!ctx) {
        const Ctor = window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        ctx = new Ctor();
        ctxRef.current = ctx;
      }
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      teardownSynth();
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      master.gain.linearRampToValueAtTime(muted ? 0 : MASTER_GAIN, ctx.currentTime + 0.6);
      masterRef.current = master;
      stopRef.current = startAmbient(ctx, sound!, master);
    }
    startSynth();

    return () => { cancelled = true; teardownSynth(); };
  }, [sound, playing, muted]);

  useEffect(() => {
    const m = masterRef.current;
    if (m) m.gain.value = muted ? 0 : MASTER_GAIN;
    const el = audioElRef.current;
    if (el) el.volume = muted ? 0 : 0.9;
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

// ── Noise primitives ─────────────────────────────────────────────

type NoiseColor = "white" | "pink" | "brown";

function fillNoise(data: Float32Array, color: NoiseColor) {
  const length = data.length;
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
}

/** A 4-second seamless looping noise bed. */
function createNoiseSource(ctx: AudioContext, color: NoiseColor): AudioBufferSourceNode {
  const length = 4 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  fillNoise(buffer.getChannelData(0), color);
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  return src;
}

/** A short one-shot noise buffer (for droplets, crackles, page-turns). */
function noiseBurst(ctx: AudioContext, durSec: number): AudioBufferSourceNode {
  const len = Math.max(1, Math.floor(durSec * ctx.sampleRate));
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  fillNoise(buffer.getChannelData(0), "white");
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  return src;
}

/** Recursive randomised scheduler — fires `spawn` at random intervals.
 *  Returns a cleanup that stops further scheduling. */
function scheduleRandom(spawn: () => void, minMs: number, maxMs: number): () => void {
  let timer: number | null = null;
  let alive = true;
  const tick = () => {
    if (!alive) return;
    try { spawn(); } catch { /* ignore one bad event */ }
    timer = window.setTimeout(tick, minMs + Math.random() * (maxMs - minMs));
  };
  timer = window.setTimeout(tick, Math.random() * maxMs);
  return () => { alive = false; if (timer) clearTimeout(timer); };
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

  // Steady rain bed — pink noise, band-limited, gently swelling.
  const bed = createNoiseSource(ctx, "pink");
  const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 400;
  const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 6500; lp.Q.value = 0.6;
  const bedGain = ctx.createGain(); bedGain.gain.value = 0.5;
  bed.connect(hp).connect(lp).connect(bedGain).connect(master);
  bed.start();
  cleanups.push(() => { try { bed.stop(); } catch {} });

  const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
  const lfoAmp = ctx.createGain(); lfoAmp.gain.value = 1200;
  lfo.connect(lfoAmp).connect(lp.frequency); lfo.start();
  cleanups.push(() => { try { lfo.stop(); } catch {} });

  // Discrete droplets — short high-passed noise ticks. This is what makes it
  // read as rain rather than hiss. Several per second, randomised.
  cleanups.push(scheduleRandom(() => {
    const now = ctx.currentTime;
    const burst = noiseBurst(ctx, 0.05);
    const bp = ctx.createBiquadFilter(); bp.type = "bandpass";
    bp.frequency.value = 2500 + Math.random() * 3500; bp.Q.value = 1.2;
    const g = ctx.createGain();
    const peak = 0.06 + Math.random() * 0.10;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(peak, now + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    burst.connect(bp).connect(g).connect(master);
    burst.start(now); burst.stop(now + 0.06);
  }, 35, 120));

  return () => cleanups.forEach((c) => c());
}

function startOcean(ctx: AudioContext, master: GainNode): () => void {
  const cleanups: Array<() => void> = [];
  const noise = createNoiseSource(ctx, "brown");
  const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 650; lp.Q.value = 0.7;
  const gain = ctx.createGain(); gain.gain.value = 0.8;
  noise.connect(lp).connect(gain).connect(master);
  noise.start();
  cleanups.push(() => { try { noise.stop(); } catch {} });

  // Two offset swells → irregular, natural wave rhythm.
  for (const [rate, depthHz, depthGain] of [[0.09, 420, 0.32], [0.13, 260, 0.18]] as const) {
    const lfo = ctx.createOscillator(); lfo.frequency.value = rate;
    const toCut = ctx.createGain(); toCut.gain.value = depthHz;
    const toGain = ctx.createGain(); toGain.gain.value = depthGain;
    lfo.connect(toCut).connect(lp.frequency);
    lfo.connect(toGain).connect(gain.gain);
    lfo.start();
    cleanups.push(() => { try { lfo.stop(); } catch {} });
  }
  return () => cleanups.forEach((c) => c());
}

function startForest(ctx: AudioContext, master: GainNode): () => void {
  const cleanups: Array<() => void> = [];

  // Soft wind bed.
  const wind = createNoiseSource(ctx, "pink");
  const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1000;
  const windGain = ctx.createGain(); windGain.gain.value = 0.32;
  wind.connect(lp).connect(windGain).connect(master);
  wind.start();
  cleanups.push(() => { try { wind.stop(); } catch {} });
  const lfo = ctx.createOscillator(); lfo.frequency.value = 0.05;
  const lfoAmp = ctx.createGain(); lfoAmp.gain.value = 0.16;
  lfo.connect(lfoAmp).connect(windGain.gain); lfo.start();
  cleanups.push(() => { try { lfo.stop(); } catch {} });

  // Bird calls — short pitched chirps with a little warble. Sparse + random.
  cleanups.push(scheduleRandom(() => {
    const now = ctx.currentTime;
    const base = 2200 + Math.random() * 1800;
    const osc = ctx.createOscillator(); osc.type = "sine";
    osc.frequency.setValueAtTime(base, now);
    osc.frequency.linearRampToValueAtTime(base * 1.18, now + 0.07);
    osc.frequency.linearRampToValueAtTime(base * 0.95, now + 0.14);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.05, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    osc.connect(g).connect(master);
    osc.start(now); osc.stop(now + 0.2);
    // occasional double-chirp
    if (Math.random() < 0.5) {
      const o2 = ctx.createOscillator(); o2.type = "sine";
      o2.frequency.setValueAtTime(base * 1.05, now + 0.22);
      o2.frequency.linearRampToValueAtTime(base * 1.2, now + 0.28);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0, now + 0.22);
      g2.gain.linearRampToValueAtTime(0.045, now + 0.24);
      g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
      o2.connect(g2).connect(master);
      o2.start(now + 0.22); o2.stop(now + 0.4);
    }
  }, 2200, 6500));

  return () => cleanups.forEach((c) => c());
}

function startCafe(ctx: AudioContext, master: GainNode): () => void {
  const cleanups: Array<() => void> = [];

  // Crowd murmur — pink noise, mid-tilted, slowly undulating.
  const murmur = createNoiseSource(ctx, "pink");
  const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 650; bp.Q.value = 0.5;
  const mGain = ctx.createGain(); mGain.gain.value = 0.5;
  murmur.connect(bp).connect(mGain).connect(master);
  murmur.start();
  cleanups.push(() => { try { murmur.stop(); } catch {} });
  const lfo = ctx.createOscillator(); lfo.frequency.value = 0.11;
  const lfoAmp = ctx.createGain(); lfoAmp.gain.value = 0.14;
  lfo.connect(lfoAmp).connect(mGain.gain); lfo.start();
  cleanups.push(() => { try { lfo.stop(); } catch {} });

  // Occasional cup/cutlery clink — short bright ping.
  cleanups.push(scheduleRandom(() => {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator(); osc.type = "triangle";
    osc.frequency.value = 1600 + Math.random() * 1400;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.05, now + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    osc.connect(g).connect(master);
    osc.start(now); osc.stop(now + 0.18);
  }, 3500, 9000));

  return () => cleanups.forEach((c) => c());
}

function startFire(ctx: AudioContext, master: GainNode): () => void {
  const cleanups: Array<() => void> = [];

  // Low rumble bed.
  const bed = createNoiseSource(ctx, "brown");
  const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 950;
  const bedGain = ctx.createGain(); bedGain.gain.value = 0.45;
  bed.connect(lp).connect(bedGain).connect(master);
  bed.start();
  cleanups.push(() => { try { bed.stop(); } catch {} });

  // Crackles — short filtered noise pops with sharp decay, clustered.
  cleanups.push(scheduleRandom(() => {
    const now = ctx.currentTime;
    const pops = 1 + Math.floor(Math.random() * 3);
    for (let p = 0; p < pops; p++) {
      const t = now + p * (0.02 + Math.random() * 0.05);
      const burst = noiseBurst(ctx, 0.04);
      const bp = ctx.createBiquadFilter(); bp.type = "bandpass";
      bp.frequency.value = 900 + Math.random() * 2200; bp.Q.value = 0.9;
      const g = ctx.createGain();
      const peak = 0.05 + Math.random() * 0.12;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(peak, t + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      burst.connect(bp).connect(g).connect(master);
      burst.start(t); burst.stop(t + 0.06);
    }
  }, 120, 700));

  return () => cleanups.forEach((c) => c());
}

function startLibrary(ctx: AudioContext, master: GainNode): () => void {
  const cleanups: Array<() => void> = [];

  // Quiet room tone.
  const tone = createNoiseSource(ctx, "brown");
  const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 480;
  const g = ctx.createGain(); g.gain.value = 0.3;
  tone.connect(lp).connect(g).connect(master);
  tone.start();
  cleanups.push(() => { try { tone.stop(); } catch {} });

  // Rare soft page-turn — a brief mid noise swish.
  cleanups.push(scheduleRandom(() => {
    const now = ctx.currentTime;
    const burst = noiseBurst(ctx, 0.18);
    const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1800; bp.Q.value = 0.6;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(0.04, now + 0.05);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    burst.connect(bp).connect(env).connect(master);
    burst.start(now); burst.stop(now + 0.22);
  }, 9000, 22000));

  return () => cleanups.forEach((c) => c());
}
