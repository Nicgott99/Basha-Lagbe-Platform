import Inquiry from '../models/Inquiry.js';
import Property from '../models/property.js';
import User from '../models/user.model.js';
import { sendVerificationEmail } from '../utils/emailService.js';
import { errorHandler } from '../utils/error.js';

// Create a new inquiry
const createInquiry = async (req, res, next) => {
    try {
        const {
            listingId,
            landlordId,
            subject,
            message,
            contactMethod,
            phoneNumber,
            preferredTime,
            moveInDate,
            budgetRange,
            questions
        } = req.body;

        const inquirerId = req.user.id;

        // Validate required fields
        if (!listingId || !landlordId || !subject || !message) {
            return next(errorHandler(400, 'Missing required fields'));
        }

        // Check if listing exists
        const listing = await Property.findById(listingId);
        if (!listing) {
            return next(errorHandler(404, 'Property not found'));
        }

        // Check if landlord exists
        const landlord = await User.findById(landlordId);
        if (!landlord) {
            return next(errorHandler(404, 'Landlord not found'));
        }

        // Check for recent inquiries to prevent spam
        const recentInquiry = await Inquiry.findOne({
            listing: listingId,
            inquirer: inquirerId,
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
        });

        if (recentInquiry) {
            return next(errorHandler(429, 'You have already sent an inquiry for this property recently. Please wait before sending another.'));
        }

        // Create new inquiry
        const newInquiry = new Inquiry({
            listing: listingId,
            inquirer: inquirerId,
            landlord: landlordId,
            subject,
            message,
            contactMethod: contactMethod || 'email',
            phoneNumber,
            preferredTime,
            moveInDate,
            budgetRange,
            questions: questions || []
        });

        const savedInquiry = await newInquiry.save();

        // Populate the inquiry
        const populatedInquiry = await Inquiry.findById(savedInquiry._id)
            .populate('inquirer', 'username email avatar')
            .populate('landlord', 'username email avatar')
            .populate('listing', 'name address images regularPrice');

        // Send email notification to landlord
        try {
            // TODO: Implement inquiry notification email
            console.log('Inquiry notification would be sent to:', landlord.email);
        } catch (emailError) {
            console.error('Failed to send inquiry notification email:', emailError);
            // Don't fail the entire request if email sending fails
        }

        res.status(201).json({
            success: true,
            message: 'Inquiry sent successfully',
            inquiry: populatedInquiry
        });

    } catch (error) {
        next(error);
    }
};

