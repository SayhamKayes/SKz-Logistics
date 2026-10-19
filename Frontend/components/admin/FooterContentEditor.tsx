import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle,
  Sparkles,
  RotateCcw,
  Plus,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Clock,
  LayoutTemplate,
  Globe,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';
import { SaveSuccessModal } from './SaveSuccessModal';
import { saveSiteConfigToDb, fetchSiteConfigFromDb, CONFIG_KEYS } from '../../services/siteConfigService';
import { uploadMediaToCloudinary } from '../../services/uploadService';
import { RichParagraphEditor } from './RichParagraphEditor';
import { sanitizeRichHtml } from '../../utils/sanitizeHtml';

export interface FooterConfig {
  brandLogoUrl: string;
  brandDescription: string;

  navHeading: string;
  navHomeLabel: string;
  navAboutLabel: string;
  navServicesLabel: string;
  navContactLabel: string;

  servicesHeading: string;
  servicesList: string[];

  hqHeading: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;

  copyrightBrand: string;
  copyrightSuffix: string;
  creditPrefix: string;
  creditDevName: string;
  creditDevUrl: string;
}

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  brandLogoUrl: '/assets/images/SAIN_logo_gold.png',
  brandDescription:
    'SAIN is a trusted international freight and courier partner connecting people and businesses with fast, secure, and reliable shipping services from Guangzhou and global hubs to Bangladesh.',

  navHeading: 'Navigation',
  navHomeLabel: 'Home',
  navAboutLabel: 'About Us',
  navServicesLabel: 'Freight Services',
  navContactLabel: 'Contact Us',

  servicesHeading: 'Services',
  servicesList: [
    'Air Freight (Guangzhou to Dhaka)',
    'Sea Freight (FCL / LCL Container Cargo)',
    'Hand Carry Express Courier',
    'Outbound Export Forwarding',
    'Customs House Clearance (CFR / CIF)',
  ],

  hqHeading: 'Headquarters',
  address: 'Sector 3, Uttara, Dhaka-1230, Bangladesh',
  phone: '(880) 1719 068999',
  email: 'saininternationallogistics@gmail.com',
  workingHours: 'Sat – Thu: 10am – 9pm',

  copyrightBrand: 'SAIN International Logistics',
  copyrightSuffix: 'All rights reserved.',
  creditPrefix: 'Designed & Developed by',
  creditDevName: 'SKzLAB',
  creditDevUrl: 'https://theskzlab.com',
};

export const FOOTER_STORAGE_KEY = 'sain_footer_content_config';
export const FOOTER_UPDATE_EVENT = 'sain_footer_content_updated';

