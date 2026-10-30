import React, { useState, useEffect } from 'react';
import { SainLogo } from '../../assets/Logo';
import {
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  Mail,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { getApiBaseUrl } from '../../services/databaseConfig';
import { fetchSiteConfigFromDb, saveSiteConfigToDb, CONFIG_KEYS } from '../../services/siteConfigService';

interface AdminLoginProps {
  onLoginSuccess: (adminData: { username: string; name: string }) => void;
  onBackToSite: () => void;
}

type AuthMode = 'login' | 'forgot' | 'reset';

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToSite }) => {
  // Mode state: 'login' | 'forgot' | 'reset'
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  // Login inputs - STRICTLY blank by default as requested
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password inputs
  const [forgotEmail, setForgotEmail] = useState('');

  // Reset password inputs
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status & feedback
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dispatchedEmail, setDispatchedEmail] = useState<string>('');
  const [isDispatched, setIsDispatched] = useState(false);

  // Registered admin email display
  const getAdminEmail = () => {
    try {
      const stored = localStorage.getItem('sain_admin_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.email) return parsed.email;
      }
    } catch {}
    return 'saininternationallogistics@gmail.com';
  };

  // Detect reset password token from URL query params (e.g. from email link)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const action = params.get('action');
      const token = params.get('token');
      if (token && (action === 'reset-password' || params.has('token'))) {
        setResetToken(token);
        setAuthMode('reset');
        setError(null);
        setSuccess('Reset token verified. Please enter your new administrator password.');
      }
    }
  }, []);

  // Retrieve stored SMTP config if available
  const getSmtpConfig = () => {
    try {
      const stored = localStorage.getItem('sain_contact_content_config');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          smtpHost: parsed.smtpHost || 'smtp.gmail.com',
          smtpPort: parsed.smtpPort || 587,
          smtpSecurity: parsed.smtpSecurity || 'tls',
          smtpUser: parsed.smtpUser || '',
          smtpPassword: parsed.smtpPassword || '',
          receiverEmail: parsed.receiverEmail || parsed.officialEmail || '',
          senderName: parsed.senderName || 'SAIN International Logistics Management',
        };
      }
    } catch {
      // ignore
    }
    return {};
  };

  // 1. Handle Admin Login Form Submission (100% Server-Side Authenticated via Django)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    const inputUser = username.trim();
    const inputPass = password.trim();

    if (!inputUser || !inputPass) {
      setIsLoading(false);
      setError('Please provide both username and password.');
      return;
    }

    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          username: inputUser,
          password: inputPass,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        if (data.token) {
          localStorage.setItem('sain_admin_token', data.token);
        }
        const profile = {
          username: data.user?.username || inputUser,
          name: data.user?.name || 'Administrator',
          email: data.user?.email || '',
        };
        localStorage.setItem('sain_admin_profile', JSON.stringify(profile));
        // Wipe legacy plain-text password if any
        localStorage.removeItem('sain_admin_password');

        setIsLoading(false);
        onLoginSuccess({ username: profile.username, name: profile.name });
        return;
      } else {
        setIsLoading(false);
        setError(data.error || 'Invalid administrator username or password. Access denied.');
        return;
      }
    } catch (err: any) {
      setIsLoading(false);
      setError('Network or server connection failed. Please check if the backend service is running.');
    }
  };

  // 2. Handle Forgot Password Submission (Automatically sends reset link to admin email)
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    const targetEmail = getAdminEmail();
    const resetBaseUrl = `${window.location.origin}/sain-sakib?action=reset-password`;
    const smtpConfig = getSmtpConfig();

    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/forgot-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          resetUrl: resetBaseUrl,
          smtpConfig,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        const confirmedEmail = data.email || targetEmail;
        setDispatchedEmail(confirmedEmail);
        setIsDispatched(true);
        setSuccess(
          `Password reset link has been dispatched to ${confirmedEmail}. Please check your inbox and click the reset button inside the email.`
        );
      } else {
        const errMsg = data.error || data.warning || 'Failed to dispatch reset email. Please ensure your SMTP configuration is active.';
        setError(errMsg);
      }
    } catch {
      setError('Unable to reach the server. Please check your internet or server connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Handle Reset Password Submission
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters in length.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation password do not match.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Call backend reset endpoint first to verify token and update password in Django MySQL
      if (resetToken && !resetToken.startsWith('local_')) {
        const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/reset-password/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            token: resetToken,
            new_password: newPassword,
          }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) {
          setIsLoading(false);
          setError(data.error || 'Reset link has expired or is invalid. Please request a new link.');
          return;
        }
      }

      // 2. Update local storage profile metadata (strictly without plain-text password)
      const stored = localStorage.getItem('sain_admin_profile');
      let profile: Record<string, any> = {
        name: 'Sakib Ahmed',
        username: 'sain_sakib',
        email: forgotEmail || getAdminEmail(),
        phone: '+880171906999',
        lastUpdated: new Date().toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
      };

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          delete parsed.password;
          profile = {
            ...profile,
            ...parsed,
            lastUpdated: new Date().toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }),
          };
        } catch {
          // ignore
        }
      }

      localStorage.setItem('sain_admin_profile', JSON.stringify(profile));
      localStorage.removeItem('sain_admin_password');
      saveSiteConfigToDb(CONFIG_KEYS.ADMIN_PROFILE, profile);

      // 3. Clear URL search query cleanly
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', '/sain-sakib');
      }

      setIsLoading(false);
      setSuccess('Your password has been reset successfully! Please log in with your new credentials.');
      setAuthMode('login');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setResetToken(null);
    } catch {
      setIsLoading(false);
      setError('Failed to update password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background visual ambience */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0c1a24] via-slate-900 to-[#153243] opacity-90" />
      <div className="absolute w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none -top-40 -left-40" />
      <div className="absolute w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -bottom-40 -right-40" />

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 animate-in fade-in zoom-in-95 duration-300">

        {/* ========================================================
            VIEW 1: STANDARD LOGIN MODE
           ======================================================== */}
        {authMode === 'login' && (
          <>
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
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                      placeholder="Enter Your Username"
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
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 pl-10 pr-10 text-sm text-slate-900 focus:bg-white focus:border-[#1a6c7a] focus:ring-2 focus:ring-teal-500/10 outline-none transition font-medium"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
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

                {/* Forgot Password Link - Positioned right below Sign In button as indicated */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setSuccess(null);
                      setAuthMode('forgot');
                    }}
                    className="text-xs text-slate-500 hover:text-[#1a6c7a] font-semibold transition cursor-pointer hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
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
            </div>
          </>
        )}

        {/* ========================================================
            VIEW 2: FORGOT PASSWORD (EMAIL PROMPT & SMTP DISPATCH)
           ======================================================== */}
        {authMode === 'forgot' && (
          <>
            {/* Header */}
            <div className="bg-[#153243] p-8 text-white text-center relative border-b border-slate-700">
              <div className="inline-block bg-white p-3 rounded-2xl shadow-md mb-4 scale-95">
                <SainLogo variant="full" />
              </div>

              <h2 className="text-xl font-bold font-brand tracking-tight text-white">
                Account Recovery
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Password reset link will be dispatched to your registered administrator email
              </p>
            </div>

            {/* Body */}
            <div className="p-8 space-y-6">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium space-y-2.5 animate-in fade-in">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-emerald-950 text-xs">Email Dispatched Successfully</p>
                      <p className="text-emerald-800 text-xs mt-0.5 leading-relaxed">
                        A password reset link has been dispatched to:
                      </p>
                      <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 border border-emerald-300/80 rounded-lg font-mono text-xs font-bold text-emerald-900">
                        <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{dispatchedEmail || getAdminEmail()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-emerald-200/80 text-[11px] text-emerald-700 leading-relaxed">
                    📩 Please check your email inbox and click the <strong>Proceed to Reset Password</strong> link inside the email to establish your new credentials (strictly valid for <strong>1 minute</strong> for maximum security).
                  </div>
                </div>
              )}

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-xl mt-0.5 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Registered Admin Account
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Clicking below will dispatch the secure one-time password recovery link directly to:
                    </p>
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300 text-slate-800 rounded-lg text-xs font-mono font-bold shadow-xs">
                        <Mail className="w-3.5 h-3.5 text-[#1a6c7a] shrink-0" />
                        <span>{getAdminEmail()}</span>
                      </span>
                    </div>
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
                      <span>Dispatching Reset Email...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 text-amber-400" />
                      <span>{isDispatched ? 'Resend Reset Link to Admin Email' : 'Send Reset Link to Admin Email'}</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccess(null);
                  setAuthMode('login');
                }}
                className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1.5 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </div>
          </>
        )}

        {/* ========================================================
            VIEW 3: RESET PASSWORD (NEW CREDENTIALS SUBMISSION)
           ======================================================== */}
        {authMode === 'reset' && (
          <>
            {/* Header */}
            <div className="bg-[#153243] p-8 text-white text-center relative border-b border-slate-700">
              <div className="inline-block bg-white p-3 rounded-2xl shadow-md mb-4 scale-95">
                <SainLogo variant="full" />
              </div>

              <h2 className="text-xl font-bold font-brand tracking-tight text-white flex items-center justify-center gap-2">
                <span>Set New Password</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-amber-400 text-slate-950 rounded">
                  Security
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Enter and confirm your new administrator password
              </p>
            </div>

            {/* Body */}
            <div className="p-8 space-y-6">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      New Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="text-xs text-slate-500 hover:text-slate-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showNewPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 pl-10 text-sm text-slate-900 focus:bg-white focus:border-[#1a6c7a] focus:ring-2 focus:ring-teal-500/10 outline-none transition font-medium"
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
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
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Update Password & Save</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccess(null);
                  setAuthMode('login');
                }}
                className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1.5 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
