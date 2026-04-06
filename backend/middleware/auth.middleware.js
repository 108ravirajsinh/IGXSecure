/*
 * IGXSecure — Auth Middleware
 * Protects routes that require an authenticated Instagram session
 * Auto-refreshes token when less than 7 days remain
 */

const { decryptToken, encryptToken, refreshInstagramToken } = require('../utils/token');

const SEVEN_DAYS_MS   = 7 * 24 * 60 * 60 * 1000;
const refreshingUsers = new Set();

async function requireAuth(req, res, next) {
  try {
    if (!req.session?.encryptedToken) {
      return res.status(401).json({
        error:    'Unauthorized',
        message:  'Please connect your Instagram account first',
        loginUrl: '/igxsecure/api/auth/login'
      });
    }

    const expiresAt = req.session.tokenExpiresAt;
    if (expiresAt && Date.now() > expiresAt) {
      req.session.destroy();
      return res.status(401).json({
        error:    'Session expired',
        message:  'Your token has expired. Please log in again.',
        loginUrl: '/igxsecure/api/auth/login'
      });
    }

    const plainToken    = decryptToken(req.session.encryptedToken);
    const timeRemaining = expiresAt ? expiresAt - Date.now() : Infinity;
    const userId        = req.session.userId;

    // ── Auto-refresh with lock (prevents race condition) ──
    if (timeRemaining < SEVEN_DAYS_MS && !refreshingUsers.has(userId)) {
      refreshingUsers.add(userId);
      try {
        console.log(`[AUTH] Token expiring soon (${Math.floor(timeRemaining / 86400000)}d left) — refreshing…`);
        const { access_token, expires_in } = await refreshInstagramToken(plainToken);
        req.session.encryptedToken = encryptToken(access_token);
        req.session.tokenExpiresAt = Date.now() + (expires_in * 1000);
        req.accessToken            = access_token;
        console.log(`[AUTH] Token refreshed — new expiry: ${new Date(req.session.tokenExpiresAt).toISOString()}`);
      } catch (refreshErr) {
        console.warn('[AUTH] Token refresh failed:', refreshErr.message);
        req.accessToken = plainToken;
      } finally {
        refreshingUsers.delete(userId);
      }
    } else {
      req.accessToken = plainToken;
    }

    next();

  } catch (err) {
    console.error('[AUTH] Middleware error:', err.message);
    req.session?.destroy();
    return res.status(401).json({
      error:    'Session invalid',
      message:  'Your session has expired. Please log in again.',
      loginUrl: '/igxsecure/api/auth/login'
    });
  }
}

module.exports = { requireAuth };