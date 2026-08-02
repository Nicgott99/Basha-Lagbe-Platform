import { useState, useEffect } from "react";

/**
 * useWindowSize
 * Returns the current browser window dimensions and updates reactively
 * whenever the window is resized. Uses a debounced resize listener to
 * avoid excessive re-renders during drag-resize.
 *
 * @returns {{ width: number, height: number, isMobile: boolean, isTablet: boolean, isDesktop: boolean }}
 *
 * Breakpoints (matching Tailwind defaults):
 *   isMobile  — width < 768 px   (below md)
 *   isTablet  — 768 px ≤ width < 1024 px   (md to below lg)
 *   isDesktop — width ≥ 1024 px  (lg and above)
 *
 * @example
 *   const { width, isMobile } = useWindowSize();
 *   return isMobile ? <MobileNav /> : <DesktopNav />;
 *
 * @example
 *   const { isDesktop } = useWindowSize();
 *   const columns = isDesktop ? 4 : 2;
 */
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(() => ({
    width:  typeof window !== "undefined" ? window.innerWidth  : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  }));

  useEffect(() => {
    if (typeof window === "undefined") return;

    let debounceTimer;

    const handleResize = () => {
      // Debounce at 100ms so we don't re-render on every pixel of drag-resize
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        setWindowSize({
          width:  window.innerWidth,
          height: window.innerHeight,
        });
      }, 100);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Sync once immediately in case the window resized before the effect ran
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(debounceTimer);
    };
  }, []);

  return {
    width:     windowSize.width,
    height:    windowSize.height,
    isMobile:  windowSize.width < 768,
    isTablet:  windowSize.width >= 768 && windowSize.width < 1024,
    isDesktop: windowSize.width >= 1024,
  };
};

export default useWindowSize;
