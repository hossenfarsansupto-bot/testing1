import React, { useState, useEffect, useRef } from 'react';
import {
  ChoiceNode,
  HubCard,
  HubId,
  SayNode,
  Scene,
  StoryNode,
  TypingSpeed
} from '../types';
import {
  HUB_PROMPTS,
  NARRATOR_NAME,
  TYPING_SPEED_MS
} from '../content/config';
import {
  getMainConsoleCards,
  getMoonHubCards,
  getMarsHubCards,
  getDeepSpaceHubCards,
  SCENE_IDS
} from '../content/flow';
import { FeliceAvatar, FeliceTextboxControls } from './DialogueBox';
import { CosmicSagaLogo } from './CosmicSagaLogo';
import { DisplayMiniAnim } from './DisplayMiniAnim';
import { PageNavBar } from './PageNavBar';
import { TravelDestination, TravelPhase } from './RealisticWindowCanvas';
import { CatbotStage, FeliceCatbot } from './FeliceCatbot';
import { NasaMediaStage } from './NasaMediaStage';
import { getSceneMediaCue } from '../content/nasaMediaCatalog';
import { cancelSpeechSynthesis, SpeakOptions } from '../engine/useSpeech';
import { useStory } from '../engine/storyState';

export interface TravelState {
  cardId: string;
  destination: TravelDestination;
  label: string;
  phase: Exclude<TravelPhase, 'idle' | 'surface_static' | 'earth_approach'>;
}

export interface RoverDriveState {
  direction: 'left' | 'right';
  hardwareId: string;
  cardId: string;
  label: string;
  isDriving: boolean;
}

interface HubMenuProps {
  activeHub: HubId;
  completedSceneIds: string[];
  deepSpaceUnlocked: boolean;
  lockedMessage: string | null;
  travelState?: TravelState | null;
  roverDrive?: RoverDriveState | null;
  catbotStage?: CatbotStage;
  missionScene?: Scene | null;
  missionNode?: StoryNode | null;
  missionNodeIndex?: number;
  typingSpeed?: TypingSpeed;
  reduceMotion?: boolean;
  pendingEntryChoice?: boolean;
  hasSavedGame?: boolean;
  savedLocationLabel?: string | null;
  onStartNewJourney?: () => void;
  onResumeSaved?: () => void;
  onSelectCard: (card: HubCard, index: number) => void;
  onSkipTravel?: () => void;
  onCancelTravel?: () => void;
  onBackToTitle?: () => void;
  onAdvanceMission?: () => void;
  onBackMission?: () => void;
  onChooseMissionOption?: (optionIndex: number) => void;
  onExitMission?: () => void;
  onMarkMissionComplete?: (sceneId: string) => void;
  onReturnToMainConsole: () => void;
  onClearLockedMessage: () => void;
  onSpeak?: (text: string, options?: SpeakOptions) => void;
}

interface TravelCopyEntry {
  headerCode: string;
  signal: string;
  prompt: string;
  badge: string;
  line: string;
  thrustLabel: string;
}

const DESTINATION_NAMES: Record<TravelDestination, string> = {
  moon: 'THE MOON',
  mars: 'MARS',
  deep_space: 'DEEP SPACE'
};

