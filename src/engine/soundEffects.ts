/**
 * Offline-safe Web Audio API synthesizer for UI clicks and page/mission transitions.
 * Uses a single shared AudioContext resumed on user interaction so multiple rapid
 * clicks and screen transitions stay crisp without hitting browser context limits.
 */

export type ClickSfxKind =
  | 'default'
  | 'back'
  | 'next'
  | 'choice'
  | 'locked'
  | 'launch';

export type TransitionSfxKind =
  | 'page'
  | 'hyperspace'
  | 'orbiting'
  | 'turbulence'
  | 'blackout'
  | 'surface_reveal'
  | 'eva_enter'
  | 'scene_end';

let sharedCtx: AudioContext | null = null;
let sfxMasterGain: GainNode | null = null;
let sfxMasterCtx: AudioContext | null = null;
let sfxEnabled = true;
let masterVolume = 1;
let lastClickSfxTime = 0;
let emergencyLoopTimer: number | null = null;
let sabotageLoopTimer: number | null = null;
let cachedKlaxonCurve: Float32Array<ArrayBuffer> | null = null;

// Cozy space ambient pad + whimsical sparkle bed state
let ambientMasterGain: GainNode | null = null;
let ambientPadOsc1: OscillatorNode | null = null;
let ambientPadOsc2: OscillatorNode | null = null;
let ambientLfoOsc: OscillatorNode | null = null;
let ambientSparkleTimer: number | null = null;
let ambientActive = false;
let ambientDucked = false;

export function setSoundEffectsEnabled(enabled: boolean) {
  sfxEnabled = enabled;
  if (!enabled) {
    stopEmergencyBeepLoop();
    stopSabotageAlarmLoop();
    stopAmbientSpaceAudio();
  }
}

export function setMasterVolume(volume: number) {
  const clamped = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 1;
  masterVolume = clamped;
  if (sfxMasterGain && sharedCtx && sfxMasterCtx === sharedCtx) {
    try {
      const now = sharedCtx.currentTime;
      sfxMasterGain.gain.cancelScheduledValues(now);
      sfxMasterGain.gain.setTargetAtTime(clamped, now, 0.02);
    } catch {
      // Ignore Web Audio parameter ramp issues
    }
  }
}

export function getMasterVolume(): number {
  return masterVolume;
}

function getSfxDestination(ctx: AudioContext): AudioNode {
  if (!sfxMasterGain || sfxMasterCtx !== ctx) {
    sfxMasterGain = ctx.createGain();
    sfxMasterGain.gain.setValueAtTime(masterVolume, ctx.currentTime);
    sfxMasterGain.connect(ctx.destination);
    sfxMasterCtx = ctx;
  }
  return sfxMasterGain;
}

function getKlaxonDistortionCurve(): Float32Array<ArrayBuffer> {
  if (cachedKlaxonCurve) return cachedKlaxonCurve;
  const samples = 256;
  const curve = new Float32Array(new ArrayBuffer(samples * 4));
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1;
    curve[i] = Math.tanh(2.4 * x);
  }
  cachedKlaxonCurve = curve;
  return curve;
}

function getAudioContext(): AudioContext | null {
  if (!sfxEnabled || typeof window === 'undefined') return null;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;
    if (!sharedCtx || sharedCtx.state === 'closed') {
      sharedCtx = new AudioCtx();
    }
    if (sharedCtx.state === 'suspended') {
      sharedCtx.resume().catch(() => {});
    }
    return sharedCtx;
  } catch {
    return null;
  }
}

function playTone(
  ctx: AudioContext,
  startOffset: number,
  duration: number,
  startFreq: number,
  endFreq: number,
  type: OscillatorType,
  peakGain: number
) {
  const now = ctx.currentTime + startOffset;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(Math.max(40, startFreq), now);
  if (endFreq !== startFreq) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(40, endFreq),
      now + duration
    );
  }
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peakGain, now + Math.min(0.015, duration * 0.35));
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(getSfxDestination(ctx));
  osc.start(now);
  osc.stop(now + duration + 0.01);
}

