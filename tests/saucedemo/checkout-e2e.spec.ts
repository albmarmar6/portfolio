import { test, expect } from '../../src/fixtures/test.fixture.js';
import { INVENTORY_ITEMS, VALID_CUSTOMER, CHECKOUT_ERROR_MESSAGES } from '../../src/data/checkout.data.js';

test.describe('Checkout & E2E Purchase Flow Suite @e2e', () => {
  test('should complete end-to-end purchase flow with accurate subtotal, tax and total', async ({
    loggedInAsStandardUser: inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    // 1. Add products to cart
    await inventoryPage.addItemByDataTest(INVENTORY_ITEMS.BACKPACK.dataTestAdd);
    await inventoryPage.addItemByDataTest(INVENTORY_ITEMS.BOLT_TSHIRT.dataTestAdd);
    expect(await inventoryPage.getCartItemCount()).toBe(2);

    // 2. Navigate to cart
    await inventoryPage.openCart();
    await expect(cartPage.title).toHaveText('Your Cart');
    await expect(cartPage.cartItems).toHaveCount(2);

    // 3. Proceed to Checkout Step 1 (Info)
    await cartPage.proceedToCheckout();
    await expect(checkoutInfoPage.title).toHaveText('Checkout: Your Information');

    // 4. Fill customer details and continue
    await checkoutInfoPage.submitInformation(VALID_CUSTOMER);

    // 5. Checkout Step 2 (Overview)
    await expect(checkoutOverviewPage.title).toHaveText('Checkout: Overview');
    await expect(checkoutOverviewPage.cartItems).toHaveCount(2);

    // Mathematical verification of prices
    const expectedSubtotal = INVENTORY_ITEMS.BACKPACK.price + INVENTORY_ITEMS.BOLT_TSHIRT.price;
    const actualSubtotal = await checkoutOverviewPage.getSubtotal();
    expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2);

    const actualTax = await checkoutOverviewPage.getTax();
    const actualTotal = await checkoutOverviewPage.getTotal();
    expect(actualTotal).toBeCloseTo(actualSubtotal + actualTax, 2);

    // 6. Complete purchase
    await checkoutOverviewPage.finishOrder();

    // 7. Order Confirmation
    await expect(checkoutCompletePage.title).toHaveText('Checkout: Complete!');
    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
    await expect(checkoutCompletePage.ponyExpressImage).toBeVisible();

    // 8. Return to Home
    await checkoutCompletePage.backToHome();
    await expect(inventoryPage.title).toHaveText('Products');
    expect(await inventoryPage.getCartItemCount()).toBe(0);
  });

  test('should validate required fields on customer information step', async ({
    loggedInAsStandardUser: inventoryPage,
    cartPage,
    checkoutInfoPage,
  }) => {
    await inventoryPage.addItemByDataTest(INVENTORY_ITEMS.BACKPACK.dataTestAdd);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();

    // 1. Empty first name
    await checkoutInfoPage.continue();
    expect(await checkoutInfoPage.getErrorMessage()).toBe(CHECKOUT_ERROR_MESSAGES.FIRST_NAME_REQUIRED);

    // 2. Empty last name
    await checkoutInfoPage.fillInformation({ firstName: 'Alberto' });
    await checkoutInfoPage.continue();
    expect(await checkoutInfoPage.getErrorMessage()).toBe(CHECKOUT_ERROR_MESSAGES.LAST_NAME_REQUIRED);

    // 3. Empty postal code
    await checkoutInfoPage.fillInformation({ lastName: 'Martín' });
    await checkoutInfoPage.continue();
    expect(await checkoutInfoPage.getErrorMessage()).toBe(CHECKOUT_ERROR_MESSAGES.POSTAL_CODE_REQUIRED);

    // 4. Cancel checkout flow
    await checkoutInfoPage.cancel();
    await expect(cartPage.title).toHaveText('Your Cart');
  });
});
