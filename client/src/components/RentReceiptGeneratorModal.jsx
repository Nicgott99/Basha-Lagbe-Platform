import { useState, useMemo } from "react";
import {
  X,
  Receipt,
  Printer,
  Copy,
  Check,
  Languages,
  Calendar,
  DollarSign,
  User,
  Building,
  CreditCard,
  FileCheck,
  CheckCircle2,
  Info,
  ShieldCheck,
  Sparkles
} from "lucide-react";

export default function RentReceiptGeneratorModal({ isOpen, onClose }) {
  const [lang, setLang] = useState("bn"); // "bn" | "en"
  const [activeTab, setActiveTab] = useState("form"); // "form" | "preview" | "tax_guide"

  // Receipt Metadata
  const [receiptNo, setReceiptNo] = useState("BL-2026-0901");
  const [paymentDate, setPaymentDate] = useState("০৫ সেপ্টেম্বর ২০২৬");
  const [rentMonth, setRentMonth] = useState("সেপ্টেম্বর ২০২৬");

  // Parties
  const [landlordName, setLandlordName] = useState("জনাব মো: রফিকুল ইসলাম");
  const [landlordPhone, setLandlordPhone] = useState("01711-223344");
  const [landlordNid, setLandlordNid] = useState("19852691234567890");

  const [tenantName, setTenantName] = useState("জনাব তানভীর আহমেদ");
  const [tenantPhone, setTenantPhone] = useState("01819-556677");
  const [tenantNid, setTenantNid] = useState("19942699876543210");

  // Property Details
  const [propertyAddress, setPropertyAddress] = useState("ফ্ল্যাট ৪-বি, বাড়ি নং ৪৫, রোড নং ৭, সেক্টর ৪, উত্তরা, ঢাকা-১২৩০");

  // Breakdown
  const [baseRent, setBaseRent] = useState(22000);
  const [electricBill, setElectricBill] = useState(2500);
  const [waterBill, setWaterBill] = useState(800);
  const [gasBill, setGasBill] = useState(1080);
  const [serviceCharge, setServiceCharge] = useState(2000);
  const [otherDues, setOtherDues] = useState(0);

  // Payment Method
  const [paymentMode, setPaymentMode] = useState("bank"); // "cash" | "bank" | "mfs"
  const [transactionRef, setTransactionRef] = useState("EBL/TRX-98421854");

  const [copied, setCopied] = useState(false);

  // Bengali numbers converter
  const toBn = (num) => {
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(num).replace(/[0-9]/g, (w) => bnDigits[+w]);
  };

  // Calculations
  const totalAmount = useMemo(() => {
    return (
      (Number(baseRent) || 0) +
      (Number(electricBill) || 0) +
      (Number(waterBill) || 0) +
      (Number(gasBill) || 0) +
      (Number(serviceCharge) || 0) +
      (Number(otherDues) || 0)
    );
  }, [baseRent, electricBill, waterBill, gasBill, serviceCharge, otherDues]);

  // Payment Mode label
  const paymentModeLabelBn = useMemo(() => {
    if (paymentMode === "cash") return "নগদ (Cash)";
    if (paymentMode === "mfs") return `মোবাইল ব্যাংকিং (bKash/Nagad TrxID: ${transactionRef || "N/A"})`;
    return `ব্যাংক ট্রান্সফার / চেক (Bank/Cheque Ref: ${transactionRef || "N/A"})`;
  }, [paymentMode, transactionRef]);

  const paymentModeLabelEn = useMemo(() => {
    if (paymentMode === "cash") return "Cash Payment";
    if (paymentMode === "mfs") return `Mobile Financial Service (bKash/Nagad TrxID: ${transactionRef || "N/A"})`;
    return `Bank Transfer / Cheque (Ref: ${transactionRef || "N/A"})`;
  }, [paymentMode, transactionRef]);

  // Bengali Voucher Text
  const receiptTextBn = useMemo(() => {
    return `
                       বিসমিল্লাহির রাহমানির রাহিম
                       মাসিক বাড়ি ভাড়ার অর্থ প্রাপ্তি রসিদ
           (বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১ এর ১৩ ধারা মোতাবেক প্রদেয় মানি রসিদ)

রসিদ নং: ${receiptNo}                                         তারিখ: ${paymentDate}
ভাড়ার মাস ও সন: ${rentMonth}

বাড়িওয়ালা / গ্রহীতা (Landlord):
নাম: ${landlordName}
মোবাইল: ${landlordPhone} | NID: ${landlordNid}

ভাড়াটিয়া / প্রদানকারী (Tenant):
নাম: ${tenantName}
মোবাইল: ${tenantPhone} | NID: ${tenantNid}

ভাড়াকৃত সম্পত্তির বিবরণ:
${propertyAddress}

পরিশোধের বিস্তারিত বিবরণী (Breakdown):
১. মূল মাসিক বাড়ি ভাড়া: ................................ =${toBn(baseRent)}/= টাকা
২. বিদ্যুৎ বিল (প্রিপেইড/মিটার রিচার্জ): ................ =${toBn(electricBill)}/= টাকা
৩. ওয়াসা পানির বিল: ................................... =${toBn(waterBill)}/= টাকা
৪. তিতাস গ্যাস বিল: ................................... =${toBn(gasBill)}/= টাকা
৫. বিল্ডিং সার্ভিস ও সিকিউরিটি চার্জ: ................. =${toBn(serviceCharge)}/= টাকা
৬. অন্যান্য / বকেয়া সমন্বয়: ........................... =${toBn(otherDues)}/= টাকা
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
সর্বমোট প্রাপ্ত অর্থ: ................................. =${toBn(totalAmount)}/= টাকা
(কথায়: ${toBn(totalAmount)} টাকা মাত্র)

পরিশোধের মাধ্যম: ${paymentModeLabelBn}

উদ্বৃত্ত ও মন্তব্য: বর্ণিত মাসের সমুদয় ভাড়া ও ইউটিলিটি চার্জ বাবদ উপরোক্ত অর্থ বুঝিয়া পাইয়া অত্র রসিদ প্রদান করিলাম।


[ ১ টাকার রেভিনিউ ]
[     স্ট্যাম্প     ]
[  (নগদ প্রদানে)   ]


-------------------------------------               -------------------------------------
ভাড়াটিয়ার স্বাক্ষর                                   বাড়িওয়ালার স্বাক্ষর ও তারিখ
(Tenant Signature)                                  (Landlord Signature & Date)
    `.trim();
  }, [
    receiptNo,
    paymentDate,
    rentMonth,
    landlordName,
    landlordPhone,
    landlordNid,
    tenantName,
    tenantPhone,
    tenantNid,
    propertyAddress,
    baseRent,
    electricBill,
    waterBill,
    gasBill,
    serviceCharge,
    otherDues,
    totalAmount,
    paymentModeLabelBn,
  ]);

  // English Voucher Text
  const receiptTextEn = useMemo(() => {
    return `
                        MONTHLY HOUSE RENT MONEY RECEIPT
       (Issued pursuant to Section 13 of Bangladesh Premises Rent Control Act 1991)

Receipt No: ${receiptNo}                                     Date: ${paymentDate}
Rental Month & Year: ${rentMonth}

LANDLORD / RECIPIENT:
Name: ${landlordName}
Phone: ${landlordPhone} | NID: ${landlordNid}

TENANT / PAYER:
Name: ${tenantName}
Phone: ${tenantPhone} | NID: ${tenantNid}

DEMISED PREMISES:
${propertyAddress}

PAYMENT PARTICULARS & BREAKDOWN:
1. Base Monthly House Rent: .......................... BDT ${baseRent.toLocaleString()}/-
2. Electricity / Prepaid Meter Recharge: .............. BDT ${electricBill.toLocaleString()}/-
3. WASA Water Bill: ................................... BDT ${waterBill.toLocaleString()}/-
4. Titas Gas Bill: .................................... BDT ${gasBill.toLocaleString()}/-
5. Building Service & Security Charge: ................ BDT ${serviceCharge.toLocaleString()}/-
6. Other Adjustments / Dues: .......................... BDT ${otherDues.toLocaleString()}/-
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL AMOUNT RECEIVED: ................................ BDT ${totalAmount.toLocaleString()}/-
(In Words: BDT ${totalAmount.toLocaleString()} Taka Only)

Payment Method: ${paymentModeLabelEn}

REMARKS: Received the above mentioned sum towards full settlement of house rent and utilities for the stated period.


[ 1 Taka Revenue ]
[     Stamp      ]
[ (Cash Payments) ]


___________________________                         ___________________________
Tenant Signature                                    Landlord Signature & Date
    `.trim();
  }, [
    receiptNo,
    paymentDate,
    rentMonth,
    landlordName,
    landlordPhone,
    landlordNid,
    tenantName,
    tenantPhone,
    tenantNid,
    propertyAddress,
    baseRent,
    electricBill,
    waterBill,
    gasBill,
    serviceCharge,
    otherDues,
    totalAmount,
    paymentModeLabelEn,
  ]);

  const currentReceiptText = lang === "bn" ? receiptTextBn : receiptTextEn;

  const handleCopyReceipt = () => {
    navigator.clipboard.writeText(currentReceiptText);
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
          <title>House Rent Receipt - ${receiptNo}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 15mm;
            }
            body {
              font-family: 'SolaimanLipi', 'Nikosh', 'Kalpurush', 'Times New Roman', serif;
              font-size: 12pt;
              line-height: 1.5;
              color: #111;
              white-space: pre-wrap;
              margin: 0;
              padding: 20px;
            }
            .receipt-border {
              border: 2px dashed #333;
              padding: 24px;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <div class="receipt-border">
            ${currentReceiptText}
          </div>
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
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
              <Receipt className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                Monthly Rent Money Receipt (ভাড়ার রসিদ)
                <span className="hidden sm:inline-block text-xs bg-yellow-400 text-blue-950 font-bold px-2 py-0.5 rounded-full">
                  1991 Act Formatted
                </span>
              </h2>
              <p className="text-xs text-blue-100">
                Generate official tenant rent payment slips for record-keeping and NBR income tax exemption
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
              { id: "form", label: "Receipt Details & Amount", icon: FileCheck },
              { id: "preview", label: "Receipt Voucher Preview", icon: Receipt },
              { id: "tax_guide", label: "Income Tax Exemption Guide", icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2.5 px-4 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? "border-blue-600 text-blue-600 dark:text-blue-400 font-semibold"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`} />
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
                    ? "bg-blue-600 text-white shadow-sm"
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
                    ? "bg-blue-600 text-white shadow-sm"
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
              {/* Receipt Meta & Month */}
              <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/40 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                      রসিদ নং / Serial No
                    </label>
                    <input
                      type="text"
                      value={receiptNo}
                      onChange={(e) => setReceiptNo(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                      ভাড়ার মাস / Rent Month
                    </label>
                    <input
                      type="text"
                      value={rentMonth}
                      onChange={(e) => setRentMonth(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                      পরিশোধের তারিখ / Payment Date
                    </label>
                    <input
                      type="text"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Landlord */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2.5">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-600" />
                    বাড়িওয়ালা / গ্রহীতা (Landlord)
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
                      <label className="text-gray-600 dark:text-gray-400 block mb-1">NID</label>
                      <input
                        type="text"
                        value={landlordNid}
                        onChange={(e) => setLandlordNid(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Tenant */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2.5">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-600" />
                    ভাড়াটিয়া / প্রদানকারী (Tenant)
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
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-gray-600 dark:text-gray-400 block mb-1">মোবাইল</label>
                      <input
                        type="text"
                        value={tenantPhone}
                        onChange={(e) => setTenantPhone(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 dark:text-gray-400 block mb-1">NID</label>
                      <input
                        type="text"
                        value={tenantNid}
                        onChange={(e) => setTenantNid(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Address */}
              <div className="text-xs">
                <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  ভাড়াকৃত ফ্ল্যাটের পূর্ণ ঠিকানা / Property Address
                </label>
                <input
                  type="text"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>

              {/* Financial Amounts Breakdown */}
              <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    ভাড়া ও ইউটিলিটি চার্জের বিস্তারিত হিসাব
                  </h4>
                  <div className="text-sm font-extrabold text-blue-700 dark:text-blue-300">
                    সর্বমোট: ৳{totalAmount.toLocaleString()} BDT
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">মূল বাড়ি ভাড়া (৳)</label>
                    <input
                      type="number"
                      step="500"
                      value={baseRent}
                      onChange={(e) => setBaseRent(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">বিদ্যুৎ বিল / মিটার (৳)</label>
                    <input
                      type="number"
                      step="100"
                      value={electricBill}
                      onChange={(e) => setElectricBill(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">ওয়াসা পানির বিল (৳)</label>
                    <input
                      type="number"
                      step="50"
                      value={waterBill}
                      onChange={(e) => setWaterBill(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">তিতাস গ্যাস বিল (৳)</label>
                    <input
                      type="number"
                      step="50"
                      value={gasBill}
                      onChange={(e) => setGasBill(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">সার্ভিস চার্জ (৳)</label>
                    <input
                      type="number"
                      step="100"
                      value={serviceCharge}
                      onChange={(e) => setServiceCharge(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">অন্যান্য / বকেয়া (৳)</label>
                    <input
                      type="number"
                      step="50"
                      value={otherDues}
                      onChange={(e) => setOtherDues(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                </div>

                {/* Payment Mode & Reference */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                      পরিশোধের মাধ্যম / Payment Mode
                    </label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 font-semibold"
                    >
                      <option value="bank">ব্যাংক ট্রান্সফার / চেক (Bank / Cheque)</option>
                      <option value="mfs">মোবাইল ব্যাংকিং (bKash / Nagad / Rocket)</option>
                      <option value="cash">নগদ প্রদান (Cash)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                      ট্রানজেকশন আইডি / চেক নং (Reference)
                    </label>
                    <input
                      type="text"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="e.g. bKash TrxID or Cheque No"
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RECEIPT VOUCHER PREVIEW */}
          {activeTab === "preview" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/40 p-3 rounded-xl border border-blue-200 dark:border-blue-800 text-xs">
                <span className="text-blue-900 dark:text-blue-200 font-medium">
                  📄 এই রসিদটি আয়কর ফাইল দাখিল এবং আইনগত প্রমাণের জন্য সম্পূর্ণ গ্রহণযোগ্য।
                </span>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Receipt Slip
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-xl border border-gray-300 dark:border-gray-800 font-mono text-xs leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap shadow-inner max-h-[50vh] overflow-y-auto">
                {currentReceiptText}
              </div>
            </div>
          )}

          {/* TAB 3: INCOME TAX EXEMPTION GUIDE */}
          {activeTab === "tax_guide" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900 space-y-2">
                <div className="font-bold text-blue-950 dark:text-blue-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  ১. বাড়ি ভাড়া ভাতা ও আয়কর ছাড় (Income Tax Act 2023)
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                  চাকরিজীবী করদাতারা বাড়ি ভাড়া ভাতার অংশ আয়করমুক্ত রাখতে পারেন। কর পরিদর্শক অডিট করলে বাড়িওয়ালার স্বাক্ষরিত মানি রসিদ বা ব্যাংক স্টেটমেন্ট প্রদর্শন করতে হয়।
                </p>
              </div>

              <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900 space-y-2">
                <div className="font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ২. ১ টাকার রেভিনিউ স্ট্যাম্পের বিধান
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                  বাংলাদেশ স্ট্যাম্প আইন অনুযায়ী ৫০০ টাকার অধিক যেকোনো নগদ লেনদেনে অর্থ গ্রহণকারীকে রসিদের উপর ১ টাকার রেভিনিউ স্ট্যাম্প সংযুক্ত করে তার উপর আড়াআড়ি স্বাক্ষর দিতে হয়।
                </p>
              </div>

              <div className="p-4 bg-purple-50/60 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-900 space-y-2">
                <div className="font-bold text-purple-950 dark:text-purple-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  ৩. ব্যাংক বা এমএফএস ট্রানজেকশনের সুবিধা
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                  ভাড়াটিয়া ও বাড়িওয়ালা উভয়ের সুরক্ষার জন্য মাসিক ভাড়া সরাসরি ব্যাংক অ্যাকাউন্ট অথবা bKash/Nagad এর মাধ্যমে লেনদেন করা এবং ট্রানজেকশন আইডি রসিদে লিপিবদ্ধ রাখা সবচেয়ে নিরাপদ।
                </p>
              </div>

              <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900 space-y-2">
                <div className="font-bold text-amber-950 dark:text-amber-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  ৪. বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১ এর ১৩ ধারা
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                  আইন অনুযায়ী কোনো বাড়িওয়ালা ভাড়া গ্রহণের পর লিখিত রসিদ প্রদানে অস্বীকৃতি জানালে তা আইনত দণ্ডনীয় অপরাধ। রসিদ নিয়মিত সংরক্ষণ করা ভাড়াটিয়ার প্রধান আইনি ঢাল।
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            <span>Compliant with Bangladesh Tax Assessment & Rent Control Regulations</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCopyReceipt}
              className="px-4 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy Text"}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
