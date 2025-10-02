import Property from "../models/property.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { sendPropertyApprovalEmail } from "../utils/emailService.js";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

// Configure multer for image uploads to memory storage (for Sharp processing)
const storage = multer.memoryStorage(); // Store in memory for Sharp processing

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, JPG, WebP) are allowed'), false);
    }
  }
}).array('images', 10);

// Image processing function using Sharp
const processImage = async (buffer, filename, outputPath) => {
  try {
    // Ensure output directory exists
    await fs.mkdir(outputPath, { recursive: true });

    const outputFile = path.join(outputPath, filename);

    // Process image: resize, optimize, convert to WebP
    await sharp(buffer)
      .resize(1200, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 85 })
      .toFile(outputFile);

    // Generate thumbnail
    const thumbnailFile = path.join(outputPath, `thumb_${filename}`);
    await sharp(buffer)
      .resize(400, 300, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 80 })
      .toFile(thumbnailFile);

    return {
      filename: path.basename(outputFile),
      thumbnail: path.basename(thumbnailFile)
    };
  } catch (error) {
    console.error('Image processing error:', error);
    throw new Error('Failed to process image');
  }
};

// Create Property
export const createProperty = async (req, res, next) => {
  try {
    // Handle file upload
    upload(req, res, async function (err) {
      if (err) {
        return next(errorHandler(400, err.message));
      }

      const {
        title,
        description,
        rentPrice,
        location,
        propertyType,
        bedrooms,
        bathrooms,
        squareFeet,
        floor,
        totalFloors,
        amenities,
        furnished,
        parking,
        elevator,
        generator,
        security,
        gas,
        wifi,
        imageUrls,
        availableFrom,
        contactPhone,
        additionalInfo,
        userRef,
        landlord
      } = req.body;

      // Debug: Log received data
      console.log('🔍 Received property data:', {
        title,
        description,
        rentPrice,
        location,
        propertyType,
        bedrooms,
        bathrooms,
        body: req.body
      });

      // Validate required fields - use frontend structure
      if (!title || !description || !rentPrice || !location || !bedrooms || !bathrooms || !propertyType) {
        console.log('❌ Missing required fields:', {
          title: !!title,
          description: !!description,
          rentPrice: !!rentPrice,
          location: !!location,
          bedrooms: !!bedrooms,
          bathrooms: !!bathrooms,
          propertyType: !!propertyType
        });
        return next(errorHandler(400, "Please provide all required fields"));
      }

      // Validate location object structure
      if (!location.address || !location.area || !location.district) {
        console.log('❌ Missing location details:', location);
        return next(errorHandler(400, "Please provide complete location details"));
      }

      // Process uploaded files with Sharp
      let finalImageUrls = [];
      if (req.files && req.files.length > 0) {
        console.log('📷 Processing', req.files.length, 'images with Sharp...');
        const processedImages = await Promise.all(
          req.files.map(async (file, index) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = `property-${uniqueSuffix}-${index}.webp`;
            
            const result = await processImage(
              file.buffer,
              filename,
              'uploads/properties/'
            );
            
            return {
              url: `/uploads/properties/${result.filename}`,
              thumbnail: `/uploads/properties/${result.thumbnail}`,
              isPrimary: index === 0
            };
          })
        );
        finalImageUrls = processedImages.map(img => img.url);
        console.log('✅ Images processed and optimized with Sharp');
      } else if (imageUrls && imageUrls.length > 0) {
        // Handle URLs from frontend
        finalImageUrls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
      }

      // For now, allow properties without images as they might be added later
      if (finalImageUrls.length === 0) {
        finalImageUrls = ['/images/placeholder-property.jpg']; // Default placeholder
      }

      // Get user information
      const user = await User.findById(req.user.id);
      if (!user) {
        return next(errorHandler(404, "User not found"));
      }

      // Create property with enhanced structure
      const property = new Property({
        // Basic Information
        basicInfo: {
          title: title.trim(),
          description: description.trim(),
          propertyType: propertyType?.toLowerCase() || 'apartment',
          listingType: 'rent',
          status: 'pending'
        },

        // Owner Information
        owner: {
          userId: req.user.id,
          name: landlord?.fullName || user.fullName,
          email: landlord?.email || user.email,
          phone: landlord?.phone || contactPhone || user.mobileNumber
        },

        // Location Details
        location: {
          coordinates: {
            type: 'Point',
            coordinates: location.coordinates || [90.4125, 23.7808] // Default Dhaka coordinates
          },
          address: {
            street: location.address || 'Not specified',
            area: location.area,
            district: location.district,
            division: location.division || 'Dhaka',
            postalCode: location.postalCode,
            landmark: location.landmark
          }
        },

        // Property Details
        details: {
          bedrooms: parseInt(bedrooms) || 1,
          bathrooms: parseInt(bathrooms) || 1,
          livingRooms: 1,
          kitchens: 1,
          balconies: 0,
          area: {
            total: parseInt(squareFeet) || 800,
            unit: 'sqft'
          },
          floor: {
            current: parseInt(floor) || 1,
            total: parseInt(totalFloors) || 5
          },
          furnishing: furnished ? 'fully-furnished' : 'unfurnished'
        },

        // Pricing Information
        pricing: {
          rent: {
            monthly: parseInt(rentPrice),
            currency: 'BDT',
            negotiable: false
          },
          deposit: {
            amount: parseInt(rentPrice) * 2, // Default 2 months
            months: 2
          }
        },

        // Media
        media: {
          images: finalImageUrls.map((url, index) => ({
            url: url,
            caption: `${title} - Image ${index + 1}`,
            category: index === 0 ? 'exterior' : 'interior',
            isPrimary: index === 0
          }))
        },

        // Amenities and Features
        amenities: {
          building: {
            elevator: elevator || false,
            generator: generator || false,
            security: security || false,
            parking: parking || false
          },
          unit: {
            wifi: wifi || false,
            airConditioning: false,
            heating: false,
            gas: gas || false
          }
        },

        // Availability
        availability: {
          availableFrom: availableFrom ? new Date(availableFrom) : new Date(),
          isAvailable: true
        },

        // Performance Metrics
        performance: {
          views: 0,
          inquiries: 0,
          favorites: 0
        },

        // Legacy fields for backward compatibility
        title: title.trim(),
        description: description.trim(),
        rentPrice: parseInt(rentPrice),
        address: location.address,
        images: finalImageUrls,
        apartmentType: propertyType,
        totalRooms: parseInt(bedrooms) + parseInt(bathrooms) + 1,
        bedrooms: parseInt(bedrooms),
        masterBedrooms: 0,
        bathrooms: parseInt(bathrooms),
        washrooms: parseInt(bathrooms),
        squareFeet: parseInt(squareFeet) || 800,
        floor: parseInt(floor) || 1,
        totalFloors: parseInt(totalFloors) || 5,
        hasLift: elevator || false,
        hasParking: parking || false,
        isFurnished: furnished || false,
        hasBalcony: false,
        hasGas: gas || false,
        hasWifi: wifi || false,
        availableFrom: availableFrom ? new Date(availableFrom) : new Date(),
        ownerName: landlord?.fullName || user.fullName,
        ownerPhone: landlord?.phone || contactPhone || user.mobileNumber,
        ownerEmail: user.email,
        postedBy: req.user.id,
        verificationStatus: 'pending',
        isVerified: false,
        isAvailable: true
      });

      const savedProperty = await property.save();

      // Create notification for admin
      await createAdminNotification({
        type: 'property_submitted',
        title: 'New Property Submitted',
        message: `Property "${title}" has been submitted for review`,
        data: { propertyId: savedProperty._id }
      });

      res.status(201).json({
        success: true,
        message: "Property submitted for admin approval",
        property: savedProperty
      });
    });
  } catch (error) {
    console.error("Create property error:", error);
    next(error);
  }
};

