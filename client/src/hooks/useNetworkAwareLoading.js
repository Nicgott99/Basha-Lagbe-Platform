import { useMemo } from "react";
import useNetworkSpeed from "./useNetworkSpeed";
import useOnlineStatus from "./useOnlineStatus";

/**
 * useNetworkAwareLoading
 * Derives actionable loading strategy decisions from the user's current
 * network condition. Builds on top of `useNetworkSpeed` and `useOnlineStatus`
 * to give components a single, declarative object describing what to load
 * and how to render — without duplicating logic everywhere.
 *
 * Problem it solves:
 *   `useNetworkSpeed` detects connection quality but returns raw data
 *   (effectiveType, downlink, rtt). Components still need to decide:
 *   - Should I lazy-load images or eager-load them?
 *   - Should I use the thumbnail or full-res image?
 *   - Should I run Framer Motion animations or skip them to save CPU/bandwidth?
 *   - Should I paginate more aggressively (fewer items) on slow connections?
 *   - Should I show a "slow connection" warning banner?
 *
 *   This hook codifies those decisions in one place so all components
 *   get consistent behaviour without each needing their own network logic.
 *
 * Bangladesh context:
 *   Many users in Bangladesh browse on 2G/3G connections (Grameenphone, Robi, Banglalink).
 *   Full-resolution property images (600KB+) on 2G (~100kbps) take 48+ seconds.
 *   Adapting to connection speed is a significant UX improvement for this audience.
 *
 * @param {Object} [options]
 * @param {boolean} [options.respectDataSaver=true]
 *   When true, treat "Data Saver" mode the same as a slow connection.
 * @param {number}  [options.slowRttThreshold=400]
 *   RTT above this value (ms) is treated as "slow" even if effectiveType is '3g'.
 *   (400ms RTT is typical of congested 3G in busy urban areas.)
 *
 * @returns {Object}
 *   @property {'fast'|'medium'|'slow'|'offline'} quality
 *     Overall quality tier — the primary conditional to use in components.
 *   @property {boolean} isOffline
 *     True when the browser reports no network connection.
 *   @property {boolean} isSlow
 *     True for slow-2g, 2g, Data Saver mode, or very high RTT.
 *   @property {boolean} isMedium
 *     True for 3g connections.
 *   @property {boolean} isFast
 *     True for 4g and above (or when API is unsupported — assume fast).
 *   @property {boolean} shouldLazyLoad
 *     True when lazy loading images is recommended (always true except on fast
 *     connections where aggressive pre-fetching may be acceptable).
 *   @property {boolean} shouldReduceMotion
 *     True when Framer Motion animations should be disabled or minimised.
 *     (Also respects prefers-reduced-motion media query.)
 *   @property {boolean} shouldUseLowRes
 *     True when thumbnail/low-res image URLs should be preferred.
 *   @property {number}  pageSize
 *     Recommended number of items to load per page (fewer on slow connections
 *     to reduce load time and data usage).
 *   @property {boolean} showSlowBanner
 *     True when a "Slow connection detected" banner should be visible to the user.
 *   @property {string}  effectiveType
 *     Raw effectiveType from useNetworkSpeed ('2g'|'3g'|'4g'|'slow-2g'|'unknown').
 *   @property {boolean} saveData
 *     Raw saveData flag from useNetworkSpeed (browser Data Saver mode).
 *
 * @example
 *   // Adapt PropertyCard image quality
 *   const { shouldUseLowRes, shouldReduceMotion } = useNetworkAwareLoading();
 *   const imgSrc = shouldUseLowRes
 *     ? property.thumbnailUrl || property.imageUrls?.[0]
 *     : property.imageUrls?.[0];
 *
 *   <motion.div
 *     initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
 *     animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
 *   >
 *
 * @example
 *   // Adjust page size in Search results
 *   const { pageSize, showSlowBanner, quality } = useNetworkAwareLoading();
 *   // Fast: 12 results/page | Medium: 8 | Slow: 4 | Offline: 0
 *
 *   {showSlowBanner && (
 *     <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded px-4 py-2 text-sm">
 *       ⚠️ Slow connection detected. Showing reduced content to save data.
 *     </div>
 *   )}
 *
 * @example
 *   // Full conditional rendering by quality tier
 *   const { quality } = useNetworkAwareLoading();
 *   if (quality === 'offline') return <OfflineState />;
 *   if (quality === 'slow')    return <LightweightListing />;
 *   return <FullListing />;
 *
 * @example
 *   // Conditionally load heavy map component
 *   const { isSlow, isOffline } = useNetworkAwareLoading();
 *   return (isSlow || isOffline) ? null : <MapView />;
 */
const useNetworkAwareLoading = ({
  respectDataSaver  = true,
  slowRttThreshold  = 400,
} = {}) => {
  const network = useNetworkSpeed();
  const isOnline = useOnlineStatus();

  // ── Prefer prefers-reduced-motion CSS media query ─────────────────────────
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  return useMemo(() => {
    // ── Offline takes priority over everything else ────────────────────────
    if (!isOnline) {
      return {
        quality:            "offline",
        isOffline:          true,
        isSlow:             false,
        isMedium:           false,
        isFast:             false,
        shouldLazyLoad:     false,
        shouldReduceMotion: true,
        shouldUseLowRes:    true,
        pageSize:           0,
        showSlowBanner:     false,
        effectiveType:      network.effectiveType,
        saveData:           network.saveData,
      };
    }

    // ── Classify connection quality ────────────────────────────────────────
    const isSlow =
      network.effectiveType === "slow-2g" ||
      network.effectiveType === "2g" ||
      (respectDataSaver && network.saveData) ||
      (network.rtt !== null && network.rtt > slowRttThreshold);

    const isMedium = !isSlow && network.effectiveType === "3g";

    // 4g, unknown (API not supported → assume fast), or not classified
    const isFast = !isSlow && !isMedium;

    const quality = isSlow ? "slow" : isMedium ? "medium" : "fast";

    return {
      quality,
      isOffline:  false,
      isSlow,
      isMedium,
      isFast,
      // Lazy-load on slow/medium, aggressive pre-fetch on fast
      shouldLazyLoad:     isSlow || isMedium,
      // Reduce animations on slow connections OR if OS prefers-reduced-motion
      shouldReduceMotion: isSlow || prefersReducedMotion,
      // Use thumbnail/low-res on slow connections to save bandwidth
      shouldUseLowRes:    isSlow,
      // Fewer items per page on slower connections
      pageSize:           isSlow ? 4 : isMedium ? 8 : 12,
      // Only show the slow banner when truly slow (not just medium)
      showSlowBanner:     isSlow && network.isSupported,
      effectiveType:      network.effectiveType,
      saveData:           network.saveData,
    };
  }, [
    isOnline,
    network.effectiveType,
    network.saveData,
    network.rtt,
    network.isSupported,
    respectDataSaver,
    slowRttThreshold,
    prefersReducedMotion,
  ]);
};

export default useNetworkAwareLoading;
