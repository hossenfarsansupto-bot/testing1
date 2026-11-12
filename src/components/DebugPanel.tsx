import React, { useState } from 'react';
import { useStory } from '../engine/storyState';
import { ALL_SCENE_IDS, SCENE_IDS } from '../content/flow';
import { SCENES } from '../content/scenes';
import { HubId } from '../types';

export const DebugPanel: React.FC = () => {
  const { state, dispatch } = useStory();
  const [isOpen, setIsOpen] = useState(false);
  const [validationResult, setValidationResult] = useState<string | null>(null);

  const handleJumpToScene = (sceneId: string) => {
    dispatch({ type: 'PLAY_SCENE', sceneId });
  };

  const handleJumpToHub = (hub: HubId) => {
    dispatch({ type: 'OPEN_HUB', hub });
  };

  const handleCompleteMoon = () => {
    const updated = Array.from(
      new Set([
        ...state.completedSceneIds,
        SCENE_IDS.MOON_RETRO,
        SCENE_IDS.MOON_ALSEP
      ])
    );
    dispatch({
      type: 'DEBUG_SET_STATE',
      payload: { completedSceneIds: updated }
    });
  };

  const handleCompleteMars = () => {
    const updated = Array.from(
      new Set([
        ...state.completedSceneIds,
        SCENE_IDS.MARS_VIKING,
        SCENE_IDS.MARS_SOJOURNER,
        SCENE_IDS.MARS_PHOENIX
      ])
    );
    dispatch({
      type: 'DEBUG_SET_STATE',
      payload: { completedSceneIds: updated }
    });
  };

  const handleCompletePioneerVoyager = () => {
    const updated = Array.from(
      new Set([
        ...state.completedSceneIds,
        SCENE_IDS.DS_PIONEER,
        SCENE_IDS.DS_VOYAGER
      ])
    );
    dispatch({
      type: 'DEBUG_SET_STATE',
      payload: { completedSceneIds: updated }
    });
  };

  const handleToggleDeepSpaceUnlock = () => {
    dispatch({
      type: 'DEBUG_SET_STATE',
      payload: { deepSpaceUnlocked: !state.deepSpaceUnlocked }
    });
  };

  const handleValidateContent = () => {
    const errors: string[] = [];
    ALL_SCENE_IDS.forEach(id => {
      const scene = SCENES[id];
      if (!scene) {
        errors.push(`Missing scene object: ${id}`);
        return;
      }
      if (!scene.title) errors.push(`${id}: missing title`);
      if (!scene.theme) errors.push(`${id}: missing theme`);
      if (!Array.isArray(scene.nodes) || scene.nodes.length === 0) {
        errors.push(`${id}: nodes array empty`);
      }
    });

    if (errors.length === 0) {
      setValidationResult(`PASS: All ${ALL_SCENE_IDS.length} scenes registered & valid.`);
    } else {
      setValidationResult(`FAIL: ${errors.join(', ')}`);
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        className="debug-toggle-pill"
        onClick={() => setIsOpen(true)}
        title="Open Debug Panel (?debug=1)"
      >
        🛠️ Debug
      </button>
    );
  }

  return (
    <div className="debug-drawer" role="region" aria-label="Developer Debug Panel">
      <div className="debug-header">
        <h3 className="debug-title">🛠️ Debug Panel (?debug=1)</h3>
        <button
          type="button"
          className="debug-close-btn"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>
      </div>

      <div className="debug-content">
        <div className="debug-section">
          <h4>Live State</h4>
          <p className="debug-stat">Screen: <strong>{state.screen}</strong></p>
          <p className="debug-stat">Scene: <strong>{state.currentSceneId || 'none'}</strong></p>
          <p className="debug-stat">Node Index: <strong>{state.currentNodeIndex}</strong></p>
          <p className="debug-stat">Active Hub: <strong>{state.activeHub || 'none'}</strong></p>
          <p className="debug-stat">Deep Space Unlocked: <strong>{String(state.deepSpaceUnlocked)}</strong></p>
          <p className="debug-stat">Climax Done: <strong>{String(state.climaxDone)}</strong></p>
          <p className="debug-stat">Completed: <strong>{state.completedSceneIds.join(', ') || 'none'}</strong></p>
        </div>

        <div className="debug-section">
          <h4>Jump to Scene</h4>
          <div className="debug-select-row">
            <select
              className="debug-select"
              value={state.currentSceneId || ''}
              onChange={e => e.target.value && handleJumpToScene(e.target.value)}
            >
              <option value="">-- Select Scene --</option>
              {ALL_SCENE_IDS.map(id => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="debug-section">
          <h4>Jump to Hub</h4>
          <div className="debug-btn-row">
            {(['main', 'moon', 'mars', 'deep_space'] as HubId[]).map(hub => (
              <button
                key={hub}
                type="button"
                className="debug-action-btn"
                onClick={() => handleJumpToHub(hub)}
              >
                {hub}
              </button>
            ))}
          </div>
        </div>

        <div className="debug-section">
          <h4>Progress Shortcuts</h4>
          <div className="debug-btn-col">
            <button
              type="button"
              className="debug-action-btn"
              onClick={handleCompleteMoon}
            >
              ✓ Complete Moon (2/2)
            </button>
            <button
              type="button"
              className="debug-action-btn"
              onClick={handleCompleteMars}
            >
              ✓ Complete Mars (3/3)
            </button>
            <button
              type="button"
              className="debug-action-btn"
              onClick={handleCompletePioneerVoyager}
            >
              ✓ Complete Pioneer & Voyager
            </button>
            <button
              type="button"
              className="debug-action-btn"
              onClick={handleToggleDeepSpaceUnlock}
            >
              {state.deepSpaceUnlocked ? '🔒 Lock Deep Space' : '🔓 Unlock Deep Space'}
            </button>
          </div>
        </div>

        <div className="debug-section">
          <h4>Content Validation</h4>
          <button
            type="button"
            className="debug-action-btn primary"
            onClick={handleValidateContent}
          >
            Run In-Browser Validation
          </button>
          {validationResult && (
            <p className="debug-val-result">{validationResult}</p>
          )}
        </div>
      </div>
    </div>
  );
};
