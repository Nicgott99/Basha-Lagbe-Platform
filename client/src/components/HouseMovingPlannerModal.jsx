import React, { useState, useMemo } from "react";
import {
  X,
  Printer,
  Copy,
  Check,
  Truck,
  Box,
  Calendar,
  CheckSquare,
  Clock,
  Plus,
  Trash2,
  FileText,
  User,
  Phone,
  Building,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Send,
  PackageCheck,
  Tag,
  Compass,
  ArrowRight,
} from "lucide-react";

const INITIAL_CHECKLIST = [
  { id: "c1", stage: "2_weeks", task: "Give written 1-month Notice to Vacate to current landlord", done: true },
  { id: "c2", stage: "2_weeks", task: "Confirm new flat lease deed, advance payment & key collection date", done: true },
  { id: "c3", stage: "1_week", task: "Book shifting truck / covered van and pack & shift team", done: true },
  { id: "c4", stage: "1_week", task: "Collect 20-30 cardboard cartons, bubble wrap & heavy-duty packing tape", done: false },
  { id: "c5", stage: "1_week", task: "Notify building manager/security guard for lift booking on shifting day", done: false },
  { id: "c6", stage: "2_days", task: "Defrost refrigerator and consume/pack all perishable food items", done: false },
  { id: "c7", stage: "2_days", task: "Dismantle AC units, water geysers, wall-mounted TVs and beds", done: false },
  { id: "c8", stage: "2_days", task: "Pack 'First-Night Survival Bag' (Medicines, toiletries, chargers, 1 set clothes)", done: false },
  { id: "c9", stage: "day_0", task: "Record final electricity, gas & WASA meter readings with photos", done: false },
  { id: "c10", stage: "day_0", task: "Hand over all flat & gate keys to landlord and sign handover sheet", done: false },
  { id: "c11", stage: "day_0", task: "Supervise careful loading of fragile glass and electronic items in truck", done: false },
];

const INITIAL_BOXES = [
  { id: "b1", boxNo: "01", room: "Master Bed / মাস্টার বেড", items: "Winter blankets, Bed sheets, Pillows, Curtains", isFragile: false },
  { id: "b2", boxNo: "02", room: "Living Room / ড্রয়িং", items: "55\" Smart TV, Soundbar, Showcase Glass Items, Lamp", isFragile: true },
  { id: "b3", boxNo: "03", room: "Kitchen / রান্নাঘর", items: "Ceramic Dinner Set, Glass Tumblers, Spice jars, Blender", isFragile: true },
  { id: "b4", boxNo: "04", room: "Kitchen / রান্নাঘর", items: "Pressure Cooker, Non-stick Pans, Cutlery, Gas Stove", isFragile: false },
  { id: "b5", boxNo: "05", room: "Study & Kids / পড়ার ঘর", items: "Academic books, Laptop chargers, Stationery, Toys", isFragile: false },
];

