import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import apiService from '../utils/apiService';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  HomeIcon,
  HeartIcon,
  EyeIcon,
  PhoneIcon,
  ShareIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const Search = () => {
  const locationHook = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    propertyType: '',
    priceRange: { min: '', max: '' },
    bedrooms: '',
    bathrooms: '',
    area: '',
    district: '',
    amenities: []
  });
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [savedProperties, setSavedProperties] = useState(new Set());
  const [sortBy, setSortBy] = useState('relevance');

  // Parse URL params on load or change
  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    const q = params.get('search') || '';
    const area = params.get('area') || '';
    const type = params.get('propertyType') || params.get('type') || '';
    const minPrice = params.get('minPrice') || '';
    const maxPrice = params.get('maxPrice') || '';
    setSearchQuery(q);
    setFilters(prev => ({
      ...prev,
      area,
      propertyType: type,
      priceRange: { min: minPrice, max: maxPrice }
    }));
  }, [locationHook.search]);

  // Bangladesh districts and areas
  const districts = [
    'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'
  ];

  const dhakaAreas = [
    'Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mirpur', 'Mohammadpur', 'Lalmatia',
    'New Market', 'Elephant Road', 'Panthapath', 'Farmgate', 'Tejgaon', 'Bashundhara',
    'Baridhara', 'Motijheel', 'Purana Paltan', 'Ramna', 'Wari', 'Old Dhaka'
  ];

  const propertyTypes = [
    'Apartment', 'House', 'Studio', 'Room', 'Office Space', 'Commercial'
  ];

  const amenities = [
    'Parking', 'Elevator', 'Security', 'Generator', 'Gas', 'WiFi',
    'Gym', 'Swimming Pool', 'Garden', 'Balcony', 'Furnished', 'AC'
  ];

  useEffect(() => {
    fetchProperties();
    // Re-fetch when query params change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationHook.search]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const qs = locationHook.search || '';
      
      // Use our centralized listing API with robust error handling
      const data = await apiService.listing.getAll(qs);
        
      // Data will always be an array due to error handling in apiService
      // but we'll double check just to be extra safe
      const propertiesArray = Array.isArray(data) ? data : [];
      
      // Only approved or unspecified verificationStatus
      const approved = propertiesArray.filter(p => 
        !p.verificationStatus || p.verificationStatus === 'approved'
      );
      
      if (approved.length === 0) {
        // If no properties after filtering, use sample data
        const sampleData = generateSampleProperties();
        setProperties(sampleData);
        applyFilters(sampleData);
      } else {
        setProperties(approved);
        applyFilters(approved);
      }
    } catch (error) {
      // This catch block should never be reached due to error handling in apiService
      console.error('Unexpected error in search properties:', error);
      const sampleData = generateSampleProperties();
      setProperties(sampleData);
      applyFilters(sampleData);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback((propertiesToFilter = properties) => {
    let filtered = [...propertiesToFilter];

    if (searchQuery.trim()) {
      filtered = filtered.filter(property =>
        property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location?.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location?.district?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.propertyType) {
      filtered = filtered.filter(property => property.propertyType === filters.propertyType);
    }

    if (filters.priceRange.min || filters.priceRange.max) {
      filtered = filtered.filter(property => {
        const price = parseFloat(property.rentPrice || property.price || 0);
        const min = parseFloat(filters.priceRange.min || 0);
        const max = parseFloat(filters.priceRange.max || 999999);
        return price >= min && price <= max;
      });
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(property => (property.bedrooms || 0) >= parseInt(filters.bedrooms));
    }

    if (filters.bathrooms) {
      filtered = filtered.filter(property => (property.bathrooms || 0) >= parseInt(filters.bathrooms));
    }

    if (filters.district) {
      filtered = filtered.filter(property => property.location?.district === filters.district);
    }

    if (filters.area) {
      filtered = filtered.filter(property => property.location?.area === filters.area);
    }

    if (filters.amenities.length > 0) {
      filtered = filtered.filter(property => 
        filters.amenities.every(amenity => property.amenities?.includes(amenity))
      );
    }

    setFilteredProperties(filtered);
  }, [properties, searchQuery, filters]);

  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery, properties, applyFilters]);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    let sorted = [...filteredProperties];
    switch (newSortBy) {
      case 'price_low':
        sorted.sort((a, b) => parseFloat(a.rentPrice || a.price || 0) - parseFloat(b.rentPrice || b.price || 0));
        break;
      case 'price_high':
        sorted.sort((a, b) => parseFloat(b.rentPrice || b.price || 0) - parseFloat(a.rentPrice || a.price || 0));
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      case 'bedrooms':
        sorted.sort((a, b) => (b.bedrooms || 0) - (a.bedrooms || 0));
        break;
      default:
        // Keep current order for relevance
        break;
    }
    setFilteredProperties(sorted);
  };

  const generateSampleProperties = () => [
    {
      _id: '1',
      title: 'Modern 3BHK Apartment in Dhanmondi',
      description: 'Beautiful apartment with modern amenities, perfect for families.',
      propertyType: 'Apartment',
      rentPrice: 45000,
      bedrooms: 3,
      bathrooms: 2,
      area: 1200,
      location: { district: 'Dhaka', area: 'Dhanmondi' },
      amenities: ['Parking', 'Elevator', 'Security', 'Generator'],
      imageUrls: ['/api/placeholder/400/300'],
      verificationStatus: 'approved',
      landlord: { fullName: 'Ahmed Khan', phone: '+8801712345678' }
    },
    {
      _id: '2',
      title: 'Cozy Studio in Gulshan',
      description: 'Perfect for single professionals, fully furnished with all amenities.',
      propertyType: 'Studio',
      rentPrice: 25000,
      bedrooms: 1,
      bathrooms: 1,
      area: 600,
      location: { district: 'Dhaka', area: 'Gulshan' },
      amenities: ['WiFi', 'AC', 'Furnished', 'Security'],
      imageUrls: ['/api/placeholder/400/300'],
      verificationStatus: 'approved',
      landlord: { fullName: 'Fatima Rahman', phone: '+8801987654321' }
    },
    {
      _id: '3',
      title: 'Family House in Uttara',
      description: 'Spacious family house with garden and parking.',
      propertyType: 'House',
      rentPrice: 60000,
      bedrooms: 4,
      bathrooms: 3,
      area: 2000,
      location: { district: 'Dhaka', area: 'Uttara' },
      amenities: ['Parking', 'Garden', 'Security', 'Generator', 'Gas'],
      imageUrls: ['/api/placeholder/400/300'],
      verificationStatus: 'approved',
      landlord: { fullName: 'Mohammad Ali', phone: '+8801555666777' }
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const toggleSaveProperty = (propertyId) => {
    setSavedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) newSet.delete(propertyId); else newSet.add(propertyId);
      return newSet;
    });
  };

  const clearFilters = () => {
    setFilters({
      propertyType: '',
      priceRange: { min: '', max: '' },
      bedrooms: '',
      bathrooms: '',
      area: '',
      district: '',
      amenities: []
    });
    setSearchQuery('');
  };

  const PropertyCard = ({ property }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border hover:shadow-xl transition-all duration-300 group"
    >
      <div className="relative">
        <img
          src={property.imageUrls?.[0] || '/api/placeholder/400/300'}
          alt={property.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {property.propertyType}
          </span>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => toggleSaveProperty(property._id)}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition duration-200"
          >
            {savedProperties.has(property._id) ? (
              <HeartSolid className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition duration-200">
            <ShareIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
            ৳{property.rentPrice?.toLocaleString()}/month
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition duration-200">
          {property.title}
        </h3>
        <p className="text-gray-600 mb-4 flex items-center">
          <MapPinIcon className="w-4 h-4 mr-1" />
          {property.location?.area}, {property.location?.district}
        </p>
        <p className="text-gray-700 mb-4 line-clamp-2">{property.description}</p>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <span className="flex items-center">
            <HomeIcon className="w-4 h-4 mr-1" />
            {property.bedrooms} beds
          </span>
          <span>{property.bathrooms} baths</span>
          <span>{property.area} sqft</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.isArray(property.amenities) && property.amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
            >
              {amenity}
            </span>
          ))}
          {Array.isArray(property.amenities) && property.amenities.length > 3 && (
            <span className="text-gray-500 text-xs">+{property.amenities.length - 3} more</span>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <p>By {property.landlord?.fullName}</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition duration-200 flex items-center">
              <PhoneIcon className="w-4 h-4 mr-1" />
              Contact
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition duration-200 flex items-center">
              <EyeIcon className="w-4 h-4 mr-1" />
              View
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  PropertyCard.propTypes = {
    property: PropTypes.shape({
      _id: PropTypes.string,
      imageUrls: PropTypes.arrayOf(PropTypes.string),
      title: PropTypes.string,
      propertyType: PropTypes.string,
      rentPrice: PropTypes.number,
      location: PropTypes.shape({
        area: PropTypes.string,
        district: PropTypes.string
      }),
      description: PropTypes.string,
      bedrooms: PropTypes.number,
      bathrooms: PropTypes.number,
      area: PropTypes.number,
      amenities: PropTypes.arrayOf(PropTypes.string),
      landlord: PropTypes.shape({
        fullName: PropTypes.string
      })
    }).isRequired
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for properties, locations, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition duration-200 flex items-center"
              >
                <FunnelIcon className="w-5 h-5 mr-2" />
                Filters
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border border-gray-200 rounded-lg p-6 bg-gray-50"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (৳)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange.min}
                      onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, min: e.target.value })}
                      className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange.max}
                      onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, max: e.target.value })}
                      className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <select
                    value={filters.bedrooms}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                  <select
                    value={filters.district}
                    onChange={(e) => handleFilterChange('district', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Districts</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Area Selection (if Dhaka is selected) */}
              {filters.district === 'Dhaka' && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Area in Dhaka</label>
                  <select
                    value={filters.area}
                    onChange={(e) => handleFilterChange('area', e.target.value)}
                    className="w-full md:w-1/4 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Areas</option>
                    {dhakaAreas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Amenities */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {amenities.map(amenity => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                        filters.amenities.includes(amenity)
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Actions */}
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Clear all filters
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowFilters(false);
                    fetchProperties();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {loading ? 'Searching...' : `${filteredProperties.length} Properties Found`}
            </h1>
            <p className="text-gray-600">
              {searchQuery && `Results for "${searchQuery}"`}
              {filters.district && ` in ${filters.district}`}
              {filters.area && `, ${filters.area}`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="bedrooms">Most Bedrooms</option>
            </select>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border animate-pulse">
                <div className="h-64 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="w-24 h-24 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or explore other areas.</p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Load More */}
        {properties.length > 0 && properties.length >= 9 && (
          <div className="text-center mt-12">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold transition duration-200">
              Load More Properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;