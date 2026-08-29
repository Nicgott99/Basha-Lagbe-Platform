/**
 * requestLogger.js
 * A lightweight, structured HTTP request/response logger middleware for Express.
 *
 * Replaces the two duplicate console.log middlewares that existed in server/index.js.
 * Logs method, URL, status code, response time, and IP address in a clean format.
 *
 * Usage:
 *   import requestLogger from './utils/requestLogger.js';
 *   app.use(requestLogger);
 */

// ANSI colour codes for terminal output (gracefully skipped in non-TTY envs)
const isTTY = process.stdout.isTTY;

const colours = {
  reset:   isTTY ? '\x1b[0m'  : '',
  bold:    isTTY ? '\x1b[1m'  : '',
  dim:     isTTY ? '\x1b[2m'  : '',
  green:   isTTY ? '\x1b[32m' : '',
  yellow:  isTTY ? '\x1b[33m' : '',
  blue:    isTTY ? '\x1b[34m' : '',
  magenta: isTTY ? '\x1b[35m' : '',
  cyan:    isTTY ? '\x1b[36m' : '',
  red:     isTTY ? '\x1b[31m' : '',
  white:   isTTY ? '\x1b[37m' : '',
};

/** Pick a colour for the HTTP method */
const methodColour = (method) => {
  switch (method) {
    case 'GET':    return colours.green;
    case 'POST':   return colours.blue;
    case 'PUT':    return colours.yellow;
    case 'PATCH':  return colours.magenta;
    case 'DELETE': return colours.red;
    default:       return colours.white;
  }
};

/** Pick a colour for the HTTP status code */
const statusColour = (status) => {
  if (status >= 500) return colours.red;
  if (status >= 400) return colours.yellow;
  if (status >= 300) return colours.cyan;
  return colours.green;
};

/**
 * requestLogger middleware
 * Logs one line per request once the response finishes, including:
 *   METHOD  /path  STATUS  XXms  ip
 *
 * Silent in test environments (NODE_ENV === 'test').
 */
const requestLogger = (req, res, next) => {
  if (process.env.NODE_ENV === 'test') return next();

  const startAt = process.hrtime();

  res.on('finish', () => {
    const [sec, ns] = process.hrtime(startAt);
    const ms = (sec * 1e3 + ns / 1e6).toFixed(1);

    const method  = req.method;
    const url     = req.originalUrl || req.url;
    const status  = res.statusCode;
    const ip      = req.ip || req.socket?.remoteAddress || '-';
    // req.id is set by the requestId middleware (mounted before this)
    const id      = req.id ? `${colours.dim}[req:${req.id.slice(0, 8)}]${colours.reset} ` : '';

    console.log(
      `${id}` +
      `${colours.dim}[${new Date().toISOString()}]${colours.reset} ` +
      `${methodColour(method)}${colours.bold}${method.padEnd(7)}${colours.reset} ` +
      `${colours.white}${url}${colours.reset} ` +
      `${statusColour(status)}${colours.bold}${status}${colours.reset} ` +
      `${colours.dim}${ms}ms  ${ip}${colours.reset}`
    );
  });

  next();
};


export default requestLogger;
