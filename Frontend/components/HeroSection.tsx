import React, { useState } from 'react';
import { useTracking } from '../Context/TrackingContext';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Plane,
  Ship,
  Briefcase,
  Globe2,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  MapPin,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { openTrackingModal, searchConsignment, openQuoteModal, setActiveTab } = useTracking();
  const [consignmentInput, setConsignmentInput] = useState('');

  const handleHeroTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const query = consignmentInput.trim() || '12345';
    searchConsignment(query);
    openTrackingModal(query);
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center px-4 sm:px-8 pt-10 pb-20 z-10">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Core Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Bengali & Brand Slogan badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-panel border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold shadow-lg shadow-amber-500/10">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-brand uppercase tracking-wider">SAIN / সেঈন</span>
              <span className="text-slate-400">•</span>
              <span className="font-bengali text-amber-200">True Soul of Bengal</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-brand tracking-tight text-slate-100 leading-[1.1]">
              Fast, reliable and affordable shipping solutions –{' '}
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                deliver to your doorstep
              </span>
            </h1>

            {/* Authentic Subtext from website */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              At SAIN we understand the importance of timely deliveries. From urgent documents to bulky packages, we provide seamless shipping services tailored to your needs. Track your shipment anytime, anywhere and experience stress-free delivery.
            </p>

            {/* Interactive Consignment Tracking Input */}
            <div className="glass-panel p-2 sm:p-2.5 rounded-2xl border border-amber-500/30 shadow-2xl bg-slate-900/80 backdrop-blur-xl max-w-xl">
              <form onSubmit={handleHeroTrack} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={consignmentInput}
                    onChange={(e) => setConsignmentInput(e.target.value)}
                    placeholder="Enter the Consignment No. Ex: 12345"
                    className="w-full bg-slate-950/70 border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3.5 pl-11 text-sm text-slate-100 placeholder-slate-400 focus:outline-none transition font-mono font-medium"
                  />
                  <Search className="w-4 h-4 text-amber-400 absolute left-4 top-4" />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/25 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Track Shipping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => {
                  const el = document.getElementById('services');
                  el ? el.scrollIntoView({ behavior: 'smooth' }) : setActiveTab('services');
                }}
                className="px-6 py-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
              >
                Explore Services
              </button>
              <button
                onClick={() => openQuoteModal()}
                className="px-6 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-2"
              >
                <span>Get a Fast Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <a
                href="tel:+8801719068999"
                className="px-4 py-3 text-slate-300 hover:text-amber-400 font-medium text-xs flex items-center gap-2 transition"
              >
                <PhoneCall className="w-4 h-4 text-amber-500" />
                <span>Call: (880) 1719 068999</span>
              </a>
            </div>

            {/* 4 Pillars Badge list */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                Corridors:
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-200 font-bold">
                AIR FREIGHT
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-200 font-bold">
                SEA FREIGHT
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-200 font-bold">
                HAND CARRY
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-200 font-bold">
                EXPORT
              </span>
            </div>
          </div>

          {/* Right Column: High-Impact Feature Card & Testimonial */}
          <div className="lg:col-span-5 space-y-5">
            {/* Feature Card: Best Shipping Solution */}
            <div className="glass-card p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-amber-500/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Trusted Logistics Partner
                  </span>
                  <h3 className="text-lg font-bold text-slate-100 font-brand">
                    Best Shipping Solution
                  </h3>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Expert customs handling and professional delivery for your business. Operating seamlessly under Bangladesh Customs Act 2023 guidelines.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Guangzhou ➔ Uttara, Dhaka</span>
                </span>
                <span className="text-emerald-400 font-semibold">100% Compliant</span>
              </div>
            </div>

            {/* Testimonial Card directly from website */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 shadow-2xl relative">
              <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-3">
                <span className="flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>Verified Client Testimonial</span>
                </span>
                <span className="text-slate-400 text-[11px]">June 15, 2026</span>
              </div>

              <blockquote className="text-slate-200 text-xs sm:text-sm italic leading-relaxed">
                &ldquo;I recently utilized the services of SAIN International Logistics for an air freight shipment, and the experience was truly exemplary. From the very beginning, the team was incredibly transparent about the entire process, especially regarding the complexities of shipping from Guangzhou to Dhaka.&rdquo;
              </blockquote>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                    MD SAKIB
                  </h4>
                  <p className="text-[11px] text-amber-400">
                    Air Freight Client • Guangzhou to Dhaka
                  </p>
                </div>
                <div className="flex text-amber-400 text-xs">
                  ★★★★★
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
