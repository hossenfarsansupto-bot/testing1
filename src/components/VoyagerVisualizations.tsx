import React, { useState } from 'react';

export type VoyagerVisualizationId =
  | 'grand_tour_diagram'
  | 'voyager_inspection_panel'
  | 'computers_69kb'
  | 'comms_latency_reprogram'
  | 'voyager_rtg_decay'
  | 'outer_moons_summary'
  | 'pale_blue_dot_locator'
  | 'heliopause_cutaway'
  | 'plasma_wave_waveform'
  | 'crisis_2023_timeline'
  | 'fds_repair_diagram'
  | 'thrusters_37yr'
  | 'one_light_day_milestone'
  | 'voyager_star_trajectories'
  | 'golden_record_cover'
  | 'golden_record_contents'
  | 'ann_druyan_recording';

interface Props {
  id: VoyagerVisualizationId;
  reduceMotion?: boolean;
}

const GRAND_TOUR_PLANETS = [
  { id: 'jupiter', name: 'Jupiter', info: 'Voyager 1 (Mar 1979) & Voyager 2 (Jul 1979): gravity assist slingshot toward Saturn.' },
  { id: 'saturn', name: 'Saturn', info: 'Voyager 1 (Nov 1980, bent north at Titan) & Voyager 2 (Aug 1981, aimed for Uranus).' },
  { id: 'uranus', name: 'Uranus', info: 'Voyager 2 (Jan 1986): only spacecraft ever to visit Uranus; Miranda 20 km cliffs.' },
  { id: 'neptune', name: 'Neptune', info: 'Voyager 2 (Aug 1989): winds up to 2,400 km/h & Triton active nitrogen geysers.' }
];

