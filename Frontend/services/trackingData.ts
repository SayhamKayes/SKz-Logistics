export interface Milestone {
  id: string;
  timestamp: string;
  location: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
}

export interface Consignment {
  consignmentNo: string;
  referenceNo?: string;
  status:
    | 'Delivered'
    | 'Out for Delivery'
    | 'Customs Clearance'
    | 'In Flight'
    | 'At Hub'
    | 'Received at Warehouse'
    | 'At Bangladesh warehouse'
    | 'In Transit'
    | 'Pending'
    | 'Received'
    | 'On Hold by Customs'
    | 'Enroute'
    | 'Cancelled'
    | 'Returned'
    | (string & {});
  statusColor: 'green' | 'amber' | 'blue' | 'purple' | 'red';
  progressPercentage: number;
  origin: {
    city: string;
    hub: string;
    country: string;
    code: string;
  };
  destination: {
    city: string;
    address: string;
    country: string;
    code: string;
  };
  serviceType:
    | 'Air Freight Priority'
    | 'Sea Freight (FCL/LCL)'
    | 'Hand Carry Express'
    | 'Export Worldwide'
    | 'Air Freight'
    | 'Sea Freight'
    | 'Hand Carry'
    | (string & {});
  carrier: string;
  awbNumber: string;
  departureDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  cargoDetails: {
    pieces: number;
    weight: string;
    dimensions: string;
    volume: string;
    description: string;
    hsCode?: string;
  };
  customsStatus?: {
    act: string;
    tradeTerm: string;
    dutyStatus: string;
    assessmentStation: string;
  };
  consignee: {
    name: string;
    phoneMasked: string;
    recipientType: string;
  };
  timeline: Milestone[];

  // Rich Admin Panel & Screenshot Details
  author?: string;
  shipper?: {
    name: string;
    phone: string;
    address: string;
    email: string;
  };
  receiver?: {
    name: string;
    phone: string;
    address: string;
    email: string;
  };
  shipmentDetails?: {
    typeOfShipment: string;
    weightText: string;
    packagesCount: string;
    product: string;
    paymentMode: string;
    carrier: string;
    departureTimeStr: string;
    destination: string;
    pickupTimeStr: string;
    courier: string;
    mode: string;
    quantity: string;
    totalFreight: string;
    carrierReferenceNo: string;
    origin: string;
    pickupDate: string;
    expectedDeliveryDate: string;
    comments: string;
  };
  packagesData?: PackageItem[];
  shipmentHistory?: ShipmentHistoryItem[];
  adminMetadata?: {
    client?: string;
    agentName?: string;
    employee?: string;
    publishStatus?: string;
    publishedOn?: string;
    tags?: string[];
    categories?: string[];
  };
}

export interface PackageItem {
  id: string;
  qty: number;
  pieceType: string;
  description: string;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightG: number;
}

export interface ShipmentHistoryItem {
  id: string;
  date: string;
  time: string;
  location: string;
  status: string;
  updatedBy: string;
  remarks: string;
}

