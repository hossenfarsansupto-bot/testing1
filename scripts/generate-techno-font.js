import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Pure Node.js TrueType (.ttf) generator for "CosmicTech",
 * a rounded-square futuristic techno font matching the uploaded specimen.
 * Zero external packages, zero network calls.
 */

const UPM = 1000;
const CAP = 700;
const XH = 500;
const DESC = -180;
const SW = 108; // Stroke thickness matching specimen weight

/**
 * Converts a list of corner vertices `[x, y, r?]` into a TrueType quadratic contour.
 * When `r > 0`, replaces the corner vertex with an off-curve Bezier control point
 * flanked by two on-curve tangent points at distance `r`.
 */
function roundedPoly(corners, defaultR = 0) {
  const n = corners.length;
  const pts = [];

  for (let i = 0; i < n; i++) {
    const prev = corners[(i - 1 + n) % n];
    const curr = corners[i];
    const next = corners[(i + 1) % n];

    const r = curr[2] !== undefined ? curr[2] : defaultR;
    if (r <= 0) {
      pts.push({ x: Math.round(curr[0]), y: Math.round(curr[1]), onCurve: true });
      continue;
    }

    const dx1 = prev[0] - curr[0];
    const dy1 = prev[1] - curr[1];
    const len1 = Math.hypot(dx1, dy1);

    const dx2 = next[0] - curr[0];
    const dy2 = next[1] - curr[1];
    const len2 = Math.hypot(dx2, dy2);

    const d1 = Math.min(r, len1 * 0.48);
    const d2 = Math.min(r, len2 * 0.48);

    pts.push({
      x: Math.round(curr[0] + (dx1 / len1) * d1),
      y: Math.round(curr[1] + (dy1 / len1) * d1),
      onCurve: true
    });
    pts.push({
      x: Math.round(curr[0]),
      y: Math.round(curr[1]),
      onCurve: false
    });
    pts.push({
      x: Math.round(curr[0] + (dx2 / len2) * d2),
      y: Math.round(curr[1] + (dy2 / len2) * d2),
      onCurve: true
    });
  }

  return pts;
}

// Signed area > 0 means counter-clockwise in Y-up TrueType coords;
// Signed area < 0 means clockwise (outer contour).
function ensureWinding(pts, wantClockwise) {
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    area += a.x * b.y - b.x * a.y;
  }
  const isCW = area < 0;
  if (isCW !== wantClockwise) {
    return [...pts].reverse();
  }
  return pts;
}

function cw(corners, defaultR = 0) {
  return ensureWinding(roundedPoly(corners, defaultR), true);
}

function ccw(corners, defaultR = 0) {
  return ensureWinding(roundedPoly(corners, defaultR), false);
}

function rect(x1, y1, x2, y2, r = 0, isHole = false) {
  const c = [
    [x1, y1, r],
    [x1, y2, r],
    [x2, y2, r],
    [x2, y1, r]
  ];
  return isHole ? ccw(c, r) : cw(c, r);
}

// Helper for rounded-square C-like or O-like frame contours
const RO = 155; // Outer corner radius
const RI = 72;  // Inner hole corner radius

