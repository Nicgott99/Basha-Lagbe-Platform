import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  User,
  Phone,
  Mail,
  Users,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  Building,
  MapPin,
  Send,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';

const ScheduleTourModal = ({ isOpen, onClose, property, landlord }) => {
  const navigate = useNavigate();
  const toast = useToast();

  // Next 7 days formatted for quick date selection
  const getUpcomingDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({
        fullDate: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
      });
    }
    return dates;
  };

  const upcomingDates = getUpcomingDates();

  const [tourType, setTourType] = useState('in_person'); // 'in_person' | 'video'
  const [selectedDate, setSelectedDate] = useState(upcomingDates[0]?.fullDate || '');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('11:00 AM – 01:00 PM (Morning)');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    occupants: '2-3 Persons (Family)',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      toast.error('Please provide your name and phone number');
      return;
    }

    setIsSubmitting(true);

    const tourBooking = {
      id: `tour_${Date.now()}`,
      propertyId: property?._id,
      propertyTitle: property?.title || property?.name || 'Property',
      tourType,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      landlordName: landlord?.fullName || 'Property Owner',
      landlordPhone: landlord?.mobileNumber || property?.ownerPhone || '+880 17 1234 5678',
      ...formData,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('basha_lagbe_tours') || '[]');
      localStorage.setItem('basha_lagbe_tours', JSON.stringify([tourBooking, ...existing]));
    } catch {
      // Local storage fallback
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      toast.success('Viewing request confirmed! Landlord notified.');
      navigate('/thank-you?type=tour');
    }, 600);
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
          aria-labelledby="schedule-tour-title"
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-yellow-400/20 text-yellow-400 rounded-2xl border border-yellow-400/30">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 id="schedule-tour-title" className="text-xl font-bold flex items-center gap-2">
                  Schedule Property Viewing
                </h2>
                <p className="text-xs text-blue-200">
                  {property?.title || property?.name || 'Selected Rental Home'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close scheduling modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Tour Type Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Select Tour Experience
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTourType('in_person')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                    tourType === 'in_person'
                      ? 'bg-primary-50/80 border-primary-500 shadow-sm ring-1 ring-primary-500'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${tourType === 'in_person' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-gray-900 block">In-Person Viewing</span>
                    <span className="text-[11px] text-gray-500">Visit physical property</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTourType('video')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                    tourType === 'video'
                      ? 'bg-primary-50/80 border-primary-500 shadow-sm ring-1 ring-primary-500'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${tourType === 'video' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-gray-900 block">Live Video Tour</span>
                    <span className="text-[11px] text-gray-500">WhatsApp / Google Meet</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Date Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Preferred Inspection Date
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {upcomingDates.map((item) => {
                  const isSelected = selectedDate === item.fullDate;
                  return (
                    <button
                      key={item.fullDate}
                      type="button"
                      onClick={() => setSelectedDate(item.fullDate)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-primary-600 text-white border-primary-600 shadow-md scale-105'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className="block text-[10px] uppercase font-semibold opacity-80">{item.dayName}</span>
                      <span className="block text-base font-black my-0.5">{item.dayNum}</span>
                      <span className="block text-[10px] font-medium opacity-80">{item.month}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Preferred Time Slot
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  '10:00 AM – 12:00 PM (Morning)',
                  '02:00 PM – 04:00 PM (Afternoon)',
                  '05:00 PM – 07:00 PM (Evening)',
                ].map((slot) => {
                  const isSelected = selectedTimeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'bg-primary-50 text-primary-900 border-primary-500 ring-1 ring-primary-500'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-primary-600' : 'text-gray-400'}`} />
                      <span>{slot}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Visitor Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Your Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hasibullah Khan"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Mobile / WhatsApp Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+880 17..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Number of Occupants</label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={formData.occupants}
                      onChange={(e) => setFormData({ ...formData, occupants: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      <option value="Single (Bachelor)">Single (Bachelor)</option>
                      <option value="2-3 Persons (Small Family)">2-3 Persons (Small Family)</option>
                      <option value="4+ Persons (Large Family)">4+ Persons (Large Family)</option>
                      <option value="Corporate / Sublet">Corporate / Sublet</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Special Notes or Questions for the Landlord (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Asking about car parking space, gas line availability, move-in flexibility..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>

            {/* Footer Submit */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
              <span className="text-xs text-gray-500">
                100% Free • No Brokerage Fee Guarantee
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Confirming...</span>
                ) : (
                  <>
                    <span>Confirm Viewing Appointment</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ScheduleTourModal;
