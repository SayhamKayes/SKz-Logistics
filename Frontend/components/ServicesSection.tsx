import React, { useState, useEffect, useRef } from 'react';
import { useTracking } from '../Context/TrackingContext';
import {
  Plane,
  Ship,
  Briefcase,
  Globe,
  FileCheck2,
  Warehouse,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  RotateCw,
} from 'lucide-react';

interface ServicesSectionProps {
  fullGrid?: boolean;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ fullGrid = false }) => {
  const { openQuoteModal, openTrackingModal, setActiveTab } = useTracking();
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeFlippedCard, setActiveFlippedCard] = useState<string | null>(null);

  // Drag & Swipe states
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const services = [
    {
      id: 'air-freight',
      title: 'Air Freight Priority',
      badge: 'Premier Priority Transit',
      icon: Plane,
      image: '/assets/images/air_freight.webp',
      description:
        'SAIN provides premier air freight solutions from our Uttara, Dhaka headquarters, specializing in swift cargo routing from major global hubs directly to Bangladesh. Expertly managing CFR terms and Customs Act 2023 clearance.',
      fullDescription:
        'Our dedicated air freight division handles time-critical commercial consignments, electronics, high-tech components, and sample collections from Guangzhou (CAN), Shenzhen, and global departure points directly into Hazrat Shahjalal International Airport (DAC). Full CFR and CIF documentation support with immediate tarmac clearance and expedited bonded warehouse transfer.',
      corridor: 'CAN / SZX → DAC (Dhaka)',
      incoterms: 'CFR, CIF, DDP, FOB',
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
      title: 'Sea Freight Ocean',
      badge: 'FCL & LCL Ocean Solutions',
      icon: Ship,
      image: '/assets/images/sea_freight.webp',
      description:
        'Comprehensive, cost-effective ocean shipping connecting global manufacturing ports directly to Chattogram & Mongla seaports for both Full Container Load (FCL) and Less Container Load (LCL).',
      fullDescription:
        'Large-volume marine forwarding engineered for raw materials, industrial machinery, textiles, and bulk goods. We manage the complete maritime chain with guaranteed vessel slots, seamless Bill of Lading documentation, port-side container destuffing, and inland bonded trucking across all divisions of Bangladesh.',
      corridor: 'China Ports → Chattogram / Mongla',
      incoterms: 'FOB, CFR, CIF, EXW',
      features: [
        'Direct container sailings into Chattogram (CTG) Port',
        'LCL cargo consolidation in Guangzhou & Yiwu warehouses',
        'Zero demurrage optimization through fast documentation',
        'Inland bonded transport to Dhaka, Gazipur, and Narayanganj',
      ],
      turnaround: '14 – 20 Days Sea Transit',
    },
    {
      id: 'hand-carry',
      title: 'Hand Carry Express',
      badge: 'Time-Critical Emergency Courier',
      icon: Briefcase,
      image: '/assets/images/hand_carry.webp',
      description:
        'Dedicated on-board couriers for urgent sample delivery, garment accessories, and critical industrial replacement components with personal accompaniment.',
      fullDescription:
        'When standard freight schedules are too slow for manufacturing deadlines, our trained logistics specialists personally escort parcels onto the next commercial flight. Real-time GPS communication from factory pickup to doorstep handover at your Dhaka manufacturing facility.',
      corridor: 'Guangzhou / HK → Dhaka Personal Escort',
      incoterms: 'DDP Door-to-Door',
      features: [
        'Dedicated onboard courier personally escorting consignment',
        'Next-flight-out dispatch from Hong Kong, Guangzhou, Bangkok',
        'Immediate hand-off at Hazrat Shahjalal International Airport',
        'Ideal for urgent buyer samples and pre-production trims',
      ],
      turnaround: '24 – 36 Hours Door-to-Door',
    },
    {
      id: 'customs-brokerage',
      title: 'B2B Customs Brokerage',
      badge: 'Customs Act 2023 Compliant',
      icon: FileCheck2,
      image: '/assets/images/custom_agent.webp',
      description:
        'Licensed customs brokerage team ensuring 100% compliant classification, valuation, and swift tariff settlement under Bangladesh Customs Act 2023.',
      fullDescription:
        'Decades of regulatory experience navigating NBR statutory regulatory orders (SROs), ASYCUDA World declarations, and duty assessments. We prevent costly border delays and confiscations through meticulous tariff classification, bonded warehousing permits, and transparent duty disbursements.',
      corridor: 'Dhaka ICD / Airport / Chattogram Port',
      incoterms: 'Duty Paid / DDP',
      features: [
        'HS Code classification and precise duty estimation',
        'Pre-arrival document processing for accelerated customs clearance',
        'Direct liaison with Dhaka Airport Cargo & Kamalapur ICD',
        'Resolution of non-tariff barriers and regulatory permits',
      ],
      turnaround: '24 – 48 Hours Port Release',
    },
    {
      id: 'warehousing-fulfillment',
      title: 'Warehousing & 3PL Logistics',
      badge: 'Secure Storage & Consolidation',
      icon: Warehouse,
      image: '/assets/images/warehousing.webp',
      description:
        'Strategic warehousing in Uttara, Dhaka and major China manufacturing hubs with inventory management, cargo consolidation, and cross-docking services.',
      fullDescription:
        'Advanced logistics warehousing equipped with barcode inventory tracking, secure CCTV surveillance, and climate-controlled storage zones. We offer cross-docking, shipment deconsolidation, repackaging, and nationwide dispatch for corporate supply chains and importers.',
      corridor: 'Sector 3, Uttara Central Distribution Hub',
      incoterms: 'Bonded & Non-Bonded 3PL Warehousing',
      features: [
        'Strategically positioned hub near Dhaka Airport (DAC)',
        '24/7 CCTV surveillance and secured cargo staging',
        'Barcode sorting, palletization, and repackaging',
        'Nationwide last-mile dispatch network across Bangladesh',
      ],
      turnaround: 'Flexible Storage & Dispatch',
    },
  ];

  const totalItems = services.length;

  // Auto-play infinite continuous carousel: moves 1 card smoothly every 3.5 seconds
  useEffect(() => {
    if (fullGrid || isPaused || isDragging) return;

    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % totalItems);
    }, 3500);

    return () => clearInterval(timer);
  }, [fullGrid, isPaused, isDragging, totalItems]);

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % totalItems);
  };

  // Drag / Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (dragStartX === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = dragStartX - endX;
    if (diff > 45) {
      handleNext(); // swipe left -> next card
    } else if (diff < -45) {
      handlePrev(); // swipe right -> prev card
    }
    setDragStartX(null);
    setIsPaused(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsPaused(true);
    setDragStartX(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || dragStartX === null) return;
    const diff = dragStartX - e.clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setDragStartX(null);
    setIsDragging(false);
    setIsPaused(false);
  };

  const toggleCardFlip = (id: string) => {
    setActiveFlippedCard((prev) => (prev === id ? null : id));
  };

  // 3 currently visible items in continuous circular order
  const visibleCards = [
    services[(startIndex) % totalItems],
    services[(startIndex + 1) % totalItems],
    services[(startIndex + 2) % totalItems],
  ];

  return (
    <section id="services" className="relative py-16 px-4 sm:px-8 z-10 bg-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-teal-50 border border-teal-200 rounded-full text-[#1a6c7a] text-xs font-bold tracking-wider uppercase shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#1a6c7a]" />
            <span>Comprehensive Freight Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-brand text-[#0f172a] tracking-tight">
            Tailored Logistics For <span className="text-amber-500">Global Commerce</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            From urgent documents to industrial bulk consignments, we provide seamless door-to-door freight forwarding, professional customs clearance under the Customs Act 2023, and real-time shipment transparency.
          </p>
        </div>

        {/* ============================================================== */}
        {/* CASE 1: FULL GRID MODE (Used on /services page)               */}
        {/* ============================================================== */}
        {fullGrid ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((srv) => (
              <FlipCardItem
                key={srv.id}
                service={srv}
                isFlipped={activeFlippedCard === srv.id}
                onToggleFlip={() => toggleCardFlip(srv.id)}
                onQuote={openQuoteModal}
                onTrack={openTrackingModal}
              />
            ))}
          </div>
        ) : (
          /* ============================================================== */
          /* CASE 2: 3-COLUMN INFINITE CONTINUOUS SLIDER (Home Page)        */
          /* ============================================================== */
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              if (!isDragging) setIsPaused(false);
            }}
          >
            {/* Slider Viewport with Drag Support */}
            <div
              className={`overflow-hidden select-none cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-1 transition-all duration-500 ease-out">
                {visibleCards.map((srv, cardIdx) => (
                  <FlipCardItem
                    key={`${srv.id}-${cardIdx}-${startIndex}`}
                    service={srv}
                    isFlipped={activeFlippedCard === srv.id}
                    onToggleFlip={() => toggleCardFlip(srv.id)}
                    onQuote={openQuoteModal}
                    onTrack={openTrackingModal}
                  />
                ))}
              </div>
            </div>

            {/* Carousel Navigation Arrows (Vertically Centered On Cards) */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous service"
              className="absolute left-0 -translate-x-3 sm:-translate-x-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer hover:bg-slate-50"
            >
              <ChevronLeft className="w-6 h-6 text-slate-700" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next service"
              className="absolute right-0 translate-x-3 sm:translate-x-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer hover:bg-slate-50"
            >
              <ChevronRight className="w-6 h-6 text-slate-700" />
            </button>

            {/* Slider Dots */}
            <div className="flex items-center justify-center gap-2 pt-8">
              {services.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setStartIndex(idx)}
                  aria-label={`Go to service ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    startIndex === idx
                      ? 'w-8 bg-[#1a6c7a]'
                      : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

            {/* View All Button Under Slider (Solid Brand Color Matching SAIN Logo, No Gradient) */}
            <div className="pt-10 text-center">
              <button
                onClick={() => {
                  setActiveTab('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#1a6c7a] hover:bg-[#145561] text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer active:scale-98"
              >
                <span>View All Services</span>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// ==============================================================================
// 3D FLIP CARD COMPONENT (Clean Image-Dominant Front & Spec-Rich Back)
// ==============================================================================
interface FlipCardProps {
  service: any;
  isFlipped: boolean;
  onToggleFlip: () => void;
  onQuote: () => void;
  onTrack: () => void;
}

const FlipCardItem: React.FC<FlipCardProps> = ({
  service,
  isFlipped,
  onToggleFlip,
  onQuote,
  onTrack,
}) => {
  const IconComponent = service.icon;

  return (
    <div
      className="perspective-1000 w-full h-[500px] group cursor-pointer"
      onClick={onToggleFlip}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d rounded-3xl shadow-md hover:shadow-xl ${
          isFlipped ? 'rotate-y-180' : 'group-hover:rotate-y-180'
        }`}
      >
        {/* ============================================================== */}
        {/* CARD FRONT FACE (Clean Image-Dominant Presentation)            */}
        {/* ============================================================== */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-slate-950 rounded-3xl overflow-hidden border border-slate-200 shadow-md flex flex-col justify-between group">
          {/* Full-bleed background image */}
          <img
            src={service.image}
            alt={service.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
          />
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />

          {/* Top Floating Badge & Turnaround */}
          <div className="relative z-10 p-5 flex items-center justify-between gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md">
              <IconComponent className="w-3.5 h-3.5 text-amber-400" />
              <span>{service.badge}</span>
            </span>

            <span className="bg-amber-500/90 backdrop-blur-md text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{service.turnaround}</span>
            </span>
          </div>

          {/* Bottom Title & Flip Indicator */}
          <div className="relative z-10 p-6 space-y-3 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-12">
            <h3 className="text-2xl sm:text-3xl font-black font-brand text-white tracking-tight drop-shadow-md">
              {service.title}
            </h3>

            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-semibold text-amber-400">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Hover or tap to flip for specifications</span>
              </span>
              <span className="text-white font-bold">&rarr;</span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CARD BACK FACE (Revealed on 3D Flip)                          */}
        {/* ============================================================== */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-[#0c1a24] via-[#153243] to-[#0c1a24] rounded-3xl p-6 sm:p-7 text-white flex flex-col justify-between border-2 border-amber-500/40 shadow-2xl">
          <div className="space-y-4 overflow-y-auto pr-1">
            {/* Top header */}
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-brand tracking-tight text-white">
                    {service.title}
                  </h4>
                  <p className="text-[11px] text-amber-400 font-medium">Detailed Specifications</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase rounded-lg">
                Verified
              </span>
            </div>

            {/* Full description */}
            <p className="text-slate-300 text-xs leading-relaxed">
              {service.fullDescription}
            </p>

            {/* Corridor & Incoterms Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Key Corridor</span>
                <span className="text-xs font-bold text-white block mt-0.5">{service.corridor}</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Incoterms</span>
                <span className="text-xs font-bold text-amber-400 block mt-0.5">{service.incoterms}</span>
              </div>
            </div>

            {/* Bullet Features */}
            <div className="space-y-2 pt-2 border-t border-slate-700/60">
              {service.features.map((feat: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons on Back */}
          <div className="pt-4 border-t border-slate-700/80 flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuote();
              }}
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Instant Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTrack();
              }}
              className="py-2.5 px-3.5 bg-slate-800/80 hover:bg-slate-800 text-white font-bold text-xs rounded-xl border border-slate-600 transition cursor-pointer"
            >
              Track
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
