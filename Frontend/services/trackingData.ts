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
};

export const CANONICAL_STATUS_LIST = [
  'Pending',
  'Received',
  'In Transit',
  'En Route',
  'On Hold by Customs',
  'At Bangladesh warehouse',
  'Out for delivery',
  'Delivered',
  'Returned',
  'Cancelled',
] as const;

export const STATUS_RANK: Record<string, number> = {
  'pending': 1,
  'received': 2,
  'in transit': 3,
  'en route': 3,
  'enroute': 3,
  'on hold by customs': 4,
  'on hold': 4,
  'customs clearance': 4,
  'at bangladesh warehouse': 5,
  'bangladesh warehouse': 5,
  'warehouse': 5,
  'out for delivery': 6,
  'delivered': 7,
  'cancelled': 8,
  'returned': 8,
};

export function normalizeStatus(str: string): string {
  const s = (str || '').trim().toLowerCase();
  if (s.includes('delivered')) return 'Delivered';
  if (s.includes('out for delivery')) return 'Out for delivery';
  if (s.includes('bangladesh warehouse') || s.includes('warehouse')) return 'At Bangladesh warehouse';
  if (s.includes('customs') || s.includes('on hold')) return 'On Hold by Customs';
  if (s.includes('en route') || s.includes('enroute')) return 'En Route';
  if (s.includes('transit')) return 'In Transit';
  if (s.includes('received') || s.includes('recived')) return 'Received';
  if (s.includes('pending')) return 'Pending';
  if (s.includes('cancelled')) return 'Cancelled';
  if (s.includes('returned')) return 'Returned';
  return str || 'At Bangladesh warehouse';
}

/**
 * Returns current date and time formatted in Bangladesh Standard Time (UTC+6)
 */
