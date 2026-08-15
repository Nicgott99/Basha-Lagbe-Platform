import { errorHandler } from '../utils/error.js';

/**
 * rateLimitByUser
 * A per-authenticated-user rate limiter that counts requests against the
 * user's JWT identity rather than their IP address.
 *
 * Why IP-based limiting alone is insufficient:
 *   - University/office/mobile carrier NAT: dozens of legitimate users share
 *     the same public IP. One heavy user can exhaust the shared IP quota,
 *     blocking innocent users on the same network.
 *   - VPN users or cloud scraper fleets can rotate IPs to bypass IP limits.
 *   - Authenticated endpoints already have a verified identity — use it.
 *
 * Behaviour:
 *   - Falls back to IP-based limiting when no token is present (anonymous
 *     requests), so unauthenticated abuse is still capped.
 *   - Uses an in-memory Map<string, { count, resetAt }> store — no Redis
 *     required. Buckets expire automatically after `windowMs`.
 *   - A cleanup interval runs every `windowMs` to evict expired buckets,
 *     preventing unbounded memory growth in long-running processes.
 *   - Returns standard `Retry-After` and `X-RateLimit-*` response headers
 *     so clients know when they can retry.
 *
 * @param {Object} [options]
 * @param {number} [options.windowMs=60000]  - Rolling window in milliseconds (default 1 minute)
 * @param {number} [options.max=60]          - Max requests per window per user/IP (default 60)
 * @param {string} [options.message]         - Custom 429 message
 *
 * @returns {import('express').RequestHandler}
 *
 * Usage (in server/index.js or on specific routers):
 * @example
 *   import rateLimitByUser from './middleware/rateLimitByUser.js';
 *
 *   // Apply to all authenticated routes (60 req/min per user)
 *   app.use('/server', rateLimitByUser());
 *
 *   // Stricter limit on write operations (20 req/min per user)
 *   router.post('/apply', rateLimitByUser({ max: 20 }), applyHandler);
 *
 *   // Custom window
 *   router.post('/inquiry', rateLimitByUser({ windowMs: 5 * 60 * 1000, max: 10 }), inquiryHandler);
 */

const rateLimitByUser = ({
  windowMs = 60 * 1000,   // 1 minute
  max      = 60,          // 60 requests per window
  message  = 'Too many requests. Please slow down and try again shortly.',
} = {}) => {
  /** @type {Map<string, { count: number, resetAt: number }>} */
  const store = new Map();

  // Periodic cleanup to evict expired buckets — runs every windowMs
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of store.entries()) {
      if (bucket.resetAt <= now) store.delete(key);
    }
  }, windowMs);

  // Allow Node to exit cleanly even if the interval is still running
  if (cleanupInterval.unref) cleanupInterval.unref();

  return (req, res, next) => {
    const now = Date.now();

    // Determine the rate-limit key:
    //   - Authenticated: user ID from JWT (set by verifyToken middleware)
    //   - Anonymous:     IP address (fallback)
    const key = req.user?.id
      ? `user:${req.user.id}`
      : `ip:${req.ip || req.socket?.remoteAddress || 'unknown'}`;

    let bucket = store.get(key);

    // Initialise or reset an expired bucket
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      store.set(key, bucket);
    }

    bucket.count += 1;

    const remaining = Math.max(0, max - bucket.count);
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000); // seconds

    // Set informational rate-limit headers on every response
    res.setHeader('X-RateLimit-Limit',     max);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset',     Math.ceil(bucket.resetAt / 1000)); // Unix timestamp

    if (bucket.count > max) {
      res.setHeader('Retry-After', retryAfter);
      return next(errorHandler(429, message));
    }

    next();
  };
};

export default rateLimitByUser;
