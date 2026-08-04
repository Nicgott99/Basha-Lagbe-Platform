import { useState, useEffect } from "react";

/**
 * useOnlineStatus
 * Returns the current browser network connectivity state and updates
 * reactively whenever the user goes online or offline.
 *
 * Uses the standard `navigator.onLine` property backed by the `online` and
 * `offline` window events — no polling, no external libraries.
 *
 * @returns {{ isOnline: boolean, isOffline: boolean, since: Date|null }}
 *   - isOnline  — true when the browser reports a network connection
 *   - isOffline — convenience inverse of isOnline
 *   - since     — Date object recording when the current status started
 *                 (useful for showing "Offline for 3 minutes" messages)
 *
 * @example
 *   const { isOnline, isOffline } = useOnlineStatus();
 *   if (isOffline) return <OfflineBanner />;
 *
 * @example
 *   const { isOnline, since } = useOnlineStatus();
 *   const offlineMinutes = Math.floor((Date.now() - since) / 60000);
 */
const useOnlineStatus = () => {
  const [status, setStatus] = useState(() => ({
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    since:    new Date(),
  }));

  useEffect(() => {
    if (typeof window === "undefined") return;

    const goOnline = () =>
      setStatus({ isOnline: true,  since: new Date() });

    const goOffline = () =>
      setStatus({ isOnline: false, since: new Date() });

    window.addEventListener("online",  goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online",  goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return {
    isOnline:  status.isOnline,
    isOffline: !status.isOnline,
    since:     status.since,
  };
};

export default useOnlineStatus;
