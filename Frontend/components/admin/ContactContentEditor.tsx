import React, { useState } from 'react';
import { Save, CheckCircle, Phone, MapPin, Mail, Clock, MessageSquare, Building2, Sparkles } from 'lucide-react';

interface ContactConfig {
  headquartersAddress: string;
  headquartersPhone: string;
  secondaryPhone: string;
  officialEmail: string;
  supportEmail: string;
  whatsappNumber: string;
  workingHours: string;
  guangzhouHub: string;
  yiwuHub: string;
  shenzhenHub: string;
}

const DEFAULT_CONTACT_CONFIG: ContactConfig = {
  headquartersAddress: '15/B, Uttara Metro Center, Dhaka 1230 Bangladesh',
  headquartersPhone: '+880171906999',
  secondaryPhone: '+8801731939325',
  officialEmail: 'saininternationallogistics@gmail.com',
  supportEmail: 'support@sainlogistics.com',
  whatsappNumber: '+880171906999',
  workingHours: 'Saturday – Thursday: 9:00 AM – 8:00 PM (BST)',
  guangzhouHub: 'Room 302, Building A, Longhai Logistics Park, Baiyun District, Guangzhou, Guangdong, China',
  yiwuHub: 'Warehouse 12, International Trade City Logistics Zone, Chouzhou North Road, Yiwu, Zhejiang, China',
  shenzhenHub: 'Unit 5, Baoan International Airport Logistics Zone, Shenzhen, Guangdong, China',
};

export const ContactContentEditor: React.FC = () => {
  const [config, setConfig] = useState<ContactConfig>(() => {
    try {
      const stored = localStorage.getItem('sain_contact_content_config');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return DEFAULT_CONTACT_CONFIG;
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sain_contact_content_config', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const resetDefaults = () => {
    if (window.confirm('Reset contact settings to default?')) {
      setConfig(DEFAULT_CONTACT_CONFIG);
      localStorage.setItem('sain_contact_content_config', JSON.stringify(DEFAULT_CONTACT_CONFIG));
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#1a6c7a]" />
            <span>Contact Information & International Hubs</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage Dhaka headquarters contacts, emergency lines, and China warehouse drop-off addresses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold animate-in fade-in">
              <CheckCircle className="w-4 h-4" />
              <span>Contact Details Updated</span>
            </span>
          )}
          <button
            type="button"
            onClick={resetDefaults}
            className="text-xs font-semibold px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg transition"
          >
            Reset Defaults
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Headquarters */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6c7a] mb-3 flex items-center gap-1.5">
            <Building2 className="w-4 h-4" />
            <span>Dhaka Headquarters & Direct Lines</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Headquarters Physical Address
              </label>
              <input
                type="text"
                value={config.headquartersAddress}
                onChange={(e) => setConfig({ ...config, headquartersAddress: e.target.value })}
                className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary Hotline (Call & SMS)
              </label>
              <input
                type="text"
                value={config.headquartersPhone}
                onChange={(e) => setConfig({ ...config, headquartersPhone: e.target.value })}
                className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Secondary Line / Emergency Desk
              </label>
              <input
                type="text"
                value={config.secondaryPhone}
                onChange={(e) => setConfig({ ...config, secondaryPhone: e.target.value })}
                className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary Official Email
              </label>
              <input
                type="email"
                value={config.officialEmail}
                onChange={(e) => setConfig({ ...config, officialEmail: e.target.value })}
                className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                WhatsApp Live Support Number
              </label>
              <input
                type="text"
                value={config.whatsappNumber}
                onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a]"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Customer Service Operating Hours
              </label>
              <input
                type="text"
                value={config.workingHours}
                onChange={(e) => setConfig({ ...config, workingHours: e.target.value })}
                className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a]"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: China Receiving Hubs */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6c7a] mb-3 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>China Forwarding Hubs & Drop-Off Warehouses</span>
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Guangzhou Receiving Hub (Air & Sea Consolidation)
              </label>
              <textarea
                rows={2}
                value={config.guangzhouHub}
                onChange={(e) => setConfig({ ...config, guangzhouHub: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-lg p-3 outline-none focus:border-[#1a6c7a]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Yiwu Wholesale Cargo Facility
              </label>
              <textarea
                rows={2}
                value={config.yiwuHub}
                onChange={(e) => setConfig({ ...config, yiwuHub: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-lg p-3 outline-none focus:border-[#1a6c7a]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Shenzhen Tech & Air Cargo Hub
              </label>
              <textarea
                rows={2}
                value={config.shenzhenHub}
                onChange={(e) => setConfig({ ...config, shenzhenHub: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-lg p-3 outline-none focus:border-[#1a6c7a]"
                required
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#1a6c7a] hover:bg-[#145561] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Contact Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
