import { getApiBaseUrl } from './databaseConfig';
import { recordAdminHistory, ADMIN_HISTORY_STORAGE_KEY } from './adminHistoryService';

export const CONFIG_KEYS = {
  SHIPMENT_TIMERS: 'sain_shipment_timers_config',
  SHIPMENT_TIMERS_HEADER: 'sain_shipment_timers_header_config',
  HERO_CONTENT: 'sain_hero_content_config',
  WHATSAPP_NUMBER: 'sain_whatsapp_number',
  MESSENGER_URL: 'sain_messenger_url',
  SERVICES_CONTENT: 'sain_services_content_config',
  SERVICES_HEADER: 'sain_services_section_config',
  ABOUT_CONTENT: 'sain_about_content_config',
  CONTACT_CONTENT: 'sain_contact_content_config',
  FOOTER_CONTENT: 'sain_footer_content_config',
  ADMIN_PROFILE: 'sain_admin_profile',
  CUSTOM_ORIGINS: 'sain_custom_origins',
  CUSTOM_DESTINATIONS: 'sain_custom_destinations',
  CUSTOM_AGENTS: 'sain_custom_agents',
  CUSTOM_CLIENTS: 'sain_custom_clients',
  CUSTOM_EMPLOYEES: 'sain_custom_employees',
  TRASHED_CONSIGNMENTS: 'sain_trashed_consignments',
  LOGISTICS_RATES: 'sain_logistics_rates_config',
} as const;

function recordConfigChangeHistory(key: string, data: any, previousData: any) {
  let module: any = 'system';
  let moduleLabel = 'System Settings';
  let actionLabel = 'Configuration Saved';
  let entityId = key;
  let description = `Saved configuration for ${key}`;

  switch (key) {
    case CONFIG_KEYS.HERO_CONTENT:
      module = 'home';
      moduleLabel = 'Hero Section';
      actionLabel = 'Updated Hero Section';
      entityId = 'Hero Content';
      description = 'Saved changes to Hero Section banner, headings, and description';
      break;
    case CONFIG_KEYS.WHATSAPP_NUMBER:
      module = 'home';
      moduleLabel = 'Hero Section';
      actionLabel = 'Updated WhatsApp';
      entityId = 'WhatsApp Contact';
      description = `Updated WhatsApp direct contact number to ${typeof data === 'string' ? data : JSON.stringify(data)}`;
      break;
    case CONFIG_KEYS.MESSENGER_URL:
      module = 'home';
      moduleLabel = 'Hero Section';
      actionLabel = 'Updated Messenger';
      entityId = 'Messenger Contact';
      description = `Updated Facebook Messenger chat link to ${typeof data === 'string' ? data : JSON.stringify(data)}`;
      break;
    case CONFIG_KEYS.ABOUT_CONTENT:
      module = 'about';
      moduleLabel = 'About Us Section';
      actionLabel = 'Updated About Us';
      entityId = 'About Content';
      description = 'Saved updates to company overview, values, and milestone story';
      break;
    case CONFIG_KEYS.SERVICES_CONTENT:
      module = 'services';
      moduleLabel = 'Services Catalog';
      actionLabel = 'Updated Services';
      entityId = 'Services Cards';
      description = 'Saved updates to service offerings, freight cards, and features';
      break;
    case CONFIG_KEYS.SERVICES_HEADER:
      module = 'services';
      moduleLabel = 'Services Catalog';
      actionLabel = 'Updated Services Header';
      entityId = 'Services Header';
      description = 'Saved changes to services section title and description';
      break;
    case CONFIG_KEYS.CONTACT_CONTENT:
      module = 'contact';
      moduleLabel = 'Contact & Branches';
      actionLabel = 'Updated Branch Info';
      entityId = 'Branch Directory';
      description = 'Saved updates to contact details, branch hubs, and operational hours';
      break;
    case CONFIG_KEYS.FOOTER_CONTENT:
      module = 'footer';
      moduleLabel = 'Footer Section';
      actionLabel = 'Updated Footer';
      entityId = 'Footer CMS';
      description = 'Saved changes to footer navigation, column titles, and links';
      break;
    case CONFIG_KEYS.SHIPMENT_TIMERS:
      module = 'timers';
      moduleLabel = 'Shipment Timers';
      actionLabel = 'Updated Timers';
      entityId = 'Inbound Schedules';
      description = 'Saved changes to active arrival timers and scheduled flights/vessels';
      break;
    case CONFIG_KEYS.SHIPMENT_TIMERS_HEADER:
      module = 'timers';
      moduleLabel = 'Shipment Timers';
      actionLabel = 'Updated Timers Header';
      entityId = 'Timer Header';
      description = 'Saved changes to shipment timer section header and badge';
      break;
    case CONFIG_KEYS.ADMIN_PROFILE:
      module = 'profile';
      moduleLabel = 'Admin Profile & Security';
      actionLabel = 'Updated Profile';
      entityId = 'Admin Credentials';
      description = `Updated administrator profile settings for ${data?.username || 'admin'}`;
      break;
    case CONFIG_KEYS.CUSTOM_ORIGINS:
    case CONFIG_KEYS.CUSTOM_DESTINATIONS:
    case CONFIG_KEYS.CUSTOM_AGENTS:
    case CONFIG_KEYS.CUSTOM_CLIENTS:
    case CONFIG_KEYS.CUSTOM_EMPLOYEES:
      module = 'shipments';
      moduleLabel = 'Shipment Manager';
      actionLabel = 'Updated Dropdown List';
      entityId = key;
      description = `Updated ${key.replace('sain_custom_', '')} catalog list in Central Database`;
      break;
    case CONFIG_KEYS.TRASHED_CONSIGNMENTS:
      module = 'shipments';
      moduleLabel = 'Shipment Manager';
      actionLabel = 'Updated Recycle Bin';
      entityId = 'Recycle Bin';
      description = 'Updated trashed shipments in Central Database';
      break;
    default:
      return; // Do not record unknown / internal keys
  }

  // The snapshot MUST be the state BEFORE this change was applied so clicking "Restore" reverts back to it!
  const stateToRestore = previousData !== null && previousData !== undefined ? previousData : data;

  recordAdminHistory({
    module,
    moduleLabel,
    actionType: 'update',
    actionLabel,
    entityId,
    description,
    snapshot: stateToRestore,
    details: {
      summary: 'Previous configuration backed up. Click Restore to revert back to this state.',
    },
  });
}

