import React from 'react';
import {
  DeepSpaceProbeId,
  RealisticWindowCanvas,
  TravelDestination,
  TravelPhase
} from './RealisticWindowCanvas';

export interface MainConsoleBackgroundProps {
  travelPhase?: TravelPhase;
  travelDestination?: TravelDestination | null;
  deepSpaceProbe?: DeepSpaceProbeId;
  earthProgress?: number;
  subtleHyperspace?: boolean;
  cabinDimmed?: boolean;
}

/**
 * Dynamic 3D curved spaceship cockpit window & dashboard background for the Main Console.
 * Features:
 * - Ultrawide 3D curved monitor / panoramic cockpit window with concave curved glass & bevels
 * - Idle state: Pure black (#000000) starry space void, asteroids & alternating slime aliens
 * - Hyperspace, Orbit, Landing & Deep Space Probe Floating View: 2D Canvas engine
 */
export const MainConsoleBackground: React.FC<MainConsoleBackgroundProps> = ({
  travelPhase = 'idle',
  travelDestination = null,
  deepSpaceProbe = null,
  earthProgress = 0,
  subtleHyperspace = false,
  cabinDimmed = false
}) => {
  return (
    <div
      className={`main-console-bg ${cabinDimmed ? 'is-cabin-dimmed' : ''}`}
      aria-hidden="true"
    >
      <RealisticWindowCanvas
        travelPhase={travelPhase}
        travelDestination={travelDestination}
        deepSpaceProbe={deepSpaceProbe}
        earthProgress={earthProgress}
        subtleHyperspace={subtleHyperspace}
      />
      <svg
        className="main-console-svg"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 3D Curved Monitor Window Clip Path (taller concave ultrawide curve) */}
          <clipPath id="cockpit-window-clip">
            <path d="M104,48 Q600,88 1096,48 L1108,60 L1108,476 L1096,490 Q600,456 104,490 L92,476 L92,60 Z" />
          </clipPath>

          {/* Curved Glass Reflection & Vignette */}
          <linearGradient id="window-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bfe6ff" stopOpacity="0.08" />
            <stop offset="28%" stopColor="#bfe6ff" stopOpacity="0.01" />
            <stop offset="50%" stopColor="#dff4ff" stopOpacity="0.05" />
            <stop offset="72%" stopColor="#bfe6ff" stopOpacity="0.01" />
            <stop offset="100%" stopColor="#bfe6ff" stopOpacity="0.07" />
          </linearGradient>

          {/* 3D Curved Monitor Inner Side Shadow for depth */}
          <linearGradient id="curved-depth-vignette" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.52" />
            <stop offset="8%" stopColor="#000000" stopOpacity="0" />
            <stop offset="92%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.52" />
          </linearGradient>

          {/* Curved Metallic Bezel Gradient */}
          <linearGradient id="frame-metal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#55667a" />
            <stop offset="16%" stopColor="#3c4959" />
            <stop offset="50%" stopColor="#2f3a47" />
            <stop offset="84%" stopColor="#3c4959" />
            <stop offset="100%" stopColor="#55667a" />
          </linearGradient>

          {/* Lower dashboard gradient */}
          <linearGradient id="cockpit-desk" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3d495a" />
            <stop offset="28%" stopColor="#2d3746" />
            <stop offset="100%" stopColor="#192029" />
          </linearGradient>

          {/* Reusable Reference Asteroid Definitions */}
          <g id="asteroid-large">
            <path
              d="M-64,-44 C-50,-66 -18,-72 6,-70 L20,-80 L48,-66 L44,-54 C68,-44 82,-18 82,8 C82,36 62,62 34,74 L18,82 L-16,80 C-44,74 -64,54 -72,26 L-82,12 L-72,-10 C-74,-24 -70,-36 -64,-44 Z"
              fill="#6a5c60"
              stroke="#0a090b"
              strokeWidth="4.2"
              strokeLinejoin="round"
            />
            <path
              d="M32,-62 C58,-48 76,-22 76,8 C76,34 56,58 30,70 L16,78 L-12,76 C12,64 36,44 42,14 C48,-16 40,-42 32,-62 Z"
              fill="#4b4044"
            />
            <path
              d="M-52,-40 C-36,-58 -8,-64 14,-60 C-8,-50 -28,-40 -42,-22 Z"
              fill="#7c6e72"
            />
            <path
              d="M16,-78 L46,-64 L36,-46 L8,-60 Z"
              fill="#5a4d51"
              stroke="#0a090b"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <ellipse cx="31" cy="-71" rx="14" ry="5" transform="rotate(24 31 -71)" fill="#2d2528" stroke="#0a090b" strokeWidth="2.5" />
            <ellipse cx="-24" cy="-32" rx="20" ry="13" transform="rotate(-24 -24 -32)" fill="#4d4145" stroke="#0a090b" strokeWidth="3" />
            <ellipse cx="-22" cy="-34" rx="13" ry="8" transform="rotate(-24 -22 -34)" fill="#2f272a" stroke="#0a090b" strokeWidth="2" />
            <ellipse cx="48" cy="-8" rx="13" ry="16" transform="rotate(14 48 -8)" fill="#4d4145" stroke="#0a090b" strokeWidth="2.8" />
            <ellipse cx="50" cy="-8" rx="7" ry="10" transform="rotate(14 50 -8)" fill="#2c2427" stroke="#0a090b" strokeWidth="2" />
            <ellipse cx="-2" cy="64" rx="16" ry="10" fill="#463b3f" stroke="#0a090b" strokeWidth="2.8" />
            <ellipse cx="-2" cy="66" rx="10" ry="5" fill="#292124" stroke="#0a090b" strokeWidth="2" />
            <ellipse cx="44" cy="40" rx="11" ry="8" transform="rotate(-35 44 40)" fill="#3b3135" stroke="#0a090b" strokeWidth="2.4" />
            <path d="M-42,6 Q-18,-2 -2,10 T30,12" fill="none" stroke="#0a090b" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M-26,34 Q-4,24 14,32" fill="none" stroke="#0a090b" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M-6,-14 Q14,-24 28,-18" fill="none" stroke="#0a090b" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="-48" cy="-12" r="2.5" fill="#2f272a" />
            <circle cx="-38" cy="44" r="3" fill="#2f272a" />
            <circle cx="18" cy="-38" r="2.2" fill="#2f272a" />
          </g>

          <g id="asteroid-shard">
            <path
              d="M28,-54 L46,-40 L40,-10 L26,24 L0,48 L-34,54 L-44,36 L-36,4 L-12,-32 Z"
              fill="#685b5f"
              stroke="#0a090b"
              strokeWidth="3.8"
              strokeLinejoin="round"
            />
            <path
              d="M36,-32 L36,-8 L22,22 L-4,44 L-30,48 L-10,24 L14,-8 Z"
              fill="#493f43"
            />
            <path d="M-16,-14 L6,-22 M-24,14 L-2,4 M-18,32 L8,22" fill="none" stroke="#0a090b" strokeWidth="2.4" strokeLinecap="round" />
            <ellipse cx="14" cy="-18" rx="6" ry="4" transform="rotate(-30 14 -18)" fill="#332b2e" stroke="#0a090b" strokeWidth="1.8" />
            <circle cx="-18" cy="18" r="4" fill="#332b2e" stroke="#0a090b" strokeWidth="1.8" />
            <circle cx="2" cy="-34" r="2.5" fill="#332b2e" />
          </g>

          <g id="asteroid-chunk">
            <path
              d="M-32,-20 L-10,-36 L16,-28 L34,-10 L32,18 L12,36 L-18,32 L-36,12 Z"
              fill="#65585c"
              stroke="#0a090b"
              strokeWidth="3.6"
              strokeLinejoin="round"
            />
            <path
              d="M14,-24 L30,-8 L28,16 L10,32 L-10,28 L6,6 Z"
              fill="#483d41"
            />
            <path d="M-26,6 L-4,-4 L16,10 M-8,-28 L-4,-4" fill="none" stroke="#0a090b" strokeWidth="2.4" strokeLinecap="round" />
            <polygon points="-24,-10 -8,-18 -6,0 -20,4" fill="#7a6c70" stroke="#0a090b" strokeWidth="1.6" />
          </g>

          <g id="asteroid-small">
            <path
              d="M-36,-14 C-32,-34 -10,-42 12,-38 L22,-42 L34,-30 L32,-20 C42,-6 42,16 28,32 C14,44 -12,44 -28,30 C-42,18 -42,-2 -36,-14 Z"
              fill="#685a5e"
              stroke="#0a090b"
              strokeWidth="3.6"
              strokeLinejoin="round"
            />
            <path
              d="M16,-32 C34,-18 38,8 24,28 C12,40 -8,40 -22,30 C-2,24 14,10 18,-10 Z"
              fill="#4a3f43"
            />
            <ellipse cx="-14" cy="-16" rx="10" ry="7" transform="rotate(-20 -14 -16)" fill="#362e31" stroke="#0a090b" strokeWidth="2.4" />
            <ellipse cx="18" cy="-4" rx="7" ry="9" fill="#362e31" stroke="#0a090b" strokeWidth="2.2" />
            <ellipse cx="-6" cy="24" rx="9" ry="5.5" fill="#362e31" stroke="#0a090b" strokeWidth="2.2" />
            <path d="M-22,4 Q-4,-2 8,8" fill="none" stroke="#0a090b" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        </defs>

        {/* ============================================================
            1. PURE BLACK OUTER SPACE VOID & STARFIELD (Inside Curved Window)
            ============================================================ */}
        <g clipPath="url(#cockpit-window-clip)">
          {travelPhase === 'idle' && (
            <>
              <rect x="92" y="46" width="1016" height="446" fill="#000000" />

              {/* Crisp stars across pure black void */}
              <g fill="#ffffff">
                <circle cx="170" cy="105" r="1.4" opacity="0.85" />
                <circle cx="235" cy="175" r="1.1" opacity="0.65" />
                <circle cx="290" cy="95" r="1.8" opacity="0.9" />
                <circle cx="345" cy="235" r="1.2" opacity="0.7" />
                <circle cx="410" cy="130" r="1.5" opacity="0.8" />
                <circle cx="485" cy="185" r="1.1" opacity="0.6" />
                <circle cx="540" cy="100" r="1.6" opacity="0.9" />
                <circle cx="620" cy="155" r="1.3" opacity="0.75" />
                <circle cx="695" cy="115" r="1.9" opacity="0.95" />
                <circle cx="760" cy="205" r="1.2" opacity="0.7" />
                <circle cx="840" cy="135" r="1.5" opacity="0.85" />
                <circle cx="910" cy="95" r="1.3" opacity="0.75" />
                <circle cx="990" cy="170" r="1.7" opacity="0.9" />
                <circle cx="1040" cy="120" r="1.1" opacity="0.65" />

                <circle cx="160" cy="305" r="1.5" opacity="0.8" />
                <circle cx="220" cy="375" r="1.2" opacity="0.65" />
                <circle cx="310" cy="330" r="1.8" opacity="0.9" />
                <circle cx="380" cy="405" r="1.1" opacity="0.6" />
                <circle cx="455" cy="285" r="1.4" opacity="0.8" />
                <circle cx="520" cy="380" r="1.7" opacity="0.9" />
                <circle cx="595" cy="260" r="1.2" opacity="0.7" />
                <circle cx="655" cy="395" r="1.5" opacity="0.85" />
                <circle cx="725" cy="315" r="1.1" opacity="0.65" />
                <circle cx="805" cy="365" r="1.8" opacity="0.9" />
                <circle cx="880" cy="275" r="1.3" opacity="0.75" />
                <circle cx="945" cy="405" r="1.4" opacity="0.8" />
                <circle cx="1020" cy="340" r="1.6" opacity="0.85" />

                <circle cx="330" cy="145" r="1.3" fill="#b8dcff" opacity="0.8" />
                <circle cx="670" cy="235" r="1.4" fill="#ffe9b8" opacity="0.8" />
                <circle cx="875" cy="385" r="1.5" fill="#b8dcff" opacity="0.85" />
                <circle cx="205" cy="255" r="1.2" fill="#ffe9b8" opacity="0.7" />

                <path d="M465 92 L467 99 L474 101 L467 103 L465 110 L463 103 L456 101 L463 99 Z" opacity="0.9" />
                <path d="M825 235 L827 241 L833 243 L827 245 L825 251 L823 245 L817 243 L823 241 Z" opacity="0.85" />
                <path d="M195 385 L197 391 L203 393 L197 395 L195 401 L193 395 L187 393 L193 391 Z" opacity="0.8" />
                <path d="M980 245 L982 250 L987 252 L982 254 L980 259 L978 254 L973 252 L978 250 Z" opacity="0.75" />
              </g>

              {/* ============================================================
                  2. IDLE MODE: ASTEROIDS & SLIME ALIENS
                  ============================================================ */}
              <g className="asteroid-drift-slow">
                <use href="#asteroid-small" transform="translate(260, 124) scale(0.3)" />
                <use href="#asteroid-chunk" transform="translate(690, 175) scale(0.34)" />
                <use href="#asteroid-shard" transform="translate(940, 295) scale(0.32)" />
              </g>

              <g className="asteroid-drift-1">
                <use href="#asteroid-small" transform="translate(310, 175) scale(0.82)" />
              </g>

              <g className="asteroid-drift-2">
                <use href="#asteroid-shard" transform="translate(860, 145) scale(0.76)" />
              </g>

              <g className="asteroid-drift-3">
                <use href="#asteroid-chunk" transform="translate(650, 295) scale(0.84)" />
              </g>

              <g className="asteroid-drift-4">
                <use href="#asteroid-large" transform="translate(420, 345) scale(0.76)" />
              </g>

              <g className="asteroid-drift-5">
                <use href="#asteroid-small" transform="translate(600, 382) scale(0.6)" />
              </g>

              {/* Radial pale-white squish highlights for when aliens press their faces against the glass */}
              <radialGradient id="alienWhitenGreen" cx="50%" cy="48%" r="48%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
                <stop offset="55%" stopColor="#e8fff0" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#e8fff0" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="alienWhitenPurple" cx="50%" cy="48%" r="48%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
                <stop offset="55%" stopColor="#f5eaff" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#f5eaff" stopOpacity="0" />
              </radialGradient>

              {/* ALIEN 1: GREEN SLIME ALIEN (Bottom-Left Corner — legless/armless, sticks, presses/whitens, slides down) */}
              <g className="window-alien-green-wrapper">
                <g transform="translate(182, 414) scale(0.74) rotate(7)">
                  <g className="alien-body-squish-green">
                    {/* Antennae */}
                    <path d="M-14,-44 C-22,-68 -40,-72 -48,-62" fill="none" stroke="#0b0f0c" strokeWidth="8.5" strokeLinecap="round" />
                    <path d="M-14,-44 C-22,-68 -40,-72 -48,-62" fill="none" stroke="#42cc57" strokeWidth="4.2" strokeLinecap="round" />
                    <circle cx="-49" cy="-61" r="7.5" fill="#5ce06d" stroke="#0b0f0c" strokeWidth="2.8" />
                    <circle cx="-51" cy="-63" r="2" fill="#d9ffe0" />

                    <path d="M16,-44 C26,-68 18,-84 4,-84" fill="none" stroke="#0b0f0c" strokeWidth="8.5" strokeLinecap="round" />
                    <path d="M16,-44 C26,-68 18,-84 4,-84" fill="none" stroke="#42cc57" strokeWidth="4.2" strokeLinecap="round" />
                    <circle cx="3" cy="-84" r="7.5" fill="#5ce06d" stroke="#0b0f0c" strokeWidth="2.8" />
                    <circle cx="1" cy="-86" r="2" fill="#d9ffe0" />

                    {/* Smooth Rounded Legless/Armless Jelly Dome Body (no legs, arms, or tail shadow) */}
                    <path
                      d="M-38,14 C-42,-28 -22,-54 0,-54 C22,-54 42,-28 38,14 C40,34 26,44 0,44 C-26,44 -40,34 -38,14 Z"
                      fill="#44d158"
                      stroke="#0b0f0c"
                      strokeWidth="3.8"
                      strokeLinejoin="round"
                    />
                    <ellipse cx="-12" cy="-38" rx="11" ry="4.5" transform="rotate(-14 -12 -38)" fill="#96f2a1" opacity="0.72" />

                    {/* Pale/Whiter Pressed-Against-Glass Face Tone */}
                    <ellipse
                      cx="0"
                      cy="0"
                      rx="32"
                      ry="34"
                      fill="url(#alienWhitenGreen)"
                      className="alien-pressed-whiten-green"
                    />

                    {/* Normal Face (during initial stick) */}
                    <g className="alien-face-normal-green">
                      <circle cx="-14" cy="-12" r="13" fill="#ffffff" stroke="#0b0f0c" strokeWidth="3" />
                      <circle cx="14" cy="-12" r="13" fill="#ffffff" stroke="#0b0f0c" strokeWidth="3" />
                      <circle cx="-13" cy="-11" r="8.2" fill="#090a0c" />
                      <circle cx="13" cy="-11" r="8.2" fill="#090a0c" />
                      <circle cx="-16" cy="-15" r="2.8" fill="#ffffff" />
                      <circle cx="10" cy="-15" r="2.8" fill="#ffffff" />
                      <path d="M-8,12 Q0,18 8,12" fill="none" stroke="#0b0f0c" strokeWidth="2.8" strokeLinecap="round" />
                    </g>

                    {/* Squished Face (when pressing hard & whitening against glass) */}
                    <g className="alien-face-squish-green">
                      <ellipse cx="-15" cy="-12" rx="14" ry="8.5" fill="#ffffff" stroke="#0b0f0c" strokeWidth="3" />
                      <ellipse cx="15" cy="-12" rx="14" ry="8.5" fill="#ffffff" stroke="#0b0f0c" strokeWidth="3" />
                      <circle cx="-12" cy="-12" r="4.8" fill="#090a0c" />
                      <circle cx="12" cy="-12" r="4.8" fill="#090a0c" />
                      <path
                        d="M-15,10 Q0,2 15,10 Q18,22 0,24 Q-18,22 -15,10 Z"
                        fill="#1e5628"
                        stroke="#0b0f0c"
                        strokeWidth="2.8"
                        strokeLinejoin="round"
                      />
                      <ellipse cx="0" cy="18" rx="8" ry="3.5" fill="#fda4af" />
                    </g>
                  </g>
                </g>
              </g>

              {/* ALIEN 2: PURPLE SLIME ALIEN (Bottom-Right Corner — legless/armless, sticks, presses/whitens, slides down) */}
              <g className="window-alien-purple-wrapper">
                <g transform="translate(1016, 412) scale(0.74) rotate(-7)">
                  <g className="alien-body-squish-purple">
                    {/* Antennae */}
                    <path d="M-22,-42 C-30,-64 -48,-66 -54,-56" fill="none" stroke="#0c0812" strokeWidth="8" strokeLinecap="round" />
                    <path d="M-22,-42 C-30,-64 -48,-66 -54,-56" fill="none" stroke="#9834eb" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="-55" cy="-55" r="7" fill="#aa54f2" stroke="#0c0812" strokeWidth="2.6" />

                    <path d="M-8,-46 C-10,-70 -22,-82 -32,-80" fill="none" stroke="#0c0812" strokeWidth="8" strokeLinecap="round" />
                    <path d="M-8,-46 C-10,-70 -22,-82 -32,-80" fill="none" stroke="#9834eb" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="-33" cy="-80" r="6.5" fill="#aa54f2" stroke="#0c0812" strokeWidth="2.6" />

                    <path d="M12,-46 C16,-68 8,-80 -4,-76" fill="none" stroke="#0c0812" strokeWidth="8" strokeLinecap="round" />
                    <path d="M12,-46 C16,-68 8,-80 -4,-76" fill="none" stroke="#9834eb" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="-5" cy="-76" r="6.5" fill="#aa54f2" stroke="#0c0812" strokeWidth="2.6" />

                    <path d="M24,-42 C32,-68 28,-86 18,-86" fill="none" stroke="#0c0812" strokeWidth="8" strokeLinecap="round" />
                    <path d="M24,-42 C32,-68 28,-86 18,-86" fill="none" stroke="#9834eb" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="17" cy="-86" r="6" fill="#aa54f2" stroke="#0c0812" strokeWidth="2.6" />

                    {/* Smooth Rounded Legless/Armless Jelly Dome Body (no legs, arms, or tail shadow) */}
                    <path
                      d="M-38,14 C-42,-28 -22,-54 0,-54 C22,-54 42,-28 38,14 C40,34 26,44 0,44 C-26,44 -40,34 -38,14 Z"
                      fill="#9834eb"
                      stroke="#0c0812"
                      strokeWidth="3.8"
                      strokeLinejoin="round"
                    />
                    <ellipse cx="-16" cy="-34" rx="8" ry="11" transform="rotate(20 -16 -34)" fill="#cf94fc" opacity="0.65" />

                    {/* Pale/Whiter Pressed-Against-Glass Face Tone */}
                    <ellipse
                      cx="0"
                      cy="0"
                      rx="32"
                      ry="34"
                      fill="url(#alienWhitenPurple)"
                      className="alien-pressed-whiten-purple"
                    />

                    {/* Normal Face (during initial stick) */}
                    <g className="alien-face-normal-purple">
                      <circle cx="-14" cy="-14" r="10.5" fill="#09070d" stroke="#0c0812" strokeWidth="2" />
                      <circle cx="14" cy="-14" r="10.5" fill="#09070d" stroke="#0c0812" strokeWidth="2" />
                      <circle cx="-17" cy="-18" r="3" fill="#ffffff" />
                      <circle cx="11" cy="-18" r="3" fill="#ffffff" />
                      <path d="M-8,12 Q0,18 8,12" fill="none" stroke="#0c0812" strokeWidth="2.8" strokeLinecap="round" />
                    </g>

                    {/* Squished Face (when pressing hard & whitening against glass) */}
                    <g className="alien-face-squish-purple">
                      <polyline points="-22,-20 -10,-13 -22,-6" fill="none" stroke="#ffffff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points="22,-20 10,-13 22,-6" fill="none" stroke="#ffffff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
                      <path
                        d="M-16,10 Q0,2 16,10 Q18,22 0,24 Q-18,22 -16,10 Z"
                        fill="#3b0764"
                        stroke="#0c0812"
                        strokeWidth="2.8"
                        strokeLinejoin="round"
                      />
                      <ellipse cx="0" cy="18" rx="8" ry="3.5" fill="#f9a8d4" />
                    </g>
                  </g>
                </g>
              </g>
            </>
          )}

          {/* 3D Curved Monitor Side Depth Vignette & Glass Sheen */}
          <rect x="85" y="42" width="1030" height="458" fill="url(#curved-depth-vignette)" />
          <rect x="85" y="42" width="1030" height="458" fill="url(#window-sheen)" />
          {/* Curved specular sweep line across glass */}
          <path
            d="M170,74 Q600,108 1030,74"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            opacity="0.16"
            strokeLinecap="round"
          />
        </g>

        {/* ============================================================
            4. 3D CURVED COCKPIT WALLS, BEZEL & LOWER DASHBOARD
            ============================================================ */}

        {/* Outer Bulkhead Surround with Taller Curved Ultrawide Cutout */}
        <path
          fillRule="evenodd"
          d="M0,0 L1200,0 L1200,700 L0,700 Z M104,48 Q600,88 1096,48 L1108,60 L1108,476 L1096,490 Q600,456 104,490 L92,476 L92,60 Z"
          fill="#374352"
          stroke="#0c1017"
          strokeWidth="4"
        />

        {/* Curved 3D Side Wings shading (gives concave curved monitor illusion) */}
        <polygon points="0,36 76,48 76,488 0,512" fill="#465568" stroke="#0c1017" strokeWidth="2.5" />
        <polygon points="1200,36 1124,48 1124,488 1200,512" fill="#465568" stroke="#0c1017" strokeWidth="2.5" />

        {/* Lower Cockpit Dashboard Deck below the curved window sill */}
        <path
          d="M0,514 Q600,480 1200,514 L1200,700 L0,700 Z"
          fill="url(#cockpit-desk)"
          stroke="#0c1017"
          strokeWidth="4"
        />
        <path d="M0,536 Q600,502 1200,536" fill="none" stroke="#1b222c" strokeWidth="2.5" opacity="0.7" />
        <line x1="104" y1="506" x2="64" y2="700" stroke="#1b222c" strokeWidth="3" />
        <line x1="1096" y1="506" x2="1136" y2="700" stroke="#1b222c" strokeWidth="3" />

        {/* Upper bulkhead curved seam lines */}
        <g stroke="#1b222c" strokeWidth="3" fill="none">
          <path d="M0,30 Q600,66 1200,30" />
          <line x1="280" y1="0" x2="280" y2="42" />
          <line x1="600" y1="0" x2="600" y2="48" />
          <line x1="920" y1="0" x2="920" y2="42" />
        </g>

        {/* 3D Curved Monitor Window Bezel Frame */}
        <path
          fillRule="evenodd"
          d="M88,34 Q600,74 1112,34 C1124,34 1132,44 1132,56 L1132,482 C1132,494 1124,504 1112,504 Q600,470 88,504 C76,504 68,494 68,482 L68,56 C68,44 76,34 88,34 Z M104,48 Q600,88 1096,48 L1108,60 L1108,476 L1096,490 Q600,456 104,490 L92,476 L92,60 Z"
          fill="url(#frame-metal)"
          stroke="#0c1017"
          strokeWidth="4"
        />

        {/* Curved Inner Rim Highlight for 3D Curved Bevel */}
        <path
          d="M104,50 Q600,90 1096,50"
          fill="none"
          stroke="#7e94ad"
          strokeWidth="2"
          opacity="0.65"
        />
        <path
          d="M104,488 Q600,454 1096,488"
          fill="none"
          stroke="#7e94ad"
          strokeWidth="2"
          opacity="0.5"
        />

        {/* Curved Perimeter Rivets following the 3D monitor frame curve */}
        <g fill="#222a36" stroke="#5b6c82" strokeWidth="1.2">
          {/* Top curved rivets */}
          <circle cx="150" cy="47" r="3.4" />
          <circle cx="240" cy="54" r="3.4" />
          <circle cx="330" cy="60" r="3.4" />
          <circle cx="420" cy="64" r="3.4" />
          <circle cx="510" cy="67" r="3.4" />
          <circle cx="600" cy="68" r="3.4" />
          <circle cx="690" cy="67" r="3.4" />
          <circle cx="780" cy="64" r="3.4" />
          <circle cx="870" cy="60" r="3.4" />
          <circle cx="960" cy="54" r="3.4" />
          <circle cx="1050" cy="47" r="3.4" />

          {/* Bottom curved rivets */}
          <circle cx="150" cy="492" r="3.4" />
          <circle cx="240" cy="486" r="3.4" />
          <circle cx="330" cy="482" r="3.4" />
          <circle cx="420" cy="478" r="3.4" />
          <circle cx="510" cy="476" r="3.4" />
          <circle cx="600" cy="475" r="3.4" />
          <circle cx="690" cy="476" r="3.4" />
          <circle cx="780" cy="478" r="3.4" />
          <circle cx="870" cy="482" r="3.4" />
          <circle cx="960" cy="486" r="3.4" />
          <circle cx="1050" cy="492" r="3.4" />

          {/* Side rivets */}
          <circle cx="80" cy="125" r="3.4" />
          <circle cx="80" cy="225" r="3.4" />
          <circle cx="80" cy="325" r="3.4" />
          <circle cx="80" cy="425" r="3.4" />
          <circle cx="1120" cy="125" r="3.4" />
          <circle cx="1120" cy="225" r="3.4" />
          <circle cx="1120" cy="325" r="3.4" />
          <circle cx="1120" cy="425" r="3.4" />
        </g>

        {/* Left upper wall intercom box */}
        <g transform="translate(8, 105)">
          <rect x="0" y="0" width="44" height="68" rx="4" fill="#465466" stroke="#0c1017" strokeWidth="3" />
          <rect x="6" y="8" width="32" height="24" rx="2" fill="#2d3744" stroke="#0c1017" strokeWidth="2" />
          <rect x="8" y="42" width="12" height="12" rx="2" fill="#2d3744" stroke="#0c1017" strokeWidth="2" />
          <rect x="24" y="42" width="12" height="12" rx="2" fill="#2d3744" stroke="#0c1017" strokeWidth="2" />
        </g>

        {/* Far-corner decorative dashboard controls */}
        <g>
          <polygon points="0,535 76,552 94,700 0,700" fill="#475569" stroke="#0c1017" strokeWidth="3.5" />
          <polygon points="10,565 62,578 72,642 14,628" fill="#26303d" stroke="#0c1017" strokeWidth="2" />
        </g>
        <g>
          <polygon points="1200,535 1124,552 1106,700 1200,700" fill="#475569" stroke="#0c1017" strokeWidth="3.5" />
          <polygon points="1138,578 1190,565 1186,628 1128,642" fill="#26303d" stroke="#0c1017" strokeWidth="2" />
          <line x1="1178" y1="570" x2="1192" y2="528" stroke="#0c1017" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="1192" cy="528" r="6" fill="#526275" stroke="#0c1017" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
};
