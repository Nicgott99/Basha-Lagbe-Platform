/**
 * Creates an error object with a status code
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @returns {Error} Error object with statusCode property
 */
export function errorHandler(statusCode = 500, message = 'Internal Server Error') {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

// Default export for compatibility
export default errorHandler;


