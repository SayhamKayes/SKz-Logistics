import React from 'react';
import { useTracking } from '../Context/TrackingContext';
import {
  Compass,
  Target,
  Award,
  CheckCircle2,
  ShieldCheck,
  Building,
  Users,
  MapPin,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { openQuoteModal, openTrackingModal } = useTracking();

  return (
    <section id="about" className="relative py-24 px-4 sm:px-8 z-10 bg-white">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Top Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-[#1a6c7a] text-xs font-semibold tracking-wider uppercase">
            <Building className="w-3.5 h-3.5" />
            <span>WHO WE ARE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-brand text-[#0f172a] tracking-tight">
            About <span className="text-amber-500">SAIN Ship</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            <strong>SAIN</strong> is a trusted shipping and courier company dedicated to connecting people and businesses with fast, secure, and reliable delivery services. Our mission is to simplify the shipping process while providing exceptional customer service.
          </p>
        </div>

        {/* Narrative & Visual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Team & Depot Showcase Image */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl relative group">
              <img
                src="/assets/images/team_office.webp"
                alt="SAIN International Logistics Team in Uttara Dhaka"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-md">
                <div className="flex items-center gap-2 text-[#153243] font-bold text-xs uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Headquarters: Uttara, Dhaka</span>
                </div>
                <p className="text-slate-600 text-xs mt-1">
                  Connecting Guangzhou & global export hubs directly to Bangladesh consignees.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Mission, Vision, Values */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-brand text-[#0f172a]">
                  Our Mission
                </h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our mission at <strong>SAIN INTERNATIONAL LOGISTICS</strong> is to empower global trade by providing fast, secure, and highly compliant logistics solutions that seamlessly connect Bangladesh to international markets. Whether you&apos;re sending a small package or managing bulk shipments, we ensure your items reach safely, on time, every time.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-50 text-[#1a6c7a] rounded-xl border border-teal-200">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-brand text-[#0f172a]">
                  Our Vision
                </h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our vision is to be the region&apos;s most trusted freight forwarding partner, setting the industry standard for supply chain transparency, technological innovation, and absolute reliability.
              </p>
            </div>

            {/* Core Values 3-column pill */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1 shadow-xs">
                <Award className="w-5 h-5 text-amber-500 mx-auto" />
                <h4 className="font-bold text-xs text-[#0f172a]">Integrity &amp; Transparency</h4>
                <p className="text-[11px] text-slate-500">Honest pricing &amp; open communication</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1 shadow-xs">
                <TrendingUp className="w-5 h-5 text-[#1a6c7a] mx-auto" />
                <h4 className="font-bold text-xs text-[#0f172a]">Operational Excellence</h4>
                <p className="text-[11px] text-slate-500">Strict on-time delivery metrics</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-xs text-[#0f172a]">Regulatory Expertise</h4>
                <p className="text-[11px] text-slate-500">Mastery of Customs Act 2023</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ready to Ship CTA Banner from original website */}
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 bg-[#153243] text-white shadow-2xl">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Ready To Ship? Let&apos;s Get Your Packages Moving!
            </span>
            <h3 className="text-2xl sm:text-4xl font-black font-brand text-white leading-tight">
              Join thousands of satisfied customers who trust 𝗦𝗔𝗜𝗡 Ship for safe and timely deliveries.
            </h3>
            <p className="text-slate-200 text-sm sm:text-base">
              Start shipping with us today and experience convenience at every step! Transparent rates, zero hidden surcharges, and direct doorstep delivery across Bangladesh.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => openTrackingModal()}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/20 transition flex items-center gap-2 cursor-pointer"
              >
                <span>Track Existing Shipment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
