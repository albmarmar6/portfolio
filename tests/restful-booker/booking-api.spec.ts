import { test, expect } from '@playwright/test';
import { AuthApiClient } from '../../src/api/auth.api.js';
import { BookingApiClient } from '../../src/api/booking.api.js';
import { createBookingPayload } from '../../src/data/booking.data.js';

test.describe('Restful Booker - REST API Test Suite @api', () => {
  let authClient: AuthApiClient;
  let bookingClient: BookingApiClient;

  test.beforeEach(async ({ request }) => {
    authClient = new AuthApiClient(request);
    bookingClient = new BookingApiClient(request);
  });

  test('GET /ping - should perform API health check and return 201 Created', async () => {
    await test.step('Send health check ping', async () => {
      const response = await bookingClient.ping();
      expect(response.status()).toBe(201);
    });
  });

  test('POST /auth - should authenticate admin and return 200 OK with session token', async () => {
    await test.step('Submit valid admin credentials', async () => {
      const response = await authClient.login();
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty('token');
      expect(typeof body.token).toBe('string');
      expect(body.token.length).toBeGreaterThan(5);
    });
  });

  test('POST /auth [Negative] - should reject invalid credentials', async () => {
    await test.step('Submit bad password for admin account', async () => {
      const response = await authClient.login('admin', 'wrong_password_123');
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.reason).toBe('Bad credentials');
    });
  });

  test('GET /booking - should retrieve list of existing booking IDs', async () => {
    await test.step('Fetch all bookings from API', async () => {
      const response = await bookingClient.getBookingIds();
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(Array.isArray(body)).toBeTruthy();
      expect(body.length).toBeGreaterThan(0);
      expect(body[0]).toHaveProperty('bookingid');
    });
  });

  test('POST /booking, GET /booking/{id}, PUT and DELETE - Complete Booking Lifecycle', async () => {
    const newBookingPayload = createBookingPayload();
    let bookingId: number;
    let token: string;

    await test.step('1. Obtain admin auth token for privileged operations', async () => {
      token = await authClient.getAuthToken();
      expect(token).toBeTruthy();
    });

    await test.step('2. Create new booking via POST /booking', async () => {
      const createResponse = await bookingClient.createBooking(newBookingPayload);
      expect(createResponse.status()).toBe(200);

      const createBody = await createResponse.json();
      expect(createBody).toHaveProperty('bookingid');
      bookingId = createBody.bookingid;
      expect(bookingId).toBeGreaterThan(0);
      expect(createBody.booking.firstname).toBe(newBookingPayload.firstname);
    });

    await test.step('3. Retrieve created booking by ID and verify data integrity', async () => {
      const getResponse = await bookingClient.getBookingById(bookingId);
      expect(getResponse.status()).toBe(200);

      const bookingData = await getResponse.json();
      expect(bookingData.firstname).toBe(newBookingPayload.firstname);
      expect(bookingData.lastname).toBe(newBookingPayload.lastname);
      expect(bookingData.totalprice).toBe(newBookingPayload.totalprice);
      expect(bookingData.bookingdates.checkin).toBe(newBookingPayload.bookingdates.checkin);
    });

    await test.step('4. Update booking details via PUT /booking/{id}', async () => {
      const updatedPayload = {
        ...newBookingPayload,
        totalprice: 250,
        additionalneeds: 'Late Checkout & Champagne',
      };
      const putResponse = await bookingClient.updateBooking(bookingId, updatedPayload, token);
      expect(putResponse.status()).toBe(200);

      const putBody = await putResponse.json();
      expect(putBody.totalprice).toBe(250);
      expect(putBody.additionalneeds).toBe('Late Checkout & Champagne');
    });

    await test.step('5. Delete booking via DELETE /booking/{id} and verify teardown', async () => {
      const deleteResponse = await bookingClient.deleteBooking(bookingId, token);
      expect(deleteResponse.status()).toBe(201);

      // Verify that subsequent GET returns 404 Not Found
      const verifyResponse = await bookingClient.getBookingById(bookingId);
      expect(verifyResponse.status()).toBe(404);
    });
  });
});
