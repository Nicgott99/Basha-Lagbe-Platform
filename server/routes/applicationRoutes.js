import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Ensure upload directory exists
const uploadBase = path.join(process.cwd(), 'uploads', 'applications');
try { fs.mkdirSync(uploadBase, { recursive: true }); } catch {}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadBase),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only images and PDFs allowed'), false);
  }
});

// Get user's applications
router.get('/my', verifyToken, async (req, res) => {
  try {
    const applications = await Application.find({ applicantEmail: req.user.email })
      .populate('propertyId')
      .sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Submit application
router.post('/submit', verifyToken, upload.fields([
  { name: 'idCard', maxCount: 1 },
  { name: 'incomeProof', maxCount: 1 },
  { name: 'bankStatement', maxCount: 1 },
  { name: 'employmentLetter', maxCount: 1 }
]), async (req, res) => {
  try {
    const applicationData = JSON.parse(req.body.applicationData);
    const documents = {};
    if (req.files) {
      Object.keys(req.files).forEach(key => {
  const savedPath = req.files[key][0].path.replace(/\\/g, '/');
  documents[key] = savedPath.startsWith('uploads') ? savedPath : `uploads/applications/${path.basename(savedPath)}`;
      });
    }
    const application = new Application({
      ...applicationData,
      applicantEmail: req.user.email,
      documents
    });
    await application.save();
    await application.populate('propertyId');

    // notify landlord
    try {
      await new Notification({
        userEmail: applicationData.landlordEmail,
        type: 'application_received',
        title: 'New Rental Application',
        message: `You have received a new application for ${application.propertyId?.title || 'a property'}`,
        data: { applicationId: application._id }
      }).save();
    } catch {}

    res.json({ success: true, message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get applications for landlord
router.get('/received', verifyToken, async (req, res) => {
  try {
    const applications = await Application.find({ landlordEmail: req.user.email })
      .populate('propertyId')
      .sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update application status
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, landlordEmail: req.user.email },
      { status, landlordNotes: notes, reviewedAt: new Date(), reviewedBy: req.user.email },
      { new: true }
    ).populate('propertyId');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    try {
      await new Notification({
        userEmail: application.applicantEmail,
        type: 'application_status',
        title: `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `Your application for ${application.propertyId?.title || 'the property'} has been ${status}`,
        data: { applicationId: application._id, status }
      }).save();
    } catch {}

    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;