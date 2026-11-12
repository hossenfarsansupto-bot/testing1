import { useCallback, useEffect, useRef } from 'react';
import { setAmbientSpeechDucking } from './soundEffects';
import type { FeliceVoiceStyle } from '../types';
import kidVoiceManifest from '../content/kidVoiceManifest.json';

export type FeliceVoiceMode = 'ai' | 'robotic';

export interface SpeakOptions {
  mode?: FeliceVoiceMode;
  speaker?: 'felice' | 'system';
  playChirp?: boolean;
  style?: FeliceVoiceStyle;
  onEnd?: () => void;
}

let eveAudioCtx: AudioContext | null = null;
let activeSpeechGen = 0;
let activeKidAudio: HTMLAudioElement | null = null;
let speechVolume = 1;

export function setSpeechVolume(volume: number) {
  const clamped = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 1;
  speechVolume = clamped;
  if (activeKidAudio) {
    try {
      activeKidAudio.volume = clamped;
    } catch {
      // Ignore HTMLAudio volume errors
    }
  }
}

function stopKidVoiceAudio() {
  if (!activeKidAudio) return;
  try {
    activeKidAudio.pause();
    activeKidAudio.currentTime = 0;
  } catch {
    // Ignore HTMLAudio cleanup issues
  }
  activeKidAudio = null;
}

/** Cancel any in-progress browser Web Speech narration and kid voiceover audio immediately. */
export function cancelSpeechSynthesis() {
  activeSpeechGen += 1;
  stopKidVoiceAudio();
  setAmbientSpeechDucking(false);
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // Ignore browser speech synthesis cancellation errors
  }
}

/** Pause Felice's currently playing narration audio or Web Speech utterance in-place. */
export function pauseSpeechSynthesis() {
  if (activeKidAudio && !activeKidAudio.paused) {
    try {
      activeKidAudio.pause();
    } catch {
      // Ignore HTMLAudio pause errors
    }
  }
  setAmbientSpeechDucking(false);
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
    }
  } catch {
    // Ignore browser speech synthesis pause errors
  }
}

/** Resume Felice's paused narration audio or Web Speech utterance from the exact spot. */
export function resumeSpeechSynthesis() {
  if (activeKidAudio && activeKidAudio.paused && !activeKidAudio.ended) {
    setAmbientSpeechDucking(true);
    activeKidAudio.play().catch(() => {
      setAmbientSpeechDucking(false);
    });
  }
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    if (window.speechSynthesis.paused) {
      setAmbientSpeechDucking(true);
      window.speechSynthesis.resume();
    }
  } catch {
    // Ignore browser speech synthesis resume errors
  }
}

/** Play a brief futuristic audio calibration chime using Web Audio API (offline-safe). */
export function playCalibrationChime(enabled: boolean) {
  if (!enabled || speechVolume <= 0 || typeof window === 'undefined') return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const notes = [520, 780, 1040];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx === 2 ? 'square' : 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.085);
      gain.gain.setValueAtTime(0.001, now + idx * 0.085);
      gain.gain.exponentialRampToValueAtTime(
        Math.max(0.001, 0.055 * speechVolume),
        now + idx * 0.085 + 0.02
      );
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.085 + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.085);
      osc.stop(now + idx * 0.085 + 0.15);
    });

    window.setTimeout(() => {
      ctx.close().catch(() => {});
    }, 600);
  } catch {
    // Audio playback is strictly optional
  }
}

function getEveAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;
    if (!eveAudioCtx || eveAudioCtx.state === 'closed') {
      eveAudioCtx = new AudioCtx();
    }
    if (eveAudioCtx.state === 'suspended') {
      eveAudioCtx.resume().catch(() => {});
    }
    return eveAudioCtx;
  } catch {
    return null;
  }
}

