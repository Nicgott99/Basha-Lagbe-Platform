import { useState, useEffect, useCallback } from "react";

/**
 * useGeolocation
 * Requests the user's current geographic position using the browser's
 * Geolocation API and returns the coordinates along with status/error state.
 *
 * Problem it solves for Basha Lagbe:
 *   Users searching for rental properties near their current location have
 *   to manually type their area/district into the search filters. This hook
 *   enables "Search Near Me" functionality — auto-detect position and
 *   filter properties by proximity.
 *
 * Privacy:
 *   - The browser always shows a permission prompt before any location
 *     data is accessed. The hook never silently collects location.
 *   - `isPermissionDenied` is set to true when the user refuses, so the
 *     UI can hide the "Near Me" button rather than showing a confusing error.
 *
 * @param {Object}  [options]
 * @param {boolean} [options.immediate=false]
 *   When true, requests location as soon as the component mounts.
 *   When false (default), location is only fetched on `getLocation()` call.
 * @param {boolean} [options.watch=false]
 *   When true, continuously watches the position (e.g. for a live map).
 *   Uses watchPosition instead of getCurrentPosition.
 * @param {number}  [options.timeout=10000]
 *   Milliseconds before the geolocation request times out (default 10s).
 * @param {boolean} [options.enableHighAccuracy=false]
 *   When true, requests GPS-level accuracy (uses more battery).
 *
 * @returns {Object}
 *   @property {GeolocationCoordinates|null} coordinates
 *     { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed }
 *   @property {boolean} loading      - true while a position request is in flight
 *   @property {string|null} error    - Error message if request failed
 *   @property {boolean} isSupported  - false on browsers without Geolocation API
 *   @property {boolean} isPermissionDenied - true when user refused the permission prompt
 *   @property {Function} getLocation - Call to (re-)request the current position
 *   @property {Function} clearLocation - Reset all state back to initial values
 *
 * @example
 *   // "Near Me" button on Search page
 *   const { coordinates, loading, error, isPermissionDenied, getLocation } = useGeolocation();
 *
 *   return (
 *     <button
 *       onClick={getLocation}
 *       disabled={loading || isPermissionDenied}
 *     >
 *       {loading ? 'Detecting...' : '📍 Near Me'}
 *     </button>
 *   );
 *
 * @example
 *   // Auto-detect on mount
 *   const { coordinates } = useGeolocation({ immediate: true });
 *   useEffect(() => {
 *     if (coordinates) fetchNearbyProperties(coordinates.latitude, coordinates.longitude);
 *   }, [coordinates]);
 *
 * @example
 *   // Live tracking (e.g. moving map)
 *   const { coordinates } = useGeolocation({ watch: true, enableHighAccuracy: true });
 *
 * @example
 *   // Only show the button if supported and not denied
 *   const { isSupported, isPermissionDenied } = useGeolocation();
 *   if (!isSupported || isPermissionDenied) return null;
 */
const useGeolocation = ({
  immediate         = false,
  watch             = false,
  timeout           = 10_000,
  enableHighAccuracy = false,
} = {}) => {
  const [coordinates,        setCoordinates]        = useState(null);
  const [loading,            setLoading]            = useState(false);
  const [error,              setError]              = useState(null);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);

  const isSupported = typeof navigator !== "undefined" && "geolocation" in navigator;

  const positionOptions = {
    enableHighAccuracy,
    timeout,
    maximumAge: 60_000,  // Use a cached position up to 1 minute old
  };

  const onSuccess = useCallback((position) => {
    setCoordinates(position.coords);
    setLoading(false);
    setError(null);
  }, []);

  const onError = useCallback((err) => {
    setLoading(false);
    if (err.code === GeolocationPositionError.PERMISSION_DENIED) {
      setIsPermissionDenied(true);
      setError("Location permission denied. Please allow access in your browser settings.");
    } else if (err.code === GeolocationPositionError.TIMEOUT) {
      setError("Location request timed out. Please try again.");
    } else {
      setError("Could not determine your location. Please try again.");
    }
  }, []);

  const getLocation = useCallback(() => {
    if (!isSupported) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(onSuccess, onError, positionOptions);
  }, [isSupported, onSuccess, onError, positionOptions]);

  const clearLocation = useCallback(() => {
    setCoordinates(null);
    setLoading(false);
    setError(null);
    setIsPermissionDenied(false);
  }, []);

  // Immediate mode: fetch on mount
  useEffect(() => {
    if (immediate && isSupported) getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, isSupported]);

  // Watch mode: continuously track position
  useEffect(() => {
    if (!watch || !isSupported) return;
    setLoading(true);
    const watchId = navigator.geolocation.watchPosition(
      onSuccess,
      onError,
      positionOptions
    );
    return () => navigator.geolocation.clearWatch(watchId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch, isSupported]);

  return {
    coordinates,
    loading,
    error,
    isSupported,
    isPermissionDenied,
    getLocation,
    clearLocation,
  };
};

export default useGeolocation;
