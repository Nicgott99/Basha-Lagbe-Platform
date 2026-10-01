import React, { useState } from "react";
import {
  X,
  Printer,
  Copy,
  Check,
  Key,
  FileText,
  List,
  ClipboardList,
  Home,
  ArrowRightLeft,
  Zap,
  Droplets,
  Flame,
  Gauge,
  CalendarDays,
  Building2,
  User,
  Phone,
} from "lucide-react";

const EVENT_TYPES = {
  move_in: "Move-In / ফ্ল্যাট বুঝে নেওয়া",
  move_out: "Move-Out / ফ্ল্যাট হস্তান্তর",
  key_deposit: "Key Deposit Receipt / চাবির জামানত রসিদ",
};

export default function KeyHandoverReceiptModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("receipt"); // "receipt" | "checklist" | "meters"
  const [copied, setCopied] = useState(false);
  const [eventType, setEventType] = useState("move_in");

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    // Property
    propertyAddress: "House 14, Road 7, Block B, Bashundhara R/A, Dhaka-1229",
    flatNo: "Flat # 3A, 3rd Floor",
    buildingName: "Sunrise Heights",

    // Landlord
    landlordName: "Mr. Rafiqul Islam",
    landlordPhone: "01819-456789",
    landlordNid: "19651234567890",

    // Tenant
    tenantName: "MD Hasib Ullah Khan Alvie",
    tenantPhone: "01712-345678",
    tenantNid: "19982692019283741",

    // Event
    eventDate: today,
    eventTime: "11:00 AM",
    keyDepositAmount: 2000,
    numMainKeys: 2,
    numGateKeys: 1,
    numLetterBoxKey: 1,
    numCarParkRemote: 0,
    receiptNo: `KDR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,

    // Meter readings
    electricityMeterNo: "DESCO-2039181",
    electricityReading: "04821",
    gasMeterNo: "TITAS-98271",
    gasReading: "1203",
    wasaMeterNo: "WASA-MNO-3827",
    wasaReading: "0091",

    // Checklist  
    checklistItems: [
      { label: "Main Door Lock & Key", tenantOk: true, landlordOk: true },
      { label: "Grille Gate Lock & Key", tenantOk: true, landlordOk: true },
      { label: "All Room Locks Working", tenantOk: true, landlordOk: true },
      { label: "All Windows & Latches OK", tenantOk: true, landlordOk: true },
      { label: "Bathroom Fittings & Flush", tenantOk: true, landlordOk: false },
      { label: "Kitchen Sink & Tap OK", tenantOk: true, landlordOk: true },
      { label: "All Electrical Switches OK", tenantOk: false, landlordOk: true },
      { label: "Fan & Light Fittings", tenantOk: true, landlordOk: true },
      { label: "AC Units (if provided)", tenantOk: false, landlordOk: false },
      { label: "Gas Burner / Pipeline", tenantOk: true, landlordOk: true },
      { label: "Floor & Wall Tiles Intact", tenantOk: true, landlordOk: true },
      { label: "Roof / Terrace Access", tenantOk: true, landlordOk: true },
    ],

    // Notes
    additionalNotes: "",
  });

  const set = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleChecklist = (idx, who) => {
    setForm((prev) => {
      const updated = prev.checklistItems.map((item, i) =>
        i === idx ? { ...item, [who]: !item[who] } : item
      );
      return { ...prev, checklistItems: updated };
    });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // ── Key Deposit Receipt Text ──────────────────────────────────────
  const receiptText = `
চাবি জামানত ও ফ্ল্যাট হস্তান্তর রসিদ
(Flat Key Handover & Security Deposit Receipt)
রসিদ নং: ${form.receiptNo}
তারিখ: ${form.eventDate}   সময়: ${form.eventTime}
ঘটনার ধরন: ${EVENT_TYPES[eventType]}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

সম্পত্তির বিবরণ:
ভবন: ${form.buildingName}
ঠিকানা: ${form.propertyAddress}
ফ্ল্যাট নং: ${form.flatNo}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

বাড়িওয়ালার তথ্য (Landlord):
নাম: ${form.landlordName}
মোবাইল: ${form.landlordPhone}
জাতীয় পরিচয়পত্র: ${form.landlordNid}

ভাড়াটিয়ার তথ্য (Tenant):
নাম: ${form.tenantName}
মোবাইল: ${form.tenantPhone}
জাতীয় পরিচয়পত্র: ${form.tenantNid}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

