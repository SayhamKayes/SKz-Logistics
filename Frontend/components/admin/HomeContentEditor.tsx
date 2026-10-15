import React, { useState } from 'react';
import { Save, CheckCircle, Sparkles, Layout } from 'lucide-react';

export const HomeContentEditor: React.FC = () => {
  const [headline, setHeadline] = useState('Connecting Bangladesh to Global Commerce');
  const [tagline, setTagline] = useState('Door-to-door express freight forwarding, transparent customs clearance under Customs Act 2023, and real-time cargo visibility.');
  const [trackingPlaceholder, setTrackingPlaceholder] = useState(() => {
    try {
      const stored = localStorage.getItem('sain_home_content_config');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.trackingPlaceholder) {
          return parsed.trackingPlaceholder.replace(/\s+or\s+12345/i, '');
        }
      }
    } catch {}
    return 'Enter Consignment No. Ex: SAINEX067638406';
  });
  const [statCountries, setStatCountries] = useState('140+');
  const [statAccuracy, setStatAccuracy] = useState('99.4%');
  const [statContainers, setStatContainers] = useState('12,000+');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const config = {
      headline,
      tagline,
      trackingPlaceholder,
      statCountries,
      statAccuracy,
      statContainers,
    };
    localStorage.setItem('sain_home_content_config', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layout className="w-5 h-5 text-[#1a6c7a]" />
            <span>Home Page Content & Banner Settings</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Customize hero headline, tracking banner messaging, and homepage global stats.
          </p>
        </div>

        {saved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold animate-in fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>Saved & Applied Live</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Main Hero Headline
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full text-sm font-semibold border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-[#1a6c7a]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Subtitle / Hero Tagline
          </label>
          <textarea
            rows={3}
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full text-xs text-slate-700 border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-[#1a6c7a]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Tracking Input Box Prompt / Placeholder
          </label>
          <input
            type="text"
            value={trackingPlaceholder}
            onChange={(e) => setTrackingPlaceholder(e.target.value)}
            className="w-full text-xs font-mono border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-[#1a6c7a]"
          />
        </div>

        <div className="pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
            Global Impact Key Statistics
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">Global Destinations</span>
              <input
                type="text"
                value={statCountries}
                onChange={(e) => setStatCountries(e.target.value)}
                className="w-full font-bold text-slate-800 text-sm bg-white border border-slate-300 rounded px-2.5 py-1 mt-1"
              />
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">On-Time Clearance</span>
              <input
                type="text"
                value={statAccuracy}
                onChange={(e) => setStatAccuracy(e.target.value)}
                className="w-full font-bold text-slate-800 text-sm bg-white border border-slate-300 rounded px-2.5 py-1 mt-1"
              />
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-semibold text-slate-500 uppercase block">TEU Annual Cargo</span>
              <input
                type="text"
                value={statContainers}
                onChange={(e) => setStatContainers(e.target.value)}
                className="w-full font-bold text-slate-800 text-sm bg-white border border-slate-300 rounded px-2.5 py-1 mt-1"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#009b4d] hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Home Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
