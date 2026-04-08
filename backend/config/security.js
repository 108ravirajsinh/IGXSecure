/*
 * IGXSecure — Security Middleware Configuration
 * Helmet, CORS, Rate Limiting — all in one place
 */

const helmet    = require('helmet');
const cors      = require('cors');
const rateLimit = require('express-rate-limit');

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

/* ── CORS ── */
const corsOptions = {
  origin: ALLOWED_ORIGIN,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

/* ── Rate limiting ── */

// 1. Auth callback — strict (5 per 15 min, prevent OAuth abuse)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

// 2. API routes — relaxed for normal usage (300 per 15 min)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

function applySecurity(app) {
  app.use(helmet());
  app.use(cors(corsOptions));

  // Auth callback gets strict limiter
  app.use('/igxsecure/api/auth/callback', authLimiter);

  // All other API routes get relaxed limiter
  app.use('/igxsecure/api', apiLimiter);

  // NO global limiter — static files (/, /favicon.ico) are unlimited
}

module.exports = { applySecurity };