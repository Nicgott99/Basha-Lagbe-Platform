import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StarIcon,
  HandThumbUpIcon,
  FlagIcon,
  PencilIcon,
  TrashIcon,
  ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useToast } from '../hooks/useToast';

const ReviewCard = ({ review, onUpdate, onDelete, currentUserId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    rating: review.rating,
    comment: review.comment
  });
  const [isHelpful, setIsHelpful] = useState(
    review.helpful?.includes(currentUserId)
  );
  const [helpfulCount, setHelpfulCount] = useState(
    review.helpful?.length || 0
  );
  const { showToast } = useToast();

  const handleEdit = async () => {
    try {
      const response = await fetch(`/server/review/update/${review._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUserId.token}`
        },
        body: JSON.stringify(editData)
      });

      const data = await response.json();
      if (data.success) {
        onUpdate(data.review);
        setIsEditing(false);
        showToast('Review updated successfully', 'success');
      } else {
        showToast(data.message || 'Failed to update review', 'error');
      }
    } catch (error) {
      showToast('Network error. Please try again.', 'error');
    }
  };

  const handleMarkHelpful = async () => {
    try {
      const response = await fetch(`/server/review/helpful/${review._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUserId.token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setIsHelpful(data.userMarkedHelpful);
        setHelpfulCount(data.helpfulCount);
      } else {
        showToast(data.message || 'Failed to mark review', 'error');
      }
    } catch (error) {
      showToast('Network error. Please try again.', 'error');
    }
  };

  const renderStars = (rating, size = 'w-4 h-4') => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIconSolid
            key={star}
            className={`${size} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-start space-x-4">
        <img
          src={review.reviewer?.avatar || '/api/placeholder/40/40'}
          alt={review.reviewer?.fullName}
          className="w-12 h-12 rounded-full object-cover"
        />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">
                {review.reviewer?.fullName}
              </h4>
              <div className="flex items-center space-x-2">
                {renderStars(review.rating)}
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            {review.reviewer?._id === currentUserId && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(review._id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setEditData({...editData, rating: star})}
                      className="focus:outline-none"
                    >
                      <StarIconSolid
                        className={`w-6 h-6 ${
                          star <= editData.rating 
                            ? 'text-yellow-400' 
                            : 'text-gray-300 hover:text-yellow-300'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  value={editData.comment}
                  onChange={(e) => setEditData({...editData, comment: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Share your experience..."
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleEdit}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({ rating: review.rating, comment: review.comment });
                  }}
                  className="text-gray-600 hover:text-gray-800 px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-700 mb-4">{review.comment}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <button
                  onClick={handleMarkHelpful}
                  className={`flex items-center space-x-1 hover:text-blue-600 transition-colors ${
                    isHelpful ? 'text-blue-600' : ''
                  }`}
                >
                  <HandThumbUpIcon className="w-4 h-4" />
                  <span>Helpful ({helpfulCount})</span>
                </button>
                
                {review.reviewer?._id !== currentUserId && (
                  <button className="flex items-center space-x-1 hover:text-red-600 transition-colors">
                    <FlagIcon className="w-4 h-4" />
                    <span>Report</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ReviewForm = ({ propertyId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { currentUser } = useSelector(state => state.user);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      showToast('Please select a rating', 'error');
      return;
    }
    
    if (comment.length < 10) {
      showToast('Comment must be at least 10 characters long', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/server/review/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
          propertyId,
          rating,
          comment
        })
      });

      const data = await response.json();
      if (data.success) {
        onReviewAdded(data.review);
        setRating(0);
        setComment('');
        showToast('Review added successfully', 'success');
      } else {
        showToast(data.message || 'Failed to add review', 'error');
      }
    } catch (error) {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <ChatBubbleLeftEllipsisIcon className="w-5 h-5 mr-2 text-blue-600" />
        Write a Review
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <StarIconSolid
                  className={`w-8 h-8 ${
                    star <= rating 
                      ? 'text-yellow-400' 
                      : 'text-gray-300 hover:text-yellow-300'
                  } transition-colors`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-gray-600">
                ({rating} star{rating !== 1 ? 's' : ''})
              </span>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            placeholder="Share your experience with this property..."
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 transition-colors"
        >
          {submitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Submitting...
            </div>
          ) : (
            'Submit Review'
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default function ReviewSection({ propertyId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector(state => state.user);
  const { showToast } = useToast();
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    }
  });
  
  useEffect(() => {
    fetchReviews();
  }, [propertyId]);
  
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/server/review/${propertyId}`);
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.reviews);
        
        // Calculate stats
        if (data.reviews.length > 0) {
          const total = data.reviews.length;
          const sum = data.reviews.reduce((acc, review) => acc + review.rating, 0);
          const average = Math.round((sum / total) * 10) / 10;
          
          const distribution = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
          };
          
          data.reviews.forEach(review => {
            distribution[review.rating]++;
          });
          
          setStats({
            average,
            total,
            distribution
          });
        }
      } else {
        setError('Failed to load reviews');
      }
    } catch (error) {
      setError('Network error when loading reviews');
    } finally {
      setLoading(false);
    }
  };
  
  const handleReviewAdded = (newReview) => {
    setReviews(prevReviews => {
      // Check if user already has a review for this property
      const existingReviewIndex = prevReviews.findIndex(
        review => review.reviewer?._id === currentUser._id
      );
      
      if (existingReviewIndex !== -1) {
        // Update existing review
        const updatedReviews = [...prevReviews];
        updatedReviews[existingReviewIndex] = newReview;
        return updatedReviews;
      }
      
      // Add new review to the beginning
      return [newReview, ...prevReviews];
    });
    
    // Update stats
    setStats(prevStats => {
      const newTotal = prevStats.total + 1;
      const newSum = prevStats.average * prevStats.total + newReview.rating;
      const newAverage = Math.round((newSum / newTotal) * 10) / 10;
      
      const newDistribution = {...prevStats.distribution};
      newDistribution[newReview.rating]++;
      
      return {
        average: newAverage,
        total: newTotal,
        distribution: newDistribution
      };
    });
  };
  
  const handleReviewUpdated = (updatedReview) => {
    setReviews(prevReviews => {
      return prevReviews.map(review =>
        review._id === updatedReview._id ? updatedReview : review
      );
    });
    
    // Recalculate stats
    const total = reviews.length;
    const sum = reviews.reduce(
      (acc, review) => acc + (review._id === updatedReview._id ? updatedReview.rating : review.rating),
      0
    );
    const average = Math.round((sum / total) * 10) / 10;
    
    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };
    
    reviews.forEach(review => {
      if (review._id === updatedReview._id) {
        distribution[updatedReview.rating]++;
      } else {
        distribution[review.rating]++;
      }
    });
    
    setStats({
      average,
      total,
      distribution
    });
  };
  
  const handleReviewDeleted = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const response = await fetch(`/server/review/${reviewId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        
        const data = await response.json();
        if (data.success) {
          // Find the deleted review to update stats
          const deletedReview = reviews.find(review => review._id === reviewId);
          
          // Remove the review from state
          setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));
          
          // Update stats
          if (deletedReview) {
            setStats(prevStats => {
              const newTotal = prevStats.total - 1;
              
              if (newTotal === 0) {
                return {
                  average: 0,
                  total: 0,
                  distribution: {
                    5: 0,
                    4: 0,
                    3: 0,
                    2: 0,
                    1: 0
                  }
                };
              }
              
              const newSum = prevStats.average * prevStats.total - deletedReview.rating;
              const newAverage = Math.round((newSum / newTotal) * 10) / 10;
              
              const newDistribution = {...prevStats.distribution};
              newDistribution[deletedReview.rating]--;
              
              return {
                average: newAverage,
                total: newTotal,
                distribution: newDistribution
              };
            });
          }
          
          showToast('Review deleted successfully', 'success');
        } else {
          showToast(data.message || 'Failed to delete review', 'error');
        }
      } catch (error) {
        showToast('Network error. Please try again.', 'error');
      }
    }
  };
  
  const renderRatingBar = (rating, count, total) => {
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    
    return (
      <div key={rating} className="flex items-center space-x-2 mb-1">
        <div className="flex items-center w-16">
          <span className="text-sm text-gray-700 font-medium">{rating} Star</span>
        </div>
        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-yellow-400 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="w-12 text-right">
          <span className="text-sm text-gray-600">{percentage}%</span>
        </div>
      </div>
    );
  };
  
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Ratings</h2>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-4 rounded-xl mb-6">
          {error}
        </div>
      ) : (
        <div className="space-y-8">
          {stats.total > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="md:flex">
                <div className="md:w-1/3 mb-6 md:mb-0 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0 md:pr-6">
                  <div className="flex items-center mb-2">
                    <span className="text-5xl font-bold text-gray-900">{stats.average}</span>
                    <span className="text-2xl text-gray-500 ml-2">/5</span>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIconSolid
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(stats.average)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <p className="text-gray-500 text-sm">Based on {stats.total} review{stats.total !== 1 ? 's' : ''}</p>
                </div>
                
                <div className="md:w-2/3 md:pl-6">
                  <div className="space-y-1">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      renderRatingBar(rating, stats.distribution[rating], stats.total)
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentUser && (
            <ReviewForm
              propertyId={propertyId}
              onReviewAdded={handleReviewAdded}
            />
          )}
          
          {reviews.length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence>
                {reviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    currentUserId={currentUser?._id}
                    onUpdate={handleReviewUpdated}
                    onDelete={handleReviewDeleted}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
              <ChatBubbleLeftEllipsisIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600">Be the first to share your experience with this property!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}