function playFilteredNoise(
  ctx: AudioContext,
  startOffset: number,
  duration: number,
  filterFreq: number,
  peakGain: number
) {
  const now = ctx.currentTime + startOffset;
  const sampleCount = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < sampleCount; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const src = ctx.createBufferSource();
  src.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(filterFreq, now);
  filter.Q.value = 1.4;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peakGain, now + Math.min(0.04, duration * 0.3));
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  src.connect(filter);
  filter.connect(gain);
  gain.connect(getSfxDestination(ctx));
  src.start(now);
  src.stop(now + duration + 0.01);
}

export function playClickSfx(kind: ClickSfxKind = 'default') {
  const nowMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
  if (nowMs - lastClickSfxTime < 28) return;
  lastClickSfxTime = nowMs;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    switch (kind) {
      case 'launch':
        playTone(ctx, 0, 0.22, 180, 520, 'sawtooth', 0.055);
        playTone(ctx, 0.05, 0.42, 95, 220, 'triangle', 0.075);
        playFilteredNoise(ctx, 0.04, 0.46, 360, 0.06);
        break;
      case 'back':
        playTone(ctx, 0, 0.055, 640, 540, 'triangle', 0.045);
        playTone(ctx, 0.045, 0.065, 480, 390, 'sine', 0.045);
        break;
      case 'next':
        playTone(ctx, 0, 0.055, 560, 680, 'triangle', 0.045);
        playTone(ctx, 0.045, 0.07, 740, 920, 'sine', 0.05);
        break;
      case 'choice':
        playTone(ctx, 0, 0.06, 660, 880, 'sine', 0.05);
        playTone(ctx, 0.05, 0.09, 990, 1180, 'triangle', 0.045);
        break;
      case 'locked':
        playTone(ctx, 0, 0.06, 220, 185, 'square', 0.032);
        playTone(ctx, 0.07, 0.07, 180, 150, 'square', 0.03);
        break;
      case 'default':
      default:
        playTone(ctx, 0, 0.048, 760, 960, 'sine', 0.042);
        break;
    }
  } catch {
    // Web Audio failures never affect UI flow
  }
}

function triggerEmergencyBeepPulse(intense: boolean) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    // Classic spacecraft emergency caution/warning double-beep
    playTone(ctx, 0, 0.11, intense ? 980 : 880, intense ? 920 : 840, 'square', 0.036);
    playTone(ctx, 0.145, 0.12, intense ? 760 : 720, intense ? 720 : 690, 'sawtooth', 0.034);
  } catch {
    // Web Audio failures never affect UI flow
  }
}

export function startEmergencyBeepLoop(intense: boolean = false) {
  stopEmergencyBeepLoop();
  if (!sfxEnabled || typeof window === 'undefined') return;
  triggerEmergencyBeepPulse(intense);
  emergencyLoopTimer = window.setInterval(
    () => {
      if (!sfxEnabled) {
        stopEmergencyBeepLoop();
        return;
      }
      triggerEmergencyBeepPulse(intense);
    },
    intense ? 520 : 650
  );
}

export function stopEmergencyBeepLoop() {
  if (emergencyLoopTimer !== null && typeof window !== 'undefined') {
    window.clearInterval(emergencyLoopTimer);
    emergencyLoopTimer = null;
  }
}

/**
 * Authentic Among Us–inspired red-alert sabotage klaxon pulse:
 * gliding G#4 (415.3 Hz) -> D#5 (622.25 Hz) -> G#4 (415.3 Hz) siren sweep
 * combining crunchy square + sawtooth oscillators, soft distortion, and a
 * resonant low-pass filter on a panicked ~860 ms cycle.
 */
