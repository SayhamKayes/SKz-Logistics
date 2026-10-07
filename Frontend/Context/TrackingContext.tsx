import React, { createContext, useContext, useState, useEffect } from 'react';
import { Consignment, INITIAL_CONSIGNMENTS, getOrCreateConsignment } from '../services/trackingData';

interface TrackingContextType {
  activeConsignment: Consignment | null;
  isTrackingModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
  searchHistory: string[];
  allConsignments: Record<string, Consignment>;
  activeTab: 'home' | 'about' | 'services' | 'contact' | 'track';
  isQuoteModalOpen: boolean;
  isDevDbModalOpen: boolean;
  setActiveTab: (tab: 'home' | 'about' | 'services' | 'contact' | 'track') => void;
  openTrackingModal: (consignmentNumber?: string) => void;
  closeTrackingModal: () => void;
  openQuoteModal: () => void;
  closeQuoteModal: () => void;
  setDevDbModalOpen: (isOpen: boolean) => void;
  searchConsignment: (code: string) => Promise<Consignment>;
  updateConsignment: (consignment: Consignment) => void;
  addConsignment: (consignment: Consignment) => void;
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

const LOCAL_STORAGE_CONSIGNMENTS_KEY = 'sain_logistics_consignments_data';
const LOCAL_STORAGE_HISTORY_KEY = 'sain_tracking_search_history';

export const TrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allConsignments, setAllConsignments] = useState<Record<string, Consignment>>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CONSIGNMENTS_KEY);
      if (stored) {
        return { ...INITIAL_CONSIGNMENTS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return INITIAL_CONSIGNMENTS;
  });

  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['12345', 'SAIN-78492-BD', 'SAIN-SEA-99120'];
  });

  const [activeConsignment, setActiveConsignment] = useState<Consignment | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'services' | 'contact' | 'track'>('home');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isDevDbModalOpen, setDevDbModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(searchHistory));
    } catch {
      // ignore
    }
  }, [searchHistory]);

  const searchConsignment = async (code: string): Promise<Consignment> => {
    const clean = code.trim();
    if (!clean) {
      throw new Error('Please enter a consignment number (e.g. 12345)');
    }

    setIsLoading(true);
    setError(null);

    // Simulate real network / Django DRF response delay (300ms)
    await new Promise((resolve) => setTimeout(resolve, 380));

    try {
      let result = allConsignments[clean] || allConsignments[clean.toUpperCase()];
      if (!result) {
        // Try case-insensitive or partial
        const foundKey = Object.keys(allConsignments).find(
          (k) => k.toLowerCase() === clean.toLowerCase()
        );
        if (foundKey) {
          result = allConsignments[foundKey];
        } else {
          // Dynamic lookup generator
          result = getOrCreateConsignment(clean);
          // persist so edits stay consistent
          setAllConsignments((prev) => ({
            ...prev,
            [clean.toUpperCase()]: result,
          }));
        }
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
      // Default to 12345 (official sample on saininternationallogistics.com)
      searchConsignment('12345');
    }
    setIsTrackingModalOpen(true);
  };

  const closeTrackingModal = () => {
    setIsTrackingModalOpen(false);
  };

  const openQuoteModal = () => setIsQuoteModalOpen(true);
  const closeQuoteModal = () => setIsQuoteModalOpen(false);

  const updateConsignment = (consignment: Consignment) => {
    setAllConsignments((prev) => {
      const next = { ...prev, [consignment.consignmentNo]: consignment };
      localStorage.setItem(LOCAL_STORAGE_CONSIGNMENTS_KEY, JSON.stringify(next));
      return next;
    });
    if (activeConsignment?.consignmentNo === consignment.consignmentNo) {
      setActiveConsignment(consignment);
    }
  };

  const addConsignment = (consignment: Consignment) => {
    setAllConsignments((prev) => {
      const next = { ...prev, [consignment.consignmentNo]: consignment };
      localStorage.setItem(LOCAL_STORAGE_CONSIGNMENTS_KEY, JSON.stringify(next));
      return next;
    });
    setActiveConsignment(consignment);
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
        setActiveTab,
        openTrackingModal,
        closeTrackingModal,
        openQuoteModal,
        closeQuoteModal,
        setDevDbModalOpen,
        searchConsignment,
        updateConsignment,
        addConsignment,
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
