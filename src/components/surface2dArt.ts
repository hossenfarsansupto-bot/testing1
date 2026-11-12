export type PlanetTheme = 'moon' | 'mars' | 'deep_space';

function createSurfaceImageLoader(src: string) {
  let cache: HTMLImageElement | null = null;
  const callbacks = new Set<() => void>();

  const getImg = (): HTMLImageElement | null => {
    if (typeof window === 'undefined') return null;
    if (!cache) {
      const img = new Image();
      img.onload = () => {
        callbacks.forEach((cb) => cb());
        callbacks.clear();
      };
      img.src = src;
      cache = img;
    }
    return cache;
  };

  const onLoaded = (cb: () => void): (() => void) => {
    if (typeof window === 'undefined') return () => {};
    const img = getImg();
    if (img && img.complete && img.naturalWidth > 0) {
      return () => {};
    }
    callbacks.add(cb);
    return () => {
      callbacks.delete(cb);
    };
  };

  if (typeof window !== 'undefined') {
    getImg();
  }

  return { getImg, onLoaded };
}

const moonSurfaceLoader = createSurfaceImageLoader('/images/moon-surface.jpg');
const marsSurfaceLoader = createSurfaceImageLoader('/images/mars-surface.jpg');

/** Preload custom illustrated lunar surface backdrop and notify canvases once decoded. */
export const onMoonSurfaceLoaded = moonSurfaceLoader.onLoaded;

/** Preload custom illustrated Martian surface backdrop and notify canvases once decoded. */
export const onMarsSurfaceLoaded = marsSurfaceLoader.onLoaded;

function drawCoverSurfaceImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  w: number,
  h: number,
  scale: number,
  horizonShiftY: number,
  fillFallback: string
): boolean {
  if (!img || !img.complete || img.naturalWidth <= 0) {
    return false;
  }
  ctx.fillStyle = fillFallback;
  ctx.fillRect(-200, -160, w + 400, h + 320);

  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const coverScale = Math.max(w / iw, h / ih);
  const drawW = iw * coverScale;
  const drawH = ih * coverScale;
  const drawX = (w - drawW) * 0.5;
  const minY = Math.min(0, h - drawH);
  const drawY = Math.min(0, Math.max(minY, (h - drawH) * 0.5 + horizonShiftY * scale));
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
  return true;
}

export interface BgStar {
  nx: number;
  ny: number;
  r: number;
  alpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: string;
}

