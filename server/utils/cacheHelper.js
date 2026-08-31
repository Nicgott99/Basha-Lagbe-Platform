/**
 * cacheHelper.js
 * A lightweight, zero-dependency, in-memory TTL (Time-To-Live) cache
 * for the Basha Lagbe Express server.
 *
 * Problem it solves:
 *   Several endpoints run expensive, frequently-identical MongoDB queries
 *   on every single request — even when the underlying data changes rarely:
 *
 *   GET /server/admin/real-stats
 *     Runs 4 x countDocuments() on Property, User, Application collections.
 *     The Home page calls this on every load. With 100 concurrent users,
 *     that's 400 MongoDB operations/minute for data that only changes when a
 *     new listing is created or a user registers — at most a few times per hour.
 *
 *   GET /server/listing/get (featured properties)
 *     Fetches the same featured listings for every Home page visitor.
 *     Results don't change until an admin approves/rejects a listing.
 *
 *   This cache makes these endpoints serve from memory (< 1ms) instead of
 *   MongoDB (20–80ms), reducing DB load by up to 95% for slow-changing data.
 *
 * Design decisions:
 *   - Zero dependencies: uses a native Map (no Redis, no memcached to set up)
 *   - TTL-based eviction: entries expire automatically; no manual invalidation
 *   - Lazy eviction: expired entries are deleted on access (no background timer)
 *   - Periodic cleanup: a scheduled sweep removes stale entries to prevent
 *     unbounded memory growth in long-running server instances
 *   - Not suitable for: user-specific data, session state, or data that changes
 *     within its TTL window and must be immediately consistent
 *
 * When to use:
 *   ✅ Site-wide stats (total properties, users — changes every few hours)
 *   ✅ Featured property lists (changes when admin approves listings)
 *   ✅ District/area lookup lists (essentially static)
 *   ✅ Any GET endpoint that: (a) is public, (b) data changes infrequently
 *   ❌ User-specific data (cart, saved properties, notifications)
 *   ❌ Payment, auth, or any write endpoints
 *
 * Usage:
 *   import { getOrSet, invalidate, invalidatePattern } from '../utils/cacheHelper.js';
 *
 *   // Wrap expensive query with a 5-minute cache
 *   const stats = await getOrSet('admin:real-stats', async () => {
 *     const total = await Property.countDocuments();
 *     return { totalProperties: total };
 *   }, 5 * 60); // TTL in seconds
 *
 *   // Invalidate a specific key when data changes (e.g. after creating a listing)
 *   invalidate('admin:real-stats');
 *
 *   // Invalidate all keys matching a pattern (e.g. after bulk admin approval)
 *   invalidatePattern('listing:featured');
 */

/** @type {Map<string, { value: any, expiresAt: number }>} */
const store = new Map();

// ── Configuration ────────────────────────────────────────────────────────────
const DEFAULT_TTL_SECONDS = 300; // 5 minutes
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // Run cleanup every 10 minutes

// ── Lazy eviction helper ──────────────────────────────────────────────────────
const isExpired = (entry) => Date.now() > entry.expiresAt;

// ── Periodic cleanup — removes all expired entries ─────────────────────────
const cleanupExpired = () => {
  let removed = 0;
  for (const [key, entry] of store.entries()) {
    if (isExpired(entry)) {
      store.delete(key);
      removed++;
    }
  }
  if (removed > 0) {
    console.log(`[cacheHelper] Cleanup: removed ${removed} expired entries. Store size: ${store.size}`);
  }
};

// Schedule periodic cleanup (unref'd so it doesn't prevent process exit)
const cleanupTimer = setInterval(cleanupExpired, CLEANUP_INTERVAL_MS);
if (cleanupTimer.unref) cleanupTimer.unref();

// ── Core API ─────────────────────────────────────────────────────────────────

/**
 * Get a value from cache, or compute and cache it if missing/expired.
 * This is the primary function — use this for all cached queries.
 *
 * @template T
 * @param {string}   key     - Cache key (use namespaced format: 'resource:variant')
 * @param {() => Promise<T>} fetcher - Async function to compute the value on cache miss
 * @param {number}   [ttlSeconds=300] - Time-to-live in seconds (default: 5 minutes)
 * @returns {Promise<T>}
 *
 * @example
 *   const stats = await getOrSet('admin:real-stats', async () => {
 *     const total = await Property.countDocuments();
 *     const users = await User.countDocuments();
 *     return { total, users };
 *   }, 300); // cache for 5 minutes
 */
export const getOrSet = async (key, fetcher, ttlSeconds = DEFAULT_TTL_SECONDS) => {
  const entry = store.get(key);

  // Cache hit — return immediately if not expired
  if (entry && !isExpired(entry)) {
    return entry.value;
  }

  // Cache miss or expired — call the fetcher
  const value = await fetcher();

  store.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });

  return value;
};

/**
 * Get a value from cache (no compute — returns undefined on miss/expiry).
 * Use when you want to check the cache without triggering a fetch.
 *
 * @param {string} key
 * @returns {T | undefined}
 */
export const get = (key) => {
  const entry = store.get(key);
  if (!entry || isExpired(entry)) {
    if (entry) store.delete(key); // lazy eviction
    return undefined;
  }
  return entry.value;
};

/**
 * Set a value in the cache explicitly (without a fetcher).
 *
 * @param {string} key
 * @param {*}      value
 * @param {number} [ttlSeconds=300]
 */
export const set = (key, value, ttlSeconds = DEFAULT_TTL_SECONDS) => {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
};

/**
 * Invalidate (delete) a specific cache entry immediately.
 * Call this when you know cached data has changed (e.g. after creating a listing).
 *
 * @param {string} key
 * @returns {boolean} true if the key existed and was deleted
 *
 * @example
 *   // After a new listing is created, clear the stats cache
 *   invalidate('admin:real-stats');
 */
export const invalidate = (key) => store.delete(key);

/**
 * Invalidate all cache entries whose key starts with the given prefix.
 * Useful for invalidating a group of related cached queries.
 *
 * @param {string} prefix
 * @returns {number} Number of keys deleted
 *
 * @example
 *   invalidatePattern('listing:');  // clears 'listing:featured', 'listing:search:dhaka', etc.
 */
export const invalidatePattern = (prefix) => {
  let count = 0;
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key);
      count++;
    }
  }
  return count;
};

/**
 * Clear the entire cache. Use sparingly — only during testing or after bulk
 * data migrations where all cached data is known to be stale.
 */
export const flush = () => store.clear();

/**
 * Get current cache statistics (useful for health checks and monitoring).
 *
 * @returns {{ size: number, keys: string[] }}
 */
export const stats = () => ({
  size: store.size,
  keys: [...store.keys()],
});

export default { getOrSet, get, set, invalidate, invalidatePattern, flush, stats };
