const express = require('express');
const router  = express.Router();

// Phase 5 — Direct Messages (requires Meta Business Review)
// GET /igxsecure/api/messages
router.get('/', (req, res) => {
  res.json({
    message: 'DMs — pending Meta Business Review approval',
    status: 'blocked_pending_review'
  });
});

module.exports = router;