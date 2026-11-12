import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode
} from 'react';
import {
  HubId,
  Scene,
  Settings,
  StoryNode,
  ChoiceNode,
  MenuNode
} from '../types';
import { getScene } from '../content/scenes';
import {
  getNextStepAfterScene,
  SCENE_IDS
} from '../content/flow';
import {
  clearProgress,
  getSavedLocationLabel,
  loadProgress,
  saveProgress,
  SavedState
} from './persistence';

interface SubFrame {
  type: 'choice_response' | 'menu_item';
  nodes: StoryNode[];
  index: number;
  menuOptionId?: string;
  menuNodeIndex?: number;
}

export type ScreenState = 'title' | 'story' | 'hub' | 'end';

export interface HistorySnapshot {
  currentSceneId: string | null;
  currentNodeIndex: number;
  subStack: SubFrame[];
}

export interface State {
  screen: ScreenState;
  currentSceneId: string | null;
  currentNodeIndex: number;
  subStack: SubFrame[];
  nodeHistory: HistorySnapshot[];
  visitedMenuOptions: Record<string, string[]>; // key: sceneId_nodeIndex -> optionIds
  completedSceneIds: string[];
  deepSpaceUnlocked: boolean;
  climaxDone: boolean;
  activeHub: HubId | null;
  lockedMessage: string | null;
  settings: Settings;
  hasSavedGame: boolean;
  savedLocationLabel: string | null;
  pendingEntryChoice: boolean;
  isPaused: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  textSize: 'normal',
  typingSpeed: 'normal',
  reduceMotion: false,
  narration: true,
  soundEffects: true,
  feliceVoiceStyle: 'kid',
  volume: 1
};

const INITIAL_STATE: State = {
  screen: 'title',
  currentSceneId: null,
  currentNodeIndex: 0,
  subStack: [],
  nodeHistory: [],
  visitedMenuOptions: {},
  completedSceneIds: [],
  deepSpaceUnlocked: false,
  climaxDone: false,
  activeHub: null,
  lockedMessage: null,
  settings: DEFAULT_SETTINGS,
  hasSavedGame: false,
  savedLocationLabel: null,
  pendingEntryChoice: false,
  isPaused: false
};

function buildSavedSnapshot(state: State): SavedState {
  return {
    screen: state.screen === 'title' ? 'hub' : state.screen,
    completedSceneIds: state.completedSceneIds,
    deepSpaceUnlocked: state.deepSpaceUnlocked,
    climaxDone: state.climaxDone,
    currentSceneId: state.currentSceneId,
    currentNodeIndex: state.currentNodeIndex,
    subStack: state.subStack,
    visitedMenuOptions: state.visitedMenuOptions,
    activeHub: state.activeHub,
    settings: state.settings,
    updatedAt: Date.now()
  };
}

function pushHistory(
  history: HistorySnapshot[],
  snapshot: HistorySnapshot
): HistorySnapshot[] {
  const top = history[history.length - 1];
  if (
    top &&
    top.currentSceneId === snapshot.currentSceneId &&
    top.currentNodeIndex === snapshot.currentNodeIndex &&
    top.subStack.length === snapshot.subStack.length
  ) {
    return history;
  }
  const next = [...history, snapshot];
  return next.length > 150 ? next.slice(next.length - 150) : next;
}

function finishSceneTransition(
  state: State,
  scene: Scene,
  updatedHistory: HistorySnapshot[]
): State {
  const isAlreadyCompleted = state.completedSceneIds.includes(scene.id);
  const newCompleted = isAlreadyCompleted
    ? state.completedSceneIds
    : [...state.completedSceneIds, scene.id];

  if (scene.endsStory) {
    return {
      ...state,
      screen: 'end',
      completedSceneIds: newCompleted,
      nodeHistory: updatedHistory,
      hasSavedGame: true
    };
  }

  let deepSpaceUnlocked = state.deepSpaceUnlocked;
  if (scene.id === SCENE_IDS.DEEP_SPACE_UNLOCK) {
    deepSpaceUnlocked = true;
  }

  const nextStep = getNextStepAfterScene(
    scene.id,
    newCompleted,
    deepSpaceUnlocked,
    state.climaxDone
  );

  let nextScreen: ScreenState = 'hub';
  let nextSceneId: string | null = null;
  let nextHub: HubId | null = null;

  if (nextStep.type === 'open_hub') {
    nextScreen = 'hub';
    nextHub = nextStep.hub;
  } else if (nextStep.type === 'play_scene') {
    nextScreen = 'story';
    nextSceneId = nextStep.sceneId;
  } else if (nextStep.type === 'end_story') {
    nextScreen = 'end';
  }

  const nextClimaxDone =
    state.climaxDone || scene.id === SCENE_IDS.CLIMAX;

  return {
    ...state,
    screen: nextScreen,
    currentSceneId: nextSceneId,
    currentNodeIndex: 0,
    subStack: [],
    nodeHistory: nextScreen === 'story' ? updatedHistory : [],
    completedSceneIds: newCompleted,
    deepSpaceUnlocked,
    climaxDone: nextClimaxDone,
    activeHub: nextHub,
    lockedMessage: null,
    hasSavedGame: true
  };
}

