import React from 'react';

interface CosmicSagaWordmarkProps {
  className?: string;
}

/**
 * Outlined / transparent geometric Cyberpunk-HUD SVG wordmark for "COSMIC SAGA".
 * Uses transparent letter interiors and crisp monochrome white/silver bevel strokes,
 * allowing the black starfield and rocket behind the text to show cleanly through.
 */
export const CosmicSagaWordmark: React.FC<CosmicSagaWordmarkProps> = ({
  className = ''
}) => {
  const strokeMain = 'rgba(255, 255, 255, 0.94)';
  const strokeDetail = 'rgba(255, 255, 255, 0.68)';
  const dotFill = 'rgba(255, 255, 255, 0.6)';

  // Micro telemetry dot matrix grid
  const renderDots = (ox: number, oy: number, cols: number, rows: number) => {
    const rects: React.ReactNode[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        rects.push(
          <rect
            key={`${ox}-${oy}-${r}-${c}`}
            x={ox + c * 5}
            y={oy + r * 5}
            width="2.6"
            height="2.6"
            rx="0.4"
            fill={dotFill}
          />
        );
      }
    }
    return rects;
  };

  // Diagonal cyber hazard hatch slashes
  const renderHatches = (ox: number, oy: number, count: number) =>
    Array.from({ length: count }).map((_, i) => (
      <line
        key={`${ox}-${oy}-${i}`}
        x1={ox + i * 6}
        y1={oy + 7}
        x2={ox + i * 6 + 5}
        y2={oy}
        stroke={strokeDetail}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    ));

  // Crisp '+' telemetry crosshair accent
  const renderPlus = (cx: number, cy: number) => (
    <g stroke={strokeDetail} strokeWidth="2" strokeLinecap="round">
      <line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} />
      <line x1={cx} y1={cy - 5} x2={cx} y2={cy + 5} />
    </g>
  );

  const GlyphC = (x: number, y: number, showPlus = true) => (
    <g transform={`translate(${x}, ${y})`}>
      <path
        d="M16,0 L94,0 L94,28 L34,28 L26,36 L26,80 L34,88 L94,88 L94,116 L16,116 L0,100 L0,16 Z"
        fill="rgba(255, 255, 255, 0.04)"
        stroke={strokeMain}
        strokeWidth="2.8"
        strokeLinejoin="bevel"
      />
      <polyline points="20,-6 62,-6 74,4" fill="none" stroke={strokeDetail} strokeWidth="2" />
      <polyline points="8,42 8,74" fill="none" stroke={strokeDetail} strokeWidth="2.2" />
      {renderDots(42, 95, 5, 3)}
      {renderHatches(44, 48, 5)}
      {showPlus && renderPlus(90, 124)}
    </g>
  );

  const GlyphO = (x: number, y: number) => (
    <g transform={`translate(${x}, ${y})`}>
      <path
        d="M18,0 L78,0 L96,18 L96,98 L78,116 L18,116 L0,98 L0,18 Z M32,26 L26,32 L26,84 L32,90 L64,90 L70,84 L70,32 L64,26 Z"
        fillRule="evenodd"
        fill="rgba(255, 255, 255, 0.04)"
        stroke={strokeMain}
        strokeWidth="2.8"
      />
      <polyline points="22,-6 72,-6 86,8" fill="none" stroke={strokeDetail} strokeWidth="2" />
      <line x1="12" y1="34" x2="12" y2="82" stroke={strokeDetail} strokeWidth="2.2" />
      {renderDots(36, 96, 5, 3)}
      {renderPlus(8, -6)}
    </g>
  );

  const GlyphS = (x: number, y: number) => (
    <g transform={`translate(${x}, ${y})`}>
      <path
        d="M18,0 L94,0 L94,26 L30,26 L26,30 L26,44 L78,44 L96,62 L96,100 L80,116 L2,116 L2,90 L64,90 L68,86 L68,70 L18,70 L2,54 L2,16 Z"
        fill="rgba(255, 255, 255, 0.04)"
        stroke={strokeMain}
        strokeWidth="2.8"
      />
      <polyline points="24,-6 84,-6" fill="none" stroke={strokeDetail} strokeWidth="2" />
      {renderHatches(38, 8, 5)}
      {renderDots(14, 96, 5, 3)}
      {renderPlus(92, -6)}
    </g>
  );

  const GlyphM = (x: number, y: number) => (
    <g transform={`translate(${x}, ${y})`}>
      <path
        d="M0,16 L16,0 L46,0 L56,18 L66,0 L96,0 L112,16 L112,116 L84,116 L84,38 L66,64 L46,64 L28,38 L28,116 L0,116 Z"
        fill="rgba(255, 255, 255, 0.04)"
        stroke={strokeMain}
        strokeWidth="2.8"
      />
      <polyline points="68,-6 102,-6 116,8" fill="none" stroke={strokeDetail} strokeWidth="2" />
      {renderDots(4, 94, 4, 3)}
      {renderDots(88, 94, 4, 3)}
      {renderHatches(44, 78, 4)}
      {renderPlus(56, 124)}
    </g>
  );

  const GlyphI = (x: number, y: number) => (
    <g transform={`translate(${x}, ${y})`}>
      <path
        d="M6,0 L52,0 L52,18 L44,26 L44,90 L52,98 L52,116 L6,116 L6,98 L14,90 L14,26 L6,18 Z"
        fill="rgba(255, 255, 255, 0.04)"
        stroke={strokeMain}
        strokeWidth="2.8"
      />
      <line x1="28" y1="22" x2="28" y2="94" stroke={strokeDetail} strokeWidth="2.2" />
      {renderDots(18, 97, 4, 2)}
      {renderPlus(4, -6)}
    </g>
  );

  const GlyphA = (x: number, y: number, showPlus = true) => (
    <g transform={`translate(${x}, ${y})`}>
      <path
        d="M28,0 L80,0 L96,16 L96,116 L68,116 L68,80 L28,80 L28,116 L0,116 L0,44 Z M32,26 L28,32 L28,54 L68,54 L68,26 Z"
        fillRule="evenodd"
        fill="rgba(255, 255, 255, 0.04)"
        stroke={strokeMain}
        strokeWidth="2.8"
      />
      <polyline points="26,-6 74,-6 92,10" fill="none" stroke={strokeDetail} strokeWidth="2" />
      {renderHatches(4, 92, 4)}
      {renderDots(72, 94, 4, 3)}
      {showPlus && renderPlus(8, 124)}
    </g>
  );

  const GlyphG = (x: number, y: number) => (
    <g transform={`translate(${x}, ${y})`}>
      <path
        d="M18,0 L94,0 L94,26 L32,26 L26,32 L26,84 L32,90 L68,90 L68,74 L52,74 L52,52 L96,52 L96,100 L80,116 L18,116 L0,98 L0,18 Z"
        fill="rgba(255, 255, 255, 0.04)"
        stroke={strokeMain}
        strokeWidth="2.8"
      />
      <polyline points="24,-6 84,-6" fill="none" stroke={strokeDetail} strokeWidth="2" />
      {renderDots(36, 96, 5, 3)}
      {renderHatches(46, 36, 4)}
      {renderPlus(92, -6)}
    </g>
  );

  return (
    <div className={`cosmic-cyber-wordmark-wrap ${className}`.trim()}>
      <h1 className="sr-only">COSMIC SAGA</h1>
      <svg
        viewBox="0 -16 1120 152"
        className="cosmic-cyber-wordmark-svg"
        role="img"
        aria-label="COSMIC SAGA"
      >
        <defs>
          <filter id="cyberCleanShadow" x="-8%" y="-15%" width="116%" height="130%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#ffffff" floodOpacity="0.28" />
          </filter>
        </defs>

        <g filter="url(#cyberCleanShadow)">
          {/* COSMIC */}
          {GlyphC(12, 0, true)}
          {GlyphO(120, 0)}
          {GlyphS(230, 0)}
          {GlyphM(340, 0)}
          {GlyphI(466, 0)}
          {GlyphC(532, 0, false)}

          {/* SAGA */}
          {GlyphS(680, 0)}
          {GlyphA(790, 0, true)}
          {GlyphG(900, 0)}
          {GlyphA(1010, 0, false)}
        </g>
      </svg>
    </div>
  );
};
