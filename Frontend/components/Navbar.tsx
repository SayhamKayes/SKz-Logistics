import React, { useState } from 'react';
import { SainLogo } from '../assets/Logo';
import { useTracking } from '../Context/TrackingContext';
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Search,
  Menu,
  X,
  FileText,
  Database,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    openTrackingModal,
    openQuoteModal,
    setDevDbModalOpen,
  } = useTracking();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ] as const;

  const handleNavClick = (tab: 'home' | 'about' | 'services' | 'contact') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Info Bar */}
      <div className="bg-slate-950/95 border-b border-slate-800/80 text-slate-300 text-[11px] sm:text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1">
          {/* Left contact info */}
          <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 text-slate-400">
            <a
              href="tel:+8801719068999"
              className="flex items-center gap-1.5 hover:text-amber-400 transition"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>Inquiries: <strong className="text-slate-200 font-semibold">(880) 1719 068999</strong></span>
            </a>
            <a
              href="tel:+8801306412045"
              className="hidden md:flex items-center gap-1.5 hover:text-amber-400 transition"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>Accounts: <strong className="text-slate-200 font-semibold">(880) 1306 412045</strong></span>
            </a>
            <a
              href="mailto:saininternationallogistics@gmail.com"
              className="hidden lg:flex items-center gap-1.5 hover:text-amber-400 transition"
            >
              <Mail className="w-3.5 h-3.5 text-amber-500" />
              <span>saininternationallogistics@gmail.com</span>
            </a>
          </div>

          {/* Right badge & hours */}
          <div className="flex items-center gap-3 sm:gap-5 text-slate-400 ml-auto">
            <div className="hidden sm:flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Sat – Thu: 10:00 AM – 9:00 PM</span>
            </div>
            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded text-[10px] font-medium">
              <ShieldCheck className="w-3 h-3" />
              <span>Customs Act 2023 Compliant</span>
            </div>
            {/* Developer Backend Architecture trigger */}
            <button
              onClick={() => setDevDbModalOpen(true)}
              title="View Python Django, PostgreSQL, Neon & Supabase Architecture"
              className="hidden md:flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition px-2 py-0.5 rounded hover:bg-slate-800"
            >
              <Database className="w-3 h-3 text-cyan-400" />
              <span>Backend & DB Config</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="glass-panel border-b border-white/10 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => handleNavClick('home')}
            className="cursor-pointer transition-transform hover:scale-[1.01]"
          >
            <SainLogo />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => openQuoteModal()}
              className="px-4 py-2 text-xs font-semibold text-slate-200 border border-slate-700 hover:border-amber-500/50 hover:bg-slate-800/80 rounded-lg transition"
            >
              Get a Quote
            </button>

            {/* Prominent Track Item Button - The most important feature requested */}
            <button
              onClick={() => openTrackingModal()}
              className="relative group overflow-hidden px-5 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center gap-2 transform active:scale-95"
            >
              <Search className="w-4 h-4 text-slate-950 font-extrabold stroke-[2.5]" />
              <span>Track Item</span>
              <span className="w-2 h-2 rounded-full bg-slate-950/40 group-hover:bg-slate-950 transition-colors animate-pulse" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => openTrackingModal()}
              className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Track</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                  activeTab === item.id
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openQuoteModal();
                }}
                className="w-full text-center py-2.5 bg-slate-800 text-slate-200 rounded-lg text-sm font-semibold border border-slate-700"
              >
                Request a Quote
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setDevDbModalOpen(true);
                }}
                className="w-full text-center py-2 bg-slate-900 text-cyan-400 rounded-lg text-xs font-semibold border border-cyan-500/30 flex items-center justify-center gap-1.5"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Django & DB Architecture</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
