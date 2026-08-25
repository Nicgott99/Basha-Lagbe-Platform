import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

/**
 * JWT Secret resolved from environment.
 * validateEnv() (called at startup in server/index.js) guarantees this is set
 * and at least 32 characters long before any request is ever processed.
 * There is intentionally NO fallback — a missing secret must be a hard failure.
 */
const JWT_SECRET = process.env.JWT_SECRET;


/**
 * Middleware to verify JWT token from cookies or Authorization header
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const verifyToken = (req, res, next) => {
  // Check for token in cookies or Authorization header
  const token = req.cookies.access_token || 
                (req.headers.authorization && req.headers.authorization.startsWith('Bearer') ? 
                 req.headers.authorization.split(' ')[1] : null);
                 
  if (!token) {
    return next(errorHandler(401, "Unauthorized: No token provided"));
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(403, "Forbidden: Invalid or expired token"));
    }
    req.user = user;
    next();
  });
};

/**
 * Middleware to verify user has admin role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, (err) => {
        // If verifyToken encountered an error, it would have called next(err) already
        if (err) return;
        
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            return next(errorHandler(403, 'Forbidden: Requires Admin Role'));
        }
    });
};