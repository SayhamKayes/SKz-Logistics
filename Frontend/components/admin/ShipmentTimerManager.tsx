import React, { useState, useEffect } from 'react';
import {
  ShipmentTimerItem,
  ShipmentTimerHeaderConfig,
  DEFAULT_SHIPMENT_TIMERS,
  DEFAULT_SHIPMENT_TIMER_HEADER,
  TIMERS_STORAGE_KEY,
  TIMERS_HEADER_STORAGE_KEY,
  TIMERS_UPDATED_EVENT,
  ShipmentMode,
  ShipmentStatus,
} from '../../types/shipmentTimer';
import {
  Clock,
  Save,
  CheckCircle,
  Plus,
  Trash2,
  Plane,
  Ship,
  Calendar,
  MapPin,
  Sparkles,
  RotateCcw,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  GripVertical,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Layers,
  SlidersHorizontal,
} from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';
import { saveSiteConfigToDb } from '../../services/siteConfigService';

const ITEMS_PER_PAGE = 10;

export const ShipmentTimerManager: React.FC = () => {
  // Header config state
  const [headerConfig, setHeaderConfig] = useState<ShipmentTimerHeaderConfig>(() => {
    try {
      const stored = localStorage.getItem(TIMERS_HEADER_STORAGE_KEY);
      if (stored) return { ...DEFAULT_SHIPMENT_TIMER_HEADER, ...JSON.parse(stored) };
    } catch { }
    return DEFAULT_SHIPMENT_TIMER_HEADER;
  });

  // Timers list state
  const [timers, setTimers] = useState<ShipmentTimerItem[]>(() => {
    try {
      const stored = localStorage.getItem(TIMERS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch { }
    return DEFAULT_SHIPMENT_TIMERS;
  });

  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | ShipmentMode>('all');
  const [now, setNow] = useState(Date.now());

  // Collapsed state: set of expanded timer IDs (empty by default = all collapsed)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Pagination state (1-indexed)
  const [currentPage, setCurrentPage] = useState(1);

  // Drag and drop state
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Custom Confirm Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    type?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  } | null>(null);

  // Real-time ticking for admin preview
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateTimer = (id: string, updates: Partial<ShipmentTimerItem>) => {
    setTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setExpandedIds(new Set(filteredTimers.map((t) => t.id)));
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  const handleAddTimer = (mode: ShipmentMode = 'air') => {
    const today = new Date();
    const departureStr = today.toISOString().slice(0, 16);
    const arrivalDate = new Date(today.getTime() + (mode === 'air' ? 11 : 18) * 86400000);
    const arrivalStr = arrivalDate.toISOString().slice(0, 16);
    const newId = `timer-${Date.now()}`;

    const newTimer: ShipmentTimerItem = {
      id: newId,
      mode,
      title: mode === 'air' ? 'New Air Cargo Schedule' : 'New Sea Freight Liner',
      badge: mode === 'air' ? 'Air Freight • Priority' : 'Sea Freight • Container Line',
      flightOrVessel: mode === 'air' ? 'Flight CZ-000 Cargo' : 'Vessel MV OCEAN 000',
      originCity: mode === 'air' ? 'Guangzhou (CAN)' : 'Ningbo / Shenzhen Port',
      originCountry: 'China',
      originHub: 'SAIN International Terminal',
      destinationCity: mode === 'air' ? 'Dhaka (DAC)' : 'Chattogram Port (CGP)',
      destinationCountry: 'Bangladesh',
      destinationHub: mode === 'air' ? 'Hazrat Shahjalal Int’l Airport (HSIA)' : 'Chattogram Container Terminal (CCT)',
      departureDate: departureStr,
      targetArrivalDate: arrivalStr,
      status: 'scheduled',
      statusLabel: 'Scheduled Departure',
      cutoffNotice: 'Booking Cut-off: 24h prior to dispatch',
      transitDaysEstimate: mode === 'air' ? 'Air Cargo Direct' : 'Ocean Container Transit',
      isActive: true,
    };

    setTimers((prev) => [newTimer, ...prev]);
    // Automatically expand the new schedule so admin can immediately fill details
    setExpandedIds((prev) => new Set(prev).add(newId));
    // Reset to page 1 to see the new item
    setCurrentPage(1);
  };

  const handleDeleteTimer = (id: string, title: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Shipment Schedule?',
      message: `Are you sure you want to delete "${title}"? This schedule will be removed from your homepage countdown list.`,
      confirmText: 'Delete Schedule',
      type: 'danger',
      onConfirm: () => {
        setTimers((prev) => prev.filter((t) => t.id !== id));
        setExpandedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        setConfirmModal(null);
      },
    });
  };

  // Reorder: Move Up
  const handleMoveUp = (globalIndex: number) => {
    if (globalIndex <= 0) return;
    setTimers((prev) => {
      const copy = [...prev];
      const temp = copy[globalIndex - 1];
      copy[globalIndex - 1] = copy[globalIndex];
      copy[globalIndex] = temp;
      return copy;
    });
  };

  // Reorder: Move Down
  const handleMoveDown = (globalIndex: number) => {
    if (globalIndex >= timers.length - 1) return;
    setTimers((prev) => {
      const copy = [...prev];
      const temp = copy[globalIndex + 1];
      copy[globalIndex + 1] = copy[globalIndex];
      copy[globalIndex] = temp;
      return copy;
    });
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverId !== id) {
      setDragOverId(id);
    }
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    setTimers((prev) => {
      const sourceIndex = prev.findIndex((t) => t.id === draggedId);
      const targetIndex = prev.findIndex((t) => t.id === targetId);
      if (sourceIndex === -1 || targetIndex === -1) return prev;

      const copy = [...prev];
      const [removed] = copy.splice(sourceIndex, 1);
      copy.splice(targetIndex, 0, removed);
      return copy;
    });

    setDraggedId(null);
    setDragOverId(null);
  };

  // Quick preset helper to adjust arrival date relative to departure
  const handleSetRelativeArrival = (id: string, daysAhead: number) => {
    const timer = timers.find((t) => t.id === id);
    if (!timer) return;

    const depDate = new Date(timer.departureDate);
    const validDep = isNaN(depDate.getTime()) ? new Date() : depDate;
    const newArrival = new Date(validDep.getTime() + daysAhead * 86400000);

    handleUpdateTimer(id, {
      targetArrivalDate: newArrival.toISOString().slice(0, 16),
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(TIMERS_STORAGE_KEY, JSON.stringify(timers));
    localStorage.setItem(TIMERS_HEADER_STORAGE_KEY, JSON.stringify(headerConfig));
    saveSiteConfigToDb(TIMERS_STORAGE_KEY, timers);
    saveSiteConfigToDb(TIMERS_HEADER_STORAGE_KEY, headerConfig);
    window.dispatchEvent(new Event(TIMERS_UPDATED_EVENT));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetDefaults = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Shipment Schedules to Defaults?',
      message: 'Are you sure you want to reset all schedules back to the default Guangzhou, Hong Kong & Sea freight timers? Any customized schedules will be overwritten.',
      confirmText: 'Reset to Defaults',
      type: 'warning',
      onConfirm: () => {
        setTimers(DEFAULT_SHIPMENT_TIMERS);
        setHeaderConfig(DEFAULT_SHIPMENT_TIMER_HEADER);
        setExpandedIds(new Set());
        localStorage.setItem(TIMERS_STORAGE_KEY, JSON.stringify(DEFAULT_SHIPMENT_TIMERS));
        localStorage.setItem(TIMERS_HEADER_STORAGE_KEY, JSON.stringify(DEFAULT_SHIPMENT_TIMER_HEADER));
        saveSiteConfigToDb(TIMERS_STORAGE_KEY, DEFAULT_SHIPMENT_TIMERS);
        saveSiteConfigToDb(TIMERS_HEADER_STORAGE_KEY, DEFAULT_SHIPMENT_TIMER_HEADER);
        window.dispatchEvent(new Event(TIMERS_UPDATED_EVENT));
        setConfirmModal(null);
      },
    });
  };

  const filteredTimers = timers.filter((t) => {
    if (activeTab === 'all') return true;
    return t.mode === activeTab;
  });

  // Pagination calculation
  const totalItems = filteredTimers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTimers = filteredTimers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <span>Shipment Timer & Inbound Schedules Manager</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure live arrival countdowns for air freight (Guangzhou & Hong Kong) and ocean sea freight consignments displayed on the homepage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold animate-in fade-in">
              <CheckCircle className="w-4 h-4" />
              <span>Saved & Live on Homepage</span>
            </span>
          )}
          <a
            href="/#shipment-schedules"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold px-3 py-1.5 border border-[#1a6c7a]/30 text-[#1a6c7a] bg-[#1a6c7a]/5 hover:bg-[#1a6c7a]/15 rounded-lg transition inline-flex items-center gap-1.5 cursor-pointer"
            title="Open live shipment countdown schedules on the homepage in a new tab"
          >
            <span>Live Schedules</span>
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
        {/* SECTION 1: HOMEPAGE SECTION HEADER CONFIGURATION               */}
        {/* ============================================================== */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6c7a] flex items-center gap-2">
              <span>Homepage Section Heading & Narrative</span>
            </h4>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
              Between Hero & Services
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Badge Pill Tagline
              </label>
              <input
                type="text"
                value={headerConfig.badge}
                onChange={(e) => setHeaderConfig({ ...headerConfig, badge: e.target.value })}
                className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="Live Inbound Schedules & ETA Countdowns"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Section Main Title
              </label>
              <input
                type="text"
                value={headerConfig.title}
                onChange={(e) => setHeaderConfig({ ...headerConfig, title: e.target.value })}
                className="w-full text-xs font-bold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="Next Scheduled Shipments Arriving in Bangladesh"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Highlight Accent Phrase (Amber / Gold)
              </label>
              <input
                type="text"
                value={headerConfig.titleHighlight}
                onChange={(e) => setHeaderConfig({ ...headerConfig, titleHighlight: e.target.value })}
                className="w-full text-xs font-semibold text-amber-700 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="Arriving in Bangladesh"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subtitle Description
              </label>
              <input
                type="text"
                value={headerConfig.description}
                onChange={(e) => setHeaderConfig({ ...headerConfig, description: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                placeholder="Real-time departure and arrival countdowns..."
                required
              />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 2: SHIPMENT TIMERS LIST & CONTROLS                     */}
        {/* ============================================================== */}
        <div className="space-y-4">
          {/* Top Control Bar: Tabs, Pagination Box (marked in screenshot 3), and Add Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-50/70 p-3 rounded-2xl border border-slate-200/70">
            {/* Left: Filter Tabs & Count */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Schedules ({timers.length})
              </span>
              <div className="inline-flex p-0.5 bg-white rounded-lg border border-slate-200 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('all');
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition cursor-pointer ${activeTab === 'all' ? 'bg-[#1a6c7a] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  All ({timers.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('air');
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition cursor-pointer ${activeTab === 'air' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-amber-800'
                    }`}
                >
                  Air ({timers.filter((t) => t.mode === 'air').length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('sea');
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition cursor-pointer ${activeTab === 'sea' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-emerald-800'
                    }`}
                >
                  Sea ({timers.filter((t) => t.mode === 'sea').length})
                </button>
              </div>

              {/* Expand / Collapse All Helpers */}
              <div className="hidden sm:inline-flex items-center gap-1 ml-1 text-[11px]">
                <button
                  type="button"
                  onClick={handleExpandAll}
                  className="px-2 py-0.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded transition cursor-pointer"
                  title="Expand all schedule cards"
                >
                  Expand All
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={handleCollapseAll}
                  className="px-2 py-0.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded transition cursor-pointer"
                  title="Collapse all schedule cards"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {/* Right: Add Schedule Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAddTimer('air')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 text-xs font-bold rounded-xl border border-amber-300 transition cursor-pointer shadow-xs active:scale-95"
              >
                <Plane className="w-3.5 h-3.5 text-amber-600" />
                <span>Add Air Schedule</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddTimer('sea')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-900 text-xs font-bold rounded-xl border border-emerald-300 transition cursor-pointer shadow-xs active:scale-95"
              >
                <Ship className="w-3.5 h-3.5 text-emerald-600" />
                <span>Add Sea Schedule</span>
              </button>
            </div>
          </div>

          {/* Cards List */}
          {filteredTimers.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-500 font-medium">No shipment schedules configured in this filter tab.</p>
              <button
                type="button"
                onClick={() => handleAddTimer(activeTab === 'sea' ? 'sea' : 'air')}
                className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1a6c7a] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#145561] transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Schedule</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedTimers.map((timer) => {
                const globalIndex = timers.findIndex((t) => t.id === timer.id);
                const isExpanded = expandedIds.has(timer.id);
                const isDragging = draggedId === timer.id;
                const isOver = dragOverId === timer.id;

                const arrivalMs = new Date(timer.targetArrivalDate).getTime() || 0;
                const remainingMs = Math.max(0, arrivalMs - now);
                const daysLeft = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
                const hoursLeft = Math.floor((remainingMs / (1000 * 60 * 60)) % 24);
                const minsLeft = Math.floor((remainingMs / (1000 * 60)) % 60);
                const secsLeft = Math.floor((remainingMs / 1000) % 60);

                return (
                  <div
                    key={timer.id}
                    onDragOver={(e) => handleDragOver(e, timer.id)}
                    onDrop={(e) => handleDrop(e, timer.id)}
                    className={`rounded-2xl border transition-all duration-200 ${isDragging
                        ? 'opacity-40 border-dashed border-slate-400 bg-slate-100 scale-[0.99]'
                        : isOver
                          ? 'border-2 border-[#1a6c7a] shadow-md bg-teal-50/20'
                          : timer.isActive
                            ? timer.mode === 'air'
                              ? 'border-amber-200/90 bg-amber-50/15 hover:border-amber-300 shadow-xs'
                              : 'border-emerald-200/90 bg-emerald-50/15 hover:border-emerald-300 shadow-xs'
                            : 'border-slate-200 bg-slate-50/80 opacity-75'
                      }`}
                  >
                    {/* Collapsed Header Summary Row */}
                    <div
                      className="p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none"
                      onClick={() => toggleExpand(timer.id)}
                    >
                      {/* Left: Drag Grip + Reorder Arrows + Mode Badge + Title + Route */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {/* Drag Handle */}
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, timer.id)}
                          onDragEnd={handleDragEnd}
                          onClick={(e) => e.stopPropagation()}
                          className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600 p-1 rounded hover:bg-slate-200/60 transition"
                          title="Drag to reorder sequence"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* Move Up / Down Buttons */}
                        <div
                          className="flex flex-col gap-0.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            disabled={globalIndex <= 0}
                            onClick={() => handleMoveUp(globalIndex)}
                            className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-200/60 rounded transition cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={globalIndex >= timers.length - 1}
                            onClick={() => handleMoveDown(globalIndex)}
                            className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-200/60 rounded transition cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Mode Badge */}
                        <span
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 flex-shrink-0 ${timer.mode === 'air'
                              ? 'bg-amber-500/20 text-amber-900 border border-amber-300/70'
                              : 'bg-emerald-500/20 text-emerald-900 border border-emerald-300/70'
                            }`}
                        >
                          {timer.mode === 'air' ? (
                            <Plane className="w-3.5 h-3.5 text-amber-700" />
                          ) : (
                            <Ship className="w-3.5 h-3.5 text-emerald-700" />
                          )}
                          <span className="capitalize">{timer.mode}</span>
                        </span>

                        {/* Title & Route & Flight/Vessel in sleek compact summary */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              #{globalIndex + 1} {timer.title}
                            </span>
                            <span className="hidden md:inline-block text-[11px] font-mono text-slate-500 truncate">
                              • {timer.flightOrVessel}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                            <span className="font-semibold text-slate-700">
                              {timer.originCity} → {timer.destinationCity}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span>ETA: {timer.targetArrivalDate.replace('T', ' ')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Live ETA pill + Active toggle + Trash + Expand chevron */}
                      <div
                        className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Countdown Pill */}
                        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 text-amber-300 rounded-lg text-[11px] font-mono font-bold shadow-xs">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>
                            {daysLeft}d {hoursLeft}h {minsLeft}m
                          </span>
                        </div>

                        {/* Active toggle */}
                        <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700">
                          <input
                            type="checkbox"
                            checked={timer.isActive}
                            onChange={(e) =>
                              handleUpdateTimer(timer.id, { isActive: e.target.checked })
                            }
                            className="w-4 h-4 text-[#1a6c7a] rounded cursor-pointer"
                          />
                          <span className="hidden sm:inline text-[11px]">
                            {timer.isActive ? 'Active' : 'Hidden'}
                          </span>
                        </label>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteTimer(timer.id, timer.title)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Delete Schedule"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Expand / Collapse Button */}
                        <button
                          type="button"
                          onClick={() => toggleExpand(timer.id)}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition cursor-pointer flex items-center gap-1.5 ${isExpanded
                              ? 'bg-slate-200/70 border-slate-300 text-slate-800'
                              : 'bg-white border-slate-300 text-[#1a6c7a] hover:bg-slate-50'
                            }`}
                        >
                          <span>{isExpanded ? 'Collapse' : 'Edit'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Detailed Form Body */}
                    {isExpanded && (
                      <div className="p-5 sm:p-6 border-t border-slate-200/80 bg-white rounded-b-2xl animate-in slide-in-from-top-1 duration-150">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Title */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Shipment Title
                            </label>
                            <input
                              type="text"
                              value={timer.title}
                              onChange={(e) =>
                                handleUpdateTimer(timer.id, { title: e.target.value })
                              }
                              className="w-full text-xs font-bold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                              placeholder="Guangzhou Air Express Priority"
                              required
                            />
                          </div>

                          {/* Badge */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Card Badge Label
                            </label>
                            <input
                              type="text"
                              value={timer.badge}
                              onChange={(e) =>
                                handleUpdateTimer(timer.id, { badge: e.target.value })
                              }
                              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                              placeholder="Air Freight • CAN Hub"
                              required
                            />
                          </div>

                          {/* Flight or Vessel */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Flight / Vessel Identification
                            </label>
                            <input
                              type="text"
                              value={timer.flightOrVessel}
                              onChange={(e) =>
                                handleUpdateTimer(timer.id, { flightOrVessel: e.target.value })
                              }
                              className="w-full text-xs font-mono font-bold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                              placeholder="Flight CZ-387 Cargo Scheduled"
                              required
                            />
                          </div>

                          {/* Origin City */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Origin City & Code
                            </label>
                            <input
                              type="text"
                              value={timer.originCity}
                              onChange={(e) =>
                                handleUpdateTimer(timer.id, { originCity: e.target.value })
                              }
                              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                              placeholder="Guangzhou (CAN)"
                              required
                            />
                          </div>

                          {/* Destination City */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Destination City & Code
                            </label>
                            <input
                              type="text"
                              value={timer.destinationCity}
                              onChange={(e) =>
                                handleUpdateTimer(timer.id, { destinationCity: e.target.value })
                              }
                              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                              placeholder="Dhaka (DAC)"
                              required
                            />
                          </div>

                          {/* Status dropdown */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Current Transit Status
                            </label>
                            <select
                              value={timer.status}
                              onChange={(e) => {
                                const val = e.target.value as ShipmentStatus;
                                const labels: Record<ShipmentStatus, string> = {
                                  scheduled: 'Scheduled Departure',
                                  in_transit: 'In Transit • On Schedule',
                                  customs: 'Customs Clearance In Progress',
                                  arrived: 'Arrived at Destination Hub',
                                };
                                handleUpdateTimer(timer.id, {
                                  status: val,
                                  statusLabel: labels[val],
                                });
                              }}
                              className="w-full text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                            >
                              <option value="scheduled">Scheduled Departure</option>
                              <option value="in_transit">In Transit • On Schedule</option>
                              <option value="customs">Customs Clearance</option>
                              <option value="arrived">Arrived at Hub</option>
                            </select>
                          </div>

                          {/* Departure Date/Time */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                              <span>Departure / Launch Date & Time</span>
                              <span className="text-[10px] text-slate-400">Dispatch</span>
                            </label>
                            <input
                              type="datetime-local"
                              value={timer.departureDate}
                              onChange={(e) =>
                                handleUpdateTimer(timer.id, { departureDate: e.target.value })
                              }
                              className="w-full text-xs font-mono font-semibold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                              required
                            />
                          </div>

                          {/* Target Arrival Date/Time */}
                          <div className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[11px] font-bold text-slate-800">
                                Target Arrival Date & Time (Countdown Target)
                              </label>
                              {/* Quick Presets */}
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-medium text-slate-500">
                                  Quick ETA:
                                </span>
                                {[3, 7, 11, 14, 21].map((d) => (
                                  <button
                                    key={d}
                                    type="button"
                                    onClick={() => handleSetRelativeArrival(timer.id, d)}
                                    className="px-1.5 py-0.5 bg-slate-200/80 hover:bg-amber-100 text-[10px] font-bold rounded text-slate-700 hover:text-amber-900 transition cursor-pointer"
                                    title={`Set target arrival to +${d} days from departure`}
                                  >
                                    +{d}d
                                  </button>
                                ))}
                              </div>
                            </div>
                            <input
                              type="datetime-local"
                              value={timer.targetArrivalDate}
                              onChange={(e) =>
                                handleUpdateTimer(timer.id, { targetArrivalDate: e.target.value })
                              }
                              className="w-full text-xs font-mono font-bold text-[#1a6c7a] border-2 border-[#1a6c7a]/40 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                              required
                            />
                          </div>

                          {/* Hub locations */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Origin Airport / Port Terminal Hub
                            </label>
                            <input
                              type="text"
                              value={timer.originHub}
                              onChange={(e) =>
                                handleUpdateTimer(timer.id, { originHub: e.target.value })
                              }
                              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                              placeholder="Baiyun Terminal / Nansha Port"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Destination Airport / Port Terminal Hub
                            </label>
                            <input
                              type="text"
                              value={timer.destinationHub}
                              onChange={(e) =>
                                handleUpdateTimer(timer.id, { destinationHub: e.target.value })
                              }
                              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                              placeholder="Hazrat Shahjalal Int'l Airport (HSIA)"
                            />
                          </div>

                          {/* Booking Cut-off Notice */}
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Booking Cut-off / Schedule Note
                            </label>
                            <input
                              type="text"
                              value={timer.cutoffNotice}
                              onChange={(e) =>
                                handleUpdateTimer(timer.id, { cutoffNotice: e.target.value })
                              }
                              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                              placeholder="Booking Cut-off: Every Tuesday 4:00 PM"
                            />
                          </div>
                        </div>

                        {/* Live countdown preview badge inside admin card */}
                        <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-700">Live Homepage Countdown Preview:</span>
                            {remainingMs <= 0 ? (
                              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[11px]">
                                Target Reached (Arrived)
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-amber-300 font-mono font-bold text-xs shadow-xs">
                                {daysLeft}d : {String(hoursLeft).padStart(2, '0')}h : {String(minsLeft).padStart(2, '0')}m : {String(secsLeft).padStart(2, '0')}s
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <a
                              href="/#shipment-schedules"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold text-[#1a6c7a] hover:text-[#145561] hover:underline inline-flex items-center gap-1"
                              title="View schedule countdown on live site in a new tab"
                            >
                              <span>View on Live Site</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <span className="text-[10px] text-slate-400">ID: {timer.id}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Save Bar with Classic Left Pagination */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Classic Pagination Widget */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200/90 rounded-xl shadow-xs">
            <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap">
              Page <span className="text-[#1a6c7a] font-black">{safeCurrentPage}</span> of {totalPages}
            </span>

            <div className="flex items-center gap-0.5 border-l border-slate-200 pl-1.5 ml-1">
              <button
                type="button"
                disabled={safeCurrentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {/* Page number buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
                if (
                  totalPages > 5 &&
                  Math.abs(num - safeCurrentPage) > 1 &&
                  num !== 1 &&
                  num !== totalPages
                ) {
                  if (num === 2 || num === totalPages - 1) {
                    return <span key={num} className="text-slate-300 text-[10px] px-0.5">…</span>;
                  }
                  return null;
                }
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCurrentPage(num)}
                    className={`w-6 h-6 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center justify-center ${num === safeCurrentPage
                        ? 'bg-[#1a6c7a] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    {num}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={safeCurrentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <span className="text-[10px] text-slate-400 hidden sm:inline border-l border-slate-200 pl-2">
              (10 / page)
            </span>
          </div>

          {/* Right: Save Button */}
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#009b4d] hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Shipment Timers</span>
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
    </div>
  );
};
