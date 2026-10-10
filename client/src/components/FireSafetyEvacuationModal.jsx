import React, { useState, useMemo } from "react";
import {
  X,
  Printer,
  Copy,
  Check,
  Flame,
  ShieldAlert,
  PhoneCall,
  MapPin,
  Building,
  User,
  AlertTriangle,
  CheckCircle2,
  Send,
  Sparkles,
  LifeBuoy,
  Plus,
  Trash2,
  Compass,
  FileText,
  Activity,
} from "lucide-react";

const INITIAL_EXTINGUISHERS = [
  { id: "e1", location: "Ground Floor Main Gate / লবি", type: "ABC Dry Powder (6 kg)", expiryDate: "December 2027", status: "ok" },
  { id: "e2", location: "1st & 2nd Floor Staircase / সিঁড়িমুখ", type: "CO2 Carbon Dioxide (5 kg)", expiryDate: "November 2027", status: "ok" },
  { id: "e3", location: "3rd & 4th Floor Corridor / করিডোর", type: "ABC Dry Powder (6 kg)", expiryDate: "October 2027", status: "ok" },
  { id: "e4", location: "Basement Generator Room / জেনারেটর রুম", type: "CO2 Carbon Dioxide (5 kg)", expiryDate: "January 2028", status: "ok" },
  { id: "e5", location: "Rooftop Lift Machine Room / লিফট মেশিন রুম", type: "Clean Agent Halotron (3 kg)", expiryDate: "March 2028", status: "ok" },
];