export const FooterContentEditor: React.FC = () => {
  const [config, setConfig] = useState<FooterConfig>(() => {
    try {
      const stored = localStorage.getItem(FOOTER_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_FOOTER_CONFIG, ...JSON.parse(stored) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_FOOTER_CONFIG;
  });

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [saveModal, setSaveModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'warning' | 'error';
  }>({
    isOpen: false,
    title: 'Footer Changes Saved!',
    message: 'Footer navigation, links, and contact information are now live across the website.',
    type: 'success',
  });
  const [newServiceInput, setNewServiceInput] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    type?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  } | null>(null);

  // Sync state whenever configuration is restored from History or updated externally, and fetch on mount
  useEffect(() => {
    fetchSiteConfigFromDb<FooterConfig>(CONFIG_KEYS.FOOTER_CONTENT, DEFAULT_FOOTER_CONFIG).then((remote) => {
      if (remote) setConfig((prev) => ({ ...prev, ...remote }));
    });

    const handleSync = () => {
      try {
        const stored = localStorage.getItem(FOOTER_STORAGE_KEY);
        if (stored) {
          setConfig({ ...DEFAULT_FOOTER_CONFIG, ...JSON.parse(stored) });
        }
      } catch {}
    };

    window.addEventListener(FOOTER_UPDATE_EVENT, handleSync);
    window.addEventListener('sain_site_config_updated', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener(FOOTER_UPDATE_EVENT, handleSync);
      window.removeEventListener('sain_site_config_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Logo file size must be under 10MB.');
      return;
    }

    setIsUploadingLogo(true);
    try {
      const res = await uploadMediaToCloudinary(file, 'sain_logistics/branding');
      if (res.success && res.url) {
        setConfig((prev) => ({ ...prev, brandLogoUrl: res.url! }));
      } else {
        console.warn('Cloudinary upload warning:', res.error);
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setConfig((prev) => ({ ...prev, brandLogoUrl: reader.result as string }));
          }
        };
        reader.readAsDataURL(file);
        if (res.error && res.error.includes('credentials')) {
          alert('Notice: Cloudinary credentials not yet added in Backend/.env. Saved as local preview. Add credentials in .env to upload directly to Cloudinary.');
        } else {
          alert(`Cloudinary upload notice: ${res.error || 'Failed to upload'}. Used local preview.`);
        }
      }
    } catch (err: any) {
      console.error('Footer logo upload error:', err);
    } finally {
      setIsUploadingLogo(false);
      e.target.value = '';
    }
  };

  const handleResetLogo = () => {
    setConfig((prev) => ({ ...prev, brandLogoUrl: DEFAULT_FOOTER_CONFIG.brandLogoUrl }));
  };

  const handleAddService = () => {
    const trimmed = newServiceInput.trim();
    if (!trimmed) return;
    setConfig((prev) => ({
      ...prev,
      servicesList: [...prev.servicesList, trimmed],
    }));
    setNewServiceInput('');
  };

  const handleRemoveService = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      servicesList: prev.servicesList.filter((_, i) => i !== index),
    }));
  };

  const handleServiceChange = (index: number, value: string) => {
    setConfig((prev) => {
      const updated = [...prev.servicesList];
      updated[index] = value;
      return { ...prev, servicesList: updated };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(FOOTER_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event(FOOTER_UPDATE_EVENT));

    const res = await saveSiteConfigToDb(FOOTER_STORAGE_KEY, config);
    if (res.success) {
      setSaveModal({
        isOpen: true,
        title: 'Footer Changes Saved!',
        message: 'Footer navigation, links, and contact information are saved to Central Neon Database and live across all devices.',
        type: 'success',
      });
    } else {
      setSaveModal({
        isOpen: true,
        title: 'Saved Locally (Sync Warning)',
        message: `Saved to browser storage. Central DB sync notice: ${res.error || 'Connection failed'}.`,
        type: 'warning',
      });
    }
    setTimeout(() => setSaveModal((prev) => ({ ...prev, isOpen: false })), 3500);
  };

  const handleResetDefaults = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Footer Settings to Default?',
      message: 'Are you sure you want to reset all footer brand narrative, copyright text, contact details, services list, and legal links to default values?',
      confirmText: 'Reset to Defaults',
      type: 'warning',
      onConfirm: async () => {
        setConfig(DEFAULT_FOOTER_CONFIG);
        localStorage.setItem(FOOTER_STORAGE_KEY, JSON.stringify(DEFAULT_FOOTER_CONFIG));
        window.dispatchEvent(new Event(FOOTER_UPDATE_EVENT));
        await saveSiteConfigToDb(FOOTER_STORAGE_KEY, DEFAULT_FOOTER_CONFIG);
        setConfirmModal(null);
      },
    });
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-amber-500" />
            <span>Footer Section Settings</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage company introduction, quick navigation titles, services catalog links, and headquarters contact details.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/#footer"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 border border-[#1a6c7a]/30 text-[#1a6c7a] bg-[#1a6c7a]/5 hover:bg-[#1a6c7a]/15 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            title="Preview live footer on website in a new tab"
          >
            <span>View Live Footer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#1a6c7a] hover:bg-[#153243] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg flex items-center gap-2 transition cursor-pointer"
          >
            {saveModal.isOpen ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                <span>Saved Live!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-amber-400" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Brand & Overview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 pb-1 border-b border-slate-100">
            <span>1. Brand Identity & Description</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Logo Preview & Upload */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">Footer Logo</label>
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center justify-center gap-3 min-h-[120px]">
                {config.brandLogoUrl ? (
                  <img
                    src={config.brandLogoUrl}
                    alt="Footer Logo Preview"
                    className="h-10 w-auto object-contain drop-shadow-md"
                  />
                ) : (
                  <span className="text-xs text-slate-400">No Logo</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className={`flex-1 py-2 px-3 ${isUploadingLogo ? 'bg-slate-300 cursor-not-allowed' : 'bg-slate-100 hover:bg-slate-200'} text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer`}>
                  {isUploadingLogo ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>{isUploadingLogo ? 'Uploading to Cloudinary...' : 'Upload Logo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={isUploadingLogo}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleResetLogo}
                  className="py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs transition cursor-pointer"
                  title="Reset to default gold logo"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Description Rich Paragraph Editor */}
            <div className="md:col-span-2">
              <RichParagraphEditor
                value={config.brandDescription}
                onChange={(newVal) => setConfig({ ...config, brandDescription: newVal })}
                label="Company Description / Overview Paragraph"
                placeholder="Enter company description displayed beneath the logo..."
                helperText="Select any portion of text and click Bold (Ctrl+B), Italic (Ctrl+I), or Underline (Ctrl+U) to style it just like Microsoft Word."
              />
              <p className="text-[11px] text-slate-500 mt-2">
                This appears beneath the SAIN logo on the left side of the footer.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Quick Navigation Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 pb-1 border-b border-slate-100">
            <span>2. Quick Navigation Column</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Column Title</label>
              <input
                type="text"
                value={config.navHeading}
                onChange={(e) => setConfig({ ...config, navHeading: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#1a6c7a] outline-none transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Home Label</label>
              <input
                type="text"
                value={config.navHomeLabel}
                onChange={(e) => setConfig({ ...config, navHomeLabel: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#1a6c7a] outline-none transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">About Label</label>
              <input
                type="text"
                value={config.navAboutLabel}
                onChange={(e) => setConfig({ ...config, navAboutLabel: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#1a6c7a] outline-none transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Services Label</label>
              <input
                type="text"
                value={config.navServicesLabel}
                onChange={(e) => setConfig({ ...config, navServicesLabel: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#1a6c7a] outline-none transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Contact Label</label>
              <input
                type="text"
                value={config.navContactLabel}
                onChange={(e) => setConfig({ ...config, navContactLabel: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#1a6c7a] outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Services Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <span>3. Services List Column</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {config.servicesList.length} services listed
            </span>
          </div>

          <div className="max-w-md space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Column Title</label>
            <input
              type="text"
              value={config.servicesHeading}
              onChange={(e) => setConfig({ ...config, servicesHeading: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#1a6c7a] outline-none transition"
            />
          </div>

          {/* List of services items */}
          <div className="space-y-2.5">
            {config.servicesList.map((service, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-6 text-center text-xs font-mono text-slate-400">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={service}
                  onChange={(e) => handleServiceChange(index, e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#1a6c7a] outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveService(index)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Remove this service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add new service */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newServiceInput}
              onChange={(e) => setNewServiceInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddService();
                }
              }}
              placeholder="e.g. Warehousing & Distribution"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#1a6c7a] outline-none transition"
            />
            <button
              type="button"
              onClick={handleAddService}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Service</span>
            </button>
          </div>
        </div>

        {/* Section 4: Headquarters Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 pb-1 border-b border-slate-100">
            <span>4. Headquarters & Contact Details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Column Title</label>
              <input
                type="text"
                value={config.hqHeading}
                onChange={(e) => setConfig({ ...config, hqHeading: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#1a6c7a] outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Physical Office Address</span>
              </label>
              <input
                type="text"
                value={config.address}
                onChange={(e) => setConfig({ ...config, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#1a6c7a] outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>Phone / Hotline</span>
              </label>
              <input
                type="text"
                value={config.phone}
                onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#1a6c7a] outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>Official Contact Email</span>
              </label>
              <input
                type="text"
                value={config.email}
                onChange={(e) => setConfig({ ...config, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#1a6c7a] outline-none transition"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Working / Operating Hours</span>
              </label>
              <input
                type="text"
                value={config.workingHours}
                onChange={(e) => setConfig({ ...config, workingHours: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#1a6c7a] outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Real-time Live Preview
            </span>
            <span className="text-[11px] text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-medium">
              Synchronized with Public Footer
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-slate-300 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 text-xs">
              {/* Brand Preview */}
              <div className="lg:col-span-2 space-y-3">
                {config.brandLogoUrl && (
                  <img
                    src={config.brandLogoUrl}
                    alt="Logo"
                    className="h-8 w-auto object-contain"
                  />
                )}
                <div
                  className="text-slate-400 text-xs leading-relaxed max-w-sm rich-footer-text"
                  dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(config.brandDescription) }}
                />
              </div>

              {/* Navigation Preview */}
              <div className="space-y-2">
                <h5 className="font-bold uppercase tracking-wider text-slate-100 text-[11px]">
                  {config.navHeading}
                </h5>
                <ul className="space-y-1 text-slate-400 text-[11px]">
                  <li>{config.navHomeLabel}</li>
                  <li>{config.navAboutLabel}</li>
                  <li>{config.navServicesLabel}</li>
                  <li>{config.navContactLabel}</li>
                </ul>
              </div>

              {/* Services Preview */}
              <div className="space-y-2">
                <h5 className="font-bold uppercase tracking-wider text-slate-100 text-[11px]">
                  {config.servicesHeading}
                </h5>
                <ul className="space-y-1 text-slate-400 text-[11px]">
                  {config.servicesList.map((s, idx) => (
                    <li key={idx} className="truncate">{s}</li>
                  ))}
                </ul>
              </div>

              {/* HQ Preview */}
              <div className="space-y-2">
                <h5 className="font-bold uppercase tracking-wider text-slate-100 text-[11px]">
                  {config.hqHeading}
                </h5>
                <div className="space-y-1.5 text-slate-400 text-[11px]">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{config.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-mono">{config.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{config.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{config.workingHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar Preview */}
            <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
              <span>
                &copy; {new Date().getFullYear()} <strong>{config.copyrightBrand}</strong>. {config.copyrightSuffix}
              </span>
              <span>
                {config.creditPrefix}{' '}
                <strong className="text-slate-300">{config.creditDevName}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action Button at Bottom */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#1a6c7a] hover:bg-[#153243] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg flex items-center gap-2 transition cursor-pointer"
          >
            {saveModal.isOpen ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                <span>Saved Live!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-amber-400" />
                <span>Save Changes</span>
              </>
            )}
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
      {/* Centered Save Success Modal Popup */}
      <SaveSuccessModal
        isOpen={saveModal.isOpen}
        title={saveModal.title}
        message={saveModal.message}
        type={saveModal.type}
      />
    </div>
  );
};
