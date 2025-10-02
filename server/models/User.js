import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Core Personal Information (flattened for easier access)
  fullName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  mobileNumber: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^(\+880|880|0)?1[3-9]\d{8}$/, 'Please provide a valid Bangladesh mobile number']
  },
  age: { 
    type: Number, 
    required: true, 
    min: 18, 
    max: 100 
  },
  address: { 
    type: String, 
    default: '' 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  avatar: { 
    type: String, 
    default: '' 
  },
  isEmailVerified: { 
    type: Boolean, 
    default: false 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  profileCompleted: { 
    type: Boolean, 
    default: false 
  },
  
  // Password Reset Fields
  passwordResetToken: { 
    type: String, 
    default: null 
  },
  passwordResetExpires: { 
    type: Date, 
    default: null 
  },
  
  // Account Security
  lastLoginAt: { 
    type: Date, 
    default: null 
  },
  failedLoginAttempts: { 
    type: Number, 
    default: 0 
  },
  lockedUntil: { 
    type: Date, 
    default: null 
  },
  
  // Profile Stats
  totalListings: { 
    type: Number, 
    default: 0 
  },
  averageRating: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 5 
  },
  totalReviews: { 
    type: Number, 
    default: 0 
  },

  // Legacy fields for backward compatibility
  personalInfo: {
    firstName: {
      type: String,
      trim: true,
      maxlength: 50
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 50
    },
    fullName: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true,
      match: [/^(\+88)?01[3-9]\d{8}$/, 'Please provide a valid Bangladesh phone number']
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say']
    },
    avatar: {
      type: String,
      default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    },
    nidNumber: {
      type: String,
      unique: true,
      sparse: true
    }
  },

  accountType: {
    type: String,
    enum: ['tenant', 'landlord', 'admin', 'agent'],
    default: 'tenant'
  },

  // Verification Status
  verification: {
    email: {
      isVerified: { type: Boolean, default: false },
      verifiedAt: Date
    },
    phone: {
      isVerified: { type: Boolean, default: false },
      verifiedAt: Date
    },
    identity: {
      isVerified: { type: Boolean, default: false },
      verifiedAt: Date,
      documents: [{
        type: { type: String, enum: ['nid', 'passport', 'driving_license'] },
        imageUrl: String,
        uploadedAt: { type: Date, default: Date.now }
      }]
    },
    income: {
      isVerified: { type: Boolean, default: false },
      verifiedAt: Date,
      documents: [{
        type: { type: String, enum: ['salary_slip', 'bank_statement', 'tax_certificate'] },
        imageUrl: String,
        uploadedAt: { type: Date, default: Date.now }
      }]
    }
  },

  // Social Authentication
  social: {
    googleId: String,
    facebookId: String,
    linkedInId: String
  },

  // User Preferences
  preferences: {
    budget: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 100000 }
    },
    preferredLocations: [String],
    propertyTypes: [String],
    amenities: [String],
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'BDT' }
  },

  // Activity Tracking
  activity: {
    lastLogin: Date,
    lastActive: Date,
    loginHistory: [{
      timestamp: { type: Date, default: Date.now },
      ipAddress: String,
      userAgent: String,
      location: String
    }],
    viewHistory: [{
      propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
      viewedAt: { type: Date, default: Date.now }
    }],
    searchHistory: [{
      query: String,
      filters: mongoose.Schema.Types.Mixed,
      searchedAt: { type: Date, default: Date.now }
    }]
  },

  // Settings
  settings: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false }
    },
    privacy: {
      profileVisibility: { type: String, enum: ['public', 'private'], default: 'public' },
      showPhoneNumber: { type: Boolean, default: false },
      allowDirectMessages: { type: Boolean, default: true }
    },
    twoFactorAuth: {
      enabled: { type: Boolean, default: false },
      method: { type: String, enum: ['email', 'sms', 'app'] }
    }
  },

  // Professional Info (for landlords/agents)
  professionalInfo: {
    companyName: String,
    businessLicense: String,
    yearsOfExperience: Number,
    specializations: [String],
    serviceAreas: [String]
  },

  // Statistics
  stats: {
    totalProperties: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    totalInquiries: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    successfulDeals: { type: Number, default: 0 }
  },

  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'banned'],
    default: 'active'
  },

  // Subscription (for premium features)
  subscription: {
    plan: { type: String, enum: ['free', 'basic', 'premium', 'enterprise'], default: 'free' },
    startDate: Date,
    endDate: Date,
    features: [String]
  }
}, {
  timestamps: true
});

// Indexes for better performance (email already has unique: true, so no need for separate index)
userSchema.index({ 'personalInfo.phone': 1 });
userSchema.index({ accountType: 1 });
userSchema.index({ 'verification.email.isVerified': 1 });
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('displayName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcryptjs.genSalt(12);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockedUntil && this.lockedUntil > Date.now());
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcryptjs.compare(candidatePassword, this.password);
};

// Method to handle failed login attempts
userSchema.methods.incLoginAttempts = async function() {
  if (this.lockedUntil && this.lockedUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockedUntil: 1, failedLoginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { failedLoginAttempts: 1 } };
  
  if (this.failedLoginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockedUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { failedLoginAttempts: 1, lockedUntil: 1 }
  });
};

// Method to update last activity
userSchema.methods.updateLastActivity = function() {
  this.activity.lastActive = new Date();
  return this.save();
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
