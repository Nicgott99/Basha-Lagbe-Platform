import React, { useState, useMemo } from "react";
import {
  X,
  Printer,
  Copy,
  Check,
  Car,
  ShieldCheck,
  FileText,
  User,
  Phone,
  Building,
  Calendar,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Send,
  Zap,
  Tag,
  Key,
  CreditCard,
  QrCode,
  Compass,
} from "lucide-react";

export default function ParkingRentalAgreementModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("agreement"); // "agreement" | "sticker" | "rules"
  const [lang, setLang] = useState("bn"); // "bn" | "en"
  const [copied, setCopied] = useState(false);

  // Form Details
  const [form, setForm] = useState({
    // Property & Slot
    buildingName: "Sunrise Heights (সানরাইজ হাইটস)",
    propertyAddress: "House 14, Road 7, Block B, Bashundhara R/A, Dhaka-1229",
    parkingSlotNo: "Slot # P-03 (Basement-1)",
    slotOwnerFlat: "Flat # 4A (4th Floor)",

    // Slot Owner (Lessor)
    lessorName: "Alhaj Rafiqul Islam",
    lessorPhone: "01819-456789",
    lessorNid: "19651234567890",

    // Vehicle Owner (Lessee)
    lesseeName: "MD Hasib Ullah Khan Alvie",
    lesseePhone: "01712-345678",
    lesseeNid: "19982692019283741",
    lesseeFlatOrOffice: "Flat # 2B (2nd Floor)",
    driverName: "Md. Sohel Rana (Chauffeur)",
    driverPhone: "01755-112233",

    // Vehicle Info
    vehicleType: "Private Car / Sedan (প্রাইভেট কার)",
    vehicleMakeModel: "Toyota Corolla Cross (Hybrid)",
    vehicleRegNo: "Dhaka Metro-GA-34-8891",
    chassisNo: "ZSG10-982104",
    vehicleColor: "Pearl White / সাদা",

    // Financial Terms
    monthlyRent: 4500,
    advanceDeposit: 9000,
    remoteKeyDeposit: 2000,
    hasEvCharging: true,
    evMeterNo: "EV-SUBMTR-091",
    evRatePerUnit: 14,
    noticePeriodMonths: 1,
    leaseStartDate: "01 November 2026",
    leaseTenure: "1 Year / ১ বৎসর",
    passExpiryDate: "31 October 2027",
  });

  const setField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  // Generate Parking Deed (Bengali)
  const agreementTextBn = useMemo(() => {
    const today = new Date().toLocaleDateString("bn-BD");
    return `গাড়ি / মোটরবাইক পার্কিং স্পেস ভাড়া চুক্তিপত্র
(CAR PARKING SPACE TENANCY AGREEMENT)
তারিখ: ${today}

১ম পক্ষ (পার্কিং স্লটের মালিক / Lessor):
নাম: ${form.lessorName} | মোবাইল: ${form.lessorPhone} | NID: ${form.lessorNid}
মালিকানাধীন ফ্ল্যাট: ${form.slotOwnerFlat}, ভবন: ${form.buildingName}

২য় পক্ষ (ভাড়াটিয়া / গাড়ির মালিক / Lessee):
নাম: ${form.lesseeName} | মোবাইল: ${form.lesseePhone} | NID: ${form.lesseeNid}
বর্তমান ঠিকানা / ফ্ল্যাট: ${form.lesseeFlatOrOffice}

ভাড়াকৃত পার্কিং স্লটের তপশিল:
ভবনের নাম: ${form.buildingName} | ঠিকানা: ${form.propertyAddress}
নির্ধারিত পার্কিং স্লট নং: ${form.parkingSlotNo}

গাড়ির বিবরণী:
- গাড়ির ধরণ ও মডেল: ${form.vehicleType} (${form.vehicleMakeModel}, রঙ: ${form.vehicleColor})
- গাড়ির রেজিস্ট্রেশন নম্বর: ${form.vehicleRegNo}
- চেসিস নং: ${form.chassisNo}
- চালক / ড্রাইভারের নাম ও ফোন: ${form.driverName} (${form.driverPhone})

শর্তাবলী:
১. চুক্তির মেয়াদ: অত্র চুক্তিপত্রের মেয়াদ আগামী ${form.leaseStartDate} হইতে ${form.leaseTenure} সময়ের জন্য বলবৎ থাকিবে।
২. মাসিক ভাড়া: মাসিক পার্কিং ভাড়া বাবদ =${Number(form.monthlyRent).toLocaleString("en-IN")}/= (কথায়: ${Number(form.monthlyRent).toLocaleString("en-IN")} টাকা) ধার্য করা হইল। প্রতি ইংরেজি মাসের ১ হইতে ১০ তারিখের মধ্যে ২য় পক্ষ ১ম পক্ষকে ভাড়া পরিশোধ করিবেন।
৩. জামানত অর্থ: অত্র চুক্তি স্বাক্ষরকালে ২য় পক্ষ ১ম পক্ষকে জামানত বাবদ =${Number(form.advanceDeposit).toLocaleString("en-IN")}/= টাকা এবং গ্যারেজ গেট রিমোট/চাবি বাবদ =${Number(form.remoteKeyDeposit).toLocaleString("en-IN")}/= টাকা মোট =${(Number(form.advanceDeposit) + Number(form.remoteKeyDeposit)).toLocaleString("en-IN")}/= টাকা প্রদান করিলেন যাহা চুক্তি সমাপ্তিতে ফেরতযোগ্য।
${form.hasEvCharging ? `৪. ইভি / ইলেকট্রিক গাড়ি চার্জিং: পার্কিং স্লটে ইনস্টলকৃত ইভি সাব-মিটার (মিটার নং: ${form.evMeterNo}) অনুযায়ী প্রতি ইউনিট ৳${form.evRatePerUnit}/- হারে বিদ্যুৎ বিল ২য় পক্ষ স্বউদ্যোগে পরিশোধ করিবেন।\n` : ""}৪. নিরাপত্তা ও পরিচ্ছন্নতা: পার্কিং স্লটে কেবল নিবন্ধিত গাড়িটি পার্ক করা যাইবে। কোনো প্রকার দাহ্য পদার্থ, জ্বালানি তেল বা ময়লা-আবর্জনা রাখা যাইবে না।
৫. দায়মুক্তি: পার্কিং এরিয়াতে গাড়ির নিজস্ব যান্ত্রিক ত্রুটি, অগ্নিদুর্ঘটনা বা নিজস্ব মালামাল চুরির জন্য ১ম পক্ষ বা ভবন কর্তৃপক্ষ দায়ী থাকিবেন না। ২য় পক্ষ নিজ গাড়ির বীমা বজায় রাখিবেন।
৬. চুক্তি সমাপ্তি: উভয় পক্ষের যেকোনো এক পক্ষ ১ (এক) মাসের লিখিত নোটিশ প্রদান করিয়া অত্র চুক্তি বাতিল করিতে পারিবেন।

১ম পক্ষের স্বাক্ষর (মালিক): _____________________        ২য় পক্ষের স্বাক্ষর (ভাড়াটিয়া): _____________________
নাম: ${form.lessorName}                                  নাম: ${form.lesseeName}`;
  }, [form]);

  // Generate Parking Deed (English)
  const agreementTextEn = useMemo(() => {
    const today = new Date().toLocaleDateString("en-GB");
    return `CAR PARKING SPACE LEASE AGREEMENT
Date of Execution: ${today}

Lessor (Parking Slot Owner / First Party):
Name: ${form.lessorName} | Phone: ${form.lessorPhone} | NID: ${form.lessorNid}
Allocated Flat: ${form.slotOwnerFlat}, Building: ${form.buildingName}

Lessee (Vehicle Owner / Second Party):
Name: ${form.lesseeName} | Phone: ${form.lesseePhone} | NID: ${form.lesseeNid}
Resident Flat / Office: ${form.lesseeFlatOrOffice}

Schedule of Demised Parking Space:
Building: ${form.buildingName} | Address: ${form.propertyAddress}
Designated Slot Number: ${form.parkingSlotNo}

Vehicle Specifications:
- Make & Model: ${form.vehicleMakeModel} (${form.vehicleType}, Color: ${form.vehicleColor})
- Registration Number: ${form.vehicleRegNo}
- Chassis Number: ${form.chassisNo}
- Designated Driver: ${form.driverName} (Phone: ${form.driverPhone})

TERMS AND CONDITIONS:
1. Tenancy Period: Effective from ${form.leaseStartDate} for a duration of ${form.leaseTenure}.
2. Monthly Rent: BDT ৳${Number(form.monthlyRent).toLocaleString("en-IN")} payable on or before the 10th day of each calendar month.
3. Security Deposit: The Lessee deposits BDT ৳${Number(form.advanceDeposit).toLocaleString("en-IN")} plus ৳${Number(form.remoteKeyDeposit).toLocaleString("en-IN")} for gate remote/key access (Total: ৳${(Number(form.advanceDeposit) + Number(form.remoteKeyDeposit)).toLocaleString("en-IN")}), refundable upon termination.
${form.hasEvCharging ? `4. EV Charging Billing: Electricity consumed via Sub-meter #${form.evMeterNo} shall be billed at BDT ৳${form.evRatePerUnit}/kWh and paid monthly by the Lessee.\n` : ""}4. Authorized Use: Only the designated registered vehicle may occupy the slot. Storing flammable chemicals, fuels, or domestic clutter in the parking slot is strictly prohibited.
5. Liability: The Lessor and Building Management assume no liability for fire, theft, or mechanical damage to the vehicle. The Lessee must maintain comprehensive vehicle insurance.
6. Termination: Either party may terminate this agreement by providing ${form.noticePeriodMonths} month(s) prior written notice.

Lessor Signature: _____________________        Lessee Signature: _____________________
Name: ${form.lessorName}                          Name: ${form.lesseeName}`;
  }, [form]);

  const activeAgreementText = lang === "bn" ? agreementTextBn : agreementTextEn;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Car Parking Space Lease & Garage Pass Hub
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  গাড়ি পার্কিং ভাড়া চুক্তি ও স্টিকার
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Parking spot tenancy agreement, windshield security pass generator & basement garage rules
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
              onClick={() => setActiveTab("agreement")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "agreement"
                  ? "border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>১. পার্কিং ভাড়া চুক্তিপত্র (Lease Deed)</span>
            </button>
            <button
              onClick={() => setActiveTab("sticker")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "sticker"
                  ? "border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>২. উইন্ডশিল্ড পার্কিং স্টিকার (Vehicle Pass)</span>
            </button>
            <button
              onClick={() => setActiveTab("rules")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "rules"
                  ? "border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>৩. গ্যারেজ ও পার্কিং নীতিমালা (By-Laws)</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: PARKING TENANCY AGREEMENT */}
          {activeTab === "agreement" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Form Details (5 cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800 text-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5 pb-2 border-b border-slate-800">
                  <Car className="w-4 h-4" />
                  <span>Parking Slot & Vehicle Information</span>
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-0.5">Parking Slot No:</label>
                    <input
                      type="text"
                      value={form.parkingSlotNo}
                      onChange={(e) => setField("parkingSlotNo", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-0.5">Building Name:</label>
                    <input
                      type="text"
                      value={form.buildingName}
                      onChange={(e) => setField("buildingName", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-0.5">Slot Owner (Lessor):</label>
                    <input
                      type="text"
                      value={form.lessorName}
                      onChange={(e) => setField("lessorName", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-0.5">Vehicle Owner (Lessee):</label>
                    <input
                      type="text"
                      value={form.lesseeName}
                      onChange={(e) => setField("lesseeName", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                </div>

                {/* Vehicle specifications */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-300">Vehicle Specification:</h4>
                  <div>
                    <label className="text-slate-400 block mb-0.5">Make & Model:</label>
                    <input
                      type="text"
                      value={form.vehicleMakeModel}
                      onChange={(e) => setField("vehicleMakeModel", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-0.5">Vehicle Reg No:</label>
                      <input
                        type="text"
                        value={form.vehicleRegNo}
                        onChange={(e) => setField("vehicleRegNo", e.target.value)}
                        className="w-full bg-slate-900 border border-blue-500/60 rounded px-2 py-1 text-blue-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-0.5">Color:</label>
                      <input
                        type="text"
                        value={form.vehicleColor}
                        onChange={(e) => setField("vehicleColor", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-0.5">Designated Driver Name & Phone:</label>
                    <input
                      type="text"
                      value={form.driverName}
                      onChange={(e) => setField("driverName", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white mb-1.5"
                    />
                    <input
                      type="text"
                      value={form.driverPhone}
                      onChange={(e) => setField("driverPhone", e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-700/60 rounded px-2 py-0.5 text-[11px] text-slate-400"
                    />
                  </div>
                </div>

                {/* Financials */}
                <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-0.5">Monthly Rent (৳):</label>
                    <input
                      type="number"
                      value={form.monthlyRent}
                      onChange={(e) => setField("monthlyRent", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-0.5">Security Deposit (৳):</label>
                    <input
                      type="number"
                      value={form.advanceDeposit}
                      onChange={(e) => setField("advanceDeposit", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="ev_check"
                    checked={form.hasEvCharging}
                    onChange={(e) => setField("hasEvCharging", e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 bg-slate-800 border-slate-700"
                  />
                  <label htmlFor="ev_check" className="text-slate-300 text-[11px] cursor-pointer">
                    Enable EV / Hybrid Charging sub-meter billing (৳{form.evRatePerUnit}/unit)
                  </label>
                </div>
              </div>

              {/* Right Column: Live Legal Contract & Actions (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLang("bn")}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                        lang === "bn" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      বাংলা দলিল
                    </button>
                    <button
                      onClick={() => setLang("en")}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                        lang === "en" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      English Deed
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(activeAgreementText)}
                      className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg transition border border-slate-700"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied!" : "Copy Text"}</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition shadow"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Agreement</span>
                    </button>
                  </div>
                </div>

                {/* Printable Document Box */}
                <div className="bg-white text-slate-900 p-6 sm:p-7 rounded-xl shadow-lg border border-slate-200 font-sans text-xs leading-relaxed max-h-[50vh] overflow-y-auto whitespace-pre-wrap">
                  {activeAgreementText}
                </div>

                {/* Action Bar */}
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Send signed deed directly to vehicle owner / tenant:</span>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(activeAgreementText)}`}
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

          {/* TAB 2: WINDSHIELD PARKING STICKER & PASS */}
          {activeTab === "sticker" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                    <Tag className="w-4 h-4" />
                    <span>Windshield Parking Permit Sticker & Gate Pass</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    High-contrast authorized resident vehicle pass for building security & RFID gate clearance.
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Windshield Pass (স্টিকার প্রিন্ট করুন)</span>
                </button>
              </div>

              {/* Printable Windshield Sticker Box */}
              <div className="flex justify-center p-4">
                <div className="w-full max-w-md bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-4 border-blue-500 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden">
                  
                  {/* Watermark/Accent */}
                  <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                    <Car className="w-48 h-48 text-blue-400" />
                  </div>

                  {/* Top Header */}
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
                    <div>
                      <span className="px-2.5 py-0.5 bg-blue-500 text-slate-950 font-black text-[10px] rounded-full uppercase tracking-wider">
                        RESIDENT PARKING PASS
                      </span>
                      <h3 className="text-base font-black text-white mt-1">{form.buildingName}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase block">SLOT NO:</span>
                      <span className="text-xl font-black text-amber-400">{form.parkingSlotNo.split("(")[0]}</span>
                    </div>
                  </div>

                  {/* Main Vehicle Plate */}
                  <div className="bg-slate-950/80 border-2 border-slate-700 rounded-2xl p-4 text-center mb-4">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">
                      AUTHORIZED VEHICLE REGISTRATION
                    </span>
                    <span className="text-2xl font-black tracking-wider text-emerald-400 font-mono">
                      {form.vehicleRegNo}
                    </span>
                    <span className="text-xs text-slate-300 block mt-1">
                      {form.vehicleMakeModel} ({form.vehicleColor})
                    </span>
                  </div>

                  {/* Resident Info & QR visual */}
                  <div className="grid grid-cols-3 gap-2 items-center bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
                    <div className="col-span-2 space-y-1">
                      <p className="text-slate-400 text-[10px]">RESIDENT / DRIVER:</p>
                      <p className="font-bold text-white text-xs">{form.lesseeName} ({form.lesseeFlatOrOffice})</p>
                      <p className="text-slate-400 text-[11px]">Emergency: {form.lesseePhone}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 bg-white rounded-lg text-slate-950 text-center">
                      <QrCode className="w-10 h-10 text-slate-900" />
                      <span className="text-[8px] font-black uppercase mt-0.5">GATE PASS</span>
                    </div>
                  </div>

                  {/* Validity Footer */}
                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-3 mt-3 border-t border-slate-800">
                    <span>Valid Thru: <strong>{form.passExpiryDate}</strong></span>
                    <span>Security Verified</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GARAGE & PARKING BY-LAWS */}
          {activeTab === "rules" && (
            <div className="space-y-4 text-xs">
              <div className="bg-gradient-to-br from-slate-900 to-blue-950/40 p-5 rounded-xl border border-blue-900/40 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <span>Basement Garage & Parking Management Code (গ্যারেজ ও পার্কিং নীতিমালা)</span>
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  ভবনের সকল আবাসিক ও বাণিজ্যিক গাড়ি নিরাপদে সংরক্ষণের জন্য সার্বজনীন গ্যারেজ বিধিবিধান:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-blue-400 flex items-center gap-1.5">
                    <Car className="w-4 h-4" />
                    <span>১. নির্ধারিত দাগ ও বাউন্ডারি মেনে পার্কিং</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    গাড়ির চাকা সর্বদা নির্ধারিত হলুদ/সাদা দাগের ভেতর রাখতে হবে। পাশের গাড়ি বা ড্রাইভারের দরজা খোলার পথে বাধা সৃষ্টি করা কঠোরভাবে নিষিদ্ধ।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-indigo-400 flex items-center gap-1.5">
                    <Compass className="w-4 h-4" />
                    <span>২. বেসমেন্টে সর্বোচ্চ গতিসীমা (১০ কিমি/ঘণ্টা) ও হর্ন নিষেধ</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    আবাসিক গ্যারেজের র‍্যাম্পে নামা বা উঠার সময় সর্বদা লো-বিম হেডলাইট অন রাখতে হবে এবং অপ্রয়োজনীয় হর্ন বাজানো সম্পূর্ণ নিষিদ্ধ।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    <span>৩. ইভি চার্জিং ও অগ্নি-নিরাপত্তা নির্দেশিকা</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    ইলেকট্রিক ভেহিক্যাল (EV) চার্জিং পয়েন্টে সার্কিট ব্রেকার ও আর্থিং আবশ্যক। পার্কিং স্পটে কোনো পেট্রোল, ইঞ্জিন ওয়েল বা অতিরিক্ত ব্যাটারি জমা রাখা যাবে না।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>৪. গাড়ি ধোয়া ও পানি নিষ্কাশন ব্যবস্থা</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    গ্যারেজের ভেতরে সাবান পানি দিয়ে গাড়ি ধোয়া যাবে না যদি না নির্দিষ্ট ওয়াশিং ড্রেনেজ বে থাকে। পানি জমে বেসমেন্টে পিচ্ছিল পরিবেশ সৃষ্টি করা শাস্তিযোগ্য।
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            <span>Legally binding parking lease template & official security pass generator for Bangladesh</span>
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
