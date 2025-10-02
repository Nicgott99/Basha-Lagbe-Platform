import express from 'express';
import Property from '../models/property.js';
import User from '../models/user.model.js';
import Application from '../models/Application.js';

const router = express.Router();

// Matches user-provided contract (using app.get style but adapted to router)
router.get('/server/admin/real-stats', async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    // Support both legacy and new status fields
    const activeListings = await Property.countDocuments({ $or: [
      { verificationStatus: 'approved' },
      { 'basicInfo.status': 'approved' }
    ] });
    const totalUsers = await User.countDocuments();
    const completedTransactions = await Application.countDocuments({ status: 'accepted' });
    res.json({
      totalProperties: totalProperties || 0,
      activeListings: activeListings || 0,
      totalUsers: totalUsers || 0,
      completedTransactions: completedTransactions || 0
    });
  } catch (error) {
    res.json({
      totalProperties: 0,
      activeListings: 0,
      totalUsers: 0,
      completedTransactions: 0
    });
  }
});

export default router;