function buildGlyphs() {
  const glyphs = {};

  // .notdef (index 0)
  glyphs[0] = {
    advance: 600,
    contours: [rect(80, 0, 520, 700, 0, false), rect(160, 80, 440, 620, 0, true)]
  };

  // Space
  glyphs[32] = { advance: 340, contours: [] };

  // ================= UPPERCASE A-Z =================
  // A: Flat feet, vertical legs, rounded top arch, mid crossbar
  glyphs[65] = {
    advance: 740,
    contours: [
      cw([
        [60, 0, 0],
        [60, CAP, RO],
        [680, CAP, RO],
        [680, 0, 0],
        [680 - SW, 0, 0],
        [680 - SW, 265, 0],
        [60 + SW, 265, 0],
        [60 + SW, 0, 0]
      ]),
      ccw([
        [60 + SW, 355, 0],
        [60 + SW, CAP - SW, RI],
        [680 - SW, CAP - SW, RI],
        [680 - SW, 355, 0]
      ])
    ]
  };

  // B: Straight left, rounded right top & bottom lobes
  glyphs[66] = {
    advance: 740,
    contours: [
      cw([
        [60, 0, 0],
        [60, CAP, 0],
        [650, CAP, RO],
        [650, 385, 110],
        [570, 352, 0],
        [670, 315, 110],
        [670, 0, RO]
      ]),
      ccw([
        [60 + SW, CAP - SW, 0],
        [60 + SW, 395, 0],
        [650 - SW, 395, 65],
        [650 - SW, CAP - SW, 65]
      ]),
      ccw([
        [60 + SW, 305, 0],
        [60 + SW, SW, 0],
        [670 - SW, SW, 65],
        [670 - SW, 305, 65]
      ])
    ]
  };

  // C: Rounded left corners, open square ends on right
  glyphs[67] = {
    advance: 720,
    contours: [
      cw([
        [660, 0, 0],
        [60, 0, RO],
        [60, CAP, RO],
        [660, CAP, 0],
        [660, CAP - SW, 0],
        [60 + SW, CAP - SW, RI],
        [60 + SW, SW, RI],
        [660, SW, 0]
      ])
    ]
  };

  // D: Straight left, rounded right top & bottom
  glyphs[68] = {
    advance: 740,
    contours: [
      cw([
        [60, 0, 0],
        [60, CAP, 0],
        [680, CAP, RO],
        [680, 0, RO]
      ]),
      ccw([
        [60 + SW, SW, 0],
        [60 + SW, CAP - SW, 0],
        [680 - SW, CAP - SW, RI],
        [680 - SW, SW, RI]
      ])
    ]
  };

  // E
  glyphs[69] = {
    advance: 680,
    contours: [
      cw([
        [620, 0, 0],
        [60, 0, 0],
        [60, CAP, 0],
        [620, CAP, 0],
        [620, CAP - SW, 0],
        [60 + SW, CAP - SW, 0],
        [60 + SW, 395, 0],
        [540, 395, 0],
        [540, 305, 0],
        [60 + SW, 305, 0],
        [60 + SW, SW, 0],
        [620, SW, 0]
      ])
    ]
  };

  // F
  glyphs[70] = {
    advance: 640,
    contours: [
      cw([
        [60, 0, 0],
        [60, CAP, 0],
        [590, CAP, 0],
        [590, CAP - SW, 0],
        [60 + SW, CAP - SW, 0],
        [60 + SW, 395, 0],
        [510, 395, 0],
        [510, 305, 0],
        [60 + SW, 305, 0],
        [60 + SW, 0, 0]
      ])
    ]
  };

  // G: Rounded-square C with bottom-right turn-in crossbar
  glyphs[71] = {
    advance: 750,
    contours: [
      cw([
        [680, 0, RO],
        [60, 0, RO],
        [60, CAP, RO],
        [680, CAP, 0],
        [680, CAP - SW, 0],
        [60 + SW, CAP - SW, RI],
        [60 + SW, SW, RI],
        [680 - SW, SW, RI],
        [680 - SW, 285, 0],
        [370, 285, 0],
        [370, 375, 0],
        [680, 375, 0]
      ])
    ]
  };

  // H
  glyphs[72] = {
    advance: 750,
    contours: [
      cw([
        [60, 0, 0],
        [60, CAP, 0],
        [60 + SW, CAP, 0],
        [60 + SW, 395, 0],
        [690 - SW, 395, 0],
        [690 - SW, CAP, 0],
        [690, CAP, 0],
        [690, 0, 0],
        [690 - SW, 0, 0],
        [690 - SW, 305, 0],
        [60 + SW, 305, 0],
        [60 + SW, 0, 0]
      ])
    ]
  };

  // I
  glyphs[73] = {
    advance: 240,
    contours: [rect(72, 0, 72 + SW, CAP, 0, false)]
  };

  // J
  glyphs[74] = {
    advance: 620,
    contours: [
      cw([
        [60, 0, 0],
        [60, SW, 0],
        [540 - SW, SW, RI],
        [540 - SW, CAP, 0],
        [540, CAP, 0],
        [540, 0, RO]
      ])
    ]
  };

  // K
  glyphs[75] = {
    advance: 720,
    contours: [
      rect(60, 0, 60 + SW, CAP, 0, false),
      cw([
        [660, 0, 0],
        [660, 280, 95],
        [340, 345, 0],
        [660, 415, 95],
        [660, CAP, 0],
        [660 - SW, CAP, 0],
        [660 - SW, 455, 50],
        [60 + SW, 375, 0],
        [60 + SW, 315, 0],
        [660 - SW, 240, 50],
        [660 - SW, 0, 0]
      ])
    ]
  };

  // L
  glyphs[76] = {
    advance: 640,
    contours: [
      cw([
        [60, 0, 0],
        [60, CAP, 0],
        [60 + SW, CAP, 0],
        [60 + SW, SW, 0],
        [600, SW, 0],
        [600, 0, 0]
      ])
    ]
  };

  // M: Flat top 3-leg rounded-bridge futuristic M from specimen!
  glyphs[77] = {
    advance: 920,
    contours: [
      cw([
        [60, 0, 0],
        [60, CAP, RO],
        [860, CAP, RO],
        [860, 0, 0],
        [860 - SW, 0, 0],
        [860 - SW, CAP - SW, 65],
        [460 + SW / 2, CAP - SW, 65],
        [460 + SW / 2, 0, 0],
        [460 - SW / 2, 0, 0],
        [460 - SW / 2, CAP - SW, 65],
        [60 + SW, CAP - SW, 65],
        [60 + SW, 0, 0]
      ])
    ]
  };

  // N: Rounded arch top, 2 straight legs
  glyphs[78] = {
    advance: 740,
    contours: [
      cw([
        [60, 0, 0],
        [60, CAP, RO],
        [680, CAP, RO],
        [680, 0, 0],
        [680 - SW, 0, 0],
        [680 - SW, CAP - SW, RI],
        [60 + SW, CAP - SW, RI],
        [60 + SW, 0, 0]
      ])
    ]
  };

  // O: Rounded rectangle
  glyphs[79] = {
    advance: 760,
    contours: [
      rect(60, 0, 700, CAP, RO, false),
      rect(60 + SW, SW, 700 - SW, CAP - SW, RI, true)
    ]
  };

  // P
  glyphs[80] = {
    advance: 720,
    contours: [
      cw([
        [60, 0, 0],
        [60, CAP, 0],
        [660, CAP, RO],
        [660, 290, RO],
        [60 + SW, 290, 0],
        [60 + SW, 0, 0]
      ]),
      ccw([
        [60 + SW, 380, 0],
        [60 + SW, CAP - SW, 0],
        [660 - SW, CAP - SW, RI],
        [660 - SW, 380, RI]
      ])
    ]
  };

  // Q
  glyphs[81] = {
    advance: 760,
    contours: [
      rect(60, 0, 700, CAP, RO, false),
      rect(60 + SW, SW, 700 - SW, CAP - SW, RI, true),
      cw([
        [440, 140, 0],
        [520, 190, 0],
        [720, -60, 0],
        [640, -110, 0]
      ])
    ]
  };

  // R
  glyphs[82] = {
    advance: 740,
    contours: [
      cw([
        [60, 0, 0],
        [60, CAP, 0],
        [670, CAP, RO],
        [670, 325, 115],
        [585, 300, 0],
        [675, 250, 85],
        [675, 0, 0],
        [675 - SW, 0, 0],
        [675 - SW, 240, 45],
        [530, 300, 0],
        [60 + SW, 300, 0],
        [60 + SW, 0, 0]
      ]),
      ccw([
        [60 + SW, 390, 0],
        [60 + SW, CAP - SW, 0],
        [670 - SW, CAP - SW, 65],
        [670 - SW, 390, 65]
      ])
    ]
  };

  // S: Classic squared-S with rounded top-left & bottom-right corners
  glyphs[83] = {
    advance: 730,
    contours: [
      cw([
        [660, CAP, 0],
        [60, CAP, RO],
        [60, 310, RO],
        [670 - SW, 310, 40],
        [670 - SW, SW, 40],
        [60, SW, 0],
        [60, 0, 0],
        [670, 0, RO],
        [670, 395, RO],
        [60 + SW, 395, 40],
        [60 + SW, CAP - SW, 40],
        [660, CAP - SW, 0]
      ])
    ]
  };

  // T
  glyphs[84] = {
    advance: 680,
    contours: [
      cw([
        [40, CAP, 0],
        [640, CAP, 0],
        [640, CAP - SW, 0],
        [340 + SW / 2, CAP - SW, 0],
        [340 + SW / 2, 0, 0],
        [340 - SW / 2, 0, 0],
        [340 - SW / 2, CAP - SW, 0],
        [40, CAP - SW, 0]
      ])
    ]
  };

  // U
  glyphs[85] = {
    advance: 740,
    contours: [
      cw([
        [60, CAP, 0],
        [60 + SW, CAP, 0],
        [60 + SW, SW, RI],
        [680 - SW, SW, RI],
        [680 - SW, CAP, 0],
        [680, CAP, 0],
        [680, 0, RO],
        [60, 0, RO]
      ])
    ]
  };

  // V
  glyphs[86] = {
    advance: 740,
    contours: [
      cw([
        [50, CAP, 0],
        [152, CAP, 0],
        [370, 120, 0],
        [588, CAP, 0],
        [690, CAP, 0],
        [435, 0, 40],
        [305, 0, 40]
      ])
    ]
  };

  // W: Rounded-bottom 3-leg W matching M inverted
  glyphs[87] = {
    advance: 920,
    contours: [
      cw([
        [60, CAP, 0],
        [60 + SW, CAP, 0],
        [60 + SW, SW, 65],
        [460 - SW / 2, SW, 65],
        [460 - SW / 2, CAP, 0],
        [460 + SW / 2, CAP, 0],
        [460 + SW / 2, SW, 65],
        [860 - SW, SW, 65],
        [860 - SW, CAP, 0],
        [860, CAP, 0],
        [860, 0, RO],
        [460, 0, 110],
        [60, 0, RO]
      ])
    ]
  };

  // X: Squared-elbow X matching specimen
  glyphs[88] = {
    advance: 720,
    contours: [
      cw([
        [60, CAP, 0],
        [60 + SW, CAP, 0],
        [60 + SW, 455, 45],
        [360, 395, 0],
        [660 - SW, 455, 45],
        [660 - SW, CAP, 0],
        [660, CAP, 0],
        [660, 415, 95],
        [460, 350, 0],
        [660, 285, 95],
        [660, 0, 0],
        [660 - SW, 0, 0],
        [660 - SW, 245, 45],
        [360, 305, 0],
        [60 + SW, 245, 45],
        [60 + SW, 0, 0],
        [60, 0, 0],
        [60, 285, 95],
        [260, 350, 0],
        [60, 415, 95]
      ])
    ]
  };

  // Y: Cup top + flat bottom left hook matching specimen
  glyphs[89] = {
    advance: 720,
    contours: [
      cw([
        [60, CAP, 0],
        [60 + SW, CAP, 0],
        [60 + SW, 320, RI],
        [660 - SW, 320, RI],
        [660 - SW, CAP, 0],
        [660, CAP, 0],
        [660, 0, RO],
        [80, 0, 0],
        [80, SW, 0],
        [660 - SW, SW, RI],
        [660 - SW, 225, 0],
        [60, 225, RO]
      ])
    ]
  };

  // Z: Clean diagonal Z matching specimen
  glyphs[90] = {
    advance: 690,
    contours: [
      cw([
        [60, CAP, 0],
        [630, CAP, 0],
        [630, CAP - SW, 0],
        [188, SW, 0],
        [630, SW, 0],
        [630, 0, 0],
        [60, 0, 0],
        [60, SW, 0],
        [502, CAP - SW, 0],
        [60, CAP - SW, 0]
      ])
    ]
  };

  // ================= LOWERCASE a-z =================
  const LSW = 96;
  const LR = 115;
  const LRI = 55;

  // a
  glyphs[97] = {
    advance: 660,
    contours: [
      cw([
        [60, XH, 0],
        [600, XH, LR],
        [600, 0, 0],
        [60, 0, LR],
        [60, 290, LR],
        [600 - LSW, 290, 0],
        [600 - LSW, XH - LSW, LRI],
        [60, XH - LSW, 0]
      ]),
      ccw([
        [60 + LSW, 210, LRI],
        [60 + LSW, LSW, LRI],
        [600 - LSW, LSW, 0],
        [600 - LSW, 210, 0]
      ])
    ]
  };

  // b
  glyphs[98] = {
    advance: 680,
    contours: [
      cw([
        [60, 0, 0],
        [60, CAP, 0],
        [60 + LSW, CAP, 0],
        [60 + LSW, XH, 0],
        [620, XH, LR],
        [620, 0, LR]
      ]),
      ccw([
        [60 + LSW, LSW, 0],
        [60 + LSW, XH - LSW, 0],
        [620 - LSW, XH - LSW, LRI],
        [620 - LSW, LSW, LRI]
      ])
    ]
  };

  // c
  glyphs[99] = {
    advance: 620,
    contours: [
      cw([
        [560, 0, 0],
        [60, 0, LR],
        [60, XH, LR],
        [560, XH, 0],
        [560, XH - LSW, 0],
        [60 + LSW, XH - LSW, LRI],
        [60 + LSW, LSW, LRI],
        [560, LSW, 0]
      ])
    ]
  };

  // d
  glyphs[100] = {
    advance: 680,
    contours: [
      cw([
        [620, 0, 0],
        [60, 0, LR],
        [60, XH, LR],
        [620 - LSW, XH, 0],
        [620 - LSW, CAP, 0],
        [620, CAP, 0]
      ]),
      ccw([
        [60 + LSW, LSW, LRI],
        [60 + LSW, XH - LSW, LRI],
        [620 - LSW, XH - LSW, 0],
        [620 - LSW, LSW, 0]
      ])
    ]
  };

  // e
  glyphs[101] = {
    advance: 650,
    contours: [
      cw([
        [590, 0, 0],
        [60, 0, LR],
        [60, XH, LR],
        [590, XH, LR],
        [590, 215, 0],
        [60 + LSW, 215, 0],
        [60 + LSW, LSW, LRI],
        [590, LSW, 0]
      ]),
      ccw([
        [60 + LSW, 295, 0],
        [60 + LSW, XH - LSW, LRI],
        [590 - LSW, XH - LSW, LRI],
        [590 - LSW, 295, 0]
      ])
    ]
  };

  // f
  glyphs[102] = {
    advance: 460,
    contours: [
      cw([
        [140, 0, 0],
        [140, CAP, LR],
        [430, CAP, 0],
        [430, CAP - LSW, 0],
        [140 + LSW, CAP - LSW, LRI],
        [140 + LSW, XH, 0],
        [390, XH, 0],
        [390, XH - LSW, 0],
        [140 + LSW, XH - LSW, 0],
        [140 + LSW, 0, 0]
      ])
    ]
  };

  // g
  glyphs[103] = {
    advance: 680,
    contours: [
      cw([
        [620, DESC, LR],
        [80, DESC, 0],
        [80, DESC + LSW, 0],
        [620 - LSW, DESC + LSW, LRI],
        [620 - LSW, 0, 0],
        [60, 0, LR],
        [60, XH, LR],
        [620, XH, LR]
      ]),
      ccw([
        [60 + LSW, LSW, LRI],
        [60 + LSW, XH - LSW, LRI],
        [620 - LSW, XH - LSW, LRI],
        [620 - LSW, LSW, 0]
      ])
    ]
  };

  // h
  glyphs[104] = {
    advance: 680,
    contours: [
      cw([
        [60, 0, 0],
        [60, CAP, 0],
        [60 + LSW, CAP, 0],
        [60 + LSW, XH, 0],
        [620, XH, LR],
        [620, 0, 0],
        [620 - LSW, 0, 0],
        [620 - LSW, XH - LSW, LRI],
        [60 + LSW, XH - LSW, 0],
        [60 + LSW, 0, 0]
      ])
    ]
  };

  // i
  glyphs[105] = {
    advance: 230,
    contours: [
      rect(72, 0, 72 + LSW, XH, 0, false),
      rect(72, XH + 70, 72 + LSW, XH + 160, 0, false)
    ]
  };

  // j
  glyphs[106] = {
    advance: 360,
    contours: [
      cw([
        [50, DESC, 0],
        [50, DESC + LSW, 0],
        [290 - LSW, DESC + LSW, 55],
        [290 - LSW, XH, 0],
        [290, XH, 0],
        [290, DESC, LR]
      ]),
      rect(290 - LSW, XH + 70, 290, XH + 160, 0, false)
    ]
  };

  // k
  glyphs[107] = {
    advance: 630,
    contours: [
      rect(60, 0, 60 + LSW, CAP, 0, false),
      cw([
        [570, 0, 0],
        [570, 200, 75],
        [300, 250, 0],
        [570, 305, 75],
        [570, XH, 0],
        [570 - LSW, XH, 0],
        [570 - LSW, 330, 40],
        [60 + LSW, 280, 0],
        [60 + LSW, 220, 0],
        [570 - LSW, 175, 40],
        [570 - LSW, 0, 0]
      ])
    ]
  };

  // l
  glyphs[108] = {
    advance: 280,
    contours: [
      cw([
        [72, 0, LR],
        [72, CAP, 0],
        [72 + LSW, CAP, 0],
        [72 + LSW, LSW, 45],
        [240, LSW, 0],
        [240, 0, 0]
      ])
    ]
  };

  // m
  glyphs[109] = {
    advance: 880,
    contours: [
      cw([
        [60, 0, 0],
        [60, XH, LR],
        [820, XH, LR],
        [820, 0, 0],
        [820 - LSW, 0, 0],
        [820 - LSW, XH - LSW, LRI],
        [440 + LSW / 2, XH - LSW, LRI],
        [440 + LSW / 2, 0, 0],
        [440 - LSW / 2, 0, 0],
        [440 - LSW / 2, XH - LSW, LRI],
        [60 + LSW, XH - LSW, LRI],
        [60 + LSW, 0, 0]
      ])
    ]
  };

  // n
  glyphs[110] = {
    advance: 680,
    contours: [
      cw([
        [60, 0, 0],
        [60, XH, LR],
        [620, XH, LR],
        [620, 0, 0],
        [620 - LSW, 0, 0],
        [620 - LSW, XH - LSW, LRI],
        [60 + LSW, XH - LSW, LRI],
        [60 + LSW, 0, 0]
      ])
    ]
  };

  // o
  glyphs[111] = {
    advance: 680,
    contours: [
      rect(60, 0, 620, XH, LR, false),
      rect(60 + LSW, LSW, 620 - LSW, XH - LSW, LRI, true)
    ]
  };

  // p
  glyphs[112] = {
    advance: 680,
    contours: [
      cw([
        [60, DESC, 0],
        [60, XH, 0],
        [620, XH, LR],
        [620, 0, LR],
        [60 + LSW, 0, 0],
        [60 + LSW, DESC, 0]
      ]),
      ccw([
        [60 + LSW, LSW, 0],
        [60 + LSW, XH - LSW, 0],
        [620 - LSW, XH - LSW, LRI],
        [620 - LSW, LSW, LRI]
      ])
    ]
  };

  // q
  glyphs[113] = {
    advance: 680,
    contours: [
      cw([
        [620, DESC, 0],
        [620 - LSW, DESC, 0],
        [620 - LSW, 0, 0],
        [60, 0, LR],
        [60, XH, LR],
        [620, XH, 0]
      ]),
      ccw([
        [60 + LSW, LSW, LRI],
        [60 + LSW, XH - LSW, LRI],
        [620 - LSW, XH - LSW, 0],
        [620 - LSW, LSW, 0]
      ])
    ]
  };

  // r
  glyphs[114] = {
    advance: 520,
    contours: [
      cw([
        [60, 0, 0],
        [60, XH, LR],
        [480, XH, 0],
        [480, XH - LSW, 0],
        [60 + LSW, XH - LSW, LRI],
        [60 + LSW, 0, 0]
      ])
    ]
  };

  // s
  glyphs[115] = {
    advance: 640,
    contours: [
      cw([
        [580, XH, 0],
        [60, XH, LR],
        [60, 210, LR],
        [580 - LSW, 210, 35],
        [580 - LSW, LSW, 35],
        [60, LSW, 0],
        [60, 0, 0],
        [580, 0, LR],
        [580, 290, LR],
        [60 + LSW, 290, 35],
        [60 + LSW, XH - LSW, 35],
        [580, XH - LSW, 0]
      ])
    ]
  };

  // t
  glyphs[116] = {
    advance: 500,
    contours: [
      cw([
        [140, 0, LR],
        [140, CAP, 0],
        [140 + LSW, CAP, 0],
        [140 + LSW, XH, 0],
        [440, XH, 0],
        [440, XH - LSW, 0],
        [140 + LSW, XH - LSW, 0],
        [140 + LSW, LSW, 45],
        [440, LSW, 0],
        [440, 0, 0]
      ])
    ]
  };

  // u
  glyphs[117] = {
    advance: 680,
    contours: [
      cw([
        [60, XH, 0],
        [60 + LSW, XH, 0],
        [60 + LSW, LSW, LRI],
        [620 - LSW, LSW, LRI],
        [620 - LSW, XH, 0],
        [620, XH, 0],
        [620, 0, LR],
        [60, 0, LR]
      ])
    ]
  };

  // v
  glyphs[118] = {
    advance: 650,
    contours: [
      cw([
        [50, XH, 0],
        [145, XH, 0],
        [325, 95, 0],
        [505, XH, 0],
        [600, XH, 0],
        [385, 0, 35],
        [265, 0, 35]
      ])
    ]
  };

  // w
  glyphs[119] = {
    advance: 880,
    contours: [
      cw([
        [60, XH, 0],
        [60 + LSW, XH, 0],
        [60 + LSW, LSW, LRI],
        [440 - LSW / 2, LSW, LRI],
        [440 - LSW / 2, XH, 0],
        [440 + LSW / 2, XH, 0],
        [440 + LSW / 2, LSW, LRI],
        [820 - LSW, LSW, LRI],
        [820 - LSW, XH, 0],
        [820, XH, 0],
        [820, 0, LR],
        [440, 0, 90],
        [60, 0, LR]
      ])
    ]
  };

  // x
  glyphs[120] = {
    advance: 640,
    contours: [
      cw([
        [60, XH, 0],
        [60 + LSW, XH, 0],
        [60 + LSW, 330, 40],
        [320, 285, 0],
        [580 - LSW, 330, 40],
        [580 - LSW, XH, 0],
        [580, XH, 0],
        [580, 295, 75],
        [405, 250, 0],
        [580, 205, 75],
        [580, 0, 0],
        [580 - LSW, 0, 0],
        [580 - LSW, 175, 40],
        [320, 220, 0],
        [60 + LSW, 175, 40],
        [60 + LSW, 0, 0],
        [60, 0, 0],
        [60, 205, 75],
        [235, 250, 0],
        [60, 295, 75]
      ])
    ]
  };

  // y
  glyphs[121] = {
    advance: 680,
    contours: [
      cw([
        [60, XH, 0],
        [60 + LSW, XH, 0],
        [60 + LSW, LSW, LRI],
        [620 - LSW, LSW, LRI],
        [620 - LSW, XH, 0],
        [620, XH, 0],
        [620, DESC, LR],
        [80, DESC, 0],
        [80, DESC + LSW, 0],
        [620 - LSW, DESC + LSW, LRI],
        [620 - LSW, 0, 0],
        [60, 0, LR]
      ])
    ]
  };

  // z
  glyphs[122] = {
    advance: 630,
    contours: [
      cw([
        [60, XH, 0],
        [570, XH, 0],
        [570, XH - LSW, 0],
        [182, LSW, 0],
        [570, LSW, 0],
        [570, 0, 0],
        [60, 0, 0],
        [60, LSW, 0],
        [448, XH - LSW, 0],
        [60, XH - LSW, 0]
      ])
    ]
  };

  // ================= DIGITS 0-9 =================
  glyphs[48] = {
    advance: 720,
    contours: [
      rect(60, 0, 660, CAP, RO, false),
      rect(60 + SW, SW, 660 - SW, CAP - SW, RI, true)
    ]
  };
  glyphs[49] = {
    advance: 440,
    contours: [
      cw([
        [220, 0, 0],
        [220, 560, 0],
        [80, 460, 0],
        [80, 565, 0],
        [240, CAP, 0],
        [220 + SW, CAP, 0],
        [220 + SW, 0, 0]
      ])
    ]
  };
  glyphs[50] = {
    advance: 700,
    contours: [
      cw([
        [60, CAP, 0],
        [640, CAP, RO],
        [640, 310, RO],
        [60 + SW, 310, 40],
        [60 + SW, SW, 0],
        [640, SW, 0],
        [640, 0, 0],
        [60, 0, 0],
        [60, 395, RO],
        [640 - SW, 395, 40],
        [640 - SW, CAP - SW, 40],
        [60, CAP - SW, 0]
      ])
    ]
  };
  glyphs[51] = {
    advance: 700,
    contours: [
      cw([
        [60, CAP, 0],
        [640, CAP, RO],
        [640, 385, 100],
        [560, 350, 0],
        [640, 315, 100],
        [640, 0, RO],
        [60, 0, 0],
        [60, SW, 0],
        [640 - SW, SW, 55],
        [640 - SW, 305, 55],
        [200, 305, 0],
        [200, 395, 0],
        [640 - SW, 395, 55],
        [640 - SW, CAP - SW, 55],
        [60, CAP - SW, 0]
      ])
    ]
  };
  glyphs[52] = {
    advance: 720,
    contours: [
      cw([
        [60, CAP, 0],
        [60 + SW, CAP, 0],
        [60 + SW, 280, 0],
        [560, 280, 0],
        [560, CAP, 0],
        [560 + SW, CAP, 0],
        [560 + SW, 0, 0],
        [560, 0, 0],
        [560, 190, 0],
        [60, 190, 0]
      ])
    ]
  };
  glyphs[53] = {
    advance: 700,
    contours: [
      cw([
        [630, CAP, 0],
        [60, CAP, 0],
        [60, 315, 0],
        [640 - SW, 315, 45],
        [640 - SW, SW, 45],
        [60, SW, 0],
        [60, 0, 0],
        [640, 0, RO],
        [640, 405, RO],
        [60 + SW, 405, 0],
        [60 + SW, CAP - SW, 0],
        [630, CAP - SW, 0]
      ])
    ]
  };
  glyphs[54] = {
    advance: 720,
    contours: [
      cw([
        [620, CAP, 0],
        [60, CAP, RO],
        [60, 0, RO],
        [660, 0, RO],
        [660, 400, RO],
        [60 + SW, 400, 0],
        [60 + SW, CAP - SW, RI],
        [620, CAP - SW, 0]
      ]),
      ccw([
        [60 + SW, SW, RI],
        [60 + SW, 310, 0],
        [660 - SW, 310, RI],
        [660 - SW, SW, RI]
      ])
    ]
  };
  glyphs[55] = {
    advance: 680,
    contours: [
      cw([
        [60, CAP, 0],
        [630, CAP, 0],
        [270, 0, 0],
        [165, 0, 0],
        [505, CAP - SW, 0],
        [60, CAP - SW, 0]
      ])
    ]
  };
  glyphs[56] = {
    advance: 720,
    contours: [
      rect(60, 0, 660, CAP, RO, false),
      ccw([
        [60 + SW, 395, RI],
        [60 + SW, CAP - SW, RI],
        [660 - SW, CAP - SW, RI],
        [660 - SW, 395, RI]
      ]),
      ccw([
        [60 + SW, SW, RI],
        [60 + SW, 305, RI],
        [660 - SW, 305, RI],
        [660 - SW, SW, RI]
      ])
    ]
  };
  glyphs[57] = {
    advance: 720,
    contours: [
      cw([
        [100, 0, 0],
        [660, 0, RO],
        [660, CAP, RO],
        [60, CAP, RO],
        [60, 300, RO],
        [660 - SW, 300, 0],
        [660 - SW, SW, RI],
        [100, SW, 0]
      ]),
      ccw([
        [60 + SW, 390, RI],
        [60 + SW, CAP - SW, RI],
        [660 - SW, CAP - SW, RI],
        [660 - SW, 390, 0]
      ])
    ]
  };

  // ================= PUNCTUATION & SYMBOLS =================
  // . (46)
  glyphs[46] = { advance: 240, contours: [rect(70, 0, 170, 100, 20, false)] };
  // , (44)
  glyphs[44] = {
    advance: 240,
    contours: [
      cw([
        [60, -110, 0],
        [60, 100, 20],
        [170, 100, 20],
        [170, -20, 0]
      ])
    ]
  };
  // : (58)
  glyphs[58] = {
    advance: 240,
    contours: [rect(70, 0, 170, 100, 20, false), rect(70, 380, 170, 480, 20, false)]
  };
  // ; (59)
  glyphs[59] = {
    advance: 240,
    contours: [
      cw([
        [60, -110, 0],
        [60, 100, 20],
        [170, 100, 20],
        [170, -20, 0]
      ]),
      rect(70, 380, 170, 480, 20, false)
    ]
  };
  // ! (33)
  glyphs[33] = {
    advance: 260,
    contours: [rect(82, 0, 178, 96, 20, false), rect(82, 180, 178, CAP, 0, false)]
  };
  // ? (63)
  glyphs[63] = {
    advance: 620,
    contours: [
      rect(260, 0, 356, 96, 20, false),
      cw([
        [260, 180, 0],
        [260, 340, 80],
        [560 - SW, 340, 40],
        [560 - SW, CAP - SW, 55],
        [60, CAP - SW, 0],
        [60, CAP, 0],
        [560, CAP, RO],
        [560, 250, RO],
        [356, 250, 0],
        [356, 180, 0]
      ])
    ]
  };
  // - (45)
  glyphs[45] = { advance: 440, contours: [rect(60, 255, 380, 345, 0, false)] };
  // – (8211) & — (8212)
  glyphs[8211] = { advance: 560, contours: [rect(50, 255, 510, 345, 0, false)] };
  glyphs[8212] = { advance: 820, contours: [rect(40, 255, 780, 345, 0, false)] };
  // _ (95)
  glyphs[95] = { advance: 560, contours: [rect(40, -90, 520, 0, 0, false)] };
  // ' (39) & ’ (8217) & ‘ (8216)
  glyphs[39] = { advance: 220, contours: [rect(68, 480, 152, CAP, 0, false)] };
  glyphs[8217] = { advance: 240, contours: [rect(74, 480, 162, CAP, 20, false)] };
  glyphs[8216] = { advance: 240, contours: [rect(74, 480, 162, CAP, 20, false)] };
  // " (34) & “ (8220) & ” (8221)
  glyphs[34] = {
    advance: 380,
    contours: [rect(64, 480, 148, CAP, 0, false), rect(228, 480, 312, CAP, 0, false)]
  };
  glyphs[8220] = glyphs[34];
  glyphs[8221] = glyphs[34];
  // … (8230)
  glyphs[8230] = {
    advance: 640,
    contours: [
      rect(60, 0, 155, 95, 20, false),
      rect(270, 0, 365, 95, 20, false),
      rect(480, 0, 575, 95, 20, false)
    ]
  };
  // / (47)
  glyphs[47] = {
    advance: 480,
    contours: [
      cw([
        [60, -40, 0],
        [320, CAP + 20, 0],
        [420, CAP + 20, 0],
        [160, -40, 0]
      ])
    ]
  };
  // \ (92)
  glyphs[92] = {
    advance: 480,
    contours: [
      cw([
        [320, -40, 0],
        [60, CAP + 20, 0],
        [160, CAP + 20, 0],
        [420, -40, 0]
      ])
    ]
  };
  // ( (40) & ) (41)
  glyphs[40] = {
    advance: 340,
    contours: [
      cw([
        [280, -80, 0],
        [80, -80, 120],
        [80, CAP + 60, 120],
        [280, CAP + 60, 0],
        [280, CAP - 20, 0],
        [170, CAP - 20, 55],
        [170, 0, 55],
        [280, 0, 0]
      ])
    ]
  };
  glyphs[41] = {
    advance: 340,
    contours: [
      cw([
        [60, -80, 0],
        [60, 0, 0],
        [170, 0, 55],
        [170, CAP - 20, 55],
        [60, CAP - 20, 0],
        [60, CAP + 60, 0],
        [260, CAP + 60, 120],
        [260, -80, 120]
      ])
    ]
  };
  // [ (91) & ] (93)
  glyphs[91] = {
    advance: 340,
    contours: [
      cw([
        [280, -80, 0],
        [80, -80, 0],
        [80, CAP + 60, 0],
        [280, CAP + 60, 0],
        [280, CAP - 20, 0],
        [170, CAP - 20, 0],
        [170, 0, 0],
        [280, 0, 0]
      ])
    ]
  };
  glyphs[93] = {
    advance: 340,
    contours: [
      cw([
        [60, -80, 0],
        [60, 0, 0],
        [170, 0, 0],
        [170, CAP - 20, 0],
        [60, CAP - 20, 0],
        [60, CAP + 60, 0],
        [260, CAP + 60, 0],
        [260, -80, 0]
      ])
    ]
  };
  // + (43)
  glyphs[43] = {
    advance: 600,
    contours: [
      cw([
        [255, 90, 0],
        [255, 295, 0],
        [60, 295, 0],
        [60, 385, 0],
        [255, 385, 0],
        [255, 590, 0],
        [345, 590, 0],
        [345, 385, 0],
        [540, 385, 0],
        [540, 295, 0],
        [345, 295, 0],
        [345, 90, 0]
      ])
    ]
  };
  // = (61)
  glyphs[61] = {
    advance: 600,
    contours: [
      rect(60, 190, 540, 275, 0, false),
      rect(60, 415, 540, 500, 0, false)
    ]
  };
  // > (62) & < (60)
  glyphs[62] = {
    advance: 580,
    contours: [
      cw([
        [80, 110, 0],
        [380, 340, 0],
        [80, 570, 0],
        [80, 465, 0],
        [260, 340, 0],
        [80, 215, 0]
      ])
    ]
  };
  glyphs[60] = {
    advance: 580,
    contours: [
      cw([
        [500, 110, 0],
        [500, 215, 0],
        [320, 340, 0],
        [500, 465, 0],
        [500, 570, 0],
        [200, 340, 0]
      ])
    ]
  };
  // * (42)
  glyphs[42] = {
    advance: 480,
    contours: [rect(195, 380, 285, 620, 0, false), rect(120, 455, 360, 545, 0, false)]
  };
  // & (38)
  glyphs[38] = {
    advance: 720,
    contours: [
      cw([
        [660, 0, 0],
        [60, 0, RO],
        [60, CAP, RO],
        [580, CAP, 0],
        [580, CAP - SW, 0],
        [60 + SW, CAP - SW, RI],
        [60 + SW, 395, 0],
        [540, 395, RO],
        [540, SW, 0],
        [660, SW, 0]
      ]),
      ccw([
        [60 + SW, SW, RI],
        [60 + SW, 305, 0],
        [540 - SW, 305, RI],
        [540 - SW, SW, 0]
      ])
    ]
  };
  // % (37)
  glyphs[37] = {
    advance: 800,
    contours: [
      rect(60, 440, 300, CAP, 60, false),
      rect(135, 515, 225, CAP - 75, 25, true),
      rect(500, 0, 740, 260, 60, false),
      rect(575, 75, 665, 185, 25, true),
      cw([
        [180, 0, 0],
        [540, CAP, 0],
        [630, CAP, 0],
        [270, 0, 0]
      ])
    ]
  };
  // # (35)
  glyphs[35] = {
    advance: 700,
    contours: [
      rect(180, 60, 265, 640, 0, false),
      rect(435, 60, 520, 640, 0, false),
      rect(60, 210, 640, 295, 0, false),
      rect(60, 405, 640, 490, 0, false)
    ]
  };
  // @ (64)
  glyphs[64] = {
    advance: 800,
    contours: [
      rect(60, 0, 740, CAP, RO, false),
      rect(60 + SW, SW, 740 - SW, CAP - SW, RI, true),
      rect(240, 180, 560, 520, 70, false),
      rect(325, 265, 475, 435, 30, true)
    ]
  };
  // é (233) for Félicette!
  glyphs[233] = {
    advance: 650,
    contours: [
      ...glyphs[101].contours,
      cw([
        [280, XH + 65, 0],
        [430, XH + 205, 0],
        [520, XH + 205, 0],
        [370, XH + 65, 0]
      ])
    ]
  };

  return glyphs;
}

