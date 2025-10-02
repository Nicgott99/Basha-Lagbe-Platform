import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import apiService from '../utils/apiService';
import {
  HomeIcon,
  UserGroupIcon,
  ChartBarIcon,
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolid,
  UserGroupIcon as UserGroupSolid
} from '@heroicons/react/24/solid';

const AdminPanel = () => {
  const { currentUser } = useSelector(state => state.user);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [properties, setProperties] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [stats, setStats] = useState({
    totalProperties: 0,
    pendingProperties: 0,
    approvedProperties: 0,
    rejectedProperties: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalViews: 0,
    totalInquiries: 0
  });
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Setup effect hook before any conditional returns
  useEffect(() => {
    fetchAdminData();
  }, []);

  // Check if user is admin (after hooks)
  if (!currentUser || currentUser.email !== 'hasibullah.khan.alvie@g.bracu.ac.bd') {
    return <Navigate to="/sign-in" />;
  }

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [propertiesRes, usersRes] = await Promise.all([
        fetch('/server/admin/properties', { credentials: 'include' }),
        fetch('/server/admin/users', { credentials: 'include' })
      ]);
      
      // Get stats using our new reliable method
      const serverStats = await apiService.admin.getRealStats();

      // Fetch properties with fallback
      let allProps = [];
      if (propertiesRes.ok) {
        const propsData = await propertiesRes.json();
        // Extract properties array from response object
        if (Array.isArray(propsData)) {
          allProps = propsData;
        } else if (propsData.properties && Array.isArray(propsData.properties)) {
          allProps = propsData.properties;
        } else if (propsData.data && Array.isArray(propsData.data)) {
          allProps = propsData.data;
        }
      } else {
        const fallbackRes = await fetch('/server/listing/search');
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          if (Array.isArray(fallbackData)) {
            allProps = fallbackData;
          } else if (fallbackData.properties && Array.isArray(fallbackData.properties)) {
            allProps = fallbackData.properties;
          } else if (fallbackData.data && Array.isArray(fallbackData.data)) {
            allProps = fallbackData.data;
          }
        }
      }
      setProperties(allProps);

      // Fetch users with fallback
      let allUsers = [];
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        // Extract users array from response object
        if (Array.isArray(usersData)) {
          allUsers = usersData;
        } else if (usersData.users && Array.isArray(usersData.users)) {
          allUsers = usersData.users;
        } else if (usersData.data && Array.isArray(usersData.data)) {
          allUsers = usersData.data;
        }
      }

      // Calculate comprehensive stats
      const pendingCount = allProps.filter(p => 
        (p.verificationStatus || 'pending') === 'pending'
      ).length;
      const approvedCount = allProps.filter(p => 
        (p.verificationStatus || 'approved') === 'approved'
      ).length;
      const rejectedCount = allProps.filter(p => 
        (p.verificationStatus || '') === 'rejected'
      ).length;
      const activeUsersCount = allUsers.filter(u => 
        u.lastActive && new Date(u.lastActive) > new Date(Date.now() - 30*24*60*60*1000)
      ).length;

      // Update stats with the stats from our reliable API method plus locally calculated values
      setStats({
        ...serverStats,
        totalProperties: allProps.length,
        pendingProperties: pendingCount,
        approvedProperties: approvedCount,
        rejectedProperties: rejectedCount,
        totalUsers: allUsers.length,
        activeUsers: activeUsersCount,
        totalRevenue: serverStats.totalRevenue || 0,
        monthlyRevenue: serverStats.monthlyRevenue || 0,
        totalViews: allProps.reduce((sum, p) => sum + (p.views || 0), 0),
        totalInquiries: serverStats.totalInquiries || 0
      });

      // Generate sample notifications
      const sampleNotifications = [
        {
          id: 1,
          type: 'property',
          message: `${pendingCount} properties pending approval`,
          timestamp: new Date().toISOString(),
          priority: 'high'
        },
        {
          id: 2,
          type: 'user',
          message: `${allUsers.length} total users registered`,
          timestamp: new Date(Date.now() - 1000*60*60).toISOString(),
          priority: 'medium'
        }
      ];
      setNotifications(sampleNotifications);

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyAction = async (propertyId, action) => {
    try {
      const response = await fetch(`/server/admin/properties/${propertyId}/moderate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: action,
          adminNotes: action === 'approve' ? 'Property approved by admin' : 'Property rejected by admin',
          adminId: currentUser._id
        }),
      });

      if (response.ok) {
        await fetchAdminData();
        // Show success notification
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'success',
          message: `Property ${action}d successfully`,
          timestamp: new Date().toISOString(),
          priority: 'medium'
        }]);
      } else {
        throw new Error(`Failed to ${action} property`);
      }
    } catch (error) {
      console.error(`Error ${action}ing property:`, error);
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        message: `Error ${action}ing property`,
        timestamp: new Date().toISOString(),
        priority: 'high'
      }]);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    try {
      const response = await fetch(`/server/admin/properties/${propertyId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        await fetchAdminData();
        setShowDeleteModal(false);
        setDeleteTarget(null);
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'success',
          message: 'Property deleted successfully',
          timestamp: new Date().toISOString(),
          priority: 'medium'
        }]);
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Filter and sort properties
  const filteredProperties = properties
    .filter(property => {
      const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location?.area?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || 
                           (property.verificationStatus || 'approved') === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'rentPrice') {
        aVal = parseFloat(a.rentPrice || 0);
        bVal = parseFloat(b.rentPrice || 0);
      } else if (sortBy === 'createdAt') {
        aVal = new Date(a.createdAt || 0);
        bVal = new Date(b.createdAt || 0);
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const StatCard = ({ title, value, icon, color, trend, trendValue }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${color} hover:shadow-xl transition-shadow duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? (
                <ArrowUpIcon className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 mr-1" />
              )}
              {trendValue}% from last month
            </div>
          )}
        </div>
        <div className={`p-4 rounded-xl ${color.replace('border-l-', 'bg-').replace('-500', '-100')}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.node.isRequired,
    color: PropTypes.string.isRequired,
    trend: PropTypes.string,
    trendValue: PropTypes.number
  };

  const PropertyModal = ({ property, onClose }) => (
    <AnimatePresence>
      {property && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">{property.title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircleIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Property Images */}
              {property.imageUrls && property.imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
              
              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Property Information</h3>
                  <div className="space-y-3 text-sm">
                    <div><span className="font-medium">Type:</span> {property.propertyType}</div>
                    <div><span className="font-medium">Price:</span> ৳{property.rentPrice?.toLocaleString()}/month</div>
                    <div><span className="font-medium">Bedrooms:</span> {property.bedrooms}</div>
                    <div><span className="font-medium">Bathrooms:</span> {property.bathrooms}</div>
                    <div><span className="font-medium">Area:</span> {property.squareFeet} sqft</div>
                    <div><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        (property.verificationStatus || 'approved') === 'approved' ? 'bg-green-100 text-green-800' :
                        (property.verificationStatus || 'approved') === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {property.verificationStatus || 'approved'}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Location & Contact</h3>
                  <div className="space-y-3 text-sm">
                    <div><span className="font-medium">Location:</span> {property.location?.area}, {property.location?.district}</div>
                    <div><span className="font-medium">Address:</span> {property.location?.address}</div>
                    <div><span className="font-medium">Owner:</span> {property.landlord?.fullName}</div>
                    <div><span className="font-medium">Phone:</span> {property.landlord?.phone}</div>
                    <div><span className="font-medium">Listed:</span> {new Date(property.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{property.description}</p>
              </div>
              
              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Actions */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-4">Admin Actions</h3>
                <div className="flex gap-3">
                  {(property.verificationStatus || 'approved') === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          handlePropertyAction(property._id, 'approve');
                          onClose();
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        Approve Property
                      </button>
                      <button
                        onClick={() => {
                          handlePropertyAction(property._id, 'reject');
                          onClose();
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        Reject Property
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setDeleteTarget(property);
                      setShowDeleteModal(true);
                      onClose();
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Delete Property
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  PropertyModal.propTypes = {
    property: PropTypes.object,
    onClose: PropTypes.func.isRequired
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Properties"
          value={stats.totalProperties}
          color="border-l-blue-500"
          trend="up"
          trendValue="12"
          icon={<HomeSolid className="w-8 h-8 text-blue-600" />}
        />
        <StatCard
          title="Pending Approval"
          value={stats.pendingProperties}
          color="border-l-yellow-500"
          trend="down"
          trendValue="5"
          icon={<ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />}
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          color="border-l-green-500"
          trend="up"
          trendValue="8"
          icon={<UserGroupSolid className="w-8 h-8 text-green-600" />}
        />
        <StatCard
          title="Monthly Revenue"
          value={`৳${stats.monthlyRevenue.toLocaleString()}`}
          color="border-l-purple-500"
          trend="up"
          trendValue="15"
          icon={<CurrencyDollarIcon className="w-8 h-8 text-purple-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h3>
            <div className="space-y-4">
              {[
                { type: 'property', action: 'New property submitted', time: '2 mins ago', status: 'pending' },
                { type: 'user', action: 'New user registered', time: '15 mins ago', status: 'success' },
                { type: 'property', action: 'Property approved', time: '1 hour ago', status: 'success' },
                { type: 'inquiry', action: 'New inquiry received', time: '2 hours ago', status: 'info' },
                { type: 'property', action: 'Property rejected', time: '3 hours ago', status: 'error' }
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className={`w-3 h-3 rounded-full mr-4 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'pending' ? 'bg-yellow-500' :
                    activity.status === 'error' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notif) => (
                <div key={notif.id} className="flex items-start p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <BellIcon className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{notif.message}</p>
                    <p className="text-xs text-gray-500">{new Date(notif.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setActiveTab('properties')}
                className="w-full flex items-center justify-between p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <span className="flex items-center">
                  <HomeIcon className="w-5 h-5 text-blue-600 mr-3" />
                  Manage Properties
                </span>
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {stats.pendingProperties}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className="w-full flex items-center justify-between p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <span className="flex items-center">
                  <UserGroupIcon className="w-5 h-5 text-green-600 mr-3" />
                  Manage Users
                </span>
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                  {stats.totalUsers}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className="w-full flex items-center p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <ChartBarIcon className="w-5 h-5 text-purple-600 mr-3" />
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProperties = () => (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Property Management</h3>
          <div className="flex gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Properties Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    onClick={() => handleSort('title')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      Property
                      {sortBy === 'title' && (
                        sortOrder === 'asc' ? 
                        <ArrowUpIcon className="w-4 h-4 ml-1" /> : 
                        <ArrowDownIcon className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th 
                    onClick={() => handleSort('rentPrice')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      Price
                      {sortBy === 'rentPrice' && (
                        sortOrder === 'asc' ? 
                        <ArrowUpIcon className="w-4 h-4 ml-1" /> : 
                        <ArrowDownIcon className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th 
                    onClick={() => handleSort('createdAt')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      Date Listed
                      {sortBy === 'createdAt' && (
                        sortOrder === 'asc' ? 
                        <ArrowUpIcon className="w-4 h-4 ml-1" /> : 
                        <ArrowDownIcon className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProperties.length > 0 ? filteredProperties.map((property, index) => {
                  const statusValue = property.verificationStatus || 'approved';
                  return (
                    <motion.tr 
                      key={property._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={property.imageUrls?.[0] || '/api/placeholder/100/100'}
                            alt=""
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {property.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {property.propertyType}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {property.location?.area}, {property.location?.district}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ৳{property.rentPrice?.toLocaleString()}/month
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          statusValue === 'approved' ? 'bg-green-100 text-green-800' :
                          statusValue === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {statusValue}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(property.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedProperty(property)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded"
                            title="View Details"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          {statusValue === 'pending' && (
                            <>
                              <button
                                onClick={() => handlePropertyAction(property._id, 'approve')}
                                className="text-green-600 hover:text-green-800 p-1 rounded"
                                title="Approve"
                              >
                                <CheckCircleIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handlePropertyAction(property._id, 'reject')}
                                className="text-red-600 hover:text-red-800 p-1 rounded"
                                title="Reject"
                              >
                                <XCircleIcon className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => {
                              setDeleteTarget(property);
                              setShowDeleteModal(true);
                            }}
                            className="text-gray-600 hover:text-gray-800 p-1 rounded"
                            title="Delete"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <HomeIcon className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-lg font-medium">No properties found</p>
                        <p className="text-sm">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Enhanced Header */}
      <header className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage properties, users, and platform analytics</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                  <BellIcon className="w-6 h-6" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 block h-3 w-3 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">Admin</div>
                  <div className="text-xs text-gray-500">{currentUser.email}</div>
                </div>
                <img
                  src={currentUser.avatar || '/api/placeholder/40/40'}
                  alt="Admin"
                  className="w-10 h-10 rounded-full ring-2 ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
              { id: 'properties', name: 'Properties', icon: HomeIcon, count: stats.pendingProperties },
              { id: 'users', name: 'Users', icon: UserGroupIcon, count: stats.totalUsers },
              { id: 'analytics', name: 'Analytics', icon: ChartBarIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id ? 'bg-white text-blue-600' : 'bg-red-500 text-white'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'properties' && renderProperties()}
            {activeTab === 'users' && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <UserGroupIcon className="w-24 h-24 mx-auto mb-6 text-gray-400" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">User Management</h3>
                <p className="text-gray-600 mb-8">Comprehensive user management system coming soon with user profiles, activity tracking, and moderation tools.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
                    <div className="text-sm text-blue-800">Total Users</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
                    <div className="text-sm text-green-800">Active Users</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{Math.floor(Math.random() * 50)}</div>
                    <div className="text-sm text-purple-800">New This Month</div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'analytics' && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <ChartBarIcon className="w-24 h-24 mx-auto mb-6 text-gray-400" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Analytics Dashboard</h3>
                <p className="text-gray-600 mb-8">Advanced analytics and reporting system coming soon with detailed insights, revenue tracking, and performance metrics.</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalViews.toLocaleString()}</div>
                    <div className="text-sm text-blue-800">Total Views</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">৳{stats.monthlyRevenue.toLocaleString()}</div>
                    <div className="text-sm text-green-800">Monthly Revenue</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{stats.totalInquiries}</div>
                    <div className="text-sm text-purple-800">Inquiries</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">98.5%</div>
                    <div className="text-sm text-orange-800">Uptime</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Property Details Modal */}
      <PropertyModal 
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            >
              <div className="text-center">
                <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Property</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete &ldquo;{deleteTarget?.title}&rdquo;? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteTarget(null);
                    }}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteProperty(deleteTarget._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminPanel;
