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
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import listingRoutes from './routes/listing.route.js';
import reviewRoutes from './routes/review.route.js';
import healthRoutes from './routes/health.route.js';

dotenv.config();

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

// Apply general limiter to all /server/* routes
app.use('/server', generalLimiter);

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// ─── Structured Request Logger ─────────────────────────────────────────────
// Replaces the two duplicate ad-hoc console.log middlewares.
// Logs: METHOD  /path  STATUS  XXms  IP — colour-coded in terminal.
app.use(requestLogger);

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
// Sanitise all incoming request bodies, queries and params
// Must run after express.json() so req.body is already parsed
app.use(sanitizeInput);
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

// API Routes — auth gets the strict limiter to block brute-force attacks
app.use('/server/auth', authLimiter, authRoutes);
app.use('/server/user', userRoutes);
app.use('/server/listing', listingRoutes);
app.use('/server/review', reviewRoutes);

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
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.error(`[ERROR] ${statusCode} - ${message}`, err.stack);
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Basha Lagbe server is running on port ${PORT}`);
});
