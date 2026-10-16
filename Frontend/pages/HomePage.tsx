import React from 'react';
import { HeroTrackingExperience } from '../components/HeroTrackingExperience';
import { ShipmentTimerSection } from '../components/ShipmentTimerSection';
import { ServicesSection } from '../components/ServicesSection';
import { AboutSection } from '../components/AboutSection';
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

      {/* 3. About SAIN, Mission, Vision, and Ready To Ship CTA */}
      <AboutSection />

      {/* 4. Contact & Inquiries */}
      <ContactSection />
    </div>
  );
};

