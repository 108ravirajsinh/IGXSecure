/*
 * IGXSecure — Token Utility (stub)
 * Phase 4: AES-256 encrypt/decrypt for Instagram access tokens
 * Not active yet — structure ready for OAuth integration
 */

const crypto = require('crypto');

const ALGORITHM  = 'aes-256-cbc';
const SECRET_KEY = process.env.TOKEN_SECRET;  // must be 32 chars in .env
const IV_LENGTH  = 16;

function encrypt(text) {
  if (!SECRET_KEY) throw new Error('TOKEN_SECRET not set in environment');
  const iv     = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  if (!SECRET_KEY) throw new Error('TOKEN_SECRET not set in environment');
  const [ivHex, encryptedHex] = text.split(':');
  const iv        = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher  = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString();
}

module.exports = { encrypt, decrypt };