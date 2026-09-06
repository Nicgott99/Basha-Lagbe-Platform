import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlassIcon, HomeIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";

/**
 * MobileStickyCTA
 * Shows a sticky bottom CTA bar on mobile only.
 * - On public pages: "Search Homes" + "List Property"
 * - On auth pages / admin: hidden
 * Disappears when the user scrolls near the footer.
 */
const HIDDEN_PATHS = ["/sign-in", "/sign-up", "/forgot-password", "/admin", "/admin-dashboard", "/thank-you", "/privacy-policy", "/terms", "/accessibility"];

const MobileStickyCTA = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  // Hide on certain pages
  const isHidden = HIDDEN_PATHS.some((p) => location.pathname.startsWith(p));
  if (isHidden) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 28 }}
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
        role="navigation"
        aria-label="Quick actions"
      >
        {/* Gradient fade above the bar */}
        <div className="h-6 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />

        <div className="bg-white border-t border-gray-200 shadow-2xl px-4 py-3 flex gap-3 safe-area-bottom">
          <button
            onClick={() => navigate("/search")}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold py-3 rounded-xl text-sm shadow-lg active:scale-95 transition-transform"
            aria-label="Search properties"
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
            Search Homes
          </button>

          <button
            onClick={() => navigate(currentUser ? "/add-property" : "/sign-up")}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold py-3 rounded-xl text-sm shadow-lg active:scale-95 transition-transform"
            aria-label={currentUser ? "List your property" : "Sign up to list property"}
          >
            <HomeIcon className="w-4 h-4" />
            List Property
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileStickyCTA;
