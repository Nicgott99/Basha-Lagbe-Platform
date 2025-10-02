import express from "express";
import { 
    createListing, 
    getListing, 
    getListings,
    getPendingListings,
    approveListing,
    rejectListing
} from "../controllers/listing.controller.js";
import { verifyToken, verifyAdmin } from "../utils/verifyUser.js";

const router = express.Router();

// User routes
router.post('/create', verifyToken, createListing);

// Public routes
router.get('/get/:id', getListing);
router.get('/get', getListings);
router.get('/all', getListings); // Add route for getting all listings
router.get('/search', getListings); // Add search route (uses same controller with query params)

// Admin routes
router.get('/admin/pending', verifyToken, verifyAdmin, getPendingListings);
router.post('/admin/approve/:id', verifyToken, verifyAdmin, approveListing);
router.post('/admin/reject/:id', verifyToken, verifyAdmin, rejectListing);

export default router;