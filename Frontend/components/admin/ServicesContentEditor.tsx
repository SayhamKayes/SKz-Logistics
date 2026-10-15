import React, { useState } from 'react';
import { Save, CheckCircle, Truck, Plus, Trash2, Edit3, Upload, Image, X, ListPlus } from 'lucide-react';

export interface ServiceCard {
  id: string;
  title: string;
  image: string;
  description: string;
  features: string[];
}

export interface ServicesSectionHeaderConfig {
  badge: string;
  title: string;
  description: string;
}

export const DEFAULT_SERVICES_HEADER: ServicesSectionHeaderConfig = {
  badge: 'Comprehensive Freight Solutions',
  title: 'Tailored Logistics For Global Commerce',
  description: 'From urgent documents to industrial bulk consignments, we provide seamless door-to-door freight forwarding, professional customs clearance under the Customs Act 2023, and real-time shipment transparency.',
};

export const DEFAULT_SERVICE_CARDS: ServiceCard[] = [
  {
    id: 'air-freight',
    title: 'Air Freight Priority',
    image: '/assets/images/air_freight.webp',
    description: 'Premier air freight solutions from Dhaka, specializing in swift cargo routing from major global hubs directly to Bangladesh. Expertly managing CFR terms and Customs Act 2023 clearance.',
    features: [
      'Guangzhou (CAN) & Shenzhen to Dhaka daily flight schedules',
      'CFR & CIF Incoterms handling with transparent customs paperwork',
      'Full compliance with Bangladesh Customs Act 2023 guidelines',
      'Direct airport customs clearance & swift bonded warehouse release',
    ],
  },
  {
    id: 'sea-freight',
    title: 'Sea Freight Ocean',
    image: '/assets/images/sea_freight.webp',
    description: 'Comprehensive, cost-effective ocean shipping connecting global manufacturing ports directly to Chattogram & Mongla seaports for both Full Container Load (FCL) and Less Container Load (LCL).',
    features: [
      'Direct container sailings into Chattogram (CTG) Port',
      'LCL cargo consolidation in Guangzhou & Yiwu warehouses',
      'Zero demurrage optimization through fast documentation',
      'Inland bonded transport to Dhaka, Gazipur, and Narayanganj',
    ],
  },
  {
    id: 'hand-carry',
    title: 'Hand Carry Express',
    image: '/assets/images/hand_carry.webp',
    description: 'Dedicated on-board couriers for urgent sample delivery, garment accessories, and critical industrial replacement components with personal accompaniment.',
    features: [
      'Dedicated onboard courier personally escorting consignment',
      'Next-flight-out dispatch from Hong Kong, Guangzhou, Bangkok',
      'Immediate hand-off at Hazrat Shahjalal International Airport',
      'Ideal for urgent buyer samples and pre-production trims',
    ],
  },
  {
    id: 'customs-brokerage',
    title: 'B2B Customs Brokerage',
    image: '/assets/images/custom_agent.webp',
    description: 'Licensed customs brokerage team ensuring 100% compliant classification, valuation, and swift tariff settlement under Bangladesh Customs Act 2023.',
    features: [
      'HS Code classification and precise duty estimation',
      'Pre-arrival document processing for accelerated clearance',
      'Direct liaison with Dhaka Airport Cargo & Kamalapur ICD',
      'Resolution of non-tariff barriers and regulatory permits',
    ],
  },
  {
    id: 'warehousing-fulfillment',
    title: 'Warehousing & 3PL Logistics',
    image: '/assets/images/warehousing.webp',
    description: 'Strategic warehousing in Uttara, Dhaka and major China manufacturing hubs with inventory management, cargo consolidation, and cross-docking services.',
    features: [
      'Strategically positioned hub near Dhaka Airport (DAC)',
      '24/7 CCTV surveillance and secured cargo staging',
      'Barcode sorting, palletization, and repackaging',
      'Nationwide last-mile dispatch network across Bangladesh',
    ],
  },
];

