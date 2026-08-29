import { randomUUID } from 'crypto';

/**
 * requestId middleware
 * Assigns a unique UUID v4 to every incoming HTTP request and attaches it
 * to both `req.id` and the `X-Request-Id` response header.
 *
 * Why this matters:
 *   Without request IDs, multi-step errors are nearly impossible to trace.
 *   When a user reports "something went wrong", you see this in your logs:
 *
 *     [ERROR] POST /server/auth/signin — 500: Internal Server Error
 *     [ERROR] POST /server/auth/signin — 401: Invalid token
 *     [ERROR] POST /server/listing/get — 404: Listing not found
 *
 *   Which of the three POST /server/auth/signin entries is theirs? You can't tell.
 *   With request IDs:
 *
 *     [req:f47ac10b] POST /server/auth/signin — 500: Internal Server Error
 *     [req:f47ac10b] ValidationError: email is required
 *     [req:f47ac10b] Stack trace: ...
 *
 *   Every log line for the same request shares the same ID. Finding all logs
 *   for a single failing request is now a simple grep:
 *     grep "req:f47ac10b" server.log
 *
 * How it works:
 *   1. Checks if the incoming request already has an `X-Request-Id` header
 *      (set by load balancers, API gateways, or frontend clients).
 *      If so, reuses it — preserving the ID across service boundaries.
 *   2. Otherwise, generates a new UUID v4 using Node.js `crypto.randomUUID()`
 *      (cryptographically random, guaranteed unique).
 *   3. Attaches the ID to `req.id` so all downstream middleware and controllers
 *      can include it in their own logs.
 *   4. Adds `X-Request-Id` to the response headers so the frontend can log it
 *      and display it in error messages for support tickets.
 *
 * Usage:
 *   // In server/index.js — mount BEFORE all other middleware
 *   import requestId from './middleware/requestId.js';
 *   app.use(requestId);
 *
 *   // In any controller or middleware
 *   const { sendError } = await import('../utils/responseFormatter.js');
 *   console.error(`[req:${req.id}] Payment failed:`, err.message);
 *   sendError(res, 402, 'Payment failed');
 *
 *   // The frontend receives X-Request-Id in every API response header:
 *   const requestId = response.headers.get('X-Request-Id');
 *   toast.error(`Something went wrong (Ref: ${requestId.slice(0, 8)})`);
 *
 * @param {import('express').Request}      req
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} next
 */
const requestId = (req, res, next) => {
  // Honour X-Request-Id from upstream (load balancer, API gateway, or Vite proxy)
  const existingId = req.headers['x-request-id'];

  // Validate that an existing ID looks like a UUID (prevent header injection)
  const isValidUUID = existingId && /^[0-9a-f-]{8,64}$/i.test(existingId);

  const id = isValidUUID ? existingId : randomUUID();

  // Attach to req so all downstream code can reference it
  req.id = id;

  // Add to response headers so:
  // 1. The frontend can display "Reference: abcd1234" in error toasts
  // 2. Load balancers and logging aggregators can correlate requests
  // 3. Support engineers can grep logs with the ID from a user's error report
  res.setHeader('X-Request-Id', id);

  next();
};

export default requestId;
