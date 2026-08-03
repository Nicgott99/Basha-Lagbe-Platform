import { useState, useCallback, useRef } from "react";

/**
 * useClipboard
 * A hook that copies a value to the clipboard and provides a timed "copied"
 * feedback state that automatically resets after a configurable duration.
 *
 * @param {Object} [options]
 * @param {number} [options.resetDelay=2000] - ms before `isCopied` resets to false
 *
 * @returns {{ isCopied: boolean, copy: (text: string) => Promise<boolean> }}
 *   - isCopied  — true for `resetDelay` ms after a successful copy
 *   - copy(text) — copies the given text; resolves to true on success, false on failure
 *
 * @example
 *   const { isCopied, copy } = useClipboard();
 *
 *   return (
 *     <button onClick={() => copy(window.location.href)}>
 *       {isCopied ? '✓ Copied!' : 'Share Link'}
 *     </button>
 *   );
 *
 * @example
 *   // Custom reset delay
 *   const { isCopied, copy } = useClipboard({ resetDelay: 3000 });
 */
const useClipboard = ({ resetDelay = 2000 } = {}) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef(null);

  /**
   * copy — write `text` to the system clipboard.
   * Returns a Promise<boolean> — true on success, false if the browser
   * denied clipboard access or the Clipboard API is not available.
   */
  const copy = useCallback(
    async (text) => {
      // Clear any pending reset timer from a previous copy
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      try {
        if (navigator?.clipboard?.writeText) {
          // Modern Clipboard API — requires HTTPS or localhost
          await navigator.clipboard.writeText(String(text));
        } else {
          // Fallback for older browsers / HTTP
          const textArea = document.createElement("textarea");
          textArea.value = String(text);
          // Prevent scrolling on iOS
          textArea.style.cssText =
            "position:fixed;top:0;left:0;width:2em;height:2em;padding:0;border:none;outline:none;box-shadow:none;background:transparent";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
        }

        setIsCopied(true);
        timeoutRef.current = setTimeout(() => setIsCopied(false), resetDelay);
        return true;
      } catch (err) {
        console.warn("[useClipboard] Failed to copy:", err);
        setIsCopied(false);
        return false;
      }
    },
    [resetDelay]
  );

  return { isCopied, copy };
};

export default useClipboard;