export function getBangladeshDateTime(dateObj: Date = new Date()): { date: string; time: string; formatted: string } {
  try {
    const dateStr = dateObj.toLocaleDateString('en-CA', { timeZone: 'Asia/Dhaka' }); // YYYY-MM-DD
    const timeStr = dateObj.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Dhaka',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).toLowerCase(); // "01:24 pm"
    
    const formatted = dateObj.toLocaleDateString('en-US', {
      timeZone: 'Asia/Dhaka',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) + ' at ' + timeStr;

    return { date: dateStr, time: timeStr, formatted };
  } catch {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
    return {
      date: `${y}-${m}-${d}`,
      time: timeStr,
      formatted: `${y}-${m}-${d} at ${timeStr}`,
    };
  }
}

/**
 * Safely parse date and 12-hour/24-hour time to millisecond timestamp (prevents NaN bugs)
 */
export function parseDateTimeToMillis(dateStr?: string, timeStr?: string): number {
  if (!dateStr) return 0;
  let cleanTime = (timeStr || '12:00 pm').trim().toLowerCase();
  const isPM = cleanTime.includes('pm');
  const isAM = cleanTime.includes('am');
  cleanTime = cleanTime.replace(/[^\d:]/g, '');

  const parts = cleanTime.split(':');
  let hours = parseInt(parts[0] || '0', 10);
  const minutes = parseInt(parts[1] || '0', 10);

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  const dateParts = dateStr.split(/[-/]/).map((v) => parseInt(v, 10));
  if (dateParts.length < 3 || isNaN(dateParts[0])) return 0;

  return new Date(dateParts[0], dateParts[1] - 1, dateParts[2], hours, minutes).getTime();
}

/**
 * Builds synchronized milestones timeline reflecting the current live status
 */
export function buildConsignmentTimeline(
  currentStatus: string,
  history: ShipmentHistoryItem[] = [],
  originCity = 'Guangzhou, China',
  destinationCity = 'Dhaka, Bangladesh'
): Milestone[] {
  const normalizedCurrent = normalizeStatus(currentStatus);
  const isDelivered = normalizedCurrent.toLowerCase() === 'delivered';
  const currentRank = STATUS_RANK[normalizedCurrent.toLowerCase()] || 3;

  let workingHistory = [...(history || [])];

  // If workingHistory is empty or does not yet include currentStatus, ensure it has currentStatus
  const hasCurrentStatusInHistory = workingHistory.some(
    (h) => normalizeStatus(h.status).toLowerCase() === normalizedCurrent.toLowerCase()
  );

  if (!hasCurrentStatusInHistory) {
    const bdNow = getBangladeshDateTime();
    workingHistory.unshift({
      id: `h-auto-${Date.now()}`,
      date: bdNow.date,
      time: bdNow.time,
      location: destinationCity,
      status: normalizedCurrent,
      updatedBy: 'SAIN International Logistics',
      remarks: `Shipment status updated to ${normalizedCurrent}`,
    });
  }

  // Sort descending:
  // 1. Primary: Exact timestamp
  // 2. Secondary: Status Lifecycle Rank (so higher rank e.g. At Bangladesh Warehouse > Pending always ranks on top)
  const sorted = workingHistory.sort((a, b) => {
    const rankA = STATUS_RANK[normalizeStatus(a.status).toLowerCase()] || 0;
    const rankB = STATUS_RANK[normalizeStatus(b.status).toLowerCase()] || 0;
    const tA = parseDateTimeToMillis(a.date, a.time);
    const tB = parseDateTimeToMillis(b.date, b.time);

    if (tA && tB && tA !== tB) {
      return tB - tA;
    }
    // If timestamps are equal or missing, sort strictly by lifecycle progression rank
    return rankB - rankA;
  });

  let activeFound = false;

  return sorted.map((h, idx) => {
    const hStatus = normalizeStatus(h.status);
    const isStatusMatch = hStatus.toLowerCase() === normalizedCurrent.toLowerCase();
    const hRank = STATUS_RANK[hStatus.toLowerCase()] || 0;

    let milestoneStatus: 'completed' | 'current' | 'pending' = 'completed';

    if (isDelivered) {
      // When delivered, all milestones are completed
      milestoneStatus = 'completed';
    } else if (!activeFound && (isStatusMatch || (idx === 0 && hRank >= currentRank))) {
      milestoneStatus = 'current';
      activeFound = true;
    } else {
      milestoneStatus = 'completed';
    }

    return {
      id: `t-${h.id || idx}`,
      timestamp: `${h.date || ''} • ${h.time || ''}`.trim() || 'Recorded Status',
      location: h.location || destinationCity,
      title: h.status,
      description: h.remarks || `Cargo status: ${h.status} (${h.updatedBy || 'SAIN Logistics'})`,
      status: milestoneStatus,
    };
  });
}

/**
 * Locate consignment without fabricating fake dummy demo data
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

  throw new Error(`Consignment '${query}' not found. Please verify your consignment number.`);
}

export const getStatusProgressAndColor = (
  statusStr: string
): { progress: number; color: 'green' | 'amber' | 'blue' | 'purple' | 'red'; label: string } => {
  const s = (statusStr || '').toLowerCase().trim();
  if (s.includes('delivered')) return { progress: 100, color: 'green', label: 'Delivered' };
  if (s.includes('out for delivery')) return { progress: 92, color: 'amber', label: 'Out for Delivery' };
  if (s.includes('bangladesh warehouse') || s.includes('warehouse')) return { progress: 80, color: 'green', label: 'At Bangladesh Warehouse' };
  if (s.includes('customs') || s.includes('on hold')) return { progress: 65, color: 'amber', label: 'On Hold by Customs' };
  if (s.includes('en route') || s.includes('enroute')) return { progress: 50, color: 'blue', label: 'En Route to Dhaka' };
  if (s.includes('in transit') || s.includes('transit')) return { progress: 45, color: 'blue', label: 'In Transit' };
  if (s.includes('received') || s.includes('recived')) return { progress: 25, color: 'blue', label: 'Received at Origin Hub' };
  if (s.includes('pending')) return { progress: 10, color: 'amber', label: 'Pending Pickup' };
  if (s.includes('cancelled')) return { progress: 0, color: 'red', label: 'Cancelled' };
  if (s.includes('returned')) return { progress: 0, color: 'red', label: 'Returned' };
  return { progress: 50, color: 'blue', label: statusStr || 'In Transit' };
};

