import express from 'express';
import {
    createInquiry,
    getLandlordInquiries,
    getTenantInquiries,
    getInquiryDetails,
    replyToInquiry,
    updateInquiryStatus,
    archiveInquiry,
    getContactHistory
} from '../controllers/inquiryController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Create a new inquiry
router.post('/', verifyToken, createInquiry);
router.post('/submit', verifyToken, createInquiry);

// Get inquiries for landlord
router.get('/landlord', verifyToken, getLandlordInquiries);
router.get('/received', verifyToken, getLandlordInquiries);

// Get inquiries for tenant
router.get('/tenant', verifyToken, getTenantInquiries);

// Get user's own inquiries
router.get('/my', verifyToken, getTenantInquiries);

// Get inquiry details
router.get('/:id', verifyToken, getInquiryDetails);

// Reply to inquiry
router.post('/:id/reply', verifyToken, replyToInquiry);
router.post('/:id/respond', verifyToken, replyToInquiry);

// Update inquiry status
router.put('/:id/status', verifyToken, updateInquiryStatus);

// Archive inquiry
router.put('/:id/archive', verifyToken, archiveInquiry);

// Get contact history
router.get('/contact/:propertyId', verifyToken, getContactHistory);// Get single inquiry details
router.get('/:inquiryId', verifyToken, getInquiryDetails);

// Reply to an inquiry
router.post('/:inquiryId/reply', verifyToken, replyToInquiry);

// Update inquiry status
router.put('/:inquiryId/status', verifyToken, updateInquiryStatus);

// Archive inquiry
router.put('/:inquiryId/archive', verifyToken, archiveInquiry);

// Get contact history for a property
router.get('/property/:propertyId/history', verifyToken, getContactHistory);

export default router;