/**
 * requestTimeout.js
 * Express middleware that kills any request that has not received a response
 * within a configurable time limit.
 *
 * Problem it solves:
 *   Without a request timeout, a slow MongoDB query, a hung external API call,
 *   or a deadlock can cause a request to wait indefinitely. This ties up Node.js
 *   event-loop resources, exhausts the connection pool, and makes the server
 *   appear unresponsive.
 *
 * What it does:
 *   - Starts a timer when the request arrives
 *   - If the response is still not finished after `timeoutMs`, it:
 *     1. Aborts the request by calling next() with a 503 error
 *     2. Destroys the underlying socket to immediately free resources
 *   - Clears the timer as soon as the response finishes (success or error)
 *   - Attaches `req.timedOut = false` so controllers can check it
 *
 * Usage:
 *   import requestTimeout from './middleware/requestTimeout.js';
 *
 *   // Apply globally after body parsing:
 *   app.use(requestTimeout());            // default: 30s
 *   app.use(requestTimeout(10_000));      // custom: 10s
 *
 *   // Or per-route for slow endpoints:
 *   router.get('/export', requestTimeout(120_000), exportController);
 *
 * @param {number} [timeoutMs=30000] - Max allowed request duration in milliseconds
 * @returns {import('express').RequestHandler}
 */
const requestTimeout = (timeoutMs = 30_000) => (req, res, next) => {
  req.timedOut = false;

  const timer = setTimeout(() => {
    // Guard: do nothing if the response already went out
    if (res.headersSent) return;

    req.timedOut = true;

    // Destroy the socket immediately to free the connection
    if (req.socket && !req.socket.destroyed) {
      req.socket.destroy();
    }

    // Pass a 503 to the global error handler
    const err = new Error(`Request timed out after ${timeoutMs}ms`);
    err.statusCode = 503;
    err.code       = 'REQUEST_TIMEOUT';
    next(err);
  }, timeoutMs);

  // Ensure the timer is cleared the moment the response is fully sent
  res.on('finish', () => clearTimeout(timer));
  res.on('close',  () => clearTimeout(timer));

  next();
};

export default requestTimeout;
