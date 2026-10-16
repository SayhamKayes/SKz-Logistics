import React, { useState } from 'react';
import { Save, CheckCircle, Info, Upload, Trash2, RotateCcw, Target, Compass, Award, TrendingUp, ShieldCheck, ExternalLink } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';
import { saveSiteConfigToDb } from '../../services/siteConfigService';

export interface AboutConfig {
  badge: string;
  heading: string;
  description: string;
  // Left showcase image
  image: string;
  imageOverlayTitle: string;
  imageOverlayDesc: string;
  // Mission & Vision
  missionTitle: string;
  missionText: string;
  visionTitle: string;
  visionText: string;
  // 3 Values
  value1Title: string;
  value1Desc: string;
  value2Title: string;
  value2Desc: string;
  value3Title: string;
  value3Desc: string;
  // CTA Banner
  ctaTagline: string;
  ctaHeading: string;
  ctaDesc: string;
}

export const DEFAULT_ABOUT_CONFIG: AboutConfig = {
  badge: 'WHO WE ARE',
  heading: 'About SAIN Ship',
  description: 'SAIN is a trusted shipping and courier company dedicated to connecting people and businesses with fast, secure, and reliable delivery services. Our mission is to simplify the shipping process while providing exceptional customer service.',
  image: '/assets/images/team_office.webp',
  imageOverlayTitle: 'Headquarters: Uttara, Dhaka',
  imageOverlayDesc: 'Connecting Guangzhou & global export hubs directly to Bangladesh consignees.',
  missionTitle: 'Our Mission',
  missionText: 'Our mission at SAIN INTERNATIONAL LOGISTICS is to empower global trade by providing fast, secure, and highly compliant logistics solutions that seamlessly connect Bangladesh to international markets. Whether you\'re sending a small package or managing bulk shipments, we ensure your items reach safely, on time, every time.',
  visionTitle: 'Our Vision',
  visionText: 'Our vision is to be the region\'s most trusted freight forwarding partner, setting the industry standard for supply chain transparency, technological innovation, and absolute reliability.',
  value1Title: 'Integrity & Transparency',
  value1Desc: 'Honest pricing & open communication',
  value2Title: 'Operational Excellence',
  value2Desc: 'Strict on-time delivery metrics',
  value3Title: 'Regulatory Expertise',
  value3Desc: 'Mastery of Customs Act 2023',
  ctaTagline: "Ready To Ship? Let's Get Your Packages Moving!",
  ctaHeading: 'Join thousands of satisfied customers who trust SAIN Ship for safe and timely deliveries.',
  ctaDesc: 'Start shipping with us today and experience convenience at every step! Transparent rates, zero hidden surcharges, and direct doorstep delivery across Bangladesh.',
};