export function drawSurfaceBackdrop(
  ctx: CanvasRenderingContext2D,
  dest: PlanetTheme,
  w: number,
  h: number,
  offX: number,
  offY: number,
  scale: number,
  elapsed: number,
  bgStars: BgStar[],
  horizonShiftY = 0
) {
  const sx = (vx: number) => offX + vx * scale;
  const sy = (vy: number) => offY + (vy + horizonShiftY) * scale;

  // 1. Custom illustrated Moon surface backdrop (shared by cockpit landing window & outside EVA navigation)
  if (dest === 'moon') {
    if (
      drawCoverSurfaceImage(
        ctx,
        moonSurfaceLoader.getImg(),
        w,
        h,
        scale,
        horizonShiftY,
        '#000000'
      )
    ) {
      return;
    }

    ctx.fillStyle = '#000000';
    ctx.fillRect(-200, -160, w + 400, h + 320);

    for (let i = 0; i < bgStars.length; i++) {
      const st = bgStars[i];
      if (st.ny > 0.62) continue;
      ctx.globalAlpha = st.alpha;
      ctx.fillStyle = st.color;
      ctx.beginPath();
      ctx.arc(sx(-120 + st.nx * 1440), sy(20 + st.ny * 360), st.r * scale, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Distant crisp 2D crescent Earthrise hovering in lunar sky
    const ex = sx(380);
    const ey = sy(140);
    const er = 38 * scale;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.beginPath();
    ctx.arc(ex, ey, er * 1.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(ex, ey, er, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = '#1565c0';
    ctx.fillRect(ex - er, ey - er, er * 2, er * 2);
    ctx.fillStyle = '#388e3c';
    ctx.beginPath();
    ctx.ellipse(ex - er * 0.2, ey - er * 0.1, er * 0.45, er * 0.3, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(ex - er * 0.1, ey - er * 0.35, er * 0.55, er * 0.14, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(4, 10, 22, 0.78)';
    ctx.beginPath();
    ctx.rect(ex - er, ey - er, er * 2, er * 2);
    ctx.arc(ex - er * 0.55, ey - er * 0.2, er * 1.05, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.restore();
  } else if (dest === 'mars') {
    if (
      drawCoverSurfaceImage(
        ctx,
        marsSurfaceLoader.getImg(),
        w,
        h,
        scale,
        horizonShiftY,
        '#b97d60'
      )
    ) {
      return;
    }

    const skyBands = [
      { y: -220, h: 345, col: '#2d1620' },
      { y: 120, h: 65, col: '#5c2627' },
      { y: 180, h: 65, col: '#9e442f' },
      { y: 240, h: 200, col: '#d67849' }
    ];
    for (const band of skyBands) {
      ctx.fillStyle = band.col;
      ctx.fillRect(-200, sy(band.y), w + 400, band.h * scale + 2);
    }

    for (let i = 0; i < Math.min(65, bgStars.length); i++) {
      const st = bgStars[i];
      if (st.ny > 0.25) continue;
      ctx.globalAlpha = st.alpha * 0.5;
      ctx.fillStyle = '#ffe8d6';
      ctx.beginPath();
      ctx.arc(sx(92 + st.nx * 1016), sy(46 + st.ny * 360), st.r * scale, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = 'rgba(255, 228, 196, 0.28)';
    ctx.beginPath();
    ctx.arc(sx(430), sy(180), 26 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff5eb';
    ctx.beginPath();
    ctx.arc(sx(430), sy(180), 11 * scale, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const skyBands = [
      { y: -220, h: 335, col: '#071329' },
      { y: 110, h: 70, col: '#0c2a4d' },
      { y: 175, h: 65, col: '#144c75' },
      { y: 235, h: 200, col: '#23799e' }
    ];
    for (const band of skyBands) {
      ctx.fillStyle = band.col;
      ctx.fillRect(-200, sy(band.y), w + 400, band.h * scale + 2);
    }

    for (let i = 0; i < Math.min(110, bgStars.length); i++) {
      const st = bgStars[i];
      if (st.ny > 0.38) continue;
      ctx.globalAlpha = st.alpha * 0.8;
      ctx.fillStyle = st.color;
      ctx.beginPath();
      ctx.arc(sx(92 + st.nx * 1016), sy(46 + st.ny * 360), st.r * scale, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.strokeStyle = 'rgba(186, 230, 253, 0.24)';
    ctx.lineWidth = 22 * scale;
    ctx.beginPath();
    ctx.arc(sx(1120), sy(640), 690 * scale, Math.PI * 1.08, Math.PI * 1.48);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(224, 242, 254, 0.34)';
    ctx.lineWidth = 10 * scale;
    ctx.beginPath();
    ctx.arc(sx(1120), sy(640), 735 * scale, Math.PI * 1.08, Math.PI * 1.48);
    ctx.stroke();
  }

  // 2. Distant Horizon Mountain / Mesa Silhouette Ridge
  ctx.fillStyle =
    dest === 'moon' ? '#586272' : dest === 'mars' ? '#852f1a' : '#164d4e';
  ctx.beginPath();
  ctx.moveTo(sx(-240), sy(320));
  const farPeaks =
    dest === 'mars'
      ? [
          [-160, 245],
          [-40, 268],
          [80, 265],
          [170, 240],
          [260, 240],
          [310, 265],
          [420, 258],
          [490, 228],
          [590, 228],
          [645, 256],
          [760, 264],
          [840, 234],
          [945, 234],
          [1020, 260],
          [1150, 248],
          [1280, 236],
          [1440, 255]
        ]
      : [
          [-160, 242],
          [-40, 264],
          [80, 268],
          [190, 238],
          [300, 262],
          [410, 234],
          [520, 258],
          [635, 224],
          [745, 255],
          [860, 230],
          [980, 262],
          [1120, 242],
          [1280, 262],
          [1440, 238]
        ];
  for (const [px, py] of farPeaks) {
    ctx.lineTo(sx(px), sy(py));
  }
  ctx.lineTo(sx(1460), sy(320));
  ctx.lineTo(sx(1460), h + 160);
  ctx.lineTo(sx(-240), h + 160);
  ctx.closePath();
  ctx.fill();

  // 3. Mid-ground Rolling Terrain / Dunes / Ocean Band
  if (dest === 'deep_space') {
    ctx.fillStyle = '#0d477a';
    ctx.fillRect(-200, sy(262), w + 400, 120 * scale);
    ctx.fillStyle = 'rgba(125, 211, 252, 0.35)';
    for (let i = 0; i < 8; i++) {
      const waveOffset = Math.sin(elapsed * 1.4 + i) * 14 * scale;
      ctx.fillRect(
        sx(360 + i * 24) + waveOffset,
        sy(272 + i * 9),
        (135 - i * 11) * scale,
        3.2 * scale
      );
    }
  }

  ctx.fillStyle =
    dest === 'moon' ? '#8c96a6' : dest === 'mars' ? '#c2522d' : '#1e6e60';
  ctx.beginPath();
  ctx.moveTo(sx(-240), sy(305));
  ctx.quadraticCurveTo(sx(300), sy(274), sx(600), sy(296));
  ctx.quadraticCurveTo(sx(900), sy(314), sx(1460), sy(285));
  ctx.lineTo(sx(1460), h + 160);
  ctx.lineTo(sx(-240), h + 160);
  ctx.closePath();
  ctx.fill();

  // 4. Crisp Foreground Surface Ground Plane
  ctx.fillStyle =
    dest === 'moon' ? '#adb6c4' : dest === 'mars' ? '#de6b3f' : '#2a856f';
  ctx.beginPath();
  ctx.moveTo(sx(-240), sy(345));
  ctx.quadraticCurveTo(sx(360), sy(318), sx(720), sy(338));
  ctx.quadraticCurveTo(sx(960), sy(348), sx(1460), sy(330));
  ctx.lineTo(sx(1460), h + 160);
  ctx.lineTo(sx(-240), h + 160);
  ctx.closePath();
  ctx.fill();

  if (dest === 'moon' || dest === 'mars') {
    const fgCraters = [
      { x: 240, y: 375, rx: 60, ry: 15 },
      { x: 890, y: 365, rx: 56, ry: 14 },
      { x: 560, y: 412, rx: 86, ry: 22 }
    ];
    for (const fc of fgCraters) {
      ctx.fillStyle = dest === 'moon' ? '#cfd7e3' : '#f29a6b';
      ctx.beginPath();
      ctx.ellipse(sx(fc.x), sy(fc.y), fc.rx * scale, fc.ry * scale, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = dest === 'moon' ? '#707a8a' : '#96351a';
      ctx.beginPath();
      ctx.ellipse(
        sx(fc.x),
        sy(fc.y + 1),
        fc.rx * 0.82 * scale,
        fc.ry * 0.72 * scale,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  const rocks = [
    { x: 165, y: 358, s: 1.0 },
    { x: 420, y: 344, s: 0.78 },
    { x: 960, y: 352, s: 1.15 },
    { x: 1080, y: 382, s: 0.95 }
  ];
  for (const rk of rocks) {
    const rx = sx(rk.x);
    const ry = sy(rk.y);
    const rs = rk.s * scale;

    ctx.fillStyle =
      dest === 'moon'
        ? 'rgba(18, 22, 30, 0.45)'
        : dest === 'mars'
          ? 'rgba(58, 16, 8, 0.42)'
          : 'rgba(6, 24, 24, 0.42)';
    ctx.beginPath();
    ctx.ellipse(rx + 18 * rs, ry + 7 * rs, 24 * rs, 6 * rs, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle =
      dest === 'moon' ? '#586270' : dest === 'mars' ? '#7a2a16' : '#164a47';
    ctx.beginPath();
    ctx.moveTo(rx - 18 * rs, ry + 7 * rs);
    ctx.lineTo(rx - 10 * rs, ry - 12 * rs);
    ctx.lineTo(rx + 6 * rs, ry - 15 * rs);
    ctx.lineTo(rx + 19 * rs, ry + 5 * rs);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle =
      dest === 'moon' ? '#cbd4e2' : dest === 'mars' ? '#eb8552' : '#43b096';
    ctx.beginPath();
    ctx.moveTo(rx - 18 * rs, ry + 7 * rs);
    ctx.lineTo(rx - 10 * rs, ry - 12 * rs);
    ctx.lineTo(rx + 3 * rs, ry - 6 * rs);
    ctx.lineTo(rx - 2 * rs, ry + 6 * rs);
    ctx.closePath();
    ctx.fill();
  }

  if (dest !== 'moon') {
    const mistAlpha = dest === 'mars' ? 0.14 : 0.22;
    ctx.fillStyle =
      dest === 'mars'
        ? `rgba(255, 208, 174, ${mistAlpha})`
        : `rgba(186, 244, 255, ${mistAlpha})`;
    for (let m = 0; m < 4; m++) {
      const mx = ((m * 280 + elapsed * (22 + m * 6)) % 1160) - 40;
      const my = 295 + m * 16;
      ctx.beginPath();
      ctx.roundRect(sx(mx), sy(my), 160 * scale, 10 * scale, 5 * scale);
      ctx.fill();
    }
  }
}

export function drawSiteHardware2D(
  ctx: CanvasRenderingContext2D,
  hardwareId: string,
  cx: number,
  cy: number,
  scale: number,
  elapsed: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  if (hardwareId === 'moon_retroreflectors') {
    ctx.fillStyle = 'rgba(15, 20, 30, 0.42)';
    ctx.beginPath();
    ctx.ellipse(6, 36, 46, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#0c1017';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-24, 34);
    ctx.lineTo(-10, 8);
    ctx.moveTo(24, 34);
    ctx.lineTo(10, 8);
    ctx.moveTo(0, 36);
    ctx.lineTo(0, 12);
    ctx.stroke();

    ctx.save();
    ctx.rotate(-0.22);
    ctx.fillStyle = '#d4dce6';
    ctx.strokeStyle = '#0c1017';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.roundRect(-38, -22, 76, 32, 5);
    ctx.fill();
    ctx.stroke();

    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 5; col++) {
        const px = -26 + col * 13;
        const py = -12 + row * 12;
        const glint = 0.65 + 0.35 * Math.sin(elapsed * 5 + col + row);
        ctx.fillStyle = `rgba(56, 224, 255, ${glint})`;
        ctx.beginPath();
        ctx.arc(px, py, 4.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0c1017';
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
    }
    ctx.restore();

    const pulse = (elapsed * 1.8) % 1;
    ctx.strokeStyle = `rgba(0, 255, 166, ${0.85 * (1 - pulse * 0.4)})`;
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(-10, -14);
    ctx.lineTo(-95, -210);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0, 229, 255, 0.75)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 8]);
    ctx.lineDashOffset = -elapsed * 120;
    ctx.beginPath();
    ctx.moveTo(6, -12);
    ctx.lineTo(95, -210);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (hardwareId === 'moon_alsep') {
    ctx.fillStyle = 'rgba(15, 20, 30, 0.42)';
    ctx.beginPath();
    ctx.ellipse(4, 36, 62, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2f3a47';
    ctx.strokeStyle = '#0c1017';
    ctx.lineWidth = 2.6;
    ctx.fillRect(-52, 4, 22, 30);
    ctx.strokeRect(-52, 4, 22, 30);
    ctx.fillStyle = `rgba(255, 167, 38, ${0.55 + 0.45 * Math.sin(elapsed * 4)})`;
    ctx.fillRect(-47, 10, 12, 6);

    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.roundRect(-20, -4, 46, 38, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffb300';
    ctx.fillRect(-10, 4, 26, 14);
    ctx.strokeRect(-10, 4, 26, 14);

    const dishTilt = Math.sin(elapsed * 1.8) * 0.16;
    ctx.strokeStyle = '#0c1017';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(4, -4);
    ctx.lineTo(4, -34);
    ctx.stroke();

    ctx.save();
    ctx.translate(4, -36);
    ctx.rotate(dishTilt);
    ctx.fillStyle = '#80deea';
    ctx.beginPath();
    ctx.ellipse(0, 0, 19, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    for (let wIdx = 0; wIdx < 3; wIdx++) {
      const wp = (elapsed * 1.1 + wIdx / 3) % 1;
      ctx.strokeStyle = `rgba(0, 229, 255, ${0.85 * (1 - wp)})`;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(4, -42, 12 + wp * 34, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    }

    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.arc(48, 22, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (hardwareId === 'mars_viking') {
    ctx.fillStyle = 'rgba(48, 16, 8, 0.42)';
    ctx.beginPath();
    ctx.ellipse(0, 36, 58, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#0c1017';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-26, 12);
    ctx.lineTo(-42, 34);
    ctx.moveTo(26, 12);
    ctx.lineTo(42, 34);
    ctx.moveTo(0, 14);
    ctx.lineTo(0, 36);
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.strokeStyle = '#0c1017';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.roundRect(-34, -8, 68, 24, 5);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ff7043';
    ctx.fillRect(-22, -2, 26, 11);
    ctx.strokeRect(-22, -2, 26, 11);

    ctx.beginPath();
    ctx.moveTo(14, -8);
    ctx.lineTo(14, -32);
    ctx.stroke();
    ctx.save();
    ctx.translate(14, -34);
    ctx.rotate(Math.sin(elapsed * 1.5) * 0.25);
    ctx.fillStyle = '#fff8e1';
    ctx.beginPath();
    ctx.ellipse(0, 0, 22, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    const scoopBob = Math.sin(elapsed * 2.2) * 5;
    ctx.strokeStyle = '#0c1017';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(-34, 4);
    ctx.lineTo(-56, 16 + scoopBob);
    ctx.lineTo(-68, 28 + scoopBob * 0.5);
    ctx.stroke();
    ctx.fillStyle = '#ffb300';
    ctx.beginPath();
    ctx.arc(-68, 28 + scoopBob * 0.5, 4.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (hardwareId === 'mars_sojourner') {
    const rollX = Math.sin(elapsed * 1.4) * 14;

    ctx.fillStyle = 'rgba(48, 16, 8, 0.42)';
    ctx.beginPath();
    ctx.ellipse(52, 36, 26, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#a34124';
    ctx.strokeStyle = '#0c1017';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(32, 35);
    ctx.lineTo(40, 10);
    ctx.lineTo(62, 6);
    ctx.lineTo(74, 34);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.translate(rollX - 18, 4);
    ctx.fillStyle = 'rgba(48, 16, 8, 0.36)';
    ctx.beginPath();
    ctx.ellipse(0, 32, 34, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e88e5';
    ctx.strokeStyle = '#0c1017';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.roundRect(-28, 2, 54, 16, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#263238';
    ctx.fillRect(-24, -5, 46, 8);
    ctx.strokeRect(-24, -5, 46, 8);

    const wheelXs = [-19, 0, 19];
    for (const wx of wheelXs) {
      ctx.fillStyle = '#546e7a';
      ctx.beginPath();
      ctx.arc(wx, 24, 7.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#cfd8dc';
      ctx.beginPath();
      ctx.arc(wx, 24, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.arc(28, 11, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(0, 229, 255, ${0.45 + 0.45 * Math.sin(elapsed * 8)})`;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(30, 11);
    ctx.lineTo(54 - rollX, 16);
    ctx.stroke();
    ctx.restore();
  } else if (hardwareId === 'mars_phoenix') {
    ctx.fillStyle = 'rgba(48, 16, 8, 0.42)';
    ctx.beginPath();
    ctx.ellipse(0, 36, 54, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#0c1017';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-18, 12);
    ctx.lineTo(-28, 34);
    ctx.moveTo(18, 12);
    ctx.lineTo(28, 34);
    ctx.stroke();

    ctx.fillStyle = '#0288d1';
    ctx.beginPath();
    ctx.ellipse(-40, 4, 20, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(40, 4, 20, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.roundRect(-22, -4, 44, 18, 4);
    ctx.fill();
    ctx.stroke();

    const digAng = Math.sin(elapsed * 2.0) * 0.25;
    ctx.save();
    ctx.translate(-18, 8);
    ctx.rotate(digAng);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-24, 14);
    ctx.lineTo(-34, 26);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.arc(8, -10, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(0, 229, 255, ${0.4 + 0.5 * Math.sin(elapsed * 6)})`;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(8, -12);
    ctx.lineTo(8, -195);
    ctx.stroke();
  } else {
    const bob = Math.sin(elapsed * 2.1) * 6;
    ctx.translate(0, bob - 18);

    ctx.strokeStyle = '#0c1017';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-48, 0);
    ctx.lineTo(26, 0);
    ctx.stroke();

    ctx.fillStyle = '#37474f';
    ctx.beginPath();
    ctx.roundRect(-14, -14, 28, 28, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffca28';
    ctx.beginPath();
    ctx.arc(0, 0, 8.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#e0f7fa';
    ctx.beginPath();
    ctx.ellipse(22, 0, 12, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    for (let wIdx = 0; wIdx < 3; wIdx++) {
      const wp = (elapsed * 1.2 + wIdx / 3) % 1;
      ctx.strokeStyle = `rgba(0, 229, 255, ${0.85 * (1 - wp)})`;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(32, 0, 14 + wp * 34, -0.7, 0.7);
      ctx.stroke();
    }
  }

  ctx.restore();
}

export function drawOutsideCatbot2D(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  elapsed: number,
  isTalking: boolean,
  gravity: 'low_g' | 'normal',
  showScanner: boolean,
  leanRad = 0
) {
  const hop =
    gravity === 'low_g'
      ? -Math.abs(Math.sin(elapsed * 2.8)) * 16
      : Math.sin(elapsed * 3.2) * 5 - 4;

  ctx.save();
  ctx.translate(cx, cy + hop);
  ctx.rotate(leanRad);
  ctx.scale(scale, scale);

  // Subtle shadow on ground underneath hop
  ctx.fillStyle = 'rgba(0, 229, 255, 0.25)';
  ctx.beginPath();
  ctx.ellipse(0, 40 - hop * 0.85, 22, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Animated Scanner Beam onto the NASA hardware on the right
  if (showScanner) {
    const scanAlpha = 0.22 + 0.16 * Math.sin(elapsed * 7);
    ctx.fillStyle = `rgba(0, 229, 255, ${scanAlpha})`;
    ctx.beginPath();
    ctx.moveTo(28, -2);
    ctx.lineTo(145, -36);
    ctx.lineTo(145, 24);
    ctx.closePath();
    ctx.fill();
  }

  // Unified Felice EVA 2.5D model matching the 3 official turnaround sheets (no tail):
  // Pearl-white armor, glowing cyan paw chest badge, dark knee joints, dark toe boots with cyan seams,
  // circular glowing cyan side ear pods, two white cat ears with cyan cores, pill-oval cyan eyes & w mouth.
  const chestGlowAlpha = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(elapsed * 3.5));

  // 1. White Legs, Dark Knees & Dark Toe Boots with Cyan Trim
  ctx.fillStyle = '#e2e8f8';
  ctx.strokeStyle = '#0c1017';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.roundRect(-14, 15, 10, 17, 4);
  ctx.roundRect(4, 15, 10, 17, 4);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(-13, 21, 8, 6, 2);
  ctx.roundRect(5, 21, 8, 6, 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#192234';
  ctx.beginPath();
  ctx.roundRect(-17, 31, 15, 8, 4);
  ctx.roundRect(2, 31, 15, 8, 4);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = '#2ceeff';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-16, 32);
  ctx.lineTo(-3, 32);
  ctx.moveTo(3, 32);
  ctx.lineTo(16, 32);
  ctx.moveTo(-9, 35);
  ctx.lineTo(-9, 38);
  ctx.moveTo(9, 35);
  ctx.lineTo(9, 38);
  ctx.stroke();

  // 2. Pearl-White Ceramic Chestplate + Glowing Cyan Cat Paw Chest Badge
  ctx.fillStyle = '#e8eefc';
  ctx.strokeStyle = '#0c1017';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-17, -4);
  ctx.lineTo(17, -4);
  ctx.lineTo(13, 18);
  ctx.quadraticCurveTo(0, 24, -13, 18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Fixed Paw Print Badge on Chest (glows & dims in place)
  ctx.fillStyle = '#0b1322';
  ctx.strokeStyle = `rgba(44, 238, 255, ${chestGlowAlpha})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 6, 6.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = `rgba(44, 238, 255, ${chestGlowAlpha})`;
  ctx.beginPath();
  ctx.ellipse(0, 8, 2.7, 2, 0, 0, Math.PI * 2);
  ctx.arc(-3, 4.5, 1.1, 0, Math.PI * 2);
  ctx.arc(0, 3.5, 1.15, 0, Math.PI * 2);
  ctx.arc(3, 4.5, 1.1, 0, Math.PI * 2);
  ctx.fill();

  // 3. White-Cuffed Arms & Dark Robotic Hands (right arm extending scanner)
  ctx.strokeStyle = '#0c1017';
  ctx.lineWidth = 7.5;
  ctx.beginPath();
  ctx.moveTo(-17, 0);
  ctx.lineTo(-22, 13);
  ctx.stroke();
  ctx.strokeStyle = '#e8eefc';
  ctx.lineWidth = 4.4;
  ctx.stroke();
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(-22, 16, 3.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#0c1017';
  ctx.lineWidth = 7.5;
  ctx.beginPath();
  ctx.moveTo(17, 0);
  ctx.lineTo(29, -3);
  ctx.stroke();
  ctx.strokeStyle = '#e8eefc';
  ctx.lineWidth = 4.4;
  ctx.stroke();
  ctx.fillStyle = '#2ceeff';
  ctx.beginPath();
  ctx.arc(31, -3, 4.2, 0, Math.PI * 2);
  ctx.fill();

  // 4. Unified Pearl-White Helmet, Cyan Sphere Antenna, Top Cat Ears & Circular Cyan Side Pods
  ctx.strokeStyle = '#0c1017';
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(0, -37);
  ctx.lineTo(0, -45);
  ctx.stroke();
  ctx.fillStyle = '#6cf7ff';
  ctx.beginPath();
  ctx.arc(0, -47, 4.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Two Pearl-White Top Cat Ears with Cyan Cores
  ctx.fillStyle = '#e8eefc';
  ctx.strokeStyle = '#0c1017';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(-24, -27);
  ctx.lineTo(-18, -44);
  ctx.lineTo(-6, -33);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(24, -27);
  ctx.lineTo(18, -44);
  ctx.lineTo(6, -33);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#2ceeff';
  ctx.beginPath();
  ctx.moveTo(-20, -30);
  ctx.lineTo(-17, -38);
  ctx.lineTo(-11, -32);
  ctx.closePath();
  ctx.moveTo(20, -30);
  ctx.lineTo(17, -38);
  ctx.lineTo(11, -32);
  ctx.closePath();
  ctx.fill();

  // Circular Cyan Side Ear-Pods
  ctx.fillStyle = '#e8eefc';
  ctx.strokeStyle = '#0c1017';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(-28, -19, 4.5, 8.5, 0, 0, Math.PI * 2);
  ctx.ellipse(28, -19, 4.5, 8.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = '#2ceeff';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.ellipse(-29, -19, 2.5, 6, 0, 0, Math.PI * 2);
  ctx.ellipse(29, -19, 2.5, 6, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Pearl-White Helmet Shell
  ctx.fillStyle = '#e8eefc';
  ctx.strokeStyle = '#0c1017';
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.roundRect(-26, -36, 52, 35, 16);
  ctx.fill();
  ctx.stroke();

  // Obsidian-Black Curved Visor + Pill-Oval Cyan Eyes + w Mouth
  ctx.fillStyle = '#060a14';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.roundRect(-22, -31, 44, 26, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#2ceeff';
  ctx.beginPath();
  ctx.roundRect(-13, -24, 7.5, 12, 3.8);
  ctx.roundRect(5.5, -24, 7.5, 12, 3.8);
  ctx.fill();

  ctx.strokeStyle = '#4ef2ff';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-4, -10);
  ctx.quadraticCurveTo(-2, -7.5, 0, -10);
  ctx.quadraticCurveTo(2, -7.5, 4, -10);
  ctx.stroke();
  if (isTalking) {
    ctx.fillStyle = '#19d4ff';
    ctx.beginPath();
    ctx.arc(0, -9, 2.4 + Math.abs(Math.sin(elapsed * 16)) * 1.4, 0, Math.PI);
    ctx.fill();
  }

  ctx.restore();
}

export function drawParkedRover2D(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  elapsed: number,
  hatchOpen: boolean,
  dest: PlanetTheme
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Soft ground shadow under parked rover
  ctx.fillStyle =
    dest === 'moon' ? 'rgba(14, 18, 26, 0.42)' : 'rgba(32, 14, 8, 0.42)';
  ctx.beginPath();
  ctx.ellipse(0, 42, 86, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  // Rocker-bogie suspension struts
  ctx.strokeStyle = '#0c1017';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-48, 18);
  ctx.lineTo(-32, 2);
  ctx.lineTo(-10, 18);
  ctx.moveTo(0, 18);
  ctx.lineTo(22, 2);
  ctx.lineTo(44, 18);
  ctx.stroke();

  // 4 Large 2D Rover Wheels
  const wheelXs = [-50, -14, 22, 52];
  for (const wx of wheelXs) {
    ctx.fillStyle = '#2c3645';
    ctx.strokeStyle = '#0c1017';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(wx, 28, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(wx, 28, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Main Rover Cabin Chassis
  ctx.fillStyle = '#d9e3ee';
  ctx.strokeStyle = '#0c1017';
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(-64, 14);
  ctx.lineTo(-56, -24);
  ctx.lineTo(24, -28);
  ctx.lineTo(66, -4);
  ctx.lineTo(66, 14);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Accent stripe
  ctx.fillStyle = '#0d6e5b';
  ctx.fillRect(-52, 2, 108, 8);

  // Curved Cockpit Window on front-right of Rover
  ctx.fillStyle = '#0c192c';
  ctx.strokeStyle = '#0c1017';
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(14, -24);
  ctx.lineTo(54, -4);
  ctx.lineTo(54, 4);
  ctx.lineTo(14, 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Window cyan reflection glint
  ctx.strokeStyle = 'rgba(128, 229, 255, 0.55)';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(20, -17);
  ctx.lineTo(42, -5);
  ctx.stroke();

  // Side EVA Airlock Hatch (glowing cyan when Catbot steps out!)
  ctx.fillStyle = hatchOpen ? '#00e5ff' : '#94a3b8';
  ctx.strokeStyle = '#0c1017';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.roundRect(-24, -14, 24, 22, 4);
  ctx.fill();
  ctx.stroke();

  // Top Dish & Blinking Beacon
  ctx.strokeStyle = '#0c1017';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-36, -25);
  ctx.lineTo(-36, -44);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(-36, -46, 14, 5, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  const beaconOn = Math.sin(elapsed * 4.5) > 0;
  ctx.fillStyle = beaconOn ? '#00e676' : '#065f46';
  ctx.beginPath();
  ctx.arc(4, -31, 3.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function createSeededBgStars(): BgStar[] {
  let s = 9421 >>> 0;
  const rng = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const starColors = ['#ffffff', '#dbeafe', '#fef3c7', '#e0e7ff', '#e2e8f0'];
  const stars: BgStar[] = [];
  for (let i = 0; i < 220; i++) {
    stars.push({
      nx: rng(),
      ny: rng(),
      r: 0.5 + Math.pow(rng(), 3) * 1.85,
      alpha: 0.35 + rng() * 0.65,
      twinkleSpeed: 1.1 + rng() * 2.2,
      twinkleOffset: rng() * Math.PI * 2,
      color: starColors[i % starColors.length]
    });
  }
  return stars;
}
