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
        poster="/assets/images/hero_ship.webp"
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

      {/* Video Control Widget (interactive) */}
      <div className="fixed bottom-4 left-4 z-40 pointer-events-auto">
        <div className="glass-panel px-3 py-2 rounded-xl text-xs flex items-center gap-2 border border-slate-700/60 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-slate-300 font-medium hidden sm:inline">
              Motion Video:
            </span>
            <span className="text-amber-400 font-semibold uppercase text-[10px] tracking-wider">
              {mode === 'scroll-sync' ? `Scroll-Synced (${Math.round(scrollProgress * 100)}%)` : 'Ambient Loop'}
            </span>
          </div>

          <div className="h-4 w-[1px] bg-slate-700 mx-1" />

          {/* Mode Switcher */}
          <button
            onClick={() => setMode(mode === 'scroll-sync' ? 'ambient-loop' : 'scroll-sync')}
            title="Toggle between scroll sync motion and ambient video playback"
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium transition"
          >
            {mode === 'scroll-sync' ? 'Switch to Loop' : 'Switch to Scroll'}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Unmute video audio' : 'Mute video'}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded transition"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          {/* Upload Custom Video Toggle */}
          <label
            title="Upload your own custom background video file"
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded cursor-pointer transition flex items-center"
          >
            <Upload className="w-3.5 h-3.5" />
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {uploadSuccess && (
            <span className="text-emerald-400 font-medium text-[10px] flex items-center gap-1">
              <Check className="w-3 h-3" /> Loaded!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
