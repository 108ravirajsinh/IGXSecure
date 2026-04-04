/*
 * IGXSecure — OAuth Routes
 * Handles Meta Instagram OAuth2 flow
 */

const express = require('express');
const axios   = require('axios');
const router  = express.Router();
const { encryptToken, decryptToken } = require('../utils/token');

const APP_ID       = process.env.META_APP_ID;
const APP_SECRET   = process.env.META_APP_SECRET;
const REDIRECT_URI = process.env.META_REDIRECT_URI
  || 'http://localhost:5000/igxsecure/api/auth/callback';

// ── GET /igxsecure/api/auth/login ──────────────────────────────
// Redirects user to Meta Instagram OAuth consent screen
router.get('/login', (req, res) => {
  const authUrl = new URL('https://www.instagram.com/oauth/authorize');
  authUrl.searchParams.set('client_id',     APP_ID);
  authUrl.searchParams.set('redirect_uri',  REDIRECT_URI);
  authUrl.searchParams.set('scope',         'instagram_business_basic');
  authUrl.searchParams.set('response_type', 'code');

  console.log('[AUTH] Redirecting to Meta OAuth');
  res.redirect(authUrl.toString());
});

// ── GET /igxsecure/api/auth/callback ──────────────────────────
// Meta redirects here after user approves — exchanges code for token
router.get('/callback', async (req, res) => {
  const { code, error } = req.query;

  // User denied access
  if (error) {
    console.warn('[AUTH] User denied OAuth access:', error);
    return res.redirect('/?error=access_denied');
  }

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  try {
    // Step 1 — Exchange code for short-lived token
    const tokenRes = await axios.post(
      'https://api.instagram.com/oauth/access_token',
      new URLSearchParams({
        client_id:     APP_ID,
        client_secret: APP_SECRET,
        grant_type:    'authorization_code',
        redirect_uri:  REDIRECT_URI,
        code,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const shortToken = tokenRes.data.access_token;
    const userId     = tokenRes.data.user_id;

    // Step 2 — Exchange for long-lived token (60 days)
    const longRes = await axios.get('https://graph.instagram.com/access_token', {
      params: {
        grant_type:    'ig_exchange_token',
        client_secret: APP_SECRET,
        access_token:  shortToken,
      },
    });

    const longToken  = longRes.data.access_token;
    const expiresIn  = longRes.data.expires_in; // seconds

    // Step 3 — Encrypt and store in session
    req.session.encryptedToken = encryptToken(longToken);
    req.session.userId         = userId;
    req.session.tokenExpiresAt = Date.now() + (expiresIn * 1000);

    console.log(`[AUTH] Login successful — user: ${userId}`);

    // Step 4 — Redirect to dashboard
    res.redirect('/');

  } catch (err) {
    const apiError = err.response?.data || err.message;
    console.error('[AUTH] Token exchange failed:', apiError);
    res.status(500).json({
      error: 'Authentication failed',
      details: process.env.NODE_ENV === 'development' ? apiError : undefined
    });
  }
});

// ── GET /igxsecure/api/auth/status ────────────────────────────
// Returns whether user is currently authenticated
router.get('/status', (req, res) => {
  if (!req.session?.encryptedToken) {
    return res.json({ authenticated: false });
  }

  const expiresAt = req.session.tokenExpiresAt;
  const isExpired = expiresAt && Date.now() > expiresAt;

  if (isExpired) {
    req.session.destroy();
    return res.json({ authenticated: false, reason: 'token_expired' });
  }

  res.json({
    authenticated: true,
    userId:        req.session.userId,
    expiresAt:     new Date(expiresAt).toISOString(),
  });
});

// ── POST /igxsecure/api/auth/logout ───────────────────────────
// Destroys session and clears token
router.post('/logout', (req, res) => {
  const userId = req.session?.userId;
  req.session.destroy((err) => {
    if (err) {
      console.error('[AUTH] Session destroy error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    console.log(`[AUTH] Logout successful — user: ${userId}`);
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

module.exports = router;