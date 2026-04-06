const express          = require('express');
const router           = express.Router();
const { decryptToken } = require('../utils/token');

const IG_API = 'https://graph.facebook.com/v21.0';

const getToken = (req) =>
  req.session?.encryptedToken ? decryptToken(req.session.encryptedToken) : null;

// ── GET /igxsecure/api/messages ─────────────────────────────
router.get('/', async (req, res) => {
  const accessToken = getToken(req);
  const userId      = req.session?.userId;
  if (!accessToken || !userId)
    return res.status(401).json({ error: 'Not authenticated' });

  try {
    // Step 1 — Get Facebook Page connected to Instagram account
    const pagesRes = await fetch(
      `${IG_API}/me/accounts?access_token=${accessToken}`
    );
    const pagesData = await pagesRes.json();

    if (!pagesData.data || pagesData.data.length === 0) {
      return res.status(400).json({
        error: 'no_page',
        message: 'No Facebook Page connected to this Instagram account'
      });
    }

    const page            = pagesData.data[0];
    const pageId          = page.id;
    const pageAccessToken = page.access_token;

    // Step 2 — Fetch Instagram conversations via Page token
    const convRes = await fetch(
      `${IG_API}/${pageId}/conversations` +
      `?platform=instagram` +
      `&fields=id,participants,updated_time,messages{id,message,from,created_time}` +
      `&access_token=${pageAccessToken}`
    );
    const convData = await convRes.json();

    if (convData.error)
      return res.status(400).json({ error: convData.error.message });

    // Save pageId + pageToken in session for thread/reply use
    req.session.pageId          = pageId;
    req.session.pageAccessToken = pageAccessToken;

    res.json({ conversations: convData.data || [] });

  } catch (err) {
    console.error('[MESSAGES] Inbox error:', err);
    res.status(500).json({ error: 'Failed to fetch inbox' });
  }
});

// ── GET /igxsecure/api/messages/:threadId ───────────────────
router.get('/:threadId', async (req, res) => {
  const accessToken     = getToken(req);
  const pageAccessToken = req.session?.pageAccessToken;
  const pageId          = req.session?.pageId;
  const { threadId }    = req.params;

  if (!accessToken)
    return res.status(401).json({ error: 'Not authenticated' });

  const token = pageAccessToken || accessToken;

  try {
    const response = await fetch(
      `${IG_API}/${threadId}` +
      `?fields=messages{id,message,from,created_time},participants` +
      `&access_token=${token}`
    );
    const data = await response.json();

    if (data.error) return res.status(400).json({ error: data.error.message });

    res.json({
      threadId,
      participants: data.participants?.data || [],
      messages:     data.messages?.data    || [],
    });
  } catch (err) {
    console.error('[MESSAGES] Thread error:', err);
    res.status(500).json({ error: 'Failed to fetch thread' });
  }
});

// ── POST /igxsecure/api/messages/:threadId/reply ────────────
router.post('/:threadId/reply', async (req, res) => {
  const pageAccessToken = req.session?.pageAccessToken;
  const pageId          = req.session?.pageId;
  const { threadId }    = req.params;
  const { message }     = req.body;

  if (!pageAccessToken || !pageId)
    return res.status(401).json({ error: 'Page token not available — reload inbox first' });
  if (!message?.trim())
    return res.status(400).json({ error: 'Message cannot be empty' });

  try {
    const response = await fetch(`${IG_API}/${pageId}/messages`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient:    { thread_key: threadId },
        message:      { text: message.trim() },
        access_token: pageAccessToken,
      }),
    });
    const data = await response.json();
    if (data.error) return res.status(400).json({ error: data.error.message });
    res.json({ success: true, messageId: data.message_id });
  } catch (err) {
    console.error('[MESSAGES] Reply error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;