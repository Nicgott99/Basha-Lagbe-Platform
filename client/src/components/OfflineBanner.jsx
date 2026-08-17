import { motion, AnimatePresence } from "framer-motion";
import { WifiIcon, ExclamationTriangleIcon, SignalIcon } from "@heroicons/react/24/outline";
import useOnlineStatus from "../hooks/useOnlineStatus";
import useNetworkSpeed from "../hooks/useNetworkSpeed";

/**
 * OfflineBanner
 * A persistent top banner that adapts to network quality:
 *   1. OFFLINE  — orange banner shown when user loses internet
 *   2. SLOW NET — blue banner shown on 2G/slow-2G/Data-Saver connections
 *   3. ONLINE + FAST — no banner rendered
 *
 * Uses useOnlineStatus + useNetworkSpeed internally — no props needed.
 * Place once in App.jsx (inside BrowserRouter, outside Routes).
 */
const OfflineBanner = () => {
  const { isOffline }                              = useOnlineStatus();
  const { isSlowConnection, effectiveType, saveData } = useNetworkSpeed();
  const showBanner = isOffline || isSlowConnection;

  const getBannerContent = () => {
    if (isOffline) {
      return {
        text: "You're offline — some features may be unavailable.",
        color: "from-amber-500 to-orange-500",
        icon: <ExclamationTriangleIcon className="w-4 h-4 shrink-0" />
      };
    }
    const slowLabel = saveData
      ? "Data Saver mode is on — images may be lower quality."
      : `Slow connection (${effectiveType.toUpperCase()}) — pages may load slowly.`;
    return {
      text:  slowLabel,
      color: "from-blue-500 to-indigo-500",
      icon:  <SignalIcon className="w-4 h-4 shrink-0" />,
    };
  };

  const content = getBannerContent();

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          key="status-banner"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          role="alert"
          aria-live="assertive"
          className={[
            "fixed top-0 left-0 right-0 z-[9999]",
            `bg-gradient-to-r ${content.color}`,
            "text-white text-sm font-medium",
            "flex items-center justify-center gap-2 px-4 py-2.5",
            "shadow-lg",
          ].join(" ")}
        >
          {content.icon}
          <span>{content.text}</span>
          <WifiIcon className="w-4 h-4 shrink-0 opacity-70" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineBanner;