// Get All Properties (Public - only verified)
export const getAllProperties = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      area,
      district,
      minPrice,
      maxPrice,
      apartmentType,
      bedrooms,
      bathrooms,
      hasLift,
      hasParking,
      isFurnished,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object for approved properties only
    const filter = {
      $or: [
        { 'basicInfo.status': 'approved' },
        { verificationStatus: 'approved' }
      ],
      $and: [
        {
          $or: [
            { 'availability.isAvailable': true },
            { isAvailable: true }
          ]
        }
      ]
    };

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Location filters
    if (area) {
      filter.$or = [
        { 'location.address.area': { $regex: area, $options: 'i' } },
        { 'location.area': { $regex: area, $options: 'i' } }
      ];
    }

    if (district) {
      filter.$or = [
        { 'location.address.district': { $regex: district, $options: 'i' } },
        { 'location.district': { $regex: district, $options: 'i' } }
      ];
    }

    // Price range
    if (minPrice || maxPrice) {
      const priceQuery = {};
      if (minPrice) priceQuery.$gte = parseInt(minPrice);
      if (maxPrice) priceQuery.$lte = parseInt(maxPrice);
      
      filter.$or = [
        { 'pricing.rent.monthly': priceQuery },
        { rentPrice: priceQuery }
      ];
    }

    // Property type
    if (apartmentType && apartmentType !== 'all') {
      filter.$or = [
        { 'basicInfo.propertyType': apartmentType.toLowerCase() },
        { apartmentType: { $regex: apartmentType, $options: 'i' } }
      ];
    }

    // Room filters
    if (bedrooms) {
      filter.$or = [
        { 'details.bedrooms': parseInt(bedrooms) },
        { bedrooms: parseInt(bedrooms) }
      ];
    }

    if (bathrooms) {
      filter.$or = [
        { 'details.bathrooms': parseInt(bathrooms) },
        { bathrooms: parseInt(bathrooms) }
      ];
    }

    // Amenity filters
    if (hasLift !== undefined) {
      filter.$or = [
        { 'amenities.building.elevator': hasLift === 'true' },
        { hasLift: hasLift === 'true' }
      ];
    }

    if (hasParking !== undefined) {
      filter.$or = [
        { 'amenities.building.parking': hasParking === 'true' },
        { hasParking: hasParking === 'true' }
      ];
    }

    if (isFurnished !== undefined) {
      const furnished = isFurnished === 'true';
      filter.$or = [
        { 'details.furnishing': furnished ? { $ne: 'unfurnished' } : 'unfurnished' },
        { isFurnished: furnished }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with population
    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate('owner.userId', 'fullName email mobileNumber')
        .populate('postedBy', 'fullName email mobileNumber')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Property.countDocuments(filter)
    ]);

    // Increment view count for fetched properties
    const propertyIds = properties.map(p => p._id);
    await Property.updateMany(
      { _id: { $in: propertyIds } },
      { 
        $inc: { 
          'performance.views': 1,
          views: 1 
        } 
      }
    );

    res.status(200).json({
      success: true,
      properties,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error("Get properties error:", error);
    next(error);
  }
};

