import React from 'react';
import { SCENE_IDS } from '../content/flow';

interface ProgressHudProps {
  completedSceneIds: string[];
}

export const ProgressHud: React.FC<ProgressHudProps> = ({
  completedSceneIds
}) => {
  const moonCompleted = [SCENE_IDS.MOON_RETRO, SCENE_IDS.MOON_ALSEP].filter(id =>
    completedSceneIds.includes(id)
  ).length;

  const marsCompleted = [
    SCENE_IDS.MARS_VIKING,
    SCENE_IDS.MARS_SOJOURNER,
    SCENE_IDS.MARS_PHOENIX
  ].filter(id => completedSceneIds.includes(id)).length;

  const deepSpaceCompleted = [SCENE_IDS.DS_PIONEER, SCENE_IDS.DS_VOYAGER].filter(
    id => completedSceneIds.includes(id)
  ).length;

  return (
    <div
      className="progress-hud"
      role="status"
      aria-label={`Mission Progress: Moon ${moonCompleted} of 2, Mars ${marsCompleted} of 3, Deep space ${deepSpaceCompleted} of 2`}
    >
      <div className="hud-metric">
        <span className="metric-icon">🌕</span>
        <span className="metric-name">Moon:</span>
        <span className="metric-count">
          {moonCompleted}/2
          {moonCompleted === 2 && <span className="metric-tick"> ✓</span>}
        </span>
      </div>

      <div className="hud-metric">
        <span className="metric-icon">🪐</span>
        <span className="metric-name">Mars:</span>
        <span className="metric-count">
          {marsCompleted}/3
          {marsCompleted === 3 && <span className="metric-tick"> ✓</span>}
        </span>
      </div>

      <div className="hud-metric">
        <span className="metric-icon">🚀</span>
        <span className="metric-name">Deep space:</span>
        <span className="metric-count">
          {deepSpaceCompleted}/2
          {deepSpaceCompleted === 2 && <span className="metric-tick"> ✓</span>}
        </span>
      </div>
    </div>
  );
};