export type Action =
  | { type: 'INIT_CHECK_SAVE' }
  | { type: 'ENTER_CONSOLE' }
  | { type: 'START_GAME'; sceneId?: string }
  | { type: 'CONTINUE_GAME' }
  | { type: 'PLAY_SCENE'; sceneId: string; preserveHistory?: boolean }
  | { type: 'COMPLETE_SCENE'; sceneId: string }
  | { type: 'OPEN_HUB'; hub: HubId }
  | { type: 'ADVANCE_NODE' }
  | { type: 'PREVIOUS_NODE' }
  | { type: 'CHOOSE_OPTION'; optionIndex: number }
  | { type: 'CHOOSE_MENU_OPTION'; optionId: string }
  | { type: 'SET_LOCKED_MESSAGE'; message: string | null }
  | { type: 'SET_PAUSED'; paused: boolean }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<Settings> }
  | { type: 'RESTART_JOURNEY' }
  | { type: 'RETURN_TO_HUB' }
  | { type: 'RETURN_TO_TITLE' }
  | { type: 'BACK_FROM_END' }
  | { type: 'DEBUG_SET_STATE'; payload: Partial<State> };

function storyReducer(state: State, action: Action): State {
  const next = baseStoryReducer(state, action);
  if (
    action.type === 'START_GAME' ||
    action.type === 'CONTINUE_GAME' ||
    action.type === 'PLAY_SCENE' ||
    action.type === 'COMPLETE_SCENE' ||
    action.type === 'OPEN_HUB' ||
    action.type === 'ADVANCE_NODE' ||
    action.type === 'PREVIOUS_NODE' ||
    action.type === 'CHOOSE_OPTION' ||
    action.type === 'CHOOSE_MENU_OPTION' ||
    action.type === 'RESTART_JOURNEY' ||
    action.type === 'RETURN_TO_HUB' ||
    action.type === 'RETURN_TO_TITLE' ||
    action.type === 'BACK_FROM_END'
  ) {
    return next.isPaused ? { ...next, isPaused: false } : next;
  }
  return next;
}

function baseStoryReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INIT_CHECK_SAVE': {
      const saved = loadProgress();
      return {
        ...state,
        hasSavedGame: !!saved,
        savedLocationLabel: getSavedLocationLabel(saved),
        settings: saved?.settings || state.settings
      };
    }

    case 'ENTER_CONSOLE': {
      const saved = loadProgress();
      return {
        ...state,
        screen: 'hub',
        activeHub: 'main',
        pendingEntryChoice: true,
        lockedMessage: null,
        hasSavedGame: Boolean(saved),
        savedLocationLabel: getSavedLocationLabel(saved)
      };
    }

    case 'START_GAME': {
      clearProgress();
      const startSceneId = action.sceneId || SCENE_IDS.INTRO;
      return {
        ...state,
        screen: 'story',
        currentSceneId: startSceneId,
        currentNodeIndex: 0,
        subStack: [],
        nodeHistory: [],
        visitedMenuOptions: {},
        completedSceneIds: [],
        deepSpaceUnlocked: false,
        climaxDone: false,
        activeHub: null,
        lockedMessage: null,
        hasSavedGame: false,
        savedLocationLabel: null,
        pendingEntryChoice: false
      };
    }

    case 'CONTINUE_GAME': {
      const saved = loadProgress();
      if (!saved) return state;

      if (saved.screen === 'story' && saved.currentSceneId && getScene(saved.currentSceneId)) {
        return {
          ...state,
          screen: 'story',
          currentSceneId: saved.currentSceneId,
          currentNodeIndex: saved.currentNodeIndex || 0,
          subStack: Array.isArray(saved.subStack) ? (saved.subStack as SubFrame[]) : [],
          nodeHistory: [],
          visitedMenuOptions: saved.visitedMenuOptions || {},
          completedSceneIds: saved.completedSceneIds,
          deepSpaceUnlocked: saved.deepSpaceUnlocked,
          climaxDone: saved.climaxDone,
          activeHub: saved.activeHub,
          lockedMessage: null,
          hasSavedGame: true,
          savedLocationLabel: getSavedLocationLabel(saved),
          pendingEntryChoice: false,
          settings: saved.settings || state.settings
        };
      }

      if (saved.screen === 'end') {
        return {
          ...state,
          screen: 'end',
          currentSceneId: saved.currentSceneId,
          currentNodeIndex: saved.currentNodeIndex || 0,
          subStack: [],
          nodeHistory: [],
          visitedMenuOptions: saved.visitedMenuOptions || {},
          completedSceneIds: saved.completedSceneIds,
          deepSpaceUnlocked: saved.deepSpaceUnlocked,
          climaxDone: saved.climaxDone,
          activeHub: saved.activeHub || 'main',
          lockedMessage: null,
          hasSavedGame: true,
          savedLocationLabel: getSavedLocationLabel(saved),
          pendingEntryChoice: false,
          settings: saved.settings || state.settings
        };
      }

      return {
        ...state,
        screen: 'hub',
        activeHub: saved.activeHub || 'main',
        currentSceneId: null,
        currentNodeIndex: 0,
        subStack: [],
        nodeHistory: [],
        visitedMenuOptions: saved.visitedMenuOptions || {},
        completedSceneIds: saved.completedSceneIds,
        deepSpaceUnlocked: saved.deepSpaceUnlocked,
        climaxDone: saved.climaxDone,
        lockedMessage: null,
        hasSavedGame: true,
        savedLocationLabel: getSavedLocationLabel(saved),
        pendingEntryChoice: false,
        settings: saved.settings || state.settings
      };
    }

    case 'PLAY_SCENE': {
      return {
        ...state,
        screen: 'story',
        currentSceneId: action.sceneId,
        currentNodeIndex: 0,
        subStack: [],
        nodeHistory: action.preserveHistory ? state.nodeHistory : [],
        lockedMessage: null,
        pendingEntryChoice: false
      };
    }

    case 'OPEN_HUB': {
      return {
        ...state,
        screen: 'hub',
        activeHub: action.hub,
        currentSceneId: null,
        currentNodeIndex: 0,
        subStack: [],
        nodeHistory: [],
        lockedMessage: null,
        pendingEntryChoice: false
      };
    }

    case 'RETURN_TO_HUB': {
      const targetHub = state.activeHub || 'main';
      return {
        ...state,
        screen: 'hub',
        activeHub: targetHub,
        currentSceneId: null,
        currentNodeIndex: 0,
        subStack: [],
        nodeHistory: [],
        lockedMessage: null,
        pendingEntryChoice: false
      };
    }

    case 'RETURN_TO_TITLE': {
      const snapshot =
        state.screen !== 'title' && !state.pendingEntryChoice
          ? buildSavedSnapshot(state)
          : loadProgress();
      if (snapshot && state.screen !== 'title' && !state.pendingEntryChoice) {
        saveProgress(snapshot);
      }
      return {
        ...state,
        screen: 'title',
        lockedMessage: null,
        hasSavedGame: Boolean(snapshot),
        savedLocationLabel: getSavedLocationLabel(snapshot),
        pendingEntryChoice: false
      };
    }

    case 'BACK_FROM_END': {
      if (state.nodeHistory.length > 0) {
        const last = state.nodeHistory[state.nodeHistory.length - 1];
        return {
          ...state,
          screen: 'story',
          currentSceneId: last.currentSceneId,
          currentNodeIndex: last.currentNodeIndex,
          subStack: last.subStack,
          nodeHistory: state.nodeHistory.slice(0, -1),
          lockedMessage: null
        };
      }
      return {
        ...state,
        screen: 'hub',
        activeHub: 'main',
        currentSceneId: null,
        currentNodeIndex: 0,
        subStack: [],
        lockedMessage: null
      };
    }

    case 'SET_LOCKED_MESSAGE': {
      return {
        ...state,
        lockedMessage: action.message
      };
    }

    case 'SET_PAUSED': {
      return {
        ...state,
        isPaused: action.paused
      };
    }

    case 'UPDATE_SETTINGS': {
      const newSettings = { ...state.settings, ...action.settings };
      if (state.screen === 'title' || state.pendingEntryChoice) {
        const existing = loadProgress();
        if (existing) {
          saveProgress({ ...existing, settings: newSettings });
        }
      }
      return {
        ...state,
        settings: newSettings
      };
    }

    case 'RESTART_JOURNEY': {
      clearProgress();
      return {
        ...INITIAL_STATE,
        settings: state.settings,
        hasSavedGame: false,
        savedLocationLabel: null
      };
    }

    case 'CHOOSE_OPTION': {
      if (!state.currentSceneId) return state;
      const scene = getScene(state.currentSceneId);
      if (!scene) return state;

      let currentNode: StoryNode | undefined;
      if (state.subStack.length > 0) {
        const top = state.subStack[state.subStack.length - 1];
        currentNode = top.nodes[top.index];
      } else {
        currentNode = scene.nodes[state.currentNodeIndex];
      }

      if (!currentNode || currentNode.type !== 'choice') return state;

      const choiceNode = currentNode as ChoiceNode;
      const selectedOption = choiceNode.options[action.optionIndex];
      if (!selectedOption) return state;

      if (selectedOption.response && selectedOption.response.length > 0) {
        return {
          ...state,
          nodeHistory: pushHistory(state.nodeHistory, {
            currentSceneId: state.currentSceneId,
            currentNodeIndex: state.currentNodeIndex,
            subStack: state.subStack
          }),
          subStack: [
            ...state.subStack,
            {
              type: 'choice_response',
              nodes: selectedOption.response,
              index: 0
            }
          ]
        };
      }

      // If no response nodes, advance immediately
      return storyReducer(state, { type: 'ADVANCE_NODE' });
    }

    case 'CHOOSE_MENU_OPTION': {
      if (!state.currentSceneId) return state;
      const scene = getScene(state.currentSceneId);
      if (!scene) return state;

      let currentNode: StoryNode | undefined;
      if (state.subStack.length > 0) {
        const top = state.subStack[state.subStack.length - 1];
        currentNode = top.nodes[top.index];
      } else {
        currentNode = scene.nodes[state.currentNodeIndex];
      }

      if (!currentNode || currentNode.type !== 'menu') return state;

      const menuNode = currentNode as MenuNode;
      const opt = menuNode.options.find(o => o.id === action.optionId);
      if (!opt) return state;

      return {
        ...state,
        nodeHistory: pushHistory(state.nodeHistory, {
          currentSceneId: state.currentSceneId,
          currentNodeIndex: state.currentNodeIndex,
          subStack: state.subStack
        }),
        subStack: [
          ...state.subStack,
          {
            type: 'menu_item',
            nodes: opt.nodes,
            index: 0,
            menuOptionId: opt.id,
            menuNodeIndex: state.currentNodeIndex
          }
        ]
      };
    }

    case 'PREVIOUS_NODE': {
      if (state.nodeHistory.length > 0) {
        const last = state.nodeHistory[state.nodeHistory.length - 1];
        return {
          ...state,
          screen: 'story',
          currentSceneId: last.currentSceneId,
          currentNodeIndex: last.currentNodeIndex,
          subStack: last.subStack,
          nodeHistory: state.nodeHistory.slice(0, -1)
        };
      }
      if (state.subStack.length > 0) {
        const newStack = [...state.subStack];
        const topFrame = { ...newStack[newStack.length - 1] };
        if (topFrame.index > 0) {
          topFrame.index -= 1;
          newStack[newStack.length - 1] = topFrame;
        } else {
          newStack.pop();
        }
        return { ...state, subStack: newStack };
      }
      if (state.currentNodeIndex > 0) {
        return {
          ...state,
          currentNodeIndex: state.currentNodeIndex - 1
        };
      }
      // At node 0: return cleanly to active hub
      return {
        ...state,
        screen: 'hub',
        activeHub: state.activeHub || 'main',
        currentSceneId: null,
        currentNodeIndex: 0,
        subStack: [],
        lockedMessage: null
      };
    }

    case 'ADVANCE_NODE': {
      if (!state.currentSceneId) return state;
      const scene = getScene(state.currentSceneId);
      if (!scene) return state;

      const updatedHistory = pushHistory(state.nodeHistory, {
        currentSceneId: state.currentSceneId,
        currentNodeIndex: state.currentNodeIndex,
        subStack: state.subStack
      });

      // Handle subframe (choice response or menu option play)
      if (state.subStack.length > 0) {
        const newStack = [...state.subStack];
        const topFrame = { ...newStack[newStack.length - 1] };

        if (topFrame.index + 1 < topFrame.nodes.length) {
          topFrame.index += 1;
          newStack[newStack.length - 1] = topFrame;
          return { ...state, subStack: newStack, nodeHistory: updatedHistory };
        }

        // Top frame finished
        newStack.pop();

        if (topFrame.type === 'choice_response') {
          // Choice responses converge back to next root node
          return storyReducer(
            { ...state, subStack: newStack, nodeHistory: updatedHistory },
            { type: 'ADVANCE_NODE' }
          );
        }

        if (topFrame.type === 'menu_item' && topFrame.menuOptionId) {
          // Record visited menu option
          const key = `${state.currentSceneId}_${topFrame.menuNodeIndex ?? state.currentNodeIndex}`;
          const currentVisited = state.visitedMenuOptions[key] || [];
          const updatedVisited = currentVisited.includes(topFrame.menuOptionId)
            ? currentVisited
            : [...currentVisited, topFrame.menuOptionId];

          const newVisitedMap = {
            ...state.visitedMenuOptions,
            [key]: updatedVisited
          };

          // Check if all options visited
          const menuNode = scene.nodes[topFrame.menuNodeIndex ?? state.currentNodeIndex] as MenuNode;
          const allVisited =
            menuNode &&
            menuNode.options.every(o => updatedVisited.includes(o.id));

          if (allVisited) {
            // Advance beyond the menu
            return storyReducer(
              { ...state, subStack: newStack, visitedMenuOptions: newVisitedMap, nodeHistory: updatedHistory },
              { type: 'ADVANCE_NODE' }
            );
          }

          // Otherwise return to menu
          return {
            ...state,
            subStack: newStack,
            visitedMenuOptions: newVisitedMap,
            nodeHistory: updatedHistory
          };
        }

        return { ...state, subStack: newStack, nodeHistory: updatedHistory };
      }

      // Root scene level advance
      const currentNode = scene.nodes[state.currentNodeIndex];

      // Goto transition
      if (currentNode && currentNode.type === 'goto') {
        return storyReducer(
          { ...state, nodeHistory: updatedHistory },
          {
            type: 'PLAY_SCENE',
            sceneId: currentNode.scene,
            preserveHistory: true
          }
        );
      }

      // Check if more nodes remain in scene
      if (state.currentNodeIndex + 1 < scene.nodes.length) {
        const nextNode = scene.nodes[state.currentNodeIndex + 1];
        if (nextNode && nextNode.type === 'goto') {
          return storyReducer(
            { ...state, nodeHistory: updatedHistory },
            {
              type: 'PLAY_SCENE',
              sceneId: nextNode.scene,
              preserveHistory: true
            }
          );
        }
        return {
          ...state,
          currentNodeIndex: state.currentNodeIndex + 1,
          nodeHistory: updatedHistory
        };
      }

      // SCENE FINISHED!
      return finishSceneTransition(state, scene, updatedHistory);
    }

    case 'COMPLETE_SCENE': {
      const targetScene = getScene(action.sceneId);
      if (!targetScene) return state;
      return finishSceneTransition(state, targetScene, []);
    }

    case 'DEBUG_SET_STATE': {
      return {
        ...state,
        ...action.payload
      };
    }

    default:
      return state;
  }
}

