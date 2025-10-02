import { useState } from 'react';
import apiService from '../utils/apiService';
import ContactModal from './ContactModal';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  HeartIcon,
  ShareIcon,
  MapPinIcon,
  HomeIcon,
  EyeIcon,
  PhoneIcon,
  StarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';

const PropertyCard = ({ 
  property, 
  variant = 'default', 
  showActions = true,
  onSave,
  onContact,
  onView,
  saved = false,
  className = ''
}) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [landlord, setLandlord] = useState(null);

  const handleSave = (e) => {
    e.stopPropagation();
    onSave?.(property._id);
  };

  const handleContact = async (e) => {
    e.stopPropagation();
    try {
      // Try to fetch by owner email if available, else by owner id when added
      const ownerEmail = property.ownerEmail || property.owner?.email;
      if (ownerEmail) {
        try {
          const userData = await apiService.request(`/server/user/profile/${ownerEmail}`, { method: 'GET' });
          setLandlord(userData.user || userData.data?.user || { email: ownerEmail });
        } catch {
          setLandlord({ email: ownerEmail });
        }
      }
    } catch (err) {
      // ignore
    } finally {
      setShowContact(true);
    }
  };

  const handleView = () => {
    if (onView) {
      onView(property);
    } else {
      navigate(`/property/${property._id}`);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.origin + `/property/${property._id}`
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.origin + `/property/${property._id}`);
    }
  };

  const renderRating = () => {
    const rating = property.rating || 4.5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => (
          <StarSolid
            key={index}
            className={`w-4 h-4 ${
              index < fullStars
                ? 'text-yellow-400'
                : index === fullStars && hasHalfStar
                ? 'text-yellow-300'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">
          {rating.toFixed(1)} ({property.reviews || Math.floor(Math.random() * 50) + 5})
        </span>
      </div>
    );
  };

  const cardVariants = {
    default: 'bg-white rounded-xl shadow-lg hover:shadow-2xl border border-gray-100',
    compact: 'bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-100',
    minimal: 'bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200'
  };

  const imageHeights = {
    default: 'h-64',
    compact: 'h-48',
    minimal: 'h-40'
  };

  return (
  <>
  <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`${cardVariants[variant]} overflow-hidden transition-all duration-300 cursor-pointer group ${className}`}
      onClick={handleView}
    >
      {/* Property Image */}
      <div className={`relative ${imageHeights[variant]} overflow-hidden`}>
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <HomeIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        <img
          src={property.imageUrls?.[0] || '/api/placeholder/400/300'}
          alt={property.title}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />
        
        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Property Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {property.featured && (
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              Featured
            </span>
          )}
          {property.verificationStatus === 'verified' && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            {property.propertyType}
          </span>
        </div>
        
        {/* Action Buttons */}
        {showActions && (
          <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSave}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
            >
              {saved ? (
                <HeartSolid className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-600 hover:text-red-500" />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <ShareIcon className="w-5 h-5 text-gray-600 hover:text-blue-500" />
            </motion.button>
          </div>
        )}
        
        {/* Price Badge */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold">
            ৳{property.rentPrice?.toLocaleString()}/mo
          </div>
        </div>
      </div>
      
      {/* Property Details */}
      <div className={`p-${variant === 'minimal' ? '4' : '6'} space-y-${variant === 'minimal' ? '3' : '4'}`}>
        {/* Title and Location */}
        <div>
          <h3 className={`font-bold text-gray-900 group-hover:text-blue-600 transition-colors ${
            variant === 'minimal' ? 'text-lg' : 'text-xl'
          } line-clamp-2`}>
            {property.title}
          </h3>
          <div className="flex items-center text-gray-600 mt-2">
            <MapPinIcon className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {property.location?.area}, {property.location?.district}
            </span>
          </div>
        </div>

        {/* Description */}
        {variant !== 'minimal' && (
          <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed">
            {property.description}
          </p>
        )}
        
        {/* Property Features */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <HomeIcon className="w-4 h-4 mr-1" />
              <span>{property.bedrooms} beds</span>
            </div>
            <span>•</span>
            <span>{property.bathrooms} baths</span>
            {property.squareFeet && (
              <>
                <span>•</span>
                <span>{property.squareFeet} sqft</span>
              </>
            )}
          </div>
        </div>
        
        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && variant !== 'minimal' && (
          <div className="flex flex-wrap gap-2">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Rating */}
        {variant !== 'minimal' && (
          <div className="pt-2 border-t border-gray-100">
            {renderRating()}
          </div>
        )}
        
        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{property.landlord?.fullName || 'Property Owner'}</span>
            {property.createdAt && (
              <div className="text-xs text-gray-500 mt-1">
                Listed {new Date(property.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
          
          {showActions && (
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleContact}
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center"
              >
                <PhoneIcon className="w-4 h-4 mr-1" />
                Contact
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleView}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                <EyeIcon className="w-4 h-4 mr-1" />
                View
              </motion.button>
            </div>
          )}
        </div>
      </div>
  </motion.div>
  <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} property={property} landlord={landlord} />
  </>
  );
};

export default PropertyCard;
