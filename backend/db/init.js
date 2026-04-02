/*
 * IGXSecure — Database Initializer
 * Phase 4: creates tables if they don't exist on server startup
 * Phase 5 will add rows to users/sessions via OAuth flow
 */

const pool = require('../config/db');

const CREATE_USERS = `
  CREATE TABLE IF NOT EXISTS users (
    id                    SERIAL PRIMARY KEY,
    instagram_user_id     VARCHAR(64)  UNIQUE NOT NULL,
    username              VARCHAR(128) NOT NULL,
    access_token_encrypted TEXT        NOT NULL,
    token_expires_at      TIMESTAMPTZ,
    created_at            TIMESTAMPTZ  DEFAULT NOW(),
    updated_at            TIMESTAMPTZ  DEFAULT NOW()
  );
`;

const CREATE_SESSIONS = `
  CREATE TABLE IF NOT EXISTS sessions (
    id            SERIAL PRIMARY KEY,
    user_id       INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(256) UNIQUE NOT NULL,
    expires_at    TIMESTAMPTZ NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT NOW()
  );
`;

const CREATE_UPDATED_AT_FUNCTION = `
  CREATE OR REPLACE FUNCTION set_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
`;

const CREATE_UPDATED_AT_TRIGGER = `
  DO $$ BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger WHERE tgname = 'users_set_updated_at'
    ) THEN
      CREATE TRIGGER users_set_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    END IF;
  END $$;
`;

async function initDatabase() {
  const client = await pool.connect();
  try {
    console.log('[DB] Running table initialization...');
    await client.query(CREATE_USERS);
    console.log('[DB] Table ready: users');
    await client.query(CREATE_SESSIONS);
    console.log('[DB] Table ready: sessions');
    await client.query(CREATE_UPDATED_AT_FUNCTION);
    await client.query(CREATE_UPDATED_AT_TRIGGER);
    console.log('[DB] Trigger ready: users_set_updated_at');
    console.log('[DB] Initialization complete');
  } catch (err) {
    console.error('[DB] Initialization failed:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { initDatabase };