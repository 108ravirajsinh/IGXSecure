const express = require('express');
const router  = express.Router();

// Phase 4 — OAuth Integration
// GET /igxsecure/api/auth/login
router.get('/login', (req, res) => {
  res.json({ message: 'OAuth login — coming in Phase 4' });
});

// GET /igxsecure/api/auth/callback
router.get('/callback', (req, res) => {
  res.json({ message: 'OAuth callback — coming in Phase 4' });
});

// GET /igxsecure/api/auth/status
router.get('/status', (req, res) => {
  res.json({ authenticated: false, message: 'Auth not yet implemented' });
});

// POST /igxsecure/api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout — coming in Phase 4' });
});

module.exports = router;