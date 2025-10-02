import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CameraIcon,
  KeyIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  StarIcon,
  HomeIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { signInSuccess } from '../redux/users/userSlice';
import { useToast } from '../hooks/useToast';

export default function Profile() {
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    fullName: '',
    mobileNumber: '',
    age: '',
    address: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [emailData, setEmailData] = useState({
    newEmail: '',
    password: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
    email: false
  });
  const [userStats, setUserStats] = useState({
    totalListings: 0,
    approvedListings: 0,
    totalReviews: 0,
    totalApplications: 0
  });
  
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        fullName: currentUser.fullName || '',
        mobileNumber: currentUser.mobileNumber || '',
        age: currentUser.age || '',
        address: currentUser.address || ''
      });
      
      fetchUserStats();
    }
  }, [currentUser]);
  
  const fetchUserStats = async () => {
    try {
      // Mock stats for now since we don't have a specific stats endpoint
      setUserStats({
        totalListings: 5,
        approvedListings: 3,
        totalReviews: 12,
        totalApplications: 8
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };
  
  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };
  
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleEmailChange = (e) => {
    setEmailData({
      ...emailData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Avatar image must be less than 5MB', 'error');
        return;
      }
      
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
        showToast('File type must be JPEG, PNG, or GIF', 'error');
        return;
      }
      
      setAvatar(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return errors;
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    setUpdating(true);
    
    try {
      let formData = null;
      
      if (avatar) {
        formData = new FormData();
        formData.append('fullName', profileData.fullName);
        formData.append('mobileNumber', profileData.mobileNumber);
        formData.append('age', profileData.age);
        formData.append('address', profileData.address);
        formData.append('avatar', avatar);
      }
      
      const requestOptions = {
        method: 'POST',
        headers: avatar ? {} : {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: avatar ? formData : JSON.stringify(profileData)
      };
      
      const response = await fetch(`/server/user/update/${currentUser._id}`, requestOptions);
      const data = await response.json();
      
      if (data.success) {
        dispatch(signInSuccess({
          ...currentUser,
          ...data.user
        }));
        
        showToast('Profile updated successfully', 'success');
      } else {
        showToast(data.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Error updating profile. Please try again.', 'error');
    } finally {
      setUpdating(false);
      setAvatar(null);
      setAvatarPreview(null);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill all password fields', 'error');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      showToast(passwordErrors[0], 'error');
      return;
    }
    
    setChangingPassword(true);
    
    try {
      const response = await fetch(`/server/user/change-password/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(passwordData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        showToast('Password changed successfully', 'success');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        showToast(data.message || 'Failed to change password', 'error');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      showToast('Error changing password. Please try again.', 'error');
    } finally {
      setChangingPassword(false);
    }
  };
  
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    const { newEmail, password } = emailData;
    
    if (!newEmail || !password) {
      showToast('Please fill all email change fields', 'error');
      return;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newEmail)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    
    setChangingEmail(true);
    
    try {
      const response = await fetch(`/server/user/change-email/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(emailData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        dispatch(signInSuccess({
          ...currentUser,
          email: newEmail
        }));
        
        showToast('Email changed successfully', 'success');
        setEmailData({
          newEmail: '',
          password: ''
        });
      } else {
        showToast(data.message || 'Failed to change email', 'error');
      }
    } catch (error) {
      console.error('Error changing email:', error);
      showToast('Error changing email. Please try again.', 'error');
    } finally {
      setChangingEmail(false);
    }
  };
  
  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Sidebar */}
            <div className="md:w-1/3 bg-gradient-to-b from-blue-700 to-purple-800 text-white p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4 w-28 h-28">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white">
                    <img 
                      src={avatarPreview || currentUser?.avatar || 'https://via.placeholder.com/150?text=User'} 
                      alt={currentUser?.fullName || 'User'} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 rounded-full p-2 transition-colors duration-200"
                  >
                    <CameraIcon className="w-5 h-5 text-white" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg, image/png, image/gif"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                
                <h2 className="text-xl font-semibold">{currentUser?.fullName}</h2>
                <p className="text-sm text-blue-200">{currentUser?.email}</p>
                
                <div className="mt-6 w-full">
                  <nav className="space-y-2">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                        activeTab === 'profile' 
                          ? 'bg-white/10 text-white font-medium' 
                          : 'text-blue-100 hover:bg-white/5'
                      }`}
                    >
                      <UserIcon className="w-5 h-5 mr-3" />
                      Profile Information
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('password')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                        activeTab === 'password' 
                          ? 'bg-white/10 text-white font-medium' 
                          : 'text-blue-100 hover:bg-white/5'
                      }`}
                    >
                      <KeyIcon className="w-5 h-5 mr-3" />
                      Change Password
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('email')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                        activeTab === 'email' 
                          ? 'bg-white/10 text-white font-medium' 
                          : 'text-blue-100 hover:bg-white/5'
                      }`}
                    >
                      <EnvelopeIcon className="w-5 h-5 mr-3" />
                      Change Email
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('stats')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                        activeTab === 'stats' 
                          ? 'bg-white/10 text-white font-medium' 
                          : 'text-blue-100 hover:bg-white/5'
                      }`}
                    >
                      <ChartBarIcon className="w-5 h-5 mr-3" />
                      Activity Stats
                    </button>
                  </nav>
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="md:w-2/3 p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h3>
                    
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            value={profileData.fullName}
                            onChange={handleProfileChange}
                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border-gray-300"
                            placeholder="Your full name"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile Number
                        </label>
                        <div className="relative">
                          <PhoneIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            id="mobileNumber"
                            name="mobileNumber"
                            type="text"
                            value={profileData.mobileNumber}
                            onChange={handleProfileChange}
                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border-gray-300"
                            placeholder="Your mobile number"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                            Age
                          </label>
                          <div className="relative">
                            <CalendarDaysIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                              id="age"
                              name="age"
                              type="number"
                              value={profileData.age}
                              onChange={handleProfileChange}
                              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border-gray-300"
                              placeholder="Your age"
                              min="18"
                              max="120"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                          </label>
                          <div className="relative">
                            <MapPinIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                              id="address"
                              name="address"
                              type="text"
                              value={profileData.address}
                              onChange={handleProfileChange}
                              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border-gray-300"
                              placeholder="Your address"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={updating}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          {updating ? (
                            <div className="flex items-center justify-center">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Updating Profile...
                            </div>
                          ) : (
                            'Update Profile'
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
                
                {activeTab === 'password' && (
                  <motion.div
                    key="password"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h3>
                    
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <KeyIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            id="currentPassword"
                            name="currentPassword"
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border-gray-300"
                            placeholder="Your current password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('current')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                          >
                            {showPasswords.current ? (
                              <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                              <EyeIcon className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <ShieldCheckIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            id="newPassword"
                            name="newPassword"
                            type={showPasswords.new ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border-gray-300"
                            placeholder="Your new password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('new')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                          >
                            {showPasswords.new ? (
                              <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                              <EyeIcon className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <ShieldCheckIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPasswords.confirm ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border-gray-300"
                            placeholder="Confirm new password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirm')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                          >
                            {showPasswords.confirm ? (
                              <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                              <EyeIcon className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li className={`flex items-center ${passwordData.newPassword && passwordData.newPassword.length >= 6 ? 'text-green-600' : ''}`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${passwordData.newPassword && passwordData.newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            At least 6 characters
                          </li>
                          <li className={`flex items-center ${passwordData.newPassword && /(?=.*[a-z])/.test(passwordData.newPassword) ? 'text-green-600' : ''}`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${passwordData.newPassword && /(?=.*[a-z])/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            One lowercase letter
                          </li>
                          <li className={`flex items-center ${passwordData.newPassword && /(?=.*[A-Z])/.test(passwordData.newPassword) ? 'text-green-600' : ''}`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${passwordData.newPassword && /(?=.*[A-Z])/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            One uppercase letter
                          </li>
                          <li className={`flex items-center ${passwordData.newPassword && /(?=.*\d)/.test(passwordData.newPassword) ? 'text-green-600' : ''}`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${passwordData.newPassword && /(?=.*\d)/.test(passwordData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            One number
                          </li>
                        </ul>
                      </div>
                      
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={changingPassword}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          {changingPassword ? (
                            <div className="flex items-center justify-center">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Changing Password...
                            </div>
                          ) : (
                            'Change Password'
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
                
                {activeTab === 'email' && (
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Change Email</h3>
                    
                    <form onSubmit={handleEmailSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="currentEmail" className="block text-sm font-medium text-gray-700 mb-2">
                          Current Email
                        </label>
                        <div className="relative">
                          <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            id="currentEmail"
                            type="email"
                            value={currentUser?.email}
                            className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-100 border-gray-300 cursor-not-allowed"
                            disabled
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-2">
                          New Email
                        </label>
                        <div className="relative">
                          <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            id="newEmail"
                            name="newEmail"
                            type="email"
                            value={emailData.newEmail}
                            onChange={handleEmailChange}
                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border-gray-300"
                            placeholder="Your new email address"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="emailPassword" className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm with Password
                        </label>
                        <div className="relative">
                          <KeyIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            id="emailPassword"
                            name="password"
                            type={showPasswords.email ? "text" : "password"}
                            value={emailData.password}
                            onChange={handleEmailChange}
                            className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border-gray-300"
                            placeholder="Your current password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('email')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                          >
                            {showPasswords.email ? (
                              <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                              <EyeIcon className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                        <div className="flex items-center">
                          <ExclamationTriangleIcon className="w-5 h-5 text-blue-600 mr-2" />
                          <p className="text-sm text-blue-800">
                            <strong>Important:</strong> Changing your email may require re-verification.
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={changingEmail}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          {changingEmail ? (
                            <div className="flex items-center justify-center">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Changing Email...
                            </div>
                          ) : (
                            'Change Email'
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
                
                {activeTab === 'stats' && (
                  <motion.div
                    key="stats"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Activity Statistics</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4">
                          <HomeIcon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-sm font-medium text-blue-100">Total Listings</h4>
                        <p className="text-3xl font-bold mt-1">{userStats.totalListings}</p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4">
                          <CheckCircleIcon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-sm font-medium text-green-100">Approved Listings</h4>
                        <p className="text-3xl font-bold mt-1">{userStats.approvedListings}</p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4">
                          <StarIcon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-sm font-medium text-amber-100">Total Reviews</h4>
                        <p className="text-3xl font-bold mt-1">{userStats.totalReviews}</p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4">
                          <DocumentTextIcon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-sm font-medium text-purple-100">Applications</h4>
                        <p className="text-3xl font-bold mt-1">{userStats.totalApplications}</p>
                      </div>
                    </div>
                    
                    <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h4>
                      
                      {/* Placeholder for recent activity if we implement it later */}
                      <p className="text-gray-500 text-center py-6">
                        Your recent activity will appear here.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}