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
    <section id="about" className="relative py-24 px-4 sm:px-8 z-10">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Top Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-semibold tracking-wider uppercase">
            <Building className="w-3.5 h-3.5" />
            <span>WHO WE ARE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-brand text-slate-100 tracking-tight">
            About <span className="text-amber-400">SAIN Ship</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            <strong>SAIN ship</strong> is a trusted shipping and courier company dedicated to connecting people and businesses with fast, secure, and reliable delivery services. Our mission is to simplify the shipping process while providing exceptional customer service.
          </p>
        </div>

        {/* Narrative & Visual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Team & Depot Showcase Image */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl relative group">
              <img
                src="/assets/images/team_office.webp"
                alt="SAIN International Logistics Team in Uttara Dhaka"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 p-4 glass-panel rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Headquarters: Uttara, Dhaka</span>
                </div>
                <p className="text-slate-200 text-xs mt-1">
                  Connecting Guangzhou & global export hubs directly to Bangladesh consignees.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Mission, Vision, Values */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-brand text-slate-100">
                  Our Mission
                </h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Our mission at <strong>SAIN INTERNATIONAL LOGISTICS</strong> is to empower global trade by providing fast, secure, and highly compliant logistics solutions that seamlessly connect Bangladesh to international markets. Whether you&apos;re sending a small package or managing bulk shipments, we ensure your items reach safely, on time, every time.
              </p>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-brand text-slate-100">
                  Our Vision
                </h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Our vision is to be the region&apos;s most trusted freight forwarding partner, setting the industry standard for supply chain transparency, technological innovation, and absolute reliability.
              </p>
            </div>

            {/* Core Values 3-column pill */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="glass-card p-4 rounded-2xl border border-slate-700 text-center space-y-1">
                <Award className="w-5 h-5 text-amber-400 mx-auto" />
                <h4 className="font-bold text-xs text-slate-100">Integrity &amp; Transparency</h4>
                <p className="text-[11px] text-slate-400">Honest pricing &amp; open communication</p>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-slate-700 text-center space-y-1">
                <TrendingUp className="w-5 h-5 text-cyan-400 mx-auto" />
                <h4 className="font-bold text-xs text-slate-100">Operational Excellence</h4>
                <p className="text-[11px] text-slate-400">Strict on-time delivery metrics</p>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-slate-700 text-center space-y-1">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-xs text-slate-100">Regulatory Expertise</h4>
                <p className="text-[11px] text-slate-400">Mastery of Customs Act 2023</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ready to Ship CTA Banner from original website */}
        <div className="relative rounded-3xl overflow-hidden border border-amber-500/40 p-8 sm:p-12 bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950 shadow-2xl">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Ready To Ship? Let&apos;s Get Your Packages Moving!
            </span>
            <h3 className="text-2xl sm:text-4xl font-black font-brand text-slate-100 leading-tight">
              Join thousands of satisfied customers who trust 𝗦𝗔𝗜𝗡 Ship for safe and timely deliveries.
            </h3>
            <p className="text-slate-300 text-sm sm:text-base">
              Start shipping with us today and experience convenience at every step! Transparent rates, zero hidden surcharges, and direct doorstep delivery across Bangladesh.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => openQuoteModal()}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/25 transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Request Quotation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => openTrackingModal()}
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-700 transition flex items-center gap-2 cursor-pointer"
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
