import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './base.api.js';
import { RESTFUL_BOOKER_CONFIG } from '../config/restful-booker.config.js';

export interface AuthLoginResponse {
  token?: string;
  reason?: string;
}

/**
 * Client for Restful Booker Authentication endpoints
 */
export class AuthApiClient extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Performs admin login and returns raw APIResponse
   */
  async login(
    username = RESTFUL_BOOKER_CONFIG.ADMIN_CREDENTIALS.username,
    password = RESTFUL_BOOKER_CONFIG.ADMIN_CREDENTIALS.password,
  ): Promise<APIResponse> {
    return await this.post(RESTFUL_BOOKER_CONFIG.API_ENDPOINTS.AUTH, {
      username,
      password,
    });
  }

  /**
   * Retrieves auth token string directly
   */
  async getAuthToken(): Promise<string> {
    const response = await this.login();
    const body = (await response.json()) as AuthLoginResponse;
    return body.token || '';
  }
}
