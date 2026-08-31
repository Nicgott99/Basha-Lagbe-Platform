import express from 'express';
import Property from '../models/property.js';
import User from '../models/user.model.js';
import Application from '../models/Application.js';
import { getOrSet } from '../utils/cacheHelper.js';

const router = express.Router();

// Cache key and TTL for site-wide stats
// Stats change only when new listings/users/applications are created — at most
// a few times per hour. 5-minute TTL gives fresh-enough data while reducing
// MongoDB load by ~95% on high-traffic periods.
const STATS_CACHE_KEY = 'admin:real-stats';
const STATS_TTL_SEC   = 5 * 60; // 5 minutes

// Matches user-provided contract (using app.get style but adapted to router)
router.get('/server/admin/real-stats', async (req, res) => {
  try {
    // getOrSet: serve from memory on cache hit (< 1ms), run queries on miss/expiry
    const data = await getOrSet(STATS_CACHE_KEY, async () => {
      const totalProperties        = await Property.countDocuments();
      // Support both legacy and new status fields
      const activeListings         = await Property.countDocuments({ $or: [
        { verificationStatus: 'approved' },
        { 'basicInfo.status': 'approved' }
      ] });
      const totalUsers             = await User.countDocuments();
      const completedTransactions  = await Application.countDocuments({ status: 'accepted' });
      return {
        totalProperties:       totalProperties       || 0,
        activeListings:        activeListings         || 0,
        totalUsers:            totalUsers             || 0,
        completedTransactions: completedTransactions  || 0,
      };
    }, STATS_TTL_SEC);

    res.json(data);
  } catch (error) {
    // Fallback to zeros — never let a DB error break the Home page
    res.json({
      totalProperties:       0,
      activeListings:        0,
      totalUsers:            0,
      completedTransactions: 0,
    });
  }
});

export default router;