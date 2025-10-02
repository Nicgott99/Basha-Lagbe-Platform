import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  EyeIcon,
  PlusIcon,
  BuildingOfficeIcon,
  HeartIcon,
  BookmarkIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import AdminPanel from "./AdminPanel";

export default function Dashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.accountType === 'admin' || currentUser?.role === 'admin';
  const isLandlordOrAgent = currentUser?.accountType === 'landlord' || currentUser?.accountType === 'agent';
  
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeListings: 0,
    totalApplications: 0,
    savedProperties: 0,
    viewsThisMonth: 0,
    pendingReviews: 0,
    totalRevenue: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Simulate loading different stats based on user type
    if (isLandlordOrAgent) {
      setStats({
        totalProperties: 12,
        activeListings: 8,
        totalApplications: 34,
        totalRevenue: 45680,
        viewsThisMonth: 1240,
        pendingReviews: 3
      });
      setRecentActivities([
        { id: 1, type: 'application', message: 'New application received for Modern Apartment', time: '2 hours ago', status: 'new' },
        { id: 2, type: 'inquiry', message: 'Inquiry from John Doe about Luxury Villa', time: '4 hours ago', status: 'pending' },
        { id: 3, type: 'property', message: 'Property Cozy Studio approved', time: '1 day ago', status: 'approved' },
        { id: 4, type: 'review', message: 'New review received - 5 stars', time: '2 days ago', status: 'positive' }
      ]);
    } else {
      // Tenant stats
      setStats({
        savedProperties: 12,
        totalApplications: 5,
        viewsThisMonth: 89,
        pendingReviews: 2
      });
      setRecentActivities([
        { id: 1, type: 'search', message: 'Searched for apartments in Dhanmondi', time: '2 hours ago', status: 'recent' },
        { id: 2, type: 'save', message: 'Saved Modern Apartment to favorites', time: '4 hours ago', status: 'saved' },
        { id: 3, type: 'inquiry', message: 'Sent inquiry about Luxury Villa', time: '1 day ago', status: 'pending' },
        { id: 4, type: 'application', message: 'Application submitted for Cozy Studio', time: '2 days ago', status: 'submitted' }
      ]);
    }
  }, [isLandlordOrAgent]);

  // Different quick actions for different user types
  const tenantQuickActions = [
    { name: 'Search Properties', icon: MagnifyingGlassIcon, href: '/search', color: 'bg-blue-500 hover:bg-blue-600' },
    { name: 'Saved Properties', icon: HeartIcon, href: '/saved', color: 'bg-red-500 hover:bg-red-600' },
    { name: 'Browse Areas', icon: MapPinIcon, href: '/areas', color: 'bg-green-500 hover:bg-green-600' },
    { name: 'Profile Settings', icon: EyeIcon, href: '/profile', color: 'bg-indigo-500 hover:bg-indigo-600' }
  ];

  const landlordQuickActions = [
    { name: 'Add Property', icon: PlusIcon, href: '/add-property', color: 'bg-blue-500 hover:bg-blue-600' },
    { name: 'View Applications', icon: ClipboardDocumentListIcon, href: '/applications', color: 'bg-green-500 hover:bg-green-600' },
    { name: 'Manage Inquiries', icon: UsersIcon, href: '/inquiries', color: 'bg-purple-500 hover:bg-purple-600' },
    { name: 'Property Analytics', icon: ChartBarIcon, href: '/analytics', color: 'bg-indigo-500 hover:bg-indigo-600' }
  ];

  const quickActions = isLandlordOrAgent ? landlordQuickActions : tenantQuickActions;

  // Different stats for different user types  
  const tenantStatCards = [
    { name: 'Saved Properties', value: stats.savedProperties, icon: HeartIcon, color: 'bg-gradient-to-r from-red-500 to-red-600', change: '+3 this week' },
    { name: 'Applications Sent', value: stats.totalApplications, icon: ClipboardDocumentListIcon, color: 'bg-gradient-to-r from-green-500 to-green-600', change: '2 pending' },
    { name: 'Profile Views', value: stats.viewsThisMonth, icon: EyeIcon, color: 'bg-gradient-to-r from-blue-500 to-blue-600', change: '+5 this month' },
    { name: 'Reviews Given', value: stats.pendingReviews, icon: StarIcon, color: 'bg-gradient-to-r from-yellow-500 to-yellow-600', change: 'Recent activity' }
  ];

  const landlordStatCards = [
    { name: 'Total Properties', value: stats.totalProperties, icon: HomeIcon, color: 'bg-gradient-to-r from-blue-500 to-blue-600', change: '+12%' },
    { name: 'Active Listings', value: stats.activeListings, icon: BuildingOfficeIcon, color: 'bg-gradient-to-r from-green-500 to-green-600', change: '+8%' },
    { name: 'Applications', value: stats.totalApplications, icon: ClipboardDocumentListIcon, color: 'bg-gradient-to-r from-purple-500 to-purple-600', change: '+23%' },
    { name: 'Monthly Revenue', value: `৳${(stats.totalRevenue || 0).toLocaleString()}`, icon: CurrencyDollarIcon, color: 'bg-gradient-to-r from-amber-500 to-amber-600', change: '+15%' },
    { name: 'Monthly Views', value: stats.viewsThisMonth.toLocaleString(), icon: EyeIcon, color: 'bg-gradient-to-r from-pink-500 to-pink-600', change: '+31%' },
    { name: 'Pending Reviews', value: stats.pendingReviews, icon: ChartBarIcon, color: 'bg-gradient-to-r from-indigo-500 to-indigo-600', change: '-5%' }
  ];

  const statCards = isLandlordOrAgent ? landlordStatCards : tenantStatCards;

  const getActivityIcon = (type) => {
    switch (type) {
      case 'application':
        return <ClipboardDocumentListIcon className="w-5 h-5" />;
      case 'inquiry':
        return <BellIcon className="w-5 h-5" />;
      case 'property':
        return <HomeIcon className="w-5 h-5" />;
      case 'review':
        return <StarIcon className="w-5 h-5" />;
      case 'search':
        return <MagnifyingGlassIcon className="w-5 h-5" />;
      case 'save':
        return <BookmarkIcon className="w-5 h-5" />;
      default:
        return <BellIcon className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
      case 'recent':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'approved':
      case 'positive':
      case 'saved':
        return 'text-green-600 bg-green-100';
      case 'submitted':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const dashboardTitle = isLandlordOrAgent 
    ? `Welcome back, ${currentUser?.fullName || 'Property Owner'}` 
    : `Welcome, ${currentUser?.fullName || 'Property Seeker'}`;
    
  const dashboardSubtitle = isLandlordOrAgent
    ? "Manage your properties and track your business performance."
    : "Find your perfect home and manage your property search.";

  // Redirect admin users to admin panel instead
  if (isAdmin) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {dashboardTitle}
                </h1>
                <p className="text-gray-600 text-lg">
                  {dashboardSubtitle}
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-semibold text-lg capitalize text-blue-600">
                    {currentUser?.accountType || 'User'}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {(currentUser?.fullName || currentUser?.email || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statCards.map((card) => (
            <div key={card.name} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">{card.name}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                    <p className="text-sm text-gray-600 mt-1">{card.change}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${card.color} text-white`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-4">
                {quickActions.map((action) => (
                  <Link
                    key={action.name}
                    to={action.href}
                    className={`flex items-center p-4 rounded-xl ${action.color} text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
                  >
                    <action.icon className="w-6 h-6 mr-3" />
                    <span className="font-medium">{action.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activities</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors duration-200">
                    <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-medium">{activity.message}</p>
                      <p className="text-gray-500 text-sm mt-1">{activity.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}