import React, { useState, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Calculator,
  X,
  Wallet,
  ArrowRight,
  Sparkles,
  Zap,
  Flame,
  Droplets,
  Wifi,
  ShieldCheck,
  Truck,
  Check,
  Info,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';

const formatBDT = (val) => `৳${Math.round(val || 0).toLocaleString('en-BD')}`;

const RentCalculatorModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const incomeSliderId = useId();

  // State
  const [monthlyIncome, setMonthlyIncome] = useState(60000);
  const [budgetRule, setBudgetRule] = useState(0.3); // 30% standard
  const [advanceMonths, setAdvanceMonths] = useState(2);
  const [includeUtilities, setIncludeUtilities] = useState(true);
  const [includeShifting, setIncludeShifting] = useState(true);

  // Close on Escape key
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

  // Computations
  const maxAffordableRent = Math.round(monthlyIncome * budgetRule);
  const minRecommendedRent = Math.round(monthlyIncome * (budgetRule - 0.08));

  // Estimated Utilities for Bangladesh urban living (BDT)
  const utilityBreakdown = {
    electricity: Math.round(monthlyIncome > 80000 ? 3500 : 2200),
    gas: 1080,
    water: 800,
    serviceCharge: Math.round(monthlyIncome > 80000 ? 4000 : 2500),
    internet: 1000,
  };

  const totalMonthlyUtilities = includeUtilities
    ? Object.values(utilityBreakdown).reduce((acc, curr) => acc + curr, 0)
    : 0;

  const totalMonthlyCommitment = maxAffordableRent + totalMonthlyUtilities;

  // Move-in upfront cash requirement
  const shiftingCost = includeShifting ? 6000 : 0;
  const advanceDeposit = maxAffordableRent * advanceMonths;
  const initialMoveInCash = advanceDeposit + maxAffordableRent + shiftingCost;

  // Budget status classification
  const rentToIncomePercent = Math.round((maxAffordableRent / (monthlyIncome || 1)) * 100);
  let statusColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  let statusLabel = 'Comfortable & Safe';
  if (budgetRule === 0.3) {
    statusColor = 'text-blue-600 bg-blue-50 border-blue-200';
    statusLabel = 'Balanced (Recommended)';
  } else if (budgetRule > 0.3) {
    statusColor = 'text-amber-600 bg-amber-50 border-amber-200';
    statusLabel = 'Maximum Stretch';
  }

  const handleApplyToSearch = () => {
    onClose();
    toast.success(`Showing rental homes within ${formatBDT(minRecommendedRent)} – ${formatBDT(maxAffordableRent)}`);
    navigate(`/search?minPrice=${minRecommendedRent}&maxPrice=${maxAffordableRent}`);
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
          aria-labelledby="rent-calc-title"
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-yellow-400/20 text-yellow-400 rounded-2xl border border-yellow-400/30">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h2 id="rent-calc-title" className="text-xl font-bold flex items-center gap-2">
                  Rent & Budget Affordability Calculator
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-400 text-gray-950">
                    BDT ৳
                  </span>
                </h2>
                <p className="text-xs text-blue-200">
                  Estimate your ideal monthly rent budget & upfront move-in cash requirements
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close calculator"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Income Input */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <label htmlFor={incomeSliderId} className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary-600" />
                  Monthly Household Take-Home Income
                </label>
                <div className="flex items-center bg-white border border-gray-300 rounded-xl px-3 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-primary-500">
                  <span className="text-gray-500 font-semibold mr-1">৳</span>
                  <input
                    type="number"
                    min="10000"
                    max="500000"
                    step="5000"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Math.max(0, Number(e.target.value)))}
                    className="w-28 text-right font-bold text-gray-900 outline-none bg-transparent"
                    aria-label="Monthly income amount in BDT"
                  />
                </div>
              </div>

              {/* Slider */}
              <input
                id={incomeSliderId}
                type="range"
                min="15000"
                max="300000"
                step="5000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1 font-medium">
                <span>৳15,000</span>
                <span>৳1,00,000</span>
                <span>৳2,00,000</span>
                <span>৳3,00,000+</span>
              </div>
            </div>

            {/* Budget Rule Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Budget Allocation Strategy
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    rule: 0.25,
                    title: 'Conservative',
                    pct: '25%',
                    desc: 'High monthly savings for future goals',
                  },
                  {
                    rule: 0.3,
                    title: 'Standard (30%)',
                    pct: '30%',
                    desc: 'Real-estate industry golden benchmark',
                  },
                  {
                    rule: 0.4,
                    title: 'Max Stretch',
                    pct: '40%',
                    desc: 'Prime location or luxury amenities',
                  },
                ].map((item) => (
                  <button
                    key={item.rule}
                    type="button"
                    onClick={() => setBudgetRule(item.rule)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      budgetRule === item.rule
                        ? 'bg-primary-50/70 border-primary-500 shadow-md ring-1 ring-primary-500'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-gray-900">{item.title}</span>
                      {budgetRule === item.rule && (
                        <span className="p-0.5 bg-primary-600 text-white rounded-full">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-primary-700 font-semibold mb-1">{item.pct} of income</div>
                    <p className="text-[11px] text-gray-500 leading-tight">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: Recommended Monthly Rent */}
              <div className="bg-gradient-to-br from-primary-900 to-indigo-950 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Sparkles className="w-32 h-32" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-primary-200 uppercase tracking-wide">
                      Target Monthly Rent
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-yellow-400 mb-1">
                    {formatBDT(maxAffordableRent)}
                    <span className="text-sm font-normal text-gray-300"> / mo</span>
                  </div>
                  <p className="text-xs text-blue-200">
                    Safe range: <strong className="text-white">{formatBDT(minRecommendedRent)} – {formatBDT(maxAffordableRent)}</strong>
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 text-xs text-blue-200 space-y-1">
                  <div className="flex justify-between">
                    <span>Rent-to-income ratio:</span>
                    <span className="font-bold text-white">{rentToIncomePercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>With estimated utilities:</span>
                    <span className="font-bold text-yellow-300">{formatBDT(totalMonthlyCommitment)} / mo</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Upfront Move-in Cash */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Initial Move-in Cash Needed
                    </span>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-gray-500 font-medium">Advance:</span>
                      <select
                        value={advanceMonths}
                        onChange={(e) => setAdvanceMonths(Number(e.target.value))}
                        className="bg-white border border-gray-300 rounded px-1.5 py-0.5 text-xs font-bold text-gray-700 outline-none"
                        aria-label="Number of advance rent months"
                      >
                        <option value={1}>1 mo</option>
                        <option value={2}>2 mos</option>
                        <option value={3}>3 mos</option>
                      </select>
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">
                    {formatBDT(initialMoveInCash)}
                  </div>
                  <p className="text-xs text-gray-500">
                    Total liquid capital to reserve before signing the tenancy contract
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Advance deposit ({advanceMonths} mos):</span>
                    <span className="font-semibold text-gray-800">{formatBDT(advanceDeposit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>First month rent:</span>
                    <span className="font-semibold text-gray-800">{formatBDT(maxAffordableRent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Moving & packing estimate:</span>
                    <span className="font-semibold text-gray-800">{formatBDT(shiftingCost)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Estimated Urban Utility Expenses Breakdown (Bangladesh specific) */}
            <div className="border border-gray-200 rounded-2xl p-4 bg-white">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-primary-600" />
                  Estimated Dhaka/Urban Monthly Utilities (৳)
                </h4>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 font-medium">
                  <input
                    type="checkbox"
                    checked={includeUtilities}
                    onChange={(e) => setIncludeUtilities(e.target.checked)}
                    className="rounded text-primary-600 focus:ring-primary-500"
                  />
                  <span>Include in total</span>
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex flex-col justify-between">
                  <div className="flex items-center gap-1 text-gray-500 mb-1">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    <span>Electricity</span>
                  </div>
                  <span className="font-bold text-gray-800">{formatBDT(utilityBreakdown.electricity)}</span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex flex-col justify-between">
                  <div className="flex items-center gap-1 text-gray-500 mb-1">
                    <Flame className="w-3 h-3 text-orange-500" />
                    <span>Gas (LPG/Pipe)</span>
                  </div>
                  <span className="font-bold text-gray-800">{formatBDT(utilityBreakdown.gas)}</span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex flex-col justify-between">
                  <div className="flex items-center gap-1 text-gray-500 mb-1">
                    <Droplets className="w-3 h-3 text-blue-500" />
                    <span>WASA Water</span>
                  </div>
                  <span className="font-bold text-gray-800">{formatBDT(utilityBreakdown.water)}</span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex flex-col justify-between">
                  <div className="flex items-center gap-1 text-gray-500 mb-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>Service Chg</span>
                  </div>
                  <span className="font-bold text-gray-800">{formatBDT(utilityBreakdown.serviceCharge)}</span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex flex-col justify-between col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-1 text-gray-500 mb-1">
                    <Wifi className="w-3 h-3 text-indigo-500" />
                    <span>Broadband</span>
                  </div>
                  <span className="font-bold text-gray-800">{formatBDT(utilityBreakdown.internet)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500 text-center sm:text-left">
              Matches homes suitable for your budget of <strong className="text-gray-800">{formatBDT(maxAffordableRent)}/mo</strong>
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex-1 sm:flex-initial"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleApplyToSearch}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] flex-1 sm:flex-initial"
              >
                <span>Find Homes in My Budget</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RentCalculatorModal;
