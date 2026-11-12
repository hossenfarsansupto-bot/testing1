import React, { useState, useEffect, useRef } from 'react';
import { useStory } from './engine/storyState';
import {
  cancelSpeechSynthesis,
  setSpeechVolume,
  useSpeech
} from './engine/useSpeech';
import { TitleScreen } from './components/TitleScreen';
import { HubMenu, RoverDriveState, TravelState } from './components/HubMenu';
import { StoryPlayer } from './components/StoryPlayer';
import { EndScreen } from './components/EndScreen';
import { SettingsPanel } from './components/SettingsPanel';
import { DebugPanel } from './components/DebugPanel';
import { MainConsoleBackground } from './components/MainConsoleBackground';
import {
  DeepSpaceProbeId,
  TravelDestination,
  TravelPhase
} from './components/RealisticWindowCanvas';
import { OutsideEvaScene } from './components/OutsideEvaScene';
import { SpaceshipIntroOverlay } from './components/SpaceshipIntroOverlay';
import { EarthTransmissionOverlay } from './components/EarthTransmissionOverlay';
import { HubCard } from './types';
import { SCENE_IDS } from './content/flow';
import {
  ClickSfxKind,
  playClickSfx,
  playTransitionSfx,
  setMasterVolume,
  setSoundEffectsEnabled,
  startAmbientSpaceAudio,
  startEmergencyBeepLoop,
  stopAmbientSpaceAudio,
  stopEmergencyBeepLoop
} from './engine/soundEffects';

const OUTSIDE_EVA_SCENE_IDS = new Set<string>([
  SCENE_IDS.MOON_RETRO,
  SCENE_IDS.MOON_ALSEP,
  SCENE_IDS.MARS_VIKING,
  SCENE_IDS.MARS_SOJOURNER,
  SCENE_IDS.MARS_PHOENIX
]);

const CONSOLE_MISSION_SCENE_IDS = new Set<string>([
  SCENE_IDS.DS_PIONEER,
  SCENE_IDS.DS_VOYAGER,
  SCENE_IDS.DS_BLOCKED
]);

function getDestinationFromCardId(
  cardId: string
): TravelState['destination'] {
  if (cardId === 'main_mars') return 'mars';
  if (cardId === 'main_deep_space') return 'deep_space';
  return 'moon';
}

function getDestinationFromSceneId(sceneId: string | null): TravelDestination {
  if (sceneId?.startsWith('mars_')) return 'mars';
  if (sceneId?.startsWith('ds_')) return 'deep_space';
  return 'moon';
}

