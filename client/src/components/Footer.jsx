import { Link } from "react-router-dom";
import {
  HomeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

/**
 * Footer
 * Global site footer shown on every public page.
 * Includes: brand blurb, quick links, contact info, and copyright.
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "Search Properties", to: "/search" },
    { label: "About Us", to: "/about" },
    { label: "Sign In", to: "/sign-in" },
    { label: "Create Account", to: "/sign-up" },
  ];

  const propertyTypes = [
    { label: "Apartments", to: "/search?propertyType=apartment" },
    { label: "Houses", to: "/search?propertyType=house" },
    { label: "Studios", to: "/search?propertyType=studio" },
    { label: "Rooms", to: "/search?propertyType=room" },
    { label: "Commercial", to: "/search?propertyType=commercial" },
  ];

  return (
    <footer className="bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <HomeIcon className="w-7 h-7 text-yellow-400 mr-2" />
              <span className="text-2xl font-bold">
                <span className="text-white">Basha</span>
                <span className="text-yellow-400 ml-1">Lagbe</span>
              </span>
            </div>
            <p className="text-indigo-200 text-sm leading-relaxed mb-5">
              Bangladesh&apos;s most trusted property rental platform. Find
              verified listings, connect with landlords, and discover your
              perfect home — all in one place.
            </p>
            <p className="text-indigo-300 text-xs italic">
              &quot;বাসা লাগবে&quot; — Need a Home
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-yellow-400 font-semibold text-sm uppercase tracking-wide mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-indigo-200 hover:text-yellow-400 text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-yellow-400 font-semibold text-sm uppercase tracking-wide mb-4">
              Property Types
            </h3>
            <ul className="space-y-2">
              {propertyTypes.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-indigo-200 hover:text-yellow-400 text-sm transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-yellow-400 font-semibold text-sm uppercase tracking-wide mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-indigo-200">
                <MapPinIcon className="w-4 h-4 mt-0.5 text-yellow-400 shrink-0" />
                Dhaka, Bangladesh
              </li>
              <li className="flex items-center gap-2 text-sm text-indigo-200">
                <PhoneIcon className="w-4 h-4 text-yellow-400 shrink-0" />
                +880 1700-000000
              </li>
              <li className="flex items-center gap-2 text-sm text-indigo-200">
                <EnvelopeIcon className="w-4 h-4 text-yellow-400 shrink-0" />
                support@bashalagbe.com
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-indigo-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-indigo-300 text-xs">
            &copy; {currentYear} Basha Lagbe. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs text-indigo-400">
            <Link to="/about" className="hover:text-yellow-400 transition-colors duration-200">Privacy Policy</Link>
            <Link to="/about" className="hover:text-yellow-400 transition-colors duration-200">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
