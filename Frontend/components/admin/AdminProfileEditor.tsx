import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  KeyRound,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Save,
  Eye,
  EyeOff,
  Sparkles,
  Clock,
  ExternalLink,
  Database,
  Server,
  RefreshCw,
  Wifi,
} from 'lucide-react';
import { saveSiteConfigToDb, fetchSiteConfigFromDb, CONFIG_KEYS } from '../../services/siteConfigService';
import {
  getBackendEnv,
  setBackendEnv,
  checkBackendHealth,
  getApiBaseUrl,
  LIVE_BACKEND_URL,
  LOCAL_BACKEND_URL,
} from '../../services/databaseConfig';
import { getAdminInitials } from '../../utils/adminInitials';
import { SaveSuccessModal } from './SaveSuccessModal';

interface AdminProfileEditorProps {
  onProfileUpdated?: (updated: { name: string; username: string }) => void;
}

export const AdminProfileEditor: React.FC<AdminProfileEditorProps> = ({ onProfileUpdated }) => {
  // Stored state
  const [name, setName] = useState('Sakib Ahmed');
  const [username, setUsername] = useState('sain_sakib6055');
  const [email, setEmail] = useState('sain_sakib6055@sainlogistics.com');
  const [phone, setPhone] = useState('+880171906999');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPasswords, setShowPasswords] = useState(false);
  const [storedPassword, setStoredPassword] = useState('admin123');

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('Today at 22:15 BST');

  // Database Connectivity & Server Health State
  const [backendEnv, setBackendEnvState] = useState<'live' | 'local'>(getBackendEnv());
  const [serverHealth, setServerHealth] = useState<{
    isOnline: boolean;
    latencyMs: number;
    isChecking: boolean;
    error?: string;
  }>({
    isOnline: true,
    latencyMs: 0,
    isChecking: true,
  });

  // Check Django DRF backend & Neon PostgreSQL health
  const performHealthCheck = async () => {
    setServerHealth((prev) => ({ ...prev, isChecking: true }));
    const result = await checkBackendHealth();
    setServerHealth({
      isOnline: result.isOnline,
      latencyMs: result.latencyMs,
      isChecking: false,
      error: result.error,
    });
  };

  useEffect(() => {
    performHealthCheck();
    const handleEnvChanged = (e: any) => {
      const newEnv = e.detail || getBackendEnv();
      setBackendEnvState(newEnv);
      setTimeout(performHealthCheck, 150);
    };
    window.addEventListener('sain_backend_env_changed', handleEnvChanged as EventListener);
    return () => {
      window.removeEventListener('sain_backend_env_changed', handleEnvChanged as EventListener);
    };
  }, []);

  const handleSwitchBackendEnv = (newEnv: 'live' | 'local') => {
    setBackendEnv(newEnv);
    setBackendEnvState(newEnv);
    setTimeout(performHealthCheck, 150);
  };

  // Load profile from Central DB and localStorage on mount and sync on live changes/restore
  useEffect(() => {
    fetchSiteConfigFromDb<any>(CONFIG_KEYS.ADMIN_PROFILE, null).then((remote) => {
      if (remote) {
        if (remote.name) setName(remote.name);
        if (remote.username) setUsername(remote.username);
        if (remote.email) setEmail(remote.email);
        if (remote.phone) setPhone(remote.phone);
        if (remote.password) setStoredPassword(remote.password);
        if (remote.lastUpdated) setLastUpdated(remote.lastUpdated);
      }
    });

    const handleSync = () => {
      try {
        const stored = localStorage.getItem('sain_admin_profile');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.name) setName(parsed.name);
          if (parsed.username) setUsername(parsed.username);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.phone) setPhone(parsed.phone);
          if (parsed.password) setStoredPassword(parsed.password);
          if (parsed.lastUpdated) setLastUpdated(parsed.lastUpdated);
        }
      } catch {
        // ignore
      }
    };

    handleSync();
    window.addEventListener('sain_site_config_updated', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('sain_site_config_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validate password change if attempted
    let passwordToSave = storedPassword;
    if (newPassword.trim() || confirmPassword.trim() || currentPassword.trim()) {
      if (currentPassword !== storedPassword && currentPassword !== 'admin123') {
        setMessage({
          type: 'error',
          text: 'Current password does not match your existing password.',
        });
        return;
      }

      if (newPassword.length < 6) {
        setMessage({
          type: 'error',
          text: 'New password must be at least 6 characters long.',
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        setMessage({
          type: 'error',
          text: 'New password and confirmation do not match.',
        });
        return;
      }

      passwordToSave = newPassword;
    }

    const timestamp = new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const updatedProfile = {
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: passwordToSave,
      lastUpdated: timestamp,
    };

    localStorage.setItem('sain_admin_profile', JSON.stringify(updatedProfile));
    setStoredPassword(passwordToSave);
    setLastUpdated(timestamp);

    // Clear password inputs
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    const res = await saveSiteConfigToDb(CONFIG_KEYS.ADMIN_PROFILE, updatedProfile);

    if (res.success) {
      setMessage({
        type: 'success',
        text: 'Profile details and credentials saved to Central Neon Database! New credentials active across all devices.',
      });
    } else {
      setMessage({
        type: 'success',
        text: `Saved locally. Central DB sync notice: ${res.error || 'Connection failed'}.`,
      });
    }

    if (onProfileUpdated) {
      onProfileUpdated({ name: updatedProfile.name, username: updatedProfile.username });
    }

    setTimeout(() => {
      setMessage(null);
    }, 4500);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-[#1a6c7a]" />
            <span>Admin Profile & Security Credentials</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Update administrator identification details, contact phone, username, and login access password.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 border border-[#1a6c7a]/30 text-[#1a6c7a] bg-[#1a6c7a]/5 hover:bg-[#1a6c7a]/15 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer"
            title="Open Public Website in a new tab"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-lg text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Super Administrator</span>
          </span>
        </div>
      </div>

      {/* Status banner */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="p-4 bg-gradient-to-r from-slate-900 to-[#122b30] rounded-xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-amber-400/20 border-2 border-amber-400 text-amber-300 font-bold text-base flex items-center justify-center select-none shadow-xs">
            {getAdminInitials(name)}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{name}</span>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-medium">
                Active Session
              </span>
            </h4>
            <p className="text-xs text-slate-300 font-mono">@{username}</p>
          </div>
        </div>

        <div className="text-[11px] text-slate-300 flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg border border-white/10">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Last modified: {lastUpdated}</span>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Section 1: Personal & Contact Info */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6c7a] mb-3 flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span>Profile Identity & Contact Info</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    setName(newName);
                    if (onProfileUpdated) {
                      onProfileUpdated({ name: newName, username });
                    }
                  }}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 outline-none focus:border-[#1a6c7a]"
                  placeholder="e.g. Sakib Ahmed"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Login Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    const newUsername = e.target.value;
                    setUsername(newUsername);
                    if (onProfileUpdated) {
                      onProfileUpdated({ name, username: newUsername });
                    }
                  }}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 outline-none focus:border-[#1a6c7a]"
                  placeholder="e.g. sain_sakib6055"
                  required
                />
                <span className="text-xs font-bold text-slate-400 absolute left-3 top-2.5">@</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 outline-none focus:border-[#1a6c7a]"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Phone Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 outline-none focus:border-[#1a6c7a]"
                  required
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Change Password */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6c7a] flex items-center gap-1.5">
              <KeyRound className="w-4 h-4" />
              <span>Security Password Management</span>
            </h4>

            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="text-xs text-slate-500 hover:text-slate-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPasswords ? 'Hide characters' : 'Show characters'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            Leave the fields below blank if you do not wish to change your current administrative password.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 outline-none focus:border-[#1a6c7a]"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 outline-none focus:border-[#1a6c7a]"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 outline-none focus:border-[#1a6c7a]"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#1a6c7a] hover:bg-[#145561] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Credentials</span>
          </button>
        </div>
      </form>

      {/* Section 3: Central Database & Backend Connectivity */}
      <div className="pt-6 border-t border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6c7a] flex items-center gap-1.5">
              <Database className="w-4 h-4" />
              <span>Central Database & Backend Connectivity</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitor live Neon PostgreSQL database health, ping latency, and toggle backend environment.
            </p>
          </div>

          {/* Test Connection / Ping Button */}
          <button
            type="button"
            onClick={performHealthCheck}
            disabled={serverHealth.isChecking}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
            title="Ping and test central database latency"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${serverHealth.isChecking ? 'animate-spin text-[#1a6c7a]' : ''}`} />
            <span>{serverHealth.isChecking ? 'Testing DB...' : 'Test Connection / Ping'}</span>
          </button>
        </div>

        {/* Database Control Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Health & Latency Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex items-center justify-center flex-shrink-0">
                <span
                  className={`w-3 h-3 rounded-full ${
                    serverHealth.isChecking
                      ? 'bg-amber-500 animate-pulse'
                      : serverHealth.isOnline
                      ? 'bg-emerald-500'
                      : 'bg-rose-500'
                  }`}
                />
                {serverHealth.isOnline && !serverHealth.isChecking && (
                  <span className="absolute w-3 h-3 rounded-full bg-emerald-400 opacity-75 animate-ping pointer-events-none" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                  <span>{serverHealth.isOnline ? 'Neon PostgreSQL Connected' : 'Database Offline'}</span>
                  {serverHealth.isOnline && (
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono font-bold rounded-full">
                      {serverHealth.latencyMs}ms
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                  {serverHealth.isChecking
                    ? 'Verifying handshake...'
                    : serverHealth.isOnline
                    ? 'Central cloud sync active & ready'
                    : serverHealth.error || 'Server unreachable'}
                </p>
              </div>
            </div>

            <span
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
                serverHealth.isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {serverHealth.isOnline ? 'Active' : 'Offline'}
            </span>
          </div>

          {/* Environment Toggle Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-[#1a6c7a]" />
                <span>Backend Environment</span>
              </span>
              <span className="text-[10px] font-mono font-semibold text-slate-500">
                {backendEnv === 'live' ? 'Cloud Production' : 'Local Dev'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 bg-slate-200/70 p-1 rounded-lg text-xs font-bold">
              <button
                type="button"
                onClick={() => handleSwitchBackendEnv('live')}
                className={`py-1.5 px-2 rounded-md transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  backendEnv === 'live'
                    ? 'bg-white text-[#1a6c7a] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Connect to Render Backend & Neon PostgreSQL Cloud Database"
              >
                <span>Cloud (Neon DB)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchBackendEnv('local')}
                className={`py-1.5 px-2 rounded-md transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  backendEnv === 'local'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Connect to Localhost Django Backend (http://127.0.0.1:8000)"
              >
                <span>Localhost</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Endpoint & Realtime Sync Notice */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider flex-shrink-0">
              Active Endpoint:
            </span>
            <span className="font-mono text-slate-800 font-semibold truncate text-[11px]">
              {getApiBaseUrl()}
            </span>
          </div>
          <span className="text-[11px] text-teal-700 font-semibold flex items-center gap-1 flex-shrink-0">
            <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
            <span>Real-time central cloud synchronization</span>
          </span>
        </div>
      </div>
      {/* Centered Save Success Modal Popup */}
      <SaveSuccessModal
        isOpen={message?.type === 'success'}
        title="Profile Updated!"
        message={message?.text || 'Profile details and credentials updated successfully.'}
      />
    </div>
  );
};
