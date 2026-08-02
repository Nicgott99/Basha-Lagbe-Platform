import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import useWindowSize from "../hooks/useWindowSize";

/**
 * BackToTop
 * A floating action button that appears once the user scrolls more than
 * 300px down the page. Clicking it smoothly scrolls back to the top.
 *
 * Place this component once in App.jsx (outside <Routes>) so it is
 * available on every page without re-mounting.
 */
const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isMobile } = useWindowSize(); // hide on very small screens to avoid overlap

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 300px down
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && !isMobile && (
        <motion.button
          key="back-to-top"
          onClick={scrollToTop}
          aria-label="Back to top"
          title="Back to top"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.95 }}
          className={[
            "fixed bottom-6 right-6 z-50",
            "w-12 h-12 rounded-full",
            "bg-gradient-to-br from-blue-600 to-indigo-700",
            "text-white shadow-lg shadow-blue-500/40",
            "flex items-center justify-center",
            "hover:shadow-xl hover:shadow-blue-500/50",
            "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2",
            "transition-shadow duration-200",
          ].join(" ")}
        >
          <ChevronUpIcon className="w-5 h-5 stroke-2" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
