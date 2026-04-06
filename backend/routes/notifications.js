const express          = require('express');
const router           = express.Router();
const { decryptToken } = require('../utils/token');

const IG_API = 'https://graph.instagram.com/v21.0';

const getToken = (req) =>
  req.session?.encryptedToken ? decryptToken(req.session.encryptedToken) : null;

// GET /igxsecure/api/notifications
router.get('/', async (req, res) => {
  const accessToken = getToken(req);
  const userId      = req.session?.userId;
  if (!accessToken || !userId)
    return res.status(401).json({ error: 'Not authenticated' });

  try {
    // Fetch recent media
    const mediaRes = await fetch(
      `${IG_API}/me/media` +
      `?fields=id,caption,media_type,thumbnail_url,media_url,timestamp,` +
      `like_count,comments_count,` +
      `comments{id,text,username,timestamp}` +
      `&limit=10` +
      `&access_token=${accessToken}`
    );
    const mediaData = await mediaRes.json();
    if (mediaData.error) return res.status(400).json({ error: mediaData.error.message });

    const notifications = [];

    (mediaData.data || []).forEach(post => {
      // ── Like notifications ──
      if (post.like_count > 0) {
        notifications.push({
          id:        `like-${post.id}`,
          type:      'like',
          postId:    post.id,
          postThumb: post.thumbnail_url || post.media_url,
          count:     post.like_count,
          caption:   post.caption?.slice(0, 60) || '',
          timestamp: post.timestamp,
          text:      `${post.like_count} ${post.like_count === 1 ? 'like' : 'likes'}`,
        });
      }

      // ── Comment notifications ──
      const comments = post.comments?.data || [];
      comments.forEach(comment => {
        notifications.push({
          id:        `comment-${comment.id}`,
          type:      'comment',
          postId:    post.id,
          postThumb: post.thumbnail_url || post.media_url,
          username:  comment.username,
          text:      comment.text,
          caption:   post.caption?.slice(0, 60) || '',
          timestamp: comment.timestamp,
        });
      });
    });

    // Sort newest first
    notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ notifications, total: notifications.length });

  } catch (err) {
    console.error('[NOTIFICATIONS] Error:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

module.exports = router;