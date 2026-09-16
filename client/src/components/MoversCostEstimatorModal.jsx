import { useState, useMemo } from "react";
import {
  X,
  Truck,
  Package,
  Layers,
  Wrench,
  ShieldCheck,
  Phone,
  Calculator,
  Info,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  ArrowRight,
  FileText
} from "lucide-react";

// Common Dhaka & BD Transit Distances Reference
const DHAKA_AREAS = [
  "Mirpur",
  "Dhanmondi",
  "Uttara",
  "Gulshan",
  "Banani",
  "Bashundhara R/A",
  "Mohammadpur",
  "Badda",
  "Rampura",
  "Khilgaon",
  "Motijheel",
  "Old Dhaka",
  "Puran Dhaka",
  "Lalmatia",
  "Kalyanpur",
  "Niketan",
  "Baridhara",
  "Agargaon",
  "Chittagong (Agrabad/GEC)",
  "Sylhet (Zindabazar)",
  "Other Area"
];

const APARTMENT_TYPES = [
  {
    id: "bachelor",
    label: "Bachelor / Single Room Sublet",
    subtitle: "Bed, study desk, 1-2 suitcases, few cartons",
    recommendedTruck: "7-ft Open Pickup",
    defaultLabor: 1,
    baseFare: 1800,
    packingBase: 600,
  },
  {
    id: "1-2bhk",
    label: "1 to 2 BHK Small Flat",
    subtitle: "1-2 beds, dining table, fridge, washing machine, cartons",
    recommendedTruck: "7-ft or 9-ft Covered Pickup",
    defaultLabor: 2,
    baseFare: 2800,
    packingBase: 1200,
  },
  {
    id: "3bhk",
    label: "3 BHK Standard Family Apartment",
    subtitle: "3 bedrooms, drawing/dining sets, appliances, 15+ cartons",
    recommendedTruck: "12-ft to 14-ft Covered Truck",
    defaultLabor: 4,
    baseFare: 4500,
    packingBase: 2400,
  },
  {
    id: "4bhk+",
    label: "4+ BHK / Duplex / Heavy Furnished",
    subtitle: "Heavy solid wood furniture, multi-trip or 2x covered trucks",
    recommendedTruck: "14-ft Heavy Covered Van / 2x Pickups",
    defaultLabor: 6,
    baseFare: 7500,
    packingBase: 4200,
  },
];

const HANDYMAN_OPTIONS = [
  { id: "ac_dismantle", label: "Split AC Uninstallation & Fitting", rate: 1800, unit: "per AC", defaultCount: 0 },
  { id: "geyser", label: "Geyser / Water Heater Fitting", rate: 600, unit: "per geyser", defaultCount: 0 },
  { id: "ceiling_fans", label: "Ceiling Fan & Chandelier Dismantling", rate: 150, unit: "per fan", defaultCount: 0 },
  { id: "tv_mount", label: "Wall-Mount TV & Heavy Mirror Fitting", rate: 450, unit: "per item", defaultCount: 0 },
  { id: "wardrobe", label: "Master Bed & Wardrobe Disassembly/Fit", rate: 900, unit: "per set", defaultCount: 0 },
];

const PACKING_SUPPLIES = [
  { id: "cartons", label: "Heavy Duty Corrugated Carton Boxes", rate: 90, unit: "box", defaultQty: 10 },
  { id: "bubble_wrap", label: "Bubble Wrap Roll (50 meters)", rate: 650, unit: "roll", defaultQty: 1 },
  { id: "packing_tape", label: "Industrial Adhesive Tape & Stretch Film", rate: 350, unit: "bundle", defaultQty: 1 },
];

