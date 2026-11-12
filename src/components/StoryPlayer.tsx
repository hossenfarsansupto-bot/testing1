import React, { useEffect } from 'react';
import { useStory } from '../engine/storyState';
import { DialogueBox } from './DialogueBox';
import { ChoiceList } from './ChoiceList';
import { MenuInspect } from './MenuInspect';
import { NasaMediaStage } from './NasaMediaStage';
import { PageNavBar } from './PageNavBar';
import { MainConsoleBackground } from './MainConsoleBackground';
import { getSceneMediaCue } from '../content/nasaMediaCatalog';
import { cancelSpeechSynthesis, useSpeech } from '../engine/useSpeech';
import {
  startSabotageAlarmLoop,
  stopSabotageAlarmLoop
} from '../engine/soundEffects';
import { ChoiceNode, MenuNode, SayNode, StageNode, Theme } from '../types';

interface StoryPlayerProps {
  onOpenSettings: () => void;
}

export const StoryPlayer: React.FC<StoryPlayerProps> = ({ onOpenSettings }) => {
  const { state, dispatch, getCurrentNode, getCurrentScene } = useStory();
  const scene = getCurrentScene();
  const node = getCurrentNode();

  const { speak, stop: stopSpeech } = useSpeech(
    state.settings.narration,
    state.settings.feliceVoiceStyle ?? 'kid'
  );

  useEffect(() => {
    if (!node || node.type !== 'say') {
      cancelSpeechSynthesis();
    }
  }, [node]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  const isClimaxSabotageAlarmActive =
    scene?.id === 'climax' &&
    state.settings.soundEffects !== false &&
    ((state.currentNodeIndex >= 1 && state.currentNodeIndex <= 5) ||
      (state.currentNodeIndex >= 8 && state.currentNodeIndex <= 24));

  useEffect(() => {
    if (isClimaxSabotageAlarmActive) {
      startSabotageAlarmLoop();
    } else {
      stopSabotageAlarmLoop();
    }
    return () => {
      stopSabotageAlarmLoop();
    };
  }, [isClimaxSabotageAlarmActive]);

  if (!scene || !node) {
    return (
      <div className="story-player-empty">
        <p>No active transmission detected.</p>
        <button
          type="button"
          className="hub-back-button"
          onClick={() => dispatch({ type: 'OPEN_HUB', hub: 'main' })}
        >
          Return to Navigation Console
        </button>
      </div>
    );
  }

  const theme: Theme = scene.theme || 'ship';

  const handleAdvance = () => {
    dispatch({ type: 'ADVANCE_NODE' });
  };

  const handleBack = () => {
    stopSpeech();
    dispatch({ type: 'PREVIOUS_NODE' });
  };

  const handleSelectOption = (index: number) => {
    stopSpeech();
    dispatch({ type: 'CHOOSE_OPTION', optionIndex: index });
  };

  const handleSelectMenuItem = (optionId: string) => {
    stopSpeech();
    dispatch({ type: 'CHOOSE_MENU_OPTION', optionId });
  };

  const menuVisitKey = `${scene.id}_${state.currentNodeIndex}`;
  const visitedOptions = state.visitedMenuOptions[menuVisitKey] || [];
  const activeMediaCue = getSceneMediaCue(scene, node, state.currentNodeIndex);

  const COCKPIT_BG_SCENES = new Set([
    'climax',
    'after_climax',
    'mars_phoenix_met',
    'outro'
  ]);
  const hasCockpitBg = COCKPIT_BG_SCENES.has(scene.id);

  const cockpitTravelPhase =
    scene.id === 'after_climax' ||
    scene.id === 'mars_phoenix_met' ||
    scene.id === 'outro' ||
    (scene.id === 'climax' && state.currentNodeIndex >= 14)
      ? 'hyperspace'
      : 'idle';

  return (
    <div
      className={`story-player-wrapper theme-${theme} ${
        hasCockpitBg ? 'has-cockpit-bg' : ''
      } ${
        state.settings.reduceMotion ? 'reduce-motion' : ''
      } text-size-${state.settings.textSize}`}
    >
      {hasCockpitBg ? (
        <MainConsoleBackground
          travelPhase={cockpitTravelPhase}
          travelDestination={null}
        />
      ) : (
        /* Dynamic Background Shapes for Atmosphere */
        <div className="theme-bg-canvas" aria-hidden="true">
          <div className="celestial-body" />
          <div className="particle-layer" />
        </div>
      )}

      <button
        type="button"
        className="corner-settings-btn"
        onClick={onOpenSettings}
        aria-label="Open settings menu"
        title="Settings"
      >
        <svg
          viewBox="0 0 24 24"
          width="26"
          height="26"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>

      {/* Main Interactive Play Area */}
      <main className="story-interactive-stage">
        {/* Clean Slot for Scene Media / Telemetry Overlay */}
        <div
          className="illustration-slot"
          role="img"
          aria-label={`Visual depiction for ${scene.title} in ${theme} environment`}
        >
          {activeMediaCue ? (
            <div className="story-ship-media-frame">
              <NasaMediaStage
                mediaCue={activeMediaCue}
                reduceMotion={state.settings.reduceMotion}
              />
            </div>
          ) : (
            <div className="illustration-placeholder-frame">
              <span className="illustration-icon">
                {theme === 'moon' && '🌕'}
                {theme === 'mars' && '🪐'}
                {theme === 'deep_space' && '✨'}
                {theme === 'alarm' && '🚨'}
                {theme === 'home_stretch' && '☄️'}
                {theme === 'ship' && '🛸'}
              </span>
              <span className="illustration-caption">
                Telemetry Feed // {scene.title}
              </span>
            </div>
          )}
        </div>

        {/* Node Interaction Render */}
        <div className="story-node-viewport">
          {(node.type === 'say' || node.type === 'stage') && (
            <DialogueBox
              node={node as SayNode | StageNode}
              typingSpeed={state.settings.typingSpeed}
              onAdvance={handleAdvance}
              onSpeak={speak}
            />
          )}

          {node.type === 'choice' && (
            <ChoiceList
              node={node as ChoiceNode}
              onSelectOption={handleSelectOption}
            />
          )}

          {node.type === 'menu' && (
            <MenuInspect
              node={node as MenuNode}
              visitedOptionIds={visitedOptions}
              onSelectOption={handleSelectMenuItem}
            />
          )}

          <div className="story-bottom-nav">
            <PageNavBar
              onBack={handleBack}
              onNext={handleAdvance}
              nextDisabled={node.type === 'choice' || node.type === 'menu'}
              backTitle="Previous beat / return to console"
              nextTitle={
                node.type === 'choice' || node.type === 'menu'
                  ? 'Select an option above to continue'
                  : 'Next beat'
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
};
