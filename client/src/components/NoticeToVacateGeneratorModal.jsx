import { useState, useMemo } from "react";
import {
  X,
  Mail,
  Printer,
  Copy,
  Check,
  Languages,
  Calendar,
  Building,
  User,
  DollarSign,
  FileCheck,
  CheckCircle2,
  Info,
  ShieldCheck,
  AlertTriangle,
  ArrowRight
} from "lucide-react";

export default function NoticeToVacateGeneratorModal({ isOpen, onClose }) {
  const [lang, setLang] = useState("bn"); // "bn" | "en"
  const [activeTab, setActiveTab] = useState("form"); // "form" | "preview" | "legal_rules"

  // Notice Type: "tenant_vacate" | "landlord_vacate" | "deposit_refund" | "handover_clearance"
  const [noticeType, setNoticeType] = useState("tenant_vacate");

  // Dates
  const [noticeDate, setNoticeDate] = useState("০১ সেপ্টেম্বর ২০২৬");
  const [moveOutDate, setMoveOutDate] = useState("৩১ অক্টোবর ২০২৬");
  const [noticePeriodText, setNoticePeriodText] = useState("২ (দুই) মাস");

  // Parties
  const [landlordName, setLandlordName] = useState("জনাব মো: রফিকুল ইসলাম");
  const [landlordPhone, setLandlordPhone] = useState("01711-223344");
  const [landlordAddress, setLandlordAddress] = useState("বাড়ি ১২, রোড ৩, ধানমন্ডি, ঢাকা-১২০৫");

  const [tenantName, setTenantName] = useState("জনাব তানভীর আহমেদ");
  const [tenantPhone, setTenantPhone] = useState("01819-556677");
  const [tenantAddress, setTenantAddress] = useState("ফ্ল্যাট ৪-বি, বাড়ি ৪৫, রোড ৭, সেক্টর ৪, উত্তরা, ঢাকা");

  // Property Particulars
  const [propertyAddress, setPropertyAddress] = useState("ফ্ল্যাট নং ৪-বি (৪র্থ তলা), বাড়ি নং ৪৫, রোড নং ৭, সেক্টর ৪, উত্তরা, ঢাকা-১২৩০");
  
  // Financials
  const [monthlyRent, setMonthlyRent] = useState(25000);
  const [depositAmount, setDepositAmount] = useState(50000);
  const [reasonText, setReasonText] = useState("কর্মস্থলের নিকটবর্তী স্থানে পরিবারসহ স্থায়ীভাবে স্থানান্তরের কারণে");

  const [copied, setCopied] = useState(false);

  // Bengali numbers converter
  const toBn = (num) => {
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(num).replace(/[0-9]/g, (w) => bnDigits[+w]);
  };

  // Bengali Letter Content Generator
  const noticeTextBn = useMemo(() => {
    if (noticeType === "tenant_vacate") {
      return `
তারিখ: ${noticeDate}

বরাবর,
${landlordName} (বাড়িওয়ালা)
${landlordAddress}
মোবাইল: ${landlordPhone}

বিষয়: আগামী ${moveOutDate} তারিখের মধ্যে ফ্ল্যাট ছাড়িয়া দেওয়ার ${noticePeriodText} পূর্বের লিখিত নোটিশ।

জনাব,
যথাবিহিত সম্মান প্রদর্শনপূর্বক বিনীত নিবেদন এই যে, আমি আপনার মালিকানাধীন "${propertyAddress}" বর্ণিত ফ্ল্যাটে নিয়মিত মাসিক ভাড়া প্রদানপূর্বক বসবাস করিয়া আসিতেছি।

${reasonText} আগামী ${moveOutDate} খ্রি: তারিখের মধ্যে বর্ণিত ফ্ল্যাটটি ছাড়িয়া দেওয়ার সিদ্ধান্ত গ্রহণ করিয়াছি। আমাদের স্বাক্ষরিত বাড়ি ভাড়ার চুক্তিপত্র মোতাবেক আপনাকে ২ (দুই) মাস পূর্বে অত্র লিখিত নোটিশের মাধ্যমে আনুষ্ঠানিকভাবে অবহিত করিতেছি।

অতএব, জনাবের নিকট বিনীত অনুরোধ, আগামী ${moveOutDate} খ্রি: তারিখে ফ্ল্যাটটির চাবি বুঝিয়া নিবেন এবং আমার জমাকৃত অগ্রিম জামানতের অর্থ =${toBn(depositAmount)}/= (কথায়: ${toBn(depositAmount)} টাকা) সমুদয় বকেয়া বিল সমন্বয়পূর্বক ফ্ল্যাট হস্তান্তরের দিন আমাকে ফেরত প্রদানের প্রয়োজনীয় ব্যবস্থা গ্রহণ করিতে মর্জি হয়।


বিনীত নিবেদক,
(ভাড়াটিয়া)

-------------------------------------
${tenantName}
মোবাইল: ${tenantPhone}
ফ্ল্যাট: ${propertyAddress}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ বাড়িওয়ালার প্রাপ্তিস্বীকার রসিদ ]
অত্র নোটিশের একটি অনুলিপি বুঝিয়া পাইলাম:
বাড়িওয়ালার স্বাক্ষর ও তারিখ: .......................................
      `.trim();
    }

    if (noticeType === "landlord_vacate") {
      return `
তারিখ: ${noticeDate}

বরাবর,
${tenantName} (ভাড়াটিয়া)
${tenantAddress}
মোবাইল: ${tenantPhone}

বিষয়: আগামী ${moveOutDate} তারিখের মধ্যে ফ্ল্যাট খালি করিয়া দেওয়ার লিখিত নোটিশ।

জনাব,
যথাবিহিত সম্মান প্রদর্শনপূর্বক জানানো যাইতেছে যে, আপনি আমার মালিকানাধীন "${propertyAddress}" বর্ণিত ফ্ল্যাটে ভাড়াটিয়া হিসাবে বসবাস করিতেছেন।

${reasonText} আগামী ${moveOutDate} খ্রি: তারিখ হইতে আমার উক্ত ফ্ল্যাটটির একান্ত নিজস্ব প্রয়োজন দেখা দেওয়ায় অত্র লিখিত নোটিশের মাধ্যমে আপনাকে অবগত করা যাইতেছে।

অতএব, আগামী ${moveOutDate} খ্রি: তারিখের মধ্যে ফ্ল্যাটের বিদ্যুৎ, গ্যাস, ওয়াসা ও সার্ভিস চার্জের যাবতীয় বকেয়া বিল পরিশোধপূর্বক ফ্ল্যাটটির দখল ও চাবি আমার নিকট হস্তান্তর করিবেন। আপনার জমাকৃত জামানতের অর্থ =${toBn(depositAmount)}/= টাকা সমুদয় হিসাব সমন্বয়পূর্বক ফ্ল্যাট হস্তান্তরের দিন ফেরত প্রদান করা হইবে।


ধন্যবাদান্তে,
(বাড়িওয়ালা / ফ্ল্যাট মালিক)

-------------------------------------
${landlordName}
মোবাইল: ${landlordPhone}
ঠিকানা: ${landlordAddress}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ভাড়াটিয়ার প্রাপ্তিস্বীকার রসিদ ]
অত্র নোটিশের একটি অনুলিপি বুঝিয়া পাইলাম:
ভাড়াটিয়ার স্বাক্ষর ও তারিখ: .......................................
      `.trim();
    }

    if (noticeType === "deposit_refund") {
      return `
তারিখ: ${noticeDate}

বরাবর,
${landlordName} (বাড়িওয়ালা)
${landlordAddress}
মোবাইল: ${landlordPhone}

বিষয়: ফ্ল্যাট ছাড়ার পর জমাকৃত জামানতের অর্থ =${toBn(depositAmount)}/= টাকা ফেরতের তাগিদ নোটিশ।

জনাব,
বিনীত নিবেদন এই যে, আমি আপনার মালিকানাধীন "${propertyAddress}" বর্ণিত ফ্ল্যাটটি বিগত ${moveOutDate} তারিখে যাবতীয় ইউটিলিটি বিল পরিশোধ ও চাবি বুঝিয়ে দিয়ে খালি করিয়া দিয়াছি।

কিন্তু অত্যন্ত পরিতাপের বিষয়, চুক্তি অনুযায়ী ফ্ল্যাট ছাড়ার সময় আমার জমাকৃত অগ্রিম জামানতের =${toBn(depositAmount)}/= (কথায়: ${toBn(depositAmount)} টাকা) অদ্যবধি ফেরত প্রদান করা হয় নাই।

অতএব, অত্র নোটিশ প্রাপ্তির আগামী ৭ (সাত) কার্যদিবসের মধ্যে আমার জামানতের সম্পূর্ণ অর্থ নিম্নোক্ত মাধ্যমে পরিশোধের অনুরোধ জানাইতেছি, অন্যথায় দেশের প্রচলিত বাড়ি ভাড়া নিয়ন্ত্রণ আইন অনুযায়ী আইনগত পদক্ষেপ গ্রহণে বাধ্য হইব।


বিনীত নিবেদক,
-------------------------------------
${tenantName}
মোবাইল: ${tenantPhone}
      `.trim();
    }

    // Handover & Clearance Certificate
    return `
                       ফ্ল্যাট হস্তান্তর ও চাবি বুঝিয়ে দেওয়ার প্রত্যয়নপত্র
               (Mutual Handover & Security Deposit Clearance Certificate)

তারিখ: ${noticeDate}
ভাড়াকৃত সম্পত্তি: ${propertyAddress}

আমরা উভয় পক্ষ ১ম পক্ষ (বাড়িওয়ালা: ${landlordName}) এবং ২য় পক্ষ (ভাড়াটিয়া: ${tenantName}) এই মর্মে একমত হইতেছি যে:

১. ২য় পক্ষ বিগত ${noticeDate} তারিখে ভাড়াকৃত ফ্ল্যাটটি পরিষ্কার-পরিচ্ছন্ন অবস্থায় ১ম পক্ষকে চাবি বুঝিয়ে দিয়েছেন।
২. ফ্ল্যাটের বিদ্যুৎ (প্রিপেইড/মিটার রিডিং), ওয়াসা, গ্যাস ও সার্ভিস চার্জ বাবদ কোনো বকেয়া পাওনা নাই।
৩. ১ম পক্ষ ২য় পক্ষের জমাকৃত জামানতের অর্থ =${toBn(depositAmount)}/= টাকার মধ্যে সমুদয় সমন্বয় শেষে অবশিষ্ট =${toBn(depositAmount)}/= টাকা ২য় পক্ষকে সম্পূর্ণভাবে পরিশোধ করিয়া বুঝাইয়া দিলেন।
৪. অদ্য হইতে উক্ত ফ্ল্যাট ভাড়া সংক্রান্তে উভয় পক্ষের মধ্যে আর কোনো প্রকার আর্থিক বা আইনগত দাবি-দাওয়া অবশিষ্ট রহিল না।


-------------------------------------               -------------------------------------
১ম পক্ষের স্বাক্ষর (বাড়িওয়ালা)                          ২য় পক্ষের স্বাক্ষর (ভাড়াটিয়া)
তারিখ: .............................               তারিখ: .............................
    `.trim();
  }, [
    noticeType,
    noticeDate,
    moveOutDate,
    noticePeriodText,
    landlordName,
    landlordPhone,
    landlordAddress,
    tenantName,
    tenantPhone,
    tenantAddress,
    propertyAddress,
    monthlyRent,
    depositAmount,
    reasonText,
  ]);

  // English Letter Content Generator
  const noticeTextEn = useMemo(() => {
    if (noticeType === "tenant_vacate") {
      return `
Date: ${noticeDate}

To:
${landlordName} (Landlord)
${landlordAddress}
Phone: ${landlordPhone}

SUBJECT: 2-MONTH FORMAL WRITTEN NOTICE TO VACATE DEMISED PREMISES ON OR BEFORE ${moveOutDate}.

Dear Sir/Madam,
I am writing to formally notify you that I will be vacating the demised apartment situated at "${propertyAddress}" on or before ${moveOutDate}.

This letter serves as my formal 2 (two) months prior written notice as stipulated under our Tenancy Agreement and the Bangladesh Premises Rent Control Act 1991.

Reason for moving: ${reasonText}.

Kindly arrange for the final property walkthrough and handover on ${moveOutDate}. I request the full refund of my refundable security deposit of BDT ${depositAmount.toLocaleString()}/- on the date of handover, subject to final utility bill adjustments.


Sincerely yours,
(Tenant)

___________________________
${tenantName}
Phone: ${tenantPhone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ LANDLORD ACKNOWLEDGMENT RECEIPT ]
Received copy of this Notice:
Landlord Signature & Date: .......................................
      `.trim();
    }

    if (noticeType === "landlord_vacate") {
      return `
Date: ${noticeDate}

To:
${tenantName} (Tenant)
${tenantAddress}
Phone: ${tenantPhone}

SUBJECT: FORMAL NOTICE TO VACATE PREMISES ON OR BEFORE ${moveOutDate}.

Dear Sir/Madam,
Please be informed that you are required to vacate and deliver peaceful vacant possession of the premises situated at "${propertyAddress}" on or before ${moveOutDate}.

Reason: ${reasonText}.

Please ensure all utility dues (Electricity, WASA, Gas, Service Charge) are cleared up to the date of departure. Your refundable security deposit of BDT ${depositAmount.toLocaleString()}/- shall be refunded on the day of key handover upon mutual inspection.


Sincerely,
(Landlord / Property Owner)

___________________________
${landlordName}
Phone: ${landlordPhone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ TENANT ACKNOWLEDGMENT RECEIPT ]
Received copy of this Notice:
Tenant Signature & Date: .......................................
      `.trim();
    }

    if (noticeType === "deposit_refund") {
      return `
Date: ${noticeDate}

To:
${landlordName} (Landlord)
${landlordAddress}
Phone: ${landlordPhone}

SUBJECT: FORMAL DEMAND FOR REFUND OF SECURITY DEPOSIT (BDT ${depositAmount.toLocaleString()}/-).

Dear Sir/Madam,
I vacated and handed over the keys to your apartment at "${propertyAddress}" on ${moveOutDate} with all utilities fully cleared.

However, the refundable security deposit of BDT ${depositAmount.toLocaleString()}/- has not yet been refunded as agreed.

Kindly disburse the pending amount within 7 (seven) business days, failing which I shall be constrained to initiate legal recovery proceedings under the Bangladesh Premises Rent Control Act.


Sincerely yours,
___________________________
${tenantName}
Phone: ${tenantPhone}
      `.trim();
    }

    // Clearance Certificate
    return `
              MUTUAL PROPERTY HANDOVER & SECURITY DEPOSIT CLEARANCE CERTIFICATE

Date: ${noticeDate}
Demised Property: ${propertyAddress}

It is hereby mutually certified between Landlord (${landlordName}) and Tenant (${tenantName}) that:

1. The tenant has delivered full vacant possession and keys of the flat in good condition on ${noticeDate}.
2. All utility bills (Prepaid electricity, WASA, Gas, Service charges) stand fully cleared.
3. The landlord has refunded the full security deposit of BDT ${depositAmount.toLocaleString()}/- to the tenant.
4. Neither party has any further claims or outstanding dues against each other.


___________________________                         ___________________________
Landlord Signature & Date                           Tenant Signature & Date
    `.trim();
  }, [
    noticeType,
    noticeDate,
    moveOutDate,
    landlordName,
    landlordPhone,
    landlordAddress,
    tenantName,
    tenantPhone,
    tenantAddress,
    propertyAddress,
    depositAmount,
    reasonText,
  ]);

  const currentNoticeText = lang === "bn" ? noticeTextBn : noticeTextEn;

  const handleCopyNotice = () => {
    navigator.clipboard.writeText(currentNoticeText);
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
          <title>Tenancy Notice - Basha Lagbe</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 20mm 15mm 20mm 15mm;
            }
            body {
              font-family: 'SolaimanLipi', 'Nikosh', 'Kalpurush', 'Times New Roman', serif;
              font-size: 12pt;
              line-height: 1.6;
              color: #111;
              white-space: pre-wrap;
              margin: 0;
              padding: 20px;
            }
          </style>
        </head>
        <body>
          <div>${currentNoticeText}</div>
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
        <div className="px-6 py-4 bg-gradient-to-r from-amber-700 via-orange-700 to-red-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
              <Mail className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                Notice to Vacate & Deposit Settlement Hub
                <span className="hidden sm:inline-block text-xs bg-yellow-400 text-amber-950 font-bold px-2 py-0.5 rounded-full">
                  বাসা ছাড়ার নোটিশ
                </span>
              </h2>
              <p className="text-xs text-amber-100">
                Official written notices for tenant moving out, landlord termination, and security deposit refund clearance
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

        {/* Tab & Language Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 px-4 pt-2 shrink-0">
          <div className="flex overflow-x-auto no-scrollbar">
            {[
              { id: "form", label: "Edit Notice & Terms", icon: FileCheck },
              { id: "preview", label: "Formal Letter Preview", icon: Mail },
              { id: "legal_rules", label: "BD Notice & Deposit Laws", icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2.5 px-4 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? "border-amber-600 text-amber-600 dark:text-amber-400 font-semibold"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-amber-600 dark:text-amber-400" : "text-gray-400"}`} />
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
                    ? "bg-amber-600 text-white shadow-sm"
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
                    ? "bg-amber-600 text-white shadow-sm"
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
            <div className="space-y-5 text-xs">
              {/* Notice Type Selector */}
              <div className="bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 space-y-3">
                <h3 className="font-bold text-sm text-amber-950 dark:text-amber-200 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-600" />
                  ১. নোটিশের ধরন নির্বাচন করুন / Select Notice Category
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: "tenant_vacate", label: "ভাড়াটিয়া কর্তৃক বাসা ছাড়ার নোটিশ", sub: "Tenant 2-Month Notice to Vacate" },
                    { id: "landlord_vacate", label: "বাড়িওয়ালা কর্তৃক ফ্ল্যাট খালি করার নোটিশ", sub: "Landlord Notice to Terminate" },
                    { id: "deposit_refund", label: "জামানত অর্থ ফেরতের তাগিদ নোটিশ", sub: "Security Deposit Refund Demand Letter" },
                    { id: "handover_clearance", label: "হস্তান্তর ও চাবি বুঝিয়ে দেওয়ার প্রত্যয়ন", sub: "Mutual Key & Bill Clearance Certificate" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setNoticeType(t.id)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        noticeType === t.id
                          ? "bg-amber-100/70 dark:bg-amber-900/40 border-amber-600 ring-1 ring-amber-600 font-semibold"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-gray-900 dark:text-gray-100 flex items-center justify-between">
                        {t.label}
                        {noticeType === t.id && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{t.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates & Reason */}
              <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  ২. নোটিশের তারিখ ও সময়সীমা
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">নোটিশ প্রদানের তারিখ</label>
                    <input
                      type="text"
                      value={noticeDate}
                      onChange={(e) => setNoticeDate(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">ফ্ল্যাট ছাড়ার চূড়ান্ত তারিখ (Move-Out)</label>
                    <input
                      type="text"
                      value={moveOutDate}
                      onChange={(e) => setMoveOutDate(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">জামানতের পরিমাণ (BDT ৳)</label>
                    <input
                      type="number"
                      step="1000"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-600 dark:text-gray-400 block mb-1">বাসা ছাড়ার কারণ (Reason)</label>
                  <input
                    type="text"
                    value={reasonText}
                    onChange={(e) => setReasonText(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>
              </div>

              {/* Parties Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Landlord */}
                <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2.5">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-amber-600" />
                    বাড়িওয়ালার তথ্য (Landlord)
                  </h4>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">নাম</label>
                    <input
                      type="text"
                      value={landlordName}
                      onChange={(e) => setLandlordName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-gray-600 dark:text-gray-400 block mb-1">মোবাইল</label>
                      <input
                        type="text"
                        value={landlordPhone}
                        onChange={(e) => setLandlordPhone(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-400 block mb-1">ঠিকানা</label>
                      <input
                        type="text"
                        value={landlordAddress}
                        onChange={(e) => setLandlordAddress(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Tenant */}
                <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2.5">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-600" />
                    ভাড়াটিয়ার তথ্য (Tenant)
                  </h4>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">নাম</label>
                    <input
                      type="text"
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
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
              </div>

              {/* Property Address */}
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  ভাড়াকৃত ফ্ল্যাটের পূর্ণ বিবরণী / Property Particulars
                </label>
                <input
                  type="text"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
            </div>
          )}

          {/* TAB 2: OFFICIAL PREVIEW */}
          {activeTab === "preview" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-800 text-xs">
                <span className="text-amber-900 dark:text-amber-200 font-medium">
                  📄 এই নোটিশটি রেজিস্ট্রি ডাকযোগে (A/D) অথবা সরাসরি রসিদসহ হস্তান্তরের জন্য সম্পূর্ণ প্রস্তুত।
                </span>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Formal Letter
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-xl border border-gray-300 dark:border-gray-800 font-mono text-xs leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap shadow-inner max-h-[50vh] overflow-y-auto">
                {currentNoticeText}
              </div>
            </div>
          )}

          {/* TAB 3: LEGAL RULES & NOTICE LAWS */}
          {activeTab === "legal_rules" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900 space-y-2">
                <div className="font-bold text-amber-950 dark:text-amber-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  ১. লিখিত নোটিশের আইনি বাধ্যবাধকতা (১৯৯১ আইন)
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                  বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১ অনুযায়ী কোনো পক্ষই মৌখিক কথায় বাসা ছাড়া বা ছাড়াতে পারে না। ন্যূনতম ১ থেকে ২ মাস পূর্বে লিখিত নোটিশ প্রদান এবং প্রাপকের স্বাক্ষরযুক্ত কপি বা রেজিস্ট্রি ডাক রসিদ সংরক্ষণ বাধ্যতামূলক।
                </p>
              </div>

              <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900 space-y-2">
                <div className="font-bold text-blue-950 dark:text-blue-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  ২. জামানত ফেরত ও অগ্রিম সমন্বয় নিয়ম
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                  ফ্ল্যাট ছাড়ার দিনই চাবি বুঝিয়ে দেওয়ার সাথে সাথে সমুদয় জামানত ফেরত দিতে হবে। বাড়িওয়ালা বিদ্যুৎ/ওয়াসা বিলের রশিদ দেখে সমন্বয়ের পর অতিরিক্ত টাকা আটকে রাখতে পারেন না।
                </p>
              </div>

              <div className="p-4 bg-purple-50/60 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-900 space-y-2">
                <div className="font-bold text-purple-950 dark:text-purple-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  ৩. হঠাৎ উচ্ছেদ ও তালা দেওয়ার বিরুদ্ধে প্রতিকার
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                  আইনত নোটিশ না দিয়ে কোনো বাড়িওয়ালা ভাড়াটিয়াকে জোরপূর্বক উচ্ছেদ, বিদ্যুৎ বা গ্যাস সংযোগ বিচ্ছিন্ন অথবা ফ্ল্যাটে তালা দিতে পারেন না। এমন পরিস্থিতিতে স্থানীয় থানা বা দেওয়ানি আদালতে প্রতিকার পাওয়া যায়।
                </p>
              </div>

              <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900 space-y-2">
                <div className="font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ৪. রেজিস্ট্রি ডাকযোগে (A/D Post) প্রেরণের পরামর্শ
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                  যদি কোনো বাড়িওয়ালা বা ভাড়াটিয়া সরাসরি নোটিশ গ্রহণে অস্বীকৃতি জানান, তবে নিকটস্থ ডাকঘর থেকে Acknowledgement Due (A/D) সহ রেজিস্ট্রি চিঠিতে নোটিশ পাঠিয়ে ডাক রসিদ প্রমাণ হিসেবে সংরক্ষণ করুন।
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Structured pursuant to Bangladesh Premises Rent Control Act 1991</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCopyNotice}
              className="px-4 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy Text"}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
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
