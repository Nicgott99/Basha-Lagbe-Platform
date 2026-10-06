import React, { useState, useMemo } from "react";
import {
  X,
  Printer,
  Copy,
  Check,
  Wrench,
  Hammer,
  ShieldCheck,
  FileText,
  User,
  Phone,
  Building,
  Calendar,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Paintbrush,
  Zap,
  Droplets,
  HardHat,
  DoorOpen,
} from "lucide-react";

const MODIFICATION_TYPES = [
  { id: "ac", label: "AC Outdoor Core-Drilling & Installation (এসি স্থাপন ও ড্রিলিং)", icon: "zap" },
  { id: "tv_wall", label: "Wall-Mounting TV / Heavy Bracket Drilling (টিভি ওয়াল মাউন্ট)", icon: "wrench" },
  { id: "geyser_ro", label: "Water Geyser & RO Purifier Plumbing (গিজার ও ওয়াটার ফিল্টার)", icon: "droplets" },
  { id: "paint", label: "Interior Wall Repainting & Wallpaper (অভ্যন্তরীণ দেয়াল রঙ)", icon: "paintbrush" },
  { id: "fiber", label: "Broadband Optical Fiber Cable Routing (ইন্টারনেট ফাইবার লাইন)", icon: "zap" },
  { id: "partition", label: "Temporary Wooden / Aluminum Partition (অস্থায়ী পার্টিশন)", icon: "hammer" },
];

