import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Printer,
  Copy,
  Check,
  Award,
  Briefcase,
  Home,
  GraduationCap,
  ShieldCheck,
  FileText,
  User,
  Phone,
  Building,
  Mail,
  Calendar,
  DollarSign,
  Languages,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Send,
} from "lucide-react";

export default function TenantReferenceVerificationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeDocType, setActiveDocType] = useState("employment"); // "employment" | "landlord_ref" | "student" | "guarantor" | "checklist"
  const [lang, setLang] = useState("bn"); // "bn" | "en"
  const [copied, setCopied] = useState(false);

  // ── Form State ──────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    // Tenant Details
    tenantName: "MD Hasib Ullah Khan Alvie",
    tenantPhone: "01712-345678",
    tenantEmail: "hasibullah.khan.alvie@g.bracu.ac.bd",
    tenantNid: "19982692019283741",
    tenantPermanentAddress: "House 12, Road 4, Sector 7, Uttara, Dhaka-1230",

    // Employment Details
    companyName: "TechCorp Bangladesh Ltd.",
    designation: "Senior Software Engineer",
    department: "Engineering & Product",
    employeeId: "TC-2024-8891",
    joiningDate: "01 February 2022",
    employmentType: "Permanent / Full-Time",
    monthlyGrossSalary: 95000,
    companyAddress: "Level 8, Concord Tower, Gulshan-2, Dhaka-1212",
    hrName: "Mr. Farhan Rahman",
    hrDesignation: "Head of Human Resources",
    hrPhone: "01819-998877",
    hrEmail: "hr@techcorp-bd.com",

    // Previous Landlord Reference
    prevLandlordName: "Alhaj Rafiqul Islam",
    prevLandlordPhone: "01819-456789",
    prevAddress: "Flat 3A, House 14, Road 7, Block B, Bashundhara R/A, Dhaka-1229",
    tenancyDuration: "2 Years (01 Nov 2024 – 31 Oct 2026)",
    monthlyRentPaid: 28000,
    paymentTrackRecord: "Always on time / সর্বদা সময়মতো পরিশোধিত",
    reasonForLeaving: "Relocating closer to workplace",

    // Student / University Details
    universityName: "BRAC University",
    departmentName: "Computer Science & Engineering (CSE)",
    studentId: "20101456",
    degreeProgram: "B.Sc. in CSE",
    semesterYear: "Senior Year / 8th Semester",
    guardianName: "Engr. Mahmudul Hasan",
    guardianPhone: "01711-334455",
    guardianRelation: "Father / পিতা",

    // Guarantor / Surety Bond
    guarantorName: "Dr. Kazi Ahsan Habib",
    guarantorDesignation: "Associate Professor, Dhaka University",
    guarantorPhone: "01911-778899",
    guarantorNid: "19752691234567890",
    guarantorAddress: "Flat 5B, Nilkhet Teachers Quarter, Dhaka-1000",
    guarantorRelation: "Maternal Uncle / মামা",

    // Target Rental Property
    targetProperty: "Flat 4A, Green Garden Heights, Banani, Dhaka",
    targetLandlordName: "Mr. Shafiqul Alam",
  });

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Generated Text Templates ─────────────────────────────────────────

  // 1. Employment Verification Letter
  const employmentLetterBn = useMemo(() => {
    return `[কোম্পানি লেটারহেড / OFFICIAL COMPANY LETTERHEAD]
তারিখ: ${new Date().toLocaleDateString("bn-BD")}

বরাবর,
যাঁহার অবগতির জন্য (To Whom It May Concern)

বিষয়: চাকরি ও আয়ের প্রত্যয়ন পত্র (কর্মসংস্থান প্রত্যয়ন)

মহোদয়,
এতদ্বারা প্রত্যয়ন করা যাইতেছে যে, জনাব ${form.tenantName}, পিতা/অভিভাবক: ${form.guardianName || "জনাব অভিভাবক"}, আমাদের প্রতিষ্ঠান "${form.companyName}"-এ গত ${form.joiningDate} খ্রি: তারিখ হইতে একজন স্থায়ী (${form.employmentType}) ${form.designation} হিসেবে ${form.department} বিভাগে কর্মরত আছেন। তাঁহার এমপ্লয়ি আইডি নং: ${form.employeeId}।

আমাদের অফিস রেকর্ড অনুযায়ী, তিনি বর্তমানে মাসিক মোট =${Number(form.monthlyGrossSalary).toLocaleString("en-IN")}/= (কথায়: ${Number(form.monthlyGrossSalary).toLocaleString("en-IN")} টাকা) বেতন ও সুবিধাদি প্রাপ্ত হইতেছেন। 

জনাব ${form.tenantName} একজন দায়িত্বশীল, সৎ ও পরিশ্রমী ব্যক্তি। আমাদের কোম্পানিতে কর্মকালীন সময়ে তাঁহার আচরণ ও আর্থিক লেনদেন অত্যন্ত সন্তোষজনক। বাড়ি/ফ্ল্যাট ভাড়ার আবেদন প্রক্রিয়ার আর্থিক সামর্থ্য ও পরিচিতি প্রমাণের নিমিত্তে তাঁহার অনুরোধের প্রেক্ষিতে এই প্রত্যয়নপত্রটি প্রদান করা হইল।

আমরা তাঁহার জীবনের সর্বাঙ্গীন সাফল্য ও মঙ্গল কামনা করি।

কর্তৃপক্ষের পক্ষে,

স্বাক্ষর ও অফিসিয়াল সীল: ___________________
নাম: ${form.hrName}
পদবী: ${form.hrDesignation}
কোম্পানি: ${form.companyName}
অফিস ঠিকানা: ${form.companyAddress}
যোগাযোগ: ${form.hrPhone} | ${form.hrEmail}`;
  }, [form]);

  const employmentLetterEn = useMemo(() => {
    return `[OFFICIAL COMPANY LETTERHEAD]
Date: ${new Date().toLocaleDateString("en-GB")}

TO WHOM IT MAY CONCERN

Subject: Employment and Income Verification Certificate

Dear Sir/Madam,

This is to certify that Mr. ${form.tenantName} has been employed with ${form.companyName} since ${form.joiningDate}. He currently holds the position of "${form.designation}" in the ${form.department} department as a ${form.employmentType} employee (Employee ID: ${form.employeeId}).

As per our official payroll records, his current gross monthly salary is BDT ৳${Number(form.monthlyGrossSalary).toLocaleString("en-IN")} (Bangladeshi Taka).

Mr. ${form.tenantName} is a sincere, law-abiding, and dependable professional. He bears good moral character and has maintained an impeccable record during his tenure with our organization. This letter is issued at his request solely for the purpose of residential rental verification and financial credibility.

Should you require any additional information, please feel free to contact the Human Resources Department.

Authorized Signatory,

Signature & Official Seal: ___________________
Name: ${form.hrName}
Designation: ${form.hrDesignation}
Company: ${form.companyName}
Address: ${form.companyAddress}
Phone: ${form.hrPhone} | Email: ${form.hrEmail}`;
  }, [form]);

  // 2. Previous Landlord Reference
  const landlordRefBn = useMemo(() => {
    return `পূর্ববর্তী বাড়িওয়ালার প্রত্যয়ন ও চারিত্রিক প্রশংসাপত্র (No-Dues Clearance)
তারিখ: ${new Date().toLocaleDateString("bn-BD")}

বরাবর,
যাঁহার অবগতির জন্য

বিষয়: পূর্ববর্তী ভাড়াটিয়ার চারিত্রিক ও নিয়মিত ভাড়া পরিশোধের প্রত্যয়নপত্র

জনাব,
আমি নিম্নস্বাক্ষরকারী, ${form.prevLandlordName}, মোবাইল: ${form.prevLandlordPhone}, এই মর্মে প্রত্যয়ন করিতেছি যে জনাব ${form.tenantName}, জাতীয় পরিচয়পত্র নং: ${form.tenantNid}, বিগত ${form.tenancyDuration} সময়কাল যাবৎ আমার মালিকানাধীন বাসা: "${form.prevAddress}"-এ অত্যন্ত সুনামের সাথে আবাসিক ভাড়াটিয়া হিসেবে বসবাস করিয়াছেন।

তাহার বসবাসকালীন অভিজ্ঞতা সংক্রান্ত বিবরণী নিম্নরূপ:
১. মাসিক ভাড়া: তিনি নিয়মিত মাসিক =${Number(form.monthlyRentPaid).toLocaleString("en-IN")}/= টাকা এবং ইউটিলিটি বিল মাসের ১০ তারিখের মধ্যে যথাসময়ে পরিশোধ করিতেন (${form.paymentTrackRecord})।
২. ফ্ল্যাটের রক্ষণাবেক্ষণ: তিনি ফ্ল্যাটের কোনো ক্ষতিসাধন করেন নাই এবং ফ্ল্যাটটি পরিষ্কার-পরিচ্ছন্ন অবস্থায় হস্তান্তর করিয়াছেন।
৩. বকেয়া সংক্রান্ত তথ্য: আমার জানামতে তাঁহার নিকট বাসাভাড়া, গ্যাস, বিদ্যুৎ বা ওয়াসার কোনো প্রকার বকেয়া পাওনা নাই।
৪. প্রতিবেশী ও সামাজিক সম্পর্ক: তিনি এবং তাঁহার পরিবার অত্যন্ত ভদ্র, মার্জিত ও প্রতিবেশীবান্ধব ছিলেন।

তিনি নিজ ইচ্ছায় (${form.reasonForLeaving}) ফ্ল্যাট খালি করিয়াছেন। নতুন কোনো বাসা/ফ্ল্যাটে তাঁহাকে ভাড়াটিয়া হিসেবে গ্রহণের জন্য আমি নিঃসংকোচে সুপারিশ করিতেছি।

বিনীত,

স্বাক্ষর: _________________________
নাম: ${form.prevLandlordName}
বাড়িওয়ালা / পূর্ববর্তী ফ্ল্যাট মালিক
মোবাইল: ${form.prevLandlordPhone}`;
  }, [form]);

  const landlordRefEn = useMemo(() => {
    return `PREVIOUS LANDLORD REFERENCE & CLEARANCE CERTIFICATE
Date: ${new Date().toLocaleDateString("en-GB")}

TO WHOM IT MAY CONCERN

Subject: Tenant Reference and No-Dues Clearance Letter

Dear Sir/Madam,

I, the undersigned ${form.prevLandlordName}, owner of "${form.prevAddress}", hereby confirm that Mr. ${form.tenantName} (NID: ${form.tenantNid}) resided as a lawful tenant in my premises for a duration of ${form.tenancyDuration}.

During his tenancy:
1. Rent Payment: He consistently paid his monthly rent of BDT ৳${Number(form.monthlyRentPaid).toLocaleString("en-IN")} on or before the due date.
2. Property Care: He maintained the property in excellent condition and caused no damage to fixtures or premises.
3. Utility Clearance: All utility bills (Electricity, Water, Gas, Service Charge) were fully cleared with zero outstanding arrears upon handover.
4. Conduct: He demonstrated exemplary social conduct and maintained peaceful, harmonious relationships with all neighbors.

He vacated the apartment voluntarily due to ${form.reasonForLeaving}. I have no hesitation in recommending Mr. ${form.tenantName} as an outstanding, reliable, and responsible tenant to any prospective landlord.

Sincerely,

Signature: _________________________
Name: ${form.prevLandlordName}
Property Owner / Landlord
Contact: ${form.prevLandlordPhone}`;
  }, [form]);

  // 3. Student Bonafide Certificate
  const studentLetterBn = useMemo(() => {
    return `[বিশ্ববিদ্যালয় / শিক্ষা প্রতিষ্ঠান প্রত্যয়ন ফরম্যাট]
তারিখ: ${new Date().toLocaleDateString("bn-BD")}

বিষয়: নিয়মিত শিক্ষার্থী ও অভিভাবকত্বের প্রত্যয়ন পত্র

এতদ্বারা জানানো যাইতেছে যে, জনাব ${form.tenantName}, পিতা: ${form.guardianName} (${form.guardianRelation}), আমাদের বিশ্ববিদ্যালয় "${form.universityName}"-এর ${form.departmentName} বিভাগের একজন নিয়মিত ছাত্র। তাঁহার স্টুডেন্ট আইডি নং: ${form.studentId} (${form.semesterYear})।

তাহার অভিভাবকের পূর্ণ বিবরণ:
- নাম: ${form.guardianName}
- সম্পর্ক: ${form.guardianRelation}
- মোবাইল নং: ${form.guardianPhone}
- স্থায়ী ঠিকানা: ${form.tenantPermanentAddress}

বিশ্ববিদ্যালয়ে অধ্যয়নকালে তাঁহার বিরুদ্ধে শৃঙ্খলাভঙ্গের কোনো অভিযোগ নাই। মেস/বাসাভাড়ার আবেদনের প্রেক্ষিতে অভিভাবকের সম্মতিক্রমে এই প্রত্যয়নপত্র প্রস্তুত করা হইল।

স্বাক্ষর ও বিভাগীয় সীল: ___________________
বিভাগীয় প্রধান / হল প্রভোস্ট
${form.universityName}`;
  }, [form]);

  const studentLetterEn = useMemo(() => {
    return `[UNIVERSITY / INSTITUTION BONAFIDE CERTIFICATE]
Date: ${new Date().toLocaleDateString("en-GB")}

TO WHOM IT MAY CONCERN

Subject: Bonafide Student & Guardian Verification

This is to certify that Mr. ${form.tenantName}, Son of ${form.guardianName} (${form.guardianRelation}), is a bonafide and regular student of ${form.universityName}, currently enrolled in the Department of ${form.departmentName} (${form.degreeProgram}, Student ID: ${form.studentId}, Semester: ${form.semesterYear}).

Permanent Address: ${form.tenantPermanentAddress}
Guardian Contact: ${form.guardianName} (${form.guardianRelation}) — Phone: ${form.guardianPhone}

He maintains good academic standing and holds a clean disciplinary record. This certificate is issued upon student's request for residential tenancy verification purposes.

Authorized Signatory & Seal: ___________________
Head of Department / Hall Provost
${form.universityName}`;
  }, [form]);

  // 4. Guarantor Bond Declaration
  const guarantorBondBn = useMemo(() => {
    return `জামিনদার ও নিশ্চয়তাপত্র অঙ্গীকারনামা (GUARANTOR BOND)
তারিখ: ${new Date().toLocaleDateString("bn-BD")}

বরাবর,
বাড়িওয়ালা / ফ্ল্যাট মালিক: ${form.targetLandlordName || "জনাব ফ্ল্যাট মালিক"}
বাসার ঠিকানা: ${form.targetProperty}

আমি নিম্নস্বাক্ষরকারী জামিনদার:
নাম: ${form.guarantorName}
পদবী / পেশা: ${form.guarantorDesignation}
জাতীয় পরিচয়পত্র নং: ${form.guarantorNid}
বর্তমান ঠিকানা: ${form.guarantorAddress}
মোবাইল নং: ${form.guarantorPhone}
ভাড়াটিয়ার সাথে সম্পর্ক: ${form.guarantorRelation}

এই মর্মে অঙ্গীকার করিতেছি যে, অত্র বাসার প্রস্তাবিত ভাড়াটিয়া জনাব ${form.tenantName} (NID: ${form.tenantNid}) আমার পরিচিত ও ${form.guarantorRelation} হন।

আমি স্বেচ্ছায় ও সজ্ঞানে নিশ্চয়তা প্রদান করিতেছি যে:
১. উক্ত ভাড়াটিয়া যথাসময়ে মাসিক ভাড়া ও প্রযোজ্য ইউটিলিটি বিল পরিশোধ করিবেন।
২. ফ্ল্যাটে অবস্থানকালে তিনি দেশের প্রচলিত আইন, সামাজিক শান্তি ও বাড়িওয়ালার নিয়মাবলী মানিয়া চলিবেন।
৩. কোনো অপ্রত্যাশিত কারণে ভাড়াটিয়া ভাড়া পরিশোধে অপারগ হইলে অথবা ফ্ল্যাটের কোনো ক্ষতিসাধন হইলে, জামিনদার হিসেবে আমি উহার প্রয়োজনীয় সমন্বয় ও দায়ভার বহনে বাড়িওয়ালাকে সর্বাত্মক সহযোগিতা করিব।

জামিনদারের স্বাক্ষর: _________________________
নাম: ${form.guarantorName}
মোবাইল: ${form.guarantorPhone}

ভাড়াটিয়ার স্বাক্ষর: _________________________
নাম: ${form.tenantName}`;
  }, [form]);

  const guarantorBondEn = useMemo(() => {
    return `GUARANTOR & SURETY BOND DECLARATION
Date: ${new Date().toLocaleDateString("en-GB")}

To:
The Landlord / Property Owner: ${form.targetLandlordName || "Property Owner"}
Property Address: ${form.targetProperty}

I, the undersigned Guarantor:
Name: ${form.guarantorName}
Profession / Designation: ${form.guarantorDesignation}
National ID (NID) No: ${form.guarantorNid}
Residential Address: ${form.guarantorAddress}
Contact Number: ${form.guarantorPhone}
Relationship with Tenant: ${form.guarantorRelation}

Hereby solemnly declare and guarantee on behalf of the prospective tenant, Mr. ${form.tenantName} (NID: ${form.tenantNid}):

1. Timely Payments: I vouch that the tenant is financially capable and will pay the monthly rent and utility charges punctually.
2. Lawful Conduct: The tenant shall abide by the laws of Bangladesh and the residential rules of the building.
3. Financial Responsibility: In the unlikely event of unresolved defaults or damages attributable to the tenant, I undertake to assist the landlord in resolving and settling such obligations amicably.

Guarantor Signature: _________________________
Name: ${form.guarantorName}
Phone: ${form.guarantorPhone}

Tenant Signature: _________________________
Name: ${form.tenantName}`;
  }, [form]);

  // Current selected document text
  const currentDocText = useMemo(() => {
    if (activeDocType === "employment") return lang === "bn" ? employmentLetterBn : employmentLetterEn;
    if (activeDocType === "landlord_ref") return lang === "bn" ? landlordRefBn : landlordRefEn;
    if (activeDocType === "student") return lang === "bn" ? studentLetterBn : studentLetterEn;
    if (activeDocType === "guarantor") return lang === "bn" ? guarantorBondBn : guarantorBondEn;
    return "";
  }, [activeDocType, lang, employmentLetterBn, employmentLetterEn, landlordRefBn, landlordRefEn, studentLetterBn, studentLetterEn, guarantorBondBn, guarantorBondEn]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-blue-950/60 via-slate-900 to-emerald-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Tenant Reference & Verification Letter Generator
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  প্রত্যয়ন ও রেফারেন্স কিট
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate employment certificates, previous landlord reference clearances, student verifications & guarantor bonds
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

        {/* Top Type Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 px-6 pt-3 pb-2 border-b border-slate-800 bg-slate-950/40">
          <button
            onClick={() => setActiveDocType("employment")}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold border transition ${
              activeDocType === "employment"
                ? "bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>১. চাকরি প্রত্যয়ন (HR Letter)</span>
          </button>

          <button
            onClick={() => setActiveDocType("landlord_ref")}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold border transition ${
              activeDocType === "landlord_ref"
                ? "bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Home className="w-4 h-4" />
            <span>২. বাড়িওয়ালা ছাড়পত্র (Landlord Ref)</span>
          </button>

          <button
            onClick={() => setActiveDocType("student")}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold border transition ${
              activeDocType === "student"
                ? "bg-purple-600/20 border-purple-500 text-purple-300 shadow-sm"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>৩. স্টুডেন্ট প্রত্যয়ন (Student)</span>
          </button>

          <button
            onClick={() => setActiveDocType("guarantor")}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold border transition ${
              activeDocType === "guarantor"
                ? "bg-amber-600/20 border-amber-500 text-amber-300 shadow-sm"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>৪. জামিনদার বন্ড (Guarantor)</span>
          </button>

          <button
            onClick={() => setActiveDocType("checklist")}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold border transition ${
              activeDocType === "checklist"
                ? "bg-teal-600/20 border-teal-500 text-teal-300 shadow-sm"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>৫. যাচাই চেকলিস্ট (Guide)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeDocType !== "checklist" ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Form Controls (5 cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>ফর্ম এন্ট্রি ও তথ্য (Edit Details)</span>
                  </h3>
                  
                  {/* Language Toggle */}
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs">
                    <button
                      onClick={() => setLang("bn")}
                      className={`px-2 py-1 rounded font-medium transition ${
                        lang === "bn" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      বাংলা
                    </button>
                    <button
                      onClick={() => setLang("en")}
                      className={`px-2 py-1 rounded font-medium transition ${
                        lang === "en" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 text-xs">
                  {/* Tenant Basic Details */}
                  <div className="space-y-2">
                    <label className="text-slate-400 font-semibold block">Tenant Name / ভাড়াটিয়ার নাম:</label>
                    <input
                      type="text"
                      value={form.tenantName}
                      onChange={(e) => setField("tenantName", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-1">Phone / মোবাইল:</label>
                      <input
                        type="text"
                        value={form.tenantPhone}
                        onChange={(e) => setField("tenantPhone", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">NID No / এনআইডি:</label>
                      <input
                        type="text"
                        value={form.tenantNid}
                        onChange={(e) => setField("tenantNid", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                  </div>

                  {/* 1. EMPLOYMENT FIELDS */}
                  {activeDocType === "employment" && (
                    <div className="space-y-2.5 pt-2 border-t border-slate-800">
                      <p className="font-semibold text-blue-400">অফিস ও বেতনের তথ্য (Job Details):</p>
                      <div>
                        <label className="text-slate-400 block mb-1">Company Name / প্রতিষ্ঠানের নাম:</label>
                        <input
                          type="text"
                          value={form.companyName}
                          onChange={(e) => setField("companyName", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-slate-400 block mb-1">Designation / পদবী:</label>
                          <input
                            type="text"
                            value={form.designation}
                            onChange={(e) => setField("designation", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Gross Salary (৳):</label>
                          <input
                            type="number"
                            value={form.monthlyGrossSalary}
                            onChange={(e) => setField("monthlyGrossSalary", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-slate-400 block mb-1">Employee ID:</label>
                          <input
                            type="text"
                            value={form.employeeId}
                            onChange={(e) => setField("employeeId", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Joining Date:</label>
                          <input
                            type="text"
                            value={form.joiningDate}
                            onChange={(e) => setField("joiningDate", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">HR Manager Name & Phone:</label>
                        <input
                          type="text"
                          value={form.hrName}
                          onChange={(e) => setField("hrName", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* 2. PREVIOUS LANDLORD FIELDS */}
                  {activeDocType === "landlord_ref" && (
                    <div className="space-y-2.5 pt-2 border-t border-slate-800">
                      <p className="font-semibold text-emerald-400">পূর্ববর্তী বাড়িওয়ালার তথ্য (Prev Landlord):</p>
                      <div>
                        <label className="text-slate-400 block mb-1">Landlord Name / মালিকের নাম:</label>
                        <input
                          type="text"
                          value={form.prevLandlordName}
                          onChange={(e) => setField("prevLandlordName", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Landlord Phone / মোবাইল:</label>
                        <input
                          type="text"
                          value={form.prevLandlordPhone}
                          onChange={(e) => setField("prevLandlordPhone", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Previous Address / পূর্বের বাসার ঠিকানা:</label>
                        <input
                          type="text"
                          value={form.prevAddress}
                          onChange={(e) => setField("prevAddress", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-slate-400 block mb-1">Duration / সময়কাল:</label>
                          <input
                            type="text"
                            value={form.tenancyDuration}
                            onChange={(e) => setField("tenancyDuration", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Monthly Rent Paid (৳):</label>
                          <input
                            type="number"
                            value={form.monthlyRentPaid}
                            onChange={(e) => setField("monthlyRentPaid", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. STUDENT FIELDS */}
                  {activeDocType === "student" && (
                    <div className="space-y-2.5 pt-2 border-t border-slate-800">
                      <p className="font-semibold text-purple-400">শিক্ষা প্রতিষ্ঠান ও অভিভাবক (University & Guardian):</p>
                      <div>
                        <label className="text-slate-400 block mb-1">University / College:</label>
                        <input
                          type="text"
                          value={form.universityName}
                          onChange={(e) => setField("universityName", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-slate-400 block mb-1">Department / বিষয়:</label>
                          <input
                            type="text"
                            value={form.departmentName}
                            onChange={(e) => setField("departmentName", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Student ID No:</label>
                          <input
                            type="text"
                            value={form.studentId}
                            onChange={(e) => setField("studentId", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-slate-400 block mb-1">Guardian Name / অভিভাবক:</label>
                          <input
                            type="text"
                            value={form.guardianName}
                            onChange={(e) => setField("guardianName", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Guardian Phone:</label>
                          <input
                            type="text"
                            value={form.guardianPhone}
                            onChange={(e) => setField("guardianPhone", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. GUARANTOR FIELDS */}
                  {activeDocType === "guarantor" && (
                    <div className="space-y-2.5 pt-2 border-t border-slate-800">
                      <p className="font-semibold text-amber-400">জামিনদারের বিবরণী (Guarantor Details):</p>
                      <div>
                        <label className="text-slate-400 block mb-1">Guarantor Name / জামিনদারের নাম:</label>
                        <input
                          type="text"
                          value={form.guarantorName}
                          onChange={(e) => setField("guarantorName", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-slate-400 block mb-1">Designation / পেশা:</label>
                          <input
                            type="text"
                            value={form.guarantorDesignation}
                            onChange={(e) => setField("guarantorDesignation", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Relationship / সম্পর্ক:</label>
                          <input
                            type="text"
                            value={form.guarantorRelation}
                            onChange={(e) => setField("guarantorRelation", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-slate-400 block mb-1">Guarantor NID:</label>
                          <input
                            type="text"
                            value={form.guarantorNid}
                            onChange={(e) => setField("guarantorNid", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Guarantor Phone:</label>
                          <input
                            type="text"
                            value={form.guarantorPhone}
                            onChange={(e) => setField("guarantorPhone", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Target Property / প্রস্তাবিত বাসার ঠিকানা:</label>
                        <input
                          type="text"
                          value={form.targetProperty}
                          onChange={(e) => setField("targetProperty", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Live Document Preview (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Official Letterhead / Print Preview</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(currentDocText)}
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
                      <span>Print Document</span>
                    </button>
                  </div>
                </div>

                {/* Printable Document Box */}
                <div className="bg-white text-slate-900 p-6 sm:p-7 rounded-xl shadow-lg border border-slate-200 font-sans text-xs leading-relaxed max-h-[55vh] overflow-y-auto whitespace-pre-wrap">
                  {currentDocText}
                </div>

                {/* Bottom WhatsApp Send Bar */}
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Send letter directly to prospective Landlord:</span>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(currentDocText)}`}
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
          ) : (
            /* TAB 5: LANDLORD SCREENING CHECKLIST */
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 p-5 rounded-xl border border-indigo-900/40 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Landlord Comprehensive Tenant Screening Checklist (ভাড়াটিয়া যাচাইকরণ গাইডলাইন)</span>
                </h3>
                <p className="text-xs text-slate-300">
                  নিরাপদ ও ঝামেলামুক্ত বাসাভাড়া নিশ্চিত করতে নতুন ভাড়াটিয়া চুড়ান্ত করার পূর্বে নিম্নলিখিত ৪টি ধাপ যাচাই করা অত্যন্ত গুরুত্বপূর্ণ:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">১</span>
                    <span>জাতীয় পরিচয়পত্র (NID) ও ছবি যাচাই</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    ভাড়াটিয়ার মূল NID কার্ডের উভয় পিঠের ফটোকপি, ২ কপি পাসপোর্ট সাইজ ছবি এবং নির্বাচন কমিশনের Porichoy গেটওয়ে বা 'সুরক্ষা' অ্যাপের মাধ্যমে তথ্য মিলিয়ে নিন।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-blue-400 font-bold">
                    <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs">২</span>
                    <span>কর্মসংস্থান ও স্যালারি সার্টিফিকেট (HR Verification)</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    অফিসের আইডি কার্ডের কপি এবং অফিশিয়াল ইমেইল বা ফোন নম্বরে কল করে প্রার্থীর পদবী ও কর্মসংস্থানের সত্যতা নিশ্চিত করুন।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 font-bold">
                    <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">৩</span>
                    <span>ডিএমপি থানা তথ্য ফরম (CIMS Form) পূরণ</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    ঢাকা মেট্রোপলিটন পুলিশ (DMP)-এর নাগরিক তথ্য সংগ্রহ ফরম (CIMS) পূরণ করিয়ে নিকটস্থ থানায় জমা দিয়ে রিসিট কপি ফাইল করুন।
                  </p>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">৪</span>
                    <span>পূর্বের বাড়িওয়ালার মতামত (Reference Call)</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    পূর্ববর্তী বাসার মালিকের ফোনে সরাসরি কথা বলে ভাড়া পরিশোধের নিয়মিততা ও প্রতিবেশী সম্পর্কের ট্র্যাক রেকর্ড জেনে নিন।
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
            <span>Ready for corporate HR, institutional and legal tenancy verification in Bangladesh</span>
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
