import React from 'react';
import { ServicesSection } from '../components/ServicesSection';
import { TrackingSection } from '../components/TrackingSection';

export const ServicesPage: React.FC = () => {
  return (
    <div className="pt-6">
      <ServicesSection />
      <div className="py-10">
        <TrackingSection />
      </div>
    </div>
  );
};
