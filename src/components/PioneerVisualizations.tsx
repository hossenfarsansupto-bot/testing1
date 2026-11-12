import React, { useState } from 'react';

export type PioneerVisualizationId =
  | 'pioneer_spacecraft_hotspots'
  | 'asteroid_route'
  | 'pioneer_last_signal_timeline'
  | 'spin_stabilization'
  | 'rtg_thermal_control'
  | 'pioneer_plaque_guide'
  | 'pioneer11_comparison'
  | 'pioneer_anomaly_mystery'
  | 'pioneer_thermal_recoil'
  | 'pioneer_final_comms_timeline'
  | 'pioneer_h_museum'
  | 'star_trajectories';

interface Props {
  id: PioneerVisualizationId;
  reduceMotion?: boolean;
}

const PLAQUE_REGIONS = [
  {
    key: 'hydrogen',
    label: 'Hydrogen Hyperfine Transition (21 cm)',
    desc: 'Universal physical ruler & clock (~21 cm wavelength, ~1,420 MHz) defining length and time units for the rest of the plaque.'
  },
  {
    key: 'pulsars',
    label: '14-Pulsar Sun Map',
    desc: 'Radiating binary-tick lines showing distances & pulse frequencies of 14 Milky Way pulsars relative to our Sun (plus the Galactic Center).'
  },
  {
    key: 'solar_system',
    label: 'Solar System Departure Diagram',
    desc: 'Schematic Sun & planets along bottom showing Pioneer launching from the 3rd planet (Earth) and swinging past the 5th (Jupiter).'
  },
  {
    key: 'figures',
    label: 'Two Human Figures + Pioneer Scale',
    desc: 'Man & woman silhouettes drawn to scale right in front of Pioneer’s 2.74-metre parabolic dish, with one hand raised in greeting.'
  }
];

