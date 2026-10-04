import React, { useState, useMemo } from "react";
import {
  X,
  Printer,
  Copy,
  Check,
  Zap,
  Droplets,
  Flame,
  Globe,
  AlertOctagon,
  FileText,
  PhoneCall,
  ShieldCheck,
  Send,
  Building2,
  Calendar,
  Sparkles,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

const PROVIDERS = {
  electricity: [
    { id: "desco", name: "DESCO (Dhaka Electric Supply Company)", zone: "Dhaka North / Mirpur, Uttara, Gulshan, Baridhara", hotline: "16120" },
    { id: "dpdc", name: "DPDC (Dhaka Power Distribution Company)", zone: "Dhaka South / Dhanmondi, Motijheel, Old Dhaka, Narayanganj", hotline: "16116" },
    { id: "breb", name: "BREB / Palli Bidyut Samity", zone: "Rural & Sub-urban areas (Gazipur, Savar, Keraniganj)", hotline: "17616" },
    { id: "bpdb", name: "BPDB (Bangladesh Power Development Board)", zone: "Chittagong, Sylhet, Mymensingh, Cumilla divisions", hotline: "16200" },
    { id: "nesco", name: "NESCO (Northern Electricity Supply Co.)", zone: "Rajshahi & Rangpur divisions", hotline: "16603" },
  ],
  water: [
    { id: "dwasa", name: "Dhaka WASA (ঢাকা ওয়াসা)", zone: "Dhaka Metropolitan Areas (MODS Zone 1 to 10)", hotline: "16162" },
    { id: "cwasa", name: "Chattogram WASA (চট্টগ্রাম ওয়াসা)", zone: "Chattogram City Corporation Areas", hotline: "02333322741" },
    { id: "kwasa", name: "Khulna WASA (খুলনা ওয়াসা)", zone: "Khulna Metropolitan Areas", hotline: "02477723460" },
    { id: "rwasa", name: "Rajshahi WASA (রাজশাহী ওয়াসা)", zone: "Rajshahi City Corporation Areas", hotline: "02588855420" },
  ],
  gas: [
    { id: "titas", name: "Titas Gas T&D Co. Ltd. (তিতাস গ্যাস)", zone: "Dhaka, Gazipur, Narayanganj, Narsingdi, Manikganj", hotline: "16496" },
    { id: "kgdcl", name: "Karnaphuli Gas Distribution Co. (কর্ণফুলী গ্যাস)", zone: "Chattogram & CHT areas", hotline: "16513" },
    { id: "bgdcl", name: "Bakhrabad Gas Distribution Co. (বাখরাবাদ গ্যাস)", zone: "Cumilla, Brahmanbaria, Chandpur, Noakhali", hotline: "16524" },
    { id: "jgtdsl", name: "Jalalabad Gas T&D System Ltd. (জালালাবাদ গ্যাস)", zone: "Sylhet, Sunamganj, Moulvibazar, Habiganj", hotline: "16525" },
  ],
  internet: [
    { id: "btrc", name: "BTRC Consumer Redressal Cell (বিটিআরসি)", zone: "National Telecom & Broadband Regulator", hotline: "100" },
    { id: "isp", name: "Local Broadband ISP Provider (আইএসপি)", zone: "Neighborhood Optical Fiber Internet Provider", hotline: "Provider NOC" },
  ],
};

const DISPUTE_TYPES = {
  electricity: [
    "অতিরিক্ত ও ভূতুরে বিদ্যুৎ বিল (Abnormal High / Ghost Billing)",
    "প্রিপেইড স্মার্ট মিটার ত্রুটি / বেশি ইউনিট কাটার অভিযোগ (Faulty Prepaid Meter)",
    "ঘন ঘন লোডশেডিং ও লো-ভোল্টেজ সমস্যা (Frequent Outage & Low Voltage)",
    "মিটার পুড়ে যাওয়া / কারিগরি ত্রুটি স্থানান্তর (Burnt Meter Replacement)",
    "বিল পরিশোধ সত্ত্বেও সংযোগ বিচ্ছিন্ন সংক্রান্ত (Unlawful Disconnection)",
  ],
  water: [
    "ময়লা, দুর্গন্ধযুক্ত ও অপব্যবহারযোগ্য পানি সরবরাহ (Contaminated / Dirty Water)",
    "পানির তীব্র সংকট ও লাইনে পানি না থাকা (Severe Water Scarcity / Zero Supply)",
    "অস্বাভাবিক পানির মিটার রিডিং ও অতিরিক্ত বিল (Abnormal Water Meter Bill)",
    "পানির প্রধান লাইনে লিকেজ / রাস্তা প্লাবিত (Main Pipeline Leakage / Overflow)",
    "পয়ঃনিষ্কাশন ও ম্যানহোল উপচে পড়ার অভিযোগ (Sewerage Blockage & Overflow)",
  ],
  gas: [
    "রান্নার সময় গ্যাসের তীব্র চাপস্বল্পতা / গ্যাস না থাকা (Extremely Low Gas Pressure)",
    "গ্যাস পাইপলাইনে লিকেজ ও তীব্র গন্ধ ছড়ানো (Hazardous Gas Pipeline Leakage)",
    "প্রিপেইড গ্যাস কার্ড রিচার্জ সমস্যা / মিটার লক (Prepaid Gas Card Error)",
    "চুলা বন্ধ থাকা সত্ত্বেও অতিরিক্ত বিলিং (Disputed Billed Burners Count)",
  ],
  internet: [
    "ঘন ঘন অপটিক্যাল ফাইবার কর্তন ও দীর্ঘকালীন নেট বন্ধ (Frequent Fiber Outage)",
    "প্যাকেজ অনুযায়ী প্রতিশ্রুত স্পিড না পাওয়া (Throttled Speed vs SLA Package)",
    "নেট সংযোগ বিচ্ছিন্ন থাকাকালীন বিল সমন্বয় / রিবেট দাবি (Bill Rebate for Outage)",
  ],
};

export default function UtilityComplaintDisputeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeCategory, setActiveCategory] = useState("electricity"); // "electricity" | "water" | "gas" | "internet"
  const [selectedProvider, setSelectedProvider] = useState(PROVIDERS.electricity[0].id);
  const [disputeSubject, setDisputeSubject] = useState(DISPUTE_TYPES.electricity[0]);
  const [lang, setLang] = useState("bn"); // "bn" | "en"
  const [copied, setCopied] = useState(false);

  // Form details
  const [form, setForm] = useState({
    consumerName: "MD Hasib Ullah Khan Alvie",
    consumerPhone: "01712-345678",
    consumerEmail: "hasibullah.khan.alvie@g.bracu.ac.bd",
    consumerNid: "19982692019283741",
    customerNo: "DPDC-AC-892104",
    meterNo: "DESCO-MTR-772910",
    zoneOffice: "Zone Office: Gulshan-2, Circle: Dhaka North",
    premiseAddress: "House 14, Road 7, Block B, Bashundhara R/A, Dhaka-1229",
    disputedMonth: "September 2026",
    normalAvgBill: 3500,
    disputedBillAmount: 18500,
    previousTicketNo: "TICKET-2026-9812",
    details: "বিগত কয়েক মাস যাবৎ গড় বিদ্যুৎ বিল ৩,০০০ থেকে ৪,০০০ টাকার মধ্যে আসলেও সেপ্টেম্বর ২০২৬ মাসে কোনো কারণ ব্যতিরেকে ১৮,৫০০ টাকা অতিরিক্ত ও অস্বাভাবিক ভূতুরে বিল ইস্যু করা হয়েছে। কোনো বাড়তি ভারী যন্ত্রপাতি সংযোজন করা হয় নাই।",
  });

  const setField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  // Switch category handler
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setSelectedProvider(PROVIDERS[cat][0].id);
    setDisputeSubject(DISPUTE_TYPES[cat][0]);
    if (cat === "water") {
      setForm((prev) => ({
        ...prev,
        customerNo: "WASA-A/C-558291",
        meterNo: "WM-882190",
        zoneOffice: "MODS Zone 4, Dhaka WASA",
        details: "গত ১৫ দিন যাবত আমাদের আবাসিক ভবনের ওয়াসার লাইনে দুর্গন্ধযুক্ত ও ঘোলাটে কালো পানি সরবরাহ হইতেছে যাহা ব্যবহারের সম্পূর্ণ অনুপযোগী এবং পরিবারের সদস্যদের পেটের পীড়া সৃষ্টি করিতেছে।",
      }));
    } else if (cat === "gas") {
      setForm((prev) => ({
        ...prev,
        customerNo: "TITAS-GAS-449102",
        meterNo: "TITAS-MTR-3019",
        zoneOffice: "Titas Zonal Office, Kuril / Vatara",
        details: "সকাল ৬টা হইতে দুপুর ২টা এবং সন্ধ্যা ৬টা হইতে রাত ১১টা পর্যন্ত চুলায় বিন্দুমাত্র গ্যাস থাকে না। রান্নাবান্না চরমভাবে ব্যাহত হইতেছে। দ্রুত লাইনের প্রেসার বৃদ্ধি করার জোর আবেদন জানাইতেছি।",
      }));
    } else if (cat === "internet") {
      setForm((prev) => ({
        ...prev,
        customerNo: "ISP-USER-9921",
        meterNo: "ONU-MAC-48:2C:90",
        zoneOffice: "BTRC Redressal Cell / Local ISP Office",
        details: "৫০ এমবিপিএস প্রিমিয়াম প্যাকেজের মাসিক বিল পরিশোধ করা সত্ত্বেও গত ১ মাসে মোট ৯ দিন সম্পূর্ণ ইন্টারনেট সংযোগ বিচ্ছিন্ন ছিল। বিল সমন্বয় এবং অবিলম্বে অপটিক্যাল ফাইবার লাইন পুনঃস্থাপন দাবি করিতেছি।",
      }));
    }
  };

  const currentProviderObj = useMemo(() => {
    const list = PROVIDERS[activeCategory] || [];
    return list.find((p) => p.id === selectedProvider) || list[0];
  }, [activeCategory, selectedProvider]);

  // Generate Letter Text (Bengali)
  const letterBn = useMemo(() => {
    const today = new Date().toLocaleDateString("bn-BD");
    return `তারিখ: ${today}

বরাবর,
নির্বাহী প্রকৌশলী / জোনাল ম্যানেজার
${currentProviderObj.name}
${form.zoneOffice}

বিষয়: ${disputeSubject} সংক্রান্ত আবেদন ও প্রতিকার প্রার্থনা।

মহোদয়,
বিনীত নিবেদন এই যে, আমি নিম্নস্বাক্ষরকারী ${form.consumerName}, ${form.premiseAddress} ঠিকানায় অবস্থিত আবাসিক ভবনের একজন নিয়মিত গ্রাহক (গ্রাহক হিসাব / কনজিউমার নং: ${form.customerNo}, মিটার নং: ${form.meterNo})। আমি প্রতিমাসে নিয়মিত ও যথাসময়ে ইউটিলিটি বিল পরিশোধ করিয়া আসিতেছি।

অত্র পত্রের মাধ্যমে আপনার সদয় অবগতির জন্য জানাইতেছি যে, ${form.details}

পরিসংখ্যান ও বিলের বিবরণ:
- গ্রাহকের নাম: ${form.consumerName} (মোবাইল: ${form.consumerPhone})
- সংযোগের ঠিকানা: ${form.premiseAddress}
- গ্রাহক আইডি / হিসাব নং: ${form.customerNo}
- মিটার নম্বর: ${form.meterNo}
- বিতর্কিত সময়কাল/মাস: ${form.disputedMonth}
- স্বাভাবিক গড় মাসিক বিল: ৳${Number(form.normalAvgBill).toLocaleString("en-IN")}/-
- বিতর্কিত অতিরিক্ত বিল: ৳${Number(form.disputedBillAmount).toLocaleString("en-IN")}/-
- পূর্ববর্তী হেল্পলাইন অভিযোগ নম্বর (যদি থাকে): ${form.previousTicketNo || "N/A"}

এমতাবস্থায়, মহোদয়ের নিকট বিনীত প্রার্থনা, উক্ত স্থান সরেজমিনে টেকনিক্যাল টিম প্রেরণপূর্বক মিটার পরীক্ষা ও অতিরিক্ত ভূতুরে বিল সংশোধন / সমস্যাটি দ্রুত নিরসন করিয়া জনদুর্ভোগ লাঘবে প্রয়োজনীয় প্রশাসনিক ব্যবস্থা গ্রহণে আপনার মর্জি হয়।

সংযুক্তি:
১. বিতর্কিত বিলের ফটোকপি
২. পূর্ববর্তী ৩ মাসের পরিশোধিত বিলের কপি
৩. মিটারের বর্তমান রিডিং ও অবস্থার স্পষ্ট ছবি
৪. জাতীয় পরিচয়পত্রের (NID) ফটোকপি

বিনীত নিবেদক,

স্বাক্ষর: _________________________
নাম: ${form.consumerName}
মোবাইল নং: ${form.consumerPhone}
ইমেইল: ${form.consumerEmail}
এনআইডি: ${form.consumerNid}`;
  }, [form, currentProviderObj, disputeSubject]);

  // Generate Letter Text (English)
  const letterEn = useMemo(() => {
    const today = new Date().toLocaleDateString("en-GB");
    return `Date: ${today}

To:
The Executive Engineer / Zonal Manager
${currentProviderObj.name}
${form.zoneOffice}

Subject: Formal Grievance regarding ${disputeSubject}

Dear Sir/Madam,

I, the undersigned ${form.consumerName}, residing at ${form.premiseAddress}, am a registered and law-abiding residential consumer under your jurisdiction (Customer Account No: ${form.customerNo}, Meter No: ${form.meterNo}).

I am writing this formal grievance to bring to your immediate attention the following utility service dispute:
"${form.details}"

Consumer Account Overview:
- Consumer Name: ${form.consumerName} (Phone: ${form.consumerPhone})
- Premise Address: ${form.premiseAddress}
- Consumer Account No: ${form.customerNo}
- Meter Serial Number: ${form.meterNo}
- Disputed Billing Period: ${form.disputedMonth}
- Typical Average Monthly Bill: BDT ৳${Number(form.normalAvgBill).toLocaleString("en-IN")}
- Disputed Invoiced Amount: BDT ৳${Number(form.disputedBillAmount).toLocaleString("en-IN")}
- Previous Complaint Ticket Reference: ${form.previousTicketNo || "N/A"}

In light of the above facts, I urgently request your technical team to conduct an on-site physical inspection of the meter, rectify the inflated invoice / service anomaly, and restore standard services at the earliest.

Enclosures:
1. Copy of the disputed invoice
2. Paid receipts of the preceding 3 billing cycles
3. Photographic evidence of the current meter reading / line condition
4. Copy of National ID Card (NID)

Sincerely yours,

Signature: _________________________
Name: ${form.consumerName}
Contact: ${form.consumerPhone}
Email: ${form.consumerEmail}
NID: ${form.consumerNid}`;
  }, [form, currentProviderObj, disputeSubject]);

  const activeLetterText = lang === "bn" ? letterBn : letterEn;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-amber-950/60 via-slate-900 to-cyan-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Utility Billing Dispute & Service Complaint Hub
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ওয়াসা, বিদ্যুৎ ও গ্যাস অভিযোগ পত্র
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Official grievance letters for DESCO, DPDC, Dhaka WASA, Titas Gas, BERC & Internet complaints
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

        {/* Category Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-6 pt-3 pb-2 border-b border-slate-800 bg-slate-950/40">
          <button
            onClick={() => handleCategoryChange("electricity")}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold border transition ${
              activeCategory === "electricity"
                ? "bg-amber-600/20 border-amber-500 text-amber-300 shadow-sm"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>১. বিদ্যুৎ (DESCO / DPDC)</span>
          </button>

          <button
            onClick={() => handleCategoryChange("water")}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold border transition ${
              activeCategory === "water"
                ? "bg-cyan-600/20 border-cyan-500 text-cyan-300 shadow-sm"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span>২. পানি ও পয়ঃনিষ্কাশন (WASA)</span>
          </button>

          <button
            onClick={() => handleCategoryChange("gas")}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold border transition ${
              activeCategory === "gas"
                ? "bg-rose-600/20 border-rose-500 text-rose-300 shadow-sm"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Flame className="w-4 h-4 text-rose-400" />
            <span>৩. গ্যাস লাইন (Titas Gas)</span>
          </button>

          <button
            onClick={() => handleCategoryChange("internet")}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold border transition ${
              activeCategory === "internet"
                ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>৪. ব্রডব্যান্ড নেট (ISP / BTRC)</span>
          </button>
        </div>

        {/* Emergency Hotline Banner */}
        <div className="px-6 py-2 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>
              <strong>{currentProviderObj.name} Hotline:</strong>{" "}
              <span className="text-emerald-400 font-bold text-sm">{currentProviderObj.hotline}</span>
            </span>
            <span className="text-slate-500 hidden sm:inline">| {currentProviderObj.zone}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-amber-400 bg-amber-950/30 px-2.5 py-1 rounded-lg border border-amber-800/40">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>BERC নিয়ম: তদন্ত চলাকালীন সংযোগ বিচ্ছিন্ন করা সম্পূর্ণ অবৈধ</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Form Setup (5 cols) */}
            <div className="lg:col-span-5 space-y-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>অভিযোগ বিবরণী ফরম (Enter Details)</span>
                </h3>
                
                {/* Language switch */}
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs">
                  <button
                    onClick={() => setLang("bn")}
                    className={`px-2 py-1 rounded font-medium transition ${
                      lang === "bn" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    বাংলা
                  </button>
                  <button
                    onClick={() => setLang("en")}
                    className={`px-2 py-1 rounded font-medium transition ${
                      lang === "en" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 text-xs">
                {/* Provider selection */}
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Service Provider / সংস্থা:</label>
                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    {PROVIDERS[activeCategory].map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dispute subject */}
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Nature of Complaint / অভিযোগের ধরণ:</label>
                  <select
                    value={disputeSubject}
                    onChange={(e) => setDisputeSubject(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    {DISPUTE_TYPES[activeCategory].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Consumer basic */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Consumer Name:</label>
                    <input
                      type="text"
                      value={form.consumerName}
                      onChange={(e) => setField("consumerName", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Phone Number:</label>
                    <input
                      type="text"
                      value={form.consumerPhone}
                      onChange={(e) => setField("consumerPhone", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                </div>

                {/* Account & Meter */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Customer / A/C No:</label>
                    <input
                      type="text"
                      value={form.customerNo}
                      onChange={(e) => setField("customerNo", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Meter Serial No:</label>
                    <input
                      type="text"
                      value={form.meterNo}
                      onChange={(e) => setField("meterNo", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                </div>

                {/* Zonal Office & Address */}
                <div>
                  <label className="text-slate-400 block mb-1">Zonal / Circle Office Name:</label>
                  <input
                    type="text"
                    value={form.zoneOffice}
                    onChange={(e) => setField("zoneOffice", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Premise Address / বাসার পূর্ণ ঠিকানা:</label>
                  <input
                    type="text"
                    value={form.premiseAddress}
                    onChange={(e) => setField("premiseAddress", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                  />
                </div>

                {/* Financial figures */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Normal Avg Bill (৳):</label>
                    <input
                      type="number"
                      value={form.normalAvgBill}
                      onChange={(e) => setField("normalAvgBill", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Disputed Billed (৳):</label>
                    <input
                      type="number"
                      value={form.disputedBillAmount}
                      onChange={(e) => setField("disputedBillAmount", e.target.value)}
                      className="w-full bg-slate-900 border border-rose-500/50 rounded px-2 py-1 text-rose-300 font-semibold"
                    />
                  </div>
                </div>

                {/* Complaint details textarea */}
                <div>
                  <label className="text-slate-400 block mb-1">Problem Description / সমস্যার বিবরণ:</label>
                  <textarea
                    rows={3}
                    value={form.details}
                    onChange={(e) => setField("details", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white text-xs leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Live Letterhead & Print Preview (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Official Petition / Application Letter</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(activeLetterText)}
                    className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg transition border border-slate-700"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied!" : "Copy Text"}</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition shadow"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Application</span>
                  </button>
                </div>
              </div>

              {/* Printable Document Box */}
              <div className="bg-white text-slate-900 p-6 sm:p-7 rounded-xl shadow-lg border border-slate-200 font-sans text-xs leading-relaxed max-h-[55vh] overflow-y-auto whitespace-pre-wrap">
                {activeLetterText}
              </div>

              {/* Action Bar */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Direct submission to Zonal Engineer or WhatsApp forwarding:</span>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(activeLetterText)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white font-semibold px-3 py-1.5 rounded-lg transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Share via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Compliant with BERC Consumer Rights Regulations & WASA Grievance Protocol</span>
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
