import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import apiService from '../utils/apiService';

export default function AdminDashboard() {
  const [pendingListings, setPendingListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector(state => state.user);

  const fetchPendingListings = async () => {
    try {
      setLoading(true);
      // Use our centralized admin API
      const data = await apiService.admin.getPendingListings();
      
      if (data.success === false) {
        setError(data.message || 'Failed to fetch pending listings');
      } else {
        setPendingListings(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching pending listings:', error);
      setError('Failed to fetch pending listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingListings();
  }, []);

  const handleApprove = async (listingId) => {
    try {
      const response = await apiService.admin.approveListing(listingId);
      if (response.success === false) {
        setError(response.message);
      } else {
        // Remove the approved listing from pending list or refresh the list
        setPendingListings(prev => prev.filter(listing => listing._id !== listingId));
      }
    } catch (error) {
      console.error(`Error approving listing ${listingId}:`, error);
      setError('Failed to approve listing');
    }
  };

  const handleReject = async (listingId) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return; // User cancelled
    try {
      const response = await apiService.admin.rejectListing(listingId);
      if (response.success === false) {
        setError(response.message);
      } else {
        // Remove the rejected listing from pending list or refresh the list
        setPendingListings(prev => prev.filter(listing => listing._id !== listingId));
      }
    } catch (error) {
      console.error(`Error rejecting listing ${listingId}:`, error);
      setError('Failed to reject listing');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-7">Admin Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-4">Pending Property Approvals</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {pendingListings.length > 0 ? (
          pendingListings.map(listing => (
            <div key={listing._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{listing.name}</h3>
                <p className="text-gray-600">{listing.address}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleApprove(listing._id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Approve</button>
                <button onClick={() => handleReject(listing._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Reject</button>
              </div>
            </div>
          ))
        ) : (
          !loading && <p>No pending listings to review.</p>
        )}
      </div>
    </div>
  );
}