import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: false, // Optional: messages can be property-specific or general
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    attachments: [
      {
        type: String, // URLs to uploaded files
      },
    ],
    messageType: {
      type: String,
      enum: ['text', 'inquiry', 'application', 'system'],
      default: 'text',
    },
    metadata: {
      editedAt: Date,
      deletedAt: Date,
      isEdited: { type: Boolean, default: false },
      isDeleted: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Compound indexes for efficient queries
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, isRead: 1 });
messageSchema.index({ property: 1, createdAt: -1 });

// Virtual for conversation partner
messageSchema.virtual('conversationWith').get(function () {
  return this.sender.equals(this.receiver) ? null : this.receiver;
});

// Method to mark message as read
messageSchema.methods.markAsRead = function () {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Static method to get conversation between two users
messageSchema.statics.getConversation = async function (user1Id, user2Id, options = {}) {
  const { page = 1, limit = 50, propertyId = null } = options;
  
  const query = {
    $or: [
      { sender: user1Id, receiver: user2Id },
      { sender: user2Id, receiver: user1Id },
    ],
    'metadata.isDeleted': false,
  };

  if (propertyId) {
    query.property = propertyId;
  }

  const messages = await this.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('sender', 'fullName email profilePicture')
    .populate('receiver', 'fullName email profilePicture')
    .populate('property', 'title location.address images.primary');

  const total = await this.countDocuments(query);

  return {
    messages: messages.reverse(), // Reverse to show oldest first
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Static method to get all conversations for a user
messageSchema.statics.getUserConversations = async function (userId) {
  const conversations = await this.aggregate([
    {
      $match: {
        $or: [{ sender: new mongoose.Types.ObjectId(userId) }, { receiver: new mongoose.Types.ObjectId(userId) }],
        'metadata.isDeleted': false,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ['$sender', new mongoose.Types.ObjectId(userId)] },
            '$receiver',
            '$sender',
          ],
        },
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$receiver', new mongoose.Types.ObjectId(userId)] },
                  { $eq: ['$isRead', false] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'conversationWith',
      },
    },
    {
      $unwind: '$conversationWith',
    },
    {
      $project: {
        _id: 1,
        lastMessage: 1,
        unreadCount: 1,
        'conversationWith._id': 1,
        'conversationWith.fullName': 1,
        'conversationWith.email': 1,
        'conversationWith.profilePicture': 1,
      },
    },
    {
      $sort: { 'lastMessage.createdAt': -1 },
    },
  ]);

  return conversations;
};

// Static method to mark all messages as read in a conversation
messageSchema.statics.markConversationAsRead = async function (userId, otherUserId) {
  return this.updateMany(
    {
      sender: otherUserId,
      receiver: userId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    }
  );
};

// Pre-save hook to validate sender and receiver are different
messageSchema.pre('save', function (next) {
  if (this.sender.equals(this.receiver)) {
    next(new Error('Sender and receiver cannot be the same user'));
  }
  next();
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
