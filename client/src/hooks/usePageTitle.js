import { useEffect, useRef } from "react";

/**
 * usePageTitle
 * Dynamically updates the browser's document.title for the current page
 * and restores the previous title on unmount.
 *
 * Problem it solves:
 *   Every page in the app currently shows the same generic tab title
 *   ("Basha Lagbe" or whatever Vite's default is). This makes it hard for
 *   users to distinguish tabs and hurts SEO (unique <title> per page is a
 *   core SEO signal). This hook fixes both issues with a single import.
 *
 * Behaviour:
 *   - Sets document.title on mount (and whenever `title` changes)
 *   - Appends " | Basha Lagbe" suffix automatically unless `raw` is true
 *   - Restores the previous title on unmount so navigating away is clean
 *   - When `title` is empty/null, only the site name is shown
 *
 * @param {string}  title       - Page-specific title (e.g. "Search Properties")
 * @param {Object}  [options]
 * @param {boolean} [options.raw=false]
 *   When true, uses `title` as-is without appending the site name suffix.
 * @param {string}  [options.siteName='Basha Lagbe']
 *   Override the appended site name (useful for white-label scenarios).
 * @param {boolean} [options.restoreOnUnmount=true]
 *   When true (default), the previous page title is restored on unmount.
 *
 * @returns {void}
 *
 * @example
 *   // Standard usage — shows "Search Properties | Basha Lagbe"
 *   usePageTitle('Search Properties');
 *
 * @example
 *   // Dynamic title based on loaded data
 *   const [property, setProperty] = useState(null);
 *   usePageTitle(property ? property.basicInfo.title : 'Loading...');
 *
 * @example
 *   // Raw title (no suffix) — useful for landing/marketing pages
 *   usePageTitle('Find Your Perfect Home in Bangladesh', { raw: true });
 *
 * @example
 *   // Admin panel — no unmount restore
 *   usePageTitle('Admin Dashboard', { restoreOnUnmount: false });
 */
const usePageTitle = (title, {
  raw              = false,
  siteName         = "Basha Lagbe",
  restoreOnUnmount = true,
} = {}) => {
  const previousTitle = useRef(document.title);

  useEffect(() => {
    const formattedTitle = raw
      ? title || siteName
      : title
      ? `${title} | ${siteName}`
      : siteName;

    document.title = formattedTitle;

    return () => {
      if (restoreOnUnmount) {
        document.title = previousTitle.current;
      }
    };
    // We only want to capture previousTitle once on mount, not re-capture on each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, raw, siteName, restoreOnUnmount]);
};

export default usePageTitle;