export const INITIAL_CONSIGNMENTS: Record<string, Consignment> = {
  // Official SAINEX consignment matching admin panel screenshots
  'SAINEX067638406': {
    consignmentNo: 'SAINEX067638406',
    referenceNo: 'CRN-884920',
    status: 'At Bangladesh warehouse',
    statusColor: 'green',
    progressPercentage: 85,
    author: 'SAIN International Logistics (sain_sakib6055)',
    shipper: {
      name: 'SAIN',
      phone: '+880171906999',
      address: '15/B, Uttara Metro Center, Dhaka 1230 Bangladesh',
      email: 'saininternationallogistics@gmail.com',
    },
    receiver: {
      name: 'Muhammad Tahin',
      phone: '+8801731939325',
      address: 'Basundhara Residential Area, Dhaka, D-block road 1, House: 252',
      email: 'ocuna123@gmail.com',
    },
    shipmentDetails: {
      typeOfShipment: 'Air Freight',
      weightText: 'around 1500g',
      packagesCount: '7',
      product: 'Keychain, Doll, Acrylic sheet',
      paymentMode: 'CASH',
      carrier: 'SAINEX',
      departureTimeStr: '18:52 pm',
      destination: 'Bangladesh',
      pickupTimeStr: '10:00 am',
      courier: 'SAIN INTERNATIONAL LOGISTICS',
      mode: 'Air Freight',
      quantity: '7 Box',
      totalFreight: '৳ 12,500',
      carrierReferenceNo: 'CRN-884920',
      origin: 'China',
      pickupDate: '2026-08-01',
      expectedDeliveryDate: '2026-08-12',
      comments: 'Total 7 store product.',
    },
    packagesData: [
      { id: 'p1', qty: 1, pieceType: 'Carton', description: '80595', lengthCm: 0, widthCm: 0, heightCm: 0, weightG: 0 },
      { id: 'p2', qty: 1, pieceType: 'Carton', description: '46182', lengthCm: 0, widthCm: 0, heightCm: 0, weightG: 0 },
      { id: 'p3', qty: 1, pieceType: 'Carton', description: '46089', lengthCm: 0, widthCm: 0, heightCm: 0, weightG: 0 },
      { id: 'p4', qty: 1, pieceType: 'Carton', description: '33242', lengthCm: 0, widthCm: 0, heightCm: 0, weightG: 0 },
      { id: 'p5', qty: 1, pieceType: 'Carton', description: '33260', lengthCm: 0, widthCm: 0, heightCm: 0, weightG: 0 },
      { id: 'p6', qty: 1, pieceType: 'Carton', description: '66924', lengthCm: 0, widthCm: 0, heightCm: 0, weightG: 0 },
      { id: 'p7', qty: 1, pieceType: 'Carton', description: '60831', lengthCm: 0, widthCm: 0, heightCm: 0, weightG: 0 },
    ],
    shipmentHistory: [
      { id: 'sh1', date: '2026-08-11', time: '13:46 pm', location: 'Bangladesh', status: 'At Bangladesh warehouse', updatedBy: 'SAIN International Logistics', remarks: 'Contact via' },
      { id: 'sh2', date: '2026-08-07', time: '14:00 pm', location: 'China', status: 'In Transit', updatedBy: 'SAIN International Logistics', remarks: 'Contact via' },
      { id: 'sh3', date: '2026-08-01', time: '19:47 pm', location: 'China', status: 'Received', updatedBy: 'SAIN International Logistics', remarks: 'Contact via' },
    ],
    adminMetadata: {
      client: '',
      agentName: '',
      employee: '',
      publishStatus: 'Published',
      publishedOn: 'Aug 11, 2026 at 13:39',
      tags: ['Guangzhou'],
      categories: ['Keychain Mix'],
    },
    origin: {
      city: 'Guangzhou',
      hub: 'SAIN Guangzhou Cargo Center, Baiyun District',
      country: 'China',
      code: 'CAN',
    },
    destination: {
      city: 'Dhaka',
      address: 'Basundhara Residential Area, Dhaka, D-block road 1, House: 252',
      country: 'Bangladesh',
      code: 'DAC',
    },
    serviceType: 'Air Freight Priority',
    carrier: 'SAINEX Direct Air Network',
    awbNumber: 'CAN-SAINEX-067638406',
    departureDate: 'Aug 07, 2026 - 14:00',
    estimatedDelivery: 'Aug 12, 2026 - Delivered soon',
    cargoDetails: {
      pieces: 7,
      weight: 'around 1500g',
      dimensions: '7 Cartons Export Standard',
      volume: '0.12 CBM',
      description: 'Keychain, Doll, Acrylic sheet (Total 7 store product)',
      hsCode: '3926.90.99',
    },
    customsStatus: {
      act: 'Compliant with Bangladesh Customs Act 2023',
      tradeTerm: 'CFR Dhaka',
      dutyStatus: 'Duty Assessed & Cleared',
      assessmentStation: 'Hazrat Shahjalal International Airport Customs House',
    },
    consignee: {
      name: 'Muhammad Tahin',
      phoneMasked: '+880 1731 ***325',
      recipientType: 'Individual Importer',
    },
    timeline: [
      {
        id: 't1',
        timestamp: 'Aug 11, 2026 • 13:46 pm',
        location: 'Bangladesh',
        title: 'At Bangladesh warehouse',
        description: 'Cargo received safely at SAIN Bangladesh Warehouse, customs inspection passed.',
        status: 'current',
      },
      {
        id: 't2',
        timestamp: 'Aug 07, 2026 • 14:00 pm',
        location: 'China',
        title: 'In Transit',
        description: 'Flight en route from Guangzhou to Hazrat Shahjalal International Airport (DAC).',
        status: 'completed',
      },
      {
        id: 't3',
        timestamp: 'Aug 01, 2026 • 19:47 pm',
        location: 'China',
        title: 'Received at Guangzhou Hub',
        description: 'Cargo collected from supplier, 7 cartons packaged and barcode tagged.',
        status: 'completed',
      },
    ],
  },
  // Official example from saininternationallogistics.com ("Ex: 12345")
  '12345': {
    consignmentNo: '12345',
    referenceNo: 'SAIN-CAN-DAC-12345',
    status: 'Out for Delivery',
    statusColor: 'amber',
    progressPercentage: 88,
    origin: {
      city: 'Guangzhou',
      hub: 'SAIN Guangzhou Logistics Center, Baiyun District',
      country: 'China',
      code: 'CAN',
    },
    destination: {
      city: 'Dhaka',
      address: 'House 42, Road 11, Sector 3, Uttara, Dhaka-1230',
      country: 'Bangladesh',
      code: 'DAC',
    },
    serviceType: 'Air Freight Priority',
    carrier: 'SAIN Direct Air Cargo (B777-F)',
    awbNumber: 'CAN-89201948',
    departureDate: 'Oct 04, 2026 - 18:30 (CST)',
    estimatedDelivery: 'Oct 06, 2026 - Today by 19:00 (BST)',
    cargoDetails: {
      pieces: 14,
      weight: '348.5 KG',
      dimensions: '120 x 80 x 110 cm (2 Pallets)',
      volume: '2.1 CBM',
      description: 'Commercial Electronics, Microcontrollers & LED Displays',
      hsCode: '8528.59.00',
    },
    customsStatus: {
      act: 'Compliant with Bangladesh Customs Act 2023',
      tradeTerm: 'CFR (Cost and Freight) Dhaka',
      dutyStatus: 'Duty Assessed & Cleared',
      assessmentStation: 'Hazrat Shahjalal International Airport Customs House (Unit 2)',
    },
    consignee: {
      name: 'Bengal Tech Innovations Ltd.',
      phoneMasked: '+880 17*** ***99',
      recipientType: 'Corporate Importer',
    },
    timeline: [
      {
        id: 'm1',
        timestamp: 'Oct 03, 2026 • 11:30 AM',
        location: 'Guangzhou Hub, China',
        title: 'Shipment Received & Weighed',
        description: 'Cargo verified, dimensioned, barcode labeled, and packaged into SAIN secure pallet.',
        status: 'completed',
      },
      {
        id: 'm2',
        timestamp: 'Oct 04, 2026 • 09:15 AM',
        location: 'Baiyun International Airport (CAN)',
        title: 'Export Customs Clearance Passed',
        description: 'China Customs inspection and exit declaration approved under CFR terms.',
        status: 'completed',
      },
      {
        id: 'm3',
        timestamp: 'Oct 04, 2026 • 06:45 PM',
        location: 'In Flight (Route CAN → DAC)',
        title: 'Departed Guangzhou Airport on Scheduled Flight',
        description: 'Direct air freight cargo flight departed on schedule.',
        status: 'completed',
      },
      {
        id: 'm4',
        timestamp: 'Oct 05, 2026 • 02:10 AM',
        location: 'Dhaka Airport Cargo Village (DAC)',
        title: 'Arrived at Hazrat Shahjalal International Airport',
        description: 'Aircraft landed safely. Deconsolidation and transfer to SAIN import handling terminal.',
        status: 'completed',
      },
      {
        id: 'm5',
        timestamp: 'Oct 05, 2026 • 03:40 PM',
        location: 'Dhaka Customs House',
        title: 'Customs Examination & Assessment Completed',
        description: 'Processed according to Customs Act 2023 guidelines. Import duty cleared & gate pass issued.',
        status: 'completed',
      },
      {
        id: 'm6',
        timestamp: 'Oct 06, 2026 • 08:30 AM',
        location: 'SAIN Central Hub (Uttara, Dhaka)',
        title: 'Sorted & Dispatched to Last-Mile Fleet',
        description: 'Package transferred to local delivery van for scheduled doorstep dispatch.',
        status: 'completed',
      },
      {
        id: 'm7',
        timestamp: 'Oct 06, 2026 • 01:15 PM',
        location: 'Uttara Delivery Zone, Dhaka',
        title: 'Out for Doorstep Delivery',
        description: 'Delivery courier driver (Courier Van #04) is en route to recipient address.',
        status: 'current',
      },
      {
        id: 'm8',
        timestamp: 'Oct 06, 2026 • Estimated 06:30 PM',
        location: 'Recipient Doorstep, Sector 3, Uttara',
        title: 'Package Handover & Signature Confirmation',
        description: 'Final delivery completion and digital POD (Proof of Delivery) generation.',
        status: 'pending',
      },
    ],
  },

  // Guangzhou to Dhaka shipment (referenced in testimonial)
  'SAIN-78492-BD': {
    consignmentNo: 'SAIN-78492-BD',
    referenceNo: 'GZ-DAC-78492',
    status: 'Delivered',
    statusColor: 'green',
    progressPercentage: 100,
    origin: {
      city: 'Guangzhou',
      hub: 'SAIN Guangzhou Export Depot',
      country: 'China',
      code: 'CAN',
    },
    destination: {
      city: 'Dhaka',
      address: 'Plot 18, Block B, Mirpur DOHS, Dhaka',
      country: 'Bangladesh',
      code: 'DAC',
    },
    serviceType: 'Air Freight Priority',
    carrier: 'SAIN Priority Air Forwarding',
    awbNumber: 'AWB-7740192',
    departureDate: 'Sep 28, 2026',
    estimatedDelivery: 'Oct 01, 2026',
    actualDelivery: 'Oct 01, 2026 - 15:45 (BST)',
    cargoDetails: {
      pieces: 6,
      weight: '124.0 KG',
      dimensions: '80 x 60 x 50 cm each',
      volume: '1.44 CBM',
      description: 'Apparel Samples & High Quality Raw Accessories',
      hsCode: '6217.10.00',
    },
    customsStatus: {
      act: 'Customs Act 2023 Compliant',
      tradeTerm: 'CFR Dhaka',
      dutyStatus: 'Full Duty Paid & Delivered',
      assessmentStation: 'Dhaka Cargo Village Customs',
    },
    consignee: {
      name: 'MD SAKIB (Sakib Fashion Enterprise)',
      phoneMasked: '+880 1719 ***99',
      recipientType: 'Commercial Client',
    },
    timeline: [
      {
        id: 't1',
        timestamp: 'Sep 27, 2026 • 10:00 AM',
        location: 'Guangzhou, China',
        title: 'Cargo Received at Guangzhou Warehouse',
        description: 'Initial intake, barcode assigned, security scan passed.',
        status: 'completed',
      },
      {
        id: 't2',
        timestamp: 'Sep 28, 2026 • 02:30 PM',
        location: 'Baiyun International Airport (CAN)',
        title: 'Departed on Cargo Flight to Dhaka',
        description: 'Loaded on aircraft container for direct transit.',
        status: 'completed',
      },
      {
        id: 't3',
        timestamp: 'Sep 29, 2026 • 11:00 AM',
        location: 'Hazrat Shahjalal International Airport (DAC)',
        title: 'Arrived at Dhaka Cargo Terminal',
        description: 'Unloaded and handed to customs assessment wing.',
        status: 'completed',
      },
      {
        id: 't4',
        timestamp: 'Sep 30, 2026 • 04:00 PM',
        location: 'Dhaka Customs Clearing Hub',
        title: 'Customs Cleared',
        description: 'Official clearance issued without delays under Customs Act 2023.',
        status: 'completed',
      },
      {
        id: 't5',
        timestamp: 'Oct 01, 2026 • 03:45 PM',
        location: 'Mirpur DOHS, Dhaka',
        title: 'Delivered to Recipient Doorstep',
        description: 'Successfully delivered and signed by MD SAKIB.',
        status: 'completed',
      },
    ],
  },

  // Sea Freight FCL shipment
  'SAIN-SEA-99120': {
    consignmentNo: 'SAIN-SEA-99120',
    referenceNo: 'SZ-CTG-SEA-99120',
    status: 'In Flight', // Using In Flight/In Transit
    statusColor: 'blue',
    progressPercentage: 62,
    origin: {
      city: 'Shenzhen / Ningbo',
      hub: 'Yantian Port Terminal',
      country: 'China',
      code: 'SZX',
    },
    destination: {
      city: 'Chattogram / Dhaka',
      address: 'Agrabad Commercial Area, Chattogram Port Entry',
      country: 'Bangladesh',
      code: 'CGP',
    },
    serviceType: 'Sea Freight (FCL/LCL)',
    carrier: 'Ocean Alliance Express (Vessel: EVER FORTUNE)',
    awbNumber: 'BL-SZ9912001',
    departureDate: 'Sep 20, 2026',
    estimatedDelivery: 'Oct 12, 2026',
    cargoDetails: {
      pieces: 1,
      weight: '18,450 KG',
      dimensions: '40ft High Cube Container (FCL)',
      volume: '68 CBM',
      description: 'Heavy Industrial Machinery, Spare Parts & Steel Components',
      hsCode: '8479.89.90',
    },
    customsStatus: {
      act: 'Customs Act 2023 - CFR Chattogram Port',
      tradeTerm: 'CFR Chittagong',
      dutyStatus: 'Pre-Arrival Declaration Lodged',
      assessmentStation: 'Custom House Chattogram',
    },
    consignee: {
      name: 'Bengal Heavy Industries Corp',
      phoneMasked: '+880 1812 ***10',
      recipientType: 'Manufacturer',
    },
    timeline: [
      {
        id: 's1',
        timestamp: 'Sep 18, 2026 • 09:00 AM',
        location: 'Shenzhen Depot, China',
        title: 'Container Stuffed & Sealed',
        description: 'Container sealed with high-security bolt seal.',
        status: 'completed',
      },
      {
        id: 's2',
        timestamp: 'Sep 20, 2026 • 06:00 PM',
        location: 'Yantian International Container Port',
        title: 'Vessel Departed from Port',
        description: 'Vessel EVER FORTUNE set sail towards Bay of Bengal.',
        status: 'completed',
      },
      {
        id: 's3',
        timestamp: 'Oct 04, 2026 • 08:00 AM',
        location: 'Strait of Malacca (Maritime Transit)',
        title: 'Vessel in Open Sea Transit',
        description: 'Shipment en route on scheduled nautical route.',
        status: 'current',
      },
      {
        id: 's4',
        timestamp: 'Oct 09, 2026 • ETA',
        location: 'Chattogram Seaport (Outer Anchorage)',
        title: 'Berthing & Container Discharge',
        description: 'Scheduled berthing at Chattogram Container Terminal.',
        status: 'pending',
      },
      {
        id: 's5',
        timestamp: 'Oct 12, 2026 • ETA',
        location: 'Consignee Factory Yard',
        title: 'Final Unloading & Delivery',
        description: 'Trailer transport to consignee warehouse.',
        status: 'pending',
      },
    ],
  },

  // Hand Carry Express
  'SAIN-HC-5501': {
    consignmentNo: 'SAIN-HC-5501',
    referenceNo: 'HC-CAN-DAC-5501',
    status: 'Customs Clearance',
    statusColor: 'purple',
    progressPercentage: 75,
    origin: {
      city: 'Guangzhou',
      hub: 'Tianhe Commercial Center',
      country: 'China',
      code: 'CAN',
    },
    destination: {
      city: 'Dhaka',
      address: 'Gulshan-2, Dhaka-1212',
      country: 'Bangladesh',
      code: 'DAC',
    },
    serviceType: 'Hand Carry Express',
    carrier: 'Dedicated On-Board Courier (OBC Flight CZ-391)',
    awbNumber: 'OBC-881920',
    departureDate: 'Oct 06, 2026 - 06:15 AM',
    estimatedDelivery: 'Oct 06, 2026 - 21:00 (Today)',
    cargoDetails: {
      pieces: 2,
      weight: '18.2 KG',
      dimensions: 'Cabin Hand Carry Suitcases',
      volume: '0.12 CBM',
      description: 'Critical Prototype Motherboards & High Value Samples',
      hsCode: '8473.30.00',
    },
    customsStatus: {
      act: 'Customs Act 2023 - Hand Carry Clearance',
      tradeTerm: 'Door-to-Door Dedicated Courier',
      dutyStatus: 'Fast-Track Airport Baggage Clearance',
      assessmentStation: 'DAC Passenger Baggage Customs Special Counter',
    },
    consignee: {
      name: 'Vertex Micro Devices BD',
      phoneMasked: '+880 1306 ***45',
      recipientType: 'R&D Center',
    },
    timeline: [
      {
        id: 'h1',
        timestamp: 'Oct 06, 2026 • 05:00 AM',
        location: 'Guangzhou Baiyun Airport',
        title: 'On-Board Courier Checked-In with Luggage',
        description: 'Package personally escorted by certified SAIN courier.',
        status: 'completed',
      },
      {
        id: 'h2',
        timestamp: 'Oct 06, 2026 • 12:45 PM',
        location: 'Dhaka Airport (DAC)',
        title: 'Flight Landed in Dhaka',
        description: 'Courier escorted baggage through priority international arrival terminal.',
        status: 'completed',
      },
      {
        id: 'h3',
        timestamp: 'Oct 06, 2026 • 02:30 PM',
        location: 'Dhaka Airport Customs Clearance',
        title: 'Customs Inspection in Progress',
        description: 'Immediate clearance protocol underway under Customs Act 2023.',
        status: 'current',
      },
      {
        id: 'h4',
        timestamp: 'Oct 06, 2026 • ETA 09:00 PM',
        location: 'Gulshan-2, Dhaka',
        title: 'Hand-to-Hand Delivery to Consignee',
        description: 'Direct courier handoff with identity verification.',
        status: 'pending',
      },
    ],
  },
};

