import { useState, useEffect } from "react";

/**
 * useDebounce
 * Delays updating the returned value until the specified delay has passed
 * since the last change to `value`. Useful for search inputs to avoid
 * firing an API call on every keystroke.
 *
 * @param {*}      value  - The value to debounce (typically a search string)
 * @param {number} delay  - Delay in milliseconds (default: 300ms)
 * @returns {*}  The debounced value — only updates after the user stops typing
 *
 * @example
 *   const debouncedQuery = useDebounce(searchQuery, 400);
 *   useEffect(() => { fetchResults(debouncedQuery); }, [debouncedQuery]);
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Start a timer that updates the debounced value after `delay` ms
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel the previous timer if value or delay changed
    // This is the key mechanism — the cleanup runs before the next effect,
    // so the timer only fires if the value stopped changing for `delay` ms
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
