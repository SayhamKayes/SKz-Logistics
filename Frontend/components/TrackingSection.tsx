import React, { useState } from 'react';
import { useTracking } from '../Context/TrackingContext';
import { useHeroScrollVideo } from '../hooks/useHeroScrollVideo';
import {
  Search,
  Package,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const TrackingSection: React.FC = () => {
  const {
    searchConsignment,
    openTrackingModal,
    isLoading,
    allConsignments,
    activeTab,
  } = useTracking();

  const isAnimated = activeTab === 'home';

  // Video scroll-scrubber for tracking section background (trackingbg.mp4 is 10.0s)
  const {
    containerRef,
    videoRef,
    scrollProgress,
    handleLoadedMetadata,
    handleSeeked,
  } = useHeroScrollVideo({
    videoSrc: '/videos/trackingbg.mp4',
    smoothing: 0.16,
  });

  const [inputVal, setInputVal] = useState('');
  const [errorText, setErrorText] = useState('');

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

  // Helper to map progress range [start, end] to [0, 1] for silky-smooth interpolation
  const interpolate = (val: number, start: number, end: number) => {
    if (val <= start) return 0;
    if (val >= end) return 1;
    return (val - start) / (end - start);
  };

  // Progress phases:
  // 1. Heading floats in from top between 0.20 and 0.45
  const headerPhase = isAnimated ? interpolate(scrollProgress, 0.20, 0.45) : 1;
  // 2. Tracking card floats up from bottom between 0.45 and 0.70
  const cardPhase = isAnimated ? interpolate(scrollProgress, 0.45, 0.70) : 1;
  // 3. Background turns pure white as video completes between 0.78 and 0.94
  const whitePhase = isAnimated ? interpolate(scrollProgress, 0.78, 0.94) : 0;

  return (
    <section
      ref={containerRef}
      id="track"
      className={`relative w-full z-20 ${isAnimated ? 'h-[250vh]' : 'py-20 px-4 sm:px-8'}`}
    >
      {/* Viewport pinned during video scroll on Home page (slides over hero cleanly) */}
      <div
        className={`${
          isAnimated
            ? 'sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center px-4 sm:px-8'
            : 'relative'
        }`}
      >
        {/* Background Video with hardware acceleration */}
        <div className="absolute inset-0 select-none pointer-events-none overflow-hidden">
          <video
            ref={videoRef}
            src="/videos/trackingbg.mp4"
            preload="auto"
            muted
            playsInline
            disablePictureInPicture
            onLoadedMetadata={handleLoadedMetadata}
            onSeeked={handleSeeked}
            className="w-full h-full object-cover object-center transform scale-105"
            style={{
              willChange: 'transform',
              transform: 'translateZ(0)',
              filter: 'brightness(0.92) contrast(1.05) saturate(1.15)',
            }}
          />

          {/* Subtle Dark Vignette & Gradient Overlays - ensuring video is 100% visible with a sleek dark aesthetic */}
          <div className="absolute inset-0 bg-slate-950/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/50" />
          <div className="absolute inset-0 bg-radial from-transparent via-slate-950/15 to-slate-950/50" />

          {/* Smooth Fade-to-White Layer when video finishes */}
          <div
            className="absolute inset-0 bg-white transition-opacity duration-200"
            style={{ opacity: whitePhase }}
          />
        </div>

        {/* Foreground Content */}
        <div className="max-w-5xl w-full mx-auto relative z-10 py-6">
          {/* Section Heading: Floats from top smoothly */}
          <div
            className="text-center mb-6 sm:mb-8 space-y-3 transition-transform duration-100 ease-out"
            style={{
              opacity: headerPhase,
              transform: `translateY(${(1 - headerPhase) * -35}px)`,
              pointerEvents: headerPhase > 0.5 ? 'auto' : 'none',
            }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-sm transition-colors duration-200"
              style={{
                backgroundColor: whitePhase > 0.5 ? '#f0fdfa' : 'rgba(15, 23, 42, 0.8)',
                borderColor: whitePhase > 0.5 ? '#99f6e4' : 'rgba(20, 184, 166, 0.4)',
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
                textShadow: whitePhase > 0.5 ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              Track Your Shipment <span className="text-amber-500">Anytime, Anywhere</span>
            </h2>

            <p
              className="max-w-2xl mx-auto text-sm sm:text-base leading-relaxed transition-colors duration-200"
              style={{
                color: whitePhase > 0.5 ? '#475569' : '#e2e8f0',
              }}
            >
              Experience stress-free global freight visibility. Monitor air, sea, and courier shipments directly from Guangzhou and international hubs to your doorstep in Bangladesh.
            </p>
          </div>

          {/* Tracking Card: Floats UP from the bottom smoothly */}
          <div
            className="bg-white/95 sm:bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xl relative overflow-hidden backdrop-blur-xl transition-transform duration-100 ease-out"
            style={{
              opacity: cardPhase,
              transform: `translateY(${(1 - cardPhase) * 50}px)`,
              pointerEvents: cardPhase > 0.5 ? 'auto' : 'none',
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
                    placeholder="Enter Consignment No. Ex: SAINEX067638406"
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

              {/* Compliance Badge without demo quick examples */}
              <div className="pt-1 flex items-center justify-end text-xs text-slate-500">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Compliant with Bangladesh Customs Act 2023</span>
                </div>
              </div>
            </form>

            {/* Active Consignments Highlights */}
            <div className="mt-6 pt-6 border-t border-slate-200/80 relative z-10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Recently Updated Freight Shipments
              </h3>

              {(() => {
                let trashed: Record<string, any> = {};
                try {
                  trashed = JSON.parse(localStorage.getItem('sain_trashed_consignments') || '{}');
                } catch {}

                const recentList = Object.values(allConsignments)
                  .filter((c) => c && c.consignmentNo && !['12345', 'SAIN-78492-BD', 'SAIN-SEA-99120', 'SAIN-HC-5501'].includes(c.consignmentNo))
                  .filter((c) => !trashed[c.consignmentNo])
                  .slice(0, 3);

                if (recentList.length === 0) {
                  return (
                    <div className="py-6 px-4 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                      <p className="text-xs text-slate-500 font-medium">
                        No recent freight shipments currently registered. Track using your Consignment No. above.
                      </p>
                    </div>
                  );
                }

                return (
                  <div
                    className={`grid gap-3 ${
                      recentList.length === 1
                        ? 'grid-cols-1 max-w-sm'
                        : recentList.length === 2
                          ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl'
                          : 'grid-cols-1 md:grid-cols-3'
                    }`}
                  >
                    {recentList.map((item) => (
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
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              item.status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.status?.toLowerCase().includes('out for delivery')
                                  ? 'bg-amber-100 text-amber-800'
                                  : item.status === 'On Hold by Customs'
                                    ? 'bg-orange-100 text-orange-800'
                                    : item.status === 'At Bangladesh warehouse'
                                      ? 'bg-teal-100 text-teal-800'
                                      : item.status === 'Cancelled' || item.status === 'Returned'
                                        ? 'bg-rose-100 text-rose-800'
                                        : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-700 mb-2">
                          <div className="font-semibold">{item.origin?.city || 'Origin'}</div>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <div className="font-semibold text-emerald-700">{item.destination?.city || 'Bangladesh'}</div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>{item.cargoDetails?.weight || 'Verified Cargo'}</span>
                          <span className="text-[#1a6c7a] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                            <span>View</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
