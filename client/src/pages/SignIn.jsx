import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  EnvelopeIcon,
  LockClosedIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";
import { signInFailure, signInStart, signInSuccess } from "../redux/users/userSlice";
import { useToast } from "../hooks/useToast";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const location = useLocation();
  const [isAdminMode, setIsAdminMode] = useState(location.state?.adminMode || false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [step, setStep] = useState(1); // 1: Mode Selection, 2: Email/Password, 3: Verification
  const [verificationCode, setVerificationCode] = useState("");
  const [devHint, setDevHint] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [resendTimer, setResendTimer] = useState(0);
  
  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // Initialize step based on admin mode from location state
  useEffect(() => {
    if (location.state?.adminMode) {
      setIsAdminMode(true);
      setStep(2); // Skip mode selection, go directly to email/password
      setFormData({ email: "hasibullah.khan.alvie@g.bracu.ac.bd", password: "" });
    }
  }, [location.state]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Input validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleModeSelection = (adminMode) => {
    setIsAdminMode(adminMode);
    if (adminMode) {
      setFormData({ email: "hasibullah.khan.alvie@g.bracu.ac.bd", password: "" });
    } else {
      setFormData({ email: "", password: "" });
    }
    setStep(2);
  };

  const handleEmailPasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Validate admin credentials
    if (isAdminMode) {
      if (formData.email !== "hasibullah.khan.alvie@g.bracu.ac.bd") {
        setErrors({ email: "Invalid admin email address" });
        return;
      }
      if (formData.password !== "admin123456") {
        setErrors({ password: "Invalid admin password" });
        return;
      }
    }

    dispatch(signInStart());

    try {
      const res = await fetch("/server/auth/signin", {
        method: "POST",  
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          ...formData, 
          isAdmin: isAdminMode 
        }),
      });

      const data = await res.json();

      if (!data.success) {
        dispatch(signInFailure(data.message));
        showToast(data.message || "Failed to sign in", "error");
        return;
      }

      // Handle verification requirement (both admin and regular users)
      if (data.requiresTwoFactor || data.requiresVerification) {
        setVerificationEmail(data.email);
        if (data.devHint) {
          setDevHint(data.devHint);
        }
        setStep(3);
        dispatch({ type: 'user/clearLoading' });
        showToast("Verification code sent to your email", "info");
      } else {
        // Direct login success for regular users
        dispatch(signInSuccess(data.user));
        showToast("Welcome back!", "success");
        navigate(data.user.role === 'admin' ? "/admin" : "/dashboard");
      }
    } catch (error) {
      const message = error.message || "Network error occurred";
      dispatch(signInFailure(message));
      showToast(message, "error");
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      showToast("Please enter a valid 6-digit verification code", "error");
      return;
    }

    dispatch(signInStart());

    try {
      // Both admin and regular user verification use the backend API
      const res = await fetch("/server/auth/complete-signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          email: verificationEmail, 
          password: formData.password,
          verificationCode 
        }),
      });

      const data = await res.json();

      if (!data.success) {
        dispatch(signInFailure(data.message));
        showToast(data.message || "Verification failed", "error");
        return;
      }

      dispatch(signInSuccess(data.user));
      showToast("Successfully signed in!", "success");
      
      // Redirect based on user role
      if (data.user.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      const message = error.message || "Verification failed";
      dispatch(signInFailure(message));
      showToast(message, "error");
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    try {
      // Resend verification code via API (for both admin and regular users)
      const res = await fetch("/server/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (data.success && data.devHint) {
        setDevHint(data.devHint);
        setResendTimer(60);
        showToast("Verification code resent", "success");
      }
      
      showToast("New verification code sent", "success");
    } catch (error) {
      showToast("Failed to resend code", "error");
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div 
        initial="initial"
        animate="animate"
        variants={pageVariants}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            {isAdminMode ? (
              <ShieldCheckIcon className="w-10 h-10 text-white" />
            ) : (
              <UserGroupIcon className="w-10 h-10 text-white" />
            )}
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {step === 1 ? 'Choose Access Type' : isAdminMode ? 'Admin Access' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {step === 1 ? 'Select your account type to continue' : 
             step === 2 ? `Sign in to your ${isAdminMode ? 'admin' : 'user'} account` :
             `Enter the verification code ${isAdminMode ? 'from terminal' : 'sent to your email'}`}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-lg ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 mx-3 rounded-full transition-all duration-300 ${
            step >= 2 ? 'bg-blue-600' : 'bg-gray-200'
          }`} />
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-lg ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
          <div className={`w-16 h-1 mx-3 rounded-full transition-all duration-300 ${
            step >= 3 ? 'bg-blue-600' : 'bg-gray-200'
          }`} />
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-lg ${
            step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            3
          </div>
        </div>

        {/* Main Card */}
        <motion.div 
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence>
            {/* Step 1: Mode Selection */}
            {step === 1 && (
              <motion.div
                key="mode-selection"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Access Type</h3>
                  <p className="text-gray-600">Choose how you want to access Basha Lagbe</p>
                </div>

                {/* User Access Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleModeSelection(false)}
                  className="w-full p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                      <UserGroupIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">User Access</h4>
                      <p className="text-gray-600 text-sm">Sign in as a tenant or property seeker</p>
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                  </div>
                </motion.button>

                {/* Admin Access Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleModeSelection(true)}
                  className="w-full p-6 bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl hover:from-purple-100 hover:to-purple-200 hover:border-purple-300 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                      <ShieldCheckIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">Admin Access</h4>
                      <p className="text-gray-600 text-sm">Administrative access with full permissions</p>
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                  </div>
                </motion.button>

                {/* Sign Up Link */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600">
                    New to Basha Lagbe?{" "}
                    <Link 
                      to="/sign-up" 
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      Create an account →
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Email/Password */}
            {step === 2 && (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                    isAdminMode ? 'bg-gradient-to-r from-purple-600 to-purple-700' : 'bg-gradient-to-r from-blue-600 to-blue-700'
                  }`}>
                    {isAdminMode ? (
                      <ShieldCheckIcon className="w-8 h-8 text-white" />
                    ) : (
                      <UserGroupIcon className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {isAdminMode ? 'Admin Credentials' : 'Enter Your Credentials'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {isAdminMode ? 'Use admin email and password' : 'Sign in with your account details'}
                  </p>
                </div>

                <form onSubmit={handleEmailPasswordSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                      {isAdminMode ? 'Admin Email' : 'Email Address'}
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        readOnly={isAdminMode}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                          errors.email ? 'border-red-300 bg-red-50' : 
                          isAdminMode ? 'border-purple-200 bg-purple-50' :
                          'border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white'
                        }`}
                        placeholder={isAdminMode ? "hasibullah.khan.alvie@g.bracu.ac.bd" : "Enter your email"}
                        required
                      />
                      {isAdminMode && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <ShieldCheckIcon className="w-5 h-5 text-purple-500" />
                        </div>
                      )}
                    </div>
                    {errors.email && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-red-600 text-sm mt-2 flex items-center"
                      >
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                      {isAdminMode ? 'Admin Password' : 'Password'}
                    </label>
                    <div className="relative">
                      <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-16 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                          errors.password ? 'border-red-300 bg-red-50' : 
                          isAdminMode ? 'border-purple-200 bg-purple-50' :
                          'border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white'
                        }`}
                        placeholder={isAdminMode ? "admin123456" : "Enter your password"}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-red-600 text-sm mt-2 flex items-center"
                      >
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.password}
                      </motion.p>
                    )}
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Forgot your password?
                    </Link>
                  </div>

                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium mb-4"
                  >
                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    Back to access type
                  </button>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className={`w-full text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
                      isAdminMode 
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:ring-purple-500'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                        Authenticating...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <KeyIcon className="w-5 h-5 mr-2" />
                        {isAdminMode ? 'Access Admin Panel' : 'Continue to Verification'}
                        <ArrowRightIcon className="w-5 h-5 ml-2" />
                      </div>
                    )}
                  </motion.button>
                </form>

                {/* OAuth for non-admin users */}
                {!isAdminMode && (
                  <>
                    {/* Divider */}
                    <div className="my-8">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                        </div>
                      </div>
                    </div>

                    {/* OAuth */}
                    <OAuth />
                  </>
                )}

                {/* Forgot Password for non-admin */}
                {!isAdminMode && (
                  <div className="text-center mt-6">
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Verification */}
            {step === 3 && (
              <motion.div
                key="verification"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                    isAdminMode ? 'bg-gradient-to-r from-purple-600 to-purple-700' : 'bg-gradient-to-r from-green-600 to-green-700'
                  }`}>
                    <KeyIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {isAdminMode ? 'Enter Admin Code' : 'Check Your Email'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {isAdminMode ? (
                      <>Check your terminal for the 6-digit admin verification code</>
                    ) : (
                      <>We've sent a 6-digit verification code to <span className="font-semibold text-gray-900">{verificationEmail}</span></>
                    )}
                  </p>
                </div>

                <form onSubmit={handleVerificationSubmit} className="space-y-6">
                  {/* Verification Code Input */}
                  <div>
                    <label htmlFor="verificationCode" className="block text-sm font-semibold text-gray-700 mb-3">
                      Verification Code
                    </label>
                    <input
                      id="verificationCode"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className={`w-full px-6 py-4 border-2 rounded-2xl text-center text-3xl tracking-widest font-mono focus:ring-2 focus:border-transparent transition-all duration-300 ${
                        isAdminMode 
                          ? 'border-purple-200 bg-purple-50 focus:ring-purple-500 focus:border-purple-500'
                          : 'border-gray-200 bg-gray-50 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="000000"
                      maxLength="6"
                      required
                    />
                  </div>

                  {/* Terminal Hint for Admin */}
                  {isAdminMode && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-2xl"
                    >
                      <div className="flex items-center text-purple-800 text-sm">
                        <SparklesIcon className="w-4 h-4 mr-2" />
                        <strong>Terminal Code:</strong> Check your console for the verification code
                      </div>
                    </motion.div>
                  )}

                  {/* Dev Hint for Regular Users */}
                  {!isAdminMode && devHint && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl"
                    >
                      <div className="flex items-center text-yellow-800 text-sm">
                        <SparklesIcon className="w-4 h-4 mr-2" />
                        <strong>Development Hint:</strong> Your verification code is <strong>{devHint}</strong>
                      </div>
                    </motion.div>
                  )}

                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium mb-4"
                  >
                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    Back to credentials
                  </button>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || verificationCode.length !== 6}
                    className={`w-full text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
                      isAdminMode 
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:ring-purple-500'
                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-green-500'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                        Verifying...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <CheckCircleIcon className="w-5 h-5 mr-2" />
                        {isAdminMode ? 'Access Admin Panel' : 'Verify & Sign In'}
                      </div>
                    )}
                  </motion.button>

                  {/* Resend Code */}
                  <div className="text-center space-y-3">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={resendTimer > 0}
                      className={`text-sm font-medium transition-colors ${
                        resendTimer > 0 
                          ? 'text-gray-400 cursor-not-allowed'
                          : isAdminMode 
                            ? 'text-purple-600 hover:text-purple-800'
                            : 'text-blue-600 hover:text-blue-800'
                      }`}
                    >
                      {resendTimer > 0 
                        ? `Resend code in ${resendTimer}s`
                        : isAdminMode 
                          ? 'Generate new admin code'
                          : 'Resend verification code'
                      }
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Check Your Email</h3>
                  <p className="text-gray-600 text-sm">
                    We've sent a 6-digit verification code to{" "}
                    <span className="font-semibold text-gray-900">{verificationEmail}</span>
                  </p>
                </div>

                <form onSubmit={handleVerificationSubmit} className="space-y-6">
                  {/* Verification Code Input */}
                  <div>
                    <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Code
                    </label>
                    <input
                      id="verificationCode"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center text-2xl tracking-widest font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="000000"
                      maxLength="6"
                      required
                    />
                  </div>

                  {/* Dev Hint */}
                  {devHint && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm text-center"
                    >
                      <strong>Development Hint:</strong> Your verification code is <strong>{devHint}</strong>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || verificationCode.length !== 6}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Verifying...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <CheckCircleIcon className="w-5 h-5 mr-2" />
                        Verify & Sign In
                      </div>
                    )}
                  </motion.button>

                  {/* Resend Code */}
                  <div className="text-center space-y-4">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Resend verification code
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center justify-center text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                      <ArrowLeftIcon className="w-4 h-4 mr-1" />
                      Back to sign in
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-blue-600 hover:text-blue-800 underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-800 underline">
              Privacy Policy
            </Link>
          </p>
          {step === 1 && (
            <p className="text-xs text-gray-400 mt-2">
              © 2025 Basha Lagbe. All rights reserved.
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
