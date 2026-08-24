import { useRef, useCallback, useEffect } from "react";

/**
 * useFocusReturn
 * Manages keyboard focus when transient UI elements (modals, drawers,
 * dropdowns, sidebars, toasts) open and close.
 *
 * Problem it solves:
 *   When a modal or dialog opens, keyboard and screen reader users expect:
 *   1. Focus moves INTO the modal immediately on open.
 *   2. Focus RETURNS to the triggering element when the modal closes.
 *
 *   Without this, focus is "lost" — it stays on the button that opened the
 *   modal even after the modal is gone, or drops to the document body,
 *   making the app near-unusable for keyboard-only users.
 *
 *   The existing ConfirmDialog does this manually with:
 *     setTimeout(() => confirmBtnRef.current?.focus(), 50)
 *   This hook provides the same behaviour in a reusable, clean API.
 *
 * WCAG compliance:
 *   Implements WCAG 2.1 SC 2.4.3 (Focus Order) and SC 2.4.7 (Focus Visible).
 *   Required for ARIA dialog/modal patterns.
 *
 * @param {boolean} isOpen
 *   The open/closed state of the panel or modal this hook is attached to.
 * @param {Object} [options]
 * @param {string} [options.focusSelector='button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])']
 *   CSS selector to find the first focusable element inside the container.
 *   Override to target a specific element (e.g. '[data-autofocus]').
 * @param {number} [options.delay=50]
 *   Milliseconds before focusing the first element inside (allows CSS transitions
 *   to start before focus shifts, preventing layout jank).
 * @param {boolean} [options.returnFocus=true]
 *   When true (default), restores focus to the previously focused element on close.
 *
 * @returns {Object}
 *   @property {React.RefObject} containerRef
 *     Attach to the container element: `<div ref={containerRef}>`.
 *     The hook searches within this element for the first focusable child.
 *   @property {Function} focusFirst
 *     Imperatively move focus to the first focusable element in the container.
 *     Called automatically on open, but can be called manually after dynamic
 *     content loads.
 *   @property {Function} returnFocusToTrigger
 *     Imperatively return focus to the element that was focused before open.
 *     Called automatically on close, but can be called manually if needed.
 *
 * @example
 *   // Modal — focus moves in on open, returns to button on close
 *   const { containerRef } = useFocusReturn(isOpen);
 *   return (
 *     <div ref={containerRef} role="dialog" aria-modal="true">
 *       <h2>Confirm Delete?</h2>
 *       <button onClick={onConfirm}>Yes, delete</button>
 *       <button onClick={onClose}>Cancel</button>
 *     </div>
 *   );
 *
 * @example
 *   // Drawer — custom focus selector targets the close button first
 *   const { containerRef } = useFocusReturn(isDrawerOpen, {
 *     focusSelector: '[data-close-btn]',
 *   });
 *
 * @example
 *   // Imperative control — focus after async data loads
 *   const { containerRef, focusFirst } = useFocusReturn(isOpen);
 *   useEffect(() => {
 *     if (data) focusFirst(); // re-focus once content appears
 *   }, [data]);
 *
 * @example
 *   // Disable return (e.g. the trigger itself is removed on close)
 *   const { containerRef } = useFocusReturn(isOpen, { returnFocus: false });
 */
const useFocusReturn = (
  isOpen,
  {
    focusSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    delay         = 50,
    returnFocus   = true,
  } = {}
) => {
  const containerRef     = useRef(null);
  const previousFocusRef = useRef(null);

  // Focus the first focusable element inside the container
  const focusFirst = useCallback(() => {
    if (!containerRef.current) return;
    const focusable = containerRef.current.querySelector(focusSelector);
    if (focusable) {
      focusable.focus({ preventScroll: false });
    } else {
      // If no focusable child, make the container itself focusable and focus it
      if (!containerRef.current.hasAttribute('tabindex')) {
        containerRef.current.setAttribute('tabindex', '-1');
      }
      containerRef.current.focus({ preventScroll: false });
    }
  }, [focusSelector]);

  // Return focus to the element that was focused before the panel opened
  const returnFocusToTrigger = useCallback(() => {
    if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
      previousFocusRef.current.focus({ preventScroll: true });
      previousFocusRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Capture the currently focused element before moving focus into the panel
      previousFocusRef.current = document.activeElement;

      // Delay focus to allow entrance animations/transitions to begin
      const timer = setTimeout(focusFirst, delay);
      return () => clearTimeout(timer);
    } else {
      // Panel just closed — return focus to trigger element
      if (returnFocus) returnFocusToTrigger();
    }
  }, [isOpen, focusFirst, delay, returnFocus, returnFocusToTrigger]);

  return {
    containerRef,
    focusFirst,
    returnFocusToTrigger,
  };
};

export default useFocusReturn;
