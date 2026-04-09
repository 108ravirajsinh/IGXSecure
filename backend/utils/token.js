/*
 * IGXSecure — AES-256 Token Encryption Utility
 * Tokens are never stored or sent in plain text
 */

const crypto = require('crypto');
const axios  = require('axios');

const ALGORITHM = 'aes-256-gcm';

// TOKEN_SECRET must be exactly 32 bytes. Fail fast if misconfigured.
const raw = process.env.TOKEN_SECRET || '';

let SECRET_KEY;
if (raw.length === 64 && /^[0-9a-fA-F]+$/.test(raw)) {
  // 64-char hex string → decoded to 32 bytes (most common from crypto.randomBytes)
  SECRET_KEY = Buffer.from(raw, 'hex');
} else if (raw.length === 32) {
  // Exactly 32 plain characters → 32 bytes UTF-8
  SECRET_KEY = Buffer.from(raw, 'utf8');
} else {
  throw new Error(
    'TOKEN_SECRET must be either:\n' +
    '  • Exactly 32 plain characters, OR\n' +
    '  • A 64-character hex string (output of crypto.randomBytes(32).toString("hex"))\n' +
    `  Current length: ${raw.length}`
  );
}

/**
 * Encrypt a plain text token
 * Returns: iv:authTag:encryptedData (all hex)
 */
function encryptToken(plainText) {
  const iv        = crypto.randomBytes(16);
  const cipher    = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, 'utf8'),
    cipher.final()
  ]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

/**
 * Decrypt an encrypted token string
 * Returns: plain text token
 */
function decryptToken(encryptedText) {
  const [ivHex, authTagHex, encryptedHex] = encryptedText.split(':');
  const iv        = Buffer.from(ivHex, 'hex');
  const authTag   = Buffer.from(authTagHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ]).toString('utf8');
}

/**
 * Refresh a long-lived Instagram token
 * Instagram allows refresh anytime while token is still valid
 * Returns: { access_token, expires_in } or throws on failure
 */
async function refreshInstagramToken(plainToken) {
  const response = await axios.get('https://graph.instagram.com/refresh_access_token', {
    params: {
      grant_type:   'ig_refresh_token',
      access_token: plainToken,
    },
  });
  return {
    access_token: response.data.access_token,
    expires_in:   response.data.expires_in, // seconds
  };
}

module.exports = { encryptToken, decryptToken, refreshInstagramToken };