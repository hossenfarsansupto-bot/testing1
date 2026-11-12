import React from 'react';
import { FeliceVoiceStyle, Settings, TextSize, TypingSpeed } from '../types';

interface SettingsPanelProps {
  settings: Settings;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSettings: (settings: Partial<Settings>) => void;
  onPreviewVoice?: (sampleText: string, style: FeliceVoiceStyle) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  isOpen,
  onClose,
  onUpdateSettings,
  onPreviewVoice
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="settings-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Story Settings"
    >
      <div
        className="settings-modal-card"
        onClick={e => e.stopPropagation()}
      >
        <div className="settings-header">
          <h2 className="settings-title">⚙️ Audio & Display Settings</h2>
          <button
            type="button"
            className="settings-close-button"
            onClick={onClose}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <div className="settings-body">
          {/* Text Size */}
          <div className="settings-group">
            <label className="settings-label" id="text-size-label">
              Text Size
            </label>
            <div
              className="settings-segmented-control"
              role="radiogroup"
              aria-labelledby="text-size-label"
            >
              {(['small', 'normal', 'large'] as TextSize[]).map(size => (
                <button
                  key={size}
                  type="button"
                  className={`segmented-button ${settings.textSize === size ? 'active' : ''}`}
                  onClick={() => onUpdateSettings({ textSize: size })}
                  role="radio"
                  aria-checked={settings.textSize === size}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Typing Speed */}
          <div className="settings-group">
            <label className="settings-label" id="typing-speed-label">
              Typing Speed
            </label>
            <div
              className="settings-segmented-control"
              role="radiogroup"
              aria-labelledby="typing-speed-label"
            >
              {(['normal', 'fast', 'instant'] as TypingSpeed[]).map(speed => (
                <button
                  key={speed}
                  type="button"
                  className={`segmented-button ${settings.typingSpeed === speed ? 'active' : ''}`}
                  onClick={() => onUpdateSettings({ typingSpeed: speed })}
                  role="radio"
                  aria-checked={settings.typingSpeed === speed}
                >
                  {speed.charAt(0).toUpperCase() + speed.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Reduce Motion */}
          <div className="settings-group toggle-group">
            <label className="settings-toggle-label" htmlFor="toggle-reduce-motion">
              <span>Reduce Motion</span>
              <span className="settings-subtext">Disables decorative pulses and background drift</span>
            </label>
            <button
              id="toggle-reduce-motion"
              type="button"
              className={`toggle-switch ${settings.reduceMotion ? 'on' : 'off'}`}
              onClick={() => onUpdateSettings({ reduceMotion: !settings.reduceMotion })}
              role="switch"
              aria-checked={settings.reduceMotion}
            >
              <span className="switch-slider" />
            </button>
          </div>

          {/* Felice Narration */}
          <div className="settings-group toggle-group">
            <label className="settings-toggle-label" htmlFor="toggle-narration">
              <span>Felice Narration</span>
              <span className="settings-subtext">Have Felice read her dialogue and prompts aloud</span>
            </label>
            <button
              id="toggle-narration"
              type="button"
              className={`toggle-switch ${settings.narration ? 'on' : 'off'}`}
              onClick={() => onUpdateSettings({ narration: !settings.narration })}
              role="switch"
              aria-checked={settings.narration}
            >
              <span className="switch-slider" />
            </button>
          </div>

          {/* Felice Voice Style */}
          <div className="settings-group">
            <label className="settings-label" id="felice-voice-label">
              Felice Voice
            </label>
            <div
              className="settings-segmented-control"
              role="radiogroup"
              aria-labelledby="felice-voice-label"
            >
              {(
                [
                  {
                    id: 'kid',
                    label: 'Child Voiceover',
                    sample: 'Yay! Let us blast off and explore the Moon!'
                  },
                  {
                    id: 'storyteller',
                    label: 'Warm Storyteller',
                    sample: 'Hi explorer! Ready to discover the cosmos together?'
                  }
                ] as Array<{
                  id: FeliceVoiceStyle;
                  label: string;
                  sample: string;
                }>
              ).map((opt) => {
                const activeStyle = settings.feliceVoiceStyle || 'kid';
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`segmented-button ${
                      activeStyle === opt.id ? 'active' : ''
                    }`}
                    onClick={() => {
                      onUpdateSettings({ feliceVoiceStyle: opt.id });
                      onPreviewVoice?.(opt.sample, opt.id);
                    }}
                    role="radio"
                    aria-checked={activeStyle === opt.id}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound Effects */}
          <div className="settings-group toggle-group">
            <label className="settings-toggle-label" htmlFor="toggle-sfx">
              <span>Sound Effects</span>
              <span className="settings-subtext">Play audio feedback on button clicks and page transitions</span>
            </label>
            <button
              id="toggle-sfx"
              type="button"
              className={`toggle-switch ${settings.soundEffects !== false ? 'on' : 'off'}`}
              onClick={() =>
                onUpdateSettings({ soundEffects: settings.soundEffects === false })
              }
              role="switch"
              aria-checked={settings.soundEffects !== false}
            >
              <span className="switch-slider" />
            </button>
          </div>

          {/* Master Volume Slider */}
          {(() => {
            const volumePercent = Math.round((settings.volume ?? 1) * 100);
            const volumeIcon =
              volumePercent === 0 ? '🔇' : volumePercent < 50 ? '🔉' : '🔊';
            return (
              <div className="settings-group volume-group">
                <div className="settings-volume-header">
                  <label className="settings-label" htmlFor="volume-slider">
                    Master Volume
                  </label>
                  <span className="settings-volume-value">
                    <span aria-hidden="true">{volumeIcon}</span> {volumePercent}%
                  </span>
                </div>
                <input
                  id="volume-slider"
                  type="range"
                  className="settings-volume-slider"
                  min={0}
                  max={100}
                  step={1}
                  value={volumePercent}
                  style={
                    {
                      '--vol-pct': `${volumePercent}%`
                    } as React.CSSProperties
                  }
                  onChange={(e) => {
                    const nextVol = Number(e.target.value) / 100;
                    onUpdateSettings({ volume: nextVol });
                  }}
                  aria-label="Master volume"
                  aria-valuetext={`${volumePercent}%`}
                />
              </div>
            );
          })()}
        </div>

        <div className="settings-footer">
          <button
            type="button"
            className="settings-done-button"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
