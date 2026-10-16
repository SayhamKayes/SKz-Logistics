import React, { useState, useEffect } from 'react';
import { useTracking } from '../Context/TrackingContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react';
import {
  FooterConfig,
  DEFAULT_FOOTER_CONFIG,
  FOOTER_STORAGE_KEY,
  FOOTER_UPDATE_EVENT,
} from './admin/FooterContentEditor';

export const Footer: React.FC = () => {
  const { setActiveTab } = useTracking();

  const [config, setConfig] = useState<FooterConfig>(() => {
    try {
      const stored = localStorage.getItem(FOOTER_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_FOOTER_CONFIG, ...JSON.parse(stored) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_FOOTER_CONFIG;
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const stored = localStorage.getItem(FOOTER_STORAGE_KEY);
        if (stored) {
          setConfig({ ...DEFAULT_FOOTER_CONFIG, ...JSON.parse(stored) });
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener(FOOTER_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(FOOTER_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleNav = (tab: 'home' | 'about' | 'services' | 'contact') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sanitizePhone = (ph: string) => ph.replace(/[^0-9+]/g, '');

  return (
    <footer className="relative bg-slate-950 border-t border-slate-800 text-slate-300 pt-16 pb-12 px-4 sm:px-8 z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand info (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            {config.brandLogoUrl && (
              <img
                src={config.brandLogoUrl}
                alt="SAIN International Logistics"
                className="h-6 sm:h-8 md:h-12 w-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
              />
            )}
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {config.brandDescription}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              {config.navHeading || 'Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  {config.navHomeLabel || 'Home'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  {config.navAboutLabel || 'About Us'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  {config.navServicesLabel || 'Freight Services'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  {config.navContactLabel || 'Contact Us'}
                </button>
              </li>
            </ul>
          </div>

          {/* Freight Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              {config.servicesHeading || 'Services'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {config.servicesList && config.servicesList.length > 0 ? (
                config.servicesList.map((service, idx) => (
                  <li key={idx} className="hover:text-slate-200 transition">
                    {service}
                  </li>
                ))
              ) : (
                <li>No services listed</li>
              )}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              {config.hqHeading || 'Headquarters'}
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              {config.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>{config.address}</span>
                </div>
              )}
              {config.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <a
                    href={`tel:${sanitizePhone(config.phone)}`}
                    className="hover:text-white transition font-mono"
                  >
                    {config.phone}
                  </a>
                </div>
              )}
              {config.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <a
                    href={`mailto:${config.email}`}
                    className="hover:text-white transition truncate"
                  >
                    {config.email}
                  </a>
                </div>
              )}
              {config.workingHours && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>{config.workingHours}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>
              &copy; {new Date().getFullYear()}{' '}
              <strong>{config.copyrightBrand || 'SAIN International Logistics'}</strong>.{' '}
              {config.copyrightSuffix || 'All rights reserved.'}
            </span>
          </div>

          {/* Developed by credit */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{config.creditPrefix || 'Designed & Developed by'}</span>
            <span className="inline-flex items-center gap-1.5 font-bold text-slate-200 hover:text-amber-400 transition">
              <img
                src="/assets/images/scaizlab_logo.png"
                alt="ScaizLab"
                className="h-4.5 w-auto object-contain hidden"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
                onLoad={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'inline-block';
                }}
              />
              <span className="tracking-wide">
                <a
                  href={config.creditDevUrl || 'https://theskzlab.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {config.creditDevName || 'SKzLAB'}
                </a>
              </span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