function getTravelPhaseCopy(travel: TravelState): TravelCopyEntry {
  const destName = DESTINATION_NAMES[travel.destination];
  const isDeepSpace = travel.destination === 'deep_space';
  switch (travel.phase) {
    case 'hyperspace':
      return {
        headerCode: `HYPERDRIVE ENGAGED // ${destName} VECTOR`,
        signal: 'WARP 9',
        prompt: `Course locked: ${travel.label} — Brace for jump!`,
        badge: '⚡ HYPERSPACE JUMP',
        line: `Hold onto your whiskers—fasten your seatbelt! We are moving super fast toward ${travel.label}!`,
        thrustLabel: 'THRUST: MAX HYPERSPACE'
      };
    case 'orbiting':
      return isDeepSpace
        ? {
            headerCode: 'CRUISING DEEP SPACE // OUTER SOLAR SYSTEM',
            signal: 'CRUISE',
            prompt: 'Entering Deep Space corridor — scanning floating spacecraft outside window.',
            badge: '🌌 INTERSTELLAR VOID',
            line: 'Dropping out of hyperspace into Deep Space! Look out the console window—floating spacecraft dead ahead!',
            thrustLabel: 'MODE: FREE-SPACE DRIFT'
          }
        : {
            headerCode: `ORBIT ACHIEVED // ${destName}`,
            signal: 'IN ORBIT',
            prompt: `Holding low orbit around ${travel.label}.`,
            badge: '🪐 LOW ORBIT VIEW',
            line: `Dropping out of hyperspace—look out the window! Cruising steady above ${travel.label}!`,
            thrustLabel: 'THRUST: ORBITAL CRUISE'
          };
    case 'turbulence':
      return {
        headerCode: `GRAVITY WELL ALERT // ${destName}`,
        signal: 'PULL ALERT',
        prompt: `Turbulence detected—gravity pulling us toward ${travel.label}!`,
        badge: '⚠️ TURBULENCE // GRAVITY PULL',
        line: `Whoa—sudden gravity spike! Turbulence shaking the hull—${travel.label} is pulling us right in!`,
        thrustLabel: 'THRUST: COUNTER-BURN'
      };
    case 'blackout':
      return {
        headerCode: `ENTRY SHIELD BLACKOUT // ${destName}`,
        signal: 'POWER DIM',
        prompt: 'Hull shields blacked out—running on blinking emergency power...',
        badge: '🔌 CABIN DIM // ENTRY SHIELD',
        line: `Cabin lights flickering—viewports blacked out for atmospheric entry! Hold tight while I stabilize thrusters...`,
        thrustLabel: 'POWER: BACKUP BLINK'
      };
    case 'surface_reveal':
      return isDeepSpace
        ? {
            headerCode: 'DEEP SPACE CONSOLE // INTERSTELLAR CRUISE',
            signal: 'ONLINE',
            prompt: 'Deep Space array stabilized—observing floating probes outside.',
            badge: '✨ DEEP SPACE WINDOW',
            line: 'All systems steady! Look right out the cockpit console window—Pioneer and Voyager are drifting through Deep Space!',
            thrustLabel: 'SYSTEMS: 100% STABLE'
          }
        : {
            headerCode: `TOUCHDOWN CONFIRMED // ${destName} SURFACE`,
            signal: 'FULL LIGHT',
            prompt: `All systems normal! Clearing viewports onto ${travel.label}.`,
            badge: '✨ ALL CLEAR // SURFACE VIEW',
            line: `Everything is green—lights back to full power! Look outside as the window clears—welcome to ${travel.label}'s surface!`,
            thrustLabel: 'SYSTEMS: 100% STABLE'
          };
  }
}

