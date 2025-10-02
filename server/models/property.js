import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  // Basic Information
  basicInfo: {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000
    },
    propertyType: {
      type: String,
      required: true,
      enum: ['apartment', 'house', 'studio', 'room', 'duplex', 'villa', 'commercial', 'office', 'shop', 'warehouse']
    },
    listingType: {
      type: String,
      enum: ['rent', 'sale'],
      default: 'rent'
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected', 'rented', 'sold', 'inactive'],
      default: 'draft'
    },
    featured: {
      type: Boolean,
      default: false
    }
  },

  // Owner Information (keeping backward compatibility)
  owner: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: String,
    email: String,
    phone: String,
    isVerified: { type: Boolean, default: false }
  },
  
  // Legacy fields for backward compatibility
  ownerName: { type: String },
  ownerPhone: { type: String },
  ownerEmail: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Location Details
  location: {
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere', default: [0, 0] }  // Default to [0, 0] to prevent GeoJSON errors
    },
    address: {
      street: { type: String, required: true },
      area: { type: String, required: true },
      district: { type: String, required: true },
      division: String,
      postalCode: String,
      landmark: String
    },
    neighborhood: {
      name: String,
      description: String,
      walkScore: Number,
      publicTransport: [{
        type: { type: String, enum: ['bus', 'train', 'rickshaw', 'cng'] },
        distance: Number,
        name: String
      }],
      amenities: [{
        type: { type: String, enum: ['school', 'hospital', 'market', 'bank', 'mosque', 'park', 'restaurant'] },
        name: String,
        distance: Number
      }]
    }
  },

  // Legacy location fields for backward compatibility
  address: String,

  // Property Details
  details: {
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    livingRooms: { type: Number, default: 1 },
    kitchens: { type: Number, default: 1 },
    balconies: { type: Number, default: 0 },
    area: {
      total: { type: Number, required: true },
      unit: { type: String, enum: ['sqft', 'sqm'], default: 'sqft' }
    },
    floor: {
      current: Number,
      total: Number
    },
    age: {
      years: Number,
      condition: { type: String, enum: ['new', 'excellent', 'good', 'fair', 'needs-renovation'] }
    },
    furnishing: {
      type: String,
      enum: ['unfurnished', 'semi-furnished', 'fully-furnished'],
      default: 'unfurnished'
    }
  },

  // Legacy property detail fields
  apartmentType: String,
  totalRooms: Number,
  masterBedrooms: Number,
  washrooms: Number,
  squareFeet: Number,
  floor: Number,
  totalFloors: Number,
  hasLift: Boolean,
  hasParking: Boolean,
  isFurnished: Boolean,
  hasBalcony: Boolean,
  hasGas: Boolean,
  hasWifi: Boolean,

  // Pricing Information
  pricing: {
    rent: {
      monthly: { type: Number, required: true },
      currency: { type: String, default: 'BDT' },
      negotiable: { type: Boolean, default: false }
    },
    deposit: {
      amount: Number,
      months: { type: Number, default: 2 }
    },
    utilities: {
      electricity: { included: Boolean, averageCost: Number },
      gas: { included: Boolean, averageCost: Number },
      water: { included: Boolean, averageCost: Number },
      internet: { included: Boolean, averageCost: Number },
      maintenance: { included: Boolean, averageCost: Number }
    }
  },

  // Legacy pricing field
  rentPrice: { type: Number, required: true, min: 1000 },

  // Media
  media: {
    images: [{
      url: String,
      caption: String,
      category: { type: String, enum: ['exterior', 'interior', 'bedroom', 'bathroom', 'kitchen', 'living', 'amenities'] },
      isPrimary: { type: Boolean, default: false },
      uploadedAt: { type: Date, default: Date.now }
    }],
    videos: [{
      url: String,
      thumbnail: String,
      duration: Number,
      title: String,
      uploadedAt: { type: Date, default: Date.now }
    }],
    virtualTour: {
      url: String,
      provider: { type: String, enum: ['matterport', '360', 'custom'] },
      embedCode: String
    },
    floorPlan: {
      url: String,
      type: { type: String, enum: ['2d', '3d'] }
    }
  },

  // Legacy images field
  images: [{ type: String }],

  // Amenities and Features
  amenities: {
    building: {
      elevator: { type: Boolean, default: false },
      generator: { type: Boolean, default: false },
      security: { type: Boolean, default: false },
      cctv: { type: Boolean, default: false },
      intercom: { type: Boolean, default: false },
      rooftop: { type: Boolean, default: false },
      gym: { type: Boolean, default: false },
      swimmingPool: { type: Boolean, default: false },
      playground: { type: Boolean, default: false },
      communityHall: { type: Boolean, default: false }
    },
    unit: {
      airConditioning: { type: Boolean, default: false },
      heating: { type: Boolean, default: false },
      wifi: { type: Boolean, default: false },
      cable: { type: Boolean, default: false },
      dishwasher: { type: Boolean, default: false },
      washer: { type: Boolean, default: false },
      dryer: { type: Boolean, default: false },
      refrigerator: { type: Boolean, default: false },
      microwave: { type: Boolean, default: false }
    },
    outdoor: {
      parking: {
        available: { type: Boolean, default: false },
        type: { type: String, enum: ['covered', 'open', 'garage'] },
        spaces: Number
      },
      garden: { type: Boolean, default: false },
      terrace: { type: Boolean, default: false },
      barbecue: { type: Boolean, default: false }
    }
  },

  // Availability
  availability: {
    availableFrom: Date,
    lastUpdated: { type: Date, default: Date.now },
    isAvailable: { type: Boolean, default: true },
    bookedUntil: Date
  },

  // Legacy availability fields
  availableFrom: { type: Date, default: Date.now },
  isAvailable: { type: Boolean, default: true },

  // Performance Metrics
  performance: {
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    bookings: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 }
    },
    lastViewedAt: Date,
    popularityScore: { type: Number, default: 0 }
  },

  // Legacy performance fields
  views: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  tags: [String],

  // Admin Verification (keeping current structure)
  isVerified: { type: Boolean, default: false },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  rejectionReason: { type: String },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: { type: Date },

  // Moderation
  moderation: {
    moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    moderatedAt: Date,
    moderationNotes: String,
    rejectionReason: String,
    autoModeration: {
      flagged: { type: Boolean, default: false },
      reasons: [String],
      confidence: Number
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
propertySchema.index({ 'location.coordinates': '2dsphere' });
propertySchema.index({ 'basicInfo.status': 1 });
propertySchema.index({ 'basicInfo.propertyType': 1 });
propertySchema.index({ 'pricing.rent.monthly': 1 });
propertySchema.index({ 'location.address.district': 1 });
propertySchema.index({ 'location.address.area': 1 });
propertySchema.index({ 'owner.userId': 1 });
propertySchema.index({ createdAt: -1 });
propertySchema.index({ 'performance.views': -1 });
propertySchema.index({ 'availability.isAvailable': 1 });

// Legacy indexes
propertySchema.index({ rentPrice: 1 });
propertySchema.index({ verificationStatus: 1, isVerified: 1 });

// Text search index
propertySchema.index({
  'basicInfo.title': 'text',
  'basicInfo.description': 'text',
  'location.address.area': 'text',
  'location.address.district': 'text',
  title: 'text',
  description: 'text'
});

// Virtual for formatted price
propertySchema.virtual('formattedPrice').get(function() {
  const price = this.pricing?.rent?.monthly || this.rentPrice || 0;
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT'
  }).format(price);
});

