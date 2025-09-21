import { doubleCsrf } from 'csrf-csrf';

const doubleCsrfOptions = {
  getSecret: () => process.env.CSRF_SECRET || 'a-very-secret-key',
  getSessionIdentifier: (req) => {
    // Pakai sesuatu yang unik per user (disarankan)
    return req.ip || 'unknown-ip';
  },
  cookieName: '_csrf',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'strict' as const, // 'lax' atau 'strict' atau 'none'
    secure: false,
  },
  size: 64,
  getTokenFromRequest: (req) => req.headers['x-csrf-token'],
};

export const { doubleCsrfProtection, generateCsrfToken } =
  doubleCsrf(doubleCsrfOptions);
