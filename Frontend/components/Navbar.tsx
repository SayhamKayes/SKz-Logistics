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
    isHeaderVisible,
    openTrackingModal,
    openQuoteModal,
    setDevDbModalOpen,
  } = useTracking();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showNavbar = activeTab !== 'home' || isHeaderVisible;

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ] as const;

  const handleNavClick = (tab: any) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-700 ease-out transform ${
        showNavbar
          ? 'translate-y-0 opacity-100 shadow-md pointer-events-auto'
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      {/* Main Navigation Bar (Fixed at top) */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => handleNavClick('home')}
            className="cursor-pointer transition-transform hover:scale-[1.01]"
          >
            <SainLogo variant="full" />
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
                      ? 'text-[#153243] bg-amber-500/15 border border-amber-500/35 font-bold shadow-xs'
                      : 'text-slate-700 hover:text-[#153243] hover:bg-slate-100/80'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Action CTAs: Prominent Track Item Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => openTrackingModal()}
              className="relative group overflow-hidden px-5 py-2.5 bg-[#153243] hover:bg-[#1a365d] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 transform active:scale-95 cursor-pointer"
            >
              <Search className="w-4 h-4 text-amber-400 font-extrabold stroke-[2.5]" />
              <span>Track Item</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 transition-colors animate-pulse" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => openTrackingModal()}
              className="px-3 py-1.5 bg-[#153243] text-white font-bold text-xs rounded-lg flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5 text-amber-400 stroke-[2.5]" />
              <span>Track</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-950 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 flex flex-col gap-2 bg-white animate-in fade-in slide-in-from-top-2 duration-200">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                  activeTab === item.id
                    ? 'bg-amber-500/15 text-[#153243] border border-amber-500/35 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};
