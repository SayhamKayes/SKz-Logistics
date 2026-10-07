import React, { useState } from 'react';
import { useTracking } from '../Context/TrackingContext';
import {
  Search,
  Package,
  Plane,
  Ship,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const TrackingSection: React.FC = () => {
  const {
    searchConsignment,
    openTrackingModal,
    isLoading,
    allConsignments,
    searchHistory,
  } = useTracking();

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

  return (
    <section id="track" className="relative py-20 px-4 sm:px-8 z-10">
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-semibold tracking-wider uppercase">
            <Package className="w-3.5 h-3.5" />
            <span>Real-Time Consignment Tracker</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-100 font-brand tracking-tight">
            Track Your Shipment <span className="text-amber-400">Anytime, Anywhere</span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Experience stress-free global freight visibility. Monitor air, sea, and courier shipments directly from Guangzhou and international hubs to your doorstep in Bangladesh.
          </p>
        </div>

        {/* Tracking Card (Styled identically to saininternationallogistics.com/track-form/) */}
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-700/80 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Subtle glow effect */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

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
                  placeholder="Enter the Consignment No. Ex: 12345"
                  className="w-full bg-slate-950/80 border-2 border-slate-700 hover:border-slate-600 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/20 rounded-2xl px-5 py-4 pl-12 text-slate-100 placeholder-slate-400 text-base sm:text-lg focus:outline-none transition font-mono shadow-inner"
                />
                <Search className="w-5 h-5 text-amber-400 absolute left-4.5 top-4.5" />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base uppercase tracking-wider rounded-2xl shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <span>Track Item</span>
                    <ArrowRight className="w-5 h-5 font-bold" />
                  </>
                )}
              </button>
            </div>

            {errorText && (
              <p className="text-red-400 text-xs font-semibold pl-2">
                {errorText}
              </p>
            )}

            {/* Quick click suggestions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-400 font-medium">Quick Examples:</span>
                {['12345', 'SAIN-78492-BD', 'SAIN-SEA-99120'].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleQuickClick(code)}
                    className="px-2.5 py-1 bg-slate-800/80 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-700 hover:border-amber-500/50 rounded-lg font-mono text-[11px] transition cursor-pointer"
                  >
                    {code}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Compliant with Bangladesh Customs Act 2023</span>
              </div>
            </div>
          </form>

          {/* Active Preloaded Consignments Highlights */}
          <div className="mt-8 pt-8 border-t border-slate-800/80 relative z-10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
              <span>Recently Updated Freight Shipments</span>
              <span className="text-[11px] text-amber-400 font-normal">Click any card to inspect full waypoint log</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.values(allConsignments).slice(0, 3).map((item) => (
                <div
                  key={item.consignmentNo}
                  onClick={() => handleQuickClick(item.consignmentNo)}
                  className="bg-slate-950/60 hover:bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 p-4 rounded-2xl transition cursor-pointer group shadow-md"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/60">
                    <span className="font-mono font-bold text-amber-400 text-sm group-hover:text-amber-300 transition">
                      {item.consignmentNo}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        item.status === 'Delivered'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : item.status === 'Out for Delivery'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                    <div className="font-semibold">{item.origin.city}</div>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <div className="font-semibold text-emerald-400">{item.destination.city}</div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{item.cargoDetails.weight}</span>
                    <span className="text-amber-400/90 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      <span>View</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
