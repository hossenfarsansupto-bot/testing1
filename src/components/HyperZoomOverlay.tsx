import React from 'react';

interface HyperZoomOverlayProps {
  active: boolean;
  label?: string;
}

/**
 * Full-screen 2D cartoon warp/hyper-zoom speed lines overlay
 * played briefly when launching into Moon, Mars, or Deep Space.
 */
export const HyperZoomOverlay: React.FC<HyperZoomOverlayProps> = ({
  active,
  label
}) => {
  if (!active) return null;

  return (
    <div className="hyper-zoom-overlay" aria-hidden="true">
      <svg
        className="hyper-zoom-svg"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g strokeLinecap="round">
          <line x1="600" y1="350" x2="60" y2="40" stroke="#00e5ff" strokeWidth="5" className="hz-streak hz-s1" />
          <line x1="600" y1="350" x2="240" y2="10" stroke="#ffffff" strokeWidth="4" className="hz-streak hz-s2" />
          <line x1="600" y1="350" x2="480" y2="0" stroke="#a6f7eb" strokeWidth="3.5" className="hz-streak hz-s3" />
          <line x1="600" y1="350" x2="740" y2="0" stroke="#ffffff" strokeWidth="4" className="hz-streak hz-s1" />
          <line x1="600" y1="350" x2="980" y2="15" stroke="#00e5ff" strokeWidth="5" className="hz-streak hz-s2" />
          <line x1="600" y1="350" x2="1170" y2="60" stroke="#ffffff" strokeWidth="4.5" className="hz-streak hz-s3" />
          <line x1="600" y1="350" x2="1200" y2="260" stroke="#a6f7eb" strokeWidth="4" className="hz-streak hz-s1" />
          <line x1="600" y1="350" x2="1200" y2="480" stroke="#ffffff" strokeWidth="5" className="hz-streak hz-s2" />
          <line x1="600" y1="350" x2="1120" y2="680" stroke="#00e5ff" strokeWidth="5.5" className="hz-streak hz-s3" />
          <line x1="600" y1="350" x2="860" y2="700" stroke="#ffffff" strokeWidth="4" className="hz-streak hz-s1" />
          <line x1="600" y1="350" x2="540" y2="700" stroke="#a6f7eb" strokeWidth="3.5" className="hz-streak hz-s2" />
          <line x1="600" y1="350" x2="260" y2="700" stroke="#ffffff" strokeWidth="4.5" className="hz-streak hz-s3" />
          <line x1="600" y1="350" x2="30" y2="630" stroke="#00e5ff" strokeWidth="5" className="hz-streak hz-s1" />
          <line x1="600" y1="350" x2="0" y2="420" stroke="#ffffff" strokeWidth="4" className="hz-streak hz-s2" />
          <line x1="600" y1="350" x2="0" y2="210" stroke="#a6f7eb" strokeWidth="4" className="hz-streak hz-s3" />
        </g>
      </svg>
      {label && <div className="hyper-zoom-banner">HYPER-ZOOM ▶ {label.toUpperCase()}</div>}
    </div>
  );
};
