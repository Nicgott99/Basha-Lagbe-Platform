import mongoose from 'mongoose';

// Simplified Notification schema used by notifications and applications routes
const notificationSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: [
      'property_submitted',
      'property_approved',
      'property_rejected',
      'inquiry_received',
      'inquiry_responded',
      'application_received',
      'application_status',
      'system'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  }
}, {
  timestamps: true
});

notificationSchema.index({ userEmail: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
