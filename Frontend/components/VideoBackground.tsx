import React, { useState, useEffect } from 'react';
import { useScrollVideo } from '../hooks/useScrollVideo';
import { Film, Play, Pause, Volume2, VolumeX, Sliders, Upload, Check, Info } from 'lucide-react';

interface VideoBackgroundProps {
  defaultVideoSrc?: string;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  defaultVideoSrc = '/assets/videos/sain_logistics_bg.mp4',
}) => {
  const [videoSrc, setVideoSrc] = useState<string>(() => {
    return localStorage.getItem('sain_custom_video_url') || defaultVideoSrc;
  });
  const [controlsExpanded, setControlsExpanded] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const {
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
  } = useScrollVideo(6);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setVideoSrc(objectUrl);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3500);
    }
  };

  const resetToDefaultVideo = () => {
    localStorage.removeItem('sain_custom_video_url');
    setVideoSrc(defaultVideoSrc);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Video Element */}
      <video
        ref={videoRef as any}
        src={videoSrc}
        autoPlay
        playsInline
        muted={isMuted}
        loop={mode === 'ambient-loop'}
        onCanPlay={() => setIsReady(true)}
        className="absolute inset-0 w-full h-full object-cover object-center transform scale-105 transition-opacity duration-1000"
        style={{
          filter: 'brightness(0.35) contrast(1.15) saturate(1.2)',
        }}
      />

      {/* Cinematic Overlays to guarantee high-contrast readability */}
      {/* 1. Deep radial gradient for central legibility */}
      <div className="absolute inset-0 bg-radial from-slate-950/60 via-slate-950/85 to-slate-950" />

      {/* 2. Top and bottom gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-transparent to-slate-950/95" />

      {/* 3. Tech grid subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(rgba(245, 158, 11, 0.4) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

    </div>
  );
};
