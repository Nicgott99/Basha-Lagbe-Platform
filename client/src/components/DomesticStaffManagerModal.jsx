import React, { useState, useMemo } from "react";
import {
  HeartHandshake,
  FileCheck,
  Printer,
  Copy,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  UserCheck,
  DollarSign,
  Utensils,
  Sparkles,
  X,
  Plus,
  Trash2,
  HelpCircle,
  Clock,
  Home,
  Phone,
  Info,
  Award,
  Receipt
} from "lucide-react";

export default function DomesticStaffManagerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("form"); // "form" | "voucher" | "verification" | "rates" | "tips"
  const [lang, setLang] = useState("en"); // "en" | "bn"
  const [copied, setCopied] = useState(false);

  // Form State
  const [staffData, setStaffData] = useState({
    roleType: "part_time_maid", // "part_time_maid" | "full_time_maid" | "cook" | "cleaner" | "driver"
    employerName: "Hasibullah Khan",
    employerPhone: "+880 1819-000000",
    employerAddress: "Flat 4-B, Greenview Palace, Road 11, Sector 4, Uttara, Dhaka-1230",
    
    // Staff Personal Details
    staffName: "Rahima Begum",
    staffPhone: "+880 1722-112233",
    staffNid: "19882691234567890",
    staffFatherHusband: "Md. Abdul Mannan (Husband)",
    staffAge: "36 Years",
    permanentAddress: "Vill: Char Fashion, P.O: Lalmohan, Dist: Bhola",
    dhakaLivingAddress: "Bawrunia Basti / Slum, Sector 8, Uttara, Dhaka",
    guarantorName: "Md. Sirajul Islam (Brother - CNG Driver)",
    guarantorPhone: "+880 1911-445566",
    policeVerified: true,

    // Contract & Financials
    salaryMonth: "October 2026",
    monthlyBaseSalary: 6500,
    bonusType: "eid_bonus_half", // "none" | "eid_bonus_half" (50%) | "eid_bonus_full" (100%) | "custom"
    customBonusAmount: 0,
    overtimeAllowance: 500,
    advanceDeduction: 0,
    absentDaysDeduction: 0,
    absentDaysCount: 0,
    paymentMode: "cash", // "cash" | "bkash" | "nagad"
    paymentTrxId: "",

    // Schedule & Scope
    dailyShiftTiming: "7:30 AM – 10:00 AM (Morning) & 5:30 PM – 7:00 PM (Evening)",
    monthlyOffDays: "2 Days per month (Fridays / Bi-weekly)",
    joiningDate: "2026-04-01",
    
    // Scope Checklist
    tasks: {
      cooking_lunch_dinner: true,
      floor_sweeping_mopping: true,
      dishwashing_kitchen_clean: true,
      clothes_washing: true,
      vegetable_cutting: true,
      bathroom_cleaning: false,
      dusting_furniture: false,
    },
  });

  const handleInputChange = (field, val) => {
    setStaffData((prev) => ({ ...prev, [field]: val }));
  };

  const handleTaskToggle = (taskKey) => {
    setStaffData((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskKey]: !prev.tasks[taskKey],
      },
    }));
  };

  const loadPreset = (type) => {
    if (type === "full_time") {
      setStaffData((prev) => ({
        ...prev,
        roleType: "full_time_maid",
        staffName: "Fatema Khatun",
        monthlyBaseSalary: 11000,
        dailyShiftTiming: "24 Hours Live-In (Full board & lodging provided)",
        monthlyOffDays: "2 Days per month",
        bonusType: "eid_bonus_full",
        tasks: {
          cooking_lunch_dinner: true,
          floor_sweeping_mopping: true,
          dishwashing_kitchen_clean: true,
          clothes_washing: true,
          vegetable_cutting: true,
          bathroom_cleaning: true,
          dusting_furniture: true,
        },
      }));
    } else if (type === "cook_only") {
      setStaffData((prev) => ({
        ...prev,
        roleType: "cook",
        staffName: "Salma Akter (Radhuni)",
        monthlyBaseSalary: 4500,
        dailyShiftTiming: "7:00 AM – 9:00 AM (Morning Cooking for 2 meals)",
        monthlyOffDays: "4 Fridays per month",
        bonusType: "eid_bonus_half",
        tasks: {
          cooking_lunch_dinner: true,
          floor_sweeping_mopping: false,
          dishwashing_kitchen_clean: false,
          clothes_washing: false,
          vegetable_cutting: true,
          bathroom_cleaning: false,
          dusting_furniture: false,
        },
      }));
    } else {
      // Standard Part-time 2BHK/3BHK Maid
      setStaffData((prev) => ({
        ...prev,
        roleType: "part_time_maid",
        staffName: "Rahima Begum",
        monthlyBaseSalary: 6500,
        dailyShiftTiming: "7:30 AM – 10:00 AM (Morning) & 5:30 PM – 7:00 PM (Evening)",
        monthlyOffDays: "2 Days per month (Fridays)",
        bonusType: "eid_bonus_half",
        tasks: {
          cooking_lunch_dinner: true,
          floor_sweeping_mopping: true,
          dishwashing_kitchen_clean: true,
          clothes_washing: true,
          vegetable_cutting: true,
          bathroom_cleaning: false,
          dusting_furniture: false,
        },
      }));
    }
  };

  // Financial Calculations
  const calculations = useMemo(() => {
    const base = Number(staffData.monthlyBaseSalary) || 0;
    
    // Festival Bonus calculation
    let bonus = 0;
    if (staffData.bonusType === "eid_bonus_half") bonus = base * 0.5;
    if (staffData.bonusType === "eid_bonus_full") bonus = base * 1.0;
    if (staffData.bonusType === "custom") bonus = Number(staffData.customBonusAmount) || 0;

    const overtime = Number(staffData.overtimeAllowance) || 0;
    const advance = Number(staffData.advanceDeduction) || 0;
    
    // Absent deduction
    const perDayRate = base / 30;
    const absentCost = (Number(staffData.absentDaysCount) || 0) * perDayRate;

    const totalGross = base + bonus + overtime;
    const netPayable = Math.max(0, totalGross - advance - absentCost);

    return {
      base,
      bonus,
      overtime,
      advance,
      absentCost: Math.round(absentCost),
      totalGross,
      netPayable: Math.round(netPayable),
    };
  }, [staffData]);

  const handlePrint = () => {
    window.print();
  };

  const generateMarkdownSummary = () => {
    let md = `# DOMESTIC HELPER / MAID SALARY & VERIFICATION VOUCHER\n`;
    md += `**Salary Month:** ${staffData.salaryMonth} | **Date:** ${new Date().toISOString().split("T")[0]}\n`;
    md += `**Employer:** ${staffData.employerName} (${staffData.employerPhone})\n`;
    md += `**Address:** ${staffData.employerAddress}\n\n`;
    md += `## Domestic Staff Profile:\n`;
    md += `- **Name:** ${staffData.staffName} (Phone: ${staffData.staffPhone})\n`;
    md += `- **NID:** ${staffData.staffNid} | **Father/Husband:** ${staffData.staffFatherHusband}\n`;
    md += `- **Permanent Address:** ${staffData.permanentAddress}\n`;
    md += `- **Guarantor:** ${staffData.guarantorName} (${staffData.guarantorPhone})\n\n`;
    md += `## Salary Breakdown (${staffData.salaryMonth}):\n`;
    md += `- **Base Monthly Salary:** ৳${calculations.base.toLocaleString()}\n`;
    if (calculations.bonus > 0) md += `- **Eid / Festival Bonus:** +৳${calculations.bonus.toLocaleString()}\n`;
    if (calculations.overtime > 0) md += `- **Extra Work / Overtime:** +৳${calculations.overtime.toLocaleString()}\n`;
    if (calculations.advance > 0) md += `- **Advance Loan Deduction:** -৳${calculations.advance.toLocaleString()}\n`;
    if (calculations.absentCost > 0) md += `- **Absent Deduction (${staffData.absentDaysCount} days):** -৳${calculations.absentCost.toLocaleString()}\n`;
    md += `- **NET PAYABLE SALARY:** ৳${calculations.netPayable.toLocaleString()} (Paid via: ${staffData.paymentMode.toUpperCase()})\n\n`;
    md += `*Payment disbursed and acknowledged by staff.*`;
    return md;
  };

  const handleCopy = () => {
    const text = generateMarkdownSummary();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Dhaka Maid & Cook Wage Benchmarks 2026
  const wageBenchmarks = [
    { work: "Cooking 2 Meals (Morning & Night for 4 persons)", flat: "2BHK / 3BHK", rate: "৳2,500 – ৳4,000 / mo", area: "Uttara / Mirpur" },
    { work: "Cooking 3 Full Meals + Snacks", flat: "3BHK / 4BHK", rate: "৳4,000 – ৳6,000 / mo", area: "Dhanmondi / Gulshan" },
    { work: "Floor Sweeping & Wet Mopping (ঘর ঝাড়ু ও মোছা)", flat: "1200 - 1600 sqft", rate: "৳1,200 – ৳2,000 / mo", area: "Dhaka Metro" },
    { work: "Dishwashing & Kitchen Sink Clean (বাসন মাজা)", flat: "Standard Family", rate: "৳1,000 – ৳1,800 / mo", area: "Dhaka Metro" },
    { work: "Clothes Washing & Folding (কাপড় ধোয়া)", flat: "Manual / Machine", rate: "৳1,200 – ৳2,200 / mo", area: "Dhaka Metro" },
    { work: "Full Part-Time Package (রান্না + ঘর মোছা + বাসন + কাপড়)", flat: "3BHK Family", rate: "৳5,500 – ৳8,500 / mo", area: "Bashundhara / Uttara" },
    { work: "24-Hour Live-in Helper (২৪ ঘণ্টা সার্বক্ষণিক কাজের লোক)", flat: "Full Residence", rate: "৳9,000 – ৳14,000 / mo", area: "All Dhaka + Food" },
    { work: "Personal Family Car Driver (ড্রাইভার - ১২ ঘণ্টা ডিউটি)", flat: "Sedan / SUV", rate: "৳16,000 – ৳22,000 / mo", area: "Dhaka Metro + Overtime" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-cyan-950 text-white px-5 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <HeartHandshake className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">
                  {lang === "en" ? "Domestic Staff & Maid Salary Manager" : "গৃহকর্মী ও কাজের বুয়া বেতন ও ভেরিফিকেশন সনদ"}
                </h2>
                <span className="text-[10px] bg-teal-300 text-teal-950 font-bold px-2 py-0.5 rounded-full uppercase">
                  DMP NID Verified
                </span>
              </div>
              <p className="text-xs text-teal-100/90 mt-0.5">
                {lang === "en"
                  ? "Monthly salary slips, Eid bonus calculation, police background record & Dhaka wage index"
                  : "কাজের বুয়া ও রাঁধুনির মাসিক বেতন স্লিপ, ঈদ বোনাস ভাউচার এবং ডিএমপি পুলিশ ভেরিফিকেশন"}
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2">
            <div className="bg-teal-950/60 p-0.5 rounded-lg border border-teal-500/30 flex text-xs">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded-md font-semibold transition ${
                  lang === "en" ? "bg-white text-teal-950 shadow-sm" : "text-teal-200 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("bn")}
                className={`px-2 py-1 rounded-md font-semibold transition ${
                  lang === "bn" ? "bg-white text-teal-950 shadow-sm" : "text-teal-200 hover:text-white"
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

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("form")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "form"
                  ? "bg-teal-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>1. Staff & Salary Setup</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("voucher")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "voucher"
                  ? "bg-teal-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>2. Printable Salary Slip</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("verification")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "verification"
                  ? "bg-teal-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>3. Police Verification Form</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("rates")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "rates"
                  ? "bg-teal-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>4. Dhaka Wage Index</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? "Copied!" : "Copy Summary"}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-bold bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* TAB 1: FORM SETUP */}
          {activeTab === "form" && (
            <div className="space-y-6">
              
              {/* Presets */}
              <div className="bg-teal-50/80 border border-teal-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-700" />
                  <span className="text-xs font-bold text-teal-950 uppercase tracking-wide">
                    {lang === "en" ? "Fast Preset Configurations:" : "দ্রুত সেটআপ প্রিসেট:"}
                  </span>
                  <span className="text-xs text-teal-800">
                    {lang === "en"
                      ? "Load standard roles for Part-Time Maid, Live-in Helper, or Dedicated Cook"
                      : "ছুটা বুয়া, ফুল-টাইম গৃহকর্মী অথবা বাবুর্চির ডিফল্ট বেতন কাঠামো লোড করুন"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => loadPreset("part_time")}
                    className="px-2.5 py-1 text-xs font-semibold bg-white border border-teal-300 rounded-lg text-teal-900 hover:bg-teal-100 transition shadow-sm"
                  >
                    🧹 Part-Time Maid (ছুটা বুয়া)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPreset("full_time")}
                    className="px-2.5 py-1 text-xs font-semibold bg-white border border-teal-300 rounded-lg text-teal-900 hover:bg-teal-100 transition shadow-sm"
                  >
                    🏡 Full-Time Live-In (২৪ ঘণ্টা)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPreset("cook_only")}
                    className="px-2.5 py-1 text-xs font-semibold bg-white border border-teal-300 rounded-lg text-teal-900 hover:bg-teal-100 transition shadow-sm"
                  >
                    🍳 Cook / Chef (বাবুর্চি)
                  </button>
                </div>
              </div>

              {/* Top Financial Live Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase block">Base Salary</span>
                  <span className="text-xl font-bold text-slate-900 block mt-0.5">৳{calculations.base.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500">{staffData.salaryMonth}</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
                  <span className="text-[11px] font-semibold text-amber-700 uppercase block">Bonus + Extra</span>
                  <span className="text-xl font-bold text-amber-900 block mt-0.5">+৳{(calculations.bonus + calculations.overtime).toLocaleString()}</span>
                  <span className="text-[10px] text-amber-600">Festival & Overtime</span>
                </div>
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5">
                  <span className="text-[11px] font-semibold text-rose-700 uppercase block">Deductions</span>
                  <span className="text-xl font-bold text-rose-900 block mt-0.5">-৳{(calculations.advance + calculations.absentCost).toLocaleString()}</span>
                  <span className="text-[10px] text-rose-600">Advance / Absent</span>
                </div>
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-3.5">
                  <span className="text-[11px] font-semibold text-teal-700 uppercase block">Net Salary Payable</span>
                  <span className="text-xl font-bold text-teal-900 block mt-0.5">৳{calculations.netPayable.toLocaleString()}</span>
                  <span className="text-[10px] text-teal-600">Take-home pay</span>
                </div>
              </div>

              {/* Section 1: Staff Details & Employer */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <UserCheck className="w-4 h-4 text-teal-600" />
                  <span>1. Domestic Staff & Employer Profile</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Staff Full Name</label>
                    <input
                      type="text"
                      value={staffData.staffName}
                      onChange={(e) => handleInputChange("staffName", e.target.value)}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Staff Mobile Number</label>
                    <input
                      type="text"
                      value={staffData.staffPhone}
                      onChange={(e) => handleInputChange("staffPhone", e.target.value)}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">National ID (NID) No.</label>
                    <input
                      type="text"
                      value={staffData.staffNid}
                      onChange={(e) => handleInputChange("staffNid", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Husband / Father's Name</label>
                    <input
                      type="text"
                      value={staffData.staffFatherHusband}
                      onChange={(e) => handleInputChange("staffFatherHusband", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Permanent Village & District</label>
                    <input
                      type="text"
                      value={staffData.permanentAddress}
                      onChange={(e) => handleInputChange("permanentAddress", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Local Guarantor (Name & Phone)</label>
                    <input
                      type="text"
                      value={`${staffData.guarantorName} (${staffData.guarantorPhone})`}
                      onChange={(e) => {
                        const parts = e.target.value.split("(");
                        handleInputChange("guarantorName", parts[0]?.trim() || "");
                        if (parts[1]) handleInputChange("guarantorPhone", parts[1].replace(")", "").trim());
                      }}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Employer Name & Phone</label>
                    <input
                      type="text"
                      value={`${staffData.employerName} (${staffData.employerPhone})`}
                      onChange={(e) => {
                        const parts = e.target.value.split("(");
                        handleInputChange("employerName", parts[0]?.trim() || "");
                        if (parts[1]) handleInputChange("employerPhone", parts[1].replace(")", "").trim());
                      }}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Employer Residence Address</label>
                    <input
                      type="text"
                      value={staffData.employerAddress}
                      onChange={(e) => handleInputChange("employerAddress", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Salary, Bonus & Adjustments */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>2. Monthly Salary & Bonus Calculation</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Disbursement Month</label>
                    <input
                      type="text"
                      value={staffData.salaryMonth}
                      onChange={(e) => handleInputChange("salaryMonth", e.target.value)}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Base Monthly Salary (৳)</label>
                    <input
                      type="number"
                      value={staffData.monthlyBaseSalary}
                      onChange={(e) => handleInputChange("monthlyBaseSalary", Number(e.target.value))}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 text-teal-900 focus:bg-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Festival / Eid Bonus</label>
                    <select
                      value={staffData.bonusType}
                      onChange={(e) => handleInputChange("bonusType", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="none">No Bonus this month</option>
                      <option value="eid_bonus_half">Eid Bonus 50% (৳{Math.round(calculations.base * 0.5).toLocaleString()})</option>
                      <option value="eid_bonus_full">Full 1-Month Bonus (৳{calculations.base.toLocaleString()})</option>
                      <option value="custom">Custom Bonus Amount</option>
                    </select>
                  </div>
                  {staffData.bonusType === "custom" && (
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Custom Bonus (৳)</label>
                      <input
                        type="number"
                        value={staffData.customBonusAmount}
                        onChange={(e) => handleInputChange("customBonusAmount", Number(e.target.value))}
                        className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Overtime / Extra Duty (৳)</label>
                    <input
                      type="number"
                      value={staffData.overtimeAllowance}
                      onChange={(e) => handleInputChange("overtimeAllowance", Number(e.target.value))}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Advance Loan Deducted (৳)</label>
                    <input
                      type="number"
                      value={staffData.advanceDeduction}
                      onChange={(e) => handleInputChange("advanceDeduction", Number(e.target.value))}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 text-rose-700 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Unexcused Absence (Days)</label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={staffData.absentDaysCount}
                      onChange={(e) => handleInputChange("absentDaysCount", Number(e.target.value))}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 text-center focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Payment Method</label>
                    <select
                      value={staffData.paymentMode}
                      onChange={(e) => handleInputChange("paymentMode", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="cash">💵 Cash in Hand (নগদ)</option>
                      <option value="bkash">📱 bKash Transfer</option>
                      <option value="nagad">📲 Nagad Transfer</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Task & Duty Checklist */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>3. Agreed Daily Tasks & Job Scope</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-teal-50/50 transition">
                    <input
                      type="checkbox"
                      checked={staffData.tasks.cooking_lunch_dinner}
                      onChange={() => handleTaskToggle("cooking_lunch_dinner")}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>Cooking Meals (রান্নাবান্না)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-teal-50/50 transition">
                    <input
                      type="checkbox"
                      checked={staffData.tasks.floor_sweeping_mopping}
                      onChange={() => handleTaskToggle("floor_sweeping_mopping")}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>Sweeping & Mopping (ঘর ঝাড়ু ও মোছা)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-teal-50/50 transition">
                    <input
                      type="checkbox"
                      checked={staffData.tasks.dishwashing_kitchen_clean}
                      onChange={() => handleTaskToggle("dishwashing_kitchen_clean")}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>Dishwashing & Sink (বাসন মাজা)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-teal-50/50 transition">
                    <input
                      type="checkbox"
                      checked={staffData.tasks.clothes_washing}
                      onChange={() => handleTaskToggle("clothes_washing")}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>Clothes Washing (কাপড় ধোয়া)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-teal-50/50 transition">
                    <input
                      type="checkbox"
                      checked={staffData.tasks.vegetable_cutting}
                      onChange={() => handleTaskToggle("vegetable_cutting")}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>Vegetables & Fish Prep (কাটাকুটি)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-teal-50/50 transition">
                    <input
                      type="checkbox"
                      checked={staffData.tasks.bathroom_cleaning}
                      onChange={() => handleTaskToggle("bathroom_cleaning")}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>Bathroom Deep Clean (বাথরুম পরিষ্কার)</span>
                  </label>
                </div>
              </div>

              {/* View Voucher CTA */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab("voucher")}
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-700 to-emerald-800 text-white font-bold rounded-xl text-sm hover:from-teal-800 hover:to-emerald-900 transition flex items-center gap-2 shadow-md"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Generate Official Salary Slip & Verification Record</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: PRINTABLE SALARY SLIP */}
          {activeTab === "voucher" && (
            <div className="space-y-6">
              <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-10 shadow-lg font-serif text-slate-900 space-y-6">
                
                {/* Letterhead */}
                <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
                  <div className="inline-block bg-teal-900 text-white text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-0.5 rounded-full mb-1">
                    Monthly Domestic Helper & Staff Salary Voucher (মাসিক বেতন রসিদ)
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-950">
                    {lang === "en"
                      ? "DOMESTIC STAFF SALARY & BONUS DISBURSEMENT VOUCHER"
                      : "গৃহকর্মী ও কাজের বুয়া মাসিক বেতন ও উৎসব বোনাস পরিশোধ রসিদ"}
                  </h1>
                  <p className="text-xs font-sans text-slate-600">
                    Month of Service: <strong>{staffData.salaryMonth}</strong> | Payment Date: <strong>{new Date().toISOString().split("T")[0]}</strong>
                  </p>
                </div>

                {/* Metadata Box */}
                <div className="font-sans text-xs grid grid-cols-2 sm:grid-cols-4 gap-3 bg-teal-50/50 p-4 border border-teal-200 rounded-xl">
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Staff Name:</span>
                    <span className="font-bold text-slate-900">{staffData.staffName}</span>
                    <span className="block text-slate-600 text-[11px]">{staffData.staffPhone}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">National ID (NID):</span>
                    <span className="font-bold text-slate-900">{staffData.staffNid}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Employer Name:</span>
                    <span className="font-bold text-slate-900">{staffData.employerName}</span>
                    <span className="block text-slate-600 text-[11px]">{staffData.employerPhone}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Work Residence:</span>
                    <span className="font-bold text-slate-900">{staffData.employerAddress}</span>
                  </div>
                </div>

                {/* Financial Table */}
                <div className="font-sans space-y-2 text-xs">
                  <h4 className="font-bold uppercase tracking-wider text-slate-800 bg-slate-200 px-3 py-1 rounded">
                    Itemized Salary & Bonus Statement
                  </h4>
                  <table className="w-full text-xs border border-slate-300">
                    <thead className="bg-slate-100 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-2 border-r border-slate-300 text-left">Earning / Deduction Particulars</th>
                        <th className="p-2 border-r border-slate-300 text-left w-36">Calculation Basis</th>
                        <th className="p-2 text-right w-36">Amount (BDT ৳)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300 font-medium">
                      <tr>
                        <td className="p-2 border-r border-slate-300 font-semibold">Base Monthly Salary ({staffData.salaryMonth})</td>
                        <td className="p-2 border-r border-slate-300 text-slate-600">Standard Monthly</td>
                        <td className="p-2 text-right font-bold">৳{calculations.base.toLocaleString()}</td>
                      </tr>
                      {calculations.bonus > 0 && (
                        <tr>
                          <td className="p-2 border-r border-slate-300 font-semibold text-emerald-800">
                            Eid / Festival Bonus ({staffData.bonusType === "eid_bonus_half" ? "50% Basic" : "100% Basic"})
                          </td>
                          <td className="p-2 border-r border-slate-300 text-slate-600">Festival Allowance</td>
                          <td className="p-2 text-right font-bold text-emerald-800">+৳{calculations.bonus.toLocaleString()}</td>
                        </tr>
                      )}
                      {calculations.overtime > 0 && (
                        <tr>
                          <td className="p-2 border-r border-slate-300 font-semibold text-emerald-800">Extra Duty & Overtime Work</td>
                          <td className="p-2 border-r border-slate-300 text-slate-600">Additional Hours</td>
                          <td className="p-2 text-right font-bold text-emerald-800">+৳{calculations.overtime.toLocaleString()}</td>
                        </tr>
                      )}
                      {calculations.advance > 0 && (
                        <tr>
                          <td className="p-2 border-r border-slate-300 font-semibold text-rose-700">Advance Salary Adjustment (ধার কর্তন)</td>
                          <td className="p-2 border-r border-slate-300 text-slate-600">Pre-payment</td>
                          <td className="p-2 text-right font-bold text-rose-700">-৳{calculations.advance.toLocaleString()}</td>
                        </tr>
                      )}
                      {calculations.absentCost > 0 && (
                        <tr>
                          <td className="p-2 border-r border-slate-300 font-semibold text-rose-700">
                            Unexcused Absence Deduction ({staffData.absentDaysCount} Days)
                          </td>
                          <td className="p-2 border-r border-slate-300 text-slate-600">৳{Math.round(calculations.base / 30)}/day</td>
                          <td className="p-2 text-right font-bold text-rose-700">-৳{calculations.absentCost.toLocaleString()}</td>
                        </tr>
                      )}
                      <tr className="bg-teal-50/80 font-black text-slate-900 text-sm">
                        <td className="p-2.5 border-r border-slate-300" colSpan={2}>
                          NET SALARY PAID IN FULL (সর্বমোট প্রদেয় নিট বেতন)
                        </td>
                        <td className="p-2.5 text-right text-teal-900 text-base font-black">
                          ৳{calculations.netPayable.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Acknowledgement & Signatures */}
                <div className="font-sans text-xs space-y-4 pt-4">
                  <p className="text-[11px] text-slate-600 leading-relaxed italic">
                    {lang === "en"
                      ? `I, ${staffData.staffName}, acknowledge that I have received the full net salary of ৳${calculations.netPayable.toLocaleString()} for the month of ${staffData.salaryMonth} without any dispute.`
                      : `আমি, ${staffData.staffName}, স্বীকার করিতেছি যে ${staffData.salaryMonth} মাসের সম্পূর্ণ বেতন বাবদ নগদ/বিকাশে ৳${calculations.netPayable.toLocaleString()} টাকা বুঝিয়া পাইলাম। আমার আর কোনো দাবি বা পাওনা রহিল না।`}
                  </p>

                  <div className="grid grid-cols-2 gap-8 pt-10 text-center">
                    <div className="border-t-2 border-slate-800 pt-1.5">
                      <p className="font-bold text-slate-900">{staffData.employerName}</p>
                      <p className="text-[11px] text-slate-600">Employer Signature (নিয়োগকর্তার স্বাক্ষর)</p>
                      <p className="text-[10px] text-slate-400">Date: _______________</p>
                    </div>

                    <div className="border-t-2 border-slate-800 pt-1.5 flex flex-col items-center">
                      <div className="w-16 h-12 border border-slate-400 border-dashed rounded mb-1 flex items-center justify-center text-[9px] text-slate-400">
                        Left Thumb / টিপসই
                      </div>
                      <p className="font-bold text-slate-900">{staffData.staffName}</p>
                      <p className="text-[11px] text-slate-600">Staff Signature / Thumb Impression</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: DMP POLICE VERIFICATION RECORD */}
          {activeTab === "verification" && (
            <div className="space-y-6">
              <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-10 shadow-lg font-serif text-slate-900 space-y-6">
                
                {/* Letterhead */}
                <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
                  <div className="inline-block bg-slate-900 text-white text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-0.5 rounded-full mb-1">
                    Dhaka Metropolitan Police (DMP) Domestic Staff Verification Sheet
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-950">
                    {lang === "en"
                      ? "DOMESTIC HELPER / MAID BACKGROUND RECORD & POLICE INFORMATION"
                      : "গৃহকর্মী / কাজের লোকের পরিচিতি ও ডিএমপি পুলিশ ভেরিফিকেশন ফরম"}
                  </h1>
                  <p className="text-xs font-sans text-slate-600">
                    Thana Security Compliance Form for Resident Households in Dhaka
                  </p>
                </div>

                {/* Details Matrix */}
                <div className="font-sans text-xs space-y-3">
                  <div className="grid grid-cols-3 gap-4 border border-slate-300 p-4 rounded-xl bg-slate-50">
                    <div className="col-span-2 space-y-2">
                      <p><strong>1. Full Name (নাম):</strong> {staffData.staffName}</p>
                      <p><strong>2. Father / Husband (পিতা/স্বামী):</strong> {staffData.staffFatherHusband}</p>
                      <p><strong>3. National ID Card No (জাতীয় পরিচয়পত্র):</strong> <span className="font-mono font-bold">{staffData.staffNid}</span></p>
                      <p><strong>4. Age / Date of Birth (বয়স):</strong> {staffData.staffAge}</p>
                      <p><strong>5. Mobile Number (মোবাইল):</strong> {staffData.staffPhone}</p>
                      <p><strong>6. Permanent Village Address (স্থায়ী ঠিকানা):</strong> {staffData.permanentAddress}</p>
                      <p><strong>7. Present Dhaka Address (বর্তমান ঠিকানা):</strong> {staffData.dhakaLivingAddress}</p>
                    </div>

                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-400 p-3 rounded-lg text-center bg-white">
                      <div className="w-24 h-28 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 rounded">
                        Passport Size Photo (ছবি সংযুক্ত করুন)
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-300 p-4 rounded-xl space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs border-b pb-1">Emergency Guarantor in Dhaka (ঢাকায় স্থানীয় অভিভাবক/জামিনদার):</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <p><strong>Guarantor Name:</strong> {staffData.guarantorName}</p>
                      <p><strong>Contact Phone:</strong> {staffData.guarantorPhone}</p>
                    </div>
                  </div>

                  <div className="border border-slate-300 p-4 rounded-xl space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs border-b pb-1">Employer Residence Details (নিয়োগকারী গৃহকর্তার তথ্য):</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <p><strong>Employer Name:</strong> {staffData.employerName}</p>
                      <p><strong>Employer Phone:</strong> {staffData.employerPhone}</p>
                      <p className="col-span-2"><strong>Residence Address:</strong> {staffData.employerAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Signatures */}
                <div className="font-sans text-xs grid grid-cols-2 gap-8 pt-6 text-center">
                  <div className="border-t-2 border-slate-800 pt-1.5">
                    <p className="font-bold text-slate-900">{staffData.employerName}</p>
                    <p className="text-[11px] text-slate-600">Employer Signature (গৃহকর্তার স্বাক্ষর)</p>
                  </div>
                  <div className="border-t-2 border-slate-800 pt-1.5">
                    <p className="font-bold text-slate-900">{staffData.staffName}</p>
                    <p className="text-[11px] text-slate-600">Staff Left Thumb / Signature (টিপসই)</p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: WAGE BENCHMARKS */}
          {activeTab === "rates" && (
            <div className="space-y-4">
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-xs text-teal-900 flex items-center gap-3">
                <Info className="w-5 h-5 text-teal-700 shrink-0" />
                <span>
                  <strong>Dhaka Fair Wage Benchmark (2026):</strong> This index reflects standard market wages across Uttara, Mirpur, Dhanmondi, Bashundhara, and Gulshan/Banani based on household size and task scope.
                </span>
              </div>

              <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Job Scope / Task (কাজের ধরন)</th>
                      <th className="p-3">Flat Size / Capacity</th>
                      <th className="p-3">Standard Monthly Rate (৳)</th>
                      <th className="p-3">Popular Zones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {wageBenchmarks.map((bench, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">{bench.work}</td>
                        <td className="p-3 text-slate-600">{bench.flat}</td>
                        <td className="p-3 font-bold text-teal-900 bg-teal-50/40">{bench.rate}</td>
                        <td className="p-3 text-slate-600">{bench.area}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Compliant with Dhaka Metropolitan Police & Bangladesh Domestic Worker Welfare Rules</span>
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
              className="px-4 py-1.5 text-xs font-bold bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Salary Slip</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