export default function RenovationNocPermitModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("noc"); // "noc" | "gatepass" | "bylaws"
  const [lang, setLang] = useState("bn"); // "bn" | "en"
  const [copied, setCopied] = useState(false);

  // Selected modifications
  const [selectedMods, setSelectedMods] = useState(["ac", "tv_wall", "geyser_ro"]);

  // Form Details
  const [form, setForm] = useState({
    propertyAddress: "Flat 4A, Sunrise Heights, House 14, Road 7, Block B, Bashundhara R/A, Dhaka-1229",
    flatNo: "Flat # 4A (4th Floor)",
    buildingName: "Sunrise Heights (সানরাইজ হাইটস)",
    
    // Landlord Info
    landlordName: "Alhaj Rafiqul Islam",
    landlordPhone: "01819-456789",
    landlordNid: "19651234567890",

    // Tenant Info
    tenantName: "MD Hasib Ullah Khan Alvie",
    tenantPhone: "01712-345678",
    tenantNid: "19982692019283741",

    // Contractor Info
    contractorName: "Md. Kamal Hossain (ElectroFix Engineering)",
    contractorPhone: "01733-889900",
    contractorNid: "19882691234567890",
    numWorkers: 2,
    toolsCarried: "Core drill machine, Step ladder, Tool kit, Vacuum cleaner",

    // Dates & Times
    workStartDate: "10 October 2026",
    workEndDate: "12 October 2026",
    permittedHours: "10:00 AM to 05:00 PM (Silent hours: 1:00 PM - 3:00 PM)",
    specialConditions: "All wall holes must be sealed with waterproof putty. Debris must be removed daily.",
  });

  const setField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const toggleMod = (id) => {
    setSelectedMods((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  // Selected mod labels
  const selectedModLabels = useMemo(() => {
    return MODIFICATION_TYPES.filter((m) => selectedMods.includes(m.id)).map((m) => m.label);
  }, [selectedMods]);

  // Generate Landlord NOC Letter (Bengali)
  const nocTextBn = useMemo(() => {
    const today = new Date().toLocaleDateString("bn-BD");
    const worksList = selectedModLabels.map((item, idx) => `   ${idx + 1}. ${item}`).join("\n");

    return `বাড়িওয়ালার অনাপত্তিপত্র ও ফ্ল্যাট সংস্কার অনুমতিপত্র (LANDLORD NOC)
তারিখ: ${today}

বরাবর,
সভাপতি / সাধারণ সম্পাদক / বিল্ডিং ম্যানেজার
ফ্ল্যাট ওনার্স ওয়েলফেয়ার সোসাইটি, ${form.buildingName}
ঠিকানা: ${form.propertyAddress}

বিষয়: ফ্ল্যাট ${form.flatNo}-এর অভ্যন্তরে অনুমোদিত সংস্কার কাজের অনাপত্তিপত্র (NOC)।

মহোদয়,
আমি নিম্নস্বাক্ষরকারী ${form.landlordName}, জাতীয় পরিচয়পত্র নং: ${form.landlordNid}, ${form.buildingName}-এর ${form.flatNo} ফ্ল্যাটের বৈধ মালিক। 

অত্র পত্রের মাধ্যমে প্রত্যয়ন করিতেছি যে, আমার ফ্ল্যাটের বর্তমান বৈধ ভাড়াটিয়া জনাব ${form.tenantName} (মোবাইল: ${form.tenantPhone}) তাঁহার ব্যক্তিগত সুবিধার জন্য ফ্ল্যাটের অভ্যন্তরে নিম্নলিখিত সংস্কারমূলক কার্যাদি সম্পাদনের আবেদন জানাইয়াছেন এবং আমি উহাতে সম্মতি প্রদান করিলাম:

অনুমোদিত কার্যাদির বিবরণ:
${worksList}

শর্তাবলী:
১. কাজের সময়সীমা: আগামী ${form.workStartDate} হইতে ${form.workEndDate} পর্যন্ত, সময়: ${form.permittedHours}।
২. ভবন কাঠামো সুরক্ষা: মূল পিলার, বিম বা লোড-বেয়ারিং ওয়ালে কোনো স্থায়ী কাঠামোগত ক্ষতিসাধন করা যাইবে না।
৩. শব্দদূষণ ও প্রতিবেশীর স্বস্তি: দুপুর ১:০০ টা হইতে ৩:০০ টা পর্যন্ত কোনো উচ্চশব্দযুক্ত ড্রিলিং করা যাইবে না।
৪. পূর্বাবস্থায় প্রত্যাবর্তন: ভাড়াটিয়া ফ্ল্যাট ছাড়িয়া দেওয়ার সময় উক্ত ড্রিলিং ও সংস্কারসমূহ নিজ খরচে মেরামত করিয়া পূর্বাবস্থায় বুঝাইয়া দিতে বাধ্য থাকিবেন।
৫. নিরাপত্তা ও পরিচ্ছন্নতা: কাজের বর্জ্য প্রতিদিন নিজ দায়িত্বে পরিষ্কার করিতে হইবে।

অতএব, উক্ত টেকনিশিয়ান ও শ্রমিকদিগকে প্রয়োজনীয় মালামালসহ ভবনে প্রবেশের গেট পাস প্রদানের জন্য অনুরোধ জানাইতেছি।

সম্মতি প্রদানকারী (বাড়িওয়ালা): _____________________    ভাড়াটিয়া (অঙ্গীকারকারী): _____________________
নাম: ${form.landlordName}                                 নাম: ${form.tenantName}
মোবাইল: ${form.landlordPhone}                            মোবাইল: ${form.tenantPhone}`;
  }, [form, selectedModLabels]);

  // Generate Landlord NOC Letter (English)
  const nocTextEn = useMemo(() => {
    const today = new Date().toLocaleDateString("en-GB");
    const worksList = selectedModLabels.map((item, idx) => `   ${idx + 1}. ${item}`).join("\n");

    return `LANDLORD NO OBJECTION CERTIFICATE (NOC) & WORK PERMIT
Date: ${today}

To:
The President / General Secretary / Building Manager
Flat Owners Welfare Society, ${form.buildingName}
Premises: ${form.propertyAddress}

Subject: Landlord NOC for Minor Interior Modifications in ${form.flatNo}

Dear Sir/Madam,

I, the undersigned ${form.landlordName} (NID: ${form.landlordNid}), being the lawful owner of ${form.flatNo} in ${form.buildingName}, do hereby grant formal permission to my tenant, Mr. ${form.tenantName} (Phone: ${form.tenantPhone}), to carry out the following approved minor interior works:

Approved Scope of Work:
${worksList}

Terms & Conditions:
1. Authorized Schedule: From ${form.workStartDate} to ${form.workEndDate}, between ${form.permittedHours}.
2. Structural Integrity: No drilling or tampering with structural pillars, beams, or load-bearing columns is permitted.
3. Noise Regulation: High-noise drilling is strictly prohibited during quiet hours (1:00 PM to 3:00 PM).
4. Restitution upon Move-Out: The tenant agrees to seal all drilled holes and restore the flat to original condition upon vacating.
5. Debris Removal: All construction dust and debris must be disposed of outside building premises daily.

Please permit the designated technicians and equipment access to the premises under building security regulations.

Landlord Signature: _____________________        Tenant Signature: _____________________
Name: ${form.landlordName}                          Name: ${form.tenantName}
Phone: ${form.landlordPhone}                        Phone: ${form.tenantPhone}`;
  }, [form, selectedModLabels]);

  // Generate Contractor Security Gate Pass
  const gatePassText = useMemo(() => {
    return `ভবন নিরাপত্তা গেট পাস ও টেকনিশিয়ান অনুমতিপত্র (SECURITY GATE PASS)
তারিখ: ${new Date().toLocaleDateString("bn-BD")}
ইস্যুকারী ফ্ল্যাট: ${form.flatNo} (${form.buildingName})

কন্ট্রাক্টর ও টেকনিশিয়ান তথ্য:
- প্রধান কন্ট্রাক্টর / টেকনিশিয়ানের নাম: ${form.contractorName}
- মোবাইল নম্বর: ${form.contractorPhone}
- জাতীয় পরিচয়পত্র নং (NID): ${form.contractorNid}
- সাথে থাকা মোট শ্রমিক সংখ্যা: ${form.numWorkers} জন

কাজের বিবরণ ও মালামাল:
- কাজের বিষয়: ${selectedModLabels.join(", ")}
- সাথে আনিত যন্ত্রপাতি: ${form.toolsCarried}
- অনুমোদিত কাজের তারিখ: ${form.workStartDate} হইতে ${form.workEndDate}
- অনুমোদিত প্রবেশের সময়: ${form.permittedHours}

ভবন সিকিউরিটি গার্ডের জন্য নির্দেশাবলী:
১. মূল প্রবেশদ্বারে টেকনিশিয়ানদের NID কার্ড যাচাইপূর্বক রেজিস্টারে এন্ট্রি করুন।
২. মালামাল ওঠানামার জন্য শুধুমাত্র সার্ভিস লিফট ব্যবহার নিশ্চিত করুন।
৩. সন্ধ্যা ৫:০০ টার পর কোনো শ্রমিককে ভবনে অবস্থান করিতে দেওয়া যাইবে না।

অনুমোদনকারী ফ্ল্যাট ভাড়াটিয়া: _____________________    নিরাপত্তা কর্মকর্তার স্বাক্ষর: _____________________
নাম: ${form.tenantName} (মোবাইল: ${form.tenantPhone})`;
  }, [form, selectedModLabels]);

  const activeLetterText = lang === "bn" ? nocTextBn : nocTextEn;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Flat Renovation & Interior Modification NOC Hub
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  ফ্ল্যাট সংস্কার ও এসি অনুমতিপত্র
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Landlord work permission NOC, contractor security gate pass & building committee noise by-laws
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

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 pt-3 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab("noc")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "noc"
                  ? "border-cyan-500 text-cyan-400 bg-cyan-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>১. বাড়িওয়ালার অনুমতিপত্র (Landlord NOC)</span>
            </button>
            <button
              onClick={() => setActiveTab("gatepass")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "gatepass"
                  ? "border-cyan-500 text-cyan-400 bg-cyan-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <DoorOpen className="w-4 h-4" />
              <span>২. টেকনিশিয়ান গেট পাস (Security Gate Pass)</span>
            </button>
            <button
              onClick={() => setActiveTab("bylaws")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "bylaws"
                  ? "border-cyan-500 text-cyan-400 bg-cyan-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>৩. ভবন শব্দদূষণ ও কাজের নিয়ম (By-Laws)</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: LANDLORD NOC & MODIFICATION FORM */}
          {activeTab === "noc" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Details (5 cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800 text-xs">
                
                {/* Scope selection */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-2">
                    <Hammer className="w-4 h-4" />
                    <span>Select Scope of Work (কাজের ধরণ):</span>
                  </h3>
                  <div className="space-y-1.5">
                    {MODIFICATION_TYPES.map((m) => {
                      const isSelected = selectedMods.includes(m.id);
                      return (
                        <div
                          key={m.id}
                          onClick={() => toggleMod(m.id)}
                          className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition ${
                            isSelected
                              ? "bg-cyan-950/40 border-cyan-500/60 text-cyan-200"
                              : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-3.5 h-3.5 rounded text-cyan-600 focus:ring-cyan-500 bg-slate-800 border-slate-700"
                          />
                          <span className="text-[11px] font-medium">{m.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-300">Property & Schedule:</h4>
                  <div>
                    <label className="text-slate-400 block mb-0.5">Flat No & Building:</label>
                    <input
                      type="text"
                      value={form.flatNo}
                      onChange={(e) => setField("flatNo", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white mb-1.5"
                    />
                    <input
                      type="text"
                      value={form.propertyAddress}
                      onChange={(e) => setField("propertyAddress", e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-700/60 rounded px-2 py-0.5 text-[11px] text-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-0.5">Start Date:</label>
                      <input
                        type="text"
                        value={form.workStartDate}
                        onChange={(e) => setField("workStartDate", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-0.5">End Date:</label>
                      <input
                        type="text"
                        value={form.workEndDate}
                        onChange={(e) => setField("workEndDate", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-0.5">Landlord Name:</label>
                      <input
                        type="text"
                        value={form.landlordName}
                        onChange={(e) => setField("landlordName", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-0.5">Tenant Name:</label>
                      <input
                        type="text"
                        value={form.tenantName}
                        onChange={(e) => setField("tenantName", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Letterhead & WhatsApp Share (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLang("bn")}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                        lang === "bn" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      বাংলা
                    </button>
                    <button
                      onClick={() => setLang("en")}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                        lang === "en" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      English
                    </button>
                  </div>

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
                      className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition shadow"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print NOC</span>
                    </button>
                  </div>
                </div>

                {/* Printable Document Box */}
                <div className="bg-white text-slate-900 p-6 sm:p-7 rounded-xl shadow-lg border border-slate-200 font-sans text-xs leading-relaxed max-h-[50vh] overflow-y-auto whitespace-pre-wrap">
                  {activeLetterText}
                </div>

                {/* Action Bar */}
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Send NOC directly to Building Secretary or Tenant:</span>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(activeLetterText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white font-semibold px-3 py-1.5 rounded-lg transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Share on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTRACTOR SECURITY GATE PASS */}
          {activeTab === "gatepass" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800 text-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 pb-2 border-b border-slate-800">
                  <HardHat className="w-4 h-4" />
                  <span>Contractor & Technician Details</span>
                </h3>

                <div>
                  <label className="text-slate-400 block mb-1">Contractor / Technician Name:</label>
                  <input
                    type="text"
                    value={form.contractorName}
                    onChange={(e) => setField("contractorName", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Phone Number:</label>
                    <input
                      type="text"
                      value={form.contractorPhone}
                      onChange={(e) => setField("contractorPhone", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">NID No:</label>
                    <input
                      type="text"
                      value={form.contractorNid}
                      onChange={(e) => setField("contractorNid", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">No. of Workers:</label>
                    <input
                      type="number"
                      value={form.numWorkers}
                      onChange={(e) => setField("numWorkers", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Permitted Hours:</label>
                    <input
                      type="text"
                      value={form.permittedHours}
                      onChange={(e) => setField("permittedHours", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Tools Carried / আনীত যন্ত্রপাতি:</label>
                  <input
                    type="text"
                    value={form.toolsCarried}
                    onChange={(e) => setField("toolsCarried", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-[11px]"
                  />
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <DoorOpen className="w-4 h-4" />
                    <span>Security Guard Entry Pass</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(gatePassText)}
                      className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg transition border border-slate-700"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied!" : "Copy Pass"}</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition shadow"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Pass</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white text-slate-900 p-6 sm:p-7 rounded-xl shadow-lg border border-slate-200 font-sans text-xs leading-relaxed max-h-[50vh] overflow-y-auto whitespace-pre-wrap">
                  {gatePassText}
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Send Gate Pass to Building Security Guard:</span>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(gatePassText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white font-semibold px-3 py-1.5 rounded-lg transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Share on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOISE & RENOVATION BY-LAWS */}
          {activeTab === "bylaws" && (
            <div className="space-y-4 text-xs">
              <div className="bg-gradient-to-br from-slate-900 to-cyan-950/40 p-5 rounded-xl border border-cyan-900/40 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <span>Standard Apartment Renovation & Noise Control By-Laws (সংস্কার ও শব্দদূষণ বিধিমালা)</span>
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  বহুতল ভবনে প্রতিবেশীদের শান্তি বজায় রেখে ফ্ল্যাট সংস্কার কাজ পরিচালনার সর্বসম্মত নিয়মাবলী:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-cyan-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>১. নীরব সময় ও ড্রিলিং নিষেধাজ্ঞা (Quiet Hours)</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    দুপুর ১:০০ টা থেকে ৩:০০ টা (বিশ্রাম ও নামাজের সময়) এবং সন্ধ্যা ৫:০০ টার পর যেকোনো ধরণের উচ্চশব্দযুক্ত ওয়াল ড্রিলিং বা হাতুড়ি পেটানো সম্পূর্ণ নিষিদ্ধ।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-indigo-400 flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    <span>২. এসি আউটডোর ড্রেন পাইপ নির্দেশনা</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    এসি আউটডোরের পানির ড্রেন পাইপ অবশ্যই বিল্ডিংয়ের নির্দিষ্ট নিষ্কাশন নালীতে সংযোগ করতে হবে; নিচতলার হাঁটার পথ বা অন্য ফ্ল্যাটের বারান্দায় পানি পড়া শাস্তিযোগ্য অপরাধ।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                    <DoorOpen className="w-4 h-4" />
                    <span>৩. প্যাসেঞ্জার লিফটে সিমেন্ট/বালি বহন নিষেধ</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    ভারী যন্ত্রপাতি, রঙ, পুটিং বা নির্মাণ সামগ্রী ওঠানামার জন্য কেবল সার্ভিস লিফট ব্যবহার করতে হবে এবং লিফটের ফ্লোরে কার্পেট/পলিথিন বিছাতে হবে।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>৪. ২৪ ঘণ্টার মধ্যে আবর্জনা পরিষ্কার</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    সংস্কারজনিত ধুলাবালি ও বর্জ্য কমন করিডোর বা সিঁড়িতে ফেলে রাখা যাবে না। কাজ শেষ হওয়ামাত্র নিজ দায়িত্বে বস্তায় ভরে ভবনের বাইরে অপসারণ করতে হবে।
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Compliant with Dhaka Apartment Welfare Society Standard Rules</span>
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
