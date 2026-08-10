import { motion } from "framer-motion";
import useScrollProgress from "../hooks/useScrollProgress";

/**
 * ReadingProgressBar
 * A thin coloured line fixed to the very top of the viewport that fills
 * from left to right as the user scrolls down the page.
 *
 * Uses the useScrollProgress hook internally — no props required.
 * Place once in App.jsx (inside BrowserRouter) so it renders on every page.
 *
 * Features:
 *   - Blue-to-purple gradient that matches the site's colour palette
 *   - Framer Motion scaleX animation driven directly by scroll progress
 *     (transformOrigin: left, so it grows from the left edge)
 *   - Fades in after the first 2% of scroll to avoid jarring appearance
 *   - aria-hidden — decorative element, not meaningful to screen readers
 *   - z-[9998] — sits below the OfflineBanner (z-[9999]) but above all other UI
 *   - height: 3px — thin enough not to distract but visible enough to be useful
 *
 * @example
 *   // In App.jsx, inside BrowserRouter, after OfflineBanner
 *   <OfflineBanner />
 *   <ReadingProgressBar />
 *   <Header />
 *   <Routes>...</Routes>
 */
const ReadingProgressBar = () => {
  const progress = useScrollProgress({ precision: 0 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9998] h-[3px] origin-left"
      style={{
        background:
          "linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)",
        scaleX: progress / 100,
        opacity: progress > 2 ? 1 : 0,
        transformOrigin: "left",
      }}
      transition={{ ease: "easeOut", duration: 0.1 }}
    />
  );
};

export default ReadingProgressBar;
