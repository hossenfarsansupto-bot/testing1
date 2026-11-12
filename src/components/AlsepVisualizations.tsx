import React, { useState } from 'react';

export type AlsepVisualizationId =
  | 'snap27_schematic'
  | 'snap27_fuel_transfer'
  | 'lunar_night_terminator'
  | 'seismogram_wave_trace'
  | 'magnetometer_field_illustration'
  | 'solar_wind_illustration'
  | 'heat_flow_schematic'
  | 'dust_detector_schematic'
  | 'dust_detector_accumulation';

interface Props {
  id: AlsepVisualizationId;
  reduceMotion?: boolean;
}

export const AlsepVisualization: React.FC<Props> = ({
  id,
  reduceMotion = false
}) => {
  const [windRunning, setWindRunning] = useState(true);

  switch (id) {
    case 'snap27_schematic':
      return (
        <div
          className={`sci-viz-card ${reduceMotion ? 'reduce-motion' : ''}`}
          role="figure"
          aria-label="Technical schematic of SNAP-27 radioisotope thermoelectric generator converting Pu-238 heat into ~70 W electricity"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Technical schematic</span>
            <span className="sci-viz-subbadge">SNAP-27 RTG (~70 W INITIAL)</span>
          </div>
          <svg viewBox="0 0 420 155" className="sci-viz-svg" aria-hidden="true">
            <rect x="24" y="42" width="102" height="72" rx="8" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.6" />
            <text x="75" y="68" textAnchor="middle" fill="#fde68a" fontSize="11" fontWeight="700">Pu-238 Capsule</text>
            <text x="75" y="84" textAnchor="middle" fill="#cbd5e1" fontSize="9.5">Radioactive decay</text>
            <text x="75" y="99" textAnchor="middle" fill="#fca5a5" fontSize="9.5">Steady thermal heat</text>

            <line x1="128" y1="78" x2="162" y2="78" stroke="#f97316" strokeWidth="2.5" />
            <polygon points="158,72 169,78 158,84" fill="#f97316" />

            <rect x="170" y="36" width="114" height="84" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.6" />
            <text x="227" y="60" textAnchor="middle" fill="#7dd3fc" fontSize="10.5" fontWeight="700">Thermoelectric</text>
            <text x="227" y="75" textAnchor="middle" fill="#7dd3fc" fontSize="10.5" fontWeight="700">Elements</text>
            <text x="227" y="93" textAnchor="middle" fill="#cbd5e1" fontSize="9.5">ΔT → Direct DC</text>
            <text x="227" y="108" textAnchor="middle" fill="#86efac" fontSize="9.5">0 moving parts</text>

            <line x1="286" y1="78" x2="316" y2="78" stroke="#4ade80" strokeWidth="2.5" />
            <polygon points="312,72 323,78 312,84" fill="#4ade80" />

            <rect x="324" y="42" width="76" height="72" rx="8" fill="#0f293a" stroke="#4ade80" strokeWidth="1.6" />
            <text x="362" y="68" textAnchor="middle" fill="#86efac" fontSize="12" fontWeight="800">~70 W</text>
            <text x="362" y="85" textAnchor="middle" fill="#e2e8f0" fontSize="9.5">Day &amp; Night</text>
            <text x="362" y="100" textAnchor="middle" fill="#cbd5e1" fontSize="9">Central Station</text>
          </svg>
          <p className="sci-viz-caption">
            Schematic: Plutonium-238 heat flows across solid-state thermocouples to external radiator fins, generating ~70 W continuously through 14-day lunar nights.
          </p>
        </div>
      );

    case 'snap27_fuel_transfer':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Explanatory diagram of Apollo SNAP-27 Pu-238 fuel capsule transfer from graphite cask into RTG housing"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Explanatory diagram</span>
            <span className="sci-viz-subbadge">FUEL CAPSULE HANDLING</span>
          </div>
          <svg viewBox="0 0 420 145" className="sci-viz-svg" aria-hidden="true">
            <rect x="26" y="42" width="96" height="66" rx="8" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.6" />
            <text x="74" y="68" textAnchor="middle" fill="#f8fafc" fontSize="10.5" fontWeight="700">Protective</text>
            <text x="74" y="83" textAnchor="middle" fill="#f8fafc" fontSize="10.5" fontWeight="700">Fuel Cask</text>
            <text x="74" y="98" textAnchor="middle" fill="#94a3b8" fontSize="9">Carried on LM exterior</text>

            <path d="M126,68 Q205,28 282,66" fill="none" stroke="#fde047" strokeWidth="2" strokeDasharray="5 3" />
            <polygon points="277,60 288,68 275,71" fill="#fde047" />
            <text x="206" y="34" textAnchor="middle" fill="#fde68a" fontSize="10">Long handling tool (no direct glove contact)</text>

            <rect x="292" y="36" width="102" height="74" rx="8" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.6" />
            <text x="343" y="63" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontWeight="700">SNAP-27 Core</text>
            <text x="343" y="79" textAnchor="middle" fill="#cbd5e1" fontSize="9.5">Finned cylinder</text>
            <text x="343" y="94" textAnchor="middle" fill="#86efac" fontSize="9">Locked into RTG</text>
          </svg>
          <p className="sci-viz-caption">
            Explanatory diagram (not an archival photograph): Astronauts used a long-handled insertion tool to withdraw the hot fuel capsule from its graphite cask and seat it inside SNAP-27.
          </p>
        </div>
      );

    case 'lunar_night_terminator':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Subtle lunar day and night terminator illustration showing solar illumination split"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Explanatory illustration</span>
            <span className="sci-viz-subbadge">LUNAR DAY / NIGHT CYCLE</span>
          </div>
          <svg viewBox="0 0 420 120" className="sci-viz-svg" aria-hidden="true">
            <circle cx="210" cy="60" r="44" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.6" />
            <path d="M210,16 A44,44 0 0,0 210,104 Z" fill="#e2e8f0" />
            <line x1="210" y1="12" x2="210" y2="108" stroke="#fde047" strokeDasharray="3 3" strokeWidth="1.4" />
            <text x="108" y="56" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontWeight="700">Sunlit Side</text>
            <text x="108" y="71" textAnchor="middle" fill="#cbd5e1" fontSize="9.5">Solar warmth</text>
            <text x="314" y="56" textAnchor="middle" fill="#7dd3fc" fontSize="10.5" fontWeight="700">Night Side</text>
            <text x="314" y="71" textAnchor="middle" fill="#cbd5e1" fontSize="9.5">Deep lunar freeze</text>
          </svg>
        </div>
      );

    case 'seismogram_wave_trace':
      return (
        <div
          className={`sci-viz-card ${reduceMotion ? 'reduce-motion' : ''}`}
          role="figure"
          aria-label="Explanatory animated seismogram waveform illustrating long lunar seismic ringing"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Illustrative visualization</span>
            <span className="sci-viz-subbadge">NOT ORIGINAL NASA RECORDING</span>
          </div>
          <svg viewBox="0 0 420 135" className="sci-viz-svg" aria-hidden="true">
            <line x1="20" y1="68" x2="400" y2="68" stroke="rgba(148,163,184,0.3)" />
            <polyline
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              points="20,68 45,68 52,32 58,104 65,24 72,110 80,38 88,96 98,46 108,88 120,52 134,82 150,55 168,80 188,58 210,77 235,61 262,75 292,63 325,73 360,65 395,69"
            />
            {!reduceMotion && (
              <circle cx="65" cy="24" r="3.5" fill="#fde047">
                <animate attributeName="cx" values="50;390" dur="3.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.2" dur="3.6s" repeatCount="indefinite" />
              </circle>
            )}
            <text x="70" y="20" fill="#fde68a" fontSize="9.5" fontWeight="700">Controlled S-IVB Thump</text>
            <text x="275" y="45" fill="#7dd3fc" fontSize="9.5">Dry cracked crust scatters echoes for ~1 hr+</text>
          </svg>
          <p className="sci-viz-caption">
            Illustrative visualization (not an original seismogram): Cracked dry regolith scatters seismic waves far longer than wet Earth rock.
          </p>
        </div>
      );

    case 'magnetometer_field_illustration':
      return (
        <div
          className={`sci-viz-card ${reduceMotion ? 'reduce-motion' : ''}`}
          role="figure"
          aria-label="Explanatory illustration comparing patchy magnetized lunar regions against weak global dipole"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Explanatory illustration</span>
            <span className="sci-viz-subbadge">NOT A PHOTOGRAPH OR MEASUREMENT</span>
          </div>
          <svg viewBox="0 0 420 135" className="sci-viz-svg" aria-hidden="true">
            <circle cx="210" cy="70" r="46" fill="#475569" stroke="#cbd5e1" strokeWidth="1.8" />
            {/* Patchy magnetized crustal spots */}
            <path d="M180,45 Q195,28 210,48" fill="none" stroke="#38bdf8" strokeWidth="2.2" />
            <circle cx="195" cy="48" r="7" fill="rgba(56,189,248,0.35)" stroke="#7dd3fc" />
            <path d="M225,84 Q242,68 250,90" fill="none" stroke="#fbbf24" strokeWidth="2.2" />
            <circle cx="236" cy="84" r="8" fill="rgba(251,191,36,0.3)" stroke="#fde68a" />
            <path d="M174,88 Q182,76 196,90" fill="none" stroke="#4ade80" strokeWidth="2" />
            <circle cx="184" cy="87" r="6" fill="rgba(74,222,128,0.3)" stroke="#86efac" />
            <text x="74" y="55" textAnchor="middle" fill="#cbd5e1" fontSize="10">Weak global</text>
            <text x="74" y="68" textAnchor="middle" fill="#cbd5e1" fontSize="10">field today</text>
            <text x="344" y="55" textAnchor="middle" fill="#fde68a" fontSize="10">Local magnetic</text>
            <text x="344" y="68" textAnchor="middle" fill="#fde68a" fontSize="10">crust patches</text>
          </svg>
          <p className="sci-viz-caption">
            Explanatory illustration: Localized pockets of magnetized crust preserve clues to ancient lunar fields or impact effects.
          </p>
        </div>
      );

    case 'solar_wind_illustration':
      return (
        <div
          className={`sci-viz-card ${reduceMotion ? 'reduce-motion' : ''}`}
          role="figure"
          aria-label="Illustration of solar wind charged particles striking the unshielded lunar surface and Solar Wind Spectrometer"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Illustration</span>
            <button
              type="button"
              className="sci-viz-toggle-btn active"
              onClick={() => setWindRunning((r) => !r)}
            >
              {windRunning && !reduceMotion ? '⏸ Pause Stream' : '▶ Play Stream'}
            </button>
          </div>
          <svg viewBox="0 0 420 140" className="sci-viz-svg" aria-hidden="true">
            <circle cx="44" cy="70" r="24" fill="#f59e0b" stroke="#fde047" strokeWidth="2" />
            <text x="44" y="110" textAnchor="middle" fill="#fde68a" fontSize="10.5">Sun</text>
            {[42, 62, 78, 96].map((y, idx) => (
              <g key={y}>
                <line x1="76" y1={y} x2="322" y2={y + (idx - 1.5) * 3} stroke="rgba(253,224,71,0.35)" strokeDasharray="4 4" />
                {windRunning && !reduceMotion && (
                  <circle r="3.4" fill={idx % 2 === 0 ? '#fde047' : '#38bdf8'}>
                    <animateMotion
                      dur={`${1.6 + idx * 0.28}s`}
                      repeatCount="indefinite"
                      path={`M 76 ${y} L 328 ${y + (idx - 1.5) * 3}`}
                    />
                  </circle>
                )}
              </g>
            ))}
            <path d="M322,36 Q356,70 322,108 L392,108 L392,36 Z" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
            <rect x="330" y="61" width="16" height="16" rx="3" fill="#0ea5e9" stroke="#bae6fd" />
            <text x="360" y="125" textAnchor="middle" fill="#cbd5e1" fontSize="10">Moon Surface (SWS)</text>
            <text x="200" y="25" textAnchor="middle" fill="#7dd3fc" fontSize="10">Protons &amp; electrons strike regolith directly (no atmosphere)</text>
          </svg>
          <p className="sci-viz-caption">
            Illustration (not NASA footage): Without a thick atmosphere or dipole shield, solar wind ions implant directly into lunar dust grains and enter SWS detectors.
          </p>
        </div>
      );

    case 'heat_flow_schematic':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Schematic cutaway showing ~2.3 m lunar regolith borehole with temperature probes and depth labels"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Schematic</span>
            <span className="sci-viz-subbadge">~2.3 METRE BOREHOLE PROBES</span>
          </div>
          <svg viewBox="0 0 420 155" className="sci-viz-svg" aria-hidden="true">
            <rect x="40" y="26" width="340" height="22" fill="#94a3b8" opacity="0.25" />
            <line x1="40" y1="26" x2="380" y2="26" stroke="#cbd5e1" strokeWidth="2" />
            <rect x="40" y="48" width="340" height="86" fill="#334155" opacity="0.6" />
            {/* Borehole & Probe */}
            <rect x="196" y="26" width="28" height="102" fill="#0f172a" stroke="#7dd3fc" strokeWidth="1.4" />
            <line x1="210" y1="16" x2="210" y2="122" stroke="#38bdf8" strokeWidth="3" />
            {/* Depth sensor nodes */}
            {[50, 76, 102, 118].map((y, idx) => (
              <g key={y}>
                <circle cx="210" cy={y} r="4.5" fill="#f97316" stroke="#fde68a" strokeWidth="1.2" />
                <text x="234" y={y + 3} fill="#e2e8f0" fontSize="9.5">
                  Sensor {idx + 1} ({(0.5 + idx * 0.6).toFixed(1)} m)
                </text>
              </g>
            ))}
            <text x="115" y="90" textAnchor="middle" fill="#fed7aa" fontSize="10.5">Internal heat flow</text>
            <text x="115" y="104" textAnchor="middle" fill="#fed7aa" fontSize="10">↑ slower than Earth</text>
            <text x="115" y="128" textAnchor="middle" fill="#7dd3fc" fontSize="10">~2.3 m probe depth</text>
          </svg>
          <p className="sci-viz-caption">
            Schematic: Temperature sensors and small heaters placed ~2.3 m deep measured heat rising gently through lunar soil.
          </p>
        </div>
      );

    case 'dust_detector_schematic':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Schematic of Apollo 12 and 15 Lunar Dust Detector solar cells and temperature sensors"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Schematic</span>
            <span className="sci-viz-subbadge">LUNAR DUST DETECTOR (APOLLO 12 &amp; 15)</span>
          </div>
          <svg viewBox="0 0 420 135" className="sci-viz-svg" aria-hidden="true">
            <rect x="90" y="34" width="240" height="72" rx="8" fill="#1e293b" stroke="#7dd3fc" strokeWidth="1.6" />
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect x={112 + i * 72} y="48" width="52" height="36" rx="4" fill="#0c4a6e" stroke="#38bdf8" />
                <text x={138 + i * 72} y="70" textAnchor="middle" fill="#e0f2fe" fontSize="9.5">Cell {i + 1}</text>
              </g>
            ))}
            <text x="210" y="122" textAnchor="middle" fill="#cbd5e1" fontSize="10">
              Three reference solar cells + temperature sensors mounted atop Central Station
            </text>
          </svg>
          <p className="sci-viz-caption">
            Schematic: Watching how solar-cell output changed over time revealed dust accumulation and radiation exposure.
          </p>
        </div>
      );

    case 'dust_detector_accumulation':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Conceptual illustration of sharp lunar dust settling onto a solar cell with before and after output"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Conceptual illustration</span>
            <span className="sci-viz-subbadge">NOT MEASURED NASA OUTPUT</span>
          </div>
          <svg viewBox="0 0 420 140" className="sci-viz-svg" aria-hidden="true">
            <rect x="34" y="32" width="146" height="72" rx="8" fill="#0f172a" stroke="#4ade80" strokeWidth="1.5" />
            <rect x="50" y="44" width="114" height="30" fill="#0284c7" />
            <text x="107" y="92" textAnchor="middle" fill="#86efac" fontSize="10.5" fontWeight="700">Before: Clean Cell (High V)</text>

            <text x="210" y="72" textAnchor="middle" fill="#fde68a" fontSize="14" fontWeight="800">→</text>

            <rect x="240" y="32" width="146" height="72" rx="8" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.5" />
            <rect x="256" y="44" width="114" height="30" fill="#334155" />
            {[266, 284, 304, 326, 344, 358, 275, 315].map((x, idx) => (
              <polygon key={x} points={`${x},${50 + (idx % 3) * 6} ${x + 4},${56 + (idx % 3) * 6} ${x - 3},${57 + (idx % 3) * 6}`} fill="#cbd5e1" />
            ))}
            <text x="313" y="92" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontWeight="700">After: Dust Coat (Reduced)</text>
          </svg>
          <p className="sci-viz-caption">
            Conceptual illustration: Sharp jagged electrostatically charged grains settle on solar cells, fogging output over time.
          </p>
        </div>
      );
  }
};
