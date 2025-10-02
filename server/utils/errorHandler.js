// Unified error helper
// Creates an Error object with an attached HTTP status code
export function errorHandler(statusCode = 500, message = 'Internal Server Error') {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

export default errorHandler;