export const HubMenu: React.FC<HubMenuProps> = ({
  activeHub,
  completedSceneIds,
  deepSpaceUnlocked,
  lockedMessage,
  travelState = null,
  roverDrive = null,
  catbotStage = 'beside_pad',
  missionScene = null,
  missionNode = null,
  missionNodeIndex = 0,
  typingSpeed = 'normal',
  reduceMotion = false,
  pendingEntryChoice = false,
  hasSavedGame = false,
  savedLocationLabel = null,
  onStartNewJourney,
  onResumeSaved,
  onSelectCard,
  onSkipTravel,
  onCancelTravel,
  onBackToTitle,
  onAdvanceMission,
  onBackMission,
  onChooseMissionOption,
  onExitMission,
  onMarkMissionComplete,
  onReturnToMainConsole,
  onClearLockedMessage,
  onSpeak
}) => {
  const { state: storyState } = useStory();
  const isPaused = storyState.isPaused;
  const isMainConsole = activeHub === 'main';
  const showEntryChoice = isMainConsole && pendingEntryChoice;
  const [bootPhase, setBootPhase] = useState<'booting' | 'ready'>(
    isMainConsole && !reduceMotion && !pendingEntryChoice ? 'booting' : 'ready'
  );

  // Mission dialogue typewriter inside Astro-Pad
  const missionRawText =
    missionNode && (missionNode.type === 'say' || missionNode.type === 'stage')
      ? missionNode.text
      : missionNode && missionNode.type === 'choice'
        ? missionNode.prompt || 'Choose an action:'
        : '';
  const [typedLen, setTypedLen] = useState(missionRawText.length);
  const [speechDone, setSpeechDone] = useState<boolean>(false);
  const typeTimerRef = useRef<number | null>(null);
  const onAdvanceMissionRef = useRef(onAdvanceMission);
  onAdvanceMissionRef.current = onAdvanceMission;
  const isTypingDone = typedLen >= missionRawText.length;

  useEffect(() => {
    let cancelled = false;
    setSpeechDone(false);
    if (
      !missionScene ||
      !missionNode ||
      travelState ||
      roverDrive?.isDriving ||
      !onSpeak ||
      missionNode.type !== 'say'
    ) {
      cancelSpeechSynthesis();
      return () => {
        cancelled = true;
      };
    }

    const spk = (missionNode as SayNode).speaker;
    onSpeak(missionNode.text, {
      speaker: spk,
      mode: spk === 'felice' ? 'ai' : undefined,
      onEnd:
        spk === 'felice'
          ? () => {
              if (!cancelled) setSpeechDone(true);
            }
          : undefined
    });
    return () => {
      cancelled = true;
      cancelSpeechSynthesis();
    };
  }, [missionScene, missionNode, travelState, roverDrive?.isDriving, onSpeak]);

  // Auto-advance after Felice finishes speaking inside Console
  useEffect(() => {
    if (isPaused || !missionScene || !missionNode || travelState) return;
    if (missionNode.type !== 'say' || (missionNode as SayNode).speaker !== 'felice') {
      return;
    }
    if (!speechDone || !isTypingDone) return;
    const timer = window.setTimeout(() => {
      if (document.querySelector('.nasa-modal-backdrop, .settings-modal-backdrop')) {
        return;
      }
      onAdvanceMissionRef.current?.();
    }, 450);
    return () => window.clearTimeout(timer);
  }, [isPaused, missionScene, missionNode, travelState, speechDone, isTypingDone]);

  useEffect(() => {
    if (!missionScene || !missionNode || roverDrive?.isDriving || typingSpeed === 'instant' || reduceMotion || missionNode.type === 'choice') {
      setTypedLen(missionRawText.length);
      return;
    }
    setTypedLen(0);
  }, [missionScene, missionNode, missionRawText, typingSpeed, reduceMotion, roverDrive?.isDriving]);

  useEffect(() => {
    if (
      isPaused ||
      !missionScene ||
      !missionNode ||
      roverDrive?.isDriving ||
      typingSpeed === 'instant' ||
      reduceMotion ||
      missionNode.type === 'choice' ||
      isTypingDone
    ) {
      return;
    }
    if (typeTimerRef.current) clearInterval(typeTimerRef.current);
    const speedMs = TYPING_SPEED_MS[typingSpeed];
    typeTimerRef.current = window.setInterval(() => {
      setTypedLen((prev) => {
        if (prev + 1 >= missionRawText.length) {
          if (typeTimerRef.current) clearInterval(typeTimerRef.current);
          return missionRawText.length;
        }
        return prev + 1;
      });
    }, speedMs);
    return () => {
      if (typeTimerRef.current) clearInterval(typeTimerRef.current);
    };
  }, [isPaused, missionScene, missionNode, missionRawText, typingSpeed, reduceMotion, roverDrive?.isDriving, isTypingDone]);

  const handlePadDialogueClick = () => {
    if (!isTypingDone) {
      if (typeTimerRef.current) clearInterval(typeTimerRef.current);
      setTypedLen(missionRawText.length);
      return;
    }
    cancelSpeechSynthesis();
    onAdvanceMission?.();
  };

  // Trigger opening Navigation Console boot sequence when entering Main Console
  useEffect(() => {
    if (!isMainConsole || reduceMotion || pendingEntryChoice) {
      setBootPhase('ready');
      return;
    }

    setBootPhase('booting');
    const timer = window.setTimeout(() => {
      setBootPhase('ready');
    }, 1700);

    return () => window.clearTimeout(timer);
  }, [isMainConsole, reduceMotion, pendingEntryChoice]);

  let cards: HubCard[] = [];
  let promptText = '';

  switch (activeHub) {
    case 'main':
      cards = getMainConsoleCards(completedSceneIds, deepSpaceUnlocked);
      promptText = HUB_PROMPTS.main;
      break;
    case 'moon':
      cards = getMoonHubCards(completedSceneIds);
      promptText = HUB_PROMPTS.moon;
      break;
    case 'mars':
      cards = getMarsHubCards(completedSceneIds);
      promptText = HUB_PROMPTS.mars;
      break;
    case 'deep_space':
      cards = getDeepSpaceHubCards(completedSceneIds);
      promptText = HUB_PROMPTS.deep_space;
      break;
    default:
      cards = getMainConsoleCards(completedSceneIds, deepSpaceUnlocked);
      promptText = HUB_PROMPTS.main;
  }

  const isSubHub = !isMainConsole;
  const travelCopy = travelState ? getTravelPhaseCopy(travelState) : null;

  const nextIncompleteIdx = cards.findIndex(
    (c) => c.isUnlocked && !c.isCompleted
  );
  const firstUnlockedIdx = cards.findIndex((c) => c.isUnlocked);

  const handleHubNext = () => {
    if (nextIncompleteIdx >= 0) {
      onSelectCard(cards[nextIncompleteIdx], nextIncompleteIdx);
    } else if (isSubHub) {
      onReturnToMainConsole();
    } else if (firstUnlockedIdx >= 0) {
      onSelectCard(cards[firstUnlockedIdx], firstUnlockedIdx);
    }
  };

  const handleSkipBoot = () => {
    if (bootPhase === 'booting') {
      setBootPhase('ready');
    }
  };

  const activeMissionMediaCue =
    missionScene && missionNode
      ? getSceneMediaCue(missionScene, missionNode, missionNodeIndex)
      : undefined;

  const isDeepSpaceObservation =
    activeHub === 'deep_space' && Boolean(missionScene) && !travelState;

  return (
    <div className="hub-menu-container" role="main" aria-label="Navigation Hub">
      {/* Pseudo-Logo on Top Section of the Curved Window */}
      {!isDeepSpaceObservation && <CosmicSagaLogo />}

      {/* Gentle Felice locked notice if user tapped a locked item */}
      {lockedMessage && (
        <div
          className="locked-toast-banner"
          role="alert"
          onClick={onClearLockedMessage}
        >
          <div className="locked-toast-avatar">
            <FeliceAvatar />
          </div>
          <div className="locked-toast-content">
            <span className="locked-toast-author">{NARRATOR_NAME}:</span>
            <p className="locked-toast-text">{lockedMessage}</p>
            <span className="locked-toast-hint">(Tap to dismiss)</span>
          </div>
        </div>
      )}

      {!travelState &&
        !roverDrive?.isDriving &&
        missionScene &&
        missionNode &&
        activeMissionMediaCue && (
          <div
            className={
              isDeepSpaceObservation
                ? 'pad-deepspace-window-band'
                : 'pad-mission-window-band'
            }
          >
            {isDeepSpaceObservation && (
              <div className="pad-deepspace-window-left-clear" aria-hidden="true" />
            )}
            <div className="pad-console-media-dock">
              <NasaMediaStage
                mediaCue={activeMissionMediaCue}
                reduceMotion={reduceMotion}
              />
            </div>
          </div>
        )}

      {/* Single All-in-One Cockpit / Rover Pad Display + Catbot Felice */}
      <div className="cockpit-computer-bay">
        <div
          className={`unified-cockpit-pad ${
            roverDrive?.isDriving
              ? `is-rover-tilting tilt-${roverDrive.direction}`
              : ''
          }`}
        >
          {/* Tablet Top Speaker / Vents */}
          <div className="computer-top-vents" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          {/* Single Unified Bluish-Greenish-White Pad Screen */}
          <div className="amongus-screen-surface unified-pad-screen">
            {/* Top Navigation Console Strip INSIDE the same pad display */}
            <div className="pad-nav-header">
              <div className="pad-nav-title-row">
                <span
                  className={`pad-status-dot ${
                    travelState
                      ? `status-${travelState.phase}`
                      : missionScene
                        ? 'status-surface_reveal'
                        : ''
                  }`}
                  aria-hidden="true"
                />
                <span className="pad-nav-code">
                  {travelCopy
                    ? travelCopy.headerCode
                    : missionScene
                      ? activeHub === 'deep_space'
                        ? `DEEP SPACE CONSOLE // ${missionScene.title.toUpperCase()}`
                        : `ROVER EVA // ${missionScene.title.toUpperCase()}`
                      : `NAVIGATION CONSOLE // ${activeHub.toUpperCase()}`}
                </span>
                {missionScene && !travelState ? (
                  <div className="pad-nav-right-controls">
                    {(missionScene.id === SCENE_IDS.DS_PIONEER ||
                      missionScene.id === SCENE_IDS.DS_VOYAGER) &&
                      onMarkMissionComplete && (
                        <button
                          type="button"
                          className="pad-complete-btn"
                          onClick={() => {
                            cancelSpeechSynthesis();
                            onMarkMissionComplete(missionScene.id);
                          }}
                          title="Mark this Deep Space mission complete"
                        >
                          ✓ Mark as Complete
                        </button>
                      )}
                    <button
                      type="button"
                      className="pad-back-btn"
                      onClick={onExitMission}
                    >
                      {activeHub === 'deep_space' ? '« Deep Space' : '« Back to Sites'}
                    </button>
                  </div>
                ) : !travelState ? (
                  <div className="pad-nav-right-controls">
                    <PageNavBar
                      onBack={
                        isSubHub ? onReturnToMainConsole : onBackToTitle
                      }
                      onNext={handleHubNext}
                      nextDisabled={showEntryChoice}
                      backTitle={
                        isSubHub
                          ? 'Back to Main Console'
                          : 'Back to Launch Screen'
                      }
                      nextTitle={
                        showEntryChoice
                          ? 'Choose Start with Beginning or Resume below'
                          : nextIncompleteIdx >= 0
                            ? `Next: ${cards[nextIncompleteIdx].label}`
                            : isSubHub
                              ? 'Back to Main Console'
                              : 'Open next destination'
                      }
                    />
                  </div>
                ) : (
                  <span className="pad-nav-signal">{travelCopy?.signal}</span>
                )}
              </div>
              <p className="pad-nav-prompt">
                <span className="pad-prompt-chevron">&gt;&nbsp;</span>
                {travelCopy
                  ? travelCopy.prompt
                  : roverDrive?.isDriving
                    ? `Steering rover ${roverDrive.direction} toward ${roverDrive.label}...`
                    : missionScene
                      ? activeHub === 'deep_space'
                        ? `Look out the console window — ${NARRATOR_NAME} is briefing you on ${missionScene.title}!`
                        : catbotStage === 'outside_rover'
                          ? `Felice is outside inspecting ${missionScene.title}!`
                          : `Parked beside ${missionScene.title} — talk with Felice!`
                      : showEntryChoice
                        ? 'Choose Start with Beginning (New Journey) or Resume your last voyage.'
                        : promptText}
              </p>
            </div>

            {travelState && travelCopy ? (
              <div className="pad-travel-wrap">
                {/* 2D Pad-Themed Live Flight Commentary across Travel Phases */}
                <button
                  type="button"
                  className={`pad-travel-panel phase-${travelState.phase}`}
                  onClick={onSkipTravel}
                  aria-label={`Traveling to ${travelState.label}. Click to skip to arrival.`}
                >
                  <div className="pad-travel-row">
                    <div className="pad-travel-avatar-wrap" aria-hidden="true">
                      <FeliceAvatar />
                      <span className="pad-travel-speaker-tag">
                        {NARRATOR_NAME}
                      </span>
                    </div>

                    <div className="pad-travel-dialogue-box">
                      <div className="pad-travel-badge-row">
                        <span className="pad-travel-phase-badge">
                          {travelCopy.badge}
                        </span>
                        <span className="pad-travel-dest-badge">
                          {travelState.label}
                        </span>
                      </div>
                      <p
                        className="pad-travel-commentary"
                        key={`${travelState.destination}-${travelState.phase}`}
                      >
                        &ldquo;{travelCopy.line}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="pad-travel-telemetry" aria-hidden="true">
                    <span className="pad-travel-speed-label">
                      {travelCopy.thrustLabel}
                    </span>
                    <div className="pad-travel-meter-track">
                      <div className="pad-travel-meter-fill" />
                    </div>
                    <span className="pad-travel-skip-hint">
                      Tap pad to skip ⏭
                    </span>
                  </div>
                </button>
                <PageNavBar
                  className="pad-travel-nav"
                  onBack={onCancelTravel}
                  onNext={onSkipTravel}
                  backTitle="Cancel travel and return to Main Console"
                  nextTitle="Skip flight transition to arrival"
                />
              </div>
            ) : roverDrive?.isDriving ? (
              /* Rover Steering / Hover-Tilt Drive Animation inside Astro-Pad */
              <div className="pad-rover-drive-banner">
                <div className="pad-rover-drive-badge">
                  {roverDrive.direction === 'left'
                    ? '◀ ROVER STEERING LEFT'
                    : 'ROVER STEERING RIGHT ▶'}
                </div>
                <p className="pad-rover-drive-text">
                  Hover-thrusters tilting toward{' '}
                  <strong>{roverDrive.label}</strong>... look outside the
                  window!
                </p>
                <div className="pad-travel-meter-track">
                  <div className="pad-travel-meter-fill" />
                </div>
              </div>
            ) : missionScene && missionNode ? (
              /* Interactive In-Cockpit Mission Story on the Astro-Pad Display */
              <div className="pad-mission-panel">
                {missionNode.type === 'choice' ? (
                  <div className="pad-mission-choice-wrap">
                    <p className="pad-mission-choice-prompt">
                      {(missionNode as ChoiceNode).prompt ||
                        'Choose an inspection experiment:'}
                    </p>
                    <div className="pad-mission-choice-grid">
                      {(missionNode as ChoiceNode).options.map((opt, idx) => (
                        <button
                          key={opt.label}
                          type="button"
                          className="pad-mission-choice-btn"
                          onClick={() => onChooseMissionOption?.(idx)}
                        >
                          <span className="choice-num">{idx + 1}.</span>{' '}
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    role="button"
                    tabIndex={0}
                    className="pad-mission-dialogue-btn"
                    onClick={handlePadDialogueClick}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handlePadDialogueClick();
                      }
                    }}
                    aria-label="Advance Catbot Felice dialogue"
                  >
                    <div className="pad-mission-meta">
                      <span className="pad-mission-speaker">
                        {(missionNode as SayNode).speaker === 'system'
                          ? activeHub === 'deep_space'
                            ? 'DEEP SPACE CONSOLE TELEMETRY'
                            : 'ROVER TELEMETRY'
                          : activeHub === 'deep_space'
                            ? `${NARRATOR_NAME} // COCKPIT CONSOLE`
                            : catbotStage === 'outside_rover'
                              ? `${NARRATOR_NAME} // EVA OUTSIDE`
                              : `${NARRATOR_NAME} // BESIDE PAD`}
                      </span>
                      <div className="pad-mission-meta-actions">
                        {(missionNode as SayNode).speaker !== 'system' && (
                          <FeliceTextboxControls />
                        )}
                        <span className="pad-mission-action-pill">
                          {isTypingDone ? 'Continue ▶' : 'Show All ▶'}
                        </span>
                      </div>
                    </div>
                    <p className="pad-mission-text">
                      {missionRawText.slice(0, typedLen)}
                    </p>
                    {missionNode.type === 'say' &&
                      (missionNode as SayNode).list &&
                      isTypingDone && (
                        <ul className="pad-mission-list">
                          {(missionNode as SayNode).list!.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                  </div>
                )}
                {missionNode.type !== 'choice' && onBackMission && (
                  <div style={{ marginTop: '0.45rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <PageNavBar
                      onBack={() => {
                        cancelSpeechSynthesis();
                        onBackMission();
                      }}
                      onNext={handlePadDialogueClick}
                      backTitle="Previous step"
                      nextTitle={isTypingDone ? 'Next' : 'Show full line'}
                    />
                  </div>
                )}
              </div>
            ) : showEntryChoice ? (
              /* Start with Beginning (New Journey) vs Resume right inside the Navigation Console */
              <div
                className="pad-entry-choice-panel"
                role="group"
                aria-label="Mission start or resume options"
              >
                <button
                  type="button"
                  className="pad-entry-choice-btn is-new-journey"
                  onClick={onStartNewJourney}
                >
                  <div>
                    <div className="pad-entry-choice-top">
                      <span className="pad-entry-choice-title">
                        🚀 Start with Beginning
                      </span>
                      <span className="pad-entry-choice-badge">New Journey</span>
                    </div>
                    <p className="pad-entry-choice-desc">
                      Return to the shuttle launchpad and start a fresh journey from the beginning.
                    </p>
                  </div>
                  <span className="pad-entry-choice-cta">Return to Launch ▶</span>
                </button>

                <button
                  type="button"
                  className="pad-entry-choice-btn is-resume"
                  disabled={!hasSavedGame}
                  onClick={onResumeSaved}
                >
                  <div>
                    <div className="pad-entry-choice-top">
                      <span className="pad-entry-choice-title">
                        ▶ Resume
                      </span>
                      <span className="pad-entry-choice-badge">
                        {hasSavedGame ? 'Saved' : 'Empty'}
                      </span>
                    </div>
                    <p className="pad-entry-choice-desc">
                      {hasSavedGame
                        ? `Return to where you left off: ${
                            savedLocationLabel || 'Main Ship Console'
                          }`
                        : 'No saved progress yet — start a new journey first.'}
                    </p>
                  </div>
                  <span className="pad-entry-choice-cta">
                    {hasSavedGame ? 'Resume Here ▶' : 'Unavailable'}
                  </span>
                </button>
              </div>
            ) : bootPhase === 'booting' ? (
              /* Opening Boot Sequence inside the SAME pad theme */
              <button
                type="button"
                className="pad-boot-area"
                onClick={handleSkipBoot}
                aria-label="Navigation Console booting. Click to continue immediately."
              >
                <div className="pad-boot-scanline" aria-hidden="true" />
                <div className="pad-boot-center">
                  <div className="pad-boot-badge">SYSTEM INITIALIZING</div>
                  <p className="pad-boot-line">
                    &gt; Calibrating star-chart &amp; destination tabs...
                  </p>
                  <div className="pad-boot-progress-track" aria-hidden="true">
                    <div className="pad-boot-progress-fill" />
                  </div>
                  <span className="pad-boot-skip">
                    Opening navigation tabs... (Tap to skip)
                  </span>
                </div>
              </button>
            ) : (
              /* Destination / Mission Cards rendered directly inside the Rover Pad Display */
              <div
                className={`hub-cards-grid main-console-grid pad-tabs-grid tabs-count-${cards.length} cockpit-displays-enter`}
                role="group"
              >
                {cards.map((card, index) => {
                  const isVisiblyLocked = !card.isUnlocked;
                  const canMarkComplete =
                    (activeHub === 'moon' ||
                      activeHub === 'mars' ||
                      (activeHub === 'deep_space' &&
                        (card.id === 'ds_pioneer' || card.id === 'ds_voyager'))) &&
                    Boolean(card.targetScene) &&
                    !card.isCompleted &&
                    Boolean(onMarkMissionComplete);
                  return (
                    <div
                      key={card.id}
                      className={`hub-card pad-tab-card display-slot-${index} ${
                        isVisiblyLocked ? 'locked' : 'unlocked'
                      } ${card.isCompleted ? 'completed' : ''}`}
                    >
                      <button
                        type="button"
                        className="hub-card-main-btn"
                        onClick={() => onSelectCard(card, index)}
                        aria-disabled={isVisiblyLocked}
                        aria-label={`${card.label}${
                          card.isCompleted ? ' (Completed)' : ''
                        }${
                          isVisiblyLocked ? ' (Temporarily unavailable)' : ''
                        }`}
                      >
                        <div className="display-2d-viewport">
                          <div className="display-scanline" aria-hidden="true" />
                          <DisplayMiniAnim
                            cardId={card.id}
                            isUnlocked={card.isUnlocked}
                          />
                        </div>

                        <div className="hub-card-header">
                          <span className="hub-card-title">{card.label}</span>
                          {card.isCompleted && (
                            <span
                              className="hub-card-badge completed"
                              title="Completed"
                            >
                              ✓ Completed
                            </span>
                          )}
                          {card.badgeText && !card.isCompleted && (
                            <span className="hub-card-badge locked">
                              {card.badgeText}
                            </span>
                          )}
                        </div>

                        {card.description && (
                          <p className="hub-card-description">
                            {card.description}
                          </p>
                        )}
                      </button>

                      <div className="hub-card-footer">
                        <button
                          type="button"
                          className="hub-card-action-btn"
                          onClick={() => onSelectCard(card, index)}
                          aria-disabled={isVisiblyLocked}
                        >
                          <span className="hub-card-action">
                            {isVisiblyLocked
                              ? '🔒 Locked'
                              : card.isCompleted
                                ? activeHub === 'deep_space'
                                  ? 'View Again ▶'
                                  : isSubHub
                                    ? 'Revisit Site ▶'
                                    : 'Revisit ▶'
                                : activeHub === 'deep_space'
                                  ? 'View in Window ▶'
                                  : isSubHub
                                    ? 'Launch Course ▶'
                                    : 'Launch ▶'}
                          </span>
                        </button>
                        {canMarkComplete && card.targetScene && (
                          <button
                            type="button"
                            className="hub-card-complete-btn"
                            onClick={() => onMarkMissionComplete?.(card.targetScene!)}
                            title={`Mark ${card.label} as complete`}
                          >
                            ✓ Mark as Complete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tablet Bottom Chin Bar */}
          <div className="monitor-chin-bar" aria-hidden="true">
            <span className="chin-led green" />
            <span className="chin-vent" />
            <span className="chin-label">
              {activeHub === 'deep_space'
                ? 'ASTRO-PAD // DEEP SPACE'
                : isSubHub
                  ? `ROVER-PAD // ${activeHub.toUpperCase()}`
                  : 'ASTRO-PAD // NAV'}
            </span>
          </div>
        </div>

        {/* Catbot Felice docked beside the Astro-Pad display (or flying through the window!) */}
        {!travelState && (!isMainConsole || Boolean(missionScene)) && (
          <FeliceCatbot
            stage={catbotStage}
            isTalking={Boolean(missionScene && (!isTypingDone || missionNode))}
            leanDir={roverDrive?.isDriving ? roverDrive.direction : null}
            statusText={
              roverDrive?.isDriving
                ? 'Hold on—steering!'
                : catbotStage === 'crossing_window'
                  ? 'Going outside!'
                  : missionScene
                    ? activeHub === 'deep_space'
                      ? 'Look out window!'
                      : 'Look outside!'
                    : activeHub === 'deep_space'
                      ? 'Pick a probe!'
                      : 'Pick a site!'
            }
          />
        )}
      </div>
    </div>
  );
};
