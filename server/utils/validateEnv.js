/**
 * validateEnv
 * Validates that all required environment variables are present and
 * meet minimum security requirements at server startup.
 *
 * WHY THIS EXISTS:
 *   Node.js apps commonly use fallback values for missing env vars:
 *     const JWT_SECRET = process.env.JWT_SECRET || 'some-hardcoded-secret';
 *
 *   This is dangerous — if the env var is missing in production, the app
 *   silently continues with the hardcoded value. Anyone who reads the source
 *   code on GitHub can forge JWTs, bypass authentication, and take over any
 *   account. The app should REFUSE TO START if secrets are missing.
 *
 * FAIL-FAST PRINCIPLE:
 *   It is far better to crash immediately on startup with a clear error than
 *   to run silently with insecure defaults. A crash is visible and will be
 *   caught in deployment; a silent security hole may never be noticed.
 *
 * USAGE:
 *   Call validateEnv() ONCE at the very top of server/index.js,
 *   immediately after dotenv.config() and before any other setup:
 *
 *   dotenv.config();
 *   validateEnv();        // ← crashes here with a clear message if misconfigured
 *   const app = express();
 *
 * @module validateEnv
 */

/**
 * Environment variable specification.
 * Each entry defines one required variable and optional validation rules.
 *
 * @typedef {Object} EnvSpec
 * @property {string}   name          - The environment variable name
 * @property {string}   description   - Human-readable description (shown in error)
 * @property {number}   [minLength]   - Minimum string length
 * @property {string[]} [allowedVals] - If set, value must be one of these
 * @property {boolean}  [warnOnly]    - If true, log a warning instead of crashing
 */

/** @type {EnvSpec[]} */
const REQUIRED_ENV = [
  {
    name:        'JWT_SECRET',
    description: 'JSON Web Token signing secret',
    minLength:   32,  // NIST recommends ≥256 bits = 32 bytes for HMAC-SHA256
  },
  {
    name:        'MONGO_URL',
    description: 'MongoDB connection string',
    minLength:   10,
  },
  {
    name:        'NODE_ENV',
    description: 'Runtime environment',
    allowedVals: ['development', 'production', 'test'],
  },
  {
    name:        'EMAIL_USER',
    description: 'SMTP email address for sending OTP and notification emails',
    warnOnly:    true,  // Warn in dev (emails may be disabled), fail in production
  },
  {
    name:        'EMAIL_PASS',
    description: 'SMTP email password / app password',
    warnOnly:    true,
  },
];

/**
 * Validate all required environment variables.
 * Throws a descriptive Error and exits the process if any required
 * variable is missing or fails its validation rules.
 *
 * @throws {Error} If any required variable is invalid and warnOnly is false.
 */
const validateEnv = () => {
  const errors   = [];
  const warnings = [];

  for (const spec of REQUIRED_ENV) {
    const value = process.env[spec.name];

    // ── Missing check ────────────────────────────────────────────────────────
    if (!value || value.trim() === '') {
      const msg = `❌  Missing env var: ${spec.name} — ${spec.description}`;
      if (spec.warnOnly) {
        warnings.push(`⚠️   Missing env var: ${spec.name} — ${spec.description} (non-fatal in development)`);
      } else {
        errors.push(msg);
      }
      continue;
    }

    // ── Minimum length check ─────────────────────────────────────────────────
    if (spec.minLength && value.length < spec.minLength) {
      const msg = (
        `❌  ${spec.name} is too short (${value.length} chars). ` +
        `Minimum required: ${spec.minLength} chars. ` +
        `A short ${spec.name} is a security vulnerability.`
      );
      if (spec.warnOnly) {
        warnings.push(msg.replace('❌', '⚠️ '));
      } else {
        errors.push(msg);
      }
    }

    // ── Allowed values check ─────────────────────────────────────────────────
    if (spec.allowedVals && !spec.allowedVals.includes(value)) {
      const msg = (
        `❌  ${spec.name}="${value}" is not a valid value. ` +
        `Allowed: ${spec.allowedVals.join(' | ')}`
      );
      if (spec.warnOnly) {
        warnings.push(msg.replace('❌', '⚠️ '));
      } else {
        errors.push(msg);
      }
    }
  }

  // ── Production-only checks ───────────────────────────────────────────────
  // In production, email vars must be fully configured (no warnings)
  if (process.env.NODE_ENV === 'production') {
    const prodRequired = ['EMAIL_USER', 'EMAIL_PASS'];
    for (const name of prodRequired) {
      if (!process.env[name] || process.env[name].trim() === '') {
        errors.push(
          `❌  Missing env var: ${name} — Required in production. ` +
          `OTP emails will not send without this.`
        );
      }
    }
    // Warn about ALLOWED_ORIGINS in production too
    if (!process.env.ALLOWED_ORIGINS) {
      warnings.push(
        `⚠️   ALLOWED_ORIGINS is not set. ` +
        `CORS will fall back to localhost origins, blocking all production frontend traffic.`
      );
    }
  }

  // ── Print warnings ───────────────────────────────────────────────────────
  if (warnings.length > 0) {
    console.warn('\n╔══════════════════════════════════════════════════════╗');
    console.warn('║          ENVIRONMENT CONFIGURATION WARNINGS          ║');
    console.warn('╚══════════════════════════════════════════════════════╝');
    warnings.forEach((w) => console.warn(w));
    console.warn('');
  }

  // ── Crash on errors ──────────────────────────────────────────────────────
  if (errors.length > 0) {
    console.error('\n╔══════════════════════════════════════════════════════╗');
    console.error('║          ENVIRONMENT CONFIGURATION ERRORS            ║');
    console.error('║      Server startup aborted. Fix the issues below.   ║');
    console.error('╚══════════════════════════════════════════════════════╝');
    errors.forEach((e) => console.error(e));
    console.error(
      '\nHint: Copy .env.example to .env and fill in the required values.\n' +
      'Never commit real secrets to git.\n'
    );
    process.exit(1);  // Non-zero exit → deployment systems detect the failure
  }

  console.log(`✅  Environment validated (${REQUIRED_ENV.length} variables checked)`);
};

export default validateEnv;
