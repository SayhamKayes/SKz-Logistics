import React, { useState, useEffect } from 'react';
import { Navigation, ExternalLink } from 'lucide-react';
import { DEFAULT_CONTACT_CONFIG, ContactConfig } from './admin/ContactContentEditor';

export const GoogleMapSection: React.FC = () => {
  const [config, setConfig] = useState<ContactConfig>(() => {
    try {
      const stored = localStorage.getItem('sain_contact_content_config');
      if (stored) return { ...DEFAULT_CONTACT_CONFIG, ...JSON.parse(stored) };
    } catch {}
    return DEFAULT_CONTACT_CONFIG;
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const stored = localStorage.getItem('sain_contact_content_config');
        if (stored) setConfig({ ...DEFAULT_CONTACT_CONFIG, ...JSON.parse(stored) });
      } catch {}
    };
    window.addEventListener('sain_contact_content_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('sain_contact_content_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const locationTitle = config.mapLocationTitle || DEFAULT_CONTACT_CONFIG.mapLocationTitle;
  const locationAddress = config.mapAddress || DEFAULT_CONTACT_CONFIG.mapAddress;

  // Build map URL if no custom URL is provided
  const embedUrl =
    config.mapEmbedUrl ||
    `https://maps.google.com/maps?q=${encodeURIComponent(
      `${locationTitle}, ${locationAddress}`
    )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${locationTitle}, ${locationAddress}`
  )}`;

  return (
    <section className="relative w-full bg-white p-0 m-0">
      {/* Full-Width Edge-to-Edge Map Container (Flush against Footer) */}
      <div className="relative w-full h-[480px] sm:h-[540px] md:h-[600px] overflow-hidden border-t border-slate-200 bg-slate-100 block">
        {/* Google Maps iFrame */}
        <iframe
          title="SAIN International Logistics Google Maps Location"
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full block grayscale-[0.15] contrast-[1.05]"
        />

        {/* Floating Location Card on Top-Left */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10 max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xl space-y-2 pointer-events-auto select-none">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-bold text-sm sm:text-base text-[#0f172a] leading-tight">
                {locationTitle}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {locationAddress}
              </p>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Verified Headquarters
              </span>
            </div>

            <div className="flex items-center gap-1">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View directions on Google Maps"
                className="p-1.5 text-slate-500 hover:text-[#153243] hover:bg-slate-100 rounded-lg transition"
              >
                <Navigation className="w-4 h-4 text-[#153243]" />
              </a>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Open for Inquiries</span>
            </span>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#153243] font-bold hover:text-amber-600 flex items-center gap-1 transition"
            >
              <span>Directions</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
