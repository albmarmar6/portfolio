/**
 * Data contracts and generator factories for Restful Booker API
 */

export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface BookingPayload {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export interface BookingResponse {
  bookingid: number;
  booking: BookingPayload;
}

/**
 * Generates dynamic test booking payload with unique timestamps
 */
export function createBookingPayload(override?: Partial<BookingPayload>): BookingPayload {
  const timestamp = Date.now();
  return {
    firstname: `Alberto_${timestamp}`,
    lastname: 'Martín',
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-11-10',
      checkout: '2026-11-15',
    },
    additionalneeds: 'Breakfast & High Floor',
    ...override,
  };
}
