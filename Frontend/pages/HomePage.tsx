import React from 'react';
import { HeroTrackingExperience } from '../components/HeroTrackingExperience';
import { ShipmentTimerSection } from '../components/ShipmentTimerSection';
import { ServicesSection } from '../components/ServicesSection';
import { AboutSection } from '../components/AboutSection';
import { ReadyToShipSection } from '../components/ReadyToShipSection';
import { ContactSection } from '../components/ContactSection';

export const HomePage: React.FC = () => {
  return (
    <div className="relative">
      {/* 1. Cinematic Scroll Journey: Hero & Tracking with Slide Takeover */}
      <HeroTrackingExperience />

      {/* 2. Inbound Shipment Schedules & Live Arrival Timers */}
      <ShipmentTimerSection />

      {/* 3. Comprehensive Logistics Services */}
      <ServicesSection />

      {/* 4. About SAIN, Mission, Vision */}
      <AboutSection />

      {/* 5. Full-Width Ready To Ship Parallax CTA Banner */}
      <ReadyToShipSection />

      {/* 6. Contact & Inquiries */}
      <ContactSection />
    </div>
  );
};