export const AboutContentEditor: React.FC = () => {
  const [config, setConfig] = useState<AboutConfig>(() => {
    try {
      const stored = localStorage.getItem('sain_about_content_config');
      if (stored) {
        return { ...DEFAULT_ABOUT_CONFIG, ...JSON.parse(stored) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_ABOUT_CONFIG;
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Image file size must be under 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setConfig((prev) => ({ ...prev, image: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Showcase Image?',
      message: 'Are you sure you want to delete the showcase image? The section will display a clean layout without the image.',
      confirmText: 'Delete Image',
      type: 'danger',
      onConfirm: () => {
        setConfig((prev) => ({ ...prev, image: '' }));
        setConfirmModal(null);
      },
    });
  };

  const handleResetImage = () => {
    setConfig((prev) => ({ ...prev, image: DEFAULT_ABOUT_CONFIG.image }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sain_about_content_config', JSON.stringify(config));
    saveSiteConfigToDb('sain_about_content_config', config);
    window.dispatchEvent(new Event('sain_about_content_updated'));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetDefaults = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset About Us Content?',
      message: 'Are you sure you want to reset all About Us text, images, mission, vision, and values back to defaults?',
      confirmText: 'Reset to Defaults',
      type: 'warning',
      onConfirm: () => {
        setConfig(DEFAULT_ABOUT_CONFIG);
        localStorage.setItem('sain_about_content_config', JSON.stringify(DEFAULT_ABOUT_CONFIG));
        saveSiteConfigToDb('sain_about_content_config', DEFAULT_ABOUT_CONFIG);
        window.dispatchEvent(new Event('sain_about_content_updated'));
        setConfirmModal(null);
      },
    });
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Info className="w-5 h-5 text-[#1a6c7a]" />
            <span>About Us Section & Corporate Bio Settings</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure SAIN Ship overview, team/office showcase image, mission, vision, values, and CTA banner.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold animate-in fade-in">
              <CheckCircle className="w-4 h-4" />
              <span>Saved & Updated Live</span>
            </span>
          )}
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold px-3 py-1.5 border border-[#1a6c7a]/30 text-[#1a6c7a] bg-[#1a6c7a]/5 hover:bg-[#1a6c7a]/15 rounded-lg transition inline-flex items-center gap-1.5 cursor-pointer"
            title="Open Live About Us page in a new tab"
          >
            <span>View Live About Us</span>
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
        {/* Section 1: Main Header & Overview */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6c7a] border-b border-slate-200 pb-2">
            1. Section Header & Company Overview
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Top Subtitle / Badge
              </label>
              <input
                type="text"
                value={config.badge}
                onChange={(e) => setConfig({ ...config, badge: e.target.value })}
                className="w-full text-xs font-bold uppercase border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="WHO WE ARE"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Section Title
              </label>
              <input
                type="text"
                value={config.heading}
                onChange={(e) => setConfig({ ...config, heading: e.target.value })}
                className="w-full text-xs font-bold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="About SAIN Ship"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Company Overview Description
            </label>
            <textarea
              rows={3}
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              className="w-full text-xs leading-relaxed border border-slate-300 rounded-lg p-3 outline-none focus:border-[#1a6c7a] bg-white"
              placeholder="SAIN is a trusted shipping and courier company..."
              required
            />
          </div>
        </div>

        {/* Section 2: Team / Office Showcase Image & Overlay */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6c7a]">
              2. Showcase Image & Location Overlay (Left Column)
            </h4>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
              Image Management
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
            <div className="sm:col-span-5 bg-white p-3 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-600 block">Image Preview</span>
              {config.image ? (
                <div className="relative rounded-lg overflow-hidden border border-slate-300 h-44 bg-slate-900 group">
                  <img
                    src={config.image}
                    alt="Showcase"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    title="Delete Image"
                    className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-md transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="h-44 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                  <span className="text-xs font-semibold">No Image Selected</span>
                  <span className="text-[10px] text-slate-400 mt-1">Image has been deleted / removed</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <label className="cursor-pointer flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#1a6c7a] hover:bg-[#145561] text-white text-xs font-bold rounded-lg shadow-xs transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {config.image ? (
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="px-3 py-1.5 border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                  >
                    Delete
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleResetImage}
                    className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                  >
                    Restore
                  </button>
                )}
              </div>
            </div>

            <div className="sm:col-span-7 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Image Path / Custom Image URL
                </label>
                <input
                  type="text"
                  value={config.image}
                  onChange={(e) => setConfig({ ...config, image: e.target.value })}
                  placeholder="e.g. /assets/images/team_office.webp"
                  className="w-full text-xs font-mono border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Image Overlay Title / Headquarters
                </label>
                <input
                  type="text"
                  value={config.imageOverlayTitle}
                  onChange={(e) => setConfig({ ...config, imageOverlayTitle: e.target.value })}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                  placeholder="Headquarters: Uttara, Dhaka"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Image Overlay Description
                </label>
                <textarea
                  rows={2}
                  value={config.imageOverlayDesc}
                  onChange={(e) => setConfig({ ...config, imageOverlayDesc: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 outline-none focus:border-[#1a6c7a] bg-white"
                  placeholder="Connecting Guangzhou & global export hubs directly to Bangladesh consignees."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Mission & Vision */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6c7a] border-b border-slate-200 pb-2 flex items-center gap-2">
            <span>3. Mission & Vision Statements</span>
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mission Title
              </label>
              <input
                type="text"
                value={config.missionTitle}
                onChange={(e) => setConfig({ ...config, missionTitle: e.target.value })}
                className="w-full text-xs font-bold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="Our Mission"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mission Description Text
              </label>
              <textarea
                rows={3}
                value={config.missionText}
                onChange={(e) => setConfig({ ...config, missionText: e.target.value })}
                className="w-full text-xs leading-relaxed border border-slate-300 rounded-lg p-3 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="Our mission at SAIN INTERNATIONAL LOGISTICS..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Vision Title
              </label>
              <input
                type="text"
                value={config.visionTitle}
                onChange={(e) => setConfig({ ...config, visionTitle: e.target.value })}
                className="w-full text-xs font-bold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="Our Vision"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Vision Description Text
              </label>
              <textarea
                rows={2}
                value={config.visionText}
                onChange={(e) => setConfig({ ...config, visionText: e.target.value })}
                className="w-full text-xs leading-relaxed border border-slate-300 rounded-lg p-3 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="Our vision is to be the region's most trusted freight forwarding partner..."
                required
              />
            </div>
          </div>
        </div>

        {/* Section 4: 3 Core Values */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6c7a] border-b border-slate-200 pb-2 flex items-center gap-2">
            <span>4. Core Values (3 Cards)</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Value 1 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase text-amber-600 block">Value 1</span>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={config.value1Title}
                  onChange={(e) => setConfig({ ...config, value1Title: e.target.value })}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#1a6c7a]"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={config.value1Desc}
                  onChange={(e) => setConfig({ ...config, value1Desc: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 outline-none focus:border-[#1a6c7a]"
                  required
                />
              </div>
            </div>

            {/* Value 2 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase text-[#1a6c7a] block">Value 2</span>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={config.value2Title}
                  onChange={(e) => setConfig({ ...config, value2Title: e.target.value })}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#1a6c7a]"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={config.value2Desc}
                  onChange={(e) => setConfig({ ...config, value2Desc: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 outline-none focus:border-[#1a6c7a]"
                  required
                />
              </div>
            </div>

            {/* Value 3 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase text-emerald-600 block">Value 3</span>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={config.value3Title}
                  onChange={(e) => setConfig({ ...config, value3Title: e.target.value })}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#1a6c7a]"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={config.value3Desc}
                  onChange={(e) => setConfig({ ...config, value3Desc: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 outline-none focus:border-[#1a6c7a]"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: CTA Banner */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6c7a] border-b border-slate-200 pb-2">
            5. "Ready To Ship" Bottom CTA Banner
          </h4>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Top Sub-Tagline
            </label>
            <input
              type="text"
              value={config.ctaTagline}
              onChange={(e) => setConfig({ ...config, ctaTagline: e.target.value })}
              className="w-full text-xs font-bold uppercase border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Main Banner Headline
            </label>
            <input
              type="text"
              value={config.ctaHeading}
              onChange={(e) => setConfig({ ...config, ctaHeading: e.target.value })}
              className="w-full text-xs font-bold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Banner Subtext
            </label>
            <textarea
              rows={2}
              value={config.ctaDesc}
              onChange={(e) => setConfig({ ...config, ctaDesc: e.target.value })}
              className="w-full text-xs leading-relaxed border border-slate-300 rounded-lg p-3 outline-none focus:border-[#1a6c7a] bg-white"
              required
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            Changes apply instantly to the About section across the website.
          </p>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#009b4d] hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save About Changes</span>
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
