/*
 * IGXSecure — Auth Middleware
 * Protects routes that require an authenticated Instagram session
 * Auto-refreshes token when less than 7 days remain
 */

const { decryptToken, encryptToken, refreshInstagramToken } = require('../utils/token');

const SEVEN_DAYS_MS = 999 * 24 * 60 * 60 * 1000;

async function requireAuth(req, res, next) {
  try {
    // ── Check session exists ──
    if (!req.session?.encryptedToken) {
      return res.status(401).json({
        error:    'Unauthorized',
        message:  'Please connect your Instagram account first',
        loginUrl: '/igxsecure/api/auth/login'
      });
    }

    // ── Check token not expired ──
    const expiresAt = req.session.tokenExpiresAt;
    if (expiresAt && Date.now() > expiresAt) {
      req.session.destroy();
      return res.status(401).json({
        error:    'Session expired',
        message:  'Your token has expired. Please log in again.',
        loginUrl: '/igxsecure/api/auth/login'
      });
    }

    // ── Decrypt token ──
    const plainToken = decryptToken(req.session.encryptedToken);

    // ── Auto-refresh if less than 7 days remain ──
    const timeRemaining = expiresAt ? expiresAt - Date.now() : Infinity;
    if (timeRemaining < SEVEN_DAYS_MS) {
      try {
        console.log(`[AUTH] Token expiring soon (${Math.floor(timeRemaining / 86400000)}d left) — refreshing…`);

        const { access_token, expires_in } = await refreshInstagramToken(plainToken);

        // Update session with new encrypted token + expiry
        req.session.encryptedToken  = encryptToken(access_token);
        req.session.tokenExpiresAt  = Date.now() + (expires_in * 1000);
        req.accessToken             = access_token;

        console.log(`[AUTH] Token refreshed — new expiry: ${new Date(req.session.tokenExpiresAt).toISOString()}`);
      } catch (refreshErr) {
        // Refresh failed — still continue with old token, log the warning
        console.warn('[AUTH] Token refresh failed (will retry next request):', refreshErr.message);
        req.accessToken = plainToken;
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