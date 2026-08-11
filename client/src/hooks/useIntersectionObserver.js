import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useIntersectionObserver
 * A hook that uses the native IntersectionObserver API to track whether a
 * DOM element is visible within the viewport (or a specified root element).
 *
 * Problem it solves:
 *   Detecting scroll-based visibility used to require manual scroll listeners
 *   with `getBoundingClientRect()` calculations on every frame. IntersectionObserver
 *   does this off the main thread with zero performance impact.
 *
 * @param {Object} [options]
 * @param {Element|null} [options.root=null]         - Viewport root (null = browser viewport)
 * @param {string}       [options.rootMargin='0px']  - Margin around root (CSS-like: '0px 0px -50px 0px')
 * @param {number|number[]} [options.threshold=0]    - Visibility fraction(s) to trigger at (0–1)
 * @param {boolean}      [options.freezeOnceVisible=false]
 *   When true, the observer disconnects after the element becomes visible once.
 *   Ideal for scroll-triggered entrance animations that should only play once.
 *
 * @returns {[React.RefObject, boolean, IntersectionObserverEntry|null]}
 *   [ref, isIntersecting, entry]
 *   - ref:             Attach to the element you want to observe
 *   - isIntersecting:  true while the element is visible in the viewport
 *   - entry:           The raw IntersectionObserverEntry (for ratio, boundingRect, etc.)
 *
 * @example
 *   // Fade in when scrolled into view (plays once)
 *   const [ref, isVisible] = useIntersectionObserver({ freezeOnceVisible: true });
 *   return (
 *     <div ref={ref} className={isVisible ? 'opacity-100' : 'opacity-0'}>
 *       Content
 *     </div>
 *   );
 *
 * @example
 *   // Trigger infinite scroll near the bottom of a list
 *   const [sentinelRef, nearBottom] = useIntersectionObserver({
 *     rootMargin: '0px 0px 300px 0px',
 *   });
 *   useEffect(() => { if (nearBottom) loadMore(); }, [nearBottom]);
 *   return <div ref={sentinelRef} />;
 *
 * @example
 *   // Access full entry for visibility ratio
 *   const [ref, isVisible, entry] = useIntersectionObserver({ threshold: [0, 0.5, 1] });
 *   const ratio = entry?.intersectionRatio ?? 0;
 */
const useIntersectionObserver = ({
  root          = null,
  rootMargin    = "0px",
  threshold     = 0,
  freezeOnceVisible = false,
} = {}) => {
  const ref                     = useRef(null);
  const [entry, setEntry]       = useState(null);
  const [frozen, setFrozen]     = useState(false);

  const isIntersecting = Boolean(entry?.isIntersecting);

  const updateEntry = useCallback(([newEntry]) => {
    setEntry(newEntry);
    if (freezeOnceVisible && newEntry.isIntersecting) {
      setFrozen(true);
    }
  }, [freezeOnceVisible]);

  useEffect(() => {
    const node = ref.current;
    if (!node || frozen) return;

    const hasIOSupport = Boolean(window.IntersectionObserver);
    if (!hasIOSupport) {
      // Fallback: treat everything as visible in browsers without support (IE11)
      setEntry({ isIntersecting: true, intersectionRatio: 1 });
      return;
    }

    const observer = new IntersectionObserver(updateEntry, {
      root,
      rootMargin,
      threshold,
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [root, rootMargin, threshold, updateEntry, frozen]);

  return [ref, isIntersecting, entry];
};

export default useIntersectionObserver;
