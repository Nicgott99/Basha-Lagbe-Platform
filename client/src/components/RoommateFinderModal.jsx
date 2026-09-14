import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  X,
  Search,
  Bed,
  Bath,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  PlusCircle,
  ArrowRight,
  Check,
  Coffee,
  Wifi,
  Utensils,
  BookOpen,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';

const formatBDT = (val) => `৳${Math.round(val || 0).toLocaleString('en-BD')}`;

const SAMPLE_ROOMMATES = [
  {
    id: 'sublet-1',
    title: 'Master Bed Shared for Student in Bashundhara R/A',
    area: 'Bashundhara R/A (Block C)',
    target: 'NSU / IUB / AIUB / BRACU Students',
    rentPerPerson: 7500,
    roomType: 'Master Bed with Attached Bath & Balcony',
    gender: 'Male',
    amenities: ['High-Speed WiFi', 'Cook / Maid Service', 'Fridge & Filter Water', 'Generator Backup'],
    lifestyle: ['Non-Smoker', 'Study Friendly', 'Clean & Organized'],
    contact: '+880 17 1122 3344',
  },
  {
    id: 'sublet-2',
    title: 'Single Private Room for Female Student / Job Holder',
    area: 'Dhanmondi (Road 8/A)',
    target: 'Female Students & Working Professionals',
    rentPerPerson: 11000,
    roomType: 'Single Private Room',
    gender: 'Female',
    amenities: ['WiFi', 'Washing Machine', '24/7 Security Lift', 'Gas Line'],
    lifestyle: ['Working Professional', 'Quiet Environment', 'No Late Night Noise'],
    contact: '+880 18 9988 7766',
  },
  {
    id: 'sublet-3',
    title: 'Bachelor Seat in 3-BHK Flat near Metro Station',
    area: 'Mirpur-10 (2 mins from MRT)',
    target: 'Corporate Commuters & Job Holders',
    rentPerPerson: 5500,
    roomType: 'Shared Double Bed Room',
    gender: 'Male',
    amenities: ['Direct MRT Access', 'Meal System', 'WiFi', 'IPS Backup'],
    lifestyle: ['Early Office Commuter', 'Friendly & Cooperative'],
    contact: '+880 19 3344 5566',
  },
  {
    id: 'sublet-4',
    title: 'Furnished Single Room with AC in Banani',
    area: 'Banani (Road 11 vicinity)',
    target: 'Tech Founders & Young Executives',
    rentPerPerson: 16000,
    roomType: 'Furnished Deluxe Single Room',
    gender: 'Any',
    amenities: ['AC', 'Daily Housekeeping', 'High-Speed Fiber WiFi', 'Smart TV'],
    lifestyle: ['Tech Professional', 'Respects Privacy'],
    contact: '+880 16 5566 7788',
  },
];

const RoommateFinderModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'post'
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All');
  const [maxBudget, setMaxBudget] = useState(15000);

  // Post sublet form state
  const [postForm, setPostForm] = useState({
    title: '',
    area: 'Bashundhara R/A',
    rentPerPerson: '',
    roomType: 'Single Private Room',
    gender: 'Male',
    phone: '',
    notes: '',
  });

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

  const filteredListings = SAMPLE_ROOMMATES.filter((item) => {
    const matchGender = selectedGender === 'All' || item.gender === selectedGender || item.gender === 'Any';
    const matchArea = selectedArea === 'All' || item.area.toLowerCase().includes(selectedArea.toLowerCase());
    const matchBudget = item.rentPerPerson <= maxBudget;
    return matchGender && matchArea && matchBudget;
  });

  const handlePostSublet = (e) => {
    e.preventDefault();
    if (!postForm.title || !postForm.rentPerPerson || !postForm.phone) {
      toast.error('Please fill out required details and contact number');
      return;
    }

    try {
      const existing = JSON.parse(localStorage.getItem('basha_lagbe_sublets') || '[]');
      localStorage.setItem('basha_lagbe_sublets', JSON.stringify([postForm, ...existing]));
    } catch {
      // Local storage fallback
    }

    toast.success('Roommate / Sublet listing published successfully!');
    setActiveTab('browse');
  };

  const handleSearchAllRooms = () => {
    onClose();
    toast.success('Browsing room and sublet listings');
    navigate('/search?propertyType=Room');
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
          aria-labelledby="roommate-modal-title"
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-yellow-400/20 text-yellow-400 rounded-2xl border border-yellow-400/30">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 id="roommate-modal-title" className="text-xl font-bold flex items-center gap-2">
                  Sublet & Roommate Match Hub
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Student & Bachelor Friendly
                  </span>
                </h2>
                <p className="text-xs text-blue-200">
                  Find verified room shares, student sublets & flatmates near universities and tech hubs
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close roommate hub"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Tabs */}
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'browse'
                    ? 'bg-white text-primary-900 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Search className="w-4 h-4 text-primary-600" />
                <span>Find Rooms / Flatmates</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('post')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'post'
                    ? 'bg-white text-primary-900 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <span>Post Sublet Requirement</span>
              </button>
            </div>

            {activeTab === 'browse' && (
              <div className="flex items-center gap-2 text-xs w-full sm:w-auto overflow-x-auto">
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-700 outline-none"
                >
                  <option value="All">All Genders</option>
                  <option value="Male">Male / Boys</option>
                  <option value="Female">Female / Girls</option>
                </select>

                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-700 outline-none"
                >
                  <option value="All">All Locations</option>
                  <option value="Bashundhara">Bashundhara (NSU/IUB/BRACU)</option>
                  <option value="Dhanmondi">Dhanmondi (DU Area)</option>
                  <option value="Mirpur">Mirpur (MRT Access)</option>
                  <option value="Banani">Banani / Gulshan</option>
                </select>
              </div>
            )}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'browse' ? (
              <>
                {/* University Banner */}
                <div className="bg-gradient-to-r from-primary-900 to-indigo-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-yellow-400/20 text-yellow-400 rounded-xl">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-300">
                        Student University Clusters
                      </h4>
                      <p className="text-xs text-blue-200">
                        Verified flat-shares walking distance to BRACU, NSU, IUB, DU, AIUB & Metro stations
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSearchAllRooms}
                    className="hidden sm:inline-flex items-center gap-1.5 bg-white text-primary-900 font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-yellow-400 hover:text-gray-900 transition-colors"
                  >
                    <span>All Rooms</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Sublet Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredListings.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-2xl p-4 bg-white hover:border-primary-400 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                            {item.gender === 'Male' ? '👦 Male Sublet' : item.gender === 'Female' ? '👧 Female Sublet' : '👤 Any'}
                          </span>
                          <span className="text-base font-black text-primary-600">
                            {formatBDT(item.rentPerPerson)}
                            <span className="text-xs font-normal text-gray-500"> / month</span>
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-xs text-emerald-700 font-semibold mb-2 flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5" /> {item.target}
                        </p>

                        <div className="text-xs text-gray-600 space-y-1 mb-3 bg-gray-50 p-2.5 rounded-xl">
                          <div className="flex items-center gap-1.5">
                            <Bed className="w-3.5 h-3.5 text-primary-500" />
                            <span>{item.roomType}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {item.amenities.map((amenity) => (
                              <span key={amenity} className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded-md text-gray-700">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <a
                          href={`tel:${item.contact}`}
                          className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-sm transition-colors"
                        >
                          <span>Call Landmate</span>
                        </a>
                        <span className="text-[11px] text-gray-400">Verified Listing</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Post Sublet Form */
              <form onSubmit={handlePostSublet} className="space-y-4 max-w-xl mx-auto">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Post an Available Room or Seat</h3>
                  <p className="text-xs text-gray-500">
                    Find responsible, verified flatmates quickly without paying broker fees.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Listing Headline *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 Bed Available in 3-BHK Flat for NSU Student"
                    value={postForm.title}
                    onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Area / Location *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bashundhara Block D"
                      value={postForm.area}
                      onChange={(e) => setPostForm({ ...postForm, area: e.target.value })}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Rent per Person (৳) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 6500"
                      value={postForm.rentPerPerson}
                      onChange={(e) => setPostForm({ ...postForm, rentPerPerson: e.target.value })}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Room Setup</label>
                    <select
                      value={postForm.roomType}
                      onChange={(e) => setPostForm({ ...postForm, roomType: e.target.value })}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      <option value="Single Private Room">Single Private Room</option>
                      <option value="Master Bed Shared">Master Bed Shared</option>
                      <option value="Double Bed Shared">Double Bed Shared</option>
                      <option value="Sublet Room with Bath">Sublet Room with Bath</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Preferred Tenant</label>
                    <select
                      value={postForm.gender}
                      onChange={(e) => setPostForm({ ...postForm, gender: e.target.value })}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      <option value="Male">Male / Boys</option>
                      <option value="Female">Female / Girls</option>
                      <option value="Any">Any Suitable Person</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Your Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+880 17..."
                    value={postForm.phone}
                    onChange={(e) => setPostForm({ ...postForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Preferences & House Rules</label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Non-smoker, quiet study environment, meal system available..."
                    value={postForm.notes}
                    onChange={(e) => setPostForm({ ...postForm, notes: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all"
                >
                  Publish Roommate / Sublet Listing
                </button>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Direct tenant-to-tenant sublet matching • 100% Free</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RoommateFinderModal;
