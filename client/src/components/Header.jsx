import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { signOutUserStart, signOutUserSuccess, signOutUserFailure } from "../redux/users/userSlice";
import { useToast } from "../hooks/useToast";
import apiService from "../utils/apiService";
import useStickyHeader from "../hooks/useStickyHeader";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    </header>
  );
}
