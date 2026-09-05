/**
 * Environment and global test configuration
 */
export const ENV = {
  BASE_URL: process.env.BASE_URL || 'https://www.saucedemo.com',
  DEFAULT_TIMEOUT: 10000,
} as const;
