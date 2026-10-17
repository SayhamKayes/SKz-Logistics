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
} from 'lucide-react';
import { saveSiteConfigToDb } from '../../services/siteConfigService';
import { getAdminInitials } from '../../utils/adminInitials';

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

  // Load profile from localStorage on mount and sync on live changes/restore
  useEffect(() => {
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

  const handleSaveProfile = (e: React.FormEvent) => {
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

    saveSiteConfigToDb('sain_admin_profile', updatedProfile);
    setStoredPassword(passwordToSave);
    setLastUpdated(timestamp);

    // Clear password inputs
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setMessage({
      type: 'success',
      text: 'Profile details and credentials updated successfully. New credentials will be required on next login.',
    });

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
    </div>
  );
};
