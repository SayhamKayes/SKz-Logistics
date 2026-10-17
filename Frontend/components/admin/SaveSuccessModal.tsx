import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SaveSuccessModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
}

export const SaveSuccessModal: React.FC<SaveSuccessModalProps> = ({
  isOpen,
  title = 'Changes Saved Successfully!',
  message = 'Your updates are now live on the website.',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] pointer-events-none flex items-center justify-center p-4">
      {/* Centered Modal Card in the Middle of the Window */}
      <div className="relative bg-slate-900/95 text-white px-7 py-6 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border-2 border-emerald-500/50 backdrop-blur-xl flex items-center gap-4.5 transform animate-in zoom-in-90 fade-in duration-200 pointer-events-auto max-w-md w-full">
        {/* Glowing pulse ring */}
        <div className="w-13 h-13 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center flex-shrink-0 shadow-lg relative">
          <span className="absolute inset-0 rounded-2xl bg-emerald-400 opacity-20 animate-ping pointer-events-none" />
          <CheckCircle2 className="w-7 h-7 text-emerald-400 relative z-10" />
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
            <span>{title}</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
              Live
            </span>
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
