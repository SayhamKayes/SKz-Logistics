import React, { useState } from 'react';
import { Save, CheckCircle, Info } from 'lucide-react';

export const AboutContentEditor: React.FC = () => {
  const [heading, setHeading] = useState('Pioneering Bangladesh Global Freight & Logistics Excellence');
  const [mission, setMission] = useState('Empowering Bangladeshi businesses and international traders with rapid, compliant, transparent, and technology-driven cargo forwarding across air, sea, and land networks.');
  const [vision, setVision] = useState('To be the premier digital freight gateway of South Asia, recognized for uncompromising integrity, full adherence to the Customs Act 2023, and real-time cargo visibility.');
  const [hqAddress, setHqAddress] = useState('15/B, Uttara Metro Center, Dhaka 1230 Bangladesh');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const config = { heading, mission, vision, hqAddress };
    localStorage.setItem('sain_about_content_config', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Info className="w-5 h-5 text-[#1a6c7a]" />
            <span>About Us Section & Corporate Bio</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure SAIN International Logistics mission, vision, and operational presence.
          </p>
        </div>

        {saved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold animate-in fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>Saved & Updated</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Section Title & Value Statement
          </label>
          <input
            type="text"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full text-sm font-semibold border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-[#1a6c7a]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Our Mission
          </label>
          <textarea
            rows={3}
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            className="w-full text-xs text-slate-700 border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-[#1a6c7a]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Our Vision
          </label>
          <textarea
            rows={3}
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            className="w-full text-xs text-slate-700 border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-[#1a6c7a]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Central Hub / Headquarters Location
          </label>
          <input
            type="text"
            value={hqAddress}
            onChange={(e) => setHqAddress(e.target.value)}
            className="w-full text-xs border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-[#1a6c7a]"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#009b4d] hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save About Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
