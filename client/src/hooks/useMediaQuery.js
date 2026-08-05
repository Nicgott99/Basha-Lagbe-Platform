import { useState, useEffect, useCallback } from "react";

/**
 * useMediaQuery
 * A hook that evaluates a CSS media query string and returns a boolean
 * that updates reactively whenever the result changes (e.g. on resize or
 * device orientation change).
 *
 * More flexible than useWindowSize — matches any CSS media feature:
 *   - (max-width: 768px)
 *   - (prefers-color-scheme: dark)
 *   - (prefers-reduced-motion: reduce)
 *   - (min-width: 1024px) and (max-width: 1280px)
 *
 * Uses the native `window.matchMedia` API with a MediaQueryList listener
 * so it responds to changes without polling.
 *
 * @param {string} query - A valid CSS media query string
 * @returns {boolean} - true when the media query matches
 *
 * @example
 *   const isMobile = useMediaQuery('(max-width: 767px)');
 *
 * @example
 *   const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 *   const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 *
 * @example
 *   // Tailwind breakpoint equivalents
 *   const isMd = useMediaQuery('(min-width: 768px)');   // md
 *   const isLg = useMediaQuery('(min-width: 1024px)');  // lg
 *   const isXl = useMediaQuery('(min-width: 1280px)');  // xl
 */
const useMediaQuery = (query) => {
  const getMatches = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  }, [query]);

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQueryList = window.matchMedia(query);

    // Sync immediately in case query changed between renders
    setMatches(mediaQueryList.matches);

    const handleChange = (event) => setMatches(event.matches);

    // Modern API — addEventListener is preferred over addListener (deprecated)
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", handleChange);
    } else {
      // Safari < 14 fallback
      mediaQueryList.addListener(handleChange);
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener("change", handleChange);
      } else {
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
