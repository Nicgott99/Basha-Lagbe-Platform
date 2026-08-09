import PropTypes from "prop-types";

/**
 * Badge
 * A reusable pill/chip component for status labels, property type tags,
 * notification counts, and category indicators.
 *
 * Replaces the many inline <span className="bg-X text-Y px-Z ..."> patterns
 * scattered across PropertyCard, AdminPanel, Notifications, Applications, etc.
 *
 * @param {Object}  props
 * @param {React.ReactNode} props.children - Badge text/content
 * @param {'default'|'success'|'warning'|'danger'|'info'|'purple'|'orange'|'gray'} [props.variant='default']
 *   Colour variant — maps to a curated colour scheme
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Size preset
 * @param {boolean} [props.dot=false]       - Show a coloured dot before the text (status indicator)
 * @param {boolean} [props.rounded=true]    - Pill shape (rounded-full) vs rounded corners
 * @param {string}  [props.className]       - Extra Tailwind classes
 * @param {Function} [props.onClick]        - Makes the badge clickable (adds cursor-pointer)
 *
 * @example
 *   // Property type tag
 *   <Badge variant="info">Apartment</Badge>
 *
 * @example
 *   // Status with dot indicator
 *   <Badge variant="success" dot>Verified</Badge>
 *
 * @example
 *   // Unread notification count
 *   <Badge variant="danger" size="sm">{unreadCount}</Badge>
 *
 * @example
 *   // Pending application status
 *   <Badge variant="warning">Pending</Badge>
 *
 * @example
 *   // Clickable filter chip
 *   <Badge variant="default" onClick={() => setFilter('all')}>All</Badge>
 */

const VARIANT_CLASSES = {
  default: "bg-blue-100  text-blue-800  ring-blue-200",
  success: "bg-green-100 text-green-800 ring-green-200",
  warning: "bg-amber-100 text-amber-800 ring-amber-200",
  danger:  "bg-red-100   text-red-800   ring-red-200",
  info:    "bg-sky-100   text-sky-800   ring-sky-200",
  purple:  "bg-violet-100 text-violet-800 ring-violet-200",
  orange:  "bg-orange-100 text-orange-800 ring-orange-200",
  gray:    "bg-gray-100  text-gray-700  ring-gray-200",
};

const DOT_CLASSES = {
  default: "bg-blue-500",
  success: "bg-green-500",
  warning: "bg-amber-500",
  danger:  "bg-red-500",
  info:    "bg-sky-500",
  purple:  "bg-violet-500",
  orange:  "bg-orange-500",
  gray:    "bg-gray-400",
};

const SIZE_CLASSES = {
  sm: "px-2   py-0.5 text-xs  gap-1",
  md: "px-2.5 py-1   text-xs  gap-1.5",
  lg: "px-3   py-1.5 text-sm  gap-2",
};

const Badge = ({
  children,
  variant   = "default",
  size      = "md",
  dot       = false,
  rounded   = true,
  className = "",
  onClick,
}) => {
  const variantClass = VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.default;
  const dotClass     = DOT_CLASSES[variant]     ?? DOT_CLASSES.default;
  const sizeClass    = SIZE_CLASSES[size]       ?? SIZE_CLASSES.md;

  return (
    <span
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(e); } : undefined}
      className={[
        "inline-flex items-center font-medium ring-1 ring-inset",
        sizeClass,
        variantClass,
        rounded ? "rounded-full" : "rounded",
        onClick  ? "cursor-pointer select-none hover:opacity-80 transition-opacity" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={`inline-block rounded-full ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"} ${dotClass} shrink-0`}
        />
      )}
      {children}
    </span>
  );
};

Badge.propTypes = {
  children:  PropTypes.node.isRequired,
  variant:   PropTypes.oneOf(["default", "success", "warning", "danger", "info", "purple", "orange", "gray"]),
  size:      PropTypes.oneOf(["sm", "md", "lg"]),
  dot:       PropTypes.bool,
  rounded:   PropTypes.bool,
  className: PropTypes.string,
  onClick:   PropTypes.func,
};

export default Badge;
