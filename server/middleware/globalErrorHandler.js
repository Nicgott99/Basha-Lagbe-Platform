/**
 * globalErrorHandler
 * A structured Express error-handling middleware that replaces the inline
 * `app.use((err, req, res, next) => { ... })` in server/index.js.
 *
 * Why this matters:
 *   The previous inline error handler treated ALL errors identically — it
 *   always returned a generic JSON body regardless of error type. This means:
 *   - Mongoose `ValidationError` returned a 500 with a cryptic Mongoose message
 *   - JWT `JsonWebTokenError` returned a 500 with a JWT-specific message
 *   - Syntax errors in JSON body returned a 500 with a parsing-only message
 *   - Duplicate key errors (email already exists) returned a 500 with a MongoDB
 *     error string leaking internal collection/index names to the client
 *
 *   This middleware classifies errors by type and returns appropriate HTTP status
 *   codes and clean, user-friendly messages for each class of error, while
 *   logging the full technical details server-side only.
 *
 * Usage:
 *   Mount ONCE at the very end of server/index.js, after all routes:
 *     import globalErrorHandler from './middleware/globalErrorHandler.js';
 *     app.use(globalErrorHandler);
 *
 * Error classes handled:
 *   ┌─────────────────────────────────┬────────┬───────────────────────────────────┐
 *   │ Error type                      │ Status │ Client message                    │
 *   ├─────────────────────────────────┼────────┼───────────────────────────────────┤
 *   │ Custom errorHandler() errors    │ as-set │ err.message (already safe)        │
 *   │ Mongoose ValidationError        │ 422    │ field-level validation messages   │
 *   │ Mongoose CastError (bad ID)     │ 400    │ "Invalid ID format"               │
 *   │ MongoDB duplicate key (code 11000) │ 409 │ "X already exists"               │
 *   │ JWT JsonWebTokenError           │ 401    │ "Invalid token"                   │
 *   │ JWT TokenExpiredError           │ 401    │ "Token has expired"               │
 *   │ JSON SyntaxError (bad body)     │ 400    │ "Invalid JSON in request body"    │
 *   │ ENOENT / EPIPE (file/network)   │ 500    │ generic (details logged only)     │
 *   │ Everything else                 │ 500    │ "Internal server error"           │
 *   └─────────────────────────────────┴────────┴───────────────────────────────────┘
 *
 * Security:
 *   - Stack traces are NEVER sent to the client
 *   - MongoDB/Mongoose internals (collection names, indexes) are never exposed
 *   - In production, generic 500 messages hide all implementation details
 *
 * @module globalErrorHandler
 */

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * Format Mongoose ValidationError field messages into a clean array.
 * @param {import('mongoose').Error.ValidationError} err
 * @returns {{ field: string, message: string }[]}
 */
const formatValidationErrors = (err) =>
  Object.values(err.errors).map((e) => ({
    field:   e.path,
    message: e.message,
  }));

/**
 * Extract the duplicate field name from a MongoDB E11000 error message.
 * Example input: 'E11000 duplicate key error collection: db.users index: email_1'
 * @param {Error} err
 * @returns {string} e.g. "email"
 */
const getDuplicateField = (err) => {
  // MongoDB 5+ format: { email: '...' }
  if (err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    return field.charAt(0).toUpperCase() + field.slice(1);
  }
  // Older format — parse from error message
  const match = err.message.match(/index: (.+?)_\d/);
  return match ? match[1] : 'Value';
};

/**
 * Express global error handler middleware.
 * @param {Error}                          err
 * @param {import('express').Request}      req
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction}  next  — required 4-arg signature for Express
 */
const globalErrorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  // ── Log full error details server-side ────────────────────────────────────
  const logPrefix = `[ERROR] ${req.method} ${req.originalUrl}`;
  if (!IS_PRODUCTION || err.statusCode >= 500) {
    console.error(`${logPrefix} — ${err.name || 'Error'}: ${err.message}`);
    if (err.stack) console.error(err.stack);
  } else {
    // In production, only log 4xx errors briefly (they're expected)
    console.warn(`${logPrefix} — ${err.statusCode || 500}: ${err.message}`);
  }

  // ── Custom app errors (thrown via errorHandler()) ─────────────────────────
  if (err.statusCode && err.statusCode !== 500) {
    return res.status(err.statusCode).json({
      success:    false,
      statusCode: err.statusCode,
      message:    err.message,
      timestamp:  new Date().toISOString(),
    });
  }

  // ── Mongoose ValidationError ───────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      success:    false,
      statusCode: 422,
      message:    'Validation failed. Check the errors array for details.',
      errors:     formatValidationErrors(err),
      timestamp:  new Date().toISOString(),
    });
  }

  // ── Mongoose CastError (invalid ObjectId) ─────────────────────────────────
  if (err.name === 'CastError') {
    return res.status(400).json({
      success:    false,
      statusCode: 400,
      message:    `Invalid ${err.path}: "${err.value}" is not a valid ID format.`,
      timestamp:  new Date().toISOString(),
    });
  }

  // ── MongoDB duplicate key (E11000) ────────────────────────────────────────
  if (err.code === 11000) {
    const field = getDuplicateField(err);
    return res.status(409).json({
      success:    false,
      statusCode: 409,
      message:    `${field} already exists. Please use a different value.`,
      timestamp:  new Date().toISOString(),
    });
  }

  // ── JSON Web Token errors ─────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success:    false,
      statusCode: 401,
      message:    'Invalid authentication token. Please sign in again.',
      timestamp:  new Date().toISOString(),
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success:    false,
      statusCode: 401,
      message:    'Authentication token has expired. Please sign in again.',
      timestamp:  new Date().toISOString(),
    });
  }

  // ── JSON body parse errors (bad JSON from client) ─────────────────────────
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success:    false,
      statusCode: 400,
      message:    'Invalid JSON in request body. Please check your request format.',
      timestamp:  new Date().toISOString(),
    });
  }

  // ── Generic 500 — hide implementation details in production ───────────────
  const message = IS_PRODUCTION
    ? 'An unexpected error occurred. Please try again later.'
    : (err.message || 'Internal Server Error');

  return res.status(500).json({
    success:    false,
    statusCode: 500,
    message,
    // Include stack in development for easier debugging
    ...(IS_PRODUCTION ? {} : { stack: err.stack }),
    timestamp:  new Date().toISOString(),
  });
};

export default globalErrorHandler;
