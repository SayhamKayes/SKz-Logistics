import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

interface SaveSuccessModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  type?: 'success' | 'warning' | 'error';
}

export const SaveSuccessModal: React.FC<SaveSuccessModalProps> = ({
  isOpen,
  title = 'Changes Saved Successfully!',
  message = 'Your updates are now live on the website.',
  type = 'success',
}) => {
  if (!isOpen) return null;

  const isWarning = type === 'warning';
  const isError = type === 'error';
  const isSuccess = !isWarning && !isError;

  return (
    <div className="fixed inset-0 z-[999999] pointer-events-none flex items-center justify-center p-4">
      {/* Centered Modal Card in the Middle of the Window */}
      <div
        className={`relative bg-slate-900/95 text-white px-7 py-6 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border-2 backdrop-blur-xl flex items-center gap-4.5 transform animate-in zoom-in-90 fade-in duration-200 pointer-events-auto max-w-md w-full ${
          isSuccess
            ? 'border-emerald-500/50'
            : isWarning
            ? 'border-amber-500/60'
            : 'border-rose-500/60'
        }`}
      >
        {/* Glowing pulse ring */}
        <div
          className={`w-13 h-13 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg relative ${
            isSuccess
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : isWarning
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
          }`}
        >
          <span
            className={`absolute inset-0 rounded-2xl opacity-20 animate-ping pointer-events-none ${
              isSuccess ? 'bg-emerald-400' : isWarning ? 'bg-amber-400' : 'bg-rose-400'
            }`}
          />
          {isSuccess && <CheckCircle2 className="w-7 h-7 text-emerald-400 relative z-10" />}
          {isWarning && <AlertTriangle className="w-7 h-7 text-amber-400 relative z-10" />}
          {isError && <AlertCircle className="w-7 h-7 text-rose-400 relative z-10" />}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
            <span>{title}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                isSuccess
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : isWarning
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}
            >
              {isSuccess ? 'Live DB' : isWarning ? 'Local Only' : 'Failed'}
            </span>
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
};

