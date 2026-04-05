/*
 * IGXSecure — Stories Route
 * GET /igxsecure/api/stories
 */

const express        = require('express');
const router         = express.Router();
const axios          = require('axios');
const { requireAuth } = require('../middleware/auth.middleware');

router.get('/', requireAuth, async (req, res) => {
  try {
    const token = req.accessToken;

    const response = await axios.get('https://graph.instagram.com/me/stories', {
      params: {
        fields:       'id,media_type,media_url,thumbnail_url,timestamp',
        access_token: token,
      },
    });

    const stories = response.data.data || [];
    res.json({ success: true, data: stories });

  } catch (err) {
    const apiError = err.response?.data || err.message;
    console.error('[STORIES] Error:', apiError);

    // Instagram returns empty gracefully when no stories are live
    if (err.response?.status === 400) {
      return res.json({ success: true, data: [] });
    }

    res.status(500).json({ success: false, error: 'Failed to fetch stories' });
  }
});

module.exports = router;