export const PioneerVisualization: React.FC<Props> = ({ id, reduceMotion = false }) => {
  const [spinPlaying, setSpinPlaying] = useState(!reduceMotion);
  const [powerTab, setPowerTab] = useState<'power' | 'thermal'>('power');
  const [plaqueRegion, setPlaqueRegion] = useState<string>('hydrogen');
  const [diagramPart, setDiagramPart] = useState<string>('hga');
  const [p11View, setP11View] = useState<'pioneer10' | 'pioneer11'>('pioneer11');
  const [recoilAnimKey, setRecoilAnimKey] = useState(0);
  const [commsLane, setCommsLane] = useState<'p10' | 'p11'>('p10');
  const [starCraft, setStarCraft] = useState<'p10' | 'p11'>('p10');

  switch (id) {
    case 'pioneer_spacecraft_hotspots': {
      const parts: Record<string, { label: string; desc: string }> = {
        hga: {
          label: 'High-Gain Parabolic Dish (2.74 m)',
          desc: 'Aluminum honeycomb dish pointed toward Earth to beam telemetry across billions of kilometres.'
        },
        bus: {
          label: 'Hexagonal Equipment Compartment',
          desc: 'Six-sided insulated bay behind the dish housing electronics, radio receivers, and automatic thermal louvers.'
        },
        rtgs: {
          label: 'Twin RTG Nuclear Booms (Four SNAP-19 Units)',
          desc: 'Two pairs of Pu-238 radioisotope generators held far out on booms (~155 W at launch), keeping heat & radiation away from instruments.'
        },
        mag: {
          label: 'Magnetometer Boom',
          desc: 'Long extended arm positioning the helium vector magnetometer far clear of spacecraft magnetic interference.'
        }
      };
      const active = parts[diagramPart] || parts.hga;
      return (
        <div className="sci-viz-card" role="figure" aria-label="Pioneer spacecraft key hardware callouts">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Interactive Component Callouts</span>
            <span className="sci-viz-subbadge">Launch mass: ~259 kg</span>
          </div>
          <div className="sci-viz-toggle" role="group" aria-label="Inspect Pioneer hardware regions">
            {Object.entries(parts).map(([k, p]) => (
              <button
                key={k}
                type="button"
                className={`sci-viz-toggle-btn ${diagramPart === k ? 'active' : ''}`}
                onClick={() => setDiagramPart(k)}
              >
                {p.label.split(' (')[0]}
              </button>
            ))}
          </div>
          <div className="sci-viz-status-box">
            <strong>{active.label}</strong>
            <p className="sci-viz-note" style={{ marginTop: '0.2rem' }}>
              {active.desc}
            </p>
          </div>
        </div>
      );
    }

    case 'asteroid_route':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Illustrative route showing Pioneer 10 crossing the Asteroid Belt safely from Mars orbit toward Jupiter">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Illustrative Route</span>
            <span className="sci-viz-subbadge">Mars Orbit &rarr; Main Belt &rarr; Jupiter</span>
          </div>
          <svg viewBox="0 0 420 96" className="sci-viz-svg" aria-hidden="true">
            <circle cx="48" cy="48" r="14" fill="#ea580c" />
            <text x="48" y="76" textAnchor="middle" fill="#fed7aa" fontSize="9.5" fontWeight="700">Mars Orbit</text>
            {[145, 165, 185, 205, 225, 245].map((x, idx) => (
              <circle
                key={x}
                cx={x}
                cy={24 + ((idx * 17) % 48)}
                r={3 + (idx % 3)}
                fill="#94a3b8"
              />
            ))}
            <text x="195" y="86" textAnchor="middle" fill="#cbd5e1" fontSize="9">
              Main Asteroid Belt (mostly empty space)
            </text>
            <path
              d="M 62 48 Q 195 26 352 48"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.4"
              strokeDasharray="5 4"
            />
            <circle cx="368" cy="48" r="20" fill="#d97706" stroke="#fde68a" strokeWidth="1.5" />
            <text x="368" y="80" textAnchor="middle" fill="#fef3c7" fontSize="9.5" fontWeight="700">Jupiter</text>
          </svg>
          <p className="sci-viz-note">
            Conceptual crossing diagram: Pioneer 10 crossed the main asteroid belt without damage.
          </p>
        </div>
      );

    case 'pioneer_last_signal_timeline':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Pioneer 10 mission longevity timeline from March 1972 launch to January 2003 last signal and 2006 final attempt">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Pioneer 10 Longevity (~31 Years)</span>
            <span className="sci-viz-subbadge">Planned: 21 Months</span>
          </div>
          <div className="sci-viz-grid">
            <div className="sci-viz-box">
              <strong>2 Mar 1972</strong>
              <span>Launched from Earth; passed Moon&apos;s orbit in ~11 hours.</span>
            </div>
            <div className="sci-viz-box">
              <strong>31 Mar 1997</strong>
              <span>Routine science operations &amp; contact officially ended.</span>
            </div>
            <div className="sci-viz-box highlight">
              <strong>23 Jan 2003</strong>
              <span>Last very faint signal detected from 12.23 billion km away!</span>
            </div>
            <div className="sci-viz-box">
              <strong>4 Mar 2006</strong>
              <span>Final search attempt &mdash; no carrier detected (RTGs too faint).</span>
            </div>
          </div>
        </div>
      );

    case 'spin_stabilization':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Conceptual animation of Pioneer 10 spinning at 4.8 RPM to keep its high-gain antenna stabilized toward Earth">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Conceptual Explanation</span>
            <div className="sci-viz-toggle">
              <button
                type="button"
                className={`sci-viz-toggle-btn ${spinPlaying ? 'active' : ''}`}
                onClick={() => setSpinPlaying((s) => !s)}
              >
                {spinPlaying ? '⏸ Pause Spin' : '▶ Play Spin'}
              </button>
              <button
                type="button"
                className="sci-viz-toggle-btn"
                onClick={() => setSpinPlaying(!reduceMotion)}
              >
                ↺ Reset
              </button>
            </div>
          </div>
          <svg viewBox="0 0 420 112" className="sci-viz-svg" aria-hidden="true">
            <g transform="translate(110, 56)">
              <ellipse cx="0" cy="0" rx="18" ry="38" fill="#cbd5e1" stroke="#38bdf8" strokeWidth="2" />
              <line x1="-18" y1="0" x2="54" y2="0" stroke="#94a3b8" strokeWidth="3" />
              <rect x="44" y="-8" width="14" height="16" rx="2" fill="#475569" stroke="#f8fafc" />
              <path
                d="M 28 -26 A 14 26 0 0 1 28 26"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.2"
                strokeDasharray={spinPlaying && !reduceMotion ? '4 3' : undefined}
              >
                {spinPlaying && !reduceMotion && (
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-28"
                    dur="1.4s"
                    repeatCount="indefinite"
                  />
                )}
              </path>
              <text x="14" y="48" textAnchor="middle" fill="#bae6fd" fontSize="9">
                4.8 RPM spin axis (12.5s/turn)
              </text>
            </g>
            <line x1="150" y1="56" x2="325" y2="56" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 4" />
            <circle cx="355" cy="56" r="16" fill="#0284c7" stroke="#bae6fd" strokeWidth="1.5" />
            <text x="355" y="84" textAnchor="middle" fill="#e0f2fe" fontSize="9.5" fontWeight="700">
              Earth Target Axis
            </text>
          </svg>
          <p className="sci-viz-note">
            Conceptual explanation (not live telemetry): angular momentum holds the dish aimed steadily at Earth.
          </p>
        </div>
      );

    case 'rtg_thermal_control':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Conceptual Pu-238 radioisotope power conversion and automatic thermal louver control">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Conceptual Schematic</span>
            <div className="sci-viz-toggle" role="group" aria-label="Power and thermal system tabs">
              <button
                type="button"
                className={`sci-viz-toggle-btn ${powerTab === 'power' ? 'active' : ''}`}
                onClick={() => setPowerTab('power')}
              >
                Power System
              </button>
              <button
                type="button"
                className={`sci-viz-toggle-btn ${powerTab === 'thermal' ? 'active' : ''}`}
                onClick={() => setPowerTab('thermal')}
              >
                Thermal Control
              </button>
            </div>
          </div>
          {powerTab === 'power' ? (
            <div className="sci-viz-status-box">
              <strong>Pu-238 Decay Heat &rarr; Thermoelectric Conversion &rarr; Electrical Power</strong>
              <p className="sci-viz-note" style={{ marginTop: '0.25rem' }}>
                Four SNAP-19 nuclear generators mounted on two long booms supplied electrical power with no moving parts where sunlight is ~25&times; weaker than Earth.
              </p>
            </div>
          ) : (
            <div className="sci-viz-status-box">
              <strong>Automatic Thermal Louvers (&ldquo;Robot Sweat Vents&rdquo;)</strong>
              <p className="sci-viz-note" style={{ marginTop: '0.25rem' }}>
                Bi-metallic springs opened shaded louvers behind the equipment bay when internal electronics warmed near Earth and gradually closed them in frigid outer space.
              </p>
            </div>
          )}
        </div>
      );

    case 'pioneer_plaque_guide': {
      const active = PLAQUE_REGIONS.find((r) => r.key === plaqueRegion) || PLAQUE_REGIONS[0];
      return (
        <div className="sci-viz-card" role="figure" aria-label="Pioneer Plaque diagram guide with inspectable regions">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Pioneer Plaque Regions</span>
            <button
              type="button"
              className="sci-viz-toggle-btn"
              onClick={() => setPlaqueRegion('hydrogen')}
            >
              ↺ Reset View
            </button>
          </div>
          <div className="sci-viz-toggle" role="group" aria-label="Pioneer Plaque region selector">
            {PLAQUE_REGIONS.map((reg) => (
              <button
                key={reg.key}
                type="button"
                className={`sci-viz-toggle-btn ${plaqueRegion === reg.key ? 'active' : ''}`}
                onClick={() => setPlaqueRegion(reg.key)}
              >
                {reg.label.split(' (')[0]}
              </button>
            ))}
          </div>
          <div className="sci-viz-status-box">
            <strong>{active.label}</strong>
            <p className="sci-viz-note" style={{ marginTop: '0.2rem' }}>
              {active.desc}
            </p>
          </div>
        </div>
      );
    }

    case 'pioneer11_comparison':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Comparison between Pioneer 10 and Pioneer 11 flybys">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Twin Spacecraft Flyby Comparison</span>
            <div className="sci-viz-toggle" role="group" aria-label="Compare Pioneer 10 vs Pioneer 11">
              <button
                type="button"
                className={`sci-viz-toggle-btn ${p11View === 'pioneer10' ? 'active' : ''}`}
                onClick={() => setP11View('pioneer10')}
              >
                Pioneer 10 (1973)
              </button>
              <button
                type="button"
                className={`sci-viz-toggle-btn ${p11View === 'pioneer11' ? 'active' : ''}`}
                onClick={() => setP11View('pioneer11')}
              >
                Pioneer 11 (1974 / 1979)
              </button>
            </div>
          </div>
          <div className="sci-viz-grid">
            <div className={`sci-viz-box ${p11View === 'pioneer10' ? 'highlight' : ''}`}>
              <strong>Pioneer 10 &bull; Jupiter Dec 1973</strong>
              <span>Passed ~130,000+ km above cloud tops across equatorial zone.</span>
            </div>
            <div className={`sci-viz-box ${p11View === 'pioneer11' ? 'highlight' : ''}`}>
              <strong>Pioneer 11 &bull; Polar Gravity Slingshot</strong>
              <span>Dived to ~34,000 km altitude above Jupiter&apos;s cloud tops, then flew to Saturn (1 Sept 1979, ~21,000 km range).</span>
            </div>
          </div>
        </div>
      );

    case 'pioneer_anomaly_mystery':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Conceptual diagram of unexplained residual deceleration pulling Pioneers slightly off course">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Conceptual Mystery (~1980s&ndash;2012)</span>
            <span className="sci-viz-subbadge">~10 billionths of Earth gravity</span>
          </div>
          <svg viewBox="0 0 420 82" className="sci-viz-svg" aria-hidden="true">
            <line x1="30" y1="42" x2="290" y2="42" stroke="#64748b" strokeWidth="2" strokeDasharray="5 4" />
            <circle cx="235" cy="42" r="10" fill="#cbd5e1" stroke="#38bdf8" strokeWidth="2" />
            <line x1="235" y1="42" x2="180" y2="42" stroke="#fbbf24" strokeWidth="2.5" />
            <text x="174" y="34" textAnchor="end" fill="#fde68a" fontSize="9.5" fontWeight="700">
              Unexplained Residual Sunward Pull?
            </text>
            <text x="296" y="45" fill="#94a3b8" fontSize="9">
              Outbound Path
            </text>
          </svg>
          <p className="sci-viz-note">
            Conceptual physics diagram (not measured ephemeris): answer reveals the physical source.
          </p>
        </div>
      );

    case 'pioneer_thermal_recoil':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Conceptual thermal recoil force diagram showing uneven infrared photon glow decelerating Pioneer">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Thermal Recoil Solved (JPL 2012)</span>
            <button
              type="button"
              className="sci-viz-toggle-btn"
              onClick={() => setRecoilAnimKey((k) => k + 1)}
            >
              ↺ Replay Recoil
            </button>
          </div>
          <svg key={recoilAnimKey} viewBox="0 0 420 96" className="sci-viz-svg" aria-hidden="true">
            <ellipse cx="185" cy="48" rx="14" ry="30" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.8" />
            <rect x="196" y="38" width="18" height="20" rx="3" fill="#475569" stroke="#f8fafc" />
            {[34, 48, 62].map((y, idx) => (
              <path
                key={y}
                d={`M 218 ${y} L 285 ${y + (idx - 1) * 10}`}
                stroke="#f97316"
                strokeWidth="2.4"
                strokeDasharray="4 3"
              >
                {!reduceMotion && (
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-14"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                )}
              </path>
            ))}
            <text x="352" y="42" textAnchor="middle" fill="#fdba74" fontSize="9.5" fontWeight="700">
              Asymmetric Infrared
            </text>
            <text x="352" y="55" textAnchor="middle" fill="#fdba74" fontSize="9.5" fontWeight="700">
              Heat Photons &rarr;
            </text>
            <line x1="168" y1="48" x2="112" y2="48" stroke="#38bdf8" strokeWidth="3" />
            <text x="106" y="44" textAnchor="end" fill="#7dd3fc" fontSize="9.5" fontWeight="700">
              &larr; Tiny Thermal Recoil
            </text>
            <text x="106" y="57" textAnchor="end" fill="#94a3b8" fontSize="8.5">
              (NOT rocket thrusters)
            </text>
          </svg>
          <p className="sci-viz-note">
            Conceptual explanation: warmth from Pu-238 RTGs &amp; electronics bounced asymmetrically off the back of the dish, nudging Pioneer gently backward.
          </p>
        </div>
      );

    case 'pioneer_final_comms_timeline':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Separate mission communication chronologies for Pioneer 10 and Pioneer 11">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Two-Lane Mission Chronology</span>
            <div className="sci-viz-toggle" role="group" aria-label="Select spacecraft chronology">
              <button
                type="button"
                className={`sci-viz-toggle-btn ${commsLane === 'p10' ? 'active' : ''}`}
                onClick={() => setCommsLane('p10')}
              >
                Pioneer 10
              </button>
              <button
                type="button"
                className={`sci-viz-toggle-btn ${commsLane === 'p11' ? 'active' : ''}`}
                onClick={() => setCommsLane('p11')}
              >
                Pioneer 11
              </button>
            </div>
          </div>
          {commsLane === 'p11' ? (
            <div className="sci-viz-grid">
              <div className="sci-viz-box">
                <strong>30 Sep 1995</strong>
                <span>Last regular mission contact achieved with Pioneer 11.</span>
              </div>
              <div className="sci-viz-box highlight">
                <strong>24 Nov 1995</strong>
                <span>Final brief engineering data received before fading silent.</span>
              </div>
            </div>
          ) : (
            <div className="sci-viz-grid">
              <div className="sci-viz-box highlight">
                <strong>23 Jan 2003</strong>
                <span>Last weak signal detected (12.23 billion km, 11h 20m light travel time).</span>
              </div>
              <div className="sci-viz-box">
                <strong>4 Mar 2006</strong>
                <span>Final unsuccessful attempt to detect a signal.</span>
              </div>
            </div>
          )}
        </div>
      );

    case 'pioneer_h_museum':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Archival note about Pioneer H flight backup spacecraft at the Smithsonian National Air and Space Museum">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Museum Archive Record</span>
            <span className="sci-viz-subbadge">Smithsonian Air &amp; Space Museum</span>
          </div>
          <div className="sci-viz-status-box">
            <strong>Pioneer H &mdash; Flight-Ready Twin That Stayed Home</strong>
            <p className="sci-viz-note" style={{ marginTop: '0.25rem' }}>
              Built as the flight-spare twin for the Pioneer Jupiter/Saturn program, Pioneer H&apos;s proposed out-of-the-ecliptic mission was never funded to fly; the artifact resides on display at the Smithsonian Institution.
            </p>
          </div>
        </div>
      );

    case 'star_trajectories':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Schematic long-term deep-space trajectory directions toward Taurus and Aquila">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Schematic Trajectory</span>
            <div className="sci-viz-toggle" role="group" aria-label="Select Pioneer star trajectory">
              <button
                type="button"
                className={`sci-viz-toggle-btn ${starCraft === 'p10' ? 'active' : ''}`}
                onClick={() => setStarCraft('p10')}
              >
                Pioneer 10
              </button>
              <button
                type="button"
                className={`sci-viz-toggle-btn ${starCraft === 'p11' ? 'active' : ''}`}
                onClick={() => setStarCraft('p11')}
              >
                Pioneer 11
              </button>
            </div>
          </div>
          <div className="sci-viz-status-box">
            <strong>
              {starCraft === 'p10'
                ? 'Pioneer 10 → Constellation Taurus (Aldebaran)'
                : 'Pioneer 11 → Constellation Aquila (Lambda Aquilae)'}
            </strong>
            <p className="sci-viz-note" style={{ marginTop: '0.2rem' }}>
              {starCraft === 'p10'
                ? 'Projected direction over ~2 million years (not currently close to Aldebaran).'
                : 'Projected direction over ~4 million years toward Lambda Aquilae in Scutum/Aquila region.'}
            </p>
          </div>
        </div>
      );
  }
};
