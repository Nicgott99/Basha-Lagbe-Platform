/**
 * validatePagination.js
 * Express middleware that parses, coerces, and sanitises the `page`, `limit`,
 * and `sort` query parameters before they reach any listing/search controller.
 *
 * Problem it solves:
 *   Every listing and search endpoint independently parses parseInt(req.query.page)
 *   and clamps limits, leading to repeated code and inconsistent edge-case handling.
 *   This middleware does it once, uniformly.
 *
 * What it does:
 *   - Parses `page`  (default 1)  — clamped to ≥ 1, max 10 000
 *   - Parses `limit` (default 12) — clamped to 1–100
 *   - Validates `sort` against an allowlist to block arbitrary field injection
 *   - Sets `req.pagination` = { page, limit, skip, sort } so controllers just
 *     destructure it instead of doing their own parsing
 *   - Returns 400 with a descriptive message when values are clearly invalid
 *     (e.g. `page=-1`, `limit=999999`, `sort=__proto__`)
 *
 * Allowed sort fields (extend as needed):
 *   'createdAt', '-createdAt', 'rentPrice', '-rentPrice',
 *   'rating', '-rating', 'relevance'
 *
 * Usage:
 *   import validatePagination from '../middleware/validatePagination.js';
 *   router.get('/get', validatePagination, getListings);
 *
 * Then in the controller:
 *   const { page, limit, skip, sort } = req.pagination;
 *   const results = await Property.find(query).sort(sort).skip(skip).limit(limit);
 */

const ALLOWED_SORT_FIELDS = new Set([
  'createdAt', '-createdAt',
  'rentPrice', '-rentPrice',
  'rating',    '-rating',
  'relevance',
]);

const DEFAULT_LIMIT = 12;
const MAX_LIMIT     = 100;
const MAX_PAGE      = 10_000;

/**
 * validatePagination middleware
 * Reads req.query.page, req.query.limit, req.query.sort and sets req.pagination.
 */
const validatePagination = (req, res, next) => {
  try {
    // ── page ──────────────────────────────────────────────────────────────────
    let page = parseInt(req.query.page, 10);
    if (isNaN(page) || page < 1) page = 1;
    if (page > MAX_PAGE) {
      return res.status(400).json({
        success: false,
        message: `Page must be between 1 and ${MAX_PAGE.toLocaleString()}.`,
      });
    }

    // ── limit ─────────────────────────────────────────────────────────────────
    let limit = parseInt(req.query.limit, 10);
    if (isNaN(limit) || limit < 1) limit = DEFAULT_LIMIT;
    if (limit > MAX_LIMIT) {
      return res.status(400).json({
        success: false,
        message: `Limit must be between 1 and ${MAX_LIMIT}.`,
      });
    }

    // ── sort ──────────────────────────────────────────────────────────────────
    const rawSort = req.query.sort?.trim() || '-createdAt';
    if (!ALLOWED_SORT_FIELDS.has(rawSort)) {
      return res.status(400).json({
        success: false,
        message: `Invalid sort field '${rawSort}'. Allowed: ${[...ALLOWED_SORT_FIELDS].join(', ')}.`,
      });
    }

    // Convert the sort string to a Mongoose-compatible sort object
    // '-createdAt' → { createdAt: -1 }, 'rentPrice' → { rentPrice: 1 }
    const sortField = rawSort.startsWith('-') ? rawSort.slice(1) : rawSort;
    const sortOrder = rawSort.startsWith('-') ? -1 : 1;
    // 'relevance' keeps the text score sort and has no Mongoose equivalent here
    const sortObj   = rawSort === 'relevance' ? { score: { $meta: 'textScore' } } : { [sortField]: sortOrder };

    // ── Attach to request ─────────────────────────────────────────────────────
    req.pagination = {
      page,
      limit,
      skip:    (page - 1) * limit,
      sort:    sortObj,
      sortRaw: rawSort,
    };

    next();
  } catch (err) {
    // Sanitisation should never crash — log and default gracefully
    console.warn('[validatePagination] Unexpected error:', err.message);
    req.pagination = {
      page:    1,
      limit:   DEFAULT_LIMIT,
      skip:    0,
      sort:    { createdAt: -1 },
      sortRaw: '-createdAt',
    };
    next();
  }
};

export default validatePagination;
