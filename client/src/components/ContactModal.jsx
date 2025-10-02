import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  ClockIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useToast } from '../hooks/useToast';

export default function ContactModal({ isOpen, onClose, property, landlord }) {
  const { currentUser } = useSelector((state) => state.user);
  const toast = useToast();

  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    contactMethod: 'email',
    phoneNumber: '',
    preferredTime: '',
    moveInDate: '',
    budgetRange: '',
    questions: []
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  // Initialize form with property-specific subject
  useEffect(() => {
    if (property && isOpen) {
      setFormData(prev => ({
        ...prev,
        subject: `Inquiry about ${property.name || property.title || 'Property'}`,
        message: `Hi ${landlord?.username || 'there'},\n\nI'm interested in your property listing and would like to know more details. Please let me know if it's still available.\n\nThank you!`
      }));
    }
  }, [property, landlord, isOpen]);

  const commonQuestions = [
    'Is the property still available?',
    'Can I schedule a viewing?',
    'Are pets allowed?',
    'What utilities are included?',
    'Is parking available?',
    'What is the lease duration?',
    'Are there any additional fees?',
    'What is the neighborhood like?'
  ];

  const contactMethods = [
    { value: 'email', label: 'Email', icon: EnvelopeIcon },
    { value: 'phone', label: 'Phone Call', icon: PhoneIcon },
    { value: 'both', label: 'Both Email & Phone', icon: UserIcon }
  ];

  const preferredTimes = [
    'Morning (9 AM - 12 PM)',
    'Afternoon (12 PM - 5 PM)',
    'Evening (5 PM - 8 PM)',
    'Weekends only',
    'Flexible'
  ];

  const budgetRanges = [
    'Under ৳20,000',
    '৳20,000 - ৳30,000',
    '৳30,000 - ৳50,000',
    '৳50,000 - ৳70,000',
    '৳70,000 - ৳100,000',
    'Above ৳100,000'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleQuestionToggle = (question) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.includes(question)
        ? prev.questions.filter(q => q !== question)
        : [...prev.questions, question]
    }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    if (formData.contactMethod === 'phone' || formData.contactMethod === 'both') {
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Phone number is required for phone contact';
      } else if (!/^[\+]?[0-9\-\(\)\s]+$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please sign in to contact the landlord');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/server/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          listingId: property._id,
          landlordId: landlord._id,
          ...formData
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Your inquiry has been sent successfully!');
        onClose();
        
        setFormData({
          subject: '',
          message: '',
          contactMethod: 'email',
          phoneNumber: '',
          preferredTime: '',
          moveInDate: '',
          budgetRange: '',
          questions: []
        });
        setStep(1);
      } else {
        toast.error(data.message || 'Failed to send inquiry');
      }
    } catch (error) {
      console.error('Error sending inquiry:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setStep(1);
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <EnvelopeIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Contact Landlord
                  </h3>
                  <p className="text-sm text-gray-600">
                    Send an inquiry about {property?.name || property?.title}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={loading}
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Property Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-4">
                {property?.imageUrls?.[0] && (
                  <img
                    src={property.imageUrls[0]}
                    alt={property.name || property.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-medium text-gray-900 truncate">
                    {property?.name || property?.title}
                  </h4>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {property?.address}
                  </div>
                  <div className="flex items-center mt-1 text-sm font-semibold text-green-600">
                    <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                    ৳{property?.regularPrice?.toLocaleString()}/month
                  </div>
                </div>
              </div>
            </div>

            {/* Landlord Info */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {landlord?.avatar ? (
                    <img
                      src={landlord.avatar}
                      alt={landlord.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-gray-600" />
                    </div>
                  )}
                </div>
                <div>
                  <h5 className="text-lg font-medium text-gray-900">
                    {landlord?.username}
                  </h5>
                  <p className="text-sm text-gray-600">Property Owner</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.subject ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Inquiry about your property listing"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.message ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Write your message here..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Contact Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Preferred Contact Method
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {contactMethods.map((method) => {
                        const IconComponent = method.icon;
                        return (
                          <label
                            key={method.value}
                            className={`relative flex items-center justify-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                              formData.contactMethod === method.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="contactMethod"
                              value={method.value}
                              checked={formData.contactMethod === method.value}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div className="flex items-center">
                              <IconComponent className="h-5 w-5 mr-2 text-gray-600" />
                              <span className="text-sm font-medium text-gray-900">
                                {method.label}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Phone Number (conditional) */}
                  {(formData.contactMethod === 'phone' || formData.contactMethod === 'both') && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="+880 1XXX-XXXXXX"
                        />
                      </div>
                      {errors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                          {errors.phoneNumber}
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      Next Step
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Preferred Contact Time */}
                  <div>
                    <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Contact Time
                    </label>
                    <div className="relative">
                      <ClockIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <select
                        id="preferredTime"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select preferred time</option>
                        {preferredTimes.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Move-in Date */}
                  <div>
                    <label htmlFor="moveInDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Move-in Date
                    </label>
                    <div className="relative">
                      <CalendarDaysIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        id="moveInDate"
                        name="moveInDate"
                        value={formData.moveInDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Budget Range */}
                  <div>
                    <label htmlFor="budgetRange" className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <div className="relative">
                      <CurrencyDollarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <select
                        id="budgetRange"
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select budget range</option>
                        {budgetRanges.map((range) => (
                          <option key={range} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Common Questions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Additional Questions (Optional)
                    </label>
                    <div className="space-y-2">
                      {commonQuestions.map((question) => (
                        <label
                          key={question}
                          className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.questions.includes(question)}
                            onChange={() => handleQuestionToggle(question)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-900">{question}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                      )}
                      {loading ? 'Sending...' : 'Send Inquiry'}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}