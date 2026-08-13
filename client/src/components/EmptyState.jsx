import { motion } from "framer-motion";
import PropTypes from "prop-types";

/**
 * EmptyState
 * A reusable, visually polished component for displaying empty states across
 * the application: no search results, no saved properties, no notifications,
 * no messages, no applications, etc.
 *
 * Problem it solves:
 *   Every page (Search, Dashboard, Notifications, Applications, Messages)
 *   currently renders its own ad-hoc "No results" div with inconsistent copy,
 *   icons, and layout. This component standardises the empty-state pattern.
 *
 * @param {Object}   props
 * @param {string|React.ComponentType} props.icon
 *   An emoji string, a URL, or a Heroicon/React-Icons component to display.
 * @param {string}   props.title         - Primary heading (e.g. "No Properties Found")
 * @param {string}   [props.description] - Secondary explanation text
 * @param {Object}   [props.action]      - Optional CTA button
 * @param {string}     props.action.label   - Button label
 * @param {Function}   props.action.onClick - Button click handler
 * @param {string}     [props.action.variant] - 'primary' | 'outline' (default 'primary')
 * @param {string}   [props.className]   - Extra classes on the wrapper
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Controls padding and text sizes
 *
 * @example
 *   // No search results
 *   <EmptyState
 *     icon="🔍"
 *     title="No Properties Found"
 *     description="Try adjusting your filters or search in a different area."
 *     action={{ label: 'Clear Filters', onClick: clearFilters }}
 *   />
 *
 * @example
 *   // No saved properties
 *   <EmptyState
 *     icon="🏠"
 *     title="No Saved Properties"
 *     description="Start exploring and save properties you love to see them here."
 *     action={{ label: 'Browse Properties', onClick: () => navigate('/search') }}
 *   />
 *
 * @example
 *   // Empty notifications (no action button)
 *   <EmptyState
 *     icon="🔔"
 *     title="All Caught Up!"
 *     description="You have no new notifications."
 *     size="sm"
 *   />
 *
 * @example
 *   // Using a Heroicon component as the icon
 *   import { InboxIcon } from '@heroicons/react/24/outline';
 *   <EmptyState
 *     icon={InboxIcon}
 *     title="No Messages"
 *     description="You haven't received any messages yet."
 *   />
 */

const SIZE_CONFIG = {
  sm: {
    wrapper:     "py-10 px-4",
    iconEmoji:   "text-5xl mb-3",
    iconComp:    "w-12 h-12 mb-3",
    iconBg:      "w-16 h-16",
    title:       "text-lg font-semibold",
    description: "text-sm mt-1",
    button:      "px-4 py-2 text-sm",
  },
  md: {
    wrapper:     "py-16 px-6",
    iconEmoji:   "text-6xl mb-4",
    iconComp:    "w-14 h-14 mb-4",
    iconBg:      "w-20 h-20",
    title:       "text-xl font-semibold",
    description: "text-base mt-2",
    button:      "px-5 py-2.5 text-sm",
  },
  lg: {
    wrapper:     "py-24 px-8",
    iconEmoji:   "text-7xl mb-6",
    iconComp:    "w-16 h-16 mb-6",
    iconBg:      "w-24 h-24",
    title:       "text-2xl font-bold",
    description: "text-base mt-3",
    button:      "px-6 py-3 text-base",
  },
};

const EmptyState = ({
  icon,
  title,
  description,
  action,
  className = "",
  size      = "md",
}) => {
  const cfg            = SIZE_CONFIG[size] ?? SIZE_CONFIG.md;
  const isComponent    = typeof icon === "function";
  const isEmoji        = typeof icon === "string" && !icon.startsWith("http");
  const IconComponent  = isComponent ? icon : null;

  const buttonBase = `inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${cfg.button}`;
  const primaryBtn = `${buttonBase} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm`;
  const outlineBtn = `${buttonBase} border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-300`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex flex-col items-center justify-center text-center ${cfg.wrapper} ${className}`}
    >
      {/* Icon */}
      <div className="mb-4">
        {isComponent ? (
          <div className={`${cfg.iconBg} rounded-full bg-gray-100 flex items-center justify-center mx-auto`}>
            <IconComponent
              className={`${cfg.iconComp} text-gray-400`}
              aria-hidden="true"
            />
          </div>
        ) : isEmoji ? (
          <span className={cfg.iconEmoji} role="img" aria-hidden="true">
            {icon}
          </span>
        ) : (
          <img src={icon} alt="" className={`${cfg.iconBg} mx-auto object-contain`} />
        )}
      </div>

      {/* Text */}
      <h3 className={`text-gray-900 ${cfg.title}`}>{title}</h3>
      {description && (
        <p className={`text-gray-500 max-w-sm mx-auto ${cfg.description}`}>
          {description}
        </p>
      )}

      {/* CTA */}
      {action && (
        <div className="mt-6">
          <button
            onClick={action.onClick}
            className={action.variant === "outline" ? outlineBtn : primaryBtn}
          >
            {action.label}
          </button>
        </div>
      )}
    </motion.div>
  );
};

EmptyState.propTypes = {
  icon:        PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]).isRequired,
  title:       PropTypes.string.isRequired,
  description: PropTypes.string,
  action:      PropTypes.shape({
    label:   PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    variant: PropTypes.oneOf(["primary", "outline"]),
  }),
  className:   PropTypes.string,
  size:        PropTypes.oneOf(["sm", "md", "lg"]),
};

export default EmptyState;
