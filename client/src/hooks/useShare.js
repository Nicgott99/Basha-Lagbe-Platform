import { useState, useCallback } from "react";

/**
 * useShare
 * Shares a URL or content using the Web Share API on supported devices
 * (mobile browsers, recent Edge/Chrome on desktop) and falls back to
 * copying the URL to the clipboard on unsupported platforms.
 *
 * Problem it solves:
 *   The existing PropertyCard "Share" button uses useClipboard — it always
 *   copies to clipboard. On mobile phones, the native share sheet is far
 *   more useful: it lets users send the listing via WhatsApp, SMS, email,
 *   or any installed app without having to manually paste.
 *
 *   The Web Share API is now supported by ~95% of mobile browsers and Chrome
 *   on desktop. This hook uses it when available and silently falls back to
 *   clipboard copy when not.
 *
 * @param {Object} [options]
 * @param {number} [options.resetDelay=2000]
 *   Milliseconds after which status resets to idle (default 2s)
 *
 * @returns {Object}
 *   @property {Function} share        - Call with ShareData to trigger share/copy
 *   @property {string}   status       - 'idle' | 'shared' | 'copied' | 'error'
 *   @property {boolean}  isShared     - True briefly after a successful share/copy
 *   @property {boolean}  isError      - True briefly after a failure
 *   @property {boolean}  canShare     - True if Web Share API is supported
 *   @property {string|null} errorMsg  - Error message if share failed
 *
 * @example
 *   // Basic usage in a listing card
 *   const { share, status } = useShare();
 *   return (
 *     <button onClick={() => share({ title: listing.title, url: window.location.href })}>
 *       {status === 'shared' ? '✓ Shared!' :
 *        status === 'copied' ? '✓ Copied!' : 'Share'}
 *     </button>
 *   );
 *
 * @example
 *   // With custom text for WhatsApp-style shares
 *   const { share, canShare } = useShare();
 *   const handleShare = () => share({
 *     title: 'Check out this property on Basha Lagbe',
 *     text: `${listing.title} — ${listing.price}/mo in ${listing.city}`,
 *     url: `${window.location.origin}/listing/${listing._id}`,
 *   });
 *
 * @example
 *   // Show different UI if native share is available
 *   const { share, canShare, status } = useShare();
 *   return (
 *     <button onClick={handleShare} title={canShare ? 'Share via apps' : 'Copy link'}>
 *       {canShare ? <ShareIcon /> : <LinkIcon />}
 *       {status === 'shared' ? 'Shared!' : status === 'copied' ? 'Copied!' : 'Share'}
 *     </button>
 *   );
 */
const useShare = ({ resetDelay = 2000 } = {}) => {
  const [status,   setStatus]   = useState("idle"); // 'idle' | 'shared' | 'copied' | 'error'
  const [errorMsg, setErrorMsg] = useState(null);

  // Check once at hook creation whether the Web Share API is available
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const reset = useCallback(() => {
    const timer = setTimeout(() => {
      setStatus("idle");
      setErrorMsg(null);
    }, resetDelay);
    return timer;
  }, [resetDelay]);

  /**
   * @param {ShareData} shareData
   * @param {string} [shareData.title]
   * @param {string} [shareData.text]
   * @param {string} [shareData.url]
   */
  const share = useCallback(async (shareData = {}) => {
    const { title = document.title, text = "", url = window.location.href } = shareData;

    // ── Path 1: Web Share API (mobile + modern desktop) ───────────────────
    if (canShare) {
      try {
        await navigator.share({ title, text, url });
        setStatus("shared");
        reset();
        return;
      } catch (err) {
        // AbortError means the user dismissed the sheet — not really an error
        if (err.name === "AbortError") {
          setStatus("idle");
          return;
        }
        // Any other error (e.g. NotAllowedError) → fall through to clipboard
        console.warn("[useShare] navigator.share failed, falling back to clipboard:", err.message);
      }
    }

    // ── Path 2: Clipboard API (desktop / unsupported browsers) ────────────
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Legacy fallback for old browsers — uses execCommand (deprecated but works)
        const el = document.createElement("textarea");
        el.value = url;
        el.style.position = "fixed";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setStatus("copied");
      reset();
    } catch (copyErr) {
      setStatus("error");
      setErrorMsg("Could not copy link. Please copy the URL manually.");
      console.error("[useShare] Clipboard write failed:", copyErr.message);
      reset();
    }
  }, [canShare, reset]);

  return {
    share,
    status,
    isShared:  status === "shared" || status === "copied",
    isError:   status === "error",
    canShare,
    errorMsg,
  };
};

export default useShare;
