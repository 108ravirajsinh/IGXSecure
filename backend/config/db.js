/*
 * IGXSecure — PostgreSQL Connection Pool
 * Phase 4: single pool instance shared across all routes
 */

const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME     || 'igxsecure',
  user:     process.env.DB_USER     || 'igxuser',
  password: process.env.DB_PASSWORD,
  max:                  10,   // max connections in pool
  idleTimeoutMillis:    30000,
  connectionTimeoutMillis: 3000,
});

/* Log connection errors without crashing the server */
pool.on('error', (err) => {
  console.error('[DB] Unexpected pool error:', err.message);
});

module.exports = pool;