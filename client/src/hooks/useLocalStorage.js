import { useState, useEffect } from "react";

/**
 * useLocalStorage
 * A drop-in replacement for useState that persists the value to localStorage.
 * The stored value survives page refreshes and browser restarts.
 *
 * @param {string} key          - The localStorage key to read/write
 * @param {*}      initialValue - Default value when no stored value exists
 * @returns {[*, Function]}     - [storedValue, setValue] — same API as useState
 *
 * @example
 *   // Persist search filters across sessions
 *   const [filters, setFilters] = useLocalStorage("search-filters", {
 *     propertyType: "",
 *     district: "",
 *     priceRange: { min: "", max: "" }
 *   });
 *
 * @example
 *   // Remember user preference
 *   const [viewMode, setViewMode] = useLocalStorage("view-mode", "grid");
 */
const useLocalStorage = (key, initialValue) => {
  // Initialise state from localStorage (or fall back to initialValue)
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Return parsed value if it exists, otherwise return the initial value
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (error) {
      // localStorage may be unavailable (e.g. private browsing, quota exceeded)
      console.warn(`useLocalStorage: could not read key "${key}":`, error);
      return initialValue;
    }
  });

  // Sync to localStorage whenever the value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`useLocalStorage: could not write key "${key}":`, error);
    }
  }, [key, storedValue]);

  /**
   * setValue — mirrors the setState API.
   * Accepts either a direct value or an updater function: setValue(prev => newVal)
   */
  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    } catch (error) {
      console.warn(`useLocalStorage: setValue failed for key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
