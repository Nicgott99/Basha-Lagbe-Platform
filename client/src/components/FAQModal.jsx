import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  X,
  Search,
  ChevronDown,
  ThumbsUp,
  ShieldCheck,
  BookOpen,
  FileText,
  Coins,
  Users,
  Zap,
  PhoneCall,
  Check,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';

const FAQ_CATEGORIES = [
  { id: 'all', label: 'All FAQs', icon: BookOpen },
  { id: 'deposit', label: 'Advance & Rent', icon: Coins },
  { id: 'legal', label: 'Tenancy Law & DMP', icon: ShieldCheck },
  { id: 'bachelor', label: 'Students & Bachelors', icon: Users },
  { id: 'utility', label: 'Prepaid Utilities & Bills', icon: Zap },
];

const FAQ_DATA = [
  {
    id: 'faq-1',
    category: 'deposit',
    question: 'How many months of advance rent deposit is standard in Dhaka & Bangladesh?',
    answer:
      'In Dhaka and other urban areas of Bangladesh, the standard advance rent deposit is typically 1 to 2 months of the agreed monthly rent. According to the Premises Rent Control Act 1991, landlords are legally restricted from claiming more than one month advance rent, though standard practice across residential buildings commonly ranges between 1–2 months. Always ensure your advance deposit is explicitly recorded on the stamped tenancy agreement with a signed money receipt.',
    helpfulCount: 142,
  },
  {
    id: 'faq-2',
    category: 'legal',
    question: 'Is DMP Police Verification (CIMS) mandatory for all tenants in Dhaka?',
    answer:
      'Yes. The Dhaka Metropolitan Police (DMP) Citizen Information Management System (CIMS) form is mandatory for every tenant and adult occupant. Landlords and tenants must submit copies of national NIDs, passport-size photographs, and employment/university details to the local Thana / bit officer within 7 days of move-in to ensure community safety and legal compliance.',
    helpfulCount: 218,
  },
  {
    id: 'faq-3',
    category: 'legal',
    question: 'What is the required legal notice period before vacating a rental flat?',
    answer:
      'The standard notice period in Bangladesh is 2 (two) months written notice from either party (tenant or landlord), unless a 1-month notice is mutually agreed upon in the registered Tenancy Agreement. Notice must be served in writing (or documented over SMS/Email) prior to the start of the final billing month.',
    helpfulCount: 184,
  },
  {
    id: 'faq-4',
    category: 'bachelor',
    question: 'Can landlords impose restrictive gate closing times on bachelor/student flats?',
    answer:
      'While building associations and landlord committees often set general gate security hours (e.g. 11:00 PM) for building safety, bachelors and shift workers (doctors, IT engineers, call center staff) can request master gate keys or building biometric entry cards by presenting proof of employment / emergency work hours to the building manager.',
    helpfulCount: 165,
  },
  {
    id: 'faq-5',
    category: 'utility',
    question: 'How do DESCO and DPDC prepaid smart electricity meter recharges work?',
    answer:
      'Prepaid meters can be recharged directly through bKash, Nagad, Rocket, or online banking using your 11-digit Customer Meter Number. When your balance drops below ৳100, the meter will beep. You can press the yellow/red button or dial 891 (on keypad meters) to unlock Emergency Credit (typically ৳200–৳500) to keep power on until you recharge.',
    helpfulCount: 198,
  },
  {
    id: 'faq-6',
    category: 'deposit',
    question: 'What damages can a landlord legally deduct from the security deposit?',
    answer:
      'Landlords may only deduct funds for actual structural damage caused by tenant negligence (e.g., broken window panes, damaged sanitary fittings, unapproved wall drilling). Normal day-to-day wear and tear (such as natural paint fading) is the landlord’s maintenance responsibility and cannot be unfairly penalized against the advance deposit.',
    helpfulCount: 137,
  },
  {
    id: 'faq-7',
    category: 'bachelor',
    question: 'Is subletting a bedroom or master bed share allowed in Bangladesh?',
    answer:
      'Subletting requires explicit permission or verbal consent from the primary landlord. Many student and bachelor flats near university areas (such as Bashundhara R/A, Dhanmondi, and Mirpur) are rented specifically with flat-sharing and subletting consent in the tenancy agreement.',
    helpfulCount: 122,
  },
  {
    id: 'faq-8',
    category: 'utility',
    question: 'Who is responsible for building service charge and generator diesel costs?',
    answer:
      'In standard residential agreements, the Tenant pays the monthly building service charge (which covers security guards, waste collection, lift maintenance, and common staircase lighting). In some prime luxury flats, the landlord includes the service charge directly within the gross rent. Always check whether rent is inclusive or exclusive of service charge.',
    helpfulCount: 154,
  },
];

const FAQModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(FAQ_DATA[0].id);
  const [helpfulFeedback, setHelpfulFeedback] = useState({});

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

  const filteredFAQs = FAQ_DATA.filter((item) => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchQuery =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  const handleHelpfulClick = (faqId) => {
    if (helpfulFeedback[faqId]) return;
    setHelpfulFeedback((prev) => ({ ...prev, [faqId]: true }));
    toast.success('Thank you for your feedback!');
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
          aria-labelledby="faq-modal-title"
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-yellow-400/20 text-yellow-400 rounded-2xl border border-yellow-400/30">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 id="faq-modal-title" className="text-xl font-bold flex items-center gap-2">
                  Tenancy Knowledge Base & Help Center
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Verified Guidelines
                  </span>
                </h2>
                <p className="text-xs text-blue-200">
                  Comprehensive answers on Bangladesh tenancy law, advance deposits, bachelors & utilities
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close FAQ center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar & Category Chips */}
          <div className="p-4 bg-gray-50 border-b border-gray-200/80 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tenancy questions (e.g. advance deposit, notice period, CIMS, DESCO, bachelor)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary-500 outline-none shadow-sm"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              {FAQ_CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 flex-shrink-0 transition-all ${
                      isSelected
                        ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-primary-600'}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accordion List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {filteredFAQs.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                No answers found matching "{searchQuery}". Try searching other keywords.
              </div>
            ) : (
              filteredFAQs.map((faq) => {
                const isExpanded = expandedId === faq.id;
                const isFeedbackGiven = !!helpfulFeedback[faq.id];
                return (
                  <div
                    key={faq.id}
                    className="border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-gray-50/80 transition-colors"
                      aria-expanded={isExpanded}
                    >
                      <span className="font-bold text-sm text-gray-900 leading-snug">
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0 text-gray-400"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-4 pb-4 pt-1 text-xs text-gray-700 leading-relaxed border-t border-gray-100 bg-gray-50/40"
                        >
                          <p className="mb-3">{faq.answer}</p>

                          {/* Helpful Feedback Action */}
                          <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-500">
                            <span>Was this information helpful?</span>
                            <button
                              type="button"
                              onClick={() => handleHelpfulClick(faq.id)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all ${
                                isFeedbackGiven
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                                  : 'bg-white hover:bg-gray-100 text-gray-600 border-gray-200'
                              }`}
                            >
                              {isFeedbackGiven ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Helpful ({faq.helpfulCount + 1})</span>
                                </>
                              ) : (
                                <>
                                  <ThumbsUp className="w-3 h-3 text-gray-400" />
                                  <span>Yes ({faq.helpfulCount})</span>
                                </>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
            <span>Need personalized support? Contact our 24/7 team at <strong>support@bashalagbe.com</strong></span>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-md transition-colors"
            >
              Close Help Center
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FAQModal;
