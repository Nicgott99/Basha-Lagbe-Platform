/**
 * sanitizeInput.js
 * Express middleware that recursively strips dangerous characters from
 * req.body, req.query, and req.params before they reach any controller.
 *
 * What it defends against:
 *   - Basic XSS: removes <script>, HTML tags, and event attributes
 *   - NoSQL injection: removes MongoDB operator keys that start with "$"
 *     and dot-notation keys used for path traversal
 *   - Prototype pollution: deletes __proto__, constructor, prototype keys
 *
 * What it does NOT replace:
 *   - A proper HTML sanitisation library (e.g. DOMPurify) for rich-text fields
 *   - Input validation (lengths, formats, required fields — done in controllers)
 *   - Parameterised queries for SQL (Mongoose already uses typed schemas)
 *
 * Usage:
 *   import sanitizeInput from './middleware/sanitizeInput.js';
 *   app.use(sanitizeInput);
 */

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Strip HTML tags and dangerous patterns from a string value */
const sanitizeString = (value) => {
  if (typeof value !== 'string') return value;

  return value
    // Remove <script>...</script> blocks (case-insensitive, multiline)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove all remaining HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove inline event handlers (onclick=, onload=, etc.)
    .replace(/\bon\w+\s*=/gi, '')
    // Remove javascript: pseudo-protocol URIs
    .replace(/javascript:/gi, '')
    // Trim surrounding whitespace
    .trim();
};

/** Recursively sanitize an object or array */
const sanitizeValue = (value) => {
  if (value === null || value === undefined) return value;

  if (typeof value === 'string') return sanitizeString(value);

  if (Array.isArray(value)) return value.map(sanitizeValue);

  if (typeof value === 'object') {
    const clean = {};
    for (const key of Object.keys(value)) {
      // Block prototype pollution keys
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      // Block MongoDB operator injection (keys starting with $)
      if (key.startsWith('$')) {
        continue;
      }
      // Block dot-notation path traversal keys
      if (key.includes('.')) {
        continue;
      }
      clean[key] = sanitizeValue(value[key]);
    }
    return clean;
  }

  // Numbers, booleans, etc. — pass through unchanged
  return value;
};

// ── Middleware ────────────────────────────────────────────────────────────────

/**
 * sanitizeInput
 * Sanitizes req.body, req.query, and req.params in place.
 * Runs synchronously — no async needed.
 */
const sanitizeInput = (req, res, next) => {
  try {
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeValue(req.body);
    }
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeValue(req.query);
    }
    if (req.params && typeof req.params === 'object') {
      req.params = sanitizeValue(req.params);
    }
  } catch (err) {
    // Sanitisation should never crash the request — log and continue
    console.warn('[sanitizeInput] Sanitisation error (non-fatal):', err.message);
  }
  next();
};

export default sanitizeInput;
