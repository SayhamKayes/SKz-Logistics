import React from 'react';
import { ContactSection } from '../components/ContactSection';
import { GoogleMapSection } from '../components/GoogleMapSection';

export const ContactPage: React.FC = () => {
  return (
    <div className="bg-white">
      <ContactSection />
      <GoogleMapSection />
    </div>
  );
};
