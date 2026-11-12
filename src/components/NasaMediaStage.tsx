import React, { useEffect, useRef, useState } from 'react';
import {
  GALLERY_MISSIONS,
  NASA_MEDIA_CATALOG,
  type NasaCueMedia
} from '../content/nasaMediaCatalog';
import { RetroreflectorVisualization } from './RetroreflectorVisualizations';
import { AlsepVisualization } from './AlsepVisualizations';
import { VikingVisualization } from './VikingVisualizations';
import { SojournerVisualization } from './SojournerVisualizations';
import { PhoenixVisualization } from './PhoenixVisualizations';
import { PioneerVisualization } from './PioneerVisualizations';
import { VoyagerVisualization } from './VoyagerVisualizations';
import { FinalActVisualization } from './FinalActVisualizations';

interface NasaMediaStageProps {
  mediaCue?: string;
  reduceMotion?: boolean;
}

export const NasaMediaStage: React.FC<NasaMediaStageProps> = ({
  mediaCue,
  reduceMotion = false
}) => {
  const cue: NasaCueMedia | undefined = mediaCue
    ? NASA_MEDIA_CATALOG[mediaCue]
    : undefined;

  const [imgFailed, setImgFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryFailedIds, setGalleryFailedIds] = useState<Record<string, boolean>>({});
  const [minimized, setMinimized] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Reset per-cue error/playback flags when dialogue cue changes
  useEffect(() => {
    setImgFailed(false);
    setVideoFailed(false);
    setIsPlaying(false);
    setShowTranscript(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [mediaCue]);

  // Pause video cleanly on unmount
  useEffect(() => {
    const vid = videoRef.current;
    return () => {
      if (vid) vid.pause();
    };
  }, []);

  // Close lightbox/gallery with Escape key for keyboard accessibility
  useEffect(() => {
    if (!lightboxOpen && !galleryOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
        setGalleryOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, galleryOpen]);

  const handleTogglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play().then(() => setIsPlaying(true)).catch(() => setVideoFailed(true));
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  const handleReplay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = 0;
    vid.play().then(() => setIsPlaying(true)).catch(() => setVideoFailed(true));
  };

  if (!cue) {
    return (
      <div className="nasa-stage-compact-bar">
        <button
          type="button"
          className="nasa-gallery-pill-btn"
          onClick={() => setGalleryOpen(true)}
        >
          🛰️ Mission Gallery (Apollo 11–15, Lunokhod, Blue Ghost)
        </button>
        {galleryOpen && (
          <GalleryModal
            galleryFailedIds={galleryFailedIds}
            onImgError={(id) =>
              setGalleryFailedIds((prev) => ({ ...prev, [id]: true }))
            }
            onClose={() => setGalleryOpen(false)}
          />
        )}
      </div>
    );
  }

  const hasVideo = Boolean(cue.localVideo) && !videoFailed;
  const hasImage = Boolean(cue.localImage) && !imgFailed;
  const isClosingFade = cue.cueId === 'closing_earth_horizon';

  return (
    <>
      <div
        className={`nasa-media-stage ${isClosingFade ? 'is-closing-calm' : ''} ${
          minimized ? 'is-minimized' : ''
        }`}
        aria-label={`Mission visual: ${cue.title}`}
      >
        <div className="nasa-media-toolbar">
          <div className="nasa-media-tag-group">
            <span className="nasa-media-tag">{cue.missionTag}</span>
            {cue.missionDate && (
              <span className="nasa-media-date">{cue.missionDate}</span>
            )}
          </div>
          <div className="nasa-media-toolbar-actions">
            <button
              type="button"
              className="nasa-mini-btn"
              onClick={() => setGalleryOpen(true)}
            >
              Gallery
            </button>
            <button
              type="button"
              className="nasa-mini-btn"
              onClick={() => setMinimized((m) => !m)}
              aria-expanded={!minimized}
            >
              {minimized ? 'Show Visual' : 'Minimize'}
            </button>
          </div>
        </div>

        {!minimized && (
          <div className="nasa-media-body">
            <h3 className="nasa-media-title">{cue.title}</h3>

            {/* Video Player (with poster first, muted controls, VTT/transcript, & graceful error fallback) */}
            {cue.localVideo ? (
              hasVideo ? (
                <div className="nasa-video-wrap">
                  <video
                    ref={videoRef}
                    className="nasa-video-el"
                    src={cue.localVideo}
                    poster={cue.localPoster}
                    muted={isMuted}
                    playsInline
                    preload="metadata"
                    onEnded={() => setIsPlaying(false)}
                    onError={() => setVideoFailed(true)}
                  >
                    {cue.captionsVtt ? (
                      <track
                        kind="captions"
                        src={cue.captionsVtt}
                        srcLang="en"
                        label="English Captions"
                        default
                      />
                    ) : cue.videoTranscript ? (
                      <track
                        kind="captions"
                        label="English Captions"
                        default
                      />
                    ) : null}
                  </video>
                  <div className="nasa-video-controls">
                    <button
                      type="button"
                      className="nasa-ctrl-btn primary"
                      onClick={handleTogglePlay}
                    >
                      {isPlaying ? '⏸ Pause' : '▶ Play Clip'}
                    </button>
                    <button
                      type="button"
                      className="nasa-ctrl-btn"
                      onClick={handleReplay}
                    >
                      ↺ Replay
                    </button>
                    <button
                      type="button"
                      className="nasa-ctrl-btn"
                      onClick={() => setIsMuted((m) => !m)}
                    >
                      {isMuted ? '🔇 Muted' : '🔊 Sound'}
                    </button>
                    {cue.videoTranscript && (
                      <button
                        type="button"
                        className="nasa-ctrl-btn"
                        onClick={() => setShowTranscript((s) => !s)}
                      >
                        {showTranscript ? 'Hide Transcript' : 'Captions / Transcript'}
                      </button>
                    )}
                  </div>
                  {showTranscript && cue.videoTranscript && (
                    <p className="nasa-video-transcript">{cue.videoTranscript}</p>
                  )}
                </div>
              ) : (
                <div className="nasa-fallback-card" role="region" aria-label={cue.title}>
                  <div className="nasa-fallback-icon" aria-hidden="true">🎞️</div>
                  <div className="nasa-fallback-copy">
                    <span className="nasa-fallback-label">
                      OFFICIAL NASA VIDEO ARCHIVE REFERENCE
                    </span>
                    <p className="nasa-fallback-desc">
                      {cue.videoTranscript || cue.caption}
                    </p>
                    <div className="nasa-video-controls">
                      <button
                        type="button"
                        className="nasa-ctrl-btn"
                        onClick={() => setVideoFailed(false)}
                      >
                        ↺ Retry Video
                      </button>
                      {cue.videoTranscript && (
                        <button
                          type="button"
                          className="nasa-ctrl-btn"
                          onClick={() => setShowTranscript((s) => !s)}
                        >
                          {showTranscript ? 'Hide Captions' : 'Read Captions'}
                        </button>
                      )}
                      {cue.sources[0] && (
                        <a
                          href={cue.sources[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="nasa-source-pill-link"
                        >
                          Watch Official NASA Video ↗
                        </a>
                      )}
                    </div>
                    {showTranscript && cue.videoTranscript && (
                      <p className="nasa-video-transcript">{cue.videoTranscript}</p>
                    )}
                  </div>
                </div>
              )
            ) : cue.instrumentThumbnails ? (
              <div className="alsep-thumb-grid" role="region" aria-label={cue.title}>
                {cue.instrumentThumbnails.map((inst) => (
                  <div key={inst.id} className="alsep-thumb-card">
                    <div className="alsep-thumb-img-box">
                      {inst.image ? (
                        <img
                          src={inst.image}
                          alt={inst.label}
                          loading="lazy"
                        />
                      ) : (
                        <span className="alsep-thumb-schematic-icon" aria-hidden="true">
                          ☀️ Solar Wind Diagram
                        </span>
                      )}
                    </div>
                    <strong className="alsep-thumb-title">{inst.label}</strong>
                    <span className="alsep-thumb-badge">{inst.badge}</span>
                  </div>
                ))}
              </div>
            ) : cue.dualPanels ? (
              <div className="ds-dual-panel-grid" role="region" aria-label="Deep Space 1 and New Horizons reference">
                {cue.dualPanels.map((panel) => (
                  <div key={panel.label} className="ds-dual-card">
                    <img src={panel.image} alt={panel.altText} loading="lazy" />
                    <div className="ds-dual-copy">
                      <strong>{panel.label}</strong>
                      <span>{panel.sublabel}</span>
                      <a
                        href={panel.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nasa-source-link"
                      >
                        NASA Source ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : cue.visualizationId ? (
              <RetroreflectorVisualization
                id={cue.visualizationId}
                reduceMotion={reduceMotion}
              />
            ) : cue.alsepVizId && !cue.localImage ? (
              <AlsepVisualization
                id={cue.alsepVizId}
                reduceMotion={reduceMotion}
              />
            ) : cue.vikingVizId && !cue.localImage ? (
              <VikingVisualization
                id={cue.vikingVizId}
                reduceMotion={reduceMotion}
              />
            ) : cue.sojournerVizId && !cue.localImage ? (
              <SojournerVisualization
                id={cue.sojournerVizId}
                reduceMotion={reduceMotion}
              />
            ) : cue.phoenixVizId && !cue.localImage ? (
              <PhoenixVisualization
                id={cue.phoenixVizId}
                reduceMotion={reduceMotion}
              />
            ) : cue.pioneerVizId && !cue.localImage ? (
              <PioneerVisualization
                id={cue.pioneerVizId}
                reduceMotion={reduceMotion}
              />
            ) : cue.voyagerVizId && !cue.localImage ? (
              <VoyagerVisualization
                id={cue.voyagerVizId}
                reduceMotion={reduceMotion}
              />
            ) : cue.finalActVizId && !cue.localImage ? (
              <FinalActVisualization
                id={cue.finalActVizId}
                reduceMotion={reduceMotion}
              />
            ) : hasImage ? (
              <>
                <div className="nasa-image-frame">
                  <button
                    type="button"
                    className="nasa-image-zoom-btn"
                    onClick={() => setLightboxOpen(true)}
                    aria-label={`Enlarge image: ${cue.title}`}
                  >
                    <img
                      src={cue.localImage}
                      alt={cue.altText}
                      className={`nasa-media-img ${
                        cue.objectFit === 'contain' ? 'fit-contain' : ''
                      }`}
                      loading="eager"
                      onError={() => setImgFailed(true)}
                    />
                    <span className="nasa-zoom-chip">🔍 Click to Enlarge</span>
                  </button>
                </div>
                {cue.alsepVizId && (
                  <div className="nasa-hybrid-viz-slot">
                    <AlsepVisualization
                      id={cue.alsepVizId}
                      reduceMotion={reduceMotion}
                    />
                  </div>
                )}
                {cue.vikingVizId && (
                  <div className="nasa-hybrid-viz-slot">
                    <VikingVisualization
                      id={cue.vikingVizId}
                      reduceMotion={reduceMotion}
                    />
                  </div>
                )}
                {cue.sojournerVizId && (
                  <div className="nasa-hybrid-viz-slot">
                    <SojournerVisualization
                      id={cue.sojournerVizId}
                      reduceMotion={reduceMotion}
                    />
                  </div>
                )}
                {cue.phoenixVizId && (
                  <div className="nasa-hybrid-viz-slot">
                    <PhoenixVisualization
                      id={cue.phoenixVizId}
                      reduceMotion={reduceMotion}
                    />
                  </div>
                )}
                {cue.pioneerVizId && (
                  <div className="nasa-hybrid-viz-slot">
                    <PioneerVisualization
                      id={cue.pioneerVizId}
                      reduceMotion={reduceMotion}
                    />
                  </div>
                )}
                {cue.voyagerVizId && (
                  <div className="nasa-hybrid-viz-slot">
                    <VoyagerVisualization
                      id={cue.voyagerVizId}
                      reduceMotion={reduceMotion}
                    />
                  </div>
                )}
                {cue.finalActVizId && (
                  <div className="nasa-hybrid-viz-slot">
                    <FinalActVisualization
                      id={cue.finalActVizId}
                      reduceMotion={reduceMotion}
                    />
                  </div>
                )}
              </>
            ) : (
              /* Neutral Fallback Card when external NASA media could not be stored locally */
              <div className="nasa-fallback-card" role="region" aria-label={cue.title}>
                <div className="nasa-fallback-icon" aria-hidden="true">🌕</div>
                <div className="nasa-fallback-copy">
                  <span className="nasa-fallback-label">
                    NASA ARCHIVE SOURCE // NEUTRAL FALLBACK
                  </span>
                  <p className="nasa-fallback-desc">{cue.altText}</p>
                  {cue.localImage && (
                    <button
                      type="button"
                      className="nasa-ctrl-btn"
                      onClick={() => setImgFailed(false)}
                    >
                      ↺ Retry Image
                    </button>
                  )}
                </div>
              </div>
            )}

            {cue.scaleNote && (
              <div className="nasa-scale-note">{cue.scaleNote}</div>
            )}

            <p className="nasa-media-caption">{cue.caption}</p>

            <div className="nasa-media-footer">
              <span className="nasa-media-credit">Credit: {cue.credit}</span>
              <div className="nasa-media-links">
                {cue.sources.map((src) => (
                  <a
                    key={src.url}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nasa-source-link"
                  >
                    {src.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal for Verified Images */}
      {lightboxOpen && hasImage && (
        <div
          className="nasa-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Enlarged view: ${cue.title}`}
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="nasa-modal-card nasa-lightbox-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="nasa-modal-header">
              <div>
                <span className="nasa-media-tag">{cue.missionTag}</span>
                <h3>{cue.title}</h3>
              </div>
              <button
                type="button"
                className="nasa-modal-close"
                onClick={() => setLightboxOpen(false)}
                autoFocus
              >
                ✕ Close
              </button>
            </div>
            <img
              src={cue.localImage}
              alt={cue.altText}
              className="nasa-lightbox-img"
            />
            <p className="nasa-media-caption">{cue.caption}</p>
            <div className="nasa-media-footer">
              <span className="nasa-media-credit">Credit: {cue.credit}</span>
              {cue.sources.map((src) => (
                <a
                  key={src.url}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nasa-source-link"
                >
                  {src.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mission Gallery Modal */}
      {galleryOpen && (
        <GalleryModal
          galleryFailedIds={galleryFailedIds}
          onImgError={(id) =>
            setGalleryFailedIds((prev) => ({ ...prev, [id]: true }))
          }
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </>
  );
};

const GalleryModal: React.FC<{
  galleryFailedIds: Record<string, boolean>;
  onImgError: (id: string) => void;
  onClose: () => void;
}> = ({ galleryFailedIds, onImgError, onClose }) => (
  <div
    className="nasa-modal-backdrop"
    role="dialog"
    aria-modal="true"
    aria-label="Lunar Retroreflector Mission Gallery"
    onClick={onClose}
  >
    <div
      className="nasa-modal-card nasa-gallery-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="nasa-modal-header">
        <div>
          <span className="nasa-media-tag">OFFICIAL ARCHIVE REFERENCES</span>
          <h3>Lunar Retroreflector Mission Gallery</h3>
        </div>
        <button
          type="button"
          className="nasa-modal-close"
          onClick={onClose}
          autoFocus
        >
          ✕ Close
        </button>
      </div>
      <div className="nasa-gallery-grid">
        {GALLERY_MISSIONS.map((item) => {
          const canShowImg =
            Boolean(item.localImage) && !galleryFailedIds[item.id];
          return (
            <article key={item.id} className="nasa-gallery-item">
              <div className="nasa-gallery-thumb">
                {canShowImg ? (
                  <img
                    src={item.localImage}
                    alt={item.altText}
                    loading="lazy"
                    onError={() => onImgError(item.id)}
                  />
                ) : (
                  <div className="nasa-gallery-placeholder" aria-hidden="true">
                    <span>🛰️ {item.missionName}</span>
                    <small>Official NASA / ILRS Archive</small>
                  </div>
                )}
              </div>
              <div className="nasa-gallery-info">
                <div className="nasa-gallery-meta">
                  <strong>{item.missionName}</strong>
                  <span>{item.dateLabel}</span>
                </div>
                <h4>{item.title}</h4>
                <p>{item.caption}</p>
                <span className="nasa-media-credit">Credit: {item.credit}</span>
                <a
                  href={item.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nasa-source-link"
                >
                  {item.source.label} ↗
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  </div>
);
