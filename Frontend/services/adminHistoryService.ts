import { getBangladeshDateTime } from './trackingData';
import { API_BASE_URL } from './databaseConfig';

export type HistoryModule = 
  | 'shipments' 
  | 'timers' 
  | 'home' 
  | 'about' 
  | 'services' 
  | 'contact' 
  | 'footer' 
  | 'profile' 
  | 'system';

export type HistoryActionType = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'status_change' 
  | 'restore';

export interface HistoryRecord {
  id: string;
  timestamp: string; // ISO String for exact chronological sorting
  dateStr: string;   // Bangladesh date, e.g. "2026-10-18"
  timeStr: string;   // Bangladesh time, e.g. "12:15 am"
  formatted: string; // "Oct 18, 2026 at 12:15 am"
  module: HistoryModule;
  moduleLabel: string;
  actionType: HistoryActionType;
  actionLabel: string;
  entityId: string;
  adminUser: string;
  description: string;
  details?: {
    changes?: Record<string, { from?: any; to?: any }>;
    summary?: string;
  };
  snapshot?: any; // Full JSON memory backup of the edited entity/config
}

export const ADMIN_HISTORY_STORAGE_KEY = 'sain_admin_activity_history';
export const ADMIN_HISTORY_EVENT = 'sain_admin_history_updated';

// Helper to get current admin username
export function getCurrentAdminUsername(): string {
  try {
    const raw = localStorage.getItem('sain_admin_profile');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.username) return parsed.username;
    }
  } catch {}
  return 'sain_sakib6055';
}

/**
 * Retrieves all stored history memory records.
 * Always guarantees records are strictly sorted with newest records at the very top.
 */
export function getAdminHistory(): HistoryRecord[] {
  try {
    const stored = localStorage.getItem(ADMIN_HISTORY_STORAGE_KEY);
    if (stored) {
      const records: HistoryRecord[] = JSON.parse(stored);
      if (Array.isArray(records)) {
        // Guarantee newest first (descending timestamp)
        return records.sort((a, b) => {
          const tA = new Date(a.timestamp).getTime();
          const tB = new Date(b.timestamp).getTime();
          return tB - tA;
        });
      }
    }
  } catch (e) {
    console.warn('[adminHistory] Failed to read history from localStorage:', e);
  }
  return [];
}

/**
 * Records a new change in the admin panel as a memory/backup history item.
 * Automatically inserts at the top of the history list, persists to localStorage & backend database,
 * and notifies active components via window CustomEvent.
 */
export function recordAdminHistory(params: {
  module: HistoryModule;
  moduleLabel: string;
  actionType: HistoryActionType;
  actionLabel: string;
  entityId: string;
  description: string;
  adminUser?: string;
  details?: {
    changes?: Record<string, { from?: any; to?: any }>;
    summary?: string;
  };
  snapshot?: any;
}): HistoryRecord {
  const bdNow = getBangladeshDateTime();
  const isoTime = new Date().toISOString();
  const username = params.adminUser || getCurrentAdminUsername();

  const record: HistoryRecord = {
    id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    timestamp: isoTime,
    dateStr: bdNow.date,
    timeStr: bdNow.time,
    formatted: bdNow.formatted,
    module: params.module,
    moduleLabel: params.moduleLabel,
    actionType: params.actionType,
    actionLabel: params.actionLabel,
    entityId: params.entityId,
    adminUser: username,
    description: params.description,
    details: params.details,
    snapshot: params.snapshot,
  };

  try {
    const existing = getAdminHistory();
    // Add new record at index 0 (very top)
    const updated = [record, ...existing];

    // Cap history at 500 entries to prevent localStorage quota issues
    const trimmed = updated.slice(0, 500);

    localStorage.setItem(ADMIN_HISTORY_STORAGE_KEY, JSON.stringify(trimmed));

    // Broadcast update event for real-time reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(ADMIN_HISTORY_EVENT, { detail: record }));
    }

    // Persist asynchronously to backend database config store
    persistHistoryToBackend(trimmed);
  } catch (err) {
    console.warn('[adminHistory] Failed to save history entry:', err);
  }

  return record;
}

