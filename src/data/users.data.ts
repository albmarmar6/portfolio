/**
 * Test user accounts for SauceDemo testing
 */
export const USERS = {
  STANDARD: {
    username: 'standard_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
  },
  LOCKED_OUT: {
    username: 'locked_out_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
  },
  PROBLEM: {
    username: 'problem_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
  },
  PERFORMANCE_GLITCH: {
    username: 'performance_glitch_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
  },
  ERROR_USER: {
    username: 'error_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
  },
  VISUAL_USER: {
    username: 'visual_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
  },
  INVALID: {
    username: 'invalid_user',
    password: 'wrong_password',
  },
} as const;

export const AUTH_ERROR_MESSAGES = {
  LOCKED_OUT: 'Epic sadface: Sorry, this user has been locked out.',
  INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
  USERNAME_REQUIRED: 'Epic sadface: Username is required',
  PASSWORD_REQUIRED: 'Epic sadface: Password is required',
} as const;
