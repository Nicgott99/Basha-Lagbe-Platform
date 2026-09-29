import React, { useState } from "react";
import {
  X,
  Printer,
  Copy,
  Check,
  Building2,
  FileCheck,
  Calculator,
  HelpCircle,
  Briefcase,
  AlertTriangle,
  FileText,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Landmark,
  BadgeDollarSign,
  Store
} from "lucide-react";

export default function CommercialTenancyNocModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("noc"); // "noc" | "deed" | "tax-calc" | "guide"
  const [copied, setCopied] = useState(false);

  // Form State for NOC & Deed
  const [formData, setFormData] = useState({
    // Business info
    businessName: "Alvie Tech & Cloud Solutions",
    businessType: "Software & Digital Agency", // Retail Shop, IT Firm, Pharmacy, Restaurant, Consultancy, etc.
    tradeLicenseNo: "TRAD/DNCC/048291/2026",
    proprietorName: "MD Hasib Ullah Khan Alvie",
    proprietorNid: "19982692019283741",
    proprietorTin: "482910492817",
    proprietorPhone: "01712-345678",
    proprietorAddress: "House 14, Road 5, Block C, Banani, Dhaka-1213",

    // Landlord / Owner info
    landlordName: "Alhaj Rafiqul Islam",
    landlordNid: "19652691029384756",
    landlordTin: "192837465019",
    landlordPhone: "01819-876543",
    landlordAddress: "Holding 42, Road 11, Sector 4, Uttara, Dhaka-1230",

    // Commercial Property info
    cityCorporation: "Dhaka North City Corporation (DNCC)", // DNCC, DSCC, CCC, etc.
    wardNo: "Ward No. 01 (Uttara)",
    holdingNo: "Holding 42/A",
    floorNo: "2nd Floor (Commercial Suite # 202)",
    commercialAreaSqft: "1250",
    propertyAddress: "Holding 42/A, Road 11, Sector 4, Uttara Commercial Area, Dhaka-1230",
    meterNo: "DESCO-COMM-8392019",
    sanctionedLoad: "15 kW Commercial",

    // Financial Terms
    monthlyRent: 45000,
    securityDeposit: 150000, // 3 months advance
    serviceCharge: 6000,
    leaseDurationYears: 3,
    startDate: "2026-10-01",
    endDate: "2029-09-30",
    rentDueDay: 5,
    annualIncrementPct: 10,
    fitOutGraceDays: 15,
    noticePeriodMonths: 3,

    // Signboard
    signboardWidthFt: 10,
    signboardHeightFt: 3,
    signboardType: "illuminated", // "regular" | "illuminated"
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

  // Calculations for VAT & Tax Deductions (VDS 15% & TDS 5%)
  const baseRent = Number(formData.monthlyRent) || 0;
  const baseService = Number(formData.serviceCharge) || 0;
  const grossMonthly = baseRent + baseService;
  const annualBaseRent = baseRent * 12;

  // Commercial TDS under Income Tax Act 2023 (Sec 89: 5% on commercial rent)
  const monthlyTds = Math.round(baseRent * 0.05);
  const annualTds = monthlyTds * 12;

  // Commercial VDS (15% standard on commercial leasing)
  const monthlyVat = Math.round(baseRent * 0.15);
  const annualVat = monthlyVat * 12;

  // Net payable directly to Landlord after mandatory VDS & TDS withholding (if company/deducting entity)
  const netPayableToLandlordWithholding = baseRent - monthlyTds + baseService;

  // Signboard Area & Tax calculation
  const sbSqft = (Number(formData.signboardWidthFt) || 0) * (Number(formData.signboardHeightFt) || 0);
  const sbRatePerSqft = formData.signboardType === "illuminated" ? 150 : 80;
  const annualSignboardTax = sbSqft * sbRatePerSqft;

  // Render Trade License NOC Document Text
  const nocTextBangla = `
বাণিজ্যিক ট্রেড লাইসেন্স গ্রহণের জন্য বাড়িওয়ালার অনাপত্তিপত্র (NOC)
----------------------------------------------------------------------
তারিখ: ${new Date().toLocaleDateString("bn-BD")}

বরাবর,
লাইসেন্স ও বিজ্ঞাপন কর কর্মকর্তা,
${formData.cityCorporation},
${formData.wardNo}, ঢাকা।

বিষয়: বাণিজ্যিক ট্রেড লাইসেন্স গ্রহণ/নবায়নের জন্য বাড়িওয়ালার অনাপত্তিপত্র প্রদান প্রসঙ্গে।

জনাব,
আমি নিম্নস্বাক্ষরকারী ${formData.landlordName}, জাতীয় পরিচয়পত্র নং: ${formData.landlordNid}, পিতা/স্বামী: ......................................., ঠিকানা: ${formData.landlordAddress}— অত্র এলাকার ${formData.propertyAddress} হোল্ডিংয়ের বৈধ মালিক ও দখলদার বটে।

আমি স্বেচ্ছায় ও স্বজ্ঞানে সম্মতি জ্ঞাপন করিতেছি যে, নিম্নবর্ণিত ভাড়াটিয়া প্রতিষ্ঠানকে আমার মালিকানাধীন ভবনের ${formData.floorNo} (মোট আয়তন: প্রায় ${formData.commercialAreaSqft} বর্গফুট) স্পেসটি বাণিজ্যিক ভাড়াচুক্তি মোতাবেক ব্যবসায়িক কার্যালয়/দোকান হিসেবে ব্যবহারের জন্য ভাড়া প্রদান করিয়াছি:

১. ভাড়াটিয়া প্রতিষ্ঠানের নাম: ${formData.businessName}
২. ব্যবসা/কার্যক্রমের ধরন: ${formData.businessType}
৩. স্বত্বাধিকারী / প্রতিনিধির নাম: ${formData.proprietorName}
৪. স্বত্বাধিকারীর জাতীয় পরিচয়পত্র নং: ${formData.proprietorNid}
৫. স্বত্বাধিকারীর ই-টিন (e-TIN) নং: ${formData.proprietorTin}
৬. যোগাযোগের মোবাইল নং: ${formData.proprietorPhone}
৭. বিদ্যুৎ মিটার / সংযোগ নং: ${formData.meterNo} (অনুমোদিত লোড: ${formData.sanctionedLoad})
৮. ভাড়ার মেয়াদ: ${formData.startDate} হইতে ${formData.endDate} পর্যন্ত (${formData.leaseDurationYears} বৎসর)

উক্ত ঠিকানায় সরকারের সকল বিধিবিধান মান্য করিয়া প্রতিষ্ঠানটির নামে সিটি কর্পোরেশন হইতে নতুন বাণিজ্যিক ট্রেড লাইসেন্স ইস্যু কিংবা পূর্বের লাইসেন্স নবায়ন করিতে আমার বা আমার পরিবারের কোনো প্রকার আপত্তি বা দাবি নাই।

অতএব, উপরোক্ত তথ্যের ভিত্তিতে আবেদনকারী প্রতিষ্ঠানের অনুকূলে ট্রেড লাইসেন্স মঞ্জুর করিতে আপনার সদয় মর্জি হয়।


ভবদীয়,

স্বাক্ষর: ________________________
নাম: ${formData.landlordName}
বাড়িওয়ালা ও সম্পত্তির মূল মালিক
হোল্ডিং নং: ${formData.holdingNo}
মোবাইল: ${formData.landlordPhone}
তারিখ: ${new Date().toLocaleDateString("en-GB")}
  `.trim();

  // Render Commercial Deed Text
  const commercialDeedText = `
বাণিজ্যিক দোকান / অফিস স্পেস ভাড়া চুক্তিপত্র
(৩০০ টাকার নন-জুডিশিয়াল স্ট্যাম্পে সম্পাদনের জন্য প্রযোজ্য)
---------------------------------------------------------------------------------

১ম পক্ষ (মালিক / Landlord):
নাম: ${formData.landlordName}
জাতীয় পরিচয়পত্র: ${formData.landlordNid}
ই-টিন (e-TIN): ${formData.landlordTin}
ঠিকানা: ${formData.landlordAddress}
মোবাইল: ${formData.landlordPhone}

২য় পক্ষ (ভাড়াটিয়া প্রতিষ্ঠান / Commercial Tenant):
প্রতিষ্ঠানের নাম: ${formData.businessName}
স্বত্বাধিকারী / এমডি: ${formData.proprietorName}
জাতীয় পরিচয়পত্র: ${formData.proprietorNid}
ই-টিন (e-TIN): ${formData.proprietorTin}
স্থায়ী ঠিকানা: ${formData.proprietorAddress}
মোবাইল: ${formData.proprietorPhone}

পরম করুণাময় মহান সৃষ্টিকর্তার নাম স্মরণ করিয়া অত্র বাণিজ্যিক চুক্তিপত্র সম্পাদন করা হইল:

১. তফসিল বর্ণিত সম্পত্তি:
${formData.cityCorporation}-এর আওতাধীন ${formData.propertyAddress}-এ অবস্থিত ভবনের ${formData.floorNo}-এ প্রায় ${formData.commercialAreaSqft} বর্গফুট আয়তনের বাণিজ্যিক স্পেস। বিদ্যুৎ মিটার নং: ${formData.meterNo}।

২. ভাড়ার মেয়াদ ও চুক্তি কাল:
অত্র চুক্তিপত্রের মেয়াদ আগামী ${formData.startDate} হইতে ${formData.endDate} পর্যন্ত মোট ${formData.leaseDurationYears} (${formData.leaseDurationYears === 3 ? "তিন" : formData.leaseDurationYears}) বৎসরের জন্য বলবৎ থাকিবে। ডেকোরেশন ও ফিট-আউটের জন্য ${formData.fitOutGraceDays} দিনের গ্রেস পিরিয়ড গণ্য হইবে।

৩. মাসিক ভাড়া ও সার্ভিস চার্জ:
(ক) বাণিজ্যিক স্পেসের মূল মাসিক ভাড়া: ৳ ${baseRent.toLocaleString("en-IN")}/- (কথায়: ${baseRent} টাকা মাত্র)।
(খ) মাসিক সার্ভিস চার্জ/কমন ইউটিলিটি: ৳ ${baseService.toLocaleString("en-IN")}/- টাকা।
(গ) প্রতি ইংরেজি মাসের ${formData.rentDueDay} তারিখের মধ্যে ভাড়াটিয়া ১ম পক্ষকে ব্যাংক একাউন্ট / ক্রস চেকের মাধ্যমে ভাড়া পরিশোধ করিবেন।

৪. জামানত / সিকিউরিটি ডিপোজিট:
২য় পক্ষ ১ম পক্ষকে এককালীন ৳ ${Number(formData.securityDeposit).toLocaleString("en-IN")}/- (কথায়: ${formData.securityDeposit} টাকা) অফেরতযোগ্য জামানত প্রদান করিলেন। চুক্তি সমাপনান্তে সকল ইউটিলিটি বিল ও পাওনা পরিশোধ সাপেক্ষে জামানতের অর্থ সম্পূর্ণ ফেরতযোগ্য হইবে।

৫. বাৎসরিক ভাড়া বৃদ্ধি (Rent Escalation):
প্রতি ১২ মাস পর পর মূল ভাড়ার উপর ${formData.annualIncrementPct}% হারে ভাড়া বৃদ্ধি পাইবে।

৬. বাণিজ্যিক বিধিনিষেধ ও শর্তাবলী:
(ক) উক্ত স্পেস শুধুমাত্র "${formData.businessType}" হিসেবে ব্যবহৃত হইবে। কোনো প্রকার অবৈধ, রাষ্ট্রবিরোধী বা পরিবেশ দূষণকারী কার্যক্রম পরিচালনা করা যাইবে না।
(খ) ১ম পক্ষের লিখিত অনুমতি ব্যতিরেকে অত্র বাণিজ্যিক স্পেস কোনো ৩য় পক্ষের নিকট সাবলেট বা হস্তান্তর (Sub-lease/Assignment) করা সম্পূর্ণ নিষিদ্ধ।
(গ) ফায়ার সার্ভিসের অগ্নিনির্বাপক সিলিন্ডার ও প্রাথমিক নিরাপত্তা ব্যবস্থা ২য় পক্ষ নিজ খরচে বজায় রাখিবেন।
(ঘ) নির্ধারিত স্থান ব্যতীত যত্রতত্র সাইনবোর্ড লাগানো যাইবে না এবং সিটি কর্পোরেশনের নির্ধারিত সাইনবোর্ড কর ২য় পক্ষ পরিশোধ করিবেন।

৭. চুক্তি বাতিল ও নোটিশ পিরিয়ড:
উভয় পক্ষের যেকেহ চুক্তি বাতিল করিতে চাহিলে অন্য পক্ষকে কমপক্ষে ${formData.noticePeriodMonths} (${formData.noticePeriodMonths === 3 ? "তিন" : "দুই"}) মাস পূর্বে লিখিত নোটিশ প্রদান করিবেন।

অত্র চুক্তিপত্রের শর্তাবলী আমরা উভয় পক্ষ পড়িয়া, বুঝিয়া ও সুস্থ মস্তিষ্কে সাক্ষীদের সম্মুখে স্বাক্ষর করিলাম।

১ম পক্ষের স্বাক্ষর (মালিক): _______________     ২য় পক্ষের স্বাক্ষর (ভাড়াটিয়া): _______________

সাক্ষীগণের স্বাক্ষর:
১. নাম ও স্বাক্ষর: _________________________     ২. নাম ও স্বাক্ষর: _________________________
  `.trim();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 px-6 py-4 border-b border-emerald-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Commercial Shop & Office Tenancy Hub
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  বাণিজ্যিক চুক্তি ও এনওসি
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Landlord Trade License NOC, Commercial Lease Deed, VDS (15% VAT) & TDS (5% Tax) Calculator
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
            onClick={() => setActiveTab("noc")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium border-b-2 transition ${
              activeTab === "noc"
                ? "border-emerald-400 text-emerald-300 bg-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Trade License NOC (অনাপত্তিপত্র)</span>
          </button>
          <button
            onClick={() => setActiveTab("deed")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium border-b-2 transition ${
              activeTab === "deed"
                ? "border-teal-400 text-teal-300 bg-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Commercial Deed (বাণিজ্যিক চুক্তিপত্র)</span>
          </button>
          <button
            onClick={() => setActiveTab("tax-calc")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium border-b-2 transition ${
              activeTab === "tax-calc"
                ? "border-amber-400 text-amber-300 bg-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>VAT & TDS Calculator (ভ্যাট ও কর)</span>
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium border-b-2 transition ${
              activeTab === "guide"
                ? "border-cyan-400 text-cyan-300 bg-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>City Corp & Signboard Guide</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Quick Input Bar across all tabs */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Commercial Tenancy Quick Profile (বাণিজ্যিক প্রতিষ্ঠানের মূল তথ্য)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Business Name (প্রতিষ্ঠানের নাম)</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange("businessName", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Business Nature / Type</label>
                <input
                  type="text"
                  value={formData.businessType}
                  onChange={(e) => handleInputChange("businessType", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Tenant / Proprietor Name</label>
                <input
                  type="text"
                  value={formData.proprietorName}
                  onChange={(e) => handleInputChange("proprietorName", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Landlord / Owner Name</label>
                <input
                  type="text"
                  value={formData.landlordName}
                  onChange={(e) => handleInputChange("landlordName", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Monthly Rent (৳)</label>
                <input
                  type="number"
                  value={formData.monthlyRent}
                  onChange={(e) => handleInputChange("monthlyRent", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Commercial Area (Sqft)</label>
                <input
                  type="text"
                  value={formData.commercialAreaSqft}
                  onChange={(e) => handleInputChange("commercialAreaSqft", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">City Corporation / Zone</label>
                <input
                  type="text"
                  value={formData.cityCorporation}
                  onChange={(e) => handleInputChange("cityCorporation", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Premises Location / Ward</label>
                <input
                  type="text"
                  value={formData.wardNo}
                  onChange={(e) => handleInputChange("wardNo", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* TAB 1: LANDLORD TRADE LICENSE NOC */}
          {activeTab === "noc" && (
            <div className="space-y-4">
              <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-200/90 leading-relaxed">
                  <strong>ট্রেড লাইসেন্স প্রাপ্তির সরকারি নিয়ম:</strong> ঢাকা উত্তর/দক্ষিণ সিটি কর্পোরেশন কিংবা যে কোনো পৌরসভায় নতুন ট্রেড লাইসেন্স বা নবায়নের আবেদনের সাথে বাড়িওয়ালার মূল অনাপত্তিপত্র (NOC), হোল্ডিং ট্যাক্স পরিশোধের রসিদ ও ৩০০ টাকার ভাড়াচুক্তিপত্রের কপি জমা দেওয়া বাধ্যতামূলক।
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-xs font-semibold text-slate-300">
                  অফিসিয়াল ট্রেড লাইসেন্স অনাপত্তিপত্র ড্রাফট (Ready for Print & Sign)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(nocTextBangla)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy NOC Text"}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shadow transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print NOC Letter</span>
                  </button>
                </div>
              </div>

              {/* NOC Preview Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
                {nocTextBangla}
              </div>
            </div>
          )}

          {/* TAB 2: COMMERCIAL DEED */}
          {activeTab === "deed" && (
            <div className="space-y-4">
              <div className="bg-teal-950/40 border border-teal-800/40 rounded-xl p-4 flex items-start gap-3">
                <Building2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div className="text-xs text-teal-200/90 leading-relaxed">
                  <strong>বাণিজ্যিক ভাড়াচুক্তিপত্রের প্রয়োজনীয়তা:</strong> আবাসিক ভাড়াচুক্তির তুলনায় বাণিজ্যিক স্পেসে বিদ্যুৎ লোড (Commercial Tariff), ডেকোরেশন সময়কাল, সাইনবোর্ড ফি এবং ভ্যাট কর্তনের স্পষ্ট ধারা থাকা আবশ্যক। এই চুক্তিটি ৩০০ টাকার নন-জুডিশিয়াল স্ট্যাম্পে নোটারি বা সাক্ষীদের উপস্থিতিতে স্বাক্ষর করতে হয়।
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-xs font-semibold text-slate-300">
                  ৩০০ টাকার নন-জুডিশিয়াল স্ট্যাম্প ফরম্যাট (Commercial Tenancy Deed)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(commercialDeedText)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy Deed"}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-semibold shadow transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Deed Draft</span>
                  </button>
                </div>
              </div>

              {/* Deed Preview Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
                {commercialDeedText}
              </div>
            </div>
          )}

          {/* TAB 3: VAT & TDS CALCULATOR */}
          {activeTab === "tax-calc" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Card 1: Gross & Base */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Monthly Base Rent</span>
                    <Store className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    ৳ {baseRent.toLocaleString("en-IN")}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Annual Rent: ৳ {annualBaseRent.toLocaleString("en-IN")}
                  </div>
                </div>

                {/* Card 2: 5% Commercial TDS (Income Tax Sec 89) */}
                <div className="bg-slate-950 border border-amber-900/40 rounded-xl p-4">
                  <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
                    <span>5% TDS (আয়কর কর্তন)</span>
                    <Landmark className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-amber-300">
                    ৳ {monthlyTds.toLocaleString("en-IN")}
                    <span className="text-xs font-normal text-slate-400 ml-1">/mo</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Annual TDS: ৳ {annualTds.toLocaleString("en-IN")} (NBR Code: 1-1141-XXXX)
                  </div>
                </div>

                {/* Card 3: 15% Commercial VDS (VAT Act 2012) */}
                <div className="bg-slate-950 border border-teal-900/40 rounded-xl p-4">
                  <div className="flex items-center justify-between text-xs text-teal-400 mb-1">
                    <span>15% VDS (উৎসে ভ্যাট)</span>
                    <BadgeDollarSign className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-2xl font-bold text-teal-300">
                    ৳ {monthlyVat.toLocaleString("en-IN")}
                    <span className="text-xs font-normal text-slate-400 ml-1">/mo</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Annual VDS: ৳ {annualVat.toLocaleString("en-IN")} (Mushak 6.3 / Treasury)
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Commercial Rent Withholding & Net Disbursement Schedule
                  </h4>
                  <span className="text-xs text-emerald-400 font-semibold">
                    Income Tax Act 2023 & VAT Act 2012 Compliant
                  </span>
                </div>
                <div className="p-4 space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-300 font-medium">Monthly Commercial Base Rent</span>
                    <span className="text-white font-semibold">৳ {baseRent.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60 text-amber-300">
                    <span>(-) 5% Tax Deducted at Source (TDS under Sec 89)</span>
                    <span>- ৳ {monthlyTds.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60 text-slate-400">
                    <span>(+) Building Service & Common Area Maintenance Charge</span>
                    <span>+ ৳ {baseService.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-slate-700 text-sm font-bold bg-slate-900/50 px-2 rounded">
                    <span className="text-emerald-300">Net Monthly Payable Directly to Landlord</span>
                    <span className="text-emerald-400">৳ {netPayableToLandlordWithholding.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60 text-teal-300">
                    <span>(+) 15% VAT (VDS) Deposit by Tenant to Govt Treasury (VAT Challan)</span>
                    <span>৳ {monthlyVat.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between py-1.5 text-slate-400 text-xs">
                    <span>Total Effective Monthly Outflow for Tenant Company</span>
                    <span className="font-semibold text-white">৳ {(grossMonthly + monthlyVat).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* NBR & VAT Compliance Note */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-2">
                <div className="font-semibold text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>গুরুত্বপূর্ণ উৎসে কর ও ভ্যাট নির্দেশিকা (NBR Withholding Rules):</span>
                </div>
                <p>
                  ১. <strong>আবাসিক ভাড়া:</strong> আবাসিক বাসা ভাড়ার ক্ষেত্রে কোনো ভ্যাট (০%) প্রযোজ্য নহে।
                </p>
                <p>
                  ২. <strong>বাণিজ্যিক প্রতিষ্ঠান/কোম্পানি ভাড়াটিয়া:</strong> ভাড়াটিয়া যদি লিমিটেড কোম্পানি, ব্যাংক বা নিবন্ধিত ব্যবসায়িক প্রতিষ্ঠান হয়, তবে তারা বাড়িওয়ালার মাসিক ভাড়া হইতে ৫% কর কর্তন করিয়া সরকারি ট্রেজারিতে চালান জমাপূর্বক চালানের কপি বাড়িওয়ালাকে প্রদান করিবে।
                </p>
                <p>
                  ৩. <strong>মূসক ৬.৩ চালান:</strong> বাণিজ্যিক ভাড়ার ১৫% ভ্যাট জমাদানের পর মূসক ৬.৩ দাখিল করিয়া উৎসে কর্তন সনদ (VDS Certificate) বাড়িওয়ালাকে হস্তান্তর করা বাধ্যতামূলক।
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: CITY CORP & SIGNBOARD GUIDE */}
          {activeTab === "guide" && (
            <div className="space-y-6">
              
              {/* Signboard Tax Calculator */}
              <div className="bg-slate-950 border border-cyan-900/40 rounded-xl p-5">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-4">
                  <Store className="w-4 h-4" />
                  <span>City Corporation Signboard & Billboard Fee Estimator (সাইনবোর্ড কর হিসাব)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-4">
                  <div>
                    <label className="text-slate-400 block mb-1">Signboard Width (Feet / দৈর্ঘ্য)</label>
                    <input
                      type="number"
                      value={formData.signboardWidthFt}
                      onChange={(e) => handleInputChange("signboardWidthFt", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Signboard Height (Feet / উচ্চতা)</label>
                    <input
                      type="number"
                      value={formData.signboardHeightFt}
                      onChange={(e) => handleInputChange("signboardHeightFt", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Signboard Type (আলোকিত/সাধারণ)</label>
                    <select
                      value={formData.signboardType}
                      onChange={(e) => handleInputChange("signboardType", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="regular">Non-illuminated / সাধারণ (৳ 80/sqft)</option>
                      <option value="illuminated">Illuminated / Neon / নিয়ন (৳ 150/sqft)</option>
                    </select>
                  </div>
                </div>

                {/* Signboard Output */}
                <div className="bg-cyan-950/30 border border-cyan-800/40 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-slate-400">Total Signboard Area</div>
                    <div className="text-lg font-bold text-white">{sbSqft} Sq. Ft.</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">City Corp Rate</div>
                    <div className="text-lg font-bold text-cyan-300">৳ {sbRatePerSqft} / sqft</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Estimated Annual Signboard Tax</div>
                    <div className="text-xl font-extrabold text-cyan-400">৳ {annualSignboardTax.toLocaleString("en-IN")} / year</div>
                  </div>
                </div>
              </div>

              {/* Trade License Fee Chart */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-emerald-400" />
                  <span>City Corporation Trade License Category Fees (আনুমানিক সরকারি ফি সূচি)</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-800">
                    <thead className="bg-slate-900 text-slate-300">
                      <tr>
                        <th className="p-2.5 border-b border-slate-800">Business Category (ব্যবসার ধরন)</th>
                        <th className="p-2.5 border-b border-slate-800">Govt Base Fee (সরকারি ফি)</th>
                        <th className="p-2.5 border-b border-slate-800">15% VAT</th>
                        <th className="p-2.5 border-b border-slate-800">Required NOC / Documents</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      <tr>
                        <td className="p-2.5 font-medium text-white">General Retail Shop / মুদি ও খুচরা দোকান</td>
                        <td className="p-2.5">৳ ১,০০০ – ২,৫০০</td>
                        <td className="p-2.5">৳ ১৫০ – ৩৭৫</td>
                        <td className="p-2.5">Landlord NOC, NID, Rent Deed</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-white">IT Firm / Software Agency / Freelance Studio</td>
                        <td className="p-2.5">৳ ২,৫০০ – ৫,০০০</td>
                        <td className="p-2.5">৳ ৩৭৫ – ৭৫০</td>
                        <td className="p-2.5">Landlord NOC, e-TIN, NID, Rent Deed</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-white">Restaurant / Cloud Kitchen / Food Cafe</td>
                        <td className="p-2.5">৳ ৫,০০০ – ১০,০০০</td>
                        <td className="p-2.5">৳ ৭৫০ – ১,৫০০</td>
                        <td className="p-2.5">NOC, Fire License, Sanitary Clearance</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-white">Corporate Commercial Office / Limited Co.</td>
                        <td className="p-2.5">৳ ৮,০০০ – ১৫,০০০</td>
                        <td className="p-2.5">৳ ১,২০০ – ২,২৫০</td>
                        <td className="p-2.5">NOC, Form XII, Mem-Arts, Holding Tax</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Basha Lagbe Legal Commercial Hub &bull; DNCC/DSCC & NBR Compliant</span>
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
