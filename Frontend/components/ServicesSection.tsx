import React, { useState, useEffect } from 'react';
import { useTracking } from '../Context/TrackingContext';
import {
  DEFAULT_SERVICE_CARDS,
  DEFAULT_SERVICES_HEADER,
  ServiceCard,
  ServicesSectionHeaderConfig,
} from './admin/ServicesContentEditor';
import {
  ShieldCheck,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

interface ServicesSectionProps {
  fullGrid?: boolean;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ fullGrid = false }) => {
  const { setActiveTab } = useTracking();
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeFlippedCard, setActiveFlippedCard] = useState<string | null>(null);

  // Drag & Swipe states
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Header config state
  const [headerConfig, setHeaderConfig] = useState<ServicesSectionHeaderConfig>(() => {
    try {
      const stored = localStorage.getItem('sain_services_section_config');
      if (stored) return { ...DEFAULT_SERVICES_HEADER, ...JSON.parse(stored) };
    } catch {}
    return DEFAULT_SERVICES_HEADER;
  });

  // Services cards state
  const [services, setServices] = useState<ServiceCard[]>(() => {
    try {
      const stored = localStorage.getItem('sain_services_content_config');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any) => ({
            id: item.id || `service-${Date.now()}`,
            title: item.title || 'Untitled Service',
            image: item.image || '/assets/images/air_freight.webp',
            description: item.fullDescription || item.description || '',
            features: Array.isArray(item.features) ? item.features : [],
          }));
        }
      }
    } catch {}
    return DEFAULT_SERVICE_CARDS;
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const storedHdr = localStorage.getItem('sain_services_section_config');
        if (storedHdr) setHeaderConfig({ ...DEFAULT_SERVICES_HEADER, ...JSON.parse(storedHdr) });

        const storedCards = localStorage.getItem('sain_services_content_config');
        if (storedCards) {
          const parsed = JSON.parse(storedCards);
          if (Array.isArray(parsed)) {
            setServices(parsed.map((item: any) => ({
              id: item.id,
              title: item.title,
              image: item.image,
              description: item.fullDescription || item.description || '',
              features: Array.isArray(item.features) ? item.features : [],
            })));
          }
        }
      } catch {}
    };

    window.addEventListener('sain_services_content_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('sain_services_content_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const totalItems = services.length;

  // Auto-play infinite continuous carousel: moves 1 card smoothly every 3.5 seconds
  useEffect(() => {
    if (fullGrid || isPaused || isDragging || totalItems <= 1) return;

    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % totalItems);
    }, 3500);

    return () => clearInterval(timer);
  }, [fullGrid, isPaused, isDragging, totalItems]);

  const handlePrev = () => {
    if (totalItems <= 0) return;
    setStartIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleNext = () => {
    if (totalItems <= 0) return;
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
      handleNext();
    } else if (diff < -45) {
      handlePrev();
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

  // Up to 3 visible items for slider
  const visibleCards = totalItems > 0 ? [
    services[(startIndex) % totalItems],
    services[(startIndex + 1) % totalItems],
    services[(startIndex + 2) % totalItems],
  ] : [];

  return (
    <section id="services" className="relative py-16 px-4 sm:px-8 z-10 bg-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-teal-50 border border-teal-200 rounded-full text-[#1a6c7a] text-xs font-bold tracking-wider uppercase shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#1a6c7a]" />
            <span>{headerConfig.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-brand text-[#0f172a] tracking-tight">
            {(() => {
              const parts = headerConfig.title.split(' ');
              if (parts.length > 2) {
                const lastTwo = parts.slice(-2).join(' ');
                const first = parts.slice(0, -2).join(' ');
                return (
                  <>
                    {first} <span className="text-amber-500">{lastTwo}</span>
                  </>
                );
              }
              return headerConfig.title;
            })()}
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {headerConfig.description}
          </p>
        </div>

        {/* ============================================================== */}
        {/* CASE 1: FULL GRID MODE (Used on /services page)               */}
        {/* ============================================================== */}
        {fullGrid ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((srv) => (
              <ServiceFlipCard
                key={srv.id}
                service={srv}
                isFlipped={activeFlippedCard === srv.id}
                onToggleFlip={() => toggleCardFlip(srv.id)}
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
                  <ServiceFlipCard
                    key={`${srv.id}-${cardIdx}-${startIndex}`}
                    service={srv}
                    isFlipped={activeFlippedCard === srv.id}
                    onToggleFlip={() => toggleCardFlip(srv.id)}
                  />
                ))}
              </div>
            </div>

            {/* Carousel Navigation Arrows */}
            {totalItems > 3 && (
              <>
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
              </>
            )}

            {/* Slider Dots */}
            {totalItems > 1 && (
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
            )}

            {/* View All Button Under Slider */}
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
// 3D FLIP CARD COMPONENT
// Front face: Clean, pure thumbnail image only (as requested by user)
// Back face: Heading, description, and key points list (instant quote/track removed)
// ==============================================================================
interface ServiceFlipCardProps {
  service: ServiceCard;
  isFlipped: boolean;
  onToggleFlip: () => void;
}

const ServiceFlipCard: React.FC<ServiceFlipCardProps> = ({
  service,
  isFlipped,
  onToggleFlip,
}) => {
  return (
    <div
      className="perspective-1000 w-full h-[480px] group cursor-pointer select-none"
      onClick={onToggleFlip}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d rounded-3xl shadow-md hover:shadow-xl ${
          isFlipped ? 'rotate-y-180' : 'group-hover:rotate-y-180'
        }`}
      >
        {/* ============================================================== */}
        {/* CARD FRONT FACE: Pure Full-Bleed Thumbnail Image (No Text)     */}
        {/* ============================================================== */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-slate-950 rounded-3xl overflow-hidden border border-slate-200/90 shadow-md">
          {service.image ? (
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/images/air_freight.webp';
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-6 text-center">
              <span className="text-base font-bold text-white">{service.title}</span>
              <span className="text-xs text-slate-400 mt-1">Hover to view details</span>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* CARD BACK FACE: Revealed on 3D Flip (Heading, Desc, Key Points) */}
        {/* ============================================================== */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-[#0c1a24] via-[#153243] to-[#0c1a24] rounded-3xl p-7 text-white flex flex-col justify-between border-2 border-amber-500/40 shadow-2xl">
          <div className="space-y-4 overflow-y-auto pr-1">
            {/* Header */}
            <div className="border-b border-slate-700/80 pb-3">
              <h4 className="text-xl font-bold font-brand tracking-tight text-white">
                {service.title}
              </h4>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mt-0.5 block">
                Service Overview
              </span>
            </div>

            {/* Description */}
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              {service.description}
            </p>

            {/* Key Points / Features */}
            {service.features && service.features.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-slate-700/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  Key Points:
                </span>
                {service.features.map((feat: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
              SAIN International Logistics
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
