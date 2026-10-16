import React, { useState, useEffect } from 'react';
import { useTracking } from '../Context/TrackingContext';
import { AboutConfig, DEFAULT_ABOUT_CONFIG } from './admin/AboutContentEditor';
import {
  Compass,
  Target,
  Award,
  ShieldCheck,
  Building,
  MapPin,
  TrendingUp,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { openTrackingModal } = useTracking();

  const [config, setConfig] = useState<AboutConfig>(() => {
    try {
      const stored = localStorage.getItem('sain_about_content_config');
      if (stored) return { ...DEFAULT_ABOUT_CONFIG, ...JSON.parse(stored) };
    } catch {}
    return DEFAULT_ABOUT_CONFIG;
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const stored = localStorage.getItem('sain_about_content_config');
        if (stored) setConfig({ ...DEFAULT_ABOUT_CONFIG, ...JSON.parse(stored) });
      } catch {}
    };
    window.addEventListener('sain_about_content_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('sain_about_content_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const hasImage = Boolean(config.image && config.image.trim().length > 0);

  return (
    <section id="about" className="relative py-24 px-4 sm:px-8 z-10 bg-white">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Top Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-[#1a6c7a] text-xs font-semibold tracking-wider uppercase">
            <Building className="w-3.5 h-3.5" />
            <span>{config.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-brand text-[#0f172a] tracking-tight">
            {(() => {
              const parts = config.heading.split(' ');
              if (parts.length > 1) {
                const last = parts.pop();
                return (
                  <>
                    {parts.join(' ')} <span className="text-amber-500">{last}</span>
                  </>
                );
              }
              return config.heading;
            })()}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            {config.description}
          </p>
        </div>

        {/* Narrative & Visual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Team & Depot Showcase Image (if present) */}
          {hasImage && (
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl relative group">
                <img
                  src={config.image}
                  alt={config.heading}
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/team_office.webp';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-md">
                  <div className="flex items-center gap-2 text-[#153243] font-bold text-xs uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>{config.imageOverlayTitle}</span>
                  </div>
                  <p className="text-slate-600 text-xs mt-1">
                    {config.imageOverlayDesc}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Right: Mission, Vision, Values */}
          <div className={`${hasImage ? 'lg:col-span-7' : 'lg:col-span-12 max-w-4xl mx-auto'} space-y-6 w-full`}>
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-brand text-[#0f172a]">
                  {config.missionTitle}
                </h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {config.missionText}
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-50 text-[#1a6c7a] rounded-xl border border-teal-200">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-brand text-[#0f172a]">
                  {config.visionTitle}
                </h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {config.visionText}
              </p>
            </div>

            {/* Core Values 3-column pill */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1 shadow-xs">
                <Award className="w-5 h-5 text-amber-500 mx-auto" />
                <h4 className="font-bold text-xs text-[#0f172a]">{config.value1Title}</h4>
                <p className="text-[11px] text-slate-500">{config.value1Desc}</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1 shadow-xs">
                <TrendingUp className="w-5 h-5 text-[#1a6c7a] mx-auto" />
                <h4 className="font-bold text-xs text-[#0f172a]">{config.value2Title}</h4>
                <p className="text-[11px] text-slate-500">{config.value2Desc}</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-xs text-[#0f172a]">{config.value3Title}</h4>
                <p className="text-[11px] text-slate-500">{config.value3Desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ready to Ship CTA Banner */}
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 bg-[#153243] text-white shadow-2xl">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-400">
              {config.ctaTagline}
            </span>
            <h3 className="text-2xl sm:text-4xl font-black font-brand text-white leading-tight">
              {config.ctaHeading}
            </h3>
            <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto">
              {config.ctaDesc}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => openTrackingModal()}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Track Existing Shipment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