// ============================================================
// BINARY TTF WRITER HELPERS
// ============================================================

function createBufferWriter(size) {
  const buf = Buffer.alloc(size);
  let pos = 0;
  return {
    buf,
    get pos() { return pos; },
    writeU8(v) { buf.writeUInt8(v & 0xff, pos); pos += 1; },
    writeI8(v) { buf.writeInt8(v, pos); pos += 1; },
    writeU16(v) { buf.writeUInt16BE(v & 0xffff, pos); pos += 2; },
    writeI16(v) { buf.writeInt16BE(v, pos); pos += 2; },
    writeU32(v) { buf.writeUInt32BE(v >>> 0, pos); pos += 4; },
    writeBytes(b) { b.copy(buf, pos); pos += b.length; },
    writeStr(s) { buf.write(s, pos, 'ascii'); pos += s.length; }
  };
}

function encodeGlyph(g) {
  if (!g.contours || g.contours.length === 0) {
    return Buffer.alloc(0);
  }
  let xMin = Infinity, yMin = Infinity, xMax = -Infinity, yMax = -Infinity;
  let totalPts = 0;
  for (const c of g.contours) {
    totalPts += c.length;
    for (const p of c) {
      if (p.x < xMin) xMin = p.x;
      if (p.y < yMin) yMin = p.y;
      if (p.x > xMax) xMax = p.x;
      if (p.y > yMax) yMax = p.y;
    }
  }

  const endPts = [];
  let running = 0;
  const allPts = [];
  for (const c of g.contours) {
    running += c.length;
    endPts.push(running - 1);
    allPts.push(...c);
  }

  // Encode flags & relative deltas (simple full 16-bit deltas with flag=0/1)
  const flags = [];
  const xDeltas = [];
  const yDeltas = [];
  let prevX = 0, prevY = 0;
  for (const p of allPts) {
    const dx = p.x - prevX;
    const dy = p.y - prevY;
    prevX = p.x;
    prevY = p.y;
    flags.push(p.onCurve ? 0x01 : 0x00);
    xDeltas.push(dx);
    yDeltas.push(dy);
  }

  const size = 10 + g.contours.length * 2 + 2 + flags.length + allPts.length * 4;
  const paddedSize = (size + 3) & ~3;
  const w = createBufferWriter(paddedSize);
  w.writeI16(g.contours.length);
  w.writeI16(xMin);
  w.writeI16(yMin);
  w.writeI16(xMax);
  w.writeI16(yMax);
  for (const ep of endPts) w.writeU16(ep);
  w.writeU16(0); // instructionLength
  for (const f of flags) w.writeU8(f);
  for (const dx of xDeltas) w.writeI16(dx);
  for (const dy of yDeltas) w.writeI16(dy);

  return w.buf;
}

