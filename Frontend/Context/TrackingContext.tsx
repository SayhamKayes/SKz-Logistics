import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Consignment,
  INITIAL_CONSIGNMENTS,
  getStatusProgressAndColor,
  buildConsignmentTimeline,
  normalizeStatus,
} from '../services/trackingData';
import { API_BASE_URL } from '../services/databaseConfig';

export type AppTab = 'home' | 'about' | 'services' | 'contact' | 'track' | 'admin';

interface TrackingContextType {
  activeConsignment: Consignment | null;
  isTrackingModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
  searchHistory: string[];
  allConsignments: Record<string, Consignment>;
  activeTab: AppTab;
  isQuoteModalOpen: boolean;
  isDevDbModalOpen: boolean;
  isHeaderVisible: boolean;
  setHeaderVisible: (visible: boolean) => void;
  setActiveTab: (tab: AppTab) => void;
  openTrackingModal: (consignmentNumber?: string) => void;
  closeTrackingModal: () => void;
  openQuoteModal: () => void;
  closeQuoteModal: () => void;
  setDevDbModalOpen: (isOpen: boolean) => void;
  searchConsignment: (code: string) => Promise<Consignment>;
  updateConsignment: (consignment: Consignment) => Promise<void>;
  addConsignment: (consignment: Consignment) => Promise<void>;
  deleteConsignment: (consignmentNo: string) => Promise<void>;
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

const LOCAL_STORAGE_CONSIGNMENTS_KEY = 'sain_logistics_consignments_data';
const LOCAL_STORAGE_HISTORY_KEY = 'sain_tracking_search_history';

// Keys to purge so demo data never persists or pollutes recent shipments
const DEMO_CONSIGNMENT_KEYS = ['12345', 'SAIN-78492-BD', 'SAIN-SEA-99120', 'SAIN-HC-5501'];

export const TrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allConsignments, setAllConsignments] = useState<Record<string, Consignment>>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CONSIGNMENTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Strip out any deprecated demo consignments from local storage
        DEMO_CONSIGNMENT_KEYS.forEach((k) => delete parsed[k]);
        return { ...INITIAL_CONSIGNMENTS, ...parsed };
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return INITIAL_CONSIGNMENTS;
  });

  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (saved) {
        const parsed: string[] = JSON.parse(saved);
        return parsed.filter((item) => !DEMO_CONSIGNMENT_KEYS.includes(item.toUpperCase()));
      }
    } catch {
      // ignore
    }
    return ['SAINEX067638406'];
  });

  const [activeConsignment, setActiveConsignment] = useState<Consignment | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial tab resolution based on browser URL
  const [activeTab, setActiveTabState] = useState<AppTab>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin' || path === '/admin/') return 'admin';
      if (path === '/services' || path === '/services/') return 'services';
      if (path === '/about' || path === '/about/') return 'about';
      if (path === '/contact' || path === '/contact/') return 'contact';
      if (path === '/track' || path === '/track/') return 'track';
    }
    return 'home';
  });

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isDevDbModalOpen, setDevDbModalOpen] = useState(false);
  const [isHeaderVisible, setHeaderVisible] = useState(false);

  // Sync activeTab with browser URL
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/admin' || path === '/admin/') {
        setActiveTabState('admin');
      } else if (path === '/services' || path === '/services/') {
        setActiveTabState('services');
      } else if (path === '/about' || path === '/about/') {
        setActiveTabState('about');
      } else if (path === '/contact' || path === '/contact/') {
        setActiveTabState('contact');
      } else if (path === '/track' || path === '/track/') {
        setActiveTabState('track');
      } else {
        setActiveTabState('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setActiveTab = (tab: AppTab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      const targetPath = tab === 'home' ? '/' : `/${tab}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(searchHistory));
    } catch {
      // ignore
    }
  }, [searchHistory]);

  // Initial backend fetch to ensure admin panel and client have live DB data
  useEffect(() => {
    const fetchBackendConsignments = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/couriers/consignments/`, {
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            setAllConsignments((prev) => {
              const merged = { ...prev };
              list.forEach((item: any) => {
                if (item.consignment_no && !DEMO_CONSIGNMENT_KEYS.includes(item.consignment_no)) {
                  merged[item.consignment_no] = mapDjangoToConsignment(item);
                }
              });
              try {
                localStorage.setItem(LOCAL_STORAGE_CONSIGNMENTS_KEY, JSON.stringify(merged));
              } catch {}
              return merged;
            });
          }
        }
      } catch (e) {
        console.info('Django API initial fetch skipped (offline mode):', e);
      }
    };

    fetchBackendConsignments();
  }, []);

  // Multi-tab and component real-time cross-talk synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_CONSIGNMENTS_KEY && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          setAllConsignments(data);
          if (activeConsignment && data[activeConsignment.consignmentNo]) {
            setActiveConsignment(data[activeConsignment.consignmentNo]);
          }
        } catch {}
      }
    };

    const handleCustomUpdate = (e: any) => {
      const updated = e.detail as Consignment;
      if (updated && updated.consignmentNo) {
        setAllConsignments((prev) => ({ ...prev, [updated.consignmentNo]: updated }));
        if (activeConsignment?.consignmentNo === updated.consignmentNo) {
          setActiveConsignment(updated);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sain_consignment_updated', handleCustomUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sain_consignment_updated', handleCustomUpdate);
    };
  }, [activeConsignment]);

  // Convert raw Django DRF response into clean Frontend Consignment format
  const mapDjangoToConsignment = (data: any): Consignment => {
    const rawMilestones = data.milestones || [];

    const formattedHistory = rawMilestones.map((m: any, idx: number) => {
      const rawStatus = m.status || m.title || 'In Transit';
      const cleanStatus = rawStatus.toLowerCase() === 'recived' ? 'Received' : rawStatus;
      return {
        id: String(m.id || `sh-${idx}`),
        date: m.date_str || '',
        time: m.time_str || '',
        location: m.location || '',
        status: cleanStatus,
        updatedBy: m.updated_by || 'SAIN International Logistics',
        remarks: m.remarks || '',
      };
    });

    const liveStatus = normalizeStatus(data.status || 'At Bangladesh warehouse');
    const { progress, color } = getStatusProgressAndColor(liveStatus);
    const liveTimeline = buildConsignmentTimeline(
      liveStatus,
      formattedHistory,
      data.origin_city || 'Guangzhou',
      data.destination_city || 'Dhaka'
    );

    return {
      consignmentNo: data.consignment_no,
      referenceNo: data.reference_no || data.carrier_reference_no || `REF-${data.consignment_no}`,
      status: liveStatus,
      statusColor: color,
      progressPercentage: data.progress_percentage || progress,
      author: 'SAIN International Logistics (sain_sakib6055)',
      origin: {
        city: data.origin_city || 'Guangzhou',
        hub: data.origin_hub || 'SAIN Guangzhou Cargo Center',
        country: data.origin_country || 'China',
        code: data.origin_code || 'CAN',
      },
      destination: {
        city: data.destination_city || 'Dhaka',
        address: data.destination_address || data.receiver_address || 'Uttara, Dhaka-1230',
        country: data.destination_country || 'Bangladesh',
        code: data.destination_code || 'DAC',
      },
      serviceType: data.service_type || data.type_of_shipment || 'Air Freight Priority',
      carrier: data.carrier || 'SAINEX Direct Air Network',
      awbNumber: data.awb_number || `AWB-${data.consignment_no}`,
      departureDate: data.departure_date ? new Date(data.departure_date).toLocaleDateString() : 'Scheduled',
      estimatedDelivery: data.estimated_delivery || data.expected_delivery_date || 'Within 48 hours',
      cargoDetails: {
        pieces: Number(data.packages_count) || data.pieces || 7,
        weight: data.weight_text || `${data.weight_kg} KG` || 'around 1500g',
        dimensions: data.dimensions || 'Export Standard Cartons',
        volume: data.volume_cbm ? `${data.volume_cbm} CBM` : '0.12 CBM',
        description: data.product || data.cargo_description || 'Commercial Freight Goods',
        hsCode: data.hs_code || '3926.90.99',
      },
      customsStatus: {
        act: data.customs_act || 'Bangladesh Customs Act 2023 Compliant',
        tradeTerm: data.trade_term || 'CFR Dhaka',
        dutyStatus: data.duty_status || 'Duty Assessed & Cleared',
        assessmentStation: data.assessment_station || 'Hazrat Shahjalal International Airport Customs House',
      },
      consignee: {
        name: data.receiver_name || data.consignee_name || 'Customer',
        phoneMasked: data.receiver_phone || data.consignee_phone || '+880 17***',
        recipientType: 'Verified Recipient',
      },
      shipper: {
        name: data.shipper_name || 'SAIN',
        phone: data.shipper_phone || '+880171906999',
        address: data.shipper_address || '15/B, Uttara Metro Center, Dhaka 1230 Bangladesh',
        email: data.shipper_email || 'saininternationallogistics@gmail.com',
      },
      receiver: {
        name: data.receiver_name || 'Muhammad Tahin',
        phone: data.receiver_phone || '+8801731939325',
        address: data.receiver_address || 'Basundhara Residential Area, Dhaka, D-block road 1, House: 252',
        email: data.receiver_email || 'ocuna123@gmail.com',
      },
      shipmentDetails: {
        typeOfShipment: data.type_of_shipment || 'Air Freight',
        weightText: data.weight_text || 'around 1500g',
        packagesCount: data.packages_count || '7',
        product: data.product || 'Keychain, Doll, Acrylic sheet',
        paymentMode: data.payment_mode || 'CASH',
        carrier: data.carrier || 'SAINEX',
        departureTimeStr: data.departure_time_str || '18:52 pm',
        destination: data.destination_country || 'Bangladesh',
        pickupTimeStr: data.pickup_time_str || '10:00 am',
        courier: data.carrier || 'SAIN INTERNATIONAL LOGISTICS',
        mode: data.type_of_shipment || 'Air Freight',
        quantity: data.quantity || '7 Box',
        totalFreight: data.total_freight || '৳ 12,500',
        carrierReferenceNo: data.carrier_reference_no || 'CRN-884920',
        origin: data.origin_country || 'China',
        pickupDate: data.pickup_date || '2026-08-01',
        expectedDeliveryDate: data.expected_delivery_date || '2026-08-12',
        comments: data.comments || 'Total 7 store product.',
      },
      packagesData: (data.packages_data || []).map((p: any, idx: number) => ({
        id: p.id ? String(p.id) : `pkg-${idx + 1}-${data.consignment_no || 'c'}`,
        qty: p.qty !== undefined ? Number(p.qty) : 1,
        pieceType: p.pieceType || p.piece_type || 'Carton',
        description: p.description !== undefined ? String(p.description) : '',
        lengthCm: p.lengthCm !== undefined ? Number(p.lengthCm) : (p.length_cm !== undefined ? Number(p.length_cm) : 0),
        widthCm: p.widthCm !== undefined ? Number(p.widthCm) : (p.width_cm !== undefined ? Number(p.width_cm) : 0),
        heightCm: p.heightCm !== undefined ? Number(p.heightCm) : (p.height_cm !== undefined ? Number(p.height_cm) : 0),
        weightG: p.weightG !== undefined ? Number(p.weightG) : (p.weight_g !== undefined ? Number(p.weight_g) : 0),
      })),
      shipmentHistory: formattedHistory,
      timeline: liveTimeline,
      adminMetadata: {
        client: data.client || '',
        agentName: data.agent_name || '',
        employee: data.employee || '',
        publishStatus: data.published_status || 'Published',
        publishedOn: 'Aug 11, 2026 at 13:39',
        tags: data.tags ? data.tags.split(',') : ['Guangzhou'],
        categories: data.category ? data.category.split(',') : ['Keychain Mix'],
      },
    };
  };

  const searchConsignment = async (code: string): Promise<Consignment> => {
    const clean = code.trim();
    if (!clean) {
      throw new Error('Please enter a consignment number (e.g. SAINEX067638406)');
    }

    setIsLoading(true);
    setError(null);

    // 1. Try Live Django REST Framework API First
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/couriers/track/${encodeURIComponent(clean)}/`, {
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        const djangoData = await response.json();
        const mapped = mapDjangoToConsignment(djangoData);
        setActiveConsignment(mapped);
        setAllConsignments((prev) => ({
          ...prev,
          [mapped.consignmentNo]: mapped,
        }));
        setSearchHistory((prev) => {
          const filtered = prev.filter((item) => item.toUpperCase() !== clean.toUpperCase());
          return [clean.toUpperCase(), ...filtered].slice(0, 8);
        });
        setIsLoading(false);
        return mapped;
      }
    } catch (apiErr) {
      console.info('Django API query skipped, checking local store:', apiErr);
    }

    // 2. Fallback to Local Storage / In-memory Catalog
    await new Promise((resolve) => setTimeout(resolve, 200));

    try {
      let result = allConsignments[clean] || allConsignments[clean.toUpperCase()];
      if (!result) {
        try {
          const stored = localStorage.getItem(LOCAL_STORAGE_CONSIGNMENTS_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            result = parsed[clean] || parsed[clean.toUpperCase()];
          }
        } catch {}
      }

      if (!result) {
        const foundKey = Object.keys(allConsignments).find(
          (k) => k.toLowerCase() === clean.toLowerCase()
        );
        if (foundKey) {
          result = allConsignments[foundKey];
        }
      }

      if (!result) {
        throw new Error(`Consignment '${clean}' was not found. Please verify the consignment number or contact SAIN logistics support.`);
      }

      setActiveConsignment(result);
      setSearchHistory((prev) => {
        const filtered = prev.filter((item) => item.toUpperCase() !== clean.toUpperCase());
        return [clean.toUpperCase(), ...filtered].slice(0, 8);
      });
      setIsLoading(false);
      return result;
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch consignment details.');
      setIsLoading(false);
      throw err;
    }
  };

  const openTrackingModal = (consignmentNumber?: string) => {
    if (consignmentNumber) {
      searchConsignment(consignmentNumber);
    } else if (!activeConsignment) {
      // Pick first active registered consignment if available, without forcing demo codes
      const firstValid = Object.values(allConsignments).find(
        (c) => c && !DEMO_CONSIGNMENT_KEYS.includes(c.consignmentNo)
      );
      if (firstValid) {
        setActiveConsignment(firstValid);
      }
    }
    setIsTrackingModalOpen(true);
  };

  const closeTrackingModal = () => {
    setIsTrackingModalOpen(false);
  };

  const openQuoteModal = () => setIsQuoteModalOpen(true);
  const closeQuoteModal = () => setIsQuoteModalOpen(false);

  // Sync updates with Django REST Framework backend
  const syncWithBackend = async (consignment: Consignment) => {
    try {
      const payload = {
        consignment_no: consignment.consignmentNo,
        reference_no: consignment.referenceNo || consignment.shipmentDetails?.carrierReferenceNo || '',
        status: consignment.status || 'At Bangladesh warehouse',
        service_type: consignment.serviceType || consignment.shipmentDetails?.typeOfShipment || 'Air Freight',
        shipper_name: consignment.shipper?.name || 'SAIN',
        shipper_phone: consignment.shipper?.phone || '+880171906999',
        shipper_address: consignment.shipper?.address || '15/B, Uttara Metro Center, Dhaka 1230 Bangladesh',
        shipper_email: consignment.shipper?.email || 'saininternationallogistics@gmail.com',
        receiver_name: consignment.receiver?.name || consignment.consignee?.name || '',
        receiver_phone: consignment.receiver?.phone || consignment.consignee?.phoneMasked || '',
        receiver_address: consignment.receiver?.address || consignment.destination?.address || '',
        receiver_email: consignment.receiver?.email || '',
        consignee_name: consignment.receiver?.name || consignment.consignee?.name || '',
        consignee_phone: consignment.receiver?.phone || consignment.consignee?.phoneMasked || '',
        type_of_shipment: consignment.shipmentDetails?.typeOfShipment || 'Air Freight',
        weight_text: consignment.shipmentDetails?.weightText || 'around 1500g',
        packages_count: String(consignment.packagesData?.length || consignment.shipmentDetails?.packagesCount || '1'),
        product: consignment.shipmentDetails?.product || '',
        payment_mode: consignment.shipmentDetails?.paymentMode || 'CASH',
        carrier: consignment.shipmentDetails?.carrier || 'SAINEX',
        departure_time_str: consignment.shipmentDetails?.departureTimeStr || '18:52 pm',
        pickup_time_str: consignment.shipmentDetails?.pickupTimeStr || '',
        quantity: consignment.shipmentDetails?.quantity || '1 Box',
        total_freight: consignment.shipmentDetails?.totalFreight || '',
        carrier_reference_no: consignment.shipmentDetails?.carrierReferenceNo || '',
        origin_country: consignment.shipmentDetails?.origin || consignment.origin?.country || 'China',
        destination_country: consignment.shipmentDetails?.destination || consignment.destination?.country || 'Bangladesh',
        pickup_date: consignment.shipmentDetails?.pickupDate || '',
        expected_delivery_date: consignment.shipmentDetails?.expectedDeliveryDate || '',
        comments: consignment.shipmentDetails?.comments || '',
        progress_percentage: consignment.progressPercentage || 85,
        packages_data: consignment.packagesData || [],
        client: consignment.adminMetadata?.client || '',
        agent_name: consignment.adminMetadata?.agentName || '',
        employee: consignment.adminMetadata?.employee || '',
        published_status: consignment.adminMetadata?.publishedOn || 'Published',
        tags: consignment.adminMetadata?.tags?.join(',') || 'Guangzhou',
        category: consignment.adminMetadata?.categories?.join(',') || 'Keychain Mix',
        milestones: consignment.shipmentHistory?.map((sh) => ({
          title: sh.status,
          location: sh.location,
          status: sh.status,
          date_str: sh.date,
          time_str: sh.time,
          updated_by: sh.updatedBy,
          remarks: sh.remarks,
        })) || [],
      };

      const res = await fetch(`${API_BASE_URL}/api/v1/couriers/consignments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        console.warn('Django sync returned status', res.status, errJson);
      }
    } catch (e) {
      console.info('Backend sync pending or local offline mode:', e);
    }
  };

  const updateConsignment = async (consignment: Consignment) => {
    setAllConsignments((prev) => {
      const next = { ...prev, [consignment.consignmentNo]: consignment };
      localStorage.setItem(LOCAL_STORAGE_CONSIGNMENTS_KEY, JSON.stringify(next));
      return next;
    });

    if (activeConsignment?.consignmentNo === consignment.consignmentNo) {
      setActiveConsignment(consignment);
    }

    // Broadcast across components and storage event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sain_consignment_updated', { detail: consignment }));
    }

    await syncWithBackend(consignment);
  };

  const addConsignment = async (consignment: Consignment) => {
    setAllConsignments((prev) => {
      const next = { ...prev, [consignment.consignmentNo]: consignment };
      localStorage.setItem(LOCAL_STORAGE_CONSIGNMENTS_KEY, JSON.stringify(next));
      return next;
    });
    setActiveConsignment(consignment);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sain_consignment_updated', { detail: consignment }));
    }

    await syncWithBackend(consignment);
  };

  const deleteConsignment = async (consignmentNo: string) => {
    setAllConsignments((prev) => {
      const next = { ...prev };
      delete next[consignmentNo];
      try {
        localStorage.setItem(LOCAL_STORAGE_CONSIGNMENTS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    if (activeConsignment?.consignmentNo === consignmentNo) {
      setActiveConsignment(null);
    }

    try {
      await fetch(`${API_BASE_URL}/api/v1/couriers/track/${encodeURIComponent(consignmentNo)}/`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.info('Backend delete skipped:', e);
    }
  };

  return (
    <TrackingContext.Provider
      value={{
        activeConsignment,
        isTrackingModalOpen,
        isLoading,
        error,
        searchHistory,
        allConsignments,
        activeTab,
        isQuoteModalOpen,
        isDevDbModalOpen,
        isHeaderVisible,
        setHeaderVisible,
        setActiveTab,
        openTrackingModal,
        closeTrackingModal,
        openQuoteModal,
        closeQuoteModal,
        setDevDbModalOpen,
        searchConsignment,
        updateConsignment,
        addConsignment,
        deleteConsignment,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};
