import { motion, AnimatePresence } from "framer-motion";
import { WifiIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import useOnlineStatus from "../hooks/useOnlineStatus";

/**
 * OfflineBanner
 * A persistent top banner that slides down when the user loses network
 * connectivity, and disappears again when they come back online.
 *
 * Uses the useOnlineStatus hook internally — no props needed.
 * Place once in App.jsx (inside BrowserRouter, outside Routes) so it is
 * available on every page.
 *
 * @example
 *   // In App.jsx
 *   <OfflineBanner />
 *   <Header />
 *   <Routes>...</Routes>
 */
const OfflineBanner = () => {
  const { isOffline } = useOnlineStatus();

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          key="offline-banner"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          exit={{    y: -60, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          role="alert"
          aria-live="assertive"
          className={[
            "fixed top-0 left-0 right-0 z-[9999]",
            "bg-gradient-to-r from-amber-500 to-orange-500",
            "text-white text-sm font-medium",
            "flex items-center justify-center gap-2 px-4 py-2.5",
            "shadow-lg",
          ].join(" ")}
        >
          <ExclamationTriangleIcon className="w-4 h-4 shrink-0" />
          <span>
            You&apos;re offline — some features may be unavailable.
          </span>
          <WifiIcon className="w-4 h-4 shrink-0 opacity-70" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineBanner;
