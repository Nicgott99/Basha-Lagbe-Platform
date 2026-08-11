import { motion } from "framer-motion";
import PropTypes from "prop-types";
import useIntersectionObserver from "../hooks/useIntersectionObserver";

/**
 * FadeInSection
 * A layout wrapper that animates its children into view when the section
 * scrolls into the viewport. Uses useIntersectionObserver with
 * freezeOnceVisible so the animation only plays once per page visit.
 *
 * Supports four entrance directions and a configurable delay for staggered
 * multi-section layouts.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children    - Content to animate in
 * @param {'up'|'down'|'left'|'right'} [props.direction='up']
 *   Direction the element slides in from (combined with fade)
 * @param {number} [props.delay=0]           - Delay in seconds before animation starts
 * @param {number} [props.duration=0.6]      - Animation duration in seconds
 * @param {string} [props.className]          - Extra classes on the wrapper div
 * @param {string} [props.rootMargin='-80px'] - Trigger offset from bottom of viewport
 *
 * @example
 *   // Basic usage — slides up and fades in
 *   <FadeInSection>
 *     <FeatureCard />
 *   </FadeInSection>
 *
 * @example
 *   // Staggered sections
 *   <FadeInSection delay={0}>   <StatsRow />   </FadeInSection>
 *   <FadeInSection delay={0.1}> <FeaturedGrid /></FadeInSection>
 *   <FadeInSection delay={0.2}> <Testimonials /></FadeInSection>
 *
 * @example
 *   // Slide in from left
 *   <FadeInSection direction="left">
 *     <SidePanel />
 *   </FadeInSection>
 */

const DIRECTION_VARIANTS = {
  up:    { hidden: { opacity: 0, y: 40  }, visible: { opacity: 1, y: 0  } },
  down:  { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0  } },
  left:  { hidden: { opacity: 0, x: 40  }, visible: { opacity: 1, x: 0  } },
  right: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0  } },
};

const FadeInSection = ({
  children,
  direction  = "up",
  delay      = 0,
  duration   = 0.6,
  className  = "",
  rootMargin = "-80px",
}) => {
  const [ref, isVisible] = useIntersectionObserver({
    rootMargin,
    threshold:         0.05,
    freezeOnceVisible: true,
  });

  const variants = DIRECTION_VARIANTS[direction] ?? DIRECTION_VARIANTS.up;

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

FadeInSection.propTypes = {
  children:   PropTypes.node.isRequired,
  direction:  PropTypes.oneOf(["up", "down", "left", "right"]),
  delay:      PropTypes.number,
  duration:   PropTypes.number,
  className:  PropTypes.string,
  rootMargin: PropTypes.string,
};

export default FadeInSection;
