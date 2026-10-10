import React, { useEffect } from 'react';
import { useHeroScrollVideo } from '../hooks/useHeroScrollVideo';
import { useTracking } from '../Context/TrackingContext';
import { ShieldCheck, MapPin, Star } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setHeaderVisible } = useTracking();

  // High-performance video scroll-scrubber running purely in the background
  const {
    containerRef,
    videoRef,
    scrollProgress,
    handleLoadedMetadata,
    handleSeeked,
  } = useHeroScrollVideo({
    videoSrc: '/videos/hero.mp4',
    smoothing: 0.16,
  });

  // Controls the header floating down near the end of the hero section
  useEffect(() => {
    if (scrollProgress >= 0.75) {
      setHeaderVisible(true);
    } else {
      setHeaderVisible(false);
    }
  }, [scrollProgress, setHeaderVisible]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[180vh]"
      id="hero-scroll-container"
    >
      {/* Sticky Fullscreen Viewport pinned during video scroll */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center px-4 sm:px-8">
        
        {/* Background Video with hardware acceleration */}
        <div className="absolute inset-0 select-none pointer-events-none overflow-hidden">
          <video
            ref={videoRef}
            src="/videos/hero.mp4"
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
          <div className="absolute inset-0 bg-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/50" />
          <div className="absolute inset-0 bg-radial from-transparent via-slate-950/15 to-slate-950/50" />
        </div>

        {/* Foreground Hero Content (The marked section: stays fixed in place while scrolling) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Heading and Subtext only (Appears around middle ~4s / progress >= 0.35) */}
            <div
              className={`lg:col-span-7 space-y-6 transition-all duration-700 ease-out transform ${
                scrollProgress >= 0.35
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 translate-y-10 pointer-events-none'
              }`}
            >
              {/* Main Headline exact from reference site */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-brand tracking-tight text-white leading-[1.12] drop-shadow-sm">
                Fast, reliable and affordable shipping solutions –{' '}
                <span className="text-amber-400">
                  deliver to your doorstep
                </span>
              </h1>

              {/* Subtext exact from reference site */}
              <p className="text-slate-200 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-normal drop-shadow-sm">
                At SAIN we understand the importance of timely deliveries. From urgent documents to bulky packages, we provide seamless shipping services tailored to your needs. Track your shipment anytime, anywhere and experience stress-free delivery.
              </p>
            </div>

            {/* Right Column: Hero Quick Highlights Card & Verified Review (Appears shortly after from right / progress >= 0.55) */}
            <div
              className={`lg:col-span-5 hidden lg:block space-y-4 transition-all duration-700 ease-out transform ${
                scrollProgress >= 0.55
                  ? 'opacity-100 translate-x-0 pointer-events-auto'
                  : 'opacity-0 translate-x-14 pointer-events-none'
              }`}
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
                  Full customs handling and professional delivery under Bangladesh Customs Act 2023 guidelines. Swift cargo handling and real-time status updates.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-slate-300">Uttara, Sector 11, Dhaka</span>
                  </span>
                  <span className="text-emerald-400 font-semibold">100% Insured</span>
                </div>
              </div>

              {/* Verified Testimonial Preview from reference site */}
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
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-300 text-xs italic leading-relaxed">
                  &ldquo;I recently utilized the services of SAIN International Logistics for an air freight shipment, and the experience was truly exemplary. From the very beginning, the team was incredibly transparent about the entire process.&rdquo;
                </p>
                <div className="mt-2 text-[11px] text-slate-400">
                  Air Freight Client • Guangzhou to Dhaka
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