// Get Property by ID
export const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner.userId', 'fullName email mobileNumber avatar')
      .populate('postedBy', 'fullName email mobileNumber avatar')
      .populate('moderation.moderatedBy', 'fullName');

    if (!property) {
      return next(errorHandler(404, 'Property not found'));
    }

    // Check if property is approved or if user is the owner
    const isApproved = property.basicInfo?.status === 'approved' || property.verificationStatus === 'approved';
    const isOwner = req.user && (req.user.id === property.owner?.userId?.toString() || req.user.id === property.postedBy?.toString());
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isApproved && !isOwner && !isAdmin) {
      return next(errorHandler(404, 'Property not found'));
    }

    // Increment view count
    await Property.findByIdAndUpdate(req.params.id, {
      $inc: { 
        'performance.views': 1,
        views: 1 
      },
      'performance.lastViewedAt': new Date()
    });

    res.status(200).json({
      success: true,
      property
    });
  } catch (error) {
    console.error("Get property by ID error:", error);
    next(error);
  }
};

// Get User's Properties
export const getUserProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ 
      $or: [
        { 'owner.userId': req.user.id },
        { postedBy: req.user.id }
      ]
    })
    .sort({ createdAt: -1 })
    .lean();

    res.status(200).json({
      success: true,
      properties
    });
  } catch (error) {
    console.error("Get user properties error:", error);
    next(error);
  }
};

