import User from "../models/user.model.js";
import Property from "../models/property.js";
import Review from "../models/Review.js";
import Application from "../models/Application.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/avatars';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Please upload only image files.'), false);
  }
};

export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// Get User Profile with Stats
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(errorHandler(404, 'User not found!'));
    }
    
    // Check if requesting user is the profile owner
    const isOwnProfile = req.user.id === req.params.id;
    
    // Get user stats
    const totalListings = await Property.countDocuments({ userRef: req.params.id });
    const approvedListings = await Property.countDocuments({ 
      userRef: req.params.id,
      isApproved: true
    });
    const totalReviews = await Review.countDocuments({ reviewer: req.params.id });
    const totalApplications = await Application.countDocuments({ applicantEmail: user.email });
    
    // Remove sensitive information
    const { password, passwordResetToken, passwordResetExpires, ...userWithoutSensitiveInfo } = user._doc;
    
    res.status(200).json({
      success: true,
      user: userWithoutSensitiveInfo,
      stats: {
        totalListings,
        approvedListings,
        totalReviews,
        totalApplications
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update User Profile
export const updateUserProfile = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only update your own account"));
  }

  try {
    const { fullName, mobileNumber, address, age } = req.body;
    
    // Build update object with only provided fields
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (mobileNumber !== undefined) updateData.mobileNumber = mobileNumber;
    if (address !== undefined) updateData.address = address;
    if (age !== undefined) updateData.age = age;
    
    // Handle file upload separately if needed
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    
    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }
    
    // Remove sensitive information from response
    const { password, passwordResetToken, passwordResetExpires, ...userWithoutSensitiveInfo } = updatedUser._doc;
    
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userWithoutSensitiveInfo
    });
  } catch (error) {
    next(error);
  }
};

// Upload Avatar
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(errorHandler(400, "No image file uploaded"));
    }
    
    const avatarUrl = `/${req.file.path.replace(/\\/g, '/')}`;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { avatar: avatarUrl } },
      { new: true }
    );
    
    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }
    
    // Remove old avatar file if it exists (except default avatar)
    if (updatedUser.avatar && !updatedUser.avatar.includes('default-avatar') && fs.existsSync(updatedUser.avatar)) {
      fs.unlinkSync(updatedUser.avatar);
    }
    
    // Remove sensitive information from response
    const { password, passwordResetToken, passwordResetExpires, ...userWithoutSensitiveInfo } = updatedUser._doc;
    
    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      user: userWithoutSensitiveInfo
    });
  } catch (error) {
    next(error);
  }
};

// Change Email
export const changeEmail = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only update your own email"));
  }
  
  try {
    const { newEmail, password } = req.body;
    
    if (!newEmail || !password) {
      return next(errorHandler(400, "Email and password are required"));
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return next(errorHandler(400, "Invalid email format"));
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    
    // Check if email already exists
    const emailExists = await User.findOne({ email: newEmail.toLowerCase() });
    if (emailExists && emailExists._id.toString() !== req.params.id) {
      return next(errorHandler(409, "Email already in use"));
    }
    
    // Verify password
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return next(errorHandler(401, "Incorrect password"));
    }
    
    // Update email
    user.email = newEmail.toLowerCase();
    await user.save();
    
    // Remove sensitive information from response
    const { password: pass, passwordResetToken, passwordResetExpires, ...userWithoutSensitiveInfo } = user._doc;
    
    res.status(200).json({
      success: true,
      message: "Email changed successfully",
      user: userWithoutSensitiveInfo
    });
  } catch (error) {
    next(error);
  }
};

// Change Password
export const changePassword = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only change your own password"));
  }
  
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      return next(errorHandler(400, "All fields are required"));
    }
    
    if (newPassword !== confirmPassword) {
      return next(errorHandler(400, "Passwords do not match"));
    }
    
    if (newPassword.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    
    // Verify current password
    const validPassword = bcryptjs.compareSync(currentPassword, user.password);
    if (!validPassword) {
      return next(errorHandler(401, "Current password is incorrect"));
    }
    
    // Update password
    user.password = bcryptjs.hashSync(newPassword, 10);
    await user.save();
    
    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Delete User Account
export const deleteUserAccount = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only delete your own account"));
  }
  
  try {
    await User.findByIdAndDelete(req.params.id);
    
    // Delete related data (listings, reviews, etc.)
    await Property.deleteMany({ userRef: req.params.id });
    await Review.deleteMany({ reviewer: req.params.id });
    
    res.clearCookie('access_token');
    
    res.status(200).json({
      success: true,
      message: "Account deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Legacy method (keep for backward compatibility)
export const updateUser = updateUserProfile;

// Get User (for contact info)
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, 'User not found!'));

    // Only return non-sensitive info
    const { password, passwordResetToken, passwordResetExpires, ...userWithoutSensitiveInfo } = user._doc;
    res.status(200).json(userWithoutSensitiveInfo);
  } catch (error) {
    next(error);
  }
};