/**
 * responseFormatter
 * Standardises all HTTP API responses from the Basha Lagbe server.
 *
 * Problem it solves:
 *   Across 38+ controller endpoints, `res.status(X).json(...)` produces
 *   inconsistent shapes. Some return { success, message, data }, some return
 *   { success, user, token }, some return raw arrays, and one returns a plain
 *   object with no wrapper at all. This forces the frontend (apiService.js)
 *   to defensively branch on every response, making bugs harder to catch.
 *
 * Solution:
 *   Every response goes through one of two functions:
 *     sendSuccess(res, data, message, statusCode) — for 2xx responses
 *     sendError(res, message, statusCode, errors)  — for 4xx/5xx responses
 *
 *   Both produce a predictable envelope that apiService.js can rely on:
 *
 *   SUCCESS:
 *   {
 *     "success": true,
 *     "statusCode": 200,
 *     "message": "User profile updated",
 *     "data": { ...payload },
 *     "timestamp": "2026-08-24T00:00:00.000Z"
 *   }
 *
 *   ERROR (handled by errorHandler.js, but mirrored here for controllers):
 *   {
 *     "success": false,
 *     "statusCode": 400,
 *     "message": "Email already in use",
 *     "errors": ["email: must be unique"],   // optional validation errors
 *     "timestamp": "2026-08-24T00:00:00.000Z"
 *   }
 *
 * Usage:
 *   import { sendSuccess, sendError, sendPaginated } from '../utils/responseFormatter.js';
 *
 *   // Simple success
 *   sendSuccess(res, { user }, 'Profile updated');
 *
 *   // Created (201)
 *   sendSuccess(res, { listing }, 'Listing created', 201);
 *
 *   // No content (204) — data omitted automatically
 *   sendSuccess(res, null, 'Listing deleted', 204);
 *
 *   // Paginated list
 *   sendPaginated(res, listings, { page: 1, limit: 12, total: 48 });
 *
 *   // Error (rarely needed — prefer errorHandler for thrown errors)
 *   sendError(res, 'Email already in use', 409);
 */

/**
 * Send a successful API response.
 *
 * @param {import('express').Response} res
 * @param {*}       [data=null]       - Payload to send (omitted for 204)
 * @param {string}  [message='Success'] - Human-readable success message
 * @param {number}  [statusCode=200]  - HTTP status code (200, 201, 204, etc.)
 */
export const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  // 204 No Content must not have a body
  if (statusCode === 204) {
    return res.status(204).end();
  }

  const body = {
    success:    true,
    statusCode,
    message,
    timestamp:  new Date().toISOString(),
  };

  // Only include `data` key when there is actual data to send
  if (data !== null && data !== undefined) {
    body.data = data;
  }

  return res.status(statusCode).json(body);
};

/**
 * Send a paginated list response.
 * Adds a `pagination` envelope alongside the `data` array.
 *
 * @param {import('express').Response} res
 * @param {Array}   items             - The page of items to return
 * @param {Object}  pagination
 * @param {number}  pagination.page   - Current page (1-indexed)
 * @param {number}  pagination.limit  - Items per page
 * @param {number}  pagination.total  - Total number of matching items
 * @param {string}  [message='Data retrieved successfully']
 * @param {number}  [statusCode=200]
 */
export const sendPaginated = (
  res,
  items,
  { page, limit, total },
  message    = 'Data retrieved successfully',
  statusCode = 200
) => {
  const totalPages  = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return res.status(statusCode).json({
    success:    true,
    statusCode,
    message,
    timestamp:  new Date().toISOString(),
    data:       items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  });
};

/**
 * Send an error API response.
 * Prefer throwing via errorHandler for most cases — use this only when
 * you need to send an error response directly without throwing.
 *
 * @param {import('express').Response} res
 * @param {string}   message           - Human-readable error description
 * @param {number}   [statusCode=500]  - HTTP status code
 * @param {string[]} [errors=[]]       - Optional array of validation error strings
 */
export const sendError = (res, message = 'Internal server error', statusCode = 500, errors = []) => {
  const body = {
    success:    false,
    statusCode,
    message,
    timestamp:  new Date().toISOString(),
  };

  if (errors.length > 0) {
    body.errors = errors;
  }

  return res.status(statusCode).json(body);
};

export default { sendSuccess, sendError, sendPaginated };
