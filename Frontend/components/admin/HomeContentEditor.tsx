import React, { useState } from 'react';
import { Save, CheckCircle, Sparkles, Image, Upload, RotateCcw, Search, Package, ExternalLink, Phone } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';
import { saveSiteConfigToDb } from '../../services/siteConfigService';

export interface HeroConfig {
  welcomeText: string;
  logoUrl: string;
  slogan: string;
  headline: string;
  headlineHighlight: string;
  description: string;
  trackingBadge: string;
  trackingHeading: string;
  trackingHeadingHighlight: string;
  trackingDescription: string;
  trackingPlaceholder: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
}

export const DEFAULT_HERO_CONFIG: HeroConfig = {
  welcomeText: 'WELCOME TO',
  logoUrl: '/assets/images/SAIN_logo_gold.png',
  slogan: 'True Soul of Bengal',
  headline: 'Fast, reliable and affordable shipping solutions, deliver to your doorstep',
  headlineHighlight: 'deliver to your doorstep',
  description: 'At SAIN we understand the importance of timely deliveries. From urgent documents to bulky packages, we provide seamless shipping services tailored to your needs. Track your shipment anytime, anywhere and experience stress-free delivery.',
  trackingBadge: 'Real-Time Consignment Tracker',
  trackingHeading: 'Track Your Shipment',
  trackingHeadingHighlight: 'Anytime, Anywhere',
  trackingDescription: 'Experience stress-free global freight visibility. Monitor air, sea, and courier shipments directly from Guangzhou and international hubs to your doorstep in Bangladesh.',
  trackingPlaceholder: 'Enter Consignment No. Ex: SAINEX067638406',
  whatsappNumber: '8801719068999',
  whatsappDefaultMessage: 'Hello SAIN International Logistics, I would like to inquire about freight & shipping services.',
};

