import React, { useState, useMemo } from "react";
import {
  Wrench,
  Hammer,
  Plus,
  Trash2,
  Printer,
  Copy,
  CheckCircle2,
  AlertTriangle,
  FileText,
  HelpCircle,
  Clock,
  ShieldCheck,
  TrendingDown,
  Info,
  X,
  Droplet,
  Zap,
  Flame,
  DoorClosed,
  AirVent,
  SlidersHorizontal,
  DollarSign
} from "lucide-react";

export default function PropertyMaintenanceTrackerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("ledger"); // "ledger" | "voucher" | "rates" | "responsibility"
  const [lang, setLang] = useState("en"); // "en" | "bn"
  const [copied, setCopied] = useState(false);

  // Property Details
  const [propertyInfo, setPropertyInfo] = useState({
    flatNumber: "Flat 4-B, 4th Floor",
    buildingName: "Greenview Palace, Holding #24/A",
    roadSector: "Road 11, Sector 4",
    areaCity: "Uttara, Dhaka-1230",
    landlordName: "Mohammad Rafiqul Islam",
    landlordPhone: "+880 1711-000000",
    tenantName: "Hasibullah Khan",
    tenantPhone: "+880 1819-000000",
    settlementMonth: "October 2026",
    rentAmount: 35000,
  });

  // Maintenance Records
  const [records, setRecords] = useState([
    {
      id: 1,
      date: "2026-09-18",
      category: "plumbing",
      title: "Master Bath Geyser Heating Coil Replacement",
      description: "Ariston 30L geyser stopped heating due to mineral scaling on element. New copper coil installed.",
      technicianName: "Farid Mistri (Plumber/Electrician)",
      technicianPhone: "+880 1712-334455",
      materialCost: 1200,
      laborCost: 600,
      paidBy: "tenant", // "tenant" | "landlord"
      settlementType: "rent_deduct", // "rent_deduct" | "direct_reimburse" | "tenant_own"
      status: "approved", // "approved" | "pending" | "in_progress"
    },
    {
      id: 2,
      date: "2026-09-22",
      category: "electrical",
      title: "Main DB Board 32A Double-Pole Circuit Breaker",
      description: "Old Havells breaker was tripping repeatedly due to overload. Replaced with Schneider 32A MCB.",
      technicianName: "Zahid Electrician",
      technicianPhone: "+880 1819-998877",
      materialCost: 850,
      laborCost: 400,
      paidBy: "tenant",
      settlementType: "rent_deduct",
      status: "approved",
    },
    {
      id: 3,
      date: "2026-09-24",
      category: "motor",
      title: "Rooftop Water Motor Capacitor & Ball Bearing",
      description: "Water pump sound became very loud. Serviced bearing and replaced 35uF capacitor.",
      technicianName: "Uttara Motor Works",
      technicianPhone: "+880 1914-556677",
      materialCost: 950,
      laborCost: 800,
      paidBy: "landlord",
      settlementType: "direct_reimburse",
      status: "approved",
    },
  ]);

  // New Record Form State
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "plumbing",
    title: "",
    description: "",
    technicianName: "",
    technicianPhone: "",
    materialCost: 0,
    laborCost: 0,
    paidBy: "tenant",
    settlementType: "rent_deduct",
    status: "approved",
  });

  const categories = {
    plumbing: { labelEn: "Plumbing & Sanitary (প্লাম্বিং ও স্যানিটারি)", icon: Droplet, color: "text-blue-600 bg-blue-50 border-blue-200" },
    electrical: { labelEn: "Electrical & Wiring (বৈদ্যুতিক ফিটিংস)", icon: Zap, color: "text-amber-600 bg-amber-50 border-amber-200" },
    motor: { labelEn: "Water Motor / Pump (পানির মোটর ও পাম্প)", icon: SlidersHorizontal, color: "text-cyan-600 bg-cyan-50 border-cyan-200" },
    gas: { labelEn: "Gas Line & Burner (গ্যাস লাইন ও চুলা)", icon: Flame, color: "text-rose-600 bg-rose-50 border-rose-200" },
    ac: { labelEn: "AC Servicing & Gas Refill (এসি মেরামত)", icon: AirVent, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    carpentry: { labelEn: "Carpentry & Locks (কাঠের কাজ ও লক)", icon: DoorClosed, color: "text-purple-600 bg-purple-50 border-purple-200" },
    damp: { labelEn: "Wall Dampness & Masonry (ড্যাম ও রাজমিস্ত্রি)", icon: Hammer, color: "text-orange-600 bg-orange-50 border-orange-200" },
  };

  const handlePropertyChange = (field, val) => {
    setPropertyInfo((prev) => ({ ...prev, [field]: val }));
  };

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!newRecord.title.trim()) return;
    setRecords((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...newRecord,
        materialCost: Number(newRecord.materialCost) || 0,
        laborCost: Number(newRecord.laborCost) || 0,
      },
    ]);
    setNewRecord({
      date: new Date().toISOString().split("T")[0],
      category: "plumbing",
      title: "",
      description: "",
      technicianName: "",
      technicianPhone: "",
      materialCost: 0,
      laborCost: 0,
      paidBy: "tenant",
      settlementType: "rent_deduct",
      status: "approved",
    });
  };

  const handleDeleteRecord = (id) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  // Financial Metrics
  const summary = useMemo(() => {
    let totalExpense = 0;
    let totalMaterial = 0;
    let totalLabor = 0;
    let tenantPaidTotal = 0;
    let landlordPaidTotal = 0;
    let rentDeductibleTotal = 0;

    records.forEach((r) => {
      const itemTotal = Number(r.materialCost) + Number(r.laborCost);
      totalExpense += itemTotal;
      totalMaterial += Number(r.materialCost);
      totalLabor += Number(r.laborCost);

      if (r.paidBy === "tenant") {
        tenantPaidTotal += itemTotal;
        if (r.settlementType === "rent_deduct") {
          rentDeductibleTotal += itemTotal;
        }
      } else {
        landlordPaidTotal += itemTotal;
      }
    });

    const netRentPayable = Math.max(0, Number(propertyInfo.rentAmount || 0) - rentDeductibleTotal);

    return {
      totalExpense,
      totalMaterial,
      totalLabor,
      tenantPaidTotal,
      landlordPaidTotal,
      rentDeductibleTotal,
      netRentPayable,
    };
  }, [records, propertyInfo.rentAmount]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    let md = `# PROPERTY MAINTENANCE & RENT ADJUSTMENT VOUCHER\n`;
    md += `**Property:** ${propertyInfo.flatNumber}, ${propertyInfo.buildingName}, ${propertyInfo.roadSector}, ${propertyInfo.areaCity}\n`;
    md += `**Landlord:** ${propertyInfo.landlordName} (${propertyInfo.landlordPhone}) | **Tenant:** ${propertyInfo.tenantName} (${propertyInfo.tenantPhone})\n`;
    md += `**Settlement Month:** ${propertyInfo.settlementMonth}\n\n`;
    md += `## Itemized Maintenance Log:\n`;
    records.forEach((r, idx) => {
      const cost = Number(r.materialCost) + Number(r.laborCost);
      md += `${idx + 1}. **${r.title}** (${r.date}) — ৳${cost.toLocaleString()} (Material: ৳${r.materialCost}, Labor: ৳${r.laborCost}) | Paid By: ${r.paidBy.toUpperCase()} | Settlement: ${r.settlementType}\n`;
      if (r.description) md += `   - *Note:* ${r.description} (Tech: ${r.technicianName} ${r.technicianPhone})\n`;
    });
    md += `\n## Financial Summary:\n`;
    md += `- **Base Monthly Rent:** ৳${Number(propertyInfo.rentAmount).toLocaleString()}\n`;
    md += `- **Total Maintenance Deductible:** -৳${summary.rentDeductibleTotal.toLocaleString()}\n`;
    md += `- **Net Adjusted Rent Payable for ${propertyInfo.settlementMonth}:** ৳${summary.netRentPayable.toLocaleString()}\n`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Standard Dhaka Rates Benchmarks (2026)
  const standardRates = [
    { item: "Water Motor Rewinding & Servicing", category: "Water Pump", parts: "৳800 - ৳1,500", labor: "৳700 - ৳1,200", total: "৳1,500 - ৳2,700" },
    { item: "Geyser Heating Element & Anode", category: "Sanitary", parts: "৳700 - ৳1,200", labor: "৳400 - ৳600", total: "৳1,100 - ৳1,800" },
    { item: "Commode Siphon Flush Mechanism Set", category: "Sanitary", parts: "৳600 - ৳1,100", labor: "৳300 - ৳500", total: "৳900 - ৳1,600" },
    { item: "AC Master Jet Chemical Wash (1.5 Ton)", category: "AC Cooling", parts: "৳200 (Chemical)", labor: "৳1,000 - ৳1,500", total: "৳1,200 - ৳1,700" },
    { item: "AC Refrigerant Gas Top-Up (R410A/R32)", category: "AC Cooling", parts: "৳2,200 - ৳3,200", labor: "৳500 - ৳800", total: "৳2,700 - ৳4,000" },
    { item: "Main Circuit Breaker (32A/63A DP)", category: "Electrical", parts: "৳650 - ৳1,200", labor: "৳300 - ৳500", total: "৳950 - ৳1,700" },
    { item: "Ceiling Fan Bearing & Capacitor Fix", category: "Electrical", parts: "৳250 - ৳400", labor: "৳250 - ৳400", total: "৳500 - ৳800" },
    { item: "Basin / Sink Bottle Trap & Flexible Pipe", category: "Plumbing", parts: "৳350 - ৳650", labor: "৳250 - ৳400", total: "৳600 - ৳1,050" },
    { item: "Main Entrance Godrej Cylinder Lock", category: "Carpentry", parts: "৳1,800 - ৳3,200", labor: "৳400 - ৳700", total: "৳2,200 - ৳3,900" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-amber-700 via-orange-700 to-rose-800 text-white px-5 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <Wrench className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">
                  {lang === "en" ? "Property Maintenance & Repair Manager" : "বাসা মেরামত ও ব্যয় সমন্বয় ট্র্যাকার"}
                </h2>
                <span className="text-[10px] bg-amber-300 text-amber-950 font-bold px-2 py-0.5 rounded-full uppercase">
                  Expense Ledger
                </span>
              </div>
              <p className="text-xs text-amber-100/90 mt-0.5">
                {lang === "en"
                  ? "Track repair costs, generate rent deduction vouchers & view standard Dhaka repair benchmarks"
                  : "বাসার যাবতীয় মেরামতের হিসাব, বাড়ি ভাড়ার সাথে কর্তন সমন্বয় ও ঢাকা মিস্ত্রি রেট চার্ট"}
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2">
            <div className="bg-amber-950/60 p-0.5 rounded-lg border border-amber-500/30 flex text-xs">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded-md font-semibold transition ${
                  lang === "en" ? "bg-white text-amber-950 shadow-sm" : "text-amber-200 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("bn")}
                className={`px-2 py-1 rounded-md font-semibold transition ${
                  lang === "bn" ? "bg-white text-amber-950 shadow-sm" : "text-amber-200 hover:text-white"
                }`}
              >
                বাংলা
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("ledger")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "ledger"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>1. Repair Ledger & Logs</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("voucher")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "voucher"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>2. Printable Rent Voucher</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("rates")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "rates"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>3. Dhaka Market Rates (2026)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("responsibility")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "responsibility"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>4. Legal Liability Guide</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-3 py-1.5 text-xs font-semibold bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? "Copied!" : "Copy Summary"}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-bold bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Voucher</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* TAB 1: LEDGER */}
          {activeTab === "ledger" && (
            <div className="space-y-6">
              
              {/* Top Financial Dashboard Widgets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase block">Total Repair Spend</span>
                  <span className="text-xl font-bold text-slate-900 block mt-0.5">৳{summary.totalExpense.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500">{records.length} repairs recorded</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5">
                  <span className="text-[11px] font-semibold text-blue-700 uppercase block">Tenant Upfront Paid</span>
                  <span className="text-xl font-bold text-blue-900 block mt-0.5">৳{summary.tenantPaidTotal.toLocaleString()}</span>
                  <span className="text-[10px] text-blue-600">Paid by tenant directly</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
                  <span className="text-[11px] font-semibold text-amber-700 uppercase block">Rent Deductible</span>
                  <span className="text-xl font-bold text-amber-900 block mt-0.5">৳{summary.rentDeductibleTotal.toLocaleString()}</span>
                  <span className="text-[10px] text-amber-600">To adjust from next rent</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
                  <span className="text-[11px] font-semibold text-emerald-700 uppercase block">Net Rent Payable</span>
                  <span className="text-xl font-bold text-emerald-900 block mt-0.5">৳{summary.netRentPayable.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-600">Base: ৳{Number(propertyInfo.rentAmount).toLocaleString()}</span>
                </div>
              </div>

              {/* Property & Rent Adjustment Parameters */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
                  Flat Information & Rent Settlement Month
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Flat & Holding</label>
                    <input
                      type="text"
                      value={propertyInfo.flatNumber}
                      onChange={(e) => handlePropertyChange("flatNumber", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Building & Area</label>
                    <input
                      type="text"
                      value={`${propertyInfo.buildingName}, ${propertyInfo.areaCity}`}
                      onChange={(e) => handlePropertyChange("buildingName", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Monthly Base Rent (৳)</label>
                    <input
                      type="number"
                      value={propertyInfo.rentAmount}
                      onChange={(e) => handlePropertyChange("rentAmount", Number(e.target.value))}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Adjustment Month</label>
                    <input
                      type="text"
                      value={propertyInfo.settlementMonth}
                      onChange={(e) => handlePropertyChange("settlementMonth", e.target.value)}
                      placeholder="e.g. October 2026"
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Maintenance Records Table */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">
                    {lang === "en" ? "Itemized Maintenance & Repair Ledger" : "মেরামত খরচ ও কাজের তালিকা"}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {records.length} entries
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Category & Title</th>
                        <th className="p-2.5">Technician / Contacts</th>
                        <th className="p-2.5 text-right">Parts (৳)</th>
                        <th className="p-2.5 text-right">Labor (৳)</th>
                        <th className="p-2.5 text-right">Total (৳)</th>
                        <th className="p-2.5 text-center">Settlement</th>
                        <th className="p-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {records.map((rec) => {
                        const total = Number(rec.materialCost) + Number(rec.laborCost);
                        const catMeta = categories[rec.category] || categories.plumbing;
                        const CatIcon = catMeta.icon;

                        return (
                          <tr key={rec.id} className="hover:bg-slate-50/80">
                            <td className="p-2.5 font-medium text-slate-500 whitespace-nowrap">{rec.date}</td>
                            <td className="p-2.5">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border ${catMeta.color}`}>
                                  <CatIcon className="w-3 h-3" />
                                  <span>{rec.category.toUpperCase()}</span>
                                </span>
                              </div>
                              <span className="font-bold text-slate-900 block">{rec.title}</span>
                              {rec.description && (
                                <span className="text-[11px] text-slate-500 block line-clamp-1">{rec.description}</span>
                              )}
                            </td>
                            <td className="p-2.5 text-slate-600">
                              <span className="font-semibold block text-slate-800">{rec.technicianName || "—"}</span>
                              <span className="text-[10px] text-slate-500 block">{rec.technicianPhone}</span>
                            </td>
                            <td className="p-2.5 text-right font-medium text-slate-700">৳{rec.materialCost.toLocaleString()}</td>
                            <td className="p-2.5 text-right font-medium text-slate-700">৳{rec.laborCost.toLocaleString()}</td>
                            <td className="p-2.5 text-right font-bold text-slate-900 bg-slate-50/50">৳{total.toLocaleString()}</td>
                            <td className="p-2.5 text-center">
                              {rec.settlementType === "rent_deduct" ? (
                                <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                                  Rent Deduct
                                </span>
                              ) : rec.settlementType === "direct_reimburse" ? (
                                <span className="inline-block text-[10px] font-bold text-blue-800 bg-blue-100 border border-blue-300 px-2 py-0.5 rounded-full">
                                  Direct Cash/bKash
                                </span>
                              ) : (
                                <span className="inline-block text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-full">
                                  Tenant Own
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeleteRecord(rec.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 transition"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Add New Maintenance Log Form */}
                <form onSubmit={handleAddRecord} className="border-t border-slate-200 pt-4 mt-2 space-y-3">
                  <span className="text-xs font-bold text-slate-800 block">Add New Maintenance / Service Work:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Category</label>
                      <select
                        value={newRecord.category}
                        onChange={(e) => setNewRecord({ ...newRecord, category: e.target.value })}
                        className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="plumbing">Plumbing & Sanitary</option>
                        <option value="electrical">Electrical & Wiring</option>
                        <option value="motor">Water Motor / Pump</option>
                        <option value="gas">Gas Line & Stove</option>
                        <option value="ac">AC Servicing</option>
                        <option value="carpentry">Carpentry & Lock</option>
                        <option value="damp">Damp & Masonry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Work Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Geyser coil replacement"
                        value={newRecord.title}
                        onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                        className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Materials Cost (৳)</label>
                      <input
                        type="number"
                        placeholder="৳ Parts"
                        value={newRecord.materialCost}
                        onChange={(e) => setNewRecord({ ...newRecord, materialCost: Number(e.target.value) })}
                        className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Mistri / Labor (৳)</label>
                      <input
                        type="number"
                        placeholder="৳ Labor"
                        value={newRecord.laborCost}
                        onChange={(e) => setNewRecord({ ...newRecord, laborCost: Number(e.target.value) })}
                        className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Technician Name & Mobile</label>
                      <input
                        type="text"
                        placeholder="e.g. Farid Plumber (+880 1712-000000)"
                        value={newRecord.technicianName}
                        onChange={(e) => setNewRecord({ ...newRecord, technicianName: e.target.value })}
                        className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Paid By</label>
                      <select
                        value={newRecord.paidBy}
                        onChange={(e) => setNewRecord({ ...newRecord, paidBy: e.target.value })}
                        className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="tenant">Tenant (ভাড়াটিয়া অগ্রিম দিয়েছে)</option>
                        <option value="landlord">Landlord (বাড়িওয়ালা সরাসরি দিয়েছে)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Settlement Mode</label>
                      <select
                        value={newRecord.settlementType}
                        onChange={(e) => setNewRecord({ ...newRecord, settlementType: e.target.value })}
                        className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="rent_deduct">Deduct from Next Rent (ভাড়া থেকে কর্তন)</option>
                        <option value="direct_reimburse">Direct Reimbursement (নগদ/বিকাশ পরিশোধ)</option>
                        <option value="tenant_own">Tenant Own Cost (ভাড়াটিয়ার নিজস্ব খরচ)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log Maintenance Record</span>
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

          {/* TAB 2: PRINTABLE VOUCHER */}
          {activeTab === "voucher" && (
            <div className="space-y-6">
              <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-10 shadow-lg font-serif text-slate-900 space-y-6">
                
                {/* Letterhead */}
                <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
                  <div className="inline-block bg-amber-800 text-white text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-0.5 rounded-full mb-1">
                    Premises Maintenance & Tenancy Rent Deduction Voucher
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-950">
                    {lang === "en"
                      ? "PROPERTY REPAIR & RENT ADJUSTMENT STATEMENT"
                      : "বাড়ি মেরামত ব্যয় ও ভাড়া সমন্বয় প্রত্যয়নপত্র"}
                  </h1>
                  <p className="text-xs font-sans text-slate-600">
                    Month of Adjustment: <strong>{propertyInfo.settlementMonth}</strong>
                  </p>
                </div>

                {/* Property & Parties Metadata */}
                <div className="font-sans text-xs grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 border border-slate-300 rounded-xl">
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Flat / Holding:</span>
                    <span className="font-bold text-slate-900">{propertyInfo.flatNumber}, {propertyInfo.buildingName}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Area / City:</span>
                    <span className="font-bold text-slate-900">{propertyInfo.roadSector}, {propertyInfo.areaCity}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Landlord Name:</span>
                    <span className="font-bold text-slate-900">{propertyInfo.landlordName}</span>
                    <span className="block text-slate-600 text-[11px]">{propertyInfo.landlordPhone}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Tenant Name:</span>
                    <span className="font-bold text-slate-900">{propertyInfo.tenantName}</span>
                    <span className="block text-slate-600 text-[11px]">{propertyInfo.tenantPhone}</span>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="font-sans space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-200 px-3 py-1 rounded">
                    Itemized Repair Costs & Invoices
                  </h4>
                  <table className="w-full text-xs border border-slate-300">
                    <thead className="bg-slate-100 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-2 border-r border-slate-300 text-center w-8">#</th>
                        <th className="p-2 border-r border-slate-300 text-left">Date & Repair Work Description</th>
                        <th className="p-2 border-r border-slate-300 text-left">Technician</th>
                        <th className="p-2 border-r border-slate-300 text-right">Parts (৳)</th>
                        <th className="p-2 border-r border-slate-300 text-right">Labor (৳)</th>
                        <th className="p-2 text-right">Total Cost (৳)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300">
                      {records.map((rec, idx) => {
                        const total = Number(rec.materialCost) + Number(rec.laborCost);
                        return (
                          <tr key={rec.id}>
                            <td className="p-2 border-r border-slate-300 text-center font-bold">{idx + 1}</td>
                            <td className="p-2 border-r border-slate-300">
                              <span className="font-bold text-slate-900 block">{rec.title}</span>
                              <span className="text-[11px] text-slate-600 block">{rec.description}</span>
                            </td>
                            <td className="p-2 border-r border-slate-300 text-slate-700">
                              {rec.technicianName || "—"}
                            </td>
                            <td className="p-2 border-r border-slate-300 text-right font-medium">৳{rec.materialCost.toLocaleString()}</td>
                            <td className="p-2 border-r border-slate-300 text-right font-medium">৳{rec.laborCost.toLocaleString()}</td>
                            <td className="p-2 text-right font-bold">৳{total.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Final Settlement Math Summary */}
                <div className="font-sans text-xs space-y-2 bg-amber-50/70 p-4 border border-amber-200 rounded-xl">
                  <div className="flex justify-between items-center text-slate-700">
                    <span>1. Standard Monthly Rent for {propertyInfo.settlementMonth}:</span>
                    <span className="font-bold text-slate-900">৳{Number(propertyInfo.rentAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-rose-700 font-semibold">
                    <span>2. Less: Approved Maintenance Expense (Paid by Tenant):</span>
                    <span>-৳{summary.rentDeductibleTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-black text-slate-950 border-t border-amber-300 pt-2">
                    <span>3. Net Rent Payable for {propertyInfo.settlementMonth}:</span>
                    <span className="text-amber-900 text-base">৳{summary.netRentPayable.toLocaleString()}</span>
                  </div>
                </div>

                {/* Undertaking & Signatures */}
                <div className="font-sans text-xs space-y-4 pt-4">
                  <p className="text-[11px] text-slate-600 leading-relaxed italic">
                    {lang === "en"
                      ? "Both Landlord and Tenant acknowledge that the aforementioned repair works were necessary and executed satisfactorily. The net adjusted rent amount settles all financial claims for the specified maintenance tasks."
                      : "বাড়িওয়ালা ও ভাড়াটিয়া উভয়পক্ষ একমত পোষণ করিতেছেন যে, উল্লেখিত মেরামত কাজসমূহ যথাযথভাবে সম্পন্ন হইয়াছে এবং নিট সমন্বয়কৃত ভাড়া পরিশোধের মাধ্যমে উক্ত মেরামতের যাবতীয় আর্থিক দাবি নিষ্পত্তি হইল।"}
                  </p>

                  <div className="grid grid-cols-2 gap-8 pt-10 text-center">
                    <div className="border-t-2 border-slate-800 pt-1.5">
                      <p className="font-bold text-slate-900">{propertyInfo.landlordName}</p>
                      <p className="text-[11px] text-slate-600">Landlord Signature (বাড়িওয়ালার স্বাক্ষর)</p>
                      <p className="text-[10px] text-slate-400">Date: _______________</p>
                    </div>

                    <div className="border-t-2 border-slate-800 pt-1.5">
                      <p className="font-bold text-slate-900">{propertyInfo.tenantName}</p>
                      <p className="text-[11px] text-slate-600">Tenant Signature (ভাড়াটিয়ার স্বাক্ষর)</p>
                      <p className="text-[10px] text-slate-400">Date: _______________</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: DHAKA MARKET RATES */}
          {activeTab === "rates" && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-center gap-3">
                <Info className="w-5 h-5 text-amber-700 shrink-0" />
                <span>
                  <strong>Dhaka Fair Market Benchmark (2026):</strong> The table below reflects prevailing market rates across Dhaka (Uttara, Mirpur, Dhanmondi, Bashundhara, Gulshan) for standard replacement parts and certified mistri labor.
                </span>
              </div>

              <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Repair Work Item</th>
                      <th className="p-3">Trade Category</th>
                      <th className="p-3 text-right">Parts / Material (৳)</th>
                      <th className="p-3 text-right">Labor / Mistri (৳)</th>
                      <th className="p-3 text-right">Est. Total (৳)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {standardRates.map((rate, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">{rate.item}</td>
                        <td className="p-3 text-slate-600">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                            {rate.category}
                          </span>
                        </td>
                        <td className="p-3 text-right text-slate-700">{rate.parts}</td>
                        <td className="p-3 text-right text-slate-700">{rate.labor}</td>
                        <td className="p-3 text-right font-bold text-amber-900 bg-amber-50/40">{rate.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: LEGAL RESPONSIBILITY */}
          {activeTab === "responsibility" && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900">
                <h3 className="font-bold text-sm text-blue-950 mb-1">
                  Premises Rent Control Act, 1991 (বাড়ি ভাড়া নিয়ন্ত্রণ আইন, ১৯৯১) - Maintenance Responsibilities
                </h3>
                <p>
                  Section 15 & 16 define statutory duties regarding building upkeep, habitability, and essential utility services.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Landlord Column */}
                <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 border-b border-emerald-100 pb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                      Landlord Responsibility (বাড়িওয়ালার দায়িত্ব)
                    </h4>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-2">
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span><strong>Water Motor Pump:</strong> Deep tube-well motor burning, mechanical failure, or replacement.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span><strong>Structural & Roof Dampness:</strong> Monsoon rainwater seepage, roof waterproofing, wall plaster cracks.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span><strong>Main Electrical & Supply Lines:</strong> Main distribution box (DB), meter circuit breaker, riser cable.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span><strong>External Plumbing & Sewerage:</strong> Underground septic tank cleaning, main building drainage pipes.</span>
                    </li>
                  </ul>
                </div>

                {/* Tenant Column */}
                <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 border-b border-amber-100 pb-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                      Tenant Responsibility (ভাড়াটিয়ার দায়িত্ব)
                    </h4>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-2">
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span><strong>Consumable Light Bulbs & Tubes:</strong> LED bulbs, tube lights, and daily wear switch knobs.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span><strong>Minor Plumbing Washers & Blockages:</strong> Internal tap washer leaks, sink drain blockages caused by food waste.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span><strong>Routine AC Filter Cleaning:</strong> Dust mesh washing every 2-3 months during seasonal use.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span><strong>Keys & Physical Negligence:</strong> Replacing lost keys, window glass broken by direct physical impact.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Standard Rent Deduction & Maintenance Ledger for Bangladesh</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition shadow-sm"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-bold bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Statement</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
