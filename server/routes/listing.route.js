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
import validatePagination from "../middleware/validatePagination.js";

const router = express.Router();

// User routes
router.post('/create', verifyToken, createListing);

// Public routes — validatePagination sanitises page/limit/sort before controllers
router.get('/get/:id', getListing);
router.get('/get',    validatePagination, getListings);
router.get('/all',    validatePagination, getListings);
router.get('/search', validatePagination, getListings);

// Admin routes
router.get('/admin/pending', verifyToken, verifyAdmin, getPendingListings);
router.post('/admin/approve/:id', verifyToken, verifyAdmin, approveListing);
router.post('/admin/reject/:id',  verifyToken, verifyAdmin, rejectListing);

export default router;