function playStorytellerSparkle(
  enabled: boolean,
  contour: 'statement' | 'question' | 'exclaim' = 'statement'
) {
  if (!enabled || speechVolume <= 0) return;
  const ctx = getEveAudioCtx();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    // Playful warm celesta/marimba chime so Felice sounds inviting while teaching young explorers
    const tones =
      contour === 'question'
        ? [
            { f0: 587.33, f1: 659.25, delay: 0, dur: 0.14, peak: 0.022 },
            { f0: 783.99, f1: 880.0, delay: 0.09, dur: 0.18, peak: 0.02 }
          ]
        : contour === 'exclaim'
          ? [
              { f0: 659.25, f1: 659.25, delay: 0, dur: 0.11, peak: 0.024 },
              { f0: 783.99, f1: 783.99, delay: 0.075, dur: 0.12, peak: 0.022 },
              { f0: 1046.5, f1: 1046.5, delay: 0.15, dur: 0.18, peak: 0.024 }
            ]
          : [
              { f0: 523.25, f1: 523.25, delay: 0, dur: 0.13, peak: 0.018 },
              { f0: 659.25, f1: 659.25, delay: 0.075, dur: 0.16, peak: 0.016 }
            ];

    tones.forEach((t) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(t.f0, now + t.delay);
      if (t.f1 !== t.f0) {
        osc.frequency.exponentialRampToValueAtTime(t.f1, now + t.delay + t.dur);
      }
      gain.gain.setValueAtTime(0.0001, now + t.delay);
      gain.gain.exponentialRampToValueAtTime(
        Math.max(0.0001, t.peak * speechVolume),
        now + t.delay + 0.018
      );
      gain.gain.exponentialRampToValueAtTime(0.0001, now + t.delay + t.dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + t.delay);
      osc.stop(now + t.delay + t.dur + 0.01);
    });
  } catch {
    // Strictly optional audio polish
  }
}

function pickFeliceVoice(
  voices: SpeechSynthesisVoice[],
  style: FeliceVoiceStyle = 'kid'
): SpeechSynthesisVoice | null {
  if (!voices.length) return null;

  const preferredByStyle: Record<FeliceVoiceStyle, string[]> = {
    kid: [
      'Microsoft Ana',
      'Child',
      'Kid',
      'Samantha',
      'Tessa',
      'Microsoft Zira',
      'Microsoft Hazel',
      'Google UK English Female',
      'Microsoft Jenny'
    ],
    storyteller: [
      'Microsoft Jenny',
      'Microsoft Aria',
      'Microsoft Ana',
      'Google UK English Female',
      'Samantha',
      'Google US English',
      'Victoria',
      'Karen',
      'Microsoft Hazel',
      'Microsoft Zira'
    ]
  };

  for (const name of preferredByStyle[style]) {
    const match = voices.find((v) => v.name.includes(name));
    if (match) return match;
  }

  return (
    voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('en') &&
        /female|ana|jenny|aria|samantha|victoria|hazel|zira|child|kid/i.test(
          v.name
        )
    ) ||
    voices.find((v) => v.lang.toLowerCase().startsWith('en')) ||
    null
  );
}