interface StoryContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
  getCurrentNode: () => StoryNode | null;
  getCurrentScene: () => Scene | null;
}

const StoryContext = createContext<StoryContextType | null>(null);

export function StoryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storyReducer, INITIAL_STATE);

  useEffect(() => {
    dispatch({ type: 'INIT_CHECK_SAVE' });
  }, []);

  useEffect(() => {
    if (state.screen === 'title' || state.pendingEntryChoice) return;
    saveProgress(buildSavedSnapshot(state));
  }, [
    state.screen,
    state.pendingEntryChoice,
    state.completedSceneIds,
    state.deepSpaceUnlocked,
    state.climaxDone,
    state.currentSceneId,
    state.currentNodeIndex,
    state.subStack,
    state.visitedMenuOptions,
    state.activeHub,
    state.settings
  ]);

  const getCurrentScene = (): Scene | null => {
    if (!state.currentSceneId) return null;
    return getScene(state.currentSceneId) || null;
  };

  const getCurrentNode = (): StoryNode | null => {
    if (state.subStack.length > 0) {
      const top = state.subStack[state.subStack.length - 1];
      return top.nodes[top.index] || null;
    }
    const scene = getCurrentScene();
    if (!scene) return null;
    return scene.nodes[state.currentNodeIndex] || null;
  };

  return (
    <StoryContext.Provider
      value={{
        state,
        dispatch,
        getCurrentNode,
        getCurrentScene
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}

export function useStory() {
  const ctx = useContext(StoryContext);
  if (!ctx) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return ctx;
}
