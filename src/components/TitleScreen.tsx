import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CosmicSagaWordmark } from './CosmicSagaWordmark';
import { PageNavBar } from './PageNavBar';
import { playClickSfx } from '../engine/soundEffects';

interface TitleScreenProps {
  hasSavedGame: boolean;
  reduceMotion?: boolean;
  onStart: () => void;
  onContinue: () => void;
  onOpenSettings: () => void;
}

interface SpaceStar {
  nx: number;
  ny: number;
  r: number;
  twinkleOffset: number;
  twinkleSpeed: number;
  alpha: number;
  color: string;
}

export interface ExhaustSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: string;
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function createStarfield(): SpaceStar[] {
  let s = 31415 >>> 0;
  const rng = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const colors = ['#ffffff', '#dbeafe', '#fef3c7', '#bae6fd', '#e2e8f0'];
  const stars: SpaceStar[] = [];
  for (let i = 0; i < 240; i++) {
    stars.push({
      nx: rng(),
      ny: rng(),
      r: 0.65 + Math.pow(rng(), 2.6) * 2.15,
      twinkleOffset: rng() * Math.PI * 2,
      twinkleSpeed: 1.4 + rng() * 2.4,
      alpha: 0.35 + rng() * 0.65,
      color: colors[i % colors.length]
    });
  }
  return stars;
}

function drawExhaustPlume(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  length: number,
  intensity: number,
  blueCore: boolean
) {
  if (intensity <= 0.01) return;

  const halo = ctx.createRadialGradient(
    x,
    y + length * 0.25,
    2,
    x,
    y + length * 0.3,
    length * 0.85
  );
  halo.addColorStop(
    0,
    blueCore
      ? `rgba(56, 189, 248, ${0.42 * intensity})`
      : `rgba(251, 146, 60, ${0.45 * intensity})`
  );
  halo.addColorStop(0.5, `rgba(249, 115, 22, ${0.22 * intensity})`);
  halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.ellipse(x, y + length * 0.35, width * 2.1, length * 0.78, 0, 0, Math.PI * 2);
  ctx.fill();

  const outerGrad = ctx.createLinearGradient(x, y, x, y + length);
  outerGrad.addColorStop(0, `rgba(255, 247, 237, ${0.98 * intensity})`);
  outerGrad.addColorStop(0.28, `rgba(251, 146, 60, ${0.92 * intensity})`);
  outerGrad.addColorStop(0.7, `rgba(234, 88, 12, ${0.48 * intensity})`);
  outerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = outerGrad;
  ctx.beginPath();
  ctx.moveTo(x - width * 0.58, y);
  ctx.quadraticCurveTo(x - width * 1.15, y + length * 0.42, x, y + length);
  ctx.quadraticCurveTo(x + width * 1.15, y + length * 0.42, x + width * 0.58, y);
  ctx.closePath();
  ctx.fill();

  const coreGrad = ctx.createLinearGradient(x, y, x, y + length * 0.62);
  coreGrad.addColorStop(0, '#ffffff');
  coreGrad.addColorStop(
    0.55,
    blueCore
      ? `rgba(125, 211, 252, ${0.9 * intensity})`
      : `rgba(254, 240, 138, ${0.9 * intensity})`
  );
  coreGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.moveTo(x - width * 0.3, y);
  ctx.quadraticCurveTo(x, y + length * 0.7, x + width * 0.3, y);
  ctx.closePath();
  ctx.fill();
}

/**
 * Draws the full Space Shuttle launch stack matching the uploaded reference photo:
 * - Rust-orange External Tank (ET)
 * - Twin white Solid Rocket Boosters (SRBs) with segment rings
 * - Delta-winged pearl-white Orbiter ("aeroship") with multi-pane black cockpit windows
 * Animates SRB separation, External Tank ejection, and camera zoom into the cockpit window.
 */