export const VoyagerVisualization: React.FC<Props> = ({ id, reduceMotion = false }) => {
  const [planetId, setPlanetId] = useState<string>('jupiter');
  const [tourKey, setTourKey] = useState<number>(0);
  const [partId, setPartId] = useState<string>('hga');
  const [commStage, setCommStage] = useState<string>('dsn');
  const [locateEarth, setLocateEarth] = useState<boolean>(false);
  const [showHeliopauseDef, setShowHeliopauseDef] = useState<boolean>(false);
  const [repairTab, setRepairTab] = useState<'before' | 'after'>('before');
  const [starCraft, setStarCraft] = useState<'v1' | 'v2'>('v1');
  const [recordCallout, setRecordCallout] = useState<'playback' | 'u238'>('playback');
  const [archiveTab, setArchiveTab] = useState<'images' | 'greetings' | 'sounds' | 'music'>('greetings');

  switch (id) {
    case 'grand_tour_diagram': {
      const active = GRAND_TOUR_PLANETS.find((p) => p.id === planetId) || GRAND_TOUR_PLANETS[0];
      return (
        <div className="sci-viz-card" role="figure" aria-label="Conceptual trajectory diagram of Voyager's Grand Tour across Jupiter, Saturn, Uranus, and Neptune">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Conceptual Trajectory (175&ndash;176 yr Alignment)</span>
            <button
              type="button"
              className="sci-viz-toggle-btn"
              onClick={() => setTourKey((k) => k + 1)}
            >
              ↺ Replay Tour
            </button>
          </div>
          <svg key={tourKey} viewBox="0 0 420 96" className="sci-viz-svg" aria-hidden="true">
            <circle cx="28" cy="54" r="9" fill="#38bdf8" />
            <text x="28" y="76" textAnchor="middle" fill="#bae6fd" fontSize="8.5">Earth</text>
            <path
              d="M 36 54 Q 95 28 130 42 T 218 52 T 308 38 T 386 50"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.2"
              strokeDasharray="5 4"
            >
              {!reduceMotion && (
                <animate
                  attributeName="stroke-dashoffset"
                  from="60"
                  to="0"
                  dur="2.2s"
                  repeatCount="indefinite"
                />
              )}
            </path>
            {[
              { x: 130, y: 42, r: 13, c: '#d97706', label: 'Jupiter' },
              { x: 218, y: 52, r: 11, c: '#eab308', label: 'Saturn' },
              { x: 308, y: 38, r: 9, c: '#22d3ee', label: 'Uranus' },
              { x: 386, y: 50, r: 9, c: '#3b82f6', label: 'Neptune' }
            ].map((pl) => (
              <g key={pl.label}>
                <circle cx={pl.x} cy={pl.y} r={pl.r} fill={pl.c} />
                <text x={pl.x} y={pl.y + pl.r + 13} textAnchor="middle" fill="#e2e8f0" fontSize="8.5" fontWeight="700">
                  {pl.label}
                </text>
              </g>
            ))}
          </svg>
          <div className="sci-viz-toggle" role="group" aria-label="Select Grand Tour planet">
            {GRAND_TOUR_PLANETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`sci-viz-toggle-btn ${planetId === p.id ? 'active' : ''}`}
                onClick={() => setPlanetId(p.id)}
              >
                {p.name}
              </button>
            ))}
          </div>
          <p className="sci-viz-note">{active.info} (Conceptual schematic, not live navigation.)</p>
        </div>
      );
    }

    case 'voyager_inspection_panel': {
      const parts: Record<string, { label: string; desc: string }> = {
        hga: {
          label: 'High-Gain Antenna Dish (3.7 m / 3.66 m)',
          desc: 'Stays stabilized continuously toward Earth via Sun sensors, Canopus star tracker, gyroscopes, and attitude thrusters.'
        },
        scan: {
          label: 'Steerable Scan Platform',
          desc: 'Rotates independently so narrow/wide cameras and spectrometers can target moons while the dish never leaves Earth lock.'
        },
        bus: {
          label: '10-Sided Aluminum Bus (~815 kg at launch)',
          desc: 'Houses flight electronics, tape recorder, and carries the gold-plated Voyager Golden Record on its exterior.'
        },
        rtg: {
          label: 'Three Pu-238 RTG Generators on Boom',
          desc: 'Mounted far out on an extended truss (~470 W at launch) alongside a 13-metre magnetometer boom on the opposite side.'
        }
      };
      const active = parts[partId] || parts.hga;
      return (
        <div className="sci-viz-card" role="figure" aria-label="Voyager spacecraft hardware inspection panel">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Voyager Hardware Callouts</span>
            <span className="sci-viz-subbadge">V2: Aug 20, 1977 &bull; V1: Sep 5, 1977</span>
          </div>
          <div className="sci-viz-toggle" role="group" aria-label="Inspect Voyager systems">
            {Object.entries(parts).map(([k, v]) => (
              <button
                key={k}
                type="button"
                className={`sci-viz-toggle-btn ${partId === k ? 'active' : ''}`}
                onClick={() => setPartId(k)}
              >
                {v.label.split(' (')[0]}
              </button>
            ))}
          </div>
          <div className="sci-viz-status-box">
            <strong>{active.label}</strong>
            <p className="sci-viz-note" style={{ marginTop: '0.2rem' }}>{active.desc}</p>
          </div>
        </div>
      );
    }

    case 'computers_69kb':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Explanatory schematic comparing Voyager's ~69 kilobyte total memory to modern files">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Explanatory Schematic (1970s Computing)</span>
            <span className="sci-viz-subbadge">~69 KB Total Memory</span>
          </div>
          <div className="sci-viz-grid">
            <div className="sci-viz-box highlight">
              <strong>~69 KB Onboard Memory</strong>
              <span>Smaller than a single compressed smartphone photo today.</span>
            </div>
            <div className="sci-viz-box">
              <strong>8-Track Tape Recorder</strong>
              <span>~67 MB digital tape buffer for scientific snapshots before radio downlink.</span>
            </div>
          </div>
        </div>
      );

    case 'comms_latency_reprogram': {
      const stages: Record<string, string> = {
        dsn: 'Deep Space Network giant 70 m / 34 m antennas transmit uplink commands from Earth.',
        link: 'Radio waves crawl across ~25.9 billion km at light speed (~24 hours each way!).',
        dish: 'Voyager’s 3.66 m dish captures billion-billionths of a watt and routes bits inside.',
        cpu: 'Reprogrammable 1970s computers accept patched machine code beamed from JPL.'
      };
      return (
        <div className="sci-viz-card" role="figure" aria-label="Conceptual signal path from Earth Deep Space Network to Voyager onboard computers">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Remote Reprogramming Path</span>
            <span className="sci-viz-subbadge">~24h One-Way Latency</span>
          </div>
          <div className="sci-viz-toggle" role="group" aria-label="Select signal stage">
            {[
              ['dsn', 'Earth / DSN'],
              ['link', 'Radio Link'],
              ['dish', 'Voyager Dish'],
              ['cpu', 'Flight Computer']
            ].map(([k, lbl]) => (
              <button
                key={k}
                type="button"
                className={`sci-viz-toggle-btn ${commStage === k ? 'active' : ''}`}
                onClick={() => setCommStage(k)}
              >
                {lbl}
              </button>
            ))}
          </div>
          <p className="sci-viz-note">{stages[commStage]}</p>
        </div>
      );
    }

    case 'voyager_rtg_decay':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Approximate Pu-238 RTG electrical output decline over mission lifetime">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">3&times; Pu-238 RTG Power Decay</span>
            <span className="sci-viz-subbadge">Approximate Values</span>
          </div>
          <div className="sci-viz-grid">
            <div className="sci-viz-box">
              <strong>~470 W at Launch (1977)</strong>
              <span>Powered cameras, heaters, scan platform, and 6+ science suites simultaneously.</span>
            </div>
            <div className="sci-viz-box highlight">
              <strong>~Half Launch Power Today</strong>
              <span>Drops ~4 W/year (~225 We noted by NASA as of 2023); engineers shut heaters off down below &minus;79 &deg;C.</span>
            </div>
          </div>
        </div>
      );

    case 'outer_moons_summary':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Outer Solar System moon and planet surprises uncovered by Voyager 1 and 2">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Outer Moons &amp; Worlds Discovered Active</span>
            <span className="sci-viz-subbadge">Voyager 1 &amp; 2</span>
          </div>
          <div className="sci-viz-grid">
            <div className="sci-viz-box">
              <strong>Io (Voyager 1)</strong>
              <span>Tidal flexing (~100 m) fuels active volcanic plumes 300 km high.</span>
            </div>
            <div className="sci-viz-box">
              <strong>Europa (Voyager 1 &amp; 2)</strong>
              <span>Young cracked water-ice crust hinting at a subsurface ocean.</span>
            </div>
            <div className="sci-viz-box">
              <strong>Miranda (Voyager 2)</strong>
              <span>Uranus&apos;s fractured moon with ~20 km Verona Rupes cliffs.</span>
            </div>
            <div className="sci-viz-box">
              <strong>Triton &amp; Neptune (V2)</strong>
              <span>Active nitrogen geysers on Triton; ~2,400 km/h supersonic winds on Neptune.</span>
            </div>
          </div>
        </div>
      );

    case 'pale_blue_dot_locator':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Archival guide for Voyager 1's February 14, 1990 Pale Blue Dot photograph">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Original 1990 Frame Overlay</span>
            <button
              type="button"
              className={`sci-viz-toggle-btn ${locateEarth ? 'active' : ''}`}
              onClick={() => setLocateEarth((s) => !s)}
            >
              {locateEarth ? 'Hide Locator Note' : '🔍 Locate Earth'}
            </button>
          </div>
          <p className="sci-viz-note">
            {locateEarth
              ? 'Look along the pale reddish scattered sunlight beam right of center — Earth appears as a sub-pixel bluish speck (< 1 pixel) inside that sunbeam (~6 billion km away).'
              : 'Original 1990 Voyager 1 pixels preserved intact above (never substituted with synthetic dots or altered pixels). Cameras powered down shortly after to conserve energy.'}
          </p>
        </div>
      );

    case 'heliopause_cutaway':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Conceptual cutaway diagram of the heliosphere, heliopause, and interstellar space">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Conceptual Diagram (Heliosphere Boundary)</span>
            <button
              type="button"
              className="sci-viz-toggle-btn"
              onClick={() => setShowHeliopauseDef((s) => !s)}
            >
              {showHeliopauseDef ? 'Hide Definition' : 'Tap Heliopause'}
            </button>
          </div>
          <svg viewBox="0 0 420 96" className="sci-viz-svg" aria-hidden="true">
            <ellipse cx="155" cy="48" rx="125" ry="38" fill="rgba(56,189,248,0.14)" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="5 3" />
            <circle cx="95" cy="48" r="10" fill="#facc15" />
            <text x="95" y="70" textAnchor="middle" fill="#fef08a" fontSize="8.5">Sun</text>
            <text x="190" y="34" textAnchor="middle" fill="#bae6fd" fontSize="8.5">Heliosheath</text>
            <text x="278" y="22" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontWeight="700">Heliopause</text>
            <line x1="95" y1="48" x2="355" y2="28" stroke="#4ade80" strokeWidth="1.8" />
            <text x="360" y="31" fill="#86efac" fontSize="8.5" fontWeight="700">V1 (2012)</text>
            <line x1="95" y1="48" x2="345" y2="70" stroke="#60a5fa" strokeWidth="1.8" />
            <text x="350" y="73" fill="#bfdbfe" fontSize="8.5" fontWeight="700">V2 (2018)</text>
          </svg>
          {showHeliopauseDef && (
            <p className="sci-viz-note">
              <strong>Heliopause:</strong> Outer boundary where outward solar wind pressure balances tenuous interstellar gas (~121 AU for Voyager 1).
            </p>
          )}
        </div>
      );

    case 'plasma_wave_waveform':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Illustrative representation comparing plasma wave oscillation frequency inside vs outside the heliosphere">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Illustrative Representation (Silent)</span>
            <span className="sci-viz-subbadge">Indirect Plasma-Wave Evidence</span>
          </div>
          <svg viewBox="0 0 420 76" className="sci-viz-svg" aria-hidden="true">
            <path d="M 12 38 Q 36 18 60 38 T 108 38 T 156 38 T 200 38" fill="none" stroke="#64748b" strokeWidth="2" />
            <line x1="205" y1="10" x2="205" y2="66" stroke="#fbbf24" strokeDasharray="3 3" />
            <path d="M 210 38 Q 218 14 226 38 T 242 38 T 258 38 T 274 38 T 290 38 T 306 38 T 322 38 T 338 38 T 354 38 T 370 38 T 386 38 T 402 38" fill="none" stroke="#38bdf8" strokeWidth="2.2" />
            <text x="100" y="64" textAnchor="middle" fill="#cbd5e1" fontSize="8.5">Lower-density solar wind</text>
            <text x="308" y="64" textAnchor="middle" fill="#7dd3fc" fontSize="8.5">~40&times; denser interstellar plasma pitch jump</text>
          </svg>
        </div>
      );

    case 'crisis_2023_timeline':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Voyager 1 2023-2024 Flight Data Subsystem recovery timeline">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Voyager 1 Recovery Chronology</span>
            <span className="sci-viz-subbadge">~45h Round-Trip Light Time</span>
          </div>
          <div className="sci-viz-grid">
            <div className="sci-viz-box">
              <strong>14 Nov 2023</strong>
              <span>FDS began sending unintelligible repeating bit patterns.</span>
            </div>
            <div className="sci-viz-box">
              <strong>Mar 2024</strong>
              <span>JPL engineers isolated corrupted memory block in FDS.</span>
            </div>
            <div className="sci-viz-box highlight">
              <strong>Apr&ndash;May 2024</strong>
              <span>Patched code redistributed; engineering &amp; science telemetry restored!</span>
            </div>
          </div>
        </div>
      );

    case 'fds_repair_diagram':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Simplified explanatory block diagram of Voyager 1 memory relocation repair">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Simplified Explanatory Diagram</span>
            <div className="sci-viz-toggle" role="group" aria-label="FDS repair before vs after">
              <button
                type="button"
                className={`sci-viz-toggle-btn ${repairTab === 'before' ? 'active' : ''}`}
                onClick={() => setRepairTab('before')}
              >
                Before Fix
              </button>
              <button
                type="button"
                className={`sci-viz-toggle-btn ${repairTab === 'after' ? 'active' : ''}`}
                onClick={() => setRepairTab('after')}
              >
                After Fix (Apr/May 2024)
              </button>
            </div>
          </div>
          <div className="sci-viz-status-box">
            <strong>
              {repairTab === 'before'
                ? 'Corrupted FDS Memory Chip Blocked Clean Telemetry'
                : 'Code Split & Relocated Across Healthy FDS Memory Blocks'}
            </strong>
            <p className="sci-viz-note" style={{ marginTop: '0.2rem' }}>
              {repairTab === 'before'
                ? 'Because the chip could not be repaired physically across 24 billion km, the packet builder kept outputting broken repeating ones and zeros.'
                : 'Engineers split the affected software into smaller segments, updated memory pointers by hand, and uplinked the patch via Deep Space Network.'}
            </p>
          </div>
        </div>
      );

    case 'thrusters_37yr':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Voyager 1 2017 test of four backup trajectory-correction thrusters unused since 1980">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Backup Trajectory-Correction Thrusters</span>
            <span className="sci-viz-subbadge">28 Nov 2017 &bull; 37 Years Dormant</span>
          </div>
          <p className="sci-viz-note">
            Primary attitude-control thrusters slowly degraded with hydrazine residue; engineers fired four trajectory-correction (TCM) backup thrusters dormant since 1980 in gentle millisecond attitude pulses to keep Voyager 1&apos;s dish aimed at Earth.
          </p>
        </div>
      );

    case 'one_light_day_milestone':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Voyager 1 one-light-day distance milestone status card">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Distance Milestone Snapshot</span>
            <span className="sci-viz-subbadge">Expected: Nov 18, 2026</span>
          </div>
          <div className="sci-viz-grid">
            <div className="sci-viz-box highlight">
              <strong>1 Light-Day (&gt;25.9 Billion km)</strong>
              <span>A distance measure: radio signals take a full 24 hours one-way to traverse the gap between Earth and Voyager 1.</span>
            </div>
            <div className="sci-viz-box">
              <strong>~22 W Radio Transmitter</strong>
              <span>Roughly the wattage of a small refrigerator bulb; fading power will quiet instruments in the 2030s.</span>
            </div>
          </div>
        </div>
      );

    case 'voyager_star_trajectories':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Projected interstellar trajectory directions for Voyager 1 and Voyager 2">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Long-Range Projection (Not Navigable Chart)</span>
            <div className="sci-viz-toggle" role="group" aria-label="Select Voyager trajectory">
              <button
                type="button"
                className={`sci-viz-toggle-btn ${starCraft === 'v1' ? 'active' : ''}`}
                onClick={() => setStarCraft('v1')}
              >
                Voyager 1
              </button>
              <button
                type="button"
                className={`sci-viz-toggle-btn ${starCraft === 'v2' ? 'active' : ''}`}
                onClick={() => setStarCraft('v2')}
              >
                Voyager 2
              </button>
            </div>
          </div>
          <div className="sci-viz-status-box">
            <strong>
              {starCraft === 'v1'
                ? 'Voyager 1 → Oort Cloud (~300 yrs) → Gliese 445 (~40,000 yrs)'
                : 'Voyager 2 → Southern Interstellar Track → Ross 248 (~40,000 yrs)'}
            </strong>
            <p className="sci-viz-note" style={{ marginTop: '0.2rem' }}>
              {starCraft === 'v1'
                ? 'Estimated to reach the inner edge of the Oort Cloud in ~300 years (taking ~30,000 years to cross) and pass ~1.6 light-years from Gliese 445.'
                : 'Headed on a southward path out of the Solar System toward a distant encounter near the red dwarf star Ross 248.'}
            </p>
          </div>
        </div>
      );

    case 'golden_record_cover':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Golden Record cover encoded diagram callouts">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Golden Record Protective Cover</span>
            <div className="sci-viz-toggle" role="group" aria-label="Inspect cover encoding">
              <button
                type="button"
                className={`sci-viz-toggle-btn ${recordCallout === 'playback' ? 'active' : ''}`}
                onClick={() => setRecordCallout('playback')}
              >
                Playback Diagram
              </button>
              <button
                type="button"
                className={`sci-viz-toggle-btn ${recordCallout === 'u238' ? 'active' : ''}`}
                onClick={() => setRecordCallout('u238')}
              >
                U-238 Cosmic Clock
              </button>
            </div>
          </div>
          <p className="sci-viz-note">
            {recordCallout === 'playback'
              ? 'Top-left stylized needle & speed diagram (binary rotations/time units) shows extraterrestrial finders how to mount the included cartridge and play the copper-gold disc (30 cm).'
              : 'Ultra-pure Uranium-238 spot plated onto the cover decays slowly with a ~4.47 billion-year half-life, letting a future civilization date how long the record has drifted.'}
          </p>
        </div>
      );

    case 'golden_record_contents':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Text archive index summarizing Golden Record images, greetings, Earth sounds, and music">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Golden Record Archive Index</span>
            <div className="sci-viz-toggle" role="group" aria-label="Golden Record category tabs">
              {[
                ['greetings', '55 Greetings'],
                ['sounds', 'Earth Sounds'],
                ['music', '90 Min Music'],
                ['images', '115 Images']
              ].map(([k, lbl]) => (
                <button
                  key={k}
                  type="button"
                  className={`sci-viz-toggle-btn ${archiveTab === k ? 'active' : ''}`}
                  onClick={() => setArchiveTab(k as typeof archiveTab)}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>
          <p className="sci-viz-note">
            {archiveTab === 'greetings' &&
              'Spoken greetings in 55 Earth languages — including Bengali (“Nomoshkar! Bissho thakuk shanti-moy!”), Mandarin, Arabic, Hindi, Spanish, English, and more.'}
            {archiveTab === 'sounds' &&
              '12-minute audio essay of Earth: surf, wind, thunder, whales, birds, laughter, Morse code, footsteps, and a mother’s kiss.'}
            {archiveTab === 'music' &&
              '90 minutes spanning Bach, Beethoven, Indian Raga Bhairavi, Javanese Gamelan, Navajo Night Chant, Senegal percussion, and Chuck Berry’s “Johnny B. Goode”.'}
            {archiveTab === 'images' &&
              'Research index for the 115 encoded photographs/diagrams (not mirrored inline due to NASA gallery copyright restrictions; view via NASA Golden Record link).'}
          </p>
        </div>
      );

    case 'ann_druyan_recording':
      return (
        <div className="sci-viz-card" role="figure" aria-label="Silent illustrative waveform honoring Ann Druyan's June 3, 1977 heartbeat and brainwave recording">
          <div className="sci-viz-header">
            <span className="sci-viz-badge">June 3, 1977 &bull; Quiet Memorial (Silent)</span>
            <span className="sci-viz-subbadge">Illustrative Motif Only</span>
          </div>
          <svg viewBox="0 0 420 56" className="sci-viz-svg" aria-hidden="true">
            <path
              d="M 10 28 L 70 28 L 82 14 L 92 44 L 104 28 L 170 28 L 182 16 L 192 42 L 204 28 L 280 28 L 292 14 L 302 44 L 314 28 L 410 28"
              fill="none"
              stroke="#fb7185"
              strokeWidth="2"
            />
          </svg>
          <p className="sci-viz-note">
            1 hour of compressed thoughts &amp; heartbeat (~1 minute on the Golden Record), expected to stay readable in deep space for 1+ billion years.
          </p>
        </div>
      );
  }
};
