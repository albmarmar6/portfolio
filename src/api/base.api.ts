import { APIRequestContext, APIResponse } from '@playwright/test';
import { RESTFUL_BOOKER_CONFIG } from '../config/restful-booker.config.js';

/**
 * Base API Client encapsulating HTTP methods and headers
 */
export abstract class BaseApiClient {
  protected readonly request: APIRequestContext;
  protected readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl = RESTFUL_BOOKER_CONFIG.BASE_URL) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  /**
   * Executes GET request against target endpoint
   */
  protected async get(endpoint: string, headers?: Record<string, string>): Promise<APIResponse> {
    return await this.request.get(`${this.baseUrl}${endpoint}`, {
      headers: {
        Accept: 'application/json',
        ...headers,
      },
    });
  }

  /**
   * Executes POST request with JSON payload
   */
  protected async post(endpoint: string, data: unknown, headers?: Record<string, string>): Promise<APIResponse> {
    return await this.request.post(`${this.baseUrl}${endpoint}`, {
      data,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
    });
  }

  /**
   * Executes DELETE request
   */
  protected async delete(endpoint: string, headers?: Record<string, string>): Promise<APIResponse> {
    return await this.request.delete(`${this.baseUrl}${endpoint}`, {
      headers: {
        Accept: 'application/json',
        ...headers,
      },
    });
  }
}
