import React, { useState } from 'react';

export type VikingVisualizationId =
  | 'viking_architecture'
  | 'viking_edl_sequence'
  | 'viking_impact_scale'
  | 'viking_gcms_diagram'
  | 'viking_biology_lab'
  | 'viking_comms_relay';

interface Props {
  id: VikingVisualizationId;
  reduceMotion?: boolean;
}

const EDL_STEPS = [
  '1. Entry',
  '2. Parachute',
  '3. Heat Shield',
  '4. Radar Scan',
  '5. Retrorockets',
  '6. Touchdown'
];

export const VikingVisualization: React.FC<Props> = ({
  id,
  reduceMotion = false
}) => {
  const [archPart, setArchPart] = useState<'orbiter' | 'relay' | 'lander'>('orbiter');
  const [edlStep, setEdlStep] = useState(0);
  const [gcmsStep, setGcmsStep] = useState(0);

  switch (id) {
    case 'viking_architecture':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Illustrative diagram of the four-part Viking mission: Orbiter, Relay link, and autonomous robotic Lander"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Illustrative diagram</span>
            <div className="sci-viz-toggle" role="group" aria-label="Architecture parts">
              {(['orbiter', 'relay', 'lander'] as const).map((part) => (
                <button
                  key={part}
                  type="button"
                  className={`sci-viz-toggle-btn ${archPart === part ? 'active' : ''}`}
                  onClick={() => setArchPart(part)}
                >
                  {part.charAt(0).toUpperCase() + part.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <svg viewBox="0 0 420 140" className="sci-viz-svg" aria-hidden="true">
            <rect x="34" y="20" width="122" height="50" rx="8" fill={archPart === 'orbiter' ? '#0c4a6e' : '#1e293b'} stroke="#38bdf8" strokeWidth="1.6" />
            <text x="95" y="42" textAnchor="middle" fill="#f8fafc" fontSize="10.5" fontWeight="700">2 Orbiters</text>
            <text x="95" y="57" textAnchor="middle" fill="#bae6fd" fontSize="9">Mapping &amp; site scouting</text>

            <path d="M160,52 Q210,70 256,88" fill="none" stroke={archPart === 'relay' ? '#fde047' : '#7dd3fc'} strokeWidth="2.2" strokeDasharray="4 4" />
            <text x="208" y="58" textAnchor="middle" fill="#fde68a" fontSize="9.5">UHF Relay Link</text>

            <rect x="256" y="72" width="132" height="52" rx="8" fill={archPart === 'lander' ? '#7c2d12' : '#1e293b'} stroke="#fb923c" strokeWidth="1.6" />
            <text x="322" y="95" textAnchor="middle" fill="#f8fafc" fontSize="10.5" fontWeight="700">2 Robotic Landers</text>
            <text x="322" y="110" textAnchor="middle" fill="#fed7aa" fontSize="9">Surface soil &amp; weather lab</text>
          </svg>
          <p className="sci-viz-caption">
            {archPart === 'orbiter' && 'Orbiter: Photographed ~97% of Mars from above to scout safe landing sites and relay data.'}
            {archPart === 'relay' && 'Relay: Landers beamed UHF telemetry up to Orbiters to forward across space to Earth.'}
            {archPart === 'lander' && 'Lander: Uncrewed hexagonal robotic laboratory (Viking 1 at Chryse, Viking 2 at Utopia).'}
          </p>
        </div>
      );

    case 'viking_edl_sequence':
      return (
        <div
          className={`sci-viz-card ${reduceMotion ? 'reduce-motion' : ''}`}
          role="figure"
          aria-label="Sequence illustration of Viking autonomous entry, descent, and landing"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Sequence illustration</span>
            <button
              type="button"
              className="sci-viz-toggle-btn active"
              onClick={() => setEdlStep((s) => (s + 1) % EDL_STEPS.length)}
            >
              Next Stage ({edlStep + 1}/{EDL_STEPS.length}) ⏭
            </button>
          </div>
          <div className="viking-step-strip">
            {EDL_STEPS.map((label, idx) => (
              <button
                key={label}
                type="button"
                className={`viking-step-pill ${idx === edlStep ? 'active' : idx < edlStep ? 'done' : ''}`}
                onClick={() => setEdlStep(idx)}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="sci-viz-caption">
            Autonomous EDL sequence illustration: Light delay prevents live Earth joystick control, so onboard systems executed all six steps automatically.
          </p>
        </div>
      );

    case 'viking_impact_scale':
      return (
        <div
          className="sci-viz-card"
          role="region"
          aria-label="Viking Mission Scale Statistic Card"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Mission Impact Stats</span>
            <span className="sci-viz-subbadge">VIKING 1 &amp; 2</span>
          </div>
          <div className="sci-viz-data-grid">
            <div className="sci-data-cell">
              <span className="sci-data-label">Lander Surface Return</span>
              <strong>~4,500 images</strong>
            </div>
            <div className="sci-data-cell">
              <span className="sci-data-label">Orbiter Survey</span>
              <strong>52,000+ images</strong>
            </div>
            <div className="sci-data-cell">
              <span className="sci-data-label">Planet Mapped</span>
              <strong>~97% of Mars</strong>
            </div>
          </div>
        </div>
      );

    case 'viking_gcms_diagram': {
      const stages = [
        '1. Sampler Arm collects pinch of Martian soil',
        '2. Heating Ovens bake sample (~150°, 300°, 500 °C)',
        '3. Gas Chromatograph column separates escaping vapors',
        '4. Mass Spectrometer weighs charged chemical fragments'
      ];
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Explanatory illustration of the Viking GCMS soil analysis flow"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Explanatory illustration</span>
            <button
              type="button"
              className="sci-viz-toggle-btn active"
              onClick={() => setGcmsStep((s) => (s + 1) % stages.length)}
            >
              Step {gcmsStep + 1}/{stages.length} ▶
            </button>
          </div>
          <div className="viking-step-strip">
            {['Sampler Arm', 'Ovens (150–500 °C)', 'Gas Chromatograph', 'Mass Spec'].map((st, i) => (
              <button
                key={st}
                type="button"
                className={`viking-step-pill ${i === gcmsStep ? 'active' : ''}`}
                onClick={() => setGcmsStep(i)}
              >
                {st}
              </button>
            ))}
          </div>
          <p className="sci-viz-caption">{stages[gcmsStep]}</p>
        </div>
      );
    }

    case 'viking_biology_lab':
      return (
        <div
          className="sci-viz-card"
          role="region"
          aria-label="Evidence vs proof breakdown of the Viking biology experiments"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Evidence, not proof</span>
            <span className="sci-viz-subbadge">UNRESOLVED DEBATE</span>
          </div>
          <div className="sci-viz-data-grid">
            <div className="sci-data-cell">
              <span className="sci-data-label">Observed Reaction</span>
              <strong>Labeled Release gave off radioactive gas after nutrient feed</strong>
            </div>
            <div className="sci-data-cell">
              <span className="sci-data-label">Scientific Status</span>
              <strong>GCMS found no organics; reactive soil chemistry may mimic life — no consensus</strong>
            </div>
          </div>
        </div>
      );

    case 'viking_comms_relay':
      return (
        <div
          className="sci-viz-card"
          role="figure"
          aria-label="Silent schematic of Viking ~20 W lander communications relaying via Orbiter to Earth"
        >
          <div className="sci-viz-header">
            <span className="sci-viz-badge">Explanatory schematic</span>
            <span className="sci-viz-subbadge">~20 W TRANSMITTER</span>
          </div>
          <svg viewBox="0 0 420 120" className="sci-viz-svg" aria-hidden="true">
            <rect x="20" y="38" width="106" height="48" rx="8" fill="#1e293b" stroke="#fb923c" strokeWidth="1.5" />
            <text x="73" y="59" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="700">Viking Lander</text>
            <text x="73" y="74" textAnchor="middle" fill="#fed7aa" fontSize="8.8">Tape + ~20 W dish</text>

            <line x1="128" y1="62" x2="162" y2="62" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />

            <rect x="164" y="38" width="104" height="48" rx="8" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="216" y="59" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="700">Viking Orbiter</text>
            <text x="216" y="74" textAnchor="middle" fill="#bae6fd" fontSize="8.8">UHF Relay overhead</text>

            <line x1="270" y1="62" x2="304" y2="62" stroke="#4ade80" strokeWidth="2" strokeDasharray="3 3" />

            <rect x="306" y="38" width="94" height="48" rx="8" fill="#0f293a" stroke="#4ade80" strokeWidth="1.5" />
            <text x="353" y="59" textAnchor="middle" fill="#86efac" fontSize="10" fontWeight="700">Earth (DSN)</text>
            <text x="353" y="74" textAnchor="middle" fill="#cbd5e1" fontSize="8.8">Minutes signal lag</text>
          </svg>
        </div>
      );
  }
};
