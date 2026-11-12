import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FeliceCatbot } from './FeliceCatbot';
import { FeliceTextboxControls } from './DialogueBox';
import { useStory } from '../engine/storyState';
import { PageNavBar } from './PageNavBar';
import {
  getIntroPerf,
  INTRO_NODES
} from '../content/feliceIntroChoreography';
import { playCalibrationChime, useSpeech } from '../engine/useSpeech';
import { FeliceVoiceStyle, SayNode, TypingSpeed } from '../types';
import { TYPING_SPEED_MS } from '../content/config';

interface SpaceshipIntroOverlayProps {
  narrationEnabled: boolean;
  typingSpeed: TypingSpeed;
  reduceMotion: boolean;
  voiceStyle: FeliceVoiceStyle;
  onBackToTitle: () => void;
  onComplete: () => void;
}

/**
 * Spotlight interactive introduction inside the spaceship cockpit right after rocket launch.
 * Dims cabin lighting and grays out game controls while Felice introduces herself
 * following the original intro.json script, then restores full game functionality.
 */
export const SpaceshipIntroOverlay: React.FC<SpaceshipIntroOverlayProps> = ({
  narrationEnabled,
  typingSpeed,
  reduceMotion,
  voiceStyle,
  onBackToTitle,
  onComplete
}) => {
  const { state: storyState } = useStory();
  const isPaused = storyState.isPaused;
  const [stage, setStage] = useState<'waiting' | 'introducing'>('waiting');
  const [nodeIndex, setNodeIndex] = useState<number>(0);
  const [typedLen, setTypedLen] = useState<number>(0);
  const [speechDone, setSpeechDone] = useState<boolean>(false);

  const { speak, stop: stopSpeech } = useSpeech(narrationEnabled, voiceStyle);

  const currentNode = INTRO_NODES[nodeIndex] ?? INTRO_NODES[0];
  const currentPerf = getIntroPerf(nodeIndex);
  const rawText = currentNode?.text ?? '';
  const listItems =
    currentNode?.type === 'say' ? (currentNode as SayNode).list : undefined;
  const isTypingDone = typedLen >= rawText.length;

  // Typewriter reveal for each original script line
  useEffect(() => {
    if (isPaused || stage !== 'introducing') return;
    if (reduceMotion || typingSpeed === 'instant') {
      setTypedLen(rawText.length);
      return;
    }
    if (typedLen >= rawText.length) return;
    const ms = Math.max(12, TYPING_SPEED_MS[typingSpeed]);
    const timer = window.setTimeout(() => {
      setTypedLen((prev) => Math.min(rawText.length, prev + 2));
    }, ms);
    return () => window.clearTimeout(timer);
  }, [isPaused, stage, typedLen, rawText.length, reduceMotion, typingSpeed]);

  // Felice Narration speech + calibration chime between AI voice & Robotic voice.
  // Stage nodes (e.g. "Awkward silence") remain silent and hold a brief beat instead of being spoken.
  useEffect(() => {
    let cancelled = false;
    setSpeechDone(false);
    if (stage !== 'introducing') return;
    if (currentNode?.type !== 'say') {
      stopSpeech();
      if (narrationEnabled && !isPaused && nodeIndex + 1 < INTRO_NODES.length) {
        const silentBeatTimer = window.setTimeout(() => {
          if (!cancelled) setSpeechDone(true);
        }, 1600);
        return () => {
          cancelled = true;
          window.clearTimeout(silentBeatTimer);
        };
      }
      return () => {
        cancelled = true;
      };
    }
    if (nodeIndex === 5) {
      playCalibrationChime(narrationEnabled);
    }
    let spoken = rawText;
    if (listItems && listItems.length > 0) {
      spoken +=
        '. ' +
        listItems.map((item, idx) => `Rule ${idx + 1}: ${item}`).join('. ');
    }
    const spk = (currentNode as SayNode).speaker;
    const shouldAutoAdvance =
      nodeIndex + 1 < INTRO_NODES.length && (spk === 'felice' || nodeIndex === 0);
    speak(spoken, {
      mode: currentPerf.voiceMode,
      speaker: spk,
      onEnd: shouldAutoAdvance
        ? () => {
            if (!cancelled) setSpeechDone(true);
          }
        : undefined
    });
    return () => {
      cancelled = true;
    };
  }, [
    stage,
    nodeIndex,
    rawText,
    listItems,
    currentNode,
    currentPerf.voiceMode,
    narrationEnabled,
    isPaused,
    speak,
    stopSpeech
  ]);

  const reduceMotionRef = useRef(reduceMotion);
  reduceMotionRef.current = reduceMotion;
  const typingSpeedRef = useRef(typingSpeed);
  typingSpeedRef.current = typingSpeed;

  // Automatically switch to next intro beat once Felice finishes speaking
  useEffect(() => {
    if (isPaused || stage !== 'introducing' || !speechDone || !isTypingDone) return;
    if (nodeIndex + 1 >= INTRO_NODES.length) return;
    const timer = window.setTimeout(() => {
      if (document.querySelector('.settings-modal-backdrop')) return;
      const nextIdx = nodeIndex + 1;
      setNodeIndex(nextIdx);
      setTypedLen(
        reduceMotionRef.current || typingSpeedRef.current === 'instant'
          ? INTRO_NODES[nextIdx].text.length
          : 0
      );
    }, 350);
    return () => window.clearTimeout(timer);
  }, [isPaused, stage, speechDone, isTypingDone, nodeIndex]);

  useEffect(() => {
    return () => stopSpeech();
  }, [stopSpeech]);

  const finishIntro = useCallback(() => {
    stopSpeech();
    onComplete();
  }, [stopSpeech, onComplete]);

  const handleInteract = useCallback(() => {
    if (stage === 'waiting') {
      setStage('introducing');
      setNodeIndex(0);
      setTypedLen(reduceMotion || typingSpeed === 'instant' ? INTRO_NODES[0].text.length : 0);
      return;
    }
    if (!isTypingDone) {
      setTypedLen(rawText.length);
      return;
    }
    if (nodeIndex + 1 < INTRO_NODES.length) {
      const nextIdx = nodeIndex + 1;
      setNodeIndex(nextIdx);
      setTypedLen(
        reduceMotion || typingSpeed === 'instant'
          ? INTRO_NODES[nextIdx].text.length
          : 0
      );
    } else {
      finishIntro();
    }
  }, [stage, isTypingDone, rawText.length, nodeIndex, reduceMotion, typingSpeed, finishIntro]);

  const handleBack = useCallback(() => {
    if (stage === 'waiting') {
      stopSpeech();
      onBackToTitle();
      return;
    }
    if (nodeIndex > 0) {
      const prevIdx = nodeIndex - 1;
      setNodeIndex(prevIdx);
      setTypedLen(INTRO_NODES[prevIdx].text.length);
    } else {
      stopSpeech();
      setStage('waiting');
    }
  }, [stage, nodeIndex, stopSpeech, onBackToTitle]);

  // Press Space anywhere to talk to Felice & step through her intro
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        target.closest('.spaceship-intro-skip-btn, .page-nav-bar')
      ) {
        return;
      }
      e.preventDefault();
      handleInteract();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInteract]);

  return (
    <div
      className="spaceship-intro-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Felice Spacecraft Introduction"
    >
      <div className="spaceship-intro-stage">
        {stage === 'waiting' ? (
          <div
            className="spaceship-talk-card"
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
            <div className="bot-popup-header">
              <span className="bot-popup-dot" aria-hidden="true" />
              <span>COCKPIT COMMS // STANDBY</span>
            </div>
            <div className="spaceship-talk-headline">
              Talk to Felice, Press Space or Click to Interact
            </div>

            <div className="bot-popup-footer">
              Spaceship controls offline until Felice completes mission briefing
            </div>
            <div className="intro-nav-row">
              <PageNavBar
                onBack={handleBack}
                onNext={handleInteract}
                backTitle="Return to launch screen"
                nextTitle="Talk to Felice"
              />
            </div>
          </div>
        ) : (
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
                <span>{currentPerf.label}</span>
              </div>
              <div className="spaceship-top-actions">
                <FeliceTextboxControls />
                <button
                  type="button"
                  className="spaceship-intro-skip-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    finishIntro();
                  }}
                >
                  Skip Intro ⏭
                </button>
              </div>
            </div>

            <p className="spaceship-dialogue-text">
              {rawText.slice(0, typedLen)}
              {!isTypingDone && (
                <span className="bot-typing-cursor" aria-hidden="true">
                  ▌
                </span>
              )}
            </p>

            {isTypingDone && listItems && listItems.length > 0 && (
              <ol className="spaceship-dialogue-rules">
                {listItems.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ol>
            )}

            <div className="bot-popup-footer">
              {isTypingDone
                ? nodeIndex + 1 >= INTRO_NODES.length
                  ? 'Press Space or Click to unlock Navigation Console ▶'
                  : `Press Space or Click to continue (${nodeIndex + 1}/${INTRO_NODES.length})`
                : 'Press Space or Click to complete line...'}
            </div>
            <div className="intro-nav-row">
              <PageNavBar
                onBack={handleBack}
                onNext={handleInteract}
                backTitle={nodeIndex > 0 ? 'Previous intro line' : 'Back to standby'}
                nextTitle={
                  nodeIndex + 1 >= INTRO_NODES.length
                    ? 'Unlock Navigation Console'
                    : 'Next intro line'
                }
              />
            </div>
          </div>
        )}

        <FeliceCatbot
          stage="beside_pad"
          isTalking={stage === 'introducing' && !isTypingDone && !isPaused}
          expression={stage === 'waiting' ? 'neutral' : currentPerf.expression}
          gesture={stage === 'waiting' ? 'wave' : currentPerf.gesture}
          interactive
          onClick={handleInteract}
          statusText={
            stage === 'waiting'
              ? 'Talk to Felice!'
              : nodeIndex === 5
                ? 'Calibrating...'
                : undefined
          }
        />
      </div>
    </div>
  );
};
