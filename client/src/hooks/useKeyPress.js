import { useState, useEffect, useCallback } from "react";
import useEventListener from "./useEventListener";

/**
 * useKeyPress
 * Detects whether a specific keyboard key is currently pressed.
 * Returns true while the key is held down, false once released.
 *
 * Also accepts an optional `callback` that fires once on each keydown
 * event for the target key — useful for triggering actions rather than
 * tracking held state.
 *
 * Problem it solves:
 *   Keyboard shortcuts and key handlers are scattered across the codebase:
 *   - ConfirmDialog has a manual `onKeyDown` handler for Escape
 *   - useIdleTimer lists 'keydown' as a generic activity event
 *   - No component has a reusable way to say "do X when user presses K"
 *   This hook centralises all keyboard interaction into a clean, declarative API.
 *
 * @param {string|string[]} targetKey
 *   The key(s) to listen for. Matches the `event.key` value (e.g. 'Escape',
 *   'Enter', 'ArrowUp', 'k', 'K'). Pass an array to match any of multiple keys.
 *   Full key name reference: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
 *
 * @param {Object}   [options]
 * @param {Function} [options.onKeyDown] - Called once each time the key is pressed down
 * @param {Function} [options.onKeyUp]   - Called once each time the key is released
 * @param {boolean}  [options.ctrl=false]  - Require Ctrl modifier (Cmd on Mac)
 * @param {boolean}  [options.shift=false] - Require Shift modifier
 * @param {boolean}  [options.alt=false]   - Require Alt modifier
 * @param {boolean}  [options.enabled=true] - Set false to disable the listener entirely
 * @param {EventTarget} [options.element=window] - Target element for the listener
 *
 * @returns {boolean} isPressed — true while the target key is held down
 *
 * @example
 *   // Detect Escape key — close modals / sidebars
 *   const escPressed = useKeyPress('Escape');
 *   useEffect(() => { if (escPressed) closeModal(); }, [escPressed]);
 *
 * @example
 *   // One-shot callback on key press — keyboard shortcut
 *   useKeyPress('k', {
 *     ctrl: true,
 *     onKeyDown: () => openSearchModal(),
 *   });
 *
 * @example
 *   // Multiple keys — arrow navigation
 *   const upPressed   = useKeyPress('ArrowUp');
 *   const downPressed = useKeyPress('ArrowDown');
 *
 * @example
 *   // Visual feedback while key held (e.g. hold Space to preview)
 *   const isHeld = useKeyPress(' ');
 *   return <div className={isHeld ? 'scale-95' : 'scale-100'}>Hold Space</div>;
 *
 * @example
 *   // Disable when a modal is open to avoid conflicts
 *   useKeyPress('s', {
 *     ctrl: true,
 *     enabled: !isModalOpen,
 *     onKeyDown: handleSave,
 *   });
 */
const useKeyPress = (
  targetKey,
  {
    onKeyDown = null,
    onKeyUp   = null,
    ctrl      = false,
    shift     = false,
    alt       = false,
    enabled   = true,
    element   = undefined,
  } = {}
) => {
  const [isPressed, setIsPressed] = useState(false);

  // Normalise to array so we can handle single key or multi-key
  const keys = Array.isArray(targetKey) ? targetKey : [targetKey];

  const matchesModifiers = useCallback((event) => {
    if (ctrl  && !(event.ctrlKey  || event.metaKey)) return false;
    if (shift && !event.shiftKey)                     return false;
    if (alt   && !event.altKey)                       return false;
    return true;
  }, [ctrl, shift, alt]);

  const handleKeyDown = useCallback((event) => {
    if (!enabled)                          return;
    if (!keys.includes(event.key))         return;
    if (!matchesModifiers(event))          return;

    setIsPressed(true);
    onKeyDown?.(event);
  }, [enabled, keys, matchesModifiers, onKeyDown]);

  const handleKeyUp = useCallback((event) => {
    if (!keys.includes(event.key)) return;

    setIsPressed(false);
    onKeyUp?.(event);
  }, [keys, onKeyUp]);

  useEventListener("keydown", handleKeyDown, element);
  useEventListener("keyup",   handleKeyUp,   element);

  // Reset pressed state if the hook is disabled mid-hold
  useEffect(() => {
    if (!enabled) setIsPressed(false);
  }, [enabled]);

  return isPressed;
};

export default useKeyPress;
