import React from 'react';

export type CatbotStage =
  | 'beside_pad'
  | 'crossing_window'
  | 'outside_rover'
  | 'returning_in';

export type CatbotExpression =
  | 'neutral'
  | 'happy'
  | 'delighted'
  | 'excited'
  | 'scanning'
  | 'thinking'
  | 'calibrating'
  | 'awkward'
  | 'alert';

export type CatbotGesture =
  | 'idle'
  | 'wave'
  | 'present'
  | 'point_display'
  | 'open_arms'
  | 'cheer';

interface FeliceCatbotProps {
  stage: CatbotStage;
  isTalking?: boolean;
  leanDir?: 'left' | 'right' | null;
  statusText?: string;
  showThrusters?: boolean;
  expression?: CatbotExpression;
  gesture?: CatbotGesture;
  onClick?: () => void;
  interactive?: boolean;
}

function VisorFace({
  expression,
  isTalking
}: {
  expression: CatbotExpression;
  isTalking: boolean;
}) {
  const talkActive =
    isTalking && expression !== 'calibrating' && expression !== 'awkward';

  return (
    <g className="catbot-visor-expressions">
      {/* Eyes matching Images 1 & 2 neon cyan OLED display */}
      {expression === 'happy' || expression === 'delighted' ? (
        /* Image 2: smooth glowing upturned happy cyan arch eyes */
        <g
          fill="none"
          stroke="#2ceeff"
          strokeWidth="4.8"
          strokeLinecap="round"
          filter="url(#feliceCyanGlow)"
        >
          <path d="M46,66 Q58,52 70,66" />
          <path d="M90,66 Q102,52 114,66" />
        </g>
      ) : expression === 'excited' ? (
        <g
          fill="none"
          stroke="#2ceeff"
          strokeWidth="4.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#feliceCyanGlow)"
        >
          <polyline points="48,54 66,62 48,70" />
          <polyline points="112,54 94,62 112,70" />
        </g>
      ) : expression === 'scanning' ? (
        <g filter="url(#feliceCyanGlow)">
          <rect x="49" y="51" width="15" height="22" rx="7.5" fill="#2ceeff" />
          <rect x="94" y="59" width="19" height="7" rx="3.5" fill="#2ceeff" />
          <line
            x1="40"
            y1="62"
            x2="120"
            y2="62"
            stroke="#a5f3fc"
            strokeWidth="1.8"
            opacity="0.75"
            className="catbot-scan-beam"
          />
        </g>
      ) : expression === 'thinking' ? (
        <g filter="url(#feliceCyanGlow)">
          <path
            d="M49,64 Q57,57 65,64"
            fill="none"
            stroke="#2ceeff"
            strokeWidth="4.2"
            strokeLinecap="round"
          />
          <rect x="96" y="52" width="14" height="20" rx="7" fill="#2ceeff" />
        </g>
      ) : expression === 'calibrating' ? (
        <g className="catbot-calibrating-bars" fill="#2ceeff" filter="url(#feliceCyanGlow)">
          <rect x="49" y="56" width="4.5" height="12" rx="2" />
          <rect x="57" y="51" width="4.5" height="22" rx="2" />
          <rect x="65" y="58" width="4.5" height="8" rx="2" />
          <rect x="91" y="58" width="4.5" height="8" rx="2" />
          <rect x="99" y="51" width="4.5" height="22" rx="2" />
          <rect x="107" y="56" width="4.5" height="12" rx="2" />
        </g>
      ) : expression === 'awkward' ? (
        <g stroke="#2ceeff" strokeWidth="4" strokeLinecap="round" filter="url(#feliceCyanGlow)">
          <line x1="49" y1="62" x2="67" y2="62" />
          <line x1="93" y1="62" x2="111" y2="62" />
        </g>
      ) : expression === 'alert' ? (
        <g fill="none" stroke="#2ceeff" strokeWidth="3.8" filter="url(#feliceCyanGlow)">
          <rect x="49" y="51" width="16" height="22" rx="8" />
          <circle cx="57" cy="62" r="2.6" fill="#cffafe" stroke="none" />
          <rect x="95" y="51" width="16" height="22" rx="8" />
          <circle cx="103" cy="62" r="2.6" fill="#cffafe" stroke="none" />
        </g>
      ) : (
        /* Image 1: Pill-shaped solid glowing cyan vertical oval eyes */
        <g className="catbot-eyes-blink" filter="url(#feliceCyanGlow)">
          <rect x="48" y="49" width="17" height="26" rx="8.5" fill="url(#feliceEyeCyan)" />
          <rect x="95" y="49" width="17" height="26" rx="8.5" fill="url(#feliceEyeCyan)" />
        </g>
      )}

      {/* Glowing Cyan Cat Mouth matching Images 1 & 2 */}
      {expression === 'calibrating' ? (
        <line
          x1="70"
          y1="79"
          x2="90"
          y2="79"
          stroke="#2ceeff"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeDasharray="3 3"
        />
      ) : expression === 'awkward' ? (
        <line
          x1="72"
          y1="79"
          x2="88"
          y2="77"
          stroke="#2ceeff"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      ) : expression === 'alert' ? (
        <circle
          cx="80"
          cy="79"
          r="3.6"
          fill="none"
          stroke="#2ceeff"
          strokeWidth="2.8"
        />
      ) : expression === 'happy' ||
        expression === 'delighted' ||
        expression === 'excited' ||
        talkActive ? (
        /* Image 2: Joyful open :3D glowing cyan cat mouth */
        <g className={talkActive ? 'catbot-mouth-talk' : ''} filter="url(#feliceCyanGlow)">
          <path
            d="M71,74 Q75.5,79 80,74 Q84.5,79 89,74"
            fill="none"
            stroke="#5ef5ff"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M72.5,76 Q80,88 87.5,76 Z"
            fill="#19d4ff"
            stroke="#7ef9ff"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </g>
      ) : (
        /* Image 1: Minimalist glowing cyan w cat mouth */
        <path
          d="M72,77 Q76,81.5 80,77 Q84,81.5 88,77"
          fill="none"
          stroke="#4ef2ff"
          strokeWidth="2.8"
          strokeLinecap="round"
          filter="url(#feliceCyanGlow)"
        />
      )}
    </g>
  );
}

