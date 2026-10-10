import { useEffect, useRef, useState, useCallback } from 'react';

interface UseHeroScrollVideoOptions {
  videoSrc?: string;
  smoothing?: number; // 0.12 to 0.20 for responsive, buttery smooth scrubbing
}

export function useHeroScrollVideo({
  videoSrc = '/videos/hero.mp4',
  smoothing = 0.16,
}: UseHeroScrollVideoOptions = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // High performance refs for animation loop
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const isSeekingRef = useRef(false);
  const seekTimeoutRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Metadata loaded callback
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      setIsReady(true);
    }
  }, []);

  // Seek completed listener
  const handleSeeked = useCallback(() => {
    isSeekingRef.current = false;
    if (seekTimeoutRef.current) {
      window.clearTimeout(seekTimeoutRef.current);
      seekTimeoutRef.current = null;
    }
  }, []);

  // Check initial video ready state on mount
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (video.readyState >= 1) {
        video.pause();
        setIsReady(true);
      }
      const onSeeked = () => {
        isSeekingRef.current = false;
        if (seekTimeoutRef.current) {
          window.clearTimeout(seekTimeoutRef.current);
          seekTimeoutRef.current = null;
        }
      };
      video.addEventListener('seeked', onSeeked);
      return () => {
        video.removeEventListener('seeked', onSeeked);
      };
    }
  }, []);

  // Passive scroll & resize listener to track progress across hero container
  useEffect(() => {
    const calculateProgress = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollableDistance = container.offsetHeight - window.innerHeight;

      if (scrollableDistance <= 0) {
        targetProgressRef.current = 0;
        return;
      }

      // 0.0 at top of hero, 1.0 when scrolled through hero
      const rawProgress = -rect.top / scrollableDistance;
      const clamped = Math.min(Math.max(rawProgress, 0), 1);
      targetProgressRef.current = clamped;
    };

    window.addEventListener('scroll', calculateProgress, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });
    calculateProgress();

    return () => {
      window.removeEventListener('scroll', calculateProgress);
      window.removeEventListener('resize', calculateProgress);
    };
  }, []);

  // RequestAnimationFrame loop with LERP for ultra-smooth forward & backward scrubbing
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
    }

    let lastProgressReportTime = 0;

    const tick = (timestamp: number) => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      // Smooth interpolation towards target (forward or backward)
      if (Math.abs(diff) > 0.0005) {
        currentProgressRef.current += diff * smoothing;
      } else {
        currentProgressRef.current = target;
      }

      const activeProgress = currentProgressRef.current;

      // Throttled state update for external components
      if (timestamp - lastProgressReportTime > 25) {
        setScrollProgress(activeProgress);
        lastProgressReportTime = timestamp;
      }

      const vid = videoRef.current;
      if (vid) {
        // Full duration range: native video.duration or 8.0s
        const duration = (vid.duration && !isNaN(vid.duration) && vid.duration > 0) ? vid.duration : 8.0;
        const targetTime = activeProgress * duration;
        const timeDiff = Math.abs(vid.currentTime - targetTime);

        // Seek frame-by-frame when decoder is ready and diff is > 20ms
        if (!isSeekingRef.current && timeDiff > 0.02) {
          isSeekingRef.current = true;
          const clampedTime = Math.min(Math.max(targetTime, 0), Math.max(duration - 0.02, 0.05));
          
          if ('fastSeek' in vid && typeof (vid as any).fastSeek === 'function') {
            (vid as any).fastSeek(clampedTime);
          } else {
            vid.currentTime = clampedTime;
          }

          // Safety timeout in case browser skips 'seeked' event
          if (seekTimeoutRef.current) {
            window.clearTimeout(seekTimeoutRef.current);
          }
          seekTimeoutRef.current = window.setTimeout(() => {
            isSeekingRef.current = false;
          }, 35);
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (seekTimeoutRef.current) {
        window.clearTimeout(seekTimeoutRef.current);
      }
    };
  }, [smoothing]);

  return {
    containerRef,
    videoRef,
    isReady,
    scrollProgress,
    handleLoadedMetadata,
    handleSeeked,
  };
}
