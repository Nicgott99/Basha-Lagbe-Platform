import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

/**
 * Tooltip
 * A lightweight, accessible tooltip component that shows a label on hover
 * or focus. Supports four placement directions and uses Framer Motion for
 * a polished fade+scale animation.
 *
 * Replaces native `title=""` attributes which are visually inconsistent
 * across browsers and not accessible on touch devices.
 *
 * @param {Object}  props
 * @param {React.ReactNode} props.children  - The trigger element (wrapped in a span)
 * @param {string}  props.content           - Tooltip text to display
 * @param {'top'|'bottom'|'left'|'right'} [props.placement='top'] - Tooltip position
 * @param {number}  [props.delay=400]        - Milliseconds before tooltip appears
 * @param {string}  [props.className]        - Extra classes for the tooltip bubble
 *
 * @example
 *   <Tooltip content="Copy to clipboard">
 *     <button onClick={copy}>Copy</button>
 *   </Tooltip>
 *
 * @example
 *   <Tooltip content="Delete this property" placement="bottom">
 *     <TrashIcon className="w-5 h-5 text-red-500 cursor-pointer" />
 *   </Tooltip>
 *
 * @example
 *   // No delay for immediate feedback
 *   <Tooltip content="Save" delay={0}>
 *     <BookmarkIcon />
 *   </Tooltip>
 */
const PLACEMENT_STYLES = {
  top:    "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left:   "right-full top-1/2 -translate-y-1/2 mr-2",
  right:  "left-full top-1/2 -translate-y-1/2 ml-2",
};

const ANIMATION_VARIANTS = {
  top:    { initial: { opacity: 0, y: 4, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 } },
  bottom: { initial: { opacity: 0, y: -4, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 } },
  left:   { initial: { opacity: 0, x: 4, scale: 0.95 }, animate: { opacity: 1, x: 0, scale: 1 } },
  right:  { initial: { opacity: 0, x: -4, scale: 0.95 }, animate: { opacity: 1, x: 0, scale: 1 } },
};

const Tooltip = ({
  children,
  content,
  placement = "top",
  delay     = 400,
  className = "",
}) => {
  const [visible, setVisible]     = useState(false);
  const showTimerRef              = useRef(null);
  const { initial, animate }      = ANIMATION_VARIANTS[placement] ?? ANIMATION_VARIANTS.top;
  const positionClass             = PLACEMENT_STYLES[placement]   ?? PLACEMENT_STYLES.top;

  const show = useCallback(() => {
    clearTimeout(showTimerRef.current);
    showTimerRef.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    clearTimeout(showTimerRef.current);
    setVisible(false);
  }, []);

  if (!content) return children;

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}

      <AnimatePresence>
        {visible && (
          <motion.span
            role="tooltip"
            key="tooltip"
            initial={initial}
            animate={animate}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={[
              "absolute z-50 pointer-events-none",
              positionClass,
              "px-2.5 py-1.5 rounded-lg",
              "bg-gray-900 text-white text-xs font-medium",
              "whitespace-nowrap shadow-lg",
              className,
            ].join(" ")}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};

Tooltip.propTypes = {
  children:  PropTypes.node.isRequired,
  content:   PropTypes.string,
  placement: PropTypes.oneOf(["top", "bottom", "left", "right"]),
  delay:     PropTypes.number,
  className: PropTypes.string,
};

export default Tooltip;
