import { useState, useCallback } from "react";

/**
 * useToggle
 * Returns a boolean state and a stable toggle function.
 * Replaces the repeated pattern of:
 *   const [isOpen, setIsOpen] = useState(false);
 *   const toggle = () => setIsOpen(prev => !prev);
 *
 * @param {boolean} [initialValue=false] - Starting value
 * @returns {[boolean, () => void, (value: boolean) => void]}
 *   [state, toggle, setValue]
 *   - state:    current boolean value
 *   - toggle:   flips the value (stable reference — safe in dependency arrays)
 *   - setValue: set an explicit value (useful for keyboard/escape close events)
 *
 * @example
 *   // Simple open/close modal
 *   const [isOpen, toggleOpen] = useToggle();
 *   return <button onClick={toggleOpen}>{isOpen ? 'Close' : 'Open'}</button>;
 *
 * @example
 *   // With setValue to force-close on Escape
 *   const [menuOpen, toggleMenu, setMenuOpen] = useToggle(false);
 *   useEffect(() => {
 *     const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
 *     window.addEventListener('keydown', onKey);
 *     return () => window.removeEventListener('keydown', onKey);
 *   }, [setMenuOpen]);
 *
 * @example
 *   // Start open
 *   const [showDetails, toggleDetails] = useToggle(true);
 *
 * @example
 *   // Multiple toggles in one component
 *   const [showFilters,  toggleFilters]  = useToggle();
 *   const [showPassword, togglePassword] = useToggle();
 *   const [showMap,      toggleMap]      = useToggle(true);
 */
const useToggle = (initialValue = false) => {
  const [state, setState] = useState(Boolean(initialValue));

  /** Flip the current state */
  const toggle = useCallback(() => setState((prev) => !prev), []);

  /** Set an explicit value — useful for force-closing from a parent event */
  const setValue = useCallback((value) => setState(Boolean(value)), []);

  return [state, toggle, setValue];
};

export default useToggle;
