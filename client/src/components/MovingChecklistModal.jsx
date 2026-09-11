import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckSquare,
  Square,
  X,
  FileText,
  ShieldCheck,
  Truck,
  Zap,
  Sparkles,
  Printer,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Info,
  Calendar,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';

const STORAGE_KEY = 'basha_lagbe_moving_checklist_v1';

const CHECKLIST_SECTIONS = [
  {
    id: 'stage1',
    title: 'Stage 1: Before Moving (2-4 Weeks)',
    icon: Calendar,
    color: 'text-blue-600 bg-blue-50',
    tasks: [
      { id: 't1', text: 'Serve official 1-2 month notice to current landlord in writing' },
      { id: 't2', text: 'Sign standard Tenancy Agreement (ভাড়া চুক্তিপত্র) on non-judicial stamp' },
      { id: 't3', text: 'Settle Advance Deposit (typically 1-2 months) and obtain signed money receipt' },
      { id: 't4', text: 'Book professional moving truck / pickup van (e.g. Truck Lagbe / local transport)' },
      { id: 't5', text: 'Sort and declutter household belongings before packing' },
    ],
  },
  {
    id: 'stage2',
    title: 'Stage 2: Moving Day & Handover',
    icon: Truck,
    color: 'text-amber-600 bg-amber-50',
    tasks: [
      { id: 't6', text: 'Inform building security & reserve elevator/lift for shifting luggage' },
      { id: 't7', text: 'Take photo documentation of DESCO/DPDC electricity meter reading' },
      { id: 't8', text: 'Verify WASA water flow, taps, geyser, and bathroom fixtures' },
      { id: 't9', text: 'Test Titas Gas pipeline or verify prepaid LPG cylinder & regulator' },
      { id: 't10', text: 'Collect all sets of master keys, gate remotes, and building entry cards' },
    ],
  },
  {
    id: 'stage3',
    title: 'Stage 3: Legal & Dhaka Police (CIMS)',
    icon: ShieldCheck,
    color: 'text-emerald-600 bg-emerald-50',
    tasks: [
      { id: 't11', text: 'Fill out DMP Tenant Verification Form (Citizen Information Management System - CIMS)' },
      { id: 't12', text: 'Attach passport-size photographs and national NID copies of all adult residents' },
      { id: 't13', text: 'Submit verified form to local police station / Thana bit officer or via DMP app' },
      { id: 't14', text: 'Provide emergency contact details and employer/university ID to building manager' },
    ],
  },
  {
    id: 'stage4',
    title: 'Stage 4: Utilities & Settling In',
    icon: Zap,
    color: 'text-purple-600 bg-purple-50',
    tasks: [
      { id: 't15', text: 'Set up high-speed broadband Wi-Fi connection with local ISP' },
      { id: 't16', text: 'Register for monthly building service charge (generator, security, waste collection)' },
      { id: 't17', text: 'Locate nearest grocery bazar, pharmacy, hospital, and emergency fire station' },
      { id: 't18', text: 'Update delivery addresses on food delivery, banking, and online apps' },
    ],
  },
];

const STANDARD_TENANCY_CLAUSES = `STANDARD BANGLADESH RESIDENTIAL TENANCY TERMS (ভাড়া চুক্তি নির্দেশিকা):
1. MONTHLY RENT: Payable within the 1st to 10th of each calendar month.
2. ADVANCE DEPOSIT: Advance amount is refundable or adjustable at the time of vacating the premises.
3. NOTICE PERIOD: Either party must provide minimum 2 (two) months advance written notice prior to termination.
4. UTILITY CHARGES: Electricity (DESCO/DPDC), Gas, WASA Water, and Building Service Charge shall be paid based on actual consumption/bills.
5. MAINTENANCE: Minor day-to-day repairs by Tenant; structural and major pipeline repairs by Landlord.
6. POLICE VERIFICATION: Mandatory submission of DMP CIMS Tenant Information Form to the local Thana.`;

const MovingChecklistModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('checklist'); // 'checklist' | 'agreement'
  const [completedTasks, setCompletedTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedTasks));
    } catch {
      // Local storage fallback
    }
  }, [completedTasks]);

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

  const allTasks = CHECKLIST_SECTIONS.flatMap((s) => s.tasks);
  const totalTasksCount = allTasks.length;
  const completedCount = allTasks.filter((t) => completedTasks[t.id]).length;
  const progressPercent = Math.round((completedCount / totalTasksCount) * 100);

  const toggleTask = (taskId) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handleReset = () => {
    setCompletedTasks({});
    toast.info('Checklist progress reset');
  };

  const handleMarkAll = () => {
    const next = {};
    allTasks.forEach((t) => {
      next[t.id] = true;
    });
    setCompletedTasks(next);
    toast.success('All tasks marked as completed!');
  };

  const handleCopyAgreement = () => {
    navigator.clipboard.writeText(STANDARD_TENANCY_CLAUSES);
    setCopied(true);
    toast.success('Standard Tenancy Terms copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
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
          aria-labelledby="moving-checklist-title"
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-yellow-400/20 text-yellow-400 rounded-2xl border border-yellow-400/30">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 id="moving-checklist-title" className="text-xl font-bold flex items-center gap-2">
                  Tenant Move-in & Legal Preparation Hub
                </h2>
                <p className="text-xs text-blue-200">
                  Step-by-step moving guide, DMP police verification & tenancy contract terms
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close moving checklist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="p-4 bg-gray-50 border-b border-gray-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('checklist')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'checklist'
                    ? 'bg-white text-primary-900 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <CheckSquare className="w-4 h-4 text-primary-600" />
                <span>Move-in Checklist ({completedCount}/{totalTasksCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('agreement')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'agreement'
                    ? 'bg-white text-primary-900 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Standard Tenancy Terms (চুক্তিপত্র)</span>
              </button>
            </div>

            {activeTab === 'checklist' && (
              <div className="hidden sm:flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-gray-500 hover:text-red-600 px-2 py-1 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleMarkAll}
                  className="text-primary-700 hover:text-primary-900 font-semibold px-2 py-1 transition-colors"
                >
                  Mark All Done
                </button>
              </div>
            )}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'checklist' ? (
              <>
                {/* Progress Bar */}
                <div className="bg-gradient-to-br from-primary-900 to-indigo-950 text-white rounded-2xl p-4 shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                      Move-in Readiness Progress
                    </span>
                    <span className="text-sm font-black text-yellow-400">{progressPercent}% Ready</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-yellow-400 to-emerald-400 rounded-full"
                    />
                  </div>
                  <p className="text-[11px] text-blue-200 mt-2">
                    {progressPercent === 100
                      ? '🎉 Fantastic! You have completed all essential tenancy and shifting steps.'
                      : `Complete all ${totalTasksCount} steps to guarantee a stress-free transition into your new home.`}
                  </p>
                </div>

                {/* Checklist Sections */}
                <div className="space-y-4">
                  {CHECKLIST_SECTIONS.map((section) => {
                    const SectionIcon = section.icon;
                    return (
                      <div key={section.id} className="border border-gray-200 rounded-2xl p-4 bg-white">
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`p-2 rounded-xl ${section.color}`}>
                            <SectionIcon className="w-4 h-4" />
                          </div>
                          <h4 className="font-bold text-sm text-gray-900">{section.title}</h4>
                        </div>

                        <div className="space-y-2">
                          {section.tasks.map((task) => {
                            const isDone = !!completedTasks[task.id];
                            return (
                              <button
                                key={task.id}
                                type="button"
                                onClick={() => toggleTask(task.id)}
                                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                                  isDone
                                    ? 'bg-emerald-50/50 border-emerald-200 text-gray-500'
                                    : 'bg-gray-50 border-gray-200 hover:bg-white text-gray-800'
                                }`}
                              >
                                <span className="mt-0.5 flex-shrink-0 text-primary-600">
                                  {isDone ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                                  ) : (
                                    <Square className="w-4 h-4 text-gray-400" />
                                  )}
                                </span>
                                <span className={`text-xs font-medium ${isDone ? 'line-through' : ''}`}>
                                  {task.text}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Agreement / Legal Guide Tab */
              <div className="space-y-5">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl flex-shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                        Bangladesh Residential Tenancy & DMP Law
                      </h4>
                      <p className="text-xs text-emerald-800 mt-1">
                        In Bangladesh, residential leases are executed on non-judicial stamp papers (৳300 denomination) and must be accompanied by the DMP Tenant Information Form.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Standard Clauses Text Box */}
                <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Standard Agreement Clauses
                    </h5>
                    <button
                      type="button"
                      onClick={handleCopyAgreement}
                      className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 bg-white border border-gray-300 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy Clauses'}</span>
                    </button>
                  </div>
                  <pre className="text-xs text-gray-700 font-mono bg-white p-3.5 rounded-xl border border-gray-200 whitespace-pre-wrap leading-relaxed">
                    {STANDARD_TENANCY_CLAUSES}
                  </pre>
                </div>

                {/* Key Legal Tips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
                    <strong className="text-blue-900 block mb-1">📝 Advance Money Receipt</strong>
                    <span className="text-blue-800">
                      Always collect a written, signed receipt for advance rent deposits specifying whether it is refundable or adjustable.
                    </span>
                  </div>
                  <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl">
                    <strong className="text-purple-900 block mb-1">👮 DMP CIMS Registration</strong>
                    <span className="text-purple-800">
                      Submit the tenant form to your respective Thana within 7 days of moving to remain fully compliant with police regulations.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Verified for Bangladesh rental standards (2026)
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              Got it, Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MovingChecklistModal;
