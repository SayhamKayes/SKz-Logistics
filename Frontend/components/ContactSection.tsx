import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'Air Freight Priority',
    consignmentNo: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('This field is required. Please fill out your Name, Email and Message.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceType: 'Air Freight Priority',
        consignmentNo: '',
        message: '',
      });
    }, 700);
  };

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-8 z-10 bg-white">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-600 text-xs font-bold tracking-wider uppercase">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Connect with SAIN</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-brand text-[#0f172a] tracking-tight">
            Get in <span className="text-amber-500">Touch</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Have questions regarding cargo rates from Guangzhou, customs declaration, or consignment status? Our logistics specialists in Uttara, Dhaka are ready to assist.
          </p>
        </div>

        {/* Info Grid + Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Authentic Info Cards */}
          <div className="lg:col-span-5 space-y-5">
            {/* Phone Numbers Card */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#153243] flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500" />
                <span>Direct Contact Numbers</span>
              </h3>
              <div className="space-y-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 font-medium block">General Inquiries:</span>
                  <a
                    href="tel:+8801719068999"
                    className="text-base font-bold text-[#153243] hover:text-amber-600 transition font-mono"
                  >
                    (880) 1719 068999
                  </a>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-500 font-medium block">Accounts &amp; Invoicing:</span>
                  <a
                    href="tel:+8801306412045"
                    className="text-base font-bold text-[#153243] hover:text-amber-600 transition font-mono"
                  >
                    (880) 1306 412045
                  </a>
                </div>
              </div>
            </div>

            {/* Email & Web */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#153243] flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500" />
                <span>Electronic Mail</span>
              </h3>
              <div className="space-y-2 text-sm">
                <a
                  href="mailto:saininternationallogistics@gmail.com"
                  className="block text-[#153243] font-semibold hover:text-amber-600 transition"
                >
                  saininternationallogistics@gmail.com
                </a>
                <span className="block text-slate-500 text-xs font-mono">
                  saininternationallogistics.com
                </span>
              </div>
            </div>

            {/* Location & Office Hours */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#153243] flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Headquarters &amp; Business Hours</span>
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Base in Sector 3, Uttara, Dhaka-1230, Bangladesh</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between text-slate-700">
                  <span>Saturday — Thursday:</span>
                  <strong className="text-emerald-700 font-mono font-bold">10:00 AM – 9:00 PM</strong>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Friday:</span>
                  <span className="text-rose-600 font-bold">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Send Us a Message Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-2xl">
            <h3 className="text-2xl font-black font-brand text-[#0f172a] mb-2">
              Send Us a Message
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Fill out the form below and our operations desk will revert back promptly.
            </p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center space-y-3 animate-in fade-in">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-[#0f172a]">
                  Message Sent Successfully!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Thank you for reaching out to SAIN International Logistics. A representative will contact you via email or phone shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-5 py-2.5 bg-[#153243] hover:bg-[#1a365d] text-xs font-bold text-white uppercase tracking-wider rounded-xl transition"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Your Name <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Md Sakib"
                      className="w-full bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-[#153243] focus:bg-white focus:ring-4 focus:ring-amber-500/10 rounded-2xl px-4 py-3 text-sm text-[#0f172a] placeholder-slate-400 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Email Address <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. sakib@example.com"
                      className="w-full bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-[#153243] focus:bg-white focus:ring-4 focus:ring-amber-500/10 rounded-2xl px-4 py-3 text-sm text-[#0f172a] placeholder-slate-400 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+880 1700 000000"
                      className="w-full bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-[#153243] focus:bg-white focus:ring-4 focus:ring-amber-500/10 rounded-2xl px-4 py-3 text-sm text-[#0f172a] placeholder-slate-400 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Service Requirement
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-[#153243] focus:bg-white focus:ring-4 focus:ring-amber-500/10 rounded-2xl px-4 py-3 text-sm text-[#0f172a] focus:outline-none transition"
                    >
                      <option value="Air Freight Priority">Air Freight (Guangzhou to Dhaka)</option>
                      <option value="Sea Freight (FCL/LCL)">Sea Freight Ocean Cargo</option>
                      <option value="Hand Carry Express">Hand Carry Express Courier</option>
                      <option value="Export Logistics">Export Outbound Forwarding</option>
                      <option value="Customs Act 2023 Inquiry">Customs Clearance Consulting</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Consignment No. (Optional, if already shipped)
                  </label>
                  <input
                    type="text"
                    value={formData.consignmentNo}
                    onChange={(e) => setFormData({ ...formData, consignmentNo: e.target.value })}
                    placeholder="e.g. 12345 or SAIN-78492-BD"
                    className="w-full bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-[#153243] focus:bg-white focus:ring-4 focus:ring-amber-500/10 rounded-2xl px-4 py-3 text-sm text-[#0f172a] placeholder-slate-400 focus:outline-none transition font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Inquiry or Shipment Specs <span className="text-amber-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please specify weight, volume, cargo description, origin city, and required delivery timeline..."
                    className="w-full bg-slate-50 border-2 border-slate-200 hover:border-slate-300 focus:border-[#153243] focus:bg-white focus:ring-4 focus:ring-amber-500/10 rounded-2xl p-4 text-sm text-[#0f172a] placeholder-slate-400 focus:outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#153243] hover:bg-[#1a365d] active:scale-[0.99] text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>SUBMIT MESSAGE</span>
                      <Send className="w-4 h-4 text-amber-400" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
