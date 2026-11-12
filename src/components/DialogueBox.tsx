import React, { useState, useEffect, useRef } from 'react';
import { SayNode, StageNode, TypingSpeed } from '../types';
import { NARRATOR_NAME, TYPING_SPEED_MS } from '../content/config';
import {
  cancelSpeechSynthesis,
  pauseSpeechSynthesis,
  resumeSpeechSynthesis,
  type SpeakOptions
} from '../engine/useSpeech';
import { useStory } from '../engine/storyState';

interface DialogueBoxProps {
  node: SayNode | StageNode;
  typingSpeed: TypingSpeed;
  onAdvance: () => void;
  onSpeak?: (text: string, options?: SpeakOptions) => void;
}

export const FelicePauseButton: React.FC<{ className?: string }> = ({
  className
}) => {
  const { state, dispatch } = useStory();
  const isPaused = state.isPaused;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextPaused = !isPaused;
    if (nextPaused) {
      pauseSpeechSynthesis();
    } else {
      resumeSpeechSynthesis();
    }
    dispatch({ type: 'SET_PAUSED', paused: nextPaused });
  };

  return (
    <button
      type="button"
      className={`felice-pause-btn ${isPaused ? 'is-paused' : ''} ${className || ''}`}
      onClick={handleToggle}
      onKeyDown={(e) => e.stopPropagation()}
      aria-pressed={isPaused}
      aria-label={isPaused ? 'Resume Felice' : 'Pause Felice'}
      title={isPaused ? 'Resume Felice' : 'Pause Felice'}
    >
      <span aria-hidden="true">{isPaused ? '▶' : '⏸'}</span>
      <span>{isPaused ? 'Resume' : 'Pause'}</span>
    </button>
  );
};

export const FeliceVoiceMuteButton: React.FC<{ className?: string }> = ({
  className
}) => {
  const { state, dispatch } = useStory();
  const isMuted = !state.settings.narration;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextNarration = !state.settings.narration;
    if (!nextNarration) {
      cancelSpeechSynthesis();
    }
    dispatch({
      type: 'UPDATE_SETTINGS',
      settings: { narration: nextNarration }
    });
  };

  return (
    <button
      type="button"
      className={`felice-voice-mute-btn ${isMuted ? 'is-muted' : ''} ${className || ''}`}
      onClick={handleToggle}
      onKeyDown={(e) => e.stopPropagation()}
      aria-pressed={isMuted}
      aria-label={isMuted ? "Unmute Felice's voice" : "Mute Felice's voice"}
      title={isMuted ? "Unmute Felice's voice" : "Mute Felice's voice"}
    >
      <span aria-hidden="true">{isMuted ? '🔇' : '🔊'}</span>
      <span>{isMuted ? 'Unmute Voice' : 'Mute Voice'}</span>
    </button>
  );
};

export const FeliceTextboxControls: React.FC<{ className?: string }> = ({
  className
}) => (
  <div className={`felice-textbox-controls ${className || ''}`}>
    <FelicePauseButton />
    <FeliceVoiceMuteButton />
  </div>
);

