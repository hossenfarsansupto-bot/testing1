import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChoiceNode,
  MenuNode,
  SayNode,
  Scene,
  StoryNode,
  TypingSpeed
} from '../types';
import { NARRATOR_NAME, TYPING_SPEED_MS } from '../content/config';
import { getSceneMediaCue } from '../content/nasaMediaCatalog';
import { cancelSpeechSynthesis, SpeakOptions } from '../engine/useSpeech';
import { useStory } from '../engine/storyState';
import { FeliceCatbot } from './FeliceCatbot';
import { FeliceTextboxControls } from './DialogueBox';
import { NasaMediaStage } from './NasaMediaStage';
import { PageNavBar } from './PageNavBar';
import {
  createSeededBgStars,
  drawParkedRover2D,
  drawSiteHardware2D,
  drawSurfaceBackdrop,
  PlanetTheme
} from './surface2dArt';

interface OutsideEvaSceneProps {
  destination: PlanetTheme;
  scene: Scene;
  node: StoryNode;
  nodeIndex: number;
  visitedMenuOptions?: string[];
  typingSpeed: TypingSpeed;
  reduceMotion: boolean;
  onAdvance: () => void;
  onBack: () => void;
  onChooseOption: (optionIndex: number) => void;
  onChooseMenuOption?: (optionId: string) => void;
  onExitToRover: () => void;
  onMarkComplete?: () => void;
  onSpeak?: (text: string, options?: SpeakOptions) => void;
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/**
 * Full-screen Outside-the-Rover 2D EVA Scene.
 * Fades in from black, animates Catbot Felice entering the frame from the parked
 * rover toward the NASA hardware, and then pops up the interactive Cat Chatbot.
 */
export const OutsideEvaScene: React.FC<OutsideEvaSceneProps> = ({
  destination,
  scene,
  node,
  nodeIndex,
  visitedMenuOptions = [],
  typingSpeed,
  reduceMotion,
  onAdvance,
  onBack,
  onChooseOption,
  onChooseMenuOption,
  onExitToRover,
  onMarkComplete,
  onSpeak
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgStars = useMemo(() => createSeededBgStars(), []);
  const startTimeRef = useRef<number>(performance.now());

  const [chatPopupVisible, setChatPopupVisible] = useState<boolean>(reduceMotion);

  const rawText =
    node.type === 'say' || node.type === 'stage'
      ? node.text
      : node.type === 'choice'
        ? node.prompt || 'Choose an experiment:'
        : node.type === 'menu'
          ? node.prompt
          : '';

  const { state: storyState } = useStory();
  const isPaused = storyState.isPaused;
  const [typedLen, setTypedLen] = useState<number>(
    typingSpeed === 'instant' || reduceMotion ? rawText.length : 0
  );
  const [speechDone, setSpeechDone] = useState<boolean>(false);
  const typeTimerRef = useRef<number | null>(null);
  const onAdvanceRef = useRef(onAdvance);
  onAdvanceRef.current = onAdvance;
  const isTypingDone = typedLen >= rawText.length;

  // Trigger Cat Chatbot popup right after Felice finishes coming into the frame
  useEffect(() => {
    startTimeRef.current = performance.now();
    if (reduceMotion) {
      setChatPopupVisible(true);
      return;
    }
    setChatPopupVisible(false);
    const timer = window.setTimeout(() => {
      setChatPopupVisible(true);
    }, 1550);
    return () => window.clearTimeout(timer);
  }, [scene.id, reduceMotion]);

  // Speech narration & typewriter once chatbot pops up
  useEffect(() => {
    let cancelled = false;
    setSpeechDone(false);
    if (!chatPopupVisible) return;
    if (onSpeak && node.type === 'say') {
      const spk = (node as SayNode).speaker;
      onSpeak(node.text, {
        speaker: spk,
        mode: spk === 'felice' ? 'ai' : undefined,
        onEnd:
          spk === 'felice'
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
  }, [chatPopupVisible, node, onSpeak]);

  // Automatically advance to next line once Felice finishes speaking & typing completes
  useEffect(() => {
    if (isPaused || !chatPopupVisible) return;
    if (node.type !== 'say' || (node as SayNode).speaker !== 'felice') return;
    if (!speechDone || !isTypingDone) return;
    const timer = window.setTimeout(() => {
      if (document.querySelector('.nasa-modal-backdrop, .settings-modal-backdrop')) {
        return;
      }
      onAdvanceRef.current();
    }, 350);
    return () => window.clearTimeout(timer);
  }, [isPaused, chatPopupVisible, node, speechDone, isTypingDone]);

  // Ensure Felice stops speaking immediately if the EVA scene unmounts
  useEffect(() => {
    return () => {
      cancelSpeechSynthesis();
    };
  }, []);

  useEffect(() => {
    if (!chatPopupVisible) {
      setTypedLen(0);
      return;
    }
    if (typingSpeed === 'instant' || reduceMotion || node.type === 'choice') {
      setTypedLen(rawText.length);
      return;
    }
    setTypedLen(0);
  }, [chatPopupVisible, rawText, node.type, typingSpeed, reduceMotion]);

  useEffect(() => {
    if (
      isPaused ||
      !chatPopupVisible ||
      typingSpeed === 'instant' ||
      reduceMotion ||
      node.type === 'choice' ||
      isTypingDone
    ) {
      return;
    }
    if (typeTimerRef.current) clearInterval(typeTimerRef.current);
    const speedMs = TYPING_SPEED_MS[typingSpeed];
    typeTimerRef.current = window.setInterval(() => {
      setTypedLen((prev) => {
        if (prev + 1 >= rawText.length) {
          if (typeTimerRef.current) clearInterval(typeTimerRef.current);
          return rawText.length;
        }
        return prev + 1;
      });
    }, speedMs);
    return () => {
      if (typeTimerRef.current) clearInterval(typeTimerRef.current);
    };
  }, [isPaused, chatPopupVisible, rawText, node.type, typingSpeed, reduceMotion, isTypingDone]);

  const isTalkingRef = useRef<boolean>(false);
  isTalkingRef.current = chatPopupVisible && !isTypingDone && !isPaused;

  // Full-screen 60fps 2D Canvas animation loop (Middle portion clear for studying hardware!)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let rafId = 0;

    const syncSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetW = Math.max(1, Math.round(rect.width * dpr));
      const targetH = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
      return { w: rect.width, h: rect.height, dpr };
    };

    const drawFrame = (now: number) => {
      const { w, h, dpr } = syncSize();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const elapsed = reduceMotion ? 3.0 : (now - startTimeRef.current) / 1000;
      const svgScale = Math.max(w / 1200, h / 700);
      const svgOffX = (w - 1200 * svgScale) * 0.5;
      const svgOffY = (h - 700 * svgScale) * 0.5;

      // Keep horizon around upper-mid height so middle stage above dialogue box is clear
      const groundY = h * 0.52;
      const horizonShiftY = (groundY - svgOffY) / svgScale - 335;

      drawSurfaceBackdrop(
        ctx,
        destination,
        w,
        h,
        svgOffX,
        svgOffY,
        svgScale,
        elapsed,
        bgStars,
        horizonShiftY
      );

      const unitScale = clamp(Math.min(w / 820, h / 680), 0.72, 1.38);

      // 1. Animated NASA Hardware Object centered cleanly in the open middle-right area for study
      const hwX = w * 0.53;
      const hwY = groundY + 12 * unitScale;
      drawSiteHardware2D(
        ctx,
        scene.id,
        hwX,
        hwY,
        unitScale * 1.62,
        elapsed
      );

      // 2. Parked Rover tucked neatly on the far right side, keeping Felice (left) & Hardware (center) clear
      const roverX = w * 0.85;
      const roverY = groundY + 10 * unitScale;
      drawParkedRover2D(
        ctx,
        roverX,
        roverY,
        unitScale * 0.92,
        elapsed,
        false,
        destination
      );

      rafId = requestAnimationFrame(drawFrame);
    };

    rafId = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(rafId);
  }, [destination, scene.id, bgStars, reduceMotion]);

  const handleAdvanceClick = useCallback(() => {
    if (!chatPopupVisible) return;
    if (node.type === 'choice' || node.type === 'menu') return;
    if (!isTypingDone) {
      if (typeTimerRef.current) clearInterval(typeTimerRef.current);
      setTypedLen(rawText.length);
      return;
    }
    onAdvance();
  }, [chatPopupVisible, node.type, isTypingDone, rawText.length, onAdvance]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.code !== 'Space' ||
        !chatPopupVisible ||
        node.type === 'choice' ||
        node.type === 'menu'
      ) {
        return;
      }
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'A' ||
          target.tagName === 'VIDEO' ||
          target.closest('.nasa-media-stage, .nasa-modal-backdrop, .page-nav-bar') ||
          (target.tagName === 'BUTTON' &&
            !target.classList.contains('eva-chatbot-dialogue-btn')))
      ) {
        return;
      }
      e.preventDefault();
      handleAdvanceClick();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [chatPopupVisible, node.type, handleAdvanceClick]);

  const activeMediaCue = getSceneMediaCue(scene, node, nodeIndex);
  const hasInteractiveMenu = node.type === 'choice' || node.type === 'menu';

  return (
    <div
      className={`outside-eva-screen ${reduceMotion ? 'reduce-motion' : ''}`}
      role="main"
      aria-label={`Outside rover EVA inspection: ${scene.title}`}
    >
      <canvas ref={canvasRef} className="outside-eva-canvas" aria-hidden="true" />

      {/* Top minimal EVA site pill & Back/Next navigation bar */}
      <div className="eva-top-bar">
        <span className="eva-location-pill">
          <span className="eva-live-dot" aria-hidden="true" />
          OUTSIDE ROVER // {scene.title.toUpperCase()}
        </span>
        <div className="eva-top-actions">
          <PageNavBar
            onBack={onBack}
            onNext={handleAdvanceClick}
            nextDisabled={hasInteractiveMenu}
            backTitle="Previous line / back to rover sites"
            nextTitle={
              hasInteractiveMenu
                ? 'Choose an option below to continue'
                : 'Next line'
            }
          />
          {onMarkComplete && (
            <button
              type="button"
              className="pad-complete-btn"
              onClick={() => {
                cancelSpeechSynthesis();
                onMarkComplete();
              }}
              title="Mark this mission complete and continue"
            >
              ✓ Mark as Complete
            </button>
          )}
          <button
            type="button"
            className="pad-back-btn"
            onClick={onExitToRover}
          >
            « Back Inside Rover
          </button>
        </div>
      </div>

      {/* Visual-Novel Bottom Stage: Felice standing on LEFT side, middle open for hardware & synced media */}
      <div className="eva-vn-stage">
        {chatPopupVisible && activeMediaCue && (
          <div className="eva-middle-media-slot">
            <NasaMediaStage
              mediaCue={activeMediaCue}
              reduceMotion={reduceMotion}
            />
          </div>
        )}

        <div className="eva-felice-left-stand">
          <FeliceCatbot
            stage="beside_pad"
            isTalking={chatPopupVisible && !isTypingDone}
            expression={
              !chatPopupVisible
                ? 'neutral'
                : node.type === 'choice'
                  ? 'thinking'
                  : isTypingDone
                    ? 'happy'
                    : 'neutral'
            }
            gesture={
              !chatPopupVisible
                ? 'idle'
                : isTypingDone
                  ? 'present'
                  : 'point_display'
            }
          />
        </div>

        {/* Visual-Novel Dialogue Box along bottom (leaving middle viewport clear for hardware study) */}
        {chatPopupVisible && (
          <div className="eva-catbot-chat-popup" role="dialog" aria-label="Felice Narration Box">
            <div className="eva-vn-speaker-bar">
              <span className="eva-vn-speaker-name">
                {node.type === 'choice' ||
                node.type === 'menu' ||
                (node as SayNode).speaker === 'system'
                  ? 'Rover Telemetry'
                  : NARRATOR_NAME}
              </span>
              <div className="eva-vn-bar-right">
                {node.type !== 'choice' &&
                  node.type !== 'menu' &&
                  (node as SayNode).speaker !== 'system' && (
                    <FeliceTextboxControls />
                  )}
                <span className="eva-vn-site-tag">
                  {destination.replace('_', ' ').toUpperCase()} // EVA STUDY
                </span>
              </div>
            </div>

            {node.type === 'choice' ? (
              <div className="eva-chatbot-choice-area">
                <p className="eva-chatbot-text">
                  {(node as ChoiceNode).prompt || 'Choose an experiment:'}
                </p>
                <div className="pad-mission-choice-grid">
                  {(node as ChoiceNode).options.map((opt, idx) => (
                    <button
                      key={opt.label}
                      type="button"
                      className="pad-mission-choice-btn"
                      onClick={() => onChooseOption(idx)}
                    >
                      <span className="choice-num">{idx + 1}.</span>{' '}
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : node.type === 'menu' ? (
              <div className="eva-chatbot-choice-area">
                <p className="eva-chatbot-text">
                  {(node as MenuNode).prompt}
                </p>
                <div className="pad-mission-choice-grid eva-menu-grid">
                  {(node as MenuNode).options.map((opt, idx) => {
                    const isVisited = visitedMenuOptions.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`pad-mission-choice-btn ${
                          isVisited ? 'is-visited' : ''
                        }`}
                        onClick={() => onChooseMenuOption?.(opt.id)}
                      >
                        <span className="choice-num">
                          {isVisited ? '✓' : `${idx + 1}.`}
                        </span>{' '}
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="eva-chatbot-dialogue-btn"
                onClick={handleAdvanceClick}
              >
                <p className="eva-chatbot-text">
                  {rawText.slice(0, typedLen)}
                </p>
                {node.type === 'say' &&
                  (node as SayNode).list &&
                  isTypingDone && (
                    <ul className="eva-chatbot-list">
                      {(node as SayNode).list!.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                <div className="eva-chatbot-footer">
                  <span className="eva-vn-continue-hint">
                    {isTypingDone ? 'click to continue 👆' : 'click to complete...'}
                  </span>
                </div>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
