import React from 'react';
import { TrackingProvider, useTracking } from './Context/TrackingContext';
import { MainLayout } from './Layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { TrackPage } from './pages/TrackPage';
import { AdminPage } from './pages/AdminPage';

const AppContent: React.FC = () => {
  const { activeTab } = useTracking();

  // Standalone Admin Portal (Full screen, login-gated, independent from public layout)
  if (activeTab === 'admin') {
    return <AdminPage />;
  }

  return (
    <MainLayout>
      {activeTab === 'home' && <HomePage />}
      {activeTab === 'about' && <AboutPage />}
      {activeTab === 'services' && <ServicesPage />}
      {activeTab === 'contact' && <ContactPage />}
      {activeTab === 'track' && <TrackPage />}
    </MainLayout>
  );
};

export default function App() {
  return (
    <TrackingProvider>
      <AppContent />
    </TrackingProvider>
  );
}
