import { useState, useMemo } from "react";
import {
  X,
  ShieldCheck,
  Printer,
  Copy,
  Check,
  Languages,
  User,
  Building,
  Users,
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  Info,
  Phone,
  AlertCircle
} from "lucide-react";

export default function DmpCimsVerificationModal({ isOpen, onClose }) {
  const [lang, setLang] = useState("bn"); // "bn" | "en"
  const [activeTab, setActiveTab] = useState("form"); // "form" | "preview" | "guidelines"

  // 1. Property & Landlord
  const [holdingNo, setHoldingNo] = useState("বাড়ি নং ৪৫");
  const [roadNo, setRoadNo] = useState("রোড নং ৭, সেক্টর ৪");
  const [flatNo, setFlatNo] = useState("ফ্ল্যাট ৪-বি (৪র্থ তলা)");
  const [postCode, setPostCode] = useState("ঢাকা-১২৩০");
  const [thanaName, setThanaName] = useState("উত্তরা পূর্ব থানা");
  const [landlordName, setLandlordName] = useState("জনাব মো: রফিকুল ইসলাম");
  const [landlordPhone, setLandlordPhone] = useState("01711-223344");
  const [landlordNid, setLandlordNid] = useState("19852691234567890");

  // 2. Primary Tenant Details
  const [tenantName, setTenantName] = useState("জনাব তানভীর আহমেদ");
  const [fatherName, setFatherName] = useState("জনাব মো: নুরুল হক");
  const [motherName, setMotherName] = useState("বেগম রোকেয়া হক");
  const [dob, setDob] = useState("১২/০৫/১৯৯৪");
  const [maritalStatus, setMaritalStatus] = useState("বিবাহিত (Married)");
  const [religion, setReligion] = useState("ইসলাম (Islam)");
  const [occupation, setOccupation] = useState("সফটওয়্যার ইঞ্জিনিয়ার (Software Engineer)");
  const [workplaceAddress, setWorkplaceAddress] = useState("টেক ভ্যালি লি:, গুলশান-১, ঢাকা-১২১২");
  const [tenantPhone, setTenantPhone] = useState("01819-556677");
  const [tenantEmail, setTenantEmail] = useState("tanvir.ahmed@example.com");
  const [tenantNid, setTenantNid] = useState("19942699876543210");
  const [passportNo, setPassportNo] = useState("A01234567");
  const [permanentAddress, setPermanentAddress] = useState("গ্রাম: শিবপুর, ডাকঘর: শিবপুর, থানা: শিবপুর, জেলা: নরসিংদী");

  // 3. Family / Flatmate Members
  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: "মোসাম্মৎ সুমাইয়া আক্তার", age: "২৭", relation: "স্ত্রী (Wife)", occupation: "গৃহিণী", phone: "01722-334455" },
    { id: 2, name: "তাহসিন আহমেদ", age: "৩", relation: "পুত্র (Son)", occupation: "শিশু", phone: "N/A" },
  ]);

  // 4. Domestic Help / Driver
  const [maidName, setMaidName] = useState("জরিনা খাতুন");
  const [maidNid, setMaidNid] = useState("19902691122334455");
  const [maidPhone, setMaidPhone] = useState("01911-998877");
  const [maidAddress, setMaidAddress] = useState("গ্রাম: দেওয়ানগঞ্জ, জেলা: জামালপুর");

  // 5. Emergency Contact
  const [emergencyName, setEmergencyName] = useState("জনাব রফিকুল ইসলাম (চাচা)");
  const [emergencyRelation, setEmergencyRelation] = useState("নিকটাত্মীয় / চাচা (Uncle)");
  const [emergencyPhone, setEmergencyPhone] = useState("01712-887766");
  const [emergencyAddress, setEmergencyAddress] = useState("বাড়ি ২০, ধানমন্ডি, ঢাকা");

  // 6. Previous Landlord
  const [prevLandlordName, setPrevLandlordName] = useState("জনাব আলতাফ হোসেন");
  const [prevLandlordPhone, setPrevLandlordPhone] = useState("01811-332211");
  const [prevAddress, setPrevAddress] = useState("বাড়ি ১২, মিরপুর ১০, ঢাকা");
  const [leaveReason, setLeaveReason] = useState("অফিসের নিকটবর্তী স্থানে স্থানান্তর (Relocated closer to office)");

  const [copied, setCopied] = useState(false);

  // Add/Remove Family
  const addFamilyMember = () => {
    setFamilyMembers((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        age: "",
        relation: "",
        occupation: "",
        phone: "",
      },
    ]);
  };

  const removeFamilyMember = (id) => {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const updateFamilyMember = (id, field, value) => {
    setFamilyMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  // Bengali Formatted Document
  const formTextBn = useMemo(() => {
    return `
                       ঢাকা মেট্রোপলিটন পুলিশ (DMP)
               নাগরিক তথ্য ব্যবস্থাপনা সিস্টেম (CIMS) - ভাড়াটিয়া নিবন্ধন ফরম
               (সংশ্লিষ্ট থানায় জমা দেওয়ার জন্য সরকারিভাবে নির্ধারিত ফরম্যাট)

থানার নাম: ${thanaName}                                 তারিখ: .......................
ভাড়াকৃত বাড়ির বিবরণ: ${holdingNo}, ${roadNo}, ${flatNo}, ডাকঘর/পোস্ট কোড: ${postCode}

বাড়িওয়ালার তথ্য (Landlord):
নাম: ${landlordName} | মোবাইল: ${landlordPhone} | NID: ${landlordNid}

[ ২ কপি পাসপোর্ট সাইজ ]
[    রঙিন ছবি লাগান   ]
[    (ভাড়াটিয়ার)     ]

১. ভাড়াটিয়ার পূর্ণ নাম: ${tenantName}
২. পিতার নাম: ${fatherName}
৩. মাতার নাম: ${motherName}
৪. জন্ম তারিখ: ${dob}               ৫. বৈবাহিক অবস্থা: ${maritalStatus}
৬. ধর্ম: ${religion}                 ৭. শিক্ষাগত যোগ্যতা: স্নাতক / স্নাতকোত্তর
৮. পেশা / পদবি: ${occupation}
৯. কর্মস্থলের নাম ও পূর্ণ ঠিকানা: ${workplaceAddress}
১০. মোবাইল নম্বর: ${tenantPhone}
১১. ইমেইল এড্রেস: ${tenantEmail}
১২. জাতীয় পরিচয়পত্র নং (NID): ${tenantNid}
১৩. পাসপোর্ট নম্বর (যদি থাকে): ${passportNo}
১৪. স্থায়ী ঠিকানা: ${permanentAddress}

১৫. পরিবারভুক্ত সদস্য / রুমমেটদের বিবরণী:
${familyMembers.map((m, i) => `   (${i + 1}) নাম: ${m.name || "..."} | বয়স: ${m.age || ".."} | সম্পর্ক: ${m.relation || ".."} | পেশা: ${m.occupation || ".."} | মোবাইল: ${m.phone || ".."}`).join("\n")}

১৬. গৃহকর্মী / গৃহশিক্ষক / ড্রাইভারের বিবরণী:
   নাম: ${maidName} | NID: ${maidNid} | মোবাইল: ${maidPhone} | স্থায়ী ঠিকানা: ${maidAddress}

১৭. জরুরি প্রয়োজনে যোগাযোগের ব্যক্তি (Emergency Contact):
   নাম: ${emergencyName} | সম্পর্ক: ${emergencyRelation} | মোবাইল: ${emergencyPhone} | ঠিকানা: ${emergencyAddress}

১৮. পূর্ববর্তী বাড়িওয়ালার তথ্য (Previous Landlord Clearance):
   নাম: ${prevLandlordName} | মোবাইল: ${prevLandlordPhone} | ঠিকানা: ${prevAddress}
   বাসা পরিবর্তনের কারণ: ${leaveReason}

অঙ্গীকারনামা:
আমি এই মর্মে অঙ্গীকার করিতেছি যে, উপরে প্রদত্ত যাবতীয় তথ্যাবলী সম্পূর্ণ সত্য ও নির্ভুল। কোনো তথ্য গোপন বা মিথ্যা প্রমাণিত হইলে আমি দেশের প্রচলিত আইনে দায়ী থাকিব।


-------------------------------------               -------------------------------------
ভাড়াটিয়ার স্বাক্ষর ও তারিখ                           বাড়িওয়ালার স্বাক্ষর ও তারিখ
(Tenant Signature & Date)                           (Landlord Signature & Date)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ থানার ব্যবহারের জন্য ]
গৃহীত তথ্য যাচাইকারী বিট অফিসারের নাম ও পদবি: .......................................
বিট নম্বর: ............... | সিল ও স্বাক্ষর: ........................................
    `.trim();
  }, [
    thanaName,
    holdingNo,
    roadNo,
    flatNo,
    postCode,
    landlordName,
    landlordPhone,
    landlordNid,
    tenantName,
    fatherName,
    motherName,
    dob,
    maritalStatus,
    religion,
    occupation,
    workplaceAddress,
    tenantPhone,
    tenantEmail,
    tenantNid,
    passportNo,
    permanentAddress,
    familyMembers,
    maidName,
    maidNid,
    maidPhone,
    maidAddress,
    emergencyName,
    emergencyRelation,
    emergencyPhone,
    emergencyAddress,
    prevLandlordName,
    prevLandlordPhone,
    prevAddress,
    leaveReason,
  ]);

  // English Formatted Document
  const formTextEn = useMemo(() => {
    return `
                   DHAKA METROPOLITAN POLICE (DMP)
       Citizen Information Management System (CIMS) - Tenant Registration Form
       (Official Format for Submission to Local Police Station under DMP Guidelines)

Police Station (Thana): ${thanaName}                     Date: .......................
Premises Particulars: ${holdingNo}, ${roadNo}, ${flatNo}, Post Code: ${postCode}

LANDLORD DETAILS:
Name: ${landlordName} | Phone: ${landlordPhone} | NID: ${landlordNid}

[ Affix 2 Passport ]
[ Size Photographs ]
[  (Primary Tenant) ]

1. Tenant's Full Name: ${tenantName}
2. Father's Name: ${fatherName}
3. Mother's Name: ${motherName}
4. Date of Birth: ${dob}            5. Marital Status: ${maritalStatus}
6. Religion: ${religion}
7. Profession / Designation: ${occupation}
8. Workplace Name & Full Address: ${workplaceAddress}
9. Mobile Number: ${tenantPhone}
10. Email Address: ${tenantEmail}
11. National ID No (NID): ${tenantNid}
12. Passport No (if any): ${passportNo}
13. Permanent Address: ${permanentAddress}

14. FAMILY MEMBERS / FLATMATE PARTICULARS:
${familyMembers.map((m, i) => `   (${i + 1}) Name: ${m.name || "..."} | Age: ${m.age || ".."} | Relation: ${m.relation || ".."} | Occupation: ${m.occupation || ".."} | Phone: ${m.phone || ".."}`).join("\n")}

15. DOMESTIC WORKER / MAID / DRIVER DETAILS:
   Name: ${maidName} | NID: ${maidNid} | Phone: ${maidPhone} | Address: ${maidAddress}

16. EMERGENCY CONTACT PERSON IN BANGLADESH:
   Name: ${emergencyName} | Relation: ${emergencyRelation} | Phone: ${emergencyPhone} | Address: ${emergencyAddress}

17. PREVIOUS LANDLORD PARTICULARS:
   Name: ${prevLandlordName} | Phone: ${prevLandlordPhone} | Address: ${prevAddress}
   Reason for Moving: ${leaveReason}

DECLARATION:
I hereby declare that all particulars supplied herein are true and accurate to the best of my knowledge. If any information is found fraudulent or concealed, I shall be subject to legal proceedings under Bangladesh Laws.


___________________________                         ___________________________
Tenant Signature & Date                             Landlord Signature & Date

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ FOR POLICE STATION OFFICIAL USE ONLY ]
Verified By Beat Officer (Name & Rank): ............................................
Beat No: ................. | Seal & Signature: .....................................
    `.trim();
  }, [
    thanaName,
    holdingNo,
    roadNo,
    flatNo,
    postCode,
    landlordName,
    landlordPhone,
    landlordNid,
    tenantName,
    fatherName,
    motherName,
    dob,
    maritalStatus,
    religion,
    occupation,
    workplaceAddress,
    tenantPhone,
    tenantEmail,
    tenantNid,
    passportNo,
    permanentAddress,
    familyMembers,
    maidName,
    maidNid,
    maidPhone,
    maidAddress,
    emergencyName,
    emergencyRelation,
    emergencyPhone,
    emergencyAddress,
    prevLandlordName,
    prevLandlordPhone,
    prevAddress,
    leaveReason,
  ]);

  const currentFormText = lang === "bn" ? formTextBn : formTextEn;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFormText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>DMP Tenant Verification Form (CIMS)</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 15mm 12mm 15mm 12mm;
            }
            body {
              font-family: 'SolaimanLipi', 'Nikosh', 'Kalpurush', 'Times New Roman', serif;
              font-size: 11pt;
              line-height: 1.45;
              color: #111;
              white-space: pre-wrap;
              margin: 0;
              padding: 10px;
            }
            .form-box {
              border: 1.5px solid #222;
              padding: 16px;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="form-box">
            ${currentFormText}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-700 via-rose-700 to-indigo-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
              <ShieldCheck className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                DMP CIMS Police Verification Form Generator
                <span className="hidden sm:inline-block text-xs bg-yellow-400 text-red-950 font-bold px-2 py-0.5 rounded-full">
                  থানা ভেরিফিকেশন
                </span>
              </h2>
              <p className="text-xs text-rose-100">
                Official Dhaka Metropolitan Police (DMP) tenant registration form for local police station submission
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Language Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 px-4 pt-2 shrink-0">
          <div className="flex overflow-x-auto no-scrollbar">
            {[
              { id: "form", label: "Fill Form Fields", icon: FileText },
              { id: "preview", label: "Official DMP CIMS Form Preview", icon: ShieldCheck },
              { id: "guidelines", label: "Submission Guidelines & Police Rules", icon: Info },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2.5 px-4 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? "border-rose-600 text-rose-600 dark:text-rose-400 font-semibold"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-rose-600 dark:text-rose-400" : "text-gray-400"}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-1.5 pb-2 sm:pb-0">
            <Languages className="w-4 h-4 text-gray-500" />
            <div className="bg-gray-200 dark:bg-gray-700 p-0.5 rounded-lg flex text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLang("bn")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  lang === "bn"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900"
                }`}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  lang === "en"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900"
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* TAB 1: FORM INPUTS */}
          {activeTab === "form" && (
            <div className="space-y-5 text-xs">
              {/* Thana & Premises */}
              <div className="bg-rose-50/40 dark:bg-rose-950/20 p-4 rounded-xl border border-rose-100 dark:border-rose-900/40 space-y-3">
                <h3 className="font-bold text-sm text-rose-950 dark:text-rose-200 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-rose-600" />
                  ১. থানা ও ভাড়াকৃত বাড়ির বিবরণী
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">সংশ্লিষ্ট থানা (Police Station)</label>
                    <input
                      type="text"
                      value={thanaName}
                      onChange={(e) => setThanaName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">বাড়ি নং / হোল্ডিং নং</label>
                    <input
                      type="text"
                      value={holdingNo}
                      onChange={(e) => setHoldingNo(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">রোড ও এলাকা</label>
                    <input
                      type="text"
                      value={roadNo}
                      onChange={(e) => setRoadNo(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">ফ্ল্যাট / তলা</label>
                    <input
                      type="text"
                      value={flatNo}
                      onChange={(e) => setFlatNo(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">বাড়িওয়ালার নাম</label>
                    <input
                      type="text"
                      value={landlordName}
                      onChange={(e) => setLandlordName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">বাড়িওয়ালার মোবাইল</label>
                    <input
                      type="text"
                      value={landlordPhone}
                      onChange={(e) => setLandlordPhone(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Primary Tenant Details */}
              <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-rose-600" />
                  ২. ভাড়াটিয়ার ব্যক্তিগত তথ্য (Primary Tenant Details)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">পূর্ণ নাম</label>
                    <input
                      type="text"
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">পিতার নাম</label>
                    <input
                      type="text"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">মাতার নাম</label>
                    <input
                      type="text"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">জন্ম তারিখ (DOB)</label>
                    <input
                      type="text"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">মোবাইল নম্বর</label>
                    <input
                      type="text"
                      value={tenantPhone}
                      onChange={(e) => setTenantPhone(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">জাতীয় পরিচয়পত্র নং (NID)</label>
                    <input
                      type="text"
                      value={tenantNid}
                      onChange={(e) => setTenantNid(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">পেশা ও পদবি</label>
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-gray-600 dark:text-gray-400 block mb-1">কর্মস্থলের নাম ও পূর্ণ ঠিকানা</label>
                    <input
                      type="text"
                      value={workplaceAddress}
                      onChange={(e) => setWorkplaceAddress(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-600 dark:text-gray-400 block mb-1">স্থায়ী ঠিকানা (গ্রাম, ডাকঘর, থানা, জেলা)</label>
                  <input
                    type="text"
                    value={permanentAddress}
                    onChange={(e) => setPermanentAddress(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>
              </div>

              {/* Family Members / Flatmates */}
              <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-rose-600" />
                    ৩. পরিবারভুক্ত সদস্য / রুমমেটদের বিবরণ ({familyMembers.length})
                  </h3>
                  <button
                    type="button"
                    onClick={addFamilyMember}
                    className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    সদস্য যোগ করুন
                  </button>
                </div>

                <div className="space-y-2">
                  {familyMembers.map((m, idx) => (
                    <div
                      key={m.id}
                      className="bg-white dark:bg-gray-800 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 grid grid-cols-2 sm:grid-cols-6 gap-2 items-center"
                    >
                      <input
                        type="text"
                        placeholder="নাম"
                        value={m.name}
                        onChange={(e) => updateFamilyMember(m.id, "name", e.target.value)}
                        className="p-1 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900 sm:col-span-2 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="বয়স"
                        value={m.age}
                        onChange={(e) => updateFamilyMember(m.id, "age", e.target.value)}
                        className="p-1 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="সম্পর্ক"
                        value={m.relation}
                        onChange={(e) => updateFamilyMember(m.id, "relation", e.target.value)}
                        className="p-1 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="পেশা"
                        value={m.occupation}
                        onChange={(e) => updateFamilyMember(m.id, "occupation", e.target.value)}
                        className="p-1 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900 text-xs"
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          placeholder="মোবাইল"
                          value={m.phone}
                          onChange={(e) => updateFamilyMember(m.id, "phone", e.target.value)}
                          className="p-1 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900 text-xs w-full"
                        />
                        <button
                          type="button"
                          onClick={() => removeFamilyMember(m.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contact & Previous Landlord */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100">৪. জরুরি যোগাযোগের ব্যক্তি</h4>
                  <input
                    type="text"
                    placeholder="নাম"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="w-full p-1.5 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="সম্পর্ক"
                      value={emergencyRelation}
                      onChange={(e) => setEmergencyRelation(e.target.value)}
                      className="p-1.5 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                    />
                    <input
                      type="text"
                      placeholder="মোবাইল"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="p-1.5 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100">৫. পূর্ববর্তী বাড়িওয়ালার তথ্য</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="বাড়িওয়ালার নাম"
                      value={prevLandlordName}
                      onChange={(e) => setPrevLandlordName(e.target.value)}
                      className="p-1.5 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                    />
                    <input
                      type="text"
                      placeholder="মোবাইল"
                      value={prevLandlordPhone}
                      onChange={(e) => setPrevLandlordPhone(e.target.value)}
                      className="p-1.5 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="বাসা পরিবর্তনের কারণ"
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    className="w-full p-1.5 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OFFICIAL PREVIEW */}
          {activeTab === "preview" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-800 text-xs">
                <span className="text-rose-900 dark:text-rose-200 font-medium">
                  📄 এই ফরমটি প্রিন্ট করে ছবি ও স্বাক্ষরসহ আপনার স্থানীয় থানায় (বিট পুলিশ অফিসারের নিকট) জমা দিন।
                </span>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print DMP Form
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-xl border border-gray-300 dark:border-gray-800 font-mono text-xs leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap shadow-inner max-h-[50vh] overflow-y-auto">
                {currentFormText}
              </div>
            </div>
          )}

          {/* TAB 3: SUBMISSION GUIDELINES & POLICE RULES */}
          {activeTab === "guidelines" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-rose-50/60 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900 space-y-2">
                <div className="font-bold text-rose-950 dark:text-rose-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-600" />
                  ১. ডিএমপি সিআইএমএস (CIMS) বাধ্যতামূলক নিয়ম
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                  ঢাকা মেট্রোপলিটন পুলিশ এলাকায় নতুন ভাড়াটিয়া উঠার ৭ থেকে ১৪ দিনের মধ্যে সংশ্লিষ্ট থানায় এই ফরম জমা দেওয়া বাধ্যতামূলক। ফরম জমা না দিলে বাড়িওয়ালা ও ভাড়াটিয়া উভয়েই আইনি জটিলতায় পড়তে পারেন।
                </p>
              </div>

              <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900 space-y-2">
                <div className="font-bold text-blue-950 dark:text-blue-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  ২. প্রয়োজনীয় ডকুমেন্টস ও ছবির কপি
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                  ফরমের সাথে মূল ভাড়াটিয়ার ২ কপি পাসপোর্ট সাইজ ছবি, জাতীয় পরিচয়পত্র (NID) বা পাসপোর্টের ফটোকপি এবং কর্মস্থলের আইডি কার্ডের ফটোকপি সংযুক্ত করে দিতে হবে।
                </p>
              </div>

              <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900 space-y-2">
                <div className="font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ৩. বিট পুলিশ অফিসারের ভূমিকা
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                  ঢাকার প্রতিটি ওয়ার্ডে একজন বিট পুলিশ অফিসার নিয়োজিত থাকেন। থানায় সরাসরি গিয়ে কিংবা এলাকার বিট অফিসারের সাথে যোগাযোগ করে ফরমের প্রাপ্তিস্বীকার সিল সংগ্রহ করুন।
                </p>
              </div>

              <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900 space-y-2">
                <div className="font-bold text-amber-950 dark:text-amber-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  ৪. সাবলেট ও ব্যাচেলর মেসের বিধান
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
                  ব্যাচেলর মেস বা সাবলেটের ক্ষেত্রে প্রধান চুক্তিধারীর নামের পাশাপাশি সকল বসবাসরত সদস্যদের নাম, শিক্ষা প্রতিষ্ঠান বা কর্মস্থলের আইডি নম্বর ৩নং কলামে উল্লেখ করতে হবে।
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
            <span>Compliant with Dhaka Metropolitan Police CIMS Regulations</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy Text"}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