// Get inquiries for a landlord
const getLandlordInquiries = async (req, res, next) => {
    try {
        const landlordId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const priority = req.query.priority;

        // Build query
        const query = { 
            landlord: landlordId,
            archived: false
        };

        if (status) {
            query.status = status;
        }

        if (priority) {
            query.priority = priority;
        }

        // Get inquiries with pagination
        const inquiries = await Inquiry.find(query)
            .populate('inquirer', 'username email avatar')
            .populate('listing', 'name address images regularPrice')
            .sort({ lastActivity: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        // Get total count
        const totalInquiries = await Inquiry.countDocuments(query);

        // Get statistics
        const stats = await Inquiry.getInquiryStats(landlordId);

        res.status(200).json({
            success: true,
            inquiries,
            stats,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalInquiries / limit),
                totalInquiries,
                hasNextPage: page < Math.ceil(totalInquiries / limit),
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        next(error);
    }
};

// Get inquiries for a tenant
const getTenantInquiries = async (req, res, next) => {
    try {
        const inquirerId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const inquiries = await Inquiry.find({ 
            inquirer: inquirerId,
            archived: false
        })
        .populate('landlord', 'username email avatar')
        .populate('listing', 'name address images regularPrice')
        .sort({ lastActivity: -1, createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

        const totalInquiries = await Inquiry.countDocuments({ 
            inquirer: inquirerId,
            archived: false
        });

        res.status(200).json({
            success: true,
            inquiries,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalInquiries / limit),
                totalInquiries
            }
        });

    } catch (error) {
        next(error);
    }
};

// Get single inquiry details
const getInquiryDetails = async (req, res, next) => {
    try {
        const { inquiryId } = req.params;
        const userId = req.user.id;

        const inquiry = await Inquiry.findById(inquiryId)
            .populate('inquirer', 'username email avatar phone')
            .populate('landlord', 'username email avatar phone')
            .populate('listing', 'name address images regularPrice')
            .populate('replies.sender', 'username avatar');

        if (!inquiry) {
            return next(errorHandler(404, 'Inquiry not found'));
        }

        // Check if user has permission to view this inquiry
        if (inquiry.inquirer._id.toString() !== userId && inquiry.landlord._id.toString() !== userId) {
            return next(errorHandler(403, 'You do not have permission to view this inquiry'));
        }

        // Mark as read if viewing as landlord
        if (inquiry.landlord._id.toString() === userId) {
            await inquiry.markAsRead(userId);
        }

        res.status(200).json({
            success: true,
            inquiry
        });

    } catch (error) {
        next(error);
    }
};

// Reply to an inquiry
const replyToInquiry = async (req, res, next) => {
    try {
        const { inquiryId } = req.params;
        const { message } = req.body;
        const userId = req.user.id;

        if (!message || !message.trim()) {
            return next(errorHandler(400, 'Reply message is required'));
        }

        const inquiry = await Inquiry.findById(inquiryId)
            .populate('inquirer', 'username email')
            .populate('landlord', 'username email')
            .populate('listing', 'name address');

        if (!inquiry) {
            return next(errorHandler(404, 'Inquiry not found'));
        }

        // Check if user has permission to reply
        const isInquirer = inquiry.inquirer._id.toString() === userId;
        const isLandlord = inquiry.landlord._id.toString() === userId;

        if (!isInquirer && !isLandlord) {
            return next(errorHandler(403, 'You do not have permission to reply to this inquiry'));
        }

        // Add reply
        await inquiry.addReply(userId, message.trim());

        // Send email notification to the other party
        try {
            const recipient = isInquirer ? inquiry.landlord : inquiry.inquirer;
            console.log('Reply notification would be sent to:', recipient.email);
        } catch (emailError) {
            console.error('Failed to send reply notification email:', emailError);
        }

        // Get updated inquiry
        const updatedInquiry = await Inquiry.findById(inquiryId)
            .populate('inquirer', 'username email avatar')
            .populate('landlord', 'username email avatar')
            .populate('listing', 'name address images regularPrice')
            .populate('replies.sender', 'username avatar');

        res.status(200).json({
            success: true,
            message: 'Reply sent successfully',
            inquiry: updatedInquiry
        });

    } catch (error) {
        next(error);
    }
};

// Update inquiry status
const updateInquiryStatus = async (req, res, next) => {
    try {
        const { inquiryId } = req.params;
        const { status, priority, notes } = req.body;
        const userId = req.user.id;

        const inquiry = await Inquiry.findById(inquiryId);
        if (!inquiry) {
            return next(errorHandler(404, 'Inquiry not found'));
        }

        // Only landlord can update status and priority
        if (inquiry.landlord.toString() !== userId) {
            return next(errorHandler(403, 'Only the landlord can update inquiry status'));
        }

        // Update fields
        if (status && ['pending', 'read', 'replied', 'archived'].includes(status)) {
            inquiry.status = status;
        }

        if (priority && ['low', 'normal', 'high', 'urgent'].includes(priority)) {
            inquiry.priority = priority;
        }

        if (notes) {
            inquiry.notes.push({
                author: userId,
                content: notes,
                private: true
            });
        }

        const updatedInquiry = await inquiry.save();

        res.status(200).json({
            success: true,
            message: 'Inquiry updated successfully',
            inquiry: updatedInquiry
        });

    } catch (error) {
        next(error);
    }
};

// Archive inquiry
const archiveInquiry = async (req, res, next) => {
    try {
        const { inquiryId } = req.params;
        const userId = req.user.id;

        const inquiry = await Inquiry.findById(inquiryId);
        if (!inquiry) {
            return next(errorHandler(404, 'Inquiry not found'));
        }

        // Check permission
        if (inquiry.inquirer.toString() !== userId && inquiry.landlord.toString() !== userId) {
            return next(errorHandler(403, 'You do not have permission to archive this inquiry'));
        }

        inquiry.archived = true;
        inquiry.archivedAt = new Date();
        await inquiry.save();

        res.status(200).json({
            success: true,
            message: 'Inquiry archived successfully'
        });

    } catch (error) {
        next(error);
    }
};

// Get contact history for a property
const getContactHistory = async (req, res, next) => {
    try {
        const { propertyId } = req.params;
        const userId = req.user.id;

        const inquiries = await Inquiry.find({
            listing: propertyId,
            inquirer: userId
        })
        .select('subject message createdAt status')
        .sort({ createdAt: -1 })
        .limit(5);

        res.status(200).json({
            success: true,
            inquiries
        });

    } catch (error) {
        next(error);
    }
};

export {
    createInquiry,
    getLandlordInquiries,
    getTenantInquiries,
    getInquiryDetails,
    replyToInquiry,
    updateInquiryStatus,
    archiveInquiry,
    getContactHistory
};