import React, { useState, useMemo } from "react";
import {
  X,
  Printer,
  Copy,
  Check,
  PartyPopper,
  Calendar,
  Clock,
  Building,
  User,
  Phone,
  DollarSign,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Send,
  Flame,
  Volume2,
  Users,
  FileText,
  DoorOpen,
} from "lucide-react";

const VENUES = [
  { id: "rooftop", name: "Rooftop Terrace (ভবনের ছাদ)", maxGuests: 60, baseRate: 3500 },
  { id: "hall", name: "Community Hall / Lounge (কমিউনিটি হল)", maxGuests: 100, baseRate: 6000 },
  { id: "lawn", name: "Ground Floor Lawn / Garden (বাগান প্রাঙ্গণ)", maxGuests: 40, baseRate: 2500 },
];

const EVENT_TYPES = [
  "Rooftop BBQ & Winter Picnic / বারবিকিউ ও বনভোজন",
  "Birthday / Family Anniversary Party / জন্মদিন ও বিবাহবার্ষিকী",
  "Milad Mahfil & Iftar Gathering / মিলাদ ও ইফতার মাহফিল",
  "Flat Owners AGM / General Meeting / সাধারণ সভা",
  "Cultural / Get-Together Gathering / পারিবারিক মিলনমেলা",
];

