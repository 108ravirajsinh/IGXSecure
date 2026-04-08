const express = require('express');
const router  = express.Router();
const { decryptToken } = require('../utils/token');

// GET /igxsecure/api/stories
router.get('/', async (req, res) => {
  console.log('🔑 SESSION:', req.session);
  const accessToken = req.session?.encryptedToken
    ? decryptToken(req.session.encryptedToken)
    : null;
  if (!accessToken) return res.status(401).json({ error: 'Not authenticated' });
  const userId = req.session?.userId;

  try {
    const response = await fetch(
      `https://graph.instagram.com/v21.0/${userId}/stories` +
      `?fields=id,media_type,media_url,thumbnail_url,timestamp` +
      `&access_token=${accessToken}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Stories fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// GET /igxsecure/api/stories/insights
router.get('/insights', async (req, res) => {
  const accessToken = req.session?.encryptedToken
    ? decryptToken(req.session.encryptedToken)
    : null;
  if (!accessToken) return res.status(401).json({ error: 'Not authenticated' });

  const userId = req.session?.userId;

  try {
    // 1. Fetch all stories
    const storiesRes = await fetch(
      `https://graph.instagram.com/v21.0/${userId}/stories` +
      `?fields=id,media_type,media_url,thumbnail_url,timestamp` +
      `&access_token=${accessToken}`
    );
    const storiesData = await storiesRes.json();

    console.log('📸 RAW STORIES RESPONSE:', JSON.stringify(storiesData, null, 2));

    if (!storiesData.data || storiesData.data.length === 0) {
      return res.json({ stories: [] });
    }

    // 2. Fetch insights for each story in parallel
    const insightPromises = storiesData.data.map(async (story) => {
      try {
        const insightRes = await fetch(
          `https://graph.instagram.com/v21.0/${story.id}/insights` +
          `?metric=impressions,reach,replies` +
          `&access_token=${accessToken}`
        );
        const insightData = await insightRes.json();

        const metrics = {};
        if (insightData.data) {
          insightData.data.forEach(m => {
            metrics[m.name] = m.values?.[0]?.value ?? m.value ?? 0;
          });
        }

        return {
          ...story,
          insights: {
            impressions: metrics.impressions ?? 0,
            reach:       metrics.reach       ?? 0,
            replies:     metrics.replies     ?? 0,
          }
        };
      } catch {
        return { ...story, insights: { impressions: 0, reach: 0, replies: 0 } };
      }
    });

    const stories = await Promise.all(insightPromises);
    res.json({ stories });

  } catch (err) {
    console.error('Story insights error:', err);
    res.status(500).json({ error: 'Failed to fetch story insights' });
  }
});

module.exports = router;