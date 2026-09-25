import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { signOutUserStart, signOutUserSuccess, signOutUserFailure } from "../redux/users/userSlice";
import { useToast } from "../hooks/useToast";
import apiService from "../utils/apiService";
import useStickyHeader from "../hooks/useStickyHeader";
import RentCalculatorModal from "./RentCalculatorModal";
import AreaGuideModal from "./AreaGuideModal";
import MovingChecklistModal from "./MovingChecklistModal";
import RentalYieldCalculatorModal from "./RentalYieldCalculatorModal";
import RoommateFinderModal from "./RoommateFinderModal";
import EmergencyHotlinesModal from "./EmergencyHotlinesModal";
import FAQModal from "./FAQModal";
import MoversCostEstimatorModal from "./MoversCostEstimatorModal";
import UtilityBillSplitterModal from "./UtilityBillSplitterModal";
import TenancyAgreementGeneratorModal from "./TenancyAgreementGeneratorModal";
import MetroTransitHubModal from "./MetroTransitHubModal";
import RentReceiptGeneratorModal from "./RentReceiptGeneratorModal";
import DmpCimsVerificationModal from "./DmpCimsVerificationModal";
import NoticeToVacateGeneratorModal from "./NoticeToVacateGeneratorModal";
import PropertyConditionReportModal from "./PropertyConditionReportModal";
import RentalIncomeTaxCalculatorModal from "./RentalIncomeTaxCalculatorModal";
import PropertyMaintenanceTrackerModal from "./PropertyMaintenanceTrackerModal";
import { Calculator, MapPin, CheckSquare, TrendingUp, Users, PhoneCall, HelpCircle, Truck, Receipt, FileSignature, Train, FileText, ShieldAlert, Mail, ClipboardCheck, Coins, Wrench } from "lucide-react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showRentCalculator, setShowRentCalculator] = useState(false);
  const [showAreaGuide, setShowAreaGuide] = useState(false);
  const [showMovingChecklist, setShowMovingChecklist] = useState(false);
  const [showYieldCalculator, setShowYieldCalculator] = useState(false);
  const [showRoommateFinder, setShowRoommateFinder] = useState(false);
  const [showHotlines, setShowHotlines] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showMoversEstimator, setShowMoversEstimator] = useState(false);
  const [showUtilitySplitter, setShowUtilitySplitter] = useState(false);
  const [showAgreementGenerator, setShowAgreementGenerator] = useState(false);
  const [showMetroTransitHub, setShowMetroTransitHub] = useState(false);
  const [showRentReceipt, setShowRentReceipt] = useState(false);
  const [showDmpCims, setShowDmpCims] = useState(false);
  const [showNoticeToVacate, setShowNoticeToVacate] = useState(false);
  const [showPropertyInspection, setShowPropertyInspection] = useState(false);
  const [showRentalTax, setShowRentalTax] = useState(false);
  const [showMaintenanceTracker, setShowMaintenanceTracker] = useState(false);
  const toast = useToast();
  // useStickyHeader: adds shadow + bg-white once user scrolls past 80px
  const { isSticky } = useStickyHeader({ threshold: 80, hysteresis: true });

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const isActive = (path) => location.pathname === path;

  const isAdminOrLandlord =
    currentUser?.accountType === "landlord" ||
    currentUser?.accountType === "agent" ||
    currentUser?.accountType === "admin" ||
    currentUser?.role === "admin";

  const isAdmin =
    currentUser?.accountType === "admin" || currentUser?.role === "admin";

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      dispatch(signOutUserStart());
      const response = await apiService.auth.signout();
      if (response.success) {
        dispatch(signOutUserSuccess());
        toast.success("Signed out successfully");
        navigate("/");
      } else {
        throw new Error(response.message || "Sign out failed");
      }
    } catch (error) {
      console.error("Sign out error:", error);
      dispatch(signOutUserFailure(error.message));
      dispatch(signOutUserSuccess());
      toast.success("Signed out successfully");
      navigate("/");
    } finally {
      setIsSigningOut(false);
      setShowDropdown(false);
      closeMobileMenu();
    }
  };

  const avatarUrl = (user) =>
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || user?.email || "U")}&background=667eea&color=fff`;

  return (
    <header className={[
      "sticky top-0 z-50 transition-all duration-300",
      isSticky
        ? "bg-gradient-to-r from-blue-900/95 via-indigo-900/95 to-blue-950/95 backdrop-blur-md shadow-xl border-b border-white/10"
        : "bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg",
    ].join(" ")}>
      {/* ── Top Bar ───────────────────────────────────────────────── */}
      <div className={`flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isSticky ? 'py-3' : 'py-4'}`}>

        {/* Logo */}
        <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
          <h1 className="font-bold text-xl sm:text-2xl">
            <span className="text-white">Basha</span>
            <span className="text-yellow-400 ml-1">Lagbe</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`transition duration-300 font-medium pb-1 ${
              isActive("/")
                ? "text-yellow-400 font-semibold border-b-2 border-yellow-400"
                : "text-white/90 hover:text-yellow-400"
            }`}
          >
            Home
          </Link>
          <Link
            to="/search"
            className={`transition duration-300 font-medium pb-1 ${
              isActive("/search")
                ? "text-yellow-400 font-semibold border-b-2 border-yellow-400"
                : "text-white/90 hover:text-yellow-400"
            }`}
          >
            Search Properties
          </Link>
          <Link
            to="/about"
            className={`transition duration-300 font-medium pb-1 ${
              isActive("/about")
                ? "text-yellow-400 font-semibold border-b-2 border-yellow-400"
                : "text-white/90 hover:text-yellow-400"
            }`}
          >
            About
          </Link>
          <button
            type="button"
            onClick={() => setShowRentCalculator(true)}
            className="flex items-center gap-1.5 text-white/90 hover:text-yellow-400 transition duration-300 font-medium pb-1"
          >
            <Calculator className="w-4 h-4 text-yellow-400" />
            <span>Rent Calculator</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAreaGuide(true)}
            className="flex items-center gap-1.5 text-white/90 hover:text-yellow-400 transition duration-300 font-medium pb-1"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Area Guide</span>
          </button>
          <button
            type="button"
            onClick={() => setShowMovingChecklist(true)}
            className="flex items-center gap-1.5 text-white/90 hover:text-yellow-400 transition duration-300 font-medium pb-1"
          >
            <CheckSquare className="w-4 h-4 text-cyan-300" />
            <span>Moving Guide</span>
          </button>
          <button
            type="button"
            onClick={() => setShowYieldCalculator(true)}
            className="flex items-center gap-1.5 text-white/90 hover:text-yellow-400 transition duration-300 font-medium pb-1"
          >
            <TrendingUp className="w-4 h-4 text-amber-300" />
            <span>Landlord ROI</span>
          </button>
          <button
            type="button"
            onClick={() => setShowRoommateFinder(true)}
            className="flex items-center gap-1.5 text-white/90 hover:text-yellow-400 transition duration-300 font-medium pb-1"
          >
            <Users className="w-4 h-4 text-yellow-300" />
            <span>Find Roommate</span>
          </button>
          <button
            type="button"
            onClick={() => setShowHotlines(true)}
            className="flex items-center gap-1.5 text-rose-300 hover:text-white transition duration-300 font-semibold pb-1"
          >
            <PhoneCall className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Hotlines 24/7</span>
          </button>
          <button
            type="button"
            onClick={() => setShowMoversEstimator(true)}
            className="flex items-center gap-1.5 text-white/90 hover:text-yellow-400 transition duration-300 font-medium pb-1"
          >
            <Truck className="w-4 h-4 text-amber-400" />
            <span>Movers Estimator</span>
          </button>
          <button
            type="button"
            onClick={() => setShowUtilitySplitter(true)}
            className="flex items-center gap-1.5 text-white/90 hover:text-yellow-400 transition duration-300 font-medium pb-1"
          >
            <Receipt className="w-4 h-4 text-teal-300" />
            <span>Bill Splitter</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAgreementGenerator(true)}
            className="flex items-center gap-1.5 text-purple-300 hover:text-white transition duration-300 font-semibold pb-1"
          >
            <FileSignature className="w-4 h-4 text-purple-400" />
            <span>Rental Deed (চুক্তিপত্র)</span>
          </button>
          <button
            type="button"
            onClick={() => setShowMetroTransitHub(true)}
            className="flex items-center gap-1.5 text-emerald-300 hover:text-white transition duration-300 font-semibold pb-1"
          >
            <Train className="w-4 h-4 text-emerald-400" />
            <span>Metro Rail Hub</span>
          </button>
          <button
            type="button"
            onClick={() => setShowRentReceipt(true)}
            className="flex items-center gap-1.5 text-cyan-300 hover:text-white transition duration-300 font-semibold pb-1"
          >
            <Receipt className="w-4 h-4 text-cyan-400" />
            <span>Money Receipt (ভাড়ার রসিদ)</span>
          </button>
          <button
            type="button"
            onClick={() => setShowDmpCims(true)}
            className="flex items-center gap-1.5 text-rose-300 hover:text-white transition duration-300 font-semibold pb-1"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>DMP Police Form (CIMS)</span>
          </button>
          <button
            type="button"
            onClick={() => setShowNoticeToVacate(true)}
            className="flex items-center gap-1.5 text-amber-300 hover:text-white transition duration-300 font-semibold pb-1"
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Notice to Vacate (নোটিশ)</span>
          </button>
          <button
            type="button"
            onClick={() => setShowPropertyInspection(true)}
            className="flex items-center gap-1.5 text-emerald-300 hover:text-white transition duration-300 font-semibold pb-1"
          >
            <ClipboardCheck className="w-4 h-4 text-emerald-400" />
            <span>Handover Audit (ইনভেন্টরি)</span>
          </button>
          <button
            type="button"
            onClick={() => setShowRentalTax(true)}
            className="flex items-center gap-1.5 text-yellow-300 hover:text-white transition duration-300 font-semibold pb-1"
          >
            <Coins className="w-4 h-4 text-yellow-400" />
            <span>Tax & Holding (আয়কর)</span>
          </button>
          <button
            type="button"
            onClick={() => setShowMaintenanceTracker(true)}
            className="flex items-center gap-1.5 text-amber-300 hover:text-white transition duration-300 font-semibold pb-1"
          >
            <Wrench className="w-4 h-4 text-amber-400" />
            <span>Repairs & Ledger (মেরামত)</span>
          </button>
          <button
            type="button"
            onClick={() => setShowFAQ(true)}
            className="flex items-center gap-1.5 text-white/90 hover:text-yellow-400 transition duration-300 font-medium pb-1"
          >
            <HelpCircle className="w-4 h-4 text-blue-300" />
            <span>Help & FAQ</span>
          </button>
          {currentUser && isAdminOrLandlord && (
            <Link
              to="/add-property"
              className={`transition duration-300 font-medium pb-1 ${
                isActive("/add-property")
                  ? "text-yellow-400 font-semibold border-b-2 border-yellow-400"
                  : "text-white/90 hover:text-yellow-400"
              }`}
            >
              List Property
            </Link>
          )}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center space-x-4">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 text-white hover:text-yellow-400 transition duration-300"
                disabled={isSigningOut}
              >
                <img src={avatarUrl(currentUser)} alt="User" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                <span className="hidden sm:block font-medium">{currentUser.fullName || currentUser.email}</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{currentUser.fullName || "User"}</p>
                      <p className="text-xs text-gray-500">{currentUser.email}</p>
                      {isAdmin && <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full">Admin</span>}
                    </div>
                    <Link to="/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-blue-50 transition duration-300" onClick={() => setShowDropdown(false)}>Dashboard</Link>
                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-blue-50 transition duration-300" onClick={() => setShowDropdown(false)}>Profile</Link>
                    <Link to="/notifications" className="block px-4 py-2 text-gray-800 hover:bg-blue-50 transition duration-300" onClick={() => setShowDropdown(false)}>Notifications</Link>
                    {isAdminOrLandlord && (
                      <>
                        <Link to="/inquiries" className="block px-4 py-2 text-gray-800 hover:bg-blue-50 transition duration-300" onClick={() => setShowDropdown(false)}>Inquiries</Link>
                        <Link to="/applications" className="block px-4 py-2 text-gray-800 hover:bg-blue-50 transition duration-300" onClick={() => setShowDropdown(false)}>Applications</Link>
                        <Link to="/add-property" className="block px-4 py-2 text-gray-800 hover:bg-blue-50 transition duration-300" onClick={() => setShowDropdown(false)}>Add Property</Link>
                      </>
                    )}
                    {isAdmin && (
                      <Link to="/admin" className="block px-4 py-2 text-gray-800 hover:bg-blue-50 transition duration-300 border-t border-gray-200" onClick={() => setShowDropdown(false)}>Admin Panel</Link>
                    )}
                    <div className="border-t border-gray-200 mt-1 pt-1">
                      <button onClick={handleSignOut} disabled={isSigningOut} className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition duration-300 disabled:opacity-50">
                        {isSigningOut
                          ? <div className="w-4 h-4 mr-2 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          : <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        }
                        {isSigningOut ? "Signing Out..." : "Sign Out"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/sign-in" className="text-white hover:text-yellow-400 transition duration-300 font-medium">Sign In</Link>
              <Link to="/sign-up" className="bg-yellow-400 hover:bg-yellow-500 text-blue-800 font-semibold py-2 px-4 rounded-lg transition duration-300">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile: avatar + hamburger */}
        <div className="flex md:hidden items-center space-x-3">
          {!currentUser && (
            <Link to="/sign-in" className="text-white hover:text-yellow-400 text-sm font-medium transition duration-300" onClick={closeMobileMenu}>Sign In</Link>
          )}
          {currentUser && (
            <img src={avatarUrl(currentUser)} alt="User" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
          )}
          <button
            className="text-white hover:text-yellow-400 focus:outline-none"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Drawer ─────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-indigo-900/95 backdrop-blur-md border-t border-indigo-700/60 px-4 pb-5 pt-2 space-y-1 shadow-2xl">
          <Link
            to="/"
            className={`block py-2 px-3 rounded-md font-medium transition duration-200 ${
              isActive("/")
                ? "bg-indigo-700/80 text-yellow-400 font-semibold"
                : "text-white hover:text-yellow-400"
            }`}
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link
            to="/search"
            className={`block py-2 px-3 rounded-md font-medium transition duration-200 ${
              isActive("/search")
                ? "bg-indigo-700/80 text-yellow-400 font-semibold"
                : "text-white hover:text-yellow-400"
            }`}
            onClick={closeMobileMenu}
          >
            Search Properties
          </Link>
          <Link
            to="/about"
            className={`block py-2 px-3 rounded-md font-medium transition duration-200 ${
              isActive("/about")
                ? "bg-indigo-700/80 text-yellow-400 font-semibold"
                : "text-white hover:text-yellow-400"
            }`}
            onClick={closeMobileMenu}
          >
            About
          </Link>
          <button
            type="button"
            onClick={() => {
              setShowRentCalculator(true);
              closeMobileMenu();
            }}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-md font-medium text-white hover:text-yellow-400 transition duration-200"
          >
            <Calculator className="w-4 h-4 text-yellow-400" />
            <span>Rent Calculator (৳)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowAreaGuide(true);
              closeMobileMenu();
            }}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-md font-medium text-white hover:text-yellow-400 transition duration-200"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Neighborhood Guide</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowMovingChecklist(true);
              closeMobileMenu();
            }}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-md font-medium text-white hover:text-yellow-400 transition duration-200"
          >
            <CheckSquare className="w-4 h-4 text-cyan-300" />
            <span>Moving & Legal Guide</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowYieldCalculator(true);
              closeMobileMenu();
            }}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-md font-medium text-white hover:text-yellow-400 transition duration-200"
          >
            <TrendingUp className="w-4 h-4 text-amber-300" />
            <span>Landlord ROI Calculator</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowRoommateFinder(true);
              closeMobileMenu();
            }}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-md font-medium text-white hover:text-yellow-400 transition duration-200"
          >
            <Users className="w-4 h-4 text-yellow-300" />
            <span>Sublets & Roommates</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowHotlines(true);
              closeMobileMenu();
            }}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-md font-bold text-rose-300 hover:text-white transition duration-200"
          >
            <PhoneCall className="w-4 h-4 text-rose-400" />
            <span>Emergency & Utility Hotlines (999/WASA/DESCO)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowMoversEstimator(true);
              closeMobileMenu();
            }}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-md font-medium text-white hover:text-yellow-400 transition duration-200"
          >
            <Truck className="w-4 h-4 text-amber-400" />
            <span>Movers & Truck Fare Estimator</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowUtilitySplitter(true);
              closeMobileMenu();
            }}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-md font-medium text-white hover:text-yellow-400 transition duration-200"
          >
            <Receipt className="w-4 h-4 text-teal-300" />
            <span>Utility Bill Splitter & Prepaid Meter</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowAgreementGenerator(true);
              closeMobileMenu();
            }}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-md font-bold text-purple-300 hover:text-white transition duration-200"
          >
            <FileSignature className="w-4 h-4 text-purple-400" />
            <span>Rental Agreement Deed (চুক্তিপত্র)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowMetroTransitHub(true);
              closeMobileMenu();
            }}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-md font-bold text-emerald-300 hover:text-white transition duration-200"
          >
            <Train className="w-4 h-4 text-emerald-400" />
            <span>Dhaka Metro Rail (MRT) Living Hub</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowRentReceipt(true);
              closeMobileMenu();
            }}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-md font-bold text-cyan-300 hover:text-white transition duration-200"
          >
            <Receipt className="w-4 h-4 text-cyan-400" />
            <span>Monthly Rent Money Receipt (ভাড়ার রসিদ)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowDmpCims(true);
              closeMobileMenu();
            }}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-md font-bold text-rose-300 hover:text-white transition duration-200"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>DMP Police Verification Form (CIMS)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowNoticeToVacate(true);
              closeMobileMenu();
            }}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-md font-bold text-amber-300 hover:text-white transition duration-200"
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Notice to Vacate & Clearance (নোটিশ)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowPropertyInspection(true);
              closeMobileMenu();
            }}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-md font-bold text-emerald-300 hover:text-white transition duration-200"
          >
            <ClipboardCheck className="w-4 h-4 text-emerald-400" />
            <span>Property Handover & Inventory Audit (ইনভেন্টরি রিপোর্ট)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowRentalTax(true);
              closeMobileMenu();
            }}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-md font-bold text-yellow-300 hover:text-white transition duration-200"
          >
            <Coins className="w-4 h-4 text-yellow-400" />
            <span>Rental Income Tax & Holding Tax (বাড়ি ভাড়া আয়কর)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowMaintenanceTracker(true);
              closeMobileMenu();
            }}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-md font-bold text-amber-300 hover:text-white transition duration-200"
          >
            <Wrench className="w-4 h-4 text-amber-400" />
            <span>Property Maintenance & Rent Ledger (বাসা মেরামত ও ব্যয়)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowFAQ(true);
              closeMobileMenu();
            }}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-md font-medium text-white hover:text-yellow-400 transition duration-200"
          >
            <HelpCircle className="w-4 h-4 text-blue-300" />
            <span>Tenancy Knowledge Base & FAQ</span>
          </button>

          {currentUser ? (
            <>
              <div className="border-t border-indigo-600 pt-3 mt-2">
                <p className="text-indigo-300 text-xs font-semibold uppercase tracking-wide mb-1">My Account</p>
                <Link to="/dashboard" className="block py-2 text-white hover:text-yellow-400 transition duration-200" onClick={closeMobileMenu}>Dashboard</Link>
                <Link to="/profile" className="block py-2 text-white hover:text-yellow-400 transition duration-200" onClick={closeMobileMenu}>Profile</Link>
                <Link to="/notifications" className="block py-2 text-white hover:text-yellow-400 transition duration-200" onClick={closeMobileMenu}>Notifications</Link>
                {isAdminOrLandlord && (
                  <>
                    <Link to="/add-property" className="block py-2 text-white hover:text-yellow-400 transition duration-200" onClick={closeMobileMenu}>Add Property</Link>
                    <Link to="/inquiries" className="block py-2 text-white hover:text-yellow-400 transition duration-200" onClick={closeMobileMenu}>Inquiries</Link>
                    <Link to="/applications" className="block py-2 text-white hover:text-yellow-400 transition duration-200" onClick={closeMobileMenu}>Applications</Link>
                  </>
                )}
                {isAdmin && (
                  <Link to="/admin" className="block py-2 text-white hover:text-yellow-400 transition duration-200" onClick={closeMobileMenu}>Admin Panel</Link>
                )}
              </div>
              <div className="border-t border-indigo-600 pt-3 mt-2">
                <button onClick={handleSignOut} disabled={isSigningOut} className="text-red-300 hover:text-red-200 font-medium transition duration-200 disabled:opacity-50">
                  {isSigningOut ? "Signing Out..." : "Sign Out"}
                </button>
              </div>
            </>
          ) : (
            <div className="border-t border-indigo-600 pt-3 mt-3">
              <Link to="/sign-up" className="block text-center bg-yellow-400 hover:bg-yellow-500 text-blue-800 font-semibold py-2 px-4 rounded-lg transition duration-300" onClick={closeMobileMenu}>
                Sign Up Free
              </Link>
            </div>
          )}
        </div>
      )}
      <RentCalculatorModal
        isOpen={showRentCalculator}
        onClose={() => setShowRentCalculator(false)}
      />
      <AreaGuideModal
        isOpen={showAreaGuide}
        onClose={() => setShowAreaGuide(false)}
      />
      <MovingChecklistModal
        isOpen={showMovingChecklist}
        onClose={() => setShowMovingChecklist(false)}
      />
      <RentalYieldCalculatorModal
        isOpen={showYieldCalculator}
        onClose={() => setShowYieldCalculator(false)}
      />
      <RoommateFinderModal
        isOpen={showRoommateFinder}
        onClose={() => setShowRoommateFinder(false)}
      />
      <EmergencyHotlinesModal
        isOpen={showHotlines}
        onClose={() => setShowHotlines(false)}
      />
      <MoversCostEstimatorModal
        isOpen={showMoversEstimator}
        onClose={() => setShowMoversEstimator(false)}
      />
      <UtilityBillSplitterModal
        isOpen={showUtilitySplitter}
        onClose={() => setShowUtilitySplitter(false)}
      />
      <TenancyAgreementGeneratorModal
        isOpen={showAgreementGenerator}
        onClose={() => setShowAgreementGenerator(false)}
      />
      <MetroTransitHubModal
        isOpen={showMetroTransitHub}
        onClose={() => setShowMetroTransitHub(false)}
      />
      <RentReceiptGeneratorModal
        isOpen={showRentReceipt}
        onClose={() => setShowRentReceipt(false)}
      />
      <DmpCimsVerificationModal
        isOpen={showDmpCims}
        onClose={() => setShowDmpCims(false)}
      />
      <NoticeToVacateGeneratorModal
        isOpen={showNoticeToVacate}
        onClose={() => setShowNoticeToVacate(false)}
      />
      <PropertyConditionReportModal
        isOpen={showPropertyInspection}
        onClose={() => setShowPropertyInspection(false)}
      />
      <RentalIncomeTaxCalculatorModal
        isOpen={showRentalTax}
        onClose={() => setShowRentalTax(false)}
      />
      <PropertyMaintenanceTrackerModal
        isOpen={showMaintenanceTracker}
        onClose={() => setShowMaintenanceTracker(false)}
      />
      <FAQModal
        isOpen={showFAQ}
        onClose={() => setShowFAQ(false)}
      />
    </header>
  );
}