// Method to increment views
propertySchema.methods.incrementViews = function() {
  if (this.performance) {
    this.performance.views += 1;
    this.performance.lastViewedAt = new Date();
  } else {
    this.views = (this.views || 0) + 1;
  }
  return this.save();
};

// Method to calculate popularity score
propertySchema.methods.calculatePopularityScore = function() {
  const views = this.performance?.views || this.views || 0;
  const inquiries = this.performance?.inquiries || 0;
  const favorites = this.performance?.favorites || 0;
  const rating = this.performance?.rating?.average || 0;
  
  const score = (views * 0.3) + (inquiries * 0.4) + (favorites * 0.2) + (rating * 0.1);
  if (this.performance) {
    this.performance.popularityScore = score;
  }
  return this.save();
};

// Static method for advanced search
propertySchema.statics.advancedSearch = function(filters = {}) {
  const query = {};
  
  // Status filter
  if (this.basicInfo) {
    query['basicInfo.status'] = 'approved';
    query['availability.isAvailable'] = true;
  } else {
    query['verificationStatus'] = 'approved';
    query['isAvailable'] = true;
  }
  
  // Location filter
  if (filters.district) {
    query.$or = [
      { 'location.address.district': new RegExp(filters.district, 'i') },
      { 'location.district': new RegExp(filters.district, 'i') }
    ];
  }
  if (filters.area) {
    query.$or = [
      { 'location.address.area': new RegExp(filters.area, 'i') },
      { 'location.area': new RegExp(filters.area, 'i') }
    ];
  }
  
  // Price range
  if (filters.minPrice || filters.maxPrice) {
    const priceQuery = {};
    if (filters.minPrice) priceQuery.$gte = filters.minPrice;
    if (filters.maxPrice) priceQuery.$lte = filters.maxPrice;
    
    query.$or = [
      { 'pricing.rent.monthly': priceQuery },
      { 'rentPrice': priceQuery }
    ];
  }
  
  // Property type
  if (filters.propertyType) {
    query.$or = [
      { 'basicInfo.propertyType': filters.propertyType },
      { 'apartmentType': filters.propertyType }
    ];
  }
  
  // Bedrooms/Bathrooms
  if (filters.bedrooms) {
    query.$or = [
      { 'details.bedrooms': filters.bedrooms },
      { 'bedrooms': filters.bedrooms }
    ];
  }
  if (filters.bathrooms) {
    query.$or = [
      { 'details.bathrooms': filters.bathrooms },
      { 'bathrooms': filters.bathrooms }
    ];
  }
  
  // Text search
  if (filters.search) {
    query.$text = { $search: filters.search };
  }
  
  return this.find(query);
};

const Property = mongoose.model('Property', propertySchema);

export default Property;