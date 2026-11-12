import React, { useEffect, useRef } from 'react';

/**
 * Animated deep-space backdrop visible through the spacecraft window during the ending:
 * drifting starfield + meteors floating smoothly outside the cockpit glass.
 */
export const FloatingMeteorsWindowCanvas: React.FC<{ reduceMotion?: boolean }> = ({
  reduceMotion = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const stars = Array.from({ length: 130 }, (_, i) => {
      const h1 = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
      const h2 = Math.sin(i * 78.233 + 1.618) * 43758.5453;
      return {
        x: h1 - Math.floor(h1),
        y: h2 - Math.floor(h2),
        r: 0.7 + ((i * 17) % 10) * 0.14,
        twinkle: (i * 0.61) % (Math.PI * 2)
      };
    });

    const meteors = Array.from({ length: 11 }, (_, i) => ({
      seed: i,
      x: ((i * 173 + 50) % 1000) / 1000,
      y: ((i * 227 + 90) % 720) / 1000,
      vx: -0.025 - (i % 4) * 0.014,
      vy: 0.008 + (i % 3) * 0.007,
      size: 11 + (i % 4) * 5.5,
      rot: i * 0.7,
      rotSpeed: (i % 2 === 0 ? 1 : -1) * (0.25 + (i % 3) * 0.16),
      vertices: Array.from({ length: 8 }, (_, v) => {
        const ang = (v / 8) * Math.PI * 2;
        const rad = 0.72 + ((i * 7 + v * 11) % 10) * 0.036;
        return { x: Math.cos(ang) * rad, y: Math.sin(ang) * rad };
      })
    }));

    let rafId = 0;
    const start = performance.now();

    const draw = (now: number) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const t = reduceMotion ? 1.5 : (now - start) / 1000;

      // Deep cosmos gradient
      const bg = ctx.createRadialGradient(w * 0.5, h * 0.35, 30, w * 0.5, h * 0.45, Math.max(w, h) * 0.85);
      bg.addColorStop(0, '#070c16');
      bg.addColorStop(0.55, '#03060d');
      bg.addColorStop(1, '#010205');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Stars
      stars.forEach((s) => {
        const a = 0.45 + 0.48 * Math.sin(t * 1.4 + s.twinkle);
        ctx.fillStyle = `rgba(226, 232, 240, ${a.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Floating meteors & rocky fragments with subtle dust wakes
      meteors.forEach((m) => {
        const mx = (((m.x + t * m.vx) % 1.18) + 1.18) % 1.18 - 0.09;
        const my = (((m.y + t * m.vy) % 0.92) + 0.92) % 0.92 - 0.06;
        const px = mx * w;
        const py = my * h;

        // Subtle stardust trail behind meteor
        const tailGrad = ctx.createLinearGradient(px, py, px - m.vx * 1150, py - m.vy * 1150);
        tailGrad.addColorStop(0, 'rgba(148, 163, 184, 0.34)');
        tailGrad.addColorStop(1, 'rgba(148, 163, 184, 0)');
        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = Math.max(1.5, m.size * 0.18);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px - m.vx * 1150, py - m.vy * 1150);
        ctx.stroke();

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(m.rot + t * m.rotSpeed);
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        m.vertices.forEach((v, idx) => {
          const vx = v.x * m.size;
          const vy = v.y * m.size;
          if (idx === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Tiny surface crater dimples
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(-m.size * 0.22, -m.size * 0.12, m.size * 0.16, 0, Math.PI * 2);
        ctx.arc(m.size * 0.2, m.size * 0.18, m.size * 0.11, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      if (!reduceMotion) {
        rafId = requestAnimationFrame(draw);
      }
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [reduceMotion]);

  return <canvas ref={canvasRef} className="end-window-bg-canvas" aria-hidden="true" />;
};

/**
 * Pure black-and-white Chrome-Dino-style runner in the upper-left cockpit window:
 * Felice is rendered with a transparent interior and crisp white outline, running
 * automatically and jumping cleanly over scrolling Moon craters.
 */
export const FeliceDinoRunnerCanvas: React.FC<{ reduceMotion?: boolean }> = ({
  reduceMotion = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    interface Crater {
      x: number;
      w: number;
      h: number;
      scored: boolean;
    }

    const runner = {
      x: 56,
      yOffset: 0,
      vy: 0,
      isJumping: false,
      score: 0
    };

    const craters: Crater[] = [
      { x: 240, w: 34, h: 12, scored: false },
      { x: 430, w: 46, h: 15, scored: false }
    ];

    const pebbles = Array.from({ length: 16 }, (_, i) => ({
      x: i * 32,
      w: 3 + (i % 4) * 2
    }));

    let rafId = 0;
    let lastTime = performance.now();

    const drawFeliceOutline = (
      x: number,
      groundY: number,
      yOff: number,
      legPhase: number
    ) => {
      const fy = groundY - yOff;
      ctx.save();
      ctx.translate(x, fy);
      ctx.strokeStyle = '#ffffff';
      ctx.fillStyle = 'rgba(0, 0, 0, 0)'; // strictly transparent interior
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      // No tail — clean oval head & upright Chrome-Dino torso outline

      // Torso (transparent fill, white outline)
      ctx.beginPath();
      ctx.roundRect(-11, -27, 20, 16, 4);
      ctx.stroke();

      // Oval head (transparent interior, crisp white stroke)
      ctx.beginPath();
      ctx.ellipse(-1, -38, 14, 10.5, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Pointed cat ears sitting on the oval head
      ctx.beginPath();
      ctx.moveTo(-11, -45);
      ctx.lineTo(-9, -56);
      ctx.lineTo(-4, -48);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(2, -48);
      ctx.lineTo(7, -56);
      ctx.lineTo(9, -45);
      ctx.stroke();

      // Top spherical antenna
      ctx.beginPath();
      ctx.moveTo(-1, -48.5);
      ctx.lineTo(-1, -55);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-1, -57.5, 2.2, 0, Math.PI * 2);
      ctx.stroke();

      // Two crisp white dot eyes & cute :3 cat mouth
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-5, -39, 1.7, 0, Math.PI * 2);
      ctx.arc(3, -39, 1.7, 0, Math.PI * 2);
      ctx.fill();

      // Cute ':3' feline mouth shape
      ctx.beginPath();
      ctx.moveTo(-4, -34.5);
      ctx.quadraticCurveTo(-2.2, -32.2, -1, -34.5);
      ctx.quadraticCurveTo(0.2, -32.2, 2, -34.5);
      ctx.stroke();

      // Running Chrome-Dino style legs
      const stride = yOff > 2 ? 4 : Math.sin(legPhase) * 6;
      // Back leg
      ctx.beginPath();
      ctx.moveTo(-5, -11);
      ctx.lineTo(-5 - stride, -1);
      ctx.lineTo(-1 - stride, -1);
      ctx.stroke();
      // Front leg
      ctx.beginPath();
      ctx.moveTo(3, -11);
      ctx.lineTo(3 + stride, -1);
      ctx.lineTo(7 + stride, -1);
      ctx.stroke();

      ctx.restore();
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const w = canvas.width;
      const h = canvas.height;
      const groundY = h - 24;
      const speed = 155;

      if (!reduceMotion) {
        // Scroll moon craters left
        craters.forEach((c) => {
          c.x -= speed * dt;
          if (!c.scored && c.x + c.w < runner.x - 14) {
            c.scored = true;
            runner.score += 1;
          }
          // Auto-jump before reaching crater rim
          const dist = c.x - runner.x;
          if (!runner.isJumping && dist > 18 && dist < 56) {
            runner.isJumping = true;
            runner.vy = 295;
          }
        });

        // Recycle craters off left edge
        if (craters[0].x + craters[0].w < -20) {
          craters.shift();
          const lastX = craters[craters.length - 1]?.x ?? 260;
          const nextGap = 155 + Math.random() * 95;
          craters.push({
            x: Math.max(w + 18, lastX + nextGap),
            w: 30 + Math.random() * 20,
            h: 11 + Math.random() * 6,
            scored: false
          });
        }

        // Scroll lunar dust pebbles
        pebbles.forEach((p) => {
          p.x -= speed * dt;
          if (p.x < -12) p.x += w + 24;
        });

        // Jump physics
        if (runner.isJumping) {
          runner.yOffset += runner.vy * dt;
          runner.vy -= 760 * dt;
          if (runner.yOffset <= 0) {
            runner.yOffset = 0;
            runner.vy = 0;
            runner.isJumping = false;
          }
        }
      }

      // Monochrome B&W clear (black card interior or dark transparent monochrome)
      ctx.clearRect(0, 0, w, h);

      // Ground horizon line
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(w, groundY);
      ctx.stroke();

      // Lunar ground pebbles
      ctx.fillStyle = '#ffffff';
      pebbles.forEach((p) => {
        ctx.fillRect(p.x, groundY + 6 + (p.w % 3) * 3, p.w, 1.5);
      });

      // Moon craters along lunar ground (monochrome white outline + black interior)
      craters.forEach((c) => {
        const cx = c.x + c.w * 0.5;
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Raised crater rim lip + depressed basin bowl
        ctx.moveTo(c.x - 4, groundY);
        ctx.lineTo(c.x + 5, groundY - c.h);
        ctx.quadraticCurveTo(cx, groundY - c.h * 0.25, c.x + c.w - 5, groundY - c.h);
        ctx.lineTo(c.x + c.w + 4, groundY);
        ctx.stroke();

        // Inner crater pit dashed shadow
        ctx.beginPath();
        ctx.ellipse(cx, groundY + 3, c.w * 0.34, 3.2, 0, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Transparent white-outline Felice hopping over craters
      drawFeliceOutline(runner.x, groundY, runner.yOffset, (now / 85) % (Math.PI * 2));

      // Monochrome Chrome-Dino HUD counter
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 11px monospace';
      ctx.textAlign = 'right';
      const padScore = String(runner.score).padStart(4, '0');
      ctx.fillText(`CRATERS ${padScore}`, w - 10, 18);
      ctx.textAlign = 'left';
      ctx.fillText('FELICE // LUNAR RUN (AUTO)', 10, 18);

      if (!reduceMotion) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      width={410}
      height={145}
      className="end-felice-dino-canvas"
      aria-label="Monochrome black-and-white Chrome-Dino animation of transparent white-outlined Felice automatically jumping over Moon craters"
    />
  );
};

/**
 * Pure Black & White retro space arcade game running inside the navigation console screen.
 * Plays automatically on autopilot while also accepting Left/Right/Space input if the user plays.
 */
export const RetroSpaceGameCanvas: React.FC<{ reduceMotion?: boolean }> = ({
  reduceMotion = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    interface Bullet {
      x: number;
      y: number;
    }
    interface Target {
      x: number;
      y: number;
      r: number;
      vy: number;
    }
    interface Pop {
      x: number;
      y: number;
      life: number;
    }

    let shipX = 230;
    let score = 0;
    let fireCooldown = 0;
    let spawnCooldown = 0.2;
    const bullets: Bullet[] = [];
    const targets: Target[] = [
      { x: 140, y: 34, r: 9, vy: 56 },
      { x: 310, y: 64, r: 10, vy: 52 }
    ];
    const pops: Pop[] = [];
    const stars = Array.from({ length: 34 }, (_, i) => {
      const h1 = Math.sin(i * 19.31 + 2.71) * 43758.5453;
      const h2 = Math.sin(i * 47.17 + 9.13) * 43758.5453;
      return {
        x: (h1 - Math.floor(h1)) * 460,
        y: (h2 - Math.floor(h2)) * 138,
        s: i % 2 === 0 ? 1 : 2
      };
    });

    let rafId = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const w = canvas.width;
      const h = canvas.height;
      const shipY = h - 20;

      if (!reduceMotion) {
        // Scroll mono starfield
        stars.forEach((st) => {
          st.y += 38 * dt;
          if (st.y > h) {
            st.y = 0;
            st.x = (st.x + 73) % w;
          }
        });

        // Player control or smart autopilot targeting
        if (keysRef.current.left) shipX -= 220 * dt;
        else if (keysRef.current.right) shipX += 220 * dt;
        else {
          const threat = targets.reduce<Target | null>(
            (best, t) => (!best || t.y > best.y ? t : best),
            null
          );
          const aimX = threat ? threat.x : w * 0.5 + Math.sin(now / 650) * 110;
          const diff = aimX - shipX;
          shipX += Math.sign(diff) * Math.min(Math.abs(diff), 175 * dt);
        }
        shipX = Math.max(22, Math.min(w - 22, shipX));

        // Fire monochrome pixel shots
        fireCooldown -= dt;
        if (fireCooldown <= 0) {
          bullets.push({ x: shipX, y: shipY - 12 });
          fireCooldown = 0.28;
        }

        // Spawn targets
        spawnCooldown -= dt;
        if (spawnCooldown <= 0 && targets.length < 7) {
          targets.push({
            x: 24 + Math.random() * (w - 48),
            y: -12,
            r: 7 + Math.random() * 5,
            vy: 48 + Math.random() * 34
          });
          spawnCooldown = 0.52;
        }

        // Update bullets & targets
        for (let bi = bullets.length - 1; bi >= 0; bi--) {
          bullets[bi].y -= 260 * dt;
          if (bullets[bi].y < -8) {
            bullets.splice(bi, 1);
            continue;
          }
          for (let ti = targets.length - 1; ti >= 0; ti--) {
            const dx = bullets[bi].x - targets[ti].x;
            const dy = bullets[bi].y - targets[ti].y;
            if (dx * dx + dy * dy <= (targets[ti].r + 4) * (targets[ti].r + 4)) {
              pops.push({ x: targets[ti].x, y: targets[ti].y, life: 0.3 });
              targets.splice(ti, 1);
              bullets.splice(bi, 1);
              score += 100;
              break;
            }
          }
        }

        for (let ti = targets.length - 1; ti >= 0; ti--) {
          targets[ti].y += targets[ti].vy * dt;
          if (targets[ti].y > h + 16) targets.splice(ti, 1);
        }

        for (let pi = pops.length - 1; pi >= 0; pi--) {
          pops[pi].life -= dt;
          if (pops[pi].life <= 0) pops.splice(pi, 1);
        }
      }

      // Crisp Black & White retro screen
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      // Monochrome stars
      ctx.fillStyle = '#ffffff';
      stars.forEach((st) => ctx.fillRect(st.x, st.y, st.s, st.s));

      // Bullets
      bullets.forEach((b) => ctx.fillRect(b.x - 1, b.y - 6, 2.5, 8));

      // Targets (white wireframe octagon asteroids)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.6;
      targets.forEach((t) => {
        ctx.beginPath();
        for (let k = 0; k < 7; k++) {
          const a = (k / 7) * Math.PI * 2 + now * 0.0012;
          const r = t.r * (k % 2 === 0 ? 1 : 0.72);
          const vx = t.x + Math.cos(a) * r;
          const vy = t.y + Math.sin(a) * r;
          if (k === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        }
        ctx.closePath();
        ctx.stroke();
      });

      // Pixel explosion sparks
      pops.forEach((p) => {
        const d = (0.3 - p.life) * 44;
        for (let k = 0; k < 6; k++) {
          const a = (k / 6) * Math.PI * 2;
          ctx.fillRect(p.x + Math.cos(a) * d, p.y + Math.sin(a) * d, 2.5, 2.5);
        }
      });

      // Player retro pixel starfighter (white outline, black fill)
      ctx.fillStyle = '#000000';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(shipX, shipY - 12);
      ctx.lineTo(shipX - 11, shipY + 7);
      ctx.lineTo(shipX - 4, shipY + 4);
      ctx.lineTo(shipX, shipY + 9);
      ctx.lineTo(shipX + 4, shipY + 4);
      ctx.lineTo(shipX + 11, shipY + 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Monochrome retro arcade HUD
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 10px monospace';
      ctx.fillText(`RETRO NAV GAME // B&W MODE`, 10, 14);
      ctx.textAlign = 'right';
      ctx.fillText(`SCORE ${String(score).padStart(6, '0')}`, w - 10, 14);
      ctx.textAlign = 'left';

      if (!reduceMotion) {
        rafId = requestAnimationFrame(frame);
      }
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      width={460}
      height={138}
      className="end-retro-game-canvas"
      aria-label="Black and white retro space arcade game running inside the navigation console"
    />
  );
};
