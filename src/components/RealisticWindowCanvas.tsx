import React, { useEffect, useRef } from 'react';
import {
  BgStar,
  drawSurfaceBackdrop,
  onMarsSurfaceLoaded,
  onMoonSurfaceLoaded
} from './surface2dArt';

export type TravelPhase =
  | 'idle'
  | 'hyperspace'
  | 'earth_approach'
  | 'orbiting'
  | 'turbulence'
  | 'blackout'
  | 'surface_reveal'
  | 'surface_static';
export type TravelDestination = 'moon' | 'mars' | 'deep_space';
export type DeepSpaceProbeId = 'pioneer' | 'voyager' | null;

interface RealisticWindowCanvasProps {
  travelPhase: TravelPhase;
  travelDestination: TravelDestination | null;
  deepSpaceProbe?: DeepSpaceProbeId;
  earthProgress?: number;
  subtleHyperspace?: boolean;
}

interface StarParticle {
  x: number;
  y: number;
  z: number;
  speed: number;
  thickness: number;
  brightness: number;
}

interface VectorPatch {
  lon: number;
  lat: number;
  rx: number;
  ry: number;
  rot: number;
  kind: 'mare' | 'plateau' | 'continent' | 'cloud';
  color: string;
  shadeColor?: string;
}

interface VectorCrater {
  lon: number;
  lat: number;
  radius: number;
  kind: 'crater' | 'volcano';
  hasRays?: boolean;
  hasPeak?: boolean;
}

interface VectorFracture {
  lon: number;
  lat: number;
  len: number;
  bend: number;
  angle: number;
}

interface Planet2DScene {
  patches: VectorPatch[];
  craters: VectorCrater[];
  fractures: VectorFracture[];
}

const sceneCache = new Map<TravelDestination, Planet2DScene>();

function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function getPlanet2DScene(destination: TravelDestination): Planet2DScene {
  const cached = sceneCache.get(destination);
  if (cached) return cached;

  const rng = seededRandom(
    destination === 'moon' ? 2027 : destination === 'mars' ? 5099 : 8171
  );
  const patches: VectorPatch[] = [];
  const craters: VectorCrater[] = [];
  const fractures: VectorFracture[] = [];

  if (destination === 'moon') {
    // Large dark basalt Maria seas wrapped evenly across 360 deg longitude
    for (let i = 0; i < 12; i++) {
      patches.push({
        lon: (i / 12) * Math.PI * 2 + (rng() - 0.5) * 0.4,
        lat: (rng() - 0.5) * 1.15,
        rx: 0.14 + rng() * 0.16,
        ry: 0.09 + rng() * 0.11,
        rot: (rng() - 0.5) * 1.2,
        kind: 'mare',
        color: i % 2 === 0 ? '#788294' : '#6b7587',
        shadeColor: '#5c6677'
      });
    }

    // Hero, medium, and micro detailed 2D impact craters
    for (let i = 0; i < 58; i++) {
      const tier = i < 9 ? 'hero' : i < 28 ? 'med' : 'small';
      const radius =
        tier === 'hero'
          ? 0.07 + rng() * 0.045
          : tier === 'med'
            ? 0.032 + rng() * 0.032
            : 0.012 + rng() * 0.018;
      craters.push({
        lon: (i / 58) * Math.PI * 2 + (rng() - 0.5) * 0.35,
        lat: (rng() - 0.5) * 1.38,
        radius,
        kind: 'crater',
        hasRays: tier === 'hero' && i < 4,
        hasPeak: tier === 'hero'
      });
    }

    // Crisp 2D lunar rilles / surface hairline fractures
    for (let i = 0; i < 18; i++) {
      fractures.push({
        lon: rng() * Math.PI * 2,
        lat: (rng() - 0.5) * 1.25,
        len: 0.08 + rng() * 0.12,
        bend: (rng() - 0.5) * 0.05,
        angle: (rng() - 0.5) * 2.2
      });
    }
  } else if (destination === 'mars') {
    // Dark basalt plateaus & bright dust plains
    for (let i = 0; i < 14; i++) {
      patches.push({
        lon: (i / 14) * Math.PI * 2 + (rng() - 0.5) * 0.4,
        lat: (rng() - 0.5) * 1.15,
        rx: 0.14 + rng() * 0.18,
        ry: 0.08 + rng() * 0.09,
        rot: (rng() - 0.5) * 0.8,
        kind: 'plateau',
        color: i % 3 === 0 ? '#eb8b54' : '#aa3e20',
        shadeColor: i % 3 === 0 ? '#dc713d' : '#852b14'
      });
    }

    // Shield volcanoes + crisp 2D Martian craters
    for (let i = 0; i < 34; i++) {
      craters.push({
        lon: (i / 34) * Math.PI * 2 + (rng() - 0.5) * 0.4,
        lat: (rng() - 0.5) * 1.32,
        radius: i < 5 ? 0.058 + rng() * 0.03 : 0.018 + rng() * 0.028,
        kind: i < 5 ? 'volcano' : 'crater'
      });
    }

    // Valles Marineris canyon segments & dust ridges
    for (let i = 0; i < 16; i++) {
      fractures.push({
        lon: i < 6 ? 1.1 + i * 0.14 : rng() * Math.PI * 2,
        lat: i < 6 ? -0.05 + Math.sin(i * 0.8) * 0.06 : (rng() - 0.5) * 1.1,
        len: i < 6 ? 0.14 : 0.07 + rng() * 0.09,
        bend: (rng() - 0.5) * 0.04,
        angle: i < 6 ? -0.15 + (rng() - 0.5) * 0.2 : (rng() - 0.5) * 1.5
      });
    }

    // Wispy high-altitude 2D Martian clouds
    for (let i = 0; i < 10; i++) {
      patches.push({
        lon: rng() * Math.PI * 2,
        lat: (rng() - 0.5) * 1.2,
        rx: 0.1 + rng() * 0.12,
        ry: 0.022 + rng() * 0.018,
        rot: -0.12,
        kind: 'cloud',
        color: 'rgba(255, 236, 222, 0.36)'
      });
    }
  } else {
    // Deep Space: Crisp 2D illustrated ocean-emerald world with swirling cloud ribbons
    for (let i = 0; i < 12; i++) {
      patches.push({
        lon: (i / 12) * Math.PI * 2 + (rng() - 0.5) * 0.4,
        lat: (rng() - 0.5) * 1.12,
        rx: 0.16 + rng() * 0.17,
        ry: 0.1 + rng() * 0.11,
        rot: (rng() - 0.5) * 0.9,
        kind: 'continent',
        color: i % 3 === 0 ? '#c4a66a' : '#3d9968',
        shadeColor: i % 3 === 0 ? '#9c7f49' : '#2a754d'
      });
    }

    for (let i = 0; i < 18; i++) {
      patches.push({
        lon: rng() * Math.PI * 2,
        lat: (rng() - 0.5) * 1.28,
        rx: 0.14 + rng() * 0.16,
        ry: 0.024 + rng() * 0.022,
        rot: -0.08,
        kind: 'cloud',
        color: 'rgba(248, 252, 255, 0.72)'
      });
    }
  }

  const scene = { patches, craters, fractures };
  sceneCache.set(destination, scene);
  return scene;
}

