import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import listingRoutes from './routes/listing.route.js';
import reviewRoutes from './routes/review.route.js';

dotenv.config();

const app = express();
const __dirname = path.resolve();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`🔄 ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
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

// Health check endpoint
app.get('/server/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/server/auth', authRoutes);
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

// Request logging middleware
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
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
