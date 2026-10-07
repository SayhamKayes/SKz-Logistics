import React from 'react';
import { ContactSection } from '../components/ContactSection';
import { TrackingSection } from '../components/TrackingSection';

export const ContactPage: React.FC = () => {
  return (
    <div className="pt-6">
      <ContactSection />
      <div className="py-10">
        <TrackingSection />
      </div>
    </div>
  );
};
