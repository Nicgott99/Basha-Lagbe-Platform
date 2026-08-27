import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useThrottle
 * Returns a throttled version of a value that updates at most once per
 * `interval` milliseconds, regardless of how frequently the source changes.
 *
 * WHY THROTTLE vs DEBOUNCE:
 *   - useDebounce (already in the codebase) fires ONLY after the user STOPS
 *     changing a value for `delay` ms. Best for: search input, form validation.
 *   - useThrottle fires IMMEDIATELY on the first change, then at most once per
 *     `interval` ms while the source keeps changing. Best for: scroll handlers,
 *     window resize, mouse move, button spam protection.
 *
 * Example difference with interval/delay = 500ms:
 *   User types "ABCDE" in 100ms each (total 500ms):
 *   - Debounce: fires ONCE — 500ms after the last keystroke → "ABCDE"
 *   - Throttle: fires IMMEDIATELY → "A", then again 500ms later → "ABCDE"
 *
 * @param {*}      value     - The value to throttle (any type)
 * @param {number} interval  - Minimum milliseconds between updates (default 200ms)
 * @returns {*} The throttled value
 *
 * @example
 *   // Throttle scroll position — update at most every 100ms instead of every pixel
 *   const [scrollY, setScrollY] = useState(0);
 *   useEffect(() => {
 *     const handler = () => setScrollY(window.scrollY);
 *     window.addEventListener('scroll', handler);
 *     return () => window.removeEventListener('scroll', handler);
 *   }, []);
 *   const throttledScrollY = useThrottle(scrollY, 100);
 *   // Use throttledScrollY for expensive renders — saves ~90% of re-renders on fast scroll
 *
 * @example
 *   // Throttle window resize — avoid layout thrashing on every pixel
 *   const { width, height } = useWindowSize();
 *   const throttledWidth = useThrottle(width, 150);
 *
 * @example
 *   // Throttle search-as-you-type at a higher rate than debounce
 *   const [query, setQuery] = useState('');
 *   const throttledQuery = useThrottle(query, 300);
 *   useEffect(() => {
 *     if (throttledQuery) fetchSuggestions(throttledQuery);
 *   }, [throttledQuery]);
 *
 * @example
 *   // Throttle a rapidly-firing sensor value (e.g. geolocation watch)
 *   const { coordinates } = useGeolocation({ watch: true });
 *   const throttledCoords = useThrottle(coordinates, 1000);
 *   useEffect(() => {
 *     if (throttledCoords) updateMapMarker(throttledCoords);
 *   }, [throttledCoords]);
 */
const useThrottle = (value, interval = 200) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated                          = useRef(null);

  useEffect(() => {
    const now = Date.now();

    if (lastUpdated.current === null || now - lastUpdated.current >= interval) {
      // First call, or enough time has passed — update immediately
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      // Too soon — schedule an update for when the interval expires
      const remaining = interval - (now - lastUpdated.current);
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, remaining);

      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
};

/**
 * useThrottleCallback
 * Returns a throttled version of a callback function.
 * Useful when you need to throttle an event handler directly, rather than
 * a state value.
 *
 * @param {Function} callback  - The function to throttle
 * @param {number}   interval  - Minimum milliseconds between invocations
 * @param {Array}    [deps=[]] - Dependency array (like useCallback)
 * @returns {Function} Throttled callback
 *
 * @example
 *   // Throttle a button click handler — prevent form double-submit
 *   const handleSubmit = useThrottleCallback(async () => {
 *     await apiService.listing.create(formData);
 *   }, 2000, [formData]);
 *   return <button onClick={handleSubmit}>Submit</button>;
 *
 * @example
 *   // Throttle an analytics tracking call
 *   const trackScroll = useThrottleCallback(() => {
 *     analytics.track('scroll', { depth: window.scrollY });
 *   }, 1000);
 *   useEffect(() => {
 *     window.addEventListener('scroll', trackScroll);
 *     return () => window.removeEventListener('scroll', trackScroll);
 *   }, [trackScroll]);
 */
export const useThrottleCallback = (callback, interval = 200, deps = []) => {
  const lastCalled = useRef(null);
  const timeout    = useRef(null);

  const throttled = useCallback((...args) => {
    const now = Date.now();

    if (lastCalled.current === null || now - lastCalled.current >= interval) {
      lastCalled.current = now;
      callback(...args);
    } else {
      // Queue a trailing call
      clearTimeout(timeout.current);
      const remaining = interval - (now - lastCalled.current);
      timeout.current = setTimeout(() => {
        lastCalled.current = Date.now();
        callback(...args);
      }, remaining);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval, ...deps]);

  // Clean up pending timer on unmount
  useEffect(() => () => clearTimeout(timeout.current), []);

  return throttled;
};

export default useThrottle;
