import { useEffect, useRef, useState } from 'react';

export function useScrollVideo(videoDurationFallback = 6) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mode, setMode] = useState<'scroll-sync' | 'ambient-loop'>('scroll-sync');
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // Scroll sync logic
  useEffect(() => {
    if (mode !== 'scroll-sync') return;

    let animationFrameId: number;
    let targetTime = 0;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      setScrollProgress(progress);

      const video = videoRef.current;
      if (video && video.duration) {
        targetTime = progress * video.duration;
      } else {
        targetTime = progress * videoDurationFallback;
      }
    };

    const smoothVideoUpdate = () => {
      const video = videoRef.current;
      if (video && !isNaN(video.duration) && video.duration > 0) {
        // Smoothly interpolate towards target time
        const diff = targetTime - video.currentTime;
        if (Math.abs(diff) > 0.05) {
          video.currentTime += diff * 0.2;
        }
      }
      animationFrameId = requestAnimationFrame(smoothVideoUpdate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    animationFrameId = requestAnimationFrame(smoothVideoUpdate);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode, videoDurationFallback]);

  return {
    videoRef,
    isReady,
    setIsReady,
    scrollProgress,
    mode,
    setMode,
    isMuted,
    setIsMuted,
    isPlaying,
    setIsPlaying,
  };
}
