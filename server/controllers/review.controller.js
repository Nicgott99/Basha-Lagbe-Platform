import Review from '../models/Review.js';
import Property from '../models/property.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

// Create Property Review
export const createReview = async (req, res, next) => {
  try {
    const { propertyId, rating, comment } = req.body;

    // Validate required fields
    if (!propertyId || !rating || !comment) {
      return next(errorHandler(400, 'Property ID, rating, and comment are required'));
    }

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return next(errorHandler(404, 'Property not found'));
    }

    // Check if user already reviewed this property
    const existingReview = await Review.findOne({
      propertyId,
      reviewer: req.user.id
    });

    if (existingReview) {
      return next(errorHandler(400, 'You have already reviewed this property'));
    }

    // Create review
    const review = new Review({
      propertyId,
      reviewer: req.user.id,
      rating: parseInt(rating),
      comment: comment.trim(),
      createdAt: new Date(),
      helpful: []
    });

    await review.save();
    
    // Populate reviewer info for the response
    const populatedReview = await Review.findById(review._id).populate('reviewer', 'fullName avatar');

    // Update property rating stats (if needed)
    // This would be implemented if the property model tracks ratings

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review: populatedReview
    });
  } catch (error) {
    next(error);
  }
};

// Get Property Reviews
export const getPropertyReviews = async (req, res, next) => {
  try {
    const propertyId = req.params.propertyId;

    // Validate property ID
    if (!propertyId) {
      return next(errorHandler(400, 'Property ID is required'));
    }

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return next(errorHandler(404, 'Property not found'));
    }

    // Get reviews for this property, sorted by most recent
    const reviews = await Review.find({ propertyId })
      .sort({ createdAt: -1 })
      .populate('reviewer', 'fullName avatar');

    res.status(200).json({
      success: true,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// Get User Reviews
export const getUserReviews = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.id;

    // Get reviews by this user, sorted by most recent
    const reviews = await Review.find({ reviewer: userId })
      .sort({ createdAt: -1 })
      .populate('propertyId', 'title location images');

    res.status(200).json({
      success: true,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// Update Review
export const updateReview = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    const { rating, comment } = req.body;

    // Validate required fields
    if (!rating && !comment) {
      return next(errorHandler(400, 'Rating or comment is required for update'));
    }

    // Find the review
    const review = await Review.findById(reviewId);

    if (!review) {
      return next(errorHandler(404, 'Review not found'));
    }

    // Check if the user owns this review
    if (review.reviewer.toString() !== req.user.id) {
      return next(errorHandler(403, 'You can only update your own reviews'));
    }

    // Update review fields
    if (rating) review.rating = parseInt(rating);
    if (comment) review.comment = comment.trim();
    
    // Update the review
    await review.save();
    
    // Populate reviewer info for the response
    const updatedReview = await Review.findById(review._id).populate('reviewer', 'fullName avatar');

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    next(error);
  }
};

// Delete Review
export const deleteReview = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;

    // Find the review
    const review = await Review.findById(reviewId);

    if (!review) {
      return next(errorHandler(404, 'Review not found'));
    }

    // Check if the user owns this review or is admin
    if (review.reviewer.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(errorHandler(403, 'You can only delete your own reviews'));
    }

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Mark Review as Helpful
export const markReviewHelpful = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;

    // Find the review
    const review = await Review.findById(reviewId);

    if (!review) {
      return next(errorHandler(404, 'Review not found'));
    }

    const userId = req.user.id;
    const helpfulIndex = review.helpful.indexOf(userId);
    let userMarkedHelpful = false;
    
    // Toggle helpful status
    if (helpfulIndex === -1) {
      // User hasn't marked as helpful yet
      review.helpful.push(userId);
      userMarkedHelpful = true;
    } else {
      // User already marked as helpful, remove the mark
      review.helpful.splice(helpfulIndex, 1);
      userMarkedHelpful = false;
    }

    await review.save();

    res.status(200).json({
      success: true,
      message: userMarkedHelpful ? 'Review marked as helpful' : 'Helpful mark removed',
      helpfulCount: review.helpful.length,
      userMarkedHelpful
    });
  } catch (error) {
    next(error);
  }
};

// Get Review Statistics for a Property
export const getReviewStats = async (req, res, next) => {
  try {
    const propertyId = req.params.propertyId;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return next(errorHandler(404, 'Property not found'));
    }

    // Get all reviews for this property
    const reviews = await Review.find({ propertyId });

    // Calculate statistics
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    // Calculate rating distribution
    const ratingDistribution = {
      5: reviews.filter(review => review.rating === 5).length,
      4: reviews.filter(review => review.rating === 4).length,
      3: reviews.filter(review => review.rating === 3).length,
      2: reviews.filter(review => review.rating === 2).length,
      1: reviews.filter(review => review.rating === 1).length
    };

    res.status(200).json({
      success: true,
      stats: {
        totalReviews,
        averageRating,
        ratingDistribution
      }
    });
  } catch (error) {
    next(error);
  }
};