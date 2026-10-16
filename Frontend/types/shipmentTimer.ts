export type ShipmentMode = 'air' | 'sea';
export type ShipmentStatus = 'scheduled' | 'in_transit' | 'customs' | 'arrived';

export interface ShipmentTimerItem {
  id: string;
  mode: ShipmentMode;
  title: string;
  badge: string;
  flightOrVessel: string;
  originCity: string;
  originCountry: string;
  originHub: string;
  destinationCity: string;
  destinationCountry: string;
  destinationHub: string;
  departureDate: string; // ISO format: YYYY-MM-DDTHH:mm
  targetArrivalDate: string; // ISO format: YYYY-MM-DDTHH:mm
  status: ShipmentStatus;
  statusLabel: string;
  cutoffNotice: string;
  transitDaysEstimate: string;
  isActive: boolean;
}

export interface ShipmentTimerHeaderConfig {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
}

export const DEFAULT_SHIPMENT_TIMER_HEADER: ShipmentTimerHeaderConfig = {
  badge: 'Live Inbound Schedules & ETA Countdowns',
  title: 'Next Scheduled Shipments Arriving in Bangladesh',
  titleHighlight: 'Arriving in Bangladesh',
  description:
    'Real-time departure and arrival countdowns for our dedicated air and sea cargo consignments. Track inbound consolidation schedules from Guangzhou and Hong Kong directly to Dhaka and Chattogram.',
};

export const DEFAULT_SHIPMENT_TIMERS: ShipmentTimerItem[] = [
  {
    id: 'timer-air-guangzhou',
    mode: 'air',
    title: 'Guangzhou Air Express Priority',
    badge: 'Air Freight • CAN Hub',
    flightOrVessel: 'Flight CZ-387 Cargo Freighter',
    originCity: 'Guangzhou (CAN)',
    originCountry: 'China',
    originHub: 'SAIN Guangzhou Hub (Baiyun Terminal)',
    destinationCity: 'Dhaka (DAC)',
    destinationCountry: 'Bangladesh',
    destinationHub: 'Hazrat Shahjalal Int’l Airport (HSIA)',
    departureDate: '2026-10-17T10:00',
    targetArrivalDate: '2026-10-28T18:00',
    status: 'in_transit',
    statusLabel: 'In Transit • On Schedule',
    cutoffNotice: 'Booking Cut-off: Every Tuesday & Friday 4:00 PM',
    transitDaysEstimate: 'Fast Air Direct Transit',
    isActive: true,
  },
  {
    id: 'timer-air-hongkong',
    mode: 'air',
    title: 'Hong Kong Air Direct Cargo',
    badge: 'Air Freight • HKG Hub',
    flightOrVessel: 'Flight CX-042 Freighter Express',
    originCity: 'Hong Kong (HKG)',
    originCountry: 'Hong Kong SAR',
    originHub: 'SuperTerminal 1, Hong Kong Int’l Hub',
    destinationCity: 'Dhaka (DAC)',
    destinationCountry: 'Bangladesh',
    destinationHub: 'Hazrat Shahjalal Int’l Airport (HSIA)',
    departureDate: '2026-10-18T14:30',
    targetArrivalDate: '2026-10-29T21:00',
    status: 'scheduled',
    statusLabel: 'Scheduled Departure',
    cutoffNotice: 'Booking Cut-off: Every Wednesday 6:00 PM',
    transitDaysEstimate: 'Priority Cargo Air Connection',
    isActive: true,
  },
  {
    id: 'timer-sea-ocean',
    mode: 'sea',
    title: 'Global Ocean Sea Freight Liner',
    badge: 'Sea Freight • Bulk & FCL/LCL',
    flightOrVessel: 'Vessel MV SAIN PROSPERITY V.108',
    originCity: 'Guangzhou / Ningbo Port',
    originCountry: 'China',
    originHub: 'Nansha & Yantian Ocean Container Terminal',
    destinationCity: 'Chattogram Port (CGP)',
    destinationCountry: 'Bangladesh',
    destinationHub: 'Chattogram Container Terminal (CCT)',
    departureDate: '2026-10-15T08:00',
    targetArrivalDate: '2026-11-04T16:00',
    status: 'in_transit',
    statusLabel: 'Ocean Sailing • In Transit',
    cutoffNotice: 'Container Loading Cut-off: Weekly Sunday',
    transitDaysEstimate: 'Cost-Effective Ocean Line',
    isActive: true,
  },
];

export const TIMERS_STORAGE_KEY = 'sain_shipment_timers_config';
export const TIMERS_HEADER_STORAGE_KEY = 'sain_shipment_timers_header_config';
export const TIMERS_UPDATED_EVENT = 'sain_shipment_timers_updated';
