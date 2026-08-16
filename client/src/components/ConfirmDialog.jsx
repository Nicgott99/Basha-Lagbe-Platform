import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import useKeyPress from "../hooks/useKeyPress";

/**
 * ConfirmDialog
 * An accessible modal confirmation dialog for destructive or irreversible
 * actions (delete, sign out, reject, cancel, etc.).
 *
 * Features:
 *   - Locks body scroll while open (overflow: hidden)
 *   - Focuses the confirm button on open for keyboard users
 *   - Closes on Escape key via useKeyPress (declarative, auto-cleanup)
 *   - Closes on backdrop click
 *   - Traps focus within the dialog (Tab cycles between two buttons)
 *   - ARIA: role="dialog", aria-modal, aria-labelledby, aria-describedby
 *   - Framer Motion backdrop + panel animations
 *   - Four intent variants: danger (red), warning (amber), info (blue), success (green)
 *
 * @param {Object}   props
 * @param {boolean}  props.isOpen          - Controls visibility
 * @param {Function} props.onClose         - Called on cancel / Escape / backdrop click
 * @param {Function} props.onConfirm       - Called when user clicks the confirm button
 * @param {string}   [props.title='Are you sure?'] - Dialog heading
 * @param {string}   [props.message]       - Explanatory text below the heading
 * @param {string}   [props.confirmText='Confirm'] - Confirm button label
 * @param {string}   [props.cancelText='Cancel']   - Cancel button label
 * @param {'danger'|'warning'|'info'|'success'} [props.intent='danger']
 *   Controls the confirm button and icon colour
 * @param {boolean}  [props.loading=false] - Shows spinner on confirm button
 *
 * @example
 *   // Delete property
 *   <ConfirmDialog
 *     isOpen={showDeleteModal}
 *     onClose={() => setShowDeleteModal(false)}
 *     onConfirm={handleDelete}
 *     title="Delete Property?"
 *     message="This will permanently remove the listing and all its images. This action cannot be undone."
 *     confirmText="Yes, Delete"
 *     intent="danger"
 *   />
 *
 * @example
 *   // Sign out
 *   <ConfirmDialog
 *     isOpen={showSignOutModal}
 *     onClose={() => setShowSignOutModal(false)}
 *     onConfirm={handleSignOut}
 *     title="Sign Out?"
 *     message="You will need to sign in again to access your account."
 *     confirmText="Sign Out"
 *     intent="warning"
 *     loading={isSigningOut}
 *   />
 */

const INTENT_STYLES = {
  danger:  { button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",   icon: "text-red-600",   iconBg: "bg-red-100"   },
  warning: { button: "bg-amber-500 hover:bg-amber-600 focus:ring-amber-400", icon: "text-amber-600", iconBg: "bg-amber-100" },
  info:    { button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500", icon: "text-blue-600",  iconBg: "bg-blue-100"  },
  success: { button: "bg-green-600 hover:bg-green-700 focus:ring-green-500", icon: "text-green-600", iconBg: "bg-green-100" },
};

const ICONS = {
  danger:  "⚠️",
  warning: "⚠️",
  info:    "ℹ️",
  success: "✅",
};

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title       = "Are you sure?",
  message     = "",
  confirmText = "Confirm",
  cancelText  = "Cancel",
  intent      = "danger",
  loading     = false,
}) => {
  const confirmBtnRef = useRef(null);
  const styles        = INTENT_STYLES[intent] ?? INTENT_STYLES.danger;

  // Close on Escape key — useKeyPress is declarative and auto-cleans via useEventListener internally
  useKeyPress("Escape", {
    enabled:   isOpen,
    onKeyDown: () => !loading && onClose(),
  });

  // Lock body scroll while dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Focus confirm button for keyboard accessibility
      setTimeout(() => confirmBtnRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Tab trap: keep focus cycling between Cancel and Confirm buttons
  const handleKeyDown = (e) => {
    if (e.key !== "Tab") return;
    const focusable = document.querySelectorAll("[data-confirm-dialog-btn]");
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          aria-describedby={message ? "confirm-dialog-message" : undefined}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          onKeyDown={handleKeyDown}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={!loading ? onClose : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Icon + Title */}
            <div className="flex items-start gap-4 mb-4">
              <span
                className={`flex-shrink-0 w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center text-lg`}
                aria-hidden="true"
              >
                {ICONS[intent]}
              </span>
              <div>
                <h2
                  id="confirm-dialog-title"
                  className="text-lg font-semibold text-gray-900 leading-tight"
                >
                  {title}
                </h2>
                {message && (
                  <p
                    id="confirm-dialog-message"
                    className="mt-1 text-sm text-gray-500 leading-relaxed"
                  >
                    {message}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
              <button
                data-confirm-dialog-btn
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelText}
              </button>
              <button
                ref={confirmBtnRef}
                data-confirm-dialog-btn
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${styles.button}`}
              >
                {loading && (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3V0a12 12 0 100 24v-4l-3 3 3 3v4a12 12 0 01-8-12z" />
                  </svg>
                )}
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ConfirmDialog.propTypes = {
  isOpen:      PropTypes.bool.isRequired,
  onClose:     PropTypes.func.isRequired,
  onConfirm:   PropTypes.func.isRequired,
  title:       PropTypes.string,
  message:     PropTypes.string,
  confirmText: PropTypes.string,
  cancelText:  PropTypes.string,
  intent:      PropTypes.oneOf(["danger", "warning", "info", "success"]),
  loading:     PropTypes.bool,
};

export default ConfirmDialog;
