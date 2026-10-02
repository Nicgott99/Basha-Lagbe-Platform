import React, { useState, useEffect } from "react";
import {
  X,
  Printer,
  Copy,
  Check,
  BookOpen,
  DollarSign,
  User,
  Phone,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Send,
  MessageSquare,
  FileSpreadsheet,
  TrendingUp,
  Download,
  RotateCcw,
  Sparkles,
} from "lucide-react";

const INITIAL_TENANTS = [
  {
    id: "unit-1a",
    unit: "Flat 1A (১ম তলা)",
    tenantName: "MD Hasib Ullah Khan Alvie",
    phone: "01712-345678",
    baseRent: 24000,
    serviceCharge: 3500,
    parkingFee: 1500,
    previousDue: 0,
    amountPaid: 29000,
    paymentDate: "2026-10-02",
    paymentMethod: "Bank Transfer",
    trxId: "EBL-TRX-98214",
    status: "paid", // "paid" | "partial" | "unpaid"
    notes: "Paid in full via EBL Internet Banking",
  },
  {
    id: "unit-1b",
    unit: "Flat 1B (১ম তলা)",
    tenantName: "Dr. Kazi Ahsan Habib",
    phone: "01819-456123",
    baseRent: 22000,
    serviceCharge: 3500,
    parkingFee: 0,
    previousDue: 5000,
    amountPaid: 20000,
    paymentDate: "2026-10-03",
    paymentMethod: "bKash",
    trxId: "BK-87A99X21",
    status: "partial",
    notes: "Remaining 10,500 Tk promised by 10th Oct",
  },
  {
    id: "unit-2a",
    unit: "Flat 2A (২য় তলা)",
    tenantName: "Engr. Tanvir Chowdhury",
    phone: "01911-876543",
    baseRent: 26000,
    serviceCharge: 4000,
    parkingFee: 2000,
    previousDue: 0,
    amountPaid: 32000,
    paymentDate: "2026-10-01",
    paymentMethod: "Cash",
    trxId: "REC-2026-003",
    status: "paid",
    notes: "Received in cash by Building Manager",
  },
  {
    id: "unit-2b",
    unit: "Flat 2B (২য় তলা)",
    tenantName: "Advocate Shireen Akhter",
    phone: "01678-234567",
    baseRent: 25000,
    serviceCharge: 4000,
    parkingFee: 0,
    previousDue: 0,
    amountPaid: 0,
    paymentDate: "",
    paymentMethod: "Pending",
    trxId: "",
    status: "unpaid",
    notes: "Salary expected on 7th Oct",
  },
  {
    id: "unit-3a",
    unit: "Flat 3A (৩য় তলা)",
    tenantName: "Syed Mahmudul Hasan",
    phone: "01733-908765",
    baseRent: 28000,
    serviceCharge: 4000,
    parkingFee: 2000,
    previousDue: 0,
    amountPaid: 34000,
    paymentDate: "2026-10-02",
    paymentMethod: "Nagad",
    trxId: "NG-78103982",
    status: "paid",
    notes: "Full payment with parking slot A2",
  },
  {
    id: "unit-3b",
    unit: "Flat 3B (৩য় তলা)",
    tenantName: "Mahbubur Rahman (Bachelor Mess)",
    phone: "01552-443322",
    baseRent: 21000,
    serviceCharge: 3500,
    parkingFee: 0,
    previousDue: 4000,
    amountPaid: 0,
    paymentDate: "",
    paymentMethod: "Pending",
    trxId: "",
    status: "unpaid",
    notes: "Follow up required for Sept balance + Oct rent",
  },
];

const MONTHS = [
  "January / জানুয়ারি",
  "February / ফেব্রুয়ারি",
  "March / মার্চ",
  "April / এপ্রিল",
  "May / মে",
  "June / জুন",
  "July / জুলাই",
  "August / আগস্ট",
  "September / সেপ্টেম্বর",
  "October / অক্টোবর",
  "November / নভেম্বর",
  "December / ডিসেম্বর",
];