function triggerSabotageAlarmPulse() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const peakGain = ambientDucked ? 0.042 : 0.064;

    const shaper = ctx.createWaveShaper();
    shaper.curve = getKlaxonDistortionCurve();
    shaper.oversample = '2x';

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(2.2, now);
    filter.frequency.setValueAtTime(1600, now);
    filter.frequency.exponentialRampToValueAtTime(2450, now + 0.145);
    filter.frequency.setValueAtTime(2450, now + 0.22);
    filter.frequency.exponentialRampToValueAtTime(1150, now + 0.41);

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(peakGain, now + 0.012);
    master.gain.setValueAtTime(peakGain, now + 0.24);
    master.gain.exponentialRampToValueAtTime(peakGain * 0.72, now + 0.37);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.43);

    shaper.connect(filter);
    filter.connect(master);
    master.connect(getSfxDestination(ctx));

    // Helper for the G#4 -> D#5 -> G#4 gliding klaxon contour
    const scheduleKlaxonGlide = (osc: OscillatorNode, detuneHz = 0, mult = 1) => {
      const low = 415.3 * mult + detuneHz;
      const high = 622.25 * mult + detuneHz;
      osc.frequency.setValueAtTime(low, now);
      osc.frequency.exponentialRampToValueAtTime(high, now + 0.145);
      osc.frequency.setValueAtTime(high, now + 0.22);
      osc.frequency.exponentialRampToValueAtTime(low, now + 0.39);
    };

    // Primary sawtooth siren sweep
    const hornSaw = ctx.createOscillator();
    hornSaw.type = 'sawtooth';
    scheduleKlaxonGlide(hornSaw, 0, 1);
    hornSaw.connect(shaper);

    // Crunchy square body at unison for classic Among Us klaxon bite
    const hornSquare = ctx.createOscillator();
    const sqGain = ctx.createGain();
    sqGain.gain.setValueAtTime(0.55, now);
    hornSquare.type = 'square';
    scheduleKlaxonGlide(hornSquare, 2.5, 1);
    hornSquare.connect(sqGain);
    sqGain.connect(shaper);

    // Sub-octave weight so the alert feels heavy in the spacecraft hull
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.28, now);
    subOsc.type = 'square';
    scheduleKlaxonGlide(subOsc, 0, 0.5);
    subOsc.connect(subGain);
    subGain.connect(shaper);

    hornSaw.start(now);
    hornSquare.start(now);
    subOsc.start(now);
    hornSaw.stop(now + 0.45);
    hornSquare.stop(now + 0.45);
    subOsc.stop(now + 0.45);
  } catch {
    // Web Audio failures never affect UI flow
  }
}

export function startSabotageAlarmLoop() {
  stopSabotageAlarmLoop();
  if (!sfxEnabled || typeof window === 'undefined') return;
  triggerSabotageAlarmPulse();
  sabotageLoopTimer = window.setInterval(() => {
    if (!sfxEnabled) {
      stopSabotageAlarmLoop();
      return;
    }
    triggerSabotageAlarmPulse();
  }, 860);
}

export function stopSabotageAlarmLoop() {
  if (sabotageLoopTimer !== null && typeof window !== 'undefined') {
    window.clearInterval(sabotageLoopTimer);
    sabotageLoopTimer = null;
  }
}

export function isSabotageAlarmActive(): boolean {
  return sabotageLoopTimer !== null;
}

const PENTATONIC_STAR_NOTES = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

/**
 * Starts a soft, warm planetarium ambient pad with gentle starlight celesta
 * sparkles so the experience feels engaging and magical for younger explorers.
 */
export function startAmbientSpaceAudio() {
  if (!sfxEnabled || ambientActive || typeof window === 'undefined') return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(ambientDucked ? 0.011 : 0.022, now + 1.2);
    master.connect(getSfxDestination(ctx));

    // Warm low-pass filter so background drone stays velvet-soft
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, now);
    filter.connect(master);

    // Cozy open fifth (C3 + G3) sine/triangle blend
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(130.81, now);
    osc1.connect(filter);

    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    const osc2Gain = ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.35, now);
    osc2.frequency.setValueAtTime(196.0, now);
    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);

    // Slow gentle filter breathing LFO
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.14, now);
    lfoGain.gain.setValueAtTime(110, now);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    osc1.start(now);
    osc2.start(now);
    lfo.start(now);

    ambientMasterGain = master;
    ambientPadOsc1 = osc1;
    ambientPadOsc2 = osc2;
    ambientLfoOsc = lfo;
    ambientActive = true;

    // Gentle whimsical pentatonic starlight notes every ~3.2s
    ambientSparkleTimer = window.setInterval(() => {
      if (!sfxEnabled || !ambientActive) return;
      const c = getAudioContext();
      if (!c) return;
      const baseNote =
        PENTATONIC_STAR_NOTES[
          Math.floor(Math.random() * PENTATONIC_STAR_NOTES.length)
        ];
      const peak = ambientDucked ? 0.008 : 0.015;
      playTone(c, 0, 0.36, baseNote, baseNote, 'sine', peak);
      if (Math.random() > 0.55) {
        playTone(c, 0.18, 0.42, baseNote * 1.25, baseNote * 1.25, 'sine', peak * 0.8);
      }
    }, 3200);
  } catch {
    ambientActive = false;
  }
}

