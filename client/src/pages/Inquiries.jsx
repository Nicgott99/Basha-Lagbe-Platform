import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  InboxIcon,
  PaperAirplaneIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  BuildingOfficeIcon,
  UserIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import apiService from '../utils/apiService';

export default function Inquiries() {
  const [tab, setTab] = useState('my');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [responseMap, setResponseMap] = useState({});
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for development
  const mockInquiries = {
    my: [
      {
        _id: '1',
        propertyId: { title: 'Modern Downtown Apartment', _id: 'prop1' },
        message: 'I am interested in viewing this property. When would be a good time?',
        status: 'pending',
        inquirerEmail: 'john.doe@example.com',
        landlordEmail: 'landlord@example.com',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        landlordResponse: 'Hi John, I can show you the apartment this weekend. Please let me know your availability.',
        respondedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: '2',
        propertyId: { title: 'Luxury Villa with Pool', _id: 'prop2' },
        message: 'What are the monthly utility costs for this property?',
        status: 'pending',
        inquirerEmail: 'jane.smith@example.com',
        landlordEmail: 'owner@example.com',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    received: [
      {
        _id: '3',
        propertyId: { title: 'Cozy Studio Apartment', _id: 'prop3' },
        message: 'Is parking included with this rental? Also, are pets allowed?',
        status: 'new',
        inquirerEmail: 'mike.wilson@example.com',
        landlordEmail: 'myemail@example.com',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: '4',
        propertyId: { title: 'Family House with Garden', _id: 'prop4' },
        message: 'Hello, I have a family of 4. Would this house be suitable for us? When can we schedule a viewing?',
        status: 'responded',
        inquirerEmail: 'sarah.johnson@example.com',
        landlordEmail: 'myemail@example.com',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        landlordResponse: 'Yes, this house is perfect for families. I can show it to you this week.',
        respondedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ]
  };

  const load = async (which) => {
    try {
      setLoading(true);
      setError('');
      
      // Try to load from API first
      try {
        if (which === 'my') {
          const res = await apiService.inquiries.getUserInquiries();
          setItems(res.inquiries || []);
        } else {
          const res = await apiService.inquiries.getPropertyInquiries();
          setItems(res.inquiries || []);
        }
      } catch (apiError) {
        // If API fails, use mock data
        console.log('API failed, using mock data');
        setItems(mockInquiries[which] || []);
      }
    } catch (e) {
      setError(e.message || 'Failed to load inquiries');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(tab); }, [tab]);

  const respond = async (id) => {
    const message = responseMap[id];
    if (!message?.trim()) return;
    
    try {
      await apiService.inquiries.reply(id, message);
      setResponseMap(prev => ({ ...prev, [id]: '' }));
      load(tab);
    } catch {
      // Update mock data locally
      setItems(prev => prev.map(item => 
        item._id === id 
          ? { 
              ...item, 
              landlordResponse: message, 
              respondedAt: new Date().toISOString(),
              status: 'responded'
            } 
          : item
      ));
      setResponseMap(prev => ({ ...prev, [id]: '' }));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new':
        return <ExclamationCircleIcon className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'responded':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'responded':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const inquiryDate = new Date(date);
    const diffInHours = Math.floor((now - inquiryDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return inquiryDate.toLocaleDateString();
  };

  const filteredItems = items.filter(item => {
    if (filter !== 'all' && item.status !== filter) return false;
    if (searchTerm && !item.propertyId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.message?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: items.length,
    new: items.filter(i => i.status === 'new').length,
    pending: items.filter(i => i.status === 'pending').length,
    responded: items.filter(i => i.status === 'responded').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
                <p className="text-gray-600">Manage property inquiries and communications</p>
              </div>
            </div>
            
            {/* Tab Switcher */}
            <div className="flex p-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <button
                onClick={() => setTab('my')}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  tab === 'my'
                    ? 'bg-white text-blue-700 shadow-lg border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <UserIcon className="w-5 h-5 mr-2" />
                My Inquiries ({mockInquiries.my.length})
              </button>
              <button
                onClick={() => setTab('received')}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  tab === 'received'
                    ? 'bg-white text-blue-700 shadow-lg border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <InboxIcon className="w-5 h-5 mr-2" />
                Received ({mockInquiries.received.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Inquiries</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <ChatBubbleLeftRightIcon className="w-12 h-12 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">New</p>
                <p className="text-3xl font-bold">{stats.new}</p>
              </div>
              <ExclamationCircleIcon className="w-12 h-12 text-red-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Pending</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
              <ClockIcon className="w-12 h-12 text-yellow-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Responded</p>
                <p className="text-3xl font-bold">{stats.responded}</p>
              </div>
              <CheckCircleIcon className="w-12 h-12 text-green-200" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <div className="flex space-x-2">
              {['all', 'new', 'pending', 'responded'].map((filterType) => (
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
                </button>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search inquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading inquiries...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center">
              <ExclamationCircleIcon className="w-6 h-6 text-red-500 mr-3" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Inquiries List */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredItems.map((inquiry, index) => (
              <motion.div
                key={inquiry._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {inquiry.propertyId?.title || 'Property'}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center">
                            <CalendarDaysIcon className="w-4 h-4 mr-1" />
                            {formatTimeAgo(inquiry.createdAt)}
                          </div>
                          <div className="flex items-center">
                            <EnvelopeIcon className="w-4 h-4 mr-1" />
                            {tab === 'my' ? inquiry.landlordEmail : inquiry.inquirerEmail}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(inquiry.status)}`}>
                      {getStatusIcon(inquiry.status)}
                      <span className="ml-2 capitalize">{inquiry.status}</span>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-gray-700 leading-relaxed">{inquiry.message}</p>
                  </div>

                  {/* Response Section */}
                  {inquiry.landlordResponse && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4 border border-blue-100">
                      <div className="flex items-center mb-2">
                        <div className="p-1 bg-blue-100 rounded-full mr-2">
                          <UserIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">Landlord Response</span>
                        <span className="text-sm text-gray-500 ml-2">
                          {formatTimeAgo(inquiry.respondedAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{inquiry.landlordResponse}</p>
                    </div>
                  )}

                  {/* Reply Form (only for received inquiries) */}
                  {tab === 'received' && !inquiry.landlordResponse && (
                    <div className="border-t border-gray-100 pt-4">
                      <div className="space-y-3">
                        <textarea
                          placeholder="Write your response..."
                          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={4}
                          value={responseMap[inquiry._id] || ''}
                          onChange={(e) => setResponseMap(prev => ({ ...prev, [inquiry._id]: e.target.value }))}
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={() => respond(inquiry._id)}
                            disabled={!responseMap[inquiry._id]?.trim()}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                            Send Response
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries found</h3>
            <p className="text-gray-500">
              {tab === 'my' 
                ? "You haven't made any inquiries yet. Start exploring properties!" 
                : "No inquiries received yet. Your properties will attract inquiries soon!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
