import React, { useState } from 'react';
import { useWhatsAppConfig } from '../hooks/useWhatsApp';

interface WhatsAppWidgetProps {
  isFloating?: boolean;
  onActionClick?: () => void;
  className?: string;
}

export const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
  isFloating = true,
  onActionClick,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { phoneNumber, defaultMessage } = useWhatsAppConfig();

  const encodedMessage = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <div
      className={`flex items-center ${isFloating ? 'fixed bottom-22 right-6 z-40' : ''} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip Pill */}
      <div
        className={`hidden sm:flex items-center mr-3 px-3.5 py-1.5 bg-slate-900/90 text-white text-xs font-semibold rounded-xl shadow-xl border border-slate-700/80 backdrop-blur-md transition-all duration-300 pointer-events-none select-none ${isHovered
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-3 pointer-events-none'
          }`}
      >
        <span>Chat on WhatsApp</span>
      </div>

      {/* Official WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onActionClick}
        title="Chat with SAIN International Logistics on WhatsApp"
        aria-label="Chat on WhatsApp"
        className="relative group p-3.5 bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center cursor-pointer"
      >
        {/* Soft Animated Ripple Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none" />

        {/* Official WhatsApp SVG Icon */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 relative z-10 transition-transform group-hover:scale-110"
        >
          <path d="M12.031 2c-5.508 0-9.986 4.477-9.986 9.984 0 1.76.459 3.477 1.332 4.992l-1.417 5.176 5.305-1.391c1.465.798 3.117 1.22 4.766 1.22 5.509 0 9.988-4.478 9.988-9.985 0-5.507-4.479-9.984-9.988-9.984zm5.82 14.283c-.244.686-1.227 1.258-1.703 1.337-.478.078-1.077.112-3.486-.889-2.887-1.199-4.733-4.148-4.877-4.34-.143-.191-1.168-1.554-1.168-2.964 0-1.41.741-2.105 1.004-2.392.263-.287.574-.359.765-.359.191 0 .383 0 .55.008.176.009.412-.066.645.494.24.575.815 1.99.886 2.135.072.144.12.312.024.479-.096.167-.144.263-.287.43-.144.167-.302.373-.432.502-.144.144-.294.3-.127.587.168.287.747 1.233 1.603 1.996 1.102.981 2.031 1.286 2.318 1.43.287.143.455.12.623-.072.167-.191.717-.837.909-1.124.191-.287.383-.239.645-.143.263.096 1.674.789 1.961.933.287.143.479.215.55.335.072.119.072.693-.172 1.379z" />
        </svg>
      </a>
    </div>
  );
};
