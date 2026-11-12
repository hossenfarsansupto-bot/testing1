import React from 'react';

/**
 * Pseudo-logo "COSMIC SAGA" rendered with an etched/frosted glass HUD effect
 * so it appears physically etched onto the curved cockpit window glass.
 */
export const CosmicSagaLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`cosmic-saga-logo-wrap ${className || ''}`}>
      <svg
        className="cosmic-saga-logo-svg"
        viewBox="0 0 760 220"
        role="img"
        aria-label="Cosmic Saga"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Etched glass rim stroke gradient */}
          <linearGradient id="glass-rim-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.68" />
            <stop offset="35%" stopColor="#9be2ff" stopOpacity="0.34" />
            <stop offset="65%" stopColor="#e3f7ff" stopOpacity="0.58" />
            <stop offset="100%" stopColor="#80d4ff" stopOpacity="0.26" />
          </linearGradient>

          {/* Subtle frosted interior tint so stars & asteroids show through */}
          <linearGradient id="glass-frosted-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d8f4ff" stopOpacity="0.12" />
            <stop offset="45%" stopColor="#a6e2ff" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#dff7ff" stopOpacity="0.09" />
          </linearGradient>

          {/* Diagonal window glass reflection sheen across logo */}
          <linearGradient id="glass-specular-sweep" x1="0%" y1="0%" x2="100%" y2="30%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="38%" stopColor="#ffffff" stopOpacity="0.03" />
            <stop offset="48%" stopColor="#e8faff" stopOpacity="0.22" />
            <stop offset="56%" stopColor="#ffffff" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Subtle etched-glass refraction glow */}
          <filter id="hud-glass-etch" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#7ee8ff" floodOpacity="0.28" />
            <feDropShadow dx="0" dy="-1" stdDeviation="1" floodColor="#ffffff" floodOpacity="0.22" />
          </filter>
        </defs>

        <g
          filter="url(#hud-glass-etch)"
          fill="url(#glass-frosted-fill)"
          stroke="url(#glass-rim-stroke)"
          strokeLinejoin="round"
        >
          {/* ==========================================================
              TOP ROW: C O S M I C
              ========================================================== */}

          {/* C */}
          <g transform="translate(24, 14)">
            <path
              d="M16,0 L102,0 L102,24 L34,24 L26,32 L26,56 L34,64 L102,64 L102,88 L16,88 L0,72 L0,16 Z"
              strokeWidth="2.4"
            />
            <path
              d="M19,5 L97,5 L97,19 L31,19 L21,29 L21,59 L31,69 L97,69 L97,83 L19,83 L5,69 L5,19 Z"
              strokeWidth="1.2"
              fill="none"
              opacity="0.65"
            />
            <g fill="none" opacity="0.55">
              <path d="M22,9 L26,15 M29,9 L33,15 M36,9 L40,15 M43,9 L47,15" strokeWidth="1.2" />
              <path d="M12,42 L18,42 M15,39 L15,45" strokeWidth="1.3" />
            </g>
            <g fill="#d6f5ff" fillOpacity="0.55" stroke="none">
              <circle cx="54" cy="75" r="1.4" />
              <circle cx="60" cy="75" r="1.4" />
              <circle cx="66" cy="75" r="1.4" />
              <circle cx="54" cy="79" r="1.4" />
              <circle cx="60" cy="79" r="1.4" />
              <circle cx="66" cy="79" r="1.4" />
            </g>
          </g>

          {/* O */}
          <g transform="translate(142, 14)">
            <path
              d="M16,0 L86,0 L102,16 L102,72 L86,88 L16,88 L0,72 L0,16 Z"
              strokeWidth="2.4"
            />
            <path
              d="M19,5 L83,5 L97,19 L97,69 L83,83 L19,83 L5,69 L5,19 Z"
              strokeWidth="1.2"
              fill="none"
              opacity="0.65"
            />
            <path d="M32,22 L70,22 L76,28 L76,60 L70,66 L32,66 L26,60 L26,28 Z" strokeWidth="2.1" fill="#000000" fillOpacity="0.08" />
            <path d="M34,26 L68,26 L72,30 L72,58 L68,62 L34,62 L30,58 L30,30 Z" strokeWidth="1" fill="none" opacity="0.55" />
            <g fill="none" opacity="0.55">
              <path d="M84,12 L90,12 M87,9 L87,15" strokeWidth="1.3" />
              <path d="M10,34 L16,38 M10,40 L16,44 M10,46 L16,50" strokeWidth="1.2" />
            </g>
            <g fill="#d6f5ff" fillOpacity="0.55" stroke="none">
              <circle cx="44" cy="74" r="1.3" />
              <circle cx="50" cy="74" r="1.3" />
              <circle cx="56" cy="74" r="1.3" />
            </g>
          </g>

          {/* S */}
          <g transform="translate(260, 14)">
            <path
              d="M16,0 L102,0 L102,22 L32,22 L26,28 L26,33 L88,33 L102,47 L102,72 L86,88 L0,88 L0,66 L70,66 L76,60 L76,55 L14,55 L0,41 L0,16 Z"
              strokeWidth="2.4"
            />
            <path
              d="M19,5 L97,5 L97,17 L29,17 L21,25 L21,38 L85,38 L97,50 L97,69 L83,83 L5,83 L5,71 L73,71 L81,63 L81,50 L17,50 L5,38 L5,19 Z"
              strokeWidth="1.2"
              fill="none"
              opacity="0.65"
            />
            <path d="M24,9 L28,14 M31,9 L35,14 M38,9 L42,14" strokeWidth="1.2" fill="none" opacity="0.55" />
            <g fill="#d6f5ff" fillOpacity="0.55" stroke="none">
              <circle cx="38" cy="76" r="1.4" />
              <circle cx="44" cy="76" r="1.4" />
              <circle cx="50" cy="76" r="1.4" />
              <circle cx="56" cy="76" r="1.4" />
            </g>
          </g>

          {/* M */}
          <g transform="translate(378, 14)">
            <path
              d="M0,0 L28,0 L61,34 L94,0 L122,0 L122,88 L96,88 L96,38 L61,72 L26,38 L26,88 L0,88 Z"
              strokeWidth="2.4"
            />
            <path
              d="M5,5 L25,5 L61,41 L97,5 L117,5 L117,83 L101,83 L101,31 L61,69 L21,31 L21,83 L5,83 Z"
              strokeWidth="1.2"
              fill="none"
              opacity="0.65"
            />
            <path d="M104,13 L110,13 M107,10 L107,16" strokeWidth="1.3" fill="none" opacity="0.55" />
            <g fill="#d6f5ff" fillOpacity="0.55" stroke="none">
              <circle cx="11" cy="68" r="1.3" />
              <circle cx="16" cy="68" r="1.3" />
              <circle cx="11" cy="74" r="1.3" />
              <circle cx="16" cy="74" r="1.3" />
              <circle cx="106" cy="68" r="1.3" />
              <circle cx="111" cy="68" r="1.3" />
              <circle cx="106" cy="74" r="1.3" />
              <circle cx="111" cy="74" r="1.3" />
            </g>
          </g>

          {/* I */}
          <g transform="translate(516, 14)">
            <path
              d="M0,0 L34,0 L34,88 L0,88 Z"
              strokeWidth="2.4"
            />
            <path d="M5,5 L29,5 L29,83 L5,83 Z" strokeWidth="1.2" fill="none" opacity="0.65" />
            <path d="M10,20 L10,44 M24,44 L24,68" strokeWidth="1.2" fill="none" opacity="0.55" />
            <g fill="#d6f5ff" fillOpacity="0.55" stroke="none">
              <circle cx="17" cy="12" r="1.5" />
              <circle cx="17" cy="76" r="1.5" />
            </g>
          </g>

          {/* C */}
          <g transform="translate(566, 14)">
            <path
              d="M16,0 L102,0 L102,24 L34,24 L26,32 L26,56 L34,64 L102,64 L102,88 L16,88 L0,72 L0,16 Z"
              strokeWidth="2.4"
            />
            <path
              d="M19,5 L97,5 L97,19 L31,19 L21,29 L21,59 L31,69 L97,69 L97,83 L19,83 L5,69 L5,19 Z"
              strokeWidth="1.2"
              fill="none"
              opacity="0.65"
            />
            <g fill="none" opacity="0.55">
              <path d="M12,42 L18,42 M15,39 L15,45" strokeWidth="1.3" />
              <path d="M62,9 L66,15 M69,9 L73,15 M76,9 L80,15" strokeWidth="1.2" />
            </g>
            <g fill="#d6f5ff" fillOpacity="0.55" stroke="none">
              <circle cx="48" cy="76" r="1.4" />
              <circle cx="54" cy="76" r="1.4" />
              <circle cx="60" cy="76" r="1.4" />
            </g>
          </g>

          {/* ==========================================================
              BOTTOM ROW: S A G A (Centered under COSMIC)
              ========================================================== */}

          {/* S */}
          <g transform="translate(128, 118)">
            <path
              d="M16,0 L104,0 L104,22 L32,22 L26,28 L26,33 L90,33 L104,47 L104,72 L88,88 L0,88 L0,66 L72,66 L78,60 L78,55 L14,55 L0,41 L0,16 Z"
              strokeWidth="2.4"
            />
            <path
              d="M19,5 L99,5 L99,17 L29,17 L21,25 L21,38 L87,38 L99,50 L99,69 L85,83 L5,83 L5,71 L75,71 L83,63 L83,50 L17,50 L5,38 L5,19 Z"
              strokeWidth="1.2"
              fill="none"
              opacity="0.65"
            />
            <path d="M24,9 L28,14 M31,9 L35,14 M38,9 L42,14" strokeWidth="1.2" fill="none" opacity="0.55" />
          </g>

          {/* A */}
          <g transform="translate(248, 118)">
            <path
              d="M18,0 L92,0 L110,18 L110,88 L82,88 L82,60 L28,60 L28,88 L0,88 L0,18 Z"
              strokeWidth="2.4"
            />
            <path
              d="M21,5 L89,5 L105,21 L105,83 L87,83 L87,55 L23,55 L23,83 L5,83 L5,21 Z"
              strokeWidth="1.2"
              fill="none"
              opacity="0.65"
            />
            <rect x="28" y="22" width="54" height="16" rx="2" strokeWidth="2" fill="#000000" fillOpacity="0.08" />
            <g fill="#d6f5ff" fillOpacity="0.55" stroke="none">
              <circle cx="46" cy="46" r="1.4" />
              <circle cx="52" cy="46" r="1.4" />
              <circle cx="58" cy="46" r="1.4" />
              <circle cx="64" cy="46" r="1.4" />
              <circle cx="46" cy="51" r="1.4" />
              <circle cx="52" cy="51" r="1.4" />
              <circle cx="58" cy="51" r="1.4" />
              <circle cx="64" cy="51" r="1.4" />
            </g>
            <path d="M62,74 L68,74 M65,71 L65,77" strokeWidth="1.3" fill="none" opacity="0.55" />
          </g>

          {/* G */}
          <g transform="translate(374, 118)">
            <path
              d="M16,0 L108,0 L108,22 L34,22 L26,30 L26,58 L34,66 L84,66 L84,52 L54,52 L54,34 L108,34 L108,88 L16,88 L0,72 L0,16 Z"
              strokeWidth="2.4"
            />
            <path
              d="M19,5 L103,5 L103,17 L31,17 L21,27 L21,61 L31,71 L89,71 L89,47 L59,47 L59,39 L103,39 L103,83 L19,83 L5,69 L5,19 Z"
              strokeWidth="1.2"
              fill="none"
              opacity="0.65"
            />
            <g fill="none" opacity="0.55">
              <path d="M36,36 L42,36 M39,33 L39,39" strokeWidth="1.3" />
              <path d="M9,48 L15,52 M9,54 L15,58 M9,60 L15,64" strokeWidth="1.2" />
            </g>
          </g>

          {/* A */}
          <g transform="translate(498, 118)">
            <path
              d="M18,0 L92,0 L110,18 L110,88 L82,88 L82,60 L28,60 L28,88 L0,88 L0,18 Z"
              strokeWidth="2.4"
            />
            <path
              d="M21,5 L89,5 L105,21 L105,83 L87,83 L87,55 L23,55 L23,83 L5,83 L5,21 Z"
              strokeWidth="1.2"
              fill="none"
              opacity="0.65"
            />
            <rect x="28" y="22" width="54" height="16" rx="2" strokeWidth="2" fill="#000000" fillOpacity="0.08" />
            <g fill="#d6f5ff" fillOpacity="0.55" stroke="none">
              <circle cx="46" cy="46" r="1.4" />
              <circle cx="52" cy="46" r="1.4" />
              <circle cx="58" cy="46" r="1.4" />
              <circle cx="64" cy="46" r="1.4" />
              <circle cx="46" cy="51" r="1.4" />
              <circle cx="52" cy="51" r="1.4" />
              <circle cx="58" cy="51" r="1.4" />
              <circle cx="64" cy="51" r="1.4" />
            </g>
          </g>
        </g>

        {/* Subtle diagonal glass reflection sheen across the etched logo */}
        <rect
          x="10"
          y="6"
          width="740"
          height="208"
          rx="12"
          fill="url(#glass-specular-sweep)"
          pointerEvents="none"
        />
      </svg>
    </div>
  );
};
