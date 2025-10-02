import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

/**
 * JWT Secret from environment variable with fallback
 * This ensures the token verification works even if process.env.JWT_SECRET is not set
 */
const JWT_SECRET = process.env.JWT_SECRET || 'BashaLagbe2025SuperSecretKeyAdvancedSecurityProductionReady147258369';

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
                 
  console.log(`🔍 DEBUG: Token verification - Token exists: ${!!token}, JWT_SECRET exists: ${!!JWT_SECRET}`);
  
  if (!token) {
    console.log('🔍 DEBUG: No token provided');
    return next(errorHandler(401, "Unauthorized: No token provided"));
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('🔍 DEBUG: Token verification failed:', err.message);
      return next(errorHandler(403, "Forbidden: Invalid or expired token"));
    }
    console.log('🔍 DEBUG: Token verification successful, user:', { id: user.id, email: user.email, role: user.role });
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