import { useState, useMemo } from "react";
import {
  X,
  Receipt,
  Zap,
  Droplets,
  Flame,
  Wifi,
  Users,
  Shield,
  Trash2,
  Plus,
  Copy,
  Check,
  Calculator,
  Info,
  Sparkles,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Utensils,
  DollarSign
} from "lucide-react";

// BERC Residential Electricity Tariff Slabs (Retail LT-A Domestic)
const ELECTRICITY_SLABS = [
  { min: 0, max: 50, rate: 4.63, label: "Lifeline (0-50 kWh)" },
  { min: 1, max: 75, rate: 5.26, label: "Step 1 (0-75 kWh)" },
  { min: 76, max: 200, rate: 7.20, label: "Step 2 (76-200 kWh)" },
  { min: 201, max: 300, rate: 7.59, label: "Step 3 (201-300 kWh)" },
  { min: 301, max: 400, rate: 8.02, label: "Step 4 (301-400 kWh)" },
  { min: 401, max: 600, rate: 12.67, label: "Step 5 (401-600 kWh)" },
  { min: 601, max: 99999, rate: 14.61, label: "Step 6 (>600 kWh)" },
];

export default function UtilityBillSplitterModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("splitter"); // "splitter" | "prepaid" | "tips"

  // ── 1. Splitter State ──────────────────────────────────────────────
  const [rentAmount, setRentAmount] = useState(24000);
  const [electricBill, setElectricBill] = useState(3500);
  const [waterBill, setWaterBill] = useState(1200);
  const [gasBillType, setGasBillType] = useState("double"); // "double" (1080) | "single" (990) | "custom"
  const [gasCustomAmount, setGasCustomAmount] = useState(1080);
  const [serviceCharge, setServiceCharge] = useState(2500);
  const [internetBill, setInternetBill] = useState(1000);
  const [wasteBill, setWasteBill] = useState(150);
  const [maidWage, setMaidWage] = useState(3000);
  const [groceryFund, setGroceryFund] = useState(0);

  // Flatmates List
  const [flatmates, setFlatmates] = useState([
    { id: 1, name: "Tanvir (Master Bed + AC)", roomRent: 9000, hasAc: true, mealsCount: 30, customAdjustment: 0 },
    { id: 2, name: "Sakib (Bed 2)", roomRent: 8000, hasAc: false, mealsCount: 30, customAdjustment: 0 },
    { id: 3, name: "Abrar (Bed 3)", roomRent: 7000, hasAc: false, mealsCount: 30, customAdjustment: 0 },
  ]);

  // ── 2. Prepaid Electric Calculator State ────────────────────────────
  const [rechargeAmount, setRechargeAmount] = useState(1500);
  const [meterProvider, setMeterProvider] = useState("DESCO"); // DESCO, DPDC, BPDB, NESCO
  const [sanctionedLoadKw, setSanctionedLoadKw] = useState(2);
  const [meterRent, setMeterRent] = useState(40);
  const [existingEmergencyDeduction, setExistingEmergencyDeduction] = useState(0);

  const [copied, setCopied] = useState(false);

  // Gas Bill Computed
  const effectiveGasBill = useMemo(() => {
    if (gasBillType === "double") return 1080;
    if (gasBillType === "single") return 990;
    return Number(gasCustomAmount) || 0;
  }, [gasBillType, gasCustomAmount]);

  // Total Utilities & Shared Bills
  const sharedUtilitiesTotal = useMemo(() => {
    return (
      (Number(electricBill) || 0) +
      (Number(waterBill) || 0) +
      (Number(effectiveGasBill) || 0) +
      (Number(serviceCharge) || 0) +
      (Number(internetBill) || 0) +
      (Number(wasteBill) || 0) +
      (Number(maidWage) || 0) +
      (Number(groceryFund) || 0)
    );
  }, [
    electricBill,
    waterBill,
    effectiveGasBill,
    serviceCharge,
    internetBill,
    wasteBill,
    maidWage,
    groceryFund,
  ]);

  const grandTotal = useMemo(() => {
    return (Number(rentAmount) || 0) + sharedUtilitiesTotal;
  }, [rentAmount, sharedUtilitiesTotal]);

  // Flatmate Individual Calculation
  const flatmateBreakdown = useMemo(() => {
    const memberCount = flatmates.length || 1;
    const acUsersCount = flatmates.filter((f) => f.hasAc).length;
    const nonAcUsersCount = memberCount - acUsersCount;

    // AC surcharge logic: If some have AC and some don't, 50% of electric bill is base split equally,
    // 50% is split among AC users
    const totalElectric = Number(electricBill) || 0;
    let acElectricShare = 0;
    let baseElectricPerPerson = totalElectric / memberCount;

    if (acUsersCount > 0 && nonAcUsersCount > 0) {
      const baseElectricPool = totalElectric * 0.5;
      const acHeavyPool = totalElectric * 0.5;
      baseElectricPerPerson = baseElectricPool / memberCount;
      acElectricShare = acHeavyPool / acUsersCount;
    }

    // Other utilities equal per head (Water, Gas, Service, Net, Waste, Maid)
    const otherUtilitiesPerHead =
      ((Number(waterBill) || 0) +
        (Number(effectiveGasBill) || 0) +
        (Number(serviceCharge) || 0) +
        (Number(internetBill) || 0) +
        (Number(wasteBill) || 0) +
        (Number(maidWage) || 0)) /
      memberCount;

    // Meals calculation if grocery fund set
    const totalMeals = flatmates.reduce((acc, f) => acc + (Number(f.mealsCount) || 0), 0) || 1;
    const mealRate = (Number(groceryFund) || 0) / totalMeals;

    return flatmates.map((f) => {
      const individualElectric = baseElectricPerPerson + (f.hasAc ? acElectricShare : 0);
      const individualMeals = (Number(f.mealsCount) || 0) * mealRate;
      const individualRent = Number(f.roomRent) || (Number(rentAmount) || 0) / memberCount;
      const adjustment = Number(f.customAdjustment) || 0;

      const totalToPay = Math.round(
        individualRent +
          individualElectric +
          otherUtilitiesPerHead +
          individualMeals +
          adjustment
      );

      return {
        ...f,
        individualRent: Math.round(individualRent),
        individualElectric: Math.round(individualElectric),
        otherUtilities: Math.round(otherUtilitiesPerHead),
        individualMeals: Math.round(individualMeals),
        totalToPay,
      };
    });
  }, [
    flatmates,
    rentAmount,
    electricBill,
    waterBill,
    effectiveGasBill,
    serviceCharge,
    internetBill,
    wasteBill,
    maidWage,
    groceryFund,
  ]);

  // ── Prepaid Meter Tariff Engine ─────────────────────────────────────
  const prepaidCalculation = useMemo(() => {
    const gross = Number(rechargeAmount) || 0;
    const demandCharge = (Number(sanctionedLoadKw) || 2) * 42; // ~42 BDT per kW
    const mRent = Number(meterRent) || 40;
    const emergencyDeduction = Number(existingEmergencyDeduction) || 0;

    // Fixed deductions
    const fixedDeductions = demandCharge + mRent + emergencyDeduction;
    const amountAfterFixed = Math.max(0, gross - fixedDeductions);

    // 5% Govt VAT is on energy cost + demand charge + meter rent
    // energy_cost * 1.05 approx from remaining amount
    const vatRate = 0.05;
    const netForEnergy = amountAfterFixed / (1 + vatRate);
    const estimatedVat = (gross - emergencyDeduction) * vatRate;

    // Estimate units based on blended average rate (~7.8 BDT/kWh in step 2-3)
    let remainingTk = netForEnergy;
    let units = 0;

    // Step 1: 0 - 75 @ 5.26
    const step1MaxTk = 75 * 5.26;
    if (remainingTk <= step1MaxTk) {
      units += remainingTk / 5.26;
      remainingTk = 0;
    } else {
      units += 75;
      remainingTk -= step1MaxTk;

      // Step 2: 76 - 200 (125 units) @ 7.20
      const step2MaxTk = 125 * 7.20;
      if (remainingTk <= step2MaxTk) {
        units += remainingTk / 7.20;
        remainingTk = 0;
      } else {
        units += 125;
        remainingTk -= step2MaxTk;

        // Step 3: 201 - 300 (100 units) @ 7.59
        const step3MaxTk = 100 * 7.59;
        if (remainingTk <= step3MaxTk) {
          units += remainingTk / 7.59;
          remainingTk = 0;
        } else {
          units += 100;
          remainingTk -= step3MaxTk;

          // Step 4: 301 - 400 @ 8.02
          const step4MaxTk = 100 * 8.02;
          if (remainingTk <= step4MaxTk) {
            units += remainingTk / 8.02;
            remainingTk = 0;
          } else {
            units += 100;
            remainingTk -= step4MaxTk;
            // Higher steps @ ~12.67
            units += remainingTk / 12.67;
          }
        }
      }
    }

    return {
      gross,
      demandCharge,
      mRent,
      emergencyDeduction,
      estimatedVat: Math.round(estimatedVat),
      netForEnergy: Math.round(netForEnergy),
      estimatedUnits: Math.max(0, units).toFixed(1),
    };
  }, [rechargeAmount, sanctionedLoadKw, meterRent, existingEmergencyDeduction]);

  // Handlers for flatmate list
  const addFlatmate = () => {
    const newId = Date.now();
    setFlatmates((prev) => [
      ...prev,
      {
        id: newId,
        name: `Flatmate ${prev.length + 1}`,
        roomRent: Math.round((Number(rentAmount) || 20000) / (prev.length + 1)),
        hasAc: false,
        mealsCount: 30,
        customAdjustment: 0,
      },
    ]);
  };

  const removeFlatmate = (id) => {
    if (flatmates.length <= 1) return;
    setFlatmates((prev) => prev.filter((f) => f.id !== id));
  };

  const updateFlatmate = (id, field, value) => {
    setFlatmates((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const handleCopyBreakdown = () => {
    let text = `🏠 Basha Lagbe - Monthly Flat Rent & Utility Bill Split\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💵 Flat Total Expenses: ৳${grandTotal.toLocaleString()} BDT\n`;
    text += `• House Rent: ৳${Number(rentAmount).toLocaleString()}\n`;
    text += `• Electricity (Prepaid/Postpaid): ৳${Number(electricBill).toLocaleString()}\n`;
    text += `• WASA Water: ৳${Number(waterBill).toLocaleString()}\n`;
    text += `• Gas: ৳${effectiveGasBill.toLocaleString()} (${gasBillType === "double" ? "Double Burner" : gasBillType === "single" ? "Single Burner" : "Custom"})\n`;
    text += `• Service & Guard: ৳${Number(serviceCharge).toLocaleString()}\n`;
    text += `• Wi-Fi Internet: ৳${Number(internetBill).toLocaleString()}\n`;
    if (Number(maidWage) > 0) text += `• Cook/Maid (Bua): ৳${Number(maidWage).toLocaleString()}\n`;
    if (Number(groceryFund) > 0) text += `• Grocery/Meal Pool: ৳${Number(groceryFund).toLocaleString()}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `👥 INDIVIDUAL FLATMATE DUES:\n`;

    flatmateBreakdown.forEach((f, idx) => {
      text += `\n${idx + 1}. ${f.name}\n`;
      text += `   Rent: ৳${f.individualRent.toLocaleString()} | Electric${f.hasAc ? " (AC)" : ""}: ৳${f.individualElectric.toLocaleString()}\n`;
      text += `   Other Utilities: ৳${f.otherUtilities.toLocaleString()}`;
      if (f.individualMeals > 0) text += ` | Meals: ৳${f.individualMeals.toLocaleString()}`;
      if (f.customAdjustment !== 0) text += ` | Adj: ৳${f.customAdjustment}`;
      text += `\n   👉 TOTAL PAYABLE: ৳${f.totalToPay.toLocaleString()} BDT\n`;
    });

    text += `\nGenerated via Basha Lagbe Platform (bashalagbe.com)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
              <Receipt className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                Utility Bill Splitter & Prepaid Meter Calculator
                <span className="hidden sm:inline-block text-xs bg-yellow-400 text-teal-950 font-bold px-2 py-0.5 rounded-full">
                  BD Tariffs
                </span>
              </h2>
              <p className="text-xs text-teal-100">
                Split rent, electric, WASA, gas, and calculate DESCO/DPDC prepaid meter recharge units
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 px-4 pt-2 shrink-0 overflow-x-auto no-scrollbar">
          {[
            { id: "splitter", label: "Flat Expense & Roommate Splitter", icon: Users },
            { id: "prepaid", label: "Prepaid Electric Meter (DESCO/DPDC)", icon: Zap },
            { id: "tips", label: "Dhaka Utility Saving Tips", icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2.5 px-4 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? "border-teal-600 text-teal-600 dark:text-teal-400 font-semibold"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-teal-600 dark:text-teal-400" : "text-gray-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* TAB 1: FLATMATE BILL SPLITTER */}
          {activeTab === "splitter" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Form: Monthly Expenses (6 cols) */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-teal-50/40 dark:bg-teal-950/20 p-4 rounded-xl border border-teal-100 dark:border-teal-900/40 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-teal-600" />
                    Monthly Flat Bills & Utilities
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* House Rent */}
                    <div>
                      <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">
                        Total House Rent (BDT)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={rentAmount}
                        onChange={(e) => setRentAmount(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold"
                      />
                    </div>

                    {/* Electric Bill */}
                    <div>
                      <label className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1 mb-1">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        Electricity Bill (BDT)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={electricBill}
                        onChange={(e) => setElectricBill(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold"
                      />
                    </div>

                    {/* WASA Water */}
                    <div>
                      <label className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1 mb-1">
                        <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                        WASA Water Bill (BDT)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={waterBill}
                        onChange={(e) => setWaterBill(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>

                    {/* Gas Bill */}
                    <div>
                      <label className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1 mb-1">
                        <Flame className="w-3.5 h-3.5 text-orange-500" />
                        Titas Gas Bill
                      </label>
                      <select
                        value={gasBillType}
                        onChange={(e) => setGasBillType(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      >
                        <option value="double">Double Burner (৳1,080)</option>
                        <option value="single">Single Burner (৳990)</option>
                        <option value="custom">Prepaid Gas / Custom</option>
                      </select>
                      {gasBillType === "custom" && (
                        <input
                          type="number"
                          min="0"
                          placeholder="Amount in BDT"
                          value={gasCustomAmount}
                          onChange={(e) => setGasCustomAmount(Number(e.target.value))}
                          className="w-full mt-1.5 p-1.5 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                        />
                      )}
                    </div>

                    {/* Service Charge */}
                    <div>
                      <label className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1 mb-1">
                        <Shield className="w-3.5 h-3.5 text-indigo-500" />
                        Building Service & Guard
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={serviceCharge}
                        onChange={(e) => setServiceCharge(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>

                    {/* Wi-Fi Internet */}
                    <div>
                      <label className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1 mb-1">
                        <Wifi className="w-3.5 h-3.5 text-blue-500" />
                        Wi-Fi Broadband (BDT)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={internetBill}
                        onChange={(e) => setInternetBill(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>

                    {/* Maid/Cook */}
                    <div>
                      <label className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1 mb-1">
                        <Utensils className="w-3.5 h-3.5 text-rose-500" />
                        Cook / Maid (Bua) Wage
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="200"
                        value={maidWage}
                        onChange={(e) => setMaidWage(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>

                    {/* Garbage Waste */}
                    <div>
                      <label className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1 mb-1">
                        <Trash2 className="w-3.5 h-3.5 text-gray-500" />
                        Waste / Cleaner (BDT)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={wasteBill}
                        onChange={(e) => setWasteBill(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Flatmate List Configuration */}
                <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Users className="w-4 h-4 text-teal-600" />
                      Flatmates / Members ({flatmates.length})
                    </h3>
                    <button
                      type="button"
                      onClick={addFlatmate}
                      className="text-xs bg-teal-600 hover:bg-teal-700 text-white px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Member
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {flatmates.map((f, idx) => (
                      <div
                        key={f.id}
                        className="bg-white dark:bg-gray-800 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={f.name}
                            onChange={(e) => updateFlatmate(f.id, "name", e.target.value)}
                            className="font-semibold text-xs text-gray-900 dark:text-gray-100 bg-transparent border-b border-transparent focus:border-teal-500 focus:outline-none flex-1"
                          />
                          {flatmates.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFlatmate(f.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Remove flatmate"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <div>
                            <span className="text-[10px] text-gray-500 block">Room Rent (৳)</span>
                            <input
                              type="number"
                              min="0"
                              step="200"
                              value={f.roomRent}
                              onChange={(e) => updateFlatmate(f.id, "roomRent", Number(e.target.value))}
                              className="w-full p-1 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900 text-xs"
                            />
                          </div>

                          <div className="flex flex-col justify-end">
                            <label className="flex items-center gap-1.5 cursor-pointer py-1 text-[11px] text-gray-700 dark:text-gray-300">
                              <input
                                type="checkbox"
                                checked={f.hasAc}
                                onChange={(e) => updateFlatmate(f.id, "hasAc", e.target.checked)}
                                className="rounded text-teal-600 focus:ring-teal-500"
                              />
                              <span>Has AC Unit</span>
                            </label>
                          </div>

                          <div>
                            <span className="text-[10px] text-gray-500 block">Adjust (৳ +/-)</span>
                            <input
                              type="number"
                              step="50"
                              value={f.customAdjustment}
                              onChange={(e) => updateFlatmate(f.id, "customAdjustment", Number(e.target.value))}
                              className="w-full p-1 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900 text-xs"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Summary Column: Total & Per-Person Breakdown (6 cols) */}
              <div className="lg:col-span-6 space-y-4">
                {/* Total Summary Card */}
                <div className="bg-gradient-to-br from-teal-900 via-cyan-950 to-slate-900 text-white p-5 rounded-2xl shadow-xl border border-teal-500/20 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-teal-300 font-semibold mb-1">
                          Total Flat Monthly Expenses
                        </div>
                        <div className="text-3xl font-extrabold text-yellow-300">
                          ৳{grandTotal.toLocaleString()} <span className="text-sm font-normal text-teal-200">BDT</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full text-teal-200 border border-white/10">
                          {flatmates.length} Members
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10 text-xs">
                      <div>
                        <span className="text-teal-300">Base House Rent:</span>{" "}
                        <span className="font-semibold text-white">৳{Number(rentAmount).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-teal-300">Total Utilities:</span>{" "}
                        <span className="font-semibold text-white">৳{sharedUtilitiesTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Per Flatmate Calculated Dues */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                  <h4 className="font-bold text-xs text-gray-800 dark:text-gray-200 uppercase tracking-wider flex items-center justify-between">
                    <span>Individual Payment Breakdown</span>
                    <span className="text-teal-600 dark:text-teal-400 lowercase text-[11px] font-normal">
                      Fair AC & utilities weighted
                    </span>
                  </h4>

                  <div className="space-y-2.5">
                    {flatmateBreakdown.map((f, idx) => (
                      <div
                        key={`due-${f.id}`}
                        className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200/80 dark:border-gray-600/60 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            {f.name}
                            {f.hasAc && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-1.5 py-0.2 rounded font-medium">
                                AC
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-300 mt-0.5">
                            Rent: ৳{f.individualRent.toLocaleString()} • Electric: ৳{f.individualElectric.toLocaleString()} • Other: ৳{f.otherUtilities.toLocaleString()}
                            {f.customAdjustment !== 0 && ` • Adj: ৳${f.customAdjustment}`}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-extrabold text-teal-700 dark:text-teal-300">
                            ৳{f.totalToPay.toLocaleString()}
                          </div>
                          <span className="text-[10px] text-gray-400">BDT Total</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyBreakdown}
                    className="w-full mt-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Breakdown Copied to Clipboard!" : "Copy WhatsApp/Messenger Group Summary"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PREPAID ELECTRIC METER CALCULATOR */}
          {activeTab === "prepaid" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Inputs (6 cols) */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 space-y-3">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-600" />
                      Prepaid Electric Meter Card Recharge
                    </h3>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                          Recharge Amount (BDT)
                        </label>
                        <input
                          type="number"
                          min="100"
                          step="100"
                          value={rechargeAmount}
                          onChange={(e) => setRechargeAmount(Number(e.target.value))}
                          className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-sm font-bold text-gray-900 dark:text-gray-100"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                            Distributor
                          </label>
                          <select
                            value={meterProvider}
                            onChange={(e) => setMeterProvider(e.target.value)}
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-xs"
                          >
                            <option value="DESCO">DESCO (Dhaka North)</option>
                            <option value="DPDC">DPDC (Dhaka South)</option>
                            <option value="BPDB">BPDB (Chittagong/Sylhet)</option>
                            <option value="NESCO">NESCO (Rajshahi/Rangpur)</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                            Sanctioned Load (kW)
                          </label>
                          <select
                            value={sanctionedLoadKw}
                            onChange={(e) => setSanctionedLoadKw(Number(e.target.value))}
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-xs"
                          >
                            <option value={1}>1 kW (Bachelor/Room)</option>
                            <option value={2}>2 kW (Standard 2 BHK)</option>
                            <option value={3}>3 kW (3 BHK + 1 AC)</option>
                            <option value={5}>5 kW (4 BHK + Multiple ACs)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                            Meter Monthly Rent (BDT)
                          </label>
                          <input
                            type="number"
                            value={meterRent}
                            onChange={(e) => setMeterRent(Number(e.target.value))}
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-xs"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                            Emergency Balance Taken (BDT)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={existingEmergencyDeduction}
                            onChange={(e) => setExistingEmergencyDeduction(Number(e.target.value))}
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-xs"
                            placeholder="0 if none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calculation Output Card (6 cols) */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-gray-900 text-white p-5 rounded-2xl shadow-xl border border-amber-500/20">
                    <div className="text-xs uppercase tracking-wider text-amber-300 font-semibold mb-1">
                      Estimated Units Received
                    </div>
                    <div className="text-4xl font-extrabold text-yellow-400 mb-1 flex items-baseline gap-2">
                      <span>{prepaidCalculation.estimatedUnits}</span>
                      <span className="text-sm font-semibold text-amber-200">kWh Units</span>
                    </div>
                    <p className="text-[11px] text-gray-300 mb-4">
                      Net usable electricity on recharge token for {meterProvider}
                    </p>

                    <div className="space-y-2 border-t border-white/10 pt-3 text-xs">
                      <div className="flex justify-between text-gray-200">
                        <span>Total Paid:</span>
                        <span className="font-bold text-white">৳{prepaidCalculation.gross} BDT</span>
                      </div>
                      <div className="flex justify-between text-amber-200">
                        <span>Demand Charge ({sanctionedLoadKw} kW @ ৳42):</span>
                        <span>-৳{prepaidCalculation.demandCharge}</span>
                      </div>
                      <div className="flex justify-between text-amber-200">
                        <span>Meter Rent (Monthly):</span>
                        <span>-৳{prepaidCalculation.mRent}</span>
                      </div>
                      {prepaidCalculation.emergencyDeduction > 0 && (
                        <div className="flex justify-between text-rose-300">
                          <span>Emergency Credit Repayment:</span>
                          <span>-৳{prepaidCalculation.emergencyDeduction}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-amber-200">
                        <span>Govt 5% VAT:</span>
                        <span>-৳{prepaidCalculation.estimatedVat}</span>
                      </div>
                      <div className="flex justify-between text-emerald-300 font-semibold pt-1 border-t border-white/10">
                        <span>Net Converted to Energy:</span>
                        <span>৳{prepaidCalculation.netForEnergy} BDT</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BERC Slab Rates Reference Table */}
              <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <h4 className="font-bold text-xs text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-500" />
                  Official Bangladesh Energy Regulatory Commission (BERC) Residential Slabs
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {ELECTRICITY_SLABS.map((slab) => (
                    <div
                      key={slab.label}
                      className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="font-medium text-gray-600 dark:text-gray-300 text-[11px]">{slab.label}</div>
                      <div className="text-sm font-bold text-teal-600 dark:text-teal-400">৳{slab.rate} / unit</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DHAKA TENANCY SAVING TIPS */}
          {activeTab === "tips" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-teal-50/60 dark:bg-teal-950/30 rounded-xl border border-teal-200 dark:border-teal-900 space-y-2">
                <div className="font-bold text-teal-950 dark:text-teal-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  1. AC Optimal Setting (26°C Rule)
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                  Setting your split AC at 26°C with ceiling fan on low speed reduces power consumption by up to 35% compared to 18°C, saving ~৳1,200 to ৳2,000 BDT per month on Dhaka prepaid meters.
                </p>
              </div>

              <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900 space-y-2">
                <div className="font-bold text-amber-950 dark:text-amber-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  2. Prepaid Meter Emergency Balance Codes
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                  If your electric prepaid meter balance drops to 0 at midnight in Dhaka, press <strong>811#</strong> (Hexing meter) or press and hold the <strong>Enter/Red button</strong> for 5 seconds to activate emergency credit till morning.
                </p>
              </div>

              <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900 space-y-2">
                <div className="font-bold text-blue-950 dark:text-blue-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  3. Sub-meter vs Main Meter Disputes
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                  In sublets and bachelor flats with analog sub-meters, always calculate by unit differences (Current Reading - Previous Reading) multiplied by Step 2/3 average rate (~৳7.5/unit) plus flat sub-meter maintenance share.
                </p>
              </div>

              <div className="p-4 bg-purple-50/60 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-900 space-y-2">
                <div className="font-bold text-purple-950 dark:text-purple-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  4. Geyser & Water Motor Timing
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                  Turn off bathroom geysers 15 minutes before showering. Keeping 1500W water heaters constantly ON on prepaid lines can burn up to ৳80-120 BDT per day unnecessarily.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-teal-500" />
            <span>Tariff values based on BERC residential gazette rates</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCopyBreakdown}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Receipt className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy Split Summary"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
