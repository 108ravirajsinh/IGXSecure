/*
 * IGXSecure — Backend Entry Point
 */

require('dotenv').config();

const express           = require('express');
const session           = require('express-session');
const path              = require('path');
const https             = require('https');
const { applySecurity } = require('./config/security');
const { requireAuth }   = require('./middleware/auth.middleware');
// const { initDatabase } = require('./db/init');

const app  = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '127.0.0.1';

/* ── Middleware ── */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* ── Security ── */
applySecurity(app);

//* ── Session ── */
const SQLiteStore = require('connect-sqlite3')(session);

// SESSION_SECRET must be set separately from TOKEN_SECRET
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  throw new Error('SESSION_SECRET must be set');
}

app.use(session({
  store: new SQLiteStore({ db: 'sessions.db', dir: './db' }),
  secret:            SESSION_SECRET,
  resave:            false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    maxAge:   30 * 24 * 60 * 60 * 1000
  }
}));

/* ── Serve React build ── */
app.use(express.static(path.join(__dirname, '../frontend/build')));

/* ── API Routes ── */
const feedRoute      = require('./routes/feed');
const systemRouter   = require('./routes/system');
const authRouter     = require('./routes/auth');
const postsRouter    = require('./routes/posts');
const storiesRouter  = require('./routes/stories');
const messagesRouter = require('./routes/messages');
const notificationsRouter = require('./routes/notifications');

// Public or low-risk routes
app.use('/igxsecure/api/system', systemRouter);
app.use('/igxsecure/api/auth',   authRouter);

// Protected routes — require authenticated session
app.use('/igxsecure/api',                requireAuth, feedRoute);
app.use('/igxsecure/api/posts',          requireAuth, postsRouter);
app.use('/igxsecure/api/stories',        requireAuth, storiesRouter);
app.use('/igxsecure/api/messages',       requireAuth, messagesRouter);
app.use('/igxsecure/api/notifications',  requireAuth, notificationsRouter);

/* ── Media Proxy (images + video streaming) ── 
const allowedMediaHosts = [
  'scontent.cdninstagram.com',
  'scontent.xx.fbcdn.net',
  'instagram.fdel1-1.fna.fbcdn.net', // adjust to your region as needed
];*/

const extraAllowedHosts = (process.env.ALLOWED_MEDIA_HOSTS || '')
  .split(',')
  .map(h => h.trim())
  .filter(Boolean);

function isAllowedMediaHost(hostname) {
  if (hostname.endsWith('.cdninstagram.com')) return true;
  if (hostname.endsWith('.fbcdn.net'))        return true;
  if (extraAllowedHosts.includes(hostname))   return true;
  return false;
}

app.get('/igxsecure/api/proxy/image', requireAuth, (req, res) => {
  const { url } = req.query;
  if (!url || !url.startsWith('https://')) {
    return res.status(400).json({ error: 'Invalid media URL' });
  }

  let target;
  try {
    target = new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid media URL' });
  }

  if (!isAllowedMediaHost(target.hostname)) {
    console.warn(`[PROXY] Blocked host: ${target.hostname}`);
    return res.status(400).json({ error: 'Host not allowed' });
  }

  const options = { headers: {} };
  if (req.headers.range) {
    options.headers['Range'] = req.headers.range;
  }

  https.get(target.toString(), options, (stream) => {
    const status = stream.statusCode || 200;
    res.setHeader('Content-Type',   stream.headers['content-type']   || 'application/octet-stream');
    res.setHeader('Accept-Ranges',  'bytes');
    res.setHeader('Cache-Control',  'public, max-age=86400');
    if (stream.headers['content-length'])
      res.setHeader('Content-Length', stream.headers['content-length']);
    if (stream.headers['content-range'])
      res.setHeader('Content-Range',  stream.headers['content-range']);
    res.status(status);
    stream.pipe(res);
  }).on('error', () => res.status(502).send('Media fetch failed'));
});

/* ── React catch-all ── */
app.get('/{*path}', (req, res, next) => {
  if (req.path.startsWith('/igxsecure/api')) return next();
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
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
    // await initDatabase();
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