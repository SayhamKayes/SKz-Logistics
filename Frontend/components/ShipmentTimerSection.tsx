import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ShipmentTimerItem,
  ShipmentTimerHeaderConfig,
  DEFAULT_SHIPMENT_TIMERS,
  DEFAULT_SHIPMENT_TIMER_HEADER,
  TIMERS_STORAGE_KEY,
  TIMERS_HEADER_STORAGE_KEY,
  TIMERS_UPDATED_EVENT,
  ShipmentMode,
} from '../types/shipmentTimer';
import {
  Plane,
  Ship,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Timer as TimerIcon,
} from 'lucide-react';

export const ShipmentTimerSection: React.FC = () => {
  // Active filter tab: 'all' | 'air' | 'sea'
  const [filterMode, setFilterMode] = useState<'all' | ShipmentMode>('all');

  // Live timer tick state
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  // Carousel slider state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Header configuration state
  const [headerConfig, setHeaderConfig] = useState<ShipmentTimerHeaderConfig>(() => {
    try {
      const stored = localStorage.getItem(TIMERS_HEADER_STORAGE_KEY);
      if (stored) return { ...DEFAULT_SHIPMENT_TIMER_HEADER, ...JSON.parse(stored) };
    } catch {}
    return DEFAULT_SHIPMENT_TIMER_HEADER;
  });

  // Timers list state
  const [timers, setTimers] = useState<ShipmentTimerItem[]>(() => {
    try {
      const stored = localStorage.getItem(TIMERS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_SHIPMENT_TIMERS;
  });

  // Update real-time clock every second
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  // Listen to Admin Portal live updates and storage sync
  useEffect(() => {
    const syncTimers = () => {
      try {
        const storedTimers = localStorage.getItem(TIMERS_STORAGE_KEY);
        if (storedTimers) setTimers(JSON.parse(storedTimers));

        const storedHeader = localStorage.getItem(TIMERS_HEADER_STORAGE_KEY);
        if (storedHeader) {
          setHeaderConfig({ ...DEFAULT_SHIPMENT_TIMER_HEADER, ...JSON.parse(storedHeader) });
        }
      } catch {}
    };

    window.addEventListener(TIMERS_UPDATED_EVENT, syncTimers);
    window.addEventListener('storage', syncTimers);
    return () => {
      window.removeEventListener(TIMERS_UPDATED_EVENT, syncTimers);
      window.removeEventListener('storage', syncTimers);
    };
  }, []);

  // Filtered active timers
  const visibleTimers = useMemo(() => {
    return timers.filter((item) => {
      if (!item.isActive) return false;
      if (filterMode === 'all') return true;
      return item.mode === filterMode;
    });
  }, [timers, filterMode]);

  // Counts for tabs
  const counts = useMemo(() => {
    const total = timers.filter((t) => t.isActive).length;
    const air = timers.filter((t) => t.isActive && t.mode === 'air').length;
    const sea = timers.filter((t) => t.isActive && t.mode === 'sea').length;
    return { total, air, sea };
  }, [timers]);

  // Determine if slider should be enabled (when more than 3 visible items)
  const isSliderActive = visibleTimers.length > 3;

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [filterMode]);

  // Auto-slide infinite loop when slider is active
  useEffect(() => {
    if (!isSliderActive || isPaused || visibleTimers.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % visibleTimers.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isSliderActive, isPaused, visibleTimers.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + visibleTimers.length) % visibleTimers.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % visibleTimers.length);
  };

  return (
    <section
      id="shipment-schedules"
      className="relative py-10 sm:py-14 bg-gradient-to-b from-slate-900 via-[#0a151d] to-[#0f1d26] text-white overflow-hidden border-y border-slate-800"
    >
      {/* Background Animated World Map Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none flex items-center justify-center">
        {/* Animated Map Element with smooth continuous drift */}
        <div className="w-[120%] sm:w-[110%] h-[120%] sm:h-[110%] flex-shrink-0 animate-world-map-drift opacity-[0.22] mix-blend-screen">
          <img
            src="/assets/images/World%20map,%20Tallinn.svg"
            alt="Global Inbound Map Network"
            className="w-full h-full object-cover object-center filter brightness-110 contrast-125 saturate-150 drop-shadow-[0_0_30px_rgba(26,108,122,0.35)]"
          />
        </div>

        {/* Ambient Top & Bottom Vignette Overlays for flawless contrast and readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-[#0f1d26] opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(10,21,29,0.3)_0%,_rgba(10,21,29,0.85)_80%)]" />
      </div>

      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1a6c7a]/25 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Compact Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a6c7a]/20 border border-[#1a6c7a]/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-inner">
            <TimerIcon className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{headerConfig.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {headerConfig.titleHighlight && headerConfig.title.includes(headerConfig.titleHighlight) ? (
              <>
                {headerConfig.title.split(headerConfig.titleHighlight)[0]}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                  {headerConfig.titleHighlight}
                </span>
                {headerConfig.title.split(headerConfig.titleHighlight)[1]}
              </>
            ) : (
              headerConfig.title
            )}
          </h2>

          <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {headerConfig.description}
          </p>

          {/* Filter Tabs */}
          <div className="mt-5 inline-flex p-1 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 shadow-xl">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3.5 sm:px-5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-[#1a6c7a] text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              All Inbound ({counts.total})
            </button>

            <button
              onClick={() => setFilterMode('air')}
              className={`inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                filterMode === 'air'
                  ? 'bg-[#1a6c7a] text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Plane className="w-3.5 h-3.5 text-blue-400" />
              <span>Air Freight ({counts.air})</span>
            </button>

            <button
              onClick={() => setFilterMode('sea')}
              className={`inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                filterMode === 'sea'
                  ? 'bg-[#1a6c7a] text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Ship className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sea Freight ({counts.sea})</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CARDS DISPLAY: STATIC GRID (<= 3) OR INFINITE SLIDER (> 3)    */}
        {/* ============================================================== */}
        {!isSliderActive ? (
          // Clean 3-column static grid when 3 or fewer items
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleTimers.map((timer) => (
              <ShipmentCountdownCard
                key={timer.id}
                timer={timer}
                currentTime={currentTime}
              />
            ))}
          </div>
        ) : (
          // Infinite loop carousel slider when more than 3 items
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-800/90 hover:bg-[#1a6c7a] border border-slate-700 text-white flex items-center justify-center shadow-xl backdrop-blur-md transition-all cursor-pointer active:scale-95"
              aria-label="Previous shipment slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-800/90 hover:bg-[#1a6c7a] border border-slate-700 text-white flex items-center justify-center shadow-xl backdrop-blur-md transition-all cursor-pointer active:scale-95"
              aria-label="Next shipment slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slider Viewport */}
            <div className="overflow-hidden px-1">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1))}%)`,
                }}
              >
                {/* Infinite loop buffer: concatenate array items to allow seamless circular rendering */}
                {[...visibleTimers, ...visibleTimers].map((timer, idx) => (
                  <div
                    key={`${timer.id}-loop-${idx}`}
                    className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 p-3"
                  >
                    <ShipmentCountdownCard
                      timer={timer}
                      currentTime={currentTime}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Dots Indicator */}
            <div className="flex items-center justify-center gap-1.5 mt-5">
              {visibleTimers.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx
                      ? 'w-6 bg-amber-400'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// ============================================================================
// CLEAN & COMPACT SHIPMENT COUNTDOWN CARD (NO BUTTONS, NO CUT-OFF PER SPEC)
// ============================================================================
interface ShipmentCountdownCardProps {
  timer: ShipmentTimerItem;
  currentTime: number;
}

const ShipmentCountdownCard: React.FC<ShipmentCountdownCardProps> = ({
  timer,
  currentTime,
}) => {
  const departureMs = useMemo(() => {
    return new Date(timer.departureDate).getTime() || currentTime;
  }, [timer.departureDate, currentTime]);

  const targetArrivalMs = useMemo(() => {
    return new Date(timer.targetArrivalDate).getTime() || currentTime + 86400000;
  }, [timer.targetArrivalDate, currentTime]);

  // Calculate remaining time
  const remainingMs = Math.max(0, targetArrivalMs - currentTime);
  const isArrived = remainingMs <= 0;

  // Breakdown remaining time into days, hours, minutes, seconds
  const { days, hours, minutes, seconds } = useMemo(() => {
    const totalSecs = Math.floor(remainingMs / 1000);
    const d = Math.floor(totalSecs / (3600 * 24));
    const h = Math.floor((totalSecs % (3600 * 24)) / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return { days: d, hours: h, minutes: m, seconds: s };
  }, [remainingMs]);

  // Transit Progress calculation
  const progressPercent = useMemo(() => {
    if (isArrived) return 100;
    const totalDuration = targetArrivalMs - departureMs;
    if (totalDuration <= 0) return 50;
    const elapsed = currentTime - departureMs;
    const percent = Math.round((elapsed / totalDuration) * 100);
    return Math.min(96, Math.max(4, percent));
  }, [departureMs, targetArrivalMs, currentTime, isArrived]);

  // Format dates for friendly display
  const departureDateFormatted = useMemo(() => {
    try {
      const d = new Date(timer.departureDate);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return timer.departureDate;
    }
  }, [timer.departureDate]);

  const arrivalDateFormatted = useMemo(() => {
    try {
      const d = new Date(timer.targetArrivalDate);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return timer.targetArrivalDate;
    }
  }, [timer.targetArrivalDate]);

  return (
    <div
      className={`group relative bg-[#0f1d26]/90 border border-slate-700/80 ${
        timer.mode === 'air'
          ? 'hover:border-blue-400/50 hover:shadow-blue-500/10'
          : 'hover:border-emerald-400/50 hover:shadow-emerald-500/10'
      } rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between h-full`}
    >
      {/* Top Header: Badge, Mode, and Status */}
      <div>
        <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className={`p-2 rounded-xl flex items-center justify-center ${
                timer.mode === 'air'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {timer.mode === 'air' ? (
                <Plane className="w-4 h-4" />
              ) : (
                <Ship className="w-4 h-4" />
              )}
            </span>
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-300">
              {timer.badge}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700">
            <span
              className={`w-2 h-2 rounded-full ${
                timer.mode === 'air'
                  ? isArrived
                    ? 'bg-blue-400'
                    : timer.status === 'in_transit'
                    ? 'bg-blue-400 animate-pulse'
                    : 'bg-blue-400'
                  : isArrived
                  ? 'bg-emerald-400'
                  : timer.status === 'in_transit'
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-emerald-400'
              }`}
            />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
              {isArrived ? 'Arrived at Port' : timer.statusLabel || timer.status}
            </span>
          </div>
        </div>

        {/* Title and Vessel/Flight Info */}
        <div className="mt-3.5">
          <h3
            className={`text-base sm:text-lg font-bold text-white ${
              timer.mode === 'air' ? 'group-hover:text-blue-300' : 'group-hover:text-emerald-300'
            } transition-colors line-clamp-1`}
          >
            {timer.title}
          </h3>
          <p className="text-xs font-mono font-semibold text-slate-400 mt-0.5 flex items-center gap-1.5">
            <span className={timer.mode === 'air' ? 'text-blue-400 font-bold' : 'text-emerald-400 font-bold'}>•</span>
            <span className="truncate">{timer.flightOrVessel}</span>
          </p>
        </div>

        {/* Route Corridor Indicator with Animated Plane / Ship */}
        <div className="mt-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-200">
            <div className="flex items-center gap-1.5">
              <MapPin className={`w-3.5 h-3.5 ${timer.mode === 'air' ? 'text-blue-400' : 'text-amber-400'}`} />
              <span>{timer.originCity}</span>
            </div>
            <div className="flex items-center gap-1.5 text-right">
              <span>{timer.destinationCity}</span>
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>

          {/* Progress bar line with traveling icon */}
          <div className="relative mt-3.5 mb-1.5">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  timer.mode === 'air'
                    ? 'bg-gradient-to-r from-blue-500 to-sky-300'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-300'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Moving marker */}
            <div
              className={`absolute -top-2.5 transition-all duration-700 -translate-x-1/2 p-1 rounded-full bg-slate-900 shadow-md ${
                timer.mode === 'air'
                  ? 'border border-blue-400 text-blue-300'
                  : 'border border-emerald-400 text-emerald-300'
              }`}
              style={{ left: `${progressPercent}%` }}
            >
              {timer.mode === 'air' ? (
                <Plane className="w-3 h-3 transform rotate-45" />
              ) : (
                <Ship className="w-3 h-3" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 font-medium">
            <span>Departed: {departureDateFormatted}</span>
            <span className={timer.mode === 'air' ? 'text-blue-300 font-bold' : 'text-emerald-300 font-bold'}>
              ETA: {arrivalDateFormatted}
            </span>
          </div>
        </div>

        {/* COUNTDOWN TIMER DISPLAY */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Countdown to Arrival</span>
            </span>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              {isArrived ? 'Completed' : 'Live Ticking'}
            </span>
          </div>

          {isArrived ? (
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Cargo Arrived at Hub</span>
              </div>
              <p className="text-[10px] text-slate-300">
                Customs assessment and sorting completed for delivery.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 text-center">
              {/* Days Box */}
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2 sm:p-2.5 shadow-inner">
                <span className="block text-xl sm:text-2xl font-extrabold text-white tracking-tight font-mono">
                  {String(days).padStart(2, '0')}
                </span>
                <span className="block text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                  Days
                </span>
              </div>

              {/* Hours Box */}
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2 sm:p-2.5 shadow-inner">
                <span className="block text-xl sm:text-2xl font-extrabold text-amber-300 tracking-tight font-mono">
                  {String(hours).padStart(2, '0')}
                </span>
                <span className="block text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                  Hours
                </span>
              </div>

              {/* Mins Box */}
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2 sm:p-2.5 shadow-inner">
                <span className="block text-xl sm:text-2xl font-extrabold text-white tracking-tight font-mono">
                  {String(minutes).padStart(2, '0')}
                </span>
                <span className="block text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                  Mins
                </span>
              </div>

              {/* Secs Box */}
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2 sm:p-2.5 shadow-inner">
                <span className="block text-xl sm:text-2xl font-extrabold text-amber-400 tracking-tight font-mono animate-pulse">
                  {String(seconds).padStart(2, '0')}
                </span>
                <span className="block text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                  Secs
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
