import * as crypto from 'crypto';

if (!process.env.APP_KEY) {
  throw new Error('APP_KEY environment variable is not defined');
}

const APP_KEY = crypto
  .createHash('sha256')
  .update(process.env.APP_KEY)
  .digest();
const ALGORITHM = 'aes-256-cbc';

export function encryptToken(plainText: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, APP_KEY, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const ivBase64 = iv.toString('base64');

  // Generate MAC
  const mac = crypto
    .createHmac('sha256', APP_KEY)
    .update(ivBase64 + encrypted)
    .digest('hex');

  const payload = {
    iv: ivBase64,
    value: encrypted,
    mac: mac,
    tag: '', // not used for CBC mode
  };

  // Laravel encodes it as base64 of JSON string
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}
