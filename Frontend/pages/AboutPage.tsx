import React from 'react';
import { AboutSection } from '../components/AboutSection';
import { TrackingSection } from '../components/TrackingSection';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-6">
      <AboutSection />
      <div className="py-10">
        <TrackingSection />
      </div>
    </div>
  );
};
