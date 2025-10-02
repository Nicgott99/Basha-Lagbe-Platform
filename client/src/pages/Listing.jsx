import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { useSelector } from "react-redux";
import {
  FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare,
} from "react-icons/fa";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [landlord, setLandlord] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        // Import apiRequest utility
        const { apiRequest } = await import('../utils/apiUtils');
        
        // Updated endpoint to match server route - /get/:id is the correct endpoint
        const data = await apiRequest(`/server/listing/get/${params.listingId}`);
        
        if (data.success === false) {
          console.error('Error fetching listing:', data.message);
          setError(true);
        } else {
          setListing(data);
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const handleContactClick = async () => {
      if (!listing || !listing.userRef) return;
      try {
          // Import apiRequest utility
          const { apiRequest } = await import('../utils/apiUtils');
          
          // Updated endpoint to match server route - user info is at /user/:id
          const data = await apiRequest(`/server/user/${listing.userRef}`);
          
          if(data.success === false) {
              console.error('Error fetching landlord info:', data.message);
              return;
          }
          setLandlord(data);
          setShowContactInfo(true);
      } catch (error) {
          console.error('Error fetching landlord info:', error);
      }
  };

  if (loading) return <p className="text-center my-7 text-2xl">Loading...</p>;
  if (error) return <p className="text-center my-7 text-2xl">Something went wrong!</p>;

  return (
    <main>
      {listing && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}

          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
              </li>
               <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>

            {currentUser && listing.userRef !== currentUser._id && !showContactInfo && (
              <button onClick={handleContactClick} className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3">
                Contact Landlord
              </button>
            )}

            {showContactInfo && landlord && (
                <div className="bg-blue-100 p-4 rounded-lg mt-4 border border-blue-300">
                    <h3 className="font-semibold text-lg text-slate-800">Landlord Information</h3>
                    <p className="text-slate-600">Name: {landlord.fullName || 'Not available'}</p>
                    <p className="text-slate-600">Phone: {landlord.mobileNumber || 'Not available'}</p>
                    <p className="text-slate-600">Email: {landlord.email || 'Not available'}</p>
                </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}