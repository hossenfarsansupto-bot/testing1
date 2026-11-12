import React from 'react';

interface DisplayMiniAnimProps {
  cardId: string;
  isUnlocked: boolean;
}

const BlueprintGrid: React.FC = () => (
  <g stroke="rgba(16, 86, 82, 0.14)" strokeWidth="1">
    <line x1="0" y1="20" x2="140" y2="20" />
    <line x1="0" y1="42" x2="140" y2="42" />
    <line x1="35" y1="0" x2="35" y2="62" />
    <line x1="70" y1="0" x2="70" y2="62" />
    <line x1="105" y1="0" x2="105" y2="62" />
  </g>
);

const MiniSvgFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    className="display-mini-svg"
    viewBox="0 0 140 62"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <BlueprintGrid />
    {children}
  </svg>
);

/**
 * 2D cartoon / blueprint displays rendered inside the bluish-greenish-white
 * cockpit / rover Astro-Pad monitor screens (Main Console + Moon/Mars/Deep Space cards).
 */
export const DisplayMiniAnim: React.FC<DisplayMiniAnimProps> = ({
  cardId,
  isUnlocked
}) => {
  if (cardId === 'main_moon') {
    return (
      <MiniSvgFrame>
        <ellipse
          cx="70"
          cy="31"
          rx="52"
          ry="16"
          fill="none"
          stroke="#1b5e5a"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          opacity="0.55"
        />
        <g className="anim-2d-float">
          <circle cx="70" cy="31" r="19" fill="#9ea8b8" stroke="#0c1017" strokeWidth="2.5" />
          <path d="M78,14 A18,18 0 0,1 78,48 A14,18 0 0,0 78,14 Z" fill="#778294" />
          <circle cx="62" cy="24" r="4.5" fill="#6d788a" stroke="#0c1017" strokeWidth="1.4" />
          <circle cx="77" cy="34" r="5.2" fill="#6d788a" stroke="#0c1017" strokeWidth="1.4" />
          <circle cx="65" cy="39" r="3" fill="#6d788a" stroke="#0c1017" strokeWidth="1.2" />
          <line
            x1="70"
            y1="14"
            x2="102"
            y2="4"
            stroke="#00a854"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="anim-2d-pulse"
          />
          <circle cx="70" cy="14" r="2.8" fill="#00c853" stroke="#0c1017" strokeWidth="1.2" />
        </g>
        <g className="anim-2d-orbit-moon">
          <rect x="18" y="25" width="12" height="8" rx="3" fill="#ffca28" stroke="#0c1017" strokeWidth="1.8" />
          <rect x="23" y="27" width="5" height="3.5" rx="1" fill="#80deea" stroke="#0c1017" strokeWidth="1" />
          <line x1="14" y1="29" x2="18" y2="29" stroke="#ff5722" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      </MiniSvgFrame>
    );
  }

  if (cardId === 'main_mars') {
    return (
      <MiniSvgFrame>
        <g className="anim-2d-float-alt">
          <circle cx="46" cy="31" r="19" fill="#e0603c" stroke="#0c1017" strokeWidth="2.5" />
          <path d="M54,14 A18,18 0 0,1 54,48 A14,18 0 0,0 54,14 Z" fill="#b54022" />
          <path d="M36,15 Q46,19 56,15 Q51,12 46,12 Q41,12 36,15 Z" fill="#ffffff" stroke="#0c1017" strokeWidth="1.2" />
          <path d="M30,30 Q46,35 61,27" fill="none" stroke="#8f2d14" strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="40" cy="39" r="3.2" fill="#a8391d" />
        </g>
        <line x1="76" y1="50" x2="128" y2="50" stroke="#0c1017" strokeWidth="2" strokeLinecap="round" />
        <g className="anim-2d-rover">
          <rect x="86" y="34" width="22" height="10" rx="2.5" fill="#ffb300" stroke="#0c1017" strokeWidth="2" />
          <line x1="102" y1="34" x2="104" y2="24" stroke="#0c1017" strokeWidth="2.2" />
          <rect x="99" y="19" width="10" height="6" rx="1.5" fill="#eceff1" stroke="#0c1017" strokeWidth="1.6" />
          <circle cx="105" cy="22" r="1.8" fill="#00b0ff" className="anim-2d-pulse" />
          <circle cx="90" cy="46" r="4" fill="#37474f" stroke="#0c1017" strokeWidth="1.8" />
          <circle cx="97" cy="46" r="4" fill="#37474f" stroke="#0c1017" strokeWidth="1.8" />
          <circle cx="104" cy="46" r="4" fill="#37474f" stroke="#0c1017" strokeWidth="1.8" />
        </g>
      </MiniSvgFrame>
    );
  }

  if (cardId === 'moon_retro') {
    // Lunar Laser Ranging Retroreflector Array
    return (
      <MiniSvgFrame>
        <line x1="18" y1="52" x2="122" y2="52" stroke="#0c1017" strokeWidth="2" strokeLinecap="round" />
        <path d="M52,52 L56,40 L84,40 L88,52 Z" fill="#9ea8b8" stroke="#0c1017" strokeWidth="2" />
        <rect x="44" y="24" width="52" height="16" rx="2.5" fill="#cfd8dc" stroke="#0c1017" strokeWidth="2.2" />
        <g fill="#4fc3f7" stroke="#0c1017" strokeWidth="1.3">
          <circle cx="54" cy="32" r="3.4" />
          <circle cx="65" cy="32" r="3.4" />
          <circle cx="76" cy="32" r="3.4" />
          <circle cx="87" cy="32" r="3.4" />
        </g>
        <line x1="18" y1="6" x2="65" y2="28" stroke="#00e676" strokeWidth="2.2" strokeLinecap="round" className="anim-2d-pulse" />
        <line x1="65" y1="28" x2="122" y2="6" stroke="#00b0ff" strokeWidth="2.2" strokeDasharray="4 3" strokeLinecap="round" className="anim-2d-pulse" />
      </MiniSvgFrame>
    );
  }

  if (cardId === 'moon_alsep') {
    // Apollo Lunar Surface Experiments Package (Central Station + Antenna + RTG)
    return (
      <MiniSvgFrame>
        <line x1="18" y1="52" x2="122" y2="52" stroke="#0c1017" strokeWidth="2" strokeLinecap="round" />
        {/* RTG Fin Unit */}
        <rect x="30" y="34" width="16" height="18" rx="2" fill="#37474f" stroke="#0c1017" strokeWidth="2" />
        <line x1="46" y1="45" x2="58" y2="45" stroke="#0c1017" strokeWidth="2" />
        {/* Central Station Box */}
        <rect x="58" y="30" width="26" height="22" rx="2.5" fill="#eceff1" stroke="#0c1017" strokeWidth="2.2" />
        <rect x="63" y="35" width="16" height="8" rx="1" fill="#ffb300" stroke="#0c1017" strokeWidth="1.4" />
        {/* Mast & Antenna Dish */}
        <line x1="71" y1="30" x2="71" y2="14" stroke="#0c1017" strokeWidth="2.2" />
        <ellipse cx="71" cy="13" rx="10" ry="3.5" fill="#80deea" stroke="#0c1017" strokeWidth="1.8" />
        {/* Seismometer */}
        <line x1="84" y1="46" x2="96" y2="46" stroke="#0c1017" strokeWidth="2" />
        <circle cx="104" cy="44" r="8" fill="#ffd54f" stroke="#0c1017" strokeWidth="2" />
        <path d="M84,12 A10,10 0 0,1 96,20" fill="none" stroke="#00897b" strokeWidth="2" className="anim-2d-wave-1" />
      </MiniSvgFrame>
    );
  }

  if (cardId === 'mars_viking') {
    // Viking Mars Lander with Dish & Leg Pads
    return (
      <MiniSvgFrame>
        <line x1="18" y1="52" x2="122" y2="52" stroke="#0c1017" strokeWidth="2" strokeLinecap="round" />
        <line x1="52" y1="40" x2="42" y2="52" stroke="#0c1017" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="88" y1="40" x2="98" y2="52" stroke="#0c1017" strokeWidth="2.4" strokeLinecap="round" />
        <rect x="46" y="28" width="48" height="13" rx="3" fill="#cfd8dc" stroke="#0c1017" strokeWidth="2.2" />
        <rect x="55" y="31" width="16" height="7" fill="#ff7043" stroke="#0c1017" strokeWidth="1.4" />
        <line x1="78" y1="28" x2="78" y2="15" stroke="#0c1017" strokeWidth="2.2" />
        <ellipse cx="78" cy="13" rx="13" ry="4.5" fill="#fff8e1" stroke="#0c1017" strokeWidth="2" />
        <circle cx="54" cy="22" r="3.2" fill="#ffd54f" stroke="#0c1017" strokeWidth="1.6" />
        <path d="M95,12 A12,12 0 0,1 106,22" fill="none" stroke="#d84315" strokeWidth="2" className="anim-2d-wave-1" />
      </MiniSvgFrame>
    );
  }

  if (cardId === 'mars_sojourner') {
    // 6-wheeled Sojourner Rover
    return (
      <MiniSvgFrame>
        <line x1="16" y1="50" x2="124" y2="50" stroke="#0c1017" strokeWidth="2" strokeLinecap="round" />
        <g className="anim-2d-rover">
          <rect x="46" y="29" width="46" height="11" rx="2.5" fill="#1e88e5" stroke="#0c1017" strokeWidth="2.2" />
          <rect x="50" y="24" width="38" height="6" rx="1.5" fill="#263238" stroke="#0c1017" strokeWidth="1.8" />
          <line x1="56" y1="26" x2="84" y2="26" stroke="#80deea" strokeWidth="1.5" />
          <circle cx="53" cy="45" r="4.8" fill="#546e7a" stroke="#0c1017" strokeWidth="2" />
          <circle cx="69" cy="45" r="4.8" fill="#546e7a" stroke="#0c1017" strokeWidth="2" />
          <circle cx="85" cy="45" r="4.8" fill="#546e7a" stroke="#0c1017" strokeWidth="2" />
        </g>
        <path d="M104,48 L112,38 L122,42 L124,50 Z" fill="#b74e2b" stroke="#0c1017" strokeWidth="1.8" />
      </MiniSvgFrame>
    );
  }

  if (cardId === 'mars_phoenix') {
    // Phoenix Mars Lander with Twin Circular Solar Wings & Digging Arm
    return (
      <MiniSvgFrame>
        <line x1="16" y1="52" x2="124" y2="52" stroke="#0c1017" strokeWidth="2" strokeLinecap="round" />
        {/* Circular solar wings */}
        <ellipse cx="42" cy="34" rx="14" ry="4.5" fill="#0277bd" stroke="#0c1017" strokeWidth="2" />
        <ellipse cx="98" cy="34" rx="14" ry="4.5" fill="#0277bd" stroke="#0c1017" strokeWidth="2" />
        {/* Lander deck & legs */}
        <line x1="60" y1="40" x2="52" y2="52" stroke="#0c1017" strokeWidth="2.2" />
        <line x1="80" y1="40" x2="88" y2="52" stroke="#0c1017" strokeWidth="2.2" />
        <rect x="56" y="30" width="28" height="11" rx="2.5" fill="#ffd54f" stroke="#0c1017" strokeWidth="2.2" />
        {/* Robotic scoop arm */}
        <path d="M56,37 L38,44 L30,51" fill="none" stroke="#0c1017" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="74" y1="30" x2="74" y2="16" stroke="#0c1017" strokeWidth="2.2" />
        <circle cx="74" cy="14" r="3" fill="#00e5ff" stroke="#0c1017" strokeWidth="1.5" className="anim-2d-pulse" />
      </MiniSvgFrame>
    );
  }

  if (cardId === 'ds_ds1' || cardId === 'ds_new_horizons') {
    // Ion-propulsion / Kuiper Probe
    return (
      <MiniSvgFrame>
        <circle cx="22" cy="16" r="2" fill="#0c1017" opacity="0.45" className="anim-2d-pulse" />
        <circle cx="116" cy="18" r="2" fill="#0c1017" opacity="0.45" className="anim-2d-pulse" />
        <g className="anim-2d-float-alt">
          <rect x="34" y="23" width="22" height="16" rx="2" fill="#29b6f6" stroke="#0c1017" strokeWidth="1.8" />
          <rect x="84" y="23" width="22" height="16" rx="2" fill="#29b6f6" stroke="#0c1017" strokeWidth="1.8" />
          <polygon points="58,20 82,20 77,42 63,42" fill="#ffd54f" stroke="#0c1017" strokeWidth="2.2" />
          <ellipse cx="70" cy="16" rx="10" ry="4" fill="#eceff1" stroke="#0c1017" strokeWidth="2" />
          <polygon points="65,42 75,42 70,56" fill="#00e5ff" opacity="0.85" className="anim-2d-pulse" />
        </g>
      </MiniSvgFrame>
    );
  }

  // Deep Space / Pioneer / Voyager Probe
  return (
    <MiniSvgFrame>
      <circle cx="22" cy="14" r="2" fill="#0c1017" opacity="0.45" className="anim-2d-pulse" />
      <circle cx="118" cy="16" r="2.2" fill="#0c1017" opacity="0.45" className="anim-2d-pulse" />
      <circle cx="114" cy="48" r="1.8" fill="#0c1017" opacity="0.35" />

      <g className="anim-2d-float">
        <line x1="30" y1="31" x2="48" y2="31" stroke="#0c1017" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="46" y="25" width="14" height="12" rx="2" fill="#ffca28" stroke="#0c1017" strokeWidth="2.2" />
        <ellipse
          cx="66"
          cy="31"
          rx="8"
          ry="16"
          fill={isUnlocked ? '#29b6f6' : '#ffa726'}
          stroke="#0c1017"
          strokeWidth="2.2"
        />
        <line x1="68" y1="31" x2="78" y2="31" stroke="#0c1017" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="79" cy="31" r="2.2" fill="#0c1017" />
      </g>

      <g
        fill="none"
        stroke={isUnlocked ? '#0277bd' : '#d84315'}
        strokeWidth="2.4"
        strokeLinecap="round"
      >
        <path d="M87,22 A12,12 0 0,1 87,40" className="anim-2d-wave-1" />
        <path d="M96,16 A19,19 0 0,1 96,46" className="anim-2d-wave-2" />
      </g>
    </MiniSvgFrame>
  );
};