export const AppContent: React.FC = () => {
  const { state, dispatch, getCurrentNode, getCurrentScene } = useStory();
  const { speak, stop: stopSpeech } = useSpeech(
    state.settings.narration,
    state.settings.feliceVoiceStyle ?? 'kid'
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [spaceshipIntroActive, setSpaceshipIntroActive] = useState(false);
  const [pendingFreshLaunch, setPendingFreshLaunch] = useState(false);
  const [travelState, setTravelState] = useState<TravelState | null>(null);
  const [roverDrive, setRoverDrive] = useState<RoverDriveState | null>(null);
  const [evaCurtainPhase, setEvaCurtainPhase] = useState<
    'none' | 'dimming' | 'revealing'
  >('none');
  const travelTimersRef = useRef<number[]>([]);
  const evaTimersRef = useRef<number[]>([]);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const isInOutsideEva =
    state.screen === 'story' &&
    Boolean(state.currentSceneId) &&
    OUTSIDE_EVA_SCENE_IDS.has(state.currentSceneId!);

  const isInConsoleMission =
    state.screen === 'story' &&
    Boolean(state.currentSceneId) &&
    CONSOLE_MISSION_SCENE_IDS.has(state.currentSceneId!);

  const isEarthUnlockScene =
    state.screen === 'story' &&
    state.currentSceneId === SCENE_IDS.DEEP_SPACE_UNLOCK;

  const missionScene = isInOutsideEva ? getCurrentScene() : null;
  const missionNode = isInOutsideEva ? getCurrentNode() : null;
  const consoleMissionScene = isInConsoleMission ? getCurrentScene() : null;
  const consoleMissionNode = isInConsoleMission ? getCurrentNode() : null;
  const unlockScene = isEarthUnlockScene ? getCurrentScene() : null;
  const unlockNode = isEarthUnlockScene ? getCurrentNode() : null;

  const deepSpaceProbe: DeepSpaceProbeId =
    state.currentSceneId === SCENE_IDS.DS_PIONEER
      ? 'pioneer'
      : state.currentSceneId === SCENE_IDS.DS_VOYAGER
        ? 'voyager'
        : null;

  const clearTravelTimers = () => {
    travelTimersRef.current.forEach((id) => clearTimeout(id));
    travelTimersRef.current = [];
  };

  const clearEvaTimers = () => {
    evaTimersRef.current.forEach((id) => clearTimeout(id));
    evaTimersRef.current = [];
  };

  useEffect(() => {
    return () => {
      clearTravelTimers();
      clearEvaTimers();
    };
  }, []);

  useEffect(() => {
    if (!isInOutsideEva) {
      setRoverDrive(null);
    }
  }, [isInOutsideEva]);

  const hasUserInteractedRef = useRef(false);

  useEffect(() => {
    const enabled = state.settings.soundEffects !== false;
    setSoundEffectsEnabled(enabled);
    if (enabled && hasUserInteractedRef.current) {
      startAmbientSpaceAudio();
    } else if (!enabled) {
      stopAmbientSpaceAudio();
    }
  }, [state.settings.soundEffects]);

  useEffect(() => {
    const vol = state.settings.volume ?? 1;
    setMasterVolume(vol);
    setSpeechVolume(vol);
  }, [state.settings.volume]);

  // Global sound effect for every button / interactive control click
  useEffect(() => {
    const ensureAmbientStarted = () => {
      if (!hasUserInteractedRef.current) {
        hasUserInteractedRef.current = true;
        if (state.settings.soundEffects !== false) {
          startAmbientSpaceAudio();
        }
      }
    };

    const classifyTarget = (el: HTMLElement): ClickSfxKind | null => {
      const btn = el.closest(
        'button, [role="button"], a.nasa-source-link, a.nasa-source-pill-link'
      ) as HTMLElement | null;
      if (!btn) return null;
      if (btn instanceof HTMLButtonElement && btn.disabled) return null;
      if (btn.classList.contains('crt-launch-button')) return 'launch';
      if (btn.classList.contains('locked')) return 'locked';
      if (
        btn.classList.contains('back') ||
        btn.classList.contains('pad-back-btn') ||
        btn.classList.contains('hub-back-button')
      ) {
        return 'back';
      }
      if (btn.classList.contains('next')) return 'next';
      if (
        btn.classList.contains('choice-option-btn') ||
        btn.classList.contains('pad-mission-choice-btn') ||
        btn.classList.contains('menu-option-btn')
      ) {
        return 'choice';
      }
      return 'default';
    };

    const onPointerClick = (e: MouseEvent) => {
      ensureAmbientStarted();
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const kind = classifyTarget(target);
      if (kind) playClickSfx(kind);
    };

    const onKeyActivate = (e: KeyboardEvent) => {
      ensureAmbientStarted();
      if (e.key !== 'Enter' && e.code !== 'Space') return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const kind = classifyTarget(target);
      if (kind) playClickSfx(kind);
    };

    document.addEventListener('click', onPointerClick, true);
    document.addEventListener('keydown', onKeyActivate, true);
    return () => {
      document.removeEventListener('click', onPointerClick, true);
      document.removeEventListener('keydown', onKeyActivate, true);
      stopAmbientSpaceAudio();
    };
  }, [state.settings.soundEffects]);

  // Page & scene transition sound effects
  const prevNavKeyRef = useRef<string | null>(null);
  useEffect(() => {
    const navKey = `${state.screen}|${state.activeHub ?? ''}|${
      state.currentSceneId ?? ''
    }|${spaceshipIntroActive}`;
    if (prevNavKeyRef.current === null) {
      prevNavKeyRef.current = navKey;
      return;
    }
    if (prevNavKeyRef.current !== navKey) {
      prevNavKeyRef.current = navKey;
      cancelSpeechSynthesis();
      if (state.screen === 'end') {
        playTransitionSfx('scene_end');
      } else {
        playTransitionSfx('page');
      }
    }
  }, [state.screen, state.activeHub, state.currentSceneId, spaceshipIntroActive]);

  const prevTravelPhaseRef = useRef<string | null>(null);
  useEffect(() => {
    const phase = travelState?.phase ?? null;
    if (phase && phase !== prevTravelPhaseRef.current) {
      playTransitionSfx(phase);
    }
    prevTravelPhaseRef.current = phase;
  }, [travelState?.phase]);

  // Continuous emergency alarm beeping while descending from Moon/Mars orbit to surface
  useEffect(() => {
    const isPlanetLandingEmergency =
      (travelState?.destination === 'moon' || travelState?.destination === 'mars') &&
      (travelState.phase === 'turbulence' || travelState.phase === 'blackout') &&
      state.settings.soundEffects !== false;

    if (isPlanetLandingEmergency) {
      startEmergencyBeepLoop(travelState?.phase === 'blackout');
    } else {
      stopEmergencyBeepLoop();
    }

    return () => {
      stopEmergencyBeepLoop();
    };
  }, [travelState?.destination, travelState?.phase, state.settings.soundEffects]);

  const prevEvaCurtainRef = useRef<string>('none');
  useEffect(() => {
    if (evaCurtainPhase === 'dimming' && prevEvaCurtainRef.current !== 'dimming') {
      playTransitionSfx('eva_enter');
    }
    prevEvaCurtainRef.current = evaCurtainPhase;
  }, [evaCurtainPhase]);

  useEffect(() => {
    // Ensure Android/mobile browsers never lock orientation and obey device sensor auto-rotate
    try {
      const orientation = screen?.orientation as ScreenOrientation & { unlock?: () => void };
      if (orientation && typeof orientation.unlock === 'function') {
        orientation.unlock();
      }
    } catch {
      // Non-fullscreen browser contexts throw or no-op safely
    }
    // Check for ?debug=1 in query string
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('debug') === '1') {
        setShowDebug(true);
      }
    }
  }, []);

  const handleStart = () => {
    if (pendingFreshLaunch) {
      setPendingFreshLaunch(false);
      dispatch({ type: 'START_GAME', sceneId: SCENE_IDS.INTRO });
      dispatch({ type: 'OPEN_HUB', hub: 'main' });
      setSpaceshipIntroActive(true);
      return;
    }
    setSpaceshipIntroActive(false);
    dispatch({ type: 'ENTER_CONSOLE' });
  };

  const handleContinue = () => {
    setPendingFreshLaunch(false);
    setSpaceshipIntroActive(false);
    dispatch({ type: 'CONTINUE_GAME' });
  };

  const handleNewJourney = () => {
    stopSpeech();
    clearTravelTimers();
    clearEvaTimers();
    pendingActionRef.current = null;
    setTravelState(null);
    setRoverDrive(null);
    setSpaceshipIntroActive(false);
    setPendingFreshLaunch(true);
    dispatch({ type: 'RESTART_JOURNEY' });
  };

  const finishTravel = () => {
    clearTravelTimers();
    setTravelState(null);
    const pending = pendingActionRef.current;
    pendingActionRef.current = null;
    if (pending) {
      pending();
    }
  };

  const startCockpitTravel = (
    cardId: string,
    destination: TravelDestination,
    label: string,
    onArrive: () => void
  ) => {
    clearTravelTimers();
    pendingActionRef.current = onArrive;
    setTravelState({
      cardId,
      destination,
      label,
      phase: 'hyperspace'
    });

    const setPhase = (phase: TravelState['phase']) => {
      setTravelState((prev) => (prev ? { ...prev, phase } : null));
    };

    if (destination === 'deep_space') {
      const cruiseTimer = window.setTimeout(() => setPhase('orbiting'), 2200);
      const arriveTimer = window.setTimeout(() => {
        finishTravel();
      }, 4800);
      travelTimersRef.current = [cruiseTimer, arriveTimer];
      return;
    }

    const orbitTimer = window.setTimeout(() => setPhase('orbiting'), 2000);
    const turbTimer = window.setTimeout(() => setPhase('turbulence'), 4000);
    const blackoutTimer = window.setTimeout(() => setPhase('blackout'), 6000);
    const revealTimer = window.setTimeout(
      () => setPhase('surface_reveal'),
      9000
    );
    const arriveTimer = window.setTimeout(() => {
      finishTravel();
    }, 13500);

    travelTimersRef.current = [
      orbitTimer,
      turbTimer,
      blackoutTimer,
      revealTimer,
      arriveTimer
    ];
  };

  const handleSelectCard = (card: HubCard, index: number) => {
    if (travelState || roverDrive?.isDriving) return;

    if (!card.isUnlocked) {
      if (card.lockReason) {
        dispatch({ type: 'SET_LOCKED_MESSAGE', message: card.lockReason });
      }
      return;
    }

    const executeTransition = () => {
      if (card.targetHub) {
        dispatch({ type: 'OPEN_HUB', hub: card.targetHub });
      } else if (card.targetScene) {
        dispatch({ type: 'PLAY_SCENE', sceneId: card.targetScene });
      }
    };

    // Moon / Mars surface destinations roll the rover outside into OutsideEvaScene;
    // Deep Space stays inside the Console so Felice describes Pioneer / Voyager floating outside the window.
    if (
      state.activeHub !== 'main' &&
      state.activeHub !== 'deep_space' &&
      card.targetScene
    ) {
      clearEvaTimers();
      const targetSceneId = card.targetScene;

      if (state.settings.reduceMotion) {
        dispatch({ type: 'PLAY_SCENE', sceneId: targetSceneId });
        return;
      }

      const direction: 'left' | 'right' = index % 2 === 0 ? 'left' : 'right';
      setRoverDrive({
        direction,
        hardwareId: targetSceneId,
        cardId: card.id,
        label: card.label,
        isDriving: true
      });
      setEvaCurtainPhase('dimming');

      const enterOutsideTimer = window.setTimeout(() => {
        dispatch({ type: 'PLAY_SCENE', sceneId: targetSceneId });
        setRoverDrive(null);
        setEvaCurtainPhase('revealing');
      }, 1200);

      const clearCurtainTimer = window.setTimeout(() => {
        setEvaCurtainPhase('none');
      }, 2100);

      evaTimersRef.current = [enterOutsideTimer, clearCurtainTimer];
      return;
    }

    // Sequential cockpit journey when launching from Main Console:
    if (state.activeHub === 'main' && !state.settings.reduceMotion) {
      startCockpitTravel(
        card.id,
        getDestinationFromCardId(card.id),
        card.label,
        executeTransition
      );
      return;
    }

    executeTransition();
  };

  const handleAdvanceDeepSpaceUnlock = () => {
    if (
      unlockScene &&
      state.currentNodeIndex + 1 >= unlockScene.nodes.length
    ) {
      dispatch({ type: 'ADVANCE_NODE' });
      const launchPioneer = () => {
        dispatch({ type: 'PLAY_SCENE', sceneId: SCENE_IDS.DS_PIONEER });
      };
      if (!state.settings.reduceMotion) {
        startCockpitTravel(
          'main_deep_space',
          'deep_space',
          'Deep Space',
          launchPioneer
        );
      } else {
        launchPioneer();
      }
      return;
    }
    dispatch({ type: 'ADVANCE_NODE' });
  };

  const handleAdvanceMission = () => {
    dispatch({ type: 'ADVANCE_NODE' });
  };

  const handleChooseMissionOption = (optionIndex: number) => {
    dispatch({ type: 'CHOOSE_OPTION', optionIndex });
  };

  const handleExitMission = () => {
    stopSpeech();
    clearEvaTimers();
    setEvaCurtainPhase('none');
    setRoverDrive(null);
    dispatch({ type: 'RETURN_TO_HUB' });
  };

  const handleMarkMissionComplete = (sceneId: string) => {
    stopSpeech();
    clearEvaTimers();
    setEvaCurtainPhase('none');
    setRoverDrive(null);
    dispatch({ type: 'COMPLETE_SCENE', sceneId });
  };

  const handleSkipTravel = () => {
    if (!travelState) return;
    finishTravel();
  };

  const handleCancelTravel = () => {
    stopSpeech();
    clearTravelTimers();
    pendingActionRef.current = null;
    setTravelState(null);
  };

  const handleBackToTitle = () => {
    stopSpeech();
    clearTravelTimers();
    clearEvaTimers();
    pendingActionRef.current = null;
    setTravelState(null);
    setRoverDrive(null);
    setSpaceshipIntroActive(false);
    dispatch({ type: 'RETURN_TO_TITLE' });
  };

  const handleEvaBack = () => {
    stopSpeech();
    dispatch({ type: 'PREVIOUS_NODE' });
  };

  const handleBackFromEnd = () => {
    stopSpeech();
    dispatch({ type: 'BACK_FROM_END' });
  };

  const handleReturnToMainConsole = () => {
    stopSpeech();
    dispatch({ type: 'OPEN_HUB', hub: 'main' });
  };

  const handleClearLockedMessage = () => {
    dispatch({ type: 'SET_LOCKED_MESSAGE', message: null });
  };

  const handlePlayAgain = () => {
    setPendingFreshLaunch(true);
    dispatch({ type: 'RESTART_JOURNEY' });
  };

  const effectiveHub =
    state.activeHub ||
    (isInOutsideEva || isInConsoleMission
      ? getDestinationFromSceneId(state.currentSceneId)
      : 'main');
  const showCockpitUI =
    (state.screen === 'hub' && Boolean(state.activeHub)) || isInConsoleMission;

  const windowPhase: TravelPhase = travelState
    ? travelState.phase
    : effectiveHub === 'main'
      ? 'idle'
      : 'surface_static';

  const windowDestination: TravelDestination | null = travelState
    ? travelState.destination
    : effectiveHub === 'main'
      ? null
      : effectiveHub;

  return (
    <div
      className={`app-root ${
        state.settings.reduceMotion ? 'reduce-motion' : ''
      } text-size-${state.settings.textSize}`}
    >
      {/* Screen Router */}
      {state.screen === 'title' && (
        <TitleScreen
          hasSavedGame={state.hasSavedGame}
          reduceMotion={state.settings.reduceMotion}
          onStart={handleStart}
          onContinue={handleContinue}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {showCockpitUI && (
        <div
          className={`hub-layout main-console-hub ${
            travelState
              ? `is-traveling is-travel-${travelState.phase}`
              : effectiveHub !== 'main'
                ? 'is-surface-landed'
                : ''
          } ${
            roverDrive?.isDriving
              ? `is-rover-driving-${roverDrive.direction}`
              : ''
          } ${
            effectiveHub === 'deep_space' &&
            Boolean(consoleMissionScene) &&
            !travelState
              ? 'is-deep-space-observation'
              : ''
          } ${spaceshipIntroActive ? 'is-spaceship-intro-dim' : ''}`}
        >
          <MainConsoleBackground
            travelPhase={windowPhase}
            travelDestination={windowDestination}
            deepSpaceProbe={deepSpaceProbe}
            cabinDimmed={spaceshipIntroActive}
          />

          <div
            className={`hub-console-grayable-wrap ${
              spaceshipIntroActive ? 'is-intro-grayed' : ''
            }`}
            aria-hidden={spaceshipIntroActive || undefined}
          >
            <button
              type="button"
              className="corner-settings-btn"
              disabled={spaceshipIntroActive}
              tabIndex={spaceshipIntroActive ? -1 : undefined}
              onClick={() => setIsSettingsOpen(true)}
              aria-label="Open settings menu"
              title="Menu"
            >
              <svg
                viewBox="0 0 24 24"
                width="26"
                height="26"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </button>

            <HubMenu
              activeHub={effectiveHub}
              completedSceneIds={state.completedSceneIds}
              deepSpaceUnlocked={state.deepSpaceUnlocked}
              lockedMessage={state.lockedMessage}
              travelState={travelState}
              roverDrive={roverDrive}
              missionScene={consoleMissionScene}
              missionNode={consoleMissionNode}
              missionNodeIndex={state.currentNodeIndex}
              typingSpeed={state.settings.typingSpeed}
              reduceMotion={state.settings.reduceMotion}
              pendingEntryChoice={state.pendingEntryChoice && effectiveHub === 'main'}
              hasSavedGame={state.hasSavedGame}
              savedLocationLabel={state.savedLocationLabel}
              onStartNewJourney={handleNewJourney}
              onResumeSaved={handleContinue}
              onSelectCard={handleSelectCard}
              onSkipTravel={handleSkipTravel}
              onCancelTravel={handleCancelTravel}
              onBackToTitle={handleBackToTitle}
              onAdvanceMission={handleAdvanceMission}
              onBackMission={handleEvaBack}
              onChooseMissionOption={handleChooseMissionOption}
              onExitMission={handleExitMission}
              onMarkMissionComplete={handleMarkMissionComplete}
              onReturnToMainConsole={handleReturnToMainConsole}
              onClearLockedMessage={handleClearLockedMessage}
              onSpeak={speak}
            />
          </div>

          {spaceshipIntroActive && (
            <SpaceshipIntroOverlay
              narrationEnabled={state.settings.narration}
              typingSpeed={state.settings.typingSpeed}
              reduceMotion={state.settings.reduceMotion}
              voiceStyle={state.settings.feliceVoiceStyle ?? 'kid'}
              onBackToTitle={handleBackToTitle}
              onComplete={() => setSpaceshipIntroActive(false)}
            />
          )}
        </div>
      )}

      {isInOutsideEva && missionScene && missionNode && (
        <OutsideEvaScene
          destination={getDestinationFromSceneId(state.currentSceneId)}
          scene={missionScene}
          node={missionNode}
          nodeIndex={state.currentNodeIndex}
          visitedMenuOptions={
            state.visitedMenuOptions[
              `${missionScene.id}_${state.currentNodeIndex}`
            ] || []
          }
          typingSpeed={state.settings.typingSpeed}
          reduceMotion={state.settings.reduceMotion}
          onAdvance={handleAdvanceMission}
          onBack={handleEvaBack}
          onChooseOption={handleChooseMissionOption}
          onChooseMenuOption={(optionId) =>
            dispatch({ type: 'CHOOSE_MENU_OPTION', optionId })
          }
          onExitToRover={handleExitMission}
          onMarkComplete={
            effectiveHub === 'moon' || effectiveHub === 'mars'
              ? () => handleMarkMissionComplete(missionScene.id)
              : undefined
          }
          onSpeak={speak}
        />
      )}

      {isEarthUnlockScene && unlockScene && unlockNode && (
        <div className="hub-layout main-console-hub is-spaceship-intro-dim">
          <MainConsoleBackground
            travelPhase="orbiting"
            travelDestination="mars"
            cabinDimmed={true}
          />
          <EarthTransmissionOverlay
            scene={unlockScene}
            node={unlockNode}
            nodeIndex={state.currentNodeIndex}
            typingSpeed={state.settings.typingSpeed}
            reduceMotion={state.settings.reduceMotion}
            onAdvance={handleAdvanceDeepSpaceUnlock}
            onBack={handleEvaBack}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onSpeak={speak}
          />
        </div>
      )}

      {state.screen === 'story' &&
        !isInOutsideEva &&
        !isEarthUnlockScene &&
        !isInConsoleMission && (
        <StoryPlayer onOpenSettings={() => setIsSettingsOpen(true)} />
      )}

      {/* Full-screen slowly dimming / revealing blackout curtain into Outside EVA */}
      {evaCurtainPhase !== 'none' && (
        <div
          className={`eva-dim-curtain phase-${evaCurtainPhase}`}
          aria-hidden="true"
        />
      )}

      {state.screen === 'end' && (
        <EndScreen
          onBack={handleBackFromEnd}
          onPlayAgain={handlePlayAgain}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {/* Settings Modal */}
      <SettingsPanel
        settings={state.settings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={s => dispatch({ type: 'UPDATE_SETTINGS', settings: s })}
        onPreviewVoice={(sample, style) =>
          speak(sample, { speaker: 'felice', style })
        }
      />

      {/* Developer Debug Panel */}
      {showDebug && <DebugPanel />}
    </div>
  );
};