export const HomeContentEditor: React.FC = () => {
  const [config, setConfig] = useState<HeroConfig>(() => {
    try {
      const stored = localStorage.getItem('sain_hero_content_config');
      const directWhatsApp = localStorage.getItem('sain_whatsapp_number');
      let base = DEFAULT_HERO_CONFIG;
      if (stored) {
        base = { ...DEFAULT_HERO_CONFIG, ...JSON.parse(stored) };
      }
      if (directWhatsApp) {
        base.whatsappNumber = directWhatsApp;
      }
      return base;
    } catch {
      // ignore
    }
    return DEFAULT_HERO_CONFIG;
  });

  const [saved, setSaved] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    type?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  } | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo file size must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setConfig((prev) => ({ ...prev, logoUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    setConfig((prev) => ({ ...prev, logoUrl: DEFAULT_HERO_CONFIG.logoUrl }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sain_hero_content_config', JSON.stringify(config));
    localStorage.setItem('sain_whatsapp_number', config.whatsappNumber);
    saveSiteConfigToDb('sain_hero_content_config', config);
    saveSiteConfigToDb('sain_whatsapp_number', config.whatsappNumber);
    // Also sync to legacy home key for compatibility
    localStorage.setItem('sain_home_content_config', JSON.stringify({
      headline: config.headline,
      tagline: config.description,
      trackingPlaceholder: config.trackingPlaceholder,
    }));
    window.dispatchEvent(new Event('sain_hero_content_updated'));
    window.dispatchEvent(new Event('sain_whatsapp_updated'));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetDefaults = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Hero Section Content?',
      message: 'Are you sure you want to reset all Hero Section text, headlines, descriptions, and WhatsApp configuration back to default values?',
      confirmText: 'Reset to Defaults',
      type: 'warning',
      onConfirm: () => {
        setConfig(DEFAULT_HERO_CONFIG);
        localStorage.setItem('sain_hero_content_config', JSON.stringify(DEFAULT_HERO_CONFIG));
        localStorage.setItem('sain_whatsapp_number', DEFAULT_HERO_CONFIG.whatsappNumber);
        saveSiteConfigToDb('sain_hero_content_config', DEFAULT_HERO_CONFIG);
        saveSiteConfigToDb('sain_whatsapp_number', DEFAULT_HERO_CONFIG.whatsappNumber);
        window.dispatchEvent(new Event('sain_hero_content_updated'));
        window.dispatchEvent(new Event('sain_whatsapp_updated'));
        setConfirmModal(null);
      },
    });
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Hero Section & Tracking Banner Settings</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure welcome intro, corporate logo, hero headline, narrative paragraph, and tracking experience banner.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold animate-in fade-in">
              <CheckCircle className="w-4 h-4" />
              <span>Saved & Live on Homepage</span>
            </span>
          )}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold px-3 py-1.5 border border-[#1a6c7a]/30 text-[#1a6c7a] bg-[#1a6c7a]/5 hover:bg-[#1a6c7a]/15 rounded-lg transition inline-flex items-center gap-1.5 cursor-pointer"
            title="Open Live Public Homepage in a new tab"
          >
            <span>Preview Live Hero</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs font-semibold px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg transition cursor-pointer"
          >
            Reset Defaults
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ============================================================== */}
        {/* 0. WHATSAPP WIDGET & INSTANT CHAT SETTINGS                     */}
        {/* ============================================================== */}
        <div className="bg-gradient-to-r from-emerald-50/70 to-teal-50/40 p-5 rounded-2xl border-2 border-emerald-300/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
              <span className="p-1 rounded-md bg-[#25D366] text-white shadow-xs">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12.031 2c-5.508 0-9.986 4.477-9.986 9.984 0 1.76.459 3.477 1.332 4.992l-1.417 5.176 5.305-1.391c1.465.798 3.117 1.22 4.766 1.22 5.509 0 9.988-4.478 9.988-9.985 0-5.507-4.479-9.984-9.988-9.984zm5.82 14.283c-.244.686-1.227 1.258-1.703 1.337-.478.078-1.077.112-3.486-.889-2.887-1.199-4.733-4.148-4.877-4.34-.143-.191-1.168-1.554-1.168-2.964 0-1.41.741-2.105 1.004-2.392.263-.287.574-.359.765-.359.191 0 .383 0 .55.008.176.009.412-.066.645.494.24.575.815 1.99.886 2.135.072.144.12.312.024.479-.096.167-.144.263-.287.43-.144.167-.302.373-.432.502-.144.144-.294.3-.127.587.168.287.747 1.233 1.603 1.996 1.102.981 2.031 1.286 2.318 1.43.287.143.455.12.623-.072.167-.191.717-.837.909-1.124.191-.287.383-.239.645-.143.263.096 1.674.789 1.961.933.287.143.479.215.55.335.072.119.072.693-.172 1.379z" />
                </svg>
              </span>
              <span>WhatsApp Widget & Instant Contact Number</span>
            </h4>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-bold">
              Live Homepage Floating Widget
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                WhatsApp Phone Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={config.whatsappNumber}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      whatsappNumber: e.target.value.replace(/[^0-9]/g, ''),
                    })
                  }
                  className="w-full text-xs font-mono font-bold border-2 border-emerald-300/80 rounded-lg pl-7 pr-3 py-2 outline-none focus:border-emerald-500 bg-white shadow-xs"
                  placeholder="8801719068999"
                  required
                />
                <span className="absolute left-2.5 top-2 text-xs font-bold text-emerald-700">+</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Provide full country code & number without + or spaces (e.g. <strong>8801719068999</strong>). Updating this number instantly updates the floating WhatsApp widget on the homepage, waybill modal inquiries, and direct booking buttons across the entire website.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Default Inquiry Message
              </label>
              <input
                type="text"
                value={config.whatsappDefaultMessage}
                onChange={(e) =>
                  setConfig({ ...config, whatsappDefaultMessage: e.target.value })
                }
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-500 bg-white"
                placeholder="Hello SAIN International Logistics, I would like to inquire about freight & shipping services."
              />
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-slate-500">
                  Pre-fills message when user opens WhatsApp
                </span>
                <a
                  href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
                    config.whatsappDefaultMessage || ''
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-emerald-200"
                >
                  <span>Test WhatsApp Link</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 1. WELCOME INTRO SLIDE (First Screen on Page Load)             */}
        {/* ============================================================== */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6c7a] flex items-center gap-2">
              <span>1. Welcome Screen (Top Opening Display)</span>
            </h4>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
              Initial Scroll View
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Top Welcome Tagline
              </label>
              <input
                type="text"
                value={config.welcomeText}
                onChange={(e) => setConfig({ ...config, welcomeText: e.target.value })}
                className="w-full text-xs font-bold tracking-widest uppercase border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="WELCOME TO"
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Shown above the logo</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Slogan / Sub-Tagline
              </label>
              <input
                type="text"
                value={config.slogan}
                onChange={(e) => setConfig({ ...config, slogan: e.target.value })}
                className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="True Soul of Bengal"
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Shown directly underneath the logo</span>
            </div>
          </div>

          {/* Logo Management */}
          <div className="pt-2 border-t border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Hero Section Logo
            </label>
            <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-center min-w-[140px] h-16">
                <img
                  src={config.logoUrl}
                  alt="SAIN Logo Preview"
                  className="max-h-12 w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/SAIN_logo_gold.png';
                  }}
                />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1a6c7a] hover:bg-[#145561] text-white text-xs font-bold rounded-lg shadow-xs transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleResetLogo}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-500" />
                    <span>Reset Default Gold Logo</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={config.logoUrl}
                  onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
                  placeholder="Or enter logo image URL (e.g. /assets/images/SAIN_logo_gold.png)"
                  className="w-full text-xs font-mono border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-[#1a6c7a]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. HERO HEADLINE & NARRATIVE (After Scroll)                    */}
        {/* ============================================================== */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6c7a] flex items-center gap-2">
              <span>2. Main Hero Headline & Description</span>
            </h4>
            <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold">
              Full Scroll View
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Main Hero Headline
            </label>
            <input
              type="text"
              value={config.headline}
              onChange={(e) => setConfig({ ...config, headline: e.target.value })}
              className="w-full text-sm font-bold border border-slate-300 rounded-lg px-3.5 py-2.5 outline-none focus:border-[#1a6c7a] bg-white"
              placeholder="Fast, reliable and affordable shipping solutions, deliver to your doorstep"
              required
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Default: Fast, reliable and affordable shipping solutions, deliver to your doorstep
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Headline Highlight Accent Phrase (Shown in Gold/Amber)
            </label>
            <input
              type="text"
              value={config.headlineHighlight}
              onChange={(e) => setConfig({ ...config, headlineHighlight: e.target.value })}
              className="w-full text-xs font-semibold text-amber-700 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
              placeholder="deliver to your doorstep"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Any matching text in the headline will be highlighted with the vibrant amber color
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Hero Paragraph / Narrative Text
            </label>
            <textarea
              rows={3}
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              className="w-full text-xs leading-relaxed text-slate-800 border border-slate-300 rounded-lg p-3 outline-none focus:border-[#1a6c7a] bg-white"
              placeholder="At SAIN we understand the importance of timely deliveries..."
              required
            />
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. TRACKING SLIDE TAKEOVER SECTION                             */}
        {/* ============================================================== */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6c7a] flex items-center gap-2">
              <span>3. Slide-Up Tracking Section</span>
            </h4>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
              Tracking Banner
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Badge / Tagline Pill
              </label>
              <input
                type="text"
                value={config.trackingBadge}
                onChange={(e) => setConfig({ ...config, trackingBadge: e.target.value })}
                className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="Real-Time Consignment Tracker"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tracking Section Title
              </label>
              <input
                type="text"
                value={config.trackingHeading}
                onChange={(e) => setConfig({ ...config, trackingHeading: e.target.value })}
                className="w-full text-xs font-bold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="Track Your Shipment"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Title Highlight Phrase (Amber)
              </label>
              <input
                type="text"
                value={config.trackingHeadingHighlight}
                onChange={(e) => setConfig({ ...config, trackingHeadingHighlight: e.target.value })}
                className="w-full text-xs font-semibold text-amber-700 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="Anytime, Anywhere"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tracking Search Input Placeholder Text
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={config.trackingPlaceholder}
                  onChange={(e) => setConfig({ ...config, trackingPlaceholder: e.target.value })}
                  className="w-full text-xs font-mono border border-slate-300 rounded-lg pl-8 pr-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                  placeholder="Enter Consignment No. Ex: SAINEX067638406"
                  required
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tracking Section Subtitle / Description
            </label>
            <textarea
              rows={2}
              value={config.trackingDescription}
              onChange={(e) => setConfig({ ...config, trackingDescription: e.target.value })}
              className="w-full text-xs leading-relaxed text-slate-800 border border-slate-300 rounded-lg p-3 outline-none focus:border-[#1a6c7a] bg-white"
              placeholder="Experience stress-free global freight visibility..."
              required
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            Changes apply instantly across the live website upon saving.
          </p>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#009b4d] hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Hero Changes</span>
          </button>
        </div>
      </form>

      {/* Custom Confirm Modal replacing window.confirm */}
      {confirmModal && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.confirmText}
          type={confirmModal.type}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
};
