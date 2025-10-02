import express from 'express';
import Notification from '../models/Notification.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Get user notifications
router.get('/my', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, unread } = req.query;
    const query = { userEmail: req.user.email };
    if (unread === 'true') query.read = false;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ userEmail: req.user.email, read: false });

    res.json({
      success: true,
      notifications,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / Number(limit)),
        hasMore: Number(page) * Number(limit) < total
      },
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userEmail: req.user.email },
      { read: true, readAt: new Date() },
      { new: true }
    );
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark all as read
router.put('/mark-all-read', verifyToken, async (req, res) => {
  try {
    await Notification.updateMany({ userEmail: req.user.email, read: false }, { read: true, readAt: new Date() });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete notification
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, userEmail: req.user.email });
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;