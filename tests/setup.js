import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Timeout sudah dikonfigurasi di jest.config.js (testTimeout: 10000)

// Suppress console output during testing (optional)
// Uncomment jika ingin mematikan console logs saat testing
/*
global.console = {
  ...console,
  log: () => {},
  debug: () => {},
  info: () => {},
  warn: () => {},
  // Keep error for debugging
};
*/

