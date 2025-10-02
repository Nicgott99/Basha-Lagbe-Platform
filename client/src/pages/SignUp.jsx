import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  SparklesIcon,
  KeyIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import { useToast } from "../hooks/useToast";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [step, setStep] = useState(1); // 1: Info, 2: Verification
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: ''
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [devHint, setDevHint] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  const navigate = useNavigate();
  const { showToast } = useToast();

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
    
    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Mobile number validation
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^(\+?[1-9]\d{1,14}|\d{10,11})$/.test(formData.mobileNumber.replace(/\s/g, ''))) {
      newErrors.mobileNumber = "Please enter a valid mobile number";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase and number";
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      // First check if email or phone already exists
      const checkRes = await fetch("/server/auth/check-user", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email,
          mobileNumber: formData.mobileNumber 
        }),
      });
      
      const checkData = await checkRes.json();
      
      if (!checkData.success) {
        if (checkData.emailExists) {
          setErrors({ email: "This email is already registered" });
        }
        if (checkData.phoneExists) {
          setErrors(prev => ({ ...prev, mobileNumber: "This phone number is already registered" }));
        }
        setLoading(false);
        showToast(checkData.message || "User already exists", "error");
        return;
      }

      // Send registration request and get verification code
      const res = await fetch("/server/auth/signup", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!data.success) {
        setLoading(false);
        showToast(data.message || "Registration failed", "error");
        return;
      }

      // Registration sent verification code to terminal
      if (data.requiresVerification) {
        setStep(2);
        showToast("Verification code sent! Check the terminal for your code.", "success");
      } else {
        showToast("Registration completed successfully!", "success");
        navigate("/sign-in");
      }
      setLoading(false);
      setResendTimer(60);
      showToast("Verification code generated in terminal", "info");
      
    } catch (error) {
      setLoading(false);
      showToast("Network error occurred", "error");
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      showToast("Please enter a valid 6-digit verification code", "error");
      return;
    }

    setLoading(true);

    try {
      // Complete registration with verification code
      const res = await fetch("/server/auth/complete-signup", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          verificationCode: verificationCode.trim()
        }),
      });

      const data = await res.json();

      if (data.success) {
        showToast("Account created successfully! You are now logged in.", "success");
        // The backend returns a token and user data, we can use them
        if (data.user && data.token) {
          // Store user data in localStorage or Redux if needed
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
        }
        navigate("/dashboard");
      } else {
        showToast(data.message || "Invalid verification code. Check the terminal for the correct code.", "error");
      }
    } catch (error) {
      showToast("Verification failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    try {
      // Resend verification code via backend
      const res = await fetch("/server/auth/signup", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (data.success && data.requiresVerification) {
        showToast("New verification code sent! Check terminal.", "success");
        setResendTimer(60);
      } else {
        showToast(data.message || "Failed to resend code", "error");
      }
    } catch (error) {
      showToast("Failed to resend verification code", "error");
    }
    
    setDevHint(newCode);
    setResendTimer(60);
    showToast("New verification code generated in terminal", "info");
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div 
        initial="initial"
        animate="animate"
        variants={pageVariants}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            {step === 1 ? (
              <UserIcon className="w-10 h-10 text-white" />
            ) : (
              <KeyIcon className="w-10 h-10 text-white" />
            )}
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {step === 1 ? 'Create Your Account' : 'Verify Your Email'}
          </h1>
          <p className="text-gray-600">
            {step === 1 
              ? 'Join Basha Lagbe and find your perfect home'
              : 'Enter the verification code sent to your terminal'
            }
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-lg ${
            step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 mx-3 rounded-full transition-all duration-300 ${
            step >= 2 ? 'bg-purple-600' : 'bg-gray-200'
          }`} />
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-lg ${
            step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
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
            {/* Step 1: Registration Form */}
            {step === 1 && (
              <motion.div
                key="registration"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-3">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                      <input
                        id="fullName" 
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                          errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white'
                        }`}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    {errors.fullName && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-red-600 text-sm mt-2 flex items-center"
                      >
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {errors.fullName}
                      </motion.p>
                    )}
                  </div>

                  {/* Email and Mobile - Side by side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                        Email Address
                      </label>
                      <div className="relative">
                        <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                            errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white'
                          }`}
                          placeholder="Enter your email"
                          required
                        />
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

                    {/* Mobile Number */}
                    <div>
                      <label htmlFor="mobileNumber" className="block text-sm font-semibold text-gray-700 mb-3">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <PhoneIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                        <input
                          id="mobileNumber"
                          name="mobileNumber"
                          type="tel"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                            errors.mobileNumber ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white'
                          }`}
                          placeholder="Enter your mobile number"
                          required
                        />
                      </div>
                      {errors.mobileNumber && (
                        <motion.p 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-red-600 text-sm mt-2 flex items-center"
                        >
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {errors.mobileNumber}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Password Fields - Side by side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                        Password
                      </label>
                      <div className="relative">
                        <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-16 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                            errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white'
                          }`}
                          placeholder="Create a password"
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

                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-3">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-16 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                            errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white'
                          }`}
                          placeholder="Confirm your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeSlashIcon className="w-5 h-5" />
                          ) : (
                            <EyeIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <motion.p 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-red-600 text-sm mt-2 flex items-center"
                        >
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {errors.confirmPassword}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                        Creating Account...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        Create My Account
                        <ArrowRightIcon className="w-5 h-5 ml-2" />
                      </div>
                    )}
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="my-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500 font-medium">Or sign up with</span>
                    </div>
                  </div>
                </div>

                {/* OAuth */}
                <OAuth />

                {/* Sign In Link */}
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link 
                      to="/sign-in" 
                      className="font-medium text-purple-600 hover:text-purple-800"
                    >
                      Sign in →
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Verification */}
            {step === 2 && (
              <motion.div
                key="verification"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <KeyIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Verify Your Account</h3>
                  <p className="text-gray-600 text-sm">
                    Check your terminal for the 6-digit verification code sent for{" "}
                    <span className="font-semibold text-gray-900">{formData.email}</span>
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
                      className="w-full px-6 py-4 border-2 border-gray-200 bg-gray-50 rounded-2xl text-center text-3xl tracking-widest font-mono focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all duration-300"
                      placeholder="000000"
                      maxLength="6"
                      required
                    />
                  </div>

                  {/* Terminal Hint */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-purple-200 rounded-2xl"
                  >
                    <div className="flex items-center text-purple-800 text-sm">
                      <SparklesIcon className="w-4 h-4 mr-2" />
                      <strong>Terminal Code:</strong> Check your console for the verification code
                    </div>
                  </motion.div>

                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium mb-4"
                  >
                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    Back to form
                  </button>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || verificationCode.length !== 6}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                        Verifying...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <CheckCircleIcon className="w-5 h-5 mr-2" />
                        Complete Registration
                      </div>
                    )}
                  </motion.button>

                  {/* Resend Code */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={resendTimer > 0}
                      className={`text-sm font-medium transition-colors ${
                        resendTimer > 0 
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-purple-600 hover:text-purple-800'
                      }`}
                    >
                      {resendTimer > 0 
                        ? `Resend code in ${resendTimer}s`
                        : 'Generate new verification code'
                      }
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
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="text-purple-600 hover:text-purple-800 underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-purple-600 hover:text-purple-800 underline">
              Privacy Policy
            </Link>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            © 2025 Basha Lagbe. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
