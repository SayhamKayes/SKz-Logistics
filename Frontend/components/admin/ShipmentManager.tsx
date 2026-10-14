import React, { useState, useEffect, useMemo } from 'react';
import { useTracking } from '../../Context/TrackingContext';
import { Consignment, PackageItem, ShipmentHistoryItem, getStatusProgressAndColor } from '../../services/trackingData';
import { WaybillPrintModal } from './WaybillPrintModal';
import {
  Package,
  Plus,
  Trash2,
  CheckCircle,
  Save,
  Clock,
  Printer,
  ExternalLink,
  RotateCcw,
  Sparkles,
  MapPin,
  UserCheck,
  Tag,
  FolderPlus,
  AlertTriangle,
} from 'lucide-react';

const DEFAULT_ORIGINS = ['China', 'Hong Kong', 'Singapore', 'Bangladesh', 'Thailand', 'Vietnam'];
const DEFAULT_DESTINATIONS = ['Bangladesh', 'China', 'UAE / Dubai', 'Worldwide', 'USA', 'United Kingdom', 'Canada'];
const DEFAULT_AGENTS = [
  '-- Select Agent --',
  'Guangzhou Hub Receiving Agent (CAN)',
  'Shenzhen Cargo Forwarding Agent (SZX)',
  'Hong Kong Transit Specialist (HKG)',
  'Dhaka Airport Customs Clearance Agent (DAC)',
  'Chittagong Seaport Logistics Agent (CTG)',
  'Uttara Metro Operations Desk',
];

