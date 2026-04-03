const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

router.get('/feed', async (req, res) => {
  try {
    const token = process.env.META_USER_TOKEN;

    const response = await axios.get('https://graph.instagram.com/me/media', {
      params: {
        fields: 'id,caption,media_type,media_url,username,timestamp',
        access_token: token,
      },
    });

    res.json({ success: true, data: response.data.data });

  } catch (error) {
    console.error('Instagram feed error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch Instagram feed' });
  }
});

module.exports = router;