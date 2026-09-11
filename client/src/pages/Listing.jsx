import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  MapPinIcon,
  HomeIcon,
  ShareIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChevronLeftIcon,
  WifiIcon,
  TruckIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { Scale, Calendar, CheckSquare } from "lucide-react";
import useClipboard from "../hooks/useClipboard";
import usePageTitle from "../hooks/usePageTitle";
import SEO from "../components/SEO";
import { decodeId } from "../utils/idCrypto";
import { useCompare } from "../context/CompareContext";
import ScheduleTourModal from "../components/ScheduleTourModal";
import MovingChecklistModal from "../components/MovingChecklistModal";

SwiperCore.use([Navigation, Pagination]);

// ─── Badge ───────────────────────────────────────────────────────────────────
const Badge = ({ children, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
    purple: "bg-purple-100 text-purple-700",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const ListingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-[480px] bg-gray-200 rounded-none" />
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-24 bg-gray-200 rounded" />
      </div>
      <div className="h-48 bg-gray-200 rounded-2xl" />
    </div>
  </div>
);

// ─── Error State ──────────────────────────────────────────────────────────────
const ListingError = ({ onRetry }) => (
  <div className="min-h-[60vh] flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <div className="text-6xl mb-6">🏚️</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Property Not Found</h2>
      <p className="text-gray-500 mb-6">
        This listing may have been removed, or the link may be incorrect. Try searching for
        similar properties.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Try Again
        </button>
        <a
          href="/search"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
        >
          Browse Properties
        </a>
      </div>
    </div>
  </div>
);

export default function Listing() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [landlord, setLandlord] = useState(null);
  const [contactLoading, setContactLoading] = useState(false);
  const [showScheduleTour, setShowScheduleTour] = useState(false);
  const [showMovingChecklist, setShowMovingChecklist] = useState(false);

  usePageTitle(listing ? `${listing.name || listing.title} | Basha Lagbe` : "Property Details", { raw: true });
  const { isCopied, copy } = useClipboard({ resetDelay: 2500 });
  const { currentUser } = useSelector((state) => state.user);
  const { addToCompare, toggleCompare, isInCompare, setIsCompareOpen } = useCompare();

  const fetchListing = async () => {
    try {
      setLoading(true);
      setError(false);
      const { apiRequest } = await import("../utils/apiUtils");
      // Decode URL-safe base64 ID back to raw MongoDB ObjectID
      const rawId = decodeId(listingId);
      const data = await apiRequest(`/server/listing/get/${rawId}`);
      if (data.success === false) {
        setError(true);
      } else {
        setListing(data);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [listingId]);

  const handleContactClick = async () => {
    if (!listing?.userRef) return;
    setContactLoading(true);
    try {
      const { apiRequest } = await import("../utils/apiUtils");
      // userRef is already a raw MongoDB ObjectID from the listing document
      const data = await apiRequest(`/server/user/${listing.userRef}`);
      if (data.success !== false) {
        setLandlord(data);
        setShowContactInfo(true);
      }
    } catch {
      // silent fail — fallback UI still shown
    } finally {
      setContactLoading(false);
    }
  };

  if (loading) return <ListingSkeleton />;
  if (error) return <ListingError onRetry={fetchListing} />;
  if (!listing) return null;

  const price = listing.offer
    ? listing.discountPrice
    : listing.regularPrice || listing.rentPrice;

  const amenityIcons = {
    wifi: WifiIcon,
    parking: TruckIcon,
    furnished: BuildingOfficeIcon,
  };

  return (
    <>
      <SEO
        title={`${listing.name || listing.title} in ${listing.location?.area || listing.address || "Bangladesh"}`}
        description={`${listing.description?.substring(0, 155) || "Verified rental property available on Basha Lagbe."}...`}
        image={listing.imageUrls?.[0]}
        url={`/listing/${listingId}`}
        type="article"
        schema={{
          "@context": "https://schema.org",
          "@type": "RealEstateListing",
          "name": listing.name || listing.title,
          "description": listing.description,
          "url": `https://bashalagbe.com/listing/${listingId}`,
          "image": listing.imageUrls?.[0],
          "address": {
            "@type": "PostalAddress",
            "streetAddress": listing.address || listing.location?.address,
            "addressLocality": listing.location?.area || listing.location?.district || "Dhaka",
            "addressCountry": "BD",
          },
          "offers": {
            "@type": "Offer",
            "price": price,
            "priceCurrency": "BDT",
          },
        }}
      />

      <main id="main-content">
        {/* ── Gallery ────────────────────────────────────────────────── */}
        <div className="relative">
          <Swiper
            navigation
            pagination={{ clickable: true }}
            className="h-[480px] md:h-[560px]"
          >
            {listing.imageUrls?.map((url, i) => (
              <SwiperSlide key={url}>
                <img
                  src={url}
                  alt={`${listing.name || listing.title} — photo ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-700 font-semibold px-4 py-2 rounded-full shadow hover:bg-white transition"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Back
          </button>

          {/* Compare button */}
          {listing && (
            <button
              onClick={() => toggleCompare(listing)}
              aria-label={isInCompare(listing._id) ? "Remove from comparison" : "Add to comparison"}
              className={`absolute top-4 right-28 z-20 flex items-center gap-1.5 backdrop-blur-sm font-semibold px-4 py-2 rounded-full shadow transition text-sm ${
                isInCompare(listing._id)
                  ? "bg-primary-600 text-white hover:bg-primary-700"
                  : "bg-white/90 text-gray-700 hover:bg-white"
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>{isInCompare(listing._id) ? "Comparing" : "Compare"}</span>
            </button>
          )}

          {/* Share button */}
          <button
            onClick={() => copy(window.location.href)}
            aria-label="Copy link to this listing"
            className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-700 font-semibold px-4 py-2 rounded-full shadow hover:bg-white transition"
          >
            <ShareIcon className="w-4 h-4" />
            {isCopied ? "Link copied!" : "Share"}
          </button>
        </div>

        {/* ── Main content grid ──────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left — details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Title & Badges */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {listing.verificationStatus === "verified" && (
                    <Badge color="green">
                      <CheckCircleIcon className="w-3.5 h-3.5 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {listing.featured && <Badge color="yellow">Featured</Badge>}
                  <Badge color="blue">{listing.propertyType || listing.type}</Badge>
                  {listing.type === "rent" && <Badge color="purple">For Rent</Badge>}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                  {listing.name || listing.title}
                </h1>

                <div className="flex items-center gap-2 text-gray-600">
                  <MapPinIcon className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span className="text-base">
                    {listing.address || `${listing.location?.area}, ${listing.location?.district}`}
                  </span>
                </div>
              </div>

              {/* Key stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Bedrooms", value: listing.bedrooms ?? "N/A", icon: HomeIcon },
                  { label: "Bathrooms", value: listing.bathrooms ?? "N/A", icon: HomeIcon },
                  { label: "Area", value: listing.squareFeet ? `${listing.squareFeet} sqft` : "N/A", icon: BuildingOfficeIcon },
                  { label: "Parking", value: listing.parking ? "Available" : "None", icon: TruckIcon },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100"
                  >
                    <stat.icon className="w-5 h-5 text-indigo-500 mx-auto mb-1" aria-hidden="true" />
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Property</h2>
                <p className="text-gray-600 leading-relaxed text-base">{listing.description}</p>
              </div>

              {/* Amenities */}
              {listing.amenities?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {listing.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional details */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    { label: "Furnished", value: listing.furnished ? "Yes" : "No" },
                    { label: "Property Type", value: listing.propertyType || listing.type || "N/A" },
                    { label: "Available From", value: listing.availableFrom ? new Date(listing.availableFrom).toLocaleDateString("en-BD") : "Immediately" },
                    { label: "Pets Allowed", value: listing.petsAllowed ? "Yes" : "Ask landlord" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <dt className="text-gray-500 font-medium">{label}</dt>
                      <dd className="text-gray-900 font-semibold mt-0.5">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </motion.div>

            {/* Right — price card + contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              {/* Price card */}
              <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-6 sticky top-24">
                <div className="mb-6">
                  <p className="text-sm text-gray-500 font-medium mb-1">Monthly Rent</p>
                  <p className="text-4xl font-black text-gray-900">
                    ৳{price?.toLocaleString("en-BD")}
                    <span className="text-lg font-normal text-gray-500">/mo</span>
                  </p>
                  {listing.offer && (
                    <p className="text-sm text-gray-400 line-through mt-1">
                      Regular: ৳{listing.regularPrice?.toLocaleString("en-BD")}
                    </p>
                  )}
                </div>

                <div className="space-y-3 mb-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                    Verified by Basha Lagbe
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-indigo-500 shrink-0" />
                    Available immediately
                  </div>
                  <div className="flex items-center gap-2">
                    <CurrencyDollarIcon className="w-4 h-4 text-yellow-500 shrink-0" />
                    No brokerage fee
                  </div>
                </div>

                {/* Contact section */}
                {currentUser && listing.userRef !== currentUser._id && (
                  <>
                    {!showContactInfo && (
                      <button
                        onClick={handleContactClick}
                        disabled={contactLoading}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg disabled:opacity-70"
                        aria-label="Contact landlord"
                      >
                        {contactLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <PhoneIcon className="w-5 h-5" />
                            Contact Landlord
                          </>
                        )}
                      </button>
                    )}

                    {showContactInfo && landlord && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-3"
                      >
                        <p className="font-semibold text-emerald-900 flex items-center gap-2">
                          <CheckCircleIcon className="w-5 h-5" />
                          Landlord Contact
                        </p>
                        <div className="space-y-2 text-sm">
                          <p className="font-medium text-gray-800">
                            {landlord.fullName || "Property Owner"}
                          </p>
                          {landlord.mobileNumber && (
                            <a
                              href={`tel:${landlord.mobileNumber}`}
                              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                              <PhoneIcon className="w-4 h-4" />
                              {landlord.mobileNumber}
                            </a>
                          )}
                          {landlord.email && (
                            <a
                              href={`mailto:${landlord.email}`}
                              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                              <EnvelopeIcon className="w-4 h-4" />
                              {landlord.email}
                            </a>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </>
                )}

                {!currentUser && (
                  <a
                    href="/sign-in"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg text-center"
                  >
                    Sign In to Contact
                  </a>
                )}

                {/* Schedule Viewing CTA */}
                {listing && (
                  <button
                    type="button"
                    onClick={() => setShowScheduleTour(true)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3.5 px-6 rounded-2xl transition-all duration-200 shadow-md text-sm mt-3"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Schedule a Viewing / Tour</span>
                  </button>
                )}

                {/* Compare CTA in Sidebar */}
                {listing && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!isInCompare(listing._id)) {
                        addToCompare(listing);
                      }
                      setIsCompareOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-primary-500 hover:bg-primary-50/50 text-gray-700 hover:text-primary-700 font-semibold py-3 px-4 rounded-2xl transition duration-200 mt-3 text-sm shadow-sm"
                  >
                    <Scale className="w-4 h-4 text-primary-600" />
                    <span>{isInCompare(listing._id) ? "View in Comparison (Active)" : "Compare with Similar Properties"}</span>
                  </button>
                )}

                {/* Moving & Legal Guide CTA */}
                <button
                  type="button"
                  onClick={() => setShowMovingChecklist(true)}
                  className="w-full flex items-center justify-center gap-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200 font-semibold py-3 px-4 rounded-2xl transition duration-200 mt-2 text-xs shadow-sm"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Tenant Moving & DMP Police Guide</span>
                </button>

                <p className="text-xs text-gray-400 text-center mt-4">
                  Listed by Basha Lagbe Verified Agent
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <ScheduleTourModal
        isOpen={showScheduleTour}
        onClose={() => setShowScheduleTour(false)}
        property={listing}
        landlord={landlord}
      />
      <MovingChecklistModal
        isOpen={showMovingChecklist}
        onClose={() => setShowMovingChecklist(false)}
      />
    </>
  );
}