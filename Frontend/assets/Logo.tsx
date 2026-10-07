import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon-only' | 'monochrome' | 'white';
  showSubtitle?: boolean;
}

export const SainRunnerIcon: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-10 h-10',
  color = 'currentColor',
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Head: tilted square */}
      <polygon
        points="38,8 54,24 38,40 22,24"
        fill={color}
      />
      {/* Running torso and arms & legs: geometric angular path */}
      <path
        d="M52,24 L68,40 L52,56 L64,68 L52,80 L36,64 L52,48 L36,32 Z"
        fill={color}
      />
      {/* Trailing leg kick */}
      <polygon
        points="20,72 32,60 20,48 8,60"
        fill={color}
      />
      {/* Front foot forward sweep */}
      <polygon
        points="68,40 84,24 96,36 80,52"
        fill={color}
      />
    </svg>
  );
};

export const SainLogo: React.FC<LogoProps> = ({
  className = '',
  variant = 'full',
  showSubtitle = true,
}) => {
  if (variant === 'icon-only') {
    return <SainRunnerIcon className={className || 'w-10 h-10 text-amber-500'} />;
  }

  const isWhite = variant === 'white';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Runner Glyph */}
      <div className="relative flex-shrink-0">
        <svg
          viewBox="0 0 100 100"
          className="w-10 h-10 sm:w-12 sm:h-12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Head */}
          <polygon
            points="38,8 54,24 38,40 22,24"
            fill={isWhite ? '#FFFFFF' : '#F59E0B'}
          />
          {/* Body structure */}
          <polygon
            points="54,24 74,44 58,60 72,74 58,88 38,68 54,52 34,32"
            fill={isWhite ? '#FFFFFF' : '#38BDF8'}
          />
          {/* Back kick */}
          <polygon
            points="18,70 30,58 18,46 6,58"
            fill={isWhite ? '#FFFFFF' : '#F59E0B'}
          />
          {/* Forward leap */}
          <polygon
            points="74,44 92,26 100,34 82,52"
            fill={isWhite ? '#FFFFFF' : '#E2E8F0'}
          />
        </svg>
      </div>

      {/* Vertical Divider */}
      <div className={`h-9 sm:h-11 w-[2.5px] ${isWhite ? 'bg-white/40' : 'bg-amber-500/80'} rounded-full`} />

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-black text-2xl sm:text-3xl tracking-tighter leading-none font-brand ${
              isWhite ? 'text-white' : 'text-slate-100'
            }`}
          >
            SAIN
          </span>
          {showSubtitle && (
            <span className="text-[10px] font-semibold tracking-wider text-amber-400 font-bengali opacity-90 hidden sm:inline-block">
              / সেঈন
            </span>
          )}
        </div>
        <div
          className={`text-[9px] sm:text-[10.5px] font-extrabold tracking-[0.22em] uppercase leading-none mt-1 ${
            isWhite ? 'text-amber-300' : 'text-amber-500'
          }`}
        >
          INTERNATIONAL LOGISTICS
        </div>
      </div>
    </div>
  );
};