export default function HouseMovingPlannerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("checklist"); // "checklist" | "boxes" | "truck_order" | "guidelines"
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);
  const [boxes, setBoxes] = useState(INITIAL_BOXES);
  const [copied, setCopied] = useState(false);

  // Truck Booking & Job Order Form
  const [truckForm, setTruckForm] = useState({
    shiftingDate: "15 October 2026",
    pickupTime: "07:00 AM (সকাল ৭:০০ টা)",
    originAddress: "Flat 3A, House 14, Road 7, Block B, Bashundhara R/A, Dhaka",
    originFloor: "3rd Floor (Lift Available)",
    destinationAddress: "Flat 5B, Green Garden Heights, Road 11, Banani, Dhaka",
    destinationFloor: "5th Floor (Service Lift Available)",
    
    // Mover & Vehicle
    moverCompany: "Dhaka Express Movers & Shifting Services",
    driverName: "Md. Jahangir Alam",
    driverPhone: "01819-334455",
    vehicleType: "2-Ton Covered Van (14 ft)",
    vehicleRegNo: "Dhaka Metro-U-11-9876",
    numLabourers: 4,

    // Financials
    agreedTruckFare: 7500,
    labourFeeTotal: 4000,
    acDismantleFee: 2000,
    advancePaid: 3000,

    // Tenant Contact
    clientName: "MD Hasib Ullah Khan Alvie",
    clientPhone: "01712-345678",
    specialInstructions: "Handle Kitchen Box #2 and Living Room TV Box #1 with extreme care. Use soft blankets for refrigerator wrapping.",
  });

  const setTruckField = (k, v) => setTruckForm((prev) => ({ ...prev, [k]: v }));

  // Checklist Actions
  const toggleChecklist = (id) => {
    setChecklist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, done: !c.done } : c))
    );
  };

  const completedCount = checklist.filter((c) => c.done).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  // Box Actions
  const addBox = () => {
    const nextNo = String(boxes.length + 1).padStart(2, "0");
    setBoxes((prev) => [
      ...prev,
      { id: `b_${Date.now()}`, boxNo: nextNo, room: "Master Bed / রুম", items: "Clothes & essentials", isFragile: false },
    ]);
  };

  const updateBox = (id, field, val) => {
    setBoxes((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: val } : b))
    );
  };

  const deleteBox = (id) => {
    setBoxes((prev) => prev.filter((b) => b.id !== id));
  };

  // Financial Calculations
  const totalBill =
    (Number(truckForm.agreedTruckFare) || 0) +
    (Number(truckForm.labourFeeTotal) || 0) +
    (Number(truckForm.acDismantleFee) || 0);

  const dueBalance = Math.max(0, totalBill - (Number(truckForm.advancePaid) || 0));

  // Generate Truck Job Order Text
  const jobOrderText = useMemo(() => {
    return `বাসা বদল ও পরিবহন চুক্তিপত্র (HOUSE SHIFTING JOB ORDER)
তারিখ: ${new Date().toLocaleDateString("bn-BD")}

গ্রাহকের বিবরণ:
নাম: ${truckForm.clientName} | মোবাইল: ${truckForm.clientPhone}

শিফটিং বিবরণী:
- বাসা ছাড়ার ঠিকানা: ${truckForm.originAddress} (${truckForm.originFloor})
- নতুন বাসার ঠিকানা: ${truckForm.destinationAddress} (${truckForm.destinationFloor})
- শিফটিং এর তারিখ ও সময়: ${truckForm.shiftingDate} — ${truckForm.pickupTime}

পরিবহন ও লেবার তথ্য:
- এজেন্সি / চালক: ${truckForm.moverCompany} (চালক: ${truckForm.driverName})
- চালকের মোবাইল: ${truckForm.driverPhone}
- গাড়ির ধরণ ও নম্বর: ${truckForm.vehicleType} (গাড়ী নং: ${truckForm.vehicleRegNo})
- মোট হেল্পার / লেবার সংখ্যা: ${truckForm.numLabourers} জন

ভাড়া ও পেমেন্ট বিবরণী:
১. গাড়ি ভাড়া (Truck Fare): ৳${Number(truckForm.agreedTruckFare).toLocaleString("en-IN")}/-
২. লেবার মজুরি (লোডিং/আনলোডিং): ৳${Number(truckForm.labourFeeTotal).toLocaleString("en-IN")}/-
৩. এসি/টিভি খোলা ও ফিটিং: ৳${Number(truckForm.acDismantleFee).toLocaleString("en-IN")}/-
-----------------------------------------------------------
মোট প্রদেয় বিল: ৳${totalBill.toLocaleString("en-IN")}/-
অগ্রিম জমা (Advance Paid): ৳${Number(truckForm.advancePaid).toLocaleString("en-IN")}/-
★ অবশিষ্ট বকেয়া (Due upon delivery): ৳${dueBalance.toLocaleString("en-IN")}/-

বিশেষ নির্দেশনা: ${truckForm.specialInstructions}

গ্রাহকের স্বাক্ষর: _________________________    চালকের স্বাক্ষর: _________________________
নাম: ${truckForm.clientName}                     নাম: ${truckForm.driverName}`;
  }, [truckForm, totalBill, dueBalance]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-teal-950/60 via-slate-900 to-indigo-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  House Shifting & Moving Day Planner
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  বাসা বদল ও প্যাকিং রোডম্যাপ
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Moving day countdown timeline, room carton label maker, truck & labour booking voucher
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

        {/* Top Progress Metric Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 py-3.5 bg-slate-950/60 border-b border-slate-800 text-sm">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col">
            <span className="text-xs text-slate-400 font-medium">Moving Date / শিফটিং দিন</span>
            <span className="text-base font-bold text-teal-300 mt-1">{truckForm.shiftingDate}</span>
            <span className="text-[11px] text-slate-500">{truckForm.pickupTime}</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col">
            <span className="text-xs text-slate-400 font-medium">Checklist Progress / প্রস্তুতি</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-base font-bold text-white">{completedCount} of {checklist.length} Done</span>
              <span className="text-xs font-bold text-teal-400">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col">
            <span className="text-xs text-slate-400 font-medium">Packed Boxes / কার্টুন সংখ্যা</span>
            <span className="text-lg font-bold text-amber-300 mt-1">{boxes.length} Cartons</span>
            <span className="text-[11px] text-amber-500/80">
              {boxes.filter((b) => b.isFragile).length} Fragile (কাঁচ/ইলেকট্রনিক্স)
            </span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col">
            <span className="text-xs text-slate-400 font-medium">Estimated Shifting Fare / মোট খরচ</span>
            <span className="text-lg font-bold text-emerald-300 mt-1">৳{totalBill.toLocaleString("en-IN")}</span>
            <span className="text-[11px] text-rose-400 font-semibold">Due: ৳{dueBalance.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 pt-3 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab("checklist")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "checklist"
                  ? "border-teal-500 text-teal-400 bg-teal-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>১. টাইমলাইন ও প্রস্তুতি চেকলিস্ট (Timeline)</span>
            </button>
            <button
              onClick={() => setActiveTab("boxes")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "boxes"
                  ? "border-teal-500 text-teal-400 bg-teal-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>২. বক্স ও ফ্র্যাজাইল লেবেল (Box Stickers)</span>
            </button>
            <button
              onClick={() => setActiveTab("truck_order")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "truck_order"
                  ? "border-teal-500 text-teal-400 bg-teal-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>৩. ট্রাক বুকিং ও চুক্তিপত্র (Job Order)</span>
            </button>
            <button
              onClick={() => setActiveTab("guidelines")}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
                activeTab === "guidelines"
                  ? "border-teal-500 text-teal-400 bg-teal-500/10 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>৪. শুভ দিন ও শিফটিং গাইড (Tips)</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: MOVING TIMELINE CHECKLIST */}
          {activeTab === "checklist" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Step-by-Step House Shifting Countdown (ধাপে ধাপে করণীয়)</span>
                </h3>
                <span className="text-xs text-slate-400">
                  {completedCount} of {checklist.length} completed ({progressPercent}%)
                </span>
              </div>

              <div className="space-y-3">
                {/* 2 Weeks Before */}
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>২ সপ্তাহ পূর্বে (2 Weeks Before Shifting)</span>
                  </h4>
                  <div className="space-y-1.5">
                    {checklist
                      .filter((c) => c.stage === "2_weeks")
                      .map((c) => (
                        <div
                          key={c.id}
                          onClick={() => toggleChecklist(c.id)}
                          className="flex items-center gap-3 p-2 bg-slate-900 rounded-lg border border-slate-800 hover:bg-slate-800/60 cursor-pointer transition text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={c.done}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 bg-slate-800 border-slate-700"
                          />
                          <span className={c.done ? "line-through text-slate-500" : "text-slate-200"}>
                            {c.task}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* 1 Week Before */}
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>১ সপ্তাহ পূর্বে (1 Week Before)</span>
                  </h4>
                  <div className="space-y-1.5">
                    {checklist
                      .filter((c) => c.stage === "1_week")
                      .map((c) => (
                        <div
                          key={c.id}
                          onClick={() => toggleChecklist(c.id)}
                          className="flex items-center gap-3 p-2 bg-slate-900 rounded-lg border border-slate-800 hover:bg-slate-800/60 cursor-pointer transition text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={c.done}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 bg-slate-800 border-slate-700"
                          />
                          <span className={c.done ? "line-through text-slate-500" : "text-slate-200"}>
                            {c.task}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* 2 Days Before */}
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>২ দিন পূর্বে (2 Days Before — Packing Rush)</span>
                  </h4>
                  <div className="space-y-1.5">
                    {checklist
                      .filter((c) => c.stage === "2_days")
                      .map((c) => (
                        <div
                          key={c.id}
                          onClick={() => toggleChecklist(c.id)}
                          className="flex items-center gap-3 p-2 bg-slate-900 rounded-lg border border-slate-800 hover:bg-slate-800/60 cursor-pointer transition text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={c.done}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 bg-slate-800 border-slate-700"
                          />
                          <span className={c.done ? "line-through text-slate-500" : "text-slate-200"}>
                            {c.task}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Shifting Day 0 */}
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    <span>বাসা বদলের দিন (Moving Day - Day 0)</span>
                  </h4>
                  <div className="space-y-1.5">
                    {checklist
                      .filter((c) => c.stage === "day_0")
                      .map((c) => (
                        <div
                          key={c.id}
                          onClick={() => toggleChecklist(c.id)}
                          className="flex items-center gap-3 p-2 bg-slate-900 rounded-lg border border-slate-800 hover:bg-slate-800/60 cursor-pointer transition text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={c.done}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 bg-slate-800 border-slate-700"
                          />
                          <span className={c.done ? "line-through text-slate-500" : "text-slate-200"}>
                            {c.task}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PACKING CARTON STICKER & LABELS */}
          {activeTab === "boxes" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Box className="w-4 h-4" />
                    <span>Room-by-Room Carton Box Stickers & Fragile Labels</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Add packed cartons, mark fragile items, and print stickers to tape onto boxes.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={addBox}
                    className="flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Box / কার্টুন যোগ</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Labels (লেবেল প্রিন্ট)</span>
                  </button>
                </div>
              </div>

              {/* Editable Box Grid & Sticker View */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {boxes.map((b) => (
                  <div
                    key={b.id}
                    className={`p-4 rounded-xl border relative space-y-2.5 transition ${
                      b.isFragile
                        ? "bg-rose-950/20 border-rose-800/60"
                        : "bg-slate-900 border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-md">
                          BOX #{b.boxNo}
                        </span>
                        {b.isFragile && (
                          <span className="px-2 py-0.5 bg-rose-600 text-white font-black text-[10px] rounded uppercase animate-pulse">
                            ⚠️ FRAGILE / সাবধানে ধরুন
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => deleteBox(b.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-0.5">Destination Room / রুম:</label>
                        <input
                          type="text"
                          value={b.room}
                          onChange={(e) => updateBox(b.id, "room", e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-0.5">Box Contents / মালামাল:</label>
                        <input
                          type="text"
                          value={b.items}
                          onChange={(e) => updateBox(b.id, "items", e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-300"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id={`fragile_${b.id}`}
                          checked={b.isFragile}
                          onChange={(e) => updateBox(b.id, "isFragile", e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-rose-600 focus:ring-rose-500 bg-slate-800 border-slate-700"
                        />
                        <label htmlFor={`fragile_${b.id}`} className="text-slate-300 text-[11px] cursor-pointer">
                          Mark as Fragile / কাঁচ বা ইলেকট্রনিক্স (Handle with care)
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TRUCK BOOKING & JOB ORDER */}
          {activeTab === "truck_order" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Details (5 cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800 text-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5 pb-2 border-b border-slate-800">
                  <Truck className="w-4 h-4" />
                  <span>Truck & Labour Booking Info</span>
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Shifting Date / তারিখ:</label>
                    <input
                      type="text"
                      value={truckForm.shiftingDate}
                      onChange={(e) => setTruckField("shiftingDate", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Pickup Time / সময়:</label>
                    <input
                      type="text"
                      value={truckForm.pickupTime}
                      onChange={(e) => setTruckField("pickupTime", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Origin Address (বাসা ছাড়ার ঠিকানা):</label>
                  <input
                    type="text"
                    value={truckForm.originAddress}
                    onChange={(e) => setTruckField("originAddress", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white mb-1.5"
                  />
                  <input
                    type="text"
                    value={truckForm.originFloor}
                    onChange={(e) => setTruckField("originFloor", e.target.value)}
                    placeholder="Floor & Lift info"
                    className="w-full bg-slate-900/60 border border-slate-700/60 rounded px-2.5 py-0.5 text-[11px] text-slate-400"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Destination Address (নতুন বাসার ঠিকানা):</label>
                  <input
                    type="text"
                    value={truckForm.destinationAddress}
                    onChange={(e) => setTruckField("destinationAddress", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white mb-1.5"
                  />
                  <input
                    type="text"
                    value={truckForm.destinationFloor}
                    onChange={(e) => setTruckField("destinationFloor", e.target.value)}
                    placeholder="Floor & Lift info"
                    className="w-full bg-slate-900/60 border border-slate-700/60 rounded px-2.5 py-0.5 text-[11px] text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Driver / Agency Name:</label>
                    <input
                      type="text"
                      value={truckForm.driverName}
                      onChange={(e) => setTruckField("driverName", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Driver Phone:</label>
                    <input
                      type="text"
                      value={truckForm.driverPhone}
                      onChange={(e) => setTruckField("driverPhone", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Vehicle Type:</label>
                    <input
                      type="text"
                      value={truckForm.vehicleType}
                      onChange={(e) => setTruckField("vehicleType", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Vehicle Reg No:</label>
                    <input
                      type="text"
                      value={truckForm.vehicleRegNo}
                      onChange={(e) => setTruckField("vehicleRegNo", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                </div>

                {/* Financials breakdown */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                  <div>
                    <label className="text-slate-400 block mb-1">Truck Fare (৳):</label>
                    <input
                      type="number"
                      value={truckForm.agreedTruckFare}
                      onChange={(e) => setTruckField("agreedTruckFare", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Labour Fee (৳):</label>
                    <input
                      type="number"
                      value={truckForm.labourFeeTotal}
                      onChange={(e) => setTruckField("labourFeeTotal", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Advance (৳):</label>
                    <input
                      type="number"
                      value={truckForm.advancePaid}
                      onChange={(e) => setTruckField("advancePaid", e.target.value)}
                      className="w-full bg-slate-900 border border-emerald-500/50 rounded px-2 py-1 text-emerald-300 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Printable Job Order & WhatsApp Share (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>Official Job Order & Payment Slip</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(jobOrderText)}
                      className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg transition border border-slate-700"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied!" : "Copy Text"}</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition shadow"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Slip</span>
                    </button>
                  </div>
                </div>

                {/* Printable Document Box */}
                <div className="bg-white text-slate-900 p-6 sm:p-7 rounded-xl shadow-lg border border-slate-200 font-sans text-xs leading-relaxed max-h-[50vh] overflow-y-auto whitespace-pre-wrap">
                  {jobOrderText}
                </div>

                {/* Action Bar */}
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Send Job Order directly to Truck Driver / Mover:</span>
                  <a
                    href={`https://wa.me/88${truckForm.driverPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      jobOrderText
                    )}`}
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

          {/* TAB 4: DHAKA SHIFTING GUIDELINES & AUSPICIOUS DATES */}
          {activeTab === "guidelines" && (
            <div className="space-y-4 text-xs">
              <div className="bg-gradient-to-br from-slate-900 to-teal-950/40 p-5 rounded-xl border border-teal-900/40 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-teal-400" />
                  <span>Dhaka City Shifting Secrets & Auspicious Moving Tips (বাসা বদল গাইড)</span>
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  যানজট এড়িয়ে নির্বিঘ্নে এবং কম খরচে ঢাকা শহরে বাসা বদল করার বিশেষ টিপস ও করণীয়:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-teal-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>ভোর ৬টা থেকে ৮টার মধ্যে গাড়ি লোডিং</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    ঢাকার অভিজাত আবাসিক এলাকাগুলোতে (গুলশান, বনানী, বসুন্ধরা আ/এ, উত্তরা) সকাল ৮টার পর ট্রাক চলাচলে ট্রাফিক ও সিকিউরিটি কড়াকড়ি থাকে। ভোর ৬টায় শুরু করলে যানজট এড়িয়ে দ্রুত পৌঁছানো সম্ভব।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-indigo-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>মাসের শেষ ৩ দিনের পিক-রেট এড়িয়ে চলুন</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    মাসের শেষ দিনগুলোতে ট্রাক ও লেবারদের মারাত্মক চাহিদা থাকে এবং ৩০-৪০% অতিরিক্ত ভাড়া দাবি করে। মাসের ২০ থেকে ২৫ তারিখের মধ্যে শিফটিং শেষ করলে সাশ্রয়ী ভাড়ায় অভিজ্ঞ হেল্পার পাওয়া যায়।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Building className="w-4 h-4" />
                    <span>লিফট বুকিং ও সার্ভিস এলিভেটর পাস</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    উভয় বিল্ডিংয়ের কেয়ারটেকার/ম্যানেজারকে অন্তত ৩ দিন পূর্বে জানিয়ে লিফটে বড় মালামাল বহনের শিডিউল নিশ্চিত করুন, যেন অন্য ফ্ল্যাটের বাসিন্দাদের সাথে সংঘাত না ঘটে।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>মূল্যবান স্বর্ণালংকার ও দলিল বহন</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    পাসপোর্ট, জাতীয় পরিচয়পত্র, জমির দলিল, ব্যাংকের চেক বই, স্বর্ণালংকার ও নগদ অর্থ কখনো শিফটিং ট্রাকে দেবেন না। ব্যক্তিগত হ্যান্ডব্যাগে নিজের হেফাজতে বহন করুন।
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>Complete House Shifting Management Hub for Bangladeshi Tenants</span>
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
