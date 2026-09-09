import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  X,
  Search,
  Train,
  GraduationCap,
  Building,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';

const AREA_DATA = [
  {
    id: 'bashundhara',
    name: 'Bashundhara R/A',
    city: 'Dhaka',
    category: 'Student & Family Hub',
    avgRent2BHK: '৳22,000 – ৳35,000',
    avgRent3BHK: '৳38,000 – ৳65,000',
    mrtConnected: false,
    metroDistance: '5-10 mins to Kuril / 300 Feet',
    safetyRating: '4.8/5.0',
    vibe: 'Modern, Planned & Serene',
    universities: ['North South University (NSU)', 'Independent University (IUB)', 'AIUB', 'BRACU (nearby)'],
    hospitals: ['Evercare Hospital', 'Bashundhara Eye Hospital'],
    highlights: ['Strict gate security 24/7', 'Wide tree-lined roads', 'Reliable power & water', 'Walk to top universities'],
    popularWith: 'University Students, Expats, Modern Families',
  },
  {
    id: 'dhanmondi',
    name: 'Dhanmondi',
    city: 'Dhaka',
    category: 'Cultural & Academic Hub',
    avgRent2BHK: '৳28,000 – ৳45,000',
    avgRent3BHK: '৳48,000 – ৳85,000',
    mrtConnected: false,
    metroDistance: '10 mins to Karwan Bazar MRT',
    safetyRating: '4.7/5.0',
    vibe: 'Vibrant, Tree-lined & Lakes',
    universities: ['Dhaka University (DU - nearby)', 'UAP', 'State University', 'Green University'],
    hospitals: ['Square Hospital', 'Bangladesh Medical', 'Ibn Sina', 'Labaid Specialized'],
    highlights: ['Dhanmondi Lake & Rabindra Sarobar', 'Top English-medium schools', 'Art galleries & rooftop cafes', 'Central location'],
    popularWith: 'Established Families, Doctors, Scholars',
  },
  {
    id: 'gulshan',
    name: 'Gulshan 1 & 2',
    city: 'Dhaka',
    category: 'Diplomatic & Luxury Zone',
    avgRent2BHK: '৳60,000 – ৳1,20,000',
    avgRent3BHK: '৳1,10,000 – ৳2,80,000',
    mrtConnected: false,
    metroDistance: '15 mins to Mohakhali / MRT',
    safetyRating: '4.9/5.0',
    vibe: 'Cosmopolitan, High-Security & Luxury',
    universities: ['Canadian University', 'Presidency University'],
    hospitals: ['United Hospital', 'Praava Health', 'Cure Medical'],
    highlights: ['Embassies & High Commissions', 'High-end fine dining & boutique shopping', 'Lake parks', '100% generator backup buildings'],
    popularWith: 'Diplomats, Multinational Executives, High-Net-Worth Families',
  },
  {
    id: 'banani',
    name: 'Banani',
    city: 'Dhaka',
    category: 'Trendy & Upscale Commercial',
    avgRent2BHK: '৳40,000 – ৳70,000',
    avgRent3BHK: '৳75,000 – ৳1,40,000',
    mrtConnected: false,
    metroDistance: '10 mins to Banani Railway / Mohakhali',
    safetyRating: '4.8/5.0',
    vibe: 'Trendy, Cafe Culture & Corporate',
    universities: ['Primeasia University', 'Northern University'],
    hospitals: ['Banani Clinic', 'Farazy Hospital'],
    highlights: ['Road 11 food & shopping strip', 'Direct Kamal Ataturk Avenue access', 'Upscale residential blocks'],
    popularWith: 'Young Corporate Professionals, Tech Founders, Families',
  },
  {
    id: 'uttara',
    name: 'Uttara (Sectors 1-18)',
    city: 'Dhaka',
    category: 'Metro Connected Mega Township',
    avgRent2BHK: '৳18,000 – ৳32,000',
    avgRent3BHK: '৳32,000 – ৳55,000',
    mrtConnected: true,
    metroDistance: 'Direct MRT Line-6 Stations (North, Center, South)',
    safetyRating: '4.6/5.0',
    vibe: 'Organized, Self-Sustained & Airy',
    universities: ['IUBAT', 'Uttara University', 'Bishwo Shahitto Kendro'],
    hospitals: ['Kuwait Bangladesh Friendship Hospital', 'Radical Hospital', 'Shin Shin Japan Hospital'],
    highlights: ['Direct Metro Rail to Motijheel in 35 mins', '5 mins to Hazrat Shahjalal International Airport', 'Sector parks & lakes'],
    popularWith: 'Airport Personnel, Corporate Commuters, Large Families',
  },
  {
    id: 'mirpur',
    name: 'Mirpur (DOHS & Sec 1-14)',
    city: 'Dhaka',
    category: 'Budget-Friendly & Metro Connected',
    avgRent2BHK: '৳14,000 – ৳24,000',
    avgRent3BHK: '৳24,000 – ৳40,000',
    mrtConnected: true,
    metroDistance: 'MRT Stations: Mirpur 10, 11, 12, Kazipara, Shewrapara',
    safetyRating: '4.4/5.0 (4.9 in Mirpur DOHS)',
    vibe: 'Bustling, Accessible & Economical',
    universities: ['BUP (Mirpur Cantonment)', 'MIST', 'Dhaka Commerce College'],
    hospitals: ['National Heart Foundation', 'BNSB Eye Hospital'],
    highlights: ['Fastest commute via Metro Rail', 'Sher-e-Bangla National Cricket Stadium', 'National Botanical Garden & Zoo'],
    popularWith: 'Budget Conscious Families, Office Commuters, Students',
  },
  {
    id: 'mohammadpur',
    name: 'Mohammadpur & Lalmatia',
    city: 'Dhaka',
    category: 'Connected & Residential',
    avgRent2BHK: '৳18,000 – ৳30,000',
    avgRent3BHK: '৳32,000 – ৳55,000',
    mrtConnected: false,
    metroDistance: '12 mins to Farmgate MRT',
    safetyRating: '4.5/5.0',
    vibe: 'Traditional, Accessible & Community-Driven',
    universities: ['Dhaka College (nearby)', 'St. Joseph Higher Secondary'],
    hospitals: ['Shaheed Suhrawardy Medical College Hospital', 'Al-Markazul Islami'],
    highlights: ['Lalmatia block-by-block quiet zoning', 'Direct access to Manik Mia Avenue & Dhanmondi', 'Rich food heritage (Bihari Camp Kebabs)'],
    popularWith: 'Educators, Central Dhaka Employees, Families',
  },
  {
    id: 'agrabad',
    name: 'Agrabad & Nasirabad',
    city: 'Chittagong',
    category: 'Port City Commercial & Living',
    avgRent2BHK: '৳16,000 – ৳28,000',
    avgRent3BHK: '৳28,000 – ৳50,000',
    mrtConnected: false,
    metroDistance: 'Quick access to Port Access Road & Airport',
    safetyRating: '4.6/5.0',
    vibe: 'Port City Business Center & Modern Flats',
    universities: ['Chittagong University (CU shuttle route)', 'Premier University'],
    hospitals: ['Chattogram Medical College Hospital', 'Chevron Clinical Lab'],
    highlights: ['Chittagong commercial and banking district', 'World Trade Center Chattogram', 'Proximity to Karnaphuli Tunnel'],
    popularWith: 'Shipping Executives, Bankers, Commercial Families',
  },
];

const AreaGuideModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedCity, setSelectedCity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArea, setActiveArea] = useState(AREA_DATA[0]);

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

  const filteredAreas = AREA_DATA.filter((area) => {
    const matchCity = selectedCity === 'All' || area.city === selectedCity;
    const matchQuery =
      area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.vibe.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCity && matchQuery;
  });

  const handleBrowseArea = (areaName) => {
    onClose();
    toast.success(`Filtering listings in ${areaName}`);
    navigate(`/search?search=${encodeURIComponent(areaName)}`);
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
          aria-labelledby="area-guide-title"
          className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-yellow-400/20 text-yellow-400 rounded-2xl border border-yellow-400/30">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h2 id="area-guide-title" className="text-xl font-bold flex items-center gap-2">
                  Bangladesh Neighborhood & Living Guide
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    2026 Insights
                  </span>
                </h2>
                <p className="text-xs text-blue-200">
                  Explore rent ranges, Metro Rail connectivity, safety ratings, and lifestyle per area
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close neighborhood guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & City Filter Bar */}
          <div className="p-4 bg-gray-50 border-b border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* City Tabs */}
            <div className="flex items-center gap-1.5 bg-gray-200/70 p-1 rounded-xl w-full sm:w-auto">
              {['All', 'Dhaka', 'Chittagong'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedCity === city
                      ? 'bg-white text-primary-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Search within areas */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search neighborhood..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>

          {/* Master Detail Layout */}
          <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
            {/* Left Area List */}
            <div className="md:col-span-5 border-r border-gray-100 overflow-y-auto p-3 space-y-2 bg-gray-50/50 max-h-[40vh] md:max-h-none">
              {filteredAreas.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-xs">
                  No neighborhoods match your search criteria.
                </div>
              ) : (
                filteredAreas.map((area) => {
                  const isSelected = activeArea?.id === area.id;
                  return (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => setActiveArea(area)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-white border-primary-500 shadow-md ring-1 ring-primary-500'
                          : 'bg-white/80 border-gray-200 hover:border-gray-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-sm text-gray-900">{area.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                          {area.city}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2 font-medium">{area.category}</p>

                      <div className="flex items-center justify-between text-[11px] text-gray-600">
                        <span className="font-semibold text-primary-700">2BHK: {area.avgRent2BHK}</span>
                        {area.mrtConnected && (
                          <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                            <Train className="w-3 h-3" /> MRT
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Right Detailed View */}
            <div className="md:col-span-7 overflow-y-auto p-6 space-y-6 bg-white">
              {activeArea && (
                <>
                  {/* Top Area Banner */}
                  <div className="bg-gradient-to-br from-primary-900 via-indigo-950 to-blue-900 text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-yellow-300">
                          {activeArea.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs bg-white/10 px-2.5 py-1 rounded-full font-bold">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          Safety: {activeArea.safetyRating}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black">{activeArea.name}</h3>
                      <p className="text-xs text-blue-200 mt-1">{activeArea.vibe}</p>
                    </div>
                  </div>

                  {/* Rent Price Benchmarks */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-primary-600" />
                      Estimated Monthly Rent Benchmarks (2026)
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5">
                        <span className="text-xs text-gray-500 font-medium block mb-1">Typical 2-Bedroom (2BHK)</span>
                        <span className="text-base sm:text-lg font-black text-gray-900">{activeArea.avgRent2BHK}</span>
                        <span className="text-[11px] text-gray-400 block mt-0.5">800 – 1,100 sq ft</span>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5">
                        <span className="text-xs text-gray-500 font-medium block mb-1">Typical 3-Bedroom (3BHK)</span>
                        <span className="text-base sm:text-lg font-black text-gray-900">{activeArea.avgRent3BHK}</span>
                        <span className="text-[11px] text-gray-400 block mt-0.5">1,250 – 1,900 sq ft</span>
                      </div>
                    </div>
                  </div>

                  {/* Metro & Commute Info */}
                  <div className="bg-blue-50/70 border border-blue-200/70 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 text-blue-700 rounded-xl flex-shrink-0">
                        <Train className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-blue-950 uppercase tracking-wide">
                          Metro Rail (MRT) & Commute Access
                        </h5>
                        <p className="text-xs text-blue-900 font-semibold mt-0.5">{activeArea.metroDistance}</p>
                        <p className="text-[11px] text-blue-700 mt-1">
                          Ideal for commuters seeking fast travel avoiding Dhaka peak rush-hour traffic.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Key Highlights & Amenities */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Neighborhood Features & Infrastructure
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeArea.highlights.map((item) => (
                        <div key={item} className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education & Healthcare */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-2xl p-3.5">
                      <h5 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 mb-2">
                        <GraduationCap className="w-4 h-4 text-indigo-600" />
                        Universities & Colleges
                      </h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {activeArea.universities.map((uni) => (
                          <li key={uni} className="line-clamp-1">• {uni}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="border border-gray-200 rounded-2xl p-3.5">
                      <h5 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 mb-2">
                        <Building className="w-4 h-4 text-emerald-600" />
                        Top Hospitals & Clinics
                      </h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {activeArea.hospitals.map((hosp) => (
                          <li key={hosp} className="line-clamp-1">• {hosp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Direct Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleBrowseArea(activeArea.name)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all transform hover:scale-[1.01]"
                    >
                      <span>Browse Available Properties in {activeArea.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AreaGuideModal;
