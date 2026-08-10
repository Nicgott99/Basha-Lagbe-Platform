import { useState, useEffect, useRef } from "react";

/**
 * useScrollProgress
 * Returns how far the user has scrolled down the page as a percentage (0–100).
 * Useful for rendering a reading-progress bar, scroll-triggered animations,
 * or lazy-loading content based on scroll depth.
 *
 * Uses a passive scroll listener backed by requestAnimationFrame to ensure
 * zero jank — the scroll handler never blocks the main thread.
 *
 * @param {Object}  [options]
 * @param {Element|null} [options.target=null]
 *   Optional DOM element to measure instead of the whole document.
 *   When null (default), measures `document.documentElement` scroll depth.
 * @param {number}  [options.precision=1]
 *   Number of decimal places to round the progress to (default 1).
 *
 * @returns {number} Progress from 0.0 to 100.0
 *
 * @example
 *   // Full-page reading progress
 *   const progress = useScrollProgress();
 *   return <ProgressBar value={progress} />;
 *
 * @example
 *   // Inside a scrollable div
 *   const containerRef = useRef(null);
 *   const progress = useScrollProgress({ target: containerRef.current });
 *
 * @example
 *   // Trigger an action when 80% through the page
 *   const progress = useScrollProgress();
 *   useEffect(() => {
 *     if (progress >= 80) loadMoreContent();
 *   }, [progress]);
 */
const useScrollProgress = ({ target = null, precision = 1 } = {}) => {
  const [progress, setProgress] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const el = target || document.documentElement;

    const calculate = () => {
      const scrollTop    = target ? target.scrollTop    : (window.scrollY || el.scrollTop);
      const scrollHeight = el.scrollHeight - el.clientHeight;

      if (scrollHeight <= 0) {
        setProgress(100);
        return;
      }

      const raw     = (scrollTop / scrollHeight) * 100;
      const clamped = Math.min(100, Math.max(0, raw));
      setProgress(parseFloat(clamped.toFixed(precision)));
    };

    const onScroll = () => {
      if (ticking.current) return;
      window.requestAnimationFrame(() => {
        calculate();
        ticking.current = false;
      });
      ticking.current = true;
    };

    const scrollTarget = target || window;
    scrollTarget.addEventListener("scroll", onScroll, { passive: true });

    // Set initial value
    calculate();

    return () => scrollTarget.removeEventListener("scroll", onScroll);
  }, [target, precision]);

  return progress;
};

export default useScrollProgress;
