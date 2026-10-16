import { API_BASE_URL } from './databaseConfig';

export const CONFIG_KEYS = {
  SHIPMENT_TIMERS: 'sain_shipment_timers_config',
  SHIPMENT_TIMERS_HEADER: 'sain_shipment_timers_header_config',
  HERO_CONTENT: 'sain_hero_content_config',
  WHATSAPP_NUMBER: 'sain_whatsapp_number',
  SERVICES_CONTENT: 'sain_services_content_config',
  SERVICES_HEADER: 'sain_services_section_config',
  ABOUT_CONTENT: 'sain_about_content_config',
  CONTACT_CONTENT: 'sain_contact_content_config',
  FOOTER_CONTENT: 'sain_footer_content_config',
  ADMIN_PROFILE: 'sain_admin_profile',
} as const;

/**
 * Persists a configuration payload both to localStorage (instant local cache)
 * and asynchronously to the Neon PostgreSQL database via Django DRF.
 */
export async function saveSiteConfigToDb(key: string, data: any): Promise<boolean> {
  // 1. Save to local storage for immediate offline/local fast retrieval
  try {
    localStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data));
  } catch (e) {
    console.warn(`[siteConfig] localStorage write error for ${key}:`, e);
  }

  // 2. Persist to Neon PostgreSQL database
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/config/${encodeURIComponent(key)}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      return true;
    } else {
      console.warn(`[siteConfig] DB save returned status ${res.status} for ${key}`);
      return false;
    }
  } catch (err) {
    console.info(`[siteConfig] DB save offline or pending for ${key}:`, err);
    return false;
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
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/config/${encodeURIComponent(key)}/`, {
      headers: { Accept: 'application/json' },
    });

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
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/config/`, {
      headers: { Accept: 'application/json' },
    });

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
    }
  } catch (err) {
    console.info('[siteConfig] Initial DB sync skipped (offline mode)');
  }
}
