import { errorHandler } from "./error.js";
import { verifyJwt } from "./jwtUtils.js";

/**
 * Middleware to verify JWT token from cookies or Authorization header
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const verifyToken = async (req, res, next) => {
  // Check for token in cookies or Authorization header
  const token = req.cookies?.access_token || 
                (req.headers?.authorization && req.headers.authorization.startsWith('Bearer') ? 
                 req.headers.authorization.split(' ')[1] : null);
                 
  if (!token) {
    return next(errorHandler(401, "Unauthorized: No token provided"));
  }

  try {
    const user = await verifyJwt(token);
    req.user = user;
    next();
  } catch (err) {
    return next(errorHandler(403, "Forbidden: Invalid or expired token"));
  }
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