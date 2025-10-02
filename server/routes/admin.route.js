import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import User from '../models/User.js';
import Property from '../models/property.js';
import { errorHandler } from '../utils/error.js';

const router = express.Router();

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  // Check both role and accountType for backward compatibility
  const isAdmin = req.user.role === 'admin' || req.user.accountType === 'admin';
  if (!isAdmin) {
    return next(errorHandler(403, 'Admin access required'));
  }
  next();
};

// Get admin dashboard stats
router.get('/stats', verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ 
      accountType: { $in: ['tenant', 'landlord', 'agent'] }
    });
    const totalProperties = await Property.countDocuments();
    const totalAdmins = await User.countDocuments({ accountType: 'admin' });
    
    // Recent users (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({ 
      accountType: { $in: ['tenant', 'landlord', 'agent'] },
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Recent properties (last 30 days)
    const recentProperties = await Property.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProperties,
        totalAdmins,
        recentUsers,
        recentProperties,
        activeUsers: totalUsers, // Simplified for now
        totalRevenue: 0, // Placeholder
        monthlyGrowth: {
          users: recentUsers,
          properties: recentProperties
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get all users
router.get('/users', verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({ 
      accountType: { $in: ['tenant', 'landlord', 'agent'] }
    })
      .select('-password -passwordResetToken -passwordResetExpires')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments({ 
      accountType: { $in: ['tenant', 'landlord', 'agent'] }
    });

    res.status(200).json({
      success: true,
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNext: page < Math.ceil(totalUsers / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get all properties
router.get('/properties', verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const properties = await Property.find()
      .populate('owner.userId', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProperties = await Property.countDocuments();

    res.status(200).json({
      success: true,
      properties,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProperties / limit),
        totalProperties,
        hasNext: page < Math.ceil(totalProperties / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get pending properties (for moderation)
router.get('/properties/pending', verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const pendingProperties = await Property.find({ 
      verificationStatus: 'pending' 
    })
      .populate('owner.userId', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      properties: pendingProperties,
      count: pendingProperties.length
    });
  } catch (error) {
    next(error);
  }
});

// Update user status (activate/deactivate)
router.patch('/users/:id/status', verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password -passwordResetToken -passwordResetExpires');

    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    next(error);
  }
});

// Delete user
router.delete('/users/:id', verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    // Also delete user's properties using owner.userId
    await Property.deleteMany({ 'owner.userId': req.params.id });

    res.status(200).json({
      success: true,
      message: 'User and associated data deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Moderate property (approve/reject)
router.post('/properties/:id/moderate', verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const { action, rejectionReason } = req.body; // action: 'approve' or 'reject'
    
    if (!['approve', 'reject'].includes(action)) {
      return next(errorHandler(400, 'Invalid action. Must be "approve" or "reject"'));
    }

    const updateData = {
      verificationStatus: action === 'approve' ? 'approved' : 'rejected',
      isVerified: action === 'approve',
      verifiedBy: req.user.id,
      verifiedAt: new Date(),
      ...(action === 'reject' && rejectionReason && { rejectionReason })
    };

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('owner.userId', 'fullName email');

    if (!property) {
      return next(errorHandler(404, 'Property not found'));
    }

    res.status(200).json({
      success: true,
      message: `Property ${action}d successfully`,
      property
    });
  } catch (error) {
    next(error);
  }
});

export default router;