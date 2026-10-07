import React, { useState } from 'react';
import { useTracking } from '../Context/TrackingContext';
import {
  X,
  Database,
  Server,
  Code2,
  Check,
  Copy,
  Layers,
  Terminal,
  Cpu,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import {
  getDatabaseConfig,
  saveDatabaseConfig,
  DatabaseProvider,
} from '../services/databaseConfig';

export const BackendArchitectureDrawer: React.FC = () => {
  const { isDevDbModalOpen, setDevDbModalOpen } = useTracking();
  const [config, setConfig] = useState(getDatabaseConfig());
  const [activeTab, setActiveTab] = useState<'architecture' | 'database' | 'django-models' | 'api-docs'>('architecture');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isDevDbModalOpen) return null;

  const handleProviderChange = (provider: DatabaseProvider) => {
    const updated = { ...config, provider };
    setConfig(updated);
    saveDatabaseConfig(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/15 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-brand flex items-center gap-2">
                <span>SAIN Backend Architecture &amp; Database Hub</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded">
                  Django + PostgreSQL / Neon / Supabase
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Apps: <code className="text-amber-400">sain</code>, Env: <code className="text-amber-400">sain_env</code>, DB: Postgres with Neon &amp; Supabase Switcher
              </p>
            </div>
          </div>
          <button
            onClick={() => setDevDbModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="px-6 pt-3 bg-slate-950/60 border-b border-slate-800 flex gap-4 text-xs font-semibold">
          {[
            { id: 'architecture', label: 'Folder & Architecture', icon: Layers },
            { id: 'database', label: 'Database Switcher (Neon/Supabase)', icon: Database },
            { id: 'django-models', label: 'Django Models & Schemas', icon: Code2 },
            { id: 'api-docs', label: 'REST API Endpoints', icon: Terminal },
          ].map((t) => {
            const IconComp = t.icon;
            const isSel = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`pb-3 transition flex items-center gap-1.5 border-b-2 ${
                  isSel
                    ? 'border-cyan-400 text-cyan-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[68vh] overflow-y-auto space-y-5 text-xs">
          {/* TAB 1: Folder Architecture */}
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                <h3 className="font-bold text-sm text-cyan-400 mb-2 flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  <span>Full-Stack Directory Topology (Matched Exactly to VS Code Project)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[11px] text-slate-300">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <strong className="text-amber-400 block mb-1">Backend/ (Python Django &amp; PostgreSQL)</strong>
                    <ul className="space-y-1 text-slate-300 pl-2">
                      <li>📁 Backend/</li>
                      <li>├── 📁 sain/ <span className="text-slate-500">(Core Django Settings &amp; WSGI)</span></li>
                      <li>│   ├── settings.py <span className="text-cyan-400">(DB Switcher Neon/Supabase)</span></li>
                      <li>│   ├── urls.py &amp; wsgi.py</li>
                      <li>├── 📁 sain_env/ <span className="text-slate-500">(Virtualenv)</span></li>
                      <li>├── 📁 couriers/ <span className="text-emerald-400">(Tracking &amp; Waybill engine)</span></li>
                      <li>├── 📁 order/ <span className="text-slate-400">(Bookings &amp; Invoices)</span></li>
                      <li>├── 📁 products/ &amp; 📁 users/</li>
                      <li>├── 📁 api/ <span className="text-cyan-400">(DRF Serializers &amp; Routing)</span></li>
                      <li>├── manage.py</li>
                      <li>└── requirements.txt</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <strong className="text-cyan-400 block mb-1">Frontend/ (React + Tailwind CSS)</strong>
                    <ul className="space-y-1 text-slate-300 pl-2">
                      <li>📁 Frontend/ (or root src/)</li>
                      <li>├── 📁 src/</li>
                      <li>│   ├── 📁 assets/ <span className="text-slate-400">(Logos &amp; Images)</span></li>
                      <li>│   ├── 📁 components/ <span className="text-amber-400">(Tracking, Video, etc.)</span></li>
                      <li>│   ├── 📁 Context/ <span className="text-cyan-400">(TrackingContext)</span></li>
                      <li>│   ├── 📁 hooks/ <span className="text-slate-400">(useScrollVideo)</span></li>
                      <li>│   ├── 📁 Layouts/ &amp; 📁 pages/</li>
                      <li>│   ├── 📁 services/ <span className="text-emerald-400">(trackingData, DB config)</span></li>
                      <li>│   ├── App.tsx &amp; index.css</li>
                      <li>└── vite.config.ts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Database Switcher */}
          {activeTab === 'database' && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-200 block mb-2">
                  Active Database Engine in Django <code className="text-amber-400">settings.py</code>:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'django-drf',
                      name: 'Django REST API',
                      desc: 'Full Python backend with couriers app tracking endpoint',
                    },
                    {
                      id: 'neon',
                      name: 'Neon Tech (Serverless Postgres)',
                      desc: 'Branchable cloud Postgres with autoscaling',
                    },
                    {
                      id: 'supabase',
                      name: 'Supabase PostgreSQL',
                      desc: 'PostgreSQL instance with connection pooling',
                    },
                  ].map((db) => {
                    const active = config.provider === db.id;
                    return (
                      <button
                        key={db.id}
                        type="button"
                        onClick={() => handleProviderChange(db.id as any)}
                        className={`p-3.5 rounded-xl border text-left transition ${
                          active
                            ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200 shadow-md ring-1 ring-cyan-400'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-xs mb-1">
                          <span>{db.name}</span>
                          {active && <Check className="w-4 h-4 text-cyan-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400">{db.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Connection Strings */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans font-semibold">Neon Connection String:</span>
                  <button
                    onClick={() => copyToClipboard(config.neon.connectionString, 'neon')}
                    className="text-cyan-400 hover:text-cyan-300 font-sans flex items-center gap-1"
                  >
                    {copiedText === 'neon' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg text-amber-300 break-all select-all">
                  {config.neon.connectionString}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-400 font-sans font-semibold">Supabase Connection String:</span>
                  <button
                    onClick={() => copyToClipboard(config.supabase.databaseUrl, 'supabase')}
                    className="text-cyan-400 hover:text-cyan-300 font-sans flex items-center gap-1"
                  >
                    {copiedText === 'supabase' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg text-emerald-300 break-all select-all">
                  {config.supabase.databaseUrl}
                </div>
              </div>

              {savedSuccess && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 font-medium">
                  Configuration saved! Database provider updated.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Django Models */}
          {activeTab === 'django-models' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-200">
                Django Couriers Model: <code className="text-amber-400">backend/couriers/models.py</code>
              </h4>
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
{`from django.db import models

class Consignment(models.Model):
    STATUS_CHOICES = [
        ('RECEIVED', 'Received at Warehouse'),
        ('IN_TRANSIT', 'In Transit'),
        ('CUSTOMS', 'Customs Clearance (Act 2023)'),
        ('OUT_FOR_DELIVERY', 'Out for Delivery'),
        ('DELIVERED', 'Delivered to Doorstep'),
    ]

    consignment_no = models.CharField(max_length=64, unique=True, db_index=True)
    reference_no = models.CharField(max_length=64, blank=True)
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default='RECEIVED')
    service_type = models.CharField(max_length=64, default='Air Freight Priority')
    origin_city = models.CharField(max_length=128, default='Guangzhou, China')
    destination_city = models.CharField(max_length=128, default='Dhaka, Bangladesh')
    weight_kg = models.DecimalField(max_digits=10, decimal_places=2)
    volume_cbm = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True)
    cargo_description = models.TextField()
    is_customs_cleared = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Milestone(models.Model):
    consignment = models.ForeignKey(Consignment, related_name='milestones', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, default='completed')
    timestamp = models.DateTimeField(auto_now_add=True)`}
              </pre>
            </div>
          )}

          {/* TAB 4: API Docs */}
          {activeTab === 'api-docs' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-200">
                Tracking Endpoint: <code className="text-amber-400">GET /api/v1/couriers/track/&lt;consignment_no&gt;/</code>
              </h4>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300">
                <span className="text-emerald-400 font-bold">GET</span> http://localhost:8000/api/v1/couriers/track/12345/
              </div>
              <h4 className="font-bold text-slate-200 mt-4">
                Booking Order Creation: <code className="text-amber-400">POST /api/v1/order/create/</code>
              </h4>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300">
                <span className="text-amber-400 font-bold">POST</span> http://localhost:8000/api/v1/order/create/
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