/** Project (lon, lat) onto tilted 2D sphere canvas coordinates. Returns null if on back hemisphere. */
function projectOnSphere(
  lon: number,
  lat: number,
  spinAngle: number,
  cx: number,
  cy: number,
  R: number,
  tilt: number
): { x: number; y: number; foreshorten: number; depth: number } | null {
  const twoPi = Math.PI * 2;
  let a = (lon + spinAngle) % twoPi;
  if (a > Math.PI) a -= twoPi;
  if (a < -Math.PI) a += twoPi;

  const cosLat = Math.cos(lat);
  const sinLat = Math.sin(lat);
  const cosLon = Math.cos(a);
  const sinLon = Math.sin(a);

  const sx = sinLon * cosLat;
  const sy0 = sinLat;
  const sz0 = cosLon * cosLat;

  const cosT = Math.cos(tilt);
  const sinT = Math.sin(tilt);
  const sy = sy0 * cosT - sz0 * sinT;
  const sz = sy0 * sinT + sz0 * cosT;

  if (sz < -0.14) return null;

  return {
    x: cx + sx * R,
    y: cy + sy * R,
    foreshorten: clamp(sz, 0.14, 1.0),
    depth: sz
  };
}

export const RealisticWindowCanvas: React.FC<RealisticWindowCanvasProps> = ({
  travelPhase,
  travelDestination,
  deepSpaceProbe = null,
  earthProgress = 0,
  subtleHyperspace = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const phaseRef = useRef<TravelPhase>(travelPhase);
  const destRef = useRef<TravelDestination | null>(travelDestination);
  const probeRef = useRef<DeepSpaceProbeId>(deepSpaceProbe);
  const earthProgressRef = useRef<number>(earthProgress);
  earthProgressRef.current = earthProgress;
  const subtleHyperspaceRef = useRef<boolean>(subtleHyperspace);
  subtleHyperspaceRef.current = subtleHyperspace;
  const phaseStartRef = useRef<number>(performance.now());
  const orbitStartRef = useRef<number>(performance.now());
  const redrawStaticRef = useRef<(() => void) | null>(null);
  const isActive = travelPhase !== 'idle';

  useEffect(() => {
    const now = performance.now();
    if (
      phaseRef.current !== travelPhase ||
      destRef.current !== travelDestination ||
      probeRef.current !== deepSpaceProbe
    ) {
      if (travelPhase === 'orbiting') {
        orbitStartRef.current = now;
      }
      phaseRef.current = travelPhase;
      destRef.current = travelDestination;
      probeRef.current = deepSpaceProbe;
      phaseStartRef.current = now;
    }

    if (travelPhase === 'hyperspace' && travelDestination) {
      getPlanet2DScene(travelDestination);
    }
    if (travelPhase !== 'idle') {
      redrawStaticRef.current?.();
    }
  }, [travelPhase, travelDestination, deepSpaceProbe]);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Seed pure B&W 2D star particles used for slow acceleration -> hyper travel -> brake
    const rng = seededRandom(9421);
    const warpStars: StarParticle[] = [];
    for (let i = 0; i < 420; i++) {
      const z = 0.04 + rng() * 0.96;
      const angle = rng() * Math.PI * 2;
      const radial = 0.04 + Math.pow(rng(), 0.72) * 1.18;
      warpStars.push({
        x: Math.cos(angle) * radial,
        y: Math.sin(angle) * radial * 0.64,
        z,
        speed: 0.72 + rng() * 1.35,
        thickness: 0.75 + rng() * 1.85,
        brightness: 0.55 + rng() * 0.45
      });
    }

    // Crisp orbital starfield on the dark space side
    const bgStars: BgStar[] = [];
    const starColors = ['#ffffff', '#dbeafe', '#fef3c7', '#e0e7ff', '#e2e8f0'];
    for (let i = 0; i < 220; i++) {
      bgStars.push({
        nx: rng(),
        ny: rng(),
        r: 0.5 + Math.pow(rng(), 3) * 1.85,
        alpha: 0.35 + rng() * 0.65,
        twinkleSpeed: 1.1 + rng() * 2.2,
        twinkleOffset: rng() * Math.PI * 2,
        color: starColors[i % starColors.length]
      });
    }

    let rafId = 0;
    let lastTime = performance.now();

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
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const { w, h, dpr } = syncSize();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const svgScale = Math.max(w / 1200, h / 700);
      const svgOffX = (w - 1200 * svgScale) * 0.5;
      const svgOffY = (h - 700 * svgScale) * 0.5;

      const winCx = svgOffX + 600 * svgScale;
      const winCy = svgOffY + 252 * svgScale;

      const elapsed = (now - phaseStartRef.current) / 1000;
      const activePhase = phaseRef.current;
      const dest: TravelDestination = destRef.current ?? 'moon';

      // Pure ink-black 2D space backdrop
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      if (activePhase === 'hyperspace') {
        // ============================================================
        // 2D PURE BLACK & WHITE HYPER TRAVEL + RELATIVE PERSPECTIVE SHRINK
        // ============================================================
        const subtle = subtleHyperspaceRef.current;
        const rayAlphaScale = subtle ? 0.28 : 1;
        const rayWidthScale = subtle ? 0.45 : 1;
        const accelT = clamp(elapsed / 1.85, 0, 1);
        const warpFactor = Math.pow(accelT, 2.4);
        const speedMult = 0.04 + warpFactor * 2.85;

        const shrinkFactor = 1.0 - 0.34 * warpFactor;
        const focal = 350 * svgScale * shrinkFactor;

        const shakeAmp = subtle ? 0 : Math.max(0, warpFactor - 0.25) * 1.9 * svgScale;
        const cx = winCx + Math.sin(elapsed * 52) * shakeAmp;
        const cy = winCy + Math.cos(elapsed * 61) * shakeAmp * 0.75;

        if (warpFactor > 0.08) {
          const ringCount = 5;
          for (let rIdx = 0; rIdx < ringCount; rIdx++) {
            const p = (elapsed * (0.45 + warpFactor * 1.35) + rIdx / ringCount) % 1;
            const invP = 1 - p;
            const ringScale = Math.pow(invP, 1.55);
            const rx = 560 * svgScale * ringScale;
            const ry = 250 * svgScale * ringScale;
            const ringAlpha = Math.sin(p * Math.PI) * 0.22 * warpFactor * rayAlphaScale;

            ctx.strokeStyle = `rgba(255, 255, 255, ${ringAlpha})`;
            ctx.lineWidth = Math.max(0.5, 1.8 * ringScale * svgScale * rayWidthScale);
            ctx.setLineDash([12 * svgScale * ringScale, 18 * svgScale * ringScale]);
            ctx.beginPath();
            ctx.ellipse(cx, cy, Math.max(4, rx), Math.max(2, ry), 0, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.setLineDash([]);
        }

        for (let i = 0; i < warpStars.length; i++) {
          const st = warpStars[i];
          st.z -= dt * st.speed * speedMult;
          if (st.z <= 0.025) {
            st.z = 0.92 + Math.random() * 0.08;
          }

          const sx = cx + (st.x / st.z) * focal;
          const sy = cy + (st.y / st.z) * focal;

          const tailOffset = 0.008 + warpFactor * 0.34 * st.speed;
          const tailZ = Math.min(1.0, st.z + tailOffset);
          const px = cx + (st.x / tailZ) * focal;
          const py = cy + (st.y / tailZ) * focal;

          const depthNorm = clamp(1 - st.z, 0, 1);
          const alpha = clamp((0.28 + depthNorm * 0.72) * st.brightness * rayAlphaScale, 0, 1);

          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth =
            (0.65 + depthNorm * st.thickness * (0.45 + warpFactor * 1.25)) * svgScale * rayWidthScale;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(sx, sy);
          ctx.stroke();

          if (warpFactor < 0.35) {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(
              sx,
              sy,
              Math.max(0.55, (0.8 + depthNorm * 0.9) * svgScale * rayWidthScale),
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
        }

        if (warpFactor > 0.32) {
          const edgeAlpha = clamp((warpFactor - 0.32) / 0.68, 0, 1);
          const spikeCount = 28;
          for (let k = 0; k < spikeCount; k++) {
            const ang =
              (k / spikeCount) * Math.PI * 2 +
              Math.sin(Math.floor(elapsed * 24) + k * 7.3) * 0.04;
            const pulse = (elapsed * 3.8 + k * 0.37) % 1;
            const rOuter = (540 - pulse * 80) * svgScale;
            const rInner = rOuter - (95 + warpFactor * 135) * svgScale;

            ctx.strokeStyle = `rgba(255, 255, 255, ${0.42 * edgeAlpha * (1 - pulse * 0.6) * rayAlphaScale})`;
            ctx.lineWidth = (1.1 + (k % 3) * 0.65) * svgScale * rayWidthScale;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(ang) * rInner, cy + Math.sin(ang) * rInner * 0.56);
            ctx.lineTo(cx + Math.cos(ang) * rOuter, cy + Math.sin(ang) * rOuter * 0.56);
            ctx.stroke();
          }
        }

        const coreSize = (4 + (1 - warpFactor) * 3) * svgScale * (subtle ? 0.6 : 1);
        ctx.fillStyle = `rgba(255, 255, 255, ${(0.15 + warpFactor * 0.55) * rayAlphaScale})`;
        ctx.beginPath();
        ctx.arc(cx, cy, coreSize, 0, Math.PI * 2);
        ctx.fill();
      } else if (activePhase === 'earth_approach') {
        // ============================================================
        // HOMEWARD DECELERATION & EARTH APPROACH (NO ALIENS / NO ASTEROIDS)
        // Thrusters & hyperdrive shut off; star speed slows to calm drift while
        // Earth swells smoothly from a tiny blue-grey dot into a glowing blue globe.
        // ============================================================
        const ep = clamp(earthProgressRef.current, 0, 1);
        const slowFactor = Math.max(0.03, 0.35 * (1 - clamp(elapsed / 2.6, 0, 1)));
        const focal = 350 * svgScale;

        for (let i = 0; i < warpStars.length; i++) {
          const st = warpStars[i];
          st.z -= dt * st.speed * slowFactor;
          if (st.z <= 0.03) st.z = 0.96;
          const sx = winCx + (st.x / st.z) * focal;
          const sy = winCy + (st.y / st.z) * focal;
          const depthNorm = clamp(1 - st.z, 0, 1);
          const alpha = clamp((0.3 + depthNorm * 0.65) * st.brightness, 0, 1);
          ctx.fillStyle = `rgba(232, 244, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(sx, sy, Math.max(0.65, (0.7 + depthNorm * 1.1) * svgScale), 0, Math.PI * 2);
          ctx.fill();
        }

        // Earth grows continuously from a tiny blue-grey dot (ep=0) to a large luminous planet (ep=1)
        const curvedEp = Math.pow(ep, 1.45);
        const earthR = (2.4 + curvedEp * 174) * svgScale;
        const earthCx = winCx + (1 - ep) * 14 * svgScale;
        const earthCy = winCy - (16 - curvedEp * 12) * svgScale;

        // Atmospheric blue-grey / cyan outer limb halo
        const halo = ctx.createRadialGradient(
          earthCx,
          earthCy,
          earthR * 0.72,
          earthCx,
          earthCy,
          earthR * 1.55
        );
        halo.addColorStop(0, `rgba(100, 165, 235, ${0.18 + ep * 0.24})`);
        halo.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(earthCx, earthCy, earthR * 1.55, 0, Math.PI * 2);
        ctx.fill();

        // Main planet disc transitioning from dusty blue-grey dot to rich ocean-blue Earth
        const globeGrad = ctx.createRadialGradient(
          earthCx - earthR * 0.32,
          earthCy - earthR * 0.34,
          earthR * 0.1,
          earthCx,
          earthCy,
          earthR
        );
        const rTop = Math.round(lerp(136, 72, ep));
        const gTop = Math.round(lerp(154, 182, ep));
        const bTop = Math.round(lerp(174, 255, ep));
        const rMid = Math.round(lerp(92, 22, ep));
        const gMid = Math.round(lerp(116, 98, ep));
        const bMid = Math.round(lerp(144, 212, ep));
        globeGrad.addColorStop(0, `rgb(${rTop}, ${gTop}, ${bTop})`);
        globeGrad.addColorStop(0.58, `rgb(${rMid}, ${gMid}, ${bMid})`);
        globeGrad.addColorStop(1, '#05142b');

        ctx.save();
        ctx.beginPath();
        ctx.arc(earthCx, earthCy, earthR, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = globeGrad;
        ctx.fillRect(earthCx - earthR, earthCy - earthR, earthR * 2, earthR * 2);

        // Continents & swirling clouds become clearly resolved as Earth gets closer
        if (earthR > 12 * svgScale) {
          const detailAlpha = clamp((earthR / svgScale - 12) / 55, 0, 1);
          ctx.fillStyle = `rgba(52, 168, 108, ${0.42 * detailAlpha})`;
          ctx.beginPath();
          ctx.ellipse(earthCx - earthR * 0.18, earthCy - earthR * 0.12, earthR * 0.28, earthR * 0.22, -0.35, 0, Math.PI * 2);
          ctx.ellipse(earthCx + earthR * 0.24, earthCy + earthR * 0.08, earthR * 0.22, earthR * 0.26, 0.4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(248, 252, 255, ${0.52 * detailAlpha})`;
          ctx.beginPath();
          ctx.ellipse(earthCx - earthR * 0.08, earthCy - earthR * 0.34, earthR * 0.56, earthR * 0.09, 0.18, 0, Math.PI * 2);
          ctx.ellipse(earthCx + earthR * 0.12, earthCy + earthR * 0.28, earthR * 0.48, earthR * 0.08, -0.15, 0, Math.PI * 2);
          ctx.ellipse(earthCx - earthR * 0.28, earthCy + earthR * 0.04, earthR * 0.34, earthR * 0.07, 0.25, 0, Math.PI * 2);
          ctx.fill();
        }

        // Subtle green-violet auroral shimmer over polar limb near re-entry
        if (ep >= 0.55) {
          const aurAlpha = clamp((ep - 0.55) / 0.45, 0, 1) * 0.45;
          const aurGrad = ctx.createLinearGradient(
            earthCx - earthR,
            earthCy - earthR,
            earthCx + earthR,
            earthCy - earthR * 0.3
          );
          aurGrad.addColorStop(0, `rgba(52, 211, 153, ${aurAlpha})`);
          aurGrad.addColorStop(0.55, `rgba(56, 189, 248, ${aurAlpha * 0.7})`);
          aurGrad.addColorStop(1, `rgba(168, 85, 247, ${aurAlpha})`);
          ctx.strokeStyle = aurGrad;
          ctx.lineWidth = Math.max(2, earthR * 0.08);
          ctx.beginPath();
          ctx.arc(earthCx, earthCy, earthR * 0.94, Math.PI * 1.15, Math.PI * 1.82);
          ctx.stroke();
        }
        ctx.restore();
      } else if (dest === 'deep_space' && activePhase !== 'blackout') {
        // ============================================================
        // DEEP SPACE CRUISE / INTERSTELLAR WINDOW VIEW (NO LANDING!):
        // Stars, subtle distant nebula, and Pioneer / Voyager floating outside!
        // ============================================================
        const deepElapsed =
          activePhase === 'orbiting'
            ? Math.max(0, (now - orbitStartRef.current) / 1000)
            : now / 1000;
        drawDeepSpaceWindowView(
          ctx,
          w,
          h,
          svgOffX,
          svgOffY,
          svgScale,
          deepElapsed,
          bgStars,
          warpStars,
          winCx,
          winCy,
          probeRef.current,
          activePhase === 'orbiting'
        );
      } else if (activePhase === 'orbiting' || activePhase === 'turbulence') {
        // ============================================================
        // QUICK SMOOTH BRAKE SHAKE -> 5s CALM ORBIT -> TURBULENCE &
        // GRAVITATIONAL ATTRACTION TOWARD PLANET
        // ============================================================
        const scene = getPlanet2DScene(dest);
        const orbitElapsed = Math.max(0, (now - orbitStartRef.current) / 1000);
        const isTurb = activePhase === 'turbulence';

        const pullT = isTurb ? clamp(elapsed / 2.0, 0, 1) : 0;
        const pullEase = pullT * pullT;

        // Initial brake shake on entering orbit, then escalating turbulence shake
        const brakeDecay = Math.exp(-orbitElapsed * 8.2);
        const baseShake = 11.5 * svgScale * brakeDecay;
        const turbShake = isTurb ? (2.8 + pullT * 13.5) * svgScale : 0;
        const totalShake = baseShake + turbShake;

        const shakeX = Math.sin(now * 0.048) * totalShake;
        const shakeY = Math.cos(now * 0.061) * totalShake * 0.74;

        const calmDriftX = Math.sin(orbitElapsed * 0.32) * 4 * svgScale;
        const calmDriftY = Math.cos(orbitElapsed * 0.25) * 2.5 * svgScale;

        // Parallax-drifting background starfield (accelerates during gravity pull)
        const extraPullShift = isTurb ? pullEase * 0.18 : 0;
        for (let i = 0; i < bgStars.length; i++) {
          const st = bgStars[i];
          const depthFactor = clamp((st.r - 0.4) / 1.95, 0.15, 1.0);
          const starSpeedX = 0.016 + depthFactor * 0.048;
          const starSpeedY = 0.002 + depthFactor * 0.007;
          const wrappedNx = (st.nx + orbitElapsed * starSpeedX - extraPullShift * depthFactor + 10) % 1;
          const wrappedNy = (st.ny + orbitElapsed * starSpeedY - extraPullShift * 0.35 * depthFactor + 10) % 1;

          const sx =
            svgOffX +
            (92 + wrappedNx * 1016) * svgScale +
            shakeX * 0.45 +
            calmDriftX * 0.25;
          const sy =
            svgOffY +
            (46 + wrappedNy * 440) * svgScale +
            shakeY * 0.45 +
            calmDriftY * 0.25;
          const twinkle =
            0.72 + 0.28 * Math.sin(orbitElapsed * st.twinkleSpeed + st.twinkleOffset);
          ctx.globalAlpha = st.alpha * twinkle;
          ctx.fillStyle = st.color;
          ctx.beginPath();
          ctx.arc(sx, sy, st.r * svgScale, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Residual B&W warp lines quickly braking to zero in first 0.34s of orbit
        if (orbitElapsed < 0.36) {
          const brakeFrac = Math.pow(1 - orbitElapsed / 0.36, 2);
          const cx = winCx + shakeX;
          const cy = winCy + shakeY;
          const focal = 350 * svgScale;

          for (let i = 0; i < warpStars.length; i += 2) {
            const st = warpStars[i];
            const sx = cx + (st.x / st.z) * focal;
            const sy = cy + (st.y / st.z) * focal;
            const tailZ = Math.min(1.0, st.z + 0.24 * brakeFrac);
            const px = cx + (st.x / tailZ) * focal;
            const py = cy + (st.y / tailZ) * focal;

            ctx.strokeStyle = `rgba(255, 255, 255, ${brakeFrac * 0.78})`;
            ctx.lineWidth = Math.max(0.8, 1.5 * svgScale * brakeFrac);
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(sx, sy);
            ctx.stroke();
          }
        }

        // Enlarged giant planet lowered along right side -> pulled huge toward window on turbulence
        const settleT = clamp(orbitElapsed / 0.48, 0, 1);
        const settleEase = 1 - Math.pow(1 - settleT, 3);
        const planetScale = lerp(0.86, 1.0, settleEase);

        const basePx = 965 + (1 - settleEase) * 55;
        const basePy = 540 + (1 - settleEase) * 35;
        const targetPx = lerp(basePx, 665, pullEase);
        const targetPy = lerp(basePy, 355, pullEase);

        const pCx = svgOffX + targetPx * svgScale + shakeX + calmDriftX * 0.5;
        const pCy = svgOffY + targetPy * svgScale + shakeY + calmDriftY * 0.5;
        const R = lerp(520, 1080, pullEase) * svgScale * planetScale;

        drawDetailed2DPlanet(ctx, scene, dest, pCx, pCy, R, orbitElapsed, svgScale);

        // 2D atmospheric entry wind streaks during planetary gravity attraction
        if (isTurb && pullT > 0.12) {
          const streakAlpha = clamp((pullT - 0.12) / 0.88, 0, 1);
          const streakColor =
            dest === 'mars'
              ? `rgba(255, 198, 158, ${0.42 * streakAlpha})`
              : dest === 'deep_space'
                ? `rgba(186, 230, 253, ${0.42 * streakAlpha})`
                : `rgba(255, 255, 255, ${0.32 * streakAlpha})`;
          ctx.strokeStyle = streakColor;
          ctx.lineCap = 'round';
          for (let s = 0; s < 16; s++) {
            const p = (elapsed * (2.6 + (s % 4) * 0.45) + s * 0.19) % 1;
            const startX = svgOffX + (140 + (s * 63) % 940) * svgScale + shakeX;
            const startY = svgOffY + (480 - p * 460) * svgScale + shakeY;
            const len = (45 + pullT * 85) * svgScale;
            ctx.lineWidth = (1.2 + (s % 3) * 0.7) * svgScale;
            ctx.beginPath();
            ctx.moveTo(startX + len * 0.45, startY + len);
            ctx.lineTo(startX, startY);
            ctx.stroke();
          }
        }
      } else if (activePhase === 'blackout') {
        // ============================================================
        // INSTANT BLACK WINDOW DURING DIMMED/BLINKING CABIN POWER LOSS
        // ============================================================
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, w, h);
      } else if (activePhase === 'surface_reveal') {
        // ============================================================
        // LIGHTS FULL -> WINDOW SLOWLY CLEARS (OPACITY 1 -> 0) TO
        // REVEAL THE PLANET'S 2D SURFACE HORIZON!
        // ============================================================
        drawSurfaceBackdrop(
          ctx,
          dest,
          w,
          h,
          svgOffX,
          svgOffY,
          svgScale,
          elapsed,
          bgStars
        );

        // Decreasing black veil opacity (1.0 -> 0.0 over 2.3s)
        const veilAlpha = clamp(1 - elapsed / 2.3, 0, 1);
        if (veilAlpha > 0.005) {
          ctx.fillStyle = `rgba(0, 0, 0, ${veilAlpha})`;
          ctx.fillRect(0, 0, w, h);
        }
      } else if (activePhase === 'surface_static') {
        // Static landed surface backdrop once controls are visible on rover pad
        drawSurfaceBackdrop(
          ctx,
          dest,
          w,
          h,
          svgOffX,
          svgOffY,
          svgScale,
          0,
          bgStars
        );
      }

      if (activePhase !== 'surface_static' || dest === 'deep_space') {
        rafId = requestAnimationFrame(drawFrame);
      }
    };

    const handleRedraw = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(drawFrame);
    };

    redrawStaticRef.current = handleRedraw;
    window.addEventListener('resize', handleRedraw);
    window.addEventListener('orientationchange', handleRedraw);
    const unsubMoon = onMoonSurfaceLoaded(handleRedraw);
    const unsubMars = onMarsSurfaceLoaded(handleRedraw);
    rafId = requestAnimationFrame(drawFrame);

    return () => {
      redrawStaticRef.current = null;
      window.removeEventListener('resize', handleRedraw);
      window.removeEventListener('orientationchange', handleRedraw);
      unsubMoon();
      unsubMars();
      cancelAnimationFrame(rafId);
    };
  }, [isActive]);

  if (travelPhase === 'idle') return null;

  return <canvas ref={canvasRef} className="window-realistic-canvas" />;
};

function drawDetailed2DPlanet(
  ctx: CanvasRenderingContext2D,
  scene: Planet2DScene,
  dest: TravelDestination,
  cx: number,
  cy: number,
  R: number,
  elapsed: number,
  scale: number
) {
  const spinSpeed = dest === 'moon' ? 0.12 : dest === 'mars' ? 0.15 : 0.18;
  const spinAngle = elapsed * spinSpeed + 0.65;
  const cloudAngle = elapsed * (spinSpeed * 1.32) + 1.1;
  const tilt = dest === 'mars' ? 0.24 : dest === 'deep_space' ? 0.22 : 0.17;

  // 1. Crisp 2D stepped outer atmospheric rings (outside planet limb)
  if (dest === 'mars') {
    ctx.fillStyle = 'rgba(255, 160, 110, 0.16)';
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.055, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 198, 155, 0.24)';
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.024, 0, Math.PI * 2);
    ctx.fill();
  } else if (dest === 'deep_space') {
    ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.06, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(125, 211, 252, 0.28)';
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.025, 0, Math.PI * 2);
    ctx.fill();

    // Back ring half
    draw2DHorizonRings(ctx, cx, cy, R, true, scale);
  } else {
    // Moon crisp subtle outer dust/sun glint halo
    ctx.fillStyle = 'rgba(226, 232, 240, 0.1)';
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.022, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Clip everything cleanly inside the 2D planetary circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.clip();

  // Base flat 2D planet fill
  if (dest === 'moon') {
    ctx.fillStyle = '#adb6c4';
  } else if (dest === 'mars') {
    ctx.fillStyle = '#d9663b';
  } else {
    ctx.fillStyle = '#145da0';
  }
  ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

  // Subtle 2D stepped sunlit zone & midtone band (cel-shaded, NOT 3D sphere shading)
  ctx.fillStyle =
    dest === 'moon' ? '#c2cbd8' : dest === 'mars' ? '#e87c4f' : '#1b72bd';
  ctx.beginPath();
  ctx.arc(cx - R * 0.22, cy - R * 0.12, R * 0.96, 0, Math.PI * 2);
  ctx.fill();

  // 3. Rotating 2D Maria / Plateaus / Continents
  for (let i = 0; i < scene.patches.length; i++) {
    const patch = scene.patches[i];
    if (patch.kind === 'cloud') continue;
    const proj = projectOnSphere(patch.lon, patch.lat, spinAngle, cx, cy, R, tilt);
    if (!proj) continue;

    ctx.save();
    ctx.translate(proj.x, proj.y);
    ctx.rotate(patch.rot);
    ctx.scale(proj.foreshorten, 1);

    const rx = patch.rx * R;
    const ry = patch.ry * R;

    ctx.fillStyle = patch.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    if (patch.shadeColor) {
      ctx.fillStyle = patch.shadeColor;
      ctx.beginPath();
      ctx.ellipse(rx * 0.14, ry * 0.16, rx * 0.72, ry * 0.68, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 4. Crisp 2D Rilles / Martian Canyons
  for (let i = 0; i < scene.fractures.length; i++) {
    const fr = scene.fractures[i];
    const proj = projectOnSphere(fr.lon, fr.lat, spinAngle, cx, cy, R, tilt);
    if (!proj) continue;

    ctx.save();
    ctx.translate(proj.x, proj.y);
    ctx.rotate(fr.angle);
    ctx.scale(proj.foreshorten, 1);

    const len = fr.len * R;
    const bend = fr.bend * R;

    if (dest === 'mars') {
      // Deep canyon shadow + sunlit canyon lip
      ctx.strokeStyle = '#6e2010';
      ctx.lineWidth = Math.max(2, 5.2 * scale);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-len * 0.5, 0);
      ctx.quadraticCurveTo(0, bend, len * 0.5, 0);
      ctx.stroke();

      ctx.strokeStyle = '#f2a272';
      ctx.lineWidth = Math.max(1, 1.8 * scale);
      ctx.beginPath();
      ctx.moveTo(-len * 0.48, -2.5 * scale);
      ctx.quadraticCurveTo(0, bend - 2.5 * scale, len * 0.48, -2.5 * scale);
      ctx.stroke();
    } else {
      // Crisp 2D lunar rille crack
      ctx.strokeStyle = '#5c6575';
      ctx.lineWidth = Math.max(1.2, 2.2 * scale);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-len * 0.5, 0);
      ctx.quadraticCurveTo(0, bend, len * 0.5, 0);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 5. Detailed 2D Cel-Shaded Craters & Volcanoes
  for (let i = 0; i < scene.craters.length; i++) {
    const cr = scene.craters[i];
    const proj = projectOnSphere(cr.lon, cr.lat, spinAngle, cx, cy, R, tilt);
    if (!proj) continue;

    ctx.save();
    ctx.translate(proj.x, proj.y);
    ctx.scale(proj.foreshorten, 1);

    const r = cr.radius * R;

    if (cr.kind === 'volcano') {
      // 2D Shield volcano cone + sunlit rim + summit caldera
      ctx.fillStyle = '#b54624';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ee8a58';
      ctx.beginPath();
      ctx.arc(-r * 0.14, -r * 0.1, r * 0.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#732312';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.34, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Bright ejecta rays on hero lunar craters
      if (cr.hasRays) {
        ctx.strokeStyle = 'rgba(232, 238, 248, 0.36)';
        ctx.lineWidth = Math.max(1, 2.0 * scale);
        for (let ray = 0; ray < 7; ray++) {
          const ang = (ray / 7) * Math.PI * 2 + 0.3;
          ctx.beginPath();
          ctx.moveTo(Math.cos(ang) * r * 1.05, Math.sin(ang) * r * 1.05);
          ctx.lineTo(Math.cos(ang) * r * 2.15, Math.sin(ang) * r * 2.15);
          ctx.stroke();
        }
      }

      // Outer crater rim ridge
      ctx.fillStyle = dest === 'moon' ? '#dce3ef' : '#f29e6e';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      // Crater bowl
      ctx.fillStyle = dest === 'moon' ? '#818b9c' : '#a83c1f';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.84, 0, Math.PI * 2);
      ctx.fill();

      // Crisp 2D inner crescent shadow cast by upper-left sun
      ctx.fillStyle = dest === 'moon' ? '#535c6b' : '#6c2210';
      ctx.beginPath();
      ctx.arc(-r * 0.14, -r * 0.1, r * 0.72, 0, Math.PI * 2);
      ctx.fill();

      // Lit opposite floor inside crater
      ctx.fillStyle = dest === 'moon' ? '#959fb0' : '#c65432';
      ctx.beginPath();
      ctx.arc(r * 0.1, r * 0.08, r * 0.62, 0, Math.PI * 2);
      ctx.fill();

      // Central peak on big hero craters
      if (cr.hasPeak) {
        ctx.fillStyle = '#cad3e2';
        ctx.beginPath();
        ctx.arc(-r * 0.04, -r * 0.03, r * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // 6. Polar Ice Caps (Mars & Deep Space)
  if (dest === 'mars' || dest === 'deep_space') {
    ctx.fillStyle = dest === 'mars' ? '#fff7f2' : '#f0f9ff';
    ctx.beginPath();
    ctx.ellipse(cx - R * 0.08, cy - R * 0.94, R * 0.36, R * 0.14, -0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  // 7. Drifting 2D Cloud Ribbons (Mars & Deep Space)
  for (let i = 0; i < scene.patches.length; i++) {
    const patch = scene.patches[i];
    if (patch.kind !== 'cloud') continue;
    const proj = projectOnSphere(patch.lon, patch.lat, cloudAngle, cx, cy, R, tilt);
    if (!proj) continue;

    ctx.save();
    ctx.translate(proj.x, proj.y);
    ctx.rotate(patch.rot);
    ctx.scale(proj.foreshorten, 1);

    const rx = patch.rx * R;
    const ry = patch.ry * R;
    ctx.fillStyle = patch.color;
    ctx.beginPath();
    ctx.roundRect(-rx, -ry, rx * 2, ry * 2, ry);
    ctx.fill();
    ctx.restore();
  }

  // 8. Crisp 2D Cel-Shaded Terminator Shadow Band on deep far-right side
  ctx.fillStyle =
    dest === 'moon'
      ? 'rgba(18, 22, 32, 0.38)'
      : dest === 'mars'
        ? 'rgba(42, 12, 8, 0.4)'
        : 'rgba(6, 18, 42, 0.38)';
  ctx.beginPath();
  ctx.rect(cx - R, cy - R, R * 2, R * 2);
  ctx.arc(cx - R * 0.32, cy - R * 0.16, R * 1.02, 0, Math.PI * 2, true);
  ctx.fill();

  // 9. Crisp 2D Sunlit Rim Arc along the curved horizon facing space
  ctx.strokeStyle =
    dest === 'moon'
      ? 'rgba(238, 244, 255, 0.55)'
      : dest === 'mars'
        ? 'rgba(255, 206, 168, 0.72)'
        : 'rgba(165, 236, 255, 0.8)';
  ctx.lineWidth = Math.max(2.5, 6 * scale);
  ctx.beginPath();
  ctx.arc(cx, cy, R - 2 * scale, Math.PI * 0.78, Math.PI * 1.48);
  ctx.stroke();

  ctx.restore();

  // Subtle dark outer 2D ink edge around the planet horizon
  ctx.strokeStyle = 'rgba(8, 12, 20, 0.72)';
  ctx.lineWidth = Math.max(1.5, 2.5 * scale);
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.stroke();

  if (dest === 'deep_space') {
    draw2DHorizonRings(ctx, cx, cy, R, false, scale);
  }
}

function draw2DHorizonRings(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  planetRadius: number,
  backHalf: boolean,
  scale: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.34);
  ctx.scale(1, 0.24);

  const startAng = backHalf ? Math.PI : 0;
  const endAng = backHalf ? Math.PI * 2 : Math.PI;

  const bands = [
    { r: 1.15, w: 14, color: 'rgba(186, 230, 253, 0.22)' },
    { r: 1.24, w: 22, color: 'rgba(224, 242, 254, 0.34)' },
    { r: 1.33, w: 9, color: 'rgba(125, 211, 252, 0.24)' }
  ];

  for (const band of bands) {
    ctx.strokeStyle = band.color;
    ctx.lineWidth = band.w * scale;
    ctx.beginPath();
    ctx.arc(0, 0, planetRadius * band.r, startAng, endAng);
    ctx.stroke();
  }
  ctx.restore();
}

function drawDeepSpaceWindowView(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  svgOffX: number,
  svgOffY: number,
  svgScale: number,
  elapsed: number,
  bgStars: BgStar[],
  warpStars: StarParticle[],
  winCx: number,
  winCy: number,
  focusProbe: DeepSpaceProbeId,
  isCruisingIn: boolean
) {
  // 1. Deep interstellar cosmic void
  const skyGrad = ctx.createRadialGradient(
    winCx,
    winCy - 40 * svgScale,
    40 * svgScale,
    winCx,
    winCy,
    720 * svgScale
  );
  skyGrad.addColorStop(0, '#09142b');
  skyGrad.addColorStop(0.55, '#040814');
  skyGrad.addColorStop(1, '#010207');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Subtle cosmic Milky Way dust ribbon across upper cockpit window
  ctx.save();
  ctx.translate(winCx, svgOffY + 190 * svgScale);
  ctx.rotate(-0.18);
  const nebGrad = ctx.createLinearGradient(-520 * svgScale, 0, 520 * svgScale, 0);
  nebGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
  nebGrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.08)');
  nebGrad.addColorStop(0.65, 'rgba(139, 92, 246, 0.1)');
  nebGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
  ctx.fillStyle = nebGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, 560 * svgScale, 110 * svgScale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. Twinkling & slowly parallax-drifting interstellar starfield
  for (let i = 0; i < bgStars.length; i++) {
    const st = bgStars[i];
    const depth = clamp((st.r - 0.4) / 1.9, 0.15, 1);
    const driftSpeed = isCruisingIn ? 0.032 : 0.004;
    const wrappedNx = (st.nx + elapsed * driftSpeed * depth) % 1;
    const sx = svgOffX + (92 + wrappedNx * 1016) * svgScale;
    const sy = svgOffY + (46 + st.ny * 440) * svgScale;
    const twinkle = 0.68 + 0.32 * Math.sin(elapsed * st.twinkleSpeed + st.twinkleOffset);
    ctx.globalAlpha = st.alpha * twinkle;
    ctx.fillStyle = st.color;
    ctx.beginPath();
    ctx.arc(sx, sy, st.r * svgScale, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Residual braking star streaks when just exiting hyperspace into deep space
  if (isCruisingIn && elapsed < 0.48) {
    const brakeFrac = Math.pow(1 - elapsed / 0.48, 2);
    const focal = 350 * svgScale;
    for (let i = 0; i < warpStars.length; i += 2) {
      const st = warpStars[i];
      const sx = winCx + (st.x / st.z) * focal;
      const sy = winCy + (st.y / st.z) * focal;
      const tailZ = Math.min(1.0, st.z + 0.22 * brakeFrac);
      const px = winCx + (st.x / tailZ) * focal;
      const py = winCy + (st.y / tailZ) * focal;
      ctx.strokeStyle = `rgba(186, 230, 253, ${brakeFrac * 0.72})`;
      ctx.lineWidth = Math.max(0.8, 1.5 * svgScale * brakeFrac);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(sx, sy);
      ctx.stroke();
    }
  }

  // Far-away pale Sun & faint outer ringed gas giant in distance (small in background, no landing!)
  const sunX = svgOffX + 195 * svgScale;
  const sunY = svgOffY + 125 * svgScale;
  ctx.fillStyle = 'rgba(254, 249, 195, 0.18)';
  ctx.beginPath();
  ctx.arc(sunX, sunY, 18 * svgScale, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fef9c3';
  ctx.beginPath();
  ctx.arc(sunX, sunY, 4.5 * svgScale, 0, Math.PI * 2);
  ctx.fill();

  const farPlanetX = svgOffX + 985 * svgScale;
  const farPlanetY = svgOffY + 135 * svgScale;
  ctx.save();
  ctx.fillStyle = '#1e3a5f';
  ctx.beginPath();
  ctx.arc(farPlanetX, farPlanetY, 28 * svgScale, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(186, 230, 253, 0.32)';
  ctx.lineWidth = 4 * svgScale;
  ctx.beginPath();
  ctx.ellipse(farPlanetX, farPlanetY, 48 * svgScale, 11 * svgScale, -0.25, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 3. Floating Spacecraft outside the Cockpit Window:
  // When observing Pioneer or Voyager, anchor cleanly on the LEFT half of the window
  // so the right-side NASA Media / Info panel never overlays the spacecraft.
  const leftProbeX = svgOffX + 335 * svgScale;
  const leftProbeY = svgOffY + 235 * svgScale;

  if (focusProbe === 'pioneer') {
    drawPioneerProbe2D(ctx, leftProbeX, leftProbeY, svgScale * 1.05, elapsed);
  } else if (focusProbe === 'voyager') {
    drawVoyagerProbe2D(ctx, leftProbeX, leftProbeY, svgScale * 1.0, elapsed);
  } else {
    // Hub selection / arrival: show both Pioneer and Voyager drifting calmly in deep space
    drawPioneerProbe2D(
      ctx,
      svgOffX + 365 * svgScale,
      svgOffY + 190 * svgScale,
      svgScale * 0.72,
      elapsed
    );
    drawVoyagerProbe2D(
      ctx,
      svgOffX + 835 * svgScale,
      svgOffY + 190 * svgScale,
      svgScale * 0.72,
      elapsed + 1.4
    );
  }
}

function drawPioneerProbe2D(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  elapsed: number
) {
  const bob = Math.sin(elapsed * 1.1) * 7 * scale;
  const tilt = -0.14 + Math.sin(elapsed * 0.6) * 0.04;

  ctx.save();
  ctx.translate(cx, cy + bob);
  ctx.rotate(tilt);
  ctx.scale(scale, scale);

  // Pulsing cyan telemetry signal waves radiating from Pioneer's dish
  for (let w = 0; w < 3; w++) {
    const p = (elapsed * 0.55 + w / 3) % 1;
    ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - p) * 0.75})`;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(0, -46 - p * 44, 24 + p * 34, Math.PI * 1.2, Math.PI * 1.8);
    ctx.stroke();
  }

  // Long slender magnetometer boom (bottom-left diagonal)
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-12, 18);
  ctx.lineTo(-108, 72);
  ctx.stroke();
  ctx.fillStyle = '#e2e8f0';
  ctx.strokeStyle = '#0c1017';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(-112, 74, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Two extended RTG nuclear power booms (left & right with dark finned RTGs)
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(-18, 8);
  ctx.lineTo(-86, -12);
  ctx.moveTo(18, 8);
  ctx.lineTo(94, 24);
  ctx.stroke();

  for (const [rx, ry, rot] of [
    [-92, -14, -0.25],
    [98, 25, 0.2]
  ] as [number, number, number][]) {
    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(rot);
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#0c1017';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(-14, -7, 28, 14, 3);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Hexagonal spacecraft bus with metallic foil + gold Pioneer Plaque on strut
  ctx.fillStyle = '#64748b';
  ctx.strokeStyle = '#0c1017';
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.roundRect(-24, -4, 48, 30, 6);
  ctx.fill();
  ctx.stroke();

  // Gold Pioneer Plaque glinting cleanly on the lower strut
  ctx.fillStyle = '#fbbf24';
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(-10, 4, 20, 14, 2);
  ctx.fill();
  ctx.stroke();

  // Large 2.7m High-Gain Parabolic Dish + tripod feed horn
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#0c1017';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, -14, 62, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.ellipse(0, -12, 48, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tripod feed horn above dish
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(-36, -15);
  ctx.lineTo(0, -48);
  ctx.lineTo(36, -15);
  ctx.moveTo(0, -14);
  ctx.lineTo(0, -48);
  ctx.stroke();
  ctx.fillStyle = '#38bdf8';
  ctx.strokeStyle = '#0c1017';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -49, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawVoyagerProbe2D(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  elapsed: number
) {
  const bob = Math.sin(elapsed * 0.95) * 6.5 * scale;
  const tilt = 0.08 + Math.sin(elapsed * 0.5) * 0.035;

  ctx.save();
  ctx.translate(cx, cy + bob);
  ctx.rotate(tilt);
  ctx.scale(scale, scale);

  // Pulsing cyan interstellar telemetry waves from Voyager's 3.7m dish
  for (let w = 0; w < 3; w++) {
    const p = (elapsed * 0.52 + w / 3) % 1;
    ctx.strokeStyle = `rgba(34, 211, 238, ${(1 - p) * 0.78})`;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(0, -52 - p * 46, 26 + p * 36, Math.PI * 1.2, Math.PI * 1.8);
    ctx.stroke();
  }

  // Ultra-long lattice magnetometer boom (sweeping down-left)
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-22, 16);
  ctx.lineTo(-142, 68);
  ctx.moveTo(-18, 24);
  ctx.lineTo(-138, 76);
  ctx.stroke();
  for (let seg = 1; seg <= 6; seg++) {
    const t = seg / 6;
    ctx.beginPath();
    ctx.moveTo(-22 - t * 120, 16 + t * 52);
    ctx.lineTo(-18 - t * 120, 24 + t * 52);
    ctx.stroke();
  }

  // Two long V-shaped plasma/radio whip antennas
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(14, 26);
  ctx.lineTo(78, 92);
  ctx.moveTo(-4, 28);
  ctx.lineTo(-22, 102);
  ctx.stroke();

  // RTG Power Boom (far right)
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 3.4;
  ctx.beginPath();
  ctx.moveTo(22, 12);
  ctx.lineTo(106, 26);
  ctx.stroke();
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#0c1017';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.roundRect(78, 16, 40, 14, 3);
  ctx.fill();
  ctx.stroke();

  // Science Scan Platform Boom (upper right)
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(24, 2);
  ctx.lineTo(84, -30);
  ctx.stroke();
  ctx.fillStyle = '#475569';
  ctx.strokeStyle = '#0c1017';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.roundRect(78, -42, 24, 18, 4);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(98, -33, 4, 0, Math.PI * 2);
  ctx.fill();

  // Decagonal Voyager Bus + iconic Golden Record cover!
  ctx.fillStyle = '#334155';
  ctx.strokeStyle = '#0c1017';
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.roundRect(-28, -2, 56, 32, 8);
  ctx.fill();
  ctx.stroke();

  // Gleaming Circular Voyager Golden Record
  ctx.fillStyle = '#facc15';
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(-8, 14, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.arc(-8, 14, 2.2, 0, Math.PI * 2);
  ctx.fill();

  // 3.7m High-Gain Parabolic Dish + tripod feed
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#0c1017';
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.ellipse(0, -14, 72, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#dbeafe';
  ctx.beginPath();
  ctx.ellipse(0, -12, 56, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(-40, -16);
  ctx.lineTo(0, -54);
  ctx.lineTo(40, -16);
  ctx.moveTo(0, -14);
  ctx.lineTo(0, -54);
  ctx.stroke();
  ctx.fillStyle = '#22d3ee';
  ctx.strokeStyle = '#0c1017';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -55, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}
