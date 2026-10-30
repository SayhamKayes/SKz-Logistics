import { useEffect, useRef, useState, useCallback } from 'react';

interface UseHeroScrollVideoOptions {
  videoSrc?: string;
  smoothing?: number; // 0.12 to 0.20 for responsive, buttery smooth progress
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
  const rafIdRef = useRef<number | null>(null);

  // Metadata loaded callback - video is strictly paused, initialized to 0.01s frame
  const handleLoadedMetadata = useCallback(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.pause();
      vid.currentTime = 0.01;
      setIsReady(true);
    }
  }, []);

  // Seek completed listener
  const handleSeeked = useCallback(() => {
    isSeekingRef.current = false;
  }, []);

  // Check initial video ready state on mount (strictly paused, no autoplay)
  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.pause();
      vid.defaultMuted = true;
      vid.muted = true;
      if (vid.readyState >= 1) {
        vid.currentTime = 0.01;
        setIsReady(true);
      }
    }
  }, []);

  // Passive scroll & resize listener to track progress across container
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

  // RequestAnimationFrame loop with LERP for ultra-smooth 60fps scroll scrubbing
  useEffect(() => {
    let lastProgressReportTime = 0;
    let lastSeekTimestamp = 0;

    const tick = (timestamp: number) => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      // Smooth interpolation towards target
      if (Math.abs(diff) > 0.0003) {
        currentProgressRef.current += diff * smoothing;
      } else {
        currentProgressRef.current = target;
      }

      const activeProgress = currentProgressRef.current;

      // Throttled state update for React components (~60fps)
      if (timestamp - lastProgressReportTime > 16) {
        setScrollProgress(activeProgress);
        lastProgressReportTime = timestamp;
      }

      // Safety watchdog: reset seeking flag if browser didn't emit 'seeked' within 60ms
      if (isSeekingRef.current && timestamp - lastSeekTimestamp > 60) {
        isSeekingRef.current = false;
      }

      // Scroll-driven video seek: strictly proportional to scroll, zero autoplay
      const vid = videoRef.current;
      if (vid && vid.readyState >= 2) {
        const duration = vid.duration && !isNaN(vid.duration) && vid.duration > 0 ? vid.duration : 8.0;
        const targetTime = Math.min(Math.max(activeProgress * duration, 0.01), duration - 0.05);
        const timeDiff = Math.abs(vid.currentTime - targetTime);

        // Seek frame-by-frame when difference is > 30ms and browser decoder is not busy
        if (timeDiff > 0.03 && !vid.seeking && !isSeekingRef.current && (timestamp - lastSeekTimestamp > 32)) {
          isSeekingRef.current = true;
          lastSeekTimestamp = timestamp;

          if ('fastSeek' in vid && typeof (vid as any).fastSeek === 'function') {
            (vid as any).fastSeek(targetTime);
          } else {
            vid.currentTime = targetTime;
          }
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
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