export default function MoversCostEstimatorModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("estimator"); // "estimator" | "handyman" | "directory" | "tips"
  
  // Form State
  const [originArea, setOriginArea] = useState("Dhanmondi");
  const [destArea, setDestArea] = useState("Mirpur");
  const [estimatedKm, setEstimatedKm] = useState(12);
  const [apartmentType, setApartmentType] = useState("3bhk");
  const [originFloor, setOriginFloor] = useState(3);
  const [originHasLift, setOriginHasLift] = useState(true);
  const [destFloor, setDestFloor] = useState(4);
  const [destHasLift, setDestHasLift] = useState(false);
  const [laborCount, setLaborCount] = useState(4);
  const [includePacking, setIncludePacking] = useState(true);

  // Handyman & Technician counts
  const [handymanItems, setHandymanItems] = useState({
    ac_dismantle: 1,
    geyser: 1,
    ceiling_fans: 3,
    tv_mount: 1,
    wardrobe: 1,
  });

  // Supply counts
  const [supplies, setSupplies] = useState({
    cartons: 10,
    bubble_wrap: 1,
    packing_tape: 2,
  });

  const [copied, setCopied] = useState(false);

  // Update defaults when apartment type changes
  const handleApartmentChange = (typeId) => {
    setApartmentType(typeId);
    const selected = APARTMENT_TYPES.find((t) => t.id === typeId);
    if (selected) {
      setLaborCount(selected.defaultLabor);
    }
  };

  // Pricing Calculation Engine
  const estimate = useMemo(() => {
    const selectedApt = APARTMENT_TYPES.find((t) => t.id === apartmentType) || APARTMENT_TYPES[1];
    
    // 1. Transport Cost: Base fare + per KM charge (approx 65 BDT/km over 5km)
    const extraKm = Math.max(0, estimatedKm - 5);
    const transportCost = selectedApt.baseFare + extraKm * 70;

    // 2. Labor Cost: Standard daily/trip wage per helper in BD (~700-900 BDT per helper)
    const baseLaborCost = laborCount * 800;

    // 3. Floor Carrying Surcharges (Without Elevator)
    // In Dhaka, carrying up/down stairs typically incurs 150 BDT/floor per item load or flat ~200/floor
    let floorSurcharge = 0;
    if (!originHasLift && originFloor > 1) {
      floorSurcharge += (originFloor - 1) * 250 * Math.max(1, Math.floor(laborCount / 2));
    }
    if (!destHasLift && destFloor > 1) {
      floorSurcharge += (destFloor - 1) * 250 * Math.max(1, Math.floor(laborCount / 2));
    }

    // 4. Handyman & Technician Costs
    let technicianCost = 0;
    HANDYMAN_OPTIONS.forEach((item) => {
      const count = handymanItems[item.id] || 0;
      technicianCost += count * item.rate;
    });

    // 5. Packing Materials Cost
    let packingMaterialsCost = 0;
    if (includePacking) {
      PACKING_SUPPLIES.forEach((supply) => {
        const qty = supplies[supply.id] || 0;
        packingMaterialsCost += qty * supply.rate;
      });
      // Add standard baseline if selected
      packingMaterialsCost = Math.max(packingMaterialsCost, selectedApt.packingBase);
    }

    const subtotal = transportCost + baseLaborCost + floorSurcharge + technicianCost + packingMaterialsCost;
    const minEstimate = Math.round(subtotal * 0.95);
    const maxEstimate = Math.round(subtotal * 1.15);

    return {
      selectedApt,
      transportCost,
      baseLaborCost,
      floorSurcharge,
      technicianCost,
      packingMaterialsCost,
      subtotal,
      minEstimate,
      maxEstimate,
    };
  }, [
    apartmentType,
    estimatedKm,
    laborCount,
    originFloor,
    originHasLift,
    destFloor,
    destHasLift,
    handymanItems,
    includePacking,
    supplies,
  ]);

  const handleCopySummary = () => {
    const summaryText = `🏠 Basha Lagbe - House Shifting & Moving Cost Estimate
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Route: ${originArea} ➔ ${destArea} (~${estimatedKm} km)
📦 Apartment: ${estimate.selectedApt.label}
🚛 Recommended Vehicle: ${estimate.selectedApt.recommendedTruck}
👷 Labors / Helpers: ${laborCount} persons

💰 COST BREAKDOWN:
• Vehicle & Transport Fare: ৳${estimate.transportCost.toLocaleString()}
• Helper / Labor Charges: ৳${estimate.baseLaborCost.toLocaleString()}
• Stair Carrying Surcharge: ৳${estimate.floorSurcharge.toLocaleString()} (${!originHasLift ? `Origin Fl ${originFloor} (No lift)` : 'Origin Lift OK'}, ${!destHasLift ? `Dest Fl ${destFloor} (No lift)` : 'Dest Lift OK'})
• Technician / Handyman (AC, Geyser, Bed): ৳${estimate.technicianCost.toLocaleString()}
• Packing Materials (Cartons, Wrap): ৳${estimate.packingMaterialsCost.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💵 ESTIMATED TOTAL RANGE: ৳${estimate.minEstimate.toLocaleString()} - ৳${estimate.maxEstimate.toLocaleString()} BDT
Generated via Basha Lagbe Platform`;

    navigator.clipboard.writeText(summaryText);
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
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
              <Truck className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                House Shifting & Moving Cost Estimator
                <span className="hidden sm:inline-block text-xs bg-yellow-400 text-blue-950 font-bold px-2 py-0.5 rounded-full">
                  BD Rates
                </span>
              </h2>
              <p className="text-xs text-blue-100">
                Accurate truck fare, labor charges, stair surcharge & handyman cost breakdown in Bangladesh
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

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 px-4 pt-2 shrink-0 overflow-x-auto no-scrollbar">
          {[
            { id: "estimator", label: "Cost Calculator", icon: Calculator },
            { id: "handyman", label: "AC & Technicians", icon: Wrench },
            { id: "directory", label: "Mover Directory & Truck Stands", icon: Phone },
            { id: "tips", label: "Moving Day Pro-Tips", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2.5 px-4 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? "border-blue-600 text-blue-600 dark:text-blue-400 font-semibold"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* TAB 1: ESTIMATOR */}
          {activeTab === "estimator" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Form Controls (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                {/* 1. Route & Distance */}
                <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/40">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
                    Moving Route & Distance
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
                        Current Area (From)
                      </label>
                      <select
                        value={originArea}
                        onChange={(e) => setOriginArea(e.target.value)}
                        className="w-full text-sm rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 p-2 focus:ring-2 focus:ring-blue-500"
                      >
                        {DHAKA_AREAS.map((a) => (
                          <option key={`from-${a}`} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
                        New Apartment (To)
                      </label>
                      <select
                        value={destArea}
                        onChange={(e) => setDestArea(e.target.value)}
                        className="w-full text-sm rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 p-2 focus:ring-2 focus:ring-blue-500"
                      >
                        {DHAKA_AREAS.map((a) => (
                          <option key={`to-${a}`} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      <span>Approximate Road Distance</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{estimatedKm} KM</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="60"
                      step="1"
                      value={estimatedKm}
                      onChange={(e) => setEstimatedKm(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>

                {/* 2. Apartment Size */}
                <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
                    Apartment Size & Load
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {APARTMENT_TYPES.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleApartmentChange(type.id)}
                        className={`text-left p-3 rounded-xl border transition-all ${
                          apartmentType === type.id
                            ? "bg-blue-50/80 dark:bg-blue-900/30 border-blue-600 shadow-sm ring-1 ring-blue-600"
                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <div className="font-semibold text-xs text-gray-900 dark:text-gray-100 flex items-center justify-between">
                          {type.label}
                          {apartmentType === type.id && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-snug">
                          {type.subtitle}
                        </p>
                        <div className="mt-2 text-[10px] font-medium text-blue-700 dark:text-blue-300 bg-blue-100/50 dark:bg-blue-950/60 px-2 py-0.5 rounded inline-block">
                          🚛 {type.recommendedTruck}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Floors & Lift Status */}
                <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">3</span>
                    Floor Level & Elevator (Lift) Access
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Origin Building */}
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Origin Floor (Pickup)
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <select
                          value={originFloor}
                          onChange={(e) => setOriginFloor(Number(e.target.value))}
                          className="text-xs p-1.5 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                        >
                          <option value={1}>Ground Floor / 1st</option>
                          <option value={2}>2nd Floor</option>
                          <option value={3}>3rd Floor</option>
                          <option value={4}>4th Floor</option>
                          <option value={5}>5th Floor</option>
                          <option value={6}>6th Floor</option>
                          <option value={7}>7th Floor +</option>
                        </select>
                      </div>
                      <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={originHasLift}
                          onChange={(e) => setOriginHasLift(e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>Elevator / Lift Available</span>
                      </label>
                    </div>

                    {/* Destination Building */}
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Destination Floor (Drop-off)
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <select
                          value={destFloor}
                          onChange={(e) => setDestFloor(Number(e.target.value))}
                          className="text-xs p-1.5 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                        >
                          <option value={1}>Ground Floor / 1st</option>
                          <option value={2}>2nd Floor</option>
                          <option value={3}>3rd Floor</option>
                          <option value={4}>4th Floor</option>
                          <option value={5}>5th Floor</option>
                          <option value={6}>6th Floor</option>
                          <option value={7}>7th Floor +</option>
                        </select>
                      </div>
                      <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={destHasLift}
                          onChange={(e) => setDestHasLift(e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>Elevator / Lift Available</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 4. Helpers & Packing Toggle */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Helpers / Porters:</span>
                    <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                      <button
                        type="button"
                        onClick={() => setLaborCount(Math.max(1, laborCount - 1))}
                        className="px-2.5 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-2 font-bold text-gray-900 dark:text-gray-100">{laborCount}</span>
                      <button
                        type="button"
                        onClick={() => setLaborCount(Math.min(10, laborCount + 1))}
                        className="px-2.5 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includePacking}
                      onChange={(e) => setIncludePacking(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Include Packing Materials & Cartons</span>
                  </label>
                </div>
              </div>

              {/* Right Column: Cost Summary Card (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white p-5 rounded-2xl shadow-xl border border-blue-500/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Truck className="w-32 h-32" />
                  </div>

                  <div className="relative z-10">
                    <div className="text-xs uppercase tracking-wider text-blue-300 font-semibold mb-1">
                      Estimated Moving Budget
                    </div>
                    <div className="text-3xl font-extrabold text-yellow-400 mb-1">
                      ৳{estimate.minEstimate.toLocaleString()} - ৳{estimate.maxEstimate.toLocaleString()}
                    </div>
                    <p className="text-[11px] text-blue-200 mb-4">
                      Estimated range for {estimate.selectedApt.label} ({estimatedKm} km)
                    </p>

                    {/* Breakdown List */}
                    <div className="space-y-2 border-t border-white/10 pt-3 text-xs">
                      <div className="flex justify-between text-blue-100">
                        <span className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-blue-300" />
                          Vehicle ({estimate.selectedApt.recommendedTruck})
                        </span>
                        <span className="font-semibold text-white">৳{estimate.transportCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-blue-100">
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-indigo-300" />
                          Helpers / Porters ({laborCount} persons)
                        </span>
                        <span className="font-semibold text-white">৳{estimate.baseLaborCost.toLocaleString()}</span>
                      </div>
                      {estimate.floorSurcharge > 0 && (
                        <div className="flex justify-between text-amber-200">
                          <span className="flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5" />
                            Stair Carrying (No Lift Surcharge)
                          </span>
                          <span className="font-semibold">৳{estimate.floorSurcharge.toLocaleString()}</span>
                        </div>
                      )}
                      {estimate.technicianCost > 0 && (
                        <div className="flex justify-between text-blue-100">
                          <span className="flex items-center gap-1.5">
                            <Wrench className="w-3.5 h-3.5 text-yellow-300" />
                            AC & Handyman Services
                          </span>
                          <span className="font-semibold text-white">৳{estimate.technicianCost.toLocaleString()}</span>
                        </div>
                      )}
                      {estimate.packingMaterialsCost > 0 && (
                        <div className="flex justify-between text-blue-100">
                          <span className="flex items-center gap-1.5">
                            <Package className="w-3.5 h-3.5 text-cyan-300" />
                            Packing Materials & Boxes
                          </span>
                          <span className="font-semibold text-white">৳{estimate.packingMaterialsCost.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopySummary}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2.5 px-3 rounded-xl backdrop-blur-sm border border-white/20 transition-all flex items-center justify-center gap-1.5"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Estimate Copied!" : "Copy Full Breakdown"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Advice banner */}
                <div className="bg-amber-50 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    Dhaka Truck Restriction Note:
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Open/Covered large trucks (over 1.5 ton) can only enter inner Dhaka streets after <strong>8:00 PM</strong> and before <strong>6:00 AM</strong>. Pickup vans (7ft/9ft) are allowed 24/7.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HANDYMAN & TECHNICIANS */}
          {activeTab === "handyman" && (
            <div className="space-y-5">
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-200 dark:border-blue-900">
                <h3 className="font-bold text-sm text-blue-900 dark:text-blue-200 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-blue-600" />
                  Electrical & Furniture Installation Rates in Bangladesh
                </h3>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Standard market rates in Dhaka/Chittagong for uninstallation from old flat and reinstallation in new flat.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {HANDYMAN_OPTIONS.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-xs text-gray-900 dark:text-gray-100">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        Avg. ৳{item.rate} ({item.unit})
                      </div>
                    </div>
                    <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                      <button
                        type="button"
                        onClick={() =>
                          setHandymanItems((prev) => ({
                            ...prev,
                            [item.id]: Math.max(0, (prev[item.id] || 0) - 1),
                          }))
                        }
                        className="px-2.5 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                      >
                        -
                      </button>
                      <span className="px-2.5 font-bold text-xs text-gray-900 dark:text-gray-100">
                        {handymanItems[item.id] || 0}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setHandymanItems((prev) => ({
                            ...prev,
                            [item.id]: (prev[item.id] || 0) + 1,
                          }))
                        }
                        className="px-2.5 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Packing Materials Config */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-semibold text-xs text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-indigo-500" />
                  Packing Supplies Quantity
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PACKING_SUPPLIES.map((supply) => (
                    <div
                      key={supply.id}
                      className="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-lg border border-gray-200 dark:border-gray-700 text-xs"
                    >
                      <div className="font-medium text-gray-800 dark:text-gray-200">{supply.label}</div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">৳{supply.rate} / {supply.unit}</div>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={supplies[supply.id] || 0}
                        onChange={(e) =>
                          setSupplies((prev) => ({
                            ...prev,
                            [supply.id]: Number(e.target.value),
                          }))
                        }
                        className="w-full text-xs p-1.5 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MOVERS DIRECTORY & TRUCK STANDS */}
          {activeTab === "directory" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Apps & Digital Logistics */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                  <h4 className="font-bold text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Digital Apps & On-Demand Booking
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="font-bold text-gray-900 dark:text-white">Truck Lagbe (App & Web)</div>
                      <p className="text-gray-500 dark:text-gray-300 text-[11px]">Instant online truck bidding & fixed price pickups across Bangladesh.</p>
                      <span className="text-blue-600 font-semibold text-[11px] mt-1 inline-block">📞 Hotline: 09638-788252</span>
                    </div>
                    <div className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="font-bold text-gray-900 dark:text-white">Sheba.xyz House Shifting</div>
                      <p className="text-gray-500 dark:text-gray-300 text-[11px]">End-to-end packing, electrician, AC tech and moving package.</p>
                      <span className="text-blue-600 font-semibold text-[11px] mt-1 inline-block">📞 Hotline: 16516</span>
                    </div>
                  </div>
                </div>

                {/* Major Truck Stands in Dhaka */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                  <h4 className="font-bold text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Major Local Truck / Pickup Stands
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="font-bold text-gray-900 dark:text-white">Tejgaon Truck Stand</div>
                      <p className="text-gray-500 dark:text-gray-300 text-[11px]">Largest truck hub in Dhaka. Best for 14ft, 18ft heavy covered vans & long distances.</p>
                    </div>
                    <div className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="font-bold text-gray-900 dark:text-white">Mirpur 10 / Gabtoli & Uttara Stands</div>
                      <p className="text-gray-500 dark:text-gray-300 text-[11px]">7ft & 9ft pickup vans ready for instant local city shiftings.</p>
                    </div>
                    <div className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="font-bold text-gray-900 dark:text-white">Dhanmondi / Shankar Pickup Point</div>
                      <p className="text-gray-500 dark:text-gray-300 text-[11px]">Quick pickups for Dhanmondi, Mohammadpur & Lalmatia flat moves.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MOVING DAY PRO-TIPS */}
          {activeTab === "tips" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900 space-y-2">
                  <div className="font-bold text-blue-950 dark:text-blue-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    1. Inform Building Management (Old & New)
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                    Most residential apartments in Dhanmondi, Bashundhara, and Uttara require 24-48 hours notice before using elevators for shifting heavy furniture. Check if service elevator pads are required.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900 space-y-2">
                  <div className="font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    2. Take Utility Meter Timestamp Photos
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                    Snap a clear phone photo of the DPDC/DESCO prepaid electric meter units and WASA sub-meter before loading the truck. Avoid paying for previous tenant arrears.
                  </p>
                </div>

                <div className="p-4 bg-purple-50/60 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-900 space-y-2">
                  <div className="font-bold text-purple-950 dark:text-purple-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    3. Label Carton Boxes by Room
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                    Mark boxes as “Master Bed”, “Kitchen Fragile”, “Study”. Porters can place them in their respective rooms directly, saving hours of unpacking turmoil.
                  </p>
                </div>

                <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900 space-y-2">
                  <div className="font-bold text-amber-950 dark:text-amber-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    4. Keep Personal Valuables & NID in Personal Bag
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                    Never pack gold jewelry, passports, original educational certificates, or cash inside truck cartons. Carry them personally in a secure backpack.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            <span>Fares updated based on current fuel and market transport charges in BD</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCopySummary}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <FileText className="w-3.5 h-3.5" />}
              {copied ? "Copied to Clipboard!" : "Copy Estimate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
