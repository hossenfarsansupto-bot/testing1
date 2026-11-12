import React, { useState } from 'react';

export type VisualizationId =
  | 'earth_moon_distance'
  | 'corner_cube_diagram'
  | 'total_internal_reflection'
  | 'lick_timeline'
  | 'laser_ranging_anim'
  | 'lunar_recession'
  | 'moon_interior_libration'
  | 'dust_degradation'
  | 'modern_observatories'
  | 'three_array_quiz'
  | 'three_array_quiz_revealed';

interface VizProps {
  id: VisualizationId;
  reduceMotion?: boolean;
}

export const RetroreflectorVisualization: React.FC<VizProps> = ({
  id,
  reduceMotion = false
}) => {
  const [arrayView, setArrayView] = useState<'single' | 'array'>('single');

  switch (id) {
    case 'earth_moon_distance':
      return (
        <div
          className={`sci-viz-card ${reduceMotion ? 'reduce-motion' : ''}`}
          role="figure"
          aria-label="Scientific visualization of Earth-Moon laser pulse timing (~384,400 km, ~2.5 s round trip)"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Scientific visualization</span>
            <span className="sci-viz-subbadge">NOT NASA FOOTAGE</span>
          </div>
          <svg viewBox="0 0 420 155" className="sci-viz-svg" aria-hidden="true">
            <defs>
              <radialGradient id="vizEarth" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#6ee7ff" />
                <stop offset="55%" stopColor="#1d6fa5" />
                <stop offset="100%" stopColor="#0a2847" />
              </radialGradient>
              <radialGradient id="vizMoon" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#e6ecf5" />
                <stop offset="70%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </radialGradient>
            </defs>
            {/* Dashed distance guide */}
            <line x1="78" y1="74" x2="342" y2="74" stroke="rgba(125,211,252,0.35)" strokeDasharray="4 4" strokeWidth="1.5" />
            {/* Outbound pulse */}
            <line x1="78" y1="68" x2="342" y2="68" stroke="#38bdf8" strokeWidth="2.2" className="viz-pulse-line" />
            {/* Return pulse */}
            <line x1="342" y1="80" x2="78" y2="80" stroke="#4ade80" strokeWidth="2" className="viz-pulse-return" />
            {!reduceMotion && (
              <>
                <circle r="4.5" fill="#7dd3fc">
                  <animateMotion dur="2.5s" repeatCount="indefinite" path="M 78 68 L 342 68 L 78 80" />
                </circle>
              </>
            )}
            {/* Earth */}
            <circle cx="52" cy="74" r="28" fill="url(#vizEarth)" stroke="#7dd3fc" strokeWidth="1.5" />
            <text x="52" y="118" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">Earth</text>
            {/* Moon */}
            <circle cx="364" cy="74" r="18" fill="url(#vizMoon)" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="342" y="69" width="7" height="10" rx="1.5" fill="#7dd3fc" />
            <text x="364" y="118" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">Moon</text>
            {/* Distance & round-trip callouts */}
            <rect x="132" y="20" width="156" height="24" rx="6" fill="rgba(15,23,42,0.85)" stroke="rgba(56,189,248,0.45)" />
            <text x="210" y="36" textAnchor="middle" fill="#7dd3fc" fontSize="11.5" fontWeight="700">~384,400 km separation</text>
            <rect x="128" y="96" width="164" height="24" rx="6" fill="rgba(15,23,42,0.85)" stroke="rgba(74,222,128,0.45)" />
            <text x="210" y="112" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700">Round-trip pulse: ~2.5 s</text>
          </svg>
          <p className="sci-viz-caption">
            App diagram: A pulsed laser crosses roughly 384,400 km to the Moon and returns in ~2.5 seconds (d = c × t / 2). Not to orbital scale.
          </p>
        </div>
      );

    case 'corner_cube_diagram':
      return (
        <div
          className={`sci-viz-card ${reduceMotion ? 'reduce-motion' : ''}`}
          role="figure"
          aria-label="Scientific visualization cutaway of a corner-cube prism and 100-prism array"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Scientific visualization</span>
            <div className="sci-viz-toggle" role="group" aria-label="Corner-cube view mode">
              <button
                type="button"
                className={`sci-viz-toggle-btn ${arrayView === 'single' ? 'active' : ''}`}
                onClick={() => setArrayView('single')}
              >
                Single Prism
              </button>
              <button
                type="button"
                className={`sci-viz-toggle-btn ${arrayView === 'array' ? 'active' : ''}`}
                onClick={() => setArrayView('array')}
              >
                10×10 Array (100)
              </button>
            </div>
          </div>
          {arrayView === 'single' ? (
            <svg viewBox="0 0 420 165" className="sci-viz-svg" aria-hidden="true">
              {/* Orthogonal corner faces */}
              <polygon points="150,35 280,25 320,82 280,142 150,128" fill="rgba(148,210,255,0.12)" stroke="#7dd3fc" strokeWidth="1.8" />
              <line x1="280" y1="25" x2="225" y2="82" stroke="rgba(148,210,255,0.55)" strokeDasharray="3 3" />
              <line x1="280" y1="142" x2="225" y2="82" stroke="rgba(148,210,255,0.55)" strokeDasharray="3 3" />
              <line x1="320" y1="82" x2="225" y2="82" stroke="rgba(148,210,255,0.55)" strokeDasharray="3 3" />
              {/* Three perpendicular bounce points */}
              <polyline
                points="65,58 175,58 255,46 292,86 245,120 65,120"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
              />
              <circle cx="255" cy="46" r="4" fill="#fbbf24" />
              <circle cx="292" cy="86" r="4" fill="#fbbf24" />
              <circle cx="245" cy="120" r="4" fill="#fbbf24" />
              {/* Arrows */}
              <polygon points="130,52 142,58 130,64" fill="#38bdf8" />
              <polygon points="118,114 106,120 118,126" fill="#4ade80" />
              <text x="65" y="47" fill="#7dd3fc" fontSize="10.5">Incoming beam</text>
              <text x="65" y="138" fill="#86efac" fontSize="10.5">Parallel return beam</text>
              <text x="275" y="154" textAnchor="middle" fill="#fde68a" fontSize="10">3 mutually perpendicular 90° faces</text>
            </svg>
          ) : (
            <svg viewBox="0 0 420 165" className="sci-viz-svg" aria-hidden="true">
              <rect x="115" y="18" width="190" height="130" rx="6" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
              {Array.from({ length: 10 }).map((_, r) =>
                Array.from({ length: 10 }).map((__, c) => (
                  <circle
                    key={`${r}-${c}`}
                    cx={128 + c * 18}
                    cy={30 + r * 11.8}
                    r="4.2"
                    fill="rgba(125,211,252,0.75)"
                    stroke="#0ea5e9"
                    strokeWidth="0.7"
                  />
                ))
              )}
              <text x="210" y="160" textAnchor="middle" fill="#cbd5e1" fontSize="10.5">
                Apollo 11 &amp; 14 layout: 100 fused-silica prisms (10 × 10 aluminium frame)
              </text>
            </svg>
          )}
          <p className="sci-viz-caption">
            Corner-cube geometry reflects light off three orthogonal faces so the beam exits parallel to its arrival path — even if tipped slightly.
          </p>
        </div>
      );

    case 'total_internal_reflection':
      return (
        <div
          className={`sci-viz-card ${reduceMotion ? 'reduce-motion' : ''}`}
          role="figure"
          aria-label="Scientific visualization explaining uncoated fused-silica total internal reflection"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Scientific visualization</span>
            <span className="sci-viz-subbadge">TOTAL INTERNAL REFLECTION</span>
          </div>
          <svg viewBox="0 0 420 155" className="sci-viz-svg" aria-hidden="true">
            <polygon points="115,30 305,30 210,132" fill="rgba(56,189,248,0.16)" stroke="#7dd3fc" strokeWidth="2" />
            <text x="210" y="22" textAnchor="middle" fill="#cbd5e1" fontSize="10.5">Front aperture face (uncoated fused silica)</text>
            <polyline points="172,10 172,30 165,83 255,83 248,30 248,10" fill="none" stroke="#38bdf8" strokeWidth="2.4" />
            <circle cx="165" cy="83" r="4" fill="#fde047" />
            <circle cx="255" cy="83" r="4" fill="#fde047" />
            <text x="90" y="92" fill="#fde68a" fontSize="10">Glass–vacuum</text>
            <text x="90" y="104" fill="#fde68a" fontSize="10">boundary reflects</text>
            <text x="330" y="92" fill="#86efac" fontSize="10">No metallic coating</text>
            <text x="330" y="104" fill="#86efac" fontSize="10">to peel or overheat</text>
          </svg>
          <p className="sci-viz-caption">
            Total internal reflection inside pure fused silica bounces light at the glass–vacuum boundary with minimal absorption across harsh lunar day/night temperature swings.
          </p>
        </div>
      );

    case 'lick_timeline':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Historical context timeline: Apollo 11 deployment and Lick Observatory first laser echo"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Historical timeline</span>
            <span className="sci-viz-subbadge">JULY – AUGUST 1969</span>
          </div>
          <div className="sci-viz-timeline">
            <div className="sci-timeline-step">
              <span className="sci-timeline-date">July 20, 1969</span>
              <strong>Apollo 11 Deployment</strong>
              <p>Buzz Aldrin levels the 100-prism retroreflector at Tranquility Base using a built-in bubble level.</p>
            </div>
            <div className="sci-timeline-arrow" aria-hidden="true">→ 12 days later →</div>
            <div className="sci-timeline-step highlight">
              <span className="sci-timeline-date">August 1, 1969</span>
              <strong>Lick Observatory First Echo</strong>
              <p>Astronomers in California fire ruby-laser pulses at the Moon and detect the returning signal.</p>
            </div>
          </div>
        </div>
      );

    case 'laser_ranging_anim':
      return (
        <div
          className={`sci-viz-card ${reduceMotion ? 'reduce-motion' : ''}`}
          role="figure"
          aria-label="Scientific visualization of Earth observatory beam expansion and single-photon return detection"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Scientific visualization</span>
            <span className="sci-viz-subbadge">LASER RANGING // MILLIMETRE PRECISION</span>
          </div>
          <svg viewBox="0 0 420 165" className="sci-viz-svg" aria-hidden="true">
            {/* Diverging outbound beam cone */}
            <polygon points="58,82 346,34 346,130" fill="rgba(56,189,248,0.14)" stroke="rgba(56,189,248,0.5)" strokeWidth="1.2" />
            {/* Returning photon beam */}
            <line x1="346" y1="82" x2="58" y2="82" stroke="#4ade80" strokeWidth="2.2" strokeDasharray="6 4" />
            {/* Observatory */}
            <rect x="24" y="66" width="34" height="32" rx="4" fill="#1e293b" stroke="#7dd3fc" strokeWidth="1.5" />
            <text x="41" y="114" textAnchor="middle" fill="#e2e8f0" fontSize="10">Observatory</text>
            {/* Reflector */}
            <rect x="346" y="73" width="12" height="18" rx="2" fill="#bae6fd" stroke="#0284c7" />
            <text x="352" y="114" textAnchor="middle" fill="#e2e8f0" fontSize="10">Array</text>
            {/* Annotations */}
            <text x="202" y="24" textAnchor="middle" fill="#7dd3fc" fontSize="10.5">Beam spreads across kilometres at the Moon</text>
            <text x="202" y="75" textAnchor="middle" fill="#86efac" fontSize="10.5">Only a few returning photons reach detector</text>
            <rect x="96" y="128" width="228" height="26" rx="6" fill="rgba(15,23,42,0.9)" stroke="rgba(74,222,128,0.45)" />
            <text x="210" y="145" textAnchor="middle" fill="#f8fafc" fontSize="11">
              Timer: ~2.5 s | d = (299,792,458 m/s × t) ÷ 2
            </text>
          </svg>
          <p className="sci-viz-caption">
            Scale note: A pulse spreads across kilometres by lunar distance, so only a tiny fraction of photons hits the array and returns to Earth detectors.
          </p>
        </div>
      );

    case 'lunar_recession':
      return (
        <div
          className={`sci-viz-card ${reduceMotion ? 'reduce-motion' : ''}`}
          role="figure"
          aria-label="Scientific visualization top-down orbital view of Earth tidal bulges pushing the Moon outward at ~3.8 cm per year"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Scientific visualization</span>
            <span className="sci-viz-subbadge">ORBITAL RECESSION: ~3.8 CM / YEAR</span>
          </div>
          <svg viewBox="0 0 420 165" className="sci-viz-svg" aria-hidden="true">
            {/* Concentric orbits showing outward drift */}
            <ellipse cx="145" cy="84" rx="115" ry="58" fill="none" stroke="rgba(148,163,184,0.35)" strokeDasharray="4 4" />
            <ellipse cx="145" cy="84" rx="135" ry="68" fill="none" stroke="rgba(56,189,248,0.55)" strokeWidth="1.5" />
            {/* Tidal bulge rotated slightly ahead */}
            <g transform="translate(145, 84) rotate(-22)">
              <ellipse cx="0" cy="0" rx="34" ry="22" fill="rgba(56,189,248,0.28)" stroke="#38bdf8" strokeWidth="1.4" />
            </g>
            <circle cx="145" cy="84" r="20" fill="#1d6fa5" stroke="#93c5fd" strokeWidth="1.5" />
            <text x="145" y="88" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">Earth</text>
            {/* Moon spiraling slightly outward */}
            <circle cx="278" cy="70" r="11" fill="#cbd5e1" stroke="#f8fafc" strokeWidth="1.2" />
            <line x1="258" y1="74" x2="274" y2="70" stroke="#fbbf24" strokeWidth="2" />
            <text x="342" y="64" textAnchor="middle" fill="#fde68a" fontSize="11" fontWeight="700">+3.8 cm / yr</text>
            <text x="342" y="79" textAnchor="middle" fill="#cbd5e1" fontSize="10">~2 m since 1969</text>
            <text x="145" y="132" textAnchor="middle" fill="#7dd3fc" fontSize="10">
              Tidal bulge pulled ahead tugs Moon forward
            </text>
          </svg>
          <p className="sci-viz-caption">
            Earth&apos;s faster rotation drags tidal bulges slightly ahead of the Moon, transferring angular momentum. Exaggerated orbit geometry — drift is ~3.8 cm/yr, imperceptible without laser ranging.
          </p>
        </div>
      );

    case 'moon_interior_libration':
      return (
        <div
          className={`sci-viz-card ${reduceMotion ? 'reduce-motion' : ''}`}
          role="figure"
          aria-label="Scientific visualization cross-section of Moon crust, mantle, and partly molten core with libration"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Scientific visualization</span>
            <span className="sci-viz-subbadge">INFERRED INTERIOR &amp; LIBRATION</span>
          </div>
          <svg viewBox="0 0 420 165" className="sci-viz-svg" aria-hidden="true">
            <g className={reduceMotion ? '' : 'viz-libration-group'}>
              <circle cx="170" cy="82" r="58" fill="#64748b" stroke="#cbd5e1" strokeWidth="2.5" />
              <circle cx="170" cy="82" r="46" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
              <circle cx="170" cy="82" r="22" fill="#f97316" stroke="#fdba74" strokeWidth="1.5" />
              <circle cx="170" cy="82" r="10" fill="#fef08a" />
            </g>
            {/* Labels */}
            <line x1="224" y1="62" x2="275" y2="48" stroke="#cbd5e1" strokeWidth="1.2" />
            <text x="280" y="51" fill="#e2e8f0" fontSize="11">Crust (rigid rock)</text>
            <line x1="210" y1="82" x2="275" y2="82" stroke="#94a3b8" strokeWidth="1.2" />
            <text x="280" y="86" fill="#cbd5e1" fontSize="11">Mantle (flexes tidally)</text>
            <line x1="186" y1="92" x2="275" y2="116" stroke="#fdba74" strokeWidth="1.2" />
            <text x="280" y="119" fill="#fed7aa" fontSize="11">Partly molten core</text>
          </svg>
          <p className="sci-viz-caption">
            Scientific visualization of lunar interior layers inferred from tiny spin wobbles (libration) and tidal flexing measured by the retroreflector network.
          </p>
        </div>
      );

    case 'dust_degradation':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Illustration of possible causes of signal weakening under study: lunar dust and thermal cycling"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Scientific visualization</span>
            <span className="sci-viz-subbadge">POSSIBLE EXPLANATIONS UNDER STUDY</span>
          </div>
          <svg viewBox="0 0 420 140" className="sci-viz-svg" aria-hidden="true">
            <rect x="105" y="64" width="210" height="36" rx="4" fill="#334155" stroke="#94a3b8" strokeWidth="1.6" />
            {Array.from({ length: 8 }).map((_, i) => (
              <circle key={i} cx={124 + i * 24} cy={82} r="6.5" fill="rgba(125,211,252,0.5)" stroke="#38bdf8" />
            ))}
            {/* Suspected fine dust flecks */}
            <circle cx="135" cy="56" r="2" fill="#cbd5e1" />
            <circle cx="172" cy="60" r="2.2" fill="#e2e8f0" />
            <circle cx="218" cy="54" r="1.8" fill="#cbd5e1" />
            <circle cx="258" cy="59" r="2.5" fill="#94a3b8" />
            <text x="210" y="34" textAnchor="middle" fill="#fde68a" fontSize="11">
              Micrometeorite-kicked dust (suspected) &amp; thermal cycling
            </text>
            <text x="210" y="122" textAnchor="middle" fill="#cbd5e1" fontSize="10.5">
              Signals have weakened over decades; exact cause remains under study
            </text>
          </svg>
        </div>
      );

    case 'modern_observatories':
      return (
        <div
          className="sci-viz-card"
          role="region"
          aria-label="Global Lunar Laser Ranging Observatories and Archive Data Card"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Archive Data Card</span>
            <span className="sci-viz-subbadge">ILRS &amp; NASA CDDIS</span>
          </div>
          <div className="sci-viz-data-grid">
            <div className="sci-data-cell">
              <span className="sci-data-label">Active Stations</span>
              <strong>USA, France, Germany &amp; international observatories</strong>
            </div>
            <div className="sci-data-cell">
              <span className="sci-data-label">Coordination &amp; Archive</span>
              <strong>ILRS coordinates global ranging; NASA CDDIS preserves open decades-long datasets</strong>
            </div>
          </div>
        </div>
      );

    case 'three_array_quiz':
    case 'three_array_quiz_revealed': {
      const revealed = id === 'three_array_quiz_revealed';
      return (
        <div
          className="sci-viz-card"
          role="region"
          aria-label="Apollo 11, 14, and 15 prism array comparison"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Apollo Network Comparison</span>
            <span className="sci-viz-subbadge">
              {revealed ? 'TOTAL: 500 PRISMS' : 'SELECT AN ANSWER BELOW'}
            </span>
          </div>
          <div className="sci-quiz-thumb-row">
            <div className="sci-quiz-thumb">
              <span className="sci-thumb-mission">Apollo 11</span>
              <span className="sci-thumb-site">Sea of Tranquility (1969)</span>
              <span className="sci-thumb-count">100 prisms</span>
            </div>
            <div className="sci-quiz-thumb">
              <span className="sci-thumb-mission">Apollo 14</span>
              <span className="sci-thumb-site">Fra Mauro (1971)</span>
              <span className="sci-thumb-count">100 prisms</span>
            </div>
            <div className="sci-quiz-thumb large">
              <span className="sci-thumb-mission">Apollo 15</span>
              <span className="sci-thumb-site">Hadley Rille (1971)</span>
              <span className="sci-thumb-count">300 prisms</span>
            </div>
          </div>
        </div>
      );
    }
  }
};
