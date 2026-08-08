import { useRef, useEffect } from "react";

/**
 * usePrevious
 * Returns the value that a variable held during the previous render.
 * On the very first render, returns `undefined` (or the provided `initialValue`).
 *
 * This pattern is extremely common but repetitive to implement each time.
 * It replaces manual `useRef + useEffect` tracking throughout the codebase.
 *
 * @template T
 * @param {T} value         - The current value to track
 * @param {T} [initialValue] - Value to return on the first render (defaults to undefined)
 * @returns {T | undefined}  - The value from the previous render
 *
 * @example
 *   // Detect when a loading state transitions from true to false
 *   const prevLoading = usePrevious(loading);
 *   useEffect(() => {
 *     if (prevLoading && !loading) {
 *       console.log('Loading just finished');
 *     }
 *   }, [loading, prevLoading]);
 *
 * @example
 *   // Animate a counter going up vs down
 *   const prevCount = usePrevious(count);
 *   const direction = count > (prevCount ?? count) ? 'up' : 'down';
 *
 * @example
 *   // Know the previous page for breadcrumb navigation
 *   const prevPage = usePrevious(currentPage);
 *
 * @example
 *   // Provide an initialValue so the first render has a known baseline
 *   const prevScore = usePrevious(score, 0);
 */
const usePrevious = (value, initialValue = undefined) => {
  const ref = useRef(initialValue);

  // After every render, store the current value in the ref
  // so it is available as "previous" on the NEXT render
  useEffect(() => {
    ref.current = value;
  });

  // Return the ref value which still holds the value from LAST render
  return ref.current;
};

export default usePrevious;
