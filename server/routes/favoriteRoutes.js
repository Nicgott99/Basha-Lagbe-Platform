import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import User from '../models/user.model.js';
import Property from '../models/property.js';
import { errorHandler } from '../utils/error.js';

const router = express.Router();

// Add property to favorites
router.post('/add/:propertyId', verifyToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { propertyId } = req.params;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return next(errorHandler(404, 'Property not found'));
    }

    // Get user and check if already favorited
    const user = await User.findById(userId);
    if (!user.favorites) {
      user.favorites = [];
    }

    if (user.favorites.includes(propertyId)) {
      return res.status(400).json({
        success: false,
        message: 'Property already in favorites'
      });
    }

    // Add to user's favorites
    user.favorites.push(propertyId);
    await user.save();

    // Increment property favorites count
    if (!property.performance) {
      property.performance = {};
    }
    property.performance.favorites = (property.performance.favorites || 0) + 1;
    await property.save();

    res.status(200).json({
      success: true,
      message: 'Property added to favorites',
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Add to favorites error:', error);
    next(error);
  }
});

// Remove property from favorites
router.delete('/remove/:propertyId', verifyToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { propertyId } = req.params;

    // Get user
    const user = await User.findById(userId);
    if (!user.favorites || !user.favorites.includes(propertyId)) {
      return res.status(400).json({
        success: false,
        message: 'Property not in favorites'
      });
    }

    // Remove from user's favorites
    user.favorites = user.favorites.filter(id => id.toString() !== propertyId);
    await user.save();

    // Decrement property favorites count
    const property = await Property.findById(propertyId);
    if (property && property.performance && property.performance.favorites > 0) {
      property.performance.favorites -= 1;
      await property.save();
    }

    res.status(200).json({
      success: true,
      message: 'Property removed from favorites',
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    next(error);
  }
});

// Get user's favorite properties
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(userId);
    if (!user.favorites || user.favorites.length === 0) {
      return res.status(200).json({
        success: true,
        favorites: [],
        totalFavorites: 0,
        currentPage: page,
        totalPages: 0
      });
    }

    // Get favorite properties with pagination
    const favorites = await Property.find({
      _id: { $in: user.favorites },
      verificationStatus: 'approved' // Only show approved properties
    })
      .select('basicInfo location pricing features imageUrls createdAt performance')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalFavorites = user.favorites.length;
    const totalPages = Math.ceil(totalFavorites / limit);

    res.status(200).json({
      success: true,
      favorites,
      totalFavorites,
      currentPage: page,
      totalPages,
      hasMore: page < totalPages
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    next(error);
  }
});

// Check if property is favorited by user
router.get('/check/:propertyId', verifyToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { propertyId } = req.params;

    const user = await User.findById(userId);
    const isFavorited = user.favorites && user.favorites.includes(propertyId);

    res.status(200).json({
      success: true,
      isFavorited
    });
  } catch (error) {
    console.error('Check favorite error:', error);
    next(error);
  }
});

export default router;
