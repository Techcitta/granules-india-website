import React, { useRef, useState, useEffect } from 'react';

interface StockVideoBannerProps {
  /**
   * Path or URL to the stock video (e.g. .mp4, .webm).
   * Replace this with your own video file path when ready!
   */
  videoSrc?: string;
  /**
   * Fallback / poster image displayed before video loads or when paused.
   */
  posterSrc?: string;
  /**
   * Accessible description of the video content.
   */
  alt?: string;
  /**
   * DOM selector to smoothly scroll to when the down arrow is clicked.
   */
  targetScrollSelector?: string;
  /**
   * Optional custom badge label (e.g. "Stock Video Placeholder").
   */
  badgeText?: string;
  /**
   * Additional CSS class name.
   */
  className?: string;
}

export default function StockVideoBanner({
  videoSrc = '/assets/strategy/sample-stock-video.mp4',
  posterSrc = '/assets/strategy/hero-video-poster.png',
  alt = 'Granules Sustainability Strategy stock video showcasing clean renewable energy and wind turbines',
  targetScrollSelector = '.sus-intro',
  badgeText = 'Stock Video',
  className = '',
}: StockVideoBannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Attempt auto-play
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay policy prevented immediate playback
          setIsPlaying(false);
        });
    }
  }, [videoSrc]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleScrollDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!targetScrollSelector) return;
    const target = document.querySelector(targetScrollSelector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`cp-video-banner ${className}`}>
      {/* Visual video / fallback poster media */}
      {!hasError && videoSrc ? (
        <video
          ref={videoRef}
          className="cp-video-media"
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onError={() => setHasError(true)}
          aria-label={alt}
        />
      ) : (
        <img className="cp-video-media" src={posterSrc} alt={alt} />
      )}

      {/* Subtle overlay gradient */}
      <div className="cp-video-overlay" onClick={togglePlay} />

      {/* Stock Video / Video Indicator Badge */}
      {badgeText && (
        <div className="cp-video-badge" title="You can replace this video in public/assets/strategy/">
          <span className="cp-video-badge-dot" />
          <span>{badgeText}</span>
        </div>
      )}

      {/* Bottom-left Chevron Scroll Indicator */}
      <button
        type="button"
        className="cp-video-scroll-btn"
        onClick={handleScrollDown}
        aria-label="Scroll down to content"
        title="Scroll down"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#0061f8" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Bottom-right Video Controls */}
      <div className="cp-video-controls">
        <button
          type="button"
          className="cp-video-ctrl-btn"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          title={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1.5" />
              <rect x="14" y="4" width="4" height="16" rx="1.5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <polygon points="6 4 20 12 6 20 6 4" />
            </svg>
          )}
        </button>

        <button
          type="button"
          className="cp-video-ctrl-btn"
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          title={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
