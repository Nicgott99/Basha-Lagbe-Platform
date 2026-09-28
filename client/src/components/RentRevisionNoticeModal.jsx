import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  FileSignature,
  Printer,
  Copy,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Building,
  Scale,
  Percent,
  Clock,
  ArrowRight,
  Info,
  X,
  Sparkles,
  DollarSign,
  Calendar,
  HelpCircle
} from "lucide-react";

export default function RentRevisionNoticeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("form"); // "form" | "notice" | "guidelines" | "calculator"
  const [lang, setLang] = useState("en"); // "en" | "bn"
  const [copied, setCopied] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    noticeType: "landlord_increase", // "landlord_increase" | "tenant_counter" | "mutual_amendment"
    noticeDate: new Date().toISOString().split("T")[0],
    effectiveDate: "2026-12-01", // Standard 2-month prior notice
    flatNumber: "Flat 4-B, 4th Floor",
    buildingName: "Greenview Palace, Holding #24/A",
    roadSector: "Road 11, Sector 4",
    areaCity: "Uttara, Dhaka-1230",
    
    // Landlord & Tenant Info
    landlordName: "Mohammad Rafiqul Islam",
    landlordPhone: "+880 1711-000000",
    landlordNid: "19852691234567890",
    tenantName: "Hasibullah Khan",
    tenantPhone: "+880 1819-000000",
    tenantNid: "19982699876543210",

    // Rental Figures
    currentMonthlyRent: 30000,
    proposedMonthlyRent: 33000,
    tenantCounterRent: 31500,
    serviceCharge: 4000,
    lastRevisionDate: "2024-10-01", // 2 years ago
    
    // Reasons for revision
    reasonCategory: "inflation_holding_tax", // "inflation_holding_tax" | "renovation_maintenance" | "market_rate" | "custom"
    customReason: "General inflation, increased building lift maintenance costs, and municipal holding tax adjustment by City Corporation.",
    paymentMethodNote: "Payment to be deposited into Dutch-Bangla Bank A/C: 115.120.98765 or via bKash Merchant by the 7th of each month.",
  });

  const handleInputChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  // Calculations
  const calculations = useMemo(() => {
    const current = Number(formData.currentMonthlyRent) || 0;
    const proposed = Number(formData.proposedMonthlyRent) || 0;
    const counter = Number(formData.tenantCounterRent) || 0;

    const diff = Math.max(0, proposed - current);
    const percent = current > 0 ? ((diff / current) * 100) : 0;
    const annualDiff = diff * 12;

    const counterDiff = Math.max(0, counter - current);
    const counterPercent = current > 0 ? ((counterDiff / current) * 100) : 0;

    // Evaluation tag
    let evaluation = {
      label: "Standard & Fair (স্বাভাবিক ও গ্রহণযোগ্য)",
      color: "text-emerald-700 bg-emerald-50 border-emerald-300",
      description: "Within standard 5% – 10% biennial inflation guideline under Bangladesh tenancy practice.",
    };

    if (percent > 10 && percent <= 15) {
      evaluation = {
        label: "Moderate Increase (মাঝারি বৃদ্ধি)",
        color: "text-amber-700 bg-amber-50 border-amber-300",
        description: "Higher than typical inflation; landlord should justify with major renovations or tax hikes.",
      };
    } else if (percent > 15) {
      evaluation = {
        label: "High Increment (অতিরিক্ত বৃদ্ধি - আপত্তিযোগ্য)",
        color: "text-rose-700 bg-rose-50 border-rose-300",
        description: "Exceeds standard norms. Section 7/8 of Premises Rent Control Act protects against sudden steep hikes.",
      };
    }

    return {
      current,
      proposed,
      counter,
      diff,
      percent: percent.toFixed(1),
      annualDiff,
      counterDiff,
      counterPercent: counterPercent.toFixed(1),
      evaluation,
    };
  }, [formData.currentMonthlyRent, formData.proposedMonthlyRent, formData.tenantCounterRent]);

  const loadPreset = (type) => {
    if (type === "standard_10") {
      setFormData((prev) => ({
        ...prev,
        noticeType: "landlord_increase",
        currentMonthlyRent: 30000,
        proposedMonthlyRent: 33000, // 10%
        reasonCategory: "inflation_holding_tax",
        customReason: "General inflation, higher building common area electricity costs, and standard 2-year contract renewal.",
      }));
    } else if (type === "counter_appeal") {
      setFormData((prev) => ({
        ...prev,
        noticeType: "tenant_counter",
        currentMonthlyRent: 30000,
        proposedMonthlyRent: 35000, // 16.6%
        tenantCounterRent: 32000, // 6.6% counter
        customReason: "Requesting a reasonable ৳2,000 increment considering ongoing inflation and long-term punctual tenant track record.",
      }));
    } else if (type === "mutual_amendment") {
      setFormData((prev) => ({
        ...prev,
        noticeType: "mutual_amendment",
        currentMonthlyRent: 30000,
        proposedMonthlyRent: 32500,
        customReason: "Both parties have mutually agreed to adjust the monthly rent to ৳32,500 effective from the renewal date.",
      }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const generateMarkdownSummary = () => {
    let md = `# TENANCY RENT REVISION NOTICE\n`;
    md += `**Notice Type:** ${formData.noticeType === "landlord_increase" ? "Landlord's Official Rent Increase Notice" : formData.noticeType === "tenant_counter" ? "Tenant's Negotiation & Counter-Appeal" : "Mutual Rent Revision Amendment"}\n`;
    md += `**Date:** ${formData.noticeDate} | **Effective Date:** ${formData.effectiveDate}\n`;
    md += `**Property:** ${formData.flatNumber}, ${formData.buildingName}, ${formData.roadSector}, ${formData.areaCity}\n\n`;
    md += `## Parties:\n`;
    md += `- **Landlord:** ${formData.landlordName} (${formData.landlordPhone})\n`;
    md += `- **Tenant:** ${formData.tenantName} (${formData.tenantPhone})\n\n`;
    md += `## Rent Revision Metrics:\n`;
    md += `- **Current Monthly Rent:** ৳${calculations.current.toLocaleString()} / month\n`;
    md += `- **Proposed New Rent:** ৳${calculations.proposed.toLocaleString()} / month (+${calculations.percent}% | +৳${calculations.diff.toLocaleString()}/mo)\n`;
    if (formData.noticeType === "tenant_counter") {
      md += `- **Tenant Counter Proposal:** ৳${calculations.counter.toLocaleString()} / month (+${calculations.counterPercent}%)\n`;
    }
    md += `- **Annual Outflow Difference:** +৳${calculations.annualDiff.toLocaleString()} / year\n`;
    md += `- **Reason / Grounds:** ${formData.customReason}\n\n`;
    md += `*Formulated under the Premises Rent Control Act, 1991 standard guidelines.*`;
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
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-950 text-white px-5 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <TrendingUp className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">
                  {lang === "en" ? "Rent Increase Notice & Revision Calculator" : "বাড়ি ভাড়া বৃদ্ধি নোটিশ ও আইনি সীমা বিশ্লেষক"}
                </h2>
                <span className="text-[10px] bg-emerald-300 text-emerald-950 font-bold px-2 py-0.5 rounded-full uppercase">
                  Act 1991 Compliant
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                {lang === "en"
                  ? "Premises Rent Control Act 1991 standard notices, 2-month prior revision & counter-appeal generator"
                  : "বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১ অনুযায়ী বৈধ ভাড়া বৃদ্ধির নোটিশ ও ভাড়াটিয়ার সমঝোতা চিঠি"}
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2">
            <div className="bg-emerald-950/60 p-0.5 rounded-lg border border-emerald-500/30 flex text-xs">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded-md font-semibold transition ${
                  lang === "en" ? "bg-white text-emerald-950 shadow-sm" : "text-emerald-200 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("bn")}
                className={`px-2 py-1 rounded-md font-semibold transition ${
                  lang === "bn" ? "bg-white text-emerald-950 shadow-sm" : "text-emerald-200 hover:text-white"
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
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <FileSignature className="w-4 h-4" />
              <span>1. Notice & Rate Setup</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("notice")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "notice"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>2. Printable Legal Letter</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("guidelines")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "guidelines"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>3. Legal Rights & Act 1991</span>
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
              className="px-3.5 py-1.5 text-xs font-bold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Letter</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* TAB 1: FORM SETUP */}
          {activeTab === "form" && (
            <div className="space-y-6">
              
              {/* Presets */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    {lang === "en" ? "Fast Scenario Presets:" : "দ্রুত সেটআপ প্রিসেট:"}
                  </span>
                  <span className="text-xs text-emerald-800">
                    {lang === "en"
                      ? "Choose notice perspective or load standard 10% biennial revision"
                      : "বাড়িওয়ালার নোটিশ, ভাড়াটিয়ার সমঝোতা চিঠি অথবা যৌথ সম্মতিপত্র লোড করুন"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => loadPreset("standard_10")}
                    className="px-2.5 py-1 text-xs font-semibold bg-white border border-emerald-300 rounded-lg text-emerald-900 hover:bg-emerald-100 transition shadow-sm"
                  >
                    📈 Landlord Notice (+10%)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPreset("counter_appeal")}
                    className="px-2.5 py-1 text-xs font-semibold bg-white border border-emerald-300 rounded-lg text-emerald-900 hover:bg-emerald-100 transition shadow-sm"
                  >
                    🤝 Tenant Counter Appeal
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPreset("mutual_amendment")}
                    className="px-2.5 py-1 text-xs font-semibold bg-white border border-emerald-300 rounded-lg text-emerald-900 hover:bg-emerald-100 transition shadow-sm"
                  >
                    📝 Mutual Deed Amendment
                  </button>
                </div>
              </div>

              {/* Financial Impact Live Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase block">Current Rent</span>
                  <span className="text-xl font-bold text-slate-900 block mt-0.5">৳{calculations.current.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500">Per month</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
                  <span className="text-[11px] font-semibold text-emerald-700 uppercase block">Proposed New Rent</span>
                  <span className="text-xl font-bold text-emerald-900 block mt-0.5">৳{calculations.proposed.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">+{calculations.percent}% increase</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
                  <span className="text-[11px] font-semibold text-amber-700 uppercase block">Monthly Difference</span>
                  <span className="text-xl font-bold text-amber-900 block mt-0.5">+৳{calculations.diff.toLocaleString()}</span>
                  <span className="text-[10px] text-amber-600">+৳{calculations.annualDiff.toLocaleString()} / yr</span>
                </div>
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-3.5">
                  <span className="text-[11px] font-semibold text-teal-700 uppercase block">Legal Fairness Rating</span>
                  <span className={`text-xs font-bold block mt-1 px-2 py-0.5 rounded border inline-block ${calculations.evaluation.color}`}>
                    {calculations.evaluation.label}
                  </span>
                </div>
              </div>

              {/* Section 1: Notice Configuration */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  <span>1. Notice Purpose & Timeline</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Notice Archetype</label>
                    <select
                      value={formData.noticeType}
                      onChange={(e) => handleInputChange("noticeType", e.target.value)}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="landlord_increase">📜 Landlord's Official Rent Increase Notice</option>
                      <option value="tenant_counter">🤝 Tenant's Negotiation & Counter-Appeal Letter</option>
                      <option value="mutual_amendment">✍️ Mutual Rent Revision Addendum to Deed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Notice Issuance Date</label>
                    <input
                      type="date"
                      value={formData.noticeDate}
                      onChange={(e) => handleInputChange("noticeDate", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Proposed Effective Date (2 Months Notice)</label>
                    <input
                      type="date"
                      value={formData.effectiveDate}
                      onChange={(e) => handleInputChange("effectiveDate", e.target.value)}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Property & Parties */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <Building className="w-4 h-4 text-teal-600" />
                  <span>2. Property Details & Parties</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Flat / Unit No.</label>
                    <input
                      type="text"
                      value={formData.flatNumber}
                      onChange={(e) => handleInputChange("flatNumber", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Building & Road / Sector</label>
                    <input
                      type="text"
                      value={`${formData.buildingName}, ${formData.roadSector}`}
                      onChange={(e) => handleInputChange("buildingName", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Area / Thana / City</label>
                    <input
                      type="text"
                      value={formData.areaCity}
                      onChange={(e) => handleInputChange("areaCity", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Landlord Name & Phone</label>
                    <input
                      type="text"
                      value={`${formData.landlordName} (${formData.landlordPhone})`}
                      onChange={(e) => {
                        const parts = e.target.value.split("(");
                        handleInputChange("landlordName", parts[0]?.trim() || "");
                        if (parts[1]) handleInputChange("landlordPhone", parts[1].replace(")", "").trim());
                      }}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Tenant Name & Phone</label>
                    <input
                      type="text"
                      value={`${formData.tenantName} (${formData.tenantPhone})`}
                      onChange={(e) => {
                        const parts = e.target.value.split("(");
                        handleInputChange("tenantName", parts[0]?.trim() || "");
                        if (parts[1]) handleInputChange("tenantPhone", parts[1].replace(")", "").trim());
                      }}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Last Rent Revision Date</label>
                    <input
                      type="date"
                      value={formData.lastRevisionDate}
                      onChange={(e) => handleInputChange("lastRevisionDate", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Rent Numbers & Justification */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>3. Financial Figures & Grounds for Revision</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Current Monthly Rent (৳)</label>
                    <input
                      type="number"
                      value={formData.currentMonthlyRent}
                      onChange={(e) => handleInputChange("currentMonthlyRent", Number(e.target.value))}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Proposed New Rent (৳)</label>
                    <input
                      type="number"
                      value={formData.proposedMonthlyRent}
                      onChange={(e) => handleInputChange("proposedMonthlyRent", Number(e.target.value))}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 text-emerald-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  {formData.noticeType === "tenant_counter" && (
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Tenant Counter-Offer (৳)</label>
                      <input
                        type="number"
                        value={formData.tenantCounterRent}
                        onChange={(e) => handleInputChange("tenantCounterRent", Number(e.target.value))}
                        className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 text-amber-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  )}
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Reason / Explanation for Revision</label>
                    <textarea
                      rows={2}
                      value={formData.customReason}
                      onChange={(e) => handleInputChange("customReason", e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* View Notice CTA */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab("notice")}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white font-bold rounded-xl text-sm hover:from-emerald-800 hover:to-teal-900 transition flex items-center gap-2 shadow-md"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Formal Notice / Letter</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: PRINTABLE LETTER */}
          {activeTab === "notice" && (
            <div className="space-y-6">
              <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-10 shadow-lg font-serif text-slate-900 space-y-6">
                
                {/* Letterhead */}
                <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
                  <div className="inline-block bg-slate-900 text-white text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-0.5 rounded-full mb-1">
                    Premises Rent Control Act, 1991 (বাড়ি ভাড়া নিয়ন্ত্রণ আইন, ১৯৯১) Standard Notice
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-950">
                    {formData.noticeType === "landlord_increase"
                      ? (lang === "en" ? "NOTICE OF RENT REVISION & TENANCY ADJUSTMENT" : "বাড়ি ভাড়া বৃদ্ধি ও পুনর্নির্ধারণ সংক্রান্ত আনুষ্ঠানিক নোটিশ")
                      : formData.noticeType === "tenant_counter"
                      ? (lang === "en" ? "TENANT'S RESPONSE & COUNTER-OFFER REGARDING RENT INCREASE" : "বাড়ি ভাড়া বৃদ্ধির বিপরীতে ভাড়াটিয়ার আপিল ও সমঝোতার আবেদন")
                      : (lang === "en" ? "MUTUAL RENT REVISION ADDENDUM TO TENANCY AGREEMENT" : "বাড়ি ভাড়া বৃদ্ধির যৌথ সম্মতিপত্র ও চুক্তির পরিশিষ্ট")}
                  </h1>
                  <p className="text-xs font-sans text-slate-600">
                    Date of Notice: <strong>{formData.noticeDate}</strong> | Effective From: <strong>{formData.effectiveDate}</strong>
                  </p>
                </div>

                {/* Recipient Box */}
                <div className="font-sans text-xs space-y-1 border-b border-slate-200 pb-3">
                  <p className="font-bold text-slate-900">To (প্রাপক):</p>
                  <p className="font-bold">{formData.noticeType === "tenant_counter" ? formData.landlordName : formData.tenantName}</p>
                  <p className="text-slate-600">Tenant / Resident of: {formData.flatNumber}, {formData.buildingName}, {formData.roadSector}, {formData.areaCity}</p>
                  <p className="text-slate-600">Mobile: {formData.noticeType === "tenant_counter" ? formData.landlordPhone : formData.tenantPhone}</p>
                </div>

                {/* Subject Line */}
                <div className="font-sans text-xs font-bold bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                  <span>Subject: </span>
                  {formData.noticeType === "landlord_increase" && (
                    <span>Notice of monthly rent revision for {formData.flatNumber} effective from {formData.effectiveDate}.</span>
                  )}
                  {formData.noticeType === "tenant_counter" && (
                    <span>Submission of amicable counter-proposal regarding the proposed rent increment for {formData.flatNumber}.</span>
                  )}
                  {formData.noticeType === "mutual_amendment" && (
                    <span>Addendum and mutual agreement on revised monthly rent for {formData.flatNumber}.</span>
                  )}
                </div>

                {/* Main Body */}
                <div className="font-sans text-xs leading-relaxed space-y-3 text-slate-800">
                  {formData.noticeType === "landlord_increase" && (
                    <>
                      <p>Dear {formData.tenantName},</p>
                      <p>
                        I hope this letter finds you well. As you are aware, your tenancy at <strong>{formData.flatNumber}, {formData.buildingName}</strong> has been continuing satisfactorily since your move-in date. The current monthly rent of <strong>৳{calculations.current.toLocaleString()}</strong> has been in effect since <strong>{formData.lastRevisionDate}</strong> (over 2 years).
                      </p>
                      <p>
                        Due to overall inflation, increased building maintenance expenditures, and municipal holding tax adjustments, it has become necessary to revise the monthly rent. In accordance with the Premises Rent Control Act 1991 and standard 2-month prior written notice guidelines, the monthly rent will be revised to:
                      </p>
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl my-2">
                        <ul className="space-y-1 font-semibold text-emerald-950">
                          <li>• Current Monthly Rent: ৳{calculations.current.toLocaleString()} / month</li>
                          <li>• Revised Monthly Rent: <strong>৳{calculations.proposed.toLocaleString()} / month</strong> (+{calculations.percent}% increment)</li>
                          <li>• Effective From: <strong>{formData.effectiveDate}</strong></li>
                        </ul>
                      </div>
                      <p>
                        Reason for adjustment: <em>{formData.customReason}</em>
                      </p>
                      <p>
                        All other terms and conditions of the original Tenancy Agreement shall remain unchanged. Kindly confirm your acceptance by signing below or feel free to reach out if you have any questions.
                      </p>
                    </>
                  )}

                  {formData.noticeType === "tenant_counter" && (
                    <>
                      <p>Dear {formData.landlordName},</p>
                      <p>
                        I am in receipt of your notice regarding the proposed rent increment of <strong>+{calculations.percent}% (৳{calculations.proposed.toLocaleString()})</strong> for <strong>{formData.flatNumber}</strong> effective from {formData.effectiveDate}.
                      </p>
                      <p>
                        While I completely understand the rising cost of building maintenance and inflation, an abrupt hike of ৳{calculations.diff.toLocaleString()}/month places a severe strain on my family budget. As a long-term tenant who has maintained the premises immaculately and cleared all rent/utility dues punctually:
                      </p>
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl my-2">
                        <p className="font-bold text-amber-950 mb-1">Amicable Counter-Proposal:</p>
                        <ul className="space-y-1 font-semibold text-amber-900">
                          <li>• Proposed New Rent: <strong>৳{calculations.counter.toLocaleString()} / month</strong> (+{calculations.counterPercent}% increment)</li>
                          <li>• Effective From: <strong>{formData.effectiveDate}</strong></li>
                        </ul>
                      </div>
                      <p>
                        I sincerely request you to consider this reasonable adjustment so we can continue our positive tenancy relationship harmoniously.
                      </p>
                    </>
                  )}

                  {formData.noticeType === "mutual_amendment" && (
                    <>
                      <p>
                        This Addendum is mutually executed between <strong>{formData.landlordName}</strong> (Landlord) and <strong>{formData.tenantName}</strong> (Tenant) regarding the tenancy of <strong>{formData.flatNumber}, {formData.buildingName}, {formData.roadSector}, {formData.areaCity}</strong>.
                      </p>
                      <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl my-2 space-y-1">
                        <p><strong>1. Revised Monthly Rent:</strong> The monthly rent is mutually fixed at <strong>৳{calculations.proposed.toLocaleString()} (Taka {calculations.proposed.toLocaleString()} only)</strong>.</p>
                        <p><strong>2. Effective Date:</strong> The revised rate shall take effect from <strong>{formData.effectiveDate}</strong>.</p>
                        <p><strong>3. Term Continuity:</strong> All covenants, security deposit terms, and notice periods in the principal Tenancy Deed dated {formData.lastRevisionDate} remain binding.</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Signatures */}
                <div className="font-sans text-xs grid grid-cols-2 gap-8 pt-8 text-center">
                  <div className="border-t-2 border-slate-800 pt-1.5">
                    <p className="font-bold text-slate-900">{formData.landlordName}</p>
                    <p className="text-[11px] text-slate-600">Landlord Signature (বাড়িওয়ালার স্বাক্ষর)</p>
                    <p className="text-[10px] text-slate-400">Date: _______________</p>
                  </div>

                  <div className="border-t-2 border-slate-800 pt-1.5">
                    <p className="font-bold text-slate-900">{formData.tenantName}</p>
                    <p className="text-[11px] text-slate-600">Tenant Signature (ভাড়াটিয়ার স্বাক্ষর / সম্মতি)</p>
                    <p className="text-[10px] text-slate-400">Date: _______________</p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: GUIDELINES */}
          {activeTab === "guidelines" && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 space-y-2">
                <h3 className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-emerald-700" />
                  <span>Key Rent Increase Rules under Premises Rent Control Act, 1991 (আইন ১৯৯১)</span>
                </h3>
                <p>
                  Under Sections 7, 8, and 9 of the Premises Rent Control Act 1991, landlords and tenants must adhere to lawful procedures when revising residential rent in Bangladesh.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Minimum 2 Years Tenancy Rule</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Standard rent in Bangladesh cannot be arbitrarily increased every 6 months or 1 year. The standard practice recognized by civil courts is a biennial revision (once every 2 years) or upon mutual agreement at the end of the registered deed term.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Mandatory 2 Months Prior Notice</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    A landlord must serve written notice at least <strong>60 days (2 calendar months)</strong> prior to the effective date. Immediate or retroactive rent increases are legally invalid under Section 18.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Fair Inflation Rate Benchmark (5% – 10%)</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Increments exceeding 10% – 15% without substantial structural renovations or heavy municipal rate hikes are considered unreasonable and can be contested by the tenant before the Rent Controller.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Mutual Addendum Over New Stamp Deeds</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Executing a signed 2-party rent revision addendum letter satisfies legal compliance without incurring the cost of purchasing a fresh 300 Tk non-judicial stamp paper every time rent is adjusted.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Premises Rent Control Act, 1991 (বাড়ি ভাড়া নিয়ন্ত্রণ আইন, ১৯৯১) Standard Template</span>
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
              className="px-4 py-1.5 text-xs font-bold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Letter</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
