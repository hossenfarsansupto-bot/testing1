export type Speaker = 'felice' | 'system';

export type Theme =
  | 'ship'
  | 'moon'
  | 'mars'
  | 'deep_space'
  | 'alarm'
  | 'home_stretch';

export interface SayNode {
  type: 'say';
  speaker: Speaker;
  text: string;
  list?: string[];
  mediaCue?: string;
}

export interface StageNode {
  type: 'stage';
  text: string;
  mediaCue?: string;
}

export interface ChoiceOption {
  label: string;
  correct?: boolean;
  response: StoryNode[];
}

export interface ChoiceNode {
  type: 'choice';
  prompt?: string;
  mediaCue?: string;
  options: ChoiceOption[];
}

export interface MenuOption {
  id: string;
  label: string;
  nodes: StoryNode[];
}

export interface MenuNode {
  type: 'menu';
  prompt: string;
  mode: 'visitAll';
  mediaCue?: string;
  options: MenuOption[];
}

export interface GotoNode {
  type: 'goto';
  scene: string;
}

export type StoryNode = SayNode | StageNode | ChoiceNode | MenuNode | GotoNode;

export interface Scene {
  id: string;
  title: string;
  theme: Theme;
  endsStory?: boolean;
  nodes: StoryNode[];
}

export type TextSize = 'small' | 'normal' | 'large';
export type TypingSpeed = 'normal' | 'fast' | 'instant';
export type FeliceVoiceStyle = 'kid' | 'storyteller';

export interface Settings {
  textSize: TextSize;
  typingSpeed: TypingSpeed;
  reduceMotion: boolean;
  narration: boolean;
  soundEffects?: boolean;
  feliceVoiceStyle?: FeliceVoiceStyle;
  volume?: number;
}

export type HubId = 'main' | 'moon' | 'mars' | 'deep_space';

export interface HubCard {
  id: string;
  label: string;
  description?: string;
  targetHub?: HubId;
  targetScene?: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  lockReason?: string;
  badgeText?: string;
}

export interface StoryProgress {
  completedSceneIds: string[];
  deepSpaceUnlocked: boolean;
  climaxDone: boolean;
  currentSceneId: string | null;
  currentNodeIndex: number;
  activeHub: HubId | null;
}
