const express = require('express');
const router  = require('express').Router();
const axios   = require('axios');
const { requireAuth } = require('../middleware/auth.middleware');

// GET /igxsecure/api/feed
// Protected — requires Instagram login session
router.get('/feed', requireAuth, async (req, res) => {
  try {
    const token = req.accessToken; // ← from session via requireAuth middleware

    const response = await axios.get('https://graph.instagram.com/me/media', {
      params: {
        fields:       'id,caption,media_type,media_url,thumbnail_url,username,timestamp',
        access_token: token,
      },
    });

    res.json({ success: true, data: response.data.data });

  } catch (error) {
    console.error('[FEED] Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch Instagram feed' });
  }
});

module.exports = router;