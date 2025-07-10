import * as crypto from 'crypto';

export function decryptToken(encryptedBase64: string): string {
  if (!process.env.APP_KEY) {
    throw new Error('APP_KEY environment variable is not defined');
  }

  const APP_KEY = crypto
    .createHash('sha256')
    .update(process.env.APP_KEY)
    .digest(); // ✅ FIXED
  const ALGORITHM = 'aes-256-cbc';

  const decoded = JSON.parse(
    Buffer.from(encryptedBase64, 'base64').toString('utf8'),
  );
  const { iv, value, mac } = decoded;

  // Cek MAC
  const calcMac = crypto
    .createHmac('sha256', APP_KEY) // ✅ now using correct binary key
    .update(iv + value)
    .digest('hex');

  if (calcMac !== mac) {
    throw new Error('Invalid MAC');
  }

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    APP_KEY,
    Buffer.from(iv, 'base64'),
  );

  let decrypted = decipher.update(value, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
