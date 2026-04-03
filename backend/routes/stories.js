const express = require('express');
const router  = express.Router();

// Phase 5 — Instagram Stories
// GET /igxsecure/api/stories
router.get('/', (req, res) => {
  res.json({ message: 'Stories — coming in Phase 5' });
});

module.exports = router;