import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { TrackingSection } from '../components/TrackingSection';
import { ServicesSection } from '../components/ServicesSection';
import { AboutSection } from '../components/AboutSection';
import { ContactSection } from '../components/ContactSection';
import { useTracking } from '../Context/TrackingContext';
import {
  ShieldCheck,
  Plane,
  Ship,
  Briefcase,
  CheckCircle,
  Clock,
  ArrowRight,
  Package,
  Award,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { openQuoteModal, openTrackingModal } = useTracking();

  return (
    <div className="relative">
      {/* 1. Hero Section with Video Background integration */}
      <HeroSection />

      {/* 2. Real-Time Consignment Tracking Tool (Primary focus) */}
      <TrackingSection />

      {/* 3. Comprehensive Logistics Services */}
      <ServicesSection />

      {/* 4. About SAIN, Mission, Vision, and Ready To Ship CTA */}
      <AboutSection />

      {/* 5. Contact & Inquiries */}
      <ContactSection />
    </div>
  );
};