হস্তান্তরকৃত চাবির বিবরণ (Keys Handed Over):
১. মূল ফ্ল্যাটের চাবি (Main Door Key):    ${form.numMainKeys} টি
২. গ্রিল গেটের চাবি (Grille Gate Key):    ${form.numGateKeys} টি
৩. লেটারবক্স / মিটার রুম চাবি:           ${form.numLetterBoxKey} টি
৪. কার পার্ক রিমোট (Parking Remote):      ${form.numCarParkRemote} টি

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

চাবির জামানত (Key Deposit Amount):
জামানতের পরিমাণ: ৳ ${Number(form.keyDepositAmount).toLocaleString("en-IN")}/- (কথায়: ${form.keyDepositAmount} টাকা মাত্র)

উপরোক্ত পরিমাণ নগদে/ব্যাংক হস্তান্তরে গ্রহণ করা হইয়াছে।
চুক্তিকাল শেষে সকল চাবি সম্পূর্ণ ও সুস্থ অবস্থায় ফেরত দিলে জামানত সম্পূর্ণ ফেরতযোগ্য।
চাবি হারানো বা ক্ষতির ক্ষেত্রে লক পরিবর্তনের খরচ জামানত হইতে কাটা যাইবে।

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

মিটার রিডিং (Handover Date Meter Readings):
বিদ্যুৎ মিটার নং: ${form.electricityMeterNo}    রিডিং: ${form.electricityReading} kWh
গ্যাস মিটার নং:    ${form.gasMeterNo}    রিডিং: ${form.gasReading} m³
ওয়াসা মিটার নং:  ${form.wasaMeterNo}    রিডিং: ${form.wasaReading} ইউনিট

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${form.additionalNotes ? `বিশেষ দ্রষ্টব্য: ${form.additionalNotes}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━` : ""}

বাড়িওয়ালার স্বাক্ষর: ______________________
নাম ও তারিখ: ${form.landlordName}, ${form.eventDate}

ভাড়াটিয়ার স্বাক্ষর: ______________________
নাম ও তারিখ: ${form.tenantName}, ${form.eventDate}