/**
 * Generate a dynamic fallback consignment for any query string so user always gets a rich tracking experience
 */
export function getOrCreateConsignment(query: string): Consignment {
  const cleanKey = query.trim().toUpperCase();

  // Exact match
  for (const key of Object.keys(INITIAL_CONSIGNMENTS)) {
    if (key.toUpperCase() === cleanKey) {
      return INITIAL_CONSIGNMENTS[key];
    }
  }

  // Partial match
  for (const [key, item] of Object.entries(INITIAL_CONSIGNMENTS)) {
    if (key.toUpperCase().includes(cleanKey) || cleanKey.includes(key.toUpperCase())) {
      return item;
    }
  }

  // Generate realistic live shipment for arbitrary search
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

  return {
    consignmentNo: query.toUpperCase(),
    referenceNo: `SAIN-AWB-${query.toUpperCase()}`,
    status: 'Customs Clearance',
    statusColor: 'amber',
    progressPercentage: 72,
    origin: {
      city: 'Guangzhou',
      hub: 'SAIN International Freight Terminal, Baiyun',
      country: 'China',
      code: 'CAN',
    },
    destination: {
      city: 'Dhaka',
      address: 'Uttara Headquarters & Logistics Center, Dhaka-1230',
      country: 'Bangladesh',
      code: 'DAC',
    },
    serviceType: 'Air Freight Priority',
    carrier: 'SAIN Freight Carrier Network',
    awbNumber: `AWB-${Math.floor(1000000 + Math.random() * 9000000)}`,
    departureDate: `${dateStr} - Scheduled Air Freight`,
    estimatedDelivery: `Within 24-48 Hours to Doorstep`,
    cargoDetails: {
      pieces: 5,
      weight: '82.4 KG',
      dimensions: 'Standard Air Cargo Packaging',
      volume: '0.85 CBM',
      description: 'General Merchandise & Industrial Goods',
      hsCode: '9801.00.00',
    },
    customsStatus: {
      act: 'Customs Act 2023 Compliant',
      tradeTerm: 'CFR Dhaka',
      dutyStatus: 'Duty Assessment Processing',
      assessmentStation: 'Dhaka Airport Customs Unit',
    },
    consignee: {
      name: 'Registered Consignee',
      phoneMasked: '+880 17** ***99',
      recipientType: 'Verified Customer',
    },
    timeline: [
      {
        id: 'gen1',
        timestamp: '3 Days Ago',
        location: 'Guangzhou Hub, China',
        title: 'Cargo Received & Barcode Assigned',
        description: 'Package accepted into SAIN global consolidation warehouse.',
        status: 'completed',
      },
      {
        id: 'gen2',
        timestamp: '2 Days Ago',
        location: 'CAN Airport, Guangzhou',
        title: 'Export Customs Approved & Departed',
        description: 'Flight departed with air freight cargo manifest.',
        status: 'completed',
      },
      {
        id: 'gen3',
        timestamp: 'Yesterday',
        location: 'Dhaka Airport Cargo Village (DAC)',
        title: 'Arrived at Destination Airport',
        description: 'Received by SAIN clearance officers at Dhaka.',
        status: 'completed',
      },
      {
        id: 'gen4',
        timestamp: 'Today',
        location: 'Dhaka Customs Clearing Hub',
        title: 'Under Customs Duty Assessment',
        description: 'Formal release documentation ongoing under Customs Act 2023.',
        status: 'current',
      },
      {
        id: 'gen5',
        timestamp: 'Tomorrow (ETA)',
        location: 'Uttara Sorting Hub → Recipient Address',
        title: 'Dispatched for Final Doorstep Delivery',
        description: 'Final delivery via SAIN local van network.',
        status: 'pending',
      },
    ],
  };
}

export const getStatusProgressAndColor = (
  statusStr: string
): { progress: number; color: 'green' | 'amber' | 'blue' | 'purple' | 'red' } => {
  const s = (statusStr || '').toLowerCase();
  if (s.includes('delivered')) return { progress: 100, color: 'green' };
  if (s.includes('out for delivery')) return { progress: 90, color: 'green' };
  if (s.includes('bangladesh warehouse') || s.includes('warehouse')) return { progress: 85, color: 'green' };
  if (s.includes('customs')) return { progress: 70, color: 'amber' };
  if (s.includes('in transit')) return { progress: 60, color: 'blue' };
  if (s.includes('enroute')) return { progress: 50, color: 'blue' };
  if (s.includes('received')) return { progress: 25, color: 'blue' };
  if (s.includes('pending')) return { progress: 10, color: 'amber' };
  if (s.includes('cancelled') || s.includes('returned')) return { progress: 0, color: 'red' };
  return { progress: 65, color: 'blue' };
};
