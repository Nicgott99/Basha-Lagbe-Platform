/**
 * corsOptions
 * Environment-aware CORS configuration for the Basha Lagbe API server.
 *
 * Problem with the current approach:
 *   The server/index.js hardcodes CORS origins as:
 *     origin: ['http://localhost:5173', 'http://localhost:5174']
 *
 *   This has two critical problems:
 *   1. In production, all real traffic is blocked (the frontend domain is not
 *      in the allowlist), causing every browser request to fail with CORS errors.
 *   2. The list cannot be updated without redeploying code — origin changes
 *      (e.g. adding a staging URL, a new port, a CDN domain) require a commit.
 *
 * Solution:
 *   Read allowed origins from the ALLOWED_ORIGINS environment variable.
 *   Fall back to localhost dev origins if the variable is not set.
 *   Use a dynamic origin function (not a static array) so each request is
 *   validated individually and the error message is informative.
 *
 * Configuration (in .env):
 *   # Single origin
 *   ALLOWED_ORIGINS=https://bashalagbe.com
 *
 *   # Multiple origins — comma-separated
 *   ALLOWED_ORIGINS=https://bashalagbe.com,https://www.bashalagbe.com,https://staging.bashalagbe.com
 *
 *   # Development (default — no env var needed)
 *   # Falls back to: http://localhost:5173, http://localhost:5174
 *
 * Usage (in server/index.js):
 *   import corsOptions from './middleware/corsOptions.js';
 *   app.use(cors(corsOptions));
 *
 * @module corsOptions
 */

// ── Resolve allowed origins from environment ──────────────────────────────────
const DEV_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
];

const resolveAllowedOrigins = () => {
  const envValue = process.env.ALLOWED_ORIGINS;
  if (!envValue || !envValue.trim()) return DEV_ORIGINS;

  return envValue
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
};

const ALLOWED_ORIGINS = resolveAllowedOrigins();

// Log the resolved allowlist once at startup (not on every request)
console.log(`🌐 CORS: ${ALLOWED_ORIGINS.length} allowed origin(s): ${ALLOWED_ORIGINS.join(', ')}`);

// ── CORS options object ────────────────────────────────────────────────────────
const corsOptions = {
  /**
   * Dynamic origin validator.
   * Called on every incoming request with the value of the Origin header.
   *
   * @param {string|undefined} origin - The request's Origin header value.
   *   undefined means the request has no Origin (e.g. server-to-server, curl,
   *   Postman without an origin set). We allow these — they are not browser
   *   cross-origin requests.
   * @param {Function} callback - cors() callback: callback(error, allow)
   */
  origin: (origin, callback) => {
    // Allow requests with no Origin (server-to-server, curl, Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    // Reject with a descriptive error — visible in browser DevTools Network tab
    callback(
      new Error(
        `CORS: Origin "${origin}" is not in the allowlist. ` +
        `Set ALLOWED_ORIGINS in .env to add it.`
      )
    );
  },

  // Allow cookies and Authorization headers to be sent cross-origin
  credentials: true,

  // Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  // Headers the browser is allowed to send
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
  ],

  // Headers the browser is allowed to read from the response
  exposedHeaders: [
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
    'Retry-After',
  ],

  // Cache the preflight (OPTIONS) response for 1 hour — reduces OPTIONS round trips
  maxAge: 3600,
};

export { ALLOWED_ORIGINS };
export default corsOptions;
