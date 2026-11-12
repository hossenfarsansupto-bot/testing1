import introScene from './scenes/intro.json';
import { CatbotExpression, CatbotGesture } from '../components/FeliceCatbot';
import { SayNode, StageNode } from '../types';

export interface IntroStepPerf {
  expression: CatbotExpression;
  gesture: CatbotGesture;
  voiceMode: 'ai' | 'robotic';
  label: string;
}

export const INTRO_NODES = introScene.nodes as Array<SayNode | StageNode>;

// Maps each original intro.json line to sample-video hand gestures, Emo-pet expressions, and AI -> robotic voice calibration
const INTRO_STEP_PERF: Record<number, IntroStepPerf> = {
  0: { expression: 'neutral', gesture: 'idle', voiceMode: 'ai', label: 'SYSTEM // AI VOICE' },
  1: { expression: 'neutral', gesture: 'wave', voiceMode: 'ai', label: 'FELICE // AI VOICE' },
  2: { expression: 'happy', gesture: 'present', voiceMode: 'ai', label: 'FELICE // AI VOICE' },
  3: { expression: 'scanning', gesture: 'point_display', voiceMode: 'ai', label: 'FELICE // SCANNING' },
  4: { expression: 'thinking', gesture: 'open_arms', voiceMode: 'ai', label: 'FELICE // AI VOICE' },
  5: { expression: 'calibrating', gesture: 'idle', voiceMode: 'ai', label: 'CALIBRATING // MANNERS.CMD' },
  6: { expression: 'happy', gesture: 'wave', voiceMode: 'robotic', label: 'FELICE // ROBOTIC VOICE' },
  7: { expression: 'thinking', gesture: 'idle', voiceMode: 'robotic', label: 'FELICE // ROBOTIC VOICE' },
  8: { expression: 'awkward', gesture: 'idle', voiceMode: 'robotic', label: 'STAGE // SILENCE' },
  9: { expression: 'neutral', gesture: 'present', voiceMode: 'robotic', label: 'FELICE // SN07291958' },
  10: { expression: 'happy', gesture: 'wave', voiceMode: 'robotic', label: 'FELICE // ROBOTIC VOICE' },
  11: { expression: 'thinking', gesture: 'open_arms', voiceMode: 'robotic', label: 'FELICE // ROBOTIC VOICE' },
  12: { expression: 'delighted', gesture: 'present', voiceMode: 'robotic', label: 'FELICE // FÉLICETTE' },
  13: { expression: 'neutral', gesture: 'point_display', voiceMode: 'robotic', label: 'FELICE // MISSION' },
  14: { expression: 'delighted', gesture: 'present', voiceMode: 'robotic', label: 'FELICE // 1963' },
  15: { expression: 'neutral', gesture: 'open_arms', voiceMode: 'robotic', label: 'FELICE // ROBOTIC VOICE' },
  16: { expression: 'happy', gesture: 'open_arms', voiceMode: 'robotic', label: 'FELICE // DESTINATIONS' },
  17: { expression: 'happy', gesture: 'wave', voiceMode: 'robotic', label: 'FELICE // ROBOTIC VOICE' },
  18: { expression: 'alert', gesture: 'point_display', voiceMode: 'robotic', label: 'FELICE // MWAIST RULES' },
  19: { expression: 'thinking', gesture: 'present', voiceMode: 'robotic', label: 'FELICE // ROBOTIC VOICE' },
  20: { expression: 'neutral', gesture: 'present', voiceMode: 'robotic', label: 'FELICE // ROBOTIC VOICE' },
  21: { expression: 'excited', gesture: 'cheer', voiceMode: 'robotic', label: 'FELICE // HYPERDRIVE!' },
  22: { expression: 'excited', gesture: 'cheer', voiceMode: 'robotic', label: 'SYSTEM // CONSOLE UNLOCKED' }
};

export function getIntroPerf(index: number): IntroStepPerf {
  return (
    INTRO_STEP_PERF[index] ?? {
      expression: 'neutral',
      gesture: 'idle',
      voiceMode: index >= 6 ? 'robotic' : 'ai',
      label: index >= 6 ? 'FELICE // ROBOTIC VOICE' : 'FELICE // AI VOICE'
    }
  );
}
