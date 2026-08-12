import { useEffect, useRef } from "react";

/**
 * useEventListener
 * Safely attaches an event listener to any DOM element, window, or document
 * with automatic cleanup on unmount or whenever the target/event changes.
 *
 * Problem it solves:
 *   Multiple components in this codebase repeat the same pattern:
 *     useEffect(() => {
 *       window.addEventListener('keydown', handler);
 *       return () => window.removeEventListener('keydown', handler);
 *     }, [handler]);
 *
 *   - Forgetting the cleanup causes memory leaks and stale handler bugs.
 *   - Putting the handler inline in useEffect re-registers on every render.
 *   - This hook handles both problems: it keeps the handler in a ref (always
 *     fresh, never stale) and disconnects cleanly every time.
 *
 * @param {string}                eventName   - DOM event name (e.g. 'keydown', 'resize', 'scroll')
 * @param {Function}              handler     - Event handler function
 * @param {EventTarget|React.RefObject|null} [element=window]
 *   Target to attach the listener to. Accepts:
 *     - A DOM element (window, document, a specific node)
 *     - A React ref object ({ current: ... })
 *     - null/undefined (defaults to window)
 * @param {boolean|AddEventListenerOptions} [options]
 *   Options forwarded to addEventListener (e.g. { passive: true })
 *
 * @returns {void}
 *
 * @example
 *   // Close modal on Escape key press
 *   useEventListener('keydown', (e) => {
 *     if (e.key === 'Escape') setOpen(false);
 *   });
 *
 * @example
 *   // Detect clicks outside a dropdown ref
 *   const dropdownRef = useRef(null);
 *   useEventListener('mousedown', (e) => {
 *     if (!dropdownRef.current?.contains(e.target)) setOpen(false);
 *   }, document);
 *
 * @example
 *   // Passive resize listener
 *   useEventListener('resize', handleResize, window, { passive: true });
 *
 * @example
 *   // Attach to a specific element via ref
 *   const buttonRef = useRef(null);
 *   useEventListener('click', handleClick, buttonRef);
 */
const useEventListener = (eventName, handler, element, options) => {
  // Store handler in a ref so it's always up to date without re-registering
  const savedHandler = useRef(handler);
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // Resolve the actual target element
    const targetElement =
      element == null
        ? window
        : "current" in element          // React ref object
        ? element.current
        : element;                       // raw DOM element

    if (!targetElement?.addEventListener) return;

    const eventListener = (event) => savedHandler.current(event);

    targetElement.addEventListener(eventName, eventListener, options);

    return () => targetElement.removeEventListener(eventName, eventListener, options);
  }, [eventName, element, options]);
};

export default useEventListener;
