import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Preloader component displaying the full brand logo motion video
 * centered on screen with exact 200px width and automatic aspect-ratio height.
 *
 * Configured to play the full 10-second animation at ~2.25x speed (completing in ~4.4s)
 * so the user experiences the complete motion without the site appearing early,
 * followed by a silky smooth dissolve transition.
 */
export const Preloader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasFinishedRef = useRef(false);

  const startFadeOut = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;

    setIsFadingOut(true);

    // Give 800ms for the smooth fade-out transition to complete before unmounting
    setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = '';
    }, 800);
  }, []);

  useEffect(() => {
    // Lock scrolling so user cannot scroll the page behind the preloader
    document.body.style.overflow = 'hidden';

    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      // 2.25x playback rate plays the full 10s animation in ~4.4 seconds
      video.playbackRate = 2.25;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback if browser requires user gesture
        });
      }
    }

    // Safety fallback timer: guarantee fade-out between 4.4s and 4.8s
    // even if video buffering or onEnded event is delayed
    const safetyTimer = setTimeout(() => {
      startFadeOut();
    }, 4600);

    return () => {
      clearTimeout(safetyTimer);
      document.body.style.overflow = '';
    };
  }, [startFadeOut]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 2.25;
    }
  };

  const handleCanPlay = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 2.25;
      videoRef.current.play().catch(() => { });
    }
  };

  const handleVideoEnded = () => {
    // When the full motion animation completes, fade out smoothly
    startFadeOut();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      id="sain-site-preloader"
      className={`fixed inset-0 z-[9999999] bg-black flex items-center justify-center transition-opacity duration-800 ease-in-out select-none will-change-opacity ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      aria-label="Loading SAIN Logistics..."
      role="status"
    >
      <div className="w-[400px] flex items-center justify-center transform-gpu">
        <video
          ref={videoRef}
          src="/videos/pre-loader-logo.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={handleLoadedMetadata}
          onCanPlay={handleCanPlay}
          onEnded={handleVideoEnded}
          className="w-[400px] h-auto object-contain pointer-events-none select-none block"
        />
      </div>
    </div>
  );
};
