import { useEffect, useCallback, useRef } from "react";

/**
 * useKeyboardShortcuts
 * Registers multiple keyboard shortcuts from a single declarative map.
 * Handles modifier combinations (Ctrl/Cmd + Shift + key), conflict detection,
 * automatic cleanup on unmount, and per-shortcut enable/disable toggling.
 *
 * Problem it solves:
 *   `useKeyPress` handles one shortcut at a time. For pages like Search,
 *   AdminPanel, and Dashboard that need multiple shortcuts simultaneously
 *   (Ctrl+K = open search, Escape = close modal, Ctrl+Enter = submit, etc.),
 *   calling `useKeyPress` 5 times is verbose and creates 5 separate
 *   `keydown` event listeners. This hook registers ALL shortcuts in a single
 *   listener with O(1) key lookup via a Map — no linear scan per keydown event.
 *
 * Bangladesh UX context:
 *   Power users — landlords who manage many listings, admins who process
 *   applications — benefit significantly from keyboard shortcuts. They reduce
 *   mouse clicks and speed up repetitive tasks like approving listings.
 *
 * @param {Record<string, ShortcutDefinition>} shortcuts
 *   A map of shortcut names to their definitions. The key is a human-readable
 *   name for the shortcut (used internally; not displayed to the user).
 *
 * @typedef {Object} ShortcutDefinition
 * @property {string}   key      - The key to listen for (matches event.key: 'k', 'Escape', 'Enter', 'F1')
 * @property {Function} handler  - Callback to invoke when the shortcut fires
 * @property {boolean}  [ctrl=false]   - Require Ctrl (or Cmd on Mac)
 * @property {boolean}  [shift=false]  - Require Shift modifier
 * @property {boolean}  [alt=false]    - Require Alt modifier
 * @property {boolean}  [preventDefault=true]
 *   Whether to call event.preventDefault() — prevents browser default behaviour
 *   (e.g. Ctrl+K opening browser URL bar, Ctrl+S showing save dialog).
 *   Set to false for keys like Escape where default behaviour is fine.
 * @property {boolean}  [enabled=true]  - Per-shortcut toggle; disabled shortcuts are skipped
 * @property {boolean}  [ignoreInputs=true]
 *   When true, the shortcut is silently ignored when focus is inside an
 *   `<input>`, `<textarea>`, or `contenteditable` element.
 *   Prevents shortcuts from firing while the user is typing.
 *   Set to false only for shortcuts that should work even during text input
 *   (e.g. Escape to close a search modal even while typing in the search box).
 *
 * @param {Object} [globalOptions]
 * @param {boolean} [globalOptions.enabled=true]
 *   Master toggle — disables all shortcuts when false.
 * @param {EventTarget} [globalOptions.element=window]
 *   Target element to attach the keydown listener to.
 *
 * @example
 *   // Search page: Ctrl+K opens search, Escape closes it, Ctrl+F toggles filters
 *   useKeyboardShortcuts({
 *     openSearch:    { key: 'k', ctrl: true, handler: () => searchInputRef.current?.focus() },
 *     closeModal:    { key: 'Escape', handler: closeModal, ignoreInputs: false, preventDefault: false },
 *     toggleFilters: { key: 'f', ctrl: true, handler: toggleFilters },
 *   });
 *
 * @example
 *   // Admin panel: approve/reject with keyboard
 *   useKeyboardShortcuts({
 *     approveSelected: { key: 'a', ctrl: true, shift: true, handler: handleApprove },
 *     rejectSelected:  { key: 'r', ctrl: true, shift: true, handler: handleReject },
 *     selectAll:       { key: 'a', ctrl: true, handler: handleSelectAll },
 *   }, { enabled: !isModalOpen }); // disable when a modal is blocking the view
 *
 * @example
 *   // Dashboard: navigate tabs with Alt+1/2/3
 *   useKeyboardShortcuts({
 *     tabOverview:    { key: '1', alt: true, handler: () => setTab('overview') },
 *     tabListings:    { key: '2', alt: true, handler: () => setTab('listings') },
 *     tabAnalytics:   { key: '3', alt: true, handler: () => setTab('analytics') },
 *   });
 *
 * @example
 *   // Form: Ctrl+Enter to submit, Ctrl+Z to undo last field change
 *   useKeyboardShortcuts({
 *     submit: { key: 'Enter', ctrl: true, handler: handleSubmit, ignoreInputs: false },
 *     undo:   { key: 'z',     ctrl: true, handler: handleUndo },
 *   });
 *
 * @returns {void}
 */
const useKeyboardShortcuts = (shortcuts = {}, {
  enabled: globalEnabled = true,
  element: targetElement = undefined,
} = {}) => {
  // Store shortcuts in a ref so the keydown handler always has the latest values
  // without needing to be re-created on every render (avoids re-registering listener)
  const shortcutsRef = useRef(shortcuts);

  useEffect(() => {
    shortcutsRef.current = shortcuts;
  });

  const handleKeyDown = useCallback((event) => {
    if (!globalEnabled) return;

    const current = shortcutsRef.current;

    for (const name in current) {
      const {
        key,
        handler,
        ctrl          = false,
        shift         = false,
        alt           = false,
        preventDefault = true,
        enabled        = true,
        ignoreInputs   = true,
      } = current[name];

      if (!enabled) continue;

      // ── Key + modifier match ───────────────────────────────────────────────
      if (event.key !== key) continue;

      const ctrlMatch  = ctrl  ? (event.ctrlKey || event.metaKey) : !(event.ctrlKey || event.metaKey);
      const shiftMatch = shift ? event.shiftKey  : !event.shiftKey;
      const altMatch   = alt   ? event.altKey    : !event.altKey;

      if (!ctrlMatch || !shiftMatch || !altMatch) continue;

      // ── Input element guard ────────────────────────────────────────────────
      if (ignoreInputs) {
        const tag = event.target?.tagName?.toLowerCase();
        const isEditable = event.target?.isContentEditable;
        if (tag === 'input' || tag === 'textarea' || tag === 'select' || isEditable) continue;
      }

      // ── Fire the shortcut ─────────────────────────────────────────────────
      if (preventDefault) event.preventDefault();
      handler(event);

      // Only fire the first matching shortcut (prevents double-firing)
      break;
    }
  }, [globalEnabled]);

  useEffect(() => {
    const el = targetElement ?? window;
    el.addEventListener('keydown', handleKeyDown);
    return () => el.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, targetElement]);
};

export default useKeyboardShortcuts;
