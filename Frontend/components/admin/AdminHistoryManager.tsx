import React, { useState, useEffect, useMemo } from 'react';
import {
  HistoryRecord,
  getAdminHistory,
  deleteHistoryRecord,
  clearAllAdminHistory,
  exportHistoryAsJson,
  restoreFromSnapshot,
  ADMIN_HISTORY_EVENT,
  HistoryModule,
} from '../../services/adminHistoryService';
import { useTracking } from '../../Context/TrackingContext';
import { ConfirmModal } from './ConfirmModal';
import {
  History,
  Trash2,
  Download,
  Search,
  Filter,
  Eye,
  RefreshCw,
  FileJson,
  CheckCircle,
  Package,
  Home,
  Info,
  Truck,
  Phone,
  Clock,
  User,
  PanelBottom,
  ChevronLeft,
  ChevronRight,
  Database,
  ArrowRight,
  Layers,
  RotateCcw,
  X,
} from 'lucide-react';

const PAGE_SIZE = 10;

export const AdminHistoryManager: React.FC = () => {
  const { updateConsignment } = useTracking();
  const [historyList, setHistoryList] = useState<HistoryRecord[]>(() => getAdminHistory());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSnapshot, setSelectedSnapshot] = useState<{
    record: HistoryRecord;
    jsonString: string;
  } | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    type?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Listen to live history updates from other components
  useEffect(() => {
    const handleUpdate = () => {
      setHistoryList(getAdminHistory());
    };

    window.addEventListener(ADMIN_HISTORY_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(ADMIN_HISTORY_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Filtered and searched records
  const filteredRecords = useMemo(() => {
    return historyList.filter((item) => {
      const matchesModule = selectedModule === 'all' || item.module === selectedModule;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.entityId.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.adminUser.toLowerCase().includes(q) ||
        item.actionLabel.toLowerCase().includes(q) ||
        item.moduleLabel.toLowerCase().includes(q) ||
        item.formatted.toLowerCase().includes(q);

      return matchesModule && matchesSearch;
    });
  }, [historyList, selectedModule, searchQuery]);

  // Pagination calculations (10 items per page)
  const totalItems = filteredRecords.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  // Reset to page 1 if query/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedModule]);

  // Ensure current page is valid
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredRecords.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredRecords, currentPage]);

  const handleDeleteItem = (record: HistoryRecord) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete History Entry?',
      message: `Are you sure you want to delete this history record for "${record.entityId}" (${record.actionLabel})? This will remove the backup memory snapshot.`,
      confirmText: 'Delete Entry',
      type: 'danger',
      onConfirm: () => {
        deleteHistoryRecord(record.id);
        setHistoryList(getAdminHistory());
        showToast('History entry deleted successfully.');
        setConfirmModal(null);
      },
    });
  };

  const handleClearAll = () => {
    if (historyList.length === 0) return;
    setConfirmModal({
      isOpen: true,
      title: 'Clear All Activity History?',
      message: `Permanently delete all ${historyList.length} activity history records and memory snapshots? This cannot be undone. You may want to click "Download Memory JSON" first.`,
      confirmText: 'Clear All History',
      type: 'danger',
      onConfirm: () => {
        clearAllAdminHistory();
        setHistoryList([]);
        showToast('All activity history records cleared.');
        setConfirmModal(null);
      },
    });
  };

  const handleRestoreItem = (record: HistoryRecord) => {
    if (!record.snapshot) {
      showToast('This history record does not have snapshot data to restore.');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Restore Snapshot to this State?',
      message: `Are you sure you want to revert "${record.entityId}" (${record.moduleLabel}) to the snapshot saved on ${record.formatted}? All current live values will be replaced with this historical backup.`,
      confirmText: 'Yes, Restore Now',
      type: 'warning',
      onConfirm: async () => {
        setConfirmModal(null);
        const res = await restoreFromSnapshot(record, updateConsignment);
        if (res.success) {
          setHistoryList(getAdminHistory());
          showToast(res.message);
          setSelectedSnapshot(null);
        } else {
          showToast(`Restoration failed: ${res.message}`);
        }
      },
    });
  };

  const handleExportJson = () => {
    if (historyList.length === 0) {
      showToast('No history records available to export.');
      return;
    }
    exportHistoryAsJson();
    showToast('Downloaded history memory backup JSON file.');
  };

  // Helper for module icon
  const getModuleIcon = (module: HistoryModule) => {
    switch (module) {
      case 'shipments':
        return <Package className="w-4 h-4 text-sky-400" />;
      case 'timers':
        return <Clock className="w-4 h-4 text-purple-400" />;
      case 'home':
        return <Home className="w-4 h-4 text-amber-400" />;
      case 'about':
        return <Info className="w-4 h-4 text-blue-400" />;
      case 'services':
        return <Truck className="w-4 h-4 text-emerald-400" />;
      case 'contact':
        return <Phone className="w-4 h-4 text-teal-400" />;
      case 'footer':
        return <PanelBottom className="w-4 h-4 text-indigo-400" />;
      case 'profile':
        return <User className="w-4 h-4 text-rose-400" />;
      default:
        return <Database className="w-4 h-4 text-slate-400" />;
    }
  };

  // Helper for action badge color
  const getActionBadge = (record: HistoryRecord) => {
    switch (record.actionType) {
      case 'create':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'status_change':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'delete':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'restore':
        return 'bg-teal-500/15 text-teal-300 border-teal-500/30';
      case 'update':
      default:
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#0f1d26] text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0f1d26] via-[#162734] to-[#0f1d26] rounded-2xl p-6 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold tracking-wider uppercase mb-1">
            <History className="w-4 h-4" />
            <span>Audit Trail & Memory Bank</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Admin Activity & History Memory
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Every change made across shipments, schedules, and CMS editors is saved as a memory backup snapshot. Records are ordered newest-first with 10 records per page.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setHistoryList(getAdminHistory())}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition border border-slate-700/60 cursor-pointer shadow-sm"
            title="Refresh history list"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a6c7a] hover:bg-[#155965] text-white rounded-xl text-xs font-bold transition border border-teal-500/40 cursor-pointer shadow-md hover:shadow-teal-900/40"
            title="Export all memory snapshots as a downloadable JSON file"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>Download Memory (JSON)</span>
          </button>

          {historyList.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 rounded-xl text-xs font-semibold transition border border-rose-500/30 cursor-pointer"
              title="Clear all stored activity history"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Bill No, Admin, Action or description..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a6c7a]/30 focus:border-[#1a6c7a] transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Module Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 px-1">
            <Filter className="w-3 h-3" />
            <span>Section:</span>
          </span>
          {[
            { id: 'all', label: 'All' },
            { id: 'shipments', label: 'Shipments' },
            { id: 'timers', label: 'Timers' },
            { id: 'home', label: 'Hero' },
            { id: 'about', label: 'About' },
            { id: 'services', label: 'Services' },
            { id: 'contact', label: 'Contact' },
            { id: 'footer', label: 'Footer' },
            { id: 'profile', label: 'Profile' },
          ].map((tab) => {
            const isActive = selectedModule === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedModule(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0f1d26] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* History Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Stats Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#1a6c7a]" />
            <span className="text-xs font-bold text-slate-700">
              Activity Records ({totalItems})
            </span>
            {totalItems > 0 && (
              <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Showing up to 10 latest entries per page
          </div>
        </div>

        {/* Records Content */}
        {totalItems === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <History className="w-6 h-6" />
            </div>
            <div className="font-bold text-slate-700 text-sm">No activity history records found</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery || selectedModule !== 'all'
                ? 'No history matches your search or section filter.'
                : 'Any updates or saves made in the admin panel will automatically appear here as backup memory.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Section / Module</th>
                  <th className="py-3 px-4">Action & Target</th>
                  <th className="py-3 px-4">Change Description</th>
                  <th className="py-3 px-4">Admin User</th>
                  <th className="py-3 px-4 text-center w-36">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedRecords.map((item, idx) => {
                  const itemIndex = (currentPage - 1) * PAGE_SIZE + idx + 1;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Row Index */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-400 text-[11px]">
                        {itemIndex}
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-800 text-xs">
                          {item.dateStr}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{item.timeStr}</span>
                        </div>
                      </td>

                      {/* Module */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 font-bold text-[11px] border border-slate-200/60">
                          {getModuleIcon(item.module)}
                          <span>{item.moduleLabel}</span>
                        </div>
                      </td>

                      {/* Action & Target */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-block w-fit px-2 py-0.5 rounded text-[10px] font-bold border ${getActionBadge(
                              item
                            )}`}
                          >
                            {item.actionLabel}
                          </span>
                          <span className="font-bold text-slate-900 font-mono text-[11px]">
                            {item.entityId}
                          </span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-4 max-w-xs md:max-w-md">
                        <p className="text-slate-700 leading-relaxed text-xs line-clamp-2">
                          {item.description}
                        </p>
                      </td>

                      {/* Admin User */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-[#1a6c7a] text-white flex items-center justify-center text-[9px] font-bold">
                            {item.adminUser.substring(0, 1).toUpperCase()}
                          </div>
                          <span className="text-slate-600 font-semibold text-[11px]">
                            {item.adminUser}
                          </span>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View Snapshot Modal */}
                          {item.snapshot && (
                            <button
                              onClick={() =>
                                setSelectedSnapshot({
                                  record: item,
                                  jsonString: JSON.stringify(item.snapshot, null, 2),
                                })
                              }
                              className="p-1.5 text-slate-500 hover:text-[#1a6c7a] hover:bg-teal-50 rounded-lg transition cursor-pointer"
                              title="View Memory JSON Snapshot"
                            >
                              <FileJson className="w-4 h-4 text-teal-600" />
                            </button>
                          )}

                          {/* Restore Snapshot Button */}
                          {item.snapshot && (
                            <button
                              onClick={() => handleRestoreItem(item)}
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                              title="Restore to this snapshot state"
                            >
                              <RotateCcw className="w-4 h-4 text-amber-500" />
                            </button>
                          )}

                          {/* Delete Item */}
                          <button
                            onClick={() => handleDeleteItem(item)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Delete this history entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar (Max 10 records per page) */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Showing <span className="font-bold text-slate-800">{(currentPage - 1) * PAGE_SIZE + 1}</span> to{' '}
              <span className="font-bold text-slate-800">
                {Math.min(currentPage * PAGE_SIZE, totalItems)}
              </span>{' '}
              of <span className="font-bold text-slate-800">{totalItems}</span> records
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Numbered Page Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                // Show first, last, current, and adjacent pages
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition cursor-pointer ${
                        isActive
                          ? 'bg-[#1a6c7a] text-white shadow-xs'
                          : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return (
                    <span key={pageNum} className="px-1 text-slate-400 text-xs">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Snapshot Preview Modal */}
      {selectedSnapshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#0f1d26] border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <FileJson className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold">
                    Memory Backup Snapshot: {selectedSnapshot.record.entityId}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Saved on {selectedSnapshot.record.formatted} by {selectedSnapshot.record.adminUser}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSnapshot(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description & Action pill */}
            <div className="px-5 py-3 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between text-xs">
              <div className="text-slate-300">
                <span className="text-slate-500 font-medium">Action: </span>
                <span className="font-bold text-amber-300">{selectedSnapshot.record.actionLabel}</span>
                <span className="mx-2 text-slate-600">•</span>
                <span className="text-slate-400">{selectedSnapshot.record.description}</span>
              </div>
            </div>

            {/* JSON Code Viewer */}
            <div className="p-4 flex-1 overflow-y-auto bg-slate-950 font-mono text-[11px] text-teal-300 select-all">
              <pre className="whitespace-pre-wrap break-words leading-relaxed">
                {selectedSnapshot.jsonString}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRestoreItem(selectedSnapshot.record)}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Restore system state to this exact snapshot"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-950" />
                  <span>Restore to this State</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedSnapshot.jsonString);
                    showToast('JSON snapshot copied to clipboard!');
                  }}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Copy JSON
                </button>
              </div>
              <button
                onClick={() => setSelectedSnapshot(null)}
                className="px-4 py-1.5 bg-[#1a6c7a] hover:bg-[#155965] text-white text-xs font-bold rounded-lg transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
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
