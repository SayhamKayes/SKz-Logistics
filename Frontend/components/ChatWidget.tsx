import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { WhatsAppWidget } from './WhatsAppWidget';
import { MessengerWidget } from './MessengerWidget';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-22 right-6 z-40 flex flex-col items-end gap-3 select-none"
    >
      {/* Expandable Chat Options Stack (WhatsApp & Messenger) */}
      {isOpen && (
        <div className="flex flex-col items-end gap-3 pb-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* 1. Messenger Option */}
          <div className="transition-all duration-200 transform hover:scale-105 active:scale-95">
            <MessengerWidget
              isFloating={false}
              onActionClick={() => setIsOpen(false)}
            />
          </div>

          {/* 2. WhatsApp Option */}
          <div className="transition-all duration-200 transform hover:scale-105 active:scale-95">
            <WhatsAppWidget
              isFloating={false}
              onActionClick={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Floating Action Toggle Button */}
      <div
        className="flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Tooltip Pill on Left */}
        <div
          className={`hidden sm:flex items-center mr-3 px-3.5 py-1.5 bg-slate-900/90 text-white text-xs font-semibold rounded-xl shadow-xl border border-slate-700/80 backdrop-blur-md transition-all duration-300 pointer-events-none select-none whitespace-nowrap ${
            isHovered
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-3 pointer-events-none'
          }`}
        >
          <span>{isOpen ? 'Close chat' : 'Need Help? Chat with us'}</span>
        </div>

        {/* Toggle Button (Chat Icon <-> Cross Icon) */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          title={isOpen ? 'Close chat options' : 'Open live chat options'}
          aria-label={isOpen ? 'Close chat options' : 'Open live chat options'}
          aria-expanded={isOpen}
          className={`relative group p-3.5 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95 ${
            isOpen
              ? 'bg-slate-800 hover:bg-slate-900 text-white border-2 border-slate-600 rotate-90'
              : 'bg-[#153243] hover:bg-[#1a365d] text-white border-2 border-amber-400/40 hover:border-amber-400 rotate-0'
          }`}
        >
          {/* Animated ping ring when closed to invite interaction */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-amber-400 opacity-25 animate-ping pointer-events-none" />
          )}

          {/* Active online status badge */}
          {!isOpen && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
          )}

          {/* Icon Switcher */}
          {isOpen ? (
            <X className="w-6 h-6 text-white transition-transform group-hover:scale-110" />
          ) : (
            <MessageCircle className="w-6 h-6 text-amber-400 transition-transform group-hover:scale-110 fill-amber-400/20" />
          )}
        </button>
      </div>
    </div>
  );
};