export default function CommunityEventBookingModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("booking"); // "booking" | "guest_pass" | "safety_charter"
  const [lang, setLang] = useState("bn"); // "bn" | "en"
  const [copied, setCopied] = useState(false);

  // Form Details
  const [form, setForm] = useState({
    buildingName: "Sunrise Heights (সানরাইজ হাইটস)",
    propertyAddress: "House 14, Road 7, Block B, Bashundhara R/A, Dhaka-1229",
    applicantName: "MD Hasib Ullah Khan Alvie",
    applicantFlat: "Flat # 4A (4th Floor)",
    applicantPhone: "01712-345678",
    applicantNid: "19982692019283741",

    // Event Info
    venueId: "rooftop",
    eventType: EVENT_TYPES[0],
    eventDate: "25 October 2026",
    timeSlot: "Evening (05:30 PM – 10:00 PM / সন্ধ্যা ৫:৩০ - রাত ১০:০০)",
    expectedGuests: 35,
    hasSoundSystem: true,
    hasLiveCookingBbq: true,

    // Financials
    baseVenueFee: 3500,
    generatorBackupFee: 1500,
    cleaningFee: 1000,
    securityGuardOvertime: 800,
    refundableDamageDeposit: 5000,
    paymentMethod: "bKash to Society A/C",
    trxId: "BK-SOC-882109",

    // Society Official
    societySecretary: "Engr. Tanvir Chowdhury (General Secretary)",
    secretaryPhone: "01911-876543",
    specialPermission: "Live charcoal BBQ permitted on designated tiled zone. Sound system must be off at 10:00 PM.",
  });

  const setField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const currentVenue = useMemo(() => {
    return VENUES.find((v) => v.id === form.venueId) || VENUES[0];
  }, [form.venueId]);

  const handleVenueChange = (venueId) => {
    const v = VENUES.find((item) => item.id === venueId);
    if (v) {
      setForm((prev) => ({
        ...prev,
        venueId,
        baseVenueFee: v.baseRate,
      }));
    }
  };

  // Financial Sum
  const totalPayableFee =
    (Number(form.baseVenueFee) || 0) +
    (Number(form.generatorBackupFee) || 0) +
    (Number(form.cleaningFee) || 0) +
    (Number(form.securityGuardOvertime) || 0);

  const grandTotalWithDeposit = totalPayableFee + (Number(form.refundableDamageDeposit) || 0);

  // Generate Booking Application Text (Bengali)
  const bookingTextBn = useMemo(() => {
    const today = new Date().toLocaleDateString("bn-BD");
    return `ভবনের ছাদ / কমিউনিটি হল বুকিং আবেদন ও অনুমতিপত্র
(ROOFTOP & COMMUNITY HALL BOOKING VOUCHER)
তারিখ: ${today}

আবেদনকারী ফ্ল্যাট মালিক / ভাড়াটিয়া:
নাম: ${form.applicantName} | ফ্ল্যাট নং: ${form.applicantFlat}
মোবাইল: ${form.applicantPhone} | NID: ${form.applicantNid}
ভবনের নাম: ${form.buildingName} | ঠিকানা: ${form.propertyAddress}

অনুষ্ঠান ও বুকিং বিবরণী:
- নির্ধারিত স্থান: ${currentVenue.name}
- অনুষ্ঠানের ধরণ: ${form.eventType}
- তারিখ ও সময়সূচী: ${form.eventDate} (${form.timeSlot})
- সম্ভাব্য অতিথি সংখ্যা: ${form.expectedGuests} জন (অনুমোদিত সর্বোচ্চ: ${currentVenue.maxGuests} জন)
- সাউন্ড সিস্টেম ব্যবহার: ${form.hasSoundSystem ? "অনুমোদিত (রাত ১০:০০ টার মধ্যে বন্ধ আবশ্যক)" : "অনুমোদনহীন"}
- বারবিকিউ / লাইভ কুকিং: ${form.hasLiveCookingBbq ? "অনুমোদিত (নির্দিষ্ট টাইলস জোনে)" : "নাই"}

চার্জ ও পেমেন্ট বিবরণী:
১. ভেন্যু ভাড়া (Base Fee): ৳${Number(form.baseVenueFee).toLocaleString("en-IN")}/-
২. স্ট্যান্ডবাই জেনারেটর ব্যাকআপ: ৳${Number(form.generatorBackupFee).toLocaleString("en-IN")}/-
৩. অনুষ্ঠান পরবর্তী পরিচ্ছন্নতা ফি: ৳${Number(form.cleaningFee).toLocaleString("en-IN")}/-
৪. সিকিউরিটি গার্ড ও কেয়ারটেকার ওভারটাইম: ৳${Number(form.securityGuardOvertime).toLocaleString("en-IN")}/-
-----------------------------------------------------------
মোট প্রদেয় সার্ভিস চার্জ: ৳${totalPayableFee.toLocaleString("en-IN")}/-
ফেরতযোগ্য জামানত (Refundable Deposit): ৳${Number(form.refundableDamageDeposit).toLocaleString("en-IN")}/-
★ সর্বমোট জমা (Grand Total): ৳${grandTotalWithDeposit.toLocaleString("en-IN")}/-
(পরিশোধ মাধ্যম: ${form.paymentMethod} • TrxID: ${form.trxId})

আবেদনকারীর অঙ্গীকারনামা:
আমি অঙ্গীকার করিতেছি যে, অনুষ্ঠানে কোনো প্রকার আতশবাজি বা ফানুস ওড়ানো হইবে না এবং রাত ১০:০০ টার পর কোনো উচ্চশব্দ বাজানো হইবে না। অনুষ্ঠান শেষে ছাদ/হল সম্পূর্ণ পরিষ্কার করিয়া কেয়ারটেকারকে বুঝাইয়া দেওয়া হইবে।

আবেদনকারীর স্বাক্ষর: _____________________    অনুমোদনকারী (সোসাইটি সাধারণ সম্পাদক): _____________________
নাম: ${form.applicantName}                      নাম: ${form.societySecretary}`;
  }, [form, currentVenue, totalPayableFee, grandTotalWithDeposit]);

  // Generate Booking Application Text (English)
  const bookingTextEn = useMemo(() => {
    const today = new Date().toLocaleDateString("en-GB");
    return `ROOFTOP & COMMUNITY HALL EVENT BOOKING CLEARANCE
Date: ${today}

Applicant Resident:
Name: ${form.applicantName} | Flat: ${form.applicantFlat}
Phone: ${form.applicantPhone} | NID: ${form.applicantNid}
Premises: ${form.buildingName}, ${form.propertyAddress}

EVENT & VENUE DETAILS:
- Reserved Venue: ${currentVenue.name}
- Nature of Event: ${form.eventType}
- Event Date & Timing: ${form.eventDate} (${form.timeSlot})
- Expected Guests: ${form.expectedGuests} Persons (Max Capacity: ${currentVenue.maxGuests})
- Sound System Permit: ${form.hasSoundSystem ? "Permitted (Strict 10:00 PM sound curfew)" : "No Sound System"}
- Live Cooking / BBQ: ${form.hasLiveCookingBbq ? "Permitted in designated safety zone" : "Not Applicable"}

FEE BREAKDOWN & SETTLEMENT:
1. Venue Base Charge: BDT ৳${Number(form.baseVenueFee).toLocaleString("en-IN")}
2. Standby Generator Backup: BDT ৳${Number(form.generatorBackupFee).toLocaleString("en-IN")}
3. Cleaning & Trash Clearance Fee: BDT ৳${Number(form.cleaningFee).toLocaleString("en-IN")}
4. Security Guard / Caretaker Overtime: BDT ৳${Number(form.securityGuardOvertime).toLocaleString("en-IN")}
-----------------------------------------------------------
Total Service Fee: BDT ৳${totalPayableFee.toLocaleString("en-IN")}
Refundable Security Deposit: BDT ৳${Number(form.refundableDamageDeposit).toLocaleString("en-IN")}
★ GRAND TOTAL PAID: BDT ৳${grandTotalWithDeposit.toLocaleString("en-IN")}
(Payment Mode: ${form.paymentMethod} • Trx: ${form.trxId})

RESIDENT UNDERTAKING:
I solemnly undertake to observe all building safety codes, refrain from fireworks/sky lanterns, adhere strictly to the 10:00 PM noise curfew, and restore the venue to pristine cleanliness post-event.

Applicant Signature: _____________________    Approved by (Welfare Society): _____________________
Name: ${form.applicantName}                      Name: ${form.societySecretary}`;
  }, [form, currentVenue, totalPayableFee, grandTotalWithDeposit]);

  // Security Gate Guest Clearance Pass
  const guestPassText = useMemo(() => {
    return `ইভেন্ট সিকিউরিটি গেট পাস ও অতিথি প্রবেশ অনুমতিপত্র
(SECURITY GATE & GUEST ACCESS PASS)
তারিখ: ${form.eventDate} | ভবন: ${form.buildingName}

আয়োজক ফ্ল্যাট: ${form.applicantFlat} (${form.applicantName}, ফোন: ${form.applicantPhone})
অনুষ্ঠানের স্থান: ${currentVenue.name} (${form.timeSlot})
অনুমোদিত অতিথি সংখ্যা: ${form.expectedGuests} জন

ভবন সিকিউরিটি গার্ড ও কেয়ারটেকারের জন্য নির্দেশাবলী:
১. আমন্ত্রিত অতিথিদের গাড়ি বেসমেন্টের নির্ধারিত ভিজিটর পার্কিং জোনে রাখার ব্যবস্থা করুন।
২. ক্যাটারিং ও ডেকোরেশনের ভারী সামগ্রী ওঠানামার জন্য কেবল সার্ভিস লিফট ব্যবহার নিশ্চিত করুন।
৩. রাত ১০:০০ টায় সাউন্ড সিস্টেম ও অতিরিক্ত আলো বন্ধ করার বিষয়টি তদারকি করুন।
৪. বহিরাগতদের ছাদ ব্যতীত অন্য কোনো আবাসিক ফ্লোরে অপ্রয়োজনীয় চলাচল নিষিদ্ধ।

অনুমোদনকারী কর্মকর্তা: _____________________    ডিউটি সিকিউরিটি অফিসার: _____________________
নাম: ${form.societySecretary}`;
  }, [form, currentVenue]);

  const activeDocText = lang === "bn" ? bookingTextBn : bookingTextEn;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-amber-950/60 via-slate-900 to-rose-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <PartyPopper className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Rooftop BBQ & Community Hall Booking Hub
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ছাদ ও হল বুকিং রেজিস্টার
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Rooftop BBQ reservations, community hall booking clearance, security gate pass & DMP safety by-laws
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
              onClick={() => setActiveTab("booking")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "booking"
                  ? "border-amber-500 text-amber-400 bg-amber-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>১. বুকিং ও অনুমোদনপত্র (Event Booking Slip)</span>
            </button>
            <button
              onClick={() => setActiveTab("guest_pass")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "guest_pass"
                  ? "border-amber-500 text-amber-400 bg-amber-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <DoorOpen className="w-4 h-4" />
              <span>২. সিকিউরিটি গেট পাস (Guest Gate Pass)</span>
            </button>
            <button
              onClick={() => setActiveTab("safety_charter")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "safety_charter"
                  ? "border-amber-500 text-amber-400 bg-amber-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>৩. ছাদ ও অনুষ্ঠান নীতিমালা (Safety Code)</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: BOOKING & APPLICATION SLIP */}
          {activeTab === "booking" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Form Details (5 cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800 text-xs">
                
                {/* Venue selection */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
                    <Building className="w-4 h-4" />
                    <span>Select Venue (ভেন্যু নির্বাচন করুন):</span>
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {VENUES.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => handleVenueChange(v.id)}
                        className={`p-2 rounded-lg border text-center transition ${
                          form.venueId === v.id
                            ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
                        }`}
                      >
                        <p className="text-[11px] leading-tight">{v.name.split("(")[0]}</p>
                        <span className="text-[10px] text-slate-500 block mt-1">৳{v.baseRate}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-slate-400 block mb-0.5">Event Type / অনুষ্ঠানের ধরণ:</label>
                    <select
                      value={form.eventType}
                      onChange={(e) => setField("eventType", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-[11px]"
                    >
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-0.5">Date / তারিখ:</label>
                      <input
                        type="text"
                        value={form.eventDate}
                        onChange={(e) => setField("eventDate", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-0.5">Expected Guests:</label>
                      <input
                        type="number"
                        value={form.expectedGuests}
                        onChange={(e) => setField("expectedGuests", Number(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-0.5">Time Slot / সময়সূচী:</label>
                    <input
                      type="text"
                      value={form.timeSlot}
                      onChange={(e) => setField("timeSlot", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-[11px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-0.5">Applicant Name:</label>
                      <input
                        type="text"
                        value={form.applicantName}
                        onChange={(e) => setField("applicantName", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-0.5">Flat Number:</label>
                      <input
                        type="text"
                        value={form.applicantFlat}
                        onChange={(e) => setField("applicantFlat", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Financials & Addons */}
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-slate-300">Fee & Add-on Breakdown:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-0.5">Generator Fee (৳):</label>
                      <input
                        type="number"
                        value={form.generatorBackupFee}
                        onChange={(e) => setField("generatorBackupFee", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-0.5">Cleaning Fee (৳):</label>
                      <input
                        type="number"
                        value={form.cleaningFee}
                        onChange={(e) => setField("cleaningFee", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-0.5">Refundable Deposit (৳):</label>
                      <input
                        type="number"
                        value={form.refundableDamageDeposit}
                        onChange={(e) => setField("refundableDamageDeposit", e.target.value)}
                        className="w-full bg-slate-900 border border-emerald-500/60 rounded px-2 py-1 text-emerald-300 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-0.5">Guard Overtime (৳):</label>
                      <input
                        type="number"
                        value={form.securityGuardOvertime}
                        onChange={(e) => setField("securityGuardOvertime", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
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
                        lang === "bn" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      বাংলা আবেদন
                    </button>
                    <button
                      onClick={() => setLang("en")}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                        lang === "en" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      English Slip
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
                      className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition shadow"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Booking Slip</span>
                    </button>
                  </div>
                </div>

                {/* Printable Document Box */}
                <div className="bg-white text-slate-900 p-6 sm:p-7 rounded-xl shadow-lg border border-slate-200 font-sans text-xs leading-relaxed max-h-[50vh] overflow-y-auto whitespace-pre-wrap">
                  {activeDocText}
                </div>

                {/* Action Bar */}
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Send booking slip directly to Building Committee or Caretaker:</span>
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

          {/* TAB 2: SECURITY GUEST GATE PASS */}
          {activeTab === "guest_pass" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <DoorOpen className="w-4 h-4" />
                    <span>Security Guard Guest Clearance & Visitor Entry Slip</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Official authorization for main gate security guards to allow event guests & caterers into the premises.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(guestPassText)}
                    className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg transition border border-slate-700"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied!" : "Copy Pass"}</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Guest Gate Pass</span>
                  </button>
                </div>
              </div>

              {/* Printable Guest Pass Box */}
              <div className="bg-white text-slate-900 p-6 sm:p-7 rounded-xl shadow-lg border border-slate-200 font-sans text-xs leading-relaxed max-h-[50vh] overflow-y-auto whitespace-pre-wrap">
                {guestPassText}
              </div>
            </div>
          )}

          {/* TAB 3: ROOFTOP BBQ & EVENT SAFETY CHARTER */}
          {activeTab === "safety_charter" && (
            <div className="space-y-4 text-xs">
              <div className="bg-gradient-to-br from-slate-900 to-amber-950/40 p-5 rounded-xl border border-amber-900/40 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Rooftop BBQ, Party & Safety Compliance Code (ছাদ ও অনুষ্ঠান বিধিমালা)</span>
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  ডিএমপি ও ফায়ার সার্ভিস নির্দেশনা অনুযায়ী ভবনের ছাদে ও কমিউনিটি হলে অনুষ্ঠান উদযাপনের নিয়মাবলী:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-rose-400 flex items-center gap-1.5">
                    <Flame className="w-4 h-4" />
                    <span>১. ফানুস ও আতশবাজি সম্পূর্ণ নিষিদ্ধ (DMP Order)</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    অগ্নিদুর্ঘটনা রোধে ছাদে কোনো অবস্থাতেই ফানুস (Sky Lanterns) ওড়ানো বা আতশবাজি ফোটানো সম্পূর্ণ দণ্ডনীয় অপরাধ। বারবিকিউ করার সময় কয়লার নিচে ধাতব ছাইয়ের ট্রে রাখা আবশ্যক।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4" />
                    <span>২. রাত ১০:০০ টায় সাউন্ড সিস্টেম কার্ফু (Sound Curfew)</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    ভবনের বয়োবৃদ্ধ ও পরীক্ষার্থী শিক্ষার্থীদের সুবিধার্থে রাত ১০:০০ টার পর যেকোনো প্রকার সাউন্ড বক্স, মাইক্রোফোন বা উচ্চশব্দযুক্ত গান বাজানো কঠোরভাবে নিষিদ্ধ।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>৩. বর্জ্য ব্যবস্থাপনা ও ছাদ পরিষ্কার হস্তান্তর</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    অনুষ্ঠানের প্লেট, গ্লাস, খাবারের উচ্ছিষ্ট বা কয়লা বস্তাবন্দী করে রাত ১২:০০ টার পূর্বেই ভবনের প্রধান ডাস্টবিনে ফেলতে হবে। ড্রেন ব্লকেজ হলে জামানতের টাকা বাজেয়াপ্ত হবে।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-indigo-400 flex items-center gap-1.5">
                    <DoorOpen className="w-4 h-4" />
                    <span>৪. সার্ভিস লিফট ও নিরাপত্তা গেট প্রটোকল</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    ক্যাটারিং সামগ্রী ও অতিরিক্ত চেয়ার-টেবিল ওঠানামার জন্য কেবল সার্ভিস লিফট ব্যবহার করতে হবে। অতিথিদের গাড়ি নির্দিষ্ট ভিজিটর স্লটে রাখতে হবে।
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Official Event Reservation & Security Clearance for Bangladeshi Apartments</span>
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
