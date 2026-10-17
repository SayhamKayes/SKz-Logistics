import React, { useState } from 'react';

export const DEFAULT_MESSENGER_URL = 'https://m.me/saininternationallogistics';

export const getStoredMessengerUrl = (): string => {
  try {
    const direct = localStorage.getItem('sain_messenger_url');
    if (direct && direct.trim()) return direct.trim();

    const heroRaw = localStorage.getItem('sain_hero_content_config');
    if (heroRaw) {
      const heroConfig = JSON.parse(heroRaw);
      if (heroConfig.messengerUrl && heroConfig.messengerUrl.trim()) {
        return heroConfig.messengerUrl.trim();
      }
    }
  } catch {}
  return DEFAULT_MESSENGER_URL;
};

interface MessengerWidgetProps {
  pageUrl?: string;
  isFloating?: boolean;
  onActionClick?: () => void;
  className?: string;
}

export const MessengerWidget: React.FC<MessengerWidgetProps> = ({
  pageUrl,
  isFloating = false,
  onActionClick,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>(() => pageUrl || getStoredMessengerUrl());

  React.useEffect(() => {
    if (pageUrl) {
      setCurrentUrl(pageUrl);
      return;
    }
    const handleUpdate = () => {
      setCurrentUrl(getStoredMessengerUrl());
    };
    window.addEventListener('sain_messenger_updated', handleUpdate);
    window.addEventListener('sain_hero_content_updated', handleUpdate);
    window.addEventListener('sain_site_config_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('sain_messenger_updated', handleUpdate);
      window.removeEventListener('sain_hero_content_updated', handleUpdate);
      window.removeEventListener('sain_site_config_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [pageUrl]);

  const targetUrl = pageUrl || currentUrl;

  const content = (
    <div
      className={`flex items-center ${isFloating ? 'fixed bottom-36 right-6 z-40' : ''} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip Pill */}
      <div
        className={`hidden sm:flex items-center mr-3 px-3.5 py-1.5 bg-slate-900/90 text-white text-xs font-semibold rounded-xl shadow-xl border border-slate-700/80 backdrop-blur-md transition-all duration-300 pointer-events-none select-none whitespace-nowrap ${
          isHovered
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-3 pointer-events-none'
        }`}
      >
        <span>Chat on Messenger</span>
      </div>

      {/* Official Facebook Messenger Gradient Button */}
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onActionClick}
        title="Chat with SAIN International Logistics on Messenger"
        aria-label="Chat on Messenger"
        className="relative group p-3.5 bg-gradient-to-tr from-[#0078FF] via-[#00B2FF] to-[#A033FF] hover:opacity-95 active:scale-95 text-white rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center cursor-pointer border border-white/20"
      >
        {/* Soft Animated Ripple Ring */}
        <span className="absolute inset-0 rounded-full bg-[#0084FF] opacity-35 animate-ping pointer-events-none" />

        {/* Official Messenger SVG Icon */}
        <svg
          viewBox="0 0 28 28"
          fill="currentColor"
          className="w-6 h-6 relative z-10 transition-transform group-hover:scale-110 drop-shadow-sm"
        >
          <path d="M14 2C7.373 2 2 7.14 2 13.48c0 3.61 1.776 6.837 4.56 8.91V26l3.447-1.892c1.233.342 2.544.529 3.993.529 6.627 0 12-5.14 12-11.48S20.627 2 14 2zm1.385 15.422l-3.219-3.433-6.28 3.433 6.908-7.333 3.296 3.433 6.203-3.433-6.877 7.333h-.031z" />
        </svg>
      </a>
    </div>
  );

  return content;
};
