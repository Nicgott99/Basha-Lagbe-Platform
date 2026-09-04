/**
 * notFoundHandler.js
 * Catch-all 404 middleware for unrecognized API endpoints under /server/*.
 *
 * Why this is critical:
 * In Single Page Applications (SPA) served by Express:
 *   app.get('*', (req, res) => res.sendFile(...client/dist/index.html...))
 * catches all unmatched GET requests and sends the HTML shell.
 * Without an API-specific 404 handler, any typo or obsolete API route
 * (e.g. `GET /server/listng/123` or `GET /server/users/profil`) matches the wildcard
 * and returns `index.html` with an HTTP 200 OK status instead of a JSON 404.
 * When the frontend fetch tries to parse response.json(), it crashes with:
 *   "SyntaxError: Unexpected token '<', '<!DOCTYPE...' is not valid JSON"
 * Furthermore, non-GET methods (POST, PUT, DELETE) fall through to the global handler
 * or Express's default HTML 404 response.
 *
 * This middleware intercepts any unmatched route under `/server/*` across ALL HTTP methods,
 * returning a clean, standardized JSON 404 response with the request ID and path details.
 */

const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Cannot ${req.method} ${req.originalUrl} — API route not found`,
    path: req.originalUrl,
    method: req.method,
    requestId: req.id || null,
  });
};

export default notFoundHandler;
