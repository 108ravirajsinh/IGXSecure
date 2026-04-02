/*
 * IGXSecure — Backend Entry Point
 * Phase 2: Express server with security middleware and health endpoint
 */

require('dotenv').config();

const express  = require('express');
const { applySecurity } = require('./config/security');

const systemRouter = require('./routes/system');

const app  = express();
const PORT = process.env.PORT || 9000;
const HOST = process.env.HOST || '127.0.0.1';

/* ── Middleware ── */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* ── Security (helmet, cors, rate limit) ── */
applySecurity(app);

/* ── Routes ── */
app.use('/igxsecure/api/system', systemRouter);

/* ── 404 handler ── */
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/* ── Global error handler ── */
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

/* ── Start server ── */
app.listen(PORT, HOST, () => {
  console.log(`[IGXSecure] Server running on http://${HOST}:${PORT}`);
  console.log(`[IGXSecure] Environment: ${process.env.NODE_ENV || 'development'}`);
});