import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon-only' | 'monochrome' | 'white';
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
      <polygon points="38,8 54,24 38,40 22,24" fill={color} />
      <path
        d="M52,24 L68,40 L52,56 L64,68 L52,80 L36,64 L52,48 L36,32 Z"
        fill={color}
      />
      <polygon points="20,72 32,60 20,48 8,60" fill={color} />
      <polygon points="68,40 84,24 96,36 80,52" fill={color} />
    </svg>
  );
};

export const SainLogo: React.FC<LogoProps> = ({
  className = '',
  variant = 'full',
}) => {
  if (variant === 'icon-only') {
    return <SainRunnerIcon className={className || 'w-10 h-10 text-amber-500'} />;
  }

  const isWhite = variant === 'white';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={isWhite ? '/assets/images/SAIN_logo_white.png' : '/assets/images/SAIN_logo.png'}
        alt="SAIN International Logistics"
        className="h-9 sm:h-11 w-auto object-contain max-w-[220px] sm:max-w-[260px]"
      />
    </div>
  );
};