export interface SaveDbResult {
  success: boolean;
  error?: string;
  key: string;
}

/**
 * Persists a configuration payload both to localStorage (instant local cache)
 * and asynchronously to the Neon PostgreSQL database via Django DRF.
 */
export async function saveSiteConfigToDb(
  key: string,
  data: any,
  explicitPrevious?: any
): Promise<SaveDbResult> {
  // 1. Capture previous data BEFORE overwriting localStorage
  let previousData = explicitPrevious;
  if (previousData === undefined) {
    try {
      const existingRaw = localStorage.getItem(key);
      if (existingRaw) {
        try {
          previousData = JSON.parse(existingRaw);
        } catch {
          previousData = existingRaw;
        }
      }
    } catch {}
  }

  // Check if previous data is identical to new data
  const isIdentical =
    previousData !== null &&
    previousData !== undefined &&
    JSON.stringify(previousData) === JSON.stringify(data);

  // 2. Save to local storage for immediate offline/local fast retrieval
  try {
    localStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data));
  } catch (e) {
    console.warn(`[siteConfig] localStorage write error for ${key}:`, e);
  }

  // 3. Auto-record to Admin Activity History Memory if key is an editable configuration
  if (key !== ADMIN_HISTORY_STORAGE_KEY && !isIdentical) {
    try {
      recordConfigChangeHistory(key, data, previousData);
    } catch (err) {
      console.warn('[siteConfig] History logging error:', err);
    }
  }

  // 4. Dispatch site config updated event so any active component can re-render immediately
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sain_site_config_updated', { detail: { key, data } }));
    window.dispatchEvent(new Event('storage'));
    if (key === CONFIG_KEYS.FOOTER_CONTENT) window.dispatchEvent(new Event('sain_footer_content_updated'));
    if (key === CONFIG_KEYS.HERO_CONTENT) window.dispatchEvent(new Event('sain_hero_content_updated'));
    if (key === CONFIG_KEYS.WHATSAPP_NUMBER) window.dispatchEvent(new Event('sain_whatsapp_updated'));
    if (key === CONFIG_KEYS.SERVICES_CONTENT || key === CONFIG_KEYS.SERVICES_HEADER) window.dispatchEvent(new Event('sain_services_content_updated'));
    if (key === CONFIG_KEYS.ABOUT_CONTENT) window.dispatchEvent(new Event('sain_about_content_updated'));
    if (key === CONFIG_KEYS.CONTACT_CONTENT) window.dispatchEvent(new Event('sain_contact_content_updated'));
    if (key === CONFIG_KEYS.SHIPMENT_TIMERS || key === CONFIG_KEYS.SHIPMENT_TIMERS_HEADER) window.dispatchEvent(new Event('sain_shipment_timers_updated'));
    if (key === CONFIG_KEYS.CUSTOM_ORIGINS || key === CONFIG_KEYS.CUSTOM_DESTINATIONS || key === CONFIG_KEYS.CUSTOM_AGENTS || key === CONFIG_KEYS.CUSTOM_CLIENTS || key === CONFIG_KEYS.CUSTOM_EMPLOYEES) {
      window.dispatchEvent(new Event('sain_custom_dropdowns_updated'));
    }
  }

  // 5. Persist to Neon PostgreSQL database via live backend
  const baseUrl = getApiBaseUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout for server cold starts

    const res = await fetch(`${baseUrl}/api/v1/config/${encodeURIComponent(key)}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const result: SaveDbResult = { success: true, key };
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sain_db_save_status', { detail: result }));
      }
      return result;
    } else {
      const errText = await res.text().catch(() => '');
      const errMsg = `Database responded with status ${res.status}: ${errText.slice(0, 100)}`;
      console.warn(`[siteConfig] DB save returned status ${res.status} for ${key}`);
      const result: SaveDbResult = { success: false, error: errMsg, key };
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sain_db_save_status', { detail: result }));
      }
      return result;
    }
  } catch (err: any) {
    const isTimeout = err.name === 'AbortError';
    const errMsg = isTimeout
      ? 'Connection timed out. Central database may be waking up, please try again.'
      : (err.message || 'Network connection failed. Backend server unreachable.');

    console.warn(`[siteConfig] DB save error for ${key}:`, errMsg);
    const result: SaveDbResult = { success: false, error: errMsg, key };
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sain_db_save_status', { detail: result }));
    }
    return result;
  }
}

/**
 * Retrieves a configuration payload from Neon PostgreSQL database.
 * Falls back to localStorage, then defaultData if database is unreachable.
 */
export async function fetchSiteConfigFromDb<T>(key: string, defaultData: T): Promise<T> {
  // First, check localStorage for fast load
  let cached: T = defaultData;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      cached = JSON.parse(raw);
    }
  } catch {}

  // Fetch from Neon PostgreSQL database
  const baseUrl = getApiBaseUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`${baseUrl}/api/v1/config/${encodeURIComponent(key)}/`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json && json.exists && json.data !== null && json.data !== undefined) {
        const dbData = json.data as T;
        try {
          localStorage.setItem(key, typeof dbData === 'string' ? dbData : JSON.stringify(dbData));
        } catch {}
        return dbData;
      }
    }
  } catch (e) {
    console.info(`[siteConfig] DB fetch offline for ${key}, using cached fallback.`);
  }

  return cached;
}

/**
 * Initializes and synchronizes all site configurations from Neon PostgreSQL on app startup.
 * Updates local caches and dispatches live update events across components.
 */
export async function syncAllSiteConfigsFromDb(): Promise<void> {
  const baseUrl = getApiBaseUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(`${baseUrl}/api/v1/config/`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return;

    const allConfigs = await res.json();
    if (!allConfigs || typeof allConfigs !== 'object') return;

    let hasUpdates = false;

    for (const [key, val] of Object.entries(allConfigs)) {
      if (val !== undefined && val !== null) {
        try {
          localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
          hasUpdates = true;
        } catch {}
      }
    }

    if (hasUpdates && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('sain_shipment_timers_updated'));
      window.dispatchEvent(new Event('sain_hero_content_updated'));
      window.dispatchEvent(new Event('sain_whatsapp_updated'));
      window.dispatchEvent(new Event('sain_services_content_updated'));
      window.dispatchEvent(new Event('sain_about_content_updated'));
      window.dispatchEvent(new Event('sain_contact_content_updated'));
      window.dispatchEvent(new Event('sain_footer_content_updated'));
      window.dispatchEvent(new Event('sain_custom_dropdowns_updated'));
    }
  } catch (err) {
    console.info('[siteConfig] Initial DB sync skipped (offline mode)');
  }
}

