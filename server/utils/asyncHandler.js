/**
 * asyncHandler.js
 * A higher-order function that wraps an async Express route handler and
 * automatically forwards any thrown errors to Express's next() function.
 *
 * Problem it solves:
 *   Every controller in this codebase wraps its body in try/catch + next(error).
 *   That boilerplate appears ~50+ times across auth, user, listing, review,
 *   admin, application, inquiry, notification, and stats controllers.
 *   asyncHandler eliminates ALL of it.
 *
 * Before (typical controller):
 *   export const getUser = async (req, res, next) => {
 *     try {
 *       const user = await User.findById(req.params.id);
 *       res.status(200).json(user);
 *     } catch (error) {
 *       next(error);   // ← required on every throw path
 *     }
 *   };
 *
 * After:
 *   export const getUser = asyncHandler(async (req, res, next) => {
 *     const user = await User.findById(req.params.id);
 *     res.status(200).json(user);   // throw freely — asyncHandler catches it
 *   });
 *
 * Usage:
 *   import asyncHandler from '../utils/asyncHandler.js';
 *
 *   export const myController = asyncHandler(async (req, res, next) => {
 *     // ... your logic, no try/catch needed
 *   });
 *
 * The returned wrapper is a standard Express middleware function so it works
 * with app.use(), router.get(), router.post(), etc. without any changes.
 */

/**
 * asyncHandler
 * @param {(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => Promise<void>} fn
 *   The async controller / middleware to wrap.
 * @returns {import('express').RequestHandler}
 *   A standard Express middleware that calls fn and catches any rejection.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
