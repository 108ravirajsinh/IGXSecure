/*
 * IGXSecure — System Routes
 * GET /igxsecure/api/system/health
 * GET /igxsecure/api/system/db-health
 */

const express = require('express');
const os      = require('os');
const pool    = require('../config/db');
const router  = express.Router();

/* ── Server health ── */
router.get('/health', (req, res) => {
  res.json({
    status:   'ok',
    uptime:   Math.floor(process.uptime()),
    hostname: os.hostname(),
    version:  process.env.npm_package_version || '0.2.0',
    env:      process.env.NODE_ENV || 'development',
    time:     new Date().toISOString(),
  });
});

/* ── Database health ── */
router.get('/db-health', async (req, res) => {
  const start = Date.now();
  try {
    const result = await pool.query(
      'SELECT NOW() AS db_time, current_database() AS db_name'
    );
    res.json({
      status:       'ok',
      db_time:      result.rows[0].db_time,
      db_name:      result.rows[0].db_name,
      response_ms:  Date.now() - start,
      pool_total:   pool.totalCount,
      pool_idle:    pool.idleCount,
      pool_waiting: pool.waitingCount,
    });
  } catch (err) {
    res.status(503).json({
      status:  'error',
      message: err.message,
    });
  }
});

module.exports = router;