/*
 * IGXSecure — System Routes
 * GET /igxsecure/api/system/health
 */

const express = require('express');
const os      = require('os');
const router  = express.Router();

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

module.exports = router;