/**
 * jwtUtils.js
 * Centralized JWT helper utilities for the Basha Lagbe server.
 *
 * Problem it solves:
 *   `jwt.sign()` is called in 6+ places across auth.controller.js, each time
 *   with an UNSAFE hardcoded fallback secret:
 *
 *     jwt.sign(payload, process.env.JWT_SECRET || 'BashaLagbe2025SuperSecret...', ...)
 *
 *   This creates two critical problems:
 *   1. Security: If JWT_SECRET is undefined (misconfigured deployment), the app
 *      silently falls back to the known, public hardcoded string — any attacker
 *      who reads the source code can forge tokens for any user, including admins.
 *   2. Consistency: token expiry, cookie config, and signing options are
 *      copy-pasted in every call — changing them requires hunting down all 6+
 *      locations (and missing one is a real risk).
 *
 *   This file provides:
 *   - `signToken(payload, options)`  — sign a JWT with no fallback secret
 *   - `verifyJwt(token)`             — verify and decode a token (promise-based)
 *   - `decodeJwt(token)`             — decode without verification (for logging)
 *   - `setTokenCookie(res, token)`   — set the access_token cookie consistently
 *   - `clearTokenCookie(res)`        — clear the cookie on sign-out
 *   - `TOKEN_TTL`                    — shared expiry constant ('7d')
 *
 * validateEnv() in server/index.js guarantees JWT_SECRET is set and meets the
 * minimum entropy requirement before any of these functions are ever called.
 * There is intentionally NO fallback — a missing secret is a hard failure.
 *
 * Usage:
 *   import { signToken, verifyJwt, setTokenCookie, TOKEN_TTL } from '../utils/jwtUtils.js';
 *
 *   // Sign a token
 *   const token = signToken({ id: user._id, email: user.email, role: user.role });
 *
 *   // Set it as a cookie
 *   setTokenCookie(res, token);
 *
 *   // Verify (async, throws on invalid/expired)
 *   const decoded = await verifyJwt(token);
 *
 *   // Decode without verification (safe for logging — never trust the payload)
 *   const info = decodeJwt(token); // null if malformed
 */

import jwt from 'jsonwebtoken';

// ── Constants ────────────────────────────────────────────────────────────────

/**
 * Default token lifetime. Used as the `expiresIn` value for `jwt.sign`.
 * Also used to set the cookie `maxAge` so they stay in sync automatically.
 * Change here to update both.
 */
export const TOKEN_TTL     = '7d';
export const TOKEN_TTL_MS  = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// ── Core JWT operations ──────────────────────────────────────────────────────

/**
 * Sign a JWT access token.
 *
 * Unlike direct jwt.sign() calls in controllers, this function:
 * - Never has a secret fallback (missing JWT_SECRET is an immediate throw)
 * - Enforces a consistent default expiry (TOKEN_TTL = '7d')
 * - Accepts an options override for special cases (e.g. short-lived tokens)
 *
 * @param {Object}  payload            - Claims to embed in the token
 * @param {string}  payload.id         - User's MongoDB ObjectId (required)
 * @param {string}  [payload.email]    - User's email (for display/logging)
 * @param {string}  [payload.role]     - User's role ('user' | 'admin')
 * @param {Object}  [options]          - jwt.sign options override
 * @param {string}  [options.expiresIn=TOKEN_TTL]
 * @returns {string} Signed JWT string
 * @throws {Error}  If JWT_SECRET is not set (should never happen after validateEnv)
 *
 * @example
 *   const token = signToken({ id: user._id, email: user.email, role: user.role });
 *   // → "eyJhbGc..."
 *
 * @example
 *   // Short-lived token for password reset (15 minutes)
 *   const resetToken = signToken({ id: user._id, purpose: 'reset' }, { expiresIn: '15m' });
 */
export const signToken = (payload, options = {}) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('[jwtUtils] JWT_SECRET is not set. Cannot sign tokens.');
  }
  return jwt.sign(payload, secret, { expiresIn: TOKEN_TTL, ...options });
};

/**
 * Verify a JWT token and return the decoded payload.
 * Returns a Promise so it can be used with async/await without the callback API.
 *
 * @param {string} token - The JWT string to verify
 * @returns {Promise<Object>} Decoded payload
 * @throws On invalid signature, expired token, or malformed input
 *
 * @example
 *   try {
 *     const user = await verifyJwt(token);
 *     req.user = user;
 *   } catch (err) {
 *     return next(errorHandler(403, 'Invalid or expired token'));
 *   }
 */
export const verifyJwt = (token) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return Promise.reject(new Error('[jwtUtils] JWT_SECRET is not set.'));
  }
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
};

/**
 * Decode a JWT without verifying the signature.
 * Safe ONLY for debugging and logging — the payload must NEVER be trusted
 * for authorization decisions without verification via verifyJwt().
 *
 * @param {string} token
 * @returns {Object|null} Decoded payload, or null if the token is malformed
 *
 * @example
 *   const info = decodeJwt(token);
 *   console.log('[requestLogger] user.id:', info?.id);
 */
export const decodeJwt = (token) => {
  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
};

// ── Cookie helpers ───────────────────────────────────────────────────────────

/**
 * Set the `access_token` cookie on the Express response with consistent
 * httpOnly, secure, sameSite, and maxAge settings.
 *
 * Centralizing cookie config here means changing it once updates all auth
 * endpoints (signup, signin, OAuth, 2FA complete, etc.) simultaneously.
 *
 * @param {import('express').Response} res
 * @param {string} token - Signed JWT to set in the cookie
 *
 * @example
 *   // In any auth controller:
 *   const token = signToken({ id: user._id, role: user.role });
 *   setTokenCookie(res, token);
 *   res.status(200).json({ success: true, user });
 */
export const setTokenCookie = (res, token) => {
  res.cookie('access_token', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   TOKEN_TTL_MS,
  });
};

/**
 * Clear the `access_token` cookie on sign-out.
 * Mirrors the cookie options used in setTokenCookie for consistency.
 *
 * @param {import('express').Response} res
 */
export const clearTokenCookie = (res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

export default { signToken, verifyJwt, decodeJwt, setTokenCookie, clearTokenCookie, TOKEN_TTL, TOKEN_TTL_MS };
