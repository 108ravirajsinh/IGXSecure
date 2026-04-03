/*
 * IGXSecure — AES-256 Token Encryption Utility
 * Tokens are never stored or sent in plain text
 */

const crypto = require('crypto');

const ALGORITHM  = 'aes-256-gcm';
const SECRET_KEY = Buffer.from(
  (process.env.TOKEN_SECRET || '').padEnd(32, '0').slice(0, 32)
);

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

module.exports = { encryptToken, decryptToken };