export const ServicesContentEditor: React.FC = () => {
  // Section Header state
  const [headerConfig, setHeaderConfig] = useState<ServicesSectionHeaderConfig>(() => {
    try {
      const stored = localStorage.getItem('sain_services_section_config');
      if (stored) return { ...DEFAULT_SERVICES_HEADER, ...JSON.parse(stored) };
    } catch {}
    return DEFAULT_SERVICES_HEADER;
  });

  // Services Cards list state
  const [cards, setCards] = useState<ServiceCard[]>(() => {
    try {
      const stored = localStorage.getItem('sain_services_content_config');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any) => ({
            id: item.id || `service-${Date.now()}`,
            title: item.title || 'Untitled Service',
            image: item.image || '/assets/images/air_freight.webp',
            description: item.fullDescription || item.description || '',
            features: Array.isArray(item.features) ? item.features : [],
          }));
        }
      }
    } catch {}
    return DEFAULT_SERVICE_CARDS;
  });

  // Active modal / card editor state
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [editingCard, setEditingCard] = useState<ServiceCard | null>(null);
  const [isNewCard, setIsNewCard] = useState(false);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [saved, setSaved] = useState(false);

  // Save changes to localStorage & dispatch live update
  const persistChanges = (updatedCards: ServiceCard[], updatedHeader: ServicesSectionHeaderConfig) => {
    localStorage.setItem('sain_services_content_config', JSON.stringify(updatedCards));
    localStorage.setItem('sain_services_section_config', JSON.stringify(updatedHeader));
    window.dispatchEvent(new Event('sain_services_content_updated'));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    persistChanges(cards, headerConfig);
  };

  const handleAddNewCard = () => {
    const newCard: ServiceCard = {
      id: `service-${Date.now()}`,
      title: 'New Shipping Service',
      image: '/assets/images/air_freight.webp',
      description: 'Enter comprehensive service overview and freight capability details here.',
      features: ['Daily scheduled transit', 'Customs clearance included', 'Doorstep delivery'],
    };
    setEditingCard(newCard);
    setIsNewCard(true);
    setIsEditingCard(true);
  };

  const handleEditCard = (card: ServiceCard) => {
    setEditingCard({ ...card, features: [...card.features] });
    setIsNewCard(false);
    setIsEditingCard(true);
  };

  const handleDeleteCard = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the service card "${title}"?`)) {
      const updated = cards.filter((c) => c.id !== id);
      setCards(updated);
      persistChanges(updated, headerConfig);
    }
  };

  const handleCardImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCard) return;

    if (file.size > 4 * 1024 * 1024) {
      alert('Image file size must be under 4MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditingCard({ ...editingCard, image: reader.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCardImage = () => {
    if (editingCard) {
      setEditingCard({ ...editingCard, image: '' });
    }
  };

  const handleSaveCardModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;

    let updatedList: ServiceCard[];
    if (isNewCard) {
      updatedList = [...cards, editingCard];
    } else {
      updatedList = cards.map((c) => (c.id === editingCard.id ? editingCard : c));
    }

    setCards(updatedList);
    persistChanges(updatedList, headerConfig);
    setIsEditingCard(false);
    setEditingCard(null);
  };

  const handleAddFeatureToCard = () => {
    if (!newFeatureInput.trim() || !editingCard) return;
    setEditingCard({
      ...editingCard,
      features: [...editingCard.features, newFeatureInput.trim()],
    });
    setNewFeatureInput('');
  };

  const handleRemoveFeatureFromCard = (idx: number) => {
    if (!editingCard) return;
    setEditingCard({
      ...editingCard,
      features: editingCard.features.filter((_, i) => i !== idx),
    });
  };

  const handleUpdateFeature = (idx: number, val: string) => {
    if (!editingCard) return;
    const feats = [...editingCard.features];
    feats[idx] = val;
    setEditingCard({ ...editingCard, features: feats });
  };

  const handleResetAllDefaults = () => {
    if (window.confirm('Reset all Services and section header back to defaults?')) {
      setHeaderConfig(DEFAULT_SERVICES_HEADER);
      setCards(DEFAULT_SERVICE_CARDS);
      persistChanges(DEFAULT_SERVICE_CARDS, DEFAULT_SERVICES_HEADER);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#1a6c7a]" />
            <span>Services Catalog & Card Editor</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage service categories, full-bleed thumbnail images, flip-back descriptions, and bullet key points.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold animate-in fade-in">
              <CheckCircle className="w-4 h-4" />
              <span>Catalog Updated Live</span>
            </span>
          )}
          <button
            type="button"
            onClick={handleResetAllDefaults}
            className="text-xs font-semibold px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg transition cursor-pointer"
          >
            Reset Defaults
          </button>
        </div>
      </div>

      {/* Part 1: Section Header Settings */}
      <form onSubmit={handleSaveHeader} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a6c7a]">
            1. Services Section Header
          </h4>
          <button
            type="submit"
            className="px-4 py-1.5 bg-[#1a6c7a] hover:bg-[#145561] text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer"
          >
            Update Header
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Top Badge Text
            </label>
            <input
              type="text"
              value={headerConfig.badge}
              onChange={(e) => setHeaderConfig({ ...headerConfig, badge: e.target.value })}
              className="w-full text-xs font-bold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
              placeholder="Comprehensive Freight Solutions"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Section Title
            </label>
            <input
              type="text"
              value={headerConfig.title}
              onChange={(e) => setHeaderConfig({ ...headerConfig, title: e.target.value })}
              className="w-full text-xs font-bold border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
              placeholder="Tailored Logistics For Global Commerce"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Section Subtitle / Description
          </label>
          <textarea
            rows={2}
            value={headerConfig.description}
            onChange={(e) => setHeaderConfig({ ...headerConfig, description: e.target.value })}
            className="w-full text-xs border border-slate-300 rounded-lg p-2.5 outline-none focus:border-[#1a6c7a] bg-white"
            placeholder="From urgent documents to industrial bulk consignments..."
            required
          />
        </div>
      </form>

      {/* Part 2: Service Cards Management */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Service Cards Catalog ({cards.length})</span>
            </h4>
            <p className="text-xs text-slate-500">
              Each card features a clean image thumbnail on front, and flips to reveal heading, description, and key points.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddNewCard}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#009b4d] hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service Card</span>
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, idx) => (
            <div
              key={card.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail Preview */}
                <div className="relative h-40 bg-slate-900 overflow-hidden">
                  {card.image ? (
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-800 text-xs">
                      <Image className="w-6 h-6 mb-1 text-slate-500" />
                      <span>No image set</span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-md text-amber-400 text-[10px] font-bold rounded">
                    #{idx + 1}
                  </span>
                </div>

                {/* Content details */}
                <div className="p-4 space-y-2">
                  <h5 className="font-bold text-sm text-slate-900 line-clamp-1">{card.title}</h5>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {card.description || 'No description provided.'}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Key Points: <strong>{card.features.length}</strong></span>
                    <span className="text-teal-700 font-semibold">Hover flip active</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleEditCard(card)}
                  className="flex-1 py-1.5 px-3 bg-[#1a6c7a] hover:bg-[#145561] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteCard(card.id, card.title)}
                  className="py-1.5 px-3 border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition cursor-pointer"
                  title="Delete Card"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL / DRAWER: EDIT OR ADD CARD                               */}
      {/* ============================================================== */}
      {isEditingCard && editingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {isNewCard ? 'Add New Service Card' : `Edit "${editingCard.title}"`}
                </h4>
                <p className="text-xs text-slate-500">
                  Configure card title, full-bleed thumbnail image, back description, and key points.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditingCard(false);
                  setEditingCard(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCardModal} className="space-y-5">
              {/* Card Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Card Heading / Service Title
                </label>
                <input
                  type="text"
                  value={editingCard.title}
                  onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                  className="w-full text-sm font-bold border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#1a6c7a]"
                  placeholder="e.g. Air Freight Priority"
                  required
                />
              </div>

              {/* Card Thumbnail Image */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Front Thumbnail Image (Full-bleed presentation)
                  </label>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    No text will overlay the front
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-36 h-24 rounded-xl overflow-hidden border border-slate-300 bg-slate-900 flex items-center justify-center flex-shrink-0">
                    {editingCard.image ? (
                      <img
                        src={editingCard.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-400 text-center px-2">No image</span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1a6c7a] hover:bg-[#145561] text-white text-xs font-bold rounded-lg shadow-xs transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Image File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCardImageUpload}
                          className="hidden"
                        />
                      </label>

                      {editingCard.image && (
                        <button
                          type="button"
                          onClick={handleRemoveCardImage}
                          className="px-3 py-1.5 border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                        >
                          Remove Image
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={editingCard.image}
                      onChange={(e) => setEditingCard({ ...editingCard, image: e.target.value })}
                      placeholder="Or enter image URL (e.g. /assets/images/air_freight.webp)"
                      className="w-full text-xs font-mono border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-[#1a6c7a] bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Card Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Card Description (Shown on back when flipped)
                </label>
                <textarea
                  rows={3}
                  value={editingCard.description}
                  onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })}
                  className="w-full text-xs leading-relaxed border border-slate-300 rounded-xl p-3 outline-none focus:border-[#1a6c7a]"
                  placeholder="Comprehensive service details shown after card flips on hover..."
                  required
                />
              </div>

              {/* Key Points (Features list) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <ListPlus className="w-4 h-4 text-emerald-600" />
                    <span>Key Points & Bullet Features ({editingCard.features.length})</span>
                  </label>
                </div>

                {/* Add new feature input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeatureToCard();
                      }
                    }}
                    placeholder="Type key point and click Add (e.g. Daily flights to Dhaka)"
                    className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-[#1a6c7a] bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeatureToCard}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    Add Point
                  </button>
                </div>

                {/* Existing features list */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {editingCard.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {fIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => handleUpdateFeature(fIdx, e.target.value)}
                        className="flex-1 text-xs border-none outline-none text-slate-800 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeatureFromCard(fIdx)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Remove point"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {editingCard.features.length === 0 && (
                    <p className="text-xs text-slate-400 italic py-2 text-center">
                      No key points added yet. Add at least 1-3 key points.
                    </p>
                  )}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingCard(false);
                    setEditingCard(null);
                  }}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#009b4d] hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isNewCard ? 'Add Card to Catalog' : 'Save Card Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
