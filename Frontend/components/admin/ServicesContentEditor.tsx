import React, { useState } from 'react';
import { Save, CheckCircle, Truck, Plus, Trash2, Edit3, ArrowRight, Clock, MapPin, Sparkles } from 'lucide-react';

interface ServiceItem {
  id: string;
  title: string;
  badge: string;
  turnaround: string;
  corridor: string;
  incoterms: string;
  description: string;
  features: string[];
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'air-freight',
    title: 'Air Freight Priority',
    badge: 'Premier Priority Transit',
    turnaround: '2 – 4 Days Transit',
    corridor: 'CAN / SZX → DAC (Dhaka)',
    incoterms: 'CFR, CIF, DDP, FOB',
    description: 'Swift cargo routing from major global hubs directly to Bangladesh. Expertly managing CFR terms and Customs Act 2023 clearance.',
    features: [
      'Guangzhou (CAN) & Shenzhen to Dhaka (DAC) daily schedules',
      'CFR & CIF Incoterms handling with transparent paperwork',
      'Full compliance with Bangladesh Customs Act 2023',
      'Direct airport customs clearance & swift release',
    ],
  },
  {
    id: 'sea-freight',
    title: 'Sea Freight Ocean',
    badge: 'FCL & LCL Ocean Solutions',
    turnaround: '14 – 20 Days Sea Transit',
    corridor: 'China Ports → Chattogram / Mongla',
    incoterms: 'FOB, CFR, CIF, EXW',
    description: 'Comprehensive, cost-effective ocean shipping connecting global manufacturing ports directly to Chattogram & Mongla seaports for both Full Container Load (FCL) and Less Container Load (LCL).',
    features: [
      'Direct container sailings into Chattogram (CTG) Port',
      'LCL cargo consolidation in Guangzhou & Yiwu warehouses',
      'Zero demurrage optimization through fast documentation',
      'Inland bonded transport to Dhaka, Gazipur, and Narayanganj',
    ],
  },
  {
    id: 'hand-carry',
    title: 'Hand Carry Express',
    badge: 'Time-Critical Emergency Courier',
    turnaround: '24 – 36 Hours Door-to-Door',
    corridor: 'Guangzhou / HK → Dhaka Personal Escort',
    incoterms: 'DDP Door-to-Door',
    description: 'Dedicated on-board couriers for urgent sample delivery, garment accessories, and critical industrial replacement components with personal accompaniment.',
    features: [
      'Dedicated onboard courier personally escorting consignment',
      'Next-flight-out dispatch from Hong Kong, Guangzhou, Bangkok',
      'Immediate hand-off at Hazrat Shahjalal International Airport',
      'Ideal for urgent buyer samples and pre-production trims',
    ],
  },
  {
    id: 'customs-clearance',
    title: 'B2B Customs Brokerage',
    badge: 'Customs Act 2023 Compliant',
    turnaround: '24 – 48 Hours Port Release',
    corridor: 'Dhaka ICD / Airport / Chattogram Port',
    incoterms: 'Duty Paid / DDP',
    description: 'Licensed customs brokerage team ensuring 100% compliant classification, valuation, and swift tariff settlement under Bangladesh Customs Act 2023.',
    features: [
      'HS Code classification and precise duty estimation',
      'Pre-arrival document processing for accelerated customs clearance',
      'Direct liaison with Dhaka Airport Cargo & Kamalapur ICD',
      'Resolution of non-tariff barriers and regulatory permits',
    ],
  },
  {
    id: 'ecommerce-fulfillment',
    title: 'E-commerce & Cargo Consolidation',
    badge: 'Cross-Border Supply Chain',
    turnaround: 'Continuous Daily Dispatch',
    corridor: 'China Hubs → Bangladesh Nationwide',
    incoterms: 'Door Delivery',
    description: 'End-to-end purchasing assistance, warehouse consolidation in China, and direct parcel dispatch to consumers and wholesale merchants across Bangladesh.',
    features: [
      'Multi-supplier package consolidation at Guangzhou & Yiwu',
      'Quality check inspection and protective repackaging',
      'Automated real-time tracking with SMS and WhatsApp notification',
      'Cash on Delivery (COD) and doorstep courier distribution in BD',
    ],
  },
];

