import React, { useState } from 'react';

export type FinalActVisualizationId =
  | 'supernova_radiation_alert'
  | 'scrap_shielding_diagram'
  | 'asteroid_belt_ceres'
  | 'phoenix_met_thermocouple'
  | 'phoenix_met_pressure_curve'
  | 'phoenix_met_telltale_wind'
  | 'earth_aurora_reentry';

interface Props {
  id: FinalActVisualizationId;
  reduceMotion?: boolean;
}

const WIND_PROFILES = [
  {
    id: 'early',
    label: 'Sols 1–60: 3–6 m/s',
    angleDeg: 18,
    summary: 'Early sols showed repeatable daily breezes cycling gently around 3–6 m/s across the northern plain.'
  },
  {
    id: 'late',
    label: 'Later Avg: 8 m/s',
    angleDeg: 31,
    summary: 'Later in the mission, westerly winds rose to daytime averages near 8 m/s while nights stayed calm.'
  },
  {
    id: 'gust',
    label: 'Sol 148 Gust: 16 m/s',
    angleDeg: 50,
    summary: 'Strongest recorded Telltale swing on Sol 148 reached ~16 m/s (~58 km/h) before winter arrived.'
  }
];

export const FinalActVisualization: React.FC<Props> = ({ id, reduceMotion = false }) => {
  const [shieldView, setShieldView] = useState<'merger' | 'robots'>('robots');
  const [showDustDevilDip, setShowDustDevilDip] = useState<boolean>(false);
  const [windIdx, setWindIdx] = useState<number>(0);

  switch (id) {
    case 'supernova_radiation_alert':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Conceptual telemetry diagram of Threat Level 7 supernova ionising flux and outer hull erosion"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">CONCEPTUAL TELEMETRY // THREAT LEVEL 7</span>
          </div>
          <svg viewBox="0 0 420 120" className="sci-viz-svg" aria-hidden="true">
            <rect x="8" y="8" width="404" height="104" rx="8" fill="#170709" stroke="#f87171" strokeWidth="1.2" />
            <text x="18" y="26" fill="#fca5a5" fontSize="9.5" fontWeight="700">
              SENSOR SURGE: NEUTRINOS · ALPHA · X-RAY · GAMMA
            </text>
            {/* Spectrum bars */}
            {[
              { label: 'Neutrinos', pct: 0.96, y: 36 },
              { label: 'Alpha / Nuclei', pct: 0.91, y: 54 },
              { label: 'UV / X-Ray / Gamma', pct: 0.98, y: 72 }
            ].map((row) => (
              <g key={row.label}>
                <text x="18" y={row.y + 9} fill="#fecaca" fontSize="8.5">{row.label}</text>
                <rect x="130" y={row.y} width="160" height="10" rx="3" fill="#2a0a0e" stroke="#7f1d1d" />
                <rect x="130" y={row.y} width={160 * row.pct} height="10" rx="3" fill="#ef4444">
                  {!reduceMotion && (
                    <animate attributeName="opacity" values="0.72;1;0.72" dur="1.1s" repeatCount="indefinite" />
                  )}
                </rect>
              </g>
            ))}
            {/* Hull & Interior Countdown box */}
            <rect x="304" y="34" width="98" height="66" rx="6" fill="#26090d" stroke="#fb7185" />
            <text x="353" y="50" textAnchor="middle" fill="#fda4af" fontSize="8" fontWeight="700">
              HULL DECAY RATE
            </text>
            <text x="353" y="65" textAnchor="middle" fill="#ffffff" fontSize="11.5" fontWeight="800">
              47 mm / min
            </text>
            <text x="353" y="80" textAnchor="middle" fill="#fcd34d" fontSize="8">
              Damage ETA: 6m 07s
            </text>
            <text x="353" y="92" textAnchor="middle" fill="#fecaca" fontSize="7.5">
              Cabin Limit: 9m 41s
            </text>
            <text x="18" y="102" fill="#9ca3af" fontSize="7.8">
              Gravitational Wave Detector: 0 nearby masses — non-black-hole radiative event
            </text>
          </svg>
        </div>
      );

    case 'scrap_shielding_diagram':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Conceptual schematic showing dual-star supernova burst and automated mobile robots stacking shipboard mass into an 82% radiation shield"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">CONCEPTUAL SCHEMATIC // MASS SHIELDING &amp; HYPERDRIVE</span>
            <div className="sci-viz-tab-group">
              <button
                type="button"
                className={`sci-viz-toggle-btn ${shieldView === 'robots' ? 'is-active' : ''}`}
                onClick={() => setShieldView('robots')}
              >
                82% Scrap Shield
              </button>
              <button
                type="button"
                className={`sci-viz-toggle-btn ${shieldView === 'merger' ? 'is-active' : ''}`}
                onClick={() => setShieldView('merger')}
              >
                Dual-Star Supernova
              </button>
            </div>
          </div>
          <svg viewBox="0 0 420 112" className="sci-viz-svg" aria-hidden="true">
            <rect x="6" y="6" width="408" height="100" rx="8" fill="#120912" stroke="#f59e0b" strokeWidth="1" />
            {shieldView === 'robots' ? (
              <g>
                {/* Incoming radiation arrows */}
                <line x1="18" y1="30" x2="88" y2="30" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4 3" />
                <line x1="18" y1="56" x2="88" y2="56" stroke="#f97316" strokeWidth="2.5" strokeDasharray="4 3" />
                <line x1="18" y1="82" x2="88" y2="82" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4 3" />
                <text x="52" y="20" textAnchor="middle" fill="#fca5a5" fontSize="8">ION FLUX</text>

                {/* Improvised shield wall */}
                <rect x="94" y="18" width="64" height="76" rx="4" fill="#334155" stroke="#fbbf24" strokeWidth="1.5" />
                <text x="126" y="34" textAnchor="middle" fill="#fde68a" fontSize="7.2" fontWeight="700">HULL PLATES</text>
                <text x="126" y="48" textAnchor="middle" fill="#e2e8f0" fontSize="7">CRATES &amp; METAL</text>
                <text x="126" y="62" textAnchor="middle" fill="#e2e8f0" fontSize="7">FURNITURE</text>
                <text x="126" y="76" textAnchor="middle" fill="#38bdf8" fontSize="7" fontWeight="700">FELICE TOOLBOX</text>
                <text x="126" y="89" textAnchor="middle" fill="#86efac" fontSize="7.5" fontWeight="700">82% SHIELDED</text>

                {/* Protected Ship Zones */}
                <rect x="176" y="20" width="224" height="32" rx="5" fill="#0f293a" stroke="#38bdf8" />
                <text x="288" y="39" textAnchor="middle" fill="#e0f2fe" fontSize="8.8" fontWeight="700">
                  HUMAN CHAMBERS — ALARMS MUTED, 0 INJURIES
                </text>
                <rect x="176" y="60" width="110" height="30" rx="5" fill="#1e293b" stroke="#94a3b8" />
                <text x="231" y="79" textAnchor="middle" fill="#f8fafc" fontSize="8">POWER SUPPLY</text>
                <rect x="292" y="60" width="108" height="30" rx="5" fill="#172554" stroke="#60a5fa" />
                <text x="346" y="79" textAnchor="middle" fill="#93c5fd" fontSize="8">HYPERDRIVE × 6</text>
              </g>
            ) : (
              <g>
                <circle cx="96" cy="56" r="26" fill="rgba(239,68,68,0.22)" stroke="#ef4444" strokeDasharray="3 2" />
                <circle cx="88" cy="54" r="10" fill="#fef08a" />
                <circle cx="104" cy="58" r="8" fill="#fb7185" />
                <text x="96" y="96" textAnchor="middle" fill="#fca5a5" fontSize="8">Merged Binary Star</text>
                <path d="M 128 56 L 204 56" stroke="#fbbf24" strokeWidth="2.5" />
                <polygon points="204,51 214,56 204,61" fill="#fbbf24" />
                <text x="170" y="46" textAnchor="middle" fill="#fde68a" fontSize="8">Supernova Pulse</text>
                <rect x="220" y="24" width="182" height="64" rx="6" fill="#1f1120" stroke="#f472b6" />
                <text x="311" y="44" textAnchor="middle" fill="#fbcfe8" fontSize="8.8" fontWeight="700">
                  DB CROSS-CHECK MATCHED
                </text>
                <text x="311" y="59" textAnchor="middle" fill="#e2e8f0" fontSize="7.8">
                  Two ancient companion stars merged into one
                </text>
                <text x="311" y="72" textAnchor="middle" fill="#cbd5e1" fontSize="7.8">
                  before detonating across neighbouring space
                </text>
              </g>
            )}
          </svg>
        </div>
      );

    case 'asteroid_belt_ceres':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Conceptual scale diagram comparing sparse Asteroid Belt spacing and Dwarf Planet Ceres mass versus the Moon"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">CONCEPTUAL SCALE // ASTEROID BELT &amp; CERES</span>
          </div>
          <svg viewBox="0 0 420 100" className="sci-viz-svg" aria-hidden="true">
            <rect x="6" y="6" width="408" height="88" rx="8" fill="#0d131a" stroke="#64748b" />
            <text x="20" y="24" fill="#cbd5e1" fontSize="8.5" fontWeight="700">
              TOTAL MASS COMPARISON (ALL MAIN-BELT ASTEROIDS COMBINED &lt; MOON)
            </text>
            {/* Earth's Moon reference */}
            <circle cx="52" cy="58" r="20" fill="#cbd5e1" stroke="#94a3b8" />
            <text x="52" y="88" textAnchor="middle" fill="#e2e8f0" fontSize="7.8">Earth&apos;s Moon (~33x Belt)</text>

            {/* Whole belt (~3% of Moon mass) */}
            <circle cx="176" cy="58" r="6.5" fill="#f59e0b" />
            <text x="176" y="75" textAnchor="middle" fill="#fde68a" fontSize="7.8">Entire Asteroid Belt</text>
            <text x="176" y="86" textAnchor="middle" fill="#94a3b8" fontSize="7">~3% mass of the Moon</text>

            {/* Ceres share (~1/3 of belt) */}
            <circle cx="318" cy="58" r="4.5" fill="#38bdf8" />
            <text x="318" y="75" textAnchor="middle" fill="#bae6fd" fontSize="7.8">Dwarf Planet Ceres</text>
            <text x="318" y="86" textAnchor="middle" fill="#94a3b8" fontSize="7">~1/3 of total Belt mass (~100,000+ km gaps)</text>
          </svg>
        </div>
      );

    case 'phoenix_met_thermocouple':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Remote console archive diagram showing Phoenix MET 1-meter mast with three hairline thermocouples and Seebeck voltage sensing"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">INSIDE SHIP // REMOTE PHOENIX MET THERMOCOUPLE MAST</span>
          </div>
          <svg viewBox="0 0 420 118" className="sci-viz-svg" aria-hidden="true">
            <rect x="6" y="6" width="408" height="106" rx="8" fill="#0e1826" stroke="#38bdf8" />
            {/* 1m Mast */}
            <rect x="64" y="18" width="6" height="72" rx="2" fill="#94a3b8" />
            <rect x="34" y="86" width="84" height="10" rx="2" fill="#475569" />
            <text x="76" y="106" textAnchor="middle" fill="#cbd5e1" fontSize="7.5">Lander Deck (warm bias like laptop)</text>

            {/* 3 Thermocouple nodes */}
            <circle cx="67" cy="26" r="4.5" fill="#38bdf8" />
            <line x1="72" y1="26" x2="112" y2="26" stroke="#38bdf8" strokeDasharray="2 2" />
            <text x="116" y="29" fill="#e0f2fe" fontSize="8.2">Upper Sensor (~1 m): Early afternoon peak ≈ −30 °C</text>

            <circle cx="67" cy="50" r="4" fill="#fbbf24" />
            <line x1="72" y1="50" x2="112" y2="50" stroke="#fbbf24" strokeDasharray="2 2" />
            <text x="116" y="53" fill="#fde68a" fontSize="8.2">Mid Sensor: ±10 °C rapid turbulent air jumps</text>

            <circle cx="67" cy="74" r="4" fill="#fb7185" />
            <line x1="72" y1="74" x2="112" y2="74" stroke="#fb7185" strokeDasharray="2 2" />
            <text x="116" y="77" fill="#fecdd3" fontSize="8.2">Lower Sensor: Deck heat leak anomaly (&quot;cat on laptop&quot;)</text>

            <text x="210" y="96" fill="#7dd3fc" fontSize="7.6">
              Seebeck Effect: 2 dissimilar hair-thin wires welded &rarr; ΔT creates tiny µV signal
            </text>
          </svg>
        </div>
      );

    case 'phoenix_met_pressure_curve':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Remote console archive chart showing Martian seasonal pressure falling from 860 Pa to 720 Pa plus brief dust devil dips"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">REMOTE ARCHIVE // FMI BAROMETER (SOLS 1–150)</span>
            <button
              type="button"
              className={`sci-viz-toggle-btn ${showDustDevilDip ? 'is-active' : ''}`}
              onClick={() => setShowDustDevilDip((prev) => !prev)}
            >
              {showDustDevilDip ? 'Hide Dust Devil Dip' : 'Show Dust Devil Dip'}
            </button>
          </div>
          <svg viewBox="0 0 420 112" className="sci-viz-svg" aria-hidden="true">
            <rect x="6" y="6" width="408" height="100" rx="8" fill="#0d1724" stroke="#60a5fa" />
            <text x="18" y="24" fill="#bfdbfe" fontSize="8.5" fontWeight="700">
              AIR PRESSURE &lt; 1% OF EARTH — PLANET &quot;BREATHING IN&quot; (CO2 FREEZES ON SOUTH POLE)
            </text>
            {/* Axis */}
            <line x1="46" y1="34" x2="46" y2="84" stroke="#475569" />
            <line x1="46" y1="84" x2="394" y2="84" stroke="#475569" />
            <text x="40" y="42" textAnchor="end" fill="#93c5fd" fontSize="8">860 Pa</text>
            <text x="40" y="79" textAnchor="end" fill="#93c5fd" fontSize="8">720 Pa</text>

            {/* Seasonal decline curve */}
            {showDustDevilDip ? (
              <path
                d="M 52 40 L 145 48 L 152 63 L 159 49 L 255 61 L 261 73 L 267 62 L 386 78"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
              />
            ) : (
              <path
                d="M 52 40 Q 210 55 386 78"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.8"
              />
            )}
            <circle cx="52" cy="40" r="3.5" fill="#38bdf8" />
            <circle cx="386" cy="78" r="3.5" fill="#a78bfa" />
            <text x="220" y="98" textAnchor="middle" fill="#cbd5e1" fontSize="7.8">
              2-second sampling · 2 backup sensor heads ·{' '}
              {showDustDevilDip ? 'Sharp transient drops = overhead dust devils' : 'Smooth decline = CO2 condensing onto south pole'}
            </text>
          </svg>
        </div>
      );

    case 'phoenix_met_telltale_wind': {
      const profile = WIND_PROFILES[windIdx] || WIND_PROFILES[0];
      const rad = (profile.angleDeg * Math.PI) / 180;
      const tipX = 110 + Math.sin(rad) * 44;
      const tipY = 26 + Math.cos(rad) * 44;
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Remote conceptual schematic of the Phoenix Telltale wind instrument suspended on Kevlar fibres"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">REMOTE ARCHIVE // TELLTALE HANGING CYLINDER</span>
            <div className="sci-viz-tab-group">
              {WIND_PROFILES.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  className={`sci-viz-toggle-btn ${windIdx === idx ? 'is-active' : ''}`}
                  onClick={() => setWindIdx(idx)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <svg viewBox="0 0 420 108" className="sci-viz-svg" aria-hidden="true">
            <rect x="6" y="6" width="408" height="96" rx="8" fill="#0d1826" stroke="#22d3ee" />
            {/* Support hook */}
            <line x1="78" y1="26" x2="142" y2="26" stroke="#94a3b8" strokeWidth="3" />
            {/* Vertical plumb reference */}
            <line x1="110" y1="26" x2="110" y2="84" stroke="#334155" strokeDasharray="3 2" />
            {/* Kevlar thread & swung cylinder */}
            <line x1="110" y1="26" x2={tipX} y2={tipY} stroke="#e2e8f0" strokeWidth="1.6" />
            <g transform={`translate(${tipX}, ${tipY}) rotate(${-profile.angleDeg})`}>
              <rect x="-7" y="-2" width="14" height="22" rx="3" fill="#38bdf8" stroke="#0284c7" />
            </g>
            {/* Wind arrows */}
            <line x1="36" y1="54" x2="78" y2="54" stroke="#67e8f9" strokeWidth="2" />
            <polygon points="78,50 86,54 78,58" fill="#67e8f9" />
            <text x="172" y="34" fill="#67e8f9" fontSize="8.8" fontWeight="700">
              {profile.label} (Kevlar-Suspended Deflection)
            </text>
            <text x="172" y="52" fill="#e2e8f0" fontSize="7.8">
              Photographed up to once every 50 seconds by SSI camera
            </text>
            <text x="172" y="68" fill="#cbd5e1" fontSize="7.8">
              PDS Archive: Sols 1–150 — Mars&apos;s first ongoing weather forecast
            </text>
            <text x="172" y="84" fill="#94a3b8" fontSize="7.4">
              {profile.summary.slice(0, 74)}...
            </text>
          </svg>
        </div>
      );
    }

    case 'earth_aurora_reentry':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Ship windshield overlay showing green and violet aurora reentry ribbon and Félicette 1963 space cat tribute"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">EARTH APPROACH // SECTOR 6A, SLOT 37 (ETA 2 MIN)</span>
          </div>
          <svg viewBox="0 0 420 96" className="sci-viz-svg" aria-hidden="true">
            <defs>
              <linearGradient id="auroraRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.85" />
              </linearGradient>
            </defs>
            <rect x="6" y="6" width="408" height="84" rx="8" fill="#06121c" stroke="#34d399" />
            <path
              d="M 16 42 Q 115 16 210 38 T 404 34"
              fill="none"
              stroke="url(#auroraRibbon)"
              strokeWidth="12"
              strokeLinecap="round"
              opacity="0.7"
            >
              {!reduceMotion && (
                <animate
                  attributeName="d"
                  values="M 16 42 Q 115 16 210 38 T 404 34; M 16 36 Q 115 54 210 30 T 404 42; M 16 42 Q 115 16 210 38 T 404 34"
                  dur="4s"
                  repeatCount="indefinite"
                />
              )}
            </path>
            <text x="210" y="62" textAnchor="middle" fill="#ecfdf5" fontSize="9" fontWeight="700">
              1963 FÉLICETTE TRIBUTE · PARIS TO ORBIT AND SAFE RETURN HOME
            </text>
            <text x="210" y="78" textAnchor="middle" fill="#a7f3d0" fontSize="7.8">
              Green &amp; violet auroral curtain across upper-atmosphere reentry window
            </text>
          </svg>
        </div>
      );
  }
};