function calcChecksum(buf) {
  let sum = 0;
  const len = Math.ceil(buf.length / 4) * 4;
  const padded = Buffer.alloc(len);
  buf.copy(padded);
  for (let i = 0; i < len; i += 4) {
    sum = (sum + padded.readUInt32BE(i)) >>> 0;
  }
  return sum;
}

function buildTTF() {
  const glyphMap = buildGlyphs();
  const codePoints = Object.keys(glyphMap)
    .map(Number)
    .filter(cp => cp > 0)
    .sort((a, b) => a - b);

  // Build ordered glyph list: index 0 = .notdef, then sorted codepoints
  const glyphList = [glyphMap[0], ...codePoints.map(cp => glyphMap[cp])];
  const cpToGid = new Map();
  codePoints.forEach((cp, idx) => cpToGid.set(cp, idx + 1));

  const numGlyphs = glyphList.length;

  // 1. glyf & loca
  const glyfChunks = [];
  const locaOffsets = [];
  let currentOffset = 0;
  let maxPts = 0;
  let maxContours = 0;

  let globalXMin = 0, globalYMin = 0, globalXMax = 0, globalYMax = 0;

  for (const g of glyphList) {
    locaOffsets.push(currentOffset);
    const encoded = encodeGlyph(g);
    glyfChunks.push(encoded);
    currentOffset += encoded.length;
    if (g.contours && g.contours.length > 0) {
      maxContours = Math.max(maxContours, g.contours.length);
      let ptsCount = 0;
      for (const c of g.contours) {
        ptsCount += c.length;
        for (const p of c) {
          globalXMin = Math.min(globalXMin, p.x);
          globalYMin = Math.min(globalYMin, p.y);
          globalXMax = Math.max(globalXMax, p.x);
          globalYMax = Math.max(globalYMax, p.y);
        }
      }
      maxPts = Math.max(maxPts, ptsCount);
    }
  }
  locaOffsets.push(currentOffset);

  const glyfBuf = Buffer.concat(glyfChunks);
  const locaW = createBufferWriter(locaOffsets.length * 4);
  for (const off of locaOffsets) locaW.writeU32(off);
  const locaBuf = locaW.buf;

  // 2. hmtx
  const hmtxW = createBufferWriter(numGlyphs * 4);
  for (const g of glyphList) {
    let lsb = 0;
    if (g.contours && g.contours.length > 0) {
      lsb = Math.min(...g.contours.flat().map(p => p.x));
    }
    hmtxW.writeU16(g.advance);
    hmtxW.writeI16(lsb);
  }
  const hmtxBuf = hmtxW.buf;

  // 3. cmap (Format 4 single-mapping segments + 0xFFFF sentinel)
  const segments = [];
  let start = codePoints[0];
  let end = codePoints[0];
  for (let i = 1; i < codePoints.length; i++) {
    if (
      codePoints[i] === end + 1 &&
      cpToGid.get(codePoints[i]) === cpToGid.get(end) + 1
    ) {
      end = codePoints[i];
    } else {
      segments.push({ start, end, delta: (cpToGid.get(start) - start) & 0xffff });
      start = codePoints[i];
      end = codePoints[i];
    }
  }
  segments.push({ start, end, delta: (cpToGid.get(start) - start) & 0xffff });
  segments.push({ start: 0xffff, end: 0xffff, delta: 1 });

  const segCount = segments.length;
  const searchRange = 2 * Math.pow(2, Math.floor(Math.log2(segCount)));
  const entrySelector = Math.floor(Math.log2(segCount));
  const rangeShift = 2 * segCount - searchRange;
  const format4Len = 16 + segCount * 8;
  const cmapLen = 4 + 8 + format4Len;
  const cmapW = createBufferWriter(cmapLen);
  cmapW.writeU16(0); // version
  cmapW.writeU16(1); // numTables
  cmapW.writeU16(3); // platformID (Windows)
  cmapW.writeU16(1); // encodingID (Unicode BMP)
  cmapW.writeU32(12); // offset
  // Format 4 header
  cmapW.writeU16(4);
  cmapW.writeU16(format4Len);
  cmapW.writeU16(0);
  cmapW.writeU16(segCount * 2);
  cmapW.writeU16(searchRange);
  cmapW.writeU16(entrySelector);
  cmapW.writeU16(rangeShift);
  for (const s of segments) cmapW.writeU16(s.end);
  cmapW.writeU16(0); // reservedPad
  for (const s of segments) cmapW.writeU16(s.start);
  for (const s of segments) cmapW.writeU16(s.delta);
  for (let i = 0; i < segCount; i++) cmapW.writeU16(0); // idRangeOffset
  const cmapBuf = cmapW.buf;

  // 4. head (checkSumAdjustment filled after assembling whole font)
  const headW = createBufferWriter(54);
  headW.writeU32(0x00010000); // version
  headW.writeU32(0x00010000); // fontRevision
  headW.writeU32(0); // checkSumAdjustment
  headW.writeU32(0x5f0f3cf5); // magicNumber
  headW.writeU16(0x000b); // flags
  headW.writeU16(UPM);
  headW.writeU32(0); headW.writeU32(0); // created
  headW.writeU32(0); headW.writeU32(0); // modified
  headW.writeI16(globalXMin);
  headW.writeI16(globalYMin);
  headW.writeI16(globalXMax);
  headW.writeI16(globalYMax);
  headW.writeU16(0); // macStyle
  headW.writeU16(8); // lowestRecPPEM
  headW.writeI16(2); // fontDirectionHint
  headW.writeI16(1); // indexToLocFormat (1 = 32-bit long)
  headW.writeI16(0); // glyphDataFormat
  const headBuf = headW.buf;

  // 5. hhea
  const hheaW = createBufferWriter(36);
  hheaW.writeU32(0x00010000);
  hheaW.writeI16(880); // ascender
  hheaW.writeI16(-220); // descender
  hheaW.writeI16(100); // lineGap
  hheaW.writeU16(960); // advanceWidthMax
  hheaW.writeI16(globalXMin);
  hheaW.writeI16(40); // minRightSideBearing
  hheaW.writeI16(globalXMax);
  hheaW.writeI16(1); hheaW.writeI16(0); hheaW.writeI16(0); // caretSlope
  hheaW.writeI16(0); hheaW.writeI16(0); hheaW.writeI16(0); hheaW.writeI16(0);
  hheaW.writeI16(0); // metricDataFormat
  hheaW.writeU16(numGlyphs); // numberOfHMetrics
  const hheaBuf = hheaW.buf;

  // 6. maxp
  const maxpW = createBufferWriter(32);
  maxpW.writeU32(0x00010000);
  maxpW.writeU16(numGlyphs);
  maxpW.writeU16(maxPts);
  maxpW.writeU16(maxContours);
  maxpW.writeU16(0); maxpW.writeU16(0);
  maxpW.writeU16(1); maxpW.writeU16(0); maxpW.writeU16(0);
  maxpW.writeU16(0); maxpW.writeU16(0); maxpW.writeU16(0);
  maxpW.writeU16(0); maxpW.writeU16(0); maxpW.writeU16(0);
  const maxpBuf = maxpW.buf;

  // 7. OS/2 (version 3, 96 bytes)
  const os2W = createBufferWriter(96);
  os2W.writeU16(3); // version
  os2W.writeI16(660); // xAvgCharWidth
  os2W.writeU16(500); // usWeightClass
  os2W.writeU16(5); // usWidthClass
  os2W.writeU16(0); // fsType
  os2W.writeI16(500); os2W.writeI16(500); os2W.writeI16(0); os2W.writeI16(350); // sub
  os2W.writeI16(500); os2W.writeI16(500); os2W.writeI16(0); os2W.writeI16(350); // sup
  os2W.writeI16(50); os2W.writeI16(300); // strikeout
  os2W.writeI16(0); // sFamilyClass
  os2W.writeBytes(Buffer.from([2, 11, 6, 4, 2, 2, 2, 2, 2, 4])); // panose
  os2W.writeU32(0x00000003); os2W.writeU32(0); os2W.writeU32(0); os2W.writeU32(0);
  os2W.writeStr('CSMC');
  os2W.writeU16(0x0040); // fsSelection REGULAR
  os2W.writeU16(32); // usFirstCharIndex
  os2W.writeU16(8230); // usLastCharIndex
  os2W.writeI16(880); // sTypoAscender
  os2W.writeI16(-220); // sTypoDescender
  os2W.writeI16(100); // sTypoLineGap
  os2W.writeU16(880); // usWinAscent
  os2W.writeU16(220); // usWinDescent
  os2W.writeU32(1); os2W.writeU32(0); // codePageRanges
  os2W.writeI16(XH); // sxHeight
  os2W.writeI16(CAP); // sCapHeight
  os2W.writeU16(0); // usDefaultChar
  os2W.writeU16(32); // usBreakChar
  os2W.writeU16(0); // usMaxContext
  const os2Buf = os2W.buf;

  // 8. name
  const nameEntries = [
    { id: 1, str: 'CosmicTech' },
    { id: 2, str: 'Regular' },
    { id: 4, str: 'CosmicTech Regular' },
    { id: 6, str: 'CosmicTech-Regular' }
  ];
  const utf16Strings = nameEntries.map(e => {
    const b = Buffer.alloc(e.str.length * 2);
    for (let i = 0; i < e.str.length; i++) {
      b.writeUInt16BE(e.str.charCodeAt(i), i * 2);
    }
    return b;
  });
  const totalStrBytes = utf16Strings.reduce((a, b) => a + b.length, 0);
  const nameHeaderSize = 6 + nameEntries.length * 12;
  const nameW = createBufferWriter(nameHeaderSize + totalStrBytes);
  nameW.writeU16(0);
  nameW.writeU16(nameEntries.length);
  nameW.writeU16(nameHeaderSize);
  let strOff = 0;
  nameEntries.forEach((e, idx) => {
    nameW.writeU16(3); // Windows
    nameW.writeU16(1); // Unicode BMP
    nameW.writeU16(0x0409); // en-US
    nameW.writeU16(e.id);
    nameW.writeU16(utf16Strings[idx].length);
    nameW.writeU16(strOff);
    strOff += utf16Strings[idx].length;
  });
  utf16Strings.forEach(b => nameW.writeBytes(b));
  const nameBuf = nameW.buf;

  // 9. post (version 3.0)
  const postW = createBufferWriter(32);
  postW.writeU32(0x00030000);
  postW.writeU32(0); // italicAngle
  postW.writeI16(-100);
  postW.writeI16(50);
  postW.writeU32(0); // isFixedPitch
  postW.writeU32(0); postW.writeU32(0); postW.writeU32(0); postW.writeU32(0);
  const postBuf = postW.buf;

  // Assemble tables in sorted alphabetical tag order
  const tables = [
    { tag: 'OS/2', buf: os2Buf },
    { tag: 'cmap', buf: cmapBuf },
    { tag: 'glyf', buf: glyfBuf },
    { tag: 'head', buf: headBuf },
    { tag: 'hhea', buf: hheaBuf },
    { tag: 'hmtx', buf: hmtxBuf },
    { tag: 'loca', buf: locaBuf },
    { tag: 'maxp', buf: maxpBuf },
    { tag: 'name', buf: nameBuf },
    { tag: 'post', buf: postBuf }
  ];

  const numTables = tables.length;
  const entrySelectorH = Math.floor(Math.log2(numTables));
  const searchRangeH = Math.pow(2, entrySelectorH) * 16;
  const rangeShiftH = numTables * 16 - searchRangeH;

  let tableOffset = 12 + numTables * 16;
  const tableOffsets = [];
  const paddedTables = tables.map(t => {
    const padLen = (t.buf.length + 3) & ~3;
    const pBuf = Buffer.alloc(padLen);
    t.buf.copy(pBuf);
    tableOffsets.push(tableOffset);
    tableOffset += padLen;
    return { tag: t.tag, origLen: t.buf.length, buf: pBuf };
  });

  const out = createBufferWriter(tableOffset);
  out.writeU32(0x00010000); // sfntVersion
  out.writeU16(numTables);
  out.writeU16(searchRangeH);
  out.writeU16(entrySelectorH);
  out.writeU16(rangeShiftH);

  let headOffsetInFile = 0;
  paddedTables.forEach((t, idx) => {
    out.writeStr(t.tag);
    out.writeU32(calcChecksum(t.buf));
    out.writeU32(tableOffsets[idx]);
    out.writeU32(t.origLen);
    if (t.tag === 'head') headOffsetInFile = tableOffsets[idx];
  });

  paddedTables.forEach(t => out.writeBytes(t.buf));

  // Compute global checkSumAdjustment in head
  const fullSum = calcChecksum(out.buf);
  const adj = (0xb1b0afba - fullSum) >>> 0;
  out.buf.writeUInt32BE(adj, headOffsetInFile + 8);

  return out.buf;
}

const outDir = path.join(__dirname, '../public/fonts');
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, 'CosmicTech.ttf');
const ttfBuffer = buildTTF();
fs.writeFileSync(outFile, ttfBuffer);
console.log(`Generated ${outFile} (${ttfBuffer.length} bytes)`);
