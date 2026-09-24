import React, { useState } from "react";
import {
  ClipboardCheck,
  Printer,
  Download,
  Copy,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Key,
  Home,
  Zap,
  Flame,
  Droplet,
  Info,
  X,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  Building,
  RotateCcw
} from "lucide-react";

export default function PropertyConditionReportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("form"); // "form" | "preview"
  const [lang, setLang] = useState("en"); // "en" | "bn"
  const [copied, setCopied] = useState(false);

  // Property & Parties Metadata
  const [metadata, setMetadata] = useState({
    reportType: "move_in", // "move_in" | "move_out"
    inspectionDate: new Date().toISOString().split("T")[0],
    flatNumber: "Flat 4-B, 4th Floor",
    buildingName: "Greenview Palace, Holding #24/A",
    roadSector: "Road 11, Sector 4",
    areaCity: "Uttara, Dhaka-1230",
    landlordName: "Mohammad Rafiqul Islam",
    landlordPhone: "+880 1711-000000",
    landlordNid: "19852691234567890",
    tenantName: "Hasibullah Khan",
    tenantPhone: "+880 1819-000000",
    tenantNid: "19982699876543210",
    tenancyStartDate: "2026-10-01",
    witnessName: "Abdul Karim (Building Manager/Security)",
    witnessPhone: "+880 1912-345678",
  });

  // Meter Readings
  const [meterReadings, setMeterReadings] = useState({
    electricityMeterType: "prepaid", // "prepaid" | "postpaid"
    electricityMeterNo: "DESCO-88902145",
    electricityReading: "Current Balance: ৳1,450 (or 245.8 kWh)",
    gasType: "pipeline_prepaid", // "pipeline_prepaid" | "cylinder" | "pipeline_postpaid"
    gasCardNo: "Titas-7749102",
    gasReading: "Units Remaining: 84 m³",
    wasaReading: "Sub-meter initial reading: 1,024 units",
    keysHandedOver: "Main Door (3 Keys), Master Bed (2 Keys), Common Bed (2 Keys), Balcony (1 Key), Gate RFID Card (2 Tags)",
  });

  // Room Inspection Items
  const [rooms, setRooms] = useState([
    {
      id: "living_dining",
      nameEn: "Living & Dining Room (ড্রয়িং ও ডাইনিং)",
      items: [
        { nameEn: "Walls & Paint Condition", condition: "good", notes: "Freshly painted, no dampness" },
        { nameEn: "Floor & Tiles", condition: "good", notes: "Clean, no broken tiles" },
        { nameEn: "Ceiling Fans & Regulators", condition: "good", notes: "2x BRB Fans working smoothly" },
        { nameEn: "Light Fixtures & Sockets", condition: "good", notes: "All 6 LED downlights & 4 switches functional" },
        { nameEn: "Windows, Grills & Netting", condition: "good", notes: "Mosquito mesh intact, sliding lock ok" },
        { nameEn: "Main Entrance Door & Lock", condition: "new", notes: "Godrej lock with 3 original keys" },
      ],
    },
    {
      id: "master_bed",
      nameEn: "Master Bedroom & Attached Bath (মাস্টার বেডরুম ও বাথরুম)",
      items: [
        { nameEn: "Bedroom Walls & Damp Check", condition: "minor_wear", notes: "Small paint scratch behind wardrobe area" },
        { nameEn: "Attached Balcony Door & Grill", condition: "good", notes: "Grill intact, sliding door locks tight" },
        { nameEn: "Bathroom Commode & Flush (Combi)", condition: "good", notes: "Flush pressure normal, no leakage" },
        { nameEn: "Geyser & Hot Water Line", condition: "good", notes: "Ariston 30L geyser heating properly" },
        { nameEn: "Taps, Shower Head & Basin", condition: "good", notes: "Chrome finish, good water flow" },
        { nameEn: "AC Point & Drain Pipe", condition: "good", notes: "15A breaker switch & drain pipe tested" },
      ],
    },
    {
      id: "guest_bed",
      nameEn: "Second Bedroom & Common Bath (দ্বিতীয় বেডরুম ও কমন বাথ)",
      items: [
        { nameEn: "Bedroom Walls & Ceiling", condition: "good", notes: "Clean, no water seepage" },
        { nameEn: "Fan & Electrical Switchboard", condition: "good", notes: "1x Fan + 3 lights working" },
        { nameEn: "Common Bathroom Commode/Pan", condition: "good", notes: "Clean, siphon flush works" },
        { nameEn: "Basin & Mirror Cabinet", condition: "good", notes: "Mirror intact, no cracks" },
      ],
    },
    {
      id: "kitchen",
      nameEn: "Kitchen & Utility Area (রান্নাঘর ও ওয়াশিং স্পেস)",
      items: [
        { nameEn: "Kitchen Counter & Tiles", condition: "good", notes: "Granite top clean, oil stains removed" },
        { nameEn: "Gas Stove Point & Safety Valve", condition: "good", notes: "Prepaid card meter connected, no gas odor" },
        { nameEn: "Kitchen Sink & Drain Trap", condition: "good", notes: "Smooth drainage, no leakage under sink" },
        { nameEn: "Exhaust Fan / Kitchen Hood", condition: "good", notes: "Exhaust fan spinning quietly" },
        { nameEn: "Washing Machine Water Point", condition: "good", notes: "Inlet tap & dedicated drain pipe functional" },
      ],
    },
  ]);

  // Landlord Provided Inventory & Appliances Table
  const [inventory, setInventory] = useState([
    { id: 1, item: "Ceiling Fans (সিলিং ফ্যান)", brand: "BRB / Walton", qty: 4, condition: "Good working order" },
    { id: 2, item: "Exhaust Fans (একজস্ট ফ্যান)", brand: "Super Star", qty: 2, condition: "Clean & functional" },
    { id: 3, item: "Water Geyser (গিজার)", brand: "Ariston 30L", qty: 1, condition: "Working, heats in 15 mins" },
    { id: 4, item: "Gas Burner (গ্যাস চুলা)", brand: "RFL 2-Burner Glass Top", qty: 1, condition: "New burner caps" },
    { id: 5, item: "Main Door Godrej Lock Set", brand: "Godrej Ultra", qty: 1, condition: "3 keys provided" },
  ]);

  const [newInventoryItem, setNewInventoryItem] = useState({ item: "", brand: "", qty: 1, condition: "Good" });

  const conditionLabels = {
    new: { en: "Brand New / Pristine", bn: "সম্পূর্ণ নতুন / নিখুঁত", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
    good: { en: "Good Condition", bn: "ভালো ও কার্যকর অবস্থা", color: "bg-blue-100 text-blue-800 border-blue-300" },
    minor_wear: { en: "Minor Wear / Scratches", bn: "স্বাভাবিক দাগ / সামান্য ত্রুটি", color: "bg-amber-100 text-amber-800 border-amber-300" },
    damaged: { en: "Damaged / Needs Repair", bn: "ক্ষতিগ্রস্ত / মেরামতযোগ্য", color: "bg-rose-100 text-rose-800 border-rose-300" },
    na: { en: "Not Applicable", bn: "প্রযোজ্য নয়", color: "bg-gray-100 text-gray-700 border-gray-300" },
  };

  const handleMetadataChange = (field, val) => {
    setMetadata((prev) => ({ ...prev, [field]: val }));
  };

  const handleMeterChange = (field, val) => {
    setMeterReadings((prev) => ({ ...prev, [field]: val }));
  };

  const handleItemConditionChange = (roomId, itemIdx, condition) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;
        const newItems = [...r.items];
        newItems[itemIdx].condition = condition;
        return { ...r, items: newItems };
      })
    );
  };

  const handleItemNotesChange = (roomId, itemIdx, notes) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;
        const newItems = [...r.items];
        newItems[itemIdx].notes = notes;
        return { ...r, items: newItems };
      })
    );
  };

  const handleAddCustomRoomItem = (roomId) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;
        return {
          ...r,
          items: [...r.items, { nameEn: "Custom Fixture / Item", condition: "good", notes: "Condition verified" }],
        };
      })
    );
  };

  const handleDeleteRoomItem = (roomId, itemIdx) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;
        return {
          ...r,
          items: r.items.filter((_, idx) => idx !== itemIdx),
        };
      })
    );
  };

  const handleAddInventory = (e) => {
    e.preventDefault();
    if (!newInventoryItem.item.trim()) return;
    setInventory((prev) => [
      ...prev,
      { id: Date.now(), ...newInventoryItem, qty: Number(newInventoryItem.qty) || 1 },
    ]);
    setNewInventoryItem({ item: "", brand: "", qty: 1, condition: "Good" });
  };

  const handleDeleteInventory = (id) => {
    setInventory((prev) => prev.filter((i) => i.id !== id));
  };

  const loadPreset = (type) => {
    if (type === "furnished") {
      setInventory([
        { id: 1, item: "Sofa Set (3+2+1 seater)", brand: "Hatil Oak Wood", qty: 1, condition: "Clean fabric, firm cushions" },
        { id: 2, item: "Dining Table + 6 Chairs", brand: "Otobi Solid Wood", qty: 1, condition: "Tempered glass top, no scratches" },
        { id: 3, item: "King Size Bed + Orthopedic Mattress", brand: "Regal / Apex Foam", qty: 1, condition: "Mattress protector fitted" },
        { id: 4, item: "Inverter AC 1.5 Ton", brand: "Gree 18000 BTU", qty: 2, condition: "Remote working, filters clean" },
        { id: 5, item: "Refrigerator 350L (Double Door)", brand: "Walton Non-Frost", qty: 1, condition: "Both freezer and chiller cold" },
        { id: 6, item: "Automatic Washing Machine (7.5kg)", brand: "Samsung Front Load", qty: 1, condition: "Tested spin cycle" },
        { id: 7, item: "Kitchen Microwave Oven (25L)", brand: "Panasonic", qty: 1, condition: "Glass plate clean, heats normally" },
        { id: 8, item: "Main Door & Room Keys Set", brand: "Original Set", qty: 1, condition: "4 sets of keys + 2 lift RFID cards" },
      ]);
    } else if (type === "bachelor") {
      setInventory([
        { id: 1, item: "Ceiling Fans", brand: "Standard", qty: 3, condition: "Good working speed" },
        { id: 2, item: "Single Beds / Cots", brand: "Steel frame", qty: 3, condition: "Sturdy, no squeaks" },
        { id: 3, item: "Single Door Refrigerator (180L)", brand: "Singer", qty: 1, condition: "Frost free, cooling ok" },
        { id: 4, item: "Gas Burner (2-Burner)", brand: "Standard Gas Stove", qty: 1, condition: "Connected with cylinder tube" },
        { id: 5, item: "Main Entrance Keys", brand: "Keys", qty: 3, condition: "3 duplicate keys for flatmates" },
      ]);
    } else {
      // Standard Unfurnished
      setInventory([
        { id: 1, item: "Ceiling Fans (সিলিং ফ্যান)", brand: "BRB / Walton", qty: 4, condition: "Good working order" },
        { id: 2, item: "Exhaust Fans (একজস্ট ফ্যান)", brand: "Super Star", qty: 2, condition: "Clean & functional" },
        { id: 3, item: "Water Geyser (গিজার)", brand: "Ariston 30L", qty: 1, condition: "Working, heats in 15 mins" },
        { id: 4, item: "Gas Burner (গ্যাস চুলা)", brand: "RFL 2-Burner Glass Top", qty: 1, condition: "New burner caps" },
        { id: 5, item: "Main Door Godrej Lock Set", brand: "Godrej Ultra", qty: 1, condition: "3 keys provided" },
      ]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const generateMarkdownSummary = () => {
    let md = `# PROPERTY HANDOVER CONDITION & INVENTORY REPORT\n`;
    md += `**Report Type:** ${metadata.reportType === "move_in" ? "Move-In Handover Baseline Inspection" : "Move-Out Final Settlement Inspection"}\n`;
    md += `**Date:** ${metadata.inspectionDate}\n`;
    md += `**Property Address:** ${metadata.flatNumber}, ${metadata.buildingName}, ${metadata.roadSector}, ${metadata.areaCity}\n\n`;
    md += `## Parties Involved\n`;
    md += `- **Landlord:** ${metadata.landlordName} (Phone: ${metadata.landlordPhone}, NID: ${metadata.landlordNid})\n`;
    md += `- **Tenant:** ${metadata.tenantName} (Phone: ${metadata.tenantPhone}, NID: ${metadata.tenantNid})\n\n`;
    md += `## Utility Meter & Key Baseline\n`;
    md += `- **Electricity (${meterReadings.electricityMeterType.toUpperCase()}):** Meter No: ${meterReadings.electricityMeterNo} | ${meterReadings.electricityReading}\n`;
    md += `- **Gas (${meterReadings.gasType}):** Card/Ref: ${meterReadings.gasCardNo} | ${meterReadings.gasReading}\n`;
    md += `- **WASA Water Reading:** ${meterReadings.wasaReading}\n`;
    md += `- **Keys Handed Over:** ${meterReadings.keysHandedOver}\n\n`;
    md += `## Room-by-Room Fixture State\n`;
    rooms.forEach((r) => {
      md += `### ${r.nameEn}\n`;
      r.items.forEach((item) => {
        md += `- **${item.nameEn}:** [${item.condition.toUpperCase()}] — ${item.notes}\n`;
      });
      md += `\n`;
    });
    md += `## Landlord Provided Furnishings & Appliances\n`;
    inventory.forEach((i, idx) => {
      md += `${idx + 1}. **${i.item}** (${i.brand || "N/A"}) — Qty: ${i.qty} | Condition: ${i.condition}\n`;
    });
    md += `\n---\n*Signed and accepted in presence of Landlord, Tenant, and Building Witness on ${metadata.inspectionDate}.*`;
    return md;
  };

  const handleCopyMarkdown = () => {
    const text = generateMarkdownSummary();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      {/* Modal Wrapper */}
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white px-5 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <ClipboardCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">
                  {lang === "en" ? "Property Handover Condition & Inventory Report" : "বাড়ি হস্তান্তরকালীন অবস্থা ও ইনভেন্টরি রিপোর্ট"}
                </h2>
                <span className="text-xs bg-emerald-400 text-emerald-950 font-bold px-2 py-0.5 rounded-full uppercase">
                  {metadata.reportType === "move_in" ? "Move-In Audit" : "Move-Out Final"}
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                {lang === "en"
                  ? "Room-by-room condition audit, appliance inventory & meter baseline for deposit security"
                  : "বাসার সকল আসবাবপত্র, বৈদ্যুতিক ফিটিংস ও মিটার রিডিং এর আইনসম্মত প্রত্যয়নপত্র"}
              </p>
            </div>
          </div>

          {/* Action controls */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <div className="bg-emerald-900/60 p-0.5 rounded-lg border border-emerald-500/30 flex text-xs">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded-md font-semibold transition ${
                  lang === "en" ? "bg-white text-emerald-900 shadow-sm" : "text-emerald-200 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("bn")}
                className={`px-2 py-1 rounded-md font-semibold transition ${
                  lang === "bn" ? "bg-white text-emerald-900 shadow-sm" : "text-emerald-200 hover:text-white"
                }`}
              >
                বাংলা
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("form")}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === "form"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>1. Condition & Inventory Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === "preview"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>2. Printable Legal Certificate</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 text-xs font-semibold bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? "Copied Report!" : "Copy Markdown"}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {activeTab === "form" ? (
            <div className="space-y-6">
              {/* Preset Quick Loader */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    {lang === "en" ? "Fast Setup Preset:" : "দ্রুত সেটআপ প্রিসেট:"}
                  </span>
                  <span className="text-xs text-emerald-800">
                    {lang === "en"
                      ? "Load standard fixtures & appliances for your flat type"
                      : "আপনার বাসার ধরন অনুযায়ী ডিফল্ট আসবাবপত্র ও ফিটিংস লোড করুন"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => loadPreset("standard")}
                    className="px-2.5 py-1 text-xs font-semibold bg-white border border-emerald-300 rounded-lg text-emerald-900 hover:bg-emerald-100 transition shadow-sm"
                  >
                    🏡 Unfurnished 3BHK
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPreset("furnished")}
                    className="px-2.5 py-1 text-xs font-semibold bg-white border border-emerald-300 rounded-lg text-emerald-900 hover:bg-emerald-100 transition shadow-sm"
                  >
                    🛋️ Fully Furnished
                  </button>
                  <button
                    type="button"
                    onClick={() => loadPreset("bachelor")}
                    className="px-2.5 py-1 text-xs font-semibold bg-white border border-emerald-300 rounded-lg text-emerald-900 hover:bg-emerald-100 transition shadow-sm"
                  >
                    🎓 Bachelor / Sublet
                  </button>
                </div>
              </div>

              {/* Section 1: Property & Parties */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Building className="w-4 h-4 text-emerald-600" />
                    <span>{lang === "en" ? "1. Property & Parties Information" : "১. বাড়ি ও পক্ষগণের তথ্যাদি"}</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-slate-600">Report Purpose:</label>
                    <select
                      value={metadata.reportType}
                      onChange={(e) => handleMetadataChange("reportType", e.target.value)}
                      className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-md px-2 py-1 text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="move_in">Move-in Baseline Audit (বাড়ি ওঠার প্রারম্ভিক চেক)</option>
                      <option value="move_out">Move-out Clearance Audit (বাড়ি ছাড়ার চূড়ান্ত চেক)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Flat / Unit No.</label>
                    <input
                      type="text"
                      value={metadata.flatNumber}
                      onChange={(e) => handleMetadataChange("flatNumber", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Building & Holding No.</label>
                    <input
                      type="text"
                      value={metadata.buildingName}
                      onChange={(e) => handleMetadataChange("buildingName", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Road / Sector / Area</label>
                    <input
                      type="text"
                      value={metadata.roadSector}
                      onChange={(e) => handleMetadataChange("roadSector", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Thana / City</label>
                    <input
                      type="text"
                      value={metadata.areaCity}
                      onChange={(e) => handleMetadataChange("areaCity", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Inspection Date</label>
                    <input
                      type="date"
                      value={metadata.inspectionDate}
                      onChange={(e) => handleMetadataChange("inspectionDate", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Tenancy Commencement Date</label>
                    <input
                      type="date"
                      value={metadata.tenancyStartDate}
                      onChange={(e) => handleMetadataChange("tenancyStartDate", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Landlord Name & Phone</label>
                    <input
                      type="text"
                      value={`${metadata.landlordName} (${metadata.landlordPhone})`}
                      onChange={(e) => {
                        const parts = e.target.value.split("(");
                        handleMetadataChange("landlordName", parts[0]?.trim() || "");
                        if (parts[1]) handleMetadataChange("landlordPhone", parts[1].replace(")", "").trim());
                      }}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Tenant Name & Phone</label>
                    <input
                      type="text"
                      value={`${metadata.tenantName} (${metadata.tenantPhone})`}
                      onChange={(e) => {
                        const parts = e.target.value.split("(");
                        handleMetadataChange("tenantName", parts[0]?.trim() || "");
                        if (parts[1]) handleMetadataChange("tenantPhone", parts[1].replace(")", "").trim());
                      }}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Witness / Caretaker Name</label>
                    <input
                      type="text"
                      value={metadata.witnessName}
                      onChange={(e) => handleMetadataChange("witnessName", e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Baseline Utility Meters & Keys */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>{lang === "en" ? "2. Baseline Utility Meters & Key Handover" : "২. প্রাথমিক মিটার রিডিং ও চাবি হস্তান্তর"}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Electricity Meter No (DESCO/DPDC)
                    </label>
                    <input
                      type="text"
                      value={meterReadings.electricityMeterNo}
                      onChange={(e) => handleMeterChange("electricityMeterNo", e.target.value)}
                      placeholder="e.g. DESCO 88902145"
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Starting Balance / Unit Reading
                    </label>
                    <input
                      type="text"
                      value={meterReadings.electricityReading}
                      onChange={(e) => handleMeterChange("electricityReading", e.target.value)}
                      placeholder="e.g. Balance: ৳1,450 or Reading: 245.8"
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Gas Meter / Cylinder Reference
                    </label>
                    <input
                      type="text"
                      value={meterReadings.gasCardNo}
                      onChange={(e) => handleMeterChange("gasCardNo", e.target.value)}
                      placeholder="e.g. Titas Prepaid Card #7749102"
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Gas Starting Units / Cylinder State
                    </label>
                    <input
                      type="text"
                      value={meterReadings.gasReading}
                      onChange={(e) => handleMeterChange("gasReading", e.target.value)}
                      placeholder="e.g. 84 m³ remaining or Full 12kg cylinder"
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      WASA / Water Sub-Meter Reading
                    </label>
                    <input
                      type="text"
                      value={meterReadings.wasaReading}
                      onChange={(e) => handleMeterChange("wasaReading", e.target.value)}
                      placeholder="e.g. 1024 units or Included in Service Charge"
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Keys Handed Over (Chabi & RFID)
                    </label>
                    <input
                      type="text"
                      value={meterReadings.keysHandedOver}
                      onChange={(e) => handleMeterChange("keysHandedOver", e.target.value)}
                      placeholder="e.g. Main door (3), Bedrooms (2), Lift card (2)"
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Room-by-Room Fixtures & Condition Inspection */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Home className="w-4 h-4 text-cyan-600" />
                    <span>{lang === "en" ? "3. Room-by-Room Physical Condition Audit" : "৩. কক্ষভিত্তিক ভৌত অবস্থা ও ফিটিংস নিরীক্ষা"}</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    Select condition & add pre-existing notes
                  </span>
                </div>

                <div className="space-y-4">
                  {rooms.map((room) => (
                    <div key={room.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                      <div className="bg-slate-100/90 px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                          {room.nameEn}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddCustomRoomItem(room.id)}
                          className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-white border border-emerald-300 px-2 py-0.5 rounded flex items-center gap-1 shadow-sm"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Item</span>
                        </button>
                      </div>

                      <div className="divide-y divide-slate-200">
                        {room.items.map((item, idx) => (
                          <div key={idx} className="p-3 bg-white grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
                            <div className="md:col-span-4">
                              <span className="text-xs font-semibold text-slate-800 block">
                                {item.nameEn}
                              </span>
                            </div>
                            
                            <div className="md:col-span-3">
                              <select
                                value={item.condition}
                                onChange={(e) => handleItemConditionChange(room.id, idx, e.target.value)}
                                className={`w-full text-xs font-semibold border rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-emerald-500 ${
                                  conditionLabels[item.condition]?.color || "bg-slate-50 text-slate-800 border-slate-300"
                                }`}
                              >
                                <option value="new">🌟 Brand New / Pristine</option>
                                <option value="good">✅ Good Condition (ভালো)</option>
                                <option value="minor_wear">⚠️ Minor Wear / Scratch (সামান্য দাগ)</option>
                                <option value="damaged">❌ Damaged / Needs Repair (মেরামত আবশ্যক)</option>
                                <option value="na">⚪ N/A (প্রযোজ্য নয়)</option>
                              </select>
                            </div>

                            <div className="md:col-span-4">
                              <input
                                type="text"
                                value={item.notes}
                                onChange={(e) => handleItemNotesChange(room.id, idx, e.target.value)}
                                placeholder="Specific notes (e.g. 2 scratches on corner, working)"
                                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>

                            <div className="md:col-span-1 flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleDeleteRoomItem(room.id, idx)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Landlord Inventory & Appliances */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Key className="w-4 h-4 text-purple-600" />
                    <span>{lang === "en" ? "4. Landlord-Provided Furnishings & Appliances Inventory" : "৪. বাড়িওয়ালার আসবাবপত্র ও বৈদ্যুতিক সরঞ্জামের তালিকা"}</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    {inventory.length} items logged
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">#</th>
                        <th className="p-2.5">Item Name (পণ্যের বিবরণ)</th>
                        <th className="p-2.5">Brand / Model</th>
                        <th className="p-2.5 text-center">Qty (সংখ্যা)</th>
                        <th className="p-2.5">Move-in Condition</th>
                        <th className="p-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {inventory.map((inv, idx) => (
                        <tr key={inv.id} className="hover:bg-slate-50/80">
                          <td className="p-2.5 font-bold text-slate-500">{idx + 1}</td>
                          <td className="p-2.5 font-semibold text-slate-800">{inv.item}</td>
                          <td className="p-2.5 text-slate-600">{inv.brand || "—"}</td>
                          <td className="p-2.5 text-center font-bold text-emerald-800 bg-emerald-50/50">{inv.qty}</td>
                          <td className="p-2.5 text-slate-700">{inv.condition}</td>
                          <td className="p-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteInventory(inv.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add new inventory form */}
                <form onSubmit={handleAddInventory} className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-slate-100 items-center">
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      placeholder="Item name (e.g. Microwave Oven)"
                      value={newInventoryItem.item}
                      onChange={(e) => setNewInventoryItem({ ...newInventoryItem, item: e.target.value })}
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="Brand / Model (e.g. Walton 25L)"
                      value={newInventoryItem.brand}
                      onChange={(e) => setNewInventoryItem({ ...newInventoryItem, brand: e.target.value })}
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={newInventoryItem.qty}
                      onChange={(e) => setNewInventoryItem({ ...newInventoryItem, qty: e.target.value })}
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 text-center focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Condition (e.g. Good)"
                      value={newInventoryItem.condition}
                      onChange={(e) => setNewInventoryItem({ ...newInventoryItem, condition: e.target.value })}
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="submit"
                      className="w-full sm:w-auto p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="sm:hidden">Add</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* View Certificate CTA */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold rounded-xl text-sm hover:from-emerald-700 hover:to-teal-800 transition flex items-center gap-2 shadow-md"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span>View & Generate Printable Legal Report</span>
                </button>
              </div>
            </div>
          ) : (
            /* Printable Legal Document View */
            <div className="space-y-6">
              <div className="print-report-container bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-10 shadow-lg font-serif text-slate-900 space-y-6">
                
                {/* Official Letterhead & Title */}
                <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
                  <div className="inline-block bg-slate-900 text-white text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-0.5 rounded-full mb-1">
                    Premises Rent Control Act, 1991 (বাড়ি ভাড়া নিয়ন্ত্রণ আইন, ১৯৯১) Standard Handover Schedule
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-950">
                    {lang === "en"
                      ? "RESIDENTIAL PROPERTY HANDOVER CONDITION & INVENTORY REPORT"
                      : "আবাসিক ফ্ল্যাট হস্তান্তরকালীন আসবাবপত্র ও ভৌত অবস্থা সংক্রান্ত পরিদর্শন প্রত্যয়নপত্র"}
                  </h1>
                  <p className="text-xs font-sans text-slate-600">
                    {metadata.reportType === "move_in"
                      ? "MOVE-IN BASELINE AUDIT & ASSET INVENTORY (উদ্বোধনী পরিদর্শন রিপোর্ট)"
                      : "MOVE-OUT VACATE & DEPOSIT SETTLEMENT AUDIT (বাড়ি ছাড়ার সমাপনী পরিদর্শন রিপোর্ট)"}
                  </p>
                </div>

                {/* Property & Execution Metadata Table */}
                <div className="font-sans text-xs grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 border border-slate-300 rounded-xl">
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Flat / Holding:</span>
                    <span className="font-bold text-slate-900">{metadata.flatNumber}, {metadata.buildingName}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Area / City:</span>
                    <span className="font-bold text-slate-900">{metadata.roadSector}, {metadata.areaCity}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Inspection Date:</span>
                    <span className="font-bold text-slate-900">{metadata.inspectionDate}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Tenancy Start Date:</span>
                    <span className="font-bold text-slate-900">{metadata.tenancyStartDate}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Landlord Name:</span>
                    <span className="font-bold text-slate-900">{metadata.landlordName}</span>
                    <span className="block text-slate-600 text-[11px]">{metadata.landlordPhone}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Tenant Name:</span>
                    <span className="font-bold text-slate-900">{metadata.tenantName}</span>
                    <span className="block text-slate-600 text-[11px]">{metadata.tenantPhone}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="block text-slate-500 font-semibold uppercase text-[10px]">Keys & Access:</span>
                    <span className="font-bold text-slate-900">{meterReadings.keysHandedOver}</span>
                  </div>
                </div>

                {/* Utility Meter Readings Table */}
                <div className="font-sans space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-200 px-3 py-1 rounded">
                    {lang === "en" ? "A. Utility Meters & Baseline Balance" : "ক. ইউটিলিটি মিটার ও প্রাথমিক ব্যালেন্স"}
                  </h4>
                  <table className="w-full text-xs border border-slate-300">
                    <thead className="bg-slate-100 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-2 border-r border-slate-300">Utility Type</th>
                        <th className="p-2 border-r border-slate-300">Meter / Card Account No.</th>
                        <th className="p-2">Initial Handover Reading / Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300">
                      <tr>
                        <td className="p-2 border-r border-slate-300 font-semibold">Electricity (DESCO / DPDC)</td>
                        <td className="p-2 border-r border-slate-300">{meterReadings.electricityMeterNo}</td>
                        <td className="p-2 font-medium">{meterReadings.electricityReading}</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-slate-300 font-semibold">Gas (Titas / LPG Cylinder)</td>
                        <td className="p-2 border-r border-slate-300">{meterReadings.gasCardNo}</td>
                        <td className="p-2 font-medium">{meterReadings.gasReading}</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-slate-300 font-semibold">WASA Water Sub-Meter</td>
                        <td className="p-2 border-r border-slate-300">Flat Sub-Meter</td>
                        <td className="p-2 font-medium">{meterReadings.wasaReading}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Room-by-Room Inspection Matrix */}
                <div className="font-sans space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-200 px-3 py-1 rounded">
                    {lang === "en" ? "B. Physical Fixtures & Room Inspection Matrix" : "খ. কক্ষভিত্তিক ভৌত কাঠামো ও ফিটিংস নিরীক্ষা তালিকা"}
                  </h4>
                  <div className="border border-slate-300 rounded overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-100 font-bold border-b border-slate-300">
                        <tr>
                          <th className="p-2 border-r border-slate-300 w-1/3">Area & Fixture Item</th>
                          <th className="p-2 border-r border-slate-300 w-1/4">Recorded Condition</th>
                          <th className="p-2">Inspector Observations / Pre-existing Defects</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-300">
                        {rooms.flatMap((room) =>
                          room.items.map((item, idx) => (
                            <tr key={`${room.id}-${idx}`} className={idx === 0 ? "bg-slate-50/50" : ""}>
                              <td className="p-1.5 px-2.5 border-r border-slate-300">
                                <span className="font-semibold text-slate-900">{item.nameEn}</span>
                                <span className="block text-[10px] text-slate-500">{room.nameEn}</span>
                              </td>
                              <td className="p-1.5 px-2.5 border-r border-slate-300 font-medium">
                                <span className={`inline-block text-[11px] px-2 py-0.5 rounded font-bold ${conditionLabels[item.condition]?.color}`}>
                                  {lang === "en" ? conditionLabels[item.condition]?.en : conditionLabels[item.condition]?.bn}
                                </span>
                              </td>
                              <td className="p-1.5 px-2.5 text-slate-700 text-[11px] italic">
                                {item.notes || "No defect observed"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Landlord Furnishings & Appliances */}
                <div className="font-sans space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-200 px-3 py-1 rounded">
                    {lang === "en" ? "C. Landlord Furnishings & Appliances Inventory" : "গ. বাড়িওয়ালার আসবাবপত্র ও বৈদ্যুতিক সরঞ্জামের তালিকা"}
                  </h4>
                  <table className="w-full text-xs border border-slate-300">
                    <thead className="bg-slate-100 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-1.5 px-2 border-r border-slate-300 w-8">#</th>
                        <th className="p-1.5 px-2 border-r border-slate-300">Item Description</th>
                        <th className="p-1.5 px-2 border-r border-slate-300">Brand / Model</th>
                        <th className="p-1.5 px-2 border-r border-slate-300 text-center">Qty</th>
                        <th className="p-1.5 px-2">Handover State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300">
                      {inventory.map((inv, idx) => (
                        <tr key={inv.id}>
                          <td className="p-1.5 px-2 border-r border-slate-300 text-center font-bold">{idx + 1}</td>
                          <td className="p-1.5 px-2 border-r border-slate-300 font-semibold text-slate-900">{inv.item}</td>
                          <td className="p-1.5 px-2 border-r border-slate-300 text-slate-700">{inv.brand || "—"}</td>
                          <td className="p-1.5 px-2 border-r border-slate-300 text-center font-bold text-slate-900">{inv.qty}</td>
                          <td className="p-1.5 px-2 text-slate-800">{inv.condition}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Legal Declarations & Signature Blocks */}
                <div className="font-sans text-xs space-y-3 pt-2">
                  <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 text-[11px] leading-relaxed">
                    <p className="font-bold text-slate-900 mb-1">
                      {lang === "en" ? "LEGAL UNDERTAKING & SETTLEMENT TERMS:" : "আইনি অঙ্গীকারনামা ও শর্তাবলী:"}
                    </p>
                    {lang === "en" ? (
                      <p>
                        We, the undersigned Landlord and Tenant, jointly declare that this report accurately reflects the physical condition, fixture functionality, meter readings, and inventory of the aforementioned premises as of the inspection date. The Tenant shall not be held liable for pre-existing defects recorded herein or normal wear and tear resulting from reasonable domestic occupancy. All landlord-provided inventory items shall be returned in equivalent working condition at tenancy termination.
                      </p>
                    ) : (
                      <p>
                        আমরা নিম্নস্বাক্ষরকারী বাড়িওয়ালা ও ভাড়াটিয়া উভয়পক্ষ যৌথভাবে ঘোষণা করিতেছি যে, এই পরিদর্শন প্রতিবেদনে উল্লিখিত আসবাবপত্র, বৈদ্যুতিক ও স্যানিটারি ফিটিংসের অবস্থা এবং মিটার রিডিং সম্পূর্ণ সত্য ও নির্ভুল। প্রতিবেদনে লিপিবদ্ধ পূর্বের দাগ বা ত্রুটির জন্য ভাড়াটিয়া দায়ী থাকিবেন না। মেয়াদান্তে স্বাভাবিক ক্ষয়-ক্ষতি (Normal wear & tear) ব্যতীত সকল মালামাল অক্ষত অবস্থায় বাড়িওয়ালার নিকট সমর্পণ করিতে হইবে।
                      </p>
                    )}
                  </div>

                  {/* Signatures */}
                  <div className="grid grid-cols-3 gap-6 pt-10 text-center font-sans text-xs">
                    <div className="border-t-2 border-slate-800 pt-1.5">
                      <p className="font-bold text-slate-900">{metadata.landlordName}</p>
                      <p className="text-[11px] text-slate-600">Landlord Signature (বাড়িওয়ালার স্বাক্ষর)</p>
                      <p className="text-[10px] text-slate-400">Date: _______________</p>
                    </div>

                    <div className="border-t-2 border-slate-800 pt-1.5">
                      <p className="font-bold text-slate-900">{metadata.tenantName}</p>
                      <p className="text-[11px] text-slate-600">Tenant Signature (ভাড়াটিয়ার স্বাক্ষর)</p>
                      <p className="text-[10px] text-slate-400">Date: _______________</p>
                    </div>

                    <div className="border-t-2 border-slate-800 pt-1.5">
                      <p className="font-bold text-slate-900">{metadata.witnessName || "Building Caretaker / Manager"}</p>
                      <p className="text-[11px] text-slate-600">Witness Signature (সাক্ষী/ম্যানেজার)</p>
                      <p className="text-[10px] text-slate-400">Date: _______________</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {lang === "en"
                ? "Legally compliant template under Bangladesh Tenancy Practice"
                : "বাংলাদেশ ভাড়াটিয়া সুরক্ষা ও জামানত নিষ্পত্তির মানসম্মত ফর্ম"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition shadow-sm"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
