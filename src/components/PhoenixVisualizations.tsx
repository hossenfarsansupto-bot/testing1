import React, { useState } from 'react';

export type PhoenixVisualizationId =
  | 'sublimation_comparison'
  | 'tega_furnace'
  | 'meca_microscopes'
  | 'tecp_probe'
  | 'arctic_water_cycle'
  | 'phoenix_timeline';

interface Props {
  id: PhoenixVisualizationId;
  reduceMotion?: boolean;
}

export const PhoenixVisualization: React.FC<Props> = ({ id }) => {
  const [phaseStep, setPhaseStep] = useState<'solid' | 'vapour'>('solid');
  const [ovenIdx, setOvenIdx] = useState<number>(1);

  switch (id) {
    case 'sublimation_comparison':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Illustrative diagram showing phase change from surface ice crystals directly to water vapour on Mars"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Illustrative diagram (static)</span>
            <div className="sci-viz-toggle" role="group" aria-label="Sublimation stage toggle">
              <button
                type="button"
                className={`sci-viz-toggle-btn ${phaseStep === 'solid' ? 'active' : ''}`}
                onClick={() => setPhaseStep('solid')}
              >
                Sol 20 (Fresh Trench)
              </button>
              <button
                type="button"
                className={`sci-viz-toggle-btn ${phaseStep === 'vapour' ? 'active' : ''}`}
                onClick={() => setPhaseStep('vapour')}
              >
                4 Days Later
              </button>
            </div>
          </div>
          <div className="sci-viz-status-box">
            <strong>
              {phaseStep === 'solid'
                ? 'Bright Subsurface Lumps Exposed in Trench'
                : 'Lumps Vanished Without Melting Into Puddles'}
            </strong>
            <p className="sci-viz-note" style={{ marginTop: '0.2rem' }}>
              {phaseStep === 'solid'
                ? 'Phoenix uncovered pale bright lumps centimetres under rusty arctic soil.'
                : 'Over four sols in low Martian pressure and freezing air, exposed lumps disappeared without leaving wet liquid soil.'}
            </p>
          </div>
        </div>
      );

    case 'tega_furnace':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Illustrative schematic of Phoenix TEGA: eight single-use ovens up to 1,000 degrees Celsius paired with calorimeter and mass spectrometer"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Illustrative schematic (TEGA)</span>
            <span className="sci-viz-subbadge">8 Single-Use Ovens &bull; ~1,000 &deg;C</span>
          </div>
          <svg viewBox="0 0 420 128" className="sci-viz-svg" aria-hidden="true">
            <rect x="14" y="24" width="128" height="80" rx="8" fill="#1e293b" stroke="#fb923c" strokeWidth="1.5" />
            <text x="78" y="42" textAnchor="middle" fill="#fed7aa" fontSize="9.5" fontWeight="700">
              8 Mini Ovens (1 use each)
            </text>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const cx = 28 + (i % 4) * 28;
              const cy = i < 4 ? 54 : 76;
              const active = i + 1 === ovenIdx;
              return (
                <rect
                  key={i}
                  x={cx}
                  y={cy}
                  width="18"
                  height="15"
                  rx="3"
                  fill={active ? '#ea580c' : '#334155'}
                  stroke={active ? '#fde68a' : '#64748b'}
                  strokeWidth="1.2"
                />
              );
            })}

            <line x1="144" y1="50" x2="176" y2="42" stroke="#38bdf8" strokeWidth="2" />
            <line x1="144" y1="78" x2="176" y2="86" stroke="#f472b6" strokeWidth="2" />

            <rect x="178" y="20" width="106" height="40" rx="7" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.4" />
            <text x="231" y="38" textAnchor="middle" fill="#f8fafc" fontSize="9.2" fontWeight="700">
              Scanning Calorimeter
            </text>
            <text x="231" y="51" textAnchor="middle" fill="#bae6fd" fontSize="8">
              Tracks heating power
            </text>

            <rect x="178" y="68" width="106" height="40" rx="7" fill="#4a044e" stroke="#f472b6" strokeWidth="1.4" />
            <text x="231" y="86" textAnchor="middle" fill="#fae8ff" fontSize="9.2" fontWeight="700">
              Mass Spectrometer
            </text>
            <text x="231" y="99" textAnchor="middle" fill="#f5d0fe" fontSize="8">
              Identifies released gases
            </text>

            <line x1="286" y1="64" x2="314" y2="64" stroke="#4ade80" strokeWidth="2" />
            <polygon points="310,59 320,64 310,69" fill="#4ade80" />

            <rect x="322" y="34" width="84" height="60" rx="8" fill="#064e3b" stroke="#4ade80" strokeWidth="1.4" />
            <text x="364" y="56" textAnchor="middle" fill="#d1fae5" fontSize="9.2" fontWeight="700">
              Volatiles Match
            </text>
            <text x="364" y="70" textAnchor="middle" fill="#a7f3d0" fontSize="8">
              H₂O vapour verified
            </text>
            <text x="364" y="82" textAnchor="middle" fill="#a7f3d0" fontSize="8">
              July 31, 2008
            </text>
          </svg>
          <div className="sci-viz-toggle" style={{ marginTop: '0.35rem', justifyContent: 'center' }} role="group" aria-label="Select TEGA oven cell">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <button
                key={n}
                type="button"
                className={`sci-viz-toggle-btn ${ovenIdx === n ? 'active' : ''}`}
                onClick={() => setOvenIdx(n)}
              >
                Oven {n}
              </button>
            ))}
          </div>
          <p className="sci-viz-note">
            TEGA paired ballpoint-ink-tube-sized ovens (~1,000 &deg;C) with a calorimeter &amp; mass spectrometer. Clumpy Martian soil required scoop vibrations to pass the inlet screen.
          </p>
        </div>
      );

    case 'meca_microscopes':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Comparison between Optical Microscope and Atomic Force Microscope on Phoenix MECA"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Illustrative comparison</span>
            <span className="sci-viz-subbadge">Two Microscopes</span>
          </div>
          <div className="sci-viz-compare-grid">
            <div className="sci-viz-compare-col">
              <strong className="sci-viz-col-head is-amber">Optical Microscope</strong>
              <ul>
                <li>Photographs individual soil grains (~human hair scale)</li>
                <li>Round grains &rarr; long travel / abrasion</li>
                <li>Angular grains &rarr; short journey; fine dust &rarr; wind</li>
              </ul>
            </div>
            <div className="sci-viz-compare-col">
              <strong className="sci-viz-col-head is-cyan">Atomic Force Microscope</strong>
              <ul>
                <li>No optical lens — drags sharp cantilever tip</li>
                <li>Laser tracks tip bending across surface bumps</li>
                <li>Builds 3D nanoscale relief with spare cantilever tips</li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'tecp_probe':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Illustrative schematic of the four-needle Thermal and Electrical Conductivity Probe pressed into Martian soil"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Illustrative schematic</span>
            <span className="sci-viz-subbadge">TECP &bull; Soil &amp; Air</span>
          </div>
          <svg viewBox="0 0 420 116" className="sci-viz-svg" aria-hidden="true">
            <rect x="40" y="16" width="120" height="32" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="100" y="36" textAnchor="middle" fill="#e0f2fe" fontSize="9.5" fontWeight="700">
              Robotic Arm Wrist
            </text>
            {[64, 86, 108, 130].map((nx) => (
              <line key={nx} x1={nx} y1="48" x2={nx} y2="94" stroke="#fbbf24" strokeWidth="2.4" strokeLinecap="round" />
            ))}
            <path d="M18,74 Q100,70 182,74 L182,110 L18,110 Z" fill="rgba(180, 83, 9, 0.38)" stroke="#fb923c" strokeWidth="1.4" />
            <text x="100" y="104" textAnchor="middle" fill="#fed7aa" fontSize="8.5" fontWeight="700">
              Martian Permafrost Soil
            </text>

            <rect x="204" y="20" width="200" height="82" rx="8" fill="#0f172a" stroke="#475569" strokeWidth="1.4" />
            <text x="218" y="42" fill="#7dd3fc" fontSize="9.5" fontWeight="700">3 Coupled Measurements:</text>
            <text x="218" y="60" fill="#e2e8f0" fontSize="8.8">&bull; Thermal conductivity (heat flow)</text>
            <text x="218" y="76" fill="#e2e8f0" fontSize="8.8">&bull; Electrical conductivity (moisture/salts)</text>
            <text x="218" y="92" fill="#e2e8f0" fontSize="8.8">&bull; Local near-surface air humidity</text>
          </svg>
        </div>
      );

    case 'arctic_water_cycle':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Summary of Martian Arctic water cycle: subsurface ice, perchlorates, vapour, frost, and snowfall"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Mission Science Summary</span>
            <span className="sci-viz-subbadge">TEGA + MECA + Lidar</span>
          </div>
          <div className="sci-viz-compare-grid">
            <div className="sci-viz-compare-col">
              <strong className="sci-viz-col-head is-cyan">Verified Findings</strong>
              <ul>
                <li>Water ice centimetres below dusty arctic soil</li>
                <li>Mildly alkaline soil (~pH 7.7–8.3) with soluble salts</li>
                <li>Perchlorates discovered (lowers freezing point; oxidiser)</li>
              </ul>
            </div>
            <div className="sci-viz-compare-col">
              <strong className="sci-viz-col-head is-amber">Active Arctic Sky</strong>
              <ul>
                <li>Lidar detected ice crystals snowing from clouds</li>
                <li>Morning frost cycles with Arctic seasons</li>
                <li>Solved 30-year Viking organics heating clue</li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'phoenix_timeline':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Restrained Phoenix Mars Lander Arctic mission timeline (May to November 2008)"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Mission Timeline</span>
            <span className="sci-viz-subbadge">Solar-Powered Arctic Summer</span>
          </div>
          <div className="sci-viz-timeline-rows">
            <div className="sci-viz-timeline-row">
              <span className="sci-timeline-date">May 25, 2008</span>
              <span>Landed in Vastitas Borealis (~68&deg; N) after ~680M km cruise; 90-sol baseline</span>
            </div>
            <div className="sci-viz-timeline-row">
              <span className="sci-timeline-date">Jun – Jul 2008</span>
              <span>Sublimating trench ice photographed; TEGA confirmed H₂O vapour on July 31</span>
            </div>
            <div className="sci-viz-timeline-row">
              <span className="sci-timeline-date">Nov 2008</span>
              <span>Arctic sunlight faded; last signal Nov 2, quiet mission end Nov 10</span>
            </div>
          </div>
        </div>
      );
  }
};
