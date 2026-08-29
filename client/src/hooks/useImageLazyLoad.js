import { useState, useRef, useEffect, useCallback } from "react";

/**
 * useImageLazyLoad
 * Defers loading an image until it scrolls near the viewport, improving
 * page load performance (LCP, bandwidth usage, TTI) on listing-heavy pages.
 *
 * Problem it solves:
 *   The current codebase renders PropertyCards with eager `<img src="...">` tags.
 *   On a search results page with 20 listings, ALL 20 images download simultaneously
 *   on page load — even images at the bottom that the user may never see.
 *   On mobile (3G/4G), this causes significant bandwidth waste and slow LCP.
 *
 * How it works:
 *   1. A `ref` is attached to the `<img>` element.
 *   2. An IntersectionObserver watches the element.
 *   3. When the element enters the viewport (plus `rootMargin` buffer ahead of time),
 *      the hook sets `src` to the real URL — the browser then loads it.
 *   4. Before it's visible, `src` is a tiny 1×1 transparent data URI (no network request).
 *   5. Once loaded, the observer is disconnected (no more work needed).
 *
 * @param {string}  src              - The real image URL to load when visible
 * @param {Object}  [options]
 * @param {string}  [options.placeholder] - Src to show while loading (default: 1×1 data URI)
 * @param {string}  [options.rootMargin='200px'] - How far ahead of viewport to start loading.
 *                                                 '200px' loads images 200px before they're visible.
 * @param {number}  [options.threshold=0]  - Intersection threshold (0–1)
 * @param {boolean} [options.enabled=true] - Set to false to disable lazy loading (always eager)
 *
 * @returns {Object}
 *   @property {React.RefObject} ref        - Attach this to your <img> element
 *   @property {string}          currentSrc - The src to pass to <img src={...}>
 *   @property {boolean}         isLoaded   - True once the image has loaded (use for fade-in)
 *   @property {boolean}         isInView   - True once the element entered the viewport
 *   @property {boolean}         hasError   - True if the image failed to load
 *
 * @example
 *   // Basic usage — drop-in replacement for <img src={url}>
 *   const { ref, currentSrc, isLoaded } = useImageLazyLoad(property.imageUrls[0]);
 *   return (
 *     <img
 *       ref={ref}
 *       src={currentSrc}
 *       alt={property.title}
 *       className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
 *     />
 *   );
 *
 * @example
 *   // With a low-res placeholder (blur-up technique)
 *   const { ref, currentSrc, isLoaded } = useImageLazyLoad(highResUrl, {
 *     placeholder: lowResUrl,  // Could be a blurred tiny JPEG from the server
 *     rootMargin: '400px',     // Start loading 400px ahead for faster UX
 *   });
 *
 * @example
 *   // Show a skeleton while loading, then fade in
 *   const { ref, currentSrc, isLoaded, hasError } = useImageLazyLoad(src);
 *   return (
 *     <div className="relative h-64">
 *       {!isLoaded && !hasError && <SkeletonCard />}
 *       {hasError && <div className="bg-gray-200 flex items-center justify-center h-full">No image</div>}
 *       <img ref={ref} src={currentSrc} className={isLoaded ? 'opacity-100' : 'opacity-0'} />
 *     </div>
 *   );
 *
 * @example
 *   // Disable lazy loading for above-the-fold (hero) images
 *   const { ref, currentSrc } = useImageLazyLoad(heroImageUrl, { enabled: false });
 *   // enabled=false → src is always the real URL → browser loads eagerly (correct for LCP)
 */
const useImageLazyLoad = (src, {
  placeholder = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
  rootMargin  = "200px",
  threshold   = 0,
  enabled     = true,
} = {}) => {
  const ref                   = useRef(null);
  const [isInView, setIsInView] = useState(!enabled); // if disabled, treat as always in view
  const [currentSrc, setSrc]  = useState(enabled ? placeholder : src);
  const [isLoaded, setLoaded] = useState(false);
  const [hasError, setError]  = useState(false);

  // ── Intersection Observer — fires once when element enters viewport ────────
  useEffect(() => {
    if (!enabled) return; // eager mode: skip observer entirely

    const node = ref.current;
    if (!node) return;

    // Browser support check (graceful degradation)
    if (!window.IntersectionObserver) {
      setIsInView(true);
      setSrc(src);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setSrc(src);          // Swap placeholder → real src
          observer.disconnect(); // Only need to fire once
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [src, enabled, rootMargin, threshold]);

  // ── Update real src when `src` prop changes while already in view ─────────
  useEffect(() => {
    if (isInView && src) {
      setSrc(src);
      setLoaded(false);
      setError(false);
    }
  }, [src, isInView]);

  // ── Attach load/error listeners to the img element ───────────────────────
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleLoad  = () => setLoaded(true);
    const handleError = () => { setError(true); setLoaded(true); };

    // If the image is already loaded (browser cache), fire immediately
    if (node.complete && node.naturalWidth > 0) {
      setLoaded(true);
    }

    node.addEventListener("load",  handleLoad);
    node.addEventListener("error", handleError);
    return () => {
      node.removeEventListener("load",  handleLoad);
      node.removeEventListener("error", handleError);
    };
  }, [currentSrc]);

  return { ref, currentSrc, isLoaded, isInView, hasError };
};

export default useImageLazyLoad;