export function drawSpaceShuttleStack(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  unit: number,
  progress: number,
  timeSec: number,
  sparks: ExhaustSpark[],
  overrides?: {
    thrust?: number;
    srbSep?: number;
    etSep?: number;
    winZoom?: number;
  }
) {
  const thrust =
    overrides?.thrust ?? (progress <= 0.01 ? 0 : clamp(progress * 1.65, 0, 1));

  // Separation & window zoom timelines
  const srbSep = overrides?.srbSep ?? clamp((progress - 0.28) / 0.26, 0, 1);
  const etSep = overrides?.etSep ?? clamp((progress - 0.44) / 0.28, 0, 1);
  const winZoom = overrides?.winZoom ?? clamp((progress - 0.66) / 0.34, 0, 1);

  const zoomFactor = 1 + Math.pow(winZoom, 2.2) * 19.5;
  const totalScale = unit * zoomFactor;

  // Center camera onto the orbiter's flight-deck cockpit window (y = -46 in shuttle coordinates)
  const cockpitWinLocalY = -46;
  const targetOriginX = centerX;
  const targetOriginY = lerp(
    centerY,
    centerY - cockpitWinLocalY * totalScale,
    clamp(winZoom * 1.35, 0, 1)
  );

  ctx.save();
  ctx.translate(targetOriginX, targetOriginY);
  ctx.scale(totalScale, totalScale);

  // Subtle thrust vibration before zooming into window
  if (thrust > 0.03 && winZoom < 0.45) {
    const shakeAmp = Math.min(2.6, thrust * 2.6 * (1 - winZoom * 2));
    ctx.translate(
      Math.sin(timeSec * 56) * shakeAmp,
      Math.cos(timeSec * 48) * shakeAmp * 0.7
    );
  }

  // ------------------------------------------------------------
  // 1. GIANT RUST-ORANGE EXTERNAL FUEL TANK (ejects backward/downward at etSep)
  // ------------------------------------------------------------
  if (etSep < 0.98) {
    const etDropY = Math.pow(etSep, 1.55) * 320;
    const etScale = 1 - etSep * 0.28;
    const etAlpha = clamp(1 - Math.max(0, etSep - 0.68) / 0.3, 0, 1);

    ctx.save();
    ctx.globalAlpha = etAlpha;
    ctx.translate(0, etDropY);
    ctx.scale(etScale, etScale);
    ctx.rotate(etSep * 0.08);

    // Rust-orange body gradient
    const etGrad = ctx.createLinearGradient(-26, 0, 26, 0);
    etGrad.addColorStop(0, '#7c2d12');
    etGrad.addColorStop(0.28, '#ea580c');
    etGrad.addColorStop(0.55, '#c2410c');
    etGrad.addColorStop(0.85, '#9a3412');
    etGrad.addColorStop(1, '#431407');

    ctx.fillStyle = etGrad;
    ctx.strokeStyle = '#431407';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, -156);
    ctx.quadraticCurveTo(23, -124, 24, -76);
    ctx.lineTo(24, 92);
    ctx.quadraticCurveTo(24, 114, 0, 118);
    ctx.quadraticCurveTo(-24, 114, -24, 92);
    ctx.lineTo(-24, -76);
    ctx.quadraticCurveTo(-23, -124, 0, -156);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Ribbed intertank collar band
    ctx.fillStyle = '#a16207';
    ctx.fillRect(-23.5, -72, 47, 22);
    ctx.strokeStyle = 'rgba(67, 20, 7, 0.55)';
    ctx.lineWidth = 1;
    for (let rx = -20; rx <= 20; rx += 4) {
      ctx.beginPath();
      ctx.moveTo(rx, -72);
      ctx.lineTo(rx, -50);
      ctx.stroke();
    }

    // Dark vertical external feedline rib & nose spike
    ctx.fillStyle = '#292524';
    ctx.fillRect(3, -142, 3, 210);
    ctx.fillStyle = '#0c0a09';
    ctx.beginPath();
    ctx.moveTo(-3.5, -146);
    ctx.lineTo(0, -162);
    ctx.lineTo(3.5, -146);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // ------------------------------------------------------------
  // 2. TWIN WHITE SOLID ROCKET BOOSTERS (peel outward at srbSep)
  // ------------------------------------------------------------
  if (srbSep < 0.98) {
    [-1, 1].forEach((side) => {
      const srbSpreadX = side * Math.pow(srbSep, 1.15) * 140;
      const srbDropY = Math.pow(srbSep, 1.45) * 290;
      const srbRot = side * srbSep * 0.44;
      const srbAlpha = clamp(1 - Math.max(0, srbSep - 0.68) / 0.3, 0, 1);
      const srbThrust = thrust * clamp(1 - srbSep * 2.1, 0, 1);

      ctx.save();
      ctx.globalAlpha = srbAlpha;
      ctx.translate(side * 37 + srbSpreadX, srbDropY);
      ctx.rotate(srbRot);

      // SRB Plume
      const fl = 0.88 + 0.16 * Math.sin(timeSec * 44 + side);
      drawExhaustPlume(
        ctx,
        0,
        130,
        14,
        165 * Math.pow(srbThrust, 0.85) * fl,
        srbThrust,
        false
      );

      // White segmented booster tube
      const srbGrad = ctx.createLinearGradient(-12, 0, 12, 0);
      srbGrad.addColorStop(0, '#64748b');
      srbGrad.addColorStop(0.28, '#f8fafc');
      srbGrad.addColorStop(0.6, '#e2e8f0');
      srbGrad.addColorStop(1, '#475569');

      ctx.fillStyle = srbGrad;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -116);
      ctx.lineTo(10.5, -82);
      ctx.lineTo(10.5, 114);
      ctx.lineTo(14.5, 130);
      ctx.lineTo(-14.5, 130);
      ctx.lineTo(-10.5, 114);
      ctx.lineTo(-10.5, -82);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Characteristic black NASA SRB structural bands & nose cap ports
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-10.5, -82, 21, 5);
      ctx.fillRect(-10.5, -36, 21, 3);
      ctx.fillRect(-10.5, 12, 21, 3);
      ctx.fillRect(-10.5, 62, 21, 3);
      ctx.fillRect(-12, 112, 24, 4);
      // Small black RCS dots near cone tip
      ctx.fillRect(-4, -97, 2.5, 2.5);
      ctx.fillRect(1.5, -97, 2.5, 2.5);

      ctx.restore();
    });
  }

  // Separation flash burst when SRBs or ET detach
  if ((srbSep > 0.01 && srbSep < 0.16) || (etSep > 0.01 && etSep < 0.16)) {
    const flash = ctx.createRadialGradient(0, -25, 2, 0, -25, 72);
    flash.addColorStop(0, 'rgba(255, 255, 255, 0.72)');
    flash.addColorStop(0.35, 'rgba(253, 224, 71, 0.4)');
    flash.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = flash;
    ctx.beginPath();
    ctx.arc(0, -25, 72, 0, Math.PI * 2);
    ctx.fill();
  }

  // ------------------------------------------------------------
  // 3. SPACE SHUTTLE ORBITER ("AEROSHIP") — CENTERED HERO
  // ------------------------------------------------------------
  // Three Main Engine (SSME) Exhaust Plumes + Sparks
  const ssmeThrust = clamp(thrust, 0, 1);
  if (ssmeThrust > 0.01) {
    const fl1 = 0.9 + 0.14 * Math.sin(timeSec * 48);
    drawExhaustPlume(ctx, -8, 122, 9, 130 * ssmeThrust * fl1, ssmeThrust, true);
    drawExhaustPlume(ctx, 8, 122, 9, 130 * ssmeThrust * fl1, ssmeThrust, true);
    drawExhaustPlume(ctx, 0, 116, 10, 145 * ssmeThrust * fl1, ssmeThrust, true);
  }

  sparks.forEach((sp) => {
    const a = clamp(sp.life / sp.maxLife, 0, 1);
    ctx.fillStyle = sp.hue;
    ctx.globalAlpha = a * 0.85;
    ctx.beginPath();
    ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // Wide Swept Double-Delta Wings
  const wingGrad = ctx.createLinearGradient(-96, 40, 96, 115);
  wingGrad.addColorStop(0, '#cbd5e1');
  wingGrad.addColorStop(0.5, '#f8fafc');
  wingGrad.addColorStop(1, '#94a3b8');

  ctx.fillStyle = wingGrad;
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -34);
  ctx.lineTo(-22, -6);
  ctx.lineTo(-42, 42);
  ctx.lineTo(-96, 94);
  ctx.lineTo(-96, 112);
  ctx.lineTo(-22, 116);
  ctx.lineTo(22, 116);
  ctx.lineTo(96, 112);
  ctx.lineTo(96, 94);
  ctx.lineTo(42, 42);
  ctx.lineTo(22, -6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Black Thermal Protection Wing Leading Edge + Elevon Trim (matching Shuttle photo)
  ctx.strokeStyle = '#090d14';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-22, -6);
  ctx.lineTo(-42, 42);
  ctx.lineTo(-96, 94);
  ctx.moveTo(22, -6);
  ctx.lineTo(42, 42);
  ctx.lineTo(96, 94);
  ctx.stroke();

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-93, 106, 68, 6);
  ctx.fillRect(25, 106, 68, 6);

  // Subtle warm beige/slate heat-shield panel tint inside delta wings (from photo)
  ctx.fillStyle = 'rgba(180, 155, 138, 0.25)';
  ctx.beginPath();
  ctx.moveTo(-36, 70);
  ctx.lineTo(-78, 96);
  ctx.lineTo(-28, 102);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(36, 70);
  ctx.lineTo(78, 96);
  ctx.lineTo(28, 102);
  ctx.closePath();
  ctx.fill();

  // Twin Rear OMS Engine Pods
  ctx.fillStyle = '#e2e8f0';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.roundRect(-27, 84, 15, 32, 6);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(12, 84, 15, 32, 6);
  ctx.fill();
  ctx.stroke();

  // Dark SSME Main Engine Bells
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-13, 114, 26, 8);

  // Pearl-White Main Orbiter Fuselage
  const orbGrad = ctx.createLinearGradient(-20, 0, 20, 0);
  orbGrad.addColorStop(0, '#94a3b8');
  orbGrad.addColorStop(0.28, '#ffffff');
  orbGrad.addColorStop(0.7, '#f1f5f9');
  orbGrad.addColorStop(1, '#64748b');

  ctx.fillStyle = orbGrad;
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(0, -90);
  ctx.quadraticCurveTo(16, -68, 18, -30);
  ctx.lineTo(19, 108);
  ctx.lineTo(-19, 108);
  ctx.lineTo(-18, -30);
  ctx.quadraticCurveTo(-16, -68, 0, -90);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Payload Bay Doors seam line & ribs
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.45)';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(0, 86);
  ctx.moveTo(-14, -18);
  ctx.lineTo(14, -18);
  ctx.moveTo(-14, 16);
  ctx.lineTo(14, 16);
  ctx.moveTo(-14, 52);
  ctx.lineTo(14, 52);
  ctx.stroke();

  // Vertical Center Tail Stabilizer Fin
  ctx.fillStyle = '#f1f5f9';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 68);
  ctx.lineTo(3, 128);
  ctx.lineTo(-3, 128);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Black RCC Nose Cap & Tiny Forward RCS Ports
  ctx.fillStyle = '#090d14';
  ctx.beginPath();
  ctx.moveTo(0, -90);
  ctx.quadraticCurveTo(8, -80, 9, -72);
  ctx.quadraticCurveTo(0, -75, -9, -72);
  ctx.quadraticCurveTo(-8, -80, 0, -90);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#1e293b';
  [-4, 0, 4].forEach((rx) => {
    ctx.beginPath();
    ctx.arc(rx, -68, 1.3, 0, Math.PI * 2);
    ctx.fill();
  });

  // Prominent Curved 6-Pane Space Shuttle Cockpit Windshield + 2 Forward Windows!
  ctx.save();
  // Interior starlit HUD glow peeking through glass as camera zooms in
  const windowGlow = clamp(winZoom * 1.4, 0, 1);

  const paneColor = windowGlow > 0.15 ? '#06182c' : '#090d14';
  ctx.fillStyle = paneColor;
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 0.8;

  // Center Twin Trapezoid Windshields
  ctx.beginPath();
  ctx.moveTo(-1, -55);
  ctx.lineTo(-6.5, -53);
  ctx.lineTo(-7.5, -45);
  ctx.lineTo(-1, -46.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(1, -55);
  ctx.lineTo(6.5, -53);
  ctx.lineTo(7.5, -45);
  ctx.lineTo(1, -46.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Left & Right Wrap-Around Side Windows
  ctx.beginPath();
  ctx.moveTo(-8, -52);
  ctx.lineTo(-13.5, -47);
  ctx.lineTo(-13.5, -41);
  ctx.lineTo(-8.5, -44.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(8, -52);
  ctx.lineTo(13.5, -47);
  ctx.lineTo(13.5, -41);
  ctx.lineTo(8.5, -44.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Subtle cyan cockpit console reflection inside windshield when zooming in
  if (windowGlow > 0.08) {
    ctx.strokeStyle = `rgba(56, 189, 248, ${0.75 * windowGlow})`;
    ctx.lineWidth = 0.65;
    ctx.beginPath();
    ctx.moveTo(-5, -49);
    ctx.lineTo(5, -49);
    ctx.stroke();
  }

  // Two small lower nose ports
  ctx.fillStyle = '#090d14';
  ctx.fillRect(-5, -39, 3.2, 2.5);
  ctx.fillRect(1.8, -39, 3.2, 2.5);
  ctx.restore();

  ctx.restore();

  // Smooth dark vignette transition cleanly into cockpit interior right at peak zoom
  if (winZoom > 0.68) {
    const fade = clamp((winZoom - 0.68) / 0.31, 0, 1);
    ctx.fillStyle = `rgba(3, 9, 22, ${fade * 0.94})`;
    ctx.fillRect(0, 0, centerX * 2, centerY * 2);
  }
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  hasSavedGame,
  reduceMotion = false,
  onStart,
  onContinue,
  onOpenSettings
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroTitleRef = useRef<HTMLDivElement | null>(null);
  const scrollPromptRef = useRef<HTMLButtonElement | null>(null);
  const hudStatusRef = useRef<HTMLSpanElement | null>(null);

  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const ignitionFiredRef = useRef(false);
  const sepSfxFiredRef = useRef(false);
  const doneRef = useRef(false);
  const autoLaunchRef = useRef(false);

  const [isAutoLaunching, setIsAutoLaunching] = useState(false);

  const completeLaunch = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onStart();
  }, [onStart]);

  const handleResumeShortcut = useCallback(() => {
    if (!hasSavedGame) return;
    playClickSfx('launch');
    onContinue();
  }, [hasSavedGame, onContinue]);

  const triggerAutoLaunch = useCallback(() => {
    if (autoLaunchRef.current || doneRef.current) return;
    if (!ignitionFiredRef.current) {
      ignitionFiredRef.current = true;
      playClickSfx('launch');
    }
    if (reduceMotion) {
      completeLaunch();
      return;
    }
    autoLaunchRef.current = true;
    setIsAutoLaunching(true);
    const scroller = scrollContainerRef.current;
    if (scroller) {
      const maxScroll = Math.max(1, scroller.scrollHeight - scroller.clientHeight);
      scroller.scrollTo({ top: maxScroll, behavior: 'smooth' });
    }
  }, [reduceMotion, completeLaunch]);

  // Listen to native container scrolling (mouse wheel, trackpad, touch drag, scrollbar)
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el || doneRef.current) return;
    const maxScroll = Math.max(1, el.scrollHeight - el.clientHeight);
    const ratio = clamp(el.scrollTop / maxScroll, 0, 1);
    targetProgressRef.current = ratio;

    if (ratio >= 0.05 && !ignitionFiredRef.current) {
      ignitionFiredRef.current = true;
      playClickSfx('launch');
    }

    if (ratio >= 0.44 && !sepSfxFiredRef.current) {
      sepSfxFiredRef.current = true;
      playClickSfx('next');
    }

    // Once user scrolls past external tank ejection, complete window zoom cleanly into cockpit
    if (ratio >= 0.74 && !autoLaunchRef.current) {
      triggerAutoLaunch();
    }
  }, [triggerAutoLaunch]);

  // Keyboard scroll / launch shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (doneRef.current) return;
      const target = e.target as HTMLElement | null;
      if (target && target.closest('button, a, input, [role="dialog"]')) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.code === 'Space') {
        const scroller = scrollContainerRef.current;
        if (!scroller) return;
        e.preventDefault();
        scroller.scrollBy({
          top: window.innerHeight * 0.45,
          behavior: reduceMotion ? 'auto' : 'smooth'
        });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [reduceMotion]);

  // Reset progress cleanly if mounted again
  useEffect(() => {
    doneRef.current = false;
    autoLaunchRef.current = false;
    ignitionFiredRef.current = false;
    sepSfxFiredRef.current = false;
    targetProgressRef.current = 0;
    smoothProgressRef.current = 0;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, []);

  // High-FPS Black Sky + Space Shuttle Stack + Booster/Tank Ejection + Window Zoom animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const stars = createStarfield();
    const sparks: ExhaustSpark[] = [];
    const mountTime = performance.now();
    let lastTime = mountTime;
    let rafId = 0;

    const drawFrame = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      const elapsedSec = (now - mountTime) / 1000;

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

      if (autoLaunchRef.current) {
        targetProgressRef.current = Math.min(1, targetProgressRef.current + dt * 0.36);
        smoothProgressRef.current +=
          (targetProgressRef.current - smoothProgressRef.current) * 0.14;
        if (smoothProgressRef.current >= 0.985 && !doneRef.current) {
          completeLaunch();
          return;
        }
      } else {
        const easeFactor = reduceMotion ? 1 : 0.15;
        smoothProgressRef.current +=
          (targetProgressRef.current - smoothProgressRef.current) * easeFactor;
      }

      const p = smoothProgressRef.current;
      const thrust = p <= 0.01 ? 0 : clamp(p * 1.65, 0, 1);

      // Update transparent COSMIC SAGA wordmark zoom & fade without React re-renders
      if (heroTitleRef.current) {
        const scale = 1 + Math.pow(p, 1.15) * 4.0;
        const opacity = p < 0.38 ? 1 : clamp(1 - (p - 0.38) / 0.24, 0, 1);
        heroTitleRef.current.style.transform = `translate3d(-50%, -50%, 0) scale(${scale.toFixed(
          4
        )})`;
        heroTitleRef.current.style.opacity = opacity.toFixed(3);
      }

      if (scrollPromptRef.current) {
        const cueOpacity = p < 0.04 ? 1 : clamp(1 - (p - 0.04) / 0.18, 0, 1);
        scrollPromptRef.current.style.opacity = cueOpacity.toFixed(3);
        scrollPromptRef.current.style.pointerEvents =
          cueOpacity > 0.15 ? 'auto' : 'none';
      }

      if (hudStatusRef.current) {
        if (p < 0.02) {
          hudStatusRef.current.textContent = 'SHUTTLE STACK ARMED // READY';
        } else if (p < 0.28) {
          hudStatusRef.current.textContent = `SRB & SSME IGNITION // THRUST ${Math.round(
            thrust * 100
          )}%`;
        } else if (p < 0.44) {
          hudStatusRef.current.textContent = 'BOOSTER SEPARATION // SRBS EJECTED';
        } else if (p < 0.66) {
          hudStatusRef.current.textContent = 'MECO // EXTERNAL TANK EJECTED';
        } else {
          hudStatusRef.current.textContent = 'APPROACHING AEROSHIP COCKPIT WINDOW...';
        }
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. PURE BLACK DEEP SKY
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, cw, ch);

      // 2. Twinkling & Warp-Streaking Starfield
      const starScrollSpeed = reduceMotion ? 0 : Math.pow(p, 1.4) * ch * 2.1;
      stars.forEach((star) => {
        const sx = star.nx * cw;
        const sy =
          ((star.ny * ch + starScrollSpeed * (0.4 + star.r * 0.3)) % ch + ch) % ch;
        const tw = reduceMotion
          ? 1
          : 0.55 + 0.45 * Math.sin(elapsedSec * star.twinkleSpeed + star.twinkleOffset);
        ctx.fillStyle = star.color;
        ctx.strokeStyle = star.color;
        ctx.globalAlpha = clamp(star.alpha * tw, 0.15, 1);

        if (thrust > 0.25 && !reduceMotion) {
          const streakLen = star.r * (2 + thrust * 22);
          ctx.lineWidth = star.r * 0.9;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx, sy + streakLen);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(sx, sy, star.r, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;

      // 3. Exhaust sparks beneath main engines
      if (thrust > 0.05 && p < 0.72 && !reduceMotion) {
        const spawnCount = Math.ceil(thrust * 4);
        for (let i = 0; i < spawnCount; i++) {
          const nOff = [-8, 0, 8][Math.floor(Math.random() * 3)];
          sparks.push({
            x: nOff + (Math.random() - 0.5) * 14,
            y: 124 + Math.random() * 12,
            vx: (Math.random() - 0.5) * 34,
            vy: 140 + Math.random() * 210 * thrust,
            life: 0.4 + Math.random() * 0.4,
            maxLife: 0.8,
            size: 1.2 + Math.random() * 2,
            hue: Math.random() > 0.45 ? '#fde047' : '#7dd3fc'
          });
        }
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        sp.life -= dt;
        if (sp.life <= 0) sparks.splice(i, 1);
      }

      // 4. Centerpiece Space Shuttle Stack with SRB/ET ejection & window zoom transition
      const unitScale = clamp(Math.min(cw, ch) / 520, 0.72, 1.38);
      drawSpaceShuttleStack(
        ctx,
        cw * 0.5,
        ch * 0.49,
        unitScale,
        p,
        elapsedSec,
        sparks
      );

      ctx.restore();
      rafId = requestAnimationFrame(drawFrame);
    };

    rafId = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(rafId);
  }, [reduceMotion, completeLaunch]);

  const handleToggleFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    } catch {
      // Ignore fullscreen denial
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className="modern-launch-scroll-viewport"
      onScroll={handleScroll}
      role="main"
      aria-label="Cosmic Saga Scroll to Launch Experience"
    >
      <div className="modern-launch-scroll-track">
        <div className="modern-launch-sticky-stage">
          <canvas
            ref={canvasRef}
            className="modern-launch-canvas"
            aria-hidden="true"
          />

          <div className="modern-launch-frame" aria-hidden="true" />

          <header className="modern-launch-topbar">
            <PageNavBar
              backDisabled={true}
              backTitle="Already on opening launch screen"
              onNext={() => {
                if (isAutoLaunching) {
                  completeLaunch();
                } else {
                  triggerAutoLaunch();
                }
              }}
              nextLabel={isAutoLaunching ? 'Next (Enter Console) ▶' : 'Next ▶'}
              nextTitle={
                isAutoLaunching
                  ? 'Skip liftoff straight to navigation console'
                  : 'Launch into navigation console'
              }
            />

            <div className="modern-topbar-right">
              {hasSavedGame && (
                <button
                  type="button"
                  className="modern-utility-pill primary"
                  onClick={handleResumeShortcut}
                >
                  ▶ Resume Saved
                </button>
              )}

              <button
                type="button"
                className="modern-utility-pill"
                onClick={onOpenSettings}
                aria-label="Open Settings"
              >
                ⚙ Settings
              </button>

              <div className="modern-window-chrome" role="group" aria-label="Window controls">
                <button
                  type="button"
                  className="win-chrome-btn"
                  title="Settings"
                  aria-label="Minimize / Settings"
                  onClick={onOpenSettings}
                >
                  −
                </button>
                <button
                  type="button"
                  className="win-chrome-btn"
                  title="Toggle Fullscreen"
                  aria-label="Toggle Fullscreen"
                  onClick={handleToggleFullscreen}
                >
                  □
                </button>
                <button
                  type="button"
                  className="win-chrome-btn close"
                  title="Reset Scroll"
                  aria-label="Reset scroll position"
                  onClick={() => {
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          </header>

          {/* Transparent Outlined COSMIC SAGA Cyberpunk Display Wordmark */}
          <div
            ref={heroTitleRef}
            className="modern-cosmic-hero-title"
          >
            <CosmicSagaWordmark />
          </div>

          <button
            ref={scrollPromptRef}
            type="button"
            className="modern-scroll-cue"
            onClick={triggerAutoLaunch}
            aria-label="Scroll down or click to launch shuttle"
          >
            <span className="modern-scroll-chevron" aria-hidden="true">^</span>
            <span className="modern-scroll-label">Scroll to Launch</span>
          </button>

          <div className="modern-launch-status-bar">
            <span ref={hudStatusRef} className="modern-hud-status">
              SHUTTLE STACK ARMED // READY
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
