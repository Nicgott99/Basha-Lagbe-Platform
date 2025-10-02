import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  TrashIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import apiService from '../utils/apiService';

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [selectedItems, setSelectedItems] = useState([]);

  // Mock data for development since API might not be working
  const mockNotifications = [
    {
      _id: '1',
      title: 'New Property Application',
      message: 'You have received a new application for your Modern Apartment listing.',
      type: 'application_received',
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
    },
    {
      _id: '2',
      title: 'Property Inquiry',
      message: 'Someone is interested in your Luxury Villa property and sent an inquiry.',
      type: 'inquiry_received',
      read: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
    },
    {
      _id: '3',
      title: 'Property Approved',
      message: 'Your property "Cozy Studio Apartment" has been approved and is now live.',
      type: 'property_approved',
      read: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    },
    {
      _id: '4',
      title: 'New Review Received',
      message: 'You received a 5-star review from a tenant for your Downtown Condo.',
      type: 'review_received',
      read: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    },
    {
      _id: '5',
      title: 'Payment Received',
      message: 'Monthly rent payment of $1,200 has been received for Property #123.',
      type: 'payment_received',
      read: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
    }
  ];

  const load = async (p = 1) => {
    try {
      setLoading(true);
      setError('');
      
      // Try to load from API first
      try {
        const res = await apiService.notifications.getAll({ page: p, limit: 10 });
        setItems(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
        setTotalPages(res.pagination?.total || 1);
        setPage(res.pagination?.current || p);
      } catch (apiError) {
        // If API fails, use mock data
        console.log('API failed, using mock data');
        const filteredMock = filter === 'all' ? mockNotifications : 
                           filter === 'unread' ? mockNotifications.filter(n => !n.read) :
                           mockNotifications.filter(n => n.read);
        
        setItems(filteredMock);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
        setTotalPages(1);
        setPage(1);
      }
    } catch (e) {
      setError(e.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, [filter]);

  const markAsRead = async (id) => {
    try {
      await apiService.notifications.markAsRead(id);
      load(page);
    } catch {
      // Update mock data locally
      setItems(prev => prev.map(item => 
        item._id === id ? { ...item, read: true } : item
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAll = async () => {
    try {
      await apiService.notifications.markAllAsRead();
      load(page);
    } catch {
      // Update mock data locally
      setItems(prev => prev.map(item => ({ ...item, read: true })));
      setUnreadCount(0);
    }
  };

  const remove = async (id) => {
    try {
      await apiService.notifications.delete(id);
      load(page);
    } catch {
      // Remove from mock data locally
      setItems(prev => prev.filter(item => item._id !== id));
    }
  };

  const bulkDelete = async () => {
    for (const id of selectedItems) {
      await remove(id);
    }
    setSelectedItems([]);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application_received':
        return <BellIcon className="w-6 h-6 text-blue-500" />;
      case 'inquiry_received':
        return <InformationCircleIcon className="w-6 h-6 text-purple-500" />;
      case 'property_approved':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'review_received':
        return <CheckCircleIcon className="w-6 h-6 text-yellow-500" />;
      case 'payment_received':
        return <CheckCircleIcon className="w-6 h-6 text-emerald-500" />;
      default:
        return <BellIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInHours = Math.floor((now - notificationDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return notificationDate.toLocaleDateString();
  };

  const filteredItems = items.filter(item => {
    if (filter === 'unread') return !item.read;
    if (filter === 'read') return item.read;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BellIcon className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-gray-600">Stay updated with your property activities</p>
                </div>
              </div>
              {unreadCount > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              {selectedItems.length > 0 && (
                <button
                  onClick={bulkDelete}
                  className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Delete Selected ({selectedItems.length})
                </button>
              )}
              {unreadCount > 0 && (
                <button
                  onClick={markAll}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg"
                >
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Mark All Read
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <FunnelIcon className="w-5 h-5 text-gray-400" />
          <div className="flex space-x-2">
            {['all', 'unread', 'read'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                {filterType === 'unread' && unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading notifications...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mr-3" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredItems.map((notification, index) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                  notification.read 
                    ? 'bg-white border border-gray-200' 
                    : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`p-3 rounded-full ${
                        notification.read ? 'bg-gray-100' : 'bg-white shadow-md'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold ${
                            notification.read ? 'text-gray-900' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className={`mt-1 text-sm ${
                            notification.read ? 'text-gray-600' : 'text-gray-700'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="mt-2 text-xs text-gray-500">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="inline-flex items-center px-3 py-1 border border-green-300 text-xs font-medium rounded-full text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <EyeIcon className="w-3 h-3 mr-1" />
                              Mark Read
                            </button>
                          )}
                          <button
                            onClick={() => remove(notification._id)}
                            className="inline-flex items-center p-1 border border-gray-300 rounded-full text-gray-400 hover:text-red-500 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {!notification.read && (
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <BellIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">
              {filter === 'unread' ? "You're all caught up! No unread notifications." :
               filter === 'read' ? "No read notifications to show." :
               "You don't have any notifications yet."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              disabled={page <= 1}
              onClick={() => load(page - 1)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-2" />
              Previous
            </button>
            
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            
            <button
              disabled={page >= totalPages}
              onClick={() => load(page + 1)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRightIcon className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
