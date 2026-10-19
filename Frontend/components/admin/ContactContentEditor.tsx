import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle,
  Phone,
  MapPin,
  Mail,
  Clock,
  Sparkles,
  Server,
  Lock,
  Eye,
  EyeOff,
  Send,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { getApiBaseUrl } from '../../services/databaseConfig';
import { ConfirmModal } from './ConfirmModal';
import { SaveSuccessModal } from './SaveSuccessModal';
import { saveSiteConfigToDb, fetchSiteConfigFromDb, CONFIG_KEYS } from '../../services/siteConfigService';
import { RichParagraphEditor } from './RichParagraphEditor';

export interface ContactConfig {
  // Header
  badge: string;
  heading: string;
  description: string;

  // Direct Contact Numbers
  phoneHeading: string;
  phone1Label: string;
  phone1Number: string;
  phone2Label: string;
  phone2Number: string;

  // Electronic Mail
  mailHeading: string;
  officialEmail: string;
  emailWebsite: string;

  // Headquarters & Hours
  hqHeading: string;
  headquartersAddress: string;
  workingDaysLabel: string;
  workingHours: string;
  weekendLabel: string;
  weekendStatus: string;

  // Ready to Ship? Parallax CTA Banner (Full-Width Home / Contact Section)
  ctaTagline: string;
  ctaHeading: string;
  ctaDescription: string;
  ctaContactBtnText: string;
  ctaContactBtnLink: string;
  ctaTrackBtnText: string;

  // Google Map Location (Contact Page)
  mapLocationTitle: string;
  mapAddress: string;
  mapEmbedUrl: string;

  // SMTP Gateway Configuration
  smtpEnabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpSecurity: 'tls' | 'ssl';
  smtpUser: string;
  smtpPassword: string;
  receiverEmail: string;
  senderName: string;
}

export const DEFAULT_CONTACT_CONFIG: ContactConfig = {
  badge: 'Connect with SAIN',
  heading: 'Get in Touch',
  description: 'Have questions regarding cargo rates from Guangzhou, customs declaration, or consignment status? Our logistics specialists in Uttara, Dhaka are ready to assist.',

  phoneHeading: 'Direct Contact Numbers',
  phone1Label: 'General Inquiries:',
  phone1Number: '(880) 1719 068999',
  phone2Label: 'Accounts & Invoicing:',
  phone2Number: '(880) 1306 412045',

  mailHeading: 'Electronic Mail',
  officialEmail: 'saininternationallogistics@gmail.com',
  emailWebsite: 'saininternationallogistics.com',

  hqHeading: 'Headquarters & Business Hours',
  headquartersAddress: 'Base in Sector 3, Uttara, Dhaka-1230, Bangladesh',
  workingDaysLabel: 'Saturday - Thursday:',
  workingHours: '10:00 AM – 9:00 PM',
  weekendLabel: 'Friday:',
  weekendStatus: 'Closed',

  ctaTagline: "Ready To Ship? Let's Get Your Packages Moving!",
  ctaHeading: 'Join thousands of satisfied customers who trust SAIN Ship for safe and timely deliveries.',
  ctaDescription: 'Start shipping with us today and experience convenience at every step! Transparent rates, zero hidden surcharges, and direct doorstep delivery across Bangladesh.',
  ctaContactBtnText: 'Contact',
  ctaContactBtnLink: '#contact',
  ctaTrackBtnText: 'Track Existing Shipment',

  mapLocationTitle: 'SAIN International Logistics',
  mapAddress: 'House 15, Road No. 5, Block B, Uttara-1230, Bangladesh',
  mapEmbedUrl: '',

  smtpEnabled: true,
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpSecurity: 'tls',
  smtpUser: 'saininternationallogistics@gmail.com',
  smtpPassword: '',
  receiverEmail: 'saininternationallogistics@gmail.com',
  senderName: 'SAIN Logistics Web Desk',
};

