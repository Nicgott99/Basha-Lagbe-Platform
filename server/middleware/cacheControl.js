/**
 * cacheControl middleware
 * Sets HTTP Cache-Control response headers automatically based on the
 * requested route, reducing unnecessary repeat requests to the server.
 *
 * Why this matters:
 *   - Property listing pages, public search results, and static assets are
 *     re-fetched on every navigation without caching headers.
 *   - Browsers and CDNs can serve cached responses for these routes, cutting
 *     server load and improving perceived page speed.
 *   - Auth routes and user-specific data must never be cached — this
 *     middleware handles both cases correctly.
 *
 * Cache strategy by route:
 *   - /server/listing/get/:id  → public, 5 min CDN + 1 min browser
 *   - /server/listing/get      → public, 2 min CDN + 30s browser (list changes more)
 *   - /server/health           → no-store (monitoring tools need live data)
 *   - /server/auth/**          → private, no-store (security-sensitive)
 *   - /server/user/**          → private, no-store (user-specific)
 *   - Everything else          → private, no-cache (validate before use)
 *
 * Usage:
 *   // In server/index.js, after CORS but before routes:
 *   import cacheControl from './middleware/cacheControl.js';
 *   app.use(cacheControl);
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const cacheControl = (req, res, next) => {
  const path = req.path;

  // ── Auth & User routes — NEVER cache (security-sensitive) ──────────────
  if (path.startsWith('/server/auth') || path.startsWith('/server/user')) {
    res.setHeader('Cache-Control', 'private, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    return next();
  }

  // ── Health check — live data always needed ──────────────────────────────
  if (path.startsWith('/server/health')) {
    res.setHeader('Cache-Control', 'no-store');
    return next();
  }

  // ── Single property listing — public, medium lifetime ──────────────────
  // s-maxage: CDN caches for 5 minutes; max-age: browser caches for 1 minute
  if (path.match(/^\/server\/listing\/get\/[^/]+$/)) {
    res.setHeader(
      'Cache-Control',
      'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
    );
    return next();
  }

  // ── Property listing index / search — shorter lifetime (list updates) ──
  // s-maxage: CDN caches for 2 minutes; max-age: browser caches for 30s
  if (path.startsWith('/server/listing/get') || path.startsWith('/server/listing/search')) {
    res.setHeader(
      'Cache-Control',
      'public, max-age=30, s-maxage=120, stale-while-revalidate=300'
    );
    return next();
  }

  // ── Public stats (used on Home/Dashboard) ─────────────────────────────
  if (path.startsWith('/server/admin/stats') || path.startsWith('/server/admin/real-stats')) {
    res.setHeader(
      'Cache-Control',
      'public, max-age=60, s-maxage=300'
    );
    return next();
  }

  // ── Default: private, validate before use ─────────────────────────────
  res.setHeader('Cache-Control', 'private, no-cache');
  next();
};

export default cacheControl;