export default function FireSafetyEvacuationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("chart"); // "chart" | "extinguishers" | "earthquake_protocol"
  const [lang, setLang] = useState("bn"); // "bn" | "en"
  const [copied, setCopied] = useState(false);

  // Form Details
  const [form, setForm] = useState({
    buildingName: "Sunrise Heights (সানরাইজ হাইটস)",
    propertyAddress: "House 14, Road 7, Block B, Bashundhara R/A, Dhaka-1229",
    totalFloors: "G + 7 Floors (৮ তলা ভবন)",
    totalFlats: 14,
    
    // Designated Safe Zones
    assemblyPoint: "Building Front Lawn & Main Road Gate 2 (ভবনের সামনের খোলা প্রাঙ্গণ)",
    emergencyExitStaircase: "North-West Fire Escape Staircase (উত্তর-পশ্চিম জরুরি বহির্গমন সিঁড়ি)",
    roofAccessStatus: "Open 24/7 (জরুরি বহির্গমনে ছাদের দরজা সর্বদা আনলক)",

    // Emergency Contacts & Wardens
    chiefFireWarden: "Engr. Tanvir Chowdhury",
    wardenPhone: "01911-876543",
    caretakerName: "Md. Abdul Kader (Caretaker)",
    caretakerPhone: "01720-998877",
    nearestFireStation: "Kuril Fire Station (কুড়িল ফায়ার স্টেশন)",
    fireStationPhone: "01730-336644 / 16163",
    policeStation: "Vatara Police Station (ভাটারা থানা)",
    policePhone: "01713-373180",
    nationalEmergency: "999 (National Emergency Services)",
    wasaEmergency: "16162",
    descoEmergency: "16120",
    titasEmergency: "16496",
  });

  const [extinguishers, setExtinguishers] = useState(INITIAL_EXTINGUISHERS);

  const setField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const addExtinguisher = () => {
    setExtinguishers((prev) => [
      ...prev,
      {
        id: `e_${Date.now()}`,
        location: `Floor #${prev.length + 1} Staircase`,
        type: "ABC Dry Powder (6 kg)",
        expiryDate: "December 2027",
        status: "ok",
      },
    ]);
  };

  const updateExtinguisher = (id, field, val) => {
    setExtinguishers((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: val } : e))
    );
  };

  const deleteExtinguisher = (id) => {
    setExtinguishers((prev) => prev.filter((e) => e.id !== id));
  };

  // Generate Evacuation Plan Document (Bengali)
  const evacuationPlanBn = useMemo(() => {
    const today = new Date().toLocaleDateString("bn-BD");
    const extList = extinguishers
      .map((e, idx) => `   ${idx + 1}. স্থান: ${e.location} | ধরণ: ${e.type} (মেয়াদ: ${e.expiryDate})`)
      .join("\n");

    return `ভবন অগ্নিনিরাপত্তা পরিকল্পনা ও জরুরি ইভাকুয়েশন চার্ট
(BUILDING FIRE SAFETY & EMERGENCY EVACUATION PROTOCOL)
তারিখ: ${today} | ভবন: ${form.buildingName}
ঠিকানা: ${form.propertyAddress} (${form.totalFloors}, মোট ফ্ল্যাট: ${form.totalFlats}টি)

জরুরি বহির্গমন ও নিরাপদ সমাবেশস্থল (EMERGENCY EVACUATION):
★ প্রাথমিক নিরাপদ সমাবেশস্থল (Safe Assembly Point): ${form.assemblyPoint}
★ জরুরি বহির্গমন সিঁড়ি (Fire Escape Staircase): ${form.emergencyExitStaircase}
★ ছাদের বহির্গমন অবস্থা: ${form.roofAccessStatus}

অগ্নিনির্বাপক যন্ত্রের অবস্থান ও তালিকা (FIRE EXTINGUISHERS):
${extList}

জরুরি হটলাইন নম্বরসমূহ (EMERGENCY CONTACT DIRECTORY):
১. জাতীয় জরুরি সেবা (পুলিশ, ফায়ার সার্ভিস, অ্যাম্বুলেন্স): 999
২. নিকটস্থ ফায়ার স্টেশন: ${form.nearestFireStation} (${form.fireStationPhone} / 16163)
৩. প্রধান ফায়ার ওয়ার্ডেন: ${form.chiefFireWarden} (${form.wardenPhone})
৪. ভবনের কেয়ারটেকার / জরুরি গার্ড: ${form.caretakerName} (${form.caretakerPhone})
৫. বিদ্যুৎ জরুরি (DESCO): ${form.descoEmergency} | তিতাস গ্যাস লিকেজ: ${form.titasEmergency} | ওয়াসা: ${form.wasaEmergency}

অগ্নিকাণ্ডকালীন করণীয় নির্দেশাবলী (FIRE SAFETY RULES):
১. আগুন বা ধোঁয়া দেখামাত্র অ্যালার্ম বাজান এবং চিৎকার করে সবাইকে সতর্ক করুন।
২. কোনো অবস্থাতেই লিফট / এলিভেটর ব্যবহার করিবেন না; কেবল জরুরি সিঁড়ি ব্যবহার করুন।
৩. ধোঁয়া থাকলে নিচু হয়ে হামাগুড়ি দিয়ে নাক-মুখে ভেজা কাপড় চেপে বের হয়ে আসুন।
৪. বৈদ্যুতিক মেইন সুইচ ও গ্যাস রাইজার লাইনের প্রধান ভালভ অবিলম্বে বন্ধ করুন।
৫. নিরাপদ সমাবেশস্থলে পৌঁছে পরিবারের সকল সদস্য উপস্থিত আছেন কিনা গণনা করুন।

অনুমোদনকারী: ফায়ার সেফটি কমিটি, ${form.buildingName}`;
  }, [form, extinguishers]);

  // Generate Evacuation Plan Document (English)
  const evacuationPlanEn = useMemo(() => {
    const today = new Date().toLocaleDateString("en-GB");
    const extList = extinguishers
      .map((e, idx) => `   ${idx + 1}. Location: ${e.location} | Type: ${e.type} (Expiry: ${e.expiryDate})`)
      .join("\n");

    return `BUILDING FIRE SAFETY & EMERGENCY EVACUATION PROTOCOL
Date: ${today} | Building: ${form.buildingName}
Address: ${form.propertyAddress} (${form.totalFloors}, Total Units: ${form.totalFlats})

EMERGENCY ESCAPE & ASSEMBLY POINT:
★ Designated Assembly Point: ${form.assemblyPoint}
★ Fire Escape Staircase: ${form.emergencyExitStaircase}
★ Rooftop Emergency Access: ${form.roofAccessStatus}

FIRE EXTINGUISHERS LOG & INVENTORY:
${extList}

EMERGENCY HOTLINE DIRECTORY:
1. National Emergency Hotline (Police / Fire / Ambulance): 999
2. Nearest Fire Station: ${form.nearestFireStation} (${form.fireStationPhone} / 16163)
3. Chief Fire Safety Warden: ${form.chiefFireWarden} (${form.wardenPhone})
4. Building Caretaker / Duty Guard: ${form.caretakerName} (${form.caretakerPhone})
5. Power Emergency (DESCO): ${form.descoEmergency} | Gas Leak (Titas): ${form.titasEmergency} | WASA: ${form.wasaEmergency}

STANDARD FIRE EVACUATION PROCEDURES:
1. Sound the alarm immediately upon detecting smoke or fire and alert neighbors.
2. NEVER USE ELEVATORS during a fire or earthquake; use designated fire escape staircases only.
3. In case of dense smoke, crawl low under the smoke and cover nose/mouth with a damp cloth.
4. Shut down the building's main electrical breaker and gas riser valve if safe to do so.
5. Assemble at the designated Assembly Point and conduct a roll-call of all residents.

Approved by: Fire & Life Safety Committee, ${form.buildingName}`;
  }, [form, extinguishers]);

  const activeDocText = lang === "bn" ? evacuationPlanBn : evacuationPlanEn;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-red-950/60 via-slate-900 to-amber-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Building Fire Safety & Emergency Evacuation Hub
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                  অগ্নিনিরাপত্তা ও ইভাকুয়েশন চার্ট
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Fire safety escape plans, extinguisher logs, earthquake drill protocols & emergency hotlines
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
              onClick={() => setActiveTab("chart")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "chart"
                  ? "border-red-500 text-red-400 bg-red-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>১. ইভাকুয়েশন চার্ট ও নোটিশ (Evacuation Notice)</span>
            </button>
            <button
              onClick={() => setActiveTab("extinguishers")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "extinguishers"
                  ? "border-red-500 text-red-400 bg-red-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>২. অগ্নিনির্বাপক যন্ত্রের লগ (Extinguishers)</span>
            </button>
            <button
              onClick={() => setActiveTab("earthquake_protocol")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "earthquake_protocol"
                  ? "border-red-500 text-red-400 bg-red-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>৩. ভূমিকম্প ও দুর্যোগ প্রটোকল (Drill Guide)</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: EVACUATION CHART & EMERGENCY PROTOCOL */}
          {activeTab === "chart" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Form Details (5 cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800 text-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5 pb-2 border-b border-slate-800">
                  <MapPin className="w-4 h-4" />
                  <span>Building & Evacuation Details</span>
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-0.5">Building Name:</label>
                    <input
                      type="text"
                      value={form.buildingName}
                      onChange={(e) => setField("buildingName", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-0.5">Floors / Flats:</label>
                    <input
                      type="text"
                      value={form.totalFloors}
                      onChange={(e) => setField("totalFloors", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-0.5">Safe Assembly Point (নিরাপদ সমাবেশস্থল):</label>
                  <input
                    type="text"
                    value={form.assemblyPoint}
                    onChange={(e) => setField("assemblyPoint", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-0.5">Emergency Escape Staircase (জরুরি সিঁড়ি):</label>
                  <input
                    type="text"
                    value={form.emergencyExitStaircase}
                    onChange={(e) => setField("emergencyExitStaircase", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white"
                  />
                </div>

                {/* Wardens & Stations */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-300">Emergency Contacts:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-0.5">Chief Fire Warden:</label>
                      <input
                        type="text"
                        value={form.chiefFireWarden}
                        onChange={(e) => setField("chiefFireWarden", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-0.5">Warden Phone:</label>
                      <input
                        type="text"
                        value={form.wardenPhone}
                        onChange={(e) => setField("wardenPhone", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-0.5">Nearest Fire Station:</label>
                      <input
                        type="text"
                        value={form.nearestFireStation}
                        onChange={(e) => setField("nearestFireStation", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-0.5">Fire Station Hotline:</label>
                      <input
                        type="text"
                        value={form.fireStationPhone}
                        onChange={(e) => setField("fireStationPhone", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Plan & Print/WhatsApp (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLang("bn")}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                        lang === "bn" ? "bg-red-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      বাংলা চার্ট
                    </button>
                    <button
                      onClick={() => setLang("en")}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                        lang === "en" ? "bg-red-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      English Plan
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(activeDocText)}
                      className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg transition border border-slate-700"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied!" : "Copy Text"}</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition shadow"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Notice</span>
                    </button>
                  </div>
                </div>

                {/* Printable Document Box */}
                <div className="bg-white text-slate-900 p-6 sm:p-7 rounded-xl shadow-lg border border-slate-200 font-sans text-xs leading-relaxed max-h-[50vh] overflow-y-auto whitespace-pre-wrap">
                  {activeDocText}
                </div>

                {/* Action Bar */}
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Share Emergency Protocol in Building WhatsApp Group:</span>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(activeDocText)}`}
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

          {/* TAB 2: EXTINGUISHERS INVENTORY LOG */}
          {activeTab === "extinguishers" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                    <Flame className="w-4 h-4" />
                    <span>Building Fire Extinguishers Inspection Register</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Track fire extinguisher types, cylinder locations, pressure gauges, and refill expiry dates.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={addExtinguisher}
                    className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Cylinder</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Log Sheet</span>
                  </button>
                </div>
              </div>

              {/* Extinguisher Table */}
              <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                {extinguishers.map((e, idx) => (
                  <div
                    key={e.id}
                    className="flex flex-wrap items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs"
                  >
                    <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-[180px]">
                      <label className="text-[10px] text-slate-400 block mb-0.5">Location / অবস্থান:</label>
                      <input
                        type="text"
                        value={e.location}
                        onChange={(val) => updateExtinguisher(e.id, "location", val.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white font-medium"
                      />
                    </div>
                    <div className="w-48">
                      <label className="text-[10px] text-slate-400 block mb-0.5">Extinguisher Type / ধরণ:</label>
                      <input
                        type="text"
                        value={e.type}
                        onChange={(val) => updateExtinguisher(e.id, "type", val.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-300"
                      />
                    </div>
                    <div className="w-36">
                      <label className="text-[10px] text-slate-400 block mb-0.5">Expiry / রিফিল মেয়াদ:</label>
                      <input
                        type="text"
                        value={e.expiryDate}
                        onChange={(val) => updateExtinguisher(e.id, "expiryDate", val.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-emerald-400 font-bold"
                      />
                    </div>
                    <button
                      onClick={() => deleteExtinguisher(e.id)}
                      className="p-1 text-slate-500 hover:text-red-400 transition mt-3"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EARTHQUAKE & EMERGENCY DRILL */}
          {activeTab === "earthquake_protocol" && (
            <div className="space-y-4 text-xs">
              <div className="bg-gradient-to-br from-slate-900 to-red-950/40 p-5 rounded-xl border border-red-900/40 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-400" />
                  <span>Earthquake & Disaster Safety Code (ভূমিকম্প ও জরুরি দুর্যোগ গাইডলাইন)</span>
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  বাংলাদেশ ফায়ার সার্ভিস ও সিভিল ডিফেন্স এবং দুর্যোগ ব্যবস্থাপনা অধিদপ্তরের সার্বজনীন সুরক্ষা নির্দেশিকা:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-red-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>১. ড্রপ, কাভার অ্যান্ড হোল্ড (Drop, Cover & Hold)</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    ভূমিকম্প অনুভূত হওয়ামাত্র শক্ত টেবিল বা খাটের নিচে আশ্রয় নিন এবং মাথা ও ঘাড় হাত দিয়ে ঢেকে রাখুন। কাঁচের জানালা, ভারী আলমারি বা ঝুলন্ত ফ্যান থেকে দূরে থাকুন।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>২. লিফট ব্যবহার সম্পূর্ণ নিষেধ (Never Use Lifts)</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    ভূমিকম্প বা অগ্নিকাণ্ডের সময় বিদ্যুৎ বিচ্ছিন্ন হয়ে লিফট আটকে যাওয়ার চরম ঝুঁকি থাকে। সিঁড়ি দিয়ে দ্রুত কিন্তু দৌড়াদৌড়ি না করে ক্রমান্বয়ে নিচে নামুন।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Flame className="w-4 h-4" />
                    <span>৩. গ্যাস ও বিদ্যুৎ মেইন সুইচ বন্ধ</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    কম্পন থামার পরপরই গ্যাস লাইনে আগুন লাগা রোধ করতে সিলিন্ডার বা পাইপলাইনের রেগুলেটর এবং বৈদ্যুতিক প্রধান ব্রেকার দ্রুত অফ করুন। কোনো দিয়াশলাই জ্বালাবেন না।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-indigo-400 flex items-center gap-1.5">
                    <LifeBuoy className="w-4 h-4" />
                    <span>৪. খোলা স্থানে সমাবেশ ও জরুরি রোল-কল</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    বিল্ডিং থেকে বের হয়ে বৈদ্যুতিক খুঁটি ও উঁচু ভবনের দেয়াল থেকে দূরে উন্মুক্ত সমাবেশস্থলে জড়ো হোন এবং পরিবারের সকল সদস্যের খোঁজ নিশ্চিত করুন।
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-red-400" />
            <span>Complies with Bangladesh National Building Code (BNBC) Fire Safety Standards</span>
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
