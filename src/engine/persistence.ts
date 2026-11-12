import { HubId, Settings, StoryNode } from '../types';
import { STORAGE_KEY } from '../content/config';
import { getScene } from '../content/scenes';

export interface SavedSubFrame {
  type: 'choice_response' | 'menu_item';
  nodes: StoryNode[];
  index: number;
  menuOptionId?: string;
  menuNodeIndex?: number;
}

export interface SavedState {
  screen: 'story' | 'hub' | 'end';
  completedSceneIds: string[];
  deepSpaceUnlocked: boolean;
  climaxDone: boolean;
  currentSceneId: string | null;
  currentNodeIndex: number;
  subStack?: SavedSubFrame[];
  visitedMenuOptions?: Record<string, string[]>;
  activeHub: HubId | null;
  settings: Settings;
  updatedAt?: number;
}

const HUB_DISPLAY_NAMES: Record<HubId, string> = {
  main: 'Main Ship Console',
  moon: 'Moon Surface Console',
  mars: 'Mars Surface Console',
  deep_space: 'Deep Space Console'
};

export function getSavedLocationLabel(saved: SavedState | null): string | null {
  if (!saved) return null;
  if (saved.screen === 'end') {
    return 'Voyage Complete Summary';
  }
  if (saved.screen === 'story' && saved.currentSceneId) {
    const scene = getScene(saved.currentSceneId);
    const title = scene?.title || saved.currentSceneId;
    const prefix =
      saved.activeHub && saved.activeHub !== 'main'
        ? HUB_DISPLAY_NAMES[saved.activeHub].replace(' Console', '')
        : null;
    const stepNum = (saved.currentNodeIndex || 0) + 1;
    return prefix ? `${prefix} • ${title} (Step ${stepNum})` : `${title} (Step ${stepNum})`;
  }
  if (saved.activeHub && HUB_DISPLAY_NAMES[saved.activeHub]) {
    return HUB_DISPLAY_NAMES[saved.activeHub];
  }
  return 'Main Ship Console';
}

export function loadProgress(): SavedState | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.completedSceneIds)) {
      return null;
    }

    if (data.settings) {
      const style = data.settings.feliceVoiceStyle;
      if (style !== 'kid' && style !== 'storyteller') {
        data.settings.feliceVoiceStyle = 'kid';
      }
      const vol = data.settings.volume;
      if (typeof vol !== 'number' || Number.isNaN(vol)) {
        data.settings.volume = 1;
      } else {
        data.settings.volume = Math.max(0, Math.min(1, vol));
      }
    }

    const inferredScreen: SavedState['screen'] =
      data.screen === 'story' || data.screen === 'hub' || data.screen === 'end'
        ? data.screen
        : data.currentSceneId && getScene(data.currentSceneId)
          ? 'story'
          : 'hub';

    const validScene =
      data.currentSceneId && getScene(data.currentSceneId)
        ? (data.currentSceneId as string)
        : null;

    return {
      screen: inferredScreen === 'story' && !validScene ? 'hub' : inferredScreen,
      completedSceneIds: data.completedSceneIds,
      deepSpaceUnlocked: Boolean(data.deepSpaceUnlocked),
      climaxDone: Boolean(data.climaxDone),
      currentSceneId: validScene,
      currentNodeIndex:
        typeof data.currentNodeIndex === 'number' && data.currentNodeIndex >= 0
          ? data.currentNodeIndex
          : 0,
      subStack: Array.isArray(data.subStack) ? data.subStack : [],
      visitedMenuOptions:
        data.visitedMenuOptions && typeof data.visitedMenuOptions === 'object'
          ? data.visitedMenuOptions
          : {},
      activeHub: data.activeHub || (inferredScreen === 'hub' ? 'main' : null),
      settings: data.settings,
      updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : undefined
    };
  } catch (e) {
    console.warn('Failed to parse saved story progress:', e);
  }
  return null;
}

export function saveProgress(state: SavedState): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save story progress:', e);
  }
}

export function clearProgress(): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear story progress:', e);
  }
}
