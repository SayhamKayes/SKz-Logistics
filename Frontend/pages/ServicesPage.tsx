import React from 'react';
import { ServicesSection } from '../components/ServicesSection';

export const ServicesPage: React.FC = () => {
  return (
    <div className="bg-white pt-6">
      <ServicesSection fullGrid={true} />
    </div>
  );
};
