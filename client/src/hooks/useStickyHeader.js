import { useState, useEffect, useRef } from "react";
import useThrottle from "./useThrottle";

/**
 * useStickyHeader
 * Tracks whether the user has scrolled past a given threshold and returns
 * a `isSticky` boolean. Use it to change the header's style (e.g. add a
 * background, shadow, or shrink the logo) once the page has been scrolled.
 *
 * Uses a passive scroll listener backed by requestAnimationFrame so it never
 * blocks the main thread. scrollY state is additionally throttled via
 * useThrottle to reduce React re-renders from ~60/s to ~12/s on fast scroll,
 * while keeping the sticky transition visually immediate.
 *
 * @param {Object} [options]
 * @param {number}  [options.threshold=0]    - Scroll Y position (px) at which isSticky becomes true
 * @param {boolean} [options.hysteresis=false] - When true, isSticky stays true until the user
 *                                               scrolls back to within 10px of the top.
 *                                               Prevents flickering near the threshold.
 * @param {number}  [options.throttleMs=80]  - How often (ms) to update scrollY state.
 *                                             Lower = more responsive but more re-renders.
 *                                             Default 80ms ≈ 12fps — imperceptible lag for headers.
 *
 * @returns {{ isSticky: boolean, scrollY: number }}
 *   - isSticky — true when scrolled past threshold
 *   - scrollY  — throttled current window.scrollY value
 *
 * @example
 *   // In Header.jsx
 *   const { isSticky } = useStickyHeader({ threshold: 80 });
 *   return (
 *     <header className={isSticky ? 'bg-white shadow-md' : 'bg-transparent'}>
 *       ...
 *     </header>
 *   );
 *
 * @example
 *   // Show scroll progress
 *   const { scrollY } = useStickyHeader();
 *   const progress = Math.min(scrollY / 500, 1); // 0 to 1 over 500px
 *
 * @example
 *   // With hysteresis to prevent flicker
 *   const { isSticky } = useStickyHeader({ threshold: 60, hysteresis: true });
 *
 * @example
 *   // High-frequency update (reduce throttle for live parallax effect)
 *   const { scrollY } = useStickyHeader({ throttleMs: 16 }); // ~60fps
 */
const useStickyHeader = ({ threshold = 0, hysteresis = false, throttleMs = 80 } = {}) => {
  const [rawScrollY, setRawScrollY] = useState(0);
  const [isSticky,   setIsSticky]   = useState(false);
  const ticking                     = useRef(false); // RAF guard

  // Throttle the scrollY value — fewer re-renders, same visual result
  const scrollY = useThrottle(rawScrollY, throttleMs);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        setRawScrollY(currentScrollY);

        if (hysteresis) {
          // Become sticky once over threshold; only unstick within 10px of top
          setIsSticky((prev) => {
            if (!prev && currentScrollY > threshold) return true;
            if (prev  && currentScrollY <= 10)       return false;
            return prev;
          });
        } else {
          setIsSticky(currentScrollY > threshold);
        }

        ticking.current = false;
      });

      ticking.current = true;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once to set initial state if page loads mid-scroll (e.g. browser back)
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold, hysteresis]);

  return { isSticky, scrollY };
};

export default useStickyHeader;
