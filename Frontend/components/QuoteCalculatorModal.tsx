import React, { useState } from 'react';
import { useTracking } from '../Context/TrackingContext';
import {
  X,
  Calculator,
  Plane,
  Ship,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

export const QuoteCalculatorModal: React.FC = () => {
  const { isQuoteModalOpen, closeQuoteModal } = useTracking();

  const [freightType, setFreightType] = useState<'air' | 'sea_lcl' | 'sea_fcl' | 'hand_carry'>('air');
  const [origin, setOrigin] = useState('Guangzhou');
  const [destination, setDestination] = useState('Dhaka Doorstep');
  const [weightKg, setWeightKg] = useState<number>(25);
  const [volumeCbm, setVolumeCbm] = useState<number>(0.2);
  const [includeCustoms, setIncludeCustoms] = useState(true);

  if (!isQuoteModalOpen) return null;

  // Realistic logistics rate calculation
  const calculateEstimate = () => {
    let baseRateUsd = 0;
    let customsFeeUsd = includeCustoms ? 35 : 0;

    if (freightType === 'air') {
      // ~$7.50 / kg from Guangzhou to Dhaka air freight
      const effectiveWeight = Math.max(weightKg, volumeCbm * 167);
      baseRateUsd = effectiveWeight * 7.5;
    } else if (freightType === 'sea_lcl') {
      // ~$160 / CBM
      baseRateUsd = Math.max(volumeCbm, 0.5) * 165;
    } else if (freightType === 'sea_fcl') {
      // Standard 20ft container rate
      baseRateUsd = 1850;
    } else if (freightType === 'hand_carry') {
      baseRateUsd = 420 + weightKg * 14;
    }

    const totalUsd = Math.round(baseRateUsd + customsFeeUsd);
    const totalBdt = Math.round(totalUsd * 122); // current approx USD-BDT rate
    return { totalUsd, totalBdt };
  };

  const { totalUsd, totalBdt } = calculateEstimate();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-brand">Freight Rate Calculator</h2>
              <p className="text-xs text-slate-400">Instant shipping estimate from China/Global to Bangladesh</p>
            </div>
          </div>
          <button
            onClick={closeQuoteModal}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Freight Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Freight Mode:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'air', label: 'Air Freight', icon: Plane, time: '2-4 Days' },
                { id: 'sea_lcl', label: 'Sea LCL', icon: Ship, time: '14-18 Days' },
                { id: 'sea_fcl', label: 'Sea FCL', icon: Ship, time: '20ft/40ft' },
                { id: 'hand_carry', label: 'Hand Carry', icon: Briefcase, time: '24 Hours' },
              ].map((item) => {
                const IconComponent = item.icon;
                const isSelected = freightType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFreightType(item.id as any)}
                    className={`p-3 rounded-xl border text-left transition ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mb-1" />
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-[10px] text-slate-400">{item.time}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Route Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Origin City (Hub)
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
              >
                <option value="Guangzhou">Guangzhou (Baiyun Hub), China</option>
                <option value="Shenzhen">Shenzhen, China</option>
                <option value="Yiwu">Yiwu, Zhejiang, China</option>
                <option value="Shanghai">Shanghai, China</option>
                <option value="Hong Kong">Hong Kong (HKG Hub)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Destination in Bangladesh
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
              >
                <option value="Dhaka Doorstep">Dhaka Doorstep Delivery (Uttara, Gulshan, Mirpur etc.)</option>
                <option value="Chattogram">Chattogram Seaport / Doorstep</option>
                <option value="Sylhet">Sylhet Division Doorstep</option>
                <option value="Khulna">Khulna / Mongla Region</option>
              </select>
            </div>
          </div>

          {/* Weight & Volume Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Gross Weight (KG)
              </label>
              <input
                type="number"
                min={1}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Volume in CBM (Cubic Meters)
              </label>
              <input
                type="number"
                step="0.05"
                min={0.05}
                value={volumeCbm}
                onChange={(e) => setVolumeCbm(Number(e.target.value) || 0.1)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 font-mono"
              />
            </div>
          </div>

          {/* Customs Checkbox */}
          <div className="flex items-center gap-2 p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs">
            <input
              type="checkbox"
              id="includeCustoms"
              checked={includeCustoms}
              onChange={(e) => setIncludeCustoms(e.target.checked)}
              className="accent-amber-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="includeCustoms" className="text-slate-300 cursor-pointer">
              Include Full Customs Act 2023 Clearing &amp; Delivery Formalities in Dhaka
            </label>
          </div>

          {/* Estimated Result Card */}
          <div className="bg-gradient-to-r from-amber-500/10 via-slate-950 to-amber-500/10 p-5 rounded-2xl border border-amber-500/40 text-center space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Estimated Freight Price
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-amber-400">
              ≈ ৳{totalBdt.toLocaleString()} <span className="text-base text-slate-300 font-sans">BDT</span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              (approx. ${totalUsd} USD • All inclusive CFR Doorstep)
            </div>
            <p className="text-[10px] text-slate-400 pt-1">
              * Final quote depends on cargo HS classification and exact volumetric weight upon warehouse intake.
            </p>
          </div>

          {/* CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <a
              href={`https://wa.me/8801719068999?text=Hello%20SAIN%20Logistics,%20I%20would%20like%20to%20book%20a%20shipment%20from%20${origin}%20to%20${destination}%20with%20weight%20${weightKg}kg.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2"
            >
              <span>Book via WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="tel:+8801719068999"
              className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-amber-500" />
              <span>Call (880) 1719 068999</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
