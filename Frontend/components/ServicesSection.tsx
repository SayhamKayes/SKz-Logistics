import React from 'react';
import { useTracking } from '../Context/TrackingContext';
import {
  Plane,
  Ship,
  Briefcase,
  Globe,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { openQuoteModal, openTrackingModal } = useTracking();

  const services = [
    {
      id: 'air-freight',
      title: 'Air Freight',
      badge: 'Premier Priority Transit',
      icon: Plane,
      image: '/assets/images/air_freight.webp',
      description:
        'SAIN INTERNATIONAL LOGISTICS provides premier air freight solutions from our base in Uttara, Dhaka, specializing in swift, high-efficiency cargo routing from major global hubs directly to Bangladesh. Our expert team meticulously manages the entire shipping lifecycle, navigating complex trade terms like CFR and leveraging our deep knowledge of the Customs Act 2023 for seamless, compliant customs clearance. Supported by our custom digital infrastructure for transparent, real-time shipment tracking, we deliver unmatched speed and reliability for all your global air freight challenges.',
      features: [
        'Guangzhou (CAN) & Shenzhen to Dhaka (DAC) daily schedules',
        'CFR & CIF Incoterms handling with transparent paperwork',
        'Full compliance with Bangladesh Customs Act 2023',
        'Direct airport customs clearance & swift release',
      ],
      turnaround: '2 – 4 Days Transit',
    },
    {
      id: 'sea-freight',
      title: 'Sea Freight',
      badge: 'FCL & LCL Ocean Solutions',
      icon: Ship,
      image: '/assets/images/sea_freight.webp',
      description:
        'SAIN INTERNATIONAL LOGISTICS delivers comprehensive, cost-effective sea freight solutions from our Uttara, Dhaka headquarters, connecting global manufacturing hubs directly to Bangladesh’s seaports. Our experienced team manages the entire ocean shipping lifecycle for both FCL and LCL cargo, expertly navigating complex maritime trade terms like CFR. By applying our deep understanding of the Customs Act 2023 for rapid, compliant customs clearance and utilizing our custom digital tracking infrastructure, we ensure your large-scale shipments experience smooth transit and transparent visibility from the port of loading to final delivery.',
      features: [
        'Full Container Load (FCL) & Less Container Load (LCL)',
        'Connecting Yantian, Ningbo, Shanghai to Chattogram & Mongla',
        'End-to-end bill of lading and container tracking',
        'Cost-effective pricing for heavy bulk raw materials',
      ],
      turnaround: '12 – 18 Days Transit',
    },
    {
      id: 'hand-carry',
      title: 'Hand Carry Express',
      badge: 'Ultra Time-Critical Courier',
      icon: Briefcase,
      image: '/assets/images/cargo_handling.webp',
      description:
        'When time is of the utmost essence, SAIN provides dedicated on-board couriers who personally accompany your urgent shipments from origin to destination. Ideal for critical prototype hardware, sensitive commercial contracts, garment design samples, and high-value consignments requiring continuous personal escort and immediate customs clearance at Dhaka airport.',
      features: [
        'Dedicated On-Board Courier (OBC) accompaniment',
        'Same-day or next-day personal doorstep handover',
        'Maximum chain-of-custody security with live SMS updates',
        'Expedited personal baggage customs formalities',
      ],
      turnaround: '12 – 24 Hours Urgent',
    },
    {
      id: 'export-worldwide',
      title: 'Export Logistics',
      badge: 'Connecting Bangladesh to Global Markets',
      icon: Globe,
      image: '/assets/images/port_operations.webp',
      description:
        'Empowering Bangladeshi manufacturers and exporters with reliable outbound forwarding. From ready-made garments and textiles to jute, leather, and artisanal goods, our team facilitates customs documentation, export certificates, port booking, and international delivery to over 140 countries.',
      features: [
        'Worldwide export documentation & certificate of origin',
        'Direct factory pickup across Dhaka, Gazipur, Narayanganj',
        'Customs broker representation at all major departure points',
        'Competitive air & ocean export contract rates',
      ],
      turnaround: 'Global Network Coverage',
    },
  ];

  return (
    <section id="services" className="relative py-24 px-4 sm:px-8 z-10 bg-white">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-[#1a6c7a] text-xs font-semibold tracking-wider uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Comprehensive Freight Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-brand text-[#0f172a] tracking-tight">
            Tailored Logistics For <span className="text-amber-500">Global Commerce</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            From urgent documents to industrial bulk consignments, we provide seamless door-to-door freight forwarding, professional customs clearance under the Customs Act 2023, and real-time shipment transparency.
          </p>
        </div>

        {/* Services List / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((srv, idx) => {
            const IconComponent = srv.icon;
            return (
              <div
                key={srv.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 hover:border-[#1a6c7a] transition-all duration-300 flex flex-col group shadow-lg hover:shadow-xl"
              >
                {/* Visual Asset Header */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-900">
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Badge & Turnaround */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-[#153243] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                      <IconComponent className="w-3.5 h-3.5 text-[#1a6c7a]" />
                      <span>{srv.badge}</span>
                    </span>
                  </div>

                  <div className="absolute bottom-4 right-4 bg-amber-500 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{srv.turnaround}</span>
                  </div>

                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl sm:text-3xl font-black font-brand text-white">
                      {srv.title}
                    </h3>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {srv.description}
                  </p>

                  {/* Features Bullet List */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-100">
                    {srv.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom CTAs */}
                  <div className="pt-4 flex items-center justify-between gap-4 border-t border-slate-100">
                    <button
                      onClick={() => openQuoteModal()}
                      className="px-6 py-3 bg-[#153243] hover:bg-[#1a6c7a] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      <span>GET a quote</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </button>

                    <button
                      onClick={() => openTrackingModal()}
                      className="text-xs font-semibold text-slate-600 hover:text-[#1a6c7a] transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>Track Shipment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