export function setAmbientSpeechDucking(isSpeaking: boolean) {
  ambientDucked = isSpeaking;
  if (!ambientActive || !ambientMasterGain || !sharedCtx) return;
  try {
    const now = sharedCtx.currentTime;
    ambientMasterGain.gain.cancelScheduledValues(now);
    ambientMasterGain.gain.setTargetAtTime(isSpeaking ? 0.01 : 0.022, now, 0.18);
  } catch {
    // Ignore audio ramping issues
  }
}

export function stopAmbientSpaceAudio() {
  if (ambientSparkleTimer !== null && typeof window !== 'undefined') {
    window.clearInterval(ambientSparkleTimer);
    ambientSparkleTimer = null;
  }
  ambientActive = false;
  try {
    ambientPadOsc1?.stop();
    ambientPadOsc2?.stop();
    ambientLfoOsc?.stop();
    ambientMasterGain?.disconnect();
  } catch {
    // Ignore stop errors
  }
  ambientPadOsc1 = null;
  ambientPadOsc2 = null;
  ambientLfoOsc = null;
  ambientMasterGain = null;
}

export function playTransitionSfx(kind: TransitionSfxKind = 'page') {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    switch (kind) {
      case 'hyperspace':
        playTone(ctx, 0, 0.48, 220, 1280, 'sine', 0.055);
        playFilteredNoise(ctx, 0, 0.42, 920, 0.04);
        break;
      case 'orbiting':
        playTone(ctx, 0, 0.28, 740, 880, 'sine', 0.045);
        playTone(ctx, 0.14, 0.32, 1110, 1110, 'sine', 0.03);
        break;
      case 'turbulence':
        playTone(ctx, 0, 0.12, 320, 260, 'sawtooth', 0.032);
        playTone(ctx, 0.16, 0.12, 320, 260, 'sawtooth', 0.032);
        playFilteredNoise(ctx, 0.02, 0.36, 260, 0.045);
        break;
      case 'blackout':
        playTone(ctx, 0, 0.3, 440, 140, 'triangle', 0.05);
        break;
      case 'surface_reveal':
        playTone(ctx, 0, 0.32, 523.25, 523.25, 'sine', 0.04);
        playTone(ctx, 0.06, 0.34, 659.25, 659.25, 'sine', 0.038);
        playTone(ctx, 0.12, 0.38, 783.99, 783.99, 'sine', 0.038);
        break;
      case 'eva_enter':
        playFilteredNoise(ctx, 0, 0.28, 1200, 0.042);
        playTone(ctx, 0.08, 0.24, 480, 720, 'sine', 0.045);
        break;
      case 'scene_end':
        playTone(ctx, 0, 0.15, 523.25, 523.25, 'triangle', 0.045);
        playTone(ctx, 0.09, 0.15, 659.25, 659.25, 'triangle', 0.045);
        playTone(ctx, 0.18, 0.18, 783.99, 783.99, 'triangle', 0.045);
        playTone(ctx, 0.27, 0.32, 1046.5, 1046.5, 'sine', 0.05);
        break;
      case 'page':
      default:
        playFilteredNoise(ctx, 0, 0.14, 1050, 0.022);
        playTone(ctx, 0, 0.14, 420, 680, 'sine', 0.035);
        break;
    }
  } catch {
    // Web Audio failures never affect UI flow
  }
}