export const ServicesContentEditor: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const stored = localStorage.getItem('sain_services_content_config');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return DEFAULT_SERVICES;
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Active form data
  const [formData, setFormData] = useState<ServiceItem>(DEFAULT_SERVICES[0]);

  const startEdit = (item: ServiceItem) => {
    setEditingId(item.id);
    setFormData({ ...item });
  };

  const handleFeatureChange = (index: number, val: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = val;
    setFormData({ ...formData, features: updatedFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const saveCurrentService = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedList = services.map((s) => (s.id === formData.id ? { ...formData } : s));
    setServices(updatedList);
    localStorage.setItem('sain_services_content_config', JSON.stringify(updatedList));
    setEditingId(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const resetToDefault = () => {
    if (window.confirm('Reset services list to default SAIN catalog?')) {
      setServices(DEFAULT_SERVICES);
      localStorage.setItem('sain_services_content_config', JSON.stringify(DEFAULT_SERVICES));
      setEditingId(null);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#1a6c7a]" />
            <span>Services Catalog & Transit Parameters</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure freight offerings, transit timelines, shipping corridors, and promotional badges shown across the portal and 3D flip cards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold animate-in fade-in">
              <CheckCircle className="w-4 h-4" />
              <span>Catalog Updated Live</span>
            </span>
          )}
          <button
            type="button"
            onClick={resetToDefault}
            className="text-xs font-semibold px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg transition"
          >
            Reset Defaults
          </button>
        </div>
      </div>

      {/* Editing Modal / Drawer */}
      {editingId && (
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-[#1a6c7a]" />
              <span>Editing Service: {formData.title}</span>
            </h4>
            <button
              onClick={() => setEditingId(null)}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-1 rounded"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={saveCurrentService} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-[#1a6c7a]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge / Tagline</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-[#1a6c7a]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Turnaround / Transit Time</label>
                <input
                  type="text"
                  value={formData.turnaround}
                  onChange={(e) => setFormData({ ...formData, turnaround: e.target.value })}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-[#1a6c7a]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Corridor</label>
                <input
                  type="text"
                  value={formData.corridor}
                  onChange={(e) => setFormData({ ...formData, corridor: e.target.value })}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-[#1a6c7a]"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Incoterms Supported</label>
                <input
                  type="text"
                  value={formData.incoterms}
                  onChange={(e) => setFormData({ ...formData, incoterms: e.target.value })}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-[#1a6c7a]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Service Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg p-3 bg-white outline-none focus:border-[#1a6c7a]"
                />
              </div>
            </div>

            {/* Features Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700">Key Service Features & Specifications</label>
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-xs text-[#1a6c7a] font-bold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Feature</span>
                </button>
              </div>

              <div className="space-y-2">
                {formData.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => handleFeatureChange(idx, e.target.value)}
                      placeholder="e.g. Daily flights with customs broker accompaniment"
                      className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-white outline-none focus:border-[#1a6c7a]"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#1a6c7a] hover:bg-[#145561] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save Service Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List Table */}
      <div className="space-y-3">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">{svc.title}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/60 rounded">
                  {svc.badge}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-sky-50 text-sky-800 border border-sky-200/60 rounded flex items-center gap-1">
                  <Clock className="w-3 h-3 text-sky-600" />
                  {svc.turnaround}
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-1">{svc.description}</p>
              <div className="flex items-center gap-4 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {svc.corridor}
                </span>
                <span>• Terms: {svc.incoterms}</span>
                <span>• {svc.features.length} Bullet Points</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => startEdit(svc)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-[#1a6c7a] text-slate-700 hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Service</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
