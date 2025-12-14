import { defineConfig } from 'cypress';
import * as crypto from 'crypto';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Task to hash cookie names using Node.js crypto
      on('task', {
        hashCookieName({ name, appKey }: { name: string; appKey: string }) {
          return crypto
            .createHash('sha256')
            .update(name + appKey)
            .digest('hex')
            .substring(0, 16);
        },
      });
      return config;
    },
    baseUrl: 'https://sidifa.my.id',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
  },
  env: {
    API_URL: 'https://api.sidifa.my.id/api/v1',
    FRONTEND_URL: 'https://sidifa.my.id',
    APP_KEY: process.env.APP_KEY || 'defaultKey', // Used for hashing cookie names
  },
});
