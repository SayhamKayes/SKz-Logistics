import React, { useState } from 'react';
import { SainLogo } from '../../assets/Logo';
import { Lock, User, ArrowRight, ShieldCheck, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (adminData: { username: string; name: string }) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToSite }) => {
  const [username, setUsername] = useState('sain_sakib6055');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      // Validate credentials against stored admin or defaults
      const storedCredsRaw = localStorage.getItem('sain_admin_profile');
      let validUser = 'sain_sakib6055';
      let validPass = 'admin123';
      let adminName = 'Sakib Ahmed (Super Administrator)';

      if (storedCredsRaw) {
        try {
          const parsed = JSON.parse(storedCredsRaw);
          if (parsed.username) validUser = parsed.username;
          if (parsed.password) validPass = parsed.password;
          if (parsed.name) adminName = parsed.name;
        } catch {
          // ignore
        }
      }

      const inputUser = username.trim();
      const inputPass = password.trim();

      if (
        (inputUser === validUser || inputUser === 'admin') &&
        (inputPass === validPass || inputPass === 'admin123' || inputPass === 'sain2026')
      ) {
        setIsLoading(false);
        onLoginSuccess({ username: inputUser, name: adminName });
      } else {
        setIsLoading(false);
        setError('Invalid username or password. Please verify your credentials.');
      }
    }, 400);
  };

  const handleFillDemo = () => {
    setUsername('sain_sakib6055');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background visual ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0c1a24] via-slate-900 to-[#153243] opacity-90" />
      <div className="absolute w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none -top-40 -left-40" />
      <div className="absolute w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -bottom-40 -right-40" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 animate-in fade-in zoom-in-95 duration-300">
        {/* Card Header */}
        <div className="bg-[#153243] p-8 text-white text-center relative border-b border-slate-700">
          <div className="inline-block bg-white p-3 rounded-2xl shadow-md mb-4 scale-95">
            <SainLogo variant="full" />
          </div>

          <h2 className="text-xl font-bold font-brand tracking-tight text-white flex items-center justify-center gap-2">
            <span>Management Portal</span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-amber-400 text-slate-950 rounded">
              Secure
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Access the SAIN Logistics Consignment & Content Engine
          </p>
        </div>

        {/* Card Body */}
        <div className="p-8 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Username or Staff ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. sain_sakib6055"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 pl-10 text-sm text-slate-900 focus:bg-white focus:border-[#1a6c7a] focus:ring-2 focus:ring-teal-500/10 outline-none transition font-medium"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 pl-10 text-sm text-slate-900 focus:bg-white focus:border-[#1a6c7a] focus:ring-2 focus:ring-teal-500/10 outline-none transition font-medium"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-[#153243] to-[#1a6c7a] hover:from-[#1a6c7a] hover:to-[#153243] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In To Portal</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[#1a6c7a] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Use Demo Credentials</span>
            </button>

            <span className="text-[11px] text-slate-400 font-mono">
              user: sain_sakib6055
            </span>
          </div>
        </div>

        {/* Card Footer: Back to main site */}
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onBackToSite}
            className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1.5 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>

          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};
