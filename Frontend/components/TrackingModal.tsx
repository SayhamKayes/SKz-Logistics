import React, { useState, useEffect, useMemo } from 'react';
import { useTracking } from '../Context/TrackingContext';
import {
  X,
  Search,
  Package,
  Plane,
  Ship,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Calendar,
  Weight,
  Layers,
  FileText,
  Printer,
  Share2,
  ExternalLink,
  ShieldCheck,
  Building,
  User,
  ArrowRight,
  Info,
  Copy,
  Check,
} from 'lucide-react';
import { getStatusProgressAndColor, buildConsignmentTimeline } from '../services/trackingData';
import { useWhatsAppConfig } from '../hooks/useWhatsApp';

export const TrackingModal: React.FC = () => {
  const { phoneNumber } = useWhatsAppConfig();
  const {
    isTrackingModalOpen,
    closeTrackingModal,
    activeConsignment,
    isLoading,
    error,
    searchConsignment,
    searchHistory,
  } = useTracking();

  const [inputVal, setInputVal] = useState(activeConsignment?.consignmentNo || '');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'details' | 'customs'>('timeline');

  // Sync search input when activeConsignment changes
  useEffect(() => {
    if (activeConsignment?.consignmentNo) {
      setInputVal(activeConsignment.consignmentNo);
    }
  }, [activeConsignment]);

  // Synchronized timeline ensuring the active milestone corresponds directly to activeConsignment.status
  const activeTimeline = useMemo(() => {
    if (!activeConsignment) return [];

    const list = buildConsignmentTimeline(
      activeConsignment.status,
      activeConsignment.shipmentHistory && activeConsignment.shipmentHistory.length > 0
        ? activeConsignment.shipmentHistory
        : activeConsignment.timeline?.map((t, idx) => ({
            id: t.id || `h-${idx}`,
            date: t.timestamp?.split('•')[0]?.trim() || '',
            time: t.timestamp?.split('•')[1]?.trim() || '',
            location: t.location,
            status: t.title,
            updatedBy: 'SAIN Logistics',
            remarks: t.description,
          })) || [],
      activeConsignment.origin?.city || 'China',
      activeConsignment.destination?.city || 'Bangladesh'
    );

    const normCurrent = (activeConsignment.status || '').toLowerCase().trim();
    const isDelivered = normCurrent.includes('delivered');

    let hasCurrent = false;
    return list.map((step) => {
      const stepNorm = (step.title || '').toLowerCase().trim();
      const isMatch = stepNorm.includes(normCurrent) || normCurrent.includes(stepNorm);
      const isCurrent = !isDelivered && (step.status === 'current' || (!hasCurrent && isMatch));
      if (isCurrent) hasCurrent = true;
      return {
        ...step,
        isCurrent,
        isDone: isDelivered || step.status === 'completed' || (!isCurrent && hasCurrent),
      };
    });
  }, [activeConsignment]);

  if (!isTrackingModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      searchConsignment(inputVal);
    }
  };

  const copyTrackingNumber = () => {
    if (activeConsignment) {
      navigator.clipboard.writeText(activeConsignment.consignmentNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden text-slate-100 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-brand tracking-tight flex items-center gap-2">
                <span>International Consignment Tracking</span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded">
                  Live System
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Official SAIN cargo tracking from Guangzhou/Global Hubs to Bangladesh Doorstep
              </p>
            </div>
          </div>

          <button
            onClick={closeTrackingModal}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar inside modal */}
        <div className="p-6 bg-slate-950/50 border-b border-slate-800/80">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter Consignment No. Ex: SAINEX067638406"
                className="w-full bg-slate-800/90 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-4 py-3 pl-11 text-sm text-slate-100 placeholder-slate-400 focus:outline-none transition shadow-inner font-mono font-medium"
              />
              <Search className="w-5 h-5 text-amber-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Tracking...</span>
                </>
              ) : (
                <>
                  <span>Track Consignment</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Tracking Details View */}
        {activeConsignment ? (
          <div className="p-6 space-y-6 max-h-[68vh] overflow-y-auto">
            {/* Top Status Card */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                      Consignment No.
                    </span>
                    <button
                      onClick={copyTrackingNumber}
                      title="Copy Tracking Number"
                      className="text-slate-400 hover:text-amber-400 transition"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <h3 className="text-2xl font-bold font-mono text-amber-400 flex items-center gap-2">
                    {activeConsignment.consignmentNo}
                    <span className="text-xs font-normal text-slate-400 font-sans">
                      ({activeConsignment.referenceNo || 'Direct Forwarding'})
                    </span>
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${activeConsignment.status === 'Delivered'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : activeConsignment.status?.toLowerCase().includes('out for delivery')
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                          : activeConsignment.status === 'On Hold by Customs'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 animate-pulse'
                            : activeConsignment.status === 'Cancelled' || activeConsignment.status === 'Returned'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              : activeConsignment.status === 'At Bangladesh warehouse'
                                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                                : activeConsignment.status === 'Received' || activeConsignment.status === 'Pending'
                                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current" />
                    {activeConsignment.status}
                  </span>

                  <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                    {activeConsignment.serviceType.includes('Air') ? (
                      <Plane className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Ship className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                    {activeConsignment.serviceType}
                  </span>
                </div>
              </div>

              {/* Transit Corridor Route Banner */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Origin */}
                <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Origin / Shipper Hub
                  </span>
                  <div className="text-base font-bold text-slate-100 flex items-center gap-1.5 mt-0.5">
                    <span className="text-amber-400 font-mono">[{activeConsignment.origin.code}]</span>
                    <span>{activeConsignment.origin.city}, {activeConsignment.origin.country}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 truncate">
                    {activeConsignment.origin.hub}
                  </p>
                </div>

                {/* Progress bar connecting the corridor */}
                {(() => {
                  const statusMeta = getStatusProgressAndColor(activeConsignment.status);
                  const progressVal = statusMeta.progress;
                  const is100 = progressVal >= 100;
                  const isZero = progressVal === 0;

                  return (
                    <div className="flex flex-col items-center justify-center px-2">
                      <div className="w-full flex justify-between text-[11px] text-slate-400 font-medium mb-1.5">
                        <span className="font-semibold text-slate-200">{statusMeta.label}</span>
                        <span className={`font-bold font-mono ${is100 ? 'text-emerald-400' : isZero ? 'text-rose-400' : 'text-amber-400'}`}>
                          {progressVal}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            is100
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                              : isZero
                              ? 'bg-rose-500'
                              : 'bg-gradient-to-r from-amber-500 to-amber-300'
                          }`}
                          style={{ width: `${progressVal}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1.5">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>ETA: {activeConsignment.estimatedDelivery || 'Calculated in Real-Time'}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Destination */}
                <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Destination / Consignee
                  </span>
                  <div className="text-base font-bold text-slate-100 flex items-center gap-1.5 mt-0.5">
                    <span className="text-emerald-400 font-mono">[{activeConsignment.destination.code}]</span>
                    <span>{activeConsignment.destination.city}, {activeConsignment.destination.country}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 truncate">
                    {activeConsignment.destination.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs inside modal */}
            <div className="flex border-b border-slate-800 gap-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`pb-2.5 transition flex items-center gap-1.5 border-b-2 ${activeTab === 'timeline'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
              >
                <Clock className="w-4 h-4" />
                <span>Tracking Milestones ({activeTimeline.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2.5 transition flex items-center gap-1.5 border-b-2 ${activeTab === 'details'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
              >
                <Package className="w-4 h-4" />
                <span>Cargo & Consignee Details</span>
              </button>

              <button
                onClick={() => setActiveTab('customs')}
                className={`pb-2.5 transition flex items-center gap-1.5 border-b-2 ${activeTab === 'customs'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Customs & Regulatory (Act 2023)</span>
              </button>
            </div>

            {/* Tab 1: Timeline Milestones */}
            {activeTab === 'timeline' && (
              <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {activeTimeline.map((step, idx) => {
                  const isDone = step.isDone;
                  const isCurrent = step.isCurrent;

                  return (
                    <div key={step.id || idx} className="relative group">
                      {/* Milestone marker */}
                      <div
                        className={`absolute -left-6 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs transition ${isDone
                            ? 'bg-emerald-500 text-slate-950 font-bold ring-4 ring-slate-900'
                            : isCurrent
                              ? 'bg-amber-400 text-slate-950 font-bold ring-4 ring-amber-500/25 animate-pulse'
                              : 'bg-slate-800 text-slate-500 ring-4 ring-slate-900'
                          }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : isCurrent ? (
                          <Truck className="w-3.5 h-3.5" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-600" />
                        )}
                      </div>

                      <div
                        className={`p-4 rounded-xl border transition ${isCurrent
                            ? 'bg-amber-500/5 border-amber-500/30 shadow-md'
                            : isDone
                              ? 'bg-slate-900/60 border-slate-800'
                              : 'bg-slate-900/30 border-slate-800/50 opacity-60'
                          }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                            <span>{step.title}</span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded">
                                ACTIVE MILESTONE
                              </span>
                            )}
                          </h4>
                          <span className="text-xs font-mono text-amber-400/90 font-medium">
                            {step.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {step.description}
                        </p>
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{step.location}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 2: Cargo & Consignee Details */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                {/* Shipper & Receiver Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Shipper Info */}
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                      <Building className="w-4 h-4" />
                      <span>Shipper Details</span>
                    </h4>
                    <div className="text-xs space-y-1">
                      <p><span className="text-slate-400">Shipper:</span> <strong className="text-slate-200">{activeConsignment.shipper?.name || 'SAIN Logistics (Guangzhou Hub)'}</strong></p>
                      <p><span className="text-slate-400">Phone:</span> <span className="text-slate-200">{activeConsignment.shipper?.phone || '+880171906999'}</span></p>
                      <p><span className="text-slate-400">Address:</span> <span className="text-slate-300">{activeConsignment.shipper?.address || '15/B, Uttara Metro Center, Dhaka'}</span></p>
                      <p><span className="text-slate-400">Email:</span> <span className="text-slate-300">{activeConsignment.shipper?.email || 'saininternationallogistics@gmail.com'}</span></p>
                    </div>
                  </div>

                  {/* Receiver Info */}
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                      <User className="w-4 h-4" />
                      <span>Receiver Details</span>
                    </h4>
                    <div className="text-xs space-y-1">
                      <p><span className="text-slate-400">Receiver:</span> <strong className="text-slate-200">{activeConsignment.receiver?.name || activeConsignment.consignee.name}</strong></p>
                      <p><span className="text-slate-400">Phone:</span> <span className="text-slate-200">{activeConsignment.receiver?.phone || activeConsignment.consignee.phoneMasked}</span></p>
                      <p><span className="text-slate-400">Address:</span> <span className="text-slate-300">{activeConsignment.receiver?.address || activeConsignment.destination.address}</span></p>
                      <p><span className="text-slate-400">Email:</span> <span className="text-slate-300">{activeConsignment.receiver?.email || 'ocuna123@gmail.com'}</span></p>
                    </div>
                  </div>
                </div>

                {/* Cargo Specs & Carrier */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Cargo Specs */}
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Package className="w-4 h-4" />
                      <span>Package & Cargo Specification</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Gross Weight:</span>
                        <strong className="text-slate-100 text-sm font-mono">{activeConsignment.shipmentDetails?.weightText || activeConsignment.cargoDetails.weight}</strong>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Total Pieces:</span>
                        <strong className="text-slate-100 text-sm font-mono">{activeConsignment.shipmentDetails?.packagesCount || activeConsignment.cargoDetails.pieces} Cartons</strong>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Payment Mode:</span>
                        <strong className="text-amber-400 text-xs font-mono">{activeConsignment.shipmentDetails?.paymentMode || 'CASH'}</strong>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Departure Time:</span>
                        <strong className="text-slate-100 text-xs font-mono">{activeConsignment.shipmentDetails?.departureTimeStr || '18:52 pm'}</strong>
                      </div>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs">
                      <span className="text-slate-400 block text-[10px]">Goods Description:</span>
                      <p className="text-slate-200 mt-0.5">{activeConsignment.shipmentDetails?.product || activeConsignment.cargoDetails.description}</p>
                      {activeConsignment.shipmentDetails?.comments && (
                        <p className="text-slate-400 mt-1 italic">Note: {activeConsignment.shipmentDetails.comments}</p>
                      )}
                    </div>
                  </div>

                  {/* Consignee & Carrier */}
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      <span>Carrier & Corridor Routing</span>
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Assigned Carrier:</span>
                        <strong className="text-slate-100">{activeConsignment.carrier}</strong>
                        <span className="block font-mono text-[11px] text-amber-400 mt-0.5">
                          Carrier Ref: {activeConsignment.referenceNo || 'CRN-884920'}
                        </span>
                      </div>

                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Routing Channel:</span>
                        <strong className="text-slate-200">{activeConsignment.origin.city} ({activeConsignment.origin.country}) &rarr; {activeConsignment.destination.city} ({activeConsignment.destination.country})</strong>
                      </div>

                      <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Destination Address:</span>
                        <p className="text-slate-200">{activeConsignment.destination.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Packages Breakdown Table (If Available) */}
                {activeConsignment.packagesData && activeConsignment.packagesData.length > 0 && (
                  <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Layers className="w-4 h-4" />
                      <span>Individual Packages Breakdown ({activeConsignment.packagesData.length})</span>
                    </h4>
                    <div className="overflow-x-auto border border-slate-800 rounded-lg">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-[#009b4d] text-white font-bold">
                          <tr>
                            <th className="py-2 px-3">Qty</th>
                            <th className="py-2 px-3">Piece Type</th>
                            <th className="py-2 px-3">Description / Tag</th>
                            <th className="py-2 px-3">Length</th>
                            <th className="py-2 px-3">Width</th>
                            <th className="py-2 px-3">Height</th>
                            <th className="py-2 px-3">Weight</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 bg-slate-900/80 text-slate-200">
                          {activeConsignment.packagesData.map((pkg, i) => (
                            <tr key={pkg.id || i} className="hover:bg-slate-800/60">
                              <td className="py-2 px-3 font-mono font-bold text-amber-400">{pkg.qty}</td>
                              <td className="py-2 px-3">{pkg.pieceType}</td>
                              <td className="py-2 px-3 font-mono">{pkg.description || '80595'}</td>
                              <td className="py-2 px-3 font-mono">{pkg.lengthCm} cm</td>
                              <td className="py-2 px-3 font-mono">{pkg.widthCm} cm</td>
                              <td className="py-2 px-3 font-mono">{pkg.heightCm} cm</td>
                              <td className="py-2 px-3 font-mono">{pkg.weightG} g</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Customs & Regulatory */}
            {activeTab === 'customs' && (
              <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">
                      Bangladesh Customs Act 2023 Legal Compliance
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      All shipments through SAIN International Logistics strictly adhere to international CFR commercial trade terms and national import clearance guidelines.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Statutory Framework:</span>
                    <strong className="text-slate-100">{activeConsignment.customsStatus?.act || 'Customs Act 2023 Compliant'}</strong>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Incoterms Trade Term:</span>
                    <strong className="text-amber-400 font-mono">{activeConsignment.customsStatus?.tradeTerm || 'DAP (Delivered at Place)'}</strong>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Assessment Station:</span>
                    <strong className="text-slate-200">{activeConsignment.customsStatus?.assessmentStation || 'Dhaka Airport Customs House'}</strong>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Duty Clearance Status:</span>
                    <strong className="text-emerald-400">{activeConsignment.customsStatus?.dutyStatus || 'Pre-cleared / Verified'}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions: Print Waybill, Share */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Need assistance? Call Uttara Desk: <strong>(880) 1719 068999</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Waybill</span>
                </button>
                <a
                  href={`https://wa.me/${phoneNumber}?text=Hello%20SAIN%20Logistics,%20I%20am%20inquiring%20about%20my%20consignment%20${activeConsignment.consignmentNo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp Inquiries</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400">
            <Package className="w-12 h-12 mx-auto mb-3 text-slate-600 opacity-60" />
            <h3 className="text-base font-semibold text-slate-200">No consignment selected</h3>
            <p className="text-xs text-slate-400 mt-1">Enter your Consignment No. above to view real-time tracking details.</p>
          </div>
        )}
      </div>
    </div>
  );
};
