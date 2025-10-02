import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  inquirerEmail: {
    type: String,
    required: true
  },
  landlordEmail: {
    type: String,
    required: true
  },
  inquirerName: {
    type: String,
    required: true
  },
  inquirerPhone: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  inquiryType: {
    type: String,
    enum: ['viewing', 'question', 'application', 'general'],
    default: 'general'
  },
  preferredDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'responded', 'scheduled', 'completed', 'cancelled'],
    default: 'pending'
  },
  landlordResponse: {
    type: String
  },
  respondedAt: {
    type: Date
  }
}, {
  timestamps: true
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

export default Inquiry;
