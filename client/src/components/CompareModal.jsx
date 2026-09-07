import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  X,
  Scale,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Check,
  Minus,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  Flame,
  Car,
  Wifi,
  Trash2,
} from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { encodeId } from '../utils/idCrypto';

const formatBDT = (amount) => {
  if (!amount && amount !== 0) return 'N/A';
  return `৳${Number(amount).toLocaleString('en-BD')}`;
};

const CompareModal = () => {
  const { compareList, removeFromCompare, clearCompare, isCompareOpen, setIsCompareOpen } = useCompare();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCompareOpen) {
        setIsCompareOpen(false);
      }
    };
    if (isCompareOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCompareOpen, setIsCompareOpen]);

  if (!isCompareOpen) return null;

  const comparisonAttributes = [
    {
      label: 'Monthly Rent',
      render: (p) => (
        <div className="font-bold text-lg text-primary-600">
          {formatBDT(p.discountPrice || p.regularPrice || p.price || p.rent)}
          <span className="text-xs text-gray-500 font-normal"> / month</span>
          {p.offer && p.discountPrice && (
            <span className="block text-xs line-through text-gray-400 font-normal">
              {formatBDT(p.regularPrice)}
            </span>
          )}
        </div>
      ),
    },
    {
      label: 'Advance / Deposit',
      render: (p) => (
        <span className="text-sm font-medium text-gray-700">
          {p.advanceDeposit || p.deposit ? formatBDT(p.advanceDeposit || p.deposit) : '1-2 Months (Negotiable)'}
        </span>
      ),
    },
    {
      label: 'Property Type',
      render: (p) => (
        <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 capitalize">
          {p.type || p.propertyType || 'Apartment'}
        </span>
      ),
    },
    {
      label: 'Target Tenant',
      render: (p) => (
        <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 capitalize">
          {p.tenantType || p.targetAudience || 'Family / Bachelor'}
        </span>
      ),
    },
    {
      label: 'Location',
      render: (p) => (
        <div className="flex items-start gap-1 text-xs text-gray-600">
          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-2">{p.address || p.location || 'Dhaka, Bangladesh'}</span>
        </div>
      ),
    },
    {
      label: 'Bedrooms',
      render: (p) => (
        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
          <Bed className="w-4 h-4 text-primary-500" />
          <span>{p.bedrooms || p.beds || 1} Bed{Number(p.bedrooms || p.beds || 1) > 1 ? 's' : ''}</span>
        </div>
      ),
    },
    {
      label: 'Bathrooms',
      render: (p) => (
        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
          <Bath className="w-4 h-4 text-primary-500" />
          <span>{p.bathrooms || p.baths || 1} Bath{Number(p.bathrooms || p.baths || 1) > 1 ? 's' : ''}</span>
        </div>
      ),
    },
    {
      label: 'Balconies',
      render: (p) => (
        <span className="text-sm text-gray-700 font-medium">
          {p.balconies !== undefined ? `${p.balconies} Balcon${p.balconies > 1 ? 'ies' : 'y'}` : '1-2'}
        </span>
      ),
    },
    {
      label: 'Floor Area',
      render: (p) => (
        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
          <Maximize2 className="w-4 h-4 text-primary-500" />
          <span>{p.size || p.area || p.sqft || 1200} sq ft</span>
        </div>
      ),
    },
    {
      label: 'Furnishing',
      render: (p) => (
        <span className="text-sm font-medium text-gray-700 capitalize">
          {p.furnished ? 'Fully Furnished' : p.furnishingStatus || 'Unfurnished'}
        </span>
      ),
    },
    {
      label: 'Elevator / Lift',
      render: (p) => (
        <AmenityStatus enabled={p.lift || p.elevator || p.amenities?.includes('lift') || p.amenities?.includes('elevator')} />
      ),
    },
    {
      label: 'Generator Backup',
      render: (p) => (
        <AmenityStatus
          icon={<Zap className="w-3.5 h-3.5" />}
          enabled={p.generator || p.amenities?.includes('generator') || p.backupPower}
        />
      ),
    },
    {
      label: 'Gas Supply',
      render: (p) => (
        <AmenityStatus
          icon={<Flame className="w-3.5 h-3.5" />}
          enabled={p.gas || p.amenities?.includes('gas') || p.gasSupply}
        />
      ),
    },
    {
      label: 'Car Parking',
      render: (p) => (
        <AmenityStatus
          icon={<Car className="w-3.5 h-3.5" />}
          enabled={p.parking || p.amenities?.includes('parking') || p.garage}
        />
      ),
    },
    {
      label: 'CCTV & Security',
      render: (p) => (
        <AmenityStatus
          icon={<ShieldCheck className="w-3.5 h-3.5" />}
          enabled={p.cctv || p.security || p.amenities?.includes('cctv') || p.amenities?.includes('security')}
        />
      ),
    },
    {
      label: 'WiFi Internet',
      render: (p) => (
        <AmenityStatus
          icon={<Wifi className="w-3.5 h-3.5" />}
          enabled={p.wifi || p.internet || p.amenities?.includes('wifi')}
        />
      ),
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="compare-modal-title"
          className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 via-white to-primary-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 text-primary-700 rounded-xl">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 id="compare-modal-title" className="text-xl font-bold text-gray-900">
                  Property Comparison
                </h2>
                <p className="text-xs text-gray-500">
                  Comparing {compareList.length} propert{compareList.length === 1 ? 'y' : 'ies'} side by side
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {compareList.length > 0 && (
                <button
                  type="button"
                  onClick={clearCompare}
                  className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCompareOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close comparison modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-4 sm:p-6">
            {compareList.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Scale className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">No properties selected to compare</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                  Browse through our rental listings and click the "Compare" button to see properties side-by-side.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCompareOpen(false)}
                  className="mt-6 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold shadow-md transition-colors"
                >
                  Browse Listings
                </button>
              </div>
            ) : (
              <div>
                {compareList.length === 1 && (
                  <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>
                      Add at least 1 more property from search results or home page to compare features side-by-side!
                    </span>
                  </div>
                )}

                {/* Comparison Grid Table */}
                <div className="overflow-x-auto rounded-2xl border border-gray-200">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    {/* Header Row: Images & Titles */}
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-200">
                        <th className="p-4 w-44 min-w-[160px] text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 sticky left-0 z-10">
                          Feature / Property
                        </th>
                        {compareList.map((property) => {
                          const img = property.imageUrls?.[0] || property.images?.[0] || '/api/placeholder/300/200';
                          const safeId = encodeId(property._id);
                          return (
                            <th
                              key={property._id}
                              className="p-4 min-w-[240px] max-w-[280px] align-top bg-white border-l border-gray-100 relative group"
                            >
                              <button
                                type="button"
                                onClick={() => removeFromCompare(property._id)}
                                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors z-10"
                                title="Remove from comparison"
                                aria-label={`Remove ${property.title} from comparison`}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>

                              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-gray-100 border border-gray-200">
                                <img
                                  src={img}
                                  alt={property.title || 'Property image'}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  loading="lazy"
                                />
                              </div>

                              <h4 className="font-bold text-gray-900 text-sm line-clamp-2 leading-snug mb-2">
                                {property.title || 'Untitled Property'}
                              </h4>

                              <Link
                                to={`/listing/${safeId}`}
                                onClick={() => setIsCompareOpen(false)}
                                className="inline-flex items-center justify-center gap-1.5 w-full bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors shadow-sm"
                              >
                                <span>View Details</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>

                    {/* Comparison Rows */}
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {comparisonAttributes.map((attr, idx) => (
                        <tr
                          key={attr.label}
                          className={idx % 2 === 0 ? 'bg-white hover:bg-gray-50/50' : 'bg-gray-50/40 hover:bg-gray-50/80'}
                        >
                          <td className="p-3.5 text-xs font-semibold text-gray-600 sticky left-0 bg-inherit z-10 border-r border-gray-100">
                            {attr.label}
                          </td>
                          {compareList.map((property) => (
                            <td key={property._id} className="p-3.5 border-l border-gray-100 align-middle">
                              {attr.render(property)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Tip: You can compare up to 4 properties simultaneously.</span>
            <button
              type="button"
              onClick={() => setIsCompareOpen(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const AmenityStatus = ({ enabled, icon }) => {
  if (enabled) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
        {icon || <Check className="w-3.5 h-3.5 text-green-600" />}
        <span>Available</span>
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-400 text-xs font-medium">
      <Minus className="w-3.5 h-3.5" />
      <span>Not Available</span>
    </div>
  );
};

export default CompareModal;
