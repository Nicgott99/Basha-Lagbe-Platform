import express from 'express';
import Message from '../models/Message.js';
import { verifyToken } from '../utils/verifyUser.js';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * @route   POST /server/messages/send
 * @desc    Send a message to another user
 * @access  Private
 */
router.post('/send', verifyToken, async (req, res, next) => {
  try {
    const { receiverId, content, propertyId, messageType, attachments } = req.body;

    // Validation
    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID is required',
      });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required',
      });
    }

    if (content.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot exceed 2000 characters',
      });
    }

    // Prevent sending message to self
    if (req.user.id === receiverId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send a message to yourself',
      });
    }

    // Create message
    const messageData = {
      sender: req.user.id,
      receiver: receiverId,
      content: content.trim(),
      messageType: messageType || 'text',
    };

    if (propertyId) {
      messageData.property = propertyId;
    }

    if (attachments && Array.isArray(attachments)) {
      messageData.attachments = attachments;
    }

    const message = await Message.create(messageData);

    // Populate sender and receiver details
    await message.populate('sender', 'fullName email profilePicture');
    await message.populate('receiver', 'fullName email profilePicture');
    
    if (propertyId) {
      await message.populate('property', 'title location.address images.primary');
    }

    // Create notification for receiver
    try {
      const Notification = mongoose.model('Notification');
      await Notification.create({
        user: receiverId,
        type: 'message',
        title: 'New Message',
        message: `You have a new message from ${req.user.fullName || req.user.email}`,
        relatedId: message._id,
        relatedModel: 'Message',
      });
    } catch (notifError) {
      console.log('Failed to create notification:', notifError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    next(error);
  }
});

/**
 * @route   GET /server/messages/conversation/:userId
 * @desc    Get conversation with a specific user
 * @access  Private
 */
router.get('/conversation/:userId', verifyToken, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50, propertyId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    const result = await Message.getConversation(req.user.id, userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      propertyId,
    });

    // Mark messages as read (from other user to current user)
    await Message.markConversationAsRead(req.user.id, userId);

    res.status(200).json({
      success: true,
      data: result.messages,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    next(error);
  }
});

/**
 * @route   GET /server/messages/conversations
 * @desc    Get all conversations for the current user
 * @access  Private
 */
router.get('/conversations', verifyToken, async (req, res, next) => {
  try {
    const conversations = await Message.getUserConversations(req.user.id);

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    next(error);
  }
});

/**
 * @route   PUT /server/messages/:id/read
 * @desc    Mark a specific message as read
 * @access  Private
 */
router.put('/:id/read', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message ID',
      });
    }

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Only receiver can mark as read
    if (message.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only mark messages sent to you as read',
      });
    }

    await message.markAsRead();

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: message,
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    next(error);
  }
});

/**
 * @route   PUT /server/messages/:id/edit
 * @desc    Edit a message (only sender can edit within 15 minutes)
 * @access  Private
 */
router.put('/:id/edit', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message ID',
      });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required',
      });
    }

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Only sender can edit
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own messages',
      });
    }

    // Check if message was sent within 15 minutes
    const fifteenMinutes = 15 * 60 * 1000;
    const messageAge = Date.now() - message.createdAt.getTime();
    
    if (messageAge > fifteenMinutes) {
      return res.status(403).json({
        success: false,
        message: 'Messages can only be edited within 15 minutes of sending',
      });
    }

    message.content = content.trim();
    message.metadata.isEdited = true;
    message.metadata.editedAt = new Date();
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Message updated successfully',
      data: message,
    });
  } catch (error) {
    console.error('Error editing message:', error);
    next(error);
  }
});

/**
 * @route   DELETE /server/messages/:id
 * @desc    Delete a message (soft delete)
 * @access  Private
 */
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message ID',
      });
    }

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Only sender can delete
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages',
      });
    }

    // Soft delete
    message.metadata.isDeleted = true;
    message.metadata.deletedAt = new Date();
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    next(error);
  }
});

/**
 * @route   GET /server/messages/unread/count
 * @desc    Get unread message count for current user
 * @access  Private
 */
router.get('/unread/count', verifyToken, async (req, res, next) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user.id,
      isRead: false,
      'metadata.isDeleted': false,
    });

    res.status(200).json({
      success: true,
      data: { count },
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    next(error);
  }
});

/**
 * @route   POST /server/messages/conversation/:userId/read-all
 * @desc    Mark all messages in a conversation as read
 * @access  Private
 */
router.post('/conversation/:userId/read-all', verifyToken, async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    const result = await Message.markConversationAsRead(req.user.id, userId);

    res.status(200).json({
      success: true,
      message: 'All messages marked as read',
      data: { modifiedCount: result.modifiedCount },
    });
  } catch (error) {
    console.error('Error marking all messages as read:', error);
    next(error);
  }
});

export default router;
