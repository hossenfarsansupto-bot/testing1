import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FeliceCatbot } from './FeliceCatbot';
import { FeliceTextboxControls } from './DialogueBox';
import { useStory } from '../engine/storyState';
import { NasaMediaStage } from './NasaMediaStage';
import { PageNavBar } from './PageNavBar';
import { NARRATOR_NAME, TYPING_SPEED_MS } from '../content/config';
import { getSceneMediaCue } from '../content/nasaMediaCatalog';
import { cancelSpeechSynthesis, SpeakOptions } from '../engine/useSpeech';
import { SayNode, Scene, StoryNode, TypingSpeed } from '../types';

interface EarthTransmissionOverlayProps {
  scene: Scene;
  node: StoryNode;
  nodeIndex: number;
  typingSpeed: TypingSpeed;
  reduceMotion: boolean;
  onAdvance: () => void;
  onBack: () => void;
  onOpenSettings: () => void;
  onSpeak?: (text: string, options?: SpeakOptions) => void;
}

/**
 * In-cockpit priority Earth transmission overlay shown right after finishing
 * Mars's final mission: Felice receives Earth's clearance message and initiates
 * the console jump into Deep Space.
 */
export const EarthTransmissionOverlay: React.FC<EarthTransmissionOverlayProps> = ({
  scene,
  node,
  nodeIndex,
  typingSpeed,
  reduceMotion,
  onAdvance,
  onBack,
  onOpenSettings,
  onSpeak
}) => {
  const { state: storyState } = useStory();
  const isPaused = storyState.isPaused;
  const rawText = node.type === 'say' || node.type === 'stage' ? node.text : '';
  const speaker = node.type === 'say' ? (node as SayNode).speaker : 'felice';
  const isFinalNode = nodeIndex + 1 >= scene.nodes.length;

  const [typedLen, setTypedLen] = useState<number>(
    reduceMotion || typingSpeed === 'instant' ? rawText.length : 0
  );
  const [speechDone, setSpeechDone] = useState<boolean>(false);
  const onAdvanceRef = useRef(onAdvance);
  onAdvanceRef.current = onAdvance;
  const isTypingDone = typedLen >= rawText.length;

  const activeMediaCue = getSceneMediaCue(scene, node, nodeIndex);

  useEffect(() => {
    if (reduceMotion || typingSpeed === 'instant') {
      setTypedLen(rawText.length);
      return;
    }
    setTypedLen(0);
  }, [rawText, reduceMotion, typingSpeed]);

  useEffect(() => {
    if (isPaused || reduceMotion || typingSpeed === 'instant' || isTypingDone) {
      return;
    }
    const ms = Math.max(12, TYPING_SPEED_MS[typingSpeed]);
    const timer = window.setInterval(() => {
      setTypedLen((prev) => {
        if (prev + 2 >= rawText.length) {
          window.clearInterval(timer);
          return rawText.length;
        }
        return prev + 2;
      });
    }, ms);
    return () => window.clearInterval(timer);
  }, [isPaused, rawText, reduceMotion, typingSpeed, isTypingDone]);

  useEffect(() => {
    let cancelled = false;
    setSpeechDone(false);
    if (onSpeak && node.type === 'say' && rawText) {
      onSpeak(rawText, {
        speaker,
        mode: speaker === 'felice' ? 'ai' : undefined,
        onEnd:
          speaker === 'felice'
            ? () => {
                if (!cancelled) setSpeechDone(true);
              }
            : undefined
      });
    } else {
      cancelSpeechSynthesis();
    }
    return () => {
      cancelled = true;
      cancelSpeechSynthesis();
    };
  }, [node.type, rawText, speaker, onSpeak]);

  // Auto-advance after Felice finishes speaking & typing finishes
  useEffect(() => {
    if (isPaused || speaker !== 'felice' || !speechDone || !isTypingDone) return;
    const delayMs = isFinalNode ? 650 : 400;
    const timer = window.setTimeout(() => {
      if (document.querySelector('.nasa-modal-backdrop, .settings-modal-backdrop')) {
        return;
      }
      onAdvanceRef.current();
    }, delayMs);
    return () => window.clearTimeout(timer);
  }, [isPaused, speaker, speechDone, isTypingDone, isFinalNode]);

  const handleInteract = useCallback(() => {
    if (!isTypingDone) {
      setTypedLen(rawText.length);
      return;
    }
    cancelSpeechSynthesis();
    onAdvance();
  }, [isTypingDone, rawText.length, onAdvance]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        target.closest(
          '.earth-comms-settings-btn, .page-nav-bar, .nasa-media-stage, button'
        )
      ) {
        return;
      }
      e.preventDefault();
      handleInteract();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleInteract]);

  return (
    <div
      className="spaceship-intro-overlay earth-transmission-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Earth Mission Control Deep Space Transmission"
    >
      <button
        type="button"
        className="corner-settings-btn earth-comms-settings-btn"
        onClick={onOpenSettings}
        aria-label="Open settings menu"
        title="Settings"
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

      <div className="earth-transmission-layout">
        <div className="earth-transmission-banner">
          <span className="earth-signal-pulse" aria-hidden="true" />
          <span>PRIORITY TRANSMISSION // EARTH MISSION CONTROL</span>
        </div>

        {activeMediaCue && (
          <div className="earth-transmission-media">
            <NasaMediaStage
              mediaCue={activeMediaCue}
              reduceMotion={reduceMotion}
            />
          </div>
        )}

        <div className="spaceship-intro-stage">
          <FeliceCatbot
            stage="beside_pad"
            isTalking={speaker === 'felice' && !isTypingDone && !isPaused}
            statusText={
              speaker === 'system'
                ? 'Earth calling!'
                : isFinalNode
                  ? 'To Deep Space!'
                  : 'Clearance!'
            }
          />

          <div
            className="spaceship-dialogue-card"
            role="button"
            tabIndex={0}
            onClick={handleInteract}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleInteract();
              }
            }}
          >
            <div className="spaceship-dialogue-top">
              <div className="bot-popup-header">
                <span className="bot-popup-dot" aria-hidden="true" />
                <span>
                  {speaker === 'system'
                    ? 'EARTH MISSION CONTROL // COMMS'
                    : `${NARRATOR_NAME} // DEEP SPACE CLEARANCE`}
                </span>
              </div>
              <div className="spaceship-top-actions">
                {speaker === 'felice' && <FeliceTextboxControls />}
                <button
                  type="button"
                  className="spaceship-intro-skip-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInteract();
                  }}
                >
                  {!isTypingDone
                    ? 'Show All ▶'
                    : isFinalNode
                      ? '🚀 Travel to Deep Space ▶'
                      : 'Next ▶'}
                </button>
              </div>
            </div>

            <p className="bot-popup-text">{rawText.slice(0, typedLen)}</p>

            <div className="intro-dialogue-footer">
              <span className="bot-popup-footer">
                {speaker === 'system'
                  ? 'Incoming Earth message — click or press Space to continue'
                  : isFinalNode
                    ? 'Click or wait to engage Deep Space console jump!'
                    : 'Felice is briefing the crew...'}
              </span>
              <PageNavBar
                onBack={() => {
                  cancelSpeechSynthesis();
                  onBack();
                }}
                onNext={handleInteract}
                backTitle="Previous step"
                nextLabel={isFinalNode ? 'Deep Space ▶' : 'Next ▶'}
                nextTitle={
                  isFinalNode
                    ? 'Travel through Deep Space to Pioneer mission'
                    : 'Next message'
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
