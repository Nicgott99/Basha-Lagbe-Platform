/**
 * slowDown.js
 * Progressive delay middleware for Express — slows down responses as request
 * frequency increases, rather than hard-blocking with 429.
 *
 * Problem it solves:
 *   The existing `express-rate-limit` middleware gives a hard 429 "Too Many
 *   Requests" error after hitting the limit. This is the right choice for
 *   clear abuse, but it's too aggressive as a first response to repeated
 *   requests:
 *
 *   - A legitimate user on a slow mobile connection might retry a failed
 *     auth request 5 times — they get hard-blocked and see an error page.
 *   - Bots doing credential stuffing can detect 429s and backoff strategically,
 *     then resume when the window resets.
 *
 *   Progressive slow-down is a softer, more effective first line of defence:
 *   - First few requests: no delay (normal user behaviour)
 *   - After threshold: each request adds Xms of delay (slows bots/scrapers
 *     without blocking legitimate users who simply hit retry)
 *   - After the delay exceeds a cap, requests are still served — just slowly
 *   - Combined with the hard rate limiter, this creates two defence layers
 *
 * How it works:
 *   Uses an in-process Map keyed by IP address. Each IP tracks:
 *   - `count`     : number of requests in the current window
 *   - `resetAt`   : timestamp when the count resets
 *   - `delayMs`   : current delay in milliseconds
 *
 *   On each request:
 *   1. If count < freeRequests → serve immediately (no delay, no state change)
 *   2. If count >= freeRequests → compute delay = (count - freeRequests) * delayAfter
 *   3. If delay > maxDelay → cap at maxDelay
 *   4. Set `X-SlowDown-Limit`, `X-SlowDown-Remaining`, `X-SlowDown-Delay-ms` headers
 *   5. Wait `delay` ms before calling next()
 *
 * Zero dependencies — uses native setTimeout and a Map (no Redis required).
 * For multi-instance deployments, replace the Map with Redis for shared state.
 *
 * @param {Object}  [options]
 * @param {number}  [options.windowMs=60000]    - Time window in ms (default: 1 minute)
 * @param {number}  [options.freeRequests=5]    - Requests before slowing starts
 * @param {number}  [options.delayAfter=500]    - Ms added per request over the free limit
 * @param {number}  [options.maxDelay=5000]     - Cap on total delay per request (ms)
 * @param {Function} [options.keyGenerator]     - Function to derive the rate key from req
 *                                               (default: req.ip)
 * @param {Function} [options.skip]             - Function(req) → boolean: skip slow-down for this req
 * @returns {import('express').RequestHandler}
 *
 * @example
 *   // Basic usage — apply to auth routes
 *   import slowDown from '../middleware/slowDown.js';
 *
 *   const authSlowDown = slowDown({
 *     windowMs:     60 * 1000,  // 1 minute window
 *     freeRequests: 5,          // first 5 are instant
 *     delayAfter:   500,        // +500ms per request after 5
 *     maxDelay:     5000,       // cap at 5 second delay
 *   });
 *
 *   router.post('/signin', authSlowDown, signin);
 *   router.post('/forgot-password', authSlowDown, forgotPassword);
 *
 * @example
 *   // Stack with hard rate limiter for layered defence
 *   router.post('/signin',
 *     authSlowDown,    // ← progressively slows repeat requests
 *     authLimiter,     // ← hard blocks after 20 requests/15min
 *     signin
 *   );
 *
 * @example
 *   // Skip slow-down for trusted admin IPs
 *   const slowDown = createSlowDown({
 *     skip: (req) => req.ip === process.env.ADMIN_IP,
 *   });
 *
 * @example
 *   // Custom key: slow down per-user (not per-IP) after auth
 *   const perUserSlowDown = createSlowDown({
 *     keyGenerator: (req) => req.user?.id || req.ip,
 *   });
 */

/** @type {Map<string, { count: number, resetAt: number, delayMs: number }>} */
const store = new Map();

// Periodic cleanup to prevent unbounded memory growth
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now >= entry.resetAt) store.delete(key);
  }
}, CLEANUP_INTERVAL);

if (cleanupTimer.unref) cleanupTimer.unref();

/**
 * Create a slow-down middleware instance with the given options.
 *
 * @param {Object} options
 */
const createSlowDown = ({
  windowMs     = 60_000,  // 1 minute
  freeRequests = 5,
  delayAfter   = 500,     // ms per request over the free limit
  maxDelay     = 5_000,   // 5 seconds maximum
  keyGenerator = (req) => req.ip || 'unknown',
  skip         = null,
} = {}) => {
  return (req, res, next) => {
    // Allow specific requests to bypass slow-down entirely
    if (skip && skip(req)) return next();

    const key = keyGenerator(req);
    const now = Date.now();

    // Get or initialise state for this key
    let entry = store.get(key);
    if (!entry || now >= entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs, delayMs: 0 };
    }

    entry.count += 1;

    // Compute progressive delay
    const overage  = Math.max(0, entry.count - freeRequests);
    const delayMs  = Math.min(overage * delayAfter, maxDelay);
    entry.delayMs  = delayMs;

    store.set(key, entry);

    // Set informational headers so clients/frontend can adapt
    res.setHeader('X-SlowDown-Limit',     freeRequests);
    res.setHeader('X-SlowDown-Remaining', Math.max(0, freeRequests - entry.count));
    res.setHeader('X-SlowDown-Delay-ms',  delayMs);

    if (delayMs === 0) {
      return next();
    }

    // Introduce the delay before calling next() — request continues normally
    // after the delay (unlike 429 which aborts the request entirely)
    setTimeout(next, delayMs);
  };
};

export default createSlowDown;
