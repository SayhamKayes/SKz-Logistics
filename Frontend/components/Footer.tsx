import React from 'react';
import { SainLogo } from '../assets/Logo';
import { useTracking } from '../Context/TrackingContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Search,
  ArrowRight,
  Database,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, openTrackingModal, openQuoteModal, setDevDbModalOpen } = useTracking();

  const handleNav = (tab: 'home' | 'about' | 'services' | 'contact') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-slate-950 border-t border-slate-800 text-slate-300 pt-16 pb-12 px-4 sm:px-8 z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand info (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <SainLogo />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              SAIN Ship is a trusted international freight and courier partner connecting people and businesses with fast, secure, and reliable shipping services from Guangzhou and global hubs to Bangladesh.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full compliance with Bangladesh Customs Act 2023</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-amber-400 transition"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-amber-400 transition"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-amber-400 transition"
                >
                  Freight Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-amber-400 transition"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => openTrackingModal()}
                  className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Search className="w-3 h-3" />
                  <span>Track Consignment</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Freight Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Air Freight (Guangzhou to Dhaka)</li>
              <li>Sea Freight (FCL / LCL Container Cargo)</li>
              <li>Hand Carry Express Courier</li>
              <li>Outbound Export Forwarding</li>
              <li>Customs House Clearance (CFR / CIF)</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              Headquarters
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>Sector 3, Uttara, Dhaka-1230, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <a href="tel:+8801719068999" className="hover:text-white transition font-mono">
                  (880) 1719 068999
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <a href="mailto:saininternationallogistics@gmail.com" className="hover:text-white transition truncate">
                  saininternationallogistics@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Sat – Thu: 10am – 9pm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} <strong>𝗦𝗔𝗜𝗡 International Logistics</strong>. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDevDbModalOpen(true)}
              className="hover:text-cyan-400 transition flex items-center gap-1 text-[11px]"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Django &amp; PostgreSQL / Neon Config</span>
            </button>
            <span className="text-slate-700">•</span>
            <span className="text-amber-500 font-bengali">সেঈন - True Soul of Bengal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
