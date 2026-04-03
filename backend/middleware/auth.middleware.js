/*
 * IGXSecure — Auth Middleware
 * Protects routes that require an authenticated Instagram session
 */

const { decryptToken } = require('../utils/token');

function requireAuth(req, res, next) {
  try {
    // Check session exists
    if (!req.session || !req.session.encryptedToken) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Please connect your Instagram account first',
        loginUrl: '/igxsecure/api/auth/login'
      });
    }

    // Decrypt and attach token to request
    req.accessToken = decryptToken(req.session.encryptedToken);
    next();

  } catch (err) {
    console.error('[AUTH] Token decryption failed:', err.message);
    req.session.destroy();
    return res.status(401).json({
      error: 'Session invalid',
      message: 'Your session has expired. Please log in again.',
      loginUrl: '/igxsecure/api/auth/login'
    });
  }
}

module.exports = { requireAuth };