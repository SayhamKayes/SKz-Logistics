import React, { useState } from 'react';
import { Save, CheckCircle, Sparkles, Image, Upload, RotateCcw, Search, Package } from 'lucide-react';

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
};

export const HomeContentEditor: React.FC = () => {
  const [config, setConfig] = useState<HeroConfig>(() => {
    try {
      const stored = localStorage.getItem('sain_hero_content_config');
      if (stored) {
        return { ...DEFAULT_HERO_CONFIG, ...JSON.parse(stored) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_HERO_CONFIG;
  });

  const [saved, setSaved] = useState(false);

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
    // Also sync to legacy home key for compatibility
    localStorage.setItem('sain_home_content_config', JSON.stringify({
      headline: config.headline,
      tagline: config.description,
      trackingPlaceholder: config.trackingPlaceholder,
    }));
    window.dispatchEvent(new Event('sain_hero_content_updated'));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all Hero Section content back to default values?')) {
      setConfig(DEFAULT_HERO_CONFIG);
      localStorage.setItem('sain_hero_content_config', JSON.stringify(DEFAULT_HERO_CONFIG));
      window.dispatchEvent(new Event('sain_hero_content_updated'));
    }
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
        {/* 1. WELCOME INTRO SLIDE (First Screen on Page Load)             */}
        {/* ============================================================== */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6c7a] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
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
              <Sparkles className="w-4 h-4 text-teal-600" />
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
              <Package className="w-4 h-4 text-amber-500" />
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
    </div>
  );
};
