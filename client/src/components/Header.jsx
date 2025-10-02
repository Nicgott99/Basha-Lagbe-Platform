import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/users/userSlice';
import { useToast } from '../hooks/useToast';
import apiService from '../utils/apiService';

export default function Header() {
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const toast = useToast();

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      dispatch(signOutUserStart());
      
      // Call the API service to sign out
      const response = await apiService.auth.signout();
      
      if (response.success) {
        dispatch(signOutUserSuccess());
        toast.success('Signed out successfully');
        navigate('/');
      } else {
        throw new Error(response.message || 'Sign out failed');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      dispatch(signOutUserFailure(error.message));
      
      // Force sign out even if API call fails (fallback)
      dispatch(signOutUserSuccess());
      toast.success('Signed out successfully');
      navigate('/');
    } finally {
      setIsSigningOut(false);
      setShowDropdown(false);
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="font-bold text-xl sm:text-2xl">
            <span className="text-white">Basha</span>
            <span className="text-yellow-400 ml-1">Lagbe</span>
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-white hover:text-yellow-400 transition duration-300 font-medium">
            Home
          </Link>
          <Link to="/search" className="text-white hover:text-yellow-400 transition duration-300 font-medium">
            Search Properties
          </Link>
          <Link to="/about" className="text-white hover:text-yellow-400 transition duration-300 font-medium">
            About
          </Link>
          {currentUser && (currentUser.accountType === 'landlord' || currentUser.accountType === 'agent' || 
           currentUser.accountType === 'admin' || currentUser.role === 'admin') && (
            <Link to="/add-property" className="text-white hover:text-yellow-400 transition duration-300 font-medium">
              List Property
            </Link>
          )}
        </nav>

        {/* User Authentication */}
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 text-white hover:text-yellow-400 transition duration-300"
                disabled={isSigningOut}
              >
                <img
                  src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.fullName || currentUser.email)}&background=667eea&color=fff`}
                  alt="User"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <span className="hidden sm:block font-medium">{currentUser.fullName || currentUser.email}</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {showDropdown && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowDropdown(false)}
                  />
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    {/* User info header */}
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {currentUser.fullName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">{currentUser.email}</p>
                      {(currentUser.accountType === 'admin' || currentUser.role === 'admin') && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full">
                          Admin
                        </span>
                      )}
                    </div>

                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 transition duration-300"
                      onClick={() => setShowDropdown(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 transition duration-300"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/notifications"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 transition duration-300"
                      onClick={() => setShowDropdown(false)}
                    >
                      Notifications
                    </Link>
                    
                    {/* Show Inquiries and Applications only for landlords/agents, not regular tenants */}
                    {(currentUser.accountType === 'landlord' || currentUser.accountType === 'agent' || 
                      currentUser.accountType === 'admin' || currentUser.role === 'admin') && (
                      <>
                        <Link
                          to="/inquiries"
                          className="block px-4 py-2 text-gray-800 hover:bg-blue-50 transition duration-300"
                          onClick={() => setShowDropdown(false)}
                        >
                          Inquiries
                        </Link>
                        <Link
                          to="/applications"
                          className="block px-4 py-2 text-gray-800 hover:bg-blue-50 transition duration-300"
                          onClick={() => setShowDropdown(false)}
                        >
                          Applications
                        </Link>
                      </>
                    )}
                    
                    {/* Show Add Property for landlords/agents only */}
                    {(currentUser.accountType === 'landlord' || currentUser.accountType === 'agent' || 
                      currentUser.accountType === 'admin' || currentUser.role === 'admin') && (
                      <Link
                        to="/add-property"
                        className="block px-4 py-2 text-gray-800 hover:bg-blue-50 transition duration-300"
                        onClick={() => setShowDropdown(false)}
                      >
                        Add Property
                      </Link>
                    )}
                    {(currentUser.accountType === 'admin' || currentUser.role === 'admin') && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-gray-800 hover:bg-blue-50 transition duration-300 border-t border-gray-200"
                        onClick={() => setShowDropdown(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-gray-200 mt-1 pt-1">
                      <button
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition duration-300 disabled:opacity-50"
                      >
                        {isSigningOut ? (
                          <div className="w-4 h-4 mr-2 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        )}
                        {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/sign-in"
                className="text-white hover:text-yellow-400 transition duration-300 font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-800 font-semibold py-2 px-4 rounded-lg transition duration-300"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button className="text-white hover:text-yellow-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
