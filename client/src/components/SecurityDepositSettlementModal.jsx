import React, { useState, useMemo } from "react";
import {
  X,
  Printer,
  Copy,
  Check,
  DollarSign,
  ShieldCheck,
  Plus,
  Trash2,
  FileText,
  User,
  Phone,
  Building,
  Calendar,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Send,
  Coins,
  Scale,
  CreditCard,
} from "lucide-react";

const INITIAL_DEDUCTIONS = [
  { id: "d1", item: "Wall Paint & Putty Touch-up / দেয়াল রং ও পুটিং সংস্কার", amount: 4500, category: "paint" },
  { id: "d2", item: "Sanitary Fittings & Tap Replacement / বাথরুম ফিটিংস মেরামত", amount: 1800, category: "repair" },
  { id: "d3", item: "Last Month Pending Electricity Bill / শেষ মাসের বিদ্যুৎ বিল", amount: 2400, category: "utility" },
  { id: "d4", item: "Flat Deep Cleaning & Garbage Clearance / ফ্ল্যাট পরিষ্কার খরচ", amount: 1500, category: "cleaning" },
];

export default function SecurityDepositSettlementModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("calculator"); // "calculator" | "voucher" | "guidelines"
  const [lang, setLang] = useState("bn"); // "bn" | "en"
  const [copied, setCopied] = useState(false);

  // Tenancy & Party Details
  const [form, setForm] = useState({
    propertyAddress: "Flat 4B, House 14, Road 7, Block B, Bashundhara R/A, Dhaka-1229",
    tenancyStartDate: "01 November 2024",
    handoverDate: "31 October 2026",
    settlementDate: new Date().toLocaleDateString("en-GB"),
    
    // Landlord
    landlordName: "Alhaj Rafiqul Islam",
    landlordPhone: "01819-456789",
    landlordNid: "19651234567890",

    // Tenant
    tenantName: "MD Hasib Ullah Khan Alvie",
    tenantPhone: "01712-345678",
    tenantNid: "19982692019283741",

    // Initial Deposit
    initialDepositAmount: 60000,
    
    // Refund Payment
    paymentMethod: "Bank Transfer (EBL Internet Banking)",
    trxIdOrChequeNo: "TRX-EBL-8891024",
    refundDate: new Date().toLocaleDateString("en-GB"),
    specialNotes: "Both parties inspected the flat together. Key sets (4 sets) handed over in full.",
  });

  // Deductions list
  const [deductions, setDeductions] = useState(INITIAL_DEDUCTIONS);

  const setField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  // Add deduction row
  const addDeduction = () => {
    const newId = `d_${Date.now()}`;
    setDeductions((prev) => [
      ...prev,
      { id: newId, item: "New Deduction / নতুন কর্তন", amount: 1000, category: "repair" },
    ]);
  };

  // Update deduction
  const updateDeduction = (id, field, value) => {
    setDeductions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: field === "amount" ? Number(value) || 0 : value } : d))
    );
  };

  // Delete deduction
  const deleteDeduction = (id) => {
    setDeductions((prev) => prev.filter((d) => d.id !== id));
  };

  // Calculations
  const totalDeductions = useMemo(() => {
    return deductions.reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
  }, [deductions]);

  const netRefundAmount = useMemo(() => {
    return Math.max(0, (Number(form.initialDepositAmount) || 0) - totalDeductions);
  }, [form.initialDepositAmount, totalDeductions]);

  const refundPercentage = useMemo(() => {
    if (!form.initialDepositAmount || form.initialDepositAmount === 0) return 0;
    return Math.round((netRefundAmount / form.initialDepositAmount) * 100);
  }, [netRefundAmount, form.initialDepositAmount]);

  // Generate Formal Full & Final Settlement Deed Text (Bengali)
  const voucherTextBn = useMemo(() => {
    const dedList = deductions
      .map((d, i) => `   ${i + 1}. ${d.item}: ৳${Number(d.amount).toLocaleString("en-IN")}/-`)
      .join("\n");

    return `বাড়িভাড়া অগ্রিম/নিরাপত্তা জামানত ফেরত ও চূড়ান্ত নিষ্পত্তি পত্র
(FULL & FINAL SECURITY DEPOSIT SETTLEMENT VOUCHER)
তারিখ: ${form.settlementDate}

১ম পক্ষ (বাড়িওয়ালা / মালিক):
নাম: ${form.landlordName} | মোবাইল: ${form.landlordPhone} | NID: ${form.landlordNid}

২য় পক্ষ (ভাড়াটিয়া):
নাম: ${form.tenantName} | মোবাইল: ${form.tenantPhone} | NID: ${form.tenantNid}

ভাড়াকৃত সম্পত্তি: ${form.propertyAddress}
ভাড়ার মেয়াদকাল: ${form.tenancyStartDate} হইতে ${form.handoverDate} পর্যন্ত।

উভয় পক্ষের সম্মতিক্রমে অত্র জামানত নিষ্পত্তি পত্র সম্পাদিত হইল:

১. মূল জমা জামানতের পরিমাণ: ৳${Number(form.initialDepositAmount).toLocaleString("en-IN")}/- (কথায়: ${Number(form.initialDepositAmount).toLocaleString("en-IN")} টাকা)

২. ফ্ল্যাট হস্তান্তরকালীন কর্তন বিবরণী (Deductions Breakdown):
${dedList}
-----------------------------------------------------------
মোট কর্তনকৃত অর্থ: ৳${totalDeductions.toLocaleString("en-IN")}/-

৩. সর্বমোট নীট ফেরতযোগ্য জামানত (Net Refundable):
৳${netRefundAmount.toLocaleString("en-IN")}/- (কথায়: ${netRefundAmount.toLocaleString("en-IN")} টাকা)

৪. পরিশোধের মাধ্যম ও ট্রানজেকশন: ${form.paymentMethod} (রেফারেন্স/চেক নং: ${form.trxIdOrChequeNo})
পরিশোধের তারিখ: ${form.refundDate}

চূড়ান্ত দায়মুক্তি অঙ্গীকার (Full & Final Discharge):
২য় পক্ষ (ভাড়াটিয়া) উক্ত নীট অর্থ বুঝিয়া পাইয়া অত্র ফ্ল্যাট সংক্রান্ত যাবতীয় চাবি ১ম পক্ষকে বুঝাইয়া দিলেন। অদ্য হইতে উভয় পক্ষের মধ্যে অত্র ভাড়াকৃত সম্পত্তি সংক্রান্ত কোনো প্রকার বকেয়া, দাবি বা আর্থিক লেনদেন অবশিষ্ট রহিল না এবং উভয় পক্ষ পরস্পরকে যাবতীয় দায় হইতে অব্যাহতি প্রদান করিলেন।

বিশেষ মন্তব্য: ${form.specialNotes}

১ম পক্ষের স্বাক্ষর (বাড়িওয়ালা): _____________________   ২য় পক্ষের স্বাক্ষর (ভাড়াটিয়া): _____________________
নাম: ${form.landlordName}                               নাম: ${form.tenantName}

১ম সাক্ষী: ___________________________              ২য় সাক্ষী: ___________________________`;
  }, [form, deductions, totalDeductions, netRefundAmount]);

  // Generate Formal Text (English)
  const voucherTextEn = useMemo(() => {
    const dedList = deductions
      .map((d, i) => `   ${i + 1}. ${d.item}: BDT ৳${Number(d.amount).toLocaleString("en-IN")}`)
      .join("\n");

    return `FULL & FINAL SECURITY DEPOSIT SETTLEMENT & DISCHARGE VOUCHER
Date of Settlement: ${form.settlementDate}

Landlord / Property Owner (First Party):
Name: ${form.landlordName} | Phone: ${form.landlordPhone} | NID: ${form.landlordNid}

Tenant (Second Party):
Name: ${form.tenantName} | Phone: ${form.tenantPhone} | NID: ${form.tenantNid}

Demised Premises: ${form.propertyAddress}
Tenancy Period: From ${form.tenancyStartDate} to ${form.handoverDate}

SETTLEMENT SUMMARY:
1. Initial Security Deposit Held: BDT ৳${Number(form.initialDepositAmount).toLocaleString("en-IN")}

2. Itemized Move-Out Deductions:
${dedList}
-----------------------------------------------------------
Total Agreed Deductions: BDT ৳${totalDeductions.toLocaleString("en-IN")}

3. NET REFUND PAYABLE TO TENANT:
BDT ৳${netRefundAmount.toLocaleString("en-IN")}

4. Payment Disbursement Mode: ${form.paymentMethod} (Trx / Cheque Ref: ${form.trxIdOrChequeNo})
Disbursement Date: ${form.refundDate}

FULL & FINAL MUTUAL DISCHARGE:
The Tenant confirms receipt of the net refundable deposit and certifies that all keys and vacant possession of the premises have been handed back to the Landlord in acceptable order. Neither party holds any further claims, dues, or liabilities arising from the tenancy agreement.

Remarks: ${form.specialNotes}

Landlord Signature: _____________________        Tenant Signature: _____________________
Name: ${form.landlordName}                          Name: ${form.tenantName}

Witness 1: ______________________________        Witness 2: ______________________________`;
  }, [form, deductions, totalDeductions, netRefundAmount]);

  const activeVoucherText = lang === "bn" ? voucherTextBn : voucherTextEn;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-amber-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Security Deposit Refund & Settlement Hub
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  জামানত ফেরত ও নিষ্পত্তি পত্র
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Itemized move-out deductions calculator, full & final discharge deed & tenancy law wear-and-tear guidance
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

        {/* Top Summary Metric Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 py-3.5 bg-slate-950/60 border-b border-slate-800 text-sm">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col">
            <span className="text-xs text-slate-400 font-medium">Original Deposit / মূল জামানত</span>
            <span className="text-lg font-bold text-white mt-1">৳{Number(form.initialDepositAmount).toLocaleString("en-IN")}</span>
            <span className="text-[11px] text-slate-500">Held by Landlord</span>
          </div>

          <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl p-3 flex flex-col">
            <span className="text-xs text-rose-400 font-medium">Agreed Deductions / মোট কর্তন</span>
            <span className="text-lg font-bold text-rose-300 mt-1">৳{totalDeductions.toLocaleString("en-IN")}</span>
            <span className="text-[11px] text-rose-500/80">{deductions.length} Itemized deductions</span>
          </div>

          <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3 flex flex-col">
            <span className="text-xs text-emerald-400 font-medium">Net Refund / ফেরতযোগ্য অর্থ</span>
            <span className="text-lg font-bold text-emerald-300 mt-1">৳{netRefundAmount.toLocaleString("en-IN")}</span>
            <span className="text-[11px] text-emerald-500/80">{refundPercentage}% of deposit refunded</span>
          </div>

          <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-xl p-3 flex flex-col">
            <span className="text-xs text-indigo-400 font-medium">Settlement Status / অবস্থা</span>
            <span className="text-sm font-bold text-indigo-300 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full & Final Discharge</span>
            </span>
            <span className="text-[11px] text-slate-400">Mutually released</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 pt-3 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab("calculator")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "calculator"
                  ? "border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>১. জামানত ও কর্তন ক্যালকুলেটর (Calculator)</span>
            </button>
            <button
              onClick={() => setActiveTab("voucher")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "voucher"
                  ? "border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>২. নিষ্পত্তি দলিল ও ভাউচার (Discharge Deed)</span>
            </button>
            <button
              onClick={() => setActiveTab("guidelines")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "guidelines"
                  ? "border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>৩. আইনি গাইডলাইন (Tenancy Law)</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: CALCULATOR & DEDUCTION FORM */}
          {activeTab === "calculator" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Details (5 cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800 text-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 pb-2 border-b border-slate-800">
                  <Building className="w-4 h-4 text-emerald-400" />
                  <span>Tenancy & Deposit Details</span>
                </h3>

                <div>
                  <label className="text-slate-400 block mb-1">Property Address / ফ্ল্যাটের ঠিকানা:</label>
                  <input
                    type="text"
                    value={form.propertyAddress}
                    onChange={(e) => setField("propertyAddress", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Start Date:</label>
                    <input
                      type="text"
                      value={form.tenancyStartDate}
                      onChange={(e) => setField("tenancyStartDate", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Handover Date:</label>
                    <input
                      type="text"
                      value={form.handoverDate}
                      onChange={(e) => setField("handoverDate", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Landlord Name & Phone:</label>
                    <input
                      type="text"
                      value={form.landlordName}
                      onChange={(e) => setField("landlordName", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Tenant Name & Phone:</label>
                    <input
                      type="text"
                      value={form.tenantName}
                      onChange={(e) => setField("tenantName", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <label className="text-slate-300 font-bold block mb-1 text-xs">
                    Initial Security Deposit Held / মূল জামানতের অর্থ (৳):
                  </label>
                  <input
                    type="number"
                    value={form.initialDepositAmount}
                    onChange={(e) => setField("initialDepositAmount", Number(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-emerald-500/50 rounded-lg px-3 py-2 text-emerald-300 font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Payment Method & Trx / Cheque Ref:</label>
                  <input
                    type="text"
                    value={form.paymentMethod}
                    onChange={(e) => setField("paymentMethod", e.target.value)}
                    placeholder="e.g. Bank Transfer / Cheque / bKash"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white mb-2"
                  />
                  <input
                    type="text"
                    value={form.trxIdOrChequeNo}
                    onChange={(e) => setField("trxIdOrChequeNo", e.target.value)}
                    placeholder="Transaction ID / Cheque #"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              {/* Right Column: Itemized Deductions (7 cols) */}
              <div className="lg:col-span-7 space-y-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Itemized Move-Out Deductions (কর্তন বিবরণী)</span>
                  </h3>
                  <button
                    onClick={addDeduction}
                    className="flex items-center gap-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs px-2.5 py-1 rounded-lg transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
                  {deductions.map((d, index) => (
                    <div
                      key={d.id}
                      className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs"
                    >
                      <span className="text-slate-500 font-mono w-4">{index + 1}.</span>
                      <input
                        type="text"
                        value={d.item}
                        onChange={(e) => updateDeduction(d.id, "item", e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">৳</span>
                        <input
                          type="number"
                          value={d.amount}
                          onChange={(e) => updateDeduction(d.id, "amount", e.target.value)}
                          className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-right text-rose-300 font-semibold"
                        />
                      </div>
                      <button
                        onClick={() => deleteDeduction(d.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {deductions.length === 0 && (
                    <div className="p-8 text-center text-slate-500 bg-slate-900/30 rounded-xl border border-dashed border-slate-800 text-xs">
                      No deductions added! 100% full security deposit will be refunded to the tenant.
                    </div>
                  )}
                </div>

                {/* Calculation Summary Footer */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Initial Deposit Held:</span>
                    <span className="font-semibold">৳{Number(form.initialDepositAmount).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-rose-400">
                    <span>Total Move-out Deductions:</span>
                    <span className="font-bold">- ৳{totalDeductions.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-emerald-400 pt-2 border-t border-slate-800">
                    <span>Final Refund Payable (নীট ফেরত):</span>
                    <span>৳{netRefundAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DISCHARGE DEED & PRINTABLE VOUCHER */}
          {activeTab === "voucher" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                {/* Language Switch */}
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs">
                  <button
                    onClick={() => setLang("bn")}
                    className={`px-3 py-1.5 rounded font-medium transition ${
                      lang === "bn" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    বাংলা দলিল
                  </button>
                  <button
                    onClick={() => setLang("en")}
                    className={`px-3 py-1.5 rounded font-medium transition ${
                      lang === "en" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    English Deed
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(activeVoucherText)}
                    className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg transition border border-slate-700"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied!" : "Copy Text"}</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition shadow"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Settlement Deed (প্রিন্ট করুন)</span>
                  </button>
                </div>
              </div>

              {/* Printable White Document */}
              <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 font-sans text-xs leading-relaxed max-h-[60vh] overflow-y-auto whitespace-pre-wrap">
                {activeVoucherText}
              </div>

              {/* WhatsApp Share */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Send signed settlement summary directly to Tenant / Landlord:</span>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(activeVoucherText)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white font-semibold px-3.5 py-1.5 rounded-lg transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Share on WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: TENANCY LAW GUIDELINES */}
          {activeTab === "guidelines" && (
            <div className="space-y-4 text-xs">
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 p-5 rounded-xl border border-indigo-900/40 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-emerald-400" />
                  <span>Security Deposit & Wear-and-Tear Legal Rights (Premises Rent Control Act 1991)</span>
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  বাংলাদেশ বাড়িভাড়া নিয়ন্ত্রণ আইন ও প্রচলিত প্রথা অনুযায়ী জামানত কর্তন ও ফেরত সংক্রান্ত মৌলিক আইনি অধিকারসমূহ:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>স্বাভাবিক ক্ষয়-ক্ষতি (Wear and Tear) — কর্তনযোগ্য নয়</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    সময়ের আবর্তনে রোদে দেয়ালের রঙের স্বাভাবিক উজ্জ্বলতা হ্রাস, আসবাব ব্যবহারের মৃদু দাগ বা প্রাকৃতিক আবহাওয়াজনিত ক্ষয়-ক্ষতি স্বাভাবিক ব্যবহারের অংশ। এর জন্য কোনো অযৌক্তিক বড় অংকের অর্থ কর্তন করা আইনসম্মত নয়।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>প্রকৃত ক্ষতি (Tenant Damage) — বৈধ কর্তনযোগ্য</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    দেয়ালে বড় গর্ত, টাইলস বা বেসিন ভাঙা, দরজা-জানালার লক নষ্ট, অথবা অপরিশোধিত বিদ্যুৎ/গ্যাস/পানির বিল সরাসরি জামানত থেকে কেটে রেখে রসিদসহ হিসাব সমন্বয় করা সম্পূর্ণ বৈধ।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-indigo-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>জামানত ফেরতের সময়সীমা (Refund SLA)</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    চুক্তিপত্র অনুযায়ী ফ্ল্যাটের চাবি হস্তান্তরের ১৫ থেকে ৩০ দিনের মধ্যে বাড়িওয়ালাকে শেষ মাসের ইউটিলিটি বিল সমন্বয়পূর্বক সমুদয় জামানতের টাকা ফেরত প্রদান করতে হবে।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>যৌথ পরিদর্শন ও দায়মুক্তি রসিদ (Joint Inspection)</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    ফ্ল্যাট ছাড়ার দিন উভয় পক্ষ একসঙ্গে প্রতিটি রুম পরিদর্শন করে একটি লিখিত নিষ্পত্তিপত্রে স্বাক্ষর করা উচিত যাতে ভবিষ্যতে কোনো পক্ষই নতুন দাবি উত্থাপন করতে না পারে।
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Legally verified discharge template for rental security deposits in Bangladesh</span>
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
