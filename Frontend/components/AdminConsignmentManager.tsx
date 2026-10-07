import React, { useState } from 'react';
import { useTracking } from '../Context/TrackingContext';
import {
  Settings,
  Plus,
  Save,
  Trash2,
  X,
  Package,
  Check,
  Edit3,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { Consignment } from '../services/trackingData';

export const AdminConsignmentManager: React.FC = () => {
  const { allConsignments, addConsignment, updateConsignment, openTrackingModal } = useTracking();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNo, setSelectedNo] = useState<string>('12345');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form states for creating new consignment
  const [newNo, setNewNo] = useState('');
  const [originCity, setOriginCity] = useState('Guangzhou, China');
  const [destCity, setDestCity] = useState('Dhaka, Bangladesh');
  const [destAddress, setDestAddress] = useState('Sector 3, Uttara, Dhaka-1230');
  const [weight, setWeight] = useState('45.0 KG');
  const [service, setService] = useState<'Air Freight Priority' | 'Sea Freight (FCL/LCL)' | 'Hand Carry Express' | 'Export Worldwide'>('Air Freight Priority');
  const [status, setStatus] = useState<'Delivered' | 'Out for Delivery' | 'Customs Clearance' | 'In Flight' | 'At Hub' | 'Received at Warehouse'>('In Flight');
  const [goodsDesc, setGoodsDesc] = useState('Electronics & Garment Accessories');
  const [consigneeName, setConsigneeName] = useState('Bengal Import Trading Ltd.');

  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneLoc, setNewMilestoneLoc] = useState('Dhaka Airport Customs');
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('Passed physical examination under Customs Act 2023');

  const activeItem = allConsignments[selectedNo] || Object.values(allConsignments)[0];

  const handleStatusChange = (newStatus: any) => {
    if (!activeItem) return;
    const progressMap: Record<string, number> = {
      'Received at Warehouse': 20,
      'In Flight': 50,
      'At Hub': 65,
      'Customs Clearance': 75,
      'Out for Delivery': 90,
      'Delivered': 100,
    };
    const updated: Consignment = {
      ...activeItem,
      status: newStatus,
      progressPercentage: progressMap[newStatus] || 70,
    };
    updateConsignment(updated);
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem || !newMilestoneTitle.trim()) return;

    const newMilestone = {
      id: `ms-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) + ' • ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      location: newMilestoneLoc,
      title: newMilestoneTitle,
      description: newMilestoneDesc,
      status: 'completed' as const,
    };

    const updated: Consignment = {
      ...activeItem,
      timeline: [newMilestone, ...activeItem.timeline],
    };
    updateConsignment(updated);
    setNewMilestoneTitle('');
  };

  const handleCreateConsignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNo.trim()) return;

    const created: Consignment = {
      consignmentNo: newNo.trim().toUpperCase(),
      referenceNo: `REF-${newNo.trim().toUpperCase()}`,
      status,
      statusColor: status === 'Delivered' ? 'green' : status === 'Out for Delivery' ? 'amber' : 'blue',
      progressPercentage: status === 'Delivered' ? 100 : status === 'Out for Delivery' ? 90 : 50,
      origin: {
        city: originCity.split(',')[0],
        hub: originCity,
        country: 'China',
        code: 'CAN',
      },
      destination: {
        city: destCity.split(',')[0],
        address: destAddress,
        country: 'Bangladesh',
        code: 'DAC',
      },
      serviceType: service,
      carrier: 'SAIN International Dedicated Freight',
      awbNumber: `AWB-${Math.floor(1000000 + Math.random() * 9000000)}`,
      departureDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      estimatedDelivery: 'Within 48 hours to Doorstep',
      cargoDetails: {
        pieces: 4,
        weight,
        dimensions: 'Standard Air/Sea Pallet',
        volume: '0.6 CBM',
        description: goodsDesc,
      },
      customsStatus: {
        act: 'Bangladesh Customs Act 2023 Compliant',
        tradeTerm: 'CFR Dhaka',
        dutyStatus: 'Pre-Assessment Cleared',
        assessmentStation: 'Dhaka Cargo Village',
      },
      consignee: {
        name: consigneeName,
        phoneMasked: '+880 17*** ***99',
        recipientType: 'Verified Customer',
      },
      timeline: [
        {
          id: `m-init-${Date.now()}`,
          timestamp: 'Just now',
          location: originCity,
          title: 'Booking Created & Cargo Intake Confirmed',
          description: `Consignment ${newNo.toUpperCase()} logged in SAIN Logistics system.`,
          status: 'completed',
        },
      ],
    };

    addConsignment(created);
    setSelectedNo(created.consignmentNo);
    setIsCreatingNew(false);
    setNewNo('');
    openTrackingModal(created.consignmentNo);
  };

  return (
    <>
      {/* Floating admin badge trigger */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsOpen(true)}
          title="Admin: Manage & Update Tracking Consignments"
          className="px-3.5 py-2 glass-panel hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2 hover:text-amber-400 transition cursor-pointer backdrop-blur-md"
        >
          <Settings className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
          <span className="hidden sm:inline">Admin Consignment Editor</span>
          <span className="sm:hidden">Admin</span>
        </button>
      </div>

      {/* Admin Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div
            className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-100 p-6 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-brand text-slate-100">
                    SAIN Consignment Management Panel
                  </h3>
                  <p className="text-xs text-slate-400">
                    Update live statuses, add milestones, or create new test consignments
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toggle between Edit Existing vs Create New */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsCreatingNew(false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  !isCreatingNew
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Update Existing Consignment
              </button>
              <button
                onClick={() => setIsCreatingNew(true)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isCreatingNew
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Consignment</span>
              </button>
            </div>

            {!isCreatingNew ? (
              /* Edit existing */
              <div className="space-y-5 text-xs">
                {/* Select Consignment */}
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Select Active Consignment:
                  </label>
                  <select
                    value={selectedNo}
                    onChange={(e) => setSelectedNo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-amber-400 font-mono font-bold"
                  >
                    {Object.keys(allConsignments).map((code) => (
                      <option key={code} value={code}>
                        {code} – ({allConsignments[code]?.status})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Switcher */}
                {activeItem && (
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <label className="block text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                      Current Transit Status:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        'Received at Warehouse',
                        'In Flight',
                        'At Hub',
                        'Customs Clearance',
                        'Out for Delivery',
                        'Delivered',
                      ].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleStatusChange(st)}
                          className={`p-2.5 rounded-xl border text-center font-bold text-xs transition ${
                            activeItem.status === st
                              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Milestone Event */}
                {activeItem && (
                  <form onSubmit={handleAddMilestone} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-slate-200 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-amber-400" />
                      <span>Log New Milestone / Checkpoint</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Milestone Title</label>
                        <input
                          type="text"
                          value={newMilestoneTitle}
                          onChange={(e) => setNewMilestoneTitle(e.target.value)}
                          placeholder="e.g. Cleared Dhaka Airport Customs"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Location</label>
                        <input
                          type="text"
                          value={newMilestoneLoc}
                          onChange={(e) => setNewMilestoneLoc(e.target.value)}
                          placeholder="e.g. Hazrat Shahjalal International Airport (DAC)"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Details Note</label>
                      <input
                        type="text"
                        value={newMilestoneDesc}
                        onChange={(e) => setNewMilestoneDesc(e.target.value)}
                        placeholder="e.g. Assessment passed under Customs Act 2023. Gate pass issued."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Append Milestone to Tracking Log</span>
                    </button>
                  </form>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      openTrackingModal(selectedNo);
                    }}
                    className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View in Live Tracker</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Create New */
              <form onSubmit={handleCreateConsignment} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Consignment Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={newNo}
                      onChange={(e) => setNewNo(e.target.value)}
                      placeholder="e.g. SAIN-88991-BD"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-amber-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Freight Service
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                    >
                      <option value="Air Freight Priority">Air Freight Priority</option>
                      <option value="Sea Freight (FCL/LCL)">Sea Freight (FCL/LCL)</option>
                      <option value="Hand Carry Express">Hand Carry Express</option>
                      <option value="Export Worldwide">Export Worldwide</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Origin Hub
                    </label>
                    <input
                      type="text"
                      value={originCity}
                      onChange={(e) => setOriginCity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Destination City
                    </label>
                    <input
                      type="text"
                      value={destCity}
                      onChange={(e) => setDestCity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Consignee Name
                    </label>
                    <input
                      type="text"
                      value={consigneeName}
                      onChange={(e) => setConsigneeName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Gross Weight
                    </label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create &amp; Launch Consignment</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
