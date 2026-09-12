import React, { useState, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  X,
  Building2,
  Percent,
  Coins,
  ShieldCheck,
  Check,
  ArrowRight,
  Sparkles,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';

const formatBDT = (val) => `৳${Math.round(val || 0).toLocaleString('en-BD')}`;

const formatLakhsCrores = (val) => {
  if (val >= 10000000) {
    return `৳${(val / 10000000).toFixed(2)} Crore`;
  }
  if (val >= 100000) {
    return `৳${(val / 100000).toFixed(2)} Lakh`;
  }
  return formatBDT(val);
};

const RentalYieldCalculatorModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const priceSliderId = useId();
  const rentSliderId = useId();

  // State
  const [propertyPrice, setPropertyPrice] = useState(12000000); // 1.2 Crore BDT
  const [monthlyRent, setMonthlyRent] = useState(45000); // ৳45k / month
  const [vacancyMonths, setVacancyMonths] = useState(0.5); // 0.5 month per year
  const [annualMaintenance, setAnnualMaintenance] = useState(30000);
  const [annualTax, setAnnualTax] = useState(15000);
  const [appreciationRate, setAppreciationRate] = useState(7.0); // 7% capital appreciation in Dhaka/BD

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

  // Computations
  const annualGrossRent = monthlyRent * 12;
  const vacancyLoss = monthlyRent * vacancyMonths;
  const effectiveAnnualRent = annualGrossRent - vacancyLoss;
  const totalAnnualExpenses = annualMaintenance + annualTax;
  const annualNetIncome = effectiveAnnualRent - totalAnnualExpenses;

  const grossYield = propertyPrice > 0 ? (annualGrossRent / propertyPrice) * 100 : 0;
  const netYield = propertyPrice > 0 ? (annualNetIncome / propertyPrice) * 100 : 0;
  const paybackYears = annualNetIncome > 0 ? (propertyPrice / annualNetIncome).toFixed(1) : 'N/A';
  const totalAnnualReturn = netYield + appreciationRate;

  // Yield quality evaluation
  let yieldRating = 'Moderate Yield';
  let yieldColor = 'text-blue-600 bg-blue-50 border-blue-200';
  if (netYield >= 4.5) {
    yieldRating = 'High Performing Yield';
    yieldColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  } else if (netYield < 3.0) {
    yieldRating = 'Appreciation-Driven Asset';
    yieldColor = 'text-amber-600 bg-amber-50 border-amber-200';
  }

  const handleListProperty = () => {
    onClose();
    toast.success('Let’s publish your rental listing!');
    navigate('/add-property');
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
          aria-labelledby="yield-calc-title"
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-yellow-400/20 text-yellow-400 rounded-2xl border border-yellow-400/30">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h2 id="yield-calc-title" className="text-xl font-bold flex items-center gap-2">
                  Landlord Rental Yield & ROI Calculator
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    BD Market Model
                  </span>
                </h2>
                <p className="text-xs text-blue-200">
                  Analyze gross & net rental returns, payback period, and capital growth metrics in BDT
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close ROI calculator"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Inputs */}
              <div className="lg:col-span-6 space-y-5">
                {/* Property Value Input */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor={priceSliderId} className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-primary-600" />
                      Property Valuation / Purchase Price
                    </label>
                    <span className="text-sm font-black text-primary-700">
                      {formatLakhsCrores(propertyPrice)}
                    </span>
                  </div>
                  <input
                    id={priceSliderId}
                    type="range"
                    min="2000000"
                    max="50000000"
                    step="500000"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-medium">
                    <span>৳20 Lakh</span>
                    <span>৳1.5 Crore</span>
                    <span>৳3.5 Crore</span>
                    <span>৳5.0 Crore</span>
                  </div>
                </div>

                {/* Monthly Rent Input */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor={rentSliderId} className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-emerald-600" />
                      Expected Monthly Rent
                    </label>
                    <span className="text-sm font-black text-emerald-700">
                      {formatBDT(monthlyRent)}/mo
                    </span>
                  </div>
                  <input
                    id={rentSliderId}
                    type="range"
                    min="10000"
                    max="250000"
                    step="2500"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-medium">
                    <span>৳10k</span>
                    <span>৳50k</span>
                    <span>৳1.5 Lakh</span>
                    <span>৳2.5 Lakh</span>
                  </div>
                </div>

                {/* Additional Operational Adjustments */}
                <div className="border border-gray-200 rounded-2xl p-4 space-y-3 bg-white">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-primary-600" />
                    Annual Expenses & Assumptions (৳)
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-gray-500 font-medium mb-1">Annual Maintenance Buffer</label>
                      <input
                        type="number"
                        step="5000"
                        value={annualMaintenance}
                        onChange={(e) => setAnnualMaintenance(Number(e.target.value))}
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 font-medium mb-1">City Corp Holding Tax</label>
                      <input
                        type="number"
                        step="2500"
                        value={annualTax}
                        onChange={(e) => setAnnualTax(Number(e.target.value))}
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 font-medium mb-1">Vacancy Buffer (Months)</label>
                      <select
                        value={vacancyMonths}
                        onChange={(e) => setVacancyMonths(Number(e.target.value))}
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none"
                      >
                        <option value={0}>0 (100% Occupied)</option>
                        <option value={0.5}>0.5 Month / Year</option>
                        <option value={1.0}>1.0 Month / Year</option>
                        <option value={2.0}>2.0 Months / Year</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-500 font-medium mb-1">Capital Growth (% / yr)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={appreciationRate}
                        onChange={(e) => setAppreciationRate(Number(e.target.value))}
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Computed ROI Metrics */}
              <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
                {/* Hero Yield Card */}
                <div className="bg-gradient-to-br from-primary-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                      Net Rental Yield (Annual)
                    </span>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${yieldColor}`}>
                      {yieldRating}
                    </span>
                  </div>

                  <div className="text-4xl sm:text-5xl font-black text-yellow-400 mb-1">
                    {netYield.toFixed(2)}%
                    <span className="text-xs text-blue-200 font-normal ml-2">
                      (Gross: {grossYield.toFixed(2)}%)
                    </span>
                  </div>

                  <p className="text-xs text-blue-200 mb-4">
                    Generates <strong>{formatBDT(annualNetIncome)}</strong> net liquid cash flow every year
                  </p>

                  <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-blue-300 block">Estimated Payback:</span>
                      <strong className="text-base text-white">{paybackYears} Years</strong>
                    </div>
                    <div>
                      <span className="text-blue-300 block">Total Combined ROI:</span>
                      <strong className="text-base text-emerald-400">{totalAnnualReturn.toFixed(1)}% / yr</strong>
                    </div>
                  </div>
                </div>

                {/* Investment Benchmark Comparison Card */}
                <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50 space-y-2.5 text-xs">
                  <h5 className="font-bold text-gray-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Bangladesh Asset Class Comparison
                  </h5>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-gray-200">
                      <span className="text-gray-700 font-medium">🏢 Your Property (Rent + Appreciation)</span>
                      <strong className="text-emerald-700 font-bold">{totalAnnualReturn.toFixed(1)}% p.a.</strong>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-gray-200">
                      <span className="text-gray-700 font-medium">📜 BD Sanchayapatra (Savings Cert.)</span>
                      <strong className="text-gray-900 font-bold">~9.5% – 11.2%</strong>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-gray-200">
                      <span className="text-gray-700 font-medium">🏦 Bank Fixed Deposit (FDR)</span>
                      <strong className="text-gray-900 font-bold">~7.5% – 9.0%</strong>
                    </div>
                  </div>
                </div>

                {/* Direct CTA */}
                <button
                  type="button"
                  onClick={handleListProperty}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all transform hover:scale-[1.01] text-xs sm:text-sm"
                >
                  <span>List Your Property & Maximize Rental Yield</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Model calculates returns based on Dhaka/Chittagong metropolitan market metrics.</span>
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

export default RentalYieldCalculatorModal;
