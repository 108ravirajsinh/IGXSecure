/*
 * IGXSecure — Backend Entry Point
 */

require('dotenv').config();

const express           = require('express');
const cors              = require('cors');
const { applySecurity } = require('./config/security');
const { initDatabase }  = require('./db/init');

const app  = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '127.0.0.1';

/* ── Middleware ── */
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* ── Security ── */
applySecurity(app);

/* ── Routes ── old code
const feedRoute = require('./routes/feed');
app.use('/igxsecure/api', feedRoute);

app.get('/', (req, res) => {
  res.json({ status: 'IGXSecure API running' });
});

// const systemRouter = require('./routes/system');
// app.use('/igxsecure/api/system', systemRouter);
*/

/* ── Routes ── */
const feedRoute     = require('./routes/feed');
const systemRouter  = require('./routes/system');
const authRouter    = require('./routes/auth');
const postsRouter   = require('./routes/posts');
const storiesRouter = require('./routes/stories');
const messagesRouter = require('./routes/messages');

app.use('/igxsecure/api',          feedRoute);
app.use('/igxsecure/api/system',   systemRouter);
app.use('/igxsecure/api/auth',     authRouter);
app.use('/igxsecure/api/posts',    postsRouter);
app.use('/igxsecure/api/stories',  storiesRouter);
app.use('/igxsecure/api/messages', messagesRouter);

/* ── 404 ── */
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

/* ── Start ── */
async function start() {
  try {
    // await initDatabase();   // ← uncomment after PostgreSQL is installed
    app.listen(PORT, HOST, () => {
      console.log(`[IGXSecure] Server running on http://${HOST}:${PORT}`);
      console.log(`[IGXSecure] Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('[IGXSecure] Failed to start:', err);
    process.exit(1);
  }
}

start();