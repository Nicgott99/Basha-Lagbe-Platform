import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({ rating: 0, comment: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/server/review/get');
      const data = await res.json();
      setReviews(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load reviews.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/server/review/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }
      fetchReviews(); // Refresh reviews list
      setFormData({ rating: 0, comment: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-7">What Our Users Say</h1>

      {currentUser && (
        <div className="my-10 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Leave a Review</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
              <input type="number" id="rating" min="1" max="5" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md" onChange={handleChange} value={formData.rating} />
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
              <textarea id="comment" rows="4" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md" onChange={handleChange} value={formData.comment}></textarea>
            </div>
            <button className="bg-blue-600 text-white p-3 rounded-lg uppercase hover:bg-blue-700">Submit Review</button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>
      )}

      <div className="space-y-6">
        {loading ? <p>Loading reviews...</p> : reviews.map(review => (
          <div key={review._id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center mb-2">
              <img src={review.userId.avatar} alt={review.userId.fullName} className="w-10 h-10 rounded-full mr-4" />
              <div>
                <p className="font-semibold">{review.userId.fullName}</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}