function RobotArm({
  side,
  gesture,
  isTalking
}: {
  side: 'left' | 'right';
  gesture: CatbotGesture;
  isTalking: boolean;
}) {
  // Hand & forearm geometry modeled directly on Images 1, 2 & 3:
  // Pearl white shoulder cap -> dark gunmetal upper arm joint -> white tapered forearm cuff with glowing cyan oval insert -> articulated dark-steel gloved fingers
  if (side === 'left') {
    if (gesture === 'wave' || gesture === 'open_arms' || gesture === 'cheer') {
      /* Raised joyful/waving arm geometry modeled from Image 2 */
      const cls =
        gesture === 'wave'
          ? 'catbot-arm-gesture-wave'
          : gesture === 'cheer'
            ? 'catbot-arm-gesture-cheer-left'
            : '';
      return (
        <g className={cls}>
          {/* Shoulder ball & socket cyan slit */}
          <path d="M52,110 Q48,116 52,122" fill="none" stroke="#00e5ff" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="48" cy="113" r="8" fill="url(#feliceWhiteGrad)" stroke="#0c1017" strokeWidth="2.4" />
          {/* Dark gunmetal elbow */}
          <line x1="43" y1="110" x2="34" y2="103" stroke="#0c1017" strokeWidth="10" strokeLinecap="round" />
          <line x1="43" y1="110" x2="34" y2="103" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
          {/* White forearm cuff + glowing cyan bottom/side pod */}
          <path d="M36,105 L24,95" stroke="#0c1017" strokeWidth="14" strokeLinecap="round" />
          <path d="M36,105 L24,95" stroke="url(#feliceWhiteGrad)" strokeWidth="9.5" strokeLinecap="round" />
          <ellipse cx="29" cy="103" rx="4.5" ry="2.4" transform="rotate(36 29 103)" fill="#2ceeff" />
          {/* Dark robotic open hand with white palm pad + articulated 4 fingers + thumb (Image 2) */}
          <circle cx="20" cy="91" r="6.5" fill="#1e293b" stroke="#0c1017" strokeWidth="2.2" />
          <ellipse cx="20" cy="91" rx="4" ry="3.2" fill="#f1f5f9" />
          <line x1="15" y1="88" x2="10" y2="83" stroke="#0c1017" strokeWidth="3.6" strokeLinecap="round" />
          <line x1="15" y1="88" x2="10" y2="83" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="18" y1="85" x2="15" y2="79" stroke="#0c1017" strokeWidth="3.6" strokeLinecap="round" />
          <line x1="18" y1="85" x2="15" y2="79" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="22" y1="85" x2="21" y2="78" stroke="#0c1017" strokeWidth="3.6" strokeLinecap="round" />
          <line x1="22" y1="85" x2="21" y2="78" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="25" y1="88" x2="27" y2="83" stroke="#0c1017" strokeWidth="3.4" strokeLinecap="round" />
          <line x1="25" y1="88" x2="27" y2="83" stroke="#334155" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      );
    }

    if (gesture === 'point_display') {
      return (
        <g className="catbot-arm-gesture-point">
          <path d="M52,110 Q48,116 52,122" fill="none" stroke="#00e5ff" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="48" cy="113" r="8" fill="url(#feliceWhiteGrad)" stroke="#0c1017" strokeWidth="2.4" />
          <line x1="42" y1="113" x2="31" y2="112" stroke="#0c1017" strokeWidth="9.5" strokeLinecap="round" />
          <line x1="42" y1="113" x2="31" y2="112" stroke="#1e293b" strokeWidth="5.8" strokeLinecap="round" />
          <path d="M32,112 L19,110" stroke="#0c1017" strokeWidth="13.5" strokeLinecap="round" />
          <path d="M32,112 L19,110" stroke="url(#feliceWhiteGrad)" strokeWidth="9" strokeLinecap="round" />
          <ellipse cx="25" cy="108" rx="4.5" ry="2.2" fill="#2ceeff" />
          <circle cx="14" cy="109" r="6" fill="#1e293b" stroke="#0c1017" strokeWidth="2.2" />
          <line x1="9" y1="108" x2="4" y2="107" stroke="#2ceeff" strokeWidth="2.6" strokeLinecap="round" />
        </g>
      );
    }

    /* Image 1 standing left arm with white cuff, cyan oval light & dark curled fist */
    return (
      <g className={isTalking ? 'catbot-arm-wave' : ''}>
        <path d="M52,110 Q48,116 52,122" fill="none" stroke="#00e5ff" strokeWidth="2.4" strokeLinecap="round" />
        <ellipse cx="48" cy="115" rx="7.5" ry="8.5" transform="rotate(14 48 115)" fill="url(#feliceWhiteGrad)" stroke="#0c1017" strokeWidth="2.4" />
        <path d="M44,121 L40,129" stroke="#0c1017" strokeWidth="9.5" strokeLinecap="round" />
        <path d="M44,121 L40,129" stroke="#1e293b" strokeWidth="5.8" strokeLinecap="round" />
        <path d="M40,127 L36,138" stroke="#0c1017" strokeWidth="13.5" strokeLinecap="round" />
        <path d="M40,127 L36,138" stroke="url(#feliceWhiteGrad)" strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="34" cy="133" rx="2.3" ry="4.5" transform="rotate(16 34 133)" fill="#2ceeff" />
        <ellipse cx="36" cy="144" rx="5.5" ry="6" fill="#1e293b" stroke="#0c1017" strokeWidth="2.2" />
        <path d="M33,145 Q36,147 39,145" fill="none" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round" />
      </g>
    );
  }

  // Right arm (viewer's right)
  if (gesture === 'open_arms' || gesture === 'present' || gesture === 'cheer') {
    /* Raised joyful open right arm from Image 2 */
    const cls =
      gesture === 'present'
        ? 'catbot-arm-gesture-present'
        : gesture === 'cheer'
          ? 'catbot-arm-gesture-cheer-right'
          : '';
    return (
      <g className={cls}>
        <path d="M108,110 Q112,116 108,122" fill="none" stroke="#00e5ff" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="112" cy="113" r="8" fill="url(#feliceWhiteGrad)" stroke="#0c1017" strokeWidth="2.4" />
        <line x1="117" y1="110" x2="126" y2="103" stroke="#0c1017" strokeWidth="10" strokeLinecap="round" />
        <line x1="117" y1="110" x2="126" y2="103" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
        <path d="M124,105 L136,95" stroke="#0c1017" strokeWidth="14" strokeLinecap="round" />
        <path d="M124,105 L136,95" stroke="url(#feliceWhiteGrad)" strokeWidth="9.5" strokeLinecap="round" />
        <ellipse cx="131" cy="103" rx="4.5" ry="2.4" transform="rotate(-36 131 103)" fill="#2ceeff" />
        <circle cx="140" cy="91" r="6.5" fill="#1e293b" stroke="#0c1017" strokeWidth="2.2" />
        <ellipse cx="140" cy="91" rx="4" ry="3.2" fill="#f1f5f9" />
        <line x1="145" y1="88" x2="150" y2="83" stroke="#0c1017" strokeWidth="3.6" strokeLinecap="round" />
        <line x1="145" y1="88" x2="150" y2="83" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="142" y1="85" x2="145" y2="79" stroke="#0c1017" strokeWidth="3.6" strokeLinecap="round" />
        <line x1="142" y1="85" x2="145" y2="79" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="138" y1="85" x2="139" y2="78" stroke="#0c1017" strokeWidth="3.6" strokeLinecap="round" />
        <line x1="138" y1="85" x2="139" y2="78" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="135" y1="88" x2="133" y2="83" stroke="#0c1017" strokeWidth="3.4" strokeLinecap="round" />
        <line x1="135" y1="88" x2="133" y2="83" stroke="#334155" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    );
  }

  /* Image 1 standing right arm with white cuff, cyan oval light & dark curled fist */
  return (
    <g>
      <path d="M108,110 Q112,116 108,122" fill="none" stroke="#00e5ff" strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="112" cy="115" rx="7.5" ry="8.5" transform="rotate(-14 112 115)" fill="url(#feliceWhiteGrad)" stroke="#0c1017" strokeWidth="2.4" />
      <path d="M116,121 L120,129" stroke="#0c1017" strokeWidth="9.5" strokeLinecap="round" />
      <path d="M116,121 L120,129" stroke="#1e293b" strokeWidth="5.8" strokeLinecap="round" />
      <path d="M120,127 L124,138" stroke="#0c1017" strokeWidth="13.5" strokeLinecap="round" />
      <path d="M120,127 L124,138" stroke="url(#feliceWhiteGrad)" strokeWidth="9" strokeLinecap="round" />
      <ellipse cx="126" cy="133" rx="2.3" ry="4.5" transform="rotate(-16 126 133)" fill="#2ceeff" />
      <ellipse cx="124" cy="144" rx="5.5" ry="6" fill="#1e293b" stroke="#0c1017" strokeWidth="2.2" />
      <path d="M121,145 Q124,147 127,145" fill="none" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}

/**
 * 2.5D stylized Catbot Felice faithfully remodeled from the 3 official reference sheets:
 * White-pearl armor, glowing cyan spherical antenna, two cat ears with glowing cyan cores,
 * circular cyan-lit side ear pods, glowing cyan cat-paw chest badge, and rounded boots with cyan toe slits.
 */
export const FeliceCatbot: React.FC<FeliceCatbotProps> = ({
  stage,
  isTalking = false,
  leanDir = null,
  statusText,
  showThrusters = false,
  expression = 'neutral',
  gesture = 'idle',
  onClick,
  interactive = false
}) => {
  const showBoosters =
    showThrusters || stage === 'crossing_window' || stage === 'returning_in';

  return (
    <div
      className={`felice-catbot-dock stage-${stage} expr-${expression} gesture-${gesture} ${
        isTalking ? 'is-talking' : ''
      } ${leanDir ? `lean-${leanDir}` : ''} ${interactive ? 'is-interactive' : ''}`}
      aria-hidden={interactive ? undefined : true}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? onClick : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      {stage === 'outside_rover' ? (
        <div className="catbot-eva-badge">
          <span className="catbot-eva-dot" />
          <span>FELICE // OUTSIDE EVA</span>
        </div>
      ) : (
        <div className="catbot-figure-wrap">
          {statusText && (
            <div className="catbot-speech-pill">{statusText}</div>
          )}
          <svg
            className="catbot-body-svg"
            viewBox="0 0 160 192"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Pearl-white & cool silver 2.5D armor gradient matching reference sheets */}
              <linearGradient id="feliceWhiteGrad" x1="15%" y1="0%" x2="85%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="58%" stopColor="#e2e8f8" />
                <stop offset="100%" stopColor="#9aa8c7" />
              </linearGradient>
              <linearGradient id="feliceSlateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#323d54" />
                <stop offset="55%" stopColor="#1a2234" />
                <stop offset="100%" stopColor="#0e1320" />
              </linearGradient>
              <linearGradient id="feliceEyeCyan" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8efbff" />
                <stop offset="100%" stopColor="#00c8ff" />
              </linearGradient>
              <radialGradient id="feliceAntennaGlow" cx="42%" cy="38%" r="58%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#6cf7ff" />
                <stop offset="100%" stopColor="#00bfff" />
              </radialGradient>
              <radialGradient id="feliceFloorShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(0, 229, 255, 0.34)" />
                <stop offset="70%" stopColor="rgba(2, 8, 22, 0.48)" />
                <stop offset="100%" stopColor="rgba(2, 8, 22, 0)" />
              </radialGradient>
              <filter id="feliceCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 2.5D Floor / Hover Shadow */}
            {!showBoosters && (
              <ellipse
                cx="80"
                cy="183"
                rx="40"
                ry="7"
                fill="url(#feliceFloorShadow)"
                className="catbot-hover-shadow"
              />
            )}

            {/* Cyan Jet-Boot Thrusters when flying / boarding */}
            {showBoosters && (
              <g className="catbot-jet-flames">
                <polygon points="56,177 68,177 62,191" fill="#00e5ff" />
                <polygon points="59,177 65,177 62,187" fill="#ffffff" />
                <polygon points="92,177 104,177 98,191" fill="#00e5ff" />
                <polygon points="95,177 101,177 98,187" fill="#ffffff" />
              </g>
            )}

            {/* Segmented White & Dark-Navy Legs + Cyan-Lit Rounded Toe Boots (Images 1, 2, 3) */}
            <g>
              {/* Gunmetal hip ball joints */}
              <path d="M56,133 Q64,142 74,144 L61,150 Q52,143 56,133 Z" fill="url(#feliceSlateGrad)" stroke="#0c1017" strokeWidth="2" />
              <path d="M104,133 Q96,142 86,144 L99,150 Q108,143 104,133 Z" fill="url(#feliceSlateGrad)" stroke="#0c1017" strokeWidth="2" />

              {/* Left leg */}
              <path d="M56,138 Q65,137 72,144 L71,154 Q62,157 55,152 Z" fill="url(#feliceWhiteGrad)" stroke="#0c1017" strokeWidth="2.4" />
              <path d="M57,151 L69,151 L68,160 L58,160 Z" fill="url(#feliceSlateGrad)" stroke="#0c1017" strokeWidth="2" />
              {/* Lower white shin + cyan side ankle dot */}
              <path d="M54,158 Q63,156 71,158 L73,170 L52,170 Z" fill="url(#feliceWhiteGrad)" stroke="#0c1017" strokeWidth="2.4" />
              <circle cx="54" cy="164" r="2.6" fill="#2ceeff" />
              {/* Rounded dark-navy toe boot with glowing cyan seam + vertical front slit */}
              <path
                d="M49,170 Q62,166 75,170 L76,177 Q62,180 48,177 Z"
                fill="url(#feliceSlateGrad)"
                stroke="#0c1017"
                strokeWidth="2.4"
              />
              <path d="M51,170 Q62,167 74,170" fill="none" stroke="#2ceeff" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="61" y1="173" x2="61" y2="177" stroke="#2ceeff" strokeWidth="2" strokeLinecap="round" />
              <circle cx="51" cy="175" r="1.4" fill="#2ceeff" />

              {/* Right leg */}
              <path d="M104,138 Q95,137 88,144 L89,154 Q98,157 105,152 Z" fill="url(#feliceWhiteGrad)" stroke="#0c1017" strokeWidth="2.4" />
              <path d="M103,151 L91,151 L92,160 L102,160 Z" fill="url(#feliceSlateGrad)" stroke="#0c1017" strokeWidth="2" />
              <path d="M106,158 Q97,156 89,158 L87,170 L108,170 Z" fill="url(#feliceWhiteGrad)" stroke="#0c1017" strokeWidth="2.4" />
              <circle cx="106" cy="164" r="2.6" fill="#2ceeff" />
              <path
                d="M85,170 Q98,166 111,170 L112,177 Q98,180 84,177 Z"
                fill="url(#feliceSlateGrad)"
                stroke="#0c1017"
                strokeWidth="2.4"
              />
              <path d="M86,170 Q98,167 109,170" fill="none" stroke="#2ceeff" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="99" y1="173" x2="99" y2="177" stroke="#2ceeff" strokeWidth="2" strokeLinecap="round" />
              <circle cx="109" cy="175" r="1.4" fill="#2ceeff" />
            </g>

            {/* White Ceramic Torso with Subtle Panel Seams & Glowing Cyan Cat Paw Badge */}
            <g>
              {/* Dark pelvis core underneath chestplate */}
              <path d="M62,134 L98,134 L90,147 L70,147 Z" fill="url(#feliceSlateGrad)" stroke="#0c1017" strokeWidth="2.4" />
              {/* Pearl-white rounded chest & pelvis shell */}
              <path
                d="M52,107 Q80,101 108,107 L101,134 Q80,147 59,134 Z"
                fill="url(#feliceWhiteGrad)"
                stroke="#0c1017"
                strokeWidth="2.8"
                strokeLinejoin="round"
              />
              {/* Fine armor panel seam lines visible on chest (Image 1 & 2) */}
              <path d="M65,127 L71,139 M95,127 L89,139" fill="none" stroke="#64748b" strokeWidth="1.2" opacity="0.65" />

              {/* Center Glowing Cyan Cat Paw Print Chest Badge — fixed in place, glows & dims softly */}
              <g className="catbot-chest-core">
                <circle
                  cx="80"
                  cy="119"
                  r="9.5"
                  fill="#0b1322"
                  stroke="#2ceeff"
                  strokeWidth="2.4"
                />
                {/* Glowing cyan paw print (1 main pad + 3 toe pads) */}
                <ellipse cx="80" cy="122" rx="4.2" ry="3.2" fill="#2ceeff" />
                <circle cx="75.2" cy="116.8" r="1.7" fill="#2ceeff" />
                <circle cx="80" cy="115.2" r="1.8" fill="#2ceeff" />
                <circle cx="84.8" cy="116.8" r="1.7" fill="#2ceeff" />
              </g>
            </g>

            {/* Articulated Left & Right Arms matching Images 1, 2 & 3 */}
            <RobotArm side="left" gesture={gesture} isTalking={isTalking} />
            <RobotArm side="right" gesture={gesture} isTalking={isTalking} />

            {/* Dark Metallic Segmented Neck Collar */}
            <rect
              x="66"
              y="98"
              width="28"
              height="9"
              rx="4"
              fill="#171f30"
              stroke="#0c1017"
              strokeWidth="2.2"
            />
            <line x1="68" y1="102.5" x2="92" y2="102.5" stroke="#334155" strokeWidth="1.2" />

            {/* Pearl-White Rounded Helmet Head Group (Images 1, 2, 3) */}
            <g className="catbot-head">
              {/* Top Spherical Cyan Antenna & Base Socket */}
              <path
                d="M73,31 Q80,27 87,31 L88,35 L72,35 Z"
                fill="url(#feliceSlateGrad)"
                stroke="#0c1017"
                strokeWidth="2"
              />
              <line x1="80" y1="29" x2="80" y2="16" stroke="#0c1017" strokeWidth="4.4" strokeLinecap="round" />
              <line x1="80" y1="29" x2="80" y2="16" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" />
              <circle
                cx="80"
                cy="12"
                r="7.2"
                fill="url(#feliceAntennaGlow)"
                stroke="#00bfff"
                strokeWidth="1.2"
                filter="url(#feliceCyanGlow)"
              />

              {/* Two Pearl-White Top Cat Ears with Dark Housing & Cyan Illuminated Triangle Cores */}
              <g className="catbot-ear-left">
                <path
                  d="M36,52 Q33,22 50,24 Q60,26 65,37 Z"
                  fill="url(#feliceWhiteGrad)"
                  stroke="#0c1017"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M40,46 Q39,28 50,30 Q55,32 58,38 Z"
                  fill="#101828"
                  stroke="#475569"
                  strokeWidth="1.2"
                />
                <path
                  d="M43,44 Q43,33 50,34 Q53,36 55,40 Z"
                  fill="#2ceeff"
                  filter="url(#feliceCyanGlow)"
                />
              </g>

              <g className="catbot-ear-right">
                <path
                  d="M124,52 Q127,22 110,24 Q100,26 95,37 Z"
                  fill="url(#feliceWhiteGrad)"
                  stroke="#0c1017"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M120,46 Q121,28 110,30 Q105,32 102,38 Z"
                  fill="#101828"
                  stroke="#475569"
                  strokeWidth="1.2"
                />
                <path
                  d="M117,44 Q117,33 110,34 Q107,36 105,40 Z"
                  fill="#2ceeff"
                  filter="url(#feliceCyanGlow)"
                />
              </g>

              {/* Circular Glowing Cyan Headphone Ear-Pods (Images 1, 2, 3) */}
              <g>
                <ellipse cx="29" cy="64" rx="8.5" ry="14.5" fill="url(#feliceWhiteGrad)" stroke="#0c1017" strokeWidth="2.4" />
                <ellipse cx="27.5" cy="64" rx="5.2" ry="11" fill="#0f172a" stroke="#2ceeff" strokeWidth="2.4" />

                <ellipse cx="131" cy="64" rx="8.5" ry="14.5" fill="url(#feliceWhiteGrad)" stroke="#0c1017" strokeWidth="2.4" />
                <ellipse cx="132.5" cy="64" rx="5.2" ry="11" fill="#0f172a" stroke="#2ceeff" strokeWidth="2.4" />
              </g>

              {/* Main Wide Rounded Pearl-White Helmet Shell */}
              <path
                d="M32,62 C32,37 52,32 80,32 C108,32 128,37 128,62 C128,89 112,99 80,99 C48,99 32,89 32,62 Z"
                fill="url(#feliceWhiteGrad)"
                stroke="#0c1017"
                strokeWidth="3"
              />
              {/* Fine center top forehead seam line (Images 1 & 2) */}
              <line x1="80" y1="33" x2="80" y2="41" stroke="#475569" strokeWidth="1.4" opacity="0.7" />

              {/* Deep Obsidian-Black Glossy Curved Visor Screen */}
              <path
                d="M40,63 C40,44 55,40 80,40 C105,40 120,44 120,63 C120,83 107,91 80,91 C53,91 40,83 40,63 Z"
                fill="#060a14"
                stroke="#1e293b"
                strokeWidth="2.2"
              />
              {/* Glossy upper-right glass highlight matching Image 1 & 2 */}
              <path
                d="M95,43 Q109,46 113,54"
                fill="none"
                stroke="rgba(255, 255, 255, 0.34)"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Expressive Neon-Cyan OLED Eyes & Mouth */}
              <VisorFace expression={expression} isTalking={isTalking} />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
};
