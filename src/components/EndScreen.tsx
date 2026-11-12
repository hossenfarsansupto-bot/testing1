import React, { useEffect, useRef, useState } from 'react';
import { useStory } from '../engine/storyState';
import { END_CREDITS, END_TRIVIA } from '../content/creditsData';
import {
  FeliceDinoRunnerCanvas,
  RetroSpaceGameCanvas
} from './EndScreenCanvases';
import { MainConsoleBackground } from './MainConsoleBackground';
import { CosmicSagaWordmark } from './CosmicSagaWordmark';
import { drawSpaceShuttleStack, type ExhaustSpark } from './TitleScreen';

interface EndScreenProps {
  onBack: () => void;
  onPlayAgain: () => void;
  onOpenSettings: () => void;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

/**
 * Full-screen reverse opening finale:
 * Starts zoomed inside the Space Shuttle cockpit windshield, smoothly zooms OUT to reveal
 * the Space Shuttle orbiter floating in space, fires the shuttle engines upward out of frame,
 * and leaves us alone in starry deep space.
 */
const ShuttleDepartureFinale: React.FC<{
  reduceMotion?: boolean;
  onBackToCredits: () => void;
  onPlayAgain: () => void;
  onOpenSettings: () => void;
}> = ({ reduceMotion = false, onBackToCredits, onPlayAgain, onOpenSettings }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [leftInSpace, setLeftInSpace] = useState<boolean>(reduceMotion);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const stars = Array.from({ length: 190 }, (_, i) => {
      const h1 = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
      const h2 = Math.sin(i * 78.233 + 1.618) * 43758.5453;
      return {
        nx: h1 - Math.floor(h1),
        ny: h2 - Math.floor(h2),
        r: 0.7 + ((i * 23) % 10) * 0.17,
        twinkleOffset: (i * 0.71) % (Math.PI * 2),
        twinkleSpeed: 0.9 + (i % 6) * 0.32,
        color: i % 15 === 0 ? '#bae6fd' : i % 23 === 0 ? '#fde68a' : '#ffffff'
      };
    });

    const sparks: ExhaustSpark[] = Array.from({ length: 42 }, (_, i) => ({
      x: (i % 7 - 3) * 3.5,
      y: 124 + (i % 5) * 14,
      vx: ((i % 9) - 4) * 5.2,
      vy: 60 + (i % 6) * 18,
      life: (i % 10) * 0.08,
      maxLife: 0.75,
      size: 1.5 + (i % 3) * 0.8,
      hue: i % 2 === 0 ? '#fde047' : '#38bdf8'
    }));

    const startTime = performance.now();
    let prevTime = startTime;
    let rafId = 0;
    let markedDone = reduceMotion;

    const draw = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - prevTime) / 1000));
      prevTime = now;
      const elapsed = (now - startTime) / 1000;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      if (
        canvas.width !== Math.floor(cw * dpr) ||
        canvas.height !== Math.floor(ch * dpr)
      ) {
        canvas.width = Math.floor(cw * dpr);
        canvas.height = Math.floor(ch * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Deep starry cosmos background
      const bg = ctx.createRadialGradient(
        cw * 0.5,
        ch * 0.45,
        20,
        cw * 0.5,
        ch * 0.5,
        Math.max(cw, ch) * 0.85
      );
      bg.addColorStop(0, '#071126');
      bg.addColorStop(0.55, '#030816');
      bg.addColorStop(1, '#010308');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, cw, ch);

      stars.forEach((st) => {
        const tw = 0.52 + 0.48 * Math.sin(elapsed * st.twinkleSpeed + st.twinkleOffset);
        ctx.globalAlpha = clamp(tw, 0.16, 1);
        ctx.fillStyle = st.color;
        ctx.beginPath();
        ctx.arc(st.nx * cw, st.ny * ch, st.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      if (!reduceMotion) {
        // Phase 1 (0s -> 3.4s): Reverse of beginning screen — zoom OUT from cockpit windshield
        const zoomOutProgress = clamp(elapsed / 3.4, 0, 1);
        const easedZoomOut = 1 - Math.pow(1 - zoomOutProgress, 2.1);
        const winZoom = 1 - easedZoomOut;

        // Phase 2 (3.2s -> 7.0s): Rocket accelerates UPWARD out of frame with thrusters ALREADY ON from frame 0
        const departT = clamp((elapsed - 3.2) / 3.8, 0, 1);
        const thrust = 1;
        const climbProgress = Math.pow(departT, 2.15);
        const shuttleCenterY = ch * 0.53 - climbProgress * (ch * 1.15);

        sparks.forEach((sp) => {
          sp.life -= dt * (0.8 + thrust * 1.5);
          if (sp.life <= 0) {
            sp.x = (Math.random() - 0.5) * 20;
            sp.y = 122 + Math.random() * 14;
            sp.vx = (Math.random() - 0.5) * 32;
            sp.vy = 75 + Math.random() * 110;
            sp.maxLife = 0.5 + Math.random() * 0.45;
            sp.life = sp.maxLife;
          } else if (thrust > 0.04) {
            sp.x += sp.vx * dt;
            sp.y += sp.vy * dt * (0.4 + thrust * 1.1);
          }
        });

        const unitScale = clamp(Math.min(cw, ch) / 520, 0.72, 1.38);

        if (departT < 0.995) {
          drawSpaceShuttleStack(
            ctx,
            cw * 0.5,
            shuttleCenterY,
            unitScale,
            0,
            elapsed,
            sparks,
            {
              srbSep: 1, // Already in space — pure white orbiter without SRBs/ET
              etSep: 1,
              winZoom,
              thrust
            }
          );
        } else if (!markedDone) {
          markedDone = true;
          setLeftInSpace(true);
        }

        rafId = requestAnimationFrame(draw);
      }
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [reduceMotion]);

  return (
    <div
      className="end-shuttle-finale"
      role="main"
      aria-label="Space Shuttle Departure Finale"
    >
      <canvas ref={canvasRef} className="end-finale-canvas" aria-hidden="true" />

      <div className="end-finale-top-controls">
        <button
          type="button"
          className="page-nav-btn"
          onClick={onBackToCredits}
        >
          ◀ Credits
        </button>
        <div className="end-top-right-group">
          <button
            type="button"
            className="page-nav-btn"
            onClick={onOpenSettings}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {leftInSpace && (
        <div className="end-left-in-space-wordmark-wrap">
          <CosmicSagaWordmark className="end-finale-wordmark" />
          <div className="end-finale-actions">
            <button
              type="button"
              className="page-nav-btn"
              onClick={onBackToCredits}
            >
              ↺ Replay Credits
            </button>
            <button
              type="button"
              className="page-nav-btn next"
              onClick={onPlayAgain}
            >
              Start New Journey ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const EndScreen: React.FC<EndScreenProps> = ({
  onBack,
  onPlayAgain,
  onOpenSettings
}) => {
  const { state } = useStory();
  const reduceMotion = state.settings.reduceMotion;

  const [stage, setStage] = useState<'cockpit' | 'shuttle_finale'>('cockpit');
  const [triviaIndex, setTriviaIndex] = useState<number>(0);
  const [triviaVisible, setTriviaVisible] = useState<boolean>(true);
  const [creditsLoopKey, setCreditsLoopKey] = useState<number>(0);
  const creditsColRef = useRef<HTMLDivElement | null>(null);
  const [creditsStartY, setCreditsStartY] = useState<number>(480);

  useEffect(() => {
    if (stage !== 'cockpit') return;
    const syncColHeight = () => {
      if (creditsColRef.current) {
        setCreditsStartY(Math.max(260, creditsColRef.current.clientHeight));
      }
    };
    syncColHeight();
    window.addEventListener('resize', syncColHeight);
    return () => window.removeEventListener('resize', syncColHeight);
  }, [stage]);

  // Cycle Trivia 1..4 on left middle-to-bottom: appear -> stay -> fade out -> next
  useEffect(() => {
    if (stage !== 'cockpit') return;
    setTriviaVisible(true);
    const hideTimer = window.setTimeout(() => {
      setTriviaVisible(false);
    }, 6400);
    const swapTimer = window.setTimeout(() => {
      setTriviaIndex((prev) => (prev + 1) % END_TRIVIA.length);
      setTriviaVisible(true);
    }, 7100);
    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(swapTimer);
    };
  }, [stage, triviaIndex]);

  if (stage === 'shuttle_finale') {
    return (
      <ShuttleDepartureFinale
        reduceMotion={reduceMotion}
        onBackToCredits={() => {
          setCreditsLoopKey((k) => k + 1);
          setTriviaIndex(0);
          setStage('cockpit');
        }}
        onPlayAgain={onPlayAgain}
        onOpenSettings={onOpenSettings}
      />
    );
  }

  return (
    <div
      className="hub-layout main-console-hub end-cockpit-root"
      role="main"
      aria-label="Spacecraft Credits and Retro Arcade Ending"
    >
      {/* Exact Spacecraft Cockpit Interior & Subtle Hyperdrive Star Streaks Window */}
      <MainConsoleBackground travelPhase="hyperspace" subtleHyperspace />

      {/* Top HUD Controls */}
      <div className="end-cockpit-topbar">
        <button
          type="button"
          className="page-nav-btn"
          onClick={onBack}
          title="Back to Final Scene"
        >
          ◀ Back
        </button>
        <div className="end-top-right-group">
          <button
            type="button"
            className="page-nav-btn next"
            onClick={() => setStage('shuttle_finale')}
            title="Proceed to final Space Shuttle departure"
          >
            Shuttle Finale ▶
          </button>
          <button
            type="button"
            className="page-nav-btn"
            onClick={onOpenSettings}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Window Content Band: Left (Felice B&W Lunar Runner top-mid + Trivia mid-bottom) | Right (Movie Credits) */}
      <div className="end-window-overlay-grid">
        <div className="end-window-left-col">
          {/* Middle-to-Top Left: Black & White Transparent-White-Outline Felice Chrome-Dino Jumping Moon Craters */}
          <div className="end-dino-card">
            <FeliceDinoRunnerCanvas reduceMotion={reduceMotion} />
          </div>

          {/* Middle-to-Bottom Left: Glass-Mounted Rotating Fact (transparent box, no border, no "Trivia" word) */}
          <div
            className={`end-trivia-card ${triviaVisible ? 'is-visible' : 'is-hidden'}`}
            aria-live="polite"
          >
            <p className="end-trivia-text">{END_TRIVIA[triviaIndex]}</p>
          </div>
        </div>

        {/* Right Side: Movie-Style Vertical Scrolling Credits (exits spacecraft only after last line disappears above top) */}
        <div
          ref={creditsColRef}
          className="end-window-right-col"
          aria-label="Mission Credits"
        >
          <div
            key={creditsLoopKey}
            className="end-credits-scroll-track"
            style={{ '--credits-start-y': `${creditsStartY}px` } as React.CSSProperties}
            onAnimationEnd={(e) => {
              if (e.target === e.currentTarget) {
                setStage('shuttle_finale');
              }
            }}
          >
            <div className="end-credits-title-banner">
              <span className="end-credits-kicker">MISSION DEBRIEF ARCHIVE</span>
              <h2 className="end-credits-heading">COSMIC SAGA</h2>
            </div>

            {END_CREDITS.map((entry) => (
              <div key={entry.role} className="end-credit-block">
                <div className="end-credit-role">{entry.role}</div>
                {entry.members.map((person) => (
                  <div key={person} className="end-credit-name">
                    {person}
                  </div>
                ))}
              </div>
            ))}

            <div className="end-credits-closing">
              THANK YOU FOR EXPLORING WITH FELICE
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacecraft Console: Retro Black & White Space Arcade Game */}
      <div className="end-console-bay">
        <div className="unified-cockpit-pad end-retro-console-pad">
          <div className="computer-top-vents" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="amongus-screen-surface unified-pad-screen end-retro-screen">
            <RetroSpaceGameCanvas reduceMotion={reduceMotion} />
          </div>
        </div>
      </div>
    </div>
  );
};
