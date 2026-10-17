import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { TrackingModal } from '../components/TrackingModal';
import { QuoteCalculatorModal } from '../components/QuoteCalculatorModal';
import { BackendArchitectureDrawer } from '../components/BackendArchitectureDrawer';
import { ChatWidget } from '../components/ChatWidget';
import { BackToTop } from '../components/BackToTop';

import { useTracking } from '../Context/TrackingContext';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeTab } = useTracking();

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col relative">
      {/* Main Navigation */}
      <Navbar />

      {/* Page Content Body */}
      <main className={`flex-1 relative z-10 ${activeTab !== 'home' ? 'pt-16 sm:pt-20' : ''}`}>
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Global Widgets & Overlays */}
      <TrackingModal />
      <QuoteCalculatorModal />
      <BackendArchitectureDrawer />
      <ChatWidget />
      <BackToTop />
    </div>
  );
};
