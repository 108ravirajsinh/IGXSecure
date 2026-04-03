const express = require('express');
const router  = express.Router();

// Phase 5 — Instagram Posts Feed
// GET /igxsecure/api/posts
router.get('/', (req, res) => {
  res.json({ message: 'Posts feed — coming in Phase 5' });
});

// GET /igxsecure/api/posts/media/:id
router.get('/media/:id', (req, res) => {
  res.json({ message: `Media item ${req.params.id} — coming in Phase 5` });
});

module.exports = router;