export const ContactContentEditor: React.FC = () => {
  const [config, setConfig] = useState<ContactConfig>(() => {
    try {
      const stored = localStorage.getItem('sain_contact_content_config');
      if (stored) {
        return { ...DEFAULT_CONTACT_CONFIG, ...JSON.parse(stored) };
      }
    } catch { }
    return DEFAULT_CONTACT_CONFIG;
  });

  const [saveModal, setSaveModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'warning' | 'error';
  }>({
    isOpen: false,
    title: 'Contact Changes Saved!',
    message: 'Contact information and office locations are now live across the website.',
    type: 'success',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    type?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  } | null>(null);

  // Sync state when restored from History or updated externally, and fetch from Central DB on mount
  useEffect(() => {
    fetchSiteConfigFromDb<ContactConfig>(CONFIG_KEYS.CONTACT_CONTENT, DEFAULT_CONTACT_CONFIG).then((remote) => {
      if (remote) {
        setConfig((prev) => ({ ...prev, ...remote }));
      }
    });

    const handleSync = () => {
      try {
        const stored = localStorage.getItem('sain_contact_content_config');
        if (stored) {
          setConfig({ ...DEFAULT_CONTACT_CONFIG, ...JSON.parse(stored) });
        }
      } catch { }
    };

    window.addEventListener('sain_site_config_updated', handleSync);
    window.addEventListener('sain_contact_content_updated', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('sain_site_config_updated', handleSync);
      window.removeEventListener('sain_contact_content_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // SMTP Test state
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sain_contact_content_config', JSON.stringify(config));
    window.dispatchEvent(new Event('sain_contact_content_updated'));

    const res = await saveSiteConfigToDb(CONFIG_KEYS.CONTACT_CONTENT, config);
    if (res.success) {
      setSaveModal({
        isOpen: true,
        title: 'Contact Changes Saved!',
        message: 'Contact information and office locations are saved to Central Neon Database and live across all devices.',
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
      title: 'Reset Contact & Office Settings?',
      message: 'Are you sure you want to reset all phone numbers, email addresses, office locations, and SMTP configurations back to defaults?',
      confirmText: 'Reset to Defaults',
      type: 'warning',
      onConfirm: async () => {
        setConfig(DEFAULT_CONTACT_CONFIG);
        localStorage.setItem('sain_contact_content_config', JSON.stringify(DEFAULT_CONTACT_CONFIG));
        window.dispatchEvent(new Event('sain_contact_content_updated'));
        await saveSiteConfigToDb(CONFIG_KEYS.CONTACT_CONTENT, DEFAULT_CONTACT_CONFIG);
        setConfirmModal(null);
      },
    });
  };

  const handleTestSmtp = async () => {
    if (!config.smtpUser || !config.smtpPassword) {
      alert('Please fill out SMTP User Email and Password/App Password before testing.');
      return;
    }

    setTestLoading(true);
    setTestResult(null);

    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/contact/test-smtp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          smtpHost: config.smtpHost,
          smtpPort: config.smtpPort,
          smtpSecurity: config.smtpSecurity,
          smtpUser: config.smtpUser,
          smtpPassword: config.smtpPassword,
          receiverEmail: config.receiverEmail || config.smtpUser,
          senderName: config.senderName,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          success: true,
          message: data.message || `Test email successfully delivered to ${config.receiverEmail || config.smtpUser}!`,
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Failed to authenticate with SMTP server. Please verify your host and password/app password.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Network/Backend connection error: ${err.message || 'Make sure the backend is running.'}`,
      });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#1a6c7a]" />
            <span>Contact Section, Map Location & SMTP Settings</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure direct phone numbers, email addresses, office hours, map coordinates, and customer email dispatch SMTP.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveModal.isOpen && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold animate-in fade-in">
              <CheckCircle className="w-4 h-4" />
              <span>Saved & Live on Website</span>
            </span>
          )}
          <a
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold px-3 py-1.5 border border-[#1a6c7a]/30 text-[#1a6c7a] bg-[#1a6c7a]/5 hover:bg-[#1a6c7a]/15 rounded-lg transition inline-flex items-center gap-1.5 cursor-pointer"
            title="Open Live Contact Page in a new tab"
          >
            <span>View Live Contact</span>
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
        {/* 1. SECTION HEADER                                              */}
        {/* ============================================================== */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6c7a] border-b border-slate-200 pb-2">
            1. Section Heading & Intro
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Top Badge / Pill
              </label>
              <input
                type="text"
                value={config.badge}
                onChange={(e) => setConfig({ ...config, badge: e.target.value })}
                className="w-full text-xs font-bold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="Connect with SAIN"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Main Heading
              </label>
              <input
                type="text"
                value={config.heading}
                onChange={(e) => setConfig({ ...config, heading: e.target.value })}
                className="w-full text-xs font-bold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="Get in Touch"
                required
              />
            </div>
          </div>

          <RichParagraphEditor
            value={config.description}
            onChange={(newVal) => setConfig({ ...config, description: newVal })}
            label="Description / Subtext"
            placeholder="Have questions regarding cargo rates from Guangzhou..."
            helperText="Format branch & inquiry subtext with bold or italic emphasis."
            minHeight="85px"
            rows={3}
          />
        </div>

        {/* ============================================================== */}
        {/* 2. DIRECT CONTACT NUMBERS                                      */}
        {/* ============================================================== */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6c7a] border-b border-slate-200 pb-2 flex items-center gap-2">
            <span>2. Direct Phone Numbers</span>
          </h4>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Card Header Title
            </label>
            <input
              type="text"
              value={config.phoneHeading}
              onChange={(e) => setConfig({ ...config, phoneHeading: e.target.value })}
              className="w-full text-xs font-bold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
              placeholder="Direct Contact Numbers"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Number 1 */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase text-amber-600 block">Phone Line 1</span>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Label Text</label>
                <input
                  type="text"
                  value={config.phone1Label}
                  onChange={(e) => setConfig({ ...config, phone1Label: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#1a6c7a]"
                  placeholder="General Inquiries:"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={config.phone1Number}
                  onChange={(e) => setConfig({ ...config, phone1Number: e.target.value })}
                  className="w-full text-xs font-mono font-bold text-[#153243] border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#1a6c7a]"
                  placeholder="(880) 1719 068999"
                  required
                />
              </div>
            </div>

            {/* Number 2 */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase text-[#1a6c7a] block">Phone Line 2</span>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Label Text</label>
                <input
                  type="text"
                  value={config.phone2Label}
                  onChange={(e) => setConfig({ ...config, phone2Label: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#1a6c7a]"
                  placeholder="Accounts & Invoicing:"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={config.phone2Number}
                  onChange={(e) => setConfig({ ...config, phone2Number: e.target.value })}
                  className="w-full text-xs font-mono font-bold text-[#153243] border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#1a6c7a]"
                  placeholder="(880) 1306 412045"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. ELECTRONIC MAIL & HEADQUARTERS                              */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email Settings */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6c7a] border-b border-slate-200 pb-2 flex items-center gap-2">
              <span>3. Electronic Mail Info</span>
            </h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Box Header
              </label>
              <input
                type="text"
                value={config.mailHeading}
                onChange={(e) => setConfig({ ...config, mailHeading: e.target.value })}
                className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="Electronic Mail"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                value={config.officialEmail}
                onChange={(e) => setConfig({ ...config, officialEmail: e.target.value })}
                className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="saininternationallogistics@gmail.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Domain / Subtext
              </label>
              <input
                type="text"
                value={config.emailWebsite}
                onChange={(e) => setConfig({ ...config, emailWebsite: e.target.value })}
                className="w-full text-xs font-mono border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="saininternationallogistics.com"
                required
              />
            </div>
          </div>

          {/* Headquarters & Hours */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6c7a] border-b border-slate-200 pb-2 flex items-center gap-2">
              <span>4. Headquarters & Hours</span>
            </h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Header Title
              </label>
              <input
                type="text"
                value={config.hqHeading}
                onChange={(e) => setConfig({ ...config, hqHeading: e.target.value })}
                className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="Headquarters & Business Hours"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Physical Address
              </label>
              <input
                type="text"
                value={config.headquartersAddress}
                onChange={(e) => setConfig({ ...config, headquartersAddress: e.target.value })}
                className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="Base in Sector 3, Uttara, Dhaka-1230, Bangladesh"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Working Days</label>
                <input
                  type="text"
                  value={config.workingDaysLabel}
                  onChange={(e) => setConfig({ ...config, workingDaysLabel: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 outline-none focus:border-[#1a6c7a] bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Hours</label>
                <input
                  type="text"
                  value={config.workingHours}
                  onChange={(e) => setConfig({ ...config, workingHours: e.target.value })}
                  className="w-full text-xs font-semibold text-emerald-700 border border-slate-300 rounded-lg px-2 py-1.5 outline-none focus:border-[#1a6c7a] bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Weekend Day</label>
                <input
                  type="text"
                  value={config.weekendLabel}
                  onChange={(e) => setConfig({ ...config, weekendLabel: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 outline-none focus:border-[#1a6c7a] bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Weekend Status</label>
                <input
                  type="text"
                  value={config.weekendStatus}
                  onChange={(e) => setConfig({ ...config, weekendStatus: e.target.value })}
                  className="w-full text-xs font-bold text-rose-600 border border-slate-300 rounded-lg px-2 py-1.5 outline-none focus:border-[#1a6c7a] bg-white"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 5. READY TO SHIP? PARALLAX CTA BANNER                          */}
        {/* ============================================================== */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6c7a] flex items-center gap-2">
              <span>5. Ready To Ship? Parallax CTA Banner</span>
            </h4>
            <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-bold">
              Full-Width Parallax
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Customize the full-width parallax CTA banner displaying the maritime container ship located directly above the Contact &amp; Office locations section.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Eyebrow / Sub-tagline
              </label>
              <input
                type="text"
                value={config.ctaTagline || ''}
                onChange={(e) => setConfig({ ...config, ctaTagline: e.target.value })}
                className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="Ready To Ship? Let's Get Your Packages Moving!"
              />
            </div>
          </div>

          <RichParagraphEditor
            value={config.ctaDescription || ''}
            onChange={(newVal) => setConfig({ ...config, ctaDescription: newVal })}
            label="CTA Description / Body Text"
            placeholder="Start shipping with us today and experience convenience at every step! Transparent rates, zero hidden surcharges..."
            helperText="Format description text with bold or italic emphasis."
            minHeight="80px"
            rows={3}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Button Text
              </label>
              <input
                type="text"
                value={config.ctaContactBtnText || ''}
                onChange={(e) => setConfig({ ...config, ctaContactBtnText: e.target.value })}
                className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="Contact"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Button Link / Target
              </label>
              <input
                type="text"
                value={config.ctaContactBtnLink || ''}
                onChange={(e) => setConfig({ ...config, ctaContactBtnLink: e.target.value })}
                className="w-full text-xs font-mono border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="#contact"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Use <code className="bg-slate-200 px-1 py-0.5 rounded text-[10px]">#contact</code> to scroll smoothly or enter a custom link.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tracking Button Text
              </label>
              <input
                type="text"
                value={config.ctaTrackBtnText || ''}
                onChange={(e) => setConfig({ ...config, ctaTrackBtnText: e.target.value })}
                className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="Track Existing Shipment"
              />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 6. GOOGLE MAP LOCATION (Contact Page)                          */}
        {/* ============================================================== */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6c7a] flex items-center gap-2">
              <span>6. Google Map Location (Contact Page)</span>
            </h4>
            <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
              Integrated Map
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Map Card Title
              </label>
              <input
                type="text"
                value={config.mapLocationTitle}
                onChange={(e) => setConfig({ ...config, mapLocationTitle: e.target.value })}
                className="w-full text-xs font-bold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="SAIN International Logistics"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Map Location Physical Address (Uttara, Dhaka)
              </label>
              <input
                type="text"
                value={config.mapAddress}
                onChange={(e) => setConfig({ ...config, mapAddress: e.target.value })}
                className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="House 15, Road No. 5, Block B, Uttara-1230, Bangladesh"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Custom Google Maps Embed URL (Optional - leave empty to auto-build from address)
            </label>
            <input
              type="text"
              value={config.mapEmbedUrl}
              onChange={(e) => setConfig({ ...config, mapEmbedUrl: e.target.value })}
              className="w-full text-xs font-mono border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
              placeholder="https://maps.google.com/maps?q=... or leave blank"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              If left empty, Google Maps will automatically locate and pin the physical address specified above.
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 7. SMTP EMAIL NOTIFICATION CONFIGURATION                       */}
        {/* ============================================================== */}
        <div className="bg-gradient-to-br from-slate-900 to-[#0f1d26] p-6 rounded-2xl text-white space-y-5 border border-slate-800 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>7. Contact Form SMTP Gateway Setup</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    Auto-Forward to Inbox
                  </span>
                </h4>
                <p className="text-xs text-slate-400">
                  When visitors click &quot;Submit Message&quot; on the website, receive their full inquiry directly to your inbox.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer self-start sm:self-auto">
              <span className="text-xs font-semibold text-slate-300">Enable SMTP:</span>
              <input
                type="checkbox"
                checked={config.smtpEnabled}
                onChange={(e) => setConfig({ ...config, smtpEnabled: e.target.checked })}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                SMTP Server / Host
              </label>
              <input
                type="text"
                value={config.smtpHost}
                onChange={(e) => setConfig({ ...config, smtpHost: e.target.value })}
                className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                placeholder="smtp.gmail.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                SMTP Port
              </label>
              <input
                type="number"
                value={config.smtpPort}
                onChange={(e) => setConfig({ ...config, smtpPort: parseInt(e.target.value) || 587 })}
                className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                placeholder="587"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Security Protocol
              </label>
              <select
                value={config.smtpSecurity}
                onChange={(e) => setConfig({ ...config, smtpSecurity: e.target.value as 'tls' | 'ssl' })}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
              >
                <option value="tls">STARTTLS (Port 587 / Default)</option>
                <option value="ssl">SSL / TLS (Port 465)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                SMTP Username / Sender Email
              </label>
              <input
                type="email"
                value={config.smtpUser}
                onChange={(e) => setConfig({ ...config, smtpUser: e.target.value })}
                className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                placeholder="e.g. saininternationallogistics@gmail.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span>SMTP Password / App Password</span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-amber-400 hover:text-amber-300 text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={config.smtpPassword}
                  onChange={(e) => setConfig({ ...config, smtpPassword: e.target.value })}
                  className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400 pr-8"
                  placeholder="Google 16-character App Password"
                />
                <Lock className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5" />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                For Gmail: Use a 16-character &quot;App Password&quot; from your Google Account Security settings.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Recipient Email (Where to deliver inquiries)
              </label>
              <input
                type="email"
                value={config.receiverEmail}
                onChange={(e) => setConfig({ ...config, receiverEmail: e.target.value })}
                className="w-full text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                placeholder="saininternationallogistics@gmail.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Sender Display Name
            </label>
            <input
              type="text"
              value={config.senderName}
              onChange={(e) => setConfig({ ...config, senderName: e.target.value })}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
              placeholder="SAIN Logistics Web Desk"
            />
          </div>

          {/* Test SMTP Button & Diagnostic Output */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleTestSmtp}
              disabled={testLoading}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
            >
              {testLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Connecting & Testing SMTP...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test Email via SMTP</span>
                </>
              )}
            </button>

            {testResult && (
              <div
                className={`text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 max-w-md ${testResult.success
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
              >
                {testResult.success ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Save Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            Saved contact details and map settings take effect across the website instantly.
          </p>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#009b4d] hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Contact Settings</span>
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