export function useSpeech(
  enabled: boolean,
  voiceStyle: FeliceVoiceStyle = 'kid'
) {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    synthRef.current = synth;

    const refreshVoices = () => {
      voiceRef.current = pickFeliceVoice(synth.getVoices(), voiceStyle);
    };
    refreshVoices();
    synth.addEventListener?.('voiceschanged', refreshVoices);
    return () => {
      synth.removeEventListener?.('voiceschanged', refreshVoices);
      stopKidVoiceAudio();
      try {
        synth.cancel();
      } catch {
        // Ignore
      }
    };
  }, [voiceStyle]);

  useEffect(() => {
    if (!enabled) {
      cancelSpeechSynthesis();
    }
  }, [enabled]);

  const speak = useCallback(
    (text: string, options?: SpeakOptions) => {
      if (!enabled) return;
      try {
        activeSpeechGen += 1;
        const myGen = activeSpeechGen;
        stopKidVoiceAudio();
        synthRef.current?.cancel(); // Stop prior speech

        const speaker = options?.speaker ?? 'felice';
        const mode = options?.mode ?? 'ai';
        const effectiveStyle = options?.style ?? voiceStyle;
        const cleanText = text
          .replace(/\*[^*]*\*/g, '')
          .replace(/[*_#`]/g, '')
          .replace(/—/g, ', ')
          .replace(/\.\.\./g, ', ')
          .replace(/\s+/g, ' ')
          .trim();

        if (!cleanText) return;

        // Play genuine neural child/kid voiceover WAV clip when Kid Explorer style is active
        const kidMap = kidVoiceManifest as Record<string, string>;
        const kidClipUrl =
          speaker === 'felice' && effectiveStyle === 'kid'
            ? kidMap[cleanText]
            : undefined;

        if (kidClipUrl && typeof Audio !== 'undefined') {
          const contour: 'statement' | 'question' | 'exclaim' = cleanText.endsWith('?')
            ? 'question'
            : cleanText.endsWith('!')
              ? 'exclaim'
              : 'statement';
          if (options?.playChirp !== false) {
            playStorytellerSparkle(enabled, contour);
          }
          setAmbientSpeechDucking(true);
          const audio = new Audio(kidClipUrl);
          audio.volume = speechVolume;
          activeKidAudio = audio;
          audio.onended = () => {
            if (myGen === activeSpeechGen) {
              activeKidAudio = null;
              setAmbientSpeechDucking(false);
              options?.onEnd?.();
            }
          };
          audio.onerror = () => {
            if (myGen === activeSpeechGen) {
              activeKidAudio = null;
              setAmbientSpeechDucking(false);
            }
          };
          audio.play().catch(() => {
            setAmbientSpeechDucking(false);
          });
          return;
        }

        if (!synthRef.current) return;

        // Refresh voice list for the currently chosen Felice voice style
        const selectedVoice = pickFeliceVoice(
          synthRef.current.getVoices(),
          effectiveStyle
        );
        voiceRef.current = selectedVoice;

        if (speaker === 'system') {
          const utterance = new SpeechSynthesisUtterance(cleanText);
          if (selectedVoice) utterance.voice = selectedVoice;
          utterance.rate = 1.05;
          utterance.pitch = 0.94;
          utterance.volume = speechVolume;
          utterance.onend = () => {
            if (myGen === activeSpeechGen) {
              options?.onEnd?.();
            }
          };
          synthRef.current.speak(utterance);
          return;
        }

        // Expressive sentence-by-sentence cadence tailored to selected Felice voice preset
        const sentences = cleanText
          .match(/[^.!?]+[.!?]*/g)
          ?.map((s) => s.trim())
          .filter(Boolean) || [cleanText];

        const isLocal = Boolean(selectedVoice?.localService);
        let basePitch = 1.18;
        let baseRate = 0.97;
        let maxPitch = 1.44;

        if (effectiveStyle === 'kid') {
          basePitch = isLocal ? 1.52 : 1.38;
          baseRate = 1.05;
          maxPitch = 1.72;
        } else {
          // 'storyteller' warm guide explaining to kids
          basePitch = isLocal
            ? mode === 'robotic'
              ? 1.18
              : 1.24
            : mode === 'robotic'
              ? 1.12
              : 1.16;
          baseRate = mode === 'robotic' ? 0.94 : 0.97;
          maxPitch = 1.42;
        }

        setAmbientSpeechDucking(true);

        sentences.forEach((sentence, idx) => {
          if (myGen !== activeSpeechGen || !synthRef.current) return;
          const isQuestion = sentence.endsWith('?');
          const isExclaim = sentence.endsWith('!');
          const isLast = idx === sentences.length - 1;
          const contour: 'statement' | 'question' | 'exclaim' = isQuestion
            ? 'question'
            : isExclaim
              ? 'exclaim'
              : 'statement';

          const u = new SpeechSynthesisUtterance(sentence);
          if (selectedVoice) u.voice = selectedVoice;
          u.volume = speechVolume;
          u.pitch = Math.min(
            maxPitch,
            basePitch + (isQuestion ? 0.14 : isExclaim ? 0.09 : 0)
          );
          u.rate = isExclaim
            ? baseRate + 0.05
            : isQuestion
              ? baseRate - 0.01
              : baseRate;

          if (idx === 0 && options?.playChirp !== false) {
            playStorytellerSparkle(enabled, contour);
          }

          if (isLast) {
            u.onend = () => {
              if (myGen === activeSpeechGen) {
                setAmbientSpeechDucking(false);
                options?.onEnd?.();
              }
            };
            u.onerror = () => {
              if (myGen === activeSpeechGen) {
                setAmbientSpeechDucking(false);
              }
            };
          }

          synthRef.current.speak(u);
        });
      } catch (e) {
        console.warn('Speech synthesis error:', e);
      }
    },
    [enabled, voiceStyle]
  );

  const stop = useCallback(() => {
    cancelSpeechSynthesis();
  }, []);

  return { speak, stop };
}
