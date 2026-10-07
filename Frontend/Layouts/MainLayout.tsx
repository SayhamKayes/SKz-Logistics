import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { VideoBackground } from '../components/VideoBackground';
import { TrackingModal } from '../components/TrackingModal';
import { QuoteCalculatorModal } from '../components/QuoteCalculatorModal';
import { BackendArchitectureDrawer } from '../components/BackendArchitectureDrawer';
import { AdminConsignmentManager } from '../components/AdminConsignmentManager';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-x-hidden">
      {/* Scroll-Driven Video Background */}
      <VideoBackground />

      {/* Main Navigation */}
      <Navbar />

      {/* Page Content Body */}
      <main className="flex-1 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Interactive Overlays */}
      <TrackingModal />
      <QuoteCalculatorModal />
      <BackendArchitectureDrawer />
      <AdminConsignmentManager />
    </div>
  );
};
