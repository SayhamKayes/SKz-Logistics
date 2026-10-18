import React, { useState, useEffect } from 'react';
import { useTracking } from '../Context/TrackingContext';
import {
  DEFAULT_SERVICE_CARDS,
  DEFAULT_SERVICES_HEADER,
  ServiceCard,
  ServicesSectionHeaderConfig,
} from './admin/ServicesContentEditor';
import { sanitizeRichHtml } from '../utils/sanitizeHtml';
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
  const [isPaused, setIsPaused] = useState(false);
  const [withTransition, setWithTransition] = useState(true);
  const [isSliding, setIsSliding] = useState(false);

  // Responsive cards to show
  const [cardsToShow, setCardsToShow] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
    }
    return 1;
  });

  // Drag & Swipe states
  const [dragStartX, setDragStartX] = useState<number | null>(null);

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
            image: item.image || '',
            description: item.fullDescription || item.description || '',
            features: Array.isArray(item.features) ? item.features : [],
          }));
        }
      }
    } catch {}
    return DEFAULT_SERVICE_CARDS;
  });

  const baseCount = services.length;

  // 5x cloned list ensures a huge buffer on both sides so slides NEVER run out or go blank
  const clonedServices = React.useMemo(() => {
    if (baseCount === 0) return [];
    return [...services, ...services, ...services, ...services, ...services];
  }, [services, baseCount]);

  // Start centered in the middle copy (index baseCount * 2)
  const [currentIndex, setCurrentIndex] = useState(baseCount * 2);

  // Keep currentIndex centered when services change
  useEffect(() => {
    setCurrentIndex(services.length * 2);
  }, [services.length]);

  // Handle responsive resize for exact track translations
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setCardsToShow(3);
      } else if (window.innerWidth >= 768) {
        setCardsToShow(2);
      } else {
        setCardsToShow(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for admin content updates
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

  // Seamless jump re-centering: re-enable CSS transition after instantaneous position reset
  useEffect(() => {
    if (!withTransition) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setWithTransition(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [withTransition]);

  // Safety timer to clear isSliding in case onTransitionEnd doesn't fire
  useEffect(() => {
    if (isSliding) {
      const timer = setTimeout(() => {
        setIsSliding(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isSliding]);

  const handleNext = () => {
    if (baseCount <= 1 || isSliding || !withTransition) return;
    setIsSliding(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (baseCount <= 1 || isSliding || !withTransition) return;
    setIsSliding(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    // CRITICAL: ignore bubbling transitionend events from child flip cards!
    if (e.target !== e.currentTarget) return;
    setIsSliding(false);
    if (baseCount <= 0) return;

    // When advancing past the 3rd set, silently wrap back into the 2nd/3rd set
    if (currentIndex >= baseCount * 3) {
      setWithTransition(false);
      setCurrentIndex((prev) => (prev % baseCount) + baseCount * 2);
    }
    // When moving backwards before the 2nd set, silently wrap forward into the 3rd set
    else if (currentIndex < baseCount * 2) {
      setWithTransition(false);
      setCurrentIndex((prev) => (prev % baseCount) + baseCount * 2);
    }
  };

  // Auto-play infinite continuous carousel: moves 1 slide smoothly every 1.5 seconds (1500ms)
  useEffect(() => {
    if (fullGrid || isPaused || baseCount <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, 1500);

    return () => clearInterval(timer);
  }, [fullGrid, isPaused, baseCount, isSliding, withTransition]);

  // Drag / Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (dragStartX === null) return;
    const diff = dragStartX - e.changedTouches[0].clientX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setDragStartX(null);
    setIsPaused(false);
  };

  return (
    <section id="services" className="relative py-16 px-4 sm:px-8 z-10 bg-[#FFFFFF]" style={{ backgroundColor: '#FFFFFF' }}>
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

          <p
            className="text-slate-600 text-sm sm:text-base leading-relaxed rich-text-content"
            dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(headerConfig.description) }}
          />
        </div>

        {/* ============================================================== */}
        {/* CASE 1: FULL GRID MODE (Used on /services page)               */}
        {/* ============================================================== */}
        {fullGrid ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((srv) => (
              <ServiceFlipCard key={srv.id} service={srv} />
            ))}
          </div>
        ) : (
          /* ============================================================== */
          /* CASE 2: SEAMLESS INFINITE LOOPING SLIDER (Home Page)           */
          /* ============================================================== */
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Cards Viewport + Navigation Arrows wrapper */}
            <div className="relative">
              {/* Slider Viewport */}
              <div
                className="overflow-hidden select-none py-8 px-1"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="flex -mx-3 sm:-mx-4"
                  style={{
                    transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`,
                    transition: withTransition
                      ? 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1)'
                      : 'none',
                  }}
                  onTransitionEnd={handleTransitionEnd}
                >
                  {clonedServices.map((_, slideIdx) => {
                    const srv = services[slideIdx % baseCount];
                    if (!srv) return null;
                    return (
                      <div
                        key={`${srv.id}-${slideIdx}`}
                        className="shrink-0 w-full md:w-1/2 lg:w-1/3 px-3 sm:px-4"
                      >
                        <ServiceFlipCard service={srv} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Carousel Navigation Arrows - Vertically Centered Across Middle of Cards */}
              {baseCount > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous service"
                    className="absolute left-0 -translate-x-3 sm:-translate-x-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer hover:bg-slate-50"
                  >
                    <ChevronLeft className="w-6 h-6 text-slate-700" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next service"
                    className="absolute right-0 translate-x-3 sm:translate-x-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer hover:bg-slate-50"
                  >
                    <ChevronRight className="w-6 h-6 text-slate-700" />
                  </button>
                </>
              )}
            </div>

            {/* View All Button Under Slider */}
            <div className="pt-8 text-center">
              <button
                onClick={() => {
                  setActiveTab('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#1a6c7a] hover:bg-[#145561] text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer active:scale-98"
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
// Back face: Heading, description, and key points list (reveals on mouse hover or tap)
// ==============================================================================
interface ServiceFlipCardProps {
  service: ServiceCard;
}

const ServiceFlipCard: React.FC<ServiceFlipCardProps> = ({ service }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const isFlipped = isHovered || isClicked;

  return (
    <div
      className="perspective-1000 w-full h-[480px] group cursor-pointer select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsClicked(false);
      }}
      onClick={() => setIsClicked((prev) => !prev)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d rounded-3xl ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ============================================================== */}
        {/* CARD FRONT FACE: Pure Full-Bleed Thumbnail Image (No Text)     */}
        {/* ============================================================== */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl overflow-hidden shadow-md border border-slate-100/80">
          {service.image ? (
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-700 rounded-3xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/images/air_freight.webp';
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-6 text-center rounded-3xl">
              <span className="text-base font-bold text-white">{service.title}</span>
              <span className="text-xs text-slate-400 mt-1">Hover to view details</span>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* CARD BACK FACE: Revealed on Hover (Heading, Desc, Key Points)   */}
        {/* ============================================================== */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-[#0c1a24] via-[#153243] to-[#0c1a24] rounded-3xl p-7 text-white flex flex-col justify-between shadow-md border border-slate-700/60">
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
            <p
              className="text-slate-200 text-xs sm:text-sm leading-relaxed rich-text-content"
              dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(service.description) }}
            />

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