export const ShipmentManager: React.FC = () => {
  const { allConsignments, updateConsignment, addConsignment, openTrackingModal } = useTracking();

  // Selected consignment number for editing
  const [selectedNo, setSelectedNo] = useState<string>('SAINEX067638406');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isWaybillOpen, setIsWaybillOpen] = useState(false);

  // View Filter: Active vs Trash
  const [viewTab, setViewTab] = useState<'active' | 'trash'>('active');

  // Trashed shipments state from localStorage
  const [trashedConsignments, setTrashedConsignments] = useState<Record<string, { consignment: Consignment; trashedAt: string }>>(() => {
    try {
      const stored = localStorage.getItem('sain_trashed_consignments');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return {};
  });

  // Dynamic Origins and Destinations with custom add
  const [origins, setOrigins] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sain_custom_origins');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_ORIGINS;
  });

  const [destinations, setDestinations] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sain_custom_destinations');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_DESTINATIONS;
  });

  const [agents, setAgents] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sain_custom_agents');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_AGENTS;
  });

  // Inline Add Input States
  const [showAddOrigin, setShowAddOrigin] = useState(false);
  const [newOriginInput, setNewOriginInput] = useState('');

  const [showAddDest, setShowAddDest] = useState(false);
  const [newDestInput, setNewDestInput] = useState('');

  const [showAddAgent, setShowAddAgent] = useState(false);
  const [newAgentInput, setNewAgentInput] = useState('');

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // Active consignment object (filtered from non-trashed)
  const activeConsignmentsList = useMemo(() => {
    const list: Record<string, Consignment> = {};
    Object.entries(allConsignments).forEach(([k, v]) => {
      if (!trashedConsignments[k]) {
        list[k] = v;
      }
    });
    return list;
  }, [allConsignments, trashedConsignments]);

  const currentConsignment = activeConsignmentsList[selectedNo] || Object.values(activeConsignmentsList)[0];

  // ==========================================
  // Form State initialized from current consignment
  // ==========================================
  const [consignmentNo, setConsignmentNo] = useState(currentConsignment?.consignmentNo || 'SAINEX067638406');
  const [author, setAuthor] = useState('SAIN International Logistics (sain_sakib6055)');

  // Shipper details
  const [shipperName, setShipperName] = useState(currentConsignment?.shipper?.name || 'SAIN');
  const [shipperPhone, setShipperPhone] = useState(currentConsignment?.shipper?.phone || '+880171906999');
  const [shipperAddress, setShipperAddress] = useState(
    currentConsignment?.shipper?.address || '15/B, Uttara Metro Center, Dhaka 1230 Bangladesh'
  );
  const [shipperEmail, setShipperEmail] = useState(
    currentConsignment?.shipper?.email || 'saininternationallogistics@gmail.com'
  );

  // Receiver details
  const [receiverName, setReceiverName] = useState(
    currentConsignment?.receiver?.name || currentConsignment?.consignee?.name || 'Muhammad Tahin'
  );
  const [receiverPhone, setReceiverPhone] = useState(
    currentConsignment?.receiver?.phone || currentConsignment?.consignee?.phoneMasked || '+8801731939325'
  );
  const [receiverAddress, setReceiverAddress] = useState(
    currentConsignment?.receiver?.address || currentConsignment?.destination?.address || 'Basundhara Residential Area, Dhaka. B-block road 1. House: 252'
  );
  const [receiverEmail, setReceiverEmail] = useState(currentConsignment?.receiver?.email || 'ocuna123@gmail.com');

  // Shipment details (Left column)
  const [typeOfShipment, setTypeOfShipment] = useState(currentConsignment?.shipmentDetails?.typeOfShipment || 'Air Freight');
  const [weightText, setWeightText] = useState(currentConsignment?.shipmentDetails?.weightText || 'around 1500g');
  const [packagesCount, setPackagesCount] = useState(currentConsignment?.shipmentDetails?.packagesCount || '7');
  const [product, setProduct] = useState(currentConsignment?.shipmentDetails?.product || 'Keychain, Doll, Acrylic sheet');

  // Payment Mode (Screenshot 3 exact options)
  const [paymentMode, setPaymentMode] = useState(currentConsignment?.shipmentDetails?.paymentMode || 'CASH');

  // Carrier (Screenshot 4 exact options)
  const [carrier, setCarrier] = useState(currentConsignment?.shipmentDetails?.carrier || 'SAINEX');

  const [departureTime, setDepartureTime] = useState(currentConsignment?.shipmentDetails?.departureTimeStr || '18:52 pm');
  const [destination, setDestination] = useState(currentConsignment?.shipmentDetails?.destination || 'Bangladesh');
  const [pickupTime, setPickupTime] = useState(currentConsignment?.shipmentDetails?.pickupTimeStr || '10:00 am');
  const [comments, setComments] = useState(currentConsignment?.shipmentDetails?.comments || 'Total 7 store product.');

  // Shipment details (Right column)
  const [courier, setCourier] = useState(currentConsignment?.shipmentDetails?.courier || 'SAIN INTERNATIONAL LOGISTICS');
  const [mode, setMode] = useState(currentConsignment?.shipmentDetails?.mode || 'Air Freight');
  const [quantity, setQuantity] = useState(currentConsignment?.shipmentDetails?.quantity || '7 Box');
  const [totalFreight, setTotalFreight] = useState(currentConsignment?.shipmentDetails?.totalFreight || '৳ 12,500');
  const [carrierRefNo, setCarrierRefNo] = useState(currentConsignment?.shipmentDetails?.carrierReferenceNo || 'CRN-884920');
  const [origin, setOrigin] = useState(currentConsignment?.shipmentDetails?.origin || 'China');
  const [pickupDate, setPickupDate] = useState(currentConsignment?.shipmentDetails?.pickupDate || '2026-08-01');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(currentConsignment?.shipmentDetails?.expectedDeliveryDate || '2026-08-12');

  // Packages list (Ensuring every item has an isolated unique ID and individual index binding)
  const [packages, setPackages] = useState<PackageItem[]>(() => {
    if (currentConsignment?.packagesData && currentConsignment.packagesData.length > 0) {
      return currentConsignment.packagesData.map((p, idx) => ({
        ...p,
        id: p.id || `pkg-${idx + 1}-${Date.now()}`,
      }));
    }
    return [
      { id: '1', qty: 1, pieceType: 'Carton', description: '80595', lengthCm: 0, widthCm: 0, heightCm: 0, weightG: 0 },
      { id: '2', qty: 1, pieceType: 'Carton', description: '46182', lengthCm: 0, widthCm: 0, heightCm: 0, weightG: 0 },
      { id: '3', qty: 1, pieceType: 'Carton', description: '46089', lengthCm: 0, widthCm: 0, heightCm: 0, weightG: 0 },
      { id: '4', qty: 1, pieceType: 'Carton', description: '33242', lengthCm: 0, widthCm: 0, heightCm: 0, weightG: 0 },
      { id: '5', qty: 1, pieceType: 'Carton', description: '33260', lengthCm: 0, widthCm: 0, heightCm: 0, weightG: 0 },
      { id: '6', qty: 1, pieceType: 'Carton', description: '66924', lengthCm: 0, widthCm: 0, heightCm: 0, weightG: 0 },
      { id: '7', qty: 1, pieceType: 'Carton', description: '60831', lengthCm: 0, widthCm: 0, heightCm: 0, weightG: 0 },
    ];
  });

  // Shipment History (Milestones)
  const [shipmentHistory, setShipmentHistory] = useState<ShipmentHistoryItem[]>(() => {
    if (currentConsignment?.shipmentHistory && currentConsignment.shipmentHistory.length > 0) {
      return currentConsignment.shipmentHistory;
    }
    return [
      { id: 'h1', date: '2026-08-11', time: '13:46 pm', location: 'Bangladesh', status: 'At Bangladesh warehouse', updatedBy: 'SAIN International Logistics', remarks: 'Contact via' },
      { id: 'h2', date: '2026-08-07', time: '14:00 pm', location: 'China', status: 'In Transit', updatedBy: 'SAIN International Logistics', remarks: 'Contact via' },
      { id: 'h3', date: '2026-08-01', time: '19:47 pm', location: 'China', status: 'Received', updatedBy: 'SAIN International Logistics', remarks: 'Contact via' },
    ];
  });

  // Right sidebar state
  const [client, setClient] = useState('-- Select Client --');
  const [selectedAgent, setSelectedAgent] = useState('Guangzhou Hub Receiving Agent (CAN)');
  const [employee, setEmployee] = useState('-- Select Employee --');
  const [publishedOn, setPublishedOn] = useState('Aug 11, 2026 at 13:39');
  const [publishDate, setPublishDate] = useState('2026-10-10');
  const [publishTime, setPublishTime] = useState('18:52 pm');
  const [publishLocation, setPublishLocation] = useState('Dhaka Airport Hub');
  const [publishCurrentStatus, setPublishCurrentStatus] = useState('At Bangladesh warehouse');
  const [publishRemarks, setPublishRemarks] = useState('');
  const [tags, setTags] = useState<string[]>(['Guangzhou', 'Air Express']);
  const [tagInput, setTagInput] = useState('');
  const [categories, setCategories] = useState<{ [key: string]: boolean }>({
    'Keychain Mix': true,
    'Electronic Item': false,
  });

  // Sync state when active selection changes
  useEffect(() => {
    if (!currentConsignment) return;
    setConsignmentNo(currentConsignment.consignmentNo);
    if (currentConsignment.shipper) {
      setShipperName(currentConsignment.shipper.name);
      setShipperPhone(currentConsignment.shipper.phone);
      setShipperAddress(currentConsignment.shipper.address);
      setShipperEmail(currentConsignment.shipper.email);
    }
    if (currentConsignment.receiver) {
      setReceiverName(currentConsignment.receiver.name);
      setReceiverPhone(currentConsignment.receiver.phone);
      setReceiverAddress(currentConsignment.receiver.address);
      setReceiverEmail(currentConsignment.receiver.email);
    }
    if (currentConsignment.shipmentDetails) {
      setTypeOfShipment(currentConsignment.shipmentDetails.typeOfShipment);
      setWeightText(currentConsignment.shipmentDetails.weightText);
      setPackagesCount(currentConsignment.shipmentDetails.packagesCount);
      setProduct(currentConsignment.shipmentDetails.product);
      setPaymentMode(currentConsignment.shipmentDetails.paymentMode);
      setCarrier(currentConsignment.shipmentDetails.carrier);
      setDepartureTime(currentConsignment.shipmentDetails.departureTimeStr);
      setDestination(currentConsignment.shipmentDetails.destination);
      setPickupTime(currentConsignment.shipmentDetails.pickupTimeStr);
      setComments(currentConsignment.shipmentDetails.comments);
      setCourier(currentConsignment.shipmentDetails.courier);
      setMode(currentConsignment.shipmentDetails.mode);
      setQuantity(currentConsignment.shipmentDetails.quantity);
      setTotalFreight(currentConsignment.shipmentDetails.totalFreight);
      setCarrierRefNo(currentConsignment.shipmentDetails.carrierReferenceNo);
      setOrigin(currentConsignment.shipmentDetails.origin);
      setPickupDate(currentConsignment.shipmentDetails.pickupDate);
      setExpectedDeliveryDate(currentConsignment.shipmentDetails.expectedDeliveryDate);
    }
    if (currentConsignment.packagesData) {
      setPackages(
        currentConsignment.packagesData.map((p, idx) => ({
          ...p,
          id: p.id || `pkg-${idx + 1}-${Date.now()}`,
        }))
      );
    }
    if (currentConsignment.shipmentHistory) {
      setShipmentHistory(currentConsignment.shipmentHistory);
    }
    if (currentConsignment.status) {
      setPublishCurrentStatus(currentConsignment.status);
    }
    if (currentConsignment.adminMetadata?.publishedOn) {
      setPublishedOn(currentConsignment.adminMetadata.publishedOn);
    }
  }, [selectedNo, currentConsignment]);

  // ==========================================================
  // PACKAGE TABLE HANDLERS (Index-based to prevent any multi-field sync)
  // ==========================================================
  const handleAddPackage = () => {
    const newPkg: PackageItem = {
      id: `pkg-${Date.now()}-${packages.length + 1}`,
      qty: 1,
      pieceType: 'Carton',
      description: '',
      lengthCm: 0,
      widthCm: 0,
      heightCm: 0,
      weightG: 0,
    };
    setPackages((prev) => [...prev, newPkg]);
  };

  const handleUpdatePackage = (index: number, field: keyof PackageItem, value: any) => {
    setPackages((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], [field]: value };
      }
      return copy;
    });
  };

  const handleDeletePackage = (index: number) => {
    setPackages((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Calculations for summary bar
  const totalActualWeightG = useMemo(() => {
    return packages.reduce((sum, p) => sum + (Number(p.qty) || 1) * (Number(p.weightG) || 0), 0);
  }, [packages]);

  const totalVolumeCuM = useMemo(() => {
    return packages.reduce((sum, p) => {
      const vol = ((Number(p.lengthCm) || 0) * (Number(p.widthCm) || 0) * (Number(p.heightCm) || 0)) / 1000000;
      return sum + (Number(p.qty) || 1) * vol;
    }, 0);
  }, [packages]);

  const totalVolumetricWeightG = useMemo(() => {
    return packages.reduce((sum, p) => {
      const volWeightKg = ((Number(p.lengthCm) || 0) * (Number(p.widthCm) || 0) * (Number(p.heightCm) || 0)) / 5000;
      return sum + (Number(p.qty) || 1) * volWeightKg * 1000;
    }, 0);
  }, [packages]);

  // ==========================================================
  // MILESTONE / HISTORY HANDLERS & PAGINATION (10 items per page)
  // ==========================================================
  const [historyPage, setHistoryPage] = useState(1);
  const historyItemsPerPage = 10;
  const totalHistoryPages = Math.max(1, Math.ceil(shipmentHistory.length / historyItemsPerPage));
  const paginatedHistory = useMemo(() => {
    const start = (historyPage - 1) * historyItemsPerPage;
    return shipmentHistory.slice(start, start + historyItemsPerPage);
  }, [shipmentHistory, historyPage]);

  const handleAddMilestone = () => {
    const newM: ShipmentHistoryItem = {
      id: `sh-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: 'Bangladesh',
      status: 'In Transit',
      updatedBy: 'SAIN International Logistics',
      remarks: 'Contact via',
    };
    setShipmentHistory((prev) => [newM, ...prev]);
    setHistoryPage(1);
  };

  const handleUpdateMilestone = (id: string, field: keyof ShipmentHistoryItem, value: any) => {
    setShipmentHistory((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleDeleteMilestone = (id: string) => {
    setShipmentHistory((prev) => prev.filter((m) => m.id !== id));
  };

  // ==========================================================
  // TAGS & CATEGORY HANDLERS
  // ==========================================================
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryInput.trim()) {
      setCategories({ ...categories, [newCategoryInput.trim()]: true });
      setNewCategoryInput('');
      setShowAddCategory(false);
    }
  };

  // ==========================================================
  // CUSTOM ORIGIN & DESTINATION ADDERS
  // ==========================================================
  const handleAddCustomOrigin = (e: React.FormEvent) => {
    e.preventDefault();
    const val = newOriginInput.trim();
    if (val && !origins.includes(val)) {
      const updated = [...origins, val];
      setOrigins(updated);
      setOrigin(val);
      localStorage.setItem('sain_custom_origins', JSON.stringify(updated));
      setNewOriginInput('');
      setShowAddOrigin(false);
    }
  };

  const handleAddCustomDest = (e: React.FormEvent) => {
    e.preventDefault();
    const val = newDestInput.trim();
    if (val && !destinations.includes(val)) {
      const updated = [...destinations, val];
      setDestinations(updated);
      setDestination(val);
      localStorage.setItem('sain_custom_destinations', JSON.stringify(updated));
      setNewDestInput('');
      setShowAddDest(false);
    }
  };

  const handleAddCustomAgent = (e: React.FormEvent) => {
    e.preventDefault();
    const val = newAgentInput.trim();
    if (val && !agents.includes(val)) {
      const updated = [...agents, val];
      setAgents(updated);
      setSelectedAgent(val);
      localStorage.setItem('sain_custom_agents', JSON.stringify(updated));
      setNewAgentInput('');
      setShowAddAgent(false);
    }
  };

  const handleRemoveDestination = (destToRemove: string) => {
    if (destinations.length <= 1) return;
    const updated = destinations.filter((d) => d !== destToRemove);
    setDestinations(updated);
    if (destination === destToRemove) setDestination(updated[0]);
    localStorage.setItem('sain_custom_destinations', JSON.stringify(updated));
  };

  const handleRemoveOrigin = (origToRemove: string) => {
    if (origins.length <= 1) return;
    const updated = origins.filter((o) => o !== origToRemove);
    setOrigins(updated);
    if (origin === origToRemove) setOrigin(updated[0]);
    localStorage.setItem('sain_custom_origins', JSON.stringify(updated));
  };

  const handleRemoveAgent = (agentToRemove: string) => {
    if (agents.length <= 1) return;
    const updated = agents.filter((a) => a !== agentToRemove);
    setAgents(updated);
    if (selectedAgent === agentToRemove) setSelectedAgent(updated[0]);
    localStorage.setItem('sain_custom_agents', JSON.stringify(updated));
  };

  const handleRemoveCategory = (catToRemove: string) => {
    const updated = { ...categories };
    delete updated[catToRemove];
    setCategories(updated);
  };

  // ==========================================================
  // ADD NEW BILL (Create new blank consignment with unique SAINEX number)
  // ==========================================================
  const handleAddNewBill = () => {
    let newBillNo = '';
    let counter = 0;
    do {
      const randDigits = Math.floor(10000000 + Math.random() * 90000000);
      newBillNo = `SAINEX${randDigits}`;
      counter++;
    } while ((allConsignments[newBillNo] || trashedConsignments[newBillNo]) && counter < 50);

    const todayDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowFormatted = `${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${currentTime}`;

    const newTemplateConsignment: Consignment = {
      consignmentNo: newBillNo,
      referenceNo: `CRN-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Pending',
      statusColor: 'amber',
      progressPercentage: 10,
      author: 'SAIN International Logistics (sain_sakib6055)',
      origin: {
        city: 'China',
        hub: 'SAIN Guangzhou Cargo Center',
        country: 'China',
        code: 'CAN',
      },
      destination: {
        city: 'Bangladesh',
        address: '',
        country: 'Bangladesh',
        code: 'DAC',
      },
      serviceType: 'Air Freight Priority',
      carrier: 'SAINEX',
      awbNumber: `AWB-${newBillNo}`,
      departureDate: todayDate,
      estimatedDelivery: 'Within 7 working days',
      cargoDetails: {
        pieces: 1,
        weight: '',
        dimensions: '1 Box Export Cargo',
        volume: '0.05 CBM',
        description: '',
      },
      customsStatus: {
        act: 'Customs Act 2023 Compliant',
        tradeTerm: 'DAP (Delivered at Place)',
        dutyStatus: 'Pre-cleared / Formal Assessment',
        assessmentStation: 'Dhaka Airport Customs House',
      },
      consignee: {
        name: '',
        phoneMasked: '',
        recipientType: 'Consignee',
      },
      shipper: {
        name: 'SAIN',
        phone: '+880171906999',
        address: '15/B, Uttara Metro Center, Dhaka 1230 Bangladesh',
        email: 'saininternationallogistics@gmail.com',
      },
      receiver: {
        name: '',
        phone: '',
        address: '',
        email: '',
      },
      shipmentDetails: {
        typeOfShipment: 'Air Freight',
        weightText: '',
        packagesCount: '1',
        product: '',
        paymentMode: 'CASH',
        carrier: 'SAINEX',
        departureTimeStr: '18:52 pm',
        destination: 'Bangladesh',
        pickupTimeStr: '10:00 am',
        courier: 'SAIN INTERNATIONAL LOGISTICS',
        mode: 'Air Freight',
        quantity: '1 Box',
        totalFreight: '',
        carrierReferenceNo: `CRN-${Math.floor(100000 + Math.random() * 900000)}`,
        origin: 'China',
        pickupDate: todayDate,
        expectedDeliveryDate: '',
        comments: '',
      },
      packagesData: [
        {
          id: `pkg-${Date.now()}-1`,
          qty: 1,
          pieceType: 'Carton',
          description: '',
          lengthCm: 0,
          widthCm: 0,
          heightCm: 0,
          weightG: 0,
        },
      ],
      shipmentHistory: [
        {
          id: `sh-${Date.now()}`,
          date: todayDate,
          time: currentTime,
          location: 'China',
          status: 'Pending',
          updatedBy: 'SAIN International Logistics',
          remarks: 'New shipment bill registered',
        },
      ],
      timeline: [
        {
          id: `t-${Date.now()}`,
          timestamp: `${todayDate} • ${currentTime}`,
          location: 'China Hub',
          title: 'Pending',
          description: 'New shipment bill registered',
          status: 'current',
        },
      ],
      adminMetadata: {
        client: '',
        agentName: 'Guangzhou Hub Receiving Agent (CAN)',
        employee: 'SAIN Admin (sain_sakib6055)',
        publishedOn: nowFormatted,
        tags: ['Guangzhou', 'Air Express'],
        categories: ['General Cargo'],
      },
    };

    addConsignment(newTemplateConsignment);
    setSelectedNo(newBillNo);
    setSaveSuccessMsg(`New Bill template generated (${newBillNo})! Fill details and click Update to save.`);
    setTimeout(() => setSaveSuccessMsg(null), 6000);
  };

  // ==========================================================
  // MOVE TO TRASH & RECYCLE BIN RESTORE
  // ==========================================================
  const handleMoveToTrash = () => {
    if (!currentConsignment) return;
    if (window.confirm(`Move consignment ${consignmentNo} to Trash? You can restore it anytime.`)) {
      const updatedTrash = {
        ...trashedConsignments,
        [consignmentNo]: {
          consignment: currentConsignment,
          trashedAt: new Date().toLocaleString(),
        },
      };
      setTrashedConsignments(updatedTrash);
      localStorage.setItem('sain_trashed_consignments', JSON.stringify(updatedTrash));

      setSaveSuccessMsg(`Consignment ${consignmentNo} moved to Trash (Recycle Bin).`);
      setTimeout(() => setSaveSuccessMsg(null), 3500);

      // Select another active consignment
      const remainingKeys = Object.keys(activeConsignmentsList).filter((k) => k !== consignmentNo);
      if (remainingKeys.length > 0) {
        setSelectedNo(remainingKeys[0]);
      }
    }
  };

  const handleRestoreFromTrash = (noToRestore: string) => {
    const item = trashedConsignments[noToRestore];
    if (!item) return;

    const copy = { ...trashedConsignments };
    delete copy[noToRestore];
    setTrashedConsignments(copy);
    localStorage.setItem('sain_trashed_consignments', JSON.stringify(copy));

    setSelectedNo(noToRestore);
    setViewTab('active');
    setSaveSuccessMsg(`Consignment ${noToRestore} has been successfully restored to Active Shipments!`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleDeletePermanently = (noToDelete: string) => {
    if (window.confirm(`Permanently delete ${noToDelete}? This action cannot be undone.`)) {
      const copy = { ...trashedConsignments };
      delete copy[noToDelete];
      setTrashedConsignments(copy);
      localStorage.setItem('sain_trashed_consignments', JSON.stringify(copy));
      setSaveSuccessMsg(`Consignment ${noToDelete} permanently deleted.`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  // ==========================================================
  // SAVE / UPDATE SHIPMENT (Sync with Django and Frontend Context)
  // ==========================================================
  const handleSaveShipment = async () => {
    const now = new Date();
    const formattedNow = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setPublishedOn(formattedNow);

    const liveStatus = (publishCurrentStatus as any) || 'At Bangladesh warehouse';
    const { progress, color } = getStatusProgressAndColor(liveStatus);

    // Build timeline in real-time from the shipment history checkpoints
    const liveTimeline = shipmentHistory.map((sh, idx) => ({
      id: `t-${sh.id || idx}`,
      timestamp: `${sh.date} • ${sh.time}`,
      location: sh.location,
      title: sh.status,
      description: sh.remarks || `Status updated to ${sh.status} by ${sh.updatedBy}`,
      status: (sh.status.toLowerCase().includes('delivered') ? 'completed' : idx === 0 ? 'current' : 'completed') as any,
    }));

    const cleanNo = consignmentNo.trim().toUpperCase();

    const updated: Consignment = {
      ...currentConsignment,
      consignmentNo: cleanNo,
      referenceNo: carrierRefNo || `REF-${cleanNo}`,
      status: liveStatus,
      statusColor: color,
      progressPercentage: progress,
      timeline: liveTimeline,
      author,
      consignee: {
        name: receiverName || 'Consignee',
        phoneMasked: receiverPhone || '',
        recipientType: 'Verified Recipient',
      },
      shipper: {
        name: shipperName,
        phone: shipperPhone,
        address: shipperAddress,
        email: shipperEmail,
      },
      receiver: {
        name: receiverName,
        phone: receiverPhone,
        address: receiverAddress,
        email: receiverEmail,
      },
      shipmentDetails: {
        typeOfShipment,
        weightText,
        packagesCount: String(packages.length),
        product,
        paymentMode,
        carrier,
        departureTimeStr: departureTime,
        destination,
        pickupTimeStr: pickupTime,
        courier,
        mode,
        quantity,
        totalFreight,
        carrierReferenceNo: carrierRefNo,
        origin,
        pickupDate,
        expectedDeliveryDate,
        comments,
      },
      packagesData: packages,
      shipmentHistory,
      adminMetadata: {
        client,
        agentName: selectedAgent,
        employee,
        publishedOn: formattedNow,
        tags,
        categories: Object.keys(categories).filter((c) => categories[c]),
      },
      origin: {
        city: origin,
        hub: `SAIN ${origin} Cargo Terminal`,
        country: origin,
        code: origin.substring(0, 3).toUpperCase(),
      },
      destination: {
        city: destination,
        address: receiverAddress,
        country: destination,
        code: destination.substring(0, 3).toUpperCase(),
      },
      serviceType: typeOfShipment,
      carrier,
      awbNumber: carrierRefNo,
      cargoDetails: {
        pieces: packages.length,
        weight: weightText,
        description: product,
        dimensions: `${quantity} Standard Cargo`,
        volume: `${totalVolumeCuM.toFixed(4)} CBM`,
      },
    };

    try {
      await updateConsignment(updated);
      setSelectedNo(cleanNo);
      setSaveSuccessMsg(`Bill ${updated.consignmentNo} updated successfully! Live tracking synchronized in real time.`);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err: any) {
      setSaveSuccessMsg(`Saved locally: ${err?.message || 'Ready for tracking'}`);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    }
  };

  // If in Trash View Tab: Render the Recycle Bin
  if (viewTab === 'trash') {
    const trashedEntries = Object.entries(trashedConsignments);
    return (
      <div className="space-y-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewTab('active')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              &larr; Back to Active Shipments
            </button>
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span>Trash / Recycle Bin ({trashedEntries.length})</span>
            </h3>
          </div>
        </div>

        {saveSuccessMsg && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 shadow-xs animate-in fade-in text-xs font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {trashedEntries.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Trash2 className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600">The Recycle Bin is currently empty.</p>
              <p className="text-xs text-slate-400">Items moved to trash will appear here and can be restored anytime.</p>
            </div>
          ) : (
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase">
                <tr>
                  <th className="py-3 px-4">Consignment No.</th>
                  <th className="py-3 px-4">Shipper</th>
                  <th className="py-3 px-4">Consignee</th>
                  <th className="py-3 px-4">Trashed Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trashedEntries.map(([no, { consignment, trashedAt }]) => (
                  <tr key={no} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-[#1a6c7a]">{no}</td>
                    <td className="py-3 px-4 text-slate-700">{consignment.shipper?.name || '—'}</td>
                    <td className="py-3 px-4 text-slate-700">{consignment.receiver?.name || consignment.consignee?.name || '—'}</td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">{trashedAt}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleRestoreFromTrash(no)}
                        className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 font-bold rounded-lg text-xs transition cursor-pointer inline-flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore / Recycle</span>
                      </button>
                      <button
                        onClick={() => handleDeletePermanently(no)}
                        className="px-3 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300 font-bold rounded-lg text-xs transition cursor-pointer"
                      >
                        Delete Permanently
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  // Active Shipments View
  return (
    <div className="space-y-6">
      {/* Top Bar: Selector, Views, Print & Live Tracking */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Active vs Trash View Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setViewTab('active')}
              className="px-3 py-1.5 rounded-lg font-bold bg-white text-slate-900 shadow-xs cursor-pointer"
            >
              Active Shipments ({Object.keys(activeConsignmentsList).length})
            </button>
            <button
              type="button"
              onClick={() => setViewTab('trash')}
              className="px-3 py-1.5 rounded-lg font-bold text-slate-500 hover:text-rose-600 transition cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Trash ({Object.keys(trashedConsignments).length})</span>
            </button>
          </div>

          {/* Consignment Dropdown Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Select Consignment:</span>
            <select
              value={selectedNo}
              onChange={(e) => setSelectedNo(e.target.value)}
              className="text-xs font-bold font-mono border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 outline-none focus:border-[#1a6c7a]"
            >
              {Object.keys(activeConsignmentsList).map((no) => (
                <option key={no} value={no}>
                  {no} ({activeConsignmentsList[no].status})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Add New Bill Option */}
          <button
            type="button"
            onClick={handleAddNewBill}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Create a new blank bill / consignment"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Bill</span>
          </button>

          <button
            type="button"
            onClick={() => setIsWaybillOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-teal-700 to-[#153243] hover:from-teal-600 hover:to-[#1a6c7a] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print Waybill & Invoice</span>
          </button>

          <button
            type="button"
            onClick={() => openTrackingModal(consignmentNo)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer border border-slate-300"
            title="Preview this consignment in Live Tracking Modal"
          >
            <span>Live Tracking Preview</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold text-xs sm:text-sm">{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main Form Box: Consignment No & Author */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[280px]">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Consignment Title / Air Waybill (AWB)
          </label>
          <input
            type="text"
            value={consignmentNo}
            onChange={(e) => setConsignmentNo(e.target.value)}
            className="w-full text-xl font-bold font-mono text-slate-900 border border-slate-300 rounded-lg px-3.5 py-2 focus:border-[#1a6c7a] outline-none"
          />
        </div>

        <div className="min-w-[280px]">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Author
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg px-3.5 py-2 bg-slate-50 outline-none"
          />
        </div>
      </div>

      {/* 2-Columns Form & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* SHIPPER & RECEIVER DETAILS */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Shipper */}
              <div className="space-y-3.5">
                <h3 className="text-xs font-black text-emerald-700 tracking-wider uppercase border-b border-emerald-100 pb-2">
                  SHIPPER DETAILS
                </h3>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Shipper Name</label>
                  <input
                    type="text"
                    value={shipperName}
                    onChange={(e) => setShipperName(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={shipperPhone}
                    onChange={(e) => setShipperPhone(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Address</label>
                  <input
                    type="text"
                    value={shipperAddress}
                    onChange={(e) => setShipperAddress(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={shipperEmail}
                    onChange={(e) => setShipperEmail(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Receiver */}
              <div className="space-y-3.5">
                <h3 className="text-xs font-black text-emerald-700 tracking-wider uppercase border-b border-emerald-100 pb-2">
                  RECEIVER DETAILS
                </h3>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Receiver Name</label>
                  <input
                    type="text"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={receiverPhone}
                    onChange={(e) => setReceiverPhone(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Address</label>
                  <input
                    type="text"
                    value={receiverAddress}
                    onChange={(e) => setReceiverAddress(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={receiverEmail}
                    onChange={(e) => setReceiverEmail(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SHIPMENT DETAILS */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-black text-emerald-700 tracking-wider uppercase border-b border-emerald-100 pb-2">
              SHIPMENT DETAILS
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Type of Shipment</label>
                  <select
                    value={typeOfShipment}
                    onChange={(e) => setTypeOfShipment(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-emerald-600"
                  >
                    <option value="Air Freight">Air Freight</option>
                    <option value="Sea Freight">Sea Freight</option>
                    <option value="Hand Carry">Hand Carry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Weight</label>
                  <input
                    type="text"
                    value={weightText}
                    onChange={(e) => setWeightText(e.target.value)}
                    placeholder="around 1500g"
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Packages</label>
                  <input
                    type="text"
                    value={packagesCount}
                    onChange={(e) => setPackagesCount(e.target.value)}
                    placeholder="7"
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Product</label>
                  <input
                    type="text"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    placeholder="Keychain, Doll, Acrylic sheet"
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Payment Mode (Matching Screenshot 3) */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-emerald-600 font-medium"
                  >
                    <option value="">-- Select One --</option>
                    <option value="CASH">CASH</option>
                    <option value="Cheque">Cheque</option>
                    <option value="BACS">BACS</option>
                    <option value="Wire Transfer">Wire Transfer</option>
                  </select>
                </div>

                {/* Carrier (Matching Screenshot 4) */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Carrier</label>
                  <select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-emerald-600 font-medium"
                  >
                    <option value="">-- Select One --</option>
                    <option value="DHL">DHL</option>
                    <option value="USPS">USPS</option>
                    <option value="FedEx">FedEx</option>
                    <option value="SAINEX">SAINEX</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Departure Time</label>
                  <input
                    type="text"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    placeholder="18:52 pm"
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Destination with Custom Add */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-slate-600">Destination</label>
                    <button
                      type="button"
                      onClick={() => setShowAddDest(!showAddDest)}
                      className="text-[10px] text-emerald-700 hover:underline font-bold"
                    >
                      {showAddDest ? 'Close' : '+ Add Custom'}
                    </button>
                  </div>

                  {showAddDest && (
                    <form onSubmit={handleAddCustomDest} className="flex gap-1.5 mb-2">
                      <input
                        type="text"
                        placeholder="New destination..."
                        value={newDestInput}
                        onChange={(e) => setNewDestInput(e.target.value)}
                        className="flex-1 text-xs border border-emerald-400 rounded-lg px-2 py-1 outline-none"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                      >
                        Add
                      </button>
                    </form>
                  )}

                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-emerald-600"
                  >
                    {destinations.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {destinations.map((d) => (
                      <span
                        key={d}
                        className="inline-flex items-center gap-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                      >
                        <span>{d}</span>
                        {destinations.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDestination(d)}
                            title={`Remove ${d}`}
                            className="text-slate-400 hover:text-rose-600 font-bold ml-0.5 cursor-pointer"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pickup Time</label>
                  <input
                    type="text"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    placeholder="10:00 am"
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Comments</label>
                  <textarea
                    rows={2}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Total 7 store product."
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Courier</label>
                  <input
                    type="text"
                    value={courier}
                    onChange={(e) => setCourier(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-emerald-600"
                  >
                    <option value="Air Freight">Air Freight</option>
                    <option value="Sea Freight">Sea Freight</option>
                    <option value="Hand Carry">Hand Carry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Quantity</label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="7 Box"
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Total Freight</label>
                  <input
                    type="text"
                    value={totalFreight}
                    onChange={(e) => setTotalFreight(e.target.value)}
                    placeholder="৳ 12,500"
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Carrier Reference No.</label>
                  <input
                    type="text"
                    value={carrierRefNo}
                    onChange={(e) => setCarrierRefNo(e.target.value)}
                    placeholder="CRN-884920"
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-600 font-mono"
                  />
                </div>

                {/* Origin with Custom Add */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-slate-600">Origin</label>
                    <button
                      type="button"
                      onClick={() => setShowAddOrigin(!showAddOrigin)}
                      className="text-[10px] text-emerald-700 hover:underline font-bold"
                    >
                      {showAddOrigin ? 'Close' : '+ Add Custom'}
                    </button>
                  </div>

                  {showAddOrigin && (
                    <form onSubmit={handleAddCustomOrigin} className="flex gap-1.5 mb-2">
                      <input
                        type="text"
                        placeholder="New origin..."
                        value={newOriginInput}
                        onChange={(e) => setNewOriginInput(e.target.value)}
                        className="flex-1 text-xs border border-emerald-400 rounded-lg px-2 py-1 outline-none"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                      >
                        Add
                      </button>
                    </form>
                  )}

                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-emerald-600"
                  >
                    {origins.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {origins.map((o) => (
                      <span
                        key={o}
                        className="inline-flex items-center gap-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                      >
                        <span>{o}</span>
                        {origins.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOrigin(o)}
                            title={`Remove ${o}`}
                            className="text-slate-400 hover:text-rose-600 font-bold ml-0.5 cursor-pointer"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pickup Date</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expected Delivery Date</label>
                  <input
                    type="date"
                    value={expectedDeliveryDate}
                    onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PACKAGES TABLE (Individual Editing + Live Volumetric Totals) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Packages Details
              </h3>
              <span className="text-[11px] text-slate-500 font-semibold">{packages.length} Packages</span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#009b4d] text-white font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Qty.</th>
                    <th className="py-2.5 px-3">Piece Type</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Length(cm)</th>
                    <th className="py-2.5 px-3">Width(cm)</th>
                    <th className="py-2.5 px-3">Height(cm)</th>
                    <th className="py-2.5 px-3">Weight (g)</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {packages.map((pkg, idx) => (
                    <tr key={pkg.id || idx} className="hover:bg-slate-50">
                      <td className="p-2 w-16">
                        <input
                          type="number"
                          value={pkg.qty}
                          onChange={(e) => handleUpdatePackage(idx, 'qty', Number(e.target.value))}
                          className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2 w-28">
                        <select
                          value={pkg.pieceType}
                          onChange={(e) => handleUpdatePackage(idx, 'pieceType', e.target.value)}
                          className="w-full border border-slate-300 rounded px-2 py-1 text-xs bg-white"
                        >
                          <option value="">-- Select Type --</option>
                          <option value="Pallet">Pallet</option>
                          <option value="Carton">Carton</option>
                          <option value="Crate">Crate</option>
                          <option value="Loose">Loose</option>
                          <option value="Others">Others</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={pkg.description}
                          onChange={(e) => handleUpdatePackage(idx, 'description', e.target.value)}
                          className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-mono"
                        />
                      </td>
                      <td className="p-2 w-20">
                        <input
                          type="number"
                          value={pkg.lengthCm}
                          onChange={(e) => handleUpdatePackage(idx, 'lengthCm', Number(e.target.value))}
                          className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2 w-20">
                        <input
                          type="number"
                          value={pkg.widthCm}
                          onChange={(e) => handleUpdatePackage(idx, 'widthCm', Number(e.target.value))}
                          className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2 w-20">
                        <input
                          type="number"
                          value={pkg.heightCm}
                          onChange={(e) => handleUpdatePackage(idx, 'heightCm', Number(e.target.value))}
                          className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2 w-24">
                        <input
                          type="number"
                          value={pkg.weightG}
                          onChange={(e) => handleUpdatePackage(idx, 'weightG', Number(e.target.value))}
                          className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2 text-center w-20">
                        <button
                          type="button"
                          onClick={() => handleDeletePackage(idx)}
                          className="px-2.5 py-1 bg-[#e11d48] hover:bg-rose-700 text-white rounded text-[11px] font-bold transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <button
                type="button"
                onClick={handleAddPackage}
                className="px-4 py-1.5 bg-[#009b4d] hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Package</span>
              </button>

              {/* Dynamic live calculated volumetric totals */}
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-slate-700 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                <span>Total Volumetric Weight: <strong className="text-emerald-700 font-mono">{totalVolumetricWeightG.toFixed(2)}g</strong></span>
                <span>Total Volume: <strong className="text-emerald-700 font-mono">{totalVolumeCuM.toFixed(4)}cu. m.</strong></span>
                <span>Total Actual Weight: <strong className="text-emerald-700 font-mono">{totalActualWeightG.toFixed(2)}g</strong></span>
              </div>
            </div>
          </div>

          {/* SHIPMENT HISTORY (Milestones) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Shipment History / Milestones
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Chronological transit checkpoints for this specific consignment. Each entry reflects live on the customer&apos;s Tracking timeline.
                </p>
              </div>
              <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md self-start sm:self-auto">
                {shipmentHistory.length} Live Checkpoints
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#009b4d] text-white font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Updated By</th>
                    <th className="py-2.5 px-3">Remarks</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {paginatedHistory.map((sh) => (
                    <tr key={sh.id} className="hover:bg-slate-50">
                      <td className="p-2 w-32">
                        <input
                          type="date"
                          value={sh.date}
                          onChange={(e) => handleUpdateMilestone(sh.id, 'date', e.target.value)}
                          className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2 w-28">
                        <input
                          type="text"
                          value={sh.time}
                          onChange={(e) => handleUpdateMilestone(sh.id, 'time', e.target.value)}
                          className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2 w-32">
                        <input
                          type="text"
                          value={sh.location}
                          onChange={(e) => handleUpdateMilestone(sh.id, 'location', e.target.value)}
                          className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2 w-48">
                        <select
                          value={sh.status}
                          onChange={(e) => handleUpdateMilestone(sh.id, 'status', e.target.value)}
                          className="w-full border border-slate-300 rounded px-2 py-1 text-xs bg-white font-semibold text-slate-800"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Received">Received</option>
                          <option value="On Hold by Customs">On Hold by Customs</option>
                          <option value="Out for delivery">Out for delivery</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Enroute">Enroute</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Returned">Returned</option>
                          <option value="At Bangladesh warehouse">At Bangladesh warehouse</option>
                        </select>
                      </td>
                      <td className="p-2 w-40">
                        <input
                          type="text"
                          value={sh.updatedBy}
                          onChange={(e) => handleUpdateMilestone(sh.id, 'updatedBy', e.target.value)}
                          className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={sh.remarks}
                          onChange={(e) => handleUpdateMilestone(sh.id, 'remarks', e.target.value)}
                          className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2 text-center w-20">
                        <button
                          type="button"
                          onClick={() => handleDeleteMilestone(sh.id)}
                          className="px-2.5 py-1 bg-[#e11d48] hover:bg-rose-700 text-white rounded text-[11px] font-bold transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls & Add Entry */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddMilestone}
                className="px-4 py-1.5 bg-[#009b4d] hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Shipment History Entry</span>
              </button>

              {totalHistoryPages > 1 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[11px] text-slate-500 mr-2">
                    Showing {(historyPage - 1) * historyItemsPerPage + 1}–{Math.min(historyPage * historyItemsPerPage, shipmentHistory.length)} of {shipmentHistory.length}
                  </span>
                  <button
                    type="button"
                    disabled={historyPage === 1}
                    onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                    className="px-2.5 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium cursor-pointer"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalHistoryPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setHistoryPage(p)}
                      className={`w-7 h-7 rounded text-xs font-bold transition cursor-pointer ${
                        historyPage === p
                          ? 'bg-[#1a6c7a] text-white shadow-xs'
                          : 'border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={historyPage === totalHistoryPages}
                    onClick={() => setHistoryPage((p) => Math.min(totalHistoryPages, p + 1))}
                    className="px-2.5 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SIDEBAR WIDGETS */}
        <div className="space-y-6">
          {/* Assign Shipment to (Interactive Agent selector) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Assign shipment to
            </h4>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Client</label>
              <select
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white"
              >
                <option>-- Select Client --</option>
                <option>Muhammad Tahin (VIP)</option>
                <option>Bengal Import Trading Ltd</option>
                <option>Sylhet Garments Export</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-slate-500">Agent Name</label>
                <button
                  type="button"
                  onClick={() => setShowAddAgent(!showAddAgent)}
                  className="text-[10px] text-emerald-700 hover:underline font-bold"
                >
                  {showAddAgent ? 'Close' : '+ Add Agent'}
                </button>
              </div>

              {showAddAgent && (
                <form onSubmit={handleAddCustomAgent} className="flex gap-1.5 mb-2">
                  <input
                    type="text"
                    placeholder="New agent name..."
                    value={newAgentInput}
                    onChange={(e) => setNewAgentInput(e.target.value)}
                    className="flex-1 text-xs border border-emerald-400 rounded-lg px-2 py-1 outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                  >
                    Add
                  </button>
                </form>
              )}

              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white text-slate-800 font-medium"
              >
                {agents.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {agents.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 max-w-full"
                  >
                    <span className="truncate max-w-[150px]">{a}</span>
                    {agents.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAgent(a)}
                        title={`Remove ${a}`}
                        className="text-slate-400 hover:text-rose-600 font-bold ml-0.5 cursor-pointer"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Employee</label>
              <select
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white"
              >
                <option>-- Select Employee --</option>
                <option>SAIN Admin (sain_sakib6055)</option>
                <option>Customs Officer (HSIA Airport)</option>
                <option>Warehouse Manager (Uttara Hub)</option>
              </select>
            </div>
          </div>

          {/* Publish Box */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Publish</h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Live
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <span>Published on: <strong className="text-slate-800">{publishedOn}</strong></span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Auto Updated
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Current Status: <strong>{publishCurrentStatus}</strong>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Date</label>
                <input
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-2 py-1 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Time</label>
                <input
                  type="text"
                  value={publishTime}
                  onChange={(e) => setPublishTime(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-2 py-1 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Location</label>
              <input
                type="text"
                value={publishLocation}
                onChange={(e) => setPublishLocation(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-2 py-1 text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Status</label>
              <select
                value={publishCurrentStatus}
                onChange={(e) => setPublishCurrentStatus(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-2 py-1 text-xs bg-white font-medium"
              >
                <option value="-- Select Type --">-- Select Type --</option>
                <option value="Pending">Pending</option>
                <option value="Received">Received</option>
                <option value="On Hold by Customs">On Hold by Customs</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="In Transit">In Transit</option>
                <option value="Enroute">Enroute</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Delivered">Delivered</option>
                <option value="Returned">Returned</option>
                <option value="At Bangladesh warehouse">At Bangladesh warehouse</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Remarks</label>
              <textarea
                rows={2}
                value={publishRemarks}
                onChange={(e) => setPublishRemarks(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-2 py-1 text-xs"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={handleMoveToTrash}
                className="text-rose-600 hover:text-rose-800 text-xs font-semibold cursor-pointer hover:underline"
              >
                Move to Trash
              </button>

              <button
                type="button"
                onClick={handleSaveShipment}
                className="px-6 py-2 bg-[#009b4d] hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Update</span>
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Tags
            </h4>
            <form onSubmit={handleAddTag} className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Enter tag"
                className="flex-1 border border-slate-300 rounded-lg px-2.5 py-1 text-xs outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-[#009b4d] hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Add
              </button>
            </form>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs border border-slate-200"
                >
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="text-slate-400 hover:text-rose-600 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Category with Dynamic Add */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Category
            </h4>
            <div className="space-y-1.5 text-xs">
              {Object.keys(categories).map((cat) => (
                <div key={cat} className="flex items-center justify-between group py-0.5">
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={categories[cat]}
                      onChange={(e) =>
                        setCategories({ ...categories, [cat]: e.target.checked })
                      }
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-slate-700 font-medium">{cat}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(cat)}
                    title={`Delete category ${cat}`}
                    className="text-slate-400 hover:text-rose-600 px-1 text-sm font-bold opacity-60 hover:opacity-100 transition cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {showAddCategory ? (
              <form onSubmit={handleAddNewCategory} className="flex gap-1.5 pt-1">
                <input
                  type="text"
                  placeholder="New Category..."
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  className="flex-1 text-xs border border-emerald-400 rounded-lg px-2 py-1 outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCategory(false)}
                  className="px-2 py-1 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddCategory(true)}
                className="text-blue-600 hover:underline text-[11px] block pt-1 cursor-pointer font-semibold"
              >
                + Add New Category
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Printable Waybill Modal */}
      {currentConsignment && (
        <WaybillPrintModal
          consignment={currentConsignment}
          isOpen={isWaybillOpen}
          onClose={() => setIsWaybillOpen(false)}
        />
      )}
    </div>
  );
};