export const FeliceAvatar: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 120 112"
    className={className || 'felice-avatar-svg'}
    role="img"
    aria-label="Felice, Android Feline Guide"
  >
    <defs>
      <linearGradient id="avatarWhiteGrad" x1="15%" y1="0%" x2="85%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="58%" stopColor="#e2e8f8" />
        <stop offset="100%" stopColor="#9aa8c7" />
      </linearGradient>
      <radialGradient id="avatarAntennaGlow" cx="42%" cy="38%" r="58%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="45%" stopColor="#6cf7ff" />
        <stop offset="100%" stopColor="#00bfff" />
      </radialGradient>
    </defs>

    {/* Top Cyan Spherical Antenna & Base Collar */}
    <path d="M53,31 Q60,27 67,31 L68,35 L52,35 Z" fill="#1e293b" stroke="#0c1017" strokeWidth="2" />
    <line x1="60" y1="29" x2="60" y2="16" stroke="#0c1017" strokeWidth="4.2" strokeLinecap="round" />
    <line x1="60" y1="29" x2="60" y2="16" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
    <circle cx="60" cy="12" r="7" fill="url(#avatarAntennaGlow)" stroke="#00bfff" strokeWidth="1.2" />

    {/* Two Pearl-White Top Cat Ears with Dark Housing & Cyan Illuminated Cores */}
    <path d="M16,52 Q13,22 30,24 Q40,26 45,37 Z" fill="url(#avatarWhiteGrad)" stroke="#0c1017" strokeWidth="2.8" strokeLinejoin="round" />
    <path d="M20,46 Q19,28 30,30 Q35,32 38,38 Z" fill="#101828" stroke="#475569" strokeWidth="1.2" />
    <path d="M23,44 Q23,33 30,34 Q33,36 35,40 Z" fill="#2ceeff" />

    <path d="M104,52 Q107,22 90,24 Q80,26 75,37 Z" fill="url(#avatarWhiteGrad)" stroke="#0c1017" strokeWidth="2.8" strokeLinejoin="round" />
    <path d="M100,46 Q101,28 90,30 Q85,32 82,38 Z" fill="#101828" stroke="#475569" strokeWidth="1.2" />
    <path d="M97,44 Q97,33 90,34 Q87,36 85,40 Z" fill="#2ceeff" />

    {/* Circular Glowing Cyan Headphone Ear-Pods */}
    <ellipse cx="9" cy="64" rx="8" ry="14" fill="url(#avatarWhiteGrad)" stroke="#0c1017" strokeWidth="2.4" />
    <ellipse cx="7.5" cy="64" rx="5" ry="10.5" fill="#0f172a" stroke="#2ceeff" strokeWidth="2.4" />

    <ellipse cx="111" cy="64" rx="8" ry="14" fill="url(#avatarWhiteGrad)" stroke="#0c1017" strokeWidth="2.4" />
    <ellipse cx="112.5" cy="64" rx="5" ry="10.5" fill="#0f172a" stroke="#2ceeff" strokeWidth="2.4" />

    {/* Main Pearl-White Rounded Helmet Shell */}
    <path
      d="M12,62 C12,37 32,32 60,32 C88,32 108,37 108,62 C108,89 92,99 60,99 C28,99 12,89 12,62 Z"
      fill="url(#avatarWhiteGrad)"
      stroke="#0c1017"
      strokeWidth="3"
    />
    <line x1="60" y1="33" x2="60" y2="41" stroke="#475569" strokeWidth="1.4" opacity="0.7" />

    {/* Deep Obsidian Black Curved OLED Visor */}
    <path
      d="M20,63 C20,44 35,40 60,40 C85,40 100,44 100,63 C100,83 87,91 60,91 C33,91 20,83 20,63 Z"
      fill="#060a14"
      stroke="#1e293b"
      strokeWidth="2.2"
    />
    <path d="M75,43 Q89,46 93,54" fill="none" stroke="rgba(255,255,255,0.34)" strokeWidth="3" strokeLinecap="round" />

    {/* Pill-shaped Vertical Neon-Cyan Eyes & Cute w Mouth (Image 1) */}
    <rect x="29" y="49" width="16" height="25" rx="8" fill="#2ceeff" />
    <rect x="75" y="49" width="16" height="25" rx="8" fill="#2ceeff" />
    <path d="M52,77 Q56,81.5 60,77 Q64,81.5 68,77" fill="none" stroke="#4ef2ff" strokeWidth="2.8" strokeLinecap="round" />

    {/* Neck Ring */}
    <rect x="46" y="98" width="28" height="8" rx="4" fill="#171f30" stroke="#0c1017" strokeWidth="2.2" />
  </svg>
);

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  node,
  typingSpeed,
  onAdvance,
  onSpeak
}) => {
  const { state } = useStory();
  const isPaused = state.isPaused;
  const isSay = node.type === 'say';
  const speaker = isSay ? (node as SayNode).speaker : null;
  const rawText = node.text;
  const listItems = isSay ? (node as SayNode).list : undefined;

  const [displayedLength, setDisplayedLength] = useState(
    typingSpeed === 'instant' ? rawText.length : 0
  );
  const [speechDone, setSpeechDone] = useState(false);
  const isTypingComplete = displayedLength >= rawText.length;

  const timerRef = useRef<number | null>(null);
  const onAdvanceRef = useRef(onAdvance);
  onAdvanceRef.current = onAdvance;

  // Trigger speech synthesis only for spoken dialogue ('say' nodes); stage directions stay silent
  useEffect(() => {
    let cancelled = false;
    setSpeechDone(false);
    if (!isSay) {
      cancelSpeechSynthesis();
      return () => {
        cancelled = true;
      };
    }
    if (onSpeak) {
      let fullSpeech = rawText;
      if (listItems && listItems.length > 0) {
        fullSpeech += '. ' + listItems.map((item, i) => `Rule ${i + 1}: ${item}`).join('. ');
      }
      const spk = (node as SayNode).speaker;
      onSpeak(fullSpeech, {
        speaker: spk,
        onEnd:
          spk === 'felice'
            ? () => {
                if (!cancelled) setSpeechDone(true);
              }
            : undefined
      });
    }
    return () => {
      cancelled = true;
    };
  }, [rawText, listItems, onSpeak, isSay, node]);

  // Automatically advance after Felice finishes speaking & typing completes
  useEffect(() => {
    if (isPaused || !isSay || speaker !== 'felice') return;
    if (!speechDone || !isTypingComplete) return;
    const timer = window.setTimeout(() => {
      if (document.querySelector('.nasa-modal-backdrop, .settings-modal-backdrop')) {
        return;
      }
      onAdvanceRef.current();
    }, 350);
    return () => window.clearTimeout(timer);
  }, [isPaused, isSay, speaker, speechDone, isTypingComplete]);

  // Reset typed length on new text or instant typing mode
  useEffect(() => {
    setDisplayedLength(typingSpeed === 'instant' ? rawText.length : 0);
  }, [rawText, typingSpeed]);

  // Handle typing animation (freezes smoothly while paused)
  useEffect(() => {
    if (isPaused || typingSpeed === 'instant' || isTypingComplete) {
      return;
    }

    const speedMs = TYPING_SPEED_MS[typingSpeed];

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      setDisplayedLength(prev => {
        if (prev + 1 >= rawText.length) {
          if (timerRef.current) clearInterval(timerRef.current);
          return rawText.length;
        }
        return prev + 1;
      });
    }, speedMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, rawText, typingSpeed, isTypingComplete]);

  const handleInteraction = () => {
    if (!isTypingComplete) {
      // Finish line instantly
      if (timerRef.current) clearInterval(timerRef.current);
      setDisplayedLength(rawText.length);
    } else {
      // Advance to next node
      onAdvance();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleInteraction();
    }
  };

  const displayedText = rawText.slice(0, displayedLength);

  if (node.type === 'stage') {
    return (
      <div
        className="dialogue-container stage-container"
        onClick={handleInteraction}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-live="polite"
        aria-label="Action narration. Press Space or Enter to continue."
      >
        <div className="stage-box">
          <p className="stage-text">*{displayedText}*</p>
          {isTypingComplete && <span className="advance-indicator" aria-hidden="true">▶</span>}
        </div>
      </div>
    );
  }

  const isFelice = speaker === 'felice';

  return (
    <div
      className={`dialogue-container ${isFelice ? 'felice-container' : 'system-container'}`}
      onClick={handleInteraction}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-live="polite"
      aria-label={`${isFelice ? NARRATOR_NAME : 'Ship System'} speaking. Press Space or Enter to advance.`}
    >
      {isFelice ? (
        <div className="felice-bubble-layout">
          <div className="felice-avatar-slot">
            <FeliceAvatar />
            <span className="speaker-name-tag">{NARRATOR_NAME}</span>
          </div>
          <div className="felice-speech-bubble">
            <div className="felice-bubble-top-bar">
              <span className="felice-bubble-speaker">{NARRATOR_NAME}</span>
              <FeliceTextboxControls />
            </div>
            <p className="dialogue-text">{displayedText}</p>
            {listItems && listItems.length > 0 && isTypingComplete && (
              <ol className="dialogue-ordered-list">
                {listItems.map((item, index) => (
                  <li key={index} className="dialogue-list-item">
                    <span className="list-number">{index + 1}.</span> {item}
                  </li>
                ))}
              </ol>
            )}
            {isTypingComplete && (
              <div className="advance-prompt">
                <span className="advance-indicator" aria-hidden="true">▶ Tap or press Space</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="system-terminal-panel">
          <div className="terminal-header">
            <span className="terminal-dot green" />
            <span className="terminal-dot yellow" />
            <span className="terminal-dot red" />
            <span className="terminal-title">SHIP HUD // SYSTEM BROADCAST</span>
          </div>
          <div className="terminal-body">
            <p className="terminal-text">
              <span className="terminal-prompt">&gt;&nbsp;</span>
              {displayedText}
            </p>
            {isTypingComplete && (
              <div className="advance-prompt">
                <span className="advance-indicator system" aria-hidden="true">█ Press Space or Click to continue</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
