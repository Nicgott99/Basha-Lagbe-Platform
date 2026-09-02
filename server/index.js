import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import requestLogger from './utils/requestLogger.js';
import sanitizeInput from './middleware/sanitizeInput.js';
import requestTimeout from './middleware/requestTimeout.js';
import cacheControl from './middleware/cacheControl.js';
import rateLimitByUser from './middleware/rateLimitByUser.js';
import corsOptions from './middleware/corsOptions.js';
import validateEnv from './utils/validateEnv.js';
import globalErrorHandler from './middleware/globalErrorHandler.js';
import requestId from './middleware/requestId.js';
import createSlowDown from './middleware/slowDown.js';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import listingRoutes from './routes/listing.route.js';
import reviewRoutes from './routes/review.route.js';
import healthRoutes from './routes/health.route.js';

dotenv.config();
// Validate all required environment variables before doing anything else.
// Crashes with a clear error if JWT_SECRET, MONGO_URL, or NODE_ENV are missing
// or misconfigured — prevents the app from running with insecure defaults.
validateEnv();

const app = express();
const __dirname = path.resolve();

// ─── Security Headers (Helmet) ─────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow image serving
  contentSecurityPolicy: false                            // keep CSP flexible for dev
}));

// ─── Rate Limiters ─────────────────────────────────────────────────────────

// Strict limiter for auth endpoints — prevents brute-force & credential stuffing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 20,                    // max 20 auth requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});

// General API limiter — keeps overall traffic manageable
const generalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,  // 10 minutes
  max: 300,                   // max 300 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many requests from this IP. Please try again later.'
  }
});

// Progressive slow-down for auth endpoints — adds delay BEFORE the hard rate limit.
// Slows bots/credential-stuffers without immediately hard-blocking legitimate users
// who retry after a failed login (common on flaky mobile connections in Bangladesh).
// First 5 requests/minute: instant. Each additional: +500ms delay, capped at 5s.
const authSlowDown = createSlowDown({
  windowMs:     60 * 1000,  // 1-minute window
  freeRequests: 5,          // 5 free requests before delay starts
  delayAfter:   500,        // +500ms per request over the free limit
  maxDelay:     5_000,      // cap at 5 seconds
});

// Apply general limiter to all /server/* routes
app.use('/server', generalLimiter);

// ─── CORS ──────────────────────────────────────────────────────────────────
// Reads ALLOWED_ORIGINS from .env (comma-separated).
// Falls back to localhost:5173 and :5174 for local development.
// Exposes X-RateLimit-* headers so the frontend can handle rate-limit responses.
app.use(cors(corsOptions));

// ─── Request ID ────────────────────────────────────────────────────────────
// Assigns a UUID to every request via req.id and X-Request-Id response header.
// Must come before requestLogger so the ID is available in log output.
// Allows the frontend to display a reference ID in error messages (support traces).
app.use(requestId);

// ─── Structured Request Logger ─────────────────────────────────────────────
// Replaces the two duplicate ad-hoc console.log middlewares.
// Logs: METHOD  /path  STATUS  XXms  IP — colour-coded in terminal.
app.use(requestLogger);

// ─── Request Timeout ───────────────────────────────────────────────────────
// Kills requests that have not completed within 30 seconds.
// Prevents hung DB queries or external calls from consuming server resources.
app.use(requestTimeout(30_000));

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
// Sanitise all incoming request bodies, queries and params
// Must run after express.json() so req.body is already parsed
app.use(sanitizeInput);
// ─── Cache-Control Headers ─────────────────────────────────────────────────
// Sets per-route HTTP caching headers: public short-lived cache for listings,
// no-store for auth/user routes to prevent sensitive data being cached.
app.use(cacheControl);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection with Stable API version
const mongoOptions = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
};

mongoose.connect(process.env.MONGO_URL, mongoOptions)
  .then(() => {
    console.log('✅ MongoDB connected successfully.');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Server running but database unavailable');
  });

// Test endpoint
app.get('/server/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

// ─── Health Check Routes ───────────────────────────────────────────────────
// GET /server/health        — fast liveness probe
// GET /server/health/detail — full readiness probe (DB + memory + system)
app.use('/server/health', healthRoutes);

// API Routes — auth gets: (1) progressive slow-down, (2) hard rate limit
// Layered defence: slow-down first catches repeated retries gracefully,
// hard limit blocks clear abuse.
app.use('/server/auth', authSlowDown, authLimiter, authRoutes);
// Authenticated routes get per-user rate limiting (60 req/min) in addition
// to the shared IP-based general limiter applied above.
// This prevents one user from exhausting limits for an entire shared network.
app.use('/server/user',    rateLimitByUser({ max: 60 }),  userRoutes);
app.use('/server/listing', rateLimitByUser({ max: 60 }),  listingRoutes);
app.use('/server/review',  rateLimitByUser({ max: 30 }),  reviewRoutes);

// Import and use additional routes
import adminRoutes from './routes/admin.route.js';
import applicationRoutes from './routes/applicationRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

app.use('/server/admin', adminRoutes);
app.use('/server/applications', applicationRoutes);
app.use('/server/inquiries', inquiryRoutes);
app.use('/server/notifications', notificationRoutes);
app.use('/server/stats', statsRoutes);
app.use('/server/favorites', favoriteRoutes);
app.use('/server/messages', messageRoutes);

// Serve static files for production
app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});


// Global Error Handler
// Classifies errors by type (Mongoose, JWT, MongoDB, custom) and returns
// appropriate HTTP status codes with clean user-facing messages.
// Stack traces and internal details are logged server-side only.
app.use(globalErrorHandler);

// Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Basha Lagbe server is running on port ${PORT}`);
});
