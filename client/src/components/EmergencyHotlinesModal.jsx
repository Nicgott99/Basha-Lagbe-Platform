import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhoneCall,
  X,
  Search,
  Zap,
  Flame,
  Droplets,
  ShieldAlert,
  Building,
  Phone,
  Copy,
  Check,
  AlertTriangle,
  HeartHandshake,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';

const HOTLINES_DATA = [
  {
    id: 'h1',
    name: 'National Emergency Service (Police, Fire, Ambulance)',
    number: '999',
    category: 'Emergency',
    badge: 'Toll Free • 24/7',
    description: 'Instant dispatch for emergency police assistance, fire brigade, and medical ambulance across Bangladesh.',
    icon: ShieldAlert,
    color: 'text-red-600 bg-red-50 border-red-200',
  },
  {
    id: 'h2',
    name: 'DESCO Electricity Emergency Hotline (Dhaka North)',
    number: '16120',
    category: 'Electricity',
    badge: '24/7 Call Center',
    description: 'Emergency breakdown, prepaid meter issues, transformer faults, and power outages in Dhaka North (Uttara, Mirpur, Gulshan, Banani, Bashundhara).',
    icon: Zap,
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  },
  {
    id: 'h3',
    name: 'DPDC Electricity Emergency Hotline (Dhaka South)',
    number: '16116',
    category: 'Electricity',
    badge: '24/7 Call Center',
    description: 'Power disruption, feeder line complaints, and smart meter support in Dhaka South & Central (Dhanmondi, Mohammadpur, Motijheel, Old Dhaka).',
    icon: Zap,
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  },
  {
    id: 'h4',
    name: 'Dhaka WASA Water & Sewerage Hotline',
    number: '16162',
    category: 'Water',
    badge: 'Dhaka Metropolitan',
    description: 'Report water supply disruption, water contamination, sewer blockages, and deep tubewell emergencies.',
    icon: Droplets,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  {
    id: 'h5',
    name: 'Titas Gas Transmission & Distribution Emergency',
    number: '16496',
    category: 'Gas',
    badge: 'Gas Leak Emergency',
    description: 'URGENT: Report gas pipeline leaks, low pressure, meter fires, and smell of gas immediately.',
    icon: Flame,
    color: 'text-orange-600 bg-orange-50 border-orange-200',
  },
  {
    id: 'h6',
    name: 'Fire Service & Civil Defence Central Control',
    number: '102',
    category: 'Emergency',
    badge: 'Central Fire Control',
    description: 'Direct line to Bangladesh Fire Service headquarters for fire breakout and building rescue emergencies.',
    icon: AlertTriangle,
    color: 'text-red-600 bg-red-50 border-red-200',
  },
  {
    id: 'h7',
    name: 'National Legal Aid Services Hotline',
    number: '16430',
    category: 'Legal',
    badge: 'Govt. Legal Aid',
    description: 'Free legal counseling for tenancy disputes, illegal eviction threats, and landlord-tenant rights.',
    icon: HeartHandshake,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
  },
  {
    id: 'h8',
    name: 'Citizen Helpline & Government Services',
    number: '333',
    category: 'Civic',
    badge: 'Govt. 333',
    description: 'Inquire about civic services, complaints, local government administrative assistance, and consumer rights.',
    icon: Building,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    id: 'h9',
    name: 'NESCO Electricity Helpline (Rajshahi & Rangpur)',
    number: '16603',
    category: 'Electricity',
    badge: 'Northern Zones',
    description: 'Customer service and emergency power failure reporting for Northern Bangladesh.',
    icon: Zap,
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  },
  {
    id: 'h10',
    name: 'Dhaka North City Corporation (DNCC Hotline)',
    number: '16106',
    category: 'Civic',
    badge: 'City Corp',
    description: 'Report waste disposal issues, clogged road drains, street light failures, and municipal problems.',
    icon: Building,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
];

const EmergencyHotlinesModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = ['All', 'Emergency', 'Electricity', 'Water', 'Gas', 'Legal', 'Civic'];

  const filteredHotlines = HOTLINES_DATA.filter((item) => {
    const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.number.includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  const handleCopyNumber = (item) => {
    navigator.clipboard.writeText(item.number);
    setCopiedId(item.id);
    toast.success(`Copied ${item.name} (${item.number}) to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="emergency-hotlines-title"
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-red-900 via-rose-900 to-indigo-950 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-yellow-400/20 text-yellow-400 rounded-2xl border border-yellow-400/30">
                <PhoneCall className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 id="emergency-hotlines-title" className="text-xl font-bold flex items-center gap-2">
                  Emergency & Utility Hotlines Directory
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                    Bangladesh 24/7
                  </span>
                </h2>
                <p className="text-xs text-rose-200">
                  Verified helpline numbers for power, gas, WASA water, police, fire & civic emergencies
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-rose-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close hotline directory"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="p-4 bg-gray-50 border-b border-gray-200/80 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hotlines (e.g. DESCO, 999, Titas, WASA, Water, Gas)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 outline-none shadow-sm"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full border font-semibold flex-shrink-0 transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Hotlines Grid */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {filteredHotlines.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                No hotline matches found for "{searchQuery}".
              </div>
            ) : (
              filteredHotlines.map((item) => {
                const ItemIcon = item.icon;
                const isCopied = copiedId === item.id;
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-3 rounded-2xl border flex-shrink-0 ${item.color}`}>
                        <ItemIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed max-w-lg">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleCopyNumber(item)}
                        className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors"
                        title="Copy Hotline Number"
                        aria-label={`Copy ${item.name} number`}
                      >
                        {isCopied ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <a
                        href={`tel:${item.number}`}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all transform hover:scale-[1.02]"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call {item.number}</span>
                      </a>
                    </div>
                  </div>
                );
              })
            )}

            {/* Quick Safety Alert Box */}
            <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Gas Leak Safety Protocol:</span>
              </div>
              <p className="text-amber-800">
                If you detect a smell of gas in your flat, do NOT operate electrical switches, matches, or stoves. Open all windows immediately and call Titas Gas at <strong>16496</strong> or National Emergency at <strong>999</strong>.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>All hotline services verified by Basha Lagbe Bangladesh (2026).</span>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold shadow transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EmergencyHotlinesModal;
