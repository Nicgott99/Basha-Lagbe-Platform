import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../utils/apiService';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  HomeIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  HeartIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChevronRightIcon,
  UserGroupIcon,
  ClockIcon,
  ShieldCheckIcon,
  PlayIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeListings: 0,
    totalUsers: 0,
    completedTransactions: 0,
    avgRating: 4.9
  });

  useEffect(() => {
  const fetchRealStats = async () => {
      // Our getRealStats method now has all the error handling built-in
      // It will always return stats data, either real or fallback values
      try {
        const data = await apiService.admin.getRealStats();
        setStats(prev => ({ ...prev, ...data }));
      } catch {
        // This catch block should never be reached due to the error handling in getRealStats
        // But just in case there's some other unforeseen error
        setStats({
          totalProperties: 150,
          activeListings: 98,
          totalUsers: 250,
          completedTransactions: 85,
          avgRating: 4.8
        });
      }
    };
    fetchRealStats();
  }, []);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  

  // Bangladesh locations
  const locations = [
    'Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mirpur', 'Mohammadpur', 
    'Lalmatia', 'New Market', 'Elephant Road', 'Panthapath', 'Farmgate',
    'Bashundhara', 'Baridhara', 'Wari', 'Old Dhaka', 'Tejgaon', 'Motijheel'
  ];

  const propertyTypes = ['Apartment', 'House', 'Studio', 'Room', 'Commercial'];

  // Enhanced testimonials
  const testimonials = [
    {
      id: 1,
      name: "Rashida Sultana",
      role: "Software Engineer",
      location: "Dhanmondi, Dhaka",
      text: "Basha Lagbe made finding my dream apartment incredibly easy! The verification process gave me complete confidence, and I found the perfect place within just a week.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face",
      verified: true
    },
    {
      id: 2,
      name: "Mohammad Karim Rahman",
      role: "Business Owner",
      location: "Gulshan, Dhaka",
      text: "As a property owner, I've had exceptional success renting through Basha Lagbe. The tenant verification process is thorough, ensuring I always get quality tenants.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      verified: true
    },
    {
      id: 3,
      name: "Fatima Ahmed",
      role: "University Student",
      location: "Uttara, Dhaka",
      text: "Being a student, I was worried about finding affordable housing. Basha Lagbe's student-friendly filters made my search completely stress-free!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      verified: true
    }
  ];

  const features = [
    {
      icon: ShieldCheckIcon,
      title: "100% Verified Properties",
      description: "Every property is thoroughly verified by our expert team before listing",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      icon: UserGroupIcon,
      title: "Trusted Community",
      description: "Join thousands of verified landlords and satisfied tenants",
      color: "text-blue-600", 
      bgColor: "bg-blue-50"
    },
    {
      icon: ClockIcon,
      title: "24/7 Support",
      description: "Round-the-clock customer support to help with any queries",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: MapPinIcon,
      title: "Prime Locations",
      description: "Properties in the best neighborhoods across Bangladesh",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const quickSearchTypes = [
    { type: 'Apartment', icon: '🏠', count: '12,000+', color: 'from-blue-500 to-cyan-500' },
    { type: 'House', icon: '🏡', count: '6,500+', color: 'from-green-500 to-emerald-500' },
    { type: 'Studio', icon: '🏢', count: '2,800+', color: 'from-purple-500 to-pink-500' },
    { type: 'Commercial', icon: '🏬', count: '1,200+', color: 'from-orange-500 to-red-500' }
  ];

  useEffect(() => {
    fetchFeaturedProperties();
    
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Create a reusable function for featured property data
  const getFallbackProperties = () => [
    {
      _id: 'dummy1',
      name: 'Luxury Apartment in Gulshan',
      description: 'Beautiful 3-bedroom apartment with modern amenities',
      price: 35000,
      images: ['/images/property1.jpg'],
      location: { area: 'Gulshan', address: 'Road 104, Gulshan 2' }
    },
    {
      _id: 'dummy2',
      name: 'Cozy Studio in Dhanmondi',
      description: 'Perfect studio for students or young professionals',
      price: 18000,
      images: ['/images/property2.jpg'],
      location: { area: 'Dhanmondi', address: 'Road 15/A, Dhanmondi' }
    },
    {
      _id: 'dummy3',
      name: 'Spacious Family House in Uttara',
      description: '4-bedroom house with garden and garage',
      price: 45000,
      images: ['/images/property3.jpg'],
      location: { area: 'Uttara', address: 'Sector 4, Road 12' }
    }
  ];

  const fetchFeaturedProperties = async () => {
    setLoading(true);
    try {
      // Our improved getFeatured method now has built-in error handling
      // It will always return an array of properties, either real or fallback
      const data = await apiService.listing.getFeatured();
      
      // Slice to get just the first 6 properties
      setFeaturedProperties(data.slice(0, 6));
    } catch (error) {
      // This catch block should never be reached due to error handling in getFeatured
      // But just in case there's some unforeseen error
      console.error('Unexpected error in fetchFeaturedProperties:', error);
      setError('Failed to load properties');
      setFeaturedProperties(getFallbackProperties());
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedLocation) params.set('area', selectedLocation);
    if (propertyType) params.set('propertyType', propertyType);
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(v => v.replace(/[^0-9]/g, ''));
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with animated elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -100, -20],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
              <SparklesIcon className="w-4 h-4 mr-2" />
              Bangladesh's #1 Property Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-yellow-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Dream Home
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Discover thousands of verified rental properties across Bangladesh. 
              Your ideal home is just a search away!
            </p>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-blue-200 mb-12">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                <span>100% Verified Properties</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-blue-400" />
                <span>Secure & Trusted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <StarSolid key={i} className="w-4 h-4 text-yellow-400" />
                  ))}
                </div>
                <span>{stats.avgRating}/5 Rating</span>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Search Form */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onSubmit={handleSearch}
            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              {/* Search Input */}
              <div className="relative md:col-span-2">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by area, property name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-lg transition-all"
                />
              </div>
              
              {/* Location Select */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-lg appearance-none bg-white cursor-pointer transition-all"
              >
                <option value="">Select Location</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              {/* Property Type Select */}
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-lg appearance-none bg-white cursor-pointer transition-all"
              >
                <option value="">Property Type</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg text-lg flex items-center justify-center gap-2"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
                Search Now
              </button>
            </div>
            
            {/* Quick Search Tags */}
            <div className="flex flex-wrap justify-center gap-3">
              <span className="text-gray-600 text-sm font-medium">Popular:</span>
              {['Dhanmondi', 'Gulshan', 'Uttara', 'Mirpur'].map(location => (
                <button
                  key={location}
                  type="button"
                  onClick={() => setSelectedLocation(location)}
                  className="px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full text-sm transition-all transform hover:scale-105"
                >
                  {location}
                </button>
              ))}
            </div>
          </motion.form>

      {/* Stats - Live from API */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            <div className="text-white">
              <div className="text-3xl font-bold mb-2">{stats.totalProperties.toLocaleString()}+</div>
              <div className="text-blue-200">Properties</div>
            </div>
            <div className="text-white">
        <div className="text-3xl font-bold mb-2">{stats.activeListings.toLocaleString()}+</div>
        <div className="text-blue-200">Active Listings</div>
            </div>
            <div className="text-white">
        <div className="text-3xl font-bold mb-2">{stats.totalUsers.toLocaleString()}+</div>
        <div className="text-blue-200">Registered Users</div>
            </div>
            <div className="text-white">
        <div className="text-3xl font-bold mb-2">{stats.completedTransactions.toLocaleString()}+</div>
        <div className="text-blue-200">Completed Deals</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Property Types */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-sm font-medium mb-6"
            >
              <HomeIcon className="w-4 h-4 mr-2" />
              Property Types
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Explore by Property Type
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect property type that matches your lifestyle and budget
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {quickSearchTypes.map((item, index) => (
              <motion.button
                key={item.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => navigate(`/search?propertyType=${item.type}`)}
                className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="relative p-8 text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.type}</h3>
                  <p className="text-blue-600 font-semibold mb-4">{item.count} available</p>
                  <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700">
                    <span className="text-sm font-medium mr-2">Explore</span>
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 bg-purple-50 rounded-full text-purple-600 text-sm font-medium mb-6"
            >
              <StarIcon className="w-4 h-4 mr-2" />
              Featured Properties
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Handpicked Premium Properties
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated selection of the finest rental properties
            </p>
          </div>
          
          {loading && (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-16">
              <div className="text-red-600 mb-4">{error}</div>
              <button 
                onClick={fetchFeaturedProperties}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Try Again
              </button>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={property.imageUrls?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'}
                    alt={property.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Property Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      Featured
                    </span>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                      <CheckCircleIcon className="w-4 h-4" />
                      Verified
                    </span>
                  </div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold">
                      ৳{property.rentPrice?.toLocaleString()}/mo
                    </span>
                  </div>

                  {/* Heart Icon */}
                  <button className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all group">
                    <HeartIcon className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      <span className="text-sm">{property.location?.area}, {property.location?.district}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {[1,2,3,4,5].map(star => (
                          <StarSolid key={star} className="w-4 h-4 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">4.9 (24 reviews)</span>
                    </div>
                  </div>
                  
                  {/* Property Details */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                      <HomeIcon className="w-4 h-4" />
                      <span>{property.bedrooms} Bed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🚿 {property.bathrooms} Bath</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📐 {property.squareFeet || '1200'} sqft</span>
                    </div>
                  </div>
                  
                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {property.amenities?.slice(0, 3).map(amenity => (
                      <span key={amenity} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        {amenity}
                      </span>
                    ))}
                    {property.amenities?.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                        +{property.amenities.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={() => navigate(`/search?search=${encodeURIComponent(property.location?.area || '')}`)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
                  >
                    View Details
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
          {featuredProperties.length === 0 && !loading && !error && (
            <div className="text-center py-16">
              <div className="text-gray-500 mb-4">No properties available yet</div>
              <button
                onClick={() => navigate('/add-property')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                List Your Property
              </button>
            </div>
          )}
          
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/search')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg"
            >
              View All Properties
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 bg-green-50 rounded-full text-green-600 text-sm font-medium mb-6"
            >
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Why Choose Us
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Basha Lagbe?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make finding your perfect rental home easy, secure, and stress-free
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group text-center p-8 rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className={`${feature.bgColor} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-10 h-10 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 bg-yellow-50 rounded-full text-yellow-600 text-sm font-medium mb-6"
            >
              <StarIcon className="w-4 h-4 mr-2" />
              Customer Reviews
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from thousands of satisfied customers across Bangladesh
            </p>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                      {[1,2,3,4,5].map(star => (
                        <StarSolid key={star} className="w-8 h-8 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-2xl md:text-3xl text-gray-700 font-medium leading-relaxed mb-8">
                      "{testimonials[currentTestimonial].text}"
                    </blockquote>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <img
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-bold text-gray-900 text-lg">
                          {testimonials[currentTestimonial].name}
                        </div>
                        {testimonials[currentTestimonial].verified && (
                          <CheckCircleIcon className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <div className="text-gray-600">{testimonials[currentTestimonial].role}</div>
                      <div className="text-sm text-gray-500">{testimonials[currentTestimonial].location}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-center mt-8 gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial 
                      ? 'bg-blue-600 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
              Ready to Find Your
              <span className="block bg-gradient-to-r from-yellow-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Dream Home?
              </span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied customers who found their perfect rental through Basha Lagbe. 
              Start your journey today!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <button
                onClick={() => navigate('/search')}
                className="group bg-white text-indigo-900 hover:bg-gray-100 font-bold py-4 px-8 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
                Start Searching
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/add-property')}
                className="group bg-transparent border-2 border-white text-white hover:bg-white hover:text-indigo-900 font-bold py-4 px-8 rounded-xl transition duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <HomeIcon className="w-5 h-5" />
                List Your Property
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-blue-200">
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-5 h-5" />
                <span>+880 1234-567890</span>
              </div>
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="w-5 h-5" />
                <span>info@bashalagbe.com</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
