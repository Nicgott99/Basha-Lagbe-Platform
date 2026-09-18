import { useState, useMemo } from "react";
import {
  X,
  FileSignature,
  Printer,
  Copy,
  Check,
  Languages,
  ShieldAlert,
  Building,
  User,
  Calendar,
  DollarSign,
  FileText,
  Info,
  CheckCircle2,
  Sparkles
} from "lucide-react";

export default function TenancyAgreementGeneratorModal({ isOpen, onClose }) {
  const [lang, setLang] = useState("bn"); // "bn" | "en"
  const [activeTab, setActiveTab] = useState("form"); // "form" | "preview" | "stamp_guidelines"

  // ── Form State ───────────────────────────────────────────────────────
  // Landlord
  const [landlordName, setLandlordName] = useState("জনাব মো: রফিকুল ইসলাম");
  const [landlordFather, setLandlordFather] = useState("মরহুম আব্দুল করিম");
  const [landlordNid, setLandlordNid] = useState("19852691234567890");
  const [landlordPhone, setLandlordPhone] = useState("01711-223344");
  const [landlordAddress, setLandlordAddress] = useState("বাড়ি ১২, রোড ৩, ধানমন্ডি, ঢাকা-১২০৫");

  // Tenant
  const [tenantName, setTenantName] = useState("জনাব তানভীর আহমেদ");
  const [tenantFather, setTenantFather] = useState("জনাব মো: নুরুল হক");
  const [tenantNid, setTenantNid] = useState("19942699876543210");
  const [tenantPhone, setTenantPhone] = useState("01819-556677");
  const [tenantAddress, setTenantAddress] = useState("গ্রাম: শিবপুর, ডাকঘর: শিবপুর, জেলা: নরসিংদী");

  // Property Details
  const [propertyAddress, setPropertyAddress] = useState("ফ্ল্যাট ৪-বি (৪র্থ তলা), বাড়ি নং ৪৫, রোড নং ৭, সেক্টর ৪, উত্তরা, ঢাকা-১২৩০");
  const [propertyType, setPropertyType] = useState("আবাসিক (পারিবারিক)"); // Residential / Family
  const [startDate, setStartDate] = useState("০১ অক্টোবর ২০২৬");
  const [tenureYears, setTenureYears] = useState("২ (দুই)"); // 2 years

  // Financial Terms
  const [monthlyRent, setMonthlyRent] = useState(25000);
  const [advanceDeposit, setAdvanceDeposit] = useState(50000);
  const [payDueDay, setPayDueDay] = useState(10); // by 10th of every month
  const [noticePeriodMonths, setNoticePeriodMonths] = useState(2); // 2 months
  const [annualRentHike, setAnnualRentHike] = useState(10); // 10% after 1 year

  // Utilities responsibilities
  const [tenantPaysElectric, setTenantPaysElectric] = useState(true);
  const [tenantPaysGas, setTenantPaysGas] = useState(true);
  const [tenantPaysWater, setTenantPaysWater] = useState(true);
  const [tenantPaysServiceCharge, setTenantPaysServiceCharge] = useState(false);
  const [serviceChargeAmount, setServiceChargeAmount] = useState(2500);

  const [copied, setCopied] = useState(false);

  // Bengali numbers converter
  const toBn = (num) => {
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(num).replace(/[0-9]/g, (w) => bnDigits[+w]);
  };

  // Generate agreement text (Bengali)
  const agreementTextBn = useMemo(() => {
    return `
                       বিসমিল্লাহির রাহমানির রাহিম
                   বাড়ি / ফ্ল্যাট ভাড়ার চুক্তিপত্র দলিল
           (গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের নন-জুডিশিয়াল স্ট্যাম্পে ব্যবহার্য)

১ম পক্ষ (মালিক / বাড়িওয়ালা):
নাম: ${landlordName}
পিতা/স্বামীর নাম: ${landlordFather}
জাতীয় পরিচয়পত্র নং (NID): ${landlordNid}
মোবাইল নং: ${landlordPhone}
স্থায়ী ঠিকানা: ${landlordAddress}

                                বনাম

২য় পক্ষ (ভাড়াটিয়া):
নাম: ${tenantName}
পিতা/স্বামীর নাম: ${tenantFather}
জাতীয় পরিচয়পত্র নং (NID): ${tenantNid}
মোবাইল নং: ${tenantPhone}
স্থায়ী ঠিকানা: ${tenantAddress}

পরম করুণাময় মহান আল্লাহর নাম স্মরণ করিয়া আমরা উভয় পক্ষ সুস্থ মস্তিষ্কে, সজ্ঞানে, অন্যের বিনা প্ররোচনায় অত্র বাড়ি ভাড়ার চুক্তিপত্রে সম্মত হইয়া স্বাক্ষর করিতেছি:

তপশিল বর্ণিত ভাড়াকৃত সম্পত্তি:
${propertyAddress}। ব্যবহারিক উদ্দেশ্য: ${propertyType}।

শর্তাবলী:
১. চুক্তির মেয়াদ: অত্র চুক্তিপত্রের মেয়াদ আগামী ${startDate} খ্রি: তারিখ হইতে পরবর্তী ${toBn(tenureYears)} বৎসরের জন্য বলবৎ থাকিবে।
২. মাসিক ভাড়া: মাসিক বাড়ি ভাড়া বাবদ সর্বমোট =${toBn(monthlyRent)}/= (কথায়: ${toBn(monthlyRent)} টাকা) নির্ধারিত হইল।
৩. ভাড়া পরিশোধের সময়সীমা: প্রতি ইংরেজি মাসের ১ তারিখ হইতে ১০ তারিখের মধ্যে ২য় পক্ষ ১ম পক্ষকে পূর্ববর্তী মাসের ভাড়া পরিশোধ করিবেন এবং রসিদ গ্রহণ করিবেন।
৪. জামানত / অগ্রিম অর্থ: অত্র চুক্তি স্বাক্ষরকালে ২য় পক্ষ ১ম পক্ষকে জামানত বাবদ সর্বমোট =${toBn(advanceDeposit)}/= (কথায়: ${toBn(advanceDeposit)} টাকা) প্রদান করিলেন। এই জামানতের অর্থ সম্পূর্ণ ফেরতযোগ্য এবং ২য় পক্ষ ফ্ল্যাট ছাড়িয়া দেওয়ার সময় সমুদয় বকেয়া ও ক্ষতিপূরণ সমন্বয় করিয়া ১ম পক্ষ ২য় পক্ষকে ফেরত প্রদান করিবেন।
৫. ইউটিলিটি বিল: ফ্ল্যাটের ব্যবহৃত বিদ্যুৎ বিল ${tenantPaysElectric ? "(প্রিপেইড/পোস্টপেইড মিটারের বিল ২য় পক্ষ স্বউদ্যোগে পরিশোধ করিবেন)" : "১ম পক্ষ বহন করিবেন"}। তিতাস গ্যাস বিল ${tenantPaysGas ? "২য় পক্ষ বহন করিবেন" : "১ম পক্ষ বহন করিবেন"}। ওয়াসা পানির বিল ${tenantPaysWater ? "২য় পক্ষ বহন করিবেন" : "১ম পক্ষ বহন করিবেন"}। সার্ভিস চার্জ (${toBn(serviceChargeAmount)}/= টাকা) ${tenantPaysServiceCharge ? "২য় পক্ষ বহন করিবেন" : "১ম পক্ষ বহন করিবেন"}।
৬. নোটিশ পিরিয়ড: চুক্তির মেয়াদকালে যেকোনো পক্ষ বাড়ি ছাড়া বা ছাড়ানোর প্রয়োজন মনে করিলে অন্য পক্ষকে ন্যূনতম ${toBn(noticePeriodMonths)} (দুই) মাস পূর্বে লিখিত নোটিশ প্রদান করিতে বাধ্য থাকিবেন।
৭. ভাড়া বৃদ্ধি: চুক্তি সম্পাদনের ১ (এক) বৎসর অতিক্রান্ত হইবার পর পারস্পরিক সম্মতিক্রমে মাসিক ভাড়ার উপর অনধিক ${toBn(annualRentHike)}% ভাড়া বৃদ্ধি করা যাইতে পারে।
৮. সাবলেট ও হস্তান্তর নিষেধ: ২য় পক্ষ ভাড়াকৃত ফ্ল্যাট অন্য কাহারো নিকট সাবলেট দিতে পারিবেন না কিংবা ফ্ল্যাটের অভ্যন্তরে কোনো প্রকার অসামাজিক, বেআইনি বা বাণিজ্যিক কার্যক্রম পরিচালনা করিতে পারিবেন না।
৯. ডিএমপি ও পুলিশ ভেরিফিকেশন (CIMS): ঢাকা মেট্রোপলিটন পুলিশ (DMP) এর নিয়ম অনুযায়ী ২য় পক্ষ ফ্ল্যাটে উঠার ৭ দিনের মধ্যে নির্ধারিত ভাড়াটিয়া তথ্য ফরম (CIMS Form) পূরণ করিয়া সংশ্লিষ্ট থানায় জমা দিতে বাধ্য থাকিবেন।
১০. মেরামত ও রক্ষণাবেক্ষণ: ফ্ল্যাটের বড় ধরনের কাঠামোগত বা প্লাম্বিং ক্ষতি ১ম পক্ষ মেরামত করিবেন এবং ব্যবহারিক ক্ষুদ্র বাল্ব/ট্যাপ ইত্যাদি ২য় পক্ষ নিজ দায়িত্বে সচল রাখিবেন।

আমরা উভয় পক্ষ অত্র চুক্তিপত্রের সকল শর্ত মনোযোগ সহকারে পড়িয়া ও বুঝিয়া সুস্থ শরীরে স্বাক্ষীগণের সম্মুখে অত্র দলিলে স্বাক্ষর করিলাম।


-------------------------------------               -------------------------------------
১ম পক্ষের স্বাক্ষর (বাড়িওয়ালা)                          ২য় পক্ষের স্বাক্ষর (ভাড়াটিয়া)
তারিখ: .............................               তারিখ: .............................


সাক্ষীগণের স্বাক্ষর:
১. স্বাক্ষর: .......................................      ২. স্বাক্ষর: .......................................
   নাম: ...........................................         নাম: ...........................................
   NID / মোবাইল: .................................         NID / মোবাইল: .................................
    `.trim();
  }, [
    landlordName,
    landlordFather,
    landlordNid,
    landlordPhone,
    landlordAddress,
    tenantName,
    tenantFather,
    tenantNid,
    tenantPhone,
    tenantAddress,
    propertyAddress,
    propertyType,
    startDate,
    tenureYears,
    monthlyRent,
    advanceDeposit,
    payDueDay,
    noticePeriodMonths,
    annualRentHike,
    tenantPaysElectric,
    tenantPaysGas,
    tenantPaysWater,
    tenantPaysServiceCharge,
    serviceChargeAmount,
  ]);

  // Generate agreement text (English)
  const agreementTextEn = useMemo(() => {
    return `
                     RESIDENTIAL TENANCY AGREEMENT DEED
       (Suitable for execution on Non-Judicial Stamp Paper under Bangladesh Laws)

1ST PARTY (LANDLORD / PROPERTY OWNER):
Name: ${landlordName}
Father's / Husband's Name: ${landlordFather}
National ID (NID): ${landlordNid}
Phone: ${landlordPhone}
Permanent Address: ${landlordAddress}

                               VERSUS

2ND PARTY (TENANT):
Name: ${tenantName}
Father's / Husband's Name: ${tenantFather}
National ID (NID): ${tenantNid}
Phone: ${tenantPhone}
Permanent Address: ${tenantAddress}

SCHEDULE OF DEMISED PREMISES:
${propertyAddress}. Purpose: ${propertyType}.

TERMS AND CONDITIONS:
1. TENANCY TENURE: This agreement is valid for a period of ${tenureYears} year(s) commencing on ${startDate}.
2. MONTHLY RENT: The agreed monthly rent shall be BDT ${monthlyRent.toLocaleString()}/- (Taka).
3. PAYMENT TIMELINE: The 2nd Party shall pay the monthly rent to the 1st Party between the 1st and ${payDueDay}th day of each calendar month and obtain a money receipt.
4. SECURITY DEPOSIT / ADVANCE: The 2nd Party pays an advance security deposit of BDT ${advanceDeposit.toLocaleString()}/- upon signing. This amount is refundable upon vacating the premises, subject to deduction of outstanding utility bills or damage repairs.
5. UTILITIES & BILLS: Electricity ${tenantPaysElectric ? "(Prepaid/Postpaid meter by 2nd Party)" : "(Paid by Landlord)"}, Gas ${tenantPaysGas ? "(Paid by Tenant)" : "(Paid by Landlord)"}, Water WASA ${tenantPaysWater ? "(Paid by Tenant)" : "(Paid by Landlord)"}, Building Service Charge (BDT ${serviceChargeAmount}) ${tenantPaysServiceCharge ? "(Paid by Tenant)" : "(Paid by Landlord)"}.
6. NOTICE PERIOD: Either party intending to terminate this agreement shall serve at least ${noticePeriodMonths} months prior written notice to the other party.
7. RENT REVISION: Rent may be revised by mutual consent up to ${annualRentHike}% after completion of 1 year.
8. SUBLETTING RESTRICTION: Subletting, assignment, or unauthorized commercial use of the demised flat without written consent is strictly prohibited.
9. DMP POLICE VERIFICATION (CIMS): The 2nd Party is legally obliged to submit the DMP Tenant Information Verification Form (CIMS) to the local Police Station within 7 days of moving in.
10. MAINTENANCE: Landlord shall address structural/major plumbing defects; tenant shall maintain daily consumable fittings in working condition.

IN WITNESS WHEREOF, the parties hereto have executed this Tenancy Deed on the date mentioned below in the presence of witnesses.


___________________________                         ___________________________
Signature of 1st Party (Landlord)                   Signature of 2nd Party (Tenant)
Date: .....................                         Date: .....................


WITNESSES:
1. Signature: .............................         2. Signature: .............................
   Name: ..................................            Name: ..................................
   NID/Phone: .............................            NID/Phone: .............................
    `.trim();
  }, [
    landlordName,
    landlordFather,
    landlordNid,
    landlordPhone,
    landlordAddress,
    tenantName,
    tenantFather,
    tenantNid,
    tenantPhone,
    tenantAddress,
    propertyAddress,
    propertyType,
    startDate,
    tenureYears,
    monthlyRent,
    advanceDeposit,
    payDueDay,
    noticePeriodMonths,
    annualRentHike,
    tenantPaysElectric,
    tenantPaysGas,
    tenantPaysWater,
    tenantPaysServiceCharge,
    serviceChargeAmount,
  ]);

  const currentAgreementText = lang === "bn" ? agreementTextBn : agreementTextEn;

  const handleCopyAgreement = () => {
    navigator.clipboard.writeText(currentAgreementText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tenancy Agreement - Basha Lagbe</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 20mm 15mm 20mm 15mm;
            }
            body {
              font-family: 'SolaimanLipi', 'Nikosh', 'Kalpurush', 'Times New Roman', serif;
              font-size: 13pt;
              line-height: 1.6;
              color: #111;
              white-space: pre-wrap;
              margin: 0;
              padding: 20px;
            }
            .header-space {
              height: 60px; /* Space for non-judicial stamp header if printing on stamp */
            }
          </style>
        </head>
        <body>
          <div class="header-space"></div>
          <div>${currentAgreementText}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
              <FileSignature className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                Tenancy Legal Agreement Deed (চুক্তিপত্র)
                <span className="hidden sm:inline-block text-xs bg-yellow-400 text-purple-950 font-bold px-2 py-0.5 rounded-full">
                  BD Stamp Formatter
                </span>
              </h2>
              <p className="text-xs text-purple-100">
                Customizable Bangladesh house rent deed ready for 300 Taka non-judicial stamp printing
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

        {/* Tab & Language Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 px-4 pt-2 shrink-0">
          <div className="flex overflow-x-auto no-scrollbar">
            {[
              { id: "form", label: "Edit Agreement Terms", icon: FileText },
              { id: "preview", label: "Deed Preview", icon: FileSignature },
              { id: "stamp_guidelines", label: "300 Tk Stamp Guidelines", icon: ShieldAlert },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2.5 px-4 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? "border-purple-600 text-purple-600 dark:text-purple-400 font-semibold"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-purple-600 dark:text-purple-400" : "text-gray-400"}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-1.5 pb-2 sm:pb-0">
            <Languages className="w-4 h-4 text-gray-500" />
            <div className="bg-gray-200 dark:bg-gray-700 p-0.5 rounded-lg flex text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLang("bn")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  lang === "bn"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900"
                }`}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  lang === "en"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900"
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* TAB 1: FORM INPUTS */}
          {activeTab === "form" && (
            <div className="space-y-5">
              {/* Landlord & Tenant Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1st Party Landlord */}
                <div className="bg-purple-50/40 dark:bg-purple-950/20 p-4 rounded-xl border border-purple-100 dark:border-purple-900/40 space-y-3 text-xs">
                  <h3 className="font-bold text-sm text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-purple-600" />
                    ১ম পক্ষ (বাড়িওয়ালা / Landlord)
                  </h3>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">পূর্ণ নাম</label>
                    <input
                      type="text"
                      value={landlordName}
                      onChange={(e) => setLandlordName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">পিতা / স্বামীর নাম</label>
                    <input
                      type="text"
                      value={landlordFather}
                      onChange={(e) => setLandlordFather(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-gray-600 dark:text-gray-400 block mb-1">NID নাম্বার</label>
                      <input
                        type="text"
                        value={landlordNid}
                        onChange={(e) => setLandlordNid(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-400 block mb-1">মোবাইল</label>
                      <input
                        type="text"
                        value={landlordPhone}
                        onChange={(e) => setLandlordPhone(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">স্থায়ী ঠিকানা</label>
                    <input
                      type="text"
                      value={landlordAddress}
                      onChange={(e) => setLandlordAddress(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                </div>

                {/* 2nd Party Tenant */}
                <div className="bg-blue-50/40 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/40 space-y-3 text-xs">
                  <h3 className="font-bold text-sm text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-600" />
                    ২য় পক্ষ (ভাড়াটিয়া / Tenant)
                  </h3>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">পূর্ণ নাম</label>
                    <input
                      type="text"
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">পিতা / স্বামীর নাম</label>
                    <input
                      type="text"
                      value={tenantFather}
                      onChange={(e) => setTenantFather(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-gray-600 dark:text-gray-400 block mb-1">NID নাম্বার</label>
                      <input
                        type="text"
                        value={tenantNid}
                        onChange={(e) => setTenantNid(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-400 block mb-1">মোবাইল</label>
                      <input
                        type="text"
                        value={tenantPhone}
                        onChange={(e) => setTenantPhone(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">স্থায়ী ঠিকানা</label>
                    <input
                      type="text"
                      value={tenantAddress}
                      onChange={(e) => setTenantAddress(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Property Particulars & Financial Terms */}
              <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3 text-xs">
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-purple-600" />
                  ভাড়া সংক্রান্ত বিবরণী ও আর্থিক শর্তাবলী
                </h3>

                <div>
                  <label className="text-gray-600 dark:text-gray-400 block mb-1">ভাড়াকৃত ফ্ল্যাট / বাড়ির পূর্ণ ঠিকানা</label>
                  <input
                    type="text"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">মাসিক বাড়ি ভাড়া (BDT)</label>
                    <input
                      type="number"
                      step="500"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 font-bold text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">জামানত / অগ্রিম (BDT)</label>
                    <input
                      type="number"
                      step="1000"
                      value={advanceDeposit}
                      onChange={(e) => setAdvanceDeposit(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 font-bold text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">চুক্তি শুরুর তারিখ</label>
                    <input
                      type="text"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                </div>

                {/* Utility Checkboxes */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                    ২য় পক্ষ (ভাড়াটিয়া) কর্তৃক প্রদেয় বিলসমূহ:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tenantPaysElectric}
                        onChange={(e) => setTenantPaysElectric(e.target.checked)}
                        className="rounded text-purple-600"
                      />
                      <span>বিদ্যুৎ বিল</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tenantPaysGas}
                        onChange={(e) => setTenantPaysGas(e.target.checked)}
                        className="rounded text-purple-600"
                      />
                      <span>গ্যাস বিল</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tenantPaysWater}
                        onChange={(e) => setTenantPaysWater(e.target.checked)}
                        className="rounded text-purple-600"
                      />
                      <span>ওয়াসা পানির বিল</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tenantPaysServiceCharge}
                        onChange={(e) => setTenantPaysServiceCharge(e.target.checked)}
                        className="rounded text-purple-600"
                      />
                      <span>সার্ভিস চার্জ</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AGREEMENT DEED PREVIEW */}
          {activeTab === "preview" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-purple-50 dark:bg-purple-950/40 p-3 rounded-xl border border-purple-200 dark:border-purple-800 text-xs">
                <span className="text-purple-900 dark:text-purple-200 font-medium">
                  📄 এই দলিলটি নন-জুডিশিয়াল স্ট্যাম্পে প্রিন্ট করার জন্য সম্পূর্ণ উপযোগী।
                </span>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Deed
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-xl border border-gray-300 dark:border-gray-800 font-mono text-xs leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap shadow-inner max-h-[50vh] overflow-y-auto">
                {currentAgreementText}
              </div>
            </div>
          )}

          {/* TAB 3: 300 TK STAMP GUIDELINES */}
          {activeTab === "stamp_guidelines" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-purple-50/60 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-900 space-y-2">
                <div className="font-bold text-purple-950 dark:text-purple-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  ১. ৩০০ টাকার নন-জুডিশিয়াল স্ট্যাম্প বিধি
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                  বাংলাদেশ স্ট্যাম্প আইন ও দেওয়ানি আদালত অনুযায়ী আবাসিক বাড়ি ভাড়ার চুক্তি আইনত কার্যকর করতে মোট ৩০০ টাকার নন-জুডিশিয়াল স্ট্যাম্পে (যেমন ১০০ টাকার ৩টি স্ট্যাম্প) প্রিন্ট বা টাইপ করা বাধ্যতামূলক।
                </p>
              </div>

              <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900 space-y-2">
                <div className="font-bold text-blue-950 dark:text-blue-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  ২. প্রিন্ট মার্জিন ও স্পেসিং নির্দেশনা
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                  স্ট্যাম্প কাগজের উপরিভাগে বাংলাদেশ সরকারের সিল ও জলছাপ থাকায় প্রথম পাতায় উপর থেকে কমপক্ষে ৩.৫ থেকে ৪ ইঞ্চি জায়গা খালি রেখে নিচে চুক্তিপত্রের বিষয়বস্তু প্রিন্ট করতে হবে।
                </p>
              </div>

              <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900 space-y-2">
                <div className="font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ৩. সাক্ষী ও নোটারি পাবলিক সত্যায়ন
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                  উভয় পক্ষের পরিচিত অন্তত দুইজন প্রাপ্তবয়স্ক সাক্ষীর নাম, জাতীয় পরিচয়পত্র ও ফোন নম্বরসহ স্বাক্ষর থাকতে হবে। প্রয়োজনে নিকটস্থ কোর্ট থেকে নোটারি পাবলিক (Notary Public) সত্যায়ন করে নেওয়া যায়।
                </p>
              </div>

              <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900 space-y-2">
                <div className="font-bold text-amber-950 dark:text-amber-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  ৪. জামানত ফেরত ও অগ্রিম সমন্বয় ক্লজ
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                  ভাড়া ছাড়ার সময় জামানতের টাকা যেন অহেতুক আটকে না রাখা হয়, সেজন্য চুক্তিতে স্পষ্ট উল্লেখ করা হয়েছে যে ২ মাসের নোটিশ দিয়ে ফ্ল্যাট খালি করার দিনই সমুদয় অবশিষ্ট জামানত ফেরত দিতে হবে।
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-purple-500" />
            <span>Structured in accordance with Bangladesh Premises Rent Control Act 1991</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCopyAgreement}
              className="px-4 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy Text"}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
