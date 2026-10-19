export type DatabaseProvider = 'postgresql' | 'neon' | 'supabase' | 'django-drf' | 'local-cache';

export interface DatabaseConnectionConfig {
  provider: DatabaseProvider;
  neon: {
    connectionString: string;
    poolingEnabled: boolean;
    branch: string;
  };
  supabase: {
    url: string;
    anonKey: string;
    databaseUrl: string;
  };
  postgresql: {
    host: string;
    port: number;
    database: string;
    user: string;
  };
  djangoApi: {
    baseUrl: string;
    trackingEndpoint: string;
    ordersEndpoint: string;
  };
}

export const DEFAULT_DB_CONFIG: DatabaseConnectionConfig = {
  provider: 'django-drf',
  neon: {
    connectionString: 'postgresql://sain_admin:neon_secure_key@ep-logistics-dhaka-01.us-east-2.aws.neon.tech/sain_logistics?sslmode=require',
    poolingEnabled: true,
    branch: 'main',
  },
  supabase: {
    url: 'https://sain-logistics-project.supabase.co',
    anonKey: 'sbp_anon_token_sain_international_logistics_2026',
    databaseUrl: 'postgresql://postgres.sain-logistics:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
  },
  postgresql: {
    host: 'localhost',
    port: 5432,
    database: 'sain_db',
    user: 'sain_user',
  },
  djangoApi: {
    baseUrl: 'https://skzlogisticsbackend.onrender.com',
    trackingEndpoint: '/api/v1/couriers/track/',
    ordersEndpoint: '/api/v1/order/',
  },
};

export const LIVE_BACKEND_URL = 'https://skzlogisticsbackend.onrender.com';
export const LOCAL_BACKEND_URL = 'http://127.0.0.1:8000';
export const BACKEND_ENV_KEY = 'sain_backend_env_mode'; // 'live' | 'local'

export function getBackendEnv(): 'live' | 'local' {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(BACKEND_ENV_KEY);
    if (stored === 'local') return 'local';
    if (stored === 'live') return 'live';
  }
  return 'live'; // Default to live production Neon DB backend so both localhost and live site use central DB
}

export function setBackendEnv(env: 'live' | 'local'): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(BACKEND_ENV_KEY, env);
    window.dispatchEvent(new CustomEvent('sain_backend_env_changed', { detail: env }));
  }
}

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('sain_api_base_url_override');
    if (override && override.trim()) return override.trim().replace(/\/+$/, '');

    const envMode = getBackendEnv();
    if (envMode === 'local') return LOCAL_BACKEND_URL;
    return LIVE_BACKEND_URL;
  }

  const envVar = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envVar && envVar.trim()) {
    return envVar.trim().replace(/\/+$/, '');
  }

  return LIVE_BACKEND_URL;
}

export const API_BASE_URL = getApiBaseUrl();

export const DB_STORAGE_KEY = 'sain_db_provider_config';

export async function checkBackendHealth(targetUrl: string = getApiBaseUrl()): Promise<{
  isOnline: boolean;
  latencyMs: number;
  statusText?: string;
  error?: string;
}> {
  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout for Render wake-up

    const res = await fetch(`${targetUrl}/api/v1/health/`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const latency = Math.round(performance.now() - start);
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        isOnline: true,
        latencyMs: latency,
        statusText: data.status || 'online',
      };
    } else {
      return {
        isOnline: false,
        latencyMs: latency,
        error: `Server responded with status ${res.status}`,
      };
    }
  } catch (err: any) {
    const latency = Math.round(performance.now() - start);
    const msg = err.name === 'AbortError' ? 'Connection timed out (Server sleeping or unreachable)' : (err.message || 'Network error');
    return {
      isOnline: false,
      latencyMs: latency,
      error: msg,
    };
  }
}

export function getDatabaseConfig(): DatabaseConnectionConfig {
  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_DB_CONFIG, ...JSON.parse(raw) };
    }
  } catch {
    // fallback
  }
  return DEFAULT_DB_CONFIG;
}

export function saveDatabaseConfig(config: DatabaseConnectionConfig) {
  try {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save DB config', e);
  }
}

