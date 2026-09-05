import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './base.api.js';
import { RESTFUL_BOOKER_CONFIG } from '../config/restful-booker.config.js';
import { BookingPayload } from '../data/booking.data.js';

/**
 * Client for Restful Booker Booking CRUD API endpoints
 */
export class BookingApiClient extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Healthcheck ping
   */
  async ping(): Promise<APIResponse> {
    return await this.get(RESTFUL_BOOKER_CONFIG.API_ENDPOINTS.PING);
  }

  /**
   * Retrieves list of all booking IDs
   */
  async getBookingIds(params?: Record<string, string>): Promise<APIResponse> {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return await this.get(`${RESTFUL_BOOKER_CONFIG.API_ENDPOINTS.BOOKING}${query}`);
  }

  /**
   * Retrieves single booking by numeric ID
   */
  async getBookingById(bookingId: number): Promise<APIResponse> {
    return await this.get(`${RESTFUL_BOOKER_CONFIG.API_ENDPOINTS.BOOKING}/${bookingId}`);
  }

  /**
   * Creates new booking via POST
   */
  async createBooking(payload: BookingPayload): Promise<APIResponse> {
    return await this.post(RESTFUL_BOOKER_CONFIG.API_ENDPOINTS.BOOKING, payload);
  }

  /**
   * Updates an existing booking by ID (requires token)
   */
  async updateBooking(bookingId: number, payload: BookingPayload, token: string): Promise<APIResponse> {
    return await this.request.put(`${this.baseUrl}${RESTFUL_BOOKER_CONFIG.API_ENDPOINTS.BOOKING}/${bookingId}`, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: `token=${token}`,
      },
    });
  }

  /**
   * Deletes a booking by ID (requires token)
   */
  async deleteBooking(bookingId: number, token: string): Promise<APIResponse> {
    return await this.delete(`${RESTFUL_BOOKER_CONFIG.API_ENDPOINTS.BOOKING}/${bookingId}`, {
      Cookie: `token=${token}`,
    });
  }
}
