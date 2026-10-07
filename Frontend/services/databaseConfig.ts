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
    baseUrl: 'http://127.0.0.1:8000',
    trackingEndpoint: '/api/v1/couriers/track/',
    ordersEndpoint: '/api/v1/order/',
  },
};

export const DB_STORAGE_KEY = 'sain_db_provider_config';

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
