/**
 * Configuration and Endpoints for Restful Booker API
 */
export const RESTFUL_BOOKER_CONFIG = {
  BASE_URL: 'https://restful-booker.herokuapp.com',
  API_ENDPOINTS: {
    AUTH: '/auth',
    BOOKING: '/booking',
    PING: '/ping',
  },
  ADMIN_CREDENTIALS: {
    username: process.env.BOOKER_ADMIN_USERNAME || 'admin',
    password: process.env.BOOKER_ADMIN_PASSWORD || 'password123',
  },
} as const;
