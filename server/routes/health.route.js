import express from 'express';
import mongoose from 'mongoose';
import os from 'os';

/**
 * Health Check Router
 * Provides two endpoints:
 *
 *   GET /server/health        — lightweight liveness probe (fast, no DB call)
 *   GET /server/health/detail — full readiness probe with DB + system metrics
 *
 * Standard HTTP status codes:
 *   200 — healthy / degraded but running
 *   503 — unhealthy (DB disconnected or critical failure)
 */

const router = express.Router();

/** Format bytes into a human-readable string */
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

/** Format seconds into h m s */
const formatUptime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
};

// ── Liveness probe — fast, no external calls ────────────────────────────────
router.get('/', (req, res) => {
  res.status(200).json({
    status:    'ok',
    service:   'Basha Lagbe API',
    timestamp: new Date().toISOString(),
    uptime:    formatUptime(process.uptime()),
  });
});

// ── Readiness probe — checks DB + system metrics ────────────────────────────
router.get('/detail', async (req, res) => {
  const startAt = Date.now();

  // MongoDB connection states: 0=disconnected 1=connected 2=connecting 3=disconnecting
  const dbState    = mongoose.connection.readyState;
  const dbStateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  const dbStatus   = dbStateMap[dbState] ?? 'unknown';
  const dbHealthy  = dbState === 1;

  // Memory metrics
  const memUsage   = process.memoryUsage();
  const totalMem   = os.totalmem();
  const freeMem    = os.freemem();

  // Overall health
  const isHealthy  = dbHealthy;
  const httpStatus = isHealthy ? 200 : 503;

  const responseTime = Date.now() - startAt;

  res.status(httpStatus).json({
    status:      isHealthy ? 'healthy' : 'unhealthy',
    service:     'Basha Lagbe API',
    version:     process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp:   new Date().toISOString(),
    uptime:      formatUptime(process.uptime()),
    responseTimeMs: responseTime,

    checks: {
      database: {
        status:  dbStatus,
        healthy: dbHealthy,
        host:    mongoose.connection.host || 'not connected',
        name:    mongoose.connection.name || 'N/A',
      },
    },

    system: {
      platform:      process.platform,
      nodeVersion:   process.version,
      cpus:          os.cpus().length,
      memory: {
        process: {
          rss:          formatBytes(memUsage.rss),
          heapUsed:     formatBytes(memUsage.heapUsed),
          heapTotal:    formatBytes(memUsage.heapTotal),
          external:     formatBytes(memUsage.external),
        },
        os: {
          total: formatBytes(totalMem),
          free:  formatBytes(freeMem),
          used:  formatBytes(totalMem - freeMem),
          usagePercent: `${(((totalMem - freeMem) / totalMem) * 100).toFixed(1)}%`,
        },
      },
    },
  });
});

export default router;
