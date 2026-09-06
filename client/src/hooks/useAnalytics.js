import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initAnalytics, trackPageView } from "../utils/analytics";

/**
 * useAnalytics
 *
 * Initializes analytics on mount and tracks page views on every route change.
 * Respects cookie consent — no data is sent if the user has not consented.
 *
 * Usage: Drop `useAnalytics()` once inside AppRoutes (already inside BrowserRouter).
 */
function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Attempt to boot GA (no-op if consent not granted or VITE_GA_ID missing)
    initAnalytics();
  }, []);

  useEffect(() => {
    // Track every navigation
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);
}

export default useAnalytics;
