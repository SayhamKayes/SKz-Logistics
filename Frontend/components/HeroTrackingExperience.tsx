import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTracking } from '../Context/TrackingContext';
import { SainLogo } from '../assets/Logo';
import {
  ShieldCheck,
  MapPin,
  Star,
  Search,
  Package,
  ArrowRight,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

export const HeroTrackingExperience: React.FC = () => {
  const {
    setHeaderVisible,
    searchConsignment,
    openTrackingModal,
    isLoading,
    allConsignments,
  } = useTracking();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const trackingVideoRef = useRef<HTMLVideoElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);

  // Form states for tracking section
  const [inputVal, setInputVal] = useState('');
  const [errorText, setErrorText] = useState('');

  // High performance refs for animation loop
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const isHeroSeekingRef = useRef(false);
  const isTrackingSeekingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  // Video loaded handlers - ensures frame 0.01s is immediately visible without unwanted poster images
  const handleHeroLoaded = useCallback(() => {
    const vid = heroVideoRef.current;
    if (vid) {
      vid.pause();
      vid.currentTime = 0.01;
    }
  }, []);

  const handleTrackingLoaded = useCallback(() => {
    const vid = trackingVideoRef.current;
    if (vid) {
      vid.pause();
      vid.currentTime = 0.01;
    }
  }, []);

  const handleHeroSeeked = useCallback(() => {
    isHeroSeekingRef.current = false;
  }, []);

  const handleTrackingSeeked = useCallback(() => {
    isTrackingSeekingRef.current = false;
  }, []);

  // Tracking form submit handler
  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) {
      setErrorText('Please enter a valid consignment or AWB number.');
      return;
    }
    setErrorText('');
    try {
      await searchConsignment(inputVal);
      openTrackingModal(inputVal);
    } catch (err: any) {
      setErrorText(err?.message || 'Error locating consignment.');
    }
  };

  const handleQuickClick = (code: string) => {
    setInputVal(code);
    searchConsignment(code);
    openTrackingModal(code);
  };

  // Passive scroll & resize listener to track progress across the unified container
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

      // 0.0 at top of hero, 1.0 when scrolled through the full container
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

  // RequestAnimationFrame loop with LERP for smooth forward & backward scrubbing of both videos
  useEffect(() => {
    const heroVid = heroVideoRef.current;
    const trackingVid = trackingVideoRef.current;

    if (heroVid) {
      heroVid.pause();
      heroVid.currentTime = 0.01;
    }
    if (trackingVid) {
      trackingVid.pause();
      trackingVid.currentTime = 0.01;
    }

    let lastStateUpdate = 0;

    const tick = (timestamp: number) => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      // Smooth interpolation towards target with 0.16 smoothing factor
      if (Math.abs(diff) > 0.0003) {
        currentProgressRef.current += diff * 0.16;
      } else {
        currentProgressRef.current = target;
      }

      const activeProgress = currentProgressRef.current;

      // Throttle React state update to ~40fps / 25ms to keep UI super smooth without thrashing
      if (timestamp - lastStateUpdate > 25) {
        setScrollProgress(activeProgress);
        lastStateUpdate = timestamp;
      }

      // Scrub Hero Video: from progress 0.05 to 0.28
      if (heroVid) {
        const heroDuration =
          heroVid.duration && !isNaN(heroVid.duration) && heroVid.duration > 0
            ? heroVid.duration
            : 8.0;

        let heroTargetTime = 0.01;
        if (activeProgress <= 0.05) {
          heroTargetTime = 0.01;
        } else if (activeProgress <= 0.28) {
          heroTargetTime = ((activeProgress - 0.05) / (0.28 - 0.05)) * heroDuration;
        } else {
          heroTargetTime = heroDuration;
        }
        heroTargetTime = Math.min(
          Math.max(heroTargetTime, 0.01),
          Math.max(heroDuration - 0.02, 0.05)
        );

        const heroDiff = Math.abs(heroVid.currentTime - heroTargetTime);
        if (!isHeroSeekingRef.current && heroDiff > 0.03) {
          isHeroSeekingRef.current = true;
          heroVid.currentTime = heroTargetTime;
        }
      }

      // Scrub Tracking Video: from progress 0.52 to 0.70
      if (trackingVid) {
        const trackingDuration =
          trackingVid.duration && !isNaN(trackingVid.duration) && trackingVid.duration > 0
            ? trackingVid.duration
            : 10.0;

        let trackingTargetTime = 0.01;
        if (activeProgress < 0.52) {
          trackingTargetTime = 0.01;
        } else if (activeProgress <= 0.70) {
          trackingTargetTime =
            ((activeProgress - 0.52) / (0.70 - 0.52)) * trackingDuration;
        } else {
          trackingTargetTime = trackingDuration;
        }
        trackingTargetTime = Math.min(
          Math.max(trackingTargetTime, 0.01),
          Math.max(trackingDuration - 0.02, 0.05)
        );

        const trackingDiff = Math.abs(trackingVid.currentTime - trackingTargetTime);
        if (!isTrackingSeekingRef.current && trackingDiff > 0.03) {
          isTrackingSeekingRef.current = true;
          trackingVid.currentTime = trackingTargetTime;
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // Helper to map progress range [start, end] to [0, 1]
  const interpolate = (val: number, start: number, end: number) => {
    if (val <= start) return 0;
    if (val >= end) return 1;
    return (val - start) / (end - start);
  };

  // Timeline Phase Calculations:
  // Phase 1: Welcome Popup (0.00 -> 0.06)
  // Floats up on initial load over the initial ocean video (Image 3), then fades away as scroll begins
  const welcomePhase = 1 - interpolate(scrollProgress, 0.00, 0.06);

  // Phase 2: Hero Section Reveal (0.06 -> 0.28)
  const heroTextPhase = interpolate(scrollProgress, 0.08, 0.20);
  const heroCardsPhase = interpolate(scrollProgress, 0.16, 0.26);

  // Navbar drops down at progress >= 0.20
  useEffect(() => {
    if (scrollProgress >= 0.20) {
      setHeaderVisible(true);
    } else {
      setHeaderVisible(false);
    }
  }, [scrollProgress, setHeaderVisible]);

  // Phase 3: HERO SECTION HOLD / DELAY (0.28 -> 0.44)
  // A dedicated ~100vh scroll plateau ("২ সেকেন্ডের মতো হোল্ড") where Hero Section (Image 1)
  // remains completely static and visible so the user can comfortably view and read the information.

  // Phase 4: Slide Takeover Transition (0.44 -> 0.52)
  // Directly after Hero Hold, Tracking Section slides in directly from translateY(100%) to translateY(0%)
  // completely blocking the screen like a presentation slide.
  const slidePhase = interpolate(scrollProgress, 0.44, 0.52);

  // Phase 5: Tracking Section animations & reveal (0.52 -> 0.72)
  // Heading floats down from top (0.54 -> 0.63)
  const trackingHeaderPhase = interpolate(scrollProgress, 0.54, 0.63);
  // Tracking Card floats up from bottom (0.62 -> 0.71)
  const trackingCardPhase = interpolate(scrollProgress, 0.62, 0.71);
  // Fade to pure white as tracking video ends (0.69 -> 0.76)
  const whitePhase = interpolate(scrollProgress, 0.69, 0.76);

  // Phase 6: TRACKING SECTION HOLD / DELAY (0.76 -> 0.94)
  // A dedicated ~108vh scroll plateau ("২ সেকেন্ডের মতো হোল্ড") on pure white background (Image 2)
  // where the tracking tool remains pinned and fully held so the user can comfortably enter consignment
  // numbers, inspect recent shipments, or read without it abruptly scrolling away!

  return (
    <section
      ref={containerRef}
      id="hero-scroll-container"
      className="relative w-full h-[700vh]"
    >
      {/* Sticky Fullscreen Viewport pinned during the entire journey */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ========================================================= */}
        {/* LAYER 1: HERO SECTION (z-10)                              */}
        {/* ========================================================= */}
        <div
          className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-8 select-none transition-transform duration-75 ease-out"
          style={{
            transform: `translateY(${-slidePhase * 12}%)`,
            opacity: 1 - slidePhase * 0.8,
            pointerEvents: slidePhase > 0.6 ? 'none' : 'auto',
          }}
        >
          {/* Hero Background Video - purely showing the video frame 0.0s (Image 3) without any poster */}
          <div className="absolute inset-0 select-none pointer-events-none overflow-hidden bg-slate-950">
            <video
              ref={heroVideoRef}
              src="/videos/hero.mp4"
              preload="auto"
              muted
              playsInline
              disablePictureInPicture
              onLoadedMetadata={handleHeroLoaded}
              onSeeked={handleHeroSeeked}
              className="w-full h-full object-cover object-center transform scale-105"
              style={{
                willChange: 'transform',
                transform: 'translateZ(0)',
                filter: 'brightness(0.92) contrast(1.05) saturate(1.15)',
              }}
            />
            {/* Dark Vignette & Gradient Overlays */}
            <div className="absolute inset-0 bg-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/50" />
            <div className="absolute inset-0 bg-radial from-transparent via-slate-950/15 to-slate-950/50" />
          </div>

          {/* Welcome Intro on Initial Load (Image 3: No box container, purely white logo and text) */}
          <div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 pointer-events-none transition-all duration-300 ease-out"
            style={{
              opacity: welcomePhase,
              transform: `translateY(${(1 - welcomePhase) * -40}px)`,
              display: welcomePhase <= 0.01 ? 'none' : 'flex',
            }}
          >
            <div className="flex flex-col items-center text-center space-y-4 max-w-2xl pointer-events-auto">
              <span className="text-lg sm:text-xl font-extrabold tracking-[0.3em] uppercase text-[#FE9A00] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                WELCOME TO
              </span>

              <div className="py-2">
                <img
                  src="/assets/images/SAIN_logo_white.png"
                  alt="SAIN International Logistics"
                  className="h-14 sm:h-20 md:h-24 w-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
                />
              </div>

              <p className="text-slate-100 text-sm sm:text-base md:text-lg max-w-lg font-medium leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Your Trusted Global Freight &amp; Express Logistics Partner
              </p>

              {/* <div className="pt-3 flex flex-col items-center justify-center gap-2 text-slate-300 text-xs">
                <span className="font-bold text-amber-400 tracking-widest uppercase text-[11px] drop-shadow-md">
                  Scroll to Begin
                </span>
                <ChevronDown className="w-5 h-5 text-amber-400 animate-bounce drop-shadow-md" />
              </div> */}
            </div>
          </div>

          {/* Hero Foreground Content (Image 1) */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Heading & Subtext */}
              <div
                className="lg:col-span-7 space-y-6 transition-all duration-300 ease-out"
                style={{
                  opacity: heroTextPhase,
                  transform: `translateY(${(1 - heroTextPhase) * 35}px)`,
                  pointerEvents: heroTextPhase > 0.5 ? 'auto' : 'none',
                }}
              >
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-brand tracking-tight text-white leading-[1.12] drop-shadow-sm">
                  Fast, reliable and affordable shipping solutions –{' '}
                  <span className="text-amber-400">deliver to your doorstep</span>
                </h1>
                <p className="text-slate-200 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-normal drop-shadow-sm">
                  At SAIN we understand the importance of timely deliveries. From
                  urgent documents to bulky packages, we provide seamless shipping
                  services tailored to your needs. Track your shipment anytime,
                  anywhere and experience stress-free delivery.
                </p>
              </div>

              {/* Right Column: Hero Quick Highlights Card & Verified Review */}
              <div
                className="lg:col-span-5 hidden lg:block space-y-4 transition-all duration-300 ease-out"
                style={{
                  opacity: heroCardsPhase,
                  transform: `translateX(${(1 - heroCardsPhase) * 45}px)`,
                  pointerEvents: heroCardsPhase > 0.5 ? 'auto' : 'none',
                }}
              >
                <div className="bg-slate-900/85 p-6 rounded-3xl border border-slate-700/80 shadow-2xl relative backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-teal-950/80 text-teal-300 border border-teal-500/40">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                        Trusted Logistics Partner
                      </span>
                      <h3 className="text-base font-bold text-white font-brand">
                        Guangzhou to Dhaka Direct Route
                      </h3>
                    </div>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Full customs handling and professional delivery under Bangladesh
                    Customs Act 2023 guidelines. Swift cargo handling and real-time
                    status updates.
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-slate-300">Uttara, Sector 11, Dhaka</span>
                    </span>
                    <span className="text-emerald-400 font-semibold">100% Insured</span>
                  </div>
                </div>

                {/* Verified Testimonial Preview */}
                <div className="bg-slate-900/85 p-5 rounded-2xl border border-slate-700/80 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                        MS
                      </div>
                      <span className="font-bold text-white">MD SAKIB</span>
                    </div>
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-300 text-xs italic leading-relaxed">
                    &ldquo;I recently utilized the services of SAIN International
                    Logistics for an air freight shipment, and the experience was truly
                    exemplary. From the very beginning, the team was incredibly
                    transparent about the entire process.&rdquo;
                  </p>
                  <div className="mt-2 text-[11px] text-slate-400">
                    Air Freight Client • Guangzhou to Dhaka
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* LAYER 2: TRACKING SECTION SLIDE (z-20)                    */}
        {/* Slides up directly, completely blocking the screen        */}
        {/* ========================================================= */}
        <div
          id="track"
          className="absolute inset-0 z-20 flex flex-col justify-center items-center px-4 sm:px-8 shadow-2xl transition-transform duration-75 ease-out"
          style={{
            transform: `translateY(${(1 - slidePhase) * 100}%)`,
            pointerEvents: slidePhase > 0.5 ? 'auto' : 'none',
          }}
        >
          {/* Tracking Background Video - purely showing the video frame 0.0s without any poster */}
          <div className="absolute inset-0 select-none pointer-events-none overflow-hidden bg-slate-950">
            <video
              ref={trackingVideoRef}
              src="/videos/trackingbg.mp4"
              preload="auto"
              muted
              playsInline
              disablePictureInPicture
              onLoadedMetadata={handleTrackingLoaded}
              onSeeked={handleTrackingSeeked}
              className="w-full h-full object-cover object-center transform scale-105"
              style={{
                willChange: 'transform',
                transform: 'translateZ(0)',
                filter: 'brightness(0.92) contrast(1.05) saturate(1.15)',
              }}
            />

            {/* Dark Overlays */}
            <div className="absolute inset-0 bg-slate-950/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/50" />
            <div className="absolute inset-0 bg-radial from-transparent via-slate-950/15 to-slate-950/50" />

            {/* Smooth Fade-to-White Layer when video finishes */}
            <div
              className="absolute inset-0 bg-white transition-opacity duration-200"
              style={{ opacity: whitePhase }}
            />
          </div>

          {/* Foreground Tracking Content (Image 2) */}
          <div className="max-w-5xl w-full mx-auto relative z-10 py-6">
            {/* Section Heading: Floats in from top smoothly */}
            <div
              className="text-center mb-6 sm:mb-8 space-y-3 transition-all duration-200 ease-out"
              style={{
                opacity: trackingHeaderPhase,
                transform: `translateY(${(1 - trackingHeaderPhase) * -35}px)`,
                pointerEvents: trackingHeaderPhase > 0.5 ? 'auto' : 'none',
              }}
            >
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-sm transition-colors duration-200"
                style={{
                  backgroundColor:
                    whitePhase > 0.5 ? '#f0fdfa' : 'rgba(15, 23, 42, 0.8)',
                  borderColor:
                    whitePhase > 0.5 ? '#99f6e4' : 'rgba(20, 184, 166, 0.4)',
                  color: whitePhase > 0.5 ? '#1a6c7a' : '#5eead4',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                }}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Real-Time Consignment Tracker</span>
              </div>

              <h2
                className="text-3xl sm:text-5xl font-extrabold font-brand tracking-tight transition-colors duration-200"
                style={{
                  color: whitePhase > 0.5 ? '#0f172a' : '#ffffff',
                  textShadow:
                    whitePhase > 0.5 ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                Track Your Shipment{' '}
                <span className="text-amber-500">Anytime, Anywhere</span>
              </h2>

              <p
                className="max-w-2xl mx-auto text-sm sm:text-base leading-relaxed transition-colors duration-200"
                style={{
                  color: whitePhase > 0.5 ? '#475569' : '#e2e8f0',
                }}
              >
                Experience stress-free global freight visibility. Monitor air,
                sea, and courier shipments directly from Guangzhou and
                international hubs to your doorstep in Bangladesh.
              </p>
            </div>

            {/* Tracking Card: Floats UP from the bottom smoothly (Image 2) */}
            <div
              className="bg-white/95 sm:bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xl relative overflow-hidden backdrop-blur-xl transition-all duration-200 ease-out"
              style={{
                opacity: trackingCardPhase,
                transform: `translateY(${(1 - trackingCardPhase) * 60}px)`,
                pointerEvents: trackingCardPhase > 0.5 ? 'auto' : 'none',
              }}
            >
              <form onSubmit={handleTrackSubmit} className="relative z-10 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={inputVal}
                      onChange={(e) => {
                        setInputVal(e.target.value);
                        if (errorText) setErrorText('');
                      }}
                      placeholder="Enter Consignment No. Ex: SAINEX067638406 or 12345"
                      className="w-full bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-[#1a6c7a] focus:bg-white focus:ring-4 focus:ring-teal-500/10 rounded-2xl px-5 py-4 pl-12 text-slate-900 placeholder-slate-400 text-base sm:text-lg focus:outline-none transition font-mono shadow-inner"
                    />
                    <Search className="w-5 h-5 text-[#1a6c7a] absolute left-4.5 top-4.5" />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-4 bg-[#153243] hover:bg-[#1a6c7a] text-white font-black text-base uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <span>Track Item</span>
                        <ArrowRight className="w-5 h-5 font-bold text-amber-400" />
                      </>
                    )}
                  </button>
                </div>

                {errorText && (
                  <p className="text-red-500 text-xs font-semibold pl-2">
                    {errorText}
                  </p>
                )}

                {/* Quick click suggestions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-slate-600 font-medium">Quick Examples:</span>
                    {['12345', 'SAIN-78492-BD', 'SAIN-SEA-99120'].map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleQuickClick(code)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-[#1a6c7a] border border-slate-200 hover:border-teal-300 rounded-lg font-mono text-[11px] transition cursor-pointer text-slate-700"
                      >
                        {code}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Compliant with Bangladesh Customs Act 2023</span>
                  </div>
                </div>
              </form>

              {/* Active Preloaded Consignments Highlights */}
              <div className="mt-6 pt-6 border-t border-slate-200/80 relative z-10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                  <span>Recently Updated Freight Shipments</span>
                  <span className="text-[11px] text-amber-600 font-normal">
                    Click any card to inspect full waypoint log
                  </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Object.values(allConsignments)
                    .slice(0, 3)
                    .map((item) => (
                      <div
                        key={item.consignmentNo}
                        onClick={() => handleQuickClick(item.consignmentNo)}
                        className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-[#1a6c7a] p-3.5 rounded-2xl transition cursor-pointer group shadow-xs hover:shadow-md"
                      >
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
                          <span className="font-mono font-bold text-[#153243] text-sm group-hover:text-[#1a6c7a] transition">
                            {item.consignmentNo}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${item.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Out for Delivery'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                              }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-700 mb-2">
                          <div className="font-semibold">{item.origin.city}</div>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <div className="font-semibold text-emerald-700">
                            {item.destination.city}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>{item.cargoDetails.weight}</span>
                          <span className="text-[#1a6c7a] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                            <span>View</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
