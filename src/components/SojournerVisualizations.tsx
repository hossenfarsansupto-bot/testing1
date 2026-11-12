import React, { useState } from 'react';

export type SojournerVisualizationId =
  | 'sojourner_mobility'
  | 'apxs_principle'
  | 'apxs_spectroscopy'
  | 'barnacle_bill_chem'
  | 'yogi_compare'
  | 'pathfinder_timeline';

interface Props {
  id: SojournerVisualizationId;
  reduceMotion?: boolean;
}

export const SojournerVisualization: React.FC<Props> = ({
  id
}) => {
  const [channel, setChannel] = useState<'alpha' | 'proton' | 'xray'>('alpha');

  switch (id) {
    case 'sojourner_mobility':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Illustrative diagram of Sojourner's 6-wheel rocker-bogie suspension and lander relay"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Illustrative schematic</span>
            <span className="sci-viz-subbadge">Rocker-Bogie &bull; ~1 cm/s</span>
          </div>
          <svg viewBox="0 0 420 128" className="sci-viz-svg" aria-hidden="true">
            {/* Uneven Martian ground contour */}
            <path
              d="M16,104 L110,104 L145,86 L185,102 L265,102 L300,92 L404,104"
              fill="none"
              stroke="#fb923c"
              strokeWidth="2.2"
            />
            {/* Solar deck & body */}
            <rect x="112" y="42" width="128" height="22" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.6" />
            <text x="176" y="57" textAnchor="middle" fill="#e0f2fe" fontSize="9.5" fontWeight="700">
              SOJOURNER (~10.5 kg)
            </text>
            {/* Rear APXS arm */}
            <polyline points="112,53 92,62 84,78" fill="none" stroke="#f59e0b" strokeWidth="2.2" />
            <circle cx="84" cy="81" r="4" fill="#fbbf24" />
            {/* Rocker-bogie linkage lines */}
            <polyline points="140,86 156,64 180,86 218,86" fill="none" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="140" cy="86" r="10" fill="#0f172a" stroke="#7dd3fc" strokeWidth="1.8" />
            <circle cx="180" cy="88" r="10" fill="#0f172a" stroke="#7dd3fc" strokeWidth="1.8" />
            <circle cx="218" cy="88" r="10" fill="#0f172a" stroke="#7dd3fc" strokeWidth="1.8" />
            {/* Relay arrow to Pathfinder -> Earth */}
            <rect x="282" y="22" width="116" height="46" rx="8" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.4" />
            <text x="340" y="42" textAnchor="middle" fill="#f8fafc" fontSize="9.5" fontWeight="700">
              Pathfinder Relay
            </text>
            <text x="340" y="57" textAnchor="middle" fill="#bae6fd" fontSize="8.5">
              Rover &rarr; Lander &rarr; Earth
            </text>
            <line x1="242" y1="48" x2="280" y2="45" stroke="#4ade80" strokeWidth="1.8" strokeDasharray="3 3" />
          </svg>
          <p className="sci-viz-note">
            Explanatory diagram: six-wheel rocker-bogie suspension keeps wheels in contact on uneven rocks while Pathfinder relays Earth commands (~100 m traversed over 83 sols).
          </p>
        </div>
      );

    case 'apxs_principle':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Conceptual illustration of APXS curium-244 bombardment and three emitted signals"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Conceptual illustration (silent)</span>
            <span className="sci-viz-subbadge">Curium-244 Source</span>
          </div>
          <svg viewBox="0 0 420 128" className="sci-viz-svg" aria-hidden="true">
            <rect x="16" y="34" width="96" height="58" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="64" y="58" textAnchor="middle" fill="#fde68a" fontSize="10" fontWeight="700">Curium-244</text>
            <text x="64" y="74" textAnchor="middle" fill="#cbd5e1" fontSize="8.5">Alpha particles</text>
            <text x="64" y="85" textAnchor="middle" fill="#94a3b8" fontSize="8">(helium nuclei)</text>

            <path d="M114,63 L152,63" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 3" />
            <polygon points="148,58 158,63 148,68" fill="#fbbf24" />

            <rect x="160" y="34" width="84" height="58" rx="8" fill="#451a03" stroke="#fb923c" strokeWidth="1.5" />
            <text x="202" y="58" textAnchor="middle" fill="#fed7aa" fontSize="10" fontWeight="700">Target Rock</text>
            <text x="202" y="74" textAnchor="middle" fill="#fdba74" fontSize="8.5">Atomic nuclei</text>
            <text x="202" y="85" textAnchor="middle" fill="#fdba74" fontSize="8">interaction</text>

            <line x1="246" y1="48" x2="278" y2="28" stroke="#38bdf8" strokeWidth="1.8" />
            <line x1="246" y1="63" x2="278" y2="63" stroke="#4ade80" strokeWidth="1.8" />
            <line x1="246" y1="78" x2="278" y2="98" stroke="#f472b6" strokeWidth="1.8" />

            <rect x="280" y="14" width="124" height="26" rx="6" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.3" />
            <text x="342" y="31" textAnchor="middle" fill="#e0f2fe" fontSize="8.8" fontWeight="700">1. Alpha Backscatter</text>

            <rect x="280" y="50" width="124" height="26" rx="6" fill="#064e3b" stroke="#4ade80" strokeWidth="1.3" />
            <text x="342" y="67" textAnchor="middle" fill="#d1fae5" fontSize="8.8" fontWeight="700">2. Knocked Protons</text>

            <rect x="280" y="86" width="124" height="26" rx="6" fill="#4a044e" stroke="#f472b6" strokeWidth="1.3" />
            <text x="342" y="103" textAnchor="middle" fill="#fae8ff" fontSize="8.8" fontWeight="700">3. Characteristic X-rays</text>
          </svg>
          <p className="sci-viz-note">
            Conceptual flow: particles from the APXS sensor head interact with surface atoms and return three radiation signals to determine elemental ingredients.
          </p>
        </div>
      );

    case 'apxs_spectroscopy':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Conceptual three-channel APXS detector guide"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Conceptual illustration (no fabricated peaks)</span>
            <div className="sci-viz-toggle" role="group" aria-label="APXS channels">
              {([
                ['alpha', 'Alpha'],
                ['proton', 'Proton'],
                ['xray', 'X-ray']
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`sci-viz-toggle-btn ${channel === key ? 'active' : ''}`}
                  onClick={() => setChannel(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="sci-viz-status-box">
            <strong>
              {channel === 'alpha'
                ? 'Alpha Backscatter Channel'
                : channel === 'proton'
                  ? 'Proton Channel'
                  : 'X-Ray Fluorescence Channel'}
            </strong>
            <p className="sci-viz-note" style={{ marginTop: '0.2rem' }}>
              {channel === 'alpha'
                ? 'Helps detect lighter elements by measuring how alpha particle energies shift when bouncing off sample nuclei.'
                : channel === 'proton'
                  ? 'Captures protons knocked out of lighter atomic nuclei during alpha bombardment.'
                  : 'Measures characteristic X-ray energies across a wide range of heavier elements; works best in the cold Martian night.'}
            </p>
          </div>
        </div>
      );

    case 'barnacle_bill_chem':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Qualitative summary distinguishing elements named for Barnacle Bill from geological interpretation"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Qualitative Findings (No Unsourced %)</span>
            <span className="sci-viz-subbadge">Barnacle Bill</span>
          </div>
          <div className="sci-viz-compare-grid">
            <div className="sci-viz-compare-col">
              <strong className="sci-viz-col-head is-amber">Named Elements</strong>
              <ul>
                <li>Silica (high abundance reported)</li>
                <li>Aluminium, Iron, Magnesium, Calcium</li>
                <li>Ingredients list only — surface dust may influence readings</li>
              </ul>
            </div>
            <div className="sci-viz-compare-col">
              <strong className="sci-viz-col-head is-cyan">Geological Interpretation</strong>
              <ul>
                <li>Resembles terrestrial andesite</li>
                <li>Silica-richer than primitive basalt</li>
                <li>Strong evidence (not a final verdict) of complex volcanic history</li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'yogi_compare':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Qualitative comparison between Yogi rock and Barnacle Bill"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Compositional Comparison</span>
            <span className="sci-viz-subbadge">Qualitative Interpretations</span>
          </div>
          <div className="sci-viz-compare-grid">
            <div className="sci-viz-compare-col">
              <strong className="sci-viz-col-head is-amber">Barnacle Bill (First Rock)</strong>
              <ul>
                <li>High silica, aluminium, iron, magnesium, calcium</li>
                <li>Andesite-like volcanic character</li>
              </ul>
            </div>
            <div className="sci-viz-compare-col">
              <strong className="sci-viz-col-head is-cyan">Yogi (Larger Rock)</strong>
              <ul>
                <li>Basaltic character (iron- &amp; magnesium-rich lava)</li>
                <li>Shows Ares Vallis is a diverse, flood-carried geological mix</li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'pathfinder_timeline':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Restrained Mars Pathfinder and Sojourner mission timeline"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Mission Timeline</span>
            <span className="sci-viz-subbadge">1996 – 1998</span>
          </div>
          <div className="sci-viz-timeline-rows">
            <div className="sci-viz-timeline-row">
              <span className="sci-timeline-date">Dec 4, 1996</span>
              <span>Launched from Cape Canaveral; reached Mars July 4, 1997</span>
            </div>
            <div className="sci-viz-timeline-row">
              <span className="sci-timeline-date">Jul 5, 1997</span>
              <span>Sojourner drove down ramp — 7-sol plan extended to 83 sols (~100 m, 16 test sites)</span>
            </div>
            <div className="sci-viz-timeline-row">
              <span className="sci-timeline-date">Sep 27, 1997</span>
              <span>Pathfinder’s final signal received at 10:23 UTC (official completion: Mar 10, 1998)</span>
            </div>
          </div>
        </div>
      );
  }
};