// Update Property (Owner only)
export const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return next(errorHandler(404, 'Property not found'));
    }

    // Check ownership
    const isOwner = property.owner?.userId?.toString() === req.user.id || property.postedBy?.toString() === req.user.id;
    if (!isOwner) {
      return next(errorHandler(403, 'You can only update your own properties'));
    }

    // If property was rejected, reset verification status
    const wasRejected = property.basicInfo?.status === 'rejected' || property.verificationStatus === 'rejected';
    if (wasRejected) {
      req.body['basicInfo.status'] = 'pending';
      req.body.verificationStatus = 'pending';
      req.body.isVerified = false;
      if (req.body['moderation.rejectionReason']) {
        delete req.body['moderation.rejectionReason'];
      }
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { 
        $set: {
          ...req.body,
          updatedAt: new Date()
        }
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property: updatedProperty
    });
  } catch (error) {
    console.error("Update property error:", error);
    next(error);
  }
};

// Delete Property (Owner only)
export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return next(errorHandler(404, 'Property not found'));
    }

    const isOwner = property.owner?.userId?.toString() === req.user.id || property.postedBy?.toString() === req.user.id;
    if (!isOwner) {
      return next(errorHandler(403, 'You can only delete your own properties'));
    }

    await Property.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error("Delete property error:", error);
    next(error);
  }
};

// Admin: Get Pending Properties
export const getPendingListings = async (req, res, next) => {
  try {
    // Check admin access
    if (req.user.role !== 'admin') {
      return next(errorHandler(403, 'Admin access required'));
    }

    const pendingProperties = await Property.find({
      $or: [
        { 'basicInfo.status': 'pending' },
        { verificationStatus: 'pending' }
      ]
    })
    .populate('owner.userId', 'fullName email mobileNumber')
    .populate('postedBy', 'fullName email mobileNumber')
    .sort({ createdAt: 1 }); // Oldest first

    res.status(200).json({
      success: true,
      properties: pendingProperties
    });
  } catch (error) {
    console.error("Get pending properties error:", error);
    next(error);
  }
};

