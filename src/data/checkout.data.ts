/**
 * Test data for checkout flows
 */
export interface CheckoutCustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const VALID_CUSTOMER: CheckoutCustomerInfo = {
  firstName: 'Alberto',
  lastName: 'Martín',
  postalCode: '41001',
};

export const CHECKOUT_ERROR_MESSAGES = {
  FIRST_NAME_REQUIRED: 'Error: First Name is required',
  LAST_NAME_REQUIRED: 'Error: Last Name is required',
  POSTAL_CODE_REQUIRED: 'Error: Postal Code is required',
} as const;

export const INVENTORY_ITEMS = {
  BACKPACK: {
    name: 'Sauce Labs Backpack',
    price: 29.99,
    dataTestAdd: 'add-to-cart-sauce-labs-backpack',
    dataTestRemove: 'remove-sauce-labs-backpack',
  },
  BIKE_LIGHT: {
    name: 'Sauce Labs Bike Light',
    price: 9.99,
    dataTestAdd: 'add-to-cart-sauce-labs-bike-light',
    dataTestRemove: 'remove-sauce-labs-bike-light',
  },
  BOLT_TSHIRT: {
    name: 'Sauce Labs Bolt T-Shirt',
    price: 15.99,
    dataTestAdd: 'add-to-cart-sauce-labs-bolt-t-shirt',
    dataTestRemove: 'remove-sauce-labs-bolt-t-shirt',
  },
  FLEECE_JACKET: {
    name: 'Sauce Labs Fleece Jacket',
    price: 49.99,
    dataTestAdd: 'add-to-cart-sauce-labs-fleece-jacket',
    dataTestRemove: 'remove-sauce-labs-fleece-jacket',
  },
  ONESIE: {
    name: 'Sauce Labs Onesie',
    price: 7.99,
    dataTestAdd: 'add-to-cart-sauce-labs-onesie',
    dataTestRemove: 'remove-sauce-labs-onesie',
  },
  RED_TSHIRT: {
    name: 'Test.allTheThings() T-Shirt (Red)',
    price: 15.99,
    dataTestAdd: 'add-to-cart-test.allthethings()-t-shirt-(red)',
    dataTestRemove: 'remove-test.allthethings()-t-shirt-(red)',
  },
} as const;
