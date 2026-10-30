import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SainLogo } from '../assets/Logo';

/**
 * Preloader component with Hybrid Ambient Mode:
 * - Plays brand motion video smoothly with hardware acceleration
 * - Optimized for iOS Safari / WebKit: safe playbackRate, playsInline, webkit-playsinline
 * - Hybrid ambient fallback: if iOS low-power mode or Safari restricts autoplay or stalls,
 *   smoothly presents an elegant glowing brand logo with shimmer
 * - Guaranteed non-blocking: auto fades out smoothly after completion or max safety timer
 * - Tap to dismiss support for instant access
 */
export const Preloader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [showAmbientFallback, setShowAmbientFallback] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hasFinishedRef = useRef(false);

  const startFadeOut = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;

    setIsFadingOut(true);

    // 700ms smooth dissolve transition before unmounting
    setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = '';
    }, 700);
  }, []);

  useEffect(() => {
    // Lock scrolling while preloader is active
    document.body.style.overflow = 'hidden';

    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('x-webkit-airplay', 'deny');

      // Attempt autoplay
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Video started playing successfully
          })
          .catch(() => {
            // Safari/iOS autoplay blocked (e.g. low power mode) -> fallback immediately to ambient mode
            setShowAmbientFallback(true);
          });
      }
    }

    // iOS Safari Stall Detector:
    // If after 600ms video hasn't progressed, activate ambient mode
    const stallDetector = setTimeout(() => {
      if (video && (video.paused || video.currentTime === 0)) {
        setShowAmbientFallback(true);
      }
    }, 600);

    // Safety fallback timer: guarantee fade-out smoothly after 3.8s max
    const safetyTimer = setTimeout(() => {
      startFadeOut();
    }, 3800);

    return () => {
      clearTimeout(stallDetector);
      clearTimeout(safetyTimer);
      document.body.style.overflow = '';
    };
  }, [startFadeOut]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.currentTime > 0.05 && !videoStarted) {
      setVideoStarted(true);
    }

    // If near end (e.g. within 0.3s of duration), trigger fade out
    if (video.duration && video.currentTime >= video.duration - 0.3) {
      startFadeOut();
    }
  };

  const handlePlaying = () => {
    const video = videoRef.current;
    if (video) {
      setVideoStarted(true);
      try {
        // Safe standard 2x rate on Apple WebKit / iOS
        video.playbackRate = 2.0;
      } catch {
        // Fallback silently if browser restricts rate change
      }
    }
  };

  const handleVideoEnded = () => {
    startFadeOut();
  };

  const handleVideoError = () => {
    setShowAmbientFallback(true);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      id="sain-site-preloader"
      onClick={startFadeOut}
      className={`fixed inset-0 z-[9999999] bg-black flex flex-col items-center justify-center transition-opacity duration-700 ease-out select-none cursor-pointer will-change-opacity transform-gpu ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      style={{
        backgroundColor: '#000000',
        WebkitBackfaceVisibility: 'hidden',
        WebkitTransform: 'translateZ(0)',
      }}
      aria-label="Loading SAIN Logistics..."
      role="status"
    >
      {/* Main Brand Stage (Pure seamless black) */}
      <div className="relative w-full max-w-[340px] sm:max-w-[420px] px-6 flex flex-col items-center justify-center transform-gpu">
        {/* Brand Video Player */}
        <video
          ref={videoRef}
          src="/videos/pre-loader-logo.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          onPlaying={handlePlaying}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          onError={handleVideoError}
          className={`w-full h-auto object-contain pointer-events-none select-none transition-opacity duration-300 ${videoStarted && !showAmbientFallback ? 'opacity-100' : 'opacity-0'
            }`}
          style={{ WebkitTransform: 'translateZ(0)', backgroundColor: '#000000' }}
        />

        {/* Hybrid Ambient Mode Fallback Layer (shows only if video is delayed/blocked by iOS) */}
        {(!videoStarted || showAmbientFallback) && (
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${showAmbientFallback || !videoStarted ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
          >
            <div className="transform scale-110 sm:scale-125">
              <SainLogo variant="white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
