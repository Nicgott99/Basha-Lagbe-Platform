import React, { useState, useMemo } from "react";
import {
  X,
  Printer,
  Copy,
  Check,
  FileCheck,
  ShieldAlert,
  Zap,
  Droplets,
  Flame,
  Truck,
  Building,
  User,
  Key,
  CheckCircle2,
  Send,
  Sparkles,
  DollarSign,
  Calendar,
  PhoneCall,
  Plus,
  Trash2,
  Wifi,
  FileText,
  Clock,
} from "lucide-react";

export default function TenantExitClearanceModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState("utilities"); // "utilities" | "settlement" | "gatepass"
  const [lang, setLang] = useState("bn"); // "bn" | "en"
  const [copied, setCopied] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    tenantName: "Rafiqul Islam (রফিকুল ইসলাম)",
    tenantPhone: "01711-223344",
    tenantNid: "19922692019000123",
    flatNo: "Flat 5-B (৫ম তলা)",
    buildingName: "Greenwood Residency (গ্রিনউড রেসিডেন্সি)",
    propertyAddress: "House 28, Road 11, Sector 4, Uttara, Dhaka-1230",
    landlordName: "Alhajj Shamsul Haque",
    landlordPhone: "01819-887766",
    moveOutDate: "2026-10-31",
    tenancyStartDate: "2024-11-01",
    clearanceIssueDate: "2026-10-11",
    certificateNo: "NOC-BL-2026-8842",

    // Utilities & Meter Readings
    descoMeterNo: "MTR-889210",
    descoFinalReading: "14,850 kWh",
    descoStatus: "Cleared / No Dues (পরিশোধিত)",
    descoBillAmount: 0,

    wasaStatus: "Cleared / Fixed Shared (পরিশোধিত)",
    wasaBillAmount: 0,

    titasGasStatus: "Prepaid Gas Cleared / Fixed Slip Paid (পরিশোধিত)",
    titasGasAmount: 0,

    societyMaintenanceStatus: "Full Month Service Charge Paid (পরিশোধিত)",
    societyAmount: 0,

    ispWifiStatus: "Router Returned & Bill Cleared (রাউটার ফেরত ও পরিশোধিত)",
    ispAmount: 0,

    // Deposit & Settlement
    originalDeposit: 40000,
    paintRepairDeduction: 3500,
    utilityAdjustmentDeduction: 1500,
    otherDeductions: 0,
    deductionReason: "Minor wall repainting in living room & last week prorated electricity unit balance",
    refundMethod: "Bank Transfer / bKash",
    refundTrxId: "TRX-BK-998241",
    keysReturned: "Main Door (3 keys), Bedroom (2 keys), Mailbox (1 key), RFID Gate Fob (1 pcs)",

    // Truck Loading Gate Pass
    truckNo: "Dhaka Metro-Na 11-4455 (পিকআপ/ট্রাক নম্বর)",
    driverName: "Md. Alamgir Hossain",
    driverPhone: "01922-334455",
    loadingSlot: "09:00 AM - 01:00 PM",
    cargoLiftReserved: "Yes (লিফট বুকিং নিশ্চিত)",
    securityOfficerName: "Md. Mofizul Islam (Senior Guard)",
    guardContact: "01855-667788",
  });

  // Calculate Net Refund
  const totalDeductions = useMemo(() => {
    return (
      Number(formData.paintRepairDeduction || 0) +
      Number(formData.utilityAdjustmentDeduction || 0) +
      Number(formData.otherDeductions || 0)
    );
  }, [formData.paintRepairDeduction, formData.utilityAdjustmentDeduction, formData.otherDeductions]);

  const netRefundPayable = useMemo(() => {
    return Math.max(0, Number(formData.originalDeposit || 0) - totalDeductions);
  }, [formData.originalDeposit, totalDeductions]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const loadPreset = (area) => {
    if (area === "dhanmondi") {
      setFormData((prev) => ({
        ...prev,
        flatNo: "Flat 4-A",
        buildingName: "Dhanmondi Lakeview Haven",
        propertyAddress: "House 45, Road 8/A, Dhanmondi, Dhaka-1209",
        originalDeposit: 50000,
        paintRepairDeduction: 4000,
        utilityAdjustmentDeduction: 2000,
        truckNo: "Dhaka Metro-Ta 15-8822",
        driverName: "Md. Rubel Miah",
        loadingSlot: "08:30 AM - 12:30 PM",
      }));
    } else if (area === "gulshan") {
      setFormData((prev) => ({
        ...prev,
        flatNo: "Apt 8-C (South Facing)",
        buildingName: "Gulshan Royale Heights",
        propertyAddress: "Plot 12, Road 44, Gulshan-2, Dhaka-1212",
        originalDeposit: 90000,
        paintRepairDeduction: 6000,
        utilityAdjustmentDeduction: 3000,
        truckNo: "Dhaka Metro-Na 22-9911",
        driverName: "Md. Billal Hossain",
        loadingSlot: "10:00 AM - 02:00 PM",
      }));
    } else if (area === "mirpur") {
      setFormData((prev) => ({
        ...prev,
        flatNo: "Flat 3-B",
        buildingName: "Mirpur Gardenia Palace",
        propertyAddress: "House 18, Road 4, Section 2, Mirpur, Dhaka-1216",
        originalDeposit: 30000,
        paintRepairDeduction: 2000,
        utilityAdjustmentDeduction: 1000,
        truckNo: "Dhaka Metro-Cha 51-3321",
        driverName: "Md. Rafiq Mia",
        loadingSlot: "02:00 PM - 06:00 PM",
      }));
    }
  };

  const certificateText = useMemo(() => {
    return `==================================================================
TENANT EXIT CLEARANCE CERTIFICATE & UTILITY NO-OBJECTION (NOC)
ভাড়াটিয়া প্রস্থান ছাড়পত্র ও ইউটিলিটি বকেয়ামুক্ত প্রত্যয়ন পত্র
Ref No: ${formData.certificateNo} | Date: ${formData.clearanceIssueDate}
==================================================================

1. TENANT & PROPERTY DETAILS (ভাড়াটিয়া ও ফ্ল্যাটের বিবরণ):
------------------------------------------------------------------
- Tenant Name: ${formData.tenantName}
- Contact: ${formData.tenantPhone} | NID: ${formData.tenantNid}
- Property: ${formData.flatNo}, ${formData.buildingName}
- Full Address: ${formData.propertyAddress}
- Tenancy Period: ${formData.tenancyStartDate} to ${formData.moveOutDate}
- Landlord / Authority: ${formData.landlordName} (${formData.landlordPhone})

2. UTILITY DUES VERIFICATION (ইউটিলিটি বিল পরিশোধের অবস্থা):
------------------------------------------------------------------
- Electricity (DESCO/DPDC Meter: ${formData.descoMeterNo}): ${formData.descoStatus} (Final Reading: ${formData.descoFinalReading})
- Water (Dhaka WASA): ${formData.wasaStatus}
- Gas Supply (Titas Gas): ${formData.titasGasStatus}
- Society / Building Service Charge: ${formData.societyMaintenanceStatus}
- Internet / Cable TV: ${formData.ispWifiStatus}

3. SECURITY DEPOSIT & SETTLEMENT (জামানত নিষ্পত্তি হিসাব):
------------------------------------------------------------------
- Total Security Deposit Received: ৳${Number(formData.originalDeposit).toLocaleString()}
- Deductions (Repairs & Paint): ৳${Number(formData.paintRepairDeduction).toLocaleString()}
- Deductions (Utility Adjustment): ৳${Number(formData.utilityAdjustmentDeduction).toLocaleString()}
- Other Deductions: ৳${Number(formData.otherDeductions).toLocaleString()}
- Total Deductions: ৳${totalDeductions.toLocaleString()}
- Deductions Reason: ${formData.deductionReason}
>>> NET REFUND RETURNED TO TENANT: ৳${netRefundPayable.toLocaleString()}
- Payment Method & Trx ID: ${formData.refundMethod} (${formData.refundTrxId})
- Keys & Access Fobs Returned: ${formData.keysReturned}

4. MOVE-OUT TRUCK LOADING GATE PASS (মালামাল বের করার গেট পাস):
------------------------------------------------------------------
- Scheduled Move-out Date: ${formData.moveOutDate}
- Designated Loading Time Slot: ${formData.loadingSlot}
- Transport Truck / Pickup Reg No: ${formData.truckNo}
- Driver: ${formData.driverName} (${formData.driverPhone})
- Cargo Lift Status: ${formData.cargoLiftReserved}
- Clearance Approved By Security: ${formData.securityOfficerName} (${formData.guardContact})

DECLARATION & SIGNATURE:
This is to certify that the outgoing tenant has settled all rental, utility, and maintenance obligations. The landlord and building management have no further monetary or physical claims against the tenant.

___________________________           ___________________________
Tenant's Signature                    Landlord / Building Secy
Date: ${formData.clearanceIssueDate}               Date: ${formData.clearanceIssueDate}

Generated via Basha Lagbe Tenancy Verification System`;
  }, [formData, totalDeductions, netRefundPayable]);

  const handleCopy = () => {
    navigator.clipboard.writeText(certificateText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `*Tenant Exit Clearance Certificate (NOC)*\nFlat: ${formData.flatNo}, ${formData.buildingName}\nTenant: ${formData.tenantName}\nNet Deposit Refunded: ৳${netRefundPayable.toLocaleString()}\nGate Pass Approved: ${formData.truckNo} (${formData.loadingSlot})\nRef: ${formData.certificateNo}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-teal-500/40 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl shadow-teal-950/70 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 px-6 py-4 border-b border-teal-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  {lang === "bn" ? "ভাড়াটিয়া ছাড়পত্র ও ইউটিলিটি এনওসি" : "Tenant Exit Clearance & Utility NOC Hub"}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-500/30 text-teal-200 border border-teal-400/30">
                  Zero-Dues & Gate Pass
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {lang === "bn"
                  ? "ডেসকো, ওয়াসা, গ্যাস বকেয়া নিষ্পত্তি, জামানত ফেরত হিসাব ও পিকআপ গেট পাস"
                  : "Final utility zero-arrears proof, security deposit refund ledger & move-out gate pass"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "bn" ? "en" : "bn")}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-800 border border-slate-700 text-teal-300 hover:bg-slate-700 transition"
            >
              {lang === "bn" ? "English" : "বাংলা"}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Preset Bar */}
        <div className="bg-slate-800/80 px-6 py-2 border-b border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            {lang === "bn" ? "দ্রুত প্রিসেট পূরণ করুন:" : "Quick Load Standard Template:"}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => loadPreset("dhanmondi")}
              className="px-2.5 py-1 rounded bg-slate-700 hover:bg-teal-700 text-slate-200 hover:text-white transition"
            >
              Dhanmondi 8/A
            </button>
            <button
              onClick={() => loadPreset("gulshan")}
              className="px-2.5 py-1 rounded bg-slate-700 hover:bg-teal-700 text-slate-200 hover:text-white transition"
            >
              Gulshan 2
            </button>
            <button
              onClick={() => loadPreset("mirpur")}
              className="px-2.5 py-1 rounded bg-slate-700 hover:bg-teal-700 text-slate-200 hover:text-white transition"
            >
              Mirpur 2
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/90 px-6 pt-2">
          <button
            onClick={() => setActiveTab("utilities")}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition ${
              activeTab === "utilities"
                ? "border-teal-400 text-teal-300 bg-teal-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            {lang === "bn" ? "১. ইউটিলিটি বকেয়ামুক্ত সনদ" : "1. Utility Clearance Matrix"}
          </button>
          <button
            onClick={() => setActiveTab("settlement")}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition ${
              activeTab === "settlement"
                ? "border-teal-400 text-teal-300 bg-teal-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            {lang === "bn" ? "২. জামানত ও চাবি প্রত্যর্পণ" : "2. Deposit & Key Settlement"}
          </button>
          <button
            onClick={() => setActiveTab("gatepass")}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition ${
              activeTab === "gatepass"
                ? "border-teal-400 text-teal-300 bg-teal-950/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Truck className="w-4 h-4 text-cyan-400" />
            {lang === "bn" ? "৩. মালামাল বের করার গেট পাস" : "3. Move-out Gate Pass"}
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Info Strip */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div>
              <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
                {lang === "bn" ? "ভাড়াটিয়ার নাম" : "Tenant Name"}
              </label>
              <input
                type="text"
                value={formData.tenantName}
                onChange={(e) => handleInputChange("tenantName", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-teal-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
                {lang === "bn" ? "ফ্ল্যাট ও ভবন" : "Flat & Building"}
              </label>
              <input
                type="text"
                value={`${formData.flatNo}, ${formData.buildingName}`}
                onChange={(e) => {
                  const parts = e.target.value.split(",");
                  handleInputChange("flatNo", parts[0]?.trim() || "");
                  handleInputChange("buildingName", parts.slice(1).join(",")?.trim() || "");
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-teal-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
                {lang === "bn" ? "বাসা ছাড়ার তারিখ" : "Move-out Date"}
              </label>
              <input
                type="date"
                value={formData.moveOutDate}
                onChange={(e) => handleInputChange("moveOutDate", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-teal-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
                {lang === "bn" ? "সার্টিফিকেট রেফারেন্স" : "Certificate Ref"}
              </label>
              <input
                type="text"
                value={formData.certificateNo}
                onChange={(e) => handleInputChange("certificateNo", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-teal-300 font-mono focus:border-teal-400 focus:outline-none"
              />
            </div>
          </div>

          {/* TAB 1: UTILITIES MATRIX */}
          {activeTab === "utilities" && (
            <div className="space-y-4">
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200">
                  <p className="font-semibold text-amber-300 mb-0.5">
                    {lang === "bn" ? "ইউটিলিটি বকেয়া নিষ্পত্তি নিয়মাবলী:" : "Utility Clearance Guidelines:"}
                  </p>
                  <p>
                    {lang === "bn"
                      ? "প্রস্থানকালে ডেসকো/ডিপিডিসি প্রিপেইড মিটার ব্যালেন্স অথবা পোস্টপেইড শেষ বিলের কপি, ওয়াসা ও তিতাস গ্যাস বকেয়ামুক্ত নিশ্চিত করে ছাড়পত্র ইস্যু করুন।"
                      : "Verify DESCO/DPDC meter final unit reading, WASA pump dues, Titas fixed gas slips and building maintenance charges before sign-off."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Electricity Card */}
                <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      {lang === "bn" ? "বিদ্যুৎ বিল (DESCO / DPDC)" : "Electricity (DESCO/DPDC)"}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Verified
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Meter / Account No</label>
                      <input
                        type="text"
                        value={formData.descoMeterNo}
                        onChange={(e) => handleInputChange("descoMeterNo", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Final Meter Reading</label>
                      <input
                        type="text"
                        value={formData.descoFinalReading}
                        onChange={(e) => handleInputChange("descoFinalReading", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs block mb-1">Clearance Remarks</label>
                    <input
                      type="text"
                      value={formData.descoStatus}
                      onChange={(e) => handleInputChange("descoStatus", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-emerald-300"
                    />
                  </div>
                </div>

                {/* WASA / Water Card */}
                <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      {lang === "bn" ? "পানি ও ওয়াসা বিল (Dhaka WASA)" : "Water Supply (Dhaka WASA)"}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Settled
                    </span>
                  </div>
                  <div className="text-xs">
                    <label className="text-slate-400 block mb-1">WASA Settlement Status</label>
                    <input
                      type="text"
                      value={formData.wasaStatus}
                      onChange={(e) => handleInputChange("wasaStatus", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Includes rooftop overhead tank cleaning charge & deep-tube-well electric bill pro-rata share.
                  </p>
                </div>

                {/* Gas Card */}
                <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-400" />
                      {lang === "bn" ? "গ্যাস সংযোগ (Titas Gas / Cylinder)" : "Gas Supply (Titas / LPG)"}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Paid
                    </span>
                  </div>
                  <div className="text-xs">
                    <label className="text-slate-400 block mb-1">Gas Status & Voucher No</label>
                    <input
                      type="text"
                      value={formData.titasGasStatus}
                      onChange={(e) => handleInputChange("titasGasStatus", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                    />
                  </div>
                </div>

                {/* Building Society / Service Charge */}
                <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <Building className="w-4 h-4 text-purple-400" />
                      {lang === "bn" ? "বিল্ডিং সার্ভিস চার্জ ও দারোয়ান" : "Society Maintenance & Guard"}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      No Arrears
                    </span>
                  </div>
                  <div className="text-xs">
                    <label className="text-slate-400 block mb-1">Service Charge Clearance</label>
                    <input
                      type="text"
                      value={formData.societyMaintenanceStatus}
                      onChange={(e) => handleInputChange("societyMaintenanceStatus", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SETTLEMENT & KEYS */}
          {activeTab === "settlement" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Deposit Held */}
                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">
                    {lang === "bn" ? "জমাকৃত মূল জামানত (টাকা)" : "Total Security Deposit Held"}
                  </span>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 text-sm">৳</span>
                    <input
                      type="number"
                      value={formData.originalDeposit}
                      onChange={(e) => handleInputChange("originalDeposit", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-base font-bold text-white focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Deductions Breakdown */}
                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
                  <span className="text-xs font-semibold text-rose-400 block mb-1">
                    {lang === "bn" ? "মেরামত ও ইউটিলিটি কর্তন" : "Total Deductions"}
                  </span>
                  <div className="text-xl font-bold text-rose-300 mt-1">
                    ৳ {totalDeductions.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Paint touch-up, damaged switch & bill adjustment</p>
                </div>

                {/* Net Refundable */}
                <div className="bg-gradient-to-br from-emerald-950/70 to-teal-950/70 border border-emerald-500/50 rounded-xl p-4">
                  <span className="text-xs font-semibold text-emerald-300 block mb-1">
                    {lang === "bn" ? "ভাড়াটিয়াকে প্রদেয় নিট রিফান্ড" : "Net Refund Payable to Tenant"}
                  </span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    ৳ {netRefundPayable.toLocaleString()}
                  </div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-200">
                    Ready for Transfer
                  </span>
                </div>
              </div>

              {/* Deduction Breakdown Details */}
              <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  {lang === "bn" ? "কর্তন ও জামানত সমন্বয় বিবরণী" : "Deductions & Adjustment Itemization"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Wall Painting / Fixture Repair (৳)</label>
                    <input
                      type="number"
                      value={formData.paintRepairDeduction}
                      onChange={(e) => handleInputChange("paintRepairDeduction", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Final Utility Bill Share (৳)</label>
                    <input
                      type="number"
                      value={formData.utilityAdjustmentDeduction}
                      onChange={(e) => handleInputChange("utilityAdjustmentDeduction", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Other Adjustments (৳)</label>
                    <input
                      type="number"
                      value={formData.otherDeductions}
                      onChange={(e) => handleInputChange("otherDeductions", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 text-xs block mb-1">Deductions Note / Agreement Clause</label>
                  <input
                    type="text"
                    value={formData.deductionReason}
                    onChange={(e) => handleInputChange("deductionReason", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200"
                  />
                </div>
              </div>

              {/* Keys & Refund Verification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-white mb-1">
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>{lang === "bn" ? "চাবি ও গেট আরএফআইডি পাস প্রত্যর্পণ" : "Keys & Access Card Handover"}</span>
                  </div>
                  <input
                    type="text"
                    value={formData.keysReturned}
                    onChange={(e) => handleInputChange("keysReturned", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200"
                  />
                  <p className="text-[11px] text-slate-400">
                    Verify all bedroom, balcony, main lock duplicate keys and RFID garage tags are surrendered.
                  </p>
                </div>

                <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-white mb-1">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>{lang === "bn" ? "রিফান্ড লেনদেন তথ্য" : "Refund Payment Voucher"}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Payment Method"
                      value={formData.refundMethod}
                      onChange={(e) => handleInputChange("refundMethod", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                    />
                    <input
                      type="text"
                      placeholder="Transaction / Cheque ID"
                      value={formData.refundTrxId}
                      onChange={(e) => handleInputChange("refundTrxId", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-teal-300 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRUCK GATE PASS */}
          {activeTab === "gatepass" && (
            <div className="space-y-4">
              <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-4 flex items-start gap-3">
                <Truck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs text-cyan-200">
                  <p className="font-semibold text-cyan-300 mb-0.5">
                    {lang === "bn" ? "সিকিউরিটি গেট পাস ও ট্রাক লোডিং নির্দেশনা:" : "Security Gate Pass & Truck Loading Code:"}
                  </p>
                  <p>
                    {lang === "bn"
                      ? "বিল্ডিং সিকিউরিটি গার্ডদের জন্য এই ছাড়পত্র গেটে প্রদর্শন করতে হবে। নির্ধারিত লোডিং সময়ে লিফট ও মেইন গেট খোলা রাখা হবে।"
                      : "Present this stamped pass to the building security gate before loading furniture and heavy household goods into the transport truck."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="w-4 h-4" />
                    {lang === "bn" ? "যানবাহন ও ড্রাইভারের তথ্য" : "Transport & Driver Credentials"}
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Truck / Pickup Plate No</label>
                      <input
                        type="text"
                        value={formData.truckNo}
                        onChange={(e) => handleInputChange("truckNo", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-semibold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-400 block mb-1">Driver Name</label>
                        <input
                          type="text"
                          value={formData.driverName}
                          onChange={(e) => handleInputChange("driverName", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Driver Phone</label>
                        <input
                          type="text"
                          value={formData.driverPhone}
                          onChange={(e) => handleInputChange("driverPhone", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {lang === "bn" ? "শিফটিং সময় ও লিফট অনুমতি" : "Loading Schedule & Lift Access"}
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Permitted Loading Slot</label>
                      <input
                        type="text"
                        value={formData.loadingSlot}
                        onChange={(e) => handleInputChange("loadingSlot", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-semibold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-400 block mb-1">Cargo Lift Reserved</label>
                        <input
                          type="text"
                          value={formData.cargoLiftReserved}
                          onChange={(e) => handleInputChange("cargoLiftReserved", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Duty Guard / In-Charge</label>
                        <input
                          type="text"
                          value={formData.securityOfficerName}
                          onChange={(e) => handleInputChange("securityOfficerName", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Printable Preview Sheet */}
          <div className="border border-teal-500/30 bg-slate-950/80 rounded-xl p-4 font-mono text-[11px] leading-relaxed text-slate-300 space-y-2 shadow-inner">
            <div className="flex items-center justify-between text-teal-400 border-b border-slate-800 pb-1 font-bold">
              <span>OFFICIAL CLEARANCE CERTIFICATE PREVIEW</span>
              <span className="text-xs text-slate-400">{formData.certificateNo}</span>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-[10.5px] text-slate-300 max-h-48 overflow-y-auto">
              {certificateText}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-900 border-t border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldAlert className="w-4 h-4 text-teal-400" />
            <span>
              {lang === "bn"
                ? "আইনগতভাবে বৈধ ও রেজিস্টার্ড অ্যাপার্টমেন্টের জন্য প্রযোজ্য"
                : "Legally enforceable exit clearance under Bangladesh Premises Rent Control Act"}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? "Copied!" : "Copy NOC Text"}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-semibold transition"
            >
              <Send className="w-4 h-4" />
              <span>WhatsApp Share</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold shadow-lg shadow-teal-900/40 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Certificate</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
