import React, { useState, useMemo } from "react";
import {
  Coins,
  Calculator,
  Printer,
  Copy,
  CheckCircle2,
  FileText,
  HelpCircle,
  Building2,
  Percent,
  ShieldCheck,
  TrendingDown,
  Info,
  X,
  Sparkles,
  ArrowRight,
  Scale,
  Landmark
} from "lucide-react";

export default function RentalIncomeTaxCalculatorModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("calculator"); // "calculator" | "schedule" | "faq"
  const [lang, setLang] = useState("en"); // "en" | "bn"
  const [copied, setCopied] = useState(false);

  // Form Inputs
  const [taxYear, setTaxYear] = useState("2026-2027");
  const [propertyType, setPropertyType] = useState("residential"); // "residential" (25% repair) | "commercial" (30% repair)
  const [taxpayerCategory, setTaxpayerCategory] = useState("general"); // "general" | "female_senior" | "specially_abled" | "freedom_fighter"
  const [locationCategory, setLocationCategory] = useState("dhaka_ctg"); // "dhaka_ctg" (৳5000 min) | "other_city" (৳4000 min) | "non_city" (৳3000 min)

  // Property Details
  const [propertyDetails, setPropertyDetails] = useState({
    ownerName: "Mohammad Rafiqul Islam",
    ownerTIN: "123456789012",
    propertyAddress: "Flat 5-A, Holding #24, Road 11, Uttara, Dhaka-1230",
    tenancyMonths: 12,
    monthlyGrossRent: 35000,
    monthlyServiceCharge: 5000, // Typically tenant borne or maintenance
    advanceRentReceived: 0,
    unadjustedDeposit: 0,
    vacantMonths: 0,
  });

  // Allowable Deductions Under Section 37 of Income Tax Act 2023
  const [deductions, setDeductions] = useState({
    holdingTaxPaid: 18000, // Annual municipal holding tax
    landTaxKhajna: 1200, // Land development tax
    mortgageLoanInterest: 60000, // Bank loan / HBFC interest for house construction
    insurancePremium: 0, // Building insurance
    groundRent: 0, // Leasehold ground rent
    otherAllowable: 0,
  });

  const handlePropertyChange = (field, val) => {
    setPropertyDetails((prev) => ({ ...prev, [field]: val }));
  };

  const handleDeductionChange = (field, val) => {
    setDeductions((prev) => ({ ...prev, [field]: val }));
  };

  // Calculations
  const calculations = useMemo(() => {
    const months = Math.max(1, Math.min(12, Number(propertyDetails.tenancyMonths) || 12));
    const monthlyRent = Number(propertyDetails.monthlyGrossRent) || 0;
    const grossAnnualRent = monthlyRent * months + Number(propertyDetails.advanceRentReceived || 0);

    // Vacancy Allowance
    const vacantMonths = Math.max(0, Math.min(12, Number(propertyDetails.vacantMonths) || 0));
    const vacancyAllowance = monthlyRent * vacantMonths;
    const adjustedAnnualGross = Math.max(0, grossAnnualRent - vacancyAllowance);

    // Statutory Repair & Maintenance Allowance (25% for residential, 30% for commercial)
    const repairRate = propertyType === "residential" ? 0.25 : 0.30;
    const statutoryRepairAllowance = adjustedAnnualGross * repairRate;

    // Itemized Deductions
    const holdingTax = Number(deductions.holdingTaxPaid) || 0;
    const landTax = Number(deductions.landTaxKhajna) || 0;
    const loanInterest = Number(deductions.mortgageLoanInterest) || 0;
    const insurance = Number(deductions.insurancePremium) || 0;
    const groundRent = Number(deductions.groundRent) || 0;
    const other = Number(deductions.otherAllowable) || 0;

    const totalAllowableDeductions =
      statutoryRepairAllowance + holdingTax + landTax + loanInterest + insurance + groundRent + other;

    // Net Taxable Income from House Property
    const netHousePropertyIncome = Math.max(0, adjustedAnnualGross - totalAllowableDeductions);

    // Exemption Threshold based on Taxpayer Category (NBR 2026/2027 standard)
    let exemptionLimit = 350000;
    if (taxpayerCategory === "female_senior") exemptionLimit = 400000;
    if (taxpayerCategory === "specially_abled") exemptionLimit = 475000;
    if (taxpayerCategory === "freedom_fighter") exemptionLimit = 500000;

    // Minimum Tax based on Location
    let minTax = 5000;
    if (locationCategory === "other_city") minTax = 4000;
    if (locationCategory === "non_city") minTax = 3000;

    // Progressive Slab Calculation on net taxable income
    let taxable = netHousePropertyIncome;
    let computedTax = 0;
    const slabs = [];

    // Slab 1: Exemption
    const slab1 = Math.min(taxable, exemptionLimit);
    slabs.push({ label: `First ৳${(exemptionLimit / 100000).toFixed(2)} Lakh (Tax Free)`, rate: "0%", taxable: slab1, tax: 0 });
    taxable -= slab1;

    // Slab 2: Next ৳1,00,000 @ 5%
    if (taxable > 0) {
      const slab2 = Math.min(taxable, 100000);
      const tax2 = slab2 * 0.05;
      computedTax += tax2;
      slabs.push({ label: "Next ৳1.00 Lakh", rate: "5%", taxable: slab2, tax: tax2 });
      taxable -= slab2;
    }

    // Slab 3: Next ৳4,00,000 @ 10%
    if (taxable > 0) {
      const slab3 = Math.min(taxable, 400000);
      const tax3 = slab3 * 0.10;
      computedTax += tax3;
      slabs.push({ label: "Next ৳4.00 Lakh", rate: "10%", taxable: slab3, tax: tax3 });
      taxable -= slab3;
    }

    // Slab 4: Next ৳5,00,000 @ 15%
    if (taxable > 0) {
      const slab4 = Math.min(taxable, 500000);
      const tax4 = slab4 * 0.15;
      computedTax += tax4;
      slabs.push({ label: "Next ৳5.00 Lakh", rate: "15%", taxable: slab4, tax: tax4 });
      taxable -= slab4;
    }

    // Slab 5: Next ৳5,00,000 @ 20%
    if (taxable > 0) {
      const slab5 = Math.min(taxable, 500000);
      const tax5 = slab5 * 0.20;
      computedTax += tax5;
      slabs.push({ label: "Next ৳5.00 Lakh", rate: "20%", taxable: slab5, tax: tax5 });
      taxable -= slab5;
    }

    // Slab 6: Balance @ 25%
    if (taxable > 0) {
      const tax6 = taxable * 0.25;
      computedTax += tax6;
      slabs.push({ label: "Remaining Balance", rate: "25%", taxable: taxable, tax: tax6 });
    }

    // Final Tax Liability (Subject to minimum tax if total taxable income > exemption limit)
    let finalTaxLiability = 0;
    if (netHousePropertyIncome > exemptionLimit) {
      finalTaxLiability = Math.max(computedTax, minTax);
    }

    // Effective Tax Rate
    const effectiveTaxRate = adjustedAnnualGross > 0 ? (finalTaxLiability / adjustedAnnualGross) * 100 : 0;

    // Commercial TDS estimation if commercial
    const commercialTds = propertyType === "commercial" ? adjustedAnnualGross * 0.05 : 0;

    // City Corporation Holding Tax Breakdown (Estimated 12% on Annual Rateable Value)
    const annualRateableValue = adjustedAnnualGross * 0.80; // Estimated 20% deduction for maintenance in municipal valuation
    const estHoldingTax = annualRateableValue * 0.07; // 7% holding tax
    const estConservancyTax = annualRateableValue * 0.03; // 3% conservancy
    const estLightingTax = annualRateableValue * 0.02; // 2% lighting
    const estTotalMunicipalTax = annualRateableValue * 0.12;

    return {
      months,
      monthlyRent,
      grossAnnualRent,
      vacancyAllowance,
      adjustedAnnualGross,
      repairRate,
      statutoryRepairAllowance,
      holdingTax,
      landTax,
      loanInterest,
      insurance,
      groundRent,
      other,
      totalAllowableDeductions,
      netHousePropertyIncome,
      exemptionLimit,
      slabs,
      computedTax,
      minTax,
      finalTaxLiability,
      effectiveTaxRate,
      commercialTds,
      estTotalMunicipalTax,
      estHoldingTax,
      estConservancyTax,
      estLightingTax,
    };
  }, [propertyType, taxpayerCategory, locationCategory, propertyDetails, deductions]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    let md = `# BANGLADESH RENTAL INCOME TAX STATEMENT (NBR SCHEDULE)\n`;
    md += `**Assessment Year:** ${taxYear} | **Property Type:** ${propertyType.toUpperCase()}\n`;
    md += `**Owner:** ${propertyDetails.ownerName} (TIN: ${propertyDetails.ownerTIN})\n`;
    md += `**Property Address:** ${propertyDetails.propertyAddress}\n\n`;
    md += `## 1. Income from House Property (Section 36 & 37 of Income Tax Act 2023)\n`;
    md += `- **Gross Annual Rent Received:** ৳${calculations.grossAnnualRent.toLocaleString()}\n`;
    md += `- **Less: Vacancy Allowance:** -৳${calculations.vacancyAllowance.toLocaleString()}\n`;
    md += `- **Adjusted Annual Gross Rental Income:** ৳${calculations.adjustedAnnualGross.toLocaleString()}\n\n`;
    md += `## 2. Allowable Deductions\n`;
    md += `- **Statutory Repair & Maintenance (${(calculations.repairRate * 100)}%):** ৳${calculations.statutoryRepairAllowance.toLocaleString()}\n`;
    md += `- **Municipal / City Corporation Holding Tax:** ৳${calculations.holdingTax.toLocaleString()}\n`;
    md += `- **Land Development Tax (Khajna):** ৳${calculations.landTax.toLocaleString()}\n`;
    md += `- **Mortgage / Bank Loan Interest:** ৳${calculations.loanInterest.toLocaleString()}\n`;
    md += `- **Total Allowable Deductions:** ৳${calculations.totalAllowableDeductions.toLocaleString()}\n\n`;
    md += `## 3. Tax Assessment Summary\n`;
    md += `- **Net Taxable Rental Income:** ৳${calculations.netHousePropertyIncome.toLocaleString()}\n`;
    md += `- **Exemption Threshold:** ৳${calculations.exemptionLimit.toLocaleString()}\n`;
    md += `- **Estimated Annual Tax Liability:** ৳${calculations.finalTaxLiability.toLocaleString()}\n`;
    md += `- **Effective Tax Rate:** ${calculations.effectiveTaxRate.toFixed(2)}%\n`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 text-white px-5 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 rounded-xl backdrop-blur-sm border border-blue-400/30">
              <Coins className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">
                  {lang === "en" ? "Rental Income Tax & Holding Tax Calculator" : "বাড়ি ভাড়া আয়কর ও হোল্ডিং ট্যাক্স ক্যালকুলেটর"}
                </h2>
                <span className="text-[10px] bg-yellow-400 text-blue-950 font-bold px-2 py-0.5 rounded-full uppercase">
                  NBR Act 2023
                </span>
              </div>
              <p className="text-xs text-blue-200/90 mt-0.5">
                {lang === "en"
                  ? "Section 36/37 House Property Tax, 25-30% Statutory Deductions & Municipal Holding Rate"
                  : "আয়কর আইন ২০২৩ এর ধারা ৩৬/৩৭ অনুযায়ী বাড়ি ভাড়ার নিট করযোগ্য আয় ও ছাড় হিসাব"}
              </p>
            </div>
          </div>

          {/* Action controls */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-950/60 p-0.5 rounded-lg border border-blue-500/30 flex text-xs">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded-md font-semibold transition ${
                  lang === "en" ? "bg-white text-blue-900 shadow-sm" : "text-blue-200 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("bn")}
                className={`px-2 py-1 rounded-md font-semibold transition ${
                  lang === "bn" ? "bg-white text-blue-900 shadow-sm" : "text-blue-200 hover:text-white"
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("calculator")}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === "calculator"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>1. Tax Computation</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("schedule")}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === "schedule"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>2. Official NBR Schedule (IT-11GA)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("faq")}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === "faq"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>3. Legal Guidelines & TDS</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 text-xs font-semibold bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? "Copied!" : "Copy Summary"}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Schedule</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {activeTab === "calculator" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Form Controls (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Taxpayer Category & Assessment Profile */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-blue-600" />
                    <span>{lang === "en" ? "Assessment Year & Taxpayer Profile" : "করবর্ষ ও করদাতার বিবরণ"}</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Tax Assessment Year</label>
                      <select
                        value={taxYear}
                        onChange={(e) => setTaxYear(e.target.value)}
                        className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="2026-2027">AY 2026-2027 (Current)</option>
                        <option value="2025-2026">AY 2025-2026</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Property Usage Type</label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="residential">🏡 Residential (25% Repair Allowance)</option>
                        <option value="commercial">🏢 Commercial / Office (30% Repair)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Taxpayer Category</label>
                      <select
                        value={taxpayerCategory}
                        onChange={(e) => setTaxpayerCategory(e.target.value)}
                        className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="general">General Male (৳3.5L Free)</option>
                        <option value="female_senior">Female / Senior 65+ (৳4.0L Free)</option>
                        <option value="specially_abled">Specially-abled (৳4.75L Free)</option>
                        <option value="freedom_fighter">Freedom Fighter (৳5.0L Free)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">City Corporation / Location Jurisdiction</label>
                    <select
                      value={locationCategory}
                      onChange={(e) => setLocationCategory(e.target.value)}
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="dhaka_ctg">Dhaka North / South / Chattogram City Corp (Min Tax ৳5,000)</option>
                      <option value="other_city">Gazipur / Narayanganj / Other City Corp (Min Tax ৳4,000)</option>
                      <option value="non_city">Municipalities & Non-City Areas (Min Tax ৳3,000)</option>
                    </select>
                  </div>
                </div>

                {/* Gross Rental Income Inputs */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span>{lang === "en" ? "Gross Rental Income Breakdown" : "মোট বাড়ি ভাড়া আয়ের বিবরণ"}</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Monthly Rent Received (৳ / month)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">৳</span>
                        <input
                          type="number"
                          value={propertyDetails.monthlyGrossRent}
                          onChange={(e) => handlePropertyChange("monthlyGrossRent", Number(e.target.value))}
                          className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 pl-7 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Tenancy Duration (Months in Tax Year)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={propertyDetails.tenancyMonths}
                        onChange={(e) => handlePropertyChange("tenancyMonths", Number(e.target.value))}
                        className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Advance Rent / Non-refundable Premium (৳)
                      </label>
                      <input
                        type="number"
                        value={propertyDetails.advanceRentReceived}
                        onChange={(e) => handlePropertyChange("advanceRentReceived", Number(e.target.value))}
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Vacancy Loss Period (Months unoccupied)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="12"
                        value={propertyDetails.vacantMonths}
                        onChange={(e) => handlePropertyChange("vacantMonths", Number(e.target.value))}
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Allowable Deductions (Section 37) */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-indigo-600" />
                      <span>{lang === "en" ? "Allowable Deductions (Section 37)" : "আইনসম্মত খরচের ছাড় (ধারা ৩৭)"}</span>
                    </h3>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Auto Repair: {(calculations.repairRate * 100)}% (৳{calculations.statutoryRepairAllowance.toLocaleString()})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        City Corporation Holding Tax Paid (৳)
                      </label>
                      <input
                        type="number"
                        value={deductions.holdingTaxPaid}
                        onChange={(e) => handleDeductionChange("holdingTaxPaid", Number(e.target.value))}
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Land Development Tax / Khajna (৳)
                      </label>
                      <input
                        type="number"
                        value={deductions.landTaxKhajna}
                        onChange={(e) => handleDeductionChange("landTaxKhajna", Number(e.target.value))}
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Bank / HBFC Loan Interest on Property (৳)
                      </label>
                      <input
                        type="number"
                        value={deductions.mortgageLoanInterest}
                        onChange={(e) => handleDeductionChange("mortgageLoanInterest", Number(e.target.value))}
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Building Insurance / Ground Rent (৳)
                      </label>
                      <input
                        type="number"
                        value={deductions.insurancePremium}
                        onChange={(e) => handleDeductionChange("insurancePremium", Number(e.target.value))}
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Live Tax Breakdown & Summary (5 cols) */}
              <div className="lg:col-span-5 space-y-5">
                
                {/* Tax Hero Summary Card */}
                <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-5 shadow-xl border border-blue-800 relative overflow-hidden">
                  <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
                      Estimated Tax Payable
                    </span>
                    <span className="text-xs font-bold bg-yellow-400 text-blue-950 px-2 py-0.5 rounded-full">
                      AY {taxYear}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="text-3xl sm:text-4xl font-black text-yellow-400 tracking-tight">
                      ৳{calculations.finalTaxLiability.toLocaleString()}
                    </div>
                    <p className="text-xs text-blue-200 mt-1 flex items-center gap-1.5">
                      <span>Effective Tax Rate:</span>
                      <strong className="text-white">{calculations.effectiveTaxRate.toFixed(2)}%</strong>
                    </p>
                  </div>

                  <div className="border-t border-blue-800/80 pt-3 space-y-2 text-xs">
                    <div className="flex justify-between text-blue-200">
                      <span>Gross Rental Income:</span>
                      <span className="font-bold text-white">৳{calculations.adjustedAnnualGross.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-blue-200">
                      <span>Total Allowable Deductions:</span>
                      <span className="font-bold text-emerald-400">-৳{calculations.totalAllowableDeductions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-blue-200 border-t border-blue-800/50 pt-1.5">
                      <span>Net Taxable House Property Income:</span>
                      <span className="font-bold text-yellow-300">৳{calculations.netHousePropertyIncome.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Progressive Slab Tax Breakdown */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center justify-between">
                    <span>Tax Slabs Breakdown</span>
                    <span className="text-[10px] text-slate-500">NBR Slabs</span>
                  </h4>

                  <div className="space-y-2">
                    {calculations.slabs.map((slab, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <div>
                          <span className="font-semibold text-slate-800 block">{slab.label}</span>
                          <span className="text-[10px] text-slate-500">Taxable: ৳{slab.taxable.toLocaleString()}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-blue-900 block">৳{slab.tax.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-500">Rate: {slab.rate}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {calculations.netHousePropertyIncome > calculations.exemptionLimit && calculations.computedTax < calculations.minTax && (
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px] flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 shrink-0" />
                      <span>Applied City Corporation Minimum Tax: ৳{calculations.minTax.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Municipal Holding Tax Insight */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">City Corp Municipal Holding Tax (12%)</span>
                    <span className="font-bold text-blue-900">৳{Math.round(calculations.estTotalMunicipalTax).toLocaleString()} / yr</span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>• General Holding (7%):</span>
                      <span>৳{Math.round(calculations.estHoldingTax).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Conservancy Tax (3%):</span>
                      <span>৳{Math.round(calculations.estConservancyTax).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Street Lighting Tax (2%):</span>
                      <span>৳{Math.round(calculations.estLightingTax).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === "schedule" && (
            /* Printable NBR House Property Schedule (IT-11GA Format) */
            <div className="space-y-6">
              <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-10 shadow-lg font-serif text-slate-900 space-y-6">
                
                {/* Header */}
                <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
                  <div className="inline-block bg-blue-900 text-white text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-0.5 rounded-full mb-1">
                    National Board of Revenue (NBR), Bangladesh • Income Tax Act 2023
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-950">
                    {lang === "en"
                      ? "SCHEDULE OF INCOME FROM HOUSE PROPERTY (SECTION 36 & 37)"
                      : "গৃহ সম্পত্তির আয় বিবরণী ও কর নির্ধারণ তফসিল (ধারা ৩৬ ও ৩৭)"}
                  </h1>
                  <p className="text-xs font-sans text-slate-600">
                    Annexure for Return of Income (Form IT-11GA) • Assessment Year {taxYear}
                  </p>
                </div>

                {/* Taxpayer Meta */}
                <div className="font-sans text-xs grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 border border-slate-300 rounded-xl">
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Taxpayer Name:</span>
                    <span className="font-bold text-slate-900">{propertyDetails.ownerName}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">e-TIN Number:</span>
                    <span className="font-bold text-slate-900">{propertyDetails.ownerTIN}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Property Type:</span>
                    <span className="font-bold text-slate-900">{propertyType === "residential" ? "Residential (আবাসিক)" : "Commercial (বাণিজ্যিক)"}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Tax Circle & Zone:</span>
                    <span className="font-bold text-slate-900">Circle-120, Zone-06, Dhaka</span>
                  </div>
                  <div className="sm:col-span-4">
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Property Location / Address:</span>
                    <span className="font-bold text-slate-900">{propertyDetails.propertyAddress}</span>
                  </div>
                </div>

                {/* Computation Table */}
                <div className="font-sans space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-200 px-3 py-1 rounded">
                    Calculation of Net Income from House Property
                  </h4>
                  <table className="w-full text-xs border border-slate-300">
                    <thead className="bg-slate-100 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-2 border-r border-slate-300 text-left w-12">Item</th>
                        <th className="p-2 border-r border-slate-300 text-left">Particulars & Legal Section</th>
                        <th className="p-2 text-right w-36">Amount (BDT ৳)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300 font-medium">
                      <tr>
                        <td className="p-2 border-r border-slate-300 font-bold text-center">1</td>
                        <td className="p-2 border-r border-slate-300">Gross Annual Rent Received (৳{propertyDetails.monthlyGrossRent.toLocaleString()} × {calculations.months} months)</td>
                        <td className="p-2 text-right font-bold">৳{calculations.grossAnnualRent.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-slate-300 font-bold text-center">2</td>
                        <td className="p-2 border-r border-slate-300">Less: Vacancy Allowance ({propertyDetails.vacantMonths} months vacant)</td>
                        <td className="p-2 text-right text-rose-700">-৳{calculations.vacancyAllowance.toLocaleString()}</td>
                      </tr>
                      <tr className="bg-slate-50 font-bold">
                        <td className="p-2 border-r border-slate-300 text-center">3</td>
                        <td className="p-2 border-r border-slate-300">Adjusted Annual Value / Gross Rent (Item 1 - Item 2)</td>
                        <td className="p-2 text-right">৳{calculations.adjustedAnnualGross.toLocaleString()}</td>
                      </tr>
                      
                      {/* Deductions Header */}
                      <tr className="bg-slate-200/70 font-bold">
                        <td className="p-1.5 border-r border-slate-300 text-center">4</td>
                        <td className="p-1.5 border-r border-slate-300" colSpan={2}>
                          Allowable Deductions under Section 37 of Income Tax Act 2023:
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-slate-300 text-center">4(a)</td>
                        <td className="p-2 border-r border-slate-300">Statutory Repair & Maintenance Allowance ({(calculations.repairRate * 100)}% of Item 3)</td>
                        <td className="p-2 text-right">৳{calculations.statutoryRepairAllowance.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-slate-300 text-center">4(b)</td>
                        <td className="p-2 border-r border-slate-300">Municipal / City Corporation Holding Tax Paid</td>
                        <td className="p-2 text-right">৳{calculations.holdingTax.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-slate-300 text-center">4(c)</td>
                        <td className="p-2 border-r border-slate-300">Land Development Tax (Khajna / খাজনা)</td>
                        <td className="p-2 text-right">৳{calculations.landTax.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-slate-300 text-center">4(d)</td>
                        <td className="p-2 border-r border-slate-300">Bank / HBFC Loan Interest for Construction / Acquisition</td>
                        <td className="p-2 text-right">৳{calculations.loanInterest.toLocaleString()}</td>
                      </tr>
                      <tr className="bg-slate-100 font-bold">
                        <td className="p-2 border-r border-slate-300 text-center">5</td>
                        <td className="p-2 border-r border-slate-300">Total Allowable Deductions [Sum of 4(a) to 4(d)]</td>
                        <td className="p-2 text-right text-emerald-800">৳{calculations.totalAllowableDeductions.toLocaleString()}</td>
                      </tr>
                      
                      {/* Net Taxable */}
                      <tr className="bg-blue-50/80 font-black text-blue-950 text-sm">
                        <td className="p-2.5 border-r border-slate-300 text-center">6</td>
                        <td className="p-2.5 border-r border-slate-300">Net Taxable Income from House Property (Item 3 - Item 5)</td>
                        <td className="p-2.5 text-right text-blue-900">৳{calculations.netHousePropertyIncome.toLocaleString()}</td>
                      </tr>
                      
                      {/* Tax Liability */}
                      <tr className="bg-yellow-50/80 font-black text-slate-900">
                        <td className="p-2.5 border-r border-slate-300 text-center">7</td>
                        <td className="p-2.5 border-r border-slate-300">Estimated Total Income Tax Liability (as per progressive slabs)</td>
                        <td className="p-2.5 text-right text-slate-950">৳{calculations.finalTaxLiability.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Declaration & Signature */}
                <div className="font-sans text-xs space-y-4 pt-4">
                  <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 text-[11px] leading-relaxed">
                    <p className="font-bold text-slate-900 mb-1">
                      {lang === "en" ? "TAXPAYER DECLARATION & VERIFICATION:" : "করদাতার প্রত্যয়ন ও সত্যপাঠ:"}
                    </p>
                    <p>
                      I, <strong>{propertyDetails.ownerName}</strong>, hereby declare that the particulars furnished in this House Property Income Schedule are true, correct, and complete in accordance with the provisions of the Income Tax Act, 2023.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-10 text-center font-sans text-xs">
                    <div className="text-left">
                      <p className="text-[11px] text-slate-600">Date: {new Date().toISOString().split("T")[0]}</p>
                      <p className="text-[11px] text-slate-600">Place: Dhaka, Bangladesh</p>
                    </div>

                    <div className="border-t-2 border-slate-800 pt-1.5">
                      <p className="font-bold text-slate-900">{propertyDetails.ownerName}</p>
                      <p className="text-[11px] text-slate-600">Signature of Taxpayer (করদাতার স্বাক্ষর)</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === "faq" && (
            /* FAQs & Legal Knowledge Base */
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 space-y-2">
                <h3 className="font-bold text-sm text-blue-950 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-blue-700" />
                  <span>Key Tenancy Tax Rules in Bangladesh (আয়কর আইন ২০২৩)</span>
                </h3>
                <p>
                  Under Sections 36 and 37 of the Income Tax Act 2023, rental income from residential and commercial buildings is taxable under the head "Income from House Property".
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>25% vs 30% Statutory Repair Allowance</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Landlords receive a flat statutory deduction of <strong>25% for residential properties</strong> and <strong>30% for commercial properties</strong> for repairs and maintenance, regardless of actual expenses incurred. No receipt vouchers are required by NBR for this statutory allowance.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Bank Loan Interest Deduction</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    If the property was constructed or acquired using a mortgage or bank loan (e.g., DBH, HBFC, or Commercial Bank), the <strong>interest portion</strong> paid during the tax year is 100% deductible from gross rent.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Commercial Rent 5% Source Tax (TDS)</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Corporate/Commercial tenants (Companies, NGOs, Banks) paying rent above the monthly threshold are required under Section 112 to deduct <strong>5% TDS at source</strong> and deposit it into the Government Treasury via challan. The landlord can adjust this against their final annual tax.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Holding Tax & Municipal Rates</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Dhaka City Corporation (DNCC & DSCC) levies a total of <strong>12% Holding Tax</strong> (7% General + 3% Conservancy + 2% Lighting) on the annual rateable valuation of the flat. Holding tax payments are fully deductible in NBR tax returns.
                  </p>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>
              {lang === "en"
                ? "Compliant with Bangladesh Income Tax Act 2023 & NBR Form IT-11GA"
                : "জাতীয় রাজস্ব বোর্ড (NBR) ও আয়কর আইন ২০২৩ এর মানসম্মত তফসিল"}
            </span>
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
              className="px-4 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Tax Schedule</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