সাক্ষী স্বাক্ষর: ______________________
  `.trim();

  // ── Checklist summary ──────────────────────────────────────────────
  const itemsOk = form.checklistItems.filter((i) => i.tenantOk && i.landlordOk).length;
  const itemsPartial = form.checklistItems.filter((i) => i.tenantOk !== i.landlordOk).length;
  const itemsIssue = form.checklistItems.filter((i) => !i.tenantOk && !i.landlordOk).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-orange-950 px-6 py-4 border-b border-amber-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-400">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white">
                  Key Handover & Flat Transfer Receipt
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                  চাবি জামানত ও হস্তান্তর
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Move-In / Move-Out Receipt · Key Deposit Voucher · Meter Readings · Handover Checklist
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 pt-2 gap-1 overflow-x-auto text-sm">
          {[
            { id: "receipt", icon: <FileText className="w-4 h-4" />, label: "Key Deposit Receipt (রসিদ)" },
            { id: "checklist", icon: <ClipboardList className="w-4 h-4" />, label: "Handover Checklist (যাচাইসূচি)" },
            { id: "meters", icon: <Gauge className="w-4 h-4" />, label: "Meter Readings (মিটার রিডিং)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-amber-400 text-amber-300 bg-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">

          {/* ── Common Info ── */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Home className="w-4 h-4 text-amber-400" />
              <span>Property & Party Details (সম্পত্তি ও পক্ষের বিবরণ)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Flat No & Floor</label>
                <input type="text" value={form.flatNo} onChange={(e) => set("flatNo", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Building Name</label>
                <input type="text" value={form.buildingName} onChange={(e) => set("buildingName", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Landlord Name</label>
                <input type="text" value={form.landlordName} onChange={(e) => set("landlordName", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Tenant Name</label>
                <input type="text" value={form.tenantName} onChange={(e) => set("tenantName", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Event Type</label>
                <select value={eventType} onChange={(e) => setEventType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500">
                  {Object.entries(EVENT_TYPES).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Handover Date</label>
                <input type="date" value={form.eventDate} onChange={(e) => set("eventDate", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Time</label>
                <input type="text" value={form.eventTime} onChange={(e) => set("eventTime", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Receipt No</label>
                <input type="text" value={form.receiptNo} onChange={(e) => set("receiptNo", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500" />
              </div>
            </div>
          </div>

          {/* ── TAB 1: KEY DEPOSIT RECEIPT ── */}
          {activeTab === "receipt" && (
            <div className="space-y-4">

              {/* Key counts & deposit */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Keys Issued & Deposit (চাবির সংখ্যা ও জামানত)</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Main Door Keys</label>
                    <input type="number" min="0" value={form.numMainKeys} onChange={(e) => set("numMainKeys", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Grille Gate Keys</label>
                    <input type="number" min="0" value={form.numGateKeys} onChange={(e) => set("numGateKeys", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Letterbox Key</label>
                    <input type="number" min="0" value={form.numLetterBoxKey} onChange={(e) => set("numLetterBoxKey", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Car Park Remote</label>
                    <input type="number" min="0" value={form.numCarParkRemote} onChange={(e) => set("numCarParkRemote", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Key Deposit (৳)</label>
                    <input type="number" min="0" value={form.keyDepositAmount} onChange={(e) => set("keyDepositAmount", e.target.value)}
                      className="w-full bg-slate-900 border border-amber-700 rounded-lg px-3 py-2 text-amber-300 font-bold" />
                  </div>
                </div>
              </div>

              {/* Key deposit amount card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-amber-950/40 border border-amber-800/40 rounded-xl p-4 sm:col-span-1">
                  <span className="text-xs text-amber-400">Key Deposit Amount</span>
                  <div className="text-3xl font-extrabold text-amber-300 mt-1">
                    ৳ {Number(form.keyDepositAmount).toLocaleString("en-IN")}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Refundable on safe return of all keys</div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 sm:col-span-2">
                  <span className="text-xs text-slate-400 block mb-2">Additional Notes (বিশেষ মন্তব্য)</span>
                  <textarea
                    rows={3}
                    value={form.additionalNotes}
                    onChange={(e) => set("additionalNotes", e.target.value)}
                    placeholder="e.g. কিচেন সিঙ্কের ট্যাপ সামান্য ঢিলা, পরবর্তী ১ সপ্তাহের মধ্যে ঠিক করা হইবে..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>
              </div>

              {/* Action row */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-xs font-semibold text-slate-300">
                  মুদ্রণযোগ্য চাবি জামানত রসিদ (Official Printable Key Deposit Receipt)
                </span>
                <div className="flex gap-2">
                  <button onClick={() => handleCopy(receiptText)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied!" : "Copy Receipt"}</span>
                  </button>
                  <button onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold shadow transition">
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>
                </div>
              </div>

              {/* Receipt preview */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner border-l-4 border-l-amber-500">
                {receiptText}
              </div>
            </div>
          )}

          {/* ── TAB 2: HANDOVER CHECKLIST ── */}
          {activeTab === "checklist" && (
            <div className="space-y-4">

              {/* Summary badges */}
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="px-3 py-1.5 bg-emerald-950/50 border border-emerald-700/40 text-emerald-300 rounded-full font-semibold">
                  ✓ Both Agreed: {itemsOk}
                </span>
                <span className="px-3 py-1.5 bg-amber-950/50 border border-amber-700/40 text-amber-300 rounded-full font-semibold">
                  ⚠ Disputed: {itemsPartial}
                </span>
                <span className="px-3 py-1.5 bg-rose-950/50 border border-rose-700/40 text-rose-300 rounded-full font-semibold">
                  ✗ Issues Found: {itemsIssue}
                </span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <div className="grid grid-cols-[1fr_auto_auto] items-center bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <span>Item (বিষয়)</span>
                  <span className="w-24 text-center">Tenant (ভাড়াটিয়া)</span>
                  <span className="w-24 text-center">Landlord (মালিক)</span>
                </div>
                {form.checklistItems.map((item, idx) => {
                  const bothOk = item.tenantOk && item.landlordOk;
                  const bothBad = !item.tenantOk && !item.landlordOk;
                  return (
                    <div
                      key={idx}
                      className={`grid grid-cols-[1fr_auto_auto] items-center px-4 py-2.5 border-b border-slate-800/60 text-xs transition ${
                        bothOk ? "bg-emerald-950/10" : bothBad ? "bg-rose-950/20" : "bg-amber-950/10"
                      }`}
                    >
                      <span className="text-slate-200">{item.label}</span>
                      <div className="w-24 flex justify-center">
                        <button
                          onClick={() => toggleChecklist(idx, "tenantOk")}
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold transition ${
                            item.tenantOk
                              ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                              : "border-rose-600 bg-rose-900/20 text-rose-400"
                          }`}
                        >
                          {item.tenantOk ? "✓" : "✗"}
                        </button>
                      </div>
                      <div className="w-24 flex justify-center">
                        <button
                          onClick={() => toggleChecklist(idx, "landlordOk")}
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold transition ${
                            item.landlordOk
                              ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                              : "border-rose-600 bg-rose-900/20 text-rose-400"
                          }`}
                        >
                          {item.landlordOk ? "✓" : "✗"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end">
                <button onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold shadow transition">
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Handover Checklist</span>
                </button>
              </div>
            </div>
          )}

          {/* ── TAB 3: METER READINGS ── */}
          {activeTab === "meters" && (
            <div className="space-y-5">

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 flex items-start gap-3">
                <Gauge className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>কেন মিটার রিডিং রেকর্ড জরুরি?</strong> বাসা বদলের দিন মিটার রিডিং রেকর্ড না করলে পরবর্তী বিলের দায়-দায়িত্ব নিয়ে বাড়িওয়ালা ও ভাড়াটিয়ার মধ্যে বিরোধ হতে পারে। হস্তান্তর রসিদে স্বাক্ষরিত মিটার রিডিং উভয় পক্ষের জন্য আইনি সুরক্ষা দেয়।
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Electricity */}
                <div className="bg-slate-950 border border-yellow-900/40 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-yellow-400 font-semibold text-sm">
                    <Zap className="w-4 h-4" />
                    <span>Electricity (DESCO/DPDC)</span>
                  </div>
                  <div className="text-xs space-y-2">
                    <div>
                      <label className="text-slate-400 block mb-1">Meter No</label>
                      <input type="text" value={form.electricityMeterNo} onChange={(e) => set("electricityMeterNo", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono" />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Reading on Handover Date (kWh)</label>
                      <input type="text" value={form.electricityReading} onChange={(e) => set("electricityReading", e.target.value)}
                        className="w-full bg-slate-900 border border-yellow-700 rounded-lg px-3 py-2 text-yellow-300 font-bold font-mono text-lg" />
                    </div>
                  </div>
                </div>

                {/* Gas */}
                <div className="bg-slate-950 border border-orange-900/40 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-orange-400 font-semibold text-sm">
                    <Flame className="w-4 h-4" />
                    <span>Gas (Titas / Bakhrabad)</span>
                  </div>
                  <div className="text-xs space-y-2">
                    <div>
                      <label className="text-slate-400 block mb-1">Meter No</label>
                      <input type="text" value={form.gasMeterNo} onChange={(e) => set("gasMeterNo", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono" />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Reading on Handover Date (m³)</label>
                      <input type="text" value={form.gasReading} onChange={(e) => set("gasReading", e.target.value)}
                        className="w-full bg-slate-900 border border-orange-700 rounded-lg px-3 py-2 text-orange-300 font-bold font-mono text-lg" />
                    </div>
                  </div>
                </div>

                {/* WASA Water */}
                <div className="bg-slate-950 border border-cyan-900/40 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                    <Droplets className="w-4 h-4" />
                    <span>WASA Water Meter</span>
                  </div>
                  <div className="text-xs space-y-2">
                    <div>
                      <label className="text-slate-400 block mb-1">Meter No</label>
                      <input type="text" value={form.wasaMeterNo} onChange={(e) => set("wasaMeterNo", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono" />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Reading on Handover Date</label>
                      <input type="text" value={form.wasaReading} onChange={(e) => set("wasaReading", e.target.value)}
                        className="w-full bg-slate-900 border border-cyan-700 rounded-lg px-3 py-2 text-cyan-300 font-bold font-mono text-lg" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Meter summary print card */}
              <div className="bg-slate-950 border border-slate-700 rounded-xl p-4 font-mono text-xs text-slate-200 whitespace-pre leading-relaxed">
{`মিটার রিডিং সার্টিফিকেট — হস্তান্তরের তারিখ: ${form.eventDate}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ফ্ল্যাট: ${form.flatNo} | ${form.buildingName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ বিদ্যুৎ মিটার: ${form.electricityMeterNo.padEnd(20)} রিডিং: ${form.electricityReading} kWh
🔥 গ্যাস মিটার:  ${form.gasMeterNo.padEnd(20)} রিডিং: ${form.gasReading} m³
💧 WASA মিটার:   ${form.wasaMeterNo.padEnd(20)} রিডিং: ${form.wasaReading} unit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
মালিক স্বাক্ষর: _______________  ভাড়াটিয়া স্বাক্ষর: _______________`}
              </div>

              <div className="flex justify-end">
                <button onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg font-semibold shadow transition">
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Meter Certificate</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Basha Lagbe · Key Handover & Flat Transfer Portal · Bangladesh</span>
          </div>
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition">
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
