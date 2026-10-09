import React, { useState, useMemo } from "react";
import {
  X,
  Printer,
  Copy,
  Check,
  Dog,
  Cat,
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
  Heart,
  Syringe,
  DollarSign,
  Info,
} from "lucide-react";

export default function PetTenancyAgreementModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("agreement"); // "agreement" | "passport" | "policy"
  const [lang, setLang] = useState("bn"); // "bn" | "en"
  const [copied, setCopied] = useState(false);

  // Form Details
  const [form, setForm] = useState({
    // Property
    buildingName: "Sunrise Heights (সানরাইজ হাইটস)",
    propertyAddress: "Flat 4A, House 14, Road 7, Block B, Bashundhara R/A, Dhaka-1229",
    flatNo: "Flat # 4A",

    // Landlord Info
    landlordName: "Alhaj Rafiqul Islam",
    landlordPhone: "01819-456789",
    landlordNid: "19651234567890",

    // Tenant Info
    tenantName: "MD Hasib Ullah Khan Alvie",
    tenantPhone: "01712-345678",
    tenantNid: "19982692019283741",

    // Pet Details
    petType: "Cat / বিড়াল (Feline)",
    petName: "Milo / মাইলো",
    breed: "Persian & Domestic Short Hair (মিক্স)",
    age: "2 Years / ২ বছর",
    weight: "4.2 kg",
    color: "White & Ginger (সাদা ও সোনালী)",
    gender: "Male (Neutered / খাসিকৃত)",
    
    // Veterinary Details
    vetClinic: "Gulshan Pet Care & Veterinary Hospital",
    vetDoctorName: "Dr. Kazi Mahfuzur Rahman (DVM)",
    vetPhone: "01711-998877",
    rabiesVaccineDate: "15 May 2026",
    coreVaccineStatus: "Fully Vaccinated / সম্পূর্ণ ভ্যাকসিনেটেড",
    dewormingDate: "01 August 2026",

    // Financial Terms
    petDepositAmount: 10000,
    monthlyPetRent: 500,
    agreementDate: new Date().toLocaleDateString("en-GB"),
    specialCareRules: "Litter box must be cleaned daily. Cat must wear collar with owner phone tag.",
  });

  const setField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  // Generate Pet Agreement Deed (Bengali)
  const agreementTextBn = useMemo(() => {
    const today = new Date().toLocaleDateString("bn-BD");
    return `ফ্ল্যাটে পোষা প্রাণী (Pet) রাখার অনুমতিপত্র ও বিশেষ চুক্তিপত্র
(PET TENANCY AGREEMENT & POLICY ADDENDUM)
তারিখ: ${today}

১ম পক্ষ (বাড়িওয়ালা / ফ্ল্যাট মালিক):
নাম: ${form.landlordName} | মোবাইল: ${form.landlordPhone} | NID: ${form.landlordNid}
ভবন ও ফ্ল্যাট: ${form.flatNo}, ${form.buildingName}

২য় পক্ষ (ভাড়াটিয়া / পোষা প্রাণীর অভিভাবক):
নাম: ${form.tenantName} | মোবাইল: ${form.tenantPhone} | NID: ${form.tenantNid}
ভাড়াকৃত ফ্ল্যাট: ${form.propertyAddress}

পোষা প্রাণীর বিবরণী (Pet Profile):
- প্রাণীর ধরণ ও নাম: ${form.petType} — নাম: "${form.petName}"
- জাত (Breed) ও বয়স: ${form.breed} (${form.age}, ওজন: ${form.weight})
- লিঙ্গ ও অবস্থা: ${form.gender}
- ভ্যাকসিন ও স্বাস্থ্য সনদ: জলাতঙ্ক (Rabies) ও কোর ভ্যাকসিন সম্পূর্ণ আপডেট (${form.coreVaccineStatus})
- রেজিস্টার্ড ভেটেরিনারি সার্জন: ${form.vetDoctorName} (${form.vetClinic}, ফোন: ${form.vetPhone})

আর্থিক ও নিরাপত্তা শর্তাবলী:
১. পোষা প্রাণীর অতিরিক্ত জামানত: ২য় পক্ষ ১ম পক্ষকে পোষা প্রাণী সংক্রান্ত সম্ভাব্য ক্ষতিপূরণ জামানত বাবদ অতিরিক্ত =${Number(form.petDepositAmount).toLocaleString("en-IN")}/= (কথায়: ${Number(form.petDepositAmount).toLocaleString("en-IN")} টাকা) প্রদান করিলেন। ফ্ল্যাট ছাড়িবার সময় কোনো ক্ষতিসাধন না থাকিলে এই অর্থ সম্পূর্ণ ফেরতযোগ্য।
২. মাসিক পেট ফি (প্রযোজ্য ক্ষেত্রে): মাসিক =${Number(form.monthlyPetRent).toLocaleString("en-IN")}/= টাকা মূল ভাড়ার সহিত পরিশোধিত হইবে।
৩. কমন এরিয়া ও লিফট ব্যবস্থাপনা: ভবনের করিডোর, সিঁড়ি বা লিফটে চলাচলের সময় কুকুরকে সর্বদা বেল্ট/লিশ (Leash) দ্বারা নিয়ন্ত্রিত রাখিতে হইবে অথবা ক্যাট-ক্যারিয়ারে বহন করিতে হইবে।
৪. স্বাস্থ্য ও বর্জ্য নিষ্কাশন: ফ্ল্যাটের লিটার বক্স নিয়মিত পরিষ্কার করিতে হইবে। ভবনের বারান্দা দিয়া ময়লা বা বর্জ্য নিচে ফেলা কঠোরভাবে নিষিদ্ধ।
৫. শব্দদূষণ ও প্রতিবেশীর শান্তি: পোষা প্রাণীর ডাক বা ঘেউ-ঘেউ যেন পার্শ্ববর্তী ফ্ল্যাটের বাসিন্দাদের স্বাভাবিক জীবনযাপন ও ঘুমের ব্যাঘাত না ঘটায় তাহা নিশ্চিত করার সম্পূর্ণ দায়িত্ব ২য় পক্ষের।
৬. অন্যান্য ফ্ল্যাটে প্রবেশ নিষেধ: পোষা প্রাণীটি যেন একা ফ্ল্যাটের বাহিরে উন্মুক্ত করিডোরে বা ছাদে ঘুরিয়া না বেড়ায় তাহা নিশ্চিত করিতে হইবে।

১ম পক্ষের স্বাক্ষর (বাড়িওয়ালা): _____________________    ২য় পক্ষের স্বাক্ষর (ভাড়াটিয়া): _____________________
নাম: ${form.landlordName}                                 নাম: ${form.tenantName}`;
  }, [form]);

  // Generate Pet Agreement Deed (English)
  const agreementTextEn = useMemo(() => {
    const today = new Date().toLocaleDateString("en-GB");
    return `PET TENANCY POLICY ADDENDUM & AGREEMENT
Date of Execution: ${today}

Landlord / Property Owner (First Party):
Name: ${form.landlordName} | Phone: ${form.landlordPhone} | NID: ${form.landlordNid}
Premises: ${form.flatNo}, ${form.buildingName}

Tenant / Pet Owner (Second Party):
Name: ${form.tenantName} | Phone: ${form.tenantPhone} | NID: ${form.tenantNid}
Rental Property: ${form.propertyAddress}

PET REGISTRATION PROFILE:
- Pet Species & Name: ${form.petType} — "${form.petName}"
- Breed & Age: ${form.breed} (Age: ${form.age}, Weight: ${form.weight})
- Gender / Spay Status: ${form.gender}
- Vaccination Standing: Rabies & Core Vaccines Up-to-date (${form.coreVaccineStatus})
- Registered Vet Clinic: ${form.vetClinic} (Dr. ${form.vetDoctorName}, Phone: ${form.vetPhone})

TERMS AND CONDITIONS:
1. Pet Security Deposit: The Tenant deposits an additional refundable security amount of BDT ৳${Number(form.petDepositAmount).toLocaleString("en-IN")} to cover any potential pet-related damage to fixtures or doors.
2. Monthly Pet Rent: BDT ৳${Number(form.monthlyPetRent).toLocaleString("en-IN")} shall be paid monthly alongside regular rent.
3. Common Area & Elevator Etiquette: When in common corridors, stairwells, or elevators, dogs must be kept on a short leash, and cats must remain in carriers.
4. Hygiene & Waste Disposal: Pet waste and litter must be disposed of hygienically in tied plastic garbage bags. Dropping waste from balconies is strictly forbidden.
5. Noise & Nuisance Control: The Tenant warrants that the pet will not create excessive disturbance or persistent barking that interrupts neighborly peace during quiet hours.
6. Supervision: The pet shall not be permitted to roam unsupervised in common lobby areas or rooftop terraces.

Landlord Signature: _____________________        Tenant Signature: _____________________
Name: ${form.landlordName}                          Name: ${form.tenantName}`;
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
              <Dog className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Pet Tenancy Policy & Pet Passport Hub
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  পোষা প্রাণী চুক্তি ও অঙ্গীকারনামা
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Landlord pet consent agreement, pet vaccination passport & building community animal guidelines
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
                  ? "border-rose-500 text-rose-400 bg-rose-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>১. পোষা প্রাণী চুক্তিপত্র (Pet Lease Deed)</span>
            </button>
            <button
              onClick={() => setActiveTab("passport")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "passport"
                  ? "border-rose-500 text-rose-400 bg-rose-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>২. পেট পাসপোর্ট ও স্বাস্থ্য কার্ড (Pet Passport)</span>
            </button>
            <button
              onClick={() => setActiveTab("policy")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "policy"
                  ? "border-rose-500 text-rose-400 bg-rose-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>৩. বিল্ডিং পেট নীতিমালা (Community Code)</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: PET LEASE AGREEMENT */}
          {activeTab === "agreement" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Form Details (5 cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800 text-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 pb-2 border-b border-slate-800">
                  <Cat className="w-4 h-4" />
                  <span>Pet & Property Information</span>
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-0.5">Pet Species / প্রজাতি:</label>
                    <input
                      type="text"
                      value={form.petType}
                      onChange={(e) => setField("petType", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-0.5">Pet Name / নাম:</label>
                    <input
                      type="text"
                      value={form.petName}
                      onChange={(e) => setField("petName", e.target.value)}
                      className="w-full bg-slate-900 border border-rose-500/60 rounded px-2 py-1 text-rose-300 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-0.5">Breed / জাত:</label>
                    <input
                      type="text"
                      value={form.breed}
                      onChange={(e) => setField("breed", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-0.5">Age & Weight:</label>
                    <input
                      type="text"
                      value={form.age}
                      onChange={(e) => setField("age", e.target.value)}
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

                {/* Veterinary and Vaccines */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Syringe className="w-3.5 h-3.5 text-rose-400" />
                    <span>Veterinary & Vaccine Records:</span>
                  </h4>
                  <div>
                    <label className="text-slate-400 block mb-0.5">Vet Doctor & Clinic:</label>
                    <input
                      type="text"
                      value={form.vetDoctorName}
                      onChange={(e) => setField("vetDoctorName", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white mb-1.5"
                    />
                    <input
                      type="text"
                      value={form.vetClinic}
                      onChange={(e) => setField("vetClinic", e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-700/60 rounded px-2 py-0.5 text-[11px] text-slate-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-0.5">Rabies Date:</label>
                      <input
                        type="text"
                        value={form.rabiesVaccineDate}
                        onChange={(e) => setField("rabiesVaccineDate", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-0.5">Vaccine Status:</label>
                      <input
                        type="text"
                        value={form.coreVaccineStatus}
                        onChange={(e) => setField("coreVaccineStatus", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Financials */}
                <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-0.5">Pet Security Deposit (৳):</label>
                    <input
                      type="number"
                      value={form.petDepositAmount}
                      onChange={(e) => setField("petDepositAmount", e.target.value)}
                      className="w-full bg-slate-900 border border-rose-500/50 rounded px-2 py-1 text-rose-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-0.5">Monthly Pet Fee (৳):</label>
                    <input
                      type="number"
                      value={form.monthlyPetRent}
                      onChange={(e) => setField("monthlyPetRent", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Live Legal Contract & Actions (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLang("bn")}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                        lang === "bn" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      বাংলা চুক্তি
                    </button>
                    <button
                      onClick={() => setLang("en")}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                        lang === "en" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white"
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
                      className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition shadow"
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
                  <span>Send Pet Agreement directly to Landlord or Building Committee:</span>
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

          {/* TAB 2: PET PASSPORT & HEALTH CARD */}
          {activeTab === "passport" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <Heart className="w-4 h-4" />
                    <span>Apartment Pet ID Passport & Vaccination Certificate</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Official pet identity card showing rabies vaccination, guardian contact & vet doctor verification.
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Pet Passport</span>
                </button>
              </div>

              {/* Printable Pet Passport Card */}
              <div className="flex justify-center p-4">
                <div className="w-full max-w-md bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 border-4 border-rose-500 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden">
                  
                  {/* Watermark/Accent */}
                  <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
                    <Dog className="w-44 h-44 text-rose-400" />
                  </div>

                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
                    <div>
                      <span className="px-2.5 py-0.5 bg-rose-500 text-white font-black text-[10px] rounded-full uppercase tracking-wider">
                        RESIDENT PET PASSPORT
                      </span>
                      <h3 className="text-base font-black text-white mt-1">{form.buildingName}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase block">FLAT:</span>
                      <span className="text-base font-black text-amber-400">{form.flatNo}</span>
                    </div>
                  </div>

                  {/* Pet Name & Photo Plate */}
                  <div className="bg-slate-950/80 border-2 border-slate-700 rounded-2xl p-4 text-center mb-4">
                    <span className="text-2xl font-black text-rose-400 tracking-wide block">
                      🐾 {form.petName}
                    </span>
                    <span className="text-xs text-slate-300 block mt-0.5">
                      {form.breed} • {form.gender}
                    </span>
                    <div className="flex justify-center gap-4 mt-2 text-[11px] text-slate-400 font-mono">
                      <span>Age: {form.age}</span>
                      <span>Weight: {form.weight}</span>
                      <span>Color: {form.color}</span>
                    </div>
                  </div>

                  {/* Medical & Guardian Info */}
                  <div className="space-y-2 bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 text-xs">
                    <div className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-slate-400">Rabies Vaccine:</span>
                      <span className="text-emerald-400 font-bold">✓ {form.rabiesVaccineDate}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-slate-400">Vet Doctor:</span>
                      <span className="font-semibold text-white">{form.vetDoctorName}</span>
                    </div>
                    <div className="flex justify-between pt-0.5">
                      <span className="text-slate-400">Guardian / Owner:</span>
                      <span className="font-bold text-white">{form.tenantName} ({form.tenantPhone})</span>
                    </div>
                  </div>

                  {/* Security Footer */}
                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-3 mt-3 border-t border-slate-800">
                    <span>Approved Pet Resident</span>
                    <span className="text-emerald-400 font-semibold">Vaccinated & Neutered</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMMUNITY PET POLICY */}
          {activeTab === "policy" && (
            <div className="space-y-4 text-xs">
              <div className="bg-gradient-to-br from-slate-900 to-rose-950/40 p-5 rounded-xl border border-rose-900/40 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-rose-400" />
                  <span>Apartment Society Pet Ethics & Hygiene Code (বিল্ডিং পেট নীতিমালা)</span>
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  বহুতল ভবনে প্রতিবেশীদের নিরাপত্তা, পরিচ্ছন্নতা ও সম্প্রীতি রক্ষা করে পোষা প্রাণী লালন-পালনের নিয়মাবলী:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-rose-400 flex items-center gap-1.5">
                    <Dog className="w-4 h-4" />
                    <span>১. কমন এরিয়া ও লিফটে নিয়ন্ত্রণ</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    ভবনের লবি, করিডোর বা লিফটে কুকুরকে সর্বদা বেল্ট বা লিশ (Leash) পরিয়ে রাখতে হবে। বিড়ালকে ক্যাট-ক্যারিয়ারে বহন করা নিরাপদ। লিফটে অন্য কোনো বাসিন্দা থাকলে তাদের অনুমতি নিয়ে প্রবেশ করুন।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Syringe className="w-4 h-4" />
                    <span>২. নিয়মিত জলাতঙ্ক ও কৃমিনাশক টিকা</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    প্রতি বছর নিয়মিত র‍্যাবিস (জলাতঙ্ক) ও অন্যান্য আবশ্যক কোর ভ্যাকসিন নিশ্চিত করে ভেটেরিনারি প্রেসক্রিপশন কার্ড ভবনের ম্যানেজমেন্ট অফিসে ফাইল জমা রাখতে হবে।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>৩. ময়লা ও লিটার নিষ্কাশন নিয়ম</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    বিড়াল বা কুকুরের বর্জ্য/লিটার সর্বদা পৃথক পলিথিনে শক্ত করে বেঁধে ডাস্টবিনে ফেলতে হবে। বারান্দা ধোয়ার সময় পানি বা লোম নিচের ফ্ল্যাটে যাতে না পড়ে সেদিকে দৃষ্টি রাখুন।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-indigo-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>৪. রাতের নীরবতা রক্ষা (Quiet Hours)</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    রাত ১০:০০ টার পর কুকুরের অতিরিক্ত ঘেউ-ঘেউ বা শব্দ নিয়ন্ত্রণে প্রয়োজনীয় খেলনা ও খাদ্য পরিবেশন নিশ্চিত করুন যাতে প্রতিবেশীর ঘুমের ব্যাঘাত না ঘটে।
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-rose-400" />
            <span>Standard Pet Policy Addendum for Apartment Rentals in Bangladesh</span>
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
