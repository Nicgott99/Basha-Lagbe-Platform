import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop
 * Automatically scrolls the browser window back to the top whenever the
 * route changes. Without this, React Router preserves the current scroll
 * position when navigating between pages, so users can land mid-page on
 * every route transition.
 *
 * Usage: Place <ScrollToTop /> once, directly inside <BrowserRouter>
 * and above <Routes>, so it runs on every navigation event.
 *
 * This component renders nothing — it is purely a side-effect component.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the top of the page on every route change
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // Renders nothing to the DOM
  return null;
};

export default ScrollToTop;