// Admin: Approve/Reject Property
export const moderateProperty = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;
    
    // Check admin access
    if (req.user.role !== 'admin') {
      return next(errorHandler(403, 'Admin access required'));
    }

    if (!['approved', 'rejected'].includes(status)) {
      return next(errorHandler(400, 'Invalid status. Must be "approved" or "rejected"'));
    }

    if (status === 'rejected' && !rejectionReason) {
      return next(errorHandler(400, 'Rejection reason is required when rejecting a property'));
    }

    const property = await Property.findById(req.params.id)
      .populate('owner.userId', 'fullName email')
      .populate('postedBy', 'fullName email');

    if (!property) {
      return next(errorHandler(404, 'Property not found'));
    }

    // Update property status
    const updateData = {
      'basicInfo.status': status,
      verificationStatus: status,
      isVerified: status === 'approved',
      'moderation.moderatedBy': req.user.id,
      'moderation.moderatedAt': new Date(),
      verifiedBy: req.user.id,
      verifiedAt: status === 'approved' ? new Date() : undefined
    };

    if (status === 'rejected') {
      updateData['moderation.rejectionReason'] = rejectionReason;
      updateData.rejectionReason = rejectionReason;
    } else {
      // Clear any previous rejection reason
      updateData['moderation.rejectionReason'] = undefined;
      updateData.rejectionReason = undefined;
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    // Send notification email to property owner
    const ownerEmail = property.owner?.userId?.email || property.postedBy?.email;
    const propertyTitle = property.basicInfo?.title || property.title;
    
    if (ownerEmail && propertyTitle) {
      await sendPropertyApprovalEmail(
        ownerEmail,
        propertyTitle,
        status,
        rejectionReason
      );
    }

    // Create notification for property owner
    await createUserNotification({
      userEmail: ownerEmail,
      type: status === 'approved' ? 'property_approved' : 'property_rejected',
      title: `Property ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: status === 'approved' 
        ? `Your property "${propertyTitle}" has been approved and is now live!`
        : `Your property "${propertyTitle}" was rejected. Reason: ${rejectionReason}`,
      data: { propertyId: req.params.id, status }
    });

    res.status(200).json({
      success: true,
      message: `Property ${status} successfully`,
      property: updatedProperty
    });
  } catch (error) {
    console.error("Moderate property error:", error);
    next(error);
  }
};

// Helper functions for approveListing and rejectListing
export const approveListing = async (req, res, next) => {
  req.body = {
    status: 'approved'
  };
  return moderateProperty(req, res, next);
};

export const rejectListing = async (req, res, next) => {
  const { rejectionReason } = req.body;
  
  if (!rejectionReason) {
    return next(errorHandler(400, 'Rejection reason is required'));
  }
  
  req.body = {
    status: 'rejected',
    rejectionReason
  };
  
  return moderateProperty(req, res, next);
};

// Get Property Statistics (Admin)
export const getPropertyStats = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return next(errorHandler(403, 'Admin access required'));
    }

    const [totalProperties, approvedProperties, pendingProperties, rejectedProperties, totalViews] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({
        $or: [
          { 'basicInfo.status': 'approved' },
          { verificationStatus: 'approved' }
        ]
      }),
      Property.countDocuments({
        $or: [
          { 'basicInfo.status': 'pending' },
          { verificationStatus: 'pending' }
        ]
      }),
      Property.countDocuments({
        $or: [
          { 'basicInfo.status': 'rejected' },
          { verificationStatus: 'rejected' }
        ]
      }),
      Property.aggregate([
        { 
          $group: { 
            _id: null, 
            totalViews: { 
              $sum: { 
                $ifNull: [
                  "$performance.views", 
                  { $ifNull: ["$views", 0] }
                ]
              }
            }
          }
        }
      ])
    ]);

    const avgPrice = await Property.aggregate([
      {
        $match: {
          $or: [
            { 'basicInfo.status': 'approved' },
            { verificationStatus: 'approved' }
          ]
        }
      },
      {
        $group: {
          _id: null,
          avgPrice: {
            $avg: {
              $ifNull: [
                "$pricing.rent.monthly",
                { $ifNull: ["$rentPrice", 0] }
              ]
            }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalProperties,
        approvedProperties,
        pendingProperties,
        rejectedProperties,
        totalViews: totalViews[0]?.totalViews || 0,
        averagePrice: Math.round(avgPrice[0]?.avgPrice || 0)
      }
    });
  } catch (error) {
    console.error("Get property stats error:", error);
    next(error);
  }
};

// Search Properties with Advanced Filters
export const searchProperties = async (req, res, next) => {
  try {
    const {
      q: searchTerm,
      location,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      amenities,
      sortBy = 'relevance',
      page = 1,
      limit = 12
    } = req.query;

    // Build search query
    const searchQuery = {
      $or: [
        { 'basicInfo.status': 'approved' },
        { verificationStatus: 'approved' }
      ],
      $and: [
        {
          $or: [
            { 'availability.isAvailable': true },
            { isAvailable: true }
          ]
        }
      ]
    };

    // Text search
    if (searchTerm) {
      searchQuery.$and.push({
        $or: [
          { 'basicInfo.title': { $regex: searchTerm, $options: 'i' } },
          { title: { $regex: searchTerm, $options: 'i' } },
          { 'basicInfo.description': { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { 'location.address.area': { $regex: searchTerm, $options: 'i' } },
          { 'location.address.district': { $regex: searchTerm, $options: 'i' } }
        ]
      });
    }

    // Location filter
    if (location) {
      searchQuery.$and.push({
        $or: [
          { 'location.address.area': { $regex: location, $options: 'i' } },
          { 'location.address.district': { $regex: location, $options: 'i' } }
        ]
      });
    }

    // Property type filter
    if (propertyType && propertyType !== 'all') {
      searchQuery.$and.push({
        $or: [
          { 'basicInfo.propertyType': propertyType.toLowerCase() },
          { apartmentType: { $regex: propertyType, $options: 'i' } }
        ]
      });
    }

    // Price range filter
    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = parseInt(minPrice);
      if (maxPrice) priceFilter.$lte = parseInt(maxPrice);
      
      searchQuery.$and.push({
        $or: [
          { 'pricing.rent.monthly': priceFilter },
          { rentPrice: priceFilter }
        ]
      });
    }

    // Room filters
    if (bedrooms) {
      searchQuery.$and.push({
        $or: [
          { 'details.bedrooms': { $gte: parseInt(bedrooms) } },
          { bedrooms: { $gte: parseInt(bedrooms) } }
        ]
      });
    }

    if (bathrooms) {
      searchQuery.$and.push({
        $or: [
          { 'details.bathrooms': { $gte: parseInt(bathrooms) } },
          { bathrooms: { $gte: parseInt(bathrooms) } }
        ]
      });
    }

    // Amenities filter
    if (amenities) {
      const amenityList = amenities.split(',');
      const amenityFilters = [];

      amenityList.forEach(amenity => {
        switch (amenity.toLowerCase()) {
          case 'lift':
          case 'elevator':
            amenityFilters.push({ 'amenities.building.elevator': true });
            amenityFilters.push({ hasLift: true });
            break;
          case 'parking':
            amenityFilters.push({ 'amenities.building.parking': true });
            amenityFilters.push({ hasParking: true });
            break;
          case 'wifi':
            amenityFilters.push({ 'amenities.unit.wifi': true });
            amenityFilters.push({ hasWifi: true });
            break;
          case 'furnished':
            amenityFilters.push({ 'details.furnishing': { $ne: 'unfurnished' } });
            amenityFilters.push({ isFurnished: true });
            break;
        }
      });

      if (amenityFilters.length > 0) {
        searchQuery.$and.push({ $or: amenityFilters });
      }
    }

    // Sorting
    let sortOptions = {};
    switch (sortBy) {
      case 'price-low':
        sortOptions = { 'pricing.rent.monthly': 1, rentPrice: 1 };
        break;
      case 'price-high':
        sortOptions = { 'pricing.rent.monthly': -1, rentPrice: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'popular':
        sortOptions = { 'performance.views': -1, views: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute search
    const [properties, total] = await Promise.all([
      Property.find(searchQuery)
        .populate('owner.userId', 'fullName email mobileNumber')
        .populate('postedBy', 'fullName email mobileNumber')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Property.countDocuments(searchQuery)
    ]);

    res.status(200).json({
      success: true,
      results: {
        properties,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
          hasPrev: parseInt(page) > 1
        },
        searchQuery: {
          searchTerm,
          location,
          propertyType,
          filters: { minPrice, maxPrice, bedrooms, bathrooms, amenities }
        }
      }
    });
  } catch (error) {
    console.error("Search properties error:", error);
    next(error);
  }
};

// Helper function to create admin notification
async function createAdminNotification(notificationData) {
  try {
    // Import Notification model dynamically to avoid circular imports
    const { default: Notification } = await import('../models/Notification.js');
    
    const notification = new Notification({
      userEmail: process.env.ADMIN_EMAIL,
      ...notificationData,
      createdAt: new Date()
    });
    
    await notification.save();
  } catch (error) {
    console.error('Error creating admin notification:', error);
  }
}

// Helper function to create user notification
async function createUserNotification(notificationData) {
  try {
    const { default: Notification } = await import('../models/Notification.js');
    
    const notification = new Notification({
      ...notificationData,
      createdAt: new Date()
    });
    
    await notification.save();
  } catch (error) {
    console.error('Error creating user notification:', error);
  }
}

// Legacy compatibility exports
export const createListing = createProperty;
export const getListings = getAllProperties;
export const getListing = getPropertyById;
export const updateListing = updateProperty;
export const deleteListing = deleteProperty;