async function persistHistoryToBackend(data: HistoryRecord[]) {
  try {
    await fetch(`${API_BASE_URL}/api/v1/config/${encodeURIComponent(ADMIN_HISTORY_STORAGE_KEY)}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch {}
}

/**
 * Deletes a single history record by ID.
 */
export function deleteHistoryRecord(id: string): boolean {
  try {
    const existing = getAdminHistory();
    const filtered = existing.filter((item) => item.id !== id);
    localStorage.setItem(ADMIN_HISTORY_STORAGE_KEY, JSON.stringify(filtered));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(ADMIN_HISTORY_EVENT, { detail: { deletedId: id } }));
    }

    persistHistoryToBackend(filtered);
    return true;
  } catch (err) {
    console.warn('[adminHistory] Failed to delete history item:', err);
    return false;
  }
}

/**
 * Clears all history memory records.
 */
export function clearAllAdminHistory(): boolean {
  try {
    localStorage.setItem(ADMIN_HISTORY_STORAGE_KEY, JSON.stringify([]));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(ADMIN_HISTORY_EVENT, { detail: { cleared: true } }));
    }

    persistHistoryToBackend([]);
    return true;
  } catch (err) {
    console.warn('[adminHistory] Failed to clear history:', err);
    return false;
  }
}

/**
 * Exports all history records as a formatted JSON memory file downloaded directly to user's computer.
 */
export function exportHistoryAsJson(): void {
  const records = getAdminHistory();
  const bdNow = getBangladeshDateTime();
  const dataStr = JSON.stringify(
    {
      system: 'SAIN International Logistics Management Suite',
      exportType: 'Admin Activity & Memory History Backup',
      exportedAt: bdNow.formatted,
      exportedBy: getCurrentAdminUsername(),
      totalRecords: records.length,
      historyRecords: records,
    },
    null,
    2
  );

  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `sain-logistics-history-memory-${bdNow.date}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Restores a snapshot from a history record back into the active system state.
 * Supports:
 * - Shipments: restores the full Consignment object to localStorage, React state, and backend DB
 * - CMS & Configs: restores the configuration key in localStorage and backend DB
 */
export async function restoreFromSnapshot(
  record: HistoryRecord,
  updateConsignmentFn?: (c: any) => Promise<void>
): Promise<{ success: boolean; message: string }> {
  if (!record.snapshot) {
    return { success: false, message: 'This history entry has no snapshot data to restore.' };
  }

  const snapshot = record.snapshot;

  try {
    if (record.module === 'shipments') {
      const consignment = snapshot;
      if (!consignment || !consignment.consignmentNo) {
        return { success: false, message: 'Invalid consignment snapshot data.' };
      }

      // Check if this was an undo of a newly created consignment
      if (consignment.isNewConsignment) {
        const stored = localStorage.getItem('sain_logistics_consignments_data');
        const all = stored ? JSON.parse(stored) : {};
        delete all[consignment.consignmentNo];
        localStorage.setItem('sain_logistics_consignments_data', JSON.stringify(all));

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('sain_consignment_updated', { detail: { consignmentNo: consignment.consignmentNo, deleted: true } }));
          window.dispatchEvent(new Event('storage'));
        }

        try {
          await fetch(`${API_BASE_URL}/api/v1/couriers/track/${encodeURIComponent(consignment.consignmentNo)}/`, {
            method: 'DELETE',
          });
        } catch {}

        recordAdminHistory({
          module: 'shipments',
          moduleLabel: 'Shipment Manager',
          actionType: 'restore',
          actionLabel: 'Reverted Creation',
          entityId: consignment.consignmentNo,
          description: `Reverted creation of consignment ${consignment.consignmentNo}.`,
        });

        return {
          success: true,
          message: `Consignment ${consignment.consignmentNo} creation reverted successfully!`,
        };
      }

      // If user passed updateConsignmentFn from context, use it
      if (updateConsignmentFn) {
        await updateConsignmentFn(consignment);
      } else {
        // Fallback directly to localStorage and backend fetch
        const stored = localStorage.getItem('sain_logistics_consignments_data');
        const all = stored ? JSON.parse(stored) : {};
        all[consignment.consignmentNo] = consignment;
        localStorage.setItem('sain_logistics_consignments_data', JSON.stringify(all));

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('sain_consignment_updated', { detail: consignment }));
          window.dispatchEvent(new Event('storage'));
        }

        try {
          await fetch(`${API_BASE_URL}/api/v1/couriers/track/${encodeURIComponent(consignment.consignmentNo)}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(consignment),
          });
        } catch {}
      }

      // If consignment was in trash, un-trash it
      try {
        const trashRaw = localStorage.getItem('sain_trashed_consignments');
        if (trashRaw) {
          const trash = JSON.parse(trashRaw);
          if (trash[consignment.consignmentNo]) {
            delete trash[consignment.consignmentNo];
            localStorage.setItem('sain_trashed_consignments', JSON.stringify(trash));
          }
        }
      } catch {}

      // Log the restoration event
      recordAdminHistory({
        module: 'shipments',
        moduleLabel: 'Shipment Manager',
        actionType: 'restore',
        actionLabel: 'Restored from Snapshot',
        entityId: consignment.consignmentNo,
        description: `Restored consignment ${consignment.consignmentNo} to historical state from ${record.formatted} (Status: "${consignment.status}").`,
        snapshot: consignment,
      });

      return {
        success: true,
        message: `Consignment ${consignment.consignmentNo} successfully restored to snapshot from ${record.formatted}!`,
      };
    }

    // CMS & Configuration modules
    let targetKey: string | null = null;
    const label = record.moduleLabel;

    switch (record.module) {
      case 'home':
        targetKey = record.entityId.toLowerCase().includes('whatsapp')
          ? 'sain_whatsapp_number'
          : 'sain_hero_content_config';
        break;
      case 'about':
        targetKey = 'sain_about_content_config';
        break;
      case 'services':
        targetKey = record.entityId.toLowerCase().includes('header')
          ? 'sain_services_section_config'
          : 'sain_services_content_config';
        break;
      case 'contact':
        targetKey = 'sain_contact_content_config';
        break;
      case 'footer':
        targetKey = 'sain_footer_content_config';
        break;
      case 'timers':
        targetKey = record.entityId.toLowerCase().includes('header')
          ? 'sain_shipment_timers_header_config'
          : 'sain_shipment_timers_config';
        break;
      case 'profile':
        targetKey = 'sain_admin_profile';
        break;
      default:
        targetKey = record.entityId;
        break;
    }

    if (targetKey) {
      // Capture current state before overwriting so the restoration itself can be reverted if needed
      let previousStateBeforeRestore: any = null;
      try {
        const rawExisting = localStorage.getItem(targetKey);
        if (rawExisting) {
          try {
            previousStateBeforeRestore = JSON.parse(rawExisting);
          } catch {
            previousStateBeforeRestore = rawExisting;
          }
        }
      } catch {}

      localStorage.setItem(targetKey, typeof snapshot === 'string' ? snapshot : JSON.stringify(snapshot));

      // Persist to backend DB
      try {
        await fetch(`${API_BASE_URL}/api/v1/config/${encodeURIComponent(targetKey)}/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(snapshot),
        });
      } catch {}

      // Broadcast storage and custom event for reactive UI updates across all components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('sain_site_config_updated', { detail: { key: targetKey, data: snapshot } }));
        if (record.module === 'footer') window.dispatchEvent(new Event('sain_footer_content_updated'));
        if (record.module === 'home') {
          window.dispatchEvent(new Event('sain_hero_content_updated'));
          window.dispatchEvent(new Event('sain_whatsapp_updated'));
        }
        if (record.module === 'about') window.dispatchEvent(new Event('sain_about_content_updated'));
        if (record.module === 'services') window.dispatchEvent(new Event('sain_services_content_updated'));
        if (record.module === 'contact') window.dispatchEvent(new Event('sain_contact_content_updated'));
        if (record.module === 'timers') window.dispatchEvent(new Event('sain_shipment_timers_updated'));
      }

      // Log the restoration event with previous state so it can be un-done if desired
      recordAdminHistory({
        module: record.module,
        moduleLabel: record.moduleLabel,
        actionType: 'restore',
        actionLabel: 'Restored from Snapshot',
        entityId: record.entityId,
        description: `Restored ${label} (${record.entityId}) to historical snapshot from ${record.formatted}.`,
        snapshot: previousStateBeforeRestore || snapshot,
      });

      return {
        success: true,
        message: `${label} successfully restored to configuration snapshot from ${record.formatted}!`,
      };
    }

    return { success: false, message: 'Unrecognized module or target configuration key.' };
  } catch (err: any) {
    console.error('[restoreFromSnapshot] Error restoring snapshot:', err);
    return { success: false, message: err?.message || 'Failed to restore snapshot.' };
  }
}

