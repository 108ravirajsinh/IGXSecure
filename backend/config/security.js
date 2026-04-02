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

/* ── Rate limiting: 100 requests per 15 minutes per IP ── */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

/* ── Apply all security middleware to the Express app ── */
function applySecurity(app) {
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(limiter);
}

module.exports = { applySecurity };