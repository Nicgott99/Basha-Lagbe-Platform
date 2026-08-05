import PropTypes from "prop-types";

/**
 * SkeletonCard
 * A shimmer placeholder that matches the PropertyCard layout.
 * Render a grid of these while waiting for property data to load —
 * prevents layout shift and gives users visual feedback that content
 * is on its way.
 *
 * @param {Object}  props
 * @param {'default'|'compact'|'minimal'} [props.variant='default']
 *   Matches the variant prop of PropertyCard so skeletons align perfectly.
 * @param {number}  [props.count=1] - Number of skeleton cards to render
 *
 * @example
 *   // Show 6 skeleton cards while fetching properties
 *   {loading && <SkeletonCard count={6} />}
 *   {!loading && properties.map(...)}
 *
 * @example
 *   // Compact variant
 *   <SkeletonCard variant="compact" count={3} />
 */

/** A single animated shimmer line */
const ShimmerLine = ({ width = "w-full", height = "h-4", className = "" }) => (
  <div
    className={`${height} ${width} ${className} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded`}
  />
);

ShimmerLine.propTypes = {
  width:     PropTypes.string,
  height:    PropTypes.string,
  className: PropTypes.string,
};

/** A single skeleton card */
const SingleSkeletonCard = ({ variant }) => {
  const imageHeights = {
    default: "h-64",
    compact: "h-48",
    minimal: "h-40",
  };

  const paddingSizes = {
    default: "p-6",
    compact: "p-4",
    minimal: "p-4",
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      aria-hidden="true"
    >
      {/* Image placeholder */}
      <div className={`${imageHeights[variant]} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer`} />

      <div className={`${paddingSizes[variant]} space-y-4`}>
        {/* Title */}
        <ShimmerLine width="w-3/4" height="h-5" />

        {/* Location */}
        <div className="flex items-center gap-2">
          <ShimmerLine width="w-4" height="h-4" />
          <ShimmerLine width="w-1/2" height="h-4" />
        </div>

        {/* Stats row */}
        <div className="flex gap-4">
          <ShimmerLine width="w-16" height="h-4" />
          <ShimmerLine width="w-16" height="h-4" />
          <ShimmerLine width="w-16" height="h-4" />
        </div>

        {/* Description lines — only in default variant */}
        {variant === "default" && (
          <div className="space-y-2">
            <ShimmerLine />
            <ShimmerLine width="w-4/5" />
          </div>
        )}

        {/* Price + action row */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <ShimmerLine width="w-24" height="h-6" />
          <ShimmerLine width="w-20" height="h-9" className="rounded-lg" />
        </div>
      </div>
    </div>
  );
};

SingleSkeletonCard.propTypes = {
  variant: PropTypes.oneOf(["default", "compact", "minimal"]),
};

/** Main export — renders `count` skeleton cards */
const SkeletonCard = ({ variant = "default", count = 1 }) => (
  <>
    {Array.from({ length: count }, (_, i) => (
      <SingleSkeletonCard key={i} variant={variant} />
    ))}
  </>
);

SkeletonCard.propTypes = {
  variant: PropTypes.oneOf(["default", "compact", "minimal"]),
  count:   PropTypes.number,
};

export default SkeletonCard;
