import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      title="Back to Top"
      aria-label="Back to Top"
      className="fixed bottom-6 right-6 z-40 p-3.5 bg-[#153243] hover:bg-[#1a365d] active:scale-95 text-white rounded-full shadow-2xl border-2 border-amber-500/60 hover:border-amber-400 transition-all duration-300 flex items-center justify-center group cursor-pointer animate-in fade-in zoom-in-75"
    >
      <ArrowUp className="w-5 h-5 text-amber-400 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
};