export default function RentCollectionLedgerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("ledger"); // "ledger" | "stats" | "reminder" | "print"
  const [selectedMonth, setSelectedMonth] = useState("October / অক্টোবর");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [filterStatus, setFilterStatus] = useState("all"); // "all" | "paid" | "partial" | "unpaid"
  const [copied, setCopied] = useState(false);
  const [selectedTenantForReminder, setSelectedTenantForReminder] = useState(null);
  const [reminderLang, setReminderLang] = useState("bn"); // "bn" | "en"

  // Building & Landlord Info
  const [buildingInfo, setBuildingInfo] = useState({
    buildingName: "Sunrise Heights (সানরাইজ হাইটস)",
    address: "House 14, Road 7, Block B, Bashundhara R/A, Dhaka-1229",
    landlordName: "Alhaj Rafiqul Islam",
    landlordPhone: "01819-456789",
    managerName: "Md. Abdul Kader (Caretaker)",
    managerPhone: "01720-998877",
    bKashMerchant: "01819-456789 (Personal / Send Money)",
    nagadNumber: "01819-456789 (Personal)",
    bankDetails: "Dutch-Bangla Bank (DBBL), A/C: 123.120.98765, Bashundhara Branch",
  });

  // Tenancy ledger data
  const [tenants, setTenants] = useState(() => {
    try {
      const saved = localStorage.getItem("basha_rent_collection_ledger");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TENANTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem("basha_rent_collection_ledger", JSON.stringify(tenants));
    } catch (e) {
      console.error(e);
    }
  }, [tenants]);

  // Calculations
  const calcTotalDue = (t) =>
    (Number(t.baseRent) || 0) +
    (Number(t.serviceCharge) || 0) +
    (Number(t.parkingFee) || 0) +
    (Number(t.previousDue) || 0);

  const calcBalance = (t) => calcTotalDue(t) - (Number(t.amountPaid) || 0);

  const totalPayable = tenants.reduce((acc, t) => acc + calcTotalDue(t), 0);
  const totalCollected = tenants.reduce((acc, t) => acc + (Number(t.amountPaid) || 0), 0);
  const totalArrears = totalPayable - totalCollected;
  const collectionRate = totalPayable > 0 ? Math.round((totalCollected / totalPayable) * 100) : 0;

  const paidCount = tenants.filter((t) => t.status === "paid").length;
  const partialCount = tenants.filter((t) => t.status === "partial").length;
  const unpaidCount = tenants.filter((t) => t.status === "unpaid").length;

  const updateTenant = (id, field, value) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, [field]: value };
          if (field === "amountPaid") {
            const due = calcTotalDue(updated);
            const paid = Number(value) || 0;
            if (paid >= due && due > 0) updated.status = "paid";
            else if (paid > 0) updated.status = "partial";
            else updated.status = "unpaid";
          }
          return updated;
        }
        return t;
      })
    );
  };

  const addTenantRow = () => {
    const newId = `unit-${Date.now()}`;
    const newRow = {
      id: newId,
      unit: `Flat ${tenants.length + 1}A`,
      tenantName: "New Tenant / নতুন ভাড়াটিয়া",
      phone: "01700-000000",
      baseRent: 20000,
      serviceCharge: 3000,
      parkingFee: 0,
      previousDue: 0,
      amountPaid: 0,
      paymentDate: "",
      paymentMethod: "Pending",
      trxId: "",
      status: "unpaid",
      notes: "",
    };
    setTenants((prev) => [...prev, newRow]);
  };

  const deleteTenantRow = (id) => {
    if (confirm("Are you sure you want to remove this tenant from the ledger?")) {
      setTenants((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const resetToDefault = () => {
    if (confirm("Reset ledger back to initial sample records?")) {
      setTenants(INITIAL_TENANTS);
    }
  };

  // Reminder generator
  const getReminderText = (tenant, lang) => {
    if (!tenant) return "";
    const balance = calcBalance(tenant);
    const month = selectedMonth.split("/")[0].trim();
    if (lang === "bn") {
      return `আসসালামু আলাইকুম ${tenant.tenantName} সাহেব,
আশা করি ভালো আছেন। '${buildingInfo.buildingName}'-এর ${tenant.unit} এর ${selectedMonth} মাসের বাড়িভাড়া বিবরণী:

- মূল ভাড়া: ৳${Number(tenant.baseRent).toLocaleString("en-IN")}
- সার্ভিস চার্জ: ৳${Number(tenant.serviceCharge).toLocaleString("en-IN")}
- পার্কিং চার্জ: ৳${Number(tenant.parkingFee).toLocaleString("en-IN")}
- পূর্বের বকেয়া: ৳${Number(tenant.previousDue).toLocaleString("en-IN")}
- মোট প্রদেয়: ৳${calcTotalDue(tenant).toLocaleString("en-IN")}
- জমা দেওয়া হয়েছে: ৳${Number(tenant.amountPaid).toLocaleString("en-IN")}
---------------------------------
★ অবশিষ্ট বকেয়া: ৳${balance.toLocaleString("en-IN")}

পরিশোধের মাধ্যম:
- বিকাশ: ${buildingInfo.bKashMerchant}
- নগদ: ${buildingInfo.nagadNumber}
- ব্যাংক: ${buildingInfo.bankDetails}

বকেয়া ভাড়াটি দ্রুত পরিশোধ করে রসিদ সংগ্রহের জন্য অনুরোধ করা হলো।
বিনীত,
${buildingInfo.landlordName} (${buildingInfo.landlordPhone})
ম্যানেজার: ${buildingInfo.managerName} (${buildingInfo.managerPhone})`;
    } else {
      return `Dear ${tenant.tenantName},
Greetings from ${buildingInfo.buildingName}. Here is the rent summary for ${tenant.unit} for ${month} ${selectedYear}:

- Base Rent: ৳${Number(tenant.baseRent).toLocaleString("en-IN")}
- Service Charge: ৳${Number(tenant.serviceCharge).toLocaleString("en-IN")}
- Parking Fee: ৳${Number(tenant.parkingFee).toLocaleString("en-IN")}
- Previous Arrears: ৳${Number(tenant.previousDue).toLocaleString("en-IN")}
- Total Payable: ৳${calcTotalDue(tenant).toLocaleString("en-IN")}
- Paid Amount: ৳${Number(tenant.amountPaid).toLocaleString("en-IN")}
---------------------------------
★ OUTSTANDING BALANCE: ৳${balance.toLocaleString("en-IN")}

Payment Options:
- bKash: ${buildingInfo.bKashMerchant}
- Nagad: ${buildingInfo.nagadNumber}
- Bank Transfer: ${buildingInfo.bankDetails}

Kindly settle the remaining balance at your earliest convenience.
Regards,
${buildingInfo.landlordName} (${buildingInfo.landlordPhone})`;
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredTenants = tenants.filter((t) => {
    if (filterStatus === "all") return true;
    return t.status === filterStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Landlord Rent Collection Register & Arrears Ledger
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  বাড়িভাড়া ও বকেয়া খাতা
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-unit monthly collection tracking, automatic arrears calculation, SMS payment reminders & printable ledger sheet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Summary Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 py-3.5 bg-slate-950/60 border-b border-slate-800 text-sm">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col">
            <span className="text-xs text-slate-400 font-medium">Total Payable / সর্বমোট পাওনা</span>
            <span className="text-lg font-bold text-white mt-1">৳{totalPayable.toLocaleString("en-IN")}</span>
            <span className="text-[11px] text-slate-500">{tenants.length} units enrolled</span>
          </div>

          <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3 flex flex-col">
            <span className="text-xs text-emerald-400 font-medium">Collected / আদায়কৃত</span>
            <span className="text-lg font-bold text-emerald-300 mt-1">৳{totalCollected.toLocaleString("en-IN")}</span>
            <span className="text-[11px] text-emerald-500/80">{paidCount} Paid • {partialCount} Partial</span>
          </div>

          <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl p-3 flex flex-col">
            <span className="text-xs text-rose-400 font-medium">Arrears / বকেয়া বাকি</span>
            <span className="text-lg font-bold text-rose-300 mt-1">৳{totalArrears.toLocaleString("en-IN")}</span>
            <span className="text-[11px] text-rose-500/80">{unpaidCount} Units Pending</span>
          </div>

          <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-xl p-3 flex flex-col">
            <span className="text-xs text-indigo-400 font-medium">Collection Progress / হার</span>
            <span className="text-lg font-bold text-indigo-300 mt-1">{collectionRate}%</span>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  collectionRate >= 80 ? "bg-emerald-500" : collectionRate >= 50 ? "bg-yellow-500" : "bg-rose-500"
                }`}
                style={{ width: `${collectionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 pt-3 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab("ledger")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "ledger"
                  ? "border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>মাসিক খাতা (Collection Register)</span>
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "stats"
                  ? "border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>বকেয়া ও রিপোর্ট (Arrears & Stats)</span>
            </button>
            <button
              onClick={() => setActiveTab("reminder")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "reminder"
                  ? "border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>তাগিদ নোটিশ (Reminder Generator)</span>
            </button>
            <button
              onClick={() => setActiveTab("print")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "print"
                  ? "border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট ও ভাউচার (Print Sheet)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={resetToDefault}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition"
              title="Reset records to default sample"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Default</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: LEDGER TABLE */}
          {activeTab === "ledger" && (
            <div className="space-y-4">
              {/* Controls bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Select Month / মাস:</label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      {MONTHS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Year / বছর:</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Filter by Status:</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="all">All Units ({tenants.length})</option>
                      <option value="paid">Paid ({paidCount})</option>
                      <option value="partial">Partial ({partialCount})</option>
                      <option value="unpaid">Unpaid / Due ({unpaidCount})</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={addTenantRow}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Unit / ফ্ল্যাট যোগ করুন</span>
                  </button>
                </div>
              </div>

              {/* Editable Table */}
              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/30">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/80 text-slate-300 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-3">Unit / ফ্ল্যাট</th>
                      <th className="py-3 px-3">Tenant & Phone</th>
                      <th className="py-3 px-3">Rent (৳)</th>
                      <th className="py-3 px-3">Service (৳)</th>
                      <th className="py-3 px-3">Parking (৳)</th>
                      <th className="py-3 px-3">Arrears (৳)</th>
                      <th className="py-3 px-3 font-bold text-slate-200">Total Due (৳)</th>
                      <th className="py-3 px-3 font-bold text-emerald-400">Paid (৳)</th>
                      <th className="py-3 px-3 font-bold text-rose-400">Balance (৳)</th>
                      <th className="py-3 px-3">Method & TrxID</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredTenants.map((t) => {
                      const totalDue = calcTotalDue(t);
                      const balance = calcBalance(t);
                      return (
                        <tr
                          key={t.id}
                          className="hover:bg-slate-800/30 transition duration-150"
                        >
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              value={t.unit}
                              onChange={(e) => updateTenant(t.id, "unit", e.target.value)}
                              className="w-28 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-medium focus:border-emerald-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-2.5 px-3 space-y-1">
                            <input
                              type="text"
                              value={t.tenantName}
                              onChange={(e) => updateTenant(t.id, "tenantName", e.target.value)}
                              className="w-36 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-medium focus:border-emerald-500 focus:outline-none"
                              placeholder="Tenant Name"
                            />
                            <input
                              type="text"
                              value={t.phone}
                              onChange={(e) => updateTenant(t.id, "phone", e.target.value)}
                              className="w-36 bg-slate-900/60 border border-slate-700/60 rounded px-2 py-0.5 text-[11px] text-slate-400 focus:border-emerald-500 focus:outline-none"
                              placeholder="017xx-xxxxxx"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              value={t.baseRent}
                              onChange={(e) => updateTenant(t.id, "baseRent", e.target.value)}
                              className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-right focus:border-emerald-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              value={t.serviceCharge}
                              onChange={(e) => updateTenant(t.id, "serviceCharge", e.target.value)}
                              className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-right focus:border-emerald-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              value={t.parkingFee}
                              onChange={(e) => updateTenant(t.id, "parkingFee", e.target.value)}
                              className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-right focus:border-emerald-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              value={t.previousDue}
                              onChange={(e) => updateTenant(t.id, "previousDue", e.target.value)}
                              className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-rose-300 text-right focus:border-emerald-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-white">
                            ৳{totalDue.toLocaleString("en-IN")}
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              value={t.amountPaid}
                              onChange={(e) => updateTenant(t.id, "amountPaid", e.target.value)}
                              className="w-20 bg-slate-900 border border-emerald-600/60 rounded px-2 py-1 text-emerald-300 font-semibold text-right focus:border-emerald-400 focus:outline-none"
                            />
                          </td>
                          <td className="py-2.5 px-3 font-bold">
                            <span className={balance > 0 ? "text-rose-400" : "text-emerald-400"}>
                              ৳{balance.toLocaleString("en-IN")}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 space-y-1">
                            <select
                              value={t.paymentMethod}
                              onChange={(e) => updateTenant(t.id, "paymentMethod", e.target.value)}
                              className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-[11px] text-slate-300 w-28 focus:outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Cash">Cash (নগদ)</option>
                              <option value="bKash">bKash (বিকাশ)</option>
                              <option value="Nagad">Nagad (নগদ)</option>
                              <option value="Bank Transfer">Bank Transfer</option>
                              <option value="Cheque">Cheque (চেক)</option>
                            </select>
                            <input
                              type="text"
                              value={t.trxId}
                              onChange={(e) => updateTenant(t.id, "trxId", e.target.value)}
                              placeholder="Trx / Cheque #"
                              className="w-28 bg-slate-900/60 border border-slate-700/60 rounded px-1.5 py-0.5 text-[10px] text-slate-400 focus:border-emerald-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            {t.status === "paid" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                <CheckCircle2 className="w-3 h-3" /> Paid
                              </span>
                            )}
                            {t.status === "partial" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                <Clock className="w-3 h-3" /> Partial
                              </span>
                            )}
                            {t.status === "unpaid" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                <AlertTriangle className="w-3 h-3" /> Due
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <button
                              onClick={() => deleteTenantRow(t.id)}
                              className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition"
                              title="Delete Unit"
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

              {/* Building & Account Settings Accordion */}
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>Building & Landlord Details (রশিদ ও এসএমএস এর জন্য তথ্য)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Building Name / ভবনের নাম:</label>
                    <input
                      type="text"
                      value={buildingInfo.buildingName}
                      onChange={(e) => setBuildingInfo({ ...buildingInfo, buildingName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Landlord Name & Phone:</label>
                    <input
                      type="text"
                      value={buildingInfo.landlordName}
                      onChange={(e) => setBuildingInfo({ ...buildingInfo, landlordName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">bKash Merchant / Personal:</label>
                    <input
                      type="text"
                      value={buildingInfo.bKashMerchant}
                      onChange={(e) => setBuildingInfo({ ...buildingInfo, bKashMerchant: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Address / ঠিকানা:</label>
                    <input
                      type="text"
                      value={buildingInfo.address}
                      onChange={(e) => setBuildingInfo({ ...buildingInfo, address: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Manager / Caretaker:</label>
                    <input
                      type="text"
                      value={buildingInfo.managerName}
                      onChange={(e) => setBuildingInfo({ ...buildingInfo, managerName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Bank Account Info:</label>
                    <input
                      type="text"
                      value={buildingInfo.bankDetails}
                      onChange={(e) => setBuildingInfo({ ...buildingInfo, bankDetails: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STATS & ARREARS OVERVIEW */}
          {activeTab === "stats" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                  <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Paid in Full Units ({paidCount})</span>
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {tenants
                      .filter((t) => t.status === "paid")
                      .map((t) => (
                        <div key={t.id} className="p-2.5 bg-slate-900 rounded-lg text-xs flex justify-between items-center border border-slate-800">
                          <div>
                            <p className="font-semibold text-white">{t.unit}</p>
                            <p className="text-slate-400 text-[11px]">{t.tenantName}</p>
                          </div>
                          <span className="font-bold text-emerald-400">৳{Number(t.amountPaid).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    {paidCount === 0 && <p className="text-xs text-slate-500 italic">No fully paid units yet</p>}
                  </div>
                </div>

                <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                  <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Partial Payment Units ({partialCount})</span>
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {tenants
                      .filter((t) => t.status === "partial")
                      .map((t) => (
                        <div key={t.id} className="p-2.5 bg-slate-900 rounded-lg text-xs flex justify-between items-center border border-slate-800">
                          <div>
                            <p className="font-semibold text-white">{t.unit}</p>
                            <p className="text-slate-400 text-[11px]">{t.tenantName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-emerald-400 font-semibold">Paid: ৳{Number(t.amountPaid).toLocaleString("en-IN")}</p>
                            <p className="text-rose-400 font-bold text-[11px]">Due: ৳{calcBalance(t).toLocaleString("en-IN")}</p>
                          </div>
                        </div>
                      ))}
                    {partialCount === 0 && <p className="text-xs text-slate-500 italic">No partial payment units</p>}
                  </div>
                </div>

                <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                  <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Unpaid / Due Units ({unpaidCount})</span>
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {tenants
                      .filter((t) => t.status === "unpaid")
                      .map((t) => (
                        <div key={t.id} className="p-2.5 bg-slate-900 rounded-lg text-xs flex justify-between items-center border border-slate-800">
                          <div>
                            <p className="font-semibold text-white">{t.unit}</p>
                            <p className="text-slate-400 text-[11px]">{t.tenantName}</p>
                          </div>
                          <span className="font-bold text-rose-400">৳{calcTotalDue(t).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    {unpaidCount === 0 && <p className="text-xs text-slate-500 italic">All units are cleared!</p>}
                  </div>
                </div>
              </div>

              {/* Arrears recovery action board */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 p-5 rounded-xl border border-indigo-900/40 space-y-3">
                <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>Landlord Best Practices & Tenancy Act Guidance (বাড়িভাড়া আইন ও আদায়ের নিয়ম)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                  <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
                    <p className="font-semibold text-white">১. ভাড়ার সময়সীমা (Payment Grace Period):</p>
                    <p className="text-slate-400">
                      ভাড়া নিয়ন্ত্রণ আইন ১৯৯১ অনুযায়ী পরবর্তী মাসের ৭ থেকে ১০ তারিখের মধ্যে সাধারণতঃ ভাড়া পরিশোধ করা হয়। ১০ তারিখের পর বকেয়া থাকলে বিলম্ব বার্তা পাঠানো বিধিসম্মত।
                    </p>
                  </div>
                  <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
                    <p className="font-semibold text-white">২. ডিজিটাল রসিদ ও ক্যাশ মেমো সংরক্ষণ:</p>
                    <p className="text-slate-400">
                      বিকাশ/নগদ বা ব্যাংক ট্রানজেকশনের আইডি খাতায় লিখে রাখুন এবং প্রতিবার টাকা গ্রহণের পর স্বাক্ষরযুক্ত মানি রসিদ কপি ভাড়াটিয়াকে প্রদান করুন।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REMINDER NOTICE GENERATOR */}
          {activeTab === "reminder" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    ১. বকেয়া ভাড়াটিয়া সিলেক্ট করুন:
                  </h4>
                  <div className="space-y-1.5 max-h-72 overflow-y-auto">
                    {tenants.map((t) => {
                      const bal = calcBalance(t);
                      const isSelected = selectedTenantForReminder?.id === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTenantForReminder(t)}
                          className={`w-full text-left p-2.5 rounded-lg text-xs transition border flex justify-between items-center ${
                            isSelected
                              ? "bg-emerald-600/20 border-emerald-500 text-white"
                              : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                          }`}
                        >
                          <div>
                            <p className="font-semibold">{t.unit}</p>
                            <p className="text-[11px] text-slate-400">{t.tenantName}</p>
                          </div>
                          <span
                            className={`font-bold ${
                              bal > 0 ? "text-rose-400" : "text-emerald-400"
                            }`}
                          >
                            {bal > 0 ? `৳${bal.toLocaleString("en-IN")}` : "Paid"}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <label className="text-xs text-slate-400 block mb-1">Language / ভাষা:</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setReminderLang("bn")}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition ${
                          reminderLang === "bn"
                            ? "bg-emerald-600 text-white border-emerald-500"
                            : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        বাংলা (Bengali)
                      </button>
                      <button
                        onClick={() => setReminderLang("en")}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition ${
                          reminderLang === "en"
                            ? "bg-emerald-600 text-white border-emerald-500"
                            : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        English
                      </button>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4" />
                        <span>Generated Reminder SMS & WhatsApp Message</span>
                      </h4>
                      {selectedTenantForReminder && (
                        <button
                          onClick={() => handleCopy(getReminderText(selectedTenantForReminder, reminderLang))}
                          className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1 rounded-lg transition"
                        >
                          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-white" />}
                          <span>{copied ? "Copied!" : "Copy Message"}</span>
                        </button>
                      )}
                    </div>

                    {selectedTenantForReminder ? (
                      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                        {getReminderText(selectedTenantForReminder, reminderLang)}
                      </div>
                    ) : (
                      <div className="p-12 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
                        <User className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                        <p className="text-xs">Select a tenant from the left list to generate an automated reminder notice.</p>
                      </div>
                    )}
                  </div>

                  {selectedTenantForReminder && (
                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span>Recipient: <strong>{selectedTenantForReminder.phone}</strong></span>
                      <a
                        href={`https://wa.me/88${selectedTenantForReminder.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          getReminderText(selectedTenantForReminder, reminderLang)
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-2 rounded-lg transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send via WhatsApp</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRINTABLE LEDGER REGISTER SHEET */}
          {activeTab === "print" && (
            <div className="space-y-4">
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Collection Register (প্রিন্ট করুন)</span>
                </button>
              </div>

              {/* Printable container */}
              <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 font-sans">
                {/* Print Sheet Header */}
                <div className="text-center border-b-2 border-slate-800 pb-4 mb-4">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                    {buildingInfo.buildingName}
                  </h1>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{buildingInfo.address}</p>
                  <div className="mt-2 inline-block bg-slate-900 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    মাসিক বাড়িভাড়া আদায় রেজিস্টার ও খাতা — {selectedMonth} {selectedYear}
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-700 mt-3 px-2">
                    <span><strong>Landlord / মালিক:</strong> {buildingInfo.landlordName} ({buildingInfo.landlordPhone})</span>
                    <span><strong>Manager / ম্যানেজার:</strong> {buildingInfo.managerName}</span>
                    <span><strong>Date of Print:</strong> {new Date().toLocaleDateString("en-GB")}</span>
                  </div>
                </div>

                {/* Print Sheet Table */}
                <table className="w-full text-left text-[11px] border-collapse border border-slate-400 mb-4">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-400">
                      <th className="border border-slate-400 p-1.5">SL</th>
                      <th className="border border-slate-400 p-1.5">Flat / Unit</th>
                      <th className="border border-slate-400 p-1.5">Tenant Name & Phone</th>
                      <th className="border border-slate-400 p-1.5 text-right">Rent</th>
                      <th className="border border-slate-400 p-1.5 text-right">Service</th>
                      <th className="border border-slate-400 p-1.5 text-right">Parking</th>
                      <th className="border border-slate-400 p-1.5 text-right">Arrears</th>
                      <th className="border border-slate-400 p-1.5 text-right font-black">Total (৳)</th>
                      <th className="border border-slate-400 p-1.5 text-right text-emerald-800 font-black">Paid (৳)</th>
                      <th className="border border-slate-400 p-1.5 text-right text-rose-800 font-black">Due (৳)</th>
                      <th className="border border-slate-400 p-1.5">Trx / Cheque #</th>
                      <th className="border border-slate-400 p-1.5 text-center">Sign</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenants.map((t, idx) => {
                      const totalDue = calcTotalDue(t);
                      const bal = calcBalance(t);
                      return (
                        <tr key={t.id} className="border-b border-slate-300">
                          <td className="border border-slate-400 p-1.5 text-center">{idx + 1}</td>
                          <td className="border border-slate-400 p-1.5 font-bold">{t.unit}</td>
                          <td className="border border-slate-400 p-1.5">
                            <div className="font-semibold">{t.tenantName}</div>
                            <div className="text-[10px] text-slate-500">{t.phone}</div>
                          </td>
                          <td className="border border-slate-400 p-1.5 text-right">৳{Number(t.baseRent).toLocaleString("en-IN")}</td>
                          <td className="border border-slate-400 p-1.5 text-right">৳{Number(t.serviceCharge).toLocaleString("en-IN")}</td>
                          <td className="border border-slate-400 p-1.5 text-right">৳{Number(t.parkingFee).toLocaleString("en-IN")}</td>
                          <td className="border border-slate-400 p-1.5 text-right">৳{Number(t.previousDue).toLocaleString("en-IN")}</td>
                          <td className="border border-slate-400 p-1.5 text-right font-black">৳{totalDue.toLocaleString("en-IN")}</td>
                          <td className="border border-slate-400 p-1.5 text-right font-bold text-emerald-800">৳{Number(t.amountPaid).toLocaleString("en-IN")}</td>
                          <td className="border border-slate-400 p-1.5 text-right font-bold text-rose-800">৳{bal.toLocaleString("en-IN")}</td>
                          <td className="border border-slate-400 p-1.5 text-[10px]">{t.paymentMethod} {t.trxId ? `(${t.trxId})` : ""}</td>
                          <td className="border border-slate-400 p-1.5 w-16"></td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-black border-t-2 border-slate-800 text-slate-900">
                      <td colSpan="7" className="border border-slate-400 p-2 text-right uppercase">
                        Total Sum / সর্বমোট হিসাব:
                      </td>
                      <td className="border border-slate-400 p-2 text-right">৳{totalPayable.toLocaleString("en-IN")}</td>
                      <td className="border border-slate-400 p-2 text-right text-emerald-800">৳{totalCollected.toLocaleString("en-IN")}</td>
                      <td className="border border-slate-400 p-2 text-right text-rose-800">৳{totalArrears.toLocaleString("en-IN")}</td>
                      <td colSpan="2" className="border border-slate-400 p-2 text-center text-[10px]">
                        Collection Rate: {collectionRate}%
                      </td>
                    </tr>
                  </tfoot>
                </table>

                {/* Signatures */}
                <div className="grid grid-cols-3 gap-8 pt-8 mt-4 text-center text-xs text-slate-700">
                  <div>
                    <div className="border-t border-slate-400 pt-1 font-medium">Prepared by (Manager)</div>
                    <div className="text-[10px] text-slate-500">তৈরি কারক স্বাক্ষর</div>
                  </div>
                  <div>
                    <div className="border-t border-slate-400 pt-1 font-medium">Verified by (Accountant)</div>
                    <div className="text-[10px] text-slate-500">যাচাই কারক স্বাক্ষর</div>
                  </div>
                  <div>
                    <div className="border-t border-slate-400 pt-1 font-bold">Landlord / Owner Signature</div>
                    <div className="text-[10px] text-slate-500">বাড়িওয়ালার স্বাক্ষর ও সীল</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Auto-saved to your local storage securely • বকেয়া ও ভাড়া আদায়ের সম্পূর্ণ হিসাব খাতা</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition"
          >
            Close / বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
