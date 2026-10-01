import React, { useState } from "react";
import {
  X,
  Printer,
  Copy,
  Check,
  Building,
  Shield,
  Zap,
  Droplets,
  Trash2,
  Bell,
  FileText,
  DollarSign,
  Calculator,
  Users,
  AlertCircle,
  FileCheck,
  Wrench,
  Car
} from "lucide-react";

export default function BuildingSocietyManagerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("service-bill"); // "service-bill" | "bylaws" | "notice" | "finance"
  const [copied, setCopied] = useState(false);

  // General Society & Building Details
  const [societyData, setFormData] = useState({
    societyName: "Green View Residential Welfare Society",
    societyRegNo: "REG/DHAKA-SOC/2024/0912",
    buildingName: "Green View Heights",
    buildingAddress: "Plot 18, Road 7, Block D, Bashundhara R/A, Dhaka-1229",
    totalFlats: 16,
    flatNo: "Flat # 4B (4th Floor)",
    ownerResidentName: "MD Hasib Ullah Khan Alvie",
    residentType: "Tenant (ভাড়াটিয়া)", // "Owner (মালিক)" | "Tenant (ভাড়াটিয়া)"
    billingMonth: "October 2026",
    paymentDueDate: "2026-10-10",

    // Service Charge Line Items (in BDT)
    securityGuardSalary: 18000, // Total for 2 guards
    sweeperCleanerSalary: 6000,
    wasaBoosterPumpElectric: 7500,
    liftMaintenanceAmc: 5000,
    generatorFuelMaintenance: 6500,
    garbageWasteBill: 2000,
    cctvIntercomMaintenance: 1500,
    commonAreaLighting: 2000,
    reserveContingencyFund: 4000, // Reserve fund allocation

    // Notice details
    noticeType: "water_tank", // "water_tank" | "agm_meeting" | "generator_servicing" | "roof_rules"
    noticeDate: "2026-10-02",
    eventTime: "10:00 AM to 04:00 PM",

    // Bylaws configuration
    quietHoursStart: "11:00 PM",
    quietHoursEnd: "06:00 AM",
    roofClosingTime: "10:00 PM",
    visitorParkingHours: "Max 3 Hours",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculations for Building Service Charge
  const totalFlatsCount = Math.max(1, Number(societyData.totalFlats) || 1);
  const totalMonthlyBuildingExpense =
    Number(societyData.securityGuardSalary) +
    Number(societyData.sweeperCleanerSalary) +
    Number(societyData.wasaBoosterPumpElectric) +
    Number(societyData.liftMaintenanceAmc) +
    Number(societyData.generatorFuelMaintenance) +
    Number(societyData.garbageWasteBill) +
    Number(societyData.cctvIntercomMaintenance) +
    Number(societyData.commonAreaLighting) +
    Number(societyData.reserveContingencyFund);

  const perFlatServiceCharge = Math.ceil(totalMonthlyBuildingExpense / totalFlatsCount);
  const annualSocietyTurnover = totalMonthlyBuildingExpense * 12;

  // Render Service Charge Bill Voucher Text
  const serviceBillText = `
${societyData.societyName.toUpperCase()}
${societyData.buildingAddress}
রেজিস্ট্রেশন নং: ${societyData.societyRegNo}
---------------------------------------------------------------------------------
মাসিক ফ্ল্যাট সার্ভিস চার্জ ও মেইনটেন্যান্স বিল ভাউচার
বিলিং মাস: ${societyData.billingMonth} | পরিশোধের শেষ তারিখ: ${societyData.paymentDueDate}
---------------------------------------------------------------------------------

ফ্ল্যাট ও অধিবাসীর তথ্য:
ফ্ল্যাট নম্বর: ${societyData.flatNo}
অধিবাসীর নাম: ${societyData.ownerResidentName} (${societyData.residentType})
মোট ফ্ল্যাট সংখ্যা: ${societyData.totalFlats} টি

ভবনের মোট মাসিক ব্যয় বিবরণী (${societyData.billingMonth}):
১. নিরাপত্তা প্রহরী (সিকিউরিটি গার্ড) বেতন: ৳ ${Number(societyData.securityGuardSalary).toLocaleString("en-IN")}
২. ক্লিনার / সুইপার পরিচ্ছন্নতা বিল: ৳ ${Number(societyData.sweeperCleanerSalary).toLocaleString("en-IN")}
৩. ওয়াসা বুস্টার পাম্প ও কমন বিদ্যুৎ বিল: ৳ ${Number(societyData.wasaBoosterPumpElectric).toLocaleString("en-IN")}
৪. লিফট অপারেশন ও নিয়মিত সার্ভিসিং (AMC): ৳ ${Number(societyData.liftMaintenanceAmc).toLocaleString("en-IN")}
৫. জেনারেটর ডিজেল জ্বালানি ও রক্ষণাবেক্ষণ: ৳ ${Number(societyData.generatorFuelMaintenance).toLocaleString("en-IN")}
৬. সিটি কর্পোরেশন ময়লা অপসারণ বিল: ৳ ${Number(societyData.garbageWasteBill).toLocaleString("en-IN")}
৭. সিসিটিভি, ইন্টারকম ও কমন লাইটিং: ৳ ${(Number(societyData.cctvIntercomMaintenance) + Number(societyData.commonAreaLighting)).toLocaleString("en-IN")}
৮. সোসাইটি জরুরি রিজার্ভ ফান্ড সঞ্চয়: ৳ ${Number(societyData.reserveContingencyFund).toLocaleString("en-IN")}
---------------------------------------------------------------------------------
ভবনের সর্বমোট মাসিক রক্ষণাবেক্ষণ ব্যয়: ৳ ${totalMonthlyBuildingExpense.toLocaleString("en-IN")}/-

প্রতি ফ্ল্যাটের প্রদেয় মাসিক সার্ভিস চার্জ: ৳ ${perFlatServiceCharge.toLocaleString("en-IN")}/-
(কথায়: ${perFlatServiceCharge} টাকা মাত্র)

বিশেষ দ্রষ্টব্য:
* প্রতি মাসের ১০ তারিখের মধ্যে কল্যাণ সমিতির ব্যাংক একাউন্ট / কোষাধ্যক্ষের নিকট সার্ভিস চার্জ পরিশোধ করিতে হইবে।
* বিলম্বিত পরিশোধের ক্ষেত্রে সাধারণ সভার সিদ্ধান্ত অনুযায়ী অতিরিক্ত চার্জ প্রযোজ্য হইতে পারে।

আদায়কারীর স্বাক্ষর: _________________        ফ্ল্যাট গ্রহীতার স্বাক্ষর: _________________
(কোষাধ্যক্ষ / সাধারণ সম্পাদক)
  `.trim();

  // Render Society Bylaws text
  const bylawsText = `
${societyData.societyName.toUpperCase()}
ফ্ল্যাট ওনার্স ও রেসিডেন্টস কল্যাণ সমিতি - গঠনতন্ত্র ও আবাসিক নীতিমালা
(${societyData.buildingName}, ${societyData.buildingAddress})
---------------------------------------------------------------------------------

১. সমিতির মূল উদ্দেশ্য:
ভবনের সার্বিক নিরাপত্তা রক্ষা, পরিষ্কার-পরিচ্ছন্নতা বজায় রাখা, লিফট/জেনারেটর/পাম্পের নিরবচ্ছিন্ন কার্যকারিতা নিশ্চিতকরণ এবং অধিবাসীদের মধ্যে পারস্পরিক সৌহার্দ্য রক্ষা করা।

২. কার্যনির্বাহী কমিটি ও নির্বাচন:
সমিতির কার্যক্রম পরিচালনার জন্য ২ বছর মেয়াদি সভাপতি, সহ-সভাপতি, সাধারণ সম্পাদক, কোষাধ্যক্ষ ও ২ জন সদস্য বিশিষ্ট নির্বাহী কমিটি দায়িত্ব পালন করিবে।

৩. মাসিক সার্ভিস চার্জ সংক্রান্ত নিয়ম:
(ক) প্রত্যেক ফ্ল্যাট মালিক/ভাড়াটিয়া প্রতি মাসের ১০ তারিখের মধ্যে নির্ধারিত সার্ভিস চার্জ (বর্তমানে ৳ ${perFlatServiceCharge}/-) পরিশোধ করিতে বাধ্য থাকিবেন।
(খ) ফ্ল্যাট খালি থাকিলেও লিফট, জেনারেটর ও গার্ডের ন্যূনতম সার্ভিস চার্জ ফ্ল্যাট মালিককে বহন করিতে হইবে।

৪. ছাদ (Rooftop) ব্যবহারের নিয়মাবলী:
(ক) ছাদ শুধুমাত্র কাপড় শুকানো ও সাধারণ হাটার জন্য ব্যবহারযোগ্য। রাত ${societyData.roofClosingTime}-এর পর নিরাপত্তা স্বার্থে ছাদের প্রধান গেট তালাবদ্ধ থাকিবে।
(খ) ছাদে কোনো বড় অনুষ্ঠান বা বার-বি-কিউ পার্টি করিতে হইলে অন্তত ৩ দিন পূর্বে সমিতির সাধারণ সম্পাদককে অবগত করিয়া অনুমতি গ্রহণ করিতে হইবে।

৫. শান্ত পরিবেশ ও কোলাহল নিয়ন্ত্রণ (Noise Policy):
রাত ${societyData.quietHoursStart} হইতে ভোর ${societyData.quietHoursEnd} পর্যন্ত কোনো প্রকার উচ্চশব্দে গান বাজানো, ড্রিলিং বা ভারী ডেকোরেশনের কাজ সম্পূর্ণ নিষিদ্ধ।

৬. পার্কিং ও কমন স্পেস:
(ক) নির্দিষ্ট চিহ্নিত পার্কিং স্লট ব্যতীত ড্রাইভওয়েতে গাড়ি রাখা যাইবে না।
(খ) অতিথি গাড়ি পার্কিংয়ের সময় সর্বোচ্চ ${societyData.visitorParkingHours} পর্যন্ত সীমাবদ্ধ।

৭. বর্জ্য ব্যবস্থাপনা:
প্রতিদিন সকাল ৯টা হইতে ১০টার মধ্যে ময়লার ব্যাগ নিজ ফ্ল্যাটের দরজার বাইরে নির্দিষ্ট বিন-এ রাখিতে হইবে।

অনুমোদনে:
সাধারণ সম্পাদক: ________________________      সভাপতি: ________________________
${societyData.societyName}
  `.trim();

  // Render Notice text based on type
  const getNoticeContent = () => {
    switch (societyData.noticeType) {
      case "water_tank":
        return `
জরুরি বিজ্ঞপ্তি: ওয়াসা পানির রিজার্ভার ও ছাদের পানির ট্যাংক পরিষ্কার প্রসঙ্গে
তারিখ: ${societyData.noticeDate}

Green View Heights-এর সকল সম্মানিত অধিবাসীদের অবগতির জন্য জানানো যাইতেছে যে, আগামী ${societyData.noticeDate} (সময়: ${societyData.eventTime}) ভবনের ভূগর্ভস্থ রিজার্ভার ও ছাদের ওভারহেড পানির ট্যাংক জীবাণুমুক্তকরণ ও গভীর পরিষ্কারের কাজ চলিবে।

উক্ত সময়ে ওয়াসা বুস্টার পাম্পের পানি সরবরাহ সাময়িকভাবে বন্ধ থাকিবে। সম্মানিত অধিবাসীদের নিজ নিজ প্রয়োজনীয় পানি পূর্বেই সংরক্ষণ করিয়া রাখার জন্য বিশেষভাবে অনুরোধ করা যাইতেছে।

সাময়িক অসুবিধার জন্য সমিতি আন্তরিকভাবে দুঃখিত।

আদেশক্রমে,
ব্যবস্থাপনা কমিটি, ${societyData.societyName}
        `.trim();
      case "agm_meeting":
        return `
জরুরি নোটিশ: ফ্ল্যাট মালিক ও কল্যাণ সমিতির বার্ষিক সাধারণ সভা (AGM)
তারিখ: ${societyData.noticeDate}

Green View Heights-এর সকল ফ্ল্যাট মালিক ও সম্মানিত অধিবাসীদের সদয় অবগতির জন্য জানানো যাইতেছে যে, আগামী ${societyData.noticeDate} রোজ শুক্রবার, সময়: সন্ধ্যা ০৮:০০ ঘটিকায় ভবনের নিচতলার কমিউনিটি হলে সমিতির বার্ষিক সাধারণ সভা (AGM) অনুষ্ঠিত হইবে।

আলোচ্য সূচি:
১. বিগত বৎসরের আয়-ব্যয় অডিট রিপোর্ট ও রিজার্ভ ফান্ডের স্থিতি অনুমোদন।
২. লিফট ও জেনারেটরের বাৎসরিক সার্ভিসিং চুক্তি নবায়ন।
৩. নতুন মেয়াদের কার্যনির্বাহী কমিটি গঠন ও বিবিধ আলোচনা।

উক্ত সভায় সকল ফ্ল্যাট মালিককে যথাসময়ে উপস্থিত থাকিবার জন্য অনুরোধ করা হইল।

আহ্বায়ক:
সাধারণ সম্পাদক ও সভাপতি, ${societyData.societyName}
        `.trim();
      default:
        return `
জরুরি নোটিশ: লিফট ও জেনারেটর সার্ভিসিং এবং বিদ্যুৎ মেইনটেন্যান্স
তারিখ: ${societyData.noticeDate}

সম্মানিত ফ্ল্যাট অধিবাসীদের জানানো যাইতেছে যে, আগামী ${societyData.noticeDate} সময়: ${societyData.eventTime} পর্যন্ত ভবনের মূল জেনারেটর ও প্যাসেঞ্জার লিফটের নিয়মিত রক্ষণাবেক্ষণ ও ক্যাবল চেকিং কার্য পরিচালিত হইবে।

উক্ত সময়ে লিফট চলাচল কিছু সময়ের জন্য নিয়ন্ত্রিত থাকিতে পারে। বয়োবৃদ্ধ ও রোগীদের চলাচলে বিশেষ সতর্কতা অবলম্বনের অনুরোধ করা হইল।

ধন্যবাদান্তে,
কেয়ারটেকার ও মেইনটেন্যান্স ইনচার্জ, ${societyData.societyName}
        `.trim();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-6 py-4 border-b border-blue-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-400">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Building Welfare Society & Service Charge Manager
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                  ফ্ল্যাট সমিতি ও সার্ভিস চার্জ
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Monthly Maintenance Bill Voucher, Association Bylaws, Lift/Pump Notice Board & Reserve Fund Calculator
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 pt-2 gap-2 overflow-x-auto text-sm">
          <button
            onClick={() => setActiveTab("service-bill")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium border-b-2 transition ${
              activeTab === "service-bill"
                ? "border-blue-400 text-blue-300 bg-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Monthly Service Bill (সার্ভিস চার্জ ভাউচার)</span>
          </button>
          <button
            onClick={() => setActiveTab("bylaws")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium border-b-2 transition ${
              activeTab === "bylaws"
                ? "border-indigo-400 text-indigo-300 bg-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Society Bylaws & Rules (গঠনতন্ত্র ও নিয়মাবলী)</span>
          </button>
          <button
            onClick={() => setActiveTab("notice")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium border-b-2 transition ${
              activeTab === "notice"
                ? "border-amber-400 text-amber-300 bg-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Circular & Notice Board (জরুরি নোটিশ)</span>
          </button>
          <button
            onClick={() => setActiveTab("finance")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium border-b-2 transition ${
              activeTab === "finance"
                ? "border-emerald-400 text-emerald-300 bg-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Building Expense Budget (আয়-ব্যয় হিসাব)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Quick Header Config */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-400" />
              <span>Apartment Society & Resident Profile (সোসাইটি ও ফ্ল্যাট বিবরণ)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Society Name (সমিতির নাম)</label>
                <input
                  type="text"
                  value={societyData.societyName}
                  onChange={(e) => handleInputChange("societyName", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Building Name / Address</label>
                <input
                  type="text"
                  value={societyData.buildingName}
                  onChange={(e) => handleInputChange("buildingName", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Flat No & Floor</label>
                <input
                  type="text"
                  value={societyData.flatNo}
                  onChange={(e) => handleInputChange("flatNo", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Resident / Owner Name</label>
                <input
                  type="text"
                  value={societyData.ownerResidentName}
                  onChange={(e) => handleInputChange("ownerResidentName", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Total Flats in Building</label>
                <input
                  type="number"
                  value={societyData.totalFlats}
                  onChange={(e) => handleInputChange("totalFlats", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Billing Month</label>
                <input
                  type="text"
                  value={societyData.billingMonth}
                  onChange={(e) => handleInputChange("billingMonth", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Payment Due Date</label>
                <input
                  type="date"
                  value={societyData.paymentDueDate}
                  onChange={(e) => handleInputChange("paymentDueDate", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Resident Category</label>
                <select
                  value={societyData.residentType}
                  onChange={(e) => handleInputChange("residentType", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Tenant (ভাড়াটিয়া)">Tenant (ভাড়াটিয়া)</option>
                  <option value="Owner (মালিক)">Owner (মালিক)</option>
                </select>
              </div>
            </div>
          </div>

          {/* TAB 1: MONTHLY SERVICE CHARGE BILL VOUCHER */}
          {activeTab === "service-bill" && (
            <div className="space-y-4">
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400 block mb-1">Total Building Monthly Expense</span>
                  <div className="text-2xl font-bold text-white">
                    ৳ {totalMonthlyBuildingExpense.toLocaleString("en-IN")}
                  </div>
                  <span className="text-xs text-slate-500">Across {totalFlatsCount} Flats</span>
                </div>
                <div className="bg-slate-950 border border-blue-900/40 rounded-xl p-4">
                  <span className="text-xs text-blue-400 block mb-1">Per Flat Monthly Service Charge</span>
                  <div className="text-2xl font-bold text-blue-300">
                    ৳ {perFlatServiceCharge.toLocaleString("en-IN")}
                    <span className="text-xs font-normal text-slate-400 ml-1">/month</span>
                  </div>
                  <span className="text-xs text-slate-500">Due by {societyData.paymentDueDate}</span>
                </div>
                <div className="bg-slate-950 border border-indigo-900/40 rounded-xl p-4">
                  <span className="text-xs text-indigo-400 block mb-1">Monthly Reserve Fund Savings</span>
                  <div className="text-2xl font-bold text-indigo-300">
                    ৳ {Number(societyData.reserveContingencyFund).toLocaleString("en-IN")}
                  </div>
                  <span className="text-xs text-slate-500">For Lift/Generator Emergencies</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-xs font-semibold text-slate-300">
                  মাসিক সার্ভিস চার্জ রসিদ ও ভাউচার (Official Printable Voucher)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(serviceBillText)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy Voucher"}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Bill Voucher</span>
                  </button>
                </div>
              </div>

              {/* Bill Preview Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
                {serviceBillText}
              </div>
            </div>
          )}

          {/* TAB 2: SOCIETY BYLAWS & RULES */}
          {activeTab === "bylaws" && (
            <div className="space-y-4">
              <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-200/90 leading-relaxed">
                  <strong>ফ্ল্যাট কল্যাণ সমিতির নীতিমালা:</strong> ঢাকা শহরের আবাসিক ভবনগুলোতে শান্তিপূর্ণ সহাবস্থান নিশ্চিতকরণে ছাদ ব্যবহার, গাড়ির পার্কিং, রাতকালীন শান্ত পরিবেশ (Quiet Hours) এবং ময়লা ফেলার সুনির্দিষ্ট নীতিমালা সমিতি কর্তৃক সংরক্ষিত থাকা অপরিহার্য।
                </div>
              </div>

              {/* Bylaws Options Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Quiet Hours (শব্দ নিয়ন্ত্রণ শুরু)</label>
                  <input
                    type="text"
                    value={societyData.quietHoursStart}
                    onChange={(e) => handleInputChange("quietHoursStart", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Roof Gate Lock Time (ছাদের গেট বন্ধ)</label>
                  <input
                    type="text"
                    value={societyData.roofClosingTime}
                    onChange={(e) => handleInputChange("roofClosingTime", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Visitor Parking Limit</label>
                  <input
                    type="text"
                    value={societyData.visitorParkingHours}
                    onChange={(e) => handleInputChange("visitorParkingHours", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-xs font-semibold text-slate-300">
                  সমিতির গঠনতন্ত্র ও আবাসিক নীতিমালা (Association Charter & Bylaws)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(bylawsText)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy Bylaws"}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Bylaws</span>
                  </button>
                </div>
              </div>

              {/* Bylaws Preview Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
                {bylawsText}
              </div>
            </div>
          )}

          {/* TAB 3: CIRCULAR & NOTICE BOARD */}
          {activeTab === "notice" && (
            <div className="space-y-4">
              
              {/* Notice Type Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Select Notice Category (নোটিশের বিষয়)</label>
                  <select
                    value={societyData.noticeType}
                    onChange={(e) => handleInputChange("noticeType", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="water_tank">পানির ট্যাংক পরিষ্কার ও পাম্প বন্ধ (Water Tank Cleaning)</option>
                    <option value="agm_meeting">বার্ষিক সাধারণ সভা আহ্বান (AGM Meeting Notice)</option>
                    <option value="generator_servicing">লিফট ও জেনারেটর সার্ভিসিং (Lift/Generator Servicing)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Notice Date</label>
                  <input
                    type="date"
                    value={societyData.noticeDate}
                    onChange={(e) => handleInputChange("noticeDate", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Event Duration / Time</label>
                  <input
                    type="text"
                    value={societyData.eventTime}
                    onChange={(e) => handleInputChange("eventTime", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-xs font-semibold text-slate-300">
                  ভবনের নোটিশ বোর্ডে টানানোর সার্কুলার ড্রাফট (Ready to Print)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(getNoticeContent())}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy Notice"}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold shadow transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Notice</span>
                  </button>
                </div>
              </div>

              {/* Notice Preview Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner border-l-4 border-l-amber-500">
                {getNoticeContent()}
              </div>
            </div>
          )}

          {/* TAB 4: BUILDING EXPENSE BUDGET & FINANCE */}
          {activeTab === "finance" && (
            <div className="space-y-6">
              
              {/* Expense Config Grid */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                <h4 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  <span>Monthly Society Line Items Breakdown (মাসিক খাতের খরচ পরিবর্তন করুন)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Security Guard Salary (৳)</label>
                    <input
                      type="number"
                      value={societyData.securityGuardSalary}
                      onChange={(e) => handleInputChange("securityGuardSalary", Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Cleaner & Sweeper (৳)</label>
                    <input
                      type="number"
                      value={societyData.sweeperCleanerSalary}
                      onChange={(e) => handleInputChange("sweeperCleanerSalary", Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">WASA Pump Electricity (৳)</label>
                    <input
                      type="number"
                      value={societyData.wasaBoosterPumpElectric}
                      onChange={(e) => handleInputChange("wasaBoosterPumpElectric", Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Lift AMC & Servicing (৳)</label>
                    <input
                      type="number"
                      value={societyData.liftMaintenanceAmc}
                      onChange={(e) => handleInputChange("liftMaintenanceAmc", Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Generator Fuel & Maint. (৳)</label>
                    <input
                      type="number"
                      value={societyData.generatorFuelMaintenance}
                      onChange={(e) => handleInputChange("generatorFuelMaintenance", Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Waste / Garbage Fee (৳)</label>
                    <input
                      type="number"
                      value={societyData.garbageWasteBill}
                      onChange={(e) => handleInputChange("garbageWasteBill", Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">CCTV & Intercom Maint. (৳)</label>
                    <input
                      type="number"
                      value={societyData.cctvIntercomMaintenance}
                      onChange={(e) => handleInputChange("cctvIntercomMaintenance", Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Common Area Lighting (৳)</label>
                    <input
                      type="number"
                      value={societyData.commonAreaLighting}
                      onChange={(e) => handleInputChange("commonAreaLighting", Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Emergency Reserve Fund (৳)</label>
                    <input
                      type="number"
                      value={societyData.reserveContingencyFund}
                      onChange={(e) => handleInputChange("reserveContingencyFund", Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-emerald-400 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Annual Society Projection */}
              <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-3">
                  Annual Building Operations Projection (বাৎসরিক প্রাক্কলন)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">Annual Collection ({totalFlatsCount} Flats)</span>
                    <div className="text-xl font-bold text-white">৳ {(perFlatServiceCharge * totalFlatsCount * 12).toLocaleString("en-IN")}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Annual Operating Outflow</span>
                    <div className="text-xl font-bold text-amber-300">৳ {(totalMonthlyBuildingExpense * 12).toLocaleString("en-IN")}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Annual Reserve Fund Savings</span>
                    <div className="text-xl font-bold text-emerald-400">৳ {(Number(societyData.reserveContingencyFund) * 12).toLocaleString("en-IN")}</div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span>Basha Lagbe Flat Owners & Welfare Society Portal &bull; Dhaka Real Estate Compliance</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
