import { useState, useEffect } from "react";
import useEventListener from "./useEventListener";

/**
 * useNetworkSpeed
 * Detects the user's network connection quality using the browser's
 * Network Information API (navigator.connection).
 *
 * Problem it solves:
 *   The app loads full-resolution property images and runs Framer Motion
 *   animations regardless of the user's connection quality. On 2G/slow-3G
 *   connections (common in Bangladesh), this causes very slow page loads.
 *   This hook gives components the data they need to adapt:
 *   - Show lower-quality image thumbnails instead of full images
 *   - Disable or reduce heavy animations
 *   - Show a "Slow connection detected" banner to set user expectations
 *
 * Pairs naturally with:
 *   - useOnlineStatus (already in codebase) — for detecting offline state
 *   - OfflineBanner (already in codebase) — can be extended to show slow-net warning
 *
 * Browser support:
 *   The Network Information API is supported in Chrome/Edge/Android Chrome.
 *   Safari and Firefox do not support it. This hook gracefully returns
 *   { isSlowConnection: false, effectiveType: 'unknown' } on unsupported browsers.
 *
 * @returns {Object}
 *   @property {string}  effectiveType
 *     One of: '2g' | '3g' | '4g' | 'slow-2g' | 'unknown'
 *   @property {number|null} downlink
 *     Estimated bandwidth in Mbps (null when unsupported)
 *   @property {number|null} rtt
 *     Round-trip time in milliseconds (null when unsupported)
 *   @property {boolean} saveData
 *     True if the user has enabled "Data Saver" in their browser/OS
 *   @property {boolean} isSlowConnection
 *     Convenience boolean — true when effectiveType is 'slow-2g' or '2g',
 *     OR when saveData is true. Use this as the primary conditional in components.
 *   @property {boolean} isSupported
 *     True if the Network Information API is available in this browser
 *
 * @example
 *   // Reduce image quality on slow connections
 *   const { isSlowConnection } = useNetworkSpeed();
 *   const imgSrc = isSlowConnection ? property.thumbnailUrl : property.imageUrl;
 *
 * @example
 *   // Disable animations on slow connections
 *   const { isSlowConnection } = useNetworkSpeed();
 *   <motion.div
 *     animate={isSlowConnection ? {} : { opacity: 1, y: 0 }}
 *     initial={isSlowConnection ? {} : { opacity: 0, y: 20 }}
 *   >
 *
 * @example
 *   // Show connection quality badge
 *   const { effectiveType, downlink } = useNetworkSpeed();
 *   return <span>{effectiveType.toUpperCase()} — {downlink} Mbps</span>;
 *
 * @example
 *   // Respect Data Saver mode
 *   const { saveData } = useNetworkSpeed();
 *   if (saveData) return <LightweightView />;
 *   return <FullView />;
 */

const getConnectionState = (connection) => {
  if (!connection) {
    return {
      effectiveType:    "unknown",
      downlink:         null,
      rtt:              null,
      saveData:         false,
      isSlowConnection: false,
      isSupported:      false,
    };
  }

  const effectiveType = connection.effectiveType ?? "unknown";
  const saveData      = connection.saveData ?? false;
  const isSlowConnection =
    saveData || effectiveType === "slow-2g" || effectiveType === "2g";

  return {
    effectiveType,
    downlink:    connection.downlink ?? null,
    rtt:         connection.rtt     ?? null,
    saveData,
    isSlowConnection,
    isSupported: true,
  };
};

const useNetworkSpeed = () => {
  const connection = navigator.connection
    ?? navigator.mozConnection
    ?? navigator.webkitConnection
    ?? null;

  const [state, setState] = useState(() => getConnectionState(connection));

  // Update state whenever the connection quality changes
  // (e.g. user moves between WiFi and mobile data, or signal degrades)
  const handleChange = () => {
    setState(getConnectionState(connection));
  };

  useEventListener("change", handleChange, connection);

  // Also re-read on visibility change (connection may have changed while tab was hidden)
  useEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      setState(getConnectionState(connection));
    }
  }, document);

  return state;
};

export default useNetworkSpeed;
