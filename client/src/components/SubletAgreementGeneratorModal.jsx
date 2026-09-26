import React, { useState } from "react";
import {
  Users,
  FileSignature,
  Printer,
  Copy,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Building,
  GraduationCap,
  Briefcase,
  Clock,
  Moon,
  Volume2,
  Utensils,
  Sparkles,
  X,
  Plus,
  Trash2,
  HelpCircle,
  KeyRound,
  Info
} from "lucide-react";

export default function SubletAgreementGeneratorModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("form"); // "form" | "agreement" | "rules" | "tips"
  const [lang, setLang] = useState("en"); // "en" | "bn"
  const [copied, setCopied] = useState(false);

  // Form State
  const [subletDetails, setSubletDetails] = useState({
    agreementType: "sublet_single_room", // "sublet_single_room" | "sublet_master" | "shared_seat_mess"
    agreementDate: new Date().toISOString().split("T")[0],
    startDate: "2026-10-01",
    flatNumber: "Flat 4-B, 4th Floor",
    buildingName: "Greenview Palace, Holding #24/A",
    roadSector: "Road 11, Sector 4",
    areaCity: "Uttara, Dhaka-1230",
    
    // Principal Tenant (মূল ভাড়াটিয়া)
    primaryTenantName: "Hasibullah Khan",
    primaryTenantPhone: "+880 1819-000000",
    primaryTenantNid: "19982699876543210",
    primaryTenantProfession: "Software Engineer / Senior Student",

    // Sub-Tenant / Flatmate (সাবলেট ভাড়াটিয়া)
    subTenantName: "Tanvir Ahmed",
    subTenantPhone: "+880 1711-223344",
    subTenantNid: "20012691234567890",
    subTenantType: "student", // "student" | "job_holder"
    institutionName: "BRAC University (Computer Science)",
    studentIdOrDesignation: "Student ID: 22101055",
    emergencyGuardianName: "Md. Rafiqul Islam (Father)",
    emergencyGuardianPhone: "+880 1912-889900",

    // Financial Terms
    roomTypeDescription: "1 Attached Balcony Single Bedroom (Non-Attached Bath)",
    monthlyBaseRent: 9500,
    advanceDeposit: 9500, // 1 month deposit standard
    noticePeriodDays: 30, // 30 days notice
    paymentDueDay: "5th to 7th of every English calendar month",
    
    // Utilities & Shared Bills
    electricitySplitMode: "divided_equally", // "divided_equally" | "fixed_included" | "meter_sublet"
    fixedUtilityAmount: 0,
    wifiShare: 300,
    maidBuaShare: 800,
    gasShare: 400,
    waterFilterShare: 150,

    // House Rules Configuration
    gateCurfewTime: "11:00 PM (রাত ১১:০০)",
    guestPolicy: "day_only", // "day_only" | "no_female_guests" | "prior_notice_stay"
    smokingPolicy: "strictly_prohibited", // "strictly_prohibited" | "balcony_only"
    kitchenAccessTime: "6:00 AM – 11:30 PM",
    quietHours: "11:30 PM – 7:00 AM (নিস্তব্ধ সময়)",
  });

  const handleInputChange = (field, val) => {
    setSubletDetails((prev) => ({ ...prev, [field]: val }));
  };

  const loadPreset = (type) => {
    if (type === "student_mess") {
      setSubletDetails((prev) => ({
        ...prev,
        agreementType: "shared_seat_mess",
        roomTypeDescription: "1 Shared Seat in 2-Person Master Bedroom (Attached Bath)",
        monthlyBaseRent: 5500,
        advanceDeposit: 5500,
        noticePeriodDays: 30,
        subTenantType: "student",
        institutionName: "BRAC University / NSU",
        studentIdOrDesignation: "Student ID: 22301980",
        wifiShare: 250,
        maidBuaShare: 600,
        gasShare: 300,
        waterFilterShare: 100,
        gateCurfewTime: "11:00 PM (রাত ১১:০০)",
        guestPolicy: "day_only",
        smokingPolicy: "strictly_prohibited",
      }));
    } else if (type === "job_holder_sublet") {
      setSubletDetails((prev) => ({
        ...prev,
        agreementType: "sublet_master",
        roomTypeDescription: "1 Master Bedroom with Attached Bath & South-Facing Balcony",
        monthlyBaseRent: 13000,
        advanceDeposit: 13000,
        noticePeriodDays: 30,
        subTenantType: "job_holder",
        institutionName: "Grameenphone Ltd. (Executive)",
        studentIdOrDesignation: "Employee ID: GP-8910",
        wifiShare: 400,
        maidBuaShare: 1000,
        gasShare: 500,
        waterFilterShare: 200,
        gateCurfewTime: "11:30 PM (রাত ১১:৩০)",
        guestPolicy: "prior_notice_stay",
        smokingPolicy: "balcony_only",
      }));
    } else {
      // Default single room
      setSubletDetails((prev) => ({
        ...prev,
        agreementType: "sublet_single_room",
        roomTypeDescription: "1 Attached Balcony Single Bedroom (Non-Attached Bath)",
        monthlyBaseRent: 9500,
        advanceDeposit: 9500,
        noticePeriodDays: 30,
        subTenantType: "student",
        institutionName: "BRAC University (Computer Science)",
        studentIdOrDesignation: "Student ID: 22101055",
        wifiShare: 300,
        maidBuaShare: 800,
        gasShare: 400,
        waterFilterShare: 150,
        gateCurfewTime: "11:00 PM (রাত ১১:০০)",
        guestPolicy: "day_only",
        smokingPolicy: "strictly_prohibited",
      }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const generateMarkdownSummary = () => {
    let md = `# SUBLET & SHARED FLAT RENTAL AGREEMENT\n`;
    md += `**Date:** ${subletDetails.agreementDate} | **Effective From:** ${subletDetails.startDate}\n`;
    md += `**Property Address:** ${subletDetails.flatNumber}, ${subletDetails.buildingName}, ${subletDetails.roadSector}, ${subletDetails.areaCity}\n\n`;
    md += `## Parties\n`;
    md += `- **Principal Tenant (মূল ভাড়াটিয়া):** ${subletDetails.primaryTenantName} (Phone: ${subletDetails.primaryTenantPhone}, NID: ${subletDetails.primaryTenantNid})\n`;
    md += `- **Sub-Tenant (সাবলেট ভাড়াটিয়া):** ${subletDetails.subTenantName} (Phone: ${subletDetails.subTenantPhone}, NID: ${subletDetails.subTenantNid})\n`;
    md += `  - Institution/Office: ${subletDetails.institutionName} | ${subletDetails.studentIdOrDesignation}\n`;
    md += `  - Emergency Guardian: ${subletDetails.emergencyGuardianName} (${subletDetails.emergencyGuardianPhone})\n\n`;
    md += `## Financial Terms\n`;
    md += `- **Room Description:** ${subletDetails.roomTypeDescription}\n`;
    md += `- **Monthly Room Rent:** ৳${Number(subletDetails.monthlyBaseRent).toLocaleString()} / month\n`;
    md += `- **Advance Security Deposit:** ৳${Number(subletDetails.advanceDeposit).toLocaleString()}\n`;
    md += `- **Notice Period:** ${subletDetails.noticePeriodDays} Days prior notice before vacating\n`;
    md += `- **Shared Bills:** WiFi: ৳${subletDetails.wifiShare}, Maid: ৳${subletDetails.maidBuaShare}, Gas: ৳${subletDetails.gasShare}, Water Jar: ৳${subletDetails.waterFilterShare} + Electricity (Divided Equally)\n\n`;
    md += `## House Rules Charter\n`;
    md += `1. **Gate Curfew:** Entry before ${subletDetails.gateCurfewTime}. Night stays outside require advance notice.\n`;
    md += `2. **Guest Policy:** ${subletDetails.guestPolicy === "day_only" ? "Day guests only (no overnight stay without flatmates consent)" : "Prior permission required for guests"}.\n`;
    md += `3. **Smoking/Alcohol:** ${subletDetails.smokingPolicy === "strictly_prohibited" ? "Strictly prohibited inside flat" : "Balcony only"}.\n`;
    md += `4. **Quiet Hours:** ${subletDetails.quietHours} strictly observed for study and sleep.\n`;
    md += `\n*Signed by Principal Tenant and Sub-Tenant on ${subletDetails.agreementDate}.*`;
    return md;
  };

  const handleCopy = () => {
    const text = generateMarkdownSummary();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-violet-800 via-purple-800 to-indigo-950 text-white px-5 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <Users className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">
                  {lang === "en" ? "Sublet Agreement & Bachelor Rules Charter" : "সাবলেট চুক্তিপত্র ও মেস আচরণবিধি সনদ"}
                </h2>
                <span className="text-[10px] bg-purple-300 text-purple-950 font-bold px-2 py-0.5 rounded-full uppercase">
                  Student & Job-Holder
                </span>
              </div>
              <p className="text-xs text-purple-200/90 mt-0.5">
                {lang === "en"
                  ? "Formal sublease contract, shared utility breakdown, curfew & flatmate code of conduct"
                  : "সাবলেট ১ রুম ও সিট ভাড়ার আইনসম্মত চুক্তিপত্র, ইউটিলিটি বণ্টন ও মেস আচরণবিধি"}
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2">
            <div className="bg-purple-950/60 p-0.5 rounded-lg border border-purple-500/30 flex text-xs">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded-md font-semibold transition ${
                  lang === "en" ? "bg-white text-purple-950 shadow-sm" : "text-purple-200 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("bn")}
                className={`px-2 py-1 rounded-md font-semibold transition ${
                  lang === "bn" ? "bg-white text-purple-950 shadow-sm" : "text-purple-200 hover:text-white"
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
                  ? "bg-purple-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <FileSignature className="w-4 h-4" />
              <span>1. Agreement & Rules Setup</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("agreement")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "agreement"
                  ? "bg-purple-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>2. Printable Sublet Deed</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("rules")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "rules"
                  ? "bg-purple-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>3. House Code of Conduct</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("tips")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "tips"
                  ? "bg-purple-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>4. Subletting Tips</span>
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
              className="px-3.5 py-1.5 text-xs font-bold bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Deed</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* TAB 1: FORM SETUP */}
          {activeTab === "form" && (
            <div className="space-y-6">
              
              {/* Quick Preset Selector */}
              <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-700" />
                  <span className="text-xs font-bold text-purple-950 uppercase tracking-wide">
                    {lang === "en" ? "Quick Preset Setup:" : "দ্রুত সেটআপ প্রিসেট:"}
                  </span>
                  <span className="text-xs text-purple-800">
                    {lang === "en"
                      ? "Load standard terms for student room, mess seat, or executive sublet"
                      : "মেস সিট, ছাত্র সাবলেট অথবা চাকুরিজীবী সাবলেট টেমপ্লেট লোড করুন"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => loadPreset("student_mess")}
                    className="px-2.5 py-1 text-xs font-semibold bg-white border border-purple-300 rounded-lg text-purple-900 hover:bg-purple-100 transition shadow-sm"
                  >
                    🎓 University Mess Seat
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPreset("default")}
                    className="px-2.5 py-1 text-xs font-semibold bg-white border border-purple-300 rounded-lg text-purple-900 hover:bg-purple-100 transition shadow-sm"
                  >
                    🛏️ Single Private Room
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPreset("job_holder_sublet")}
                    className="px-2.5 py-1 text-xs font-semibold bg-white border border-purple-300 rounded-lg text-purple-900 hover:bg-purple-100 transition shadow-sm"
                  >
                    💼 Executive Master Sublet
                  </button>
                </div>
              </div>

              {/* Section 1: Property & Primary Tenant */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <Building className="w-4 h-4 text-purple-600" />
                  <span>1. Flat Address & Principal Tenant (মূল ভাড়াটিয়া)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Flat / Holding No.</label>
                    <input
                      type="text"
                      value={subletDetails.flatNumber}
                      onChange={(e) => handleInputChange("flatNumber", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Building & Road / Sector</label>
                    <input
                      type="text"
                      value={`${subletDetails.buildingName}, ${subletDetails.roadSector}`}
                      onChange={(e) => handleInputChange("buildingName", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Thana & City</label>
                    <input
                      type="text"
                      value={subletDetails.areaCity}
                      onChange={(e) => handleInputChange("areaCity", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Principal Tenant Name</label>
                    <input
                      type="text"
                      value={subletDetails.primaryTenantName}
                      onChange={(e) => handleInputChange("primaryTenantName", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Principal Tenant Mobile</label>
                    <input
                      type="text"
                      value={subletDetails.primaryTenantPhone}
                      onChange={(e) => handleInputChange("primaryTenantPhone", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Principal Tenant NID / ID</label>
                    <input
                      type="text"
                      value={subletDetails.primaryTenantNid}
                      onChange={(e) => handleInputChange("primaryTenantNid", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Sub-Tenant Profile (সাবলেট ভাড়াটিয়া) */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>2. Sub-Tenant / Flatmate Profile (সাবলেট ভাড়াটিয়ার তথ্যাদি)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Sub-Tenant Full Name</label>
                    <input
                      type="text"
                      value={subletDetails.subTenantName}
                      onChange={(e) => handleInputChange("subTenantName", e.target.value)}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Mobile Number</label>
                    <input
                      type="text"
                      value={subletDetails.subTenantPhone}
                      onChange={(e) => handleInputChange("subTenantPhone", e.target.value)}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">National ID (NID) / Birth Reg</label>
                    <input
                      type="text"
                      value={subletDetails.subTenantNid}
                      onChange={(e) => handleInputChange("subTenantNid", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Occupation / Profile</label>
                    <select
                      value={subletDetails.subTenantType}
                      onChange={(e) => handleInputChange("subTenantType", e.target.value)}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="student">🎓 University / College Student</option>
                      <option value="job_holder">💼 Job Holder / Corporate Executive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">University / Workplace</label>
                    <input
                      type="text"
                      value={subletDetails.institutionName}
                      onChange={(e) => handleInputChange("institutionName", e.target.value)}
                      placeholder="e.g. BRAC University / Company name"
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Student ID / Designation</label>
                    <input
                      type="text"
                      value={subletDetails.studentIdOrDesignation}
                      onChange={(e) => handleInputChange("studentIdOrDesignation", e.target.value)}
                      placeholder="e.g. Student ID: 22101055"
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Guardian / Parent Name</label>
                    <input
                      type="text"
                      value={subletDetails.emergencyGuardianName}
                      onChange={(e) => handleInputChange("emergencyGuardianName", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Guardian Contact Phone</label>
                    <input
                      type="text"
                      value={subletDetails.emergencyGuardianPhone}
                      onChange={(e) => handleInputChange("emergencyGuardianPhone", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Stay Commencement Date</label>
                    <input
                      type="date"
                      value={subletDetails.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Room Rent & Utilities */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <FileSignature className="w-4 h-4 text-emerald-600" />
                  <span>3. Room Rent, Security Deposit & Utility Shares</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Room / Bed Description</label>
                    <input
                      type="text"
                      value={subletDetails.roomTypeDescription}
                      onChange={(e) => handleInputChange("roomTypeDescription", e.target.value)}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Monthly Room Rent (৳)</label>
                    <input
                      type="number"
                      value={subletDetails.monthlyBaseRent}
                      onChange={(e) => handleInputChange("monthlyBaseRent", Number(e.target.value))}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 text-emerald-800 focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Advance Deposit (৳)</label>
                    <input
                      type="number"
                      value={subletDetails.advanceDeposit}
                      onChange={(e) => handleInputChange("advanceDeposit", Number(e.target.value))}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 text-purple-800 focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">WiFi Share (৳ / mo)</label>
                    <input
                      type="number"
                      value={subletDetails.wifiShare}
                      onChange={(e) => handleInputChange("wifiShare", Number(e.target.value))}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Maid / Bua Share (৳ / mo)</label>
                    <input
                      type="number"
                      value={subletDetails.maidBuaShare}
                      onChange={(e) => handleInputChange("maidBuaShare", Number(e.target.value))}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Gas / Cylinder Share (৳)</label>
                    <input
                      type="number"
                      value={subletDetails.gasShare}
                      onChange={(e) => handleInputChange("gasShare", Number(e.target.value))}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Notice to Vacate (Days)</label>
                    <input
                      type="number"
                      value={subletDetails.noticePeriodDays}
                      onChange={(e) => handleInputChange("noticePeriodDays", Number(e.target.value))}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 text-center focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: House Rules & Curfew */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span>4. House Rules & Flatmate Code of Conduct</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Main Gate Curfew Time</label>
                    <input
                      type="text"
                      value={subletDetails.gateCurfewTime}
                      onChange={(e) => handleInputChange("gateCurfewTime", e.target.value)}
                      placeholder="e.g. 11:00 PM (রাত ১১:০০)"
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Guest & Visitor Policy</label>
                    <select
                      value={subletDetails.guestPolicy}
                      onChange={(e) => handleInputChange("guestPolicy", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="day_only">Day visitors only (No overnight stay without consent)</option>
                      <option value="prior_notice_stay">Overnight stay allowed with 24h prior notice</option>
                      <option value="strictly_no_guests">No external guests allowed inside bedrooms</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Smoking / Substance Policy</label>
                    <select
                      value={subletDetails.smokingPolicy}
                      onChange={(e) => handleInputChange("smokingPolicy", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="strictly_prohibited">Strictly Prohibited inside entire flat</option>
                      <option value="balcony_only">Designated Balcony only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Kitchen Access Hours</label>
                    <input
                      type="text"
                      value={subletDetails.kitchenAccessTime}
                      onChange={(e) => handleInputChange("kitchenAccessTime", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Quiet / Study Hours</label>
                    <input
                      type="text"
                      value={subletDetails.quietHours}
                      onChange={(e) => handleInputChange("quietHours", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* View Deed CTA */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab("agreement")}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-800 text-white font-bold rounded-xl text-sm hover:from-purple-800 hover:to-indigo-900 transition flex items-center gap-2 shadow-md"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Printable Sublet Deed & Rules Charter</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: PRINTABLE DEED */}
          {activeTab === "agreement" && (
            <div className="space-y-6">
              <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-10 shadow-lg font-serif text-slate-900 space-y-6">
                
                {/* Letterhead */}
                <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
                  <div className="inline-block bg-purple-900 text-white text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-0.5 rounded-full mb-1">
                    Standard Sub-Tenancy Agreement & Flatmate Code (সাবলেট ও মেস চুক্তিপত্র)
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-950">
                    {lang === "en"
                      ? "SUBLET ROOM RENTAL AGREEMENT & CODE OF CONDUCT"
                      : "আবাসিক সাবলেট ১ রুম / মেস সিট ভাড়া চুক্তিপত্র ও আচরণবিধি সনদ"}
                  </h1>
                  <p className="text-xs font-sans text-slate-600">
                    Effective From: <strong>{subletDetails.startDate}</strong> | Execution Date: <strong>{subletDetails.agreementDate}</strong>
                  </p>
                </div>

                {/* Flat & Parties Box */}
                <div className="font-sans text-xs grid grid-cols-2 sm:grid-cols-4 gap-3 bg-purple-50/50 p-4 border border-purple-200 rounded-xl">
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Flat Address:</span>
                    <span className="font-bold text-slate-900">{subletDetails.flatNumber}, {subletDetails.buildingName}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Area / City:</span>
                    <span className="font-bold text-slate-900">{subletDetails.roadSector}, {subletDetails.areaCity}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Principal Tenant (১ম পক্ষ):</span>
                    <span className="font-bold text-slate-900">{subletDetails.primaryTenantName}</span>
                    <span className="block text-slate-600 text-[11px]">{subletDetails.primaryTenantPhone}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Sub-Tenant (২য় পক্ষ):</span>
                    <span className="font-bold text-slate-900">{subletDetails.subTenantName}</span>
                    <span className="block text-slate-600 text-[11px]">{subletDetails.subTenantPhone}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Sub-Tenant Profile & Institution:</span>
                    <span className="font-bold text-slate-900">{subletDetails.institutionName} ({subletDetails.studentIdOrDesignation})</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Emergency Guardian Contact:</span>
                    <span className="font-bold text-slate-900">{subletDetails.emergencyGuardianName} — {subletDetails.emergencyGuardianPhone}</span>
                  </div>
                </div>

                {/* Financial Clauses */}
                <div className="font-sans space-y-2 text-xs">
                  <h4 className="font-bold uppercase tracking-wider text-slate-800 bg-slate-200 px-3 py-1 rounded">
                    A. Room Allocation & Financial Terms
                  </h4>
                  <table className="w-full text-xs border border-slate-300">
                    <tbody className="divide-y divide-slate-300">
                      <tr>
                        <td className="p-2 font-bold w-1/3 border-r border-slate-300 bg-slate-50">Demised Sublet Space</td>
                        <td className="p-2 font-semibold text-slate-900">{subletDetails.roomTypeDescription}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border-r border-slate-300 bg-slate-50">Monthly Base Rent</td>
                        <td className="p-2 font-bold text-emerald-800">৳{Number(subletDetails.monthlyBaseRent).toLocaleString()} / Month (Payable by 7th of every month)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border-r border-slate-300 bg-slate-50">Advance Security Deposit</td>
                        <td className="p-2 font-bold text-purple-900">৳{Number(subletDetails.advanceDeposit).toLocaleString()} (Refundable upon key handover with zero dues)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border-r border-slate-300 bg-slate-50">Shared Utilities & Services</td>
                        <td className="p-2 text-slate-700">
                          WiFi: ৳{subletDetails.wifiShare}, Maid: ৳{subletDetails.maidBuaShare}, Gas: ৳{subletDetails.gasShare}, Water Filter: ৳{subletDetails.waterFilterShare} + Electricity (DESCO/DPDC meter divided equally among flatmates).
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border-r border-slate-300 bg-slate-50">Vacate Notice Requirement</td>
                        <td className="p-2 font-semibold text-slate-900">
                          <strong>{subletDetails.noticePeriodDays} Days prior written notice</strong> before the 1st of the leaving month.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* House Rules Section */}
                <div className="font-sans space-y-2 text-xs">
                  <h4 className="font-bold uppercase tracking-wider text-slate-800 bg-slate-200 px-3 py-1 rounded">
                    B. House Rules, Safety & Flatmate Conduct
                  </h4>
                  <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-lg space-y-2 text-[11px] leading-relaxed text-slate-800">
                    <p><strong>1. Curfew & Gate Access:</strong> Main building entrance closes at <strong>{subletDetails.gateCurfewTime}</strong>. Entry after hours must be coordinated in advance to avoid disturbing other roommates.</p>
                    <p><strong>2. Visitor & Guest Policy:</strong> {subletDetails.guestPolicy === "day_only" ? "Visitors are allowed during daytime only. No external guests may stay overnight without explicit consensus of all flatmates." : "Guests staying overnight require 24h prior notification."}</p>
                    <p><strong>3. Cleanliness & Common Areas:</strong> Kitchen, dining space, and shared bathrooms must be kept clean after personal use. Trash bins must be emptied daily.</p>
                    <p><strong>4. Substances & Prohibitions:</strong> {subletDetails.smokingPolicy === "strictly_prohibited" ? "Smoking, alcohol, and illicit substances are strictly forbidden inside the apartment." : "Smoking is restricted strictly to the designated balcony."}</p>
                    <p><strong>5. Quiet Study Hours:</strong> Strict silence must be maintained between <strong>{subletDetails.quietHours}</strong> for sleep and study.</p>
                  </div>
                </div>

                {/* Signatures */}
                <div className="font-sans text-xs space-y-4 pt-4">
                  <p className="text-[11px] text-slate-600 leading-relaxed italic">
                    {lang === "en"
                      ? "Both the Principal Tenant and Sub-Tenant have read and understood all clauses herein and agree to abide by the flatmate charter."
                      : "আমরা উভয়পক্ষ এই চুক্তিপত্রের সকল শর্ত ও আচরণবিধি মনোযোগ সহকারে পাঠ করিয়া স্বজ্ঞানে স্বাক্ষর প্রদান করিলাম।"}
                  </p>

                  <div className="grid grid-cols-2 gap-8 pt-10 text-center">
                    <div className="border-t-2 border-slate-800 pt-1.5">
                      <p className="font-bold text-slate-900">{subletDetails.primaryTenantName}</p>
                      <p className="text-[11px] text-slate-600">Principal Tenant (মূল ভাড়াটিয়ার স্বাক্ষর)</p>
                      <p className="text-[10px] text-slate-400">Date: _______________</p>
                    </div>

                    <div className="border-t-2 border-slate-800 pt-1.5">
                      <p className="font-bold text-slate-900">{subletDetails.subTenantName}</p>
                      <p className="text-[11px] text-slate-600">Sub-Tenant / Flatmate (সাবলেট ভাড়াটিয়ার স্বাক্ষর)</p>
                      <p className="text-[10px] text-slate-400">Date: _______________</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: CODE OF CONDUCT */}
          {activeTab === "rules" && (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-xs text-purple-900">
                <h3 className="font-bold text-sm text-purple-950 mb-1">
                  Shared Flat & Mess Code of Harmony (মেস ও ফ্ল্যাটমেট সৌহার্দ্য সনদ)
                </h3>
                <p>
                  Practical rules to ensure zero friction between flatmates, smooth utility settlements, and peaceful co-living in Dhaka.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span>Bathroom & Morning Schedule</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Between 7:30 AM to 9:30 AM (peak university & office rush), bathroom occupancy should not exceed 15-20 minutes per person. Always ensure the geyser switch is turned OFF after hot water usage.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                    <Utensils className="w-4 h-4 text-purple-600" />
                    <span>Kitchen & Refrigerator Etiquette</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Label your personal food containers in the fridge. Do not consume other flatmates' groceries (milk, eggs, fruits) without explicit permission. Wash your utensils immediately after cooking.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                    <Volume2 className="w-4 h-4 text-purple-600" />
                    <span>Noise & Headphones Policy</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Always use earphones/headphones for gaming, movies, and late-night phone calls after 11:00 PM. High speaker volume is prohibited in common spaces during exam weeks.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                    <KeyRound className="w-4 h-4 text-purple-600" />
                    <span>Electricity Conservation</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Turn off ACs, fans, and lights whenever leaving your room. High-power appliances (e.g. electric kettle, iron, room heater) should be used mindfully to prevent spiking the DESCO prepaid meter bill.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TIPS */}
          {activeTab === "tips" && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 space-y-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Important Legal & Police Verification Advice for Subletting</span>
                </h3>
                <ul className="space-y-2 text-slate-600 text-xs">
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span><strong>DMP CIMS Verification:</strong> Under Dhaka Metropolitan Police rules, every sub-tenant living in a flat must have their photo and NID submitted to the local Thana via the DMP CIMS Tenant Form.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span><strong>Landlord Permission:</strong> Verify that the principal landlord allows subletting or bachelor flatmates to prevent sudden eviction notices.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span><strong>Deposit Refund:</strong> Sub-tenant advance deposits should be refunded immediately on the day of key handover, subject to settling the final month's utility share.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Standard Sublet & Shared Mess Contract for Bangladesh</span>
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
              className="px-4 py-1.5 text-xs font-bold bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sublet Deed</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
