/*
 * IGXSecure — Auth Middleware (stub)
 * Phase 4: validates session token before protected routes
 * Not active yet — placeholder for OAuth integration
 */

function requireAuth(req, res, next) {
  // TODO Phase 4: validate encrypted session token
  // const token = req.headers['authorization'];
  // if (!token) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

module.exports = { requireAuth };