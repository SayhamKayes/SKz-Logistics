import React, { useState, useEffect } from 'react';
import { useTracking } from '../Context/TrackingContext';
import { sanitizeRichHtml } from '../utils/sanitizeHtml';
import { Search, ArrowRight } from 'lucide-react';

export interface ReadyToShipConfig {
  tagline: string;
  heading?: string;
  description: string;
  contactBtnText: string;
  contactBtnLink: string;
  trackBtnText: string;
}

export const DEFAULT_READY_TO_SHIP_CONFIG: ReadyToShipConfig = {
  tagline: "Ready To Ship? Let's Get Your Packages Moving!",
  description: 'Start shipping with us today and experience convenience at every step! Transparent rates, zero hidden surcharges, and direct doorstep delivery across Bangladesh.',
  contactBtnText: 'Contact',
  contactBtnLink: '#contact',
  trackBtnText: 'Track Existing Shipment',
};

const getStoredConfig = (): ReadyToShipConfig => {
  try {
    // 1. Check Contact Content Config (Admin Portal Section 5)
    const storedContact = localStorage.getItem('sain_contact_content_config');
    if (storedContact) {
      const parsed = JSON.parse(storedContact);
      if (parsed.ctaTagline !== undefined || parsed.ctaHeading !== undefined || parsed.ctaDescription !== undefined) {
        return {
          tagline: parsed.ctaTagline ?? DEFAULT_READY_TO_SHIP_CONFIG.tagline,
          heading: parsed.ctaHeading ?? DEFAULT_READY_TO_SHIP_CONFIG.heading,
          description: parsed.ctaDescription ?? DEFAULT_READY_TO_SHIP_CONFIG.description,
          contactBtnText: parsed.ctaContactBtnText ?? DEFAULT_READY_TO_SHIP_CONFIG.contactBtnText,
          contactBtnLink: parsed.ctaContactBtnLink ?? DEFAULT_READY_TO_SHIP_CONFIG.contactBtnLink,
          trackBtnText: parsed.ctaTrackBtnText ?? DEFAULT_READY_TO_SHIP_CONFIG.trackBtnText,
        };
      }
    }

    // 2. Check dedicated config if exists
    const storedReady = localStorage.getItem('sain_ready_to_ship_config');
    if (storedReady) {
      return { ...DEFAULT_READY_TO_SHIP_CONFIG, ...JSON.parse(storedReady) };
    }

    // 3. Fallback to About config legacy fields
    const storedAbout = localStorage.getItem('sain_about_content_config');
    if (storedAbout) {
      const parsedAbout = JSON.parse(storedAbout);
      return {
        ...DEFAULT_READY_TO_SHIP_CONFIG,
        tagline: parsedAbout.ctaTagline || DEFAULT_READY_TO_SHIP_CONFIG.tagline,
        heading: parsedAbout.ctaHeading || DEFAULT_READY_TO_SHIP_CONFIG.heading,
        description: parsedAbout.ctaDesc || DEFAULT_READY_TO_SHIP_CONFIG.description,
      };
    }
  } catch { }
  return DEFAULT_READY_TO_SHIP_CONFIG;
};

export const ReadyToShipSection: React.FC = () => {
  const { openTrackingModal, setActiveTab } = useTracking();
  const [config, setConfig] = useState<ReadyToShipConfig>(getStoredConfig);

  useEffect(() => {
    const handleUpdate = () => {
      setConfig(getStoredConfig());
    };

    window.addEventListener('sain_contact_content_updated', handleUpdate);
    window.addEventListener('sain_ready_to_ship_updated', handleUpdate);
    window.addEventListener('sain_about_content_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('sain_contact_content_updated', handleUpdate);
      window.removeEventListener('sain_ready_to_ship_updated', handleUpdate);
      window.removeEventListener('sain_about_content_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleContactClick = () => {
    const link = config.contactBtnLink?.trim() || '#contact';
    if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank', 'noopener,noreferrer');
      return;
    }
    if (link.startsWith('tel:') || link.startsWith('mailto:')) {
      window.location.href = link;
      return;
    }

    setActiveTab('home');
    setTimeout(() => {
      const targetId = link.replace('#', '') || 'contact';
      const contactElem = document.getElementById(targetId);
      if (contactElem) {
        contactElem.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = targetId ? `#${targetId}` : '#contact';
      }
    }, 50);
  };

  return (
    <section
      id="ready-to-ship"
      className="relative w-full overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed py-24 sm:py-36 px-4 sm:px-8 text-white select-none z-10"
      style={{
        backgroundImage: "url('/assets/images/ready_to_ship_bg.jpg')",
      }}
    >
      {/* Light Maritime Vignette Overlay - Keeps the container ship and heart wake bright, vivid & clearly visible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(10, 30, 44, 0.35) 0%, rgba(6, 18, 28, 0.52) 100%)',
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
        {/* Sub-tagline / Eyebrow Header */}
        <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold italic tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-brand">
          {config.tagline}
        </h3>

        {/* Rich Description */}
        <div
          className="text-slate-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] rich-text-content"
          dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(config.description) }}
        />

        {/* Action Buttons: Contact (Outline with border-radius) & Track Existing Shipment (Matching Track Item button) */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {/* 1. Contact Button (Rounded, refined outline matching site style) */}
          <button
            type="button"
            onClick={handleContactClick}
            className="px-8 py-3.5 sm:px-10 sm:py-4 border-2 border-white/80 hover:border-white text-white hover:bg-white hover:text-[#153243] font-bold text-sm tracking-wider uppercase rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer active:scale-95 flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            <span>{config.contactBtnText || 'Contact'}</span>
          </button>

          {/* 2. Track Existing Shipment Button (Matching the Header Track Item button style & brand color) */}
          <button
            type="button"
            onClick={() => openTrackingModal()}
            className="relative group overflow-hidden px-8 py-3.5 sm:px-10 sm:py-4 bg-[#153243] hover:bg-[#1a365d] text-white font-bold text-sm tracking-wider uppercase rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer border border-white/10"
          >
            <Search className="w-4 h-4 text-[#FFB900] font-extrabold stroke-[2.5]" />
            <span>{config.trackBtnText || 'Track Existing Shipment'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
