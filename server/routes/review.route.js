import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
  createReview,
  getPropertyReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  markReviewHelpful,
  getReviewStats
} from '../controllers/review.controller.js';

const router = express.Router();

// Create a new review
router.post('/create', verifyToken, createReview);

// Get all reviews for a property
router.get('/property/:propertyId', getPropertyReviews);

// Get user reviews
router.get('/user/:userId', verifyToken, getUserReviews);

// Update a review
router.put('/update/:id', verifyToken, updateReview);

// Delete a review
router.delete('/delete/:id', verifyToken, deleteReview);

// Mark a review as helpful
router.put('/helpful/:id', verifyToken, markReviewHelpful);

// Get review stats
router.get('/stats/:propertyId', getReviewStats);

// Get statistics for a property's reviews
router.get('/stats/:propertyId', getReviewStats);

// Get reviews by a specific user
router.get('/user/:userId', verifyToken, getUserReviews);

// Get reviews by current user
router.get('/my-reviews', verifyToken, getUserReviews);

// Update a review
router.put('/update/:reviewId', verifyToken, updateReview);

// Delete a review
router.delete('/:reviewId', verifyToken, deleteReview);

// Mark a review as helpful or remove the mark
router.post('/helpful/:reviewId', verifyToken, markReviewHelpful);

export default router;